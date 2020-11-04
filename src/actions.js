import produce from 'immer';
import sortBy from 'lodash.sortby';
import flattenDeep from 'lodash.flattendeep';
import Data from './Data';
import Page from './Page';

/**
 * returns false if field is of wrong type
 * @param field
 * @param context {String} optional, the calling context for better messaging
 * @returns {boolean}
 */
const checkField = (field, context = 'Wizard action') => {
  if (!(field && (typeof field === 'string'))) {
    console.log('bad field ', field, 'submitted to ', context);
    return false;
  }
  return true;
};

const checkFieldNoId = (...args) => args[0] !== 'id' && checkField(...args);

export const pageList = ({ pages }) => sortBy([...pages.values()], 'order');

export const currentPage = ({ currentPageId, pages }) => pages.get(currentPageId);

export const firstPage = (state) => {
  const list = pageList(state);
  return list ? list.shift() : null;
};

export const lastPage = (state) => {
  const list = pageList(state);
  return list ? list.pop() : null;
};

export const prevPage = (state) => {
  const { currentPageId, pages } = state;
  const ids = pageList(state)
    .map(({ id }) => id);
  const index = ids.indexOf(currentPageId);
  if ((index <= 0) || (index >= ids.length)) return null;
  return pages.get(ids[index - 1]);
};

export const nextPage = (state) => {
  const { currentPageId, pages } = state;
  const ids = pageList(state)
    .map(({ id }) => id);
  const index = ids.indexOf(currentPageId);
  if ((index < 0) || (index >= ids.length - 1)) return null;
  return pages.get(ids[index + 1]);
};

const nextGoablePage = (state) => {
  const { currentPageId, pages } = state;
  if (!currentPageId) return null;
  const ids = pageList(state)
    .map(({ id }) => id);
  const index = ids.indexOf(currentPageId);
  if ((index < 0) || (index >= ids.length - 1)) return null;
  const subsequent = ids.slice(index + 1);
  while (subsequent.length) {
    const id = subsequent.shift();
    if (id !== currentPageId) {
      const page = pages.get(id);
      if (page.canGoTo !== false) return page;
    }
  }
  return null;
};

const prevGoablePage = (state) => {
  const { currentPageId, pages } = state;
  if (!currentPageId) return null;
  const ids = pageList(state)
    .map(({ id }) => id);
  const index = ids.indexOf(currentPageId);
  if ((index < 0) || (index >= ids.length - 1)) return null;
  const previous = ids.slice(0, index);
  while (previous.length) {
    const id = previous.pop();
    if (id !== currentPageId) {
      const page = pages.get(id);
      if (page.canGoTo !== false) return page;
    }
  }
  return null;
};

/**
 * returns a function that accesses a particular datum's value
 *
 * @param state
 * @returns {function(*=, *=): (any|null)}
 */
export const getDataValue = (state) => (pageId, dataId) => {
  if (!state) return undefined;

  const page = state.pages.get(pageId);
  if (!page) {
    return null;
  }
  const data = page.data.get(dataId);
  if (!data) {
    return null;
  }
  return data.value;
};

const _orderPageControls = (page) => {
  sortBy([...page.data.values()], 'order')
    .forEach((data, order) => {
      data.order = order;
    });
};

const _makePage = (...args) => {
  if (args[0] instanceof Page) return args[0];
  const page = new Page(...args);

  if (page.order === null) {
    page.order = -1;
    this.pages.forEach((otherPage) => {
      if (otherPage.order > page.order) {
        page.order = otherPage.order;
      }
    });
    page.order += 1;
  }
  _orderPageControls(page);
  return page;
};

/**
 * pagesYouCanGoTo is a list of pages that the user has a legitimate right to navigate to.
 *
 * It is premised on these two assumptions:
 * 1. You must complete all required fields(data) on a page before going past it.
 * 2. once a page is complete you can access all following pages up to and including one with required fields
 * 3. Pages hard-coded as canGoTo === true can be accessed at all times.
 *
 * this is a gnarly computation and you are more than welcome to not use it in your navigation.
 *
 * This function returns pages by doing the following:
 * 1. exclude pages you cannot go to (canGoTo === false)
 * 2. Add all the pages that have been manually targeted as reachable (canGoTo === true)
 * 3. get a contiguous list of all the remaining complete pages -- from the first one
 *    to the last complete page (that is the last page without incomplete data)
 * 4. Add the next page (done with page B, C is accessible)
 *
 * again - you might have a different navigation scheme in mind but this one
 * is a sensible norm.
 *
 * @returns {Pages[]}
 */
export const pagesYouCanGoTo = (state) => {
  // step 1: exclude unGoable
  const list = pageList(state)
    .filter((page) => page.canGoTo !== false);

  const canNav = new Set(list.filter((p) => p.canGoTo === true));
  // step 2: contiguous completed
  let index = 0;
  let page = list[index];
  while (page && (page.canGoTo === true || page.isComplete)) {
    canNav.add(page);
    index += 1;
    page = list[index];
  }

  // step 3: first next page
  if (list[index]) {
    canNav.add(list[index]);
  }

  // return as ordered array
  return sortBy([...canNav], 'order');
};

export const reducerActions = {

  addPage: (...args) => (state) => {
    let cb = null;
    if (typeof args[args.length - 1] === 'function') cb = args.pop();

    const page = _makePage(...args);
    _orderPageControls(page);
    state.pages.set(page.id, page);
    if (typeof cb === 'function') cb(page);
  },

  // note - addPages requires an array pf Page instances
  addPages: (...pages) => (state) => {
    const newPages = flattenDeep(pages);
    let cb = null;
    if (typeof newPages[pageList.length - 1] === 'function') cb = newPages.pop();
    newPages.forEach((page) => {
      _orderPageControls(page);
      state.pages.set(page.id, page);
    });
    if (typeof cb === 'function') cb(newPages);
  },

  addPageData: (pageId, ...props) => (state) => {
    const page = state.pages.get(pageId);
    if (!page) {
      console.log('cannot find a page', pageId);
      return;
    }
    const data = (props[0] instanceof Data) ? Data : new Data(...props);
    if (data.id) {
      page.data.set(data.id, data);
    }
  },

  setDataValue: (pageId, dataId, value) => (state) => {
    const page = state.pages.get(pageId);
    if (!page) {
      return;
    }
    const data = page.data.get(dataId);
    if (!data) {
      return;
    }
    data.value = value;
  },

  goToPageId: (pageId) => (state) => {
    if (state.pages.has(pageId)) {
      state.currentPageId = pageId;
    } else {
      console.log('goToPageId: no page ', pageId);
    }
  },

  goFirst: () => (state) => {
    const first = firstPage(state);
    if (first) {
      reducerActions.goToPageId(first.id)(state);
    } else {
      console.log('goFirst: no first page');
    }
  },

  goLast: () => (state) => {
    const last = lastPage(state);
    if (last) {
      reducerActions.goToPageId(last.id)(state);
    } else {
      console.log('goLast: no last page');
    }
  },

  goNext: (goable) => (state) => {
    if (goable) {
      const next = nextGoablePage(state);
      if (next) {
        reducerActions.goToPage(next)(state);
      }
    } else {
      reducerActions.goToPage(nextPage(state))(state);
    }
  },

  goPrev: (goable) => (state) => {
    if (goable) {
      const prev = prevGoablePage(state);
      if (prev) {
        reducerActions.goToPage(prev)(state);
      }
    } else {
      reducerActions.goToPage(prevPage(state))(state);
    }
  },

  goToPage: (page) => (state) => {
    if (page && page.id && state.pages.has(page.id)) {
      state.currentPageId = page.id;
    }
  },

  setPageProp: (pageId, field, value) => (state) => {
    if (!checkFieldNoId(field, 'setPageProp')) {
      return;
    }
    if (state.pages.has(pageId)) {
      const page = state.pages.get(pageId);
      if (field in page) {
        page[field] = value;
      } else {
        console.log('setPageProp - can only set existing fields of page ', page, 'not ', field);
      }
    } else {
      console.log('setPagePoop: no page ', pageId);
    }
  },

  setPageStateField: (pageId, field, value) => (state) => {
    if (!checkField(field, 'setPageStateField')) {
      return;
    }
    if (state.pages.has(pageId)) {
      const page = state.pages.get(pageId);
      page.state[field] = value;
    } else {
      console.log('setPageStateField: no page ', pageId);
    }
  },

  setPageDataProp: (pageId, dataId, field, value) => (state) => {
    if (!checkFieldNoId(field, 'setPageDataProp')) {
      return;
    }
    if (state.pages.has(pageId)) {
      const page = state.pages.get(pageId);
      if (page.data.has(dataId)) {
        const dataItem = page.data.get(dataId);
        if (field in dataItem) {
          dataItem[field] = value;
        } else {
          console.log('setPageDataProp: cannot assign new field ', field, 'in ', dataItem, 'of', page);
        }
      } else {
        console.log('setPageDataProp: no data ', dataId, 'in page', pageId);
      }
    } else {
      console.log('setPageDataProp: no page ', pageId);
    }
  },
  setPageDataStateField: (pageId, dataId, field, value) => (state) => {
    if (!checkField(field, 'setPageDataStateField')) {
      return;
    }
    if (state.pages.has(pageId)) {
      const page = state.pages.get(pageId);
      if (page.data.has(dataId)) {
        const dataItem = page.data.get(dataId);
        dataItem.state[field] = value;
      } else {
        console.log('setPageDataProp: no data ', dataId, 'in page', pageId);
      }
    } else {
      console.log('setPageDataProp: no page ', pageId);
    }
  },
};

// eslint-disable-next-line arrow-body-style
export const dispatchedActions = (dispatch) => {
  // eslint-disable-next-line arrow-body-style
  return Object.keys(reducerActions)
    .reduce((newActions, action) => (
      {
        ...newActions,
        [action]: (...args) => dispatch({
          action,
          args,
        }),
      }), {});
};

export default (state, action) => {
  if (reducerActions[action.action]) return produce(state, reducerActions[action.action](...action.args));
  return state;
};
