import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Error Log Schema
const errorLogSchema = new mongoose.Schema({
  errorId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    index: true
  },
  
  // Error Classification
  type: {
    type: String,
    enum: [
      'JAVASCRIPT_ERROR',
      'API_ERROR', 
      'DATABASE_ERROR',
      'AUTHENTICATION_ERROR',
      'VALIDATION_ERROR',
      'NETWORK_ERROR',
      'FILE_UPLOAD_ERROR',
      'PAYMENT_ERROR',
      'BUSINESS_LOGIC_ERROR',
      'UNKNOWN_ERROR'
    ],
    required: true
  },
  
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  
  status: {
    type: String,
    enum: ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED', 'IGNORED'],
    default: 'OPEN'
  },
  
  // Error Details
  message: {
    type: String,
    required: true
  },
  
  stack: String,
  code: String, // Error code if available
  
  // Context Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  sessionId: String,
  
  // Request Information
  url: String,
  method: String,
  userAgent: String,
  ipAddress: String,
  headers: Object,
  body: Object,
  query: Object,
  params: Object,
  
  // Browser/Environment
  browser: {
    name: String,
    version: String
  },
  
  os: {
    name: String,
    version: String
  },
  
  device: {
    type: String,
    model: String
  },
  
  viewport: {
    width: Number,
    height: Number
  },
  
  // Application State
  route: String,
  component: String,
  action: String,
  
  // Additional Context
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Related Errors
  fingerprint: String, // For grouping similar errors
  occurrenceCount: {
    type: Number,
    default: 1
  },
  
  firstOccurrence: {
    type: Date,
    default: Date.now
  },
  
  lastOccurrence: {
    type: Date,
    default: Date.now
  },
  
  // Resolution Information
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  resolvedAt: Date,
  resolutionNotes: String,
  
  // Impact Assessment
  usersAffected: {
    type: Number,
    default: 1
  },
  
  tags: [String],
  
  // Attachments (screenshots, logs, etc.)
  attachments: [{
    filename: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  index: [
    { type: 1, severity: 1, createdAt: -1 },
    { fingerprint: 1 },
    { userId: 1, createdAt: -1 },
    { status: 1, createdAt: -1 }
  ]
});

// TTL index to auto-delete old logs after 6 months
errorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 6 * 30 * 24 * 60 * 60 });

const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);

// Bug Report Schema (User-submitted reports)
const bugReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    index: true
  },
  
  // Reporter Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  email: String,
  
  // Report Details
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  stepsToReproduce: {
    type: String,
    maxlength: 1000
  },
  
  expectedBehavior: {
    type: String,
    maxlength: 500
  },
  
  actualBehavior: {
    type: String,
    maxlength: 500
  },
  
  // Classification
  category: {
    type: String,
    enum: [
      'USER_INTERFACE',
      'FUNCTIONALITY',
      'PERFORMANCE',
      'SECURITY',
      'DATA_LOSS',
      'INTEGRATION',
      'MOBILE_RESPONSIVE',
      'BROWSER_COMPATIBILITY',
      'OTHER'
    ],
    required: true
  },
  
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  
  severity: {
    type: String,
    enum: ['MINOR', 'MAJOR', 'CRITICAL', 'BLOCKER'],
    default: 'MINOR'
  },
  
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'DUPLICATE', 'WONT_FIX'],
    default: 'OPEN'
  },
  
  // Environment Information
  browser: {
    name: String,
    version: String
  },
  
  os: {
    name: String,
    version: String
  },
  
  device: String,
  viewport: String,
  url: String,
  
  // Attachments
  screenshots: [{
    filename: String,
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  files: [{
    filename: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Assignment and Tracking
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  assignedAt: Date,
  
  // Resolution
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  resolvedAt: Date,
  resolution: String,
  
  // Related Issues
  relatedErrorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ErrorLog'
  },
  
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BugReport'
  },
  
  // Comments/Updates
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Voting/Rating
  upvotes: {
    type: Number,
    default: 0
  },
  
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  index: [
    { status: 1, priority: 1, createdAt: -1 },
    { userId: 1, createdAt: -1 },
    { category: 1, createdAt: -1 },
    { assignedTo: 1, status: 1 }
  ]
});

const BugReport = mongoose.model('BugReport', bugReportSchema);

// Error Tracker Utility Class
export class ErrorTracker {
  
  // Log JavaScript/Frontend Errors
  static async logError({
    type = 'UNKNOWN_ERROR',
    message,
    stack,
    severity = 'MEDIUM',
    userId = null,
    sessionId = null,
    url = '',
    userAgent = '',
    metadata = {},
    req = null
  }) {
    try {
      // Generate fingerprint for grouping similar errors
      const fingerprint = this.generateFingerprint(message, stack, type);
      
      // Check if similar error exists recently (last 24 hours)
      const existingError = await ErrorLog.findOne({
        fingerprint,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      if (existingError) {
        // Update existing error occurrence
        existingError.occurrenceCount += 1;
        existingError.lastOccurrence = new Date();
        existingError.usersAffected = await this.countAffectedUsers(fingerprint);
        await existingError.save();
        return existingError;
      }
      
      // Extract additional info from request if available
      let requestInfo = {};
      if (req) {
        requestInfo = {
          method: req.method,
          headers: this.sanitizeHeaders(req.headers),
          query: req.query,
          params: req.params,
          body: this.sanitizeBody(req.body),
          ipAddress: req.ip || req.connection?.remoteAddress
        };
      }
      
      // Create new error log
      const errorLog = new ErrorLog({
        type,
        message,
        stack,
        severity,
        userId,
        sessionId,
        url,
        userAgent,
        fingerprint,
        metadata,
        ...requestInfo
      });
      
      await errorLog.save();
      
      // Auto-escalate critical errors
      if (severity === 'CRITICAL') {
        await this.escalateCriticalError(errorLog);
      }
      
      return errorLog;
      
    } catch (error) {
      console.error('Failed to log error:', error);
      // Fallback to console logging
      console.error('Original error:', { type, message, stack, severity });
    }
  }
  
  // Generate fingerprint for error grouping
  static generateFingerprint(message, stack, type) {
    const crypto = require('crypto');
    
    // Clean stack trace - remove dynamic parts like line numbers, timestamps
    const cleanStack = stack ? 
      stack.replace(/:\d+:\d+/g, ':X:X') // Remove line:column numbers
           .replace(/\d{13}/g, 'TIMESTAMP') // Remove timestamps
           .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, 'UUID') // Remove UUIDs
      : '';
    
    const cleanMessage = message.replace(/\d+/g, 'N').replace(/[a-f0-9]{24}/gi, 'ID');
    
    const fingerprintInput = `${type}:${cleanMessage}:${cleanStack}`;
    return crypto.createHash('md5').update(fingerprintInput).digest('hex');
  }
  
  // Count unique users affected by similar errors
  static async countAffectedUsers(fingerprint) {
    const users = await ErrorLog.distinct('userId', { 
      fingerprint,
      userId: { $ne: null },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });
    return users.length;
  }
  
  // Sanitize sensitive headers
  static sanitizeHeaders(headers) {
    const sensitive = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    const sanitized = { ...headers };
    
    sensitive.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
  
  // Sanitize request body
  static sanitizeBody(body) {
    if (!body || typeof body !== 'object') return body;
    
    const sensitive = ['password', 'token', 'secret', 'key', 'auth'];
    const sanitized = { ...body };
    
    const sanitizeRecursive = (obj) => {
      for (const [key, value] of Object.entries(obj)) {
        if (sensitive.some(s => key.toLowerCase().includes(s))) {
          obj[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          sanitizeRecursive(value);
        }
      }
    };
    
    sanitizeRecursive(sanitized);
    return sanitized;
  }
  
  // Escalate critical errors
  static async escalateCriticalError(errorLog) {
    // In production, this would send alerts to monitoring systems
    console.error('CRITICAL ERROR DETECTED:', {
      errorId: errorLog.errorId,
      message: errorLog.message,
      type: errorLog.type,
      userId: errorLog.userId
    });
    
    // Could integrate with:
    // - Slack notifications
    // - Email alerts
    // - PagerDuty
    // - SMS alerts
  }
  
  // Get error statistics
  static async getErrorStats(timeRange = '24h') {
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const since = new Date(Date.now() - timeRanges[timeRange]);
    
    const stats = await ErrorLog.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            type: '$type',
            severity: '$severity'
          },
          count: { $sum: '$occurrenceCount' },
          uniqueErrors: { $sum: 1 },
          usersAffected: { $sum: '$usersAffected' }
        }
      },
      {
        $group: {
          _id: '$_id.type',
          total: { $sum: '$count' },
          severityBreakdown: {
            $push: {
              severity: '$_id.severity',
              count: '$count',
              uniqueErrors: '$uniqueErrors',
              usersAffected: '$usersAffected'
            }
          }
        }
      }
    ]);
    
    return stats;
  }
  
  // Resolve error
  static async resolveError(errorId, resolvedBy, resolutionNotes) {
    return await ErrorLog.findOneAndUpdate(
      { errorId },
      {
        status: 'RESOLVED',
        resolvedBy,
        resolvedAt: new Date(),
        resolutionNotes
      },
      { new: true }
    );
  }
}

// Export models and tracker
export { ErrorLog, BugReport, ErrorTracker };
export default ErrorTracker;
