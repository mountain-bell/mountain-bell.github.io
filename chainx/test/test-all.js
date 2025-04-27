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

	console.log("\n=== 型変換・判定 ===");
	$X("123")
		.toNumber()
		.log("toNumber")
		.toBoolean()
		.log("toBoolean")
		.type()
		.log("type")
		.isNumber()
		.log("isNumber")
		.isType("number")
		.log("isType");

	console.log("\n=== オブジェクト操作 ===");
	$X({ a: 1, b: 2 })
		.renameKeys({ a: "x" })
		.log("renameKeys")
		.defaults({ y: 3 })
		.log("defaults")
		.pick(["x"])
		.log("pick")
		.omit(["y"])
		.log("omit")
		.mapObject((k, v) => [k.toUpperCase(), v * 10])
		.log("mapObject")
		.filterObject((k, v) => v > 10)
		.log("filterObject");

	console.log("\n=== 配列ユーティリティ ===");
	const baseArr = $X([1, 2, 3, 4, 5]);

	baseArr
		.filterMap((n) => (n % 2 ? n : null))
		.log("filterMap")
		.reject((n) => n === 3)
		.log("reject")
		.groupBy((n) => (n % 2 === 0 ? "even" : "odd"))
		.log("groupBy");

	baseArr
		.reset()
		.countBy((n) => typeof n)
		.log("countBy")
		.uniq()
		.log("uniq")
		.shuffle()
		.log("shuffle")
		.chunk(2)
		.log("chunk")
		.partition((n) => Array.isArray(n))
		.log("partition")
		.zip([9, 8, 7])
		.log("zip")
		.mapToObject((v, i) => [`key${i}`, v])
		.log("mapToObject")
		.pluck("key1")
		.log("pluck");

	const rangeArr = $X().range(0, 5).log("range");
	const rangeMapArr = $X()
		.rangeMap(1, 3, (i) => i * 10)
		.log("rangeMap");

	rangeMapArr.clone().sum().log("sum");
	rangeMapArr.clone().avg().log("avg");
	rangeMapArr.clone().min().log("min");
	rangeMapArr.clone().max().log("max");
	rangeMapArr.clone().median().log("median");

	console.log("\n=== 状態保存・復元 ===");
	$X([10, 20, 30])
		.saveState("before")
		.log("saved")
		.push(40)
		.log("after push")
		.restoreState("before")
		.log("restored");

	console.log("\n=== チェーン制御・エラー処理 ===");
	$X(100)
		.tap((v) => console.log("tap:", v))
		.pipe(
			(v) => v * 2,
			(v) => v + 1
		)
		.log("pipe")
		.breakIf((v) => v > 200)
		.log("after breakIf")
		.safe(() => {
			throw new Error("Intentional error");
		})
		.tapCatch((e) => console.warn("Caught:", e.message))
		.catchOnly((e) => console.warn("Handled:", e.message))
		.fallback(999)
		.log("after fallback");

	console.log("\n=== 非同期処理 ===");
	$X([1, 2, 3])
		.mapAsync(async (x) => {
			await new Promise((r) => setTimeout(r, 100));
			return x * 2;
		})
		.tapAsync((res) => console.log("mapAsync result:", res));

	$X(Promise.resolve("ok"))
		.tapAsync((val) => console.log("tapAsync:", val))
		.wait(100)
		.catchAsync((e) => console.error("caught async:", e))
		.finallyAsync(() => console.log("done"))
		.toPromise()
		.then((res) => console.log("toPromise:", res));

	console.log("\n=== DOM操作 ===");
	const div = document.createElement("div");
	div.className = "test";
	div.textContent = "Hello DOM";
	document.body.appendChild(div);

	$X(div)
		.addClass("highlight")
		.log("addClass")
		.toggleClass("highlight")
		.log("toggleClass")
		.removeClass("highlight")
		.log("removeClass")
		.text("ChainX Updated!")
		.log("text")
		.html("<strong>Bold!</strong>")
		.log("html")
		.attr("data-test", "123")
		.log("attr")
		.prop("hidden", false)
		.log("prop")
		.val("value")
		.log("val")
		.parent()
		.log("parent")
		.children()
		.log("children")
		.closest("body")
		.log("closest")
		.find(".test")
		.log("find")
		.scrollIntoView()
		.log("scrollIntoView")
		.scrollTo(0, 0)
		.log("scrollTo")
		.fadeIn(300)
		.log("fadeIn")
		.fadeOut(300)
		.log("fadeOut")
		.fadeToggle(300)
		.log("fadeToggle")
		.animate({ opacity: "1" }, 300)
		.log("animate")
		.typewriter("Typing test", 20)
		.log("typewriter")
		.loopAnimations([(x) => x.fadeIn(), (x) => x.fadeOut()], 1000)
		.log("loopAnimations")
		.scrollReveal(0.1, 300)
		.log("scrollReveal");

	console.log("\n=== レシピ確認 ===");

	const recipe1 = $X().startRecipe().push(5).push(6).pop().toRecipe();
	recipe1($X([1, 2, 3])).log("Recipe1 applied");

	const recipe2 = $X()
		.startRecipe()
		.tapIf(
			(val) => typeof val === "string",
			(val) => console.log("文字列スタート:", val)
		)
		.toNumber()
		.pipe((n) => n * 10)
		.toRecipe();
	recipe2($X("42")).log("Recipe2 applied");

	const recipe3 = $X()
		.startRecipe()
		.filterMap((n) => (n % 2 === 0 ? n : null))
		.mapToObject((v, i) => [`even${i}`, v])
		.toRecipe();
	recipe3($X([1, 2, 3, 4, 5, 6])).log("Recipe3 applied");

	const domRecipe = $X()
		.startRecipe()
		.addClass("highlight")
		.css({ backgroundColor: "yellow", color: "red" })
		.toRecipe();
	const resipedDiv = document.createElement("div");
	resipedDiv.className = "test-dom";
	resipedDiv.textContent = "DOM for Recipe";
	document.body.appendChild(resipedDiv);
	domRecipe($X(resipedDiv)).log("DOM Recipe applied");

	const asyncRecipe = $X()
		.startRecipe()
		.tapAsync(async (v) => {
			await new Promise((r) => setTimeout(r, 100));
			console.log("tapAsync in recipe:", v);
			return v;
		})
		.pipeAsync(async (v) => {
			await new Promise((r) => setTimeout(r, 100));
			return v + "-done";
		})
		.toRecipe();

	asyncRecipe($X(Promise.resolve("start")))
		.tapAsync((res) => console.log("asyncRecipe result:", res))
		.toPromise()
		.then((finalRes) => console.log("Final async recipe output:", finalRes));

	console.log(
		"\n=== ✅ すべての関数が呼び出されました（目視とログで確認） ==="
	);
}

window.addEventListener("DOMContentLoaded", testChainX);
