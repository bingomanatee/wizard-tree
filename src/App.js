import React from "react";
import "./styles.css";
import Wizard from "./Wizard";
import WizardController from "./WizardController";

export default function App() {
  return (
    <div className="App">
      <h1>Wizard Tree</h1>
      <h2>Because its wreckable!</h2>

      <Wizard>
        <WizardController />
      </Wizard>
    </div>
  );
}
