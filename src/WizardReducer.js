/* eslint-disable no-console */
import React, {
  useState, useEffect, useReducer,
} from 'react';

import produce, { enableMapSet, enableES5 } from 'immer';
import WizardContext from './WizardContext';
import wizardReducer, {
  currentPage, firstPage, lastPage, nextPage, pageList, prevPage, reducerActions, getDataValue, pagesYouCanGoTo,
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
  const [state, dispatch] = useReducer(wizardReducer, produce(INITIAL, (draft) => {
    Object.keys(INITIAL).forEach((prop) => {
      if (prop in props) {
        draft[prop] = props[prop];
      }
    });
  }));

  const [actions] = useState(
    // eslint-disable-next-line arrow-body-style
    Object.keys(reducerActions).reduce((newActions, action) => {
      return ({ ...newActions, [action]: (...args) => dispatch({ action, args }) });
    }, {}),
  );

  const [current, setCurrent] = useState(null);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [first, setFirst] = useState(null);
  const [last, setLast] = useState(null);
  const [list, setList] = useState([]);
  const [youCanGoTo, setYouCanGoTo] = useState([]);

  useEffect(() => {
    setFirst(firstPage(state));
    setLast(lastPage(state));
  }, [list]);

  useEffect(() => {
    setList(pageList(state));
    setYouCanGoTo(pagesYouCanGoTo(state));
  }, [state.pages]);

  useEffect(() => {
    setCurrent(currentPage(state));
    setNext(nextPage(state));
    setPrev(prevPage(state));
  }, [state.currentPageId, state.pages]);

  return (
    <WizardContext.Provider value={{
      ...actions,
      ...state,
      state,
      actions,
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
      {props.children}
    </WizardContext.Provider>
  );
};
