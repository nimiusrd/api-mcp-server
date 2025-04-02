import { ServerConfig } from "./src/types.ts";

export const config: ServerConfig = {
  name: "api-suggestion-server",
  version: "1.0.0",
  services: [
    {
      name: "サンプルAPI",
      openApiFilePath: "./schemas/sample-api.yaml"
    },
    {
      name: "サンプルAPI (JSON)",
      openApiFilePath: "./schemas/sample-api.json"
    }
  ]
};
