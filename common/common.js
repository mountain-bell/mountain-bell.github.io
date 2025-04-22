(function ($) {
	$(function () {
		//----------------------------------------
		// ボタン制御
		//----------------------------------------
		$(document).on("click", "button", function () {
			$("button").prop("disabled", true);
			window.globalFunction.getFunction($(this).attr("id"));
			$("button").prop("disabled", false);
		});

		//----------------------------------------
		// サブミット制御
		//----------------------------------------
		let loading = true;
		$(document).submit(function () {
			$("button").prop("disabled", true);
			if (loading) {
				// フォームのパラメータを表示
				let param = JSON.stringify($("form").serializeArray());
				$("body").append(
					`<div class="loading">
						<div id="now_loading">
							Now Loading
						</div>
						<div>
							Param:${param}
						</div>
					</div>`
				);
				// ローディング演出
				setTimeout(function () {
					$("#now_loading").append(".");
					setTimeout(function () {
						$("#now_loading").append(".");
						setTimeout(function () {
							$("#now_loading").append(".");
							setTimeout(function () {
								loading = false;
								$("form").off("submit");
								$("form").submit();
							}, 500);
						}, 500);
					}, 500);
				}, 500);
				return false;
			} else {
				$(".loading").remove();
			}
		});

		//----------------------------------------
		// ヘッダー設定
		//----------------------------------------
		function setHeader() {
			$("header").append(
				`<div class="icon_mountain">
					<div class="icon_bell_left"></div>
					<div class="icon_bell"></div>
					<div class="icon_bell_right"></div>
				</div>
				<div>
					<div class="company_type">
						PERSONAL MANUFACTURING STUDIO
					</div>
					<div class="company_name">
						MOUNTAIN BELL
					</div>
				</div>`
			);
		}

		//----------------------------------------
		// フッター設定
		//----------------------------------------
		function setFooter() {
			$("footer").append(
				`<div class="contact_information">
					お問い合わせ ➡ https://twitter.com/mountain_bell
				</div>`
			);
		}

		//----------------------------------------
		// 初期表示制御
		//----------------------------------------
		(function () {
			setHeader();
			setFooter();
			$("button").prop("disabled", false);
		})();
	});
})(jQuery);
