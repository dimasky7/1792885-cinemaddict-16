import MovieListPresenter from './presenter/movie-list-presenter.js';
import {getMovie} from './mock/movie.js';
import {getComments} from './mock/comments.js';
import {getFilters} from './mock/filters.js';

const CARD_IN_LIST_COUNT = 23;

const movies = Array.from({length: CARD_IN_LIST_COUNT}, getMovie);
const commentsIds = [].concat(...movies.map((movie) => (movie.commentsIds)));
const comments = getComments(commentsIds);
const filters = getFilters(movies);

const Presenter = new MovieListPresenter(movies, comments, filters);
Presenter.init();
