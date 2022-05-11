import {generatePoint} from '../mock/trip.js';
import { getRandomDayFromTo } from '../utils.js';

export default class PointsModel {

  #points = Array.from({length: 20}, (_, index) => generatePoint(index, getRandomDayFromTo()));

  get points() {
    return this.#points;
  }
}
