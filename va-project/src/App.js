import './App.css';
import * as d3 from "d3"
import MapComponent from './Charts/Map/mapView.tsx';
import React, { useRef, useEffect, useState } from 'react';
import { ExtractFeatures, CreateTooltipStringFromData } from './Utilities/SliceColumns.js';
import { Scatterplot } from './Charts/Scatterplot/Scatterplot.tsx';
import { Heatmap } from './Charts/Heatmap/Heatmap.tsx';
import { ParallelCoordinate } from './Charts/Parallel Coordinate/ParallelCoordinate.tsx';
import Filters from './Screens/Filters.tsx';
import { CheckMapFilters, FilterData } from './Utilities/FilterData.js';

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
  const [recompute, setRecompute] = useState(false)   // False = Highlight, True = Recompute
  const [brushedPoints, setBrushedPoints] = useState([])
  const [mapFilters, setMapFilters] = useState([])
  const [scatterFilters, setScatterFilters] = useState([])

  const fitlersRef = useRef()
  fitlersRef.current = activeFilters

  var scatterFil = useRef()
  scatterFil.current = scatterFilters

  useEffect(() =>{
    if(iteration >=1) {
      setData(FilterData(DATA, activeFilters, mapFilters, scatterFil.current))
      if(recompute) setDataScatterplot(FilterData(DATA, activeFilters, mapFilters, []))
    }
    else {
      d3.csv("dataset.csv").then(data => {
        setDATA(data)
        setData(data)
        setDataScatterplot(data)
        setIteration(1)
      });
    }
  },[activeFilters, recompute, brushedPoints, mapFilters, scatterFilters])

  function addFilter (filters)  {
    var addedFilters= []
    filters.map( (filter) => {
      var isIncluded = false
      
      fitlersRef.current.map(aFilter => {
        if(aFilter[0] === filter[0] && filter[1] === aFilter[1])
          isIncluded = true
      })
      
      if(!isIncluded) 
        addedFilters.push(filter)
    })

    fitlersRef.current.map((filter) => {
      addedFilters.push(filter)
    })
    setFilters(addedFilters)
  }

  function removeFilter(filters) {
    var newFilters = []
  
    fitlersRef.current.map(d => {
      var push = true;
      filters.map( (filter) => {

        if(d[0] === filter[0] && d[1] == filter[1])
          push = false
      })

      if(push)
        newFilters.push(d)
    })
    setFilters(newFilters)
  }

  function updateFilter(filterToAdd, filtersToRemove) {

    var newFilters = []
  
    fitlersRef.current.map(d => {
      var push = true;
      filtersToRemove.map((filter) => {

        if(d[0] === filter[0] && d[1] === filter[1])
          push = false
      })

      if(push)
        newFilters.push(d)
    })

    filterToAdd.map( (filter) => {
      var isIncluded = false
      
      newFilters.map(aFilter => {
        if(aFilter[0] === filter[0] && filter[1] === aFilter[1])
          isIncluded = true
      })
      
      if(!isIncluded) 
      newFilters.push(filter)
    })

    newFilters.map((filter) => {
      newFilters.push(filter)
    })


    setFilters(newFilters)
  }
 
  
  function ToggleServerity(s) {
    if(Severity[s]){
      removeFilter([[columns.Severity, s]])
      setSeverity({...Severity, [s] : false})
    }  
    else {
      addFilter([[columns.Severity, s]])
      setSeverity({...Severity, [s]: true})
    }
  }

  function SetScatterFilters(selectedPoints){
    setScatterFilters(selectedPoints)
  }

  function SetMapFilters(filters) {
    setMapFilters(filters)
  }

  function highlightDataParallel(d) {
    // console.log("SELECTED: ", d)
  }


  function isFiltered(d) {
    var filter = false
    
    data.map((dato, i) => {
      if(Number(dato.Id) === Number(d[6])) {
        // filter = CheckMapFilters([dato.Latitude, dato.Longitude], mapFilters)
        filter = true
      }
        
    })
    
    return filter
  }


  return (
    <div className="Dashboard">   
      <div className='LeftBoard'> 
        <div className='TopBar'>
          <h1>Car crash analytics</h1>
          <div style={{display:"flex", flexDirection:"row", marginLeft:"43%", marginTop:"2%"}}>
              <h3 style={{color: !recompute ? "lightblue":"gainsboro", marginTop: "0", marginRight: "3%", fontSize: "100%"}}>Highlight</h3>
              <label class="switch">
                <input type="checkbox" onChange={() => setRecompute(!recompute)} />
                <span class="slider round"></span>
              </label>
              <h3 style={{color: recompute ? "lightblue":"gainsboro", marginTop: "0", marginLeft: "3%", fontSize: "100%"}}>Recompute</h3>
            </div>
        </div>
        <div className='LeftTop'>
          <div className='LeftTopScatter'>
            <Heatmap 
              Data={ExtractFeatures(data, [columns.Time_Interval, columns.Day])} 
              addFilter={addFilter} 
              removeFilter={removeFilter}
            ></Heatmap>
          </div>
          <div className='LeftTopHeatmap'>
            <div className='ScatterplotLegend'>
                <div color='Red'> 
                  <svg fill="#000000" width="16px" height="16px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.2"><circle cx="128" cy="128" r="96" fill="red"/>
                    </g>
                    <path fill="red" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/>
                  </svg>
                  Fatal
                </div>
                <div color='Red'><svg fill="#000000" width="16px" height="16px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g opacity="0.2"><circle cx="128" cy="128" r="96" fill="yellow"/></g><path fill="yellow" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/></svg>Serious</div>
                <div color='Red'><svg fill="#000000" width="16px" height="16px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g opacity="0.2"><circle cx="128" cy="128" r="96" fill="green"/></g><path fill="green" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/></svg>Slight</div>
              </div>
              <__Scatterplot 
                limitDataScatterplot={SetScatterFilters} 
                dataScatterplot={recompute ? dataScatterplot : DATA} 
                addFilter= {addFilter} 
                removeFilter={removeFilter}
                isFiltered={isFiltered}
                data={data}
              ></__Scatterplot>
          </div>
        </div>
        <div className='LeftBottom'>
          <ParallelCoordinate 
            callbackMouseEnter={highlightDataParallel}
            FULLDATA={ExtractFeatures(DATA, [columns.JControl,columns.JDetail,columns.Light,columns.Road_Surface_Conditions,columns.Road_Type,columns.Vehicle_Type,columns.Weather_Conditions, columns.Id])} 
            Data={ExtractFeatures(data, [columns.JControl,columns.JDetail,columns.Light,columns.Road_Surface_Conditions,columns.Road_Type,columns.Vehicle_Type,columns.Weather_Conditions, columns.Id])} 
            addFilter={addFilter} 
            removeFilter={removeFilter} 
            updateFilter={updateFilter}>
          </ParallelCoordinate>
        </div>
      </div>
      <div className='RightBoard'> 
        <div className='RighTop'>
          <MapComponent 
            setFilters={SetMapFilters} 
            data={ExtractFeatures(data,[columns.Latitude,columns.Longitude,columns.Severity, columns.Number_of_Casualties, columns.Number_of_Vehicles, columns.Speed_limit, columns.Id])}
          ></MapComponent>
          <div className='ScatterplotLegend' style={{zIndex:'9999', backgroundColor:"#3d3d3d"}}>
                <div color='Red'> 
                <svg fill="#000000" width="18px" height="18px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><circle cx="128" cy="128" r="96" stroke-width="10" stroke="black" fill="red"/></g><path fill="red" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/></svg>
                  Fatal
                </div>
                <div color='Red'><svg fill="#000000" width="18px" height="18px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g opacity="1"><circle cx="128" cy="128" r="96" stroke-width="10" stroke="black" fill="#F2C200"/></g><path fill="#F2C200" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/></svg>Serious</div>
                <div color='Red'><svg fill="#000000" width="18px" height="18px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><circle cx="128" cy="128" r="96" stroke-width="10" stroke="black" fill="lightgreen"/></g><path fill="green" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/></svg>Slight</div>
              </div>
          {/* <div className='MapLegend'>
            <img src={redcircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem"}} onClick={() => ToggleServerity(2)}></img>
            <text style={{color: Severity[2]? "Yellow": "White"}}>Fatal Accident</text>
            <img src={yellowCircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem"}} onClick={() => ToggleServerity(1)}></img>
            <text style={{color: Severity[1]? "Yellow": "White"}}>Serious Accident</text>
            <img src={greenCircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem"}} onClick={() => ToggleServerity(0)}></img>
            <text style={{color: Severity[0]? "Yellow": "White"}}>Slight Accident</text>
          </div> */}
        </div>
        <div className='RighBottom'>
          <Filters addFilter={addFilter} removeFilter={removeFilter} ToggleSeverity={ToggleServerity}></Filters> 
        </div>
      </div>
    </div>
  );
}


const __Scatterplot = React.memo(({limitDataScatterplot, dataScatterplot, addFilter, removeFilter, data, isFiltered}) => {
  return(
    <Scatterplot 
      callbackMouseEnter={limitDataScatterplot}
      data={ExtractFeatures(dataScatterplot, [columns.tsne_x, columns.tsne_y, columns.Severity, columns.Number_of_Casualties, columns.Number_of_Vehicles, columns.Speed_limit, columns.Id])}
      addFilter={addFilter} 
      removeFilter={removeFilter}
      isFiltered={isFiltered}
      _data={ExtractFeatures(data, [columns.tsne_x, columns.tsne_y, columns.Severity, columns.Number_of_Casualties, columns.Number_of_Vehicles, columns.Speed_limit, columns.Id])}
    ></Scatterplot>
  )
}, (prev, next) => {
  return prev.data.length === next.data.length && prev.dataScatterplot.length === next.dataScatterplot.length
})


export default App;
