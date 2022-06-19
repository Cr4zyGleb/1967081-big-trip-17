const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

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
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future'
};

const EmptyListMessage = {
  EVERYTHING : 'Click New Event to create your first point',
  PAST : 'There are no past events now',
  FUTURE : 'There are no future events now'
};

const DATE_HOURS_FORMAT = 'HH:mm';

export { SortType, DATE_HOURS_FORMAT, UserAction, UpdateType, FilterType, EmptyListMessage, TYPES };
