# 📘 ChainX API リファレンス（カテゴリ別）

以下は ChainX ライブラリの機能をカテゴリ別にまとめた一覧です。
簡単な説明とともに、使用例も含めて掲載しています。

---

## 🔹 基本操作

- `.value()`：現在の値を取得
- `.clone()`：現在の状態を複製（新しい ChainX インスタンスを返す）
- `.reset()`：初期状態にリセット
- `.clear()`：値を null に設定
- `.log(label)`：中間ログ出力（console）

```js
$X([1, 2, 3]).push(4).log("after push").value();
```

---

## 🔹 型変換・型判定

- `.toStringValue()` / `.toNumber()` / `.toBoolean()`：値を型変換
- `.type()`：型名を文字列で取得（例: 'array', 'object', ...）
- `.isArray()` / `.isObject()` / `.isString()` ...：型チェック系

```js
$X("123").toNumber().isNumber().log();
```

---

## 🔹 配列操作

- `.push(...items)` / `.pop()` / `.unshift(...items)` / `.shift()`
- `.splice(start, deleteCount, ...items)` / `.insert(index, ...items)`
- `.sort()` / `.reverse()`
- `.slice(start, end)` / `.first()` / `.last()`
- `.uniq()` / `.compact()` / `.shuffle()` / `.sample()`
- `.groupBy(fn)` / `.countBy(fn)` / `.reject(fn)` / `.partition(fn)`
- `.pluck(key)` / `.sortBy(keyOrFn)` / `.mapToObject(fn)`

```js
$X([1, 2, 3, 2]).uniq().log();
```

---

## 🔹 オブジェクト操作

- `.renameKeys(mapping)`：キーを変更
- `.defaults(obj)`：デフォルト値適用
- `.mergeDeep(source)`：深いマージ
- `.pick(keys)` / `.omit(keys)`：キーの抽出・除去
- `.mapObject(fn)` / `.filterObject(fn)`：オブジェクトのキーと値のマッピング・フィルター

```js
$X({ a: 1, b: 2 }).renameKeys({ a: "x" }).log();
```

---

## 🔹 DOM 操作（jQuery 風）

- `.addClass()`, `.removeClass()`, `.toggleClass()`
- `.text(str)`, `.html(str)`, `.val(val)`
- `.attr(name, val)`, `.prop(name, val)`
- `.fadeIn()`, `.fadeOut()`, `.fadeToggle()`
- `.slideUp()`, `.slideDown()`, `.slideToggle()`
- `.scrollReveal()`, `.typewriter(text)`
- `.on(event, handler)`, `.off()`, `.onHover()`, `.onScroll()`
- `.show()`, `.hide()`, `.toggle()`, `.remove()`

```js
$X("#box").addClass("visible").fadeIn();
```

---

## 🔹 非同期処理

- `.tapAsync(fn)`, `.mapAsync(fn)`, `.forEachAsync(fn)`
- `.pipeAsync(...fns)`, `.retryAsync(fn, times, delay)`
- `.timeout(ms)`, `.wait(ms)`, `.await()`, `.toPromise()`
- `.catchAsync(handler)`, `.finallyAsync(handler)`

```js
$X([1, 2, 3])
	.mapAsync(async (n) => n * 2)
	.tapAsync(console.log);
```

---

## 🔹 エラー処理

- `.safe(fn, onError?)`：try-catch ラップ
- `.tapCatch(fn)`, `.catchOnly(fn)`, `.fallback(default)`
- `.retry(fn, times)`, `.hasError()`, `.clearError()`

```js
$X([1, 2, 3])
	.safe((val) => {
		throw new Error("fail");
	})
	.fallback([])
	.log();
```

---

## 🔹 チェーン制御

- `.tap(fn)` / `.tapIf(conditionFn, tapFn)`：中間で処理を挟む
- `.pipe(...fns)`：関数合成
- `.breakIf(conditionFn)`：条件を満たしたらチェーン停止

```js
$X(10)
	.tap((n) => console.log("中間", n))
	.pipe((x) => x * 2)
	.log();
```

---

## 🔹 状態保存・復元

- `.saveState(name)`：現在の値を保存
- `.restoreState(name)`：保存した状態に戻す

```js
$X([1, 2, 3]).push(4).saveState("with4").reset().restoreState("with4").log();
```

---

## 🔹 レシピ作成・適用

- `.startRecipe()`：レシピ記録開始
- `.toRecipe()`：レシピ関数を作成
- `.applyRecipe(recipeFn)`：レシピを適用する

### レシピとは？

操作チェーンをあらかじめ記録し、  
**あとから別のインスタンスに再適用できる**仕組みです！

```js
// レシピを作成
const recipe = $X().startRecipe().push(4).uniq().toRecipe();

// 使い回しできる！
recipe($X([1, 2, 2, 3])).log(); // => [1,2,3,4]
recipe($X([5, 5, 6])).log(); // => [5,6,4]
```

---

### ⚠️ 非同期レシピ作成時の注意

レシピに `.tapAsync()`, `.pipeAsync()` など**非同期メソッドを含める場合**、  
以下 2 点に注意してください：

1. **レシピ適用後に `.toPromise()` で Promise として完了させる**
2. **レシピ適用時、`$X(Promise)` を渡してスタートする**

```js
// 非同期レシピ
const asyncRecipe = $X()
	.startRecipe()
	.tapAsync(async (v) => {
		await new Promise((r) => setTimeout(r, 100));
		console.log("tapAsync in recipe:", v);
		return v;
	})
	.pipeAsync(async (v) => {
		await new Promise((r) => setTimeout(r, 100));
		return v + "-done";
	})
	.toRecipe();

// ✅ Promiseを渡してからレシピ適用！
asyncRecipe($X(Promise.resolve("start")))
	.toPromise()
	.then((res) => console.log("Final result:", res));
```

> ℹ️ 非同期レシピでは、最初から Promise を `$X()` に渡すことで  
> tapAsync や pipeAsync などが正しく「待ち受け」できるようになります。

---

## 🔹 プラグイン拡張

- `ChainX.plugin(name, fn)`：独自メソッドを追加

```js
ChainX.plugin("double", function () {
	if (typeof this._value === "number") {
		this._value *= 2;
	}
	return this;
});

$X(5).double().log(); // => 10
```
