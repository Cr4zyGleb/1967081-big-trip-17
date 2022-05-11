import {createElement} from '../render.js';

const createTripEmptyListTemplate = (message) => (`<p class="trip-events__msg">${message}</p>`);

export default class TripEmptyListView {
  #element = null;
  #message = null;

  constructor(message) {
    this.#message = message;
  }

  get template() {
    return createTripEmptyListTemplate(this.#message);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
