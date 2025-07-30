import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Info,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  CreditCard,
  Globe
} from "lucide-react";

interface RegistrationData {
  // Personal Information
  firstName: string;
  lastName: string;
  age: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  
  // Contact Information
  email: string;
  phone: string;
  alternatePhone: string;
  password: string;
  confirmPassword: string;
  
  // Business Information
  businessName: string;
  businessType: string;
  businessCategory: string;
  yearEstablished: string;
  employeeCount: string;
  annualTurnover: string;
  
  // Legal Information
  licenseNumber: string;
  taxId: string;
  vatNumber: string;
  incorporationNumber: string;
  
  // Address Information
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  // Trade Information
  tradingExperience: string;
  primaryMarkets: string[];
  commoditiesDealt: string[];
  averageOrderValue: string;
  
  // Reference Information
  bankName: string;
  bankAccountNumber: string;
  bankBranch: string;
  swiftCode: string;
  
  // References
  businessReference1: string;
  businessReference2: string;
  tradeReference1: string;
  tradeReference2: string;
}

export default function Registration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<"importer" | "exporter">("importer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState({ email: false, phone: false });
  const [otpVerified, setOtpVerified] = useState({ email: false, phone: false });
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    alternatePhone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    businessCategory: "",
    yearEstablished: "",
    employeeCount: "",
    annualTurnover: "",
    licenseNumber: "",
    taxId: "",
    vatNumber: "",
    incorporationNumber: "",
    businessAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    tradingExperience: "",
    primaryMarkets: [],
    commoditiesDealt: [],
    averageOrderValue: "",
    bankName: "",
    bankAccountNumber: "",
    bankBranch: "",
    swiftCode: "",
    businessReference1: "",
    businessReference2: "",
    tradeReference1: "",
    tradeReference2: ""
  });

  const [documents, setDocuments] = useState({
    businessLicense: null as File | null,
    taxCertificate: null as File | null,
    identityProof: null as File | null,
    addressProof: null as File | null,
    bankStatement: null as File | null,
    tradeLicense: null as File | null,
    certificateOfIncorporation: null as File | null
  });

  const businessTypes = [
    "Private Limited Company",
    "Public Limited Company", 
    "Partnership Firm",
    "Sole Proprietorship",
    "Limited Liability Partnership (LLP)",
    "Cooperative Society",
    "Trust",
    "Non-Profit Organization"
  ];

  const businessCategories = [
    "Manufacturer",
    "Trader/Dealer", 
    "Exporter",
    "Importer",
    "Wholesaler",
    "Retailer",
    "Service Provider",
    "Consultant"
  ];

  const countries = [
    "India", "United States", "China", "Germany", "United Kingdom",
    "France", "Italy", "Japan", "Canada", "Australia", "Brazil",
    "South Korea", "Netherlands", "Singapore", "UAE", "Others"
  ];

  const commodities = [
    "Cotton", "Silk", "Polyester", "Wool", "Linen", "Nylon", "Jute",
    "Cardamom", "Black Pepper", "Turmeric", "Cinnamon", "Cloves",
    "Cashews", "Almonds", "Spices (Mixed)", "Essential Oils"
  ];

  const markets = [
    "Asia-Pacific", "North America", "Europe", "Middle East", 
    "Africa", "Latin America", "Oceania"
  ];

  const handleInputChange = (field: keyof RegistrationData, value: string | string[]) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: keyof typeof documents, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const sendOtp = async (type: "email" | "phone") => {
    // Simulate OTP sending
    setOtpSent(prev => ({ ...prev, [type]: true }));
  };

  const verifyOtp = async (type: "email" | "phone", otp: string) => {
    // Simulate OTP verification
    if (otp === "123456") {
      setOtpVerified(prev => ({ ...prev, [type]: true }));
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="h-5 w-5 text-success" />;
    if (step === currentStep) return <div className="h-5 w-5 bg-primary rounded-full" />;
    return <div className="h-5 w-5 bg-muted-foreground rounded-full" />;
  };

  const steps = [
    { number: 1, title: "Personal Information", description: "Basic personal details" },
    { number: 2, title: "Business Information", description: "Company and legal details" },
    { number: 3, title: "Verification", description: "Email and phone verification" },
    { number: 4, title: "Documents", description: "Upload required documents" },
    { number: 5, title: "Review & Submit", description: "Final verification" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="corporate-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="corporate-transition">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">TradeBridge</span>
              </div>
            </div>
            <Badge variant="secondary" className="trust-badge">
              <Lock className="h-3 w-3 mr-1" />
              Secure Registration
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-10 h-10 mb-2">
                    {getStepIcon(step.number)}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${step.number < currentStep ? 'bg-success' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Role Selection */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="card-corporate">
            <CardHeader>
              <CardTitle className="text-center">Select Your Trading Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={role === "importer" ? "default" : "outline"}
                  className={role === "importer" ? "btn-corporate" : "btn-secondary-corporate"}
                  onClick={() => setRole("importer")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Importer
                </Button>
                <Button
                  variant={role === "exporter" ? "default" : "outline"}
                  className={role === "exporter" ? "btn-corporate" : "btn-secondary-corporate"}
                  onClick={() => setRole("exporter")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Forms */}
        <div className="max-w-2xl mx-auto">
          <Card className="card-corporate">
            <CardHeader>
              <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
              <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label className="form-label">First Name *</Label>
                      <Input
                        value={registrationData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="input-corporate"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Last Name *</Label>
                      <Input
                        value={registrationData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="input-corporate"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-group">
                      <Label className="form-label">Age *</Label>
                      <Input
                        type="number"
                        value={registrationData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="input-corporate"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Date of Birth *</Label>
                      <Input
                        type="date"
                        value={registrationData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="input-corporate"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Gender</Label>
                      <Select value={registrationData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label className="form-label">Nationality *</Label>
                      <Select value={registrationData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Primary Phone *</Label>
                      <Input
                        type="tel"
                        value={registrationData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="input-corporate"
                        placeholder="+1 234 567 8900"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label className="form-label">Email Address *</Label>
                      <Input
                        type="email"
                        value={registrationData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="input-corporate"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Alternate Phone</Label>
                      <Input
                        type="tel"
                        value={registrationData.alternatePhone}
                        onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                        className="input-corporate"
                        placeholder="+1 234 567 8901"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label className="form-label">Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={registrationData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="input-corporate pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={registrationData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="input-corporate pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="form-group">
                    <Label className="form-label">Business Name *</Label>
                    <Input
                      value={registrationData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      className="input-corporate"
                      placeholder="Legal business name as per registration"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label className="form-label">Business Type *</Label>
                      <Select value={registrationData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Business Category *</Label>
                      <Select value={registrationData.businessCategory} onValueChange={(value) => handleInputChange("businessCategory", value)}>
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-group">
                      <Label className="form-label">Year Established *</Label>
                      <Input
                        type="number"
                        value={registrationData.yearEstablished}
                        onChange={(e) => handleInputChange("yearEstablished", e.target.value)}
                        className="input-corporate"
                        placeholder="YYYY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Employee Count</Label>
                      <Select value={registrationData.employeeCount} onValueChange={(value) => handleInputChange("employeeCount", value)}>
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Annual Turnover</Label>
                      <Select value={registrationData.annualTurnover} onValueChange={(value) => handleInputChange("annualTurnover", value)}>
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-1m">Under $1M</SelectItem>
                          <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                          <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                          <SelectItem value="10m-50m">$10M - $50M</SelectItem>
                          <SelectItem value="50m+">$50M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label className="form-label">Import/Export License Number *</Label>
                      <Input
                        value={registrationData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        className="input-corporate"
                        placeholder="Government issued license number"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Tax ID/GST Number *</Label>
                      <Input
                        value={registrationData.taxId}
                        onChange={(e) => handleInputChange("taxId", e.target.value)}
                        className="input-corporate"
                        placeholder="Tax identification number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label className="form-label">VAT Number</Label>
                      <Input
                        value={registrationData.vatNumber}
                        onChange={(e) => handleInputChange("vatNumber", e.target.value)}
                        className="input-corporate"
                        placeholder="VAT registration number"
                      />
                    </div>
                    <div className="form-group">
                      <Label className="form-label">Incorporation Number</Label>
                      <Input
                        value={registrationData.incorporationNumber}
                        onChange={(e) => handleInputChange("incorporationNumber", e.target.value)}
                        className="input-corporate"
                        placeholder="Company incorporation number"
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4 border-t border-border pt-4">
                    <h4 className="font-medium text-foreground">Business Address</h4>
                    <div className="form-group">
                      <Label className="form-label">Full Address *</Label>
                      <Textarea
                        value={registrationData.businessAddress}
                        onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                        className="input-corporate"
                        rows={3}
                        placeholder="Complete business address"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <Label className="form-label">City *</Label>
                        <Input
                          value={registrationData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="input-corporate"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <Label className="form-label">State/Province *</Label>
                        <Input
                          value={registrationData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          className="input-corporate"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <Label className="form-label">Country *</Label>
                        <Select value={registrationData.country} onValueChange={(value) => handleInputChange("country", value)}>
                          <SelectTrigger className="input-corporate">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="form-group">
                        <Label className="form-label">Postal Code *</Label>
                        <Input
                          value={registrationData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          className="input-corporate"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Verification Required</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We need to verify your email and phone number to ensure account security and prevent fraud.
                    </p>
                  </div>

                  {/* Email Verification */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="form-label">Email Verification</Label>
                        <p className="text-sm text-muted-foreground">{registrationData.email}</p>
                      </div>
                      {otpVerified.email ? (
                        <Badge className="trust-badge trust-badge-verified">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => sendOtp("email")}
                          disabled={otpSent.email}
                          className="btn-corporate"
                          size="sm"
                        >
                          {otpSent.email ? "OTP Sent" : "Send OTP"}
                        </Button>
                      )}
                    </div>
                    {otpSent.email && !otpVerified.email && (
                      <div className="flex space-x-2">
                        <Input
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="input-corporate"
                          maxLength={6}
                        />
                        <Button
                          onClick={() => verifyOtp("email", emailOtp)}
                          className="btn-corporate"
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Phone Verification */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="form-label">Phone Verification</Label>
                        <p className="text-sm text-muted-foreground">{registrationData.phone}</p>
                      </div>
                      {otpVerified.phone ? (
                        <Badge className="trust-badge trust-badge-verified">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => sendOtp("phone")}
                          disabled={otpSent.phone}
                          className="btn-corporate"
                          size="sm"
                        >
                          {otpSent.phone ? "OTP Sent" : "Send OTP"}
                        </Button>
                      )}
                    </div>
                    {otpSent.phone && !otpVerified.phone && (
                      <div className="flex space-x-2">
                        <Input
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="input-corporate"
                          maxLength={6}
                        />
                        <Button
                          onClick={() => verifyOtp("phone", phoneOtp)}
                          className="btn-corporate"
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Document Upload */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-muted p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Required Documents</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please upload clear, readable copies of the following documents. All documents must be valid and current.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business License */}
                    <div className="space-y-2">
                      <Label className="form-label">Business License/Registration Certificate *</Label>
                      <div className="border-2 border-dashed border-border p-4 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload("businessLicense", e.target.files[0])}
                          className="hidden"
                        />
                      </div>
                      {documents.businessLicense && (
                        <p className="text-sm text-success">✓ {documents.businessLicense.name}</p>
                      )}
                    </div>

                    {/* Tax Certificate */}
                    <div className="space-y-2">
                      <Label className="form-label">Tax ID/GST Certificate *</Label>
                      <div className="border-2 border-dashed border-border p-4 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                    </div>

                    {/* Identity Proof */}
                    <div className="space-y-2">
                      <Label className="form-label">Government-issued ID *</Label>
                      <div className="border-2 border-dashed border-border p-4 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Passport, Driver's License, National ID</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                    </div>

                    {/* Address Proof */}
                    <div className="space-y-2">
                      <Label className="form-label">Address Proof *</Label>
                      <div className="border-2 border-dashed border-border p-4 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Utility bill, Bank statement</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                    </div>

                    {/* Bank Statement */}
                    <div className="space-y-2">
                      <Label className="form-label">Bank Statement (Last 3 months) *</Label>
                      <div className="border-2 border-dashed border-border p-4 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Official bank statement</p>
                        <p className="text-xs text-muted-foreground">PDF (Max 10MB)</p>
                      </div>
                    </div>

                    {/* Trade License */}
                    <div className="space-y-2">
                      <Label className="form-label">Import/Export Trade License *</Label>
                      <div className="border-2 border-dashed border-border p-4 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Government trade license</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-success/10 border border-success/20 p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium text-success">Registration Complete</span>
                    </div>
                    <p className="text-sm text-success">
                      Please review all information and submit for verification.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Registration Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name:</p>
                        <p className="font-medium">{registrationData.firstName} {registrationData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email:</p>
                        <p className="font-medium">{registrationData.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Business:</p>
                        <p className="font-medium">{registrationData.businessName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Role:</p>
                        <p className="font-medium capitalize">{role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4">
                    <h4 className="font-medium text-foreground mb-2">Next Steps</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>1. Our verification team will review your documents (24-48 hours)</p>
                      <p>2. You'll receive email updates on verification status</p>
                      <p>3. Once approved, you can start trading immediately</p>
                      <p>4. Complete your business profile to attract more partners</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <input type="checkbox" className="mt-1" required />
                      <div className="text-sm text-muted-foreground">
                        <p>
                          I hereby confirm that all information provided is accurate and complete. 
                          I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>, 
                          <a href="#" className="text-primary hover:underline ml-1">Privacy Policy</a>, and 
                          <a href="#" className="text-primary hover:underline ml-1">Trading Agreement</a>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <input type="checkbox" className="mt-1" required />
                      <div className="text-sm text-muted-foreground">
                        <p>
                          I authorize TradeBridge to verify the provided information with relevant authorities 
                          and financial institutions for account verification purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-secondary-corporate"
                >
                  Previous
                </Button>
                
                {currentStep < 5 ? (
                  <Button
                    onClick={nextStep}
                    className="btn-corporate"
                    disabled={
                      (currentStep === 3 && (!otpVerified.email || !otpVerified.phone))
                    }
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button className="btn-corporate">
                    Submit Registration
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
