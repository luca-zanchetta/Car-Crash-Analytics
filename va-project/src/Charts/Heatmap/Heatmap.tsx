import { useMemo, useRef } from "react";
import * as d3 from "d3";
import React from "react";
import { useDimensions } from "../../Utilities/useDimensions.ts";
import "../Charts.css"

const Days = ["Monday","Tuesday",  "Wednesday", "Thursday", "Friday",  "Saturday", "Sunday"]
const TimeBounds = ["0-3","3-6","6-9","9-12","12-15", "15-18", "18-21", "21-24"]
type HeatmapProps = {
  Data: [];
  margin: number;
};

type HeatmapData = {
    time: string;
    day: string;
    accidents: number;
}

export const Heatmap = ({Data, margin = 50}: HeatmapProps) => {
  var data : HeatmapData[] = []

  Days.map((D,i) => {
      TimeBounds.map((T,i) => {data.push({time:T,day:D,accidents:0})})
  })

  Data.map((d,i) => {
      for (let index = 0; index < data.length; index++) {
          //Fascia oraria index 0, Giorno della settimana index 1
          if(data[index].day === d[1] && data[index].time === d[0])
              data[index].accidents++
      }
  })
  
  //needed for responsive dimensions
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  // bounds = area inside the axis
  const boundsWidth = chartSize.width - margin - margin;
  const boundsHeight = chartSize.height - margin - margin;

  // groups
  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.day))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.time))], [data]);

  // x and y scales
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [data, chartSize.width ]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);
  }, [data, chartSize.height]);

  var min = data[0].accidents, max = data[0].accidents

  data.map((d,i) => {
    if(d.accidents> max) max = d.accidents
    if(d.accidents< min) min = d.accidents
  })

  // Color scale
  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([min, max]);

  // Build the rectangles
  const allRects = data.map((d, i) => {
    return (
      <rect
        key={i}
        r={4}
        x={xScale(d.time)}
        y={yScale(d.day)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={colorScale(d.accidents)}
        rx={5}
        stroke={"white"}
      />
    );
  });

  const xLabels = allXGroups.map((name, i) => {
    const xPos = xScale(name) ?? 0;
    return (
      <text
        key={i}
        x={xPos + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
        fill="white"
        cursor="pointer"
      >
        {name}
      </text>
    );
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name) ?? 0;
    return (
      <text
        key={i}
        x={-5}
        y={yPos + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={11}
        fill="white"
        cursor="pointer"
      >
        {name}
      </text>
    );
  });

  return (
    <div className="Chart" ref={chartRef}>
      <svg width={chartSize.width} height={chartSize.height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[margin, margin].join(",")})`}
        >
          {allRects}
          {xLabels}
          {yLabels}
        </g>
      </svg>
    </div>
  );
};
