# ChainX 命名ガイドライン

ChainX は、DOM 操作・配列/オブジェクト処理・非同期制御・アニメーションなどをチェーン式で統一的に扱えるユーティリティライブラリです。  
このドキュメントは、ChainX のメソッド命名ルールとスタイルを体系化したガイドラインです。

---

## カテゴリ一覧

1. [DOM 操作系](#1-dom操作系)
2. [データ操作系](#2-データ操作系)
3. [型判定・変換系](#3-型判定変換系)
4. [非同期制御系](#4-非同期制御系)
5. [状態管理・エラー処理系](#5-状態管理エラー処理系)
6. [チェーン制御 / ユーティリティ系](#6-チェーン制御--ユーティリティ系)

---

## 1. DOM 操作系

### 概要

HTML 要素（Element, NodeList）を対象としたクラス操作、属性操作、イベント登録、アニメーションなどに関する命名カテゴリです。

### 命名ルール

- jQuery と同様の命名に準拠（慣れた書き方を尊重）
- getter/setter は明示的に分ける（例：`.val()` と `.getVal()`）

### 命名例

| 機能            | 命名例                                       |
| --------------- | -------------------------------------------- |
| クラス操作      | `addClass`, `removeClass`, `toggleClass`     |
| 値の操作        | `val`, `getVal`                              |
| テキスト操作    | `text`, `getText`, `html`, `getHtml`         |
| 属性/プロパティ | `attr`, `prop`                               |
| 表示切替        | `show`, `hide`, `toggle`                     |
| アニメ          | `fadeIn`, `slideUp`, `animate`, `typewriter` |
| DOM 階層        | `parent`, `children`, `closest`              |
| イベント        | `on`, `off`, `onHover`, `onScroll`           |

### 備考

DOM に関するメソッドは**破壊的（画面に直接作用）**であることが前提となっています。

---

## 2. データ操作系

### 概要

配列、オブジェクト、数値コレクションなどに対する変換・抽出・集約・構造変換を扱う命名カテゴリです。

### 命名ルール

- JavaScript の標準 API（Array/Object）や Lodash の命名に倣う
- オブジェクト操作には明示的な接尾語（`Object`）を付ける

### 命名例

| 機能             | 命名例                                     |
| ---------------- | ------------------------------------------ |
| 配列変換         | `map`, `filter`, `sort`, `uniq`, `compact` |
| オブジェクト変換 | `mapObject`, `filterObject`, `renameKeys`  |
| 集約             | `sum`, `avg`, `min`, `max`, `median`       |
| 分割構造         | `chunk`, `partition`, `groupBy`, `countBy` |
| 取り出し/除外    | `pick`, `omit`, `pluck`                    |
| クローン系       | `clone`, `cloneShallow`, `cloneDeep`       |

### 備考

全て**非破壊的（元の値を壊さず内部状態だけ更新）**です。副作用のないチェーンが可能です。

---

## 3. 型判定・変換系

### 概要

値の型を調べたり、別の型に変換したりするためのメソッド群です。

### 命名ルール

- 型判定：`isXxx`（例：`isArray`, `isString`）
- 型変換：`toXxx`（例：`toString`, `toBoolean`）

### 命名例

| 種類     | 命名例                                        |
| -------- | --------------------------------------------- |
| 型判定   | `isArray`, `isObject`, `isNull`, `isElement`  |
| 型変換   | `toString`, `toNumber`, `toBoolean`, `toJSON` |
| 特殊取得 | `type()`（Object.prototype.toString 風）      |

### 備考

`.isXxx()` 系は**チェーン途中の条件分岐やフィルタ処理に便利**です。

---

## 4. 非同期制御系

### 概要

Promise ベースの非同期処理を扱うメソッド群。API 通信や遅延処理、エラー補足など、チェーン内に非同期を組み込む用途に使います。

### 命名ルール

- 非同期処理を受け取る関数には `Async` を接尾語としてつける（例：`tapAsync`, `mapAsync`）
- タイマー系・補助系など補助的な非同期は `Async` を省略可（例：`wait`, `timeout`）

### 命名例

| 機能       | 命名例                                                 |
| ---------- | ------------------------------------------------------ |
| 中間処理   | `tapAsync`, `pipeAsync`                                |
| 並列処理   | `mapAsync`, `mapLimitAsync`, `forEachAsync`            |
| エラー処理 | `retryAsync`, `catchAsync`, `finallyAsync`, `fallback` |
| 補助機能   | `wait`, `timeout`, `await`, `toPromise`                |

### 備考

非同期関数のチェーンが読みやすくなり、**try/catch や `.then()` を使わず処理の流れが書けます**。

---

## 5. 状態管理・エラー処理系

### 概要

チェーン中に発生したエラーの扱いや、一時的な状態の保存・復元などを担うメソッド群です。

### 命名ルール

- 状態操作：`saveXxx`, `restoreXxx`, `reset`, `clearXxx`
- エラー処理：`safe`, `tapCatch`, `hasError`, `fallback`

### 命名例

| 機能       | 命名例                                        |
| ---------- | --------------------------------------------- |
| 状態管理   | `saveState`, `restoreState`, `reset`, `clone` |
| エラー検知 | `safe`, `hasError`, `clearError`              |
| エラー処理 | `tapCatch`, `catchOnly`, `fallback`           |

### 備考

エラー発生時の**代替処理・再実行・フォールバック**などが簡潔に記述できるのが特徴です。

---

## 6. チェーン制御 / ユーティリティ系

### 概要

処理の途中で条件分岐を入れたり、任意のロジックを挟んだりするユーティリティ群です。

### 命名ルール

- 中間挿入：`tap`, `pipe`
- 条件付き：`tapIf`, `breakIf`, `ensure`

### 命名例

| 機能     | 命名例                               |
| -------- | ------------------------------------ |
| 中間処理 | `tap`, `tapIf`, `pipe`               |
| 条件制御 | `breakIf`, `ensure`                  |
| クローン | `clone`, `cloneShallow`, `cloneDeep` |

### 備考

処理の「見通しを良くする」役割があり、**ロジックと状態を切り離して考えることができます**。

---

## 命名判断の基準まとめ

| 対象       | 命名パターン                              |
| ---------- | ----------------------------------------- |
| DOM        | jQuery 互換（`val`, `on`, `fadeIn` など） |
| データ     | ES / Lodash 準拠（`map`, `mergeDeep`）    |
| 型         | `isXxx`, `toXxx`, `type()`                |
| 非同期     | `Async`接尾語（補助系は省略可）           |
| 状態管理   | `save`, `reset`, `clear`, `fallback`      |
| 制御・補助 | `tap`, `pipe`, `breakIf`, `ensure`        |

---

ChainX の命名ポリシーは

> **「自然な言葉で、意図が読めて、チェーンが気持ちよく続くこと」** です。
