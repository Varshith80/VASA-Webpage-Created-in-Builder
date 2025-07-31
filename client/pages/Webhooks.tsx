import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Edit, 
  Trash2, 
  TestTube, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Eye,
  RotateCcw,
  Settings,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebhookConfig {
  id?: string;
  name: string;
  description?: string;
  url: string;
  method: "POST" | "PUT" | "PATCH";
  events: string[];
  isActive: boolean;
  headers?: Record<string, string>;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
    timeout: number;
  };
  filters?: {
    orderStatuses?: string[];
    paymentTypes?: string[];
    minOrderValue?: number;
    countries?: string[];
    productCategories?: string[];
  };
  stats?: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageResponseTime: number;
    lastDeliveryAt: string;
  };
  verification?: {
    isHealthy: boolean;
    consecutiveFailures: number;
  };
  tags?: string[];
}

interface WebhookLog {
  id: string;
  eventType: string;
  status: "pending" | "success" | "failed" | "retry" | "abandoned";
  attempts: number;
  createdAt: string;
  response?: {
    statusCode: number;
    responseTime: number;
  };
  error?: {
    message: string;
    type: string;
  };
}

const WEBHOOK_EVENTS = {
  order: [
    "order.created",
    "order.updated",
    "order.cancelled",
    "order.completed",
    "order.disputed",
  ],
  payment: [
    "payment.pending",
    "payment.completed",
    "payment.failed",
    "payment.refunded",
    "payment.advance_paid",
    "payment.shipment_paid",
    "payment.delivery_paid",
  ],
  shipping: [
    "shipping.ready_to_ship",
    "shipping.shipped",
    "shipping.in_transit",
    "shipping.delivered",
    "shipping.delayed",
    "shipping.returned",
  ],
  product: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product.low_stock",
    "product.out_of_stock",
  ],
  user: [
    "user.verified",
    "user.suspended",
    "account.kyc_approved",
    "account.kyc_rejected",
  ],
  document: [
    "document.uploaded",
    "document.verified",
    "document.rejected",
  ],
  compliance: [
    "compliance.check_required",
    "compliance.check_passed",
    "compliance.check_failed",
  ],
  system: [
    "system.maintenance",
    "system.alert",
  ],
};

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  // Form state for webhook creation/editing
  const [formData, setFormData] = useState<Partial<WebhookConfig>>({
    name: "",
    description: "",
    url: "",
    method: "POST",
    events: [],
    isActive: true,
    headers: {},
    retryConfig: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      timeout: 30000,
    },
    filters: {},
    tags: [],
  });

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockWebhooks: WebhookConfig[] = [
        {
          id: "1",
          name: "ERP Integration",
          description: "Sync orders and payments to our ERP system",
          url: "https://api.myerp.com/webhooks/vasa",
          method: "POST",
          events: ["order.created", "order.updated", "payment.completed"],
          isActive: true,
          stats: {
            totalDeliveries: 156,
            successfulDeliveries: 152,
            failedDeliveries: 4,
            averageResponseTime: 245,
            lastDeliveryAt: new Date().toISOString(),
          },
          verification: {
            isHealthy: true,
            consecutiveFailures: 0,
          },
          tags: ["erp", "orders"],
        },
        {
          id: "2",
          name: "Inventory Management",
          description: "Update inventory levels when products change",
          url: "https://inventory.mycompany.com/api/updates",
          method: "POST",
          events: ["product.updated", "product.low_stock", "product.out_of_stock"],
          isActive: true,
          stats: {
            totalDeliveries: 89,
            successfulDeliveries: 86,
            failedDeliveries: 3,
            averageResponseTime: 189,
            lastDeliveryAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          verification: {
            isHealthy: true,
            consecutiveFailures: 1,
          },
          tags: ["inventory", "products"],
        },
        {
          id: "3",
          name: "Slack Notifications",
          description: "Send important events to our team Slack channel",
          url: "https://hooks.slack.com/services/xxx/yyy/zzz",
          method: "POST",
          events: ["order.disputed", "payment.failed", "compliance.check_failed"],
          isActive: false,
          stats: {
            totalDeliveries: 23,
            successfulDeliveries: 18,
            failedDeliveries: 5,
            averageResponseTime: 1200,
            lastDeliveryAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          verification: {
            isHealthy: false,
            consecutiveFailures: 5,
          },
          tags: ["notifications", "alerts"],
        },
      ];
      setWebhooks(mockWebhooks);
    } catch (error) {
      console.error("Error loading webhooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWebhookLogs = async (webhookId: string) => {
    try {
      // Mock logs data
      const mockLogs: WebhookLog[] = [
        {
          id: "1",
          eventType: "order.created",
          status: "success",
          attempts: 1,
          createdAt: new Date().toISOString(),
          response: {
            statusCode: 200,
            responseTime: 245,
          },
        },
        {
          id: "2",
          eventType: "payment.completed",
          status: "failed",
          attempts: 3,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          response: {
            statusCode: 500,
            responseTime: 5000,
          },
          error: {
            message: "Internal server error",
            type: "server_error",
          },
        },
        {
          id: "3",
          eventType: "order.updated",
          status: "retry",
          attempts: 2,
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          response: {
            statusCode: 429,
            responseTime: 1000,
          },
          error: {
            message: "Rate limit exceeded",
            type: "rate_limit_error",
          },
        },
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error("Error loading webhook logs:", error);
    }
  };

  const handleCreateWebhook = async () => {
    try {
      console.log("Creating webhook:", formData);
      // Here you would make the API call
      setCreateDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        url: "",
        method: "POST",
        events: [],
        isActive: true,
        headers: {},
        retryConfig: {
          maxRetries: 3,
          retryDelay: 1000,
          backoffMultiplier: 2,
          timeout: 30000,
        },
        filters: {},
        tags: [],
      });
      loadWebhooks();
    } catch (error) {
      console.error("Error creating webhook:", error);
    }
  };

  const handleUpdateWebhook = async () => {
    try {
      console.log("Updating webhook:", formData);
      setEditDialogOpen(false);
      loadWebhooks();
    } catch (error) {
      console.error("Error updating webhook:", error);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (confirm("Are you sure you want to delete this webhook?")) {
      try {
        console.log("Deleting webhook:", webhookId);
        loadWebhooks();
      } catch (error) {
        console.error("Error deleting webhook:", error);
      }
    }
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    try {
      console.log("Testing webhook:", webhook.id);
      // Mock test result
      setTestResults({
        success: true,
        statusCode: 200,
        responseTime: 250,
        message: "Test webhook delivered successfully",
      });
    } catch (error) {
      console.error("Error testing webhook:", error);
      setTestResults({
        success: false,
        error: "Failed to deliver test webhook",
      });
    }
  };

  const handleToggleWebhook = async (webhookId: string, isActive: boolean) => {
    try {
      console.log("Toggling webhook:", webhookId, isActive);
      setWebhooks(prev => 
        prev.map(w => w.id === webhookId ? { ...w, isActive } : w)
      );
    } catch (error) {
      console.error("Error toggling webhook:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "failed":
      case "abandoned":
        return "text-red-600 bg-red-100";
      case "retry":
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getHealthStatus = (webhook: WebhookConfig) => {
    if (!webhook.isActive) return { status: "disabled", color: "text-gray-500" };
    if (webhook.verification?.consecutiveFailures === 0) return { status: "healthy", color: "text-green-600" };
    if (webhook.verification && webhook.verification.consecutiveFailures < 3) return { status: "degraded", color: "text-yellow-600" };
    return { status: "unhealthy", color: "text-red-600" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Webhook Management</h1>
          <p className="text-muted-foreground">
            Configure webhooks to integrate with your external systems and receive real-time notifications.
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Configure a new webhook endpoint to receive event notifications.
              </DialogDescription>
            </DialogHeader>
            <WebhookForm
              data={formData}
              onChange={setFormData}
              onSubmit={handleCreateWebhook}
              submitLabel="Create Webhook"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Test Results Alert */}
      {testResults && (
        <Alert className={testResults.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {testResults.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>
            {testResults.success ? (
              <>
                Test webhook delivered successfully! 
                Status: {testResults.statusCode}, 
                Response time: {formatDuration(testResults.responseTime)}
              </>
            ) : (
              <>Test webhook failed: {testResults.error}</>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Webhooks List */}
      <div className="grid gap-4">
        {webhooks.map((webhook) => {
          const health = getHealthStatus(webhook);
          const successRate = webhook.stats 
            ? ((webhook.stats.successfulDeliveries / webhook.stats.totalDeliveries) * 100).toFixed(1)
            : "0";

          return (
            <Card key={webhook.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{webhook.name}</CardTitle>
                      <Badge variant={webhook.isActive ? "default" : "secondary"}>
                        {webhook.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className={cn("flex items-center gap-1", health.color)}>
                        {health.status === "healthy" && <CheckCircle className="h-4 w-4" />}
                        {health.status === "degraded" && <Clock className="h-4 w-4" />}
                        {health.status === "unhealthy" && <AlertCircle className="h-4 w-4" />}
                        <span className="text-xs font-medium capitalize">{health.status}</span>
                      </div>
                    </div>
                    <CardDescription>{webhook.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{webhook.url}</span>
                      <Badge variant="outline">{webhook.method}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={webhook.isActive}
                      onCheckedChange={(checked) => handleToggleWebhook(webhook.id!, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook)}
                    >
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedWebhook(webhook);
                        loadWebhookLogs(webhook.id!);
                        setLogsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(webhook);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{webhook.stats?.totalDeliveries || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Deliveries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{successRate}%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {webhook.stats?.averageResponseTime 
                        ? formatDuration(webhook.stats.averageResponseTime)
                        : "0ms"}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {webhook.verification?.consecutiveFailures || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Consecutive Fails</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">Events:</span>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.slice(0, 3).map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                      {webhook.events.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{webhook.events.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  {webhook.tags && webhook.tags.length > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-muted-foreground">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {webhook.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {webhook.stats?.lastDeliveryAt && (
                    <div className="text-sm text-muted-foreground">
                      Last delivery: {formatDate(webhook.stats.lastDeliveryAt)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {webhooks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No webhooks configured</h3>
            <p className="text-muted-foreground mb-4">
              Create your first webhook to start receiving real-time notifications.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Webhook
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Webhook</DialogTitle>
            <DialogDescription>
              Update your webhook configuration.
            </DialogDescription>
          </DialogHeader>
          <WebhookForm
            data={formData}
            onChange={setFormData}
            onSubmit={handleUpdateWebhook}
            submitLabel="Update Webhook"
          />
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={logsDialogOpen} onOpenChange={setLogsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Webhook Delivery Logs</DialogTitle>
            <DialogDescription>
              {selectedWebhook?.name} - Recent delivery attempts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{log.eventType}</Badge>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Attempt {log.attempts}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
                {log.response && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Response:</span>{" "}
                    <Badge variant="outline">
                      {log.response.statusCode}
                    </Badge>{" "}
                    in {formatDuration(log.response.responseTime)}
                  </div>
                )}
                {log.error && (
                  <div className="text-sm text-red-600">
                    <span className="font-medium">Error:</span> {log.error.message}
                  </div>
                )}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No delivery logs available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Webhook Form Component
interface WebhookFormProps {
  data: Partial<WebhookConfig>;
  onChange: (data: Partial<WebhookConfig>) => void;
  onSubmit: () => void;
  submitLabel: string;
}

function WebhookForm({ data, onChange, onSubmit, submitLabel }: WebhookFormProps) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>(data.events || []);
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>(
    Object.entries(data.headers || {}).map(([key, value]) => ({ key, value }))
  );

  const handleEventToggle = (event: string) => {
    const newEvents = selectedEvents.includes(event)
      ? selectedEvents.filter(e => e !== event)
      : [...selectedEvents, event];
    
    setSelectedEvents(newEvents);
    onChange({ ...data, events: newEvents });
  };

  const handleHeaderChange = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
    
    const headersObject = newHeaders.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    onChange({ ...data, headers: headersObject });
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    
    const headersObject = newHeaders.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    onChange({ ...data, headers: headersObject });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={data.name || ""}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="My Webhook"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method">Method</Label>
          <Select
            value={data.method || "POST"}
            onValueChange={(method) => onChange({ ...data, method: method as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description || ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Describe what this webhook is used for..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Webhook URL</Label>
        <Input
          id="url"
          type="url"
          value={data.url || ""}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          placeholder="https://api.example.com/webhooks/vasa"
        />
      </div>

      <div className="space-y-3">
        <Label>Events to Subscribe</Label>
        <Tabs defaultValue="order" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          {Object.entries(WEBHOOK_EVENTS).map(([category, events]) => (
            <TabsContent key={category} value={category === "product" || category === "user" || category === "document" || category === "compliance" || category === "system" ? "other" : category} className="space-y-2">
              {events.map((event) => (
                <div key={event} className="flex items-center space-x-2">
                  <Switch
                    id={event}
                    checked={selectedEvents.includes(event)}
                    onCheckedChange={() => handleEventToggle(event)}
                  />
                  <Label htmlFor={event} className="text-sm">{event}</Label>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Custom Headers</Label>
          <Button type="button" variant="outline" size="sm" onClick={addHeader}>
            <Plus className="h-4 w-4 mr-1" />
            Add Header
          </Button>
        </div>
        {headers.map((header, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Header Name"
              value={header.key}
              onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
            />
            <Input
              placeholder="Header Value"
              value={header.value}
              onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeHeader(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={data.isActive || false}
          onCheckedChange={(isActive) => onChange({ ...data, isActive })}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
