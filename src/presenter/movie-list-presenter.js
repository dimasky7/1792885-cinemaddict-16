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
import { UpdateType } from '../const.js';

const MOVIE_COUNT_PER_STEP = 5;
const mainElement = document.querySelector('.main');

export default class MovieListPresenter {
#sortComponent = new SortView();
#listComponent = new ListView();
#showMoreButtonComponent = new ShowMoreButtonView();
#popupComponent = null;
#moviesModel = null;
#renderedMovieCount = MOVIE_COUNT_PER_STEP;
//#movies = [];
//#sourcedMovies = [];
#currentSortType = SortType.DEFAULT;
#comments = [];
#filters = [];
#cardViewComponent = [];

constructor(moviesModel, comments, filters) {
  //this.#movies = [...movies];
  //this.#sourcedMovies = [...movies];
  this.#moviesModel = moviesModel;
  this.#comments = [...comments];
  this.#filters = [...filters];
  this.#moviesModel.addObserver(this.#handleModelEvent);
}

get movies() {
  switch (this.#currentSortType) {
    case SortType.DATE:
      return [...this.#moviesModel.movies].sort(sortByDate);
    case SortType.RATING:
      return [...this.#moviesModel.movies].sort(sortByRating);
  }

  return this.#moviesModel.movies;
}

/*
#handleViewAction = (updateType, update) => {
  console.log(updateType, update);
  // Здесь будем вызывать обновление модели.
  // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
  // update - обновленные данные
}
*/

#handleModelEvent = (updateType, data) => {
  // В зависимости от типа изменений решаем, что делать:
  // - обновить часть списка (например, когда поменялось описание)
  // - обновить список (например, когда задача ушла в архив)
  // - обновить всю доску (например, при переключении фильтра)
  console.log(updateType, data);
  switch (updateType) {
    case UpdateType.MINOR:
      this.#clearMovieList();
      this.#renderMovieList();
      break;
  }

}

init = () => {
  this.#renderUserProfile();
  this.#renderFilters();
  this.#renderSort();
  this.#renderList();
  this.#renderMovieList();
  this.#renderStats();
}


#renderUserProfile = () => {
  const headerElement = document.querySelector('.header');
  render(headerElement, new UserProfileView(this.movies), RenderPosition.BEFOREEND);
}

#renderFilters = () => {
  render(mainElement, new FiltersView(this.#filters), RenderPosition.BEFOREEND);
}

#handleSortTypeChange = (sortType) => {

  if (this.#currentSortType === sortType) {
    return;
  }

  this.#currentSortType = sortType;
  this.#clearMovieList();
  this.#renderMovieList();
}

#renderSort = () => {
  render(mainElement, this.#sortComponent, RenderPosition.BEFOREEND);
  this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
}

#renderList = () => {
  render(mainElement, this.#listComponent, RenderPosition.BEFOREEND);
}

#renderCards = (movies, counter) => {
  const filmElement = document.querySelector('.films');
  const filmListElement = filmElement.querySelector('.films-list');
  const filmContainerElement = filmListElement.querySelector('.films-list__container');
  movies.forEach((movie) => {
    this.#cardViewComponent[counter] = new CardView(movie);
    render(filmContainerElement, this.#cardViewComponent[counter], RenderPosition.BEFOREEND);
    this.#cardViewComponent[counter].setAddToFavoritesHandler(() => {
      this.#moviesModel.updateMovie(UpdateType.MINOR, {...movie, isFavorite: !movie.isFavorite});
    });
    this.#cardViewComponent[counter].setOpenPopupHandler(() => {
      if (document.body.lastElementChild.hasAttribute('data-popup')) {document.body.lastElementChild.remove();}
      this.#popupComponent = new PopupView(movie, this.#comments);
      this.#popupComponent.element.setAttribute('data-popup', '');
      document.body.appendChild(this.#popupComponent.element);
      this.#popupComponent.setFormSubmitHandler(() => {
        const newComment = document.createElement('li');
        newComment.classList.add('film-details__comment');
        const emojiCopy = this.#popupComponent.element.querySelector('.film-details__add-emoji-label').cloneNode(true);
        emojiCopy.classList.remove('film-details__add-emoji-label');
        newComment.appendChild(emojiCopy);
        const newText = document.createElement('p');
        newText.textContent = this.#popupComponent.element.querySelector('.film-details__comment-input').value;
        newText.classList.add('film-details__comment-text');
        newComment.appendChild(newText);
        this.#popupComponent.element.querySelector('.film-details__comments-list').appendChild(newComment);
      });
      document.body.classList.add('hide-overflow');
      this.#popupComponent.setClosePopupHandler(() => {
        remove(this.#popupComponent);
        document.body.classList.remove('hide-overflow');
      });
    });
    counter++;
  });
}

#renderMovieList = () => {
  const movieCount = this.movies.length;
  const firstRenderedMovies = this.movies.slice(0, Math.min(movieCount, MOVIE_COUNT_PER_STEP));
  this.#renderCards(firstRenderedMovies, 0);
  if (movieCount > MOVIE_COUNT_PER_STEP) {
    this.#renderShowMoreButton();
  }
}

#renderShowMoreButton = () => {
  const filmListElement = document.querySelector('.films-list');
  render(filmListElement, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
}

#handleShowMoreButtonClick = () => {
  const movieCount = this.movies.length;
  const newRenderedMovieCount = Math.min(movieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
  const movies = this.movies.slice(this.#renderedMovieCount, newRenderedMovieCount);

  this.#renderCards(movies, this.#renderedMovieCount);
  this.#renderedMovieCount = newRenderedMovieCount;

  if (this.#renderedMovieCount >= movieCount) {
    remove(this.#showMoreButtonComponent);
  }
}

#clearMovieList = () => {
  this.#cardViewComponent.forEach((cardView) => {
    remove(cardView);
  });
  remove(this.#showMoreButtonComponent);
  remove(this.#popupComponent);
  this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
  this.#cardViewComponent = [];
  if (document.body.classList.contains('hide-overflow')) {
    document.body.classList.remove('hide-overflow');
  }
}

#renderStats = () => {
  const footer = document.querySelector('.footer');
  const statisticsContainerElement = footer.querySelector('.footer__statistics');
  render(statisticsContainerElement, new StatsView(this.movies), RenderPosition.BEFOREEND);
}

}
