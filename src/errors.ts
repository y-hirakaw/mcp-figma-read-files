/* ------------------------------------------------------------------ */
/*  エラークラス                                                      */
/* ------------------------------------------------------------------ */

export class FigmaApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string
  ) {
    super(message || `Figma API error! Status: ${status}`);
    this.name = 'FigmaApiError';
  }
}

export class FigmaUrlParseError extends Error {
  constructor(url: string) {
    super(`Invalid Figma URL format: ${url}`);
    this.name = 'FigmaUrlParseError';
  }
}
