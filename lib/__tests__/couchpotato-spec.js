const fetch = require('node-fetch');
const Couchpotato = require('../couchpotato').default;
const { addMovieByImdbId } = require('../__mockData__/couchpotato.mock');

describe('Couchpotato', () => {
  let classInstance;
  const IMDB_ID = addMovieByImdbId.movie.identifiers.imdb;
  const BASE_URI = 'https://test.com';
  const API_KEY = 'some-key';

  beforeEach(() => {
    classInstance = new Couchpotato(BASE_URI, API_KEY);
  });

  describe('addMovieByImdbId', () => {
    it('is able to add a movie by IMDB ID', () => {
      fetch.mockResponseOnce(JSON.stringify(addMovieByImdbId));

      return classInstance.addMovieByImdbId(IMDB_ID).then((output) => {
        const fullUrl = `${BASE_URI}/api/${API_KEY}/movie.add?identifier=${IMDB_ID}`;
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(fullUrl);
        expect(output.movie.identifiers.imdb).toBe(IMDB_ID);
      });
    });
  });
});
