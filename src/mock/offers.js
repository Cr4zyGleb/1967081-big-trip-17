const getOfferByType  = (type, pointsModel) => {
  const offerByType = pointsModel.offers.find((item) => item.type === type);
  return offerByType;
};

const getOfferById  = (id, type, pointsModel) => {
  const offerByType = pointsModel.offers.find((item) => item.type === type);
  const offer = offerByType.offers.find((item) => item.id === id);
  return offer;
};

export {getOfferById, getOfferByType };
