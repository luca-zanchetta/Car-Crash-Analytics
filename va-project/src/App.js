import './App.css';
import * as d3 from "d3"
import LinePlot from './Charts/test.js';
import MapComponent from './Charts/mapView.js';
import { useEffect, useState } from 'react';
import { ExtractFeatures } from './Utilities/SliceColumns.js';
import { Scatterplot } from './Charts/Scatterplot.tsx';
import { Heatmap } from './Charts/Heatmap.tsx';
import { ParallelCoordinate } from './Charts/ParallelCoordinate.tsx';

export const columns = {
  Date: "Accident Date",
  Severity: "Accident_Severity",
  Day:"Day_of_Week",
  JControl:"Junction_Control",
  JDetail:"Junction_Detail",  
  Latitude:"Latitude",
  Light:"Light_Conditions",
  Longitude:"Longitude",
  Number_of_Casualties:"Number_of_Casualties",
  Number_of_Vehicles:"Number_of_Vehicles",
  Road_Surface_Conditions: "Road_Surface_Conditions",
  Road_Type:"Road_Type",
  Speed_limit:"Speed_limit",
  Time:"Time",
  Urban_or_Rural_Area:"Urban_or_Rural_Area",
  Vehicle_Type:"Vehicle_Type",
  Weather_Conditions:"Weather_Conditions",
  Time_Interval:"Time_interval"
}

function App() {
  const [data , setData] = useState([])
  useEffect(() =>{
    d3.csv("dataset.csv").then(data => {
      setData(data)
      console.log(data[0])
    });
 
  },[])
 
  function Hey() {
    //console.log("frochoni")
  }
  return (
    <div className="App">
      <div className='TopBar'>
        <h1>Car crash anlytics</h1>
      </div>
      <div className='ScreenCenter'>
        <div className='Filters'>

        </div>
        <div className='Map'>
          <MapComponent></MapComponent>
        </div>
      </div>
      <div className='ScreenBottom'>
        <div className='DimReduction'>
          <Scatterplot callbackMouseEnter={Hey} data={ExtractFeatures(data,[columns.Number_of_Casualties,columns.Number_of_Vehicles])}></Scatterplot>
        </div>
        <div className='ParallelCoordinates'>
          <ParallelCoordinate Data={ExtractFeatures(data, [columns.JControl,columns.JDetail,columns.Light,columns.Road_Surface_Conditions,columns.Road_Type,columns.Vehicle_Type,columns.Weather_Conditions])}></ParallelCoordinate>
        </div>
        <div className='Heatmap'>
          <Heatmap Data={ExtractFeatures(data, [columns.Time_Interval,columns.Day])}></Heatmap>
        </div>
      </div>
    </div>
  );
}



export default App;
