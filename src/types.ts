/* ------------------------------------------------------------------ */
/*  型定義                                                            */
/* ------------------------------------------------------------------ */

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaFill {
  type: string;
  color?: FigmaColor;
}

export interface FigmaStyle {
  fontSize?: number;
  fontWeight?: number;
  lineHeightPx?: number;
}

export interface FigmaBoundingBox {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  absoluteBoundingBox?: FigmaBoundingBox;
  fills?: FigmaFill[];
  style?: FigmaStyle;
  characters?: string;
  cornerRadius?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  children?: FigmaNode[];
}

export interface SimplifiedComponent {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  backgroundColor?: string;
  cornerRadius?: number;
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  text?: {
    content: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    textColor?: string;
  };
  children?: SimplifiedComponent[];
  childrenCount?: number;
}

export interface GetFileNodesResponse {
  nodes: Record<string, { document: FigmaNode }>;
  err?: string;
}
