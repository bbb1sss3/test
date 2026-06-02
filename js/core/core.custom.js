
/**
 * <b>Custom 라이브러리</b>
 * <br>사용자정의 Widget를 정의합니다.
 * @module core/custom
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.custom|core.custom}
 */
(function (/** @lends	module:core~$dwp.core */_$$, $) {
	/**
	 * Custom Widget 모듈
	 * @namespace
	 */
	_$$.custom = {
		_MODULE_NM: "dwp.custom"
		, init: function (opt, el) {
			var _$el = null
				, _opt = $.extend({}, this._default, opt)
				, _topt = { type: "", selector: "" };

			if (_opt.ispreview) { _topt.type = "preview" }
			else if (_opt.hasOwnProperty("did") && _opt.did != "") { _topt.type = "did"; _topt.selector = "#" + _opt.did; }
			else if (_opt.ismobile) {
				_topt.type = "mobile";
				_topt.layer = (_opt.layer ? _opt.layer : "view");
			};
			_$el = el || $dwp.core.getTarget(_topt);

			if (typeof $.fn.custom == "undefined") {
				this._create();
			}
			_$el.custom(_opt);

			return _$el.custom("instance");
		}
		, _create: function () {
			var _me = this;
			$.widget(_me._MODULE_NM, {
				options: {
					cdb: ""
					, pathinfo: ""
					, isadmin: false
					, isconowner: false
					, ismcreate: false
					, issearch: false
					, issort: false
					, ismobile: false
					, issliderresize: true
					, ispagemore: true
				}
				, _create: function () {
					console.log("dwp.custom Create")
				}
				, _init: function () {
					var _me = this;
					if (_me.options.ismobile) {
						var _$pagetitle = $("div.dwp-list-header .dwp-page-title", _me.element);
						if (_$pagetitle.size() > 0) {
							if (_$pagetitle.is("[data-xlang-code]")) {
								var _titlecd = _$pagetitle.attr("data-xlang-code");
								$(".dwp-header-m .dwp-page-title", _me.element.parents("div.dwp-mobile-area")).html($fn.getCodeMsg(_titlecd));
							}
							if (_$pagetitle.is("[data-xlang-txt]")) {
								var _title = _$pagetitle.attr("data-xlang-txt");
								$(".dwp-header-m .dwp-page-title", _me.element.parents("div.dwp-mobile-area")).html($fn.getCurLangMsg(_title));
							}
						}
						//_me.mSearchToggle();
						_me._btnMProc();
						_me.mCreateBtnToggle();
						_me.mSortProc();
					}
				}
				, _mSliderResize: function () {
					var _me = this;
					if (!_me.options.issliderresize) return;
					var _$slider = _me.element.parents("div[aria-live='polite']");
					if (_$slider.size() > 0) {
					} else {
						_$slider = $("div[aria-live='polite']", _me.element);
					}
					if (_$slider.size() > 0) {
						var _$mo = _me.element.parents("div.dwp-mobile-area");
						var _h = $dwp.core.util.getScreenInfo().h - $("div.dwp-header-m", _$mo).height();
						var _lh = _me.element.height();

						if ($("div.dwp-2depth-nav", _$mo).size() > 0) { _h = _h - $("div.dwp-2depth-nav", _$mo).height(); }
						if ($("div.dwp-3depth-nav.active", _$mo).size() > 0) { _h = _h - $("div.dwp-3depth-nav.active", _$mo).height(); }

						_me.element.siblings("div").each(function () {
							_lh = _lh + $(this).height();
						});

						_$slider.height(_lh > _h ? _lh : _h);
					}
				}
				, _vprSliderResize: function (height) {
					var _me = this;
					_$slider = $("div[aria-live='polite']", _me.element);
					if (_$slider.size() > 0) {
						var _$mo = _me.element.parents("div.dwp-mobile-area");
						var _h = $dwp.core.util.getScreenInfo().h - $("div.dwp-header-m", _$mo).height();
						if ($("div.dwp-2depth-nav", _$mo).size() > 0) { _h = _h - $("div.dwp-2depth-nav", _$mo).height(); }
						if ($("div.dwp-3depth-nav.active", _$mo).size() > 0) { _h = _h - $("div.dwp-3depth-nav.active", _$mo).height(); }
						_$slider.height(height > _h ? height : _h);
					}
				}
				, mSearchToggle: function () {
					var _me = this
						, _$search = $("div.search-trigger", _me.element.parents("div.dwp-mobile-area"))
						, _$sinp = $("input[name='search']", _$search);

					_$search.show();
					if (!_me.options.issearch) {
						_$search.hide(); return;
					}
					// 초기화
					if (_me.options.searchview) {
						$(".search-form-m", _$search).addClass("active");
						_$sinp.val(_me.options.searchqry.replace("(", "").replace(")", ""));
					} else {
						$(".search-form-m", _$search).removeClass("active");
						_$sinp.val("");
					}
				}
				, _btnMProc: function () {
					// 임시로 임직원 조회 시인 경우, 추가된 아이콘만 삭제함.
					var _me = this
						, _$btngrp = $("div.header-btn-group", _me.element.parents("div.dwp-mobile-area"));

					if (_$btngrp.size() > 0) _$btngrp.remove();
				}
				, mCreateBtnToggle: function () {
					var _me = this
						, _$btn = $("div.dwp-footer-m a.btn-write-m", _me.element.parents("div.dwp-mobile-area"));

					if (_me.options.ismcreate) {
						_$btn.show();
					} else {
						_$btn.hide();
					}
				}
				, mSortProc: function () {
					console.log("mSortProc")
					var _me = this
						, _$wrap = $(".dwp-header-m div.inner-m", _me.element.parents("div.dwp-mobile-area"))
						, _$sort = $("div.view-trigger", _$wrap);

					_$sort.hide();
				}
				, mSearchAction: function () {
					console.log("mSearchAction")
					var _me = this
						, _$search = $("div.search-trigger", _me.element.parents("div.dwp-mobile-area"))
						, _$sinp = $("input[name='search']", _$search);

					if (typeof _me.options.searchaction == "function") {
						_me.options.searchaction(_$sinp.val(), _me);
					}
				}
				, pageMore: function () {
					var _me = this;
					if (typeof _me.options.pagemore == "function") {
						_me.options.pagemore(_me);
					}
				}
				// TimeLine Reply Save
				, reply_save: function (o, p) {
					var _me = this
						, _p = $.extend({ _par_unid: "", _par_authorname: "", _key_unid: "", _doc_sort: "", _doc_level: 0 }, p)
						, _actiontype = 'save_rep'
						//,_root_unid = _p.root_unid
						, _$reply_body = $("textarea[name='reply_body']", $(o).parent())
						, _reply_body = _$reply_body.val();

					$fn.cmdPost(
						$dwp.core.util.getProxyUrl(_p.cdb + '/wlogpost?createdocument')
						, {
							actiontype: $dwp.core.doc._CONST.ACTION.SAVE_REP
							, root_unid: _p._root_unid
							, par_unid: _p._par_unid
							, key_unid: _p._key_unid
							//, doc_sort : p._doc_sort
							, doc_level: _p._doc_level
							, reply_body: _reply_body
							, par_authorname: _p._par_authorname
							//, pardb_path : _me.options.cdb
						}
						, function (data) {
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									//$dwp.ui.alert({msg : $fn.getCodeMsg("comm.msg.msg025")})
									var _done = function () {
										_$reply_body.val("");
										if (_p._key_unid == "") {
											var _pinfo = $fn.getCurUser().pinfo;
											var _date = new Date();
											_p._isreplydoc = "true";
											_p._created = _date.toISOString();
											_p._orgcode = _pinfo.orgcode;
											_p._authorempno = _pinfo.empno;
											_p._authorname = _pinfo.name;
											_p._authorgradename = _pinfo.posname;
											_p._orgname = _pinfo.orgname;
											_p._key_unid = data.key_unid;
											_p._empno = _pinfo.empno;
											_p._author = _pinfo.name;
											_p._dept = _pinfo.orgname;
											_p._grade = _pinfo.posname;
											_p._reply_body = _reply_body;
											var _$target = $('<div class="item"><div class="dwp-comment-area"><div data-cell="status_reply_list" class="comment-list"></div></div></div>').insertAfter($(o).parents("div.item"));
											_me.reply_add_list($("div.comment-list", _$target), _p);

											if (_p._doc_level > 1) {
												$("div.act_cancel", o).hide();
												$("div.act_reply", o).show();
												$("div.comment-write-form", o).remove();
											} else {
												$("span[name=btn_reply_hidden]", o).addClass("hidden");
												$("span[name=btn_reply_show]", o).removeClass("hidden");

												$("textarea[name='reply_body']", o).val("");
												$("div.comment-write-form", o).addClass("hidden");
											}
										} else {
											_p._reply_body = _reply_body;
											_me.reply_edit_list(o, _p);
										}
									};

									$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg025") });
									_done();
								} else {
									//error
									//$.unblockUI();
									$dwp.ui.alert({ msg: _$$.lang.getCurMsg(data.msgcode) });
								}
							} else {
								//error
								//$.unblockUI();
							}
						}
						, 'json'
					)
				}
				// 댓글 리스트 처리 & Add
				, reply_add_list: function (_$cell, o) {
					var _me = this
						, _$listwrap = $("<div class='comment-item'/>").appendTo(_$cell)
						, _$listhead = $("<div class='comment-head'/>").appendTo(_$listwrap)
						, _$listbody = $("<div class='comment-body'/>").appendTo(_$listwrap)
						, _h = "", _mstyle1 = "", _mstyle2 = "", _mstyle3 = "", _mstyle4 = "";

					o.cdb = _me.options.cdb;

					if (_me.options.ismobile) {
						_mstyle1 = 'margin-top:10px;padding:0px;border:0px';
						_mstyle2 = 'height:40px;';
						_mstyle3 = 'width:60px;padding-left:0px';
						_mstyle4 = 'display:inline-block;height:40px;padding:8px 0px;border-left:0px';
					}

					function _replyform() {
						var _h = '<div class="comment-write-form reply-base-write" style="' + _mstyle1 + '"> ';
						_h += '   <div class="dwp-comment dwp-grouping">';
						_h += '       <div class="dwp-comment-form">';
						_h += '           <textarea cols="30" rows="5" placeholder="" name="reply_body" style="' + _mstyle2 + '"></textarea>';
						_h += '       </div>';
						_h += '       <div class="dwp-comment-btn" style="' + _mstyle3 + '">';
						_h += '           <div class="dwp-button" name="btn_reply_save"><span style="' + _mstyle4 + '">' + $fn.getCodeMsg('comm.btn.reg') + '</span></div>';
						_h += '       </div>';
						_h += '   </div>';
						_h += '</div></div>';
						return $(_h);
					}

					function _convertData(nm, o) {
						var _h = "", _v = o[nm];
						if (nm == "_created") {
							_h = $dwp.core.util.toLocalDate(_v);
						} else if (nm == "_reply_body") {
							_h = ((o._doc_level > 1) ? "<span class='name-tag'>" + $dwp.core.lang.getCurMsg(o._par_authorname) + "</span>" : "") + _v.replace(/\n/g, "<br>");
						} else {
							_h = $dwp.core.lang.getCurMsg(_v);
						}
						return _h;
					}

					_$listwrap.data($dwp.core.doc._REPLY_DATA, o);

					if (o._par_unid != "") {
						_$listwrap.addClass("low-depth");
					}

					//if ( _me.options.ismobile ) {
					_h = "<div class='dwp-user' data-type='profile' data-empno='" + o._empno + "' data-orgcode='" + o._orgcode + "'>";
					_h += "<div class='profile'><img src='" + $dwp.core.getPath("pic", { empno: o._empno }) + "'></div>";
					_h += "<div class='profile-info'>";
					_h += "<div class='name'>" + _convertData("_author", o) + "</div>";
					//_h += "<div class='rank'>" + _convertData("_grade", o) + "</div>";
					_h += "<div class='team'>" + _convertData("_dept", o) + "</div>";
					_h += "<div class='date' style='display:block;margin-top:2px;padding-left:0px;'>" + _convertData("_created", o) + "</div>";
					_h += "</div></div>";

					_$listhead.append(_h);

					_$listbody.html(_convertData("_reply_body", o));

					_h = "<div class='aligner' data-type='table' data-align='middle' data-top='xs'>";
					_h += "<div class='left'>";
					_h += "<div class='dwp-btn sm act_reply'><span>" + $fn.getCodeMsg("comm.title.reply") + "</span></div>";
					_h += "<div class='dwp-btn sm act_cancel' style='display:none;'><span>" + $fn.getCodeMsg("comm.btn.cancel") + "</span></div>";
					_h += "</div>";
					_h += "<div class='right comment-option-btn'>";

					//권한체크
					if ((o._empno == $dwp.core.getCurUser().pinfo.empno) || (_me.options.isadmin || _me.options.isconowner || _me.options.isowner)) {
						_h += "<a name='act_edit'><img src='" + $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg' title='" + $fn.getCodeMsg("comm.btn.edit") + "'></a>";
					}
					if ((o._empno == $dwp.core.getCurUser().pinfo.empno) || (_me.options.isadmin || _me.options.isconowner || _me.options.isowner)) {
						_h += "<a name='act_del'><img src='" + $fn.getPath("weblib") + "/images/common/icon-remove.svg' title='" + $fn.getCodeMsg("comm.btn.deldoc") + "'></a>";
					}
					_h += "</div></div>";

					_$listwrap.append(_h);
					/*
				} else {
					_h = "<div class='aligner' data-type='table' data-align='middle'>";
					_h += "<div class='left'>";
					_h += "<div class='dwp-user' data-type='profile' data-empno='" + o._empno + "' data-orgcode='" + o._orgcode + "'>";
					_h += "<div class='profile'><img src='" + $dwp.core.getPath("pic", {empno : o._empno}) + "'></div>";
					_h += "<div class='profile-info'>";
					_h += "<div class='name'>" + _convertData("_author", o) + "</div>";
					//_h += "<div class='rank'>" + _convertData("_grade", o) + "</div>";
					_h += "<div class='team'>" + _convertData("_dept", o) + "</div>";
					_h += "</div></div>";
					_h += "<div class='dwp-user-util'>";
					_h += "<div class='date'>" + _convertData("_created", o) + "</div>";
					_h += "<div class='option act_reply'><a>" + $fn.getCodeMsg("comm.title.reply") + "</a></div>";
					_h += "<div class='option act_cancel' style='display:none;'><a class='point-color'>" + $fn.getCodeMsg("comm.btn.cancel") + "</a></div>";
					_h += "</div></div>";
					_h += "<div class='right comment-option-btn'>";

					//권한체크
					if ( (o._empno == $dwp.core.getCurUser().pinfo.empno ) || (_me.options.isadmin || _me.options.isconowner || _me.options.isowner) ) {
						_h += "<a name='act_edit'><img src='" + $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg' title='" + $fn.getCodeMsg("comm.btn.edit") + "'></a>";
					}
					if ( (o._empno == $dwp.core.getCurUser().pinfo.empno ) || (_me.options.isadmin || _me.options.isconowner || _me.options.isowner) ) {
						_h += "<a name='act_del'><img src='" + $fn.getPath("weblib") + "/images/common/icon-remove.svg' title='" + $fn.getCodeMsg("comm.btn.deldoc") + "'></a>";
					}
					_h += "</div></div></div>";

					_$listhead.append(_h);

					_$listbody.html(_convertData("_reply_body", o));
				}
					*/
					//Event 처리
					$fn.getPicError($("div.dwp-user img", _$listhead));

					$("div.dwp-user", _$listhead).off("click").on("click", function () {
						$dwp.ui.bizcard.init($(this), { ismobile: false });
					});

					// 댓글 달기
					$("div.act_reply", _$listwrap).on("click", function () {
						var _$replyform = _replyform();
						if (_me.options.ismobile) {
							_$replyform.appendTo(_$listwrap).removeClass("reply-base-write");
						} else {
							$("div.dwp-comment", _$replyform).prepend("<div class='user-profile'><a href='#'><img src='" + $dwp.core.getPath("pic", { empno: $dwp.core.getCurUser().pinfo.empno }) + "' width='30px' height='30px;'></a></div>");
							_$replyform.insertAfter(_$listwrap).removeClass("reply-base-write");
						}

						if (o._doc_level > 0) {
							$("textarea[name='reply_body']", _$replyform).attr("placeholder", $dwp.core.lang.getCurMsg(o._author) + $fn.getCodeMsg("comm.title.replycmt"));
						}
						$("textarea[name='reply_body']", _$replyform).val("");
						_$replyform.data($dwp.core.doc._REPLY_DATA, o);

						$("div.act_cancel", _$listwrap).show();
						$(this).hide();

						$fn.getPicError($("div.user-profile img", $("div.dwp-comment", _$replyform)));

						// 댓글등록처리
						$("div[name=btn_reply_save]", _$replyform).off("click").on("click", function () {
							console.log("btton =  save   ", this);
							var _$reply_body = $("textarea[name='reply_body']", _$replyform);
							if (_$reply_body.val() == "") {
								$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg024") })
									.done(function () {
										_$reply_body.focus();
									});
								return;
							}

							var _o = $.extend({}, o);
							_o._par_unid = _o._key_unid;
							_o._par_authorname = _o._authorname;
							_o._key_unid = "";
							_o._doc_level = parseInt(_o._doc_level, 10) + 1;

							_me.reply_save(_$cell, _o);
						});
					});

					// 댓글편집
					$("a[name='act_edit']", _$listwrap).on("click", function () {
						//권한체크
						if ($("div.act_reply", _$listwrap).is(":hidden")) {
							//_$listwrap.next("div.comment-write-form").remove();
							$("div.comment-write-form", _$listwrap.parent()).remove();
						}

						var _$replyform = _replyform();
						if (_me.options.ismobile) {
							_$replyform.appendTo(_$listwrap).addClass("reply-edit").removeClass("reply-base-write");
						} else {
							_$replyform.insertAfter(_$listwrap).addClass("reply-edit").removeClass("reply-base-write");
						}
						_$replyform.data($dwp.core.doc._REPLY_DATA, o);
						_$listbody.hide();
						$("textarea[name='reply_body']", _$replyform).val(o._reply_body);
						$("div.act_reply", _$listwrap).hide();
						$("div.act_cancel", _$listwrap).show();

						// 댓글등록처리
						$("div[name=btn_reply_save]", _$replyform).off("click").on("click", function () {
							console.log("btton =  save   ", this);
							var _$reply_body = $("textarea[name='reply_body']", _$replyform);
							if (_$reply_body.val() == "") {
								$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg024") })
									.done(function () {
										_$reply_body.focus();
									});
								return;
							}

							var _o = $.extend({}, o);
							_me.reply_save(_$cell, _o);
						});
					});
					// 댓글편집취소
					$("div.act_cancel", _$listwrap).on("click", function () {
						var _$replyform = $("div.comment-write-form", _$listwrap.parent());
						if (_$replyform.hasClass("reply-edit")) {
							_$listbody.show();
						}
						_$replyform.remove();

						$("div.act_reply", _$listwrap).show();
						$(this).hide();
					});
					// 댓글삭제처리
					$("a[name='act_del']", _$listwrap).on("click", function () {
						var _o = $.extend({}, o);
						_me.reply_del(_$cell, _o);
					});
				}
				, reply_edit_list: function (_$cell, o) {
					var _me = this
						, _$listwrap = $("div.comment-item", _$cell)
						, _$listhead = $("div.comment-head", _$listwrap)
						, _$listbody = $("div.comment-body", _$listwrap)
						, _$replyform = $("div.comment-write-form", _$listwrap.parent());
					//, $replyform = _$listwrap.next("div.comment-write-form");

					function _convertData(nm, o) {
						var _h = "", _v = o[nm];
						if (nm == "_created") {
							_h = $dwp.core.util.toLocalDate(_v);
						} else if (nm == "_reply_body") {
							_h = ((o._doc_level > 1) ? "<span class='name-tag'>" + $dwp.core.lang.getCurMsg(o._par_authorname) + "</span>" : "") + _v.replace(/\n/g, "<br>");
						} else {
							_h = $dwp.core.lang.getCurMsg(_v);
						}
						return _h;
					}

					if (_$replyform.hasClass("reply-edit")) {
						_$listbody.html(_convertData("_reply_body", o));
						_$listbody.show();
					}
					//_$listwrap.next("div.comment-write-form").remove();
					_$replyform.remove();
					$("div.act_reply", _$listwrap).show();
					$("div.act_cancel", _$listwrap).hide();
				}
				, reply_del: function (o, p) {
					var _me = this
						, _p = $.extend({ _key_unid: "", _is_admin: (_me.options.isadmin || _me.options.isconowner || _me.options.isowner) }, p);

					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_p.cdb + '/wlogpost?createdocument')
						, {
							actiontype: (_p._is_admin ? $dwp.core.doc._CONST.ACTION.DEL_SYSREP : $dwp.core.doc._CONST.ACTION.DEL_REP)
							, root_unid: _p._root_unid
							, key_unid: _p._key_unid
							, pardb_path: _p.cdb
						}
						, function (data) {
							// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {

									//$dwp.ui.alert({msg : $fn.getCodeMsg("comm.msg.msg026")})
									var _done = function () {
										//_me._replyProc();
										$(o).parents("div.item").remove();
									};
									$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg026") });
									_done();
								} else {
									//error
									$dwp.ui.alert({ msg: _$$.lang.getCurMsg(data.msgcode) });
								}
							} else {
								//error
							}
						}
						, 'json'
					)

				}
				// vpr TimeLine View Search 처리함수
				, vprTimeLineSearch: function (opt) {
					var _me = this
						, _opt = $.extend({ qry: "" }, opt)
						, _viewlist = _me.options.select.view_list
						, _view = $(_viewlist).parent().view("instance");

					_view.options.page = 1;
					_view.options.searchqry = _opt.qry;
					_view.options.searchview = true;

					if (!_me.options.ismobile) {
						$(_viewlist).mCustomScrollbar("destroy");
					}

					_view.resort("_created", "descending");

					//_view._listProc();
				}
				, vprTimeLineReload: function () {
					var _me = this
						, _viewlist = _me.options.select.view_list
						, _view = $(_viewlist).parent().view("instance");

					_view.options.page = 1;
					_view.options.searchqry = "";
					_view.options.searchview = false;

					if (!_me.options.ismobile) {
						$(_viewlist).mCustomScrollbar("destroy");
					}

					_view._listProc();
				}
				// vpr TimeLine View Search 처리함수
				, vprTimeLine: function (opt) {
					console.log("TimeLine Start");
					var _me = this
						, _opt = $.extend({}, opt)
						, _viewlist = _me.options.select.view_list
						, _seq1 = "▩@▩", _seq2 = "#@#"
						, _vopt = {
							cdb: _me.options.cdb
							, sublogdb: ""
							, viewtype: "custom"
							, pathinfo: ""
							, jtl: $fn.getPath("weblib") + (_me.options.ismobile ? "/jtl/app/mo/vpr.main.list.jtl" : "/jtl/app/vpr.main.list.jtl")
							, viewalias: "wv_stupdate"
							, issort: false
							, iscategory: false
							, ismobile: _me.options.ismobile
							, ismcreate: false
							, formview: ""
							, navitype: ""
							, selector: _viewlist
							//,layer : "home"
							, page: 1
							, ps: 10
							, loadComplete: function (event, view) {
								if (typeof _opt.callback == "function") {
									$("div.timeline-desc", view.element).height('auto');
									setTimeout(function () {
										_opt.callback(_viewlist, view);
									}, 500);
								}
							}
						};
					console.log("TimeLine Start  ### ", _me.options.select.view_list);
					_vopt.header = {
						sortnm: ""
						, sortorder: ""
						, checkbox: false
						, isnew: { basedate: '_created' }
						, isreply: false
						//,colnm : ['created', 'summary', 'author', 'photo', 'attach', 'bookmark']
						, colnm: ['created', 'summary', 'author', 'photo', 'attach', 'bookmark', 'status_reply_form', 'status_reply_list']
						, callback: function (_$row, o) {
							//이미지 에러 처리
							$fn.getPicError($("div.dwp-user img", _$row));

							//편집 처리
							var _isedit = _me.options.isadmin || _me.options.isowner || (o._authorempno == $fn.getCurUser().pinfo.empno);

							if (_isedit) {
								$("span[name=vpr-modify]", _$row).off("click").on("click", function () {
									$(this).hide();
									$("span[name=vpr-del]", _$row).hide();
									$("span[name=vpr-save]", _$row).show();
									$("span[name=vpr-cancel]", _$row).show();

									var _$summary = $("div[data-cell=summary]", _$row);
									_$summary.hide();

									var _$txtarea = $("div.dwp-textarea", _$row);
									if (_$txtarea.size() == 0) {
										var _h = "<div class='dwp-textarea' style='margin-bottom:5px;'>";
										_h += "<textarea cols='30'></textarea>";
										_h += "</div>";
										_$txtarea = $(_h).prependTo($("div.timeline-desc", _$row));
									}
									var _summary = _$summary.html().replace(/<br>/gi, "\n");
									$("textarea", _$txtarea).val(_summary);
									_$txtarea.show();
								});
								//삭제 처리
								$("span[name=vpr-del]", _$row).off("click").on("click", function () {
									$fn.confirm({ msg: $fn.getCodeMsg("vprj.msg.deldocconfirm") }).done(function () {
										$dwp.app.vprj.sub_main.sm_btn_act.post_delect_doc({
											unid: o["@unid"]
											, callback: function () {
												$(_viewlist).parent().view("instance").reload();
												//_$row.remove();
											}
										});
									})
								});
								//저장 처리
								$("span[name=vpr-save]", _$row).off("click").on("click", function () {
									$(this).hide();
									$("span[name=vpr-cancel]", _$row).hide();
									$("span[name=vpr-del]", _$row).show();
									$("span[name=vpr-modify]", _$row).show();

									var _$summary = $("div[data-cell=summary]", _$row);
									var _$txtarea = $("div.dwp-textarea", _$row);
									var _txt = $("textarea", _$txtarea).val();

									// post 처리 후...
									$dwp.app.vprj.sub_main.sm_btn_act.fpost_edit_save({
										unid: o["@unid"]
										, bsummary: _txt
										, callback: function () {
											_$txtarea.hide();

											_summary = _txt.replace(/\n/gi, "<br>");
											_$summary.html(_summary).show();
										}
									})
								});
								//취소처리
								$("span[name=vpr-cancel]", _$row).off("click").on("click", function () {
									$(this).hide();
									$("span[name=vpr-save]", _$row).hide();
									$("span[name=vpr-del]", _$row).show();
									$("span[name=vpr-modify]", _$row).show();

									var _$summary = $("div[data-cell=summary]", _$row);
									var _$txtarea = $("div.dwp-textarea", _$row);

									_$txtarea.hide();
									$("textarea", _$txtarea).val("");

									_$summary.show();
								});
							} else {
								$("span[name=vpr-modify]", _$row).hide();
								$("span[name=vpr-del]", _$row).hide();
							}
						}
						, click: function (view, o) {
						}
						, col: {
							created: {
								name: '_created'
								, type: 'fnc'
								, sort: false
								, content: function (o) {
									return $dwp.core.util.formatDateTime(o._created, "relative");
								}
							}
							, summary: {
								name: '_bsummary'
								, type: "fnc"
								, sort: false
								, content: function (o) {
									return o._bsummary.replace(/&lt/gi, "<").replace(/&gt/gi, ">");
								}
							}
							, photo: {
								name: '_tag_photo'
								, type: 'fnc'
								, sort: false
								, isdirect: true
								, content: function (_$cell, o) {
									//<div class="media-item"><img src="../../images/dummy/vpr-img9.png" alt=""></div>
									if (o._tag_photo == "") return "";
									var _photolist = o._tag_photo.split(_seq1);
									$.each(_photolist, function (i, v) {
										var _olist = v.split(_seq2);
										var _h = "";

										if (_olist[1] === "img") {
											_h = '<div class="media-item">';
										} else {
											_h = '<div class="media-item dwp-play"  style="display:inline-block">';
										}

										var _dwp_play = ' class="dwp-play"  ';

										if (_me.options.ismobile) {
											var _url = _olist[2];
											if (_url.indexOf("http://") == -1 && _url.indexOf("https://") == -1) {
												_url = dwpmo.info.protocol + dwpmo.info.domain + _url;
											}

											_h += '<img src="' + _url + '" style="max-width:100%">';
										} else {
											_h += '<img src="' + _olist[2] + '" >';
										}
										_h += '</div>';

										$(_h).appendTo(_$cell)
											.on("click", function () {
												var _vdata = {};
												_vdata.mtype = _olist[1];
												_vdata.iurl = _olist[2];
												if (_olist[1] === "video" || _olist[1] === "youtube") {
													_vdata.tag = _olist[4];
													_vdata.vurl = _olist[3];
												}
												$dwp.app.vprj.sub_main.sm_btn_act.post_video_open(_vdata);
											});
									});
								}
							}
							, attach: {
								name: '_tag_files'
								, type: 'fnc'
								, sort: false
								, isdirect: true
								, content: function (_$cell, o) {
									if (o._tag_files == "") return "";
									var _filelist = o._tag_files.split(_seq1);
									$.each(_filelist, function (i, v) {
										var _olist = v.split(_seq2);
										var _isimg = false;
										var _h = '<div class="file"><div class="file-name">';
										_h += '<div class="name">';
										if (_me.options.ismobile) {
											_h += '<a>' + _olist[2] + '</a></div>'
										} else {
											_h += '<a href="' + _olist[3] + '" target="_self" ' + (_isimg ? '' : 'download') + '>' + _olist[2] + '</a></div>';
										}
										_h += '<span></span>'
										_h += '</div></div>';

										$(_h).appendTo(_$cell);
										if (_me.options.ismobile) {
											$("a", _$cell).off("click").on("click", function () {
												var _u = _olist[3].toUpperCase().split("/$FILE/");
												var __u = _u[0].split("/0/")
												var _dbpath = __u[0].substring(1);
												var _unid = __u[1];
												$dwp.core.util.callFileViewer({
													reqdata: {
														ReqApplCode: _me.options.appdb.applcode
														, ReqServer: _me.options.appdb.appdb_server
														, ReqDBPath: _dbpath
														, ReqDocUNID: _unid
														, ReqDocSubject: ""
														, ReqFilename: _olist[2]
													}
												});
											});
										}
									});
								}
							}
							, bookmark: {
								name: '_tag_bookmarks'
								, type: 'fnc'
								, sort: false
								, isdirect: true
								, content: function (_$cell, o) {
									if (o._tag_bookmarks == "") return "";
									var _booklist = o._tag_bookmarks.split(_seq1);
									$.each(_booklist, function (i, v) {
										var _olist = v.split(_seq2);
										var _h = '<div class="bookmark"><div class="bookmark-name">';
										_h += '<div class="name">' + _olist[2] + '</div>';
										_h += '</div></div>';
										$(_h).appendTo(_$cell)
											.on("click", function () {
												if (_me.options.ismobile) {
													var _url = _olist[3];
													if (_url.indexOf("http://") > -1 || _url.indexOf("https://") > -1) {
													} else {
														_url = "http://" + _url;
													}
													window.open(_url, "_system");
												} else {
													$dwp.app.vprj.sub_main.sm_btn_act.bookmark_open(_olist[3]);
												}
											})
									});
								}
							}
							, author: {
								name: '_authorname'
								, type: 'fnc'
								, content: function (o) {
									var _h = "";
									if (_me.options.ismobile) {
										_h += '<div class="profile"><img src="' + $fn.getPath("pic", { empno: o._authorempno }) + '" alt=""></div>';
										_h += '<div class="profile-info">'
										_h += '<div class="name">' + $dwp.core.lang.getCurMsg(o._authorname) + '</div>'
										_h += '</div>'
									} else {
										_h += '<div class="profile"><img src="' + $fn.getPath("pic", { empno: o._authorempno }) + '" alt=""></div>';
										_h += '<div class="profile-info">'
										_h += '<div class="name">' + $dwp.core.lang.getCurMsg(o._authorname) + '</div>'
										_h += '<div class="rank">' + $dwp.core.lang.getCurMsg(o._authorgradename) + '</div>'
										_h += '<div class="team">' + $dwp.core.lang.getCurMsg(o._orgname) + '</div>'
										_h += '</div>'
									}
									return _h;
								}
								, click: function (cell, o) {
									$(cell).attr({ "data-empno": o._authorempno, "data-orgcode": "" });
									$dwp.ui.bizcard.init($(cell), { ismobile: _me.options.ismobile });
								}
							}
							, status_reply_form: {
								name: '_root_unid'
								, type: 'fnc'
								, sort: false
								, isdirect: true
								, content: function (_$cell, o) {
									var _h = "", _mstyle1 = "", _mstyle2 = "", _mstyle3 = "", _mstyle4 = "";
									var _dom = null;
									if (_me.options.ismobile) {
										_mstyle1 = 'padding:0px;border:0px';
										_mstyle2 = 'height:40px;';
										_mstyle3 = 'width:60px;padding-left:0px';
										_mstyle4 = 'display:inline-block;height:40px;padding:8px 0px;border-left:0px';
									}
									_h += '<div><div class="dwp-btn sm option dwp-cursor">';
									_h += '     <span name="btn_reply_show" class="dwp-bold dwp-dark">' + $fn.getCodeMsg("comm.title.reply") + '</span>';
									_h += '     <span class="point-color  hidden"  name="btn_reply_hidden">' + $fn.getCodeMsg('comm.btn.cancel') + '</span> ';
									_h += '</div>';
									_h += '<div class="comment-write-form reply-base-write hidden" style="margin-top:10px;' + _mstyle1 + '"> ';
									_h += '   <div class="dwp-comment dwp-grouping">';
									_h += '       <div class="dwp-comment-form">';
									_h += '           <textarea cols="30" rows="5" placeholder="' + $fn.getCodeMsg("comm.msg.msg024") + '" name="reply_body" style="' + _mstyle2 + '"></textarea>';
									_h += '       </div>';
									_h += '       <div class="dwp-comment-btn" style="' + _mstyle3 + '">';
									_h += '           <div class="dwp-button" name="btn_reply_save"><span style="' + _mstyle4 + '">' + $fn.getCodeMsg('comm.btn.reg') + '</span></div>';
									_h += '       </div>';
									_h += '   </div>';
									_h += '</div></div>';

									_dom = $(_h);
									_dom.off("click", "span[name=btn_reply_show]").on("click", "span[name=btn_reply_show]", function () {
										$(this).addClass("hidden");
										$("span[name=btn_reply_hidden]", _dom).removeClass("hidden");
										$("div.comment-write-form", _dom).removeClass("hidden");
									});
									_dom.off("click", "span[name=btn_reply_hidden]").on("click", "span[name=btn_reply_hidden]", function () {
										$(this).addClass("hidden");
										$("span[name=btn_reply_show]", _dom).removeClass("hidden");
										$("div.comment-write-form", _dom).addClass("hidden");
										$("textarea[name=reply_body]", _dom).val("");
									});
									_dom.off("click", "div[name=btn_reply_save]").on("click", "div[name=btn_reply_save]", function () {
										var _$reply_body = $("textarea[name='reply_body']", _dom);
										if (_$reply_body.val() == "") {
											$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg024") })
												.done(function () {
													_$reply_body.focus();
												});
											return;
										}
										var _o = $.extend({ cdb: _me.options.cdb }, o);
										_o._key_unid = "";
										_o._doc_level = parseInt(_o._doc_level, 10) + 1;
										_me.reply_save(_$cell, _o);
									});
									_dom.appendTo(_$cell);
								}
							}
							, status_reply_list: {
								name: '_reply_list'
								, type: 'fnc'
								, sort: false
								, isdirect: true
								, content: function (_$cell, o) {
									_me.reply_add_list(_$cell, o);
								}
							}
							// status_reply_list
						}
					}

					var _view = $fn.view(_vopt, $(_viewlist).parent());

					if (_me.options.ismobile) {
						$dwp.core.mportal.footerEventProc(dwpmo.div["view"]);
					}

				}
				// vpr TimeLine View Search 처리함수 -end
				// Cop Main 함수 Start
				, copMainInit: function (opt) {
					var _me = this
						, _opt = $.extend({ initid: "WCOPMING", reload: false, isbwmh: false }, opt)
						, _$wrap = $("div.dwp-container-m", dwpmo.div.view)
						, _$header = $("div.nav-inner", _$wrap)
						, _$slider = $("div.visual-slider", dwpmo.div.view);

					if ($(".dwp-header-m", dwpmo.div.view).size() > 0) {
						$(".dwp-header-m", dwpmo.div.view).addClass("no-shadow");
					}

					var _gnb_data = null;
					var _htitle = "";

					function _idConvert(id) {
						return id.replace("WCOP", "").toLowerCase();
					}

					// Main List 정보가져오기
					function _setMainData(id, callback) {
						var _id = _idConvert(id);
						var _$item = $("div.slide[name=" + _id + "]", _$slider);
						_$item.empty();
						//console.log("id", id)
						var _data = {};
						if (_id == "ming") {
							_data.empno = $fn.getCurUser().pinfo.empno;
						} else if (_id == "ing") {
							_data.empno = "all"
						} else if (_id == "visit") {
							_data.empno = $fn.getCurUser().pinfo.empno;
							_data.coptype = "visit";
						}
						$dwp.core.util.xAjax({
							url: $dwp.core.getPath("copmn") + "/uservpr_info_v1?openagent"
							, dataType: "json"
							, async: false
							, cache: false
							, data: _data
						}).done(function (jdata) {
							var _$list = $("<div class='dwp-list'></div>").appendTo(_$item);
							if (_id == "ming") _id = "ing";
							if (jdata.hasOwnProperty(_id)) {
								$(jdata[_id]).each(function (i, o) {
									var _h = "<div class='dwp-item'><div class='dwp-inner'>";
									_h += "<div class='thumb-area dlink'><img src='" + dwpmo.info.protocol + dwpmo.info.domain + o.img + "'></div>";
									_h += "<div class='subject-area dlink'><div class='subject'>" + $fn.getCurLangMsg(o.nm) + "</div></div>";

									if (_id == "visit") {
										_h += "<div class='offer-area'>";
										_h += "<a class='btn-join point-color'>" + $fn.getCodeMsg("comm.title.vpr_join") + "</a>";
										_h += "<a class='btn-refuse'>" + $fn.getCodeMsg("comm.title.vpr_reject") + "</a>";
										_h += "</div>";
									}
									_h += "</div></div>";

									var _$eitem = $(_h).appendTo(_$list);
									$("div.dlink", _$eitem).off("click").on("click", function () {
										var _ndata = $.extend({ lnbid: "", layer: "view" }, _gnb_data);
										_ndata.title = _htitle;
										_ndata.lnbdlink = $dwp.core.getPath("copmn") + "/lnb_appdb_menu_mo?ReadForm&appdbid={appdbid}&vzregcode={vzregcode}";
										if (_opt.isbwmh) {
											_ndata.link = "/dwp/{vzregcode}/bwap/bwcr/{appdbid}.nsf/appdb_main_mo?readForm&appdbid={appdbid}&vzregcode={vzregcode}";
										} else {
											_ndata.link = "/dwp/{vzregcode}/life/cops/{appdbid}.nsf/appdb_main_mo?readForm&appdbid={appdbid}&vzregcode={vzregcode}";
										}
										_ndata.linktype = "PAGE";
										_ndata.lnbdlink = _ndata.lnbdlink.replace(/{appdbid}/gi, o.appdbid).replace(/{vzregcode}/gi, o.vzregcode);
										_ndata.link = _ndata.link.replace(/{appdbid}/gi, o.appdbid).replace(/{vzregcode}/gi, o.vzregcode);
										$dwp.core.mportal.moveSubLayer(_ndata);
									});
									// 수락
									$("a.btn-join", _$eitem).off("click").on("click", function () {
										$dwp.core.util.xAjax({
											url: o.btn_yes
											, dataType: "json"
											, async: true
											, cache: false
											, data: { ismobile: "y" }
										}).done(function (jdata) {
											if (jdata.result == "200") {
												$fn.alert({ msg: jdata.msgcode })
													.done(function () {
														//_$slider.slick('slickGoTo', 0);
														_me.copMainInit({ initid: "WCOPMING", reload: true });
													})
											}
										});
									});
									// 거절
									$("a.btn-refuse", _$eitem).off("click").on("click", function () {
										$dwp.core.util.xAjax({
											url: o.btn_no
											, dataType: "json"
											, async: true
											, cache: false
											, data: { ismobile: "y" }
										}).done(function (jdata) {
											if (jdata.result == "200") {
												$fn.alert({ msg: jdata.msgcode })
													.done(function () {
														//_$slider.slick('slickGoTo', 0);
														_me.copMainInit({ initid: "WCOPMING", reload: true });
													})
											}
										});
									});
								})
							} else {
								if (_id == "visit") {
									$("<div class='no-result'>" + $fn.getCodeMsg("comm.msg.copinv_nodata") + "</div>").appendTo(_$item);
								}
							}

							//<!-- 새로운 VPR 생성 -->
							if (_id != "visit") {
								var _h = "<div class='dwp-item add-item'><div class='dwp-inner'>";
								_h += "<div class='thumb-icon'></div>";
								_h += "<div class='subject-area'><div class='subject'>" + $fn.getCodeMsg("comm.title.cop_create") + "</div></div>";
								_h += "</div></div>";

								$(_h).appendTo(_$list)
									.off("click").on("click", function () {
										$dwp.ui.dialog.init($(this), {
											title: $fn.getCodeMsg("comm.title.cop_create")
											, position: ['center', 20]
											, modal: true
											, ismobile: true
											, width: '100%'
											, height: 'auto'
											, islangconvert: false
											, content: { url: $fn.getPath("copmn") + "/owner_cfg?OpenForm", data: { ismobile: "y" } }
											, initcallback: function (_$dialog) {

											}
										});
									});
							}

							$(".dwp-header-m .dwp-page-title", dwpmo.div["view"]).text($fn.getCurLangMsg("CoP"));

							if (typeof callback == "function") {
								callback(jdata);
							}
						});
					}

					// event 처리
					function _eventInit(_initidx) {
						/* 모바일 lnb 뎁스 클릭시 슬라이더 이동 */
						$("a", _$header).off("click").on("click", function () {
							var idx = $(this).index();
							$(this).addClass("active").siblings().removeClass("active");
							_$slider.slick('slickGoTo', idx);
						});

						/* 모바일 슬라이더 이동시 lnb 이동 */
						_$slider.off("afterChange").on('afterChange', function (event, slick, currentSlide, nextSlide) {
							var offLeft = $("a", _$header).eq(currentSlide).position().left;

							if ($(slick.$list.context).hasClass("visual-slider")) {
								$("a", _$header).eq(currentSlide).addClass("active").siblings().removeClass("active");
								$(".dwp-2depth-nav", _$wrap).stop().animate({ scrollLeft: offLeft }, '500', 'swing', function () { });
							}

							var _data = $(slick.$slides[currentSlide]).data("_ITEM_DATA");
							if ($(slick.$slides[currentSlide]).html() == "") {
								_setMainData(_data.mid, function () {
									//console.log("height", $(slick.$slides[currentSlide]).height());
									_me._vprSliderResize($(slick.$slides[currentSlide]).height());
								});
							} else {
								_me._vprSliderResize($(slick.$slides[currentSlide]).height());
							}

							$dwp.core.mportal.curLayer().data($dwp.core.mportal._CONST._DATA.CUR_ITEM, _data);

						});
						console.log("_initidx", _initidx);
						var slick = _$slider.slick({
							arrows: false,
							dots: false,
							accessibility: false,
							infinite: false,
							adaptiveHeight: false,
							initialSlide: _initidx
						})
							.attr("isslick", "true");

						var height = $("div.slide[name=" + _idConvert(_opt.initid) + "]", dwpmo.div.view).height();
						_me._vprSliderResize(height);

					}

					function _alertInit(cate) {
						//console.log("cate", cate);

						// 환경설정, 알림 아이콘 Event처리
						_me.actCntRefresh();

						_me.alertList({
							data: cate
							, initcallback: function (_$dialog, data) {
								//Category 초기화
								var _$select = $("select[name=FeedType]", _$dialog.element);

								$("<option value=''/>").appendTo(_$select)
									.text($fn.getCodeMsg("comm.title.searchall")).val("all");
								$(data['ing']).each(function (i, o) {
									$("<option value=''/>").appendTo(_$select)
										.val(o.appdbid)
										.text($fn.getCurLangMsg(o.nm));
								});
								$(data['end']).each(function (i, o) {
									$("<option value=''/>").appendTo(_$select)
										.val(o.appdbid)
										.text($fn.getCurLangMsg(o.nm));
								});
							}
						});
					}

					if (_opt.reload || !_$slider.is("[isslick]")) {
						if (_$slider.is("[isslick]")) {
							_$slider.slick("unslick");
						}
						_$header.empty();
						_$slider.empty();

						//var _url = $dwp.core.getPath("menu") + "/api/data/collections/name/wvlnb_life?count=999";
						var _url = $dwp.core.getPath("menu") + "/api/data/collections/name/wvlnb_mo?count=999";
						if (_opt.isbwmh) {
							_url = $dwp.core.getPath("menu") + "/api/data/collections/name/wvlnb_mo?count=999";
						}
						$dwp.core.util.xAjax({
							url: _url
							, dataType: "json"
							, async: false
							, cache: false
							, data: { category: "WCOP" }
						}).done(function (jdata) {
							var _initidx = 0;
							var _ptitle = ""
							$(jdata).each(function (i, o) {
								_data = {
									title: o._title
									, mid: o._lnbid
									, lnbid: o._lnbid
									, lnblink: o._lnblink
									, lnbdlink: o._lnbdlink
									, lnbpos: o._lnbpos
									, link: o._link
									, linktype: o._linktype
									, subtype: o._mobiledoctype
									, menutitle: o._menutitle
								};
								if (o._lnbid == "WCOP") {
									//_gnb_data = _data;
									_htitle = _data.title;
								} else {
									_data.menutitle = _htitle;
									var _$a = $("<a>" + $fn.getCurLangMsg(_data.title) + "</a>").appendTo(_$header);
									var _$item = $("<div class='slide'></div>").appendTo(_$slider)
										.attr("name", _idConvert(_data.lnbid))
										.data("_ITEM_DATA", _data);

									if (_idConvert(_data.lnbid) == _idConvert(_opt.initid)) {
										_$a.addClass("active");
										_initidx = i - 1;
									}
								}
							});
							_setMainData(_opt.initid, function (jdata) {
								_eventInit(_initidx);
								//_alertInit(jdata);
								/*
								$("div[name=_ENV]", dwpmo.div.home).off("click").on("click", function(){
									console.log("ENV");
									_me.loadPage({layer:"doc", subtype : "edit", link : $fn.getPath("main") + "/wenv_vpr?readform", linktype : "PAGE"});
								});
								*/
							});
						});
					} else {
						var _slick = _$slider.slick("getSlick");
						if (_slick) {
							var _curlayer = _$slider.slick('slickCurrentSlide');
							var _index = $("div.slide[name=" + _idConvert(_opt.initid) + "]", dwpmo.div.view).index();
							if (_curlayer != _index) {
								_$slider.slick('slickGoTo', _index);
							}
						}
					}
				}
				// Vpr Main 함수 Stop
				, vprMainInit: function (opt) {
					var _me = this
						, _opt = $.extend({ initid: "MVPRING", reload: false }, opt)
						, _$wrap = $("div.dwp-container-m", dwpmo.div.view)
						, _$header = $("div.nav-inner", _$wrap)
						, _$slider = $("div.visual-slider", dwpmo.div.view);

					if ($(".dwp-header-m", dwpmo.div.view).size() > 0) {
						$(".dwp-header-m", dwpmo.div.view).addClass("no-shadow");
					}

					var _gnb_data = null;
					var _htitle = "";

					function _idConvert(id) {
						return id.replace("MVPR", "").toLowerCase();
					}

					// Main List 정보가져오기
					function _setMainData(id, callback) {
						var _id = _idConvert(id);
						var _$item = $("div.slide[name=" + _id + "]", _$slider);
						_$item.empty();

						$dwp.core.util.xAjax({
							url: $dwp.core.getPath("vprmn") + "/uservpr_info_v1?openagent"
							, dataType: "json"
							, async: false
							, cache: false
							, data: { empno: $fn.getCurUser().pinfo.empno }
						}).done(function (jdata) {
							var _$list = $("<div class='dwp-list'></div>").appendTo(_$item);
							if (jdata.hasOwnProperty(_id)) {
								$(jdata[_id]).each(function (i, o) {
									var _h = "<div class='dwp-item'><div class='dwp-inner'>";
									_h += "<div class='thumb-area dlink'><img src='" + dwpmo.info.protocol + dwpmo.info.domain + o.img + "'></div>";
									_h += "<div class='subject-area dlink'><div class='subject'>" + $fn.getCurLangMsg(o.nm) + "</div></div>";

									if (_id == "visit") {
										_h += "<div class='offer-area'>";
										_h += "<a class='btn-join point-color'>" + $fn.getCodeMsg("comm.title.vpr_join") + "</a>";
										_h += "<a class='btn-refuse'>" + $fn.getCodeMsg("comm.title.vpr_reject") + "</a>";
										_h += "</div>";
									}
									_h += "</div></div>";

									var _$eitem = $(_h).appendTo(_$list);
									$("div.dlink", _$eitem).off("click").on("click", function () {
										var _ndata = $.extend({ lnbid: "", layer: "view" }, _gnb_data);
										_ndata.title = _htitle;
										_ndata.lnbdlink = $dwp.core.getPath("vprmn") + "/lnb_appdb_menu_mo?ReadForm&appdbid={appdbid}&vzregcode={vzregcode}";
										_ndata.link = "/dwp/{vzregcode}/vprj/{appdbid}.nsf/appdb_main_mo?readForm&appdbid={appdbid}&vzregcode={vzregcode}";
										_ndata.linktype = "PAGE";
										_ndata.lnbdlink = _ndata.lnbdlink.replace(/{appdbid}/gi, o.appdbid).replace(/{vzregcode}/gi, o.vzregcode);
										_ndata.link = _ndata.link.replace(/{appdbid}/gi, o.appdbid).replace(/{vzregcode}/gi, o.vzregcode);
										$dwp.core.mportal.moveSubLayer(_ndata);
									});
									// 수락
									$("a.btn-join", _$eitem).off("click").on("click", function () {
										$dwp.core.util.xAjax({
											url: o.btn_yes
											, dataType: "json"
											, async: true
											, cache: false
											, data: { ismobile: "y" }
										}).done(function (jdata) {
											if (jdata.result == "200") {
												$fn.alert({ msg: jdata.msgcode })
													.done(function () {
														//_$slider.slick('slickGoTo', 0);
														_me.vprMainInit({ initid: "MVPRING", reload: true });
													})
											}
										});
									});
									// 거절
									$("a.btn-refuse", _$eitem).off("click").on("click", function () {
										$dwp.core.util.xAjax({
											url: o.btn_no
											, dataType: "json"
											, async: true
											, cache: false
											, data: { ismobile: "y" }
										}).done(function (jdata) {
											if (jdata.result == "200") {
												$fn.alert({ msg: jdata.msgcode })
													.done(function () {
														//_$slider.slick('slickGoTo', 0);
														_me.vprMainInit({ initid: "MVPRING", reload: true });
													})
											}
										});
									});
								})
							} else {
								if (_id == "visit") {
									$("<div class='no-result'>" + $fn.getCodeMsg("comm.msg.vprinv_nodata") + "</div>").appendTo(_$item);
								}
							}

							//<!-- 새로운 VPR 생성 -->
							if (_id != "visit") {
								var _h = "<div class='dwp-item add-item'><div class='dwp-inner'>";
								_h += "<div class='thumb-icon'></div>";
								_h += "<div class='subject-area'><div class='subject'>" + $fn.getCodeMsg("comm.title.vpr_create") + "</div></div>";
								_h += "</div></div>";

								$(_h).appendTo(_$list)
									.off("click").on("click", function () {
										$dwp.ui.dialog.init($(this), {
											title: $fn.getCodeMsg("comm.title.vpr_create")
											, position: ['center', 20]
											, modal: true
											, ismobile: true
											, width: '100%'
											, height: 'auto'
											, islangconvert: false
											, content: { url: $fn.getPath("vprmn") + "/owner_cfg?OpenForm", data: { ismobile: "y" } }
											, initcallback: function (_$dialog) {

											}
										});
									});
							}

							$(".dwp-header-m .dwp-page-title", dwpmo.div["view"]).text($fn.getCurLangMsg("VPR"));

							if (typeof callback == "function") {
								callback(jdata);
							}
						});
					}

					// event 처리
					function _eventInit(_initidx) {
						/* 모바일 lnb 뎁스 클릭시 슬라이더 이동 */
						$("a", _$header).off("click").on("click", function () {
							var idx = $(this).index();
							$(this).addClass("active").siblings().removeClass("active");
							_$slider.slick('slickGoTo', idx);
						});

						/* 모바일 슬라이더 이동시 lnb 이동 */
						_$slider.off("afterChange").on('afterChange', function (event, slick, currentSlide, nextSlide) {
							var offLeft = $("a", _$header).eq(currentSlide).position().left;

							if ($(slick.$list.context).hasClass("visual-slider")) {
								$("a", _$header).eq(currentSlide).addClass("active").siblings().removeClass("active");
								$(".dwp-2depth-nav", _$wrap).stop().animate({ scrollLeft: offLeft }, '500', 'swing', function () { });
							}

							var _data = $(slick.$slides[currentSlide]).data("_ITEM_DATA");
							if ($(slick.$slides[currentSlide]).html() == "") {
								_setMainData(_data.mid, function () {
									//console.log("height", $(slick.$slides[currentSlide]).height());
									_me._vprSliderResize($(slick.$slides[currentSlide]).height());
								});
							} else {
								_me._vprSliderResize($(slick.$slides[currentSlide]).height());
							}

							$dwp.core.mportal.curLayer().data($dwp.core.mportal._CONST._DATA.CUR_ITEM, _data);

						});

						var slick = _$slider.slick({
							arrows: false,
							dots: false,
							accessibility: false,
							infinite: false,
							adaptiveHeight: false,
							initialSlide: _initidx
						})
							.attr("isslick", "true");

						var height = $("div.slide[name=" + _idConvert(_opt.initid) + "]", dwpmo.div.view).height();
						_me._vprSliderResize(height);

					}

					function _alertInit(cate) {
						//console.log("cate", cate);

						// 환경설정, 알림 아이콘 Event처리
						_me.actCntRefresh();

						_me.alertList({
							data: cate
							, initcallback: function (_$dialog, data) {
								//Category 초기화
								var _$select = $("select[name=FeedType]", _$dialog.element);

								$("<option value=''/>").appendTo(_$select)
									.text($fn.getCodeMsg("comm.title.searchall")).val("all");
								$(data['ing']).each(function (i, o) {
									$("<option value=''/>").appendTo(_$select)
										.val(o.appdbid)
										.text($fn.getCurLangMsg(o.nm));
								});
								$(data['end']).each(function (i, o) {
									$("<option value=''/>").appendTo(_$select)
										.val(o.appdbid)
										.text($fn.getCurLangMsg(o.nm));
								});
							}
						});
					}

					if (_opt.reload || !_$slider.is("[isslick]")) {
						if (_$slider.is("[isslick]")) {
							_$slider.slick("unslick");
						}
						_$header.empty();
						_$slider.empty();

						//var _url = $dwp.core.getPath("menu") + "/api/data/collections/name/wvlnbpar_mo?count=999";
						var _url = $dwp.core.getPath("menu") + "/api/data/collections/name/wvlnb_mo?count=999";
						$dwp.core.util.xAjax({
							url: _url
							, dataType: "json"
							, async: false
							, cache: false
							, data: { category: "MVPR" }
						}).done(function (jdata) {
							var _initidx = 0;
							var _ptitle = ""
							$(jdata).each(function (i, o) {
								_data = {
									title: o._title
									, mid: o._lnbid
									, lnbid: o._lnbid
									, lnblink: o._lnblink
									, lnbdlink: o._lnbdlink
									, lnbpos: o._lnbpos
									, link: o._link
									, linktype: o._linktype
									, subtype: o._mobiledoctype
									, menutitle: o._menutitle
								};
								//if ( o.hasOwnProperty("_isview") && o._isview == "0" ) {
								if (o._lnbid == "MVPR") {
									//_gnb_data = _data;
									_htitle = _data.title;
								} else {
									var _$a = $("<a>" + $fn.getCurLangMsg(_data.title) + "</a>").appendTo(_$header);
									var _$item = $("<div class='slide'></div>").appendTo(_$slider)
										.attr("name", _idConvert(_data.lnbid))
										.data("_ITEM_DATA", _data);

									if (_idConvert(_data.lnbid) == _idConvert(_opt.initid)) {
										_$a.addClass("active");
										_initidx = i - 1;
									}
								}
							});
							_setMainData(_opt.initid, function (jdata) {
								_eventInit(_initidx);
								//_alertInit(jdata);
								/*
								$("div[name=_ENV]", dwpmo.div.home).off("click").on("click", function(){
									console.log("ENV");
									_me.loadPage({layer:"doc", subtype : "edit", link : $fn.getPath("main") + "/wenv_vpr?readform", linktype : "PAGE"});
								});
								*/
							});
						});
					} else {
						var _slick = _$slider.slick("getSlick");
						if (_slick) {
							var _curlayer = _$slider.slick('slickCurrentSlide');
							var _index = $("div.slide[name=" + _idConvert(_opt.initid) + "]", dwpmo.div.view).index();
							if (_curlayer != _index) {
								_$slider.slick('slickGoTo', _index);
							}
						}
					}
				}
				// Vpr Main 함수 Stop
				, getOptions: function () {
					return this.options;
				}
				, destroy: function () {
					var _me = this;
					_me.element.empty();
					_me._super();
				}
			});
		}
		, getInstance: function (el) {
			var _$el = $(el) || $("div.dwp-wrapping", $dwp.core.getContent());
			return $(el).data("dwp-custom");
		}
		, getOptions: function (el) {
			var _$el = $(el) || $("div.dwp-wrapping", $dwp.core.getContent());
			if (this.getInstance(_$el)) {
				return this.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	}
})($dwp.cns("core"), jQuery);
$dwp.core.custom._create();






