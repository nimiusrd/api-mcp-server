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

### ディレクトリ構造
