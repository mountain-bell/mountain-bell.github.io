import { DomTriggerData, DomTriggerHandler } from "./types";
import { getTriggerNames, collectData, isKebabName } from "./utils";
import { Registry } from "./registry";

const JS_PREFIX = "js-";

const LOAD_PREFIX = `${JS_PREFIX}load-`;

type DomEventName =
	| keyof HTMLElementEventMap
	| keyof DocumentEventMap
	| keyof WindowEventMap;

const EVENT_PREFIX_MAP: Partial<Record<DomEventName, string>> = {
	// --- ユーザー操作（クリック・フォームなど） ---
	click: `${JS_PREFIX}click-`,
	submit: `${JS_PREFIX}submit-`,
	change: `${JS_PREFIX}change-`,
	input: `${JS_PREFIX}input-`,
	// --- キーボード ---
	keydown: `${JS_PREFIX}keydown-`,
	keyup: `${JS_PREFIX}keyup-`,
	// --- フォーカス ---
	focusin: `${JS_PREFIX}focusin-`,
	focusout: `${JS_PREFIX}focusout-`,
	// --- ポインター／マウス ---
	pointerdown: `${JS_PREFIX}pointerdown-`,
	pointerup: `${JS_PREFIX}pointerup-`,
	mouseover: `${JS_PREFIX}mouseover-`,
	mouseout: `${JS_PREFIX}mouseout-`,
	// --- メディア関連 ---
	play: `${JS_PREFIX}play-`,
	pause: `${JS_PREFIX}pause-`,
	ended: `${JS_PREFIX}ended-`,
	// --- トランジション／アニメーション ---
	transitionend: `${JS_PREFIX}transitionend-`,
	animationend: `${JS_PREFIX}animationend-`,
	// --- ページ状態 ---
	visibilitychange: `${JS_PREFIX}visibilitychange-`,
	pageshow: `${JS_PREFIX}pageshow-`,
	pagehide: `${JS_PREFIX}pagehide-`,
	// --- ネットワーク／クリップボード ---
	online: `${JS_PREFIX}online-`,
	offline: `${JS_PREFIX}offline-`,
	copy: `${JS_PREFIX}copy-`,
	paste: `${JS_PREFIX}paste-`,
};

const eventBound = new Set<string>();

function use(name: string, handler: DomTriggerHandler) {
	if (!isKebabName(name)) {
		throw new Error(
			`[DomTrigger.use] Invalid trigger name: "${name}". Use kebab-case.`
		);
	}
	Registry.set(name, handler);
}

async function invoke(name: string, el: Element, event?: Event) {
	if (!isKebabName(name)) {
		throw new Error(
			`[DomTrigger.invoke] Invalid trigger name: "${name}". Use kebab-case.`
		);
	}
	const handler = Registry.get(name);
	if (!handler) return;
	const data = collectData(el, name);
	await handler(el, data, { name, event });
}

async function run(name: string, el: Element | null, data?: DomTriggerData) {
	if (!isKebabName(name)) {
		throw new Error(
			`[DomTrigger.run] Invalid trigger name: "${name}". Use kebab-case.`
		);
	}
	const handler = Registry.get(name);
	if (!handler) return;
	await handler(el, data ?? {}, { name });
}

async function runLoad() {
	if (typeof document === "undefined") return;
	const nodes = Array.from(
		document.querySelectorAll(
			`[class^="${LOAD_PREFIX}"], [class*=" ${LOAD_PREFIX}"]`
		)
	);
	for (const el of nodes) {
		const names = getTriggerNames(el, LOAD_PREFIX);
		for (const name of names) void invoke(name, el);
	}
}

async function runShow() {
	if (typeof document === "undefined") return;
	const showPrefix = EVENT_PREFIX_MAP.pageshow;
	if (showPrefix === undefined) return;
	const nodes = Array.from(
		document.querySelectorAll(
			`[class^="${showPrefix}"], [class*=" ${showPrefix}"]`
		)
	);
	for (const el of nodes) {
		const names = getTriggerNames(el, showPrefix);
		for (const name of names) void invoke(name, el);
	}
}

function listenDelegated(eventName: DomEventName) {
	if (typeof document === "undefined") return;
	if (eventBound.has(eventName)) return;
	eventBound.add(eventName);

	const prefix = EVENT_PREFIX_MAP[eventName];
	if (!prefix) return;

	document.addEventListener(eventName, (ev: Event) => {
		const target = ev.target as Element | null;
		if (!target) return;

		const el = target.closest(`[class^="${prefix}"], [class*=" ${prefix}"]`);
		if (!el) return;

		const names = getTriggerNames(el, prefix);
		for (const name of names) invoke(name, el, ev);
	});
}

function listen() {
	for (const ev of Object.keys(EVENT_PREFIX_MAP))
		listenDelegated(ev as DomEventName);
}

function unuse(name: string) {
	Registry.delete(name);
}

function clear() {
	Registry.clear();
}

export const DomTrigger = {
	use,
	invoke,
	run,
	runLoad,
	runShow,
	unuse,
	clear,
};

if (typeof document !== "undefined") {
	document.addEventListener("DOMContentLoaded", () => {
		runLoad();
		runShow();
		listen();
	});
}
