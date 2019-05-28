declare interface TvdbSeries {
  seriesid: number;
  language: string;
  SeriesName: string;
  banner: string;
  Overview: string;
  FirstAired: Date;
  IMDB_ID: string;
  zap2it_id: string;
  id: number;
}

declare interface TvdbResponse {
  Data: {
    Series: TvdbSeries;
  };
}
