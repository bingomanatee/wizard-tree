import produce from 'immer';
import sortBy from 'lodash.sortby';
import flattenDeep from 'lodash.flattendeep';
import Data from './Data';
import Page from './Page';

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
  const ids = pageList(state).map(({ id }) => id);
  const index = ids.indexOf(currentPageId);
  if ((index <= 0) || (index >= ids.length)) return null;
  return pages.get(ids[index - 1]);
};

export const nextPage = (state) => {
  const { currentPageId, pages } = state;
  const ids = pageList(state).map(({ id }) => id);
  const index = ids.indexOf(currentPageId);
  if ((index < 0) || (index >= ids.length - 1)) return null;
  return pages.get(ids[index + 1]);
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
  sortBy([...page.data.values()], 'order').forEach((data, order) => {
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
 * this is a gnarly computation and you are more than welcome
 * to not use it in your navigation.
 *
 * The theory is this:
 * 1. exclude pages you cannot go to (canGoTo === false)
 * 2. Add all the pages that have been manually targeted as reachable (canGoTo === true)
 * 3. get a contiguous list of all the remaining complete pages -- from the first one
 *    to the last complete page
 * 4. Add the next page (done with page B, C is accessible)
 *
 * again - you might have a different navigation scheme in mind but this one
 * is a sensible norm.
 *
 * @returns {Pages[]}
 */
export const pagesYouCanGoTo = (state) => {
  // step 1: exclude unGoable
  const list = pageList(state).filter((page) => page.canGoTo !== false);

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
  addPages: (newPages) => (state) => {
    let cb = null;
    if (typeof newPages[pageList.length - 1] === 'function') cb = newPages.pop();
    newPages.forEach((page) => {
      _orderPageControls(page);
      state.pages.set(page.id, page);
    });
    if (typeof cb === 'function') cb(newPages);
  },

  addPageData: (pageId, props) => (state) => {
    const page = state.pages.get(pageId);
    if (!page) {
      console.log('cannot find a page', pageId);
      return;
    }
    const data = new Data(...props);
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

  goNext: () => (state) => {
    const next = nextPage(state);
    reducerActions.goToPage(nextPage(state))(state);
  },

  goPrev: () => (state) => {
    reducerActions.goToPage(prevPage(state))(state);
  },

  goToPage: (page) => (state) => {
    if (page && page.id && state.pages.has(page.id)) {
      state.currentPageId = page.id;
    }
  },
};

export default (state, action) => {
  if (reducerActions[action.action]) return produce(state, reducerActions[action.action](...action.args));
  return state;
};
