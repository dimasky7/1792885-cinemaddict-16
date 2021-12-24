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
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const filmElement = document.querySelector('.films');
//const filmListElement = filmElement.querySelector('.films-list');
//const filmContainerElement = filmListElement.querySelector('.films-list__container');
//const footer = document.querySelector('.footer');
//const statisticsContainerElement = footer.querySelector('.footer__statistics');

export default class MovieListPresenter {
#sortComponent = new SortView();
//#listComponent = new ListView();
//#movies = [];
//#comments = [];
//#filters = [];
/*
constructor() {
  //this.#movies = [...movies];
  //this.#comments = [...comments];
  //this.#filters = [...filters];
}
*/
init = () => {
  //this.#renderUserProfile();
  //this.#renderFilters();
  this.#renderSort();
}

/*
#renderUserProfile = () => {
  const headerElement = document.querySelector('.header');
  render(headerElement, new UserProfileView(this.#movies), RenderPosition.BEFOREEND);
}

#renderFilters = () => {
  const mainElement = document.querySelector('.main');
  render(mainElement, new FiltersView(this.#filters), RenderPosition.BEFOREEND);
}
*/
#renderSort = () => {
  render(mainElement, this.#sortComponent, RenderPosition.BEFOREEND);
}

/*
#renderCards = () => {

}

#renderShowMoreButton = () => {

}

#renderStats = () => {

}

#renderPopup = () => {

}
*/
}
