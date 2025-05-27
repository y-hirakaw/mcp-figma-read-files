/* ------------------------------------------------------------------ */
/*  URL解析ユーティリティ                                             */
/* ------------------------------------------------------------------ */
import { FigmaUrlParseError } from './errors.js';
export function parseFigmaUrl(figmaUrl) {
    // より厳密なURL検証
    try {
        const url = new URL(figmaUrl);
        if (!url.hostname.includes('figma.com')) {
            throw new FigmaUrlParseError(figmaUrl);
        }
    }
    catch {
        throw new FigmaUrlParseError(figmaUrl);
    }
    // パターン: https://www.figma.com/file/<FILEKEY>/…?node-id=<NODEID>
    const fileMatch = figmaUrl.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)\//);
    if (!fileMatch)
        throw new FigmaUrlParseError(figmaUrl);
    const fileKey = fileMatch[1];
    // node-idのパースを改善（URLデコードも対応）
    const nodeMatch = figmaUrl.match(/[?&]node-id=([^&]+)/);
    const nodeId = nodeMatch?.[1] ? decodeURIComponent(nodeMatch[1]) : undefined;
    return { fileKey, nodeId };
}
