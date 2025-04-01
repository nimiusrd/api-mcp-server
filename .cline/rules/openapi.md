---
title: OpenAPI 仕様書の書き方
description: OpenAPI仕様書の作成方法と標準化されたフォーマット
category: api
order: 4
---

# OpenAPI 仕様書の書き方

- OpenAPI仕様書はYAML形式で記述すること
- Componentsを使用してスキーマを定義すること
- 3.1を使用すること
- 入力のスキーマにはInputの接尾辞をつけること
- 出力のスキーマにはOutputの接尾辞をつけること
- 入力の例を記述すること
- 出力の例を記述すること
- 200, 400のレスポンスは必ず記述すること

以下にOpenAPI仕様書の書き方について記述する。

```yaml
openapi: 3.1.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /users:
    get:
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UsersOutput'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
    UsersOutput:
      type: object
      properties:
        users:
          type: array
          items:
            $ref: '#/components/schemas/User'
    Error:
      type: object
      properties:
        message:
          type: string
