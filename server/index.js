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
        "✅ Webhook Integrations"
      ],
      version: "2.0.0",
      buildDate: new Date().toISOString()
    });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      service: "VASA API",
      timestamp: new Date().toISOString(),
      environment: "development"
    });
  });

  // Demo auth endpoints
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

  // Demo search endpoints
  app.get("/api/search/global", (req, res) => {
    const { q: query, type = 'all' } = req.query;
    
    res.json({
      success: true,
      data: {
        query: query || '',
        type,
        totalResults: 3,
        results: {
          products: {
            data: [
              {
                _id: "prod-1",
                title: "Premium Electronics Components",
                category: "Electronics",
                price: 1250,
                origin: "CN",
                description: "High-quality electronic components for manufacturing",
                images: ["/placeholder.svg"]
              },
              {
                _id: "prod-2",
                title: "Organic Cotton Textiles",
                category: "Textiles", 
                price: 890,
                origin: "IN",
                description: "Certified organic cotton fabrics",
                images: ["/placeholder.svg"]
              }
            ],
            total: 2,
            hasMore: false
          }
        },
        pagination: {
          page: 1,
          limit: 10,
          hasMore: false
        }
      }
    });
  });

  app.get("/api/search/suggestions", (req, res) => {
    const { q: query } = req.query;
    
    res.json({
      success: true,
      data: [
        { title: "Electronics", type: "category" },
        { title: "Textiles", type: "category" },
        { title: "Premium Components", type: "product", price: 1250 },
        { title: "Organic Materials", type: "product", price: 890 }
      ]
    });
  });

  app.get("/api/search/popular", (req, res) => {
    res.json({
      success: true,
      data: {
        popularCategories: [
          { category: "Electronics", count: 156 },
          { category: "Textiles", count: 89 },
          { category: "Machinery", count: 67 }
        ],
        trendingProducts: [
          { title: "Smart Components", category: "Electronics", price: 1299 },
          { title: "Eco Textiles", category: "Textiles", price: 799 }
        ]
      }
    });
  });

  // Demo compliance endpoints
  app.post("/api/compliance/check", (req, res) => {
    const { destinationCountry } = req.body;
    
    res.json({
      success: true,
      data: {
        compliance: {
          compliant: true,
          warnings: [],
          requirements: [
            "Commercial Invoice",
            "Certificate of Origin", 
            "Packing List"
          ],
          prohibitions: [],
          recommendations: [
            "Consider preferential trade agreements",
            "Ensure proper documentation"
          ]
        },
        documents: [
          {
            type: "COMMERCIAL_INVOICE",
            description: "Detailed invoice showing transaction value and terms",
            issuingAuthority: "Exporter/Seller",
            validity: "No expiry"
          }
        ],
        duties: {
          estimatedDuty: 125,
          rate: 5,
          currency: "USD",
          note: "Estimated duties - actual rates may vary"
        },
        countryInfo: {
          agencies: {
            customs: "Customs Authority",
            foodSafety: "Food Safety Agency"
          }
        }
      }
    });
  });

  app.get("/api/compliance/countries", (req, res) => {
    res.json({
      success: true,
      data: [
        { code: "US", name: "United States", agencies: 4 },
        { code: "EU", name: "European Union", agencies: 3 },
        { code: "IN", name: "India", agencies: 4 },
        { code: "CN", name: "China", agencies: 3 }
      ]
    });
  });

  // Demo MFA endpoints
  app.get("/api/mfa/status", (req, res) => {
    res.json({
      success: true,
      data: {
        enabled: false,
        setupCompleted: false,
        preferredMethod: "authenticator",
        methods: {
          authenticator: false,
          sms: false,
          email: true
        }
      }
    });
  });

  // Demo bug report endpoint
  app.post("/api/bug-reports", (req, res) => {
    res.json({
      success: true,
      message: "Bug report submitted successfully",
      data: {
        reportId: "BUG-" + Date.now(),
        status: "open",
        createdAt: new Date().toISOString()
      }
    });
  });

  // Catch-all for unhandled API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found (Demo mode)",
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
        "GET /api/mfa/status",
        "POST /api/bug-reports"
      ]
    });
  });

  return app;
};

export { createServer };
export default createServer;
