import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  CheckCircle,
  Star,
  ShoppingCart,
  Upload,
  CreditCard,
  Truck,
  FileCheck,
  MessageSquare,
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ReactNode;
  action?: {
    type: 'click' | 'hover' | 'scroll';
    text: string;
  };
  isOptional?: boolean;
}

interface OnboardingTourProps {
  userRole: 'importer' | 'exporter' | 'admin';
  isFirstTime?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

const importerSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to VASA!',
    description: 'Let\'s take a quick tour to help you get started with importing products from verified exporters worldwide.',
    target: 'body',
    position: 'bottom',
    icon: <Star className="h-5 w-5" />,
  },
  {
    id: 'search',
    title: 'Find Products',
    description: 'Use our global search to find products from verified exporters. Filter by category, country, price, and certifications.',
    target: '[data-tour="search"]',
    position: 'bottom',
    icon: <ShoppingCart className="h-5 w-5" />,
    action: { type: 'click', text: 'Try searching for a product' },
  },
  {
    id: 'product-details',
    title: 'Product Information',
    description: 'View detailed product specifications, seller information, certifications, and pricing. Check trust badges for verified sellers.',
    target: '[data-tour="product-card"]',
    position: 'top',
    icon: <FileCheck className="h-5 w-5" />,
  },
  {
    id: 'payment-system',
    title: 'Secure Payment Process',
    description: 'Our 3-step payment system protects your purchase: 10% advance, 50% on shipment, 40% on delivery.',
    target: '[data-tour="payment-info"]',
    position: 'left',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'order-tracking',
    title: 'Track Your Orders',
    description: 'Monitor your orders in real-time from placement to delivery. Get notifications at every milestone.',
    target: '[data-tour="orders"]',
    position: 'bottom',
    icon: <Truck className="h-5 w-5" />,
  },
  {
    id: 'messages',
    title: 'Communication',
    description: 'Communicate directly with exporters, share documents, and resolve queries through our secure messaging system.',
    target: '[data-tour="messages"]',
    position: 'bottom',
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'Access your personalized dashboard for order management, analytics, and account settings.',
    target: '[data-tour="dashboard"]',
    position: 'bottom',
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

const exporterSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to VASA!',
    description: 'Let\'s show you how to start selling your products to importers worldwide through our secure platform.',
    target: 'body',
    position: 'bottom',
    icon: <Star className="h-5 w-5" />,
  },
  {
    id: 'verification',
    title: 'Account Verification',
    description: 'Complete your KYC verification and trade license validation to build trust with potential buyers.',
    target: '[data-tour="verification"]',
    position: 'bottom',
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    id: 'add-products',
    title: 'List Your Products',
    description: 'Add your products with detailed specifications, competitive pricing, and quality certifications.',
    target: '[data-tour="add-product"]',
    position: 'bottom',
    icon: <Upload className="h-5 w-5" />,
    action: { type: 'click', text: 'Start adding your first product' },
  },
  {
    id: 'product-optimization',
    title: 'Optimize Listings',
    description: 'Use high-quality images, detailed descriptions, and competitive pricing to attract more buyers.',
    target: '[data-tour="product-form"]',
    position: 'right',
    icon: <FileCheck className="h-5 w-5" />,
  },
  {
    id: 'order-management',
    title: 'Manage Orders',
    description: 'Process incoming orders, update shipping information, and track payments through your order dashboard.',
    target: '[data-tour="orders"]',
    position: 'bottom',
    icon: <Truck className="h-5 w-5" />,
  },
  {
    id: 'analytics',
    title: 'Track Performance',
    description: 'Monitor your sales performance, customer feedback, and optimize your listings for better visibility.',
    target: '[data-tour="analytics"]',
    position: 'bottom',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: 'settings',
    title: 'Account Settings',
    description: 'Configure your payment preferences, notification settings, and business information.',
    target: '[data-tour="settings"]',
    position: 'bottom',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function OnboardingTour({ userRole, isFirstTime = true, onComplete, onSkip }: OnboardingTourProps) {
  const [isActive, setIsActive] = useState(isFirstTime);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tourPosition, setTourPosition] = useState({ top: 0, left: 0 });
  const tourCardRef = useRef<HTMLDivElement>(null);

  const steps = userRole === 'exporter' ? exporterSteps : importerSteps;
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    if (isActive) {
      // Check if user has seen the tour before
      const hasSeenTour = localStorage.getItem(`vasa-tour-${userRole}`);
      if (!hasSeenTour && isFirstTime) {
        setIsVisible(true);
        positionTourCard();
      } else {
        setIsActive(false);
      }
    }
  }, [isActive, userRole, isFirstTime]);

  useEffect(() => {
    if (isVisible) {
      positionTourCard();
      highlightTarget();
    }

    return () => {
      removeHighlight();
    };
  }, [currentStep, isVisible]);

  const positionTourCard = () => {
    const currentStepData = steps[currentStep];
    const targetElement = document.querySelector(currentStepData.target);
    
    if (!targetElement || !tourCardRef.current) return;

    const targetRect = targetElement.getBoundingClientRect();
    const cardRect = tourCardRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    switch (currentStepData.position) {
      case 'top':
        top = targetRect.top - cardRect.height - 20;
        left = targetRect.left + (targetRect.width - cardRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + 20;
        left = targetRect.left + (targetRect.width - cardRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - cardRect.height) / 2;
        left = targetRect.left - cardRect.width - 20;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - cardRect.height) / 2;
        left = targetRect.right + 20;
        break;
    }

    // Ensure the card stays within viewport bounds
    if (left < 10) left = 10;
    if (left + cardRect.width > viewportWidth - 10) {
      left = viewportWidth - cardRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + cardRect.height > viewportHeight - 10) {
      top = viewportHeight - cardRect.height - 10;
    }

    setTourPosition({ top, left });
  };

  const highlightTarget = () => {
    removeHighlight(); // Remove previous highlight

    const currentStepData = steps[currentStep];
    const targetElement = document.querySelector(currentStepData.target);
    
    if (!targetElement) return;

    // Add highlight class
    targetElement.classList.add('onboarding-highlight');
    
    // Scroll element into view
    targetElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'center'
    });
  };

  const removeHighlight = () => {
    const highlightedElements = document.querySelectorAll('.onboarding-highlight');
    highlightedElements.forEach(el => el.classList.remove('onboarding-highlight'));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setIsActive(false);
    removeHighlight();
    
    // Mark tour as seen
    localStorage.setItem(`vasa-tour-${userRole}`, 'completed');
    
    if (onSkip) onSkip();
  };

  const completeTour = () => {
    setIsVisible(false);
    setIsActive(false);
    removeHighlight();
    
    // Mark tour as seen
    localStorage.setItem(`vasa-tour-${userRole}`, 'completed');
    
    if (onComplete) onComplete();
  };

  const startTour = () => {
    setIsActive(true);
    setIsVisible(true);
    setCurrentStep(0);
  };

  // Add CSS for highlighting
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .onboarding-highlight {
        position: relative;
        z-index: 1001;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5) !important;
        border-radius: 8px;
      }
      
      .onboarding-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isActive) {
    // Return a trigger button for restarting the tour
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={startTour}
        className="fixed bottom-4 right-4 z-50"
      >
        <Play className="h-4 w-4 mr-2" />
        Take Tour
      </Button>
    );
  }

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="onboarding-overlay" />
      
      {/* Tour Card */}
      <Card
        ref={tourCardRef}
        className="fixed z-[1002] w-80 shadow-xl border-2 border-primary/20"
        style={{
          top: `${tourPosition.top}px`,
          left: `${tourPosition.left}px`,
        }}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {currentStepData.icon}
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1} of {totalSteps}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <Progress value={progress} className="mb-4 h-2" />

          {/* Content */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">{currentStepData.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {currentStepData.description}
            </p>
            
            {currentStepData.action && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 Try it: {currentStepData.action.text}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="h-8"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 text-muted-foreground"
              >
                Skip Tour
              </Button>
              
              <Button
                size="sm"
                onClick={handleNext}
                className="h-8"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Hook for managing onboarding state
export function useOnboarding(userRole: 'importer' | 'exporter' | 'admin') {
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourStatus = localStorage.getItem(`vasa-tour-${userRole}`);
    setHasSeenTour(!!tourStatus);
    
    // Auto-show tour for first-time users
    if (!tourStatus) {
      setShowTour(true);
    }
  }, [userRole]);

  const startTour = () => setShowTour(true);
  const completeTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem(`vasa-tour-${userRole}`, 'completed');
  };

  return {
    hasSeenTour,
    showTour,
    startTour,
    completeTour,
  };
}

// Onboarding progress component
interface OnboardingProgressProps {
  userRole: 'importer' | 'exporter';
  user: {
    isVerified?: boolean;
    hasCompletedProfile?: boolean;
    hasAddedProducts?: boolean; // For exporters
    hasPlacedOrder?: boolean; // For importers
    hasUploadedDocuments?: boolean;
  };
  className?: string;
}

export function OnboardingProgress({ userRole, user, className }: OnboardingProgressProps) {
  const importerTasks = [
    { id: 'profile', label: 'Complete Profile', completed: user.hasCompletedProfile },
    { id: 'verify', label: 'Verify Account', completed: user.isVerified },
    { id: 'documents', label: 'Upload Documents', completed: user.hasUploadedDocuments },
    { id: 'order', label: 'Place First Order', completed: user.hasPlacedOrder },
  ];

  const exporterTasks = [
    { id: 'profile', label: 'Complete Profile', completed: user.hasCompletedProfile },
    { id: 'verify', label: 'Verify Account', completed: user.isVerified },
    { id: 'documents', label: 'Upload Documents', completed: user.hasUploadedDocuments },
    { id: 'products', label: 'Add Products', completed: user.hasAddedProducts },
  ];

  const tasks = userRole === 'exporter' ? exporterTasks : importerTasks;
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  if (progress === 100) return null; // Hide when fully completed

  return (
    <Card className={cn('border-l-4 border-l-primary', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Getting Started</h3>
          <Badge variant="secondary">
            {completedTasks}/{tasks.length} Complete
          </Badge>
        </div>
        
        <Progress value={progress} className="mb-3" />
        
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 text-sm">
              {task.completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4 border-2 border-muted-foreground rounded-full" />
              )}
              <span className={task.completed ? 'text-muted-foreground line-through' : ''}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
