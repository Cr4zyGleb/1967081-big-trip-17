import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class FiltersModel extends Observable {

  #filter = null;

  constructor(){
    super();
    this.#filter = FilterType.EVERYTHING;
  }

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
