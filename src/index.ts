import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { config } from "../server.config";
import { ApiEndpoint } from "./types";
import * as yaml from 'js-yaml';
import * as path from 'path';

// APIエンドポイント情報を格納する配列
let apiEndpoints: ApiEndpoint[] = [];

// OpenAPIドキュメントを取得し、APIエンドポイント情報を解析する関数
async function fetchApiEndpoints() {
  try {
    for (const service of config.services) {
      const { name, openApiUrl, openApiFilePath } = service;
      let data;

      try {
        // URLまたはローカルファイルからOpenAPIスキーマを取得
        if (openApiUrl) {
          // URLからスキーマを取得
          const response = await fetch(openApiUrl);
          if (!response.ok) {
            console.error(
              `${name} のOpenAPIドキュメント取得に失敗しました: ${response.statusText}`
            );
            continue;
          }
          const text = await response.text();
          data = parseOpenApiDocument(text);
        } else if (openApiFilePath) {
          // ローカルファイルからスキーマを読み込み
          const fileContent = readFileSync(openApiFilePath, "utf-8");
          data = parseOpenApiDocument(fileContent, path.extname(openApiFilePath));
        } else {
          console.error(`${name} のOpenAPIソースが指定されていません`);
          continue;
        }

        // スキーマからAPIエンドポイント情報を抽出
        for (const path in data.paths) {
          for (const method in data.paths[path]) {
            const operation = data.paths[path][method];
            apiEndpoints.push({
              service: name,
              path,
              method: method.toUpperCase(),
              description: operation.summary || operation.description || "",
            });
          }
        }
      } catch (error) {
        console.error(`${name} の取得に失敗しました:`, error);
      }
    }
  } catch (error) {
    console.error("サービス情報の処理中にエラーが発生しました:", error);
  }
}

// OpenAPIドキュメントをパースする関数
function parseOpenApiDocument(content: string, fileExtension?: string): any {
  try {
    // 拡張子またはコンテンツに基づいてパース方法を決定
    if (fileExtension === '.yaml' || fileExtension === '.yml' || content.trim().startsWith('openapi:')) {
      return yaml.load(content);
    } else {
      return JSON.parse(content);
    }
  } catch (error) {
    // 最初の方法が失敗した場合、別の方法を試す
    try {
      if (error instanceof SyntaxError) {
        // JSONパースに失敗した場合はYAMLとして試す
        return yaml.load(content);
      } else {
        // YAMLパースに失敗した場合はJSONとして試す
        return JSON.parse(content);
      }
    } catch (fallbackError) {
      console.error('ドキュメントのパースに失敗しました:', fallbackError);
      throw new Error('OpenAPIドキュメントのパースに失敗しました');
    }
  }
}

// MCPサーバーの初期化
const server = new Server(
  {
    name: config.name,
    version: config.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ツールの一覧を提供
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "suggest_api",
      description: "指定された用途に適したAPIエンドポイントをサジェストします。",
      inputSchema: {
        type: "object",
        properties: {
          purpose: {
            type: "string",
            description: "APIエンドポイントを使用したい用途や目的の説明。",
          },
        },
        required: ["purpose"],
      },
    },
  ],
}));

// ツールの呼び出しを処理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "suggest_api") {
    // argumentsの型安全性を確保
    if (!request.params.arguments || typeof request.params.arguments.purpose !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, '無効な引数です');
    }

    const { purpose } = request.params.arguments;
    const suggestions = apiEndpoints.filter((endpoint) =>
      endpoint.description.includes(purpose)
    );

    if (suggestions.length === 0) {
      throw new McpError(
        ErrorCode.InternalError,
        "該当するAPIエンドポイントが見つかりませんでした。"
      );
    }
    return { toolResult: suggestions };
  }
  throw new McpError(ErrorCode.InternalError, "ツールが見つかりません");
});

// メイン関数
async function main() {
  const transport = new StdioServerTransport();
  await fetchApiEndpoints();
  await server.connect(transport);
}

// メイン関数の実行
main().catch((error) => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
