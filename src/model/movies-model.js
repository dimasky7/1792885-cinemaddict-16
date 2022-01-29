import AbstractObservable from '../abstract-observable';
import { getFilters } from '../mock/filters';

export default class MoviesModel extends AbstractObservable {
    #movies = [];
    #filters = [];

    set movies(movies) {
      this.#movies = [...movies];
    }

    get movies() {
      return this.#movies;
    }

    get filters() {
      return getFilters(this.#movies);
    }

    updateMovie = (updateType, update) => {
      const index = this.#movies.findIndex((movie) => movie.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t update unexisting movie');
      }

      this.#movies = [
        ...this.#movies.slice(0, index),
        update,
        ...this.#movies.slice(index + 1),
      ];

      this._notify(updateType, update);
    }
}

