function testUtilityExtensions() {
	console.log("=== 🔥 Utility Extensions Test Start ===");

	// --- exists ---
	const div1 = document.createElement("div");
	const div2 = document.createElement("div");
	div1.className = "exists-test-1";
	div2.className = "exists-test-2";
	document.body.appendChild(div1); // div1は画面上に存在する
	// div2はappendしないので画面上に存在しない

	// 単体Element (存在する)
	$X(div1).exists().log("exists (should be true)");

	// 単体Element (存在しない)
	$X(div2).exists().log("exists (should be false)");

	// NodeList (存在する要素を含む)
	$X(document.querySelectorAll(".exists-test-1"))
		.exists()
		.log("exists (should be true)");

	// 空NodeList（存在しない）
	$X(document.querySelectorAll(".non-existent-class"))
		.exists()
		.log("exists (should be false)");

	// 配列や文字列など (基本 false)
	$X([1, 2, 3]).exists().log("exists (should be false)");
	$X("string").exists().log("exists (should be false)");

	// --- flatten ---
	$X([1, [2, [3, [4]]]])
		.flatten()
		.log("flatten");

	// --- distinctBy ---
	$X([{ id: 1 }, { id: 2 }, { id: 1 }])
		.distinctBy((item) => item.id)
		.log("distinctBy");

	// --- branch ---
	$X(10)
		.branch(
			(v) => v > 5,
			(x) => x.pipe((n) => n * 10),
			(x) => x.pipe((n) => n * -1)
		)
		.log("branch (should be 100)");

	$X(2)
		.branch(
			(v) => v > 5,
			(x) => x.pipe((n) => n * 10),
			(x) => x.pipe((n) => n * -1)
		)
		.log("branch (should be -2)");

	// --- throwIf ---
	try {
		$X(5)
			.throwIf((v) => v < 10, "Value too small")
			.log("should not reach here");
	} catch (e) {
		console.warn("throwIf caught:", e.message);
	}

	console.log("=== ✅ Utility Extensions Test End ===");
}

window.addEventListener("DOMContentLoaded", testUtilityExtensions);
