import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building2,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  FileText,
  MessageSquare,
  CreditCard,
  Eye,
  Download,
  Phone,
  Mail
} from "lucide-react";

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  // Mock order data with escrow payment tracking
  const orders = [
    {
      id: "ORD-2024-001",
      material: "Premium Cotton",
      quantity: "5000 kg",
      unitPrice: "$2.50",
      totalAmount: "$12,500",
      buyer: "Fashion Corp Ltd.",
      seller: "Global Cotton Co.",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-02-15",
      status: "Payment Step 2",
      paymentSteps: {
        advance: { amount: "$1,250", status: "completed", date: "2024-01-15" },
        inspection: { amount: "$6,250", status: "pending", date: null },
        delivery: { amount: "$5,000", status: "pending", date: null }
      },
      shipmentStatus: "Dispatched",
      trackingNumber: "TRK123456789",
      documents: ["Invoice", "Packing List", "Quality Certificate"],
      timeline: [
        { event: "Order Placed", date: "2024-01-15", status: "completed" },
        { event: "10% Advance Paid", date: "2024-01-15", status: "completed" },
        { event: "Goods Dispatched", date: "2024-01-20", status: "completed" },
        { event: "Inspection Due", date: "2024-01-25", status: "pending" },
        { event: "50% Payment Due", date: "2024-01-25", status: "pending" },
        { event: "Delivery Expected", date: "2024-02-15", status: "pending" }
      ]
    },
    {
      id: "ORD-2024-002",
      material: "Mulberry Silk",
      quantity: "500 kg",
      unitPrice: "$45.00",
      totalAmount: "$22,500",
      buyer: "Luxury Textiles Inc.",
      seller: "Silk Masters Ltd.",
      orderDate: "2024-01-10",
      expectedDelivery: "2024-02-10",
      status: "Payment Step 3",
      paymentSteps: {
        advance: { amount: "$2,250", status: "completed", date: "2024-01-10" },
        inspection: { amount: "$11,250", status: "completed", date: "2024-01-18" },
        delivery: { amount: "$9,000", status: "pending", date: null }
      },
      shipmentStatus: "In Transit",
      trackingNumber: "TRK987654321",
      documents: ["Invoice", "Quality Certificate", "Origin Certificate"],
      timeline: [
        { event: "Order Placed", date: "2024-01-10", status: "completed" },
        { event: "10% Advance Paid", date: "2024-01-10", status: "completed" },
        { event: "Goods Dispatched", date: "2024-01-15", status: "completed" },
        { event: "Inspection Completed", date: "2024-01-18", status: "completed" },
        { event: "50% Payment Made", date: "2024-01-18", status: "completed" },
        { event: "Delivery in Progress", date: "2024-02-08", status: "in-progress" }
      ]
    },
    {
      id: "ORD-2024-003",
      material: "Cardamom Premium",
      quantity: "200 kg",
      unitPrice: "$85.00",
      totalAmount: "$17,000",
      buyer: "Spice Trading Co.",
      seller: "Kerala Spices Ltd.",
      orderDate: "2024-01-05",
      expectedDelivery: "2024-01-30",
      status: "Completed",
      paymentSteps: {
        advance: { amount: "$1,700", status: "completed", date: "2024-01-05" },
        inspection: { amount: "$8,500", status: "completed", date: "2024-01-12" },
        delivery: { amount: "$6,800", status: "completed", date: "2024-01-30" }
      },
      shipmentStatus: "Delivered",
      trackingNumber: "TRK456789123",
      documents: ["Invoice", "Delivery Receipt", "Quality Certificate"],
      timeline: [
        { event: "Order Placed", date: "2024-01-05", status: "completed" },
        { event: "10% Advance Paid", date: "2024-01-05", status: "completed" },
        { event: "Goods Dispatched", date: "2024-01-08", status: "completed" },
        { event: "Inspection Completed", date: "2024-01-12", status: "completed" },
        { event: "50% Payment Made", date: "2024-01-12", status: "completed" },
        { event: "Delivered", date: "2024-01-30", status: "completed" },
        { event: "Final Payment", date: "2024-01-30", status: "completed" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "status-success";
      case "Payment Step 2": return "status-warning";
      case "Payment Step 3": return "status-info";
      default: return "status-info";
    }
  };

  const getPaymentStepStatus = (step: any) => {
    if (step.status === "completed") return "text-success";
    if (step.status === "pending") return "text-muted-foreground";
    return "text-muted-foreground";
  };

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
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">TradeBridge</span>
              </div>
            </div>
            <Badge variant="secondary" className="trust-badge trust-badge-verified">
              <Package className="h-3 w-3 mr-1" />
              Order Management
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Order Management</h1>
          <p className="text-muted-foreground">Track your orders and manage escrow payments securely</p>
        </div>

        {/* Orders Overview Stats */}
        <div className="grid-corporate-4 mb-8">
          <div className="card-corporate p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-2xl font-semibold text-foreground">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="card-corporate p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">In Progress</p>
                <p className="text-2xl font-semibold text-foreground">
                  {orders.filter(o => o.status !== "Completed").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </div>
          <div className="card-corporate p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Value</p>
                <p className="text-2xl font-semibold text-foreground">$52,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </div>
          <div className="card-corporate p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Success Rate</p>
                <p className="text-2xl font-semibold text-foreground">100%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">All Orders</TabsTrigger>
            <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="card-corporate">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-medium text-foreground">{order.id}</h3>
                          <Badge className={`trust-badge ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {order.material} • {order.quantity} • {order.unitPrice} per kg
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Total Amount</p>
                            <p className="font-semibold text-foreground text-lg">{order.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Seller</p>
                            <p className="font-medium text-foreground">{order.seller}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Order Date</p>
                            <p className="font-medium text-foreground">{order.orderDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expected Delivery</p>
                            <p className="font-medium text-foreground">{order.expectedDelivery}</p>
                          </div>
                        </div>

                        {/* Payment Progress */}
                        <div className="bg-muted p-4 mb-4">
                          <h4 className="font-medium text-foreground mb-3">Escrow Payment Progress</h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className={`text-center ${getPaymentStepStatus(order.paymentSteps.advance)}`}>
                              <div className="flex items-center justify-center mb-1">
                                {order.paymentSteps.advance.status === "completed" ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                              <p className="font-medium">10% Advance</p>
                              <p className="text-xs">{order.paymentSteps.advance.amount}</p>
                              {order.paymentSteps.advance.date && (
                                <p className="text-xs">{order.paymentSteps.advance.date}</p>
                              )}
                            </div>
                            <div className={`text-center ${getPaymentStepStatus(order.paymentSteps.inspection)}`}>
                              <div className="flex items-center justify-center mb-1">
                                {order.paymentSteps.inspection.status === "completed" ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                              <p className="font-medium">50% On Inspection</p>
                              <p className="text-xs">{order.paymentSteps.inspection.amount}</p>
                              {order.paymentSteps.inspection.date && (
                                <p className="text-xs">{order.paymentSteps.inspection.date}</p>
                              )}
                            </div>
                            <div className={`text-center ${getPaymentStepStatus(order.paymentSteps.delivery)}`}>
                              <div className="flex items-center justify-center mb-1">
                                {order.paymentSteps.delivery.status === "completed" ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                              <p className="font-medium">Balance On Delivery</p>
                              <p className="text-xs">{order.paymentSteps.delivery.amount}</p>
                              {order.paymentSteps.delivery.date && (
                                <p className="text-xs">{order.paymentSteps.delivery.date}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Shipment Tracking */}
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium text-foreground">{order.shipmentStatus}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Tracking:</span>
                            <span className="font-medium text-foreground">{order.trackingNumber}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="btn-secondary-corporate"
                          onClick={() => setSelectedOrder(selectedOrder === parseInt(order.id.split('-')[2]) ? null : parseInt(order.id.split('-')[2]))}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="btn-secondary-corporate">
                          <Download className="h-4 w-4 mr-1" />
                          Documents
                        </Button>
                        <Button variant="outline" size="sm" className="btn-secondary-corporate">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact Seller
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {selectedOrder === parseInt(order.id.split('-')[2]) && (
                      <div className="border-t border-border pt-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-foreground mb-3">Order Timeline</h4>
                            <div className="space-y-3">
                              {order.timeline.map((event, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  {event.status === "completed" ? (
                                    <CheckCircle className="h-4 w-4 text-success" />
                                  ) : event.status === "in-progress" ? (
                                    <Clock className="h-4 w-4 text-warning" />
                                  ) : (
                                    <div className="h-4 w-4 border border-muted-foreground rounded-full" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{event.event}</p>
                                    <p className="text-xs text-muted-foreground">{event.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-foreground mb-3">Seller Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">{order.seller}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">contact@{order.seller.toLowerCase().replace(/\s+/g, '')}.com</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">+91 98765 43210</span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <h4 className="font-medium text-foreground mb-3">Available Documents</h4>
                              <div className="space-y-2">
                                {order.documents.map((doc, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-foreground">{doc}</span>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              <Card className="card-corporate">
                <CardHeader>
                  <CardTitle>Payment Security Information</CardTitle>
                  <p className="text-muted-foreground">
                    Our 3-step escrow system protects both buyers and sellers throughout the transaction
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-foreground mb-2">Step 1: Advance Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        10% advance payment secures the order and initiates production/dispatch
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Eye className="h-6 w-6 text-warning" />
                      </div>
                      <h3 className="font-medium text-foreground mb-2">Step 2: Inspection Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        50% payment after quality inspection and shipment confirmation
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-6 w-6 text-success" />
                      </div>
                      <h3 className="font-medium text-foreground mb-2">Step 3: Final Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Remaining balance paid upon confirmed delivery and acceptance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-corporate">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-semibold text-success mb-1">$5,200</div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                  </CardContent>
                </Card>
                <Card className="card-corporate">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-semibold text-warning mb-1">$6,250</div>
                    <p className="text-sm text-muted-foreground">Pending Payments</p>
                  </CardContent>
                </Card>
                <Card className="card-corporate">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-semibold text-primary mb-1">$40,550</div>
                    <p className="text-sm text-muted-foreground">In Escrow</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
