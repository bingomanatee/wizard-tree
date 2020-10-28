import React, { useState, useEffecct, useContext, useEffect } from "react";
import WizardContext from "../WizardContext";

export default ({}) => {
  const wizardContext = useContext(WizardContext);

  useEffect(() => {
    wizardContext.addPage("page-one", "Page One");
    wizardContext.addPage("page-two", "Page Two");
    wizardContext.addPage("page-Three", "Page Three");
  }, []);
};
