import { readFileSync } from 'fs';
import * as path from 'path';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { config } from '../server.config.js';
import { ApiEndpoint } from './types.js';
import { parseOpenApiDocument } from './utils.js';

// APIエンドポイント情報を格納する配列
const apiEndpoints: ApiEndpoint[] = [];

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
          const fileContent = readFileSync(openApiFilePath, 'utf-8');
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
              description: operation.summary || operation.description || '',
            });
          }
        }
      } catch (error) {
        console.error(`${name} の取得に失敗しました:`, error);
      }
    }
  } catch (error) {
    console.error('サービス情報の処理中にエラーが発生しました:', error);
  }
}

// MCPサーバーの初期化
const server = new McpServer({
  name: config.name,
  version: config.version
});

// ツールの一覧を提供
server.tool('suggest_api',
  { purpose: z.string().describe('APIエンドポイントを使用したい用途や目的の説明。') },
  async ({ purpose }) => {
    const suggestions = apiEndpoints.filter(endpoint => endpoint.description.includes(purpose));

    if (suggestions.length === 0) {
      throw new Error('該当するAPIエンドポイントが見つかりませんでした。');
    }
    return { content: [{ type: 'text', text: JSON.stringify(suggestions) }] };
  }
);

// メイン関数
async function main() {
  const transport = new StdioServerTransport();
  await fetchApiEndpoints();
  await server.connect(transport);
}

// メイン関数の実行
main().catch(error => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
