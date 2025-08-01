import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CancelOrderDialog } from "@/components/ConfirmationDialog";
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  Upload,
  Star,
  Building2,
  ArrowLeft,
  User,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Mail,
  Search,
  Filter,
  FileText,
  Image,
  MapPin,
  Calendar,
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
  images: string[];
  moq: string;
  availability: number;
  tags: string[];
  certification: string[];
  status: "active" | "draft" | "under_review" | "inactive";
  createdDate: string;
  lastUpdated: string;
}

interface Order {
  id: number;
  orderNumber: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus:
    | "advance_paid"
    | "shipment_paid"
    | "delivered_paid"
    | "completed";
  orderDate: string;
  estimatedDelivery: string;
  importer: {
    id: number;
    name: string;
    location: string;
    verified: boolean;
  };
  paymentMilestones: {
    advance: { amount: number; paid: boolean; dueDate: string };
    shipment: { amount: number; paid: boolean; dueDate: string };
    delivery: { amount: number; paid: boolean; dueDate: string };
  };
}

export default function ExporterDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([
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
      images: ["/api/placeholder/300/200"],
      moq: "1000 kg",
      availability: 25000,
      tags: ["Organic", "GOTS Certified", "Premium"],
      certification: ["GOTS", "ISO 9001"],
      status: "active",
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Premium Green Cardamom",
      description: "Fresh premium green cardamom from Kerala hills",
      price: 85.0,
      currency: "USD",
      unit: "per kg",
      category: "Spices",
      rating: 4.7,
      reviewCount: 89,
      images: ["/api/placeholder/300/200"],
      moq: "50 kg",
      availability: 2000,
      tags: ["Premium", "Fresh", "Hill Grown"],
      certification: ["Organic", "FSSAI"],
      status: "active",
      createdDate: "2024-01-08",
      lastUpdated: "2024-01-12",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      productId: 1,
      productName: "Premium Organic Cotton",
      quantity: 2000,
      unitPrice: 2.5,
      totalAmount: 5000,
      currency: "USD",
      status: "confirmed",
      paymentStatus: "advance_paid",
      orderDate: "2024-01-15",
      estimatedDelivery: "2024-02-15",
      importer: {
        id: 201,
        name: "Global Imports Ltd.",
        location: "New York, USA",
        verified: true,
      },
      paymentMilestones: {
        advance: { amount: 500, paid: true, dueDate: "2024-01-15" },
        shipment: { amount: 2500, paid: false, dueDate: "2024-01-30" },
        delivery: { amount: 2000, paid: false, dueDate: "2024-02-15" },
      },
    },
  ]);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    unit: "per kg",
    category: "",
    moq: "",
    availability: "",
    tags: "",
    certification: "",
    images: [] as File[],
    documents: [] as File[],
    rating: 5,
  });

  // Handle URL parameters for direct tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['products', 'orders', 'analytics', 'account'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const categories = [
    "Textiles",
    "Spices",
    "Food Grains",
    "Electronics",
    "Machinery",
    "Chemicals",
  ];
  const currencies = ["USD", "EUR", "GBP", "INR", "CNY"];
  const units = ["per kg", "per meter", "per piece", "per ton", "per liter"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
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

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      currency: newProduct.currency,
      unit: newProduct.unit,
      category: newProduct.category,
      rating: newProduct.rating,
      reviewCount: 0,
      images: ["/api/placeholder/300/200"],
      moq: newProduct.moq,
      availability: parseInt(newProduct.availability),
      tags: newProduct.tags.split(",").map((tag) => tag.trim()),
      certification: newProduct.certification
        .split(",")
        .map((cert) => cert.trim()),
      status: "under_review",
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setProducts([...products, product]);
    setIsAddProductOpen(false);

    // Reset form
    setNewProduct({
      name: "",
      description: "",
      price: "",
      currency: "USD",
      unit: "per kg",
      category: "",
      moq: "",
      availability: "",
      tags: "",
      certification: "",
      images: [],
      documents: [],
      rating: 5,
    });
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleDeleteOrder = (orderId: number) => {
    setOrders(orders.filter((o) => o.id !== orderId));
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

  const getTotalRevenue = () => {
    return orders
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const getActiveOrders = () => {
    return orders.filter(
      (order) =>
        order.status === "pending" ||
        order.status === "confirmed" ||
        order.status === "shipped",
    ).length;
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
              <Badge
                variant="secondary"
                className="px-3 py-1 bg-green-100 text-green-800"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Exporter
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Exporter Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your products and track orders from importers worldwide
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Total Products
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {products.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Orders</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {getActiveOrders()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <p className="text-2xl font-semibold text-foreground">
                    ${getTotalRevenue().toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg. Rating</p>
                  <p className="text-2xl font-semibold text-foreground">4.8</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders Received</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    My Products ({products.length})
                  </CardTitle>
                  <Dialog
                    open={isAddProductOpen}
                    onOpenChange={setIsAddProductOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Fill in the details to add a new product to your
                          catalog
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="productName">Product Name *</Label>
                            <Input
                              id="productName"
                              value={newProduct.name}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., Premium Organic Cotton"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                              value={newProduct.category}
                              onValueChange={(value) =>
                                setNewProduct({
                                  ...newProduct,
                                  category: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                description: e.target.value,
                              })
                            }
                            placeholder="Detailed description of your product..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="price">Unit Price *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={newProduct.price}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  price: e.target.value,
                                })
                              }
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="currency">Currency *</Label>
                            <Select
                              value={newProduct.currency}
                              onValueChange={(value) =>
                                setNewProduct({
                                  ...newProduct,
                                  currency: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency} value={currency}>
                                    {currency}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="unit">Unit *</Label>
                            <Select
                              value={newProduct.unit}
                              onValueChange={(value) =>
                                setNewProduct({ ...newProduct, unit: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="moq">
                              Minimum Order Quantity *
                            </Label>
                            <Input
                              id="moq"
                              value={newProduct.moq}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  moq: e.target.value,
                                })
                              }
                              placeholder="e.g., 1000 kg"
                            />
                          </div>
                          <div>
                            <Label htmlFor="availability">
                              Available Quantity *
                            </Label>
                            <Input
                              id="availability"
                              type="number"
                              value={newProduct.availability}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  availability: e.target.value,
                                })
                              }
                              placeholder="Available stock"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            value={newProduct.tags}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                tags: e.target.value,
                              })
                            }
                            placeholder="e.g., Organic, Premium, GOTS Certified"
                          />
                        </div>

                        <div>
                          <Label htmlFor="certification">
                            Certifications (comma-separated)
                          </Label>
                          <Input
                            id="certification"
                            value={newProduct.certification}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                certification: e.target.value,
                              })
                            }
                            placeholder="e.g., ISO 9001, GOTS, Organic"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="images">Product Images *</Label>
                            <div className="border-2 border-dashed border-border p-4 text-center">
                              <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Upload product images
                              </p>
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                className="mt-2"
                                onChange={(e) =>
                                  setNewProduct({
                                    ...newProduct,
                                    images: Array.from(e.target.files || []),
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="documents">
                              Certificates/Documents
                            </Label>
                            <div className="border-2 border-dashed border-border p-4 text-center">
                              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Upload certificates
                              </p>
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                multiple
                                className="mt-2"
                                onChange={(e) =>
                                  setNewProduct({
                                    ...newProduct,
                                    documents: Array.from(e.target.files || []),
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Initial Product Rating</Label>
                          <div className="flex gap-1 mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-6 w-6 cursor-pointer ${
                                  i < newProduct.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() =>
                                  setNewProduct({
                                    ...newProduct,
                                    rating: i + 1,
                                  })
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddProductOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddProduct}
                          disabled={
                            !newProduct.name ||
                            !newProduct.price ||
                            !newProduct.category
                          }
                        >
                          Add Product
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Products List */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || filterStatus !== "all"
                        ? "Try adjusting your search or filters"
                        : "Start by adding your first product"}
                    </p>
                    {!searchTerm && filterStatus === "all" && (
                      <Button onClick={() => setIsAddProductOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="border border-border rounded-lg p-6"
                      >
                        <div className="flex gap-4">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  className={getStatusColor(product.status)}
                                >
                                  {product.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-4">
                              <div>
                                <p className="text-muted-foreground">Price</p>
                                <p className="font-medium text-foreground">
                                  {product.currency} {product.price}{" "}
                                  {product.unit}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Category
                                </p>
                                <p className="font-medium text-foreground">
                                  {product.category}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">MOQ</p>
                                <p className="font-medium text-foreground">
                                  {product.moq}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Stock</p>
                                <p className="font-medium text-foreground">
                                  {product.availability.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Rating</p>
                                <div className="flex items-center gap-1">
                                  {renderStars(product.rating)}
                                  <span className="text-xs text-muted-foreground">
                                    ({product.reviewCount})
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Updated</p>
                                <p className="font-medium text-foreground">
                                  {product.lastUpdated}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Product
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {product.name}"? This action cannot be
                                      undone and will remove the product from
                                      all importers' carts and wishlists.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete Product
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                  <Mail className="h-5 w-5" />
                  Orders Received ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No orders received yet
                    </h3>
                    <p className="text-muted-foreground">
                      Orders from importers will appear here
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
                              {order.productName} (Qty:{" "}
                              {order.quantity.toLocaleString()})
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={getOrderStatusColor(order.status)}
                            >
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
                              Importer Details
                            </h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {order.importer.name}
                                {order.importer.verified && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs ml-1"
                                  >
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {order.importer.location}
                              </div>
                            </div>
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
                              <div>
                                Total: ${order.totalAmount.toLocaleString()}
                              </div>
                              <div>Unit Price: ${order.unitPrice}</div>
                              <div>Order Date: {order.orderDate}</div>
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
                          {(order.status === "pending" ||
                            order.status === "confirmed") && (
                            <CancelOrderDialog
                              orderNumber={order.orderNumber}
                              onConfirm={() => handleDeleteOrder(order.id)}
                              trigger={
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Cancel Order
                                </Button>
                              }
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Business Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-4">
                      Product Performance
                    </h3>
                    <div className="space-y-3">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="flex justify-between items-center p-3 border border-border rounded"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Rating: {product.rating} ({product.reviewCount}{" "}
                              reviews)
                            </p>
                          </div>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground mb-4">
                      Revenue Overview
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-border rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Total Revenue
                          </span>
                          <span className="font-semibold text-foreground">
                            ${getTotalRevenue().toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 border border-border rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Active Orders
                          </span>
                          <span className="font-semibold text-foreground">
                            {getActiveOrders()}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 border border-border rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Average Order Value
                          </span>
                          <span className="font-semibold text-foreground">
                            $
                            {orders.length > 0
                              ? Math.round(
                                  getTotalRevenue() / orders.length,
                                ).toLocaleString()
                              : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                        Business Details
                      </h5>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Business Name: Mumbai Cotton Mills</div>
                        <div>Owner: Raj Patel</div>
                        <div>Email: raj@mumbaicoton.com</div>
                        <div>Phone: +91 98765 43210</div>
                        <div>License: EX123456789</div>
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
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            ✓ Export License Verified
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
