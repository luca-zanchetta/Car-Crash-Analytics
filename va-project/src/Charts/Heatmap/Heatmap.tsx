import { useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import React from "react";
import { useDimensions } from "../../Utilities/useDimensions.ts";
import { InteractionDataHeatmap, TooltipHeatmap } from "./TooltipHeatmap.tsx";
import "../Charts.css"
import { columns } from "../../App.js";


const MARGIN = { top: 10, right: 10, bottom: 30, left: 40 };

const Days = ["Monday", "Tuesday",  "Wednesday", "Thursday", "Friday",  "Saturday", "Sunday"]
const TimeBounds = ["0-3", "3-6", "6-9", "9-12", "12-15", "15-18", "18-21", "21-24"]
type HeatmapProps = {
  Data: [];
  addFilter: Function;
  removeFilter: Function;
};

type HeatmapData = {
    time: string;
    day: string;
    accidents: number;
}

export const Heatmap = ({Data, addFilter, removeFilter}: HeatmapProps) => {
  var data : HeatmapData[] = []
  const [hovered, setHovered] = useState<InteractionDataHeatmap | null>(null);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [singleItemSelected, setSingleItemSelected] = useState<number | null>(null)

  Days.map((D,j) => {
      TimeBounds.map((T,i) => {data.push({time:T, day:D, accidents:0})})
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
  const boundsWidth = chartSize.width - MARGIN.right - MARGIN.left;
  const boundsHeight = chartSize.height - MARGIN.top - MARGIN.bottom;

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
  

  // Determine if filters are active
  const isDayFiltered = selectedDays.length > 0
  const isTimeFiltered = selectedTimes.length > 0
  const isSingleItemSelected = singleItemSelected !== null

  // Build the rectangles
  const allRects = data.map((d, i) => {
    const isDaySelected = selectedDays.includes(d.day);
    const isTimeSelected = selectedTimes.includes(d.time);

    const isHighlighted = isDaySelected || isTimeSelected

    // Apply normal color scale when no filters are active
    let fill = colorScale(d.accidents);

    // If day filter is active, highlight selected day's line
    // If time filter is active, highlight selected time's interval
    if (isSingleItemSelected) {
      fill = singleItemSelected === i ? colorScale(d.accidents) : "grey";
    }
    else if (isDayFiltered || isTimeFiltered) {
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
        onMouseLeave={() => setHovered(null)}
      />
    );
  });

  const clickTimeBounds = (event) => {
    const name = event.target.textContent;
    setSelectedTimes((prevTimes) => {
      // Toggle selection
      if(prevTimes.includes(name)) {
        removeFilter([[columns.Time_Interval, name]])
      }
      else {
        addFilter([[columns.Time_Interval, name]])
      }
      return prevTimes.includes(name)
        ? prevTimes.filter((time) => time !== name)
        : [...prevTimes, name];
    });
  };

  const clickDays = (event) => {
    const name = event.target.id;
    setSelectedDays((prevDays) => {
      // Toggle selection
      if (prevDays.includes(name)) {
        removeFilter([[columns.Day, name]])
      }
      else {
        addFilter([[columns.Day, name]])
      }
      return prevDays.includes(name)
        ? prevDays.filter((day) => day !== name)
        : [...prevDays, name];
    });
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
        className="heatmapText"
      >
        {name}
      </text>
    );
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name) ?? 0;
    return (
      <text
        id={name}
        key={i}
        x={-5}
        y={yPos + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={11}
        fill="white"
        cursor="pointer"
        onClick={clickDays}
        className="heatmapText"
      >
        {(name.charAt(0) + name.charAt(1) + name.charAt(2)).toUpperCase() }
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
            transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
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
            margin:50
            }}
        >
            <TooltipHeatmap interactionData={hovered} />    
        </div>  
      </div>
    </div>
  );
};
