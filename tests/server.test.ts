import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock server functionality
vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => {
  return {
    McpServer: vi.fn().mockImplementation(() => ({
      tool: vi.fn(),
      connect: vi.fn().mockResolvedValue(undefined),
    })),
  };
});

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => {
  return {
    StdioServerTransport: vi.fn(),
  };
});

// Mock file reading
vi.mock('fs', () => ({
  readFileSync: vi.fn().mockReturnValue(`
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: ユーザー一覧の取得
      description: ユーザー情報を取得します
  `),
}));

// Mock configuration
vi.mock('../server.config.js', () => ({
  config: {
    name: 'test-server',
    version: '1.0.0',
    services: [
      {
        name: 'テストAPI',
        openApiFilePath: './test-api.yaml',
      },
    ],
  },
}));

describe('API Suggestion Server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize the server correctly', async () => {
    // Import index.ts (this needs to be done within the test)
    await import('../src/index.js');

    // Import McpServer to verify mocks
    const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');

    // Verify that the Server constructor was called correctly
    expect(McpServer).toHaveBeenCalledWith(
      {
        name: 'test-server',
        version: '1.0.0',
      }
    );
  });
});
