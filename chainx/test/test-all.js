// test/test-all.js
// ChainXの全機能をブラウザのグローバル $X を使って確認する

function testChainX() {
	console.log("=== 基本操作 ===");
	$X([1, 2, 3])
		.clone()
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
		.toBoolean()
		.type()
		.log("type check")
		.isNumber()
		.log("isNumber")
		.isType("number")
		.log("isType");

	console.log("\n=== オブジェクト操作 ===");
	$X({ a: 1, b: 2 })
		.renameKeys({ a: "x" })
		.defaults({ y: 3 })
		.pick(["x"])
		.omit(["y"])
		.mapObject((k, v) => [k.toUpperCase(), v * 10])
		.filterObject((k, v) => v > 10)
		.log("object ops");

	console.log("\n=== 配列ユーティリティ ===");
	$X([1, 2, 3, 4, 5])
		.filterMap((n) => (n % 2 ? n : null))
		.reject((n) => n === 3)
		.groupBy((n) => (n % 2 === 0 ? "even" : "odd"))
		.countBy((n) => typeof n)
		.uniq()
		.shuffle()
		.chunk(2)
		.partition((n) => Array.isArray(n))
		.zip([9, 8, 7])
		.mapToObject((v, i) => [`key${i}`, v])
		.pluck("key1") // 意味ないが呼び出し確認用
		.range(0, 5)
		.rangeMap(1, 3, (i) => i * 10)
		.sum()
		.avg()
		.min()
		.max()
		.median()
		.log("array ops");

	console.log("\n=== 状態保存・復元 ===");
	$X([10, 20, 30])
		.saveState("before")
		.push(40)
		.log("modified")
		.restoreState("before")
		.log("restored");

	console.log("\n=== チェーン制御・エラー処理 ===");
	$X(100)
		.tap((v) => console.log("tap:", v))
		.pipe(
			(v) => v * 2,
			(v) => v + 1
		)
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
		.toggleClass("highlight")
		.removeClass("highlight")
		.text("ChainX Updated!")
		.html("<strong>Bold!</strong>")
		.attr("data-test", "123")
		.prop("hidden", false)
		.val("value") // if applicable
		.parent()
		.children()
		.closest("body")
		.find(".test")
		.scrollIntoView()
		.scrollTo(0, 0)
		.fadeIn(300)
		.fadeOut(300)
		.fadeToggle(300)
		.animate({ opacity: "1" }, 300)
		.typewriter("Typing test", 20)
		.loopAnimations([(x) => x.fadeIn(), (x) => x.fadeOut()], 1000)
		.scrollReveal(0.1, 300);

	console.log("=== ✅ すべての関数が呼び出されました（目視とログで確認） ===");
}

window.addEventListener("DOMContentLoaded", testChainX);
