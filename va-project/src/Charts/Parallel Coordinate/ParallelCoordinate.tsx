import * as d3 from "d3";
import { AxisVertical } from "./AxisVertical.tsx";
import React, { useRef } from "react";
import { useDimensions } from "../../Utilities/useDimensions.ts";
import "../Charts.css"

const MARGIN = { top: 60, right: 80, bottom: 30, left: 80 };

const COLORS = [
  "#e0ac2b",
  "#d3d3d3"
];

//DATA TYPES
type Variable = "Junction_Control" | "Junction_Detail" | "Light_Conditions" | "Road_Surface_Conditions" | "Road_Type" | "Vehicle_Type" | "Weather_Conditions"


type ParallelCoordinateProps = {
  margin: number;
  variables: Variable[];
  FULLDATA : [];
  Data: [];
  addFilter: Function;
  removeFilter: Function;
  updateFilter: Function;
};

type DataItem<T extends string> = {
  [key in T]: number
} & {
  group: string
}

type Data = DataItem<Variable>[]

type YScale = d3.ScaleLinear<number, number, never>;

export const ParallelCoordinate = ({
  margin = 20,
  variables = ["Junction_Control","Junction_Detail","Light_Conditions","Road_Surface_Conditions","Road_Type","Vehicle_Type","Weather_Conditions"],
  Data,
  FULLDATA,
  addFilter,
  removeFilter,
  updateFilter
}: ParallelCoordinateProps) => {
  var data : DataItem<Variable>[] = []
  //Model data 
  

  Data.map((d,i) => {
    var newEntry:DataItem<Variable> = {"Junction_Control":0,"Junction_Detail":0,"Light_Conditions":0,"Road_Surface_Conditions":0,"Road_Type":0,"Vehicle_Type":0,"Weather_Conditions":0,"group":"A"}
    variables.map((v,i) => {
      newEntry[v] = d[i]
    })
    data.push(newEntry)
  })

  if(Data.length != FULLDATA.length){

    FULLDATA.map((d,i) => {
    
      var newEntry:DataItem<Variable> = {"Junction_Control":0,"Junction_Detail":0,"Light_Conditions":0,"Road_Surface_Conditions":0,"Road_Type":0,"Vehicle_Type":0,"Weather_Conditions":0,"group":"B"}
      variables.map((v,i) => {
        newEntry[v] = d[i]
      })
      
      //var idToCheck = d[7]
      var include = false;
      for (let index = 0; index < Data.length; index++) {
        const element = Data[index];
        if(element[7] === d[7])
          include = true
      }

      if(!include)
        data.push(newEntry)
    })
  }


  //needed for responsive dimensions
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  // bounds = area inside the axis
  const boundsWidth = chartSize.width - MARGIN.right - MARGIN.left;
  const boundsHeight = chartSize.height - MARGIN.top - MARGIN.bottom;

  const allGroups = [...new Set(data.map((d) => d.group))];
  console.log(data.length)
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

    return <path key={i}  z={series.group === "A"? 10 : 1} d={d} style={{zIndex: series.group === "A"? "10" : "1" }} stroke={series.group === "A"? COLORS[0] : COLORS[1]} fill="none" strokeOpacity={series.group === "A"? 1 : 0.1} strokeWidth={series.group === "A"? 1 : 0.1}/>;
  });

  // Compute Axes
  const allAxes = variables.map((variable, i) => {
    const yScale = yScales[variable];
    return (
      <g key={i} transform={"translate(" + xScale(variable) + ",0)"}>
        <AxisVertical yScale={yScale} pixelsPerTick={40} name={variable} filterName={variable} addFilter={addFilter} removeFilter={removeFilter} updateFilter={updateFilter}/>
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
