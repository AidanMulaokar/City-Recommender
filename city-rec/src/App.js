import logo from './logo.svg';
import './App.css';
import MapChart from './components/MapChart';
import NavBar from './components/NavBar';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

function App() {

  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [marital, setMarital] = useState("");
  const [children, setChildren] = useState(0);
  const [education, setEducation] = useState("");
  const [employment, setEmployment] = useState("");
  const [income, setincome] = useState(0);

  const [test, setTest] = useState({lon : -74.006, lat: 40.7128});
  const [form, setForm] = useState(0);
  
  const getResults = () => {
    const inputs = {
      age : age,
      gender : gender,
      race : race,
      marital : marital,
      children : children,
      education : education,
      employment: employment,
      income : income
    }
    setForm(1);
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
        setForm(2);
        console.log(test)
      }
    )
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
                  <select>
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
                  <select>
                    <option>Married</option>
                    <option>Unmarried</option>
                  </select>
                </div>

                <div>
                  <label>How many children do you have?</label>
                  <input></input>
                </div>

                <div>
                  <label>Which of the following is the highest level of education you have completed?</label>
                  <select>
                    <option>Some High School</option>
                    <option>High School / GED</option>
                    <option>2-4 Year College Degree</option>
                  </select>
                </div>

                <div>
                  <label>Which of the following best describes your current employment status?</label>
                  <select>
                    <option>Student</option>
                    <option>Employed</option>
                    <option>Self-Employed</option>
                    <option>Unemployed</option>
                    <option>Retired or not looking for work</option>
                  </select>
                </div>
                
                <div>
                  <label>Which of the following best estimates your personal annual income?</label>
                  <select>
                    <option>Less than $35,000</option>
                    <option>$35,000 - $75,000</option>
                    <option>Greater than $75,000</option>
                  </select>
                </div>

                <button onClick={() => getResults()}>Search</button>
              </div>
                : form === 1 ?
                  <p>Analyzing...</p>
                :
                <p>
                  Second Line of Questioning
                </p>
              }
 
              
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  );
}

export default App;
