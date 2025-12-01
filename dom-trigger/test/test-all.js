const testCheckList = new Map();

const dt = DomTrigger;

dt.setupOnReady(() => {
	document.addEventListener("click", () => {
		console.log("クリック！");
	});
});

dt.use("get-log", () => {
	const entries = Array.from(testCheckList.entries());
	entries.forEach(([key, value]) => console.log(`${key}:${value}`));
});

dt.use("set-log", ({ data, el, ctx }) => {
	const key = data?.id ? data.id : 1;
	const testName = data?.name ? data.name : "run";
	const tagName = el?.tagName ? el.tagName : "non";
	const ctxName = ctx?.name ? ctx.name : "non";
	const ctxEvent = ctx?.event ? ctx.event.type : "non";
	const value = `${testName}_el[tagName:${tagName}]_ctx[name:${ctxName}][event:${ctxEvent}]`;
	testCheckList.set(key, value);
});

dt.use("set-log-invoke-no-data", ({ data }) => {
	const key = data?.id ? data.id : 5;
	const value = data?.name ? data.name : "invoke-no-data";
	testCheckList.set(key, value);
});

dt.use("set-log-focusin-to-out", () => {
	testCheckList.set(11, "focusin-to-out");
});

dt.use("set-log-pointer", ({ ctx }) => {
	const event = ctx?.event?.type;
	if (event === "pointerdown") {
		testCheckList.set(13, "pointerdown");
	} else if (event === "pointermove") {
		testCheckList.set(14, "pointermove");
	} else if (event === "pointerup") {
		testCheckList.set(15, "pointerup");
	} else if (event === "pointercancel") {
		testCheckList.set(16, "pointercancel");
	} else {
		testCheckList.set(99, "error");
	}
});

dt.use("set-log-animation", ({ ctx }) => {
	const event = ctx?.event?.type;
	if (event === "transitionend") {
		testCheckList.set(17, "transitionend");
	} else if (event === "animationend") {
		testCheckList.set(18, "animationend");
	} else {
		testCheckList.set(99, "error");
	}
});
const testAnimetion = document.getElementById("test-animation");
if (testAnimetion) testAnimetion.style.transition = "opacity 0.5s";
requestAnimationFrame(() => {
	if (testAnimetion) {
		testAnimetion.style.opacity = "0.1";
		testAnimetion.classList.add("animate");
	}
});

dt.use("set-log-page", ({ ctx }) => {
	const event = ctx?.event?.type;
	if (event === "load") {
		testCheckList.set(19, "load");
	} else if (event === "pageshow") {
		testCheckList.set(20, "pageshow");
	} else if (event === "visibilitychange") {
		testCheckList.set(21, "visibilitychange");
	} else if (event === "offline") {
		testCheckList.set(22, "offline");
	} else if (event === "online") {
		testCheckList.set(23, "online");
	} else if (event === "pagehide") {
		testCheckList.set(98, "pagehide");
	} else {
		testCheckList.set(99, "error");
	}
});

dt.use("view-in-log", () => console.log("ViewIn"));

dt.use("view-out-log", () => console.log("ViewOut"));

dt.run("set-log");

dt.run("set-log", { data: { id: 2, name: "run_add_data" } });

const testBtn = document.querySelector("#test-btn");

const testBtnNoData = document.querySelector("#test-btn-no-data");

const mockEvent = new Event("click");

dt.run("set-log", {
	data: { id: 3, name: "run_all_args" },
	el: testBtn ?? undefined,
	event: mockEvent,
});

if (testBtn) dt.invoke("set-log", testBtn, mockEvent);

if (testBtnNoData) dt.invoke("set-log-invoke-no-data", testBtnNoData);
