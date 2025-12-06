# HelloWorld

**HelloWorld は、国ごとの「Hello, World!」とタイムゾーン情報を返す軽量ライブラリです。**

- 国を指定するだけで、その国の挨拶・タイムゾーン・日時が取得できる
- 国別のローカライズ済み「Hello, World!」が楽しめる

**小さくて直感的、そして楽しい。
世界の “Hello, World!” をもっと気軽に扱えるようになります。**

---

## ✨ 特徴

- 🌍 **国ごとに異なる「Hello, World!」を返す**
- 🕒 **タイムゾーン・日付・時差（オフセット）も取得可能**
- ⚡ **ツリーシェイキング対応（named import が軽い）**
- 🧼 **依存ゼロ・とても軽量**

---

## 🧩 インストール

```bash
npm install @mountain-bell/hello-world
```

---

## 🚀 基本の使い方

### 1. Default Import

```ts
import HelloWorld from "@mountain-bell/hello-world";

const info = HelloWorld.get("japan");

console.log(info.greet); // "こんにちは、世界！"
console.log(info.timeZone); // "Asia/Tokyo"
console.log(info.date); // 現在日時（Tokyo）
console.log(info.offsetHours); // 時差
```

---

### 2. Named Import

```ts
import { getGreet, getTimeZone } from "@mountain-bell/hello-world";

getGreet("france");
// => "Bonjour, le monde !"

getTimeZone("usa");
// => "America/New_York"
```

---

## 🌍 対応している主要国

| 国               | LocationType   | 挨拶                |
| ---------------- | -------------- | ------------------- |
| 日本             | `japan`        | こんにちは、世界！  |
| 韓国             | `korea`        | 안녕하세요, 세계!   |
| 中国             | `china`        | 你好，世界！        |
| 台湾             | `taiwan`       | 哈囉，世界！        |
| 香港             | `hong_kong`    | 你好，世界！        |
| シンガポール     | `singapore`    | Hello, world!       |
| インド           | `india`        | Hello, world!       |
| 英国             | `uk`           | Hello, world!       |
| フランス         | `france`       | Bonjour, le monde ! |
| ドイツ           | `germany`      | Hallo, Welt!        |
| スペイン         | `spain`        | ¡Hola, mundo!       |
| イタリア         | `italy`        | Ciao, mondo!        |
| オランダ         | `netherlands`  | Hallo, wereld!      |
| スウェーデン     | `sweden`       | Hej, världen!       |
| アメリカ         | `usa`          | Hello, world!       |
| カナダ           | `canada`       | Hello, world!       |
| メキシコ         | `mexico`       | ¡Hola, mundo!       |
| ブラジル         | `brazil`       | Olá, mundo!         |
| アルゼンチン     | `argentina`    | ¡Hola, mundo!       |
| オーストラリア   | `australia`    | Hello, world!       |
| ニュージーランド | `new_zealand`  | Hello, world!       |
| 南アフリカ       | `south_africa` | Hello, world!       |

※ 全世界分を網羅しておらず、一部の国のみ対応しています。少し不完全ですが、楽しんでいただけたら嬉しいです。

---

## 🛠️ API

### `HelloWorld.get(location?)`

挨拶・タイムゾーン・日付・時差（offsetHours）をまとめて返します。

```ts
HelloWorld.get("spain");
```

---

### `getGreet(location?)`

国の挨拶文を取得。

```ts
getGreet("germany"); // "Hallo, Welt!"
```

---

### `getTimeZone(location?)`

タイムゾーンを取得。

---

### `getDate(location?)`

指定国の現在日時を取得。

---

### `getOffsetHours(location?)`

ローカルとの時差を取得。

---

## ℹ️ location の省略について

HelloWorld の各 API は、`location` を省略した場合や `"local"` を指定した場合、  
**現在の端末（ローカル環境）のタイムゾーンと日時を基準にした情報を返します。**

例：

```ts
get(); // get("local") と同じ
getGreet(); // ローカルの言語に依存せず "Hello, World!"（local のデフォルト）
getTimeZone(); // ローカルの TimeZone
getDate(); // ローカルの Date
getOffsetHours(); // 0
```

---

## 📄 ライセンス

MIT
© 2025 mountain-bell

---

## 👤 作者

Created by
[mountain-bell](https://github.com/mountain-bell) (a.k.a. MB)
