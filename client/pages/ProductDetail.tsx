import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building2,
  Star,
  MapPin,
  Package,
  CheckCircle,
  Download,
  MessageSquare,
  ShoppingCart,
  Calculator,
  Truck,
  Shield,
  FileText,
  Award,
  Globe,
  Clock,
  DollarSign,
  AlertTriangle,
  Info,
  Eye,
  Share2,
  Heart,
  Flag,
  Verified,
  CreditCard,
  Scale
} from "lucide-react";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Mock product data
  const product = {
    id: "prod-001",
    name: "Premium Organic Cotton",
    category: "Textiles",
    quality: "Grade A Premium",
    description: "High-quality organic cotton sourced from certified farms. Perfect for premium textile manufacturing with excellent fiber strength and purity.",
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400", 
      "/api/placeholder/600/400",
      "/api/placeholder/600/400"
    ],
    price: {
      USD: 2.50,
      EUR: 2.30,
      GBP: 2.00,
      INR: 208.75
    },
    unit: "per kg",
    moq: 1000,
    stockQuantity: 25000,
    exporter: {
      id: "exp-001",
      name: "Rajesh Kumar",
      company: "Global Cotton Co.",
      verified: true,
      rating: 4.8,
      reviewCount: 125,
      responseTime: "< 2 hours",
      completedOrders: 1250,
      yearEstablished: 2010,
      location: "Mumbai, India",
      badges: ["Prime Seller", "Verified Business", "Quality Assured"],
      businessLicense: "IEC123456789",
      certifications: ["ISO 9001:2015", "GOTS Certified", "Fair Trade"]
    },
    specifications: {
      origin: "Gujarat, India",
      harvestYear: "2024",
      moistureContent: "7.5%",
      fiberLength: "28-30mm",
      micronaire: "4.2-4.8",
      strength: "28-32 g/tex",
      color: "Natural White",
      packaging: "Pressed Bales",
      shelfLife: "2 years"
    },
    certifications: [
      {
        name: "GOTS Certified",
        issuer: "Global Organic Textile Standard",
        validUntil: "2025-12-31",
        certificateNumber: "GOTS-IND-2024-001"
      },
      {
        name: "ISO 9001:2015",
        issuer: "Bureau Veritas",
        validUntil: "2026-06-15",
        certificateNumber: "ISO-9001-2024-789"
      },
      {
        name: "Fair Trade Certified",
        issuer: "Fair Trade USA",
        validUntil: "2025-09-30",
        certificateNumber: "FT-USA-2024-456"
      }
    ],
    documents: [
      {
        name: "Quality Inspection Report",
        type: "PDF",
        size: "2.3 MB",
        date: "2024-01-10"
      },
      {
        name: "Origin Certificate",
        type: "PDF", 
        size: "1.8 MB",
        date: "2024-01-08"
      },
      {
        name: "Sample Test Results",
        type: "PDF",
        size: "3.1 MB",
        date: "2024-01-05"
      }
    ],
    shipping: {
      ports: ["JNPT Mumbai", "Chennai Port", "Kandla Port"],
      leadTime: "15-20 days",
      packagingOptions: ["Pressed Bales", "Loose Packing"],
      insuranceIncluded: true
    },
    paymentTerms: {
      advance: 10,
      inspection: 50,
      delivery: 40,
      currencies: ["USD", "EUR", "GBP", "INR"],
      methods: ["Wire Transfer", "Letter of Credit", "Platform Escrow"]
    },
    qualityAssurance: {
      sampling: "Pre-shipment sampling available",
      inspection: "Third-party inspection supported",
      warranty: "Quality guarantee up to delivery",
      returns: "Returns accepted within 48 hours of delivery"
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const unitPrice = product.price[selectedCurrency as keyof typeof product.price];
    const subtotal = qty * unitPrice;
    const platformFee = subtotal * 0.025; // 2.5% platform fee
    const paymentProcessing = subtotal * 0.015; // 1.5% payment processing
    const insurance = subtotal * 0.005; // 0.5% insurance
    const total = subtotal + platformFee + paymentProcessing + insurance;

    return {
      subtotal,
      platformFee,
      paymentProcessing,
      insurance,
      total,
      advance: total * 0.10,
      inspection: total * 0.50,
      delivery: total * 0.40
    };
  };

  const costs = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="corporate-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/importer">
                <Button variant="ghost" size="sm" className="corporate-transition">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">TradeBridge</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <Card className="card-corporate">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted flex items-center justify-center mb-4">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((_, index) => (
                    <div key={index} className="aspect-square bg-muted flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card className="card-corporate">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{product.category}</Badge>
                      <Badge variant="outline">{product.quality}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {selectedCurrency} {product.price[selectedCurrency as keyof typeof product.price].toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">{product.unit}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-muted-foreground text-sm">MOQ</p>
                    <p className="font-medium">{product.moq.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">In Stock</p>
                    <p className="font-medium">{product.stockQuantity.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Lead Time</p>
                    <p className="font-medium">{product.shipping.leadTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Origin</p>
                    <p className="font-medium">{product.specifications.origin}</p>
                  </div>
                </div>

                <Tabs defaultValue="specifications" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  </TabsList>

                  <TabsContent value="specifications" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-muted-foreground text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="certifications" className="mt-4">
                    <div className="space-y-4">
                      {product.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted">
                          <div className="flex items-center space-x-3">
                            <Award className="h-5 w-5 text-success" />
                            <div>
                              <p className="font-medium">{cert.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {cert.issuer} • Valid until {cert.validUntil}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-4">
                    <div className="space-y-3">
                      {product.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.type} • {doc.size} • {doc.date}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="shipping" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Available Ports</p>
                        <div className="flex flex-wrap gap-2">
                          {product.shipping.ports.map((port, index) => (
                            <Badge key={index} variant="outline">{port}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Packaging Options</p>
                        <div className="flex flex-wrap gap-2">
                          {product.shipping.packagingOptions.map((option, index) => (
                            <Badge key={index} variant="outline">{option}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-success" />
                        <span className="text-sm">Insurance included in shipping</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Supplier Info and Order Form */}
          <div className="space-y-6">
            {/* Supplier Information */}
            <Card className="card-corporate">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Supplier Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{product.exporter.name}</h3>
                      {product.exporter.verified && (
                        <Verified className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.exporter.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{product.exporter.rating}</span>
                      <span className="text-muted-foreground">({product.exporter.reviewCount})</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Response Time</p>
                    <p className="font-medium">{product.exporter.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Orders Completed</p>
                    <p className="font-medium">{product.exporter.completedOrders}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Established</p>
                    <p className="font-medium">{product.exporter.yearEstablished}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{product.exporter.location}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Trust Badges</p>
                  <div className="flex flex-wrap gap-1">
                    {product.exporter.badges.map((badge, index) => (
                      <Badge key={index} variant="outline" className="trust-badge trust-badge-verified text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <Button className="btn-corporate w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Supplier
                  </Button>
                  <Button variant="outline" className="btn-secondary-corporate w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Form */}
            <Card className="card-corporate">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Place Order</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="form-group">
                  <Label className="form-label">Quantity (kg) *</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={`Minimum ${product.moq.toLocaleString()}`}
                    className="input-corporate"
                    min={product.moq}
                  />
                  <p className="form-help">
                    Minimum order: {product.moq.toLocaleString()} kg
                  </p>
                </div>

                <div className="form-group">
                  <Label className="form-label">Currency</Label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="input-corporate w-full"
                  >
                    {product.paymentTerms.currencies.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                {quantity && parseFloat(quantity) >= product.moq && (
                  <div className="space-y-3 p-4 bg-muted">
                    <h4 className="font-medium text-foreground">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{selectedCurrency} {costs.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee (2.5%):</span>
                        <span>{selectedCurrency} {costs.platformFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Processing (1.5%):</span>
                        <span>{selectedCurrency} {costs.paymentProcessing.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance (0.5%):</span>
                        <span>{selectedCurrency} {costs.insurance.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>{selectedCurrency} {costs.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-border">
                      <h5 className="font-medium text-sm">Payment Schedule</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Advance (10%):</span>
                          <span>{selectedCurrency} {costs.advance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>On Inspection (50%):</span>
                          <span>{selectedCurrency} {costs.inspection.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>On Delivery (40%):</span>
                          <span>{selectedCurrency} {costs.delivery.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    className="btn-corporate w-full"
                    disabled={!quantity || parseFloat(quantity) < product.moq}
                    onClick={() => setShowOrderForm(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Place Order
                  </Button>
                  <Button variant="outline" className="btn-secondary-corporate w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Request Quote
                  </Button>
                </div>

                <div className="bg-success/10 border border-success/20 p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">Secure Transaction</span>
                  </div>
                  <div className="text-xs text-success space-y-1">
                    <p>• Payments protected by escrow</p>
                    <p>• Quality guarantee until delivery</p>
                    <p>• 48-hour cancellation policy</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>By placing an order, you agree to our terms and conditions. 
                  All transactions are subject to verification and compliance checks.</p>
                </div>
              </CardContent>
            </Card>

            {/* Quality Assurance */}
            <Card className="card-corporate">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Quality Assurance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{product.qualityAssurance.sampling}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{product.qualityAssurance.inspection}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{product.qualityAssurance.warranty}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{product.qualityAssurance.returns}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
