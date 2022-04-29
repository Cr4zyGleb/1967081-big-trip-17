import {render} from './render.js';
import TripFilterView from './trip-view/trip-filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripControlFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-events');
const tripPresenter = new TripPresenter();
render(new TripFilterView(), siteTripControlFiltersElement);

tripPresenter.init(siteHeaderElement);

