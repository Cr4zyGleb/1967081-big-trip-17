import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { getRandomDayFromTo, getRandomInteger, humanizeTaskDueDate } from '../utils/utils.js';
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


export const getNewPoint = () => {
  const formatDate = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
  const dateFrom = dayjs();
  const dateTo = dayjs().add(1, 'hour');
  const dateFromHumanize = dateFrom !== null
    ? humanizeTaskDueDate(dateFrom, formatDate)
    : '';

  const dateToHumanize = dateTo !== null
    ? humanizeTaskDueDate(dateTo, formatDate)
    : '';
  const type = TYPES[0];
  // const idOffers = generateIdOffers(type);
  const point = {
    isNew: true,
    destination: {
      name : 'Tokio',
      description : 'description Tokio',
      pictures: [
        // generatePicture('Tokio'),
        // generatePicture('Tokio'),
        // generatePicture('Tokio')
      ]
    },
    basePrice: 100,
    id: nanoid(),
    dateFrom: dateFromHumanize,
    dateTo: dateToHumanize,
    isFavorite: false,
    type: type,
    offers: []
  };

  return point;
};
