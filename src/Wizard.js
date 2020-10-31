/* eslint-disable no-console */
import React, { Component } from 'react';
import sortBy from 'lodash.sortby';
import produce, { enableMapSet, enableES5 } from 'immer';
import Page from './Page';
import Data from './Data';
import WizardContext from './WizardContext';

enableMapSet();
enableES5();

const INITIAL = {
  title: 'wizard',
  pages: new Map(),
  currentPageId: null,
  data: new Map(),
};

const ALLOWED_FUNCTIONS = `getPageState,setPageState,getDataState,setDataState,addPage,addPages,goNext,${
  'addPageData,goToPageId,goPrev,setPages,getDataValue,setDataValue'.split(',')}`;
const ALLOWED_PROPERTIES = 'pagesYouCanGoTo,firstPage,prevPage,nextPage,currentPage,pageList'.split(',');

export default class WizardManager extends Component {
  constructor(props) {
    super(props);
    this.state = produce(INITIAL, () => {
    });
  }

  addPageData(pageId, ...args) {
    let page = this.pages.get(pageId);
    if (!page) {
      console.log('cannot find a page', pageId);
      return;
    }
    page = page.clone();
    const data = new Data(...args);
    if (data.id) {
      page.data.set(data.id, data);
      const { pages } = this;
      pages.set(page.id, page);
      this.pages = pages;
    }
  }

  get firstPage() {
    let first = null;
    this.pages.forEach((page) => {
      console.log(
        'first',
        first && first.id,
        first && first.order,
        'page: ',
        page.id,
        page.order,
      );
      if (!first) first = page;
      else if (first.order > page.order) {
        first = page;
      }
    });

    return first;
  }

  goToPageId(id, cb) {
    if (!id) return;
    const { currentPageId } = this.state;
    if (id === this.state.currentPageId) return;
    console.log('going to ', id, 'from ', currentPageId);
    if (this.pages.has(id)) {
      this.setState(
        (state) => produce(state, (draft) => {
          draft.currentPageId = id;
        }),
        cb,
      );
    } else {
      console.log('goToPageId: no id ', id);
    }
  }

  goFirst() {
    const first = this.firstPage;
    if (first) {
      this.goToPageId(first.id);
    }
  }

  get currentPage() {
    const { pages, currentPageId } = this.state;
    if (!currentPageId) return null;
    return pages.get(currentPageId);
  }

  get nextPage() {
    const { currentPage } = this;
    if (!currentPage) return null;
    let next = null;
    this.state.pages.forEach((page) => {
      if (page.canGoTo === false) return;
      if (page.order <= currentPage.order) return;
      if (!next || next.order > page.order) next = page;
    });
    return next;
  }

  get prevPage() {
    const { currentPage } = this;
    if (!currentPage) return null;
    let prev = null;
    this.state.pages.forEach((page) => {
      if (page.canGoTo === false) return;
      if (page.order >= currentPage.order) return;
      if (!prev || prev.order < page.order) prev = page;
    });
    return prev;
  }

  goNext() {
    const { nextPage } = this;
    if (nextPage) {
      this.goToPageId(nextPage.id);
    } else {
      console.log('cannot go to next page');
    }
  }

  goPrev() {
    const { prevPage } = this;
    if (!prevPage) {
      console.log('cannot go to prev page');
    } else {
      this.goToPageId(prevPage.id);
    }
  }

  get pages() {
    return this.state.pages;
  }

  set pages(pages) {
    this.setPages(pages);
  }

  setPages(pages, cb) {
    this.setState((state) => produce(state, (draft) => {
      draft.pages = pages;
    }), cb);
  }

  getDataValue(pageId, dataId) {
    const page = this.pages.get(pageId);
    if (!page) {
      return null;
    }
    const data = page.data.get(dataId);
    if (!data) {
      return null;
    }
    return data.value;
  }

  setDataValue(pageId, dataId, value, cb) {
    this.setState((state) => produce(state, (draft) => {
      const page = draft.pages.get(pageId);
      if (!page) {
        return draft;
      }
      const data = page.data.get(dataId);
      if (!data) {
        return draft;
      }
      data.value = value;
      return draft;
    }), cb);
  }

  _makePage(...args) {
    if (args[0] instanceof Page) return args[0];
    const page = new Page(...args);
    if (!page.id) {
      console.log('cannot add page without id:', page);
      return;
    }

    if (page.order === null) {
      page.order = -1;
      this.pages.forEach((otherPage) => {
        if (otherPage.order > page.order) {
          page.order = otherPage.order;
        }
      });
      page.order += 1;
    }

    return page;
  }

  addPage(...args) {
    let cb = null;
    if (typeof args[args.length - 1] === 'function') cb = args.pop();

    const page = this._makePage(...args);

    this.setState(
      (state) => produce(state, ({ pages }) => {
        pages.set(page.id, page);
      }),
      cb,
    );
    // @TODO: check for duplicate orders and IDs
  }

  addPages(pages, cb) {
    let { state } = this;
    pages.forEach((page) => {
      const newPage = this._makePage(page);
      state = produce(state, (draft) => {
        draft.pages.set(newPage.id, newPage);
      });
    });
    this.setState(state, cb);
  }

  get pageList() {
    const { pages } = this;
    const pageList = [];
    pages.forEach((page) => pageList.push(page));
    return sortBy(pageList, 'order', 'id');
  }

  /**
   * this is a gnarly computation and you are more than welcome
   * to not use it in your navigation.
   *
   * The theory is this:
   * 1. exclude pages you cannot go to
   * 2. get a contiguous list of all the remaining complete pages -- from the first one
   *    to the last complete page
   * 3. Add the next page (done with page B, C is accessible)
   * 4. Add all the pages that have been manually targeted as reachable
   *
   * again - you might have a different navigation scheme in mind but this one
   * is a sensible norm.
   *
   * @returns {Pages[]}
   */
  get pagesYouCanGoTo() {
    // step 1: exclude unGoable
    const list = this.pageList.filter((page) => page.canGoTo !== false);
    const canNav = new Set();
    // step 2: contiguous completed
    let index = 0;
    while (list[index] && list[index].isComplete) {
      canNav.add(list[index]);
      index += 1;
    }

    // step 3: first next page
    if (list[index]) {
      canNav.add(list[index]);
    }

    // step 4
    list.forEach((page) => {
      if (page.canGoTo === true) canNav.add(page.canGoTo);
    });

    // return as ordered array
    return sortBy([...canNav], 'order');
  }

  componentDidUpdate() {
    const { pages, currentPageId } = this.state;

    if (!currentPageId && pages.size) {
      this.goFirst(true);
    }
  }

  updatePage(pageId, update, cb) {
    if (!update) {
      console.log('updatePage: no update', pageId, update);
      return;
    }

    // eslint-disable-next-line consistent-return
    this.setState((state) => produce(state, (draft) => {
      const page = draft.pages.get(pageId);
      if (!page) {
        console.log('updatePage: no page ', pageId, update);
        return;
      }
      if (typeof update === 'function') {
        draft.pages.set(pageId, update(page));
      } else if (typeof update === 'object') {
        draft.pages.set(pageId, Object.assign(page, update));
      }
    }), cb);
  }

  getPageState(pageId, stateName) {
    if (!pageId || !stateName) {
      console.log('getPageState requires pageId and stateName: given', pageId, stateName);
      return null;
    }
    const page = this.pages.get(pageId);
    if (page) {
      return page.state[stateName];
    }
    console.log('cannot find page ', pageId);
    return null;
  }

  setPageState(pageId, stateName, stateValue, cb) {
    if (!pageId || !stateName) {
      console.log('setPageState requires pageId and stateName: given', pageId, stateName);
      return null;
    }
    return this.updatePage(pageId, (page) => {
      page.state[stateName] = stateValue;
    }, cb);
  }

  getDataState(pageId, dataId, stateName) {
    if (!dataId || !pageId || !stateName) {
      console.log('getDatatate requires pageId, dataId and stateName: given', pageId, dataId, stateName);
      return null;
    }
    const page = this.pages.get(pageId);
    if (page) {
      const data = page.data.get(dataId);
      if (data) {
        return data.state[stateName];
      }
    }
    console.log('cannot find page data', pageId, dataId);
    return null;
  }

  setDatatate(pageId, dataId, stateName, value, cb) {
    if (!dataId || !pageId || !stateName) {
      console.log('setDatatate requires pageId, dataId and stateName: given', pageId, dataId, stateName);
      return null;
    }

    return this.updatePage(pageId, (page) => {
      if (page) {
        const data = page.data.get(dataId);
        if (data) {
          data.state[stateName] = value;
        }
      }
    }, cb);
  }

  get proxy() {
    if (typeof Proxy === 'undefined') {
      console.log('no proxy - returning immer');
      return produce(this.state, (draft) => {
        ALLOWED_PROPERTIES.forEach((pName) => {
          draft[pName] = this[pName];
        });
        ALLOWED_FUNCTIONS.forEach((fnName) => {
          draft[fnName] = (...args) => this[fnName](...args);
        });
      });
    }

    return new Proxy(this, {
      get(target, property) {
        if (property in target.state) {
          return target.state[property];
        }
        if (ALLOWED_FUNCTIONS.includes(property)) {
          return target[property].bind(target);
        }
        if (ALLOWED_PROPERTIES.includes(property)) {
          return target[property];
        }
        return null;
      },
      has(target, property) {
        // eslint-disable-next-line max-len
        return (property in target.state) || ALLOWED_PROPERTIES.includes(property) || ALLOWED_FUNCTIONS.includes(property);
      },
      set(target, property, value) {
        if (property in target.state) {
          target.setState((draft) => draft[property] = value);
        } else {
          console.log('attempt to set read-only property', property, 'to', value);
        }
      },
    });
  }

  render() {
    return (
      <WizardContext.Provider value={this.proxy}>
        {this.props.children}
      </WizardContext.Provider>
    );
  }
}
