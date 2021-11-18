import fetch from 'node-fetch';

export default class Radarr {
  private baseUri: string;

  private apiKey: string;

  private rootFolderPath: string;

  private profileId: number;

  public constructor(baseUri?: string, apiKey?: string, rootFolderPath?: string, profileId?: string) {
    if (!baseUri) throw new Error('RADARR_URI is required');
    if (!apiKey) throw new Error('RADARR_API_KEY is required');
    if (!rootFolderPath) throw new Error('RADARR_ROOT_FOLDER_PATH is required');
    if (!profileId) throw new Error('RADARR_PROFILE_ID is required');

    this.baseUri = baseUri;
    this.apiKey = apiKey;
    this.rootFolderPath = rootFolderPath;
    this.profileId = parseInt(profileId, 10);
  }

  private get baseUrl(): string {
    return `${this.baseUri}/api`;
  }

  private movies(): Promise<RadarrMovie[]> {
    const url = `${this.baseUrl}/movie?apikey=${this.apiKey}`;
    return fetch(url).then((response): Promise<RadarrMovie[]> => response.json());
  }

  public searchByImdbId(imdbId: string): Promise<RadarrMovie> {
    return this.movies().then((exisitingMovies): Promise<RadarrMovie> | RadarrMovie => {
      const existingMovie = exisitingMovies.find((movies): boolean => movies.imdbId === imdbId);
      if (existingMovie) return Promise.resolve(existingMovie);

      const url = `${this.baseUrl}/movie/lookup/imdb?apikey=${this.apiKey}&imdbId=${imdbId}`;
      return fetch(url).then((response): Promise<RadarrMovie> => response.json());
    });
  }

  public addMovie(radarrMovie: RadarrMovie): Promise<RadarrAddResponse> {
    if (radarrMovie.id) return Promise.reject(new Error('alreadyExists'));

    const body = JSON.stringify({
      title: radarrMovie.title,
      tmdbId: radarrMovie.tmdbId,
      qualityProfileId: this.profileId,
      titleSlug: radarrMovie.titleSlug,
      images: radarrMovie.images,
      rootFolderPath: this.rootFolderPath,
      year: radarrMovie.year,
      monitored: true,
      addOptions: {
        searchForMovie: true,
      },
    });
    const url = `${this.baseUrl}/movie?apikey=${this.apiKey}`;

    return fetch(url, {
      method: 'POST',
      body,
    }).then((response): Promise<RadarrAddResponse> => response.json());
  }
}
