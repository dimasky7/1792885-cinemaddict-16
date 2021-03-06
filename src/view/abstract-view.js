import {createElement} from '../render.js';

export default class AbstractView {
  #element
  _callback = {}

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate abstract class, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }

}
