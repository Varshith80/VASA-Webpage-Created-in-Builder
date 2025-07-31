const mongoose = require("mongoose");
const WebhookEvents = require("../utils/webhookEvents");

const orderSchema = new mongoose.Schema(
  {
    // Order Identification
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // Parties Involved
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Product Information
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productSnapshot: {
      title: String,
      description: String,
      specifications: mongoose.Schema.Types.Mixed,
      images: [String],
      seller: {
        companyName: String,
        country: String,
      },
    },

    // Order Details
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },

    // Pricing Breakdown
    pricing: {
      subtotal: { type: Number, required: true },
      bulkDiscount: { type: Number, default: 0 },
      platformFee: { type: Number, required: true },
      paymentProcessingFee: { type: Number, required: true },
      shippingCost: { type: Number, default: 0 },
      insurance: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },

    // Multi-Step Payment System
    paymentPlan: {
      advance: {
        amount: { type: Number, required: true }, // 10%
        percentage: { type: Number, default: 10 },
        dueDate: Date,
        paidDate: Date,
        paymentId: String,
        status: {
          type: String,
          enum: ["pending", "paid", "failed", "refunded"],
          default: "pending",
        },
      },
      shipment: {
        amount: { type: Number, required: true }, // 50%
        percentage: { type: Number, default: 50 },
        dueDate: Date,
        paidDate: Date,
        paymentId: String,
        status: {
          type: String,
          enum: ["pending", "paid", "failed", "refunded"],
          default: "pending",
        },
      },
      delivery: {
        amount: { type: Number, required: true }, // 40%
        percentage: { type: Number, default: 40 },
        dueDate: Date,
        paidDate: Date,
        paymentId: String,
        status: {
          type: String,
          enum: ["pending", "paid", "failed", "refunded"],
          default: "pending",
        },
      },
    },

    // Order Status and Timeline
    status: {
      type: String,
      enum: [
        "pending_payment", // Waiting for advance payment
        "payment_confirmed", // Advance payment received
        "processing", // Order being prepared
        "ready_to_ship", // Ready for shipment
        "shipped", // Goods shipped
        "in_transit", // In transit
        "delivered", // Delivered
        "completed", // All payments completed
        "cancelled", // Order cancelled
        "disputed", // Under dispute
        "refunded", // Refunded
      ],
      default: "pending_payment",
    },

    // Shipping Information
    shipping: {
      method: String,
      carrier: String,
      trackingNumber: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
      shippingAddress: {
        name: String,
        company: String,
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
        phone: String,
      },
      packagingDetails: String,
      shippingTerms: String, // FOB, CIF, etc.
      port: String,
      insuranceValue: Number,
    },

    // Documents and Compliance
    documents: [
      {
        name: String,
        type: String, // invoice, packing_list, certificate, etc.
        url: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadDate: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false },
      },
    ],

    // Quality and Inspection
    qualityCheck: {
      required: { type: Boolean, default: true },
      inspectionDate: Date,
      inspectedBy: String,
      report: String,
      status: {
        type: String,
        enum: ["pending", "passed", "failed", "waived"],
        default: "pending",
      },
      notes: String,
    },

    // Communication and Notes
    notes: {
      buyer: String,
      seller: String,
      admin: String,
    },
    internalNotes: String,

    // Cancellation and Disputes
    cancellation: {
      requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      requestDate: Date,
      reason: String,
      status: {
        type: String,
        enum: ["none", "requested", "approved", "rejected"],
        default: "none",
      },
      cancellationFee: { type: Number, default: 0 },
      refundAmount: Number,
      processedDate: Date,
    },

    dispute: {
      isDisputed: { type: Boolean, default: false },
      disputeId: { type: mongoose.Schema.Types.ObjectId, ref: "Dispute" },
      raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      raisedDate: Date,
      status: String,
      resolution: String,
    },

    // Timeline and Audit
    timeline: [
      {
        event: String,
        description: String,
        date: { type: Date, default: Date.now },
        actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        metadata: mongoose.Schema.Types.Mixed,
      },
    ],

    // Important Dates
    orderDate: { type: Date, default: Date.now },
    expectedDeliveryDate: Date,
    deliveryConfirmationDate: Date,
    completionDate: Date,

    // Business Rules
    cancellationPolicy: {
      allowedUntil: Date, // 2 days from order
      cancellationFeePercentage: { type: Number, default: 10 },
    },

    // Analytics and Tracking
    source: String, // web, mobile, api
    userAgent: String,
    ipAddress: String,

    // Review and Rating
    reviewSubmitted: { type: Boolean, default: false },
    ratingSubmitted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ product: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "paymentPlan.advance.status": 1 });
orderSchema.index({ "shipping.trackingNumber": 1 });

// Virtual for total paid amount
orderSchema.virtual("totalPaid").get(function () {
  let total = 0;
  if (this.paymentPlan.advance.status === "paid")
    total += this.paymentPlan.advance.amount;
  if (this.paymentPlan.shipment.status === "paid")
    total += this.paymentPlan.shipment.amount;
  if (this.paymentPlan.delivery.status === "paid")
    total += this.paymentPlan.delivery.amount;
  return total;
});

// Virtual for remaining amount
orderSchema.virtual("remainingAmount").get(function () {
  return this.pricing.total - this.totalPaid;
});

// Virtual for next payment due
orderSchema.virtual("nextPaymentDue").get(function () {
  if (this.paymentPlan.advance.status === "pending") {
    return {
      type: "advance",
      amount: this.paymentPlan.advance.amount,
      dueDate: this.paymentPlan.advance.dueDate,
    };
  }
  if (
    this.paymentPlan.shipment.status === "pending" &&
    this.status === "shipped"
  ) {
    return {
      type: "shipment",
      amount: this.paymentPlan.shipment.amount,
      dueDate: this.paymentPlan.shipment.dueDate,
    };
  }
  if (
    this.paymentPlan.delivery.status === "pending" &&
    this.status === "delivered"
  ) {
    return {
      type: "delivery",
      amount: this.paymentPlan.delivery.amount,
      dueDate: this.paymentPlan.delivery.dueDate,
    };
  }
  return null;
});

// Virtual for payment progress
orderSchema.virtual("paymentProgress").get(function () {
  const totalPaid = this.totalPaid;
  const progress = (totalPaid / this.pricing.total) * 100;
  return Math.round(progress);
});

// Virtual for can cancel
orderSchema.virtual("canCancel").get(function () {
  const now = new Date();
  const allowedUntil = this.cancellationPolicy.allowedUntil;

  return (
    this.status === "pending_payment" ||
    (this.status === "payment_confirmed" && allowedUntil && now <= allowedUntil)
  );
});

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Count orders for today to generate sequence
    const today = new Date(year, date.getMonth(), date.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.constructor.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const sequence = String(count + 1).padStart(4, "0");
    this.orderNumber = `VASA${year}${month}${day}${sequence}`;
  }

  // Set cancellation policy
  if (!this.cancellationPolicy.allowedUntil) {
    const allowedUntil = new Date(this.orderDate);
    allowedUntil.setDate(allowedUntil.getDate() + 2); // 2 days to cancel
    this.cancellationPolicy.allowedUntil = allowedUntil;
  }

  next();
});

// Method to add timeline event
orderSchema.methods.addTimelineEvent = function (
  event,
  description,
  actor,
  metadata = {},
) {
  this.timeline.push({
    event,
    description,
    actor,
    metadata,
    date: new Date(),
  });
  return this.save();
};

// Method to process payment
orderSchema.methods.processPayment = async function (paymentType, paymentId, amount) {
  const payment = this.paymentPlan[paymentType];
  if (!payment) {
    throw new Error("Invalid payment type");
  }

  const previousStatus = this.status;
  payment.status = "paid";
  payment.paidDate = new Date();
  payment.paymentId = paymentId;

  // Update order status based on payment
  if (paymentType === "advance") {
    this.status = "payment_confirmed";
  } else if (
    paymentType === "delivery" &&
    this.paymentPlan.advance.status === "paid" &&
    this.paymentPlan.shipment.status === "paid"
  ) {
    this.status = "completed";
    this.completionDate = new Date();
  }

  this.addTimelineEvent(
    `payment_${paymentType}`,
    `${paymentType} payment of ${this.currency} ${amount} processed`,
    null,
    { paymentId, amount },
  );

  const result = await this.save();

  // Trigger webhook events
  try {
    // Populate required fields for webhook
    await this.populate([
      { path: 'buyer', select: 'firstName lastName email companyName role address' },
      { path: 'seller', select: 'firstName lastName email companyName role address' },
      { path: 'product', select: 'title category subcategory pricing inventory' }
    ]);

    // Emit payment completed event
    await WebhookEvents.emitPaymentCompleted(this, paymentType, {
      transactionId: paymentId,
      amount
    });

    // Emit order updated event if status changed
    if (previousStatus !== this.status) {
      await WebhookEvents.emitOrderUpdated(this, previousStatus, ['status', 'payment']);
    }

    // Emit order completed event if fully paid
    if (this.status === "completed") {
      await WebhookEvents.emitOrderCompleted(this);
    }
  } catch (webhookError) {
    console.error("Webhook error in processPayment:", webhookError);
  }

  return result;
};

// Method to update shipping status
orderSchema.methods.updateShippingStatus = async function (
  status,
  trackingNumber,
  estimatedDelivery,
) {
  const previousStatus = this.status;
  this.status = status;

  if (trackingNumber) {
    this.shipping.trackingNumber = trackingNumber;
  }

  if (estimatedDelivery) {
    this.shipping.estimatedDelivery = estimatedDelivery;
  }

  if (status === "delivered") {
    this.shipping.actualDelivery = new Date();
    this.deliveryConfirmationDate = new Date();

    // Set delivery payment due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 days to pay after delivery
    this.paymentPlan.delivery.dueDate = dueDate;
  }

  this.addTimelineEvent(
    "status_update",
    `Order status updated to ${status}`,
    null,
    { trackingNumber, estimatedDelivery },
  );

  const result = await this.save();

  // Trigger webhook events
  try {
    // Populate required fields for webhook
    await this.populate([
      { path: 'buyer', select: 'firstName lastName email companyName role address' },
      { path: 'seller', select: 'firstName lastName email companyName role address' },
      { path: 'product', select: 'title category subcategory pricing inventory' }
    ]);

    // Emit specific shipping events based on status
    switch (status) {
      case "ready_to_ship":
        await WebhookEvents.emitShippingReadyToShip(this);
        break;
      case "shipped":
        await WebhookEvents.emitShippingShipped(this, new Date());
        break;
      case "in_transit":
        await WebhookEvents.emitShippingInTransit(this);
        break;
      case "delivered":
        await WebhookEvents.emitShippingDelivered(this, this.shipping.actualDelivery);
        // Also emit payment pending for delivery payment
        await WebhookEvents.emitPaymentPending(this, "delivery", this.paymentPlan.delivery.dueDate);
        break;
    }

    // Emit order updated event
    await WebhookEvents.emitOrderUpdated(this, previousStatus, ['status', 'shipping']);
  } catch (webhookError) {
    console.error("Webhook error in updateShippingStatus:", webhookError);
  }

  return result;
};

// Method to cancel order
orderSchema.methods.cancelOrder = function (reason, requestedBy) {
  if (!this.canCancel) {
    throw new Error("Order cannot be cancelled at this time");
  }

  this.cancellation.requestedBy = requestedBy;
  this.cancellation.requestDate = new Date();
  this.cancellation.reason = reason;
  this.cancellation.status = "requested";

  // Calculate cancellation fee
  if (this.paymentPlan.advance.status === "paid") {
    this.cancellation.cancellationFee = this.paymentPlan.advance.amount;
    this.cancellation.refundAmount = 0;
  }

  this.status = "cancelled";

  this.addTimelineEvent(
    "cancellation_requested",
    `Order cancellation requested: ${reason}`,
    requestedBy,
  );

  return this.save();
};

// Static method to find orders by user
orderSchema.statics.findByUser = function (userId, role) {
  const query = role === "buyer" ? { buyer: userId } : { seller: userId };
  return this.find(query)
    .populate("buyer", "firstName lastName companyName")
    .populate("seller", "firstName lastName companyName")
    .populate("product", "title images category")
    .sort({ createdAt: -1 });
};

// Static method to get dashboard stats
orderSchema.statics.getDashboardStats = function (userId, role) {
  const query = role === "buyer" ? { buyer: userId } : { seller: userId };

  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        completedOrders: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        totalValue: { $sum: "$pricing.total" },
        averageOrderValue: { $avg: "$pricing.total" },
      },
    },
  ]);
};

module.exports = mongoose.model("Order", orderSchema);
