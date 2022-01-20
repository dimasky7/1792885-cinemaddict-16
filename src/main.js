import MovieListPresenter from './presenter/movie-list-presenter.js';
import {getMovie} from './mock/movie.js';
import {getComments} from './mock/comments.js';
import {getFilters} from './mock/filters.js';
import MoviesModel from './model/movies-model.js';

const CARD_IN_LIST_COUNT = 23;

const movies = Array.from({length: CARD_IN_LIST_COUNT}, getMovie);
const commentsIds = [].concat(...movies.map((movie) => (movie.commentsIds)));
//console.log(commentsIds);
const comments = getComments(commentsIds);
//console.log(comments);
const filters = getFilters(movies);

const moviesModel = new MoviesModel();
moviesModel.movies = movies;

const Presenter = new MovieListPresenter(moviesModel, comments, filters);
Presenter.init();
