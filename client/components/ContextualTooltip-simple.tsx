import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  delayDuration = 300,
}: ContextualTooltipProps) {
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
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

// Export other components as placeholders for now
export function PaymentTooltip({ className }: { type: string; className?: string }) {
  return <span className={className}>💳</span>;
}

export function ComplianceTooltip({ className }: { country: string; productCategory: string; className?: string }) {
  return <span className={className}>📋</span>;
}

export function DeliveryTooltip({ className }: { estimatedDays: number; shippingMethod: string; className?: string }) {
  return <span className={className}>🚚</span>;
}

export function FormFieldTooltip({ children, label, required, className }: { 
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
