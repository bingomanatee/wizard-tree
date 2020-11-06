import { immerable } from 'immer';

export default class Page {
  [immerable] = true

  constructor(id, title, {
    order = null,
    data = [],
    parent = null,
    isComplete = null,
    canGoTo = null,
    View = null,
    state = {},
  } = {}) {
    this._id = id;
    this.title = title;
    this.order = order;
    this.data = data;
    this.parent = parent;
    this.isComplete = isComplete;
    this.canGoTo = canGoTo;
    this.View = View;
    this.state = state;
  }

  get id() {
    return this._id;
  }

  set data(dataMap) {
    if (Array.isArray(dataMap)) {
      const map = new Map();
      dataMap.forEach((c) => map.set(c.id, c));
      this._data = map;
    }
    if (dataMap instanceof Map) {
      this._data = dataMap;
    }
  }

  get data() {
    if (!this._data) this._data = new Map();
    return this._data;
  }

  /**
   * isComplete is true if there are no REQUIRED data items that do not have a valid value.
   * so, a page with no data is always complete.
   * As is a page with no REQUIRED data.
   *
   * If you have a more complicated definition of whether or not a page is complete,
   * you can manually set the complete status of a page externally.
   *
   * @returns {boolean|*}
   */
  get isComplete() {
    if (this._isComplete !== null) {
      if (typeof this._isComplete === 'function') return this._isComplete(this);
      return !!this._isComplete;
    }

    let complete = true;
    this.data.forEach((control) => {
      if (!complete) return;
      if (control.required && !control.hasValidValue) {
        complete = false;
      }
    });
    return complete;
  }

  set isComplete(value) {
    this._isComplete = value;
  }

  /**
   * note - default canGoTo === null; meaning page has no special opinion as to whether or not to navigate to it.
   * If set to True or False, page will always (or never) be clickable/navicable to.
   *
   * note - if you need to change canGoTo based on external conditions, i.e., files loaded, api response,
   * its best NOT to put a function into canGoTo, but rather to update it with a scalar externally.
   *
   * @returns {true, false, or null}
   */
  get canGoTo() {
    if (typeof this._canGoTo === 'function') {
      return this._canGoTo(this);
    }
    return this._canGoTo;
  }

  set canGoTo(value) {
    this._canGoTo = value;
  }
}
