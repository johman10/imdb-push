import fetch from 'node-fetch';
import parser from 'xml2json';

const xmlParsingOptions = {
  object: true,
  coerce: true,
  arrayNotation: false,
};

export default function findByTmdbId(tmdbId: string): Promise<TvdbSeries> {
  return fetch(`https://thetvdb.com/api/GetSeriesByRemoteID.php?imdbid=${tmdbId}`)
    .then(response => response.text())
    .then(result => parser.toJson(result, xmlParsingOptions).Data.Series);
}
