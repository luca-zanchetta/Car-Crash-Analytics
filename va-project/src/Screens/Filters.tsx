/*
junction_control_enc = {'Data missing or out of range': 0, 'Give way or uncontrolled': 1, 'Stop sign': 2, 'Auto traffic signal': 3, 'Authorised person': 4}    

junction_detail_enc = {'Roundabout': 0, 'Other junction': 1, 'Crossroads': 2, 'Mini-roundabout': 3, 'More than 4 arms (not roundabout)': 4, 'Not at junction or within 20 metres': 5, 'Slip road': 6, 'T or staggered junction': 7, 'Private drive or entrance': 8}

light_conditions_enc = {'Darkness - no lighting': 0, 'Darkness - lights unlit': 1, 'Darkness - lighting unknown': 2, 'Daylight': 3, 'Darkness - lights lit': 4}

road_surface_conditions_enc = {'Frost or ice': 0, 'Snow': 1, 'Wet or damp': 2, 'Dry': 3}

road_type_enc = {'Roundabout': 0, 'Dual carriageway': 1, 'Single carriageway': 2, 'One way street': 3, 'Slip road': 4}

weather_conditions_enc = {'Snowing no high winds': 0, 'Raining + high winds': 1, 'Raining no high winds': 2, 'Other': 3, 'Fine no high winds': 4, nan: 5, 'Fine + high winds': 6}
*/

import { filter } from "d3";
import { columns, filters } from "../App";
import "./Filters.css"
import React, { useState } from "react";
import redcircle from './../img/redcircle.svg'
import greenCircle from './../img/circle-oval-svgrepo-com (2).svg'
import yellowCircle from './../img/circle-oval-svgrepo-com.svg'

type filterProp= {
  addFilter:Function;
  removeFilter:Function;
  ToggleSeverity:Function;
}


function Filters({addFilter,removeFilter,ToggleSeverity}:filterProp) {
  const [activeFilter,setActiveFilters] = useState([])
  const [Severity, setSeverity] = useState({0: false, 1: false, 2: false})

  function toggleFilter(filterClass, key, value) {
    if(activeFilter.includes(key+value)){
      setActiveFilters(current => current.filter(elem =>{ return elem !== key+value}))  
      removeFilter([[filterClass,value]])
    }
    else{
      setActiveFilters([...activeFilter, key+value])
      addFilter([[filterClass,value]])
    }
  }

  function includeFilter(filters, filter) {
    filters.map(d => {
      if(d[0] == filter[0] && d[1] == filter[1] && d[2] == filter[2]) return true
    })
    return false;
  }

  function resetFilters() {
    window.location.reload();
  }


  return (
    <div className="FiltersBox">
      <div className="FilterTopBar">
        <div className="topBarWrapper">
          <h1>Filters</h1>
          <div className='resetFilters'  onClick={resetFilters}>
            <h4>Reset</h4>
          </div>
          <div className="topBarWrapper" style={{justifyContent:"flex-end",width:"-webkit-fill-available", marginRight:"5%"}}>
            <h5 style={{marginLeft:"5%"}}>Accident Severity</h5>
            <img src={redcircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem",cursor:"pointer"}} onClick={() => {ToggleSeverity(2) ; setSeverity({...Severity, [2] : !Severity[2]})}}></img>
            <text style={{whiteSpace: "nowrap",color: Severity[2]? "Yellow": "White"}}>Fatal Accident</text>
            <img src={yellowCircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem",cursor:"pointer"}} onClick={() => {ToggleSeverity(1);setSeverity({...Severity, [1] : !Severity[1]})}}></img>
            <text style={{whiteSpace: "nowrap",color: Severity[1]? "Yellow": "White"}}>Serious Accident</text>
            <img src={greenCircle} style={{aspectRatio:1/1,width:"1rem", paddingRight:".5rem", paddingLeft:".5rem",cursor:"pointer"}} onClick={() => {ToggleSeverity(0);setSeverity({...Severity, [0] : !Severity[0]})}}></img>
            <text style={{whiteSpace: "nowrap",color: Severity[0]? "Yellow": "White"}}>Slight Accident</text>
          </div>
        </div>
      </div>
      
      <div className="FilContainer">
        {
          filters.map(d => {
            return(
              <div className="CategoryEntry">
                <h3>{d[0]}</h3>
                <div className="CategoryList">
                  {
                    Object.entries(d[1]).map(([key, value]) => {
                      var backgroundcolor = "#FFF"
                      // if(activeFilter.includes(key+value))
                      //   backgroundcolor = "#FCD901"
                      return(
                        <div className="FilterEntry" style={{cursor:"pointer", backgroundColor: activeFilter.includes(key + value) ? "#FCD901" : "#BFBFBF" }} onClick={() => toggleFilter(d[0],key, value)}>
                          <div style={{backgroundColor:backgroundcolor}}></div>
                          <h5>{key}</h5>
                        </div>
                      )
                      })
                  }
                  
                </div>
              </div>
            )
          })
        } 
      </div>
    </div>
    );
  }
  
  
  
  export default Filters;