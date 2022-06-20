import dayjs from 'dayjs';

const humanizeTaskDueDate = (dueDate, format = 'D MMM') => dayjs(dueDate).format(format);

const getTimeDuration = (dateFrom, dateTo) => {
  const timeDiff = Math.abs(dayjs(dateTo) - dayjs(dateFrom));
  const daysCount = Math.floor(timeDiff / (1000 * 3600 * 24));
  const daysInSeconds = daysCount * 1000 * 3600 * 24;
  const hoursCount = Math.floor((timeDiff - daysInSeconds) / (1000 * 3600));
  const hoursInSeconds = hoursCount * 1000 * 3600;
  const minutesCount = Math.floor((timeDiff - daysInSeconds - hoursInSeconds) / (1000 * 60));
  const getTimeString = () => {
    let result = '';
    result = daysCount ? `${result} ${daysCount}D` : result;
    const hoursString = hoursCount < 10 ? `0${hoursCount}` : hoursCount;
    const minutesString = minutesCount < 10 ? `0${minutesCount}` : minutesCount;
    result = hoursCount || (minutesCount && daysCount) ? `${result}${hoursString}H` : result;
    result = minutesCount ? `${result} ${minutesString}M` : result;
    return result;
  };
  return getTimeString();
};

const addElementToArray = (elements, item) => {
  if (!elements.includes(item)) {
    elements.push(item);
  }
  return elements;
};

const deleteElementFromArray = (elements, item) => {
  const indexItem = elements.indexOf(item);
  if (indexItem !== -1) {
    return [
      ...elements.slice(0, indexItem),
      ...elements.slice(indexItem + 1),
    ];
  }

  return elements;
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
  return weight ?? dayjs(taskA.dateFrom).diff(dayjs(taskA.dateTo)) - dayjs(taskB.dateFrom).diff(dayjs(taskB.dateTo));
};

const sortTaskPrice = (taskA, taskB) => (taskB.basePrice - taskA.basePrice);

export { humanizeTaskDueDate, getTimeDuration, sortTaskDate, sortTaskTime, sortTaskPrice, addElementToArray, deleteElementFromArray };
