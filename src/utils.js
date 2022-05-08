import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');

const getTimeDuration = (dateFrom, dateTo) => {
  const timeDiff = Math.abs(dayjs(dateTo)- dayjs(dateFrom));
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return `duration: ${diffDays} day`;
};

export { getRandomInteger, humanizeTaskDueDate, getTimeDuration };
