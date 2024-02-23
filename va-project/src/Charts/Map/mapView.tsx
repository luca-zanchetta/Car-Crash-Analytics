import { TileLayer, MapContainer } from "react-leaflet";
import PixiOverlay from "react-leaflet-pixi-overlay";
import { renderToString } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import "../../App.css"

type MapProps ={
  setFilters: Function;
  data: [];
}
//const redCircle = '<svg height="17px" width="17px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g><path style="fill:#B3404A;" d="M255.996,512c-68.38,0-132.667-26.629-181.02-74.98c-5.669-5.669-5.669-14.862,0-20.533c5.669-5.669,14.862-5.669,20.533,0c42.867,42.869,99.863,66.476,160.488,66.476s117.62-23.608,160.488-66.476C459.351,373.62,482.96,316.624,482.96,256s-23.608-117.62-66.476-160.488c-42.869-42.869-99.863-66.476-160.488-66.476S138.376,52.644,95.509,95.512c-57.256,57.256-79.728,141.45-58.65,219.728c2.085,7.742-2.501,15.708-10.244,17.793c-7.738,2.085-15.708-2.501-17.793-10.244C-2.68,280.078-2.935,234.853,8.086,192.005C19.44,147.853,42.572,107.387,74.977,74.98C123.328,26.629,187.616,0,255.996,0s132.667,26.629,181.02,74.98c48.352,48.352,74.98,112.639,74.98,181.02s-26.629,132.667-74.98,181.02C388.663,485.371,324.376,512,255.996,512z"/><path style="fill:#B3404A;" d="M255.996,446.518c-105.052,0-190.518-85.466-190.518-190.518S150.944,65.482,255.996,65.482c67.966,0,131.273,36.627,165.218,95.591c4,6.948,1.61,15.825-5.338,19.826c-6.947,4.001-15.825,1.61-19.826-5.338c-28.778-49.988-82.443-81.041-140.054-81.041c-89.042,0-161.482,72.44-161.482,161.482s72.44,161.482,161.482,161.482S417.478,345.042,417.478,256c0-8.018,6.5-14.518,14.518-14.518s14.518,6.5,14.518,14.518C446.514,361.052,361.048,446.518,255.996,446.518z"/></g><circle style="fill:#F4B2B0;" cx="255.995" cy="255.996" r="105.981"/><path style="fill:#B3404A;" d="M255.996,376.499c-66.444,0-120.499-54.055-120.499-120.499s54.055-120.499,120.499-120.499S376.495,189.556,376.495,256S322.439,376.499,255.996,376.499z M255.996,164.537c-50.433,0-91.463,41.031-91.463,91.463s41.031,91.463,91.463,91.463s91.463-41.031,91.463-91.463S306.429,164.537,255.996,164.537z"/></svg>'
const redCircle = '<svg fill="#000000" width="18px" height="18px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><circle cx="128" cy="128" r="96" stroke-width="10" stroke="black" fill="red"/></g><path fill="red" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/></svg>'
const yellowCircle = '<svg fill="#000000" width="18px" height="18px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g opacity="1"><circle cx="128" cy="128" r="96" stroke-width="10" stroke="black" fill="#F2C200"/></g><path fill="#F2C200" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/></svg>'
const greenCircle = '<svg fill="#000000" width="18px" height="18px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><circle cx="128" cy="128" r="96" stroke-width="10" stroke="black" fill="lightgreen"/></g><path fill="green" d="M128,232A104,104,0,1,1,232,128,104.11782,104.11782,0,0,1,128,232Zm0-192a88,88,0,1,0,88,88A88.09961,88.09961,0,0,0,128,40Z"/></svg>'
const slight = "0"  // Slight
const serious = "1" // Serious
const fatal = "2"   // Fatal

const colors = {"0":"green","1":"yellow" ,"2":"red" }
const icons = {"0":greenCircle,"1":yellowCircle ,"2":redCircle }

const MapComponent = ({setFilters, data}:MapProps) => {

  const [map, setMap] = useState(null)
  const [firstPoint, setFirst] = useState([])
  const [secondPoint, setSecond] = useState([])

  const [topLeft, setTop] = useState([])
  const [bottomRight, setBottom] = useState([])

  const [firstLatLng , setLatLngFirst] = useState([])
  const [secondLatLng , setLatLngSecond] = useState([])

  var firstLatLngRef = useRef(null)
  firstLatLngRef.current = firstLatLng

  var pointRef = useRef([])
  var svgRef = useRef(null)
  var mapRef = useRef(null)
  
  var pointForDraw = useRef(null)

  pointForDraw.current = [topLeft,bottomRight]
  pointRef.current = [firstPoint,secondPoint]
  var redMarkers = [];
  var greenMarkers = [];
  var yellowMarkers = [];

  data.map((d,i) => {
      greenMarkers.push(
        {
          id: i,
          iconColor: colors[d[2]],
          position: [d[0], d[1]],
          popup: "Quack!",
          popupOpen: false, // if popup has to be open by default
          // onClick: () => callback(d),
          tooltip: "Id: "+ d[6] + "<br>Causalities: " + d[3] + "<br> Veichles involved: " + d[4] + "<br> Speed limit: " + d[5],
          customIcon:icons[d[2]],
        }
      )
    })



  function onMapClick(e) {
    var x = e.originalEvent.clientX
    var y = e.originalEvent.clientY
    var lat = e.latlng.lat
    var lng = e.latlng.lng

    if(pointRef.current[0].length === 0 && pointRef.current[1].length === 0){
      //NO POINTS HAVE BEEN SELECTED
      setFirst([x,y])
      setLatLngFirst([lat,lng])

    }else if(pointRef.current[1].length === 0){
      //CHECK WHICH POINT IS the top left corner
      var bottomRight = [Math.max(pointRef.current[0][0], x),Math.max(pointRef.current[0][1], y)]
      var topLeft = [Math.min(pointRef.current[0][0], x),Math.min(pointRef.current[0][1], y)]
       
      setSecond([x,y])
      setLatLngSecond([lat,lng])
      setTop(topLeft)
      setBottom(bottomRight)

      //FILTER DATA
      mapRef.current.dragging.disable()
      mapRef.current.options.zoomControl = false;
      mapRef.current.scrollWheelZoom.disable()
      setFilters([firstLatLngRef.current, [lat,lng]])

    }else {
      // THIRD CLICK
      //erase the brush
      mapRef.current.dragging.enable()
      mapRef.current.options.zoomControl = true;
      mapRef.current.scrollWheelZoom.enable()
      setFirst([])
      setSecond([])
      setFilters([])
    }
  }

  return (
    <>
      <svg style={{position:"absolute",width:"100%",height:"100%",zIndex:"999999"}} ref={svgRef} pointerEvents={"none"}>
        {firstPoint. length !== 0 && secondPoint. length !== 0 &&  svgRef.current &&
          <rect 
            style={{zIndex:'200',position:"relative"}}
            //ref={brushRect}
            cursor={"pointer"}
            fill="rgb(119, 119, 119)"
            fillOpacity="0.3"
            stroke= "rgb(255, 255, 255)"
            width={bottomRight[0] - topLeft[0]}
            height={bottomRight[1] - topLeft[1]}
            x={topLeft[0] - svgRef.current.getBoundingClientRect()["x"] }
            y={topLeft[1] - svgRef.current.getBoundingClientRect()["y"]}
          
          ></rect>
        
        }
      </svg>
      <MapContainer
        ref={mapRef}
        zoom={15} // initial zoom required
        zoomControl={secondPoint.length === 0? true: false}
        maxZoom={20} // required
        minZoom={3} // required
        center={[51.504755,-0.123257]}
        style={{width:'100%',height:'100%'}}
        whenReady={(map) => {setMap(map); map.target.on("contextmenu", onMapClick);}}
        // Other map props...
      >
        <TileLayer
          
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PixiOverlay markers={greenMarkers} />
        
      </MapContainer>
    </>
  );
};

export default MapComponent;