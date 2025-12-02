# DomTrigger

**DomTrigger は、「HTML のクラス名だけで UI 挙動を記述できる」軽量 DOM トリガーライブラリです。**

- JavaScript 側では 1 つのハンドラを書く
- HTML に `js-click-ハンドラ名` のようなクラスを書く
- それだけで UI のイベントを整理された形で扱える

という、“HTML 主導の UI 設計”を実現します。

**小さくて直感的、そして高速。
フレームワークを使わないサイトでも、気持ちよくインタラクションを実装できます。**

---

# ✨ 特徴

- **HTML にクラス名を書くとイベントが自動で紐づく**
- **1 トリガー ＝ 1 ハンドラ** というシンプルな構造
- **イベントデリゲーション**による高パフォーマンス（リスナー最小限）
- `data-ハンドラ名` の JSON を自動パース
- **prevent-default / stop-propagation を HTML 側で制御**
- IntersectionObserver を使った **viewin / viewout** の VIEW トリガー

---

# 🧩 インストール

```bash
npm install @mountain-bell/dom-trigger
```

---

# 🚀 基本の使い方

## 1. ハンドラを登録

```ts
import DomTrigger from "@mountain-bell/dom-trigger";

DomTrigger.use("fade-in", ({ el, data, ctx }) => {
	el?.classList.add("is-visible");
	console.log(data, ctx);
});
```

受け取る値：

- `el`： 対象要素
- `data`： `data-ハンドラ名` の JSON パース結果
- `ctx.name`： ハンドラ名
- `ctx.event`： 発生元の Event オブジェクト

---

## 2. HTML のクラスにトリガーを書く

```html
<div class="js-viewin-fade-in"></div>
```

- `js-viewin-fade-in` → DOM が画面内に入った時に `fade-in` を発火

---

## 3. 初期化

```ts
DomTrigger.setupOnReady();
```

これで DomTrigger の全イベント監視が自動開始します。
引数にコールバック関数を渡すことで、イベントの監視後に発火させたい処理をコントロールできます。

---

# 🗂️ Data 属性について

DomTrigger では、`data-ハンドラ名` に JSON を記述することで、  
ハンドラに任意のデータを渡すことができます。

```html
<button
	class="js-click-track"
	data-track='{"category":"cta","label":"header"}'
></button>
```

ハンドラ側では `data` にパース済みオブジェクトとして渡されます。

```ts
DomTrigger.use("track", ({ data }) => {
	console.log(data.category); // "cta"
});
```

### 💡 キャッシュについて

DomTrigger は JSON パース結果を WeakMap にキャッシュし、
同じ要素に何度も触れる際のパフォーマンスを最適化しています。

値を再パースしたい場合は `data-uncache-ハンドラ名` を付けます。

```html
<button
	class="js-click-update"
	data-update='{"step":1}'
	data-uncache-update
></button>
```

`data-uncache-ハンドラ名` があると、毎回新しい値として取得されます。

---

# 🧭 イベントの種類

DomTrigger は、HTML のクラス名でイベントを表現します。
イベントごとに（例: click / submit） `data-イベント名-prevent-default` / `data-イベント名-stop-propagation` を付けることで、`preventDefault()` や `stopPropagation()` を JavaScript ではなく HTML 側で制御できます。

例：

```html
<button class="js-click-open" data-click-stop-propagation></button>
<input class="js-change-update" />
<form class="js-submit-register" data-submit-prevent-default></form>
<div class="js-keydown-search"></div>
```

以下に各イベントカテゴリをまとめました。

---

## 🟦 クリック / ポインターイベント

| イベント    | クラス接頭辞      | 例                     |
| ----------- | ----------------- | ---------------------- |
| click       | `js-click-`       | `js-click-like`        |
| pointerdown | `js-pointerdown-` | `js-pointerdown-start` |
| pointermove | `js-pointermove-` | `js-pointermove-drag`  |
| pointerup   | `js-pointerup-`   | `js-pointerup-end`     |

※ `pointermove` は `pointerdown` が発生した後にしか発火しないように最適化されています。

---

## 🟩 入力 / フォームイベント

| イベント | 接頭辞       | 例                 |
| -------- | ------------ | ------------------ |
| input    | `js-input-`  | `js-input-filter`  |
| change   | `js-change-` | `js-change-option` |
| submit   | `js-submit-` | `js-submit-form`   |

---

## 🟨 フォーカスイベント

| イベント | 接頭辞         |
| -------- | -------------- |
| focusin  | `js-focusin-`  |
| focusout | `js-focusout-` |

---

## 🟧 キーボードイベント

| イベント | 接頭辞        |
| -------- | ------------- |
| keydown  | `js-keydown-` |
| keyup    | `js-keyup-`   |

※ クリック補助等で使用できます。PC 向けのイベントです。

---

## 🟫 マウスイベント

| イベント  | 接頭辞          |
| --------- | --------------- |
| mouseover | `js-mouseover-` |
| mouseout  | `js-mouseout-`  |

※ ホバー演出等で使用できます。PC 向けのイベントです。

---

## 🟪 ページ / ライフサイクル

| イベント         | 接頭辞                 |
| ---------------- | ---------------------- |
| load             | `js-load-`             |
| pageshow         | `js-pageshow-`         |
| pagehide         | `js-pagehide-`         |
| visibilitychange | `js-visibilitychange-` |

※ body タグにのみしか設定できません。

---

## 🟦 ネットワーク

| イベント | 接頭辞        |
| -------- | ------------- |
| online   | `js-online-`  |
| offline  | `js-offline-` |

※ body タグにのみしか設定できません。

---

## 🟩 クリップボード

| イベント | 接頭辞      |
| -------- | ----------- |
| copy     | `js-copy-`  |
| paste    | `js-paste-` |

---

# 👁️ VIEW トリガー

ビュー判定は **IntersectionObserver** により監視しています。

```html
<div class="js-viewin-fade" data-view-ratio="0.3"></div>
<div class="js-viewout-fade"></div>
```

- `js-viewin-…` → 指定割合以上見えたら実行
- `js-viewout-…` → in 状態から外れたら実行
- `data-view-ratio` → 0〜1（例：0.3 = 30% 以上見えたら）

---

# 🛠 API

## `DomTrigger.use(name, handler)`

トリガー登録。

## `DomTrigger.run(name, options?)`

任意で起動。

## `DomTrigger.invoke(name, el, event?)`

特定要素に対して発火。

## `DomTrigger.listen()`

View トリガー以外のトリガーを監視開始。

## `DomTrigger.observeView()`

View トリガーを監視開始。

## `DomTrigger.unuse(name)`

トリガー削除。

## `DomTrigger.clear()`

トリガー登録を全消去。

## `DomTrigger.setup()`

全トリガーを監視開始。

## `DomTrigger.setupOnReady()`

DOMContentLoaded 後に setup。

---

# 📄 ライセンス

MIT
© 2025 mountain-bell

---

# 👤 作者

Created by
[mountain-bell](https://github.com/mountain-bell) (a.k.a. MB)
