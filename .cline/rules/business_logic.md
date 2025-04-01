---
title: ビジネスロジックの書き方
description: ビジネスロジックの実装方法とテスト方法に関するガイドライン
category: development
order: 1
---

# ビジネスロジックの書き方

以下にビジネスロジックの書き方について記述する。
```ts
// user.ts
interface User {
  firstName: string;
  lastName: string;
  middleName?: string;
}

export const getFullName = (user: User): string => {
  if (user.middleName) {
    return `${user.firstName} ${user.middleName} ${user.lastName}`;
  }
  return `${user.firstName} ${user.lastName}`;
};
```

以下にこのビジネスロジックのテストを記述する。
```ts
// user.test.ts
import {describe, expect, it} from 'vitest';
import {getFullName} from './user';

describe('getFullName', () => {
  it('should return full name', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
    };
    expect(getFullName(user)).toBe('John Doe');
  });

  it('should return full name with middle name', () => {
    const user = {
      firstName: 'John',
      middleName: 'Smith',
      lastName: 'Doe',
    };
    expect(getFullName(user)).toBe('John Smith Doe');
  });
});
