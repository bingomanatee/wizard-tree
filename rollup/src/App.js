import React from 'react';
import './styles.css';
import Wizard from './Wizard';
import WizardController from './WizardController';

export default function App() {
  return (
    <div className="App">
      <Wizard>
        <WizardController />
      </Wizard>
    </div>
  );
}
