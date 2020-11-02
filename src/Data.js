import { immerable } from 'immer';

export default class Data {
  [immerable] = true

  constructor(id, label, value = '', {
    validator = false,
    required = false,
    Input = null,
    order = null,
    state = {},
  } = {}) {
    this._id = id;
    this.label = label;
    this.order = order;
    this.value = value;
    this.required = required;
    this.validator = (typeof validator === 'function') ? validator : false;
    this.Input = Input;
    this.state = state;
  }

  get id() {
    return this._id;
  }

  get hasValidValue() {
    if (this.validator) return this.validator(this.value, this);
    if (!this.required) return true;
    return this.value !== '';
  }

  set required(value) {
    this._required = value;
  }

  get required() {
    if (typeof this._required === 'function') {
      return this._required(this);
    }
    return this._required;
  }
}
