import {render} from '../render.js';

import TripSortView from '../trip-view/trip-sort-view.js';
import TripPointEditView from '../trip-view/trip-point-edit-view.js';
import TripPointView from '../trip-view/trip-point-view.js';
import TripListView from '../trip-view/trip-list-view.js';
export default class TripPresenter {
  #pointsModel = null;
  #pageTripEventsElement = null;
  #points = [];
  #tripListComponent = new TripListView();
  init = (pageTripEventsElement, pointsModel) => {
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.#pageTripEventsElement = pageTripEventsElement;
    render(new TripSortView(), this.#pageTripEventsElement);
    render(this.#tripListComponent, this.#pageTripEventsElement);
    // render(new TripPointEditView(), this.#taskListComponent.element);
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderTripPoint(this.#points[i]);
    }
  };

  #renderTripPoint = (tripPoint) => {
    const tripComponent = new TripPointView(tripPoint);
    const editPointView = new TripPointEditView(tripPoint);
    const tripPointChangeViewButton = tripComponent.element.querySelector('.event__rollup-btn');
    const editPointFormChangeViewButton = editPointView.element.querySelector('.event__rollup-btn');
    const submitFormPointEditView =  editPointView.element.querySelector('.event--edit');
    const replaceTripPointToEditForm = () => {
      this.#tripListComponent.element.replaceChild(editPointView.element, tripComponent.element);
    };

    const replaceEditFormToTripPoint = () => {
      this.#tripListComponent.element.replaceChild(tripComponent.element, editPointView.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToTripPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    tripPointChangeViewButton.addEventListener('click', () => {
      replaceTripPointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointFormChangeViewButton.addEventListener('click', () => {
      replaceEditFormToTripPoint();
    });
    submitFormPointEditView.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToTripPoint();
    });

    submitFormPointEditView.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToTripPoint();
    });

    render(tripComponent, this.#tripListComponent.element);
  };
}
