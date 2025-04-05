import { readFileSync } from 'fs';
import * as path from 'path';
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';

import { config } from '../server.config.js';
import { ApiEndpoint } from './types.js';
import { parseOpenApiDocument } from './utils.js';

// APIエンドポイント情報を格納する配列
const apiEndpoints: ApiEndpoint[] = [];

const schemas: any[] = [];

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

        schemas.push(data);

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

server.tool('suggest_schema',
  { purpose: z.string().describe('OpenAPIスキーマを使用したい用途や目的の説明。') },
  async ({}) => {
    return { content: [{ type: 'text', text: JSON.stringify(schemas) }] };
  }
);

server.resource(
  "openapi",
  "config://openapi",
  () => ({
    contents: schemas.map(schema => ({
      text: JSON.stringify(schema),
      uri: `config://openapi/${schema.name}`,
      mimeType: 'application/json'
    }))
  })
);

// 複数の同時接続をサポートするためのセッションIDによるトランスポートの格納
const transports: {[sessionId: string]: SSEServerTransport} = {};

// メイン関数
async function main() {
  await fetchApiEndpoints();

  // サーバーの起動
  const PORT = process.env.PORT || 3001;

  // Node.jsサーバーの設定
  const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    // SSEエンドポイントの処理
    if (req.url === '/sse') {
      const transport = new SSEServerTransport('/messages', res);
      transports[transport.sessionId] = transport;

      res.on('close', () => {
        delete transports[transport.sessionId];
      });

      server.connect(transport).catch(err => {
        console.error('SSE接続でエラーが発生しました:', err);
      });

      return;
    }

    // メッセージ処理エンドポイントの処理
    if (req.url?.startsWith('/messages') && req.method === 'POST') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const sessionId = url.searchParams.get('sessionId') || '';
      const transport = transports[sessionId];

      if (transport && sessionId) {
        transport.handlePostMessage(req, res).catch(err => {
          console.error('メッセージ処理でエラーが発生しました:', err);
          res.statusCode = 500;
          res.end('Internal Server Error');
        });
        return;
      } else {
        res.statusCode = 400;
        res.end('No transport found for sessionId');
        return;
      }
    }

    // その他のリクエストに対するデフォルトレスポンス
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  });

  httpServer.listen(Number(PORT), () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
  });
}

// メイン関数の実行
main().catch(error => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
