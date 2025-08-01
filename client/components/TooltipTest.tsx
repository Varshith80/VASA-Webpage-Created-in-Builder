import React from "react";
import { ContextualTooltip } from "./ContextualTooltip";

export function TooltipTest() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Tooltip Test</h3>
      <ContextualTooltip content="This is a test tooltip">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Hover me for tooltip
        </button>
      </ContextualTooltip>
    </div>
  );
}
