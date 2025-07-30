import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MapPin
} from "lucide-react";

export default function Index() {
  const commodityCategories = [
    "Cotton", "Polyester", "Wool", "Silk", "Linen", "Nylon", "Jute", 
    "Spices", "Cashews", "Pepper", "Cardamom", "Turmeric"
  ];

  const platformFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Transactions",
      description: "KYC verified users, escrow payments, and SSL encryption for complete security"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Marketplace",
      description: "Connect with verified importers and exporters across international markets"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Market Intelligence",
      description: "Real-time pricing, demand analytics, and market trend insights"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Trust & Quality",
      description: "Verified suppliers, quality certificates, and transaction-based ratings"
    }
  ];

  const trustIndicators = [
    { label: "Verified Businesses", value: "25,000+" },
    { label: "Countries Active", value: "120+" },
    { label: "Transactions Completed", value: "$2.5B+" },
    { label: "Success Rate", value: "99.7%" }
  ];

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
              Trusted by 25,000+ Global Businesses
            </Badge>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Professional Import/Export Platform for
              <span className="block text-primary">Textile & Commodity Trading</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with verified importers and exporters worldwide. Secure transactions, 
              quality assurance, and comprehensive business tools for the global commodity trade.
            </p>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/importer" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="btn-corporate w-full sm:w-auto px-8 py-4 text-base font-medium group min-h-[44px]"
              >
                <TrendingUp className="mr-3 h-5 w-5" />
                I am an Importer
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 corporate-transition" />
              </Button>
            </Link>
            
            <Link to="/exporter" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="btn-secondary-corporate w-full sm:w-auto px-8 py-4 text-base font-medium group min-h-[44px]"
              >
                <Building2 className="mr-3 h-5 w-5" />
                I am an Exporter
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 corporate-transition" />
              </Button>
            </Link>
          </div>

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
              Trade in Key Commodities
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access a comprehensive marketplace for textile raw materials and agricultural commodities
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {commodityCategories.map((commodity) => (
              <div 
                key={commodity}
                className="card-corporate p-4 text-center hover:shadow-corporate-lg corporate-transition"
              >
                <div className="text-sm font-medium text-foreground">
                  {commodity}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Enterprise-Grade Trading Platform
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for serious businesses with comprehensive verification, security, and support systems
            </p>
          </div>
          <div className="grid-corporate-2 lg:grid-cols-4">
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

        {/* Trust & Security Section */}
        <section id="trust" className="mb-16">
          <div className="card-corporate p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Trust & Security First
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform ensures every transaction is secure with comprehensive verification and protection measures
              </p>
            </div>
            <div className="grid-corporate-3">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-2">KYC Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Complete business verification with license checks and document validation
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-success mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-2">Escrow Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Secure 3-step payment process with funds held until delivery confirmation
                </p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-success mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-2">Dispute Resolution</h4>
                <p className="text-sm text-muted-foreground">
                  Professional mediation services with clear timelines and fair resolution
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ready to Start Trading?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of businesses already trading on our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/importer">
                <Button className="btn-corporate px-6 py-3 min-h-[44px]">
                  Start as Importer
                </Button>
              </Link>
              <Link to="/exporter">
                <Button variant="outline" className="btn-secondary-corporate px-6 py-3 min-h-[44px]">
                  Start as Exporter
                </Button>
              </Link>
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
              Professional import/export platform for global commodity trading
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground corporate-transition">Privacy Policy</a>
              <a href="#" className="hover:text-foreground corporate-transition">Terms of Service</a>
              <a href="#" className="hover:text-foreground corporate-transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
