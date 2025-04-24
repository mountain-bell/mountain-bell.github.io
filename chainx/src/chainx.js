// chainx.js
// モダン時代のチェーン型JavaScriptユーティリティライブラリ
// 配列・オブジェクト・DOM・非同期処理を一貫して非破壊的に操作できるチェーンインターフェース
// jQueryライクなDOM操作、状態保存、エラー処理、型判定、アニメーション、非同期制御まで対応
// プラグインによる拡張や、柔軟で安全なデータ変換・UI連携にも適した設計

class ChainX {
	constructor(value) {
		this._value = value;
		this._initial = this._clone(value);
		this._queue = [];
	}

	_clone(value) {
		if (Array.isArray(value)) return [...value];
		if (typeof value === "object" && value !== null) return { ...value };
		return value;
	}

	value() {
		return this._clone(this._value);
	}

	clone() {
		return new ChainX(this._clone(this._value));
	}

	reset() {
		this._value = this._clone(this._initial);
		return this;
	}

	clear() {
		this._value = null;
		return this;
	}

	log(label = "ChainX") {
		console.log(`[${label}]`, this._value);
		return this;
	}

	// 型変換
	toString() {
		return String(this._value);
	}

	toJSON() {
		return JSON.stringify(this._value);
	}

	toBoolean() {
		this._value = Boolean(this._value);
		return this;
	}

	toNumber() {
		this._value = Number(this._value);
		return this;
	}

	toStringValue() {
		this._value = String(this._value);
		return this;
	}

	// 型判定ユーティリティ
	type() {
		const v = this._value;
		const t = Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
		this._value = t;
		return this;
	}

	isType(typeName) {
		const actual = Object.prototype.toString
			.call(this._value)
			.slice(8, -1)
			.toLowerCase();
		this._value = actual === typeName.toLowerCase();
		return this;
	}

	isArray() {
		this._value = Array.isArray(this._value);
		return this;
	}

	isObject() {
		this._value =
			this._value !== null &&
			typeof this._value === "object" &&
			!Array.isArray(this._value);
		return this;
	}

	isString() {
		this._value = typeof this._value === "string";
		return this;
	}

	isNumber() {
		this._value = typeof this._value === "number";
		return this;
	}

	isBoolean() {
		this._value = typeof this._value === "boolean";
		return this;
	}

	isFunction() {
		this._value = typeof this._value === "function";
		return this;
	}

	isUndefined() {
		this._value = typeof this._value === "undefined";
		return this;
	}

	isNull() {
		this._value = this._value === null;
		return this;
	}

	isPromise() {
		this._value = this._value instanceof Promise;
		return this;
	}

	isElement() {
		this._value =
			typeof Element !== "undefined" && this._value instanceof Element;
		return this;
	}

	//  オブジェクト操作
	cloneShallow() {
		if (Array.isArray(this._value)) {
			this._value = [...this._value];
		} else if (typeof this._value === "object" && this._value !== null) {
			this._value = { ...this._value };
		}
		return this;
	}

	deepClone() {
		const deepCloneHelper = (obj) => {
			if (Array.isArray(obj)) return obj.map(deepCloneHelper);
			if (obj && typeof obj === "object")
				return Object.fromEntries(
					Object.entries(obj).map(([k, v]) => [k, deepCloneHelper(v)])
				);
			return obj;
		};
		this._value = deepCloneHelper(this._value);
		return this;
	}

	renameKeys(mapping) {
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

	defaults(defaultsObj) {
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
		const merge = (target, source) => {
			for (const key in source) {
				if (
					source[key] &&
					typeof source[key] === "object" &&
					!Array.isArray(source[key])
				) {
					target[key] = merge(target[key] || {}, source[key]);
				} else {
					target[key] = source[key];
				}
			}
			return target;
		};
		if (typeof this._value === "object" && this._value !== null) {
			this._value = merge({ ...this._value }, source);
		}
		return this;
	}

	pick(keys) {
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

	mapObject(fn) {
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

	// 配列操作
	push(...items) {
		if (Array.isArray(this._value)) {
			this._value = [...this._value, ...items];
		}
		return this;
	}

	pop() {
		if (Array.isArray(this._value)) {
			this._value = this._value.slice(0, -1);
		}
		return this;
	}

	unshift(...items) {
		if (Array.isArray(this._value)) {
			this._value = [...items, ...this._value];
		}
		return this;
	}

	shift() {
		if (Array.isArray(this._value)) {
			this._value = this._value.slice(1);
		}
		return this;
	}

	splice(start, deleteCount, ...items) {
		if (Array.isArray(this._value)) {
			const before = this._value.slice(0, start);
			const after = this._value.slice(start + deleteCount);
			this._value = [...before, ...items, ...after];
		}
		return this;
	}

	insert(index, ...items) {
		if (Array.isArray(this._value)) {
			const before = this._value.slice(0, index);
			const after = this._value.slice(index);
			this._value = [...before, ...items, ...after];
		}
		return this;
	}

	sort(compareFn) {
		if (Array.isArray(this._value)) {
			this._value = [...this._value].sort(compareFn);
		}
		return this;
	}

	reverse() {
		if (Array.isArray(this._value)) {
			this._value = [...this._value].reverse();
		}
		return this;
	}

	filterMap(fn) {
		if (Array.isArray(this._value)) {
			this._value = this._value.map(fn).filter((v) => v != null);
		}
		return this;
	}

	reject(fn) {
		if (Array.isArray(this._value)) {
			this._value = this._value.filter((item) => !fn(item));
		}
		return this;
	}

	groupBy(fn) {
		if (Array.isArray(this._value)) {
			const grouped = {};
			for (const item of this._value) {
				const key = fn(item);
				if (!grouped[key]) grouped[key] = [];
				grouped[key].push(item);
			}
			this._value = grouped;
		}
		return this;
	}

	countBy(fn) {
		if (Array.isArray(this._value)) {
			const counts = {};
			for (const item of this._value) {
				const key = fn(item);
				counts[key] = (counts[key] || 0) + 1;
			}
			this._value = counts;
		}
		return this;
	}

	compact() {
		if (Array.isArray(this._value)) {
			this._value = this._value.filter(Boolean);
		}
		return this;
	}

	uniq() {
		if (Array.isArray(this._value))
			this._value = Array.from(new Set(this._value));
		return this;
	}

	shuffle() {
		if (Array.isArray(this._value)) {
			const arr = [...this._value];
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
			this._value = arr;
		}
		return this;
	}

	sample() {
		if (Array.isArray(this._value)) {
			const i = Math.floor(Math.random() * this._value.length);
			this._value = this._value[i];
		}
		return this;
	}

	chunk(size) {
		if (Array.isArray(this._value) && size > 0) {
			const chunks = [];
			for (let i = 0; i < this._value.length; i += size) {
				chunks.push(this._value.slice(i, i + size));
			}
			this._value = chunks;
		}
		return this;
	}

	partition(fn) {
		if (Array.isArray(this._value)) {
			const truthy = [],
				falsy = [];
			for (const item of this._value) {
				(fn(item) ? truthy : falsy).push(item);
			}
			this._value = [truthy, falsy];
		}
		return this;
	}

	take(n) {
		if (Array.isArray(this._value)) this._value = this._value.slice(0, n);
		return this;
	}

	takeRight(n) {
		if (Array.isArray(this._value)) this._value = this._value.slice(-n);
		return this;
	}

	slice(start, end) {
		if (Array.isArray(this._value)) {
			this._value = this._value.slice(start, end);
		}
		return this;
	}

	first() {
		if (this._value instanceof NodeList || Array.isArray(this._value)) {
			this._value = this._value[0] || null;
		}
		return this;
	}

	last() {
		if (this._value instanceof NodeList || Array.isArray(this._value)) {
			this._value = this._value[this._value.length - 1] || null;
		}
		return this;
	}

	zip(...arrays) {
		if (Array.isArray(this._value)) {
			const minLength = Math.min(
				this._value.length,
				...arrays.map((a) => a.length)
			);
			this._value = Array.from({ length: minLength }, (_, i) => [
				this._value[i],
				...arrays.map((a) => a[i]),
			]);
		}
		return this;
	}

	difference(otherArray) {
		if (Array.isArray(this._value) && Array.isArray(otherArray)) {
			this._value = this._value.filter((x) => !otherArray.includes(x));
		}
		return this;
	}

	intersection(otherArray) {
		if (Array.isArray(this._value) && Array.isArray(otherArray)) {
			this._value = this._value.filter((x) => otherArray.includes(x));
		}
		return this;
	}

	sum() {
		if (Array.isArray(this._value)) {
			this._value = this._value.reduce((a, b) => a + b, 0);
		}
		return this;
	}

	avg() {
		if (Array.isArray(this._value) && this._value.length > 0) {
			const sum = this._value.reduce((a, b) => a + b, 0);
			this._value = sum / this._value.length;
		} else {
			this._value = null;
		}
		return this;
	}

	min() {
		if (Array.isArray(this._value)) {
			this._value = Math.min(...this._value);
		}
		return this;
	}

	max() {
		if (Array.isArray(this._value)) {
			this._value = Math.max(...this._value);
		}
		return this;
	}

	median() {
		if (Array.isArray(this._value) && this._value.length > 0) {
			const sorted = [...this._value].sort((a, b) => a - b);
			const mid = Math.floor(sorted.length / 2);
			this._value =
				sorted.length % 2 === 0
					? (sorted[mid - 1] + sorted[mid]) / 2
					: sorted[mid];
		} else {
			this._value = null;
		}
		return this;
	}

	range(start, end) {
		if (typeof start === "number" && typeof end === "number") {
			this._value = Array.from({ length: end - start }, (_, i) => i + start);
		}
		return this;
	}

	rangeMap(start, end, fn) {
		const arr = Array.from({ length: end - start + 1 }, (_, i) =>
			fn(i + start)
		);
		this._value = arr;
		return this;
	}

	mapToObject(fn) {
		if (Array.isArray(this._value)) {
			this._value = Object.fromEntries(this._value.map(fn));
		}
		return this;
	}

	pluck(key) {
		if (Array.isArray(this._value)) {
			this._value = this._value.map((item) =>
				item && typeof item === "object" ? item[key] : undefined
			);
		}
		return this;
	}

	sortBy(selector) {
		if (Array.isArray(this._value)) {
			const get =
				typeof selector === "function" ? selector : (item) => item?.[selector];
			this._value = [...this._value].sort((a, b) => {
				const aVal = get(a);
				const bVal = get(b);
				return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
			});
		}
		return this;
	}

	// チェーン操作・条件付き
	tap(fn) {
		fn(this._value);
		return this;
	}

	tapIf(condFn, tapFn) {
		if (condFn(this._value)) {
			tapFn(this._value);
		}
		return this;
	}

	pipe(...fns) {
		if (typeof this._value !== "undefined") {
			this._value = fns.reduce((val, fn) => fn(val), this._value);
		}
		return this;
	}

	breakIf(condFn) {
		if (condFn(this._value)) {
			this._value = undefined;
		}
		return this;
	}

	// エラーハンドリング
	_error = null;

	safe(fn, onError) {
		this._error = null;
		try {
			fn(this._value);
		} catch (e) {
			this._error = e;
			if (typeof onError === "function") {
				onError(e, this._value);
			} else {
				console.warn("ChainX Error:", e);
			}
		}
		return this;
	}

	tapCatch(fn) {
		if (this._error) {
			fn(this._error, this._value);
		}
		return this;
	}

	catchOnly(handler) {
		if (this._error) {
			handler(this._error, this._value);
		}
		return this;
	}

	ensure(fn) {
		try {
			fn(this._value);
		} finally {
			return this;
		}
	}

	tryMap(fn) {
		if (Array.isArray(this._value)) {
			this._value = this._value.map((item) => {
				try {
					return fn(item);
				} catch (e) {
					console.warn("ChainX tryMap error:", e, item);
					return null;
				}
			});
		}
		return this;
	}

	hasError() {
		return this._error != null;
	}

	clearError() {
		this._error = null;
		return this;
	}

	retry(fn, times = 1) {
		let attempt = 0;
		this._error = null;
		while (attempt <= times) {
			try {
				this._value = fn(this._value);
				this._error = null;
				break;
			} catch (e) {
				this._error = e;
				attempt++;
			}
		}
		return this;
	}

	fallback(defaultValue) {
		if (this._error != null) {
			this._value = defaultValue;
			this._error = null;
		}
		return this;
	}

	// 非同期処理
	tapAsync(fn) {
		if (this._value instanceof Promise) {
			this._value = this._value.then(fn);
		} else {
			this._value = Promise.resolve(this._value).then(fn);
		}
		return this;
	}

	tapAsyncIf(cond, fn) {
		if (cond(this._value)) {
			return this.tapAsync(fn);
		}
		return this;
	}

	mapAsync(fn) {
		if (Array.isArray(this._value)) {
			this._value = this._value.reduce((p, item) => {
				return p.then(async (acc) => {
					const result = await fn(item);
					return [...acc, result];
				});
			}, Promise.resolve([]));
		}
		return this;
	}

	mapLimitAsync(fn, limit = 3) {
		if (!Array.isArray(this._value)) return this;
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
		return this;
	}

	forEachAsync(fn) {
		if (Array.isArray(this._value)) {
			this._value = this._value.reduce((p, item) => {
				return p.then(() => fn(item));
			}, Promise.resolve());
		}
		return this;
	}

	pipeAsync(...fns) {
		if (!(this._value instanceof Promise)) {
			this._value = Promise.resolve(this._value);
		}
		this._value = fns.reduce((prev, fn) => prev.then(fn), this._value);
		return this;
	}

	retryAsync(fn, times = 3, delay = 0) {
		this._error = null;
		let attempt = 0;

		const run = async () => {
			while (attempt <= times) {
				try {
					const result = await fn(this._value);
					this._value = result;
					this._error = null;
					return this;
				} catch (e) {
					this._error = e;
					attempt++;
					if (attempt > times) break;
					if (delay > 0) await new Promise((r) => setTimeout(r, delay));
				}
			}
			return this;
		};

		this._value = run();
		return this;
	}

	timeout(ms) {
		if (!(this._value instanceof Promise)) return this;
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(() => reject(new Error("Timeout")), ms)
		);
		this._value = Promise.race([this._value, timeoutPromise]);
		return this;
	}

	wait(ms) {
		this._value = new Promise((resolve) => {
			setTimeout(() => resolve(this._value), ms);
		});
		return this;
	}

	toPromise() {
		return Promise.resolve(this._value);
	}

	async await() {
		if (this._value instanceof Promise) {
			this._value = await this._value;
		}
		return this;
	}

	catchAsync(handler) {
		if (this._value instanceof Promise) {
			this._value = this._value.catch((err) => {
				this._error = err;
				return handler(err, this._value);
			});
		}
		return this;
	}

	finallyAsync(handler) {
		if (this._value instanceof Promise) {
			this._value = this._value.finally(() => handler(this._value));
		}
		return this;
	}

	// DOM操作
	_applyToElements(fn) {
		if (this._value instanceof Element) {
			fn(this._value);
		} else if (this._value instanceof NodeList || Array.isArray(this._value)) {
			Array.from(this._value).forEach((el) => {
				if (el instanceof Element) fn(el);
			});
		}
		return this;
	}

	addClass(className) {
		return this._applyToElements((el) => el.classList.add(className));
	}

	removeClass(className) {
		return this._applyToElements((el) => el.classList.remove(className));
	}

	toggleClass(className) {
		return this._applyToElements((el) => el.classList.toggle(className));
	}

	addClassIf(cond, className) {
		if (cond) {
			this._applyToElements((el) => el.classList.add(className));
		}
		return this;
	}

	getHtml() {
		return this._value instanceof Element ? this._value.innerHTML : "";
	}

	html(content) {
		this._applyToElements((el) => (el.innerHTML = content));
		return this;
	}

	getText() {
		return this._value instanceof Element ? this._value.textContent : "";
	}

	text(content) {
		this._applyToElements((el) => (el.textContent = content));
		return this;
	}

	getAttr(name) {
		if (this._value instanceof Element) {
			return this._value.getAttribute(name);
		}
		return null;
	}

	attr(name, value) {
		this._applyToElements((el) => el.setAttribute(name, value));
		return this;
	}

	prop(name, value) {
		if (value === undefined) {
			return this._value instanceof Element ? this._value[name] : undefined;
		}
		this._applyToElements((el) => {
			el[name] = value;
		});
		return this;
	}

	css(styles) {
		return this._applyToElements((el) => {
			for (const [k, v] of Object.entries(styles)) {
				el.style[k] = v;
			}
		});
	}

	on(event, handler) {
		return this._applyToElements((el) => el.addEventListener(event, handler));
	}

	off(event, handler) {
		return this._applyToElements((el) =>
			el.removeEventListener(event, handler)
		);
	}

	onHover(enterFn, leaveFn) {
		return this._applyToElements((el) => {
			el.addEventListener("mouseenter", enterFn);
			el.addEventListener("mouseleave", leaveFn);
		});
	}

	onScroll(fn) {
		return this._applyToElements((el) => {
			window.addEventListener("scroll", () => fn(el));
		});
	}

	show() {
		return this._applyToElements((el) => (el.style.display = ""));
	}

	hide() {
		return this._applyToElements((el) => (el.style.display = "none"));
	}

	toggle() {
		return this._applyToElements((el) => {
			const curr = window.getComputedStyle(el).display;
			el.style.display = curr === "none" ? "" : "none";
		});
	}

	remove() {
		return this._applyToElements((el) => el.remove());
	}

	appendTo(target) {
		const parent =
			target instanceof Element ? target : document.querySelector(target);
		return this._applyToElements((el) =>
			parent.appendChild(el.cloneNode(true))
		);
	}

	prependTo(target) {
		const parent =
			target instanceof Element ? target : document.querySelector(target);
		return this._applyToElements((el) =>
			parent.insertBefore(el.cloneNode(true), parent.firstChild)
		);
	}

	find(selector) {
		if (this._value instanceof Element) {
			this._value = this._value.querySelectorAll(selector);
		}
		return this;
	}

	getVal() {
		if (this._value instanceof Element && "value" in this._value) {
			return this._value.value;
		}
		return "";
	}

	val(value) {
		if (value !== undefined) {
			this._applyToElements((el) => {
				if ("value" in el) el.value = value;
			});
		}
		return this;
	}

	scrollTo(x, y) {
		this._applyToElements((el) => {
			el.scrollTo(x, y);
		});
		return this;
	}

	scrollIntoView(options = { behavior: "smooth", block: "start" }) {
		return this._applyToElements((el) => el.scrollIntoView(options));
	}

	parent() {
		if (this._value instanceof Element) {
			this._value = this._value.parentElement;
		}
		return this;
	}

	children() {
		if (this._value instanceof Element) {
			this._value = this._value.children;
		}
		return this;
	}

	closest(selector) {
		if (this._value instanceof Element) {
			this._value = this._value.closest(selector);
		}
		return this;
	}

	fadeIn(duration = 400) {
		this._applyToElements((el) => {
			el.style.opacity = 0;
			el.style.display = "";
			el.style.transition = `opacity ${duration}ms`;
			requestAnimationFrame(() => {
				el.style.opacity = 1;
			});
		});
		return this;
	}

	fadeOut(duration = 400) {
		this._applyToElements((el) => {
			el.style.transition = `opacity ${duration}ms`;
			el.style.opacity = 0;
			setTimeout(() => {
				el.style.display = "none";
			}, duration);
		});
		return this;
	}

	fadeToggle(duration = 400) {
		this._applyToElements((el) => {
			const isHidden = window.getComputedStyle(el).display === "none";
			if (isHidden) {
				this.fadeIn(duration);
			} else {
				this.fadeOut(duration);
			}
		});
		return this;
	}

	slideDown(duration = 300) {
		this._applyToElements((el) => {
			this._queue.push(() => this._slide(el, "down", duration));
			this._dequeue();
		});
		return this;
	}

	slideUp(duration = 300) {
		this._applyToElements((el) => {
			this._queue.push(() => this._slide(el, "up", duration));
			this._dequeue();
		});
		return this;
	}

	slideToggle(duration = 300) {
		this._applyToElements((el) => {
			const isHidden = window.getComputedStyle(el).display === "none";
			this._queue.push(() =>
				this._slide(el, isHidden ? "down" : "up", duration)
			);
			this._dequeue();
		});
		return this;
	}

	_slide(target, direction = "down", duration = 300) {
		const el = target;
		if (!(el instanceof Element)) return;
		el.style.overflow = "hidden";
		el.style.transition = `max-height ${duration}ms ease`;
		const cleanUp = () => {
			el.style.transition = "";
			el.style.overflow = "";
			el.style.maxHeight = "";
		};
		if (direction === "down") {
			el.style.display = "";
			const scrollHeight = el.scrollHeight + "px";
			el.style.maxHeight = "0px";
			requestAnimationFrame(() => {
				el.style.maxHeight = scrollHeight;
			});
			el.addEventListener(
				"transitionend",
				() => {
					cleanUp();
					this._dequeue();
				},
				{ once: true }
			);
		} else {
			el.style.maxHeight = el.scrollHeight + "px";
			requestAnimationFrame(() => {
				el.style.maxHeight = "0px";
			});
			el.addEventListener(
				"transitionend",
				() => {
					el.style.display = "none";
					cleanUp();
					this._dequeue();
				},
				{ once: true }
			);
		}
	}

	animate(styles, duration = 400) {
		this._applyToElements((el) => {
			el.style.transition = Object.keys(styles)
				.map((key) => `${key} ${duration}ms ease`)
				.join(", ");
			requestAnimationFrame(() => {
				for (const [key, value] of Object.entries(styles)) {
					el.style[key] = value;
				}
			});
		});
		return this;
	}

	typewriter(text, speed = 50) {
		this._applyToElements((el) => {
			el.textContent = "";
			let i = 0;
			const write = () => {
				if (i < text.length) {
					el.textContent += text[i++];
					setTimeout(write, speed);
				}
			};
			write();
		});
		return this;
	}

	loopAnimations(effects = [], delay = 1000) {
		this._applyToElements((el) => {
			let i = 0;
			const run = () => {
				const effect = effects[i % effects.length];
				effect($X(el));
				i++;
				setTimeout(run, delay);
			};
			run();
		});
		return this;
	}

	scrollReveal(threshold = 0.1, duration = 400) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const el = entry.target;
						el.style.opacity = 0;
						el.style.transition = `opacity ${duration}ms ease`;
						el.style.display = "";
						requestAnimationFrame(() => {
							el.style.opacity = 1;
						});
						observer.unobserve(el);
					}
				});
			},
			{ threshold }
		);
		this._applyToElements((el) => {
			el.style.opacity = 0;
			el.style.display = "none";
			observer.observe(el);
		});
		return this;
	}

	// 状態保存
	_saveStates = {};

	saveState(name = "default") {
		this._saveStates[name] = this._clone(this._value);
		return this;
	}

	restoreState(name = "default") {
		if (this._saveStates[name] !== undefined) {
			this._value = this._clone(this._saveStates[name]);
		}
		return this;
	}

	// 拡張（プラグイン）
	static plugin(name, fn) {
		if (!this.prototype[name]) {
			this.prototype[name] = fn;
		}
	}
}

function $X(input) {
	const isLikelySelector =
		typeof input === "string" && /^[.#\w\s>\[\]=":-]+$/.test(input.trim());
	if (isLikelySelector) {
		try {
			const result = document.querySelectorAll(input);
			if (result.length > 0) return new ChainX(result);
		} catch (_) {}
	}
	return new ChainX(input);
}

if (typeof window !== "undefined") {
	window.ChainX = ChainX;
	window.$X = $X;
}

export { ChainX, $X };
