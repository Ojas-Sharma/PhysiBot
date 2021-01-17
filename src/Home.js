import React from "react";
import "./Home.css";
import bgImage from "./assets/home_1.jpg";
function Home() {
  return (
    <div className="home">
      <div className="home__left half">
        <h1>Health diagnosis is a click away!</h1>
        <h2>
          Use our advanced Machine Learning algorithms to predict what disease
          you could be suffering from and get the doctor's location instantly.
        </h2>
        <a href="/">
          <div className="home__button">Try it out for free</div>
        </a>
      </div>
      <div className="home__right half">
        <img alt="home bg" src={bgImage} />
      </div>
    </div>
  );
}

export default Home;
