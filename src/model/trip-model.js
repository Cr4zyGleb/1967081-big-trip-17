import {generatePoint} from '../mock/trip.js';

export default class PointsModel {

  #points = Array.from({length: 3}, () => generatePoint());

  get points() {
    return this.#points;
  }
}
