declare interface CouchpotatoMovie {
  status: string;
  info: {
    rating: {
      imdb: [number];
    };
    genres: [string];
    tmdb_id: number;
    plot: string;
    tagline: string;
    original_title: string;
    actor_roles: object;
    via_imdb: true;
    mpaa: null;
    via_tmdb: true;
    directors: [string];
    titles: [string];
    imdb: string;
    year: number;
    images: {
      disc_art: [string];
      poster: [string];
      extra_thumbs: [string];
      poster_original: [string];
      landscape: [string];
      actors: object;
      backdrop_original: [string];
      clear_art: [string];
      logo: [string];
      banner: [string];
      backdrop: [string];
      extra_fanart: [string];
    };
    actors: [string];
    writers: [string];
    runtime: 128;
    type: string;
    released: string;
  };
  _t: string;
  releases: [string];
  title: string;
  _rev: string;
  profile_id: string;
  _id: string;
  tags: [string];
  last_edit: number;
  category_id: null;
  type: string;
  files: {
    image_poster: [string];
  };
  identifiers: {
    imdb: string;
  };
}

declare interface CouchpotatoAddResponse {
  success: boolean;
  movie: CouchpotatoMovie;
}
