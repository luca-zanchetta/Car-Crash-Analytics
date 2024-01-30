import './App.css';
import * as d3 from "d3"
import LinePlot from './Charts/test.js';
import MapComponent from './Charts/mapView.js';
import { useEffect, useState } from 'react';
import { ExtractFeatures } from './Utilities/SliceColumns.js';
import { Scatterplot } from './Charts/Scatterplot.tsx';
import { Heatmap } from './Charts/Heatmap.tsx';
import { ParallelCoordinate } from './Charts/ParallelCoordinate.tsx';

/*
junction_control_enc = {'Data missing or out of range': 0, 'Give way or uncontrolled': 1, 'Stop sign': 2, 'Auto traffic signal': 3, 'Authorised person': 4}    

junction_detail_enc = {'Roundabout': 0, 'Other junction': 1, 'Crossroads': 2, 'Mini-roundabout': 3, 'More than 4 arms (not roundabout)': 4, 'Not at junction or within 20 metres': 5, 'Slip road': 6, 'T or staggered junction': 7, 'Private drive or entrance': 8}

light_conditions_enc = {'Darkness - no lighting': 0, 'Darkness - lights unlit': 1, 'Darkness - lighting unknown': 2, 'Daylight': 3, 'Darkness - lights lit': 4}

road_surface_conditions_enc = {'Frost or ice': 0, 'Snow': 1, 'Wet or damp': 2, 'Dry': 3}

road_type_enc = {'Roundabout': 0, 'Dual carriageway': 1, 'Single carriageway': 2, 'One way street': 3, 'Slip road': 4}

weather_conditions_enc = {'Snowing no high winds': 0, 'Raining + high winds': 1, 'Raining no high winds': 2, 'Other': 3, 'Fine no high winds': 4, nan: 5, 'Fine + high winds': 6}
*/

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
