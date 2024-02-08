import * as d3 from "d3";
import React, { useReducer, useRef, useState } from "react";
import { useDimensions } from "../../Utilities/useDimensions.ts";
import { AxisBottom } from "./XAxis_scatterplot.tsx";
import { AxisLeft } from "./YAxis_scatterplot.tsx";
import { InteractionData, Tooltip } from "./Tooltip.tsx";
import "../Charts.css"
import { brushX, select } from "d3";
import usePrevious from "./usePrevious.js";

type ScatterplotProps = {
    callbackMouseEnter: Function;
    margin : number;
    data : {x:number, y:number, severity:number}[];
    name?: string
};


export const Scatterplot = ({callbackMouseEnter, margin = 40,data= [{x: 2,y: 4, severity: 0},{x: 8,y: 5, severity: 0}]}:ScatterplotProps) => {

    const zoomContant = 1.1
    const scrollK = .1
    const [isDown, setDown] = useState(false)
    const [startCoord, setStartingCoord] = useState(null)
    const [startOff, setStartingOff] = useState([0,0])
    const [zoomFactor, setZoomFactor] = useState(1)
    const [zoomXOffset, setXoffset] = useState(0)
    const [zoomYOffset, setYoffset] = useState(0)
    const [selection, setSelection] = useState([[0, 0], [0, 0]]);
    const previousSelection = usePrevious(selection)

    function MoveCamera(e) { 
        
        if(!isDown) return
        var x = e["clientX"];
        var y = e["clientY"];
        
        var movementX = x - startCoord[0]
        var movementY = (y - startCoord[1])*-1

        setXoffset(startOff[0] + movementX*scrollK)
        setYoffset(startOff[1] + movementY*scrollK)
    }


    function OnMouseUp(e) {
        if(e["button"] != 1 ) return
        setDown(false)
    }
    function OnMouseDown(e) {
        if(e["button"] != 1 ) return
        setDown(true)
        console.log(e)
        setStartingCoord([e["clientX"] ,e["clientY"]])
        setStartingOff([zoomXOffset,zoomYOffset])
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

    // Check if there's a selection (brushing window)
    if (selection[0][0] !== selection[1][0] || selection[0][1] !== selection[1][1]) {
        // If there's a selection, check if the current point is within the selection
        const withinSelection =
            x(d[0]) >= Math.min(x(selection[0][0]), x(selection[1][0])) &&
            x(d[0]) <= Math.max(x(selection[0][0]), x(selection[1][0])) &&
            y(d[1]) >= Math.min(y(selection[0][1]), y(selection[1][1])) &&
            y(d[1]) <= Math.max(y(selection[0][1]), y(selection[1][1]));
    
        // Set stroke color based on whether the point is within the selection or not
        return (
            <circle
                key={i}
                r={1}
                cx={x(d[0])}
                cy={y(d[1])}
                opacity={1}
                stroke={withinSelection ? color : "grey"}
                fillOpacity={0.2}
                strokeWidth={1}
                onMouseEnter={() => {
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
                    });
                }}
                onMouseLeave={() => setHovered(null)}
            />
        );
    } else {
        // If there's no active selection, color all points with the same color
        return (
            <circle
                key={i}
                r={1}
                cx={x(d[0])}
                cy={y(d[1])}
                opacity={1}
                stroke={color} // Always use color for stroke
                fillOpacity={0.2}
                strokeWidth={1}
                onMouseEnter={() => {
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
                    });
                }}
                onMouseLeave={() => setHovered(null)}
            />
        );
    }
    });

    let selectedPoints = []

    // Brush logic
    const brush = d3.brush()
        .extent([[0, 0], [boundsWidth, boundsHeight]])
        .on("start brush end", (event) => {
            // console.log("event: ", event.type);
            if (event.selection) {
                const [[x0, y0], [x1, y1]] = event.selection;
                const indexSelection = [
                    [x.invert(x0), y.invert(y0)],
                    [x.invert(x1), y.invert(y1)]
                ];
                setSelection(indexSelection);

                const selected = data.filter(d => {
                    const xVal = x(d[0]);
                    const yVal = y(d[1]);
                    if (xVal >= x0 && xVal <= x1 && yVal >= y0 && yVal <= y1) {
                        return d
                    }
                });
                selectedPoints = selected
                // console.log("Selected points: ", selectedPoints)
            }
        });

    if (previousSelection === selection) {
        svg.select(".brush")
            .call(brush)
            .call(brush.move, selection.map(d => [x(d[0]), y(d[1])]));
    }


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