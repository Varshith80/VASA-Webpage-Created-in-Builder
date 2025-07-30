import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  MapPin, 
  Package, 
  Star, 
  Building2,
  Verified,
  TrendingUp,
  Award,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";

export default function Importer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");

  // Enhanced mock data with trust indicators
  const materials = [
    {
      id: 1,
      type: "Cotton",
      quality: "Premium Grade A",
      price: 2.50,
      currency: "USD",
      unit: "per kg",
      moq: "1000 kg",
      exporter: "Global Cotton Co.",
      exporterRating: 4.8,
      exporterVerified: true,
      exporterBadges: ["Prime Seller", "Verified Business"],
      location: "India",
      inStock: 25000,
      certificates: ["ISO 9001", "GOTS Certified"],
      responseTime: "< 2 hours",
      completedOrders: 1250,
      bulkDiscount: "5% off orders > 5000kg",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      type: "Silk",
      quality: "Mulberry Silk",
      price: 45.00,
      currency: "USD",
      unit: "per kg",
      moq: "100 kg",
      exporter: "Silk Masters Ltd.",
      exporterRating: 4.9,
      exporterVerified: true,
      exporterBadges: ["Premium Seller", "Export Champion"],
      location: "China",
      inStock: 5000,
      certificates: ["ISO 14001", "OEKO-TEX"],
      responseTime: "< 1 hour",
      completedOrders: 890,
      bulkDiscount: "3% off orders > 1000kg",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      type: "Polyester",
      quality: "Industrial Grade",
      price: 1.80,
      currency: "USD",
      unit: "per kg",
      moq: "2000 kg",
      exporter: "Poly Industries",
      exporterRating: 4.6,
      exporterVerified: true,
      exporterBadges: ["Verified Business"],
      location: "South Korea",
      inStock: 50000,
      certificates: ["ISO 9001"],
      responseTime: "< 4 hours",
      completedOrders: 2100,
      bulkDiscount: "7% off orders > 10000kg",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      type: "Cardamom",
      quality: "Premium Green",
      price: 85.00,
      currency: "USD",
      unit: "per kg",
      moq: "50 kg",
      exporter: "Spice Trading Co.",
      exporterRating: 4.7,
      exporterVerified: true,
      exporterBadges: ["Organic Certified", "Premium Seller"],
      location: "India",
      inStock: 2000,
      certificates: ["Organic Certified", "FSSAI"],
      responseTime: "< 3 hours",
      completedOrders: 650,
      bulkDiscount: "4% off orders > 500kg",
      image: "/api/placeholder/300/200"
    }
  ];

  const materialTypes = ["Cotton", "Silk", "Polyester", "Wool", "Linen", "Nylon", "Jute", "Cardamom", "Pepper", "Turmeric"];
  const locations = ["India", "China", "South Korea", "Australia", "France", "Germany", "USA", "Brazil"];
  const priceRanges = ["Under $5", "$5-$25", "$25-$50", "Over $50"];
  const qualityGrades = ["Premium Grade A", "Grade A", "Industrial Grade", "Standard Grade"];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.exporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = materialFilter === "all" || material.type === materialFilter;
    const matchesLocation = locationFilter === "all" || material.location === locationFilter;
    const matchesQuality = qualityFilter === "all" || material.quality === qualityFilter;
    
    let matchesPrice = true;
    if (priceFilter !== "all") {
      const price = material.price;
      switch (priceFilter) {
        case "Under $5":
          matchesPrice = price < 5;
          break;
        case "$5-$25":
          matchesPrice = price >= 5 && price <= 25;
          break;
        case "$25-$50":
          matchesPrice = price >= 25 && price <= 50;
          break;
        case "Over $50":
          matchesPrice = price > 50;
          break;
      }
    }
    
    return matchesSearch && matchesMaterial && matchesLocation && matchesPrice && matchesQuality;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="corporate-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="corporate-transition">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">TradeBridge</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="trust-badge trust-badge-verified">
                <TrendingUp className="h-3 w-3 mr-1" />
                Importer Dashboard
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Global Commodity Marketplace</h1>
          <p className="text-muted-foreground">
            Discover verified suppliers and high-quality materials from trusted exporters worldwide
          </p>
        </div>

        {/* Advanced Filters */}
        <div className="card-corporate p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="form-group">
              <Label className="form-label">Search Materials</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials or exporters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-corporate pl-10"
                />
              </div>
            </div>
            
            <div className="form-group">
              <Label className="form-label">Material Type</Label>
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger className="input-corporate">
                  <SelectValue placeholder="All materials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <Label className="form-label">Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="input-corporate">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <Label className="form-label">Price Range</Label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="input-corporate">
                  <SelectValue placeholder="All prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <Label className="form-label">Quality Grade</Label>
              <Select value={qualityFilter} onValueChange={setQualityFilter}>
                <SelectTrigger className="input-corporate">
                  <SelectValue placeholder="All grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {qualityGrades.map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{filteredMaterials.length}</span> verified suppliers found
          </p>
          <div className="flex items-center space-x-2">
            <Select defaultValue="featured">
              <SelectTrigger className="w-40 input-corporate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="response">Fastest Response</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid-corporate-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="card-corporate hover:shadow-corporate-lg corporate-transition">
              <CardHeader className="pb-3">
                <div className="aspect-video bg-muted flex items-center justify-center mb-3">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium">{material.type}</CardTitle>
                    <p className="text-sm text-muted-foreground">{material.quality}</p>
                  </div>
                  {material.exporterVerified && (
                    <Verified className="h-5 w-5 text-success" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price & MOQ */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-semibold text-primary">
                      ${material.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">{material.unit}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">MOQ</p>
                    <p className="text-sm font-medium">{material.moq}</p>
                  </div>
                </div>
                
                {/* Exporter Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{material.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{material.exporterRating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-foreground">{material.exporter}</p>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-1">
                    {material.exporterBadges.map((badge, index) => (
                      <Badge key={index} variant="outline" className="trust-badge trust-badge-verified text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">In Stock:</span>
                    </div>
                    <p className="font-medium">{material.inStock.toLocaleString()} kg</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Response:</span>
                    </div>
                    <p className="font-medium">{material.responseTime}</p>
                  </div>
                </div>
                
                {/* Bulk Discount */}
                {material.bulkDiscount && (
                  <div className="bg-success/10 border border-success/20 p-2">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3 text-success" />
                      <span className="text-xs font-medium text-success">{material.bulkDiscount}</span>
                    </div>
                  </div>
                )}
                
                {/* Certificates */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Certifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {material.certificates.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button className="btn-corporate w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Request Quote
                  </Button>
                  <Button variant="outline" className="btn-secondary-corporate w-full text-xs">
                    View Details & Samples
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No materials found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters to find more results
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setMaterialFilter("all");
                setLocationFilter("all");
                setPriceFilter("all");
                setQualityFilter("all");
              }}
              className="btn-secondary-corporate"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
