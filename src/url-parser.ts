/* ------------------------------------------------------------------ */
/*  URL解析ユーティリティ                                             */
/* ------------------------------------------------------------------ */

import { FigmaUrlParseError } from './errors.js';

function safeDecodeURIComponent(str: string): string {
  try {
    // 基本的な長さ制限（通常のnode-idは20文字程度）
    if (str.length > 200) {
      throw new Error("Node ID too long");
    }
    
    // 基本的な文字チェック（Figmaで使われる文字のみ許可）
    if (!/^[a-zA-Z0-9:%-]+$/.test(str)) {
      throw new Error("Invalid characters in node ID");
    }
    
    const decoded = decodeURIComponent(str);
    
    // デコード後の基本チェック
    if (decoded.length > 100 || !/^[a-zA-Z0-9:-]+$/.test(decoded)) {
      throw new Error("Invalid decoded node ID");
    }
    
    return decoded;
  } catch (error) {
    throw new FigmaUrlParseError(`Invalid node ID format`);
  }
}

export function parseFigmaUrl(figmaUrl: string): { fileKey: string; nodeId?: string } {
  // 基本的な長さ制限
  if (figmaUrl.length > 1000) {
    throw new FigmaUrlParseError("URL too long");
  }

  // より厳密なURL検証
  try {
    const url = new URL(figmaUrl);
    // Figma公式ドメインのみ許可
    if (!['figma.com', 'www.figma.com'].includes(url.hostname)) {
      throw new FigmaUrlParseError(figmaUrl);
    }
    // HTTPS推奨（HTTPも一応許可）
    if (!['https:', 'http:'].includes(url.protocol)) {
      throw new FigmaUrlParseError(figmaUrl);
    }
  } catch {
    throw new FigmaUrlParseError(figmaUrl);
  }

  // パターン: https://www.figma.com/file/<FILEKEY>/…?node-id=<NODEID>
  const fileMatch = figmaUrl.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]{15,25})\//);
  if (!fileMatch) throw new FigmaUrlParseError(figmaUrl);
  const fileKey = fileMatch[1];

  // 安全なnode-id解析
  const nodeMatch = figmaUrl.match(/[?&]node-id=([^&]+)/);
  const nodeId = nodeMatch?.[1] ? safeDecodeURIComponent(nodeMatch[1]) : undefined;
  
  return { fileKey, nodeId };
}
