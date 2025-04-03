import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock server functionality
vi.mock('@modelcontextprotocol/sdk/server/index.js', () => {
  return {
    Server: vi.fn().mockImplementation(() => ({
      setRequestHandler: vi.fn(),
      connect: vi.fn().mockResolvedValue(undefined),
    })),
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

    // Verify that the Server constructor was called correctly
    expect(Server).toHaveBeenCalledWith(
      {
        name: 'test-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  });
});
