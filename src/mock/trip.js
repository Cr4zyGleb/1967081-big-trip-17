import { nanoid } from 'nanoid';
import {getRandomInteger} from '../utils.js';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const CITIES = ['Tokio', 'New York', 'Peking', 'Seoul', 'Toronto', 'St-peterburg'];
const generateType = () => TYPES[getRandomInteger(0,TYPES.length-1)];
const generateCity = () => CITIES[getRandomInteger(0,CITIES.length-1)];
const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Cras aliquet varius magna, non porta ligula feugiat eget',
    'Fusce tristique felis at fermentum pharetra',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generatePicture = () => ({
  scr : `http://picsum.photos/300/200?r=${getRandomInteger(1,100)}`,
  description : generateDescription()
});

const generateDestination = () => ({
  description : generateDescription(),
  name: generateCity(),
  pictures : [
    generatePicture(),
    generatePicture(),
    generatePicture()
  ]
});

const generateOffers = () => {
  const offers = [
    {
      id: 1,
      title: generateDescription(),
      price: getRandomInteger(100,1000)
    },
    {
      id: 2,
      title: generateDescription(),
      price: getRandomInteger(100,1000)
    }
  ];

  return offers;
};

const generateOffer = () => ({
  type : generateType(),
  offers: generateOffers()
});

export const generatePoint = (dayFromTo) => ({
  destination: generateDestination(),
  basePrice: getRandomInteger(100,1000),
  id: nanoid(),
  dateFrom: dayFromTo.from,
  dateTo: dayFromTo.to,
  isFavorite: false,
  offers: generateOffer(),
  type: generateType()
});
