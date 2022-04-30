import {render} from '../render.js';

import TripSortView from '../trip-view/trip-sort-view.js';
import TripPointEditView from '../trip-view/trip-point-edit-view.js';
import TripPointView from '../trip-view/trip-point-view.js';
import TripListView from '../trip-view/trip-list-view.js';

const pageMainElement = document.querySelector('.page-main');
const pageTripEventsElement = pageMainElement.querySelector('.trip-events');

export default class TripPresenter {
  taskListComponent = new TripListView();
  init = () => {
    render(new TripSortView(), pageTripEventsElement);
    render(this.taskListComponent, pageTripEventsElement);
    render(new TripPointEditView(), this.taskListComponent.getElement());
    render(new TripPointEditView(), this.taskListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new TripPointView(), this.taskListComponent.getElement());
    }
  };
}
