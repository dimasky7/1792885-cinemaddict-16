import dayjs from 'dayjs';
import {RANDOM_STRINGS} from './const';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (array) => {
  const integer = getRandomInteger(0, array.length - 1);

  return array[integer];
};

export const getText = (min, max) => {
  const stringsCount = getRandomInteger(min, max);

  return new Array(stringsCount).fill('').map(() => getRandomElement(RANDOM_STRINGS)).join(' ');
};

export const sortByRating = (movieA, movieB) => movieB.rating - movieA.rating;

export const sortByDate = (movieA, movieB) => dayjs(movieB.release).diff(dayjs(movieA.release));
