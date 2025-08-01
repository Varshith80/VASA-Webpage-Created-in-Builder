import React from "react";

// Simple test component to verify React is working correctly
export const DebugTest: React.FC = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'green', 
      color: 'white', 
      padding: '5px 10px',
      fontSize: '12px',
      borderRadius: '4px',
      zIndex: 9999
    }}>
      ✅ React Loading OK
    </div>
  );
};
