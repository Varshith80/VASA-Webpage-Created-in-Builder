import React, { useState, useRef, useCallback } from 'react';
import { 
  Bug, 
  Send, 
  Camera, 
  Paperclip, 
  X, 
  AlertTriangle,
  CheckCircle,
  Monitor,
  Smartphone,
  Tablet,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import html2canvas from 'html2canvas';

interface BugReportWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (report: any) => void;
  className?: string;
}

interface BugReport {
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  category: string;
  priority: string;
  severity: string;
  screenshots: File[];
  files: File[];
}

export const BugReportWidget: React.FC<BugReportWidgetProps> = ({
  isOpen,
  onClose,
  onSubmit,
  className = ""
}) => {
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<BugReport>({
    title: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    category: '',
    priority: 'MEDIUM',
    severity: 'MINOR',
    screenshots: [],
    files: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotCanvasRef = useRef<HTMLCanvasElement>(null);

  // Get system information
  const getSystemInfo = useCallback(() => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    const screenResolution = `${screen.width}x${screen.height}`;
    const url = window.location.href;
    
    // Detect browser
    let browser = 'Unknown';
    let browserVersion = '';
    
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
      browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || '';
    }
    
    // Detect OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    // Detect device type
    let device = 'Desktop';
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      device = userAgent.includes('iPad') ? 'Tablet' : 'Mobile';
    }
    
    return {
      browser: { name: browser, version: browserVersion },
      os: { name: os, version: '' },
      device,
      viewport,
      screenResolution,
      platform,
      language,
      url,
      userAgent
    };
  }, []);

  const captureScreenshot = async () => {
    try {
      // Hide the bug report widget temporarily
      const widgetElement = document.querySelector('[data-bug-widget]');
      if (widgetElement) {
        (widgetElement as HTMLElement).style.display = 'none';
      }

      // Capture screenshot
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scale: 0.5, // Reduce quality for smaller file size
        width: window.innerWidth,
        height: window.innerHeight
      });

      // Show widget again
      if (widgetElement) {
        (widgetElement as HTMLElement).style.display = 'block';
      }

      // Convert to blob
      return new Promise<File>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `screenshot-${Date.now()}.png`, {
              type: 'image/png'
            });
            resolve(file);
          }
        }, 'image/png', 0.8);
      });
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      throw new Error('Failed to capture screenshot');
    }
  };

  const handleScreenshot = async () => {
    try {
      setLoading(true);
      const screenshotFile = await captureScreenshot();
      setReport(prev => ({
        ...prev,
        screenshots: [...prev.screenshots, screenshotFile]
      }));
    } catch (error) {
      setError('Failed to capture screenshot');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setReport(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
  };

  const removeFile = (index: number, type: 'screenshots' | 'files') => {
    setReport(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!report.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!report.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!report.category) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const systemInfo = getSystemInfo();
      const formData = new FormData();

      // Add text data
      formData.append('title', report.title);
      formData.append('description', report.description);
      formData.append('stepsToReproduce', report.stepsToReproduce);
      formData.append('expectedBehavior', report.expectedBehavior);
      formData.append('actualBehavior', report.actualBehavior);
      formData.append('category', report.category);
      formData.append('priority', report.priority);
      formData.append('severity', report.severity);
      formData.append('systemInfo', JSON.stringify(systemInfo));

      // Add files
      report.screenshots.forEach((file, index) => {
        formData.append(`screenshot_${index}`, file);
      });
      
      report.files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/bug-reports', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStep('success');
        onSubmit?.(data.data);
      } else {
        setError(data.message || 'Failed to submit bug report');
      }
    } catch (error) {
      setError('Failed to submit bug report');
      console.error('Bug report submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setReport({
      title: '',
      description: '',
      stepsToReproduce: '',
      expectedBehavior: '',
      actualBehavior: '',
      category: '',
      priority: 'MEDIUM',
      severity: 'MINOR',
      screenshots: [],
      files: []
    });
    setStep('form');
    setError(null);
  };

  const categories = [
    { value: 'USER_INTERFACE', label: 'User Interface', icon: Monitor },
    { value: 'FUNCTIONALITY', label: 'Functionality', icon: Bug },
    { value: 'PERFORMANCE', label: 'Performance', icon: AlertTriangle },
    { value: 'SECURITY', label: 'Security', icon: AlertTriangle },
    { value: 'DATA_LOSS', label: 'Data Loss', icon: AlertTriangle },
    { value: 'INTEGRATION', label: 'Integration', icon: Bug },
    { value: 'MOBILE_RESPONSIVE', label: 'Mobile/Responsive', icon: Smartphone },
    { value: 'BROWSER_COMPATIBILITY', label: 'Browser Compatibility', icon: Monitor },
    { value: 'OTHER', label: 'Other', icon: Bug }
  ];

  const priorities = [
    { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const severities = [
    { value: 'MINOR', label: 'Minor', color: 'bg-green-100 text-green-800' },
    { value: 'MAJOR', label: 'Major', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-800' },
    { value: 'BLOCKER', label: 'Blocker', color: 'bg-red-200 text-red-900' }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${className}`}
      data-bug-widget
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-600" />
            {step === 'form' && 'Report a Bug'}
            {step === 'preview' && 'Review Bug Report'}
            {step === 'success' && 'Bug Report Submitted'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {step === 'form' && (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Bug Title *</Label>
                <Input
                  id="title"
                  value={report.title}
                  onChange={(e) => setReport(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief summary of the issue"
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {report.title.length}/200 characters
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={report.description}
                  onChange={(e) => setReport(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  maxLength={2000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {report.description.length}/2000 characters
                </div>
              </div>

              {/* Category, Priority, Severity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={report.category} onValueChange={(value) => setReport(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <cat.icon className="h-4 w-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={report.priority} onValueChange={(value) => setReport(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <Badge variant="secondary" className={priority.color}>
                            {priority.label}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={report.severity} onValueChange={(value) => setReport(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severities.map((severity) => (
                        <SelectItem key={severity.value} value={severity.value}>
                          <Badge variant="secondary" className={severity.color}>
                            {severity.label}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Steps to Reproduce */}
              <div>
                <Label htmlFor="steps">Steps to Reproduce</Label>
                <Textarea
                  id="steps"
                  value={report.stepsToReproduce}
                  onChange={(e) => setReport(prev => ({ ...prev, stepsToReproduce: e.target.value }))}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. Expected vs actual result"
                  rows={3}
                  maxLength={1000}
                />
              </div>

              {/* Expected vs Actual Behavior */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expected">Expected Behavior</Label>
                  <Textarea
                    id="expected"
                    value={report.expectedBehavior}
                    onChange={(e) => setReport(prev => ({ ...prev, expectedBehavior: e.target.value }))}
                    placeholder="What should happen..."
                    rows={3}
                    maxLength={500}
                  />
                </div>

                <div>
                  <Label htmlFor="actual">Actual Behavior</Label>
                  <Textarea
                    id="actual"
                    value={report.actualBehavior}
                    onChange={(e) => setReport(prev => ({ ...prev, actualBehavior: e.target.value }))}
                    placeholder="What actually happens..."
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-3">
                <Label>Attachments</Label>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleScreenshot}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    Screenshot
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach Files
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.log"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* File List */}
                {(report.screenshots.length > 0 || report.files.length > 0) && (
                  <div className="space-y-2">
                    {report.screenshots.map((file, index) => (
                      <div key={`screenshot-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="secondary">Screenshot</Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, 'screenshots')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {report.files.map((file, index) => (
                      <div key={`file-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, 'files')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('preview')}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Submit Report
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Bug Report Submitted Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for helping us improve VASA. Our team will review your report and get back to you.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={resetForm}>
                  Submit Another
                </Button>
                <Button onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Floating Bug Report Button
export const BugReportButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 shadow-lg ${className}`}
        title="Report a Bug"
      >
        <Bug className="h-6 w-6" />
      </Button>

      <BugReportWidget
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(report) => {
          console.log('Bug report submitted:', report);
          // Handle successful submission
        }}
      />
    </>
  );
};

export default BugReportWidget;
