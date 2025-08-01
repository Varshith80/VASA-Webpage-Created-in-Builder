import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Bell,
  Star,
  Globe,
  Truck,
  CreditCard,
  BarChart3,
  PlusCircle,
  Eye,
  MessageSquare,
  Settings,
  Download,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TrustBadge, UserTrustIndicator } from "@/components/TrustBadges";
import {
  OnboardingProgress,
  OnboardingTour,
} from "@/components/OnboardingTour";

import { cn } from "@/lib/utils";

interface DashboardProps {
  userRole: "importer" | "exporter" | "admin";
}

// Sample data - in real app this would come from API
const sampleUser = {
  id: "1",
  name: "John Smith",
  email: "john@acmecorp.com",
  avatar: "/api/placeholder/100/100",
  role: "importer" as const,
  companyName: "ACME Import Corp",
  joinedDate: "2023-01-15",
  isVerified: true,
  isPremium: true,
  rating: 4.8,
  totalReviews: 45,
  establishedYear: 2018,
  totalOrders: 156,
  successRate: 98.7,
  hasCompletedProfile: true,
  hasUploadedDocuments: true,
  hasPlacedOrder: true,
};

const sampleStats = {
  importer: {
    totalOrders: 156,
    activeOrders: 12,
    completedOrders: 144,
    totalSpent: 2450000,
    savedAmount: 245000,
    averageOrderValue: 15705,
    topCategories: ["Electronics", "Machinery", "Textiles"],
    recentActivity: [
      {
        type: "order_placed",
        description: "Placed order for Electronic Components",
        time: "2 hours ago",
      },
      {
        type: "payment_made",
        description: "Completed shipment payment for Order #VASA20240115001",
        time: "1 day ago",
      },
      {
        type: "message_received",
        description: "New message from supplier GlobalTech",
        time: "2 days ago",
      },
    ],
  },
  exporter: {
    totalProducts: 89,
    activeListings: 67,
    totalOrders: 234,
    totalRevenue: 1850000,
    averageOrderValue: 7906,
    conversionRate: 12.4,
    topProducts: ["Electronic Components", "Steel Parts", "Textile Machinery"],
    recentActivity: [
      {
        type: "order_received",
        description: "New order received for Premium Components",
        time: "1 hour ago",
      },
      {
        type: "product_viewed",
        description: "Your Steel Parts listing viewed 45 times today",
        time: "3 hours ago",
      },
      {
        type: "payment_received",
        description: "Received advance payment for Order #VASA20240115002",
        time: "1 day ago",
      },
    ],
  },
};

export default function Dashboard({ userRole = "importer" }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const stats = sampleStats[userRole];
  const isExporter = userRole === "exporter";

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const quickActions = isExporter
    ? [
        {
          icon: PlusCircle,
          label: "Add Product",
          href: "/products/new",
          color: "bg-blue-500",
        },
        {
          icon: Package,
          label: "Manage Orders",
          href: "/orders",
          color: "bg-green-500",
        },
        {
          icon: BarChart3,
          label: "View Analytics",
          href: "/analytics",
          color: "bg-purple-500",
        },
        {
          icon: MessageSquare,
          label: "Messages",
          href: "/messages",
          color: "bg-orange-500",
        },
      ]
    : [
        {
          icon: Search,
          label: "Find Products",
          href: "/search",
          color: "bg-blue-500",
        },
        {
          icon: ShoppingCart,
          label: "My Orders",
          href: "/orders",
          color: "bg-green-500",
        },
        {
          icon: Star,
          label: "Saved Items",
          href: "/favorites",
          color: "bg-yellow-500",
        },
        {
          icon: MessageSquare,
          label: "Messages",
          href: "/messages",
          color: "bg-orange-500",
        },
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="text-xl font-bold">VASA</span>
              </Link>

              <Badge variant="outline" className="hidden sm:flex">
                {isExporter ? "Exporter Dashboard" : "Importer Dashboard"}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={cn("h-4 w-4", refreshing && "animate-spin")}
                />
              </Button>

              <ThemeToggle />

              <Button variant="ghost" size="sm" asChild>
                <Link to="/notifications">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={sampleUser.avatar} alt={sampleUser.name} />
                  <AvatarFallback>
                    {sampleUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{sampleUser.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {sampleUser.companyName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={sampleUser.avatar}
                      alt={sampleUser.name}
                    />
                    <AvatarFallback>
                      {sampleUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{sampleUser.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {sampleUser.companyName}
                    </div>
                  </div>
                </div>

                <UserTrustIndicator user={sampleUser} className="mb-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span>{new Date(sampleUser.joinedDate).getFullYear()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success rate</span>
                    <span className="text-green-600">
                      {sampleUser.successRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{sampleUser.rating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Progress */}
            <OnboardingProgress userRole={userRole} user={sampleUser} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-auto flex-col gap-2 p-3"
                      >
                        <Link to={action.href}>
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              action.color,
                            )}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs">{action.label}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {isExporter ? "Total Products" : "Total Orders"}
                          </p>
                          <p className="text-2xl font-bold">
                            {isExporter
                              ? stats.totalProducts
                              : stats.totalOrders}
                          </p>
                        </div>
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-600">
                          +12% from last month
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {isExporter ? "Total Revenue" : "Total Spent"}
                          </p>
                          <p className="text-2xl font-bold">
                            $
                            {(isExporter
                              ? stats.totalRevenue
                              : stats.totalSpent
                            ).toLocaleString()}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-600">
                          +8% from last month
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {isExporter ? "Active Orders" : "Active Orders"}
                          </p>
                          <p className="text-2xl font-bold">
                            {stats.activeOrders}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">
                          3 requiring attention
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Avg Order Value
                          </p>
                          <p className="text-2xl font-bold">
                            ${stats.averageOrderValue.toLocaleString()}
                          </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-600">
                          +5% from last month
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Recent Activity
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/activity">View All</Link>
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.recentActivity.map((activity, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Categories/Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {isExporter ? "Top Products" : "Top Categories"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(isExporter
                          ? stats.topProducts
                          : stats.topCategories
                        ).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">{item}</span>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={80 - index * 20}
                                className="w-16 h-2"
                              />
                              <span className="text-xs text-muted-foreground">
                                {80 - index * 20}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      Pending Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium">Payment Due</p>
                            <p className="text-xs text-muted-foreground">
                              Shipment payment for Order #VASA20240115003
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span title="Payment due on shipment">💳</span>
                          <Button size="sm">Pay Now</Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">
                              Document Upload Required
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Commercial invoice needed for customs clearance
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Upload
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Orders</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button size="sm" asChild>
                          <Link to="/orders">View All Orders</Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample orders */}
                      {[1, 2, 3].map((order) => (
                        <div
                          key={order}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Electronic Components Set #{order}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Order #VASA2024011500{order}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {order === 1
                                    ? "Shipped"
                                    : order === 2
                                      ? "Processing"
                                      : "Delivered"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {order === 1
                                    ? "2 days ago"
                                    : order === 2
                                      ? "5 days ago"
                                      : "1 week ago"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(15000 + order * 2500).toLocaleString()}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Order Success Rate</span>
                          <span className="text-sm font-medium">
                            {sampleUser.successRate}%
                          </span>
                        </div>
                        <Progress value={sampleUser.successRate} />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Customer Satisfaction</span>
                          <span className="text-sm font-medium">
                            {sampleUser.rating}/5.0
                          </span>
                        </div>
                        <Progress value={(sampleUser.rating / 5) * 100} />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">On-time Delivery</span>
                          <span className="text-sm font-medium">94%</span>
                        </div>
                        <Progress value={94} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {sampleUser.totalOrders}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total Orders
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {sampleUser.totalReviews}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Reviews
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">15</p>
                          <p className="text-xs text-muted-foreground">
                            Countries
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">$2.4M</p>
                          <p className="text-xs text-muted-foreground">
                            Trade Volume
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {stats.recentActivity
                        .concat([
                          {
                            type: "profile_updated",
                            description: "Updated company profile information",
                            time: "3 days ago",
                          },
                          {
                            type: "verification_completed",
                            description:
                              "Account verification completed successfully",
                            time: "1 week ago",
                          },
                          {
                            type: "joined",
                            description: "Joined VASA platform",
                            time: "1 year ago",
                          },
                        ])
                        .map((activity, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Onboarding Tour */}
      <OnboardingTour
        userRole={userRole}
        isFirstTime={false}
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
      />
    </div>
  );
}
