(function ($) {
	$(function () {
		//----------------------------------------
		// 変数初期値
		//----------------------------------------
		// パラメータカウント
		let count = 0;

		//----------------------------------------
		// パラメータ追加
		//----------------------------------------
		function buttonAddParam() {
			count++;
			$("#tbody_add_param").append(
				`<tr>
					<td>
						<input type="text" id="input_name-${count}"/>
					</td>
					<td>
						<input type="text" id="input_value-${count}"/>
					</td>
				</tr>`
			);
		}

		//----------------------------------------
		// クリア
		//----------------------------------------
		function buttonClear() {
			count = 0;
			$("#input_name-0").val(null);
			$("#input_value-0").val(null);
			$("#input_value-0").attr("name", null);
			$("#tbody_add_param").empty();
		}

		//----------------------------------------
		// POST送信
		//----------------------------------------
		function buttonMethodPost() {
			let form = $("#button_method_post").parents(".container").find("form");
			form.attr("method", "post");
			form.attr("action", $("#input_url").val());
			setParam();
			form.submit();
		}

		//----------------------------------------
		// GET送信
		//----------------------------------------
		function buttonMethodGet() {
			let form = $("#button_method_get").parents(".container").find("form");
			form.attr("method", "get");
			form.attr("action", $("#input_url").val());
			setParam();
			form.submit();
		}

		//----------------------------------------
		// パラメータ設定
		//----------------------------------------
		function setParam() {
			for (let i = 0; i <= count; i++) {
				let nameId = `#input_name-${i}`;
				let valueId = `#input_value-${i}`;
				$(valueId).attr("name", $(nameId).val());
			}
		}

		//----------------------------------------
		// 画面遷移機能取得
		//----------------------------------------
		function getFunction(id) {
			switch (id) {
				case "button_add_param":
					buttonAddParam();
					break;
				case "button_clear":
					buttonClear();
					break;
				case "button_method_post":
					buttonMethodPost();
					break;
				case "button_method_get":
					buttonMethodGet();
					break;
				default:
					alert("機能ID取得エラー");
			}
		}
		window.globalFunction = {};
		window.globalFunction.getFunction = getFunction;
	});
})(jQuery);
