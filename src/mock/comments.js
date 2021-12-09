import {getRandomElement, getRandomInteger, getText} from '../utils';
import dayjs from 'dayjs';

const emojis = ['smile', 'sleeping', 'puke', 'angry'];
const authors = [
  'Vasya',
  'Leha',
  'Petya',
  'Anya',
  'Klava',
  'Lusya',
  'Masha',
];

const getDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const getComment = (id) => ({
  id,
  text: getText(1, 2),
  emoji: getRandomElement(emojis),
  author: getRandomElement(authors),
  date: getDate(),
});

export const getComments = (ids) => (ids.map((id) => getComment(id)));
