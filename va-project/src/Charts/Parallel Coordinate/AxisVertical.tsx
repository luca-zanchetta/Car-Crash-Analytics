import { useEffect, useMemo, useRef, useState } from "react";
import { filter, scaleLinear } from "d3";
import React from "react";

type AxisVerticalProps = {
  yScale: scaleLinear<number, number>;
  pixelsPerTick: number;
  name: string;
  addFilter: Function;
  removeFilter: Function;
  filterName: string;
};

const TICK_LENGTH = 3;

export const AxisVertical = ({
  yScale,
  pixelsPerTick,
  name,
  addFilter,
  removeFilter,
  filterName
}: AxisVerticalProps) => {
  
  const [brushPoint, setBrushPoint] = useState(0)
  const [BrushedPoints, setBrushedPoint] = useState([])
  const [brushCurrent, setCurrent] = useState(0)
  const [isBrushing, setBrushing] = useState(false)
  const xy = useRef(null)
  const brushRect = useRef(null)
  var rect = (<div></div>)

  function onMouseDown(e) {
    setBrushing(true)
    //store the first point clicked by the user
    var yClick = e["clientY"]
    setBrushPoint(yClick)
    setBrushedPoint([])
    setCurrent(0)
    //register two one time events
    document.addEventListener("mousemove",brushing)
    document.addEventListener("mouseup",(e) => onMouseUp(e,yClick), {once:true})
  }

  function brushing(e) {
    //get the current y of the mouse
    setCurrent(e["clientY"])
    //get the Top most point of the Line
  }

  function resetBrush() {
    removeFilter(BrushedPoints)
    setBrushPoint(0)
    setBrushedPoint([])
    setCurrent(0)
  }

  function onMouseUp(e,yClick) {
    document.removeEventListener("mousemove",brushing)
    
    var yLine = xy.current.getBoundingClientRect()["y"]
    var _brushPoint = e['clientY']
    //the idea is to continuosly check which point we are brushing
    var min = 0 
    var max = 0

    if(brushCurrent < _brushPoint){
      min = yClick
      max = _brushPoint
    }else {
      min = _brushPoint
      max = yClick
    }
    
    var brushedPoints = []
    
    for (let index = 0; index < ticks.length; index++) {
      const element = ticks[index];
      var value = element["value"]
      var yOffset = element["yOffset"]

      var tickPosition = yLine + yOffset
      
      if(tickPosition <= max && tickPosition >= min){
        brushedPoints.push([filterName,value])
      }
        
    }
    addFilter(brushedPoints)
    setBrushedPoint(brushedPoints)
    // document.getElementById(filterName)?.removeEventListener("click", () => resetBrush(BrushedPoints))
    // document.getElementById(filterName)?.addEventListener("click", () => resetBrush(brushedPoints))
  }

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
      {
        brushCurrent !=  0 && brushPoint != 0 &&
        <rect 
              onClick={resetBrush}
              id={filterName}
              transform={`translate(${-10}, 0)`}
              ref={brushRect}
              cursor={"move"}
              fill="rgb(119, 119, 119)"
              fillOpacity="0.3"
              stroke= "rgb(255, 255, 255)"
              width={20}
              height={ Math.abs(brushCurrent - brushPoint)}
              y = {(Math.min(brushCurrent,brushPoint) - xy.current.getBoundingClientRect()["y"])}
            ></rect>}
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
        strokeWidth={2}
        onMouseDown={onMouseDown}
        cursor={"pointer"}
        ref={xy}
        
      />

      {/* Ticks and labels */}
      {ticks.map(({ value, yOffset }) => (
        <g
          key={value}
          transform={`translate(0, ${yOffset})`}
          shapeRendering={"crispEdges"}   
        >
          <line x1={-TICK_LENGTH} x2={0} stroke="white" strokeWidth={1} />
          <text
            key={value}
            
            style={{
              fontSize: ".5vw",
              textAnchor: "middle",
              alignmentBaseline: "central",
              transform: "translateX(-.5vw)",
              fill:"white",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};
