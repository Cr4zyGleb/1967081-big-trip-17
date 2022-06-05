import { remove, replace } from '../framework/render';
import { render } from '../render';
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

    this.#tripComponent.setClickHandler(() => {
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#onEscKeyDownHandler);
    });

    this.#tripComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editPointView.setClickHandler(this.#replaceFormToPoint);
    this.#editPointView.setSubmitHandler(this.#replaceFormToPoint);


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
    this.#changeData({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #replacePointToForm = () => {
    replace(this.#editPointView, this.#tripComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#tripComponent, this.#editPointView);
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    }
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
