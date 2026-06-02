/**
 * <b>Doc 라이브러리</b>
 * <br>양식처리를 하기위한 Widget를 정의합니다.
 * @module core/doc
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.doc|core.doc}
 */
(function ( /** @lends	module:core~$dwp.core */ _$$, $) {
	/**
	 * Doc Widget 처리모듈
	 * @namespace
	 */
	_$$.doc = {
		_MODULE_NM: "dwp.doc",
		_REPLY_DATA: "dwp.doc.replydata",
		_CONST: {
			wenMediaRest: "http://202.31.8.241:8081/rest/stream/",
			ACTION: {
				DRAFT: "draft" //임시저장
				, AUTO_SAVE: "auto_save" //자동저장
				, REG: "register" //등록
				, SAVE: "save" //저장
				, SAVE_REP: "save_rep" //저장-댓글
				, EDIT: "edit" //편집
				, DEL_TEMP: "del_temp" //삭제(임시)
				, DEL_REG: "del_reg" //삭제(영구)
				, DEL_REP: "del_rep" //삭제(댓글)
				, DEL_SYSREP: "del_rep_sys" //삭제(댓글_관리자)
				, REPORT_REP: "report_rep" //댓글 신고
				, ADD_FAV: "add_fav" //즐겨찾기
				, LIKEIT: "likeit" //좋아요
				, RESTORE: "restore" //복원
			},
			BOOKMARK_MAP: "Type`}ApplCode`}R_UNID`}R_KEY_UNID`}R_DBPATH`}R_LINK`}Category`}Subject`}DOC_NO`}B_UNID`}B_DBPATH",
			BOOKMARK_SAVE: "_type`}_applcode`}_runid`}_rkey_unid`}_rdbpath`}_r_link`}_link`}_category`}_subject`}_docno"
		},
		_default: {}
		/*
		 * Doc Init
		 *
		 * @return	Doc object
		 */
		,
		init: function (opt, el) {
			//var _$el = el || $("div.dwp-wrapping", $dwp.core.getContent({type : (opt.ispreview?"preview":"")}))
			var _$el = null,
				_opt = $.extend({}, this._default, opt),
				_topt = { type: "", selector: "" };

			if (_opt.ispreview) { _topt.type = "preview" } else if (_opt.hasOwnProperty("did") && _opt.did != "") {
				_topt.type = "did";
				_topt.selector = "#" + _opt.did;
			} else if (_opt.ismobile) {
				_topt.type = "mobile";
				_topt.layer = (_opt.layer ? _opt.layer : "doc");
			};

			_$el = el || $dwp.core.getTarget(_topt);

			if (typeof $.fn.doc == "undefined") {
				this._create();
			}
			_$el.doc(_opt);

			$($("div.dwp-breadcrumbs span", $fn.getContent())[0]).off("click").on("click", function () {		//상단 아이콘 클릭시 화면 새로고침... 개발용
				$fn.loadPage({ link: $fn.getInstance("doc").options.pathinfo, linktype: "PAGE" })
			});

			return _$el.doc("instance");
		},
		_create: function () {
			var _me = this;
			$.widget(_me._MODULE_NM, {
				options: {
					cdb: "" //	현 DB Path
					, sysinfo: {} //  시스템 정보
					, pathinfo: "" //	호출 Url
					, ismobile: false //	모바일 여부
					, isadmin: false //	관리자 여부
					, isconowner: false //	컨텐츠 담당자 여부
					, isnew: true //	신규문서 여부
					, isedit: true //	편집여부
					, islangedit: false //	Lang 편집여부
					, ispopup: false //	팝업여부
					, ispreview: false //	미리보기 여부
					, isprint: false //	인쇄미리보기 여부
					, iseproof: false //	전자증빙 여부
					, proof: {} //  전자증빙 옵션 {docname : "", doctype : "", showui : ""}
					, printcomment: {} //	결재의견
					, isportal: false //  포탈 여부
					, isautosave: false //	자동저장여부
					, hideimg: false // 	본문이미지 숨기기
					, showfullimg: true //  전체원본이미지 보이기 2020-06-25 By LHJ ADD
					//,isattdoc : false			//	첨부문서 여부(첨부문서에서 Open 여부)
					, did: "" // 	Parents Target ID
					, unid: "" //	문서ID
					, key_unid: "" //	문서 Key Unid
					, docstatus: "" //	문서 상태
					, attach: { //	첨부파일 정보
						isattach: true,
						type: "D" //	로컬 : L, 원격DB : R, 문서 : D
						, attach_url: ""
						, iswebfolder: false //  Web Folder 첨부여부
						, isMegaAttach: false // 	대용량 첨부
						, isvalidate: false //	첨부필수 체크 여부
						, MegaSendURL: ""
						//,MegaChangeSize : 30 * 1024
						//,MaxFileCount : 20
						//,OneFileMaxSize : 50 * 1024
						//,TotalFileMaxSize : 50 * 1024
						//,FileFilter : ""
						, prohibit: "%^';"
						, mode: "edit"
						, vmode: "edit"
						, viewtype: ""
						, zipdownload: true
						, dataset: []
						, remove: null
					},
					imgattach: { //	첨부파일 정보
						isattach: false,
						type: "D" //	로컬 : L, 원격DB : R, 문서 : D
						, attach_url: ""
						, MaxFileCount: 20
						, OneFileMaxSize: 30 * 1024
						, TotalFileMaxSize: 50 * 1024
						, FileFilter: ""
						, prohibit: "%^"
						, mode: "edit"
						, dataset: []
						, remove: null
					}
					, isreply: true //	댓글사용여부
					, isconreplydel: false // 	컨텐츠 담당자가 하위댓글 삭제여부
					, isreport: true
					, iscriminate: false //  신고사용여부
					, islikeit: true //	좋아요 사용여부
					, isresponse: false //  응답문서 사용여부
					, rformalias: "" //	응답문서 양식명
					, response_list: { isuse: true, topunid: "", ps: "999", viewalias: "wvresponse" } // 응답문서 조회리스트 정보
					, button: null //	버튼 정보
					, iconbtn: [] //	상단 아이콘 버튼 정보
					, isexpend: false //	접기/펼치기 버튼 표시여부(2020-09-14 By LHJ ADD)
					, userprint: null //	사용자 Print 함수
					, viewurl: "" // 	목록호출 URL
					, bodyframe: false //	본문 IFRAME 열기(2020-08-03 By LHJ 기본값 변경)
					, getbodycallback: null //	본문 Callback함수
					//,iseditchk : true			//  문서 편집 중인 경우 페이지 이동 시, 확인 창 표시 여부
					, contextmenu: true //	왼쪽Context메뉴 보이기 여부
					, _isloading: true //	페이지 로딩여부 체크
					, langpath: ""
					, reply: {
						ps: 999,
						page: 1,
						total: 0,
						jtl: _$$.getPath("weblib") + "/jtl/app/wviwreply.st0001.jtl",
						maxlen: 299
					}
					, validateCallback: null
					, insertbody: null
					, insertbodyCallback: null
					, authorchange: null // 사용자 작성부서 변경 시 추가 호출 함수
					, viewday: false // 팝업공지시, 하루동안 안보기 표시여부
				},
				attach_obj: null,
				imgattach_obj: null,
				autoSaver: {
					timer: null,
					rtimer: null,
					interval: 5 * 60 * 1000,
					rinterval: 1 * 1000
				},
				_create: function () {
					console.log("dwp.doc Create")
				},
				getOptions: function () {
					return this.options;
				},
				autoSave: function () {
					var _me = this;
					console.log("autoSave");

					function _setbody() {
						var _deferred = $.Deferred();
						var _$mime = $("input[name='MIMESweeper']", _me.element);
						try {
							if ($("#bodyFld", _me.element)[0] != undefined) {
								if (_$mime.size() > 0) { _$mime.val("1"); }

								$dwp.ui.weditor.getMimeValue(_me.element, function (bodyVal) {
									//console.log("bodyVal",bodyVal);
									$("#Body", $('form', _me.element)).val(bodyVal);
									$("#bSummary", $('form', _me.element)).val($dwp.ui.weditor.getTextValue(_me.element).replace(/\n/g, "").substr(0, 200));

									_deferred.resolve();
								});

							} else {
								if (_$mime.size() > 0) { _$mime.val("0"); }
								_deferred.resolve();
							}
						} catch (e) {
							_deferred.reject();
						}
						return _deferred;
					}

					_setbody()
						.done(function () {
							var _data = { __Click: "0" };
							_data.AutoUNID = $("input[name='AutoUNID']", _me.element).val();
							_data.AutoSave_Mode = _me.options.isnew ? "NEW" : "EDIT";
							_data.AutoSave_RUNID = _me.options.isedit ? _me.options.unid : "";
							_data.AutoSave_Form = $("form", _me.element).attr("name");
							if (_data.AutoSave_Form == "_Reply" || _data.AutoSave_Form == "_wForward") {
								_data.AutoSave_Form = "_Memo";
							}
							_data.MIMESweeper = $("input[name='MIMESweeper']", _me.element).val();
							_data.Subject = $("input[name='Subject']", _me.element).val();
							_data.Body = $("#Body", $('form', _me.element)).val();
							_data.bSummary = $("#bSummary", $('form', _me.element)).val();
							_$$.util.cmdPost(
								$dwp.core.util.getProxyUrl(_me.options.cdb + '/wautosave?openform&Seq=1'), _data,
								function (data) {
									_me._autoSaveStop();
									if (data.hasOwnProperty("result")) {
										if (data.result >= "200" && data.result < "300") {
											$("input[name='AutoUNID']", _me.element).val(data.AutoUNID);
											//$fn.alert({msg : $fn.getCodeMsg("comm.msg.mmsg005")})
											//.done(function(){
											//	_me._autoSaveStart();
											//});
										} else {
											//_me._autoSaveStart();
										}
										_me._autoSaveStart();
									}
								}, 'json'
							);
						});
				},
				_autoSaveInit: function () {
					var _me = this;
					console.log("autoSaveInit");
					/*
					function _autoFunc() {
						_me._autoSaveStop();
						_me.autoSaver.rtimer = setTimeout(function(){
							if (_me.autoSaver.rtimer == null) { console.log("autoStop rtimer"); return; }
							_me._autoSaveStart();
						}, _me.autoSaver.rinterval);
					}

					_me.element.off('keydown.autosave').on('keydown.autosave', function(e){
						_autoFunc();
					});

					setTimeout(function(){
						console.log("autoSaveEditor");
						$dwp.ui.weditor.setFuncICall(_me.element, function(dom){
							$(dom).on('load', function(e){
								this.contentWindow.addEventListener('keyup', function(e){
									//console.log("keyup load");
									_autoFunc();
								});
								this.contentWindow.addEventListener('mousedown', function(e){
									//console.log("mousedown load");
									_autoFunc();
								});
							});
							if(_me.options.isnew) {
								dom.contentWindow.addEventListener('keyup', function(e){
									//console.log("keyup");
									_autoFunc();
								});
								dom.contentWindow.addEventListener('mousedown', function(e){
									//console.log("mousedown");
									_autoFunc();
								});
							}

							//$(dom).off('keydown.autosave').on('keydown.autosave', function(e){
							//	_me._autoSaveStop();
							//
							//	_me.autoSaver.rtimer = setTimeout(function(){
							//		if (_me.autoSaver.rtimer == null) { console.log("autoStop rtimer"); return; }
							//		_me._autoSaveStart();
							//	}, _me.autoSaver.rinterval);
							//});

						});
					}, 50);
					*/
					_me._autoSaveStart();
				},
				_autoSaveStart: function () {
					//console.log("autoSaveStart")
					var _me = this;

					_me._autoSaveStop();

					_me.autoSaver.timer = setTimeout(function () {
						if (_me.autoSaver.timer == null) { console.log("autoStop timer"); return; }
						_me.autoSave();
					}, _me.autoSaver.interval);
				},
				_autoSaveStop: function () {
					//console.log("autoSaveStop")
					var _me = this;

					if (_me.autoSaver.timer) {
						clearTimeout(_me.autoSaver.timer);
						_me.autoSaver.timer = null;
					}
					if (_me.autoSaver.rtimer) {
						clearTimeout(_me.autoSaver.rtimer);
						_me.autoSaver.rtimer = null;
					}
				},
				_draw_comcate_sel: function (opt, obj) {
					var that = this,
						_opt = opt,
						_$checkbox = obj;
					if (!_opt.isedit) return;
					var _$radio;
					const _SCG = "SCG";
					const _CENTER = "Center";
					var _$val_wrap = _$checkbox.closest(".dwp-value");
					var _html = '<div class="dwp-value" style="width:240px;border-right:1px solid #efefef;">';
					_html += '<div class="dwp-selectbox extended">';
					_html += '<div class="dwp-selection-group" data-xlang="LC_CODE" data-xlang-code="comm.data.comcate" data-xlang-type="radio" data-xlang-name="comcate-sel-btn" data-xlang-value=""></div>';
					/*
					_html += '<div class="dwp-selection-group">';
					_html += '<div class="dwp-radio"><label><input name="comcate-sel-btn" type="radio" value="sel_all"><span>전체선택</span></label></div>';
					_html += '<div class="dwp-radio"><label><input name="comcate-sel-btn" type="radio" value="SCG"><span>SCG</span></label></div>';
					_html += '<div class="dwp-radio"><label><input name="comcate-sel-btn" type="radio" value="desel_all" checked><span>전체해제</span></label></div>';
					_html += '<div class="dwp-radio"><label><input name="comcate-sel-btn" type="radio" value="Center"><span>고객센터</span></label></div>';
					_html += '</div>';
					*/
					_html += '</div>';
					_html += '</div>';
					var _$tar = $(_html).insertBefore(_$val_wrap);

					$dwp.core.lang.convert({ isedit: that.options.isedit }, _$tar);

					_$radio = $("[name='comcate-sel-btn']", that.element);
					_$radio.off("change").bind("change", function () {
						$.each(_$checkbox, function (i, o) {
							if ($(o).is(":checked") === true) {
								$(o).trigger("click");
							}
						});
						var _sel_val = $(this).xval();
						switch (_sel_val) {
							case "sel_all":
								$.each(_$checkbox, function (i, o) {
									if ($(o).is(":checked") === false) {
										$(o).trigger("click");
									}
								});
								break;
							case "desel_all":
								break;
							case _SCG:
								$.each(_$checkbox, function (i, o) {
									var _val = $(o).val();
									if ($dwp.core.getSysinfo().cominfo.hasOwnProperty(_val) && $dwp.core.getSysinfo().cominfo[_val].comcate === _SCG) {
										$(o).trigger("click");
									}
								});
								break;
							case _CENTER:
								$.each(_$checkbox, function (i, o) {
									var _val = $(o).val();
									if ($dwp.core.getSysinfo().cominfo.hasOwnProperty(_val) && $dwp.core.getSysinfo().cominfo[_val].comcate === _CENTER) {
										$(o).trigger("click");
									}
								});
								break;
						}
					});
				},
				_previewLoadPage: function (opt) {
					var _me = this,
						_opt = $.extend({ data: { preview: "1" } }, opt);

					_me._loadPage(_opt);

					/*
					,_$target =_me.element;

					_me.destroy();

					if ( _opt.url != "") {
						_$$.util.xAjax({
								url : $dwp.core.util.getProxyUrl(_opt.url)
								,dataType : "html"
								,async : true
								,cache : false
								,data : {preview : "1"}
						})
						.done(function(html){
							//_me.element.html(html);
							_$target.html(html);
						})
						.fail(function(){});
					}
					if (_opt.viewreload) {
						$fn.getInstance("view").reload();
					}
					*/
				},
				_loadPage: function (opt) {
					var _me = this,
						_opt = $.extend({ url: "", viewreload: false, data: {} }, opt),
						_$target = _me.element;

					_me.destroy();

					if (_opt.url != "") {
						_$$.util.xAjax({
							url: $dwp.core.util.getProxyUrl(_opt.url),
							dataType: "html",
							async: true,
							cache: false,
							data: _opt.data
						})
							.done(function (html) {
								//_me.element.html(html);
								if (_opt.data.hasOwnProperty("did")) {
									html = "<div class='dwp-container-wrap'><div class='dwp-container' style='padding:0px;'><div class='dwp-contents'><div class='dwp-wrapping'>" + html + "</div></div></div></div>";
								}
								_$target.html(html);
							})
							.fail(function () { });
					}
					if (_opt.viewreload) {
						$fn.getInstance("view").reload();
					}
				},
				reload: function () {
					var _me = this;
					_me._loadPage({ url: _me.options.pathinfo });
				},
				getAttachFileInfo: function () {
					var _me = this;

					if (_me.attach_obj) {
						return _me.attach_obj.getFileData();
					} else {
						return null;
					}
				},
				// 대용량 첨부존채여부
				isMegaAttach: function () {
					var _me = this;

					if (_me.attach_obj) {
						return _me.attach_obj.isMegaAttach();
					} else {
						return false;
					}
				},
				// 첨부파일 저장하기
				attachSave: function () {
					var _me = this,
						_deferred = $.Deferred(),
						_promise = null;

					if (_me.attach_obj != null) {
						_promise = _me.attach_obj.submit();
						if (_promise) {
							_promise.done(function (_rtn) {
								if (_rtn.length > 0) {
									console.log("_rtn", _rtn);
									var _mega = [],
										_folder = "",
										_fname = [],
										_isfsize = false;
									$("input[name='Multi_Attach_Files']", _me.element).val($.map(_rtn, function (o, i) {
										if (o.size == "0" || o.size == "") _isfsize = true;
										if (o.hasOwnProperty("ismega") && o.ismega) {
											_mega.push(o);
										} else {
											_folder = o.folder;
											_fname.push(o.filename);
											return o.folder + "/" + o.filename;
										}
									}).join(";"));

									$("input[name='Multi_Attach_SortFiles']", _me.element).val($.map(_me.attach_obj.getFileData(), function (o, i) {
										if (!o.ismega) { return o.name; }
									}).join(";"));
									$("input[name='Multi_Attach_SortFilesSize']", _me.element).val($.map(_me.attach_obj.getFileData(), function (o, i) {
										if (!o.ismega) { return o.size; }
									}).join(";"));

									if (_me.options.attach.islocal) {
										$("input[name='Multi_Attach_Type']", _me.element).val("L");
										$("input[name='Multi_Attach_Info']", _me.element).val("{}");
									}
								}
								if (_isfsize) {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg028") })
										.done(function () {
											if (!_opt.isnotblock) { $.unblockUI(); }
											_deferred.reject();
										});
								} else {
									_deferred.resolve(_mega);
								}
							});
							_promise.fail(function (e, o) {

								//alert("첨부파일 업로드시 오류가 발생했습니다!");
								$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg028") })
									.done(function () {
										if (!_opt.isnotblock) { $.unblockUI(); }
										_deferred.reject();
									});
								//$.unblockUI();
								//return false;
							});
						} else {
							$("input[name='Multi_Attach_SortFiles']", _me.element).val($.map(_me.attach_obj.getFileData(), function (o, i) {
								if (!o.ismega) { return o.name; }
							}).join(";"));
							$("input[name='Multi_Attach_SortFilesSize']", _me.element).val($.map(_me.attach_obj.getFileData(), function (o, i) {
								if (!o.ismega) { return o.size; }
							}).join(";"));

							_deferred.resolve();
						}
					} else {
						_deferred.resolve();
					}
					return _deferred;
				},
				editDocument: function (opt) {
					var _me = this,
						_url = "",
						_opt = $.extend({ url: "" }, opt);
					//_url = _me.options.cdb + "/0/" + _me.options.unid + "?editdocument";

					if (_me.options.ismobile) {
						_url = _me.options.cdb + "/" + _me.options.formview + "/" + _me.options.unid + "?editdocument";
						if (_opt.url != "") { _url = _opt.url; }
						$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "edit" });
					} else {
						_url = _me.options.cdb + "/" + (_me.options.hasOwnProperty("formview") && _me.options.formview != "" ? _me.options.formview : "0") + "/" + _me.options.unid + "?editdocument";
						if (_opt.url != "") { _url = _opt.url; }
						if (_me.options.ispreview) {
							_me._previewLoadPage({ url: _url, viewreload: false });
						} else if (_me.options.hasOwnProperty("did") && _me.options.did != "") {
							_me._loadPage({ url: _url, data: { did: _me.options.did }, viewreload: false });
						} else {
							_$$.util.loadPage({ link: _url, linktype: "PAGE" });
						}
					}
				},
				deleteDocument: function (opt) {
					var _me = this,
						_rows = null,
						_unids = "",
						_opt = $.extend({ softdel: true }, opt);

					if (_opt.hasOwnProperty("confirm")) {
						// if (!$fn.confirm({msg : _opt["confirm"], success : function(){}, })) return;
						var _msg = _opt["confirm"];
						if (_me.options.isresponse) {	//응답문서 사용여부
							_msg += "<br>주)응답문서도 함께 삭제됩니다";
						}
						$fn.confirm({ msg: _msg })
							.done(function () { _ok(); })
					} else {
						// 2019-10-01 By LHJ ADD Response
						if (_me.options.isresponse) {	//응답문서 사용여부
							$fn.confirm({ msg: $fn.getCodeMsg("삭제시, 응답문서도 함께 삭제됩니다. 삭제하시겠습니까?") })
								.done(function () { _ok(); })
						} else {
							_ok();
						}
					}

					function _ok() {
						_unids = _me.options.unid;

						_$$.util.cmdPost(
							$dwp.core.util.getProxyUrl(_me.options.cdb + '/wcmdpost?createdocument'), { actiontype: (_opt.softdel ? _$$.doc._CONST.ACTION.DEL_TEMP : _$$.doc._CONST.ACTION.DEL_REG), postdata: _unids },
							function (data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										if (_opt.hasOwnProperty("callback") && typeof _opt.callback == "function") {
											_opt.callback(data);
										} else {
											/*
											$dwp.ui.alert({msg : (_opt.softdel ? $fn.getCodeMsg("comm.msg.msg003") : $fn.getCodeMsg("comm.msg.msg004"))})
											.done(function() {
												_me.goview({type:"del", viewreload : true});
											});
											*/
											$fn.toast({ msg: (_opt.softdel ? $fn.getCodeMsg("comm.msg.msg003") : $fn.getCodeMsg("comm.msg.msg004")) });
											_me.goview({ type: "del", viewreload: true });
											//_me.goview({type:"del", viewreload : true});
										}
									} else {
										//error
									}
								} else {
									//error
								}
							}, 'json'
						);
					}

				},
				restoreDocument: function (opt) {
					var _me = this,
						_rows = null,
						_unids = "",
						_opt = $.extend({ docstatus: "" }, opt);

					_unids = _me.options.unid;

					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_me.options.cdb + '/wcmdpost?createdocument'), { actiontype: _$$.doc._CONST.ACTION.RESTORE, docstatus: _opt.docstatus, postdata: _unids },
						function (data) {
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									var _msgcode = "comm.msg.msg020"
									if (data.hasOwnProperty("cnt") && data.cnt == "0") {
										_msgcode = "부모문서가 임시삭제문서인 경우는 부모문서를 복원 후 복원하십시요!";
									}
									$dwp.ui.alert({ msg: $fn.getCodeMsg(_msgcode) })
										.done(function () { _me.goview(); });
									//_me.goview();
								} else {
									//error
								}
							} else {
								//error
							}
						}, 'json'
					);
				},
				//응답문서 작성하기
				repDoc: function (opt) {
					var _me = this,
						_opt = $.extend({ form: "", param: {} }, opt),
						_param = "";

					if (_opt.form == "") return;

					_param = $.param(_opt.param);

					if (_me.options.ismobile) {
						_url = _me.options.cdb + "/" + _opt.form + "?openform&ParentUNID=" + _me.options.unid + "&" + _param;
						$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "edit" });
					} else {
						_url = _me.options.cdb + "/" + _opt.form + "?openform&ParentUNID=" + _me.options.unid + "&" + _param;
						if (_me.options.ispreview) {
							_me._previewLoadPage({ url: _url, viewreload: false });
						} else if (_me.options.hasOwnProperty("did") && _me.options.did != "") {
							_me._loadPage({ url: _url, data: { did: _me.options.did }, viewreload: false });
						} else {
							_$$.util.loadPage({ link: _url, linktype: "PAGE" });
						}
					}
				},
				criminateM: function (opt) {
					var _me = this,
						_opt = $.extend({
							title: $fn.getCodeMsg("comm.title.js001"),
							width: '100%'
							//,height : 587
							,
							modal: true,
							ismobile: true,
							content: { url: $fn.getPath("gwlib") + "/wcriminate_mo?readform" },
							initcallback: function (_$dialog) {
								var _$user = $("div.dwp-user", _$dialog.element),
									_h = "",
									_pinfo = $dwp.core.getCurUser().pinfo;

								_h = "<div class='profile'><img src='" + $dwp.core.getPath("pic", { empno: _pinfo.empno }) + "'></div>";
								_h += "<div class='profile-info'>";
								_h += "<div class='name'>" + $dwp.core.lang.getCurMsg(_pinfo.name) + "</div>";
								_h += "<div class='rank'>" + $dwp.core.lang.getCurMsg(_pinfo.posname) + "</div>";
								_h += "<div class='team'>" + $dwp.core.lang.getCurMsg(_pinfo.orgname) + "</div>";
								_h += "</div>";

								_$user.html(_h);

								//제목에는 기본값 넣어주기 - 2016.12.16 by dwlee
								$("input[name='Subject']", _$dialog.element).xval($fn.getCodeMsg("comm.title.js048"));

								$fn.getPicError($("div.dwp-user img", _$dialog.element));

								$("div.dwp-user", _$dialog.element).attr({ "data-empno": _pinfo.empno, "data-orgcode": _pinfo.orgcode })
									.off("click").on("click", function () {
										$dwp.ui.bizcard.init($(this), { ismobile: true });
									});
							},
							refdata: opt,
							confirm: function (_$dialog) {
								_pinfo = $dwp.core.getCurUser().pinfo;

								if ($("input[name='Subject']", _$dialog.element).xval() == "") {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.subject"), ismobile: true });
									return;
								}
								if ($("[name='comment']", _$dialog.element).xval() == "") {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.opinion"), ismobile: true });
									return;
								}
								var _docopt = _$dialog.options.refdata;
								var _subject = $("input[name='Subject']", _$dialog.element).xval();
								var _opinion = $("[name='comment']", _$dialog.element).xval();
								$fn.xAjax({
									url: $fn.getProxyUrl($fn.getPath("gwlib") + '/post_wcriminate?createdocument'),
									data: { from: _pinfo.empno, to: _docopt.conowners, dbpath: _docopt.cdb, docid: _docopt.unid, subject: _subject, body: _opinion },
									method: "POST",
									dataType: "json",
									async: false
								}).done(function (data) {
									if (data.hasOwnProperty("result")) {
										if (data.result >= "200" && data.result < "300") { //작업성공
											$fn.alert({ msg: $fn.getCodeMsg("comm.msg.success"), ismobile: true });
											_$dialog.close();
										} else { //작업실패!!!
											$fn.alert({ msg: $fn.getCodeMsg("comm.msg.err00"), ismobile: true });
										}
									} else {
										//작업실패!!!!
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.err00"), ismobile: true });
									}
								}).fail(function (req, error) {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.err00"), ismobile: true });
								});
								_$dialog.close();

							}
						});

					$dwp.ui.dialog.init(_me.element, _opt);
				},
				criminate: function (opt) {
					var _me = this,
						_opt = $.extend({
							title: $fn.getCodeMsg("comm.title.js001"),
							width: 420
							//,height : 587
							,
							modal: true,
							hide: { effect: "fade", duration: 300 },
							show: { effect: "fade", duration: 300 },
							content: { url: $fn.getPath("gwlib") + "/wcriminate?readform" },
							initcallback: function (_$dialog) {
								//console.log("aaa")
								var _$user = $("div.dwp-user", _$dialog.element),
									_h = "",
									_pinfo = $dwp.core.getCurUser().pinfo;

								_h = "<div class='profile'><img src='" + $dwp.core.getPath("pic", { empno: _pinfo.empno }) + "'></div>";
								_h += "<div class='profile-info'>";
								_h += "<div class='name'>" + $dwp.core.lang.getCurMsg(_pinfo.name) + "</div>";
								_h += "<div class='rank'>" + $dwp.core.lang.getCurMsg(_pinfo.posname) + "</div>";
								_h += "<div class='team'>" + $dwp.core.lang.getCurMsg(_pinfo.orgname) + "</div>";
								_h += "</div>";

								_$user.html(_h);

								//제목에는 기본값 넣어주기 - 2016.12.16 by dwlee
								$("input[name='Subject']", _$dialog.element).xval($fn.getCodeMsg("comm.title.js048"));

								$fn.getPicError($("div.dwp-user img", _$dialog.element));

								$("div.dwp-user", _$dialog.element).attr({ "data-empno": _pinfo.empno, "data-orgcode": _pinfo.orgcode })
									.off("click").on("click", function () {
										$dwp.ui.bizcard.init($(this));
									});
							},
							refdata: opt,
							buttons: [{
								title: $fn.getCodeMsg("comm.btn.confirm"),
								click: function (_$dialog) {
									_pinfo = $dwp.core.getCurUser().pinfo;

									if ($("input[name='Subject']", _$dialog.element).xval() == "") {
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.subject") });
										return;
									}
									if ($("[name='comment']", _$dialog.element).xval() == "") {
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.opinion") });
										return;
									}
									var _docopt = _$dialog.options.refdata;
									var _subject = $("input[name='Subject']", _$dialog.element).xval();
									var _opinion = $("[name='comment']", _$dialog.element).xval();
									$fn.xAjax({
										url: $fn.getProxyUrl($fn.getPath("gwlib") + '/post_wcriminate?createdocument'),
										data: { from: _pinfo.empno, to: _docopt.conowners, dbpath: _docopt.cdb, docid: _docopt.unid, subject: _subject, body: _opinion },
										method: "POST",
										dataType: "json",
										async: false
									}).done(function (data) {
										if (data.hasOwnProperty("result")) {
											if (data.result >= "200" && data.result < "300") { //작업성공
												$fn.alert({ msg: $fn.getCodeMsg("comm.msg.success") });
												_$dialog.close();
											} else { //작업실패!!!
												$fn.alert({ msg: $fn.getCodeMsg("comm.msg.err00") });
											}
										} else {
											//작업실패!!!!
											$fn.alert({ msg: $fn.getCodeMsg("comm.msg.err00") });
										}
									}).fail(function (req, error) {
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.err00") });
									});
									_$dialog.close();
								}
							}, {
								title: $fn.getCodeMsg("comm.btn.cancel"),
								click: function (_$dialog) {
									_$dialog.close();
								}
							}]
						});

					$dwp.ui.dialog.init(_me.element, _opt);
				},
				thubmimgSelect: function (el) {
					var _me = this,
						_$el = $(el),
						_h = "<div class='dwp-thumb-select-dialog'><ul class='thumb-list'></ul></div>",
						_opt = $.extend({
							title: $fn.getCodeMsg("comm.title.js002"),
							width: 420
							//,height : 587
							,
							modal: true,
							hide: { effect: "fade", duration: 300 },
							show: { effect: "fade", duration: 300 },
							content: { html: _h },
							initcallback: function (_$dialog) {
								var _h = "",
									_imgs = $dwp.ui.weditor.getImg(_me.element);
								_imgs.each(function (i) {
									_h += "<li data-index='" + (i + 1) + "'><div class='thumb-item'>";
									_h += "<img src='" + $(this).attr("src") + "'>";
									_h += "</div></li>";
								});

								var _medias = $dwp.ui.weditor.getMedia(_me.element);
								//var _rest = "http://202.31.8.241:8081/rest/stream/"
								_medias.each(function (i, o) {
									_h += "<li data-index='m" + (i + 1) + "'><div class='thumb-item'>";
									if ($(o).has("name") && $(o).attr("name") == "dwp_media") {
										//_h += "<img src='/wps/PA_DWP_WENMedia/wenMedia/proxy.jsp?" + _$$.doc._CONST.wenMediaRest + $(this).attr("fileid") + "/thumbnail;idx=1;size=300*225'>";
										_h += "<img src='/wenmediarest/" + $(this).attr("fileid") + "/thumbnail;idx=1;size=300*225'>";
									} else {
										var _src = $(o).attr("src"),
											_regexp = /\/embed\/([\S]+)/,
											_match = _regexp.exec(_src);
										if (_match) {
											_h += "<img src='http://img.youtube.com/vi/" + _match[1] + "/mqdefault.jpg'>";
										}
									}
									_h += "</div></li>";
								});

								if (_h != "") {
									$("ul", _$dialog.element).append(_h);
									$("li", _$dialog.element).off("click").on("click", function () {
										$(this).addClass("active").siblings().removeClass("active");
									});
								}
							},
							buttons: [{
								title: $fn.getCodeMsg("comm.btn.confirm"),
								click: function (_$dialog) {
									if ($("li.active", _$dialog.element).size() == 0) {
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg021") });
										return;
									}
									var _index = $("li.active", _$dialog.element).data().index;
									//console.log("dd",_index);
									var _src = $("li.active img", _$dialog.element).attr("src");
									$("input[name=thumbPos]", _me.element).val(_index);
									//console.log($("input[name=thumbPos]", _me.element));
									//$("input[name=thumbImgUrl]", _me.element).val(_src);
									$("img[name=thumb-img]", _me.element).attr("src", _src);
									_$dialog.close();
								}
							}, {
								title: $fn.getCodeMsg("comm.btn.cancel"),
								click: function (_$dialog) {
									_$dialog.close();
								}
							}]
						});

					$dwp.ui.dialog.init(_$el, _opt);
				},
				//목록으로
				goview: function (opt) {
					//console.log("_opt", opt);
					var _me = this,
						_opt = $.extend({ type: "", unid: "", viewreload: false }, opt),
						_vopt = _$$.portal.getPreViewInfo(),
						_url = (_vopt != undefined) ? _vopt.pathinfo : _me.options.viewurl;
					console.log("doc_vopt", _vopt);
					if (_me.options.ismobile) {
						if (_opt.type == "del") {
							//$dwp.core.mportal.loadPage({link : _url, linktype : "PAGE", layer : "view", subtype : ""});
							$dwp.core.history.goback(-1, true);
						} else {
							//$dwp.core.history.goback(-1, _opt.viewreload);		//이것도 버그발생
							//_$$.mportal.moveLayer({ layer: "view" });				//이거는 버그발생
							_$$.mportal.moveLayer({
								layer: "view", incallback: function () {		//BN 수정 : 이거 사용
									var _$footer = $("div.dwp-footer-m", $(dwpmo.div.home));
									var _$refresh = $("div[name='refresh']", _$footer);
									if (_$refresh.size() > 0) {
										_$refresh.get(0).click();
									}
								}
							});
						}
					} else {
						if (_me.options.ispreview) {
							if (_opt.type == "del") {
								_me._previewLoadPage({ url: "", viewreload: _opt.viewreload });
							} else if (_opt.unid != "") {
								_url = _me.options.cdb + "/0/" + _opt.unid + "?opendocument";
								_me._previewLoadPage({ url: _url, viewreload: _opt.viewreload });
							}
						} else if (_me.options.hasOwnProperty("did") && _me.options.did != "") {
							if (_opt.type == "del") {
								$("#" + _me.options.did).xdialog("instance").close();
								if (_url != "") {
									_$$.util.loadPage({ link: _url, linktype: "PAGE" });
								} else {
									// To-Do
								}
							} else {
								_me._loadPage({ url: _url, data: { did: _me.options.did }, viewreload: false });
							}
						} else if (_me.options.ispopup == true) {
							window.close();
						} else {
							// Tab사용여부체크
							var _envinfo = $dwp.core.getCurUser().pinfo.envinfo;
							if (_envinfo.hasOwnProperty("usetab") && _envinfo.usetab == "1") {
								if (_url != "") {
									_$$.portal.setDocPreViewInfo(_vopt);
								}
								var __$el = $dwp.core.getContent();
								var _tabs = __$el.xtab("instance");
								_tabs.removeTab({
									selecturl: _url,
									fail: function () {
										$dwp.core.util.loadPage({ link: _url, linktype: "PAGE" });
									}
								});

							} else {
								if (_url != "") {
									_$$.portal.setDocPreViewInfo(_vopt);
									_$$.util.loadPage({ link: _url, linktype: "PAGE" });
								} else {
									// To-Do
								}
							}
						}
					}
				},
				// 본문이미지 on-off 처리
				viewImage: function () {
					var _me = this,
						_$bodyarea = null;

					if (_me.options.bodyframe) {
						var _$iframe = $("#iBody", _me.element);
						var _body = _$iframe.get(0).contentWindow || (_$iframe.get(0).contentDocument.document || _$iframe.get(0).contentDocument);

						_$bodyarea = _body.document.body;
					} else {
						_$bodyarea = $("#bodyFld", _me.element);
					}

					if (_me.options.hideimg) {
						$("img[osrc]", _$bodyarea).each(function () {
							var _osrc = $(this).attr("osrc");
							$(this).attr("src", _osrc);
							$(this).removeAttr("osrc");
						});
						_me.options.hideimg = false;
					} else {
						$("img[src]", _$bodyarea).each(function () {
							var _src = $(this).attr("src");
							$(this).attr("osrc", _src);
							$(this).removeAttr("src");
						});
						_me.options.hideimg = true;
					}

					return _me.options.hideimg;
				},
				// 문서 Print
				printDoc: function (opt) {
					//proof : {doctype : "", docname : "", showui : "1"}
					var _me = this
					_opt = $.extend({
						url: ""
						//, iseproof : false
						,
						iseproof: _me.options.iseproof //임시로 막기
						,
						proof: $.extend({ url: _me.options.pathinfo, doctype: "", docname: "", showui: "1" }, _me.options.proof),
						comment: _me.options.printcomment
					}, opt);

					if (_opt.url != "") {
						_$$.util.xAjax({
							url: $fn.getProxyUrl(_opt.url),
							data: { did: "RTNJS" },
							dataType: "html",
							async: true,
							success: function (data, textStatus, req) {
								var _$rtnjs = $("#RTNJS");
								if (_$rtnjs.size() == 0) {
									_$rtnjs = $("<div id='RTNJS' style='display:none'></div>").appendTo($("body"));
								}
								_$rtnjs.html(data);
								_$rtnjs.print(_opt);
								_$rtnjs.remove();
							}
						});
					} else {
						if (_me.options.did != "") {
							if ($("div.dwp-wrapping", _me.element).size() > 0) {
								$("div.dwp-wrapping", _me.element).print(_opt);
							} else {
								$(_me.element).print(_opt);
							}
						} else {
							$(_me.element).print(_opt);
						}
					}
				},
				_init: function () {
					var _me = this;

					if (!_me.options.ismobile) {
						if ($("#bodyFld", _me.element).size() > 0 && _me.options.isedit && !_me.options.isnew) {
							_me.options._isloading = false;
						}
					}
					console.log("isloading", _me.options._isloading);
					// 초기 시스템 정보 설정
					if ($("#_SYSTEM_INFO", _me.element).size() > 0) {
						var _sysinfo = $.trim($("#_SYSTEM_INFO", _me.element).text());
						try { _me.options.sysinfo = $.parseJSON(_sysinfo); } catch (e) { };
					}

					// Context 메뉴 숨기기
					if (!_me.options.contextmenu) {
						$dwp.core.portal.contextMenu.on(_me.element);
					}

					// Header 처리하기
					_me._headerProc();

					_me._bodyProc();

					_me._replyProc();

					if (!_me.options.ismobile) {
						_me._prevNextProc();
						_me._reponseProc();
						_me._topBtnProc();
					} else {
						_me._prevNextMProc();
					}
					_me._etcEventProc();

					_me._etcProc();

					$dwp.core.lang.convert({ url: _me.options.langpath, isedit: (_me.options.isedit || _me.options.islangedit) }, _me.element);

					// 자동저장처리 Start
					if (_me.options.isautosave && _me.options.isedit && !_me.options.ismobile) {
						_me._autoSaveInit();
					}
				},
				// 작성자겸직처리
				_concProc: function () {
					var _me = this,
						_$authorDisp = $("[name='authorDisp']", _me.element);

					if (_$authorDisp.size() == 0) return;

					var _pinfo = _$$.getCurUser().pinfo,
						_corgcode = (_$authorDisp.is("[data-orgcode]") ? _$authorDisp.attr("data-orgcode") : _pinfo.orgcode),
						_isdisptype = (_$authorDisp.is("[data-depttype]") ? false : true),
						_$wrap, _$select;

					if (_pinfo.multiuser.length <= 1) return;

					_$authorDisp.empty("")
					_$wrap = $("<div class='dwp-selectbox'></div>'").appendTo(_$authorDisp);
					_$select = $("<select></select>").appendTo(_$wrap);

					var JSONSort = function (a, b) { if ((a.comname + a.orgname) == (b.comname + b.orgname)) { return 0 } return (a.comname + a.orgname) > (b.comname + b.orgname) ? 1 : -1; };
					var _multiuser = $.merge(_$$.getCurUser().pinfo.multiuser, []);
					_multiuser.sort(JSONSort);						//겸직 정보 소트 (계열사명 + 부서명)값으로 소트해서 출력 2021-05-28

					$.each(_multiuser, function (i, o) {
						//if (o.comcode == $fn.getComCode()) {		//계열사 겸직도 표시하도록 변경 2021-05-28
						var _$opt = $("<option/>").appendTo(_$select), _deptname = _$$.lang.getCurMsg(o.orgname);
						if (o.comcode != $fn.getComCode()) _deptname += " (" + _$$.lang.getCurMsg(o.comname) + ")";
						_$opt.attr("value", o.orgcode).text(_deptname).data("orgdata", o);	//편집시에만 소속 회사가 아니면 계열사 명칭을 SelectBox에만 추가 2021-05-28
						//_$opt.attr("value", o.orgcode).text(_$$.lang.getCurMsg(o.orgname)).data("orgdata", o);
						if (o.orgcode == _corgcode) {
							_$opt.prop("selected", true);
							if (_isdisptype) {
								_$authorDisp.prepend(_$$.lang.getCurMsg(o.name) + " / " + _$$.lang.getCurMsg(o.posname) + " / ");
							}
						}
						//}
					});

					function _makeAuthorField(o) {
						var _$form = $("form", _me.element),
							_$comcode = $("input[name='AuthorComCode']", _$form),
							_$orgcode = $("input[name='AuthorOrgCode']", _$form),
							_$orgname = $("input[name='AuthorOrgName']", _$form),
							_$porgcode = $("input[name='AuthorParOrgCode']", _$form),
							_$porgname = $("input[name='AuthorParOrgName']", _$form),
							_$dutycode = $("input[name='AuthorDutyCode']", _$form),
							_$dutyname = $("input[name='AuthorDutyName']", _$form),
							_$gradecode = $("input[name='AuthorGradeCode']", _$form),
							_$gradename = $("input[name='AuthorGradeName']", _$form)

						if (_$comcode.size() == 0) {
							_$comcode = $("<input type='hidden' name='AuthorComCode'/>").appendTo(_$form);
						}
						_$comcode.val(o.comcode);

						if (_$orgcode.size() == 0) {
							_$orgcode = $("<input type='hidden' name='AuthorOrgCode'/>").appendTo(_$form);
						}
						_$orgcode.val(o.orgcode);

						if (_$orgname.size() == 0) {
							_$orgname = $("<input type='hidden' name='AuthorOrgName'/>").appendTo(_$form);
						}
						_$orgname.val(o.orgname);

						if (_$porgcode.size() == 0) {
							_$porgcode = $("<input type='hidden' name='AuthorParOrgCode'/>").appendTo(_$form);
						}
						_$porgcode.val(o.porgcode);

						if (_$porgname.size() == 0) {
							_$porgname = $("<input type='hidden' name='AuthorParOrgName'/>").appendTo(_$form);
						}
						_$porgname.val(o.progname);

						if (_$dutycode.size() == 0) {
							_$dutycode = $("<input type='hidden' name='AuthorDutyCode'/>").appendTo(_$form);
						}
						_$dutycode.val(o.dutycode);

						if (_$dutyname.size() == 0) {
							_$dutyname = $("<input type='hidden' name='AuthorDutyName'/>").appendTo(_$form);
						}
						_$dutyname.val(o.dutyname);

						if (_$gradecode.size() == 0) {
							_$gradecode = $("<input type='hidden' name='AuthorGradeCode'/>").appendTo(_$form);
						}
						_$gradecode.val(o.poscode);

						if (_$gradename.size() == 0) {
							_$gradename = $("<input type='hidden' name='AuthorGradeName'/>").appendTo(_$form);
						}
						_$gradename.val(o.posname);
					}
					_$select.off("change").on("change", function () {
						_makeAuthorField($("option:selected", $(this)).data("orgdata"));
						if (typeof _me.options.authorchange == "function") {
							_me.options.authorchange(_me, $("option:selected", $(this)).data("orgdata"));
						}
					});
				},
				// 버튼 처리
				_btnProc: function () {
					console.log("btnProc Start")
					var _me = this,
						_btninfo = this.options.button,
						_$btnarea = $("div.dwp-btn-group", this.element);

					if (_$btnarea.size() == 0) return;

					var _btnlist = _$btnarea.attr("data-btn-list"),
						_instance = _me.element.data("dwp-doc"),
						_$btn = null,
						_vbtnlist = null;

					if (_btninfo == null || _btnlist == "") return;

					if ((_me.options.hasOwnProperty("did") && _me.options.did != "") || _me.options.ispopup) {
						_btnlist = _btnlist + ",";
						if (_btnlist.indexOf("goview,") > -1) {
							_btnlist = _btnlist.replace("goview,", "")
						}
						_btnlist = _btnlist.substring(0, _btnlist.length - 1);
					}

					_$btnarea.empty();

					_vbtnlist = _btnlist.split(",");
					$.each(_vbtnlist, function (i, v) {
						if (_$btnarea.is("[data-btn-" + v + "]")) {
							_vbtnlist[i] = _$btnarea.attr("data-btn-" + v).split(",")
						}
					});

					if (_me.options.ismobile) {
						if (_me.options.did == "") {
							//var _$mbtnarea = $(".dwp-header-m div[name='btn-user-area']", _me.element.parents(".dwp-mobile-area"));
							//_$mbtnarea.empty();
							//$dwp.ui.mbutton( _$mbtnarea, { buttons : $dwp.core.util.exObjList(_btninfo, _vbtnlist), isedit : _me.options.isedit, data : [_instance, _me.element]});
							// 2019-12-01 By LHJ ADD 모바일 버튼 변경
							var _$listheader = $("div.dwp-list-header", _me.element),
								_$listtitle = $("div.dwp-list-title", _$listheader)
							_$menu = $("<a class='menu'><img src='" + $fn.getPath('weblib') + "/images/mobile/menu.png'/></a>").appendTo($("div.right", _$listtitle));
							_$menu.off("click").on("click", function () {
								// Qt메뉴표시
								$dwp.ui.qtdialog.init(_$menu, {
									qtid: "mbtn_list",
									dialogClass: 'titleless dropdown-type-dialog',
									width: "140px",
									position: { my: "right top", at: "right bottom", collision: "flipfit" },
									initcallback: function (_$qtdialog) {
										var i = 0;
										var _$ul = $("<ul class='dwp-option-list'></ul>").appendTo(_$qtdialog.element);
										$.each(_vbtnlist, function (i, v) {
											if (typeof _btninfo[v] != "undefined") {
												var _$li = $("<li><span type='button'>" + _btninfo[v].title + "</span></li>").appendTo(_$ul)
												_$li.on("click", function () {
													_btninfo[v].click(_me, _me.element);
													_$qtdialog.close();
												});
											}
										});
									}
								});
							});

							if (_$btnarea.is("[data-btn-inlist]")) {
								var _btninlist = _$btnarea.attr("data-btn-inlist");
								if (_btninlist != "") {
									var _vbtninlist = _btninlist.split(",");
									var _buttons = $dwp.core.util.exObjList(_btninfo, _vbtninlist);
									$.each(_buttons, function (p, o) {
										if (o.hasOwnProperty("icon")) { o.icon = ""; }
									});
									$dwp.ui.button(_$btnarea, { buttons: _buttons, isedit: _me.options.isedit, data: [_instance, _me.element] });
									_$btnarea.show();
								}
							}
						} else {
							//console.log("btn")
							var buttons = $dwp.core.util.exObjList(_btninfo, _vbtnlist);
							//console.log("btn", buttons);
							$.each(buttons, function (p, o) {
								//console.log("aa", p);
								if (typeof o.click == "function") {
									$("div[name=btn-" + p + "]", _me.element).off("click").on("click", function () {
										$(this).prop("disabled", true);
										o.click.call(this, _me);
										$(this).prop("disabled", false);
									})
								}
							});
						}
					} else {
						$dwp.ui.button(_$btnarea, { buttons: $dwp.core.util.exObjList(_btninfo, _vbtnlist), data: [_instance, _me.element] });
					}
					/*
					$.each(_vbtnlist, function(i, v) {
						if ( typeof _btninfo[v] != "undefined") {
							_$btnwrap = $("<div class='dwp-btn'/>").appendTo(_$btnarea)
							_$btn = $("<button type='button'/>").appendTo(_$btnwrap).text(_btninfo[v].title);
							_$btn.on("click", function() {
								_btninfo[v].click(_instance, _me.element)
							});
						}
					});
					*/
				}
				// 상당고정,  접기 처리
				,
				_headerEtcProc: function (el) {
					console.log("headerEtcProc Start");
					var _me = this,
						_$right = $("div.dwp-page-heading div.right", _me.element),
						_h = "",
						_$fix;

					//상단고정 추가
					//if (_me.options.isedit) {
					//	_h = "<div class='dwp-checkbox'>";
					//	_h += "<label><input name='isTopFix' type='checkbox' value='1'><span>상단고정</span></label>";
					//	_h += "</div>";
					//	_$right.append(_h);
					//}

					//상단아이콘
					$.each(_me.options.iconbtn, function (i, v) {
						_me._addIconbtn(_$right, v);
					});
					//자동저장 문서 불러오기 기능 추가
					if (_me.options.isautosave && _me.options.isedit && !_me.options.ismobile) {
						_me._addIconbtn(_$right, "autosave");
					}

					if (_me.options.ismobile) {
						// 페이지 제목 설정하기
						var _title = $("div[name='page-title']", _me.element).text(),
							_$lnb = $("div.lnb-wrap", $dwp.core.mportal.lnbObj()),
							_$lnbBody = $("div.dwp-lnb-m", _$lnb),
							_lnbheader = _$lnbBody.data($dwp.core.mportal._CONST._DATA.LNB_HEADER);

						console.log("_lnbheader", _lnbheader);
						if (_lnbheader && _lnbheader.hasOwnProperty("ftitle")) {
							_title = _lnbheader.ftitle;
						}

						if (_me.options.isnew) {
							_title = $fn.getCodeMsg("comm.title.js003");
						}
						console.log("_lnbheader", _title);
						$(".dwp-header-m div.dwp-page-title", _me.element.parents(".dwp-mobile-area")).text($fn.getCurLangMsg(_title));
						console.log("ddd", $(".dwp-header-m div.dwp-page-title", _me.element.parents(".dwp-mobile-area")))



						// 뒤로 가기 버튼
						$(".dwp-header-m div.back", _me.element.parents(".dwp-mobile-area")).off("click").on("click", function () {
							$dwp.core.history.goback(-1);
						});

						// 생산직 문서공유하기 숨김
						if (dwpmo.info.app != "BWMH") {
							// 문서공유
							$("div[name='doc_shared']", _me.element).off("click").on("click", function () {
								_me._sharedDoc($(this));
							});
						} else {
							$("div[name='doc_shared']", _me.element).hide();
						}

						// 목록으로 가기
						//$("div.btn-list-m", "div.dwp-footer-m").off("click").on("click", function(){
						//	$dwp.core.history.goback(-90);
						//});

						if (!_me.options.isedit) {
							/*
							 모바일 Swipe 기능
							var _pninfo = _me._prevNextMPorc();
							if (_pninfo == null ) {

							} else {
								if ( _pninfo.hasOwnProperty("prev") ) {
									_me.element.on("swiperight", function(){
										var _url = _pninfo.prev.cdb + "/" + _pninfo.prev.formview + "/" + _pninfo.prev.unid + "?opendocument";
										$dwp.core.mportal.loadPage({link : _url, linktype : "PAGE", layer : "doc", subtype : "read"});
									})
								}
								if ( _pninfo.hasOwnProperty("next") ) {
									_me.element.on("swipeleft", function(){
										var _url = _pninfo.next.cdb + "/" + _pninfo.next.formview + "/" + _pninfo.next.unid + "?opendocument";
										$dwp.core.mportal.loadPage({link : _url, linktype : "PAGE", layer : "doc", subtype : "read"});
									})
								}
							}
							*/
						}
					}

					//접기 2020-09-14 By LHJ 옵션화
					var _isexpend = _me.options.isedit || _me.options.isexpend;	//기본 편집상태의 경우 표시함, 조회 상태의 경우 isexpend 설정에 따라 표시
					if (_isexpend) {
						_h = " <div class='dwp-btn dwp-btn-toggle'>";
						_h += "<span><img src='" + $dwp.core.getPath("weblib") + "/images/common/toggle-bg.png'><span>" + $fn.getCodeMsg("comm.title.js004") + "</span></span>";
						_h += "</div>";

						$(_h).appendTo(_$right).on("click", function (e) {
							var _$button = $(this).children(),
								_$closeArea = $(".dwp-section").filter(".close-area");

							$(this).toggleClass("active");
							if ($(this).hasClass("active")) {
								_$button.html(_$button.html().replace($fn.getCodeMsg("comm.title.js004"), $fn.getCodeMsg("comm.title.js005")));
								_$closeArea.hide();
							} else {
								_$button.html(_$button.html().replace($fn.getCodeMsg("comm.title.js005"), $fn.getCodeMsg("comm.title.js004")));
								_$closeArea.show();
							}

							e.preventDefault();
						});
					}

					if (_me.options.isedit) {
						/*
						_h = " <div class='dwp-btn dwp-btn-toggle'>";
						_h += "<span><img src='" + $dwp.core.getPath("weblib") + "/images/common/toggle-bg.png'><span>" + $fn.getCodeMsg("comm.title.js004") + "</span></span>";
						_h += "</div>";

						$(_h).appendTo(_$right).on("click", function(e){
							var _$button = $(this).children()
							,_$closeArea = $(".dwp-section").filter(".close-area");

							$(this).toggleClass("active");
							if ($(this).hasClass("active")) {
								_$button.html(_$button.html().replace($fn.getCodeMsg("comm.title.js004"), $fn.getCodeMsg("comm.title.js005")));
								_$closeArea.hide();
							} else {
								_$button.html(_$button.html().replace($fn.getCodeMsg("comm.title.js005"), $fn.getCodeMsg("comm.title.js004")));
								_$closeArea.show();
							}

							e.preventDefault();
						})
						*/
					} else {
						// 2019-12-01 By LHJ close area 제거 및 첨부파일 정보 표시
						if (_me.options.ismobile) {
							var _$already = $("#Already_Attach", _me.element),
								_olist = [];
							if (_$already.size() > 0) {
								_olist = $dwp.core.util.exFileMime(_$already.xval());
								if (_olist.length > 0) {
									$("div.mobile-attach-info", _me.element).show();
									$("div.mobile-attach-info > .num", _me.element).text(_olist.length);
								}
								$(".mobile-attach-info", _me.element).off("click").on("click", function () { //첨부 아이콘 클릭
									$("#attachments", _me.element).toggleClass("active");
								});
							}
						} else {
							$("div.btn-option-info", _me.element).off("click").on("click", function () {
								$(this).toggleClass("active");

								if (!$(this).hasClass("active")) {
									$(".close-area", _me.element).addClass("active");
								} else {
									$(".close-area", _me.element).removeClass("active");
								}
							});
						}
					}

				},
				_addIconbtn: function (_$right, id) {
					var _me = this,
						_$icon = null;

					if (_me.options.ispopup && id == "popup") return;

					_$icon = $("<div class='dwp-btn icon'><span></span></div>").appendTo(_$right).attr("data-icontype", id);

					function _getimg(id) {
						var _imgnm = "",
							_title = "";
						switch (id) {
							case "bookmark":
								_imgnm = "icon-bookmark.svg";
								_title = "Bookmark";
								break;
							case "link":
								_imgnm = "icon-link.svg";
								_title = "Share";
								break;
							case "print":
								_imgnm = "icon-print.svg";
								_title = "Print Preview";
								break;
							case "popup":
								_imgnm = "icon-blank.svg";
								_title = "Popup";
								break;
							case "xpdf":
								_imgnm = "icon-pdf.svg";
								_title = "PDF";
								break;
							case "autosave":
								_imgnm = "icon-restore.svg";
								_title = "AutoSave List";
								break;
						}
						return "<img src='" + $dwp.core.getPath("weblib") + "/images/common/" + _imgnm + "' title='" + _title + "'>";
					}

					function _reload(data) {
						console.log("data", data);
						if ($("input[name='Subject']", _me.element).size() > 0) {
							$("input[name='Subject']", _me.element).val(data.subject);
						}
						$dwp.ui.weditor.setDocBody(
							$("#bodyFld", _me.element), { cdb: _me.options.cdb, unid: data.unid, isnew: false, bodydata: _me.options.insertbody }, _me);
					}

					$("span", _$icon).html(_getimg(id));

					_$icon.on("click", function () {
						var _$target = $(this);
						if (id == "popup") {
							$dwp.core.util.winopen(_me.options.pathinfo.replace(/\&preview=1/gi, ""), "", {});
						} else if (id == "bookmark") {
							_me._addBookMark();
						} else if (id == "link") {
							_me._sharedDoc($(this));
						} else if (id == "print") {
							if (typeof _me.options.userprint == "function") {
								_me.options.userprint(_me);
							} else {
								_me.printDoc();
							}
						} else if (id == "xpdf") {
							function openPDF(_opt) {
								var ele_subject = null,
									pdfurl = "",
									pdftitle = "",
									__opt = $.extend({ params: "" }, _opt);
								pdfurl = "/xpdf?url=" + _me.options.pathinfo.replace(/\&preview=1/gi, "").replace(/&portal=1/gi, "");
								pdfurl += __opt.params;
								pdfurl += "&empno=" + $fn.getCurUser().pinfo.empno;

								ele_subject = $(".dwp-subject", _me.element);
								if (ele_subject.length == 1) {
									pdftitle = $.trim(ele_subject.text());
								} else {
									ele_subject = $(".subject", _me.element);
									if (ele_subject.length == 1) {
										pdftitle = $.trim(ele_subject.text());
									} else {
										ele_subject = $(".mail-subject", _me.element);
										if (ele_subject.length == 1) {
											pdftitle = $.trim(ele_subject.text());
										}
									}
								}
								pdfurl += (pdftitle != "" ? "&title=" + encodeURIComponent(pdftitle) : ""); //제목을 URL에 넘겨주면 PDF 상단 영역에 타이틀로 표시한다
								pdfurl += "&_=" + $.now();
								if (__opt.params.indexOf("&isattach=1") != -1) {
									$("#telInfoFrame").attr("src", pdfurl);
									$fn.toast({ msg: "PDF 다운로드 중입니다.<br>브라우저 하단 또는 다운로드 폴더를 확인하시기 바랍니다.", timeout: 3500 });
								} else {
									$dwp.core.util.winopen(pdfurl, "", { baseurl: false });
								}
							}
							if (typeof _me.options.userpdf == "function") {
								_me.options.userpdf(_me, openPDF);
							} else {
								openPDF({});
							}
						} else if (id == "autosave") {
							//var AutoUNID = $("input[name='AutoUNID']", _me.element).val();
							var AutoSave_Mode = _me.options.isnew ? "NEW" : "EDIT";
							var AutoSave_Form = $("form", _me.element).attr("name");
							if (AutoSave_Form == "_Reply" || AutoSave_Form == "_wForward") {
								AutoSave_Form = "_Memo";
							}
							//if (_me.options.isnew) {			// 사번_양식명으로 Data가 존재하는지 여부 체크
							_$$.util.xAjax({
								url: $fn.getProxyUrl(_me.options.cdb + "/api/data/collections/name/view_autosave?ps=20"),
								dataType: "json",
								async: false,
								cache: false,
								data: { category: $fn.getCurUser().pinfo.empno + "^" + AutoSave_Form }
							}).done(function (data) {
								if (data.length == 0) {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg064") });
									return false;
								}
								$dwp.ui.qtdialog.init(_$target, {
									qtid: "autosave_group",
									dialogClass: 'titleless dropdown-type-dialog',
									width: 400,
									position: { my: "left top", at: "left bottom", collision: "flipfit" },
									initcallback: function (_$qtdialog) {
										var _$ul = $("<ul class='dwp-option-list'></ul>").appendTo(_$qtdialog.element);
										$.each(data, function (_p, _o) {
											var _$btn = $("<li><span type='button'><span style='display:inline-block;width:65%;padding:0 5px 0 0;text-overflow:ellipsis;overflow:hidden;'>" + _o._subject + "</span><span style='display:inline-block;padding:0px;overflow:hidden;width:130px;'>[" + $fn.formatDateTime(_o._created) + "]" + "</span></span></li>").appendTo(_$ul);
											_$btn.off("click").on("click", function () {
												_reload({ subject: _o._subject, unid: _o["@unid"] });
												_$qtdialog.close();
											});
										});
									}
								});
							})
							//}
							/*
							else if (_me.options.isedit) {	// AutoUNID 값으로 해당 문서가 있는 경우 Data를 가져옴
								_$$.util.xAjax({
									url : $fn.getProxyUrl(_me.options.cdb + "/api/data/collections/name/view_autosave?ps=10")
									,dataType : "json"
									,async : false
									,cache : false
									,data : {category : _me.options.unid}
								}).done(function(data){
									if (data.length == 0) {
										$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg064")});
										return false;
									}
									$fn.confirm({msg : $fn.getCodeMsg("comm.msg.msg065")})
									.done(function() {
										_reload({subject : data[0]._subject, unid : data[0]["@unid"]});
									});
								})
							}
							*/
						} else {
							//alert($(this).attr("data-icontype"));
							$fn.alert({ msg: "coming soon ..." });
						}
					});
				},
				// 문서공유하기
				_sharedDoc: function (o) {
					var _me = this,
						_bookobj = {},
						_bookinfo = "";

					_bookobj.Type = "0";
					_bookobj.ApplCode = _me.options.applcode;
					_bookobj.R_UNID = _me.options.unid;
					_bookobj.R_KEY_UNID = _me.options.key_unid;
					_bookobj.R_DBPATH = _me.options.cdb;
					_bookobj.R_LINK = (_me.options.hasOwnProperty("bookmarkurl") && _me.options.bookmarkurl != "" ? _me.options.bookmarkurl : "");
					_bookobj.B_UNID = "";
					_bookobj.B_DBPATH = "";

					_bookinfo = _$$.util.getObjStr(_$$.doc._CONST.BOOKMARK_MAP, _bookobj, "`}").fullinfo;

					$dwp.ui.shareddoc(o, { bookinfo: _bookinfo, ismobile: _me.options.ismobile, svrnm: _me.options.sysinfo.svrnm });
				},
				// BookMark 추가하기
				_addBookMark: function () {
					var _me = this,
						_bookobj = {},
						_bookinfo = "";

					_bookobj.Type = "0";
					_bookobj.ApplCode = _me.options.applcode;
					_bookobj.R_UNID = _me.options.unid;
					_bookobj.R_KEY_UNID = _me.options.key_unid;
					_bookobj.R_DBPATH = _me.options.cdb;
					_bookobj.R_LINK = (_me.options.hasOwnProperty("bookmarkurl") && _me.options.bookmarkurl != "" ? _me.options.bookmarkurl : "");
					_bookobj.B_UNID = "";
					_bookobj.B_DBPATH = "";

					_bookinfo = _$$.util.getObjStr(_$$.doc._CONST.BOOKMARK_MAP, _bookobj, "`}").fullinfo;
					//console.log("bookinfo", _bookinfo);
					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl($fn.getPath("bookmark") + '/wfrmbook_post?createdocument'), {
						actiontype: "MY",
						r_svr: _me.options.sysinfo.svrnm,
						postdata: _bookinfo
					},
						function (data) {
							// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg022") });
								} else {
									if (data.msgcode == "double") {
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg066") });
									}
								}
							} else {
								//error
							}
						}, 'json'
					)
				},
				_headerProc: function () {
					console.log("headerProc Start")
					var _me = this,
						_$el = $("div.dwp-page-heading", _me.element);

					if (_me.options.ispreview) {
						//_$el.css({"margin": "0px"});
						$("div.dwp-page-title", _$el).hide();
						$("div.dwp-breadcrumbs", _$el).hide();
						$("div.aligner", _$el).attr("data-top", "xs");
					}

					_me._btnProc();

					// Event 처리필요 (상단고정, 접기처리)

					_me._headerEtcProc();

				},
				setDocBody: function () {
					var _me = this;

					if (!_me.options.isedit) return;

					$dwp.ui.weditor.setDocBody(
						$("#bodyFld", _me.element), {
						cdb: _me.options.cdb,
						unid: _me.options.unid,
						isnew: _me.options.isnew,
						bodydata: _me.options.insertbody,
						callback: function (ed) {
							_me.options._isloading = true;
							if (typeof _me.options.insertbodyCallback == "function") {
								_me.options.insertbodyCallback(ed);
							}
							console.log("inst", _me.options._isloading)
						}
					}, _me);
				},
				_bodyProc: function () {
					console.log("bodyProc Start")
					var _me = this;

					if (_me.options.isedit) {
						$dwp.ui.datepicker(_me.element, {});
					} else {
						//	$("[data-type='profile']", _me.element).each(function(){
						//		console.log('aaa')
						//		$dwp.ui.bizcard.init($(this));
						//	});
					}

					// WebBody 처리
					if ($("#bodyFld", _me.element).size() > 0) {
						if (_me.options.isedit) {
							if (_me.options.ismobile) {
								$("div[name=insert_editor_img]", _me.element).off("click").on("click", function () {
									if (navigator.camera) {
										navigator.camera.getPicture(onSuccess, onFail, {
											quality: 50,
											sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
											destinationType: Camera.DestinationType.DATA_URL
										});

										function onSuccess(imageData) {
											var _image = "<img src='data:image/jpeg;base64," + imageData + "' style='width:100%;'>";
											//$dwp.ui.weditor.setFocus(_me.element);
											//$($dwp.ui.weditor.getDom(_me.element)).focus();
											$dwp.ui.weditor.pasteHtmlAtCaret(_image, _me.element);
										}

										function onFail(message) {
											//alert('Failed because: ' + message);
										}
									}
								});


								$("div[name=insert_editor_vod]", _me.element).off("click").on("click", function () {
									var _ed = $dwp.ui.weditor.getDom(_me.element);
									$(_ed).getCursorPosition();
									_ed.blur();
									$fn.openMediaUpload(function (o) {
										var _h = "<iframe name='dwp_media' src='" + dwpmo.info.protocol + dwpmo.info.domain + o.playerurl + "' fileid='" + o.fileid + "' frameborder='0' allowfullscreen=true style='width:100%;height:360px' ></iframe>";
										$(_ed).setCursorPosition(_h);
									}, { ismobile: _me.options.ismobile });
								});

								_me.setDocBody();	//모바일에서 임시저장 시 본문 안보이는 오류 FIX by LHJ
							}
							// 편집 시, 로딩처리를 에디터 로딩 완료 시 처리하도록 변경
							//_me.setDocBody();
							/*
							$dwp.ui.weditor.setDocBody(
								$("#bodyFld", _me.element)
									,{cdb : _me.options.cdb
									, unid : _me.options.unid
									, isnew : _me.options.isnew
									, bodydata : _me.options.insertbody
									, callback : function(ed){
										_me.options._isloading = true;
										console.log("inst", _me.options._isloading)
									}
								}, _me);
							*/
						} else {
							if (_me.options.bodyframe) {
								$dwp.ui.weditor.getDocBodyFrame($("#bodyFld", _me.element), {
									cdb: _me.options.cdb,
									unid: _me.options.unid,
									hideimg: _me.options.hideimg,
									ismobile: _me.options.ismobile,
									callback: _me.options.getbodycallback
								}, _me);
							} else {
								$dwp.ui.weditor.getDocBody($("#bodyFld", _me.element), {
									cdb: _me.options.cdb,
									unid: _me.options.unid,
									hideimg: _me.options.hideimg,
									ismobile: _me.options.ismobile,
									callback: _me.options.getbodycallback
								}, _me);
							}
						}
					}

					_me._attachProc();

					_me._attachImgProc();

					_me._cateProc();

					if (_me.options.ismobile) {
						_me._bookmarkMProc();
					} else {
						_me._bookmarkProc();
					}
					console.log("bodyProc End")
				},
				_bookmarkMProc: function () {
					console.log("bookmarkMProc Start");
					var _me = this,
						_$bookmark = $("div[name='bookmark']", _me.element),
						_$bodylist = $("div.bookmark-list", _$bookmark),
						_$inp = $("input[name='BookMarks']", _$bookmark),
						_$num = $("span.num", _$bookmark);

					if (_$bookmark.size() == 0) return;

					function _resetVal() {
						var _rtn = [];
						$("div.item", _$bodylist).each(function () {
							var _o = $(this).data("_ROW_DATA");
							//console.log("t", _o)
							_rtn.push(_$$.util.getObjStr(_$$.doc._CONST.BOOKMARK_SAVE, _o, "`}").fullinfo);
						})

						if (_rtn.length > 0) {
							_$inp.val(_rtn.join(";"));
						} else {
							_$inp.val("");
						}
					}

					function _dblcheck(o) {
						var _rtn = false;
						$("div.item", _$bodylist).each(function () {
							var _o = $(this).data("_ROW_DATA");
							if (o._runid == _o._runid && o._rdbpath == _o._rdbpath) { _rtn = true; return false; }
							/*
							if (o._link != "") {
								if (o._link == _o._link) {_rtn = true; return false;}
							} else if (o._r_link != "") {
								if (o._r_link == _o._r_link) {_rtn = true; return false;}
							} else {
								if (o._runid == _o._runid && o._rdbpath == _o._rdbpath){ _rtn = true; return false;}
							}
							*/
						});
						return _rtn;
					}

					function _open(o) {
						var _url = "",
							_link = "";
						if (o.hasOwnProperty("_link") && o._link !== "") {
							// 외부 및 사용자 입력 한 북마크
							_link = o._link;
							_link = _link.toLowerCase();
							if (_link.indexOf("http://") > -1 || _link.indexOf("https://") > -1) {
								_url = o._link;
							} else {
								_url = "http://" + o._link;
							}
							$dwp.core.mportal.WinPopEx(_url);
							//$fn.winopenExt( _url , "Book Mark", {}) ;
						} else {
							// 내부 북마크 문서
							if (o._applcode == "aprv") {
								/*
								$fn.xAjax({
									url : o._r_link
									,dataType : "json"
									,async : false
									,cache : false
								}).done(function(data){
									if(data["@unid"] == "" || !data.hasOwnProperty("DocKey") || !data.hasOwnProperty("InDBPath")) {
										$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg057")});return;
									}
									if (_me.options.ismobile) {
										_url  = "/" + data.InDBPath.replace(/\\/g, "/") + "/wvopen_mo/" + data.DocKey + "?opendocument"
									} else {
										_url  = "/" + data.InDBPath.replace(/\\/g, "/") + "/vdockey/" + data.DocKey + "?opendocument";
									}
								});
								*/
								//console.log("o", o);
								$fn.xAjax({
									url: o._rdbpath + "/wAgCmdGetProcess?openagent",
									dataType: "json",
									async: false,
									cache: false,
									data: { actiontype: "linkurl", Unid: o._runid }
								}).done(function (data) {
									if (data.result == "200" && data.linkurl != "null") {
										if (data.permission != "H0") {
											if (_me.options.ismobile) {
												_url = o._rdbpath.replace(/\\/g, "/") + "/wvopen_mo/" + o._runid + "?opendocument"
											} else {
												_url = o._rdbpath.replace(/\\/g, "/") + "/vdockey/" + o._runid + "?opendocument";
											}
										} else {
											$fn.xAjax({
												url: data.linkurl,
												dataType: "json",
												async: false,
												cache: false
											}).done(function (jdata) {
												if (jdata["@unid"] == "" || !jdata.hasOwnProperty("DocKey") || !jdata.hasOwnProperty("InDBPath")) {
													$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg057") });
													return;
												}
												if (_me.options.ismobile) {
													_url = "/" + jdata.InDBPath.replace(/\\/g, "/") + "/wvopen_mo/" + jdata.DocKey + "?opendocument"
												} else {
													_url = "/" + jdata.InDBPath.replace(/\\/g, "/") + "/vdockey/" + jdata.DocKey + "?opendocument";
												}
											});
										}
									} else {
										$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
										return;
									}
								});
							} else if (o._applcode == "aprvone") {
								if (o._rdbpath.indexOf("dwp/aprv/") == 0) {
									o._rdbpath = o._rdbpath.replace("dwp/aprv/", "");
								}
								$fn.xAjax({
									url: "/" + o._rdbpath + "/wAgCmdGetProcess?openagent",
									dataType: "json",
									async: false,
									cache: false,
									data: { actiontype: "newlinkurl", Unid: o._runid }
								}).done(function (rdata) {
									$fn.xAjax({
										url: "/" + rdata._rdbpath + "/wAgCmdGetProcess?openagent",
										dataType: "json",
										async: false,
										cache: false,
										data: { actiontype: "linkurl", Unid: o._runid }
									}).done(function (data) {
										if (data.result == "200" && data.linkurl != "null") {
											if (data.permission != "H0") {
												if (_me.options.ismobile) {
													_url = "/" + data._rdbpath.replace(/\\/g, "/") + "/wvopen_mo/" + data._rdockey + "?opendocument"
												} else {
													_url = "/" + data._rdbpath.replace(/\\/g, "/") + "/vdockey/" + data._rdockey + "?opendocument";
												}
											} else {
												$fn.xAjax({
													url: data.linkurl,
													dataType: "json",
													async: false,
													cache: false
												}).done(function (jdata) {
													if (jdata["@unid"] == "" || !jdata.hasOwnProperty("DocKey") || !jdata.hasOwnProperty("InDBPath")) {
														$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg057") });
														return;
													}
													if (_me.options.ismobile) {
														_url = "/" + jdata.InDBPath.replace(/\\/g, "/") + "/wvopen_mo/" + jdata.DocKey + "?opendocument"
													} else {
														_url = "/" + jdata.InDBPath.replace(/\\/g, "/") + "/vdockey/" + jdata.DocKey + "?opendocument";
													}
												});
											}
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
											return;
										}
									});
								});
							} else {
								if (o.hasOwnProperty("_r_link") && o._r_link != "") {
									_url = o._r_link;
								} else {
									if (_me.options.ismobile) {
										_url = o._rdbpath + "/wvopen_mo/" + o._runid + "?opendocument"
									} else {
										_url = o._rdbpath + "/0/" + o._runid + "?opendocument";
									}
								}
							}
							_url = _url + "&isattdoc=1&ismobile=" + (_me.options.ismobile ? "1" : "0");
							//$dwp.core.util.layerOpenDocument({content : {url : $fn.getProxyUrl(_url)}});
							$fn.layerOpenDocument({ ismobile: true, istop: true, width: "100%", height: "auto", title: o._subject, content: { url: $fn.getProxyUrl(_url) } });
						}
					}

					function _addItem(o) {
						if (_dblcheck(o)) return;
						var _h = "",
							_$row = $("<div class='item dwp-cursor'></div>").appendTo(_$bodylist);
						_$row.data("_ROW_DATA", o);

						var _category = $fn.getCurLangMsg(o._category);
						_h += "<div class='file'>" + (o._type == "1" ? $fn.getCodeMsg("comm.title.out") : $fn.getCodeMsg("comm.title.in")) + "</div>"
						_h += "<div class='file'>" + (_category != "" ? "<span class='dwp-tag'>" + _category + "</span>" : "") + o._subject + "</div>";
						_h += "<div class='btn-close'><a><img src='" + $fn.getPath('weblib') + "/images/common/icon-close.svg'></a></div>"

						_$row.append(_h);

						$("div.file", _$row).off("click").on("click", function () {
							_open(o);
							//var _url = o._rdbpath + "/wvopen_mo/" + o._runid + "?opendocument"
							//$dwp.core.util.layerOpenDocument({ismobile : true, istop : true, width: "100%", height:"auto", title : o._subject, content : {url : $fn.getProxyUrl(_url)}});
						});
						$("div.btn-close", _$row).off("click").on("click", function () {
							$(this).parent().remove();
							_resetVal();
							_$num.text($("div.item", _$bodylist).size());
						});

						_resetVal();
					}

					function _readItem(o) {
						var _h = "",
							_$row = $("<div class='bookmark-item dwp-cursor'></div>").appendTo(_$bodylist);
						_$row.data("_ROW_DATA", o);

						var _category = $fn.getCurLangMsg(o._category);
						_h = "<a class='text'>";
						_h += "<span class='cate'>" + (o._type == "1" ? $fn.getCodeMsg("comm.title.out") : $fn.getCodeMsg("comm.title.in")) + "</sapn>"
						_h += "<span class='subject ellipsis'>" + (_category != "" ? "<span class='dwp-tag'>" + _category + "</span>" : "") + o._subject + "</span>";
						_h += "</a>";

						_$row.append(_h);

						_$row.off("click").on("click", function () {
							_open(o);
							//var _url = o._rdbpath + "/wvopen_mo/" + o._runid + "?opendocument"
							//$dwp.core.util.layerOpenDocument({
							//	ismobile : true, istop : true, width: "100%", height:"auto", title : o._subject, content : {url : $fn.getProxyUrl(_url)}});
						});
					}

					function _initload() {
						console.log("bookmark init");
						var _v = _$inp.val();
						if (_v == "") return;
						var _list = _$inp.val().split(";");

						$.each(_list, function (i, v) {
							var _o = _$$.util.getObjStr(_$$.doc._CONST.BOOKMARK_SAVE, v, "`}");
							if (_me.options.isedit) {
								_addItem(_o);
							} else {
								_readItem(_o);
							}
						});
					}

					if (_me.options.isedit) {
						$("div.btn-plus", _$bookmark).off("click").on("click", function () {
							$dwp.ui.dialog.init(null, {
								title: $fn.getCodeMsg("comm.title.js006"),
								ismobile: true,
								modal: true,
								istop: true,
								width: "100%",
								content: { url: $fn.getPath("bookmark") + "/wFrmView_Sel_mo?ReadForm", data: { view: "bkm_created_des", single: $fn.getCurUser().pinfo.empno + "^all", count: 10 } },
								confirm: function (_$dialog) {
									var element = _$dialog.element.view("instance");
									//console.log(element.getChecked());
									$.each(element.getChecked(), function (i, o) {
										_addItem(o);
									});
									_$num.text($("div.item", _$bodylist).size());
									_$dialog.close();
								}
							});
						});

						// 전체 선택박스 체크 시
						$("input[type='checkbox'].dwp-check-all", _$bookmark).off("click").on("click", function () {
							if ($(this).is(":checked")) {
								$("input[type='checkbox'].dwp-chk", _$bodylist).prop("checked", true);
							} else {
								$("input[type='checkbox'].dwp-chk", _$bodylist).prop("checked", false);
							}
						});
					}

					_initload();
					console.log("bookmarkMProc End");
				},
				_bookmarkProc: function () {
					var _me = this,
						_$bookmark = $("div[name='bookmark']", _me.element),
						_$bodylist = $("div.dwp-table-body", _$bookmark),
						_$rbodylist = $("div.bookmark-list", _$bookmark),
						_$inp = $("input[name='BookMarks']", _$bookmark);

					if (_$bookmark.size() == 0) return;

					function _resetVal() {
						var _rtn = [];
						$("div.dwp-row", _$bodylist).each(function () {
							var _o = $(this).data("_ROW_DATA");
							//console.log("t", _o)
							_rtn.push(_$$.util.getObjStr(_$$.doc._CONST.BOOKMARK_SAVE, _o, "`}").fullinfo);
						})

						if (_rtn.length > 0) {
							_$inp.val(_rtn.join(";"));
						} else {
							_$inp.val("");
						}
					}

					function _dblcheck(o) {
						var _rtn = false;
						$("div.dwp-row", _$bodylist).each(function () {
							var _o = $(this).data("_ROW_DATA");
							if (o._runid == _o._runid && o._rdbpath == _o._rdbpath) { _rtn = true; return false; }
							/*
							if (o._link != "") {
								if (o._link == _o._link) {_rtn = true; return false;}
							} else if (o._r_link != "") {
								if (o._r_link == _o._r_link) {_rtn = true; return false;}
							} else {
								if (o._runid == _o._runid && o._rdbpath == _o._rdbpath){ _rtn = true; return false;}
							}
							*/
						});
						return _rtn;
					}

					function _open(o) {
						var _url = "",
							_link = "";
						if (o.hasOwnProperty("_link") && o._link !== "") {
							// 외부 및 사용자 입력 한 북마크
							_link = o._link;
							_link = _link.toLowerCase();
							if (_link.indexOf("http://") > -1 || _link.indexOf("https://") > -1) {
								_url = o._link;
							} else {
								_url = "http://" + o._link;
							}
							$fn.winopenExt(_url, "Book Mark", {});
						} else {
							// 내부 북마크 문서
							if (o._applcode == "aprv") {
								/*
								$fn.xAjax({
									url : o._r_link
									,dataType : "json"
									,async : false
									,cache : false
								}).done(function(data){
									if(data["@unid"] == "" || !data.hasOwnProperty("DocKey") || !data.hasOwnProperty("InDBPath")) {
										$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg057")});
										return;
									}
									if (_me.options.ismobile) {
										_url  = "/" + data.InDBPath.replace(/\\/g, "/") + "/wvopen_mo/" + data.DocKey + "?opendocument"
									} else {
										_url  = "/" + data.InDBPath.replace(/\\/g, "/") + "/vdockey/" + data.DocKey + "?opendocument";
									}
								});
								*/
								$fn.xAjax({
									url: o._rdbpath + "/wAgCmdGetProcess?openagent",
									dataType: "json",
									async: false,
									cache: false,
									data: { actiontype: "linkurl", Unid: o._runid }
								}).done(function (data) {
									if (data.result == "200" && data.linkurl != "null") {
										if (data.permission != "H0") {
											if (_me.options.ismobile) {
												_url = o._rdbpath.replace(/\\/g, "/") + "/wvopen_mo/" + o._runid + "?opendocument"
											} else {
												_url = o._rdbpath.replace(/\\/g, "/") + "/vdockey/" + o._runid + "?opendocument";
											}
										} else {
											$fn.xAjax({
												url: data.linkurl,
												dataType: "json",
												async: false,
												cache: false
											}).done(function (jdata) {
												if (jdata["@unid"] == "" || !jdata.hasOwnProperty("DocKey") || !jdata.hasOwnProperty("InDBPath")) {
													//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg057")});return;
													$fn.confirm({ msg: $fn.getCodeMsg("comm.title.aprv8") })
														.done(function () {
															var _opt = {
																width: "500",
																height: "300",
																data: { dbpath: o._rdbpath.replace(/\\/g, "/").substr(1, o._rdbpath.length), dockey: o._runid }
															};
															console.log("_opt", _opt);
															$dwp.core.util.readrequestprocess(_opt);
														});
													return;
												}
												if (_me.options.ismobile) {
													_url = "/" + jdata.InDBPath.replace(/\\/g, "/") + "/wvopen_mo/" + jdata.DocKey + "?opendocument"
												} else {
													_url = "/" + jdata.InDBPath.replace(/\\/g, "/") + "/vdockey/" + jdata.DocKey + "?opendocument";
												}
											});
										}
									} else {
										$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
										return;
									}
								});
							} else if (o._applcode == "aprvone") {
								if (o._rdbpath.indexOf("dwp/aprv/") == 0) {
									o._rdbpath = o._rdbpath.replace("dwp/aprv/", "");
								}
								$fn.xAjax({
									url: "/" + o._rdbpath + "/wAgCmdGetProcess?openagent",
									dataType: "json",
									async: false,
									cache: false,
									data: { actiontype: "newlinkurl", Unid: o._runid }
								}).done(function (rdata) {
									$fn.xAjax({
										url: "/" + rdata._rdbpath + "/wAgCmdGetProcess?openagent",
										dataType: "json",
										async: false,
										cache: false,
										data: { actiontype: "linkurl", Unid: o._runid }
									}).done(function (data) {
										if (data.result == "200" && data.linkurl != "null") {
											if (data.permission != "H0") {
												if (_me.options.ismobile) {
													_url = "/" + data._rdbpath.replace(/\\/g, "/") + "/wvopen_mo/" + data._rdockey + "?opendocument"
												} else {
													_url = "/" + data._rdbpath.replace(/\\/g, "/") + "/vdockey/" + data._rdockey + "?opendocument";
												}
											} else {
												$fn.xAjax({
													url: data.linkurl,
													dataType: "json",
													async: false,
													cache: false
												}).done(function (jdata) {
													if (jdata["@unid"] == "" || !jdata.hasOwnProperty("DocKey") || !jdata.hasOwnProperty("InDBPath")) {
														//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg057")});return;
														$fn.confirm({ msg: $fn.getCodeMsg("comm.title.aprv8") })
															.done(function () {
																var _opt = {
																	width: "500",
																	height: "300",
																	data: { dbpath: data._rdbpath.replace(/\\/g, "/"), dockey: data._rdockey }
																};
																console.log("_opt", _opt);
																$dwp.core.util.readrequestprocess(_opt);
															});
														return;
													}
													if (_me.options.ismobile) {
														_url = "/" + jdata.InDBPath.replace(/\\/g, "/") + "/wvopen_mo/" + jdata.DocKey + "?opendocument"
													} else {
														_url = "/" + jdata.InDBPath.replace(/\\/g, "/") + "/vdockey/" + jdata.DocKey + "?opendocument";
													}
												});
											}
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
											return;
										}
									});
								});
							} else {
								if (o.hasOwnProperty("_r_link") && o._r_link != "") {
									_url = o._r_link;
								} else {
									if (_me.options.ismobile) {
										_url = o._rdbpath + "/wvopen_mo/" + o._runid + "?opendocument"
									} else {
										_url = o._rdbpath + "/0/" + o._runid + "?opendocument";
									}
								}
							}
							if (_url != "") {
								_url = _url + "&isattdoc=1&ismobile=" + (_me.options.ismobile ? "1" : "0");
								$dwp.core.util.layerOpenDocument({ content: { url: $fn.getProxyUrl(_url) } });
							}
						}
					}

					function _addItem(o) {
						if (_dblcheck(o)) return;
						var _h = "",
							_$row = $("<div class='dwp-row dwp-cursor'></div>").appendTo(_$bodylist);
						_$row.data("_ROW_DATA", o);

						var _category = $fn.getCurLangMsg(o._category);

						_h = "<div class='dwp-cell'><div class='dwp-checkbox textless'><label>";
						_h += "<input type='checkbox' class='dwp-chk'><span></span>";
						_h += "</label></div></div>";

						_h += "<div class='dwp-cell'>" + (o._type == "1" ? $fn.getCodeMsg("comm.title.out") : $fn.getCodeMsg("comm.title.in")) + "</div>"
						_h += "<div class='dwp-cell'>" + (_category != "" ? "<span class='dwp-tag'>" + _category + "</span>" : "") + o._subject + "</div>"

						_$row.append(_h);

						$(".dwp-cell", _$row).not(":eq(0)").off("click").on("click", function () {
							_open(o);
						});

						_resetVal();
					}

					function _readItem(o) {
						var _h = "",
							_$row = $("<div class='bookmark-item dwp-cursor'></div>").appendTo(_$rbodylist);

						_$row.data("_ROW_DATA", o);
						var _category = $fn.getCurLangMsg(o._category);

						_h = "<a class='text'>";
						_h += "<span class='cate'>" + (o._type == "1" ? $fn.getCodeMsg("comm.title.out") : $fn.getCodeMsg("comm.title.in")) + "</span>";
						_h += "<span class='subject ellipsis'>" + (_category != "" ? "<span class='dwp-tag'>" + _category + "</span>" : "") + o._subject + "</span>";
						_h += "</a>";

						_$row.append(_h);

						_$row.off("click").on("click", function () {
							_open(o);
							//var _url = o._rdbpath + "/0/" + o._runid + "?opendocument"
							//$dwp.core.util.layerOpenDocument({content : {url : $fn.getProxyUrl(_url)}});
						});
					}

					function _initload() {
						var _v = _$inp.val();
						if (_v == "") return;
						var _list = _$inp.val().split(";");

						$.each(_list, function (i, v) {
							var _o = _$$.util.getObjStr(_$$.doc._CONST.BOOKMARK_SAVE, v, "`}");
							if (_me.options.isedit) {
								_addItem(_o);
							} else {
								_readItem(_o);
							}
						});
					}

					if (_me.options.isedit) {
						$dwp.ui.button($("div.left.button", _$bookmark), {
							buttons: [{
								title: $fn.getCodeMsg("comm.title.js006"),
								click: function () {
									$dwp.ui.dialog.init(null, {
										title: $fn.getCodeMsg("comm.title.js006"),
										width: 800,
										height: 640,
										modal: true,
										hide: { effect: "fade", duration: 300 },
										show: { effect: "fade", duration: 300 },
										content: { url: $fn.getPath("bookmark") + "/wFrmView_Sel?ReadForm", data: { view: "bkm_created_des", single: $fn.getCurUser().pinfo.empno + "^all", count: 10, iscategory: true } }
										//,content : {html : ""}
										,
										buttons: [{
											title: $fn.getCodeMsg("comm.btn.confirm"),
											click: function (_$dialog) {
												var element = _$dialog.element.view("instance");
												$.each(element.getChecked(), function (i, o) {
													_addItem(o);
												})
												_$dialog.close();
											}
										}, {
											title: $fn.getCodeMsg("comm.btn.cancel"),
											click: function (_$dialog) {
												_$dialog.close();
											}
										}]
									});
								}
							}, {
								title: $fn.getCodeMsg("comm.btn.deldoc"),
								click: function () {
									var _$checked = $("input[type='checkbox'].dwp-chk:checked", _$bodylist);

									if (_$checked.size() == 0) return;

									$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg023") })
										.done(function () {
											//alert(_$checked.size());
											_$checked.parents("div.dwp-row").remove();
											$("input[type='checkbox'].dwp-check-all", _$bookmark).prop("checked", false);
											_resetVal();
										});
								}
							}]
						});

						// 전체 선택박스 체크 시
						$("input[type='checkbox'].dwp-check-all", _$bookmark).off("click").on("click", function () {
							if ($(this).is(":checked")) {
								$("input[type='checkbox'].dwp-chk", _$bodylist).prop("checked", true);
							} else {
								$("input[type='checkbox'].dwp-chk", _$bodylist).prop("checked", false);
							}
						});
					}

					_initload();

				},
				_cateProc: function () {
					var _me = this,
						_$category = $("[data-type='category']", _me.element),
						_h = "",
						_fnm = "",
						_fnm_txt = "",
						_$inc = $("input[name='Category']", _me.element),
						_vlist = [];

					if (_$category.size() == 0) return;

					if (!(_me.options.isedit || _me.options.islangedit)) return;

					_fnm = _$category.attr("data-fnm")
					_fnm_txt = _fnm + "_Nm"

					if (_$inc.val() != "") {
						_vlist = _$inc.val().split(";");
					}

					function _makeCate(data, lvl, notall) {
						var _$div = $("<div/>").appendTo(_$category),
							__$div = $("<div class='dwp-selectbox md'>").appendTo(_$div),
							_$select = $("<select>").appendTo(__$div),
							_issub = false,
							_data = [],
							_$sselect = null;

						if (_me.options.ismobile) __$div.addClass("expended");

						// 2020-07-21 By LHJ ADD 전체 추가 옵션처리
						if (typeof notall != "undefined" && notall) { } else {
							$("<option/>").appendTo(_$select)
								.text($fn.getCodeMsg("comm.title.searchall")).val("");
						}

						$.each(data, function (i, o) {
							var _$opt = $("<option/>").appendTo(_$select)
								.attr("data-xlang-txt", o.title).text(_$$.lang.getCurMsg(o.title)).val(o.val);

							if (typeof _vlist[lvl - 1] != "undefined" && $.trim(_vlist[lvl - 1]) == o.val) {
								_$opt.attr("selected", "true");
								if (o.children) {
									_data = o.children;
								}
							}
							if (o.children) {
								_$opt.data("_CHILD", o.children);
							}
							//if (o.children) {_issub = true;}
						});

						if (_me.options.category.lvl > lvl) {
							_$sselect = _makeCate(_data, ++lvl, notall);
						}

						_$select.on("change", function () {
							var _$opt = $("option:selected", this);

							if (_$sselect) {
								_$sselect.empty();
							}
							$("<option/>").appendTo(_$sselect)
								.text($fn.getCodeMsg("comm.title.searchall")).val("");

							if ($.hasData(_$opt[0])) {
								var _o = _$opt.data("_CHILD");
								$.each(_o, function (i, o) {
									var __$opt = $("<option/>").appendTo(_$sselect)
										.attr("data-xlang-txt", o.title).text(_$$.lang.getCurMsg(o.title)).val(o.val);

									if (o.children) {
										__$opt.data("_CHILD", o.children);
									}
								});
							}
							if (_$sselect) {
								_$sselect.trigger("change");
							}

							var _val = [],
								_nm = [];
							$("select", _$category).each(function () {
								_val.push($(this).val());
								_nm.push($("option:selected", this).attr("data-xlang-txt"));
							});

							$("input[name='" + _fnm + "']", _me.element).val(_val.join(";"));
							$("input[name='" + _fnm_txt + "']", _me.element).val(_nm.join(";"));
						});

						return _$select;
					}
					// category 처리
					if (typeof _me.options.category == "object") {
						_makeCate(_me.options.category.data, 1, _me.options.category.notall)

					} else if (typeof this.options.category.data == "function") {
						_makeCate(_me.options.category.data(), 1, _me.options.category.notall)
						//var _$div = $("<div/>").appendTo(_$category);
						//_$div.html(this.options.category.data());
					}
				},
				_sortFindFile: function (key, list) {
					var _me = this,
						rtn = null;

					$.each(list, function (i, v) {
						if (key == v.name) { rtn = v; return false; }
					});
					return rtn;
				},
				_attachProc: function () {
					console.log("attachProc Start")
					var _me = this,
						_$already = null;

					if (!_me.options.attach.isattach) return;

					if ($("#attachments", _me.element).size() == 0) return;

					_$already = $("#Already_Attach", _me.element);

					if (_me.options.attach.type == "R") {
						if (!_me.options.isedit && _$already.val() == "") return;
						if (_$already.val() != "") {
							try {
								var _olist = $.parseJSON(_$already.val());
								_olist = $dwp.core.util.exFileMime(_olist);
								_me.options.attach.dataset = _olist;
							} catch (e) { }
						}
					} else {
						if (!_me.options.isedit && _$already.val() == "") return;
						if (_$already.val() != "") {
							try {
								var _olist = $.parseJSON(_$already.val()),
									_$sortfiles = $("#Multi_Attach_SortFiles", _me.element);

								// File MIME 제외 처리
								_olist = $dwp.core.util.exFileMime(_olist);

								if (_$sortfiles.size() > 0 && _$sortfiles.val() != "") {
									var _sortlist = _$sortfiles.val().split(";"),
										_nlist = [];
									if (_sortlist.length == _olist.length) {
										$.each(_sortlist, function (i, v) {
											var o = _me._sortFindFile(v, _olist);
											if (o != null) {
												_nlist.push(o);
											}
										});
										if (_nlist.length == _olist.length) {
											_me.options.attach.dataset = _nlist;
										} else {
											_me.options.attach.dataset = _olist;
										}
									} else {
										_me.options.attach.dataset = _olist;
									}
								} else {
									_me.options.attach.dataset = _olist;
								}
							} catch (e) { }
							//_me.options.attach.dataset = $.parseJSON(_$already.val());
						}
					}

					// 기본 파일 업로드 서블릿 경로 설정
					if (!_me.options.attach.hasOwnProperty("attach_url") || _me.options.attach.attach_url == "") {
						//_me.options.attach.attach_url = "/servlet/" + $fn.getName(_me.options.sysinfo.svrnm).cn.toLowerCase() + "/fileupload?enctype=utf-8&sfolder="
						_me.options.attach.attach_url = "/servlet/" + $fn.getName(_me.options.sysinfo.svrnm).cn + "/fileupload?enctype=utf-8&sfolder="
					}

					if (_me.options.isedit) {
						var _delo = $('#Multi_Attach_DeleteFile', _me.element);
						if (_delo.size() > 0) { _delo.val(""); }

						_me.options.attach.mode = "edit";
						_me.options.attach.vmode = "edit";
						_me.options.attach.remove = function (o) {
							var _$type = $("#Multi_Attach_Type", _me.element),
								_$div = $("#Multi_Attach_DIV", _me.element);

							if (!o.ismega) {
								if (_$type.val() == "L") {

								} else if (_$type.val() == "R") {
									// To-Do 원격 DB 첨부인 경우 처리
									var _val = _delo.val();
									if (_val == "") {
										_delo.val(o.name);
									} else {
										_delo.val(_val + ";" + o.name);
									}
								} else {
									/*
									var _delo = $('#Multi_Attach_DeleteFile', _me.element), _val = _delo.val();
									if (_val == "") {
										_delo.val(o.name);
									} else {
										_delo.val(_val + ";" + o.name);
									}
									*/
									$('<input name="%%Detach" type="hidden" value=""/>').appendTo(_$div).val(o.name);
								}
							}
						}
					} else {
						_me.options.attach.mode = "read";
						_me.options.attach.vmode = "read";
					}
					_me.options.attach.doc = {};
					_me.options.attach.doc.applcode = _me.options.applcode;
					_me.options.attach.doc.server = _me.options.sysinfo.svrnm;
					_me.options.attach.doc.cdb = (_me.options.attach.type == "R" ? "/" + $("#Multi_Attach_DBPath", _me.element).val() : _me.options.cdb);
					_me.options.attach.doc.unid = (_me.options.attach.type == "R" ? $("#Multi_Attach_DocID", _me.element).val() : _me.options.unid);
					_me.options.attach.doc.subject = $("div.view-head div.dwp-subject", _me.element).text();
					_me.options.attach.ismobile = _me.options.ismobile;
					_me.attach_obj = $dwp.ui.file.init($("#attachments", _me.element), _me.options.attach);

				},
				// 이미지 첨부
				_attachImgProc: function () {
					console.log("attachImgProc Start")
					var _me = this,
						_$already = null;

					if (!_me.options.imgattach.isattach) return;
					if ($(_me.options.imgattach.selector, _me.element).size() == 0) return;

					_$already = $("#Already_Attach", _me.element);

					if (_me.options.imgattach.type == "R") {

					} else {
						if (!_me.options.isedit && _$already.val() == "") return;
						if (_$already.val() != "") {
							var _olist = $.parseJSON(_$already.val()),
								_$sortfiles = $("#Multi_Attach_SortFiles", _me.element);

							if (_$sortfiles.size() > 0 && _$sortfiles.val() != "") {
								var _sortlist = _$sortfiles.val().split(";"),
									_nlist = [];
								if (_sortlist.length == _olist.length) {
									$.each(_sortlist, function (i, v) {
										var o = _me._sortFindFile(v, _olist);
										if (o != null) {
											_nlist.push(o);
										}
									});
									if (_nlist.length == _olist.length) {
										_me.options.imgattach.dataset = _nlist;
									} else {
										_me.options.imgattach.dataset = _olist;
									}
								} else {
									_me.options.imgattach.dataset = _olist;
								}
							} else {
								_me.options.imgattach.dataset = _olist;
							}
						}
					}

					// 기본 파일 업로드 서블릿 경로 설정
					if (!_me.options.imgattach.hasOwnProperty("attach_url") || _me.options.imgattach.attach_url == "") {
						//_me.options.imgattach.attach_url = "/servlet/" + $fn.getName(_me.options.sysinfo.svrnm).cn.toLowerCase() + "/fileupload?enctype=utf-8&sfolder="
						_me.options.imgattach.attach_url = "/servlet/" + $fn.getName(_me.options.sysinfo.svrnm).cn + "/fileupload?enctype=utf-8&sfolder="
					}

					if (_me.options.isedit) {
						_me.options.imgattach.mode = "edit";
						_me.options.imgattach.remove = function (o) {
							var _$type = $("#Multi_Attach_Type", _me.element),
								_$div = $("#Multi_Attach_DIV", _me.element);

							if (_$type.val() == "L") {
								var _delo = $('#Multi_Attach_DeleteFile', _me.element),
									_val = _delo.val();
								if (_val == "") {
									_delo.val(o.name);
								} else {
									_delo.val(_val + ";" + o.name);
								}
							} else if (_$type.val() == "R") {
								// To-Do 원격 DB 첨부인 경우 처리
							} else {
								/*
								var _delo = $('#Multi_Attach_DeleteFile', _me.element), _val = _delo.val();
								if (_val == "") {
									_delo.val(o.name);
								} else {
									_delo.val(_val + ";" + o.name);
								}
								*/
								$('<input name="%%Detach" type="hidden" value=""/>').appendTo(_$div).val(o.name);
							}
						}
					} else {
						_me.options.imgattach.mode = "read";
					}
					//console.log(_me.options.imgattach);
					_me.options.imgattach.ismobile = _me.options.ismobile;
					_me.imgattach_obj = $dwp.ui.imgfile.init($(_me.options.imgattach.selector, _me.element), _me.options.imgattach);
				},
				// 댓글 처리
				_replyProc: function () {
					var _me = this,
						_$reply_list = $("div.comment-list", _me.element);

					//댓글과 like가 묶여있던 소스라 주석 처리 - 2020.06.24 by dwlee
					//if (!_me.options.isreply || _me.options.isedit) return;

					if (_me.options.isreply && !_me.options.isedit) {

						_$reply_list.empty();

						// 댓글 영역 토글처리
						var _$reply_more = $("div.dwp-comment-area span.btn-more", _me.element);
						if (_$reply_more.size() > 0) {
							_$reply_more.off("click").on("click", function () {
								$(this).toggleClass("active");
								_$reply_list.toggleClass("active");
							});
						}

						function _getMsgStr(msgVal, maximum) {
							var bytesLen = 0;
							var nbytes = 0;
							var msg = "";
							var msglen = msgVal.length;
							for (var i = 0; i < msglen; i++) {
								var oneChar = msgVal.charAt(i);
								if (escape(oneChar).length > 4) {
									bytesLen = 2;
								} else if (oneChar != "\r" || oneChar != "\n") {
									bytesLen = 1;
								} else if (oneChar == '<' || oneChar == '>') {
									bytesLen = 4;
								}

								if ((nbytes + bytesLen) > maximum) {
									break;
								}
								nbytes += bytesLen;
								msg += oneChar;
							}
							//$(".title-length", cObj).find(".point-color").text(nbytes);
							return { len: nbytes, txt: msg };
						}

						// 댓글 리스트 가져오기
						function _jsonGetParmData() {
							var _data = {},
								_url = _me.options.sublogdb + "/api/data/collections/name/wvreply";
							_url += "?ps=" + _me.options.reply.ps;
							_url += "&page=" + (_me.options.reply.page - 1);

							_data.category = _me.options.key_unid;

							return {
								url: _url,
								dataType: "json",
								async: true,
								cache: false,
								data: _data
							};
						}

						$.when(
							$dwp.core.util.xAjax(_jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.reply.jtl, async: false, cache: false })
						).done(function (xhr1, xhr2) {
							var _json = {};
							//전체 건수 설정
							_me.options.reply.total = _$$.util.getDataRange(xhr1);
							$("div.dwp-comment-area span[name='replycnt']", _me.element).text(_me.options.reply.total);

							_json.target = _$reply_list;
							_json.element = _me;
							_json.ismobile = (_me.options.ismobile ? "y" : "n")
							_json.data = xhr1[0];

							_$$.jsonToHtml.convert(_json, xhr2[0]);

							$("[data-type='profile']", _$reply_list).off("click").on("click", function () {
								//console.log("ismobile", _me.options.ismobile);
								$dwp.ui.bizcard.init($(this), { ismobile: _me.options.ismobile });
							});
						});

						// 댓글 사용자정의
						if (_me.options.reply.hasOwnProperty("selectlist") && _me.options.reply.selectlist != "") {
							var _$emoticonlist = $("div.dwp-emoticon-select", _me.element);
							var _selectlist = _me.options.reply.selectlist.split(",");
							_$emoticonlist.empty();
							$.each(_selectlist, function (i, v) {
								var _h = '<div class="dwp-radio"><label>';
								_h += '<input name="reply_emoticon" type="radio" value="' + v + '"/>';
								_h += '<span>' + v + '</span>';
								_h += '</label></div>';
								var _$item = $(_h).appendTo(_$emoticonlist);
							});
						}

						// 댓글 글자 카운트 체크하기
						$("textarea[name='reply_body']", _me.element).off("keyup").on("keyup", function (e) {
							var _$replyform = $(this).parents("div.comment-write-form")
							var _$count = $("span.txt-count", _$replyform);
							var _length = $dwp.core.util.getStrByteLen($(this).val());

							_$count.text(_length);

							if (_length > _me.options.reply.maxlen) {
								e.preventDefault();
								$(this).trigger("blur");
								var _rtn = _getMsgStr($(this).val(), _me.options.reply.maxlen);
								$(this).val(_rtn.txt);
								_$count.text(_rtn.len);
								$fn.alert({ msg: "300자를 초과할 수 없습니다." });
							}

						});

						// 등록 버튼 이벤트 처리
						$("div.dwp-comment-btn", _me.element).off("click").on("click", function () {
							// actiontype : save_rep(저장), del_rep(삭제)
							// key_docunid, unid : 편집, 삭제(영구)
							// reply_body : 본문
							var _$replyform = $(this).parents("div.comment-write-form"),
								_opt = { _par_unid: "", _par_authorname: "", _doc_level: 0 },
								_popt = {},
								msg024 = "comm.msg.msg024";

							if (_me.options.applcode == "aprv") {
								msg024 = "comm.msg.msg024_aprv"
							}
							//console.log("msg024",msg024);
							//var _$reply_body = $("textarea[name='reply_body']", $(this).parent());
							var _$reply_body = $("textarea[name='reply_body']", _$replyform);
							if (_$reply_body.val() == "") {
								$fn.alert({ msg: $fn.getCodeMsg(msg024) })
									.done(function () {
										_$reply_body.focus();
									});
								return;
							}
							if (_$reply_body.val().indexOf("<script>") != -1) {
								$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg067") }).done(function () {	//스크립트는 입력하실 수 없습니다
									_$reply_body.focus();
								});
								return;
							}

							if ($.hasData(_$replyform.get(0))) {
								_popt = _$replyform.data($dwp.core.doc._REPLY_DATA);
								if (_$replyform.hasClass("reply-edit")) {
									_opt._par_unid = _popt._par_unid;
									_opt._key_unid = _popt._key_unid;
									_opt._par_authorname = _popt._par_authorname;
									_opt._doc_level = _popt._doc_level;
								} else {
									_opt._par_unid = _popt._key_unid;
									_opt._par_authorname = _popt._author;
									_opt._doc_sort = _popt._doc_sort;
									_opt._doc_level = _popt._doc_level + 1;
								}
							}

							_me.reply_save($(this), _opt);
						});

						// 댓글 이모티콘 이벤트 처리
						$("div[name=reply_emoticon]", _me.element).off("click").on("click", function () {
							var _$comment = $(this).parents("div.dwp-comment");
							$dwp.ui.qtdialog.init($(this), {
								qtid: "comment-emoticon",
								dialogClass: 'titleless dropdown-type-dialog',
								width: 192,
								position: { my: "right bottom", at: "left-10 top-100", collision: "flipfit" },
								initcallback: function (_$qtdialog) {
									for (var i = 1; i <= 18; i++) {
										//var _h = "<span style='display:inline-block;width:34px;height:34px;border:1px solid #cfcfcf;cursor:pointer;'>";
										var _h = "<span class='dwp-emoticon-icon'>";
										//_h += "<img src='" + $dwp.core.getPath("weblib") + "/images/reply/emoticon_" + i + ".svg'/>";
										_h += "</span>";

										var _$span = $(_h).appendTo(_$qtdialog.element);

										var _mod = (i - 1) % 5;
										var _x = _mod == 0 ? 0 : _mod * 34;
										var _y = parseInt((i - 1) / 5, 10) * 34;

										_$span.css({ "background-position": "-" + _x + "px -" + _y + "px" });
										_$span.data("_EMOTICON", { id: i });
									}
									$("span", _$qtdialog.element).off("click").on("click", function () {
										var _data = $(this).data("_EMOTICON");
										$("div[name=_DISP_EMOTICON]", _$comment).css({ "display": "table-cell" });
										$("div[name=_DISP_EMOTICON]>span", _$comment).html("<img src='" + $dwp.core.getPath("weblib") + "/images/reply/emoticon_" + _data.id + ".svg'/>");
										$("input[name=reply_emoticon]", _$comment).val(_data.id);
										_$qtdialog.close();
									});
								}
							});
						});
						$("div[name=_DISP_EMOTICON]>a", _me.element).off("click").on("click", function () {
							var _$comment = $(this).parents("div.dwp-comment");
							$("div[name=_DISP_EMOTICON]", _$comment).css({ "display": "none" });
							$("div[name=_DISP_EMOTICON]>span", _$comment).empty();
							$("input[name=reply_emoticon]", _$comment).val("");
						});
					}

					//댓글에 종속성 해제 - 2020.06.24 by dwlee
					if (!_me.options.isedit) {
						// 좋아요 수행 여부 체크(수식으로--?)
						// 좋아요 이벤트 처리
						if (_me.options.islikeit) {
							$("div.like.active", _me.element).off("click").on("click", function () {
								if ($(this).hasClass("active")) {
									_me.likeit($(this));
								}
							});
						} else {
							$("div.like", _me.element).remove();
						}
						// 문서 신고하기
						if (_me.options.iscriminate) {
							if (_me.options.ismobile) {
								$("div[name='doc_criminate']", _me.element).off("click").on("click", function () {
									//2016.12.16 - cdb,to added by dwlee
									_me.criminateM({ type: "doc", unid: _me.options.unid, cdb: _me.options.cdb, to: _me.options.conowners });
								});
							} else {
								$("div.dwp-comment-area div.right.comment-option > a[name='doc_criminate']", _me.element).off("click").on("click", function () {
									//2016.12.16 - cdb, to added by dwlee
									_me.criminate({ type: "doc", unid: _me.options.unid, cdb: _me.options.cdb, to: _me.options.conowners });
								});
							}
						} else {
							if (_me.options.ismobile) {
								$("div[name='doc_criminate']", _me.element).remove();
							} else {
								$("div.dwp-comment-area div.right.comment-option > a[name='doc_criminate']", _me.element).remove();
							}
						}
					}
				},
				reply_save: function (o, p) {
					var _me = this,
						_p = $.extend({ _par_unid: "", _par_authorname: "", _key_unid: "", _doc_sort: "", _doc_level: 0 }, p),
						_actiontype = 'save_rep',
						_root_unid = _me.options.key_unid,
						_$replyform = $(o).parents("div.comment-write-form")
						//,_$reply_body = $("textarea[name='reply_body']", $(o).parent())
						,
						_$reply_body = $("textarea[name='reply_body']", _$replyform),
						_reply_body = _$reply_body.val()
						//,_$reply_emoticon = $("input[name='reply_emoticon']", $(o).parent())
						,
						_$reply_emoticon = $("input[name='reply_emoticon']", _$replyform),
						_reply_emoticon = "";

					//if( $(o).parents("div.comment-list").size() > 0 ) {
					//	_p = $(o).parents("div.comment-write-form").prev("div.comment-item").data($dwp.core.doc._REPLY_DATA)
					//}

					$fn.block(undefined, { notusemsg: true });
					if (_$reply_emoticon.size() > 0) {
						_reply_emoticon = _$reply_emoticon.xval();
					}

					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_me.options.sublogdb + '/wlogpost?createdocument'), {
						actiontype: _$$.doc._CONST.ACTION.SAVE_REP,
						root_unid: _root_unid,
						par_unid: _p._par_unid,
						key_unid: _p._key_unid
						//, doc_sort : p._doc_sort
						,
						doc_level: _p._doc_level,
						reply_body: _reply_body,
						reply_emoticon: _reply_emoticon,
						par_authorname: _p._par_authorname,
						pardb_path: _me.options.cdb
					},
						function (data) {
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									$.unblockUI();

									var msg025 = "comm.msg.msg025";
									if (_me.options.applcode == "aprv") { msg025 = "comm.msg.msg025_aprv" }

									$fn.toast({ msg: $fn.getCodeMsg(msg025) });

									_$reply_body.val("");
									_$reply_emoticon.xval("");
									//$("div[name=_DISP_EMOTICON]", $(o).parent()).css({"display":"none"});
									//$("div[name=_DISP_EMOTICON]>span", $(o).parent()).empty();
									if ($("div[name=_DISP_EMOTICON]", _$replyform).size() > 0) {
										$("div[name=_DISP_EMOTICON]", _$replyform).css({ "display": "none" });
										$("div[name=_DISP_EMOTICON]>span", _$replyform).empty();
									}
									_me._replyProc();
									/*
									$dwp.ui.alert({msg : $fn.getCodeMsg(msg025)})
									.done(function(){
										_$reply_body.val("");
										_$reply_emoticon.val("");
										$("div[name=_DISP_EMOTICON]", $(o).parent()).css({"display":"none"});
										$("div[name=_DISP_EMOTICON]>span", $(o).parent()).empty();
										_me._replyProc();
									});
									*/
								} else {
									//error
									$.unblockUI();
									$dwp.ui.alert({ msg: _$$.lang.getCurMsg(data.msgcode) });
								}
							} else {
								//error
								//$.unblockUI();
							}
						}, 'json'
					)
				},
				reply_del: function (o, p) {
					var _me = this,
						_p = $.extend({ _key_unid: "", _is_admin: _me.options.isadmin || (_me.options.isconreplydel && _me.options.isconowner) }, p),
						_root_unid = _me.options.key_unid;

					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_me.options.sublogdb + '/wlogpost?createdocument'), {
						actiontype: (_p._is_admin ? _$$.doc._CONST.ACTION.DEL_SYSREP : _$$.doc._CONST.ACTION.DEL_REP),
						root_unid: _root_unid,
						key_unid: _p._key_unid,
						pardb_path: _me.options.cdb
					},
						function (data) {
							// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {

									$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg026") })
										.done(function () {
											_me._replyProc();
										});
									////_me.goview();
									//_me._replyProc();
								} else {
									//error
									$dwp.ui.alert({ msg: $fn.getCodeMsg(data.msgcode) });
								}
							} else {
								//error
							}
						}, 'json'
					)

				},
				reply_aprv_del: function (o, p) {
					var _me = this,
						_p = $.extend({ _key_unid: "", _is_admin: _me.options.isadmin || (_me.options.isconreplydel && _me.options.isconowner) }, p),
						_root_unid = _me.options.key_unid;
					$fn.confirm({ msg: $fn.getCodeMsg("aprv.msg.018") }).done(function () {

						_$$.util.cmdPost(
							$dwp.core.util.getProxyUrl(_me.options.sublogdb + '/wlogpost?createdocument'), {
							actiontype: (_p._is_admin ? _$$.doc._CONST.ACTION.DEL_SYSREP : _$$.doc._CONST.ACTION.DEL_REP),
							root_unid: _root_unid,
							key_unid: _p._key_unid,
							pardb_path: _me.options.cdb
						},
							function (data) {
								// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {

										$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg026_aprv") })
											.done(function () {
												_me._replyProc();
											});
										////_me.goview();
										//_me._replyProc();
									} else {
										//error
										$dwp.ui.alert({ msg: _$$.lang.getCurMsg(data.msgcode) });
									}
								} else {
									//error
								}
							}, 'json'
						)

					})
				}
				// 댓글 좋아요 처리
				,
				reply_likeit: function (o, opt) {
					var _me = this,
						_opt = $.extend({ unid: "" }, opt),
						_key_unid = _me.options.key_unid;

					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_me.options.sublogdb + '/wlogpost?createdocument'), {
						actiontype: "reply_likeit",
						root_unid: _opt.unid,
						pardb_path: _me.options.cdb
					},
						function (data) {
							// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									//$dwp.ui.alert({msg : "좋아요 처리가 되었습니다!"});
									//_me.goview();
									o.children().text(data.like_cnt);
								} else {
									//error
								}
							} else {
								//error
							}
						}, 'json'
					)
				},
				// 좋아요 처리
				likeit: function (o) {
					var _me = this,
						_key_unid = _me.options.key_unid;

					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_me.options.sublogdb + '/wlogpost?createdocument'), {
						actiontype: _$$.doc._CONST.ACTION.LIKEIT,
						root_unid: _key_unid,
						pardb_path: _me.options.cdb
					},
						function (data) {
							// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									//$dwp.ui.alert({msg : "좋아요 처리가 되었습니다!"});
									//_me.goview();
									o.children().text(data.like_cnt);
									o.removeClass("active");
								} else {
									//error
								}
							} else {
								//error
							}
						}, 'json'
					)
				}
				/*
				,_prevNextMPorc : function() {
					var _me = this
					, _$el = $dwp.core.getTarget({type : "mobile", layer : "view"})
					, _vopt = null
					,_rtn = {};

					if (_$el.size() == 0) return;
					if (_$el.view("instance") == null ) return;

					_vopt = _$el.view("instance").options;

					if ( _vopt == undefined ) return;

					function _jsonGetParmData() {
						var _data = {}, _url = _vopt.cdb + "/api/data/collections/name/" + _vopt.viewalias;
						_url += "?ps=" + _vopt.ps;
						_url += "&page=" + (_vopt.page - 1);

						if( typeof _vopt.sortnm != "undefined" ) {
							_data.sortcolumn = _vopt.sortnm;
						}
						if( typeof _vopt.sortorder != "undefined" ) {
							_data.sortorder = _vopt.sortorder;
						}

						if (_vopt.single != "") {
							_data.category = _vopt.single;
						}

						if (_vopt.searchview) {
							_data.search = _vopt.searchqry;
						}
						return {
							url : _url
							,dataType : "json"
							,async : false
							,cache : false
							,data : _data
						};
					}

					function __findDoc(json) {
						var _idx = 0;
						if (json.length <= 1 ) return ;

						$.each(json, function(i, o){
							if(o["@unid"] == _me.options.unid) {
								_idx = i;
								return false;
							}
						})

						//이전문서 정보 찾기
						if (!_rtn.hasOwnProperty("prev")) {
							if ( _idx > 0 ) {
								_rtn.prev = {};
								_rtn.prev.cdb = _vopt.cdb;
								_rtn.prev.formview = _vopt.formview;
								_rtn.prev.unid = json[_idx-1]["@unid"];
								_rtn.prev.subject = json[_idx-1]["_subject"];
							} else if (_vopt.total > _vopt.ps && _vopt.page > 1) {
								// 다음 문서 검색
								_vopt.page = _vopt.page - 1;
								_findDoc();
							}
						}
						//다음문서 정보찾기
						if (!_rtn.hasOwnProperty("next")) {
							if ( _idx < (json.length - 1) ) {
								_rtn.next = {};
								_rtn.next.cdb = _vopt.cdb;
								_rtn.next.formview = _vopt.formview;
								_rtn.next.unid = json[_idx+1]["@unid"];
								_rtn.next.subject = json[_idx+1]["_subject"];
							} else if (_vopt.total > (_vopt.ps * (_vopt.page - 1) + json.length )) {
								_vopt.page = _vopt.page + 1;
								_findDoc();
							}
						}
						return;
					}

					function _findDoc() {
						$dwp.core.util.xAjax(_jsonGetParmData())
						.done(function(json, status, xhr){
							_vopt.total = _$$.util.getDataRange(xhr);
							__findDoc(json)
						});
					}
					_findDoc();

					return _rtn;
				}
				*/
				,
				_prevNextMProc: function () {
					var _me = this,
						_$el = $dwp.core.getTarget({ type: "mobile", layer: "view" }),
						_vopt = null,
						_rtn = {},
						_$pn = $("div.dwp-near-view", _me.element);

					//문서 첨부로 오픈된 문서는 이전다음 숨김
					//if (_me.options.isattdoc) {
					//	if (_$pn.size() > 0 ){_$pn.remove();return;}
					//}
					/*
					if (_$el.size() == 0) return;
					if (_$el.view("instance") == null ) return;
					*/
					if (_$el.size() == 0 || _$el.view("instance") == null) {
						_$el = $dwp.core.getTarget({ type: "mobile", layer: "home" });
						if (_$el.view("instance") == null) return;
					}

					_vopt = $.extend({}, _$el.view("instance").options);

					if (_$pn.size() == 0) return;
					if ($.isEmptyObject(_vopt)) { _$pn.remove(); return; }

					$("div.dwp-prev-view span.value", _$pn).text($fn.getCodeMsg("comm.msg.msg055"));
					$("div.dwp-next-view span.value", _$pn).text($fn.getCodeMsg("comm.msg.msg056"));

					var _ppage = _vopt.page;
					var _npage = _vopt.page;

					function _jsonGetParmData(cpage) {
						var _data = {},
							_url = _vopt.cdb + "/api/data/collections/name/" + _vopt.viewalias,
							_folderunid = _vopt.folderunid || "";
						if (_folderunid != "") {
							_url = _vopt.cdb + "/api/data/collections/unid/" + _vopt.folderunid;
						}
						_url += "?ps=" + _vopt.ps;
						_url += "&page=" + (cpage - 1);

						if (typeof _vopt.sortnm != "undefined") {
							_data.sortcolumn = _vopt.sortnm;
						}
						if (typeof _vopt.sortorder != "undefined") {
							_data.sortorder = _vopt.sortorder;
						}

						if (_vopt.single != "") {
							_data.category = _vopt.single;
						}

						if (_vopt.searchview) {
							_data.search = _vopt.searchqry;
						}
						return {
							url: _url,
							dataType: "json",
							async: false,
							cache: false,
							data: _data
						};
					}

					function _loadDoc(opt) {
						var _jdata = [],
							_opt = $.extend({ page: _vopt.page }, opt);

						$dwp.core.util.xAjax(_jsonGetParmData(_opt.page))
							.done(function (json, status, xhr) {
								_vopt.total = _$$.util.getDataRange(xhr);
								//__findDoc(json)
								_jdata = json
							});
						return _jdata
					}

					function _findDoc() {
						var _idx = -1;

						var json = _loadDoc();
						if (json.length <= 1) return;

						$.each(json, function (i, o) {
							if (o["@unid"] == _me.options.unid) {
								_idx = i;
								return false;
							}
						});
						console.log("_idx", _idx);
						//이전문서 정보 찾기
						if (!_rtn.hasOwnProperty("prev")) {
							if (_idx > 0) {
								_rtn.prev = {};
								_rtn.prev.unid = json[_idx - 1]["@unid"];
								_rtn.prev.subject = json[_idx - 1]["_subject"];
							} else if (_vopt.total > _vopt.ps && _vopt.page > 1) {
								// 이전 문서 검색
								//_vopt.page = _vopt.page - 1;
								_ppage = _ppage - 1;
								var pjson = _loadDoc({ page: _ppage });
								_rtn.prev = {};
								_rtn.prev.unid = pjson[pjson.length - 1]["@unid"];
								_rtn.prev.subject = pjson[pjson.length - 1]["_subject"];

							}
						}
						//다음문서 정보찾기
						if (!_rtn.hasOwnProperty("next")) {
							if (_idx < (json.length - 1)) {
								_rtn.next = {};
								_rtn.next.unid = json[_idx + 1]["@unid"];
								_rtn.next.subject = json[_idx + 1]["_subject"];
							} else if (_vopt.total > (_vopt.ps * (_vopt.page - 1) + json.length)) {
								_npage = _npage + 1;
								var njson = _loadDoc({ page: _npage });
								_rtn.next = {};
								_rtn.next.unid = njson[0]["@unid"];
								_rtn.next.subject = njson[0]["_subject"];
							}
						}
						return;
					}

					_findDoc();

					if (_rtn.hasOwnProperty("prev")) {
						$("div.dwp-prev-view a", _$pn).on("click", function () {

							_$el.view("instance").options.page = _ppage;

							var _url = _vopt.cdb + "/" + _vopt.formview + "/" + _rtn.prev.unid + "?opendocument";
							$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "read" });
						});
						$("div.dwp-prev-view span.value", _$pn).html(_rtn.prev.subject);	//BN은 text=>html로 변경. 제목에 색깔태그를 쓰기 때문. 괜찮을라나. by noh
					} else {
						$("div.dwp-prev-view", _$pn).addClass("dwp-hidden");
					}
					if (_rtn.hasOwnProperty("next")) {
						if (_rtn.next.unid != "") {
							$("div.dwp-next-view a", _$pn).on("click", function () {

								_$el.view("instance").options.page = _npage;

								var _url = _vopt.cdb + "/" + _vopt.formview + "/" + _rtn.next.unid + "?opendocument";
								$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "read" });
							});
							$("div.dwp-next-view span.value", _$pn).html(_rtn.next.subject);	//BN은 text=>html로 변경. 제목에 색깔태그를 쓰기 때문. 괜찮을라나. by noh
						} else {
							$("div.dwp-next-view", _$pn).addClass("dwp-hidden");
						}
					} else {
						$("div.dwp-next-view", _$pn).addClass("dwp-hidden");
					}
				},
				_prevNextProc: function () {
					var _me = this,
						_vopt = $.extend({}, _$$.portal.getPreViewInfo()),
						_rtn = {},
						_$pn = $("div.dwp-near-view", _me.element);

					//문서 첨부로 오픈된 문서는 이전다음 숨김
					//if (_me.options.isattdoc) {
					//	if (_$pn.size() > 0 ){_$pn.remove();return;}
					//}

					if (_me.options.ispreview) { _vopt = $.extend({}, $fn.getInstance("view").options); }

					if (_$pn.size() == 0) return;
					if ($.isEmptyObject(_vopt)) { _$pn.remove(); return; }

					$("div.dwp-prev-view span.value", _$pn).text($fn.getCodeMsg("comm.msg.msg055"));
					$("div.dwp-next-view span.value", _$pn).text($fn.getCodeMsg("comm.msg.msg056"));

					var _ppage = _vopt.page;
					var _npage = _vopt.page;

					function _jsonGetParmData(cpage) {
						var _data = {},
							_url = _vopt.cdb + "/api/data/collections/name/" + _vopt.viewalias,
							_folderunid = _vopt.folderunid || "";
						if (_folderunid != "") {
							_url = _vopt.cdb + "/api/data/collections/unid/" + _vopt.folderunid;
						}
						_url += "?ps=" + _vopt.ps;
						_url += "&page=" + (cpage - 1);

						if (typeof _vopt.sortnm != "undefined") {
							_data.sortcolumn = _vopt.sortnm;
						}
						if (typeof _vopt.sortorder != "undefined") {
							_data.sortorder = _vopt.sortorder;
						}

						if (_vopt.single != "") {
							_data.category = _vopt.single;
						}

						if (_vopt.searchview) {
							_data.search = _vopt.searchqry;
						}
						return {
							url: _url,
							dataType: "json",
							async: false,
							cache: false,
							data: _data
						};
					}

					function _loadDoc(opt) {
						var _jdata = [],
							_opt = $.extend({ page: _vopt.page }, opt);

						$dwp.core.util.xAjax(_jsonGetParmData(_opt.page))
							.done(function (json, status, xhr) {
								if (_vopt.entrycount != "" && !_vopt.searchview) { } else {
									_vopt.total = _$$.util.getDataRange(xhr);
								}
								//__findDoc(json)
								_jdata = json
							});
						return _jdata
					}

					function _findDoc() {
						var _idx = -1;

						var json = _loadDoc();
						if (json.length <= 1) return;

						$.each(json, function (i, o) {
							if (o["@unid"] == _me.options.unid) {
								_idx = i;
								return false;
							}
						});
						console.log("_idx", _idx);
						//이전문서 정보 찾기
						if (!_rtn.hasOwnProperty("prev")) {
							if (_idx > 0) {
								_rtn.prev = {};
								_rtn.prev.unid = json[_idx - 1]["@unid"];
								_rtn.prev.subject = json[_idx - 1]["_subject"];
							} else if (_vopt.total > _vopt.ps && _vopt.page > 1) {
								// 이전 문서 검색
								//_vopt.page = _vopt.page - 1;
								_ppage = _ppage - 1;
								var pjson = _loadDoc({ page: _ppage });
								_rtn.prev = {};
								_rtn.prev.unid = pjson[pjson.length - 1]["@unid"];
								_rtn.prev.subject = pjson[pjson.length - 1]["_subject"];

							}
						}
						//다음문서 정보찾기
						if (!_rtn.hasOwnProperty("next")) {
							if (_idx < (json.length - 1)) {
								_rtn.next = {};
								_rtn.next.unid = json[_idx + 1]["@unid"];
								_rtn.next.subject = json[_idx + 1]["_subject"];
							} else if (_vopt.total > (_vopt.ps * (_vopt.page - 1) + json.length)) {
								_npage = _npage + 1;
								var njson = _loadDoc({ page: _npage });
								_rtn.next = {};
								_rtn.next.unid = njson[0]["@unid"];
								_rtn.next.subject = njson[0]["_subject"];
							}
						}
						return;
					}

					_findDoc();

					if (_rtn.hasOwnProperty("prev")) {
						$("div.dwp-prev-view a", _$pn).on("click", function () {

							if (_me.options.ispreview) {
								_vopt = $fn.getInstance("view").options;
								_vopt.page = _ppage;
							} else {
								var _$el = $dwp.core.getContent();
								_vopt.page = _ppage;
								_$el.data("dwp-vopt", _vopt);
							}

							var _url = _vopt.cdb + "/" + _vopt.viewalias + "/" + _rtn.prev.unid + "?opendocument";
							if (_me.options.ispreview) {
								_me._previewLoadPage({ url: _url, viewreload: false });
							} else {
								_$$.util.loadPage({ link: _url, linktype: "PAGE" });
							}
						});
						$("div.dwp-prev-view span.value", _$pn).html(_rtn.prev.subject);	//BN은 text=>html로 변경. 제목에 색깔태그를 쓰기 때문. 괜찮을라나. by noh
					} else {
						$("div.dwp-prev-view", _$pn).addClass("dwp-hidden");
					}
					if (_rtn.hasOwnProperty("next")) {
						if (_rtn.next.unid != "") {
							$("div.dwp-next-view a", _$pn).on("click", function () {

								if (_me.options.ispreview) {
									_vopt = $fn.getInstance("view").options;
									_vopt.page = _npage;
								} else {
									var _$el = $dwp.core.getContent();
									_vopt.page = _npage;
									_$el.data("dwp-vopt", _vopt);
								}

								var _url = _vopt.cdb + "/" + _vopt.viewalias + "/" + _rtn.next.unid + "?opendocument";
								if (_me.options.ispreview) {
									_me._previewLoadPage({ url: _url, viewreload: false });
								} else {
									_$$.util.loadPage({ link: _url, linktype: "PAGE" });
								}
							});
							$("div.dwp-next-view span.value", _$pn).html(_rtn.next.subject);	//BN은 text=>html로 변경. 제목에 색깔태그를 쓰기 때문. 괜찮을라나. by noh
						} else {
							$("div.dwp-next-view", _$pn).addClass("dwp-hidden");
						}
					} else {
						$("div.dwp-next-view", _$pn).addClass("dwp-hidden");
					}
					/*
					if ( _rtn.hasOwnProperty("prev") ) {
						$("div.dwp-prev-view a", _$pn).on("click", function(){
							var _url = _vopt.cdb + "/" + _vopt.viewalias + "/" + _rtn.prev.unid + "?opendocument";

							if (_me.options.ispreview) {
								_me._previewLoadPage({url : _url, viewreload : false});
							} else {
								_$$.util.loadPage({link : _url, linktype : "PAGE"});
							}
						});
						$("div.dwp-prev-view span.value", _$pn).text(_rtn.prev.subject);
					}
					if ( _rtn.hasOwnProperty("next") ) {
						$("div.dwp-next-view a", _$pn).on("click", function(){
							var _url = _vopt.cdb + "/" + _vopt.viewalias + "/" + _rtn.next.unid + "?opendocument";
							if (_me.options.ispreview) {
								_me._previewLoadPage({url : _url, viewreload : false});
							} else {
								_$$.util.loadPage({link : _url, linktype : "PAGE"});
							}
						});
						$("div.dwp-next-view span.value", _$pn).text(_rtn.next.subject);
					}
					*/
				},
				// 응답문서 리스트 조회
				_reponseProc: function () {
					var _me = this,
						_$responseList = null;

					if (!_me.options.isresponse || !_me.options.response_list.isuse || _me.options.response_list.topunid == "") {
						return;
					}

					_$responseList = $("div[name=_Respon_List]", _me.element);
					if (_$responseList.size() == 0) return;

					// 댓글 리스트 가져오기
					function _jsonGetParmData() {
						var _data = {},
							_url = _me.options.cdb + "/api/data/collections/name/" + _me.options.response_list.viewalias;
						_url += "?category=" + _me.options.response_list.topunid;
						_url += "&count=" + _me.options.response_list.ps;

						//_url += "&page=1";

						//_data.category = _me.options.response_list.topunid;

						return {
							url: _url,
							dataType: "json",
							async: true,
							cache: false,
							data: {}
						};
					}

					function _content(type, o) {
						var _h = "";
						if (type == "created") {
							_h = $dwp.core.util.formatDateTime(o._created, "dateonly")
						} else if (type == "subject") {
							_h = "<div class='dwp-subject'>";
							if (o.hasOwnProperty("_isresponse") && o._isresponse == 1) {
								// Depth Check
								var _indent = (o.hasOwnProperty('@indent') ? o['@indent'] : 0);
								if (_indent > 0) { _indent--; }
								var _width = _indent * 10;
								_h += "<span style='display:inline-block;width:" + _width + "px'></span>";
								//_h += "<span style='margin-right:10px'><img class='icon-file' src='" + $dwp.core.getPath("weblib") + "/images/common/icon-response.svg'/></span>";
								_h += "<span style='margin-right:10px'><img class='icon-file' src='" + $dwp.core.getPath("weblib") + "/images/common/icon-response3.svg' style='vertical-align:top;'/></span>";
							}
							/*
							if (typeof _header.category != "undefined" && typeof _header.category.name != "undefined" && _header.category.name != ""){
								if (o.hasOwnProperty(_header.category.name) && o[_header.category.name] != "") {
									_h += "<span class='dwp-tag'>" + $dwp.core.lang.getCurMsg(o[_header.category.name]) + "</span>";
								}
							}
							*/
							_h += "<a class='dwp-title'>" + $dwp.core.lang.getCurMsg(o._subject) + "</a>";
							if (o.hasOwnProperty('_replycnt') && parseInt(o['_replycnt'], 10) > 0) {
								if (!o.hasOwnProperty('_isallowreply') || (o.hasOwnProperty('_isallowreply') && o._isallowreply == "1")) {
									_h += "<a class='point-color'>(" + o['_replycnt'] + ")</a>";
								}
							}
							if (o["@unid"] == _me.options.unid) {
								_h += "<span class='dwp-orange dwp-bold' style='padding-left:10px'>-->" + $dwp.core.lang.getCurMsg("현 위치") + "</span>";
							}
							_h += "</div>";
						} else if (type == "author") {
							_h = "<span class='dwp-cursor name'>" + $dwp.core.lang.getCurMsg(o._author) + "</span>";
						} else if (type == "file") {
							if ($dwp.core.util.isAttachInfo(o)) {
								_h = "<a class='dwp-cursor'><img class='icon-file' src='" + $dwp.core.getPath("weblib") + "/images/common/icon-file.svg'/></a>";
							}
						}
						return _h;

					}

					var _$responseBody = $("tbody", _$responseList);

					$dwp.core.util.xAjax(_jsonGetParmData())
						.done(function (jdata) {
							$.each(jdata, function (i, o) {
								var _h = "<tr>";
								_h += "<td name='created'>" + _content("created", o) + "</td>";
								_h += "<td name='file'>" + _content("file", o) + "</td>";
								_h += "<td name='subject'>" + _content("subject", o) + "</td>";
								_h += "<td name='author'>" + _content("author", o) + "</td>";
								//_h += "<td>" + _content("author", o) + "</td>";
								_h += "</tr>";
								var _$tr = $(_h).appendTo(_$responseBody);

								$("td[name=file]", _$tr).off("click").on("click", function () {
									if ($(this).html() != "") {
										_me.openAttachment($(this), o);
									}
								});

								$("td[name=subject],td[name=created]", _$tr).off("click").on("click", function () {
									if (_me.options.unid == o['@unid']) { return; }
									_me.openDocument(o['@unid'], { viewalias: _me.options.response_list.viewalias });
								});

								$("td[name=author]", _$tr).off("click").on("click", function () {
									$(this).attr({ "data-empno": o._authorempno, "data-orgcode": "" });
									$dwp.ui.bizcard.init($(this));
								});
							});

						});
				}
				/**
				 * 첨부파일 조회 다이얼로그를 Open합니다.
				 * @param	{object}	o				Click Event 객체
				 * @param	{object=}	opt				options
				 * @param	{string}	opt.title		Title
				 * @param	{string}	opt._attachinfo	첨부파일정보
				 * @param	{string}	opt._attachid	첨부파일정보(Doc UNID)
				 * @param	{string}	opt._attachpath	첨부파일정보(DB Path)
				 * @param	{string}	opt._attachname	첨부파일정보(File Names 다중(;))
				 */
				,
				openAttachment: function (o, opt) {
					var _me = this,
						_opt = $.extend({
							ismobile: _me.options.ismobile,
							applcode: _me.options.applcode,
							cdb: _me.options.cdb,
							svrnm: _me.options.sysinfo.svrnm,
							title: $dwp.core.lang.getCodeMsg("comm.title.js012")
						}, opt);
					if (!_opt.hasOwnProperty("_attachinfo") || _opt._attachinfo == "") {
						if (!_opt.hasOwnProperty("_attachid") || _opt._attachid == "") return;
						if (!_opt.hasOwnProperty("_attachpath") || _opt._attachpath == "") return;
						//if (!_opt.hasOwnProperty("_attachsize") || _opt._attachsize == "") return;
						if (!_opt.hasOwnProperty("_attachname") || _opt._attachname == "") return;

						var _namelist = _opt._attachname.split(";");
						//var _sizelist = _opt._attachsize.split(";")
						//if (_namelist.length != _sizelist.length) return;

						var _attachinfo = $.map(_namelist, function (v, i) {
							var _url = "/" + _opt._attachpath + "/0/" + _opt._attachid + "/$FILE/" + encodeURIComponent(v);
							//return '{"url":"' + _url + '","name":"' + v + '","size":"' + _sizelist[i] + '"}';
							return '{"url":"' + _url + '","name":"' + v + '","size":""}';
						}).join(",");
						_opt._attachinfo = "[" + _attachinfo + "]";
					}
					$dwp.ui.filedailog.init(o, _opt);
				}
				/**
				 * 문서조회합니다.
				 * @param	{string}	unid		Document UNID
				 * @param	{object=}	opt			option
				 * @param	{string}	opt.param	문서호출시 추가할 파리미터
				 */
				,
				openDocument: function (unid, opt) {
					var _me = this,
						_url = "",
						_opt = $.extend({ viewalias: "", opentype: "" }, opt);

					if (_me.options.ismobile) {
						_url = _me.options.cdb + "/" + _opt.viewalias + "/" + unid + "?opendocument";
						if (_opt.hasOwnProperty("param")) {
							_url += "&" + $.param(_opt.param);
						}
						$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "read" });
					} else {
						_url = _me.options.cdb + "/" + _opt.viewalias + "/" + unid + "?opendocument";
						if (_opt.hasOwnProperty("param")) {
							_url += "&" + $.param(_opt.param);
						}
						if (_opt.opentype == "win") {
							$dwp.core.util.winopen(_url, "", {});
						} else if (_opt.opentype == "layer") {
							_$$.util.layerOpenDocument({ content: { url: _url } });
						} else if (_me.options.ispreview) {
							_me._previewLoadPage({ url: _url });
						} else {
							_$$.util.loadPage({ link: _url, linktype: "PAGE" });
						}
					}
				},
				_topBtnProc: function () {
					var _me = this;
					if (_me.options.isedit) return;

					if (_me.options.ispreview) {
						$("div.dwp-btn-top", _me.element).off("click").on("click", function () {
							_me.element.stop().animate({ scrollTop: 0 }, '500', 'swing', function () { });
						});
					} else {
						$("div.dwp-btn-top", _me.element).off("click").on("click", function () {
							$(".dwp-page-body .dwp-body-wrap", _me.element).stop().animate({ scrollTop: 0 }, '500', 'swing', function () { });
						});
					}
				},
				_etcEventProc: function () {
					console.log("etcEventProc")
					var _me = this;
					/* BizCard 처리 */
					$("[data-type='profile']", _me.element).each(function () {
						if ($(this).data("empno") != undefined && $(this).data("empno") != "") {
							var _events = $._data(this, 'events');
							if (_events != undefined && _events.click != undefined) {
								console.log("BizCard Bind");
							} else {
								$(this).off("click").on("click", function () {
									$dwp.ui.bizcard.init($(this), { ismobile: _me.options.ismobile });
								});
								var _empno = $(this).data("empno");
								var _$img = $(this).children("div.profile").children("img");

								if (_$img.size() > 0) {
									_$img.get(0).src = $dwp.core.getPath("pic", { empno: _empno });
									console.log("_$img", _$img);
									$fn.getPicError(_$img);
								}
							}
						}
					});
					/*
					if ( $("[data-type='profile']", _me.element).data("empno")) {
						$("[data-type='profile']", _me.element).off("click").on("click", function(){
							$dwp.ui.bizcard.init($(this), {ismobile : _me.options.ismobile});
						});
						var _$img = $("[data-type='profile']", _me.element).children("div.profile").children("img");
						if (_$img.size() > 0) {
							_$img.get(0).src = $dwp.core.getPath("pic", {empno : $("[data-type='profile']", _me.element).data("empno")});
							$fn.getPicError(_$img);
						}
					}*/

					/*문서 보안 클릭 처리 tooltip  */
					if ($(".dwp-tooltip .tooltip-trigger", _me.element).size() > 0) {
						$(".dwp-tooltip .tooltip-trigger", _me.element).off("click").on("click", function () {
							$(this).closest(".dwp-tooltip").toggleClass("active");
						});
						$(".dwp-tooltip .close-tooltip", _me.element).off("click").on("click", function () {
							$(this).closest(".dwp-tooltip").removeClass("active");
						});
					}

					/* 상세 스크롤시 box-shadow */
					function headShadowTimer() {
						$(".dwp-page-heading", _me.element).removeClass("active");
					};
					if (!_me.options.ispreview) {
						$(".dwp-body-wrap", _me.element).on("scroll", function (e) {
							$(".dwp-page-heading", _me.element).addClass("active");

							clearTimeout(headShadowTimer);
							headShadowTimer = setTimeout(function () {
								$(".dwp-page-heading", _me.element).removeClass("active");
							}, 200);
						});
					}

				},
				_etcProc: function () {
					console.log("etcProc");
					var _me = this;

					if (_me.options.isedit) {
						// 겸직처리
						_me._concProc();
						// 썸네일 선택 버튼 처리
						$("div[name=doc-thumb-select]", _me.element).off("click").on("click", function () {
							_me.thubmimgSelect($(this));
						});
						if ($("img[name=thumb-img]", _me.element).size() > 0) {
							if ($("input[name=thumbPos]", _me.element).val() != "0") {
								$dwp.core.util.xAjax({
									url: $dwp.core.util.getProxyUrl(_me.options.cdb + '/wvimg/' + _me.options.unid + '?Opendocument')
									//,dataType : "text"
									,
									async: true,
									cache: false
								}).done(function (data) {
									$("img[name=thumb-img]", _me.element).attr("src", $.trim(data));
								});
							}
						}
					} else {
						//조회자 로그
						if (_me.options.isadmin || _me.options.isconowner) {
							$("div.view-info span.view", _me.element).off("click").on("click", function () {
								_opt = $.extend({ _key_unid: _me.options.key_unid, eleopt: _me.options });
								$dwp.ui.openlog($(this), _opt);
							});
						}
					}

					_me._taggingProc();

					//팝업공지시, 하루동안 안보기 표시
					_me._addViewDay();

				},
				_addViewDay: function () {
					console.log("_addViewDay");
					var _me = this;
					var _$pagebody = $(".dwp-contents-article", _me.element);

					if (!_me.options.isedit && _me.options.viewday && !_me.options.ismobile) {
						var _h = '<div style="position: fixed;bottom: 20px;">';
						_h += '<div class="dwp-checkbox"><label>';
						_h += '<input name="ViewDay" type="checkbox" value="1">';
						_h += '<span>' + $fn.getCodeMsg('comm.title.vday') + '</span>';
						_h += '</label></div>';
						_h += '</div>';

						var _$item = $(_h).appendTo(_$pagebody);
						var _cookienm = "DWP_VDAY_" + _me.options.unid;

						$("input[name=ViewDay]", _$item).off().on("click", function () {
							$.cookie(_cookienm, null, { expires: -1, path: '/' });
							if ($(this).is(":checked")) {
								$.cookie(_cookienm, "hide", { expires: 1, path: '/' });
								window.close();
							}
						});
					}
				},
				_taggingProc: function () {
					console.log("taggingProc");
					var _me = this,
						_$tagging = $("div[data-type='tag']", _me.element),
						_$inp = $("input[name='Taggings']", _$tagging),
						_$inpc = $("input[name='CateTaggings']", _$tagging),
						_$taglist = $("div.tag-list", _me.element);

					if (_$tagging.size() == 0) return;

					function _resetField() {
						var _rtn = [];
						$("div.tag-item", _$taglist).each(function () {
							var _data = $(this).data("_TAG_DATA");
							_rtn.push(_data.val);
						});

						if (_rtn.length > 0) {
							_$inp.val(_rtn.join(";"));

							var _tmp = [];
							$.each(_rtn, function (i, v) {
								for (var j = 2; j <= v.length; j++) {
									_tmp.push(v.substring(0, j))
								}
							})
							_$inpc.val($.unique(_tmp).join(";"));

						} else {
							_$inp.val("");
							_$inpc.val("");
						}
					}

					function _addItem(val) {
						var _h = "<div class='tag-item dwp-cursor'>";
						_h += "<span>#" + val + "</span>";
						if (_me.options.isedit) {
							_h += "<a class='btn-del'><span class='dwp-icon-cancel'></span></a>"
						}
						_h += "</div>";

						var _$item = $(_h).appendTo(_$taglist);
						_$item.data("_TAG_DATA", { val: val })

						if (_me.options.isedit) {
							$("a", _$item).off("click").on("click", function () {
								$(this).parent("div.tag-item").remove();
								_resetField();
							})
							_resetField();
						} else {
							$("span", _$item).off("click").on("click", function () {
								// View Dialog 창 보기
								var _v = $(this).parent("div.tag-item").data("_TAG_DATA");
								//console.log("v", _v);
								if (_me.options.hasOwnProperty("tagurl") && _me.options.tagurl != "") {
									$dwp.ui.dialog.init($(this), {
										title: _v.val,
										width: 720
										//,height : 587
										,
										modal: true,
										hide: { effect: "fade", duration: 300 },
										show: { effect: "fade", duration: 300 },
										content: { url: _me.options.tagurl, data: { single: _v.val } }
									});
								}
							});
						}
					}

					function _load() {
						if (_$inp.val() == "") return;
						$.each(_$inp.val().split(";"), function (i, v) {
							_addItem(v)
						})
					}

					_load();

					if (_me.options.isedit) {
						var _opt = {
							autoFocus: true,
							minLength: 2,
							position: { my: "left top", at: "left bottom", collision: "flipfit" },
							source: function (request, response) {
								var _data = { entrycount: false, category: request.term };

								$.getJSON(_me.options.cdb + "/api/data/collections/name/wvtagging", _data, function (data) {
									var _response = [];
									$.each(data, function (i, o) {
										if (o._tagging[0].indexOf(request.term) > -1) {
											_response.push({ label: o._tagging[0], value: o._tagging[0] });
										}
									});

									response($.unique(_response));
								})
							},
							response: function (event, ui) {
								//console.log(ui.content);
							},
							focus: function (event, ui) {
								return false;
							},
							select: function (event, ui) {

								_addItem(ui.item.value)

								$("input[name='qsearch']", _me.element).val("");

								return false;
							}
						};

						$("input[name='qsearch']", _$tagging).on("keydown", function (event) {
							if (event.keyCode === $.ui.keyCode.ENTER && !$(this).xautocomplete("instance").menu.active) {
								_addItem($(this).val());
								$(this).val("");
								event.preventDefault();
							}
						});

						$dwp.ui.autocomplete.init($("input[name='qsearch']", _me.element), _opt);
					}

				},
				// 문서 저장하기
				save: function (opt) {
					console.log("Save Start");

					var _me = this,
						_opt = { isnotblock: false },
						_sysfield = ["actiontype", "docstatus"],
						_xssfnm = "";
					_opt = $.extend(_opt, opt);


					//전자결재의 임시저장이거나 결재의견 입력시에는 Validation을 수행하지 않음 - 2020.08.20 by dwlee
					if ((_opt.hasOwnProperty("applcode") && _opt.applcode == "aprv") && !(opt.docstatus == "draft" || opt.docstatus == "comment")) {
						// validate 수행하기
						if (!$dwp.core.util.validator.validate($("form", _me.element))) { return false; }

						if (_me.options.attach.isattach && _me.options.attach.isvalidate) {
							if (_me.getAttachFileInfo() == null) {
								$fn.alert({ msg: $fn.getCodeMsg("파일을 첨부해주십시요") });
								return false;
							}
						}
					}

					// Custom Validate Call Back Function
					if (typeof _me.options.validateCallback == "function") {
						if (!_me.options.validateCallback(_me)) { return false; }
					}
					if (typeof _opt.validateCallback == "function") {
						if (!_opt.validateCallback(_me)) { return false; }
					}
					// 썸네일 이미지 체크하기
					if ($("#bodyFld", _me.element)[0] != undefined) {
						var _dom = $dwp.ui.weditor.getDom(_me.element);
						if (_dom != null) {
							var _$thumbPos = $("input[name='thumbPos']", _me.element);
							var _medias = $dwp.ui.weditor.getMedia(_me.element);
							var _imgs = $dwp.ui.weditor.getImg(_me.element);
							if (_medias.size() > 0 || _imgs.size() > 0) {
								if (_$thumbPos.size() > 0 && _$thumbPos.val() != "") {
									if (_$thumbPos.val().indexOf("m") > -1) {
										var _idx = parseInt(_$thumbPos.val().replace("m", ""), 10) - 1;
										if (_medias.size() < _idx) {
											$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg027") });
											return false;
										}
									} else {
										var _idx = parseInt(_$thumbPos.val(), 10) - 1;
										if (_imgs.size() < _idx && _$thumbPos.size() < _idx) {
											$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg027") });
											return false;
										}
									}
								}
							}
						}
					}

					// 자동저장 처리 Stop
					if (_me.options.isautosave && _me.options.isedit && !_me.options.ismobile) {
						_me._autoSaveStop();
					}

					// 상단고정 값 체크
					if ($("input[name='isTopFix']", _me.element).size() > 0) {
						if (!$("input[name='isTopFix']", _me.element).is(":checked")) {
							$("<input type='hidden' name='isTopFix' value=''>").appendTo($("form", _me.element))
								.val("");
						}
					}
					$.each(_sysfield, function (i, v) {
						var _$inp;
						if (_opt.hasOwnProperty(v)) {
							_$inp = $("input[name='" + v + "']", _me.element);
							if (_$inp.size() > 0) {
								_$inp.val(_opt[v])
							}
						}
					});
					// 복제충돌을 피하기 위해 수정시 해당 필드을 삭제함.
					var _moddate = $("input[name='%%ModDate']", _me.element);
					if (_moddate.size() > 0) {
						_moddate.remove();
					}
					// XSS 처리 대상 필드 설정하기
					if ($("input[name='ChkXSSFNM']", _me.element).size() > 0) {
						var applcode = _me.options.applcode || "";
						_xssfnm = $("input[type!='hidden']", _me.element).map(function () {
							if ($(this).attr("type") != undefined) {
								if ($(this).attr("type") == "text") {
									//2021-07-30 by 10000hyun > BNGroup 게시판 제목에 Font Color 등등 HTML Code 사용해야해서 applcode기준으로 예외처리
									//return $(this).attr("name");
									if (!(applcode == "sbrd" && $(this).attr("name").toUpperCase() == "SUBJECT")) {
										return $(this).attr("name");
									}
								}
							} else {
								//2021-07-30 by 10000hyun > BNGroup 게시판 제목에 Font Color 등등 HTML Code 사용해야해서 applcode기준으로 예외처리
								//return $(this).attr("name");
								if (!(applcode == "sbrd" && $(this).attr("name").toUpperCase() == "SUBJECT")) {
									return $(this).attr("name");
								}
							}
						}).get().join(";");
						$("input[name='ChkXSSFNM']", _me.element).val(_xssfnm);
					}

					// 날짜 필드 TimeZone값 설정하기
					$("input[data-type=date]", _me.element).each(function () {
						var _timeZoneStr = "",
							_timeStr = "00:00:00",
							_dateStr = "",
							_timeZone = moment().utcOffset() / 60,
							_zoneCode = "",
							_tZoneCode = [],
							_$saveFld = $(this),
							_$saveDateFld = null,
							_$saveTimeFld = null;

						if (moment().isDST()) { _timeZone = _timeZone - 1; }

						_tZoneCode = $dwp.core.lang.getTime(_timeZone).zonecode.split("/");
						if (moment().isDST() && _tZoneCode.length > 1) {
							_zoneCode = _tZoneCode[1];
						} else {
							_zoneCode = _tZoneCode[0];
						}

						if (!moment($(this).xval()).isValid()) return true;

						var _data = $.extend({ fld: "", datefld: "", timefld: "", hour: "", min: "", timezone: "" }, $(this).data());

						//저장 필드 설정
						if (_data.fld != "") {
							_$saveFld = $("input[name='" + _data.fld + "']", _me.element);
							if (_$saveFld.size() == 0) { _$saveFld = $(this); }
						}

						// Date Only
						if (_data.datefld != "") {
							_$saveDateFld = $("input[name='" + _data.datefld + "']", _me.element);
						}
						// Time Only
						if (_data.timefld != "") {
							_$saveTimeFld = $("input[name='" + _data.timefld + "']", _me.element);
						}

						// 시간 필드 설정
						if (_data.hour != "" && _data.min != "") {
							if ($("select[name='" + _data.hour + "']", _me.element).size() > 0 && $("select[name='" + _data.min + "']", _me.element).size() > 0) {
								_timeStr = $("select[name='" + _data.hour + "']", _me.element).xval() + ":" + $("select[name='" + _data.min + "']", _me.element).xval() + ":00";
							}
						}
						// TimeZone
						if (_data.timezone != "") {
							var _$tnm = $("select[name='" + _data.timezone + "']", _me.element);
							if (_$tnm.size() > 0 && _$tnm.xval() != "") {
								_timeZone = _$tnm.xval();
							} else {
								_$tnm = $("input[name='" + _data.timezone + "']", _me.element);
								if (_$tnm.size() > 0) {
									_$tnm.val(_timeZone);
								}
							}
						}

						//_dateStr = moment($(this).xval()).format("YYYY-MM-DD");
						_dateStr = moment($(this).xval()).format($dwp.core.lang.getDateFormat());

						var _date = _dateStr + " " + _timeStr + " " + _zoneCode;
						_$saveFld.val(_date);

						//$(this).val(_date);

						//Date Only
						if (_$saveDateFld != null && _$saveDateFld.size() > 0) {
							var _dateonly = _dateStr + " 00:00:00 " + _zoneCode;
							_$saveDateFld.val(_dateonly);
						}

						//Time Only
						if (_$saveTimeFld != null && _$saveTimeFld.size() > 0) {
							var _timeonly = _timeStr + " " + _zoneCode;
							_$saveTimeFld.val(_timeonly);
						}
					});

					// 이미지 첨부파일 저장하기
					function _imgattachSave() {
						var _deferred = $.Deferred(),
							_promise = null;
						if (_me.imgattach_obj != null) {
							if (_opt.hasOwnProperty("attachformdata")) {
								_me.imgattach_obj.setOptions({ formData: _opt.attachformdata });
							}
							_promise = _me.imgattach_obj.submit();
							if (_promise) {
								_promise.done(function (_rtn) {
									if (_rtn.length > 0) {
										var _mega = [],
											_folder = "",
											_fname = [];
										$("input[name='Multi_Attach_Files']", _me.element).val($.map(_rtn, function (o, i) {
											_folder = o.folder;
											_fname.push(o.filename);
											return o.folder + "/" + o.filename;
										}).join(";"));

										$("input[name='Multi_Attach_SortFiles']", _me.element).val($.map(_me.imgattach_obj.getFileData(), function (o, i) {
											return o.name;
										}).join(";"));
										/*
										if (_me.options.attach.islocal) {
											$("input[name='Multi_Attach_Type']", _me.element).val("L");
											$("input[name='Multi_Attach_Info']", _me.element).val("{}");
										}
										*/
									}
									if (_opt.hasOwnProperty("attachcallback") && typeof _opt.attachcallback == "function") {
										_opt.attachcallback(_rtn);
									}
									_deferred.resolve();
								});
								_promise.fail(function (e, o) {
									_me.imgattach_obj.reset();
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg028") })
										.done(function () {
											$.unblockUI();
											_deferred.reject();
										});
								});
							} else {
								$("input[name='Multi_Attach_SortFiles']", _me.element).val($.map(_me.imgattach_obj.getFileData(), function (o, i) {
									return o.name;
								}).join(";"));
								_deferred.resolve();
							}
						} else {
							_deferred.resolve();
						}
						return _deferred;
					}

					// 첨부파일 저장하기
					function _attachSave() {
						var _deferred = $.Deferred(),
							_promise = null;
						if (_me.attach_obj != null) {
							if (_opt.hasOwnProperty("attachformdata")) {
								_me.attach_obj.setOptions({ formData: _opt.attachformdata });
							}
							_promise = _me.attach_obj.submit();
							if (_promise) {
								_promise.done(function (_rtn) {
									if (_rtn.length > 0) {
										console.log("_rtn", _rtn);
										var _mega = [],
											_folder = "",
											_fname = [],
											_isfsize = false;
										$("input[name='Multi_Attach_Files']", _me.element).val($.map(_rtn, function (o, i) {
											if (o.size == "0" || o.size == "") _isfsize = true;
											if (o.hasOwnProperty("ismega") && o.ismega) {
												_mega.push(o);
											} else {
												_folder = o.folder;
												_fname.push(o.filename);
												return o.folder + "/" + o.filename;
											}
										}).join(";"));

										var _attachfile = _me.attach_obj.getFileData();
										$("input[name='Multi_Attach_SortFiles']", _me.element).val($.map(_attachfile, function (o, i) {
											if (!o.ismega) { return o.name; }
										}).join(";"));
										$("input[name='Multi_Attach_SortFilesSize']", _me.element).val($.map(_attachfile, function (o, i) {
											if (!o.ismega) { return o.size; }
										}).join(";"));

										$("input[name='Multi_Attach_WebFolder']", _me.element).val($.map(_attachfile, function (o, i) {
											console.log("file name:", o.name);
											if (o.iswebfolder) { return o._downfilenm + "|" + o._filedbpath + "|" + o._fileunid; }
										}).join(";"));

										if (_me.options.attach.islocal) {
											$("input[name='Multi_Attach_Type']", _me.element).val("L");
											$("input[name='Multi_Attach_Info']", _me.element).val("{}");
										}
									}
									if (_isfsize) {
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg028") })
											.done(function () {
												if (!_opt.isnotblock) { $.unblockUI(); }
												_deferred.reject();
											});
									} else {
										if (_opt.hasOwnProperty("attachcallback") && typeof _opt.attachcallback == "function") {
											_opt.attachcallback(_rtn);
										}
										_deferred.resolve(_mega);
									}
								});
								_promise.fail(function (e, o) {
									//alert("첨부파일 업로드시 오류가 발생했습니다!");
									_me.attach_obj.reset();
									var _msg = $fn.getCodeMsg("comm.msg.msg028");
									if (e.hasOwnProperty("message")) {
										_msg = "\n" + e.message;
									}
									console.log("File Attach Error", e);
									$fn.alert({ msg: _msg })
										.done(function () {
											if (!_opt.isnotblock) { $.unblockUI(); }
											_deferred.reject();
										});
									//$.unblockUI();
									//return false;
								});
							} else {
								var _attachfile = _me.attach_obj.getFileData();
								console.log("Promise Is Null", _attachfile);
								$("input[name='Multi_Attach_SortFiles']", _me.element).val($.map(_attachfile, function (o, i) {
									console.log("file name:", o.name);
									if (!o.ismega) { return o.name; }
								}).join(";"));
								$("input[name='Multi_Attach_SortFilesSize']", _me.element).val($.map(_attachfile, function (o, i) {
									if (!o.ismega) { return o.size; }
								}).join(";"));

								$("input[name='Multi_Attach_WebFolder']", _me.element).val($.map(_attachfile, function (o, i) {
									console.log("file name:", o.name);
									if (o.iswebfolder) { return o._filedbpath + "|" + o._fileunid + "|" + o._downfilenm + "|" + o.name }
								}).join(";"));

								_deferred.resolve();
							}
						} else {
							_deferred.resolve();
						}
						return _deferred;
					}

					function _setbody(mega) {
						var _deferred = $.Deferred();
						var _$mime = $("input[name='MIMESweeper']", _me.element);
						if ($("#bodyFld", _me.element)[0] != undefined) {
							if (_$mime.size() > 0) { _$mime.val("1"); }
							// 요약 이미지 처리하기
							var _$thumbPos = $("input[name='thumbPos']", _me.element),
								_thumbPos = "0";
							var _$imgDataUrl = $("input[name='imgDataURL']", _me.element);
							var _$mediaFid = $("input[name='mediafid']", _me.element);
							var _$mediaUrl = $("input[name='mediaUrl']", _me.element);
							if (_$thumbPos.size() > 0) {
								_thumbPos = _$thumbPos.val();
								_$thumbPos.val("0");
							}
							if (_$imgDataUrl.size() > 0) { _$imgDataUrl.val(""); }
							if (_$mediaFid.size() > 0) { _$mediaFid.val(""); }
							if (_$mediaUrl.size() > 0) { _$mediaUrl.val(""); }

							var _dom = $dwp.ui.weditor.getDom(_me.element);
							if (_dom != null) {
								var _medias = $dwp.ui.weditor.getMedia(_me.element);
								var _imgs = $dwp.ui.weditor.getImg(_me.element);
								if (_medias.size() > 0 || _imgs.size() > 0) {
									if (_$imgDataUrl.size() > 0) {
										var _pos = 0,
											_dataURL, _img = null,
											_media = null;

										if (_thumbPos.indexOf("m") > -1) {
											_pos = parseInt(_thumbPos.replace("m", ""), 10) - 1;
											_media = _medias.get(_pos);

											if (_media) {
												if ($(_media).has("name") && $(_media).attr("name") == "dwp_media") {
													//_dataURL = "/wps/PA_DWP_WENMedia/wenMedia/proxy.jsp?" + _$$.doc._CONST.wenMediaRest + $(_media).attr("fileid") + "/thumbnail;idx=1;size=300*225";
													_dataURL = "/wenmediarest/" + $(_media).attr("fileid") + "/thumbnail;idx=1;size=300*225";
													if (_$mediaFid.size() > 0) {
														_$mediaFid.val($(_media).attr("fileid"));
													}
													if (_$mediaUrl.size() > 0) {
														_$mediaUrl.val($(_media).attr("src"));
													}
												} else {
													var _src = $(_media).attr("src"),
														_regexp = /\/embed\/([\S]+)/,
														_match = _regexp.exec(_src);
													if (_match) {
														_dataURL = "http://img.youtube.com/vi/" + _match[1] + "/0.jpg";
														if (_$mediaFid.size() > 0) {
															_$mediaFid.val(_match[1]);
														}
														if (_$mediaUrl.size() > 0) {
															_$mediaUrl.val($(_media).attr("src"));
														}
													}
												}
												_$imgDataUrl.val(_dataURL);
												_$thumbPos.val(_pos + 1);
											}
										} else {
											_pos = (parseInt(_thumbPos, 10) == 0) ? 0 : parseInt(_thumbPos, 10) - 1;
											_img = _imgs.get(_pos);
											if (_img) {
												//var regExp = new RegExp("^\/|^http:\/\/" + window.location.host, "gi");
												var regExp;
												if ($dwp.core.util.getDeviceInfo.type() != "PC" && typeof dwpmo == "object") {
													regExp = new RegExp("^\/|^http:\/\/|^https:\/\/" + dwpmo.info.domain, "gi");
												} else {
													regExp = new RegExp("^\/|^http:\/\/" + window.location.host, "gi");
												}
												if (regExp.test(_img.src)) {
													_dataURL = $dwp.core.util.imageResize(_img, { isdataurl: false });
												} else {
													var regExp2 = /data\:(image\/[^;]+);base64,(.*)/gi;
													if (regExp2.test(_img.src)) {
														_dataURL = $dwp.core.util.imageResize(_img, { isdataurl: true });
													} else {
														_dataURL = _img.src;
													}
												}
												_$imgDataUrl.val(_dataURL);
												_$thumbPos.val(_pos + 1);
											} else {
												_media = _medias.get(_pos);
												if (_media) {
													if ($(_media).has("name") && $(_media).attr("name") == "dwp_media") {
														//_dataURL = "/wps/PA_DWP_WENMedia/wenMedia/proxy.jsp?" + _$$.doc._CONST.wenMediaRest + $(_media).attr("fileid") + "/thumbnail;idx=1;size=300*225";
														_dataURL = "/wenmediarest/" + $(_media).attr("fileid") + "/thumbnail;idx=1;size=300*225";
														if (_$mediaFid.size() > 0) {
															_$mediaFid.val($(_media).attr("fileid"));
														}
														if (_$mediaUrl.size() > 0) {
															_$mediaUrl.val($(_media).attr("src"));
														}
													} else {
														var _src = $(_media).attr("src"),
															_regexp = /\/embed\/([\S]+)/,
															_match = _regexp.exec(_src);
														if (_match) {
															_dataURL = "http://img.youtube.com/vi/" + _match[1] + "/0.jpg";
															if (_$mediaFid.size() > 0) {
																_$mediaFid.val(_match[1]);
															}
															if (_$mediaUrl.size() > 0) {
																_$mediaUrl.val($(_media).attr("src"));
															}
														}
													}
													_$imgDataUrl.val(_dataURL);
													_$thumbPos.val(_pos + 1);
												}
											}
											//$("input[name='thumbPos']", _me.element).val(_pos+1);
										}
									}
								}

								if (typeof mega != "undefined" && mega.length > 0) {

									if (typeof _opt.megacallback == "function") {
										var _h = _opt.megacallback(mega, _me);

										if (_me.options.ismobile) {
											$("#xfe_ed", _me.element).prepend(_h);
										} else {
											$("body", _dom).prepend(_h);
										}
									}
									/*
									var _h = "<br><div style=\"width: 736px !important; border: 1px solid #cfcfcf !important; border-top: 2px solid #ed6c00 !important;\">";
									_h += "<TABLE border=0 width=\"100%\" cellpadding=0 cellspacing=0 style=\"font-size:10pt;\">";
									_h += "<TR height='20'><TD style=\"padding: 6px 15px; color: #333; font-size: 14px; font-weight: 700; text-align: left;\">" + $fn.getCodeMsg("comm.title.js007") + "</TD></TR>";
									_h += "<TR height='20'><TD style=\"padding: 0 15px 6px; color: #333; font-size: 13px; font-weight: 400; text-align: left;\">" + $fn.getCodeMsg("comm.title.js008") + "</TD></TR>";
									_h += "<TR height='20'>";
									_h += "<TD style=\"padding: 6px 15px; border-top: 1px solid #ddd; color: #333; font-size: 13px; font-weight: 700; text-align: left;\">";
									_h += "<font style='color:blue;'>" + $fn.getCodeMsg("comm.title.js009") + " : </font>";
									$.each(mega, function(i, o){
										if (o.fileurl) {
											_h += "<a href='http://" + window.location.host + "/" + o.fileurl + "' download target='_blank' style='text-decoration:none;color:black;cursor:pointer;'";
											_h += "onmouseover='this.style.textDecoration=\"underline\";this.style.color=\"blue\";' onmouseout='this.style.textDecoration=\"none\";this.style.color=\"black\";'>" + o.filename + "</a>";
										}
									});
									_h += "</TD>";
									_h += "</TR>";
									_h += "</TABLE>";
									_h += "</div>";

									if (_me.options.ismobile) {
										$("#xfe_ed", _me.element).append(_h);
									} else {
										$("body", _dom).append(_h);
									}
									*/
								}

								if (typeof _opt.appendbody == "function") {
									var _h = _opt.appendbody(_me);

									if (_me.options.ismobile) {
										$("#xfe_ed", _me.element).append(_h);
									} else {
										$("body", _dom).append(_h);
									}
								}
							}
							$dwp.ui.weditor.getMimeValue(_me.element, function (bodyVal) {
								//console.log("bodyVal",bodyVal);
								$("#Body", $('form', _me.element)).val(bodyVal);
								$("#bSummary", $('form', _me.element)).val($dwp.ui.weditor.getTextValue(_me.element).replace(/\n/g, "").substr(0, 200));

								_deferred.resolve();

								//if ( typeof (callback) == "function") {
								//    callback();
								//}
							});
						} else {
							if (_$mime.size() > 0) { _$mime.val("0"); }
							//if ( typeof (callback) == "function") {
							//    callback();
							//}
							_deferred.resolve();
						}
						return _deferred;
					}

					function _submit() {
						var _exformData = {};
						$.each($('form input[type=checkbox]', _me.element).filter(function (idx) {
							return ($("form input[name=" + $(this).attr('name') + "][type=checkbox]:checked", _me.element).size() == 0);
							//return $(this).prop('checked') === false
						}),
							function (idx, el) {
								// attach matched element names to the formData with a chosen value.
								var emptyVal = "";
								_exformData[$(el).attr('name')] = emptyVal;
							}
						);
						$("form", _me.element).ajaxSubmit({
							//iframe : true
							dataType: "text"
							//skipEncodingOverride : ( typeof(DocData.skipEncodingOverride) == "undefined" ? false : DocData.skipEncodingOverride ),
							,
							beforeSubmit: function (arr, $form, options) { },
							data: _exformData,
							success: function (data, statusText, xhr, $form) {
								var _jdata = null;
								if (data.indexOf("=RTNJS=") > -1) {
									// JavaScript 수행
								} else {
									try {
										_jdata = $.parseJSON(data)
										if (_opt.hasOwnProperty("callback")) {
											_opt.callback(_jdata, _me);
										} else {
											_me.goview({ type: "", unid: _jdata.unid, viewreload: true });
										}
									} catch (e) {
										var _rtn = $.extend({ code: "", msg: "comm.msg_mo.msg003" }, $dwp.core.util.xAjaxDataCheck(data));
										$fn.alert({ msg: $fn.getCodeMsg(_rtn.msg) });
									};
								}
								if (!_opt.isnotblock) { $fn.unblock(); }
								if (!_opt.hasOwnProperty("callback")) {
									$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg029") });
								}
							},
							error: function (xhr, textStatus) {
								if (!_opt.isnotblock) { $.unblockUI(); }
								return false;
							}
						});

						return true;
					}

					if (!_opt.isnotblock) { $fn.block(undefined, { notusemsg: _me.options.ismobile }); }

					if (_me.options.imgattach.isattach) {
						_imgattachSave().then(
							function () { return _setbody(); },
							function () { console.log("Fail Attach") })
							.done(function () {
								_submit();
							});
					} else {
						_attachSave().then(
							function (mega) { return _setbody(mega); },
							function () {
								if (typeof _opt.attacherror == "function") {
									_opt.attacherror(_me);
								}
								console.log("Fail Attach");
							})
							.done(function () {
								_submit();
							});
						//_attachSave(function() {
						//    _submit();
						//});
					}
				},
				destroy: function () {
					var _me = this;
					console.log("Doc Destory");

					// $fn.confirm({msg : $fn.getCodeMsg("문서가 편집 중입니다.\n 종료하시겠습니까?")})
					// .done(function(){ _ok(); })

					$dwp.ui.weditor.destroy(_me.element);

					if (_me.autoSaver.timer) {
						console.log("autoSaver.timer Destory");
						clearTimeout(_me.autoSaver.timer);
						_me.autoSaver.timer = null;
					}
					if (_me.autoSaver.rtimer) {
						console.log("autoSaver.rtimer Destory");
						clearTimeout(_me.autoSaver.rtimer);
						_me.autoSaver.rtimer = null;
					}

					if (!_me.options.contextmenu) {
						$dwp.core.portal.contextMenu.off(_me.element);
					}

					_me.element.off("keydown");
					_me.element.empty();
					_me._super();

				}
				// End
			});
		},
		getInstance: function (el) {
			var _$el = $(el) || $("div.dwp-wrapping", $dwp.core.getContent());
			return $(el).data("dwp-doc");
		},
		getOptions: function (el) {
			var _$el = $(el) || $("div.dwp-wrapping", $dwp.core.getContent());
			if (this.getInstance(_$el)) {
				return this.getInstance(_$el).getOptions();
			} else {
				return null;
			}
		}
	}

})($dwp.cns("core"), jQuery);











