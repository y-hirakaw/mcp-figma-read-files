/* ------------------------------------------------------------------ */
/*  Figma API クライアント                                            */
/* ------------------------------------------------------------------ */

import { RequestOptions } from './types.js';
import { FigmaApiError } from './errors.js';

const FIGMA_API_BASE = "https://api.figma.com/v1";
const USER_AGENT = "mcp-figma-read-files/0.1.0";

async function parseResponseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") ?? "";
  try {
    return ct.includes("application/json") ? res.json() : res.text();
  } catch (error) {
    throw new Error(`Failed to parse response body: ${error}`);
  }
}

function createFigmaError(status: number, body: unknown): FigmaApiError {
  const msg = typeof body === "string" ? body : JSON.stringify(body);
  return new FigmaApiError(status, body, `Figma API error! Status: ${status}. Message: ${msg}`);
}

export async function figmaRequest<T>(url: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
    "X-Figma-Token": process.env.FIGMA_API_TOKEN ?? "",
    ...opts.headers,
  };
  if (!headers["X-Figma-Token"])
    throw new Error("FIGMA_API_TOKEN が未設定です。");

  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const body = await parseResponseBody(res);
  if (!res.ok) throw createFigmaError(res.status, body);
  return body as T;
}

export { FIGMA_API_BASE };
