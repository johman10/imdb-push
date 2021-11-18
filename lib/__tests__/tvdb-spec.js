import fetch, { mockResponseOnce } from 'node-fetch';
import findByTmdbId from '../tvdb';
import { getSeriesByRemoteID } from '../__mockData__/tvdb.mock';

const BASE_URI = 'https://thetvdb.com/api';
const TMDB_ID = 'tt123456';

describe('tvdb', () => {
  describe('findByTmdbId', () => {
    it('fetches from the right uri', () => {
      mockResponseOnce(getSeriesByRemoteID);

      return findByTmdbId(TMDB_ID).then(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`${BASE_URI}/GetSeriesByRemoteID.php?imdbid=${TMDB_ID}`);
      });
    });

    it('returns the correct HTML structure', () => {
      mockResponseOnce(getSeriesByRemoteID);

      return findByTmdbId(TMDB_ID).then((result) => {
        expect(result.id).toBe(75760);
      });
    });
  });
});
