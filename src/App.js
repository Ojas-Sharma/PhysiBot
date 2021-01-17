import "./App.css";
import Home from "./Home";
import Navbar from "./Navbar";
import Predictor from "./Predictor";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <Switch>
      <div className="App">
        <Navbar />
        <Route path="/predictor" exact>
          <Predictor />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </div>
    </Switch>
  );
}

export default App;
