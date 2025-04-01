# ClineによるUI/UX開発

この例では、Clineを使用してUI/UX開発タスクを支援する方法を示します。

## 例題

**プロンプト**: 「ウェブサイト用のレスポンシブナビゲーションメニューを作成してください。」

## Clineへの依頼方法

ClineにUI/UX開発の支援を依頼する際は、以下を含めることを検討してください：

1. 必要な特定のUIコンポーネントまたはレイアウト
2. ターゲットデバイスまたは画面サイズ（モバイル、タブレット、デスクトップ）
3. デザインの好み（色、スタイル、アニメーション）
4. アクセシビリティ要件
5. 使用しているフレームワークまたはライブラリ（React、Vue、Bootstrapなど）

プロンプト例：
```
以下の要件を満たすビジネスウェブサイト用のレスポンシブナビゲーションメニューを作成してください：

- モバイル（ハンバーガーメニュー）とデスクトップ（水平メニュー）で動作する
- ロゴ、ナビゲーションリンク（ホーム、サービス、会社概要、お問い合わせ）、およびコールトゥアクションボタンを含める
- スムーズな遷移を持つクリーンでモダンなデザインを使用する
- カラースキームは#2A4B8D（ダークブルー）をプライマリカラーとして使用する
- HTML、CSS、およびバニラJavaScript（フレームワークなし）で構築する
- アクセシブルであり、WCAGガイドラインに従う
- インタラクティブ要素のホバー状態とアクティブ状態を含める

これを実装するために必要なHTML、CSS、およびJavaScriptコードを提供してください。
```

## 期待される出力

Clineはコードと説明を含む完全なソリューションを提供します：

```
# レスポンシブナビゲーションメニュー

要件を満たすレスポンシブナビゲーションメニューの実装を以下に示します：

## HTML構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ビジネスウェブサイト</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="logo">
        <a href="/" aria-label="ホーム">
          <img src="logo.svg" alt="会社ロゴ" width="150" height="40">
        </a>
      </div>
      
      <button class="nav-toggle" aria-label="ナビゲーションメニューを切り替える" aria-expanded="false">
        <span class="hamburger"></span>
      </button>
      
      <nav class="nav" aria-label="メインナビゲーション">
        <ul class="nav-list">
          <li class="nav-item"><a href="/" class="nav-link active">ホーム</a></li>
          <li class="nav-item"><a href="/services" class="nav-link">サービス</a></li>
          <li class="nav-item"><a href="/about" class="nav-link">会社概要</a></li>
          <li class="nav-item"><a href="/contact" class="nav-link">お問い合わせ</a></li>
        </ul>
        <a href="/get-started" class="cta-button">はじめる</a>
      </nav>
    </div>
  </header>
  
  <script src="script.js"></script>
</body>
</html>
```

## CSSスタイル

```css
:root {
  --primary-color: #2A4B8D;
  --primary-light: #3A5CA0;
  --text-color: #333333;
  --white: #ffffff;
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

/* ヘッダーとナビゲーション */
.header {
  background-color: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo a {
  display: inline-block;
}

.nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin-right: 2rem;
}

.nav-item {
  margin: 0 1rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: var(--transition);
}

.nav-link:hover, 
.nav-link:focus {
  color: var(--primary-color);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: var(--transition);
}

.nav-link:hover::after,
.nav-link:focus::after,
.nav-link.active::after {
  width: 100%;
}

.cta-button {
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.cta-button:hover,
.cta-button:focus {
  background-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(42, 75, 141, 0.2);
}

.nav-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1000;
}

.hamburger,
.hamburger::before,
.hamburger::after {
  display: block;
  width: 24px;
  height: 3px;
  background-color: var(--primary-color);
  position: relative;
  transition: var(--transition);
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  left: 0;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

/* モバイルナビゲーション */
@media (max-width: 768px) {
  .nav-toggle {
    display: block;
  }
  
  .nav {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 80%;
    max-width: 300px;
    background-color: var(--white);
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    justify-content: center;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 999;
  }
  
  .nav.active {
    transform: translateX(0);
  }
  
  .nav-list {
    flex-direction: column;
    margin: 0 0 2rem 0;
    width: 100%;
  }
  
  .nav-item {
    margin: 0;
    width: 100%;
    text-align: center;
  }
  
  .nav-link {
    display: block;
    padding: 1rem;
  }
  
  .nav-link::after {
    display: none;
  }
  
  .nav-link:hover,
  .nav-link:focus,
  .nav-link.active {
    background-color: rgba(42, 75, 141, 0.1);
  }
  
  .cta-button {
    margin-top: 1rem;
  }
  
  /* ハンバーガーアニメーション */
  .nav-toggle[aria-expanded="true"] .hamburger {
    background-color: transparent;
  }
  
  .nav-toggle[aria-expanded="true"] .hamburger::before {
    top: 0;
    transform: rotate(45deg);
  }
  
  .nav-toggle[aria-expanded="true"] .hamburger::after {
    bottom: 0;
    transform: rotate(-45deg);
  }
}
```

## JavaScript

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  
  // モバイルナビゲーションの切り替え
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
    
    // メニューが開いているときのスクロールを防止
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });
  
  // 外側をクリックしたときにモバイルナビを閉じる
  document.addEventListener('click', (e) => {
    const isNavOpen = nav.classList.contains('active');
    const isClickInsideNav = nav.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);
    
    if (isNavOpen && !isClickInsideNav && !isClickOnToggle) {
      nav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // ウィンドウのリサイズを処理
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('active')) {
      nav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // 現在のページに基づいてアクティブなナビリンクを設定
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentLocation) {
      link.classList.add('active');
    } else if (currentLocation !== '/' && linkPath !== '/' && currentLocation.includes(linkPath)) {
      link.classList.add('active');
    }
  });
});
```

## アクセシビリティ機能

この実装には、いくつかのアクセシビリティ機能が含まれています：

1. **セマンティックHTML** - `<nav>`、`<header>`、`<button>`などの適切な要素の使用
2. **ARIA属性** - スクリーンリーダー用の`aria-label`と`aria-expanded`を含む
3. **キーボードナビゲーション** - すべてのインタラクティブ要素はフォーカス可能で、可視的なフォーカス状態を持つ
4. **色のコントラスト** - カラースキームは読みやすさのためのWCAG AAスタンダードを満たしている
5. **スクリーンリーダーサポート** - ナビゲーション要素の適切なラベル付け
6. **レスポンシブデザイン** - すべての画面サイズで動作する

## レスポンシブな動作

- デスクトップ（>768px）：ホバー効果のある水平ナビゲーション
- モバイル（≤768px）：サイドナビゲーションパネルに展開するハンバーガーメニュー
- 状態間のスムーズな遷移
- モバイルメニューが開いているときの背景コンテンツのスクロールを防止

## 追加メモ

- `logo.svg`を実際のロゴファイルに置き換える
- ナビゲーションリンクをウェブサイトの構造に合わせて更新する
- `:root` CSS変数の色をブランドに合わせて調整できる
```

## より良いUI/UX開発を得るためのヒント

1. 可能な場合は視覚的な参照やインスピレーションを提供する
2. ターゲットブラウザとデバイスを指定する
3. アクセシビリティ要件を含める
4. 既存のデザインシステムやスタイルガイドについて言及する
5. 望ましいユーザー体験とインタラクションを説明する
6. パフォーマンスに関する考慮事項を指定する
