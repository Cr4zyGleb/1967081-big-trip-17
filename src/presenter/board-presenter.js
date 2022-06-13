import { render, replace } from '../render.js';
import TripSortView from '../trip-view/trip-sort-view.js';
import TripListView from '../trip-view/trip-list-view.js';
import TripEmptyListView from '../trip-view/trip-empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { sortTaskDate, sortTaskPrice, sortTaskTime, updateItem } from '../utils/utils.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { remove } from '../framework/render.js';
import { getFilteredPoints } from '../utils/filters.js';

export default class BoardPresenter {
  #pointsModel = null;
  #fitersModel = null;
  #currentSortType = null;
  #currentFilterType = null;
  #previousSortType = null;
  #pageTripEventsElement = null;
  #tripListComponent = null;
  #sortComponent = null;
  #pointPresenter = new Map();

  constructor(pageTripEventsElement, pointsModel, fitersModel) {
    this.#pageTripEventsElement = pageTripEventsElement;
    this.#pointsModel = pointsModel;
    this.#fitersModel = fitersModel;
    this.#currentSortType = SortType.DATE;
    this.#currentFilterType = FilterType.EVERYTHING;
    this.#sortComponent = new TripSortView(SortType.DATE);
    this.#tripListComponent = new TripListView();
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#fitersModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    switch (this.#currentSortType) {
      case SortType.PRICE:
        this.#pointsModel.points.sort(sortTaskPrice);
        break;
      case SortType.TIME:
        this.#pointsModel.points.sort(sortTaskTime);
        break;
      default:
        this.#pointsModel.points.sort(sortTaskDate);
        break;
    }

    switch (this.#fitersModel.filter) {
      case FilterType.FUTURE:
        return getFilteredPoints(FilterType.FUTURE, this.#pointsModel.points);
      case FilterType.PAST:
        return getFilteredPoints(FilterType.PAST, this.#pointsModel.points);
      default:
        return getFilteredPoints(FilterType.EVERYTHING, this.#pointsModel.points);
    }
  }

  init = () => {
    this.#renderBoard({ renderAll: true });
  };

  #renderBoard = ({ renderAll = false } = {}) => {
    if (this.points.length) {
      if (renderAll) {
        this.#renderTripSortView(this.#currentSortType);
        this.#renderTripListComponent();
      }
      this.#renderPoints(this.points);
    } else {
      this.#renderTripEmptyListView();
    }
  };

  #clearBoard = ({ clearAll = false } = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    if (clearAll) {
      remove(this.#sortComponent);
      remove(this.#tripListComponent);
      this.#previousSortType = null;
    }
  };

  renderPoint = (point) => {
    this.#renderPoint(point);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
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
    // this.#renderPoints(this.points);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handlePointChange = (updatedPoint) => {
    this.points = updateItem(this.points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.points.sort(sortTaskPrice);
        break;
      case SortType.TIME:
        this.points.sort(sortTaskTime);
        break;
      default:
        this.points.sort(sortTaskDate);
        break;
    }
    this.#currentSortType = sortType;

  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType || sortType === SortType.DISABLED) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderTripSortView(sortType);
    this.#renderPoints(this.points);
  };

  #handleViewAction = (actionType, updateType, update) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updateTask(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deleteTask(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({ clearAll: true });
        this.#renderBoard({ renderAll: true });
        break;
    }
  };

}
