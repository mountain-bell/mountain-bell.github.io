(function ($) {
	$(function () {
		//----------------------------------------
		// ファイル選択 関連処理
		//----------------------------------------
		function buttonFileSelect() {
			$("#upfile").click();
		}
		// ファイル名表示
		$(document).on("change", "#upfile", function (event) {
			$("#upfile_disp").val(event.target.files[0].name);
			// エラーメッセージ初期化
			$(".error_msg").remove();
		});
		// ドラッグオーバー デフォルト処理無効
		$("#drop_area").on("dragover", function (event) {
			event.preventDefault();
		});
		// ドラッグ デフォルト処理無効
		$("#drop_area").on("dragleave drop", function (event) {
			event.preventDefault();
		});
		// ドロップ
		$("#drop_area").on("drop", function (event) {
			event.preventDefault();
			let files = event.originalEvent.dataTransfer.files;
			$("#upfile_disp").val(files[0].name);
			$("#upfile").prop("files", files);
			// エラーメッセージ初期化
			$(".error_msg").remove();
		});

		//----------------------------------------
		// ファイルクリア
		//----------------------------------------
		function buttonFileClear() {
			$("#upfile").val(null);
			$("#upfile_disp").val(null);
		}

		//----------------------------------------
		// テンプレート
		//----------------------------------------
		function buttonTextTemplate() {
			$("#input_process").val(
				"項目1は{cell_1}です。\n項目2は{cell_2}です。\n次の列があれば、下に表示されます。\n"
			);
		}

		//----------------------------------------
		// テキストクリア
		//----------------------------------------
		function buttonTextClear() {
			$("#input_process").val(null);
			$("#output_process").val(null);
		}

		//----------------------------------------
		// CSV加工
		//----------------------------------------
		function buttonProcessCsv() {
			// 加工用変数を設定
			let input_process = $("#input_process").val();
			let output_process = "";
			// エラーメッセージ初期化
			$(".error_msg").remove();
			// ファイル選択用のinput要素からファイルを取得
			const file = $("#upfile")[0].files[0];
			if (!file) {
				let error_msg = "ファイルが選択されていません！";
				// ログに出力
				console.log(error_msg);
				// エラーメッセージを表示
				$(".error_message_area").append(
					`<div class="error_msg">${error_msg}</div>`
				);
				// 画面上部にスクロールする
				window.scrollTo({ top: 0, behavior: "smooth" });
				return;
			}
			// FileReaderオブジェクトを生成
			const reader = new FileReader();
			// ファイルの読み込みが完了したときの処理
			reader.onload = function (event) {
				// ファイルの内容を取得
				const contents = event.target.result;
				// CSVファイルの行ごとに処理
				let rows = contents.split("\n");
				// 行を回す
				rows.forEach((row, rowIndex) => {
					// 改行だけの行で置換処理を止める
					if (row) {
						// 行をカンマで分割してセルをトリム
						const cells = row.split(",").map((cell) => cell.trim());
						// 加工用変数をコピー
						let input_process_copy = input_process;
						// カラムを回す
						cells.forEach((cell, columnIndex) => {
							// カラム用変数を設定
							let cell_no = "cell_" + (columnIndex + 1);
							// カラム置換用変数を設定
							let cell_no_mark = `\{${cell_no}\}`;
							// カラムの値を変数に設定
							window[cell_no] = cell;
							// ログに出力
							console.log(
								cell_no + " in row " + (rowIndex + 1) + ":",
								window[cell_no]
							);
							// 置換処理
							input_process_copy = input_process_copy
								.split(cell_no_mark)
								.join(window[cell_no]);
						});
						// 各行アウトプット連結
						output_process = output_process + input_process_copy;
					}
				});
				// CSV加工アウトプット
				$("#output_process").val(output_process);
			};
			// ファイルの読み込みを実行
			reader.readAsText(file);
		}

		//----------------------------------------
		// ダウンロード
		//----------------------------------------
		function buttonDlTextfile() {
			// ダウンロードするテキストファイルの内容
			const textContent = $("#output_process").val();
			// Blobオブジェクトを作成
			const blob = new Blob([textContent], { type: "text/plain" });
			// a要素を作成
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = "process-csv.txt";
			// a要素をクリックしてファイルをダウンロード
			link.click();
			// 不要になったURLオブジェクトを解放
			window.URL.revokeObjectURL(link.href);
			// a要素を削除
			link.remove();
		}

		//----------------------------------------
		// 画面遷移機能取得
		//----------------------------------------
		function getFunction(id) {
			switch (id) {
				case "button_file_select":
					buttonFileSelect();
					break;
				case "button_file_clear":
					buttonFileClear();
					break;
				case "button_text_template":
					buttonTextTemplate();
					break;
				case "button_text_clear":
					buttonTextClear();
					break;
				case "button_process_csv":
					buttonProcessCsv();
					break;
				case "button_dl_textfile":
					buttonDlTextfile();
					break;
				default:
					alert("機能ID取得エラー");
			}
		}
		window.globalFunction = {};
		window.globalFunction.getFunction = getFunction;
	});
})(jQuery);
