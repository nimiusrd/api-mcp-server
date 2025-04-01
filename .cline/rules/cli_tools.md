---
title: "CLIツールの実装"
description: "CLIツールの実装に関するガイドライン"
category: "development"
order: 5
---

# CLIツールの実装

## Inquirerの使用

CLIツールを実装する際は、ユーザーとのインタラクションに[Inquirer.js](https://github.com/SBoudrias/Inquirer.js/)を使用してください。Inquirerは、コマンドラインでのユーザー入力を簡単に処理するためのライブラリです。

### 基本的な使用方法

```javascript
const inquirer = require('inquirer');

async function getUserInput() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'ユーザー名を入力してください:',
      default: 'user'
    },
    {
      type: 'password',
      name: 'password',
      message: 'パスワードを入力してください:'
    },
    {
      type: 'list',
      name: 'role',
      message: '役割を選択してください:',
      choices: ['管理者', '編集者', '閲覧者']
    }
  ]);
  
  return answers;
}
```

### 推奨される入力タイプ

以下の入力タイプを状況に応じて使い分けてください：

- `input`: 一般的なテキスト入力
- `password`: パスワードなどの秘匿情報の入力
- `list`: 単一選択のリスト
- `checkbox`: 複数選択のチェックボックス
- `confirm`: はい/いいえの確認
- `editor`: 複数行のテキスト入力

### バリデーション

ユーザー入力のバリデーションを行うには、各質問オブジェクトに`validate`関数を追加してください：

```javascript
{
  type: 'input',
  name: 'email',
  message: 'メールアドレスを入力してください:',
  validate: function(value) {
    const valid = /\S+@\S+\.\S+/.test(value);
    return valid || 'メールアドレスの形式が正しくありません';
  }
}
```

### 条件付き質問

前の回答に基づいて質問を表示するには、`when`関数を使用してください：

```javascript
{
  type: 'confirm',
  name: 'wantNotifications',
  message: '通知を受け取りますか？'
},
{
  type: 'input',
  name: 'email',
  message: '通知先のメールアドレスを入力してください:',
  when: function(answers) {
    return answers.wantNotifications;
  }
}
```

## ベストプラクティス

1. **ヘルプを提供する**: `--help`フラグでコマンドの使用方法を表示する機能を実装してください。
2. **エラーハンドリング**: ユーザー入力のエラーを適切に処理し、わかりやすいエラーメッセージを表示してください。
3. **進行状況の表示**: 長時間実行される処理では、進行状況を表示してください。
4. **カラー表示**: 重要な情報や警告、エラーメッセージには適切な色を使用してください。
5. **設定の保存**: ユーザーの設定や入力を保存して、次回の実行時に再利用できるようにしてください。
