import * as React from "react";

interface ContextualTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  type?: string;
  showIcon?: boolean;
  className?: string;
}

// Ultra-simple tooltip component that just passes through children
const ContextualTooltip: React.FC<ContextualTooltipProps> = ({
  children,
  content,
  type,
  showIcon,
  className,
}) => {
  // For now, just render children with a simple title attribute
  return (
    <span 
      className={className} 
      title={typeof content === 'string' ? content : 'Tooltip'}
    >
      {children}
    </span>
  );
};

// Simple placeholder exports
const PaymentTooltip: React.FC<any> = (props) => {
  return <span>💳</span>;
};

const ComplianceTooltip: React.FC<any> = (props) => {
  return <span>📋</span>;
};

const DeliveryTooltip: React.FC<any> = (props) => {
  return <span>🚚</span>;
};

const FormFieldTooltip: React.FC<{
  children: React.ReactNode;
  label: string;
  tooltip?: any;
  required?: boolean;
  className?: string;
}> = ({ 
  children, 
  label, 
  required,
  className 
}) => {
  return (
    <div className={className}>
      <div>
        <label>
          {label}
          {required && <span style={{color: 'red'}}> *</span>}
        </label>
      </div>
      {children}
    </div>
  );
};

const QuickHelp: React.FC<any> = (props) => {
  return <span>❓</span>;
};

const TooltipContentTemplates = {};

export {
  ContextualTooltip,
  PaymentTooltip,
  ComplianceTooltip,
  DeliveryTooltip,
  FormFieldTooltip,
  QuickHelp,
  TooltipContentTemplates
};
