import React from "react";

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
  className = "",
}: ContextualTooltipProps) {
  return (
    <div className={`relative inline-block ${className}`} title={typeof content === 'string' ? content : ''}>
      {children}
    </div>
  );
}

// Ultra-simple placeholder components
export function PaymentTooltip({ className = "" }: { type: string; className?: string }) {
  return <span className={className}>💳</span>;
}

export function ComplianceTooltip({ className = "" }: { country: string; productCategory: string; className?: string }) {
  return <span className={className}>📋</span>;
}

export function DeliveryTooltip({ className = "" }: { estimatedDays: number; shippingMethod: string; className?: string }) {
  return <span className={className}>🚚</span>;
}

export function FormFieldTooltip({ 
  children, 
  label, 
  required = false, 
  className = "" 
}: { 
  children: React.ReactNode; 
  label: string; 
  tooltip: string | React.ReactNode; 
  required?: boolean; 
  className?: string; 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
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

export function QuickHelp({ className = "" }: { title: string; steps: string[]; className?: string }) {
  return <span className={className}>❓</span>;
}

export const TooltipContentTemplates = {};
