import fetch from 'node-fetch';

export default class Couchpotato {
  private baseUri: string;

  private apiKey: string;

  public constructor(baseUri?: string, apiKey?: string) {
    if (!baseUri) throw new Error('COUCHPOTATO_URI is required');
    if (!apiKey) throw new Error('COUCHPOTATO_API_KEY is required');

    this.baseUri = baseUri;
    this.apiKey = apiKey;
  }

  private get baseUrl(): string {
    return `${this.baseUri}/api/${this.apiKey}`;
  }

  public addMovieByImdbId(imdbId: string): Promise<CouchpotatoAddResponse> {
    const url = `${this.baseUrl}/movie.add?identifier=${imdbId}`;
    return fetch(url).then((response): Promise<CouchpotatoAddResponse> => response.json());
  }
}
