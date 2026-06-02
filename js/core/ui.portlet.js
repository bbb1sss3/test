/**
 * <b>Portlet 라이브러리</b>
 * <br>Portlet Widget를 정의합니다.
 * @module core/ui/portlet
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.ui.portlet|core.ui.portlet}
 */
(function (/** @lends	module:core~$dwp.core.ui */_$$, $) {
	/**
	 * Portlet Widget처리 모듈
	 * @namespace
	 */
	_$$.portlet = {
		_MODULE_NM: "dwp.portlet"
		, _CONST: {
		}
		, init: function (el, opt) {
			var _$el = (el == null ? $('<div class="component-control grid-stack-item"></div>') : $(el))
				, _opt = $.extend({ appinfo: {} }, opt);

			if (_opt.hasOwnProperty("quickmode") && _opt.quickmode) { _opt.isquick = true; _opt.quickmode = false; }

			if ($.isEmptyObject(_opt.appinfo)) {
				if (_opt.hasOwnProperty("appinfos")) {
					_opt.appinfo = this._findApp(_opt.appinfos, _opt.id);
				}
			}

			if (!$.isEmptyObject(_opt.appinfo)) {
				console.log("_opt.appinfo", _opt.appinfo);
				if (_opt.appinfo._apptype == "4" && _opt.appinfo._apptabdata != "") {
					_opt.tabinfo = [];
					var _tablist = _opt.appinfo._apptabdata.split(";");
					for (var i = 0; i < _tablist.length; i++) {
						var _cell = _tablist[i].split("†");
						var _tabinfo = this._findApp(_opt.appinfos, _cell[1]);
						if (!$.isEmptyObject(_tabinfo)) {
							_tabinfo._title = _cell[0];
							_opt.tabinfo.push(_tabinfo);
						}
					}
					console.log("tabinfo", _opt.tabinfo);
				}
			}
			/*
			if (_opt.hasOwnProperty("appinfos")) {
				_opt.appinfo = this._findApp(_opt.appinfos, _opt.id);
				// 2019-10-01 By LHJ ADD User TAB
				if (_opt.appinfo._apptype == "4" && _opt.appinfo._apptabdata != "") {
					_opt.tabinfo = [];
					var _tablist = _opt.appinfo._apptabdata.split(";");
					for(var i=0; i < _tablist.length; i++) {
						var _cell = _tablist[i].split("†");
						var _tabinfo = this._findApp(_opt.appinfos, _cell[1]);
						if (!$.isEmptyObject(_tabinfo)) {
							_tabinfo._title = _cell[0]; 
							_opt.tabinfo.push(_tabinfo);
						}
					}
					console.log("tabinfo", _opt.tabinfo);
				}
			}			
			*/
			if (typeof $.fn.portlet == "undefined") {
				this._create();
			}
			_$el.portlet(_opt);

			return _$el.portlet("instance");
		}
		, _findApp: function (appinfos, id) {
			var _appinfo = {};
			$.each(appinfos, function (i, appinfo) {
				if (id == appinfo._code) {
					_appinfo = appinfo; return false;
				}
			});
			return _appinfo;
		}
		// Portlet Widget Create
		, _create: function () {
			var _me = this;
			$.widget(_me._MODULE_NM, {
				options: {
					id: ""					//	Portlet ID
					, title: ""				//	제목
					, mode: "C"				//	포틀릿 유형
					, grid: null			//	Grid Object
					, isedit: false			//	편집모드여부
					, isquick: false		//	포탈설정에 표시되는 경우
					, ispreview: false		//	미리보기(Event 처리 안함)
					, layoutinfo: {}		//	Layout Info
					, appinfo: {}			//  포틀릿 정보	
					, tabinfo: []			//	Tab 정보				
				}
				// init  - Start
				, _init: function () {
					var _me = this

					_me.element.attr("id", _me.options.id);
					_me._drawPortlet();
				}
				// init  - End
				, _drawPortlet: function () {
					var _me = this
						, _h = "";

					_h = '<div class="grid-stack-item-content">';
					if (_me.options.appinfo._appdisptype == "2" && !_me.options.isquick) {
						_h += '<div class="dwp-portlet" style="height:100%;background-color:transparent">';
					} else {
						_h += '<div class="dwp-portlet" style="height:100%">';
					}
					_h += '<div class="fold' + (_me.options.ispreview ? ' dwp-none' : '') + '">';
					//_h += '<img src="' + $fn.getPath('weblib') + _me.options.appinfo._appicon + '" class="icon" alt="">' + $fn.getCurLangMsg(_me.options.appinfo._title);
					_h += '<span class="dwp-portlet-icon ' + _me.options.appinfo._appicon + '" style="display:block;margin:auto;"></span>' + $fn.getCurLangMsg(_me.options.appinfo._title);
					_h += '</div>';
					_h += '<div class="unfold" style="height:100%;">';

					// 2019-10-01 By Add LHJ Header 표시여부 체크
					if (_me.options.appinfo._appdisptype == "2" && !_me.options.isquick) {
						_h += '<div class="portlet-head" style="display:none;"></div>';
						_h += '<div class="portlet-body" style="height:100%;">';
						_h += '<div class="portlet-util"></div>';
						_h += '</div>';
					} else {
						_h += '<div class="portlet-head">';

						// 2019-12-01 By LHJ App ICon 표시 제외
						//if (_me.options.appinfo._appicon == "") {
						_h += '<div class="portlet-heading portlet-heading-border portlet-drag">' + $fn.getCurLangMsg(_me.options.appinfo._title) + '</div>';
						//} else {		        			
						//	_h += '<div class="portlet-heading portlet-heading-border portlet-drag"><span class="dwp-portlet-icon ' + _me.options.appinfo._appicon + '"></span>' + $fn.getCurLangMsg(_me.options.appinfo._title) + '</div>';
						//}
						_h += '<div class="portlet-util">';

						if (_me.options.mode == "S") {
							_h += '<a name="_PREVIEW"><img src="' + $fn.getPath('weblib') + '/images/common/icon-portlet-preview.svg"></a>';
							_h += '<a name="_CLOSE"><img src="' + $fn.getPath('weblib') + '/images/common/btn-icon-close.png"></a>';
						} else {
							_h += '<a name="_RELOAD"><img src="' + $fn.getPath('weblib') + '/images/common/icon-refresh.svg"></a>';
							if (_me.options.appinfo._appmore && _me.options.appinfo._apptype != "4") {
								_h += '<a name="_MORE"><img src="' + $fn.getPath('weblib') + '/images/common/icon-go.svg"></a>';
							}
							if (_me.options.mode == "P" && _me.options.isedit) {
								_h += '<a name="_CLOSE"><img src="' + $fn.getPath('weblib') + '/images/common/btn-icon-close.png"></a>';
							}
						}
						_h += '</div>';
						_h += '</div>';

						_h += '<div class="portlet-body" style="height:calc(100% - 45px);"></div>';
					}

					_h += '</div>';
					_h += '</div>';
					_h += '</div>';

					_me.element.html(_h);

					if (!_me.options.ispreview) {
						$("[name=_RELOAD]", _me.element).off("click").on("click", function () {
							_me.reload();
						});

						$("[name=_MORE]", _me.element).off("click").on("click", function () {
							if (_me.options.appinfo._appmoretype == "1") {
								$dwp.core.portal.goMenu({ gid: _me.options.appinfo._appmore });
							} else {
								var _arg = [], _appmore = _me.options.appinfo._appmore;
								if (_appmore.indexOf("(") > -1) {
									_fnm = _appmore.split("(")[0];
									_arg = $dwp.core.util.getMidStr(_appmore, "(", ")").split(",");
									for (var i = 0; i < _arg.length; i++) { _arg[i] = eval(_arg[i]); }
								} else {
									_fnm = _appmore;
								}
								_func = $dwp.core.util.getFunction(_fnm);
								if (typeof _func[0] == "function") {
									if (_arg.length > 0) {
										_arg.push($(this));
										_arg.push(_me);
										_func[0].apply(null, _arg);
									} else {
										_func[0]($(this), _me);
									}
								}
							}
						});

						$("[name=_CLOSE]", _me.element).off("click").on("click", function () {
							//_me.options.grid.removeWidget(_me.element);
							_me.options.grid.removeWidget(_me.element.get(0));
						});

						$("[name=_PREVIEW]", _me.element).off("click").on("click", function () {
							$fn.dialog(null, {
								title: $fn.getCurLangMsg(_me.options.appinfo._title)
								, width: 420
								, height: 500
								, modal: true
								, draggable: false
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, resizable: false
								, content: { html: "", url: "" }
								, initcallback: function (_$dialog) {
									var _h = '<div class="component-control" id="' + _me.options.id + '"></div>';
									var _$portlet = $(_h).appendTo(_$dialog.element)
									$dwp.ui.portlet.init(_$portlet, { id: "V_" + _me.options.id, grid: null, mode: "P", isedit: false, layoutinfo: {}, appinfo: _me.options.appinfo, appinfos: _me.options.appinfos, ispreview: true });
								}
							});
						});
					}

					if (!$.isEmptyObject(_me.options.appinfo) && !_me.options.isquick) {
						_me._portletbody();
					} else if (!$.isEmptyObject(_me.options.layoutinfo) && _me.options.isquick) {
						$("div.portlet-body", _me.element).html("<div class='dwp-center' style='position:relative;top:50%;left:50%;transform:translate(-50%, -50%);font-size:11pt;color:#ed6c00'>" + _me.options.layoutinfo.w + " x " + _me.options.layoutinfo.h + "</div>");
					}
				}
				, _portletbody: function () {
					var _me = this
						, appinfo = _me.options.appinfo
						, _$main = $("div.dwp-portlet", _me.element)
						, _$body = $("div.portlet-body", _me.element)
						, _$content = $("<div class='" + (appinfo._appcss == "" ? "dwp-portlet-content" : appinfo._appcss) + "' style='height:100%;'></div>").appendTo(_$body);

					//_me.block();					

					if (appinfo._isconst == "1") {
						var _msg = $fn.getCodeMsg(appinfo._constmsg == "" ? "portal.msg.const" : appinfo._constmsg);
						var _h = "<div style='height:100%;text-align:center'><span style='display:inline-block;margin-top:25px;'>" + _msg + "</span></div>";

						_$content.html(_h);

						//_me.unblock();

						return;
					}
					if (appinfo._apptype == "1") {			// List형
						_me.block();
						if (appinfo.hasOwnProperty("_applink") && appinfo._applink != "" && appinfo.hasOwnProperty("_appjtl") && appinfo._appjtl != "") {
							$.when(
								$dwp.core.util.xAjax({
									url: $dwp.core.util.getProxyUrl(appinfo._applink)
									, dataType: "json"
									, async: true
									, cache: false
									, data: {}
								})
								, $dwp.core.util.xAjax({ url: $dwp.core.util.getProxyUrl(appinfo._appjtl), dataType: "text", async: true, cache: true })
							).done(function (xhr1, xhr2) {
								var _json = {};
								_json.target = _$body;
								_json.data = xhr1[0];


								if (_json.data.length > 0) {
									// Data Convert 처리하기
									if (appinfo.hasOwnProperty("_appconvert") && appinfo._appconvert != "") {
										_func = $dwp.core.util.getFunction(appinfo._appconvert);
										if (typeof _func[0] == "function") {
											_json.data = _func[0](_json.data);
										}
									}

									$.each(_json.data, function (i, _item) {
										_item.unid = _item["@unid"];

										_item.isattach = (_item.hasOwnProperty("_attachinfo") && _item._attachinfo != "") ? true : false;
										_item.isstarred = (_item.hasOwnProperty("_isstarred") && _item._isstarred == "1") ? true : false;
										_item.islikecnt = (_item.hasOwnProperty("_likecnt") && _item._likecnt != "") ? true : false;
										_item.isreplycnt = (_item.hasOwnProperty("_isallowreply") && _item._isallowreply == "1" && _item.hasOwnProperty("_replycnt") && _item._replycnt != "") ? true : false;
										_item.created = $dwp.core.util.formatDateTime(_item._created, "relative1");

										if (_item.hasOwnProperty("_docurl") && !_item.hasOwnProperty("_openurl")) {
											_item._openurl = _item._docurl;
										}
										if (_item.hasOwnProperty("_authorempno") && _item._authorempno != "") {
											_item.pic = $dwp.core.getPath("pic", { empno: _item._authorempno });
										}
										_item.rowdata = JSON.stringify(_item);
									});

									var _html = $dwp.core.jsonToHtml.convert(_json, xhr2[0]);
									_$content.html("<div class='scrolling-area' style='height:100%;'>" + _html + "</div>");

									$fn.convertLangPage({}, _$content);

									//Event 처리하기
									$("[data-unid]", _$content).each(function (i, _o) {
										var _item = $(this).data();
										// 문서 오픈하기
										$("._link", this).off("click").on("click", function () {
											var _opt = {
												title: _item.rowdata._subject
												, isportal: true
												, width: ($fn.getScreenInfo().doc_w * 0.8)
												, dialogClass: 'memo-type'
											};

											//설정에서 읽어오는 방식으로 변경 - 2020.06.18 by dwlee
											if (_me.options.appinfo.hasOwnProperty("_refresh") && _me.options.appinfo._refresh == "1") {
												//if (_me.options.id == "P0001") {
												_opt.initcallback = function () {
													_me.reload();
												};
											}
											$fn.openDocument(_item.rowdata._openurl, _opt);
										});
										// 첨부파일 열기
										if (_item.rowdata.hasOwnProperty("_attachinfo") && _item.rowdata._attachinfo != "") {
											var _opt = {
												ismobile: false
												, applcode: ""
												, cdb: ""
												, svrnm: ""
												, title: $dwp.core.lang.getCodeMsg("comm.title.js012")
												, _attachinfo: _item.rowdata._attachinfo
											};
											$(".bookmark", this).off("click").on("click", function () {
												$dwp.ui.filedailog.init($(this), _opt);
											});
										}

										// 사용자 정보 링크
										$fn.getPicError($("div.dwp-user img", this));
										$("div.dwp-user", this).off("click").on("click", function () {
											$dwp.ui.bizcard.init($(this));
										});

										// 기타 Event 처리하기
										if (appinfo.hasOwnProperty("_appevent") && appinfo._appevent != "") {
											var _arg = [];
											if (appinfo._appevent.indexOf("(") > -1) {
												_fnm = appinfo._appevent.split("(")[0];
												_arg = $dwp.core.util.getMidStr(appinfo._appevent, "(", ")").split(",");
												for (var i = 0; i < _arg.length; i++) { _arg[i] = eval(_arg[i]); }
											} else {
												_fnm = appinfo._appevent;
											}
											_func = $dwp.core.util.getFunction(_fnm);
											if (typeof _func[0] == "function") {
												if (_arg.length > 0) {
													_arg.push($(this));
													_arg.push(_item);
													_arg.push(_me);
													_func[0].apply(null, _arg);
												} else {
													_func[0]($(this), _item, _me);
												}
											}
										}
									});

									$('.scrolling-area', _$body).mCustomScrollbar({
										theme: 'dark-3',
										scrollbarPosition: "outside",
										autoHideScrollbar: true,
										scrollButtons: { enable: true }
									});
								} else {
									_html = '<div class="dwp-no-result center">';
									_html += '<img src="' + $fn.getPath('weblib') + '/images/common/icon-no-result.svg" alt="">';
									_html += $fn.getCodeMsg('portal.msg.rst_nodata');
									_html += '</div>';
									_$content.html("<div class='scrolling-area' style='height:100%;position:relative;'>" + _html + "</div>");
								}

								_me.unblock();
							})
								.fail(function () {
									_me.unblock();
								});
						}
					} else if (appinfo._apptype == "2") {		// html

						_me.block();

						if (_me.options.appinfo._appdisptype == "2" && !_me.options.isquick) {
							_$content.html("<div class='scrolling-area' style='height:100%;padding:0px;'></div>");
						} else {
							_$content.html("<div class='scrolling-area' style='height:100%;'></div>");
						}

						if (appinfo.hasOwnProperty("_applink") && appinfo._applink != "") {
							$dwp.core.util.xAjax({
								url: $dwp.core.util.getProxyUrl(appinfo._applink)
								, dataType: "html"
								, async: true
								, cache: false
								, data: { pid: _me.options.id }
							}).done(function (html) {
								$(".scrolling-area", _$content).html(html);

								$('.scrolling-area', _$body).mCustomScrollbar({
									theme: 'dark-3',
									scrollbarPosition: "outside",
									autoHideScrollbar: true,
									scrollButtons: { enable: true }
								});
								_me.unblock();
							})
								.fail(function () {
									_me.unblock();
								});
						}
					} else if (appinfo._apptype == "3") {		// iframe
						_me.block();
						if (appinfo.hasOwnProperty("_applink") && appinfo._applink != "") {
							var _h = "<div style='height:100%;'><iframe src='" + appinfo._applink + "' frameborder=0 style='width:100%;height:100%;'></div>";
							var _$div = $(_h).appendTo(_$content);
							$("iframe", _$div).off("load").on("load")
						}
						_me.unblock();
					} else if (appinfo._apptype == "4") {		// Tab
						//_$content.html("<div class='scrolling-area' style='height:100%;'></div>");

						var _$util = $('<div class="portlet-util"></div>').appendTo(_$body);

						var _h = "<div class='dwp-tabs-simple scrolling-area' style='height:100%;overflow-y:hidden;'><ul class='portlet-drag'></ul></div>";
						var _$tabs = $(_h).appendTo(_$content);
						var _$ul = $("ul", _$tabs);

						for (var i = 0; i < _me.options.tabinfo.length; i++) {
							var _item = _me.options.tabinfo[i];
							var _$li = $("<li><a><span>" + $fn.getCurLangMsg(_item._title) + "</span></a></li>").appendTo(_$ul);

							var _applink = $fn.getProxyUrl(_item._applink);
							if (_item._apptype != "1") {
								_applink += "&pid=" + _me.options.id;
							}
							$("a", _$li).attr("href", _applink);
							$("a", _$li).attr("jtl", $fn.getProxyUrl(_item._appjtl));

							_$li.data("_TAB_DATA", _item);
						}

						_$tabs.tabs({
							active: 0
							, beforeLoad: function (event, ui) {
								_me.block();
								var _tabdata = ui.tab.data("_TAB_DATA");

								if (_tabdata._apptype == "1") {
									ui.ajaxSettings.dataType = "json";
								} else {
									ui.ajaxSettings.dataType = "text";
								}
								ui.ajaxSettings.dataFilter = function (data) {
									ui.panel.css({ "height": "calc(100% - " + ui.tab.height() + "px)" });

									if (_tabdata._apptype == "1") {
										var jsonData = $.parseJSON(data);
										_me._listProc(_tabdata, jsonData, ui.panel, _$util);
									} else if (_tabdata._apptype == "2") {
										_me._htmlProc(_tabdata, data, ui.panel, _$util);
									}
								};
							}
						});
						/*	
						$('.scrolling-area', _$body).mCustomScrollbar({
							theme: 'dark-3',
							scrollbarPosition: "outside"
						});

						_me.unblock();
						*/
					}
				}
				// 
				, _htmlProc: function (appinfo, html, _$content, _$util) {
					var _me = this
						, _h = "";

					// 포틀릿 버튼 처리
					if (_me.options.appinfo._appdisptype != "2") {
						_$util.css({ "top": "70px" });
					}

					_$util.empty();

					if (_me.options.mode == "S") {
						_h += '<a name="_PREVIEW"><img src="' + $fn.getPath('weblib') + '/images/common/icon-portlet-preview.svg"></a>';
						_h += '<a name="_CLOSE"><img src="' + $fn.getPath('weblib') + '/images/common/btn-icon-close.png"></a>';
					} else {
						_h += '<a name="_RELOAD"><img src="' + $fn.getPath('weblib') + '/images/common/icon-refresh.svg"></a>';
						if (appinfo._appmore) {
							_h += '<a name="_MORE"><img src="' + $fn.getPath('weblib') + '/images/common/icon-go.svg"></a>';
						}
						if (_me.options.mode == "P" && _me.options.isedit) {
							_h += '<a name="_CLOSE"><img src="' + $fn.getPath('weblib') + '/images/common/btn-icon-close.png"></a>';
						}
					}
					_$util.html(_h);

					if (!_me.options.ispreview) {
						$("[name=_RELOAD]", _$util).off("click").on("click", function () {
							//_me.reload();
							var _$tabs = $("div.dwp-tabs-simple", _me.element).tabs("instance");
							_$tabs.load(_$tabs.options.active);
						});

						$("[name=_MORE]", _$util).off("click").on("click", function () {
							if (appinfo._appmoretype == "1") {
								$dwp.core.portal.goMenu({ gid: appinfo._appmore });
							} else {
								var _arg = [], _appmore = appinfo._appmore;
								if (_appmore.indexOf("(") > -1) {
									_fnm = _appmore.split("(")[0];
									_arg = $dwp.core.util.getMidStr(_appmore, "(", ")").split(",");
									for (var i = 0; i < _arg.length; i++) { _arg[i] = eval(_arg[i]); }
								} else {
									_fnm = _appmore;
								}
								_func = $dwp.core.util.getFunction(_fnm);
								if (typeof _func[0] == "function") {
									if (_arg.length > 0) {
										_arg.push($(this));
										_arg.push(_me);
										_func[0].apply(null, _arg);
									} else {
										_func[0]($(this), _me);
									}
								}
							}
						});

						$("[name=_CLOSE]", _$util).off("click").on("click", function () {
							//_me.options.grid.removeWidget(_me.element);
							_me.options.grid.removeWidget(_me.element.get(0));
						});

						$("[name=_PREVIEW]", _me.element).off("click").on("click", function () {
							$fn.dialog(null, {
								title: $fn.getCurLangMsg(appinfo._title)
								, width: 420
								, height: 500
								, modal: true
								, draggable: false
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, resizable: false
								, content: { html: "", url: "" }
								, initcallback: function (_$dialog) {
									var _h = '<div class="component-control" id="' + _me.options.id + '"></div>';
									var _$portlet = $(_h).appendTo(_$dialog.element)
									$dwp.ui.portlet.init(_$portlet, { id: "V_" + _me.options.id, grid: null, mode: "P", isedit: false, layoutinfo: {}, appinfo: _me.options.appinfo, ispreview: true });
								}
							});
						});
					}

					_$content.empty();

					if (appinfo._appdisptype == "2" && !_me.options.isquick) {
						_$content.html("<div class='scrolling-area' style='height:100%;padding:0px;'></div>");
					} else {
						_$content.html("<div class='scrolling-area' style='height:100%;'></div>");
					}

					$(".scrolling-area", _$content).html(html);

					$('.scrolling-area', _$content).mCustomScrollbar({
						theme: 'dark-3',
						scrollbarPosition: "outside",
						autoHideScrollbar: true,
						scrollButtons: { enable: true }
					});

					_me.unblock();

				}
				// List Type Portlet Body
				, _listProc: function (appinfo, jdata, _$content, _$util) {
					var _me = this
						, _h = "";

					// 포틀릿 버튼 처리
					if (_me.options.appinfo._appdisptype != "2") {
						_$util.css({ "top": "70px" });
					}

					_$util.empty();

					if (_me.options.mode == "S") {
						_h += '<a name="_PREVIEW"><img src="' + $fn.getPath('weblib') + '/images/common/icon-portlet-preview.svg"></a>';
						_h += '<a name="_CLOSE"><img src="' + $fn.getPath('weblib') + '/images/common/btn-icon-close.png"></a>';
					} else {
						_h += '<a name="_RELOAD"><img src="' + $fn.getPath('weblib') + '/images/common/icon-refresh.svg"></a>';
						if (appinfo._appmore) {
							_h += '<a name="_MORE"><img src="' + $fn.getPath('weblib') + '/images/common/icon-go.svg"></a>';
						}
						if (_me.options.mode == "P" && _me.options.isedit) {
							_h += '<a name="_CLOSE"><img src="' + $fn.getPath('weblib') + '/images/common/btn-icon-close.png"></a>';
						}
					}
					_$util.html(_h);

					if (!_me.options.ispreview) {
						$("[name=_RELOAD]", _$util).off("click").on("click", function () {
							//_me.reload();
							var _$tabs = $("div.dwp-tabs-simple", _me.element).tabs("instance");
							_$tabs.load(_$tabs.options.active);
						});

						$("[name=_MORE]", _$util).off("click").on("click", function () {
							if (appinfo._appmoretype == "1") {
								$dwp.core.portal.goMenu({ gid: appinfo._appmore });
							} else {
								var _arg = [], _appmore = appinfo._appmore;
								if (_appmore.indexOf("(") > -1) {
									_fnm = _appmore.split("(")[0];
									_arg = $dwp.core.util.getMidStr(_appmore, "(", ")").split(",");
									for (var i = 0; i < _arg.length; i++) { _arg[i] = eval(_arg[i]); }
								} else {
									_fnm = _appmore;
								}
								_func = $dwp.core.util.getFunction(_fnm);
								if (typeof _func[0] == "function") {
									if (_arg.length > 0) {
										_arg.push($(this));
										_arg.push(_me);
										_func[0].apply(null, _arg);
									} else {
										_func[0]($(this), _me);
									}
								}
							}
						});

						$("[name=_CLOSE]", _$util).off("click").on("click", function () {
							//_me.options.grid.removeWidget(_me.element);
							_me.options.grid.removeWidget(_me.element.get(0));
						});

						$("[name=_PREVIEW]", _me.element).off("click").on("click", function () {
							$fn.dialog(null, {
								title: $fn.getCurLangMsg(appinfo._title)
								, width: 420
								, height: 500
								, modal: true
								, draggable: false
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, resizable: false
								, content: { html: "", url: "" }
								, initcallback: function (_$dialog) {
									var _h = '<div class="component-control" id="' + _me.options.id + '"></div>';
									var _$portlet = $(_h).appendTo(_$dialog.element)
									$dwp.ui.portlet.init(_$portlet, { id: "V_" + _me.options.id, grid: null, mode: "P", isedit: false, layoutinfo: {}, appinfo: _me.options.appinfo, ispreview: true });
								}
							});
						});
					}

					_$content.empty();

					if (appinfo.hasOwnProperty("_applink") && appinfo._applink != "" && appinfo.hasOwnProperty("_appjtl") && appinfo._appjtl != "") {
						$dwp.core.util.xAjax({
							url: $dwp.core.util.getProxyUrl(appinfo._appjtl)
							, async: true
							, cache: false
							, data: {}
						})
							.done(function (jtl) {
								var _json = {};
								//_json.target = _$body;
								_json.data = jdata;

								if (_json.data.length > 0) {
									// Data Convert 처리하기
									if (appinfo.hasOwnProperty("_appconvert") && appinfo._appconvert != "") {
										_func = $dwp.core.util.getFunction(appinfo._appconvert);
										if (typeof _func[0] == "function") {
											_json.data = _func[0](_json.data);
										}
									}

									$.each(_json.data, function (i, _item) {
										_item.unid = _item["@unid"];

										_item.isattach = (_item.hasOwnProperty("_attachinfo") && _item._attachinfo != "") ? true : false;
										_item.isstarred = (_item.hasOwnProperty("_isstarred") && _item._isstarred == "1") ? true : false;
										_item.islikecnt = (_item.hasOwnProperty("_likecnt") && _item._likecnt != "") ? true : false;
										_item.isreplycnt = (_item.hasOwnProperty("_isallowreply") && _item._isallowreply == "1" && _item.hasOwnProperty("_replycnt") && _item._replycnt != "") ? true : false;
										_item.created = $dwp.core.util.formatDateTime(_item._created, "relative1");

										if (_item.hasOwnProperty("_docurl") && !_item.hasOwnProperty("_openurl")) {
											_item._openurl = _item._docurl;
										}
										if (_item.hasOwnProperty("_authorempno") && _item._authorempno != "") {
											_item.pic = $dwp.core.getPath("pic", { empno: _item._authorempno });
										}
										_item.rowdata = JSON.stringify(_item);
									});

									var _html = $dwp.core.jsonToHtml.convert(_json, jtl);
									_$content.html("<div class='scrolling-area' style='height:100%;position:relative;'>" + _html + "</div>");

									$fn.convertLangPage({}, _$content);

									//Event 처리하기
									$("[data-unid]", _$content).each(function (i, _o) {
										var _item = $(this).data();
										// 문서 오픈하기
										$("._link", this).off("click").on("click", function () {
											var _opt = {
												title: _item.rowdata._subject
												, isportal: true
												, width: ($fn.getScreenInfo().doc_w * 0.8)
												, dialogClass: 'memo-type'
											};
											//설정에서 읽어오는 방식으로 변경 - 2020.06.18 by dwlee
											if (_me.options.appinfo.hasOwnProperty("_refresh") && _me.options.appinfo._refresh == "1") {
												//if (_me.options.id == "P0001") {
												_opt.initcallback = function () {
													_me.reload();
												};
											}
											$fn.openDocument(_item.rowdata._openurl, _opt);
										});
										// 첨부파일 열기
										if (_item.rowdata.hasOwnProperty("_attachinfo") && _item.rowdata._attachinfo != "") {
											var _opt = {
												ismobile: false
												, applcode: ""
												, cdb: ""
												, svrnm: ""
												, title: $dwp.core.lang.getCodeMsg("comm.title.js012")
												, _attachinfo: _item.rowdata._attachinfo
											};
											$(".bookmark", this).off("click").on("click", function () {
												$dwp.ui.filedailog.init($(this), _opt);
											});
										}

										// 사용자 정보 링크
										$fn.getPicError($("div.dwp-user img", this));
										$("div.dwp-user", this).off("click").on("click", function () {
											$dwp.ui.bizcard.init($(this));
										});

										// 기타 Event 처리하기
										if (appinfo.hasOwnProperty("_appevent") && appinfo._appevent != "") {
											var _arg = [];
											if (appinfo._appevent.indexOf("(") > -1) {
												_fnm = appinfo._appevent.split("(")[0];
												_arg = $dwp.core.util.getMidStr(appinfo._appevent, "(", ")").split(",");
												for (var i = 0; i < _arg.length; i++) { _arg[i] = eval(_arg[i]); }
											} else {
												_fnm = appinfo._appevent;
											}
											_func = $dwp.core.util.getFunction(_fnm);
											if (typeof _func[0] == "function") {
												if (_arg.length > 0) {
													_arg.push($(this));
													_arg.push(_item);
													_arg.push(_me);
													_func[0].apply(null, _arg);
												} else {
													_func[0]($(this), _item, _me);
												}
											}
										}
									});

									$('.scrolling-area', _$content).mCustomScrollbar({
										theme: 'dark-3',
										scrollbarPosition: "outside",
										autoHideScrollbar: true,
										scrollButtons: { enable: true },
										callbacks: {
											onInit: function () {
												//console.log("div.mCSB_scrollTools_vertical", $("div.mCSB_scrollTools_vertical", $('.scrolling-area', _$content)).size());
												$("div.mCSB_scrollTools_vertical", $('.scrolling-area', _$content)).css({ "right": "-15px" });
											}
										}
									});
								} else {
									_html = '<div class="dwp-no-result center">';
									_html += '<img src="' + $fn.getPath('weblib') + '/images/common/icon-no-result.svg" alt="">';
									_html += $fn.getCodeMsg('portal.msg.rst_nodata');
									_html += '</div>';
									_$content.html("<div class='scrolling-area' style='height:100%;position:relative;'>" + _html + "</div>");
								}
								_me.unblock();
							});
					}
				}
				, reload: function () {
					var _me = this
						, _$body = $("div.portlet-body", _me.element);

					_$body.empty();
					if (!$.isEmptyObject(_me.options.appinfo)) {
						_me._portletbody();
					}
				}
				, block: function () {
					var _me = this
						, _$main = $("div.dwp-portlet", _me.element)
						, _$body = $("div.portlet-body", _me.element);

					setTimeout(function () {
						$dwp.ui.block(_$main, { notusemsg: true });
					}, 0);
				}
				, unblock: function (opt) {
					var _me = this
						, _$main = $("div.dwp-portlet", _me.element)
						, _$body = $("div.portlet-body", _me.element)
						, _opt = $.extend({ delay: 0 }, opt);
					console.log("unblock");
					setTimeout(function () {
						$dwp.ui.unblock(_$main);
					}, _opt.delay);
				}
				, addIcon: function (opt) {
					var _me = this
						, _opt = $.extend([], opt)
						, _$util = $("div.portlet-util", _me.element);

					$.each(_opt, function (i, o) {
						if (!o.hasOwnProperty("id")) return true;

						var _$icon = $("a[name=" + o.id + "]", _$util);
						if (_$icon.size() > 0) { _$icon.remove(); }

						var _h = '<a><img src="' + $fn.getPath('weblib') + o.icon + '"></a>';
						var _$item = $(_h).prependTo(_$util);
						_$item.attr("name", o.id);

						if (typeof o.clickfnc == "function") {
							_$item.off("click").on("click", function () {
								o.clickfnc(_me);
							});
						}
					});

				}
				// destroy  - Start
				, destroy: function () {
					var _me = this;
					console.log("Portlet Destory : ", _me.options.id);
					_me.unblock();
					_me.element.empty();
					_me._super();
				}
				// destroy - End
			});
		}
		, mail: {
			convert: function (jdata) {
				var _me = $dwp.ui.portlet.mail;
				var emplist = [];

				if (jdata.length == 0) return jdata;

				for (var idx = 0; idx < jdata.length; idx++) {
					var info = jdata[idx];
					emplist.push(info["_address"]);
				}
				_me.getEmpno(emplist.join(';'), function (retArr) {
					emplist = retArr.empno.split(";");
				});

				for (var idx = 0; idx < jdata.length; idx++) {
					var info = jdata[idx];
					info._authorempno = emplist[idx]
					info.isstarred = (info._isstarred == "1" ? true : false)
				}
				return jdata;
			}
			, getEmpno: function (pdata, callback) {
				var _me = $dwp.ui.portlet.mail;
				$fn.xAjax({
					type: "POST"
					, url: $fn.getProxyUrl($fn.getPath("mail") + '/wcmdpost?openform')
					, cache: false
					, async: false
					, dataType: "json"
					, data: { "__Click": "0", actiontype: "mailaddresstoempno", postdata: pdata }
					, success: function (data, textStatus) {
						if (data.cnt > 0) if (callback != null) callback(data);
					}
					, error: function (xhr, status, e) {
					}
				});
			}
			, eventProc: function (obj, item, portlet, trashCallback) {
				var _me = $dwp.ui.portlet.mail;
				$("._bookmark", obj).off("click").on("click", function () {
					var _obj = $(this);
					$fn.xAjax({
						type: "POST",
						url: $fn.getProxyUrl($fn.getPath("mail") + '/wcmdpost?openform'),
						cache: false,
						async: false,
						dataType: "json",
						data: { "__Click": "0", actiontype: "starflag", postdata: item.unid },
						success: function (data, textStatus) {
							if (data.cnt > 0) _obj.toggleClass('active');
						},
						error: function (xhr, status, e) {
						}
					});
				});
				$(".trash", obj).off("click").on("click", function () {
					var _me = $dwp.ui.portlet.mail;

					$fn.confirm({ msg: $fn.getCodeMsg('삭제하시겠습니까?') })
						.done(function () {
							$fn.xAjax({
								type: "POST",
								url: $fn.getProxyUrl($fn.getPath("mail") + '/wcmdpost?openform'),
								cache: false,
								async: false,
								dataType: "json",
								data: { "__Click": "0", actiontype: "del_temp", postdata: item.unid, Arg1: "($Inbox)" },
								success: function (data, textStatus) {
									if (data.cnt > 0) {
										if (typeof portlet.reload == "function") {
											portlet.reload();
										} else if (typeof trashCallback == "function") {
											trashCallback();
										}
										//메일 포틀릿에서 삭제 버튼 수행시 상단의 업무알람 갯수 리프레쉬 - 2020.07.22 by dwlee
										//$fn.xTrigger($("div.dwp-icon-menu"), "GnbCountRefresh", { type: "mail" });
										$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "mail" });
									}
								},
								error: function (xhr, status, e) {
								}
							});
						});
				});
			}
		}
		, portletSelect: function (opt) {
			var _me = this
				, _opt = $.extend({ title: $fn.getCodeMsg("탭리스트선택"), type: "", depth: "", category: "" }, opt);

			$dwp.ui.dialog.init($(this), {
				title: _opt.title
				, width: 360
				, modal: true
				, hide: { effect: "fade", duration: 300 }
				, show: { effect: "fade", duration: 300 }
				, content: {
					url: "/dwp/com/portal/appmng.nsf/wFrmTabSel?readform"
					, data: { type: _opt.type, depth: _opt.depth, category: _opt.category }
				}
				, buttons: [{
					title: $fn.getCodeMsg("확인")
					, highlight: true
					, click: function (_$dialog) {
						var _$tree = $("[name='tree']", _$dialog.element).xtree("instance")
							, _dtnode = _$tree.getActiveNode();

						if (_dtnode == null) {
							$fn.alert({ msg: $fn.getCodeMsg("대상을 선택해 주십시요!") });
							return false;
						}

						if (typeof _opt.callback == "function") {
							_opt.callback(_$dialog, _dtnode)
						}
						//_$inpdisp.val($fn.getCurLangMsg(_dtnode.data.codenm));
						//_$inp.val(_dtnode.data.code);
						//_$inph.val(_dtnode.data.codenm);

						_$dialog.close();
					}
				}
					, {
					title: $fn.getCodeMsg("취소")
					, highlight: false
					, click: function (_$dialog) {
						_$dialog.close();
					}
				}
				]
			});
		}
	}
}($dwp.cns("ui"), jQuery));














