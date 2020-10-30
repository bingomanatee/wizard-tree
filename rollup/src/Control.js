import { immerable } from 'immer';

export default class Control {
  [immerable] = true

  constructor(id, label, value = '', {
    validator = false,
    required = false,
    Input = null,
  } = {}) {
    this._id = id;
    this.label = label;
    this.value = value;
    this.required = required;
    this.validator = (typeof validator === 'function') ? validator : false;
    this.Input = Input;
  }

  get id() {
    return this._id;
  }

  get hasValidValue() {
    if (this.validator) return this.validator(this.value, this);
    if (!this.required) return true;
    return this.value !== '';
  }
}
