#!/usr/bin/env node

/**
 * VASA Webhook Testing Utility
 * 
 * This script provides tools for testing webhook integrations:
 * - Start a test webhook server
 * - Send test webhook requests
 * - Validate webhook signatures
 * - Generate sample payloads
 */

const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Sample webhook payloads for testing
const SAMPLE_PAYLOADS = {
  'order.created': {
    event: 'order.created',
    timestamp: new Date().toISOString(),
    webhook_id: 'test_webhook_123',
    delivery_id: `test_${Date.now()}`,
    api_version: '1.0',
    environment: 'test',
    data: {
      order: {
        id: 'order_test123',
        orderNumber: 'VASA20240115001',
        status: 'pending_payment',
        buyer: {
          id: 'buyer_123',
          email: 'buyer@test.com',
          firstName: 'John',
          lastName: 'Doe',
          companyName: 'Test Company',
          role: 'importer',
          country: 'US'
        },
        seller: {
          id: 'seller_456',
          email: 'seller@test.com',
          firstName: 'Jane',
          lastName: 'Smith',
          companyName: 'Test Supplier',
          role: 'exporter',
          country: 'CN'
        },
        product: {
          id: 'product_789',
          title: 'Test Product',
          category: 'electronics',
          subcategory: 'components',
          pricing: {
            basePrice: 100.00,
            currency: 'USD',
            unit: 'piece'
          }
        },
        quantity: 10,
        unit: 'piece',
        unitPrice: 100.00,
        currency: 'USD',
        pricing: {
          subtotal: 1000.00,
          total: 1150.00,
          platformFee: 100.00,
          shippingCost: 50.00
        },
        orderDate: new Date().toISOString()
      }
    }
  },
  
  'payment.completed': {
    event: 'payment.completed',
    timestamp: new Date().toISOString(),
    webhook_id: 'test_webhook_123',
    delivery_id: `test_${Date.now()}`,
    api_version: '1.0',
    environment: 'test',
    data: {
      payment: {
        id: 'payment_test123',
        orderId: 'order_test123',
        type: 'advance',
        amount: 115.00,
        currency: 'USD',
        status: 'completed',
        transactionId: 'txn_test456'
      },
      order: {
        id: 'order_test123',
        orderNumber: 'VASA20240115001',
        status: 'payment_confirmed'
      }
    }
  },
  
  'shipping.delivered': {
    event: 'shipping.delivered',
    timestamp: new Date().toISOString(),
    webhook_id: 'test_webhook_123',
    delivery_id: `test_${Date.now()}`,
    api_version: '1.0',
    environment: 'test',
    data: {
      shipment: {
        id: 'shipment_test123',
        orderId: 'order_test123',
        carrier: 'FedEx',
        trackingNumber: 'TEST123456789',
        status: 'delivered',
        deliveredDate: new Date().toISOString()
      },
      order: {
        id: 'order_test123',
        orderNumber: 'VASA20240115001',
        status: 'delivered'
      }
    }
  },
  
  'product.low_stock': {
    event: 'product.low_stock',
    timestamp: new Date().toISOString(),
    webhook_id: 'test_webhook_123',
    delivery_id: `test_${Date.now()}`,
    api_version: '1.0',
    environment: 'test',
    data: {
      product: {
        id: 'product_test789',
        title: 'Test Product',
        category: 'electronics',
        currentStock: 5,
        reorderLevel: 10,
        stockShortage: 5
      }
    }
  }
};

// Test webhook server
function startTestServer(port = 3000) {
  const app = express();
  const receivedWebhooks = [];
  
  app.use(express.json());
  app.use(express.raw({ type: 'application/json' }));
  
  // Webhook endpoint
  app.post('/webhook', (req, res) => {
    const timestamp = new Date().toISOString();
    const headers = req.headers;
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    console.log(`\n🔔 Webhook received at ${timestamp}`);
    console.log(`Event: ${headers['x-vasa-event'] || body.event || 'unknown'}`);
    console.log(`Delivery ID: ${headers['x-vasa-delivery'] || 'unknown'}`);
    console.log(`Signature: ${headers['x-vasa-signature'] || 'none'}`);
    console.log(`Headers:`, JSON.stringify(headers, null, 2));
    console.log(`Payload:`, JSON.stringify(body, null, 2));
    
    // Store for later inspection
    receivedWebhooks.push({
      timestamp,
      headers,
      body
    });
    
    // Simulate processing delay
    setTimeout(() => {
      res.status(200).json({ received: true, timestamp });
      console.log(`✅ Webhook acknowledged`);
    }, Math.random() * 100); // Random delay 0-100ms
  });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      webhooksReceived: receivedWebhooks.length,
      uptime: process.uptime()
    });
  });
  
  // List received webhooks
  app.get('/webhooks', (req, res) => {
    res.json(receivedWebhooks);
  });
  
  // Clear webhook history
  app.delete('/webhooks', (req, res) => {
    receivedWebhooks.length = 0;
    res.json({ cleared: true });
  });
  
  const server = app.listen(port, () => {
    console.log(`🚀 Test webhook server running on port ${port}`);
    console.log(`📥 Webhook endpoint: http://localhost:${port}/webhook`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`📋 View received: http://localhost:${port}/webhooks`);
    console.log(`🧹 Clear history: DELETE http://localhost:${port}/webhooks`);
    console.log(`\nWaiting for webhooks...`);
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down webhook server...');
    server.close(() => {
      console.log(`📊 Total webhooks received: ${receivedWebhooks.length}`);
      process.exit(0);
    });
  });
  
  return server;
}

// Send test webhook
async function sendTestWebhook(url, eventType, secret, options = {}) {
  try {
    const payload = SAMPLE_PAYLOADS[eventType];
    if (!payload) {
      throw new Error(`Unknown event type: ${eventType}. Available: ${Object.keys(SAMPLE_PAYLOADS).join(', ')}`);
    }
    
    // Update payload with custom values
    if (options.orderId) {
      payload.data.order = payload.data.order || {};
      payload.data.order.id = options.orderId;
    }
    
    // Generate signature if secret provided
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'VASA-Webhooks-Test/1.0',
      'X-VASA-Event': eventType,
      'X-VASA-Delivery': payload.delivery_id,
      'X-VASA-Webhook': payload.webhook_id
    };
    
    if (secret) {
      const signature = generateSignature(payload, secret);
      headers['X-VASA-Signature'] = signature;
      headers['X-VASA-Signature-Algorithm'] = 'sha256';
    }
    
    console.log(`📤 Sending test webhook to ${url}`);
    console.log(`Event: ${eventType}`);
    console.log(`Delivery ID: ${payload.delivery_id}`);
    
    const startTime = Date.now();
    const response = await axios.post(url, payload, { 
      headers,
      timeout: options.timeout || 30000,
      validateStatus: () => true // Don't throw on non-2xx status
    });
    const responseTime = Date.now() - startTime;
    
    console.log(`\n📥 Response received (${responseTime}ms)`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, JSON.stringify(response.headers, null, 2));
    
    if (response.data) {
      console.log(`Body:`, typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
    }
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ Webhook delivered successfully`);
    } else {
      console.log(`❌ Webhook delivery failed`);
    }
    
    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      responseTime,
      response: response.data
    };
    
  } catch (error) {
    console.log(`❌ Webhook delivery failed: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`💡 Tip: Make sure your webhook endpoint is running and accessible`);
    }
    
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}

// Generate HMAC signature
function generateSignature(payload, secret) {
  const payloadString = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payloadString);
  return 'sha256=' + hmac.digest('hex');
}

// Verify HMAC signature
function verifySignature(payload, signature, secret) {
  const expectedSignature = generateSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Load test - send multiple webhooks
async function loadTest(url, eventType, secret, options = {}) {
  const {
    count = 10,
    concurrency = 3,
    delay = 1000
  } = options;
  
  console.log(`🚀 Starting load test:`);
  console.log(`- URL: ${url}`);
  console.log(`- Event: ${eventType}`);
  console.log(`- Count: ${count}`);
  console.log(`- Concurrency: ${concurrency}`);
  console.log(`- Delay: ${delay}ms`);
  
  const results = [];
  const startTime = Date.now();
  
  // Process in batches
  for (let i = 0; i < count; i += concurrency) {
    const batch = [];
    
    for (let j = 0; j < concurrency && (i + j) < count; j++) {
      const webhookIndex = i + j + 1;
      console.log(`📤 Sending webhook ${webhookIndex}/${count}`);
      
      batch.push(
        sendTestWebhook(url, eventType, secret, { 
          ...options,
          orderId: `load_test_${webhookIndex}`
        })
      );
    }
    
    const batchResults = await Promise.allSettled(batch);
    results.push(...batchResults.map(r => r.value));
    
    // Delay between batches
    if (i + concurrency < count) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  const totalTime = Date.now() - startTime;
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  const avgResponseTime = results
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  
  console.log(`\n📊 Load test completed in ${totalTime}ms`);
  console.log(`✅ Successful: ${successful}/${count} (${(successful/count*100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failed}/${count}`);
  console.log(`⏱️  Average response time: ${avgResponseTime?.toFixed(0) || 'N/A'}ms`);
  console.log(`🚀 Throughput: ${(count / (totalTime / 1000)).toFixed(2)} webhooks/sec`);
  
  return {
    total: count,
    successful,
    failed,
    totalTime,
    avgResponseTime: avgResponseTime || 0,
    throughput: count / (totalTime / 1000)
  };
}

// Generate sample payload
function generatePayload(eventType, customData = {}) {
  const basePayload = SAMPLE_PAYLOADS[eventType];
  if (!basePayload) {
    throw new Error(`Unknown event type: ${eventType}`);
  }
  
  const payload = JSON.parse(JSON.stringify(basePayload));
  
  // Apply custom data
  if (customData) {
    Object.assign(payload.data, customData);
  }
  
  // Update timestamp and delivery ID
  payload.timestamp = new Date().toISOString();
  payload.delivery_id = `generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return payload;
}

// CLI interface
const argv = yargs(hideBin(process.argv))
  .command('server [port]', 'Start test webhook server', (yargs) => {
    return yargs.positional('port', {
      describe: 'Port to listen on',
      default: 3000,
      type: 'number'
    });
  }, (argv) => {
    startTestServer(argv.port);
  })
  .command('send <url> <event>', 'Send test webhook', (yargs) => {
    return yargs
      .positional('url', {
        describe: 'Webhook URL to send to',
        type: 'string'
      })
      .positional('event', {
        describe: 'Event type to send',
        type: 'string',
        choices: Object.keys(SAMPLE_PAYLOADS)
      })
      .option('secret', {
        alias: 's',
        describe: 'Webhook secret for signing',
        type: 'string'
      })
      .option('timeout', {
        alias: 't',
        describe: 'Request timeout in ms',
        type: 'number',
        default: 30000
      });
  }, async (argv) => {
    await sendTestWebhook(argv.url, argv.event, argv.secret, {
      timeout: argv.timeout
    });
  })
  .command('load <url> <event>', 'Run load test', (yargs) => {
    return yargs
      .positional('url', {
        describe: 'Webhook URL to test',
        type: 'string'
      })
      .positional('event', {
        describe: 'Event type to send',
        type: 'string',
        choices: Object.keys(SAMPLE_PAYLOADS)
      })
      .option('secret', {
        alias: 's',
        describe: 'Webhook secret for signing',
        type: 'string'
      })
      .option('count', {
        alias: 'n',
        describe: 'Number of webhooks to send',
        type: 'number',
        default: 10
      })
      .option('concurrency', {
        alias: 'c',
        describe: 'Number of concurrent requests',
        type: 'number',
        default: 3
      })
      .option('delay', {
        alias: 'd',
        describe: 'Delay between batches in ms',
        type: 'number',
        default: 1000
      });
  }, async (argv) => {
    await loadTest(argv.url, argv.event, argv.secret, {
      count: argv.count,
      concurrency: argv.concurrency,
      delay: argv.delay
    });
  })
  .command('generate <event>', 'Generate sample payload', (yargs) => {
    return yargs
      .positional('event', {
        describe: 'Event type to generate',
        type: 'string',
        choices: Object.keys(SAMPLE_PAYLOADS)
      })
      .option('pretty', {
        alias: 'p',
        describe: 'Pretty print JSON',
        type: 'boolean',
        default: true
      });
  }, (argv) => {
    const payload = generatePayload(argv.event);
    console.log(JSON.stringify(payload, null, argv.pretty ? 2 : 0));
  })
  .command('verify <payload> <signature> <secret>', 'Verify webhook signature', (yargs) => {
    return yargs
      .positional('payload', {
        describe: 'JSON payload (string or file path)',
        type: 'string'
      })
      .positional('signature', {
        describe: 'HMAC signature to verify',
        type: 'string'
      })
      .positional('secret', {
        describe: 'Webhook secret',
        type: 'string'
      });
  }, (argv) => {
    try {
      let payload;
      
      // Try to parse as JSON, fallback to reading as file
      try {
        payload = JSON.parse(argv.payload);
      } catch {
        const fs = require('fs');
        const payloadData = fs.readFileSync(argv.payload, 'utf8');
        payload = JSON.parse(payloadData);
      }
      
      const isValid = verifySignature(payload, argv.signature, argv.secret);
      
      console.log(`Signature verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      console.log(`Expected: ${generateSignature(payload, argv.secret)}`);
      console.log(`Received: ${argv.signature}`);
      
      process.exit(isValid ? 0 : 1);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  })
  .command('events', 'List available event types', {}, () => {
    console.log('Available webhook event types:');
    Object.keys(SAMPLE_PAYLOADS).forEach(event => {
      console.log(`  ${event}`);
    });
  })
  .demandCommand(1, 'You need at least one command')
  .help()
  .alias('help', 'h')
  .argv;

// Export for programmatic use
module.exports = {
  startTestServer,
  sendTestWebhook,
  loadTest,
  generatePayload,
  generateSignature,
  verifySignature,
  SAMPLE_PAYLOADS
};
