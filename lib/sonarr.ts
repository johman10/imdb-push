import fetch from 'node-fetch';
import path from 'path';

export default class Sonarr {
  private baseUri: string

  private apiKey: string

  public constructor(baseUri?: string, apiKey?: string) {
    if (!baseUri) throw new Error('SONARR_URI is required');
    if (!apiKey) throw new Error('SONARR_API_KEY is required');

    this.baseUri = baseUri;
    this.apiKey = apiKey;
  }

  private get baseUrl(): string {
    return `${this.baseUri}/api`;
  }

  private series(): Promise<SonarrSeries[]> {
    const url = `${this.baseUrl}/series?apikey=${this.apiKey}`;
    return fetch(url).then(response => response.json());
  }

  public searchByTvdbId(tvdbId: number): Promise<SonarrSeries> {
    return this.series().then((exisitingSeries) => {
      const existingSerie = exisitingSeries.find(series => series.tvdbId === tvdbId);
      if (existingSerie) return existingSerie;

      const url = `${this.baseUrl}/series/lookup?apikey=${this.apiKey}&term=tvdb:${tvdbId}`;
      return fetch(url)
        .then(response => response.json())
        .then(response => response[0]);
    });
  }

  private rootFolder(): Promise<string> {
    const url = `${this.baseUrl}/rootfolder?apikey=${this.apiKey}`;
    return fetch(url)
      .then(response => response.json())
      .then(response => response[0].path);
  }

  private findProfileId(profileName: string): Promise<number> {
    const url = `${this.baseUrl}/profile?apikey=${this.apiKey}`;
    return fetch(url)
      .then(response => response.json())
      .then(profiles => (
        profiles.find((profile: SonarrProfile) => profile.name === profileName)
      ))
      .then((profile) => {
        if (!profile) throw new Error('The SONARR_PROFILE env variable is not setup correctly');
        return profile.id;
      });
  }

  private folderName(sonarrSeries: SonarrSeries): string {
    if (sonarrSeries.title.includes(`(${sonarrSeries.year})`)) return sonarrSeries.title;
    return `${sonarrSeries.title} (${sonarrSeries.year})`;
  }

  public addSeries(sonarrSeries: SonarrSeries, { profileName }: { profileName: string }): Promise<SonarrAddResponse> {
    if (sonarrSeries.id) return Promise.reject(new Error('alreadyExists'));

    const seasons = sonarrSeries.seasons.map((season: SonarrSeason): SonarrSeason => ({
      seasonNumber: season.seasonNumber,
      // monitored: season.seasonNumber === 1,
      monitored: false,
    }));
    return Promise.all([this.findProfileId(profileName), this.rootFolder()])
      .then(([profileId, rootFolderPath]) => {
        const body = JSON.stringify({
          title: sonarrSeries.title,
          tvdbId: sonarrSeries.tvdbId,
          qualityProfileId: profileId,
          titleSlug: sonarrSeries.titleSlug,
          seasonFolder: true,
          images: sonarrSeries.images,
          path: path.join(rootFolderPath, this.folderName(sonarrSeries)),
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
        });
      })
      .then(response => response.json());
  }
}
