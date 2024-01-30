import React, { useEffect } from "react";
import { LayerGroup, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as d3 from "d3";
import * as d3Geo from "d3-geo";


const MapComponent = () => {
  function D3Layer() {
    const map = useMap();

    useEffect(() => {
      const svg = d3.select(map.getPanes().overlayPane).append("svg");
      const g = svg.append("g").attr("class", "leaflet-zoom-hide");

      //  create a d3.geo.path to convert GeoJSON to SVG
      var transform = d3Geo.geoTransform({
          point: projectPoint
        }),
        path = d3Geo.geoPath().projection(transform);

    //   // create path elements for each of the features
    //   const d3_features = g
    //     .selectAll("path")
    //     .data(geoShape.features)
    //     .enter()
    //     .append("path");

      map.on("viewreset", reset);

      reset();

      // fit the SVG element to leaflet's map layer
      function reset() {

        g.attr(
          "transform",
        )

      }

      // Use Leaflet to implement a D3 geometric transformation.
      function projectPoint(x, y) {
        const point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
    }, []);
    return null;
  }

  const center = [51.528344,-0.217295];

  return (
    <>
      <MapContainer
        center={center}
        zoom={13}
        // minZoom={6}
        // scrollWheelZoom={true}
        // zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        // maxBounds={[
        //   [58.619777025081675, -10.437011718750002],
        //   [49.66762782262194, 3.3618164062500004]
        // ]}
      >
        <LayerGroup>
          <D3Layer />
        </LayerGroup>
        {/* <MyMapEvents /> */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* <NavBar mapZoom={mapSettings.zoom} activeNav={activeNav} navClick={navClick} show={show} /> */}
        {/* <Overlay show={show} /> */}
      </MapContainer>
    </>
  );
};

export default MapComponent;