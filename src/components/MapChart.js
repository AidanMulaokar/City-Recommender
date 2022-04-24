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
import 'tippy.js/dist/tippy.css'

import marker from "../assets/marker2.png";
import allStates from "../data/allstate.json";
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

const MapChart = (props) => {
  const [mapData, setMapData] = useState({}) ;

  useEffect(() => {
  }, [props.data])

  const setSelected = (index) => {
    console.log('selected ' + index)
    props.data[index]['Fill'] = 'green'
  }
  return (
    <div>
    <div style={{marginBottom: "2vh", fontSize:30}}>
      Where We Recommend YOU Live!
    </div>

    <span style={{display: "flex", width: "100%", justifyContent:"center"}}>
      <div style={{width: "20vw", height: " 10vh", borderRadius: "5px", background: "#1a1a1a", color: "white", fontSize: 13, verticalAlign: "center"}}>
        *Note* Pop-ups from marker icons display the top 5 contributing features to our recommendations and their values.
      </div>
    </span>

    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                stroke="#FFF"
                geography={geo}
                fill="#DDD"
                style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" }
                }}
              />
            ))}
            {geographies.map(geo => {
              const centroid = geoCentroid(geo);
              const cur = allStates.find(s => s.val === geo.id);
              return (
                <g key={geo.rsmKey + "-name"}>
                  {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <Marker coordinates={centroid}>
                        <text y="2" fontSize={14} textAnchor="middle">
                          {cur.id}
                        </text>
                      </Marker>
                    ) : (
                      <Annotation
                        subject={centroid}
                        dx={offsets[cur.id][0]}
                        dy={offsets[cur.id][1]}
                      >
                        <text x={4} fontSize={14} alignmentBaseline="middle">
                          {cur.id}
                        </text>
                      </Annotation>
                    ))}
                </g>
              );
            })}
          </>
        )}
      </Geographies>
      {props.data.map( (result, index) => (
        <Marker key={result['City']} coordinates={[result['Lon'], result['Lat']]}>
          <Tippy content={
            <div>
              {result.City}
              <span>{result.Values.map((value, index) => (
                <p>{result.Features[index]} : {value}</p>
              ))}</span>
            </div>
            
            }>
            <g
              fill="red"
              stroke="black"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(-12, -24)"
              onClick={() => props.selectCity(index)}
            >
              <circle cx="12" cy="10" r="3" fill="none"/>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
            </g>
          </Tippy>
          
        </Marker>
      ))}

    </ComposableMap>
    </div>
  );
};

export default MapChart;
