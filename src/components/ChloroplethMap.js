import React, { useEffect, useState } from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";
import Tippy from "@tippy.js/react";
import { Box } from "@mui/material";

import 'tippy.js/dist/tippy.css'

import marker from "../assets/marker2.png";
import allStates from "../data/allstate.json";
import results from "../data/results.json";
import '../App.css'

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
};

const ChloroplethMap = () => {
  const [mapData, setMapData] = useState({}) ;
  useEffect(() => {

  }, [])

  const colorScheme = [
    "#e6f5ff",
    "#80ccff",
    "#0099ff",
    "#003d66"
  ]
  return (
    <div>
      <div style={{marginBottom: "2vh", fontSize:30}}>
        Where We Recommend Our Users Live!
      </div>
      <span style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", fontSize: 12}}>
        <div>
          <Box sx={{background: colorScheme[0], width: "10vw", height: "5vh"}}></Box>
          0 - {results['quartiles'][0]}
        </div>
        <div>
          <Box sx={{background: colorScheme[1], width: "10vw", height: "5vh"}}></Box>
          {results['quartiles'][0]} - {results['quartiles'][1]}
        </div>
        <div>
          <Box sx={{background: colorScheme[2], width: "10vw", height: "5vh"}}></Box>
          {results['quartiles'][1]} - {results['quartiles'][2]}
        </div>
        <div>
          <Box sx={{background: colorScheme[3], width: "10vw", height: "5vh"}}></Box>
          {results['quartiles'][2]} - {results['quartiles'][3]}
        </div>
      </span>
      <div>
        (Number of Recommendations Per State)
      </div>

    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map(geo => {
              let color = ""
              const cur = allStates.find(s => s.val === geo.id)
              let val = results['results'][cur.id]
              
              if(val === undefined) {
                val = 0
              }
              if(val >= 0 && val <= results['quartiles'][0]) {
                color = colorScheme[0]
              }
              else if (val > results['quartiles'][0] && val <= results['quartiles'][1]) {
                color = colorScheme[1]
              }
              else if (val > results['quartiles'][1] && val <= results['quartiles'][2]) {
                color = colorScheme[2]
              }
              else if(val > results['quartiles'][2]) {
                color = colorScheme[3]
              }
              else { color = colorScheme[0]}
              return(
              <Geography
                key={geo.rsmKey}
                stroke="#DDD"
                geography={geo}
                fill= {color}
                style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" }
                }}
                onClick ={() => console.log(val)}
              />
            )})}
            {geographies.map(geo => {
              const centroid = geoCentroid(geo);
              const cur = allStates.find(s => s.val === geo.id);
              let val = results['results'][cur.id]
              
              return (
                <g key={geo.rsmKey + "-name"}>
                  {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <Marker coordinates={centroid}>
                        <Tippy content={
                          <p>{val === undefined ? 0 : val} Recommendations!</p>  
                          }>
                        <text y="2" fontSize={14} textAnchor="middle" fill = {val > results['quartiles'][1] ? 'white' : 'black'}>
                          {cur.id}
                        </text>
                        </Tippy>
                      </Marker>
                    ) : (
                      <Annotation
                        subject={centroid}
                        dx={offsets[cur.id][0]}
                        dy={offsets[cur.id][1]}
                      >
                        <Tippy content={
                          <p>{val === undefined ? 0 : val} Recommendations!</p>  
                          }>
                        <text x={4} fontSize={14} alignmentBaseline="middle">
                          {cur.id}
                        </text>
                        </Tippy>
                      </Annotation>
                    ))}
                </g>
              );
            })}
          </>
        )}
      </Geographies>

    </ComposableMap>
    </div>
  );
};

export default ChloroplethMap;
