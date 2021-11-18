declare enum ItemTypes {
  series = 'series',
  episode = 'episode',
  movie = 'movie',
}

declare interface SearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: ItemTypes;
  Poster: string;
}

declare interface SearchResponse {
  Search: SearchItem[];
  totalResults: string;
  Response: 'True' | 'False';
}

declare interface Rating {
  Source: string;
  Value: string;
}

declare interface GetResponse {
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  poster: string;
  ratings: Rating[];
  metascore: string;
  imdbrating: string;
  imdbvotes: string;
  imdbid: string;
  type: ItemTypes;
  dvd: string;
  boxoffice: string;
  production: string;
  website: string;
  response: 'True' | 'False';
}

declare module 'omdbapi' {
  enum PlotTypes {
    short,
    full,
  }

  interface SearchOptions {
    search: string;
    type?: ItemTypes;
    year?: string;
    page?: string;
  }

  interface BaseGetOptions {
    season?: number;
    episode?: number;
    type?: ItemTypes;
    plot?: PlotTypes;
    tomatoes?: boolean;
    year?: string;
  }

  interface IdGetOptions extends BaseGetOptions {
    id: string;
    title?: string;
  }

  interface TitleGetOptions extends BaseGetOptions {
    title: string;
    id?: string;
  }

  class Omdbapi {
    public constructor(apiKey?: string);

    public get(options: IdGetOptions | TitleGetOptions): Promise<GetResponse>;

    public search(options: SearchOptions): Promise<SearchResponse>;
  }

  export = Omdbapi;
}
