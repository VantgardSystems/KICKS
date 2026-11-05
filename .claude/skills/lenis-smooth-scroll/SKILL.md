---
name: lenis-smooth-scroll
description: 軽量スムーズスクロールライブラリ Lenis (darkroomengineering/lenis) を任意のWebプロジェクトに導入・設定するスキル。「Lenis入れて」「スムーズスクロール」「ヌルヌルスクロール」「スクロール滑らかに」「スクロール演出だけ追加」「ページの動きを滑らかに」「lenis」「Studio Freight」「darkroomengineering」などと言われたら必ずこのスキルを使うこと。単一HTML / React / Next.js / Vue / GSAP連携 すべての導入方法を網羅。`premium-lp-react` の一部としても、既存LPへの後付けでも使える。
---

# Lenis Smooth Scroll

darkroomengineering/lenis の導入と設定に特化したスキル。Awwwards 受賞サイトで標準的に使われている軽量（~3KB gzipped）スムーズスクロール。

## 発動条件

- 「Lenis入れて」「ヌルヌルスクロール」「スムーズスクロール」「滑らかなスクロール」
- 既存LPに「スクロールだけ滑らかにして」と頼まれた時
- React/Next.js プロジェクトでスクロール演出のベースを敷く時
- GSAP ScrollTrigger との連携が必要な時

## 導入方法（プロジェクト形態別）

### 1. 単一HTML（CDN）

`non-ai-lp` で作った既存LP に後付けする場合はこれが一番速い。

```html
<script src="https://unpkg.com/lenis@1.3/dist/lenis.min.js"></script>
<script>
  const lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
  })
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
</script>
```

CSS（`html` の `scroll-behavior: smooth` がLenisと競合するので必ず無効化）:

```css
html.lenis, html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
```

### 2. React / Next.js

```bash
npm install lenis
```

`components/SmoothScrollProvider.tsx`:

```tsx
'use client'
import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
```

`app/layout.tsx` で全体ラップ:

```tsx
<body>
  <SmoothScrollProvider>{children}</SmoothScrollProvider>
</body>
```

### 3. GSAP ScrollTrigger 連携（必須パターン）

GSAP を使う場合、Lenis と ScrollTrigger を **ticker 経由で同期** しないと演出がカクつく。

```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

## オプション早見表

| オプション | デフォルト | 用途 |
|---|---|---|
| `lerp` | 0.1 | 線形補間値。小さいほど滑らか・遅延多め |
| `duration` | 1.2 | アニメ持続時間（秒） |
| `smoothWheel` | true | マウスホイールを滑らかに |
| `smoothTouch` | false | タッチ操作も滑らかに（**iOS では推奨しない**） |
| `wheelMultiplier` | 1 | ホイール感度 |
| `touchMultiplier` | 2 | タッチ感度 |
| `infinite` | false | 無限スクロール（特殊用途） |
| `orientation` | 'vertical' | 横スクロールにしたい時 'horizontal' |

## よく使うAPI

```js
// 任意の位置にスクロール
lenis.scrollTo(800)                       // y=800 へ
lenis.scrollTo('#section-2')              // セレクタへ
lenis.scrollTo('#cta', { offset: -100 })  // 100px手前で止める

// 一時停止・再開
lenis.stop()
lenis.start()

// 状態取得
lenis.scroll      // 現在のスクロール位置
lenis.velocity    // スクロール速度
lenis.direction   // 'up' or 'down'
```

## 除外したい要素

スクロール対象から外したい要素には `data-lenis-prevent` を付ける（モーダル内のスクロールなど）:

```html
<div data-lenis-prevent>...</div>
```

## トラブルシュート

| 症状 | 対処 |
|---|---|
| iOS でカクつく | `smoothTouch: false` のままにする |
| 一部要素のスクロールが効かない | `data-lenis-prevent` を付ける |
| anchor link が瞬間移動する | `lenis.scrollTo()` を使う or `data-lenis-scroll-to` |
| GSAP ScrollTrigger とずれる | 上記「GSAP連携」の ticker パターンを使う |
| `position: sticky` が効かない | 親要素に `transform: none` を追加 |

## 参考

- [GitHub: darkroomengineering/lenis](https://github.com/darkroomengineering/lenis)
- [公式デモ: lenis.darkroom.engineering](https://lenis.darkroom.engineering/)
- [Showcase（採用サイト集）](https://lenis.darkroom.engineering/showcase)
