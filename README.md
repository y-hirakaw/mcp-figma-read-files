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

3. Figma Personal Access Tokenの設定:
```bash
export FIGMA_API_TOKEN="your_token_here"
```

## 使用方法

```bash
# MCPサーバーとして起動
./build/index.js

# または
npm start
```

## API

### get_component_data

Figmaコンポーネントのデータを取得します。

**パラメータ:**
- `figma_url` (optional): FigmaのURL
- `file_key` (optional): Figmaファイルのキー
- `node_ids` (optional): ノードIDの配列または単一ID

**例:**
```json
{
  "figma_url": "https://www.figma.com/file/abc123/Example?node-id=1%3A2"
}
```