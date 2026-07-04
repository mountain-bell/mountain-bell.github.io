# DomChainer

**DomChainer は、「DOM 操作をメソッドチェーンで直感的に書ける」軽量ユーティリティライブラリです。**

- JavaScript 側で対象要素を選ぶ
- `.addClass()` や `.text()` などの小さな操作をつなげる
- 条件分岐もチェーンの中で扱う

という、素の DOM API を少しだけ扱いやすくするためのライブラリです。

**小さくて直感的、そして高速。  
フレームワークを使わないサイトでも、DOM 操作をすっきり書けます。**

---

## ✨ 特徴

- **メソッドをつなげるだけ**のシンプルな DOM 操作
- **1 要素にも複数要素にも同じ書き方**で対応
- **if / else / end** によるチェーン内の条件分岐
- **文字列と Node の両方**を `append` / `prepend` / `before` / `after` に渡せる
- **TypeScript 対応**の軽量 Vanilla JS ユーティリティ

---

## 🧩 インストール

```bash
npm install @mountain-bell/dom-chainer
```

---

## 🚀 基本の使い方

### 1. 要素を選択して操作する

```ts
import DomChainer from "@mountain-bell/dom-chainer";

DomChainer.selOne("#message")
	.text("Hello, DomChainer!")
	.addClass("is-visible")
	.setStyle("color", "blue");
```

※ named import でも利用できます。

`selOne()` は最初に見つかった 1 要素をラップします。対象が見つからない場合でもエラーにはならず、空のチェーンとして扱われます。

---

### 2. 複数要素をまとめて操作する

```ts
DomChainer.selAll(".item")
	.addClass("is-active")
	.setAttr("data-ready", "true")
	.text("更新済み");
```

`selAll()` は該当するすべての要素に同じ操作を適用します。

---

### 3. ID / class / tag から選ぶ

```ts
DomChainer.id("header").addClass("is-fixed");
DomChainer.cls("button").addClass("is-enabled");
DomChainer.tag("section").removeClass("is-hidden");
```

- `id("header")` は `document.getElementById("header")`
- `cls("button")` は `document.getElementsByClassName("button")`
- `tag("section")` は `document.getElementsByTagName("section")`

を使って要素を取得します。

---

### 4. 既存の DOM 要素をラップする

```ts
const element = document.querySelector(".container");

DomChainer.wrap(element)
	.addClass("is-mounted")
	.append(document.createElement("span"));
```

`wrap()` には単一の `Element`、`NodeList`、配列、`null`、`undefined` を渡せます。`null` や `undefined` は空のチェーンになります。

---

## 🔀 チェーン内の条件分岐

DomChainer では `.if()` / `.else()` / `.end()` を使って、チェーンを途中だけ有効または無効にできます。

```ts
const isOpen = true;

DomChainer.id("menu")
	.if(isOpen)
	.addClass("is-open")
	.else()
	.removeClass("is-open")
	.end()
	.setAttr("aria-hidden", String(!isOpen));
```

- `.if(true)` の後は `.else()` まで実行されます
- `.if(false)` の後は `.else()` までスキップされます
- `.else()` は有効 / 無効を反転します
- `.end()` で通常の実行状態に戻ります

---

## 📝 Node の追加について

`append()` / `prepend()` / `before()` / `after()` は、文字列または `Node` を複数渡せます。

```ts
const badge = document.createElement("span");
badge.textContent = "NEW";

DomChainer.selAll(".card").append(" ", badge);
```

複数要素に同じ `Node` を追加する場合、2 要素目以降には `cloneNode(true)` された Node が使われます。

---

## 🛠️ API

### `DomChainer.id(id)`

指定した ID の要素をラップします。

### `DomChainer.cls(className)`

指定した class 名を持つすべての要素をラップします。

### `DomChainer.tag(tagName)`

指定したタグ名のすべての要素をラップします。

### `DomChainer.selOne(selector)`

CSS セレクタに一致する最初の要素をラップします。

### `DomChainer.selAll(selector)`

CSS セレクタに一致するすべての要素をラップします。

### `DomChainer.wrap(input)`

既存の `Element`、`Iterable<Element>`、`ArrayLike<Element>` をラップします。`null` / `undefined` は空のチェーンとして扱います。

---

## 📜 メソッド一覧

| メソッド                          | 説明                                                      |
| :-------------------------------- | :-------------------------------------------------------- |
| `.getElements()`                  | ラップしている `Element[]` を返します。                   |
| `.if(cond)`                       | 条件が `true` のときだけ、以降の操作を実行します。        |
| `.else()`                         | `.if()` の実行状態を反転します。                          |
| `.end()`                          | 条件分岐を終了し、以降の操作を実行状態に戻します。        |
| `.tap(callback)`                  | 各要素に任意の処理を実行します。                          |
| `.addClass(...classNames)`        | class を追加します。空白区切りや複数引数に対応します。    |
| `.removeClass(...classNames)`     | class を削除します。空白区切りや複数引数に対応します。    |
| `.toggleClass(className, force?)` | class の付け外しを切り替えます。                          |
| `.setStyle(property, value)`      | インラインスタイルを設定します。                          |
| `.removeStyle(property)`          | インラインスタイルを削除します。                          |
| `.setAttr(name, value)`           | 属性を設定します。                                        |
| `.removeAttr(name)`               | 属性を削除します。                                        |
| `.html(htmlString)`               | `innerHTML` を設定します。                                |
| `.text(textString)`               | `textContent` を設定します。                              |
| `.val(value)`                     | input / select / textarea などの `value` を設定します。   |
| `.append(...nodes)`               | 子要素または文字列を末尾に追加します。                    |
| `.prepend(...nodes)`              | 子要素または文字列を先頭に追加します。                    |
| `.before(...nodes)`               | 対象要素の直前に追加します。                              |
| `.after(...nodes)`                | 対象要素の直後に追加します。                              |
| `.remove()`                       | 対象要素を DOM から削除し、チェーン内の要素を空にします。 |
| `.empty()`                        | 対象要素の中身を空にします。                              |

---

## 📄 ライセンス

MIT  
© 2026 mountain-bell

---

## 👤 作者

Created by
[mountain-bell](https://github.com/mountain-bell) (a.k.a. MB)
