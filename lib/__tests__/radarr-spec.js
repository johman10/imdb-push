const fetch = require('node-fetch');
const Sonarr = require('../radarr').default;
const { searchByImdbId } = require('../__mockData__/radarr.mock');

const BASE_URI = 'https://test.com';
const API_KEY = 'some-key';
const EXISTING_TVDB_ID = searchByImdbId[0].tmdbId;
const NEW_TVDB_ID = 123456;
const ROOT_FOLDER_PATH = '/etc/something';
const PROFILE_ID = '0';

describe('Radarr', () => {
  let classInstance;

  beforeEach(() => {
    classInstance = new Sonarr(BASE_URI, API_KEY, ROOT_FOLDER_PATH, PROFILE_ID);
  });

  describe('searchByTmdbId', () => {
    it('returns an exising movie if it already exists', () => {
      fetch.mockResponseOnce(JSON.stringify(searchByImdbId));

      return classInstance.searchByImdbId(EXISTING_TVDB_ID).then((result) => {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`${BASE_URI}/api/movies?apikey=${API_KEY}`);
        expect(result.id).toBe(searchByImdbId.id);
      });
    });

    it('creates a new movie if the movie can not be found', () => {
      fetch.mockResponseOnce(JSON.stringify([]));
      fetch.mockResponseOnce(JSON.stringify(searchByImdbId));

      return classInstance.searchByImdbId(NEW_TVDB_ID).then((result) => {
        expect(fetch).toHaveBeenNthCalledWith(1, `${BASE_URI}/api/movies?apikey=${API_KEY}`);
        expect(fetch).toHaveBeenNthCalledWith(2, `${BASE_URI}/api/movies/lookup/imdb?apikey=${API_KEY}&imdbId=${NEW_TVDB_ID}`);
        expect(result.id).toBe(searchByImdbId.id);
      });
    });
  });

  describe('addMovie', () => {
    it.skip('adds the movie correctly', () => {});
  });
});
