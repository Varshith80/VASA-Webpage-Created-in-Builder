const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const webhookLogSchema = new mongoose.Schema(
  {
    // Webhook Reference
    webhookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webhook",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Event Information
    eventType: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true, // Unique identifier for the event
    },
    eventTimestamp: {
      type: Date,
      required: true,
    },

    // Request Details
    request: {
      url: {
        type: String,
        required: true,
      },
      method: {
        type: String,
        required: true,
      },
      headers: {
        type: Map,
        of: String,
      },
      payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      signature: String, // HMAC signature for verification
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },

    // Response Details
    response: {
      statusCode: Number,
      headers: {
        type: Map,
        of: String,
      },
      body: String,
      responseTime: Number, // in milliseconds
    },

    // Delivery Status
    status: {
      type: String,
      enum: ["pending", "success", "failed", "retry", "abandoned"],
      default: "pending",
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },

    // Error Information
    error: {
      message: String,
      code: String,
      stack: String,
      type: {
        type: String,
        enum: [
          "network_error",
          "timeout_error", 
          "http_error",
          "validation_error",
          "server_error",
          "rate_limit_error",
          "authentication_error",
          "unknown_error",
        ],
      },
    },

    // Retry Information
    retryHistory: [{
      attempt: Number,
      timestamp: Date,
      statusCode: Number,
      error: String,
      responseTime: Number,
    }],
    nextRetryAt: Date,
    lastAttemptAt: Date,

    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    // Processing Information
    processedAt: Date,
    acknowledgedAt: Date, // When the receiving endpoint acknowledged the webhook
    
    // Related Entity Information
    relatedEntity: {
      type: {
        type: String,
        enum: ["order", "product", "user", "payment", "shipment", "document"],
      },
      id: String,
      data: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Apply pagination plugin
webhookLogSchema.plugin(mongoosePaginate);

// Indexes for performance and querying
webhookLogSchema.index({ webhookId: 1, createdAt: -1 });
webhookLogSchema.index({ userId: 1, createdAt: -1 });
webhookLogSchema.index({ eventType: 1, createdAt: -1 });
webhookLogSchema.index({ status: 1, nextRetryAt: 1 });
webhookLogSchema.index({ eventId: 1 }, { unique: true });
webhookLogSchema.index({ "relatedEntity.type": 1, "relatedEntity.id": 1 });
webhookLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

// Virtual for final status
webhookLogSchema.virtual("isSuccess").get(function () {
  return this.status === "success";
});

// Virtual for is retryable
webhookLogSchema.virtual("isRetryable").get(function () {
  return (
    this.status === "failed" &&
    this.attempts < this.maxAttempts &&
    this.nextRetryAt &&
    this.nextRetryAt <= new Date()
  );
});

// Virtual for total response time including retries
webhookLogSchema.virtual("totalResponseTime").get(function () {
  let total = this.response?.responseTime || 0;
  if (this.retryHistory) {
    total += this.retryHistory.reduce((sum, retry) => sum + (retry.responseTime || 0), 0);
  }
  return total;
});

// Method to record attempt
webhookLogSchema.methods.recordAttempt = function (statusCode, responseBody, responseTime, error = null) {
  this.attempts += 1;
  this.lastAttemptAt = new Date();
  
  // Update response details
  this.response = {
    statusCode,
    body: responseBody,
    responseTime,
  };
  
  // Add to retry history
  this.retryHistory.push({
    attempt: this.attempts,
    timestamp: new Date(),
    statusCode,
    error: error?.message,
    responseTime,
  });
  
  // Determine status
  if (statusCode >= 200 && statusCode < 300) {
    this.status = "success";
    this.processedAt = new Date();
    this.nextRetryAt = null;
  } else if (this.attempts >= this.maxAttempts) {
    this.status = "abandoned";
    this.nextRetryAt = null;
  } else {
    this.status = "retry";
    // Calculate next retry time with exponential backoff
    const delay = Math.pow(2, this.attempts - 1) * 1000; // Start with 1 second
    this.nextRetryAt = new Date(Date.now() + delay);
  }
  
  // Update error information
  if (error) {
    this.error = {
      message: error.message,
      code: error.code,
      stack: error.stack,
      type: this.categorizeError(error, statusCode),
    };
  }
  
  return this.save();
};

// Method to categorize errors
webhookLogSchema.methods.categorizeError = function (error, statusCode) {
  if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
    return "network_error";
  }
  if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
    return "timeout_error";
  }
  if (statusCode === 429) {
    return "rate_limit_error";
  }
  if (statusCode === 401 || statusCode === 403) {
    return "authentication_error";
  }
  if (statusCode >= 400 && statusCode < 500) {
    return "http_error";
  }
  if (statusCode >= 500) {
    return "server_error";
  }
  return "unknown_error";
};

// Method to mark as acknowledged
webhookLogSchema.methods.acknowledge = function () {
  this.acknowledgedAt = new Date();
  return this.save();
};

// Static method to find logs ready for retry
webhookLogSchema.statics.findReadyForRetry = function () {
  return this.find({
    status: "retry",
    nextRetryAt: { $lte: new Date() },
  });
};

// Static method to get delivery statistics
webhookLogSchema.statics.getDeliveryStats = function (webhookId, timeframe = 24) {
  const since = new Date(Date.now() - timeframe * 60 * 60 * 1000);

  return this.aggregate([
    {
      $match: {
        webhookId: new mongoose.Types.ObjectId(webhookId),
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: null,
        totalDeliveries: { $sum: 1 },
        successfulDeliveries: {
          $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] },
        },
        failedDeliveries: {
          $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
        },
        abandonedDeliveries: {
          $sum: { $cond: [{ $eq: ["$status", "abandoned"] }, 1, 0] },
        },
        averageResponseTime: { $avg: "$response.responseTime" },
        maxResponseTime: { $max: "$response.responseTime" },
        minResponseTime: { $min: "$response.responseTime" },
      },
    },
  ]);
};

// Static method to get error breakdown
webhookLogSchema.statics.getErrorBreakdown = function (webhookId, timeframe = 24) {
  const since = new Date(Date.now() - timeframe * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        webhookId: mongoose.Types.ObjectId(webhookId),
        createdAt: { $gte: since },
        status: { $in: ["failed", "abandoned"] },
      },
    },
    {
      $group: {
        _id: "$error.type",
        count: { $sum: 1 },
        examples: { $push: "$error.message" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// Static method to cleanup old logs
webhookLogSchema.statics.cleanup = function (daysToKeep = 30) {
  const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    createdAt: { $lt: cutoff },
    status: { $in: ["success", "abandoned"] },
  });
};

// Pre-save middleware to set default values
webhookLogSchema.pre("save", function (next) {
  if (!this.eventId) {
    this.eventId = `${this.eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!this.eventTimestamp) {
    this.eventTimestamp = new Date();
  }
  
  next();
});

module.exports = mongoose.model("WebhookLog", webhookLogSchema);
