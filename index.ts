import PushBullet from 'pushbullet';
import Omdb from 'omdbapi';

import { findOrCreateDevice, pushToDevice } from './lib/pushbullet';
import Radarr from './lib/radarr';
import Sonarr from './lib/sonarr';
import findByTmdbId from './lib/tvdb';

const pusher = new PushBullet(process.env.PUSHBULLET_API_KEY);
const omdb = new Omdb(process.env.OMDB_API_KEY);
const radarr = new Radarr(
  process.env.RADARR_URI,
  process.env.RADARR_API_KEY,
  process.env.RADARR_ROOT_FOLDER_PATH,
  process.env.RADARR_PROFILE_ID,
);
const sonarr = new Sonarr(
  process.env.SONARR_URI,
  process.env.SONARR_API_KEY,
  process.env.SONARR_ROOT_FOLDER_PATH,
  process.env.SONARR_PROFILE_ID,
);

console.log('started');

const NICKNAME = 'imdb-push';
let lastChecked = Date.now() / 1000;
let appDevice: Device;

function isPushCandidate(push: Push): boolean {
  const isCorrectDevice = push.target_device_iden === appDevice.iden;
  const isLink = push.type === 'link';
  const isImdbTitle = (push.url || '').startsWith('https://www.imdb.com/title/tt');
  return isCorrectDevice && isLink && isImdbTitle;
}

function getOmdbData(push: Push): Promise<GetResponse> {
  const imdbId = (push.url.match(/tt\d+/) || [])[0];
  if (!imdbId) return Promise.reject(new Error('notFound'));
  return omdb.get({ id: imdbId });
}

function handleSeriesPush(omdbRecord: GetResponse): Promise<SonarrAddResponse> {
  return findByTmdbId(omdbRecord.imdbid)
    .then((tvdbSeries): Promise<SonarrSeries> => (
      sonarr.searchByTvdbId(tvdbSeries.id)
    ))
    .then((sonarrSeries): Promise<SonarrAddResponse> => (
      sonarr.addSeries(sonarrSeries)
    ));
}

function handleMoviesPush(omdbRecord: GetResponse): Promise<RadarrAddResponse> {
  return radarr.searchByImdbId(omdbRecord.imdbid)
    .then((radarrMovie): Promise<RadarrAddResponse> => (
      radarr.addMovie(radarrMovie)
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
    case 'notFound':
      pushToDevice(
        pusher,
        push.source_device_iden,
        'This movie or series could not be found',
        "It seems like OMDB doesn't know about this movie (yet), try again at another time.",
      );
      break;
    default:
      pushToDevice(
        pusher,
        push.source_device_iden,
        'Something went wrong.',
        'Please try again, if the problem persists check if Sonarr and Radarr are running.',
      );
  }
}

function handlePush(push: Push): Promise<void> {
  return getOmdbData(push)
    .then((omdbRecord: GetResponse): Promise<RadarrAddResponse | SonarrAddResponse> => {
      switch (omdbRecord.type) {
        case 'movie':
          return handleMoviesPush(omdbRecord);
        case 'series':
          return handleSeriesPush(omdbRecord);
        default:
          return Promise.reject(new Error('invalidShare'));
      }
    })
    .then((addedResponse: RadarrAddResponse | SonarrAddResponse): void => {
      const { title } = addedResponse;
      if (!title) throw new Error('somethingWentWrong');
      const service = (addedResponse as SonarrAddResponse).seasons ? 'Sonarr' : 'Radarr';
      const message = service === 'Sonarr' ? 'The first season is monitored by default' : '';
      pushToDevice(
        pusher,
        push.source_device_iden,
        `${title} was successfully added to ${service}`,
        message,
      );
    })
    .catch(handleError.bind(null, push));
}

function handleTickle(type: string): Promise<void> {
  if (type !== 'push') return Promise.resolve();

  const options = {
    limit: 10,
    modified_after: lastChecked, // eslint-disable-line @typescript-eslint/camelcase
  };

  return pusher.history(options)
    .then((history): void => {
      lastChecked = Date.now() / 1000;
      history.pushes.forEach((push: Push): void => {
        if (!isPushCandidate(push)) return;
        handlePush(push);
      });
    });
}

findOrCreateDevice(pusher, NICKNAME)
  .then((appDeviceResponse): void => {
    appDevice = appDeviceResponse;
    const stream = pusher.stream();
    stream.connect();

    stream.on('tickle', handleTickle);
  });
