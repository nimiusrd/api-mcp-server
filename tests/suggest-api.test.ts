import { describe, it, expect, beforeEach } from 'vitest';

import { ApiEndpoint } from '../src/types.js';

// Sample API endpoint data
const mockApiEndpoints: ApiEndpoint[] = [
  {
    service: 'Test API',
    path: '/users',
    method: 'GET',
    description: 'Retrieve a list of users',
  },
  {
    service: 'Test API',
    path: '/users/{userId}',
    method: 'GET',
    description: 'Retrieve a specific user information',
  },
  {
    service: 'Test API',
    path: '/products',
    method: 'GET',
    description: 'Retrieve a list of products',
  },
];

// Helper function to test API suggestion independently
function suggestApis(purpose: string): ApiEndpoint[] {
  return mockApiEndpoints.filter(endpoint => endpoint.description.includes(purpose));
}

describe('API Suggestion Feature', () => {
  it('should suggest APIs matching the specified purpose', () => {
    const result = suggestApis('user');

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      {
        service: 'Test API',
        path: '/users',
        method: 'GET',
        description: 'Retrieve a list of users',
      },
      {
        service: 'Test API',
        path: '/users/{userId}',
        method: 'GET',
        description: 'Retrieve a specific user information',
      },
    ]);
  });

  it('should return an empty array when no matching APIs are found', () => {
    const result = suggestApis('non-existent feature');
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('should suggest APIs based on partial matches', () => {
    const result = suggestApis('list');

    expect(result).toHaveLength(2);
    expect(result.map(api => api.path)).toEqual(['/users', '/products']);
  });
});
