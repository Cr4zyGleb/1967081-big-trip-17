import { getRandomInteger } from '../utils.js';

const CITIES = ['Tokio', 'New York', 'Peking', 'Seoul', 'Toronto', 'St-peterburg'];

const generatePicture = (city) => ({
  scr: `http://picsum.photos/300/200?r=${getRandomInteger(1, 100)}`,
  description: `description about picture of ${city}`
});

const DESTINATIONS = [
  {
    name : 'Tokio',
    description : 'description Tokio',
    pictures: [
      generatePicture('Tokio'),
      generatePicture('Tokio'),
      generatePicture('Tokio')
    ]
  },
  {
    name : 'New York',
    description : 'description New York',
    pictures: [
      generatePicture('New York'),
      generatePicture('New York'),
      generatePicture('New York')
    ]
  },
  {
    name : 'Peking',
    description : 'description Peking',
    pictures: [
      generatePicture('Peking'),
      generatePicture('Peking'),
      generatePicture('Peking')
    ]
  },
  {
    name : 'Seoul',
    description : 'description Seoul',
    pictures: [
      generatePicture('Seoul'),
      generatePicture('Seoul'),
      generatePicture('Seoul')
    ]
  },
  {
    name : 'Toronto',
    description : 'description Toronto',
    pictures: [
      generatePicture('Toronto'),
      generatePicture('Toronto'),
      generatePicture('Toronto')
    ]
  },
  {
    name : 'St-peterburg',
    description : 'description St-peterburg',
    pictures: [
      generatePicture('St-peterburg'),
      generatePicture('St-peterburg'),
      generatePicture('St-peterburg')
    ]
  },
];

const generateCity = () => CITIES[getRandomInteger(0, CITIES.length - 1)];

const getDestination = (city) => (
  DESTINATIONS.find((item) => item.name === city)
);

const generateDestination = () => {
  const city = generateCity();
  const destination = DESTINATIONS.find((item) => item.name === city);
  return destination;
};

export { DESTINATIONS, CITIES , generateCity, getDestination, generateDestination};
