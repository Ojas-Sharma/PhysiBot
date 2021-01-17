const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 7000;
const payload = require("./payload");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan("dev"));

// NOTE: you must manually enter your API_KEY below using information retrieved from your IBM Cloud
const API_KEY = process.env.API_KEY;

function getToken(errorCallback, loadCallback) {
  const req = new XMLHttpRequest();
  req.addEventListener("load", loadCallback);
  req.addEventListener("error", errorCallback);
  req.open("POST", "https://iam.ng.bluemix.net/identity/token");
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.setRequestHeader("Accept", "application/json");
  req.send(
    "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY
  );
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback) {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", loadCallback);
  oReq.addEventListener("error", errorCallback);
  oReq.open("POST", scoring_url);
  oReq.setRequestHeader("Accept", "application/json");
  oReq.setRequestHeader("Authorization", "Bearer " + token);
  oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  oReq.send(payload);
}

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to IBM Watson powered Disease Prediction API");
});

app.post("/prediction", (req, res) => {
  const { symptoms } = req.body;

  let { values } = payload(symptoms);

  getToken(
    (err) => console.log(err),
    function () {
      let tokenResponse;
      try {
        tokenResponse = JSON.parse(this.responseText);
      } catch (ex) {
        // TODO: handle parsing exception
      }
      // NOTE: manually define and pass the array(s) of values to be scored in the next line
      const payload = `{"input_data": [{"fields": ["malaise","throat_irritation","joint_pain","acute_liver_failure","stiff_neck","mood_swings","silver_like_dusting","weakness_of_one_body_side","bruising","swelling_of_stomach","palpitations","pain_behind_the_eyes","diarrhoea","receiving_unsterile_injections","passage_of_gases","mild_fever","swollen_legs","swollen_extremeties","yellow_urine","watering_from_eyes","lack_of_concentration","phlegm","breathlessness","depression","redness_of_eyes","yellow_crust_ooze","rusty_sputum","blister","cold_hands_and_feets","loss_of_appetite","pain_in_anal_region","bloody_stool","continuous_feel_of_urine","belly_pain","blackheads","skin_rash","chest_pain","obesity","tching","muscle_weakness","back_pain","dischromic patches","stomach_bleeding","pain_during_bowel_movements","abdominal_pain","yellowing_of_eyes","chills","restlessness","family_history","pus_filled_pimples","muscle_pain","dehydration","weakness_in_limbs","inflammatory_nails","sweating","blurred_and_distorted_vision","vomiting","muscle_wasting","spinning_movements","excessive_hunger","acidity","red_spots_over_body","anxiety","mucoid_sputum","cramps","ulcers_on_tongue","increased_appetite","sinus_pressure","lethargy","movement_stiffness","brittle_nails","fluid_overload","slurred_speech","fast_heart_rate","extra_marital_contacts","burning_micturition","toxic_look(typhos)","spotting_ urination","puffy_face_and_eyes","runny_nose","loss_of_balance","red_sore_around_nose","unsteadiness","knee_pain","nausea","swelling_joints","irregular_sugar_level","headache","distention_of_abdomen","prominent_veins_on_calf","visual_disturbances","swelled_lymph_nodes","receiving_blood_transfusion","constipation","enlarged_thyroid","stomach_pain","shivering","painful_walking","nodal_skin_eruptions","skin_peeling","polyuria","indigestion","dark_urine","high_fever","weight_loss","dizziness","altered_sensorium","neck_pain","abnormal_menstruation","patches_in_throat","irritation_in_anus","scurring","congestion","sunken_eyes","yellowish_skin","irritability","continuous_sneezing","coma","cough","fatigue","small_dents_in_nails","history_of_alcohol_consumption","foul_smell_of urine","bladder_discomfort","drying_and_tingling_lips","swollen_blood_vessels","weight_gain"], "values": [[${values}]]}]}`;
      const scoring_url =
        "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/ab7d6ea5-d071-4b40-9199-e098fb20f8bc/predictions?version=2021-01-17";
      apiPost(
        scoring_url,
        tokenResponse.access_token,
        payload,
        function (response) {
          let parsedPostResponse;
          try {
            parsedPostResponse = JSON.parse(this.responseText);
          } catch (ex) {
            console.log(ex);
          }
          res.status(200).json(parsedPostResponse.predictions[0].values[0][0]);
        },
        function (error) {
          console.log(error);
          res.status(401).send(error);
        }
      );
    }
  );
});

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);
