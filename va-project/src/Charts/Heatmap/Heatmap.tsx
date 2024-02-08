import { useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import React from "react";
import { useDimensions } from "../../Utilities/useDimensions.ts";
import { InteractionDataHeatmap, TooltipHeatmap } from "./TooltipHeatmap.tsx";
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
  const [hovered, setHovered] = useState<InteractionDataHeatmap | null>(null);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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


  const clickItem = (d) => {
    console.log("d: ", d)
  }
  

  // Determine if filters are active
  const isDayFiltered = selectedDay !== null;
  const isTimeFiltered = selectedTime !== null;

  // Build the rectangles
  const allRects = data.map((d, i) => {
    const isDaySelected = selectedDay && selectedDay === d.day;
    const isTimeSelected = selectedTime && selectedTime === d.time;

    const isHighlighted = isDaySelected || isTimeSelected

    // Apply normal color scale when no filters are active
    let fill = colorScale(d.accidents);

    // If day filter is active, highlight selected day's line
    // If time filter is active, highlight selected time's interval
    if (isDayFiltered || isTimeFiltered) {
      fill = isHighlighted ? colorScale(d.accidents) : "grey";
    }
    
    return (
      <rect
        key={i}
        r={4}
        x={xScale(d.time)}
        y={yScale(d.day)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={fill}
        rx={5}
        stroke={"white"}
        onMouseEnter={() => {
          setHovered({
            xPos: xScale(d.time),
            yPos: yScale(d.day),
            name: (
              <>
                  # Accidents: {d.accidents}
              </>
          ),
          })
        }}
        onClick={() => clickItem(d)}
        onMouseLeave={() => setHovered(null)}
      />
    );
  });

  const clickTimeBounds = (event) => {
    const name = event.target.textContent;
    setSelectedTime((prev) => (prev === name ? null : name)); // Toggle selection
  };

  const clickDays = (event) => {
    const name = event.target.textContent;
    setSelectedDay((prev) => (prev === name ? null : name)); // Toggle selection
  };

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
        onClick={clickTimeBounds}
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
        onClick={clickDays}
      >
        {name}
      </text>
    );
  });

  return (
    <div className="Chart"> 
      <div className="HeatmapScaleContainer">
        <h5>
          {min}
        </h5>
        <div className="Scale"></div>
        <h5>
          {max}
        </h5>
      </div>
      <div className="HeatmapChart" ref={chartRef}>
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
        {/* Tooltip */}
        <div
            style={{
            width: "-webkit-fill-available",
            height: "-webkit-fill-available",
            position: "absolute",
            pointerEvents: "none",
            margin:margin
            }}
        >
            <TooltipHeatmap interactionData={hovered} />    
        </div>  
      </div>
    </div>
  );
};
