import {createElement} from '../render.js';

const createTaskList = () => ('<ul class="trip-events__list"></ul>');

export default class TaskListView {
  getTemplate() {
    return createTaskList();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
