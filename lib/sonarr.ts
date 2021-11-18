import fetch from 'node-fetch';

export default class Sonarr {
  private baseUri: string;

  private apiKey: string;

  private rootFolderPath: string;

  private profileId: number;

  public constructor(baseUri?: string, apiKey?: string, rootFolderPath?: string, profileId?: string) {
    if (!baseUri) throw new Error('SONARR_URI is required');
    if (!apiKey) throw new Error('SONARR_API_KEY is required');
    if (!rootFolderPath) throw new Error('SONARR_ROOT_FOLDER_PATH is required');
    if (!profileId) throw new Error('SONARR_PROFILE_ID is required');

    this.baseUri = baseUri;
    this.apiKey = apiKey;
    this.rootFolderPath = rootFolderPath;
    this.profileId = parseInt(profileId, 10);
  }

  private get baseUrl(): string {
    return `${this.baseUri}/api`;
  }

  private series(): Promise<SonarrSeries[]> {
    const url = `${this.baseUrl}/series?apikey=${this.apiKey}`;
    return fetch(url).then((response): Promise<SonarrSeries[]> => response.json());
  }

  public searchByTvdbId(tvdbId: number): Promise<SonarrSeries> {
    return this.series().then((exisitingSeries): Promise<SonarrSeries> | SonarrSeries => {
      const existingSerie = exisitingSeries.find((series): boolean => series.tvdbId === tvdbId);
      if (existingSerie) return existingSerie;

      const url = `${this.baseUrl}/series/lookup?apikey=${this.apiKey}&term=tvdb:${tvdbId}`;
      return fetch(url)
        .then((response): Promise<SonarrSeries[]> => response.json())
        .then((response): SonarrSeries => response[0]);
    });
  }

  public addSeries(sonarrSeries: SonarrSeries): Promise<SonarrAddResponse> {
    if (sonarrSeries.id) return Promise.reject(new Error('alreadyExists'));

    const seasons = sonarrSeries.seasons.map(
      (season: SonarrSeason): SonarrSeason => ({
        seasonNumber: season.seasonNumber,
        monitored: season.seasonNumber === 1,
      }),
    );

    const body = JSON.stringify({
      title: sonarrSeries.title,
      tvdbId: sonarrSeries.tvdbId,
      qualityProfileId: this.profileId,
      titleSlug: sonarrSeries.titleSlug,
      seasonFolder: true,
      images: sonarrSeries.images,
      rootFolderPath: this.rootFolderPath,
      addOptions: {
        ignoreEpisodesWithFiles: true,
        ignoreEpisodesWithoutFiles: false,
        searchForMissingEpisodes: true,
      },
      seasons,
    });
    const url = `${this.baseUrl}/series?apikey=${this.apiKey}`;

    return fetch(url, {
      method: 'POST',
      body,
    }).then((response): Promise<SonarrAddResponse> => response.json());
  }
}
