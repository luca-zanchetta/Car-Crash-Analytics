import { useMemo } from "react";
import { scaleLinear } from "d3";
import React from "react";

type AxisVerticalProps = {
  yScale: scaleLinear<number, number>;
  pixelsPerTick: number;
  name: string;
};

const TICK_LENGTH = 3;

export const AxisVertical = ({
  yScale,
  pixelsPerTick,
  name,
}: AxisVerticalProps) => {
  const range = yScale.range();

  const ticks = useMemo(() => {
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }));
  }, [yScale]);

  return (
    <>
      {/* Title */}
      <text
        x={0}
        y={-25}
        style={{
          fontSize: ".7vw",
          textAnchor: "middle",
          fill: "white",
        }}
      >
        {name}
      </text>

      {/* Vertical line */}
      <line
        x1={0}
        x2={0}
        y1={0}
        y2={yScale(range[1])}
        stroke="white"
        strokeWidth={0.5}
      />

      {/* Ticks and labels */}
      {ticks.map(({ value, yOffset }) => (
        <g
          key={value}
          transform={`translate(0, ${yOffset})`}
          shapeRendering={"crispEdges"}
        >
          <line x1={-TICK_LENGTH} x2={0} stroke="white" strokeWidth={0.5} />
          <text
            key={value}
            style={{
              fontSize: ".5vw",
              textAnchor: "middle",
              alignmentBaseline: "central",
              transform: "translateX(-.5vw)",
              fill:"white"
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};
