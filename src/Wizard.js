import React, { Component } from "react";
import Page from "./Page";
import Control from "./Control";
import sortBy from "lodash.sortby";
import WizardContext from "./WizardContext";
import isEqual from "lodash.isequal";
export default class WizardManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "wizard",
      pages: new Map(),
      currentPageId: null,
      controls: new Map()
    };
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

  firstPage() {
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
      this.setState({ currentPageId: id }, cb);
    } else {
      console.log("goId: no id ", id);
    }
  }

  goFirst() {
    let first = this.firstPage();
    if (first) {
      this.goId(first.id);
    }
  }

  currentPage() {
    const { pages, currentPageId } = this.state;
    if (!currentPageId) return null;
    return pages.get(currentPageId);
  }

  nextPage() {
    let currentPage = this.currentPage();
    if (!currentPage) return null;
    let next = null;
    this.state.pages.forEach((page, id) => {
      if (page.order <= currentPage.order) return;
      if (!next || next.order > page.order) next = page;
    });
    return next;
  }

  prevPage() {
    let currentPage = this.currentPage();
    if (!currentPage) return null;
    let prev = null;
    this.state.pages.forEach((page, id) => {
      if (page.order >= currentPage.order) return;
      if (!prev || prev.order < page.order) prev = page;
    });
    return prev;
  }

  goNext() {
    const nextPage = this.nextPage();
    if (nextPage) {
      this.goId(nextPage.id);
    } else {
      console.log("cannot go to next page");
    }
  }

  goPrev() {
    const prevPage = this.prevPage();
    if (!prevPage) {
      console.log("cannot go to prev page");
    } else {
      this.goId(prevPage.id);
    }
  }

  get pages() {
    return this.state.pages;
  }

  set pages(map) {
    const pages = new Map(map);
    this.setState({ pages });
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

    const pages = this.pages;
    pages.set(page.id, page);
    this.pages = pages;
    // @TODO: check for duplicate orders and IDs
  }

  pageList() {
    return sortBy(Array.from(this.pages.values()), "order", "id");
  }

  componentDidUpdate() {
    const { pages, currentPageId } = this.state;

    if (!currentPageId && pages.size) {
      this.goFirst();
    }
  }

  updatePage(id, update) {
    let page = this.pages.get(id);
    if (!update) {
      console.log("updatePage: no update", id, update);
    }
    if (!page) {
      console.log("updatePage: no page ", id, update);
      return;
    }
    if (typeof update === "function") {
      let newPage = update(page.clone());
      this.pages.set(newPage.id, newPage);
    } else if (typeof update === "object") {
      let newPage = page.clone(update);
      this.pages.set(newPage.id, newPage);
    } else {
      console.log("cannot update page with ", id, update);
    }
  }

  snapshot() {
    return {
      ...this.state,
      pageList: this.pageList(),
      first: this.firstPage(),
      next: this.nextPage(),
      prev: this.prevPage(),
      currentPage: this.currentPage(),
      updatePage: (...args) => this.updatePage(...args),
      nextPage: () => this.nextPage(),
      goNext: () => this.goNext(),
      goPrev: () => this.goPrev(),
      addPage: (...args) => this.addPage(...args),
      getFormValue: (...args) => this.getFormValue(...args),
      setFormValue: (...args) => this.setFormValue(...args)
    };
  }

  render() {
    return (
      <WizardContext.Provider value={this.snapshot()}>
        {this.props.children}
      </WizardContext.Provider>
    );
  }
}
