/* Source File Upload Time : 2017-11-15 7:43:22 PM*/


/**
 * 전자결재 보조양식 지출(수입)결의
 * $dwp.app.aprv_subxxx.subdoc 
 */
(function (_$$, $) {
	_$$.aprv_sub220 = {
		/*
		 * 양식 로딩시 호출 함수
		 * @param 	{Object}	$doc		Doc Instance 
		 */
		load: function ($doc) {
			var _me = this
				, _opt = $doc.options
			var el = $doc.element;

			console.log("지출(수입)결의")
			console.log("$('[name=fum_link]', el).val()====" + $('[name=fum_link]', el).html())
			if ($('[name=fum_link]', el).val() != "") {
				$('#draftDocLink', el).html($('[name=fum_link]', el).val())
			}

			if (_opt.isedit == false) {
				$('.dwp-checkbox.textless label > span').remove();

				console.log("읽기모드")
				//선택글자 삭제
				$('span[data-xlang-name^="ed_Payout_"]').each(function () {
					var $span = $(this);
					var dataValue = $span.attr('data-xlang-value'); // data-xlang-value 속성 가져오기
					var dataLangTxt = $span.attr('data-xlang-txt'); // data-xlang-txt 속성 가져오기

					// data-xlang-value가 '0'이면 <span> 내부 텍스트를 공백으로
					if (dataValue === '0') {
						$span.text('');
					} else {
						// '0'이 아니면 data-xlang-txt에서 'ko:' 부분을 파싱해서 표시
						if (dataLangTxt && dataLangTxt.indexOf('ko:') !== -1) {
							var koText = dataLangTxt.split('ko:')[1]; // "ko:" 이후 부분 가져오기
							if (koText.indexOf(',') !== -1) { // 콤마가 있으면 그 전까지만 (예: "자동이체,en:Immediately" -> "자동이체")
								koText = koText.split(',')[0];
							}
							$span.text(koText.trim()); // 공백 제거 후 텍스트 설정
						} else {
							// 'ko:' 부분이 없거나 형식이 다르면 그냥 원래 텍스트 유지
							// 또는 다른 기본 텍스트를 설정할 수 있음
						}
					}
				});
				//선택글자 삭제
				$('span[data-xlang-name^="ed_Currency_"]').each(function () {
					var $span = $(this);
					var dataValue = $span.attr('data-xlang-value'); // data-xlang-value 속성 가져오기
					var dataLangTxt = $span.attr('data-xlang-txt'); // data-xlang-txt 속성 가져오기

					// data-xlang-value가 '0'이면 <span> 내부 텍스트를 공백으로
					if (dataValue === '0') {
						$span.text('');
					} else {
						// '0'이 아니면 data-xlang-txt에서 'ko:' 부분을 파싱해서 표시
						if (dataLangTxt && dataLangTxt.indexOf('ko:') !== -1) {
							var koText = dataLangTxt.split('ko:')[1]; // "ko:" 이후 부분 가져오기
							if (koText.indexOf(',') !== -1) { // 콤마가 있으면 그 전까지만 (예: "자동이체,en:Immediately" -> "자동이체")
								koText = koText.split(',')[0];
							}
							$span.text(koText.trim()); // 공백 제거 후 텍스트 설정
						} else {
							// 'ko:' 부분이 없거나 형식이 다르면 그냥 원래 텍스트 유지
							// 또는 다른 기본 텍스트를 설정할 수 있음
						}
					}
				});

			}

			//
			$('input[name^="ed_Money_"]', el).on('keyup', function () {
				var value = $(this).val();

				// 1. 소수점(.)과 숫자(0-9)를 제외한 모든 문자 제거
				//    (소수점은 하나만 허용)
				value = value.replace(/[^0-9.]/g, '');

				// 2. 소수점 기준으로 정수부와 소수부 분리
				var parts = value.split('.');
				var integerPart = parts[0];
				var decimalPart = parts[1]; // 소수부는 있어도 되고 없어도 됨

				// 3. 정수부에만 콤마 포맷팅 적용
				if (integerPart) {
					// 정수부 3자리마다 콤마 추가
					integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				}

				// 4. 소수부와 결합 (소수부가 있다면 .과 함께 결합)
				if (decimalPart !== undefined) {
					value = integerPart + '.' + decimalPart;
				} else {
					value = integerPart;
				}

				// 5. 처리된 값으로 input 필드 업데이트
				$(this).val(value);
			});




			//품의서 추가 삭제 
			$('[name="role_btn_add"]', el).on('click', function (e) {

				console.log("품의서추가클릭")
				_$$.aprv_sub220.selectRequestForm1($doc, "품의서", "AF155");
			});





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
						msg: $fn.getCodeMsg("aprv_sub_220.msg.a1")
					});

				}

				_$$.aprv_sub220.updateLinkIndices($doc);
			});

			function openLinkInPopup(targetUrl, e) {
				if (e) {
					e.preventDefault(); // 기본 링크 동작 방지 (혹시 몰라서)
				}
				var targetUrl1;
				var startIndex = targetUrl.indexOf("url=");
				console.log(targetUrl.indexOf("gw/DeptBox"))
				if (targetUrl.indexOf("gw/DeptBox") >= 0 || targetUrl.indexOf("gw/dealbox") >= 0) {
					targetUrl1 = targetUrl.substring(startIndex + "url=".length);

				} else {
					targetUrl1 = targetUrl
				}

				console.log(targetUrl1)

				var windowName = 'popupWindow';
				var screenWidth = window.screen.width;
				var screenHeight = window.screen.availHeight;
				var popupWidth = 900;
				var popupHeight = screenHeight;
				var leftPosition = 0;
				var topPosition = 0;
				var features = 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + leftPosition + ',top=' + topPosition + ',scrollbars=yes,resizable=yes';

				//window.open(targetUrl1, windowName, features);
				$fn.winopenExt(targetUrl1, "", features);
				return false; // 일부 브라우저에서 a 태그의 기본 동작 방지 목적 (true/false 반환해야 하는 경우)
			}

			$('#draftDocLink', el).on('click', 'a[data-popup-url]', function (e) {

				var targetUrl = $(this).data('popup-url'); // data-popup-url 속성에서 URL을 가져옴



				//openLinkInPopup(targetUrl, e); // 전역 함수 호출
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

					NewWindow(_url, "AprWin", "1050", "800", "no");
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
			//추가시 처리
			$('[name="btn_add"]', el).on('click', function () {

				_$$.aprv_sub220.fAddInputLine("", el)

			});
			//삭제시 처리
			$('[name="btn_del"]', el).on('click', function () {

				_$$.aprv_sub220.fDeleteInputLine(el)

			});

			//행갯수 조절 
			_$$.aprv_sub220.fDeleteInputAllLine(el);

			if (_opt.isedit) {
				console.log($('[name="ed_Money_11"]', el).val())
				if ($('[name="ed_Money_11"]', el).val() == "") {
					$("#lineInputTable tr:lt(22)", el).show();
				} else {
					$("#lineInputTable tr", el).show();
				}
			} else {
				if ($('[name="ved_money_11"]', el).val() == "") {
					$("#lineInputTable tr:lt(22)", el).show();
				} else {
					$("#lineInputTable tr", el).show();
				}

			}




			//console.log(_$tabel.getData())
		},
		fAddInputLine: function (idx, el) {
			if (idx == "") {
				$("#lineInputTable tr", el).show();	//전체표시
			} else {
				$("#lineInputTable tr:lt(22)", el).show();	//10번까지 표시
			}

		}
		,
		fDeleteInputAllLine: function (el) {
			$("#lineInputTable tr", el).hide();

		}
		,
		fDeleteInputLine: function (el) {
			$("#lineInputTable tr:gt(21)", el).hide();	//11번이상 감추기(11*2행)
			for (var idx = 11; idx <= 30; idx++) {
				// 수정: 셀렉터 문자열과 컨텍스트 요소(el)를 쉼표로 정확히 분리
				$("input[name=ed_BKTXT_" + idx + "]", el).val("");
				$("input[name=ed_ProofDate_" + idx + "]", el).val("");
				$("input[name=ed_COST_CD_" + idx + "]", el).val("");
				$("input[name=ed_COST_NM_" + idx + "]", el).val("");
				$("select[name=ed_Currency_" + idx + "]", el).val("0");
				$("input[name=ed_Money_" + idx + "]", el).val("");
				$("select[name=ed_Payout_" + idx + "]", el).val("0");
				$("input[name=ed_Cust_CD_" + idx + "]", el).val("");
				$("input[name=ed_Cust_NM_" + idx + "]", el).val("");
			}

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
				console.log(_view)
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

						/**/
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
									msg: $fn.getCodeMsg("aprv_sub_220.msg.a2")
								});

								return false;
							}

							console.log(selDoc)
							var hasAnyDuplicate = false; // 하나라도 중복이 발생했는지 추적하는 플래그
							$.each(selDoc, function (idx, o) {
								console.log(o._openurl, o._subject);
								var num = parseInt(idx) + 1
								var openurl;
								var isDuplicate;
								isDuplicate = addDraftDocLink(o._subject, "/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + o._openurl, _$doc);


								//var isDuplicate = addDraftDocLink(o._subject,  openurl);
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





			function addDraftDocLink(linkText, linkUrl, $doc) {
				// --- 중복 방지 로직 시작 ---
				var isDuplicate = false;
				$('#draftDocLink a', $doc.element).each(function () {
					// !!! 여기가 수정되었습니다: href 대신 data-popup-url 속성을 비교합니다. !!!
					if ($(this).attr('data-popup-url') === linkUrl) {
						isDuplicate = true;
						return false; // jQuery each() 루프 중단
					}
				});

				if (isDuplicate) {
					$fn.alert({//aprv_sub_118.title.a36
						msg: $fn.getCodeMsg("aprv_sub_220.msg.a3")
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
				$('#draftDocLink', $doc.element).append($linkItem);
				_$$.aprv_sub220.updateLinkIndices($doc);


				return true;
			}


		},

		updateLinkIndices: function ($doc) {
			console.log("실행")
			var currentIdx = 1; // 1부터 시작하는 인덱스

			$('#draftDocLink .link-item-wrapper', $doc.element).each(function () {
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
		, convertPayoutSelectsToReadonly: function () {
			// name이 'ed_Payout_'으로 시작하는 모든 select 태그를 찾아서 처리
			$('select[name^="ed_Payout_"]').each(function () {
				var $select = $(this);
				var selectedValue = $select.val(); // 선택된 option의 value (예: '0')
				var selectedText = $select.find('option:selected').text(); // 선택된 option의 표시 텍스트 (예: '선택')

				var displayText = ''; // 최종적으로 span에 표시할 텍스트

				// 선택된 value가 '0' (즉, "선택" 옵션)이면 공백으로 처리
				// '선택' 텍스트를 기준으로 해도 되지만, value로 판단하는 게 더 안정적이야.
				if (selectedValue === '0') {
					displayText = '';
				} else {
					// 그 외의 경우는 선택된 option의 텍스트를 그대로 표시
					displayText = selectedText;
				}

				// 새로운 <span> 태그를 생성하여 select 태그를 대체합니다.
				// 원래 select에 있던 class나 주요 스타일을 복사해 주는 게 좋아.
				var $displaySpan = $('<span>')
					.text(displayText) // 최종 표시 텍스트 설정
					// 원래 select의 name 속성을 data-original-name으로 저장해두면 나중에 필요할 때 찾기 좋아.
					.attr('data-original-name', $select.attr('name'))
					// 원래 select의 class 복사
					.addClass($select.attr('class') || '')
					// 원래 select의 중요한 CSS 속성들도 복사해서 스타일 유지
					// 실제 페이지에 맞춰서 필요한 CSS 속성을 추가하거나 제거해야 해.
					.css({
						'font-size': $select.css('font-size'),
						'color': $select.css('color'),
						'padding': $select.css('padding'),
						'margin': $select.css('margin'),
						'height': $select.css('height'), // 높이도 맞춰주는 게 레이아웃 유지에 도움
						'display': $select.css('display'), // block, inline-block 등도 복사
						'vertical-align': $select.css('vertical-align') // 수직 정렬도 중요
					});

				// 원래의 select 태그를 생성된 span 태그로 교체합니다.
				$select.replaceWith($displaySpan);
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

				var _check_item = [{ "name": "ed_BKTXT_", "type": "text" }, { "name": "ed_ProofDate_", "type": "text" }, { "name": "ed_COST_CD_", "type": "text" }, { "name": "ed_COST_NM_", "type": "text" }, { "name": "ed_Currency_", "type": "select" }
					, { "name": "ed_Payout_", "type": "select" }, { "name": "ed_Cust_CD_", "type": "text" }, { "name": "ed_Cust_NM_", "type": "text" }]
					, _check_val = "", _val = "", _idx, _ret = true;
				for (var i = 1; i <= 30; i++) {
					_check_val = $("input[name='ed_Money_" + i + "']", el).val();
					if (_check_val !== "") {
						for (var j = 0; j < _check_item.length; j++) {
							if (_check_item[j].type === "text") {
								_val = $("input[name='" + _check_item[j].name + i + "']", el).val();
								if (_val === "") {
									$fn.alert({
										msg: $fn.getCodeMsg("aprv_sub_220.msg.a4")
									}).done(function () { // <--- 팝업의 '확인' 버튼을 누른 후에 실행되는 부분!
										// 팝업이 닫힌 후에 원하는 input에 포커스를 다시 줘!
										$("[name='" + _check_item[j].name + i + "']", el).focus();
									});
									return false;
								}
							}
							else if (_check_item[j].type === "select") {
								_idx = $("select[name='" + _check_item[j].name + i + "'] option:selected", el).index();
								if (_idx === 0) {
									$fn.alert({//aprv_sub_118.title.a36
										msg: $fn.getCodeMsg("aprv_sub_220.msg.a5")
									}).done(function () { // <--- 팝업의 '확인' 버튼을 누른 후에 실행되는 부분!
										// 팝업이 닫힌 후에 원하는 input에 포커스를 다시 줘!
										$("[name='" + _check_item[j].name + i + "']", el).focus();
									});

									return false;
								}
							}
							else {
								return false;
							}
						}
					}
				}


			}
			return true;
		}
	}
}($dwp.cns("app"), jQuery));















