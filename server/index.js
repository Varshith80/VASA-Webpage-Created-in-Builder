import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

// Import middleware
import { securityHeaders, apiLimiter, speedLimiter, ipAccountLock } from "./middleware/security.js";
import { auth } from "./middleware/auth.js";

// Import routes
import authRoutes from "./routes/auth.js";
import mfaRoutes from "./routes/mfa.js";
import searchRoutes from "./routes/search.js";
import complianceRoutes from "./routes/compliance.js";
import bugReportRoutes from "./routes/bugReports.js";

// Import utilities
import { ErrorTracker } from "./utils/errorTracker.js";
import { logActivity } from "./utils/activityLogger.js";

// Environment variables with defaults
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/vasa";
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const NODE_ENV = process.env.NODE_ENV || "development";

// Database connection
async function connectDatabase() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    // In development, continue without database for demo purposes
    if (NODE_ENV === "development") {
      console.warn("⚠️  Continuing in demo mode without database");
    } else {
      process.exit(1);
    }
  }
}

// Error tracking middleware
const errorTrackingMiddleware = async (err, req, res, next) => {
  // Log error to our tracking system
  await ErrorTracker.logError({
    type: 'API_ERROR',
    message: err.message,
    stack: err.stack,
    severity: err.statusCode >= 500 ? 'HIGH' : 'MEDIUM',
    userId: req.user?.id,
    sessionId: req.sessionID,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    metadata: {
      method: req.method,
      statusCode: err.statusCode || 500,
      endpoint: req.route?.path
    },
    req
  });

  // Send error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Create server
const createServer = () => {
  const app = express();

  // Connect to database
  connectDatabase();

  // Security middleware
  app.use(securityHeaders);
  app.use(speedLimiter);
  app.use(ipAccountLock);

  // CORS configuration
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
          "http://localhost:3000",
          "http://localhost:8080",
          "https://vasa-platform.netlify.app", // Production domain
          process.env.FRONTEND_URL
        ].filter(Boolean);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static file serving for uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      service: "VASA API",
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
  });

  // API Routes with rate limiting
  app.use("/api/auth", apiLimiter, authRoutes);
  app.use("/api/mfa", mfaRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/compliance", complianceRoutes);
  app.use("/api/bug-reports", bugReportRoutes);

  // Demo endpoints for development
  app.get("/api/demo", (req, res) => {
    res.json({
      message: "Welcome to VASA Global Trade Platform!",
      features: [
        "✅ Multi-Factor Authentication (MFA)",
        "✅ Role-Based Access Control (RBAC)",
        "✅ Advanced Security & Rate Limiting",
        "✅ Global Search with Autocomplete",
        "✅ Export/Import Compliance Checker",
        "✅ Activity Logging & Audit Trail",
        "✅ Error Tracking & Bug Reporting",
        "🚧 Invoice Generation",
        "🚧 Analytics Dashboard",
        "🚧 PWA Support",
        "🚧 Webhook Integrations"
      ],
      version: "2.0.0",
      buildDate: new Date().toISOString()
    });
  });

  // Fallback demo auth endpoints when database is not available
  app.post("/api/auth/demo-register", (req, res) => {
    setTimeout(() => {
      res.json({
        success: true,
        message: "Registration successful! (Demo mode)",
        data: {
          user: {
            id: "demo-user-123",
            firstName: req.body.firstName || "Demo",
            lastName: req.body.lastName || "User",
            email: req.body.email || "demo@vasa.com",
            role: req.body.role || "importer",
            companyName: req.body.companyName || "Demo Company",
            status: "verified",
          },
          token: "demo-jwt-token-123",
        },
      });
    }, 1000);
  });

  app.post("/api/auth/demo-login", (req, res) => {
    res.json({
      success: true,
      message: "Login successful! (Demo mode)",
      data: {
        user: {
          id: "demo-user-123",
          firstName: "Demo",
          lastName: "User",
          email: req.body.email || "demo@vasa.com",
          role: "importer",
          companyName: "Demo Company",
          status: "verified",
        },
        token: "demo-jwt-token-123",
      },
    });
  });

  // Demo data endpoints
  app.get("/api/products/demo", (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: "prod-1",
          title: "Premium Electronics Components",
          category: "Electronics",
          price: 1250,
          origin: "CN",
          description: "High-quality electronic components for manufacturing",
          image: "/placeholder.svg"
        },
        {
          id: "prod-2", 
          title: "Organic Cotton Textiles",
          category: "Textiles",
          price: 890,
          origin: "IN",
          description: "Certified organic cotton fabrics",
          image: "/placeholder.svg"
        }
      ]
    });
  });

  // Global error handler
  app.use(errorTrackingMiddleware);

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found",
      path: req.originalUrl,
      availableEndpoints: [
        "GET /api/health",
        "GET /api/demo",
        "POST /api/auth/register",
        "POST /api/auth/login",
        "GET /api/search/global",
        "GET /api/search/suggestions",
        "POST /api/compliance/check",
        "GET /api/compliance/countries",
        "POST /api/bug-reports",
        "GET /api/mfa/status"
      ]
    });
  });

  // Global uncaught exception handler
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await ErrorTracker.logError({
      type: 'UNKNOWN_ERROR',
      message: error.message,
      stack: error.stack,
      severity: 'CRITICAL',
      metadata: { source: 'uncaughtException' }
    });
    process.exit(1);
  });

  // Global unhandled rejection handler
  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await ErrorTracker.logError({
      type: 'UNKNOWN_ERROR',
      message: `Unhandled Rejection: ${reason}`,
      severity: 'HIGH',
      metadata: { source: 'unhandledRejection', promise: promise.toString() }
    });
  });

  return app;
};

export { createServer };
export default createServer;
