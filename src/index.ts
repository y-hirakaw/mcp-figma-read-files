#!/usr/bin/env node
/* ------------------------------------------------------------------ */
/*  mcp-figma-read-files                                              */
/*  Fetch simplified component data from Figma and expose via MCP     */
/* ------------------------------------------------------------------ */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getComponentData } from './figma-service.js';

/* ------------------------------------------------------------------ */
/*  MCP Server                                                        */
/* ------------------------------------------------------------------ */
const server = new McpServer({
  name: "mcp-figma-read-files",
  version: "0.1.0",
  capabilities: { resources: {}, tools: {} },
});

/* ------------------------------------------------------------------ */
/*  Tools                                                             */
/* ------------------------------------------------------------------ */

/**
 * 1. get_component_data
 *    - 任意の Figma URL または fileKey / nodeIds を受け取り、
 *      簡易 JSON を返す
 */
server.tool(
  "get_component_data",
  "Fetch simplified layout/style data from a Figma component",
  {
    // 入力検証を強化
    figma_url: z.string().url().optional()
                .describe("Figma component URL (file or design link)"),
    file_key: z.string().min(1).optional()
               .describe("Figma file key (required if figma_url not provided)"),
    node_ids: z.union([z.array(z.string().min(1)), z.string().min(1)]).optional()
               .describe("Single node ID or array of IDs"),
    include_children: z.boolean().optional().default(true)
               .describe("Include children components in the response"),
  },
  async ({ figma_url, file_key, node_ids, include_children }) => {
    try {
      const simplified = await getComponentData({ figma_url, file_key, node_ids, include_children });

      return {
        content: [
          {
            type: "text",
            text: "```json\n" + JSON.stringify(simplified, null, 2) + "\n```",
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `エラーが発生しました: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */
async function main() {
  // 環境変数の早期チェック
  if (!process.env.FIGMA_API_TOKEN) {
    console.error("エラー: FIGMA_API_TOKEN 環境変数が設定されていません。");
    console.error("Figma Personal Access Token を取得して設定してください。");
    console.error("詳細: https://www.figma.com/developers/api#access-tokens");
    process.exit(1);
  }

  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("✅ Figma MCP Server running on stdio");
  } catch (error) {
    console.error("❌ サーバー起動に失敗しました:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Fatal error in main():", err);
  process.exit(1);
});
