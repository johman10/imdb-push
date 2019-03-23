import PushBullet from 'pushbullet';
import Omdb from 'omdbapi';

import { findOrCreateDevice, pushToDevice } from './lib/pushbullet';
import Couchpotato from './lib/couchpotato';
import Sonarr from './lib/sonarr';
import findByTmdbId from './lib/tvdb';

const pusher = new PushBullet(process.env.PUSHBULLET_API_KEY);
const omdb = new Omdb(process.env.OMDB_API_KEY);
const couchpotato = new Couchpotato(process.env.COUCHPOTATO_URI, process.env.COUCHPOTATO_API_KEY);
const sonarr = new Sonarr(process.env.SONARR_URI, process.env.SONARR_API_KEY);

const NICKNAME = 'node-app';
let lastChecked = Date.now() / 1000;
let appDevice: Device;

function isPushCandidate(push: Push): boolean {
  const isCorrectDevice = push.target_device_iden === appDevice.iden;
  const isLink = push.type === 'link';
  const isImdbTitle = (push.url || '').startsWith('https://www.imdb.com/title/tt');
  return isCorrectDevice && isLink && isImdbTitle;
}

function getOmdbData(push: Push): Promise<OmdbRecord> {
  const imdbId = push.url.match(/tt\d+/)[0];
  return omdb.get({ id: imdbId });
}

function handleSeriesPush(push: Push, omdbRecord: OmdbRecord): Promise<SonarrAddResponse> {
  return findByTmdbId(omdbRecord.imdbid)
    .then(tvdbSeries => (
      sonarr.searchByTvdbId(tvdbSeries.id)
    ))
    .then(sonarrSeries => (
      sonarr.addSeries(sonarrSeries, { profileName: 'Any' })
    ));
}

function handleError(push: Push, error: Error): void {
  // eslint-disable-next-line no-console
  console.log('error', error);

  switch (error && error.message) {
    case 'alreadyExists':
      pushToDevice(
        pusher,
        push.source_device_iden,
        'This item already exists.',
        'Nothing was changed.',
      );
      break;
    case 'invalidShare':
      pushToDevice(
        pusher,
        push.source_device_iden,
        'Invalid IMDB ID',
        'It seems like this IMDB item is not a movie, nor a series. For now I only support movies and series.',
      );
      break;
    default:
      pushToDevice(
        pusher,
        push.source_device_iden,
        'Something went wrong.',
        'Please try again, if the problem persists check if Sonarr and Couchpotato are running.',
      );
  }
}

function handlePush(push: Push): Promise<void> {
  return getOmdbData(push)
    .then((omdbRecord: OmdbRecord) => {
      switch (omdbRecord.type) {
        case 'movie':
          return couchpotato.addMovieByImdbId(omdbRecord.imdbid);
        case 'series':
          return handleSeriesPush(push, omdbRecord);
        default:
          return Promise.reject(new Error('invalidShare'));
      }
    })
    .then((addedResponse: CouchpotatoAddResponse | SonarrAddResponse) => {
      const title = addedResponse.title || addedResponse.movie.info.original_title;
      const service = addedResponse.movie ? 'CouchPotato' : 'Sonarr';
      const message = service === 'Sonarr' ? 'The first season is monitored by default' : '';
      return pushToDevice(
        pusher,
        push.source_device_iden,
        `${title} was successfully added to ${service}`,
        message,
      );
    })
    .catch(handleError.bind(this, push));
}

function handleTickle(type: string): Promise<void> {
  if (type !== 'push') return Promise.resolve();

  const options = {
    limit: 10,
    modified_after: lastChecked,
  };

  return pusher.history(options)
    .then((history: { pushes: Push[]}) => {
      lastChecked = Date.now() / 1000;
      history.pushes.forEach((push: Push) => {
        if (!isPushCandidate(push)) return;
        handlePush(push);
      });
    });
}

findOrCreateDevice(pusher, NICKNAME)
  .then((appDeviceResponse) => {
    appDevice = appDeviceResponse;
    const stream = pusher.stream();
    stream.connect();

    stream.on('tickle', handleTickle);
  });
