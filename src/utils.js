import dayjs from 'dayjs';

const DAYS = [
  {
    from: '2019-07-10T22:55:56.845Z',
    to: '2019-08-10T22:55:56.845Z'
  },
  {
    from: '2019-07-02T22:55:56.845Z',
    to: '2019-07-15T23:55:56.845Z'
  },
  {
    from: '2019-07-10T10:55:56.845Z',
    to: '2019-07-11T10:58:56.845Z'
  },
  {
    from: '2019-07-10T22:55:56.845Z',
    to: '2019-09-13T08:55:56.845Z'
  },
  {
    from: '2019-07-10T22:55:56.845Z',
    to: '2019-07-10T23:55:56.845Z'
  },
  {
    from: '2019-07-10T22:55:56.845Z',
    to: '2019-07-10T22:56:56.845Z'
  }
];

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');

const getTimeDuration = (dateFrom, dateTo) => {
  const timeDiff = Math.abs(dayjs(dateTo) - dayjs(dateFrom));
  const daysCount = Math.floor(timeDiff / (1000 * 3600 * 24));
  const daysInSeconds = daysCount * 1000 * 3600 * 24;
  const hoursCount = Math.floor((timeDiff - daysInSeconds) / (1000 * 3600));
  const hoursInSeconds = hoursCount * 1000 * 3600;
  const minutesCount = Math.floor((timeDiff - daysInSeconds - hoursInSeconds) / (1000 * 60));
  const timeString = () => {
    let result = '';
    result = daysCount ? `${result}${daysCount}D` : result;
    const hoursString = hoursCount < 10 ? `0${hoursCount}` : hoursCount;
    const minutesString = minutesCount < 10 ? `0${minutesCount}` : minutesCount;
    result = hoursCount || (minutesCount && daysCount) ? `${result}${hoursString}H` : result;
    result = minutesCount ? `${result}${minutesString}M` : result;
    return result;
  };
  return timeString();
};

const getRandomDayFromTo = () => DAYS[getRandomInteger(0,DAYS.length-1)];

export { getRandomInteger, humanizeTaskDueDate, getTimeDuration, getRandomDayFromTo };
