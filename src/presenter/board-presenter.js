import {render} from '../render.js';

import SortView from '../view/sort-view.js';
import TaskCreateView from '../view/task-create-view.js';
import TaskEditView from '../view/task-edit-view.js';
import TaskPathPointView from '../view/task-path-point-view.js';
import TaskListView from '../view/task-list-view.js';

const pageMainElement = document.querySelector('.page-main');
const pageTripEventsElement = pageMainElement.querySelector('.trip-events');

export default class BoardPresenter {
  taskListComponent = new TaskListView();
  init = () => {
    render(new SortView(), pageTripEventsElement);
    render(this.taskListComponent, pageTripEventsElement);
    render(new TaskEditView(), this.taskListComponent.getElement());
    render(new TaskCreateView(), this.taskListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new TaskPathPointView(), this.taskListComponent.getElement());
    }
  };
}
