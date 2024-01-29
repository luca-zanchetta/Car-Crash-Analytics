import * as d3 from "d3";
import "./Charts.css"
import { useDimensions } from "../Utilities/useDimensions.ts";
import { useRef } from "react";


export default function LinePlot({
  data,  
  margin = 10,
}) {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  
  const x = d3.scaleLinear([0, data.length - 1], [margin, chartSize.width - margin])
             
  const y = d3.scaleLinear(d3.extent(data), [chartSize.height - margin, margin]);
  const line = d3.line((d, i) => x(i), y);

  // Add X axis and Y axis
  // x.domain(d3.extent(data, (d) => { return d.date; }));
  // y.domain([0, d3.max(data, (d) => { return d.value; })]);

  return (
    <div className="Chart" ref={chartRef}>
        <svg width={chartSize.width} height={chartSize.height}>
          <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
            <g fill="white" stroke="currentColor" strokeWidth="1.5">
              {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
            </g>
        </svg>
    </div>
  );
}