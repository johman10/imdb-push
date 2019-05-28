interface JsonOptions {
  object: boolean;
  reversible?: boolean;
  coerce?: boolean;
  sanitize?: boolean;
  trim?: boolean;
  arrayNotation?: boolean;
}

declare module 'xml2json' {
  function toJson(xml: string, options?: JsonOptions): TvdbResponse
}
