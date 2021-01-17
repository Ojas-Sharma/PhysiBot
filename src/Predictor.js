import axios from "axios";
import React, { useState } from "react";
import "./Predictor.css";
import CircularProgress from "@material-ui/core/CircularProgress";

function Predictor() {
  const [symptom, setSymptom] = useState("");
  const [symptomsArray, setSymptomArray] = useState([]);
  const [disease, setDisease] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "https://htn2021-disease-predictor.herokuapp.com/prediction";
  //   console.log(symptom);
  //   console.log(symptomsArray);
  const handleChange = (e) => {
    setSymptom(e.target.value);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setSymptom("");
    let body = {
      symptoms: symptomsArray,
    };
    try {
      let response = await axios.post(API_URL, body, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      setIsLoading(false);
      setDisease(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addSymptom = (e) => {
    e.preventDefault();
    setSymptomArray([...symptomsArray, symptom]);
    setSymptom("");
  };

  const reset = () => {
    setDisease(null);
    setSymptomArray([]);
  };

  return (
    <div className="predictor">
      <div className="form">
        <input
          placeholder="Add Symptoms"
          className="predictor__input"
          type="text"
          name="symptoms"
          value={symptom}
          onChange={handleChange}
        ></input>

        {disease !== null ? (
          <div className="predictor__button reset" onClick={reset}>
            Reset
          </div>
        ) : (
          <div className="form__buttons">
            <div className="predictor__button" onClick={addSymptom}>
              Add Symptom
            </div>
            <div className="predictor__button" onClick={handleSubmit}>
              Predict Disease
            </div>
          </div>
        )}
      </div>
      {symptomsArray && (
        <h4 className="text">
          {`Your symptoms are: ${symptomsArray.map((symptom) => {
            return ` ${symptom}`;
          })}
          `}
        </h4>
      )}

      {isLoading && <CircularProgress color="secondary" />}
      {disease !== null && (
        <>
          <h3 className="text">
            According to your symptoms, you are possibly suffering form :{" "}
            <span>{disease}</span>
          </h3>
          {/* <h3 className="text p"> Precautions: </h3> */}
          <ul className="text">
            Precautions:
            <li className="text">Be sure to practice good hygiene.</li>
            <li className="text">
              Don't share clothing, towels, or other personal items.
            </li>
            <li className="text">
              Wear clean clothes every day, particularly socks and underwear.
            </li>
            <li className="text">
              Choose clothing and shoes that breathe well.
            </li>
          </ul>
          <h4 className="text">
            Recommendations for nearby doctors coming soon ...
          </h4>
        </>
      )}
    </div>
  );
}

export default Predictor;
