# ChainX

> モダン時代のチェーン型 JavaScript ユーティリティライブラリ

ChainX は、配列・オブジェクト・DOM・非同期処理まで、モダン JavaScript で直感的かつ「非破壊」でチェーン操作できる統合ライブラリです。

jQuery のようにシンプルに書けつつ、現代的な非同期・型判定・エラー処理など幅広く対応します。

---

## デモ

👉 [デモを試す](https://mountain-bell.github.io/chainx/test/demo.html)

ボタンを押して操作を実行。console.log での確認も可能です。

---

## インストール

```html
<script src="./src/chainx.js"></script>
```

またはモジュールとして：

```js
import { ChainX, $X } from "./src/chainx.js";
```

**モジュールモードで使用する場合**は、`chainx.js` 内末尾コメントの `export` 部分をアンコメントしてください。

---

## 特徴

- **配列・オブジェクト操作**: `.map()`, `.filter()`, `.mergeDeep()`, `.defaults()`
- **非破壊・チェーン型**: 値を安全に連続処理
- **DOM 操作**: `.addClass()`, `.text()`, `.html()`, `.css()`, アニメーション対応
- **非同期制御**: `.mapAsync()`, `.retryAsync()`, `.tapAsync()`, `.pipeAsync()`
- **エラー処理**: `.attempt()`, `.onCatch()`, `.fallback()`, `.retry()`
- **状態保存/復元**: `.saveState()`, `.restoreState()`
- **レシピ機能**: 操作の記録と再利用
- **プラグイン拡張**: `ChainX.plugin()` で機能追加

---

## 使い方

### 配列操作

```js
$X([1, 2, 3])
	.push(4)
	.uniq()
	.map((n) => n * 2)
	.log();
```

### オブジェクト操作

```js
$X({ a: 1, b: 2 }).renameKeys({ a: "x" }).mergeDeep({ c: 3 }).log();
```

### DOM 操作

```js
$X("#myDiv")
	.addClass("active")
	.text("更新完了")
	.animate({ opacity: "0.5" }, 500);
```

### 非同期操作

```js
$X([1, 2, 3])
	.mapAsync(async (n) => n * 2)
	.tapAsync((res) => console.log("結果", res));
```

---

## レシピ（操作の記録と再利用）

一連の処理をレシピ化し再利用できます。

```js
const recipe = $XR([1, 2]).push(3).toRecipe();

recipe($X([10, 20])).log();
```

---

## 詳細な関数リファレンス

👉 [API リファレンスを読む](./docs/api-reference.md)

---

## 導入情報

- モジュール作成機能を使わずに、そのまま `<script>` で動作
- グローバルに `$X()` と `ChainX` が定義される

---

## ライセンス

MIT
Copyright (c) 2025 mountain-bell

---

## 作者

Created by [mountain-bell](https://github.com/mountain-bell) (a.k.a. MB)
