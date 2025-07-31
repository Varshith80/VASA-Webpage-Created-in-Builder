const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { auth } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const Webhook = require("../models/Webhook");
const WebhookLog = require("../models/WebhookLog");

// Rate limiting for webhook endpoints
const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many webhook requests from this IP",
});

// Rate limiting for webhook creation/updates
const webhookModifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 webhook modifications per hour
  message: "Too many webhook modifications from this IP",
});

// Get all webhooks for authenticated user
router.get("/", auth, webhookLimiter, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      event,
      health,
      sort = "-createdAt",
    } = req.query;

    const query = { userId: req.user.id };

    // Apply filters
    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    if (event) {
      query.events = { $in: [event] };
    }

    if (health === "healthy") {
      query["verification.isHealthy"] = true;
      query["verification.consecutiveFailures"] = { $lt: 3 };
    } else if (health === "unhealthy") {
      query["verification.consecutiveFailures"] = { $gte: 3 };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: {
        path: "userId",
        select: "firstName lastName companyName",
      },
    };

    const webhooks = await Webhook.paginate(query, options);

    res.json({
      success: true,
      data: webhooks,
    });
  } catch (error) {
    console.error("Error fetching webhooks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch webhooks",
    });
  }
});

// Get webhook by ID
router.get("/:id", auth, webhookLimiter, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    res.json({
      success: true,
      data: webhook,
    });
  } catch (error) {
    console.error("Error fetching webhook:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch webhook",
    });
  }
});

// Create new webhook
router.post("/", auth, webhookModifyLimiter, async (req, res) => {
  try {
    const {
      name,
      description,
      url,
      method = "POST",
      events,
      headers = {},
      retryConfig,
      filters,
      rateLimit: rateLimitConfig,
      tags = [],
    } = req.body;

    // Validation
    if (!name || !url || !events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, URL, and at least one event are required",
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    // Check webhook limit per user (max 50 webhooks per user)
    const webhookCount = await Webhook.countDocuments({ userId: req.user.id });
    if (webhookCount >= 50) {
      return res.status(400).json({
        success: false,
        message: "Maximum webhook limit reached (50 per user)",
      });
    }

    // Generate webhook secret
    const secret = crypto.randomBytes(32).toString("hex");

    const webhook = new Webhook({
      userId: req.user.id,
      name,
      description,
      url,
      method,
      events,
      secret,
      headers: new Map(Object.entries(headers)),
      retryConfig: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        timeout: 30000,
        ...retryConfig,
      },
      filters,
      rateLimit: rateLimitConfig,
      tags,
    });

    await webhook.save();

    // Remove secret from response for security
    const webhookResponse = webhook.toObject();
    webhookResponse.secret = `${secret.substring(0, 8)}...`;

    res.status(201).json({
      success: true,
      data: webhookResponse,
      message: "Webhook created successfully",
    });
  } catch (error) {
    console.error("Error creating webhook:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create webhook",
    });
  }
});

// Update webhook
router.put("/:id", auth, webhookModifyLimiter, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    const {
      name,
      description,
      url,
      method,
      events,
      headers,
      retryConfig,
      filters,
      rateLimit: rateLimitConfig,
      tags,
      isActive,
    } = req.body;

    // Update fields
    if (name !== undefined) webhook.name = name;
    if (description !== undefined) webhook.description = description;
    if (url !== undefined) {
      try {
        new URL(url);
        webhook.url = url;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid URL format",
        });
      }
    }
    if (method !== undefined) webhook.method = method;
    if (events !== undefined) webhook.events = events;
    if (headers !== undefined) webhook.headers = new Map(Object.entries(headers));
    if (retryConfig !== undefined) webhook.retryConfig = { ...webhook.retryConfig, ...retryConfig };
    if (filters !== undefined) webhook.filters = filters;
    if (rateLimitConfig !== undefined) webhook.rateLimit = rateLimitConfig;
    if (tags !== undefined) webhook.tags = tags;
    if (isActive !== undefined) webhook.isActive = isActive;

    await webhook.save();

    res.json({
      success: true,
      data: webhook,
      message: "Webhook updated successfully",
    });
  } catch (error) {
    console.error("Error updating webhook:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update webhook",
    });
  }
});

// Delete webhook
router.delete("/:id", auth, webhookModifyLimiter, async (req, res) => {
  try {
    const webhook = await Webhook.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    // Also delete associated logs (optional, can be kept for audit)
    await WebhookLog.deleteMany({ webhookId: webhook._id });

    res.json({
      success: true,
      message: "Webhook deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting webhook:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete webhook",
    });
  }
});

// Test webhook endpoint
router.post("/:id/test", auth, webhookModifyLimiter, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    // Import webhook service dynamically to avoid circular dependencies
    const { WebhookService } = require("../utils/webhookService");
    
    // Create test payload
    const testPayload = {
      event: "system.alert",
      timestamp: new Date().toISOString(),
      webhook_id: webhook._id.toString(),
      delivery_id: `test_${Date.now()}`,
      api_version: "1.0",
      environment: process.env.NODE_ENV || "development",
      data: {
        alert_type: "warning",
        severity: "low",
        message: "This is a test webhook delivery",
        recommended_action: "No action required - this is a test",
      },
    };

    const webhookService = new WebhookService();
    const result = await webhookService.deliverWebhook(webhook, testPayload, "system.alert");

    res.json({
      success: true,
      data: result,
      message: "Test webhook sent successfully",
    });
  } catch (error) {
    console.error("Error testing webhook:", error);
    res.status(500).json({
      success: false,
      message: "Failed to test webhook",
      error: error.message,
    });
  }
});

// Get webhook logs
router.get("/:id/logs", auth, webhookLimiter, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      event_type,
      start_date,
      end_date,
    } = req.query;

    const webhook = await Webhook.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    const query = { webhookId: webhook._id };

    // Apply filters
    if (status) {
      query.status = status;
    }

    if (event_type) {
      query.eventType = event_type;
    }

    if (start_date || end_date) {
      query.createdAt = {};
      if (start_date) query.createdAt.$gte = new Date(start_date);
      if (end_date) query.createdAt.$lte = new Date(end_date);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: "-createdAt",
    };

    const logs = await WebhookLog.paginate(query, options);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching webhook logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch webhook logs",
    });
  }
});

// Get webhook statistics
router.get("/:id/stats", auth, webhookLimiter, async (req, res) => {
  try {
    const { timeframe = 24 } = req.query; // hours

    const webhook = await Webhook.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    const [deliveryStats, errorBreakdown] = await Promise.all([
      WebhookLog.getDeliveryStats(webhook._id, timeframe),
      WebhookLog.getErrorBreakdown(webhook._id, timeframe),
    ]);

    const stats = {
      webhook: {
        id: webhook._id,
        name: webhook.name,
        successRate: webhook.successRate,
        healthStatus: webhook.healthStatus,
        totalDeliveries: webhook.stats.totalDeliveries,
        successfulDeliveries: webhook.stats.successfulDeliveries,
        failedDeliveries: webhook.stats.failedDeliveries,
        averageResponseTime: webhook.stats.averageResponseTime,
        lastDeliveryAt: webhook.stats.lastDeliveryAt,
        consecutiveFailures: webhook.verification.consecutiveFailures,
      },
      timeframe: {
        hours: timeframe,
        deliveryStats: deliveryStats[0] || {},
        errorBreakdown,
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching webhook statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch webhook statistics",
    });
  }
});

// Regenerate webhook secret
router.post("/:id/regenerate-secret", auth, webhookModifyLimiter, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    const newSecret = crypto.randomBytes(32).toString("hex");
    webhook.secret = newSecret;
    await webhook.save();

    res.json({
      success: true,
      data: {
        secret: `${newSecret.substring(0, 8)}...`,
      },
      message: "Webhook secret regenerated successfully",
    });
  } catch (error) {
    console.error("Error regenerating webhook secret:", error);
    res.status(500).json({
      success: false,
      message: "Failed to regenerate webhook secret",
    });
  }
});

// Verify webhook URL
router.post("/:id/verify", auth, webhookModifyLimiter, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    // Import webhook service dynamically
    const { WebhookService } = require("../utils/webhookService");
    const webhookService = new WebhookService();
    
    const verificationResult = await webhookService.verifyWebhookEndpoint(webhook);

    if (verificationResult.success) {
      webhook.isVerified = true;
      webhook.verification.verifiedAt = new Date();
      webhook.verification.isHealthy = true;
      webhook.verification.consecutiveFailures = 0;
      await webhook.save();
    }

    res.json({
      success: verificationResult.success,
      data: verificationResult,
      message: verificationResult.success 
        ? "Webhook endpoint verified successfully"
        : "Webhook endpoint verification failed",
    });
  } catch (error) {
    console.error("Error verifying webhook:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify webhook endpoint",
    });
  }
});

// Reset webhook health
router.post("/:id/reset-health", auth, webhookModifyLimiter, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: "Webhook not found",
      });
    }

    await webhook.resetHealth();

    res.json({
      success: true,
      message: "Webhook health reset successfully",
    });
  } catch (error) {
    console.error("Error resetting webhook health:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset webhook health",
    });
  }
});

// Get global webhook statistics for user
router.get("/user/stats", auth, webhookLimiter, async (req, res) => {
  try {
    const stats = await Webhook.getStats(req.user.id);

    res.json({
      success: true,
      data: stats[0] || {
        totalWebhooks: 0,
        activeWebhooks: 0,
        totalDeliveries: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        averageSuccessRate: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user webhook statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch webhook statistics",
    });
  }
});

// Get available webhook events
router.get("/events/available", auth, (req, res) => {
  const eventCategories = {
    order: [
      "order.created",
      "order.updated",
      "order.cancelled",
      "order.completed", 
      "order.disputed",
    ],
    payment: [
      "payment.pending",
      "payment.completed",
      "payment.failed",
      "payment.refunded",
      "payment.advance_paid",
      "payment.shipment_paid",
      "payment.delivery_paid",
    ],
    shipping: [
      "shipping.ready_to_ship",
      "shipping.shipped",
      "shipping.in_transit",
      "shipping.delivered",
      "shipping.delayed",
      "shipping.returned",
    ],
    product: [
      "product.created",
      "product.updated",
      "product.deleted",
      "product.low_stock",
      "product.out_of_stock",
    ],
    user: [
      "user.verified",
      "user.suspended",
      "account.kyc_approved",
      "account.kyc_rejected",
    ],
    document: [
      "document.uploaded",
      "document.verified",
      "document.rejected",
    ],
    compliance: [
      "compliance.check_required",
      "compliance.check_passed",
      "compliance.check_failed",
    ],
    system: [
      "system.maintenance",
      "system.alert",
    ],
  };

  res.json({
    success: true,
    data: eventCategories,
  });
});

module.exports = router;
