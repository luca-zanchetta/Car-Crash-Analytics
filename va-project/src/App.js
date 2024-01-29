import './App.css';
import * as d3 from "d3"
import LinePlot from './Charts/test';
import MapComponent from './Charts/mapView';
import { useEffect, useState } from 'react';
import { ExtractFeatures } from './Utilities/SliceColumns';
import { Scatterplot } from './Charts/Scatterplot.tsx';

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
}

function App() {
  const [data , setData] = useState([])
  useEffect(() =>{
    d3.csv("dataset.csv").then(data => {
      setData(data)
    });
 
  },[])
 
  function Hey() {
    console.log("frochoni")
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
          <Scatterplot callbackMouseEnter={Hey} data={ExtractFeatures(data,[columns.Number_of_Casualties,columns.Speed_limit])}></Scatterplot>
        </div>
        <div className='ParallelCoordinates'>

        </div>
        <div className='Heatmap'>
        </div>
      </div>
    </div>
  );
}



export default App;
