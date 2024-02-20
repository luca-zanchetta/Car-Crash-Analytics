import { useEffect, useMemo, useRef, useState } from "react";
import { filter, scaleLinear } from "d3";
import React from "react";


const junction_control_enc = ['Data missing or out of range', 'Give way or uncontrolled', 'Stop sign', 'Auto traffic signal', 'Authorised person'] 
const junction_detail_enc = ['Roundabout' ,'Other junction' ,'Crossroads', 'Mini-roundabout', 'More than 4 arms (not roundabout)' ,'Not at junction or within 20 metres', 'Slip road', 'T or staggered junction', 'Private drive or entrance']
const light_conditions_enc = ['Darkness - no lighting', 'Darkness - lights unlit', 'Darkness - lighting unknown', 'Daylight', 'Darkness - lights lit']
const road_surface_conditions_enc = ['Frost or ice', 'Snow', 'Wet or damp', 'Dry']
const road_type_enc = ['Roundabout', 'Dual carriageway', 'Single carriageway', 'One way street', 'Slip road']
const weather_conditions_enc = ['Snowing no high winds', 'Raining + high winds', 'Raining no high winds', 'Other', 'Fine no high winds', "nan", 'Fine + high winds']
const vehicle_Type_enc = ['Motorcycle', 'Car', 'Good', 'Other vehicle', 'Bus', 'Agricultural vehicle', 'Minibus']

const encodes = {"Junction_Control": junction_control_enc,"Junction_Detail":junction_detail_enc
, "Light_Conditions":light_conditions_enc,"Road_Surface_Conditions":road_surface_conditions_enc,"Road_Type": road_type_enc, "Weather_Conditions": weather_conditions_enc, "Vehicle_Type": vehicle_Type_enc}


type AxisVerticalProps = {
  yScale: scaleLinear<number, number>;
  pixelsPerTick: number;
  name: string;
  addFilter: Function;
  removeFilter: Function;
  filterName: string;
};

const TICK_LENGTH = 3;
const CLICK_SENSITIVITY = 200;
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
  const [brushOn, setBrushing] = useState(false)
  const [movingBrush,setMovingBrush] = useState(false)
  const xy = useRef(null)
  const brushRect = useRef(null)

  function onMouseDown(e) {
    if(brushOn) return
    
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
    setBrushing(false)
    setBrushPoint(0)
    setBrushedPoint([])
    setCurrent(0)
  }

  function onMouseUp(e,yClick) {
    document.removeEventListener("mousemove",brushing)
    setBrushing(true)
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
    if(brushedPoints.length === 0){
      setBrushing(false)
      resetBrush()
    }else{
      addFilter(brushedPoints)
      setBrushedPoint(brushedPoints)
    }
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

  // Brush moving
  function onBrushClick(e) {
    var startTime = new Date().getTime();
    e.target.addEventListener("mouseup",(e) => onBrushEndClick(e,startTime), {once:true})

    var cursorAbsY = e["clientY"]
    
    var offset = cursorAbsY - Math.min(brushCurrent,brushPoint) 
    setMovingBrush(true)
    document.addEventListener("mousemove", (e) => MoveBrush(e,offset,startTime),{once:true});
  }

  function MoveBrush(e,offset,startTime) {
    var currTime = new Date().getTime();
    var elapsedTime = currTime - startTime
    if(elapsedTime < CLICK_SENSITIVITY)
      return

    //make the brush move
    var clickY = e["clientY"]
    var y = Math.min(brushCurrent,brushPoint)
    
    var movement = clickY - y
    setBrushPoint(brushPoint + movement - offset)
    setCurrent(brushCurrent + movement - offset)
    if(movingBrush)
      document.addEventListener("mousemove", (e) => MoveBrush(e,offset,startTime),{once:true});
  }

  function onBrushEndClick(e,startTime) {
    setMovingBrush(false)
    var endTime = new Date().getTime();
    var elapsedTime = endTime - startTime
    if(elapsedTime < CLICK_SENSITIVITY)
      resetBrush() 
    else {
      var min = 0 
      var max = 0

      if(brushCurrent < brushPoint){
        min = brushCurrent
        max = brushPoint
      }else {
        min = brushPoint
        max = brushCurrent
      }
      
      var brushedPoints = []
      var yLine = xy.current.getBoundingClientRect()["y"]

      for (let index = 0; index < ticks.length; index++) {
        const element = ticks[index];
        var value = element["value"]
        var yOffset = element["yOffset"]

        var tickPosition = yLine + yOffset
        
        if(tickPosition <= max && tickPosition >= min){
          brushedPoints.push([filterName,value])
        }
          
      }
      removeFilter(BrushedPoints)
      addFilter(brushedPoints)
      setBrushedPoint(brushedPoints)
    }
  }

  return (
    <>
      {
        brushCurrent !=  0 && brushPoint != 0 &&
        <rect 
        style={{zIndex:'10',position:"relative"}}
        onMouseDown={onBrushClick}
        id={filterName}
        transform={`translate(${-10}, 0)`}
        ref={brushRect}
        cursor={"pointer"}
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
        pointerEvents={"none"}
        x1={0}
        x2={0}
        y1={0}
        y2={yScale(range[1])}
        stroke="white"
        strokeWidth={2}
        cursor={"pointer"}
        ref={xy}
      />
      { xy.current && !brushOn &&
      <rect
        style={{zIndex:"1",position:"relative"}}
        onMouseDown={onMouseDown}
        fill="rgb(119, 119, 119)"
        cursor={"pointer"}
        fillOpacity="0"
        stroke= "rgb(255, 255, 255,0)"
        width={20}
        y={0}
        height={xy.current.getBoundingClientRect()["bottom"] - xy.current.getBoundingClientRect()["y"]}
        transform={`translate(${-10}, 0)`}
      >
      </rect> }
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
           {encodes[name][value]}
        </text>
        </g>
      ))}
    </>
  );
};
