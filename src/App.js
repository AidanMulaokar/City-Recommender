import logo from './logo.svg';
import './App.css';
import MapChart from './components/MapChart';
import NavBar from './components/NavBar';
import { useState } from 'react';
import React from 'react';
import {Box, Stepper, Step, StepLabel, Button} from '@mui/material';
import PersonalForm from './components/PersonalForm';
import DemographicForm from './components/DemographicForm';
import ChloroplethMap from './components/ChloroplethMap';


function App() {

  const [personalInfo, setPersonalInfo] = useState({});
  

  const [data, setData] = useState([{'City' : 'New York', 'Lat': 40.7128, 'Lon': -74.006, 'Features': ['Great!'], 'Values' : ['0'], 'AllFeatures' : ['Great'], 'FeatureContributions': [0]}], );
  const [form, setForm] = useState(0);
  const [selected, setSelected] = useState(0);

  const steps = ["Personal Info", "Demographic Info", "Results"]
  const [activeStep, setActiveStep] = useState(0);


  const getResults = (info) => {
    setForm(2);
    setActiveStep(2);
    const inputs = {
      city_pop : personalInfo.cityPopulation,
      city_median_age: personalInfo.cityMedianAge,
      city_property_value: personalInfo.cityPropertyValue,
      city_household_income: personalInfo.cityHouseholdIncome,
      city_household_ownership: personalInfo.cityHouseholdOwnership,
      city_biz_tech: personalInfo.cityBizTech,
      city_universities: personalInfo.cityUniversities,
      city_diversity: personalInfo.cityDiversity,
      city_gender_wage_gap: personalInfo.cityGenderWageGap,
      city_avg_wage_gap: personalInfo.cityAvgWageGap,
      city_public_transit: personalInfo.cityPublicTransit,
      city_walk_bike: personalInfo.cityWalkBike,
      city_wfh: personalInfo.cityWFH,
      city_exercise: personalInfo.cityExercise,
      city_crime: personalInfo.cityCrime,
      city_political: personalInfo.cityPolitical,
      user_political: personalInfo.userPolitical,
      age : info.age,
      gender : info.gender,
      race : info.race,
      marital : info.marital,
      children : info.children,
      education : info.education,
      employment: info.employment,
      income : info.income
    }

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
        // setTest(data)
        setActiveStep(3);
        setForm(3);
        // console.log(test)
        console.log(data)
        setData(data)
      }
    )
  }

  const submitFirst = (info) => {
    setPersonalInfo(info);
    setForm(1)
    setActiveStep(1)
  }

  const select = (index) => {
    setSelected(index)
  }

  const back = () => {
    setActiveStep(0);
    setForm(0);
  }

  const restart = () => {
    setActiveStep(0);
    setForm(0);
  }

  // const submitSecond = async (info) => {
  //   setDemographicInfo(info);
  //   setForm(2);
  //   setActiveStep(2);
  // }
  return (
    <div className="App">
      <NavBar/>
      
      <table>
        <tbody>
          <tr style={{height: "90vh"}}>
            <td style={{width: "60vw"}}>
              {form === 3 ?
              <MapChart data = {data} selectCity = {select}></MapChart>
              :
              <div>
                <ChloroplethMap></ChloroplethMap>
              </div>
              }
              
            </td>
            <td style={{width: "40vw", boxShadow: "-10px 5px 10px gray"}}>
              
              <Box sx={{width: "37vw", height: "85vh", verticalAlign: "top", marginTop: "5vh", overflowY: "scroll"}}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {form === 0 ? 
                  <PersonalForm submitForm = {submitFirst}/>
                  : form === 1 ?
                  <DemographicForm submitForm = {getResults} back = {back}/>
                  : form === 2 ?
                  <div>
                    <img className='App-logo' src={logo} alt=""></img>
                    <p>Choosing the best cities for you...</p>
                  </div>
                  
                  :
                  <div>
                    <div>Percent Contribution to Recommendation Score</div>
                    <div>(Based on Shap Value's Per Feature)</div>
                    <p>{data[selected]['City']}</p>
                    
                    <div style={{fontSize: 15, textAlign: "left", marginLeft:"1vw"}}>
                      
                      {data[selected]['AllFeatures'].map( (feature, index) => (
                        <p>{feature} : {data[selected]['FeatureContributions'][index]}</p>
                      ))}
                    </div>
                    <Button variant="contained" onClick={() => restart()}>Search Again</Button>
                  </div>
                  
                }
              </Box>
 
              
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  );
}

export default App;
