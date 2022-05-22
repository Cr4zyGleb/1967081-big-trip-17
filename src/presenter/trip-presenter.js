import { render } from '../render.js';

import TripSortView from '../trip-view/trip-sort-view.js';
import TripPointEditView from '../trip-view/trip-point-edit-view.js';
import TripPointView from '../trip-view/trip-point-view.js';
import TripListView from '../trip-view/trip-list-view.js';
import TripEmptyListView from '../trip-view/trip-empty-list-view.js';
export default class TripPresenter {
  #pointsModel = null;
  #pageTripEventsElement = null;
  #points = [];
  #tripListComponent = new TripListView();
  init = (pageTripEventsElement, pointsModel) => {
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.#pageTripEventsElement = pageTripEventsElement;
    if (this.#points.length) {
      render(new TripSortView(), this.#pageTripEventsElement);
      render(this.#tripListComponent, this.#pageTripEventsElement);
      for (let i = 0; i < this.#points.length; i++) {
        this.#renderTripPoint(this.#points[i]);
      }
    } else {
      render(new TripEmptyListView('Click New Event to create your first point'), this.#pageTripEventsElement);
    }

  };

  #renderTripPoint = (tripPoint) => {
    const tripComponent = new TripPointView(tripPoint);
    const editPointView = new TripPointEditView(tripPoint);
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

    tripComponent.setClickHandler(()=>{
      replaceTripPointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });
    editPointView.setClickHandler(replaceEditFormToTripPoint);
    editPointView.setSubmitHandler(replaceEditFormToTripPoint);

    render(tripComponent, this.#tripListComponent.element);
  };
}
