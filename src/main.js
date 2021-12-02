import {createFilmCard} from './view/film-card-view.js';
import { createFilmCardPopup } from './view/film-card-popup-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import { createProfileRating } from './view/profile-rating-view.js';
import { createProfileStatistics } from './view/profile-statistics-view.js';
import { createMainMenu } from './view/main-menu-view.js';
import { createShowMoreButton } from './view/show-more-button-view.js';


const profileRating = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
//const popup = document.querySelector('body');


renderTemplate(profileRating, createProfileRating(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMainMenu(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createFilmCard(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createShowMoreButton(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createProfileStatistics(), RenderPosition.BEFOREEND);
//renderTemplate(popup, createFilmCardPopup(), RenderPosition.BEFOREEND);

