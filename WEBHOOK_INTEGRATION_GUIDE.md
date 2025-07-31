# VASA Webhook Integration Guide

This guide provides comprehensive documentation for implementing and testing webhook integrations with the VASA Global Trade Platform.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Event Types](#event-types)
4. [Webhook Configuration](#webhook-configuration)
5. [Payload Structure](#payload-structure)
6. [Security](#security)
7. [Testing](#testing)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Examples](#examples)

## Overview

VASA webhooks enable real-time integration with your ERP, inventory management, notification systems, and other business applications. When significant events occur in the VASA platform (orders, payments, shipping updates, etc.), we'll send HTTP POST requests to your configured endpoints with relevant data.

### Key Features

- **Real-time notifications** for order/shipping/payment events
- **Retry logic** with exponential backoff for failed deliveries
- **Event filtering** to receive only relevant notifications
- **HMAC signature verification** for security
- **Comprehensive logging** and delivery tracking
- **Rate limiting** support for high-volume integrations

## Getting Started

### 1. Create a Webhook Endpoint

Create an HTTP endpoint in your system to receive webhook notifications:

```javascript
// Node.js/Express example
app.post('/webhooks/vasa', (req, res) => {
  const signature = req.headers['x-vasa-signature'];
  const payload = req.body;
  
  // Verify signature (see Security section)
  if (!verifySignature(payload, signature, process.env.VASA_WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook event
  handleWebhookEvent(payload);
  
  // Respond with 200 to acknowledge receipt
  res.status(200).send('OK');
});
```

### 2. Configure Webhook in VASA

1. Log into your VASA account
2. Navigate to **Settings** > **Webhooks**
3. Click **Create Webhook**
4. Configure your endpoint URL and select events
5. Test the connection

### 3. Handle Events

Process webhook events based on the event type:

```javascript
function handleWebhookEvent(payload) {
  switch (payload.event) {
    case 'order.created':
      handleNewOrder(payload.data.order);
      break;
    case 'payment.completed':
      updatePaymentStatus(payload.data.payment, payload.data.order);
      break;
    case 'shipping.delivered':
      notifyCustomerDelivery(payload.data.shipment, payload.data.order);
      break;
    // Handle other events...
  }
}
```

## Event Types

### Order Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `order.created` | New order placed | Order created and saved |
| `order.updated` | Order status changed | Any order field updated |
| `order.cancelled` | Order cancelled | Order cancellation requested |
| `order.completed` | Order fully completed | All payments received and delivery confirmed |
| `order.disputed` | Order disputed | Dispute raised by buyer or seller |

### Payment Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `payment.pending` | Payment due | Payment schedule reached |
| `payment.completed` | Payment successful | Payment processed successfully |
| `payment.failed` | Payment failed | Payment processing failed |
| `payment.refunded` | Payment refunded | Refund processed |
| `payment.advance_paid` | Advance payment made | 10% advance payment completed |
| `payment.shipment_paid` | Shipment payment made | 50% shipment payment completed |
| `payment.delivery_paid` | Delivery payment made | 40% delivery payment completed |

### Shipping Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `shipping.ready_to_ship` | Ready for shipment | Order prepared for shipping |
| `shipping.shipped` | Package shipped | Tracking number assigned |
| `shipping.in_transit` | In transit update | Package location updated |
| `shipping.delivered` | Package delivered | Delivery confirmed |
| `shipping.delayed` | Shipment delayed | Delivery date updated |
| `shipping.returned` | Package returned | Return to sender |

### Product Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `product.created` | New product listed | Product approved and published |
| `product.updated` | Product modified | Product details changed |
| `product.deleted` | Product removed | Product deleted or delisted |
| `product.low_stock` | Low inventory | Stock below reorder level |
| `product.out_of_stock` | No inventory | Zero available stock |

### User/Account Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `user.verified` | User verified | Account verification completed |
| `user.suspended` | User suspended | Account suspended by admin |
| `account.kyc_approved` | KYC approved | Know Your Customer verification approved |
| `account.kyc_rejected` | KYC rejected | KYC verification rejected |

### Document Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `document.uploaded` | Document uploaded | New document uploaded |
| `document.verified` | Document verified | Document approved by admin |
| `document.rejected` | Document rejected | Document rejected with reason |

### Compliance Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `compliance.check_required` | Compliance check needed | Manual review required |
| `compliance.check_passed` | Compliance approved | Compliance verification passed |
| `compliance.check_failed` | Compliance failed | Compliance issues found |

### System Events

| Event | Description | When Triggered |
|-------|-------------|----------------|
| `system.maintenance` | Maintenance scheduled | System maintenance notification |
| `system.alert` | System alert | Important system notifications |

## Webhook Configuration

### Basic Configuration

```json
{
  "name": "ERP Integration",
  "description": "Sync orders and payments to our ERP system",
  "url": "https://api.mycompany.com/webhooks/vasa",
  "method": "POST",
  "events": [
    "order.created",
    "order.updated", 
    "payment.completed"
  ],
  "isActive": true
}
```

### Advanced Configuration

```json
{
  "name": "Advanced ERP Integration",
  "url": "https://api.mycompany.com/webhooks/vasa",
  "method": "POST",
  "events": ["order.*", "payment.*"],
  "headers": {
    "Authorization": "Bearer your-api-token",
    "Content-Type": "application/json"
  },
  "retryConfig": {
    "maxRetries": 5,
    "retryDelay": 2000,
    "backoffMultiplier": 2,
    "timeout": 45000
  },
  "filters": {
    "orderStatuses": ["completed", "shipped"],
    "minOrderValue": 1000,
    "countries": ["US", "CA", "UK"],
    "productCategories": ["electronics", "machinery"]
  },
  "rateLimit": {
    "enabled": true,
    "maxRequestsPerMinute": 30,
    "maxRequestsPerHour": 500
  },
  "tags": ["erp", "critical", "production"]
}
```

## Payload Structure

All webhook payloads follow this base structure:

```typescript
{
  "event": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "webhook_id": "webhook_123",
  "delivery_id": "delivery_456",
  "api_version": "1.0",
  "environment": "production",
  "data": {
    // Event-specific data
  }
}
```

### Order Created Example

```json
{
  "event": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "webhook_id": "wh_1234567890",
  "delivery_id": "del_9876543210",
  "api_version": "1.0",
  "environment": "production",
  "data": {
    "order": {
      "id": "order_abc123",
      "orderNumber": "VASA20240115001",
      "status": "pending_payment",
      "buyer": {
        "id": "user_buyer123",
        "email": "buyer@company.com",
        "firstName": "John",
        "lastName": "Smith",
        "companyName": "Smith Industries",
        "role": "importer",
        "country": "US"
      },
      "seller": {
        "id": "user_seller456",
        "email": "seller@supplier.com", 
        "firstName": "Jane",
        "lastName": "Doe",
        "companyName": "Global Suppliers Ltd",
        "role": "exporter",
        "country": "CN"
      },
      "product": {
        "id": "prod_xyz789",
        "title": "High-Quality Electronic Components",
        "category": "electronics",
        "subcategory": "semiconductors",
        "pricing": {
          "basePrice": 25.50,
          "currency": "USD",
          "unit": "piece"
        }
      },
      "quantity": 1000,
      "unit": "piece",
      "unitPrice": 25.50,
      "currency": "USD",
      "pricing": {
        "subtotal": 25500.00,
        "total": 27225.00,
        "platformFee": 1275.00,
        "shippingCost": 450.00
      },
      "shipping": {
        "shippingAddress": {
          "name": "John Smith",
          "company": "Smith Industries",
          "street": "123 Business Ave",
          "city": "New York",
          "state": "NY",
          "country": "US",
          "zipCode": "10001"
        }
      },
      "paymentPlan": {
        "advance": {
          "amount": 2722.50,
          "status": "pending",
          "dueDate": "2024-01-17T10:30:00Z"
        },
        "shipment": {
          "amount": 13612.50,
          "status": "pending"
        },
        "delivery": {
          "amount": 10890.00,
          "status": "pending"
        }
      },
      "orderDate": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Security

### HMAC Signature Verification

VASA signs all webhook payloads with HMAC-SHA256. Verify signatures to ensure authenticity:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  const receivedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
}
```

### Headers

Each webhook request includes these headers:

- `X-VASA-Signature`: HMAC signature for verification
- `X-VASA-Signature-Algorithm`: Always "sha256"
- `X-VASA-Event`: Event type (e.g., "order.created")
- `X-VASA-Delivery`: Unique delivery ID
- `X-VASA-Webhook`: Webhook configuration ID
- `User-Agent`: "VASA-Webhooks/1.0"

## Testing

### Manual Testing

Use the webhook test feature in the VASA dashboard:

1. Go to **Webhooks** in your account settings
2. Select your webhook
3. Click **Test Webhook**
4. Check your endpoint receives the test payload

### Test Payload Example

```json
{
  "event": "system.alert",
  "timestamp": "2024-01-15T10:30:00Z",
  "webhook_id": "wh_test123",
  "delivery_id": "test_456",
  "api_version": "1.0",
  "environment": "development",
  "data": {
    "alert_type": "warning",
    "severity": "low",
    "message": "This is a test webhook delivery",
    "recommended_action": "No action required - this is a test"
  }
}
```

### Testing Tools

#### ngrok for Local Development

```bash
# Install ngrok
npm install -g ngrok

# Expose local port
ngrok http 3000

# Use the HTTPS URL for webhook configuration
```

#### Webhook Testing Server

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook-test', (req, res) => {
  console.log('Webhook received:');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Test server running on port 3000');
});
```

#### Using curl for Testing

```bash
# Test your webhook endpoint
curl -X POST https://your-endpoint.com/webhooks/vasa \
  -H "Content-Type: application/json" \
  -H "X-VASA-Signature: sha256=test" \
  -H "X-VASA-Event: order.created" \
  -d @test-payload.json
```

## Error Handling

### Response Codes

Your webhook endpoint should respond with:

- **200-299**: Success - webhook processed
- **400**: Bad request - malformed payload
- **401**: Unauthorized - invalid signature
- **404**: Not found - endpoint doesn't exist
- **500**: Server error - temporary failure, will retry

### Retry Behavior

VASA automatically retries failed webhooks:

- **Initial delay**: 1 second
- **Backoff**: Exponential (2x multiplier)
- **Max retries**: 3 (configurable)
- **Max delay**: 30 seconds
- **Timeout**: 30 seconds per attempt

### Idempotency

Handle duplicate deliveries by checking the `delivery_id`:

```javascript
const processedDeliveries = new Set();

app.post('/webhooks/vasa', (req, res) => {
  const deliveryId = req.headers['x-vasa-delivery'];
  
  if (processedDeliveries.has(deliveryId)) {
    return res.status(200).send('Already processed');
  }
  
  // Process webhook
  processWebhook(req.body);
  
  processedDeliveries.add(deliveryId);
  res.status(200).send('OK');
});
```

## Best Practices

### 1. Respond Quickly

- Acknowledge receipt immediately (return 200)
- Process webhooks asynchronously if needed
- Keep endpoint response time under 5 seconds

### 2. Verify Signatures

Always verify HMAC signatures to ensure authenticity.

### 3. Handle Duplicates

Implement idempotency using `delivery_id` to prevent duplicate processing.

### 4. Use HTTPS

Always use HTTPS endpoints for security.

### 5. Log Everything

Log all webhook deliveries for debugging and monitoring.

### 6. Monitor Health

Monitor your webhook endpoint health and implement alerting.

### 7. Filter Events

Only subscribe to events you actually need to reduce processing overhead.

### 8. Implement Circuit Breakers

Protect your systems from webhook floods with circuit breakers.

### 9. Queue Processing

Use message queues for high-volume webhook processing:

```javascript
const Queue = require('bull');
const webhookQueue = new Queue('webhook processing');

app.post('/webhooks/vasa', (req, res) => {
  // Verify signature first
  if (!verifySignature(req.body, req.headers['x-vasa-signature'], secret)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Add to queue for async processing
  webhookQueue.add('process', req.body);
  
  // Respond immediately
  res.status(200).send('Queued');
});

webhookQueue.process('process', async (job) => {
  await processWebhookEvent(job.data);
});
```

## Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Events

- Check webhook is active and URL is correct
- Verify your endpoint is accessible from internet
- Check event filters aren't too restrictive

#### 2. Signature Verification Failing

- Ensure you're using the correct webhook secret
- Verify payload is not modified before verification
- Check HMAC calculation implementation

#### 3. Timeouts

- Optimize endpoint response time
- Implement async processing
- Increase timeout configuration if needed

#### 4. High Failure Rate

- Check endpoint logs for errors
- Verify endpoint can handle webhook volume
- Implement proper error handling

### Debugging

Enable webhook logs in VASA dashboard to see:

- Delivery attempts and responses
- Response times and status codes
- Error messages and retry history

### Testing Checklist

- [ ] Endpoint responds with 200 for valid requests
- [ ] Signature verification working correctly
- [ ] Handles all subscribed event types
- [ ] Implements idempotency checking
- [ ] Processes webhooks within timeout limits
- [ ] Proper error handling and logging
- [ ] Handles high webhook volumes
- [ ] Security headers and HTTPS configured

## Examples

### Complete Integration Example

```javascript
const express = require('express');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
const db = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());

// Webhook endpoint
app.post('/webhooks/vasa', async (req, res) => {
  try {
    // Verify signature
    const signature = req.headers['x-vasa-signature'];
    if (!verifySignature(req.body, signature, process.env.VASA_WEBHOOK_SECRET)) {
      return res.status(401).send('Invalid signature');
    }
    
    // Check for duplicate delivery
    const deliveryId = req.headers['x-vasa-delivery'];
    const existing = await db.query(
      'SELECT id FROM webhook_deliveries WHERE delivery_id = $1',
      [deliveryId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(200).send('Already processed');
    }
    
    // Record delivery
    await db.query(
      'INSERT INTO webhook_deliveries (delivery_id, event_type, payload, processed_at) VALUES ($1, $2, $3, NOW())',
      [deliveryId, req.body.event, JSON.stringify(req.body)]
    );
    
    // Process event
    await processWebhookEvent(req.body);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal error');
  }
});

async function processWebhookEvent(payload) {
  switch (payload.event) {
    case 'order.created':
      await handleOrderCreated(payload.data.order);
      break;
    case 'payment.completed':
      await handlePaymentCompleted(payload.data.payment, payload.data.order);
      break;
    case 'shipping.delivered':
      await handleShippingDelivered(payload.data.shipment, payload.data.order);
      break;
    default:
      console.log('Unhandled event type:', payload.event);
  }
}

async function handleOrderCreated(order) {
  // Sync order to ERP system
  await syncOrderToERP(order);
  
  // Update inventory reservations
  await updateInventoryReservation(order.product.id, order.quantity);
  
  // Send notification
  await sendOrderNotification(order);
}

async function handlePaymentCompleted(payment, order) {
  // Update payment status in ERP
  await updateERPPaymentStatus(order.id, payment);
  
  // Trigger fulfillment if fully paid
  if (payment.type === 'advance') {
    await triggerOrderFulfillment(order.id);
  }
}

async function handleShippingDelivered(shipment, order) {
  // Update delivery status
  await updateDeliveryStatus(order.id, 'delivered');
  
  // Send delivery confirmation
  await sendDeliveryConfirmation(order, shipment);
  
  // Release inventory reservation
  await releaseInventoryReservation(order.product.id, order.quantity);
}

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  const receivedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### React Integration Component

```typescript
import React, { useState, useEffect } from 'react';

interface WebhookEvent {
  event: string;
  timestamp: string;
  data: any;
}

export function WebhookMonitor() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to your webhook event stream
    const eventSource = new EventSource('/api/webhook-events');
    
    eventSource.onopen = () => setConnected(true);
    eventSource.onclose = () => setConnected(false);
    
    eventSource.onmessage = (event) => {
      const webhookEvent = JSON.parse(event.data);
      setEvents(prev => [webhookEvent, ...prev.slice(0, 49)]); // Keep last 50 events
    };
    
    return () => eventSource.close();
  }, []);

  return (
    <div className="webhook-monitor">
      <div className="header">
        <h3>Live Webhook Events</h3>
        <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
      
      <div className="events">
        {events.map((event, index) => (
          <div key={index} className="event">
            <div className="event-header">
              <span className="event-type">{event.event}</span>
              <span className="timestamp">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
            <pre className="event-data">
              {JSON.stringify(event.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Python Flask Example

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = 'your-webhook-secret'

@app.route('/webhooks/vasa', methods=['POST'])
def handle_webhook():
    try:
        # Verify signature
        signature = request.headers.get('X-VASA-Signature', '')
        if not verify_signature(request.get_data(), signature, WEBHOOK_SECRET):
            return 'Invalid signature', 401
        
        # Check for duplicate delivery
        delivery_id = request.headers.get('X-VASA-Delivery')
        if is_duplicate_delivery(delivery_id):
            return 'Already processed', 200
        
        # Process webhook
        payload = request.get_json()
        process_webhook_event(payload)
        
        # Record delivery
        record_delivery(delivery_id, payload)
        
        return 'OK', 200
    except Exception as e:
        app.logger.error(f'Webhook processing error: {e}')
        return 'Internal error', 500

def verify_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    received_signature = signature.replace('sha256=', '')
    
    return hmac.compare_digest(expected_signature, received_signature)

def process_webhook_event(payload):
    event_type = payload['event']
    data = payload['data']
    
    if event_type == 'order.created':
        handle_order_created(data['order'])
    elif event_type == 'payment.completed':
        handle_payment_completed(data['payment'], data['order'])
    elif event_type == 'shipping.delivered':
        handle_shipping_delivered(data['shipment'], data['order'])
    else:
        app.logger.info(f'Unhandled event type: {event_type}')

def handle_order_created(order):
    # Sync order to ERP system
    sync_order_to_erp(order)
    
    # Update inventory
    update_inventory_reservation(order['product']['id'], order['quantity'])

def handle_payment_completed(payment, order):
    # Update payment status in ERP
    update_erp_payment_status(order['id'], payment)

def handle_shipping_delivered(shipment, order):
    # Update delivery status
    update_delivery_status(order['id'], 'delivered')
    
    # Send delivery confirmation
    send_delivery_confirmation(order, shipment)

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

## Support

For webhook integration support:

1. Check this documentation first
2. Review webhook logs in VASA dashboard
3. Test with webhook testing tools
4. Contact VASA support with specific error details

## API Reference

### Webhook Management Endpoints

#### List Webhooks
```http
GET /api/webhooks
Authorization: Bearer <token>
```

#### Create Webhook
```http
POST /api/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Webhook",
  "url": "https://example.com/webhook",
  "events": ["order.created"]
}
```

#### Update Webhook
```http
PUT /api/webhooks/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Webhook
```http
DELETE /api/webhooks/{id}
Authorization: Bearer <token>
```

#### Test Webhook
```http
POST /api/webhooks/{id}/test
Authorization: Bearer <token>
```

#### Get Webhook Logs
```http
GET /api/webhooks/{id}/logs
Authorization: Bearer <token>
```

For complete API documentation, visit the [VASA API Documentation](https://docs.vasa.com/api).
