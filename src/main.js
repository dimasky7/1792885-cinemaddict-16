import {renderTemplate, renderElement, RenderPosition} from './render.js';
import UserProfile from './view/user-profile-view.js';
import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import ListView from './view/list-view.js';
import CardView from './view/card-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import StatsView from './view/stats-view.js';
import PopupView from './view/card-detail-popup-view.js';
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
    const cardViewComponent = [];
    cardViewComponent[i] = new CardView(movies[i]);
    renderElement(container, cardViewComponent[i].element, RenderPosition.BEFOREEND);
    cardViewComponent[i].link.addEventListener('click', () => {
      const popup = new PopupView(movies[i], comments);
      document.body.appendChild(popup.element);
      document.body.classList.add('hide-overflow');
      popup.closePopup.addEventListener('click', () => {
        document.body.removeChild(popup.element);
        document.body.classList.remove('hide-overflow');
      });
    });
  }
};

renderElement(headerElement, new UserProfile(movies).element, RenderPosition.BEFOREEND);
renderElement(mainElement, new FiltersView(filters).element, RenderPosition.BEFOREEND);
renderElement(mainElement, new SortView().element, RenderPosition.BEFOREEND);
renderElement(mainElement, new ListView().element, RenderPosition.BEFOREEND);

const filmElement = document.querySelector('.films');
const filmListElement = filmElement.querySelector('.films-list');
const filmContainerElement = filmListElement.querySelector('.films-list__container');

createSomeFilmCards(MOVIE_COUNT_PER_STEP, filmContainerElement);

const footer = document.querySelector('.footer');
const statisticsContainerElement = footer.querySelector('.footer__statistics');

renderElement(statisticsContainerElement, new StatsView(movies).element, RenderPosition.BEFOREEND);

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
      .forEach((movie) => renderElement(filmContainerElement, new CardView(movie).element, RenderPosition.BEFOREEND));

    renderedTaskCount += MOVIE_COUNT_PER_STEP;

    if (renderedTaskCount >= movies.length) {
      showMoreButtonComponent.element.remove();
      showMoreButtonComponent.removeElement();
    }
  });
}
