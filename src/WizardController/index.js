import React, { useState, useEffecct, useContext, useEffect } from "react";
import Control from "../Control";
import PageView from "./PageView";
import WizardContext from "../WizardContext";

export default ({}) => {
  const wizardContext = useContext(WizardContext);

  useEffect(() => {
    console.log("wizardContext: ", wizardContext);
  }, [wizardContext]);

  useEffect(() => {
    let firstPageControl = new Control("name", "userName", "Bob");
    let firstPageControlMap = new Map();
    firstPageControlMap.set(firstPageControl.id, firstPageControl);
    wizardContext.addPage("first", "First Page", 1, firstPageControlMap);
    wizardContext.addPage("next", "Next Page", 2);
    wizardContext.addPage(
      "the one where Rachel marries Ross",
      "Friends Page",
      3
    );
    wizardContext.addPage("last", "Last Page", 4);
  }, []);

  if (!wizardContext) return "";
  console.log('pageList: ', wizardContext.pageList);
  const { prevPage, nextPage, currentPageId, pageList, currentPage } = wizardContext;
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
      <div>{prevPage && "previous: " + prevPage.id}</div>
      <div>{nextPage && "next: " + nextPage.id}</div>
      <PageView page={currentPage}></PageView>
      <div>
        {prevPage && <button onClick={wizardContext.goPrev}>Prev</button>}
        {nextPage && (
          <button onClick={wizardContext.goNext}>Next</button>
        )}
      </div>
    </>
  );
};
