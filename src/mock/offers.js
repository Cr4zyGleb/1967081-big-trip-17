import { getRandomInteger } from '../utils.js';

const OFFERS = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'taxi1',
        price: 111,
      },
      {
        id: 2,
        title: 'taxi2',
        price: 222,
      },
      {
        id: 3,
        title: 'taxi3',
        price: 333,
      },
      {
        id: 4,
        title: 'taxi4',
        price: 444,
      },
    ]
  },
  {
    type: 'bus',
    offers: []
  },
  {
    type: 'train',
    offers: [
      {
        id: 1,
        title: 'train1',
        price: 111,
      },
      {
        id: 2,
        title: 'train2',
        price: 222,
      },
      {
        id: 3,
        title: 'train3',
        price: 333,
      },
      {
        id: 4,
        title: 'train4',
        price: 444,
      },
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 1,
        title: 'ship1',
        price: 111,
      },
      {
        id: 2,
        title: 'ship2',
        price: 222,
      },
      {
        id: 3,
        title: 'ship3',
        price: 333,
      },
      {
        id: 4,
        title: 'ship4',
        price: 444,
      },
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'drive1',
        price: 111,
      },
      {
        id: 2,
        title: 'drive2',
        price: 222,
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'flight1',
        price: 111,
      },
      {
        id: 2,
        title: 'flight2',
        price: 222,
      },
      {
        id: 3,
        title: 'flight3',
        price: 333,
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 1,
        title: 'check-in1',
        price: 111,
      },
      {
        id: 2,
        title: 'check-in2',
        price: 222,
      },
      {
        id: 3,
        title: 'check-in3',
        price: 333,
      },
      {
        id: 4,
        title: 'check-in4',
        price: 444,
      },
      {
        id: 5,
        title: 'check-in5',
        price: 555,
      },
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 1,
        title: 'sightseeing1',
        price: 111,
      },
      {
        id: 2,
        title: 'sightseeing2',
        price: 222,
      },
      {
        id: 3,
        title: 'sightseeing3',
        price: 333,
      },
      {
        id: 4,
        title: 'sightseeing4',
        price: 444,
      },
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 1,
        title: 'restaurant1',
        price: 111,
      },
      {
        id: 2,
        title: 'restaurant2',
        price: 222,
      },
      {
        id: 3,
        title: 'restaurant3',
        price: 333,
      },
      {
        id: 4,
        title: 'restaurant4',
        price: 444,
      },
    ]
  },
];

const getOfferByType  = (type) => {
  const offerByType = OFFERS.find((item) => item.type === type);
  return offerByType;
};

const getOfferById  = (id, type) => {
  const offerByType = OFFERS.find((item) => item.type === type);
  const offer = offerByType.offers.find((item) => item.id === id);
  return offer;
};

const generateIdOffers = (type) => {
  const offers = OFFERS.find((item) => item.type === type);
  const idOffers = [];
  for (let i = 0; i < offers.offers.length; i++){
    const randomInteger = getRandomInteger(0,1);
    if (randomInteger) {
      idOffers.push(offers.offers[i].id);
    }
  }
  return idOffers;
};

export { OFFERS, getOfferById, getOfferByType, generateIdOffers };
