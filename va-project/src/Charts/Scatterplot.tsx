import * as d3 from "d3";
import React, { useReducer, useRef, useState } from "react";
import { useDimensions } from "../Utilities/useDimensions.ts";
import { AxisBottom } from "./XAxis_scatterplot.tsx";
import { AxisLeft } from "./YAxis_scatterplot.tsx";
import { InteractionData, Tooltip } from "./Tooltip.tsx";

type ScatterplotProps = {
    callbackMouseEnter: Function;
    margin : number;
    data : {x:number, y:number, name:string}[];
};

export const Scatterplot = ({callbackMouseEnter, margin = 25,data= [{x: 2,y: 4, name:"Frochino"},{x: 8,y: 5, name:"Frochone"}]}:ScatterplotProps) => {

    //needed for responsive dimensions
    const chartRef = useRef(null);
    const chartSize = useDimensions(chartRef);
    //tooltip
    const [hovered, setHovered] = useState<InteractionData | null>(null);


    const boundsWidth = chartSize.width - margin - margin;
    const boundsHeight = chartSize.height - margin - margin;

    const y = d3.scaleLinear().domain([0, 1000]).range([boundsHeight, 0]);
    const x = d3.scaleLinear().domain([0, 1000]).range([0, boundsWidth]);

    // Build the shapes
    const allShapes = data.map((d, i) => {
        return (
        <circle
            key={i}
            r={13}
            cx={x(d.y)}
            cy={y(d.x)}
            opacity={1}
            stroke="#cb1dd1"
            fill="#cb1dd1"
            fillOpacity={0.2}
            strokeWidth={1}
            onMouseEnter={() =>{
                callbackMouseEnter();
                setHovered({
                  xPos: x(d.x),
                  yPos: y(d.y),
                  name: d.name
                })}
              }
              onMouseLeave={() => setHovered(null)}
        />
        );
    });

    //Rendering of the chart
    return(
        <div className="Chart" ref={chartRef}>
            <svg width={chartSize.width} height={chartSize.height}>
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
                width: boundsWidth,
                height: boundsHeight,
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                marginLeft: margin,
                marginTop: margin,
                }}
            >
                <Tooltip interactionData={hovered} />
            </div>
        </div>
    )
}