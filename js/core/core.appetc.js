
/**
 * <b>Add-In 라이브러리</b>
 * <br>초기로딩이 필요한 함수를 정의합니다.
 * @module core/appetc
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.appetc|core.appetc}
 */
(function (/** @lends	module:core~$dwp.core */ _$$, $) {
	/**
	 * @namespace
	 */
	_$$.appetc = {
		edms: {
			lnb: function (type, view) {
				var _$lnb = $("div.dwp-lnb", $dwp.core.getLnb())
					, _$docbox = $("select[name=_DOC_BOX]", _$lnb)
					, _newDb = "/dwp/com/edms/edm_new.nsf"
					, _inoutDB = "/dwp/com/edms/edm_inout.nsf"
					, _docboxcode = _$docbox.xval();

				var _url = "";
				if (type == "C") {   // 임시저장
					_url = _newDb + "/wFrmView?ReadForm&view=" + view + "&docboxcd=" + _docboxcode + "&single=" + _docboxcode + "_{empno}";
				} else if (type == "R") {
					_url = _inoutDB + "/wFrmView?ReadForm&view=" + view + "&docboxcd=" + _docboxcode + "&single=" + _docboxcode + "_{empno}";
				} else if (type == "N") {
					_url = "/dwp/com/edms/edm_new.nsf/wFrm01?OpenForm&docboxcd=" + _docboxcode + "&fcd="
				}

				$fn.loadPage({ link: _url, linktype: "PAGE" });
			}
		},
		gotoMSubHome: function (id) {
			var _gid = "";
			_gid = id;

			$dwp.core.mportal.goSub({ gid: _gid });
		},
		gotoSubHome: function (id) {
			//portalHandler.GNB.gotoGnb(id);
			var _gid = "";
			if (id == "vpr") {
				_gid = "M0018";
			} else if (id == "cop") {
				_gid = "M0020";
			}
			$dwp.core.portal.goSubPortal({ gid: _gid });
		},
		lnb_winopen: function (url) {
			var _url = $dwp.core.util.getProxyUrl(url);
		},
		lnb_year_data: function (startYear) {
			var _rtn = [], _syear = startYear, _date = new Date(), _eyear = _date.getFullYear();

			for (var i = _eyear; i >= _syear; i--) {
				var _opt = { val: i, txt: i, selected: false };
				if (i == (_eyear - 1)) {
					_opt.selected = true;
				}
				_rtn.push(_opt);
			}
			/*
				  _rtn.push({
					val: "oldbox",
					txt: "구)문서함(2019.06이전)",
					selected: false
				  });
			*/
			return _rtn;
		},
		lnb_approvalboard: function () {
			var _url =
				"/dwp/aprv/com/link/appbbs.nsf/wFrmViewJ?ReadForm&view=wViwList40";
			var _empno = $fn.getCurUser().pinfo.empno;
			var _chknum = _empno.indexOf("8");
			if (_chknum == "0") {
				$fn.loadPage({ link: _url + "_zh", linktype: "PAGE" });
			} else {
				$fn.loadPage({ link: _url, linktype: "PAGE" });
			}
		},

		lnb_approvalboard_mo: function () {
			var _url =
				"/dwp/aprv/com/link/appbbs.nsf/wFrmViewJ_mo?ReadForm&view=wViwList40";
			var _empno = $fn.getCurUser().pinfo.empno;
			var _chknum = _empno.indexOf("8");

			if (_chknum == "0") {
				$dwp.core.mportal.loadPage({
					link: _url + "_zh",
					linktype: "PAGE",
					layer: "view",
					subtype: "read",
					title:
						"ko:결재게시,en:Approval Notice,in:Posting Persetujuan,zh:审批公告,hu:Jóváhagyási közzététel"
				});
			} else {
				$dwp.core.mportal.loadPage({
					link: _url,
					linktype: "PAGE",
					layer: "view",
					subtype: "read",
					title:
						"ko:결재게시,en:Approval Notice,in:Posting Persetujuan,zh:审批公告,hu:Jóváhagyási közzététel"
				});
			}
		},

		lnb_delegate: function () {
			var _me = this,
				_form = "wFrmDelegationDialog";

			var _Dailog = $fn.dialog(null, {
				modal: true,
				resizable: false,
				draggable: true,
				islangconvert: false,
				width: "420px",
				height: "auto",
				show: "fade", //effect fade
				hide: "fade", //effect
				content: {
					url: "/dwp/aprv/com/admindrafttemplate.nsf/" + _form + "?openForm"
				},

				close: function () {
					console.log("close");
				}
			});
		},

		lnb_signopen: function () {
			var _me = this,
				_form = "wFrmSign";

			var _Dailog = $fn.dialog(null, {
				modal: true,
				resizable: false,
				draggable: true,
				islangconvert: false,
				width: "420px",
				height: "auto",
				show: "fade", //effect fade
				hide: "fade", //effect
				content: { url: "/dwp/aprv/com/sign.nsf/" + _form + "?openForm" },

				close: function () {
					console.log("close");
				}
			});
		},
		// 결재 알림설정
		lnb_aprvalert: function () {
			var _me = this,
				_form = "wFrmAprvAlert";

			var _Dailog = $fn.dialog(null, {
				modal: true,
				resizable: false,
				draggable: true,
				islangconvert: false,
				width: "620px",
				height: "auto",
				show: "fade", //effect fade
				hide: "fade", //effect
				content: { url: "/dwp/aprv/com/aprvmng.nsf/" + _form + "?OpenForm" },

				close: function () {
					console.log("close");
				}
			});
		},
		// 결재 비번 변경
		lnb_aprvpass: function () {
			var _me = this,
				_form = "wFrmAprvPw";

			var _Dailog = $fn.dialog(null, {
				modal: true,
				resizable: false,
				draggable: true,
				islangconvert: true,
				width: "620px",
				height: "auto",
				show: "fade", //effect fade
				hide: "fade", //effect
				content: { url: "/dwp/aprv/com/aprvmng.nsf/" + _form + "?OpenForm" },

				close: function () {
					console.log("close");
				}
			});
		},

		lnb_cyberaudit: function () {
			// $dwp.core.appetc.lnb_cyberaudit
			var _me = this;
			var _url = [];
			_url["ko"] =
				"http://www.hankooktire.com/kr/cyber-auditor/information.html";
			_url["en"] =
				"http://www.hankooktire.com/global/cyber-auditor/information.html";
			_url["zh"] =
				"http://www.hankooktire.com/cn/cyber-auditor/information.html";
			_url["hu"] =
				"http://www.hankooktire.com/global/cyber-auditor/information.html";
			_url["in"] =
				"http://www.hankooktire.com/global/cyber-auditor/information.html";

			//내부 게시판 연결
			var _url_page =
				"/dwp/hq/bbs/w8900.nsf/wFrmView?ReadForm&view=wv02_created_des&lnbid=W8900&boardid=bbs0007&single=bbs0007";
			$fn.loadPage({ link: _url_page, linktype: "PAGE" });

			//윈도우 오픈 처리
			var wtitle = "";
			var wopt = "";
			user_width = screen.width - 100;
			user_height = screen.height - 100;
			wopt =
				"scrollbars=yes,toolbar=yes,location=yes,status=yes,menubar=yes,resizable=yes,";
			wopt =
				wopt +
				"width=" +
				user_width +
				",height=" +
				user_height +
				",left=100,top=100";

			var _uinfo = $fn.getCurUser();
			var _eurl = _url[_uinfo.lang];

			$dwp.core.util.winopenExt(_eurl, wtitle, wopt); //function(url, title, opt)
		},

		lnb_lifeportal: function () {
			location.href =
				"/wps/portal/Home/" +
				ePortalConfig.companyCode +
				"/" +
				ePortalConfig.zregcode +
				"/lifestory/home";
		},

		lnb_workmanual: function () {
			location.href =
				"/wps/portal/Home/" +
				ePortalConfig.companyCode +
				"/" +
				ePortalConfig.zregcode +
				"/hidden/manual";
		},

		lnb_km: function () {
			location.href =
				"/wps/portal/Home/" +
				ePortalConfig.companyCode +
				"/" +
				ePortalConfig.zregcode +
				"/hidden/km";
		},

		lnb_CollapseExpand: function (menu) {
			var key = menu.key;
			// $("#tree_" + key, $dwp.core.getLnb()).toggleClass("dwp-hidden");
			$("#tree_" + key, $dwp.core.getLnb()).closest("div.tree-type").toggleClass("dwp-none");		//회색잔상 안보이게 보완. by noh
		},

		goMenu: function (mid) {
			// 대상 시스템 권한체크
			var _me = this
				, _cuserinfo = $dwp.core.getCurUser()
				, _cip = _cuserinfo.ip
				//USER_STATUS + "^" + SYSTEM_EP + "^" + SYSTEM_GW + "^" + SYSTEM_EMAIL + "^" + SYSTEM_MIS + "^" + SYSTEM_GIS
				, _misinfo = _cuserinfo.pinfo.mis_user_info.split("^")
				, _outerip = $dwp.core.getSysinfo().outerips
				, _outerips = (_outerip = "" ? [] : _outerip.split(","));

			// 사용자별 시스템 권한체크
			if (mid == "mis" || mid == "eis") {
				if (_misinfo[4] != "Y") {
					$fn.alert({ msg: $fn.getCodeMsg("사용권한이 없습니다. 관리자에게 문의하십시오.") });
					return;
				}
			} else if (mid == "gis") {
				if (_cuserinfo.pinfo.comcode != "100001") {
					$fn.alert({ msg: $fn.getCodeMsg("사용권한이 없습니다. 관리자에게 문의하십시오.") });
					return;
				}
			}

			// 외부접속체크
			var _isOuter = false;
			$.each(_outerips, function (i, _ip) {
				var ip = $.trim(_ip);
				if ($dwp.core.appetc._ipCheck(ip, _cip)) {
					_isOuter = true;
					return false;
				}
			});

			if (_isOuter) {
				$fn.alert({ msg: $fn.getCodeMsg("외부 접속 시에는 사용할 수 없는 기능입니다.") });
				return;
			}

			// 시스템 오픈하기
			if (mid == "mis") {
				$dwp.core.appetc._fPopupDoc("http://mis.seoulgas.co.kr/mi/index.jsp", "?ep_MiKey=SCGWEB&ep_prefix=&ep_formId=", "800", "600", "menubar=yes,scrollbars=yes,resizable=yes");
			} else if (mid == "eis") {
				$dwp.core.appetc._fPopupDoc("http://mis.seoulgas.co.kr/mi/index.jsp", "?ep_MiKey=EISWEB&ep_prefix=&ep_formId=", "800", "600", "menubar=yes,scrollbars=yes,resizable=yes");
			} else if (mid == "gis") {
				$dwp.core.appetc._fPopupDoc("http://ugis.seoulgas.co.kr", "", "1200", "800", "scrollbars=yes,menubar=yes,resizable=yes");
			}
		},

		_fPopupDoc: function (vUrl, vArg, vW, vH, vParam) {
			var res_w = (screen.availWidth - vW) / 2;
			var res_h = (screen.availHeight - vH) / 2;

			if (window.screenLeft >= window.screen.width) {
				res_w = window.screen.width + res_w;
			}
			var wStatus1 = "width=" + vW + ", height=" + vH + ", top=" + res_h + ", left=" + res_w;
			var wStatus2 = (vParam != "") ? "," + vParam : "";
			var wStatus3 = wStatus1 + wStatus2;

			tempWin = window.open(vUrl + vArg, "_blank", wStatus3);
		},

		_ipCheck: function (sip, tip) {
			var _sip = sip.split(".")
				, _tip = tip.split(".")
				, _isCheck = true;

			if (_sip.length == 4 && _sip.length == _tip.length) {
				for (var i = 0; i < _sip.length; i++) {
					if (_sip[i] != "*" && _sip[i] != _tip[i]) {
						_isCheck = false;
						break;
					}
				}
				return _isCheck;
			} else {
				return false;
			}
		},
		IsIE: function () {
			var agent = navigator.userAgent.toLowerCase();
			if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
				return true;  // ie일 경우
			} else {
				return false; // ie가 아닐 경우
			}
		},

		GoTodayTalk: function () {
			var dateObj = new Date();
			var year = dateObj.getFullYear();
			var month = dateObj.getMonth() + 1;
			var day = dateObj.getDate();

			if (month.toString().length < 2) {
				month = '0' + month;
			}
			if (day.toString().length < 2) {
				day = '0' + day;
			}
			var today = year + "-" + month + "-" + day; // 결과 2019-3-19

			$fn.xAjax({
				url: "/dwp/com/portal/portlet.nsf/agGetFixedPortlet?openAgent&date=" + today + "&portletId=todayWord&userId=",
				method: "GET",
				dataType: "json",
				async: false,
				cache: false
			}).done(function (jdata) {

				jo = jdata.dataSet[0];
				//alert(jo.TITLE + "\n" + jo.DESCRIPTION + "\n" + jo.MAN_INFO);
				var htmlString = "<strong>" + jo.TITLE + "</strong>";
				htmlString += "<br>" + jo.DESCRIPTION;
				htmlString += "<br>" + ((jo.MAN_INFO.trim() != "") ? "- " + jo.MAN_INFO + " -" : "");
				//$(".todayTalk_wrap > .cont").html(htmlString);

				//공급량 현황
				var htmlStr = "<div class='dwp-section tiny-type'>"
				htmlStr += "<div class='dwp-table-vertical form-type line-type'  data-top='xs'>"
				htmlStr += "<table>";
				htmlStr += "<colgroup>";
				htmlStr += "<col width=100%>";
				htmlStr += "</colgroup>";
				htmlStr += "<tr><td>" + htmlString + "</td></tr>";
				htmlStr += "</table></div></div>";

				var _buttons = [
					{
						"title": $fn.getCodeMsg("확인"),
						"click": function (obj) {
							obj.close();
						}
					}
				];
				$fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					title: '오늘의 말씀',
					width: 300,
					height: 'auto',
					show: 'fade',			// effect
					hide: 'fade',			// effect
					//autoOpen: false,		//.dialog("open")호출시만 열림
					position: { my: "left+150  bottom-200", at: "left bottom-200", collision: "flipfit", of: window },
					buttons: _buttons,
					content: { html: htmlStr }
				});

			});
		},
		//팀근태현황
		GoTeamAttendance_More: function () {

			var _buttons = [
				{
					"title": $fn.getCodeMsg("닫기"),
					"click": function (obj) {
						obj.close();
					}
				}
			];

			$fn.dialog(null, {
				modal: true,
				resizable: false,
				draggable: true,
				title: '팀근태이력',
				width: 750,
				height: 450,
				show: 'fade',			// effect
				hide: 'fade',			// effect
				//autoOpen: false,		//.dialog("open")호출시만 열림
				buttons: _buttons,
				content: { url: "/dwp/com/portal/portlet.nsf/TeamAttendance?openform" }
			});

		},

		GoTodayMenu: function () {
			$fn.xAjax({
				url: "/dwp/com/work/week_menu.nsf/agGetTodayMenu?OpenAgent",
				method: "GET",
				dataType: "json",
				async: false,
				cache: false
			}).done(function (jsonResult) {
				console.log(jsonResult);

				var htmlStr = "<div class='dwp-section tiny-type'>"
				htmlStr += "<div class='dwp-table-vertical form-type line-type'  data-top='xs'>"
				htmlStr += "<table>";

				htmlStr += "<colgroup>";
				htmlStr += "<col width=29%>";
				htmlStr += "<col width=71%>";
				htmlStr += "</colgroup>";

				htmlStr += "<tr><th colspan=2 class='dwp-center'><b>" + jsonResult.date + "(" + jsonResult.weekname + ")" + "</b></th></tr>";
				htmlStr += "<tr><th class='dwp-center'>메뉴1</th><td class='clContentTd'>" + jsonResult.menu_1 + "</td></tr>";
				htmlStr += "<tr><th class='dwp-center'>메뉴2</th><td class='clContentTd'>" + jsonResult.menu_2 + "</td></tr>";
				htmlStr += "<tr><th class='dwp-center'>메뉴3</th><td class='clContentTd'>" + jsonResult.menu_3 + "</td></tr>";

				//	if (jsonResult.menu_4 != "") {
				htmlStr += "<tr><th class='dwp-center'>메뉴4</th><td class='clContentTd'>" + jsonResult.menu_4 + "</td></tr>";
				//	}

				//	if (jsonResult.menu_5 != "") {
				htmlStr += "<tr><th class='dwp-center'>메뉴5</th><td class='clContentTd'>" + jsonResult.menu_5 + "</td></tr>";
				//	}

				//	if (jsonResult.menu_6 != "") {
				htmlStr += "<tr><th class='dwp-center'>메뉴6</th><td class='clContentTd'>" + jsonResult.menu_6 + "</td></tr>";
				//	}

				//	if (jsonResult.menu_7 != "") {
				htmlStr += "<tr><th class='dwp-center'>메뉴7</th><td class='clContentTd'>" + jsonResult.menu_7 + "</td></tr>";
				//	}

				//	if (jsonResult.menu_8 != "") {
				htmlStr += "<tr><th class='dwp-center'>메뉴8</th><td class='clContentTd'>" + jsonResult.menu_8 + "</td></tr>";
				//	}

				if (jsonResult.menu_9 != "") {
					htmlStr += "<tr><th class='dwp-center'>메뉴9</th><td class='clContentTd'>" + jsonResult.menu_9 + "</td></tr>";
				}

				if (jsonResult.menu_10 != "") {
					htmlStr += "<tr><th class='dwp-center'>메뉴10</th><td class='clContentTd'>" + jsonResult.menu_10 + "</td></tr>";
				}

				htmlStr += "</table></div></div>";

				console.log(htmlStr);

				var _buttons = [
					{
						"title": $fn.getCodeMsg("창닫기"),
						"click": function (obj) {
							obj.close();
						}
					},
					{
						"title": $fn.getCodeMsg("주간식단 조회"),
						"click": function (obj) {
							$dwp.core.portal.goMenu({ gid: "L0008" });
							obj.close();
						}
					}
				];

				$fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					title: '오늘의 점심식단',
					width: 300,
					height: 'auto',
					show: 'fade',			// effect
					hide: 'fade',			// effect
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _buttons,
					content: { html: htmlStr }

				});

			}).fail(function (req, error) {
				console.log(req.responseText + "\n" + error);
			});

		},
		//전화번호부 엑셀 다운받기
		GoDownTelInfo: function () {
			var sTgUrl = "/dwp/com/bbs/w0040.nsf/agGetAttachDocInfo?OpenAgent";
			$fn.xAjax({
				url: sTgUrl,
				method: "GET",
				dataType: "html",
				async: false,
				cache: false
			}).done(function (data) {
				var arrMatchString = data.match(/<!-- Result set start -->[\s\S]*?<!-- Result set end -->/i);
				if (arrMatchString == null) {
					return false;
				}

				var jsonString = arrMatchString[0].replace(/<!-- Result set start -->/i, "").replace(/<!-- Result set end -->/i, "");
				if (jsonString == "") {
					return false;
				} else {
					//JSON 배열 모양으로 문자열 변환
					jsonString = "[" + jsonString + "]";
					var jsonResultSet = JSON.parse(jsonString);
					if (jsonResultSet.length == 0) {
						return false;
					} else {
						for (var i = 0; i < jsonResultSet.length; i++) {
							var jsonResult = jsonResultSet[i];
							var fileName = jsonResult.docid + "/$file/" + jsonResult.attname;
						}
					}
				}

				downUrl = "/dwp/com/bbs/w0040.nsf/" + fileName;
				$("#telInfoFrame").attr("src", downUrl);

			}).fail(function (req, error) {
				console.log(req.responseText + "\n" + error);
			});

		},
		//AS-IS 구GW문서함 부서함 이동 : 구부서함이 없는 신규조직 구성원인 경우 첫번째 부서함으로 이동
		lnb_go_oldbox: function () {
			var _boxpath = $fn.getCurUser().pinfo.oaprvboxpath; //oaprvboxpath : "dwp/aprv/mig/eni/DeptBox/Y020.nsf
			var _url = "";
			if (_boxpath != "") {		//AS-IS 구부서함이 있으면
				_url = "/{oaprvboxpath}/wFrmView?ReadForm&view=wvall"
				$fn.loadPage({
					link: $fn.getProxyUrl(_url),
					linktype: 'PAGE'
				});
			} else {	//AS-IS 구부서함이 없으면 무조건 첫번째 구부서함을 강제로 열어줌.
				_url = "/dwp/aprv/mig/eni/DeptBox/A00.nsf/wFrmView?ReadForm&view=wvall"
				$fn.loadPage({
					link: $fn.getProxyUrl(_url),
					linktype: 'PAGE'
				});
			}
		},
		//AS-IS 구GW문서함 보관함 이동 : 구부서함이 없는 신규조직 구성원인 경우 첫번째 부서함으로 이동
		lnb_go_oldbox2: function () {
			var _boxpath = $fn.getCurUser().pinfo.oaprvboxpath; //oaprvboxpath : "dwp/aprv/mig/eni/DeptBox/Y020.nsf
			var _url = "";
			if (_boxpath != "") {		//AS-IS 구부서함이 있으면
				_url = "/{oaprvboxpath}/wFrmView?ReadForm&view=wvall"
				_url = $fn.getProxyUrl(_url);
				_url = _url.replace(/deptbox/i, "deposit");
				$fn.loadPage({
					link: _url,
					linktype: 'PAGE'
				});
			} else {	//AS-IS 구부서함이 없으면 무조건 첫번째 구부서함을 강제로 열어줌.
				_url = "/dwp/aprv/mig/eni/deposit/A00.nsf/wFrmView?ReadForm&view=wvall"
				$fn.loadPage({
					link: $fn.getProxyUrl(_url),
					linktype: 'PAGE'
				});
			}
		}
	};
})($dwp.cns("core"), jQuery);



