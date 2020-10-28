import React, { useState, useEffecct, useContext, useEffect } from "react";
import WizardContext from "../WizardContext";

export default ({}) => {
  const wizardContext = useContext(WizardContext);

  useEffect(() => {
    console.log("wizardContext: ", wizardContext);
  }, [wizardContext]);

  useEffect(() => {
    wizardContext.addPage("first", "First Page");
    wizardContext.addPage("next", "Next Page");
    wizardContext.addPage("the one where Rachel marries Ross", "Friends Page");
    wizardContext.addPage("last", "Last Page");
  }, []);

  if (!wizardContext) return "";

  const { prev, next, currentPageId, pageList } = wizardContext;
  return (
    <>
      <h1>The Great Tree of Wizards! Page {currentPageId}</h1>
      <ul>
        {pageList.map((page) => (
          <li>
            <b>
              ({page.order}) {page.id}
            </b>
            {page.title}
            {page.id === currentPageId ? ` (current)` : ""}
          </li>
        ))}
      </ul>
      <div>{prev && "previous: " + prev.id}</div>
      <div>{next && "next: " + next.id}</div>
      <div>
        {prev && <button onClick={wizardContext.goPrev}>Prev</button>}
        {wizardContext.next && (
          <button onClick={wizardContext.goNext}>Next</button>
        )}
      </div>
    </>
  );
};
