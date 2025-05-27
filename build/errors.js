/* ------------------------------------------------------------------ */
/*  エラークラス                                                      */
/* ------------------------------------------------------------------ */
export class FigmaApiError extends Error {
    status;
    body;
    constructor(status, body, message) {
        super(message || `Figma API error! Status: ${status}`);
        this.status = status;
        this.body = body;
        this.name = 'FigmaApiError';
    }
}
export class FigmaUrlParseError extends Error {
    constructor(url) {
        super(`Invalid Figma URL format: ${url}`);
        this.name = 'FigmaUrlParseError';
    }
}
