import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Building2,
  AlertTriangle,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Upload,
  Download,
  Phone,
  Mail,
  Calendar,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Shield,
  Gavel,
  Users,
  Camera,
  Paperclip,
} from "lucide-react";

interface Dispute {
  id: string;
  orderId: string;
  orderAmount: string;
  material: string;
  disputeType: string;
  status: "open" | "in-review" | "mediation" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdDate: string;
  lastUpdate: string;
  complainant: {
    name: string;
    role: "importer" | "exporter";
    company: string;
  };
  respondent: {
    name: string;
    role: "importer" | "exporter";
    company: string;
  };
  description: string;
  timeline: {
    date: string;
    event: string;
    actor: string;
    status: "completed" | "pending";
  }[];
  messages: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    attachments?: {
      name: string;
      type: string;
      size: string;
    }[];
  }[];
  moderator?: {
    name: string;
    id: string;
    assignedDate: string;
  };
}

interface Review {
  id: string;
  orderId: string;
  reviewer: {
    name: string;
    role: "importer" | "exporter";
    company: string;
    verified: boolean;
  };
  reviewee: {
    name: string;
    role: "importer" | "exporter";
    company: string;
  };
  material: string;
  orderAmount: string;
  rating: number;
  review: string;
  date: string;
  helpful: number;
  categories: {
    quality: number;
    communication: number;
    delivery: number;
    professionalism: number;
  };
  verified: boolean;
}

export default function DisputeResolution() {
  const [activeTab, setActiveTab] = useState("disputes");
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newReview, setNewReview] = useState({
    orderId: "",
    rating: 0,
    review: "",
    categories: {
      quality: 0,
      communication: 0,
      delivery: 0,
      professionalism: 0,
    },
  });

  // Mock disputes data
  const disputes: Dispute[] = [
    {
      id: "DSP-001",
      orderId: "ORD-2024-001",
      orderAmount: "$12,500",
      material: "Premium Cotton",
      disputeType: "Quality Issue",
      status: "in-review",
      priority: "high",
      createdDate: "2024-01-20",
      lastUpdate: "2024-01-22",
      complainant: {
        name: "John Smith",
        role: "importer",
        company: "Fashion Corp Ltd.",
      },
      respondent: {
        name: "Rajesh Kumar",
        role: "exporter",
        company: "Global Cotton Co.",
      },
      description:
        "The cotton received does not match the quality specifications agreed upon. The fiber length is significantly shorter than promised, affecting our production quality.",
      timeline: [
        {
          date: "2024-01-20",
          event: "Dispute raised",
          actor: "John Smith",
          status: "completed",
        },
        {
          date: "2024-01-20",
          event: "Notification sent to respondent",
          actor: "System",
          status: "completed",
        },
        {
          date: "2024-01-21",
          event: "Respondent acknowledged",
          actor: "Rajesh Kumar",
          status: "completed",
        },
        {
          date: "2024-01-22",
          event: "Evidence submitted",
          actor: "John Smith",
          status: "completed",
        },
        {
          date: "2024-01-22",
          event: "Moderator assigned",
          actor: "System",
          status: "completed",
        },
        {
          date: "2024-01-23",
          event: "Mediation scheduled",
          actor: "Sarah Johnson",
          status: "pending",
        },
      ],
      messages: [
        {
          id: "msg-1",
          sender: "John Smith",
          content:
            "The cotton quality is not as per specifications. I have photographic evidence and lab test results.",
          timestamp: "2024-01-20T10:00:00Z",
          attachments: [
            { name: "lab-test-results.pdf", type: "PDF", size: "2.3 MB" },
            { name: "quality-photos.zip", type: "ZIP", size: "15.7 MB" },
          ],
        },
        {
          id: "msg-2",
          sender: "Rajesh Kumar",
          content:
            "I understand your concern. Let me review our quality control records and provide evidence of our testing.",
          timestamp: "2024-01-21T14:30:00Z",
        },
        {
          id: "msg-3",
          sender: "Sarah Johnson (Moderator)",
          content:
            "I have been assigned to this case. I've reviewed the evidence from both parties. Let's schedule a mediation call for tomorrow at 3 PM UTC.",
          timestamp: "2024-01-22T16:00:00Z",
        },
      ],
      moderator: {
        name: "Sarah Johnson",
        id: "MOD-005",
        assignedDate: "2024-01-22",
      },
    },
  ];

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: "REV-001",
      orderId: "ORD-2024-003",
      reviewer: {
        name: "Alice Chen",
        role: "importer",
        company: "Textile Innovations Inc.",
        verified: true,
      },
      reviewee: {
        name: "Mohammed Hassan",
        role: "exporter",
        company: "Spice Trading Co.",
      },
      material: "Premium Cardamom",
      orderAmount: "$17,000",
      rating: 5,
      review:
        "Excellent quality cardamom, delivered on time with all certifications. Mohammed was very responsive throughout the process and provided regular updates. Highly recommended!",
      date: "2024-01-15",
      helpful: 8,
      categories: {
        quality: 5,
        communication: 5,
        delivery: 5,
        professionalism: 5,
      },
      verified: true,
    },
    {
      id: "REV-002",
      orderId: "ORD-2024-002",
      reviewer: {
        name: "David Wilson",
        role: "importer",
        company: "Global Textiles Ltd.",
        verified: true,
      },
      reviewee: {
        name: "Priya Sharma",
        role: "exporter",
        company: "Silk Masters Ltd.",
      },
      material: "Mulberry Silk",
      orderAmount: "$22,500",
      rating: 4,
      review:
        "Good quality silk, though delivery was slightly delayed. Communication could have been better during the shipping phase. Overall satisfied with the transaction.",
      date: "2024-01-12",
      helpful: 5,
      categories: {
        quality: 4,
        communication: 3,
        delivery: 3,
        professionalism: 4,
      },
      verified: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-review":
        return "bg-yellow-100 text-yellow-800";
      case "mediation":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} ${
              star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="corporate-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="corporate-transition"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  TradeBridge
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="trust-badge">
              <Shield className="h-3 w-3 mr-1" />
              Dispute Resolution & Reviews
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Support Center
          </h1>
          <p className="text-muted-foreground">
            Manage disputes, view reviews, and get assistance
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="disputes">Active Disputes</TabsTrigger>
            <TabsTrigger value="create-dispute">Report Issue</TabsTrigger>
            <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
            <TabsTrigger value="help">Help Center</TabsTrigger>
          </TabsList>

          {/* Active Disputes */}
          <TabsContent value="disputes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Disputes List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Your Disputes
                </h3>
                {disputes.map((dispute) => (
                  <Card
                    key={dispute.id}
                    className={`card-corporate cursor-pointer ${
                      selectedDispute === dispute.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedDispute(dispute.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span className="font-medium">{dispute.id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(dispute.status)}>
                            {dispute.status.replace("-", " ")}
                          </Badge>
                          <Badge className={getPriorityColor(dispute.priority)}>
                            {dispute.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">
                          {dispute.disputeType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Order: {dispute.orderId} • {dispute.material} •{" "}
                          {dispute.orderAmount}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {dispute.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created: {dispute.createdDate}</span>
                          <span>Updated: {dispute.lastUpdate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Dispute Details */}
              <div>
                {selectedDispute ? (
                  <Card className="card-corporate">
                    <CardHeader>
                      <CardTitle>Dispute Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(() => {
                        const dispute = disputes.find(
                          (d) => d.id === selectedDispute,
                        )!;
                        return (
                          <>
                            {/* Dispute Info */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">
                                  {dispute.disputeType}
                                </h4>
                                <Badge
                                  className={getStatusColor(dispute.status)}
                                >
                                  {dispute.status.replace("-", " ")}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {dispute.description}
                              </p>
                            </div>

                            {/* Parties */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-foreground mb-1">
                                  Complainant
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {dispute.complainant.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {dispute.complainant.company}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground mb-1">
                                  Respondent
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {dispute.respondent.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {dispute.respondent.company}
                                </p>
                              </div>
                            </div>

                            {/* Moderator */}
                            {dispute.moderator && (
                              <div className="bg-muted p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Gavel className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">
                                    Assigned Moderator
                                  </span>
                                </div>
                                <p className="text-sm text-foreground">
                                  {dispute.moderator.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Assigned: {dispute.moderator.assignedDate}
                                </p>
                              </div>
                            )}

                            {/* Timeline */}
                            <div>
                              <h5 className="font-medium text-foreground mb-3">
                                Timeline
                              </h5>
                              <div className="space-y-3">
                                {dispute.timeline.map((event, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-3"
                                  >
                                    {event.status === "completed" ? (
                                      <CheckCircle className="h-4 w-4 text-success" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-warning" />
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        {event.event}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {event.actor} • {event.date}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Messages */}
                            <div>
                              <h5 className="font-medium text-foreground mb-3">
                                Communication
                              </h5>
                              <div className="space-y-3 max-h-64 overflow-y-auto">
                                {dispute.messages.map((message) => (
                                  <div
                                    key={message.id}
                                    className="bg-muted p-3"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium">
                                        {message.sender}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(
                                          message.timestamp,
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {message.content}
                                    </p>
                                    {message.attachments &&
                                      message.attachments.length > 0 && (
                                        <div className="space-y-1">
                                          {message.attachments.map(
                                            (attachment, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center space-x-2 text-xs"
                                              >
                                                <Paperclip className="h-3 w-3" />
                                                <span>
                                                  {attachment.name} (
                                                  {attachment.size})
                                                </span>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                >
                                                  <Download className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Message Input */}
                            <div className="space-y-3">
                              <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Add a message to this dispute..."
                                className="input-corporate"
                                rows={3}
                              />
                              <div className="flex items-center justify-between">
                                <Button variant="outline" size="sm">
                                  <Upload className="h-4 w-4 mr-1" />
                                  Attach File
                                </Button>
                                <Button className="btn-corporate">
                                  Send Message
                                </Button>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="card-corporate">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Select a Dispute
                      </h3>
                      <p className="text-muted-foreground">
                        Choose a dispute from the list to view details and
                        communicate
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Create Dispute */}
          <TabsContent value="create-dispute">
            <Card className="card-corporate max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Report an Issue</CardTitle>
                <p className="text-muted-foreground">
                  Describe your issue and we'll help resolve it quickly
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="form-group">
                  <Label className="form-label">Order ID *</Label>
                  <Select>
                    <SelectTrigger className="input-corporate">
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORD-2024-001">
                        ORD-2024-001 - Premium Cotton
                      </SelectItem>
                      <SelectItem value="ORD-2024-002">
                        ORD-2024-002 - Mulberry Silk
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label className="form-label">Issue Type *</Label>
                  <Select>
                    <SelectTrigger className="input-corporate">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quality">Quality Issue</SelectItem>
                      <SelectItem value="delivery">Delivery Problem</SelectItem>
                      <SelectItem value="payment">Payment Issue</SelectItem>
                      <SelectItem value="communication">
                        Communication Problem
                      </SelectItem>
                      <SelectItem value="documentation">
                        Documentation Issue
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label className="form-label">Priority</Label>
                  <Select>
                    <SelectTrigger className="input-corporate">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor issue</SelectItem>
                      <SelectItem value="medium">
                        Medium - Moderate impact
                      </SelectItem>
                      <SelectItem value="high">
                        High - Significant impact
                      </SelectItem>
                      <SelectItem value="urgent">
                        Urgent - Business critical
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label className="form-label">Description *</Label>
                  <Textarea
                    placeholder="Please provide detailed information about the issue..."
                    className="input-corporate"
                    rows={5}
                  />
                  <p className="form-help">
                    Include specific details, dates, and any relevant
                    information
                  </p>
                </div>

                <div className="form-group">
                  <Label className="form-label">Supporting Documents</Label>
                  <div className="border-2 border-dashed border-border p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload photos, documents, or other evidence
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG, ZIP (Max 25MB total)
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="btn-corporate w-full">
                    Submit Dispute Report
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    You will receive email confirmation and updates on the
                    dispute progress
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Reviews & Ratings
                </h3>
                <Button className="btn-corporate">
                  <Star className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="card-corporate">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">
                              {review.reviewer.name}
                            </span>
                            {review.reviewer.verified && (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.reviewer.company}
                          </p>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {review.date}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Order: {review.orderId} • {review.material} •{" "}
                            {review.orderAmount}
                          </p>
                          <p className="text-sm text-foreground">
                            {review.review}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Quality:</span>
                            {renderStars(review.categories.quality, "sm")}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Communication:</span>
                            {renderStars(review.categories.communication, "sm")}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Delivery:</span>
                            {renderStars(review.categories.delivery, "sm")}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Professionalism:</span>
                            {renderStars(
                              review.categories.professionalism,
                              "sm",
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Helpful ({review.helpful})
                            </Button>
                            {review.verified && (
                              <Badge
                                variant="outline"
                                className="trust-badge trust-badge-verified text-xs"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Help Center */}
          <TabsContent value="help">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-corporate">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Live Chat</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Get instant help from our support team
                  </p>
                  <Button className="btn-corporate w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="card-corporate">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Phone Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    24/7 Support Available
                  </p>
                  <p className="font-medium mb-4">+1 (555) 123-4567</p>
                  <Button
                    variant="outline"
                    className="btn-secondary-corporate w-full"
                  >
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-corporate">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Email Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Response within 4 hours
                  </p>
                  <p className="font-medium mb-4">support@tradebridge.com</p>
                  <Button
                    variant="outline"
                    className="btn-secondary-corporate w-full"
                  >
                    Send Email
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
