/* ------------------------------------------------------------------ */
/*  Figmaコンポーネントデータ取得サービス                             */
/* ------------------------------------------------------------------ */
import { figmaRequest, FIGMA_API_BASE } from './figma-client.js';
import { parseFigmaUrl } from './url-parser.js';
import { simplifyNode } from './data-converter.js';
export async function getComponentData(params) {
    const { figma_url, file_key, node_ids } = params;
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
    const url = `${FIGMA_API_BASE}/files/${fileKey}/nodes?ids=${encodeURIComponent(idsParam)}`;
    const data = await figmaRequest(url);
    if (!data.nodes || Object.keys(data.nodes).length === 0) {
        throw new Error("指定されたノードが見つかりませんでした");
    }
    /* ----- 整形＆レスポンス ----- */
    const simplified = Object.values(data.nodes)
        .map(({ document }) => simplifyNode(document))
        .filter(Boolean); // null/undefinedを除外
    return simplified;
}
