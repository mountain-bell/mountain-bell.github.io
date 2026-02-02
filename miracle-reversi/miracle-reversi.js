(function ($) {
	$(function () {
		//----------------------------------------
		// 変数初期値
		//----------------------------------------
		// ゲーム進行状況
		let status;
		const INIT = "init";
		const RUNNING = "running";
		const END = "end";
		// 黒白ターン
		let turn;
		// 黒白空値
		const BLACK = "black";
		const WHITE = "white";
		const SPACE = "space";
		// 黒白カウントダウン
		let limit_black = 0;
		let count_black = 0;
		let limit_white = 0;
		let count_white = 0;
		// 遅延時間
		let delay_time = 0;
		// ターン経過カウント
		let turn_count = 0;
		// 特殊機能 スーパー・リバーシ・アタック
		const super_count = 22;
		let super_activated_black = false;
		let super_activated_white = false;
		let button_super_black = false;
		let button_super_white = false;
		// 特殊機能 ダブル・アタック
		const double_count = 18;
		let double_activated_black = false;
		let double_activated_white = false;
		let double_flag = false;
		let button_double_black = false;
		let button_double_white = false;
		// 特殊機能 ミラクル・タイム
		const miracle_count = 12;
		let miracle_activated_black = false;
		let miracle_activated_white = false;
		let keep_miracle_black = false;
		let keep_miracle_white = false;
		let button_miracle_black = false;
		let button_miracle_white = false;
		// 基盤最小最大値
		const PIECE_MIN = 1;
		const PIECE_MAX = 8;
		// モーダル非表示制御
		let modal_close = false;
		// カウントダウンストップ制御
		let count_stop = false;

		//----------------------------------------
		// リバーシ基盤初期表示
		//----------------------------------------
		function init() {
			// 基盤作成
			$("#reversi_tbody").empty();
			for (let trCount = 1; trCount < 9; trCount++) {
				$("#reversi_tbody").append(
					`<tr id="reversi_tr-${trCount}">
					</tr>`
				);
				for (let tdCount = 1; tdCount < 9; tdCount++) {
					$(`#reversi_tr-${trCount}`).append(
						`<td>
							<button type="button" class="reversi_piece" id="piece_${trCount}-${tdCount}" value="${SPACE}"></button>
						</td>`
					);
				}
			}
			// 石の初期配置
			$("#piece_4-4").val(WHITE);
			$("#piece_4-4").addClass("white_piece");
			$("#piece_4-5").val(BLACK);
			$("#piece_4-5").addClass("black_piece");
			$("#piece_5-4").val(BLACK);
			$("#piece_5-4").addClass("black_piece");
			$("#piece_5-5").val(WHITE);
			$("#piece_5-5").addClass("white_piece");
			// カウントダウンの表示
			if (status != INIT) {
				limitBlack();
				limitWhite();
			}
			// ステータスの設定
			status = INIT;
			// ボタンの制御
			$(".init_option").removeClass("inactive");
			$(".vertical").addClass("inactive");
			super_activated_black = false;
			super_activated_white = false;
			double_activated_black = false;
			double_activated_white = false;
			miracle_activated_black = false;
			miracle_activated_white = false;
			keep_miracle_black = false;
			keep_miracle_white = false;
			$("#button_miracle_black").removeClass("keep_special");
			$("#button_miracle_white").removeClass("keep_special");
			// ターンの設定
			turn = BLACK;
			$("#icon_white").removeClass("your_turn");
			$("#icon_black").addClass("your_turn");
		}

		//----------------------------------------
		// 石を置いた時の処理
		//----------------------------------------
		function putReversiPiece(y, x) {
			if (status == END) return;
			// 既に石が置かれてる場所をクリックした場合、処理中断
			if (isAlreadeyPut(y, x)) return;
			// 石反転マーキング処理
			let count = 0;
			if (turnOverUp(searchUp(y, x), y, x)) count++;
			if (turnOverRightUp(searchRightUp(y, x), y, x)) count++;
			if (turnOverRight(searchRight(y, x), y, x)) count++;
			if (turnOverRightUnder(searchRightUnder(y, x), y, x)) count++;
			if (turnOverUnder(searchUnder(y, x), y, x)) count++;
			if (turnOverLeftUnder(searchLeftUnder(y, x), y, x)) count++;
			if (turnOverLeft(searchLeft(y, x), y, x)) count++;
			if (turnOverLeftUp(searchLeftUp(y, x), y, x)) count++;
			// 石反転マーキングが一度も行われなかった場合、処理中断
			if (count == 0) return;
			// 石を置いてひっくり返す処理
			putAndTurnOver(y, x);
			// 1ターン目処理
			if (status == INIT) {
				// ステータスの変更
				status = RUNNING;
				// ボタンの制御
				$(".init_option").addClass("inactive");
				// ターン経過カウントの初期化
				turn_count = 0;
			}
			// ターン経過カウントプラス
			turn_count++;
			// 特殊効果処理（遅延時間設定あり）
			execSpecial();
			// 遅延時間を考慮し、ターン返却処理
			setTimeout(function () {
				// 遅延時間の初期化
				delay_time = 0;
				// ダブル・アタックが発動していない場合、ターン切替処理
				if (!double_flag) turnSwitch();
				double_flag = false;
				// 次の石を置く場所がない場合、ターンパス処理（遅延時間設定あり）
				turnPass(searchNextPutSpace());
				// 継続処理
				if (status != END) {
					// 遅延時間を考慮し、カウントダウン開始処理
					startCountDown(delay_time);
					// 遅延時間を考慮し、特殊効果ボタン活性化処理
					specialActive(delay_time);
				}
				// 遅延時間の初期化
				delay_time = 0;
			}, delay_time);
		}

		//----------------------------------------
		// 石を置いた時に関連する処理
		//----------------------------------------
		// 基盤に意志が既に置かれているか判定
		function isAlreadeyPut(y, x) {
			if ($(`#piece_${y}-${x}`).val() == SPACE) return false;
			return true;
		}
		// 上検索
		function searchUp(y, x) {
			let count = 0;
			while (y > PIECE_MIN) {
				y--;
				if ($(`#piece_${y}-${x}`).val() == turn) return count;
				if ($(`#piece_${y}-${x}`).val() == SPACE) return 0;
				count++;
			}
			return 0;
		}
		// 上反転マーキング
		function turnOverUp(count, y, x) {
			let flag = false;
			while (count > 0) {
				y--;
				$(`#piece_${y}-${x}`).val(turn);
				$(`#piece_${y}-${x}`).addClass("turn_over");
				count--;
				flag = true;
			}
			return flag;
		}
		// 右上検索
		function searchRightUp(y, x) {
			let count = 0;
			while (y > PIECE_MIN && x < PIECE_MAX) {
				y--;
				x++;
				if ($(`#piece_${y}-${x}`).val() == turn) return count;
				if ($(`#piece_${y}-${x}`).val() == SPACE) return 0;
				count++;
			}
			return 0;
		}
		// 右上反転マーキング
		function turnOverRightUp(count, y, x) {
			let flag = false;
			while (count > 0) {
				y--;
				x++;
				$(`#piece_${y}-${x}`).val(turn);
				$(`#piece_${y}-${x}`).addClass("turn_over");
				count--;
				flag = true;
			}
			return flag;
		}
		// 右検索
		function searchRight(y, x) {
			let count = 0;
			while (x < PIECE_MAX) {
				x++;
				if ($(`#piece_${y}-${x}`).val() == turn) return count;
				if ($(`#piece_${y}-${x}`).val() == SPACE) return 0;
				count++;
			}
			return 0;
		}
		// 右反転マーキング
		function turnOverRight(count, y, x) {
			let flag = false;
			while (count > 0) {
				x++;
				$(`#piece_${y}-${x}`).val(turn);
				$(`#piece_${y}-${x}`).addClass("turn_over");
				count--;
				flag = true;
			}
			return flag;
		}
		// 右下検索
		function searchRightUnder(y, x) {
			let count = 0;
			while (y < PIECE_MAX && x < PIECE_MAX) {
				y++;
				x++;
				if ($(`#piece_${y}-${x}`).val() == turn) return count;
				if ($(`#piece_${y}-${x}`).val() == SPACE) return 0;
				count++;
			}
			return 0;
		}
		// 右下反転マーキング
		function turnOverRightUnder(count, y, x) {
			let flag = false;
			while (count > 0) {
				y++;
				x++;
				$(`#piece_${y}-${x}`).val(turn);
				$(`#piece_${y}-${x}`).addClass("turn_over");
				count--;
				flag = true;
			}
			return flag;
		}
		// 下検索
		function searchUnder(y, x) {
			let count = 0;
			while (y < PIECE_MAX) {
				y++;
				if ($(`#piece_${y}-${x}`).val() == turn) return count;
				if ($(`#piece_${y}-${x}`).val() == SPACE) return 0;
				count++;
			}
			return 0;
		}
		// 下反転マーキング
		function turnOverUnder(count, y, x) {
			let flag = false;
			while (count > 0) {
				y++;
				$(`#piece_${y}-${x}`).val(turn);
				$(`#piece_${y}-${x}`).addClass("turn_over");
				count--;
				flag = true;
			}
			return flag;
		}
		// 左下検索
		function searchLeftUnder(y, x) {
			let count = 0;
			while (y < PIECE_MAX && x > PIECE_MIN) {
				y++;
				x--;
				if ($(`#piece_${y}-${x}`).val() == turn) return count;
				if ($(`#piece_${y}-${x}`).val() == SPACE) return 0;
				count++;
			}
			return 0;
		}
		// 左下反転マーキング
		function turnOverLeftUnder(count, y, x) {
			let flag = false;
			while (count > 0) {
				y++;
				x--;
				$(`#piece_${y}-${x}`).val(turn);
				$(`#piece_${y}-${x}`).addClass("turn_over");
				count--;
				flag = true;
			}
			return flag;
		}
		// 左検索
		function searchLeft(y, x) {
			let count = 0;
			while (x > PIECE_MIN) {
				x--;
				if ($(`#piece_${y}-${x}`).val() == turn) return count;
				if ($(`#piece_${y}-${x}`).val() == SPACE) return 0;
				count++;
			}
			return 0;
		}
		// 左反転マーキング
		function turnOverLeft(count, y, x) {
			let flag = false;
			while (count > 0) {
				x--;
				$(`#piece_${y}-${x}`).val(turn);
				$(`#piece_${y}-${x}`).addClass("turn_over");
				count--;
				flag = true;
			}
			return flag;
		}
		// 左上検索
		function searchLeftUp(y, x) {
			let count = 0;
			while (y > PIECE_MIN && x > PIECE_MIN) {
				y--;
				x--;
				if ($(`#piece_${y}-${x}`).val() == turn) return count;
				if ($(`#piece_${y}-${x}`).val() == SPACE) return 0;
				count++;
			}
			return 0;
		}
		// 左上反転マーキング
		function turnOverLeftUp(count, y, x) {
			let flag = false;
			while (count > 0) {
				y--;
				x--;
				$(`#piece_${y}-${x}`).val(turn);
				$(`#piece_${y}-${x}`).addClass("turn_over");
				count--;
				flag = true;
			}
			return flag;
		}
		// 石を置いてひっくり返す処理
		function putAndTurnOver(y, x) {
			$(`#piece_${y}-${x}`).val(turn);
			switch (turn) {
				case BLACK:
					$(`#piece_${y}-${x}`).addClass("black_piece");
					$(".turn_over").removeClass("white_piece");
					$(".turn_over").addClass("black_piece");
					break;
				case WHITE:
					$(`#piece_${y}-${x}`).addClass("white_piece");
					$(".turn_over").removeClass("black_piece");
					$(".turn_over").addClass("white_piece");
					break;
			}
			$(".reversi_piece").removeClass("turn_over");
		}

		//----------------------------------------
		// ターン切替処理
		//----------------------------------------
		function turnSwitch() {
			switch (turn) {
				case BLACK:
					turn = WHITE;
					$("#icon_black").removeClass("your_turn");
					$("#icon_white").addClass("your_turn");
					break;
				case WHITE:
					turn = BLACK;
					$("#icon_white").removeClass("your_turn");
					$("#icon_black").addClass("your_turn");
					break;
			}
		}

		//----------------------------------------
		// ターンパス処理
		//----------------------------------------
		function turnPass(flag) {
			if (!flag) {
				turnSwitch();
				if (searchNextPutSpace()) {
					openModal(`ターンをスキップします。`, true);
				} else {
					judge();
				}
			}
		}

		//----------------------------------------
		// 次の石を置ける場所を判定
		//----------------------------------------
		function searchNextPutSpace() {
			let flag = false;
			for (let y = PIECE_MIN; y <= PIECE_MAX; y++) {
				for (let x = PIECE_MIN; x <= PIECE_MAX; x++) {
					if ($(`#piece_${y}-${x}`).val() == SPACE) {
						let count = 0;
						count += searchUp(y, x);
						count += searchRightUp(y, x);
						count += searchRight(y, x);
						count += searchRightUnder(y, x);
						count += searchUnder(y, x);
						count += searchLeftUnder(y, x);
						count += searchLeft(y, x);
						count += searchLeftUp(y, x);
						if (count > 0) flag = true;
					}
				}
			}
			return flag;
		}

		//----------------------------------------
		// 勝敗判定
		//----------------------------------------
		function judge() {
			status = END;
			let blackCount = 0;
			let whiteCount = 0;
			for (let y = 1; y < 9; y++) {
				for (let x = 1; x < 9; x++) {
					if ($(`#piece_${y}-${x}`).val() == BLACK) blackCount++;
					if ($(`#piece_${y}-${x}`).val() == WHITE) whiteCount++;
				}
			}
			if (blackCount > whiteCount) {
				openModal(`${blackCount}:${whiteCount}で、黒の勝ちです。`, false);
			} else if (blackCount < whiteCount) {
				openModal(`${blackCount}:${whiteCount}で、白の勝ちです。`, false);
			} else {
				openModal(`${blackCount}:${whiteCount}で、引き分けです。`, false);
			}
		}

		//----------------------------------------
		// カウントダウン開始処理
		//----------------------------------------
		function startCountDown(time) {
			// カウントダウンストップ制御オフ
			count_stop = false;
			switch (turn) {
				case BLACK:
					if (limit_black != 0) {
						count_black = limit_black;
						setTimeout(dispCountDownBlack, time);
					}
					break;
				case WHITE:
					if (limit_white != 0) {
						count_white = limit_white;
						setTimeout(dispCountDownWhite, time);
					}
					break;
			}
		}

		//----------------------------------------
		// カウントダウン表示処理
		//----------------------------------------
		// 黒のカウントダウン表示
		function dispCountDownBlack() {
			if (turn != BLACK || status != RUNNING || count_stop) return;
			$("#count_black").empty();
			$("#count_black").append(`count:${count_black}`);
			if (count_black == 0) {
				status = END;
				openModal("時間切れにより、白の勝ちです。", false);
				return;
			}
			count_black--;
			setTimeout(dispCountDownBlack, 1000);
		}
		// 白のカウントダウン表示
		function dispCountDownWhite() {
			if (turn != WHITE || status != RUNNING || count_stop) return;
			$("#count_white").empty();
			$("#count_white").append(`count:${count_white}`);
			if (count_white == 0) {
				status = END;
				openModal("時間切れにより、黒の勝ちです。", false);
				return;
			}
			count_white--;
			setTimeout(dispCountDownWhite, 1000);
		}

		//----------------------------------------
		// オプション 配置変更
		//----------------------------------------
		function sort() {
			if (status != INIT) return;
			if ($("#piece_4-4").val() == WHITE) {
				$("#piece_4-4").removeClass("white_piece");
				$("#piece_5-4").removeClass("black_piece");
				$("#piece_4-4").val(BLACK);
				$("#piece_4-4").addClass("black_piece");
				$("#piece_5-4").val(WHITE);
				$("#piece_5-4").addClass("white_piece");
			} else {
				$("#piece_4-4").removeClass("black_piece");
				$("#piece_5-4").removeClass("white_piece");
				$("#piece_4-4").val(WHITE);
				$("#piece_4-4").addClass("white_piece");
				$("#piece_5-4").val(BLACK);
				$("#piece_5-4").addClass("black_piece");
			}
		}

		//----------------------------------------
		// オプション 制限時間
		//----------------------------------------
		function limit() {
			if (status != INIT) return;
			limitBlack();
			limitWhite();
		}

		//----------------------------------------
		// オプション 黒ハンデ（カウント設定・初期化の処理でも利用）
		//----------------------------------------
		function limitBlack() {
			if (status == INIT) {
				if (limit_black == 0) {
					limit_black = 30;
				} else if (limit_black <= 10) {
					limit_black -= 5;
				} else {
					limit_black -= 10;
				}
			}
			$("#count_black").empty();
			if (limit_black == 0) {
				$("#count_black").append(`count:∞`);
			} else {
				$("#count_black").append(`count:${limit_black}`);
			}
			// オプション欄表示用
			$("#option_disp_count_black").empty();
			if (limit_black == 0) {
				$("#option_disp_count_black").append(`なし`);
			} else {
				$("#option_disp_count_black").append(`${limit_black} 秒`);
			}
		}

		//----------------------------------------
		// オプション 白ハンデ（カウント設定・初期化の処理でも利用）
		//----------------------------------------
		function limitWhite() {
			if (status == INIT) {
				if (limit_white == 0) {
					limit_white = 30;
				} else if (limit_white <= 10) {
					limit_white -= 5;
				} else {
					limit_white -= 10;
				}
			}
			$("#count_white").empty();
			if (limit_white == 0) {
				$("#count_white").append(`count:∞`);
			} else {
				$("#count_white").append(`count:${limit_white}`);
			}
			// オプション欄表示用
			$("#option_disp_count_white").empty();
			if (limit_white == 0) {
				$("#option_disp_count_white").append(`なし`);
			} else {
				$("#option_disp_count_white").append(`${limit_white} 秒`);
			}
		}

		//----------------------------------------
		// 特殊効果ボタン活性化
		//----------------------------------------
		function specialActive(time) {
			switch (turn) {
				case BLACK:
					if (turn_count >= super_count && super_activated_black == false)
						setTimeout(function () {
							$("#button_super_black").removeClass("inactive");
							super_activated_black = true;
						}, time);
					if (turn_count >= double_count && double_activated_black == false)
						setTimeout(function () {
							$("#button_double_black").removeClass("inactive");
							double_activated_black = true;
						}, time);
					if (turn_count >= miracle_count && miracle_activated_black == false)
						setTimeout(function () {
							$("#button_miracle_black").removeClass("inactive");
							miracle_activated_black = true;
						}, time);
					break;
				case WHITE:
					if (turn_count >= super_count && super_activated_white == false)
						setTimeout(function () {
							$("#button_super_white").removeClass("inactive");
							super_activated_white = true;
						}, time);
					if (turn_count >= double_count && double_activated_white == false)
						setTimeout(function () {
							$("#button_double_white").removeClass("inactive");
							double_activated_white = true;
						}, time);
					if (turn_count >= miracle_count && miracle_activated_white == false)
						setTimeout(function () {
							$("#button_miracle_white").removeClass("inactive");
							miracle_activated_white = true;
						}, time);
					break;
			}
		}

		//----------------------------------------
		// 特殊効果制御
		//----------------------------------------
		function specialControl(id) {
			if (id != "button_super_black") button_super_black = false;
			if (id != "button_super_white") button_super_white = false;
			if (id != "button_double_black") button_double_black = false;
			if (id != "button_double_white") button_double_white = false;
			if (id != "button_miracle_black") button_miracle_black = false;
			if (id != "button_miracle_white") button_miracle_white = false;
		}

		//----------------------------------------
		// 特殊効果実行
		//----------------------------------------
		function execSpecial() {
			switch (true) {
				case button_super_black:
					execSuper();
					break;
				case button_super_white:
					execSuper();
					break;
				case button_double_black:
					execDouble();
					break;
				case button_double_white:
					execDouble();
					break;
				case button_miracle_black:
					execMiracle();
					break;
				case button_miracle_white:
					execMiracle();
					break;
			}
			button_super_black = false;
			button_super_white = false;
			button_double_black = false;
			button_double_white = false;
			button_miracle_black = false;
			button_miracle_white = false;
			switch (turn) {
				case BLACK:
					if (keep_miracle_black) execMiracleKeep();
					break;
				case WHITE:
					if (keep_miracle_white) execMiracleKeep();
					break;
			}
		}

		//----------------------------------------
		// 特殊効果 スーパー・リバーシ・アタック
		//----------------------------------------
		// ボタンオン
		function buttonSuper(id) {
			if (status != RUNNING) return;
			switch (turn) {
				case BLACK:
					if (!super_activated_black) return;
					if (id != "button_super_black") return;
					button_super_black = !button_super_black;
					$("button").removeClass("on_special");
					if (button_super_black)
						$("#button_super_black").addClass("on_special");
					break;
				case WHITE:
					if (!super_activated_white) return;
					if (id != "button_super_white") return;
					button_super_white = !button_super_white;
					$("button").removeClass("on_special");
					if (button_super_white)
						$("#button_super_white").addClass("on_special");
					break;
			}
			specialControl(id);
		}
		// 実行
		function execSuper() {
			openModal(`スーパー・リバーシ・アタック！`, true);
			const turn_now = turn;
			// 乱数により反転マーキングする場所を変える
			const random = Math.floor(Math.random() * 11);
			if (random == 0) {
				turnOverRightUnder(8, 0, 0);
				turnOverRightUp(8, 9, 0);
			} else if (random <= 3) {
				turnOverRight(4, 1, 2);
				turnOverUnder(4, 2, 8);
				turnOverLeft(4, 8, 7);
				turnOverUp(4, 7, 1);
			} else {
				turnOverRight(3, 3, 2);
				turnOverUnder(3, 2, 6);
				turnOverLeft(3, 6, 7);
				turnOverUp(3, 7, 3);
			}
			// ひっくり返す処理と特殊効果非活性処理（遅延あり）
			setTimeout(function () {
				switch (turn_now) {
					case BLACK:
						$(".turn_over").removeClass("white_piece");
						$(".turn_over").addClass("black_piece");
						$("button").removeClass("on_special");
						$("#button_super_black").addClass("inactive");
						break;
					case WHITE:
						$(".turn_over").removeClass("black_piece");
						$(".turn_over").addClass("white_piece");
						$("button").removeClass("on_special");
						$("#button_super_white").addClass("inactive");
						break;
				}
				$(".reversi_piece").removeClass("turn_over");
			}, 1500);
		}

		//----------------------------------------
		// 特殊効果 ダブル・アタック
		//----------------------------------------
		// ボタンオン
		function buttonDouble(id) {
			if (status != RUNNING) return;
			switch (turn) {
				case BLACK:
					if (!double_activated_black) return;
					if (id != "button_double_black") return;
					button_double_black = !button_double_black;
					$("button").removeClass("on_special");
					if (button_double_black)
						$("#button_double_black").addClass("on_special");
					break;
				case WHITE:
					if (!double_activated_white) return;
					if (id != "button_double_white") return;
					button_double_white = !button_double_white;
					$("button").removeClass("on_special");
					if (button_double_white)
						$("#button_double_white").addClass("on_special");
					break;
			}
			specialControl(id);
		}
		// 実行
		function execDouble() {
			openModal(`ダブル・アタック！`, true);
			const turn_now = turn;
			// ダブル・アタックフラグを立てる
			double_flag = true;
			// 特殊効果非活性処理（遅延あり）
			setTimeout(function () {
				switch (turn_now) {
					case BLACK:
						$("button").removeClass("on_special");
						$("#button_double_black").addClass("inactive");
						break;
					case WHITE:
						$("button").removeClass("on_special");
						$("#button_double_white").addClass("inactive");
						break;
				}
			}, 1500);
		}

		//----------------------------------------
		// ミラクル・タイム
		//----------------------------------------
		// ボタンオン
		function buttonMiracle(id) {
			if (status != RUNNING) return;
			switch (turn) {
				case BLACK:
					if (!miracle_activated_black) return;
					if (id != "button_miracle_black") return;
					button_miracle_black = !button_miracle_black;
					$("button").removeClass("on_special");
					if (button_miracle_black)
						$("#button_miracle_black").addClass("on_special");
					break;
				case WHITE:
					if (!miracle_activated_white) return;
					if (id != "button_miracle_white") return;
					button_miracle_white = !button_miracle_white;
					$("button").removeClass("on_special");
					if (button_miracle_white)
						$("#button_miracle_white").addClass("on_special");
					break;
			}
			specialControl(id);
		}
		// 実行
		function execMiracle() {
			openModal(`ミラクル・タイム！`, true);
			const turn_now = turn;
			// 乱数により継続するか決める
			const random = Math.floor(Math.random() * 4);
			// 乱数により反転マーキングする場所を決める
			const y = Math.floor(Math.random() * 8) + 1;
			const x = Math.floor(Math.random() * 8) + 1;
			$(`#piece_${y}-${x}`).val(turn);
			$(`#piece_${y}-${x}`).addClass("turn_over");
			// ひっくり返す処理と特殊効果非活性処理（遅延あり）
			setTimeout(function () {
				switch (turn_now) {
					case BLACK:
						$(".turn_over").removeClass("white_piece");
						$(".turn_over").addClass("black_piece");
						$("button").removeClass("on_special");
						if (random == 0) {
							$("#button_miracle_black").addClass("inactive");
						} else {
							keep_miracle_black = true;
							$("#button_miracle_black").addClass("keep_special");
						}
						break;
					case WHITE:
						$(".turn_over").removeClass("black_piece");
						$(".turn_over").addClass("white_piece");
						$("button").removeClass("on_special");
						if (random == 0) {
							$("#button_miracle_white").addClass("inactive");
						} else {
							keep_miracle_white = true;
							$("#button_miracle_white").addClass("keep_special");
						}
						break;
				}
				$(".reversi_piece").removeClass("turn_over");
			}, 1500);
		}
		// 継続実行
		function execMiracleKeep() {
			// 乱数により継続するか決める
			const random = Math.floor(Math.random() * 3);
			// 乱数により反転マーキングする場所を決める
			const y = Math.floor(Math.random() * 8) + 1;
			const x = Math.floor(Math.random() * 8) + 1;
			$(`#piece_${y}-${x}`).val(turn);
			$(`#piece_${y}-${x}`).addClass("turn_over_miracle");
			// ひっくり返す処理
			switch (turn) {
				case BLACK:
					$(".turn_over_miracle").removeClass("white_piece");
					$(".turn_over_miracle").addClass("black_piece");
					if (random == 0) {
						keep_miracle_black = false;
						$("#button_miracle_black").removeClass("keep_special");
						$("#button_miracle_black").addClass("inactive");
					}
					break;
				case WHITE:
					$(".turn_over_miracle").removeClass("black_piece");
					$(".turn_over_miracle").addClass("white_piece");
					if (random == 0) {
						keep_miracle_white = false;
						$("#button_miracle_white").removeClass("keep_special");
						$("#button_miracle_white").addClass("inactive");
					}
					break;
			}
			$(".reversi_piece").removeClass("turn_over_miracle");
		}

		//----------------------------------------
		// モーダル表示処理
		//----------------------------------------
		function openModal(text, flag) {
			$(".modal_text").empty();
			$(".modal_text").append(text);
			switch (turn) {
				case BLACK:
					$("#modal_black").addClass("active");
					break;
				case WHITE:
					$("#modal_white").addClass("active");
					break;
			}
			// モーダル非表示制御オン
			modal_close = true;
			// カウントダウンストップ制御オン
			count_stop = true;
			if (flag) {
				// 1.5秒後にモーダル非表示処理
				setTimeout(closeModal, 1500);
				// 後続処理のための遅延設定（2秒）
				delay_time = 2000;
			}
		}

		//----------------------------------------
		// モーダル非表示処理
		//----------------------------------------
		function closeModal() {
			// 自動非表示モーダル制御オンの場合、オフにして処理続行
			if (!modal_close) return;
			modal_close = false;
			// モーダルが閉じた後、0.5秒ボタンを押下できなくする
			$("button").addClass("silent_inactive");
			$(".modal_area").removeClass("active");
			setTimeout(function () {
				$("button").removeClass("silent_inactive");
			}, 500);
		}

		//----------------------------------------
		// ページ読み込み時処理
		//----------------------------------------
		(function () {
			init();
		})();

		//----------------------------------------
		// 画面遷移機能取得
		//----------------------------------------
		function getFunction(id) {
			let y;
			let x;
			if (id.startsWith("piece_")) {
				y = id.charAt(6);
				x = id.charAt(8);
				id = "piece_y-x";
			}
			switch (id) {
				case "piece_y-x":
					putReversiPiece(y, x);
					break;
				case "button_init":
					init();
					break;
				case "button_sort":
					sort();
					break;
				case "button_limit":
					limit();
					break;
				case "button_limit_black":
					limitBlack();
					break;
				case "button_limit_white":
					limitWhite();
					break;
				case "button_ok_black":
					closeModal();
					break;
				case "button_ok_white":
					closeModal();
					break;
				case "button_super_black":
					buttonSuper(id);
					break;
				case "button_super_white":
					buttonSuper(id);
					break;
				case "button_double_black":
					buttonDouble(id);
					break;
				case "button_double_white":
					buttonDouble(id);
					break;
				case "button_miracle_black":
					buttonMiracle(id);
					break;
				case "button_miracle_white":
					buttonMiracle(id);
					break;
				default:
					alert("機能ID取得エラー");
			}
		}
		window.globalFunction = {};
		window.globalFunction.getFunction = getFunction;
	});
})(jQuery);
