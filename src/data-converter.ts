/* ------------------------------------------------------------------ */
/*  データ変換ユーティリティ                                          */
/* ------------------------------------------------------------------ */

import { FigmaColor, FigmaNode, SimplifiedComponent } from './types.js';

export function rgbaToHex({ r, g, b, a }: FigmaColor): string {
  const to255 = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  
  const hexColor = "#" + [to255(r), to255(g), to255(b)].map(toHex).join("");
  
  // アルファ値が1未満の場合のみ透明度を追加
  return a < 1 ? hexColor + toHex(to255(a)) : hexColor;
}

// 無駄な情報をフィルタリングするためのヘルパー関数
function shouldIncludeNode(node: FigmaNode): boolean {
  // VECTOR要素で非常に小さいものは除外
  if (node.type === 'VECTOR' && node.absoluteBoundingBox) {
    const { width, height } = node.absoluteBoundingBox;
    if (width < 1 && height < 1) return false;
  }
  
  // 空のグループは除外
  if ((node.type === 'GROUP' || node.type === 'FRAME') && 
      (!node.children || node.children.length === 0)) {
    return false;
  }
  
  return true;
}

function hasNonZeroPadding(padding: { left: number; right: number; top: number; bottom: number; }): boolean {
  return padding.left !== 0 || padding.right !== 0 || padding.top !== 0 || padding.bottom !== 0;
}

export function simplifyNode(n: FigmaNode, options: { includeVectors?: boolean; includeEmptyGroups?: boolean } = {}): SimplifiedComponent | null {
  // フィルタリング: 無駄なノードをスキップ
  if (!shouldIncludeNode(n) && !options.includeVectors && !options.includeEmptyGroups) {
    return null;
  }
  
  const size = n.absoluteBoundingBox ?? { width: 0, height: 0 };
  const solidFill = n.fills?.find((f) => f.type === "SOLID");
  const style = n.style ?? {};
  
  // 子要素の処理（再帰的に処理、nullを除外）
  const children = n.children
    ?.map(child => simplifyNode(child, options))
    .filter((child): child is SimplifiedComponent => child !== null);
  
  const childrenCount = children?.length || 0;
  
  // パディング情報の最適化
  const padding = {
    left: n.paddingLeft ?? 0,
    right: n.paddingRight ?? 0,
    top: n.paddingTop ?? 0,
    bottom: n.paddingBottom ?? 0,
  };
  
  const result: SimplifiedComponent = {
    id: n.id,
    name: n.name,
    type: n.type,
    width: Math.round(size.width),
    height: Math.round(size.height),
  };
  
  // オプション情報は存在する場合のみ追加
  if (solidFill?.color) {
    result.backgroundColor = rgbaToHex(solidFill.color);
  }
  
  if (n.cornerRadius && n.cornerRadius > 0) {
    result.cornerRadius = n.cornerRadius;
  }
  
  // ゼロでないパディングのみ含める
  if (hasNonZeroPadding(padding)) {
    result.padding = padding;
  }
  
  // テキスト情報
  if (n.characters) {
    result.text = {
      content: n.characters,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeightPx,
      textColor: solidFill?.color ? rgbaToHex(solidFill.color) : undefined,
    };
  }
  
  // 子要素情報
  if (children && children.length > 0) {
    result.children = children;
    result.childrenCount = childrenCount;
  }
  
  return result;
}
