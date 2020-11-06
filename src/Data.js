import { immerable } from 'immer';

export default class Data {
  [immerable] = true

  constructor(id, label, value = '', {
    hasValidValue = null,
    required = false,
    Input = null,
    order = null,
    errors = null,
    state = {},
  } = {}) {
    this._id = id;
    this.label = label;
    this.order = order;
    this.value = value;
    this.errors = errors;
    this.required = required;
    this.hasValidValue = hasValidValue;
    this.Input = Input;
    this.state = state;
  }

  get id() {
    return this._id;
  }

  set errors(value) {
    if (typeof value === 'string') {
      this._errors = [value];
    } else if (typeof value === 'function') {
      this._errors = value;
    } else {
      this._errors = value;
    }
  }

  get errors() {
    if (typeof this._errors === 'function') {
      const out = this._errors(this);
      if (Array.isArray(out)) return out;
      return out ? [out] : [];
    }
    if (Array.isArray(this._errors)) {
      return [...this._errors];
    }
    return [];
  }

  get hasValidValue() {
    if (this.errors.length) return false;
    if (typeof this._hasValidValue === 'function') return this._hasValidValue(this.value, this);
    if (this._hasValidValue === true || this._hasValidValue === false) return this._hasValidValue;
    if (!this.required) return true;
    return this.value !== '';
  }

  set hasValidValue(value) {
    this._hasValidValue = value;
  }

  get required() {
    if (typeof this._required === 'function') {
      return this._required(this);
    }
    return this._required;
  }

  set required(value) {
    this._required = value;
  }
}
