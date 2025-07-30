import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, User, Building, Package, Plus, Eye, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Exporter() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  
  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    dateOfBirth: "",
    email: "",
    password: "",
    licenseNumber: ""
  });

  // Material upload form state
  const [materialData, setMaterialData] = useState({
    type: "",
    quality: "",
    price: "",
    currency: "USD",
    location: "",
    moq: "",
    description: ""
  });

  // Mock uploaded materials
  const [uploadedMaterials, setUploadedMaterials] = useState([
    {
      id: 1,
      type: "Cotton",
      quality: "Premium Grade A",
      price: "$2.50",
      unit: "per kg",
      moq: "1000 kg",
      location: "India",
      status: "Active",
      inquiries: 5
    },
    {
      id: 2,
      type: "Silk",
      quality: "Mulberry Silk",
      price: "$45.00",
      unit: "per kg",
      moq: "100 kg",
      location: "India",
      status: "Active",
      inquiries: 12
    }
  ]);

  const materialTypes = ["Cotton", "Silk", "Polyester", "Wool", "Linen", "Nylon", "Jute", "Spices", "Plastic", "Steel"];
  const currencies = ["USD", "EUR", "GBP", "INR", "CNY", "JPY"];

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the actual registration
    setIsRegistered(true);
    setShowRegistration(false);
  };

  const handleMaterialUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the actual material upload
    const newMaterial = {
      id: uploadedMaterials.length + 1,
      type: materialData.type,
      quality: materialData.quality,
      price: `${materialData.currency} ${materialData.price}`,
      unit: "per kg",
      moq: materialData.moq,
      location: materialData.location,
      status: "Active",
      inquiries: 0
    };
    setUploadedMaterials([...uploadedMaterials, newMaterial]);
    setMaterialData({
      type: "",
      quality: "",
      price: "",
      currency: "USD",
      location: "",
      moq: "",
      description: ""
    });
  };

  if (!isRegistered && !showRegistration) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">TextileTrade</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Screen */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome, Exporter!</h2>
              <p className="text-slate-600 mb-8">
                Join our global marketplace and start selling your raw materials to importers worldwide. 
                Sign in to your account or register to get started.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowRegistration(true)}
                  className="w-full"
                  size="lg"
                >
                  <User className="mr-2 h-5 w-5" />
                  Register New Account
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRegistered(true)}
                  className="w-full"
                  size="lg"
                >
                  Sign In to Existing Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showRegistration) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowRegistration(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">TextileTrade</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Registration Form */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Exporter Registration</CardTitle>
                <p className="text-slate-600">Create your account to start listing materials</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={registrationData.firstName}
                        onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={registrationData.lastName}
                        onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={registrationData.age}
                        onChange={(e) => setRegistrationData({...registrationData, age: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={registrationData.dateOfBirth}
                        onChange={(e) => setRegistrationData({...registrationData, dateOfBirth: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={registrationData.password}
                      onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="licenseNumber">Import/Export License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={registrationData.licenseNumber}
                      onChange={(e) => setRegistrationData({...registrationData, licenseNumber: e.target.value})}
                      placeholder="Unique license number (used as primary key)"
                      required
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      This must be a unique, valid import/export license number
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Register Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">TextileTrade</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Exporter Dashboard
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Exporter Dashboard</h2>
          <p className="text-slate-600">Manage your materials and track your listings</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Material</TabsTrigger>
            <TabsTrigger value="listings">My Listings ({uploadedMaterials.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload New Material
                </CardTitle>
                <p className="text-slate-600">Add a new material to your catalog</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMaterialUpload} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="materialType">Material Type</Label>
                      <Select value={materialData.type} onValueChange={(value) => setMaterialData({...materialData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material type" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quality">Quality/Grade</Label>
                      <Input
                        id="quality"
                        value={materialData.quality}
                        onChange={(e) => setMaterialData({...materialData, quality: e.target.value})}
                        placeholder="e.g., Premium Grade A, Industrial Grade"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Price per Unit</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={materialData.price}
                        onChange={(e) => setMaterialData({...materialData, price: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={materialData.currency} onValueChange={(value) => setMaterialData({...materialData, currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="moq">Minimum Order Qty</Label>
                      <Input
                        id="moq"
                        value={materialData.moq}
                        onChange={(e) => setMaterialData({...materialData, moq: e.target.value})}
                        placeholder="e.g., 1000 kg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={materialData.location}
                      onChange={(e) => setMaterialData({...materialData, location: e.target.value})}
                      placeholder="Your location/country"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={materialData.description}
                      onChange={(e) => setMaterialData({...materialData, description: e.target.value})}
                      placeholder="Additional details about your material..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
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
                <Card key={material.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold">{material.type}</h3>
                          <Badge variant={material.status === "Active" ? "default" : "secondary"}>
                            {material.status}
                          </Badge>
                        </div>
                        <p className="text-slate-600 mb-2">{material.quality}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Price:</span> <span className="font-medium">{material.price} {material.unit}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">MOQ:</span> <span className="font-medium">{material.moq}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Location:</span> <span className="font-medium">{material.location}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Inquiries:</span> <span className="font-medium">{material.inquiries}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {uploadedMaterials.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No materials uploaded yet</h3>
                  <p className="text-slate-500">Upload your first material to start selling</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
