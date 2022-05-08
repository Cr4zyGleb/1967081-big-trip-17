import {render} from '../render.js';

import TripSortView from '../trip-view/trip-sort-view.js';
import TripPointEditView from '../trip-view/trip-point-edit-view.js';
import TripPointView from '../trip-view/trip-point-view.js';
import TripListView from '../trip-view/trip-list-view.js';
export default class TripPresenter {
  taskListComponent = new TripListView();
  init = (pageTripEventsElement, pointsModel) => {
    this.pointsModel = pointsModel;
    this.points = [...this.pointsModel.getPoints()];
    render(new TripSortView(), pageTripEventsElement);
    render(this.taskListComponent, pageTripEventsElement);
    render(new TripPointEditView(), this.taskListComponent.getElement());
    render(new TripPointEditView(), this.taskListComponent.getElement());
    for (let i = 0; i < this.points.length; i++) {
      render(new TripPointView(this.points[i]), this.taskListComponent.getElement());
    }
  };
}
