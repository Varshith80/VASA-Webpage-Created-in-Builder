import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Globe, 
  Calculator,
  Truck,
  Clock,
  Download
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ComplianceResult {
  compliant: boolean;
  warnings: string[];
  requirements: string[];
  prohibitions: string[];
  recommendations: string[];
}

interface ComplianceCheckProps {
  productId?: string;
  product?: any;
  onComplianceChange?: (result: ComplianceResult) => void;
  className?: string;
}

export const ComplianceChecker: React.FC<ComplianceCheckProps> = ({
  productId,
  product,
  onComplianceChange,
  className = ""
}) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState<any[]>([]);
  const [complianceResult, setComplianceResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customValue, setCustomValue] = useState('');
  const [routeCheck, setRouteCheck] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('compliance');

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (complianceResult?.compliance) {
      onComplianceChange?.(complianceResult.compliance);
    }
  }, [complianceResult, onComplianceChange]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/compliance/countries');
      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const checkCompliance = async () => {
    if (!productId && !product) return;
    if (!selectedCountry) return;

    setLoading(true);
    try {
      const requestData = {
        productId: productId || product?._id,
        destinationCountry: selectedCountry,
        quantity: quantity,
        value: customValue ? parseFloat(customValue) : undefined
      };

      const response = await fetch('/api/compliance/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (data.success) {
        setComplianceResult(data.data);
      }
    } catch (error) {
      console.error('Compliance check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkRoute = async () => {
    if (!product && !productId) return;
    if (!selectedCountry) return;

    try {
      const response = await fetch('/api/compliance/route-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originCountry: product?.origin || 'US', // Default or from product
          destinationCountry: selectedCountry,
          transitCountries: [] // Could be extended to allow transit selection
        })
      });

      const data = await response.json();
      if (data.success) {
        setRouteCheck(data.data);
      }
    } catch (error) {
      console.error('Route check failed:', error);
    }
  };

  const renderComplianceStatus = () => {
    if (!complianceResult) return null;

    const { compliance } = complianceResult;
    
    return (
      <div className="space-y-4">
        {/* Overall Status */}
        <Alert className={compliance.compliant ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center gap-2">
            {compliance.compliant ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${compliance.compliant ? 'text-green-800' : 'text-red-800'}`}>
              {compliance.compliant ? 'Compliance Check Passed' : 'Compliance Issues Found'}
            </span>
          </div>
        </Alert>

        {/* Prohibitions */}
        {compliance.prohibitions?.length > 0 && (
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-700 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Prohibited Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {compliance.prohibitions.map((prohibition: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-red-700">
                    <span className="text-red-500 mt-1">•</span>
                    {prohibition}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Warnings */}
        {compliance.warnings?.length > 0 && (
          <Card className="border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {compliance.warnings.map((warning: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-yellow-700">
                    <span className="text-yellow-500 mt-1">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Required Documents & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {compliance.requirements?.map((requirement: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">{requirement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {compliance.recommendations?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {compliance.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-green-700">
                    <span className="text-green-500 mt-1">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderDocuments = () => {
    if (!complianceResult?.documents) return null;

    return (
      <div className="space-y-4">
        {complianceResult.documents.map((doc: any, index: number) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{doc.type.replace(/_/g, ' ')}</CardTitle>
                <Badge variant="outline">
                  {doc.validity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600">{doc.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Issuing Authority</Label>
                  <p className="text-gray-600">{doc.issuingAuthority}</p>
                </div>
                <div>
                  <Label className="font-medium">Validity Period</Label>
                  <p className="text-gray-600">{doc.validity}</p>
                </div>
              </div>

              {doc.requiredFields && (
                <div>
                  <Label className="font-medium">Required Fields</Label>
                  <ul className="mt-1 text-sm text-gray-600">
                    {doc.requiredFields.map((field: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-500">•</span>
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                {doc.digitalAvailable && (
                  <Badge variant="secondary" className="self-center">
                    Digital Available
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderDutyCalculation = () => {
    if (!complianceResult?.duties) return null;

    const { duties } = complianceResult;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Estimated Duties & Taxes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Estimated Duty Rate</Label>
              <p className="text-2xl font-bold text-blue-600">{duties.rate}%</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Estimated Amount</Label>
              <p className="text-2xl font-bold text-green-600">
                {duties.currency} {duties.estimatedDuty.toLocaleString()}
              </p>
            </div>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {duties.note}
            </AlertDescription>
          </Alert>

          {complianceResult.hsCodeSuggestions?.length > 0 && (
            <div>
              <Label className="font-medium">Suggested HS Codes</Label>
              <div className="mt-2 space-y-2">
                {complianceResult.hsCodeSuggestions.map((hs: any, index: number) => (
                  <div key={index} className="p-2 border rounded flex justify-between items-center">
                    <div>
                      <span className="font-mono font-medium">{hs.code}</span>
                      <p className="text-sm text-gray-600">{hs.description}</p>
                    </div>
                    <Badge variant="outline">{hs.confidence}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderShippingInfo = () => {
    if (!routeCheck) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Route Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-medium">{routeCheck.route.origin.name}</div>
                  <div className="text-sm text-gray-500">Origin</div>
                </div>
                <div className="flex-1 h-px bg-gray-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Truck className="h-4 w-4 bg-white px-1 text-gray-500" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{routeCheck.route.destination.name}</div>
                  <div className="text-sm text-gray-500">Destination</div>
                </div>
              </div>
            </div>

            {routeCheck.validation.valid ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Shipping route is valid with no restrictions
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Route restrictions found
                </AlertDescription>
              </Alert>
            )}

            {routeCheck.validation.issues?.length > 0 && (
              <div className="space-y-2">
                <Label className="font-medium text-red-700">Route Issues</Label>
                {routeCheck.validation.issues.map((issue: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-red-600">
                    <XCircle className="h-4 w-4 mt-0.5" />
                    {issue}
                  </div>
                ))}
              </div>
            )}

            {routeCheck.validation.recommendations?.length > 0 && (
              <div className="space-y-2">
                <Label className="font-medium text-yellow-700">Recommendations</Label>
                {routeCheck.validation.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-yellow-600">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Export/Import Compliance Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="country">Destination Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="value">Custom Value (Optional)</Label>
              <Input
                id="value"
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Override product price"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={checkCompliance} 
              disabled={!selectedCountry || loading}
              className="flex-1"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Check Compliance
            </Button>

            <Button 
              onClick={checkRoute} 
              variant="outline"
              disabled={!selectedCountry}
            >
              <Truck className="h-4 w-4 mr-2" />
              Check Route
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {(complianceResult || routeCheck) && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="duties">Duties & Taxes</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="compliance" className="mt-6">
            {renderComplianceStatus()}
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            {renderDocuments()}
          </TabsContent>

          <TabsContent value="duties" className="mt-6">
            {renderDutyCalculation()}
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            {renderShippingInfo()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ComplianceChecker;
