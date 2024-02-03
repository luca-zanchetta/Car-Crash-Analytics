import React, { ReactNode } from "react";
import "./tooltip.css";

// Information needed to build the tooltip
export type InteractionData = {
  xPos: number;
  yPos: number;
  name: ReactNode;
};

type TooltipProps = {
  interactionData: InteractionData | null;
};

export const Tooltip = ({ interactionData }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    <div
      className="tooltip"
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos,
      }}
    >
      {interactionData.name}
    </div>
  );
};
