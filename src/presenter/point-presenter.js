import { remove, replace } from '../framework/render';
import { render } from '../render';
import { UserAction, UpdateType } from '../const.js';
import TripPointEditView from '../trip-view/trip-point-edit-view';
import TripPointView from '../trip-view/trip-point-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {

  #tripListComponent = null;
  #tripComponent = null;
  #editPointView = null;
  #point = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  constructor(tripListComponent, changeData, changeMode) {
    this.#tripListComponent = tripListComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;
    const prevTripComponent = this.#tripComponent;
    const prevEditPointView = this.#editPointView;
    this.#tripComponent = new TripPointView(this.#point);
    this.#editPointView = new TripPointEditView(this.#point);

    this.restoreTripPointHandlers();
    this.restoreTripPointEditHandlers();
    if (prevTripComponent === null) {
      render(this.#tripComponent, this.#tripListComponent.element);
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripComponent, prevTripComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointView, prevEditPointView);
    }

    remove(prevTripComponent);
    remove(prevEditPointView);
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleSubmitClick = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MAJOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleDeleteClick = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #replacePointToForm = () => {
    this.#editPointView = new TripPointEditView(this.#point);
    this.restoreTripPointEditHandlers();
    replace(this.#editPointView, this.#tripComponent);
    remove(this.#tripComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    this.#tripComponent = new TripPointView(this.#point);
    this.restoreTripPointHandlers();
    replace(this.#tripComponent, this.#editPointView);
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    remove(this.#editPointView);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    }
  };

  restoreTripPointHandlers = () => {
    this.#tripComponent.setClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#onEscKeyDownHandler);
    });

    this.#tripComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  restoreTripPointEditHandlers = () => {
    this.#editPointView.setClickHandler(this.#replaceFormToPoint);
    this.#editPointView.setSubmitHandler((pointSubmit) => {
      this.#changeData(
        UserAction.UPDATE_TASK,
        UpdateType.MINOR,
        { ...pointSubmit });
      this.#replaceFormToPoint();
    });
    this.#editPointView.setDeleteHandler((pointSubmit) => {
      this.#changeData(
        UserAction.DELETE_TASK,
        UpdateType.MINOR,
        { ...pointSubmit });
      this.#replaceFormToPoint();
    });
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#tripComponent);
    remove(this.#editPointView);
  };

}
