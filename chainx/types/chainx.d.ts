// chainx.d.ts
// TypeScript support for ChainX: a modern, chainable utility library

declare class ChainX<T = any> {
	constructor(value: T);

	// 基本操作
	value(): T;
	clone(): ChainX<T>;
	reset(): this;
	clear(): this;
	log(label?: string): this;

	// 型変換
	toString(): string;
	toJSON(): string;
	toBoolean(): this;
	toNumber(): this;
	toStringValue(): this;

	// 型判定
	type(): ChainX<string>;
	isType(typeName: string): ChainX<boolean>;
	isArray(): ChainX<boolean>;
	isObject(): ChainX<boolean>;
	isString(): ChainX<boolean>;
	isNumber(): ChainX<boolean>;
	isBoolean(): ChainX<boolean>;
	isFunction(): ChainX<boolean>;
	isUndefined(): ChainX<boolean>;
	isNull(): ChainX<boolean>;
	isPromise(): ChainX<boolean>;
	isElement(): ChainX<boolean>;

	// 配列操作（代表的なもの）
	push(...items: any[]): this;
	pop(): this;
	slice(start: number, end?: number): this;
	first(): this;
	last(): this;
	take(n: number): this;
	takeRight(n: number): this;

	// DOM操作（代表的なもの）
	addClass(className: string): this;
	removeClass(className: string): this;
	toggleClass(className: string): this;
	attr(name: string, value: string): this;
	prop(name: string, value: any): this;
	val(value?: string): this;
	parent(): this;
	children(): this;
	closest(selector: string): this;
	find(selector: string): this;

	// チェーン制御
	tap(fn: (value: T) => void): this;
	pipe<U = any>(...fns: Array<(val: any) => any>): ChainX<U>;
	breakIf(fn: (value: T) => boolean): this;

	// エラー処理
	safe(fn: (val: T) => void, onError?: (e: any, val: T) => void): this;
	tapCatch(fn: (e: any, val: T) => void): this;
	catchOnly(fn: (e: any, val: T) => void): this;
	fallback(defaultValue: T): this;
	hasError(): boolean;
	clearError(): this;

	// プラグイン登録
	static plugin(name: string, fn: (...args: any[]) => any): void;
}

// セレクタまたはデータを受け取るユーティリティ関数
declare function $X<T = any>(input: T | string): ChainX<T>;

export { ChainX, $X };
