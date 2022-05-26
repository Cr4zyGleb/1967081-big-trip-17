import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

const createTripFilterTemplate = (points) => {
  let addFiltersTemplate = '';

  const filters = {
    future: false,
    past: false,
    everything: false
  };

  const dateNow = dayjs();
  for (let i = 0; i < points.length; i++) {
    const dateFrom = dayjs(points[i].dateFrom);
    const dateTo = dayjs(points[i].dateTo);
    if (dateTo.isBefore(dateNow) && !filters.past) {
      filters.past = true;
      addFiltersTemplate = `${addFiltersTemplate}
        <div class="trip-filters__filter">
          <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" checked>
            <label class="trip-filters__filter-label" for="filter-past">Past</label>
        </div>`;
    }
    if (dateFrom.isAfter(dateNow) && !filters.future) {
      filters.future = true;
      addFiltersTemplate = `${addFiltersTemplate}
      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>`;
    }
  }

  const tripFilterTemplate =
    `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div> <button class="visually-hidden" type="submit">Accept filter</button>
    ${addFiltersTemplate}
  </form>`;

  return tripFilterTemplate;
};

export default class TripFilterView extends AbstractView {

  constructor(points) {
    super();
    this.points = points;
  }

  get template() {
    return createTripFilterTemplate(this.points);
  }

}
