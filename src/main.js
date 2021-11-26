import {createSiteMenuTemplate} from './view/site-menu-view.js';
import { createFilmCardPopup } from './view/film-card-popup.js';
import {renderTemplate, RenderPosition} from './render.js';

const siteMainElement = document.querySelector('.main');
const popup = document.querySelector('body');

renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(popup, createFilmCardPopup(), RenderPosition.BEFOREEND);
