import * as React from "react";
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
  side = "top",
  className,
}: ContextualTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg",
            "max-w-xs whitespace-normal",
            {
              "bottom-full left-1/2 transform -translate-x-1/2 mb-1": side === "top",
              "top-full left-1/2 transform -translate-x-1/2 mt-1": side === "bottom",
              "right-full top-1/2 transform -translate-y-1/2 mr-1": side === "left",
              "left-full top-1/2 transform -translate-y-1/2 ml-1": side === "right",
            }
          )}
        >
          {content}
          <div 
            className={cn(
              "absolute w-0 h-0",
              {
                "top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900": side === "top",
                "bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900": side === "bottom",
                "top-1/2 left-full transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900": side === "left",
                "top-1/2 right-full transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900": side === "right",
              }
            )}
          />
        </div>
      )}
    </div>
  );
}

// Export other components as simple placeholders
export function PaymentTooltip({ className }: { type: string; className?: string }) {
  return <span className={className}>💳</span>;
}

export function ComplianceTooltip({ className }: { country: string; productCategory: string; className?: string }) {
  return <span className={className}>📋</span>;
}

export function DeliveryTooltip({ className }: { estimatedDays: number; shippingMethod: string; className?: string }) {
  return <span className={className}>🚚</span>;
}

export function FormFieldTooltip({ 
  children, 
  label, 
  required, 
  className 
}: { 
  children: React.ReactNode; 
  label: string; 
  tooltip: string | React.ReactNode; 
  required?: boolean; 
  className?: string; 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {children}
    </div>
  );
}

export function QuickHelp({ title, steps, className }: { title: string; steps: string[]; className?: string }) {
  return <span className={className}>❓</span>;
}

export const TooltipContentTemplates = {};
