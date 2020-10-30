import {immerable} from "immer"

export default class Page {
  [immerable] = true

  constructor(id, title, {
    order: order = null,
    controls: controls = [],
    parent: parent = null,
    completeCrit: completeCrit = false,
    canGoTo: canGoTo = null,
  }) {
    this._id = id;
    this.title = title;
    this.order = order;
    this.controls = controls;
    this.parent = parent;
    this.completeCrit = completeCrit;
    this.canGoTo = canGoTo
  }

  get id() {
    return this._id;
  }

  set controls(newControls) {
    if (Array.isArray(newControls)) {
      let map = new Map();
      newControls.forEach(c => map.set(c.id, c));
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
    if (this.completeCrit) {
      return this.completeCrit(this);
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
