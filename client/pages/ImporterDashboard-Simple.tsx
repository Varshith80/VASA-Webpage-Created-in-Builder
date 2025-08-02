import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  certification?: string[];
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
  paymentStatus: "pending" | "advance_paid" | "shipment_paid" | "completed";
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
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const itemsPerPage = 12;

  // Get tab from URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get("tab");
    if (tab && ["products", "cart", "orders", "account"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Mock data
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Premium Basmati Rice",
      description: "High-quality long grain basmati rice from India",
      price: 2.5,
      currency: "USD",
      unit: "kg",
      category: "Food Grains",
      rating: 4.8,
      reviewCount: 124,
      image: "/api/placeholder/300/200",
      exporter: {
        id: 101,
        name: "Mumbai Cotton Mills",
        location: "Mumbai, India",
        verified: true,
        rating: 4.9,
      },
      moq: "1000 kg",
      availability: 50000,
      tags: ["Premium", "Export Quality", "Long Grain"],
      certification: ["FSSAI", "Export License"],
    },
    // Add more mock products as needed...
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Importer Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your imports and orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Simple Tab Navigation */}
        <div className="border-b border-border mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                activeTab === "cart"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Shopping Cart
              {cart.length > 0 && (
                <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cart.length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "orders"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "account"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Account
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
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
                  <div className="flex gap-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="featured">Featured</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Rating</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${product.price} / {product.unit}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => console.log('Add to cart:', product.id)}
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === "cart" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground mb-4">
                  Browse products and add them to your cart
                </p>
                <Button onClick={() => setActiveTab("products")}>
                  Browse Products
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-foreground">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {order.orderDate}
                        </p>
                      </div>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total: {order.currency} {order.totalAmount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Profile</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> John Doe</p>
                    <p><strong>Email:</strong> john@example.com</p>
                    <p><strong>Role:</strong> Importer</p>
                    <p><strong>Company:</strong> Global Trade Inc.</p>
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
        )}
      </div>
    </div>
  );
}
