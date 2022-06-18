import { render, replace } from '../render.js';
import TripSortView from '../trip-view/trip-sort-view.js';
import TripListView from '../trip-view/trip-list-view.js';
import TripEmptyListView from '../trip-view/trip-empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { sortTaskDate, sortTaskPrice, sortTaskTime } from '../utils/utils.js';
import { EmptyListMessage, FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { remove } from '../framework/render.js';
import { getFilteredPoints } from '../utils/filters.js';
import { getNewPoint } from '../mock/trip.js';

export default class BoardPresenter {
  #pointsModel = null;
  #fitersModel = null;
  #currentSortType = null;
  // #previousSortType = null;
  #pageTripEventsElement = null;
  #tripListComponent = null;
  #tripEmptyListComponent = null;
  #sortComponent = null;
  #pointPresenter = new Map();

  constructor(pageTripEventsElement, pointsModel, fitersModel) {
    this.#pageTripEventsElement = pageTripEventsElement;
    this.#pointsModel = pointsModel;
    this.#fitersModel = fitersModel;
    this.#currentSortType = SortType.DATE;
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

  addNewPoint(callback) {
    this.#resetView();
    this.newPointPresenter = new PointPresenter(this.#tripListComponent, this.#handleViewAction, this.#handleModeChange, this.#pointsModel);
    this.newPointPresenter.init(getNewPoint(), callback);
  }

  #renderBoard = ({ renderAll = false } = {}) => {
    if (this.points.length) {
      if (renderAll) {
        this.#sortComponent = new TripSortView(this.#currentSortType);
        render(this.#sortComponent, this.#pageTripEventsElement);
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
      if (this.#tripEmptyListComponent) {
        remove(this.#tripEmptyListComponent);
      }
    }
  };

  // #createPoint = () => {
  //   // trip-main__event-add-btn
  //   this.#currentSortType = SortType.DATE;
  //   this.#fitersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  //   this.#handleViewAction(
  //     UserAction.ADD_TASK,
  //     UpdateType.MAJOR,
  //     { ...getNewPoint() });
  // };

  renderPoint = (point) => {
    this.#renderPoint(point);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripListComponent, this.#handleViewAction, this.#handleModeChange, this.#pointsModel);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderTripSortView = (sortType) => {
    const newSortComponent = new TripSortView(sortType);
    replace(newSortComponent, this.#sortComponent);
    this.#sortComponent = newSortComponent;
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  getMessageForEmptyListView = () => {
    if (this.#fitersModel.filter === FilterType.EVERYTHING) {
      return EmptyListMessage.EVERYTHING;
    }
    if (this.#fitersModel.filter === FilterType.PAST) {
      return EmptyListMessage.PAST;
    }
    if (this.#fitersModel.filter === FilterType.FUTURE) {
      return EmptyListMessage.FUTURE;
    }

    return EmptyListMessage.EVERYTHING;
  };

  #renderTripEmptyListView = () => {
    const message = this.getMessageForEmptyListView();
    this.#tripEmptyListComponent = new TripEmptyListView(message);
    render(this.#tripEmptyListComponent, this.#pageTripEventsElement);
  };

  #renderTripListComponent = () => {
    render(this.#tripListComponent, this.#pageTripEventsElement);
    // this.#renderPoints(this.points);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  // #handlePointChange = (updatedPoint) => {
  //   this.points = updateItem(this.points, updatedPoint);
  //   this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  // };

  #resetView = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleModeChange = () => {
    this.#resetView();
  };

  // #sortPoints = (sortType) => {
  //   switch (sortType) {
  //     case SortType.PRICE:
  //       this.points.sort(sortTaskPrice);
  //       break;
  //     case SortType.TIME:
  //       this.points.sort(sortTaskTime);
  //       break;
  //     default:
  //       this.points.sort(sortTaskDate);
  //       break;
  //   }
  //   this.#currentSortType = sortType;

  // };

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
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#currentSortType = SortType.DATE;
        // this.#sortComponent = new TripSortView(SortType.DATE);
        this.#fitersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
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
      case UpdateType.INIT:
        this.#clearBoard({ clearAll: true });
        this.#renderBoard({ renderAll: true });
        break;
    }
  };

}
