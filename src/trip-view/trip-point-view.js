import { createElement } from '../render.js';
import { getTimeDuration, humanizeTaskDueDate } from '../utils.js';

const createTripPointViewTemplate = (point) => {
  const { destination, basePrice, dateFrom, dateTo, isFavorite, offers, type } = point;

  const dateFromHumanize = dateFrom !== null
    ? humanizeTaskDueDate(dateFrom)
    : '';

  const dateToHumanize = dateTo !== null
    ? humanizeTaskDueDate(dateTo)
    : '';

  const destinationName = destination.name;

  const eventDuration = getTimeDuration(dateFrom, dateTo);

  const eventFavoriteBtnActive = isFavorite ? 'event__favorite-btn--active' : '';

  const getOffersTemplate = () => {

    let templateList = '';

    offers.offers.forEach((element) => {
      const {title, price} = element;
      const template = `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      +€&nbsp;
      <span class="event__offer-price">${price}</span>
      </li>`;
      templateList = templateList + template;
    });

    return templateList;
  };

  const offersTemplate = getOffersTemplate();

  return (`<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${dateFrom}">${dateFromHumanize}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${destinationName}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFrom}">${dateFromHumanize}</time>
      —
      <time class="event__end-time" datetime="${dateTo}">${dateToHumanize}</time>
    </p>
    <p class="event__duration">${eventDuration}</p>
  </div>
  <p class="event__price">
    €&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offersTemplate}
  </ul>
  <button class="event__favorite-btn ${eventFavoriteBtnActive}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`);
};

export default class TripPointView {

  #point = null;
  #element = null;

  constructor(point) {
    this.#point = point;
  }

  get template() {
    return createTripPointViewTemplate(this.#point);
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
