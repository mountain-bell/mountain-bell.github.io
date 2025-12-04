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
					お問い合わせ ➡ <a href="https://x.com/mountain_bell" target="_blank">https://x.com/mountain_bell</a>
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
