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
	// --- クリック ---
	click: `${JS_PREFIX}click-`,
	// --- フォーム ---
	submit: `${JS_PREFIX}submit-`,
	change: `${JS_PREFIX}change-`,
	input: `${JS_PREFIX}input-`,
	// --- フォーカス ---
	focusin: `${JS_PREFIX}focusin-`,
	focusout: `${JS_PREFIX}focusout-`,
	// --- ポインター ---
	pointerdown: `${JS_PREFIX}pointerdown-`,
	pointermove: `${JS_PREFIX}pointermove-`,
	pointerup: `${JS_PREFIX}pointerup-`,
	pointercancel: `${JS_PREFIX}pointercancel-`,
	// --- アニメーション ---
	transitionend: `${JS_PREFIX}transitionend-`,
	animationend: `${JS_PREFIX}animationend-`,
	// --- ページ ---
	visibilitychange: `${JS_PREFIX}visibilitychange-`,
	pageshow: `${JS_PREFIX}pageshow-`,
	pagehide: `${JS_PREFIX}pagehide-`,
	// --- ネットワーク ---
	online: `${JS_PREFIX}online-`,
	offline: `${JS_PREFIX}offline-`,
	// --- クリップボード ---
	copy: `${JS_PREFIX}copy-`,
	paste: `${JS_PREFIX}paste-`,
	// --- キーボード（クリック補助・PC向け） ---
	keydown: `${JS_PREFIX}keydown-`,
	keyup: `${JS_PREFIX}keyup-`,
	// --- マウス（ホバー演出・PC向け） ---
	mouseover: `${JS_PREFIX}mouseover-`,
	mouseout: `${JS_PREFIX}mouseout-`,
};

const PAGE_LEVEL_EVENTS: Set<DomEventName> = new Set([
	"visibilitychange",
	"pageshow",
	"pagehide",
	"online",
	"offline",
]);

const eventBound = new Set<string>();
let isPointerTracking = false;

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
	if (!showPrefix) return;
	const el = document.body;
	const names = getTriggerNames(el, showPrefix);
	for (const name of names) void invoke(name, el);
}

function listenDelegated(eventName: DomEventName) {
	if (typeof document === "undefined") return;
	if (eventBound.has(eventName)) return;
	eventBound.add(eventName);

	const prefix = EVENT_PREFIX_MAP[eventName];
	if (!prefix) return;

	const isNetworkEvent = eventName === "online" || eventName === "offline";
	const listener = isNetworkEvent ? window : document;

	listener.addEventListener(eventName, (ev: Event) => {
		if (eventName === "pointermove" && !isPointerTracking) return;
		if (eventName === "pointerup" || eventName === "pointercancel")
			isPointerTracking = false;

		const target = PAGE_LEVEL_EVENTS.has(eventName)
			? document.body
			: ev.target instanceof Element
			? ev.target
			: null;
		if (!target) return;

		const el = target.closest(`[class^="${prefix}"], [class*=" ${prefix}"]`);
		if (!el) return;

		if (eventName === "pointerdown") isPointerTracking = true;

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
