import './App.css';
import * as d3 from "d3"
import MapComponent from './Charts/Map/mapView.tsx';
import React, { useCallback, useEffect, useState } from 'react';
import { ExtractFeatures, CreateTooltipStringFromData } from './Utilities/SliceColumns.js';
import { Scatterplot } from './Charts/Scatterplot/Scatterplot.tsx';
import { Heatmap } from './Charts/Heatmap/Heatmap.tsx';
import { ParallelCoordinate } from './Charts/Parallel Coordinate/ParallelCoordinate.tsx';
import Filters from './Screens/Filters.tsx';
import { FilterData } from './Utilities/FilterData.js';

import redcircle from './img/redcircle.svg'
import greenCircle from './img/circle-oval-svgrepo-com (2).svg'
import yellowCircle from './img/circle-oval-svgrepo-com.svg'
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
  Time_Interval:"Time_interval",
  Id:"Id",
  tsne_x:"tsne_x",
  tsne_y:"tsne_y"
}


const junction_control_enc = {'Data missing or out of range': 0, 'Give way or uncontrolled': 1, 'Stop sign': 2, 'Auto traffic signal': 3, 'Authorised person': 4}    
const junction_detail_enc = {'Roundabout': 0, 'Other junction': 1, 'Crossroads': 2, 'Mini-roundabout': 3, 'More than 4 arms (not roundabout)': 4, 'Not at junction or within 20 metres': 5, 'Slip road': 6, 'T or staggered junction': 7, 'Private drive or entrance': 8}
const light_conditions_enc = {'Darkness - no lighting': 0, 'Darkness - lights unlit': 1, 'Darkness - lighting unknown': 2, 'Daylight': 3, 'Darkness - lights lit': 4}
const road_surface_conditions_enc = {'Frost or ice': 0, 'Snow': 1, 'Wet or damp': 2, 'Dry': 3}
const road_type_enc = {'Roundabout': 0, 'Dual carriageway': 1, 'Single carriageway': 2, 'One way street': 3, 'Slip road': 4}
const weather_conditions_enc = {'Snowing no high winds': 0, 'Raining + high winds': 1, 'Raining no high winds': 2, 'Other': 3, 'Fine no high winds': 4, nan: 5, 'Fine + high winds': 6}
const vehicle_Type_enc = {'Motorcycle': 0, 'Car': 1, 'Good': 2, 'Other vehicle': 3, 'Bus': 4, 'Agricultural vehicle': 5, 'Minibus': 6}
export const filters = [[columns.JControl,junction_control_enc], [columns.JDetail,junction_detail_enc],[columns.Light,light_conditions_enc],[columns.Road_Surface_Conditions,road_surface_conditions_enc],[columns.Road_Type,road_type_enc],[columns.Weather_Conditions,weather_conditions_enc]]

function App() {
  // the single filter is an array [column,value]
  const [DATA, setDATA] = useState([])
  const [activeFilters, setFilters] = useState([])
  const [data,setData] = useState([])
  const [scatterplotFilter, setScatterplotFilter] = useState([])
  const [iteration,setIteration] = useState(0)
  const [Severity, setSeverity] = useState({0: false, 1: false, 2: false})
  const [selectedItem, setSelectedItem] = useState(false)
  const [dataScatterplot, setDataScatterplot] = useState([])


  const addFilter =  useCallback( (filters) => {
    var addedFilters= []
    filters.map( (filter) => {
      if(!activeFilters.includes(filter))
        addedFilters.push(filter)
    })
    activeFilters.map((filter) => {
      addedFilters.push(filter)
    })
    setFilters(addedFilters)
    //setData(FilterData(DATA,addedFilters))
  })

  const removeFilter = useCallback( (filters) => {
    // console.log(filters)
    var newFilters = []
  
    activeFilters.map(d => {
      var push = true;
      filters.map( (filter) => {

        if(d[0] === filter[0] && d[1] == filter[1])
          push = false
      })

      if(push)
        newFilters.push(d)
    })
    setFilters(newFilters)
  })



  useEffect(() =>{
    if(iteration >=1) {
      console.log("duce")
      if(!selectedItem) {
        setData(FilterData(DATA, activeFilters))
        setDataScatterplot(FilterData(DATA,activeFilters))
      }
    }
    else {
      d3.csv("dataset.csv").then(data => {
        setDATA(data)
        setData(data)
        setDataScatterplot(data)
        setIteration(1)
      });
    }
  },[activeFilters])
 
  
  function ToggleServerity(s) {
    console.log(Severity)
    if(Severity[s]){
      removeFilter([[columns.Severity, s]])
      setSeverity({...Severity, [s] : false})
    }  
    else {
      addFilter([[columns.Severity, s]])
      setSeverity({...Severity, [s]: true})
  }
    
  }

  function limitDataScatterplot(selectedPoints) {
    let restrictedData = []

    if(selectedPoints) {
      if(selectedPoints.length !== 0) {
        selectedPoints.forEach(element => {
          data.filter(elem => Number(elem.Id) === Number(element)).map(filteredElement => {
            restrictedData.push(filteredElement)
          })
        });
      }
    }

    console.log("restrictedData.length: ", restrictedData.length)

    if(restrictedData.length === 0) {
      setData(data, activeFilters)
    } 
    else setData(restrictedData, activeFilters)
  }


  function limitDataMap(d) {
    if(selectedItem) {
      setSelectedItem(false)
      setData(DATA)
      setDataScatterplot(DATA)
    }
    else {
      DATA.filter(element => Number(element.Id) === Number(d[6])).map(filteredElement => {
        setFilters([])
        setData([filteredElement])
        setDataScatterplot([filteredElement])
        setSelectedItem(true)
      })
    }
  }


  return (
    <div className="App">
      <div className='TopBar'>
        <h1>Car crash analytics</h1>
      </div>
      <div className='ScreenCenter'>
        <div className='Filters'>
          <Filters addFilter={addFilter} removeFilter={removeFilter}></Filters>
        </div>
        <div className='Map'>
          <MapComponent callback={limitDataMap} data={ExtractFeatures(data,[columns.Latitude,columns.Longitude,columns.Severity, columns.Number_of_Casualties, columns.Number_of_Vehicles, columns.Speed_limit, columns.Id])}></MapComponent>
          <div className='MapLegend'>
            <img src={redcircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem"}} onClick={() => ToggleServerity(2)}></img>
            <text fill={Severity[2]? "Yellow": "White"}>Fatal Accident</text>
            <img src={yellowCircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem"}} onClick={() => ToggleServerity(1)}></img>
            <text fill={Severity[1]? "Yellow": "White"}>Serious Accident</text>
            <img src={greenCircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem"}} onClick={() => ToggleServerity(0)}></img>
            <text fill={Severity[0]? "Yellow": "White"}>Slight Accident</text>
          </div>
        </div>
      </div>
      <div className='ScreenBottom'>
        <div className='DimReduction'>
          <div className='ScatterplotLegend'>
            <div color='Red'>Fatal</div>
            <div color='Red'>Serious</div>
            <div color='Red'>Slight</div>
          </div>
          <__Scatterplot limitDataScatterplot={limitDataScatterplot} dataScatterplot={dataScatterplot} addFilter= {addFilter} removeFilter={removeFilter}></__Scatterplot>
          
        </div>
        <div className='ParallelCoordinates'>
          <ParallelCoordinate Data={ExtractFeatures(data, [columns.JControl,columns.JDetail,columns.Light,columns.Road_Surface_Conditions,columns.Road_Type,columns.Vehicle_Type,columns.Weather_Conditions])} addFilter={addFilter} removeFilter={removeFilter}></ParallelCoordinate>
        </div>
        <div className='Heatmap'>
          <Heatmap Data={ExtractFeatures(data, [columns.Time_Interval, columns.Day])} addFilter={addFilter} removeFilter={removeFilter}></Heatmap>
        </div>
      </div>
    </div>
  );
}


const __Scatterplot = React.memo(({limitDataScatterplot, dataScatterplot, addFilter, removeFilter}) => {
  console.log("re render")
  return(
    <Scatterplot 
      callbackMouseEnter={limitDataScatterplot} 
      data={ExtractFeatures(dataScatterplot, [columns.tsne_x, columns.tsne_y, columns.Severity, columns.Number_of_Casualties, columns.Number_of_Vehicles, columns.Speed_limit, columns.Id])}
      addFilter={addFilter} removeFilter={removeFilter}
    ></Scatterplot>
  )
}, (prev, next) => {
  return prev.dataScatterplot.length === next.dataScatterplot.length
})

export default App;
