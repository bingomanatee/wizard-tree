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

  get isComplete() {
    if (this._isComplete !== null) {
      if (typeof this._isComplete === 'function') return this._isComplete(this);
      return this._isComplete;
    }

    let complete = true;
    this.data.forEach((control) => {
      if (!complete) return;
      if (!control.hasValidValue) {
        complete = false;
      }
    });
    return complete;
  }

  set isComplete(value) {
    this._isComplete = value;
  }

  /**
   * note - default canGoTo === null; meaning page has no special
   * opinion as to whether or not to navigate to it.
   * If set to True or False, page will always (or never) be clickable/navicable to.
   * @returns {*}
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
