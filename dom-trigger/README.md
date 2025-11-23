# DomTrigger

軽量でクラス名ベースの DOM トリガー管理ユーティリティ。\
`js-load-*` や `js-click-*`
などのクラス名を使って、要素に紐づく動作を簡単に実装できます。

## 特徴

- クラス名から自動でトリガーを検出
- カスタムハンドラを登録可能
- 非同期関数にも対応
- IntersectionObserver を使った View トリガー
- data-\* 属性の JSON の自動パース

## インストール

```bash
npm install dom-trigger
```

## 基本的な使い方

### 1. ハンドラを登録

```ts
DomTrigger.use("fade-in", (el, data, ctx) => {
	el?.classList.add("is-visible");
});
```

### 2. HTML でクラスを付与

```html
<div class="js-viewin-fade-in" data-view-center="100"></div>
```

### 3. 初期化（最も一般的な使い方）

`setup()` は以下を自動で行います： - `runLoad()` - `runShow()` -
`listen()` - `observeView()`

#### 推奨される初期化方法（HTML の読み込み完了後）

```ts
if (typeof document !== "undefined") {
	const setupDomTrigger = () => {
		DomTrigger.setup();
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setupDomTrigger, {
			once: true,
		});
	} else {
		setupDomTrigger();
	}
}
```

---

## トリガー種別

### バブリングイベントトリガー（click など）

document にイベントデリゲートされるタイプ。

```html
<button class="js-click-like-button"></button>
```

---

### Load トリガー

ページ読み込み時（setup 実行時）に即発火。

```html
<div class="js-load-init"></div>
```

---

### View トリガー（viewin / viewout）

要素がビューポートに入る／出るタイミングで発火。

```html
<div class="js-viewin-fade" data-view-center="80"></div>

<div class="js-viewin-fade" data-view-ratio="0.5"></div>
```

---

## API

### `DomTrigger.use(name, handler)`

トリガー名と実行関数を登録。

### `DomTrigger.invoke(name, el, event?)`

特定の要素に対しトリガーを直接実行。

### `DomTrigger.run(name, el, data?)`

任意のトリガーを手動実行。

### `DomTrigger.runLoad()`

Load トリガーを実行。

### `DomTrigger.runShow()`

pageshow トリガーを実行。

### `DomTrigger.listen()`

バブリングイベントの監視を開始。

### `DomTrigger.observeView()`

IntersectionObserver を起動（View トリガー用）。

### `DomTrigger.unuse(name)`

特定トリガーを削除。

### `DomTrigger.clear()`

登録されたすべてのトリガーを削除。

### `DomTrigger.setup()`

初期起動に必要な処理（runLoad / runShow / listen / observeView）を実行。

---

## data-\* 属性の収集

```html
<div class="js-load-foo" data-foo='{"id":10, "name":"john"}'></div>
```

ハンドラには次のオブジェクトが渡されます：

```ts
{ id: 10, name: "john" }
```

---

## ライセンス

MIT
Copyright (c) 2025 mountain-bell

---

## 作者

Created by [mountain-bell](https://github.com/mountain-bell) (a.k.a. MB)
