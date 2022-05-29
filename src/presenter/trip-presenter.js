import { render } from '../render.js';
import TripSortView from '../trip-view/trip-sort-view.js';
import TripListView from '../trip-view/trip-list-view.js';
import TripEmptyListView from '../trip-view/trip-empty-list-view.js';
import PointPresenter from './trip-point-presenter.js';
import { updateItem } from '../utils.js';


export default class TripPresenter {
  #pointsModel = null;
  #sourcedPoints = null;

  #pageTripEventsElement = null;
  #points = [];
  #tripListComponent = new TripListView();
  #pointPresenter = new Map();
  init = (pageTripEventsElement, pointsModel) => {
    this.#pageTripEventsElement = pageTripEventsElement;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points];
    this.#renderMain();
  };

  #renderMain = () => {
    if (this.#points.length) {
      this.#renderTripSortView();
      this.#renderTripListComponent();
      this.#renderPoints();
    } else {
      this.#renderTripEmptyListView();
    }
  };

  renderPoint = (point) => {
    this.#renderPoint(point);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripListComponent, this.#handleTaskChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  };

  #renderTripSortView = () => {
    render(new TripSortView(), this.#pageTripEventsElement);
  };

  #renderTripEmptyListView = () => {
    render(new TripEmptyListView('Click New Event to create your first point'), this.#pageTripEventsElement);
  };

  #renderTripListComponent = () => {
    render(this.#tripListComponent, this.#pageTripEventsElement);
  };

  // #clearPointList = () => {
  //   this.#pointPresenter.forEach((presenter) => presenter.destroy());
  //   this.#pointPresenter.clear();
  // };

  #handleTaskChange = (updatedPoint) => {
    this.#tripListComponent = updateItem(this.#points , updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}
