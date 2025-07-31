const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const webhookSchema = new mongoose.Schema(
  {
    // Owner and Configuration
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },

    // Webhook Details
    url: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "URL must be a valid HTTP/HTTPS URL",
      },
    },
    method: {
      type: String,
      enum: ["POST", "PUT", "PATCH"],
      default: "POST",
    },

    // Event Configuration
    events: [{
      type: String,
      enum: [
        // Order Events
        "order.created",
        "order.updated", 
        "order.cancelled",
        "order.completed",
        "order.disputed",
        
        // Payment Events
        "payment.pending",
        "payment.completed",
        "payment.failed",
        "payment.refunded",
        "payment.advance_paid",
        "payment.shipment_paid", 
        "payment.delivery_paid",
        
        // Shipping Events
        "shipping.ready_to_ship",
        "shipping.shipped",
        "shipping.in_transit",
        "shipping.delivered",
        "shipping.delayed",
        "shipping.returned",
        
        // Product Events
        "product.created",
        "product.updated",
        "product.deleted",
        "product.low_stock",
        "product.out_of_stock",
        
        // User/Account Events
        "user.verified",
        "user.suspended",
        "account.kyc_approved",
        "account.kyc_rejected",
        
        // Document Events
        "document.uploaded",
        "document.verified",
        "document.rejected",
        
        // Compliance Events
        "compliance.check_required",
        "compliance.check_passed",
        "compliance.check_failed",
        
        // System Events
        "system.maintenance",
        "system.alert"
      ],
      required: true,
    }],

    // Security and Authentication
    secret: {
      type: String,
      required: true,
    },
    headers: {
      type: Map,
      of: String,
      default: new Map(),
    },
    
    // Retry Configuration
    retryConfig: {
      maxRetries: {
        type: Number,
        default: 3,
        min: 0,
        max: 10,
      },
      retryDelay: {
        type: Number,
        default: 1000, // milliseconds
        min: 100,
        max: 30000,
      },
      backoffMultiplier: {
        type: Number,
        default: 2,
        min: 1,
        max: 10,
      },
      timeout: {
        type: Number,
        default: 30000, // 30 seconds
        min: 1000,
        max: 120000,
      },
    },

    // Status and Control
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    
    // Statistics
    stats: {
      totalDeliveries: {
        type: Number,
        default: 0,
      },
      successfulDeliveries: {
        type: Number,
        default: 0,
      },
      failedDeliveries: {
        type: Number,
        default: 0,
      },
      lastDeliveryAt: Date,
      lastSuccessAt: Date,
      lastFailureAt: Date,
      averageResponseTime: Number,
    },

    // Filtering and Conditions
    filters: {
      // Only trigger for specific order statuses
      orderStatuses: [String],
      // Only trigger for specific payment types
      paymentTypes: [String],
      // Only trigger for orders above certain amount
      minOrderValue: Number,
      // Only trigger for specific countries
      countries: [String],
      // Only trigger for specific product categories
      productCategories: [String],
    },

    // Rate Limiting
    rateLimit: {
      enabled: {
        type: Boolean,
        default: false,
      },
      maxRequestsPerMinute: {
        type: Number,
        default: 60,
        min: 1,
        max: 1000,
      },
      maxRequestsPerHour: {
        type: Number,
        default: 1000,
        min: 1,
        max: 10000,
      },
    },

    // Webhook Verification
    verification: {
      challenge: String,
      challengeResponse: String,
      verifiedAt: Date,
      lastPingAt: Date,
      isHealthy: {
        type: Boolean,
        default: true,
      },
      consecutiveFailures: {
        type: Number,
        default: 0,
      },
    },

    // Metadata
    tags: [String],
    environment: {
      type: String,
      enum: ["production", "staging", "development"],
      default: "production",
    },
    
    // Important Dates
    lastTriggeredAt: Date,
    disabledAt: Date,
    disabledReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Apply pagination plugin
webhookSchema.plugin(mongoosePaginate);

// Indexes for performance
webhookSchema.index({ userId: 1, isActive: 1 });
webhookSchema.index({ events: 1, isActive: 1 });
webhookSchema.index({ "verification.isHealthy": 1 });
webhookSchema.index({ lastTriggeredAt: -1 });

// Virtual for success rate
webhookSchema.virtual("successRate").get(function () {
  if (this.stats.totalDeliveries === 0) return 0;
  return ((this.stats.successfulDeliveries / this.stats.totalDeliveries) * 100).toFixed(2);
});

// Virtual for health status
webhookSchema.virtual("healthStatus").get(function () {
  if (!this.isActive) return "disabled";
  if (this.verification.consecutiveFailures >= 5) return "unhealthy";
  if (this.verification.consecutiveFailures >= 3) return "degraded";
  return "healthy";
});

// Pre-save middleware to generate secret if not provided
webhookSchema.pre("save", function (next) {
  if (!this.secret) {
    this.secret = require("crypto").randomBytes(32).toString("hex");
  }
  next();
});

// Method to update statistics
webhookSchema.methods.updateStats = function (success, responseTime) {
  this.stats.totalDeliveries += 1;
  this.stats.lastDeliveryAt = new Date();
  
  if (success) {
    this.stats.successfulDeliveries += 1;
    this.stats.lastSuccessAt = new Date();
    this.verification.consecutiveFailures = 0;
  } else {
    this.stats.failedDeliveries += 1;
    this.stats.lastFailureAt = new Date();
    this.verification.consecutiveFailures += 1;
  }
  
  if (responseTime) {
    // Calculate running average
    const totalResponseTime = (this.stats.averageResponseTime || 0) * (this.stats.totalDeliveries - 1);
    this.stats.averageResponseTime = (totalResponseTime + responseTime) / this.stats.totalDeliveries;
  }
  
  // Auto-disable webhook if too many consecutive failures
  if (this.verification.consecutiveFailures >= 10) {
    this.isActive = false;
    this.disabledAt = new Date();
    this.disabledReason = "Too many consecutive failures";
  }
  
  return this.save();
};

// Method to check if webhook should be triggered for event
webhookSchema.methods.shouldTrigger = function (eventType, eventData) {
  // Check if webhook is active and event is subscribed
  if (!this.isActive || !this.events.includes(eventType)) {
    return false;
  }
  
  // Check filters
  if (this.filters) {
    // Order status filter
    if (this.filters.orderStatuses && this.filters.orderStatuses.length > 0) {
      if (eventData.order && !this.filters.orderStatuses.includes(eventData.order.status)) {
        return false;
      }
    }
    
    // Payment type filter
    if (this.filters.paymentTypes && this.filters.paymentTypes.length > 0) {
      if (eventData.payment && !this.filters.paymentTypes.includes(eventData.payment.type)) {
        return false;
      }
    }
    
    // Minimum order value filter
    if (this.filters.minOrderValue) {
      if (eventData.order && eventData.order.total < this.filters.minOrderValue) {
        return false;
      }
    }
    
    // Country filter
    if (this.filters.countries && this.filters.countries.length > 0) {
      if (eventData.order && eventData.order.shippingCountry && 
          !this.filters.countries.includes(eventData.order.shippingCountry)) {
        return false;
      }
    }
    
    // Product category filter
    if (this.filters.productCategories && this.filters.productCategories.length > 0) {
      if (eventData.product && !this.filters.productCategories.includes(eventData.product.category)) {
        return false;
      }
    }
  }
  
  return true;
};

// Method to reset health status
webhookSchema.methods.resetHealth = function () {
  this.verification.consecutiveFailures = 0;
  this.verification.isHealthy = true;
  if (!this.isActive && this.disabledReason === "Too many consecutive failures") {
    this.isActive = true;
    this.disabledAt = null;
    this.disabledReason = null;
  }
  return this.save();
};

// Static method to find active webhooks for event
webhookSchema.statics.findActiveForEvent = function (eventType, userId = null) {
  const query = {
    isActive: true,
    events: eventType,
    "verification.isHealthy": true,
  };
  
  if (userId) {
    query.userId = userId;
  }
  
  return this.find(query);
};

// Static method to get webhook statistics
webhookSchema.statics.getStats = function (userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalWebhooks: { $sum: 1 },
        activeWebhooks: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
        totalDeliveries: { $sum: "$stats.totalDeliveries" },
        successfulDeliveries: { $sum: "$stats.successfulDeliveries" },
        failedDeliveries: { $sum: "$stats.failedDeliveries" },
        averageSuccessRate: { $avg: "$stats.successfulDeliveries" },
      },
    },
  ]);
};

module.exports = mongoose.model("Webhook", webhookSchema);
