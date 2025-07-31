import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Globe, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Clock,
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { AnimatedCounter } from './AnimatedComponents';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    activeUsers: number;
    usersChange: number;
    conversionRate: number;
    conversionChange: number;
  };
  revenueData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
    category: string;
    seller: string;
  }>;
  topCategories: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  geographicData: Array<{
    country: string;
    revenue: number;
    orders: number;
    users: number;
  }>;
  userActivity: Array<{
    time: string;
    active: number;
    new: number;
  }>;
  salesFunnel: {
    visitors: number;
    productViews: number;
    addToCart: number;
    checkout: number;
    purchase: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'order' | 'user' | 'product' | 'review';
    description: string;
    timestamp: string;
    value?: number;
    status?: 'success' | 'warning' | 'error';
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: 'pdf' | 'csv' | 'excel') => void;
  timeRange?: '24h' | '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: string) => void;
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  isLoading = false,
  onRefresh,
  onExport,
  timeRange = '30d',
  onTimeRangeChange,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefresh]);

  // Calculate percentage changes
  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Funnel conversion rates
  const funnelData = useMemo(() => {
    const { salesFunnel } = data;
    return [
      { 
        stage: 'Visitors', 
        count: salesFunnel.visitors, 
        percentage: 100,
        conversion: 100
      },
      { 
        stage: 'Product Views', 
        count: salesFunnel.productViews, 
        percentage: (salesFunnel.productViews / salesFunnel.visitors) * 100,
        conversion: (salesFunnel.productViews / salesFunnel.visitors) * 100
      },
      { 
        stage: 'Add to Cart', 
        count: salesFunnel.addToCart, 
        percentage: (salesFunnel.addToCart / salesFunnel.visitors) * 100,
        conversion: (salesFunnel.addToCart / salesFunnel.productViews) * 100
      },
      { 
        stage: 'Checkout', 
        count: salesFunnel.checkout, 
        percentage: (salesFunnel.checkout / salesFunnel.visitors) * 100,
        conversion: (salesFunnel.checkout / salesFunnel.addToCart) * 100
      },
      { 
        stage: 'Purchase', 
        count: salesFunnel.purchase, 
        percentage: (salesFunnel.purchase / salesFunnel.visitors) * 100,
        conversion: (salesFunnel.purchase / salesFunnel.checkout) * 100
      }
    ];
  }, [data.salesFunnel]);

  const renderMetricCard = (title: string, value: number, change: number, icon: React.ReactNode, format: 'number' | 'currency' | 'percentage' = 'number') => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold text-gray-900">
                {format === 'currency' && '$'}
                <AnimatedCounter value={value} />
                {format === 'percentage' && '%'}
              </span>
              {change !== 0 && (
                <div className={`flex items-center gap-1 ${getChangeColor(change)}`}>
                  {getChangeIcon(change)}
                  <span className="text-sm font-medium">
                    {Math.abs(change).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderActivityItem = (activity: any) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'order':
          return <ShoppingCart className="h-4 w-4 text-blue-600" />;
        case 'user':
          return <Users className="h-4 w-4 text-green-600" />;
        case 'product':
          return <Package className="h-4 w-4 text-purple-600" />;
        case 'review':
          return <Star className="h-4 w-4 text-yellow-600" />;
        default:
          return <Activity className="h-4 w-4 text-gray-600" />;
      }
    };

    const getStatusColor = () => {
      switch (activity.status) {
        case 'success':
          return 'bg-green-100 text-green-800';
        case 'warning':
          return 'bg-yellow-100 text-yellow-800';
        case 'error':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0">
          {getActivityIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{activity.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{activity.timestamp}</span>
            {activity.value && (
              <span className="text-xs font-medium text-gray-700">
                ${activity.value.toLocaleString()}
              </span>
            )}
            {activity.status && (
              <Badge className={`text-xs ${getStatusColor()}`}>
                {activity.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights into your trade platform performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Select onValueChange={(value) => onExport?.(value as any)}>
            <SelectTrigger className="w-32">
              <Download className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">Export PDF</SelectItem>
              <SelectItem value="csv">Export CSV</SelectItem>
              <SelectItem value="excel">Export Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          "Total Revenue",
          data.overview.totalRevenue,
          data.overview.revenueChange,
          <DollarSign className="h-6 w-6 text-blue-600" />,
          'currency'
        )}
        {renderMetricCard(
          "Total Orders",
          data.overview.totalOrders,
          data.overview.ordersChange,
          <ShoppingCart className="h-6 w-6 text-blue-600" />
        )}
        {renderMetricCard(
          "Active Users",
          data.overview.activeUsers,
          data.overview.usersChange,
          <Users className="h-6 w-6 text-blue-600" />
        )}
        {renderMetricCard(
          "Conversion Rate",
          data.overview.conversionRate,
          data.overview.conversionChange,
          <Target className="h-6 w-6 text-blue-600" />,
          'percentage'
        )}
      </div>

      {/* Auto-refresh Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="auto-refresh" className="text-sm font-medium">
                Auto-refresh
              </label>
            </div>
            
            {autoRefresh && (
              <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Card>

      {/* Main Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            {stage.count.toLocaleString()}
                          </span>
                          <span className="text-sm font-medium">
                            {stage.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                      {index > 0 && (
                        <div className="text-xs text-gray-500">
                          {stage.conversion.toFixed(1)}% conversion from previous stage
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.recentActivity.map(renderActivityItem)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {/* Sales Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart data={data.topCategories} cx="50%" cy="50%" outerRadius={80}>
                      {data.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {data.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <span className="text-sm font-medium">{category.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Seller</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((product, index) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{index + 1}.</span>
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant="secondary">{product.category}</Badge>
                        </td>
                        <td className="py-3 text-gray-600">{product.seller}</td>
                        <td className="py-3 text-right font-medium">
                          ${product.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">{product.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" fill="#3b82f6" />
                  <Bar dataKey="new" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Product Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={1247} />
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={15432} />
                </div>
                <div className="text-sm text-gray-600">Product Views</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          {/* Geographic Data */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.geographicData.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{index + 1}.</span>
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">Revenue: </span>
                        <span className="font-medium">${country.revenue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Orders: </span>
                        <span className="font-medium">{country.orders}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Users: </span>
                        <span className="font-medium">{country.users}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
