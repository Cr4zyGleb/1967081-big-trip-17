import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripControlFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-events');
const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();
const boardPresenter = new BoardPresenter(siteHeaderElement, pointsModel, filtersModel);
const filterPresenter = new FilterPresenter(siteTripControlFiltersElement, filtersModel, pointsModel);

// render(new TripFilterView(pointsModel.points), siteTripControlFiltersElement);

document.querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
  boardPresenter.addNewPoint();
});

filterPresenter.init();
boardPresenter.init();

