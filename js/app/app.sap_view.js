/* Source File Upload Time : 6-17-20 5:05:12 PM*/
/* Source File Upload Time : 2019-05-16 12:54:12 PM*/

/**
 * SAP 결재목록 조회, 2025.11.18 by Choo
 */
(function (_$$, $) {
	_$$.sap_view = {
		com: {
			fSearchPreApprList: function (doc, opt) {
				var _me = this;
				var _doc = doc;
				var _opt = opt;
				var _formkey = _opt.vFormkey;


				if (_formkey == "AF215") {
					_me.fSearchPreApprList_AF215(_doc, _opt);
				}
				else if (_formkey == "AF216") {
					_me.fSearchPreApprList_AF216(_doc, _opt);
				}

			}

			, fSearchPreApprList_AF215: async function (doc, opt) {

				var _me = this;
				var _doc = doc, _opt = opt, _el = _doc.element;

				var _formkey = _opt.vFormkey;
				var empNo = $("[name=ed_Data02]", _el).xval();
				var CardNo = $("select[name='ed_Data03']", _el).xval();
				var startDate = $("[name=ed_StartDate]", _el).xval();
				var endDate = $("[name=ed_EndDate]", _el).xval();
				var chkList1 = $("input[name='ed_Data01']:checked", _el).xval();
				console.log(empNo)
				let userNoToSend = empNo;
				let cardNoToSend = CardNo;

				if (chkList1 == "G") {
					if (_opt.vKOSTL == "") {
						$fn.alert({ msg: "코스트 센터가 없습니다. 코스트 센터를 확인하십시오." });
						return;
					}
					if (CardNo == "-") {
						$fn.alert({ msg: "카드번호 선택하십시오." });
						return;
					}
				}

				if (chkList1 === "P") {
					// 개인형 카드일 때 카드번호를 비움
					cardNoToSend = "";
				} else if (chkList1 === "G") {
					// 공용 카드일 때 사번을 비움
					userNoToSend = "";
				}

				startDate = startDate.replace(/-/g, "");
				endDate = endDate.replace(/-/g, "");

				if (startDate > endDate) {
					$fn.alert({ msg: "조회 일자를 확인해 주십시오." });
					return;
				}

				var _sapis_url = $fn.getSysinfo().restserverurl;
				var _sapis_auth = $fn.getSysinfo().restserverauthorization;

				// 필수 정보가 누락된 경우 즉시 종료
				if (!_sapis_url || !_sapis_auth) {
					console.error("API 접속 정보(URL 또는 인증)가 누락되었습니다.");
					$fn.alert({ msg: "API 접속 정보를 확인할 수 없습니다." });
					return;
				}
				console.log(userNoToSend)
				var _sap_opt = {
					"functionName": "ZFI0010_GW_CORPCD_BUY_EXPORT",
					"parameters": {
						"I_FDATE": startDate,
						"I_EDATE": endDate,
						"I_USERNO": userNoToSend,
						"I_CARDNO": cardNoToSend
					}
				};

				try {
					var response = await fetch(_sapis_url, {
						method: 'POST',
						headers: {
							'accept': 'application/json',
							'Authorization': _sapis_auth,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(_sap_opt)
					});

					if (!response.ok) {
						// HTTP 상태 코드가 200이 아닐 경우
						throw new Error(`API 네트워크 응답 오류: ${response.status} ${response.statusText}`);
					}

					var result = await response.json();

					// 이 부분이 여전히 가장 큰 잠재적 오류 원인입니다.
					// cbDrawRFC01 함수가 JSON 객체(result) 대신 HTML 문자열을 기대하면 오류가 납니다.
					_me.cbDrawRFC01(_doc, _opt, result, _formkey);

				} catch (error) {
					console.error("SAP RFC 호출 실패:", error);
					$fn.alert({ msg: "매입 내역 조회 중 오류가 발생했습니다. 상세 오류: " + error.message });
				}

				return;
			}
			, fSearchPreApprList_AF216: async function (doc, opt) {

				var _me = this;
				var _doc = doc, _opt = opt, _el = _doc.element;

				var _formkey = _opt.vFormkey;
				var empNo = $("[name=ed_Data02_1]", _el).xval();
				var startDate = $("[name=ed_StartDate_1]", _el).xval();
				var endDate = $("[name=ed_EndDate_1]", _el).xval();

				var _sapis_url = $fn.getSysinfo().restserverurl;
				var _sapis_auth = $fn.getSysinfo().restserverauthorization;

				// 필수 정보가 누락된 경우 즉시 종료
				if (!_sapis_url || !_sapis_auth) {
					console.error("API 접속 정보(URL 또는 인증)가 누락되었습니다.");
					$fn.alert({ msg: "API 접속 정보를 확인할 수 없습니다." });
					return;
				}

				startDate = startDate.replace(/-/g, "");
				endDate = endDate.replace(/-/g, "");

				if (startDate > endDate) {
					$fn.alert({ msg: "조회 일자를 확인해 주십시오." });
					return;
				}
				var _sap_opt = {
					"functionName": "ZFI0010_GW_BELNR_EXPORT",
					"parameters": {
						"I_FDATE": startDate,
						"I_EDATE": endDate,
						"I_USERNO": empNo
					}
				};

				try {
					var response = await fetch(_sapis_url, {
						method: 'POST',
						headers: {
							'accept': 'application/json',
							'Authorization': _sapis_auth,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(_sap_opt)
					});

					if (!response.ok) {
						// HTTP 상태 코드가 200이 아닐 경우
						throw new Error(`API 네트워크 응답 오류: ${response.status} ${response.statusText}`);
					}

					var result = await response.json();

					// 이 부분이 여전히 가장 큰 잠재적 오류 원인입니다.
					// cbDrawRFC01 함수가 JSON 객체(result) 대신 HTML 문자열을 기대하면 오류가 납니다.
					_me.cbDrawRFC01(doc, opt, result, _formkey);

				} catch (error) {
					console.error("SAP RFC 호출 실패:", error);
					$fn.alert({ msg: "매입 내역 조회 중 오류가 발생했습니다. 상세 오류: " + error.message });
				}
				return;
			}
			, cbDrawRFC01: function (doc, opt, data, vFormKey) {
				var _me = this;
				var _doc = doc, _opt = opt, _el = _doc.element;
				_me.fieldNameSet = "";

				// 1. 데이터 유효성 체크
				if (!data || !data.result || data.result !== "S" || !data.data || !data.data.T_TABLE) {
					return false;
				}

				var tTable = data.data.T_TABLE;
				var allColumns = tTable.columns;
				var rows = tTable.rows;

				// ---------------------------------------------------------
				// [판단 로직] 들어온 데이터가 '신규(전표)'인지 '기존(카드)'인지 확인
				// ---------------------------------------------------------
				var isNewMode = false;
				var isNewMode = (vFormKey !== "AF215");

				// ---------------------------------------------------------
				// 2. 모드에 따른 컬럼 및 설정 정의
				// ---------------------------------------------------------
				var viewColumnIDs = [];
				var customTitles = {};
				var amountColumns = [];

				if (isNewMode) {
					// [AF215] 전표 내역 설정 (순서 변경: 전송일 -> 결재전송번호)
					viewColumnIDs = [
						"FIELD01", // 전송일 (1번)
						"GWSEQ",   // 결재전송번호 (2번)
						"FIELD02", "FIELD03", "FIELD04",
						"FIELD05", "FIELD06", "FIELD07", "FIELD08", "FIELD09"
					];
					amountColumns = ["FIELD08", "FIELD09"];
					customTitles = {
						"FIELD01": "전송일", "GWSEQ": "결재전송<br>번호", "FIELD02": "레이아웃",
						"FIELD03": "계정과목<br>코드", "FIELD04": "계정과목명", "FIELD05": "거래처<br>코드",
						"FIELD06": "거래처명", "FIELD07": "적요", "FIELD08": "금액<br>(원화)", "FIELD09": "금액<br>(외화)"
					};
				} else {
					// [AF216] 카드 승인 내역 설정 (변경 없음)
					viewColumnIDs = [
						"AUTH_DD", "AUTH_HH", "CARD_NO", "AUTH_AMT", "SUPP_PRICE",
						"SURTAX", "SVC_AMT", "MER_NM", "MER_ADR1", "MER_BIZNO"
					];
					amountColumns = ["AUTH_AMT", "SUPP_PRICE", "SURTAX", "SVC_AMT"];
					customTitles = {
						"AUTH_DD": "승인<br>일자", "AUTH_HH": "승인<br>시간", "CARD_NO": "카드<br>번호",
						"AUTH_AMT": "승인<br>금액", "SUPP_PRICE": "공급<br>가액", "SURTAX": "부가세",
						"SVC_AMT": "봉사료", "MER_NM": "가맹점<br>명", "MER_ADR1": "가맹점<br>주소", "MER_BIZNO": "가맹점<br>사업자번호"
					};
				}

				// 타겟 컬럼 매핑
				var targetColumns = [];
				for (var k = 0; k < viewColumnIDs.length; k++) {
					for (var m = 0; m < allColumns.length; m++) {
						if (allColumns[m].name === viewColumnIDs[k]) {
							targetColumns.push(allColumns[m]);
							break;
						}
					}
				}

				// 테이블 초기화
				var htmlString = "<table class='sds-formtable' id='apprStatisticsTable' style='table-layout: fixed; width: 100%;'>";
				htmlString += "<tr>";
				var tmpRow = "";
				var columnCount = 1;

				// ---------------------------------------------------------
				// 3. 헤더(Header) 생성
				// ---------------------------------------------------------

				// (1) 체크박스
				tmpRow += "<th class='dwp-center' style='width:3%'><div class='dwp-cell check-cell' style='position: relative; height: 30px;'><div class='dwp-checkbox textless'><label><input type='checkbox' onclick='$dwp.app.sap_view.custom.checkReverseN(this)' class='dwp-check-all'><span></span></label></div></div></th>";

				// (2) 계정과목 (기존 로직: AF215일 경우만, 신규모드 아닐때만)
				if (!isNewMode && vFormKey == "AF215") {
					tmpRow += "<th class='dwp-center' style='width:100px;'>계정과목</th>";
					columnCount++;
				}

				// (3) 데이터 컬럼 헤더
				for (var i = 0; i < targetColumns.length; i++) {
					var col = targetColumns[i];
					if (_me.fieldNameSet == "") _me.fieldNameSet = col.name;
					else _me.fieldNameSet += ";" + col.name;

					var colTitle = customTitles[col.name] || col.description.replace(/\n/g, "<br>");
					var styleStr = "";
					var colName = col.name;

					// [너비 설정 분기]
					if (isNewMode) {
						// [AF215] 너비 설정
						if (colName === "FIELD07") styleStr = "style='width:20%;'"; // 적요
						else if (colName === "FIELD04" || colName === "FIELD06") styleStr = "style='width:12%;'";
						else if (colName === "GWSEQ") styleStr = "style='width:10%;'";
						else if (amountColumns.indexOf(colName) > -1) styleStr = "style='width:8%;'";
						else styleStr = "style='width:6%;'";
					} else {
						// [AF216] 너비 설정
						if (colName === "MER_ADR1") styleStr = "style='width:25%;'";
						else if (colName === "MER_NM") styleStr = "style='width:15%;'";
						else if (colName === "CARD_NO") styleStr = "style='width:12%;'";
						else if (amountColumns.indexOf(colName) > -1) styleStr = "style='width:5%;'";
						else styleStr = "style='width:6%;'";
					}

					tmpRow += "<th class='dwp-center' " + styleStr + ">" + colTitle + "</th>";
					columnCount++;
				}
				tmpRow += "</tr>";
				htmlString += tmpRow;

				// ---------------------------------------------------------
				// 4. 데이터(Body) 생성
				// ---------------------------------------------------------
				if (!rows || rows.length === 0) {
					var emptyMsg = "조회결과가 없습니다.";

					// [추가] SAP에서 '실패' 같은 에러 메시지를 보냈다면 그걸 띄워줌
					if (data.data.E_RETURN && data.data.E_RETURN.MSGTXT) {
						emptyMsg = data.data.E_RETURN.MSGTXT;
						// 만약 그냥 "실패"라고만 떠서 보기 싫으면 아래 줄 주석을 푸세요.
						// emptyMsg = "조회결과가 없습니다. (" + data.data.E_RETURN.MSGTXT + ")";
						//emptyMsg = "조회결과가 없습니다. (" + data.data.E_RETURN.MSGTXT + ")";
					}
					console.log(emptyMsg)

					tmpRow = "<tr><td class='dwp-center' colspan='" + columnCount + "' style='padding: 20px;'>" + "조회결과가 없습니다." + "</td></tr>";
					htmlString += tmpRow;
				} else {
					for (var i = 0; i < rows.length; i++) {
						var rowData = rows[i];
						tmpRow = "<tr>";

						// Key 생성 분기
						var vKey = "";
						if (isNewMode) {
							// AF215 Key: GWSEQ (없으면 조합)
							vKey = rowData["GWSEQ"] || (rowData["FIELD01"] + "_" + i);

						} else {
							// AF216 Key: CARD_NO + AUTH_DD + AUTH_NO
							vKey = rowData["CARD_COM_CD"] + ";" + rowData["AUTH_NO"] + ";" + rowData["BUY_STS"] + ";" + rowData["AUTH_DD"] + ";" + rowData["CARD_NO"];
						}

						// (1) 체크박스
						tmpRow += "<td class='dwp-center'><div class='dwp-cell check-cell' style='position: relative; height: 30px;'><div class='dwp-checkbox textless'><label><input type='checkbox' name='SelectedDoc' class='dwp-check' value='" + vKey + "' idx='" + i + "'><span></span></label></div></div></td>";

						// (2) 계정과목 인풋 (기존 로직: AF215이고 신규모드가 아닐 때)
						if (!isNewMode && vFormKey == "AF215") {
							tmpRow += "<td class='dwp-left' onclick='$dwp.app.sap_view.custom.fOpenAccount(\"" + i + "\")'>";
							tmpRow += "<span class='dwp-input expended'><input name='ed_AccountCode_" + i + "' BKTXT='' Cate1='' SAKNR='' value='' class='clEtcInput clInputEnable clRcvEditable' style='background-color: rgb(214, 231, 239); width:100%;'></span></td>";
						}

						// (3) 데이터 출력
						for (var j = 0; j < targetColumns.length; j++) {
							var col = targetColumns[j];
							var cellValue = rowData[col.name];

							// 정렬 로직
							var alignClass = "dwp-left";
							if (amountColumns.indexOf(col.name) > -1) {
								alignClass = "dwp-right";
							} else if (isNewMode && (col.name === "FIELD01" || col.name === "FIELD02" || col.name === "GWSEQ")) {
								alignClass = "dwp-center";
							}

							// 값 포맷팅
							if (col.type === "BCD" || col.type === "NUM") {
								var numValue = parseInt(cellValue, 10);
								if (isNaN(numValue)) numValue = 0;

								if (amountColumns.indexOf(col.name) > -1) {
									cellValue = numValue.toString().toComma();
								} else {
									cellValue = cellValue;
								}
							} else {
								if (cellValue === undefined || cellValue === null) cellValue = "";
							}

							tmpRow += "<td class='" + alignClass + "' itemKey='" + col.name + "'>" + cellValue + "</td>";
						}
						tmpRow += "</tr>";
						htmlString += tmpRow;
					}
				}

				htmlString += "</table>";
				$("#searchResult", _el).html(htmlString).show();
			}
		},
		custom: {
			opt: null
			, doc: null
			, accountObj: {} //계정과목정보 
			, fieldNameSet: ""//필드전역변수		
			, apiDataOutside: ""//apidata	
			, getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			}
			, init: function (opt, el) {
				var _me = this
					, _doc = null
					, _opt = _me._initOptions(opt);
				_doc = $fn.custom(_opt, el);

				_me._buttonInit(_doc, _opt);

				_me.opt = _opt;
				_me.doc = _doc;

				console.log(_doc)
				console.log(_doc.element)

				$('.flex-auto.flex.flex-row').css('height', 'calc(100% - 1.5rem)');

				var confLang = $dwp.core.lang.getUserLang();
				var vDBPath = _doc.options.cdb;
				var sCurTime = _doc.options.scurtime;
				var sYesterday = _doc.options.sYesterday;
				var vUserID = _doc.options.vuserid;
				var erpConnGubn = _doc.options.erpconngubun;
				var vFormKey = _doc.options.vFormkey;
				var vTitleSubFormKey = _doc.options.vTitleSubFormKey;
				var vPALDocID = _doc.options.vPALDocID;
				var vCDeptCode = _doc.options.vCDeptCode;
				var vEmpNo = _doc.options.vEmpNo;
				var vKOSTL = _doc.options.vKOSTL;

				var joErpGubn = { "fmSAPConn": "SAP", "MISFormMapping": "RDB" };
				var arrAF215Type = ["AF215"]; //법인카드 경비
				var arrAF216Type = ["AF216"]; //SAP전자결재수신
				var arrAF217Type = ["AF217"]; //법인카드 외 경비

				//var arrAF205Type = ["AF205"]; //SAP 이체리스트
				var arrAF206Type = ["AF206", "AF207"]; //KCW, 경창정공 이체리스트
				var arrAF208Type = ["AF208", "AF209", "AF210", "AF211", "AF212", "AF213"]; //금형품의서 타입
				var arrAF220Type = ["AF220", "AF221"]; //신지출결의서 : 결재처리중 연동안함, 결재완료 후 전표전송함

				$('input[name="ed_Data01"]', _doc.element).each(function () {
					var $input = $(this);
					var $label = $input.closest('label');

					if ($label.length) {
						var nodes = $label.contents();
						nodes.each(function () {
							if (this.nodeType === 3 && $.trim(this.nodeValue).length > 0) {
								var prevNode = this.previousSibling;
								if (prevNode && prevNode.nodeName === 'INPUT' && $(prevNode).attr('type') === 'radio') {
									var textContent = $.trim(this.nodeValue);

									var $newSpan = $('<span></span>')
										.text(textContent)
										.css('padding-top', '1px');  // 원하는 간격 px 단위로 조절 가능

									$(this).replaceWith($newSpan);

									return false; // 첫 번째 텍스트 노드만 처리
								}
							}
						});
					}
					$('[name=ed_StartDate_1]', _doc.element).datepicker({
						dateFormat: 'yy-mm-dd', // 날짜 포맷을 'yyyy-mm-dd'로 설정 (yy가 연도)
						showOn: 'button',        // 필드를 클릭했을 때 달력이 보이게
						// 기타 옵션 (필요하면 추가)
						changeMonth: true,   // 월 드롭다운 활성화
						changeYear: true,    // 년 드롭다운 활성화
						buttonImage: '/tcclibs/images/common/empty.png', // 네가 원하는 투명 또는 작은 이미지 경로
						buttonImageOnly: true,
						buttonText: '날짜 선택',

						//buttonImage: '/tcclibs/images/common/empty.png'
						// yearRange: 'c-10:c+10', // 현재 년도 기준 앞뒤 10년 범위
						// dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], // 요일 한글화
						// monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], // 월 한글화
						// showMonthAfterYear: true, // 년도 먼저 표시
						// defaultDate: '+1w' // 기본으로 선택될 날짜 (예: 1주일 후)
					});
					$('[name=ed_EndDate_1]', _doc.element).datepicker({
						dateFormat: 'yy-mm-dd', // 날짜 포맷을 'yyyy-mm-dd'로 설정 (yy가 연도)
						showOn: 'button',        // 필드를 클릭했을 때 달력이 보이게
						// 기타 옵션 (필요하면 추가)
						changeMonth: true,   // 월 드롭다운 활성화
						changeYear: true,    // 년 드롭다운 활성화
						buttonImage: '/tcclibs/images/common/empty.png', // 네가 원하는 투명 또는 작은 이미지 경로
						buttonImageOnly: true,
						buttonText: '날짜 선택',
						//buttonImage: '/tcclibs/images/common/empty.png'
						// yearRange: 'c-10:c+10', // 현재 년도 기준 앞뒤 10년 범위
						// dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], // 요일 한글화
						// monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], // 월 한글화
						// showMonthAfterYear: true, // 년도 먼저 표시
						// defaultDate: '+1w' // 기본으로 선택될 날짜 (예: 1주일 후)
					});


				});

				console.log(vFormKey)
				console.log(arrAF215Type)
				if ($.inArray(vFormKey, arrAF215Type) >= 0) {
					console.log(arrAF215Type)
					$("#Btn_Search", _doc.element).show();
					$("#searchHeader", _doc.element).show();
					$("#searchHeader_AF215", _doc.element).show();

					if (vKOSTL == "") {
						alert("코스트센터가 없습니다. 코스트센터를 확인하십시오.");
						history.back();
						return;
					}
					$("#searchHeader_AF216", _doc.element).hide();
					$("#searchHeader_AF215_cateG_title", "#searchHeader_AF215", _doc.element).hide();
					$("select[name='ed_Data03']", "#searchHeader_AF215", _doc.element).hide();
					$("#searchHeader_AF215_cateP_title", "#searchHeader_AF215", _doc.element).show();
					$("input[name='ed_Data02']", "#searchHeader_AF215", _doc.element).show();


					//신규방식 restapi call 처리완료
					setTimeout(function () {
						fAF215_CARD_PERIOD();       // 승인일 기간 불러오기
						fAF215_CardNo();            // 공용카드번호 미리읽어두기

						// _me가 정의된 스코프 내라면 그대로 사용 가능
						if (_me && typeof _me.getAccount === 'function') {
							_me.getAccount(_doc);   // 계정과목 미리읽어두기
						}
					}, 300);
					//fAF215_CARD_PERIOD();		//승인일 기간 불러오기
					//fAF215_CardNo();		//공용카드번호 미리읽어두기
					//_me.getAccount(_doc);	//계정과목 미리읽어두기

					return;
				}

				if ($.inArray(vFormKey, arrAF216Type) >= 0) {

					$("#Btn_Search", _doc.element).show();
					$("#searchHeader_AF215", _doc.element).hide();
					$("#searchHeader", _doc.element).show();

					$("#searchHeader_AF216", _doc.element).show();
					return;
				}
				else if ($.inArray(vFormKey, arrAF220Type) >= 0) {
					$("#buttonlayer", _doc.element).hide();
					//fShowLoadingImage();
					//fnERPConnPass();
					return;
				}
				else {
					//searchStart();
				}

				//공용카드번호 불러오기
				function fAF215_CardNo() {

					//RESTAPI CALL
					var _sap_opt = { "functionName": "ZFI0010_GW_CARD_EXPORT", "parameters": { "I_KOSTL": vKOSTL } };
					var _sapis_url = $fn.getSysinfo().restserverurl;
					var _sapis_auth = $fn.getSysinfo().restserverauthorization;
					fetch(_sapis_url, {
						method: 'POST',
						headers: {
							'accept': 'application/json',
							'Authorization': _sapis_auth,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(_sap_opt)
					})
						.then(response => response.json())
						.then(function (data) {
							console.log("처리", data);
							// 1. 실제 카드 정보 배열에 접근합니다.
							var cardDataRows = data.data.T_TABLE.rows;

							if (!cardDataRows || cardDataRows.length === 0) { // === 0 으로 변경 (=== 0이 더 안전함)
								console.log("조회된 카드 정보가 없습니다.");
								// 사용자에게 알림 또는 필드 초기화 로직 추가 가능
								//return false;
							}

							var aOpt = [];

							// 2. T_TABLE.rows 배열을 반복하며 <option> 태그를 생성합니다.
							for (var i = 0; i < cardDataRows.length; i++) {
								var o = cardDataRows[i];
								// 값과 텍스트 모두 CARD_NO를 사용합니다.
								aOpt.push('<option value="' + o.CARD_NO + '">' + o.CARD_NO + '</option>');
							}

							// 3. SELECT 태그에 옵션을 추가합니다.
							$("select[name='ed_Data03']", "#searchHeader_AF215").append(aOpt.join(''));

							// 4. 자동포커스 (카드 정보가 하나일 경우)
							if (cardDataRows.length === 1) {
								// 옵션 목록이 추가된 후 (첫 번째는 보통 빈 값/선택으로 가정하고 두 번째(index 1)를 선택)
								$("select[name='ed_Data03'] option:eq(1)", "#searchHeader_AF215").attr("selected", "selected");
							}

						})
						.catch(function (error) {
							console.log('Error: ' + error.message);
						});

				}

				//승인일 기간 불러오기
				function fAF215_CARD_PERIOD() {

					//RESTAPI CALL
					var _sap_opt = { "functionName": "ZFI0010_GW_CARD_PERIOD", "parameters": {} };
					var _sapis_url = $fn.getSysinfo().restserverurl;
					var _sapis_auth = $fn.getSysinfo().restserverauthorization;
					fetch(_sapis_url, {
						method: 'POST',
						headers: {
							'accept': 'application/json',
							'Authorization': _sapis_auth,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(_sap_opt)
					})
						.then(response => response.json())
						.then(function (data) {
							console.log("처리", data);
							$("input[name='ed_StartDate']", "#searchHeader_AF215").val(data.data.E_FDATE);
							$("input[name='ed_EndDate']", "#searchHeader_AF215").val(data.data.E_EDATE);
							$("#searchHeader_AF215_ed_StartDate", "#searchHeader_AF215").text(format_date(data.data.E_FDATE, "-"));
							$("#searchHeader_AF215_ed_EndDate", "#searchHeader_AF215").text(format_date(data.data.E_EDATE, "-"));

						})
						.catch(function (error) {
							console.log('Error: ' + error.message);
						});

				}

				function openUserInfo() {
					var f = document.forms[0];
					var vFromDate = f.FromDate.value;
					var vToDate = f.ToDate.value;

					var vUrl = "./fmViewUserStat?OpenForm";
					var vParam = "&FromDate=" + vFromDate + "&ToDate=" + vToDate;

					var winWidth = 600;

					fPopupDoc(vUrl, vParam, winWidth, vWinHeight, "");
				}

				function GetDocPrint() {
					var vUrl = "./pgPrint?OpenPage";

					var winWidth = screen.width - 100;

					fPopupDoc(vUrl, "", winWidth, vWinHeight, "");
				}

				//보기의 문서들의 체크박스 모두 선택, 반전(체크되어 있으면 체크해제,  체크되어 있지 않으면 체크)하는 함수
				function checkReverse(vObj) {

					if (vObj.checked) {
						$("input[name='SelectedDoc']", _doc.element).attr("checked", true);	//메일을 제외한 모든 보기
					}
					else {
						$("input[name='SelectedDoc']", _doc.element).attr("checked", false);		//메일을 제외한 모든 보기
					}
				}

				function fConnChange(vArg) {
					var tgUrl = vDBPath + "/agSAPConnChange?OpenAgent&System=" + vArg;
					myajaxlocal({
						url: tgUrl,
						type: 'GET',
						dataType: 'html',
						callback: function (data) {
							var arrMatchString = data.match(/<!-- Result set start -->[\s\S]*?<!-- Result set end -->/i);
							if (arrMatchString == null) return false;
							var jsonString = arrMatchString[0].replace(/<!-- Result set start -->/i, "").replace(/<!-- Result set end -->/i, "");

							/* 추출한 데이터가 공백인 경우 검색결과가 없음  */
							if (jsonString == "") {
								return false;
							}
							else {
								/* JSON 배열 모양으로 문자열 변환 */
								jsonString = "[" + jsonString + "]";
								/* JSON 개체 배열로 변환 */
								jsonResultSet = JSON.parse(jsonString);
								var jsonResult;
								if (jsonResultSet.length == 0) return false;

								jsonResult = jsonResultSet[0];
								alert(jsonResult.message);
							}
						}
					});

					return;
				}

				//날짜형식
				//v : 체크값, sp : 구분자
				function format_date(v, sp) {
					if (v.length != 8) return v;
					return v.substr(0, 4) + sp + v.substr(4, 2) + sp + v.substr(6, 2);
				}

				//결재문서의 본문구성을 ERP로부터 작업하지 않고 직접 입력하고 완료상태만 업데이트하는 경우의 처리
				function fnERPConnPass() {
					var _url = "/gw/aprbox.nsf/AF001?OpenForm";
					_url += "&FormKey=" + vFormKey;
					_url += "&TitleSubFormKey=" + vTitleSubFormKey;
					_url += "&PALDocID=" + vPALDocID
					_url += "&CDeptCode=" + vCDeptCode;
					location.replace(_url);
				}
			},
			//dataset 처리
			DataParse: function (data) {

				var arrMatchString = data.match(/<!-- Result set start -->([\s\S]*?)<!-- Result set end -->/i);

				if (arrMatchString == null) {
					return null;
				}

				var jsonLikeContent = arrMatchString[1].trim();

				var searchStartTag = '"dataSet":[';
				var searchEndTag = ']';

				var startIndex = jsonLikeContent.indexOf(searchStartTag);

				if (startIndex === -1) {
					return null;
				}

				var endIndex = jsonLikeContent.indexOf(searchEndTag, startIndex + searchStartTag.length);

				if (endIndex === -1) {
					return null;
				}

				var dataSetContent = jsonLikeContent.substring(startIndex + searchStartTag.length, endIndex);
				dataSetContent = dataSetContent.replace(/[\n\r\t]/g, '').trim();

				return dataSetContent;

			},
			//예산체크 결과처리
			drawBudgetCheck: function (data) {
				var _me = this;
				var _doc = _me.doc;

				// 1. 필요한 변수들 추출 및 정의
				var vKOSTL = data.KOSTL;
				var vFieldNames = data.FieldNames.split(';'); // 'SAKNR;CARD_COM_CD;...'

				// vFieldNames의 개수만큼 FieldValues_N 데이터를 동적으로 가져와 vValues 배열에 담습니다.
				var vValues = [];
				var fieldCount = vFieldNames.length;

				for (var k = 1; k <= fieldCount; k++) {
					var fieldKey = 'FieldValues_' + k;

					// data[fieldKey]가 존재하면 해당 문자열을 split하고, 
					// 존재하지 않으면 (즉, FieldValues_N이 FieldNames 개수보다 적으면) 
					// 빈 배열로 처리하여 'undefined' 오류를 방지합니다.
					var valueString = data[fieldKey];

					if (valueString !== undefined && valueString !== null) {
						vValues.push(valueString.split(';'));
					} else {
						// 데이터가 누락된 경우 빈 문자열 배열을 넣어 T_TABLE 생성 루프에서 오류를 막습니다.
						vValues.push([]);
						// 참고: 이 경우, 해당 필드의 T_TABLE 값은 'undefined'가 됩니다.
					}
				}

				// 2. T_TABLE 배열 구조 생성
				var T_TABLE = [];

				// vValues[0]가 비어있을 경우 rowCount가 0이 되어 루프를 건너뜁니다.
				var rowCount = vValues.length > 0 ? vValues[0].length : 0;

				for (var i = 0; i < rowCount; i++) {
					var rowObject = {};

					// 각 FieldValues_N 배열에서 i번째 값을 가져와 rowObject에 매핑
					// (이 시점에서 vValues의 길이는 vFieldNames의 길이와 동일합니다.)
					for (var j = 0; j < vFieldNames.length; j++) {
						// 예를 들어, j=0이면 SAKNR 필드에 vValues[0][i] (FieldValues_1의 i번째 값)가 매핑됨
						var fieldName = vFieldNames[j];

						// vValues[j]는 배열이며, 값이 없으면 undefined가 들어갑니다.
						var fieldValue = vValues[j][i];

						// 필드명을 키로, 해당 값을 값으로 설정합니다.
						rowObject[fieldName] = fieldValue === undefined ? '' : fieldValue; // undefined는 빈 문자열로 대체
					}

					// RFC에 필요한 KOSTL 필드 설정
					rowObject['KOSTL'] = vKOSTL;

					T_TABLE.push(rowObject);
				}

				// 3. SAP 호출 옵션 구성
				var _sap_opt = {
					"functionName": "ZFI0010_GW_BUGET_CHECK",
					"parameters": {
						"I_KOSTL": vKOSTL, // I_KOSTL 단일 파라미터
						"T_TABLE": T_TABLE  // T_TABLE 배열 파라미터
					}
				};

				var _sapis_url = $fn.getSysinfo().restserverurl;
				var _sapis_auth = $fn.getSysinfo().restserverauthorization;

				// 4. fetch API 호출
				return fetch(_sapis_url, {
					method: 'POST',
					headers: {
						'accept': 'application/json',
						'Authorization': _sapis_auth,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(_sap_opt)
				})
					.then(response => {
						if (!response.ok) {
							throw new Error('HTTP Error: ' + response.status);
						}
						return response.json();
					})
					.then(function (data) {
						console.log("처리", data);
						if (data.result != "S") {
							console.log("오류", data);
							return false;
						}

						// 성공적인 예산 체크 후의 후속 로직을 여기에 추가...
						console.log("처리", data);
						if (data.result != "S") {
							console.log("오류", data);
							return false;
						}

						// ----------------------------------------------------
						// 1. SAP 응답 데이터 경로 설정 및 T_TABLE 유효성 검사
						// ----------------------------------------------------
						var jsonResult = data.data.T_TABLE; //  data.data.T_TABLE로 접근
						console.log("SAP JSON RESULT:", jsonResult);

						if (!jsonResult || !jsonResult.rows || jsonResult.rows.length == 0) {
							console.warn("SAP T_TABLE에 데이터 행이 없습니다.");
							return false; // 데이터가 없으면 false 반환
						}

						// ----------------------------------------------------
						// 2. 예산 체크 키와 플래그 추출
						// ----------------------------------------------------
						_me.fieldNameSet = "CARD_COM_CD;AUTH_NO;BUY_STS;AUTH_DD;CARD_NO";
						var aFieldName = _me.fieldNameSet.split(";");
						var aKeyValues = [], aBUGETFLAG = [];

						var rows = jsonResult.rows; // 실제 데이터 배열

						for (var i = 0; i < rows.length; i++) {
							var o = rows[i];
							var aKeyValue = [];

							// 카드내역 key값 만들기
							for (var idxKey = 0; idxKey < aFieldName.length; idxKey++) {
								var sFieldName = aFieldName[idxKey];
								console.log("필드명:", sFieldName, " | 추출된 값:", o[sFieldName]);
								aKeyValue.push(o[sFieldName]);
							}

							aKeyValues.push(aKeyValue.join(";"));  // 예산체크 후 카드내역 key값(전체)
							aBUGETFLAG.push(o["BUGETFLAG"]);       // 예산체크 결과
						}

						// ----------------------------------------------------
						// 3. 화면에서 선택된 항목을 기준으로 예산 체크 결과 검증
						// ----------------------------------------------------
						var IsBugetCheck = false;
						var chkCount = $("#contentLayer input[name='SelectedDoc']:checked", _doc.element).length;
						var count = 0;

						$("#contentLayer input[name='SelectedDoc']:checked", _doc.element).each(function () {

							var index = $(this).attr("idx");
							var selectedKeyValue = $(this).val();
							var BugetIndex = aKeyValues.indexOf(selectedKeyValue);

							// 예산체크 결과를 받지 못함 (키 불일치)
							if (BugetIndex < 0) {
								console.error("화면 선택 항목 키:", selectedKeyValue);
								console.error("SAP 응답 키 목록:", aKeyValues);
								IsBugetCheck = false;
								alert("예산이 조회되지않습니다.\n관리자에게 문의바랍니다.");
								return false;
							}

							// 예산 초과
							if (aBUGETFLAG[BugetIndex] != "O") {
								IsBugetCheck = false;
								alert("예산초과되어 결재진행을 할 수 없습니다.\n예산체크 후 결재요청하시기 바랍니다..");
								return false;
							}

							count++;

							IsBugetCheck = true;
						});

						// 4. 최종 검증 및 결과 반환
						if (!IsBugetCheck) return 0;

						if (count != chkCount) {
							alert("예산체크 결과가 전송되지 않았습니다.");
							return 0;
						}
						console.log("예산 로직 최종 통과! 결재 요청 진행 준비 완료.");

						return true;

					})
					.catch(function (error) {
						console.log('Error: ' + error.message);
						if (error === 0 || error === false) {
							// drawBudgetCheck 내부의 alert이 이미 사용자에게 오류를 알렸으므로,
							// 추가적인 알림 없이 여기서 로직을 종료합니다.
							console.error("예산 체크 실패로 결재를 차단합니다. 상태:", error);
							throw error;
						}
					});
				//여기에 리턴 없다는거지?>
			},
			fReqApproval: async function () {

				var _me = this;
				var _doc = _me.doc;

				var vDBPath = _doc.options.cdb;
				var sCurTime = _doc.options.scurtime;
				var sYesterday = _doc.options.sYesterday;
				var vUserID = _doc.options.vuserid;
				var erpConnGubn = _doc.options.erpconngubun;
				var vFormKey = _doc.options.vFormkey;
				var vTitleSubFormKey = _doc.options.vTitleSubFormKey;
				var vPALDocID = _doc.options.vPALDocID;
				var vCDeptCode = _doc.options.vCDeptCode;
				var vEmpNo = _doc.options.vEmpNo;
				var vKOSTL = _doc.options.vKOSTL;

				var joErpGubn = { "fmSAPConn": "SAP", "MISFormMapping": "RDB" };
				var arrAF215Type = ["AF215"]; //법인카드 경비
				var arrAF216Type = ["AF216"]; //SAP전자결재수신
				var arrAF217Type = ["AF217"]; //법인카드 외 경비

				//var arrAF205Type = ["AF205"]; //SAP 이체리스트
				var arrAF206Type = ["AF206", "AF207"]; //KCW, 경창정공 이체리스트
				var arrAF208Type = ["AF208", "AF209", "AF210", "AF211", "AF212", "AF213"]; //금형품의서 타입
				var arrAF220Type = ["AF220", "AF221"]; //신지출결의서 : 결재처리중 연동안함, 결재완료 후 전표전송함

				var apprParam = "";
				apprParam += "&FormKey=" + vFormKey;
				apprParam += "&TitleSubFormKey=" + vTitleSubFormKey;
				apprParam += "&PALDocID=" + vPALDocID;
				apprParam += "&CDeptCode=" + vCDeptCode;

				var aoChkBox = $("#contentLayer input[name='SelectedDoc']:checked", _doc.element).get();
				if (aoChkBox.length == 0) {
					//alert(joColMLL["mail.view.nodocument"]);

					$fn.alert({ msg: $fn.getCodeMsg('mail.msg.alt02') })
					return false;
				}
				//changeActionButtonLayer();

				var sUNID;
				var sDocIDList;
				for (i = 0; i < aoChkBox.length; i++) {
					sUNID = aoChkBox[i].value;
					if (i == 0) {
						sDocIDList = sUNID;
					} else {
						if (sUNID != "") {
							sDocIDList += "^" + sUNID;
						}
					}
				}

				if (vFormKey == "AF200" || vFormKey == "AF203") {
					//KCW, 경창정공 지출결의서
					if (aoChkBox.length > 1) {
						alert("결재요청 할 전표를 1건만 선택해 주십시오.");
						//returnActionButtonLayer();
						return;
					}
					else {
						var paramIdx = 1;
						var param = "&arg" + paramIdx + "=100";

						arrParam = sDocIDList.split(";");
						for (var i = 0; i < arrParam.length; i++) {
							paramIdx++;
							param += "&arg" + paramIdx + "=" + arrParam[i];
						}
					}
				}
				else if ($.inArray(vFormKey, arrAF206Type) >= 0) {
					/* 정공, kcw 이체리스트는 여러건이 선택돼 있더라도 key값은 동일함
						그중 제일 첫번째 키값 하나만 파라미터로 전달 */
					var paramIdx = 0;

					arrParam = sDocIDList.split("^")[0].split(";");
					for (var i = 0; i < arrParam.length; i++) {
						paramIdx++;
						param += "&arg" + paramIdx + "=" + arrParam[i];
					}

				}
				else if (vFormKey == "AF204") {
					//경창산업 지출결의서
					var tmpDate = "";
					var isValidDate = true;
					$("#contentLayer input[name='SelectedDoc']:checked", _doc.element).parent().parent().find("[itemKey='BUDAT']").each(function () {
						if (tmpDate != "" && tmpDate != $(this).html()) {
							isValidDate = false;
						}
						tmpDate = $(this).html();
					});

					if (isValidDate == false) {
						alert("전기일이 같은 항목만 선택할 수 있습니다.");
						returnActionButtonLayer();
						return;
					}
				}
				else if ($.inArray(vFormKey, arrAF208Type) >= 0) {
					//금형품의서
					if (aoChkBox.length > 1) {
						alert("결재요청 할 1건만 선택해 주십시오.");
						returnActionButtonLayer();
						return;
					}
					else {
						var paramIdx = 1;
						var param = "&arg1=" + vEmpNo;
						arrParam = sDocIDList.split(";");
						for (var i = 0; i < arrParam.length; i++) {
							paramIdx++;
							param += "&arg" + paramIdx + "=" + arrParam[i];
						}
					}
				}

				if (vFormKey == "AF216") {
					if (aoChkBox.length > 1) {
						alert("결재요청 할 1건만 선택해 주십시오.");
						//returnActionButtonLayer();
						return;
					}
					else {
						var paramIdx = 1;
						var param = "&arg1=" + vEmpNo;
						arrParam = sDocIDList.split(";");
						for (var i = 0; i < arrParam.length; i++) {
							paramIdx++;
							param += "&arg" + paramIdx + "=" + arrParam[i];
						}
					}
				}

				if (joErpGubn[erpConnGubn] == "SAP") {
					/*
						RFC용 파라미너 11개를 각각의 필드로 만들어서 저장시킴
					*/
					if (vFormKey == "AF215") {

						var IsAccount = false;
						var v1 = [], v2 = [], v3 = [], v4 = [], v5 = [], v6 = [], v7 = [], v8 = [];
						$("#contentLayer input[name='SelectedDoc']:checked", _doc.element).each(function () {
							var index = $(this).attr("idx");

							if ($("input[name='ed_AccountCode_" + index + "']", _doc.element).attr("SAKNR") == "") {
								//$("select[name='ed_AccountCode"+index+"']").focus();	//.css({"color": "red"});
								IsAccount = false;
								alert("계정과목을 선택하십시오.");
								return false;
							} else {
								IsAccount = true;
							}
							console.log($(this).val())
							var vValue = $(this).val().split(";");
							v1.push($("input[name='ed_AccountCode_" + index + "']", _doc.element).attr("SAKNR"));	//계정코드
							v2.push(vValue[0]);
							v3.push(vValue[1]);
							v4.push(vValue[2]);
							v5.push(vValue[3]);
							v6.push(vValue[4]);
							v7.push($("input[name='ed_AccountCode_" + index + "']", _doc.element).attr("BKTXT"));		//적요
							//				v8.push($("input[name='ed_AccountCode_"+index+"']").attr("BKTXT"));		//적요				

						});

						if (!IsAccount) {
							//returnActionButtonLayer();
							return;
						}
						var vFieldNames = "SAKNR;CARD_COM_CD;AUTH_NO;BUY_STS;AUTH_DD;CARD_NO;BKTXT";		//필드값이 중복발생되는 현상으로 직접정의함
						//			var vFieldNames = "SAKNR;CARD_COM_CD;AUTH_NO;BUY_STS;AUTH_DD;CARD_NO;BKTXT,AUTH_HH";		//필드값이 중복발생되는 현상으로 직접정의함


						// 예산체크


						var data = {
							'FormKey': vFormKey,
							'EmpNo': vEmpNo,
							'KOSTL': vKOSTL,
							'FieldNames': vFieldNames,
							'FieldValues_1': v1.join(";"),
							'FieldValues_2': v2.join(";"),
							'FieldValues_3': v3.join(";"),
							'FieldValues_4': v4.join(";"),
							'FieldValues_5': v5.join(";"),
							'FieldValues_6': v6.join(";")
						};

						console.log(data);
						var retValue = await $dwp.app.sap_view.custom.drawBudgetCheck(data);

						//리턴데이터 불량
						if (retValue === false) {
							//returnActionButtonLayer();
							alert("예산체크를 전송되지 못했습니다.");
							return false;
						}
						//에러메시지 미리 표시 후 종료
						if (retValue == 0) {
							//returnActionButtonLayer();
							return false;
						}
						console.log("예산체크===+" + retValue)
						
						if (retValue) {
							//묶음전표생성요청
							console.log("진행")
							$fn.block();
							$fn.xAjax({
								url: vDBPath + "/SAPParamForm?CreateDocument",
								async: true,
								method: 'POST',
								dataType: 'html',
								cache: false,
								timeout: 15000,
								data: {
									'FormKey': vFormKey,
									'EmpNo': vEmpNo,
									'TitleSubFormKey': vTitleSubFormKey,
									'KOSTL': vKOSTL,
									'PALDocID': vPALDocID,
									'CDeptCode': vCDeptCode,
									'fieldNames': vFieldNames,
									'fieldValues_1': v1.join(";"),
									'fieldValues_2': v2.join(";"),
									'fieldValues_3': v3.join(";"),
									'fieldValues_4': v4.join(";"),
									'fieldValues_5': v5.join(";"),
									'fieldValues_6': v6.join(";"),
									'fieldValues_7': v7.join(";")
								}
							}).done(function (data) {
								console.log(data);
								//body세팅
								//docid가져오기
								var urlMatch = data.match(/location\.href\s*=\s*"([^"]*)"/);
								var docID = null;

								if (urlMatch) {
									var urlString = urlMatch[1];
									var idMatch = urlString.match(/&paramDocID=([^&]*)/);
									if (idMatch) {
										docID = idMatch[1];
									}
								}
								var scriptRegex = /location\.href\s*=\s*['"]([^'"]+)['"]/;
								var match = data.match(scriptRegex);
								//var vdata = _me.DataParse(data)//작성함에서 쓸 로그디비 ID
								console.log(docID);
								// 'data' 객체가 이미 준비되어 있다고 가정합니다.
								var data = {
									'FormKey': vFormKey,
									'EmpNo': vEmpNo,
									'KOSTL': vKOSTL,
									'PALDocID': docID, // <--- docID로 사용									
									'fieldNames': vFieldNames, // <--- arg1$로 사용
									'fieldValues_1': v1.join(";"),
									'fieldValues_2': v2.join(";"),
									'fieldValues_3': v3.join(";"),
									'fieldValues_4': v4.join(";"),
									'fieldValues_5': v5.join(";"),
									'fieldValues_6': v6.join(";"),
									'fieldValues_7': v7.join(";")
								};

								// 1. paramList 객체 구성 (callApiSetInsert의 네 번째 인자)
								var paramList = {
									"1": data.fieldValues_1,
									"2": data.fieldValues_2,
									"3": data.fieldValues_3,
									"4": data.fieldValues_4,
									"5": data.fieldValues_5,
									"6": data.fieldValues_6,
									"7": data.fieldValues_7
								};

								// 필요한 데이터는 함수 매개변수로 넘어왔다고 가정합니다.
								// docID, vEmpNo, vKOSTL, arg1$ (fieldNames), paramList (v1~v7 문자열)

								// 1. paramList에서 v1 ~ v7의 값을 배열로 정리
								var vList = [];
								for (let k = 1; k <= 7; k++) {
									vList.push(paramList[String(k)]); // 예: v1.join(";") 문자열
								}

								// 2. 필드명과 값들을 분리
								var fNames = vFieldNames.split(';'); // 필드명 목록 (예: "SAKNR", "CARD_COM_CD", ...)
								var vArrays = vList.map(v => v.split(';')); // 각 필드 값 문자열을 배열로 분할 (복수 건)

								// 3. T_TABLE 데이터 배열 생성 (복수 행 구성)
								var rowCount = vArrays[0].length; // 첫 번째 필드 배열의 길이를 기준으로 행 수 결정
								var T_TABLE_DATA = [];

								for (let i = 0; i < rowCount; i++) {
									var rowObject = {};

									// 7개의 동적 필드 값을 T_TABLE 행에 매핑 (fName[0] ~ fName[6])
									for (let j = 0; j < fNames.length && j < vArrays.length; j++) {
										// rowObject[필드명] = 값
										rowObject[fNames[j]] = vArrays[j][i] || '';
									}

									// 5개의 고정 공통 필드 값을 T_TABLE 행에 추가
									rowObject["GWDOCUID"] = docID;      // 전표 ID
									rowObject["USERNO"] = vEmpNo;       // 사용자 번호
									rowObject["GWSTATUS"] = "0";        // 상태 코드
									rowObject["BUZEI"] = String(i + 1); // 순번 (1부터 시작)
									rowObject["KOSTL"] = vKOSTL;        // 코스트 센터

									T_TABLE_DATA.push(rowObject); // T_TABLE 배열에 완성된 한 행(객체)을 추가
								}



								var _sapis_url = $fn.getSysinfo().restserverurl;
								var _sapis_auth = $fn.getSysinfo().restserverauthorization;


								var _sap_opt_insert = {
									"functionName": "ZFI0010_GW_CORPCD_STATUS",
									"parameters": {
										"I_GWDOCUID": docID,
										"I_GWSTATUS": "0",
										"I_USERNO": vEmpNo,
										"T_TABLE": T_TABLE_DATA
									}
								};
								var _sap_opt_select = {
									"functionName": "ZFI0010_GW_DOCUMENT_EXPORT", "parameters": {
										"I_GWDOCUID": docID,
										"I_USERNO": vEmpNo
									}
								};

								fetch(_sapis_url, {
									method: 'POST',
									headers: {
										'accept': 'application/json',
										'Authorization': _sapis_auth,
										'Content-Type': 'application/json'
									},
									body: JSON.stringify(_sap_opt_insert)
								})
									.then(response => response.json())
									.then(function (data) {
										console.log("처리 insert", data);
										//법인카드 조회 시작 
										
										fetch(_sapis_url, {
											method: 'POST',
											headers: {
												'accept': 'application/json',
												'Authorization': _sapis_auth,
												'Content-Type': 'application/json'
											},
											body: JSON.stringify(_sap_opt_select)
										})
											.then(response => response.json())
											.then(function (data) {
												console.log("처리 select", data);
												if (typeof _me.convertSapRfcResult === 'function') {
												var body = _me.convertSapRfcResult(data.data);
												console.log("변환된 BODY:", body); // 변환된 결과를 출력

												// TODO: 변환된 'body'를 사용하여 그리드를 업데이트하는 등의 후속 로직을 여기에 추가
												// 예: _me.updateGrid(body);
											} else {
												console.error("오류: _me.convertSapRfcResult 함수가 정의되지 않았습니다.");
											}

											var extractedUrl = match[1]; // 추출된 URL이다!
											console.log("추출된 리다이렉트 URL:", extractedUrl); // 디버깅용 로그

											// '?' 문자가 시작하는 위치를 찾습니다.
											var endIndex = extractedUrl.indexOf('?');

											// '?'가 발견되면 (endIndex가 -1이 아니면), 문자열의 처음부터 '?' 직전까지 자릅니다.
											if (endIndex !== -1) {
												var pathOnly = extractedUrl.substring(0, endIndex);
											} else {
												// '?'가 없으면 전체 URL 경로가 pathOnly가 됩니다.
												var pathOnly = extractedUrl;
											}

											console.log(pathOnly);
											// /dwp/com/erp/mismain.nsf/MISConnectSAP?OpenForm&FormKey=AF216&TitleSubFormKey=&PALDocID=&CDeptCode=&fieldNames=GWSEQ&fieldValues=&paramDocID=6203C6E4A5D0BF0049258D4D001B2
											//{"T_SUM":"0", "FIELD01":"82516539.00", "FIELD02":"82516539.00", "FIELD03":"0.00", "FIELD04":"0.00", "TRAN_CURCD":"KRW"}, {"FISEQ":"00001", "FIELD01":"0.00000", "FIELD02":"11113202", "FIELD03":"받을어음-전자", "FIELD04":"", "FIELD05":"", "FIELD06":"902256.00", "FIELD07":"0.00", "FIELD08":"2025101616405118_받을어음", "FIELD09":"1018116406", "FIELD10":"100003", "FIELD11":"현대모비스(주)", "FIELD12":"0.00", "FIELD13":"0.00", "FIELD14":"", "FIELD15":"", "FIELD16":"20251016", "FIELD17":"20251201", "FIELD18":"02", "FIELD19":"20251016", "FIELD20":"20251016", "FIELD21":"1400000363", "FIELD22":"", "FIELD23":"", "FIELD24":"", "FIELD25":"하나은행", "FIELD26":""},{"FISEQ":"00001", "FIELD01":"0.00000", "FIELD02":"11113104", "FIELD03":"외상매출금-선수금", "FIELD04":"", "FIELD05":"", "FIELD06":"0.00", "FIELD07":"902256.00", "FIELD08":"251016 받을어음", "FIELD09":"1018116406", "FIELD10":"100003", "FIELD11":"현대모비스(주)", "FIELD12":"0.00", "FIELD13":"0.00", "FIELD14":"", "FIELD15":"", "FIELD16":"", "FIELD17":"", "FIELD18":"02", "FIELD19":"20251016", "FIELD20":"20251016", "FIELD21":"1400000363", "FIELD22":"", "FIELD23":"", "FIELD24":"", "FIELD25":"", "FIELD26":""},{"FISEQ":"00002", "FIELD01":"0.00000", "FIELD02":"11113202", "FIELD03":"받을어음-전자", "FIELD04":"", "FIELD05":"", "FIELD06":"81614283.00", "FIELD07":"0.00", "FIELD08":"2025101616405442_받을어음", "FIELD09":"1018116406", "FIELD10":"100003", "FIELD11":"현대모비스(주)", "FIELD12":"0.00", "FIELD13":"0.00", "FIELD14":"", "FIELD15":"", "FIELD16":"20251016", "FIELD17":"20251201", "FIELD18":"02", "FIELD19":"20251016", "FIELD20":"20251016", "FIELD21":"1400000364", "FIELD22":"", "FIELD23":"", "FIELD24":"", "FIELD25":"하나은행", "FIELD26":""},{"FISEQ":"00002", "FIELD01":"0.00000", "FIELD02":"11113104", "FIELD03":"외상매출금-선수금", "FIELD04":"", "FIELD05":"", "FIELD06":"0.00", "FIELD07":"81614283.00", "FIELD08":"251016 받을어음", "FIELD09":"1018116406", "FIELD10":"100003", "FIELD11":"현대모비스(주)", "FIELD12":"0.00", "FIELD13":"0.00", "FIELD14":"", "FIELD15":"", "FIELD16":"", "FIELD17":"", "FIELD18":"02", "FIELD19":"20251016", "FIELD20":"20251016", "FIELD21":"1400000364", "FIELD22":"", "FIELD23":"", "FIELD24":"", "FIELD25":"", "FIELD26":""}'
											var queryString = extractedUrl.split('?')[1];
											var urlParams = new URLSearchParams(queryString);
											var paramDocID = urlParams.get('paramDocID');
											var FormKey = urlParams.get('FormKey');
											var fieldNames = urlParams.get('fieldNames');
											console.log(body)

											

											console.log(paramDocID)
											console.log(FormKey)
											console.log(fieldNames)
											$fn.xAjax({
												url: $fn.getProxyUrl(pathOnly + '?CreateDocument'),
												method: 'post',
												dataType: 'html',
												data: {
													paramDocID: paramDocID,
													FormKey: FormKey,
													fieldNames: fieldNames,
													Body1: body,
													AFPAliasFormName: "AF215",
													AFPAprFormName: '법인카드 경비'
													


												},
												async: true,
												cache: false,
											}).done(function (data) {
												console.log("처리", data);
												$fn.unblock();
												//$fn.loadPage({ link: "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?OpenForm&FormCode=AF216" + vdata, linktype: "PAGE" })
												$fn.loadPage({ link: "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?OpenForm&FormCode=AF215&paramDocID=" + docID, linktype: "PAGE" })
											}).fail(function (req, error) {
												$fn.unblock();
												console.log(req.responseText + '\n' + error);
											});



											})
											.catch(function (error) {
												console.log('Error: ' + error.message);
											});

									})
									.catch(function (error) {
										console.log('Error: ' + error.message);
									});


								


							}).fail(function (req, error) {
								alert(req.responseText + '\n' + error);

							});


							//alert(vPALDocID)						
						}



						return;

					} else if (vFormKey == "AF216") {

						var chkobj = $("#contentLayer input[name='SelectedDoc']:checked", _doc.element);
						var index = chkobj.attr("idx");
						var vValue = chkobj.val();
						var _me = this;
						console.log(vValue)
						//return false;
						var vFieldNames = "GWSEQ";
						
						//showLoadingIndicator();
						$fn.block();
						$fn.xAjax({
							url: vDBPath + "/SAPParamForm?CreateDocument",
							async: false,
							method: 'POST',
							dataType: 'html',
							cache: false,
							timeout: 15000,
							data: {
								'FormKey': vFormKey,
								'EmpNo': vEmpNo,
								'TitleSubFormKey': vTitleSubFormKey,
								'KOSTL': vKOSTL,
								'PALDocID': vPALDocID,
								'CDeptCode': vCDeptCode,
								'fieldNames': vFieldNames,
								'fieldValues_1': vValue
							}
						}).done(function (data) {
							console.log(data);

							//docid가져오기
							var urlMatch = data.match(/location\.href\s*=\s*"([^"]*)"/);
							var docID = null;

							if (urlMatch) {
								var urlString = urlMatch[1];
								var idMatch = urlString.match(/&paramDocID=([^&]*)/);
								if (idMatch) {
									docID = idMatch[1];
								}
							}
							var scriptRegex = /location\.href\s*=\s*['"]([^'"]+)['"]/;
							var match = data.match(scriptRegex);
							//var vdata = _me.DataParse(data)//작성함에서 쓸 로그디비 ID
							console.log(docID);

							var _sapis_url = $fn.getSysinfo().restserverurl;
							var _sapis_auth = $fn.getSysinfo().restserverauthorization;


							var _sap_opt_insert = {
								"functionName": "ZFI0010_GW_BELNR_STATUS",
								"parameters": {
									"I_GWDOCUID": docID,
									"I_GWSTATUS": "0",
									"I_USERNO": vEmpNo,
									"T_TABLE": [
										{
											"GWDOCUID": docID,
											"USERNO": vEmpNo,
											"GWSTATUS": "0",
											"GWSEQ": vValue
										}
									]
								}
							};

							var _sap_opt_select = {
								"functionName": "ZFI0010_GW_BELNR_DOC_EXPORT", "parameters": {
									"I_GWDOCUID": docID,
									"I_USERNO": vEmpNo
								}
							};

							//RESTAPI CALL	INSERT 	
							fetch(_sapis_url, {
								method: 'POST',
								headers: {
									'accept': 'application/json',
									'Authorization': _sapis_auth,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(_sap_opt_insert)
							})
								.then(response => response.json())
								.then(function (data) {
									console.log("처리", data);

									//RESTAPI CALL SELECT
									fetch(_sapis_url, {
										method: 'POST',
										headers: {
											'accept': 'application/json',
											'Authorization': _sapis_auth,
											'Content-Type': 'application/json'
										},
										body: JSON.stringify(_sap_opt_select)
									})
										.then(response => response.json())
										.then(function (data1) {
											console.log("처리", data1);

											if (typeof _me.convertSapRfcResult === 'function') {
												var body = _me.convertSapRfcResult(data1.data);
												console.log("변환된 BODY:", body); // 변환된 결과를 출력

												// TODO: 변환된 'body'를 사용하여 그리드를 업데이트하는 등의 후속 로직을 여기에 추가
												// 예: _me.updateGrid(body);
											} else {
												console.error("오류: _me.convertSapRfcResult 함수가 정의되지 않았습니다.");
											}

											var extractedUrl = match[1]; // 추출된 URL이다!
											console.log("추출된 리다이렉트 URL:", extractedUrl); // 디버깅용 로그

											// '?' 문자가 시작하는 위치를 찾습니다.
											var endIndex = extractedUrl.indexOf('?');

											// '?'가 발견되면 (endIndex가 -1이 아니면), 문자열의 처음부터 '?' 직전까지 자릅니다.
											if (endIndex !== -1) {
												var pathOnly = extractedUrl.substring(0, endIndex);
											} else {
												// '?'가 없으면 전체 URL 경로가 pathOnly가 됩니다.
												var pathOnly = extractedUrl;
											}

											console.log(pathOnly);
											// /dwp/com/erp/mismain.nsf/MISConnectSAP?OpenForm&FormKey=AF216&TitleSubFormKey=&PALDocID=&CDeptCode=&fieldNames=GWSEQ&fieldValues=&paramDocID=6203C6E4A5D0BF0049258D4D001B2
											//{"T_SUM":"0", "FIELD01":"82516539.00", "FIELD02":"82516539.00", "FIELD03":"0.00", "FIELD04":"0.00", "TRAN_CURCD":"KRW"}, {"FISEQ":"00001", "FIELD01":"0.00000", "FIELD02":"11113202", "FIELD03":"받을어음-전자", "FIELD04":"", "FIELD05":"", "FIELD06":"902256.00", "FIELD07":"0.00", "FIELD08":"2025101616405118_받을어음", "FIELD09":"1018116406", "FIELD10":"100003", "FIELD11":"현대모비스(주)", "FIELD12":"0.00", "FIELD13":"0.00", "FIELD14":"", "FIELD15":"", "FIELD16":"20251016", "FIELD17":"20251201", "FIELD18":"02", "FIELD19":"20251016", "FIELD20":"20251016", "FIELD21":"1400000363", "FIELD22":"", "FIELD23":"", "FIELD24":"", "FIELD25":"하나은행", "FIELD26":""},{"FISEQ":"00001", "FIELD01":"0.00000", "FIELD02":"11113104", "FIELD03":"외상매출금-선수금", "FIELD04":"", "FIELD05":"", "FIELD06":"0.00", "FIELD07":"902256.00", "FIELD08":"251016 받을어음", "FIELD09":"1018116406", "FIELD10":"100003", "FIELD11":"현대모비스(주)", "FIELD12":"0.00", "FIELD13":"0.00", "FIELD14":"", "FIELD15":"", "FIELD16":"", "FIELD17":"", "FIELD18":"02", "FIELD19":"20251016", "FIELD20":"20251016", "FIELD21":"1400000363", "FIELD22":"", "FIELD23":"", "FIELD24":"", "FIELD25":"", "FIELD26":""},{"FISEQ":"00002", "FIELD01":"0.00000", "FIELD02":"11113202", "FIELD03":"받을어음-전자", "FIELD04":"", "FIELD05":"", "FIELD06":"81614283.00", "FIELD07":"0.00", "FIELD08":"2025101616405442_받을어음", "FIELD09":"1018116406", "FIELD10":"100003", "FIELD11":"현대모비스(주)", "FIELD12":"0.00", "FIELD13":"0.00", "FIELD14":"", "FIELD15":"", "FIELD16":"20251016", "FIELD17":"20251201", "FIELD18":"02", "FIELD19":"20251016", "FIELD20":"20251016", "FIELD21":"1400000364", "FIELD22":"", "FIELD23":"", "FIELD24":"", "FIELD25":"하나은행", "FIELD26":""},{"FISEQ":"00002", "FIELD01":"0.00000", "FIELD02":"11113104", "FIELD03":"외상매출금-선수금", "FIELD04":"", "FIELD05":"", "FIELD06":"0.00", "FIELD07":"81614283.00", "FIELD08":"251016 받을어음", "FIELD09":"1018116406", "FIELD10":"100003", "FIELD11":"현대모비스(주)", "FIELD12":"0.00", "FIELD13":"0.00", "FIELD14":"", "FIELD15":"", "FIELD16":"", "FIELD17":"", "FIELD18":"02", "FIELD19":"20251016", "FIELD20":"20251016", "FIELD21":"1400000364", "FIELD22":"", "FIELD23":"", "FIELD24":"", "FIELD25":"", "FIELD26":""}'
											var queryString = extractedUrl.split('?')[1];
											var urlParams = new URLSearchParams(queryString);
											var paramDocID = urlParams.get('paramDocID');
											var FormKey = urlParams.get('FormKey');
											var fieldNames = urlParams.get('fieldNames');
											console.log(body)

											console.log(paramDocID)
											console.log(FormKey)
											console.log(fieldNames)
											
											$fn.xAjax({
												url: $fn.getProxyUrl(pathOnly + '?CreateDocument'),
												method: 'post',
												dataType: 'html',
												data: {
													paramDocID: paramDocID,
													FormKey: FormKey,
													fieldNames: fieldNames,
													Body1: body,
													AFPAliasFormName: "AF216",
													AFPAprFormName: 'SAP전자결재수신',
													Arg1: 'GWSEQ',


												},
												async: true,
												cache: false
										}).done(function (data) {
												console.log("처리", data);
												$fn.unblock();
												//$fn.loadPage({ link: "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?OpenForm&FormCode=AF216" + vdata, linktype: "PAGE" })
												$fn.loadPage({ link: "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?OpenForm&FormCode=AF216&paramDocID=" + docID, linktype: "PAGE" })
											}).fail(function (req, error) {
												$fn.unblock();
												console.log(req.responseText + '\n' + error);
											});


											

										})
										.catch(function (error) {
											console.log('Error: ' + error.message);
										});

								})
								.catch(function (error) {
									console.log('Error: ' + error.message);
								});



						}).fail(function (req, error) {
							alert(req.responseText + '\n' + error);

						});
						return;
					}
					else {

						var vUrl = "/" + vDBPath + "/MISConnectSAP?OpenForm" + apprParam + "&fieldNames=" + _me.fieldNameSet + "&fieldValues=" + sDocIDList;
						returnActionButtonLayer();
						//location.href = vUrl;
					}
				}
				else if (joErpGubn[erpConnGubn] == "RDB") {
					//var vUrl = "/" + vDBPath + "/MISConnect?OpenForm" + apprParam + "&fieldNames=" + fieldNameSet + "&fieldValues=" + sDocIDList;
					var vUrl = "/" + vDBPath + "/MISConnect?OpenForm" + apprParam + param;
					location.href = vUrl;
				}
				else {
					return;
				}
			},
			fSearchPreApprList: function (vFormKey) {
				var _me = this;
				var _docInstance = _me.doc
				if (vFormKey == "AF215") {
					_me.fSearchPreApprList_AF215(_docInstance);
				}
				if (vFormKey == "AF216") {
					_me.fSearchPreApprList_AF216(_docInstance);
				}


			}
			,

			checkReverseN: function (mainCheckbox) {
				var isMainChecked = mainCheckbox.checked; // '전체 선택' 체크박스의 현재 상태 확인!
				var _me = this;
				var _docInstance = _me.doc
				// document.querySelectorAll은 NodeList를 반환해.
				// NodeList는 forEach가 안 먹는 환경도 있으니, 안전하게 length로 접근하는 for 루프를 쓰자!
				var targetCheckboxes = document.querySelectorAll("input[name='SelectedDoc']", _docInstance.element);

				// 여기서부터 코드가 바뀌는 거야!
				for (var i = 0; i < targetCheckboxes.length; i++) {
					var checkbox = targetCheckboxes[i]; // i번째 체크박스 요소를 가져와서
					checkbox.checked = isMainChecked;     // '전체 선택' 상태에 맞춰줘!
				}
			}
			,
			/**
			 * SAP RFC 호출 결과 데이터 (T_SUM, T_TABLE)를 특정 형식의 쉼표 구분 문자열로 변환하는 함수입니다.
			 * * @param {object} data - SAP RFC 호출 결과 JSON 객체 (T_SUM, T_TABLE 포함)
			 * @returns {string} - 변환된 쉼표로 구분된 JSON 객체들의 단일 문자열
			 */
			convertSapRfcResult: function (data) {
				var resultParts = [];

				// --- 금액 필드를 요청 형식에 맞게 문자열로 변환하는 헬퍼 함수 ---
				function formatAmount(value, decimalPlaces = 2) {
					// 값이 null, undefined, 또는 빈 문자열이면 0으로 처리하여 toFixed 적용
					var numValue = (value === null || value === undefined || value === "") ? 0 : Number(value);
					if (isNaN(numValue)) {
						// 숫자가 아닌 경우 안전하게 원본값 반환 (예: 빈 문자열)
						return String(value) || "";
					}
					return numValue.toFixed(decimalPlaces);
				}

				// --- 1. T_SUM 데이터 처리 (첫 번째 객체) ---
				if (data.T_SUM && data.T_SUM.rows && data.T_SUM.rows.length > 0) {
					var sumRow = data.T_SUM.rows[0];
					var sumObject = {
						"T_SUM": "0", // 요청 형식에 따라 '0' 고정
						"FIELD01": formatAmount(sumRow.FIELD01, 2),
						"FIELD02": formatAmount(sumRow.FIELD02, 2),
						"FIELD03": formatAmount(sumRow.FIELD03, 2),
						"FIELD04": formatAmount(sumRow.FIELD04, 2),
						"TRAN_CURCD": sumRow.TRAN_CURCD
					};
					resultParts.push(JSON.stringify(sumObject));
				}

				// --- 2. T_TABLE 데이터 처리 (이후 객체들) ---
				if (data.T_TABLE && data.T_TABLE.rows) {
					for (var row of data.T_TABLE.rows) {
						var tableObject = {
							"FISEQ": row.FISEQ,
							"FIELD01": formatAmount(row.FIELD01, 5), // 요청 형식에 맞춰 5자리 소수점 ("0.00000")
							"FIELD02": row.FIELD02,
							"FIELD03": row.FIELD03,
							"FIELD04": row.FIELD04,
							"FIELD05": row.FIELD05,
							"FIELD06": formatAmount(row.FIELD06, 2), // 차변(원화)
							"FIELD07": formatAmount(row.FIELD07, 2), // 대변(원화)
							"FIELD08": row.FIELD08,
							"FIELD09": row.FIELD09,
							"FIELD10": row.FIELD10,
							"FIELD11": row.FIELD11,
							"FIELD12": formatAmount(row.FIELD12, 2), // 차변(외화)
							"FIELD13": formatAmount(row.FIELD13, 2), // 대변(외화)
							"FIELD14": row.FIELD14,
							"FIELD15": row.FIELD15,
							"FIELD16": row.FIELD16,
							"FIELD17": row.FIELD17,
							"FIELD18": row.FIELD18,
							"FIELD19": row.FIELD19,
							"FIELD20": row.FIELD20,
							"FIELD21": row.FIELD21,
							"FIELD22": row.FIELD22,
							"FIELD23": row.FIELD23,
							"FIELD24": row.FIELD24,
							"FIELD25": row.FIELD25,
							"FIELD26": row.FIELD26
						};
						resultParts.push(JSON.stringify(tableObject));
					}
				}

				// --- 3. 쉼표와 공백으로 구분하여 단일 문자열로 합쳐서 반환 ---
				return resultParts.join(', ');
			},

			cbDrawRFC01_ori: function (data, vFormKey) {

				var jsonResultSet;
				var _me = this;
				_me.fieldNameSet = "";
				var arrMatchString = data.match(/<!-- Result set start -->[\s\S]*?<!-- Result set end -->/i);
				if (arrMatchString == null) return false;
				var jsonString = arrMatchString[0].replace(/<!-- Result set start -->/i, "").replace(/<!-- Result set end -->/i, "");



				/* 추출한 데이터가 공백인 경우 검색결과가 없음  */
				if (jsonString == "") {
					return false;
				}
				else {
					/* JSON 배열 모양으로 문자열 변환 */
					jsonString = "[" + jsonString + "]";
					/* JSON 개체 배열로 변환 */
					jsonResultSet = JSON.parse(jsonString);
					var jsonResult;
					if (jsonResultSet.length == 0) return false;

					jsonResult = jsonResultSet[0];

					var htmlString = "<table class='sds-formtable' id='apprStatisticsTable'>";
					htmlString += "<tr>";

					var tmpRow = "";
					var columnCount = 1;
					_me.fieldNameSet = "";

					for (var i = 0; i < jsonResult.fieldSet.length; i++) {
						//alert(jsonResult.titleSet[i]);
						//<div class="dwp-cell check-cell"><div class="dwp-checkbox textless"><label><input name="chkall" type="checkbox" class="dwp-check-all"><span></span></label></div></div>
						if (i == 0) {
							//tmpRow += "<td><input type='checkbox' onclick='checkReverse(this)'></td>";
							tmpRow += "<th class='dwp-center' style='width:3%'><div class='dwp-cell check-cell' style='position: relative; height: 30px;'><div class='dwp-checkbox textless'><label><input type='checkbox' onclick='$dwp.app.sap_view.custom.checkReverseN(this)' class='dwp-check-all'><span></span></label></div></div></th>";
							if (vFormKey == "AF215") {
								tmpRow += "<th class=dwp-center>계정과목</th>";
							}
						}

						if (jsonResult.useFields[jsonResult.fieldSet[i]].isKey == "Yes") {
							if (_me.fieldNameSet == "") _me.fieldNameSet = jsonResult.fieldSet[i];
							else _me.fieldNameSet += ";" + jsonResult.fieldSet[i];
						}

						if (jsonResult.useFields[jsonResult.fieldSet[i]].isView == "Yes") {
							if (jsonResult.titleSet[i] == "가맹점<BR>명" || jsonResult.titleSet[i] == "가맹점<BR>주소" || jsonResult.titleSet[i] == "카드<BR>번호") {
								tmpRow += "<th class='dwp-center' style='width:13%'>" + jsonResult.titleSet[i] + "</th>";
							} else {
								tmpRow += "<th class='dwp-center'>" + jsonResult.titleSet[i] + "</th>";
							}

							columnCount++;
						}
					}

					tmpRow += "</tr>";

					htmlString += tmpRow;

					if (jsonResult.dataSet.length == 0) {
						if (jsonResult.actionResult == "fail") alert(jsonResult.message);

						if (vFormKey == "AF215") columnCount++;

						tmpRow = "<tr><td class='dwp-center' colspan='" + columnCount + "'>조회결과가 없습니다.</td></tr>";
						htmlString += tmpRow;
					}

					for (var i = 0; i < jsonResult.dataSet.length; i++) {
						tmpRow = "<tr>";

						vKey = "";

						for (var j = 0; j < jsonResult.fieldSet.length; j++) {
							if (jsonResult.useFields[jsonResult.fieldSet[j]].isKey == "Yes") {
								if (vKey == "") vKey = eval("jsonResult.dataSet[" + i + "]." + jsonResult.fieldSet[j]);
								else vKey += ";" + eval("jsonResult.dataSet[" + i + "]." + jsonResult.fieldSet[j]);
							}
						}

						for (var j = 0; j < jsonResult.fieldSet.length; j++) {

							if (j == 0) {	//<div class='dwp-cell check-cell'>
								tmpRow += "<td class=dwp-center><div class='dwp-cell check-cell' style='position: relative; height: 30px;'><div class='dwp-checkbox textless'><label><input type='checkbox' name='SelectedDoc' class='dwp-check' value='" + vKey + "' idx='" + i + "'><span></span></label></div></div></td>";
								if (vFormKey == "AF215") {
									tmpRow += "<td  style='width:100%' onclick='$dwp.app.sap_view.custom.fOpenAccount(\"" + i + "\")'>";
									//BKTXT=적요, Cate1=계정분류코드, SAKNR=계정분류코드, value=계정과목
									tmpRow += "<span class='dwp-input expended'><input name='ed_AccountCode_" + i + "' BKTXT='' Cate1='' SAKNR='' value='' ";
									tmpRow += " class=' ' style='background-color: rgb(214, 231, 239)'></span>";
									tmpRow += "</td>";
								}
							}

							if (jsonResult.useFields[jsonResult.fieldSet[j]].isView == "Yes") {
								if (jsonResult.useFields[jsonResult.fieldSet[j]].dataType == "Currency") {
									tmpRow += "<td class='dwp-right' itemKey='" + jsonResult.fieldSet[j] + "'>" + _me.commaNum(parseInt(eval("jsonResult.dataSet[" + i + "]." + jsonResult.fieldSet[j]), 10)) + "</td>";
								}
								else {

									tmpRow += "<td  itemKey='" + jsonResult.fieldSet[j] + "'>" + eval("jsonResult.dataSet[" + i + "]." + jsonResult.fieldSet[j]) + "</td>";
								}
							}
						}
						tmpRow += "</tr>";
						htmlString += tmpRow;
					}
					htmlString += "</table>";

					$("#searchResult").html(htmlString).show();

					/*
					//포인터 이동 시 백그라운드 색깔 변환
					$("#apprStatisticsTable tr").bind("mouseover", function(){
						$(this).css({"background-color":"#EAF7D9"});
					}).bind("mouseout", function(){
						$(this).css({"background-color":"#FFFFFF"});
					});
					*/
				}
			}
			,
			fOpenAccount: async function (index) {
				var _me = this;
				var _doc = _me.doc;

				if ($("#dialogWrapper").length > 0) {
					$("#dialogWrapper").remove();
				}

				var vUrl = _me.doc.options.cdb + "/fmAccountSelect?ReadForm&idx=" + index + "&BKTXT=&";

				// 1. G/L 계정 데이터가 없으면 비동기로 로딩하고 완료될 때까지 대기
				if (!_me.accountObj[_doc.options.vKOSTL]) {
					try {
						await _me.getAccount(_doc, _me); // 데이터 로딩 완료 대기
					} catch (error) {
						console.error(error);
						alert("계정 과목을 불러오는 데 실패했습니다.");
						return; // 실패 시 팝업을 열지 않고 종료
					}
				}

				if (_doc.options.vFormkey != "AF215") {
					$("input:radio[name='ed_Data01']:checked", _doc.element).val('');
				}

				var sHtml = "";
				var $dialogDiv = $("<div id='dialogWrapper' style='overflow:hidden;'>" + sHtml + "</div>");
				$dialogDiv.appendTo("body");

				var ok_dialog = function () {
					var $okButton = $("#dialogWrapper").closest('.ui-dialog').find('.ui-dialog-buttonpane button:first');

					if ($okButton.prop('disabled')) {
						return false;
					}

					$okButton.prop('disabled', true).addClass('ui-state-disabled');

					var currentIndex = $("#dialogWrapper").dialog("option", 'index');
					var $iframeContents = $("#iii").contents();
					var oBKTXT = $iframeContents.find("input[name='BKTXT']");

					if (oBKTXT.val() == "") {
						oBKTXT.focus();
						alert("적요를 입력하십시오.");
						$okButton.prop('disabled', false).removeClass('ui-state-disabled');
						return false;
					}

					var ifWindow = $("#iii")[0].contentWindow;
					if (!ifWindow || !ifWindow.o) {
						$okButton.prop('disabled', false).removeClass('ui-state-disabled');
						return false;
					}
					var ifo = ifWindow.o;

					var tmp = {
						'Cate1': ifo.Cate1, 'SAKNR': ifo.SAKNR, 'value': ifo.value, 'BKTXT': oBKTXT.val()
					};

					if (tmp.SAKNR == '') {
						alert('계정과목을 선택하십시오');
						$okButton.prop('disabled', false).removeClass('ui-state-disabled');
						return false;
					}
					if (tmp.BKTXT == '') {
						alert('적요를 입력하십시오');
						$okButton.prop('disabled', false).removeClass('ui-state-disabled');
						return false;
					}

					if (_doc.options.vFormkey == "AF215") {
						$("input[name='ed_AccountCode_" + currentIndex + "']", _doc.element).attr({
							'Cate1': tmp.Cate1, 'SAKNR': tmp.SAKNR, 'value': tmp.value, 'BKTXT': tmp.BKTXT, 'title': tmp.BKTXT
						});
						$("input[name='SelectedDoc']:eq(" + currentIndex + ")", _doc.element).prop("checked", true);
					}

					$("#dialogWrapper").dialog("close");
				};

				window.ok_dialog = ok_dialog;

				var userFunc = function () { $(this).dialog("close"); };
				var joBtnK = { "확인": ok_dialog, "닫기": userFunc };
				var joBtnE = { "Close": userFunc };

				// 2. 데이터 로딩 완료 후에 다이얼로그 초기화 및 로드 시작
				$dialogDiv.dialog({
					index: index,
					modal: true,
					resizable: false,
					draggable: true,
					title: '계정과목 및 적요',
					width: 490,
					height: 545,
					autoOpen: true,
					buttons: $dwp.core.lang.getUserLang() == "ko" ? joBtnK : joBtnE,

					open: function (event, ui) {
						var $iframe = $("<iframe id='iii' src='' frameborder='0' scrolling='no' width='100%' height='100%'></iframe>");
						$dialogDiv.append($iframe);
						$iframe.attr("src", vUrl); // Iframe URL 로드 시작

						var $dialogWidget = $(this).closest('.ui-dialog');
						//$dialogWidget.unbind('keydown.ui-dialog');
						//$(document).unbind('keydown.ui-dialog');

						$iframe.on('load', function () {
							try {
								this.contentWindow.focus();
							} catch (e) { }
						});
					},

					close: function (event, ui) {
						window.ok_dialog = null;
						$("#iii").attr("src", "about:blank");
						$(this).dialog("destroy").remove();
					}
				});
			}
			,
			fSearchPreApprList_AF215: async function (_doc) {

				var _me = this;
				var empNo = $("[name=ed_Data02]", _doc.element).val();
				var CardNo = $("select[name='ed_Data03']", _doc.element).val();
				var startDate = $("[name=ed_StartDate]", _doc.element).val();
				var endDate = $("[name=ed_EndDate]", _doc.element).val();
				var chkList1 = $("input[name='ed_Data01']:checked", _doc.element).val();
				let userNoToSend = empNo;
				let cardNoToSend = CardNo;

				if (chkList1 == "G") {
					if (_me.doc.options.vKOSTL == "") {
						alert("코스트 센터가 없습니다. 코스트 센터를 확인하십시오.");
						return;
					}
					if (CardNo == "-") {
						alert("카드번호 선택하십시오.");
						return;
					}
				}

				if (chkList1 === "P") {
					// 개인형 카드일 때 카드번호를 비움
					cardNoToSend = "";
				} else if (chkList1 === "G") {
					// 공용 카드일 때 사번을 비움
					userNoToSend = "";
				}

				startDate = startDate.replace(/-/g, "");
				endDate = endDate.replace(/-/g, "");

				if (startDate > endDate) {
					alert("조회 일자를 확인해 주십시오.");
					return;
				}

				//  $fn이 전역에 정의되지 않은 경우를 대비하여 함수 호출을 안전하게 유지합니다.
				var sysInfo = ($fn && $fn.getSysinfo) ? $fn.getSysinfo() : {};
				var _sapis_url = sysInfo.restserverurl;
				var _sapis_auth = sysInfo.restserverauthorization;

				// 필수 정보가 누락된 경우 즉시 종료
				if (!_sapis_url || !_sapis_auth) {
					console.error("API 접속 정보(URL 또는 인증)가 누락되었습니다.");
					alert("API 접속 정보를 확인할 수 없습니다.");
					return;
				}
				
				var _sap_opt = {
					"functionName": "ZFI0010_GW_CORPCD_BUY_EXPORT",
					"parameters": {
						"I_FDATE": startDate,
						"I_EDATE": endDate,
						"I_USERNO": userNoToSend,
						"I_CARDNO": cardNoToSend
					}
				};

				try {
					var response = await fetch(_sapis_url, {
						method: 'POST',
						headers: {
							'accept': 'application/json',
							'Authorization': _sapis_auth,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(_sap_opt)
					});

					if (!response.ok) {
						// HTTP 상태 코드가 200이 아닐 경우
						throw new Error(`API 네트워크 응답 오류: ${response.status} ${response.statusText}`);
					}

					var result = await response.json();

					// 이 부분이 여전히 가장 큰 잠재적 오류 원인입니다.
					// cbDrawRFC01 함수가 JSON 객체(result) 대신 HTML 문자열을 기대하면 오류가 납니다.
					_me.cbDrawRFC01(result, "AF215");

				} catch (error) {
					console.error("SAP RFC 호출 실패:", error);
					alert("매입 내역 조회 중 오류가 발생했습니다. 상세 오류: " + error.message);
				}


				/*

				var _me = this;
				//alert("DDD")
				var empNo = $("[name=ed_Data02]", _doc.element).val() //f.ed_Data02.value;
				var CardNo = $("[name=ed_Data03]", _doc.element).val() //f.ed_Data03.value;
				var startDate = $("[name=ed_StartDate]", _doc.element).val() //f.ed_StartDate.value;
				var endDate = $("[name=ed_EndDate]", _doc.element).val()// f.ed_EndDate.value;

				var chkList1 = $("input[name='ed_Data01']:checked", _doc.element).val();

				if (chkList1 == "G") {
					console.log(_me.doc.options.vKOSTL)
					if (_me.doc.options.vKOSTL == "") {
						alert("코스트 센터가 없습니다. 코스트 센터를 확인하십시오.");
						return;
					}
					if ($("select[name='ed_Data03']", _doc.element).val() == "-") {
						alert("카드번호 선택하십시오.");
						return;
					}
				}
				if (startDate > endDate) {
					alert("조회 일자를 확인해 주십시오.");
					return;
				}

				var param = "&FormKey=" + "AF215";
				param += "&EmpNo=" + empNo;
				param += "&CardNo=" + $("select[name='ed_Data03']", _doc.element).val();
				param += "&StartDate=" + startDate + "&EndDate=" + endDate;
				param += "&Chk1=" + chkList1;
				//param += "&Chk2=" + chkList2;

				var tgUrl = "/dwp/com/erp/mismain.nsf/agCallRFC01?OpenAgent" + param;
				$fn.xAjax({
					url: tgUrl,
					method: 'GET',
					dataType: 'html'
				}).done(function (data) {
					_me.cbDrawRFC01(data, "AF215")

				}).fail(function (req, error) {

					console.log(req.responseText + '\n' + error);

				});
				*/
				return;



			}
			,
			fSearchPreApprList_AF216: async function (_doc) {

				var _me = this;

				var empNo = $("[name=ed_Data02_1]", _doc.element).val();
				var startDate = $("[name=ed_StartDate_1]", _doc.element).val();
				var endDate = $("[name=ed_EndDate_1]", _doc.element).val();

				var sysInfo = ($fn && $fn.getSysinfo) ? $fn.getSysinfo() : {};
				var _sapis_url = sysInfo.restserverurl;
				var _sapis_auth = sysInfo.restserverauthorization;

				startDate = startDate.replace(/-/g, "");
				endDate = endDate.replace(/-/g, "");

				if (startDate > endDate) {
					alert("조회 일자를 확인해 주십시오.");
					return;
				}
				var _sap_opt = {
					"functionName": "ZFI0010_GW_BELNR_EXPORT",
					"parameters": {
						"I_FDATE": startDate,
						"I_EDATE": endDate,
						"I_USERNO": empNo

					}
				};

				try {
					var response = await fetch(_sapis_url, {
						method: 'POST',
						headers: {
							'accept': 'application/json',
							'Authorization': _sapis_auth,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(_sap_opt)
					});

					if (!response.ok) {
						// HTTP 상태 코드가 200이 아닐 경우
						throw new Error(`API 네트워크 응답 오류: ${response.status} ${response.statusText}`);
					}

					var result = await response.json();

					// 이 부분이 여전히 가장 큰 잠재적 오류 원인입니다.
					// cbDrawRFC01 함수가 JSON 객체(result) 대신 HTML 문자열을 기대하면 오류가 납니다.
					_me.cbDrawRFC01(result, "AF216");

				} catch (error) {
					console.error("SAP RFC 호출 실패:", error);
					alert("매입 내역 조회 중 오류가 발생했습니다. 상세 오류: " + error.message);
				}


				/*
				var param = "&FormKey=" + "AF216";
				param += "&EmpNo=" + empNo;
				param += "&StartDate=" + startDate + "&EndDate=" + endDate;
				//param += "&Chk1=" + chkList1;
				//param += "&Chk2=" + chkList2;

				var tgUrl = "/dwp/com/erp/mismain.nsf/agCallRFC01?OpenAgent" + param;
				$fn.xAjax({
					url: tgUrl,
					method: 'GET',
					dataType: 'html'
				}).done(function (data) {
					_me.cbDrawRFC01(data, "AF216")

				}).fail(function (req, error) {

					console.log(req.responseText + '\n' + error);

				});
				*/
				return;


			}
			,
			getAccount: function (_doc) {
				var _me = this;

				return new Promise((resolve, reject) => { // Promise 반환 및 비동기 로직 감싸기

					var vKOSTL = _doc.options.vKOSTL;
					var vFormkey = _doc.options.vFormkey;

					var chkList1 = vFormkey === "AF215" ?
						$("input[name='ed_Data01']:checked", _doc.element).val() : "";

					var cardGb = (chkList1 === "P" || chkList1 === "1") ? "1" : "2";

					var _sapis_url = $fn.getSysinfo().restserverurl;
					var _sapis_auth = $fn.getSysinfo().restserverauthorization;

					var fetchPromises = [];
					for (let i = 1; i <= 18; i++) {
						let _sap_opt = {
							"functionName": "ZFI0010_GW_GL_EXPORT",
							"parameters": {
								"I_KOSTL": vKOSTL,
								"I_RORHD": cardGb,
								"I_RWQFC": String(i)
							}
						};

						let currentPromise = fetch(_sapis_url, {
							method: 'POST',
							headers: {
								'accept': 'application/json',
								'Authorization': _sapis_auth,
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(_sap_opt)
						})
							.then(response => {
								if (!response.ok) {
									throw new Error('API Response Error');
								}
								return response.json();
							})
							.then(data => data.data.T_TABLE.rows || [])
							.catch(error => {
								console.error(error);
								return [];
							});

						fetchPromises.push(currentPromise);
					}

					Promise.all(fetchPromises)
						.then(allResults => {

							let jsonResultSet = [];
							for (let i = 0; i < 18; i++) {
								var classIndex = String(i + 1);
								var classData = allResults[i];

								let classObject = {};
								classObject[classIndex] = classData;

								jsonResultSet.push(classObject);
							}

							if (jsonResultSet.length === 0) {
								reject(new Error("No G/L Account Data Found.")); // 데이터 없으면 reject
								return;
							}

							if (!_me.accountObj) { _me.accountObj = {}; }

							if (!_me.accountObj[vKOSTL]) {
								_me.accountObj[vKOSTL] = jsonResultSet;
							}

							console.log(_me.accountObj);

							resolve(); // 모든 작업이 성공적으로 완료되었음을 알림

						})
						.catch(function (error) {
							console.error(error);
							reject(error); // Promise.all 오류 시 reject
						});
				});
			}
			,
			commaNum: function (num) {

				var dotPos = (num + "").split(".")

				if (num < 0) { num *= -1; var minus = true }
				else var minus = false

				var dotU = dotPos[0]
				var dotD = dotPos[1]
				var commaFlag = dotU.length % 3

				if (commaFlag) {
					var out = dotU.substring(0, commaFlag)
					if (dotU.length > 3) out += ","
				}
				else var out = ""

				if (out == "-,") out = "-";

				for (var i = commaFlag; i < dotU.length; i += 3) {
					out += dotU.substring(i, i + 3)
					if (i < dotU.length - 3) out += ","
				}

				//if(minus) out = "-" + out
				if (dotD) return out + "." + dotD
				else return out

			}
			, _initOptions: function (opt) {
				var _me = this, _opt = $.extend({}, opt);

					_opt.button = {
					search: {
						title: $fn.getCodeMsg("sap_view.title.a1")
						, click: function (doc) {
							$fn.alert({ msg: "결재대상조회 버튼이 클릭되었습니다." });
						}
					}
					, reqapp: {
						title: $fn.getCodeMsg("sap_view.title.a2")
						, click: function (doc) {
							$fn.alert({ msg: "결재요청 버튼이 클릭되었습니다." });
						}
					}
					, cancel: {
						title: $fn.getCodeMsg("sap_view.title.a3")
						, click: function (doc) {
							history.back();
						}
					}
				}

				return _opt;
			}
			, _buttonInit: function (doc, opt) {
				var _me = this;
				var _doc = doc, _opt = opt, _el = _doc.element;

				console.log("opt:", _opt);

				var _btn_wrap = $(_el).find(".dwp-page-btn-wrap");
				var _search_btn = _btn_wrap.find(".dwp-search");
				var _reqapp_btn = _btn_wrap.find(".dwp-reqapp");
				var _cancel_btn = _btn_wrap.find(".dwp-cancel");

				_search_btn.off("click").on("click", function (e) {
					$dwp.app.sap_view.com.fSearchPreApprList(_doc, _opt);
				});

				_reqapp_btn.off("click").on("click", function (e) {
					//$dwp.app.sap_view.com.fReqApproval(_doc, _opt);
					$dwp.app.sap_view.custom.fReqApproval();
				});

				_cancel_btn.off("click").on("click", function (e) {
					history.back();
				});
			}
		}
	}
}($dwp.cns("app"), jQuery));













