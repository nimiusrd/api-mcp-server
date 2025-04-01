# Cline Rules

このディレクトリには、プロジェクトで使用するClineのルールが含まれています。

## 概要

`.cline`ディレクトリには、プロジェクトのさまざまな側面に関するルールが個別のMarkdownファイルとして保存されています。これらのルールは、プロジェクトのコーディング規約、ドキュメント要件、テスト基準などを定義しています。

## Frontmatterの使用

各ルールファイルは、YAMLフォーマットのFrontmatterを使用してメタデータを管理しています。Frontmatterには以下の情報を含めることができます：

```yaml
---
title: ルールのタイトル
description: ルールの簡単な説明
category: ルールのカテゴリ（例：development, documentation, frontend, api）
order: カテゴリ内での表示順序（数値）
---
```

これにより、ルールの分類や整理が容易になり、プログラムでの処理も簡単になります。

## 利用可能なルール

- `business_logic.md` - ビジネスロジックの書き方
- `documentation.md` - ドキュメント要件
- `frontend_component_patterns.md` - コンポーネントの書き方
- `openapi.md` - OpenAPI仕様書の書き方

## ルールの生成方法

プロジェクトルートに`.clinerules`ファイルを生成するには、以下のコマンドを実行します：

```bash
node .cline/cline-rules-generator.js
```

このコマンドを実行すると、利用可能なルールのリストが表示され、どのルールを`.clinerules`ファイルに含めるかを選択できます。選択したルールは、カテゴリごとにグループ化され、指定した順序で`.clinerules`ファイルに出力されます。

### 使用例

```
$ node .cline/cline-rules-generator.js
Cline Rules Generator
=====================
利用可能なルールファイル:
1. ビジネスロジックの書き方 [development] - ビジネスロジックの実装方法とテスト方法に関するガイドライン
2. ドキュメント要件 [documentation] - プロジェクトのドキュメント作成に関する要件とガイドライン
3. コンポーネントの書き方 [frontend] - Reactコンポーネントの実装パターンとベストプラクティス
4. OpenAPI 仕様書の書き方 [api] - OpenAPI仕様書の作成方法と標準化されたフォーマット
すべて選択する場合は "all" と入力してください。
複数選択する場合はカンマ区切りで番号を入力してください（例: 1,3,5）
選択するルールファイルの番号を入力してください: 1,2,3
選択されたルール:
- ビジネスロジックの書き方
- ドキュメント要件
- コンポーネントの書き方
.clinerules ファイルが正常に生成されました: /path/to/project/.clinerules
```

## ルールのカスタマイズ

新しいルールを追加したり、既存のルールを変更したりする場合は、`.cline/rules`ディレクトリ内の対応するMarkdownファイルを編集してください。新しいルールを追加する場合は、Frontmatterを含めることを忘れないでください。
