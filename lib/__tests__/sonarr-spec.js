import fetch, { mockResponseOnce } from 'node-fetch';
import Sonarr from '../sonarr';
import { searchByTvdbId } from '../__mockData__/sonarr.mock';

const BASE_URI = 'https://test.com';
const API_KEY = 'some-key';
const EXISTING_TVDB_ID = searchByTvdbId[0].tvdbId;
const NEW_TVDB_ID = 123456;
const ROOT_FOLDER_PATH = '/etc/something';
const PROFILE_ID = '0';

describe('Sonarr', () => {
  let classInstance;

  beforeEach(() => {
    classInstance = new Sonarr(BASE_URI, API_KEY, ROOT_FOLDER_PATH, PROFILE_ID);
  });

  describe('searchByTvdbId', () => {
    it('returns an exising series if it already exists', () => {
      mockResponseOnce(JSON.stringify(searchByTvdbId));

      return classInstance.searchByTvdbId(EXISTING_TVDB_ID).then((result) => {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`${BASE_URI}/api/series?apikey=${API_KEY}`);
        expect(result.id).toBe(searchByTvdbId.id);
      });
    });

    it('creates a new series if the series can not be found', () => {
      mockResponseOnce(JSON.stringify([]));
      mockResponseOnce(JSON.stringify(searchByTvdbId));

      return classInstance.searchByTvdbId(NEW_TVDB_ID).then((result) => {
        expect(fetch).toHaveBeenNthCalledWith(1, `${BASE_URI}/api/series?apikey=${API_KEY}`);
        expect(fetch).toHaveBeenNthCalledWith(
          2,
          `${BASE_URI}/api/series/lookup?apikey=${API_KEY}&term=tvdb:${NEW_TVDB_ID}`,
        );
        expect(result.id).toBe(searchByTvdbId.id);
      });
    });
  });

  describe('addSeries', () => {
    it.skip('adds the series correctly', () => {});
  });
});
