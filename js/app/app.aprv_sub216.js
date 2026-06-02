/* Source File Upload Time : 2017-11-15 7:43:22 PM*/


/**
 * 전자결재 보조양식 지출(수입)결의 및 회계전표
 * $dwp.app.aprv_subxxx.subdoc 
 */
(function (_$$, $) {
	_$$.aprv_sub216 = {
		/*
		 * 양식 로딩시 호출 함수
		 * @param 	{Object}	$doc		Doc Instance 
		 */
		load: function ($doc) {
			var _me = this
				, _opt = $doc.options
			var el = $doc.element;

			var url = _opt.pathinfo;

			// URLSearchParams 객체를 사용하면 아주 깔끔하다! (최신 브라우저 지원)
			var urlParams = new URLSearchParams(url.split('?')[1]);
			var paramDocID = urlParams.get('paramDocID');


			console.log(paramDocID)

			if (_opt.isnew) {
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/wcmdpost?CreateDocument'),
					method: 'post',
					dataType: 'json',
					data: {
						actiontype: "af215select",
						Arg1: paramDocID,

					},
					async: true,
					cache: false,
				}).done(function (data) {
					console.log("처리", data);
					//$("[name=MISDocID]", $doc.element).val(paramDocID);
					$("[name=MISLogDocID]", $doc.element).val(data.misdocid);
					$("[name=MISLogDBPath]", $doc.element).val(data.misLogDb);
					$("[name=Body1]", $doc.element).val(data.Body1);
					$("[name=Body2]", $doc.element).val(data.Body2);
					var joString1 = data.Body1;
					joString1 = joString1.replace(/\n/gi, "");

					/* 1.기본정보 */
					console.log(joString1)
					$("[name=erpBodyDispDiv]", $doc.element).html(joString1)
					//$("#erpBodyDispDiv").html(joString1);
					joString1 = $("[name=erpBodyDispDiv]", $doc.element).text();
					joString1 = joString1.replace(/\\/gi, "&#92;").replace(/″/gi, "\"");
					joString1 = "[" + joString1 + "]";
					joBody1 = JSON.parse(joString1);

					fDrawERPBody(joBody1);
				}).fail(function (req, error) {

					console.log(req.responseText + '\n' + error);

				});
			} else {
				var joString1 = $("textarea[name=Body1]",el).val();
				joString1 = joString1.replace(/\n/gi, "");

				/* 1.기본정보 */
				console.log(joString1)
				$("[name=erpBodyDispDiv]", $doc.element).html(joString1)
				//$("#erpBodyDispDiv").html(joString1);
				joString1 = $("[name=erpBodyDispDiv]", $doc.element).text();
				joString1 = joString1.replace(/\\/gi, "&#92;").replace(/″/gi, "\"");
				joString1 = "[" + joString1 + "]";
				joBody1 = JSON.parse(joString1);

				fDrawERPBody(joBody1);



			}
			console.log("$('[name=fum_link]', el).val()====" + $('[name=fum_link]', el).html())
			if ($('[name=fum_link]', el).val() != "") {
				$('#draftDocLink', el).html($('[name=fum_link]', el).val())
			}

			if (_opt.isedit == false) {
				$('.dwp-checkbox.textless label > span',el).remove();
			}







			//품의서 추가 삭제 
			$('[name="role_btn_add"]', el).on('click', function (e) {

				console.log("품의서추가클릭")
				_$$.aprv_sub216.selectRequestForm1($doc, "품의서", "AF155");
			});



			function fDrawERPBody(jsonResultSet1) {
				//var f = document.forms[0];
				//var i = 0;
				var jsonResult;
				var jsonResultSet;
				var iDefaultRow = 9; //적요와 상대계정에 기본표시해주 행수

				/* 2.적요내용 시작 */
				jsonResultSet = jsonResultSet1;

				console.log(jsonResultSet.length)

				/* 추출한 데이터가 공백인 경우 검색결과가 없음  */
				if (jsonResultSet.length == 0) {
					var htmlString = "<tr><td class='clContentTdCenter' colspan='8'>데이터가 없습니다.</td></tr>";
					return;
				}

				jsonResult = jsonResultSet[0];

				htmlString = fnListType1(jsonResultSet, iDefaultRow);
				console.log(htmlString)
				$("#listType1",el).append(htmlString).show();
				console.log("1")

			}
			//숫자를 한글로 변환
			function digitToHangul(input) {
				var index = 0;
				var i = 0;
				var result = "";
				var newResult = "";
				input = input.toString();
				if (input.substring(0, 1) == "-") {
					var minus = "-";
				}
				else {
					var minus = "";
				}
				var tmp = input.replace(/-/, "");
				var money = String(tmp);
				su = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
				km = new Array("영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구");
				danwi = new Array("", "십", "백", "천", "만", "십", "백", "천", "억", "십", "백", "천", "조");
				for (j = 1; j <= money.length; j++) {
					for (index = 0; index < 10; index++) {
						money = money.replace(su[index], km[index]);
					}
				}

				for (index = money.length; index > 0; index = index - 1) {
					result = money.substring(index - 1, index);
					if (result == "영") {
						if (i < 4 || i > 8) {
							result = "";

						} else if (i >= 4 && i < 8 && newResult.indexOf("만") < 0) {
							result = "만";

						} else if (i >= 8 && i < 12 && newResult.indexOf("억") < 0) {
							result = "억";
						}
					} else {
						result = result + danwi[i];
					}
					i++;
					newResult = result + newResult;
				}

				for (j = 1; j < newResult.length; j++) {
					newResult = newResult.replace("영", "");
				}

				if ((newResult.indexOf("만") - newResult.indexOf("억")) == 1)
					newResult = newResult.replace("만", "");
				if ((newResult.indexOf("억") - newResult.indexOf("조")) == 1)
					newResult = newResult.replace("억", "");

				return minus + newResult;
			}
			//v : 체크값, sp : 구분자
			function format_time(v, sp) {
				if (v.length != 6) return v;
				return v.substr(0, 2) + sp + v.substr(2, 2) + sp + v.substr(4, 2);
			}
			function commaNum(num) {

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


			//날짜형식
			//v : 체크값, sp : 구분자
			function format_date(v, sp) {
				if (v.length != 8) return v;
				return v.substr(0, 4) + sp + v.substr(4, 2) + sp + v.substr(6, 2);
			}
			function format_corp(v, sp) {
				if (v.length != 10) return v;
				return v.substr(0, 3) + sp + v.substr(3, 2) + sp + v.substr(5, 5);
			}

			function fnListType1(jsonResultSet, iDefaultRow) {
				var htmlString = "";
				var sum1 = commaNum(parseInt(jsonResultSet[0].FIELD01));
				var sum2 = commaNum(parseInt(jsonResultSet[0].FIELD02));
				//외화가 없으면 빈값, 있으면 원화 아래 표시
				var sum3 = parseInt(jsonResultSet[0].FIELD03) == 0 ? "" : "<BR><BR>" + commaNum(parseInt(jsonResultSet[0].FIELD03));
				var sum4 = parseInt(jsonResultSet[0].FIELD04) == 0 ? "" : "<BR><BR>" + commaNum(parseInt(jsonResultSet[0].FIELD04));

				var Tsum = digitToHangul(parseInt(jsonResultSet[0].FIELD01)) + "원<BR>(₩" + sum1 + ")";
				var tran = jsonResultSet[0].TRAN_CURCD;				//거래통화코드

				var lastRow = jsonResultSet.length - 1;	//T_SUM row가 2건이상 발생할 수 있으므로, T_TABLE의 마지막 row를 사용함

				var sType = jsonResultSet[lastRow].FIELD18;			//전표구분

				for (i = 1; i < jsonResultSet.length; i++) {
					//T_SUM 테이블 리턴값이 2건이상일 경우 순차적으로 모두 표시
					if (jsonResultSet[i].T_SUM) {

						if (jsonResultSet[i].TRAN_CURCD == "KRW") {
							sum1 += "<BR>" + commaNum(parseInt(jsonResultSet[i].FIELD01));
							sum2 += "<BR>" + commaNum(parseInt(jsonResultSet[i].FIELD02));
							Tsum += "<BR>" + digitToHangul(parseInt(jsonResultSet[i].FIELD01)) + "원<BR>(₩" + commaNum(parseInt(jsonResultSet[i].FIELD01)) + ")"
						} else {
							/* 표시안함
										sum3 += parseInt(jsonResultSet[i].FIELD03) == 0 ? "" : "<BR><BR>" + commaNum(parseInt(jsonResultSet[i].FIELD03));
										sum4 += parseInt(jsonResultSet[i].FIELD04) == 0 ? "" : "<BR><BR>" + commaNum(parseInt(jsonResultSet[i].FIELD04));
										Tsum += "<BR>"+commaNum(parseInt(jsonResultSet[i].FIELD03)) +"("+jsonResultSet[i].TRAN_CURCD+")";
							*/
						}
						tran += "<BR>" + jsonResultSet[i].TRAN_CURCD;

					} else {
						var jsonResult = jsonResultSet[i];
						var money1 = parseInt(jsonResult.FIELD06);
						var money2 = parseInt(jsonResult.FIELD07);
						money1 = money1 == 0 ? "" : commaNum(money1);
						money2 = money2 == 0 ? "" : commaNum(money2);
						//외화가 없으면 빈값, 있으면 원화 아래 표시, 소수점이하 표시
						money1 += parseInt(jsonResultSet[i].FIELD12) == 0 ? "" : "<BR><BR>" + commaNum(jsonResultSet[i].FIELD12);
						money2 += parseInt(jsonResultSet[i].FIELD13) == 0 ? "" : "<BR><BR>" + commaNum(jsonResultSet[i].FIELD13);

						var cellVal_11 = jsonResult.FIELD09 == "" ? "<BR>" : jsonResult.FIELD09;
						var cellVal_22 = jsonResult.FIELD10 == "" ? "<BR>" : jsonResult.FIELD10;
						var cellVal_33 = jsonResult.FIELD11 == "" ? "<BR>" : jsonResult.FIELD11;
						cellVal_11 = format_corp(cellVal_11, "-");

						var cellVal_1 = jsonResult.FIELD20 == "" ? "" : format_date(jsonResult.FIELD20, "-");
						var cellVal_2 = jsonResult.FIELD04 == "" ? "" : jsonResult.FIELD04;
						var cellVal_3 = jsonResult.FIELD05 == "" ? "" : jsonResult.FIELD05;

						switch (sType) {
							case "03":	//자산
								//cellVal_1 = jsonResult.FIELD14;
								break;
							case "05":	//어음
								cellVal_1 = jsonResult.FIELD25;	//발행은행
								cellVal_2 = chkBlank(jsonResult.FIELD16, "");
								cellVal_2 = cellVal_2 == "" ? "" : format_date(jsonResult.FIELD16, "-");	//발행일
								cellVal_3 = jsonResult.FIELD17 == "" ? "" : format_date(jsonResult.FIELD17, "-");	//만기일
								break;
						}

						htmlString += "<tr>";
						htmlString += "<td rowspan='2' class='dwp-center'>" + parseInt(jsonResult.FISEQ) + "</td>";
						htmlString += "<td class='dwp-center'>" + jsonResult.FIELD21 + "</td>"; //전표번호
						htmlString += "<td class='dwp-center'>" + jsonResult.FIELD03 + "</td>"; //계정명
						htmlString += "<td class='dwp-center' rowspan='2'>" + cellVal_1 + "<BR><BR>" + cellVal_11 + "</td>"; //증빙일	//사업자번호
						htmlString += "<td class='dwp-center' rowspan='2'>" + cellVal_2 + "<BR><BR>" + cellVal_22 + "</td>"; //코스트센터	//거래처코드
						htmlString += "<td class='dwp-center' rowspan='2'>" + cellVal_3 + "<BR><BR>" + cellVal_33 + "</td>"; //코스트센터명	//거래처명
						htmlString += "<td class='dwp-right' rowspan='2'>" + money1 + "</td>"; //차변(원화)
						htmlString += "<td class='dwp-right' rowspan='2'>" + money2 + "</td>"; //대변(원화)
						htmlString += "</tr>";
						htmlString += "<tr>";
						htmlString += "<td lass=dwp-center colspan='2'>" + jsonResult.FIELD08 + "</td><td></td>"; //적요
						htmlString += "</tr>";
					}


				}

				htmlString += "<tr>";
				htmlString += "<th  class=dwp-center colspan='6'>" + $fn.getCodeMsg("aprv_sub_216.title.a17")+ "</td>";
				htmlString += "<td class='dwp-right dwp-bold'>" + sum1 + "</td>";		//차변(원화) //(외화) 표시안함
				htmlString += "<td class='dwp-right dwp-bold'>" + sum2 + "</td>";		//대변(원화) //(외화) 표시안함
				htmlString += "</tr>";

				//$("#sumMoney").text(Tsum);	//일금
				$("#sumMoney",el).html(Tsum);	//일금

				switch (sType) {
					case "03":
						//$("#cellTitle_1").text('자산코드');
						break;
					case "05":
						$("#cellTitle_1",el).text('발행은행');
						$("#cellTitle_2",el).text('발행일');
						$("#cellTitle_3",el).text('만기일');
						break;
				}


				return htmlString;
			}

				//품의서 삭제
			$('[name="role_btn_del"]', el).on('click', function () {
				// #draftDocLink 내부의 체크된 체크박스들을 모두 찾아요
				var $checkedCheckboxes = $('#draftDocLink .dwp-check:checked');

				// 선택된 항목이 있는지 확인
				if ($checkedCheckboxes.length > 0) {
					// 사용자에게 삭제 확인 팝업 (alert 대신 confirm을 쓰면 '취소' 기능도 추가 가능!)

					// 체크된 각 체크박스를 반복하며 해당 부모 요소(link-item-wrapper)를 제거
					$checkedCheckboxes.each(function () {
						$(this).closest('.link-item-wrapper').remove();
					});
					//alert('선택한 항목들이 삭제되었습니다!'); // 삭제 완료 팝업

				} else {
					// 선택된 항목이 없을 때 알림
					$fn.alert({//aprv_sub_118.title.a36
						msg: $fn.getCodeMsg("aprv_sub_216.msg.a1")
					});

				}

				_$$.aprv_sub216.updateLinkIndices($doc);
			});

			function openLinkInPopup(targetUrl, e) {
				if (e) {
					e.preventDefault(); // 기본 링크 동작 방지 (혹시 몰라서)
				}

				console.log(targetUrl)
				var targetUrl1;
				var startIndex = targetUrl.indexOf("url=");
				console.log(targetUrl.indexOf("gw/DeptBox") )
				if (targetUrl.indexOf("gw/DeptBox") >= 0 || targetUrl.indexOf("gw/dealbox") >= 0) {
					targetUrl1 = targetUrl.substring(startIndex + "url=".length);
					
				} else {
					targetUrl1 =  targetUrl
				}

				var windowName = 'popupWindow';
				var screenWidth = window.screen.width;
				var screenHeight = window.screen.availHeight;
				var popupWidth = 1100;
				var popupHeight = screenHeight;
				var leftPosition = 0;
				var topPosition = 0;
				var features = 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + leftPosition + ',top=' + topPosition + ',scrollbars=yes,resizable=yes';

				//window.open(targetUrl1, windowName, features);
				$fn.winopenExt(targetUrl1, "",features);
				return false; // 일부 브라우저에서 a 태그의 기본 동작 방지 목적 (true/false 반환해야 하는 경우)
			}

			$('#draftDocLink', el).on('click', 'a[data-popup-url]', function (e) {
				var targetUrl = $(this).data('popup-url'); // data-popup-url 속성에서 URL을 가져옴
				
					_open(targetUrl); // 전역 함수 호출
				return false; // 링크의 기본 동작 방지
			});

			function _open(targetUrl) {
				var _url = '',
					_link = '';

				var targetUrl1;
				var startIndex = targetUrl.indexOf("url=");
				console.log(targetUrl.indexOf("gw/DeptBox"))

				targetUrl1 = targetUrl.substring(startIndex + "url=".length);



				_url = targetUrl1;
				console.log($doc.options.docstatus)
				function NewWindow(mypage, myname, w, h, scroll) {
					var winl = (screen.width - w) / 2;
					var wint = (screen.height - h) / 2;
					var settings = 'height=' + h + ',';
					settings += 'width=' + w + ',';
					settings += 'top=' + wint + ',';
					settings += 'left=' + winl + ',';
					settings += 'scrollbars=' + scroll + ',';
					settings += 'resizable=yes';

					var win = window.open(mypage, myname, settings);

					try {
						if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
					} catch (e) { console.log(e) };
				}
				console.log(_url)
				//2024.12.19 by dwlee
				if (_url.indexOf("gw") > -1 && $doc.options.docstatus == "draft") {

					NewWindow(_url, "AprWin", "887", "800", "no");
					return;
				}


				var nsfPath = _url.substring(0, _url.indexOf("/vdockey"));
				var unidMatch = _url.match(/\/vdockey\/([a-zA-Z0-9]+)/);
				var unid = unidMatch ? unidMatch[1] : null;

				//===========================================================================
				// TCC스틸 이후에 개발된 버전에서는 완료함에 독서가자 들어가도록 구성되어 있음
				// 타인에게 공유가 될 수 있으므로 권한없는 문서를 만들어서 Open하도록 처리
				// - 2020.08.04 by dwlee
				//===========================================================================	


				//그룹웨어 과거문서는 팝업 - 2024.12.19 by dwlee
				if (_url.indexOf("gw/") > -1 && $doc.options.docstatus != "draft") {
					var _rdbpath = nsfPath;
					var _rdockey = unid;
					console.log(_rdbpath)
					console.log(_rdockey)
					$fn.xAjax({
						url: $fn.getProxyUrl("/dwp/aprv/com/aprvmng.nsf/wAgCmdGetProcess?openagent"),
						dataType: "json",
						async: false,
						cache: false,
						data: { actiontype: "findurl", Unid: _rdockey, Arg1: _rdbpath }
					}).done(function (data) {

						if (data.result == "200" && data.linkurl != "null") {
							//임시로 열어주는 문서는 북마크 및 link 버튼 제외 처리하도록 isshare 추가 - 2020.08.05 by dwlee
							if ($doc.options.ismobile == "1") {
								_url = "/" + data._rdbpath + "/wvopen_mo/" + data._rdockey + "?opendocument&isshare=0&ismobile=1";
							} else {
								_url = "/" + data._rdbpath + "/vdockey/" + data._rdockey + "?opendocument&isshare=0";
							}
							NewWindow(_url, "AprWin", "887", "800", "no");
						} else {
							$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
							return;
						}
					});

				} else if (_url.indexOf("/aprv/") > 0 && $doc.options.docstatus != "draft") {
					var _rdbpath = nsfPath;
					var _rdockey = unid;
					console.log(_rdbpath)
					console.log(_rdockey)
					$fn.xAjax({
						url: $fn.getProxyUrl(_rdbpath + "/wAgCmdGetProcess?openagent"),
						dataType: "json",
						async: false,
						cache: false,
						data: { actiontype: "findurl", Unid: _rdockey }
					}).done(function (data) {
						if (data.result == "200" && data.linkurl != "null") {
							//임시로 열어주는 문서는 북마크 및 link 버튼 제외 처리하도록 isshare 추가 - 2020.08.05 by dwlee
							if ($doc.options.ismobile == "1") {
								_url = "/" + data._rdbpath + "/wvopen_mo/" + data._rdockey + "?opendocument&isshare=0&ismobile=1";
							} else {
								_url = "/" + data._rdbpath + "/vdockey/" + data._rdockey + "?opendocument&isshare=0";
							}


							//과거 결재문서는 팝업으로 띄워야 함 - 2024.12.16 by dwlee
							if (data._rdbpath.indexOf("_gw") > 0) {
								//팝업창을 가운데 띄우는 함수 - 2024.11.29 by dwlee
								function NewWindow(mypage, myname, w, h, scroll) {
									var winl = (screen.width - w) / 2;
									var wint = (screen.height - h) / 2;
									var settings = 'height=' + h + ',';
									settings += 'width=' + w + ',';
									settings += 'top=' + wint + ',';
									settings += 'left=' + winl + ',';
									settings += 'scrollbars=' + scroll + ',';
									settings += 'resizable=yes';

									var win = window.open(mypage, myname, settings);

									try {
										if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
									} catch (e) { console.log(e) };

								}
								NewWindow(_url, "AprWin", "1050", "800", "no");
							} else {
								//결재문서는 A4로 지정한 양식인 경우 기본 넓이에서는 스크롤바가 생기므로 보정처리 - 2020.08.04 by dwlee

								/*
										by mjkim 20250117 팝업으로 변경경				
								*/
								$fn.winopen($fn.getProxyUrl(_url), '', { width: "1050" });


								/*
																		$fn.layerOpenDocument({
																			content: { url: $fn.getProxyUrl(_url) },
																			width: "920"
																		});
								*/
							}
						} else {
							$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
							return;
						}
					});
				} else {
					//작성중인 상태에서는 그냥 띄워줘도 무방함
					_url = _url + '&ismobile=' + ($doc.options.ismobile ? '1' : '0');
					//결재문서는 A4로 지정한 양식인 경우 기본 넓이에서는 스크롤바가 생기므로 보정처리 - 2020.08.04 by dwlee

					var screenHeight = window.screen.availHeight;
						var popupWidth = 1050;
						var popupHeight = screenHeight;
						var leftPosition = 0;
						var topPosition = 0;
						var features = 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + leftPosition + ',top=' + topPosition + ',scrollbars=yes,resizable=yes';

						
						$fn.winopen($fn.getProxyUrl(_url), '', { width: popupWidth,height:popupHeight,left:leftPosition,top:topPosition });
				}				

			}





			//console.log(_$tabel.getData())
		},
		// 신청서 선택 - 2024.12.31 by dwlee
		selectRequestForm1: function (_$doc, _title, _formkey, _addRefer, _callback) {
			var _loadSettingConts = function (_tabid, _$dialog) {
				var _com_code = $fn.getCurUser().pinfo.comcode;
				var _empno = $fn.getCurUser().pinfo.empno;
				var _url = "";

				//출장신청서 관련 추가 - 2025.01.16 
				var _view = "wViwList33";
				var _single = _com_code + "^" + _formkey;
				if (_$doc.options.hasOwnProperty("singlekey") && _$doc.options.singlekey != "") {
					_view = "wViwList34";
					_single = _$doc.options.singlekey;
				}

				switch (_tabid) {
					case "dwp-tabs-done-content":
						_url = "/" + _$doc.options.appComCfg.LDBP1 + "/wFrmViewJ_Sel?ReadForm" +
							"&tabid=" + "dwp-tabs-done-content" +
							"&did=" + _$dialog.options.id +
							"&view=" + _view +  //출장신청서 관련 추가 - 2025.01.16 
							"&single=" + _single + //출장신청서 관련 추가 - 2025.01.16 
							"&count=" + "10" +
							"&use=" + "att";
						break;
					case "dwp-tabs-archive-content":
						var _dbpath = _$doc.options.appComCfg.KLDBP1;
						_dbpath = _dbpath.replace(/YYYY/gi, "cyear").replace(/QT/gi, "quarter");

						_url = "/" + _dbpath + "/wFrmViewJ_Sel?ReadForm" +
							"&tabid=dwp-tabs-archive-content" +
							"&did=" + _$dialog.options.id +
							"&view=" + _view +  //출장신청서 관련 추가 - 2025.01.16 
							"&single=" + _single + //출장신청서 관련 추가 - 2025.01.16 
							"&count=10" +
							"&use=att";
						break;
				}
				if (_url == "") return;

				$('#dwp-tabs-done-content', _$dialog.element).html('');
				$('#dwp-tabs-archive-content', _$dialog.element).html('');
				$fn.xAjax({
					type: "GET",
					url: $fn.getProxyUrl(_url),
					success: function (data, textStatus, xhr) {
						$("#" + _tabid, _$dialog.element).html(data);
					},
					error: function (xhr, status, e) {
					}
				});
			}
			
			var _h = '';
			_h += '<div class="dwp-gnb-setting-dialog">';
			_h += '<div class="dwp-tabs-simple">';
			_h += '<ul>';
			_h += '<li gubun="done"><a href="#dwp-tabs-done-content">' + $fn.getCodeMsg('aprv.title.done') + '</a></li>';				// 완료함
			_h += '<li gubun="archive"><a href="#dwp-tabs-archive-content">' + $fn.getCodeMsg('aprv.title.archive') + '</a></li>';	// 보관함
			_h += '</ul>';
			_h += '<div class="dwp-tabs-done-content" id="dwp-tabs-done-content">1</div>';
			_h += '<div class="dwp-tabs-archive-content" id="dwp-tabs-archive-content">2</div>';
			_h += '</div>';
			_h += '</div>';

			$dwp.ui.dialog.init(null, {
				show: { effect: "fade", duration: 300 },
				hide: { effect: "fade", duration: 300 },
				width: 1130,
				height: 720,
				modal: true,
				title: _title,
				content: { html: _h, data: {} },
				islangconvert: false,
				initcallback: function (_$dialog) {
					var _$tab = $(".dwp-gnb-setting-dialog .dwp-tabs-simple", _$dialog.element);
					_$tab.tabs({ active: 0 });

					_loadSettingConts('dwp-tabs-done-content', _$dialog);

					_$tab.find('ul li').each(function () {
						var _self = this;
						$(_self).off().on('click', function () {
							var gubun = "setting";
							gubun = $(_self).attr("gubun");
							_loadSettingConts('dwp-tabs-' + gubun + '-content', _$dialog);
						});
					});
				},
				buttons: [
					{
						title: $fn.getCodeMsg('comm.btn.confirm'),
						click: function (_$dialog) {
							var element = _$dialog.element.view('instance');
							var selDoc = element.getChecked();

							if ($(selDoc).size() == 0) {
								$fn.alert({//aprv_sub_118.title.a36
									msg: $fn.getCodeMsg("aprv_sub_216.msg.a2")
								});

								return false;
							}

							console.log(selDoc)
							var hasAnyDuplicate = false; // 하나라도 중복이 발생했는지 추적하는 플래그
							$.each(selDoc, function (idx, o) {
								console.log(o._openurl, o._subject);
								var num = parseInt(idx) + 1
								var isDuplicate = addDraftDocLink(o._subject, "/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + o._openurl,_$doc);
								if (!isDuplicate) { // 만약 addDraftDocLink가 false를 반환했다면 (중복이 발생했다면)
									hasAnyDuplicate = true; // 중복 플래그를 true로 설정
									return false;           // jQuery의 each() 루프를 중단
								}

							});
							if (!hasAnyDuplicate) {
								_$dialog.close();
							}


						}
					},
					{
						title: $fn.getCodeMsg('comm.btn.cancel'),
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
				]
			});



			

			function addDraftDocLink(linkText, linkUrl,$doc) {
				// --- 중복 방지 로직 시작 ---
				var isDuplicate = false;
				$('#draftDocLink a',$doc.element).each(function () {
					// !!! 여기가 수정되었습니다: href 대신 data-popup-url 속성을 비교합니다. !!!
					if ($(this).attr('data-popup-url') === linkUrl) {
						isDuplicate = true;
						return false; // jQuery each() 루프 중단
					}
				});

				if (isDuplicate) {
					$fn.alert({//aprv_sub_118.title.a36
						msg: $fn.getCodeMsg("aprv_sub_216.msg.a3")
					});
					//alert('이미 같은 링크가 추가되어 있습니다!'); // 사용자에게 알림
					return false; // 함수 실행을 여기서 중단, 링크를 추가하지 않음
				}
				var $linkItem = $('<div>').addClass('link-item-wrapper').css({
					'display': 'flex !important',              // flex 컨테이너로 설정 (강제!)
					'align-items': 'center !important',        // 자식들을 수직 가운데 정렬 (강제!)
					'position': 'relative !important',         // 자식 요소들의 positioning 기준 (강제!)
					'z-index': '2147483647 !important',        // 최고 z-index 부여 (아예 다른 것 다 덮도록)
					'padding': '5px 0 !important',             // 위아래 여백을 줘서 공간 확보 (강제!)
					'box-sizing': 'border-box !important'      // 박스 모델도 강제
				});


				// 체크박스 ID 생성 (고유하게 만들기 위해) - input 태그에 적용될 것
				var checkboxId = 'checkbox-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

				// --- 여기부터 $checkbox 생성 부분을 네가 제공한 HTML 구조로 변경 ---
				var $inputElement = $('<input>').attr({
					name: 'vvchk',
					type: 'checkbox',
					class: 'dwp-check',
					id: checkboxId,
					'aria-label': '링크 삭제용 체크박스: ' + linkText,
					'disabled': false // <-- 이 줄 추가: 혹시 모를 disabled 방지
				}).css({
					'vertical-align': 'middle !important' // input 자체도 middle로
				});

				var $spanElement = $('<span>').css({
					'vertical-align': 'middle !important' // 내부 span도 middle로
				});

				var $label = $('<label>').append($inputElement, $spanElement).attr('style',
					'min-width: 30px !important;' +
					'margin-bottom: 10px !important;' +
					'display: inline-flex !important;' +
					'align-items: center !important;' +
					'justify-content: center !important;' + // 필요 없으면 제거 가능
					'height: 100% !important;' +
					'vertical-align: middle !important;' +
					'box-sizing: border-box !important;' +
					'padding: 0 !important;' +
					'line-height: normal !important;'
				);

				// 이제 이 div가 이전에 var $checkbox가 담당하던 역할을 할 거야.
				var $fullCheckboxStructure = $('<div>').addClass('dwp-checkbox textless').append($label).css({
					'pointer-events': 'auto !important',
					'margin-right': '10px !important',
					'z-index': '2147483647 !important',
					'display': 'flex !important',        // dwp-checkbox도 flex 컨테이너로 설정 (강제!)
					'align-items': 'center !important',  // dwp-checkbox 내부 요소 수직 중앙 정렬 (강제!)
					'height': 'auto !important'          // 높이 자동 조정
				});




				var $link = $('<a>').attr({
					// 기존 href: linkUrl 대신 자바스크립트 기본 동작 방지로 변경
					'href': 'javascript:void(0)',
					// 링크 클릭 시 호출될 팝업 함수를 onclick 속성에 직접 삽입!
					'data-popup-url': linkUrl
				}).text(linkText).css({
					'color': '#0000FF !important',                 // 파란색
					'text-decoration': 'underline !important',     // 밑줄
					'font-size': '13px !important',
					'line-height': '20px !important',              // 줄 간격 (체크박스와 정렬을 위해)
					'display': 'inline-block !important',
					'vertical-align': 'middle !important',         // 얘도 수직 가운데 정렬
					'margin-left': '0 !important',
					'pointer-events': 'auto !important',
					'flex-grow': '1 !important',
					'padding': '0 5px !important',
					'z-index': '2147483646 !important'
				});


				// --- 팝업 창 로직 수정 끝 ---

				// 이전에 $checkbox 대신 $fullCheckboxStructure를 추가!
				$linkItem.append($fullCheckboxStructure, $link);
				$('#draftDocLink',$doc.element).append($linkItem);

				
				_$$.aprv_sub216.updateLinkIndices($doc);

				return true;
			}


		},
		updateLinkIndices: function($doc) {
				console.log("실행")
				var currentIdx = 1; // 1부터 시작하는 인덱스

				$('#draftDocLink .link-item-wrapper',$doc.element).each(function () {
					var $item = $(this);
					// $item 안에 기존 .display-idx-span이 있는지 찾거나 생성
					var $idxSpan = $item.find('.display-idx-span'); // 클래스명으로 찾기

					if ($idxSpan.length === 0) { // .display-idx-span이 없으면 새로 생성
						$idxSpan = $('<span>').addClass('display-idx-span').css({
							'color': '#000000 !important', // 검은색
							'font-size': '13px !important',
							'margin-right': '5px !important', // idx와 링크 텍스트 사이 간격
							'vertical-align': 'middle !important' // 수직 가운데 정렬
						});
						// 생성된 $idxSpan을 체크박스 구조 (dwp-checkbox) 바로 뒤에 삽입
						$item.find('.dwp-checkbox.textless').after($idxSpan);
					}
					$idxSpan.text(currentIdx + ". "); // 인덱스 업데이트
					currentIdx++;
				});
			}
		/*
		 * 양식 저장시 호출 함수
		 * @param 	{Object}	$doc		Doc Instance		
		 * @return	{Boolean}	유효성 체크여부
		 */
		, save: function ($doc, opt) {
			var _opt = $doc.options;
			var _aopt = $.extend({ actiontype: "" }, opt);
			var el = $doc.element;


			$('[name=fum_link]', el).val($('#draftDocLink', el).html())

			if (_aopt.actiontype == "raise") {


			}
			return true;
		}
	}
}($dwp.cns("app"), jQuery));















