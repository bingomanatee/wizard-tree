export default class Page {
  constructor(id, title, order = null, controls = new Map()) {
    this._id = id;
    this.title = title;
    this.order = order;
    this.controls = controls;
  }

  get id() {
    return this._id;
  }

  clone(update = {}) {
    const newPage = new Page(
      this.id,
      this.title,
      this.order,
      new Map(this.controls)
    );
    Object.assign(newPage, update);
    return newPage;
  }
}
