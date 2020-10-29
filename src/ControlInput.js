import React, { useState, useContext, useEffect } from "react";
import WizardContext from "./WizardContext";

export default ({ page, control }) => {
  const [value, setValue] = useState(control ? control.value : "");
  const context = useContext(WizardContext);
  useEffect(() => {
    let cValue = context.getFormValue(page.id, control.id);
    if (value !== cValue) {
      context.setFormValue(page.id, control.id, value);
    }
  }, [value]);
  //to synchronize

  if (!page) {
    return "";
  }

  function updateValue(event) {
    setValue(event.target.value);
  }
  return <input type="text" value={value} onChange={updateValue} />;
};
