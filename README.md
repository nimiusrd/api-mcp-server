# API Suggestion Server

## 概要

API Suggestion Serverは、OpenAPI仕様に基づいて適切なAPIエンドポイントを提案するMCP（Model Context Protocol）サーバーです。このサーバーは、ユーザーの目的や要件に基づいて、利用可能なAPIエンドポイントの中から最適なものを提案します。

## 機能

- 複数のOpenAPI仕様（YAMLまたはJSON形式）からAPIエンドポイント情報を収集
- ユーザーの目的に基づいて関連するAPIエンドポイントを提案
- MCPプロトコルを通じてAIモデルと連携

## 前提条件

- Node.js 18以上
- npm または yarn

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/api-mcp-server.git
cd api-mcp-server

# 依存関係をインストール
npm install
```

## 設定

サーバーの設定は`server.config.ts`ファイルで管理されています。以下のように設定を変更できます：

```typescript
import { ServerConfig } from "./src/types.ts";

export const config: ServerConfig = {
  name: "api-suggestion-server",
  version: "1.0.0",
  services: [
    {
      name: "サービス名",
      // OpenAPI仕様のURLを指定
      openApiUrl: "https://example.com/api/openapi.json"
    },
    {
      name: "別のサービス",
      // ローカルファイルパスを指定（YAMLまたはJSON）
      openApiFilePath: "./schemas/your-api.yaml"
    }
  ]
};
```

## 使い方

### サーバーの起動

```bash
npm start
```

サーバーは標準入出力（stdio）を通じてMCPプロトコルで通信します。

### 実行例

以下は実際にAPIサジェストサーバーを使用する例です：

1. サーバーの起動：

```bash
# ターミナルでサーバーを起動
npm start
```

2. MCP対応のAIモデル（例：Claude）との連携：

```javascript
// MCPプロトコルを使用してAIモデルとの対話を設定
const conversation = await anthropic.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 1000,
  messages: [{ role: "user", content: "ユーザー情報を取得するAPIはありますか？" }],
  tools: [
    {
      // API Suggestion Serverのツール設定
      name: "suggest_api",
      description: "指定された用途に適したAPIエンドポイントをサジェストします。",
      input_schema: {
        type: "object",
        properties: {
          purpose: {
            type: "string",
            description: "APIエンドポイントを使用したい用途や目的の説明。",
          },
        },
        required: ["purpose"],
      }
    }
  ],
  tool_choice: "auto"
});

// AIモデルの応答からツール呼び出しを処理
if (conversation.content[0].type === "tool_use") {
  const toolUse = conversation.content[0];
  
  // ツール呼び出しをMCPサーバーに転送
  // ここでは簡略化していますが、実際にはMCPプロトコルの仕様に従った通信が必要です
  const result = await mcpClient.callTool(toolUse.name, toolUse.input);
  
  // ツールの結果をAIモデルに返す
  const followUp = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000,
    messages: [
      { role: "user", content: "ユーザー情報を取得するAPIはありますか？" },
      { role: "assistant", content: toolUse },
      { 
        role: "user", 
        content: [
          { type: "tool_result", tool_use_id: toolUse.id, content: JSON.stringify(result) }
        ]
      }
    ]
  });
  
  console.log(followUp.content);
}
```

3. 実行結果の例：

AIモデルは、サーバーから提供されたAPIエンドポイント情報を用いて以下のような応答を生成します：

```
はい、ユーザー情報を取得するためのAPIエンドポイントがいくつかあります：

1. GET /users/{userId}
   - 説明: 指定されたIDのユーザー情報を取得します
   - サービス: サンプルAPI

2. GET /users
   - 説明: 登録されているすべてのユーザーの一覧を取得します
   - サービス: サンプルAPI

特定のユーザーの情報を取得するには「GET /users/{userId}」を使用し、ユーザーIDをパスパラメータとして指定します。複数のユーザー情報を一度に取得するには「GET /users」を使用できます。

### AIモデルとの連携

このサーバーはMCPプロトコルを実装しており、Claude、GPT-4などのAIモデルと連携できます。AIモデルは以下のツールを呼び出すことができます：

#### suggest_api

指定された用途に適したAPIエンドポイントを提案します。

**入力パラメータ**:
- `purpose`: APIエンドポイントを使用したい用途や目的の説明（文字列）

**出力**:
- 関連するAPIエンドポイントのリスト（サービス名、パス、メソッド、説明を含む）

**使用例**:
```json
{
  "name": "suggest_api",
  "arguments": {
    "purpose": "ユーザー情報を取得する"
  }
}
```

**応答例**:
```json
{
  "toolResult": [
    {
      "service": "サンプルAPI",
      "path": "/users/{userId}",
      "method": "GET",
      "description": "指定されたIDのユーザー情報を取得します"
    },
    {
      "service": "サンプルAPI",
      "path": "/users",
      "method": "GET",
      "description": "登録されているすべてのユーザーの一覧を取得します"
    }
  ]
}
```

## カスタマイズ

### 新しいOpenAPI仕様の追加

1. OpenAPI仕様ファイル（YAMLまたはJSON）を`schemas`ディレクトリに追加するか、公開URLを用意します
2. `server.config.ts`ファイルを編集して新しいサービスを追加します

### サポートされるフォーマット

- YAML形式のOpenAPI仕様（`.yaml`または`.yml`拡張子）
- JSON形式のOpenAPI仕様（`.json`拡張子）
- URLで指定されたOpenAPI仕様（コンテンツタイプに基づいて自動的に解析）

## 開発

### ビルド

```bash
npm run build
```

### テスト

以下のコマンドでテストを実行できます：

```bash
# 全てのテストを実行
npm test

# テストをウォッチモードで実行（開発中に便利）
npm run test:watch

# カバレッジレポートを生成
npm run test:coverage
```

テストは以下のカテゴリに分かれています：

- **utils.test.ts**: OpenAPIドキュメントのパース機能のテスト
- **server.test.ts**: サーバー初期化のテスト
- **suggest-api.test.ts**: APIサジェスト機能のテスト

新しいテストを追加する場合は、`src/tests`ディレクトリに`*.test.ts`ファイルを作成してください。

### ディレクトリ構造

```
api-mcp-server/
├── src/
│   ├── index.ts        # メインサーバーコード
│   ├── utils.ts        # ユーティリティ関数
│   ├── types.ts        # 型定義
│   └── tests/          # テストファイル
├── schemas/            # OpenAPI仕様ファイル
├── server.config.ts    # サーバー設定
├── tsconfig.json       # TypeScript設定
└── package.json        # プロジェクト設定
```

## ライセンス

MIT

## 貢献

バグ報告や機能リクエストは、GitHubのIssueトラッカーを通じてお願いします。プルリクエストも歓迎します。