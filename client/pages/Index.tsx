import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Upload,
  ArrowRight,
  Shield,
  Globe,
  TrendingUp,
  CheckCircle,
  Star,
  Users,
  Package,
  CreditCard,
  Truck,
  BarChart3,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  Play,
  ChevronRight,
  Award,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PlatformTrustSection, TrustBadge } from "@/components/TrustBadges";
import { OnboardingTour } from "@/components/OnboardingTour";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { ContextualTooltip, QuickHelp } from "@/components/ContextualTooltip";

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const platformStats = [
    { label: "Active Traders", value: "50,000+", icon: Users },
    { label: "Countries", value: "180+", icon: Globe },
    { label: "Trade Volume", value: "$5.2B", icon: TrendingUp },
    { label: "Success Rate", value: "99.8%", icon: CheckCircle },
  ];

  const coreFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Transactions",
      description:
        "Multi-step payment system with escrow protection and KYC verification",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Order Tracking",
      description:
        "Real-time tracking from order placement to delivery with status updates",
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Compliance Ready",
      description:
        "Built-in compliance tools for international trade regulations",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Flexible Payments",
      description:
        "Multiple payment options with installment support and currency conversion",
    },
  ];

  const buyerFlow = [
    {
      step: "1",
      title: "Browse Products",
      description: "Explore verified products from certified exporters",
    },
    {
      step: "2",
      title: "Place Order",
      description: "Pay 10% upfront to secure your order",
    },
    {
      step: "3",
      title: "Track Shipment",
      description: "Pay 50% when shipped, track in real-time",
    },
    {
      step: "4",
      title: "Receive & Pay",
      description: "Final 40% payment upon delivery confirmation",
    },
  ];

  const sellerFlow = [
    {
      step: "1",
      title: "Register & Verify",
      description: "Complete KYC with trade license verification",
    },
    {
      step: "2",
      title: "List Products",
      description: "Add products with detailed specs and pricing",
    },
    {
      step: "3",
      title: "Receive Orders",
      description: "Get notified of new orders with advance payment",
    },
    {
      step: "4",
      title: "Ship & Earn",
      description: "Ship products and receive payments in installments",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Global Cotton Exports",
      role: "Exporter",
      content:
        "VASA has transformed our export business. The payment security and buyer verification give us confidence in every transaction.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      company: "Pacific Trading Co.",
      role: "Importer",
      content:
        "The step-by-step payment system and order tracking make international sourcing so much easier and safer.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">VASA</h1>
                <p className="text-xs text-muted-foreground">
                  Global Trade Platform
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Reviews
              </a>
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Trusted by 50,000+ global traders
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              The Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                Global Trade
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              VASA connects exporters and importers worldwide with secure
              payments, real-time tracking, and compliance tools for seamless
              international trade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register?role=importer">
                <Button size="lg" className="px-8 py-4 text-lg group">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Start Importing
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/register?role=exporter">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg group"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Start Exporting
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {platformStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Built for Modern Global Trade
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to trade internationally with confidence and
              security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border border-border hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="text-primary mb-3">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <PlatformTrustSection />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How VASA Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and transparent process for both buyers and
              sellers
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-center space-x-8">
                <button
                  onClick={() => setSelectedTab("buyer")}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedTab === "buyer"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For Importers
                </button>
                <button
                  onClick={() => setSelectedTab("seller")}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedTab === "seller"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For Exporters
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {(selectedTab === "buyer" ? buyerFlow : sellerFlow).map(
                (step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {index < 3 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground mx-auto mt-4 hidden md:block" />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Global Traders
            </h2>
            <p className="text-muted-foreground">
              See what our community says about VASA
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-border">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-current text-yellow-500"
                      />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Global Trade?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful traders using VASA for secure,
            efficient international commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg"
              >
                Start Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="font-bold text-foreground">VASA</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The global platform for secure export-import trade with advanced
                compliance and payment solutions.
              </p>
              <div className="flex space-x-4">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Mail className="h-4 w-4 text-muted-foreground" />
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">
                For Traders
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/browse"
                    className="hover:text-foreground transition-colors"
                  >
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-foreground transition-colors"
                  >
                    Start Importing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-foreground transition-colors"
                  >
                    Start Exporting
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="hover:text-foreground transition-colors"
                  >
                    Trading Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/knowledge-base"
                    className="hover:text-foreground transition-colors"
                  >
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link
                    to="/compliance"
                    className="hover:text-foreground transition-colors"
                  >
                    Compliance Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/api"
                    className="hover:text-foreground transition-colors"
                  >
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="hover:text-foreground transition-colors"
                  >
                    Support Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 VASA Global Trade Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
