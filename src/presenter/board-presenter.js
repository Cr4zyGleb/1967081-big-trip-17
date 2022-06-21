import { render, replace } from '../render.js';
import TripSortView from '../trip-view/trip-sort-view.js';
import TripListView from '../trip-view/trip-list-view.js';
import TripEmptyListView from '../trip-view/trip-empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { getNewPoint, sortTaskDate, sortTaskPrice, sortTaskTime } from '../utils/utils.js';
import { EmptyListMessage, FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { remove } from '../framework/render.js';
import { getFilteredPoints } from '../utils/filters.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class BoardPresenter {
  #pointsModel = null;
  #fitersModel = null;
  #currentSortType = null;
  #newPointPresenter = null;
  #pageTripEventsElement = null;
  #tripListComponent = null;
  #tripEmptyListComponent = null;
  #sortComponent = null;
  #pointPresenter = new Map();
  #newPointButtonComponent = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(pageTripEventsElement, pointsModel, fitersModel, newPointButtonComponent) {
    this.#pageTripEventsElement = pageTripEventsElement;
    this.#pointsModel = pointsModel;
    this.#fitersModel = fitersModel;
    this.#newPointButtonComponent = newPointButtonComponent;
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
    this.#newPointPresenter = new PointPresenter(this.#tripListComponent, this.#handleViewAction, this.#handleModeChange, this.#pointsModel, this.#newPointButtonComponent);
    this.#newPointPresenter.init(getNewPoint(this.#pointsModel), callback);
    this.#newPointButtonComponent.disabled = true;
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
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #resetView = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleModeChange = () => {
    this.#resetView();
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        }
        catch (error) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_TASK:
        this.#newPointPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#newPointButtonComponent.setAvailability(true);
          this.#currentSortType = SortType.DATE;
          this.#fitersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        }
        catch (error) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_TASK:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
          this.#currentSortType = SortType.DATE;
          this.#fitersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        }
        catch (error) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
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
