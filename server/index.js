import express from "express";
import cors from "cors";

// Simple development server for VASA demo
const createServer = () => {
  const app = express();

  // CORS for development
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:8080"],
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Demo ping endpoint
  app.get("/api/ping", (req, res) => {
    res.json({
      message: "VASA API is running!",
      timestamp: new Date().toISOString(),
      status: "success",
    });
  });

  // Demo data endpoints for development
  app.get("/api/demo", (req, res) => {
    res.json({
      message: "Welcome to VASA Global Trade Platform!",
      features: [
        "Multi-step KYC verification",
        "Secure escrow payments",
        "Real-time order tracking",
        "Global marketplace",
      ],
    });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      service: "VASA API",
      timestamp: new Date().toISOString(),
    });
  });

  // Placeholder auth endpoints for development
  app.post("/api/auth/register", (req, res) => {
    // Mock successful registration
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

  app.post("/api/auth/login", (req, res) => {
    // Mock successful login
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

  // Catch-all for unhandled API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found (Demo mode)",
      path: req.originalUrl,
    });
  });

  return app;
};

export { createServer };
export default createServer;
