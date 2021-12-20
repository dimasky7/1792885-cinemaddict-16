import {render, RenderPosition} from './render.js';
import UserProfileView from './view/user-profile-view.js';
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

const CARD_IN_LIST_COUNT = 23;
const MOVIE_COUNT_PER_STEP = 5;

const movies = Array.from({length: CARD_IN_LIST_COUNT}, getMovie);
const commentsIds = [].concat(...movies.map((movie) => (movie.commentsIds)));
const comments = getComments(commentsIds);
const filters = getFilters(movies);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

render(headerElement, new UserProfileView(movies).element, RenderPosition.BEFOREEND);
render(mainElement, new FiltersView(filters).element, RenderPosition.BEFOREEND);
render(mainElement, new SortView().element, RenderPosition.BEFOREEND);
render(mainElement, new ListView().element, RenderPosition.BEFOREEND);

const filmElement = document.querySelector('.films');
const filmListElement = filmElement.querySelector('.films-list');
const filmContainerElement = filmListElement.querySelector('.films-list__container');

const footer = document.querySelector('.footer');
const statisticsContainerElement = footer.querySelector('.footer__statistics');
render(statisticsContainerElement, new StatsView(movies).element, RenderPosition.BEFOREEND);


const renderCards = (cardContainer, moviesArray) => {
  const cardViewComponent = [];
  let i = -1;
  moviesArray
    .slice(0, Math.min(moviesArray.length, MOVIE_COUNT_PER_STEP))
    .forEach((movie) => {
      i++;
      cardViewComponent[i] = new CardView(movie);
      render(cardContainer, cardViewComponent[i].element, RenderPosition.BEFOREEND);
      cardViewComponent[i].setOpenPopupHandler(() => {
        const popup = new PopupView(movie, comments);
        document.body.appendChild(popup.element);
        document.body.classList.add('hide-overflow');
        popup.setClosePopupHandler(() => {
          document.body.removeChild(popup.element);
          document.body.classList.remove('hide-overflow');
        });
      });
    });


  if (movies.length > MOVIE_COUNT_PER_STEP) {
    let renderedMovieCount = MOVIE_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();
    render(filmListElement, showMoreButtonComponent.element, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
      moviesArray
        .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
        .forEach((movie) => {
          i++;
          cardViewComponent[i] = new CardView(movie);
          render(cardContainer, cardViewComponent[i].element, RenderPosition.BEFOREEND);
          cardViewComponent[i].setOpenPopupHandler(() => {
            const popup = new PopupView(movie, comments);
            document.body.appendChild(popup.element);
            document.body.classList.add('hide-overflow');
            popup.setClosePopupHandler(() => {
              document.body.removeChild(popup.element);
              document.body.classList.remove('hide-overflow');
            });
          });
        });

      renderedMovieCount += MOVIE_COUNT_PER_STEP;

      if (renderedMovieCount >= movies.length) {
        showMoreButtonComponent.element.remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
};

renderCards(filmContainerElement, movies);
