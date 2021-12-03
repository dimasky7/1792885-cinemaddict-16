import {createFilmCard} from './view/film-card-view.js';
import { createFilmCardPopup } from './view/film-card-popup-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import { createProfileRating } from './view/profile-rating-view.js';
import { createProfileStatistics } from './view/profile-statistics-view.js';
import { createMainMenu } from './view/main-menu-view.js';
import { createShowMoreButton } from './view/show-more-button-view.js';
import { createNumberOfMovies } from './view/number-of-movies-view.js';

const FILM_CARD_COUNT = 5;

const profileRating = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmList = siteMainElement.querySelector('.films-list');
const filmCardContainer = filmList.querySelector('.films-list__container');
const numberOfMovies = document.querySelector('.footer__statistics');
const popup = document.querySelector('body');


renderTemplate(profileRating, createProfileRating(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMainMenu(), RenderPosition.AFTERBEGIN);
for (let i=0; i < FILM_CARD_COUNT; i++) {
  renderTemplate(filmCardContainer, createFilmCard(), RenderPosition.BEFOREEND);
}
renderTemplate(filmList, createShowMoreButton(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createProfileStatistics(), RenderPosition.BEFOREEND);
renderTemplate(numberOfMovies, createNumberOfMovies(), RenderPosition.BEFOREEND);
renderTemplate(popup, createFilmCardPopup(), RenderPosition.BEFOREEND);
