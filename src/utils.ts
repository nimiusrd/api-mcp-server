import * as yaml from 'js-yaml';

/**
 * OpenAPIドキュメントをパースする関数
 * @param content ドキュメントの内容
 * @param fileExtension ファイル拡張子（オプション）
 * @returns パースされたOpenAPIドキュメント
 */
export function parseOpenApiDocument(content: string, fileExtension?: string): any {
  try {
    // 拡張子またはコンテンツに基づいてパース方法を決定
    if (
      fileExtension === '.yaml' ||
      fileExtension === '.yml' ||
      content.trim().startsWith('openapi:')
    ) {
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
