import dayjs from 'dayjs';
import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

const createTripFilterTemplate = (filters, currentFilterType) => {

  const getFilterStatus = (filterType, duePoints) => {
    if (filterType === currentFilterType) {
      return 'checked';
    }
    if (!duePoints) {
      return 'disabled';
    }
    return '';
  };

  const tripFilterTemplate =
    `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${getFilterStatus(FilterType.EVERYTHING, filters.everything)}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div> <button class="visually-hidden" type="submit">Accept filter</button>
    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${getFilterStatus(FilterType.FUTURE, filters.future)}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${getFilterStatus(FilterType.PAST, filters.past)}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div> 
  </form>`;

  return tripFilterTemplate;
};

export default class TripFilterView extends AbstractView {

  constructor(points, currentFilterType) {
    super();
    this.points = points;
    this.currentFilterType = currentFilterType;
    const dateNow = dayjs();
    this.filters = {
      future: this.points.some((point) => dayjs(point.dateFrom).isAfter(dateNow, 'day')),
      past: this.points.some((point) => dayjs(point.dateTo).isBefore(dateNow, 'day')),
      everything: this.points.length > 0
    };
  }

  get template() {
    return createTripFilterTemplate(this.filters, this.currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };

}
