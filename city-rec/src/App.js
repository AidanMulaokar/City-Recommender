import logo from './logo.svg';
import './App.css';
import MapChart from './components/MapChart';
import NavBar from './components/NavBar';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import React from 'react';
import {RangeStepInput} from 'react-range-step-input';

function App() {

  //Demographic Information
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [marital, setMarital] = useState("");
  const [children, setChildren] = useState(0);
  const [education, setEducation] = useState("");
  const [employment, setEmployment] = useState("");
  const [income, setIncome] = useState(0);

  //Personalized Information
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

  const [test, setTest] = useState({lon : -74.006, lat: 40.7128});
  const [form, setForm] = useState(0);
  
  const getResults = () => {
    const inputs = {
      city_pop : cityPopulation,
      city_median_age: cityMedianAge,
      city_property_value: cityPropertyValue,
      city_household_income: cityHouseholdIncome,
      city_household_ownership: cityHouseholdOwnership,
      city_biz_tech: cityBizTech,
      city_universities: cityUniversities,
      city_diversity: cityDiversity,
      city_gender_wage_gap: cityGenderWageGap,
      city_avg_wage_gap: cityAvgWageGap,
      city_public_transit: cityPublicTransit,
      city_walk_bike: cityWalkBike,
      city_wfh: cityWFH,
      city_exercise: cityExercise,
      city_crime: cityCrime,
      city_political: cityPolitical,
      user_political: userPolitical,
      age : age,
      gender : gender,
      race : race,
      marital : marital,
      children : children,
      education : education,
      employment: employment,
      income : income
    }
    setForm(2);
    fetch("/results",
    {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(inputs)
    }).then(
      res => res.json()
    ).then(
      data => {
        setTest(data)
        setForm(3);
        console.log(test)
      }
    )
  }

  const submitFirst = () => {
    setForm(1)
  }
  return (
    <div className="App">
      <NavBar/>
      <table>
        <tbody>
          <tr style={{height: "90vh"}}>
            <td style={{width: "60vw"}}>
              <MapChart coordinates={test}></MapChart>
            </td>
            <td>
              {form === 0 ? 
                <div>
                  <div>
                    <label>How much importance do you place on city population?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityPopulation(e.target.value)}/>{cityPopulation}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city median age?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityMedianAge(e.target.value)}/>{cityMedianAge}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city property value?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityPropertyValue(e.target.value)}/>{cityPropertyValue}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city household income?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityHouseholdIncome(e.target.value)}/>{cityHouseholdIncome}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city household ownership?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityHouseholdOwnership(e.target.value)}/>{cityHouseholdOwnership}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city business and tech jobs?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityBizTech(e.target.value)}/>{cityBizTech}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city universities?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityUniversities(e.target.value)}/>{cityUniversities}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city diversity?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityDiversity(e.target.value)}/>{cityDiversity}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city gender wage gap?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityGenderWageGap(e.target.value)}/>{cityGenderWageGap}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city average wage gap?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityAvgWageGap(e.target.value)}/>{cityAvgWageGap}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city public transit?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityPublicTransit(e.target.value)}/>{cityPublicTransit}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city walking or biking facilities?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityWalkBike(e.target.value)}/>{cityWalkBike}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city work from home facilities?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityWFH(e.target.value)}/>{cityWFH}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city exercise facilities?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityExercise(e.target.value)}/>{cityExercise}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city crime rate?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityCrime(e.target.value)}/>{cityCrime}</span>
                  </div>

                  <div>
                    <label>How much importance do you place on city political orientation?</label>
                    <span><RangeStepInput min={0} max ={10} step={1} onChange={(e) => setCityPolitical(e.target.value)}/>{cityPolitical}</span>
                  </div>

                  <div>
                    <label>To which political party do you most closely lean?</label>
                    <select onChange={(e) => console.log(e.target.value)}>
                      <option></option>
                      <option>Democratic</option>
                      <option>Rebuplican</option>
                    </select>
                  </div>

                  <button onClick={() => submitFirst()}>Submit</button>
                </div>

                : form === 1 ?

                <div>
                <div>
                  <label>What is your age?</label>
                  <input onChange={(e) => setAge(e.target.value)}/>
                </div>

                <div>
                  <label>Which of the following best describes your assigned sex at birth?</label>
                  <select>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label>Which of the following best describes your racial identity?</label>
                  <select onChange={(e) => setRace(e.target.value)}>
                    <option>American/Alaskan Native</option>
                    <option>Asian</option>
                    <option>Black</option>
                    <option>Hispanic</option>
                    <option>Pacific Islander/ Hawaiian Native</option>
                    <option>White</option>
                    <option>Multiracial</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label>Which of the following best describes your marital status?</label>
                  <select onChange={(e) => setMarital(e.target.value)}>
                    <option>Married</option>
                    <option>Unmarried</option>
                  </select>
                </div>

                <div>
                  <label>How many children do you have?</label>
                  <input onChange={(e) => setChildren(e.target.value)}></input>
                </div>

                <div>
                  <label>Which of the following is the highest level of education you have completed?</label>
                  <select onChange={(e) => setEducation(e.target.value)}>
                    <option>Some High School</option>
                    <option>High School / GED</option>
                    <option>2-4 Year College Degree</option>
                  </select>
                </div>

                <div>
                  <label>Which of the following best describes your current employment status?</label>
                  <select onChange={(e) => setEmployment(e.target.value)}>
                    <option>Student</option>
                    <option>Employed</option>
                    <option>Self-Employed</option>
                    <option>Unemployed</option>
                    <option>Retired or not looking for work</option>
                  </select>
                </div>
                
                <div>
                  <label>Which of the following best estimates your personal annual income?</label>
                  <select onChange={(e) => setIncome(e.target.value)}>
                    <option>Less than $35,000</option>
                    <option>$35,000 - $75,000</option>
                    <option>Greater than $75,000</option>
                  </select>
                </div>

                <button onClick={() => getResults()}>Search</button>
              </div>
                : form === 2 ?
                <p>Analyzing</p>
                :
                <p>Results</p>
              }
 
              
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  );
}

export default App;
