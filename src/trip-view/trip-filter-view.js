import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

const createTripFilterTemplate = (filters) => {

  const tripFilterTemplate =
    `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${filters.everything ? 'checked' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div> <button class="visually-hidden" type="submit">Accept filter</button>
    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${filters.future ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${filters.past ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div> 
  </form>`;

  return tripFilterTemplate;
};

export default class TripFilterView extends AbstractView {

  constructor(points) {
    super();
    this.points = points;
    const dateNow = dayjs();
    this.filters = {
      future: this.points.some((point) => dayjs(point.dateFrom).isAfter(dateNow, 'day')),
      past: this.points.some((point) => dayjs(point.dateTo).isBefore(dateNow, 'day')),
      everything: this.points.length > 0
    };
  }

  get template() {
    return createTripFilterTemplate(this.filters);
  }

}
