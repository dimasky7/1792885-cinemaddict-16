import {render, RenderPosition, remove} from '../render.js';
import UserProfileView from '../view/user-profile-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import CardView from '../view/card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import StatsView from '../view/stats-view.js';
import PopupView from '../view/card-detail-popup-view.js';

const MOVIE_COUNT_PER_STEP = 5;
const mainElement = document.querySelector('.main');

export default class MovieListPresenter {
#sortComponent = new SortView();
#listComponent = new ListView();
#showMoreButtonComponent = new ShowMoreButtonView();
#movies = [];
#comments = [];
#filters = [];
#cardViewComponent = [];

constructor(movies, comments, filters) {
  this.#movies = [...movies];
  this.#comments = [...comments];
  this.#filters = [...filters];
}

init = () => {
  this.#renderUserProfile();
  this.#renderFilters();
  this.#renderSort();
  this.#renderCards();
  this.#renderStats();
}


#renderUserProfile = () => {
  const headerElement = document.querySelector('.header');
  render(headerElement, new UserProfileView(this.#movies), RenderPosition.BEFOREEND);
}

#renderFilters = () => {
  render(mainElement, new FiltersView(this.#filters), RenderPosition.BEFOREEND);
}

#renderSort = () => {
  render(mainElement, this.#sortComponent, RenderPosition.BEFOREEND);
}

#renderList = () => {
  render(mainElement, this.#listComponent, RenderPosition.BEFOREEND);
}

#renderCards = () => {
  this.#renderList();
  const filmElement = document.querySelector('.films');
  const filmListElement = filmElement.querySelector('.films-list');
  const filmContainerElement = filmListElement.querySelector('.films-list__container');
  let i = -1;
  const drawMoviesCards = (from, to) => {
    this.#movies
      .slice(from, to)
      .forEach((movie) => {
        i++;
        this.#cardViewComponent[i] = new CardView(movie);
        render(filmContainerElement, this.#cardViewComponent[i], RenderPosition.BEFOREEND);
        this.#cardViewComponent[i].setOpenPopupHandler(() => {
          if (document.body.lastElementChild.hasAttribute('data-popup')) {document.body.lastElementChild.remove();}
          const popup = new PopupView(movie, this.#comments);
          popup.element.setAttribute('data-popup', '');
          document.body.appendChild(popup.element);
          document.body.classList.add('hide-overflow');
          popup.setClosePopupHandler(() => {
            document.body.removeChild(popup.element);
            document.body.classList.remove('hide-overflow');
          });
        });
      });
  };
  drawMoviesCards(0, Math.min(this.#movies.length, MOVIE_COUNT_PER_STEP));
  this.#renderShowMoreButton(filmListElement);
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;
  this.#showMoreButtonComponent.setClickHandler(() => {
    drawMoviesCards(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP);
    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= this.#movies.length) {
      remove(this.#showMoreButtonComponent);
    }
  });

}

#renderShowMoreButton = (buttonContainer) => {
  if (this.#movies.length > MOVIE_COUNT_PER_STEP) {
    render(buttonContainer, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }
}

#renderStats = () => {
  const footer = document.querySelector('.footer');
  const statisticsContainerElement = footer.querySelector('.footer__statistics');
  render(statisticsContainerElement, new StatsView(this.#movies), RenderPosition.BEFOREEND);
}

}
