const { webhookService } = require("./webhookService");

/**
 * Webhook Event Emitter
 * This utility provides helper functions to trigger webhook events
 * from various parts of the application
 */
class WebhookEvents {
  /**
   * Transform user object for webhook payload
   */
  static transformUser(user) {
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      role: user.role,
      country: user.address?.country,
    };
  }

  /**
   * Transform product object for webhook payload
   */
  static transformProduct(product) {
    return {
      id: product._id.toString(),
      title: product.title,
      category: product.category,
      subcategory: product.subcategory,
      pricing: {
        basePrice: product.pricing.basePrice,
        currency: product.pricing.currency,
        unit: product.pricing.unit,
      },
      inventory: {
        availableQuantity: product.inventory.availableQuantity,
        reservedQuantity: product.inventory.reservedQuantity,
      },
      seller: product.seller ? this.transformUser(product.seller) : null,
    };
  }

  /**
   * Transform order object for webhook payload
   */
  static transformOrder(order) {
    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      buyer: order.buyer ? this.transformUser(order.buyer) : null,
      seller: order.seller ? this.transformUser(order.seller) : null,
      product: order.product ? this.transformProduct(order.product) : null,
      quantity: order.quantity,
      unit: order.unit,
      unitPrice: order.unitPrice,
      currency: order.currency,
      pricing: {
        subtotal: order.pricing.subtotal,
        total: order.pricing.total,
        platformFee: order.pricing.platformFee,
        shippingCost: order.pricing.shippingCost,
      },
      shipping: {
        method: order.shipping?.method,
        carrier: order.shipping?.carrier,
        trackingNumber: order.shipping?.trackingNumber,
        estimatedDelivery: order.shipping?.estimatedDelivery?.toISOString(),
        actualDelivery: order.shipping?.actualDelivery?.toISOString(),
        shippingAddress: order.shipping?.shippingAddress,
      },
      paymentPlan: {
        advance: {
          amount: order.paymentPlan.advance.amount,
          status: order.paymentPlan.advance.status,
          dueDate: order.paymentPlan.advance.dueDate?.toISOString(),
          paidDate: order.paymentPlan.advance.paidDate?.toISOString(),
        },
        shipment: {
          amount: order.paymentPlan.shipment.amount,
          status: order.paymentPlan.shipment.status,
          dueDate: order.paymentPlan.shipment.dueDate?.toISOString(),
          paidDate: order.paymentPlan.shipment.paidDate?.toISOString(),
        },
        delivery: {
          amount: order.paymentPlan.delivery.amount,
          status: order.paymentPlan.delivery.status,
          dueDate: order.paymentPlan.delivery.dueDate?.toISOString(),
          paidDate: order.paymentPlan.delivery.paidDate?.toISOString(),
        },
      },
      orderDate: order.orderDate?.toISOString(),
      expectedDeliveryDate: order.expectedDeliveryDate?.toISOString(),
    };
  }

  /**
   * Transform payment information for webhook payload
   */
  static transformPayment(order, paymentType, paymentInfo = {}) {
    const payment = order.paymentPlan[paymentType];
    return {
      id: paymentInfo.id || `${order._id}_${paymentType}`,
      orderId: order._id.toString(),
      type: paymentType,
      amount: payment.amount,
      currency: order.currency,
      status: payment.status,
      paymentMethod: paymentInfo.paymentMethod,
      transactionId: payment.paymentId || paymentInfo.transactionId,
      processedAt: payment.paidDate?.toISOString(),
      failureReason: paymentInfo.failureReason,
    };
  }

  /**
   * Transform shipping information for webhook payload
   */
  static transformShipment(order) {
    return {
      id: order._id.toString(),
      orderId: order._id.toString(),
      carrier: order.shipping?.carrier,
      trackingNumber: order.shipping?.trackingNumber,
      method: order.shipping?.method,
      status: order.status,
      estimatedDelivery: order.shipping?.estimatedDelivery?.toISOString(),
      actualDelivery: order.shipping?.actualDelivery?.toISOString(),
      shippingAddress: order.shipping?.shippingAddress,
      packagingDetails: order.shipping?.packagingDetails,
      shippingTerms: order.shipping?.shippingTerms,
      port: order.shipping?.port,
    };
  }

  // Order Events
  static async emitOrderCreated(order) {
    try {
      const eventData = {
        order: this.transformOrder(order),
      };
      
      await webhookService.triggerWebhooks("order.created", eventData);
      console.log(`Webhook triggered: order.created for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering order.created webhook:", error);
    }
  }

  static async emitOrderUpdated(order, previousStatus, changes = []) {
    try {
      const eventData = {
        order: this.transformOrder(order),
        previous_status: previousStatus,
        changes,
      };
      
      await webhookService.triggerWebhooks("order.updated", eventData);
      console.log(`Webhook triggered: order.updated for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering order.updated webhook:", error);
    }
  }

  static async emitOrderCancelled(order, cancelledBy, reason) {
    try {
      const eventData = {
        order: this.transformOrder(order),
        cancelled_by: this.transformUser(cancelledBy),
        reason,
        cancellation_fee: order.cancellation?.cancellationFee || 0,
        refund_amount: order.cancellation?.refundAmount || 0,
      };
      
      await webhookService.triggerWebhooks("order.cancelled", eventData);
      console.log(`Webhook triggered: order.cancelled for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering order.cancelled webhook:", error);
    }
  }

  static async emitOrderCompleted(order) {
    try {
      const eventData = {
        order: this.transformOrder(order),
        completion_date: order.completionDate?.toISOString(),
        total_amount_paid: order.totalPaid,
      };
      
      await webhookService.triggerWebhooks("order.completed", eventData);
      console.log(`Webhook triggered: order.completed for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering order.completed webhook:", error);
    }
  }

  static async emitOrderDisputed(order, dispute, raisedBy) {
    try {
      const eventData = {
        order: this.transformOrder(order),
        dispute: {
          id: dispute._id.toString(),
          raised_by: this.transformUser(raisedBy),
          reason: dispute.reason,
          description: dispute.description,
          raised_date: dispute.raisedDate?.toISOString(),
          status: dispute.status,
        },
      };
      
      await webhookService.triggerWebhooks("order.disputed", eventData);
      console.log(`Webhook triggered: order.disputed for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering order.disputed webhook:", error);
    }
  }

  // Payment Events
  static async emitPaymentPending(order, paymentType, dueDate) {
    try {
      const eventData = {
        payment: this.transformPayment(order, paymentType),
        order: this.transformOrder(order),
        due_date: dueDate?.toISOString(),
      };
      
      await webhookService.triggerWebhooks("payment.pending", eventData);
      console.log(`Webhook triggered: payment.pending for order ${order.orderNumber}, type: ${paymentType}`);
    } catch (error) {
      console.error("Error triggering payment.pending webhook:", error);
    }
  }

  static async emitPaymentCompleted(order, paymentType, paymentInfo = {}) {
    try {
      const eventData = {
        payment: this.transformPayment(order, paymentType, paymentInfo),
        order: this.transformOrder(order),
      };
      
      await webhookService.triggerWebhooks("payment.completed", eventData);
      await webhookService.triggerWebhooks(`payment.${paymentType}_paid`, eventData);
      console.log(`Webhook triggered: payment.completed and payment.${paymentType}_paid for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering payment.completed webhook:", error);
    }
  }

  static async emitPaymentFailed(order, paymentType, failureReason, retryAllowed = true) {
    try {
      const eventData = {
        payment: this.transformPayment(order, paymentType, { failureReason }),
        order: this.transformOrder(order),
        failure_reason: failureReason,
        retry_allowed: retryAllowed,
      };
      
      await webhookService.triggerWebhooks("payment.failed", eventData);
      console.log(`Webhook triggered: payment.failed for order ${order.orderNumber}, type: ${paymentType}`);
    } catch (error) {
      console.error("Error triggering payment.failed webhook:", error);
    }
  }

  static async emitPaymentRefunded(order, paymentType, refundAmount, refundReason) {
    try {
      const eventData = {
        payment: this.transformPayment(order, paymentType),
        order: this.transformOrder(order),
        refund_amount: refundAmount,
        refund_reason: refundReason,
        refund_date: new Date().toISOString(),
      };
      
      await webhookService.triggerWebhooks("payment.refunded", eventData);
      console.log(`Webhook triggered: payment.refunded for order ${order.orderNumber}, type: ${paymentType}`);
    } catch (error) {
      console.error("Error triggering payment.refunded webhook:", error);
    }
  }

  // Shipping Events
  static async emitShippingReadyToShip(order) {
    try {
      const eventData = {
        shipment: this.transformShipment(order),
        order: this.transformOrder(order),
      };
      
      await webhookService.triggerWebhooks("shipping.ready_to_ship", eventData);
      console.log(`Webhook triggered: shipping.ready_to_ship for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering shipping.ready_to_ship webhook:", error);
    }
  }

  static async emitShippingShipped(order, shippedDate) {
    try {
      const eventData = {
        shipment: this.transformShipment(order),
        order: this.transformOrder(order),
        shipped_date: shippedDate?.toISOString() || new Date().toISOString(),
      };
      
      await webhookService.triggerWebhooks("shipping.shipped", eventData);
      console.log(`Webhook triggered: shipping.shipped for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering shipping.shipped webhook:", error);
    }
  }

  static async emitShippingInTransit(order, currentLocation, nextCheckpoint) {
    try {
      const eventData = {
        shipment: this.transformShipment(order),
        order: this.transformOrder(order),
        current_location: currentLocation,
        next_checkpoint: nextCheckpoint,
      };
      
      await webhookService.triggerWebhooks("shipping.in_transit", eventData);
      console.log(`Webhook triggered: shipping.in_transit for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering shipping.in_transit webhook:", error);
    }
  }

  static async emitShippingDelivered(order, deliveredDate, receivedBy) {
    try {
      const eventData = {
        shipment: this.transformShipment(order),
        order: this.transformOrder(order),
        delivered_date: deliveredDate?.toISOString() || new Date().toISOString(),
        received_by: receivedBy,
      };
      
      await webhookService.triggerWebhooks("shipping.delivered", eventData);
      console.log(`Webhook triggered: shipping.delivered for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering shipping.delivered webhook:", error);
    }
  }

  static async emitShippingDelayed(order, delayReason, newEstimatedDelivery, delayDurationHours) {
    try {
      const eventData = {
        shipment: this.transformShipment(order),
        order: this.transformOrder(order),
        delay_reason: delayReason,
        new_estimated_delivery: newEstimatedDelivery?.toISOString(),
        delay_duration_hours: delayDurationHours,
      };
      
      await webhookService.triggerWebhooks("shipping.delayed", eventData);
      console.log(`Webhook triggered: shipping.delayed for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering shipping.delayed webhook:", error);
    }
  }

  static async emitShippingReturned(order, returnReason, returnDate) {
    try {
      const eventData = {
        shipment: this.transformShipment(order),
        order: this.transformOrder(order),
        return_reason: returnReason,
        return_date: returnDate?.toISOString() || new Date().toISOString(),
      };
      
      await webhookService.triggerWebhooks("shipping.returned", eventData);
      console.log(`Webhook triggered: shipping.returned for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering shipping.returned webhook:", error);
    }
  }

  // Product Events
  static async emitProductCreated(product) {
    try {
      const eventData = {
        product: this.transformProduct(product),
      };
      
      await webhookService.triggerWebhooks("product.created", eventData);
      console.log(`Webhook triggered: product.created for product ${product.title}`);
    } catch (error) {
      console.error("Error triggering product.created webhook:", error);
    }
  }

  static async emitProductUpdated(product, changes = []) {
    try {
      const eventData = {
        product: this.transformProduct(product),
        changes,
      };
      
      await webhookService.triggerWebhooks("product.updated", eventData);
      console.log(`Webhook triggered: product.updated for product ${product.title}`);
    } catch (error) {
      console.error("Error triggering product.updated webhook:", error);
    }
  }

  static async emitProductDeleted(product, deletedBy, deletionReason) {
    try {
      const eventData = {
        product: this.transformProduct(product),
        deleted_by: this.transformUser(deletedBy),
        deletion_reason: deletionReason,
      };
      
      await webhookService.triggerWebhooks("product.deleted", eventData);
      console.log(`Webhook triggered: product.deleted for product ${product.title}`);
    } catch (error) {
      console.error("Error triggering product.deleted webhook:", error);
    }
  }

  static async emitProductLowStock(product, currentStock, reorderLevel) {
    try {
      const eventData = {
        product: this.transformProduct(product),
        current_stock: currentStock,
        reorder_level: reorderLevel,
        stock_shortage: reorderLevel - currentStock,
      };
      
      await webhookService.triggerWebhooks("product.low_stock", eventData);
      console.log(`Webhook triggered: product.low_stock for product ${product.title}`);
    } catch (error) {
      console.error("Error triggering product.low_stock webhook:", error);
    }
  }

  static async emitProductOutOfStock(product, lastSoldDate, pendingOrdersCount) {
    try {
      const eventData = {
        product: this.transformProduct(product),
        last_sold_date: lastSoldDate?.toISOString(),
        pending_orders_count: pendingOrdersCount,
      };
      
      await webhookService.triggerWebhooks("product.out_of_stock", eventData);
      console.log(`Webhook triggered: product.out_of_stock for product ${product.title}`);
    } catch (error) {
      console.error("Error triggering product.out_of_stock webhook:", error);
    }
  }

  // User/Account Events
  static async emitUserVerified(user, verifiedBy) {
    try {
      const eventData = {
        user: this.transformUser(user),
        verification_date: new Date().toISOString(),
        verified_by: this.transformUser(verifiedBy),
      };
      
      await webhookService.triggerWebhooks("user.verified", eventData);
      console.log(`Webhook triggered: user.verified for user ${user.email}`);
    } catch (error) {
      console.error("Error triggering user.verified webhook:", error);
    }
  }

  static async emitUserSuspended(user, suspendedBy, suspensionReason, suspensionDuration) {
    try {
      const eventData = {
        user: this.transformUser(user),
        suspended_by: this.transformUser(suspendedBy),
        suspension_reason: suspensionReason,
        suspension_date: new Date().toISOString(),
        suspension_duration: suspensionDuration,
      };
      
      await webhookService.triggerWebhooks("user.suspended", eventData);
      console.log(`Webhook triggered: user.suspended for user ${user.email}`);
    } catch (error) {
      console.error("Error triggering user.suspended webhook:", error);
    }
  }

  static async emitAccountKycApproved(user, approvedBy, verifiedDocuments) {
    try {
      const eventData = {
        user: this.transformUser(user),
        approved_by: this.transformUser(approvedBy),
        approval_date: new Date().toISOString(),
        verified_documents: verifiedDocuments,
      };
      
      await webhookService.triggerWebhooks("account.kyc_approved", eventData);
      console.log(`Webhook triggered: account.kyc_approved for user ${user.email}`);
    } catch (error) {
      console.error("Error triggering account.kyc_approved webhook:", error);
    }
  }

  static async emitAccountKycRejected(user, rejectedBy, rejectionReason, requiredDocuments) {
    try {
      const eventData = {
        user: this.transformUser(user),
        rejected_by: this.transformUser(rejectedBy),
        rejection_date: new Date().toISOString(),
        rejection_reason: rejectionReason,
        required_documents: requiredDocuments,
      };
      
      await webhookService.triggerWebhooks("account.kyc_rejected", eventData);
      console.log(`Webhook triggered: account.kyc_rejected for user ${user.email}`);
    } catch (error) {
      console.error("Error triggering account.kyc_rejected webhook:", error);
    }
  }

  // Document Events
  static async emitDocumentUploaded(document, uploadedBy) {
    try {
      const eventData = {
        document: {
          id: document._id.toString(),
          name: document.name,
          type: document.type,
          url: document.url,
          uploadedBy: this.transformUser(uploadedBy),
          uploadDate: document.uploadDate?.toISOString(),
          verified: document.verified,
          relatedEntity: document.relatedEntity ? {
            type: document.relatedEntity.type,
            id: document.relatedEntity.id,
          } : undefined,
        },
      };
      
      await webhookService.triggerWebhooks("document.uploaded", eventData);
      console.log(`Webhook triggered: document.uploaded for document ${document.name}`);
    } catch (error) {
      console.error("Error triggering document.uploaded webhook:", error);
    }
  }

  static async emitDocumentVerified(document, verifiedBy, verificationNotes) {
    try {
      const eventData = {
        document: {
          id: document._id.toString(),
          name: document.name,
          type: document.type,
          url: document.url,
          verified: true,
          verifiedBy: this.transformUser(verifiedBy),
          verifiedDate: new Date().toISOString(),
        },
        verification_notes: verificationNotes,
      };
      
      await webhookService.triggerWebhooks("document.verified", eventData);
      console.log(`Webhook triggered: document.verified for document ${document.name}`);
    } catch (error) {
      console.error("Error triggering document.verified webhook:", error);
    }
  }

  static async emitDocumentRejected(document, rejectedBy, rejectionReason, requiredAction) {
    try {
      const eventData = {
        document: {
          id: document._id.toString(),
          name: document.name,
          type: document.type,
          url: document.url,
          verified: false,
          rejectionReason,
        },
        rejection_reason: rejectionReason,
        required_action: requiredAction,
      };
      
      await webhookService.triggerWebhooks("document.rejected", eventData);
      console.log(`Webhook triggered: document.rejected for document ${document.name}`);
    } catch (error) {
      console.error("Error triggering document.rejected webhook:", error);
    }
  }

  // Compliance Events
  static async emitComplianceCheckRequired(order, complianceType, requiredDocuments, deadline) {
    try {
      const eventData = {
        order: this.transformOrder(order),
        compliance_type: complianceType,
        required_documents: requiredDocuments,
        deadline: deadline?.toISOString(),
      };
      
      await webhookService.triggerWebhooks("compliance.check_required", eventData);
      console.log(`Webhook triggered: compliance.check_required for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering compliance.check_required webhook:", error);
    }
  }

  static async emitComplianceCheckPassed(order, complianceType, checkedBy, notes) {
    try {
      const eventData = {
        order: this.transformOrder(order),
        compliance_type: complianceType,
        checked_by: this.transformUser(checkedBy),
        check_date: new Date().toISOString(),
        notes,
      };
      
      await webhookService.triggerWebhooks("compliance.check_passed", eventData);
      console.log(`Webhook triggered: compliance.check_passed for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering compliance.check_passed webhook:", error);
    }
  }

  static async emitComplianceCheckFailed(order, complianceType, checkedBy, failureReason, requiredAction) {
    try {
      const eventData = {
        order: this.transformOrder(order),
        compliance_type: complianceType,
        checked_by: this.transformUser(checkedBy),
        check_date: new Date().toISOString(),
        failure_reason: failureReason,
        required_action: requiredAction,
      };
      
      await webhookService.triggerWebhooks("compliance.check_failed", eventData);
      console.log(`Webhook triggered: compliance.check_failed for order ${order.orderNumber}`);
    } catch (error) {
      console.error("Error triggering compliance.check_failed webhook:", error);
    }
  }

  // System Events
  static async emitSystemMaintenance(maintenanceType, startTime, endTime, affectedServices, description) {
    try {
      const eventData = {
        maintenance_type: maintenanceType,
        start_time: startTime?.toISOString(),
        end_time: endTime?.toISOString(),
        affected_services: affectedServices,
        description,
      };
      
      await webhookService.triggerWebhooks("system.maintenance", eventData);
      console.log(`Webhook triggered: system.maintenance - ${maintenanceType}`);
    } catch (error) {
      console.error("Error triggering system.maintenance webhook:", error);
    }
  }

  static async emitSystemAlert(alertType, severity, message, affectedUsers, recommendedAction) {
    try {
      const eventData = {
        alert_type: alertType,
        severity,
        message,
        affected_users: affectedUsers,
        recommended_action: recommendedAction,
      };
      
      await webhookService.triggerWebhooks("system.alert", eventData);
      console.log(`Webhook triggered: system.alert - ${alertType} (${severity})`);
    } catch (error) {
      console.error("Error triggering system.alert webhook:", error);
    }
  }
}

module.exports = WebhookEvents;
