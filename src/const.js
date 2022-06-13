const SortType = {
  DATE: 'DATE',
  PRICE: 'PRICE',
  TIME: 'TIME',
  DISABLED : 'DISABLED'
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future'
};

const DATE_HOURS_FORMAT = 'HH:mm';

export { SortType, DATE_HOURS_FORMAT, UserAction, UpdateType, FilterType };
