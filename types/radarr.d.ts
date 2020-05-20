interface RadarrImage {
  coverType: string;
  url: string;
}

interface RadarrAddResponse {
  title: string;
  sortTitle: string;
  sizeOnDisk: number;
  status: string;
  images: RadarrImage[];
  downloaded: false;
  year: number;
  hasFile: false;
  path: string;
  profileId: number;
  monitored: true;
  minimumAvailability: string;
  runtime: number;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  genres: string[];
  tags: string[];
  added: string;
  alternativeTitles: string[];
  qualityProfileId: number;
  id: number;
}

interface RadarrMovie {
  title: string;
  sortTitle: string;
  sizeOnDisk: number;
  status: string;
  overview: string;
  inCinemas: string;
  images: RadarrImage[];
  website: string;
  downloaded: false;
  year: number;
  hasFile: false;
  youTubeTrailerId: string;
  studio: string;
  path: string;
  profileId: number;
  monitored: true;
  minimumAvailability: string;
  runtime: number;
  lastInfoSync: string;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  genres: string[];
  tags: [];
  added: string;
  ratings: {
    votes: number;
    value: number;
  };
  alternativeTitles: string[];
  qualityProfileId: number;
  id: number;
}
