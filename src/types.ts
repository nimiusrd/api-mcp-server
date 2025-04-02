export interface ServiceConfig {
  name: string;
  // OpenAPIスキーマのURL
  openApiUrl?: string;
  // ローカルファイルパス
  openApiFilePath?: string;
}

export interface ApiEndpoint {
  service: string;
  path: string;
  method: string;
  description: string;
}

export interface ServerConfig {
  // サーバー名
  name: string;
  // サーバーバージョン
  version: string;
  // APIサービス設定
  services: ServiceConfig[];
}
