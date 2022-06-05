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
  },
  {
    from: '2018-03-10T22:55:56.845Z',
    to: '2018-03-10T22:56:56.845Z'
  },
  {
    from: '2020-09-10T22:55:56.845Z',
    to: '2020-09-10T22:56:56.845Z'
  }
];

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeTaskDueDate = (dueDate, format = 'D MMM') => dayjs(dueDate).format(format);

const getTimeDuration = (dateFrom, dateTo) => {
  const timeDiff = Math.abs(dayjs(dateTo) - dayjs(dateFrom));
  const daysCount = Math.floor(timeDiff / (1000 * 3600 * 24));
  const daysInSeconds = daysCount * 1000 * 3600 * 24;
  const hoursCount = Math.floor((timeDiff - daysInSeconds) / (1000 * 3600));
  const hoursInSeconds = hoursCount * 1000 * 3600;
  const minutesCount = Math.floor((timeDiff - daysInSeconds - hoursInSeconds) / (1000 * 60));
  const timeString = () => {
    let result = '';
    result = daysCount ? `${result} ${daysCount}D` : result;
    const hoursString = hoursCount < 10 ? `0${hoursCount}` : hoursCount;
    const minutesString = minutesCount < 10 ? `0${minutesCount}` : minutesCount;
    result = hoursCount || (minutesCount && daysCount) ? `${result}${hoursString}H` : result;
    result = minutesCount ? `${result} ${minutesString}M` : result;
    return result;
  };
  return timeString();
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortTaskDate = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dateFrom, taskB.dateFrom);

  return weight ?? dayjs(taskA.dateFrom).diff(dayjs(taskB.dateFrom));
};

const sortTaskTime = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dateFrom, taskB.dateFrom);
  return weight ?? dayjs(taskB.dateFrom).diff(dayjs(taskB.dateTo)) - dayjs(taskA.dateFrom).diff(dayjs(taskA.dateTo));
};

const sortTaskPrice = (taskA, taskB) => (taskA.basePrice - taskB.basePrice);

const getRandomDayFromTo = () => DAYS[getRandomInteger(0,DAYS.length-1)];


export { getRandomInteger, humanizeTaskDueDate, getTimeDuration, getRandomDayFromTo, updateItem, sortTaskDate, sortTaskTime, sortTaskPrice };
