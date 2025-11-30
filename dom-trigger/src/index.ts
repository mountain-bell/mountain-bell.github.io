import {
	DomTriggerData,
	DomTriggerHandler,
	DomTriggerRunOptions,
} from "./types";
import {
	getTriggerNames,
	collectData,
	isKebabName,
	isElementCenterInView,
	UNCACHE_PARAM,
} from "./utils";
import { Registry } from "./registry";

const JS_PREFIX = "js-";

type DomEventName =
	| keyof HTMLElementEventMap
	| keyof DocumentEventMap
	| keyof WindowEventMap;

const EVENT_PREFIX_MAP: Partial<Record<DomEventName, string>> = {
	// --- ページ ---
	load: `${JS_PREFIX}load-`,
	pageshow: `${JS_PREFIX}pageshow-`,
	visibilitychange: `${JS_PREFIX}visibilitychange-`,
	pagehide: `${JS_PREFIX}pagehide-`,
	// --- ネットワーク ---
	offline: `${JS_PREFIX}offline-`,
	online: `${JS_PREFIX}online-`,
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

const WINDOW_EVENTS: Set<DomEventName> = new Set([
	"load",
	"pageshow",
	"pagehide",
	"offline",
	"online",
]);

const PAGE_LEVEL_EVENTS: Set<DomEventName> = new Set([
	"visibilitychange",
	...WINDOW_EVENTS,
]);

const EVENT_NAME_LIST = Object.keys(EVENT_PREFIX_MAP);

const EVENT_PARAM_PREVENT_DEFAULT = "prevent-default";
const EVENT_PARAM_STOP_PROPAGATION = "stop-propagation";

const EVENT_PARAM_PREVENT_DEFAULT_LIST = EVENT_NAME_LIST.map(
	(eventName) => `${eventName}-${EVENT_PARAM_PREVENT_DEFAULT}`
);
const EVENT_PARAM_STOP_PROPAGATION_LIST = EVENT_NAME_LIST.map(
	(eventName) => `${eventName}-${EVENT_PARAM_STOP_PROPAGATION}`
);

const boundEvents = new Set<string>();
let isTrackingPointer = false;

const VIEWIN_PREFIX = `${JS_PREFIX}viewin-`;
const VIEWOUT_PREFIX = `${JS_PREFIX}viewout-`;

const VIEW_PARAM_CENTER = "view-center";
const VIEW_PARAM_RATIO = "view-ratio";
const viewSelector = [
	`[class^="${VIEWIN_PREFIX}"]`,
	`[class*=" ${VIEWIN_PREFIX}"]`,
	`[class^="${VIEWOUT_PREFIX}"]`,
	`[class*=" ${VIEWOUT_PREFIX}"]`,
].join(", ");

let viewObserver: IntersectionObserver | null = null;
const observedElements = new WeakSet<Element>();
const viewState = new WeakMap<Element, "in" | "out">();

const RESERVED_TRIGGER_NAMES = new Set([
	...EVENT_PARAM_PREVENT_DEFAULT_LIST,
	...EVENT_PARAM_STOP_PROPAGATION_LIST,
	VIEW_PARAM_CENTER,
	VIEW_PARAM_RATIO,
	UNCACHE_PARAM,
]);

const RESERVED_TRIGGER_NAME_PREFIX = `${UNCACHE_PARAM}-`;

function use<TData extends DomTriggerData = DomTriggerData>(
	name: string,
	handler: DomTriggerHandler<TData>
) {
	if (!isKebabName(name)) {
		throw new Error(
			`[DomTrigger.use] Invalid trigger name: "${name}". Use kebab-case.`
		);
	}
	if (
		RESERVED_TRIGGER_NAMES.has(name) ||
		name.startsWith(RESERVED_TRIGGER_NAME_PREFIX)
	) {
		throw new Error(`[DomTrigger.use] Reserved trigger name: "${name}".`);
	}
	Registry.set(name, handler as DomTriggerHandler);
}

async function run<TData extends DomTriggerData = DomTriggerData>(
	name: string,
	options?: DomTriggerRunOptions<TData>
) {
	if (!isKebabName(name)) {
		throw new Error(
			`[DomTrigger.run] Invalid trigger name: "${name}". Use kebab-case.`
		);
	}
	const handler = Registry.get(name);
	if (!handler) return;
	const el = options?.el;
	const data = options?.data;
	const event = options?.event;
	await handler({
		el,
		data,
		ctx: { name, source: "run", event },
	});
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
	await handler({ el, data, ctx: { name, source: "invoke", event } });
}

function listenDelegated(eventName: DomEventName) {
	if (typeof document === "undefined") return;
	if (boundEvents.has(eventName)) return;
	boundEvents.add(eventName);

	const prefix = EVENT_PREFIX_MAP[eventName];
	if (!prefix) return;

	const listener = WINDOW_EVENTS.has(eventName) ? window : document;

	listener.addEventListener(eventName, (ev: Event) => {
		if (eventName === "pointermove" && !isTrackingPointer) return;
		if (eventName === "pointerup" || eventName === "pointercancel")
			isTrackingPointer = false;

		const target = PAGE_LEVEL_EVENTS.has(eventName)
			? document.body
			: ev.target instanceof Element
			? ev.target
			: null;
		if (!target) return;

		const el = target.closest(`[class^="${prefix}"], [class*=" ${prefix}"]`);
		if (!el) return;

		const attrPreventDefault = el.getAttribute(
			`data-${eventName}-${EVENT_PARAM_PREVENT_DEFAULT}`
		);
		const shouldPreventDefault =
			attrPreventDefault !== null && attrPreventDefault !== "false";
		if (shouldPreventDefault) ev.preventDefault();

		const attrStopPropagation = el.getAttribute(
			`data-${eventName}-${EVENT_PARAM_STOP_PROPAGATION}`
		);
		const shouldStopPropagation =
			attrStopPropagation !== null && attrStopPropagation !== "false";
		if (shouldStopPropagation) ev.stopPropagation();

		if (eventName === "pointerdown") isTrackingPointer = true;

		const names = getTriggerNames(el, prefix);
		for (const name of names) invoke(name, el, ev);
	});
}

function listen() {
	for (const eventName of EVENT_NAME_LIST)
		listenDelegated(eventName as DomEventName);
}

function observeView() {
	if (typeof document === "undefined") return;
	if (typeof IntersectionObserver === "undefined") return;

	if (!viewObserver) {
		viewObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!(entry.target instanceof Element)) continue;
					const el = entry.target;

					let isViewIn = false;

					const attrCenter = el.getAttribute(`data-${VIEW_PARAM_CENTER}`);
					if (attrCenter !== null) {
						const rawCenter = attrCenter ? parseInt(attrCenter, 10) : 20;
						const offset = rawCenter >= 0 ? rawCenter : 20;
						isViewIn = isElementCenterInView(entry, offset);
					} else {
						const attrRatio = el.getAttribute(`data-${VIEW_PARAM_RATIO}`);
						const rawRatio = attrRatio ? parseFloat(attrRatio) : 0;
						const thresholdRatio =
							rawRatio >= 0 && rawRatio <= 1 ? rawRatio : 0;
						const currentRatio = entry.intersectionRatio;
						isViewIn = currentRatio >= thresholdRatio;
					}

					const prev = viewState.get(el);

					if (entry.isIntersecting && isViewIn) {
						if (prev === "in") continue;
						const names = getTriggerNames(el, VIEWIN_PREFIX);
						for (const name of names) void invoke(name, el);
						viewState.set(el, "in");
					} else {
						if (prev !== "in") continue;
						const names = getTriggerNames(el, VIEWOUT_PREFIX);
						for (const name of names) void invoke(name, el);
						viewState.set(el, "out");
					}
				}
			},
			{
				threshold: Array.from({ length: 11 }, (_, i) => i / 10),
			}
		);
	}

	const nodes = document.querySelectorAll(viewSelector);
	nodes.forEach((el) => {
		if (viewObserver && !observedElements.has(el)) {
			viewObserver.observe(el);
			observedElements.add(el);
		}
	});
}

function unuse(name: string) {
	Registry.delete(name);
}

function clear() {
	Registry.clear();
}

function setup() {
	listen();
	observeView();
}

function setupOnReady() {
	if (typeof document === "undefined") return;

	const trySetup = () => {
		try {
			setup();
		} catch (e) {
			console.error("[DomTrigger.setupOnReady] Failed to setup:", e);
		}
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", trySetup, {
			once: true,
		});
		return;
	}

	trySetup();
}

const DomTrigger = {
	use,
	run,
	invoke,
	listen,
	observeView,
	unuse,
	clear,
	setup,
	setupOnReady,
};

export default DomTrigger;
