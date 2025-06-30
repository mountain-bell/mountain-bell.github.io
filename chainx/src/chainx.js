// chainx.js
// モダン時代のチェーン型JavaScriptユーティリティライブラリ
// 配列・オブジェクト・非同期処理は非破壊的に、DOMは直感的に操作できる統一チェーンインターフェース
// jQueryライクなDOM操作、状態保存、エラー処理、型判定、アニメーション、非同期制御まで対応
// プラグインによる拡張や、柔軟で安全なデータ変換・UI連携にも適した設計

class ChainX {
	constructor(value, { deep = false, record = false } = {}) {
		this._value = deep ? this._cloneDeep(value) : this._clone(value);
		this._initial = deep ? this._cloneDeep(value) : this._clone(value);
		this._recordedSteps = [];
		this._recording = record;
		this._queue = [];
		this._dequeueing = false;
		this._error = null;
		this._saveStates = {};
	}

	// 🔹🔹🔹 内部ユーティリティ 🔹🔹🔹

	_clone(value) {
		if (Array.isArray(value)) return [...value];
		if (typeof value === "object" && value !== null) return { ...value };
		return value;
	}

	_cloneDeep(value) {
		if (Array.isArray(value)) return value.map((v) => this._cloneDeep(v));
		if (value && typeof value === "object")
			return Object.fromEntries(
				Object.entries(value).map(([k, v]) => [k, this._cloneDeep(v)])
			);
		return value;
	}

	_record(method, args) {
		if (this._recording) {
			this._recordedSteps.push([method, args]);
		}
	}

	_normalizePattern(pattern, { global = false } = {}) {
		if (pattern instanceof RegExp) {
			if (global && !pattern.flags.includes("g")) {
				return new RegExp(pattern.source, pattern.flags + "g");
			}
			return pattern;
		}
		const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		return new RegExp(escaped, global ? "g" : "");
	}

	_applyToElements(fn) {
		if (this._value instanceof Element) {
			fn(this._value);
		} else if (
			this._value instanceof NodeList ||
			(Array.isArray(this._value) &&
				this._value.every((el) => el instanceof Element))
		) {
			const len = this._value.length;
			for (let i = 0; i < len; i++) fn(this._value[i]);
		}
		return this;
	}

	_mapElements(fn) {
		if (this._value instanceof Element) return fn(this._value);
		if (
			this._value instanceof NodeList ||
			(Array.isArray(this._value) &&
				this._value.every((el) => el instanceof Element))
		) {
			return Array.from(this._value)
				.filter((el) => el instanceof Element)
				.map(fn);
		}
		return null;
	}

	_saveDelegatedHandler(el, event, originalHandler, delegatedHandler) {
		if (!this._delegatedHandlers) {
			this._delegatedHandlers = new WeakMap();
		}
		if (!this._delegatedHandlers.has(el)) {
			this._delegatedHandlers.set(el, {});
		}
		const handlers = this._delegatedHandlers.get(el);
		handlers[event] = handlers[event] || new Map();
		handlers[event].set(originalHandler, delegatedHandler);
	}

	_getDelegatedHandler(el, event, originalHandler) {
		if (!this._delegatedHandlers || !this._delegatedHandlers.has(el))
			return null;
		const handlers = this._delegatedHandlers.get(el);
		if (!handlers[event]) return null;
		return handlers[event].get(originalHandler) || null;
	}

	_removeDelegatedHandler(el, event, originalHandler) {
		if (!this._delegatedHandlers || !this._delegatedHandlers.has(el)) return;
		const handlers = this._delegatedHandlers.get(el);
		if (handlers[event]) {
			handlers[event].delete(originalHandler);
			if (handlers[event].size === 0) {
				delete handlers[event];
			}
		}
	}

	_dequeue() {
		if (this._queue.length === 0 || this._dequeueing) return;
		this._dequeueing = true;
		const next = this._queue.shift();
		if (typeof next === "function") {
			Promise.resolve(next()).then(() => {
				this._dequeueing = false;
				this._dequeue();
			});
		} else {
			this._dequeueing = false;
		}
	}

	_addAnimateClassInternal(el, className, duration, easing) {
		return new Promise((resolve) => {
			el.style.transitionDuration = `${duration}ms`;
			el.style.transitionTimingFunction = easing;

			if (!el.classList.contains(className)) {
				el.classList.add(className);
				requestAnimationFrame(() => {
					el.classList.add(`${className}-active`);
				});
			}
			setTimeout(resolve, duration);
		});
	}

	_removeAnimateClassInternal(el, className, duration, easing) {
		return new Promise((resolve) => {
			el.style.transitionDuration = `${duration}ms`;
			el.style.transitionTimingFunction = easing;

			el.classList.remove(`${className}-active`);
			setTimeout(() => {
				el.classList.remove(className);
				resolve();
			}, duration);
		});
	}

	// 🔹🔹🔹 基本操作 🔹🔹🔹

	value() {
		return this._clone(this._value);
	}

	clone() {
		return new ChainX(this._clone(this._value));
	}

	cloneDeep() {
		return new ChainX(this._cloneDeep(this._value));
	}

	reset() {
		this._record("reset", []);
		this._value = this._clone(this._initial);
		return this;
	}

	clear() {
		this._record("clear", []);
		this._value = null;
		return this;
	}

	log(label = "ChainX") {
		this._record("log", [label]);
		console.log(`[${label}]`, this._value);
		return this;
	}

	// 🔹🔹🔹 型変換・型判定 🔹🔹🔹

	toBoolean() {
		this._record("toBoolean", []);
		const v = this._value;
		if (v !== undefined) this._value = Boolean(v);
		return this;
	}

	toNumber() {
		this._record("toNumber", []);
		const v = this._value;
		if (v !== undefined) this._value = Number(v);
		return this;
	}

	toString() {
		this._record("toString", []);
		const v = this._value;
		if (v !== undefined) this._value = String(v);
		return this;
	}

	toJSON() {
		this._record("toJSON", []);
		const v = this._value;
		if (v !== undefined) this._value = JSON.stringify(v);
		return this;
	}

	toArray() {
		this._record("toArray", []);
		const v = this._value;
		if (Array.isArray(v)) {
		} else if (v instanceof NodeList) {
			this._value = Array.from(v);
		} else if (v !== undefined) {
			this._value = [v];
		}
		return this;
	}

	toObject() {
		this._record("toObject", []);
		const v = this._value;
		if (v && typeof v === "object" && !Array.isArray(v)) {
			return this;
		}
		if (Array.isArray(v)) {
			try {
				this._value = Object.fromEntries(v);
			} catch {
				this._value = Object.fromEntries(
					v.map((item, i) => [`item${i}`, item])
				);
			}
		} else if (v !== undefined) {
			this._value = { value: v };
		}
		return this;
	}

	toMap() {
		this._record("toMap", []);
		const v = this._value;
		if (v instanceof Map) {
		} else if (Array.isArray(v)) {
			try {
				this._value = new Map(v);
			} catch {
				this._value = new Map(v.map((item, i) => [`item${i}`, item]));
			}
		} else if (v && typeof v === "object") {
			this._value = new Map(Object.entries(v));
		} else if (v !== undefined) {
			this._value = new Map([["value", v]]);
		}
		return this;
	}

	pickType() {
		this._record("pickType", []);
		const v = this._value;
		if (v !== undefined)
			this._value = Object.prototype.toString
				.call(v)
				.slice(8, -1)
				.toLowerCase();
		return this;
	}

	isNull() {
		this._record("isNull", []);
		const v = this._value;
		if (v !== undefined) this._value = v === null;
		return this;
	}

	isUndefined() {
		this._record("isUndefined", []);
		const v = this._value;
		if (v !== undefined) this._value = v === undefined;
		return this;
	}

	isBoolean() {
		this._record("isBoolean", []);
		const v = this._value;
		if (v !== undefined) this._value = typeof v === "boolean";
		return this;
	}

	isNumber() {
		this._record("isNumber", []);
		const v = this._value;
		if (v !== undefined) this._value = typeof v === "number";
		return this;
	}

	isString() {
		this._record("isString", []);
		const v = this._value;
		if (v !== undefined) this._value = typeof v === "string";
		return this;
	}

	isArray() {
		this._record("isArray", []);
		const v = this._value;
		if (v !== undefined) this._value = Array.isArray(v);
		return this;
	}

	isObject() {
		this._record("isObject", []);
		const v = this._value;
		if (v !== undefined)
			this._value = v !== null && typeof v === "object" && !Array.isArray(v);
		return this;
	}

	isElement() {
		this._record("isElement", []);
		const v = this._value;
		if (v !== undefined)
			this._value = typeof Element !== "undefined" && v instanceof Element;
		return this;
	}

	isFunction() {
		this._record("isFunction", []);
		const v = this._value;
		if (v !== undefined) this._value = typeof v === "function";
		return this;
	}

	isPromise() {
		this._record("isPromise", []);
		const v = this._value;
		if (v !== undefined)
			this._value =
				v !== null && typeof v === "object" && typeof v.then === "function";
		return this;
	}

	// 🔹🔹🔹 Number操作 🔹🔹🔹

	abs() {
		this._record("abs", []);
		const v = this._value;
		if (typeof v === "number") this._value = Math.abs(v);
		return this;
	}

	round() {
		this._record("round", []);
		const v = this._value;
		if (typeof v === "number") this._value = Math.round(v);
		return this;
	}

	floor() {
		this._record("floor", []);
		const v = this._value;
		if (typeof v === "number") this._value = Math.floor(v);
		return this;
	}

	ceil() {
		this._record("ceil", []);
		const v = this._value;
		if (typeof v === "number") this._value = Math.ceil(v);
		return this;
	}

	sqrt() {
		this._record("sqrt", []);
		const v = this._value;
		if (typeof v === "number") this._value = Math.sqrt(v);
		return this;
	}

	pow(exponent) {
		this._record("pow", [exponent]);
		const v = this._value;
		if (typeof v === "number") this._value = Math.pow(v, exponent);
		return this;
	}

	clampMin(limit) {
		this._record("clampMin", [limit]);
		const v = this._value;
		if (typeof v === "number") this._value = Math.max(v, limit);
		return this;
	}

	clampMax(limit) {
		this._record("clampMax", [limit]);
		const v = this._value;
		if (typeof v === "number") this._value = Math.min(v, limit);
		return this;
	}

	clamp(min, max) {
		this._record("clamp", [min, max]);
		const v = this._value;
		if (typeof v === "number") this._value = Math.max(min, Math.min(v, max));
		return this;
	}

	mod(divisor) {
		this._record("mod", [divisor]);
		const v = this._value;
		if (typeof v === "number") this._value = v % divisor;
		return this;
	}

	percent(total = 100) {
		this._record("percent", [total]);
		const v = this._value;
		if (typeof v === "number") this._value = (v / total) * 100;
		return this;
	}

	// 🔹🔹🔹 String操作 🔹🔹🔹

	trim() {
		this._record("trim", []);
		const v = this._value;
		if (typeof v === "string") this._value = v.trim();
		return this;
	}

	lower() {
		this._record("lower", []);
		const v = this._value;
		if (typeof v === "string") this._value = v.toLowerCase();
		return this;
	}

	upper() {
		this._record("upper", []);
		const v = this._value;
		if (typeof v === "string") this._value = v.toUpperCase();
		return this;
	}

	capitalize() {
		this._record("capitalize", []);
		const v = this._value;
		if (typeof v === "string")
			this._value = v.charAt(0).toUpperCase() + v.slice(1);
		return this;
	}

	snakeToCamel() {
		this._record("snakeToCamel", []);
		const v = this._value;
		if (typeof v === "string")
			this._value = v.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
		return this;
	}

	camelToSnake() {
		this._record("camelToSnake", []);
		const v = this._value;
		if (typeof v === "string")
			this._value = v.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
		return this;
	}

	replace(search, replacement, options = { all: false }) {
		this._record("replace", [search, replacement, options]);
		const v = this._value;
		if (typeof v === "string") {
			const pattern = this._normalizePattern(search, { global: options.all });
			this._value = v.replace(pattern, replacement);
		}
		return this;
	}

	replaceAll(search, replacement) {
		return this.replace(search, replacement, { all: true });
	}

	padStart(length, fill = " ") {
		this._record("padStart", [length, fill]);
		const v = this._value;
		if (typeof v === "string") this._value = v.padStart(length, fill);
		return this;
	}

	padEnd(length, fill = " ") {
		this._record("padEnd", [length, fill]);
		const v = this._value;
		if (typeof v === "string") this._value = v.padEnd(length, fill);
		return this;
	}

	split(delimiter) {
		this._record("split", [delimiter]);
		const v = this._value;
		if (typeof v === "string") this._value = v.split(delimiter);
		return this;
	}

	match(pattern, options = { all: false }) {
		this._record("match", [pattern, options]);
		const v = this._value;
		if (typeof v === "string") {
			const normalized = this._normalizePattern(pattern, {
				global: options.all,
			});
			this._value = options.all
				? Array.from(v.matchAll(normalized))
				: v.match(normalized);
		}
		return this;
	}

	matchAll(pattern) {
		return this.match(pattern, { all: true });
	}

	test(pattern) {
		this._record("test", [pattern]);
		const v = this._value;
		if (typeof v === "string") {
			const normalized = this._normalizePattern(pattern);
			this._value = normalized.test(v);
		}
		return this;
	}

	includesWith(substr) {
		this._record("includesWith", [substr]);
		const v = this._value;
		if (typeof v === "string") this._value = v.includes(substr);
		return this;
	}

	startsWith(substr) {
		this._record("startsWith", [substr]);
		const v = this._value;
		if (typeof v === "string") this._value = v.startsWith(substr);
		return this;
	}

	endsWith(substr) {
		this._record("endsWith", [substr]);
		const v = this._value;
		if (typeof v === "string") this._value = v.endsWith(substr);
		return this;
	}

	// 🔹🔹🔹 配列操作 🔹🔹🔹

	push(...items) {
		this._record("push", [...items]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = [...v, ...items];
		return this;
	}

	pop() {
		this._record("pop", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) this._value = v.slice(0, -1);
		return this;
	}

	shift() {
		this._record("shift", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) this._value = v.slice(1);
		return this;
	}

	unshift(...items) {
		this._record("unshift", [...items]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = [...items, ...v];
		return this;
	}

	insert(index, ...items) {
		this._record("insert", [index, ...items]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const before = v.slice(0, index);
			const after = v.slice(index);
			this._value = [...before, ...items, ...after];
		}
		return this;
	}

	splice(start, deleteCount, ...items) {
		this._record("splice", [start, deleteCount, ...items]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const before = v.slice(0, start);
			const after = v.slice(start + deleteCount);
			this._value = [...before, ...items, ...after];
		}
		return this;
	}

	slice(start, end) {
		this._record("slice", [start, end]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = v.slice(start, end);
		return this;
	}

	take(n) {
		this._record("take", [n]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) this._value = v.slice(0, n);
		return this;
	}

	takeRight(n) {
		this._record("takeRight", [n]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) this._value = v.slice(-n);
		return this;
	}

	first() {
		this._record("first", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) this._value = v[0] || null;
		return this;
	}

	last() {
		this._record("last", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = v[v.length - 1] || null;
		return this;
	}

	sample() {
		this._record("sample", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const i = Math.floor(Math.random() * v.length);
			this._value = v[i];
		}
		return this;
	}

	sort(compareFn) {
		this._record("sort", [compareFn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			this._value = [...v].sort(compareFn);
		}
		return this;
	}

	sortBy(selector) {
		this._record("sortBy", [selector]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const get =
				typeof selector === "function" ? selector : (item) => item?.[selector];
			this._value = [...v].sort((a, b) => {
				const aVal = get(a);
				const bVal = get(b);
				return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
			});
		}
		return this;
	}

	sortByDesc(selector) {
		this._record("sortByDesc", [selector]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const get =
				typeof selector === "function" ? selector : (item) => item?.[selector];
			this._value = [...v].sort((a, b) => {
				const aVal = get(a);
				const bVal = get(b);
				return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
			});
		}
		return this;
	}

	reverse() {
		this._record("reverse", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = [...v].reverse();
		return this;
	}

	shuffle() {
		this._record("shuffle", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const arr = [...v];
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
			this._value = arr;
		}
		return this;
	}

	chunk(size) {
		this._record("chunk", [size]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			if (size <= 0) return;
			const chunks = [];
			for (let i = 0; i < v.length; i += size) {
				chunks.push(v.slice(i, i + size));
			}
			this._value = chunks;
		}
		return this;
	}

	flatten() {
		this._record("flatten", []);
		const v = this._value;
		if (Array.isArray(v)) this._value = v.flat(Infinity);
		return this;
	}

	zip(...arrays) {
		this._record("zip", [...arrays]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const minLength = Math.min(v.length, ...arrays.map((a) => a.length));
			this._value = Array.from({ length: minLength }, (_, i) => [
				v[i],
				...arrays.map((a) => a[i]),
			]);
		}
		return this;
	}

	compact() {
		this._record("compact", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = v.filter(Boolean);
		return this;
	}

	uniq() {
		this._record("uniq", []);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = Array.from(new Set(v));
		return this;
	}

	distinctBy(fn) {
		this._record("distinctBy", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const seen = new Set();
			this._value = v.filter((item) => {
				const key = fn(item);
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});
		}
		return this;
	}

	map(fn) {
		this._record("map", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) this._value = v.map(fn);
		return this;
	}

	mapToObject(fn) {
		this._record("mapToObject", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = Object.fromEntries(v.map(fn));
		return this;
	}

	pluck(key) {
		this._record("pluck", [key]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = v.map((item) =>
				item && typeof item === "object" ? item[key] : undefined
			);
		return this;
	}

	filter(fn) {
		this._record("filter", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) this._value = v.filter(fn);
		return this;
	}

	reject(fn) {
		this._record("reject", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = v.filter((item) => !fn(item));
		return this;
	}

	partition(fn) {
		this._record("partition", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const truthy = [],
				falsy = [];
			for (const item of v) {
				(fn(item) ? truthy : falsy).push(item);
			}
			this._value = [truthy, falsy];
		}
		return this;
	}

	groupBy(fn) {
		this._record("groupBy", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const grouped = {};
			for (const item of v) {
				const key = fn(item);
				if (!grouped[key]) grouped[key] = [];
				grouped[key].push(item);
			}
			this._value = grouped;
		}
		return this;
	}

	countBy(fn) {
		this._record("countBy", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const counts = {};
			for (const item of v) {
				const key = fn(item);
				counts[key] = (counts[key] || 0) + 1;
			}
			this._value = counts;
		}
		return this;
	}

	difference(otherArray) {
		this._record("difference", [otherArray]);
		const v = this._value;
		if (
			(v instanceof NodeList || Array.isArray(v)) &&
			(otherArray instanceof NodeList || Array.isArray(otherArray))
		) {
			const otherSet = new Set(Array.from(otherArray));
			this._value = Array.from(v).filter((x) => !otherSet.has(x));
		}
		return this;
	}

	intersection(otherArray) {
		this._record("intersection", [otherArray]);
		const v = this._value;
		if (
			(v instanceof NodeList || Array.isArray(v)) &&
			(otherArray instanceof NodeList || Array.isArray(otherArray))
		) {
			const targetSet = new Set(Array.from(otherArray));
			this._value = Array.from(v).filter((x) => targetSet.has(x));
		}
		return this;
	}

	union(...arrays) {
		this._record("union", [...arrays]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const all = [v, ...arrays].flat();
			this._value = [...new Set(all)];
		}
		return this;
	}

	find(fn) {
		this._record("find", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = Array.from(v).find(fn);
		return this;
	}

	findLast(fn) {
		this._record("findLast", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			const arr = Array.from(v);
			for (let i = arr.length - 1; i >= 0; i--) {
				if (fn(arr[i], i, arr)) {
					this._value = arr[i];
					return this;
				}
			}
			this._value = null;
		}
		return this;
	}

	findIndex(fn) {
		this._record("findIndex", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = Array.from(v).findIndex(fn);
		return this;
	}

	some(fn) {
		this._record("some", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v)) {
			this._value = Array.from(v).some(fn);
		}
		return this;
	}

	none(fn) {
		this._record("none", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = !Array.from(v).some(fn);
		return this;
	}

	every(fn) {
		this._record("every", [fn]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = Array.from(v).every(fn);
		return this;
	}

	includes(value) {
		this._record("includes", [value]);
		const v = this._value;
		if (v instanceof NodeList || Array.isArray(v))
			this._value = Array.from(v).includes(value);
		return this;
	}

	sum() {
		this._record("sum", []);
		const v = this._value;
		if (Array.isArray(v)) this._value = v.reduce((a, b) => a + b, 0);
		return this;
	}

	avg() {
		this._record("avg", []);
		const v = this._value;
		if (Array.isArray(v)) {
			const len = v.length;
			const sum = v.reduce((a, b) => a + b, 0);
			this._value = len ? sum / len : null;
		}
		return this;
	}

	min() {
		this._record("min", []);
		const v = this._value;
		if (Array.isArray(v)) this._value = Math.min(...v);
		return this;
	}

	max() {
		this._record("max", []);
		const v = this._value;
		if (Array.isArray(v)) this._value = Math.max(...v);
		return this;
	}

	median() {
		this._record("median", []);
		const v = this._value;
		if (Array.isArray(v)) {
			const sorted = [...v].sort((a, b) => a - b);
			const len = sorted.length;
			const mid = Math.floor(len / 2);
			this._value =
				len === 0
					? null
					: len % 2 === 0
					? (sorted[mid - 1] + sorted[mid]) / 2
					: sorted[mid];
		}
		return this;
	}

	join(delimiter = "") {
		this._record("join", [delimiter]);
		const v = this._value;
		if (Array.isArray(v)) {
			this._value = v.join(delimiter);
		}
		return this;
	}

	range(start, end) {
		this._record("range", [start, end]);
		const v = this._value;
		if (v !== undefined)
			this._value = Array.from(
				{ length: end - start + 1 },
				(_, i) => i + start
			);
		return this;
	}

	rangeMap(start, end, fn) {
		this._record("rangeMap", [start, end, fn]);
		const v = this._value;
		if (v !== undefined)
			this._value = Array.from({ length: end - start + 1 }, (_, i) =>
				fn(i + start)
			);
		return this;
	}

	// 🔹🔹🔹 オブジェクト操作 🔹🔹🔹

	defaults(defaultsObj) {
		this._record("defaults", [defaultsObj]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			this._value = { ...defaultsObj, ...this._value };
		}
		return this;
	}

	mergeDeep(source) {
		this._record("mergeDeep", [source]);
		const merge = (target, source) => {
			const result = { ...target };
			for (const key in source) {
				if (
					source[key] &&
					typeof source[key] === "object" &&
					!Array.isArray(source[key])
				) {
					result[key] = merge(result[key] || {}, source[key]);
				} else {
					result[key] = source[key];
				}
			}
			return result;
		};
		if (typeof this._value === "object" && this._value !== null) {
			this._value = merge(this._clone(this._value), source);
		}
		return this;
	}

	pick(keys) {
		this._record("pick", [keys]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			this._value = keys.reduce((obj, key) => {
				if (key in this._value) obj[key] = this._value[key];
				return obj;
			}, {});
		}
		return this;
	}

	omit(keys) {
		this._record("omit", [keys]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			this._value = Object.keys(this._value).reduce((obj, key) => {
				if (!keys.includes(key)) obj[key] = this._value[key];
				return obj;
			}, {});
		}
		return this;
	}

	deepOmit(keysToOmit = []) {
		this._record("deepOmit", [keysToOmit]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			const omitDeep = (obj) => {
				if (typeof obj !== "object" || obj === null) return obj;
				const newObj = {};
				for (const [key, value] of Object.entries(obj)) {
					if (!keysToOmit.includes(key)) {
						newObj[key] = omitDeep(value);
					}
				}
				return newObj;
			};
			this._value = omitDeep(this._value);
		}
		return this;
	}

	renameKeys(mapping) {
		this._record("renameKeys", [mapping]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			const result = {};
			for (const [k, v] of Object.entries(this._value)) {
				result[mapping[k] || k] = v;
			}
			this._value = result;
		}
		return this;
	}

	invert() {
		this._record("invert", []);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			const inverted = {};
			for (const [key, value] of Object.entries(this._value)) {
				inverted[value] = key;
			}
			this._value = inverted;
		}
		return this;
	}

	mapObject(fn) {
		this._record("mapObject", [fn]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			const result = {};
			for (const [key, val] of Object.entries(this._value)) {
				const [newKey, newVal] = fn(key, val);
				result[newKey] = newVal;
			}
			this._value = result;
		}
		return this;
	}

	filterObject(fn) {
		this._record("filterObject", [fn]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			const result = {};
			for (const [key, val] of Object.entries(this._value)) {
				if (fn(key, val)) result[key] = val;
			}
			this._value = result;
		}
		return this;
	}

	flattenObject(separator = ".") {
		this._record("flattenObject", [separator]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			const flatten = (obj, prefix = "", res = {}) => {
				for (const [key, value] of Object.entries(obj)) {
					const newKey = prefix ? `${prefix}${separator}${key}` : key;
					if (
						typeof value === "object" &&
						value !== null &&
						!Array.isArray(value)
					) {
						flatten(value, newKey, res);
					} else {
						res[newKey] = value;
					}
				}
				return res;
			};
			this._value = flatten(this._value);
		}
		return this;
	}

	expandObject(separator = ".") {
		this._record("expandObject", [separator]);
		if (
			typeof this._value === "object" &&
			this._value !== null &&
			!Array.isArray(this._value)
		) {
			const expanded = {};
			for (const [path, value] of Object.entries(this._value)) {
				const keys = path.split(separator);
				let curr = expanded;
				while (keys.length > 1) {
					const key = keys.shift();
					if (!curr[key]) curr[key] = {};
					curr = curr[key];
				}
				curr[keys[0]] = value;
			}
			this._value = expanded;
		}
		return this;
	}

	// 🔹🔹🔹 DOM：スタイル・属性操作 🔹🔹🔹

	addClass(className) {
		this._record("addClass", [className]);
		return this._applyToElements((el) => el.classList.add(className));
	}

	removeClass(className) {
		this._record("removeClass", [className]);
		return this._applyToElements((el) => el.classList.remove(className));
	}

	toggleClass(className) {
		this._record("toggleClass", [className]);
		return this._applyToElements((el) => el.classList.toggle(className));
	}

	addClassIf(cond, className) {
		this._record("addClassIf", [cond, className]);
		if (this._value !== undefined && cond) {
			this._applyToElements((el) => el.classList.add(className));
		}
		return this;
	}

	removeClassIf(cond, className) {
		this._record("removeClassIf", [cond, className]);
		if (this._value !== undefined && cond) {
			this._applyToElements((el) => el.classList.remove(className));
		}
		return this;
	}

	toggleClassIf(cond, className) {
		this._record("toggleClassIf", [cond, className]);
		if (this._value !== undefined && cond) {
			this._applyToElements((el) => el.classList.toggle(className));
		}
		return this;
	}

	text(content) {
		this._record("text", [content]);
		this._applyToElements((el) => (el.textContent = content));
		return this;
	}

	getText() {
		return this._value instanceof Element ? this._value.textContent : "";
	}

	html(content) {
		this._record("html", [content]);
		this._applyToElements((el) => (el.innerHTML = content));
		return this;
	}

	getHtml() {
		return this._value instanceof Element ? this._value.innerHTML : "";
	}

	val(value) {
		this._record("val", [value]);
		if (value !== undefined) {
			this._applyToElements((el) => {
				if ("value" in el) el.value = value;
			});
		}
		return this;
	}

	getVal() {
		if (this._value instanceof Element && "value" in this._value) {
			return this._value.value;
		}
		return "";
	}

	attr(name, value) {
		this._record("attr", [name, value]);
		this._applyToElements((el) => el.setAttribute(name, value));
		return this;
	}

	attrs(attrs) {
		this._record("attrs", [attrs]);
		return this._applyToElements((el) => {
			for (const [k, v] of Object.entries(attrs)) {
				el.setAttribute(k, v);
			}
		});
	}

	getAttr(name) {
		if (this._value instanceof Element) {
			return this._value.getAttribute(name);
		}
		return null;
	}

	prop(name, value) {
		this._record("prop", [name, value]);
		this._applyToElements((el) => {
			el[name] = value;
		});
		return this;
	}

	getProp(name) {
		if (this._value instanceof Element) {
			return this._value[name];
		}
		return undefined;
	}

	css(styles) {
		this._record("css", [styles]);
		return this._applyToElements((el) => {
			for (const [k, v] of Object.entries(styles)) {
				el.style[k] = v;
			}
		});
	}

	// 🔹🔹🔹 DOM：イベント操作 🔹🔹🔹

	on(events, handler) {
		this._record("on", [events, handler]);
		return this._applyToElements((el) => {
			const eventList = events.split(" ");
			for (const event of eventList) {
				el.addEventListener(event, handler);
			}
		});
	}

	onMatch(events, selector, handler) {
		this._record("onMatch", [events, selector, handler]);
		return this._applyToElements((el) => {
			const eventList = events.split(" ");
			for (const event of eventList) {
				const delegatedHandler = (e) => {
					if (e.target && e.target.closest(selector)) {
						handler.call(e.target, e);
					}
				};
				el.addEventListener(event, delegatedHandler);
				this._saveDelegatedHandler(el, event, handler, delegatedHandler);
			}
		});
	}

	off(events, handler) {
		this._record("off", [events, handler]);
		return this._applyToElements((el) => {
			const eventList = events.split(" ");
			for (const event of eventList) {
				el.removeEventListener(event, handler);
			}
		});
	}

	offMatch(events, selector, handler) {
		this._record("offMatch", [events, selector, handler]);
		return this._applyToElements((el) => {
			const eventList = events.split(" ");
			for (const event of eventList) {
				const delegatedHandler = this._getDelegatedHandler(el, event, handler);
				if (delegatedHandler) {
					el.removeEventListener(event, delegatedHandler);
					this._removeDelegatedHandler(el, event, handler);
				}
			}
		});
	}

	onHover(enterFn, leaveFn) {
		this._record("onHover", [enterFn, leaveFn]);
		return this._applyToElements((el) => {
			el.addEventListener("mouseenter", enterFn);
			el.addEventListener("mouseleave", leaveFn);
		});
	}

	onScroll(fn) {
		this._record("onScroll", [fn]);
		return this._applyToElements((el) => {
			window.addEventListener("scroll", () => fn(el));
		});
	}

	// 🔹🔹🔹 DOM：表示・状態切り替え操作 🔹🔹🔹

	show() {
		this._record("show", []);
		return this._applyToElements((el) => (el.style.display = ""));
	}

	hide() {
		this._record("hide", []);
		return this._applyToElements((el) => (el.style.display = "none"));
	}

	toggle() {
		this._record("toggle", []);
		return this._applyToElements((el) => {
			const curr = window.getComputedStyle(el).display;
			el.style.display = curr === "none" ? "" : "none";
		});
	}

	remove() {
		this._record("remove", []);
		return this._applyToElements((el) => el.remove());
	}

	// 🔹🔹🔹 DOM：構造操作 🔹🔹🔹

	appendTo(target) {
		this._record("appendTo", [target]);
		const parent =
			target instanceof Element ? target : document.querySelector(target);
		return this._applyToElements((el) =>
			parent.appendChild(el.cloneNode(true))
		);
	}

	prependTo(target) {
		this._record("prependTo", [target]);
		const parent =
			target instanceof Element ? target : document.querySelector(target);
		return this._applyToElements((el) =>
			parent.insertBefore(el.cloneNode(true), parent.firstChild)
		);
	}

	find(selector) {
		this._record("find", [selector]);
		if (this._value instanceof Element) {
			this._value = this._value.querySelectorAll(selector);
		}
		return this;
	}

	parent() {
		this._record("parent", []);
		if (this._value instanceof Element) {
			this._value = this._value.parentElement;
		}
		return this;
	}

	children() {
		this._record("children", []);
		if (this._value instanceof Element) {
			this._value = Array.from(this._value.children);
		}
		return this;
	}

	closest(selector) {
		this._record("closest", [selector]);
		if (this._value instanceof Element) {
			this._value = this._value.closest(selector);
		}
		return this;
	}

	// 🔹🔹🔹 DOM：スクロール操作 🔹🔹🔹

	scrollTo(x, y) {
		this._record("scrollTo", [x, y]);
		this._applyToElements((el) => {
			el.scrollTo(x, y);
		});
		return this;
	}

	scrollLeft(x) {
		this._record("scrollLeft", [x]);
		this._applyToElements((el) => {
			el.scrollLeft = x;
		});
		return this;
	}

	getScrollLeft() {
		if (this._value instanceof Element) {
			return this._value.scrollLeft;
		} else if (this._value instanceof NodeList || Array.isArray(this._value)) {
			return this._value[0] instanceof Element ? this._value[0].scrollLeft : 0;
		} else {
			return 0;
		}
	}

	scrollTop(y) {
		this._record("scrollTop", [y]);
		this._applyToElements((el) => {
			el.scrollTop = y;
		});
		return this;
	}

	getScrollTop() {
		if (this._value instanceof Element) {
			return this._value.scrollTop;
		} else if (this._value instanceof NodeList || Array.isArray(this._value)) {
			return this._value[0] instanceof Element ? this._value[0].scrollTop : 0;
		} else {
			return 0;
		}
	}

	scrollIntoView(options = { behavior: "smooth", block: "start" }) {
		this._record("scrollIntoView", [options]);
		return this._applyToElements((el) => el.scrollIntoView(options));
	}

	// 🔹🔹🔹 DOM：アニメーション操作 🔹🔹🔹

	addAnimateClass(className, duration = 400, easing = "ease") {
		this._record("addAnimateClass", [className, duration, easing]);
		return this._applyToElements((el) => {
			this._queue.push(() =>
				this._addAnimateClassInternal(el, className, duration, easing)
			);
			this._dequeue();
		});
	}

	removeAnimateClass(className, duration = 400, easing = "ease") {
		this._record("removeAnimateClass", [className, duration, easing]);
		return this._applyToElements((el) => {
			this._queue.push(() =>
				this._removeAnimateClassInternal(el, className, duration, easing)
			);
			this._dequeue();
		});
	}

	toggleAnimateClass(className, duration = 400, easing = "ease") {
		this._record("toggleAnimateClass", [className, duration, easing]);
		return this._applyToElements((el) => {
			const hasClass = el.classList.contains(className);
			this._queue.push(() => {
				return hasClass
					? this._removeAnimateClassInternal(el, className, duration, easing)
					: this._addAnimateClassInternal(el, className, duration, easing);
			});
			this._dequeue();
		});
	}

	animate(styles, duration = 400, easing = "ease") {
		this._record("animate", [styles, duration, easing]);
		return this._applyToElements((el) => {
			this._queue.push(
				() =>
					new Promise((resolve) => {
						el.style.transition = Object.keys(styles)
							.map((key) => `${key} ${duration}ms ${easing}`)
							.join(", ");
						requestAnimationFrame(() => {
							for (const [key, value] of Object.entries(styles)) {
								el.style[key] = value;
							}
						});
						setTimeout(resolve, duration);
					})
			);
			this._dequeue();
		});
	}

	// 🔹🔹🔹 DOM：サイズ・位置取得 🔹🔹🔹

	exists() {
		if (this._value instanceof Element) {
			return document.body.contains(this._value);
		} else if (
			this._value instanceof NodeList ||
			(Array.isArray(this._value) &&
				this._value.every((el) => el instanceof Element))
		) {
			return Array.from(this._value).some((el) => document.body.contains(el));
		}
		return false;
	}

	getWidth() {
		return this._mapElements((el) => el.getBoundingClientRect().width);
	}

	getHeight() {
		return this._mapElements((el) => el.getBoundingClientRect().height);
	}

	getOffset() {
		return this._mapElements((el) => {
			const rect = el.getBoundingClientRect();
			return {
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX,
			};
		});
	}

	getPosition() {
		return this._mapElements((el) => {
			if (window.getComputedStyle(el).position === "fixed") {
				const rect = el.getBoundingClientRect();
				return { top: rect.top, left: rect.left };
			} else {
				const offsetParent = el.offsetParent || document.body;
				const elRect = el.getBoundingClientRect();
				const parentRect = offsetParent.getBoundingClientRect();
				return {
					top: elRect.top - parentRect.top,
					left: elRect.left - parentRect.left,
				};
			}
		});
	}

	// 🔹🔹🔹 チェーン制御 🔹🔹🔹

	tap(fn) {
		this._record("tap", [fn]);
		if (this._value !== undefined) {
			fn(this._value);
		}
		return this;
	}

	when(condFn, fn) {
		this._record("when", [condFn, fn]);
		if (this._value !== undefined && condFn(this._value)) {
			const result = fn(new ChainX(this._value));
			this._value = result instanceof ChainX ? result._value : result;
		}
		return this;
	}

	unless(condFn, fn) {
		this._record("unless", [condFn, fn]);
		if (this._value !== undefined && !condFn(this._value)) {
			const result = fn(new ChainX(this._value));
			this._value = result instanceof ChainX ? result._value : result;
		}
		return this;
	}

	branch(condFn, thenFn, elseFn) {
		this._record("branch", [condFn, thenFn, elseFn]);
		if (this._value !== undefined) {
			const path = condFn(this._value) ? thenFn : elseFn;
			const result = path(new ChainX(this._value));
			this._value = result instanceof ChainX ? result._value : result;
		}
		return this;
	}

	pipe(...fns) {
		this._record("pipe", [...fns]);
		if (this._value !== undefined) {
			this._value = fns.reduce((val, fn) => fn(val), this._value);
		}
		return this;
	}

	throwIf(condFn, message = "Validation failed") {
		this._record("throwIf", [condFn, message]);
		if (this._value !== undefined && condFn(this._value)) {
			throw new Error(message);
		}
		return this;
	}

	breakIf(condFn) {
		this._record("breakIf", [condFn]);
		if (this._value !== undefined && condFn(this._value)) {
			this._value = undefined;
		}
		return this;
	}

	// 🔹🔹🔹 エラー処理 🔹🔹🔹

	attempt(fn, onError = () => null) {
		this._record("attempt", [fn, onError]);
		if (this._value !== undefined) {
			this._error = null;
			try {
				const result = fn(this._value);
				if (result !== undefined) this._value = result;
			} catch (e) {
				this._error = e instanceof Error ? e : new Error(String(e));
				onError(this._error, this._value);
			}
		}
		return this;
	}

	onCatch(fn) {
		this._record("onCatch", [fn]);
		if (this._value !== undefined && this._error != null) {
			this._value = fn(this._value);
		}
		return this;
	}

	fallback(defaultValue) {
		this._record("fallback", [defaultValue]);
		if (this._value !== undefined && this._error != null) {
			this._value = defaultValue;
			this._error = null;
		}
		return this;
	}

	hasError() {
		return this._error != null;
	}

	getError() {
		return this._error;
	}

	getErrorMessage() {
		return this._error ? this._error.message : null;
	}

	clearError() {
		this._record("clearError", []);
		if (this._value !== undefined) {
			this._error = null;
		}
		return this;
	}

	retry(fn, times = 1) {
		this._record("retry", [fn, times]);
		if (this._value !== undefined) {
			let attempt = 0;
			this._error = null;
			while (attempt <= times) {
				try {
					this._value = fn(this._value);
					this._error = null;
					break;
				} catch (e) {
					this._error = e instanceof Error ? e : new Error(String(e));
					attempt++;
				}
			}
		}
		return this;
	}

	tryMap(fn, onError = () => null) {
		this._record("tryMap", [fn, onError]);
		if (Array.isArray(this._value)) {
			this._value = this._value.map((item) => {
				try {
					return fn(item);
				} catch (e) {
					const errorObj = e instanceof Error ? e : new Error(String(e));
					return onError(errorObj, item);
				}
			});
		}
		return this;
	}

	// 🔹🔹🔹 非同期処理 🔹🔹🔹

	tapAsync(fn) {
		this._record("tapAsync", [fn]);
		if (this._value !== undefined) {
			this._value = Promise.resolve(this._value).then(async (val) => {
				await fn(val);
				return val;
			});
		}
		return this;
	}

	tapAsyncIf(cond, fn) {
		this._record("tapAsyncIf", [cond, fn]);
		if (this._value !== undefined) {
			this._value = Promise.resolve(this._value).then((val) => {
				if (cond(val)) {
					return fn(val).then?.() ? fn(val) : Promise.resolve(fn(val));
				}
				return val;
			});
		}
		return this;
	}

	mapAsync(fn) {
		this._record("mapAsync", [fn]);
		if (Array.isArray(this._value)) {
			this._value = this._value.reduce((p, item) => {
				return p.then(async (acc) => {
					const res = await fn(item);
					return [...acc, res];
				});
			}, Promise.resolve([]));
		}
		return this;
	}

	mapLimitAsync(fn, limit = 3) {
		this._record("mapLimitAsync", [fn, limit]);
		if (Array.isArray(this._value)) {
			const arr = this._value;
			let i = 0;
			const results = [];
			const next = () => {
				if (i >= arr.length) return Promise.resolve();
				const index = i++;
				return Promise.resolve(fn(arr[index])).then((res) => {
					results[index] = res;
					return next();
				});
			};
			const runners = Array.from({ length: limit }, () => next());
			this._value = Promise.all(runners).then(() => results);
		}
		return this;
	}

	forEachAsync(fn) {
		this._record("forEachAsync", [fn]);
		if (Array.isArray(this._value)) {
			this._value = this._value.reduce((p, item) => {
				return p.then(() => fn(item));
			}, Promise.resolve());
		}
		return this;
	}

	pipeAsync(...fns) {
		this._record("pipeAsync", [...fns]);
		if (this._value !== undefined) {
			this._value = fns.reduce((p, fn) => {
				return Promise.resolve(p).then((val) => fn(val));
			}, Promise.resolve(this._value));
		}
		return this;
	}

	retryAsync(fn, times = 3, delay = 0) {
		this._record("retryAsync", [fn, times, delay]);
		if (this._value !== undefined) {
			let attempt = 0;
			const run = async () => {
				while (attempt <= times) {
					try {
						const val = await Promise.resolve(this._value);
						return await fn(val);
					} catch (e) {
						attempt++;
						if (attempt > times) throw e;
						if (delay > 0) await new Promise((r) => setTimeout(r, delay));
					}
				}
			};
			this._value = run();
		}
		return this;
	}

	retryTimeoutAsync(fn, timeoutMs, delay = 0) {
		this._record("retryTimeoutAsync", [fn, timeoutMs, delay]);
		if (this._value !== undefined) {
			const start = Date.now();
			const run = async () => {
				while (true) {
					try {
						const val = await Promise.resolve(this._value);
						return await fn(val);
					} catch (e) {
						if (Date.now() - start > timeoutMs)
							throw new Error("Timeout exceeded");
						if (delay > 0) await new Promise((r) => setTimeout(r, delay));
					}
				}
			};
			this._value = run();
		}
		return this;
	}

	timeout(ms) {
		this._record("timeout", [ms]);
		if (this._value instanceof Promise) {
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Timeout")), ms)
			);
			this._value = Promise.race([this._value, timeoutPromise]);
		}
		return this;
	}

	wait(ms) {
		this._record("wait", [ms]);
		if (this._value !== undefined) {
			this._value = new Promise((resolve) => {
				setTimeout(() => resolve(this._value), ms);
			});
		}
		return this;
	}

	catchAsync(handler) {
		this._record("catchAsync", [handler]);
		if (this._value instanceof Promise) {
			this._value = this._value.catch((err) => handler(err, this._value));
		}
		return this;
	}

	finallyAsync(handler) {
		this._record("finallyAsync", [handler]);
		if (this._value instanceof Promise) {
			this._value = this._value.finally(() => handler(this._value));
		}
		return this;
	}

	toPromise() {
		return Promise.resolve(this._value);
	}

	async resolve() {
		this._record("resolve", []);
		if (this._value instanceof Promise) {
			this._value = await this._value;
		}
		return this;
	}

	isPending() {
		return this._value instanceof Promise;
	}

	async isResolved() {
		try {
			const result = await Promise.resolve(this._value);
			return true;
		} catch {
			return false;
		}
	}

	async valueAsync() {
		if (this._value instanceof Promise) {
			return await this._value;
		}
		return this._value;
	}

	// 🔹🔹🔹 状態保存・復元 🔹🔹🔹

	saveState(name = "default") {
		this._record("saveState", [name]);
		if (this._value !== undefined) {
			this._saveStates[name] = this._clone(this._value);
		}
		return this;
	}

	restoreState(name = "default") {
		this._record("restoreState", [name]);
		if (this._value !== undefined && this._saveStates[name] !== undefined) {
			this._value = this._clone(this._saveStates[name]);
		}
		return this;
	}

	// 🔹🔹🔹 レシピ機能 🔹🔹🔹

	toRecipe() {
		const steps = [...this._recordedSteps];
		return (input) => {
			let inst = input instanceof ChainX ? input : $X(input);
			for (const [method, args] of steps) {
				if (typeof inst[method] === "function") {
					inst = inst[method](...args);
				}
			}
			return inst;
		};
	}

	applyRecipe(recipeFn) {
		if (typeof recipeFn === "function") {
			const result = recipeFn(this);
			if (result instanceof ChainX) {
				return result;
			}
		}
		return this;
	}

	// 🔹🔹🔹 プラグイン拡張 🔹🔹🔹

	static plugin(name, fn) {
		if (!this.prototype[name]) {
			this.prototype[name] = function (...args) {
				this._record(name, args);
				return fn.apply(this, args);
			};
		}
	}
}

function $X(input, options = {}) {
	if (typeof input === "string") {
		try {
			const result = document.querySelectorAll(input);
			if (result.length > 0) return new ChainX(Array.from(result), options);
		} catch (_) {}
	}
	return new ChainX(input, options);
}

$X.deep = function (value) {
	return new ChainX(value, { deep: true });
};

const $XD = $X.deep;

$X.record = function (value = undefined) {
	return new ChainX(value, { record: true });
};

const $XR = $X.record;

// 🔹 グローバル登録
if (typeof window !== "undefined") {
	window.ChainX = ChainX;
	window.$X = $X;
	window.$XD = $XD;
	window.$XR = $XR;
}

// 🔹 モジュールエクスポート（必要時にコメント解除）
// export { ChainX, $X };
