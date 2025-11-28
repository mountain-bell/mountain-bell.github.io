# DomTrigger

軽量でクラス名ベースの DOM トリガー管理ユーティリティ。  
`js-load-*` や `js-click-*` などのクラス名を使い、HTML から直感的に挙動を定義できます。

- イベントリスナー配置で迷いたくない
- jQuery / フレームワークなしで小さなインタラクションを量産したい
- SSR / 静的サイトで、HTML に挙動を埋め込みたい

そんなニーズに応える、実用性の高いミニマルなライブラリです。

---

## 特徴

- **クラス名ルール**（`js-click-*` など）からトリガーを自動検出
- トリガー名ごとに **1 つのハンドラ登録で完結**
- **async 対応**
- IntersectionObserver による **view-in / view-out トリガー**
- `data-*` の JSON 自動パース & キャッシュ
- `prevent-default` / `stop-propagation` を **HTML 側で制御可能**
- デリゲーション方式で **高パフォーマンス & リスナー最小限**

---

## インストール

```bash
npm install dom-trigger
```

---

## 基本的な使い方

### 1. ハンドラを登録

```ts
import DomTrigger from "dom-trigger";

DomTrigger.use("fade-in", ({ el }) => {
	el?.classList.add("is-visible");
});
```

ハンドラのシグネチャは次のとおり：

```ts
handler({ el, data, ctx });
```

- `el`: 対象要素
- `data`: `data-<name>` の JSON パース結果
- `ctx.name`: トリガー名
- `ctx.event`: 元のイベント（任意）

---

### 2. HTML にクラスを付与

```html
<div class="js-viewin-fade-in" data-view-center="100"></div>
```

- `js-viewin-` → トリガー種別
- `fade-in` → `DomTrigger.use("fade-in")` の対象名
- `data-view-center` → 発火条件（要素が画面中央付近に来たら）

---

### 3. 初期化 (最も簡単)

```ts
DomTrigger.setupOnReady();
```

`setupOnReady()` は内部で：

- DOMContentLoaded 待ち
- `setup()` の実行
  （`load` トリガー、`pageshow` トリガー、イベント監視、view 監視）

---

## DomTrigger の有効性

### 🎯 HTML 側だけで挙動の切り替えが可能

```html
<button class="js-click-open-modal" data-open-modal='{"id": 123}'>OPEN</button>
```

```ts
DomTrigger.use("open-modal", ({ data }) => {
	console.log(data.id); // 123
});
```

- デザイナーも HTML 側だけで制御できる
- JS は「ハンドラを 1 つ書くだけ」で複数要素に適用できる

---

### 🎯 スクロール連動アニメの実装がシンプル

```html
<section class="js-viewin-fade" data-view-ratio="0.3"></section>
```

```ts
DomTrigger.use("fade", ({ el }) => {
	el?.classList.add("active");
});
```

- IntersectionObserver により **scroll イベント不要**
- 動的要素も `observeView()` の再実行で安全に監視追加可能

---

### 🎯 data 属性 JSON の自動パース & キャッシュ

```html
<div class="js-click-track" data-track='{"category":"cta"}'></div>
```

```ts
DomTrigger.use("track", ({ data }) => {
	// data → { category: "cta" }
});
```

- JSON.parse のコストを WeakMap キャッシュで削減
- 更新が必要なら `data-uncache-<name>` を使うだけ

---

### 🎯 preventDefault / stopPropagation を HTML で制御

```html
<a class="js-click-open" data-click-prevent-default> OPEN </a>
```

```html
<button class="js-click-like js-click-track" data-click-stop-propagation>
	Like
</button>
```

JS で毎回 `event.preventDefault()` を書く必要がないため **HTML 主導の UI 設計ができる**。

---

## トリガー種別（trigger types）

### 🟦 バブリングイベント（click, change など）

document/window にデリゲート。

```html
<button class="js-click-like"></button>
```

サポートされるイベント例：

- click / change / input / submit
- focusin / focusout
- pointerdown / pointermove / pointerup
- keydown / keyup
- mouseover / mouseout
- pageshow / pagehide / visibilitychange
- online / offline
- copy / paste

---

### 🟩 Load トリガー

```html
<div class="js-load-init"></div>
```

`DomTrigger.setup()` 時に実行。

---

### 🟧 View トリガー（viewin / viewout）

```html
<div class="js-viewin-fade" data-view-center="80"></div>
<div class="js-viewout-fade"></div>
```

- `data-view-center` → 中心基準
- `data-view-ratio` → 表示割合基準 (0〜1)

---

## API

### `DomTrigger.use(name, handler)`

トリガーを登録。

```ts
DomTrigger.use("open", ({ el, data, ctx }) => {
	/* ... */
});
```

---

### `DomTrigger.run(name, args?)`

明示的にトリガーを実行。

```ts
DomTrigger.run("open", { data: { id: 1 } });
```

---

### `DomTrigger.invoke(name, el, event?)`

特定要素でトリガーを実行（data 自動パース）。

---

### `DomTrigger.invokeLoad()`

Load トリガーを実行（通常は `setup()` で自動）。

---

### `DomTrigger.invokeShow()`

pageshow トリガーを実行。

---

### `DomTrigger.listen()`

バブリングイベントの監視開始（重複監視なし）。

---

### `DomTrigger.observeView()`

IntersectionObserver による viewin / viewout 監視。

---

### `DomTrigger.unuse(name)`

登録済みトリガーを削除。

---

### `DomTrigger.clear()`

登録済みトリガーをすべて削除。

---

### `DomTrigger.setup()`

Load / Show / Event / View をまとめて初期化。

---

### `DomTrigger.setupOnReady()`

DOMContentLoaded 待ち → setup 実行。

---

## ライセンス

MIT
Copyright (c) 2025 mountain-bell

---

## 作者

Created by [mountain-bell](https://github.com/mountain-bell) (a.k.a. MB)
