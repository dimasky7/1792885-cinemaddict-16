import AbstractView from './abstract-view';


const FILTER = {
  all: 'All movies',
  watchlist: 'Watchlist',
  history: 'History',
  favorites: 'Favorites',
};

const getNavigationItem = (filters) =>
  filters.map((filter) => {
    if (filter.name === 'all') {
      return `<a
                  href="#${filter.name}"
                  class="main-navigation__item" data-filter-type="all">
                  ${FILTER[filter.name]}
              </a>`;
    }

    return `<a
                  href="#${filter.name}"
                  class="main-navigation__item" data-filter-type="${filter.name}">
                  ${FILTER[filter.name]}
                  <span class="main-navigation__item-count">${filter.count}</span>
              </a>`;
  }).join(' ');

const createFiltersTemplate = (filters) => {
  const filtersBlock = getNavigationItem(filters);

  return `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersBlock}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
