import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CancelOrderDialog } from "@/components/ConfirmationDialog";
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  TrendingUp,
  Star,
  Plus,
  Eye,
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Truck,
  Calendar,
  User,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  unit: string;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  exporter: {
    id: number;
    name: string;
    location: string;
    verified: boolean;
    rating: number;
  };
  moq: string;
  availability: number;
  tags: string[];
  certification: string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  products: CartItem[];
  totalAmount: number;
  currency: string;
  orderDate: string;
  estimatedDelivery: string;
  paymentStatus:
    | "advance_paid"
    | "shipment_paid"
    | "delivered_paid"
    | "completed";
  paymentMilestones: {
    advance: { amount: number; paid: boolean; dueDate: string };
    shipment: { amount: number; paid: boolean; dueDate: string };
    delivery: { amount: number; paid: boolean; dueDate: string };
  };
  exporter: {
    id: number;
    name: string;
    location: string;
  };
}

export default function ImporterDashboard() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("products");
  const itemsPerPage = 12;

  // Handle URL parameters for direct tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['products', 'cart', 'orders', 'account'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Mock data - in real app, this would come from API
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Premium Organic Cotton",
      description:
        "High-quality organic cotton, GOTS certified, perfect for textile manufacturing",
      price: 2.5,
      currency: "USD",
      unit: "per kg",
      category: "Textiles",
      rating: 4.8,
      reviewCount: 127,
      image: "/api/placeholder/300/200",
      exporter: {
        id: 101,
        name: "Mumbai Cotton Mills",
        location: "Mumbai, India",
        verified: true,
        rating: 4.9,
      },
      moq: "1000 kg",
      availability: 25000,
      tags: ["Organic", "GOTS Certified", "Premium"],
      certification: ["GOTS", "ISO 9001"],
    },
    {
      id: 2,
      name: "Premium Green Cardamom",
      description:
        "Fresh premium green cardamom from Kerala hills, ideal for spice trading",
      price: 85.0,
      currency: "USD",
      unit: "per kg",
      category: "Spices",
      rating: 4.7,
      reviewCount: 89,
      image: "/api/placeholder/300/200",
      exporter: {
        id: 102,
        name: "Kerala Spice Co.",
        location: "Kerala, India",
        verified: true,
        rating: 4.8,
      },
      moq: "50 kg",
      availability: 2000,
      tags: ["Premium", "Fresh", "Hill Grown"],
      certification: ["Organic", "FSSAI"],
    },
    {
      id: 3,
      name: "High-Grade Basmati Rice",
      description:
        "Extra long grain Basmati rice, aged for perfect aroma and taste",
      price: 1.2,
      currency: "USD",
      unit: "per kg",
      category: "Food Grains",
      rating: 4.6,
      reviewCount: 156,
      image: "/api/placeholder/300/200",
      exporter: {
        id: 103,
        name: "Punjab Grains Ltd",
        location: "Punjab, India",
        verified: true,
        rating: 4.7,
      },
      moq: "5000 kg",
      availability: 50000,
      tags: ["Aged", "Long Grain", "Export Quality"],
      certification: ["FSSAI", "ISO 22000"],
    },
    {
      id: 4,
      name: "Premium Silk Fabric",
      description:
        "Pure mulberry silk fabric, handwoven by traditional artisans",
      price: 45.0,
      currency: "USD",
      unit: "per meter",
      category: "Textiles",
      rating: 4.9,
      reviewCount: 73,
      image: "/api/placeholder/300/200",
      exporter: {
        id: 104,
        name: "Bangalore Silk House",
        location: "Bangalore, India",
        verified: true,
        rating: 4.9,
      },
      moq: "100 meters",
      availability: 5000,
      tags: ["Handwoven", "Pure Silk", "Traditional"],
      certification: ["Silk Mark", "Handloom"],
    },
  ];

  const mockOrders: Order[] = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      status: "confirmed",
      products: [{ ...mockProducts[0], quantity: 2000 }],
      totalAmount: 5000,
      currency: "USD",
      orderDate: "2024-01-15",
      estimatedDelivery: "2024-02-15",
      paymentStatus: "advance_paid",
      paymentMilestones: {
        advance: { amount: 500, paid: true, dueDate: "2024-01-15" },
        shipment: { amount: 2500, paid: false, dueDate: "2024-01-30" },
        delivery: { amount: 2000, paid: false, dueDate: "2024-02-15" },
      },
      exporter: {
        id: 101,
        name: "Mumbai Cotton Mills",
        location: "Mumbai, India",
      },
    },
  ];

  const categories = [
    "all",
    "Textiles",
    "Spices",
    "Food Grains",
    "Electronics",
    "Machinery",
  ];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.exporter.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "advance_paid":
        return "bg-yellow-100 text-yellow-800";
      case "shipment_paid":
        return "bg-blue-100 text-blue-800";
      case "delivered_paid":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">VASA</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <User className="h-3 w-3 mr-1" />
                Verified Importer
              </Badge>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Importer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Discover and purchase products from verified exporters worldwide
          </p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">All Products</TabsTrigger>
            <TabsTrigger value="cart" className="relative">
              Shopping Cart
              {cart.length > 0 && (
                <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cart.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products, exporters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price_low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {product.certification.map((cert) => (
                        <Badge
                          key={cert}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(product.rating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg font-semibold text-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {product.unit}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        MOQ: {product.moq}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {product.exporter.name}
                        </span>
                      </div>
                      {product.exporter.verified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {product.exporter.location}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCart(product)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {sortedProducts.length > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from(
                    { length: Math.ceil(sortedProducts.length / itemsPerPage) },
                    (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Cart ({cart.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Browse products and add them to your cart
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-border rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {item.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.exporter.name}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            ${item.price.toFixed(2)} {item.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="w-12 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-foreground">
                          Total: ${getCartTotal().toFixed(2)}
                        </span>
                      </div>
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  My Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No orders yet
                    </h3>
                    <p className="text-muted-foreground">
                      Your order history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-border rounded-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-foreground text-lg">
                              Order {order.orderNumber}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Placed on {order.orderDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                            <Badge
                              className={`${getPaymentStatusColor(order.paymentStatus)} ml-2`}
                            >
                              {order.paymentStatus
                                .replace("_", " ")
                                .toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h5 className="font-medium text-foreground mb-2">
                              Products
                            </h5>
                            {order.products.map((product) => (
                              <div
                                key={product.id}
                                className="text-sm text-muted-foreground"
                              >
                                {product.name} (Qty: {product.quantity})
                              </div>
                            ))}
                          </div>

                          <div>
                            <h5 className="font-medium text-foreground mb-2">
                              Payment Progress
                            </h5>
                            <div className="space-y-1">
                              <div
                                className={`text-xs p-1 rounded ${order.paymentMilestones.advance.paid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                              >
                                Advance: $
                                {order.paymentMilestones.advance.amount}{" "}
                                {order.paymentMilestones.advance.paid
                                  ? "✓"
                                  : "Pending"}
                              </div>
                              <div
                                className={`text-xs p-1 rounded ${order.paymentMilestones.shipment.paid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                              >
                                Shipment: $
                                {order.paymentMilestones.shipment.amount}{" "}
                                {order.paymentMilestones.shipment.paid
                                  ? "✓"
                                  : "Pending"}
                              </div>
                              <div
                                className={`text-xs p-1 rounded ${order.paymentMilestones.delivery.paid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                              >
                                Delivery: $
                                {order.paymentMilestones.delivery.amount}{" "}
                                {order.paymentMilestones.delivery.paid
                                  ? "✓"
                                  : "Pending"}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-foreground mb-2">
                              Order Details
                            </h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Total: ${order.totalAmount}</div>
                              <div>Exporter: {order.exporter.name}</div>
                              <div>
                                Est. Delivery: {order.estimatedDelivery}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-foreground mb-2">
                        Profile Details
                      </h5>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Business Name: Global Imports Ltd.</div>
                        <div>Contact: John Smith</div>
                        <div>Email: john@globalimports.com</div>
                        <div>Phone: +1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-2">
                        Verification Status
                      </h5>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            ✓ Email Verified
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            ✓ KYC Verified
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            ✓ Business Verified
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex gap-2">
                      <Button variant="outline">Edit Profile</Button>
                      <Button variant="outline">Update Documents</Button>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
