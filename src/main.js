import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import PointsApiService from './points-api-service.js';
import NewPointButtonView from './trip-view/new-point-button-view.js';
import { render } from './render.js';

const AUTHORIZATION = 'Basic wdeqdq12321qdwd';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip/';
const siteTripMainElement = document.querySelector('.trip-main');
const siteTripControlFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-events');
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel(pointsApiService);
const filtersModel = new FiltersModel();
const newPointButtonComponent = new NewPointButtonView();
const boardPresenter = new BoardPresenter(siteHeaderElement, pointsModel, filtersModel, newPointButtonComponent);
const filterPresenter = new FilterPresenter(siteTripControlFiltersElement, filtersModel, pointsModel);


const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.addNewPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

filterPresenter.init();
boardPresenter.init();
pointsModel.init().finally(() => {
  render(newPointButtonComponent, siteTripMainElement);
  newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
});


