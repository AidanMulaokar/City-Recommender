import { Button } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import {RangeStepInput} from 'react-range-step-input';

const PersonalForm = (props) => {
  const [cityPopulation, setCityPopulation] = useState(5);
  const [cityMedianAge, setCityMedianAge] = useState(5);
  const [cityPropertyValue, setCityPropertyValue] = useState(5);
  const [cityHouseholdIncome, setCityHouseholdIncome] = useState(5);
  const [cityHouseholdOwnership, setCityHouseholdOwnership] = useState(5);
  const [cityBizTech, setCityBizTech] = useState(5);
  const [cityUniversities, setCityUniversities] = useState(5);
  const [cityDiversity, setCityDiversity] = useState(5);
  const [cityGenderWageGap, setCityGenderWageGap] = useState(5);
  const [cityAvgWageGap, setCityAvgWageGap] = useState(5);
  const [cityPublicTransit, setCityPublicTransit] = useState(5);
  const [cityWalkBike, setCityWalkBike] = useState(5);
  const [cityWFH, setCityWFH] = useState(5);
  const [cityExercise, setCityExercise] = useState(5);
  const [cityCrime, setCityCrime] = useState(5);
  const [cityPolitical, setCityPolitical] = useState(5);
  const [userPolitical, setUserPolitical] = useState("");
  return (
    <div style={{textAlign: "center", fontSize: 12, position:"relative", height: "80vh"}}>
        <div>
        <div>How much importance do you place on city population?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityPopulation(e.target.value)}/>{cityPopulation}</span>
        </div>

        <div>
        <div>How much importance do you place on city median age?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityMedianAge(e.target.value)}/>{cityMedianAge}</span>
        </div>

        <div>
        <div>How much importance do you place on city property value?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityPropertyValue(e.target.value)}/>{cityPropertyValue}</span>
        </div>

        <div>
        <div>How much importance do you place on city household income?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityHouseholdIncome(e.target.value)}/>{cityHouseholdIncome}</span>
        </div>

        <div>
        <div>How much importance do you place on city household ownership?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityHouseholdOwnership(e.target.value)}/>{cityHouseholdOwnership}</span>
        </div>

        <div>
        <div>How much importance do you place on city business and tech jobs?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityBizTech(e.target.value)}/>{cityBizTech}</span>
        </div>

        <div>
        <div>How much importance do you place on city universities?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityUniversities(e.target.value)}/>{cityUniversities}</span>
        </div>

        <div>
        <div>How much importance do you place on city diversity?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityDiversity(e.target.value)}/>{cityDiversity}</span>
        </div>

        <div>
        <div>How much importance do you place on city gender wage gap?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityGenderWageGap(e.target.value)}/>{cityGenderWageGap}</span>
        </div>

        <div>
        <div>How much importance do you place on city average wage gap?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityAvgWageGap(e.target.value)}/>{cityAvgWageGap}</span>
        </div>

        <div>
        <div>How much importance do you place on city public transit?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityPublicTransit(e.target.value)}/>{cityPublicTransit}</span>
        </div>

        <div>
        <div>How much importance do you place on city walking or biking facilities?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityWalkBike(e.target.value)}/>{cityWalkBike}</span>
        </div>

        <div>
        <div>How much importance do you place on city work from home facilities?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityWFH(e.target.value)}/>{cityWFH}</span>
        </div>

        <div>
        <div>How much importance do you place on city exercise facilities?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityExercise(e.target.value)}/>{cityExercise}</span>
        </div>

        <div>
        <div>How much importance do you place on city crime rate?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityCrime(e.target.value)}/>{cityCrime}</span>
        </div>

        <div>
        <div>How much importance do you place on city political orientation?</div>
        <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityPolitical(e.target.value)}/>{cityPolitical}</span>
        </div>

        <div>
        <div>To which political party do you most closely lean?</div>
        <select onChange={(e) => setUserPolitical(e.target.value)}>
            <option></option>
            <option>Democratic</option>
            <option>Rebuplican</option>
        </select>
        </div>


        <Button variant="contained" onClick={() => props.submitForm({
            cityPopulation : cityPopulation,
            cityMedianAge : cityMedianAge,
            cityPropertyValue : cityPropertyValue,
            cityHouseholdIncome : cityHouseholdIncome,
            cityHouseholdOwnership : cityHouseholdOwnership,
            cityBizTech : cityBizTech,
            cityUniversities : cityUniversities,
            cityDiversity : cityDiversity,
            cityGenderWageGap : cityGenderWageGap,
            cityAvgWageGap : cityAvgWageGap,
            cityPublicTransit : cityPublicTransit,
            cityWalkBike : cityWalkBike,
            cityWFH : cityWFH,
            cityExercise : cityExercise,
            cityCrime : cityCrime,
            cityPolitical : cityPolitical,
            userPolitical : userPolitical
        })}
        style={{position: "absolute", bottom: 0}}
        >Next</Button>
    </div>
  )
}

export default PersonalForm