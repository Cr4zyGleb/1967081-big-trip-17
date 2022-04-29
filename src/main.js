import {render} from './render.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripControlFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-events');
const boardPresenter = new BoardPresenter();
render(new FilterView(), siteTripControlFiltersElement);

boardPresenter.init(siteHeaderElement);

