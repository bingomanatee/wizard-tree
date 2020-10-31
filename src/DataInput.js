import React, { useState, useContext, useEffect } from 'react';
import WizardContext from './WizardContext';

export default ({ page, data }) => {
  const [value, setValue] = useState(data ? data.value : '');
  const context = useContext(WizardContext);
  useEffect(() => {
    const cValue = context.getDataValue(page.id, data.id);
    if (value !== cValue) {
      context.setDataValue(page.id, data.id, value);
    }
  }, [value]);
  // to synchronize

  if (!page) {
    return '';
  }

  function updateValue(event) {
    setValue(event.target.value);
  }
  return <input type="text" value={value} onChange={updateValue} />;
};
