import * as d3 from "d3";
import { AxisVertical } from "../Charts/AxisVertical.tsx";
import { Data } from "./data";
import React, { useRef } from "react";
import { useDimensions } from "../Utilities/useDimensions.ts";

const MARGIN = { top: 60, right: 40, bottom: 30, left: 40 };

const COLORS = [
  "#e0ac2b",
  "#e85252",
  "#6689c6",
  "#9a6fb0",
  "#a53253",
  "#69b3a2",
];

type ParallelCoordinateProps = {
  width: number;
  height: number;
  data: Data;
  variables: Variable[];
};

type YScale = d3.scaleLinear<number, number, never>;
type Variable = "sepalLength" | "sepalWidth" | "petalLength" | "petalWidth";

export const ParallelCoordinate = ({
  width,
  height,
  data,
  variables,
}: ParallelCoordinateProps) => {

  //needed for responsive dimensions
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);
  
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allGroups = [...new Set(data.map((d) => d.group))];

  // Compute a xScale: spread all Y axis along the chart width
  const xScale = d3
    .scalePoint<Variable>()
    .range([0, boundsWidth])
    .domain(variables)
    .padding(0);

  // Compute the yScales: 1 scale per variable
  let yScales: { [name: string]: YScale } = {};
  variables.forEach((variable) => {
    yScales[variable] = d3
      .scaleLinear()
      .range([boundsHeight, 0])
      .domain([0, 8]);
  });

  // Color Scale
  const colorScale = d3.scaleOrdinal<string>().domain(allGroups).range(COLORS);

  // Compute lines
  const lineGenerator = d3.line();

  const allLines = data.map((series, i) => {
    const allCoordinates = variables.map((variable) => {
      const yScale = yScales[variable];
      const x = xScale(variable) ?? 0; // I don't understand the type of scalePoint. IMO x cannot be undefined since I'm passing it something of type Variable.
      const y = yScale(series[variable]);
      const coordinate: [number, number] = [x, y];
      return coordinate;
    });

    const d = lineGenerator(allCoordinates);

    if (!d) {
      return;
    }

    return <path key={i} d={d} stroke={colorScale(series.group)} fill="none" />;
  });

  // Compute Axes
  const allAxes = variables.map((variable, i) => {
    const yScale = yScales[variable];
    return (
      <g key={i} transform={"translate(" + xScale(variable) + ",0)"}>
        <AxisVertical yScale={yScale} pixelsPerTick={40} name={variable} />
      </g>
    );
  });

  return (
    <div className="Chart" ref={chartRef}>    
    <svg width={chartSize.width} height={chartSize.height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allLines}
        {allAxes}
      </g>
    </svg>
    </div>
  );
};
