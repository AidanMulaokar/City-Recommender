import { Button } from '@mui/material';
import React from 'react'
import { useState } from 'react';

const DemographicForm = (props) => {
  //Demographic Information
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [marital, setMarital] = useState("");
  const [children, setChildren] = useState(0);
  const [education, setEducation] = useState("");
  const [employment, setEmployment] = useState("");
  const [income, setIncome] = useState(0);
  return (
    <div style={{position: "relative", height: "80vh"}}>
        <div>
            <div>What is your age?</div>
            <input onChange={(e) => setAge(e.target.value)}/>
        </div>

        <div>
            <div>Which of the following best describes your assigned sex at birth?</div>
            <select onChange={(e)=>setGender(e.target.value)}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            </select>
        </div>

        <div>
            <div>Which of the following best describes your racial identity?</div>
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
            <div>Which of the following best describes your marital status?</div>
            <select onChange={(e) => setMarital(e.target.value)}>
            <option>Married</option>
            <option>Unmarried</option>
            </select>
        </div>

        <div>
            <div>How many children do you have?</div>
            <input onChange={(e) => setChildren(e.target.value)}></input>
        </div>

        <div>
            <div>Which of the following is the highest level of education you have completed?</div>
            <select onChange={(e) => setEducation(e.target.value)}>
            <option>Some High School</option>
            <option>High School / GED</option>
            <option>2-4 Year College Degree</option>
            </select>
        </div>

        <div>
            <div>Which of the following best describes your current employment status?</div>
            <select onChange={(e) => setEmployment(e.target.value)}>
            <option>Student</option>
            <option>Employed</option>
            <option>Self-Employed</option>
            <option>Unemployed</option>
            <option>Retired or not looking for work</option>
            </select>
        </div>
        
        <div>
            <div>Which of the following best estimates your personal annual income?</div>
            <select onChange={(e) => setIncome(e.target.value)}>
            <option>Less than $35,000</option>
            <option>$35,000 - $75,000</option>
            <option>Greater than $75,000</option>
            </select>
        </div>

        
        <Button variant="contained" onClick={() => props.back()} style={{eft: 50}}>
          Back
        </Button>
        <Button variant="contained" onClick={() => props.submitForm({
            age : age,
            gender : gender,
            race : race,
            marital : marital,
            children : children,
            education : education,
            employment : employment,
            income : income
        })}
        >Search</Button>
        

        
    </div>
  )
}

export default DemographicForm