import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Import icons explicitly to avoid tree-shaking issues
import { 
  HelpCircle, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  Shield,
  CreditCard,
  FileText,
  Truck,
  Clock,
  Star
} from "lucide-react";

interface ContextualTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  type?: "info" | "help" | "warning" | "success" | "security";
  side?: "top" | "right" | "bottom" | "left";
  showIcon?: boolean;
  className?: string;
  delayDuration?: number;
}

export function ContextualTooltip({
  children,
  content,
  type = "info",
  side = "top",
  showIcon = true,
  className,
  delayDuration = 300,
}: ContextualTooltipProps) {
  
  // Render icon based on type with explicit component mapping
  const renderIcon = () => {
    if (!showIcon) return null;
    
    const iconClassName = cn("h-4 w-4", getColorForType(type));
    
    switch (type) {
      case "info":
        return <Info className={iconClassName} />;
      case "help":
        return <HelpCircle className={iconClassName} />;
      case "warning":
        return <AlertCircle className={iconClassName} />;
      case "success":
        return <CheckCircle className={iconClassName} />;
      case "security":
        return <Shield className={iconClassName} />;
      default:
        return <Info className={iconClassName} />;
    }
  };

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1 cursor-help",
            className,
          )}
        >
          {children}
          {renderIcon()}
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

function getColorForType(type: string): string {
  switch (type) {
    case "info":
      return "text-blue-600 dark:text-blue-400";
    case "help":
      return "text-gray-600 dark:text-gray-400";
    case "warning":
      return "text-yellow-600 dark:text-yellow-400";
    case "success":
      return "text-green-600 dark:text-green-400";
    case "security":
      return "text-purple-600 dark:text-purple-400";
    default:
      return "text-blue-600 dark:text-blue-400";
  }
}

// Pre-built tooltip content for common use cases
export const TooltipContentTemplates = {
  // Payment-related tooltips
  paymentMilestones: (
    <div className="space-y-2">
      <div className="font-medium">3-Step Payment System</div>
      <div className="text-sm space-y-1">
        <div>• 10% advance payment to secure order</div>
        <div>• 50% payment when goods are shipped</div>
        <div>• 40% final payment upon delivery</div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        This protects both buyer and seller throughout the transaction.
      </div>
    </div>
  ),

  escrowProtection: (
    <div className="space-y-2">
      <div className="font-medium flex items-center gap-1">
        <Shield className="h-4 w-4" />
        Escrow Protection
      </div>
      <div className="text-sm">
        Your payment is held securely until delivery is confirmed. If there are issues, 
        our dispute resolution team will help resolve them fairly.
      </div>
    </div>
  ),

  // KYC and verification tooltips
  kycVerification: (
    <div className="space-y-2">
      <div className="font-medium">KYC Verification Required</div>
      <div className="text-sm space-y-1">
        <div>• Government-issued ID</div>
        <div>• Business registration certificate</div>
        <div>• Trade license (IEC/EIN/VAT)</div>
        <div>• Bank account verification</div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        This ensures all traders are legitimate and builds trust in the platform.
      </div>
    </div>
  ),

  // Trust and safety tooltips
  verifiedSeller: (
    <div className="space-y-2">
      <div className="font-medium flex items-center gap-1">
        <CheckCircle className="h-4 w-4 text-green-600" />
        Verified Seller
      </div>
      <div className="text-sm">
        This seller has completed KYC verification, submitted required documents, 
        and maintains good standing on the platform.
      </div>
    </div>
  ),

  trustScore: (
    <div className="space-y-2">
      <div className="font-medium flex items-center gap-1">
        <Star className="h-4 w-4" />
        Trust Score
      </div>
      <div className="text-sm">
        Based on transaction history, customer feedback, delivery performance, 
        and compliance with platform policies.
      </div>
    </div>
  ),
};

// Specialized tooltip components for common scenarios
interface PaymentTooltipProps {
  type: "advance" | "shipment" | "delivery" | "escrow";
  className?: string;
}

export function PaymentTooltip({ type, className }: PaymentTooltipProps) {
  const content = {
    advance: "Pay 10% advance to secure your order and start production",
    shipment: "Pay 50% when goods are shipped with tracking number",
    delivery: "Pay remaining 40% upon confirmed delivery",
    escrow: "Your payment is protected in escrow until delivery confirmation",
  };

  return (
    <ContextualTooltip
      content={content[type]}
      type="security"
      className={className}
    >
      <CreditCard className="h-4 w-4" />
    </ContextualTooltip>
  );
}

interface ComplianceTooltipProps {
  country: string;
  productCategory: string;
  className?: string;
}

export function ComplianceTooltip({ country, productCategory, className }: ComplianceTooltipProps) {
  const content = (
    <div className="space-y-2">
      <div className="font-medium">Compliance Information</div>
      <div className="text-sm">
        <div>Destination: {country}</div>
        <div>Category: {productCategory}</div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Click to view detailed requirements and restrictions.
      </div>
    </div>
  );

  return (
    <ContextualTooltip content={content} type="info" className={className}>
      <FileText className="h-4 w-4" />
    </ContextualTooltip>
  );
}

interface DeliveryTooltipProps {
  estimatedDays: number;
  shippingMethod: string;
  className?: string;
}

export function DeliveryTooltip({ estimatedDays, shippingMethod, className }: DeliveryTooltipProps) {
  const content = (
    <div className="space-y-2">
      <div className="font-medium flex items-center gap-1">
        <Truck className="h-4 w-4" />
        Delivery Information
      </div>
      <div className="text-sm">
        <div>Method: {shippingMethod}</div>
        <div>Estimated: {estimatedDays} days</div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Delivery time may vary based on customs clearance and local conditions.
      </div>
    </div>
  );

  return (
    <ContextualTooltip content={content} type="info" className={className}>
      <Clock className="h-4 w-4" />
    </ContextualTooltip>
  );
}

// Form field tooltip wrapper
interface FormFieldTooltipProps {
  children: React.ReactNode;
  label: string;
  tooltip: string | React.ReactNode;
  required?: boolean;
  className?: string;
}

export function FormFieldTooltip({ 
  children, 
  label, 
  tooltip, 
  required = false, 
  className 
}: FormFieldTooltipProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <ContextualTooltip content={tooltip} type="help" showIcon>
          <span></span>
        </ContextualTooltip>
      </div>
      {children}
    </div>
  );
}

// Quick help tooltip for complex features
interface QuickHelpProps {
  title: string;
  steps: string[];
  className?: string;
}

export function QuickHelp({ title, steps, className }: QuickHelpProps) {
  const content = (
    <div className="space-y-2 max-w-sm">
      <div className="font-medium">{title}</div>
      <div className="text-sm space-y-1">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-muted-foreground">{index + 1}.</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ContextualTooltip
      content={content}
      type="help"
      side="left"
      className={className}
    >
      <Badge variant="outline" className="cursor-help">
        <HelpCircle className="h-3 w-3 mr-1" />
        How to
      </Badge>
    </ContextualTooltip>
  );
}
