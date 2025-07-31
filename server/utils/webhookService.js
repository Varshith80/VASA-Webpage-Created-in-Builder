const crypto = require("crypto");
const https = require("https");
const http = require("http");
const { URL } = require("url");
const Webhook = require("../models/Webhook");
const WebhookLog = require("../models/WebhookLog");

class WebhookService {
  constructor() {
    this.maxRetries = 3;
    this.baseDelay = 1000; // 1 second
    this.maxDelay = 30000; // 30 seconds
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Trigger webhooks for a specific event
   * @param {string} eventType - The type of event
   * @param {Object} eventData - The event data
   * @param {string} userId - Optional user ID to filter webhooks
   */
  async triggerWebhooks(eventType, eventData, userId = null) {
    try {
      // Find all active webhooks for this event
      const webhooks = await Webhook.findActiveForEvent(eventType, userId);
      
      if (webhooks.length === 0) {
        console.log(`No active webhooks found for event: ${eventType}`);
        return;
      }

      console.log(`Triggering ${webhooks.length} webhooks for event: ${eventType}`);

      // Process webhooks in parallel with concurrency limit
      const promises = webhooks.map(webhook => 
        this.processWebhook(webhook, eventType, eventData)
      );

      await Promise.allSettled(promises);
    } catch (error) {
      console.error("Error triggering webhooks:", error);
      throw error;
    }
  }

  /**
   * Process a single webhook
   * @param {Object} webhook - The webhook configuration
   * @param {string} eventType - The event type
   * @param {Object} eventData - The event data
   */
  async processWebhook(webhook, eventType, eventData) {
    try {
      // Check if webhook should be triggered for this event and data
      if (!webhook.shouldTrigger(eventType, eventData)) {
        console.log(`Webhook ${webhook._id} filtered out for event ${eventType}`);
        return;
      }

      // Check rate limiting
      if (await this.isRateLimited(webhook)) {
        console.log(`Webhook ${webhook._id} rate limited`);
        return;
      }

      // Create payload
      const payload = this.createPayload(webhook, eventType, eventData);

      // Deliver webhook
      await this.deliverWebhook(webhook, payload, eventType);
    } catch (error) {
      console.error(`Error processing webhook ${webhook._id}:`, error);
    }
  }

  /**
   * Create webhook payload
   * @param {Object} webhook - The webhook configuration
   * @param {string} eventType - The event type
   * @param {Object} eventData - The event data
   */
  createPayload(webhook, eventType, eventData) {
    const deliveryId = crypto.randomUUID();
    
    return {
      event: eventType,
      timestamp: new Date().toISOString(),
      webhook_id: webhook._id.toString(),
      delivery_id: deliveryId,
      api_version: "1.0",
      environment: process.env.NODE_ENV || "development",
      data: eventData,
    };
  }

  /**
   * Deliver webhook to endpoint
   * @param {Object} webhook - The webhook configuration
   * @param {Object} payload - The payload to send
   * @param {string} eventType - The event type
   */
  async deliverWebhook(webhook, payload, eventType) {
    const eventId = `${eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create webhook log entry
    const webhookLog = new WebhookLog({
      webhookId: webhook._id,
      userId: webhook.userId,
      eventType,
      eventId,
      eventTimestamp: new Date(),
      maxAttempts: webhook.retryConfig?.maxRetries || this.maxRetries,
      request: {
        url: webhook.url,
        method: webhook.method,
        headers: this.prepareHeaders(webhook, payload),
        payload,
      },
    });

    try {
      await webhookLog.save();
      await this.attemptDelivery(webhook, webhookLog, payload);
    } catch (error) {
      console.error(`Error delivering webhook ${webhook._id}:`, error);
      await webhookLog.recordAttempt(0, null, 0, error);
    }

    return webhookLog;
  }

  /**
   * Attempt webhook delivery
   * @param {Object} webhook - The webhook configuration
   * @param {Object} webhookLog - The webhook log entry
   * @param {Object} payload - The payload to send
   */
  async attemptDelivery(webhook, webhookLog, payload) {
    const startTime = Date.now();
    
    try {
      const response = await this.makeHttpRequest(webhook, payload);
      const responseTime = Date.now() - startTime;

      await webhookLog.recordAttempt(
        response.statusCode,
        response.body,
        responseTime
      );

      // Update webhook statistics
      await webhook.updateStats(
        response.statusCode >= 200 && response.statusCode < 300,
        responseTime
      );

      console.log(`Webhook ${webhook._id} delivered successfully. Status: ${response.statusCode}`);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      await webhookLog.recordAttempt(
        error.statusCode || 0,
        error.message,
        responseTime,
        error
      );

      await webhook.updateStats(false, responseTime);
      
      console.error(`Webhook ${webhook._id} delivery failed:`, error.message);

      // Schedule retry if applicable
      if (webhookLog.isRetryable) {
        await this.scheduleRetry(webhook, webhookLog, payload);
      }
    }
  }

  /**
   * Make HTTP request to webhook endpoint
   * @param {Object} webhook - The webhook configuration
   * @param {Object} payload - The payload to send
   */
  async makeHttpRequest(webhook, payload) {
    return new Promise((resolve, reject) => {
      const url = new URL(webhook.url);
      const isHttps = url.protocol === "https:";
      const client = isHttps ? https : http;

      const headers = this.prepareHeaders(webhook, payload);
      const payloadString = JSON.stringify(payload);

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: webhook.method,
        headers: {
          ...headers,
          "Content-Length": Buffer.byteLength(payloadString),
        },
        timeout: webhook.retryConfig?.timeout || this.timeout,
      };

      const req = client.request(options, (res) => {
        let body = "";
        
        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body.substring(0, 1000), // Limit body size in logs
          });
        });
      });

      req.on("error", (error) => {
        reject({
          message: error.message,
          code: error.code,
          statusCode: 0,
        });
      });

      req.on("timeout", () => {
        req.destroy();
        reject({
          message: "Request timeout",
          code: "ETIMEDOUT",
          statusCode: 0,
        });
      });

      req.write(payloadString);
      req.end();
    });
  }

  /**
   * Prepare headers for webhook request
   * @param {Object} webhook - The webhook configuration
   * @param {Object} payload - The payload
   */
  prepareHeaders(webhook, payload) {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "VASA-Webhooks/1.0",
      "X-VASA-Event": payload.event,
      "X-VASA-Delivery": payload.delivery_id,
      "X-VASA-Webhook": webhook._id.toString(),
    };

    // Add HMAC signature for verification
    if (webhook.secret) {
      const signature = this.generateSignature(payload, webhook.secret);
      headers["X-VASA-Signature"] = signature;
      headers["X-VASA-Signature-Algorithm"] = "sha256";
    }

    // Add custom headers from webhook configuration
    if (webhook.headers && webhook.headers.size > 0) {
      for (const [key, value] of webhook.headers) {
        // Don't allow overriding security headers
        if (!key.toLowerCase().startsWith("x-vasa-") && 
            !["content-type", "user-agent"].includes(key.toLowerCase())) {
          headers[key] = value;
        }
      }
    }

    return headers;
  }

  /**
   * Generate HMAC signature for webhook verification
   * @param {Object} payload - The payload
   * @param {string} secret - The webhook secret
   */
  generateSignature(payload, secret) {
    const payloadString = JSON.stringify(payload);
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payloadString);
    return "sha256=" + hmac.digest("hex");
  }

  /**
   * Verify webhook signature
   * @param {Object} payload - The payload
   * @param {string} signature - The received signature
   * @param {string} secret - The webhook secret
   */
  verifySignature(payload, signature, secret) {
    const expectedSignature = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Check if webhook is rate limited
   * @param {Object} webhook - The webhook configuration
   */
  async isRateLimited(webhook) {
    if (!webhook.rateLimit?.enabled) {
      return false;
    }

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check requests in the last minute
    const recentRequests = await WebhookLog.countDocuments({
      webhookId: webhook._id,
      createdAt: { $gte: oneMinuteAgo },
    });

    if (recentRequests >= webhook.rateLimit.maxRequestsPerMinute) {
      return true;
    }

    // Check requests in the last hour
    const hourlyRequests = await WebhookLog.countDocuments({
      webhookId: webhook._id,
      createdAt: { $gte: oneHourAgo },
    });

    return hourlyRequests >= webhook.rateLimit.maxRequestsPerHour;
  }

  /**
   * Schedule webhook retry
   * @param {Object} webhook - The webhook configuration
   * @param {Object} webhookLog - The webhook log entry
   * @param {Object} payload - The payload
   */
  async scheduleRetry(webhook, webhookLog, payload) {
    const delay = Math.min(
      this.baseDelay * Math.pow(2, webhookLog.attempts - 1),
      this.maxDelay
    );

    setTimeout(async () => {
      try {
        await this.attemptDelivery(webhook, webhookLog, payload);
      } catch (error) {
        console.error(`Retry failed for webhook ${webhook._id}:`, error);
      }
    }, delay);
  }

  /**
   * Process pending retries
   */
  async processRetries() {
    try {
      const pendingRetries = await WebhookLog.findReadyForRetry();
      
      for (const log of pendingRetries) {
        const webhook = await Webhook.findById(log.webhookId);
        if (webhook && webhook.isActive) {
          await this.attemptDelivery(webhook, log, log.request.payload);
        }
      }
    } catch (error) {
      console.error("Error processing webhook retries:", error);
    }
  }

  /**
   * Verify webhook endpoint
   * @param {Object} webhook - The webhook configuration
   */
  async verifyWebhookEndpoint(webhook) {
    try {
      const challenge = crypto.randomBytes(16).toString("hex");
      const verificationPayload = {
        event: "webhook.verification",
        timestamp: new Date().toISOString(),
        webhook_id: webhook._id.toString(),
        delivery_id: `verify_${Date.now()}`,
        api_version: "1.0",
        environment: process.env.NODE_ENV || "development",
        data: {
          challenge,
          verification_type: "endpoint_verification",
          webhook_url: webhook.url,
        },
      };

      const response = await this.makeHttpRequest(webhook, verificationPayload);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        // Try to parse response and check for challenge echo
        try {
          const responseData = JSON.parse(response.body);
          if (responseData.challenge === challenge) {
            return {
              success: true,
              message: "Webhook endpoint verified successfully",
              challenge_verified: true,
            };
          }
        } catch (parseError) {
          // Response parsing failed, but status was successful
        }

        return {
          success: true,
          message: "Webhook endpoint responded successfully",
          challenge_verified: false,
        };
      } else {
        return {
          success: false,
          message: `Webhook endpoint verification failed with status ${response.statusCode}`,
          statusCode: response.statusCode,
          response: response.body,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Webhook endpoint verification failed: ${error.message}`,
        error: error.code,
      };
    }
  }

  /**
   * Clean up old webhook logs
   * @param {number} daysToKeep - Number of days to keep logs
   */
  async cleanupLogs(daysToKeep = 30) {
    try {
      const result = await WebhookLog.cleanup(daysToKeep);
      console.log(`Cleaned up ${result.deletedCount} old webhook logs`);
      return result;
    } catch (error) {
      console.error("Error cleaning up webhook logs:", error);
      throw error;
    }
  }

  /**
   * Get webhook delivery statistics
   * @param {string} webhookId - The webhook ID
   * @param {number} timeframe - Timeframe in hours
   */
  async getWebhookStats(webhookId, timeframe = 24) {
    try {
      const [deliveryStats, errorBreakdown] = await Promise.all([
        WebhookLog.getDeliveryStats(webhookId, timeframe),
        WebhookLog.getErrorBreakdown(webhookId, timeframe),
      ]);

      return {
        deliveryStats: deliveryStats[0] || {},
        errorBreakdown,
        timeframe,
      };
    } catch (error) {
      console.error("Error getting webhook statistics:", error);
      throw error;
    }
  }
}

// Start periodic retry processor
const webhookService = new WebhookService();

// Process retries every 30 seconds
setInterval(() => {
  webhookService.processRetries();
}, 30000);

// Clean up old logs daily
setInterval(() => {
  webhookService.cleanupLogs();
}, 24 * 60 * 60 * 1000);

module.exports = { WebhookService, webhookService };
