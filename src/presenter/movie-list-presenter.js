import {render, RenderPosition, remove} from '../render.js';
import UserProfileView from '../view/user-profile-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import CardView from '../view/card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import StatsView from '../view/stats-view.js';
import PopupView from '../view/card-detail-popup-view.js';
import { SortType } from '../const.js';
import { sortByDate, sortByRating } from '../utils.js';

const MOVIE_COUNT_PER_STEP = 5;
const mainElement = document.querySelector('.main');

export default class MovieListPresenter {
#sortComponent = new SortView();
#listComponent = new ListView();
#showMoreButtonComponent = new ShowMoreButtonView();
#popupComponent = null;
#movies = [];
#sourcedMovies = [];
#currentSortType = SortType.DEFAULT;
#comments = [];
#filters = [];
#cardViewComponent = [];

constructor(movies, comments, filters) {
  this.#movies = [...movies];
  this.#sourcedMovies = [...movies];
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

#sortMovies = (sortType) => {
  switch (sortType) {
    case SortType.DATE:
      this.#movies.sort(sortByDate);
      break;
    case SortType.RATING:
      this.#movies.sort(sortByRating);
      break;
    default:
      this.#movies = [...this.#sourcedMovies];
  }

  this.#currentSortType = sortType;
}

#handleSortTypeChange = (sortType) => {
  if (this.#currentSortType === sortType) {
    return;
  }
  this.#sortMovies(sortType);
  this.#clearMovieList();
  this.#renderCards();
}

#renderSort = () => {
  render(mainElement, this.#sortComponent, RenderPosition.BEFOREEND);
  this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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
          this.#popupComponent = new PopupView(movie, this.#comments);
          this.#popupComponent.element.setAttribute('data-popup', '');
          document.body.appendChild(this.#popupComponent.element);
          this.#popupComponent.setFormSubmitHandler(() => {
            this.element.querySelector('.film-details__comments-list')
              .appendChild(this.element.querySelector('.film-details__add-emoji-label'));
          });
          document.body.classList.add('hide-overflow');
          this.#popupComponent.setClosePopupHandler(() => {
            remove(this.#popupComponent);
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

#clearMovieList = () => {
  this.#cardViewComponent.forEach((cardView) => {
    remove(cardView);
  });
  remove(this.#showMoreButtonComponent);
  remove(this.#popupComponent);
  if (document.body.classList.contains('hide-overflow')) {
    document.body.classList.remove('hide-overflow');
  }
}

#renderStats = () => {
  const footer = document.querySelector('.footer');
  const statisticsContainerElement = footer.querySelector('.footer__statistics');
  render(statisticsContainerElement, new StatsView(this.#movies), RenderPosition.BEFOREEND);
}

}
