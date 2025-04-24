# ChainX

> モダン時代のチェーン型 JavaScript ユーティリティライブラリ

ChainX は、配列やオブジェクト、DOM、非同期処理までを「非破壊」で継続的に操作できる JavaScript ライブラリです。

jQuery に近い使い心地を持ちながらも、現代的な DOM/データ/非同期に完全対応。

---

## デモ

👉 [デモを試す](https://mountain-bell.github.io/chainx/test/demo.html)

ボタンを押して操作を実行。console.log での確認も可能です。

---

## インストール

```html
<script src="./src/chainx.js"></script>
```

または（モジュールとして使う場合）:

```js
import { ChainX, $X } from "./src/chainx.js";
```

### 🔄 モジュールとして使いたい場合

`chainx.js` は通常 `<script>` タグでグローバルに `$X()` を定義する形式ですが、  
**モジュールとして `import` したい場合は、末尾のコメントを有効化**してください：

```js
// export { ChainX, $X };
```

> ⚠️ コメントを外すと `<script>` タグでの読み込みでは動かなくなります。  
> 必要に応じて、環境に合わせて切り替えてください。

---

## 使い方

### 配列操作

```js
$X([1, 2, 3]).push(4).uniq().log();
```

### オブジェクト操作

```js
$X({ a: 1 }).renameKeys({ a: "x" }).log();
```

### DOM

```js
$X("#myDiv").text("Hello!").fadeIn();
```

### 非同期

```js
$X([1, 2, 3])
	.mapAsync(async (n) => n * 2)
	.tapAsync((res) => console.log(res));
```

---

## 特徴

- 非破壊型: 元の値を保ったまま操作
- 型判定: `.isArray()`, `.type()` など
- データ操作: `.clone()`, `.mergeDeep()`, `.pick()`
- 配列ユーティリティ: `.groupBy()`, `.compact()`, `.shuffle()`
- エラー処理: `.safe()`, `.fallback()`, `.retry()`
- DOM: `.addClass()`, `.fadeToggle()`, `.slideUp()`, `.scrollReveal()`
- 非同期: `.tapAsync()`, `.mapAsync()`, `.await()`
- 独自拡張: `ChainX.plugin()`
- 状態保存: `.saveState()`, `.restoreState()`

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
