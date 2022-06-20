import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { TYPES } from '../const.js';
import { humanizeTaskDueDate } from '../utils/utils.js';

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
  const point = {
    isNew: true,
    destination: null,
    basePrice: 0,
    id: nanoid(),
    dateFrom: dateFromHumanize,
    dateTo: dateToHumanize,
    isFavorite: false,
    type: type,
    offers: []
  };

  return point;
};
