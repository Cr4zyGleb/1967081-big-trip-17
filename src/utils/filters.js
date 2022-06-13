import dayjs from 'dayjs';
import {FilterType} from '../const';

const getFilteredPoints = (filterType, points) => {

  switch (filterType) {
    case FilterType.FUTURE:
      return points.filter((point) => {
        const dateNow = dayjs();
        return dayjs(point.dateFrom).isAfter(dateNow, 'day');
      });
    case FilterType.PAST:
      return points.filter((point) => {
        const dateNow = dayjs();
        return dayjs(point.dateTo).isBefore(dateNow, 'day');
      });
    default:
      return points;

  }
};

export { getFilteredPoints };
