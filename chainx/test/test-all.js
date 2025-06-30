function testChainX() {
	console.log("=== 基本操作 ===");
	$X([1, 2, 3])
		.clone()
		.log("clone")
		.push(4)
		.log("push")
		.pop()
		.log("pop")
		.slice(1, 2)
		.log("slice")
		.first()
		.log("first")
		.last()
		.log("last")
		.reset()
		.log("reset");

	console.log("=== 型変換・型判定 ===");
	$X("true")
		.toBoolean()
		.log("toBoolean")
		.toNumber()
		.log("toNumber")
		.toString()
		.log("toString")
		.toJSON()
		.log("toJSON")
		.toArray()
		.log("toArray")
		.toObject()
		.log("toObject")
		.toMap()
		.log("toMap")
		.pickType()
		.log("pickType")
		.isNull()
		.log("isNull")
		.isUndefined()
		.log("isUndefined")
		.isBoolean()
		.log("isBoolean")
		.isNumber()
		.log("isNumber")
		.isString()
		.log("isString")
		.isArray()
		.log("isArray")
		.isObject()
		.log("isObject")
		.isElement()
		.log("isElement")
		.isFunction()
		.log("isFunction")
		.isPromise()
		.log("isPromise");

	console.log("=== Number操作 ===");
	$X(-5)
		.abs()
		.log("abs")
		.round()
		.log("round")
		.floor()
		.log("floor")
		.ceil()
		.log("ceil")
		.sqrt()
		.log("sqrt")
		.pow(3)
		.log("pow")
		.clampMin(0)
		.log("clampMin")
		.clampMax(10)
		.log("clampMax")
		.clamp(0, 5)
		.log("clamp")
		.mod(3)
		.log("mod")
		.percent(10)
		.log("percent");

	console.log("=== String操作 ===");
	$X("  hello_world ")
		.trim()
		.log("trim")
		.lower()
		.log("lower")
		.upper()
		.log("upper")
		.capitalize()
		.log("capitalize")
		.snakeToCamel()
		.log("snakeToCamel")
		.camelToSnake()
		.log("camelToSnake")
		.replace("hello", "hi")
		.log("replace")
		.replaceAll("_", "-")
		.log("replaceAll")
		.padStart(15, "*")
		.log("padStart")
		.padEnd(20, "*")
		.log("padEnd")
		.split("-")
		.log("split")
		.match(/hi/)
		.log("match")
		.matchAll(/l/)
		.log("matchAll")
		.test(/hi/)
		.log("test")
		.includesWith("hi")
		.log("includesWith")
		.startsWith("*")
		.log("startsWith")
		.endsWith("*")
		.log("endsWith");

	console.log("=== 配列操作 ===");
	$X([1, 2, 3])
		.push(4)
		.log("push")
		.pop()
		.log("pop")
		.shift()
		.log("shift")
		.unshift(0)
		.log("unshift")
		.insert(1, 9)
		.log("insert")
		.splice(1, 1, 8)
		.log("splice")
		.slice(1, 3)
		.log("slice")
		.take(2)
		.log("take")
		.takeRight(2)
		.log("takeRight")
		.first()
		.log("first")
		.last()
		.log("last")
		.sample()
		.log("sample")
		.reverse()
		.log("reverse")
		.shuffle()
		.log("shuffle")
		.chunk(2)
		.log("chunk")
		.flatten()
		.log("flatten")
		.compact()
		.log("compact")
		.uniq()
		.log("uniq")
		.map((x) => x * 2)
		.log("map")
		.filter((x) => x > 2)
		.log("filter")
		.reject((x) => x === 4)
		.log("reject")
		.partition((x) => x % 2 === 0)
		.log("partition")
		.groupBy((x) => (x % 2 === 0 ? "even" : "odd"))
		.log("groupBy")
		.countBy((x) => typeof x)
		.log("countBy")
		.sum()
		.log("sum")
		.avg()
		.log("avg")
		.min()
		.log("min")
		.max()
		.log("max")
		.median()
		.log("median")
		.join(",")
		.log("join")
		.range(1, 5)
		.log("range")
		.rangeMap(1, 3, (i) => i * 10)
		.log("rangeMap");

	console.log("=== オブジェクト操作 ===");
	$X({ a: 1, b: {} })
		.defaults({ c: 3 })
		.log("defaults")
		.mergeDeep({ b: { d: 4 } })
		.log("mergeDeep")
		.pick(["a"])
		.log("pick")
		.omit(["b"])
		.log("omit")
		.deepOmit(["d"])
		.log("deepOmit")
		.renameKeys({ a: "x" })
		.log("renameKeys")
		.invert()
		.log("invert")
		.mapObject((k, v) => [k.toUpperCase(), v * 10])
		.log("mapObject")
		.filterObject((k, v) => v > 10)
		.log("filterObject")
		.flattenObject()
		.log("flattenObject")
		.expandObject()
		.log("expandObject");

	console.log("=== DOM 全機能テスト ===");
	const div = document.createElement("div");
	document.body.appendChild(div);
	$X(div)
		.addClass("foo")
		.removeClass("foo")
		.toggleClass("bar")
		.addClassIf(true, "baz")
		.removeClassIf(true, "baz")
		.toggleClassIf(true, "bar")
		.text("Test Text")
		.log("text")
		.html("<span>HTML</span>")
		.log("html")
		.val("value")
		.log("val")
		.attr("data-test", "123")
		.log("attr")
		.attrs({ "data-x": "x" })
		.log("attrs")
		.prop("hidden", false)
		.log("prop")
		.css({ color: "red" })
		.log("css")
		.show()
		.log("show")
		.hide()
		.log("hide")
		.toggle()
		.log("toggle")
		.appendTo(document.body)
		.log("appendTo")
		.prependTo(document.body)
		.log("prependTo")
		.find("span")
		.log("find")
		.parent()
		.log("parent")
		.children()
		.log("children")
		.closest("body")
		.log("closest")
		.scrollTo(0, 0)
		.log("scrollTo")
		.scrollLeft(10)
		.log("scrollLeft")
		.scrollTop(10)
		.log("scrollTop")
		.scrollIntoView()
		.log("scrollIntoView")
		.addAnimateClass("fade")
		.removeAnimateClass("fade")
		.toggleAnimateClass("fade")
		.animate({ opacity: "0.5" })
		.log("animate");

	console.log("=== チェーン制御・エラー処理テスト ===");
	$X(10)
		.tap((v) => console.log("tap", v))
		.when(
			(v) => v === 10,
			(c) => c.pipe((v) => v + 5)
		)
		.log("when")
		.unless(
			(v) => v > 20,
			(c) => c.pipe((v) => v * 2)
		)
		.log("unless")
		.branch(
			(v) => v > 20,
			(c) => c.pipe((v) => v - 5),
			(c) => c.pipe((v) => v + 5)
		)
		.log("branch")
		.pipe((v) => v * 3)
		.log("pipe")
		.attempt(
			() => {
				throw new Error("forced error");
			},
			(e) => console.log("caught", e.message)
		)
		.onCatch((v) => v)
		.log("onCatch")
		.fallback(100)
		.log("fallback")
		.clearError()
		.log("clearError")
		.retry(() => {
			throw new Error("retry error");
		}, 2)
		.log("retry")
		.tryMap(
			(v) => {
				if (v === 100) throw new Error("tryMap error");
				return v;
			},
			(e) => 999
		)
		.log("tryMap");

	console.log("=== 非同期処理テスト ===");
	$X([1, 2, 3])
		.mapAsync(async (x) => {
			await new Promise((r) => setTimeout(r, 100));
			return x * 2;
		})
		.tapAsync((res) => console.log("mapAsync result", res));
	$X(Promise.resolve("ok"))
		.tapAsync((val) => console.log("tapAsync", val))
		.wait(100)
		.catchAsync((e) => console.error("caught async", e))
		.finallyAsync(() => console.log("done"))
		.toPromise()
		.then((res) => console.log("toPromise", res));
	$X(Promise.resolve(null))
		.retryTimeoutAsync(
			async (v) => {
				if (!v) throw new Error("retryTimeout test error");
				return "recovered";
			},
			1000,
			100
		)
		.catchAsync((e) => console.error("retryTimeoutAsync failed:", e.message))
		.finallyAsync(() => console.log("retryTimeoutAsync test done"));

	console.log("=== 状態保存・復元・レシピ・プラグインテスト ===");
	$X([1, 2, 3])
		.saveState("initial")
		.push(4)
		.log("after push")
		.restoreState("initial")
		.log("restored");
	const recipe = $XR([1, 2]).push(3).toRecipe();
	recipe($X([10, 20])).log("recipe applied");
	ChainX.plugin("double", function () {
		this._value *= 2;
		return this;
	});
	$X(5).double().log("plugin double");

	console.log(
		"\n=== ✅ すべての関数が呼び出されました（目視とログで確認） ==="
	);
}

window.addEventListener("DOMContentLoaded", testChainX);
