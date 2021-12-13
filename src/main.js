import {renderTemplate, renderElement, RenderPosition} from './render.js';
import {createUserProfileTemplate} from './view/user-profile-view.js';
import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import ListView from './view/list-view.js';
import {createCardTemplate} from './view/card-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import {createStatsTemplate} from './view/stats-view.js';
import {createCardDetailPopup} from './view/card-detail-popup-view.js';
import {getMovie} from './mock/movie.js';
import {getComments} from './mock/comments.js';
import {getFilters} from './mock/filters.js';
import {START_INDEX} from './const.js';

const CARD_IN_LIST_COUNT = 23;
const MOVIE_COUNT_PER_STEP = 5;

const movies = Array.from({length: CARD_IN_LIST_COUNT}, getMovie);
const commentsIds = [].concat(...movies.map((movie) => (movie.commentsIds)));
const comments = getComments(commentsIds);
const filters = getFilters(movies);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

const createSomeFilmCards = (count, container) => {
  for (let i = 0; i < count; i++) {
    renderTemplate(container, createCardTemplate(movies[i]), RenderPosition.BEFOREEND);
  }
};

renderTemplate(headerElement, createUserProfileTemplate(movies), RenderPosition.BEFOREEND);
renderElement(mainElement, new FiltersView(filters).element, RenderPosition.BEFOREEND);
renderElement(mainElement, new SortView().element, RenderPosition.BEFOREEND);
renderElement(mainElement, new ListView().element, RenderPosition.BEFOREEND);

const filmElement = document.querySelector('.films');
const filmListElement = filmElement.querySelector('.films-list');
const filmContainerElement = filmListElement.querySelector('.films-list__container');

createSomeFilmCards(MOVIE_COUNT_PER_STEP, filmContainerElement);

const footer = document.querySelector('.footer');
const statisticsContainerElement = footer.querySelector('.footer__statistics');

renderTemplate(statisticsContainerElement, createStatsTemplate(movies), RenderPosition.BEFOREEND);

//comment next line to check the program
//renderTemplate(footer, createCardDetailPopup(movies[START_INDEX], comments), RenderPosition.AFTEREND);

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedTaskCount = MOVIE_COUNT_PER_STEP;

  //renderTemplate(filmListElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
  const showMoreButtonComponent = new ShowMoreButtonView();
  renderElement(filmListElement, showMoreButtonComponent.element, RenderPosition.BEFOREEND);

  //const loadMoreButton = filmListElement.querySelector('.films-list__show-more');

  showMoreButtonComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedTaskCount, renderedTaskCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => renderTemplate(filmContainerElement, createCardTemplate(movie), RenderPosition.BEFOREEND));

    renderedTaskCount += MOVIE_COUNT_PER_STEP;

    if (renderedTaskCount >= movies.length) {
      showMoreButtonComponent.element.remove();
      showMoreButtonComponent.removeElement();
    }
  });
}
