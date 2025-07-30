import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Building2,
  MessageSquare,
  Paperclip,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Shield,
  CheckCircle,
  Clock,
  Download,
  AlertTriangle,
  FileText,
  Image,
  Package,
  Star,
  Flag,
  Archive
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  messageType: "text" | "file" | "quote" | "order";
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    company: string;
    role: "importer" | "exporter";
    verified: boolean;
    rating: number;
    responseTime: string;
    lastSeen: string;
  };
  lastMessage: Message;
  unreadCount: number;
  isBlocked: boolean;
  isArchived: boolean;
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("conv-1");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(true);

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: "conv-1",
      participant: {
        id: "trader-001",
        name: "Rajesh Kumar",
        company: "Global Cotton Co.",
        role: "exporter",
        verified: true,
        rating: 4.8,
        responseTime: "< 2 hours",
        lastSeen: "Online"
      },
      lastMessage: {
        id: "msg-001",
        senderId: "trader-001",
        receiverId: "current-user",
        content: "I can provide the premium cotton samples by tomorrow. The MOQ is 1000kg as discussed.",
        timestamp: "2024-01-15T14:30:00Z",
        messageType: "text",
        status: "read",
        attachments: [
          {
            name: "cotton-samples-specs.pdf",
            type: "pdf",
            size: "2.3 MB",
            url: "#"
          }
        ]
      },
      unreadCount: 2,
      isBlocked: false,
      isArchived: false
    },
    {
      id: "conv-2",
      participant: {
        id: "trader-002",
        name: "Sarah Chen",
        company: "Spice Trading Inc.",
        role: "exporter",
        verified: true,
        rating: 4.9,
        responseTime: "< 1 hour",
        lastSeen: "2 hours ago"
      },
      lastMessage: {
        id: "msg-002",
        senderId: "current-user",
        receiverId: "trader-002",
        content: "Could you please share the quality certificates for the cardamom shipment?",
        timestamp: "2024-01-15T12:15:00Z",
        messageType: "text",
        status: "delivered"
      },
      unreadCount: 0,
      isBlocked: false,
      isArchived: false
    },
    {
      id: "conv-3",
      participant: {
        id: "trader-003",
        name: "Ahmed Hassan",
        company: "Textile Exports Ltd.",
        role: "exporter",
        verified: true,
        rating: 4.6,
        responseTime: "< 4 hours",
        lastSeen: "1 day ago"
      },
      lastMessage: {
        id: "msg-003",
        senderId: "trader-003",
        receiverId: "current-user",
        content: "The silk shipment has been dispatched. Tracking number: TRK123456789",
        timestamp: "2024-01-14T16:45:00Z",
        messageType: "text",
        status: "read"
      },
      unreadCount: 0,
      isBlocked: false,
      isArchived: false
    }
  ];

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: "msg-100",
      senderId: "current-user",
      receiverId: "trader-001",
      content: "Hi, I'm interested in your premium cotton. Could you share more details about quality and pricing?",
      timestamp: "2024-01-15T10:00:00Z",
      messageType: "text",
      status: "read"
    },
    {
      id: "msg-101",
      senderId: "trader-001",
      receiverId: "current-user",
      content: "Hello! Thank you for your interest. We have premium Grade A cotton available. The current price is $2.50 per kg with MOQ of 1000kg.",
      timestamp: "2024-01-15T10:15:00Z",
      messageType: "text",
      status: "read"
    },
    {
      id: "msg-102",
      senderId: "trader-001",
      receiverId: "current-user",
      content: "I'm attaching our quality certificates and sample specifications for your review.",
      timestamp: "2024-01-15T10:16:00Z",
      messageType: "file",
      status: "read",
      attachments: [
        {
          name: "quality-certificate-2024.pdf",
          type: "pdf",
          size: "1.2 MB",
          url: "#"
        },
        {
          name: "cotton-specifications.pdf",
          type: "pdf",
          size: "890 KB",
          url: "#"
        }
      ]
    },
    {
      id: "msg-103",
      senderId: "current-user",
      receiverId: "trader-001",
      content: "Great! The quality looks good. Can you provide samples for physical inspection? Also, what are your payment terms?",
      timestamp: "2024-01-15T11:30:00Z",
      messageType: "text",
      status: "read"
    },
    {
      id: "msg-104",
      senderId: "trader-001",
      receiverId: "current-user",
      content: "I can provide the premium cotton samples by tomorrow. The MOQ is 1000kg as discussed. Payment terms: 10% advance, 50% on inspection, balance on delivery.",
      timestamp: "2024-01-15T14:30:00Z",
      messageType: "text",
      status: "read",
      attachments: [
        {
          name: "cotton-samples-specs.pdf",
          type: "pdf",
          size: "2.3 MB",
          url: "#"
        }
      ]
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message sending logic here
      setNewMessage("");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCircle className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
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
              <MessageSquare className="h-3 w-3 mr-1" />
              Secure Messages
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Privacy Alert */}
        {showPrivacyAlert && (
          <div className="notification-banner notification-info mb-6 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Secure Communication Guidelines</span>
                <span className="text-sm opacity-90">
                  - Never share personal financial details outside platform payments
                  - Report suspicious behavior immediately 
                  - All conversations are monitored for compliance
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrivacyAlert(false)}
                className="text-primary-foreground hover:bg-primary/20"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <div className="flex h-[calc(100vh-200px)] gap-4">
          {/* Conversations List */}
          <div className="w-1/3 card-corporate overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Messages</h2>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-corporate pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto">
              {conversations
                .filter(conv => 
                  conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  conv.participant.company.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 corporate-transition ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage />
                        <AvatarFallback>
                          {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.lastSeen === "Online" && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-foreground truncate">
                            {conversation.participant.name}
                          </h3>
                          {conversation.participant.verified && (
                            <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-1 truncate">
                        {conversation.participant.company}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {conversation.lastMessage.content}
                        </p>
                        <div className="flex items-center space-x-1 ml-2">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-muted-foreground">
                            {conversation.participant.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 card-corporate flex flex-col">
            {selectedConv ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarContent>
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                        </AvatarContent>
                        <AvatarFallback>
                          {selectedConv.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-foreground">
                            {selectedConv.participant.name}
                          </h3>
                          {selectedConv.participant.verified && (
                            <Badge className="trust-badge trust-badge-verified text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {selectedConv.participant.role}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{selectedConv.participant.company}</span>
                          <span>Response: {selectedConv.participant.responseTime}</span>
                          <span>{selectedConv.participant.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === "current-user";
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`p-3 ${
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center space-x-2 p-2 rounded ${
                                      isOwnMessage ? 'bg-primary-foreground/10' : 'bg-background'
                                    }`}
                                  >
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">
                                        {attachment.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {attachment.size}
                                      </p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center space-x-1 mt-1 ${
                            isOwnMessage ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwnMessage && getMessageStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="input-corporate resize-none"
                        rows={1}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="btn-corporate"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>Press Enter to send, Shift+Enter for new line</span>
                      <span className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>End-to-end encrypted</span>
                      </span>
                    </div>
                    <span>{newMessage.length}/2000</span>
                  </div>
                </div>
              </>
            ) : (
              /* No Conversation Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
