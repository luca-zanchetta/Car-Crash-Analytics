import * as d3 from "d3";
import React, { useReducer, useRef, useState } from "react";
import { useDimensions } from "../../Utilities/useDimensions.ts";
import { AxisBottom } from "./XAxis_scatterplot.tsx";
import { AxisLeft } from "./YAxis_scatterplot.tsx";
import { InteractionData, Tooltip } from "./Tooltip.tsx";
import "../Charts.css"
import { brushX, select } from "d3";

type ScatterplotProps = {
    callbackMouseEnter: Function;
    margin : number;
    data : {x:number, y:number, severity:number}[];
    name?: string
};


export const Scatterplot = ({callbackMouseEnter, margin = 40,data= [{x: 2,y: 4, severity: 0},{x: 8,y: 5, severity: 0}]}:ScatterplotProps) => {

    const zoomContant = 1.1
    const scrollK = 2.5
    const [isDown, setDown] = useState(false)
    const [startCoord, setStartingCoord] = useState(null)
    const [zoomFactor, setZoomFactor] = useState(1)
    const [zoomXOffset, setXoffset] = useState(0)
    const [zoomYOffset, setYoffset] = useState(0)

    function MoveCamera(e) { 
        if(!isDown) return
        var x = e["movementX"];
        var y = e["movementY"];
        
        // var offX = x - startCoord[0]
        // var offY = y - startCoord[1]
        // var mod = Math.sqrt(offX*offX + offY*offY)
        // offX = offX/mod
        // offY = offY/mod

        setXoffset(zoomXOffset + x*scrollK)
        setYoffset(zoomXOffset + y*scrollK)
    }


    function OnMouseUp(e) {
        setDown(false)
    }
    function OnMouseDown(e) {
        setDown(true)
        console.log(e)
        setStartingCoord([e["clientX"] ,e["clientY"]])
    }
    function Zoom(e) {  
        if(e["deltaY"] < 0)
            setZoomFactor(zoomFactor/1.1)
        else
            setZoomFactor(zoomFactor*1.1)
    }


    //needed for responsive dimensions
    const chartRef = useRef(null);
    const chartSize = useDimensions(chartRef);
    //tooltip
    const [hovered, setHovered] = useState<InteractionData | null>(null);

    const svgRef = useRef()
    const svg = select(svgRef.current)

    const boundsWidth = chartSize.width - margin - margin;
    const boundsHeight = chartSize.height - margin - margin;

    // Search for the maximum value for x and y
    var max_x = 0, max_y = 0
    data.map((d, i) => {    
        if(max_x < d[0]) 
        max_x = parseInt(d[0])

        if(max_y < d[1]) 
        max_y = parseInt(d[1])
    })

    // Search for the minimum value for x and y
    var min_x = 0, min_y = 0
    data.map((d, i) => {
        if(min_x > d[0])
            min_x = parseInt(d[0])

        if(min_y > d[1])
            min_y = parseInt(d[1])
    })
    
    const y = d3.scaleLinear().domain([(min_y * zoomFactor) + zoomYOffset, (max_y* zoomFactor) + zoomYOffset]).range([boundsHeight-10, 0]);
    const x = d3.scaleLinear().domain([(min_x* zoomFactor) + zoomXOffset, (max_x* zoomFactor) + zoomXOffset]).range([5, boundsWidth-10]);

    // Build the shapes
    const allShapes = data.map((d, i) => {
        // Change color based on the severity of the single accident
        var color = ""

        switch(d[2]) {
            case "0":
                color = "lightgreen"
                break
            case "1":
                color = "yellow"
                break
            case "2":
                color = "red"
                break
            default:
                color = "#cb1dd1"
        }

        return (
        <circle
            key={i}
            r={1}
            cx={x(d[0])}
            cy={y(d[1])}
            opacity={1}
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            strokeWidth={1}
            onMouseEnter={() =>{
                callbackMouseEnter();
                setHovered({
                  xPos: x(d[0]),
                  yPos: y(d[1]),
                  name: (
                    <>
                        Number of Causalities: {d[3]}<br />
                        Number of Vehicles: {d[4]}<br />
                        Speed limit: {d[5]}<br />
                    </>
                ),
                })}
              }
              onMouseLeave={() => setHovered(null)}
        />
        );
    });

    // Brush logic
    const brush = brushX().extent([
        [0, 0],
        [boundsWidth, boundsHeight]
    ]).on("start brush end", (event) => {
        if(event.selection) {
            const indexSelection = event.selection.map(x.invert)
        }
    })

    svg.select(".brush").call(brush)

    //Rendering of the chart
    return(
        <div className="Chart" ref={chartRef}>
            <svg width={chartSize.width} height={chartSize.height} ref={svgRef}f onWheel={Zoom} onMouseUp={OnMouseUp} onMouseDown={OnMouseDown} onMouseMove={MoveCamera}>
                <g className="brush" transform={`translate(${[margin, margin].join(',')})`} />
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[margin, margin].join(',')})`}
                >
                    {/* Y axis */}
                    <AxisLeft yScale={y} pixelsPerTick={40} width={chartSize.width} />

                    {/* X axis, use an additional translation to appear at the bottom */}
                    <g transform={`translate(0, ${boundsHeight})`}>
                        <AxisBottom
                        xScale={x}
                        pixelsPerTick={40}
                        height={boundsHeight}
                        />
                    </g>

                    {/* Circles */}
                    {allShapes}
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
                <Tooltip interactionData={hovered} />
            </div>
        </div>
    )
}