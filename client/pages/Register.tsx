import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Upload,
  FileText,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Globe
} from "lucide-react";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  
  // Company Information
  companyName: string;
  businessType: string;
  role: string;
  licenseNumber: string;
  taxId: string;
  website: string;
  establishedYear: string;
  employeeCount: string;
  annualTurnover: string;
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  
  // Terms and Privacy
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<Record<string, File | null>>({
    governmentId: null,
    businessLicense: null,
    taxCertificate: null,
    bankStatement: null
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    businessType: "",
    role: roleFromUrl || "",
    licenseNumber: "",
    taxId: "",
    website: "",
    establishedYear: "",
    employeeCount: "",
    annualTurnover: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: ""
    },
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false
  });

  const businessTypes = [
    { value: "manufacturer", label: "Manufacturer" },
    { value: "trader", label: "Trader" },
    { value: "wholesaler", label: "Wholesaler" },
    { value: "retailer", label: "Retailer" },
    { value: "service_provider", label: "Service Provider" }
  ];

  const countries = [
    "India", "United States", "China", "Germany", "United Kingdom",
    "France", "Italy", "Japan", "Canada", "Australia", "Brazil",
    "South Korea", "Netherlands", "Singapore", "UAE"
  ];

  const employeeCounts = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "500+", label: "500+ employees" }
  ];

  const annualTurnovers = [
    { value: "<1M", label: "Under $1 Million" },
    { value: "1M-5M", label: "$1M - $5M" },
    { value: "5M-10M", label: "$5M - $10M" },
    { value: "10M-50M", label: "$10M - $50M" },
    { value: "50M+", label: "$50M+" }
  ];

  const steps = [
    { number: 1, title: "Personal Info", description: "Basic personal details", icon: User },
    { number: 2, title: "Company Info", description: "Business information", icon: Building2 },
    { number: 3, title: "Verification", description: "Document upload", icon: Shield },
    { number: 4, title: "Review", description: "Final verification", icon: CheckCircle }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
          newErrors.password = "Password must contain uppercase, lowercase, number, and special character";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;

      case 2: // Company Information
        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
        if (!formData.businessType) newErrors.businessType = "Business type is required";
        if (!formData.role) newErrors.role = "Role is required";
        if (!formData.licenseNumber.trim()) {
          newErrors.licenseNumber = "License number is required";
        } else if (!/^[A-Z0-9]{10}$/.test(formData.licenseNumber.toUpperCase())) {
          newErrors.licenseNumber = "License number must be 10 alphanumeric characters";
        }
        if (!formData.address.street.trim()) newErrors["address.street"] = "Street address is required";
        if (!formData.address.city.trim()) newErrors["address.city"] = "City is required";
        if (!formData.address.state.trim()) newErrors["address.state"] = "State is required";
        if (!formData.address.country.trim()) newErrors["address.country"] = "Country is required";
        if (!formData.address.zipCode.trim()) newErrors["address.zipCode"] = "ZIP code is required";
        break;

      case 3: // Document Verification
        if (!documents.governmentId) newErrors.governmentId = "Government ID is required";
        if (!documents.businessLicense) newErrors.businessLicense = "Business license is required";
        if (!documents.bankStatement) newErrors.bankStatement = "Bank statement is required";
        break;

      case 4: // Final Review
        if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms and conditions";
        if (!formData.acceptPrivacy) newErrors.acceptPrivacy = "You must accept the privacy policy";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsLoading(true);
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'address') {
          Object.entries(value).forEach(([addressKey, addressValue]) => {
            submitData.append(`address.${addressKey}`, addressValue);
          });
        } else {
          submitData.append(key, value.toString());
        }
      });
      
      // Add documents
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file);
        }
      });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        // Store user data and redirect to dashboard
        localStorage.setItem('vasa_user', JSON.stringify(result.data.user));
        localStorage.setItem('vasa_token', result.data.token);
        
        // Redirect based on role
        if (formData.role === 'importer') {
          navigate('/importer-dashboard');
        } else {
          navigate('/exporter-dashboard');
        }
      } else {
        setErrors({ submit: result.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="h-5 w-5 text-success" />;
    if (step === currentStep) return <div className="h-5 w-5 bg-primary rounded-full" />;
    return <div className="h-5 w-5 bg-muted-foreground rounded-full opacity-50" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-2xl font-bold text-foreground">VASA</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Already have an account?</span>
              <Link to="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 mb-2 ${
                      step.number <= currentStep 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-muted-foreground bg-background text-muted-foreground'
                    }`}>
                      {step.number < currentStep ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-4 ${
                      step.number < currentStep ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Company Information"}
                {currentStep === 3 && "Document Verification"}
                {currentStep === 4 && "Review & Submit"}
              </CardTitle>
              <p className="text-muted-foreground">
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "Provide your business details"}
                {currentStep === 3 && "Upload required documents for KYC verification"}
                {currentStep === 4 && "Review your information and complete registration"}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 234 567 8900"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Trading Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="importer">Importer - I buy products globally</SelectItem>
                        <SelectItem value="exporter">Exporter - I sell products globally</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={errors.password ? "border-destructive" : ""}
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
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={errors.confirmPassword ? "border-destructive" : ""}
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
                      {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Company Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Company Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b border-border pb-2">Company Details</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className={errors.companyName ? "border-destructive" : ""}
                      />
                      {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
                          <SelectTrigger className={errors.businessType ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.businessType && <p className="text-sm text-destructive">{errors.businessType}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="establishedYear">Established Year</Label>
                        <Input
                          id="establishedYear"
                          type="number"
                          value={formData.establishedYear}
                          onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                          placeholder="YYYY"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeCount">Employee Count</Label>
                        <Select value={formData.employeeCount} onValueChange={(value) => handleInputChange("employeeCount", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeCounts.map((count) => (
                              <SelectItem key={count.value} value={count.value}>{count.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="annualTurnover">Annual Turnover</Label>
                        <Select value={formData.annualTurnover} onValueChange={(value) => handleInputChange("annualTurnover", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            {annualTurnovers.map((turnover) => (
                              <SelectItem key={turnover.value} value={turnover.value}>{turnover.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://www.yourcompany.com"
                      />
                    </div>
                  </div>

                  {/* Legal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b border-border pb-2">Legal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Import/Export License Number *</Label>
                        <Input
                          id="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={(e) => handleInputChange("licenseNumber", e.target.value.toUpperCase())}
                          placeholder="e.g., ABCD1234567"
                          maxLength={10}
                          className={errors.licenseNumber ? "border-destructive" : ""}
                        />
                        {errors.licenseNumber && <p className="text-sm text-destructive">{errors.licenseNumber}</p>}
                        <p className="text-xs text-muted-foreground">10 alphanumeric characters (IEC/EIN/VAT)</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID / GST Number</Label>
                        <Input
                          id="taxId"
                          value={formData.taxId}
                          onChange={(e) => handleInputChange("taxId", e.target.value)}
                          placeholder="Tax identification number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b border-border pb-2">Business Address</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Textarea
                        id="street"
                        value={formData.address.street}
                        onChange={(e) => handleInputChange("address.street", e.target.value)}
                        rows={3}
                        className={errors["address.street"] ? "border-destructive" : ""}
                      />
                      {errors["address.street"] && <p className="text-sm text-destructive">{errors["address.street"]}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.address.city}
                          onChange={(e) => handleInputChange("address.city", e.target.value)}
                          className={errors["address.city"] ? "border-destructive" : ""}
                        />
                        {errors["address.city"] && <p className="text-sm text-destructive">{errors["address.city"]}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province *</Label>
                        <Input
                          id="state"
                          value={formData.address.state}
                          onChange={(e) => handleInputChange("address.state", e.target.value)}
                          className={errors["address.state"] ? "border-destructive" : ""}
                        />
                        {errors["address.state"] && <p className="text-sm text-destructive">{errors["address.state"]}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select value={formData.address.country} onValueChange={(value) => handleInputChange("address.country", value)}>
                          <SelectTrigger className={errors["address.country"] ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors["address.country"] && <p className="text-sm text-destructive">{errors["address.country"]}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.address.zipCode}
                          onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                          className={errors["address.zipCode"] ? "border-destructive" : ""}
                        />
                        {errors["address.zipCode"] && <p className="text-sm text-destructive">{errors["address.zipCode"]}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Document Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">KYC Verification Required</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please upload clear, readable copies of the following documents. All documents must be valid and current.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Government ID */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Government-issued ID *</Label>
                      <div className="border-2 border-dashed border-border p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">Upload Government ID</p>
                        <p className="text-xs text-muted-foreground">Passport, Driver's License, National ID</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("governmentId", e.target.files?.[0] || null)}
                          className="hidden"
                          id="governmentId"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() => document.getElementById("governmentId")?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                      {documents.governmentId && (
                        <p className="text-sm text-success flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {documents.governmentId.name}
                        </p>
                      )}
                      {errors.governmentId && <p className="text-sm text-destructive">{errors.governmentId}</p>}
                    </div>

                    {/* Business License */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Business License *</Label>
                      <div className="border-2 border-dashed border-border p-6 text-center">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">Upload Business License</p>
                        <p className="text-xs text-muted-foreground">Import/Export License, Trade License</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("businessLicense", e.target.files?.[0] || null)}
                          className="hidden"
                          id="businessLicense"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() => document.getElementById("businessLicense")?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                      {documents.businessLicense && (
                        <p className="text-sm text-success flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {documents.businessLicense.name}
                        </p>
                      )}
                      {errors.businessLicense && <p className="text-sm text-destructive">{errors.businessLicense}</p>}
                    </div>

                    {/* Tax Certificate */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Tax Certificate (Optional)</Label>
                      <div className="border-2 border-dashed border-border p-6 text-center">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">Upload Tax Certificate</p>
                        <p className="text-xs text-muted-foreground">GST Registration, VAT Certificate</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("taxCertificate", e.target.files?.[0] || null)}
                          className="hidden"
                          id="taxCertificate"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() => document.getElementById("taxCertificate")?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                      {documents.taxCertificate && (
                        <p className="text-sm text-success flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {documents.taxCertificate.name}
                        </p>
                      )}
                    </div>

                    {/* Bank Statement */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Bank Statement *</Label>
                      <div className="border-2 border-dashed border-border p-6 text-center">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">Upload Bank Statement</p>
                        <p className="text-xs text-muted-foreground">Last 3 months, Official statement</p>
                        <p className="text-xs text-muted-foreground">PDF (Max 10MB)</p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileUpload("bankStatement", e.target.files?.[0] || null)}
                          className="hidden"
                          id="bankStatement"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() => document.getElementById("bankStatement")?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                      {documents.bankStatement && (
                        <p className="text-sm text-success flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {documents.bankStatement.name}
                        </p>
                      )}
                      {errors.bankStatement && <p className="text-sm text-destructive">{errors.bankStatement}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium text-success">Ready to Submit</span>
                    </div>
                    <p className="text-sm text-success">
                      Please review your information and accept the terms to complete registration.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Registration Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name:</p>
                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email:</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Company:</p>
                        <p className="font-medium">{formData.companyName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Role:</p>
                        <p className="font-medium capitalize">{formData.role}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">License Number:</p>
                        <p className="font-medium">{formData.licenseNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Country:</p>
                        <p className="font-medium">{formData.address.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange("acceptTerms", !!checked)}
                        className={errors.acceptTerms ? "border-destructive" : ""}
                      />
                      <div className="text-sm">
                        <label htmlFor="acceptTerms" className="cursor-pointer">
                          I agree to the{" "}
                          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                          and have read the{" "}
                          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> *
                        </label>
                        {errors.acceptTerms && <p className="text-destructive mt-1">{errors.acceptTerms}</p>}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onCheckedChange={(checked) => handleInputChange("acceptPrivacy", !!checked)}
                        className={errors.acceptPrivacy ? "border-destructive" : ""}
                      />
                      <div className="text-sm">
                        <label htmlFor="acceptPrivacy" className="cursor-pointer">
                          I consent to the processing of my personal data for KYC verification and platform services *
                        </label>
                        {errors.acceptPrivacy && <p className="text-destructive mt-1">{errors.acceptPrivacy}</p>}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptMarketing"
                        checked={formData.acceptMarketing}
                        onCheckedChange={(checked) => handleInputChange("acceptMarketing", !!checked)}
                      />
                      <label htmlFor="acceptMarketing" className="text-sm cursor-pointer">
                        I would like to receive marketing communications and product updates (optional)
                      </label>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">{errors.submit}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="min-w-[100px]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="min-w-[100px]"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Registration
                      </>
                    )}
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
