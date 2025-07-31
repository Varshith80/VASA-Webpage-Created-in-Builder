import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import ExpressBrute from 'express-brute';
import MemoryStore from 'express-brute/lib/MemoryStore';

// Memory store for brute force protection (use Redis in production)
const store = new MemoryStore();

// Brute force protection for login attempts
export const loginBruteForce = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour
  failCallback: function (req, res, next, nextValidRequestDate) {
    const message = `Too many failed login attempts. Account temporarily locked until ${nextValidRequestDate}`;
    res.status(429).json({
      success: false,
      message,
      lockUntil: nextValidRequestDate
    });
  }
});

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true,
  // Store client IP for tracking
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  }
});

// Stricter rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again later.'
  },
  skipSuccessfulRequests: false
});

// Rate limiting for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts from this IP, please try again later.'
  }
});

// Slow down repeated requests
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes at full speed, then...
  delayMs: 500 // add 500ms of delay per request after delayAfter
});

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// IP-based account locking middleware
export const ipAccountLock = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  
  // Check if IP is in suspicious activity list (implement your logic)
  if (req.suspiciousIPs && req.suspiciousIPs.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied due to suspicious activity from this IP address.'
    });
  }
  
  next();
};

// Track failed login attempts per IP
const failedAttempts = new Map();

export const trackFailedLogins = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  
  // Reset successful login attempts
  if (req.loginSuccess) {
    failedAttempts.delete(clientIP);
    return next();
  }
  
  // Track failed attempts
  if (req.loginFailed) {
    const attempts = failedAttempts.get(clientIP) || 0;
    const newAttempts = attempts + 1;
    failedAttempts.set(clientIP, newAttempts);
    
    // Auto-lock after 10 failed attempts from same IP
    if (newAttempts >= 10) {
      // Add to suspicious IPs list (implement persistent storage)
      req.suspiciousIPs = req.suspiciousIPs || [];
      if (!req.suspiciousIPs.includes(clientIP)) {
        req.suspiciousIPs.push(clientIP);
      }
      
      // Clear failed attempts for this IP
      failedAttempts.delete(clientIP);
      
      return res.status(429).json({
        success: false,
        message: 'IP address temporarily blocked due to multiple failed login attempts.'
      });
    }
  }
  
  next();
};

// Clean up old failed attempts every hour
setInterval(() => {
  failedAttempts.clear();
}, 60 * 60 * 1000);
