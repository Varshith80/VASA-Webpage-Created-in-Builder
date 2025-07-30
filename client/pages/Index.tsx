import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Globe, 
  CheckCircle,
  BarChart3,
  Users,
  Award,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  Upload,
  FileCheck,
  DollarSign,
  Truck,
  MessageSquare,
  Star,
  Lock,
  CreditCard,
  Headphones
} from "lucide-react";

export default function Index() {
  const [selectedRole, setSelectedRole] = useState<"importer" | "exporter" | null>(null);

  const commodityCategories = [
    { name: "Cotton", category: "Textiles", volume: "2.5M tons/year" },
    { name: "Silk", category: "Textiles", volume: "180K tons/year" },
    { name: "Polyester", category: "Textiles", volume: "15M tons/year" },
    { name: "Wool", category: "Textiles", volume: "1.2M tons/year" },
    { name: "Cardamom", category: "Spices", volume: "35K tons/year" },
    { name: "Black Pepper", category: "Spices", volume: "450K tons/year" },
    { name: "Turmeric", category: "Spices", volume: "1.1M tons/year" },
    { name: "Cinnamon", category: "Spices", volume: "220K tons/year" }
  ];

  const platformFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Government Verified",
      description: "Full KYC with business license and tax ID verification"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Network",
      description: "Connect with verified traders across 120+ countries"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Secure Escrow",
      description: "Multi-currency payments with 3-step escrow protection"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Logistics Tracking",
      description: "Real-time shipment tracking with integrated logistics partners"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Secure Communication",
      description: "In-platform messaging with document sharing capabilities"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Trust & Reviews",
      description: "Transaction-based ratings and verified trader badges"
    }
  ];

  const trustIndicators = [
    { label: "Verified Businesses", value: "25,000+" },
    { label: "Countries Active", value: "120+" },
    { label: "Annual Trade Volume", value: "$2.5B+" },
    { label: "Success Rate", value: "99.7%" }
  ];

  const importerBenefits = [
    "Access to verified suppliers worldwide",
    "Quality certificates and batch documentation",
    "Bulk order discounts and competitive pricing",
    "Secure escrow payment protection",
    "Real-time shipment tracking",
    "24/7 dispute resolution support"
  ];

  const exporterBenefits = [
    "Reach global importers instantly", 
    "Showcase quality certifications",
    "Secure payment guarantee",
    "Professional business profiles",
    "Market analytics and insights",
    "Dedicated account management"
  ];

  const handleRoleSelection = (role: "importer" | "exporter") => {
    setSelectedRole(role);
  };

  const resetRoleSelection = () => {
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="corporate-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">TradeBridge</h1>
                <p className="text-xs text-muted-foreground">Global Commodity Exchange</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground corporate-transition">
                Features
              </a>
              <a href="#commodities" className="text-sm text-muted-foreground hover:text-foreground corporate-transition">
                Commodities
              </a>
              <a href="#trust" className="text-sm text-muted-foreground hover:text-foreground corporate-transition">
                Trust & Security
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground corporate-transition">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              <CheckCircle className="h-3 w-3 mr-1" />
              Trusted by 25,000+ Global Businesses
            </Badge>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Professional Import/Export Platform for
              <span className="block text-primary">Textiles & Spices Trading</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Government-verified platform connecting importers and exporters worldwide. 
              Secure transactions, quality assurance, and comprehensive business tools.
            </p>
          </div>

          {/* Role Selection */}
          {!selectedRole ? (
            <div className="mb-16">
              <h3 className="text-xl font-medium text-foreground mb-6">Choose Your Trading Role</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card 
                  className="card-corporate cursor-pointer hover:shadow-corporate-lg corporate-transition"
                  onClick={() => handleRoleSelection("importer")}
                >
                  <CardHeader className="text-center pb-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">I am an Importer</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Looking to source quality materials and products
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-left">
                      {importerBenefits.slice(0, 3).map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="btn-corporate w-full mt-4">
                      Start as Importer
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="card-corporate cursor-pointer hover:shadow-corporate-lg corporate-transition"
                  onClick={() => handleRoleSelection("exporter")}
                >
                  <CardHeader className="text-center pb-3">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-success" />
                    </div>
                    <CardTitle className="text-xl">I am an Exporter</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Ready to sell products to global importers
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-left">
                      {exporterBenefits.slice(0, 3).map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="btn-corporate w-full mt-4">
                      Start as Exporter
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-muted-foreground text-sm mt-6">
                Already have an account? 
                <Link to="/signin" className="text-primary hover:underline ml-1">Sign in here</Link>
              </p>
            </div>
          ) : (
            /* Selected Role Details */
            <div className="mb-16">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Button 
                  variant="ghost" 
                  onClick={resetRoleSelection}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back to role selection
                </Button>
              </div>
              
              <Card className="card-corporate max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 ${selectedRole === "importer" ? "bg-primary/10" : "bg-success/10"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {selectedRole === "importer" ? (
                      <ShoppingCart className="h-10 w-10 text-primary" />
                    ) : (
                      <Upload className="h-10 w-10 text-success" />
                    )}
                  </div>
                  <CardTitle className="text-2xl capitalize">{selectedRole} Registration</CardTitle>
                  <p className="text-muted-foreground">
                    Complete verification to access our global trading platform
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <h4 className="font-medium text-foreground">Your Benefits Include:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {(selectedRole === "importer" ? importerBenefits : exporterBenefits).map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted p-4 mb-6">
                    <h4 className="font-medium text-foreground mb-2">Required Documentation:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <FileCheck className="h-3 w-3" />
                        <span>Business License</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileCheck className="h-3 w-3" />
                        <span>Tax ID/GST Certificate</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileCheck className="h-3 w-3" />
                        <span>Identity Verification</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileCheck className="h-3 w-3" />
                        <span>Bank Statement</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link to={`/${selectedRole}`}>
                      <Button className="btn-corporate w-full" size="lg">
                        <Lock className="mr-2 h-5 w-5" />
                        Start Secure Registration
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground text-center">
                      Registration takes 5-10 minutes. Verification typically completed within 24 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-semibold text-primary mb-1">
                  {indicator.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {indicator.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commodities Section */}
        <section id="commodities" className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Global Commodity Trading
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trade in key commodities with verified quality and global market reach
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {commodityCategories.map((commodity, index) => (
              <div 
                key={index}
                className="card-corporate p-4 hover:shadow-corporate-lg corporate-transition"
              >
                <div className="text-center">
                  <h4 className="font-medium text-foreground mb-1">{commodity.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{commodity.category}</p>
                  <div className="text-xs text-primary font-medium">{commodity.volume}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Enterprise Trading Platform
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and security for professional international trade
            </p>
          </div>
          <div className="grid-corporate-2 lg:grid-cols-3">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="card-corporate p-6">
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Trust Section */}
        <section id="trust" className="mb-16">
          <div className="card-corporate p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Government-Level Security & Verification
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every trader undergoes comprehensive verification with government-issued documents
              </p>
            </div>
            <div className="grid-corporate-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Complete KYC Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Business license, tax ID, and identity verification with government databases
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-success" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Secure Escrow Payments</h4>
                <p className="text-sm text-muted-foreground">
                  Multi-currency payments with 3-step escrow protection and dispute resolution
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-warning" />
                </div>
                <h4 className="font-medium text-foreground mb-2">24/7 Support & Mediation</h4>
                <p className="text-sm text-muted-foreground">
                  Professional dispute resolution with clear timelines and escalation paths
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ready to Start Trading Globally?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of verified businesses already trading on our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="btn-corporate px-6 py-3 min-h-[44px]" onClick={() => setSelectedRole(null)}>
                Choose Your Role
              </Button>
              <Button variant="outline" className="btn-secondary-corporate px-6 py-3 min-h-[44px]">
                <Phone className="mr-2 h-4 w-4" />
                Schedule Demo
              </Button>
            </div>
          </div>
          
          <div className="grid-corporate-3 max-w-2xl mx-auto">
            <div className="text-center">
              <Phone className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <Mail className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">support@tradebridge.com</p>
            </div>
            <div className="text-center">
              <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Global Operations</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">TradeBridge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Government-verified import/export platform for global commodity trading
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground corporate-transition">Privacy Policy</a>
              <a href="#" className="hover:text-foreground corporate-transition">Terms of Service</a>
              <a href="#" className="hover:text-foreground corporate-transition">Compliance</a>
              <a href="#" className="hover:text-foreground corporate-transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
