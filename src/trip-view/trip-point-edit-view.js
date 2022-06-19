import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getOfferByType } from '../mock/offers.js';
import { addArrElement, deleteArrElement, humanizeTaskDueDate } from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createTripPointEditViewTemplate = (point, pointsModel) => {
  const { destination, basePrice, dateFrom, offers, dateTo, type } = point;
  const isNew = point.isNew;
  const typeOffers = getOfferByType(type, pointsModel);
  const formatDate = 'DD/MM/YY HH:mm';
  const destinationName = destination ? destination.name : ' ';
  const destinationDescription = destination ? destination.description : '';
  const destinationPictures = destination ? destination.pictures : [];
  const dateFromHumanize = dateFrom !== null
    ? humanizeTaskDueDate(dateFrom, formatDate)
    : '';

  const dateToHumanize = dateTo !== null
    ? humanizeTaskDueDate(dateTo, formatDate)
    : '';

  const getPhotosTemplate = () => {
    let photosImgElements = '';
    for (let i = 0; i < destinationPictures.length; i++) {
      const newPhotosImgElements = `<img class="event__photo" src="${destinationPictures[i].src}.jpg" alt="Event photo">`;
      photosImgElements = photosImgElements + newPhotosImgElements;
    }
    return `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${photosImgElements}  
    </div>
  </div>`;
  };

  // const setOfferCheckedHandle = (title, id) => {
  //   const offersElementId = `event-offer-${title}-${id}`;
  //   const offersElement = document.querySelector(offersElementId);
  //   offersElement.addEventListener('change', () => {
  //     if (this.checked) {
  //       offers.push(id);
  //     } else {
  //       offers = offers.filter((elemId) => elemId === id);
  //     }
  //   });
  // };

  const getOffersTemplate = () => {
    let offersElements = '';
    for (let i = 0; i < typeOffers.offers.length; i++) {
      const offer = typeOffers.offers[i];
      const offerId = offer.id;
      const offerTitle = offer.title;
      const offerPrice = offer.price;
      const offerChecked = offers.includes(offerId) ? 'Checked' : '';
      const newOffersElements = `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle}-${offerId}" data-offer-id = "${offerId}" type="checkbox" name="event-offer-${offerTitle}" ${offerChecked}>
      <label class="event__offer-label" for="event-offer-${offerTitle}-${offerId}">
        <span class="event__offer-title">Switch to ${offerTitle}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerPrice}</span>
      </label>
    </div>`;
      // setOfferCheckedHandle(offer.id);
      offersElements = offersElements + newOffersElements;
    }
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">   
      ${offersElements}
    </div>
  </section>`;
  };

  const getRollUpBtnTemplate = () => (
    `<button hidden class="event__rollup-btn visually-hidden" type="button">
      <span hidden class="visually-hidden">Open event</span>
    </button>`
  );

  const rollUpBtnTemplate = isNew ? '' : getRollUpBtnTemplate();
  const offersTemplate = typeOffers.offers.length ? getOffersTemplate() : '';
  const photosTemplate = (destinationPictures && destinationPictures.length) ? getPhotosTemplate() : '';


  const getDestinationTemplate = () => (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationDescription}</p>
      ${photosTemplate}
    </section>`);

  const destinationTemplate = destination ? getDestinationTemplate() : '';

  const getDestinationListTemplate = () => {
    let destinationList = '';
    const cities = pointsModel.cities;
    cities.forEach((city) => {
      const newDestinationOption = `<option value="${city}"></option>`;
      destinationList = destinationList + newDestinationOption;
    });
    return `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">    
    <datalist id="destination-list-1">
      ${destinationList}
    </datalist>`;
  };

  const destinationListTemplate = getDestinationListTemplate();

  // const eventDuration = getTimeDuration(dateFrom, dateTo);

  return (`<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          <div class="event__type-item">
            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
            <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
            <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
            <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
            <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
            <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
            <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
            <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
            <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
            <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
          </div>
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      ${destinationListTemplate}

    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromHumanize}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToHumanize}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>
    ${rollUpBtnTemplate}
  </header>
  <section class="event__details">
    
    ${offersTemplate}

    ${destinationTemplate}
    
  </section>
</form>
</li>`);
};

export default class TripPointEditView extends AbstractStatefulView {

  #dateFromPicker = null;
  #dateToPicker = null;
  #point = null;
  #pointsModel = null;
  #isNew = null;
  constructor(point, pointsModel) {
    super();
    this.#pointsModel = pointsModel;
    this._state = {
      ...point,
      destination: point.destination ? {
        ...point.destination
      } : null,
      offers: [
        ...point.offers
      ]
    };
    this.#setInnerHandlers();
    this.#setDatePickers();
    this.#isNew = point.isNew;
  }

  get template() {
    return createTripPointEditViewTemplate(this._state, this.#pointsModel);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = () => {
    this.updateElement(this._state);
    this._callback.click(this._state);
    // this.element.querySelector('.event__rollup-btn').removeEventListener('click', this.#clickHandler);
  };

  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitHandler);
  };

  setDeleteHandler = (callback) => {
    this._callback.delete = callback;
    this.element.querySelector('.event--edit').addEventListener('reset', this.#deleteHandler);
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(this.parseStateToPoint(this._state));
    // this.element.querySelector('.event--edit').removeEventListener('submit', this.#submitHandler);
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.delete(this.parseStateToPoint(this._state));
    // this.element.querySelector('.event--edit').removeEventListener('submit', this.#submitHandler);
  };

  #eventTypeOnChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #eventDestinationOnChangeHandler = (evt) => {
    if (evt.target.value) {
      const value = this.#pointsModel.getDestinationByCity(evt.target.value);
      if (value) {
        this.updateElement({
          destination: value
        });
      } else {
        evt.target.value = this._state.destination.name;
      }
    }
  };

  #eventPriceOnChangeHandler = (evt) => {
    this._setState({
      basePrice: Number(evt.target.value)
    });
  };

  #eventOffersOnChangeHandler = (evt) => {
    const offerId = Number(evt.target.dataset.offerId);
    if (evt.target.checked) {
      const newOffers = addArrElement(this._state.offers, offerId);
      this._setState({
        offers: newOffers
      });
    } else {
      const newOffers = deleteArrElement(this._state.offers, offerId);
      this._setState({
        offers: newOffers
      });
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeOnChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationOnChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#eventPriceOnChangeHandler);
    const typeOffers = getOfferByType(this._state.type, this.#pointsModel);
    if (typeOffers.offers.length) {
      this.element.querySelector('.event__section--offers').addEventListener('change', this.#eventOffersOnChangeHandler);
    }
  };

  #setDatePickers = () => {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H/i',
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#dueDateFromChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H/i',
        minDate:  this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#dueDateToChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  };

  #dueDateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
  };

  #dueDateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  removeElement = () => {
    super.removeElement();

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatePickers();
    this.setSubmitHandler(this._callback.submit);
    if (!this.#isNew) {
      this.setClickHandler(this._callback.click);
    }
  };

  parseStateToPoint = () => {
    const point = {...this._state,
      basePrice: Number(this._state.basePrice),
    };

    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

}
