import { ServerConfig } from './src/types.js';

export const config: ServerConfig = {
  name: 'api-suggestion-server',
  version: '1.0.0',
  services: [
    {
      name: 'サンプルAPI',
      openApiFilePath: './schemas/sample-api.yaml',
    },
    {
      name: 'サンプルAPI (JSON)',
      openApiFilePath: './schemas/sample-api.json',
    },
    {
      name: 'ヘルスケアアプリ',
      openApiUrl: 'https://gist.githubusercontent.com/nimiusrd/622343d4b13344f2723f8b227d562188/raw/2e40307863d354eaf47bc714d9562e63154d7877/openapi.yaml'
    }
  ],
};
