import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';

const getStringOfElements = (elements) => (elements.join(', '));

const getGenres = (genres) => (
  genres.map((genre) => (`<span class="film-details__genre">${genre}</span>`)).join('')
);

const getComments = (comments) => comments.map((comment) => {
  const {text, emoji, author, date} = comment;
  const formattedDate = dayjs(date).format('YYYY/MM/DD HH:mm');

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
}).join(' ');

const getInfo = (movie) => {
  const {
    actors,
    country,
    description,
    director,
    genres,
    name,
    originalName,
    rating,
    release,
    runtime,
    writers,
  } = movie;
  const formattedRelease = release.format('DD MMMM YYYY');
  const formattedRuntime = runtime.format('H[h] m[m]');
  const formattedActors = getStringOfElements(actors);
  const formattedWriters = getStringOfElements(writers);
  const genresTitle = genres.length === 1 ? 'Genre' : 'Genres';
  const genresMarkup = getGenres(genres);

  return `<div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${name}</h3>
          <p class="film-details__title-original">Original: ${originalName}</p>
        </div>
        <div class="film-details__rating">
          <p class="film-details__total-rating">${rating}</p>
        </div>
      </div>
      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${formattedWriters}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${formattedActors}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${formattedRelease}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${formattedRuntime}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${country}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">${genresTitle}</td>
          <td class="film-details__cell">
            ${genresMarkup}
          </td>
        </tr>
      </table>
      <p class="film-details__film-description">${description}</p>
    </div>`;
};

const createCardDetailPopup = (movie, allComments) => {
  const {
    ageRating,
    poster,
    commentsIds,
    isWatched,
    isFavorite,
    inWatchlist,
  } = movie;
  const infoBlock = getInfo(movie);
  const currentMovieComments = allComments.filter((comment) => (commentsIds.includes(comment.id)));
  const commentsCount = currentMovieComments.length;
  const commentsBlock = commentsCount > 0
    ? getComments(currentMovieComments)
    : '';

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
              <p class="film-details__age">${ageRating}</p>
            </div>
            ${infoBlock}
          </div>
          <section class="film-details__controls">
            <button
              type="button"
              class="
                film-details__control-button
                film-details__control-button--watchlist
                ${inWatchlist ? 'film-details__control-button--active' : ''}"
                id="watchlist"
                name="watchlist"
            >Add to watchlist</button>
            <button
              type="button"
              class="
                film-details__control-button
                film-details__control-button--watched
                ${isWatched ? 'film-details__control-button--active' : ''}"
                id="watched"
                name="watched"
            >Already watched</button>
            <button
              type="button"
              class="
                film-details__control-button
                film-details__control-button--favorite
                ${isFavorite ? 'film-details__control-button--active' : ''}"
                id="favorite"
                name="favorite"
            >Add to favorites</button>
          </section>
        </div>
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">
              Comments <span class="film-details__comments-count">${commentsCount}</span>
            </h3>
            <ul class="film-details__comments-list">
              ${commentsBlock}
            </ul>
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;
};

export default class PopupView extends AbstractView {
  #movie = null;
  #allComments = null;

  constructor(movie, allComments) {
    super();
    this.#movie = movie;
    this.#allComments = allComments;
  }

  get template() {
    return createCardDetailPopup(this.#movie, this.#allComments);
  }

  setClosePopupHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupHandler);
    document.addEventListener('keydown', this.#closePopupHandlerEsc);
  }

  #closePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopup();
  }

  #closePopupHandlerEsc = (evt) => {
    evt.preventDefault();
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._callback.closePopup();
    }
  }

}
