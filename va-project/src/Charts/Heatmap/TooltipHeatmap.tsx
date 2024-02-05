import React, { ReactNode } from "react";
import "./tooltipHeatmap.css";

// Information needed to build the tooltip
export type InteractionDataHeatmap = {
  xPos: number;
  yPos: number;
  name: ReactNode;
};

type TooltipProps = {
  interactionData: InteractionDataHeatmap | null;
};

export const TooltipHeatmap = ({ interactionData }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    <div
      className="tooltipHeatmap"
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos,
      }}
    >
      {interactionData.name}
    </div>
  );
};
