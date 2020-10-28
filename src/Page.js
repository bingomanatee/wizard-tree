export default class Page {
  constructor(id, title, order = null) {
    this._id = id;
    this.title = title;
    this.order = order;
  }

  get id() {
    return this._id;
  }

  clone(update = {}) {
    const newPage = new Page(this.id, this.title, this.order);
    Object.assign(newPage, update);
    return newPage;
  }
}
