/* eslint-disable no-console */
import React, {
  useState, useEffect, useReducer,
} from 'react';

import produce, { enableMapSet, enableES5 } from 'immer';
import WizardContext from './WizardContext';
import wizardReducer, {
  currentPage,
  firstPage,
  lastPage,
  nextPage,
  pageList,
  prevPage,
  getDataValue,
  pagesYouCanGoTo,
  dispatchedActions,
} from './actions';

enableMapSet();
enableES5();

const INITIAL = {
  title: 'wizard',
  pages: new Map(),
  currentPageId: null,
  data: new Map(),
};

export default (props) => {
  // -- the initial state is optionally enhanced by the Wizard props' values on load
  // -- subsequent to the first load, use methods of the context to update.
  const [state, dispatch] = useReducer(wizardReducer, produce(INITIAL, (draft) => {
    Object.keys(INITIAL)
      .forEach((prop) => {
        if (prop in props) {
          draft[prop] = props[prop];
        }
      });
  }));

  const [actions] = useState(dispatchedActions(dispatch));

  const [current, setCurrent] = useState(null);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [first, setFirst] = useState(null);
  const [last, setLast] = useState(null);
  const [list, setList] = useState([]);
  const [youCanGoTo, setYouCanGoTo] = useState([]);

  /* ---------------- DERIVED VALUES ------------------- */

  useEffect(() => {
    setList(pageList(state));
    setYouCanGoTo(pagesYouCanGoTo(state));
  }, [state.pages]);

  useEffect(() => {
    setFirst(firstPage(state));
    setLast(lastPage(state));
    setNext(nextPage(state));
    setPrev(prevPage(state));
  }, [list]);

  useEffect(() => {
    setCurrent(currentPage(state));
  }, [state.currentPageId, state.pages]);

  return (
    <WizardContext.Provider value={{
      ...actions,
      ...state,
      actions,
      state,
      firstPage: first,
      lastPage: last,
      currentPage: current,
      pageList: list,
      prevPage: prev,
      nextPage: next,
      pagesYouCanGoTo: youCanGoTo,
      getDataValue: getDataValue(state),
    }}
    >
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </WizardContext.Provider>
  );
};
