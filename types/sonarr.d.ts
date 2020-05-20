interface SonarrSeason {
  seasonNumber: number;
  monitored: boolean;
}

interface SonarrImage {
  coverType: string;
  url: string;
}

interface SonarrAddResponse {
  title: string;
  seasons: [SonarrSeason];
  path: string;
  qualityProfileId: number;
  seasonFolder: boolean;
  monitored: boolean;
  tvdbId: number;
  tvRageId: number;
  cleanTitle: string;
  imdbId: string;
  titleSlug: string;
  id: number;
}

interface SonarrSeries {
  title: string;
  sortTitle: string;
  seasonCount: number;
  status: string;
  overview: string;
  network: string;
  airTime: string;
  images: [SonarrImage];
  remotePoster: string;
  seasons: [SonarrSeason];
  year: number;
  profileId: number;
  seasonFolder: boolean;
  monitored: boolean;
  useSceneNumbering: boolean;
  runtime: number;
  tvdbId: number;
  tvRageId: number;
  tvMazeId: number;
  firstAired: string;
  seriesType: string;
  cleanTitle: string;
  imdbId: string;
  titleSlug: string;
  certification: string;
  genres: [string];
  tags: [string];
  added: string;
  ratings: {
    votes: number;
    value: number;
  };
  qualityProfileId: number;
  id?: number;
}
