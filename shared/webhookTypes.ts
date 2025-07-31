// Webhook Event Types and Payload Schemas
export type WebhookEvent = 
  // Order Events
  | "order.created"
  | "order.updated" 
  | "order.cancelled"
  | "order.completed"
  | "order.disputed"
  
  // Payment Events
  | "payment.pending"
  | "payment.completed"
  | "payment.failed"
  | "payment.refunded"
  | "payment.advance_paid"
  | "payment.shipment_paid" 
  | "payment.delivery_paid"
  
  // Shipping Events
  | "shipping.ready_to_ship"
  | "shipping.shipped"
  | "shipping.in_transit"
  | "shipping.delivered"
  | "shipping.delayed"
  | "shipping.returned"
  
  // Product Events
  | "product.created"
  | "product.updated"
  | "product.deleted"
  | "product.low_stock"
  | "product.out_of_stock"
  
  // User/Account Events
  | "user.verified"
  | "user.suspended"
  | "account.kyc_approved"
  | "account.kyc_rejected"
  
  // Document Events
  | "document.uploaded"
  | "document.verified"
  | "document.rejected"
  
  // Compliance Events
  | "compliance.check_required"
  | "compliance.check_passed"
  | "compliance.check_failed"
  
  // System Events
  | "system.maintenance"
  | "system.alert";

// Base webhook payload structure
export interface BaseWebhookPayload {
  event: WebhookEvent;
  timestamp: string; // ISO 8601 format
  webhook_id: string;
  delivery_id: string;
  api_version: string;
  environment: "production" | "staging" | "development";
}

// Common entity interfaces
export interface WebhookUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  role: "exporter" | "importer" | "admin";
  country: string;
}

export interface WebhookProduct {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  pricing: {
    basePrice: number;
    currency: string;
    unit: string;
  };
  inventory: {
    availableQuantity: number;
    reservedQuantity: number;
  };
  seller: WebhookUser;
}

export interface WebhookOrder {
  id: string;
  orderNumber: string;
  status: string;
  buyer: WebhookUser;
  seller: WebhookUser;
  product: WebhookProduct;
  quantity: number;
  unit: string;
  unitPrice: number;
  currency: string;
  pricing: {
    subtotal: number;
    total: number;
    platformFee: number;
    shippingCost: number;
  };
  shipping: {
    method?: string;
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    shippingAddress: {
      name: string;
      company?: string;
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  paymentPlan: {
    advance: {
      amount: number;
      status: "pending" | "paid" | "failed" | "refunded";
      dueDate?: string;
      paidDate?: string;
    };
    shipment: {
      amount: number;
      status: "pending" | "paid" | "failed" | "refunded";
      dueDate?: string;
      paidDate?: string;
    };
    delivery: {
      amount: number;
      status: "pending" | "paid" | "failed" | "refunded";
      dueDate?: string;
      paidDate?: string;
    };
  };
  orderDate: string;
  expectedDeliveryDate?: string;
}

export interface WebhookPayment {
  id: string;
  orderId: string;
  type: "advance" | "shipment" | "delivery";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: string;
  transactionId?: string;
  processedAt?: string;
  failureReason?: string;
}

export interface WebhookShipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  method: string;
  status: "ready_to_ship" | "shipped" | "in_transit" | "delivered" | "delayed" | "returned";
  estimatedDelivery?: string;
  actualDelivery?: string;
  shippingAddress: {
    name: string;
    company?: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  packagingDetails?: string;
  shippingTerms?: string;
  port?: string;
}

export interface WebhookDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: WebhookUser;
  uploadDate: string;
  verified: boolean;
  verifiedBy?: WebhookUser;
  verifiedDate?: string;
  rejectionReason?: string;
  relatedEntity?: {
    type: "order" | "product" | "user";
    id: string;
  };
}

// Order Event Payloads
export interface OrderCreatedPayload extends BaseWebhookPayload {
  event: "order.created";
  data: {
    order: WebhookOrder;
  };
}

export interface OrderUpdatedPayload extends BaseWebhookPayload {
  event: "order.updated";
  data: {
    order: WebhookOrder;
    previous_status: string;
    changes: string[];
  };
}

export interface OrderCancelledPayload extends BaseWebhookPayload {
  event: "order.cancelled";
  data: {
    order: WebhookOrder;
    cancelled_by: WebhookUser;
    reason: string;
    cancellation_fee: number;
    refund_amount: number;
  };
}

export interface OrderCompletedPayload extends BaseWebhookPayload {
  event: "order.completed";
  data: {
    order: WebhookOrder;
    completion_date: string;
    total_amount_paid: number;
  };
}

export interface OrderDisputedPayload extends BaseWebhookPayload {
  event: "order.disputed";
  data: {
    order: WebhookOrder;
    dispute: {
      id: string;
      raised_by: WebhookUser;
      reason: string;
      description: string;
      raised_date: string;
      status: string;
    };
  };
}

// Payment Event Payloads
export interface PaymentPendingPayload extends BaseWebhookPayload {
  event: "payment.pending";
  data: {
    payment: WebhookPayment;
    order: WebhookOrder;
    due_date?: string;
  };
}

export interface PaymentCompletedPayload extends BaseWebhookPayload {
  event: "payment.completed";
  data: {
    payment: WebhookPayment;
    order: WebhookOrder;
  };
}

export interface PaymentFailedPayload extends BaseWebhookPayload {
  event: "payment.failed";
  data: {
    payment: WebhookPayment;
    order: WebhookOrder;
    failure_reason: string;
    retry_allowed: boolean;
  };
}

export interface PaymentRefundedPayload extends BaseWebhookPayload {
  event: "payment.refunded";
  data: {
    payment: WebhookPayment;
    order: WebhookOrder;
    refund_amount: number;
    refund_reason: string;
    refund_date: string;
  };
}

export interface PaymentAdvancePaidPayload extends BaseWebhookPayload {
  event: "payment.advance_paid";
  data: {
    payment: WebhookPayment;
    order: WebhookOrder;
  };
}

export interface PaymentShipmentPaidPayload extends BaseWebhookPayload {
  event: "payment.shipment_paid";
  data: {
    payment: WebhookPayment;
    order: WebhookOrder;
  };
}

export interface PaymentDeliveryPaidPayload extends BaseWebhookPayload {
  event: "payment.delivery_paid";
  data: {
    payment: WebhookPayment;
    order: WebhookOrder;
  };
}

// Shipping Event Payloads
export interface ShippingReadyToShipPayload extends BaseWebhookPayload {
  event: "shipping.ready_to_ship";
  data: {
    shipment: WebhookShipment;
    order: WebhookOrder;
  };
}

export interface ShippingShippedPayload extends BaseWebhookPayload {
  event: "shipping.shipped";
  data: {
    shipment: WebhookShipment;
    order: WebhookOrder;
    shipped_date: string;
  };
}

export interface ShippingInTransitPayload extends BaseWebhookPayload {
  event: "shipping.in_transit";
  data: {
    shipment: WebhookShipment;
    order: WebhookOrder;
    current_location?: string;
    next_checkpoint?: string;
  };
}

export interface ShippingDeliveredPayload extends BaseWebhookPayload {
  event: "shipping.delivered";
  data: {
    shipment: WebhookShipment;
    order: WebhookOrder;
    delivered_date: string;
    received_by?: string;
  };
}

export interface ShippingDelayedPayload extends BaseWebhookPayload {
  event: "shipping.delayed";
  data: {
    shipment: WebhookShipment;
    order: WebhookOrder;
    delay_reason: string;
    new_estimated_delivery: string;
    delay_duration_hours: number;
  };
}

export interface ShippingReturnedPayload extends BaseWebhookPayload {
  event: "shipping.returned";
  data: {
    shipment: WebhookShipment;
    order: WebhookOrder;
    return_reason: string;
    return_date: string;
  };
}

// Product Event Payloads
export interface ProductCreatedPayload extends BaseWebhookPayload {
  event: "product.created";
  data: {
    product: WebhookProduct;
  };
}

export interface ProductUpdatedPayload extends BaseWebhookPayload {
  event: "product.updated";
  data: {
    product: WebhookProduct;
    changes: string[];
  };
}

export interface ProductDeletedPayload extends BaseWebhookPayload {
  event: "product.deleted";
  data: {
    product: WebhookProduct;
    deleted_by: WebhookUser;
    deletion_reason?: string;
  };
}

export interface ProductLowStockPayload extends BaseWebhookPayload {
  event: "product.low_stock";
  data: {
    product: WebhookProduct;
    current_stock: number;
    reorder_level: number;
    stock_shortage: number;
  };
}

export interface ProductOutOfStockPayload extends BaseWebhookPayload {
  event: "product.out_of_stock";
  data: {
    product: WebhookProduct;
    last_sold_date?: string;
    pending_orders_count: number;
  };
}

// User/Account Event Payloads
export interface UserVerifiedPayload extends BaseWebhookPayload {
  event: "user.verified";
  data: {
    user: WebhookUser;
    verification_date: string;
    verified_by: WebhookUser;
  };
}

export interface UserSuspendedPayload extends BaseWebhookPayload {
  event: "user.suspended";
  data: {
    user: WebhookUser;
    suspended_by: WebhookUser;
    suspension_reason: string;
    suspension_date: string;
    suspension_duration?: string;
  };
}

export interface AccountKycApprovedPayload extends BaseWebhookPayload {
  event: "account.kyc_approved";
  data: {
    user: WebhookUser;
    approved_by: WebhookUser;
    approval_date: string;
    verified_documents: string[];
  };
}

export interface AccountKycRejectedPayload extends BaseWebhookPayload {
  event: "account.kyc_rejected";
  data: {
    user: WebhookUser;
    rejected_by: WebhookUser;
    rejection_date: string;
    rejection_reason: string;
    required_documents: string[];
  };
}

// Document Event Payloads
export interface DocumentUploadedPayload extends BaseWebhookPayload {
  event: "document.uploaded";
  data: {
    document: WebhookDocument;
  };
}

export interface DocumentVerifiedPayload extends BaseWebhookPayload {
  event: "document.verified";
  data: {
    document: WebhookDocument;
    verification_notes?: string;
  };
}

export interface DocumentRejectedPayload extends BaseWebhookPayload {
  event: "document.rejected";
  data: {
    document: WebhookDocument;
    rejection_reason: string;
    required_action: string;
  };
}

// Compliance Event Payloads
export interface ComplianceCheckRequiredPayload extends BaseWebhookPayload {
  event: "compliance.check_required";
  data: {
    order: WebhookOrder;
    compliance_type: string;
    required_documents: string[];
    deadline: string;
  };
}

export interface ComplianceCheckPassedPayload extends BaseWebhookPayload {
  event: "compliance.check_passed";
  data: {
    order: WebhookOrder;
    compliance_type: string;
    checked_by: WebhookUser;
    check_date: string;
    notes?: string;
  };
}

export interface ComplianceCheckFailedPayload extends BaseWebhookPayload {
  event: "compliance.check_failed";
  data: {
    order: WebhookOrder;
    compliance_type: string;
    checked_by: WebhookUser;
    check_date: string;
    failure_reason: string;
    required_action: string;
  };
}

// System Event Payloads
export interface SystemMaintenancePayload extends BaseWebhookPayload {
  event: "system.maintenance";
  data: {
    maintenance_type: "scheduled" | "emergency";
    start_time: string;
    end_time: string;
    affected_services: string[];
    description: string;
  };
}

export interface SystemAlertPayload extends BaseWebhookPayload {
  event: "system.alert";
  data: {
    alert_type: "security" | "performance" | "error" | "warning";
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    affected_users?: string[];
    recommended_action?: string;
  };
}

// Union type for all webhook payloads
export type WebhookPayload = 
  | OrderCreatedPayload
  | OrderUpdatedPayload
  | OrderCancelledPayload
  | OrderCompletedPayload
  | OrderDisputedPayload
  | PaymentPendingPayload
  | PaymentCompletedPayload
  | PaymentFailedPayload
  | PaymentRefundedPayload
  | PaymentAdvancePaidPayload
  | PaymentShipmentPaidPayload
  | PaymentDeliveryPaidPayload
  | ShippingReadyToShipPayload
  | ShippingShippedPayload
  | ShippingInTransitPayload
  | ShippingDeliveredPayload
  | ShippingDelayedPayload
  | ShippingReturnedPayload
  | ProductCreatedPayload
  | ProductUpdatedPayload
  | ProductDeletedPayload
  | ProductLowStockPayload
  | ProductOutOfStockPayload
  | UserVerifiedPayload
  | UserSuspendedPayload
  | AccountKycApprovedPayload
  | AccountKycRejectedPayload
  | DocumentUploadedPayload
  | DocumentVerifiedPayload
  | DocumentRejectedPayload
  | ComplianceCheckRequiredPayload
  | ComplianceCheckPassedPayload
  | ComplianceCheckFailedPayload
  | SystemMaintenancePayload
  | SystemAlertPayload;

// Webhook Configuration Interface
export interface WebhookConfig {
  id?: string;
  name: string;
  description?: string;
  url: string;
  method: "POST" | "PUT" | "PATCH";
  events: WebhookEvent[];
  secret?: string;
  headers?: Record<string, string>;
  isActive: boolean;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
    timeout: number;
  };
  filters?: {
    orderStatuses?: string[];
    paymentTypes?: string[];
    minOrderValue?: number;
    countries?: string[];
    productCategories?: string[];
  };
  rateLimit?: {
    enabled: boolean;
    maxRequestsPerMinute: number;
    maxRequestsPerHour: number;
  };
}

// Webhook Log Interface
export interface WebhookLog {
  id: string;
  webhookId: string;
  eventType: WebhookEvent;
  eventId: string;
  status: "pending" | "success" | "failed" | "retry" | "abandoned";
  attempts: number;
  maxAttempts: number;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    payload: any;
    timestamp: string;
  };
  response?: {
    statusCode: number;
    body: string;
    responseTime: number;
  };
  error?: {
    message: string;
    type: string;
  };
  createdAt: string;
  nextRetryAt?: string;
}

// Webhook Statistics Interface
export interface WebhookStats {
  totalWebhooks: number;
  activeWebhooks: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  averageSuccessRate: number;
  averageResponseTime: number;
}
