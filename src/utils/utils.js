import dayjs from 'dayjs';

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

const addArrElement = (arr, item) => {
  if (!arr.includes(item)) {
    arr.push(item);
  }
  return arr;
};

const deleteArrElement = (arr, item) => {
  const indexItem = arr.indexOf(item);
  if (indexItem !== -1) {
    return [
      ...arr.slice(0, indexItem),
      ...arr.slice(indexItem + 1),
    ];
  }

  return arr;
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

export { getRandomInteger, humanizeTaskDueDate, getTimeDuration, updateItem, sortTaskDate, sortTaskTime, sortTaskPrice, addArrElement, deleteArrElement };
