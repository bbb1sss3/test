/**
 * <b>View 라이브러리</b>
 * <br>보기처리를 하기위한 Widget를 정의합니다.
 * @module core/view
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.view|core.view}
 */
(function ( /** @lends	module:core~$dwp.core */ _$$, $) {
	/**
	 * View Widget 처리함수
	 * @namespace
	 */
	_$$.view = {
		_MODULE_NM: "dwp.view",
		_ROW_DATA: "dwp.view.rowdata",
		_CONST: {
			ASC: "ascending",
			DES: "descending",
			ACTION: {
				READHISTORY: "read_history" //읽음여부
				,
				LIKEIT: "likeit" //좋아요
			},
			BOOKMARK_MAP: "Type`}ApplCode`}R_UNID`}R_KEY_UNID`}R_DBPATH`}R_LINK`}Category`}Subject`}DOC_NO`}B_UNID`}B_DBPATH"
		},
		_default: {
			category: ""
		}
		/**
		 * View Instance 생성함수
		 * @param	{object}	opt		view option
		 * @param	{object=}	el		view 생성 object
		 * @return	view object
		 */
		,
		init: function (opt, el) {
			//var _$el = el || $("div.dwp-wrapping", $dwp.core.getContent()),
			//_opt = {};
			//_opt = $.extend({}, this._default, opt);

			var _$el = null,
				_opt = $.extend({}, this._default, opt),
				_topt = { type: "", selector: "" };

			if (_opt.hasOwnProperty("did") && _opt.did != "") {
				_topt.type = "did";
				_topt.selector = "#" + _opt.did;
			} else if (_opt.ismobile) {
				_topt.type = "mobile";
				_topt.layer = (_opt.layer ? _opt.layer : "view");
			};

			_$el = el || $dwp.core.getTarget(_topt);

			console.log("view", _$el);

			if (typeof $.fn.view == "undefined") {
				this._create();
			}

			_$el.view(_opt);

			return _$el.view("instance");
		}
		/**
		 * View widget 생성
		 */
		,
		_create: function () {
			var _par = this;
			$.widget(_par._MODULE_NM, {
				/**
				 * View Option
				 * @property	{object}	options
				 * @property	{string}	options.cdb				현재DB 경로
				 * @property	{string}	options.sublogdb		로그DB 경로
				 * @property	{string}	options.pathinfo		호출URL
				 * @property	{string}	options.applcode		Appl Code
				 * @property	{string}	options.viewtype		보기유형(list, card, thumb, mix, custom)
				 * @property	{array}		options.useviewtypelist	사용할 수 있는 보기유형
				 * 													- 기본값 : ["list", "card", "thumb", "mix"]
				 * @property	{boolean}	options.ispreview		미리보기 기능 사용여부
				 * @property	{string}	options.preview			미리보기 유형 ( "plr", "pud", "all" )
				 * @property	{string}	options.did				View 대상ID(다이얼로그 형태로 띄우는 경우)
				 * @property	{boolean}	options.ismobile		모바일보기 여부
				 * @property	{string}	options.ispopupdoc		문서열기 방식 (default : "")
				 * 													( "1" : 새창, "2" : layer 다이얼로그, "" : content area )
				 * @property	{string}	options.ispagenavi		페이지 네비 사용여부 ( default : true )
				 * @property	{boolean}	options.isadmin			관리자 여부 ( default : false )
				 * @property	{boolean}	options.isconowner		컨탠츠 담당자 여부 ( default : false )
				 * @property	{boolean}	options.isnotreplyedit	댓글 수정/삭제 권한여부(본인 작성 포함)( default : false )
				 * @property	{string}	options.viewalias		보기명
				 * @property	{string}	options.jdata			보기 Json Data 호출Url
				 * @property	{string}	options.jtl				보기 템플릿 호출Url
				 * @property	{string}	options.single			Single 카테고리
				 * @property	{string}	options.singlesearch	Single 카테고리가 있는 경우 검색조건
				 * @property	{string}	options.singlefld		Single Category Field명 ( default : Category )
				 * @property	{boolean}	options.usesingleall	Single 카테고리에 "All" 사용여부 ( default : false )
				 * @property	{boolean}	options.isdefaultsingle	Single 카테고리 Default 값 사용여부 ( default : true )
				 * @property	{string}	options.entrycount		전체건수 설정방식 - "ajax", "agent"
				 * @property	{number}	options.ps				Page Count
				 * @property	{number}	options.page			Page
				 * @property	{number}	options.total			전체건수
				 * @property	{number}	options.navi			페이지 navi 갯수
				 * @property	{boolean}	options.iscategory		Single 카테고리 사용여부 ( default : false )
				 * @property	{boolean}	options.issort			정렬사용여부 ( default : false )
				 * @property	{boolean}	options.usetopfix		고정상단 사용여부 ( default : false )
				 * @property	{boolean}	options.useviewsetting	보기설정 사용여부 ( default : true )
				 * @property	{boolean}	options.isnotthumbimg	thumb이미지 표시여부 ( default : false )
				 * @property	{boolean}	options.islikecnt		좋아요 표시여부	( default : true )
				 * @property	{boolean}	options.isviewreadcnt	조회카운트 표시여부	( default : true )
				 * @property	{object}	options.notimsg			공지 설정정보
				 * @property	{boolean}	options.notimsg.isuse	공지 사용여부		( default : false )
				 * @property	{string}	options.notimsg.url		공지 호출URL
				 * @property	{object}	options.header			보기헤더 정보
				 * @property	{object}	options.button			보기 버튼정보
				 * @property	{function(*, *)}	options.loadComplete	보기완료 후 처리 함수
				 * @property	{event}		options.loadComplete.ev			보기 완료 Event
				 * @property	{object}	options.loadComplete.view		보기 instance
				 * @property	{string}	options.selector				custom보기인 경우, 보기본문영역 query selector
				 * @property	{string}	options.moreview				모바일 더보기 시, 대상 query selector
				 * @property	{string}	options.mcatetype				모바일 분류보기 유형 (default : tab)
				 * @property	{boolean}	options.ismenucate				모마일 메뉴분류보기 자동 가졍오기여부 (default : true)
				 * @property	{string}	options.layer					모바일 layer
				 * @property	{boolean}	options.ismcreate				모바일 작성아이콘 표시여부(권한)	(default : true)
				 * @property	{string}	options.navitype				모바일 네비유형 기본 더보기(page)
				 * @property	{array}		options.detailsearch			상세검색설정
				 * @property	{string}	options.detailsearch.nm			검색조건명
				 * @property	{string}	options.detailsearch.fld		검색조건대상필드명
				 * @property	{string}	options.detailsearch.type		검색조건유형(txt, select, date, xlang, codesel)
				 * @property	{string}	options.detailsearch.key		검색조건Key 필드명
				 * @property	{array=}	options.detailsearch.code		검색조건유형이 select인 경우
				 * @property	{string}	options.detailsearch.code.txt	select text
				 * @property	{string}	options.detailsearch.code.val	select value
				 * @property	{object=}	options.detailsearch.xlang		검색조건유형이 xlang인 경우
				 * @property	{string}	options.detailsearch.xlang.lc	언어변환 Type
				 * @property	{string}	options.detailsearch.xlang.type	select
				 */
				options: {
					cdb: "" // 현재 DB Path
					,
					sublogdb: "" // 로그 DB Path
					,
					sysinfo: {} // 시스템 정보
					,
					pathinfo: "" // 호출 URL
					,
					applcode: "" // 어플코드
					,
					displaycode: "" // 화면코드(환경설정 값 저장용)
					,
					viewtype: "list" // 보기유형(list, card, thumb, mix, custom)
					,
					useviewtypelist: ["list", "card", "thumb", "mix"] //사용 보기유형
					,
					ispreview: true // 미리보기 기능 사용여부
					,
					preview: "all" // preview type
					,
					did: "" // Parents Target ID
					,
					ismobile: false // 모바일보기 여부
					,
					ispopupdoc: "" // 문서 열기 방식
					,
					ispagenavi: true // 페이지 네비 사용여부
					,
					isadmin: false // 관리자 여부
					,
					isconowner: false // 컨탠츠 담당자 여부
					,
					isnotreplyedit: false // 댓글 수정 삭제 권한 여부(본인 작성 포함)
					,
					viewalias: "" // 보기명
					,
					jdata: "" // JSON Data URL
					,
					jtl: $dwp.core.getPath("weblib") + "/jtl/core/wvlist.jtl" // JTL
					,
					single: "" // Single 카테고리
					,
					singlesearch: "" // Single Search Query
					,
					singlefld: "Category" // Single Category Field
					,
					usesingleall: false // Single All 사용여부
					,
					entrycount: "" // 전체건수 - 에이전트 건수인 경우 ag
					,
					ps: 5 // Page Count
					,
					page: 1 // 페이지
					,
					total: 0 // 전체 건수
					,
					navi: 10 // 페이지 navi 갯수
					,
					iscategory: false // 분류
					,
					issort: false // 정렬사용여부
					,
					usetopfix: false // 상단고정여부
					,
					useviewsetting: true // 보기설정 사용여부
					,
					viewsetting: { // 항목별 보기설정 사용여부
						useviewcount: true // 목록갯수
						,
						useviewtype: true // 보기유형
						,
						usepreview: true // 미리보기
						,
						usepopupdoc: true // 문서열기
					},
					isnotthumbimg: false // thumb이지지 표시여부
					,
					islikecnt: true // 좋아요 표시여부
					,
					isviewreadcnt: true // 조회카운트 표시여부
					,
					notimsg: { isuse: false, url: "" } // 공지 설정정보
					,
					header: {} // view Header Info
					//,search : {}				// 검색 조건
					,
					button: null // 버튼 정보
					,
					mbtnlist: "" // 모바일용 버튼정의
					,
					loadComplete: null // 보기완료 후 처리 함수
					,
					isdefaultsingle: true // Default Single 부여여부
					,
					isselectall: true // Category 전체표시여부
					,
					_single: "" // 임시 카테고리
					,
					_singlesearch: "" //
					,
					selector: "" // custom보기 처리인 경우
					,
					moreview: "" // 더보기 시, 대상 Selector
					,
					mcatetype: "tab" // 모바일 분류보기 유형 (tab)
					,
					mcatedata: [] // 모바일 분류보기 Data(기본은 Category) -- 사용안함.
					,
					ismenucate: true // 모마일 메뉴분류보기 자동 가졍오기여부
					,
					ismcreate: true // 모바일 작성아이콘 표시여부(권한)
					,
					layer: "" // 모바일 layer
					,
					navitype: "page" // 모바일 네비유형 기본 더보기, page
					//,_selcate : ""			// 모바일 3Deth 위치정보용
					,
					detailsearch: null // 상세검색
					,
					isresponse: false // 응답문서

					,
					isctrlkeyboard: true //키보드제어 기본옵션 - 2020.03.31 by dwlee
					,
					iscontextmenu: false //ContenxtMenu 팝업 옵션 - 2020.03.31 by dwlee

					,
					isdragable: true //마우스 드래그시 체크박스 선택이 반전되는 옵션 - 2020.03.12 by dwlee
					//,contextmenu : {items : "", callback:null}//마우스 우측 버튼 클릭시 팝업메뉴 정의 - 2020.03.12 by dwlee
					,
					contextmenu: {},
					isctrlclicked: false //ctrl 키 클릭여부 - 2020.03.12 by dwlee
					,
					clickedtr: "" //클릭한 tr의 키값 - 2020.03.12 by dwlee
					,
					selectedtr: "" //선택한 tr의 키값 - 2020.03.12 by dwlee

				},
				_create: function () {
					//this.element.html("dwp.view")
				}
				/**
				 * view options 리턴함수
				 * @return	{object}	view options
				 */
				,
				getOptions: function () {
					return this.options;
				}
				/**
				 * view options 정보설정함수
				 * @param	{object}	options	view options
				 */
				,
				setOptions: function (options) {
					$.extend(this.options, options);
					// 새로고침여부 ???
				}
				/**
				 * 미리보기 Page Loading
				 * @param	{object}	opt			options
				 * @param	{string}	opt.url		호출 Url
				 */
				,
				_previewLoadPage: function (opt) {
					var _me = this,
						_$doc = null,
						_$preview = $("div.dwp-contents-preview", _me.element),
						_$wrap = $("div.dwp-wrapping", _$preview),
						_opt = $.extend({ url: "" }, opt);

					if (_$wrap.size() == 0) {
						_$wrap = $("<div class='dwp-wrapping'></div>").appendTo(_$preview);
					} else {
						_$doc = $fn.getInstance("doc", undefined, { type: "preview" });
						if (_$doc != null) {
							_$doc.destroy();
						}
					}
					if (_opt.url == "") {
						var _h = "<div class='empty-guide'><div class='inner'>"
						_h += "<img src='" + $fn.getPath("weblib") + "/images/common/icon-doc.svg'>" + $fn.getCodeMsg("comm.title.js041");
						_h += "</div></div>";

						_$wrap.html(_h);
						return;
					}
					_$$.util.xAjax({
						url: $dwp.core.util.getProxyUrl(_opt.url),
						dataType: "html",
						async: false,
						cache: false,
						data: { preview: "1" }
					})
						.done(function (html) {
							_$wrap.html(html);
						})
						.fail(function () { });

					var _lnb = $("div.dwp-lnb-wrap", $dwp.core.getLnb()).data($dwp.core.portal._CONST._DATA.LNB);
					$dwp.core.logging({ linktype: "PAGE", link: $dwp.core.util.getProxyUrl(_opt.url), lnb: _lnb });
				}
				/**
				 * 모바일 Header 보기 검색 보기 및 숨기기처리
				 */
				,
				mSearchToggle: function () {
					var _me = this,
						_$search = $("div.search-trigger", _me.element.parents("div.dwp-mobile-area")),
						_$sinp = $("input[name='search']", _$search);

					_$search.show();

					// 초기화
					if (_me.options.searchview) {
						$(".search-form-m", _$search).addClass("active");
						var _qrylist = _me.options.searchqry.split("and");
						var _qry = $.trim(_qrylist[_qrylist.length - 1]);
						_$sinp.val(_qry.replace("(", "").replace(")", ""));
					} else {
						$(".search-form-m", _$search).removeClass("active");
						_$sinp.val("");
					}
				}
				/**
				 * 모바일 분류처리함수
				 */
				,
				mCateToggle: function () {
					var _me = this,
						_$tabs = _me.element.parents("div.dwp-container-m").children("div.dwp-3depth-nav");

					if ((_me.options.iscategory || _me.options.mcatedata.length > 0) && _me.options.mcatetype == "tab") {
						//if (_$tabs.size() > 0) {
						//	_$tabs.addClass("active");
						//}
						_me._cateMProc(true);
					} else {
						if (_$tabs.size() > 0) {
							_$tabs.removeClass("active");
						}
					}
				}
				/**
				 * 모바일 toggle버튼 처리
				 */
				,
				mCreateBtnToggle: function () {
					var _me = this,
						_$btn = $("div.dwp-footer-m a.btn-write-m", _me.element.parents("div.dwp-mobile-area"));

					if (_me.options.ismcreate) {
						_$btn.show();
					} else {
						_$btn.hide();
					}
				}
				/**
				 * 선택된 문서를 공유하기위한 공유다이얼로그 창이 표시됩니다.
				 * @param	{object=}	opt				options
				 * @param	{string}	opt.type		공유유형 ( "0",  "1")
				 * @param	{object=}	opt.actiontype	공유대상( VPR : "VSHARE", BookMark : "" )
				 */
				,
				sharedDoc: function (opt) {
					var _me = this,
						_opt = $.extend({ type: "0", actiontype: "VSHARE" }, opt),
						_bookobj = {},
						_bookinfo = "";

					var _rows = _me.getChecked()
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg002") });
						return;
					}

					var _unid = [],
						_key_unid = [],
						_link = [];
					$.each(_rows, function (i, o) {
						_unid.push(o["@unid"]);
						_key_unid.push(o._key_unid);
						_link.push(_me.options.cdb + "/" + _me.options.viewalias + "/" + o["@unid"] + "?opendocument");
					});

					_bookobj.Type = _opt.type;
					_bookobj.ApplCode = _me.options.applcode;
					if (_opt.type == "1") {
						_bookobj.R_UNID = "";
						_bookobj.R_KEY_UNID = "";
						_bookobj.R_DBPATH = "";
						_bookobj.R_LINK = "";
						_bookobj.B_UNID = _unid.join(";");
						_bookobj.B_DBPATH = _me.options.cdb;
					} else {
						_bookobj.R_UNID = _unid.join(";");
						_bookobj.R_KEY_UNID = _key_unid.join(";");
						_bookobj.R_DBPATH = _me.options.cdb;
						_bookobj.R_LINK = _link.join(";")
						_bookobj.B_UNID = "";
						_bookobj.B_DBPATH = "";
					}

					_bookinfo = _$$.util.getObjStr(_$$.view._CONST.BOOKMARK_MAP, _bookobj, "`}").fullinfo;
					//console.log("_bookinfo", _bookinfo);
					$dwp.ui.shareddoc(null, { bookinfo: _bookinfo, actiontype: _opt.actiontype, ismobile: _me.options.ismobile });
				}
				/**
				 * Excel DownLoad 다이얼로그 창이 표시됩니다.
				 * @param	{object=}	opt				options
				 * @param	{string}	opt.applcode	Appl Code
				 * @param	{string}	opt.cdb			대상 DBPath
				 */
				,
				exceldownload: function (opt) {
					var _me = this,
						_opt = $.extend({ applcode: _me.options.applcode, cdb: _me.options.cdb }, opt);

					_$$.util.exceldown(_opt);
				}
				/**
				 * Excel DownLoad Javascript
				 * @param	{object=}	opt				options
				 * @param	{string}	opt.filenm		저장할 Excel 파일명
				 * @param	{string}	opt.title		제목
				 * @param	{number}	opt.count		한번에 가져올 건수 (default : 100)
				 */
				,
				exceldownload_view: function (opt) {
					var _me = this,
						_opt = $.extend({ filenm: "", title: "", count: 100 }, opt),
						_template = "",
						_columncnt = 0;

					if (!_me.options.header.hasOwnProperty("excel_colnm")) return;

					_columncnt = _me.options.header.excel_colnm.length;

					function _initHeader() {
						_template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
						_template += '	<head>';
						_template += '	<meta charset="utf-8">';
						_template += '		<!--[if gte mso 9]>';
						_template += '			<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
						_template += '				<x:Name>Worksheet</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>';
						_template += '				</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>';
						_template += '			</xml>';
						_template += '		<![endif]-->';
						_template += '	</head>';
						_template += '	<body>';
					}

					function _initTitle() {
						_template += '		<table border=1>';
						_template += '		<tr><td colspan="' + _columncnt + '"></td></tr>';
						_template += '		<tr><td colspan="' + _columncnt + '" align=center ><b><font size=12>' + _opt.title + '</font></b></td></tr>';
						_template += '		<tr><td colspan="' + _columncnt + '"></td></tr>';
						_template += '		<tr>';

						$.each(_me.options.header.excel_colnm, function (i, v) {
							var _cell = _me.options.header.excel_col[v];

							if (typeof _cell == "undefined") return true;
							if (_cell.type == "thumbbtn") return true;
							if (_cell.width && _cell.width != "") {
								_template += '			<td width="' + _cell.width + '" align=center bgcolor=skyblue><b>' + _cell.title + '</b></td>';
							} else {
								_template += '			<td align=center bgcolor=skyblue><b>' + _cell.title + '</b></td>';
							}
						});
						_template += '		</tr>';
					}

					function _jsonGetParmData(page) {
						var _data = {},
							_url = _me.options.cdb + "/api/data/collections/name/" + _me.options.viewalias,
							_folderunid = _me.options.folderunid || "";

						if (_folderunid != "") {
							_url = _me.options.cdb + "/api/data/collections/unid/" + _me.options.folderunid
						}

						_url += "?ps=" + _opt.count;
						_url += "&page=" + (page);

						if (typeof _me.options.sortnm != "undefined" && _me.options.sortnm != "") {
							_data.sortcolumn = _me.options.sortnm;
						}
						if (typeof _me.options.sortorder != "undefined" && _me.options.sortorder != "") {
							_data.sortorder = _me.options.sortorder;
						}
						if (_me.options.single != "" && !_me.options.searchview) {
							_data.category = _me.options.single;
						}
						if (_me.options.searchview) {
							_data.search = _me.options.searchqry;
						}
						if (_me.options.entrycount != "" && !_me.options.searchview) {
							_data.entrycount = "false";
						}

						return {
							url: _url,
							dataType: "json",
							async: true,
							cache: false,
							data: _data
						};
					}

					function _convertData(cell, o) {
						var _h = "",
							_v = ($.isArray(o[cell.name]) ? o[cell.name][0] : o[cell.name]),
							_header = _me.options.header;

						if (cell.type == "date") {
							_h = $dwp.core.util.formatDateTime(_v, "dateonly");
						} else if (cell.type == "fnc" && typeof cell.content == "function") {
							return cell.content(o);
						} else if (cell.type == "code" && cell.hasOwnProperty("langcode")) {
							return $dwp.core.lang.getCodeObjMsg(cell.langcode, _v);
						} else {
							_h = $dwp.core.lang.getCurMsg(_v);
						}
						return _h;
					}

					function _drawBody() {
						var _loopcnt = 0,
							_deferreds = [];
						if (parseInt(_me.options.total % _opt.count) > 0) {
							_loopcnt = parseInt(_me.options.total / _opt.count) + 1;
						} else {
							_loopcnt = parseInt(_me.options.total / _opt.count);
						}

						//tbody 그리기...
						_template += "<tbody>";
						for (var i = 0; i < _loopcnt; i++) {
							_template += "tr_grid" + (i * _opt.count);
						}
						_template += "</tbody>";

						for (var i = 0; i < _loopcnt; i++) {
							_deferreds.push(
								$dwp.core.util.xAjax(_jsonGetParmData(i))
									.done(function (jsonData, textStatus, jqXHR) {
										var _pos = $dwp.core.util.getDataRange(jqXHR, "start");
										var _trHtml = "";

										$.each(jsonData, function (j, o) {
											if (o["@unid"] == "") return true;
											_trHtml += '<tr>';
											$.each(_me.options.header.excel_colnm, function (k, v) {
												var _$cell = null,
													_cell = _me.options.header.excel_col[v];

												if (typeof _cell == "undefined") return true;
												if (_cell.name == "_thumb") return true;

												_trHtml += '			<td align=center>' + _convertData(_cell, o) + "</td>";
											});
											_trHtml += '</tr>';
										});
										if (_trHtml != "") {
											_template = _template.replace("tr_grid" + _pos, _trHtml);
										}
									}).fail(function () {
										console.log('error');
									})
							);
						}

						$.when.apply($, _deferreds).always(function () {
							_template += '		</table>';
							_template += '	</body>';
							_template += '</html>';

							var _excelObject = new Blob([_template], { type: 'application/vnd.ms-excel' });
							//IE11 & Edge
							if (navigator.msSaveBlob) {
								navigator.msSaveBlob(_excelObject, _opt.filenm);
							} else {
								//In FF link must be added to DOM to be clicked
								var link = document.createElement('a');
								link.href = window.URL.createObjectURL(_excelObject);
								link.setAttribute('download', _opt.filenm);
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
							}
							$fn.unblock();
						})
					}

					if (_me.options.total > 0) {
						$fn.block(undefined, { notusemsg: _me.options.ismobile });
						_initHeader();
						_initTitle();
						_drawBody();
					} else {
						$fn.alert({ msg: $fn.getCodeMsg("문서가 없습니다.") });
						return true;
					}

				}
				/**
				 * 문서작성양식을 호출합니다.
				 * @param	{object=}	opt			option
				 * @param	{string}	opt.param	문서호출시 추가할 파리미터
				 */
				,
				createDocument: function (opt) {
					var _me = this,
						_url = "",
						_opt = $.extend({}, opt);

					// 2020-09-11 By LHJ ADD cdb 옵션 추가
					if (_opt.hasOwnProperty("cdb") && _opt.cdb != "") {
						_url = _opt.cdb;
					} else {
						_url = _me.options.cdb;
					}
					if (_opt.hasOwnProperty("formalias") && _opt.formalias != "") {
						_url += "/" + _opt.formalias + "?OpenForm";
					} else {
						_url += "/" + _me.options.header.formalias + "?OpenForm";
					}

					if (_opt.hasOwnProperty("param") || _me.options.hasOwnProperty("param")) {
						_url += "&" + $.param($.extend({}, _me.options.param, _opt.param));
					}
					if (_me.options.ismobile) {
						$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "edit" });
					} else {
						if (_me.options.ispreview && _me.options.preview != "all") {
							_me._previewLoadPage({ url: _url });
						} else {
							_$$.util.loadPage({ link: _url, linktype: "PAGE" });
						}
					}
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
						_opt = $.extend({}, opt);

					if (_me.options.ismobile) {
						_url = _me.options.cdb + "/" + _me.options.formview + "/" + unid + "?opendocument";
						if (_opt.hasOwnProperty("param")) {
							_url += "&" + $.param(_opt.param);
						}
						$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "read" });
					} else {
						_url = _me.options.cdb + "/" + _me.options.viewalias + "/" + unid + "?opendocument";
						if (_opt.hasOwnProperty("param")) {
							_url += "&" + $.param(_opt.param);
						}
						if (_me.options.ispreview && _me.options.preview != "all") {
							_me._previewLoadPage({ url: _url });
						} else if (_me.options.ispopupdoc == "1") {
							$dwp.core.util.winopen(_url, "", {});
						} else if (_me.options.ispopupdoc == "2") {
							// Layer Popup
							_$$.util.layerOpenDocument({ content: { url: _url } });
						} else {
							_$$.util.loadPage({ link: _url, linktype: "PAGE" });
						}
					}
					//$dwp.core.util.winopen(_url, "", {});
					//$dwp.core.portal.openDocument(_url);
					//window.open("/dwp/com/portal/main.nsf/wfrmpage?readform&url=" + decodeURIComponent(_url))
				}
				/**
				 * 문서를 편집상태로 Open합니다.
				 * @param	{string}	unid		Document UNID
				 * @param	{object=}	opt			option
				 * @param	{string}	opt.url		문서호출시 사용되는 URL(미설정 시, 기본문서 편집URL를 사용합니다.)
				 * @param	{string}	opt.param	문서호출시 추가할 파리미터
				 */
				,
				editDocument: function (unid, opt) {
					var _me = this,
						_url = "",
						_opt = $.extend({}, opt);

					if (_me.options.ismobile) {
						_url = _me.options.cdb + "/" + _me.options.formview + "/" + unid + "?editdocument";
					} else {
						_url = _me.options.cdb + "/0/" + unid + "?editdocument";
					}

					if (_opt.hasOwnProperty("url")) {
						_url = _opt.url;
					}
					if (_opt.hasOwnProperty("param")) {
						_url += "&" + $.param(_opt.param);
					}

					if (_me.options.ismobile) {
						$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "edit" });
					} else if (_me.options.ispreview && _me.options.preview != "all") {
						_me._previewLoadPage({ url: _url });
					} else if (_me.options.ispopupdoc == "1") {
						$dwp.core.util.winopen(_url, "", {});
					} else {
						_$$.util.loadPage({ link: _url, linktype: "PAGE" });
					}
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
				 * 조회자 로그 다이얼로그 창을 Open합니다.
				 * @param	{object}	o				Click Event 객체
				 * @param	{object=}	opt				options
				 */
				,
				openlog: function (o, opt) {
					var _me = this
					_opt = $.extend({ eleopt: _me.options }, opt);

					$dwp.ui.openlog(o, _opt);
				}
				/**
				 * 좋아요 처리 수행함수
				 */
				,
				likeit: function (el, o) {
					var _me = this,
						_key_unid = o._key_unid,
						_sublogdb = _me.options.sublogdb || o._sublogdb;

					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_sublogdb + '/wlogpost?createdocument'), {
						actiontype: _$$.view._CONST.ACTION.LIKEIT,
						root_unid: _key_unid,
						pardb_path: _me.options.cdb
					},
						function (data) {
							// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									if (data.msgcode == "success") {
										$(el).text(data.like_cnt);
									} else {
										$dwp.ui.alert({ msg: $dwp.core.lang.getCodeMsg(data.msgcode) });
									}
								} else {
									//error
								}
							} else {
								//error
							}
						}, 'json'
					)
				},
				checkedAll: function (checked) {
					var _me = this,
						_$listbody = null;

					if (_me.options.viewtype == "thumb" || _me.options.viewtype == "card") {
						_$listbody = $("div.list-wrap", _me.element);
					} else if (_me.options.viewtype == "custom") {
						_$listbody = $(_me.options.selector, _me.element);
					} else {
						_$listbody = $("div.dwp-table-inner", _me.element);
					}
					if (checked) {
						$("input[name='chk']", _$listbody).prop("checked", true);
					} else {
						$("input[name='chk']", _$listbody).prop("checked", false);
					}
				}
				/**
				 * 보기 선택문서정보를 리턴함
				 * @return	{array}
				 */
				,
				getChecked: function () {
					var _me = this,
						_$listbody = null,
						_rows = [];
					//console.log(_me.options.viewtype);
					if (_me.options.viewtype == "thumb" || _me.options.viewtype == "card" || _me.options.viewtype == "mix") {
						_$listbody = $("div.list-wrap", _me.element);
						$("div.text-wrap input[name='chk']:checked", _$listbody).each(function () {
							var _data = $(this).parents("div.item").data($dwp.core.view._ROW_DATA);
							if (_data) { _rows.push(_data) };
						});
					} else if (_me.options.viewtype == "custom") {
						_$listbody = $(_me.options.selector, _me.element);
						$("input[name='chk']:checked", _$listbody).each(function () {
							var _data = $(this).parents("[data-key-unid]").data($dwp.core.view._ROW_DATA);
							if (_data) { _rows.push(_data) };
						});
					} else {
						_$listbody = $("div.dwp-table-inner", _me.element);
						$("div.dwp-table-row input[name='chk']:checked", _$listbody).each(function () {
							var _data = $(this).parents("div.dwp-table-row").data($dwp.core.view._ROW_DATA);
							if (_data) { _rows.push(_data) };
						});
					}
					return _rows;
				}
				/**
				 * 보기 선택문서 Rows를 리턴함
				 * @return	{object}	jquery object
				 */
				,
				getCheckedRows: function () {
					var _me = this,
						_$listbody = null;

					if (_me.options.viewtype == "thumb" || _me.options.viewtype == "card") {
						_$listbody = $("div.list-wrap", _me.element);
						return $("div.text-wrap input[name='chk']:checked", _$listbody).parents("div.item");
					} else if (_me.options.viewtype == "custom") {
						_$listbody = $(_me.options.selector, _me.element);
						return $("input[name='chk']:checked", _$listbody).parents("[data-key-unid]");
					} else {
						_$listbody = $("div.dwp-table-inner", _me.element);
						return $("div.dwp-table-row input[name='chk']:checked", _$listbody).parents("div.dwp-table-row");
					}
				}
				/**
				 * 컬럼정렬을 수행합니다.
				 * @param	{string}	sortnm		sort컬럼명
				 * @param	{string}	sortorder	sort유형 "ascending", "descending"
				 */
				,
				resort: function (sortnm, sortorder) {
					var _me = this;

					if (_me.options.header.hasOwnProperty("sortvw")) {
						if (_me.options.searchview) {
							_me.options.sortnm = sortnm;
							_me.options.sortorder = sortorder;
						} else {
							_me.options.sortnm = "";
							_me.options.sortorder = "";
						}
						//_me.options.sortnm = "";
						//_me.options.sortorder = "";
						_me.options.viewalias = _me.options.header.sortvw + sortnm + "_" + sortorder.substr(0, 3);
					} else {
						_me.options.sortnm = sortnm;
						_me.options.sortorder = sortorder;
					}

					_me.options.page = 1;
					_me._listProc();
				}
				/**
				 * UNIDs 정보로 문서를 삭제합니다
				 * @param	{string}	unids			Doc Unid (다중값 : ";")
				 * @param	{object=}	opt				options
				 * @param	{boolean}	opt.softdel		Soft 삭제여부(default : true)
				 */
				,
				deleteDocumentUNID: function (unids, opt) {
					var _me = this,
						_rows = null,
						_unids = "",
						_opt = $.extend({ softdel: true }, opt);

					if (!$.isArray(unids)) return;

					if (_opt.hasOwnProperty("confirm")) {
						$fn.confirm({ msg: _opt["confirm"] }).done(function () { _ok(); })
					} else {
						_ok();
					}

					function _ok() {
						_unids = unids.join(";")
						_$$.util.cmdPost(
							$dwp.core.util.getProxyUrl(_me.options.cdb + '/wcmdpost?createdocument'), { actiontype: (_opt.softdel ? 'del_temp' : 'del_reg'), postdata: _unids },
							function (data) {
								// "result":"200","re_cd":"del_temp","cnt":"2"
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										$dwp.ui.alert({ msg: (_opt.softdel ? $fn.getCodeMsg("comm.msg.msg003") : $fn.getCodeMsg("comm.msg.msg004")) })
											.done(function () {
												//_me.reload({page : 1});
												_me.reload({});
											});
										//_me.reload({page : 1});
									} else {
										//error
									}
								} else {
									//error
								}
								//_me.refresh();
							}, 'json'
						);
					}
				}
				/**
				 * 선택된 문서를 삭제합니다.
				 * @param	{object=}	opt				options
				 * @param	{boolean}	opt.softdel		Soft 삭제여부(default : true)
				 */
				,
				deleteDocument: function (opt) {
					var _me = this,
						_rows = null,
						_unids = "",
						_opt = $.extend({ softdel: true }, opt);

					_rows = _me.getChecked();
					if (_rows.length == 0) {
						$fn.alert({ msg: (_opt.softdel ? $fn.getCodeMsg("comm.msg.msg005") : $fn.getCodeMsg("comm.msg.msg006")) })
						return;
					}
					if (_opt.hasOwnProperty("confirm")) {
						//if (!$fn.confirm({msg : _opt["confirm"]})) return;
						var _msg = _opt["confirm"];
						if (_me.options.isresponse) {	//응답문서 사용여부
							_msg += "<br>주)응답문서도 함께 삭제됩니다";
						}
						$fn.confirm({ msg: _msg }).done(function () { _ok(); })
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
						_unids = $.map(_rows, function (v) {
							return v['@unid'];
						}).join(";");

						_$$.util.cmdPost(
							$dwp.core.util.getProxyUrl(_me.options.cdb + '/wcmdpost?createdocument'), { actiontype: (_opt.softdel ? 'del_temp' : 'del_reg'), postdata: _unids },
							function (data) {
								// "result":"200","re_cd":"del_temp","cnt":"2"
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										/*
										$dwp.ui.alert({msg : (_opt.softdel ? $fn.getCodeMsg("comm.msg.msg003") : $fn.getCodeMsg("comm.msg.msg004") ) })
										.done(function(){
											var _page = _me.options.page;
											if ( (_me.options.total - _rows.length) < ( (_me.options.page - 1) * _me.options.ps + 1) ) {
												_page = _page - 1;
											}
											if ( _page < 1 ) {_page = 1;}
											_me.reload({page : _page});
										});
										*/
										var _page = _me.options.page;
										if ((_me.options.total - _rows.length) < ((_me.options.page - 1) * _me.options.ps + 1)) {
											_page = _page - 1;
										}
										if (_page < 1) { _page = 1; }
										_me.reload({ page: _page });

										$fn.toast({ msg: (_opt.softdel ? $fn.getCodeMsg("comm.msg.msg003") : $fn.getCodeMsg("comm.msg.msg004")) });
									} else {
										//error
									}
								} else {
									//error
								}
								//_me.refresh();
							}, 'json'
						);
					}
				}
				/**
				 * 선택된 문서(Soft 삭제된)를 복구합니다.
				 * @param	{object=}	opt				options
				 * @param	{boolean}	opt.docstatus	복구후 변경할 문서상태정보
				 */
				,
				restoreDocument: function (opt) {
					var _me = this,
						_rows = null,
						_unids = "",
						_opt = $.extend({ docstatus: "" }, opt);

					_rows = _me.getChecked();
					if (_rows.length == 0) {
						$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg007") });
						return;
					}
					_unids = $.map(_rows, function (v) {
						return v['@unid'];
					}).join(";");

					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_me.options.cdb + '/wcmdpost?createdocument'), { actiontype: 'restore', docstatus: _opt.docstatus, postdata: _unids },
						function (data) {
							// "result":"200","re_cd":"del_temp","cnt":"2"
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									var _msgcode = "comm.msg.msg008"
									if (_me.options.isresponse && data.hasOwnProperty("cnt") && data.cnt != _rows.length) {
										_msgcode = "부모문서가 임시삭제문서인 경우는 부모문서를 복원 후 복원하십시요!";
									}
									$dwp.ui.alert({ msg: $fn.getCodeMsg(_msgcode) }).done(function () {
										_me.reload({ page: 1 });
									});
									//_me.reload({page : 1});
								} else {
									//error
								}
							} else {
								//error
							}
							//_me.refresh();
						}, 'json'
					);
				}
				/**
				 * 보기를 reload합니다(보기 Data만 다시 로딩합니다.)
				 * @param	{object=}	options		view options(default : current view options)
				 */
				,
				reload: function (opt) {
					var _me = this;
					$.extend(_me.options, opt);
					//console.log("singlesearch", _me.options.singlesearch);
					_me._listProc();
				}
				/**
				 * 보기 Page를 새로고침합니다.
				 */
				,
				refresh: function () {
					var _me = this;
					if (_me.options.pathinfo) {
						_$$.util.loadPage({ link: _me.options.pathinfo, linktype: "PAGE" });
					}
				}
				/**
				 * Local Stroage에서 Load한 보기설정 정보을 view options에 설정하기
				 */
				,
				setEnvViewOpt: function () {
					var _me = this,
						_env;

					_env = _me.getEnvViewOpt();

					//console.log("_env",_env);
					_me.options.ps = _env.ps;
					_me.options.viewtype = _env.viewtype;
					_me.options.preview = _env.preview;

					if (_me.options.ispopupdoc != "2") {
						_me.options.ispopupdoc = _env.ispopupdoc;
					}
				}
				/**
				 * Local Storage에서 보기설정 정보 Load하기
				 */
				,
				getEnvViewOpt: function () {
					var _me = this;
					return $.extend({
						ps: _me.options.ps,
						viewtype: _me.options.viewtype,
						preview: _me.options.preview,
						ispopupdoc: _me.options.ispopupdoc
					},
						//_$$.getViewSetting(_$$.getCurUser().pinfo.empno + "_" + _me.options.cdb.replace(/\//g, "_") + "_" + (_me.options.header.hasOwnProperty("sortvw") ? _me.options.header.sortvw : _me.options.viewalias))
						_$$.getViewSetting(_$$.getCurUser().pinfo.empno + "_" + _me.options.cdb.replace(/\//g, "_") + "_" + _me.options.displaycode)
					);
				}
				/**
				 * 공지메세지 정보를 Local Storage에 설정하기
				 * @param	{object}	opt			설정정보
				 * @param	{boolean}	opt.ishide	숨김여부(default : false)
				 * @param	{string}	opt.date	숨김날짜(YYYY-MM-DD)
				 */
				,
				setNotiMsgOpt: function (opt) {
					var _me = this,
						_opt = $.extend({
							ishide: false,
							date: ""
						}, opt);
					//console.log(_opt)
					_$$.setViewSetting(_$$.getCurUser().pinfo.empno + "_" + _me.options.cdb.replace(/\//g, "_"), _opt);
				}
				/**
				 * Local Storage에서 공지메세지정보 가져오기
				 * @return	{object}	공지설정정보
				 */
				,
				getNotiMsgOpt: function () {
					var _me = this;
					return $.extend({
						ishide: false,
						date: ""
					},
						_$$.getViewSetting(_$$.getCurUser().pinfo.empno + "_" + _me.options.cdb.replace(/\//g, "_"))
					);
				}
				/**
				 * 미리보기 처리함수
				 * @param	{object=}	opt			options
				 * @param	{string}	opt.type	미리보기 유형(default : "plr")
				 * @param	{string}	opt.width	width(default : 50%)- 미리보기 유형이 plr인경우
				 * @param	{string}	opt.height	height(default : 50%)- 미리보기 유형이 pud인경우
				 */
				,
				preview: function (opt) {
					var _me = this,
						_$pagebody = $("div.dwp-page-body.view", _me.element),
						_$preview = $("div.dwp-contents-preview", _me.element),
						_opt = $.extend({ type: "plr", width: "50%", height: "50%" }, opt)

					_me.options.preview = _opt.type;

					if (_opt.type == "plr") {
						_$pagebody.removeClass("preview-row");
						_$pagebody.addClass("preview-col");
						_$preview.css({ width: _opt.width, height: "" });
						if ($("div.dwp-wrapping", _$preview).size() == 0) {
							_me._previewLoadPage();
						}
					} else if (_opt.type == "pud") {
						_$pagebody.removeClass("preview-col");
						_$pagebody.addClass("preview-row");
						_$preview.css({ width: "", height: _opt.height });
						if ($("div.dwp-wrapping", _$preview).size() == 0) {
							_me._previewLoadPage();
						}
					} else {
						_$pagebody.removeClass("preview-col");
						_$pagebody.removeClass("preview-row");
						_$preview.css({ width: "", height: "" });
						_me._previewLoadPage();
					}
				}
				/**
				 * 상세검색 다이얼로그 창을 표시합니다.
				 * @param	{object}	opt		options - view options.detailsearch 참조
				 */
				,
				detailsearch: function (opt) {
					var _me = this,
						_h = "";
					console.log("detail search");

					if (typeof opt == "object") {
						_me.options.detailsearch = opt;
					}
					/*
					_me.options.detailsearch = [];

					_me.options.detailsearch.push({nm : "부서명", fld : "OrgName", key : "OrgName", type : "txt"});
					_me.options.detailsearch.push({nm : "코드명", fld : "CodName", key : "CodName", type : "select", code : [{txt:"code1", val:"0"}, {txt:"code2", val:"1"}]});
					_me.options.detailsearch.push({nm : "코드명", fld : "_HD", key : "CodName", type : "xlang"
						, xlang : {lc : "LC_CODE", type:"select", code : "", src :"HD", all : "--선택--", name : "_HD" }
					});
					_me.options.detailsearch.push({nm : "기안일", fld : "sDate", flde : "eDate", key : "FDate", type : "date"});
					_me.options.detailsearch.push({nm : "코드함수", fld : "Code2Name", key : "Code2", type : "codesel"});
					*/

					if (!_me.options.hasOwnProperty("detailsearch")) {
						return;
					}
					if (_me.options.detailsearch == null) {
						return;
					}

					// [{nm : 제목, fld : 검색대상필드명, type : 유형(txt, select, date, code)}]
					_h = "<div class='dwp-table-vertical'></div>";

					$fn.dialog(null, {
						title: $fn.getCodeMsg("상세검색"),
						width: 736,
						modal: true,
						draggable: false,
						hide: { effect: "fade", duration: 300 },
						show: { effect: "fade", duration: 300 },
						resizable: false,
						isedit: true,
						content: { html: _h, url: "" },
						initcallback: function (_$dialog) {
							var _$target = $("div.dwp-table-vertical", _$dialog.element);

							function _convert(o) {
								var __h = "";
								if (o.type == "txt") {
									__h = "<div class='dwp-input expended'><input type='text' name='" + o.fld + "' value=''></div>";
								} else if (o.type == "select") {
									__h = "<div class='dwp-selectbox'>";
									__h += "<select name='" + o.fld + "'>";
									$.each(o.code, function (i, cobj) {
										__h += "<option value='" + cobj.val + "'>" + cobj.txt + "</option>";
									});
									__h += "</select>";
									__h += "</div>";
								} else if (o.type == "date") {
									__h = "<div class='dwp-calendar-form'>";
									__h += "<div class='dwp-input'>";
									__h += "<input type='text' name='" + o.fld + "' data-type=date data-start='" + o.fld + "' data-end='" + o.flde + "' readonly >"
									__h += "</div>";
									__h += "<span class='dwp-dash'>-</span>";
									__h += "<div class='dwp-input'>";
									__h += "<input type='text' name='" + o.flde + "' data-type=date data-start='" + o.fld + "' data-end='" + o.flde + "' readonly >"
									__h += "</div>";
									__h += "</div>";
								} else if (o.type == "codesel") {
									__h += "<div>";
									__h += "<input type='hidden' name='" + o.fld + "' value=''>";
									__h += "<div class='dwp-namepicker-grouping'>";
									__h += "<div class='dwp-input'><input type='text' name='" + o.fld + "_Nm' value='' readonly></div>";
									__h += "<div class='dwp-btn'><span type='button'><img src='" + $fn.getPath("weblib") + "/images/common/icon-add-item.svg'></span></div>";
									__h += "</div>"
									__h += "</div>";
								} else if (o.type == "xlang") {
									var _x = o.xlang;
									__h += "<div ";
									__h += (_x.hasOwnProperty("type") && _x.type == "select" ? "class='dwp-selectbox' " : "class='dwp-selection-group' ");
									__h += (_x.hasOwnProperty("lc") && _x.lc != "" ? "data-xlang='" + _x.lc + "' " : "");
									__h += (_x.hasOwnProperty("code") && _x.code != "" ? "data-xlang-code='" + _x.code + "' " : "data-xlang-code='' ");
									__h += (_x.hasOwnProperty("src") && _x.src != "" ? "data-xlang-src='" + _x.src + "' " : "");
									__h += (_x.hasOwnProperty("all") && _x.all != "" ? "data-xlang-all='" + _x.all + "' " : "");
									__h += (_x.hasOwnProperty("type") && _x.type != "" ? "data-xlang-type='" + _x.type + "' " : "data-xlang-type='' ");
									__h += (_x.hasOwnProperty("name") && _x.name != "" ? "data-xlang-name='" + _x.name + "' " : "data-xlang-name='' ");
									__h += "data-xlang-value='' ";
									__h += "></div>";
								}

								return __h;
							}

							function _event(_$item, o) {
								if (o.type == "date") {
									$dwp.ui.datepicker(_$item, {});
								} else if (o.type == "codesel") {
									if (typeof o.fnc == "function") {
										$("div.dwp-btn", _$item).off("click").on("click", function () {
											o.fnc(_$item);
										});
									}
								} else if (o.type == "select") {
									if (typeof o.fnc == "function") {
										$("select", _$item).off("change").on("change", function () {
											o.fnc(_$item);
										});
									}
								} else if (o.type == "xlang") {
									$dwp.core.lang.convert({ isedit: true }, _$item);

									var _x = o.xlang;
									if (_x.type == "select") {
										if (typeof o.fnc == "function") {
											$("select", _$item).off("change").on("change", function () {
												o.fnc(_$item);
											});
										}
									}
								}
							}

							$.each(_me.options.detailsearch, function (i, o) {
								var _h = "";
								_h += "<div class='dwp-row'>";
								_h += "<div class='dwp-title'>" + $fn.getCodeMsg(o.nm) + "</div>";
								_h += "<div class='dwp-value'>" + _convert(o) + "</div>";
								_h += "</div>";

								var _$item = $(_h).appendTo(_$target);
								_$item.data("_DETAIL_OPT", o);

								_event(_$item, o);
							});

						},
						buttons: [{
							title: $fn.getCodeMsg("comm.btn.confirm"),
							click: function (_$dialog) {
								var _$target = $("div.dwp-table-vertical", _$dialog.element),
									_searchqry = [],
									_qry = "",
									_iserror = false;

								function _dateQry(key, o) {
									var _$calfrom = $("input[name=" + o.fld + "]", _$target);
									var _$calto = $("input[name=" + o.flde + "]", _$target);
									var _qry = "";
									if (_$calfrom.xval() != "" && _$calto.xval() != "") {
										_qry += "([" + key + "] >= " + _$calfrom.xval() + " and [" + key + "] <= " + _$calto.xval() + ")";
									} else if (_$calfrom.xval() != "" && _$calto.xval() == "") {
										_qry += "([" + key + "] >=" + _$calfrom.xval() + ")";
									} else if (_$calfrom.xval() == "" && _$calto.xval() != "") {
										_qry += "([" + key + "] <=" + _$calto.xval() + ")";
									}
									return _qry
								}

								$.each(_me.options.detailsearch, function (i, o) {
									if (o.type == "txt" || o.type == "select" || o.type == "codesel" || o.type == "xlang") {
										var _$inp = $("[name=" + o.fld + "]", _$target);
										if (_$inp.size() > 0) {
											if (_$inp.xval() != "") {
												// 콤마도 Query is not understandable 발생시키므로 공백으로 치환 moddified by 21.10.18 by noh
												var _val = _$inp.xval().replace(/\(/g, " ").replace(/\)/, " ").replace(/,/g, " ");
												// ()가 처음과 끝에 나올경우 공백으로 치환된 값은 삭제. " and "로 치환되지 않도록 하기 위함. added on 21.10.18 by noh
												_val = _val.replace(/^[\s]+/, "").replace(/[\s]+$/, "");

												if (/\(|\)|\[|\]|\{|\}|\<|\>/.exec($.trim(_val)) != null) {
													$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
													_$inp.focus();
													_iserror = true;
													return false;
												}

												var _vlist = o.key.split("|");
												_qry = $.map(_vlist, function (k, j) {
													return "[" + k + "] contains " + _val + " ";
												}).join(" or ");

												if (_qry != "") {
													_searchqry.push("(" + _qry + ")");
												}
											}
										}
									} else if (o.type == "date") {
										_qry = $.map(o.key.split("|"), function (k, i) {
											return _dateQry(k, o);
										}).join(" or ");

										if (_qry != "") {
											_searchqry.push("(" + _qry + ")");
										}
									}
								});

								if (_iserror) { return false; }

								if (_searchqry.length == 0) {
									$fn.alert({ msg: $fn.getCodeMsg("검색어를 입력해 주십시요") });
								} else {
									var _sortopt = { sortnm: _me.options.header.sortnm, sortorder: _me.options.header.sortorder }
									_me.options.page = 1;
									_me.options.searchqry = "(" + _searchqry.join(" and ") + ")";
									_me.options.searchview = true;

									console.log("", _me.options.searchqry);

									if (_me.options.issort) {
										_$sort = $("div[name='dwp-sort-area']", _me.element);
										if (_$sort.size() > 0) {
											_sortopt.sortnm = $("select", _$sort).xval();
											_sortopt.sortorder = ($("div[name='_sortorder']", _$sort).hasClass('active') ? _$$.view._CONST.DES : _$$.view._CONST.ASC);
										}
									}

									_me.resort(_sortopt.sortnm, _sortopt.sortorder);

								}
								_$dialog.close();
							}
						}, {
							title: $fn.getCodeMsg("comm.btn.cancel"),
							click: function (_$dialog) {
								_$dialog.close();
							}
						}]
						// button end
					});
				}
				/**
				 * view 초기화
				 */
				,
				_init: function () {
					var _me = this,
						_env;
					console.log("view init")
					// 초기 시스템 정보 설정
					var _vopt = _$$.portal.getDocPreViewInfo();
					$.extend(_me.options, _vopt);
					console.log("view opt", _me.options);
					if ($("#_SYSTEM_INFO", _me.element).size() > 0) {
						var _sysinfo = $.trim($("#_SYSTEM_INFO", _me.element).text());
						try { _me.options.sysinfo = $.parseJSON(_sysinfo); } catch (e) { };
					}
					// 초기화처리
					_me.options.viewtype = (_me.options.viewtype == "" ? "list" : _me.options.viewtype);

					if (_me.options._single == "") {
						_me.options._single = _me.options.single.replace(/\^all/gi, "");
						_me.options._singlesearch = _me.options.singlesearch;
					}

					if (_me.options.ismobile) {
						_me.options.navi = 5;
					}

					_me.setEnvViewOpt();

					// 미리보기 시 처리
					if (_me.options.ispreview) {
						$(".dwp-contents-preview", _me.element).resizable({ handles: "w, n" });
						if (_me.options.preview != "all") {
							$dwp.core.portal.setPreViewInfo();
							_me.preview({ type: _me.options.preview });
						}
					}

					// Trigger Event
					_me._triggerEvent();

					// Header 처리
					_me._headerProc();
					//if (_me.options.ismobile != true) _me._headerProc();	//모바일에서는 사용하지 않고, PC환경에서 사용함 (김만현 추가 2016-09-21)

					// List 처리
					_me._listProc();

					//_$$.lang.convert({url : _me.options.langpath}, _me.element);


					//키보드 제어 및 ContextMenu - 2020.03.12 by dwlee
					if (_me.options.ismobile == false) {
						//옵션 추가 - 2020.03.31 by dwlee
						if (_me.options.isctrlkeyboard == true) {
							_me._keyboardCtrl(_me.element, _me.options);
						}

						//옵션 추가 - 2020.03.31 by dwlee
						if (_me.options.iscontextmenu == true) {
							_me._contextMenu(_me.element, _me.options);
						}

						//옵션 추가 - 2020.03.31 by dwlee
						if (_me.options.isdragable == true) {
							_me._disableSelect(_me.element);
							_me._checkBoxSwipeable($(".dwp-check", _me.element), _me.element);
						}
					}
				}


				//메일에서 사용ㅎ던 소스를 이쪽으로 옮김 - 2020.03.31 by dwlee
				//draggable 값 초기화
				,
				_disableSelect: function (_element) {
					$(_element).each(function () {
						this.onselectstart = function () { return false; };
						this.unselectable = "on";
						$(this).css("user-select", "none");
						$(this).css("-o-user-select", "none");
						$(this).css("-moz-user-select", "none");
						$(this).css("-khtml-user-select", "none");
						$(this).css("-webkit-user-select", "none");
					});
				}


				//메일에서 사용하던 소스를 이쪽으로 옮김
				//draggable 수행
				,
				_checkBoxSwipeable: function (_checkbox, _viewElement) {
					//2020.01.15 by dwlee
					var current = $(_checkbox); //checkbox 전체
					var mousedownOn = {
						element: null,
						index: -1
					};
					var shiftKey = false;

					$(_viewElement).mouseup(function () {
						console.log("mouse up");
						shiftKey = false;
					});

					$(_checkbox).filter(':checkbox').closest(".check-cell").mousedown(function () {
						shiftKey = true;

						var $this = $(this).find(".dwp-check");
						mousedownOn.element = $this;

						if (mousedownOn.index == -1) {
							mousedownOn.index = $('.dwp-check', _viewElement).index($this);
						}

						var _par$ = $(this).parent();
						if ($this.prop("checked")) {
							$(".dwp-check-all", _viewElement).prop("checked", false);
							_par$.removeClass("dwp-row-selected");
						} else {
							_par$.addClass("dwp-row-selected"); //선택 Class 추가 - 2020.01.15 by dwlee
						}

						$this.prop('checked', !$this.prop('checked'));
					}).closest(".check-cell").mouseenter(function () {
						if (shiftKey == true) {
							var $this = $(this).find(".dwp-check");

							var _par$ = $(this).parent();

							if (mousedownOn.element != null) {
								if ($this.prop("checked")) {
									$this.prop("checked", false);
									_par$.removeClass("dwp-row-selected");
								} else {
									$this.prop("checked", true);
									_par$.addClass("dwp-row-selected");
								}
								$this.change();
							}
						}
					}).closest(".check-cell").mouseup(function () {
						console.log("mouse up");
						shiftKey = false;
						//클릭시에는 원래 소스로 동작
					}).click(function (e) {
						e.preventDefault();
						return false;
					});
				}


				//키보드 제어 메인함수 - 2020.03.12 by dwlee
				,
				_keyboardCtrl: function (el, opt) {
					var _me = this;

					//키보드 제어 이벤트 초기화
					keyboardJS.reset();
					opt.selectedtr = "";
					//ctrl Key Down
					keyboardJS.bind('ctrl', function (e) {
						opt.isctrlclicked = true;
						//ctrl Key Up
					}, function (e) {
						opt.isctrlclicked = false;
					});
					//Shit Key + 아래 방향키 : 문서선택 셋팅
					keyboardJS.bind('shift + down', function (e) {
						_me._selectDocs(el, opt);
					});
					//Shit Key + 위쪽 방향키  : 문서선택 해제
					keyboardJS.bind('shift + up', function (e) {
						_me._unSelectDocs(el, opt);
					});
				}

				//Shift + 아래방향 눌렀을때.... - 2020.03.12 by dwlee
				,
				_selectDocs: function (el, opt) {
					var _me = this;
					if (opt.selectedtr != "") {
						var _key = _me._findNextDoc(el, opt);
						if (_key != "") {
							var _row$ = $("div[data-key-unid='" + _key + "']", el);
							opt.selectedtr = _row$.attr("data-key-unid");
							_me._selectConvert(opt, _row$);
						}
					} else {
						var _row$ = $("div.dwp-table-row:first-child", el);
						opt.selectedtr = _row$.attr("data-key-unid");
						_me._selectConvert(opt, _row$);
					}
				}
				//Shift + 위로방향 눌렀을때.... - 2020.03.12 by dwlee
				,
				_unSelectDocs: function (el, opt) {
					var _me = this;
					if (opt.selectedtr != "") {
						var _row$ = $("div[data-key-unid='" + opt.selectedtr + "']", el);
						_me._selectConvert(opt, _row$);
						var _rows$ = $(".dwp-row-selected", el);
						if (_row$.size() > 0) {
							var _prow$ = _rows$.last();
							opt.selectedtr = _prow$.attr("data-key-unid");
						} else {
							opt.selectedtr = "";
						}
					}
				}
				// row 선택여부 해제 .... - 2020.03.12 by dwlee
				,
				_selectConvert: function (opt, _row) {
					var _row$ = $(_row);
					var _chk$ = $(".dwp-check", _row$);
					if (_chk$.is(":checked") == false) {
						_row$.addClass("dwp-row-selected");
						_chk$.prop("checked", true);
						opt.selectedtr = _row$.attr("data-key-unid");
					} else {
						_row$.removeClass("dwp-row-selected");
						_chk$.prop("checked", false);
					}
				}

				//다음 row selector .... - 2020.01.07 by dwlee
				,
				_findNextDoc: function (el, opt) {
					var _rows$ = $("div.dwp-table-row", el);
					var _next = "";
					var _isfind = false;
					$.each(_rows$, function (rindex, row) {
						var _crow$ = $(row);
						if (_isfind == true) {
							_next = _crow$.attr("data-key-unid");
							_isfind = false;
						}
						if (_crow$.attr("data-key-unid") == opt.selectedtr) {
							_isfind = true;
						}
					});
					return _next;
				}

				//contextmenu 수행 .... - 2020.03.13 by dwlee
				,
				_contextMenu: function (el, opt) {
					// 2020-09-24 By LHJ 전체옵션을 지정하도록 변경
					if ($.isEmptyObject(opt.contextmenu)) { return; }
					$(el).contextMenu(
						//$.extend({selector: '.dwp-body-wrap.list-grid'}, opt.contextmenu)
						// $.extend({ selector: '.dwp-body-wrap' }, opt.contextmenu)
						$.extend({ selector: '.dwp-body-wrap.list-grid' }, opt.contextmenu)		//목록에서만 뜨도록 수정. by noh
					);
					/*
					if (opt.contextmenu.items != "") {
						$(el).contextMenu({
						//$.contextMenu({
							//selector: '.dwp-table-row',
							selector: '.dwp-body-wrap.list-grid',
							callback: function(key, options) {
								opt.contextmenu.callback(key);
							},
							items : opt.contextmenu.items
						});
					}
					*/
				}
				,
				_mSliderResize: function () {
					var _me = this;

					var _$slider = _me.element.parents("div[aria-live='polite']");
					if (_$slider.size() > 0) {
						/*
						var _$mo = _me.element.parents("div.dwp-mobile-area");
						var _h = $dwp.core.util.getScreenInfo().h - $(".dwp-header-m", _$mo).height() - $(".dwp-footer-m", _$mo).height();
						var _lh = _me.element.height();

						if ($("div.dwp-2depth-nav", _$mo).size() > 0) { _h = _h - $("div.dwp-2depth-nav", _$mo).height(); }
						if ($("div.dwp-3depth-nav.active", _$mo).size() > 0) { _h = _h - $("div.dwp-3depth-nav.active", _$mo).height(); }

						_me.element.siblings("div").each(function () {
							_lh = _lh + $(this).height();
						});
						//console.log(_lh);
						//console.log(_me.element.height(_h));
						_$slider.height(_lh > _h ? _lh : _h);
						*/
						_$slider.height('100%');
					}
				}
				/**
				 * view event trigger 처리
				 */
				,
				_triggerEvent: function () {
					var _me = this;

					$dwp.core.util.xOn(_me.element, "ViewLoadComplete", function (event, view) {
						console.log("Trigger ViewLoadComplete", view);

						if (_me.options.ismobile) {
							$dwp.core.lang.convert({ url: view.options.langpath }, view.element);

							_me._mSliderResize();

						} else {
							$dwp.core.lang.convert({ url: view.options.langpath, except: "div.dwp-contents-preview" }, view.element);
						}

						if (typeof view.options.loadComplete == "function") {
							view.options.loadComplete(event, view);
						}

						//옵션 추가 - 2020.03.31 by dwlee
						if (view.options.isdragable == true) {
							console.log("_disalbeSelect");
							_me._disableSelect(_me.element);
							console.log("_checkBoxSwipeable");
							console.log("check size :", $(".dwp-check", view.element).size());
							_me._checkBoxSwipeable($(".dwp-check", view.element), view.element);
							console.log("endend");
						}

					});
					// Scroll시 더보기
					if (_me.options.moreview != "") {
						var _$selector = $(_me.options.moreview, _me.element);
						$(_me.options.moreview, _me.element).on("scroll", function (e) {
							/* 스크롤 마지막 부분은 footer 항상 보이게 */
							//console.log("aaaa")
							if (_$selector.outerHeight() == _$selector[0].scrollHeight - _$selector.scrollTop()) {
								_me.pageMore($(_me.options.selector, _me.element));
							}
						});
					}
				}
				/**
				 * View Header Main 처리
				 * PC : 베너, 버튼, 정렬, 분류, 검색, 환경설정 처리
				 * 모바일 : 보기버튼, 검색, 정렬, 분류, 작성버튼 처리
				 */
				,
				_headerProc: function () {
					var _me = this;
					console.log("headerProc");
					if (_me.options.ismobile) {

						var _$pagetitle = $("div.dwp-list-header .dwp-page-title", _me.element);
						if (_$pagetitle.size() > 0) {
							if (_$pagetitle.is("[data-xlang-code]")) {
								var _titlecd = _$pagetitle.attr("data-xlang-code");
								$(".dwp-header-m .dwp-page-title", dwpmo.div["view"]).html($fn.getCodeMsg(_titlecd));
							}
							if (_$pagetitle.is("[data-xlang-txt]")) {
								var _title = _$pagetitle.attr("data-xlang-txt");
								$(".dwp-header-m .dwp-page-title", dwpmo.div["view"]).html($fn.getCurLangMsg(_title));
							}
						}
						// 보기버튼
						_me._btnMProc();
						// 검색처리
						//_me._searchMProc();
						// 정렬처리
						_me._sortMProc();

						// 분류처리
						_me._cateMProc();

						// 2019-12-01 By LHJ
						_me._headerMProc();

						// 작성버튼 표시
						_me.mCreateBtnToggle();
					} else {
						// 베너메세지 처리
						_me._msgBanner();
						// 버튼처리
						_me._btnProc();
						// 정렬처리
						_me._sortProc();
						// 분류처리
						_me._cateProc();
						// 검색처리
						_me._searchProc();
						// 환경설정 처리
						_me._settingProc();
					}
				}
				/*
				 *
				 */
				,
				_headerMProc: function () {
					var _me = this,
						_$listheader = $("div.dwp-list-header", _me.element),
						_$listtitle = $("div.dwp-list-title", _$listheader),
						_$listcheckbox = $("div.dwp-list-checkbox", _$listheader),
						_$listsearch = $("div.dwp-list-search", _$listheader);

					// 검색버튼처리

					function _makeQuery(sqry) {
						var _data = {},
							_$select = $("select", _$listsearch),
							_qry = "",
							_key = "";

						if (_me.options.singlesearch != "") {
							_qry += "(" + _me.options.singlesearch + ") and ";
						}

						_key = _$select.val();

						_data.s_type = _key;
						_data.s_txtDisp = sqry;

						sqry = (_$$.util.isTwoByteCheck(sqry) ? sqry : "*" + sqry + "*");
						if (_key == "all") {
							//2021-10-18 By LHJ 공백을 and로 치환함
							//_qry += "(" + sqry + ")";
							_qry += "(" + sqry.replace(/[\s]+/g, " and ") + ")";
							//_qry += "(" + (_$$.util.isTwoByteCheck(sqry)? sqry : sqry) + ")";
						} else {
							_qry += "(" + $.map(_key.split("|"), function (v, i) {
								return "([" + v + "] contains " + sqry + ")";
							}).join(" or ") + ")";
						}

						_me.options.searchdata = _data;
						return _qry;
					}

					function _searchVal() {
						var _me = this,
							_$sinp = $("input[name='search']", _$listsearch),
							_strqry = "";

						// 콤마도 Query is not understandable 발생시키므로 공백으로 치환 moddified by 21.10.18 by noh
						_strqry = _$sinp.val().replace(/\(/g, " ").replace(/\)/g, " ").replace(/,/g, " ");
						// ()가 처음과 끝에 나올경우 공백으로 치환된 값은 삭제. " and "로 치환되지 않도록 하기 위함. added on 21.10.18 by noh
						_strqry = _strqry.replace(/^[\s]+/, "").replace(/[\s]+$/, "");

						if ($.trim(_strqry) == "") {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
							_$sinp.focus();
							return false;
						}
						if (/\(|\)|\[|\]|\{|\}|\<|\>/.exec($.trim(_strqry)) != null) {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
							_$sinp.focus();
							return false;
						}
						return _strqry;
					}

					function _search() {

						var _sortopt = { sortnm: _me.options.header.sortnm, sortorder: _me.options.header.sortorder },
							_strqry = _searchVal();

						if (!_strqry) return false;

						_me.options.page = 1;
						_me.options.searchqry = _makeQuery(_strqry);
						_me.options.searchview = true;

						_me.resort(_sortopt.sortnm, _sortopt.sortorder);

						//_me._listProc();
						//_$sinp.val("");
					}

					console.log("Search Proc");

					if (!$.isEmptyObject(_me.options.header.search)) {
						// 검색대상 설정하기
						console.log("Search Proc 1");
						var _$select = $("<select>").appendTo($("div.dwp-selectbox", _$listsearch));
						$.each(_me.options.header.search, function (i, o) {
							var _type = (o.hasOwnProperty("type") ? o.type : "");
							if (_type != "date") {
								$("<option/>").appendTo(_$select)
									.text(o.title).val(o.key).attr("data-type", _type);
							}
						});

						// 검색처리 수행
						console.log("Search Proc 2");
						var _$sinp = $("input[name='search']", _$listsearch);
						_$sinp.on("keydown", function (e) {
							if (e.keyCode != "13") { return; }
							//e.preventDefault();
							_search();
						});

						$("a.search", _$listsearch).on("click", function (e) {
							_search();
						});

						// 검색영역 비활성화 처리
						$("a.close", _$listsearch).on("click", function (e) {
							_$listsearch.effect("clip", { mode: "hide" }, 800, function () {
								_$sinp.val("");
								_$listtitle.show();
								if (_me.options.searchview) {
									_me.reload({ page: 1, searchqry: "", searchview: false });
								}
								//setTimeout(function(){
								//	$("input[name='search']", _$listsearch).focus();
								//},400);
							});
						});

						// 검색영역 활성화처리
						console.log("Search Proc 3");
						var _$srchbtn = $("<a class='search'><img src='" + $fn.getPath('weblib') + "/images/mobile/search.png'/></a>").appendTo($("div.right", _$listtitle));
						_$srchbtn.off("click").on("click", function () {
							_$listtitle.effect("clip", { mode: "hide" }, 800, function () {
								_$listsearch.show();
								setTimeout(function () {
									$("input[name='search']", _$listsearch).focus();
								}, 400);
							});
						});
						console.log("Search Proc 4");
						$("div.left span", _$listtitle).off("click").on("click", function () {
							_$srchbtn.trigger("click");
						});
					}

					// 전체선택 Box
					console.log("CheckBox");
					if (_me.options.ismcheckbox) {
						$("input[name='chkall']", _$listcheckbox).on("click", function () {
							_me.checkedAll(this.checked);
						});


						// 체크박스영역 비활성화 처리
						//체크박스 선택시 활성화 되도록 변경 : 2021-01-27
						/*
						$("a.close", _$listcheckbox).on("click", function(e) {
							_$listcheckbox.effect("clip", { mode: "hide" }, 800, function() {
								_me.checkedAll(false);
								_$listtitle.show();
								//setTimeout(function(){
								//	$("input[name='search']", _$listsearch).focus();
								//},400);
							});
						});

						var _$checkbox = $("<a class='checkbox'><img src='" + $fn.getPath('weblib') + "/images/mobile/checkbox.png'/></a>").appendTo($("div.right", _$listtitle));
						_$checkbox.off("click").on("click", function () {
							_$listtitle.effect("clip", { mode: "hide" }, 800, function () {
								_$listcheckbox.show();
								//setTimeout(function(){
								//	$("input[name='search']", _$listsearch).focus();
								//},400);
							});
						});
						*/

						var _btninfo = _me.options.mchkbutton;
						if (_btninfo == null || _me.options.mchkbtnlist == "") {
							//pass
							console.log("Check Menu Pass");
						} else {
							var _vbtnlist = _me.options.mchkbtnlist.split(",");
							var _$menu = $("<a class='menu'><img src='" + $fn.getPath('weblib') + "/images/mobile/menu.png'/></a>").prependTo($("div.dwp-right", _$listcheckbox));
							_$menu.off("click").on("click", function () {
								// Qt메뉴표시
								$dwp.ui.qtdialog.init(_$menu, {
									qtid: "mchkbtn_list",
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
						}
					}

					// 메뉴처리
					console.log("Menu Proc");
					var _btninfo = _me.options.button;
					if (_btninfo == null || _me.options.mbtnlist == "") {
						//pass
						console.log("Menu Proc Pass");
					} else {
						var _vbtnlist = _me.options.mbtnlist.split(",");
						var _$menu = $("<a class='menu'><img src='" + $fn.getPath('weblib') + "/images/mobile/menu.png'/></a>").appendTo($("div.right", _$listtitle));
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
					}

				}
				/**
				 * 공지배너 처리
				 */
				,
				_msgBanner: function () {
					var _me = this,
						_$banner = null,
						_lsmsg = null;

					_$banner = $("div.dwp-msg-banner", _me.element)

					if (!_me.options.notimsg.isuse || _me.options.notimsg.url == "") { _$banner.hide(); return false; }

					// Local Storage 내용 확인하기
					_lsmsg = _me.getNotiMsgOpt();

					if (_lsmsg != null) {
						if (_lsmsg.ishide && _lsmsg.date == moment().format("YYYY-MM-DD")) { _$banner.hide(); return false; }
					}

					_$$.util.xAjax({ url: _me.options.notimsg.url, async: false })
						.done(function (data) {
							if ($.isArray(data) && data.length > 0) {
								var _h = "<div class=\"msg\">" + data[0]._summary + "</div>";
								_h += "<div class=\"btn-close\"><button type=\"button\">닫기</button></div>";

								_$banner.html(_h);
								_$banner.show();
								$("div.btn-close", _$banner).off("click").on("click", function () {
									_$banner.hide("slow");
									// Cookie 처리
									_me.setNotiMsgOpt({ ishide: true, date: moment().format("YYYY-MM-DD") })
								});
							}
						})
				}
				/**
				 * 모바일 버튼 처리
				 */
				,
				_btnMProc: function () {
					// 임시로 임직원 조회 시인 경우, 추가된 아이콘만 삭제함.
					var _me = this,
						_$btngrp = $("div.header-btn-group", _me.element.parents("div.dwp-mobile-area"));

					if (_me.element.parents("div.dwp-mobile-area").attr("dividx") != "2") { return; }
					if (_$btngrp.size() > 0) _$btngrp.remove();
				}
				/**
				 * 버튼 처리
				 */
				,
				_btnProc: function () {
					var _me = this,
						_btninfo = this.options.button,
						_$btnarea = $("div.dwp-btn-group", this.element),
						_btnlist = _$btnarea.attr("data-btn-list"),
						_instance = _me.element.data("dwp-view"),
						_$btn = null,
						_vbtnlist = null;

					if (_btninfo == null || _btnlist == "") return;

					_vbtnlist = _btnlist.split(",");
					$.each(_vbtnlist, function (i, v) {
						if (_$btnarea.is("[data-btn-" + v + "]")) {
							_vbtnlist[i] = _$btnarea.attr("data-btn-" + v).split(",")
						}
					});

					$dwp.ui.button(_$btnarea, { buttons: $dwp.core.util.exObjList(_btninfo, _vbtnlist), data: [_instance, _me.element] });
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
				/**
				 * 모바일 정렬처리
				 */
				,
				_sortMProc: function () {
					console.log("sortMProc")
					var _me = this,
						_$wrap = $(".dwp-header-m div.inner-m", _me.element.parents("div.dwp-mobile-area")),
						_$sort = $("div.view-trigger", _$wrap),
						_issort = false,
						_h = "";

					if (_me.element.parents("div.dwp-mobile-area").attr("dividx") == "1") return;
					if ($.isEmptyObject(_me.options.header)) return;

					if (!_me.options.issort) {
						if (_$sort.size() > 0) { _$sort.hide(); }
						return;
					}
					//console.log("sortMProc1")
					// sort 항목 여부 체크
					$.each(_me.options.header.col, function (i, o) {
						if (o.sort) { _issort = true; return false; }
					});
					if (!_issort) return;
					//console.log("sortMProc2")

					if (_$sort.size() == 0) {
						_$sort = $("<div class='view-trigger'></div>").appendTo(_$wrap);
					}

					_$sort.show();

					_h = "<a><img src='" + $fn.getPath("weblib") + "/images/common/icon-align-view.svg'></a>";
					//_h += "<div class='view-option'><div class='option-list'></div></div>";

					_$sort.html(_h);
					/*
					var _$optlist = $("div.option-list", _$sort);
					$.each(_me.options.header.col, function(i, o) {
						var _$option = null;
						if (o.sort) {
							_$option = $("<a/>").appendTo(_$optlist)
							.text(o.title + " " + $fn.getCodeMsg("comm.msg.msg009"))
							.attr({sortnm : o.name, sortorder : _$$.view._CONST.DES});

							//if (o.name == _me.options.header.sortnm) {
							//	_$option.attr("selected", "true");
							//}

							_$option = $("<a/>").appendTo(_$optlist)
							.text(o.title + " " + $fn.getCodeMsg("comm.msg.msg010"))
							.attr({sortnm : o.name, sortorder : _$$.view._CONST.ASC});
						}
					});

					$("a", _$optlist).off("click").on("click", function(){
						_me.resort($(this).attr("sortnm"), $(this).attr("sortorder"));
					});

					_$sort.off("click").on("click", function(){
						$(this).toggleClass("active");
					});
					*/
					_$sort.off("click").on("click", function () {
						$dwp.ui.qtdialog.init(_$sort, {
							qtid: "msort_group",
							dialogClass: 'titleless dropdown-type-dialog',
							width: "140px",
							position: { my: "right top", at: "right bottom", collision: "flipfit" },
							initcallback: function (_$qtdialog) {
								var i = 0;
								var _$ul = $("<ul class='dwp-option-list'></ul>").appendTo(_$qtdialog.element);
								$.each(_me.options.header.col, function (i, o) {
									var _$li;
									var _sorttype = (typeof o.sorttype == "undefined" ? "all" : o.sorttype);
									if (o.sort) {
										if (_sorttype == "all") {
											_$li = $("<li><span type='button'>" + o.title + " " + $fn.getCodeMsg("comm.msg.msg010") + "</span></li>").appendTo(_$ul)
												.attr({ sortnm: o.name, sortorder: _$$.view._CONST.DES });

											_$li = $("<li><span type='button'>" + o.title + " " + $fn.getCodeMsg("comm.msg.msg009") + "</span></li>").appendTo(_$ul)
												.attr({ sortnm: o.name, sortorder: _$$.view._CONST.ASC });
										} else if (_sorttype == "asc") {
											_$li = $("<li><span type='button'>" + o.title + "</span></li>").appendTo(_$ul)
												.attr({ sortnm: o.name, sortorder: _$$.view._CONST.ASC });
										} else if (_sorttype == "des") {
											_$li = $("<li><span type='button'>" + o.title + "</span></li>").appendTo(_$ul)
												.attr({ sortnm: o.name, sortorder: _$$.view._CONST.DES });
										}
									}
								});
								$("li", _$ul).off("click").on("click", function () {
									_me.resort($(this).attr("sortnm"), $(this).attr("sortorder"));
									_$qtdialog.close();
								});
							}
						});
					});
				}
				/**
				 * 정렬처리
				 */
				,
				_sortProc: function () {
					var _me = this,
						_$sort = $("div[name='dwp-sort-area']", _me.element),
						_h = "",
						__$sort = null,
						_$select = null,
						_$sortorder = null,
						_issort = false;

					if ($.isEmptyObject(_me.options.header)) return;

					if (!_me.options.issort) return;
					// sort 항목 여부 체크
					$.each(_me.options.header.col, function (i, o) {
						if (o.sort) { _issort = true; return false; }
					});

					if (!_issort) return;

					_h = "<div><div class='dwp-align-grouping'><div class='dwp-selectbox'></div></div></div>";

					_$sort.html(_h);

					__$sort = $("div.dwp-selectbox", _$sort);
					_$select = $("<select>").appendTo(__$sort);
					$.each(_me.options.header.col, function (i, o) {
						var _$option = null;
						if (o.sort) {

							//컬럼 헤드를 html 태그를 넣어서 처리하는 경우 검색카테고리에 태그가 보이는 현상 보정
							//2020.08.27 by dwlee
							var _title = $("<span>" + o.title + "</span>").text();
							if (_title == "") {
								_title = o.title;
							}

							_$options = $("<option/>").appendTo(_$select)
								.text(_title)
								.val(o.name)
							if (o.name == _me.options.header.sortnm) {
								_$options.prop("selected", true);
							}
						}
					});

					//sort order 처리
					_$sortorder = $("<div name='_sortorder' class='dwp-btn toggle'><button type='button'><img src='" + $dwp.core.getPath("weblib") + "/images/common/icon-align-arrow-bg.png'></button></div>").appendTo(__$sort.parent());
					//__$sort.parent().append("<div class='dwp-btn toggle'><button type='button'><img src='" + $dwp.core.getPath("weblib") + "/images/common/icon-align-arrow-bg.png'></button></div>");
					if (_me.options.header.sortorder == _$$.view._CONST.DES) {
						_$sortorder.addClass("active");
					}

					_$select.off("change").on("change", function () {
						_me.resort($(this).val(), (_$sortorder.hasClass('active') ? _$$.view._CONST.DES : _$$.view._CONST.ASC));
					});

					_$sortorder.off("click").on("click", function () {
						$(this).toggleClass("active");
						_me.resort(_$select.val(), ($(this).hasClass('active') ? _$$.view._CONST.DES : _$$.view._CONST.ASC));
					});

				}
				/**
				 * 모바일 분류처리
				 */
				,
				_cateMProc: function (isreload) {
					var _me = this,
						_$cate = $("div.dwp-select-cate", _me.element),
						_$tabs = _me.element.parents("div.dwp-container-m").children("div.dwp-3depth-nav"),
						_isreload = typeof isreload == "undefined" ? false : isreload;

					if (_me.options.ismenucate && !_isreload) {
						if (_me.element.parent("div.slide").size() > 0) {
							var _omenu = _me.element.parent("div.slide").data($dwp.core.mportal._CONST._DATA.LNB_ITEM)
							if (_omenu) {
								// 메뉴리스트 가져오기
								var _data = [];
								_$$.util.xAjax({
									url: $dwp.core.util.getProxyUrl($dwp.core.getPath("menu") + "/api/data/collections/name/wvlnbpar_mo?count=999"),
									data: { category: _omenu.mid },
									dataType: "json",
									async: false,
									cache: false
								})
									.done(function (jdata) {
										var _blvl = 0;
										$(jdata).each(function (i, data) {
											if (i == 0) _blvl = parseInt(data._level, 10);
											var _row = {};
											_row.key = data._lnbid
											_row.mid = data._lnbid;
											_row.ftitle = data._title;
											_row.title = $dwp.core.lang.getCurMsg(data._title)
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

											_data.push(_row);
										});

									});
								_me.options.mcatedata = _data;
							}
						}
					}
					//if (!_me.options.iscategory && !$.isArray(_me.options.mcatedata)) {
					if (!_me.options.iscategory && _me.options.mcatedata.length == 0) {
						if (_me.options.layer != "home") {
							if (_$tabs.size() > 0) { _$tabs.removeClass("active"); }
						}
						return;
					}
					var _odata = null;
					if (_me.options.mcatetype == "tab") {
						if (_$tabs.size() == 0) {
							_$tabs = $("<div class='dwp-3depth-nav'><div class='nav-inner'></div></div>").insertBefore(_me.element.parents("div.dwp-contents"));
						}
						_$tabs.addClass("active");

						$("div.nav-inner", _$tabs).empty();

						// category 처리 생산직 앱 용 예외 처리
						if (_me.options.mcatedata.length > 0) {
							_makeTabData(_me.options.mcatedata);
						} else {
							var _data = [];
							if (typeof _me.options.header.category == "object" && _me.options.header.category.hasOwnProperty("data")) {
								_data = _me.options.header.category.data;
							} else if (typeof this.options.header.category.data == "function") {
								_data = _me.options.header.category.data();
							}
							if (typeof _data != "undefined" && _data.length > 0) {
								_makeTab(_data, 1);
							} else {
								_$tabs.removeClass("active");
							}
						}
					} else {
						if (_$tabs.size() > 0) { _$tabs.removeClass("active"); }
						/* 2017-12-21 By Lee HongJae
						if (_$cate.size() == 0) {
							_$cate = $("<div class='dwp-select-cate'></div>").prependTo(_me.element);
						}
						*/
						if (_$cate.size() > 0) { _$cate.remove(); }
						_$cate = $("<div class='dwp-select-cate'></div>").prependTo(_me.element);

						_$cate.append("<div class='dwp-grouping expended fixed'></div>");

						// category 처리
						if (typeof _me.options.header.category == "object") {
							_makeCate(_me.options.header.category.data, 1);
						} else if (typeof this.options.header.category.data == "function") {
							_makeCate(_me.options.header.category.data(), 1);
						}
					}

					function _makeTabData(data) {
						$.each(data, function (i, o) {
							var _$a = $("<a></a>").appendTo($("div.nav-inner", _$tabs))
								.text(_$$.lang.getCurMsg(o.title))
								.data("_MENU", o)
								.data("_FULL_MENU", data);

							//if (_me.options._selcate == o.mid) {_$a.addClass("active");}
						});

						var _idx = 0;
						var _pindex = $("div.visual-slider", $dwp.core.mportal.curLayer()).slick('slickCurrentSlide');
						if (_me.element.parents("div.dwp-container-m").data("_SUB_MENU_" + _pindex)) {
							_idx = _me.element.parents("div.dwp-container-m").data("_SUB_MENU_" + _pindex).idx;
						}
						$($("a", _$tabs).get(_idx)).addClass("active").siblings().removeClass("active");

						$("div.nav-inner a", _$tabs).off("click").on("click", function () {
							var _data = $(this).data("_MENU")
								//,_full = $(this).data("_FULL_MENU")
								,
								_opt = { layer: "view", subtype: "sub", isreload: true };

							$(this).addClass("active").siblings().removeClass("active");
							//_me.options._selcate = _data.mid;

							var _index = 0;
							if ($("div.visual-slider", $dwp.core.mportal.curLayer()).size() > 0) {
								_index = $("div.visual-slider", $dwp.core.mportal.curLayer()).slick('slickCurrentSlide');
								var _$slider = $($("div.visual-slider", $dwp.core.mportal.curLayer()).slick("getSlick").$slides[_index]);
								if (_$slider.size() > 0) {
									var _menu = _$slider.data($dwp.core.mportal._CONST._DATA.LNB_ITEM);
									$.extend(_opt, _menu);
								}
							}
							_opt.link = _data.link;
							_opt.linktype = _data.linktype;

							//_opt.fullmenu = _full;
							_me.element.parents("div.dwp-container-m").data("_SUB_MENU_" + _index, { idx: $(this).index() });

							$dwp.core.mportal.loadPage(_opt);

						});
					}

					function _searchVal() {
						var _$search = $("div.search-trigger", _me.element.parents("div.dwp-mobile-area")),
							_$sinp = $("input[name='search']", _$search);

						return _$sinp.val();
					}

					function _makeQuery() {
						var _$search = $("div.search-trigger", _me.element.parents("div.dwp-mobile-area")),
							_$sinp = $("input[name='search']", _$search),
							_strqry = "",
							_qry = "";

						// 콤마도 Query is not understandable 발생시키므로 공백으로 치환 moddified by 21.10.18 by noh
						_strqry = _$sinp.val().replace(/\(/g, " ").replace(/\)/, " ").replace(/,/g, " ");
						// ()가 처음과 끝에 나올경우 공백으로 치환된 값은 삭제. " and "로 치환되지 않도록 하기 위함. added on 21.10.18 by noh
						_strqry = _strqry.replace(/^[\s]+/, "").replace(/[\s]+$/, "");

						if ($.trim(_strqry) == "") {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
							_$sinp.focus();
							return false;
						}
						if (/\(|\)|\[|\]|\{|\}|\<|\>/.exec($.trim(_strqry)) != null) {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
							_$sinp.focus();
							return false;
						}

						if (_me.options.singlesearch != "") {
							_qry += "(" + _me.options.singlesearch + ") and ";
						}

						//2021-10-18 By LHJ 공백을 and로 치환함
						//_qry += "(" + _strqry + ")";
						_qry += "(" + _strqry.replace(/[\s]+/g, " and ") + ")";

						return _qry;
					}

					function _makeTab(data) {
						$("<a></a>").appendTo($("div.nav-inner", _$tabs))
							.text($fn.getCodeMsg("comm.title.searchall"))
							.attr("cate", "")
							.addClass("active");

						//_me.element.parents("div.dwp-container-m").data("_SUB_MENU", {idx : 0});

						$.each(data, function (i, o) {
							var _$a = $("<a></a>").appendTo($("div.nav-inner", _$tabs))
								.text(_$$.lang.getCurMsg(o.title))
								.attr("cate", o.val);

							if (o.children) {
								_$a.data("_CHILD", o.children);
							}

						});

						$("div.nav-inner a", _$tabs).off("click").on("click", function () {
							var _val = [],
								_singlefld = [],
								_single = "",
								_singlesearch = "";

							$(this).addClass("active").siblings().removeClass("active");

							if ($(this).attr("cate") != "") {
								_val.push($(this).attr("cate"));
							}

							_index = 0;
							if ($("div.visual-slider", $dwp.core.mportal.curLayer()).size() > 0) {
								_index = $("div.visual-slider", $dwp.core.mportal.curLayer()).slick('slickCurrentSlide');
							}
							_me.element.parents("div.dwp-container-m").data("_SUB_MENU_" + _index, { idx: $(this).index() });

							_singlefld = _me.options.singlefld.split("^");

							if (_val.length == 0) {
								if (_me.options.isdefaultsingle) {
									_single = ((_me.options._single != "" && _me.options._single.toUpperCase() != "ALL") ? _me.options._single : "all");
									_singlesearch = (_me.options._singlesearch != "" ? "(" + _me.options._singlesearch + ") " : "");
								}
								//_single += "all";
								//_singlesearch = "";
							} else {
								if (_me.options.isdefaultsingle) {
									if (_me.options.usesingleall) {
										_single = ((_me.options._single != "") ? _me.options._single + "^" : "");
									} else {
										_single = ((_me.options._single != "" && _me.options._single.toUpperCase() != "ALL") ? _me.options._single + "^" : "");
									}
									_singlesearch = (_me.options._singlesearch != "" ? "(" + _me.options._singlesearch + ") AND " : "");
								}

								_single += _val.join("^");
								_singlesearch += $.map(_val, function (v, i) {
									if (_singlefld.length == 1) {
										return "([" + _singlefld[0] + "] Contains " + v + ")";
									} else {
										return "([" + _singlefld[i] + "] Contains " + v + ")";
									}
									//return "([" + _me.options.singlefld + "] Contains " + v + ")";
								}).join(" AND ");
							}
							//console.log("_single:", _single);
							//console.log("_singlesearch:", _singlesearch);

							_me.options.single = _single;
							_me.options.singlesearch = _singlesearch;
							_me.options.page = 1;
							if (_me.options.searchview) {
								var _sqry = _searchVal();
								if (!_sqry) return;
								_me.options.searchqry = _makeQuery();
								//_me.options.page = 1;
							}
							_me.reload({});

							_me.element.parents("div.dwp-contents").scrollTop(0);
						});
					}

					function _makeCate(data, lvl) {
						// 1단분류만 생성함
						var _$pwrap = $("<div></div>").appendTo(_$cate.children("div.dwp-grouping"));
						var _$wrap = $("<div class='dwp-selectbox'></div>").appendTo(_$pwrap),
							_$select = $("<select name='category'>").appendTo(_$wrap),
							_$sselect = null;

						var __$opt = $("<option/>").appendTo(_$select)
							.text($fn.getCodeMsg("comm.title.searchall")).val("");

						if (_me.options.header.category.hasOwnProperty("isall") && _me.options.header.category.isall) {
							__$opt.val("all");
						}

						$.each(data, function (i, o) {
							var _$opt = $("<option/>").appendTo(_$select)
								.text(_$$.lang.getCurMsg(o.title)).val(o.val);

							if (o.children) {
								_$opt.data("_CHILD", o.children);
							}
						});

						if (_me.options.header.category.lvl > lvl) {
							_$sselect = _makeCate([], ++lvl);
						}

						_$select.on("change", function () {
							var _$opt = $("option:selected", this),
								_val = [],
								_singlefld = [],
								_single = "",
								_singlesearch = "";

							if (_$sselect) {
								_$sselect.empty();
							}
							$("<option/>").appendTo(_$sselect)
								.text($fn.getCodeMsg("comm.title.searchall")).val("");

							if ($.hasData(_$opt[0])) {
								var _o = _$opt.data("_CHILD");
								$.each(_o, function (i, o) {
									var __$opt = $("<option/>").appendTo(_$sselect)
										.text(_$$.lang.getCurMsg(o.title)).val(o.val);
									if (o.children) {
										__$opt.data("_CHILD", o.children);
									}
								});
							}
							//if (_$sselect) {
							//	_$sselect.trigger("change");
							//}

							$("select[name='category']", _$cate).each(function () {
								if ($(this).val() != "") {
									_val.push($(this).val());
								}
							});
							//if ($(this).val() != "") {
							//	_val.push($(this).val());
							//}

							_singlefld = _me.options.singlefld.split("^");

							if (_val.length == 0) {
								_single = ((_me.options._single != "" && _me.options._single.toUpperCase() != "ALL") ? _me.options._single : "all");
								_singlesearch = (_me.options._singlesearch != "" ? "(" + _me.options._singlesearch + ") " : "");
								//_single += "all";
								//_singlesearch = "";
							} else {
								if (_me.options.usesingleall) {
									_single = ((_me.options._single != "") ? _me.options._single + "^" : "");
								} else {
									_single = ((_me.options._single != "" && _me.options._single.toUpperCase() != "ALL") ? _me.options._single + "^" : "");
								}
								_singlesearch = (_me.options._singlesearch != "" ? "(" + _me.options._singlesearch + ") AND " : "");

								_single += _val.join("^");
								_singlesearch += $.map(_val, function (v, i) {
									//return "([" + _me.options.singlefld + "] Contains " + v + ")";
									if (_singlefld.length == 1) {
										return "([" + _singlefld[0] + "] Contains " + v + ")";
									} else {
										return "([" + _singlefld[i] + "] Contains " + v + ")";
									}
								}).join(" AND ");
							}
							//console.log("_single:", _single);
							//console.log("_singlesearch:", _singlesearch);

							_me.options.single = _single;
							_me.options.singlesearch = _singlesearch;
							_me.options.page = 1;
							if (_me.options.searchview) {
								var _sqry = _searchVal();
								if (!_sqry) return;
								_me.options.searchqry = _makeQuery(_sqry);
								//_me.options.page = 1;
							}
							_me.reload({});
						});
						return _$select;
					}
					// category 처리
					/*
					if( typeof _me.options.header.category == "object" ) {
						if (_me.options.catetype == "tab") {
							_makeTab();
						} else {
							_makeCate(_me.options.header.category.data, 1);
						}
					} else if ( typeof this.options.header.category.data == "function") {
						if (_me.options.catetype == "tab") {
							_makeTab();
						} else {
							_makeCate(_me.options.header.category.data(), 1);
						}
					}
					*/
				}
				/**
				 * 분류처리
				 */
				,
				_cateProc: function () {
					var _me = this,
						_$sort = $("div[name='dwp-cate-area']", _me.element),
						_h = "",
						__$sort = null,
						_initcate = [];

					if (!_me.options.iscategory) return;

					if (_me.options.single != "") {
						//_initcate = _me.options.single.split("^");
						if (_me.options.isdefaultsingle && _me.options._single != "") {
							var _tmp = _me.options.single.replace(_me.options._single, "");
							if (_tmp != "") {
								_tmp = _tmp.substr(1, _tmp.length - 1);
								_initcate = _tmp.split("^");
							}
						} else {
							_initcate = _me.options.single.split("^");
						}
					}

					function _makeCate(data, lvl) {
						var _$div = $("<div/>").appendTo(_$sort),
							__$div = $("<div class='dwp-selectbox md'>").appendTo(_$div),
							_$select = $("<select name='category'>").appendTo(__$div),
							_issub = false,
							_data = [],
							_$sselect = null;

						if (_me.options.isselectall) {
							var __$opt = $("<option value=''/>").appendTo(_$select)
								.text($fn.getCodeMsg("comm.title.searchall")).val("");

							if (_me.options.header.category.hasOwnProperty("isall") && _me.options.header.category.isall) {
								__$opt.val("all");
							}
						}

						$.each(data, function (i, o) {
							var _$opt = $("<option/>").appendTo(_$select)
								.text(_$$.lang.getCurMsg(o.title)).val(o.val);

							if (o.children) {
								_$opt.data("_CHILD", o.children);
							}
						});

						if (_me.options.header.category.lvl > lvl) {
							_$sselect = _makeCate([], (lvl + 1));
						}

						_$select.on("change", function () {
							var _$opt = $("option:selected", this),
								_val = [],
								_singlefld = [],
								_single = "",
								_singlesearch = "";

							if (_$sselect) {
								_$sselect.empty();
							}
							var __$opt = $("<option/>").appendTo(_$sselect)
								.text($fn.getCodeMsg("comm.title.searchall")).val("");

							if (_me.options.header.category.hasOwnProperty("isall") && _me.options.header.category.isall) {
								__$opt.val("all");
							}

							if ($.hasData(_$opt[0])) {
								var _o = _$opt.data("_CHILD");
								$.each(_o, function (i, o) {
									var __$opt = $("<option/>").appendTo(_$sselect)
										.text(_$$.lang.getCurMsg(o.title)).val(o.val);
									if (o.children) {
										__$opt.data("_CHILD", o.children);
									}
								});
							}
							if (_$sselect) {
								_$sselect.trigger("change");
							}

							//if( _me.options.hasOwnProperty("param") && _me.options.param.hasOwnProperty("boardid") ){
							//	_single = _me.options.param.boardid + "^";
							//}
							$("select[name='category']", _$sort).each(function () {
								if ($(this).val() != "") {
									_val.push($(this).val());
								}
							});

							_singlefld = _me.options.singlefld.split("^");

							if (_val.length == 0) {
								if (_me.options.isdefaultsingle) {
									_single = ((_me.options._single != "" && _me.options._single.toUpperCase() != "ALL") ? _me.options._single : "all");
									_singlesearch = (_me.options._singlesearch != "" ? "(" + _me.options._singlesearch + ") " : "");
								}
								//_single += "all";
								//_singlesearch = "";
							} else {
								if (_me.options.isdefaultsingle) {
									if (_me.options.usesingleall) {
										_single = ((_me.options._single != "") ? _me.options._single + "^" : "");
									} else {
										_single = ((_me.options._single != "" && _me.options._single.toUpperCase() != "ALL") ? _me.options._single + "^" : "");
									}
									_singlesearch = (_me.options._singlesearch != "" ? "(" + _me.options._singlesearch + ") AND " : "");
								}

								_single += _val.join("^");
								_singlesearch += $.map(_val, function (v, i) {
									if (_singlefld.length == 1) {
										return "([" + _singlefld[0] + "] Contains " + v + ")";
									} else {
										return "([" + _singlefld[i] + "] Contains " + v + ")";
									}
									//return "([" + _me.options.singlefld + "] Contains " + v + ")";
								}).join(" AND ");
							}
							//console.log("_single:", _single);
							//console.log("_singlesearch:", _singlesearch);

							if (_me.options.viewtype == "slist") {
								_me.options.single = _single;
								_me.options.singlesearch = _singlesearch;
								_me.options.page = 1;
							} else {
								_me.options.single = _single;
								_me.options.singlesearch = _singlesearch;
								_me.options.page = 1;
								if (_me.options.searchview) {
									var _sqry = _me._searchVal();
									if (!_sqry) return;
									_me.options.searchqry = _me._makeQuery(_sqry);
									//_me.options.page = 1;
								}
							}
							// 2019-10-01 By LHJ 마지막 Change Event시만 수행하도록 변경
							if (lvl == _me.options.header.category.lvl) {
								if (typeof _me.options.header.category.change == "function" && _me.options.header.category.hasOwnProperty("usechangefunc") && _me.options.header.category.usechangefunc) {
									_me.options.header.category.change(_me, _$select);
								} else {
									_me.reload({});
								}
							}

						});

						return _$select;
					}
					// category 처리
					var __data = null;
					if (typeof _me.options.header.category == "object") {
						__data = _me.options.header.category.data;
						_makeCate(__data, 1)
					} else if (typeof this.options.header.category.data == "function") {
						__data = _me.options.header.category.data();
						_makeCate(__data, 1)
						//var _$div = $("<div/>").appendTo(_$sort);
						//_$div.html(this.options.header.category.data());
					}
					console.log("_initcate", _initcate);
					if (_initcate.length > 0) {

						$("select[name=category]", _$sort).each(function (i) {
							$(this).xval(_initcate[i]);

							var _$opt = $("option:selected", $(this));
							if ($.hasData(_$opt[0])) {
								var _o = _$opt.data("_CHILD");

								var _$nselect = $("select[name=category]", _$sort).get(i + 1);
								if (typeof _$nselect != "undefined") {
									$.each(_o, function (i, o) {
										var __$opt = $("<option/_$sselect>").appendTo($(_$nselect))
											.text(_$$.lang.getCurMsg(o.title)).val(o.val);
										if (o.children) {
											__$opt.data("_CHILD", o.children);
										}
									});
								}
							}

							//$(this).trigger("change");
						})
					}
				}
				/**
				 * 검색쿼리 생성함수
				 * @param	{string}	sqry	검색어
				 * @return	{string}	검색쿼리
				 */
				,
				_makeQuery: function (sqry) {
					var _me = this,
						_data = {},
						_$search = $("div[name='dwp-search-area']", _me.element),
						_$select = $("select", _$search),
						_$sinp = $("input[name='search']", _$search),
						_$calfrom = $("input[name='searchfrom']", _$search),
						_$calto = $("input[name='searchto']", _$search),
						_qry = "",
                        _default_query = "",
						_key = "";

					if (_me.options.singlesearch != "") {
						_qry += "(" + _me.options.singlesearch + ") and ";
					}

                    _default_query = $("option:selected", _$select).attr("data-default-query") || "";
                    if (_default_query != "") {
                        _qry += "(" + _default_query + ") and ";
                    }

					_key = _$select.val();

					function _dateQry(key) {
						var _qry = "";
						if (_$calfrom.xval() != "" && _$calto.xval() != "") {
							_qry += "([" + key + "] >= " + _$calfrom.xval() + " and [" + key + "] <= " + _$calto.xval() + ")";
						} else if (_$calfrom.xval() != "" && _$calto.xval() == "") {
							_qry += "([" + key + "] >=" + _$calfrom.xval() + ")";
						} else if (_$calfrom.xval() == "" && _$calto.xval() != "") {
							_qry += "([" + key + "] <=" + _$calto.xval() + ")";
						}
						return _qry
					}
					if ($("option:selected", _$select).attr("data-type") == "date") {
						_data.dateType = _key;
						_data.sDateDisp = _$calfrom.xval();
						_data.eDateDisp = _$calto.xval();

						_qry += "(" + $.map(_key.split("|"), function (v, i) {
							return _dateQry(v);
						}).join(" or ") + ")";
					} else {
						_data.s_type = _key;
						_data.s_txtDisp = sqry;

						sqry = (_$$.util.isTwoByteCheck(sqry) ? sqry : "*" + sqry + "*");
						if (_key == "all") {
							//2021-10-18 By LHJ 공백을 and로 치환함
							//_qry += "(" + sqry + ")";
							_qry += "(" + sqry.replace(/[\s]+/g, " and ") + ")";
							//_qry += "(" + (_$$.util.isTwoByteCheck(sqry)? sqry : sqry) + ")";
						} else {
							_qry += "(" + $.map(_key.split("|"), function (v, i) {
								return "([" + v + "] contains " + sqry + ")";
							}).join(" or ") + ")";
						}
					}
					_me.options.searchdata = _data;
					return _qry;
				}
				/**
				 * 검색어(유효성 체크후) 리터함수
				 * @return	{string}	검색어
				 */
				,
				_searchVal: function () {
					var _me = this,
						_$search = $("div[name='dwp-search-area']", _me.element),
						_$select = $("select", _$search),
						_$sinp = $("input[name='search']", _$search),
						_$calfrom = $("input[name='searchfrom']", _$search),
						_$calto = $("input[name='searchto']", _$search),
						_strqry = "";

					if ($("option:selected", _$select).attr("data-type") == "date") {
						_strqry = _$calfrom.val() + "|" + _$calto.val();
						if (_$calfrom.val() == "" && _$calto.val() == "") {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg011") })
							_$calfrom.focus();
							return false;
						}
					} else {
						// 콤마도 Query is not understandable 발생시키므로 공백으로 치환 moddified by 21.10.18 by noh
						_strqry = _$sinp.val().replace(/\(/g, " ").replace(/\)/, " ").replace(/,/g, " ");
						// ()가 처음과 끝에 나올경우 공백으로 치환된 값은 삭제. " and "로 치환되지 않도록 하기 위함. added on 21.10.18 by noh
						_strqry = _strqry.replace(/^[\s]+/, "").replace(/[\s]+$/, "");

						if ($.trim(_strqry) == "") {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
							_$sinp.focus();
							return false;
						}
						if (/\(|\)|\[|\]|\{|\}|\<|\>/.exec($.trim(_strqry)) != null) {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
							_$sinp.focus();
							return false;
						}
					}
					//console.log(_strqry)
					return _strqry;
				}
				/**
				 * 검색처리 함수
				 */
				,
				_searchProc: function () {
					var _me = this,
						_$search = $("div[name='dwp-search-area']", _me.element),
						_h = "",
						_now = new Date(),
						_$select = null,
						_$sinp = null,
						_$calfrom = null,
                        _applcode = "",
						_$calto = null;

					if ($.isEmptyObject(this.options.header.search)) return;

					function _search() {

						var _sortopt = { sortnm: _me.options.header.sortnm, sortorder: _me.options.header.sortorder },
							_strqry = _me._searchVal();

						if (!_strqry) return false;

						_me.options.page = 1;
						_me.options.searchqry = _me._makeQuery(_strqry);
						_me.options.searchview = true;

						if (_me.options.issort) {
							_$sort = $("div[name='dwp-sort-area']", _me.element);
							if (_$sort.size() > 0) {
								_sortopt.sortnm = $("select", _$sort).xval();
								_sortopt.sortorder = ($("div[name='_sortorder']", _$sort).hasClass('active') ? _$$.view._CONST.DES : _$$.view._CONST.ASC);
							}
						}

						_me.resort(_sortopt.sortnm, _sortopt.sortorder);

						//_me._listProc();
						//_$sinp.val("");
					}

					//_h = "<div>";
                    _applcode = _me.options.applcode || "";
					_h = "<div class='dwp-search-grouping'>";
					_h += "<div class='dwp-search-area'>";
					_h += "<div class='dwp-search-form'>";
					_h += "<div class='dwp-btn icon btn-back'><span type='button'><img src='" + $fn.getPath("weblib") + "/images/common/arrow-back.svg'></span></div>"
					_h += "<div class='dwp-selectbox"+(_applcode=="aprv"? "" : " sm")+"'>";
					_h += "</div>";

					_h += "<div class='dwp-input' name='_textSearch'><input name='search' type='text'></div>";


					_h += "<div class='dwp-calendar-form' name='_dateSearch' style='display:none'>";
					_h += "<div class='dwp-input'><input name='searchfrom' type='text' data-type='date' data-start='searchfrom' data-end='searchto' value='" + _now.format("yyyy-mm-dd") + "'></div>";
					_h += "<span class='dwp-dash'>-</span>";
					_h += "<div class='dwp-input'><input name='searchto' type='text' data-type='date' data-start='searchfrom' data-end='searchto' value='" + _now.format("yyyy-mm-dd") + "'></div>";
					_h += "</div>"

					_h += "</div>";
					_h += "</div>"
					_h += "<div class='dwp-btn icon search'><span type='button'><img src='" + $dwp.core.getPath("weblib") + "/images/common/icon-search.svg' ></span></div>";
					_h += "<div class='dwp-btn-trigger'></div>";
					_h += "</div>";
					//_h += "</div>";

					_$search.html(_h);

					$dwp.ui.datepicker(_$search, {});

					_$select = $("<select>").appendTo($("div.dwp-selectbox", _$search))
					$.each(this.options.header.search, function (i, o) {
						var _type = (o.hasOwnProperty("type") ? o.type : "");
                        var _default_query = (o.hasOwnProperty("default_query") ? o.default_query : "");
						$("<option/>").appendTo(_$select)
							.text(o.title).val(o.key).attr("data-type", _type).attr("data-default-query", _default_query);
					});

					_$select.off("change").on("change", function () {
						if ($("option:selected", $(this)).attr("data-type") == "date") {
							$("div[name='_textSearch']", _$search).hide();
							$("div[name='_dateSearch']", _$search).show();
						} else {
							$("div[name='_dateSearch']", _$search).hide();
							$("div[name='_textSearch']", _$search).show();
						}
					});

					$(".dwp-search-grouping .dwp-btn-trigger", _$search).on("click", function (e) {
						var _$this = $(this);
						_$this.closest(".dwp-search-grouping").addClass("active");
						setTimeout(function () {
							_$this.closest(".dwp-search-grouping").find("input[type='text']").focus();
						}, 600);
					});

					_$sinp = $("input[name='search']", _$search);
					_$calfrom = $("input[name='searchfrom']", _$search);
					_$calto = $("input[name='searchto']", _$search);

					_$sinp.on("keydown", function (e) {
						if (e.keyCode != "13") { return; }
						//e.preventDefault();
						_search();

					});

					$(".dwp-search-grouping .dwp-btn.search", _$search).on("click", function (e) {
						var _$this = $(this);
						if (_$this.closest(".dwp-search-grouping").hasClass("active")) {
							_search();
						}
					});

					$(".dwp-search-grouping .dwp-btn.btn-back", _$search).on("click", function (e) {
						var _$this = $(this);

						$("div[name='_textSearch']", _$search).show();
						$("div[name='_dateSearch']", _$search).hide();

						_$sinp.val("");
						_$select.xval("");
						_$this.closest(".dwp-search-grouping").removeClass("active");

						if (_me.options.searchview) {
							_me.reload({ page: 1, searchqry: "", searchview: false });
						}
					});

					// 2017-01-30 수정
					if (_me.options.searchview && _me.options.hasOwnProperty("searchdata") && !$.isEmptyObject(_me.options.searchdata)) {
						//if (_me.options.viewtype == "slist") {
						if (_me.options.searchdata.hasOwnProperty("s_type")) {
							_$select.xval(_me.options.searchdata.s_type);
							if (_me.options.searchdata.hasOwnProperty("s_txtDisp")) {
								_$sinp.val(_me.options.searchdata.s_txtDisp);
							}
						} else if (_me.options.searchdata.hasOwnProperty("dateType")) {
							_$select.xval(_me.options.searchdata.dateType);
							if (_me.options.searchdata.hasOwnProperty("sDateDisp")) {
								_$calfrom.xval(_me.options.searchdata.sDateDisp);
							}
							if (_me.options.searchdata.hasOwnProperty("eDateDisp")) {
								_$calto.xval(_me.options.searchdata.eDateDisp);
							}
							$("div[name='_textSearch']", _$search).hide();
							$("div[name='_dateSearch']", _$search).show();
						}
						//}
						$(".dwp-search-grouping", _me.element).addClass("active")
					}

					//검색영역 처음부터 펼치기. modified on 21.10.06
					$(".dwp-search-grouping .dwp-btn-trigger", _$search).trigger("click");
				}
				/**
				 * 모바일 검색 수행함수
				 */
				,
				mSearchAction: function () {
					var _me = this,
						_$search = $("div.search-trigger", _me.element.parents("div.dwp-mobile-area")),
						_$searchbtn = $("a.search-btn", _$search),
						_$searchbbtn = $("a.btn-back", _$search),
						_$searchgbtn = $("a.btn-go", _$search),
						_$sinp = $("input[name='search']", _$search);

					function _search() {
						var _sortopt = { sortnm: _me.options.header.sortnm, sortorder: _me.options.header.sortorder },
							_strqry = "",
							_qry = "";

						// 콤마도 Query is not understandable 발생시키므로 공백으로 치환 moddified by 21.10.18 by noh
						_strqry = _$sinp.val().replace(/\(/g, " ").replace(/\)/, " ").replace(/,/g, " ");
						// ()가 처음과 끝에 나올경우 공백으로 치환된 값은 삭제. " and "로 치환되지 않도록 하기 위함. added on 21.10.18 by noh
						_strqry = _strqry.replace(/^[\s]+/, "").replace(/[\s]+$/, "");

						if ($.trim(_strqry) == "") {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
							_$sinp.focus();
							return false;
						}
						if (/\(|\)|\[|\]|\{|\}|\<|\>/.exec($.trim(_strqry)) != null) {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg.msg012") });
							_$sinp.focus();
							return false;
						}

						if (_me.options.singlesearch != "") {
							_qry += "(" + _me.options.singlesearch + ") and ";
						}

						// 2021-10-18 By LHJ 공백을 and로 치환함
						// _qry += "(" + _strqry + ")";
						_qry += "(" + _strqry.replace(/[\s]+/g, " and ") + ")";

						_me.options.page = 1;
						_me.options.searchqry = _qry;
						_me.options.searchview = true;

						/*
						if (_me.options.issort) {
							_$sort = $("div[name='dwp-sort-area']", _me.element);
							if (_$sort.size() > 0) {
								_sortopt.sortnm = $("select", _$sort).xval();
								_sortopt.sortorder = ( $("div[name='_sortorder']", _$sort).hasClass('active') ? _$$.view._CONST.DES : _$$.view._CONST.ASC);
							}
						}
						*/

						_me.resort(_sortopt.sortnm, _sortopt.sortorder);

						//_$sinp.val("");
					}

					_search();
				}
				/**
				 * 모바일 검색초기화 처리
				 */
				,
				_searchMProc: function () {
					var _me = this,
						_$search = $("div.search-trigger", _me.element.parents("div.dwp-mobile-area")),
						_$searchbtn = $("a.search-btn", _$search),
						_$searchbbtn = $("a.btn-back", _$search),
						_$searchgbtn = $("a.btn-go", _$search),
						_$sinp = $("input[name='search']", _$search);

					if ($.isEmptyObject(_me.options.header.search)) {
						_$search.hide();
						return;
					}

					_$search.show();

					// 초기화
					$(".search-form-m", _$search).removeClass("active");
					_$sinp.val("");

				}
				/**
				 * 보기 환경설정 초기화 처리
				 */
				,
				_settingProc: function () {
					var _me = this,
						_$search = $("div[name='dwp-search-area']", _me.element),
						_h = "",
						_$env = null;

					if (!_me.options.useviewsetting) return;

					_h = "<div>";
					_h += "<div class='dwp-btn icon'><button type='button'><img src='" + $dwp.core.getPath("weblib") + "/images/common/icon-setting.svg' ></button></div>";
					_h += "</div>";

					_$env = $(_h).appendTo(_$search);

					_$env.on("click", function () {
						$dwp.ui.qtdialog.init($(this), {
							qtid: "viewsetting",
							title: _$$.lang.getCodeMsg("comm.msg.msg013"),
							content: { url: $dwp.core.getPath("gwlib") + "/wviewsetting?readform" },
							initcallback: function (_$qtdialog) {
								var _env = _me.getEnvViewOpt(),
									_$sel = $("select[name='viewcntlist']", _$qtdialog.element),
									_$viewtype = $("div.icon-wrap.list", _$qtdialog.element);

								//목록 갯수
								if (_me.options.viewsetting.useviewcount) {
									$.each($dwp.core.getSysinfo().viewcountlist, function (i, v) {
										var _$opt = $("<option value='" + v + "'>" + v + "</option>").appendTo(_$sel);
										if (_env.ps == v) {
											_$opt.prop("selected", true);
										}
									});
								} else {
									$("div[name='viewcount']", _$qtdialog.element).hide();
								}

								//목록방식
								if (_me.options.viewsetting.useviewtype) {
									$.each(_me.options.useviewtypelist, function (i, v) {
										var _class = (v == "list" ? "list-grid" : v == "mix" ? "list-hybrid" : "list-" + v),
											_$div = $("<div class=\"dwp-btn icon\"><button type=\"button\"></button></div>").appendTo(_$viewtype)
												.addClass(_class)
												.attr("data-val", v);
										if (v == _env.viewtype) { _$div.addClass("active") };
									});
									/*
									$("div.icon-wrap.list div[data-val='" + _env.viewtype + "']", _$qtdialog.element).addClass("active");
									*/
									$("div.icon-wrap.list div", _$qtdialog.element).off("click").on("click", function () {
										$("div.icon-wrap.list div", _$qtdialog.element).removeClass("active");
										$(this).addClass("active");
									});
								} else {
									$("div[name='viewtype']", _$qtdialog.element).hide();
								}

								//미리보기
								if (_me.options.viewsetting.usepreview && _me.options.ispreview) {
									$("div.icon-wrap.view div[data-val='" + _env.preview + "']", _$qtdialog.element).addClass("active");
									$("div.icon-wrap.view div", _$qtdialog.element).off("click").on("click", function () {
										$("div.icon-wrap.view div", _$qtdialog.element).removeClass("active");
										$(this).addClass("active");
										if ($(this).attr("data-val") == "all") {
											$("input[name='usepopup']", _$qtdialog.element).prop("disabled", false);
										} else {
											$("input[name='usepopup']", _$qtdialog.element).xval("0");
											$("input[name='usepopup']", _$qtdialog.element).prop("disabled", true);
										}
									});
								} else {
									$("div[name='preview']", _$qtdialog.element).hide();
								}

								//문서열기
								if (_me.options.viewsetting.usepopupdoc) {
									$("input[name='usepopup']", _$qtdialog.element).xval((_env.ispopupdoc == "1" ? "1" : "0"));
									if (_env.preview != "all") {
										$("input[name='usepopup']", _$qtdialog.element).prop("disabled", true);
									}
								} else {
									$("div[name='popupdoc']", _$qtdialog.element).hide();
								}
							},
							buttons: [{
								title: _$$.lang.getCodeMsg("comm.btn.confirm"),
								click: function (_$qtdialog) {
									// 환경설정 값 적용하기
									var _env = {
										//key : _$$.getCurUser().pinfo.empno + "_" + _me.options.cdb.replace(/\//g, "_") + "_" + (_me.options.header.hasOwnProperty("sortvw") ? _me.options.header.sortvw : _me.options.viewalias)
										key: _$$.getCurUser().pinfo.empno + "_" + _me.options.cdb.replace(/\//g, "_") + "_" + _me.options.displaycode,
										path: _me.options.cdb,
										view: _me.options.viewalias,
										ps: "",
										viewtype: "",
										preview: "",
										ispopupdoc: ""
									};

									_env.ps = (_me.options.viewsetting.useviewcount) ? $("select[name='viewcntlist']", _$qtdialog.element).val() : _me.options.ps;
									_env.viewtype = (_me.options.viewtype == "slist" ? "slist" : $("div.icon-wrap.list div.active", _$qtdialog.element).attr("data-val"));
									_env.preview = $("div.icon-wrap.view div.active", _$qtdialog.element).attr("data-val");
									_env.ispopupdoc = $("input[name='usepopup']:checked", _$qtdialog.element).val();

									//_me.options.ps = _env.pagecnt;
									//_me.options.viewtype = _env.viewtype;
									$dwp.core.setViewSetting(_env.key, _env);

									_me.options.ispopupdoc = _env.ispopupdoc;
									_me.reload({ ps: _env.ps, viewtype: _env.viewtype });

									if (_me.options.ispreview) {
										_me.preview({ type: _env.preview });
									}
									_$qtdialog.close();
								}
							}, {
								title: _$$.lang.getCodeMsg("comm.btn.cancel"),
								click: function (_$qtdialog) {
									//console.log("aa", _$qtdialog);
									_$qtdialog.close();
								}
							}]
						});
					});
				}
				/**
				 * List 초기화 처리(viewtype따라 초기화 처리함)
				 */
				,
				_listProc: function () {
					var _me = this;
					// viewtype에 따라서 분기 처리 필요함.
					console.log("viewtype", _me.options.viewtype)
					switch (_me.options.viewtype) {
						case "custom":
							_me._customView();
							break;
						case "custom_view":
							_me._customViewMail_V2();
							break;
						case "m-list":
							_me._mlistView();
							break;
						case "mlist":
							_me._mlistView_();
							break;
						case "mthumb":
							_me._mlistView_();
							break;
						case "mcard":
							_me._mlistView_();
							break;
						case "thumb":
							_me._thumbView();
							break;
						case "card":
							_me._cardView();
							break;
						case "mix":
							_me._mixView();
							break;
						case "slist":
							_me._slistView();
							break;
						case "scustom":
							_me._sCustomView();
							break;
						default:
							_me._listView();
					}
				}
				/**
				 * 보기 조회(Ajax)호출 파리미터 설정
				 * @return	{object}	Ajax 설정 옵션
				 */
				,
				_jsonGetParmData: function () {
					var _me = this,
						_data = {},
						_url = _me.options.cdb + "/api/data/collections/name/" + _me.options.viewalias,
						_folderunid = _me.options.folderunid || "";

					if (_folderunid != "") {
						_url = _me.options.cdb + "/api/data/collections/unid/" + _me.options.folderunid
					}

					// 2020-09-15 By LHJ ADD View List Data URL 옵션 추가
					if (_me.options.jdata != "") {
						_url = _me.options.jdata;
					}

					_url += (_url.indexOf("?") > -1 ? "&" : "?") + "ps=" + _me.options.ps;
					_url += "&page=" + (_me.options.page - 1);

					//if( !_me.options.header.hasOwnProperty("sortvw") || _me.options.header.sortvw == "") {
					if (typeof _me.options.sortnm != "undefined" && _me.options.sortnm != "") {
						_data.sortcolumn = _me.options.sortnm;
						//_url += "&sortcolumn=" + _me.options.sortnm;
					}
					if (typeof _me.options.sortorder != "undefined" && _me.options.sortorder != "") {
						_data.sortorder = _me.options.sortorder;
						//_url += "&sortorder=" + _me.options.sortorder;
					}
					//}
					if (_me.options.single != "" && !_me.options.searchview) {
						_data.category = _me.options.single;
						//_url += "&category=" + _me.options.single;
					}

					if (_me.options.searchview) {
						_data.search = _me.options.searchqry;
					}

					if (_me.options.entrycount != "" && !_me.options.searchview) {
						_data.entrycount = "false";
					}
					return {
						url: _url,
						dataType: "json",
						async: true,
						cache: false,
						data: _data
					};
				}
				/**
				 * Custom View List(viewtype : custom)
				 * - Custom View Add Row 에서 호출
				 */
				,
				_convertData: function (cell, o) {
					var _me = this,
						_h = "",
						_v = o[cell.name],
						_header = _me.options.header;

					if (cell.type == "date") {
						_h = $dwp.core.util.toLocalDate(_v);
					} else if (cell.type == "file") {
						if (_v == "true") {
							_h = "<a class='dwp-cursor'><img class='icon-file' src='" + $dwp.core.getPath("weblib") + "/images/common/icon-file.svg'/></a>";
						}
					} else if (cell.type == "fnc" && typeof cell.content == "function") {
						return cell.content(o);
					} else if (cell.type == "code" && cell.hasOwnProperty("langcode")) {
						return $dwp.core.lang.getCodeObjMsg(cell.langcode, _v);
					} else {
						_h = $dwp.core.lang.getCurMsg(_v);
					}
					return _h;
				}
				/**
				 * Custom View List(viewtype : custom)
				 * - Custom View Add Row
				 */
				,
				_customAddRow: function (_$list, o, jtl) {
					var _me = this,
						_$row = $($dwp.core.jsonToHtml.convert(o, jtl)).appendTo(_$list);
					_$row.data(_$$.view._ROW_DATA, o);
					_$row.attr("data-key-unid", (o.hasOwnProperty("_key_unid") ? o._key_unid : o["@unid"]));

					if (_me.options.header.checkbox) {
						_h = "<div class='dwp-cell check-cell'>";
						_h += "<div class='dwp-checkbox textless'>";
						_h += "<label>";
						_h += "<input name='chk' type='checkbox' class='dwp-check'><span></span>";
						_h += "</label></div></div>";

						_$row.prepend(_h);
					}

					$.each(_me.options.header.colnm, function (i, v) {
						var _$cell = $("[data-cell=" + v + "]", _$row),
							_cell = _me.options.header.col[v],
							_css = "";

						if (_$cell.size() == 0 || typeof _cell == "undefined") return true;

						_css = (typeof _cell.css == "undefined" ? "" : typeof _cell.css == "function" ? _cell.css(o) : _cell.css);
						if (_css != "") { _$cell.addClass(_css); }
						if (_cell.width && _cell.width != "") {
							_$cell.css({ "width": _cell.width });
						}

						if (_cell.hasOwnProperty("isdirect") && _cell.isdirect) {
							if (_cell.type == "fnc" && typeof _cell.content == "function") {
								_cell.content(_$cell, o);
							}
						} else {
							_$cell.html(_me._convertData(_cell, o));
						}

						_$cell.on("click", function () {
							if (typeof _cell.click == "function") {
								_cell.click($(this), o, _me.element);
							} else if (_cell.type == "file") {
								_me.openAttachment($(this), o);
							} else if (_cell.name == "_readcnt") {
								if (_me.options.isadmin || _me.options.isconowner) {
									_me.openlog($(this), o);
								} else {
									_me.openDocument(o['@unid']);
								}
							} else if (typeof _me.options.header.click == "function") {
								_me.options.header.click(_me, o);
							} else {
								_me.openDocument(o['@unid']);
							}
						});
					});
					if (typeof _me.options.header.callback == "function") {
						_me.options.header.callback(_$row, o);
					}
				}
				/**
				 * Mobile Mail View List(viewtype : custom_view)
				 */
				,
				_customViewMail_V2: function () {
					var _me = this,
						_$wrap = _me.element,
						_$list = null,
						_$row = null,
						_$cell = null,
						_cell = null,
						_css = "",
						_checkcell = "";

					if (_me.options.selector == "") return;

					_$list = $(_me.options.selector, _$wrap);
					_$list.empty();

					$fn.block(undefined, { notusemsg: true });

					var __addRow = function (_$list, o, jtl) {
						_$row = $(jtl);
						_$row.data(_$$.view._ROW_DATA, o);
						_$row.attr("data-key-unid", (o.hasOwnProperty("_key_unid") ? o._key_unid : o["@unid"]));

						if (_me.options.header.checkbox) {
							_checkcell = "<div class='dwp-cell check-cell'>";
							_checkcell += "<div class='dwp-checkbox textless'>";
							_checkcell += "<label>";
							_checkcell += "<input name='chk' type='checkbox' class='dwp-check'><span></span>";
							_checkcell += "</label></div></div>";
							_$row.prepend(_checkcell);
						}

						$.each(_me.options.header.colnm, function (i, v) {
							_$cell = $("[data-cell=" + v + "]", _$row);
							_cell = _me.options.header.col[v];
							_css = "";

							if (_$cell.size() == 0 || typeof _cell == "undefined") return true;

							_css = (typeof _cell.css == "undefined" ? "" : typeof _cell.css == "function" ? _cell.css(o) : _cell.css);
							if (_css != "") { _$cell.addClass(_css); }
							if (_cell.width && _cell.width != "") { _$cell.css({ "width": _cell.width }); }

							if (_cell.hasOwnProperty("isdirect") && _cell.isdirect) {
								if (_cell.type == "fnc" && typeof _cell.content == "function") {
									_cell.content(_$cell, o);
								}
							} else {
								_$cell.html(_me._convertData(_cell, o).replace(/\</g, "&lt;").replace(/\>/g, "&gt;"));
							}

							_$cell.on("click", function () {
								if (typeof _cell.click == "function") {
									_cell.click($(this), o, _me.element);
								} else if (_cell.type == "file") {
									_me.openAttachment($(this), o);
								} else if (_cell.name == "_readcnt") {
									if (_me.options.isadmin || _me.options.isconowner) {
										_me.openlog($(this), o);
									} else {
										_me.openDocument(o['@unid']);
									}
								} else if (typeof _me.options.header.click == "function") {
									_me.options.header.click(_me, o);
								} else {
									_me.openDocument(o['@unid']);
								}
							});
						});

						if (typeof (_me.options.viewdrawing) == "function") { //메일 모바일 리스트 처리
							_me.options.viewdrawing.call(_me, _$row, o);
						}

						_par._ROW_OBJ.push(_$row); /*-------- 한꺼번에 row html을 붙이는 것으로 변경 by hklee (2017/4/8) ------- */

						if (typeof _me.options.header.callback == "function") {
							_me.options.header.callback(_$row, o);
						}
					}

					var __drawView = function (jsonData, jtlData) {
						var _json = {};
						//전체 건수 설정
						/*
						if (_me.options.entrycount != "" && !_me.options.searchview) {
						} else {
							_me.options.total = 0;
							if (jsonData.length > 0) {
								if (jsonData[0]["@unid"] != "") {
									_me.options.total = jsonData[0]["@siblings"];
								}
							}
						}
						*/

						_json.data = jsonData;
						_par._ROW_OBJ = [];

						/*#######################################################*/
						//var __viewTime = null, __stime = 0, __etime = 0;
						//__stime = new Date().getTime();
						/*#######################################################*/

						$.each(_json.data, function (i, o) {
							__addRow(_$list, o, jtlData);
						});

						_$list.append(_par._ROW_OBJ);

						/*#######################################################*/
						/*
						__etime = new Date().getTime();
						__viewTime = $("#viewTime");
						if (__viewTime.size() == 1) {
							__viewTime.html(__etime - __stime);
						} else {
							$("#dwp_mobile_view .dwp-page-title").append($("<span style=\"font-size:9pt; color:#808080;\">type2 : </span><span id=\"viewTime\" style=\"font-size:9pt; color:#808080;\">" + (__etime - __stime) + "</span>"));
						}
						*/
						/*#######################################################*/

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, _json.data);
							}

							if (_me.options.ispagenavi && _me.options.navitype == "page") {
								_me._pageNavi();
							}

							$fn.unblock();

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}
						// 건수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									//console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							//console.log('dont need _viewcount()');
							_end();
						}
					}

					var flag = false;
					try {
						if (typeof (_me.options.viewdata) != 'undefined' && _me.options.viewdata != null &&
							typeof (_me.options.jtldata) != 'undefined' && _me.options.jtldata != "" &&
							_me.options.viewdata[0]["@siblings"] == _me.options.realcount) {
							flag = true; //viewdat, jtldata 가 이미 있고, 메모리에서 리턴한 데이터 총 수와 실제 데이터 총 수가 동일한 경우
							_me.options.realcount = 0; //초기화(삭제 시 재 계산 되도록 하기 위함)
						}
					} catch (e) { }

					if (flag) {
						__drawView(_me.options.viewdata, _me.options.jtldata);
					} else if (typeof (_me.options.jtldata) == 'undefined' || _me.options.jtldata == '') {
						$.when(
							$dwp.core.util.xAjax(_me._jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, async: true, cache: true })
						).done(function (xhr1, xhr2) {
							if (_me.options.entrycount != "" && !_me.options.searchview) { } else {
								_me.options.total = _$$.util.getDataRange(xhr1);
							}
							__drawView(xhr1[0], xhr2[0]);
						});
					} else {
						$.when(
							$dwp.core.util.xAjax(_me._jsonGetParmData())
								.done(function (data, status, xhr) {
									__drawView(data, _me.options.jtldata);
								})
						);
					}
				}
				/**
				 * Custom View List(viewtype : custom)
				 */
				,
				_customView: function () {
					var _me = this,
						_$wrap = _me.element,
						_$list = null;

					if (_me.options.selector == "") return;

					if (_me.options.ismobile && !_$wrap.hasClass("list-grid-m")) {
						_$wrap.addClass("list-grid-m");
					}

					_$list = $(_me.options.selector, _$wrap);
					_$list.empty();

					$fn.block(undefined, { notusemsg: true });

					$.when(
						$dwp.core.util.xAjax(_me._jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						if (_me.options.entrycount != "" && !_me.options.searchview) { } else {
							_me.options.total = _$$.util.getDataRange(xhr1);
						}

						//_json.target = _$list;
						//_json.element = _me;
						_json.data = xhr1[0];
						//_json.viewtype = _me.options.viewtype;

						$.each(_json.data, function (i, o) {
							_me._customAddRow(_$list, o, xhr2[0]);
						});

						//if (_me.options.total > 0 && _me.options.isreadhistory) {
						//	_me._readHistory(_$listbody, xhr1[0]);
						//}

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, xhr1[0]);
							}

							if (_me.options.ispagenavi && _me.options.navitype == "page") {
								//console.log("pagenavi")
								_me._pageNavi();
							}

							$fn.unblock();

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}
						// 검수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								//console.log("jdata", jdata);
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							_end();
						}

						//$fn.unblock();
						//$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
					});
				}
				/**
				 * SCustom View List(viewtype : scustom)
				 * - 특정영역에 View List를 만드는 경우 ( view.options.selector 사용)
				 */
				,
				_sCustomView: function () {
					var _me = this,
						_$wrap = _me.element,
						_$list = null;

					if (_me.options.selector == "") return;

					_$list = $(_me.options.selector, _$wrap);
					_$list.empty();

					$fn.block(undefined, { notusemsg: true });

					$.when(
						$dwp.core.util.xAjax(_me._jsonGetSParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						_me.options.total = xhr1[0].data.totalCount;

						//_json.target = _$list;
						//_json.element = _me;
						_json.data = xhr1[0].data.results;
						//_json.viewtype = _me.options.viewtype;

						$.each(_json.data, function (i, o) {
							_me._customAddRow(_$list, o, xhr2[0]);
						});

						//if (_me.options.total > 0 && _me.options.isreadhistory) {
						//	_me._readHistory(_$listbody, xhr1[0]);
						//}

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, xhr1[0]);
							}

							if (_me.options.ispagenavi && _me.options.navitype == "page") {
								//console.log("pagenavi")
								_me._pageNavi();
							}

							$fn.unblock();

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}
						// 검수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								//console.log("jdata", jdata);
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							_end();
						}

						//$fn.unblock();
						//$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
					});
				}
				/**
				 * 모바일 기본 View List(viewtype : mlist)
				 */
				,
				_mlistView_: function () {
					//console.log("_mlistView_")
					var _me = this,
						_$wrap = _me.element,
						_$list = $("div.dwp-list", _$wrap),
						_class = "list-grid-m";

					if (_me.options.viewtype == "mlist") _class = "list-grid-m";
					else if (_me.options.viewtype == "mthumb") _class = "list-thumb-m";
					else if (_me.options.viewtype == "mcard") _class = "list-card-m";

					_$wrap.removeClass("list-grid-m list-card-m list-thumb-m").addClass(_class);
					_$list.empty();

					$fn.block(undefined, { notusemsg: true });

					$.when(
						$dwp.core.util.xAjax(_me._jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						if (_me.options.entrycount != "" && !_me.options.searchview) { } else {
							_me.options.total = _$$.util.getDataRange(xhr1);
						}
						//_me.options.total = _$$.util.getDataRange(xhr1);

						_json.target = _$list;
						_json.element = _me;
						_json.data = xhr1[0];
						_json.viewtype = _me.options.viewtype;


						console.log("_json : ", _json);
						console.log("xhr2[0] : ", xhr2[0]);

						$dwp.core.jsonToHtml.convert(_json, xhr2[0]);

						//if (_me.options.total > 0 && _me.options.isreadhistory) {
						//	_me._readHistory(_$listbody, xhr1[0]);
						//}
						/*
						if ( _me.element.parents("div.dwp-mobile-area").size() > 0 ) {
							if ( !$dwp.core.mportal.hasScrollBar(_me.element.parents("div.dwp-mobile-area")) ) {
								$(".dwp-footer-m", _me.element.parents("div.dwp-mobile-area")).addClass("active");
							} else {
								$(".dwp-footer-m", _me.element.parents("div.dwp-mobile-area")).removeClass("active");
							}
						}
						*/

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, xhr1[0]);
							}

							if (_me.options.ispagenavi && _me.options.navitype == "page") {
								_me._pageNavi();
							}

							$fn.unblock();

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}
						// 검수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								//console.log("jdata", jdata);
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							_end();
						}

					});
				}
				/**
				 * 더보기 초기화 처리 함수
				 */
				,
				pageMore: function (target) {
					var _me = this,
						_$btnMore = null,
						_$target = target || $("div.dwp-list", _me.element);

					if (_me.options.ispagenavi && _me.options.navitype == "page") {
						return;
					}

					_me.options.page = _me.options.page + 1;

					if (_me.options.ismobile) {
						_$btnMore = $("div.dwp-btn-more", _me.element);
						if (_$btnMore.size() == 0) {
							_$btnMore = $("<div class='dwp-btn-more'><a><img src='" + $fn.getPath('weblib') + "/images/common/loading.gif'></a></div>").appendTo(_me.element);
						}
					}

					$.when(
						$dwp.core.util.xAjax(_me._jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						_me.options.total = _$$.util.getDataRange(xhr1);

						_json.target = _$target;
						_json.element = _me;
						_json.data = xhr1[0];
						_json.viewtype = _me.options.viewtype;

						if (_json.data.length == 0) {
							_me.options.page = _me.options.page - 1;
						} else {
							if (_me.options.viewtype == "custom") {
								$.each(_json.data, function (i, o) {
									_me._customAddRow(_$target, o, xhr2[0]);
								});
							} else {
								$dwp.core.jsonToHtml.convert(_json, xhr2[0]);
							}
						}

						$("div.dwp-btn-more", _me.element).remove();

						$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);

						_me._mSliderResize();
					});
				},
				_viewcount: function () {
					var _me = this;

					return $dwp.core.util.xAjax({
						url: _me.options.cdb + "/getvcount?openagent",
						data: {
							view: _me.options.viewalias,
							cate: _me.options.single
						},
						async: true,
						cache: false,
						dataType: "json"
					});
				}
				// 통합검색 보기호출
				,
				_jsonGetSParmData: function () {
					var _me = this,
						_data = {},
						cuser = $fn.getCurUser().pinfo,
						_url = "/wps/PA_DWP_TSearch/TSearchService";

					_url += "?viewcode=" + _me.options.viewalias;
					_url += "&ps=" + _me.options.ps;
					_url += "&page=" + _me.options.page;

					_data = {
						empno: cuser.empno,
						orgcode: cuser.orgcode,
						comcode: cuser.comcode,
						groups: $dwp.core.getAuthInfo().groups.join(",")
					}

					if (_me.options.viewalias == "view05") {
						var _pram = _me.options.pram.split("{`");

						if (_pram[0] != "ALL") { _data.category1 = _pram[0]; }
						_data.sDate = _pram[1].replace(/\//gi, "");
						_data.eDate = _pram[2].replace(/\//gi, "");
						_data.dateType = "sStartDate";
						_data.seculevel = _pram[3].split("^").join(",");
						if (_pram[4] != "") { _data.authororgcode = _pram[4].split("^").join(","); }

					}

					function _makeQuery() {
						var _data = {},
							_$search = (_me.options.ismobile) ? $("div.search-trigger", _me.element.parents("div.dwp-mobile-area")) : $("div[name='dwp-search-area']", _me.element),
							_$select = $("select", _$search),
							_$sinp = $("input[name='search']", _$search),
							_$calfrom = $("input[name='searchfrom']", _$search),
							_$calto = $("input[name='searchto']", _$search),
							_qry = "",
							_key = "";

						_key = _$select.val();

						if ($("option:selected", _$select).attr("data-type") == "date") {
							_data.dateType = _key;
							if (_$calfrom.xval() != "") {
								_data.sDateDisp = _$calfrom.xval();
								_data.sDate = _$calfrom.xval().replace(/-/g, "")
							}
							if (_$calto.xval() != "") {
								_data.eDateDisp = _$calto.xval();
								_data.eDate = _$calto.xval().replace(/-/g, "")
							}
						} else {
							_data.s_type = _key;
							_data.s_txtDisp = _$sinp.val();
							_data.s_txt = _$sinp.val().replace(/\(/g, " ").replace(/\)/, " ");
						}
						_me.options.searchdata = _data;
						return _data;
					}

					if (_me.options.single != "") {
						var _catelist = _me.options.single.split("^");
						if (_catelist[0] != "all") {
							_data.category1 = _catelist[0];
							if (_catelist.length > 1 && _catelist[0] != "all") {
								_data.category2 = _catelist[1];

								//업무연락인 경우
								if (_catelist[0] == "AC003" && _catelist[1].indexOf("_R") > -1) {
									_data.RDocForm = "R";
									_data.category2 = _catelist[1].split("_")[0];
								} else if (_catelist[0] == "AC003" && _catelist[1].indexOf("_Y") > -1) {
									_data.RDocForm = "Y";
									_data.category2 = _catelist[1].split("_")[0];
								}
							}
						}
					}

					if (_me.options.viewalias == "view01") {
						_data.category = cuser.empno
					} else if (_me.options.viewalias == "view03") {
						_data.category = cuser.orgcode
					}

					if (_me.options.searchview) {
						if (_me.options.hasOwnProperty("searchdata") && !$.isEmptyObject(_me.options.searchdata)) {
							$.extend(_data, _me.options.searchdata);
						}
						var _qry = _makeQuery();
						if (_qry.s_txt != "" || (_qry.hasOwnProperty("sDate") && _qry.sDate != "")) { $.extend(_data, _qry); }
					}

					return {
						url: _url,
						method: "POST",
						dataType: "json",
						async: true,
						cache: false,
						data: _data
					};
				}
				/**
				 * 결재완료 통합검색 인터페이스용 View List (viewtype : slist)
				 * - 삭제예정
				 */
				,
				_slistView: function () {
					var _me = this,
						_$bodywrap = $("div.dwp-page-body.view > div.dwp-body-wrap", _me.element),
						_$wrap = $("div.dwp-contents-article", _$bodywrap),
						_$list = $("div.dwp-table", _$wrap),
						_$listbody = null;

					_$bodywrap.removeClass("list-card list-thumb list-mix").addClass("list-grid");

					if (_$list.size() == 0) {
						_$wrap.empty();
						_$list = $("<div class='dwp-table check-group'></div>").appendTo(_$wrap);
					} else {
						_$list.empty();
					}
					_$listbody = $("<div class='dwp-table-inner'/>").appendTo(_$list);

					function _makeQuery() {
						var _data = {},
							_$search = $("div[name='dwp-search-area']", _me.element),
							_$select = $("select", _$search),
							_$sinp = $("input[name='search']", _$search),
							_$calfrom = $("input[name='searchfrom']", _$search),
							_$calto = $("input[name='searchto']", _$search),
							_qry = "",
							_key = "";

						_key = _$select.val();

						if ($("option:selected", _$select).attr("data-type") == "date") {
							_data.dateType = _key;
							if (_$calfrom.xval() != "") {
								_data.sDate = _$calfrom.xval().replace(/-/g, "")
							}
							if (_$calto.xval() != "") {
								_data.eDate = _$calto.xval().replace(/-/g, "")
							}
						} else {
							_data.s_type = _key;
							_data.s_txt = _$sinp.val().replace(/\(/g, " ").replace(/\)/, " ");
						}
						return _data;
					}

					//Data List 그리고
					function _jsonGetParmData() {
						var _data = {},
							cuser = $fn.getCurUser().pinfo,
							_url = "/wps/PA_DWP_TSearch/TSearchService";

						_url += "?viewcode=" + _me.options.viewalias;
						_url += "&ps=" + _me.options.ps;
						_url += "&page=" + _me.options.page;

						_data = {
							empno: cuser.empno,
							orgcode: cuser.orgcode,
							comcode: cuser.comcode,
							groups: $dwp.core.getAuthInfo().groups.join(",")
						}

						if (_me.options.single != "") {
							var _catelist = _me.options.single.split("^");
							if (_catelist[0] != "all") {
								_data.category1 = _catelist[0];
								if (_catelist.length > 1 && _catelist[0] != "all") {
									_data.category2 = _catelist[1];

									//업무연락인 경우
									if (_catelist[0] == "AC003" && _catelist[1].indexOf("_R") > -1) {
										_data.RDocForm = "R";
										_data.category2 = "";
									} else if (_catelist[0] == "AC003" && _catelist[1].indexOf("_Y") > -1) {
										_data.RDocForm = "Y";
										_data.category2 = "";
									}
								}
							}
						}

						if (_me.options.viewalias == "view01") {
							_data.category = cuser.empno
						} else if (_me.options.viewalias == "view03") {
							_data.category = cuser.orgcode
						}

						if (_me.options.searchview) {
							$.extend(_data, _makeQuery());
						}

						return {
							url: _url,
							method: "POST",
							dataType: "json",
							async: true,
							cache: false,
							data: _data
						};
					}

					$.when(
						$dwp.core.util.xAjax(_me._jsonGetSParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						_me.options.total = xhr1[0].data.totalCount;

						_json.target = _$listbody;
						_json.element = _me;
						_json.data = xhr1[0].data.results;
						//_json.viewtype = _me.options.viewtype;
						_json.viewtype = "list";

						$dwp.core.jsonToHtml.convert(_json, xhr2[0]);

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, xhr1[0]);
							}

							if (_me.options.ispagenavi) {
								_me._pageNavi();
							}

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}
						// 검수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								//console.log("jdata", jdata);
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							_end();
						}
					});
				},
				_listPageCount: function () {
					var _me = this

					//Data List 그리고
					function _jsonGetParmData() {
						var _data = {},
							_rtnval = 1,
							_url = _me.options.cdb + "/api/data/collections/name/" + _me.options.viewalias,
							_folderunid = _me.options.folderunid || "";
						if (_folderunid != "") {
							_url = _me.options.cdb + "/api/data/collections/unid/" + _me.options.folderunid
						}

						_url += "?ps=" + _me.options.ps;
						_url += "&page=" + (_me.options.page - 1);

						//if( !_me.options.header.hasOwnProperty("sortvw") || _me.options.header.sortvw == "") {
						if (typeof _me.options.sortnm != "undefined" && _me.options.sortnm != "") {
							_data.sortcolumn = _me.options.sortnm;
							//_url += "&sortcolumn=" + _me.options.sortnm;
						}
						if (typeof _me.options.sortorder != "undefined" && _me.options.sortorder != "") {
							_data.sortorder = _me.options.sortorder;
							//_url += "&sortorder=" + _me.options.sortorder;
						}
						//}
						if (_me.options.single != "" && !_me.options.searchview) {
							_data.category = _me.options.single;
							//_url += "&category=" + _me.options.single;
						}

						if (_me.options.searchview) {
							_data.search = _me.options.searchqry;
						}

						if (_me.options.entrycount != "" && !_me.options.searchview) {
							_data.entrycount = "false";
						}
						return {
							url: _url,
							dataType: "json",
							async: false,
							cache: false,
							data: _data
						};
					}
					_rtnval = _me.options.page;
					$dwp.core.util.xAjax(_jsonGetParmData()).done(function (xhr1) {
						if (xhr1.length == 0) {
							if (_me.options.page > 1) {
								_rtnval = _me.options.page - 1;
							}
						} else if (xhr1.length == 1) {
							if (xhr1[0]["@unid"] == "") {
								if (_me.options.page > 1) {
									_rtnval = _me.options.page - 1;
								}
							}
						} else { }
					});
					return _rtnval;
				}
				/**
				 * List View List (viewtype : list)
				 */
				,
				_listView: function () {
					var _me = this,
						_$bodywrap = $("div.dwp-page-body.view > div.dwp-body-wrap", _me.element),
						_$wrap = $("div.dwp-contents-article", _$bodywrap),
						_$list = $("div.dwp-table", _$wrap),
						_$listbody = null;

					_$bodywrap.removeClass("list-card list-thumb list-mix").addClass("list-grid");

					if (_$list.size() == 0) {
						_$wrap.empty();
						_$list = $("<div class='dwp-table check-group'></div>").appendTo(_$wrap);
					} else {
						_$list.empty();
					}
					_$listbody = $("<div class='dwp-table-inner'/>").appendTo(_$list);

					//Data List 그리고
					/*
					function _jsonGetParmData() {
						var _data = {}, _url = _me.options.cdb + "/api/data/collections/name/" + _me.options.viewalias, _folderunid = _me.options.folderunid || "";
						if (_folderunid != "") {
							_url = _me.options.cdb + "/api/data/collections/unid/" + _me.options.folderunid
						}

						_url += "?ps=" + _me.options.ps;
						_url += "&page=" + (_me.options.page - 1);

						//if( !_me.options.header.hasOwnProperty("sortvw") || _me.options.header.sortvw == "") {
						if( typeof _me.options.sortnm != "undefined" && _me.options.sortnm != "") {
							_data.sortcolumn = _me.options.sortnm;
							//_url += "&sortcolumn=" + _me.options.sortnm;
						}
						if( typeof _me.options.sortorder != "undefined" && _me.options.sortorder != "") {
							_data.sortorder = _me.options.sortorder;
							//_url += "&sortorder=" + _me.options.sortorder;
						}
						//}
						if (_me.options.single != "" && !_me.options.searchview) {
							_data.category = _me.options.single;
							//_url += "&category=" + _me.options.single;
						}

						if (_me.options.searchview) {
							_data.search = _me.options.searchqry;
						}

						if (_me.options.entrycount != "" && !_me.options.searchview) {
							_data.entrycount = "false";
						}
						return {
							url : _url
							,dataType : "json"
							,async : true
							,cache : false
							,data : _data
						};
					}
					*/
					$.when(
						$dwp.core.util.xAjax(_me._jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						if (_me.options.entrycount != "" && !_me.options.searchview) { } else {
							_me.options.total = _$$.util.getDataRange(xhr1);
						}
						//_me.options.total = _$$.util.getDataRange(xhr1);

						_json.target = _$listbody;
						_json.element = _me;
						_json.data = xhr1[0];
						_json.viewtype = _me.options.viewtype;

						$dwp.core.jsonToHtml.convert(_json, xhr2[0]);

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, xhr1[0]);
							}

							if (_me.options.ispagenavi) {
								_me._pageNavi();
							}

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}
						// 검수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								//console.log("jdata", jdata);
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							_end();
						}
					});

				}
				/**
				 * Thumb View List (viewtype : thumb)
				 * - 삭제예정
				 */
				,
				_thumbView: function () {
					var _me = this,
						_$bodywrap = $("div.dwp-page-body.view > div.dwp-body-wrap", _me.element),
						_$wrap = $("div.dwp-contents-article", _$bodywrap),
						_$list = $("div.dwp-list-card", _$wrap),
						_$listbody = null;

					_$bodywrap.removeClass("list-grid list-card list-mix").addClass("list-thumb");

					if (_$list.size() == 0) {
						_$wrap.empty();
						_$list = $("<div class='dwp-list-card'></div>").appendTo(_$wrap);
					} else {
						_$list.empty();
					}
					_$listbody = $("<div class='list-wrap'/>").appendTo(_$list);

					//Data List 그리고
					/*
					function _jsonGetParmData() {
						var _data = {}, _url = _me.options.cdb + "/api/data/collections/name/" + _me.options.viewalias;
						_url += "?ps=" + _me.options.ps;
						_url += "&page=" + (_me.options.page - 1);

						//if( !_me.options.header.hasOwnProperty("sortvw") || _me.options.header.sortvw == "") {
						if( typeof _me.options.sortnm != "undefined" && _me.options.sortnm != "") {
							_data.sortcolumn = _me.options.sortnm;
							//_url += "&sortcolumn=" + _me.options.sortnm;
						}
						if( typeof _me.options.sortorder != "undefined" && _me.options.sortorder != "") {
							_data.sortorder = _me.options.sortorder;
							//_url += "&sortorder=" + _me.options.sortorder;
						}
						//}
						if (_me.options.single != "" && !_me.options.searchview) {
							_data.category = _me.options.single;
							//_url += "&category=" + _me.options.single;
						}

						if (_me.options.searchview) {
							_data.search = _me.options.searchqry;
						}

						if (_me.options.entrycount != "" && !_me.options.searchview) {
							_data.entrycount = "false";
						}
						return {
							url : _url
							,dataType : "json"
							,async : true
							,cache : false
							,data : _data
						};
					}
					*/
					$.when(
						$dwp.core.util.xAjax(_me._jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						if (_me.options.entrycount != "" && !_me.options.searchview) { } else {
							_me.options.total = _$$.util.getDataRange(xhr1);
						}
						//_me.options.total = _$$.util.getDataRange(xhr1);

						_json.target = _$listbody;
						_json.element = _me;
						_json.data = xhr1[0];
						_json.viewtype = _me.options.viewtype;

						$dwp.core.jsonToHtml.convert(_json, xhr2[0]);

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, xhr1[0]);
							}

							if (_me.options.ispagenavi) {
								_me._pageNavi();
							}

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}

						// 검수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							_end();
						}
					});
				}
				/**
				 * Card View List (viewtype : card)
				 */
				,
				_cardView: function () {
					var _me = this,
						_$bodywrap = $("div.dwp-page-body.view > div.dwp-body-wrap", _me.element),
						_$wrap = $("div.dwp-contents-article", _$bodywrap),
						_$list = $("div.dwp-list-card", _$wrap),
						_$listbody = null;

					_$bodywrap.removeClass("list-grid list-thumb list-mix").addClass("list-card");

					if (_$list.size() == 0) {
						_$wrap.empty();
						_$list = $("<div class='dwp-list-card'></div>").appendTo(_$wrap);
					} else {
						_$list.empty();
					}
					_$listbody = $("<div class='list-wrap multi-tit'/>").appendTo(_$list);

					//Data List 그리고
					/*
					function _jsonGetParmData() {
						var _data = {}, _url = _me.options.cdb + "/api/data/collections/name/" + _me.options.viewalias;
						_url += "?ps=" + _me.options.ps;
						_url += "&page=" + (_me.options.page - 1);

						//if( !_me.options.header.hasOwnProperty("sortvw") || _me.options.header.sortvw == "") {
						if( typeof _me.options.sortnm != "undefined" && _me.options.sortnm != "") {
							_data.sortcolumn = _me.options.sortnm;
							//_url += "&sortcolumn=" + _me.options.sortnm;
						}
						if( typeof _me.options.sortorder != "undefined" && _me.options.sortorder != "") {
							_data.sortorder = _me.options.sortorder;
							//_url += "&sortorder=" + _me.options.sortorder;
						}
						//}
						if (_me.options.single != "" && !_me.options.searchview) {
							_data.category = _me.options.single;
							//_url += "&category=" + _me.options.single;
						}

						if (_me.options.searchview) {
							_data.search = _me.options.searchqry;
						}

						if (_me.options.entrycount != "" && !_me.options.searchview) {
							_data.entrycount = "false";
						}
						return {
							url : _url
							,dataType : "json"
							,async : true
							,cache : false
							,data : _data
						};
					}
					*/
					$.when(
						$dwp.core.util.xAjax(_me._jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						if (_me.options.entrycount != "" && !_me.options.searchview) { } else {
							_me.options.total = _$$.util.getDataRange(xhr1);
						}
						//_me.options.total = _$$.util.getDataRange(xhr1);

						_json.target = _$listbody;
						_json.element = _me;
						_json.data = xhr1[0];
						//2020-10-26 By LHJ
						//_json.viewtype = _me.options.viewtype;
						_json.viewtype = (_me.options.iswebfolder ? "wfcard" : _me.options.viewtype);

						$dwp.core.jsonToHtml.convert(_json, xhr2[0]);

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, xhr1[0]);
							}

							if (_me.options.ispagenavi) {
								_me._pageNavi();
							}

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}
						// 검수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							_end();
						}
					});
				}
				/**
				 * Mix View List (viewtype : mix)
				 */
				,
				_mixView: function () {
					var _me = this,
						_$bodywrap = $("div.dwp-page-body.view > div.dwp-body-wrap", _me.element),
						_$wrap = $("div.dwp-contents-article", _$bodywrap),
						_$list = $("div.dwp-list-card", _$wrap),
						_$listbody = null;

					_$bodywrap.removeClass("list-grid list-thumb list-card").addClass("list-mix");

					if (_$list.size() == 0) {
						_$wrap.empty();
						_$list = $("<div class='dwp-list-card'></div>").appendTo(_$wrap);
					} else {
						_$list.empty();
					}
					_$listbody = $("<div class='list-wrap'/>").appendTo(_$list);

					//Data List 그리고
					/*
					function _jsonGetParmData() {
						var _data = {}, _url = _me.options.cdb + "/api/data/collections/name/" + _me.options.viewalias;
						_url += "?ps=" + _me.options.ps;
						_url += "&page=" + (_me.options.page - 1);

						//if( !_me.options.header.hasOwnProperty("sortvw") || _me.options.header.sortvw == "") {
						if( typeof _me.options.sortnm != "undefined" && _me.options.sortnm != "") {
							_data.sortcolumn = _me.options.sortnm;
							//_url += "&sortcolumn=" + _me.options.sortnm;
						}
						if( typeof _me.options.sortorder != "undefined" && _me.options.sortorder != "") {
							_data.sortorder = _me.options.sortorder;
							//_url += "&sortorder=" + _me.options.sortorder;
						}
						//}
						if (_me.options.single != "" && !_me.options.searchview) {
							_data.category = _me.options.single;
							//_url += "&category=" + _me.options.single;
						}

						if (_me.options.searchview) {
							_data.search = _me.options.searchqry;
						}

						if (_me.options.entrycount != "" && !_me.options.searchview) {
							_data.entrycount = "false";
						}

						return {
							url : _url
							,dataType : "json"
							,async : true
							,cache : false
							,data : _data
						};
					}
					*/
					$.when(
						$dwp.core.util.xAjax(_me._jsonGetParmData()), $dwp.core.util.xAjax({ url: _me.options.jtl, dataType: "text", async: true, cache: true })
					).done(function (xhr1, xhr2) {
						var _json = {};
						//전체 건수 설정
						if (_me.options.entrycount != "" && !_me.options.searchview) { } else {
							_me.options.total = _$$.util.getDataRange(xhr1);
						}
						//_me.options.total = _$$.util.getDataRange(xhr1);

						_json.target = _$listbody;
						_json.element = _me;
						_json.data = xhr1[0];
						_json.viewtype = _me.options.viewtype;

						$dwp.core.jsonToHtml.convert(_json, xhr2[0]);

						function _end() {
							if (_me.options.total > 0 && _me.options.isreadhistory) {
								_me._readHistory(_$listbody, xhr1[0]);
							}

							if (_me.options.ispagenavi) {
								_me._pageNavi();
							}

							$dwp.core.util.xTrigger(_me.element, "ViewLoadComplete", _me);
						}
						// 검수 가져오기
						if (_me.options.entrycount == "ajax" && !_me.options.searchview) {
							_me._viewcount().done(function (jdata) {
								if (jdata.result == "200") {
									_me.options.total = parseInt(jdata.cnt, 10);
									_end();
								} else {
									console.log("View Count Loading Error : " & jdata.msgcode);
								}
							});
						} else {
							_end();
						}
					});
				}
				/**
				 * 조회처리 함수
				 * @param	{object}	target			대상 Object
				 * @param	{object}	data			조회문서정보
				 * @param	{string}	data._key_unid	문서 key unid
				 */
				,
				_readHistory: function (target, data) {
					var _me = this,
						_key_unids = [];

					$.each(data, function (i, o) {
						_key_unids.push(o._key_unid);
					});
					_$$.util.cmdPost(
						$dwp.core.util.getProxyUrl(_me.options.sublogdb + '/wlogpost?createdocument'), {
						actiontype: _$$.view._CONST.ACTION.READHISTORY,
						postdata: _key_unids.join(";")
					},
						function (data) {
							if (data.hasOwnProperty("result")) {
								if (data.result == "200") {
									$.each(data.data, function (i, v) {
										$("[data-key-unid='" + v + "']", target).addClass("dwp-bold");
									});
								}
							}
						}, 'json'
					)
				}
				/**
				 * Page Navi 초기화 처리
				 */
				,
				_pageNavi: function () {
					var _me = this,
						_$wrap = (_me.options.ismobile) ? _me.element : $("div.dwp-contents-article", _me.element),
						_$page = $("div.dwp-pagination", _me.element),
						_totentry = _me.options.total,
						_pagecnt = _me.options.ps,
						_navicnt = _me.options.navi,
						_cpage = _me.options.page;

					if (_$page.size() == 0) {
						_$page = $("<div class=\"dwp-pagination\"/>").appendTo(_$wrap);
					}

					function _cnavi() {
						return parseInt(_cpage / _navicnt, 10) + ((_cpage % _navicnt) == 0 ? 0 : 1);
					}

					function _totnavicnt() {
						return parseInt(_totentry / _pagecnt, 10) + ((_totentry % _pagecnt) == 0 ? 0 : 1);
					}

					function _startpage() {
						var _pos = _cnavi();
						return ((_pos - 1) * _navicnt) + 1;
					}

					function _endpage() {
						var _pos = _cnavi();
						var _totcnt = _totnavicnt();

						var _rtn = _pos * _navicnt;
						if (_totcnt < _rtn) {
							_rtn = _totcnt;
						}
						return _rtn;
					}

					function _prepage() {
						var _h = "";
						var _start = _startpage();
						if (_start > 1) {
							_h += "<div class='btn-prev-fist'><span type='button' ref='0'>" + $fn.getCodeMsg("comm.msg.msg014") + "</span></div>";
							_h += "<div class='btn-prev'><span type='button' ref='" + (_start - 2) + "'>" + $fn.getCodeMsg("comm.msg.msg015") + "</span></div>";
							//_h += "<a class='pagenum page_pprev' ref='0'><img src='/gwlib/comm/images/pprev_btu.png' align='absmiddle'/></a>";
							//_h += "<a class='pagenum page_prev' ref='" + (_start - 2) + "'><img src='/gwlib/comm/images/prev_btu.png' align='absmiddle'/></a>";
						}
						return _h;
					}

					function _nextpage() {
						var _h = "";
						var _end = _endpage(),
							_totcnt = _totnavicnt();
						if (_end < _totcnt) {
							_h += "<div class='btn-next'><span type='button' ref='" + _end + "'>" + $fn.getCodeMsg("comm.msg.msg016") + "</span></div>";
							_h += "<div class='btn-next-last'><span type='button' ref='" + (_totcnt - 1) + "'>" + $fn.getCodeMsg("comm.msg.msg017") + "</span></div>";
							//_h += "<a class='pagenum page_next' ref='" + _end +"'><img src='/gwlib/comm/images/next_btu.png'align='absmiddle' /></a>";
							//_h += "<a class='pagenum page_nnext' ref='" + (_totcnt - 1) +"'><img src='/gwlib/comm/images/nnext_btu.png' align='absmiddle'/></a>";
						}
						return _h;
					}

					function _totdisp() {
						//return "<span class='xui_app_view_total'>[전체 " +  _totentry + "건]</span>";
						return "<div class='total-page'>" + $fn.getCodeMsg("comm.msg.msg018") + "<em class='total-num'>" + _totentry + "</em><span>" + $fn.getCodeMsg("comm.msg.msg019") + "</span></div>";
					}

					function _create() {
						var _h = "",
							_class = "";
						//_h += _totdisp();
						_h += _prepage();
						_h += "<div class='num'>";
						for (var i = _startpage(), j = _endpage(); i <= j; i++) {
							_class = "";
							if (i == _cpage) {
								_class += "active";
							}
							_h += "<span class='" + _class + "' ref='" + (i - 1) + "'>" + i + "</span>";
						}
						_h += "</div>";
						_h += _nextpage();
						_h += _totdisp();
						//_h += "</li></ul>";

						_$page.html(_h);

						$('span[ref]', _$page).on("click", function () {
							var _page = parseInt($(this).attr("ref"), 10);
							_me.options.page = _page + 1;
							//_me._listView();
							_me._listProc();
						});
					}
					_create();

				}
				// Event 처리하기
				,
				_eventHandler: function () {

				}
				/**
				 * view instance 소멸함수
				 */
				,
				destroy: function () {
					var _me = this;
					console.log("View Destroy");
					_me.element.off("ViewLoadComplete");
					_me.element.empty();
					_me._super();
				}
				// End
			});
		}
		/**
		 * 대상 element에 View Instance를 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	view instance
		 */
		,
		getInstance: function (el) {
			var _el = el || $("div.dwp-wrapping", $dwp.core.getContent());
			return $(el).data("dwp-view");
		}
		/**
		 * 대상 element View에 options을 반환하는 함수
		 * @param	{object}	el		dom element or query selector
		 * @return	{object}	view options
		 */
		,
		getOptions: function (el) {
			var _el = el || $("div.dwp-wrapping", $dwp.core.getContent());
			if (this.getInstance(_el)) {
				return this.getInstance(_el).getOptions();
			} else {
				return null;
			}
		}
	}

})($dwp.cns("core"), jQuery);
$dwp.core.view._create();










