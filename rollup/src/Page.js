import { immerable } from 'immer';

export default class Page {
  [immerable] = true

  constructor(id, title, {
    order = null,
    controls = [],
    parent = null,
    isComplete = null,
    canGoTo = null,
    View = null,
  }) {
    this._id = id;
    this.title = title;
    this.order = order;
    this.controls = controls;
    this.parent = parent;
    this.isComplete = isComplete;
    this.canGoTo = canGoTo;
    this.View = View;
  }

  get id() {
    return this._id;
  }

  set controls(newControls) {
    if (Array.isArray(newControls)) {
      const map = new Map();
      newControls.forEach((c) => map.set(c.id, c));
      this._controls = map;
    }
    if (newControls instanceof Map) {
      this._controls = newControls;
    }
  }

  get controls() {
    if (!this._controls) this._controls = new Map();
    return this._controls;
  }

  get isComplete() {
    if (this._isComplete !== null) {
      if (typeof this._isComplete === 'function') return this._isComplete(this);
      return this._isComplete;
    }

    let complete = true;
    this.controls.forEach((control) => {
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
