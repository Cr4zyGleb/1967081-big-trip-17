import { render, replace } from '../render.js';
import TripSortView from '../trip-view/trip-sort-view.js';
import TripListView from '../trip-view/trip-list-view.js';
import TripEmptyListView from '../trip-view/trip-empty-list-view.js';
import PointPresenter from './trip-point-presenter.js';
import { sortTaskDate, sortTaskPrice, sortTaskTime, updateItem } from '../utils.js';
import { SortType } from '../const.js';

export default class TripPresenter {
  #pointsModel = null;
  #sourcedPoints = [];
  #currentSortType = null;
  #previousSortType = null;
  #pageTripEventsElement = null;
  #points = [];
  #tripListComponent = null;
  #sortComponent = null;
  #pointPresenter = new Map();
  init = (pageTripEventsElement, pointsModel) => {
    this.#pageTripEventsElement = pageTripEventsElement;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points];
    this.#currentSortType = SortType.DATE;
    this.#sortComponent = new TripSortView(SortType.DATE);
    this.#tripListComponent = new TripListView();
    this.#renderMain();
  };

  #renderMain = () => {
    if (this.#points.length) {
      this.#renderTripSortView(this.#currentSortType);
      this.#renderTripListComponent();
      this.#sortPoints(this.#currentSortType);
      this.#renderPoints();
    } else {
      this.#renderTripEmptyListView();
    }
  };

  renderPoint = (point) => {
    this.#renderPoint(point);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  };

  #renderTripSortView = (sortType) => {
    if (!this.#previousSortType) {
      render(this.#sortComponent, this.#pageTripEventsElement);
    } else {
      const newSortComponent = new TripSortView(sortType);
      replace(newSortComponent, this.#sortComponent);
      this.#sortComponent = newSortComponent;
    }
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    this.#previousSortType = sortType;
  };

  #renderTripEmptyListView = () => {
    render(new TripEmptyListView('Click New Event to create your first point'), this.#pageTripEventsElement);
  };

  #renderTripListComponent = () => {
    render(this.#tripListComponent, this.#pageTripEventsElement);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortTaskPrice);
        break;
      case SortType.TIME:
        this.#points.sort(sortTaskTime);
        break;
      default:
        this.#points.sort(sortTaskDate);
        break;
    }
    this.#currentSortType = sortType;

  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType || sortType === SortType.DISABLED) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderTripSortView(sortType);
    this.#renderPoints();
  };
}
