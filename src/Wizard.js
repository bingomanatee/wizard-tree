import React, { Component } from "react";
import Page from "./Page";
import Control from "./Control";
import sortBy from "lodash.sortby";
import WizardContext from "./WizardContext";
import isEqual from "lodash.isequal";
import produce, { enableMapSet } from "immer";
enableMapSet();

const INITIAL = {
  title: "wizard",
  pages: new Map(),
  currentPageId: null,
  controls: new Map()
};

export default class WizardManager extends Component {
  constructor(props) {
    super(props);
    this.state = produce(INITIAL, (draft) => {});
  }

  addPageControl(pageId, ...args) {
    let page = this.pages.get(pageId);
    if (!page) {
      console.log("cannot find a page", pageId);
      return;
    }
    page = page.clone();
    let control = new Control(...args);
    if (control.id) {
      page.controls.set(control.id, control);
      let pages = this.pages;
      pages.set(page.id, page);
      this.pages = pages;
    }
  }

  get firstPage() {
    let first = null;
    this.pages.forEach((page, id) => {
      console.log(
        "first",
        first && first.id,
        first && first.order,
        "page: ",
        page.id,
        page.order
      );
      if (!first) first = page;
      else if (first.order > page.order) {
        first = page;
      }
    });

    return first;
  }

  goId(id, cb) {
    if (!id) return;
    const { currentPageId } = this.state;
    if (id === this.state.currentPageId) return;
    console.log("going to ", id, "from ", currentPageId);
    if (this.pages.has(id)) {
      this.setState(
        (state) =>
          produce(state, (draft) => {
            draft.currentPageId = id;
          }),
        cb
      );
    } else {
      console.log("goId: no id ", id);
    }
  }

  goFirst() {
    let first = this.firstPage;
    if (first) {
      this.goId(first.id);
    }
  }

  get currentPage() {
    const { pages, currentPageId } = this.state;
    if (!currentPageId) return null;
    return pages.get(currentPageId);
  }

  get nextPage() {
    let currentPage = this.currentPage();
    if (!currentPage) return null;
    let next = null;
    this.state.pages.forEach((page, id) => {
      if (page.order <= currentPage.order) return;
      if (!next || next.order > page.order) next = page;
    });
    return next;
  }

  get prevPage() {
    let currentPage = this.currentPage;
    if (!currentPage) return null;
    let prev = null;
    this.state.pages.forEach((page, id) => {
      if (page.order >= currentPage.order) return;
      if (!prev || prev.order < page.order) prev = page;
    });
    return prev;
  }

  goNext() {
    const nextPage = this.nextPage;
    if (nextPage) {
      this.goId(nextPage.id);
    } else {
      console.log("cannot go to next page");
    }
  }

  goPrev() {
    const prevPage = this.prevPage;
    if (!prevPage) {
      console.log("cannot go to prev page");
    } else {
      this.goId(prevPage.id);
    }
  }

  get pages() {
    return this.state.pages;
  }

  set pages(pages) {
    this.setState(produce(this.state, (draft) => (draft.pages = pages)));
  }

  setPages(pages, cb) {
    this.setState(
      produce(this.state, (draft) => {
        draft.pages = pages;
      }),
      cb
    );
  }

  getFormValue(pageId, controlId) {
    let page = this.pages.get(pageId);
    if (!page) {
      return null;
    }
    let control = page.controls.get(controlId);
    if (!control) {
      return null;
    }
    return control.value;
  }

  setFormValue(pageId, controlId, value) {
    let page = this.pages.get(pageId);
    if (!page) {
      return null;
    }
    page = page.clone();
    let control = page.controls.get(controlId);
    if (!control) {
      return null;
    }
    control = control.clone();
    control.value = value;
    page.controls.set(control.id, control);
    let pages = this.pages;
    pages.set(page.id, page);
    this.pages = pages;
  }

  addPage(...args) {
    let cb = null;
    if (typeof args[args.length - 1] === "function") cb = args.pop();

    const page = new Page(...args);
    if (!page.id) {
      console.log("cannot add page without id:", page);
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

    this.setState(
      (state) =>
        produce(state, ({ pages }) => {
          pages.set(page.id, page);
        }),
      cb
    );
    // @TODO: check for duplicate orders and IDs
  }

  get pageList() {
    return sortBy(Array.from(this.pages.values()), "order", "id");
  }

  componentDidUpdate() {
    const { pages, currentPageId } = this.state;

    if (!currentPageId && pages.size) {
      this.goFirst();
    }
  }

  updatePage(id, update, cb) {
    if (!update) {
      console.log("updatePage: no update", id, update);
    }
    this.setState((state) => {
      let page = state.pages.get(id);
      if (!page) {
        console.log("updatePage: no page ", id, update);
        return;
      }
      if (typeof update === "function") {
        state.pages.set(id, update(page));
      } else if (typeof update === "object") {
        state.pages.set(id, { ...page, ...update });
      }
    }, cb);
  }

  proxy() {
    if (typeof Proxy === 'undefined') {
      return produce(this.state, (draft) => {
        pageList: this.pageList, 

      })
    }
  }

  render() {
    return (
      <WizardContext.Provider value={this.proxy}>
        {this.props.children}
      </WizardContext.Provider>
    );
  }
}
