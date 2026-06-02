/**
 * <b>UI 라이브러리</b>
 * <br>UI Component를 정의합니다.
 * @module core/ui
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.ui|core.ui}
 */
/**
 * @namespace	module:core~$dwp.core.ui
 */
(function (/** @lends	module:core~$dwp.core.ui */_$$, $) {
	/**
	 * HTML Compare
	 */
	_$$.htmldiff = {
		_MODULE_NM: "dwp.xhtmldiff"
		, init: function (el, opt) {

			var _par = this, _$el = $(el)
				, _opt = $.extend({}, _par._default, opt);

			if (typeof $.fn.xhtmldiff == "undefined") {
				_par._create();
			}
			_$el.xhtmldiff(_opt);
			return _$el.xhtmldiff("instance");
		}
		, _create: function () {
			var _par = this;
			$.widget(_par._MODULE_NM, {
				options: {
					mode: "js"
					, compareurl: "/htmldiff/compare"
					, compareopt: {
						className: '',
						dataPrefix: '',
						atomicTage: ''
					}
					, scontents: { html: "", url: "" }  // SRC HTML 정보
					, tcontents: { html: "", url: "" }  // TAR HTML 정보
					, viewtype: "inline"                // 비교결과 표시방법 dialog, inline
					, target: null                      // viewtype이 인라인인 경우 지정
				}
				, _create: function () {

				}
				, _init: function () {
					var _me = this;

					if (_me.options.scontents.html == "" && _me.options.scontents.url == "") {
						//$fn.alert({msg : $fn.getCodeMsg("SRC HTML 정보를 입력해 주십시요")})
						console.log("Error", "SRC HTML Info Nothing");
						return;
					}
					if (_me.options.tcontents.html == "" && _me.options.tcontents.url == "") {
						//$fn.alert({msg : $fn.getCodeMsg("SRC HTML 정보를 입력해 주십시요")})
						console.log("Error", "TAR HTML Info Nothing");
						return;
					}

					$.when(
						(function () {
							if (_me.options.scontents.html != "") {
								var _defer = $.Deferred();
								var _rtn = [];

								_rtn.push(_me.options.scontents.html);
								setTimeout(function () {
									_defer.resolve(_rtn);
								}, 10);

								return _defer;
							} else {
								return $fn.xAjax({ url: _me.options.scontents.url, dataType: "html", cache: false });
							}
						})(),
						(function () {
							if (_me.options.tcontents.html != "") {
								var _defer = $.Deferred();
								var _rtn = [];

								_rtn.push(_me.options.tcontents.html);
								setTimeout(function () {
									_defer.resolve(_rtn);
								}, 10);

								return _defer;
							} else {
								return $fn.xAjax({ url: _me.options.tcontents.url, dataType: "html", cache: false });
							}
						})()
					).done(function (xhr1, xhr2) {
						var _html = "";
						if (_me.options.mode == "js") {
							_html = htmldiff(xhr1[0], xhr2[0], _me.options.compareopt.className, _me.options.compareopt.dataPrefix, _me.options.compareopt.atomicTage);
							_view();
						} else {
							$fn.xAjax({
								url: _me.options.compareurl
								, type: 'POST'
								, dataType: 'json'
								, data: {
									'sbody': xhr1[0]
									, 'tbody': xhr2[0]
									, 'className': _me.options.compareopt.className
									, 'dataPrefix': _me.options.compareopt.dataPrefix
									, 'atomicTage': _me.options.compareopt.atomicTage
								}
							}).done(function (json) {
								console.log('json', json);
								//_html = _me._convertHtml(_me.options.scontents.html, json.result);
								_html = json.result;
								_view();
							});
						}

						function _view() {

							var _tghtml = "<div style='margin-bottom:2px'>&nbsp;<span><ins>&nbsp;&nbsp;&nbsp;</ins> : 추가문구</span>&nbsp;&nbsp;<span><del>&nbsp;&nbsp;&nbsp;</del> : 삭제문구</span></div>"
							_tghtml += "<div style='border:1px solid #666;padding:5px;'>" + _html + "</div>"

							if (_me.options.viewtype == "dialog") {
								$dwp.ui.dialog.init(null, {
									show: { effect: "fade", duration: 300 }
									, hide: { effect: "fade", duration: 300 }
									//,draggable: true
									//,resizable: true
									, width: 800
									, height: 600
									, modal: true
									, title: $fn.getCodeMsg("본문비교")
									, content: { url: "", html: _tghtml, data: {} }
									, initcallback: function (_$dialog) {

									}
								});
							} else {
								_me.element.html(_tghtml);
							}
						}
						/*
												function _view() {

													if (_me.options.viewtype == "dialog") {
														$dwp.ui.dialog.init(null, {
															show:{ effect: "fade", duration: 300 }
															,hide:{ effect: "fade", duration: 300 }
															//,draggable: true
															//,resizable: true
															,width:800
															,height:600
															,modal:true
															,title:$fn.getCodeMsg("본문비교")
															,content : {url : "", html : _html, data : {}}
															,initcallback : function(_$dialog){

															}
														});
													} else {
														_me.element.html(_tghtml);
													}
												}
						*/

						/*
						 $fn.xAjax({
							 url : _me.options.compareurl
							 ,type : 'POST'
							 ,dataType : 'json'
							 ,data : {'sbody' : xhr1[0], 'tbody' : xhr2[0]}
						 }).done(function(json){
							 console.log('json', json);

							 //_me.element.html(_me._convertHtml(_me.options.scontents.html, json.result));

						 });
						 */
					});
				},
				_convertHtml: function (html, _differ) {
					var _me = this;
					var _rhtml = "", _fidx = 0, _nidx = 0;
					$.each(_differ, function (i, o) {
						console.log(o);
						if (o.hasOwnProperty("added")) {
							_rhtml += "<ins>" + o.value + "</ins>";
						} else if (o.hasOwnProperty("removed")) {
							_nidx = html.indexOf(o.value, _fidx);
							_rhtml += "<del>" + o.value + "</del>";
							_fidx = _nidx + o.value.length;
						} else {
							_nidx = html.indexOf(o.value, _fidx);
							_rhtml += html.substring(_fidx, _nidx + o.value.length);
							_fidx = _nidx + o.value.length;
						}
						console.log("AA", _rhtml)
					});
					// Last 문자열 찾아서 넣기
					console.log("fidx", _fidx);
					console.log("html", html.length);
					if (_fidx < html.length - 1) {
						_rhtml += html.substring(_fidx, html.length - 1)
					}
					return _rhtml;
				}
			});
		}
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		}
		, getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};

	/**
	 * Kanban Board UI
	 */
	_$$.kanban = {
		_MODULE_NM: "dwp.xkanban"
		/**
		 * Kanban Instance 생성함수
		 * @param	{object}	el		Kanban생성 Dom Object
		 * @param	{object}	opt		options
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el)
				, _opt = $.extend({}, _par._default, opt);

			if (typeof $.fn.xkanban == "undefined") {
				_par._create();
			}
			_$el.xkanban(_opt);
			return _$el.xkanban("instance");
		}
		, _create: function () {
			var _par = this;
			$.widget(_par._MODULE_NM, {
				CONST: {
					TAB_UL_DATA: "_TAB_UL_DATA"
					, TAB_LI_DATA: "_TAB_LI_DATA"
					, TAB_LI_WIDTH: 150
				}
				, options: {
					element: '',                                           // selector of the kanban container
					gutter: '15px',                                       // gutter of the board
					widthBoard: '250px',                                      // width of the board
					responsivePercentage: false,                                     // if it is true I use percentage in the width of the boards and it is not necessary gutter and widthBoard
					dragItems: true,                                         // if false, all items are not draggable
					boards: [],                                           // json of boards
					dragBoards: true,                                         // the boards are draggable, if false only item can be dragged
					addItemButton: false,                                        // add a button to board for easy item creation
					buttonContent: '+',                                          // text or html content of the board button
					itemHandleOptions: {
						enabled: false,                                 // if board item handle is enabled or not
						handleClass: "item_handle",                         // css class for your custom item handle
						customCssHandler: "drag_handler",                        // when customHandler is undefined, jKanban will use this property to set main handler class
						customCssIconHandler: "drag_handler_icon",                   // when customHandler is undefined, jKanban will use this property to set main icon handler class. If you want, you can use font icon libraries here
						customHandler: "<span class='item_handle'>+</span> %s"// your entirely customized handler. Use %s to position item title
					},
					click: function (el) { },                             // callback when any board's item are clicked
					dragEl: function (el, source) { },                     // callback when any board's item are dragged
					dragendEl: function (el) { },                             // callback when any board's item stop drag
					dropEl: function (el, target, source, sibling) { },    // callback when any board's item drop in a board
					dragBoard: function (el, source) { },                     // callback when any board stop drag
					dragendBoard: function (el) { },                             // callback when any board stop drag
					buttonClick: function (el, boardId) { }                      // callback when the board's button is clicked
				}
				, kanban: null
				, _create: function () {

				}
				, _init: function () {
					var _me = this;
					_me.options.element = _me.element;
					_me.kanban = new jKanban(_me.options);
				}
				, destroy: function () {
					var _me = this;
					_me.kanban = null;
					_me.element.empty();
					_me._super();
					//_me.element.remove();
				}
			});
		}
		/**
		 * 대상 element에 Tab Instance를 반환하는 함수
		 * @param	{object}	el	dom element or jquery selector
		 * @return	{object}	tab instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		},
		/**
		 * 대상 element Tab options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	tab options
		 */
		getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	}
	/**
	 * Tab UI
	 * @namespace
	 */
	_$$.tab = {
		_MODULE_NM: "dwp.xtab"
		/**
		 * Tab Instance 생성함수
		 * @param	{object}	el		Tab생성 Dom Object
		 * @param	{object}	opt		options
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el)
				, _opt = $.extend({}, _par._default, opt);

			if (typeof $.fn.xtab == "undefined") {
				_par._create();
			}
			_$el.xtab(_opt);
			return _$el.xtab("instance");
		}
		/**
		 * Tab Widget 생성함수
		 */
		, _create: function () {
			var _par = this;
			$.widget(_par._MODULE_NM, {
				CONST: {
					TAB_UL_DATA: "_TAB_UL_DATA"
					, TAB_LI_DATA: "_TAB_LI_DATA"
					, TAB_LI_WIDTH: 150
				}
				, options: {
					select_reload: false
					, equrllist: []
					, reloadnlist: []
					, tab_content_css: ""
				}
				, _create: function () {

				}
				, _init: function () {
					var _me = this
						, _$tabcontainer = $("<div class='dwp-xtabs-container'><div class='left'></div><div class='right' style='text-align:left'></div></div>").appendTo(_me.element)
						, _$tabenv = $("<div class='dwp-btn icon' style='padding: 2px 0;'><button type='button' style='height: 31px;'><img src='/tcclibs/images/common/icon-close-sm.svg'></button></div>").appendTo($("div.right", _$tabcontainer))
						, _$tabnav = $("<nav class='dwp-xtabs-nav'></nav>").appendTo($("div.left", _$tabcontainer))
						//_$tabs = $("<ul class='dwp-xtabs'></ul>").appendTo(_me.element);
						, _$tabs = $("<ul class='dwp-xtabs'></ul>").appendTo(_$tabnav)
						, _$more_tabs = $("<ul class='dwp-xtabs-more dwp-none'></ul>").appendTo(_$tabnav)
						, _$more = $("<li class='more dwp-none'></li>").appendTo(_$tabs);

					_$more.append("<span class='more-text'>More</span>");

					$("span.more-text", _$more).on("click", function () {
						if (_$more_tabs.hasClass('dwp-none')) {
							_$more_tabs.removeClass('dwp-none');
							_$more.addClass('expand');
						} else {
							_$more_tabs.addClass('dwp-none');
							_$more.removeClass('expand');
						}
						/*
						_$$.qtdialog.init(_$more, {
							qtid : "tab_more"
							,dialogClass : 'titleless dropdown-type-dialog'
							,width : "auto"
							,position : {my : "left top", at : "left top", collision : "flipfit" }
							,initcallback : function(_$qtdialog){
								$("<div style='padding:5px'>qqqqqqq</div>").appendTo(_$qtdialog.element);
							}
						});
						*/
					});

					// Tab 전체 Close
					_$tabenv.off("click").on("click", function () {
						$fn.confirm({ msg: $fn.getCodeMsg("현재 탭을 제외한 모든 탭을 삭제하시겠습니까?") })
							.done(function () {
								var __$tabs = $("li[rel]", _$tabs).not(".active");
								__$tabs.each(function () {
									var _tabid = $(this).attr("id");
									var __$tab_content = $("div[id=" + _tabid + "]", _me.element);
									__$tab_content.remove();
								});
								__$tabs.remove();
								_me._tabSizing();
							});
					});

					_$tabs.data(_me.CONST.TAB_UL_DATA, { no: 0 });

					$(window).off("resize.tab").on("resize.tab", function () {
						console.log("Tab Resize");
						_me._tabSizing();
					});

					$("body").off("click.tab").on("click.tab", function (e) {
						if (!$.contains(_$more_tabs.get(0), e.target) && !$.contains(_$more.get(0), e.target)) {
							_$more_tabs.addClass("dwp-none");
							_$more.removeClass('expand');
						}
					});
				}
				, _tabSizing: function () {
					var _me = this
						, _$tabenv = $("div.dwp-xtabs-container>div.right", _me.element)
						, _$tabs = $("ul.dwp-xtabs", _me.element)
						, _$more_tabs = $("ul.dwp-xtabs-more", _me.element)
						, _$more = $("li.more", _$tabs)

						, _tabsWith = _$tabs.width()
						, _tabenvWith = _$tabenv.width()
						//,_itemsWith = _$more.width()
						, _itemsWith = _me.CONST.TAB_LI_WIDTH
						, _hiddenCnt = 0;

					_$more_tabs.empty();

					$("li[rel]", _$tabs).each(function (i) {
						var _$item = $(this);
						//if (_tabsWith - _tabenvWith >= _itemsWith + _me.CONST.TAB_LI_WIDTH) {
						if (_tabsWith >= _itemsWith + _me.CONST.TAB_LI_WIDTH) {
							_itemsWith += _me.CONST.TAB_LI_WIDTH;
						} else {
							_hiddenCnt++;
						}
					});

					if (_hiddenCnt > 0) {
						$("li[rel]", _$tabs).each(function (i) {
							var _$item = $(this);
							if (i < _hiddenCnt) {
								var _$nitem = $("<li></li>").prependTo(_$more_tabs);
								_$nitem.append("<span>" + $("span", _$item).text() + "</span>");

								_$nitem.data(_me.CONST.TAB_LI_DATA, _$item.data(_me.CONST.TAB_LI_DATA));
								_$nitem.attr("rel", _$item.attr("rel"));
								_$nitem.attr("title", $("span", _$item).text());

								_$nitem.off("click").on("click", function () {
									_me.moreSelectTab($(this).data(_me.CONST.TAB_LI_DATA));
								});
								_$item.addClass('dwp-none');
							} else {
								_$item.removeClass('dwp-none');
							}
						});
						/*
						for(var i=0; i < _hiddenCnt ; i++){
							var _$item = $($("li[rel]", _$tabs).get(i));

							var _$nitem = $("<li></li>").prependTo(_$more_tabs);
							_$nitem.append("<span>" + $("span", _$item).text() + "</span>");

							_$nitem.data(_me.CONST.TAB_LI_DATA, _$item.data(_me.CONST.TAB_LI_DATA));
							_$nitem.attr("rel", _$item.attr("rel"));
							_$nitem.attr("title", $("span", _$item).text());

							_$nitem.off("click").on("click", function(){
								_me.moreSelectTab($(this).data(_me.CONST.TAB_LI_DATA));
							});
							//_$item.clone().prependTo(_$more_tabs);
							_$item.addClass('dwp-none');
						}
						*/
						$("span.more-text", _$more).text("More(" + _hiddenCnt + ")");
						_$more.removeClass('dwp-none');
						$("li[rel]", _$tabs).addClass('dwp-flex-grow');

						//_$more_tabs.removeClass('dwp-none');
						_$more.removeClass('expand');
					} else {
						$("li[rel]", _$tabs).removeClass('dwp-flex-grow').removeClass('dwp-none');
						_$more.addClass('dwp-none');
						//_$more_tabs.addClass('dwp-none');
						_$more.removeClass('expand');
					}
				}
				, getCurTab: function () {
					var _me = this
						, _$tabs = $("ul.dwp-xtabs", _me.element)
						, _$tab = null;

					_$tab = $("li.active", _$tabs);

					return _$tab.attr("rel");
				}
				, _getTabData: function () {
					var _me = this
						, _$tabs = $("ul.dwp-xtabs", _me.element)

					return _$tabs.data(_me.CONST.TAB_UL_DATA);
				}
				, _getTabNo: function () {
					var _me = this

					if (_me._getTabData()) {
						return _me._getTabData().no;
					}
					return null;
				}
				, _setTabNo: function (no) {
					var _me = this
						, _tabData = _me._getTabData();

					_tabData.no = no;
				}
				, _getNewTabNo: function () {
					var _me = this
					_no = _me._getTabNo();

					if (_no == null) { _no = 0; }
					_no++;

					_me._setTabNo(_no);
					return _no;
				}
				, _findSameTab: function (src, tar) {
					var _me = this
						, _src = $dwp.core.util.getProxyUrl(src).toLowerCase()
						, _tar = $dwp.core.util.getProxyUrl(tar).toLowerCase();

					if (_src == _tar) { return "1"; }

					function _pathChk() {
						var _vtar = _tar.split(".nsf");
						var _vsrc = _src.split(".nsf");

						var _vtar2 = _vtar[1].split("/");
						var _vsrc2 = _vsrc[1].split("/");

						var _vtar3 = _vtar2[_vtar2.length - 1].split("?");
						var _vsrc3 = _vsrc2[_vsrc2.length - 1].split("?");

						if (_vtar[0] == _vsrc[0] && _vtar3[0] == _vsrc3[0]) return true;
						return false;
					}

					function _findUrl(url) {
						for (var i = 0; i < _me.options.equrllist.length; i++) {
							var _equrls = _me.options.equrllist[i].split(";");
							for (var j = 0; j < _equrls.length; j++) {
								if (url.indexOf(_equrls[j].toLowerCase()) > -1) {
									return i;
								}
							}
						}
						return -1;
					}

					if (_me.options.equrllist.length > 0) {
						var _srcidx = _findUrl(_src)
							, _taridx = _findUrl(_tar);

						if (_srcidx > -1 && _srcidx == _taridx) { return "2"; }
					}

					if (_tar.indexOf("?opendocument") > -1 && _src.indexOf("?opendocument") > -1) {
						if (_pathChk()) { return "1"; }
					} else if (_src.indexOf("?editdocument") > -1 && _tar.indexOf("?opendocument") > -1) {
						if (_pathChk()) { return "2"; }
					}

					return "0";
				}
				, isNotReloadPage: function (link) {
					var _me = this;

					if (_me.options.reloadnlist.length > 0) {
						for (var i = 0; i < _me.options.reloadnlist.length; i++) {
							if (link.toLowerCase().indexOf(_me.options.reloadnlist[i].toLowerCase()) > -1) {
								return true;
							}
						}
					} else {
						return false;
					}
				}
				, addTab: function (opt) {
					var _me = this
						, _opt = $.extend({ title: "", linktype: "", link: "", replacetab: false }, opt)
						, _$tabs = $("ul.dwp-xtabs", _me.element)
						, _$more = $("li.more", _$tabs)
						, _$tab = null, _$tab_content = null
						//,_no = _me._getNewTabNo()
						, _isfind = false;

					// 동일한 Tab 존재 여부 체크하기
					console.log("Add Tab", _opt);
					if (_opt.replacetab) {
						_opt.tabid = _me.getCurTab();
						_me.replaceTab(_opt);
						return;
					} else {
						$("li[rel]", _$tabs).each(function () {
							var _vopt = $(this).data(_me.CONST.TAB_LI_DATA)
								, _tabid = $(this).attr("rel")
								, _type = _me._findSameTab(_opt.link, _vopt.link);

							if (_type == "1") {
								_vopt.reload = true;
								_me.selectTab(_vopt);
								_isfind = true;
								return false;
							} else if (_type == "2") {
								//_opt.tabid = _me.getCurTab();
								_opt.tabid = _tabid;
								_me.replaceTab(_opt);
								_isfind = true;
								return false;
							} else {
								if (_vopt.hasOwnProperty("olink")) {
									_type = _me._findSameTab(_opt.link, _vopt.olink);

									if (_type == "1") {
										_vopt.reload = true;
										_me.selectTab(_vopt);
										_isfind = true;
										return false;
									} else if (_type == "2") {
										//_opt.tabid = _me.getCurTab();
										_opt.tabid = _tabid;
										_me.replaceTab(_opt);
										_isfind = true;
										return false;
									}
								}
							}
						});
					}

					if (_isfind) { return };

					var _no = _me._getNewTabNo();

					if (_opt.title == "") {
						_opt.title = "제목없음";
					}

					// Tab 선택시 Page 갱신여부체크
					if (_me.isNotReloadPage(_opt.link)) {
						_opt.reload = false;
					}

					_$tab = $("<li rel='tab" + _no + "'></li>").insertBefore(_$more);
					_$tab.html("<span name='_TITLE'>" + _opt.title + "</span><a name='_CLOSE'>X</a>");

					_$tab_content = $("<div id='tab" + _no + "' class='dwp-tab-wrapping'></div>").appendTo(_me.element);

					if (_me.options.tab_content_css != "") {
						_$tab_content.addClass(_me.options.tab_content_css);
					}

					_opt.tabid = "tab" + _no;

					console.log("#AddTab", _opt);

					_$tab.data(_me.CONST.TAB_LI_DATA, _opt);

					//Select
					$("span[name=_TITLE]", _$tab).off("click").on("click", function () {
						var _tab_data = $(this).parent().data(_me.CONST.TAB_LI_DATA);
						//var _tabid = $(this).parent().attr("rel")
						if (_me.isNotReloadPage(_opt.link)) {
							_tab_data.reload = false;
						}
						_me.selectTab(_tab_data);
					});
					//Remove
					$("a[name=_CLOSE]", _$tab).off("click").on("click", function () {
						var _tab_data = $(this).parent().data(_me.CONST.TAB_LI_DATA);
						//var _tabid = $(this).parent().attr("rel")
						console.log("_tab_data", _tab_data);
						if ($dwp.core.portal.isDocEdit({ type: "", target: $("#" + _tab_data.tabid) })) {
							$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg062") })
								.done(function () { _me.removeTab(_tab_data); });
						} else {
							_me.removeTab(_tab_data);
						}
					});

					//
					$("li", _$tabs).removeClass("active");
					_$tab.addClass("active");

					$("div.dwp-tab-wrapping", _me.element).addClass("dwp-none");
					_$tab_content.removeClass("dwp-none");

					_me._tabSizing();

					//_me._contentLoad({tabid : "tab" + _no, actopt : _opt});
					_me._contentLoad(_opt);
				}
				, _contentLoad: function (opt) {
					var _me = this
						, _opt = $.extend({ tabid: "" }, opt)
						, _$tab = null
						, _$tab_content = null;

					_$tab = $("li[rel=" + _opt.tabid + "]", _me.element);

					_$tab_content = $("#" + _opt.tabid, _me.element);
					_$tab_content.empty();

					$dwp.core.util.xAjax({
						url: $dwp.core.util.getProxyUrl(_opt.link)
						, dataType: "html"
						, async: true
						, cache: false
					})
						.done(function (_html) {

							$dwp.core.util.xOn(_$tab_content, "LangComplete", function (event, el) {
								//console.log("LangComplete", $(el))
								var _$el = $(el);
								if ($(".dwp-page-title", _$el).size() > 0) {
									var _tabid = "";
									if (_$el.hasClass("dwp-tab-wrapping") && _$el.is("[id]")) {
										_tabid = _$el.attr("id");
									}
									if (_tabid == "") { return; }

									var _title = $(".dwp-page-title", _$el).text()
										, __$tab = $("li[rel=" + _tabid + "]", $dwp.core.getContent())
										, _tab_data = __$tab.data(_me.CONST.TAB_LI_DATA)
										, _subject = "";

									if ($("div.view-head div.dwp-subject", _$el).size() > 0) {
										_subject = $("div.view-head div.dwp-subject", _$el).text();
										if (_tab_data.link.toLowerCase().indexOf("editdocument") > -1) {
											_title = "[편집]" + _title + " " + _subject
										} else {
											_title = _title + " " + _subject
										}
									} else {
										if (_tab_data.link.toLowerCase().indexOf("openform") > -1) {
											_title = "[작성]" + _title;
										}
									}

									$("span[name=_TITLE]", __$tab).attr("title", _title).text(_title);
								}
							});

							_$tab_content.html(_html);

							/*
							if ( $("div.dwp-page-title", _$tab_content).size() > 0 ) {
								setTimeout(function(){
									$("span[name=_TITLE]", _$tab).text($("div.dwp-page-title", _$tab_content).text());
								}, 500);
							}
							*/
						});
				}
				, replaceTab: function (opt) {
					var _me = this
						, _opt = $.extend({ tabid: "", title: "", linktype: "", link: "" }, opt)
						, _$tabs = $("ul.dwp-xtabs", _me.element)
						, _$tab = null, _$tab_content = null;

					console.log("#ReplaceTab", _opt);

					_$tab = $("li[rel=" + _opt.tabid + "]", _$tabs);
					_$tab_content = $("#" + _opt.tabid, _me.element);

					if (_opt.replacetab) {
						var _oopt = _$tab.data(_me.CONST.TAB_LI_DATA);
						_opt.olink = _oopt.link;
					}
					_$tab.data(_me.CONST.TAB_LI_DATA, _opt);

					$("li", _$tabs).removeClass("active");
					_$tab.addClass("active");

					$("div.dwp-tab-wrapping", _me.element).addClass("dwp-none");
					_$tab_content.removeClass("dwp-none");

					_me._contentLoad(_opt);
				}
				, selectTab: function (opt) {
					var _me = this
						, _opt = $.extend({ tabid: "", reload: false }, opt)
						, _$tabs = $("ul.dwp-xtabs", _me.element)
						, _$more_tabs = $("ul.dwp-xtabs-more", _me.element)
						, _$tab = null, _$tab_content = null;

					console.log("#SelectTab", _opt);

					_$tab = $("li[rel=" + _opt.tabid + "]", _$tabs);
					_$tab_content = $("#" + _opt.tabid, _me.element);

					//History Back하는 경우 More에 있는 Tab인 경우 처리
					if ($("li[rel=" + _opt.tabid + "]", _$more_tabs).size() > 0) {
						//위치변경하기(마지막 표시탭 앞으로 이동하기)
						var _$firsttab = $("li[rel]", _$tabs).filter(":visible").get(0);
						var _$ntab = _$tab.clone(true).insertAfter(_$firsttab);

						_$tab.remove();
						_$ntab.removeClass("dwp-none");

						_$tab = _$ntab;

						_me._tabSizing();
					}

					//좌측메뉴 변경처리
					if (_opt.lnb) {
						if (_opt.lnb.lnbid != "" || _opt.lnb.lnblink != "" || _opt.lnb.lnbdlink != "") {
							// To-do 동일메뉴인 경우도 호출함(체크필요)
							var _$el = $("div.dwp-lnb-wrap", $dwp.core.getLnb())
								, _lnb = _$el.data($dwp.core.portal._CONST._DATA.LNB)
								, _isnreload = false;

							if (_opt.lnb.lnbid != "" && _lnb.lnbid != _opt.lnb.lnbid) {
								$dwp.core.portal.lnb(_opt.lnb);
							} else if (_opt.lnb.lnblink != "" && _lnb.lnblink != _opt.lnb.lnblink) {
								$dwp.core.portal.lnb(_opt.lnb);
							} else if (_opt.lnb.lnbdlink != "" && _lnb.lnbdlink != _opt.lnb.lnbdlink) {
								$dwp.core.portal.lnb(_opt.lnb);
							} else {
								_isnreload = true;
							}

							if (_opt.hasOwnProperty("top") && _opt.top != "") {
								//$dwp.core.util.xOn($("#tree_" + _opt.top, $dwp.core.getLnb()), "TreeComplete", function(event, el){
								if ($("#" + _opt.top, $dwp.core.getLnb()).size() > 0) {
									$("#" + _opt.top, $dwp.core.getLnb()).parent().addClass("active");
								}
								// 2021-07-08 By Error Fix LHJ
								var _$tree = $("#tree_" + _opt.top, $dwp.core.getLnb());
								if (_$tree.size() > 0) {
									var _tree = _$tree.xtree("instance");
									if (_tree != undefined) {
										_tree.getTree().getRoot().visit(function (dtnode) {
											dtnode.expand(true);
										});
										_tree.getTree().activateKey(_opt.lnb.lnbpos);
									} else {

									}
								}
							}
							if (_isnreload) {
								if (_opt.lnb.lnbpos != "") {
									_$item = $("#" + _opt.lnb.lnbpos, _$el);
									if (_$item.size() > 0) {
										$(".dwp-lnb-depth2", _$el).removeClass("active");
										$(".dwp-lnb-item", _$el).removeClass("selected");
										_$item.addClass("selected")
											.parents(".dwp-lnb-depth2").addClass("active")
									}
								} else {
									$dwp.core.portal.lnb(_opt.lnb);
								}
							}
						}
					}

					$("li", _$tabs).removeClass("active");
					_$tab.addClass("active");

					$("div.dwp-tab-wrapping", _me.element).addClass("dwp-none");
					_$tab_content.removeClass("dwp-none");

					if (_opt.reload) {
						//var _actopt = _$tab.data(_me.CONST.TAB_LI_DATA);
						_me._contentLoad(_opt);
					}

				}
				, moreSelectTab: function (opt) {
					var _me = this
						, _opt = $.extend({ tabid: "", reload: false }, opt)
						, _$tabs = $("ul.dwp-xtabs", _me.element)
						, _$more_tabs = $("ul.dwp-xtabs-more", _me.element)
						, _$tab = null, _$tab_content = null;

					_$tab = $("li[rel=" + _opt.tabid + "]", _$tabs);
					_$tab_content = $("#" + _opt.tabid, _me.element);

					//위치변경하기(마지막 표시탭 앞으로 이동하기)
					var _$firsttab = $("li[rel]", _$tabs).filter(":visible").get(0);
					var _$ntab = _$tab.clone(true).insertAfter(_$firsttab);

					_$tab.remove();

					_$ntab.removeClass("dwp-none");

					$("li", _$tabs).removeClass("active");
					_$ntab.addClass("active");

					_me._tabSizing();

					//좌측메뉴 변경처리
					if (_opt.lnb) {
						if (_opt.lnb._lnbid != "" || _opt.lnb._lnblink != "" || _opt.lnb._lnbdlink != "") {
							// To-do 동일메뉴인 경우도 호출함(체크필요)
							$dwp.core.portal.lnb(_opt.lnb);

							if (_opt.top) {
								//$dwp.core.util.xOn($("#tree_" + _opt.top, $dwp.core.getLnb()), "TreeComplete", function(event, el){
								if ($("#" + _opt.top, $dwp.core.getLnb()).size() > 0) {
									$("#" + _opt.top, $dwp.core.getLnb()).parent().addClass("active");
								}
								// 2021-07-08 By Error Fix LHJ
								var _$tree = $("#tree_" + _opt.top, $dwp.core.getLnb());
								if (_$tree.size() > 0) {
									var _tree = _$tree.xtree("instance");
									if (_tree != undefined) {
										_tree.getTree().getRoot().visit(function (dtnode) {
											dtnode.expand(true);
										});
										_tree.getTree().activateKey(_opt.lnb.lnbpos);
									}
								}
								//});
							}
						}
					}

					$("div.dwp-tab-wrapping", _me.element).addClass("dwp-none");
					_$tab_content.removeClass("dwp-none");

					if (_opt.reload) {
						var _actopt = _$ntab.data(_me.CONST.TAB_LI_DATA);
						_me._contentLoad(_actopt);
					}

					_$more_tabs.addClass("dwp-none");
				}
				, removeTab: function (opt) {
					var _me = this
						, _opt = $.extend({ tabid: "", selecturl: "" }, opt)
						, _$tabs = $("ul.dwp-xtabs", _me.element)
						, _$tab = null, _$tab_content = null
						, _ctabid = _me.getCurTab()
						, _islast = false
						, _dopt, _viewurl = "";

					if (_opt.tabid == "") { _opt.tabid = _ctabid; }

					_$tab = $("li[rel=" + _opt.tabid + "]", _$tabs);
					_$tab_content = $("div[id=" + _opt.tabid + "]", _me.element);

					function _selectMove(_selecturl) {
						var _rtn = false;
						// 동일한 Tab 존재 여부 체크하기
						$("li[rel]", _$tabs).each(function () {
							var _vopt = $(this).data(_me.CONST.TAB_LI_DATA)
								, _tabid = $(this).attr("rel")
								, _type = _me._findSameTab(_selecturl, _vopt.link);

							if (_type == "1") {
								_vopt.reload = true;
								_me.selectTab(_vopt);
								_rtn = true;
								return false;
							} else if (_type == "2") {
								_me.replaceTab(_vopt);
								_rtn = true;
								return false;
							}
						});
						return _rtn;
					}

					if (_opt.selecturl == "" && _ctabid == _opt.tabid) {
						var _inst = $fn.getInstance("doc");
						if (_inst != undefined) {
							_dopt = $.extend({}, $dwp.core.portal.getPreViewInfo());
							_viewurl = (_dopt != undefined) ? _dopt.pathinfo : _inst.options.viewurl;
						}
					}

					// 마지막 Tab인 경우 체크
					if (_me.getTabCount() == 1) {
						$dwp.core.portal._convertDisp();
						$dwp.core.portal._comPortlet();

						$dwp.core.history.addHistory({ linktype: "HOME" });

						_$tab.remove();
						_$tab_content.remove();

						return;
					} else {
						_$tab.remove();
						_$tab_content.remove();
					}

					_me._tabSizing();

					if (_opt.selecturl != "") {
						// 동일한 Tab 존재 여부 체크하기
						if (!_selectMove(_opt.selecturl)) {
							//Add TAB
							if (typeof _opt.fail == "function") {
								_opt.fail();
							}
						}
						/*
						$("li[rel]", _$tabs).each(function(){
							var _vopt = $(this).data(_me.CONST.TAB_LI_DATA)
							,_tabid = $(this).attr("rel")
							,_type = _me._findSameTab(_opt.selecturl, _vopt.link);

							if ( _type == "1" ) {
								_vopt.reload = true;
								_me.selectTab(_vopt);
								return false;
							} else if ( _type == "2" ){
								_me.replaceTab(_vopt);
								return false;
							}
						});
						*/
					} else {
						//선택된 Tab인경우
						if (_ctabid == _opt.tabid) {
							console.log("RemoveTab", _viewurl);

							if (_viewurl != undefined && _viewurl != "") {
								$dwp.core.portal.setDocPreViewInfo(_dopt);
								if (_selectMove(_viewurl)) return;
							}
							//마지막 Tab를 선택 Tab으로 선택
							var _$last = $("li[rel]:last", _$tabs)
								, _vopt2 = _$last.data(_me.CONST.TAB_LI_DATA);

							_me.selectTab(_vopt2);
						}
					}
				}
				, getTabCount: function () {
					var _me = this
						, _$tabs = $("ul.dwp-xtabs", _me.element);

					return $("li[rel]", _$tabs).size();
				}
				, destroy: function () {
					var _me = this;
					_me._super();
					//_me.element.remove();
				}
			})
		}
		/**
		 * 대상 element에 Tab Instance를 반환하는 함수
		 * @param	{object}	el	dom element or jquery selector
		 * @return	{object}	tab instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		},
		/**
		 * 대상 element Tab options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	tab options
		 */
		getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	_$$.tab._create();

	/**
	 * 권한 설정 다이얼로그
	 * @param	{object}	opt			options
	 * @param	{string}	opt.fld		저장필드명
	 */
	_$$.groupauth = function (opt) {
		var _me = this
			, _opt = $.extend({ target: $("body"), fld: "" }, opt)
			, _url = $fn.getProxyUrl("/dwp/com/sys/group_mn.nsf/wFrmCodeSel?ReadForm");

		$dwp.ui.dialog.init($(this), {
			title: $dwp.core.lang.getCodeMsg("그룹선택")
			, width: 400
			, modal: true
			, hide: { effect: "fade", duration: 300 }
			, show: { effect: "fade", duration: 300 }
			, content: { url: _url, data: {} }
			, buttons: [{
				title: $dwp.core.lang.getCodeMsg("확인")
				, highlight: true
				, click: function (_$dialog) {
					var _$tree = $("[name='tree']", _$dialog.element).xtree("instance")
						//,_dtnode = _$tree.getActiveNode();
						, _snodes = [], _snodes_nm = []
						, _dtnodes = _$tree.getSelectedNodes();

					//if(_dtnodes.length == 0){
					//	$fn.alert({msg : $fn.getCodeMsg("그룹을 선택해 주십시요!")});
					//	return false;
					//}

					$.each(_dtnodes, function (i, _dtnode) {
						if (!_dtnode.data.isFolder) {
							_snodes.push(_dtnode.data.fullinfo._code);
							_snodes_nm.push(_dtnode.data.fullinfo._name + "(" + _dtnode.data.fullinfo._code + ")");
						}
					});

					//if (_snodes.length == 0) {
					//	$fn.alert({msg : $fn.getCodeMsg("그룹을 선택해 주십시요!")});
					//	return false;
					//}

					//console.log("fullinfo",_dtnode.data.fullinfo);
					if (_opt.fld != "") {
						if ($("[name=" + _opt.fld + "]", _opt.target).size() > 0) {
							if (_snodes.length == 0) {
								$("[name=" + _opt.fld + "]", _opt.target).val("");
							} else {
								$("[name=" + _opt.fld + "]", _opt.target).val(_snodes.join(";"));
							}
						}
						if ($("[name=" + _opt.fld + "Nm]", _opt.target).size() > 0) {
							if (_snodes.length == 0) {
								$("[name=" + _opt.fld + "Nm]", _opt.target).val("");
							} else {
								$("[name=" + _opt.fld + "Nm]", _opt.target).val(_snodes_nm.join(","));
							}
						}
					}

					_$dialog.close();
				}
			}
				, {
				title: $dwp.core.lang.getCodeMsg("취소")
				, highlight: false
				, click: function (_$dialog) {
					_$dialog.close();
				}
			}
			]
		});

	}
	/**
	 * 대용량 첨부 다이얼로그 호출함수
	 * @param	{object}			opt							options
	 * @param	{function(*, *)}	opt.callback				대용량첨부후 수행함수
	 * @param	{object}			opt.callback.dialog			대용량첨부 다이얼로그 인스턴스
	 * @param	{array}				opt.callback.mega			대용량첨부파일 정보
	 * @param	{string}			opt.callback.mega.fileurl	대용량첨부파일URL
	 * @param	{string}			opt.callback.mega.filesize	대용량첨부파일크기
	 * @param	{string}			opt.callback.mega.filename	대용량첨부파일명
	 */
	_$$.megaattach = function (opt) {
		var _me = this
			, _opt = $.extend({}, opt)
			, _url = $fn.getProxyUrl($fn.getPath("gwlib") + "/wFrmMegaUpload?OpenForm");

		function megaAttachGetHtml(mega) {
			var _h = "", _t = "", _totalsize = 0, _totalcount = 0
				, _megahost = $fn.getSysinfo().megaserver
				, _megadownurl = $fn.getSysinfo().megadownurl;

			$.each(mega, function (i, o) {
				//대용량 첨부 솔루션 사용시
				if (_megahost != "" && _megadownurl != "") {
					o.fileurl = _megadownurl.replace("$filename$", encodeURIComponent(o.filename)).replace("$fileindex$", o.folder);
				}
				if (o.fileurl) {
					_totalsize += parseInt(o.filesize, 10);
					_totalcount += 1;
					if (_h == "") {
						_h = "<div style=\"padding: 8px 10px; color: #333; font-size: 13px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', 微软雅黑, sans-serif; cursor: pointer;\">";
						_h += "<a href='" + (_megahost + o.fileurl) + "' download target='_blank' style='text-decoration:none;color:black;cursor:pointer;'";
						_h += "onmouseover='this.style.textDecoration=\"underline\";this.style.color=\"blue\";' onmouseout='this.style.textDecoration=\"none\";this.style.color=\"black\";'>"
						_h += "<img src=\"" + $fn.getPath("weblib") + "/images/common/icon-download.png\" alt=\"\" style=\"width: 15px; height: 15px; margin-right: 5px;\">";
						_h += o.filename;
						_h += "<span style=\"margin-left: 5px; color: #666; font-size: 12px; font-weight: 400; font-family:'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', 微软雅黑, sans-serif;\">";
						_h += " (" + o.filesize.toSize() + ")</span>";
						_h += "</a></div>";
					} else {
						_h += "<div style=\"padding: 8px 10px; border-top: 1px solid #cfcfcf; color: #333; font-size: 13px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', 微软雅黑, sans-serif; cursor: pointer;\">";
						_h += "<a href='" + (_megahost + o.fileurl) + "' download target='_blank' style='text-decoration:none;color:black;cursor:pointer;'";
						_h += "onmouseover='this.style.textDecoration=\"underline\";this.style.color=\"blue\";' onmouseout='this.style.textDecoration=\"none\";this.style.color=\"black\";'>"
						_h += "<img src=\"" + $fn.getPath("weblib") + "/images/common/icon-download.png\" alt=\"\" style=\"width: 15px; height: 15px; margin-right: 5px;\">";
						_h += o.filename;
						_h += "<span style=\"margin-left: 5px; color: #666; font-size: 12px;font-weight: 400; font-family:'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', 微软雅黑, sans-serif;\">"
						_h += " (" + o.filesize.toSize() + ")</span>";
						_h += "</a></div>";
					}
				}
			});
			if (_totalcount > 0) {
				_t += "<p style=\"font-size:9pt;\">&nbsp;</p><p style=\"font-size:9pt;\">&nbsp;</p>";
				_t += "<div style=\"max-width: 736px;\">";
				_t += "<div style=\"overflow: hidden;\">";
				_t += "<div style=\"float: left; width_xx: 350px; color: #333; font-size: 14px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', 微软雅黑, sans-serif;\">";
				_t += "<img src=\"" + $fn.getPath("weblib") + "/images/common/icon-file.png\" alt=\"\" style=\"width: 15px; height: 15px;\">&nbsp;";
				_t += $fn.getCodeMsg("comm.title.js035");
				_t += "<span style=\"margin-left: 5px; color: #ed6c00; font-size: 12px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', 微软雅黑, sans-serif;\">";
				_t += "Total Size : " + _totalsize.toSize() + "</span>";
				_t += "</div>";
				_t += "<div style=\"float: right; width_x: 350px; color: #666; padding-top: 3px; font-size: 12px; font-family: 'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', 微软雅黑, sans-serif; text-align: right;\">";
				_t += $fn.getCodeMsg("comm.title.js008");
				_t += "</div></div>";
				_t += "<div style=\"max-width: 736px; margin-top: 8px; border: 1px solid #cfcfcf; border-top: 2px solid #ed6c00;\">" + _h + "</div>";
				_t += "</div>";
				_t += "<p style=\"font-size:9pt;\">&nbsp;</p>";
			}
			console.log("~~~~~~megaAttachGetHtml", _t);
			return _t;
		}

		var _buttons = [{
			"title": $fn.getCodeMsg("comm.btn.fileupload"),
			"click": function ($dialog) {
				$fn.block($dialog.element.parent(), { notusemsg: true });

				$dialog.element.doc("instance").attachSave().done(
					function (mega) {
						console.log("mega", mega);
						$fn.unblock($dialog.element.parent());
						if (typeof _opt.callback == "function") {
							_opt.callback($dialog, mega);
						} else {
							if (typeof _opt.docinst != undefined) {
								var _dom = $dwp.ui.weditor.getDom(_opt.docinst.element);
								if (_dom) {
									$("body", _dom).prepend(megaAttachGetHtml(mega));
								}
							}
						}
						$dialog.close();
					}
				).fail(function () {
					$fn.unblock($dialog.element.parent());
				});
			}
		},
		{
			"title": $fn.getCodeMsg("comm.btn.cancel"),
			"click": function ($dialog) {
				$dialog.close();
			}
		}];

		$fn.dialog(null, {
			modal: true,
			resizable: true,
			draggable: true,
			islangconvert: false,
			title: $fn.getCodeMsg("comm.title.megaattach"),
			width: 600,
			height: 410,
			show: 'fade',			//effect
			hide: 'fade',			//effect
			buttons: _buttons,
			content: { url: _url, data: {} }
		});

	};
	/**
	 * Table UI Widget
	 * @namespace
	 * @see	{@link module:core/ui/table|table widget}
	 */
	_$$.table = {
		_MODULE_NM: "dwp.xtable"
		, _PID: "dwp-xtable"
		/**
		 * Table UI Instance 생성함수
		 * @param	{object}	el						대상 Dom element or Jquery Selector
		 * @param	{object}	opt						options
		 * @param	{boolean}	[opt.ismobile=false]	mobile환경여부
		 * @return	{object}	table instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el), _$table = null
				, _opt = $.extend({ ismobile: false }, _par._default, opt);

			if (typeof $.fn.xtable == "undefined") {
				_par._create();
			}

			_$table = _$el;
			//_$table = $('<div id="' + _par._PID + '" title="Toast"></div>').appendTo($("body"));
			_$table.xtable(_opt);

			return _$table.xtable("instance");
		}
		/**
		 * Table UI Widget 생성
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Table Widget
			 * @module	core/ui/table
			 */
			$.widget(_par._MODULE_NM, /** @lends	module:core/ui/table */{
				/**
				 * Table UI Options
				 * @property	{boolean}			[isedit=true]				편집여부
				 * @property	{array}				cell						cell data 정의
				 * @property	{array}				keyfield					Key Field명
				 * @property	{string}			template					template selector
				 * @property	{string}			[total=[name=_ROW_TOTAL]]	합계용 row selector
				 * @property	{string}			[rowsplit=:]				row data 구분자
				 * @property	{string}			[cellsplit=†]				cell data 구분자
				 * @property	{string}			initdata					초기 data
				 * @property	{function(*, *, *)}	changebefore				수행전 호출함수
				 * @property	{string}			changebefore.act			수행구분(add, copy, del)
				 * @property	{object}			changebefore.tr				수행대상 tr
				 * @property	{object}			changebefore.table			table instance
				 * @property	{function(*, *, *)}	changeafter					수행후 호출함수
				 * @property	{string}			changeafter.act				수행구분(add, copy, del)
				 * @property	{object}			changeafter.tr				수행대상 tr
				 * @property	{object}			changeafter.table			table instance
				 * @property	{number}			[rowcnt=1]					반복 Row 수
				 */
				options: {
					isedit: true
					, cell: []				// Cell Data 정의
					, keyfield: []			// 값 중복체크에 사용
					, template: ""			// template selector
					, total: "[name=_ROW_TOTAL]"
					, rowsplit: ";"
					, cellsplit: "†"
					, initdata: ""
					, changebefore: null	// row 추가,삭제 전 호출함수
					, changeafter: null		// row 추가,삭제 후 호출함수
					, rowcnt: 1
					, maxrow: -1			// 제한없음
					, drawall: false		// Read시
					, isinit: true			// 초기 처리
				}
				, _CONST: { CELL: "_CELL_OPT" }
				, _create: function () {
					this._super();
				}
				, _init: function () {
					var _me = this
						, _$template = $(_me.options.template, _me.element);

					_me.options.rowcnt = _$template.size();

					if (!_me.options.isedit) {
						$("[name=_ROW_ADD]", _me.element).remove();
						$("[name=_ROW_DEL]", _me.element).remove();
						$("[name=_ROW_COPY]", _me.element).remove();
					}

					_me._drawing();

					_me.options.isinit = false;

					this._super();
				}
				, _drawing: function () {
					var _me = this
						, _$template = $(_me.options.template, _me.element);

					// ROW ADD Event
					if (_me.options.isedit) {
						$("th[name=_ROW_ADD]", _me.element).off("click").on("click", function () {
							_me.add();
						});
					}

					if (_me.options.initdata != "") {
						var dobj = _me._getStrToObj(_me.options.initdata);
						//console.log("dobj", dobj);
						/*
						$.each(dobj, function(i, o){
							_me.add(o);
						});
						*/
						if (!_me.options.isedit && _me.options.drawall) {
							_me._drawing_all(dobj);
						} else {
							for (var i = 0, max = dobj.length; i < max; i++) {
								_me.add(dobj[i]);
							}
						}
					}
				}
				, _drawing_all: function (dobj) {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$template = $(_me.options.template, _me.element)
						, _$total = $(_me.options.total, _me.element)
						, _html = "";

					function _cell_drawing(cell, trhtml, $tr) {
						var _h = "", _tdh = "", _rh = "";
						var _$cell = $("[name=" + cell.nm + "]", $tr);

						if (_$cell.size() == 0) return trhtml;

						_h = _$cell.get(0).outerHTML;
						_tdh = _h.replace(/(<td[^>]*?>)[\s\S]*?<\/td>/gi, "$1");

						if (typeof cell.drawfn_html == "function") {
							var _rtn = cell.drawfn_html(cell.val, _me);
							if (typeof _rtn == "string") {
								_rh = _tdh + _rtn + "</td>";
								trhtml = trhtml.replace(_h, _rh);
							} else {
								for (var i = 0, max = _rtn.length; i < max; i++) {
									_$cell = $("[name=" + _rtn[i].nm + "]", $tr);
									_h = _$cell.get(0).outerHTML;
									_tdh = _h.replace(/(<td[^>]*?>)[\s\S]*?<\/td>/gi, "$1");

									_rh = _tdh + _rtn[i].html + "</td>";
									trhtml = trhtml.replace(_h, _rh);
								}
							}
						} else {
							_rh = _tdh;
							_rh += "<div" + (cell.hasOwnProperty("css") && cell["css"] != "" ? " class='" + cell["css"] + "'>" : ">");
							if (cell.hasOwnProperty("val")) {
								_rh += cell.val;
							}
							_rh += "</div>"
							_rh += "</td>";

							trhtml = trhtml.replace(_h, _rh);
						}
						return trhtml;
					}

					function _add(o, idx) {
						var _o = _me._mergeData(o)
						var _h = "";

						$.each(_$template, function (k, $tr) {
							_h += "<tr name='_row_" + idx + "'>";
							_h += $($tr).html();
							_h += "</tr>";
						});

						for (var i = 0, max = _o.length; i < max; i++) {
							_h = _cell_drawing(_o[i], _h, _$template);
						}
						return _h;
					}

					for (var i = 0, max = dobj.length; i < max; i++) {
						_html += _add(dobj[i], i);
					}

					if (_$total.size() > 0) {
						$(_html).insertBefore(_$total.get(0));
					} else {
						$(_html).appendTo(_$tbody);
					}
				}
				, _cell_drawing: function (_$tr, cell) {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$template = $(_me.options.template, _me.element)
						, _$total = $(_me.options.total, _me.element)
						, _$cell = $("[name=" + cell.nm + "]", _$tr)
						, _h = "";

					//console.log("cell-data", cell);

					if (_$cell.size() == 0) return;

					_$cell.data(_me._CONST.CELL, cell);

					if (!cell.hasOwnProperty("type") || cell.type == "") return;

					if (cell.hasOwnProperty("val") && cell.hasOwnProperty("vfnm")) {
						if ($("[name=" + cell.vfnm + "]", _$tr).size() > 0) {
							$("[name=" + cell.vfnm + "]", _$tr).xval(cell.val);
						}
					}

					if (_me.options.isedit) {
						if (cell.type == "date") {
							if ($("input[type=text][data-type=date]", _$cell).hasClass("hasDatepicker")) {
								$("input[type=text][data-type=date]", _$cell).removeClass("hasDatepicker");
								$("input[type=text][data-type=date]", _$cell).removeAttr("id");
							}
							if ($("img.ui-datepicker-trigger", _$cell).size() > 0) {
								$("img.ui-datepicker-trigger", _$cell).remove();
							}
							$dwp.ui.datepicker(_$cell, {});
						} else if (cell.type == "date-fromto" && cell.hasOwnProperty("ftnm")) {
							var _$cells = $("[name=" + cell.nm + "],[name=" + cell.ftnm + "]", _$tr);
							//console.log("size:", _$cells.size());
							if ($("input[type=text][data-type=date]", _$cells).hasClass("hasDatepicker")) {
								$("input[type=text][data-type=date]", _$cells).removeClass("hasDatepicker");
								$("input[type=text][data-type=date]", _$cells).removeAttr("id");
							}
							if ($("img.ui-datepicker-trigger", _$cells).size() > 0) {
								$("img.ui-datepicker-trigger", _$cells).remove();
							}

							$dwp.ui.datepicker(_$cells, {});

						} else if (cell.type == "no") {
						} else if (cell.type == "org") {
						} else if (cell.type == "text") {

						}

						// Drawing 함수 호출
						if (typeof cell.drawfn == "function") {
							cell.drawfn(cell.val, _$cell, _$tr, _me);
						}

						$("[name=_ROW_DEL]", _$tr).off("click").on("click", function () {
							if (typeof _me.options.changebefore == "function") {
								if (!_me.options.changebefore("del", _$tr, _me)) { return; }
							}
							_$tr.remove();
							_me._setRowIndex();

							if (typeof _me.options.changeafter == "function") {
								_me.options.changeafter("del", null, _me);
							}
						});
						$("[name=_ROW_COPY]", _$tr).off("click").on("click", function () {
							_me.copy(_$tr);
							/*
							if ( typeof _me.options.changebefore == "function" ) {
								if ( !_me.options.changebefore("copy", _$tr, _me) ) { return; }
							}

							var _$ctr = null;
							if (_$total.size() > 0 ) {
								_$ctr = _$tr.clone(false).insertBefore(_$total.get(0));
							} else {
								_$ctr = _$tr.clone(false).appendTo(_$tbody);
							}
							_$ctr.attr("name", "_row_" + _me._getRowIndex());

							//Selectbox value setting
							var _$select = $("select", _$ctr)
							$.each($("select", _$tr), function(i, o){
								$(_$select.get(i)).val($(o).val());
							});

							$.each(_me.options.cell, function(i, o){
								_me._cell_drawing(_$ctr, o);
							});

							if ( typeof _me.options.changeafter == "function" ) {
								_me.options.changeafter("copy", _$ctr, _me);
							}
							*/
						});
					} else {
						if (typeof cell.drawfn == "function") {
							cell.drawfn(cell.val, _$cell, _$tr, _me);
						} else {
							_$cell.empty();
							if (cell.hasOwnProperty("val")) {
								_h = "<div>" + cell.val + "</div>";
							} else {
								_h = "<div></div>";
							}

							var _$div = $(_h).appendTo(_$cell);
							if (cell.hasOwnProperty("css")) {
								_$div.addClass(cell["css"]);
							}
						}
					}
				}
				/**
				 * Row Add
				 * @param	{object}	opt		options
				 * @param	{object}	xopt	추가 options
				 */
				, add: function (opt, xopt) {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$template = $(_me.options.template, _me.element)
						, _$total = $(_me.options.total, _me.element)
						, _opt = typeof opt == "undefined" ? _me.options.cell : _me._mergeData(opt)
						, _xopt = $.extend({ usebefore: true, useafter: true }, xopt)
						, _$tr = null;

					if (_me.options.maxrow > -1) {
						if (_me.options.maxrow < (_me._getRowIndex() + 1)) {
							$fn.alert({ msg: $fn.getCodeMsg("최대 건수를 초과하였습니다.") }); return;
						}
					}
					if (typeof _me.options.changebefore == "function") {
						if (_xopt.usebefore) {
							if (!_me.options.changebefore("add", _opt, _me)) { return; }
						}
					}

					if (_$total.size() > 0) {
						_$tr = _$template.clone(false).insertBefore(_$total.get(0)).css("display", "");
					} else {
						_$tr = _$template.clone(false).appendTo(_$tbody).css("display", "");
					}

					//_$tr.css("display", "");
					_$tr.attr("name", "_row_" + _me._getRowIndex());

					/*
					$.each(_opt, function(i, o){
						_me._cell_drawing(_$tr, o);
					});
					*/
					for (var i = 0, max = _opt.length; i < max; i++) {
						_me._cell_drawing(_$tr, _opt[i]);
					}

					if (typeof _me.options.changeafter == "function") {
						if (_xopt.useafter) {
							_me.options.changeafter("add", _$tr, _me);
						}
					}
					return _$tr;
				}
				/**
				 * Row 복사하기
				 */
				, copy: function (_$tr) {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$total = $(_me.options.total, _me.element)
						, _$ctr = null;

					if (_me.options.maxrow > -1) {
						if (_me.options.maxrow < (_me._getRowIndex() + 1)) {
							$fn.alert({ msg: $fn.getCodeMsg("최대 건수를 초과하였습니다.") }); return;
						}
					}

					if (typeof _me.options.changebefore == "function") {
						if (!_me.options.changebefore("copy", _$tr, _me)) { return; }
					}

					if (_$total.size() > 0) {
						_$ctr = _$tr.clone(false).insertBefore(_$total.get(0));
					} else {
						_$ctr = _$tr.clone(false).appendTo(_$tbody);
					}
					_$ctr.attr("name", "_row_" + (_me._getRowIndex() - 1));

					//Selectbox value setting
					var _$select = $("select", _$ctr)
					$.each($("select", _$tr), function (i, o) {
						$(_$select.get(i)).val($(o).val());
					});

					$.each(_me.options.cell, function (i, o) {
						_me._cell_drawing(_$ctr, o);
					});

					if (typeof _me.options.changeafter == "function") {
						_me.options.changeafter("copy", _$ctr, _me);
					}

					return _$ctr;
				}
				, insert: function (_$tr) {
					var _me = this,
						_$tbody = $("tbody", _me.element),
						_$template = $(_me.options.template, _me.element),
						_$total = $(_me.options.total, _me.element),
						_$itr = null;

					if (_me.options.maxrow > -1) {
						if (_me.options.maxrow < (_me._getRowIndex() + 1)) {
							$fn.alert({ msg: $fn.getCodeMsg("최대 건수를 초과하였습니다.") }); return;
						}
					}

					if (typeof _me.options.changebefore == "function") {
						if (!_me.options.changebefore("ins", _$tr, _me)) { return; }
					}

					_$itr = _$template.clone(false).insertAfter(_$tr).css("display", "");

					_$itr.attr("name", "_row_" + (_me._getRowIndex() - 1));

					_me._setRowIndex();

					$.each(_me.options.cell, function (i, o) {
						_me._cell_drawing(_$itr, o);
					});

					if (typeof _me.options.changeafter == "function") {
						if (_xopt.useafter) {
							_me.options.changeafter("ins", _$itr, _me);
						}
					}
				}
				, dblChk: function () {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$tr = null, _vKeys = [], _rtn = false;

					//if (!_me.options.isdblchk) return true;
					if (_me.options.keyfield.length == 0) return true;

					function _dblchk(v) {
						var _isfind = false;
						if (_vKeys.length > 0) {
							for (var i = 0; i < _vKeys.length; i++) {
								if (_vKeys[i] == v) { _isfind = true; break; }
							}
						}
						_vKeys.push(v);
						return _isfind;
					}

					for (var i = 0; i < _me._getRowIndex(); i++) {
						_$tr = $("tr[name=_row_" + i + "]", _$tbody);

						var skey = $.map(_me.options.keyfield, function (nm, i) {
							var _$fld = $("[name=" + nm + "]", _$tr);
							if (_$fld.size() > 0) {
								return _$fld.xval()
							} else {
								return ""
							}
						}).join("^");
						if (_dblchk(skey)) { _rtn = true; break; }
					}

					return _rtn;
				}
				, _getRowIndex: function () {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$tr = $("tr:not([name=_template])", _$tbody).not(_me.options.total);

					if (_$tr.size() == 0) {
						return 0;
					} else {
						return parseInt(_$tr.size() / _me.options.rowcnt);
					}
				}
				, _setRowIndex: function () {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$tr = $("tr:not([name=_template])", _$tbody).not(_me.options.total);

					if (_$tr.size() == 0) return;

					$.each(_$tr, function (i, o) {
						var _idx = parseInt(i / _me.options.rowcnt);
						$(o).attr("name", "_row_" + _idx);
					})
				}
				, _getStrToObj: function (strdata) {
					var _me = this
						, _robj = [], _tobj = null;

					if (strdata == "") return _robj;

					_tobj = strdata.split(_me.options.rowsplit);

					$.each(_tobj, function (i, o) {
						var _cobj = o.split(_me.options.cellsplit);
						var _cell = {};

						$.each(_me.options.cell, function (i, o) {
							_cell[o.nm] = _cobj[i]
						})
						_robj.push(_cell);
					});

					return _robj;
				}
				, _mergeData: function (data) {
					var _me = this
						, _rtn = [];
					//console.log("mmmmdata", data);
					/*
					$.each(_me.options.cell, function(i, o){
						var _o = $.extend({}, o);
						_o.val = data[_o.nm];
						_rtn.push(_o);
					})
					*/
					for (var i = 0, max = _me.options.cell.length; i < max; i++) {
						var _o = $.extend({}, _me.options.cell[i]);
						_o.val = data[_o.nm];
						_rtn.push(_o);
					}
					//console.log("_rtn", _rtn);
					return _rtn;
				}
				, getData: function (isvchk) {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$tr = null, _vRows = []
						, _isvchk = (typeof isvchk == "undefined" ? true : isvchk);

					for (var i = 0; i < _me._getRowIndex(); i++) {
						_$tr = $("tr[name=_row_" + i + "]", _$tbody);

						var vCells = [];
						var _isvaldate = true;
						$.each(_me.options.cell, function (i, cell) {
							var _$cell = $("[name=" + cell.nm + "]", _$tr)
								, _$fld = $("[name=" + cell.vfnm + "]", _$cell)
								, _val = "";

							if (_$fld.size() > 0) {
								_val = _$fld.xval()
							}

							vCells.push(_val);
							if (_isvchk) {
								if (cell.validator) {
									if (!cell.validator.test(_val)) { _isvaldate = false; return false; }
								}
							}
						})
						if (_isvchk) {
							if (_isvaldate) {
								_vRows.push(vCells.join(_me.options.cellsplit));
							}
						} else {
							_vRows.push(vCells.join(_me.options.cellsplit));
						}
					}
					return _vRows.join(_me.options.rowsplit);
				}
				, validate: function () {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$tr = null, _isvaldate = true;

					for (var i = 0; i < _me._getRowIndex(); i++) {
						_$tr = $("tr[name=_row_" + i + "]", _$tbody);

						$.each(_me.options.cell, function (i, cell) {
							var _$cell = $("[name=" + cell.nm + "]", _$tr)
								, _$fld = $("[name=" + cell.vfnm + "]", _$cell)
								, _val = "";

							if (_$fld.size() > 0) {
								_val = _$fld.xval()
							}

							//readonly 속성은 Validate 시 항상 리턴값을 넘김 - 2020.07.01 by dwlee
							if (_$fld.prop("readonly")) {
								return true;
							}

							if (cell.validator) {
								if (!cell.validator.test(_val)) {
									if (cell.hasOwnProperty("label") && cell.label != "") {
										var _msg = $fn.getCodeMsg(cell.label) + "[Line:" + (i + 1) + "]" + $fn.getCodeMsg("comm.title.vmsg");
										$fn.alert({ msg: _msg });
									}
									_isvaldate = false;
									return false;
								}
							}
						})
						if (!_isvaldate) { break; }
					}
					return _isvaldate;
				}
				, getTr: function () {
					var _me = this
						, _$tbody = $("tbody", _me.element)
						, _$tr = $("tr:not([name=_template])", _$tbody).not(_me.options.total);

					return _$tr;
				}
				, destroy: function () {
					var _me = this;
					_me._super();
					_me.element.remove();
				}

			});
		}
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		},
		getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	/**
	 * Page Block/처리하기
	 * @param	{object}	el						대상 dom element or jquery selector
	 * @param	{object}	opt						options
	 * @param	{boolean}	[opt.notusemsg=false]	메세지 표시여부
	 */
	_$$.block = function (el, opt) {
		var _opt = $.extend({ notusemsg: false }, opt)
			, _message = "";

		_message = '<h3 style="padding:10px;margin:0px;"><img src="' + $fn.getPath("weblib") + '/images/common/loading.gif" width="32px" height="32px"/>&nbsp;&nbsp;Please wait....</h3>';
		if (_opt.notusemsg) {
			_message = '<img src="' + $fn.getPath("weblib") + '/images/common/loading.gif" width="32px" height="32px"/>'
		}

		if (typeof el == "undefined") {
			$.blockUI({
				message: _message,
				overlayCSS: { backgroundColor: '#222222', opacity: .3 },
				css: { border: "0px", backgroundColor: "none" }
			});
		} else {
			$(el).block({
				message: _message,
				overlayCSS: { backgroundColor: '#222222', opacity: .3 },
				css: { border: "0px", backgroundColor: "none" }
			});
		}
	};
	/**
	 * Page UnBlock 처리하기
	 * @param	{object}	el	대상 dom element or jquery selector
	 */
	_$$.unblock = function (el) {
		if (typeof el == "undefined") {
			$.unblockUI();
		} else {
			$(el).unblock();
		}
	};
	/**
	 * 문서공유 다이얼로그 창열기
	 * @param	{object}	o	대상 dom element or jquery selector
	 * @param	{object}	opt	options
	 * @param	{string}	opt.bookinfo	공유문서정보
	 * @param	{string}	[opt.actiontype=SHARE]	공유유형
	 */
	_$$.shareddoc = function (o, opt) {
		var _opt = $.extend({ bookinfo: "", actiontype: "SHARE", svrnm: "" }, opt);

		if (_opt.ismobile) {
			// mobile 용
			$dwp.ui.dialog.init(o, {
				title: $fn.getCodeMsg("comm.title.js010")
				//,width : 736
				, position: ['center', 20]
				, modal: true
				, ismobile: true
				, width: '100%'
				, height: 'auto'
				, resizable: false
				, draggable: false
				, content: { url: $fn.getPath("gwlib") + "/wshared_mo?readform", data: {} }
				, initcallback: function (_$dialog) {
					var _$roomlist = $("div.society-area", _$dialog.element);
					var _deferreds = [];

					$fn.orgsel($("[name='org']", _$dialog.element)
						, { isedit: true, treetype: "0", seltype: "2", isseltype: false, fld: "Users", count: 99, ismobile: true });

					_deferreds.push(
						$dwp.core.util.xAjax({
							url: $fn.getProxyUrl("/dwp/com/appmng/vprj_mn.nsf/uservpr_info?openagent")
							, dataType: "json"
							, async: true
							, cache: false
							, data: { empno: $fn.getCurUser().pinfo.empno }
						})
					);
					_deferreds.push(
						$dwp.core.util.xAjax({
							url: $fn.getProxyUrl("/dwp/com/appmng/cops_mn.nsf/uservpr_info?openagent")
							, dataType: "json"
							, async: true
							, cache: false
							, data: { empno: $fn.getCurUser().pinfo.empno }
						})
					);

					$.when.apply($, _deferreds).done(function (vpr, cop) {
						// VPR
						$.each(vpr[0], function (i, o) {
							var _h = "<div class=\"item\">";
							_h += "<a class=\"item-wrap\">";
							_h += "<div class=\"title-area\">";
							//_h += "<img src='" + $fn.getPath("weblib") + "/images/dummy/project-room.png'>";
							_h += "<img src='" + $fn.getProxyUrl(o.img) + "'>";
							_h += "<div class='title-mask'>"
							_h += "<div class='title'>" + $fn.getCurLangMsg(o.nm) + "</div>";
							_h += "</div>";
							_h += "<div class='checked'><img src='" + $fn.getPath("weblib") + "/images/common/btn-confirm.svg'></div>";
							_h += "</div></a></div>";
							var _$item = $(_h).appendTo(_$roomlist);
							_$item.data("_ROOM_DATA", o);

							$fn.getImgError($("img", _$item), { src: $fn.getPath("weblib") + "/images/dummy/project-room.png" })
						});
						// COP
						$.each(cop[0], function (i, o) {
							var _h = "<div class=\"item\">";
							_h += "<a class=\"item-wrap\">";
							_h += "<div class=\"title-area\">";
							//_h += "<img src='" + $fn.getPath("weblib") + "/images/dummy/project-room.png'>";
							_h += "<img src='" + $fn.getProxyUrl(o.img) + "'>";
							_h += "<div class='title-mask'>"
							_h += "<div class='title'>" + $fn.getCurLangMsg(o.nm) + "</div>";
							_h += "</div>";
							_h += "<div class='checked'><img src='" + $fn.getPath("weblib") + "/images/common/btn-confirm.svg'></div>";
							_h += "</div></a></div>";
							var _$item = $(_h).appendTo(_$roomlist);
							_$item.data("_ROOM_DATA", o);

							$fn.getImgError($("img", _$item), { src: $fn.getPath("weblib") + "/images/dummy/project-room.png" })
						});
					});

					$(".dwp-tabs-simple", _$dialog.element).tabs({
						active: 0
					});
					$('.society-area .item-wrap', _$dialog.element).on('click', function () {
						$(this).closest('.item').toggleClass('active');
					});
				}
				, confirm: function (_$dialog) {
					var _rtnlist = [], _users = $("input[name='UsersFull']", _$dialog.element).val();
					var _v = null;

					if (_users != "") {
						$.each(_users.split(";"), function (i, o) {
							var _org = new _$$.org.data.org(o);
							_v = _org.oinfo.type + "^" + (_org.oinfo.type == "S" ? _org.oinfo.empno : _org.oinfo.orgcode) + "^" + _org.oinfo.key;
							_rtnlist.push(_v);
						});
					}

					$("div.society-area div.item.active", _$dialog.element).each(function () {
						var _o = $(this).data("_ROOM_DATA");
						_v = "R^" + _o.cd + "^" + _o.nm + "^" + _o.path + "^" + _o.server;
						_rtnlist.push(_v);
					});

					if (_rtnlist.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg030") });
						return;
					}

					$dwp.core.util.cmdPost(
						$dwp.core.util.getProxyUrl($fn.getPath("bookmark") + '/wfrmbook_post?createdocument')
						, {
							actiontype: _opt.actiontype
							, r_svr: _opt.svrnm
							, share: _rtnlist.join(";")
							, postdata: _opt.bookinfo
						}
						, function (data) {
							// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg031") })
										.done(function () {
											_$dialog.close();
										});
								} else {
									//error
								}
							} else {
								//error
							}
						}
						, 'json'
					);
				}
			});
		} else {
			$dwp.ui.dialog.init(o, {
				title: $fn.getCodeMsg("comm.title.js010")
				, width: 736
				, modal: true
				, content: { url: $fn.getPath("gwlib") + "/wshared?readform", data: {} }
				, initcallback: function (_$dialog) {
					var _$roomlist = $("div.bookmark-share-list.room", _$dialog.element);
					var _deferreds = [];

					$fn.orgsel($("[name='org']", _$dialog.element)
						, { isedit: true, treetype: "0", seltype: "2", isseltype: false, fld: "Users", count: 99 });

					/*
					$dwp.core.util.xAjax({
						url : $fn.getProxyUrl("/dwp/com/appmng/vprj_mn.nsf/uservpr_info?openagent")
						,dataType : "json"
						,async : false
						,cache : false
						,data : {empno : $fn.getCurUser().pinfo.empno}
					}).done(function(data){
						//{ "nm" : "VPRJ 2016 DEV","cd":"vprj_160001","path" : "/dwp/com/app/vprj/vprj_160001.nsf","img" : ""}
						$.each(data, function(i, o){
							var _h = "<div class=\"share-room\">";
							_h += "<div class=\"dwp-inner\">";
							//_h += "<img src='" + $fn.getPath("weblib") + "/images/dummy/project-room.png'>";
							_h += "<img src='" + $fn.getProxyUrl(o.img) + "'>";
							_h += "<div class='room-title'>"
							_h += "<div class='txt'>" + $fn.getCurLangMsg(o.nm) + "</div>";
							_h += "</div>";
							_h += "<div class='dwp-checkbox textless'><label><input type='checkbox'><span></span></label></div>";
							_h += "</div></div>";
							var _$item = $(_h).appendTo(_$roomlist);
							_$item.data("_ROOM_DATA", o);
							$fn.getImgError($("img", _$item), {src : $fn.getPath("weblib") + "/images/dummy/project-room.png"})
						});
					})
					*/
					_deferreds.push(
						$dwp.core.util.xAjax({
							url: $fn.getProxyUrl("/dwp/com/appmng/vprj_mn.nsf/uservpr_info?openagent")
							, dataType: "json"
							, async: true
							, cache: false
							, data: { empno: $fn.getCurUser().pinfo.empno }
						})
					);
					_deferreds.push(
						$dwp.core.util.xAjax({
							url: $fn.getProxyUrl("/dwp/com/appmng/cops_mn.nsf/uservpr_info?openagent")
							, dataType: "json"
							, async: true
							, cache: false
							, data: { empno: $fn.getCurUser().pinfo.empno }
						})
					);
					$.when.apply($, _deferreds).done(function (vpr, cop) {
						// vpr
						$.each(vpr[0], function (i, o) {
							var _h = "<div class=\"share-room\">";
							_h += "<div class=\"dwp-inner\">";
							//_h += "<img src='" + $fn.getPath("weblib") + "/images/dummy/project-room.png'>";
							_h += "<img src='" + $fn.getProxyUrl(o.img) + "'>";
							_h += "<div class='room-title'>"
							_h += "<div class='txt'>" + $fn.getCurLangMsg(o.nm) + "</div>";
							_h += "</div>";
							_h += "<div class='dwp-checkbox textless'><label><input type='checkbox'><span></span></label></div>";
							_h += "</div></div>";
							var _$item = $(_h).appendTo(_$roomlist);
							_$item.data("_ROOM_DATA", o);
							$fn.getImgError($("img", _$item), { src: $fn.getPath("weblib") + "/images/dummy/project-room.png" })
						});
						// cop
						$.each(cop[0], function (i, o) {
							var _h = "<div class=\"share-room\">";
							_h += "<div class=\"dwp-inner\">";
							//_h += "<img src='" + $fn.getPath("weblib") + "/images/dummy/project-room.png'>";
							_h += "<img src='" + $fn.getProxyUrl(o.img) + "'>";
							_h += "<div class='room-title'>"
							_h += "<div class='txt'>" + $fn.getCurLangMsg(o.nm) + "</div>";
							_h += "</div>";
							_h += "<div class='dwp-checkbox textless'><label><input type='checkbox'><span></span></label></div>";
							_h += "</div></div>";
							var _$item = $(_h).appendTo(_$roomlist);
							_$item.data("_ROOM_DATA", o);
							$fn.getImgError($("img", _$item), { src: $fn.getPath("weblib") + "/images/dummy/project-room.png" })
						});
					});
				}
				, buttons: [{
					title: $fn.getCodeMsg("comm.btn.confirm")
					, click: function (_$dialog) {
						var _rtnlist = [], _users = $("input[name='UsersFull']", _$dialog.element).val();

						if (_users != "") {
							$.each(_users.split(";"), function (i, o) {
								var _org = new _$$.org.data.org(o)
									, _v = _org.oinfo.type + "^" + (_org.oinfo.type == "S" ? _org.oinfo.empno : _org.oinfo.orgcode) + "^" + _org.oinfo.key
								_rtnlist.push(_v)
							});
						}

						$("div.share-room input[type='checkbox']:checked", _$dialog.element).each(function () {
							var _o = $(this).parents("div.share-room").data("_ROOM_DATA")
							_v = "R^" + _o.cd + "^" + _o.nm + "^" + _o.path + "^" + _o.server;
							_rtnlist.push(_v);
						})

						if (_rtnlist.length == 0) {
							$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg030") });
							return;
						}

						$dwp.core.util.cmdPost(
							$dwp.core.util.getProxyUrl($fn.getPath("bookmark") + '/wfrmbook_post?createdocument')
							, {
								actiontype: _opt.actiontype
								, r_svr: _opt.svrnm
								, share: _rtnlist.join(";")
								, postdata: _opt.bookinfo
							}
							, function (data) {
								// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg031") })
											.done(function () {
												_$dialog.close();
											});
									} else {
										//error
									}
								} else {
									//error
								}
							}
							, 'json'
						)
					}
				},
				{
					title: $fn.getCodeMsg("comm.btn.cancel")
					, click: function (_$dialog) {
						_$dialog.close();
					}
				}
				]
			});
			// pc end
		}
	};
	/**
	 * 조회로그 다이얼로그 창 열기
	 */
	_$$.openlog = function (o, opt) {

		var _opt = $.extend({}, opt);

		$dwp.ui.qtdialog.init(o, {
			qtid: "viewlog"
			, title: $dwp.core.lang.getCodeMsg("comm.title.js011")
			, width: 420
			, content: { html: "<div class='dwp-viewers-dialog'><div class='view-area'><div class='list'></div></div></div>" }
			, initcallback: function (_$qtdialog) {
				var _$list = $("div.list", _$qtdialog.element);

				$dwp.core.util.xAjax({
					url: _opt.eleopt.sublogdb + "/api/data/collections/name/wvReadUserLog?count=99"
					, dataType: "json"
					, async: false
					, cache: false
					, data: { entrycount: false, category: opt._key_unid }
				})
					.done(function (data) {
						$.each(data, function (i, o) {
							var _$item = null, _h = "<div class='item dwp-user dwp-cursor'>";
							_h += "<div class='name'>" + $fn.getCurLangMsg(o._readers) + "</div>";
							_h += "<div class='team'>" + $fn.getCurLangMsg(o._orgname) + "</div>";
							_h += "<div class='date'>" + $fn.formatDateTime(o._readdate) + "</div>";
							_h += "</div>";

							_$item = $(_h).appendTo(_$list);

							_$item.attr({ "data-empno": o._readersempno, "data-orgcode": o._readersorgcode })
								.off("click").on("click", function () {
									$dwp.ui.bizcard.init($(this));
								});
						});
					});
			}
			, buttons: [{
				title: "<img src='" + $fn.getPath("weblib") + "/images/common/btn-excel.png'/>" + $dwp.core.lang.getCodeMsg("엑셀다운로드")
				, click: function (_$qtdialog) {
					var _selection = "Root_UNID=\"" + _opt._key_unid + "\"";
					$dwp.core.util.exceldown({
						eventcode: "stboardlog.view", viewname: "wvReadUserLog",
						cdb: _opt.eleopt.sublogdb, applcode: _opt.eleopt.applcode, formula: _selection
					});
				}
				, css: "icon-type"
			}]
		});
	};
	/**
	 * Auth Widget
	 * @namespace
	 * @see	{@link module:core/ui/auth|Auth Widget}
	 */
	_$$.auth = {
		_MODULE_NM: "dwp.auth"
		/**
		 * Auth UI Instance 생성함수
		 * @param	{object}	el						대상 Dom element or Jquery Selector
		 * @param	{object}	opt						options
		 * @param	{boolean}	[opt.ismobile=false]	mobile환경여부
		 * @return	{object}	auth instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el)
				, _opt = $.extend({}, _par._default, opt);

			if (typeof $.fn.auth == "undefined") {
				_par._create();
			}
			_$el.auth(_opt);
			return _$el.auth("instance");
		}
		/**
		 * Auth UI Widget 생성함수
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Auth Widget
			 * @module	core/ui/auth
			 */
			$.widget(_par._MODULE_NM, /** @lends	module:core/ui/auth */{
				/**
				 * Auth Options
				 * @property	{boolean}	[isedit=true]	편집모드여부
				 */
				options: {
					isedit: true
					, fld: "_Users"
					, ids: ""
					, fulls: ""
					//회사코드정보 변경 - 2019-04-04 By LHJ
					//,comcode : $fn.getCurUser().pinfo.comcode
					, comcode: $fn.getComCode()
					, orgopt: { treetype: "0", seltype: "0", isseltype: true }
				}
				, _create: function () {

				}
				, _init: function () {
					var _me = this;

					// fix
					_me.options.orgopt.isedit = _me.options.isedit;
					_me.options.orgopt.fld = _me.options.fld;
					_me.options.orgopt.comcode = _me.options.comcode;

					var _$dids = $('input[name=' + _me.options.fld + '_Default]', _me.element);
					if (_$dids.size() == 1) {
						_me.options.ids = _$dids.xval();
					}
					var _$dfulls = $('input[name=' + _me.options.fld + 'Full_Default]', _me.element);
					if (_$dfulls.size() == 1) {
						_me.options.fulls = _$dfulls.xval();
					}

					_me._orgInit();
				}
				, _orgInit: function () {
					var _me = this
						, _h = "", _$org = null;

					_h = '<div name="org" data-type="org">';
					_h += '<input name="' + _me.options.fld + '" type="hidden" value=""/>'
					_h += '<input name="' + _me.options.fld + 'Full" type="hidden" value=""/>'
					if (_me.options.isedit) {
						_h += '<div name="orgsel_group" class="dwp-grouping expended">'
						_h += '<div>';
						_h += '<div class="dwp-namepicker-grouping">';
						_h += '<div class="dwp-input"><input name="qsearch" type="text" value=""/></div>';
						_h += '<div name="orgsel_btn" class="dwp-btn"><button type="button"><img src="' + $fn.getPath('weblib') + '/images/common/icon-namepicker.svg" /></button></div>';
						_h += '</div>';
						_h += '</div>';
						_h += '</div>';
					}
					_h += '<div class="namepicker-list"></div>';
					_h += '</div>';

					var _$org = $(_h).appendTo(_me.element);

					$('input[name=' + _me.options.fld + ']', _$org).xval(_me.options.ids);
					$('input[name=' + _me.options.fld + 'Full]', _$org).xval(_me.options.fulls);

					$fn.orgsel(_$org, _me.options.orgopt);
				}
				, getAuthInfo: function () {
					var _me = this
						, _authinfo = { org: { ids: "", fulls: "" } };

					_authinfo.org.ids = $('input[name=' + _me.options.fld + ']', _me.element).xval();
					_authinfo.org.fulls = $('input[name=' + _me.options.fld + 'Full]', _me.element).xval();

					return _authinfo;
				}
			})
		}
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		},
		getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	/**
	 * 다국어 입력 UI Widget
	 * @namespace
	 * @see {@link module:core/ui/multilang|MultiLang Widget}
	 */
	_$$.multilang = {
		_MODULE_NM: "dwp.multilang"
		, _default: {}
		/**
		 * MultiLang UI Instance 생성함수
		 * @param	{object}	el						대상 Dom element or Jquery Selector
		 * @param	{object}	opt						options
		 * @return	{object}	multilang instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el)
				, _opt = $.extend({}, _par._default, opt);

			if (typeof $.fn.multilang == "undefined") {
				_par._create();
			}
			_$el.multilang(_opt);
			return _$el.multilang("instance");
		}
		/**
		 * MultiLang UI Widget 생성함수
		 */
		, _create: function () {
			var _par = this;
			/**
			 * MultiLang UI Widget
			 * @module	core/ui/multilang
			 */
			$.widget(_par._MODULE_NM, /** @lends	module:core/ui/multilang */{
				/**
				 * MultiLang UI Widget Options
				 * @property	{object}	langcode	사용할 언어코드{"언어코드" : "언어명"}
				 * @property	{string}	fld			저장할 필드명
				 * @property	{boolean}	isedit		편집여부
				 */
				options: {
					langcode: $dwp.core.getSysinfo().lang_code
					, fld: ""
					, isedit: true
					, onchange: null		// 2020-09-01 By LHJ onChange Callback 함수추가
				}
				, _create: function () {
				}
				/**
				 * Widget 초기처리
				 */
				, _init: function () {
					var _me = this
						, _$pdiv = $("<div class='dwp-grouping'><div class='select-group'><div class='dwp-selectbox md'></div></div><div class='dwp-input expended'><div class='dwp-input-grouping'><div class='dwp-input'></div><div class='dwp-btn'></div></div></div></div>").appendTo(_me.element)
						, _$ddiv = $("<div class='dwp-lang-wrap' style='margin-top:3px;'>").appendTo(_me.element)

						, _$select = $("<select></select>").appendTo($("div.dwp-selectbox", _$pdiv))
						, _$inp = $("<input type='text'>").appendTo($("div.dwp-input-grouping div.dwp-input", _$pdiv))
						, _$btn = $("<button class='confirm-btn' />").appendTo($("div.dwp-btn", _$pdiv))
						, _$opt = null;

					$.each(_me.options.langcode, function (p, v) {
						_$opt = $("<option/>").appendTo(_$select);
						_$opt.text(v);
						_$opt.val(p);
					});

					_$inp.off("keydown").on("keydown", function (e) {
						if (e.keyCode != 13) { return; }

						var _name = $("option:selected", _$select).text()
							, _code = $("option:selected", _$select).val()
							, _text = _$inp.val();

						if (_text == "") return;

						// Display
						_me._drawData({ name: _name, code: _code, text: _text });

						// Field 값 설정
						_me._setField();

						_$inp.val("");

						// 2020-09-01 By LHJ onChange Callback 함수추가
						if (typeof _me.options.onchange == "function") {
							var _v = _me._getData();
							_me.options.onchange(_v, _me);
						}
					});

					_$btn.text($fn.getCodeMsg("comm.btn.confirm"))
						.on("click", function () {
							var _name = $("option:selected", _$select).text()
								, _code = $("option:selected", _$select).val()
								, _text = _$inp.val();

							if (_text == "") return;

							// Display
							_me._drawData({ name: _name, code: _code, text: _text });

							// Field 값 설정
							_me._setField();

							_$inp.val("");

							// 2020-09-01 By LHJ onChange Callback 함수추가
							if (typeof _me.options.onchange == "function") {
								var _v = _me._getData();
								_me.options.onchange(_v, _me);
							}
						});

					_me._loadData();
				}
				, _loadData: function () {
					var _me = this
						, _$ddiv = $("div.dwp-lang-wrap", _me.element)
						, _$fld = $("input[name='" + _me.options.fld + "']", _me.element)
						, _langobj = {};

					if (_$fld.size() == 0) return;
					if (_$fld.val() == "") return;

					_langobj = $dwp.core.lang.strToObj(_$fld.val());

					$.each(_langobj, function (p, v) {
						var _data = {};
						_data.code = p;
						_data.name = _me.options.langcode[p];
						_data.text = v;
						_me._drawData(_data);
					});
				}
				, _drawData: function (data) {
					var _me = this
						, _$ddiv = $("div.dwp-lang-wrap", _me.element)
						, _h = "", _$fobj = null, _$item = null;

					_$fobj = _me._isfind(data);
					if (_$fobj == null) {
						_h = "<div class='dwp-language-item'>";
						_h += "<span>" + data.name + ":" + data.text + "</span>";
						_h += "<a class='btn-del'><img src='" + $fn.getPath("weblib") + "/images/common/icon-close.svg'></a>";
						_h += "</div>";

						_$item = $(_h).appendTo(_$ddiv)
							.data("_LANG_DATA", data);

						$("a.btn-del", _$item).on("click", function () {
							_$item.remove();
							_me._setField();
						});

						_$item.off("click").on("click", function () {
							$("select>option[value=" + data.code + "]", _me.element).prop("selected", true);
							$(".dwp-input input", _me.element).xval(data.text);
						});

					} else {
						$("span", _$fobj).text(data.name + ":" + data.text);
						_$fobj.data("_LANG_DATA", data);
					}
				}
				, _isfind: function (data) {
					var _me = this
						, _$ddiv = $("div.dwp-lang-wrap", _me.element)
						, _$rtn = null;

					$("div.dwp-language-item", _$ddiv).each(function (o) {
						var _data = $(this).data("_LANG_DATA");
						if (_data.code == data.code) {
							_$rtn = $(this);
							return false;
						}
					});
					return _$rtn;
				}
				, _setField: function () {
					var _me = this
						, _$ddiv = $("div.dwp-lang-wrap", _me.element)
						, _$fld = $("input[name='" + _me.options.fld + "']", _me.element)
						, _val = [];

					if (_$fld.size() == 0) return;
					//if (_$fld.val() == "") return;

					$("div.dwp-language-item", _$ddiv).each(function (o) {
						var _data = $(this).data("_LANG_DATA");
						_val.push(_data.code + ":" + _data.text);
					});

					if (_val.lenght == 0) {
						_$fld.val("");
					} else {
						_$fld.val(_val.join(","));
					}
				}
				// 2020-09-01 By LHJ 설정 Data 가져오는 함수추가
				, _getData: function () {
					var _me = this
						, _$ddiv = $("div.dwp-lang-wrap", _me.element)
						, _val = [];

					$("div.dwp-language-item", _$ddiv).each(function (o) {
						var _data = $(this).data("_LANG_DATA");
						_val.push(_data.code + ":" + _data.text);
					});

					return _val;
				}
			});
		}
		/**
		 * 대상 element에 Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		},
		/**
		 * 대상 element에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	options
		 */
		getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	/**
	 * Scroll UI 처리함수
	 * @param	{object}	el		dom element or query selector
	 * @param	{object}	opt		options
	 */
	_$$.scroll = function (el, opt) {
		var _$el = $(el), _opt = $.extend({ theme: "minimal-dark", advanced: { autoScrollOnFocus: false, updateOnImageLoad: true } }, opt);

		function _init() {
			if (_$el.hasClass("mCustomScrollbar")) {
				_$el.mCustomScrollbar("update");
			} else {
				_$el.mCustomScrollbar(_opt);
			}
		}

		if (typeof $.fn.mCustomScrollbar == "undefined") {
			$.getScript($fn.getPath("weblib") + "/js/lib/mcustomscrollbar/jquery.mCustomScrollbar.concat.min.js")
				.done(function () {
					_init();
				});
		} else {
			_init();
		}
	};
	/**
	 * NScroll UI 처리함수
	 * @namespace
	 */
	_$$.nscroll = {
		/**
		 * Default Options
		 * @property	{string}	[cursorcolor=rgba(0,0,0,0.3)]
		 * @property	{string}	[cursorwidth=6px]
		 */
		_DEFAULT: {
			cursorcolor: "rgba(0,0,0,0.3)"
			, cursorwidth: "6px"
		},
		/**
		 * NScroll UI 모듈 초기화함수
		 */
		_init: function (cfunc) {
			if (typeof ($.fn.niceScroll) != "function") {
				$.getScript($fn.getPath("weblib") + "/js/lib/jquery.nicescroll.min.js")
					.done(function () {
						if (typeof (cfunc) == "function") { cfunc(); }
					});
			} else {
				if (typeof (cfunc) == "function") { cfunc(); }
			}
		},
		/**
		 * NScroll UI 생성함수
		 * @param	{object}	el		dom element or query selector
		 * @param	{object}	opt		options
		 */
		create: function (el, opt) {
			var _opt = {};
			$.extend(true, _opt, this._DEFAULT, opt);

			this._init(function () {
				var _nice = $(el).niceScroll(_opt);
				if (typeof (_opt.callback) == "function") { _opt.callback(_nice); }
			});
		},
		/**
		 * NScroll Instance 가져오기
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	NScroll Instance
		 */
		getScroll: function (el) {
			return $(el).getNiceScroll();
		},
		/**
		 * NScroll Resizing
		 * @param	{object}	el		dom element or query selector
		 */
		resize: function (el) {
			var _scroll = this.getScroll(el);
			if (_scroll.length > 0) {
				_scroll.resize();
			}
		}
		, scrollstart: function (el, callback) {
			var _scroll = this.getScroll(el);
			if (_scroll.length > 0) {
				_scroll.scrollstart(function (info) { callback(info) });
			}
		}
	};
	/**
	 * 모바일 Button생성함수
	 * @param	{object}	el						대상 dom element or query selector
	 * @param	{object}	opt						options
	 * @param	{array}		opt.buttons				버튼 설정정보
	 * @param	{string}	opt.buttons.title		버튼명
	 * @param	{object=}	opt.buttons.data		버튼클릭 함수에 전달할 Data
	 * @param	{function(*)}	opt.buttons.click	버튼클릭 처리함수
	 * @param	{object=}	opt.buttons.click.data
	 * @param	{string=}	opt.buttons.icon		버튼아이콘
	 * @param	{string=}	opt.buttons.css			버튼CSS
	 * @param	{object=}	opt.buttons.attr		버튼속성
	 * @param	{boolean}	[opt.isedit=false] 		편집상태여부
	 */
	_$$.mbutton = function (el, opt) {
		var _me = this, _$el = null, _opt = $.extend({ buttons: [], isedit: false }, opt);

		_$el = $(el);
		//_$btnwrap = $("<div class='dwp-grouping'></div>").appendTo(_$el);
		//console.log("b",_opt.buttons) ;
		$.each(_opt.buttons, function (p, o) {
			var _$dropbtn = null, _$ul = null, _$btndiv = null, _$btn = null, _$btntrigger = null, i = 0;

			if (!$.isArray(_opt.buttons) && p.indexOf("grouping_") > -1) {
				_$dropbtn = $("<div class='header-group'></div>").appendTo(_$el);
				//_$dropbtn = $("<div class='view-trigger'></div>").appendTo(_$dropbtn);
				if (_opt.isedit) {
					_$dropbtn.append("<a><img src='" + $fn.getPath("weblib") + "/images/common/icon-more-w.svg'></a>");
				} else {
					_$dropbtn.append("<a><img src='" + $fn.getPath("weblib") + "/images/common/icon-more.svg'></a>");
				}

				_$dropbtn.off("click").on("click", function () {
					_me.qtdialog.init(_$dropbtn, {
						qtid: "mbtn_group"
						, dialogClass: 'titleless dropdown-type-dialog'
						, width: "120px"
						, position: { my: "right top", at: "right bottom", collision: "flipfit" }
						, initcallback: function (_$qtdialog) {
							var i = 0;
							var _$ul = $("<ul class='dwp-option-list'></ul>").appendTo(_$qtdialog.element);
							$.each(o, function (_p, _o) {
								var _$btn = $("<li><span type='button'>" + _o.title + "</span></li>").appendTo(_$ul);
								_$btn.off("click").on("click", function () {
									_$qtdialog.close();
									$(this).prop("disabled", true);
									if (typeof _opt.data == "undefined") {
										_o.click.call(this);
									} else {
										if ($.isArray(_opt.data)) {
											_o.click.apply(this, opt.data);
										} else {
											_o.click.call(this, opt.data);
										}
									}
									//_$dropbtn.removeClass("active");
									$(this).prop("disabled", false);
								});
							});
						}
					});
				});

			} else {
				if (o.hasOwnProperty("icon") && o.icon != "") {
					_$btn = $("<div class='header-group " + (o.hasOwnProperty("css") && o.css != "" ? o.css : "") + "'><a><img src='" + o.icon + "'/></a></div>").appendTo(_$el);
					_$btn.attr("title", o.title);
				} else {
					_$btn = $("<div class='header-group " + (o.hasOwnProperty("css") && o.css != "" ? o.css : "") + (o.hasOwnProperty("highlight") && o.highlight ? " strong" : "") + "'><a>" + o.title + "</a></div>").appendTo(_$el);
				}

				if (o.hasOwnProperty("att")) {
					_$btn.attr(o.att);
				}

				if (typeof o.click == "function") {
					_$btn.off("click").on("click", function () {
						//o.click(_opt.data);
						$(this).prop("disabled", true);
						if (typeof _opt.data == "undefined") {
							o.click.call(this);
						} else {
							if ($.isArray(_opt.data)) {
								o.click.apply(this, opt.data);
							} else {
								o.click.call(this, opt.data);
							}
						}
						$(this).prop("disabled", false);
					});
				}
			}
		});
	};
	/**
	 * Button생성함수
	 * @param	{object}	el						대상 dom element or query selector
	 * @param	{object}	opt						options
	 * @param	{array}		opt.buttons				버튼 설정정보
	 * @param	{string}	opt.buttons.title		버튼명
	 * @param	{object=}	opt.buttons.data		버튼클릭 함수에 전달할 Data
	 * @param	{function(*)}	opt.buttons.click	버튼클릭 처리함수
	 * @param	{object=}	opt.buttons.click.data
	 * @param	{string=}	opt.buttons.icon		버튼아이콘
	 * @param	{string=}	opt.buttons.css			버튼CSS
	 * @param	{object=}	opt.buttons.attr		버튼속성
	 * @param	{boolean}	opt.isedit=false 		편집상태여부
	 */
	_$$.button = function (el, opt) {
		var _me = this, _$el = null, _opt = $.extend({ buttons: [] }, opt);

		_$el = $(el);
		//_$btnwrap = $("<div class='dwp-grouping'></div>").appendTo(_$el);

		$.each(_opt.buttons, function (p, o) {
			var _$dropbtn = null, _$ul = null, _$btndiv = null, _$btn = null, _$btntrigger = null, i = 0, _h = "";

			if (!$.isArray(_opt.buttons) && p.indexOf("grouping_") > -1) {
				_$dropbtn = $("<div class='dwp-dropdown'></div>").appendTo(_$el);
				_$ul = null;
				i = 0;

				var _first = o[Object.keys(o)[0]];
				_$btndiv = $("<div class='dropdown-inner'></div>").appendTo(_$dropbtn);
				_$btn = $("<a class='main-btn'>" + _first.title + "</a>").appendTo(_$btndiv);
				_$trigger = $("<a class='trigger'><img src='" + $dwp.core.getPath("weblib") + "/images/common/arrow-down.svg'/></a>").appendTo(_$btndiv)
					.off("click").on("click", function () {
						// Drop Down Button 처리
						_me.qtdialog.init(_$dropbtn, {
							qtid: "btn_group"
							, dialogClass: 'titleless dropdown-type-dialog'
							, width: "auto"
							, position: { my: "left top", at: "left bottom", collision: "flipfit" }
							, initcallback: function (_$qtdialog) {
								var i = 0;
								var _$ul = $("<ul class='dwp-option-list'></ul>").appendTo(_$qtdialog.element);
								$.each(o, function (_p, _o) {
									var _$btn;
									if (i > 0) {
										_$btn = $("<li><span type='button'>" + _o.title + "</span></li>").appendTo(_$ul);
										_$btn.off("click").on("click", function () {
											_$qtdialog.close();
											$(this).prop("disabled", true);
											if (typeof _opt.data == "undefined") {
												_o.click.call(this);
											} else {
												if ($.isArray(_opt.data)) {
													_o.click.apply(this, opt.data);
												} else {
													_o.click.call(this, opt.data);
												}
											}
											_$dropbtn.removeClass("active");
											$(this).prop("disabled", false);
										});
									}
									i++;
								});
							}
						});

					});

				if (typeof _first.click == "function") {
					_$btn.off("click").on("click", function () {
						//o.click(_opt.data);
						$(this).prop("disabled", true);
						if (typeof _opt.data == "undefined") {
							_first.click.call(this);
						} else {
							if ($.isArray(_opt.data)) {
								_first.click.apply(this, opt.data);
							} else {
								_first.click.call(this, opt.data);
							}
						}
						_$dropbtn.removeClass("active");
						$(this).prop("disabled", false);
					});
				}

				/*
				$.each(o, function(_p, _o){
					if (i == 0) {
						_$btndiv = $("<div class='dropdown-inner'></div>").appendTo(_$dropbtn);
						_$btn = $("<a class='main-btn'>" + _o.title + "</a>").appendTo(_$btndiv);
						_$trigger = $("<a class='trigger'><img src='" + $dwp.core.getPath("weblib") + "/images/common/arrow-down.svg'/></a>").appendTo(_$btndiv)
						.off("click").on("click", function(){
							_$dropbtn.toggleClass("active");
						});
					} else {
						_$ul = $("ul.dwp-option-list", _$dropbtn);
						if( _$ul.size() == 0 ) {
							_$ul = $("<ul class='dwp-option-list'></ul>").appendTo(_$dropbtn);
						}
						_$btn = $("<li><button type='button'>" + _o.title + "</button></li>").appendTo(_$ul);

					}
					if( typeof _o.click == "function" ) {
						_$btn.off("click").on("click", function(){
							//o.click(_opt.data);
							$(this).prop("disabled", true);
							if ( typeof _opt.data == "undefined" ) {
								_o.click.call(this);
							} else {
								if ($.isArray(_opt.data)) {
									_o.click.apply(this, opt.data) ;
								} else {
									_o.click.call(this, opt.data) ;
								}
							}
							_$dropbtn.removeClass("active");
							$(this).prop("disabled", false);
						});
					}
					i++;
				})
				*/


			} else {
				if (o.hasOwnProperty("icon") && o.icon != "") {
					_$btn = $("<div class='dwp-btn icon " + (o.hasOwnProperty("css") && o.css != "" ? o.css : "") + "'><span><img src='" + o.icon + "'/></span></div>").appendTo(_$el);
					_$btn.attr("title", o.title);
				} else {
					_$btn = $("<div class='dwp-btn " + (o.hasOwnProperty("css") && o.css != "" ? o.css : "") + (o.hasOwnProperty("highlight") && o.highlight ? " strong" : "") + "'><span>" + o.title + "</span></div>").appendTo(_$el);
				}
				if (o.hasOwnProperty("att")) { _$btn.attr(o.att); }

				if (typeof o.click == "function") {
					_$btn.off("click").on("click", function (e) {
						e.preventDefault();
						$(this).prop("disabled", true);
						if (typeof _opt.data == "undefined") {
							o.click.call(this);
						} else {
							if ($.isArray(_opt.data)) {
								if (_opt.data[0].hasOwnProperty("options")) {
									if (_opt.data[0].options.hasOwnProperty("_isloading")) {
										if (!_opt.data[0].options._isloading) return;
									}
								}
								o.click.apply(this, opt.data)
							} else {
								if (_opt.hasOwnProperty("data")) {
									if (_opt.data.hasOwnProperty("options")) {
										if (_opt.data.options.hasOwnProperty("_isloading")) {
											if (!_opt.data.options._isloading) return;
										}
									}
								}
								o.click.call(this, opt.data)
							}
						}
						$(this).prop("disabled", false);
					});
				}
			}
		});
	};
	_$$.__button = function (el, opt) {
		var _$el = null, _opt = $.extend({ buttons: [] }, opt), _$btnwrap;

		//if( !el) console.log("error", "Param Error(el)"); return;
		if (!$.isArray(_opt.buttons)) return;
		if (_opt.buttons.length == 0) return;

		_$el = $(el);
		_$btnwrap = $("<div class='dwp-grouping'></div>").appendTo(_$el);

		$.each(_opt.buttons, function (i, o) {
			var _$btn = null;
			_$btn = $("<div class='dwp-btn " + o.css + "'><button type='button'>" + (o.hasOwnProperty("icon") && o.icon != "" ? "<img src='" + o.icon + "'/>" : "") + o.title + "</button></div>").appendTo(_$btnwrap);

			if (typeof o.click == "function") {
				_$btn.off("click").on("click", function () {
					o.click(_opt.data);
				});
			}
		});
	};
	_$$.autocomplete = {
		_MODULE_NM: "dwp.xautocomplete"
		, _default: {}
		, init: function (el, opt) {
			var _par = this, _$el = $(el)
				, _opt = $.extend({}, _par._default, opt);

			if (typeof $.fn.xautocomplete == "undefined") {
				_par._create();
			}
			//console.log('aa')
			_$el.xautocomplete(_opt);
			//console.log('bb')
			return _$el.xautocomplete("instance");
		}
		, _create: function () {
			var _par = this;
			$.widget(_par._MODULE_NM, $.ui.autocomplete, {
				options: {
					stype: ""		//	사용자, 부서, 사용자+부서
				}
				, _create: function () {
					this._super();
				}
				, _init: function () {
					this._super();
				}
			});
		}
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		},
		getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	/**
	 * Toast UI Widget
	 * @namespace
	 * @see	{@link module:core/ui/toast|Toast Widget}
	 */
	_$$.toast = {
		_MODULE_NM: "dwp.toast"
		, _PID: "dwp-toast"
		/**
		 * Toast UI Instance 생성함수
		 * @param	{object}	el					대상 Dom element or Jquery Selector
		 * @param	{object}	opt					options
		 * @param	{boolean}	opt.ismobile=false	mobile환경여부
		 * @return	{object}	toast instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el), _$toast = null
			_opt = $.extend({ ismobile: false }, _par._default, opt);;

			_opt.target = _$el;

			if (typeof $.fn.toast == "undefined") {
				_par._create();
			}
			_$toast = $('<div id="' + _par._PID + '" title="Toast"></div>').appendTo($("body"));
			_$toast.toast(_opt);

			return _$toast.toast("instance");
		}
		/**
		 * Toast UI Widget 생성
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Toast Widget
			 * @module	core/ui/toast
			 */
			$.widget(_par._MODULE_NM, $.ui.dialog, /** @lends	module:core/ui/toast */{
				/**
				 * Toast Widget UI Options
				 * @property	{object}	show={ effect: "fade", duration: 300 }			show options
				 * @property	{object}	hide={ effect: "fade", duration: 300 }			hide options
				 * @property	{object}	position={at:"center", my:"center", of:window}	표시 위치
				 * @property	{number}	width=420		Width
				 * @property	{string}	msg				Message
				 * @property	{number}	timeout=1500	표시시간(ms)
				 * @property	{function(*)}	callback	숨김처리 후 호출함수
				 * @property	{object}	callback.toast	toast instance
				 */
				options: {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					, resizable: false
					, draggable: false
					, position: { at: "center", my: "center", of: window }
					, width: 420
					, icon: $fn.getPath("weblib") + "/images/common/icon-checked.png"
					, msg: ""
					, timeout: 1500
					, ismobile: false
					, timer: null
					, target: null
					, callback: null
				}
				, _create: function () {
					this._super();
				}
				/**
				 * 초기화 처리함수
				 */
				, _init: function () {
					var _me = this;

					_me.element.parent().addClass("titleless");
					_me.element.parent().addClass("btnless");

					var _h = "<div class='dwp-alert-toast'>"
					_h += "<div class='dwp-alert-inner'>"
					_h += "<div class='dwp-icon-area'><div class='icon'><img src='" + _me.options.icon + "'></div></div>";
					_h += "<div class='dwp-msg-area'>" + _me.options.msg + "</div>";
					_h += "</div></div>";

					_me.element.html(_h);

					_me.options.timer = setTimeout(function () {
						console.log("Toast close");
						_me.close();
						if (typeof _me.options.callback == "function") {
							console.log("window close");
							_me.options.callback(_me);
						}
					}, _me.options.timeout);


					if (!_me.options.ismobile) {
						/*
						$("body").off("click." + _par._PID).on("click." + _par._PID, function(e) {
							if ( !$.contains($("#" + _par._PID).parent(".ui-dialog").get(0), e.target) ) {
								_me.destroy();
								$("#" + _par._PID).remove();
								$("body").off("click." + _par._PID);
							}
						});
						*/
					}

					this._super();
				}
				/**
				 * toast close 함수
				 */
				, close: function () {
					var _me = this;
					_me._super();
					$("body." + _par._PID).off("click");
					if (_me.options.timer) {
						clearTimeout(_me.options.timer);
					}
					_me.destroy();
				}
				/**
				 * toast destroy 함수
				 */
				, destroy: function () {
					var _me = this;
					_me._super();
					_me.element.remove();
				}

			});
		}
		/**
		 * 대상 element에 Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		},
		/**
		 * 대상 element에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	options
		 */
		getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	}
	/**
	 * Web PushToast UI Widget
	 * @namespace
	 * @see	{@link module:core/ui/pushtoast|PushToast Widget}
	 */
	_$$.pushtoast = {
		_MODULE_NM: "dwp.pushtoast"
		, _PID: "dwp-pushtoast"
		/**
		 * Web PushToast UI Instance 생성함수
		 * @param	{object}	el					대상 Dom element or Jquery Selector
		 * @param	{object}	opt					options
		 * @param	{boolean}	opt.ismobile=false	mobile환경여부
		 * @return	{object}	pushtoast instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el), _$toast = null
			_opt = $.extend({ ismobile: false }, _par._default, opt);;

			_opt.target = _$el;

			if (typeof $.fn.pushtoast == "undefined") {
				_par._create();
			}
			_$toast = $('<div id="' + _par._PID + '" title="Toast"></div>').appendTo($("body"));
			_$toast.pushtoast(_opt);

			return _$toast.pushtoast("instance");
		}
		/**
		 *	Web PushToast UI Widget 생성
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Web PushToast UI Widget
			 * @module	core/ui/pushtoast
			 */
			$.widget(_par._MODULE_NM, $.ui.dialog, /** @lends	module:core/ui/pushtoast */{
				/**
				 * PushToast Widget UI Options
				 * @property	{object}	show={ effect: "fade", duration: 300 }			show options
				 * @property	{object}	hide={ effect: "fade", duration: 300 }			hide options
				 * @property	{object}	position={at:"right bottom", my:"right bottom", of:window }	표시 위치
				 * @property	{number}	width=460		Width
				 * @property	{number}	height=240		Height
				 * @property	{string}	sender			Push 발신자 사번
				 * @property	{string}	msg				Message
				 * @property	{string}	link			메세지 클릭 시 호출 URL
				 * @property	{string}	linktype		메세지 클릭 시 호출 유형(doclink, inlink, exlink)
				 * @property	{number}	timeout=1500	표시시간(ms)
				 */
				options: {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					, resizable: false
					, draggable: false
					, position: { at: "right bottom", my: "right bottom", of: window }
					, width: 460
					, height: 240
					, title: $fn.getCodeMsg('portal.title.toast_alarm')
					, sender: ""
					, msg: ""
					, link: ""
					, linktype: ""
					, moveClick: null
					, timeout: 1500
					, ismobile: false
					, timer: null
					, target: null
				}
				, _create: function () {
					this._super();
				}
				, _init: function () {
					var _me = this;

					_me.element.parent().addClass("titleless");
					_me.element.parent().addClass("btnless");

					var _user = $fn.getUserInfo(_me.options.sender);
					var _name = ($.isEmptyObject(_user) ? _me.options.sender : $fn.getCurLangMsg(_user[0].name));

					// _haspic 추가 - 2020.06.11 By LHJ
					var _haspic = ($.isEmptyObject(_user) ? "0" : "1");

					var _h = '<div class="dwp-msg-toast">';
					_h += '<div class="dwp-msg-title dwp-msg-title-bg"><span>' + _me.options.title + '</span></div>';
					_h += '<div class="dwp-msg-inner">';
					_h += '<div class="dwp-msg-wrap">';

					// _haspic 추가 - 2020.06.11 By LHJ
					_h += '<div class="dwp-photo-area"><div class="photo"><img src="' + $fn.getPath('pic', { empno: _me.options.sender, haspic: _haspic }) + '" alt=""></div></div>';
					_h += '<div class="dwp-msg-area">';

					// 필요없는 항목 제거 - 2020.06.11 By LHJ
					_h += '<div class="name">' + _name + '</div>';
					//_h += '<div class="name"></div>';

					_h += '<div class="desc"><div class="txt">' + _me.options.msg + '</div></div>';
					_h += '</div></div></div>';
					_h += '<div class="aligner">';
					_h += '<div class="center">';
					_h += '<div class="dwp-btn"><button type="button" class="link-btn">' + $fn.getCodeMsg('portal.title.toast_link') + '</button></div>&nbsp;';
					_h += '<div class="dwp-btn"><button type="button" class="close-btn">' + $fn.getCodeMsg('portal.title.toast_close') + '</button></div>';
					_h += '</div></div></div>';

					_me.element.html(_h);

					_me.element.parent().css("position", "fixed");
					_me.element.css("padding", "0px")

					$fn.getPicError($('.dwp-photo-area > .photo > img', _me.element));

					if (typeof _me.options.moveClick == "function") {
						$(".dwp-msg-area", _me.element).off('click').on('click', function () {
							_me.options.moveClick(_me);
						});
						$(".link-btn", _me.element).off('click').on('click', function () {
							_me.options.moveClick(_me);
						});
					} else if (_me.options.link != "") {
						if (_me.options.link.toLowerCase().indexOf("wfrmbridge") > -1 || _me.options.link.toLowerCase().indexOf("wfrmpage") > -1) {
							_me.options.linktype = "exurl";
						}
						$(".dwp-msg-area", _me.element).off('click').on('click', function () {
							//$fn.openDocument(_me.options.link,{isportal:true,width:($fn.getScreenInfo().doc_w * 0.8), dialogClass:'memo-type'});
							if (_me.options.linktype == "doclink" || _me.options.linktype == "") {
								$fn.openDocument(_me.options.link, { isportal: true, width: ($fn.getScreenInfo().doc_w * 0.8), dialogClass: 'memo-type' });
							} else if (_me.options.linktype == "inurl") {
								$dwp.ui.portal.goMenu({ gid: _me.options.link });
							} else if (_me.options.linktype == "exurl") {
								$dwp.core.util.winopenExt(_me.options.link, '');
							}
						});
						$(".link-btn", _me.element).off('click').on('click', function () {
							//$fn.openDocument(_me.options.link,{isportal:true,width:($fn.getScreenInfo().doc_w * 0.8), dialogClass:'memo-type'});
							if (_me.options.linktype == "doclink" || _me.options.linktype == "") {
								$fn.openDocument(_me.options.link, { isportal: true, width: ($fn.getScreenInfo().doc_w * 0.8), dialogClass: 'memo-type' });
							} else if (_me.options.linktype == "inurl") {
								$dwp.ui.portal.goMenu({ gid: _me.options.link });
							} else if (_me.options.linktype == "exurl") {
								$dwp.core.util.winopenExt(_me.options.link, '');
							}
						});
					}

					$(".close-btn", _me.element).off('click').on('click', function () {
						_me.close();
					});

					_me.options.timer = setTimeout(function () {
						_me.close();
					}, _me.options.timeout);

					if (!_me.options.ismobile) {
						/*
						$("body").off("click." + _par._PID).on("click." + _par._PID, function(e) {
							if ( !$.contains($("#" + _par._PID).parent(".ui-dialog").get(0), e.target) ) {
								_me.destroy();
								$("#" + _par._PID).remove();
								$("body").off("click." + _par._PID);
							}
						});
						*/
					}

					this._super();
				}
				, _focusTabbable: function () {
					console.log("focusTabbable overwritting");
				}
				, close: function () {
					var _me = this;
					_me._super();
					//$("body").off("click." +_par._PID);
					if (_me.options.timer) {
						clearTimeout(_me.options.timer);
					}
					_me.destroy();
				}
				, destroy: function () {
					var _me = this;
					_me._super();
					_me.element.remove();
				}

			});
		}
		/**
		 * 대상 element에 Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		},
		/**
		 * 대상 element에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	options
		 */
		getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	}
	/**
	 * Bizcard UI Widget
	 * @namespace
	 * @see	{@link module:core/ui/bizcard|Bizcard Widget}
	 */
	_$$.bizcard = {
		_MODULE_NM: "dwp.bizcard"
		, _PID: "dwp-bizcard"
		/**
		 * Bizcard UI Instance 생성함수
		 * @param	{object}	el					대상 Dom element or Jquery Selector
		 * @param	{object}	opt					options
		 * @return	{object}	bizcard instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el), _$biz = null
			_opt = $.extend({ empno: "", ismobile: false }, opt);

			if (typeof $.fn.bizcard == "undefined") {
				_par._create();
			}

			if (_$el.is("[data-empno]")) {
				_opt.empno = _$el.attr("data-empno");
			}
			if (_$el.is("[data-orgcode]")) {
				_opt.orgcode = _$el.attr("data-orgcode");
			}
			if (_$el.is("[data-comcode]")) {
				_opt.comcode = _$el.attr("data-comcode");
			}
			if (_opt.empno == "") { console.log("EmpNo Is Null"); return; }

			if (!_opt.ismobile) {
				_opt.position = { my: "left top", at: "left bottom", collision: "flipfit", of: _$el };
				_opt.width = 418;
				_opt.dialogClass = "titleless"
			} else {
				_opt.width = "100%";
				_opt.resizable = false;
				_opt.draggable = false;
				_opt.jtl = $dwp.core.getPath("weblib") + "/jtl/core/mbizcard.jtl"
				_opt.modal = true;
			}
			_opt.target = _$el;

			_$biz = $("#" + _par._PID);
			if (_$biz.size() > 0) {
				//if ( _$biz.bizcard("option", "empno") == _opt.empno) {
				//	_$biz.bizcard("option", "position", _opt.position);
				//	_$biz.bizcard("open");
				//	return;
				//} else {
				_$biz.bizcard("destroy");
				_$biz.remove();
				//}
			}

			//console.log("_opt-bizcard", _opt);

			_$biz = $('<div id="' + _par._PID + '" title="Biz Card"></div>').appendTo($("body"));

			_$biz.bizcard(_opt);

			return _$biz.bizcard("instance");
		}
		/**
		 *	Bizcard UI Widget 생성
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Bizcard Widget
			 * @module	core/ui/bizcard
			 */
			$.widget(_par._MODULE_NM, $.ui.dialog, /** @lends	module:core/ui/bizcard */{
				/**
				 * Bizcard Widget UI Options
				 * @property	{object}	show={effect:"fade",duration:300}	show options
				 * @property	{object}	hide={effect:"fade",duration:300}	hide options
				 * @property	{string}	empno			사번
				 * @property	{string=}	orgcode			부서코드
				 * @property	{object}	position		표시위치
				 * @property	{boolean}	ismobile=false	모바일여부
				 */
				options: {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					, resizable: false
					, jtl: $dwp.core.getPath("weblib") + "/jtl/core/bizcard.jtl"
					//,dialogClass : "titleless"
					//,width: 418
					, empno: ""
					, orgcode: ""
					, comcode: ""
					, position: {}
					, ismobile: false
					, isrealno: false		// 사번이 실사번인지 여부
					, target: null
				}
				, _create: function () {
					this._super();
				}
				, _init: function () {
					var _me = this, _simg = null;
					if (_me.options.ismobile) {
						_me.element.parent().addClass("mobile-dialog no-padding");
					}
					var _url = $dwp.core.getPath("org") + "/api/data/collections/name/wviwbyempnoall?ps=10&category=" + _me.options.empno;
					if (_me.options.isrealno) {
						_url = $dwp.core.getPath("org") + "/api/data/collections/name/wviwbyrempnoall?ps=10&category=" + _me.options.comcode + "_" + _me.options.empno;
					}
					$.when(
						$dwp.core.util.xAjax(
							{
								url: _url
								, dataType: "json"
								, async: false
								, cache: false
							})
						, $dwp.core.util.xAjax({ url: _me.options.jtl, async: false, cache: false })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						//_me.options.total = _$$.util.getDataRange(xhr1);
						if (xhr1[0].length == 0) {
							_me.element.html("<div style='text-align:center;line-height:65px;'>" + $fn.getCodeMsg("comm.msg.msg070") + "</div>");
							return;
						}

						_json.element = _me;
						var _jdata = xhr1[0][0]._jsoninfo;
						$.each(xhr1[0], function (i, o) {
							if (o.comcode == $fn.getComCode()) { _jdata = o._jsoninfo; return false; }
						});

						_json.data = $.parseJSON(_jdata);
						//_json.data = $.parseJSON(xhr1[0][0]._jsoninfo);

						//_json.data.isnexuser = !$fn.isExUser(_json.data.empno) && (_json.data.internetid != _json.data.empno);
						//_json.data.isnmail = !$fn.isExUser(_json.data.empno) && (_json.data.internetid != _json.data.empno);
						_json.data.isnmail = !$fn.isExUser(_json.data.empno);
						_json.data.isnexuser = !$fn.isExUser(_json.data.empno);

						_json.data.isoffice = true;
						if (_me.options.ismobile) {
							_json.data.isoffice = (dwpmo.info.app != "BWMH");
						}
						_json.data.islink = (_json.data.isoffice && !$fn.isExUser(_json.data.empno));

						//_json.data.cname = $dwp.core.lang.getCurMsg(_json.data.name);
						//_json.data.ename = $dwp.core.lang.getCurMsg(_json.data.name, '', "en");
						_json.data.cname = _json.data.enname;
						_json.data.ename = _json.data.cuname;
						_json.data.cposname = $dwp.core.lang.getCurMsg(_json.data.posname);
						_json.data.corgname = $dwp.core.lang.getCurMsg(_json.data.orgname);
						_json.data.cporgname = $dwp.core.lang.getCurMsg(_json.data.porgname);
						_json.data.cdutyname = $dwp.core.lang.getCurMsg(_json.data.dutyname);
						_json.data.cfullorgname = $dwp.core.lang.getCurMsg(_json.data.fullorgname);
						if ($dwp.core.util.getDeviceInfo.type() == "ios") {
							_json.data.coffice = "telprompt://" + _json.data.office.replace(/-/g, "");
							_json.data.cmobile = "telprompt://" + _json.data.mobile.replace(/-/g, "");
						} else {
							_json.data.coffice = "tel://" + _json.data.office.replace(/-/g, "");
							_json.data.cmobile = "tel://" + _json.data.mobile.replace(/-/g, "");
						}
						_json.data.smobile = "sms://" + _json.data.mobile.replace(/-/g, "");
						_json.data.countryname = $dwp.core.lang.getCurMsg(_json.data.country);

						// Home Addr
						_json.data.d_haddr = "";
						if (_json.data.haddr != "") {
							if (_json.data.hzip != "") {
								_json.data.d_haddr += "(" + _json.data.hzip + ")";
							}
							_json.data.d_haddr += _json.data.haddr;
						}
						// BirthDay
						_json.data.d_birthday = "";
						if (_json.data.birthday != "") {
							_json.data.d_birthday = _json.data.birthday;
							if (_json.data.birthtype == "1") {
								_json.data.d_birthday += "(" + $fn.getCodeMsg("comm.title.solar") + ")"
							} else if (_json.data.birthtype == "0") {
								_json.data.d_birthday += "(" + $fn.getCodeMsg("comm.title.lunar") + ")"
							}
						}

						_me.element.html($dwp.core.jsonToHtml.convert(_json, xhr2[0]));

						if (_me.options.ismobile) {
							$("div.profile img", _me.element).get(0).src = $fn.getPath("pic", { empno: _json.data.empno });
							$fn.getPicError($("div.profile img", _me.element));

							$("div[name=sendmail]", _me.element).off("click").on("click", function () {
								//console.log(_json.data.empno + "^" + _json.data.orgcode);
								$fn.mailSend(_json.data.empno + "^" + _json.data.orgcode);
								_me.close();
							});

							//메신저 상태 및 OPen 처리
							$dwp.core.util.messenger.getMUserStatus(_json.data.internetid, function (data) {
								var _m = $("[name=messenger_state]", _me.element);
								$("div.state", _m).removeClass(function () {
									return $.trim($(this).attr("class").replace("state", ""));
								}).addClass(data[0].css);

								_m.off("click").on("click", function () {
									if (data[0].userstate == "1") {
										$dwp.core.util.messenger.mchat(_json.data.internetid);
									} else {
										//$dwp.core.util.messenger.memo(_json.data.empno);
									}
								});
							});

							// 폰 주소록 추가
							$("div[name=phonebook]", _me.element).off("click").on("click", function () {
								$dwp.core.mportal.contacts(_json.data);
							});
						} else {
							$("div.photo img", _me.element).get(0).src = $fn.getPath("pic", { empno: _json.data.empno });
							$fn.getPicError($("div.photo img", _me.element));

							$("div.photo img", _me.element).addClass("dwp-cursor").off("click").on("click", function () {
								var _$top = $(this);
								var _src = $(this).attr("src");
								_simg = _$$.qtdialog.init($(this), {
									qtid: "pic_group"
									, dialogClass: 'titleless dropdown-type-dialog'
									, width: "auto"
									, position: { my: "left top", at: "left top", collision: "flipfit" }
									, initcallback: function (_$qtdialog) {
										$("<div style='padding:5px'><img src='" + _src + "'></div>").appendTo(_$qtdialog.element);
										$("img", _$qtdialog.element).get(0).onload = function () {
											$(_$qtdialog.element).parent().position({ my: "left top", at: "left top", collision: "flipfit", of: _$top });
										};
									}
								});
							});

							$("div[name=sendmail]", _me.element).off("click").on("click", function () {
								//console.log(_json.data.empno + "^" + _json.data.orgcode);
								$fn.mailSend(_json.data.empno + "^" + _json.data.orgcode);
								_me.close();
							});
							/*
							$dwp.core.util.messenger.getUserStatus(_json.data.internetid, function (data) {
								var _m = $("[name=messenger_state]", _me.element);
								$("div.state", _m).removeClass(function () {
									return $.trim($(this).attr("class").replace("state", ""));
								}).addClass(data[0].css);

								_m.off("click").on("click", function () {
									if (data[0].userstate == "1") {
										$dwp.core.util.messenger.chat(_json.data.internetid);
									} else {
										//$dwp.core.util.messenger.memo(_json.data.empno);
									}
								});
							});
							*/
							// Web Chatting - Chatting
							$("[name=messenger_state]", _me.element).off("click").on("click", function () {
								$dwp.core.util.webchat.chat(
									[{ username: $dwp.core.lang.getCurMsg(_json.data.name), empno: _json.data.empno }]
								);
								_me.close();
							});
						}
						$("div[name=fa_people]", _me.element).off("click").on("click", function () {
							$dwp.core.util.addFavoritePeople(_json.data.empno, _json.data.orgcode)
						});
						//console.log("d",_me.element.html());
						//Event 처리 필요
						// 언어변환처리
						$dwp.core.lang.convert({ url: _me.options.langpath, isedit: _me.options.isedit }, _me.element);
					});

					if (!_me.options.ismobile) {
						$("body").off("click." + _par._PID).on("click." + _par._PID, function (e) {
							if (_simg && _simg.element.parent(".ui-dialog").size() > 0) {
								var _picimg = _simg.element.parent(".ui-dialog").get(0);
								if (!$.contains($("#" + _par._PID).parent(".ui-dialog").get(0), e.target)) {
									if ((_me.options.target.get(0) == undefined) || !$.contains(_me.options.target.get(0), e.target) && !$.contains(_picimg, e.target) && !(_me.options.target.get(0) === e.target)) {
										_me.destroy();
										$("#" + _par._PID).remove();
										$("body").off("click." + _par._PID);
									}
								}
							} else {
								if (!$.contains($("#" + _par._PID).parent(".ui-dialog").get(0), e.target)) {
									if ((_me.options.target.get(0) == undefined) || !$.contains(_me.options.target.get(0), e.target) && !(_me.options.target.get(0) === e.target)) {
										_me.destroy();
										$("#" + _par._PID).remove();
										$("body").off("click." + _par._PID);
									}
								}
							}
						});
					} else {
						$("<span class='close-dialog'><img src='" + $fn.getPath("weblib") + "/images/common/icon-close-w.svg' alt=''></span>").prependTo(_me.element)
							.off("click").on("click", function () {
								_me.close();
							});
					}

					/*
					$("body").off("click").on("click", function(e) {
						if ( $(e.target).parents("#dwp-bizcard").size() == 0 && $(e.target).parents("[data-type='profile']").size() == 0) {
							_me.destroy();
							$("#dwp-bizcard").remove();
							$("body").off("click");
						}
					});
					*/
					this._super();
				}
				, close: function () {
					console.log("close");
					this._super();
				}
				, destroy: function () {
					var _me = this;
					_me._super();
					$("body").off("click." + _par._PID);
					_me.element.remove();
				}

			});
		}
		/**
		 * 대상 element에 Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		}
		/**
		 * 대상 element에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	options
		 */
		, getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	//_$$.bizcard._create();
	/**
	 * File Dialog Widget
	 * @namespace
	 * @see	{@link module:core/ui/filedialog|FileDialog Widget}
	 */
	_$$.filedailog = {
		_MODULE_NM: "dwp.filedialog"
		, _PID: "dwp-filedialog"
		/**
		 * File Dialog Instance 생성함수
		 * @param	{object}	el						대상 Dom element or Jquery Selector
		 * @param	{object}	opt						options
		 * @return	{object}	filedialog instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el), _$filedialog = null
			_opt = $.extend({}, _par._default);

			if (typeof $.fn.filedialog == "undefined") {
				_par._create();
			}

			if (!opt.ismobile) {
				_opt.position = { my: "left top", at: "center bottom", collision: "flipfit", of: _$el };
			} else {
				_opt.width = "100%";
				_opt.draggable = false;
				_opt.modal = true;
				_opt.ismobile = opt.ismobile;
			}
			_opt.unid = opt['@unid'];
			_opt.fileinfo = $.parseJSON(opt._attachinfo);
			_opt.sortfiles = (opt.hasOwnProperty("_sortfiles") ? opt._sortfiles : "");
			_opt.applcode = opt.applcode;
			_opt.svrnm = opt.svrnm;
			_opt.cdb = opt.cdb;
			_opt.title = opt.title;
			_opt.target = _$el;

			_$filedialog = $("#" + _par._PID);
			if (_$filedialog.size() > 0) {
				if (_$el.get(0) !== _$filedialog.filedialog("instance").options.target.get(0)) {
					_$filedialog.filedialog("destroy");
					_$filedialog = $('<div id="' + _par._PID + '"></div>').appendTo($("body"));
					_$filedialog.filedialog(_opt);
				} else {
					if (_$filedialog.filedialog("isOpen")) {
						_$filedialog.filedialog("close");
					} else {
						_$filedialog.filedialog("open");
					}
				}
			} else {
				_$filedialog = $('<div id="' + _par._PID + '"></div>').appendTo($("body"));
				_$filedialog.filedialog(_opt);
			}
			/*
			if (_$filedialog.size() > 0) {
				if ( _$filedialog.filedialog("option", "unid") == _opt.unid) {
					_$filedialog.filedialog("option", "position", _opt.position);
					_$filedialog.filedialog("open");
					return;
				} else {
					_$filedialog.filedialog("destroy");
				}
			} else {
				_$filedialog = $('<div id="' + _par._PID + '"></div>').appendTo($("body"));
			}
			*/
			//_$filedialog.filedialog(_opt);

			return _$filedialog.filedialog("instance");
		}
		/**
		 * Filedialog Widget 생성
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Filedialog Widget
			 * @module	core/ui/filedialog
			 */
			$.widget(_par._MODULE_NM, $.ui.dialog, /** @lends	module:core/ui/filedialog */{
				/**
				 * Filedialog Widget Options
				 * @property	{string}	title		제목
				 * @property	{array}		fileinfo	첨부파일정보
				 * @property	{string}	sortfiles	소트첨부파일정보
				 */
				options: {
					title: $dwp.core.lang.getCodeMsg("comm.title.js012")
					, draggable: false
					, show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					, resizable: false
					, ismobile: false
					, width: 418
					, fileinfo: []
					, sortfiles: ""
					, position: {}
					, target: null
				}
				, _create: function () {
					this._super();
				}
				, _init: function () {
					var _me = this, _html = "", _nlist = [];

					if (_me.options.ismobile) {
						_me.element.parent().addClass("mobile-dialog no-padding");
					}

					_me.options.fileinfo = $dwp.core.util.exFileMime(_me.options.fileinfo);

					_html = "<div class=\"dwp-files-dialog\"><div class=\"dwp-file-list\"></div></div>";
					var _$fileList = $(_html).appendTo(_me.element);

					if (_me.options.sortfiles != "") {
						var _sortlist = _me.options.sortfiles.split(";");
						if (_sortlist.length == _me.options.fileinfo.length) {
							$.each(_sortlist, function (i, v) {
								var o = _me._sortFindFile(v, _me.options.fileinfo);
								if (o != null) {
									_nlist.push(o);
								}
							});
						} else {
							_nlist = _me.options.fileinfo;
						}
					} else {
						_nlist = _me.options.fileinfo;
					}

					$.each(_nlist, function (i, o) {
						(/\.(\w+)$/g).test(o.name);
						var _ft = (RegExp.$1) ? RegExp.$1.toLowerCase() : "etc"
							, _icon = _$$.file._ATTACH_ICONS[_ft] ? _$$.file._ATTACH_ICONS[_ft].icon : _$$.file._ATTACH_ICONS.etc.icon
							//,_img = "png,gif,jpg.jpeg,bmp,tiff"
							//,_target = (_img.indexOf(_ft) > -1 ) ? "_blank" : "_self";
							, _target = "_self";

						var _html = "<div class=\"dwp-file\">";
						if (_me.options.ismobile) {
							_html += "<a>";
						} else {
							_html += "<a href='" + o.url + "' download='' target='" + _target + "'>";
						}
						_html += "<img src='" + _icon + "'>" + o.name + (o.size != "" ? " (" + o.size.toSize() + ")" : "");
						_html += "</a></div>";

						var _$item = $(_html).appendTo($("div.dwp-file-list", _$fileList));
						if (_me.options.ismobile) {
							//2020-06-23 By LHJ File Download Method Change ==> 위치가 잘못되어 있음
							//dwpmo.util.fileDownload(o.url, o.name);

							$("a", _$item).off("click").on("click", function () {

								dwpmo.util.fileDownload(o.url, o.name);  //위치옮김 - 2020.07.29 by dwlee
								/*
																var _u = o.url.toUpperCase().split("/$FILE/");
																var __u = _u[0].split("/0/")
																var _dbpath = __u[0].substring(1);
																var _unid = __u[1];
																var _svrnm = _opt.svrnm
																if(typeof o.server != "undefined" && o.server != "")  _svrnm = o.server;

																$dwp.core.util.callFileViewer({
																	reqdata : {ReqApplCode : _opt.applcode
																				//, ReqServer : _opt.svrnm
																				, ReqServer : _svrnm
																				//, ReqDBPath : _opt.cdb.substring(1)
																				//, ReqDocUNID : _opt.unid
																				, ReqDBPath : _dbpath
																				, ReqDocUNID : _unid
																				, ReqDocSubject : _opt._subject
																				, ReqFilename : o.name
																	}
																});
								*/
							});

						}
					});

					//_html += "</div>";
					//_html += "</div>";

					//_me.element.html(_html);

					//Event 처리 필요
					/*
					if (!_me.options.ismobile) {
						$("body").off("click").on("click", function(e) {
							if ( !$.contains($("#" + _par._PID).parent(".ui-dialog").get(0), e.target) && !$.contains(_me.options.target.get(0), e.target)) {
								_me.destroy();
								$("#" + _par._PID).remove();
								$("body").off("click");
							}
						});
					}
					*/
					if (!_me.options.ismobile) {
						$("body").off("click." + _par._PID).on("click." + _par._PID, function (e) {
							if (!$.contains($("#" + _par._PID).parent(".ui-dialog").get(0), e.target)) {
								if ((_me.options.target.get(0) == undefined) || !($.contains(_me.options.target.get(0), e.target) || _me.options.target.get(0) === e.target)) {
									_me.destroy();
									$("#" + _par._PID).remove();
									$("body").off("click." + _par._PID);
								}
							}
						});
					} else {
						$("<span class='close-dialog'><img src='" + $fn.getPath("weblib") + "/images/common/icon-close-w.svg' alt=''></span>").prependTo(_me.element)
							.off("click").on("click", function () {
								_me.close();
							});
					}
					/*
					$("body").off("click").on("click", function(e) {
						if ( $(e.target).parents("#dwp-filedialog").size() == 0 && $(e.target).parents("div.file-cell").size() == 0) {
							_me.destroy();
							$("#dwp-filedialog").remove();
							$("body").off("click");
						}
					});
					*/
					this._super();
				}
				, _sortFindFile: function (key, list) {
					var _me = this, rtn = null;

					$.each(list, function (i, v) {
						if (key == v.name) { rtn = v; return false; }
					});
					return rtn;
				}
				, close: function () {
					console.log("close");
					this._super();
				}
				, destroy: function () {
					var _me = this;
					_me._super();
					$("body").off("click." + _me.options.qtid);
					_me.element.remove();
				}
			});
		}
		/**
		 * 대상 element에 Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		}
		/**
		 * 대상 element에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	options
		 */
		, getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	//_$$.filedailog._create();
	/**
	 * Qtdialog	UI Widget
	 * @namespace
	 * @see	{@link module:core/ui/qtdialog|Qtdialog Widget}
	 */
	_$$.qtdialog = {
		_MODULE_NM: "dwp.qtdialog"
		, _PID: "dwp-qtdialog"
		, _default: {
		}
		/**
		 * Qtdialog UI Instance 생성함수
		 * @param	{object}	el				대상 Dom element or Jquery Selector
		 * @param	{object}	opt				options
		 * @param	{string=}	opt.qtid		ID정보
		 * @return	{object}	qtdialog instance
		 */
		, init: function (el, opt) {
			//console.log('d',opt);
			var _par = this, _$el = $(el), _opt = $.extend({ qtid: "" }, opt), _$qtdialog = null;
			_opt.qtid = _par._PID + (_opt.qtid == "" ? "" : "-" + _opt.qtid);

			if (typeof $.fn.qtdialog == "undefined") {
				_par._create();
			}

			if (_opt.hasOwnProperty("buttons")) {
				_opt.ubuttons = _opt.buttons;
				_opt.buttons = null;
			}

			_opt.position = $.extend({ my: "left top", at: "center bottom", collision: "flipfit", of: _$el }, opt.position);
			_opt.target = _$el;

			_$qtdialog = $("#" + _opt.qtid);
			if (_$qtdialog.size() > 0) {
				_$qtdialog.qtdialog("destroy");
				_$qtdialog = $('<div id="' + _opt.qtid + '"></div>').appendTo($("body"));
				_$qtdialog.qtdialog(_opt);
				/*
				if ( _$el.get(0) !== _$qtdialog.qtdialog("instance").options.target.get(0) ) {
					_$qtdialog.qtdialog("destroy");
					_$qtdialog = $('<div id="' + _opt.qtid + '"></div>').appendTo($("body"));
					_$qtdialog.qtdialog(_opt);
				} else {
					if(_$qtdialog.qtdialog("isOpen")) {
						_$qtdialog.qtdialog("close");
					} else {
						_$qtdialog.qtdialog("open");
					}
				}
				*/
			} else {
				_$qtdialog = $('<div id="' + _opt.qtid + '"></div>').appendTo($("body"));
				_$qtdialog.qtdialog(_opt);
			}

			//_$qtdialog.qtdialog(_opt);

			return _$qtdialog.qtdialog("instance");
		}
		/**
		 * Qtdialog UI Widget 생성
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Qtdialog Widget
			 * @module	core/ui/qtdialog
			 */
			$.widget(_par._MODULE_NM, $.ui.dialog, /** @lends	module:core/ui/qtdialog */{
				/**
				 * Qtdialog Widget Options
				 * @property	{object}		content				contnet정보
				 * @property	{string=}		content.html		content html
				 * @property	{string=}		content.url			content Url
				 * @property	{function(*)}	initcallback		초기로딩함수
				 * @property	{object}		initcallback.qtdialog	qtdialog instance
				 * @property	{array}			buttons				buttons정보 {@link module:core~$dwp.core.ui.button|core.ui.button} 참조
				 */
				options: {
					qtid: _par._PID
					, draggable: false
					, content: { html: "", url: "" }
					, target: null
					, initcallback: null
					, ubutttons: []
				}
				, _create: function () {
					//console.log("create qtid");
					this._super();
				}
				/**
				 * 초기화 함수
				 */
				, _init: function () {
					var _me = this, _html = "", _$btnwrap = null, __$btnwrap = null;
					//console.log("qtid", _me.options.qtid);
					if (_me.options.content.html != "") {
						_html = _me.options.content.html;
					} else if (_me.options.content.url != "") {
						$dwp.core.util.xAjax({
							url: _me.options.content.url
							, dataType: "html"
							, async: false
							, cache: false
						})
							.done(function (data) {
								_html = data
							});
					}

					if (_html != "") {
						_me.element.html(_html);
					}
					// 버튼처리
					//if (_me.options.ubuttons.length > 0) {
					if (typeof _me.options.ubuttons != "undefined" && _me.options.ubuttons.length > 0) {
						_$btnwrap = $("<div class='aligner' data-type='table' data-top='md'><div class='center'><div class='dwp-grouping'></div></div></div>").appendTo(_me.element);
						__$btnwrap = $("div.dwp-grouping", _$btnwrap);

						_$$.button(__$btnwrap, { buttons: _me.options.ubuttons, data: _me });
					}

					// 언어변환처리
					$dwp.core.lang.convert({ url: _me.options.langpath, isedit: _me.options.isedit }, _me.element);

					$("body").off("click." + _me.options.qtid).on("click." + _me.options.qtid, function (e) {
						console.log("qt click", e.target);
						//if ( !$.contains($("#" + _me.options.qtid).parent(".ui-dialog").get(0), e.target) && !( $.contains(_me.options.target.get(0), e.target) || _me.options.target.get(0) === e.target)) {
						if (!$.contains($("#" + _me.options.qtid).parent(".ui-dialog").get(0), e.target)) {
							if ((_me.options.target.get(0) == undefined) || !($.contains(_me.options.target.get(0), e.target) || _me.options.target.get(0) === e.target)) {
								_me.destroy();
								$("#" + _me.options.qtid).remove();
								$("body").off("click." + _me.options.qtid);
							}
						}
					});

					this._super();

					if (typeof _me.options.initcallback == "function") {
						_me.options.initcallback(_me);
					}
				}
				/**
				 * close 함수
				 */
				, close: function () {
					var _me = this;
					_me._super();
					//_me.destroy();
				}
				/**
				 * destroy 함수
				 */
				, destroy: function () {
					var _me = this;
					_me._super();
					$("body").off("click." + _me.options.qtid);
					_me.element.remove();
				}
			});
		}
		/**
		 * 대상 element에 Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		}
		/**
		 * 대상 element에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	options
		 */
		, getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	//_$$.qtdialog._create();
	/**
	 * Dialog UI Widget
	 * @namespace
	 * @see	{@link module:core/ui/dialog|Dialog Widget}
	 */
	_$$.dialog = {
		_MODULE_NM: "dwp.xdialog"
		, _default: {
		}
		/**
		 * Dialog UI Instance 생성함수
		 * @param	{object}	el				대상 Dom element or Jquery Selector
		 * @param	{object}	opt				options
		 * @param	{boolean}	opt.istop=false	상단위치여부
		 * @param	{object=}	opt.button		Button정보	{@link module:core~$dwp.core.ui.button|core.ui.button} 참조
		 * @return	{object}	dialog instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el) || null
				, _opt = {}, _id = "", _$dialog = null;

			_opt = $.extend({ istop: false }, this._default, opt);

			if (typeof $.fn.xdialog == "undefined") {
				_par._create();
			}
			if (_opt.istop) {
				_opt.position = ['center', 20];
			}
			if (_opt.hasOwnProperty("buttons")) {
				_opt.ubuttons = _opt.buttons;
				_opt.buttons = null;
			}
			_id = "xdialog-" + $("div.dwp-xdialog").size();
			_$dialog = $('<div class="dwp-xdialog" id="' + _id + '"></div>').appendTo($("body"));

			_opt.id = _id;
			_$dialog.xdialog(_opt);

			return _$dialog.xdialog("instance");
		}
		/**
		 * Dialog UI Widget 생성
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Dialog Widget
			 * <br> Jquery UI Dialog를 확장함
			 * @module	core/ui/dialog
			 */
			$.widget(_par._MODULE_NM, $.ui.dialog, /** @lends	module:core/ui/dialog */{
				/**
				 * Dialog Widget Options
				 * @property	{object}		content				contnet정보
				 * @property	{string=}		content.html		content html
				 * @property	{string=}		content.url			content Url
				 * @property	{function(*)}	initcallback		초기로딩함수
				 * @property	{object}		initcallback.dialog	dialog instance
				 * @property	{array}			ubuttons				buttons정보 {@link module:core~$dwp.core.ui.button|core.ui.button} 참조
				 * @property	{boolean}		ismobile=false		모바일여부
				 * @property	{boolean}		islangconvert=false	언어변환여부
				 */
				options: {
					content: { html: "", url: "", data: {} }
					, id: ""
					, type: ""
					, ismobile: false
					, islangconvert: true
					, initcallback: null
					, ubuttons: []
					, show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					, confirm: null
					, closeselect: null
					, refdata: {}
					, callback: null
					, orgtype: false
					, headerclass: ""
					, isshowmin: false
					, _isloaded: false
				}
				, _create: function () {
					this._super();
				}
				, _init: function () {
					var _me = this;
					_me.__init();
					this._super();
				}
				, __init: function () {
					var _me = this, _html = "";
					if (_me.options.ismobile) {
						_me.element.parent().addClass("mobile-dialog no-overflow");
					} else {
						if (_me.options.orgtype) {
							_me.element.parent().addClass("approval-dialog-type");
						}
					}
					if (_me.options.headerclass != "") {
						_me.element.parent().addClass(_me.options.headerclass);
					}

					if (_me.options.content.html != "") {
						_html = _me.options.content.html;
					} else if ((_me.options.content.iframe || "") != "") {		//iframe 방식 추가
						_url = _me.options.content.iframe;
						_html = "<iframe src='" + _url + "' id='iBody' width=100% height=100% frameborder=0 scrolling=auto marginheight=0 allowTransparency=true></iframe>";
					} else if (_me.options.content.url != "") {
						var _isstop = false;
						$dwp.core.util.xAjax({
							//url : _me.options.content.url + "&did=" + _me.options.id
							url: _me.options.content.url
							, dataType: "html"
							, async: false
							, cache: false
							, data: $.extend({ did: _me.options.id }, _me.options.content.data)
						})
							.done(function (data) {
								var _rtn = $dwp.core.util.xAjaxDataCheck(data);
								if (_rtn.code == "-1") {
									_html = data;
								} else {
									_isstop = true;
									_me.option("autoOpen", false);
									$fn.alert({ msg: $fn.getCodeMsg(_rtn.msg) })
										.done(function () { _me.close(); });
								}
								//_html = data
							});
						if (_isstop) return;
					}
					if (_html != "") {
						if (_me.options.type == "doc") {
							if (_me.options.ismobile) {
								_html = "<div class='dwp-container-m'>" + _html + "</div>";
							} else {
								_html = "<input type=hidden autofocus='true'/><div class='dwp-container-wrap'><div class='dwp-container' style='padding:0px;'><div class='dwp-contents _dialog_'><div class='dwp-wrapping'>" + _html + "</div></div></div></div>";
							}
						}
						//console.log("a", _html);
						_me.element.html(_html);
					}

					if ($("div.ui-dialog-content .dwp-container-wrap", _me.element).size() > 0) {
						_me.element.parent().addClass("memo-type");
					}

					// 버튼처리
					if (_me.options.ubuttons.length > 0) {
						if (_me.options.ismobile) {
							_$btnwrap = $("<div class='aligner' data-type='table' data-top='md'><div class='center'><div class='dwp-grouping'></div></div></div>").appendTo($("div.dwp-page-body", _me.element));
							__$btnwrap = $("div.dwp-grouping", _$btnwrap);
						} else {
							_$btnwrap = $("<div class='aligner' data-type='table' data-top='md'><div class='center'><div class='dwp-grouping'></div></div></div>").appendTo(_me.element);
							__$btnwrap = $("div.dwp-grouping", _$btnwrap);
						}
						_$$.button(__$btnwrap, { buttons: _me.options.ubuttons, data: _me });
					}

					// 언어변환처리
					if (_me.options.islangconvert) {
						$dwp.core.lang.convert({ url: _me.options.langpath, isedit: _me.options.isedit }, _me.element);
					}

					if (typeof _me.options.initcallback == "function") {
						_me.options.initcallback(_me);
					}

					if (_me.options.ismobile) {
						//$('.ui-widget-overlay').off('click').on('click', function() {
						//	console.log("overlay")
						//    _me.close();
						//});
						if (typeof _me.options.confirm == "function") {
							$("div.confirm", _me.element).off("click").on("click", function () {
								_me.options.confirm(_me);
							});
						}
						$("<span class='close-dialog'><img src='" + $fn.getPath("weblib") + "/images/common/icon-close-w.svg' alt=''></span>").prependTo(_me.element)
							.off("click").on("click", function () {
								_me.close();
							});
					} else {
						if (_me.options.isshowmin) {
							var _$titlebar = $(".ui-dialog-titlebar", _me.element.parent())
								, _$close = $(".ui-dialog-titlebar-close", _$titlebar);

							_me.element.parent().addClass("dwp-dialog-mail");

							_$down = $("<button type=\"button\" class=\"ui-button ui-corner-all ui-widget ui-button-icon-only\"><span class=\"ui-button-icon ui-icon dialog-down\"></span></button>").insertBefore(_$close);
							_$up = $("<button type=\"button\" class=\"ui-button ui-corner-all ui-widget ui-button-icon-only dwp-mail-button-dialog-up\"><span class=\"ui-button-icon ui-icon dialog-up\"></span></button>").insertBefore(_$close);

							_$up.off("click").on("click", function () {
								_me.element.show();
								_me.option("position", { my: "center", at: "center", of: window });
								_me.option("width", _me.options._twidth);

								//_$$.mail.com.resizeMailForm(__dlg, "down");
							})
							_$down.off("click").on("click", function () {
								_me.options._twidth = _me.option("width");
								_me.option("width", "300");
								_me.element.hide();
								_me.option("position", { my: "right top", at: "right bottom", collision: "flipfit", of: window });
								//_$$.mail.com.resizeMailForm(__dlg, "up");
							})

						}
						if (_me.options.closeselect != null) {
							$("body").off("click." + _me.options.id).on("click." + _me.options.id, function (e) {
								if (!$.contains($("#" + _me.options.id).parent(".ui-dialog").get(0), e.target)) {
									if (_me.options.closeselect == null) {
										_me.destroy();
										$("body").off("click." + _me.options.id);
									} else if (!$.contains($(_me.options.closeselect).get(0), e.target)) {
										_me.destroy();
										$("body").off("click." + _me.options.id);
									}
								}
							});
						}
					}

				}
				/**
				 * Contents Reload함수
				 * @parma	{object}	_opt	Dialog Options
				 */
				, reload: function (_opt) {
					var _me = this;
					_me.options.content = _opt;
					_me.element.empty();
					_me.__init();
				}
				/**
				 * Dialog Close함수
				 */
				, close: function () {
					var _me = this;
					_me._super();
					$("body").off("click." + _me.options.id);
					_me.destroy();
				}
				/**
				 * Dialog Destroy함수
				 */
				, destroy: function () {
					var _me = this;
					_me._super();
					_me.element.remove();
				}
			});
		}
		/**
		 * 대상 element에 Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		}
		/**
		 * 대상 element에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	options
		 */
		, getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	_$$.dialog._create();

	/**
	 * Tree UI Widget
	 * @namespace
	 * @see	{@link module:core/ui/tree|Tree Widget}
	 */
	_$$.tree = {
		_MODULE_NM: "dwp.xtree"
		, _default: {
		}
		/**
		 * Tree UI Instance 생성함수
		 * @param	{object}	el				대상 Dom element or Jquery Selector
		 * @param	{object}	opt				options
		 * @return	{object}	tree instance
		 */
		, init: function (el, opt) {
			var _par = this, _$el = $(el) || null
				, _opt = {};

			_opt = $.extend({}, this._default, opt);

			if (typeof $.fn.xtree == "undefined") {
				_par._create();
			}

			_$el.xtree(_opt);

			return _$el.xtree("instance");
		}
		/**
		 * Tree UI Widget 생성
		 */
		, _create: function () {
			var _par = this;
			/**
			 * Tree Widget
			 * <br> Jquery Dynatree 확장함
			 * @module	core/ui/tree
			 */
			$.widget(_par._MODULE_NM, /** @lends	module:core/ui/tree */{
				/**
				 * Tree Widget Options
				 * <br> {@link http://wwwendt.de/tech/dynatree/doc/dynatree-doc.html|Dynatree Options} 참조
				 * @property	{boolean}		noLink=true	Use 	<span> instead of <a> tags for all nodes
				 * @property	{number}		clickFolderMode=3	1:activate, 2:expand, 3:activate and expand
				 * @property	{string}		idPrefix=dwp-tree-
				 * @property	{function(*)}	callback			초기로딩 시, 호출함수
				 * @property	{object}		callback.tree		tree instance
				 */
				options: {
					children: null
					, noLink: true
					, clickFolderMode: 3
					, debugLevel: 0
					, idPrefix: "dwp-tree-"
					, _parent: null
					, onDblClick: null
					//,onPostInit : null
					//,onActivate : null
					//,onSelect : null
					//,onLazyRead : null
				}
				, _create: function () {

				}
				, _init: function () {
					var _me = this;

					$(_me.element).dynatree(_me.options);

					if (typeof _me.options.callback == "function") {
						_me.options.callback(_me);
					}
				}
				/**
				 * Dynatree Instance를 리턴합니다.
				 * @return	{instance}	Tree Instance
				 */
				, getTree: function () {
					var _me = this;
					return $(_me.element).dynatree("getTree");
				}
				/**
				 * root node를 리턴합니다.
				 * @return	{object}	root node
				 */
				, rootNode: function () {
					var _me = this;
					return _me.getTree().getRoot();
				}
				/**
				 * tree node를 리턴합니다.
				 * @param	{string}	key		node key
				 * @return	{object}	tree node
				 */
				, getNode: function (key) {
					var _me = this;
					return _me.getTree().getNodeByKey(key);
				}
				/**
				 * Tree Active Node를 리턴합니다.
				 * @return	{object}	tree active node
				 */
				, getActiveNode: function () {
					var _me = this;
					return _me.getTree().getActiveNode();
				}
				/**
				 * 선택된 nodes를 리턴합니다.
				 * @return	{array}	선택된 nodes
				 */
				, getSelectedNodes: function () {
					var _me = this;
					return _me.getTree().getSelectedNodes();
				}
				/**
				 * 모든 Node에 대해 지정된 함수를 호출합니다.
				 * @param	{function(*)}	fn				호출함수
				 * @param	{object}		fn.node			tree node
				 * @param	{boolean}		includeRoot		root node 포함여부
				 */
				, visit: function (fn, includeRoot) {
					var _me = this;
					return _me.getTree().visit(fn, includeRoot);
				}
				/**
				 * Tree Data를 다시 로드합니다.
				 * @param	{object}		data		Tree Data
				 * @param	{function()}	callback	callback함수
				 */
				, treeReload: function (data, callback) {
					var _me = this
						, root = _me.rootNode();
					if (root) {
						root.removeChildren();
						root.addChild(data);
						if (typeof (callback) == "function") {
							callback();
						}
					}
				}
				/**
				 * keypath정보로 Tree node를 펼침니다.
				 * @param	{string}	keypath			펼칠 node key 정보
				 * @param	{boolean}	isloadsel=false	마지막 node를 select 혹은 active할지 여부
				 */
				, loadKeyPath: function (keypath, isloadsel) {
					var _me = this
						, _keypathlist = keypath.split(",")
						, _len = _keypathlist.length - 1
						, _isloadsel = false || isloadsel;

					var pnode = null;
					$.each(_keypathlist, function (idx, _key) {
						var dtnode = null;
						if (idx == 0) {
							dtnode = _me.getNode(_key);
						} else {
							if (pnode) {
								pnode.visit(function (node) {
									if (node.data.key == _key) {
										dtnode = node; return false;
									}
								});
							}
						}
						if (dtnode) {
							if (dtnode.data.isFolder) { dtnode.expand(); }
							if (_len == idx) {
								if (_isloadsel) {
									if (_me.options.checkbox) {
										dtnode.select();
									} else {
										dtnode.activate();
									}
								}
								setTimeout(function () {
									var _gap = $(dtnode.li).offset().top - $("ul", dtnode.tree.divTree).offset().top - ($("ul", dtnode.tree.divTree).height() / 2);
									$("ul", dtnode.tree.divTree).scrollTop(_gap);
								}, 100);
							} else {
								pnode = dtnode;
							}
						} else {
							return;
						}
					});
				}
			});
		}
		/**
		 * Tree용 Json Data형식으로 리턴합니다.
		 * <br> treedata에서 key에 해당하는 node를 찾아 children에 node를 추가합니다.
		 * @param	{string}	key
		 * @param	{object}	treedata	Tree Data Object
		 * @param	{object}	node
		 */
		, addchild: function (key, treedata, node) {
			var _me = this, _flag = false;
			for (var i = 0, j = treedata.length; i < j; i++) {
				if (treedata[i].key == key) {
					node.lvl = ((typeof (treedata[i].lvl) == "undefined") ? 1 : treedata[i].lvl + 1);
					if (treedata[i].children) {
						treedata[i].children[treedata[i].children.length] = node;
					} else {
						treedata[i].children = new Array();
						treedata[i].children[0] = node;
						treedata[i].isFolder = true;
					}
					_flag = true;
					return _flag;
				} else {
					if (treedata[i].children) {
						_flag = _me.addchild(key, treedata[i].children, node);
						if (_flag) return _flag;
					}
				}
			}
			return _flag;
		}
		/**
		 * 대상 element에 Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	instance
		 */
		, getInstance: function (el) {
			var _par = this, _$el = $(el);
			return _$el.data(_par._MODULE_NM);
		}
		/**
		 * 대상 element에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	options
		 */
		, getOptions: function (el) {
			var _par = this, _$el = $(el);
			if (_par.getInstance(_$el)) {
				return _par.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	};
	_$$.tree._create();

	/**
	 * DatePicker
	 * @param	{object}	el		dom element or query selector
	 * @param	{object}	opt		options
	 */
	_$$.datepicker = function (el, opt, fopt, field) {
		if ($fn.ismobile() && typeof datePicker != "undefined") {
			_$$.mdatepicker(el, opt, fopt);
			return;
		}
		var _$el = null;
		if (typeof field == "undefined") {
			_$el = $("input[type='text'][data-type='date']", el);
		} else {
			_$el = $(field);
		}
		//var _$el = $("input[type='text'][data-type='date']", el)
		var _locale = $dwp.core.lang.getLocale()
			, _opt = $.extend({
				showOn: "button"
				//,dateFormat: "yy-mm-dd"
				, dateFormat: _locale.sdate
				, buttonImage: $dwp.core.getPath("weblib") + "/images/common/empty.png"
				, buttonImageOnly: true
				, buttonText: "Select date"
				, constrainInput: false
				, changeYear: true
				, changeMonth: true
				, readonly: true
			}, opt)
		_fopt = fopt || [], _obj = {};

		//console.log(_$el);

		//$.datepicker.setDefaults($.datepicker.regional[$dwp.core.lang.getLang()]);

		function _is(nm) {
			var _rtn = null;
			$.each(_fopt, function (i, o) {
				if (o.start == nm || o.end == nm) {
					_rtn = o;
					return;
				}
			});
			return _rtn;
		}
		function _fchk(o) {
			//console.log("o", o);
			var _$sdates = $("input[name='" + o.start + "'][type!='hidden']", el)
				, _$edates = $("input[name='" + o.end + "'][type!='hidden']", el)
				, sdates = null, edates = null;

			if (o.start) {
				if (o.start_today) {
					var _now = $fn.formatDateTime("", "dateonly");
					_$sdates.val(_now);
				}
				sdates = _$sdates.datepicker(
					$.extend({}, _opt, {
						foption: o
						, onSelect: function (selectedDate) {
							if (o.end) {
								$(edates).datepicker("option", "minDate", selectedDate);
							}
							if (o.startmin_today) {
								$(sdates).datepicker("option", "minDate", new Date());
							}
							if (typeof (o.callback) == "function") {
								var rval = selectedDate;
								var tval = selectedDate.replace(/\./g, "-");
								if (moment(tval).isValid()) {
									rval = moment(tval).format("YYYY-MM-DD")
								}
								o.callback(rval, _$sdates, el);
							}
						}
						//,dateFormat: sDateFormat
						//,changeMonth: true
						//,changeYear: true
						//,yearRange:'c-80:c+10'
					})
				);
				//console.log('aaadddd', )
				if (o.end) {
					$(sdates).datepicker("option", "maxDate", _$edates.val());
				}
				if (o.startmin_today) {
					$(sdates).datepicker("option", "minDate", new Date());
				}
			}
			if (o.end) {
				edates = _$edates.datepicker(
					$.extend({}, _opt, {
						foption: o
						, onSelect: function (selectedDate) {
							if (o.start) {
								$(sdates).datepicker("option", "maxDate", selectedDate);
							}
							if (typeof (o.callback) == "function") {
								var rval = selectedDate;
								var tval = selectedDate.replace(/\./g, "-");
								if (moment(tval).isValid()) {
									rval = moment(tval).format("YYYY-MM-DD")
								}
								o.callback(rval, _$edates, el);
							}
						}
					})
				);
				if (o.start) {
					$(edates).datepicker("option", "minDate", _$sdates.val());
				}
			}
		}

		//_$el.prop("readonly", true);

		_$el.each(function () {
			var _val = $(this).val();
			if (_val != "") {
				$(this).xval(_val);
			}
		});

		_$el.each(function () {
			var _o = $(this).data(), __o = {};
			//console.log("date picker", _o);

			if (_opt.readonly == true) {		//$dwp.ui.datepicker 함수 호출시 opt.readonly = false 경우 화면 전체 datepicker 편집 가능
				if (_o.readonly === false) {	//화면의 날짜 input 속성의 data-readonly = false 경우 대상 날짜필드는 편집 가능

				} else {
					$(this).attr("readonly", true);
				}
			}

			if ($(this).hasClass("hasDatepicker")) { return true; };

			if (_o.hasOwnProperty("func")) {
				var _func = $dwp.core.util.getFunction(_o.func);
				if (typeof _func[0] == "function") {
					__o.callback = _func[0];
				}
			}

			if (_o.start == undefined && _o.end == undefined) {
				_$el.datepicker($.extend(_opt, _o.opt));
			} else if (_o.start == undefined && _o.end != undefined) {
				//_fchk({start : $(this).attr("name"), end : _end});
				__o.start = $(this).attr("name");
				__o.end = _o.end;
				_fchk($.extend(__o, _o.opt));
			} else if (_o.start != undefined && _o.end == undefined) {
				//_fchk({start : _start, end : $(this).attr("name")})
				__o.start = _o.start;
				__o.end = $(this).attr("name");
				_fchk($.extend(__o, _o.opt));
			} else {
				//_fchk({start : _start, end : _end})
				__o.start = _o.start;
				__o.end = _o.end;
				_fchk($.extend(__o, _o.opt));
			}

		});
		/*
		if( $.isEmptyObject(_fopt) ) {
			_$el.datepicker(_opt);
		} else {
			_$el.each(function(){
				_obj = _is($(this).attr("name"));
				if ($.isEmptyObject(_obj)) {
					$(this).datepicker(_opt);
				}
			});
			$.each(_fopt, function(i,o){
				console.log("o", o)
				_fchk(o);
			});
		}
		*/
	};

	// 모바일용 Data Picker
	_$$.mdatepicker = function (el, opt, fopt) {
		var _$el = $("input[type='text'][data-type='date']", el)
			, _locale = $dwp.core.lang.getLang();

		_$el.off("click").on("click", function (event) {

			var _$et = $(this);													//선택 필드 날짜
			var _tDate = new Date(_$et.xval());									//선택일

			var _o = $.extend({}, _$et.data());

			if (_o.hasOwnProperty("func")) {
				var _func = $dwp.core.util.getFunction(_o.func);
				if (typeof _func[0] == "function") {
					_o.callback = _func[0];
				}
			}

			var _mindate = "";													//최소 날짜
			var _maxdate = "";													//최대 날짜

			_$et.blur();

			if (_$et.attr("readonly")) return false;

			if (_o.start == undefined && _o.end == undefined) {
				_mindate = "";
				_maxdate = "";
			} else {
				if (_o.start == undefined && _o.end != undefined) {
					_o.start = _$et.attr("name");
				} else if (_o.start != undefined && _o.end == undefined) {
					_o.end = _$et.attr("name");
				}

				var _sVal = $("input[name='" + _o.start + "']", el).xval();
				var _eVal = $("input[name='" + _o.end + "']", el).xval();
				//console.log("Start", event.target.name )
				switch (event.target.name) {
					case _o.start:
						_mindate = new Date();
						_maxdate = (_eVal == "" ? "" : new Date(_eVal));
						//console.log("Start")
						break;
					case _o.end:
						_mindate = (_sVal == "" ? "" : new Date(_sVal));
						_maxdate = "";
						//console.log("End")
						break;
					default:
						//console.log("None")
						break;
				}
			}

			window.plugins.datePicker.show({
				date: _tDate,
				mode: 'date',
				allowOldDates: true,
				androidTheme: 4,
				minDate: ($dwp.core.util.getDeviceInfo.ios() ? _mindate : (_mindate).valueOf()),
				maxDate: ($dwp.core.util.getDeviceInfo.ios() ? _maxdate : (_maxdate).valueOf()),
				locale: ($dwp.core.lang.getLang() == "ko" ? "ko_kr" : "en_us")
			}, function (_date) {
				var _rDate = new Date(_date);
				var _year = _rDate.getFullYear();
				var _month = _rDate.getMonth() + 1;
				var _day = _rDate.getDate();

				if (parseInt(_month) <= 9) _month = "0" + _month.toString();
				if (parseInt(_day) <= 9) _day = "0" + _day.toString();

				var rval = _year + "-" + _month + "-" + _day;

				_$et.xval(rval);

				if (typeof (_o.callback) == "function") {
					_o.callback(rval, _$et, el);
				}
			});

		});
	};

	/**
	 * Alert UI 함수
	 * @param	{object}	opt			options
	 * @param	{string}	opt.msg		메세지
	 * @return	{object}	deferred 객체
	 */
	_$$.alert = function (opt, callback) {
		var _opt = $.extend({ msg: "" }, opt)
			//alert(_opt.msg);
			, _h = "", _$alert = null, _defer = $.Deferred();

		_h += '<div class="ui-dialog dwp-alert-mask" tabindex=-2>';
		_h += '<div class="dwp-alert">';
		_h += '<div class="txt-area">';
		_h += _opt.msg.replace(/\n\r/g, "<br/>");
		_h += '</div>';
		_h += '<div class="btn-area">';
		_h += '<div class="dwp-btn alert-close strong"><span>' + $fn.getCodeMsg("comm.btn.confirm") + '</span></div>';
		_h += '<input type="text" value="" name="alert_ok" style="border:0px;width:0px;height:0px" autofocus=true tabindex=1>';
		_h += '</div>';
		_h += '</div>';
		_h += '</div>';

		_$alert = $(_h).appendTo($("body"));

		$("div.alert-close", _$alert).off("click").on("click", function () {
			_defer.resolve(_opt);
			_$alert.remove();
			if (typeof (callback) == "function") {
				callback()
			}
		});

		$("input[name='alert_ok']", _$alert).off("keydown").on("keydown", function (event) {
			if (typeof (event.preventDefault) == "function") event.preventDefault();
			if (typeof (event.stopPropagation) == "function") event.stopPropagation();
			if (event.keyCode == 13 || event.keyCode == 32) {	//enter : 13, space : 32
				_defer.resolve(_opt);
				_$alert.remove();
				if (typeof (callback) == "function") {
					callback()
				}
			}
			if (event.keyCode == 27) {	//esc : 27
				_defer.resolve(_opt);
				_$alert.remove();
				if (typeof (callback) == "function") {
					callback()
				}
			}
		});

		if (typeof dwpmo == 'undefined') {
			$("input[name='alert_ok']", _$alert).focus();
		}

		return _defer;
	};
	/**
	 * Confirm 함수
	 * @param	{object}	opt			options
	 * @param	{string}	opt.msg		메세지
	 * @return	{object}	deferred 객체
	 */
	_$$.confirm = function (opt, callback) {
		var _opt = $.extend({ msg: "" }, opt)
			, _h = "", _$confirm = null, _defer = $.Deferred();

		_h += '<div class="ui-dialog dwp-alert-mask">';
		_h += '<div class="dwp-alert">';
		_h += '<div class="txt-area">';
		_h += _opt.msg.replace(/\n\r/g, "<br/>");
		_h += '</div>';
		_h += '<div class="btn-area">';
		_h += '<div class="dwp-btn strong confirm-yes"><span>' + $fn.getCodeMsg("comm.btn.confirm") + '</span></div>';
		_h += '<div class="dwp-btn confirm-no"><span>' + $fn.getCodeMsg("comm.btn.cancel") + '</span></div>';
		_h += '<input type="text" value="" name="confirm_ok" style="border:0px;width:0px;height:0px" autofocus=true tabindex=1/>';
		_h += '</div>';
		_h += '</div>';
		_h += '</div>';

		_$confirm = $(_h).appendTo($("body"));

		$("div.confirm-yes", _$confirm).off("click").on("click", function () {
			_defer.resolve(_opt);
			_$confirm.remove();
			if (typeof (callback) == "function") {
				callback()
			}
		});
		$("div.confirm-no", _$confirm).off("click").on("click", function () {
			_defer.reject(_opt);
			_$confirm.remove();
			//if (typeof(callback) == "function") {
			//	callback()
			//}
		});

		$("input[name='confirm_ok']", _$confirm).off("keydown").on("keydown", function (event) {
			if (typeof (event.preventDefault) == "function") event.preventDefault();
			if (typeof (event.stopPropagation) == "function") event.stopPropagation();
			//event.preventDefault();
			if (event.keyCode == 13 || event.keyCode == 32) {	// Enter, Space
				_defer.resolve(_opt);
				_$confirm.remove();
				if (typeof (callback) == "function") {
					callback()
				}
			}
			if (event.keyCode == 27) {	// ESC
				_defer.reject(_opt);
				_$confirm.remove();
				//if (typeof(callback) == "function") {
				//	callback()
				//}
			}
		});

		if (typeof dwpmo == 'undefined') {
			$("input[name='confirm_ok']", _$confirm).focus();
		}


		//$("div.confirm-yes", _$confirm).focus();
		return _defer;
	};
	/**
	 * Web editor 처리
	 * @namespace
	 */
	_$$.weditor = {
		_CONST: {
			IMG_DBPATH: "/dwp/com/upload/img_up.nsf"
			, IMG_FILEID: "%%File"
			, IMG_CONVERT_PATH: "/dwp/com/upload/img_up.nsf/ImageToBase64.xsp?url="
			, _MIME_VER: "MIME-Version: 1.0"
			, _MIME_BND: "TCC_MIME"
			, _MIME_M_BND: "TCC_M_MIME"
			, _MIME_TYPE: "Content-Type: multipart/related; boundary=\"TCC_MIME\""
			, _MIME_M_TYPE: "Content-Type: multipart/mixed; boundary=\"TCC_M_MIME\""
			, _CON_TYPE: { "gif": "image/gif", "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "bmp": "image/bmp", "etc": "application/octet-stream" }
		}
		/**
		 * Web 에디터 종류
		 * @return	{string}	xfe : Tag
		 */
		, getType: function () {
			return $fn.getSysinfo().webeditor;
		}
		, initDextEditor: function (id) {
			var _me = this;
			DEXT5.config.Lang = ($dwp.core.lang.getLang() == "ko" ? "ko-kr" : $dwp.core.lang.getLang() == "en" ? "en-us" : $dwp.core.lang.getLang() == "zh" ? "zh-cn" : "en-us");
			//DEXT5.config.HandlerUrl = location.protocol +"//"+location.hostname+ _me._CONST.IMG_DBPATH + "/upload?CreateDocument&xeditor=DEXT";
			DEXT5.config.HandlerUrl = location.protocol + "//" + location.host + _me._CONST.IMG_DBPATH + "/upload?CreateDocument&xeditor=DEXT";
			//에디터의 파일로 저장 툴바 클릭시 호출되는 Url - 2015.12.08 by dwlee
			//DEXT5.config.HandlerUrlSaveForNotes = "http://"+location.hostname+ _me._CONST.IMG_DBPATH + "/upload?CreateDocument&xeditor=DEXT";

			//DEXT5.config.UserFieldID = "ImageKey";							//이미지 첨부 키값을 저장하는 필드
			//DEXT5.config.UserFieldValue = "docUnid";							//이미지 첨부 키값
			DEXT5.config.FileFieldID = _me._CONST.IMG_FILEID;

			DEXT5.config.Width = "100%";
			DEXT5.config.Height = "100%";
			DEXT5.config.EditorHolder = id;
			new Dext5editor(id);
		}

		, initSynapEditor: function (id) {
			var _me = this;
			synapEditorConfig['editor.license'] = "/tcclibs/js/lib/synapEditor_2.10.1/SynapEditor/license.json";
			synapEditorConfig['editor.notification.show.level'] = ['error', 'warning'];
			synapEditorConfig['editor.mode.iframe'] = {
				'enable': true,
				'style.urls': ['/tcclibs/js/lib/synapEditor_2.10.1/SynapEditor/iframeMode/contentsEditStyle.css'],
				'script.urls': ['/tcclibs/js/lib/synapEditor_2.10.1/SynapEditor/iframeMode/SEPolyfill.min.js']
			};
			synapEditorConfig['editor.lang'] = $dwp.core.lang.getLang();
			synapEditorConfig['editor.upload.image.api'] = '/dwp/com/upload/img_up.nsf/upload?CreateDocument&xeditor=SYNAP';
			synapEditorConfig['editor.upload.image.fileFieldName'] = _me._CONST.IMG_FILEID;

			synapEditorConfig['editor.import.api'] = '/SynapDocEditor/importDoc';

			var eventListeners = {
				initializedSync: function (e) {
					window.synapEditor = e.editor;
					synap_editor_loaded_event(synapEditor);
				},

				initialized: function (e) {
					window.synapEditor = e.editor;
					synap_editor_loaded_event(synapEditor);
				}
			};
			new SynapEditor(id, synapEditorConfig, "", eventListeners);
		}

		, destroy: function (el) {
			var _me = this
				, _ed = null;

			_ed = _me.getEditor(el);
			if (_ed == null) { return null; }

			// 2021-06-16 Editor존재 시, 레이아웃이 깨짐현상발생 Fix
			//if ($("#bodywrap", el).size() > 0) {
			//	$("#bodywrap", el).remove();
			//}
			if (_me.getType() == "dext") {
				DEXT5.destroy(_ed);
			} else if (_me.getType() == "synap") {
				//synapEditor.destroy(_ed);
				//사이냅 에디터는 destroy 함수를 제공하지 않아서 아래와 같이 처리 - 2020.12.02 by LHJ
				window.synapEditor = null;
				var _$synap = $("div[id=" + _ed + "]");
				_$synap.removeData();
				_$synap.empty();
			} else {
				//return _ed.xfe.getDom();
			}
		}
		, ismobile: function () {
			return $dwp.core.util.getDeviceInfo.type() != "PC";
		}
		, getEditor: function (el) {
			var _me = this
				, _$el = el || $("div.dwp-wrapping", $dwp.core.getTarget())
				, _ed = null;

			if (_me.ismobile()) {
				return $("#xfe_ed", _$el).get(0);
			}

			if (_me.getType() == "dext") {
				var _$dext = $("div[role=editor_ed]", _$el);
				if (_$dext.size() == 0) { return null }

				var _dext_id = _$dext.attr("id");
				return _dext_id;
				//_ed = DEXT5.getEditor(_dext_id);
			} else if (_me.getType() == "synap") {
				var _$synap = $("div[role=editor_ed]", _$el);
				if (_$synap.size() == 0) { return null }

				var _synap_id = _$synap.attr("id");
				return _synap_id;
			} else {
				var _$xfe = $("#xfe_ed", _$el)[0];
				if (typeof (_$xfe) == "undefined") { return null; }

				_ed = _$xfe.contentWindow;

				if (typeof (_ed) == "undefined") { return null; }
				if (typeof (_ed.xfe) == "undefined") { return null; }
			}

			return _ed;
		}
		, getDom: function (el) {
			var _me = this, _ed = null;

			if (_me.ismobile()) {
				return _me.getEditor(el);
			}

			_ed = _me.getEditor(el);
			if (_ed == null) { return null; }

			if (_me.getType() == "dext") {
				return DEXT5.getDext5Dom(_ed);
				//return DEXT5.getD5Dom(_ed);
				//return DEXT5.getDext5BodyDom(_ed);
			} else if (_me.getType() == "synap") {
				return $(synapEditor.getPublishingHtml())[0];
			} else {
				return _ed.xfe.getDom();
			}
		}
		, getImg: function (el) {
			var _me = this
			_dom = _me.getDom(el);

			if (_dom == null) return [];
			return $("img", _dom);

		}
		, insertHtmlAtCursor: function (el, html) {
			var _me = this
				, _ed = _me.getEditor(el);
			if (_ed == null) { return null; }
			_ed.xfe.insertHtmlAtCursor(html);
		}
		, pasteHtmlAtCaret: function (html, el, selectPastedContent) {
			var _me = this, sel, range;
			if (window.getSelection) {
				// IE9 and non-IE
				sel = window.getSelection();
				if (sel.rangeCount == 0) {
					var _ed = _me.getEditor(el);
					$(_ed).append(html);
					return;
				}
				if (sel.getRangeAt && sel.rangeCount) {
					if (sel.rangeCount == 0) {
						var _ed = _me.getEditor(el);
						$(_ed).append(html);
					} else {
						range = sel.getRangeAt(0);
						range.deleteContents();

						// Range.createContextualFragment() would be useful here but is
						// only relatively recently standardized and is not supported in
						// some browsers (IE9, for one)
						var el = document.createElement("div");
						el.innerHTML = html;
						var frag = document.createDocumentFragment(), node, lastNode;
						while ((node = el.firstChild)) {
							lastNode = frag.appendChild(node);
						}
						var firstNode = frag.firstChild;
						range.insertNode(frag);

						// Preserve the selection
						if (lastNode) {
							range = range.cloneRange();
							range.setStartAfter(lastNode);
							if (selectPastedContent) {
								range.setStartBefore(firstNode);
							} else {
								range.collapse(true);
							}
							sel.removeAllRanges();
							sel.addRange(range);
						}
					}
				}
			} else if ((sel = document.selection) && sel.type != "Control") {
				// IE < 9
				var originalRange = sel.createRange();
				originalRange.collapse(true);
				sel.createRange().pasteHTML(html);
				if (selectPastedContent) {
					range = sel.createRange();
					range.setEndPoint("StartToStart", originalRange);
					range.select();
				}
			}
		}
		, setFocus: function (el) {
			var _me = this
				, _ed = _me.getEditor(el);
			if (_ed == null) { return null; }

			if (_me.getType() == "dext") {
				DEXT5.setFocusToEditor(_ed);
			} else if (_me.getType() == "synap") {

			} else {
				_ed.xfe.setFocus();
			}
		}
		, getMedia: function (el) {
			var _me = this
			_dom = _me.getDom(el);

			if (_dom == null) return [];

			return $("iframe[name='dwp_media'], iframe[src*='youtube.com']", _dom);
		}
		, getBodyValue: function (el) {
			var _me = this
				, _ed = _me.getEditor(el), _h = "";

			if (_ed == null) { return ""; }

			if (_me.ismobile()) {
				_h = $(_ed).html();
				return _h;
			} else {
				if (_me.getType() == "dext") {
					_h = DEXT5.getBodyValueEx(_ed);
				} else if (_me.getType() == "synap") {
					_h = synapEditor.getPublishingHtml();
				} else {
					_h = _ed.xfe.getBodyValue();
				}
				return _h;
			}
		}
		, getHtmlValue: function (el) {
			var _me = this
				, _ed = _me.getEditor(el), _h = "";

			if (_ed == null) { return ""; }

			if (_me.ismobile()) {
				_h = $(_ed).html();

				//_h = _h.replace(/src=\"[^>\"']+hankooktire.com\/wps\/PA_DWP_WENMedia\//g, "src=\"/wps/PA_DWP_WENMedia/");
				//_h = _h.replace(/src='[^>\"']+hankooktire.com\/wps\/PA_DWP_WENMedia\//g, "src='/wps/PA_DWP_WENMedia/");

				//_h = _h.replace(dwpmo.info.protocol + dwpmo.info.domain + "/wps/PA_DWP_WENMedia/", "/wps/PA_DWP_WENMedia/");
				return "<html><body>" + _h + "</body></html>";
			} else {
				if (_me.getType() == "dext") {
					_h = DEXT5.getHtmlValueEx(_ed);
				} else if (_me.getType() == "synap") {
					_h = synapEditor.getPublishingHtml();
				} else {
					_h = _ed.xfe.getHtmlValue();
				}
				//_h = _h.replace(/src=\"[^>\"']+hankooktire.com\/wps\/PA_DWP_WENMedia\//g, "src=\"/wps/PA_DWP_WENMedia/");
				//_h = _h.replace(/src='[^>\"']+hankooktire.com\/wps\/PA_DWP_WENMedia\//g, "src='/wps/PA_DWP_WENMedia/");
				return _h;
			}
		}
		, getTextValue: function (el) {
			var _me = this
				, _ed = _me.getEditor(el);

			if (_ed == null) { return ""; }

			if (_me.ismobile()) {
				return $(_ed).text();
			} else {
				if (_me.getType() == "dext") {
					return DEXT5.getBodyTextValue(_ed);
				} else if (_me.getType() == "synap") {
					return synapEditor.getTextContent();
				} else {
					return _ed.xfe.getTextValue();
				}
			}
		}
		, setFuncCall: function (el, callback) {
			var _me = this
				, ed = _me.getEditor(el);

			if (ed == null) { setTimeout(function () { _me.setFuncCall(el, callback) }, 10); return }
			if (typeof (ed.xfe.getDom) == "undefined") { setTimeout(function () { _me.setFuncCall(el, callback) }, 10); return };
			if (typeof callback == "function") {
				callback(ed.xfe.getDom());
			}

		}
		, setFuncICall: function (el, callback) {
			var _me = this
				, ed = _me.getEditor(el);

			if (ed == null) { setTimeout(function () { _me.setFuncICall(el, callback) }, 10); return }
			if (ed.document == null) { setTimeout(function () { _me.setFuncICall(el, callback) }, 10); return }
			if (ed.document.querySelector('.xfeDesignFrame') == null) { setTimeout(function () { _me.setFuncICall(el, callback) }, 10); return }
			if (typeof callback == "function") {
				callback(ed.document.querySelector('.xfeDesignFrame'));
			}
		}
		, setBodyValue: function (sbody, el, callback, _active) {
			var _me = this
				, ed = _me.getEditor(el);

			if (_me.ismobile()) {
				$(ed).html(sbody);
				return;
			}

			if (_me.getType() == "dext") {
				DEXT5.setBodyValueEx(sbody, ed);

				if (typeof callback == "function") {
					setTimeout(function () {
						callback(_me.getDom(el));
					}, 500);
				}
			} else if (_me.getType() == "synap") {
				synapEditor.openHTML(sbody);

				if (typeof callback == "function") {
					setTimeout(function () {
						callback(_me.getDom(el));
					}, 500);
				}
			} else {
				if (document.activeElement != null && !$.isEmptyObject(document.activeElement)) {
					if (document.activeElement.tagName.toUpperCase() != "IFRAME") {
						_active = document.activeElement;
					}
				}

				if (ed == null) { setTimeout(function () { _me.setBodyValue(sbody, el, callback, _active) }, 10); return }
				if (typeof (ed.xfe.setBodyValue) == "undefined") { setTimeout(function () { _me.setBodyValue(sbody, el, callback, _active) }, 10); return };

				setTimeout(function () {
					var _isEdFocus = false;
					if (typeof _active == "undefined") { _isEdFocus = true; }
					else if (_active.tagName.toUpperCase() != "INPUT" && _active.tagName.toUpperCase() != "TEXTAREA") { _isEdFocus = true; }
					else if (_active.tagName.toUpperCase() == "INPUT" && $(_active).is("[type]") && $(_active).attr("type").toUpperCase() != "TEXT") { _isEdFocus = true; }

					if (_isEdFocus) {
						var _$inp = $("input[name=Subject]", $(el));
						if (_$inp.size() == 0) {
							_$inp = $("input[type=text]", $(el));
						}
						if (_$inp.size() > 0) {
							_$inp.get(0).focus();
						}
					}

					ed.xfe.setBodyValue(sbody);

					if (_isEdFocus) {
						ed.xfe.setFocus();
					} else {
						_active.focus();
					}

					if (typeof callback == "function") {
						setTimeout(function () {
							callback(ed.xfe.getDom());
						}, 500);
					}
				}, 500);
			}
		}
		, setHtmlValue: function (sbody, el, callback, _active) {
			var _me = this
				, ed = _me.getEditor(el);

			if (_me.ismobile()) {
				$(ed).html(sbody);
				return;
			}

			if (_me.getType() == "dext") {
				DEXT5.setHtmlValueEx(sbody, ed);

				if (typeof callback == "function") {
					setTimeout(function () {
						callback(_me.getDom(el));
					}, 500);
				}
			} else if (_me.getType() == "synap") {
				synapEditor.openHTML(sbody);

				if (typeof callback == "function") {
					setTimeout(function () {
						callback(_me.getDom(el));
					}, 500);
				}
			} else {
				if (document.activeElement != null && !$.isEmptyObject(document.activeElement)) {
					if (document.activeElement.tagName.toUpperCase() != "IFRAME") {
						_active = document.activeElement;
					}
				}

				if (ed == null) { setTimeout(function () { _me.setHtmlValue(sbody, el, callback, _active) }, 10); return }
				if (typeof (ed.xfe.setHtmlValue) == "undefined") { setTimeout(function () { _me.setHtmlValue(sbody, el, callback, _active) }, 10); return };

				setTimeout(function () {
					var _isEdFocus = false;
					if (typeof _active == "undefined") { _isEdFocus = true; }
					else if (_active.tagName.toUpperCase() != "INPUT" && _active.tagName.toUpperCase() != "TEXTAREA") { _isEdFocus = true; }
					else if (_active.tagName.toUpperCase() == "INPUT" && $(_active).is("[type]") && $(_active).attr("type").toUpperCase() != "TEXT") { _isEdFocus = true; }

					if (_isEdFocus) {
						var _$inp = $("input[name=Subject]", $(el));
						if (_$inp.size() == 0) {
							_$inp = $("input[type=text]", $(el));
						}
						if (_$inp.size() > 0) {
							_$inp.get(0).focus();
						}
					}

					ed.xfe.setHtmlValue(sbody);

					if (_isEdFocus) {
						ed.xfe.setFocus();
					} else {
						_active.focus();
					}

					if (typeof callback == "function") {
						setTimeout(function () {
							callback(ed.xfe.getDom());
						}, 500);
					}
				}, 500);
			}
		}
		, setTinyHtmlValue: function (sbody) {
			var _me = this

			//console.log("ed", sbody)
			if (tinymce.activeEditor == null) { setTimeout(function () { _me.setTinyHtmlValue(sbody) }, 10); return }
			if (typeof (tinymce.activeEditor.initialized) == "undefined") { setTimeout(function () { _me.setTinyHtmlValue(sbody) }, 10); return };
			if (!tinymce.activeEditor.initialized) { setTimeout(function () { _me.setTinyHtmlValue(sbody) }, 10); return };
			console.log(tinymce.activeEditor.setContent);
			tinymce.activeEditor.setContent(sbody);
		}
		, getMimeValue: function (el, success, fail) {
			var _me = this
				, _html = _me.getHtmlValue(el);
			// console.log("xEditor.getMimeValue --> start");
			console.log("_html", _html);
			// _html = _html.replace(/http:\/\/www.shindongah.co.kr/gi,
			// "/_intra");
			var _imgmime = "";

			function getImgMimeValue() {
				var _allimgList = ""
					, _deferreds = []
					, pattern = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/gi
					, match = pattern.exec(_html)
					, s = [];

				function _nameEnc(name) {
					return "=?utf-8?B?" + $.base64Encode(name) + "?=";
				}
				function _getImgType(fname, data) {
					// console.log("type", data);
					var type = "";
					if (fname.indexOf(".") > -1) { type = fname.split(".")[1]; }
					if (typeof (_me._CONST._CON_TYPE[type]) != "undefined") return [type, _me._CONST._CON_TYPE[type]];

					if (data.substr(1, 3) == "PNG") {
						type = "png";
					} else if (data.substr(0, 3) == "GIF") {
						type = "gif";
					} else if (data.substr(0, 2) == "BM") {
						type = "bmp";
					} else if (data.substr(6, 4) == "JFIF" || data.substr(6, 4) == "Exif") {
						type = "jpeg";
					} else if (data.substr(0, 2) == "II") {
						type = "tiff";
					} else {
						type = "etc";
					}
					// console.log(type);
					return [type, _me._CONST._CON_TYPE[type]];
				}
				function _getImgMimeValue(response, fname, cid, nfname, xhr) {
					var uInt8Array = new Uint8Array(response)
						, i = uInt8Array.length
						, binaryString = new Array(i)
						, data, base64, ctype, rtnVal = "", _ctype = "", _fname = "";

					while (i--) {
						binaryString[i] = String.fromCharCode(uInt8Array[i]);
					}

					data = binaryString.join('');
					base64 = window.btoa(data).replace(/.{76}(?=.)/g, '$&\n');
					//ctype = _getImgType(fname, data.substr(0, 10));
					_ctype = xhr.getResponseHeader("Content-Type");
					console.log("_ctype", _ctype);
					if (_ctype == null || _ctype == "application/octet-stream" || _ctype == "") {
						var _typeinfo = _getImgType(fname, data.substr(0, 10));
						_ctype = _typeinfo[1];
						_fname = cid + "." + _typeinfo[0];
					} else {
						_ext = _ctype.split("/");
						_fname = cid + "." + (_ext.length > 1 ? _ext[1] : _ext[0]);
					}

					//console.log("Content-Type", _ctype)
					rtnVal = '\r\n--' + _me._CONST._MIME_BND + '\r\n';
					//rtnVal += 'Content-Type: ' + ctype[1] + '; name="' + _nameEnc(cid + "." + ctype[0]) + '"' + '\r\n';
					//rtnVal += 'Content-Disposition: inline; filename="' + cid +"." + ctype[0] + '"\r\n';
					rtnVal += 'Content-Type: ' + _ctype + '; name="' + _nameEnc(_fname) + '"' + '\r\n';
					rtnVal += 'Content-Disposition: inline; filename="' + _fname + '"\r\n';
					rtnVal += 'Content-ID: <' + cid + '>\r\n';
					rtnVal += 'Content-Transfer-Encoding: base64' + '\r\n\r\n';
					rtnVal += base64 + '\r\n';
					// console.log(rtnVal);
					return rtnVal;
				}

				function _getBase64ImgMimeValue(ctype, base64, fname, cid, nfname) {
					var _ctype = ctype;
					if (_ctype == "") {
						var type = "etc";
						if (fname.indexOf(".") > -1) {
							type = fname.split(".")[1];
						}
						if (typeof (_me._CONST._CON_TYPE[type]) == "undefined") {
							type = "etc";
						}
						_ctype = _me._CONST._CON_TYPE[type];
					}

					var rtnVal = '\r\n--' + _me._CONST._MIME_BND + '\r\n';
					rtnVal += 'Content-Type: ' + _ctype + ';\r\n name="' + _nameEnc(nfname) + '"' + '\r\n';
					rtnVal += 'Content-Disposition:inline' + '\r\n';
					rtnVal += 'Content-ID: <' + cid + '>\r\n';
					rtnVal += 'Content-Transfer-Encoding: base64' + '\r\n\r\n';
					if (ctype != "") {
						rtnVal += base64.replace(/.{76}(?=.)/g, '$&\n') + '\r\n';
					} else {
						rtnVal += base64 + '\r\n';
					}
					return rtnVal;
				}

				while (match != null) {
					s.push(match[1]);
					match = pattern.exec(_html);
				}

				$.each(s, function (i, _src) {
					var fname, cid, nfname, _ajaxsrc = "";
					var idx = i + "_" + parseInt(Math.random() * 10000, 10);
					var regExp;
					//var regExp = new RegExp("^\/|^http:\/\/" + window.location.host, "gi");
					if (_me.ismobile() && typeof dwpmo == "object") {
						regExp = new RegExp("^\/|^http:\/\/" + dwpmo.info.domain + "|^https:\/\/" + dwpmo.info.domain, "gi");
					} else {
						regExp = new RegExp("^\/|^http:\/\/" + window.location.host + "|^https:\/\/" + window.location.host, "gi");
					}
					if (regExp.test(_src)) {
						_ajaxsrc = _src;
						if (_src.indexOf("/optimize/") > -1 && _src.indexOf("&amp;im=") > -1) {
							if (dwpmo) {
								_ajaxsrc = dwpmo.info.protocol + dwpmo.info.domain + _src.substring(_src.indexOf("&amp;im=") + 8);
							} else {
								_ajaxsrc = "http://" + window.location.host + _src.substring(_src.indexOf("&amp;im=" + 8));
							}
						}
						if (_allimgList.indexOf(_src + "|") == -1) {
							var tmp = _src;
							if (tmp.indexOf("?") > -1) { tmp = tmp.split("?")[0]; }
							var tmpList = tmp.split("/");
							fname = tmpList[tmpList.length - 1];

							cid = "TCC_IMG_" + idx;
							// cid = "<" + idx + "_" + fname + ">";
							nfname = "NAMEIMG_" + idx;

							var _defered = $.Deferred();
							var _request;
							if (typeof (Uint8Array) == "undefined") {
								_request = $.ajax({
									url: _me._CONST.IMG_CONVERT_PATH + _ajaxsrc,
									dataType: 'text'
								}).done(function (data, textStatus, jqXHR) {
									_imgmime += _getBase64ImgMimeValue("", data, fname, cid, nfname);
									_html = _html.replace(_src, "cid:" + cid);
									_defered.resolve();
								}).fail(function () {
									console.log('error');
									_defered.resolve();
								});

								_deferreds.push(_defered.promise());
								/*
								_deferreds.push(
									$.ajax({url:_me._CONST.IMG_CONVERT_PATH + _ajaxsrc,
										dataType : 'text'
									}).done(function(data, textStatus, jqXHR) {
										_imgmime += _getBase64ImgMimeValue("", data, fname, cid, nfname);
										_html = _html.replace(_src, "cid:" + cid);
									}).fail(function(){console.log('error');})
								);
								*/
							} else {
								_request = $.ajax({
									url: _ajaxsrc,
									dataType: 'binary',
									xhrFields: { responseType: 'arraybuffer' }
								}).done(function (data, textStatus, jqXHR) {
									_imgmime += _getImgMimeValue(data, fname, cid, nfname, jqXHR);
									_html = _html.replace(_src, "cid:" + cid);
									_defered.resolve();
								}).fail(function () {
									console.log('error22');
									_defered.resolve();
								});

								_deferreds.push(_defered.promise());
								/*
								_deferreds.push(
									$.ajax({url: _ajaxsrc,
										dataType : 'binary',
										xhrFields : { responseType:'arraybuffer' }
									}).done(function(data, textStatus, jqXHR) {
										_imgmime += _getImgMimeValue(data, fname, cid, nfname, jqXHR);
										_html = _html.replace(_src, "cid:" + cid);
									}).fail(function(){console.log('error22');})
								);
								*/
							}

							_allimgList += _src + "|";
						}
					} else {
						var regExp2 = /data\:(image\/[^;]+);base64,(.*)/gi;
						if (regExp2.test(_src)) {
							fname = "NAMEIMG." + i;
							cid = "TCC_IMG_" + idx;
							nfname = "NAMEIMG_" + idx;

							_imgmime += _getBase64ImgMimeValue(RegExp.$1, RegExp.$2, fname, cid, nfname);
							_html = _html.replace(_src, "cid:" + cid);
						}
					}
				});

				return _deferreds;
			}

			var deferreds = getImgMimeValue();

			$.when.apply($, deferreds).always(function () {
				//var rtnVal = _me._CONST._MIME_VER + '\r\n';
				var rtnVal = "";

				// rtnVal += xEditor._CONST._MIME_M_TYPE + '\r\n\r\n';
				// rtnVal += '--' + xEditor._CONST._MIME_M_BND + '\r\n';

				//첨부파일이 있는 경우는 헤더 타입을 무조건 Mixed 로 변경 - 2019.09.06 by LHJ
				if ($("input[name='Multi_Attach_SortFiles']", el).val() != "") {
					rtnVal += _me._CONST._MIME_M_TYPE + '\r\n\r\n';
					rtnVal += '--' + _me._CONST._MIME_M_BND + '\r\n';
				}

				rtnVal += _me._CONST._MIME_TYPE + '\r\n\r\n';
				rtnVal += '--' + _me._CONST._MIME_BND + '\r\n';
				rtnVal += 'Content-Type: text/html; charset="utf-8"' + '\r\n';
				rtnVal += 'Content-Transfer-Encoding: base64' + '\r\n\r\n';
				rtnVal += ($.base64Encode(_html).replace(/.{76}(?=.)/g, '$&\n') + '\r\n' + ((_imgmime != "") ? _imgmime : "")) + '\r\n';
				rtnVal += '--' + _me._CONST._MIME_BND + '--\r\n';

				//첨부파일이 있는 경우는 헤더 타입을 무조건 Mixed 로 변경 - 2019.09.06 by LHJ
				if ($("input[name='Multi_Attach_SortFiles']", el).val() != "") {
					rtnVal += '--' + _me._CONST._MIME_M_BND + '--\r\n';
				}

				// rtnVal += '--' + xEditor._CONST._MIME_M_BND + '--\r\n';
				if (typeof success == "function") { return success(rtnVal); }
				// if(typeof success == "function") { return
				// success(_html);}
			})
			/*
			$.when.apply($, deferreds).done(function() {
				var rtnVal = _me._CONST._MIME_VER + '\r\n';

				// rtnVal += xEditor._CONST._MIME_M_TYPE + '\r\n\r\n';
				// rtnVal += '--' + xEditor._CONST._MIME_M_BND + '\r\n';

				rtnVal += _me._CONST._MIME_TYPE + '\r\n\r\n';
				rtnVal += '--' + _me._CONST._MIME_BND + '\r\n';
				rtnVal += 'Content-Type: text/html; charset="utf-8"' + '\r\n';
				rtnVal += 'Content-Transfer-Encoding: base64' + '\r\n\r\n';
				rtnVal += ($.base64Encode(_html).replace(/.{76}(?=.)/g,'$&\n') + '\r\n' + ((_imgmime != "") ? _imgmime:"")) + '\r\n';
				rtnVal +=  '--' + _me._CONST._MIME_BND + '--\r\n';

				// rtnVal += '--' + xEditor._CONST._MIME_M_BND + '--\r\n';
				if(typeof success == "function") { return success(rtnVal);}
				// if(typeof success == "function") { return
				// success(_html);}
			}).fail(function() {
				alert('error');
				if(typeof fail == "function") { return fail();}
			});
			*/
		}
		, getDocBodyFrame: function (target, opt, doc) {
			var _me = this, _opt = $.extend({
				cdb: ""
				, unid: ""
				, hideimg: false
				, ismobile: false
			}, opt)
				, _url = $dwp.core.util.getProxyUrl(_opt.cdb + "/0/" + _opt.unid + "/Body?OpenField");

			$dwp.core.util.xAjax({
				cache: false
				, async: true
				, dataType: "html"
				, url: _url
			})
				.done(function (data) {
					var _now = new Date(), _tbody;
					data = data.replace(/\?OpenElement/gi, "?OpenElement&_=" + _now.getTime());
					//data= data.replace(/<style\sname="dwp_css"/gi, "<ostyle name=\"dwp_css\"");
					//data= data.replace(/\?OpenElement/gi,"?OpenElement&_=" + _now.getTime()).replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, "");
					//data= data.replace(/<ostyle\sname="dwp_css"/gi, "<style name=\"dwp_css\"");

					if (_opt.hideimg) {
						data = data.replace(/<img([^>]*)(src=[\"']?[^>\"']+[\"']?)([^>]*)>/gi, "<img$1o$2$3>");
					}

					if (_opt.ismobile) {
						var _pattern = /<a[^>]*(href)=([\"']?[^>\"']+[\"']?)[^>]*>/gi
							, _tdata = data
							, _match = _pattern.exec(_tdata);
						//,_exlist = ".hankooktire.com;.hankooktire.co.kr";
						while (_match != null) {
							//내부시스템 링크 삭제처리, 외부참조링크 새창으로 열기
							/*
							if ( _exlist.indexOf(_match[2]) > -1 ) {
								data = data.replace(_match[1], "rhref");
							} else
							*/
							if ((_match[2].indexOf("http://") > -1 || _match[2].indexOf("https://") > -1) && _match[2].indexOf(dwpmo.info.domain) == -1 && _match[2] != "#") {
								var link = " onclick=\"window.open('" + _match[2].replace(/\"/g, "").replace(/'/g, "") + "', '_system')\" ";
								data = data.replace(_match[2], "\"#\"" + link);
							}
							_match = _pattern.exec(_tdata);
						}
					}

					var _$iframe = $("<iframe src='about:blank' id='iBody' width=100% frameborder=0 scrolling=auto marginheight=0 allowTransparency=true></iframe>").appendTo($(target));
					var _body = _$iframe.get(0).contentWindow || (_$iframe.get(0).contentDocument.document || _$iframe.get(0).contentDocument);

					_body.document.open();
					_body.document.write(data);
					_body.document.close();

					_me._deleteAtt(_body.document.body);

					/*
					2020-08-03 By LHJ Remove 이미지 변환처리 제외
					if(opt.ismobile) {
						_me._imgerror(_body.document.body);
					}
					*/

					if (typeof opt.callback == "function") {
						opt.callback(doc);
					}

					// 이미지 로딩완료 체크 2020-08-03 By LHJ
					_me._loadingImg(_body.document.body, function () {

						// 2020-06-25 By LHJ 원본 이미지 보여주기
						if (doc.options.showfullimg) {
							var _fotodata = $("img[src]", $(_body.document.body)).map(function () {
								$(this).css("cursor", "pointer");
								return { img: $(this).attr("src") }
							}).get();
							if (_fotodata.length > 0) {
								var _$foto = $("#fotorama", doc.element);
								if (_$foto.size() == 0) {
									_$foto = $('<div class="fotorama fotorama--hidden" id="fotorama" data-allow-full-screen="true" data-allowfullscreen="native" data-fit="none" data-nav="thumbs" data-allow-full-screen="native"></div>').appendTo(doc.element);
								}
								var _foto = _$foto.fotorama().data('fotorama');
								if (typeof _foto != "undefined") {
									_foto.load(_fotodata);
									$("img[src]", $(_body.document.body)).off("click.img").on("click.img", function () {
										var _src = $(this).attr("src");
										var _index = 0;
										$.each(_fotodata, function (idx, o) {
											if (o.img == _src) { _index = idx; return false; }
										});
										_foto.requestFullScreen().show({ index: _index, time: 0 });
									});
								}
							}
						}

						setTimeout(function () {
							_$iframe.get(0).height = _body.document.body.scrollHeight + 20;
							_$iframe.get(0).width = _body.document.body.scrollWidth + $(_body.document.body).outerWidth(true) - $(_body.document.body).outerWidth(false);
						}, 10);
					});
					/*
					setTimeout(function() {
						_$iframe.get(0).height = _body.document.body.scrollHeight + 20;
						_$iframe.get(0).width = _body.document.body.scrollWidth;
					}, 500);
					*/
					//_me._reIframe(_$iframe.get(0), _opt);

					$(target).css({ 'display': 'block' });
				});
		}
		// 이미지 로딩완료 체크 2020-08-03 By LHJ
		, _loadingImg: function (obj, callback) {
			var _me = this
			var _defereds = [];

			$("img[src]", $(obj)).each(function () {
				var _defered = $.Deferred();
				this.onload = function () {
					console.log("onload" + _defereds.length)
					_defered.resolve();
				};
				this.onerror = function () {
					console.log("onerror" + _defereds.length)
					_defered.resolve();
				}
				_defereds.push(_defered.promise());
			});

			if (_defereds.length > 0) {
				$.when.apply($, _defereds).always(function () {
					console.log("when");
					callback();
				});
			} else {
				callback();
			}
		}
		, getDocBodyFrame__: function (target, opt) {
			var _me = this, _opt = $.extend({
				cdb: ""
				, unid: ""
				, hideimg: false
				, ismobile: false
			}, opt)
				, _url = $dwp.core.util.getProxyUrl(_opt.cdb + "/0/" + _opt.unid + "/Body?OpenField");

			if (_opt.ismobile) {
				_url = dwpmo.info.protocol + dwpmo.info.domain + _url;
			}
			/*
			if ($.browser.msie) {
				var tbody = "<iframe src=\"" + _url + "\" id=\"iBody\" WIDTH=100% FRAMEBORDER=0  scrolling=auto marginheight=0 allowTransparency=\"true\" onreadystatechange=\"vbody._reIframe(this,'" + sBaseUrl + "')\" ></iframe>";
			} else {
				var tbody = "<IFRAME src=\"" + _url + "\" id=\"iBody\" WIDTH=100% FRAMEBORDER=0  scrolling=auto marginheight=0 allowTransparency=\"true\" onload=\"vbody._reIframe(this,'" + sBaseUrl + "')\" ></IFRAME>";
			}
			*/
			var _$body = $("<iframe src=\"" + _url + "\" id='iBody' width=100% frameborder=0 scrolling=no marginheight=0 allowTransparency=true></iframe").appendTo($(target));
			_$body.on("load", function (e) {
				_me._reIframe(this, _opt);
			});

			$(target).css({ 'display': 'block' });

		}
		, _reIframe: function (obj, opt) {
			var _me = this, iheight;
			try {
				if (obj.contentWindow.document.readyState == "complete") {
					var obody = obj.contentWindow.document.body;
					var tmp = obody.innerHTML;
					tmp = tmp.replace(/""/g, "'");

					if (tmp.indexOf("&lt;") > -1) {
						tmp = tmp.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, '&');
					}

					$(obody).html(tmp);

					_me._deleteAtt(obody);

					//if ( sBaseUrl != "" ) {
					//	vbody._setBaseImg(obody, sBaseUrl);
					//}

					setTimeout(function () {
						obj.height = obody.scrollHeight + 20;
						obj.width = obody.scrollWidth;
					}, 100);
				}
			} catch (e) {
				obj.height = "500";
				obj.scrolling = "auto";
			}
		}
		, _setBaseImg: function (bodyFld, sBaseUrl) {
			$(bodyFld).find("img").each(function () {
				if ($(this).attr("src").indexOf("http://") == -1) {
					$(this).attr("src", "http://" + sBaseUrl + $(this).attr("src"));
				} else {
					if ($(this).attr("src").indexOf(window.location.host) > -1) {
						var tmp = $(this).attr("src").replace(window.location.host, sBaseUrl);
						$(this).attr("src", tmp);
					}
				}
			});
		}
		, getDocBody: function (target, opt, doc) {
			var _me = this, _opt = $.extend({
				cdb: ""
				, unid: ""
				, hideimg: false
				, ismobile: false
			}, opt)
				, _url = $dwp.core.util.getProxyUrl(_opt.cdb + "/0/" + _opt.unid + "/Body?OpenField");

			$dwp.core.util.xAjax({
				cache: false
				, async: false
				, dataType: "html"
				, url: _url
			})
				.done(function (data) {
					var _now = new Date(), _tbody;
					data = data.replace(/<style\sname="dwp_css"/gi, "<ostyle name=\"dwp_css\"");
					data = data.replace(/\?OpenElement/gi, "?OpenElement&_=" + _now.getTime()).replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, "");
					data = data.replace(/<ostyle\sname="dwp_css"/gi, "<style name=\"dwp_css\"");
					data = data.replace(/<div\sid="attachments"/gi, "<div ");
					data = data.replace(/<BASE([^>]*)(href=[\"']?[^>\"']+[\"']?)([^>]*)>/gi, "");
					//data= data.replace(/<meta[^>]*?>/gi, "");

					data = data.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&");
					data = data.replace("&empno=$1", "&empno=" + $fn.getCurUser().pinfo.empno);
					/*
					var _regExp = /@([0-9]+)@/g
					,_data = data
					,_match = _regExp.exec(_data);
					while(_match != null) {
						var _empno = _match[1];
						var _h = '<span class="dwp-user onlyname" style="vertical-align:bottom;" data-empno="' + _empno + '">';
						_h += '<img src="' + $fn.getPath('weblib')+ '/images/common/icon-person-o.svg" style="width:18px;"/>';
						_h += '</span>';
						data = data.replace("@" + _empno + "@", _h);
						_match = _regExp.exec(_data);
					}
					*/
					if (opt.hideimg) {
						data = data.replace(/<img([^>]*)(src=[\"']?[^>\"']+[\"']?)([^>]*)>/gi, "<img$1o$2$3>");
					}

					if (opt.ismobile) {
						var _pattern = /<a[^>]*(href)=([\"']?[^>\"']+[\"']?)[^>]*>/gi
							, _tdata = data
							, _match = _pattern.exec(_tdata);
						while (_match != null) {
							//내부시스템 링크 삭제처리, 외부참조링크 새창으로 열기
							/*
							if ( _exlist.indexOf(_match[2]) > -1 ) {
								data = data.replace(_match[1], "rhref");
							} else
							*/
							
							/* //2022-02-17 모바일 알림메일 링크부분 수정으로 주석처리
							if ((_match[2].indexOf("http://") > -1 || _match[2].indexOf("https://") > -1) && _match[2].indexOf(dwpmo.info.domain) == -1 && _match[2] != "#") {
								var link = " onclick=\"window.open('" + _match[2].replace(/\"/g, "").replace(/'/g, "") + "', '_system')\" ";
								data = data.replace(_match[2], "\"#\"" + link);
							}
							*/
							var _host =  $dwp.core.getSysinfo().host;
							var _link = "";
							if ((_match[2].indexOf("http://") > -1 || _match[2].indexOf("https://") > -1) && _match[2].indexOf(_host) == -1 && _match[2] != "#") {
							   // 외부사이트인 경우
							   _link = " onclick=\"(function(e){e.preventDefault();window.open('" + _match[2].replace(/\"/g, "").replace(/'/g, "") + "', '_system');}(event))\" ";
							   data = data.replace(_match[2], "\"#\"" + _link);                        
							} else {
							   // 내부사이트인 경우
							   if (_match[2].indexOf("/dwp/aprv") > -1) {
								  _link = " onclick=\"(function(e){e.preventDefault();$fn.openMAprv('" + _match[2].replace(/\"/g, "").replace(/'/g, "") + "');}(event))\" ";
								  data = data.replace(_match[2], "\"#\"" + _link);
							   } else {
								  _link = " onclick=\"(function(e){e.preventDefault();$dwp.core.mportal.WinPopEx('" + _match[2].replace(/\"/g, "").replace(/'/g, "") + "');}(event))\" ";
								  data = data.replace(_match[2], "\"#\"" + _link);
							   }
							}
							_match = _pattern.exec(_tdata);
						}
					}

					try {
						$(target).html(data);
					} catch (e) {

					}
					/*
					$("span.dwp-user", target).off("click").on("click", function(){
						$dwp.ui.bizcard.init($(this), {comcode: "H0000", isrealno: true, ismobile: opt.ismobile});
					});
					*/
					_me._deleteAtt(target);

					//Table 정렬처리( table 속성에 align="center"가 설정되어 있는 경우) - 2020-08-04
					//_me._setTableCenterFix(target);

					if (opt.ismobile) {
						// 2020-08-03 By LHJ Remove 이미지 변환처리 제외
						// _me._imgerror(target);
					} else {
						// 2020-06-25 By LHJ 원본 이미지 보여주기
						if (doc.options.showfullimg) {
							_me._loadingImg(target, function () {
								var _fotodata = $("img[src]", $(target)).map(function () {
									$(this).css("cursor", "pointer");
									return { img: $(this).attr("src") }
								}).get();
								if (_fotodata.length > 0) {
									var _$foto = $("#fotorama", doc.element);
									if (_$foto.size() == 0) {
										_$foto = $('<div class="fotorama fotorama--hidden" id="fotorama" data-allow-full-screen="true" data-allowfullscreen="native" data-fit="none" data-nav="thumbs" data-allow-full-screen="native"></div>').appendTo(doc.element);
									}
									var _foto = _$foto.fotorama().data('fotorama');
									if (typeof _foto != "undefined") {
										_foto.load(_fotodata);
										$("img[src]", $(target)).off("click.img").on("click.img", function () {
											var _src = $(this).attr("src");
											var _index = 0;
											$.each(_fotodata, function (idx, o) {
												if (o.img == _src) { _index = idx; return false; }
											});
											_foto.requestFullScreen().show({ index: _index, time: 0 });
										});
									}
								}
							});
						}
					}

					if (typeof opt.callback == "function") {
						opt.callback(doc);
					}

					$(target).css({ 'display': 'block' });
				})
		}
		//Table 정렬처리( table 속성에 align="center"가 설정되어 있는 경우) - 2020-08-04
		, _setTableCenterFix: function (obj) {
			$(obj).find("table[align=center]").each(function () {
				$(this).css("margin-left", "auto");
				$(this).css("margin-right", "auto");
			});
		}
		, setDocBody: function (target, opt, instance) {
			var _me = this, _opt = $.extend({ cdb: "", unid: "", bodyurl: "", isnew: false }, opt)
			_url = $dwp.core.util.getProxyUrl(((_opt.bodyurl != "") ? _opt.bodyurl : _opt.cdb + "/0/" + _opt.unid + "/Body?OpenField"));

			var _sysinfo = $dwp.core.getSysinfo();
			var _xmdnsvr = _sysinfo.hasOwnProperty("mdnserverhost") ? _sysinfo.mdnserverhost : "";

			if (_opt.isnew) {
				var _now = new Date(), _tbody, _insdata = "";

				if (typeof _opt.bodydata == "function") {
					var _insdata = _opt.bodydata(instance);
					if (_insdata != "") {
						_insdata = _insdata.replace(/<style\sname="dwp_css"/gi, "<ostyle name=\"dwp_css\"");
						_insdata = _insdata.replace(/\?OpenElement/gi, "?OpenElement&_=" + _now.getTime()).replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, "");
						_insdata = _insdata.replace(/<ostyle\sname="dwp_css"/gi, "<style name=\"dwp_css\"");

						try {
							//$(target).html(data);
							$(target).get(0).innerHTML = _insdata;
						} catch (e) {
							$(target).html(_insdata);
						}
						_me._deleteAtt(target);

						var _xmdn = $("img[name=XMDN][src]", target);
						if (_xmdn.size() > 0) {
							if (_xmdnsvr != "" && _xmdn.attr("src").indexOf(_xmdnsvr) > -1) {
								_xmdn.remove();
							}
						}

						_me.setHtmlValue($(target).html(), instance.element, _opt.callback);
					}
				}
			} else {
				$dwp.core.util.xAjax({
					cache: false
					, async: true
					, dataType: "html"
					, url: _url
				})
					.done(function (data) {
						var _now = new Date(), _tbody, _insdata = "";

						if (typeof _opt.bodydata == "function") {
							var _insdata = _opt.bodydata(instance);

							if (_insdata != "") {
								var regExp = /([\s\S]*?)<\/body>/gi;
								if (regExp.test(_insdata)) {
									data = RegExp.$1 + data + "</body></html>";
								}
							}
						}

						data = data.replace(/<style\sname="dwp_css"/gi, "<ostyle name=\"dwp_css\"");
						data = data.replace(/\?OpenElement/gi, "?OpenElement&_=" + _now.getTime()).replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, "");
						data = data.replace(/<ostyle\sname="dwp_css"/gi, "<style name=\"dwp_css\"");
						data = data.replace(/<div\sid="attachments">/gi, "<div>");

						if (instance.options.ismobile) {
							var _pattern = /<a[^>]*(href)=([\"']?[^>\"']+[\"']?)[^>]*>/gi
								, _tdata = data
								, _match = _pattern.exec(_tdata);
							while (_match != null) {
								//내부시스템 링크 삭제처리, 외부참조링크 새창으로 열기
								/*
								if ( _exlist.indexOf(_match[2]) > -1 ) {
									data = data.replace(_match[1], "rhref");
								} else
								*/
								if ((_match[2].indexOf("http://") > -1 || _match[2].indexOf("https://") > -1) && _match[2].indexOf(dwpmo.info.domain) == -1 && _match[2] != "#") {
									var link = " onclick=\"window.open('" + _match[2].replace(/\"/g, "").replace(/'/g, "") + "', '_system')\" ";
									data = data.replace(_match[2], "\"#\"" + link);
								}
								_match = _pattern.exec(_tdata);
							}
						}

						var _reg1 = /<head[^>]*?>([\s\S]*?)<\/head>/gi;
						var _reg2 = /<body[^>]*?>([\s\S]*?)<\/body>/gi;

						var _hdata = "", _bdata = "";
						if (_reg1.test(data)) { _hdata = RegExp.$1; }
						if (_reg2.test(data)) { _bdata = RegExp.$1; }

						try {
							if (_bdata != "") {
								$(target).get(0).innerHTML = _bdata;
							} else {
								$(target).get(0).innerHTML = data;
							}
						} catch (e) {
							if (_bdata != "") {
								$(target).html(_bdata);
							} else {
								$(target).html(data);
							}
						}
						/*
						try {
							//$(target).html(data);
							//console.log("d",data);
							$(target).get(0).innerHTML = data;
						} catch(e){
							$(target).html(data);
						}
						*/
						_me._deleteAtt(target);

						var _xmdn = $("img[name=XMDN][src]", target);
						if (_xmdn.size() > 0) {
							if (_xmdnsvr != "" && _xmdn.attr("src").indexOf(_xmdnsvr) > -1) {
								_xmdn.remove();
							}
						}

						if (_bdata != "") {
							var _html = "<html><head>" + _hdata + "</head><body>" + $(target).html() + "</body></html>";
							_me.setHtmlValue(_html, instance.element, _opt.callback);
						} else {
							_me.setHtmlValue($(target).html(), instance.element, _opt.callback);
						}
						//_me.setHtmlValue(data, instance.element, _opt.callback);

						//2020-08-03 By LHJ Remove 이미지 변환처리 제외
						//if(opt.ismobile) {
						//	_me._imgerror(target);
						//}

					});
			}
		}
		, _deleteAtt: function (obj) {
			var _me = this;
			//console.log("b", obj)
			$(obj).find("table").each(function () {
				if ($(this).attr("cellspacing") == "2" && $(this).attr("cellpadding") == "4") {
					if (_me._deleteAttImgChk(this)) {
						$(this).remove();
					}
				}
			});
		}
		, _deleteAttImgChk: function (obj) {
			var chkflg = false;
			$(obj).find("img").each(function () {
				console.log("a", $(this).attr("src"));
				if ($(this).is("[src]")) {
					if ($(this).attr("src").indexOf("mehtml.gif") > -1 || $(this).attr("src").indexOf("medoc.gif") > -1 || $(this).attr("src").indexOf("memovie.gif") > -1) {
						chkflg = true;
						return;
					}
				} else if ($(this).is("[osrc]")) {
					if ($(this).attr("osrc").indexOf("mehtml.gif") > -1 || $(this).attr("osrc").indexOf("medoc.gif") > -1 || $(this).attr("osrc").indexOf("memovie.gif") > -1) {
						chkflg = true;
						return;
					}
				}
			});

			return chkflg;
		}
		, _imgerror: function (obj) {
			$("img", $(obj)).each(function () {
				if ($(this).is("[src]")) {
					if ($(this).attr('src').indexOf('&im=') > -1) {
						$(this).off("error.img").on("error.img", function () {
							if ($(this).attr('src').indexOf('&im=') > -1) {
								var _rsrc = dwpmo.info.protocol + dwpmo.info.domain + $(this).attr('src').substring($(this).attr('src').indexOf('&im=') + 4);
								$(this).attr("src", _rsrc);
							} else {
								$(this).off("error.img");
							}
						});
					}
				}
			});
		}
	};

}($dwp.cns("ui"), jQuery));



















