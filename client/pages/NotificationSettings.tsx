import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Package,
  CreditCard,
  Truck,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Settings,
  Volume2,
  VolumeX,
  Zap,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ContextualTooltip } from "@/components/ContextualTooltip";
import { cn } from "@/lib/utils";

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  settings: NotificationSetting[];
}

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency: "instant" | "daily" | "weekly" | "never";
  priority: "low" | "medium" | "high" | "critical";
}

const defaultNotificationSettings: NotificationCategory[] = [
  {
    id: "orders",
    name: "Orders & Transactions",
    description: "Updates about your orders, payments, and shipments",
    icon: <Package className="h-5 w-5" />,
    settings: [
      {
        id: "order_placed",
        name: "Order Placed",
        description:
          "When you place a new order or receive an order (for exporters)",
        channels: { email: true, sms: true, push: true, inApp: true },
        frequency: "instant",
        priority: "high",
      },
      {
        id: "order_confirmed",
        name: "Order Confirmed",
        description: "When your order is confirmed by the seller",
        channels: { email: true, sms: false, push: true, inApp: true },
        frequency: "instant",
        priority: "high",
      },
      {
        id: "payment_due",
        name: "Payment Due",
        description: "Reminders for upcoming payment milestones",
        channels: { email: true, sms: true, push: true, inApp: true },
        frequency: "instant",
        priority: "critical",
      },
      {
        id: "payment_received",
        name: "Payment Received",
        description: "When payments are processed successfully",
        channels: { email: true, sms: false, push: true, inApp: true },
        frequency: "instant",
        priority: "high",
      },
      {
        id: "order_shipped",
        name: "Order Shipped",
        description: "When your order is shipped with tracking information",
        channels: { email: true, sms: true, push: true, inApp: true },
        frequency: "instant",
        priority: "high",
      },
      {
        id: "order_delivered",
        name: "Order Delivered",
        description: "When your order is successfully delivered",
        channels: { email: true, sms: true, push: true, inApp: true },
        frequency: "instant",
        priority: "high",
      },
    ],
  },
  {
    id: "communication",
    name: "Messages & Communication",
    description: "Direct messages, inquiries, and communication updates",
    icon: <MessageSquare className="h-5 w-5" />,
    settings: [
      {
        id: "new_message",
        name: "New Messages",
        description: "When you receive a new message from buyers/sellers",
        channels: { email: true, sms: false, push: true, inApp: true },
        frequency: "instant",
        priority: "medium",
      },
      {
        id: "inquiry_received",
        name: "Product Inquiries",
        description: "When someone inquires about your products (exporters)",
        channels: { email: true, sms: false, push: true, inApp: true },
        frequency: "instant",
        priority: "medium",
      },
      {
        id: "quote_request",
        name: "Quote Requests",
        description: "When you receive requests for product quotes",
        channels: { email: true, sms: false, push: false, inApp: true },
        frequency: "instant",
        priority: "medium",
      },
    ],
  },
  {
    id: "compliance",
    name: "Compliance & Documents",
    description:
      "Document verification, compliance alerts, and regulatory updates",
    icon: <FileText className="h-5 w-5" />,
    settings: [
      {
        id: "document_verified",
        name: "Document Verification",
        description: "When your documents are verified or rejected",
        channels: { email: true, sms: false, push: true, inApp: true },
        frequency: "instant",
        priority: "high",
      },
      {
        id: "compliance_alert",
        name: "Compliance Alerts",
        description: "Important compliance and regulatory updates",
        channels: { email: true, sms: true, push: true, inApp: true },
        frequency: "instant",
        priority: "critical",
      },
      {
        id: "document_expiry",
        name: "Document Expiry",
        description: "Reminders when licenses or certificates are expiring",
        channels: { email: true, sms: false, push: true, inApp: true },
        frequency: "weekly",
        priority: "medium",
      },
    ],
  },
  {
    id: "account",
    name: "Account & Security",
    description: "Account changes, security alerts, and verification updates",
    icon: <Settings className="h-5 w-5" />,
    settings: [
      {
        id: "login_alert",
        name: "Login Alerts",
        description: "When someone logs into your account from a new device",
        channels: { email: true, sms: true, push: false, inApp: false },
        frequency: "instant",
        priority: "critical",
      },
      {
        id: "profile_changes",
        name: "Profile Changes",
        description: "When important profile information is updated",
        channels: { email: true, sms: false, push: false, inApp: true },
        frequency: "instant",
        priority: "medium",
      },
      {
        id: "verification_status",
        name: "Verification Status",
        description: "Updates about your account verification status",
        channels: { email: true, sms: true, push: true, inApp: true },
        frequency: "instant",
        priority: "high",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing & Updates",
    description:
      "Product recommendations, platform updates, and promotional content",
    icon: <Star className="h-5 w-5" />,
    settings: [
      {
        id: "product_recommendations",
        name: "Product Recommendations",
        description: "Personalized product suggestions based on your interests",
        channels: { email: true, sms: false, push: false, inApp: true },
        frequency: "weekly",
        priority: "low",
      },
      {
        id: "platform_updates",
        name: "Platform Updates",
        description: "New features, improvements, and platform announcements",
        channels: { email: true, sms: false, push: false, inApp: true },
        frequency: "weekly",
        priority: "low",
      },
      {
        id: "promotional_offers",
        name: "Promotional Offers",
        description: "Special offers, discounts, and promotional campaigns",
        channels: { email: true, sms: false, push: false, inApp: false },
        frequency: "weekly",
        priority: "low",
      },
      {
        id: "newsletter",
        name: "Newsletter",
        description: "Weekly newsletter with industry insights and trends",
        channels: { email: true, sms: false, push: false, inApp: false },
        frequency: "weekly",
        priority: "low",
      },
    ],
  },
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState(defaultNotificationSettings);
  const [activeTab, setActiveTab] = useState("orders");
  const [globalSettings, setGlobalSettings] = useState({
    enableNotifications: true,
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    timezone: "UTC",
    language: "en",
  });

  const updateChannelSetting = (
    categoryId: string,
    settingId: string,
    channel: keyof NotificationSetting["channels"],
    enabled: boolean,
  ) => {
    setSettings((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              settings: category.settings.map((setting) =>
                setting.id === settingId
                  ? {
                      ...setting,
                      channels: { ...setting.channels, [channel]: enabled },
                    }
                  : setting,
              ),
            }
          : category,
      ),
    );
  };

  const updateFrequency = (
    categoryId: string,
    settingId: string,
    frequency: NotificationSetting["frequency"],
  ) => {
    setSettings((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              settings: category.settings.map((setting) =>
                setting.id === settingId ? { ...setting, frequency } : setting,
              ),
            }
          : category,
      ),
    );
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
      case "inApp":
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "high":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "medium":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "low":
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const currentCategory = settings.find((cat) => cat.id === activeTab);

  const handleSaveSettings = async () => {
    // Here you would save to your backend
    console.log("Saving notification settings:", { settings, globalSettings });
    // Show success message
  };

  const resetToDefaults = () => {
    setSettings(defaultNotificationSettings);
    setGlobalSettings({
      enableNotifications: true,
      quietHoursEnabled: true,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
      timezone: "UTC",
      language: "en",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6" />
              <div>
                <h1 className="text-2xl font-bold">Notification Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Customize how and when you receive notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {settings.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors",
                        activeTab === category.id &&
                          "bg-muted border-r-2 border-primary",
                      )}
                    >
                      <div className="text-muted-foreground">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {category.settings.length} settings
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Global Settings */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Global Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Enable Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Master toggle for all notifications
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.enableNotifications}
                    onCheckedChange={(checked) =>
                      setGlobalSettings((prev) => ({
                        ...prev,
                        enableNotifications: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Quiet Hours</Label>
                      <p className="text-xs text-muted-foreground">
                        No notifications during these hours
                      </p>
                    </div>
                    <Switch
                      checked={globalSettings.quietHoursEnabled}
                      onCheckedChange={(checked) =>
                        setGlobalSettings((prev) => ({
                          ...prev,
                          quietHoursEnabled: checked,
                        }))
                      }
                    />
                  </div>

                  {globalSettings.quietHoursEnabled && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">From</Label>
                        <Select
                          value={globalSettings.quietHoursStart}
                          onValueChange={(value) =>
                            setGlobalSettings((prev) => ({
                              ...prev,
                              quietHoursStart: value,
                            }))
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return (
                                <SelectItem key={hour} value={`${hour}:00`}>
                                  {hour}:00
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">To</Label>
                        <Select
                          value={globalSettings.quietHoursEnd}
                          onValueChange={(value) =>
                            setGlobalSettings((prev) => ({
                              ...prev,
                              quietHoursEnd: value,
                            }))
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return (
                                <SelectItem key={hour} value={`${hour}:00`}>
                                  {hour}:00
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentCategory && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{currentCategory.icon}</div>
                    <div>
                      <CardTitle className="text-xl">
                        {currentCategory.name}
                      </CardTitle>
                      <CardDescription>
                        {currentCategory.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentCategory.settings.map((setting) => (
                      <div key={setting.id} className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{setting.name}</h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  getPriorityColor(setting.priority),
                                )}
                              >
                                {setting.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {setting.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Select
                              value={setting.frequency}
                              onValueChange={(value) =>
                                updateFrequency(
                                  currentCategory.id,
                                  setting.id,
                                  value as NotificationSetting["frequency"],
                                )
                              }
                            >
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instant">
                                  <div className="flex items-center gap-2">
                                    <Zap className="h-3 w-3" />
                                    Instant
                                  </div>
                                </SelectItem>
                                <SelectItem value="daily">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    Daily
                                  </div>
                                </SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="never">
                                  <div className="flex items-center gap-2">
                                    <VolumeX className="h-3 w-3" />
                                    Never
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Channel Toggles */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(setting.channels).map(
                            ([channel, enabled]) => (
                              <div
                                key={channel}
                                className="flex items-center space-x-2"
                              >
                                <Switch
                                  id={`${setting.id}-${channel}`}
                                  checked={
                                    enabled && setting.frequency !== "never"
                                  }
                                  onCheckedChange={(checked) =>
                                    updateChannelSetting(
                                      currentCategory.id,
                                      setting.id,
                                      channel as keyof NotificationSetting["channels"],
                                      checked,
                                    )
                                  }
                                  disabled={setting.frequency === "never"}
                                />
                                <Label
                                  htmlFor={`${setting.id}-${channel}`}
                                  className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                  {getChannelIcon(channel)}
                                  <span className="capitalize">
                                    {channel === "inApp" ? "In-App" : channel}
                                  </span>
                                </Label>
                              </div>
                            ),
                          )}
                        </div>

                        <Separator />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline">Preview Notifications</Button>
                <Button onClick={handleSaveSettings}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
