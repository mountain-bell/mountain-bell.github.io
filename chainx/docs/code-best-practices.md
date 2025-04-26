# code-best-practices.md

ChainX の、コードの書き方ベストプラクティス集です。  
読みやすさ、パフォーマンス、安全性、そして開発の美しさを守るためにこのガイドラインを適用します。

---

## ✅ ベストプラクティス一覧

### 1. $X(...) を毎回呼ばない。キャッシュして使いまわす

```js
// 推奨
const sections = $X(".section");

sections.fadeIn().scrollIntoView();
```

- 毎回インスタンス生成を防ぎ、パフォーマンス向上
- 変数に保持して再利用

---

### 2. データ操作では clone() を活用する

```js
const base = $X([1, 2, 3, 4]);

const even = base
	.clone()
	.filter((n) => n % 2 === 0)
	.value();
const odd = base
	.clone()
	.filter((n) => n % 2 !== 0)
	.value();
```

- 元データを壊さない
- 複数の分岐処理が安全に書ける

---

### 3. チェーンは基本、ひと呼吸で完結させる

```js
$X(list)
	.filter((item) => item.active)
	.map((item) => item.name)
	.uniq()
	.sort()
	.value();
```

- 目的ごとにチェーンを閉じて、リズムの良いコードにする

---

### 4. DOM 系とデータ系はインスタンスを分けて考える

```js
const data = $X([...]).filter(...).value();
const dom = $X(".item");

dom.text(data.join(", "));
```

- 役割ごとに明確に分離
- 意図のわかりやすいコードに

---

### 5. 長いチェーンには適度に tap() を挟む

```js
$X(data)
  .filter(...)
  .tap(v => console.log("After filter:", v))
  .map(...)
  .tap(v => console.log("After map:", v))
  .value();
```

- デバッグ時にも読みやすい
- tap() は副作用なしで安心

---

### 6. await するなら toPromise() を明示的に呼び出す

```js
await $X(items)
	.mapAsync(async (item) => await fetchData(item))
	.toPromise();
```

- Promise 化を明示して、非同期チェーンをきれいに閉じる

---

### 7. 使い終わったインスタンスは = null で参照を切る

```js
let sections = $X(".section");

sections.fadeIn();

// もう使わないなら参照を切る
sections = null;
```

- メモリリーク防止
- 長時間動くアプリでも健全なリソース管理ができる

---

## ✅ 最重要まとめ

| 原則                         | 理由                           |
| ---------------------------- | ------------------------------ |
| インスタンスをキャッシュする | パフォーマンス＆読みやすさ向上 |
| clone して分岐する           | 副作用防止                     |
| チェーンはひと呼吸で書く     | 流れの美しさ                   |
| データと DOM を混ぜない      | 責務分離                       |
| tap で途中観察する           | デバッグしやすい               |
| 非同期は toPromise で閉じる  | 明示的で安全な非同期処理       |
| 参照を切って解放する         | メモリ管理の健全化             |

---

**コードもまた、鐘の音のように、  
静かに、遠くまで、美しく響かせるもの。**

ChainX と mountain-bell のすべての作品に、  
このリズムを響かせていきましょう。
