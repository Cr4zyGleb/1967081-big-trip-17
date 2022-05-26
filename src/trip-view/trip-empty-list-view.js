import AbstractView from '../framework/view/abstract-view';

const createTripEmptyListTemplate = (message) => (`<p class="trip-events__msg">${message}</p>`);

export default class TripEmptyListView extends AbstractView {

  #message = null;

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createTripEmptyListTemplate(this.#message);
  }

}
