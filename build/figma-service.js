/* ------------------------------------------------------------------ */
/*  Figmaコンポーネントデータ取得サービス                             */
/* ------------------------------------------------------------------ */
import { figmaRequest, FIGMA_API_BASE } from './figma-client.js';
import { parseFigmaUrl } from './url-parser.js';
import { simplifyNode } from './data-converter.js';
export async function getComponentData(params) {
    const { figma_url, file_key, node_ids, include_children = true } = params;
    /* ----- 入力を整理 ----- */
    let fileKey = file_key;
    let nodeIds = [];
    if (figma_url) {
        const parsed = parseFigmaUrl(figma_url);
        fileKey = parsed.fileKey;
        if (parsed.nodeId)
            nodeIds.push(parsed.nodeId);
    }
    if (!fileKey) {
        throw new Error("file_key または figma_url のいずれかが必要です");
    }
    if (node_ids) {
        const idsArray = Array.isArray(node_ids) ? node_ids : [node_ids];
        nodeIds = nodeIds.concat(idsArray);
    }
    if (nodeIds.length === 0) {
        throw new Error("node_ids が指定されていません（figma_url からも抽出できませんでした）");
    }
    /* ----- Figma API 呼び出し ----- */
    const idsParam = nodeIds.join(",");
    const depth = include_children ? 10 : 1; // 子要素を含める場合は深い階層まで取得
    const endpoint = `${FIGMA_API_BASE}/files/${fileKey}/nodes?ids=${idsParam}${depth ? `&depth=${depth}` : ""}`;
    // 型を指定せずに生のJSONを取得
    const rawData = await figmaRequest(endpoint);
    // 正しい構造でデータを処理
    if (!rawData.nodes || Object.keys(rawData.nodes).length === 0) {
        throw new Error("指定されたノードが見つかりませんでした");
    }
    /* ----- 整形＆レスポンス ----- */
    const simplified = Object.values(rawData.nodes)
        .map((nodeWrapper) => simplifyNode(nodeWrapper.document))
        .filter(Boolean); // null/undefinedを除外
    return simplified;
}
