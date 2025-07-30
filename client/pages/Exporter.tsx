import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Upload,
  User,
  Building2,
  Package,
  Plus,
  Eye,
  Trash2,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
} from "lucide-react";

export default function Exporter() {
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "register" | "kyc" | "dashboard"
  >("welcome");
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verified" | "rejected"
  >("pending");

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    businessName: "",
    businessAddress: "",
    gstNumber: "",
    businessType: "",
  });

  // KYC Documents state
  const [kycDocuments, setKycDocuments] = useState({
    businessLicense: null as File | null,
    gstCertificate: null as File | null,
    bankStatement: null as File | null,
    identityProof: null as File | null,
  });

  // Material upload form state
  const [materialData, setMaterialData] = useState({
    type: "",
    quality: "",
    price: "",
    currency: "USD",
    location: "",
    moq: "",
    stockQuantity: "",
    description: "",
    certificates: [] as File[],
    images: [] as File[],
  });

  // Mock uploaded materials with enhanced data
  const [uploadedMaterials, setUploadedMaterials] = useState([
    {
      id: 1,
      type: "Cotton",
      quality: "Premium Grade A",
      price: "$2.50",
      unit: "per kg",
      moq: "1000 kg",
      stockQuantity: "25,000 kg",
      location: "Mumbai, India",
      status: "Active",
      inquiries: 15,
      views: 1250,
      lastUpdated: "2024-01-15",
      certificates: ["ISO 9001", "GOTS Certified"],
      images: 4,
    },
    {
      id: 2,
      type: "Cardamom",
      quality: "Premium Green",
      price: "$85.00",
      unit: "per kg",
      moq: "50 kg",
      stockQuantity: "2,000 kg",
      location: "Kerala, India",
      status: "Active",
      inquiries: 8,
      views: 890,
      lastUpdated: "2024-01-14",
      certificates: ["Organic Certified", "FSSAI"],
      images: 6,
    },
  ]);

  const materialTypes = [
    "Cotton",
    "Silk",
    "Polyester",
    "Wool",
    "Linen",
    "Nylon",
    "Jute",
    "Cardamom",
    "Pepper",
    "Turmeric",
    "Cashews",
  ];
  const currencies = ["USD", "EUR", "GBP", "INR", "CNY", "JPY"];
  const businessTypes = [
    "Manufacturer",
    "Trader",
    "Exporter",
    "Cooperative",
    "Farmer Producer Organization",
  ];

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("kyc");
  };

  const handleKYCSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationStatus("pending");
    setCurrentStep("dashboard");
  };

  const handleMaterialUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newMaterial = {
      id: uploadedMaterials.length + 1,
      type: materialData.type,
      quality: materialData.quality,
      price: `${materialData.currency} ${materialData.price}`,
      unit: "per kg",
      moq: materialData.moq,
      stockQuantity: materialData.stockQuantity,
      location: materialData.location,
      status: "Pending Review",
      inquiries: 0,
      views: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      certificates: materialData.certificates.map((f) => f.name),
      images: materialData.images.length,
    };
    setUploadedMaterials([...uploadedMaterials, newMaterial]);
    setMaterialData({
      type: "",
      quality: "",
      price: "",
      currency: "USD",
      location: "",
      moq: "",
      stockQuantity: "",
      description: "",
      certificates: [],
      images: [],
    });
  };

  // Welcome Screen
  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-background">
        <header className="corporate-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="corporate-transition"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  TradeBridge
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="card-corporate p-8">
              <div className="w-16 h-16 bg-primary flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Welcome, Exporter!
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Join our verified global marketplace and connect with importers
                worldwide. Complete KYC verification to ensure trust and secure
                transactions.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setCurrentStep("register")}
                  className="btn-corporate w-full"
                  size="lg"
                >
                  <User className="mr-2 h-5 w-5" />
                  Create New Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("dashboard")}
                  className="btn-secondary-corporate w-full"
                  size="lg"
                >
                  Sign In to Existing Account
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div>
                    <CheckCircle className="h-4 w-4 text-success mx-auto mb-1" />
                    <p className="text-muted-foreground">KYC Verified</p>
                  </div>
                  <div>
                    <Shield className="h-4 w-4 text-success mx-auto mb-1" />
                    <p className="text-muted-foreground">Secure Payments</p>
                  </div>
                  <div>
                    <Award className="h-4 w-4 text-success mx-auto mb-1" />
                    <p className="text-muted-foreground">Trust Badges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form
  if (currentStep === "register") {
    return (
      <div className="min-h-screen bg-background">
        <header className="corporate-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep("welcome")}
                className="corporate-transition"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  TradeBridge
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="card-corporate">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Exporter Registration
                </CardTitle>
                <p className="text-muted-foreground">
                  Create your verified business account to start listing
                  materials
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <Label htmlFor="firstName" className="form-label">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={registrationData.firstName}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              firstName: e.target.value,
                            })
                          }
                          className="input-corporate"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <Label htmlFor="lastName" className="form-label">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={registrationData.lastName}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              lastName: e.target.value,
                            })
                          }
                          className="input-corporate"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <Label htmlFor="age" className="form-label">
                          Age *
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          value={registrationData.age}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              age: e.target.value,
                            })
                          }
                          className="input-corporate"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <Label htmlFor="dateOfBirth" className="form-label">
                          Date of Birth *
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={registrationData.dateOfBirth}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="input-corporate"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <Label htmlFor="email" className="form-label">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={registrationData.email}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              email: e.target.value,
                            })
                          }
                          className="input-corporate"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <Label htmlFor="phone" className="form-label">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={registrationData.phone}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              phone: e.target.value,
                            })
                          }
                          className="input-corporate"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                      Business Information
                    </h3>
                    <div className="form-group">
                      <Label htmlFor="businessName" className="form-label">
                        Business Name *
                      </Label>
                      <Input
                        id="businessName"
                        value={registrationData.businessName}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            businessName: e.target.value,
                          })
                        }
                        className="input-corporate"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <Label htmlFor="businessType" className="form-label">
                        Business Type *
                      </Label>
                      <Select
                        value={registrationData.businessType}
                        onValueChange={(value) =>
                          setRegistrationData({
                            ...registrationData,
                            businessType: value,
                          })
                        }
                      >
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="form-group">
                      <Label htmlFor="businessAddress" className="form-label">
                        Business Address *
                      </Label>
                      <Textarea
                        id="businessAddress"
                        value={registrationData.businessAddress}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            businessAddress: e.target.value,
                          })
                        }
                        className="input-corporate"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <Label htmlFor="licenseNumber" className="form-label">
                          Import/Export License Number *
                        </Label>
                        <Input
                          id="licenseNumber"
                          value={registrationData.licenseNumber}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              licenseNumber: e.target.value,
                            })
                          }
                          className="input-corporate"
                          placeholder="Unique license number"
                          required
                        />
                        <p className="form-help">
                          This will be used as your unique identifier
                        </p>
                      </div>
                      <div className="form-group">
                        <Label htmlFor="gstNumber" className="form-label">
                          GST Number
                        </Label>
                        <Input
                          id="gstNumber"
                          value={registrationData.gstNumber}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              gstNumber: e.target.value,
                            })
                          }
                          className="input-corporate"
                          placeholder="GST registration number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                      Account Security
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <Label htmlFor="password" className="form-label">
                          Password *
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={registrationData.password}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              password: e.target.value,
                            })
                          }
                          className="input-corporate"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <Label htmlFor="confirmPassword" className="form-label">
                          Confirm Password *
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={registrationData.confirmPassword}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="input-corporate"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="btn-corporate w-full"
                    size="lg"
                  >
                    Continue to KYC Verification
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // KYC Verification
  if (currentStep === "kyc") {
    return (
      <div className="min-h-screen bg-background">
        <header className="corporate-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep("register")}
                className="corporate-transition"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  TradeBridge
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="card-corporate">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <Shield className="mr-2 h-6 w-6 text-primary" />
                  KYC Verification
                </CardTitle>
                <p className="text-muted-foreground">
                  Upload required documents to verify your business and enable
                  trading
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleKYCSubmission} className="space-y-6">
                  {/* Document Upload Sections */}
                  <div className="space-y-6">
                    {/* Business License */}
                    <div className="space-y-3">
                      <Label className="form-label">
                        Business License / Registration Certificate *
                      </Label>
                      <div className="border-2 border-dashed border-border p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG up to 10MB
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) =>
                            setKycDocuments({
                              ...kycDocuments,
                              businessLicense: e.target.files?.[0] || null,
                            })
                          }
                        />
                      </div>
                      {kycDocuments.businessLicense && (
                        <p className="text-sm text-success">
                          ✓ {kycDocuments.businessLicense.name}
                        </p>
                      )}
                    </div>

                    {/* GST Certificate */}
                    <div className="space-y-3">
                      <Label className="form-label">
                        GST Registration Certificate
                      </Label>
                      <div className="border-2 border-dashed border-border p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Bank Statement */}
                    <div className="space-y-3">
                      <Label className="form-label">
                        Bank Statement (Last 3 months) *
                      </Label>
                      <div className="border-2 border-dashed border-border p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Identity Proof */}
                    <div className="space-y-3">
                      <Label className="form-label">
                        Government ID Proof *
                      </Label>
                      <div className="border-2 border-dashed border-border p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Passport, Driving License, or Aadhaar Card
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-muted p-4">
                    <div className="flex items-start space-x-2">
                      <input type="checkbox" className="mt-1" required />
                      <div className="text-sm text-muted-foreground">
                        <p>
                          I agree to the{" "}
                          <a href="#" className="text-primary hover:underline">
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                          . I confirm that all information provided is accurate
                          and I have the authority to represent this business.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="btn-corporate w-full"
                    size="lg"
                  >
                    Submit for Verification
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="corporate-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="corporate-transition"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  TradeBridge
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={
                  verificationStatus === "verified" ? "default" : "secondary"
                }
                className={`trust-badge ${verificationStatus === "verified" ? "trust-badge-verified" : ""}`}
              >
                {verificationStatus === "verified" && (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {verificationStatus === "pending" && (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {verificationStatus === "rejected" && (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {verificationStatus === "verified"
                  ? "Verified Exporter"
                  : verificationStatus === "pending"
                    ? "Verification Pending"
                    : "Verification Required"}
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
            Manage your materials, track performance, and grow your business
          </p>
        </div>

        {/* Verification Status Banner */}
        {verificationStatus === "pending" && (
          <div className="notification-banner notification-warning mb-6 p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">KYC Verification in Progress</span>
              <span className="text-sm opacity-90">
                - Your documents are being reviewed. You can upload materials
                but trading will be enabled after verification.
              </span>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid-corporate-4 mb-8">
          <div className="card-corporate p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Listings</p>
                <p className="text-2xl font-semibold text-foreground">
                  {uploadedMaterials.length}
                </p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="card-corporate p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Inquiries</p>
                <p className="text-2xl font-semibold text-foreground">
                  {uploadedMaterials.reduce((sum, m) => sum + m.inquiries, 0)}
                </p>
              </div>
              <Mail className="h-8 w-8 text-success" />
            </div>
          </div>
          <div className="card-corporate p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Profile Views</p>
                <p className="text-2xl font-semibold text-foreground">
                  {uploadedMaterials.reduce((sum, m) => sum + m.views, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="card-corporate p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Success Rate</p>
                <p className="text-2xl font-semibold text-foreground">96.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Material</TabsTrigger>
            <TabsTrigger value="listings">
              My Listings ({uploadedMaterials.length})
            </TabsTrigger>
            <TabsTrigger value="profile">Business Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="card-corporate">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload New Material
                </CardTitle>
                <p className="text-muted-foreground">
                  Add a new material to your catalog with quality certificates
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMaterialUpload} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor="materialType" className="form-label">
                        Material Type *
                      </Label>
                      <Select
                        value={materialData.type}
                        onValueChange={(value) =>
                          setMaterialData({ ...materialData, type: value })
                        }
                      >
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Select material type" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="form-group">
                      <Label htmlFor="quality" className="form-label">
                        Quality/Grade *
                      </Label>
                      <Input
                        id="quality"
                        value={materialData.quality}
                        onChange={(e) =>
                          setMaterialData({
                            ...materialData,
                            quality: e.target.value,
                          })
                        }
                        className="input-corporate"
                        placeholder="e.g., Premium Grade A, Industrial Grade"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="form-group">
                      <Label htmlFor="price" className="form-label">
                        Price per Unit *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={materialData.price}
                        onChange={(e) =>
                          setMaterialData({
                            ...materialData,
                            price: e.target.value,
                          })
                        }
                        className="input-corporate"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <Label htmlFor="currency" className="form-label">
                        Currency *
                      </Label>
                      <Select
                        value={materialData.currency}
                        onValueChange={(value) =>
                          setMaterialData({ ...materialData, currency: value })
                        }
                      >
                        <SelectTrigger className="input-corporate">
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

                    <div className="form-group">
                      <Label htmlFor="moq" className="form-label">
                        Minimum Order Qty *
                      </Label>
                      <Input
                        id="moq"
                        value={materialData.moq}
                        onChange={(e) =>
                          setMaterialData({
                            ...materialData,
                            moq: e.target.value,
                          })
                        }
                        className="input-corporate"
                        placeholder="e.g., 1000 kg"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <Label htmlFor="stockQuantity" className="form-label">
                        Stock Quantity *
                      </Label>
                      <Input
                        id="stockQuantity"
                        value={materialData.stockQuantity}
                        onChange={(e) =>
                          setMaterialData({
                            ...materialData,
                            stockQuantity: e.target.value,
                          })
                        }
                        className="input-corporate"
                        placeholder="Available stock"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="location" className="form-label">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      value={materialData.location}
                      onChange={(e) =>
                        setMaterialData({
                          ...materialData,
                          location: e.target.value,
                        })
                      }
                      className="input-corporate"
                      placeholder="City, Country"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="description" className="form-label">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={materialData.description}
                      onChange={(e) =>
                        setMaterialData({
                          ...materialData,
                          description: e.target.value,
                        })
                      }
                      className="input-corporate"
                      placeholder="Additional details about your material..."
                      rows={3}
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="form-label">Product Images *</Label>
                      <div className="border-2 border-dashed border-border p-4 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upload product images
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Multiple files allowed
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="form-label">Quality Certificates</Label>
                      <div className="border-2 border-dashed border-border p-4 text-center">
                        <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upload certificates
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ISO, GOTS, Organic, etc.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="btn-corporate w-full"
                    size="lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Material
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <div className="space-y-4">
              {uploadedMaterials.map((material) => (
                <Card key={material.id} className="card-corporate">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-medium text-foreground">
                            {material.type}
                          </h3>
                          <Badge
                            variant={
                              material.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              material.status === "Active"
                                ? "status-success"
                                : ""
                            }
                          >
                            {material.status}
                          </Badge>
                          {material.certificates.map((cert, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="trust-badge trust-badge-verified text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-muted-foreground mb-3">
                          {material.quality}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium text-foreground">
                              {material.price} {material.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">MOQ</p>
                            <p className="font-medium text-foreground">
                              {material.moq}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Stock</p>
                            <p className="font-medium text-foreground">
                              {material.stockQuantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Inquiries</p>
                            <p className="font-medium text-success">
                              {material.inquiries}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Views</p>
                            <p className="font-medium text-primary">
                              {material.views}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Updated</p>
                            <p className="font-medium text-foreground">
                              {material.lastUpdated}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-secondary-corporate"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-secondary-corporate"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {uploadedMaterials.length === 0 && (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    No materials uploaded yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Upload your first material to start connecting with buyers
                  </p>
                  <Button className="btn-corporate">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Material
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="card-corporate">
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <p className="text-muted-foreground">
                  Manage your business information and verification status
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">
                      Business Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="form-label">Business Name</Label>
                        <p className="text-foreground">
                          {registrationData.businessName || "Global Trade Co."}
                        </p>
                      </div>
                      <div>
                        <Label className="form-label">Business Type</Label>
                        <p className="text-foreground">
                          {registrationData.businessType || "Exporter"}
                        </p>
                      </div>
                      <div>
                        <Label className="form-label">License Number</Label>
                        <p className="text-foreground">
                          {registrationData.licenseNumber || "EX123456789"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">
                      Verification Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-foreground">
                          Email Verified
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-foreground">
                          Phone Verified
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {verificationStatus === "verified" ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Clock className="h-4 w-4 text-warning" />
                        )}
                        <span className="text-sm text-foreground">
                          KYC{" "}
                          {verificationStatus === "verified"
                            ? "Verified"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">
                        Account Actions
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your account settings
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        className="btn-secondary-corporate"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="btn-secondary-corporate"
                      >
                        Update Documents
                      </Button>
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
