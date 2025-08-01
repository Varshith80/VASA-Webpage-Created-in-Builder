import React from "react";

// Simple stub component to prevent import errors
export const ContextualTooltip: React.FC<{
  children: React.ReactNode;
  content?: any;
  type?: any;
  showIcon?: any;
  className?: any;
}> = ({ children }) => {
  return <>{children}</>;
};

// Simple stubs for other exports
export const QuickHelp: React.FC<any> = () => null;
export const PaymentTooltip: React.FC<any> = () => null;
export const ComplianceTooltip: React.FC<any> = () => null;
export const DeliveryTooltip: React.FC<any> = () => null;
export const FormFieldTooltip: React.FC<any> = ({ children }) => <>{children}</>;
export const TooltipContentTemplates = {};
