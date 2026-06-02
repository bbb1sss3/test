/**
 * <b>Portal 라이브러리</b>
 * <br>Portal 구성 및 History처리를 위한 함수를 정의합니다.
 * @module core/portal
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.history|core.history},
 *  	{@link module:core~$dwp.core.portal|core.portal}
 */

(function (/** @lends	module:core~$dwp.core */_$$, $) {
	/**
	 * History 처리모듈
	 * @namespace
	 */
	if (!window.hasOwnProperty("dwpmo")) {
		_$$.history = {
			_HIS: []
			/**
			 * HISTORY정보 최대보관건수
			 * @constant
			 * @default	50
			 */
			, _MAX: 50
			, _CPOS: -1
			/**
			 * history 정보추가
			 * @param	{object}	o				history정보
			 * @param	{string}	o.linktype		링크유형(LOGIN, HOME, CHOME, PHOME, PAGE)
			 * @param	{string}	o.link			링크URL
			 * @param	{boolena}	o.ishistory		history정보 여부
			 * @param	{object=}	o.lnb			LNB정보
			 * @param	{string}	o.lnb.lnbid		최상위 LNB ID
			 * @param	{string}	o.lnb.lnblink	LNB Link
			 * @param	{string}	o.lnb.lnbdlink	LNB Data Link
			 * @param	{string}	o.lnb.lnbpos	Current LNB ID
			 */
			, addHistory: function (o) {
				var _me = this;

				if (o.ishistory) return;
				if (_me._HIS.length == _me._MAX) { _me._HIS.shift(); }

				if (_me._CPOS < _me._HIS.length - 1) {
					//console.log("HIS",_me._CPOS);
					var _tmp = _me._HIS.slice(0, _me._CPOS + 1);
					//console.log("HIS",_tmp);
					_me._HIS = _tmp;
				}
				_me._HIS.push(o);
				_me._CPOS = _me._HIS.length - 1;
				if (typeof window.history.pushState == "function") {
					window.history.pushState(o, "", "")
				} else {
					location.hash = "#_hash" + (_me._HIS.length - 1);
				}
				$dwp.core.logging(o);
			}
			, _isHistory: function () {

			}
			, _getHistory: function (pos) {
				this._HIS[pos].ishistory = true;
				return this._HIS[pos];
			}
			/**
			 * History Back 처리 함수
			 * @param	{number}	pos			뒤로가기할 위치(default : -1)
			 * @param	{boolean}	refresh		새로고침 여부
			 * @deprecated
			 */
			, goback: function (pos, refresh) {
				var _me = this
					, _refresh = false || refresh
					, _pos = (typeof pos == "undefined" ? -1 : pos)
					, _isplus = (pos > 0)
					, _o = null;


				_pos = _me._CPOS + _pos;
				if (_pos < 0 || _pos >= _me._HIS.length) return;

				var _o = _me._getHistory(_pos);
				if (_o == null) return;

				_$$.portal._act(_o);
				_me._CPOS = _pos;
			}
			, gopage: function (o) {
				var _me = this;

				//console.log("gopage", o);

				function _doit() {
					if (o.linktype == "HOME" || o.linktype == "LOGIN") {
						_$$.portal._convertDisp();
						// 2019-09-17 by LHJ  - S 초기 설정된 포탈 표시하기
						var _mode = "C";
						var _curuser = $dwp.core.getCurUser();
						if (_curuser.pinfo.envinfo.hasOwnProperty("portaltype") && _curuser.pinfo.envinfo.portaltype == "P") {
							_mode = "P";
						}
						_$$.portal._portlet(_mode);
						// 2019-09-17 by LHJ  - E
					} else if (o.linktype == "CHOME") {
						// 2019-09-17 By LHJ DEL
						//$(".dwp-menu-pportal").removeClass("select");
						//$(".dwp-menu-cportal").addClass("select");
						_$$.portal._convertDisp();
						_$$.portal._portlet("C");
					} else if (o.linktype == "PHOME") {
						// 2019-09-17 By LHJ DEL
						//$(".dwp-menu-cportal").removeClass("select");
						//$(".dwp-menu-pportal").addClass("select");
						_$$.portal._convertDisp();
						_$$.portal._portlet("P");
					}
				}

				if (o.linktype == "LOGIN" || o.linktype == "HOME" || o.linktype == "CHOME" || o.linktype == "PHOME") {
					// WorkPlace
					if (_$$.portal.isDocEdit({ type: "" })) {
						$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg062") })
							.done(function () { _doit(); });
					} else {
						_doit();
					}
				} else {
					if (o.subportal == "1") {
						_$$.portal._convertDisp('S');
						_$$.portal.subPortalInit(o);
					} else {
						_$$.portal._convertDisp('M');
						if (o.lnb) {
							if (o.lnb.lnbid != "" || o.lnb.lnblink != "" || o.lnb.lnbdlink != "") {
								//console.log('Not Link')
								var _$el = $("div.dwp-lnb-wrap", $dwp.core.getLnb())
									, _lnb = _$el.data(_$$.portal._CONST._DATA.LNB)
									, _isnreload = false;

								if (o.lnb.lnbid != "" && _lnb.lnbid != o.lnb.lnbid) {
									_$$.portal.lnb(o.lnb);
								} else if (o.lnb.lnblink != "" && _lnb.lnblink != o.lnb.lnblink) {
									_$$.portal.lnb(o.lnb);
								} else if (o.lnb.lnbdlink != "" && _lnb.lnbdlink != o.lnb.lnbdlink) {
									_$$.portal.lnb(o.lnb);
								} else {
									_isnreload = true;
								}
								//_$$.portal.lnb(o.lnb);

								if (o.hasOwnProperty("top") && o.top != "") {
									if ($("#" + o.top, $dwp.core.getLnb()).size() > 0) {
										$("#" + o.top, $dwp.core.getLnb()).parent().addClass("active");
									}
									var _tree = $("#tree_" + o.top, $dwp.core.getLnb()).xtree("instance");
									if (_tree != undefined) {
										_tree.getTree().getRoot().visit(function (dtnode) {
											dtnode.expand(true);
										});
										_tree.getTree().activateKey(o.lnb.lnbpos);
									}
								}
								if (_isnreload) {
									if (o.lnb.lnbpos != "") {
										_$item = $("#" + o.lnb.lnbpos, _$el);
										if (_$item.size() > 0) {
											$(".dwp-lnb-depth2", _$el).removeClass("active");
											$(".dwp-lnb-item", _$el).removeClass("selected");
											_$item.addClass("selected")
												.parents(".dwp-lnb-depth2").addClass("active")
										}
									} else {
										_$$.portal.lnb(o.lnb);
									}
								}
							}
						}
						_$$.portal._act(o);
					}
				}
			}
		};
	}
	/**
	 * Portal 처리모듈
	 * @namespace
	 */
	_$$.portal = {
		_CONST: {
			_DATA: {
				LNB: "dwp.lnbdata"
				, LNB_ITEM: "dwp.lnb.itemdata"
				, PORTLET_INFO: { appinfos: [], userinfos: [] }
			}
		}
		, session: {
			timer: null
			, interval: 1 * 1000
		}
		// Sesseion CountDown
		, countDown: function (opt) {
			var _me = this
				, _opt = $.extend({}, opt)
				, _element = null;

			var _endTime, _hours, _mins, _msLeft, _time;

			var _timeout = $dwp.core.getSysinfo().sessiontimeout;

			if (!$.isNumeric(_timeout)) return;
			if (_timeout == "0") return;

			// Session Timer Stop
			if (_me.session.timer) {
				clearTimeout(_me.session.timer);
				_me.session.timer = null;
			}

			_element = $("span[name=_SESSION_COUNT]");

			function updateTimer() {
				_msLeft = _endTime - (+new Date);
				if (_msLeft < 0) {
					//console.log('done');
					//Log Out 처리
					//location.href = '/names.nsf?logout';
					_me.logOut();
				} else {
					_time = new Date(_msLeft);
					_hours = _time.getUTCHours();
					_mins = _hours * 60 + _time.getUTCMinutes();

					var _disp = _mins + $fn.getCodeMsg('portal.title.minute') + ' ' + ('0' + _time.getUTCSeconds()).slice(-2) + $fn.getCodeMsg('portal.title.second');
					_element.html(_disp);

					_me.session.timer = setTimeout(function () {
						if (_me.session.timer == null) { console.log("Session Timer Stop"); return; }
						updateTimer();
					}, _me.session.interval);
				}
			}

			_endTime = (+new Date) + 1000 * parseInt(_timeout, 10) * 60;

			updateTimer();
		} // countDown - E
		// Pageinit - S wfrmPage 에서 호출
		, pageinit: function (opt) {
			var _me = this, _opt = $.extend({}, opt);

			$dwp.core.lang.setLang();
			moment.locale($dwp.core.lang.getLang());

			//isbridge 옵션 추가 - 2020.09.02 by dwlee
			_me.content({ link: _opt.url, linktype: "PAGE", isbridge: true })
		}
		// Portal Init 처리
		, init: function (opt) {
			var _me = this,
				_opt = $.extend({}, opt);

			// Site 접속체크 사용자 회사사이트인지
			var _host = window.location.hostname.toLowerCase()
				, _cominfos = $fn.getSysinfo().cominfo;

			//if (_cominfos.hasOwnProperty($fn.getCurUser().pinfo.comcode) && $fn.getCurUser().usemode == "1") {
			/*
		if (_cominfos.hasOwnProperty($fn.getCurUser().pinfo.comcode) && $fn.getCurUser().usemode == "1" && _host != "local.") {
			var _cominfo = _cominfos[$fn.getCurUser().pinfo.comcode];
			if (_host != _cominfo.host && $dwp.core.getCurUser().role != "admin") {
				$fn.xAjax({
					url: '/names.nsf?logout'
					, dataType: "html"
					, async: false
					, cache: false
				}).done(function () {
					location.href = window.location.protocol + "//" + _cominfo.host + (location.port != "" ? ":" + location.port : "");
					return;
				});
			}
		}
		*/
			// Ajax Setting
			$.ajaxSetup({
				dataFilter: function (response, type) {
					if (type == 'undefined' || type == 'html') {
						if (response.indexOf("==TCCLOGIN==") > -1) {
							//로그아웃된 경우(3번)는 아래 타고 권한이 없는 경우(0번)는 분기 처리 by noh
							var reason = $dwp.core.util.getMidStr(response, "<!-- ==TCCLOGIN==", "== 로그인페이지 체크용 주석(삭제하지마세요)-->");
							if (reason == "0" || reason == "3") {
								$fn.alert({ msg: $fn.getCodeMsg("세션이 종료되었습니다<br>재로그인 해주십시요!") })
									.done(function () {
										document.location.reload();
										return "";
									});
							} else {
								return response;
							}
						} else {
							return response;
						}
					} else {
						return response;
					}
				}
			});

			$dwp.core.lang.setLang();

			var _lang = $dwp.core.lang.getLang() == "in" ? "id" : $dwp.core.lang.getLang() == "zh" ? "zh-cn" : $dwp.core.lang.getLang();
			moment.locale(_lang);
			$.datepicker.setDefaults($.datepicker.regional[_lang]);

			function _init() {
				window.onpopstate = function (event) {
					//console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
					if (event.state == null) return;
					var _opt = $.extend({ ishistory: true }, event.state);
					_$$.history.gopage(_opt);
				};

				var _isLogin = $.cookie('DWP_ISLOGIN');

				// Tab사용인 경우
				var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;
				if (_envinfo.hasOwnProperty("usetab") && _envinfo.usetab == "1") {
					$("div.dwp-nav a.dwp-trigger").addClass("xtab");
				}

				// 사용자이름설정
				$("div.xware-header span.xware-name").text($fn.getCurLangMsg($fn.getCurUser().pinfo.name));
				//$("span[name=_portlet_setting]").text($fn.getCodeMsg("portal.title.portlet_setting"));

				_me.gnb();

				// GID가 있는 경우 바로 해당 메뉴로 이동함.
				if (_opt.hasOwnProperty("gid") && _opt.gid != "") {
					_me.goMenu(_opt);
				}

				//
				_me.layout();

				if ($dwp.core.getCurUser().usemode == '1') {

					// 메인 Visual 초기화 처리
					var _$visualst = $('.dwp-main-visual');
					var _notkeymsg = $dwp.core.getSysinfo().notkeymsg;
					if (_notkeymsg.indexOf($fn.getComCode()) > -1 || _envinfo.hasOwnProperty("usekeymsg") && _envinfo.usekeymsg == "1") {
						if (_$visualst.size() > 0) {
							_$visualst.addClass("dwp-none");
						}
					} else {
						if (_$visualst.size() > 0) {
							_$visualst.removeClass("dwp-none");
							console.log("키메시지 Visual Initialize...");
							_me.visualInit(
								function () {
									//_me.bannerInit();
									///*
									setTimeout(function () {
										if (!$('.main-visual-toggler').hasClass('active')) {
											_me._convertVisual(false);
										}
									}, 1000);
									//*/
								}
							);
						}
					}

					// 메인베너 초기화 처리
					//_me.bannerInit();

					// 포틀릿 초기화 처리
					_me.portletInit();
				}

				// 팝업공지
				setTimeout(function () {
					_me.popupInit();
				}, 3000);

				// 팝업
				setTimeout(function () {
					_me.popupAdmin();
				}, 5000);

				// History Add
				if (_isLogin == "true") {
					_$$.history.addHistory({ linktype: "LOGIN" });
				} else {
					_$$.history.addHistory({ linktype: "HOME" });
				}

				$.cookie('DWP_ISLOGIN', null, { expires: -1, path: '/' });

				_me.countDown();
			};

			function _pwdChange() {
				$dwp.ui.dialog.init(null, {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					//,draggable: true
					//,resizable: true
					, width: 1130
					, height: 600
					, modal: true
					, title: $fn.getCodeMsg("비밀번호 변경")
					, content: { url: $fn.getProxyUrl($fn.getPath("main") + "/wFrmPw?OpenForm&isportal=1"), html: "", data: {} }
					, initcallback: function (_$dialog) {
						var _$par = _$dialog.element.parent().children("div.ui-dialog-titlebar");
						$("button.ui-dialog-titlebar-close", _$par).remove();
					}
					, usercallback: function (_$dialog) {
						$("div.xware-main-container").removeClass("dwp-none");
						_init.call(_me);
						_$dialog.close();
					}
				});
			}

			//PassWord Check
			var _pwExpireChk = $dwp.core.getCurUser().pwExpireChk;
			if (_pwExpireChk == "true") {
				_pwdChange();
			} else {
				$("div.xware-main-container").removeClass("dwp-none");
				_init();
			}

		} // init - E

		// GNB 처리
		, gnb: function (opt) {
			var _me = this
				, _gnblist = []
				, _$ul = $("<ul></ul>").appendTo($("div.xware-header-menu-wrap .gnb-menu"))
				, _$sul = $("<ul></ul>").appendTo($("div.xware-header-submenu-wrap .gnb-submenu"));

			function _jsonGetParmData() {
				var _url = $dwp.core.getPath("menu") + "/api/data/collections/name/wvgnb_n?count=999";
				return {
					url: _url
					, dataType: "json"
					, async: false
					, cache: false
				};
			}

			$dwp.core.util.xAjax(_jsonGetParmData())
				.done(function (jdata) {
					$(jdata).each(function (i, data) {
						var _row = {};
						_row.key = data._mid;
						_row.title = $fn.getCurLangMsg(data._title);
						_row.pkey = data._pid;
						_row.unid = data["@unid"];
						_row.gid = _row.key;
						_row.subportal = data._subportal;
						_row.linktype = data._linktype;
						_row.link = data._link;
						_row.top = data._top;

						// 2019-10-01 By LHJ ADD Site 권한체크
						if (!_$$.portal.siteComAuthCheck(data)) { return true; }

						if (_row.pkey == "") {
							_gnblist.push(_row);
						} else {
							$dwp.ui.tree.addchild(_row.pkey, _gnblist, _row);
						}
					});
					var _width = 100 / _gnblist.length + "%";
					$.each(_gnblist, function (i, o) {
						//var _$li = $("<li style='width:" + _width + "'></li>").appendTo(_$ul)
						var _$li = $("<li></li>").appendTo(_$ul)
							, _$sli = $("<li></li>").appendTo(_$sul)
							, _$title = $("<a style='height:40px;'>" + $dwp.core.lang.getCurMsg(o.title) + "</a>").appendTo(_$li);

						if (o.hasOwnProperty("link") && o.link != "") {
							_$title.off("click").on("click", function () {
								if (o.subportal == "1") {
									_me._convertDisp('S');
									_me.subPortalInit(o);
								} else {
									if (o.linktype == "PAGE") {
										_me._convertDisp('M');
									}
									_me.subInit({ gid: o.gid });
								}
							});
						}
						if (o.hasOwnProperty("children")) {
							_me._subgnb(_$sli, o.children);
						}
					});

					var _timer = null;
					$("li", _$ul).off("mouseover").on("mouseover", function () {
						_timer = setTimeout(function () {
							$("div.xware-header-submenu-wrap").addClass("active");
						}, 500);
					}).on("mouseleave", function () {
						if (_timer != null) { clearTimeout(_timer); }
					});
					$("div.xware-header-submenu-wrap").off("mouseleave").on("mouseleave", function () {
						$("div.xware-header-submenu-wrap").removeClass("active");
					});

				})
				.fail(function () { });
		} // gnb - E

		, _subgnb: function (_$li, data) {
			var _me = this, _$ul = $("<ul></ul>").appendTo(_$li);

			$.each(data, function (i, o) {
				var _$li = $("<li></li>").appendTo(_$ul)
					, _$title = $("<a>" + $dwp.core.lang.getCurMsg(o.title) + "</a>").appendTo(_$li);

				_$title.off("click").on("click", function () {
					//console.log(o);
					if (o.subportal == "1") {
						_me._convertDisp('S');
						_me.subPortalInit(o);
					} else {
						if (o.linktype == "PAGE") {
							_me._convertDisp('M');
						}
						_me.subInit({ gid: o.gid });
					}
				});
			});
		} // _subgnb - E

		, layout: function () {
			var _me = this;

			_me._gnbIconInit();

			_me._toolbarInit();

			_me._sideAppInit();

			_me._rssFeedInit();

			_me._eventInit();

		} // layout - E

		, _convertVisual: function (isopen) {
			var _me = this
				, _isopen = (typeof isoopen == "undefined" ? true : isopen)
				, _$toggler = $(".main-visual-toggler")
				, _$visual = $('.dwp-main-visual')

			if (isopen) {
				_$toggler.removeClass("active");
				_$visual.removeClass('fold');
			} else {
				_$toggler.addClass("active");
				_$visual.addClass('fold');
			}
		}

		, _rssFeedInit: function () {
			var _me = this
				, _$xfooter = $("div.xware-footer")
				, _$rssfeed = $("div.rssfeed", _$xfooter)
				, _$trigger = $("div.xware-side div.footer-toggle");

			$dwp.core.util.xAjax({
				url: "/dwp/com/sys/rssfeed.nsf/GetRssFeed?openagent"
				, dataType: "xml"
				, async: true
				, cache: false
				, data: { category: "GoogleNews" }
			}).done(function (xml) {
				var xmlData = $(xml).find("item");
				console.log("xmlData", xmlData);
				if (xmlData.length > 0) {
					_$rssfeed = $("div.xware-footer div.rssfeed");
					$(xmlData).each(function () {
						var _title = $(this).find("title").text();
						var _link = $(this).find("link").text();
						var _$item = $("<span style='cursor:pointer; margin-right:50px;'></span>").appendTo(_$rssfeed);
						//_$item.attr("href", _link);
						_$item.html(_title);
						_$item.off("click").on("click", function () {
							window.open(_link, "rssfeed");
						});
					});

					var _$mq = _$rssfeed.marquee({
						duration: 20000,
						gap: 50,
						delayBeforeStart: 0,
						direction: 'left',
						duplicated: false
					});
					_$rssfeed.on("mouseover", function () {
						_$mq.marquee('pause');
					});

					_$rssfeed.on("mouseout", function () {
						_$mq.marquee('resume');
					});
				}
			});

			_$trigger.off("click").on("click", function () {
				_$xfooter.toggleClass("dwp-none");
				$(this).toggleClass('active');
			});
		}
		, portletInit: function () {
			var _me = this
				, _$portlet = $("div.xware-portal-body")
				, _curuser = $dwp.core.getCurUser()
				, _mode = "C";

			// 2019-09-17 by LHJ  - S 초기 설정된 포탈 표시하기
			if (_curuser.pinfo.envinfo.hasOwnProperty("portaltype")) {
				_mode = _curuser.pinfo.envinfo.portaltype;
			}
			// 2019-09-17 by LHJ  - E
			_$portlet.disableSelection();

			//_me._appBannerInit();

			_me._portlet(_mode);
			/*
			if (_mode == "P") {
				_me._personPortlet(false);
			} else {
				_me._comPortlet();
			}
			*/
			/*
			_$portlet.mCustomScrollbar({
				theme: 'dark-3',
				scrollbarPosition: "outside"
			});
			//$dwp.ui.nscroll.create(_$portlet);
			*/
		} // portletInit - E

		, _portlet: function (mode) {
			var _me = this
				, _mode = (typeof mode == "undefined" ? "C" : mode)
				, _isedit = false
				, _defereds = []
				, _$tabs = $('div.xware-portal-header div.portal-tab')
				, _$portlet = $("div.xware-portal-body")
				, _$grid = null;

			$("li", _$tabs).removeClass('active');
			$("li[data-mode=" + mode + "]", _$tabs).addClass('active');

			_$portlet.empty();

			_$grid = $("div.grid-stack", _$portlet);
			if (_$grid.size() == 0) {
				_$grid = $("<div class='grid-stack' style='min-height:120px;'></div>").appendTo(_$portlet);
			}
			var _column = ($fn.getSysinfo().portalcolumns == "" ? 3 : $fn.getSysinfo().portalcolumns);
			var _grid = GridStack.init({
				column: _column
				//,cellHeight : 36
				, cellHeight: 20
				//,verticalMargin : 10
				, disableDrag: true
				, disableResize: true
				, staticGrid: true
			}, _$grid.get(0));

			if (_mode == "C") {
				var _sysinfo = $dwp.core.getSysinfo();
				if (_sysinfo.hasOwnProperty("portalcontent") && _sysinfo.portalcontent == "1") {
					_defereds.push(
						$dwp.core.util.xAjax({
							url: "/dwp/com/portal/appmng.nsf/api/data/collections/name/wvlayoutlist_site?count=1"
							, dataType: "json"
							, async: true
							, cache: false
							, data: { category: window.location.hostname.toLowerCase() }
						})
					);
				} else {
					_defereds.push(
						$dwp.core.util.xAjax({
							url: "/dwp/com/portal/appmng.nsf/api/data/collections/name/wvlayoutlist_com?count=1"
							, dataType: "json"
							, async: true
							, cache: false
							//회사코드정보 변경 - 2019-04-04 By LHJ
							//,data : {category : $fn.getCurUser().pinfo.comcode}
							, data: { category: $fn.getComCode() }
						})
					);
				}
				_defereds.push(
					$dwp.core.util.xAjax({
						url: "/dwp/com/portal/appmng.nsf/api/data/collections/name/wvapplist?count=999"
						, dataType: "json"
						, async: true
						, cache: false
					})
				);
				_defereds.push(
					$dwp.core.util.xAjax({
						url: "/dwp/com/portal/appmng.nsf/api/data/collections/name/wvusrapplist?count=999&category=" + $fn.getCurUser().pinfo.empno
						, dataType: "json"
						, async: true
						, cache: false
					})
				);
			} else {
				_defereds.push(
					$dwp.core.util.xAjax({
						url: "/dwp/com/portal/appmng.nsf/api/data/collections/name/wvlayoutlist_person?count=1"
						, dataType: "json"
						, async: true
						, cache: false
						, data: { category: $fn.getCurUser().pinfo.empno }
					})
				);
				_defereds.push(
					$dwp.core.util.xAjax({
						url: "/dwp/com/portal/appmng.nsf/api/data/collections/name/wvapplist?count=999"
						, dataType: "json"
						, async: true
						, cache: false
					})
				);
				_defereds.push(
					$dwp.core.util.xAjax({
						url: "/dwp/com/portal/appmng.nsf/api/data/collections/name/wvusrapplist?count=999&category=" + $fn.getCurUser().pinfo.empno
						, dataType: "json"
						, async: true
						, cache: false
					})
				);
			}

			$.when.apply($, _defereds).done(function (xhr1, xhr2, xhr3) {
				// 2019-10-01 By LHJ ADD Portlet Infos Setting
				if (xhr1[0].length == 0) {
					$dwp.core.util.xAjax({
						url: "/dwp/com/portal/appmng.nsf/api/data/collections/name/wvlayoutlist_default?count=1"
						, dataType: "json"
						, async: true
						, cache: false
						, data: { category: (_mode == "C" ? "0" : "2") }
					}).done(function (json) {
						_proc(json);
					});
				} else {
					_proc(xhr1[0]);
				}
				function _proc(jdata) {

					_me.setPortletInfos(xhr2[0], xhr3[0]);

					$(jdata).each(function (i, data) {
						var _items = [];
						if (data._layout != "") {
							_items = JSON.parse(data._layout);
						}
						$.each(_items, function (i, node) {
							var _portlet = $dwp.ui.portlet.init(null, {
								id: node.id
								, grid: _grid
								, mode: _mode
								, isedit: _isedit
								, layoutinfo: node
								, appinfos: _me.getPortletInfos()
							});

							var _$el = _portlet.element;
							//var _$el = _me._drawPortlet({mode : _mode, grid : _grid, node : node, apps : xhr2[0], isedit : _isedit});
							_$el.data('_portlet_node', node);

							//_grid.addWidget(_$el, node.x, node.y, node.width, node.height);
							node.w = (typeof node.w != "undefined" ? node.w : node.width);
							node.h = (typeof node.h != "undefined" ? node.h : node.height);
							_grid.addWidget(_$el.get(0), node);
							/*
							var _node = _$el.data('_gridstack_node');
							_node.id = node.id;
							_node.title = node.title;
							_node.noResize = true;
							if (typeof node.udata != "undefined") { _node.udata = node.udata; }

							_$el.data('_gridstack_node', _node);
							*/
							//_grid.movable(_$el, false);
							//_grid.locked(_$el, true);
						});
					});
				}
			});
		} // _portlet - E

		, _gnbIconInit: function () {
			var _me = this;

			//로고 클릭
			if ($dwp.core.getCurUser().usemode == '1') {
				$(".xware-header-logo").off("click").on("click", function () {
					var _self = this;

					function _doit() {
						_me._convertDisp();
						// 2019-09-17 by LHJ  - S 초기 설정된 포탈 표시하기
						var _mode = "C";
						var _curuser = $dwp.core.getCurUser();
						if (_curuser.pinfo.envinfo.hasOwnProperty("portaltype") && _curuser.pinfo.envinfo.portaltype == "P") {
							_mode = "P";
						}
						_me._portlet(_mode);
						// 2019-09-17 by LHJ  - E

						_$$.history.addHistory({ linktype: "HOME" });
					}
					if (_me.isDocEdit({ type: "" })) {
						$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg062") })
							.done(function () { _doit(); });
					} else {
						_doit();
					}
				});
			}

			// 좌측 Toolbar 처리
			$("div.xware-header-menu .gnb-icon").off("click").on("click", function () {
				//$("div.xware-toolbar").toggleClass("hide");
				$("div.xware-header-submenu-wrap").toggleClass("active");
			});

			/* LNB 열기, 닫기 버튼 클릭 */
			$(".dwp-trigger").on("click", function (e) {
				var $nav = $(this).parent();
				$nav.toggleClass("hide");

				e.preventDefault();
			});
			/* Side 열기, 닫기 버튼 클릭 */
			$(".xware-trigger").on("click", function (e) {
				var $side = $(this).parent();
				$side.toggleClass("hide");

				e.preventDefault();
			});

			// Gnb Icon Count 표시
			$dwp.core.util.xOn($("div.xware-header-icon"), "GnbCountRefresh", function (event, opt) {
				console.log("Trigger GnbCountRefresh", opt);
				if (opt.type == "mail") {
					var _unreadUrl = $fn.getPath("mail") + '/api/data/collections/name/($inbox_unread_portal)';
					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl(_unreadUrl)
						, dataType: "json"
						, async: true
						, cache: false
						, data: { ps: 1, page: 0 }
					}).done(function (data, textStatus, jqXHR) {
						var _totalcnt = $dwp.core.util.getDataRange(jqXHR);
						$('div.xware-header-icon>.mail').attr("data-count", _totalcnt);
					});
				} else if (opt.type == "aprv") {
					var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;
					var _url = '/dwp/aprv/com/link/aprvilink.nsf/api/data/collections/name/' + (_envinfo.aprvlist == "1" ? 'wviwlist04' : 'wviwlist07');
					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl(_url)
						, dataType: "json"
						, async: true
						, cache: false
						//, data: { ps: 99, page: 0, category: $fn.getComCode() + "^" + $fn.getCurUser().pinfo.empno }
						, data: { ps: 99, page: 0, category: $fn.getCurUser().pinfo.empno }
					}).done(function (data, textStatus, jqXHR) {
						var _totalcnt = data.length;
						$('div.xware-header-icon>.aprv').attr("data-count", _totalcnt);
					});
				} else if (opt.type == "alarm") {
					var _url = $fn.getPath('myfeed') + '/api/data/collections/name/myfeed_cate';
					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl(_url)
						, dataType: "json"
						, async: true
						, cache: false
						, data: { ps: 99, page: 0, category: $fn.getCurUser().pinfo.empno + "^all^all" }
					}).done(function (data, textStatus, jqXHR) {
						var _totalcnt = data.length;
						$('div.xware-header-icon>.alarm').attr("data-count", _totalcnt);
					});
				}
			});

			$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "mail" });
			$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "aprv" });
			$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "alarm" });

			// User Profile
			$('.xware-header-profile').off('click').on('click', function (e) {
				var _self = this;
				e.stopPropagation();

				var _url = $fn.getPath("org") + "/getPersonDetail?openagent"
				$.when(
					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl(_url)
						, dataType: "json"
						, async: true
						, cache: false
						, data: {}
					})
					, $dwp.core.util.xAjax({ url: $dwp.core.util.getProxyUrl($fn.getProxyUrl($fn.getPath('weblib') + "/jtl/app/portal/user-profile.jtl")), async: true, cache: true })
				).done(function (xhr1, xhr2) {
					var _json = {};
					_json = xhr1[0];

					_json._weblib = $fn.getPath("weblib");
					_json._pic = $fn.getPath('pic', { empno: _json.PERSONID });
					//_json._fullorgname = "ko:" + _json.FullOrgName.join("/") + ",en:" + _json.FullOrgName_E.join("/") + ( (_json.useLang != "ko" && _json.useLang != "en") ? "," + _json.useLang + ":" + _json.FullOrgName_D.join("/") : "");
					//console.log("_json", _json);

					_json._cname = $dwp.core.lang.getLang() == "ko" ? _json.PERSONNAME : $dwp.core.lang.getLang() == "en" ? _json.PERSONNAME_E : $dwp.core.lang.getLang() == "zh" ? _json.PERSONNAME_C : PERSONNAME;
					_json._fullorgname = "ko:" + ($.isArray(_json.FullOrgName) ? _json.FullOrgName.join("/") : _json.FullOrgName);
					_json._fullorgname += ",en:" + ($.isArray(_json.FullOrgName_E) ? _json.FullOrgName_E.join("/") : _json.FullOrgName_E);
					_json._fullorgname += ",zh:" + ($.isArray(_json.FullOrgName_C) ? _json.FullOrgName_C.join("/") : _json.FullOrgName_C);
					_json._fullorgname += ((_json.useLang != "ko" && _json.useLang != "en" && _json.useLang != "zh") ? "," + _json.useLang + ":" + ($.isArray(_json.FullOrgName_D) ? _json.FullOrgName_D.join("/") : _json.FullOrgName_D) : "");

					_json._pos = "ko:" + _json.Name1 + ",en:" + _json.Name1_E + (_json.Name1_C != undefined && _json.Name1_C != "" ? ",zh:" + _json.Name1_C : "") + ((_json.useLang != "ko" && _json.useLang != "en" && _json.useLang != "zh") ? "," + _json.useLang + ":" + _json.Name1_D : "");
					_json._job = "ko:" + _json.Name2 + ",en:" + _json.Name2_E + (_json.Name2_C != undefined && _json.Name2_C != "" ? ",zh:" + _json.Name2_C : "") + ((_json.useLang != "ko" && _json.useLang != "en" && _json.useLang != "zh") ? "," + _json.useLang + ":" + _json.Name2_D : "");

					var _html = $dwp.core.jsonToHtml.convert(_json, xhr2[0]);

					$dwp.ui.qtdialog.init(null, {
						position: { at: "right bottom", my: "right top", of: $(_self) }
						, show: { effect: "fade", duration: 300 }
						, hide: { effect: "fade", duration: 300 }
						, dialogClass: 'no-overflow' // orange-head 삭제
						, draggable: false
						, resizable: false
						, width: 550
						, title: ""
						, content: { html: _html, data: {} }
						, initcallback: function (_$dialog) {
							$(_self).data("_did", _$dialog.options.id);

							$fn.getPicError($("div.photo img", _$dialog.element));

							$('.btn-logout .bookmark', _$dialog.element).off('click').on('click', function () {
								_$dialog.close();
								_$$.portal.goMenu({ gid: "L0001" });
							});
							$('.btn-logout .logout', _$dialog.element).off('click').on('click', function () {
								_$dialog.close();
								//location.href = '/names.nsf?logout';
								_me.logOut();
							});

							$('.dwp-profile-dialog .photo', _$dialog.element).off('click').on('click', function () {
								$fn.selectPic({
									callback: function () {
										$('.dwp-profile-dialog .head-area .photo img', _$dialog.element).attr('src', $dwp.core.getPath("pic"));
										$('.dwp-profile img.dwp-photo').attr('src', $dwp.core.getPath("pic"));
									}
								});
							});

							$(".body-area .scroll-area", _$dialog.element).mCustomScrollbar({
								theme: 'dark-3'
							});
						}
						, close: function (event, ui) {
							$(_self).removeData("_did");
						}
					});
				});
			});

			// 메일
			$('.xware-header-icon>div.mail').off('click').on('click', function (e) {
				var _self = this;
				e.stopPropagation();

				var _maxCount = 30;

				_me._gnbIconMenu.init({
					target: _self
					, type: "mail"
					, url: $fn.getPath("mail") + '/api/data/collections/name/($inbox_unread_portal)'
					, jtl: $fn.getPath('weblib') + "/jtl/app/portal/unread-mail.jtl"
					, param: { ps: _maxCount, page: 0 }
					, convert: $dwp.ui.portlet.mail.convert
					, title: $fn.getCodeMsg("portal.title.newmail")
					, width: 480
					, nodata: $fn.getCodeMsg("portal.msg.mail_nodata")
				});
			});
			// 결재
			$('.xware-header-icon>div.aprv').off('click').on('click', function (e) {
				var _self = this;
				e.stopPropagation();

				var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;
				_me._gnbIconMenu.init({
					target: _self
					, type: "aprv"
					, url: '/dwp/aprv/com/link/aprvilink.nsf/api/data/collections/name/' + (_envinfo.aprvlist == "1" ? 'wviwlist04' : 'wviwlist07')
					, jtl: $fn.getPath('weblib') + "/jtl/app/portal/gnb-aprv.jtl"
					//, param: { ps: 99, page: 0, category: $fn.getComCode() + "^" + $fn.getCurUser().pinfo.empno }
					, param: { ps: 99, page: 0, category: $fn.getCurUser().pinfo.empno }
					//,convert : $dwp.ui.portlet.mail.convert
					, title: $fn.getCodeMsg((_envinfo.aprvlist == "1" ? "portal.title.aprvwait" : "portal.title.aprvunconfrm"))
					, width: 480
					, nodata: $fn.getCodeMsg("portal.msg.aprv_nodata")
				});
			});
			// 알림
			$('.xware-header-icon>div.alarm').off('click').on('click', function (e) {
				var _self = this;
				e.stopPropagation();

				_me._gnbIconMenu.init({
					target: _self
					, type: "alarm"
					, url: $fn.getPath('myfeed') + '/api/data/collections/name/myfeed_cate'
					, jtl: $fn.getPath('weblib') + "/jtl/app/portal/gnb-alarm.jtl"
					//, param: { start: 0, count: 10, category: $fn.getCurUser().pinfo.empno + "^all^all" }
					, param: { page: 0, ps: 15, category: $fn.getCurUser().pinfo.empno + "^all^all" }
					, title: $fn.getCodeMsg("portal.title.alarm")
					, width: 480
					, maxCount: 15
					, nodata: $fn.getCodeMsg("portal.msg.alarm_nodata")
				});
			});

			// Search
			var _$srcharea = $("div.xware-search-area")
				, _$srchselect = $("div.srch-input .srch-select", _$srcharea)
				, _$srchinput = $("div.srch-input .dwp-input input", _$srcharea);

			function _orgSearch(_opt) {
				// 사용자검색
				$LAB
					.script($fn.getPath('weblib') + "/lang/" + $dwp.core.lang.getLang() + "/semp01.lang.js")
					.script($fn.getPath('weblib') + "/js/app/app.semp01.js")
					.wait(function () {
						if (_opt.srchval != "") {
							_opt.srchval = $fn.getCurLangMsg(_opt.srchval);
						}
						$dwp.app.semp01.setorglayer(_opt);
					});
			}
			// 검색대상 변경
			_$srchselect.off("click").on("click", function () {
				if ($(this).is("[org]")) {
					$(this).removeAttr("org");
					$(this).html($fn.getCodeMsg("portal.title.search"));
				} else {
					$(this).attr("org", "");
					$(this).html($fn.getCodeMsg("portal.title.employee"));
				}
			});
			// 검색 자동완성 설정
			function _autocomplete() {
				var _opt = {
					autoFocus: true
					, minLength: 2
					, position: { my: "left top", at: "left bottom", collision: "flipfit" }
					, source: function (request, response) {
						var _data = {};
						var _response = [];

						if (_$srchselect.is("[org]")) {
							_data = { q: request.term.replace(/\)/g, "\\)").replace(/\(/g, "\\("), cc: '', type: 'p,d' };
							$.getJSON("/dwprts/quicksearch", _data, function (data) {
								$.each(data.response.org, function (i, o) {
									// 해당사이트인지 체크
									o.type = "B";
									var _item = $dwp.ui.org.data.qsConvert(o)
										, _org = new $dwp.ui.org.data.org(_item);
									_response.push({ label: _org.getFDispName(), value: _item })
								});
								$.each(data.response.person, function (i, o) {
									o.type = "S";
									var _item = $dwp.ui.org.data.qsConvert(o)
										, _org = new $dwp.ui.org.data.org(_item);

									_response.push({ label: _org.getFDispName(), value: _item })
								});
								response(_response);
							})
						} else {
							_data = { keyword: request.term.replace(/\)/g, "\\)"), listSize: 10 };
							_response = [];
							$.getJSON("/itrinity/restful/keyword/auto", _data, function (data) {
								$.each(data.result, function (i, v) {
									_response.push({ label: v, value: v })
								});
								response(_response);
							});
							/*
							_data = { target: "complete", term: request.term.replace(/\)/g, "\\)"), max_count: 10 };
							$.getJSON("/konan/suggest", _data, function (data) {
								$.each(data.suggestions, function (i, v) {
									if (v.length > 0) {
										$.each(v, function (j, _v) {
											if (_v.length > 0) {
												_response.push({ label: _v[0], value: _v[0] });
											}
										})
									}
								});
								response(_response);
							});
							*/
						}
					}
					, response: function (event, ui) {
						//console.log(ui.content);
					}
					, focus: function (event, ui) {
						return false;
					}
					, open: function (event, ui) {
						//_$srchinput.blur();
					}
					, select: function (event, ui) {
						var _item = null;
						_item = ui.item.value;
						_$srchinput.val("");
						//_$srchinput.xval(_item);

						if (_$srchselect.is("[org]")) {
							_orgSearch({ srchval: (_item.type == "S" ? _item.username : _item.orgname) });
						} else {
							$dwp.core.util.setLocalStorage("DWP_SEARCH", _item);
							_me.goMenu({ gid: "L0017" });
						}

						return false;
					}
				};

				$dwp.ui.autocomplete.init(_$srchinput, _opt)
					._renderItem = function (ul, item) {
						ul.width($("div.xware-search-wrap").width());
						return $("<li>")
							.append($("<div style='font-size:12px;font-weight:600;'>").html(item.label))
							.appendTo(ul);
					};
			}

			// Search처리
			if (_$srchinput.size() > 0) {
				/*
				_$srchinput.focus(function () {
					$("div.xware-search-area div.dwp-btn span").addClass("xware-show-search");
				});
				_$srchinput.blur(function () {
					$("div.xware-search-area div.dwp-btn span").removeClass("xware-show-search");
				});
				*/
				$("div.xware-search-area div.dwp-btn").off("click").on("click", function (e) {
					e.preventDefault();

					if (_$srchinput.val() == "" && !_$srchselect.is("[org]")) {
						$fn.toast({ msg: $fn.getCodeMsg('portal.msg.search'), timeout: 3000 });
						//return;
					}

					if (_$srchselect.is("[org]")) {
						_orgSearch({ srchval: _$srchinput.val() });
					} else {
						$dwp.core.util.setLocalStorage("DWP_SEARCH", _$srchinput.val());
						_me.goMenu({ gid: "L0017" });
					}
					_$srchinput.val("");


				});
				_$srchinput.on("keydown", function (event) {
					if (event.keyCode === $.ui.keyCode.ENTER) {
						//event.stopPropagation();
						if ($(this).xautocomplete("instance").menu.active) {
							return;
						}
						event.preventDefault();
						if ($(this).val() == "" && !_$srchselect.is("[org]")) {
							//$fn.alert({msg : $fn.getCodeMsg('검색어를 입력해 주십시요!')});
							$fn.toast({ msg: $fn.getCodeMsg('portal.msg.search'), timeout: 3000 });
							//return;
						}

						if (_$srchselect.is("[org]")) {
							_orgSearch({ srchval: _$srchinput.val() });
						} else {
							$dwp.core.util.setLocalStorage("DWP_SEARCH", _$srchinput.val());
							_me.goMenu({ gid: "L0017" });
						}
						$(this).val("");
					}
				});

				_autocomplete();
			}
			//로그아웃처리
			$('.xware-header-icon>div.logout').off('click').on('click', function () {
				//location.href = '/names.nsf?logout';
				_me.logOut();
			});

			// 환경설정
			$('.xware-header-icon>div.setting').off('click').on('click', function (e) {
				var _self = this;
				e.stopPropagation();

				var _usermode = $fn.getCurUser().usemode;
				var _html = '<div class="dwp-gnb-setting-dialog">';
				_html += '<div class="dwp-tabs-simple">';
				if (_usermode == '1') {
					_html += '<ul>';
					_html += '<li gubun="setting"><a href="#dwp-tabs-setting-content">' + $fn.getCodeMsg("portal.title.default") + '</a></li>';
					_html += '<li gubun="mail"><a href="#dwp-tabs-mail-content">' + $fn.getCodeMsg("portal.title.mail") + '</a></li>';
					_html += '<li gubun="approval"><a href="#dwp-tabs-approval-content">' + $fn.getCodeMsg("portal.title.aprv") + '</a></li>';
					_html += '<li gubun="pw"><a href="#dwp-tabs-pw-content">' + $fn.getCodeMsg("portal.title.password") + '</a></li>';
					_html += '<li gubun="outofoffice"><a href="#dwp-tabs-outofoffice-content">' + $fn.getCodeMsg("portal.title.absence") + '</a></li>';
					_html += '</ul>';
					_html += '<div class="dwp-tabs-setting-content" id="dwp-tabs-setting-content"></div>';
					_html += '<div class="dwp-tabs-mail-content" id="dwp-tabs-mail-content"></div>';
					_html += '<div class="dwp-tabs-approval-content" id="dwp-tabs-approval-content"></div>';
					_html += '<div class="dwp-tabs-pw-content" id="dwp-tabs-pw-content"></div>';
					_html += '<div class="dwp-tabs-outofoffice-content" id="dwp-tabs-outofoffice-content"></div>';
				} else {
					_html += '<ul>';
					_html += '<li gubun="mail"><a href="#dwp-tabs-mail-content">' + $fn.getCodeMsg("portal.title.mail") + '</a></li>';
					_html += '<li gubun="pw"><a href="#dwp-tabs-pw-content">' + $fn.getCodeMsg("portal.title.password") + '</a></li>';
					_html += '<li gubun="outofoffice"><a href="#dwp-tabs-outofoffice-content">' + $fn.getCodeMsg("portal.title.absence") + '</a></li>';
					_html += '</ul>';
					_html += '<div class="dwp-tabs-mail-content" id="dwp-tabs-mail-content"></div>';
					_html += '<div class="dwp-tabs-pw-content" id="dwp-tabs-pw-content"></div>';
					_html += '<div class="dwp-tabs-outofoffice-content" id="dwp-tabs-outofoffice-content"></div>';
				}
				_html += '</div>';
				_html += '</div>';

				$dwp.ui.dialog.init(null, {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					//,draggable: true
					//,resizable: true
					, width: 1130
					, height: 600
					, modal: true
					, title: $fn.getCodeMsg("portal.title.env")
					, content: { html: _html, data: {} }
					, islangconvert: false
					, initcallback: function (_$dialog) {
						var _$tab = $(".dwp-gnb-setting-dialog .dwp-tabs-simple", _$dialog.element);
						var _tooltip = '<div class="dwp-tooltip">';
						_tooltip += '<a class="tooltip-trigger"><img src="' + $fn.getPath('weblib') + '/images/common/icon-guide.svg" alt=""></a>';
						_tooltip += '<div class="tip-area">';
						_tooltip += '<a class="close-tooltip"><img src="' + $fn.getPath('weblib') + '/images/common/icon-close-w.svg" alt=""></a>';
						_tooltip += '<div class="dwp-table">';
						_tooltip += '<table>';
						_tooltip += '<colgroup><col style="width: 120px"><col style=""></colgroup>';
						_tooltip += '<thead><tr><th>title</th><th>summary</th></tr></thead>';
						_tooltip += '<tbody>';
						//_tooltip += '<tr>';
						//_tooltip += '<td class="left">'+$fn.getCodeMsg('wps.title.portalmode')+'</td>';
						//_tooltip += '<td class="left">'+$fn.getCodeMsg('wps.msg.cfgmode')+'</td>';
						//_tooltip += '</tr>';
						//_tooltip += '<tr>';
						//_tooltip += '<td class="left">'+$fn.getCodeMsg('portal.title.language')+'</td>';
						//_tooltip += '<td class="left">'+$fn.getCodeMsg('portal.msg.cfglang')+'</td>';
						//_tooltip += '</tr>';
						_tooltip += '<tr>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.title.alarm') + '</td>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.msg.cfgalarm') + '</td>';
						_tooltip += '</tr>';
						_tooltip += '<tr>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.title.aprvalarm') + '</td>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.msg.cfgaprv') + '</td>';
						_tooltip += '</tr>';
						_tooltip += '<tr>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.title.thema') + '</td>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.msg.cfgthema') + '</td>';
						_tooltip += '</tr>';
						_tooltip += '<tr>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.title.usetab') + '</td>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.msg.cfgusetab') + '</td>';
						_tooltip += '</tr>';
						_tooltip += '<tr>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.title.usekeymsg') + '</td>';
						_tooltip += '<td class="left">' + $fn.getCodeMsg('portal.msg.cfgusekeymsg') + '</td>';
						_tooltip += '</tr>';
						_tooltip += '</tbody>';
						_tooltip += '</table>';
						_tooltip += '</div>';
						_tooltip += '</div>';
						_tooltip += '</div>';

						_$dialog.element.prev().prepend(_tooltip);

						$('.close-tooltip', _$dialog.element.prev()).off('click').on('click', function () {
							$(this).closest('.dwp-tooltip').toggleClass('active');
						});
						$('.tooltip-trigger', _$dialog.element.prev()).off('click').on('click', function () {
							$(this).parent().toggleClass('active');
						});

						_$tab.tabs({
							active: 0
						});

						if (_usermode == '1') {
							_me._loadSettingConts('dwp-tabs-setting-content', _$dialog);
						} else {
							_me._loadSettingConts('dwp-tabs-mail-content', _$dialog);
						}

						_$tab.find('ul li').each(function () {
							var _self = this;
							$(_self).off().on('click', function () {
								var gubun = "setting";
								gubun = $(_self).attr("gubun");
								_me._loadSettingConts('dwp-tabs-' + gubun + '-content', _$dialog);
							});
						});
					}
					, close: function (event, ui) {

					}
				});
			});

			// 포탈 Tab Event 처리
			$('div.xware-portal-header div.portal-tab li').off('click').on('click', function () {
				var _mode = $(this).data('mode');
				if (_mode == null) { return; }
				if ($(this).hasClass('active')) {

				} else {
					$('div.xware-portal-header div.portal-tab li').removeClass('active');
					$(this).addClass('active');
					_me._portlet(_mode);
				}
			});

			// 포탈 환경설정 처리
			$.contextMenu({
				selector: 'div.portal-setting>img',
				trigger: 'left',
				zIndex: 100,
				position: function (opt, x, y) {
					console.log(opt.$menu);
					opt.$menu.css({ top: y, left: x - opt.$menu.width() });
				},
				callback: function (key, opt) {
					if (key == "basic") {
						// 초기기본 포탈 설정
						var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;
						var _param = {};
						_param.__Click = "0";
						_param.UNID = _envinfo.unid;
						_param.Field_1 = "initPortalType"
						_param.Value_1 = $('div.xware-portal-header div.portal-tab li.active').data("mode");
						$fn.xAjax({
							url: $fn.getProxyUrl('/dwp/com/sys/org_mn.nsf/updateinfo?openform&seq=1'),
							type: "POST",
							dataType: 'json',
							processData: false,
							data: $.param(_param),
							success: function (retData, status, xhr) {
								// 기본포탈 설정
								$fn.toast({ msg: $fn.getCodeMsg("기본포탈이 설정되었습니다.") });
							},
							error: function (xhr, status, e) {
								var message = status + " " + e;
								console.log(message);
								//if(callback != null) callback(message);
							}
						});
					} else if (key == "portlet") {
						// 개인포탈설정
						$dwp.ui.dialog.init(null, {
							show: { effect: "fade", duration: 300 }
							, hide: { effect: "fade", duration: 300 }
							//,draggable: true
							//,resizable: true
							, headerclass: "no-overflow"
							, width: 1130
							, height: 600
							, modal: true
							, title: $fn.getCodeMsg("포틀릿 설정")
							, content: { url: $fn.getProxyUrl("/dwp/com/portal/appmng.nsf/wFrmPHtmlN?ReadForm&type=2"), html: "", data: {} }
							, initcallback: function (_$dialog) {

							}
							, usercallback: function (_$dialog) {
							}
						});
					}
				},
				items: {
					"basic": { name: "기본설정" },
					"portlet": { name: "포틀릿설정" }
				},
				build: function ($triggerElement, e) {
					var _items = {};
					var _mode = $('div.xware-portal-header div.portal-tab li.active').data("mode");
					if (_mode == "C") {
						_items.portlet = { disabled: true };
					}
					return { items: _items };
				}
			})


		} // _gnbIconInit - E
		// _gnbIconMenu - S
		, _gnbIconMenu: {
			init: function (opt) {
				var _me = this, _maxCount = 30
					, _opt = $.extend({
						target: null
						, type: ""
						, url: ""
						, param: {}
						, jtl: ""
						, convert: null
						, title: ""
						, nodata: ""
						, maxCount: 30
						, width: 450
					}, opt);

				_opt.init = true;
				_me.load(_opt);
			}
			, load: function (opt, _$dialog) {
				var _me = this, _opt = $.extend({}, opt);
				$.when(
					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl(_opt.url)
						, dataType: "json"
						, async: true
						, cache: false
						, data: _opt.param
					})
					, $dwp.core.util.xAjax({ url: $dwp.core.util.getProxyUrl(_opt.jtl), async: true, cache: true })
				).done(function (xhr1, xhr2) {
					var _json = {}, _html = "";
					var _totalcnt = ((_opt.type == "mail" || _opt.type == "alarm") ? $dwp.core.util.getDataRange(xhr1) : xhr1[0].length);

					_opt.totalcnt = _totalcnt;

					_json.weblib = $fn.getPath("weblib");

					_json.data = xhr1[0];

					if (_opt.type == "alarm") {
						if (_json.data.length == 0) {
							if (_opt.param.page > 0) { //마지막 페이지에서 마지막 알림 문서를 삭제하면 이전 페이지로 이동하기
								_opt.init = false;
								_opt.param.page = _opt.param.page - 1;
								_me.load(_opt, _$dialog);
								return;
							}
						}
						if (typeof (_$dialog) == "object") {  //분류를 변경하면 카운트도 업데이트 해줘야 함
							_$dialog.options.refdata.totalcnt = _totalcnt;
						}
					}

					if (typeof _opt.confn == "function") {
						_json.data = _opt.convert(_json.data);
					}
					$.each(_json.data, function (i, _item) {
						_item.unid = _item["@unid"];

						_item.isattach = (_item.hasOwnProperty("_attachinfo") && _item._attachinfo != "") ? true : false;
						_item.isstarred = (_item.hasOwnProperty("_isstarred") && _item._isstarred == "1") ? true : false;

						if (_item.hasOwnProperty("_authorempno") && _item._authorempno != "") {
							_item.pic = $dwp.core.getPath("pic", { empno: _item._authorempno });
						}

						if (_opt.type == "alarm") {
							if (_item.hasOwnProperty("_senderInfo") && _item._senderInfo != "") {
								_item.senderinfo = $fn.orgData(_item._senderInfo).oinfo;
								_item.senderinfo.pic = $dwp.core.getPath("pic", { empno: _item.senderinfo.empno });
							}
						}
						_item.rowdata = JSON.stringify(_item);
						//console.log("rowdata", _item.rowdata);
					});

					_html = $dwp.core.jsonToHtml.convert(_json, xhr2[0]);

					if (_opt.init) {
						_me._opendialog(_html, _opt);
					} else {
						_me._initcallback(_$dialog, _html);
					}
				});
			}
			, _opendialog: function (html, opt) {
				var _me = this, _opt = $.extend({}, opt);
				$dwp.ui.qtdialog.init(null, {
					position: { at: "right bottom", my: "right top", of: $(_opt.target) }
					, show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					, dialogClass: 'no-overflow'
					, draggable: false
					, resizable: false
					, width: _opt.width
					, title: _opt.title
					, type: _opt.type
					, refdata: _opt
					, content: { html: "<div></div>", data: {} }
					, initcallback: function (_$dialog) {
						_me._initcallback(_$dialog, html);
					}
				});
			}
			, _initcallback: function (_$dialog, hdata) {
				var _me = this
					, _opt = _$dialog.options.refdata;

				$(".ui-dialog-title", _$dialog.element.prev()).html(_opt.title + "(<div class='num'>" + _opt.totalcnt + "</div>)");

				// reloading
				//if (!_opt.init) {
				_$dialog.element.empty();
				_$dialog.element.html(hdata);
				$dwp.core.lang.convert({ isedit: true }, _$dialog.element);
				//}

				if (_opt.totalcnt == 0) {
					var _html = '<div class="dwp-no-result">';
					_html += '<img src="' + $fn.getPath('weblib') + '/images/common/icon-no-result.svg" alt="">';
					_html += _opt.nodata;
					_html += '</div>';
					$(".gnb-form-area", _$dialog.element).html(_html);
				}

				if (_$dialog.options.type == "alarm") {
					var _pagecnt = Math.ceil(_opt.totalcnt / _opt.maxCount);
					$("#page_select", _$dialog.element).html('');
					for (var pg = 0; pg < _pagecnt; pg++) {
						$("#page_select", _$dialog.element).append("<option value='" + pg + "'>" + (pg + 1) + "</option>");
					}
					// Category Init
					//console.log("opt", _opt);
					var _category = _opt.param.category.split("^");

					if (_category[1] == "all") {
						$('input[name=acts_check]', _$dialog.element).prop("checked", true);
					} else {
						$('input[name=acts_check][value=' + _category[1] + ']', _$dialog.element).prop("checked", true);
					}
					$('select[name=acts_select]', _$dialog.element).xval(_category[2]);
					//$("#page_select", _$dialog.element).xval(_opt.param.start + 1);
					$("#page_select", _$dialog.element).xval((_opt.param.page).toString());

					// Category 변경 시,
					$('input[name=acts_check]', _$dialog.element).off('click').on('click', function () {
						var _checked = "";
						if ($('input[name=acts_check]:checked').length == 2) {
							_checked = "all";
						} else if ($('input[name=acts_check]:checked').length == 1) {
							_checked = $('input[name=acts_check]:checked').val();
						} else {
							return false;
						}

						_opt.init = false;
						_category[1] = _checked;
						_opt.param.category = _category.join("^");
						_opt.param.page = 0;
						_me.load(_opt, _$dialog);
					});
					$('select[name=acts_select]', _$dialog.element).off('change').on('change', function () {
						_category[2] = $(this).xval();
						_opt.init = false;
						_opt.param.category = _category.join("^");
						_opt.param.page = 0;
						_me.load(_opt, _$dialog);
					});
					$("#page_select", _$dialog.element).off('change').on('change', function () {
						_opt.init = false;
						//_opt.param.start = parseInt($(this).xval(), 10) - 1;
						_opt.param.page = parseInt($(this).xval(), 10); // - 1;
						_me.load(_opt, _$dialog);
					});
					//전체삭제
					$('.alldel', _$dialog.element).off('click').on('click', function () {
						$fn.confirm({ msg: $fn.getCodeMsg('portal.msg.alldel') })
							.done(function () {
								$fn.xAjax({
									type: "GET",
									url: $fn.getPath('myfeed') + "/feed_delete_call?openagent",
									cache: false,
									async: false,
									dataType: "json",
									data: { empno: $fn.getCurUser().pinfo.empno, applcode: $('select[name=acts_select]', _$dialog.element).xval() },
									success: function (data, textStatus) {
										$fn.toast({ msg: $fn.getCodeMsg('portal.msg.success') });
										if (data.msgcode == "success") {
											_$dialog.close();
											$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "alarm" });
										}
									},
									error: function (xhr, status, e) {
									}
								});
							});
					});
				}

				//Event 처리하기
				$("[data-unid]", _$dialog.element).each(function (i, _o) {
					var _item = $(this).data();
					// 문서 오픈하기
					$("._link", this).off("click").on("click", function () {
						var _lopts = {
							title: _item.rowdata._subject
							, isportal: true
							, width: ($fn.getScreenInfo().doc_w * 0.8)
							, dialogClass: 'memo-type'
						};
						if (_$dialog.options.type == "mail") {
							_lopts.initcallback = function () {
								$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "mail" });
								var _$mportal = $("div.dwp-main-portal");
								if (_$mportal.size() > 0 && !_$mportal.hasClass("dwp-hidden")) {

									/* 원래소스  -2020.06.26
									var _portlet = $("div.dwp-portlet-zone #P0001", _$mportal).portlet("instance");
									if (_portlet != undefined) { _portlet.reload(); }
									*/


									//포틀릿의 ID에서 리프레쉬 옵션이 있는 놈을 찾아서 처리하도록 변경 - 2020.06.26 by dwlee
									var _$zone = $("div.dwp-portlet-zone", _$mportal);
									var _$portlets = $("div.grid-stack-item", _$zone);
									if (_$portlets.size() > 0) {
										$.each(_$portlets, function (pindex, _grid) {
											var _portlet = $(_grid).portlet("instance");
											var _popt = _portlet.options;
											if (_popt.appinfo._refresh == "1") {	//메일의 읽지않은 포틀릿은 Refresh
												_portlet.reload();
											}
										});
									}
								}
							}
						}
						/*
						$fn.openDocument(_item.rowdata._openurl,{
							title:_item.rowdata._subject
							,isportal:true
							,width:($fn.getScreenInfo().doc_w * 0.8)
							,dialogClass:'memo-type'
						});
						*/
						// host명이 다른 경우 윈도우 창 오픈하기
						if (_$dialog.options.type == "alarm") {
							if (_item.rowdata._linkurl.indexOf(location.hostname) > -1) {
								$fn.openDocument(_item.rowdata._openurl, _lopts);
							} else {
								var _url = _item.rowdata._linkurl.replace("&empno=$1", "&empno=" + $fn.getCurUser().pinfo.empno);
								window.open(_url);
							}
						} else {
							$fn.openDocument(_item.rowdata._openurl, _lopts);
						}
					});
					// 첨부파일 열기
					if (_item.rowdata.hasOwnProperty("_attachinfo") && _item.rowdata._attachinfo != "") {
						var _opts = {
							ismobile: false
							, applcode: ""
							, cdb: ""
							, svrnm: ""
							, title: $dwp.core.lang.getCodeMsg("comm.title.js012")
							, _attachinfo: _item.rowdata._attachinfo
						};
						$(".file", this).off("click").on("click", function () {
							$dwp.ui.filedailog.init($(this), _opts);
						});
					}

					// 사용자 정보 링크
					$fn.getPicError($("div.dwp-user img", this));
					$("div.dwp-user", this).off("click").on("click", function () {
						$dwp.ui.bizcard.init($(this));
					});
					$("span[name=acts_name][data-empno]", this).off("click").on("click", function () {
						$dwp.ui.bizcard.init($(this));
					})

					if (_$dialog.options.type == "mail") {
						$dwp.ui.portlet.mail.eventProc($(this), _item, _$dialog, function () {
							$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: _$dialog.options.type });
						});
					} else if (_$dialog.options.type == "alarm") {
						var _msg = "_msg_" + $dwp.core.lang.getLang();
						if (_item.rowdata.hasOwnProperty(_msg) && _item.rowdata[_msg] != "") {
							$(_item.rowdata[_msg]).insertBefore($(".options-wrap", this));
						}
						$("[name='acts_doclink']", this).off("click").on("click", function () {
							if (_item.rowdata._linkurl.indexOf(location.hostname) > -1) {
								$fn.openDocument(_item.rowdata._openurl, {
									title: _item.rowdata._subject
									, isportal: true
									, width: ($fn.getScreenInfo().doc_w * 0.8)
									, dialogClass: 'memo-type'
									, initcallback: function () {
										$fn.xAjax({
											type: "POST",
											url: _item.rowdata._delurl,
											cache: false,
											async: false,
											dataType: "json",
											success: function (data, textStatus) {
												//_opt.init = false;
												//_me.load(_opt, _$dialog);
												$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: _$dialog.options.type });
											},
											error: function (xhr, status, e) {
											}
										});
									}
								});
							} else {
								var _url = _item.rowdata._linkurl.replace("&empno=$1", "&empno=" + $fn.getCurUser().pinfo.empno);
								window.open(_url);
								_$dialog.close();
								setTimeout(function () {
									$fn.xAjax({
										type: "POST",
										url: _item.rowdata._delurl,
										cache: false,
										async: false,
										dataType: "json",
										success: function (data, textStatus) {
											//_opt.init = false;
											//_me.load(_opt, _$dialog);
											$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: _$dialog.options.type });
										},
										error: function (xhr, status, e) {
										}
									});
								}, 100);
							}
						});

						//버튼 클릭함수 치환 - 회의실예약 참석, 불참, 미정버튼 클릭시  : 액션수행 + alarm 제거 - 2020.06.25 by dwlee
						$(".replacelink", this).each(function (i, _tag) {
							var _acturl = $(_tag).attr("href");
							$(_tag).removeAttr("href");
							$(_tag).on("click", function () {
								var _url = _acturl.replace("&empno=$1", "&empno=" + $fn.getCurUser().pinfo.empno);
								window.open(_url);
								_$dialog.close();

								setTimeout(function () {
									$fn.xAjax({
										type: "POST",
										url: _item.rowdata._delurl,
										cache: false,
										async: false,
										dataType: "json",
										success: function (data, textStatus) {
											//_opt.init = false;
											//_me.load(_opt, _$dialog);
											$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: _$dialog.options.type });
										},
										error: function (xhr, status, e) {
										}
									});
								}, 100);
							});
						});

						var ttl = $("div.dwp-acts-title.dwp-cursor", this);  //대상 페이지가 없는 경우
						if (ttl.is("[name]") == false) {
							if (ttl.hasClass("replacelink") == false) {
								ttl.css("cursor", "default");
								ttl.off("click").on("click", function () { $fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg059") }); });
							}
						}

						$(".trash", this).off("click").on("click", function () {
							$fn.xAjax({
								type: "POST",
								url: _item.rowdata._delurl,
								cache: false,
								async: false,
								dataType: "json",
								success: function (data, textStatus) {
									_opt.init = false;
									_opt.totalcnt = _opt.totalcnt - 1;
									_me.load(_opt, _$dialog);
									$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: _$dialog.options.type });
								},
								error: function (xhr, status, e) {
								}
							});
							/*
											  $fn.confirm({ msg: $fn.getCodeMsg('portal.msg.doc_del') })
												  .done(function () {
													  $fn.xAjax({
														  type: "POST",
														  url: _item.rowdata._delurl,
														  cache: false,
														  async: false,
														  dataType: "json",
														  success: function (data, textStatus) {
															  //_opt.init = false;
															  //_me.load(_opt, _$dialog);
															  $fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: _$dialog.options.type });
														  },
														  error: function (xhr, status, e) {
														  }
													  });
												  })
							*/
						});
					}
				});

				$('.gnb-form-area', _$dialog.element).mCustomScrollbar({
					theme: 'dark-3'
				});

				// 헤더Event 처리
				if (_$dialog.options.type == "mail") {
					$(".ui-dialog-title", _$dialog.element.prev()).css({ "cursor": "pointer" });
					$(".ui-dialog-title", _$dialog.element.prev()).off('click').on('click', function () {
						_$dialog.close();
						_$$.portal.goMenu({ gid: "L0023" });
					});
				}
				if (_$dialog.options.type == "aprv") {
					$(".ui-dialog-title", _$dialog.element.prev()).css({ "cursor": "pointer" });
					$(".ui-dialog-title", _$dialog.element.prev()).off('click').on('click', function () {
						_$dialog.close();
						var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;
						if (_envinfo.aprvlist == "1") {
							_$$.portal.goMenu({ gid: "M0035" });
						} else {
							_$$.portal.goMenu({ gid: "L0003" });
						}
					});
				}

				$('.dwp-gnb-mail-dialog .more', _$dialog.element).off('click').on('click', function () {
					_$dialog.close();
					_$$.portal.goMenu({ gid: "M0003" });
				});

				// 메일쓰기
				$('.dwp-gnb-mail-dialog .write', _$dialog.element).off('click').on('click', function () {
					_$dialog.close();
					//$fn.mailSend();
					$fn.mailSendWin();
				});
				// 더보기
				$('.dwp-gnb-mail-dialog .more', _$dialog.element).off('click').on('click', function () {
					_$dialog.close();
					_$$.portal.goMenu({ gid: "M0003" });
				});
				$('.dwp-gnb-approval-wait-dialog .more', _$dialog.element).off('click').on('click', function () {
					_$dialog.close();
					var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;
					if (_envinfo.aprvlist == "1") {
						_$$.portal.goMenu({ gid: "M0035" });
					} else {
						_$$.portal.goMenu({ gid: "L0003" });
					}
				});
			}
		} // _gnbIconMenu - E
		/* 	_loadSettingConts - S
			환경설정 Contents Loading
		*/
		, _loadSettingConts: function (tabid, _$dialog) {
			if (tabid == "dwp-tabs-setting-content") {
				$fn.xAjax({
					type: "GET",
					url: $fn.getProxyUrl($fn.getPath("main") + "/wFrmEnv?ReadForm&did=" + _$dialog.options.id),
					success: function (data, textStatus, xhr) {
						$('#' + tabid, _$dialog.element).html(data);
						$dwp.core.lang.convert({ isedit: true }, $('#' + tabid, _$dialog.element));
					},
					error: function (xhr, status, e) {
					}
				});
				$('.dwp-tooltip', _$dialog.element.prev()).show();
			} else if (tabid == "dwp-tabs-mail-content") {
				$fn.xAjax({
					type: "GET",
					url: $fn.getProxyUrl($fn.getPath("mail") + "/wFrmProfile?OpenForm&tabid=dwp-tabs-mail-content&did=" + _$dialog.options.id),
					success: function (data, textStatus, xhr) {
						$('#' + tabid, _$dialog.element).html(data);
						//$dwp.core.lang.convert({isedit : true}, $('#'+tabid, _$dialog.element));
					},
					error: function (xhr, status, e) {
					}
				});
				$('.dwp-tooltip', _$dialog.element.prev()).hide();
			} else if (tabid == "dwp-tabs-outofoffice-content") {
				$fn.xAjax({
					type: "GET",
					url: $fn.getProxyUrl($fn.getPath("mail") + "/wFrmOutOfOfficeProfile?OpenForm&tabid=dwp-tabs-outofoffice-content&did=" + _$dialog.options.id),
					success: function (data, textStatus, xhr) {
						$('#' + tabid, _$dialog.element).html(data);
						//$dwp.core.lang.convert({isedit : true}, $('#'+tabid, _$dialog.element));
					},
					error: function (xhr, status, e) {
					}
				});
				$('.dwp-tooltip', _$dialog.element.prev()).hide();
			} else if (tabid == "dwp-tabs-approval-content") {
				$fn.xAjax({
					type: "GET",
					url: $fn.getProxyUrl("/dwp/aprv/com/sign.nsf/wFrmSign?OpenForm&tabid=dwp-tabs-approval-content&did=" + _$dialog.options.id),
					success: function (data, textStatus, xhr) {
						$('#' + tabid, _$dialog.element).html(data);
						//$dwp.core.lang.convert({isedit : true}, $('#'+tabid, _$dialog.element));
					},
					error: function (xhr, status, e) {
					}
				});
				$('.dwp-tooltip', _$dialog.element.prev()).hide();
			} else if (tabid == "dwp-tabs-pw-content") {
				$fn.xAjax({
					type: "GET",
					url: $fn.getProxyUrl($fn.getPath("main") + "/wFrmPw?OpenForm&did=" + _$dialog.options.id),
					success: function (data, textStatus, xhr) {
						$('#' + tabid, _$dialog.element).html(data);
						$dwp.core.lang.convert({ isedit: true }, $('#' + tabid, _$dialog.element));
					},
					error: function (xhr, status, e) {
					}
				});
				$('.dwp-tooltip', _$dialog.element.prev()).hide();
			}
		} // _loadSettingConts - E
		// _toolbarInit - S
		, _toolbarInit: function () {
			var _me = this
				, _$toolbar_config = $("div.xware-toolbar-config")
				, _$toolbar_list = $("ul.xware-toolbar-list")
				, _$toolbar = $("div.xware-toolbar-setting")
				, _$toolbar_body = $("div.toolbar-setting-body", _$toolbar_config)
				, _h = "";

			_$toolbar.off("click").on("click", function () {
				_$toolbar_config.toggleClass('show');
			});

			// Event 저장처리
			$("span.btn", _$toolbar_config).off('click').on('click', function () {
				console.log("Toolbar 설정");
				var _$chk = $("input[name=_STOOL]:checked", _$toolbar_body);

				if (_$chk.size() == 0) {
					$fn.alert({ msg: $fn.getCodeMsg("앱을 선택해 주십시오?") });
					return;
				}

				var _unid = "", _url = "/dwp/com/portal/toolbar_mng.nsf/";
				var _data = { 'SetType': '2', 'IsDefault': '0' };

				var _toolbar = _$toolbar_list.data("_TOOLBAR");
				if (typeof _toolbar != "undefined") {
					_unid = _toolbar["@unid"];
				}

				var _serializedData = $.map(_$chk, function (_o) {
					var _item = $(_o).parents("div.dwp-checkbox").data("_TOOLBAR_ITEM");
					return {
						code: _item.code
						, title: _item.title
						, pkey: _item.pkey
					};
				});

				_data.ToolbarInfo = JSON.stringify(_serializedData);

				if (_unid == "") {
					_url += "wfrm02?createdocument";
					_data.EmpNo = $fn.getCurUser().pinfo.empno;
				} else {
					_url += "wvtoolbar_person/" + _unid + "?savedocument"
				}
				$fn.cmdPost(_url
					, _data
					, function (jdata) {
						//$.unblockUI();
						if (jdata.key == 'NULL') {
							$fn.alert({ msg: $fn.getCodeMsg('코드값이 중복됩니다!') });
							return false;
						}
						// Toolbar ReDrawing
						$fn.toast({ msg: $fn.getCodeMsg("Toolbar설정이 변경되었습니다!") });

						_$toolbar_config.removeClass('show');
						_drawing();
					}
					, "json"
				)
			});

			// 사용자 설정정보 가져오기
			_drawing();

			function _drawing() {
				var _defereds = [];
				var _sysinfo = $dwp.core.getSysinfo();

				// 사용자 설정정보
				_defereds.push(
					$dwp.core.util.xAjax({
						url: "/dwp/com/portal/toolbar_mng.nsf/api/data/collections/name/wvtoolbar_person?count=1"
						, dataType: "json"
						, async: true
						, cache: false
						, data: { category: $fn.getCurUser().pinfo.empno }
					})
				);
				// Site Or 회사 정보
				if (_sysinfo.hasOwnProperty("portalcontent") && _sysinfo.portalcontent == "1") {	// Site
					_defereds.push(
						$dwp.core.util.xAjax({
							url: "/dwp/com/portal/toolbar_mng.nsf/api/data/collections/name/wvtoolbar_site?count=1"
							, dataType: "json"
							, async: true
							, cache: false
							, data: { category: window.location.hostname.toLowerCase() }
						})
					);
				} else {
					_defereds.push(
						$dwp.core.util.xAjax({
							url: "/dwp/com/portal/toolbar_mng.nsf/api/data/collections/name/wvtoolbar_com?count=1"
							, dataType: "json"
							, async: true
							, cache: false
							//회사코드정보 변경 - 2019-04-04 By LHJ
							//,data : {category : $fn.getCurUser().pinfo.comcode}
							, data: { category: $fn.getComCode() }
						})
					);
				}
				// 전체 앱 정보
				_defereds.push(
					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl('/dwp/com/portal/toolbar_mng.nsf/api/data/collections/name/wvuse')
						, dataType: "json"
						, async: true
						, cache: false
						, data: { ps: 99, page: 0 }
					})
				);

				$.when.apply($, _defereds).done(function (xhr1, xhr2, xhr3) {
					// 사용자 설정정보가 없는 경우
					var _toolbarinfo = [];
					if (xhr1[0].length == 0) {
						if (xhr2[0].length == 0) {
							$dwp.core.util.xAjax({
								url: "/dwp/com/portal/toolbar_mng.nsf/api/data/collections/name/wvtoolbar_default?count=1"
								, dataType: "json"
								, async: true
								, cache: false
								, data: { category: (_sysinfo.hasOwnProperty("portalcontent") && _sysinfo.portalcontent == "1" ? "0" : "1") }
							}).done(function (json) {
								if (json.length > 0) {
									if (json[0]._toolbar != "") {
										_toolbarinfo = JSON.parse(json._toolbar);
									}
								}
								_proc(_toolbarinfo);
							});
						} else {
							if (xhr2[0][0]._toolbar != "") {
								_toolbarinfo = JSON.parse(xhr2[0][0]._toolbar);
							}
							_proc(_toolbarinfo);
						}
					} else {
						// 사용자 설정정보 보관
						_$toolbar_list.data("_TOOLBAR", xhr1[0][0]);
						if (xhr1[0][0]._toolbar != "") {
							_toolbarinfo = JSON.parse(xhr1[0][0]._toolbar);
						}
						_proc(_toolbarinfo);
					}

					function _findinfo(code) {
						var _o = {};
						$.each(xhr3[0], function (i, data) {
							if (code == data._code) {
								_o = data;
								return false;
							}
						});
						return _o;
					}

					function _proc(jdata) {
						// 사용자 Toolbar 정보 처리
						_$toolbar_list.empty();

						$.each(jdata, function (i, data) {
							var _info = _findinfo(data.code);
							if ($.isEmptyObject(_info)) return true;
							// Site, Com AuthCheck
							if (!_$$.portal.siteComAuthCheck(_info)) { return true; }

							var _$item = $("<li></li>").appendTo(_$toolbar_list);

							if (_info._icon == "" && _info._icon_css != '') {
								var _$icon = $("<div class='xware-toolbar-icon " + _info._icon_css + "'></div>").appendTo(_$item);
								_$icon.attr('title', $dwp.core.lang.getCurMsg(_info._title));
							} else {
								var _$img = $('<img src="' + (_info._icon == "" ? $fn.getPath('weblib') + "/images/app-icon/app-icon-noimage.svg" : $fn.getPath('weblib') + _info._icon) + '" alt="">').appendTo(_$item);
								_$img.attr('title', $dwp.core.lang.getCurMsg(_info._title));
							}

							if (_info._linkcode != "") {
								_$item.off("click").on("click", function () {
									_me.goMenu({ gid: _info._linkcode });
								});
							} else if (_info._link != "") {
								_$item.off("click").on("click", function () {
									var _link = _info._link;
									var _fnm, _arg = [];
									if (_info._linktype == "JS") {
										if (_link.indexOf("(") > -1) {
											_fnm = _link.split("(")[0];
											_arg = _$$.util.getMidStr(_link, "(", ")").split(",");
											for (var i = 0; i < _arg.length; i++) { _arg[i] = eval(_arg[i]); }
										} else {
											_fnm = _link;
										}
										var _func = _$$.util.getFunction(_fnm);
										if (typeof _func[0] == "function") {
											if (_arg.length > 0) {
												_func[0].apply(null, _arg);
											} else {
												_func[0](opt);
											}
										}
									} else {
										$fn.winopenExt(_link, _info._title);
									}
								});
							}
						});

						// 환경설정 처리
						if (xhr3[0].length == 0) return;

						function _isfind(code) {
							var _find = false;
							$.each(jdata, function (i, data) {
								if (data.code == code) {
									_find = true;
									return false;
								}
							});
							return _find;
						}

						_$toolbar_body.empty();
						var _$ul = $("<ul></ul>").appendTo(_$toolbar_body)
						var _$li = null;
						$.each(xhr3[0], function (i, data) {
							// Site, 회사 권한체크
							if (!_$$.portal.siteComAuthCheck(data)) { return true; }

							if (data._doctype == "0") {
								// 분류인 경우
								_$li = $("<li></li>").appendTo(_$ul);
								_$li.attr("code", data._code);
								_h = "<div class='item_cate'><span>" + $dwp.core.lang.getCurMsg(data._title) + "</span></div>";
								_h += "<div class='dwp-selection-group item_list'></div>"
								_$li.append(_h);
							} else {
								_$li = $("li[code=" + data._pcode + "]", _$ul);

								var _$itemlist = $("div.item_list", _$li);
								_h = "<div class='dwp-checkbox'>";
								_h += "<label>";
								_h += "<input name='_STOOL' type='checkbox' value='" + data._code + "' " + (_isfind(data._code) ? " checked " : "") + ">";
								_h += "<span>" + $dwp.core.lang.getCurMsg(data._title) + "</span>";
								_h += "</label>";
								_h += "</div>";

								//_$itemlist.append(_h);
								$(_h).appendTo(_$itemlist)
									.data("_TOOLBAR_ITEM", {
										code: data._code
										, title: data._title
										, pkey: data._pcode
									});
							}
						});
					}
				});
			}

		} // _toolbarInit - E
		// _sideAppInit
		, _sideAppInit: function () {
			var _me = this
				, _$side = $("div.xware-main div.xware-side")
				, _$sideApp = $("div.xware-main div.xware-side-app")
				, _$sidecut = $("div.xware-side-shotcut", _$side)
				, _$sideContents = null
				, _webchathost = $fn.getSysinfo().webchathost;

			if (_webchathost != '') {
				$('ul', _$sidecut).append('<li data-id="webchat" data-title="WebChat" title="WebChat"><div class="xware-sideapp-icon webchat"></div></li>');
			}

			$("li", _$sidecut).off("click").on("click", function () {
				var _id = $(this).data("id")
					, _title = $(this).data("title");

				if ($(this).hasClass("active")) {
					$(this).removeClass("active");
					_$sideApp.removeClass("active");
					setTimeout(function () { _$sideApp.addClass("dwp-none"); }, 200);
					_$sideContents.addClass('dwp-none');
				} else {
					// App 수행
					$("li", _$sidecut).removeClass("active");
					$(this).addClass("active");

					$("div.xware-side-contents", _$sideApp).addClass("dwp-none");

					_$sideContents = _me._createSideApp(_id);
					var _inst = _$sideContents.draggable("instance");
					if (_inst == undefined) {
						_$sideApp.removeClass('dwp-none').addClass("active");
					} else {
						_$sideApp.removeClass('dwp-none').removeClass("active");
					}

					_$sideContents.removeClass('dwp-none');
				}
			});

			// WebChat LoadIng
			if (_webchathost != '') {
				_$sideContents = _me._createSideApp("webchat");
				_$sideContents.addClass('dwp-none');

				// WebChat UnReadCount Trigger Event On
				$dwp.core.util.xOn(_$sidecut, "WebChatUnReadReload", function (event, opt) {
					console.log("WebChatUnReadReload Trigger");

					var _opt = $.extend({}, opt);

					$dwp.core.util.xAjax({
						url: _webchathost + "/api/chat/unreadmsg"
						, dataType: "json"
						, async: true
						, cache: false
						, data: {}
						, xhrFields: { withCredentials: true }
					})
						.done(function (data) {
							$("div.xware-sideapp-icon.webchat", _$sidecut).attr("data-count", data[0].cnt);
						})
						.fail(function (xhr) { });
				});

				$fn.xTrigger(_$sidecut, "WebChatUnReadReload", {});
			}

		} // _sideAppInit - E
		, _createSideApp: function (id, isreload) {
			var _me = this
				, _isreload = (typeof isreload == "undefined" ? false : isreload)
				, _$side = $("div.xware-main div.xware-side")
				, _$sideApp = $("div.xware-main div.xware-side-app")
				, _$sidecut = $("div.xware-side-shotcut", _$side)
				, _$sideContents = null
				, _$sideheader = null
				, _$sidebody = null;

			//var _appinfo = $(this).data("_APPINFO");
			var _appinfo = {};
			var _did = "_SIDE_APP_" + id;
			if (id == "memo") {
				_appinfo.title = "메모";
				_appinfo.link = "/dwp/com/portal/memo_postit.nsf/wMemo?ReadForm&view=wrmemo&did=" + _did + "&portal=1";
			} else if (id == "contact") {
				_appinfo.title = "연락처";
				_appinfo.link = $dwp.core.getPath("main") + "/wfrmContact?ReadForm&did=" + _did;
			} else if (id == "todo") {
				_appinfo.title = "할일";
				_appinfo.link = "/dwp/com/portal/memo_postit.nsf/wMemo?ReadForm&view=wrmemo&did=" + _did + "&portal=1";
			} else if (id == "webchat") {
				_appinfo.title = "WebChat";
				_appinfo.link = "/dwp/com/portal/main.nsf/webchat?readform";
			}

			_$sideContents = $("#" + _did, _$sideApp);

			if (_$sideContents.size() == 0) {
				_$sideContents = $("<div id='" + _did + "' class='xware-side-contents'><div class='side-header'></div><div class='side-body'></div></div>").appendTo(_$sideApp);

				_$sidehader = $("div.side-header", _$sideContents)
				_$sidebody = $("div.side-body", _$sideContents);

				var _h = "<span class='title'>" + $fn.getCurLangMsg(_appinfo.title) + "</span>";
				_h += "<span name='_RELOAD_BTN' class='btn'><img src='/tcclibs/images/common/icon-refresh.svg'></span>";
				_h += "<span name='_UNFIX_BTN' class='btn'><img src='/tcclibs/images/portal-new/sideapp_fix_icon_off.svg'></span></span>";
				_h += "<span name='_HIDE_BTN' class='btn'><img src='/tcclibs/images/portal-new/sideapp_hide_icon.svg'></span>";
				//_h += "<span name='_CLOSE_BTN' class='btn'><img src='/tcclibs/images/common/icon-close.svg'></span>";

				_$sidehader.html(_h);

				$(".btn[name=_RELOAD_BTN]", _$sidehader).off("click").on('click', function () {
					_me._createSideApp(id, true);
				});

				$(".btn[name=_UNFIX_BTN]", _$sidehader).off("click").on('click', function () {
					//$("li", _$sidecut).removeClass("active");
					var _inst = _$sideContents.draggable("instance");
					if (_inst == undefined) {
						_$sideApp.removeClass("active");
						_$sideContents.addClass("floating");

						_$sideContents
							.draggable({}).resizable({});

						$("img", $(this)).attr("src", "/tcclibs/images/portal-new/sideapp_fix_icon_on.svg");
					} else {
						_inst.destroy();
						var _inst1 = _$sideContents.resizable("instance");
						if (_inst1 != undefined) {
							_inst1.destroy();
						}
						_$sideContents.removeClass("floating");
						_$sideContents.removeAttr("style");
						_$sideApp.addClass("active");

						$("img", $(this)).attr("src", "/tcclibs/images/portal-new/sideapp_fix_icon_off.svg");
					}

				});
				$(".btn[name=_HIDE_BTN]", _$sidehader).off("click").on('click', function () {
					$("li", _$sidecut).removeClass("active");
					var _inst = _$sideContents.draggable("instance");
					if (_inst == undefined) {
						_$sideApp.removeClass("active");
						setTimeout(function () { _$sideApp.addClass("dwp-none"); }, 200);
					} else {
						_$sideApp.addClass("dwp-none");
						_$sideContents.addClass("dwp-none");
					}
				});
				$(".btn[name=_CLOSE_BTN]", _$sidehader).off("click").on('click', function () {
					$("li", _$sidecut).removeClass("active");
					_$sideApp.removeClass("active");
					_$sideContents.remove();
				});

				_isreload = true;
			} else {
				_$sidebody = $("div.side-body", _$sideContents);
			}

			if (_isreload) {
				// Contents 설정
				$dwp.core.util.xAjax({
					url: $dwp.core.util.getProxyUrl(_appinfo.link)
					, dataType: "html"
					, async: false
					, cache: false
					, data: {}
				})
					.done(function (html) {
						_$sidebody.html(html);
					})
					.fail(function (xhr) { });
			}
			return _$sideContents;
		}
		// sideAppOpen function - S
		, sideAppOpen: function (id) {
			var _me = this
				, _$side = $("div.xware-main div.xware-side")
				, _$sideApp = $("div.xware-main div.xware-side-app")
				, _$sidecut = $("div.xware-side-shotcut", _$side)
				, _$sideitem = $("li[data-id=" + id + "]", _$sidecut)
				, _$sideContents = null;

			if (_$sideitem.hasClass('active')) { return; }

			$("li", _$sidecut).removeClass("active");
			_$sideitem.addClass("active");

			$("div.xware-side-contents", _$sideApp).addClass("dwp-none");

			_$sideContents = _me._createSideApp(id);
			var _inst = _$sideContents.draggable("instance");
			if (_inst == undefined) {
				_$sideApp.removeClass("dwp-none").addClass("active");
			} else {
				_$sideApp.removeClass("dwp-none").removeClass("active");
			}

			_$sideContents.removeClass('dwp-none');
		} // sideAppOpen function - E
		, sideAppClose: function () {
			var _me = this
				, _$side = $("div.xware-main div.xware-side")
				, _$sideApp = $("div.xware-main div.xware-side-app")
				, _$sidecut = $("div.xware-side-shotcut", _$side)
				, _$sideitem = $("li.active", _$sidecut)
				, _$sideContents = null;

			if (_$sideitem.size() == 0) return;

			var _id = _$sideitem.data("id");
			_$sideitem.removeClass("active");
			_$sideContents = _me._createSideApp(_id);
			var _inst = _$sideContents.draggable("instance");
			if (_inst == undefined) {
				_$sideApp.removeClass("active");
			} else {
				_$sideContents.addClass("dwp-none");
			}
		}
		, _eventInit: function () {
			var _me = this;

			// 공지 Banner Close Event
			$("div.dwp-head-banner div.close-area").off("click").on("click", function () {
				$("body").removeClass("show-banner");
			});

			// Drop 방지 하기
			$(document).on('drop dragover', function (e) {
				e.preventDefault();
			});

			$(document).on('dragover', function (e) {
				var dropZone = $('div[name=file_dropzone]'),
					timeout = window.dropZoneTimeout;
				if (!timeout) {
					dropZone.addClass('file-over');
				} else {
					clearTimeout(timeout);
				}
				var found = false,
					node = e.target;
				do {
					if (node === dropZone[0]) {
						found = true;
						break;
					}
					node = node.parentNode;
				} while (node != null);
				if (found) {
					dropZone.addClass('file-over');
					//console.log("find found")
				} else {
					dropZone.removeClass('file-over');
					//console.log("not find found")
				}
				window.dropZoneTimeout = setTimeout(function () {
					window.dropZoneTimeout = null;
					dropZone.removeClass('file-over');
				}, 100);
			});

			// Main Click 시
			$("div.xware-main-container").off("click.MAIN").on("click.MAIN", function (e) {
				// Session Timeout Reset
				_me.countDown();
				if ($("div.xware-header-menu").size() > 0) {
					if (!$.contains($("div.xware-header-menu").get(0), e.target) && $("div.xware-header-submenu-wrap").hasClass("active")) {
						$("div.xware-header-submenu-wrap").removeClass("active");
					}
				}
				var _$toolbar = $(".xware-main>.xware-toolbar-config");
				if (_$toolbar.size() > 0) {
					if (!$.contains($("div.xware-toolbar-setting").parent().get(0), e.target)) {
						if (!$.contains(_$toolbar.get(0), e.target) && _$toolbar.hasClass("show")) {
							_$toolbar.removeClass("show");
						}
					}
				}
				/*
						 var _$sideapp = $(".xware-main>.xware-side-app");
						 if (_$sideapp.size() > 0) {
							 if (!$.contains($("div.xware-side").get(0), e.target)) {
								 if (!$.contains(_$sideapp.get(0), e.target) && $(".xware-side-shotcut li.active").size() > 0) {
									 _me.sideAppClose();
								 }
							 }
						 }
				*/
			});

			// BackSpace(8), F5(116) 막기 - 문서편집인 경우
			$("body").off("keydown").on("keydown", function (event) {
				var keycode = event.keyCode;

				function _isDocEdit() {
					var _rtnval = false;
					var _doc = $fn.getInstance("doc");
					if (_doc == undefined) {
						_doc = $fn.getInstance("doc", undefined, { type: "preview" });
						if (_doc == undefined) {
							$("div.dwp-xdialog").each(function () {
								if ($(this).is("[id]")) {
									_doc = $("#" + $(this).attr("id")).doc("instance");
									if (_doc == undefined) { return true; }
									if (_doc.options.isedit) { _rtnval = true; return false; }
								}
							});
						}
					} else {
						if (_doc.options.isedit) { _rtnval = true; }
					}
					return _rtnval;
				}

				function _getDoc() {
					var _doc = $fn.getInstance("doc");
					if (_doc == undefined) {
						_doc = $fn.getInstance("doc", undefined, { type: "preview" });
						if (_doc == undefined) {
							$("div.dwp-xdialog").each(function () {
								if ($(this).is("[id]")) {
									_doc = $("#" + $(this).attr("id")).doc("instance");
									if (_doc == undefined) { return true; }
								}
							});
						}
					}
					return _doc;
				}

				if (keycode == 8) {
					var d = event.srcElement || event.target;
					var doPrevent = false;

					if ((d.tagName.toUpperCase() === 'INPUT') || d.tagName.toUpperCase() === 'TEXTAREA') {
						doPrevent = d.readOnly || d.disabled;
					} else {
						doPrevent = true;
					}
					if (doPrevent) {
						if (_me.isDocEdit({ type: "new" })) {
							event.preventDefault();

							$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg060") })
								.done(function () {
									//parent.history.back();
									var _doc = _getDoc();
									if (_doc != undefined) {
										_doc.goview();
									}
								});
						}
					}
				} else if (keycode == 116) {
					if (_me.isDocEdit({ type: "new" })) {
						event.preventDefault();

						$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg061") })
							.done(function () {
								parent.location.reload();
							});
					}
				}
			});

			//2020-06-15 By LHJ Gantt Chart Tooltip Remove
			$("body").off("click.GANTT_TOOLTIP").on("click.GANTT_TOOLTIP", function (event) {
				var d = event.srcElement || event.target;
				if ($(d).closest("#gantt_here").size() == 0 && $(".gantt_tooltip").size() > 0) {
					$(".gantt_tooltip").remove();
				}
			});
			$(window).resize(function () {
				console.log("window.resize");
				// _$lnbBody Height 조정
				_me._lnb_resize();
			});

			// Window Post Message Listener
			window.addEventListener("message", _me.receiveMessage, false);

		} // _eventInit - E

		// Window Post Message 처리 함수
		, receiveMessage: function (event) {
			var _me = this;

			console.log("Post Message", event);
			$dwp.app.winPost.receiveMessage(event);
		}

		, _convertDisp: function (mode) {
			var _me = this
				, _mode = (typeof mode == "undefined" ? "P" : mode)
				, _$portal = $("div.xware-portal-wrap")
				, _$main = $("div.xware-main-wrap")
				, _$submain = $("div.dwp-smain-container", _$main)
				, _$subportal = $("div.dwp-sportal-container", _$main)
				, _envinfo = $dwp.core.getCurUser().pinfo.envinfo;

			$("div.xware-header-submenu-wrap").removeClass("active");

			if (_mode == "P") {
				_$main.addClass("dwp-none");
				_$portal.removeClass("dwp-none");
			} else if (_mode == "M") {
				_$portal.addClass("dwp-none");
				_$main.removeClass("dwp-none");
				_$subportal.addClass("dwp-none");
				_$submain.removeClass("dwp-none");
			} else if (_mode == "S") {
				_$portal.addClass("dwp-none");
				_$main.removeClass("dwp-none");
				_$submain.addClass("dwp-none");
				_$subportal.removeClass("dwp-none");
			}
		} // _convertDisp - E

		, subPortalInit: function (opt) {
			var _me = this
				//,_$sportal = $("div.dwp-sub-portal")
				, _$content = $dwp.core.getSPContent()
				//,_$content = $dwp.core.getContent()
				, _$sportal = null
				, _opt = $.extend({ link: "", linktype: "" }, opt);

			_$content.empty();
			_$content.html('<div class="dwp-wrapping"><div class="dwp-page-body"></div></div>');

			_$sportal = $(".dwp-page-body", _$content);

			if (_opt.link == "" || _opt.linktype == "") return;

			function _doit() {
				if (_opt.linktype == "PAGE") {
					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl(_opt.link)
						, dataType: "html"
						, async: true
						, cache: false
						, data: {}
					}).done(function (html) {
						_$sportal.html(html);
						_$$.history.addHistory(_opt);
					}).fail(function () { });
				} else if (_opt.linktype == "WPOP") {
					if (_opt.link.indexOf("http://") > -1 && _opt.link.indexOf("http://" + window.location.host) == -1) {
						$fn.winopenExt(_opt.link, _opt.title, {});
					} else {
						$fn.winopen(_opt.link, _opt.title);
					}
				} else if (_opt.linktype == "JS") {
					if (_opt.link.indexOf("(") > -1) {
						_fnm = _opt.link.split("(")[0];
						_arg = _$$.util.getMidStr(_opt.link, "(", ")").split(",");
						for (var i = 0; i < _arg.length; i++) { _arg[i] = eval(_arg[i]); }
					} else {
						_fnm = _opt.link;
					}
					_func = _$$.util.getFunction(_fnm);
					if (typeof _func[0] == "function") {
						if (_arg.length > 0) {
							_func[0].apply(null, _arg);
						} else {
							_func[0](opt);
						}
					}
				}
			}

			if (_opt.hasOwnProperty("ismenu") && _opt.ismenu) {
				if (_me.isDocEdit({ type: "" }) && _opt.linktype != "WPOP") {
					$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg062") })
						.done(function () { _doit(); });
				} else {
					_doit();
				}
			} else {
				_doit();
			}
		} // subPortalInit - E

		// 서브 메뉴 로딩 처리 시
		, subInit: function (opt) {
			var _me = this, _opt = $.extend({}, opt);
			// GNB MENU 코드로 링크정보 가져오기
			// LNB정보 및 본문 페이지 정보
			// 기타 경로 들어오는 경우도 GNB에 등록 하여 사용 TYPE를 별도로 설정
			// 좌측메뉴 및 선택 메뉴코드 하위, 문서바로 열기 시  path, unid 파라미터

			function _init() {
				function _jsonGetParmData() {
					var _key = _opt.gid
						, _url = $dwp.core.getPath("menu") + "/api/data/collections/name/wvlink";
					return {
						url: _url
						, dataType: "json"
						, async: false
						, cache: false
						, data: { category: _key }
					};
				}
				$dwp.core.util.xAjax(_jsonGetParmData())
					.done(function (jdata) {
						$(jdata).each(function (i, data) {
							//console.log("data", data);
							var _lnbpos = data._lnbpos
								, _link = data._link
								, _linktype = data._linktype
								, _top = (data.hasOwnProperty("_top") ? data._top : "");

							console.log("subInit _opt", _opt);

							if (_opt.hasOwnProperty("lnbid") && _opt.lnbid != "") {
								$dwp.core.util.xAjax({
									url: $dwp.core.getPath("menu") + "/api/data/collections/name/wvlnb_list?count=1"
									, dataType: "json"
									, async: false
									, cache: false
									, data: { category: data._lnbid + "_" + _opt.lnbid }
								})
									.done(function (json) {
										if (json[0]) {
											_lnbpos = _opt.lnbid;
											_link = json[0]._link;
											_linktype = json[0]._linktype;
										}
									});
							}
							if (_opt.hasOwnProperty("vpr")) {
								if (_opt.vpr.hasOwnProperty("appdbid")) {
									data._lnbdlink = data._lnbdlink.replace(/{appdbid}/gi, _opt.vpr.appdbid);
									_link = _link.replace(/{appdbid}/gi, _opt.vpr.appdbid);
								}
								if (_opt.vpr.hasOwnProperty("vzregcode")) {
									data._lnbdlink = data._lnbdlink.replace(/{vzregcode}/gi, _opt.vpr.vzregcode);
									_link = _link.replace(/{vzregcode}/gi, _opt.vpr.vzregcode);
								}
							} else {
								// 2020-05-18 By LHJ ADD
								if (_opt.hasOwnProperty("link") && _opt.link != "") {
									_link = _opt.link;
								}
								if (_opt.hasOwnProperty("lnbpos") && _opt.lnbpos != "") {
									_lnbpos = _opt.lnbpos;
								}
							}
							if (data._lnbid != "" || data._lnblink != "" || data._lnbdlink != "") {
								//console.log('Not Link')
								_me.lnb({ lnbid: data._lnbid, lnblink: data._lnblink, lnbdlink: data._lnbdlink, lnbpos: _lnbpos });
							}
							console.log("subInit data", data)
							_me._act({ link: _link, linktype: _linktype, top: _top, ismenu: true });
							//_me.content({link : data._link, linktype : data._linktype});
						});
					})
					.fail(function () { });
			}
			_init();

		} // subInit - E

		, lnb: function (opt) {
			//var _$el = $("div.dwp-nav-container", $dwp.core.getLnb())
			var _me = this, _$el = $("div.dwp-lnb-wrap", $dwp.core.getLnb())
				, _opt = $.extend({ lnbid: "", lnblink: "", lnbdlink: "", lnbpos: "" }, opt);

			_$el.data(_me._CONST._DATA.LNB, _opt);

			//Scroll 처리
			if (_$el.hasClass("mCustomScrollbar")) {
				_$el.mCustomScrollbar("destroy");
			}

			function _init() {
				function _jsonGetParmData() {
					var _url = (_opt.lnbid != "" || _opt.lnbdlink != "") ? $dwp.core.getPath("menu") + "/wLnb?ReadForm" : (_opt.lnblink != "") ? _opt.lnblink : "";
					//console.log("_url", _url);
					return {
						url: _url
						, dataType: "html"
						, async: false
						, cache: false
						, data: { lnbid: _opt.lnbid, lnbdlink: _opt.lnbdlink, lnbpos: _opt.lnbpos }
					};
				}
				$dwp.core.util.xAjax(_jsonGetParmData())
					.done(function (html) {
						_$el.html(html);
					})
					.fail(function () { });
			}
			_init();
		} // lnb - E

		, _lnb_resize: function () {
			var _me = this
				, _$lnbwrap = $(".dwp-lnb-wrap", $dwp.core.getLnb())
				, _$lnbHeader = $("div.dwp-menu-head", $dwp.core.getLnb())
				, _$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());

			if (_$lnbBody.size() > 0) {
				_$lnbBody.height(_$lnbwrap.height() - _$lnbHeader.height() - 30);
			}
		}
		, _lnb: function (opt) {
			var _me = this
				, _opt = $.extend({}, opt)
				, _$lnbwrap = $(".dwp-lnb-wrap", $dwp.core.getLnb())
				, _$lnbHeader = $("div.dwp-menu-head", $dwp.core.getLnb())
				, _$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());

			//_$el.empty();
			this.reload = function () {
				//console.log("reload");
			}
			this.reloadCount = function () {

			}
			// lnb Data가져오기
			/* JSON OBJECT Return Type
			 * [{id : "id"
			 * ,nm : "언어코드"
			 * ,href : "Content Page Link Or JS"
			 * ,hreftype : "호출방법"
			 * ,type : "button or list or select"
			 * ,level: ""
			 * ,pid : "상위코드"
			 * ,issubtree : "하위 Tree표시 여부"
			 * }]
			 */
			function _loadData() {
				//var _me = this;
				var _child = [];
				var _minExpandLevel = 1;

				function _jsonGetParmData() {
					var _key = _opt.lnbid
						, _url = (_key != "") ? $dwp.core.getPath("menu") + "/api/data/collections/name/wvlnb?count=999" : (_opt.lnbdlink != "") ? _opt.lnbdlink : ""
						, _data = ((_key != "") ? { category: _opt.lnbid } : {});
					_url = $dwp.core.util.getProxyUrl(_url);
					return {
						url: _url
						, dataType: "json"
						, async: false
						, cache: false
						, data: _data
					};
				}
				$dwp.core.util.xAjax(_jsonGetParmData())
					.done(function (jdata) {
						$(jdata).each(function (i, data) {
							var _row = {};
							_row.key = data._lnbid
							_row.mid = data._lnbid;
							_row.ftitle = data._title;
							_row.title = $dwp.core.lang.getCurMsg(data._title)
							_row.level = parseInt(data._level, 10);
							_row.pid = data._pid;
							_row.link = data._link;
							_row.linktype = data._linktype;
							_row.linkcnt = data._linkcnt;
							_row.subtype = data._subtype;
							_row.type = data._type;
							_row.htitle = data._htitle;
							_row.hlink = data._hlink;
							_row.hlinktype = data._hlinktype;
							_row.hicon = data._hicon;
							_row.hlinkdata = data._hlinkdata;
							// 2020-05-26 By LHJ ADD Right ICon
							_row.righticon = (typeof data._right_icon == "undefined" ? "" : data._right_icon);
							// 2020-08-24 By LHJ UPDATE Error Fix
							_row.lefticon = (typeof data._left_icon == "undefined" ? "" : data._left_icon);
							//_row.lefticon = data._left_icon;
							_row.lefticonfn = data._left_iconfn;
							_row.datalink = data._datalink;
							_row.expandlvl = data._expandlvl;
							_row.tlink = (typeof data._tlink == "undefined" ? "" : data._tlink);
							_row.tlinktype = (typeof data._tlinktype == "undefined" ? "" : data._tlinktype);
							_row.ismenu = true;

							// 2019-10-01 By LHJ ADD Site 권한체크
							if (!_$$.portal.siteComAuthCheck(data)) { return true; }
							/*
							if (data.hasOwnProperty("_site") && data._site != ""){
								if(data._site.indexOf(window.location.hostname.toLowerCase()) == -1){return true;}
							}
							if (data.hasOwnProperty("_authcom") && data._authcom != ""){
								//회사코드정보 변경 - 2019-04-04 By LHJ
								//if(data._authcom.indexOf($fn.getCurUser().pinfo.comcode) == -1){return true;}
								if(data._authcom.indexOf($fn.getComCode()) == -1){return true;}
							}
							*/

							if (_row.pid == "") {
								_child.push(_row);
							} else {
								$dwp.core.util.toTreeData(_row.pid, _child, _row);
							}
						});
					})
					.fail(function () { });

				return _child;
			}

			//To-Do nav count Trigger Event
			function _eventInit() {
				// param event object check
				$dwp.core.util.xOn(_$lnbBody, "LnbCntReload", function (event, opt) {
					//console.log("Trigger LnbCntReload", opt);
					// if (opt == undefined) return;
					var _fnm = _$lnbHeader.attr("data-link-fn"), _cntfunc = null, _cntjson = {};

					if (typeof _fnm != "undefined" && _fnm != "") {
						_cntfunc = _$$.util.getFunction(_fnm);
						if (typeof _cntfunc[0] == "function") {
							_cntjson = _cntfunc[0](opt);

							$.each(_cntjson, function (p, v) {
								var _$span = $("span[data-linkcnt='" + p + "']", _$lnbBody);
								if (_$span.size() > 0) { _$span.text(v); }
							});
						}
					}
				});

				$dwp.core.util.xOn(_$lnbBody, "LnbReload", function (event, opt) {
					//console.log("Trigger LnbReload", opt);
					if (opt.type == "all") {
						var _$el = $("div.dwp-lnb-wrap", $dwp.core.getLnb())
							, _opt = _$el.data(_me._CONST._DATA.LNB);
						_me.lnb(_opt);
						//$dwp.ui.nscroll.resize($(".dwp-lnb-wrap", $dwp.core.getLnb()));
					} else {
						$.each(opt.lnbids, function (i, v) {
							var _$div = $("#" + v, _$lnbBody)
								, menu = null;

							if (_$div.size() == 0) return true;

							_menu = _$div.data(_me._CONST._DATA.LNB_ITEM);

							if (_menu.type == "3") {
								_$$.util.xAjax({
									url: _menu.link
									, data: { lnbid: _menu.mid }
									, dataType: "html"
									, async: true
									, cache: false
								})
									.done(function (_html) {
										_$div.html(_html);
										//Scroll 처리
										//$dwp.ui.scroll($(".dwp-lnb-wrap", $dwp.core.getLnb()));
										//$dwp.ui.nscroll.resize($(".dwp-lnb-wrap", $dwp.core.getLnb()));
									});
							} else if (_menu.type == "4") {
								//console.log("aaa")
								//var _$tree = $(".dwp-tree",_$div.parent()).xtree("instance");
								var _$tree = $("#tree_" + v, _$lnbBody).xtree("instance");

								if ($("#tree_" + v, _$lnbBody).size() > 0) {
									_$tree.treeReload(_loadTreeData(_menu));

									//트리가 없는 상태에서 신규로 추가되는 경우 - 2020.09.18 by dwlee
									// 메일의 개인 보관함만 이런 경우가 있을듯...
								} else {
									var opt = { "lnbpos": v };
									_drawTreeMenu($("#" + v, _$lnbBody).parent(), v, _loadTreeData(_menu), opt);

									//_loadTreeData(_menu);
								}
							}
						});
					}
				});

			}

			function _draw() {
				var _menudata = (_opt.data) ? _opt.data : _loadData();

				if (_menudata.length == 0) return;

				_drawHeader(_menudata[0]);

				// _$lnbBody Height 조정
				_me._lnb_resize();
				//_$lnbBody.height(_$lnbwrap.height() - _$lnbHeader.height() - 30);

				if (_menudata[0].children) {
					//_drawHeader(_menudata[0]);

					//opt.isExpand = _menudata[0].expand;
					opt.expandlvl = _menudata[0].expandlvl == "" ? 1 : parseInt(_menudata[0].expandlvl, 10);
					//opt.istop = true;
					if (_menudata[0].subtype == "1") {
						_drawTreeMenu(_$lnbBody, _menudata[0].mid, _menudata[0].children, opt);
					} else {
						_drawListMenu(_$lnbBody, _menudata[0].children, opt);
					}
				} else {
					// 2020-09-03 By LHJ Add
					if (_menudata[0].type == "3") {	//Page 호출
						if (_menudata[0].link == "") return true;
						_$div = $("<div class='dwp-lnb-util-area' id='" + _menudata[0].mid + "'></div>").appendTo(_$lnbBody);
						_$div.data(_me._CONST._DATA.LNB_ITEM, _menudata[0]);
						_$$.util.xAjax({
							url: $dwp.core.util.getProxyUrl(_menudata[0].link)
							, data: { lnbid: _menudata[0].mid }
							, dataType: "html"
							, async: false
							, cache: false
						})
							.done(function (_html) {
								_$div.html(_html);
							});
					}
				}
			}

			function _drawHeader(data) {
				var _$title = $("div.dwp-menu-title", _$lnbHeader)
					, _$btn = null, _$btngrp = null;

				if (data.hasOwnProperty("linkcnt") && data.linkcnt != "") {
					_$lnbHeader.attr("data-link-fn", data.linkcnt);
				}

				_$title.html($dwp.core.lang.getCurMsg(data.title));
				//console.log("data", data);
				if (data.hasOwnProperty("tlink") && data.tlink != "" && data.hasOwnProperty("tlinktype") && data.tlinktype != "") {
					_$title.addClass("dwp-cursor");
					_$title.off("click").on("click", function () {
						_me._act({ link: data.tlink, linktype: data.tlinktype, title: $dwp.core.lang.getCurMsg(data.title), ismenu: true });
					});
				} else if (data.hasOwnProperty("link") && data.link != "" && data.hasOwnProperty("linktype") && data.linktype != "") {
					_$title.addClass("dwp-cursor");
					_$title.off("click").on("click", function () {
						_me._act({ link: data.link, linktype: data.linktype, title: $dwp.core.lang.getCurMsg(data.title), ismenu: true });
					});
				}

				// 작성권한 체크필요
				if ((typeof data.hlinkdata == "undefined" || data.hlinkdata == "") && (data.hlink == "" || data.hlinktype == "")) return;

				if (data.hlinkdata != "") {
					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl(data.hlinkdata)
						, dataType: "json"
						, async: false
						, cache: false
					}).done(function (jdata) {
						data.hlink = [];
						data.hlinktype = [];
						data.htitle = [];
						data.hicon = [];
						$(jdata).each(function (i, o) {
							data.hlink.push(o.hlink);
							data.hlinktype.push(o.hlinktype);
							data.htitle.push(o.htitle);
							data.hicon.push(o.hicon);
						});
					})
						.fail(function () { });
				}
				if ($.isArray(data.hlink)) {
					_$btngrp = $("<div class='dwp-lnb-btn-group'></div>").appendTo(_$lnbHeader)
					$.each(data.hlink, function (i, v) {
						var _$btn;
						if (typeof data.hicon[i] != "undefined" && data.hicon[i] != "") {
							_$btn = $("<div><button class='dwp-nav-btn'><img src='" + $dwp.core.getPath("weblib") + data.hicon[i] + "'/>" + $dwp.core.lang.getCurMsg(data.htitle[i]) + "</button></div>").appendTo(_$btngrp)
						} else {
							_$btn = $("<div><button class='dwp-nav-btn'>" + $dwp.core.lang.getCurMsg(data.htitle[i]) + "</button></div>").appendTo(_$btngrp);
						}
						_$btn.on("click", function () {
							_me._act({ link: v, linktype: data.hlinktype[i], title: $dwp.core.lang.getCurMsg(data.htitle[i]), ismenu: true });
						});
					});
				} else {
					var _$btn;
					if (typeof data.hicon != "undefined" && data.hicon != "") {
						_$btn = $("<button class='dwp-nav-btn'><img src='" + $dwp.core.getPath("weblib") + data.hicon + "'/></button>").appendTo(_$lnbHeader);
					} else {
						_$btn = $("<button class='dwp-nav-btn'></button>").appendTo(_$lnbHeader);
					}
					_$btn.append($dwp.core.lang.getCurMsg(data.htitle))
						.on("click", function () {
							_me._act({ link: data.hlink, linktype: data.hlinktype, title: $dwp.core.lang.getCurMsg(data.htitle), ismenu: true });
						});
				}
			}

			function _drawListMenu(_$par, menudata, opt) {
				var _depth = menudata[0].level;
				//,_$pdiv = null, _$div = null, _$title = null, _$expand = null;

				$(menudata).each(function (i, _menu) {
					var _$pdiv = null, _$div = null, _$title = null, _$expand = null, _$cnt = null, _$icon = null;
					if (_depth > 2) {
						if (_menu.pid != "") {
							_$pdiv = $("div.dwp-lnb-depth" + _depth + "[pid=" + _menu.pid + "]", _$par);
							if (_$pdiv.size() == 0) {
								_$pdiv = $("<div class='dwp-lnb-depth" + _depth + "' pid='" + _menu.pid + "'></div>").appendTo(_$par);
							}
						} else {
							_$pdiv = $("div.dwp-lnb-depth" + _depth, _$par);
							if (_$pdiv.size() == 0) {
								_$pdiv = $("<div class='dwp-lnb-depth" + _depth + "'></div>").appendTo(_$par);
							}
						}
					} else {
						_$pdiv = $("<div class='dwp-lnb-depth" + _depth + "'></div>").appendTo(_$par);
					}

					if (_menu.type == "0" || _menu.type == "4") {	// 아코디언 리스트인 경우
						_$div = $("<div class='dwp-lnb-item' id='" + _menu.mid + "'></div>").appendTo(_$pdiv);
						_$div.data(_me._CONST._DATA.LNB_ITEM, _menu);

						if (_menu.hasOwnProperty("righticon") && _menu.righticon != "") {
							_$div.html("<img class='dwp-lnb-bullet' src='" + _menu.righticon + "'/>");
						}
						_$title = $("<a name='_DWP_LINK' class='dwp-link'></a>").appendTo(_$div).text($dwp.core.lang.getCurMsg(_menu.title));
						//,_$expend = $dwp.core.lang.getCurMsg(_menu.title);

						if (_menu.mid == opt.lnbpos) {
							if ((_depth - 1) > 1) {
								//console.log("_depthA", _depth);
								//console.log(_$expend);
								//_$expend.closest(".dwp-lnb-depth" + (_depth - 1)).addClass("active");
								_$div.parents(".dwp-lnb-depth" + (_depth - 1)).addClass("active");
							} else {
								//console.log("_depthB", _depth);
								_$pdiv.addClass("active")
							}
							_$div.addClass("selected");
						}

						// 건수 표시
						if (_menu.linkcnt != "") {
							_$cnt = $("span.num", _$title);
							if (_$cnt.size() == 0) {
								_$cnt = $("<span class='num'></span>").appendTo(_$title);
							}
							_$cnt.attr("data-linkcnt", _menu.linkcnt)
						}

						_$title.on("click", function () {
							//$(".dwp-link").parent("").removeClass("selected");
							$("[name=_DWP_LINK]").parent("").removeClass("selected");
							$(this).parent().addClass("selected");
							if (_menu.link == "") {
								if ($("a.dwp-depth-open", _$div).size() > 0) {
									_$div.parent().toggleClass("active");
								}
							} else {
								_me._act(_menu);
							}
							//_me._act(_menu);
						});


						if (_menu.lefticon != undefined && _menu.lefticon != "") {
							//CSS를 배열값으로 처리 - 2020.08.06 by dwlee
							var _icons = _menu.lefticon.split(";");
							var _fncs = (_menu.hasOwnProperty("lefticonfn") && _menu.lefticonfn != "" ? _menu.lefticonfn.split(";") : [""]);
							var _base = 0;

							//하위메뉴가 있는데도 이미지가 있는 경우 - 2020.08.05 by dwlee
							if (_menu.children && _menu.children.length > 0 || _menu.datalink != "") {
								_base = 25;
							}

							$.each(_icons, function (j, _icon) {
								_$icon = $("<a class='" + _icon + "'></a>").appendTo(_$div);
								if (_base > 0) {
									_$icon.css("margin-right", _base + "px");
									_base += 25;
								}
								_$icon.on("click", function () {
									if (_fncs.length < j) return;
									if (_fncs[j] == "") return;
									var _cntfunc = _$$.util.getFunction(_fncs[j]);
									if (typeof _cntfunc[0] == "function") {
										_cntfunc[0](_menu);
									}
								});
							});

							/*
							_$icon = $("<a class='" + _menu.lefticon +"'></a>").appendTo(_$div);

							//하위메뉴가 있는데도 이미지가 있는 경우 - 2020.08.05 by dwlee
							if (_menu.children && _menu.children.length > 0 || _menu.datalink != "") {
								_$icon.css("margin-right","25px");
							}
							_$icon.on("click", function(){
								if(_menu.lefticonfn == "") return;
								var _cntfunc = _$$.util.getFunction(_menu.lefticonfn);
								if(typeof _cntfunc[0] == "function") {
									_cntfunc[0](_menu);
								}
							});
							*/

						}

						if (_menu.type == "4" && _menu.datalink) {
							// 하위메뉴 데이터를 Ajax로 받아 처리함.(일단 Tree인 경우만 처리하는 것으로 함.)
							_menu.children = _loadTreeData(_menu)
							/*
							_$$.util.xAjax({
								url : $dwp.core.util.getProxyUrl(_menu.datalink)
								,data : {lnbid : _menu.mid}
								,dataType : "json"
								,async : false
								,cache : false
							})
							.done(function(jdata){
								var _child = [], _blvl = 0;
								$(jdata).each(function(i, data){
									if (i == 0 ) _blvl = parseInt(data._level,10);
									var _row = {};
									_row.key = data._lnbid
									_row.mid = data._lnbid;
									_row.ftitle = data._title;
									_row.title = $dwp.core.lang.getCurMsg(data._title)
									_row.level = (parseInt(data._level,10) - _blvl + 1) + _depth;
									_row.pid = data._pid;
									_row.link = data._link;
									_row.linktype = data._linktype;
									_row.linkcnt = data._linkcnt;
									_row.subtype = data._subtype;
									_row.type = data._type;
									_row.htitle = data._htitle;
									_row.hlink = data._hlink;
									_row.hlinktype = data._hlinktype;
									_row.lefticon = data._left_icon;
									_row.lefticonfn = data._left_iconfn;

									if (_row.pid == "") {
										_child.push(_row);
									} else {
										$dwp.core.util.toTreeData(_row.pid, _child, _row);
									}
								});
								_menu.children = _child;
							});
							*/
						}

						if (_menu.children && _menu.children.length > 0) {
							if (_menu.subtype == "2") {
								var _$quicker = $("<a class='dwp-quicker-open'>quick</a>").appendTo(_$div)
							} else {
								_$expend = $("<a class='dwp-depth-open'></a>").appendTo(_$div)
								_$expend.on("click", function () {
									$(this).closest(".dwp-lnb-depth" + _depth).toggleClass("active");
								});

								if (opt.expandlvl >= _depth) {
									// _$expend.closest(".dwp-lnb-depth" + _depth).addClass("active");
									_$expend.closest(".dwp-lnb-depth" + _depth).toggleClass("active");
								}
								//최상위가 아닌 자기자신에 메뉴펼침레벨 값이 있으면 자기자신만 펼쳐줌. by noh. 21.07.23
								if (_menu.expandlvl == _depth) {
									_$expend.closest(".dwp-lnb-depth" + _depth).addClass("active");
								}
							}
							opt.istop = false;
							opt.isExpand = _menu.expand;
							if (_menu.subtype == "1") {
								//_$li.attr("issubtree", "true");
								//_parent._treemenu(_child, _menu.mid, _menu.children, opt);
								_drawTreeMenu(_$pdiv, _menu.mid, _menu.children, opt);
							} else if (_menu.subtype == "2") {
								_drawQuickMenu(_$pdiv, _menu.mid, _menu.children, opt);
							} else {
								_drawListMenu(_$pdiv, _menu.children, opt);
							}

							//트리의 데이타가 없더라도 추가 - 2020.09.18  by dwlee
							//메일의 개인 보
						} else {
							if (_menu.type == "4" && _menu.datalink && _menu.subtype == "1") {
								var _data = [];

								var _childdata = {
									"key": "null",
									"level": (parseInt(_menu.level) + 1) + ""
								}
								_data.push(_childdata);

								_drawTreeMenu(_$pdiv, _menu.mid, _data, opt);
							}
						}
					} else if (_menu.type == "1") {	//Button
					} else if (_menu.type == "2") {	//SelectBox
						var _seldata = [];
						if (_menu.datalink != "") {
							if (_menu.datalink.indexOf("(") > -1) {
								_fnm = _menu.datalink.split("(")[0];
								_arg = _$$.util.getMidStr(_menu.datalink, "(", ")").split(",");
								for (var i = 0; i < _arg.length; i++) { _arg[i] = eval(_arg[i]); }
							} else {
								_fnm = _menu.datalink;
							}
							_func = _$$.util.getFunction(_fnm);
							if (typeof _func[0] == "function") {
								if (_arg.length > 0) {
									_seldata = _func[0].apply(null, _arg);
								} else {
									_seldata = _func[0](opt);
								}
							} else {
								//_seldata = $fn.getCodeData(_menu.datalink);
							}
						}
						_$div = $("<div class='dwp-lnb-item' id='" + _menu.mid + "'></div>").appendTo(_$pdiv);
						_$div.data(_me._CONST._DATA.LNB_ITEM, _menu);
						_$dsel = $("<div class='dwp-selectbox expended'><select></select></div>").appendTo(_$div);

						$.each(_seldata, function (i, o) {
							var _$opt = $("<option></option>").appendTo($("select", _$dsel));
							_$opt.val(o.val);
							_$opt.text($fn.getCurLangMsg(o.txt));
							if (o.selected) {
								_$opt.prop("selected", true);
							}
						})

					} else if (_menu.type == "3") {	//Page 호출
						if (_menu.link == "") return true;
						_$div = $("<div class='dwp-lnb-util-area' id='" + _menu.mid + "'></div>").appendTo(_$pdiv);
						_$div.data(_me._CONST._DATA.LNB_ITEM, _menu);
						_$$.util.xAjax({
							url: $dwp.core.util.getProxyUrl(_menu.link)
							, data: { lnbid: _menu.mid, lnbpos: opt.lnbpos }
							, dataType: "html"
							, async: false
							, cache: false
						})
							.done(function (_html) {
								_$div.html(_html);
							});
					} else if (_menu.type == "4") {
						// data tree
					} else if (_menu.type == "5") {  // img
						_$div = $("<div class='dwp-lnb-util-area' id='" + _menu.mid + "'></div>").appendTo(_$pdiv);
						_$div.data(_me._CONST._DATA.LNB_ITEM, _menu);
						var _img_url = $dwp.core.util.getProxyUrl(_menu.datalink);
						var _img_html = "<div class='util-wrap'> <img src='" + _img_url + "' title='" + _menu.htitle + "'   class='dwp-cursor'></div>";
						_$div.html(_img_html);
						_$div.off("click").on("click", function () { _me._act(_menu) });
					}
				});
			}
			function _loadTreeData(_menu) {
				var _child = [];
				_$$.util.xAjax({
					url: $dwp.core.util.getProxyUrl(_menu.datalink)
					, data: { lnbid: _menu.mid }
					, dataType: "json"
					, async: false
					, cache: false
				})
					.done(function (jdata) {
						var _blvl = 0;
						$(jdata).each(function (i, data) {
							if (i == 0) _blvl = parseInt(data._level, 10);
							var _row = {};
							_row.top = _menu.mid;
							_row.key = data._lnbid;
							_row.mid = data._lnbid;
							_row.ftitle = data._title;
							_row.title = $dwp.core.lang.getCurMsg(data._title)
							_row.level = (parseInt(data._level, 10) - _blvl + 1) + _menu.level;
							_row.pid = data._pid;
							_row.link = data._link;
							_row.linktype = data._linktype;
							_row.linkcnt = data._linkcnt;
							_row.subtype = data._subtype;
							_row.type = data._type;
							_row.htitle = data._htitle;
							_row.hlink = data._hlink;
							_row.hlinktype = data._hlinktype;
							_row.lefticon = data._left_icon;
							_row.lefticonfn = data._left_iconfn;
							_row.ismenu = true;
							if (_row.pid == "") {
								_child.push(_row);
							} else {
								var _flag = $dwp.core.util.toTreeData(_row.pid, _child, _row);
								if (!_flag) { _child.push(_row); }
							}
						});
					});
				return _child;
			}
			function _drawTreeMenu(_$par, mid, menudata, opt) {
				var _depth = menudata[0].level
					, _$pdiv = $("<div class='dwp-lnb-depth" + _depth + " tree-type'></div>").appendTo(_$par)
					, _$div = $("<div class='dwp-tree-area'><div id='tree_" + mid + "' class='dwp-tree' style='border:0px'></div></div>").appendTo(_$pdiv);
				//console.log("menudata", menudata);

				//트리 데이타가 없어도 tree 영역을 생성하도록 변경 - 2020.09.18 by dwlee
				if (menudata.length == 1 && menudata[0].key == "null") {
					menudata = [];
				}

				function _onActivate(dtnode) {
					if (!dtnode.tree.isUserEvent()) { return true; }
					dtnode.data.top = mid;
					_me._act(dtnode.data);
				}
				function _onClick(dtnode) {
					if (!dtnode.isActive()) return true;
					_onActivate(dtnode);
				}
				function _onDblClick(dtnode) {
					if (dtnode.data.isFolder) {
						dtnode.toggleExpand();
					}
				}
				var _$tree = $dwp.ui.tree.init($(".dwp-tree", _$div), {
					children: menudata
					, clickFolderMode: 1
					, minExpandLevel: 1
					, onActivate: _onActivate
					, onClick: _onClick
					, onDblClick: _onDblClick
					, onExpand: function (flag, dtnode) {
						$fn.lnbCountRefresh();
					}
					, callback: function (_$tree) {
						if (opt.hasOwnProperty("lnbpos") && opt.lnbpos != "") {
							_dtnode = _$tree.getNode(opt.lnbpos);
							if (_dtnode) { _dtnode.makeVisible(); _dtnode.activate(); }
						}
						//BN만 사용 : 전자결재 > 결재완료/보관함 > 계열사별 트리 접어달라.
						if (mid == "W3523" || mid == "W3524") {
							_$tree.element.closest("div.tree-type").toggleClass("dwp-none");
						}
					}
				});
				// 2020-06-19 By LHJ Tree Node를 한번에 만들도록 변경
				if (_$tree != null) {
					_$tree.getTree().renderInvisibleNodes();
				}
			}
			function _drawQuickMenu(_$par, mid, menudata, opt) {
				var _$quicker = $("a.dwp-quicker-open", _$par);
				var _items = {};

				function _convertData(_menudata, par) {
					$.each(_menudata, function (i, o) {
						par[o.key] = { name: o.title, data: o };

						par[o.key].callback = function (itemkey, opt, e) {
							console.log("itemkey", itemkey);
							console.log("opt", opt);
							console.log("o", o);
							console.log("event", e);
							if (o.link != "") {
								_me._act(o);
							}
						}
						//par[o.key] = { name : o.title, data : o }
						//if (o.link != "") {

						//}
						if (o.hasOwnProperty("children")) {
							par[o.key].selectableSubMenu = true;
							par[o.key].items = {};
							_convertData(o.children, par[o.key].items);
						}
					});
				}

				_convertData(menudata, _items);
				console.log("items", _items);
				_$par.contextMenu({
					selector: "a.dwp-quicker-open",
					trigger: 'left',
					selectableSubMenu: true,
					/*
					callback: function(key, options) {
						console.log(key);
						console.log(options);
					},
					*/
					items: _items
				});
			}

			function _init() {

				_draw();

				_eventInit();

				//var _$lnbwrap = $(".dwp-lnb-wrap", $dwp.core.getLnb());
				if ($("._LNB_NO_SCROLL", _$lnbBody).size() > 0) {
				} else {
					_$lnbBody.mCustomScrollbar({
						theme: 'dark-3',
						scrollbarPosition: "outside",
						autoHideScrollbar: true,
						scrollButtons: { enable: true },
						callbacks: {
							onInit: function () {
								$("div.mCSB_scrollTools_vertical", _$lnbBody).css({ "right": "-3px" });
							}
						}
					});
				}
				//$dwp.ui.scroll($(".dwp-lnb-wrap", $dwp.core.getLnb()));
				//$dwp.ui.nscroll.create($(".dwp-lnb-wrap", $dwp.core.getLnb()));

				//console.log("Init Load");
			}

			_init();
		} // _lnb - E

		, _act: function (opt) {
			var _me = this, _func = null, _fnm = "", _arg = []
				, _opt = $.extend({ link: "", linktype: "", title: "" }, opt);

			if (_opt.link == "" || _opt.linktype == "") return;

			var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;

			function _doit() {
				//var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;
				if (_opt.linktype == "PAGE") {
					if (_envinfo.hasOwnProperty("usetab") && _envinfo.usetab == "1") {
						_me.tab_content(_opt);
					} else {
						_me.content(_opt);
					}
				} else if (_opt.linktype == "WPOP") {
					if ((_opt.link.indexOf("http://") > -1 || _opt.link.indexOf("https://") > -1) && _opt.link.indexOf(window.location.host) == -1) {
						$fn.winopenExt(_opt.link, _opt.title, {});
					} else {
						$fn.winopen(_opt.link, _opt.title);
					}
				} else if (_opt.linktype == "JS") {
					if (_opt.link.indexOf("(") > -1) {
						_fnm = _opt.link.split("(")[0];
						_arg = _$$.util.getMidStr(_opt.link, "(", ")").split(",");
						//for(var i=0; i<_arg.length;i++){_arg[i] = eval(_arg[i]);}
						try {
							for (var i = 0; i < _arg.length; i++) {
								if (_arg[i].indexOf("{") > -1 && _arg[i].indexOf("}") > -1) {
									_arg[i] = JSON.parse(_arg[i]);
								} else {
									_arg[i] = eval(_arg[i]);
								}
							}
						} catch (e) {
							_arg = [];
						}
					} else {
						_fnm = _opt.link;
					}
					_func = _$$.util.getFunction(_fnm);
					if (typeof _func[0] == "function") {
						if (_arg.length > 0) {
							_func[0].apply(_me, _arg);
						} else {
							_func[0](opt);
						}
					}
				}
			}

			if (_opt.hasOwnProperty("ismenu") && _opt.ismenu && _envinfo.usetab != "1") {
				if (_me.isDocEdit({ type: "" }) && _opt.linktype != "WPOP") {
					$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg062") })
						.done(function () { _doit(); });
				} else {
					_doit();
				}
			} else {
				_doit();
			}
		} // _act - E
		// TAB Contents
		, tab_content: function (opt) {
			var _me = this, __$el = $dwp.core.getContent()
				, _$el = null
				, _opt = $.extend({ link: "", linktype: "" }, opt)
				, _vopt, _inst;

			if (_opt.link == "") return;

			// 2020-06-02 By LHJ EDIT
			_me.setPreViewInfo(opt);

			var _tabs = __$el.xtab("instance");
			if (typeof _tabs == "undefined") {
				__$el.empty();
				_tabs = $dwp.ui.tab.init(__$el, $dwp.core.getInfo("tabinfo"));
			} else if (__$el.html() == "") {
				_tabs.destroy();
				_tabs = $dwp.ui.tab.init(__$el, $dwp.core.getInfo("tabinfo"));
			}

			_opt.lnb = $.extend({}, $("div.dwp-lnb-wrap", $dwp.core.getLnb()).data(_me._CONST._DATA.LNB));
			if (_opt.hasOwnProperty("mid") && _opt.mid != "") {
				_opt.lnb.lnbpos = _opt.mid;
			}

			//console.log("Tab Hist", _opt);
			_tabs.addTab(_opt);

			_$$.history.addHistory(_opt);
		} // tab_content - E

		, content: function (opt) {
			var _me = this, __$el = $dwp.core.getContent()
				, _$el = null
				, _opt = $.extend({ link: "", linktype: "" }, opt)
				, _vopt, _inst;

			if (_opt.link == "") return;
			// 2020-06-02 By LHJ EDIT
			_me.setPreViewInfo(_opt);

			__$el.empty();
			_$el = $("<div class='dwp-wrapping'/>").appendTo(__$el);

			function _init() {
				function _jsonGetParmData() {
					var _url = _opt.link;
					return {
						url: $dwp.core.util.getProxyUrl(_url)
						, dataType: "html"
						, async: false
						, cache: false
						, data: {}
					};
				}

				$dwp.core.util.xAjax(_jsonGetParmData())
					.done(function (html) {
						_$el.html(html);
					})
					.fail(function (xhr) {

						//전자메일에서 알림으로 발송된 메일에서 문서 클릭시 백지로 나타나는 현상에 대한 보정 - 2020.09.02 by dwlee
						if (xhr.status == 404) {
							if (_opt.isbridge) {
								$fn.alert({ msg: "삭제되었거나 이미 처리된 문서입니다." })
									.done(function () {
										window.close();
									});
							} else {
								$fn.alert({ msg: "문서 열람권한이 없습니다.<br>기안자에게 열람권한을 요청하시기 바랍니다." });
							}
						} else if (xhr.status == 500) {
							if (_opt.isbridge) {
								$fn.alert({ msg: "서버에서 오류가 발생하였습니다. 관리자에게 문의하시기 바랍니다." })
									.done(function () {
										window.close();
									});
							} else {
								$fn.toast({ msg: "서버에서 오류가 발생하였습니다. 관리자에게 문의하시기 바랍니다." });
							}
						}
					});
			}
			_init();

			_opt.lnb = $.extend({}, $("div.dwp-lnb-wrap", $dwp.core.getLnb()).data(_me._CONST._DATA.LNB));

			if (_opt.hasOwnProperty("mid") && _opt.mid != "") {
				_opt.lnb.lnbpos = _opt.mid;
			}
			_$$.history.addHistory(_opt);
		}// content - E

		, setPreViewInfo: function (opt) {
			var _$el = _$$.getContent()
				, _vopt, _inst;

			_inst = $fn.getInstance("view");
			if (_inst != undefined) {
				_vopt = $.extend({}, _inst.options);
				_$el.data("dwp-vopt", _vopt);
			}
			// 2020-06-02 By LHJ EDIT
			_$el.data("dwp-act", opt);
			/*
			if($("div.dwp-wrapping", _$el).size() > 0) {
				_inst = $("div.dwp-wrapping", _$el).view("instance")
				if (_inst) {
					_vopt = $.extend({}, _inst.options);
					_$el.data("dwp-vopt", _vopt);
				}
			}
			*/
		}// setPreViewInfo - E
		// 2020-06-02 By LHJ EDIT
		, getPreActInfo: function () {
			var _$el = _$$.getContent();
			return _$el.data("dwp-act");
		}
		, getPreViewInfo: function () {
			var _$el = _$$.getContent()
				, _vopt = _$el.data("dwp-vopt");

			return _vopt;
		}// getPreViewInfo - E

		, setDocPreViewInfo: function (opt) {
			var _$el = _$$.getContent()
				, _vopt = $.extend({}, opt), _inst;

			_$el.data("dwp-vdopt", _vopt);
		}// setDocPreViewInfo - E

		, getDocPreViewInfo: function () {
			var _$el = _$$.getContent()
				, _vopt = $.extend({}, _$el.data("dwp-vdopt"));

			_$el.removeData("dwp-vdopt");

			return _vopt;
		}// getDocPreViewInfo - E

		// LNB Select Menu
		, getMSelVal: function (code) {
			var _me = this
				, _$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb())
				, _$item = $("div.dwp-lnb-item[id=" + code + "]", _$lnbBody);

			if (_$item.size() > 0) {
				if ($("select", _$item).size() > 0) {
					return $("select", _$item).xval();
				}
			}
			return "";
		} // getMSelVal - E

		, lnbCallback: function (lnbid, callback) {
			if (typeof callback != "function") return;
			var _$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());

			callback($("#" + lnbid, _$lnbBody));
		}// lnbCallback - E

		// 사이트 및 회사권한 체크(false : 권한없음)
		, siteComAuthCheck: function (data) {
			// 2019-10-01 By LHJ ADD Site 권한체크
			if (data.hasOwnProperty("_site") && data._site != "") {
				if (data._site.indexOf(window.location.hostname.toLowerCase()) == -1) { return false; }
			}
			if (data.hasOwnProperty("_authcom") && data._authcom != "") {
				//회사코드정보 변경 - 2019-04-04 By LHJ
				//if(data._authcom.indexOf($fn.getCurUser().pinfo.comcode) == -1){return true;}
				if (data._authcom.indexOf($fn.getComCode()) == -1) { return false; }
			}
			return true
		}

		// 편집 중인 문서 존재여부체크
		, isDocEdit: function (opt) {
			var _rtnval = false
				, _opt = $.extend({ type: "new" }, opt)
				, _doc = $fn.getInstance("doc", opt.target);

			if (_doc == undefined) {
				_doc = $fn.getInstance("doc", undefined, { type: "preview" });
				if (_doc == undefined) {
					if (_opt.type == "new") {
						$("div.dwp-xdialog").each(function () {
							if ($(this).is("[id]")) {
								_doc = $("#" + $(this).attr("id")).doc("instance");
								//console.log("2", _doc)
								if (_doc == undefined) { return true; }
								if (_doc.options.hasOwnProperty("is_not_editchk") && _doc.options.is_not_editchk) { return true; }
								else if (_doc.options.isedit) { _rtnval = true; return false; }
							}
						})
					}
				} else {
					if (_doc.options.hasOwnProperty("is_not_editchk") && _doc.options.is_not_editchk) { _rtnval = false; }
					else if (_doc.options.isedit) { _rtnval = true; }
				}
			} else {
				if (_doc.options.hasOwnProperty("is_not_editchk") && _doc.options.is_not_editchk) { _rtnval = false; }
				else if (_doc.options.isedit) { _rtnval = true; }
			}
			return _rtnval;
		}// isDocEdit - E

		/**
		 * 서브포탈이동
		 */
		, goSubPortal: function (opt) {
			var _me = this
				, _opt = $.extend({ gid: "" }, opt)
				, _rtn = false;

			$dwp.core.util.xAjax({
				url: $dwp.core.getPath("menu") + "/api/data/collections/name/wvlink"
				, dataType: "json"
				, async: true
				, cache: false
				, data: { category: _opt.gid }
			}).done(function (jdata) {
				$(jdata).each(function (i, data) {
					if (data._issubportal == "1") {
						data.gid = data._mid;
						data.linktype = data._linktype;
						data.link = data._link;
						_me._convertDisp('S');
						_me.subPortalInit(data);
					} else {
						if (typeof _opt.callback == "function") {
							_opt.callback();
						}
					}
				});
			});
		}// goSubPortal - E

		/**
		 * 메뉴이동함수
		 * @param	{obj}	opt
		 */
		, goMenu: function (opt) {
			var _me = this
				, _opt = $.extend({ gid: "" }, opt);

			function _go() {
				_me._convertDisp('M');
				_me.subInit(_opt);
			}
			if (_opt.gid.charAt() == "M" || _opt.gid.charAt() == "L") {
				if (_opt.gid.charAt() == "M") {
					_opt.callback = function () { _go(); }
					_me.goSubPortal(_opt);
				} else {
					_go();
				}
			}
		} // goMenu - E

		// 전체 포틀릿 정보 Set
		, setPortletInfos: function (appinfos, userinfos) {
			var _me = this;

			//if ( $.isArray(appinfos) ) { _me._CONST._DATA.PORTLET_INFO.appinfos =  appinfos;}
			if ($.isArray(appinfos)) {
				var _appinfos = [];
				$.each(appinfos, function (i, _o) {
					// 2019-10-01 By LHJ ADD Site 권한체크
					if (!_$$.portal.siteComAuthCheck(_o)) { return true; }
					_appinfos.push(_o);
				});
				_me._CONST._DATA.PORTLET_INFO.appinfos = _appinfos;
			}

			if ($.isArray(userinfos)) { _me._CONST._DATA.PORTLET_INFO.userinfos = userinfos; }
		} // setPortletInfos - E
		// 전체 포틀릿 정보 Get
		, getPortletInfos: function () {
			var _me = this;

			return $.merge($.merge([], _me._CONST._DATA.PORTLET_INFO.appinfos), _me._CONST._DATA.PORTLET_INFO.userinfos);
		} // getPortletInfos - E

		// 문서 열기
		, openDocument: function (o, opt) {
			var _h = ($fn.getScreenInfo().doc_h * 1);
			var _opt = $.extend({
				title: ""
				, type: "doc"
				, width: "800"
				, height: _h
				, modal: true
				, islangconvert: false
				, content: { html: "", url: "", data: {} }
				//,initcallback : function(_$dialog) {
				//	$dwp.core.portal.contextMenu.on(_$dialog.element);
				//}
			}, opt)
				, _url = "";

			if (typeof o == "object") {
				if (!o.hasOwnProperty("@href")) return;
				_url = o["@href"].replace(/\/api\/data\/collections\/name/, "").replace(/\/unid/, "") + "?opendocument";
				_opt.content.url = _$$.util.getProxyUrl(url);

				if (o.hasOwnProperty("_subject")) _opt.title = o["_subject"];
			} else {
				try {
					_opt.content.url = _$$.util.getProxyUrl(o);
				} catch (e) {
					_opt.content.url = o;
				}
			}
			if (_opt.hasOwnProperty("isportal") && _opt.isportal) {
				_opt.content.data.portal = "1";
			}

			$fn.dialog(null, _opt);
		} // openDocument - E

		/**
		 * 팝업공지 처리 - 공지사항
		 */
		, popupInit: function () {
			var _me = this
				, _url = "/dwp/com/bbs/popupindexDB.nsf/api/data/collections/name/useview?count=5";

			$dwp.core.util.xAjax({
				url: _url
				, dataType: "json"
				, async: true
				, cache: false
				, data: {}
			}).done(function (jdata) {
				var _cdate = moment()
					, _date = _cdate.format("YYYY-MM-DD");
				$.each(jdata, function (i, o) {
					if (_date >= o._fromdate && _date <= o._todate) {
						var _cookienm = "DWP_VDAY_" + o._unid;
						// console.log("cookie", $.cookie(_cookienm))
						if ($.cookie(_cookienm) != "hide") {
							var _url = "/" + o._dbpath + "/0/" + o._unid + "?opendocument&vday=1";
							$fn.winopen(_url, o._subject, {});
						}
					}
				});
			});
		}
		/**
		 * 팝업공지 처리
		 */
		, popupAdmin: function () {
			var _me = this
				, _dbpath = "/dwp/com/sys/popnotice.nsf"
				, _url = _dbpath + "/api/data/collections/name/wvportal?count=10";

			$dwp.core.util.xAjax({
				url: _url
				, dataType: "json"
				, async: true
				, cache: false
				, data: {}
			}).done(function (jdata) {
				$.each(jdata, function (i, o) {
					//if (o.hasOwnProperty("_comcode") && o._comcode != "" && o._comcode.indexOf($fn.getComCode()) == -1 ) return true;
					// 2019-10-01 By LHJ Site, Com AuthCheck
					if (!_$$.portal.siteComAuthCheck(o)) { return true; }

					var _cookie = $.cookie("DWP_POP_" + o._unid);
					if (_cookie != null && _cookie == "no") return true;

					/*
					var _purl = _dbpath +"/prevpop?OpenForm&uid="+o._unid+"&height="+o._height
					, _height = parseInt(o._height)+35
					, _width = parseInt(o._width)+6
					, _status = "width="+_width+", height="+_height+", top="+ (screen.height-_height)/2 + ", left=" + (screen.width-_width)/2 + ", menubar=no, resizable=no";

					tempWin = window.open(_purl, "_blank", _status);
					*/
					var _url = _dbpath + "/wvall/" + o._unid + "?OpenDocument&height=" + o._height;
					var _height = parseInt(o._height) + 35;
					var _width = parseInt(o._width) + 6;
					var _top = (screen.height - _height) / 2;
					var _left = (screen.width - _width) / 2;

					$fn.winopen(_url, "DWP_POP_" + o._unid, { width: _width, height: _height, top: _top, left: _left, menubar: "no", resizable: "no" });
				});
			});
		} // popupAdmin - E

		, logOut: function (opt) {
			var _me = this
			_opt = $.extend({ isconfirm: false }, opt);

			if (_opt.isconfirm) {
				$fn.confirm({ msg: $fn.getCodeMsg("로그아웃하시 겠습니까?") })
					.done(function () { _doit(); });
			} else {
				_doit();
			}

			function _doit() {
				var _webchathost = $fn.getSysinfo().webchathost
				// WebChatting Logout
				if (_webchathost != "") {
					if ($("iframe[name=_WEB_CHAT]").size() > 0) {
						var _$targetWindow = $("iframe[name=_WEB_CHAT]").get(0).contentWindow;
						$dwp.app.winPost.sendWebChatMessage(_$targetWindow, { event: 'logout', data: {} });
					}
				}
				// 그룹웨어 로그아웃처리
				location.href = '/names.nsf?logout';
			}

		}
		// moveGnb - S
		, moveGnb: function (callback) {
			var _me = this;
			if ($dwp.core.portal.isDocEdit({ type: "new" })) {
				$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg062") })
					.done(function () {
						if (typeof callback == "function") {
							callback();
						}
					});
			} else {
				if (typeof callback == "function") {
					callback();
				}
			}
		}
		// moveGnb - E
		// contextMenu - S
		, contextMenu: {
			on: function (el) {
				var _$el = typeof (el) == "undefined" ? $(document) : $(el);
				_$el.off("contextmenu").on("contextmenu", function (e) {
					return false;
				});
			}
			, off: function (el) {
				var _$el = typeof (el) == "undefined" ? $(document) : $(el);
				_$el.off("contextmenu");
			}
		}
		/**
		 * Visual 영역 초기화 처리
		 */
		, visualInit: function (callback) {
			var _me = this
				, _$visualst = $('.dwp-main-visual .visual-state')
				, _$inner = $('.dwp-main-visual .inner')
				, _$slider = $('.slider', _$inner)
				, _$txtarea = $('.txt-area', _$inner)
				, _$banner = $('.main-banner', _$inner);

			if (_$visualst.size() == -1) return;

			/* visual 영역 */
			if (_$slider.size() == 0) {
				_$slider = $("<div class='slider'></div>").appendTo(_$inner);
			}
			if (_$txtarea.size() == 0) {
				_$txtarea = $("<div class='txt-area'></div>").appendTo(_$inner);
			}
			//2019-12-01 By LHJ
			//if (_$banner.size() == 0) {
			//	_$banner = $("<div class='main-banner'></div>").appendTo(_$inner);
			//}

			var _h = "<div class='subject'></div>";
			_h += "<div class='read-more' style='display:none;'><a>Read More";
			_h += "<span class='lines'>";
			_h += "<span class='line1'></span><span class='line2'></span><span class='line3'></span><span class='line4'></span>";
			_h += "</span></a></div>";
			_$txtarea.html(_h);
			//_$txtarea.html('');

			// visual data가져오기
			var _slidecount = 0;
			$dwp.core.util.xAjax({
				url: "/dwp/com/portal/keymsg.nsf/api/data/collections/name/wvportal?count=99"
				, dataType: "json"
				, async: true
				, cache: false
				, data: {}
			}).done(function (jdata) {
				$.each(jdata, function (i, _o) {
					if (_o.hasOwnProperty("_authcom") && _o._authcom != "" && _o._authcom.indexOf($fn.getComCode()) == -1) return true;
					var _imgurl = _o._imageurl;
					var _$item = $("<div class='slider-item slick-slide'><img src='" + _imgurl + "' style='width:900px;height:245px;'/></div>").appendTo(_$slider);

					_$item.data("item-node", _o);
					//_$item.attr({"data-applcode": _o._applcode,"data-msg" : _o._keymessage, "data-url" : _o._docurl, "data-cardurl" : _o._cardurl});
					if (_o._fontstyle != "") {
						$("img", _$item).addClass(_o._fontstyle);
					}
					if (i == 0) {
						_$txtarea.addClass(_o._fontstyle);
						$(".subject", _$txtarea).html(_o._keymessage);
						//_$inner.append("<div name='_IMG_CACHE' style='display:none'><img src='" + _imgurl + "'/></div>")
					} else {

					}
					_slidecount++;
				});

				if (jdata.length == 0) return;
				/*
				var _imgcount = $("img[src]", _$slider).size();
				$("img[src]", _$slider).on("load", function(){
					_imgcount--;
				});

				function _init() {
					if (_imgcount > 0) {setTimeout(function(){ _init()}, 10); return}
					_initSlider();
					$($("img[src]", _$slider).get(0)).addClass("dwp-keymsg-zommin");
					if (typeof callback == "function") {
						callback();
					}
				}

				_init();
				*/

				$("img[src]", _$slider).get(0).onload = function () {
					_initSlider();
					$(this).addClass("dwp-keymsg-zommin");
					if (typeof callback == "function") {
						callback();
					}
				}

				//$("div.slider-item", _$slider).show();
				//setTimeout(_initSlider, 0);

				/* visual 여닫기 */
				$('.main-visual-toggler a').on('click', function (e) {
					if ($(this).parent().hasClass("active")) {
						_me._convertVisual(true);
					} else {
						_me._convertVisual(false);
					}
					e.preventDefault();
				});

				function _initSlider() {
					//setTimeout(function(){
					_$slider.slick({
						variableWidth: true,
						centerMode: true,
						arrows: true,
						slideToShow: 1,
						lazyLoad: 'progressive',
						lazyLoadBuffer: 1,
						infinite: true,
						focusOnSelect: true,
						autoplay: true,
						autoplaySpeed: 7000
					})
						.attr("isslick", "true");

					//_$slider.slick('slickGoTo', 0);

					$(".count", _$visualst).html('<span class="point-color">1</span> / ' + _slidecount);

					/* key message 변환 */
					_$slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
						var i = (currentSlide ? currentSlide : 0) + 1;
						$(".count", _$visualst).html('<span class="point-color">' + i + '</span> / ' + slick.slideCount);
						$(".btn-share", _$visualst).off('click').on("click", function () {
							var _bookobj = {}, _bookinfo = ""
								, _data = $(slick.$slides.get(currentSlide)).data("item-node");

							_bookobj.Type = "0";
							_bookobj.ApplCode = _data._applcode;
							_bookobj.R_UNID = _data._unid;
							_bookobj.R_KEY_UNID = _data._key_unid;
							_bookobj.R_DBPATH = "/" + _data._cdb;
							_bookobj.R_LINK = _data._docurl;

							_bookinfo = $dwp.core.util.getObjStr($dwp.core.doc._CONST.BOOKMARK_MAP, _bookobj, "`}").fullinfo;

							$dwp.ui.shareddoc($(this), { bookinfo: _bookinfo, ismobile: false });
						});

					});
					_$slider.on('init reInit beforeChange', function (event, slick, currentSlide, nextSlide) {
						$("img", $(slick.$slides.get(currentSlide))).removeClass("dwp-keymsg-zommin");
						$("img", $(slick.$slides.get(nextSlide))).addClass("dwp-keymsg-zommin");
						var color = $(slick.$slides.get(nextSlide)).find("img").attr("class");
						var _data = $(slick.$slides.get(nextSlide)).data("item-node");

						//var link = $(slick.$slides.get(nextSlide)).attr("data-url");
						//var msg = $(slick.$slides.get(nextSlide)).attr("data-msg");

						$(".subject", _$txtarea).html(_data._keymessage);
						$(".read-more", _$txtarea).attr("data-link", _data._docurl);
						_$txtarea.removeClass("light dark");
						_$txtarea.addClass(color);
					});
					$(".read-more", _$txtarea).off('click').on('click', function (e) {
						var link_ = $(this).attr("data-link");
						var title_ = $(".subject", _$txtarea).text();
						$fn.openDocument(link_, { title: title_, isportal: true, width: 800, dialogClass: 'titleless memo-type' });
					});
					/* visual 자동재생 버튼 */
					$(".btn-auto", _$visualst).off('click').on("click", function () {
						$(this).toggleClass("active");
						if ($(this).hasClass("active")) {
							_$slider.slick("slickPause");
						} else {
							_$slider.slick("slickPlay");
						}
					});
				};
				//	}, 50);
			});
		}

		, getHostCom: function (comcode) {
			var _cominfo = $dwp.core.getSysinfo().cominfo
				, _curuser = $dwp.core.getCurUser()
				, _comcode = (typeof comcode == "undefined" ? _curuser.pinfo.comcode : comcode);
			/*
			var _comlist = $.grep(_cominfo, function(o, i){
				 if(_comcode == o.comcode) { return o;}
				  });
			return _comlist;
			*/
			if (_cominfo.hasOwnProperty(_comcode)) {
				//return $.extend({comcode : _comcode}, _cominfo[_comcode]);
				return _cominfo[_comcode];
			}
			return {};
		}
	};
	// _$$.portal - E
})($dwp.cns("core"), jQuery);










