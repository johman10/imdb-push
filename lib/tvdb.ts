import fetch from 'node-fetch';
import xml2json from 'xml2json';

const xmlParsingOptions = {
  object: true,
  coerce: true,
  arrayNotation: false,
};

export default function findByTmdbId(tmdbId: string): Promise<TvdbSeries> {
  return fetch(`https://thetvdb.com/api/GetSeriesByRemoteID.php?imdbid=${tmdbId}`)
    .then(response => response.text())
    .then(result => xml2json.toJson(result, xmlParsingOptions).Data.Series);
}
