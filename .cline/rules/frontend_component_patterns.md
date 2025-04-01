---
title: コンポーネントの書き方
description: Reactコンポーネントの実装パターンとベストプラクティス
category: frontend
order: 3
---

# コンポーネントの書き方

以下にコンポーネントの書き方について記述する。
```tsx
import {JSX} from 'react';

interface Props {
  name: string;
  age: number;
}

const MyComponent = ({name, age}: Props): JSX.Element => {
  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
    </div>
  );
};

export default MyComponent;
