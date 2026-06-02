
/**
 * <b>주요함수 라이브러리</b>
 * <br>주요 Util 함수를 정의합니다.
 * @module fn
 * @copyright	TCCINS
 */
/**
 * @namespace
 */
var $fn = {
	/*
	 * Lang Component 함수
	 */

	/*
	 * 현재언어 정보를 리턴함.
	 * @param	str 	: 언어셋 정보 (기본 ko:한국,en:korea, 다중 ko:한국,en:korea`}ko:사람,en:people)
	 * @param	sp		: 구분자 (다중 언어셋인 경우 : 한국 /사람)
	 * @param	lang	: 설정언어(기본은 브라우저기본)
	 * @return	string
	 */
	getCurLangMsg: function (str, sp, lang) {
		return $dwp.core.lang.getCurMsg(str, sp, lang);
	}

	/*
	 *
	 */
	, getCodeMsg: function (obj) {
		return $dwp.core.lang.getCodeMsg(obj);
	}
	/*
	 * 언어 오브젝트에서 해당 code에 해당하는 값을 리턴함.
	 * @param	코드 Object	: 예) select 언어셋을 지정한 Object 코드
	 * @param	상세코드
	 * @return	string
	 */
	, getCodeObjMsg: function (code, prop) {
		return $dwp.core.lang.getCodeObjMsg(code, prop);
	}
	, getCodeData: function (pcode, code) {
		return $dwp.core.lang.getCodeData(pcode, code);
	}
	/*
	 * 호출된 페이지의 언어처리를 수행함.
	 * @param	opt.url 	: 언어JS파일URL
	 * @param	opt.isedit 	: 호출된 페이지의 편집상태여부(기본 edit모드)
	 * @param	el 			: 변환 대상  object
	 * @return	nothing
	 */
	, convertLangPage: function (opt, el) {
		var _$el = $(el), _opt = $.extend({ url: "" }, opt);

		$dwp.core.lang.convert(_opt, _$el);
	}
	/*
	 * 문서 작성 및 조회 화면 생성 widget 함수 호출
	 * @param	opt			: 옵션(필수)
	 * @param	el			: target element(선택)
	 * @return	doc instance
	 */
	, doc: function (opt, el) {
		var _opt = $.extend({}, opt)
			, _$el = (el) ? $(el) : null;

		return $dwp.core.doc.init(_opt, _$el);
	}
	/*
	 * 보기 생성 widget 함수 호출
	 * @param	opt			: 옵션(필수)
	 * @param	el			: target element(선택)
	 * @return	view instance
	 */
	, view: function (opt, el) {
		var _opt = $.extend({}, opt)
			, _$el = (el) ? $(el) : null;

		return $dwp.core.view.init(_opt, _$el);
	}

	, custom: function (opt, el) {
		var _opt = $.extend({}, opt)
			, _$el = (el) ? $(el) : null;

		return $dwp.core.custom.init(_opt, _$el);
	}
	/*
	 * UI Component 함수
	 */

	/*
	 * Dialog 함수 호출
	 * @param	el			: target element(필수) or null
	 * @param	opt			: 옵셥(선택) - jquery ui dialog 옵션 참조
	 * @return	dialog instance
	 */
	, dialog: function (el, opt) {
		var _opt = $.extend({}, opt)
			, _$el = (el) ? $(el) : null;

		return $dwp.ui.dialog.init(_$el, _opt);
	}
	/*
	 * Tree 함수 호출
	 * @param	el			: target element(필수) or null
	 * @param	opt			: 옵셥(선택) - dynatree.js 옵션 참조
	 * @return	dialog instance
	 */
	, tree: function (el, opt) {
		var _opt = $.extend({}, opt)
			, _$el = (el) ? $(el) : null;

		return $dwp.ui.tree.init(_$el, _opt);
	}
	/*
	 * Scroll 처리함수
	 *
	 */
	, scroll: function (el, opt) {
		return $dwp.ui.scroll(el, _opt);
	}
	/*
	 * 조직도 선택창 처리
	 * @param	opt.type		조직선택 창 유형  	multi
	 * @param	opt.treetype 	Tree표시 유형	0 : 부서 & 사용자, 1 : 부서
	 * @param	opt.seltype 	선택유형 		0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
	 * @param	opt.title		제목
	 * @param	opt.fld			선택key 값 저장필드명 	full정보의 경우 fld+"Full" 필드에 저장
	 * @param	opt.count		선택최대건수
	 * @param	opt.isedit		편집여부
	 * @return	instance
	 */
	, orgsel: function (el, opt) {
		return $dwp.ui.org.orgsel.init(el, opt);
	}

	/*
	 * UTIL Component 함수
	 */

	/*
	 * ajax 함수 호출
	 * @param	opt			: ajax 옵션
	 * @return	promise
	 */
	, xAjax: function (opt) {
		return $dwp.core.util.xAjax(opt);
	}

	, xAjaxSubmit: function (el, opt) {
		return $dwp.core.util.xAjaxSubmit(el, opt);
	}
	/*
	 * cmdpost 함수 호출
	 * @param	url			: 호출 Url
	 * @param	cmd			: PostData
	 * @param	call		: Success CallBack Function
	 * @param	datatype	: Return Data Contents Type
	 * @return	nothing
	 */
	, cmdPost: function (url, cmd, callback, datatype) {
		var _cmd = $.extend({ __Click: 0 }, cmd);
		$dwp.core.util.cmdPost(url, cmd, callback, datatype);
	}
	, cmdPostEx: function (opt) {
		return $dwp.core.util.cmdPostEx(opt);
	}
	// Event Trigger
	, xTrigger: function (el, eventType, opt) {
		$dwp.core.util.xTrigger(el, eventType, opt);
	}
	// Create Event Trigger
	, xOn: function (el, eventType, callback) {
		$dwp.core.util.xOn(el, eventType, callback);
	}
	/*
	 * 알림창 표시
	 * @param	opt		: 메세지 옵션 {msg : "메세지"}
	 */
	, alert: function (opt, callback) {
		var _opt = $.extend({ msg: "" }, opt);
		return $dwp.ui.alert(_opt, callback);
	}
	/*
	 * 확인창 표시
	 * @param	opt		: 메세지 옵션 {msg : "메세지"}
	 * @return	boolean
	 */
	, confirm: function (opt, callback) {
		var _opt = $.extend({ msg: "" }, opt);
		return $dwp.ui.confirm(_opt, callback);
	}
	/*
	 * Url Proxy 변환
	 * @param	url		: 	url
	 * @param	opt		:	URL 옵션
	 * @return	url
	 */
	, getProxyUrl: function (url, opt) {
		return $dwp.core.util.getProxyUrl(url, opt);
	}
	/*
	 * Lnb 메뉴 아이템에 Appl별 페이지 로딩 시, CallBack처리
	 * @param	lnbid	:	Lnb메뉴 ID
	 * @param	callback	Callback 함수
	 */
	, lnbPageCallback: function (lnbid, callback) {
		$dwp.core.portal.lnbCallback(lnbid, callback);
	}
	/*
	 * 현재 접속 사용자 정보를 리턴합니다.
	 * @return Object
	 */
	, getCurUser: function () {
		return $dwp.core.getCurUser();
	}
	/*
	 * 사용자 정보를 리턴합니다
	 * @param	empno	사번
	 * @return	Object
	 */
	, getUserInfo: function (empno) {
		return $dwp.core.getUserInfo(empno);
	}
	/*
	 * 사용자 조직 Object를 리턴합니다.
	 * @param	empno	사번
	 * @return	Object
	 */
	, getOrgUser: function (empno) {
		return $dwp.ui.org.data.getOrg(empno);
	}
	/*
	 * 주요 DB Path 정보를 리턴합니다.
	 * @param	path	DB 별칭
	 * @param	opt
	 * @return	String
	 */
	, getPath: function (path, opt) {
		return $dwp.core.getPath(path, opt);
	}
	/*
	 * 시스템 정보 리턴
	 */
	, getSysinfo: function () {
		return $dwp.core.getInfo("sysinfo");
	}
	/*
	 * 접속 회사코드정보 가져오기
	 */
	, getComCode: function () {
		var _siteccode = $fn.getSysinfo().siteccode;
		if (_siteccode == "") {
			_siteccode = $fn.getCurUser().pinfo.comcode;
		}
		return _siteccode;
	}
	/*
	 * 주용 상수 정보를 리턴합니다.
	 * @param	code	상수명
	 * @return	String
	 */
	, getConstant: function (code) {
		return $dwp.core.getConstant(code);
	}
	, getContent: function () {
		return $("div.dwp-wrapping", $dwp.core.getContent());
	}
	, getTarget: function (opt) {
		return $dwp.core.getTarget(opt);
	}
	, getInstance: function (sel, el, opt) {
		var _$el = null, _inst = undefined;

		if (typeof el == "undefined") {
			if (typeof opt == "undefined") {
				_$el = this.getTarget({});
				_inst = _$el.data("dwp-" + sel);

				if (_inst == undefined) {
					if (sel == "doc") {
						_$el = this.getTarget({ type: "preview" });
						_inst = _$el.data("dwp-" + sel);

						if (_inst == undefined) {
							$("div.dwp-xdialog").each(function () {
								if ($(this).is("[id]")) {
									_$el = $(this);
									_inst = _$el.data("dwp-" + sel);
									if (_inst != undefined) { return false; }
								}
							});
						}
					} else {
						$("div.dwp-xdialog").each(function () {
							if ($(this).is("[id]")) {
								_$el = $(this);
								_inst = _$el.data("dwp-" + sel);
								if (_inst != undefined) { return false; }
							}
						});
					}
				}
			} else {
				_$el = this.getTarget(opt);
				_inst = _$el.data("dwp-" + sel);
			}
		} else {
			_$el = $(el);
			_inst = _$el.data("dwp-" + sel);
		}

		return _inst;
	}
	/*
	 * Instance 배열을 리턴함
	 */
	, getInstances: function (sel, el, opt) {
		var _$el = null, _insts = [];
		if (_envinfo.hasOwnProperty("usetab") && _envinfo.usetab == "1") {

		} else { }

	}
	/*
	 * Doc Instance를 리턴함
	 */
	, getDocInstance: function (el, opt) {
		return $fn.getInstance("doc", el, opt);
	}
	/*
	 * View Instance를 리턴함
	 */
	, getViewInstance: function (el, opt) {
		return $fn.getInstance("view", el, opt);
	}
	/*
	 * 메인컨텐츠에 Data Loading하기
	 * @param	opt.link		호출 URL
	 * @param	opt.linktype	호출 방식 PAGE, JS, WPOP
	 */
	, loadPage: function (opt) {
		var _opt = $.extend({}, opt);
		$dwp.core.portal._act(_opt);
	}
	/*
	 * Lnb 메뉴 카운트 처리 Trigger
	 * @param	opt		cntid : id Array
	 */
	, lnbCountRefresh: function (opt) {
		var _$lnbBody = null;
		if (typeof dwpmo != "undefined") {
			_$lnbBody = $("div.dwp-lnb-m", $dwp.core.mportal.lnbObj());
		} else {
			_$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());
		}
		//var _$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());
		//_opt = $.extend({cntids : []}, opt);

		this.xTrigger(_$lnbBody, "LnbCntReload", opt);
	}
	/*
	 * Lnb 메뉴 서브페이지 갱신처리 Trigger
	 * @param	opt		: lnbids 생신할 lnbuid Array
	 */
	, lnbPageRefresh: function (opt) {
		var _$lnbBody = null
			, _opt = $.extend({ type: "", lnbids: [] }, opt);

		if (typeof dwpmo != "undefined") {
			_$lnbBody = $("div.dwp-lnb-m", $dwp.core.mportal.lnbObj());
		} else {
			_$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());
		}

		this.xTrigger(_$lnbBody, "LnbReload", _opt);
	}
	/*
	 * 사용자 사진 이미지 Error 처리
	 */
	, getPicError: function (el) {
		$(el).off("error.img").on("error.img", function () {
			$(this).attr("src", $dwp.core.getPath("weblib") + "/images/common/default-person.png");
		});
	}
	, getImgError: function (el, opt) {
		var _opt = $.extend({ src: $dwp.core.getPath("weblib") + "/images/common/thumb-noimage.gif" }, opt);
		$(el).off("error.img").on("error.img", function () {
			$(this).attr("src", _opt.src);
		});
	}
	/*
	 * JsonArray ConvertTo TreeData
	 */
	, toTreeData: function (key, treedata, node) {
		return $dwp.core.util.toTreeData(key, treedata, node);
	}
	/*
	 * 입력필드값 체크
	 * @param	el		대상 Target Object(Selector)
	 * @param	opt		체크 Rule Object (options)
	 */
	, validate: function (el, opt) {
		return $dwp.core.util.validator.validate(el, opt);
	}
	/*
	 * JSON + JTL TransForm 처리함수
	 * @param {opt}			속성 {jurl : json data url, json : json data, jtl : json template, callback : 콜백함수 ,target : html insert 대상  }
	 *					    {jurl : "" , json: "" ; jtl:"" ,target :"" ,callback : "" }
	*/
	, jTransformHTML: function (opt) {
		$dwp.core.util.jTransformHTML(opt);
	}
	/*
	 * ISO 날짜를 해당 언어의 로컬 format를 리턴함수
	 * @param	isodate		ISO형식의 날짜 문자열
	 * @param	format		변환 Format dateonly, relative, (default : 날짜 시간 )
	 */
	, formatDateTime: function (isodate, format) {
		return $dwp.core.util.formatDateTime(isodate, format);
	}
	/*
	 * 문서 레이아웃 팝업으로 열기
	 */
	, openDocument: function (url, opt) {
		$dwp.core.portal.openDocument(url, opt);
	}
	/*
	 * 기본 조직정보관린 인스턴스를 리턴함
	 * @param	info	조직정보 Object Or 문자열
	 * @return	instance
	 */
	, orgData: function (info) {
		return new $dwp.ui.org.data.org(info);
	}
	/*
	 * 기타 조직정보관린 인스턴스를 리턴함(결재라인, 메일)
	 * @param	info	조직정보 Object Or 문자열
	 * @param	type	유형 : APRV
	 * @return	instance
	 */
	, orgDataEx: function (info, type) {
		return new $dwp.ui.org.data.orgEx(info, type);
	}
	, param_winopen: function (url, title, _width, _height, _top, _left, _location, _menubar, _resizable, _scrollbars, _status, _toolbar) {
		$dwp.core.util.param_winopen(url, title, _width, _height, _top, _left, _location, _menubar, _resizable, _scrollbars, _status, _toolbar);
	}
	/*
	 * 새창으로 문서열기
	 * @param	url		호출 URL
	 * @param	title	제목
	 * @param	opt		window 옵션
	 * @return
	 */
	, winopen: function (url, title, opt) {
		$dwp.core.util.winopen(url, title, opt);
	}

	, winmopen: function (url, title, opt) {
		$dwp.core.util.winmopen(url, title, opt);
	}
	/*
	 *  dialog 오픈
	 *  @param initcalback 		function(dialog.intance){ }
	 *  @param width  			dialog 넓이 지정
	 *  @param height   			높이지정
	 *  @param modal   			dialog를 modal 창으로 띄울것인지 결정
	 *  @param resizeable   		사이즈 조절가능 여부
	 *  @param title 				dialog 제목
	 *  @param buttons    		[{ tittle: "버튼명" , click : function(dialog.intance){}  } ]
	 *  @param show      			애니메니션 효과  - 보여줄대
	 *  @param hide       			애니메니션 효과  - 숨길때
	 */
	, layerOpenDocument: function (opt) {
		$dwp.core.util.layerOpenDocument(opt);
	}
	/*
	 *  @return  { w: 스크린넓이, h: 스크린높이, doc_w: 브라우져 넓이, doc_h: 브라우져 높이 }
	 */
	, getScreenInfo: function () {
		return $dwp.core.util.getScreenInfo();
	}
	/*
	 * Block 설정
	 * @param	el		대상 Object( 전체인 경우는 undefined )
	 */
	, block: function (el, opt) {
		$dwp.ui.block(el, opt);
	}
	/*
	 * Block 해제
	 * @param	el		대상 Object
	 */
	, unblock: function (el) {
		$dwp.ui.unblock(el);
	}
	/*
	 * DB문서 Excel DownLoad 처리
	 * @param	cdb			대상 DB 경로
	 * @param	eventcode	Excel Down Config코드 (통합관리 DB 등록 코드)
	 * @param	applcode	ApplCode
	 * @param	formula		검색 수식 ( 기간 설정 조건에 and 조건을 추가르 줄 경우 )
	 */
	, exceldown: function (opt) {
		$dwp.core.util.exceldown(opt);
	}

	/*
	 * Toast메세지 출력 함수
	 * @param	opt			{ icon : "", msg : "", timeout : 1500 }
	 */
	, toast: function (opt) {
		$dwp.ui.toast.init(null, opt);
	}
	/*
	 * 메신저 사용자 상태정보 가져오기
	 * @param	userIDs		사용자 ID(사번) 다중구분자 (콤마)
	 * @param	callback	callback함수에 파라미터로 사용자 상태정보를 배열로 전달함.
	 */
	, mGetUserStatus: function (userIDs, callback) {
		$dwp.core.util.messenger.getUserStatus(userIDs, callback);
	}
	/*
	 * 메신저 채팅장 호출
	 * @param	userIDs		대상상대 ID(사번)
	 */
	, mChat: function (userIDs) {
		$dwp.core.util.messenger.chat(userIDs);
	}
	/*
	 * 조직도 Tree
	 * @param	el		대상 Target ex) <div class="dwp-tree org-type"><div class="tree"></div></div>
	 * @param	opt		옵션  treetype : "0"		// 0 : 부서 & 사용자, 1 : 부서
						   seltype  : "0"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
						   exorgcode : ""		// 제외대상 부서코드 (구분자는 ,)
						   islazy   : true
						   _onClick : function(dtnode) {}
						   _onDblClick : function(dtnode) {}
	 */
	, orgtree: function (el, opt) {
		var _$el = $(el)
			, _opt = $.extend({ islazy: true }, opt);
		$dwp.ui.org.tree.init(_$el, _opt);
	}
	, plugnin_install: function () {	//added by noh. 21.08.03
		var _lang = $dwp.core.lang.getUserLang();
		$dwp.app.mail.com.MailStoreDownload(_lang);
	}
	, goMenu: function (opt) {	//added on 21.10.01 by noh
		if (opener) {
			opener.$dwp.core.portal.goMenu(opt);
			window.close();
		} else {
			parent.$dwp.core.portal.goMenu(opt);
		}
	}
};

// $dwp.core.util  함수 확장
(function (fn, $) {
	var _fn = fn;
	$.each($dwp.core.util, function (fnm, fnc) {
		if (!_fn.hasOwnProperty(fnm) && typeof fnc === "function") {
			//console.log( "$fn." +fnm ) ;
			_fn[fnm] = fnc;
		}
	})
}($fn, jQuery))











