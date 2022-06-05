import { nanoid } from 'nanoid';
import { getRandomDayFromTo, getRandomInteger } from '../utils.js';
import { generateDestination } from './cities.js';
import { generateIdOffers } from './offers.js';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const generateType = () => TYPES[getRandomInteger(0, TYPES.length - 1)];


export const generatePoint = () => {

  const dateFromTo = getRandomDayFromTo();
  const type = generateType();
  const idOffers = generateIdOffers(type);
  const point = {
    destination: generateDestination(),
    basePrice: getRandomInteger(100, 1000),
    id: nanoid(),
    dateFrom: dateFromTo.from,
    dateTo: dateFromTo.to,
    isFavorite: false,
    type: type,
    offers: idOffers
  };

  return point;
};
