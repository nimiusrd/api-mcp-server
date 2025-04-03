import { describe, it, expect, vi } from 'vitest';

import { parseOpenApiDocument } from '../src/utils.js';

describe('parseOpenApiDocument', () => {
  it('should parse YAML format OpenAPI document', () => {
    const yamlContent = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: テスト
      description: テストAPIです
    `;

    const result = parseOpenApiDocument(yamlContent, '.yaml');
    expect(result).toEqual({
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/test': {
          get: {
            summary: 'テスト',
            description: 'テストAPIです',
          },
        },
      },
    });
  });

  it('should parse JSON format OpenAPI document', () => {
    const jsonContent = JSON.stringify({
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/test': {
          get: {
            summary: 'テスト',
            description: 'テストAPIです',
          },
        },
      },
    });

    const result = parseOpenApiDocument(jsonContent, '.json');
    expect(result).toEqual({
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/test': {
          get: {
            summary: 'テスト',
            description: 'テストAPIです',
          },
        },
      },
    });
  });

  it('should detect YAML format without file extension', () => {
    const yamlContent = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
    `;

    const result = parseOpenApiDocument(yamlContent);
    expect(result).toEqual({
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
    });
  });

  it('should throw an error on parsing failure', () => {
    const invalidContent = '{';

    expect(() => {
      parseOpenApiDocument(invalidContent);
    }).toThrow('OpenAPIドキュメントのパースに失敗しました');
  });
});
