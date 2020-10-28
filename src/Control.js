export default class Control {
  constructor(id, label, value = null) {
    this._id = id;
    this.label = label;
    this.value = value;
  }

  get id() {
    return this._id;
  }

  clone(update = {}) {
    const newControl = new Control(this.id, this.label, this.value);
    Object.assign(newControl, update);
    return newControl;
  }
}
