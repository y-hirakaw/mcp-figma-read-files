# mcp-figma-read-files

FigmaのコンポーネントデータをMCP (Model Context Protocol) 経由で取得し、AIが理解しやすい形式に変換するサーバーです。

## 機能

- Figma URLまたはfileKey/nodeIdを指定してコンポーネントデータを取得
- レイアウト情報（サイズ、パディング、色など）をJSON形式で出力
- AI向けに最適化されたデータ形式

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. ビルド:
```bash
npm run build
```

3. Figma Personal Access Tokenを取得

## 使用方法

```json
"mcp-figma-read-files": {
    "command": "node",
    "args": ["path/to/mcp-figma-read-files/build/index.js"],
    "env": {
        "FIGMA_API_TOKEN": "{Get figma token.}"
    }
}
```