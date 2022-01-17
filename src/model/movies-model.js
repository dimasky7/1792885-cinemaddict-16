import AbstractObservable from '../abstract-observable';

export default class MoviesModel extends AbstractObservable {
    #movies = [];

    set movies(movies) {
      this.#movies = [...movies];
    }

    get movies() {
      return this.#movies;
    }
}
