import mongoose from 'mongoose';

// Activity Log Schema
const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Authentication actions
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'PASSWORD_CHANGED',
      'PASSWORD_RESET_REQUESTED',
      'PASSWORD_RESET_COMPLETED',
      'MFA_ENABLED',
      'MFA_DISABLED',
      'MFA_VERIFIED',
      'MFA_FAILED',
      
      // Profile actions
      'PROFILE_UPDATED',
      'PROFILE_VIEWED',
      'KYC_SUBMITTED',
      'KYC_APPROVED',
      'KYC_REJECTED',
      
      // Product actions
      'PRODUCT_CREATED',
      'PRODUCT_UPDATED',
      'PRODUCT_DELETED',
      'PRODUCT_VIEWED',
      'PRODUCT_SEARCHED',
      
      // Order actions
      'ORDER_CREATED',
      'ORDER_UPDATED',
      'ORDER_CANCELLED',
      'ORDER_PAYMENT_MADE',
      'ORDER_SHIPPED',
      'ORDER_DELIVERED',
      'ORDER_DISPUTED',
      
      // Message actions
      'MESSAGE_SENT',
      'MESSAGE_RECEIVED',
      'MESSAGE_DELETED',
      
      // Admin actions
      'USER_SUSPENDED',
      'USER_UNSUSPENDED',
      'USER_ROLE_CHANGED',
      'SYSTEM_SETTINGS_CHANGED',
      
      // Security actions
      'SUSPICIOUS_ACTIVITY_DETECTED',
      'IP_BLOCKED',
      'ACCOUNT_LOCKED',
      'ACCOUNT_UNLOCKED'
    ]
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  category: {
    type: String,
    enum: ['AUTHENTICATION', 'PROFILE', 'PRODUCT', 'ORDER', 'MESSAGE', 'ADMIN', 'SECURITY'],
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
    default: 'SUCCESS'
  },
  sessionId: String,
  relatedEntities: [{
    entityType: {
      type: String,
      enum: ['USER', 'PRODUCT', 'ORDER', 'MESSAGE']
    },
    entityId: mongoose.Schema.Types.ObjectId,
    entityName: String
  }]
}, {
  timestamps: true,
  // Index for efficient querying
  index: [
    { userId: 1, createdAt: -1 },
    { action: 1, createdAt: -1 },
    { ipAddress: 1, createdAt: -1 },
    { severity: 1, createdAt: -1 }
  ]
});

// TTL index to automatically delete old logs after 1 year
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// Helper functions for logging activities
export const logActivity = async ({
  userId,
  action,
  description,
  metadata = {},
  req,
  severity = 'LOW',
  category,
  status = 'SUCCESS',
  relatedEntities = []
}) => {
  try {
    const ipAddress = req?.ip || req?.connection?.remoteAddress || 'unknown';
    const userAgent = req?.get('User-Agent') || 'unknown';
    const sessionId = req?.sessionID || req?.headers?.['x-session-id'];
    
    const logEntry = new ActivityLog({
      userId,
      action,
      description,
      metadata,
      ipAddress,
      userAgent,
      severity,
      category,
      status,
      sessionId,
      relatedEntities
    });
    
    await logEntry.save();
    
    // If critical severity, you might want to send alerts
    if (severity === 'CRITICAL') {
      await handleCriticalActivity(logEntry);
    }
    
    return logEntry;
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to avoid breaking the main application flow
  }
};

// Specific logging functions for common activities
export const logAuthActivity = async (userId, action, req, success = true, metadata = {}) => {
  return logActivity({
    userId,
    action,
    description: `User ${action.toLowerCase().replace('_', ' ')}`,
    metadata,
    req,
    severity: success ? 'LOW' : 'MEDIUM',
    category: 'AUTHENTICATION',
    status: success ? 'SUCCESS' : 'FAILED'
  });
};

export const logProfileActivity = async (userId, action, req, metadata = {}) => {
  return logActivity({
    userId,
    action,
    description: `User ${action.toLowerCase().replace('_', ' ')}`,
    metadata,
    req,
    severity: 'LOW',
    category: 'PROFILE'
  });
};

export const logProductActivity = async (userId, action, req, productId = null, metadata = {}) => {
  const relatedEntities = productId ? [{
    entityType: 'PRODUCT',
    entityId: productId,
    entityName: metadata.productName || 'Unknown Product'
  }] : [];
  
  return logActivity({
    userId,
    action,
    description: `User ${action.toLowerCase().replace('_', ' ')}`,
    metadata,
    req,
    severity: 'LOW',
    category: 'PRODUCT',
    relatedEntities
  });
};

export const logOrderActivity = async (userId, action, req, orderId = null, metadata = {}) => {
  const relatedEntities = orderId ? [{
    entityType: 'ORDER',
    entityId: orderId,
    entityName: metadata.orderNumber || 'Unknown Order'
  }] : [];
  
  return logActivity({
    userId,
    action,
    description: `User ${action.toLowerCase().replace('_', ' ')}`,
    metadata,
    req,
    severity: action.includes('PAYMENT') ? 'MEDIUM' : 'LOW',
    category: 'ORDER',
    relatedEntities
  });
};

export const logSecurityActivity = async (userId, action, req, metadata = {}) => {
  return logActivity({
    userId,
    action,
    description: `Security event: ${action.toLowerCase().replace('_', ' ')}`,
    metadata,
    req,
    severity: 'HIGH',
    category: 'SECURITY'
  });
};

// Get user activity logs with pagination
export const getUserActivityLogs = async (userId, options = {}) => {
  const {
    page = 1,
    limit = 50,
    category = null,
    action = null,
    fromDate = null,
    toDate = null,
    severity = null
  } = options;
  
  const query = { userId };
  
  if (category) query.category = category;
  if (action) query.action = action;
  if (severity) query.severity = severity;
  
  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = new Date(fromDate);
    if (toDate) query.createdAt.$lte = new Date(toDate);
  }
  
  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('relatedEntities.entityId'),
    ActivityLog.countDocuments(query)
  ]);
  
  return {
    logs,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

// Handle critical activities (could trigger alerts, notifications, etc.)
const handleCriticalActivity = async (logEntry) => {
  // Implement your critical activity handling logic here
  // e.g., send email alerts, Slack notifications, etc.
  console.warn('CRITICAL ACTIVITY DETECTED:', logEntry.action, logEntry.description);
};

export default ActivityLog;
