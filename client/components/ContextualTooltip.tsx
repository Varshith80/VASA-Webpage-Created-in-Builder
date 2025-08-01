import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

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
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    info: LucideIcons.Info,
    help: LucideIcons.HelpCircle,
    warning: LucideIcons.AlertCircle,
    success: LucideIcons.CheckCircle,
    security: LucideIcons.Shield,
  };

  const colorMap = {
    info: "text-blue-600 dark:text-blue-400",
    help: "text-gray-600 dark:text-gray-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    success: "text-green-600 dark:text-green-400",
    security: "text-purple-600 dark:text-purple-400",
  };

  const IconComponent = iconMap[type];

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
          {showIcon && IconComponent && (
            <IconComponent className={cn("h-4 w-4", colorMap[type])} />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
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
        Your payment is held securely until delivery is confirmed. If there are
        issues, our dispute resolution team will help resolve them fairly.
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
        This ensures all traders are legitimate and builds trust in the
        platform.
      </div>
    </div>
  ),

  // Shipping and logistics tooltips
  shippingTerms: (
    <div className="space-y-2">
      <div className="font-medium">Shipping Terms</div>
      <div className="text-sm space-y-1">
        <div>
          <strong>FOB:</strong> Free on Board
        </div>
        <div>
          <strong>CIF:</strong> Cost, Insurance, Freight
        </div>
        <div>
          <strong>DDP:</strong> Delivered Duty Paid
        </div>
        <div>
          <strong>EXW:</strong> Ex Works
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        These terms define who pays for shipping, insurance, and customs duties.
      </div>
    </div>
  ),

  // Product and quality tooltips
  qualityAssurance: (
    <div className="space-y-2">
      <div className="font-medium flex items-center gap-1">
        <CheckCircle className="h-4 w-4" />
        Quality Assurance
      </div>
      <div className="text-sm">
        Products undergo quality inspection before shipment. We offer sampling,
        third-party inspection, and quality guarantees.
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
        This seller has completed KYC verification, submitted required
        documents, and maintains good standing on the platform.
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

  // Compliance tooltips
  complianceCheck: (
    <div className="space-y-2">
      <div className="font-medium">Compliance Verification</div>
      <div className="text-sm">
        We automatically check trade regulations, restricted items, and
        documentation requirements for your destination country.
      </div>
    </div>
  ),

  // Currency and pricing tooltips
  currencyConversion: (
    <div className="space-y-2">
      <div className="font-medium">Live Currency Rates</div>
      <div className="text-sm">
        Prices are converted using real-time exchange rates. Final amount may
        vary slightly based on your bank's conversion rates.
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
      <LucideIcons.CreditCard className="h-4 w-4" />
    </ContextualTooltip>
  );
}

interface ComplianceTooltipProps {
  country: string;
  productCategory: string;
  className?: string;
}

export function ComplianceTooltip({
  country,
  productCategory,
  className,
}: ComplianceTooltipProps) {
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
      <LucideIcons.FileText className="h-4 w-4" />
    </ContextualTooltip>
  );
}

interface DeliveryTooltipProps {
  estimatedDays: number;
  shippingMethod: string;
  className?: string;
}

export function DeliveryTooltip({
  estimatedDays,
  shippingMethod,
  className,
}: DeliveryTooltipProps) {
  const content = (
    <div className="space-y-2">
      <div className="font-medium flex items-center gap-1">
        <LucideIcons.Truck className="h-4 w-4" />
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
      <LucideIcons.Clock className="h-4 w-4" />
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
  className,
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

// Contextual help examples for demonstration
export const helpExamples = {
  orderProcess: {
    title: "How to Place an Order",
    steps: [
      "Browse products and select your item",
      "Review seller information and trust badges",
      "Configure quantity and shipping details",
      "Pay 10% advance to secure the order",
      "Track your order through shipment and delivery",
      "Complete remaining payments at each milestone",
    ],
  },

  sellerVerification: {
    title: "How to Get Verified",
    steps: [
      "Upload government-issued ID",
      "Submit business registration documents",
      "Provide trade license (IEC/EIN/VAT)",
      "Verify bank account details",
      "Wait for admin review (24-48 hours)",
      "Receive verification badge and enhanced visibility",
    ],
  },

  paymentSecurity: {
    title: "Payment Security Features",
    steps: [
      "All payments held in secure escrow",
      "Funds released only upon delivery confirmation",
      "Dispute resolution available if needed",
      "Multiple payment methods supported",
      "Real-time transaction tracking",
      "Automatic refunds for cancelled orders",
    ],
  },
};
