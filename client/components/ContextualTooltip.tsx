import React from "react";

// Extremely simple components to avoid any export/import issues
function ContextualTooltip({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}

function QuickHelp() {
  return <span>❓</span>;
}

function PaymentTooltip() {
  return <span>💳</span>;
}

function ComplianceTooltip() {
  return <span>📋</span>;
}

function DeliveryTooltip() {
  return <span>🚚</span>;
}

function FormFieldTooltip({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

const TooltipContentTemplates = {};

export {
  ContextualTooltip,
  QuickHelp,
  PaymentTooltip,
  ComplianceTooltip,
  DeliveryTooltip,
  FormFieldTooltip,
  TooltipContentTemplates
};
