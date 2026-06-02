/**
 * <b>Org 라이브러리</b>
 * <br>조직처리를 위한 함수를 정의합니다.
 * @module core/ui/org
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.ui.org|core.ui.org}
 */
(function (/** @lends	module:core~$dwp.core.ui */_$$, $) {
	/**
	 * Org
	 * @namespace
	 */
	_$$.org = {
		_CONST: {
			_PROP: {
				TYPES: "B^S^G^C"
				//B^부서^^풀부서코드^부서코드^상위부서코드^부서장^접수담당^^^회사코드^표시부서
				//S^부서/이름명^사번^노츠ID^부서코드^상위부서코드^직책^직책코드(code2)^직급명^직급코드(code1)^회사코드^표시부서
				//G^ko:발신전용그룹,en:발신전용그룹^^^발신전용그룹^^^^^^^					// 메일 개인그룹 전용
				//C^ko:발신전용그룹,en:발신전용그룹^^^발신전용그룹^^^^^^회사코드^회사명		 // 메일 공용그룹 전용
				, DEPT_KEY: "orgcode"
				, USER_KEY: "notesid"
				, GROUP_KEY: "groupcode"
				, CGROUP_KEY: "groupcode"
				, DEPT: "type^orgname^^fullorgcode^orgcode^porgcode^chief^filer^^^comcode^dorgname^comname^etc"
				, USER: "type^username^empno^notesid^orgcode^porgcode^duty^dutycode^pos^poscode^comcode^orgname^comname^etc"
				, GROUP: "type^groupname^^^groupcode^^^^^^^"
				, CGROUP: "type^groupname^^^groupcode^^^^^^comcode^comname"
				, APRV_KEY: "notesid"
				, APRV: "apptype^appindex^type^username^empno^notesid^orgcode^porgcode^duty^dutycode^pos^poscode^comcode^orgname^comname^etc"
				, APRVDEPT_KEY: "orgcode"
				, APRVDEPT: "apptype^type^orgname^^fullorgcode^orgcode^porgcode^^^^^comcode^dorgname"
				, VPR_KEY: "notesid"
				, VPR: "vprtype^type^username^empno^notesid^orgcode^porgcode^duty^dutycode^pos^poscode^comcode^orgname^comname^etc^sdate^edate"
			}
		}
		//data 처리
		, data: {
			getOrg: function (empno) {
				var _me = this
					, _pinfolist = $fn.getUserInfo(empno)
					, _pinfo = {};

				$.each(_pinfolist, function (i, o) {
					if (o.isconc != "1") {
						_pinfo = o; return false;
					}
				});

				_pinfo.type = "S";
				_pinfo.username = _pinfo.name;

				return new _me.org(_pinfo);
			}
			, org: function (info) {
				var _me = this;
				_me.sinfo = "";
				_me.oinfo = {};

				_me.getStr = function () {
					return _me.sinfo;
				}

				_me.getObject = function () {
					return _me.oinfo;
				}
				_me.getFDispName = function () {
					var _name = "";
					//To-Do 타회사인 경우 회사명 추가
					if (_me.oinfo.type == "B") {
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.orgname);
					} else if (_me.oinfo.type == "G" || _me.oinfo.type == "C") {
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.groupname);
					} else {
						/*
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.username) + "/";
						_name += $dwp.core.lang.getCurMsg(_me.oinfo.pos) + "/";
						_name += $dwp.core.lang.getCurMsg(_me.oinfo.orgname);
						*/
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.username);
						_name += ((_me.oinfo.pos != "") ? "/" + $dwp.core.lang.getCurMsg(_me.oinfo.pos) : "");
						_name += ((_me.oinfo.orgname != "") ? "/" + $dwp.core.lang.getCurMsg(_me.oinfo.orgname) : "");
					}
					if ($fn.getCurUser().pinfo.comcode != _me.oinfo.comcode && _me.oinfo.orgcode != _me.oinfo.comcode && _me.oinfo.comname != "") {
						_name += "/" + $dwp.core.lang.getCurMsg(_me.oinfo.comname);
					}
					return _name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				}
				_me.getDispName = function () {
					var _name = "";
					//To-Do 타회사인 경우 회사명 추가
					if (_me.oinfo.type == "B") {
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.orgname);
					} else if (_me.oinfo.type == "G" || _me.oinfo.type == "C") {
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.groupname);
					} else {
						/*
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.username) + "/";
						_name += $dwp.core.lang.getCurMsg(_me.oinfo.pos) + "/";
						_name += $dwp.core.lang.getCurMsg(_me.oinfo.orgname);
						*/
						if ($dwp.core.util.getDeviceInfo.type() != "PC") {
							_name = $dwp.core.lang.getCurMsg(_me.oinfo.username);
						} else {
							_name = $dwp.core.lang.getCurMsg(_me.oinfo.username);
							_name += ((_me.oinfo.pos != "") ? "/" + $dwp.core.lang.getCurMsg(_me.oinfo.pos) : "");
							_name += ((_me.oinfo.orgname != "") ? "/" + $dwp.core.lang.getCurMsg(_me.oinfo.orgname) : "");
						}
					}
					if ($fn.getCurUser().pinfo.comcode != _me.oinfo.comcode && _me.oinfo.orgcode != _me.oinfo.comcode && _me.oinfo.comname != "") {
						_name += "/" + $dwp.core.lang.getCurMsg(_me.oinfo.comname);
					}
					return _name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				}
				_me.getDispNameLang = function () {
					var _name = "";
					//To-Do 타회사인 경우 회사명 추가
					if (_me.oinfo.type == "B") {
						_name = _me.oinfo.orgname;
					} else if (_me.oinfo.type == "G" || _me.oinfo.type == "C") {
						_name = _me.oinfo.groupname;
					} else {
						/*
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.username) + "/";
						_name += $dwp.core.lang.getCurMsg(_me.oinfo.pos) + "/";
						_name += $dwp.core.lang.getCurMsg(_me.oinfo.orgname);
						*/
						if ($dwp.core.util.getDeviceInfo.type() != "PC") {
							_name = _me.oinfo.username;
						} else {
							_name = _me.oinfo.username;
							_name += ((_me.oinfo.pos != "") ? $dwp.core.lang._CONST.M_SPLIT + _me.oinfo.pos : "");
							_name += ((_me.oinfo.orgname != "") ? $dwp.core.lang._CONST.M_SPLIT + _me.oinfo.orgname : "");
						}
					}
					if ($fn.getCurUser().pinfo.comcode != _me.oinfo.comcode && _me.oinfo.orgcode != _me.oinfo.comcode && _me.oinfo.comname != "") {
						_name += $dwp.core.lang._CONST.M_SPLIT + _me.oinfo.comname;
					}
					_name = $dwp.core.lang.getMergeLangStr(_name, "/");
					return _name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				}
				_me.getCustomDispName = function (disp) {
					var _tdisp = "", _disp = "";

					if (typeof disp == "undefined" || disp == "") { return ""; }

					_disp = disp;

					var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s]/gi;
					if (regExp.test(disp)) {
						_tdisp = _disp.replace(regExp, "`}");
					} else {
						_tdisp = _disp;
					}

					var _objs = _tdisp.split("`}");
					$.each(_objs, function (i, v) {
						if (_me.oinfo.hasOwnProperty(v)) {
							var _regExp = new RegExp(v, "g");
							_disp = _disp.replace(_regExp, $dwp.core.lang.getCurMsg(_me.oinfo[v]))
						}
					});

					return _disp;

				}
				function _getType(type) {
					switch (type) {
						case "B": return _$$.org._CONST._PROP.DEPT.split("^"); break;
						case "G": return _$$.org._CONST._PROP.GROUP.split("^"); break;
						case "C": return _$$.org._CONST._PROP.CGROUP.split("^"); break;
						case "S": return _$$.org._CONST._PROP.USER.split("^"); break;
					}
				}
				function _getKey(type) {
					switch (type) {
						case "B": return _$$.org._CONST._PROP.DEPT_KEY; break;
						case "G": return _$$.org._CONST._PROP.GROUP_KEY; break;
						case "C": return _$$.org._CONST._PROP.CGROUP_KEY; break;
						case "S": return _$$.org._CONST._PROP.USER_KEY; break;
					}
				}
				function _creatObj(vlist) {
					$.each(vlist, function (i, v) {
						_me.oinfo[v] = "";
					});
				}
				function _create(info) {
					var __tlist = null, _slist = null, _str = "", _key = "";

					if (typeof info == "undefined") return;
					if (typeof info == "object") {
						if (!info.hasOwnProperty("type")) return;
						if (_$$.org._CONST._PROP.TYPES.indexOf(info.type) == -1) return;

						_tlist = _getType(info.type);

						_creatObj(_tlist);

						$.each(_me.oinfo, function (p, v) {
							if (info.hasOwnProperty(p)) {
								_me.oinfo[p] = info[p];
							}
						});

						$.each(_tlist, function (i, v) {
							_str = _str + _me.oinfo[v] + "^";
						});
						_me.sinfo = _str.substr(0, _str.length - 1);

					} else if (typeof info == "string") {
						//debugger;
						_slist = info.split("^");
						if (_$$.org._CONST._PROP.TYPES.indexOf(_slist[0]) == -1) return;

						_tlist = _getType(_slist[0]);
						if (_tlist.length != _slist.length) return;

						_creatObj(_tlist);

						$.each(_slist, function (i, v) {
							_me.oinfo[_tlist[i]] = v;
						});
						_me.sinfo = info;
					}
					_key = _getKey(_me.oinfo.type);
					if (_me.oinfo.hasOwnProperty(_key)) {
						_me.oinfo.key = _me.oinfo[_key];
					} else {
						_me.oinfo.key = "";
					}
				}
				_create(info);
			}
			, orgEx: function (info, type) {
				var _me = this;
				_me.sinfo = "";
				_me.oinfo = {};

				_me.getStr = function () {
					return _me.sinfo;
				}

				_me.getObject = function () {
					return _me.oinfo;
				}

				_me.getDispName = function () {
					var _name = "";
					//To-Do 타회사인 경우 회사명 추가
					if (_me.oinfo.type == "B") {
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.orgname);
					} else if (_me.oinfo.type == "G" || _me.oinfo.type == "C") {
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.groupname);
					} else {
						_name = $dwp.core.lang.getCurMsg(_me.oinfo.username);
						_name += ((_me.oinfo.pos != "") ? "/" + $dwp.core.lang.getCurMsg(_me.oinfo.pos) : "");
						_name += ((_me.oinfo.orgname != "") ? "/" + $dwp.core.lang.getCurMsg(_me.oinfo.orgname) : "");
					}

					return _name;
				}
				_me.getDispNameLang = function () {
					var _name = "";
					//To-Do 타회사인 경우 회사명 추가
					if (_me.oinfo.type == "B") {
						_name = _me.oinfo.orgname;
					} else if (_me.oinfo.type == "G" || _me.oinfo.type == "C") {
						_name = _me.oinfo.groupname;
					} else {
						var _langStr = _me.oinfo.username;
						_langStr += ((_me.oinfo.pos != "") ? $dwp.core.lang._CONST.M_SPLIT + _me.oinfo.pos : "");
						_langStr += ((_me.oinfo.orgname != "") ? $dwp.core.lang._CONST.M_SPLIT + _me.oinfo.orgname : "");

						_name = $dwp.core.lang.getMergeLangStr(_langStr, "/");
					}

					return _name;
				}

				function _getType(type) {
					return _$$.org._CONST._PROP[type].split("^");
				}

				function _getKey(type) {
					return _$$.org._CONST._PROP[type + "_KEY"];
				}

				function _creatObj(vlist) {
					$.each(vlist, function (i, v) {
						_me.oinfo[v] = "";
					});
				}

				function _create(info, type) {
					var __tlist = null, _slist = null, _str = "", _key = "";

					if (typeof info == "undefined") return;
					if (typeof info == "object") {

						_tlist = _getType(type);
						_creatObj(_tlist);

						$.each(_me.oinfo, function (p, v) {
							if (info.hasOwnProperty(p)) {
								_me.oinfo[p] = info[p];
							}
						});

						$.each(_tlist, function (i, v) {
							_str = _str + _me.oinfo[v] + "^";
						});
						_me.sinfo = _str.substr(0, _str.length - 1);

					} else if (typeof info == "string") {
						_slist = info.split("^");
						//if (_$$.org._CONST._PROP.TYPES.indexOf(_slist[0]) == -1 ) return;

						_tlist = _getType(type);
						if (_tlist.length != _slist.length) return;

						_creatObj(_tlist);

						$.each(_slist, function (i, v) {
							_me.oinfo[_tlist[i]] = v;
						});
						_me.sinfo = info;
					}
					_key = _getKey(type);
					if (_me.oinfo.hasOwnProperty(_key)) {
						_me.oinfo.key = _me.oinfo[_key];
					} else {
						_me.oinfo.key = "";
					}
				}
				_create(info, type);
			}
			, qsConvert: function (qjson) {
				var json = {}, _orglist, _comname = "";

				//_comname = qjson.uselang + ":" + qjson.fullorgname_d.split(";")[0];
				//_comname += ( qjson.uselang != "en" ? ",en:" + qjson.fullorgname_e.split(";")[0] : "");
				//_comname += ( qjson.uselang != "ko" ? ",ko:" + qjson.fullorgname.split(";")[0] : "");

				_comname = "ko:" + qjson.fullorgname.split(";")[0];
				if (qjson.hasOwnProperty("fullorgname_e") && qjson.fullorgname_e != "") {
					_comname += ",en:" + qjson.fullorgname_e.split(";")[0];
				}
				_comname += ((qjson.uselang != "ko" && qjson.uselang != "en") ? "," + qjson.uselang + ":" + qjson.fullorgname_d.split(";")[0] : "");

				if (qjson.type == "S") {
					_orglist = qjson.fullorgcode.split(";");
					//qjson.notesuname = qjson.notesuname.replace(";", "");
					json.type = "S";
					json.key = $fn.getName(qjson.notesuname).abbreviate;
					//json.username 	= qjson.uselang + ":" + qjson.personname + ( qjson.uselang != "en" ? ",en:" + qjson.personname_e : "");
					json.username = (qjson.uselang == "en" ? "en:" + qjson.personname_e : qjson.uselang + ":" + qjson.personname + ",en:" + qjson.personname_e);
					json.username = "ko:" + qjson.personname + ",en:" + qjson.personname_e + (qjson.personname_c != "" ? ",zh:" + qjson.personname_c : "");
					json.empno = qjson.personid;
					json.notesid = $fn.getName(qjson.notesuname).abbreviate;
					json.orgcode = qjson.orgcode;
					json.porgcode = (_orglist.length == 1 ? "" : _orglist[_orglist.length - 2]);
					json.dutycode = qjson.code2;
					//json.duty	 	= qjson.uselang + ":" + qjson.name2_d + ( qjson.uselang != "en" ? ",en:" + qjson.name2_e : "") + ( qjson.uselang != "ko" ? ",ko:" + qjson.name2 : "");
					json.duty = "ko:" + qjson.name2 + ",en:" + qjson.name2_e + (qjson.name2_c != "" ? ",zh:" + qjson.name2_c : "") + ((qjson.uselang != "ko" && qjson.uselang != "en" && qjson.uselang != "zh") ? "," + qjson.uselang + ":" + qjson.name2_d : "");
					json.poscode = qjson.code1;
					//json.pos	 	= qjson.uselang + ":" + qjson.name1_d + ( qjson.uselang != "en" ? ",en:" + qjson.name1_e : "") + ( qjson.uselang != "ko" ? ",ko:" + qjson.name1 : "");
					json.pos = "ko:" + qjson.name1 + ",en:" + qjson.name1_e + (qjson.name1_c != "" ? ",zh:" + qjson.name1_c : "") + ((qjson.uselang != "ko" && qjson.uselang != "en" && qjson.uselang != "zh") ? "," + qjson.uselang + ":" + qjson.name1_d : "");
					json.comcode = qjson.comcode;
					//json.orgname 	= qjson.uselang + ":" + qjson.orgname_d + ( qjson.uselang != "en" ? ",en:" + qjson.orgname_e : "") + ( qjson.uselang != "ko" ? ",ko:" + qjson.orgname : "");
					json.orgname = "ko:" + qjson.orgname + ",en:" + qjson.orgname_e + (qjson.orgname_c != "" ? ",zh:" + qjson.orgname_c : "") + ((qjson.uselang != "ko" && qjson.uselang != "en" && qjson.uselang != "zh") ? "," + qjson.uselang + ":" + qjson.orgname_d : "");
					json.comname = _comname

				} else if (qjson.type == "B") {
					//"type^orgname^^fullorgcode^orgcode^porgcode^^^^^comcode^dorgname"
					qjson.uselang = "ko";	// 임시설정
					json.type = "B";
					json.key = qjson.orgcode;
					//json.orgname 	= qjson.uselang + ":" + qjson.orgname_d + ( qjson.uselang != "en" ? ",en:" + qjson.orgname_e : "") + ( qjson.uselang != "ko" ? ",ko:" + qjson.orgname : "");
					json.orgname = "ko:" + qjson.orgname + ",en:" + qjson.orgname_e + (qjson.orgname_c != "" ? ",zh:" + qjson.orgname_c : "") + ((qjson.uselang != "ko" && qjson.uselang != "en" && qjson.uselang != "zh") ? "," + qjson.uselang + ":" + qjson.orgname_d : "");
					json.fullorgcode = qjson.fullorgcode.replace(/;/g, ",");
					json.orgcode = qjson.orgcode;
					json.porgcode = qjson.parorgcode;
					json.chief = qjson.hasOwnProperty("pname") ? qjson.pname : "";
					json.filer = qjson.hasOwnProperty("rname") ? qjson.rname : "";
					json.comcode = qjson.comcode;
					//json.dorgname 	= qjson.uselang + ":" + qjson.orgname_d + ( qjson.uselang != "en" ? ",en:" + qjson.orgname_e : "") + ( qjson.uselang != "ko" ? ",ko:" + qjson.orgname : "");
					json.dorgname = "ko:" + qjson.orgname + ",en:" + qjson.orgname_e + (qjson.orgname_c != "" ? ",zh:" + qjson.orgname_c : "") + ((qjson.uselang != "ko" && qjson.uselang != "en" && qjson.uselang != "zh") ? "," + qjson.uselang + ":" + qjson.orgname_d : "");
					json.comname = _comname;
				}
				json.etc = "";
				return json;
			}
			, deptCheck: function (cdata) {
				/*
				 * 선택 불가능 부서정보 체크하기 (리턴값은 불가능 리스트를 추출하여 반환해준다)
				 * cdata = {
				 * 		field		: 체크할 필드명 (필드명으로 체크하려면 _doc Element를 같이 설정해야한다. 하나 이상의 필드의 경우 세미콜론으로)
				 * 		ele			: 현재 화면의 doc instance의 element
				 * 		orgdata	: orgFull 데이터 또는 부서코드값으로 체크할 때
				 * 		zsub		: 비교기준 코드값
				 * }
				 * ex) : $dwp.ui.org.data.deptCheck({zsub : "40", orgdata : "BZZZ12;00007851;00003956;00008829"})
				 * ex) : $dwp.ui.org.data.deptCheck({zsub : "40", orgdata : "B^ko:한국타이어월드와이드,en:Hankooktire World Wide^^00007851^00007851^^^^^^00007851^ko:한국타이어월드와이드,en:Hankooktire World Wide^ko:한국타이어월드와이드,en:Hankooktire World Wide"})
				 * ex) : $dwp.ui.org.data.deptCheck({zsub : "40", field : "SendToFull;CopyToFull;BlindCopyToFull", ele : doc.element})
				 * */

				var _me = this, _cdata = $.extend({ field: [], _doc: null, orgdata: "", zsub: "40" }, cdata), _rtn = {}, fields = [];

				if (_cdata.field != "" && typeof (_cdata.ele) == "object") {
					fields = _cdata.field.split(";");
					_cdata.orgdata = "";
					$.each(fields, function (i, field) {
						if ($.trim(field) != "") {
							if (_cdata.orgdata != "") { _cdata.orgdata += ";" }
							_cdata.orgdata += $("[name='" + $.trim(field) + "']", _cdata.ele).xval();
						}
					});
				}

				$fn.cmdPostEx({
					url: $fn.getProxyUrl($dwp.core.getPath("org") + "/wdeptcheck?openform"),
					async: false,
					dataType: "json",
					data: { postdata: _cdata.orgdata, zsub: _cdata.zsub },
					success: function (data, textStatus) {
						_rtn = data;
					}
				});
				/*
				_rtn = {
					cnt				: "2",
					msgcode		: "success",
					result			: "200",
					rtncode		: "00007851;00008829",
					rtnfull			: "B^ko:한국타이어월드와이드,en:Hankooktire World Wide^^00007851^00007851^^^^^^00007851^ko:한국타이어월드와이드,en:Hankooktire World Wide^ko:한국타이어월드와이드,en:Hankooktire World Wide;B^ko:재무회계담당,en:Finance & Accounting Department^^00007851,00007876,00008901,00008829^00008829^00008901^^^^^00007851^ko:재무회계담당,en:Finance & Accounting Department^ko:한국타이어월드와이드,en:Hankooktire World Wide",
					rtnname		: "ko:한국타이어월드와이드,en:Hankooktire World Wideko{$}재무회계담당,en:Finance & Accounting Department"
				}
				*/
				return _rtn;
			}
		}
		, tree: {
			_CONST: {
				_ROOT_KEY: "_ROOT_"
			}
			, init: function (_$el, opt) {
				var _me = this
					, _opt = $.extend({
						rootkey: "_ROOT_"
						, url: $dwp.core.getPath("org") + "/api/data/collections/name/wViwOrgList"
						, site: "scg"
						, issiteselect: true
						, usesite: false
						, isapproval: false
						, isall: false
						, ismng: false
						, checkbox: true
						, exorgcode: ""
						, dragable: true
						, hdata: []
						, _onDblClick: null
						, isloadsel: false
						, parent: null
						, nodetitle: { "B": "", "P": "" }
						, usepic: false
						//회사코드정보 변경 - 2019-04-04 By LHJ
						//,comcode : $dwp.core.getCurUser().pinfo.comcode
						, comcode: $fn.getComCode()
					}, opt);
				console.log("Tree Init", _opt);
				var _$treeSiteArea = $("div.dwp-site-area", _$el.parents("div.dwp-tree-area"));
				if (_opt.usesite) {
					if (_$treeSiteArea.size() > 0) {
						_$treeSiteArea.removeClass("dwp-none");
					}

					if (_opt.site == "center") { _opt.url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwCOrgList"; }
					else if (_opt.site == "scggrp") { _opt.url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwGOrgList"; }
				} else {
					if (_$treeSiteArea.size() > 0) {
						_$treeSiteArea.addClass("dwp-none");
					}
				}

				if (_opt.ismng) { _opt.url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwMOrgList"; }
				else if (_opt.isall) { _opt.url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwAOrgList"; }

				$(_$el).data("_TREE_DOPT", _opt);

				function _initLoadData(opt) {
					var _child = null;
					_child = _me._loadData(opt.rootkey, opt);
					if (opt.islazy) {
						$.each(_child, function (i, node) {
							if (node.isLazy) {
								var _cchild = _me._loadData(node.key, opt);
								if (_cchild.length > 0) {
									node.children = _cchild;
								}
							}
						});
					}
					return _child;
				}

				function _onActivate(dtnode, event) {
					if (!_opt.checkbox) { dtnode.select(true); return true; }
					//if(!dtnode.tree.isUserEvent()){return true;}
					if (!dtnode.isSelected()) {
						dtnode.deactivate();
					}
				}
				function _onClick(dtnode, event) {
					if (!_opt.checkbox) return true;
					//if(!dtnode.isActive()) return false;
					//_onActivate(dtnode, event);
					if (opt.seltype == "2" && dtnode.data.isFolder) return true;
					if (dtnode.getEventTargetType(event) == "title") {
						dtnode.toggleSelect();
						if (!dtnode.isSelected()) {
							dtnode.deactivate();
						}
						return true;
					}
				}
				function _onDeactivate(dtnode) {
					if (!_opt.checkbox) { dtnode.select(false); return true; };
					//if(!dtnode.tree.isUserEvent()){return true;}
					//console.log("dtnode", dtnode)
					//if ( dtnode.getEventTargetType(event) == "title" ) {
					//	dtnode.select(true);
					//	return true;
					//}
				}
				function _onDblClick(dtnode) {
					//console.log("DD", dtnode)
					if (dtnode.data.isFolder && _opt.seltype == "2") {
						dtnode.toggleExpand();
					}
				}
				function _onLazyRead(dtnode, opt) {
					var _key = dtnode.data.key;
					var _opt = $(_$el).data("_TREE_DOPT");
					var _child = _me._loadData(_key, _opt);
					dtnode.setLazyNodeStatus(DTNodeStatus_Ok);
					if (_child.length == 0) {
						dtnode.data.isLazy = false;
						dtnode.render();
					} else {
						dtnode.addChild(_child);
					}
				}

				$dwp.ui.tree.init(_$el, {
					children: _initLoadData(_opt)
					, islazy: true
					, treetype: _opt.treetype
					, seltype: _opt.seltype
					, checkbox: _opt.checkbox
					, noLink: true
					, clickFolderMode: 1
					, minExpandLevel: 1
					, selectMode: 2
					, onLazyRead: function (dtnode) { _onLazyRead(dtnode, _opt); }
					//,helper: "clone"
					, dnd: (_opt.dragable ? {
						/* 폴더는 드래그 안되게 */
						onDragStart: function (node) {
							if ((node.data.isFolder && _opt.seltype == "2") || (!node.data.isFolder && _opt.seltype == "1")) {
								return false;
							}
							if (!node.isSelected()) { node.select(true); }
							return true;
						}
					} : null)
					, onActivate: typeof _opt.onActivate == "function" ? function (dtnode) { _opt.onActivate(dtnode, _opt.parent); } : _onActivate
					, onClick: typeof _opt.onClick == "function" ? function (dtnode) { _opt.onClick(dtnode, _opt.parent); } : _onClick
					, onDeactivate: _onDeactivate
					, onDblClick: function (dtnode) {
						var _dtnode = $.extend({}, dtnode)
						if (typeof _opt._onDblClick == "function") {
							//console.log(_opt._onDblClick);
							_opt._onDblClick(_dtnode);
						}
					}
					, callback: function (tree) {
						if (_opt.usepic) {
							$fn.getPicError($("span.userpic img", _$el));
						}
						var _fullorgcode = $dwp.core.getCurUser().pinfo.fullorgcode + "," + $dwp.core.getCurUser().abnotesid
						tree.loadKeyPath(_fullorgcode, _opt.isloadsel);
					}
				});

			}
			, changeSite: function (_$el, site) {
				var _me = this
					, _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwOrgList";
				console.log("site", site);
				if (site == "center") { _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwCOrgList"; }
				else if (site == "scggrp") { _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwGOrgList"; }

				var opt = _$el.data("_TREE_DOPT");
				var _opt = $.extend({}, opt, { site: site, url: _url });

				//_me.reinit(_$el, _opt)
				_$el.data("_TREE_DOPT", _opt);
				//_me.reload();
			}
			, reinit: function (_$el, opt) {
				var _me = this;

				_$el.removeData();
				_$el.empty();

				_me.init(_$el, opt);
			}
			, reload: function (xtree, callback) {
				var _me = this
					, dtnode = xtree.rootNode()
					, opt = xtree.element.data("_TREE_DOPT");

				if (dtnode) {
					dtnode.removeChildren();
					dtnode.addChild(_me._initLoadData(opt));

					var _fullorgcode = $dwp.core.getCurUser().pinfo.fullorgcode + "," + $dwp.core.getCurUser().abnotesid
					xtree.loadKeyPath(_fullorgcode, opt.isloadsel);

					if (typeof (callback) == "function") {
						callback();
					}
				}
			}
			, _initLoadData: function (opt) {
				var _me = this, _child = null;
				_child = _me._loadData(opt.rootkey, opt);
				if (opt.islazy) {
					$.each(_child, function (i, node) {
						if (node.isLazy) {
							var _cchild = _me._loadData(node.key, opt);
							if (_cchild.length > 0) {
								node.children = _cchild;
							}
						}
					});
				}
				return _child;
			}
			, _loadData: function (key, opt) {
				var _me = this, _key = key
					, _url = opt.url;

				console.log("_opt.site", opt.site + "|" + opt.url);

				function _jsonGetParmData() {
					return {
						url: _url,
						dataType: "json",
						async: false,
						cache: false
						, data: { category: _key, count: 999 }
					};
				}
				//console.log("_jsonGetParmData()", _jsonGetParmData())
				return _me._getData(_jsonGetParmData(), opt);
			}
			, _getData: function (param, opt, issearch) {
				//console.log("opt", opt);
				var _me = this, _child = [], _issearch = issearch || false;
				$dwp.core.util.xAjax(param)
					.done(function (jdata) {
						if (jdata.length == 0) return _child;
						$(jdata).each(function (i, data) {
							var _org = new _$$.org.data.org(data._fullorginfo)
								, _row = {};

							// 계열사 표시여부체크 - By 2019-02-20
							// if (opt.comcode != "" && opt.comcode != _org.oinfo.comcode) return true;

							if (data._type == "B") {
								if (opt.exorgcode == "" || opt.exorgcode.indexOf(_org.oinfo.orgcode) == -1) {
									_row.orgdata = _org.oinfo;
									_row.key = _org.oinfo.orgcode;
									_row.pkey = _org.oinfo.porgcode;
									if (opt.hasOwnProperty("nodetitle") && opt.nodetitle.hasOwnProperty("B") && opt.nodetitle.B != "") {
										_row.title = _org.getCustomDispName(opt.nodetitle.B);
									} else {
										_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.orgname);
									}
									_row.unid = data["@unid"];
									_row.type = data._type;
									_row.isFolder = true;
									_row.isLazy = opt.islazy;
									if (opt.ismng && data.hasOwnProperty("_isdisp")) {
										if (data._isdisp == "0") {
											_row.title = _row.title + "(숨김)";
										}
									}
								}
							} else {
								if (opt.treetype == "0") {
									_row.orgdata = _org.oinfo;
									//_row.key = _org.oinfo.empno;
									_row.key = _org.oinfo.notesid;
									_row.pkey = _org.oinfo.orgcode;
									//_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.pos) + " " +$dwp.core.lang.getCurMsg(_org.oinfo.username);
									if (opt.hasOwnProperty("nodetitle") && opt.nodetitle.hasOwnProperty("P") && opt.nodetitle.P != "") {
										_row.title = _org.getCustomDispName(opt.nodetitle.P);
									} else {
										if (opt.isapproval) {
											_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.duty) + " " + $dwp.core.lang.getCurMsg(_org.oinfo.username.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
										} else {
											_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.pos) + " " + $dwp.core.lang.getCurMsg(_org.oinfo.username.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
										}
									}
									_row.unid = data["@unid"];
									_row.type = data._type;
									_row.isFolder = false;
									_row.isLazy = false;
									if (opt.ismng) {
										var _tmp = [];
										if (data.hasOwnProperty("_isconc") && data._isconc == "1") { _tmp.push("겸직"); }
										if (data.hasOwnProperty("_isdisp") && data._isdisp == "0") { _tmp.push("숨김"); }

										if (_tmp.length > 0) {
											_row.title = _row.title + "(" + _tmp.join(",") + ")";
										}
									}
									if (opt.usepic) {
										_row.title = "<span class='userpic'><img src='" + $dwp.core.getPath("pic", { empno: _org.oinfo.empno }) + "' onerror=\"this.src= $dwp.core.getPath('weblib') + '/images/common/default-person.png';\"></span>" + _row.title;
									}
								}
							}
							if (typeof (_row.orgdata) != "undefined") {
								if (opt.islazy || _issearch) {
									_child.push(_row);
								} else {
									if (_row.pkey == "" || _child.length == 0) {
										_child.push(_row);
									} else {
										_$$.tree.addchild(_row.pkey, _child, _row);
									}
								}
							}
						});
					})
					.fail(function () {
						console.log("ERROR");
					});
				//console.log("_child", _child);
				return _child;
			}
			//조직도 검색
			, __search: function (query, opt) {
				var _me = this
					, _child = []
					, _opt = $.extend({ exorgcode: "" }, opt);

				//회사코드정보 변경 - 2019-04-04 By LHJ
				//var _data = {q : query.replace(/\)/g, "\\)").replace(/\(/g, "\\("), cc : $fn.getCurUser().pinfo.comcode};
				var _data = { q: query.replace(/\)/g, "\\)").replace(/\(/g, "\\("), cc: $fn.getComCode() };

				function _getType(type) {
					switch (type) {
						case "0": return "p,d"; break;
						case "2": return "p"; break;
						case "1": return "d"; break;
					}
				}
				_data.type = _getType(_opt.seltype);

				$dwp.core.util.xAjax({
					url: "/dwprts/quicksearch"
					, dataType: "json"
					, async: false
					, cache: false
					, data: _data
				}).done(function (data) {
					$.each(data.response.org, function (i, o) {
						var _row = {};
						o.type = "B";
						var _item = _$$.org.data.qsConvert(o)
							, _org = new _$$.org.data.org(_item);

						if (_opt.exorgcode == "" || _opt.exorgcode.indexOf(_org.oinfo.orgcode) == -1) {
							_row.orgdata = _org.oinfo;
							_row.key = _org.oinfo.orgcode;
							_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.orgname);
							_row.unid = "";
							_row.type = o.type;

							_child.push(_row)
						}
					});
					$.each(data.response.person, function (i, o) {
						var _row = {};
						o.type = "S";
						var _item = _$$.org.data.qsConvert(o)
							, _org = new _$$.org.data.org(_item);

						_row.orgdata = _org.oinfo;
						_row.key = _org.oinfo.notesid;
						_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.pos) + " " + $dwp.core.lang.getCurMsg(_org.oinfo.username);
						_row.unid = "";
						_row.type = o.type;

						_child.push(_row)
					});
				});
				return _child;
			}
			, search: function (query, opt, _$el) {
				var _me = this
					//회사코드정보 변경 - 2019-04-04 By LHJ
					//,_opt = $.extend({exorgcode : "",comcode : $dwp.core.getCurUser().pinfo.comcode}, opt)
					, _opt = $.extend({ exorgcode: "", comcode: $fn.getComCode() }, opt)
					, _child = [];

				if (typeof _$el != "undefined") {
					var __opt = _$el.data("_TREE_DOPT");
					_opt = $.extend(_opt, __opt);
				}

				function _jsonGetParmData() {
					var _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwOrgList"
						, _qry = "", _qrys = [];

					if (_opt.site == "center") { _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwCOrgList"; }
					else if (_opt.site == "scggrp") { _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwGOrgList"; }

					if (_opt.ismng) { _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwMOrgList"; }
					else if (_opt.isall) { _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwAOrgList"; }

					if (_opt.seltype == "0" || _opt.seltype == "2") {
						_qry = "(([Form] contains Person) and ";
						// 계열사 표시여부체크 - By 2019-02-20
						//if (_opt.comcode != "") {
						//	_qry += "([ComCode] contains " + _opt.comcode + ") and ";
						//}
						_qry += "(([PERSONNAME] contains " + query + ") or "
						_qry += "([PERSONNAME_C] contains " + query + ") or "
						_qry += "([OFFICETELNO] contains " + query + ") or "
						_qry += "([Work] contains " + query + ") or "
						_qry += "([INTERNETID] contains " + query + ") or "
						_qry += "([MOBILENO] contains " + query + ") or "
						_qry += "([OrgName] contains " + query + ") or "
						_qry += "([OrgName_E] contains " + query + ") or "
						_qry += "([OrgName_C] contains " + query + ") or "
						_qry += "([OrgName_D] contains " + query + ") or "
						_qry += "([PERSONNAME_E] contains " + query + ")))";

						_qrys.push(_qry);
					}

					if (_opt.seltype == "0" || _opt.seltype == "1") {
						_qry = "(([Form] contains Department) and ";
						// 계열사 표시여부체크 - By 2019-02-20
						//if (_opt.comcode != "") {
						//	_qry += "([ComCode] contains " + _opt.comcode + ") and ";
						//}
						_qry += "(([OrgName] contains " + query + ") or "
						_qry += "([OrgName_E] contains " + query + ") or "
						_qry += "([OrgName_C] contains " + query + ") or "
						_qry += "([OrgName_D] contains " + query + ")))";

						_qrys.push(_qry);
					}

					_qry = _qrys.join(" or ");

					return {
						url: _url
						, dataType: "json"
						, async: false
						, cache: false
						, data: { search: _qry, count: 250 }
					};
				}

				$dwp.core.util.xAjax(_jsonGetParmData())
					.done(function (jdata) {
						if (jdata.length == 0) return _child;
						//console.log("org-opt", opt);
						$(jdata).each(function (i, data) {
							var _org = new _$$.org.data.org(data._fullorginfo), _row = {};
							if (data._type == "B") {
								//if (opt.exorgcode == "" || opt.exorgcode.indexOf(_org.oinfo.orgcode) == -1 ) {
								_row.orgdata = _org.oinfo;
								_row.key = _org.oinfo.orgcode;
								_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.orgname);
								_row.unid = data["@unid"];
								_row.type = data._type;
								//}
							} else {
								if (_opt.treetype == "0") {
									_row.orgdata = _org.oinfo;
									_row.key = _org.oinfo.notesid;
									//_row.pkey = _org.oinfo.orgcode;
									_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.pos) + " " + $dwp.core.lang.getCurMsg(_org.oinfo.username);
									_row.unid = data["@unid"];
									_row.type = data._type;
								}
							}
							if (typeof (_row.orgdata) != "undefined") {
								_child.push(_row);
								/*
								if(typeof(opt.comcode) != "undefined" && opt.comcode != "") {
									if (opt.comcode == _row.orgdata.companycd) {
										_child.push(_row);
									}
								} else {
									_child.push(_row);
								}
								*/
							}
						});
					});
				return _child;
			}
		}
		, pgrouptree: {
			_CONST: {
				_ROOT_KEY: "_ROOT_"
				, P_URL: "{mail}/api/data/collections/name/PersonAddressTree"
				, G_URL: "{mail}/wAgtGroup?openagent"
				, S_URL: "{mail}/wAgtGroup?openagent"
			}
			, init: function (_$el, opt) {
				var _me = this
					, _opt = $.extend({
						rootkey: "_ROOT_"
						, checkbox: true
						, hdata: []
					}, opt);

				var _$treeSiteArea = $("div.dwp-site-area", _$el.parents("div.dwp-tree-area"));
				if (_$treeSiteArea.size() > 0) {
					_$treeSiteArea.addClass("dwp-none");
				}

				function _defaultData() {
					var _child = [];
					_child.push({ key: "_PER", pkey: "", title: $fn.getCodeMsg("comm.title.js013"), isFolder: true, isLazy: true, type: "p" });
					_child.push({ key: "_GRP", pkey: "", title: $fn.getCodeMsg("comm.title.js014"), isFolder: true, isLazy: true, type: "g" });
					return _child;
				}

				function _initLoadData(opt) {
					var _child = null;
					_child = _defaultData();
					return _child;
				}

				function _onActivate(dtnode, event) {
					if (!_opt.checkbox) return true;
					//if(!dtnode.tree.isUserEvent()){return true;}
					if (!dtnode.isSelected()) {
						dtnode.deactivate();
					}
				}
				function _onClick(dtnode, event) {
					if (!_opt.checkbox) return true;
					//if(!dtnode.isActive()) return false;
					//_onActivate(dtnode, event);
					if (opt.seltype == "2" && dtnode.data.isFolder) return true;
					if (dtnode.getEventTargetType(event) == "title") {
						dtnode.toggleSelect();
						if (!dtnode.isSelected()) {
							dtnode.deactivate();
						}
						return true;
					}
				}
				function _onDeactivate(dtnode) {
					//if(!dtnode.tree.isUserEvent()){return true;}
					//console.log("dtnode", dtnode)
					if (dtnode.getEventTargetType(event) == "title") {
						dtnode.select(true);
						return true;
					}
				}
				function _onDblClick(dtnode) {
					if (dtnode.data.isFolder && _opt.seltype == "2") {
						dtnode.toggleExpand();
					}
				}
				function _onLazyRead(dtnode, opt) {
					var _key = dtnode.data.key;
					var _child = _me._loadData(_key, dtnode.data.type, opt);
					dtnode.setLazyNodeStatus(DTNodeStatus_Ok);
					if (_child.length == 0) {
						dtnode.data.isLazy = false;
						dtnode.render();
					} else {
						dtnode.addChild(_child);
					}
				}

				$dwp.ui.tree.init(_$el, {
					children: _initLoadData(_opt)
					, islazy: true
					, treetype: _opt.treetype
					, seltype: _opt.seltype
					, checkbox: _opt.checkbox
					, noLink: true
					, clickFolderMode: 1
					, minExpandLevel: 1
					, selectMode: 2
					, onLazyRead: function (dtnode) { _onLazyRead(dtnode, _opt); }
					//,helper: "clone"
					, dnd: {
						/* 폴더는 드래그 안되게 */
						onDragStart: function (node) {
							if ((node.data.isFolder && _opt.seltype == "2") || (!node.data.isFolder && _opt.seltype == "1")) {
								return false;
							}
							if (!node.isSelected()) { node.select(true); }
							return true;
						}
					}
					, onActivate: _onActivate
					, onClick: _onClick
					//,onDeactivate : _onDeactivate
					, onDblClick: _opt._onDblClick
					, callback: function (tree) {
						//var _fullorgcode = $dwp.core.getCurUser().pinfo.fullorgcode + "," + $dwp.core.getCurUser().abnotesid
						//tree.loadKeyPath(_fullorgcode);
					}
				});
			}
			, _loadData: function (key, type, opt) {
				var _me = this, _key = key
					, _url = (type == "p") ? _me._CONST.P_URL : _me._CONST.G_URL;
				function _jsonGetParmData() {
					return {
						url: $fn.getProxyUrl(_url)
						, dataType: type == "p" ? "json" : "text"
						, async: false
						, cache: false
						, data: { category: "_Person_", count: 999 }
					};
				}
				//console.log("_jsonGetParmData()", _jsonGetParmData())
				return _me._getData(_jsonGetParmData(), opt);
			}
			, _getData: function (param, opt, issearch) {
				//console.log("opt", opt);
				var _me = this, _child = [], _issearch = issearch || false;
				$dwp.core.util.xAjax(param)
					.done(function (jdata) {
						if (typeof jdata == "string") {
							jdata = $.parseJSON(jdata);
						}
						if (jdata.length == 0) return _child;
						$(jdata).each(function (i, data) {
							var _org = new _$$.org.data.org(data._fullorginfo)
								, _row = {};
							if (data._type == "G") {
								_row.orgdata = _org.oinfo;
								_row.key = data._key;
								_row.pkey = data._pid;
								_row.title = $dwp.core.lang.getCurMsg(data._name);
								_row.type = data._type;
								_row.isFolder = true;
								_row.isLazy = false;
							} else if (data._type == "B") {
								_row.orgdata = _org.oinfo;
								_row.key = data._key;
								_row.pkey = data._pid;
								_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.orgname);
								//_row.unid = data["@unid"];
								_row.type = data._type;
								_row.isFolder = true;
								_row.isLazy = false;
							} else {
								if (opt.treetype == "0") {
									_row.orgdata = _org.oinfo;
									_row.key = data._key;
									_row.pkey = data._pid;
									_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.pos) + " " + $dwp.core.lang.getCurMsg(_org.oinfo.username.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
									//_row.unid = data["@unid"];
									_row.type = data._type;
									_row.isFolder = false;
									_row.isLazy = false;
								}
							}
							if (typeof (_row.orgdata) != "undefined") {
								if (_issearch) {
									_child.push(_row);
								} else {
									if (_row.pkey == "" || _child.length == 0) {
										_child.push(_row);
									} else {
										_$$.tree.addchild(_row.pkey, _child, _row);
									}
								}
							}
						});
					})
					.fail(function () {
						console.log("ERROR");
					});
				//console.log("_child", _child);
				return _child;
			}
			//조직도 검색
			, search: function (query, opt) {
				var _me = this;
				var _child = [];
				function _jsonGetParmData() {
					var _url = $fn.getProxyUrl(_me._CONST.S_URL)
						, _qry = query;

					return {
						url: _url
						, dataType: "json"
						, async: false
						, cache: false
						, data: { search: _qry, count: 250 }
					};
				}
				$dwp.core.util.xAjax(_jsonGetParmData())
					.done(function (jdata) {
						if (jdata.length == 0) return _child;
						$(jdata).each(function (i, data) {
							var _org = new _$$.org.data.org(data._fullorginfo), _row = {};
							if (data._type == "B") {
								_row.orgdata = _org.oinfo;
								_row.key = data._key;
								_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.orgname);
								//_row.unid = data["@unid"];
								_row.type = data._type;
							} else {
								if (opt.treetype == "0") {
									_row.orgdata = _org.oinfo;
									_row.key = data._key;
									_row.pkey = data._pid;
									_row.title = $dwp.core.lang.getCurMsg(_org.oinfo.pos) + " " + $dwp.core.lang.getCurMsg(_org.oinfo.username.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
									//_row.unid = data["@unid"];
									_row.type = data._type;
								}
							}
							if (typeof (_row.orgdata) != "undefined") {
								_child.push(_row);
							}
						});
					});
				return _child;
			}
		}
		//공용그룹
		, cgrouptree: {
			_CONST: {
				_ROOT_KEY: "_ROOT"
				, G_URL: "/dwp/com/sys/group_mn.nsf/api/data/collections/name/vMGroupTree"
			}
			, init: function (_$el, opt) {
				var _me = this
					, _opt = $.extend({
						rootkey: "_ROOT"
						, checkbox: true
						, hdata: []
					}, opt);

				var _$treeSiteArea = $("div.dwp-site-area", _$el.parents("div.dwp-tree-area"));
				if (_$treeSiteArea.size() > 0) {
					_$treeSiteArea.addClass("dwp-none");
				}

				function _defaultData() {
					var _child = [];
					_child.push({ key: _me._CONST._ROOT_KEY, pkey: "", title: $fn.getCodeMsg("공용그룹"), isFolder: true, isLazy: true, type: "C" });
					return _child;
				}

				function _initLoadData(opt) {
					var _child = null;
					_child = _defaultData();
					return _child;
				}

				function _onActivate(dtnode, event) {
					if (!_opt.checkbox) return true;
					//if(!dtnode.tree.isUserEvent()){return true;}
					if (!dtnode.isSelected()) {
						dtnode.deactivate();
					}
				}
				function _onClick(dtnode, event) {
					if (!_opt.checkbox) return true;
					//if(!dtnode.isActive()) return false;
					//_onActivate(dtnode, event);
					if (opt.seltype == "2" && dtnode.data.isFolder) return true;
					if (dtnode.getEventTargetType(event) == "title") {
						dtnode.toggleSelect();
						if (!dtnode.isSelected()) {
							dtnode.deactivate();
						}
						return true;
					}
				}
				function _onDeactivate(dtnode) {
					//if(!dtnode.tree.isUserEvent()){return true;}
					//console.log("dtnode", dtnode)
					if (dtnode.getEventTargetType(event) == "title") {
						dtnode.select(true);
						return true;
					}
				}
				function _onDblClick(dtnode) {
					if (dtnode.data.isFolder && _opt.seltype == "2") {
						dtnode.toggleExpand();
					}
				}
				function _onLazyRead(dtnode, opt) {
					var _key = dtnode.data.key;
					var _child = _me._loadData(_key, dtnode.data.type, opt);
					dtnode.setLazyNodeStatus(DTNodeStatus_Ok);
					if (_child.length == 0) {
						dtnode.data.isLazy = false;
						dtnode.render();
					} else {
						dtnode.addChild(_child);
					}
				}

				$dwp.ui.tree.init(_$el, {
					children: _initLoadData(_opt)
					, islazy: true
					, treetype: _opt.treetype
					, seltype: _opt.seltype
					, checkbox: _opt.checkbox
					, noLink: true
					, clickFolderMode: 1
					, minExpandLevel: 1
					, selectMode: 2
					, onLazyRead: function (dtnode) { _onLazyRead(dtnode, _opt); }
					//,helper: "clone"
					, dnd: {
						/* 폴더는 드래그 안되게 */
						onDragStart: function (node) {
							if ((node.data.isFolder && _opt.seltype == "2") || (!node.data.isFolder && _opt.seltype == "1")) {
								return false;
							}
							if (!node.isSelected()) { node.select(true); }
							return true;
						}
					}
					, onActivate: _onActivate
					, onClick: _onClick
					//,onDeactivate : _onDeactivate
					, onDblClick: _opt._onDblClick
					, callback: function (tree) {
						//var _fullorgcode = $dwp.core.getCurUser().pinfo.fullorgcode + "," + $dwp.core.getCurUser().abnotesid
						//tree.loadKeyPath(_fullorgcode);
					}
				});
			}
			, _loadData: function (key, type, opt) {
				var _me = this, _key = key
					, _url = _me._CONST.G_URL;
				function _jsonGetParmData() {
					return {
						url: $fn.getProxyUrl(_url)
						, dataType: "json"
						, async: false
						, cache: false
						//회사코드정보 변경 - 2019-04-04 By LHJ
						//,data : {category : $fn.getCurUser().pinfo.comcode, count : 999}
						, data: { category: $fn.getComCode(), count: 999 }
					};
				}
				//console.log("_jsonGetParmData()", _jsonGetParmData())
				return _me._getData(_jsonGetParmData(), opt);
			}
			, _getData: function (param, opt, issearch) {
				//console.log("opt", opt);
				var _me = this, _child = [], _issearch = issearch || false;
				$dwp.core.util.xAjax(param)
					.done(function (jdata) {
						if (jdata.length == 0) return _child;
						$(jdata).each(function (i, data) {
							var _org = new _$$.org.data.org(data._fullorginfo)
								, _row = {};
							_row.orgdata = _org.oinfo;
							_row.key = data._key;
							_row.pkey = data._pid;
							_row.title = $dwp.core.lang.getCurMsg(data._name);
							_row.type = "C";
							_row.isFolder = (data._type == "1");
							_row.isLazy = false;
							if (typeof (_row.orgdata) != "undefined") {
								if (_issearch) {
									_child.push(_row);
								} else {
									if (_row.pkey == "" || _row.pkey == _me._CONST._ROOT_KEY || _child.length == 0) {
										_child.push(_row);
									} else {
										_$$.tree.addchild(_row.pkey, _child, _row);
									}
								}
							}
						});
					})
					.fail(function () {
						console.log("ERROR");
					});
				//console.log("_child", _child);
				return _child;
			}
			//조직도 검색
			, search: function (query, opt) {
				var _me = this;
				var _child = [];
				function _jsonGetParmData() {
					var _url = $fn.getProxyUrl(_me._CONST.G_URL)
						, _qry = "";
					_qry += "(([Form] contains wMailGroup) and ";
					//회사코드정보 변경 - 2019-04-04 By LHJ
					//_qry += "([AuthCom] contains " + $fn.getCurUser().pinfo.comcode + ") and ";
					_qry += "([AuthCom] contains " + $fn.getComCode() + ") and ";
					_qry += "([Type] contains 2) and ";
					_qry += "([Name] contains " + query + "))"

					return {
						url: _url
						, dataType: "json"
						, async: false
						, cache: false
						, data: { search: _qry, count: 250 }
					};
				}
				$dwp.core.util.xAjax(_jsonGetParmData())
					.done(function (jdata) {
						if (jdata.length == 0) return _child;
						$(jdata).each(function (i, data) {
							if (data._type == "1") return true;
							var _org = new _$$.org.data.org(data._fullorginfo), _row = {};
							_row.orgdata = _org.oinfo;
							_row.key = data._key;
							_row.pkey = data._pid;
							_row.title = $dwp.core.lang.getCurMsg(data._name);
							_row.type = "C";

							if (typeof (_row.orgdata) != "undefined") {
								_child.push(_row);
							}
						});
					});
				return _child;
			}
		}
		// orgsel end
		, orgsel: {
			_MODULE_NM: "dwp.orgsel"
			, init: function (el, opt) {
				var _par = this, _$el = $(el),
					_opt = $.extend({}, opt);;

				if (typeof $.fn.orgsel == "undefined") {
					_par._create();
				}

				_$el.orgsel(_opt);

				return _$el.orgsel("instance");
			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						type: "multi"
						, treetype: "0"					// 0 : 부서 & 사용자, 1 : 부서
						, seltype: "0"					// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
						, exorgcode: ""					// 제외부서코드
						//회사코드정보 변경 - 2019-04-04 By LHJ
						//,comcode : $fn.getCurUser().pinfo.comcode
						, isall: false					// 일반사용만도 조회하는 여부
						, ismng: false
						, site: ""						// SCG Default사이트 	 2019-09-24 By LHJ
						, issiteselect: true			// SCG 사이트선택여부 	  2019-09-24 By LHJ
						, usesitelist: ""				// 사용할 사이트리스트 (공백이면 전체 사용)
						, usesite: false					// SCG 사이트 표시여부
						, nodetitle: { "B": "", "P": "" } 	// Tree node Title Foramt String 2019-10-01 By LHJ
						//,comcode : $fn.getComCode()
						, comcode: ''
						, hasconc: true					// 겸직포함 여부
						, isworker: false				// 생산직 여부
						, isgroup: false				// 그룹관리기능 사용여부(multi인 경우만 사용)
						, isgroupmng: false				// 그룹관리자자 여부
						, title: $fn.getCodeMsg("comm.title.js015")
						, fld: ""
						, count: 0
						, isedit: true
						, isseltype: true				// 사용자 및 부서 선택 여부
						, autodraw: true				// 선택 자동 등록
						, autoselectcheck: null			// 자동 선택 시, 사용자 체크함수
						, autoseletcomplete: null		// 자동 선택 시
						, orgselectcomplete: null		// 조직도 선택 완료 시, 처리함수 autodraw : True => 조직도, 자동 선택 시, 수행 False => 조직도 선택시 만 수행
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;

						_me._load();

						if (_me.options.isedit) {
							_me.createSel();
							_me.autocomplete();
							_me.sortable();
							_me.dialog();
						}
					}
					, _load: function () {
						var _me = this, _$namelist = $("div.namepicker-list", _me.element)
							, _$fld = null, _$fldfull = null, _vlist = [];

						_$fldfull = $("input[name='" + _me.options.fld + "Full']", _me.element);

						if (_$fldfull.size() > 0) {
							if ($.trim(_$fldfull.val()) != "") {
								_vlist = _$fldfull.val().split(";");
								//console.log("_vlist", _vlist);
								$.each(_vlist, function (i, v) {
									var _org = new _$$.org.data.org(v)
									_me.nameList(_org.oinfo);
								});
							}
						}
						console.log('_load complete')
					}
					, createSel: function () {
						var _me = this, _h = "";
						if (_me.options.isseltype) {
							_h = "<div class=\"select-group\"><div class=\"dwp-selectbox md\"><select></select></div></div>";
							$(_h).prependTo($("div[name='orgsel_group']", _me.element));
						}
					}
					, sortable: function () {
						var _me = this
							, _$namelist = $("div.namepicker-list", _me.element);

						if (!_me.options.autodraw) return;
						if (_me.options.ismobile) return;

						_$namelist.sortable({
							items: "> div.namepicker-target"
							, cursor: "pointer"
							, helper: "clone"
							//,scroll : false
							, start: function (event, ui) {
								var _w = ui.helper.width() + 2;
								ui.helper.width(_w);
							}
							, stop: function (event, ui) {
								_me.resetNameList();
							}
							//, forceHelperSize : true
						}).disableSelection();

					}
					// 선택항목 재 설정하기
					, resetNameList: function () {
						var _me = this
							, _$fld = null, _$fldfull = null, _$flddisp = null
							, _$namelist = $("div.namepicker-list", _me.element);

						if (_me.options.fld != "") {
							_$fld = $("input[name='" + _me.options.fld + "']", _me.element);
							if (_$fld.size() > 0) { _$fld.val(""); }

							_$fldfull = $("input[name='" + _me.options.fld + "Full']", _me.element);
							if (_$fldfull.size() > 0) { _$fldfull.val(""); }

							_$flddisp = $("input[name='" + _me.options.fld + "Disp']", _me.element);
							if (_$flddisp.size() > 0) { _$flddisp.val(""); }
						}

						$("div.namepicker-target", _$namelist).each(function () {
							var o = $(this).data("data-org")
								, _org = new _$$.org.data.org(o)
								, _val = "";
							// 값 설정하기
							if (_me.options.fld != "") {
								_$fld = $("input[name='" + _me.options.fld + "']", _me.element);
								if (_$fld.size() > 0) {
									_val = _$fld.val();
									if (_val == "") {
										_$fld.val(o.key);
									} else {
										_$fld.val(_val + ";" + o.key);
									}
								}
								_$fldfull = $("input[name='" + _me.options.fld + "Full']", _me.element);
								if (_$fldfull.size() > 0) {
									_val = _$fldfull.val();
									if (_val == "") {
										_$fldfull.val(_org.sinfo);
									} else {
										_$fldfull.val(_val + ";" + _org.sinfo);
									}
								}
								_$flddisp = $("input[name='" + _me.options.fld + "Disp']", _me.element);
								if (_$flddisp.size() > 0) {
									_val = _$flddisp.val();
									if (_val == "") {
										_$flddisp.val(_org.getDispNameLang());
									} else {
										_$flddisp.val(_val + ";" + _org.getDispNameLang());
									}
								}
							}
						});
					}
					// 선택항목 추가하기
					, nameList: function (item) {
						var _me = this
							, _$namelist = $("div.namepicker-list", _me.element)
							, _$nametarget = $("<div class='namepicker-target dwp-cursor'></div>").appendTo(_$namelist)
							, _$div = null
							, _org = new _$$.org.data.org(item);

						if (item.type == "B") {
							$("<span class='photo'><img src='" + $dwp.core.getPath("weblib") + "/images/common/default-team.svg'/></span>").appendTo(_$nametarget);
							$("<span class='name'>" + _org.getDispName() + "</span>").appendTo(_$nametarget);
						} else {
							_$div = $("<div class='dwp-cursor' da ta-type='profile' style='display:inline-block'></div>").appendTo(_$nametarget);
							$("<span class='photo'><img src='" + $dwp.core.getPath("pic", { empno: item.empno }) + "'/></span>").appendTo(_$div);
							$("<span class='name'>" + _org.getDispName() + "</span>")
								.appendTo(_$div);

							$fn.getPicError($("img", _$div));

							_$div.attr({ "data-empno": item.empno, "data-orgcode": item.orgcode })
								.off("click").on("click", function () {
									$dwp.ui.bizcard.init($(this), { ismobile: _me.options.ismobile });
								});
						}

						_$nametarget.data("data-org", item);

						if (_me.options.isedit) {
							$("<a class='btn-cancel'><img src='" + $dwp.core.getPath("weblib") + "/images/common/btn-cancel.svg'/></a>")
								.appendTo(_$nametarget)
								.off("click").on("click", function () {
									var _$item = $(this).parents('.namepicker-target')
										, _item = _$item.data("data-org")
										, _val = "", _vlist = []
										, _org = new _$$.org.data.org(_item)
										, _$fld = null, _$fldfull = null, _$flddisp = null;

									if (_me.options.fld != "") {
										_$fld = $("input[name='" + _me.options.fld + "']", _me.element);
										if (_$fld.size() > 0) {
											_vlist = _$fld.val().split(";");
											_val = $.map(_vlist, function (v, i) {
												if (v != _org.oinfo.key) {
													return v;
												}
											}).join(";");
											_$fld.val(_val);
										}
										_$fldfull = $("input[name='" + _me.options.fld + "Full']", _me.element);
										if (_$fldfull.size() > 0) {
											_vlist = _$fldfull.val().split(";");
											_val = $.map(_vlist, function (v, i) {
												if (v != _org.sinfo) {
													return v;
												}
											}).join(";");
											_$fldfull.val(_val);
										}
										_$flddisp = $("input[name='" + _me.options.fld + "Disp']", _me.element);
										if (_$flddisp.size() > 0) {
											_vlist = _$flddisp.val().split(";");
											_val = $.map(_vlist, function (v, i) {
												if (v != _org.getDispNameLang()) {
													return v;
												}
											}).join(";");
											_$flddisp.val(_val);
										}
									}
									_$item.remove();
								});
						}
					}
					// 자동완성 처리
					, autocomplete: function (_$el, opt) {
						var _me = this, _$sel = $("select", _me.element)
							, _stxtlist = $dwp.core.lang.getCodeMsg("comm.data.org_stype")
							, _dsel = ""
							, _opt = {
								autoFocus: true
								, minLength: 2
								, position: { my: "left top", at: "left bottom", collision: "flipfit" }
								, source: function (request, response) {
									//회사코드정보 변경 - 2019-04-04 By LHJ
									//var _data = {q : request.term.replace(/\)/g, "\\)").replace(/\(/g, "\\("), cc : $fn.getCurUser().pinfo.comcode};
									//var _data = {q : request.term.replace(/\)/g, "\\)").replace(/\(/g, "\\("), cc : $fn.getComCode()};
									//2019-11-01 By LHJ 전체검색 후, 검색결과에서 Site별로 제거함
									var _data = { q: request.term.replace(/\)/g, "\\)").replace(/\(/g, "\\("), cc: '' };

									function _getType(type) {
										switch (type) {
											case "0": return "p,d"; break;
											case "2": return "p"; break;
											case "1": return "d"; break;
										}
									}

									//계열사 표시 여부
									if (_me.options.hasOwnProperty("comcode")) { _data.cc = _me.options.comcode };

									_data.type = _getType(((_me.options.isseltype) ? _$sel.val() : _me.options.seltype));

									//생산직만 검색
									if (_me.options.isworker) { _data.ut = "0"; }

									var _defered = [], _response = [], _mrdata = [], _mdata = [];
									var _usesitelist = _me.options.usesitelist;
									_defered.push(
										$.getJSON("/dwprts/quicksearch", _data, function (data) {
											$.each(data.response.org, function (i, o) {
												// 해당사이트인지 체크
												/*
												var _comcategory = ( o._orgcode == '100001' ? 'scg' : o._comcategory == 'SCG' ? "scggrp" : "center");
												if (_me.options.usesitelist != "" && _usesitelist.indexOf(_comcategory) == -1) {
													return true;
												}
												*/
												o.type = "B";
												var _item = _$$.org.data.qsConvert(o)
													, _org = new _$$.org.data.org(_item);
												if (_me.options.exorgcode == "" || _me.options.exorgcode.indexOf(_org.oinfo.orgcode) == -1) {
													_response.push({ label: _org.getFDispName(), value: _item })
												}
											});
											$.each(data.response.person, function (i, o) {
												// 해당사이트인지 체크
												/*
												var _comcategory = ( o._orgcode == '100001' ? 'scg' : o._comcategory == 'SCG' ? "scggrp" : "center");
												if (_me.options.usesitelist != "" && _usesitelist.indexOf(_comcategory) == -1) {
													return true;
												}
												*/
												// 2021-08-31 겸직인 경우 제외
												if (!_me.options.hasconc && (o.hasOwnProperty("isconc") && o.isconc == "1") ) {
													return true;
												}
												o.type = "S";
												var _item = _$$.org.data.qsConvert(o)
													, _org = new _$$.org.data.org(_item);

												_response.push({ label: _org.getFDispName(), value: _item })
											});
											//response(_response);
										})
									);

									if (_me.options.hasOwnProperty("searchtype") == true) {			/* 메일에서 검색할 경우 최근수신인 및 개인주소록까지 검색해야 함*/
										if (_me.options.searchtype == "mail") {
											var _posturl = $dwp.core.util.getProxyUrl($fn.getPath("mail") + '/wcmdpost?createdocument');
											if (typeof ($dwp.app.mail.com.lastsendto) == "undefined") {
												_defered.push(
													$fn.cmdPostEx({
														url: _posturl
														, data: { actiontype: "lastsendto", "__Click": "1" }
														, dataType: "json"
													}).done(function (jdata) {
														$dwp.app.mail.com.lastsendto = jdata.SendTo;
														var _searchSend = $.grep(jdata.SendTo, function (orgdata) {
															if ($.trim(orgdata) != "") {
																var arrOrg = orgdata.split("^");
																return arrOrg[1].toLowerCase().indexOf(_data.q.toLowerCase()) != -1;
															}
														});
														$.each(_searchSend, function (i, o) {
															var _org = new _$$.org.data.org(o), _label = "";
															_label = _org.getDispName().replace(/&lt;/g, "<").replace(/&gt;/g, ">");
															_mrdata.push({ label: "<span class=\"dwp-recent-srch\"></span>" + _label, value: _org.getObject() });
															//_mrdata.push({label : _label, value : _org.getObject()});
														});
													})
												);
											} else {
												//$dwp.app.mail.com.lastsendto = jdata.SendTo;
												var _searchSend = $.grep($dwp.app.mail.com.lastsendto, function (orgdata) {
													if ($.trim(orgdata) != "") {
														var arrOrg = orgdata.split("^");
														return arrOrg[1].toLowerCase().indexOf(_data.q.toLowerCase()) != -1;
													}
												});
												$.each(_searchSend, function (i, o) {
													var _org = new _$$.org.data.org(o), _label = "";
													_label = _org.getDispName().replace(/&lt;/g, "<").replace(/&gt;/g, ">");
													_mrdata.push({ label: "<span class=\"dwp-recent-srch\"></span>" + _label, value: _org.getObject() });
													//_mrdata.push({label : _label, value : _org.getObject()});
												});
											}
											_defered.push(
												$fn.cmdPostEx({
													url: _posturl
													, data: { actiontype: "searchaddress", "__Click": "1", "Arg1": _data.q }
													, dataType: "json"
												}).done(function (data) {
													//console.log("searchdata >>>", data)
													$.each(data, function (i, o) {
														var _org = new _$$.org.data.org(o["_fullorginfo"]);
														_mdata.push({ label: "<span class=\"dwp-personal-addr\"></span>" + o["_name"], value: _org.getObject() });
														//_mdata.push({label : o["_name"], value : _org.getObject()});
													});
												})
											);
											//공용그룹검색 추가
											var _qry = "";
											_qry += "(([Form] contains wMailGroup) and ";
											//회사코드정보 변경 - 2019-04-04 By LHJ
											//_qry += "([AuthCom] contains " + $fn.getCurUser().pinfo.comcode + ") and ";
											_qry += "([AuthCom] contains " + $fn.getCurUser().pinfo.comcode + ") and ";
											_qry += "([Type] contains 2) and ";
											_qry += "([Name] contains " + _data.q + "))";

											_defered.push(
												$dwp.core.util.xAjax({
													url: $fn.getProxyUrl(_$$.org.cgrouptree._CONST.G_URL)
													, dataType: "json"
													, data: { search: _qry, count: 250 }
												}).done(function (data) {
													$.each(data, function (i, o) {
														var _org = new _$$.org.data.org(o["_fullorginfo"]);
														_mdata.push({ label: "<span class=\"dwp-personal-addr\"></span>" + o["_name"], value: _org.getObject() });
														//_mdata.push({label : o["_name"], value : _org.getObject()});
													});
												})
											);
										}
									}
									$.when.apply($, _defered).done(function () {
										//_response = [], _mrdata = [], _mdata =[]
										var _resp = [];

										if (_mrdata.length > 0) {
											_resp = _resp.concat(_mrdata);
										}
										if (_mdata.length > 0) {
											_resp = _resp.concat(_mdata);
										}
										if (_response.length > 0) {
											_resp = _resp.concat(_response);
										}
										response(_resp);
									});
									/*
									$.getJSON("/dwprts/quicksearch", _data, function(data) {
										var _response = [];
										$.each(data.response.org, function(i, o){
											o.type = "B";
											var _item = _$$.org.data.qsConvert(o)
											,_org = new _$$.org.data.org(_item);
											_response.push({label : _org.getDispName(), value : _item})
										});
										$.each(data.response.person, function(i, o){
											o.type = "S";
											var _item = _$$.org.data.qsConvert(o)
											,_org = new _$$.org.data.org(_item);

											_response.push({label : _org.getDispName(), value : _item})
										});
										response(_response);
									})
									*/
								}
								, response: function (event, ui) {
									//console.log(ui.content);
								}
								, focus: function (event, ui) {
									return false;
								}
								, select: function (event, ui) {
									var _item = null, _$namelist = null
										, _$nametarget = null, _$fld = null, _$fldfull = null, _$flddisp = null, _org = null, _val = "";

									//_item = _$$.org.data.qsConvert(ui.item.value);
									if (!_me.options.autodraw) {
										if (typeof _me.options.autoseletcomplete == "function") {
											_me.options.autoseletcomplete(event, ui, _me);
										}
										$("input[name='qsearch']", _me.element).val("");
										return false;
									}

									_item = ui.item.value;

									_$namelist = $("div.namepicker-list", _me.element)

									// 사용자 체크
									if (typeof _me.options.autoselectcheck == "function") {
										if (_me.options.autoselectcheck(event, ui, _me)) {
											$("input[name='qsearch']", _me.element).val(""); return false;
										}
									}
									// 중복 체크
									if (_me._dblChkNameList(_item)) { $("input[name='qsearch']", _me.element).val(""); return false; }

									// 건수 체크
									if (_me.options.count > 0) {
										if ($("div.namepicker-target", _$namelist).size() >= _me.options.count) {
											if (_me.options.count > 1) {
												$("input[name='qsearch']", _me.element).val(""); return false;
											} else {
												_me.delNameListItem();
											}
										}
									}

									_me.nameList(_item);

									// 값 설정하기
									if (_me.options.fld != "") {
										_$fld = $("input[name='" + _me.options.fld + "']", _me.element);
										if (_$fld.size() > 0) {
											_val = _$fld.val();
											if (_val == "") {
												_$fld.val(_item.key);
											} else {
												_$fld.val(_val + ";" + _item.key);
											}
										}
										_$fldfull = $("input[name='" + _me.options.fld + "Full']", _me.element);
										if (_$fldfull.size() > 0) {
											_org = new _$$.org.data.org(_item);
											_val = _$fldfull.val();
											if (_val == "") {
												_$fldfull.val(_org.sinfo);
											} else {
												_$fldfull.val(_val + ";" + _org.sinfo);
											}
										}
										_$flddisp = $("input[name='" + _me.options.fld + "Disp']", _me.element);
										if (_$flddisp.size() > 0) {
											_org = new _$$.org.data.org(_item);
											_val = _$flddisp.val();
											if (_val == "") {
												_$flddisp.val(_org.getDispNameLang());
											} else {
												_$flddisp.val(_val + ";" + _org.getDispNameLang());
											}
										}
									}

									$("input[name='qsearch']", _me.element).val("");

									if (typeof _me.options.orgselectcomplete == "function") {
										var _rtn = [];
										_rtn.push(_item);
										_me.options.orgselectcomplete(null, _rtn, _me);
									}

									return false;
								}
							};

						if (_me.options.isseltype) {
							if (_me.options.seltype == "0") { _dsel = "0,2,1"; }
							else if (_me.options.seltype == "1") { _dsel = "1"; }
							else if (_me.options.seltype == "2") { _dsel = "2"; }

							$.each(_dsel.split(","), function (i, v) {
								$("<option></option>").appendTo(_$sel)
									.text(_stxtlist[v])
									.val(v);
							});
						}

						_$$.autocomplete.init($("input[name='qsearch']", _me.element), _opt)
							._renderItem = function (ul, item) {
								return $("<li>")
									.append($("<div>").html(item.label))
									.appendTo(ul);
							};
						/*
						._renderItem = function(ul, item) {
							return $( "<li>" )
							.append( item.label )
							.appendTo( ul );
						};
						*/

						console.log('_autocomplete complete')
					}
					// 선택대상 전체리스트가져오기
					, getNameListItem: function () {
						var _me = this
							, _$namelist = $("div.namepicker-list", _me.element)
							, _rtn = [];

						$.each($("div.namepicker-target", _$namelist), function (i, o) {
							_rtn.push($(this).data("data-org"));
						});
						return _rtn;
					}
					// 선택대상 전체 삭제
					, delNameListItem: function () {
						var _me = this
							, _$namelist = $("div.namepicker-list", _me.element);

						$("div.namepicker-target", _$namelist).remove();

						if (_me.options.fld != "") {
							var _$fld = $("input[name='" + _me.options.fld + "']", _me.element);
							if (_$fld.size() > 0) {
								_$fld.val("");
							}
							var _$fldfull = $("input[name='" + _me.options.fld + "Full']", _me.element);
							if (_$fldfull.size() > 0) {
								_$fldfull.val("");
							}
							var _$flddisp = $("input[name='" + _me.options.fld + "Disp']", _me.element);
							if (_$flddisp.size() > 0) {
								_$flddisp.val("");
							}
						}

					}
					// 선택대상 중복 체크
					, _dblChkNameList: function (item) {
						var _me = this
							, _$namelist = $("div.namepicker-list", _me.element)
							, _rtn = false;

						$("div.namepicker-target", _$namelist).each(function () {
							var _item = $(this).data("data-org");
							if (_item.key == item.key) { _rtn = true; return false; }
						});
						return _rtn;
					}
					, _initDataLoad: function (_$dialog) {
						var _me = this;
						// Loading Data 처리
						$.each(_me.getNameListItem(), function (i, _item) {
							var _$gridlist = _$$.org._getGrid(_$dialog)
								, _$list = $(".dwp-list-body", _$gridlist)
								, _org = new _$$.org.data.org(_item)
								, _$item = $("<div class='dwp-item dwp-cursor org-type'>" + _org.getDispName() + "<button type='button' class='btn-cancel'>삭제</button></div>")
									.appendTo(_$list)
									.data("orgdata", _item);

							if (_item.type == "B") { _$item.addClass("is-folder"); }

							_$item.on("click", function (e) {
								if (e.currentTarget === this) {
									$(this).toggleClass("active");
								}
							});
							$("button", _$item).on("click", function () {
								$(this).parent().remove();
							});
						});
					}
					// 2019-10-21 By LHJ ADD Group Proc
					, _groupProc: function (_$dialog) {
						var _me = this;
						console.log("SIZE", $('div[name=act_groupsave]', _$dialog.element).size());
						$('div[name=act_groupsave]', _$dialog.element).click(function () {
							var _$gridlist = $dwp.ui.org._getGrid(_$dialog);
							if ($("div.dwp-item", _$gridlist).size() == 0) {
								$fn.alert({ msg: $fn.getCodeMsg("comm.msg.group_not_set") }); return false;
							}
							_me._groupSave(_$dialog);

						});

						$('div[name=act_groupload]', _$dialog.element).click(function () {
							_me._groupListLoad(_$dialog);
						});

					}
					, _groupSave: function (_$dialog) {
						var _me = this
							, _opt = {
								title: $fn.getCodeMsg("comm.title.groupsave")
								, width: 520
								, height: 240
								, modal: true
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: "/dwp/com/sys/orggrplist.nsf/wFrmGroupListSave?OpenForm" }
								, refdata: {}
								, initcallback: function (__$dialog) {
									if (!_me.options.isgroupmng) {
										$("input[name=grouplisttype]", __$dialog.element).prop("disabled", true);
									}
								}
								, buttons: [{
									title: $dwp.core.lang.getCodeMsg("comm.btn.confirm")
									, click: function (__$dialog) {
										var _$grouplisttype = $("input[name=grouplisttype]", __$dialog.element);
										var _$grouplistname = $("input[name=grouplistname]", __$dialog.element);
										if (_$grouplistname.xval() == "") {
											$fn.alert({ msg: $fn.getCodeMsg("comm.msg.groupnm") });
											_$grouplistname.focus();
											return false;
										}

										// 저장처리하기
										var _url = "/dwp/com/sys/orggrplist.nsf/wcmdpost?createdocument";
										var _data = {};
										_data.actiontype = "GroupListSave";
										_data.GroupListName = _$grouplistname.xval();
										_data.GroupListType = _$grouplisttype.xval();
										_data.GroupList = "";

										var _rtn = $dwp.ui.org._getGridData(_$dialog);
										$.each(_rtn.list, function (i, o) {
											var _org = new _$$.org.data.org(o);
											if (_data.GroupList == "") {
												_data.GroupList = _org.sinfo;
											} else {
												_data.GroupList = _data.GroupList + ";" + _org.sinfo;
											}
										});

										function _callback(data) {
											if (data.hasOwnProperty("result")) {
												if (data.result >= "200" && data.result < "300") {
													//
													var _$gridlist = $dwp.ui.org._getGrid(_$dialog);

													var _h = "<div class='dwp-grouping'>";
													_h += "<div class='open-line-name'><b>" + (_data.GroupListType == "0" ? $fn.getCodeMsg("comm.title.public") : $fn.getCodeMsg("comm.title.personal")) + ' : </b>' + _data.GroupListName + '</div>';
													if (_data.GroupListType == "1" || (_data.GroupListType == "0" && _me.options.isgroupmng)) {
														_h += "<div class='dwp-btn option'><span id='button'>" + $fn.getCodeMsg('comm.title.edit') + '</span></div>';
													}
													_h += '</div>';

													$("div.left", _$gridlist).empty();
													var _$item = $(_h).appendTo($("div.left", _$gridlist));

													$("div.dwp-btn", _$item).off("click").on("click", function () {
														if ($("div.dwp-item", _$gridlist).size() == 0) {
															$fn.alert({ msg: $fn.getCodeMsg("comm.msg.group_not_set") }); return false;
														}
														_me._groupEditSave(data.docid, _$dialog);
													});

													$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg029") })
													__$dialog.close();
												} else {
													//error
													$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) })
														.done(function () {
															__$dialog.close();
														});
												}
											} else {
												//error
											}
										}

										$fn.cmdPost(_url, _data, _callback, 'json');

									}
								}
									, {
									title: $dwp.core.lang.getCodeMsg("comm.btn.cancel")
									, click: function (_$dialog) {
										_$dialog.close();
									}
								}]
							};
						$dwp.ui.dialog.init(_me.element, _opt);
					}
					, _groupEditSave: function (unid, _$dialog) {
						var _me = this;

						// 저장처리하기
						var _url = "/dwp/com/sys/orggrplist.nsf/wcmdpost?createdocument";
						var _data = {};
						_data.actiontype = "GroupListEditSave";
						_data.unid = unid;
						_data.GroupList = "";

						var _rtn = $dwp.ui.org._getGridData(_$dialog);
						if (_rtn.list.length == 0) {
							$fn.alert({ msg: $fn.getCodeMsg("comm.msg.group_not_set") });
							return;
						}
						$.each(_rtn.list, function (i, o) {
							var _org = new _$$.org.data.org(o);
							if (_data.GroupList == "") {
								_data.GroupList = _org.sinfo;
							} else {
								_data.GroupList = _data.GroupList + ";" + _org.sinfo;
							}
						});

						function _callback(data) {
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									//
									$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg029") })
								} else {
									//error
									$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
								}
							} else {
								//error
							}
						}

						$fn.cmdPost(_url, _data, _callback, 'json');
					}
					, _groupDel: function (unid, type, _$dialog) {
						var _me = this;

						// 저장처리하기
						var _url = "/dwp/com/sys/orggrplist.nsf/wcmdpost?createdocument";
						var _data = {};
						_data.actiontype = "GroupListDelete";
						_data.unid = unid;
						_data.GroupList = "";

						function _callback(data) {
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									//
									$(".dwp-tabs-simple", _$dialog.element).tabs("load", (type == "1" ? 0 : 1));
									$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg0041") })
								} else {
									//error
									$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
								}
							} else {
								//error
							}
						}

						$fn.cmdPost(_url, _data, _callback, 'json');
					}
					, _groupListLoad: function (_$dialog) {
						var _me = this
							, _opt = {
								title: $fn.getCodeMsg("comm.title.grouplist")
								, width: 520
								//,height : 240
								, modal: true
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: "/dwp/com/sys/orggrplist.nsf/wFrmGroupList?OpenForm" }
								, refdata: {}
								, initcallback: function (__$dialog) {
									//TAB 초기화
									$(".dwp-tabs-simple", __$dialog.element).tabs({
										active: 0
										, beforeLoad: function (event, ui) {
											ui.ajaxSettings.dataType = "json";
											ui.ajaxSettings.dataFilter = function (data) {
												var jsonData = $.parseJSON(data);
												renderList(jsonData, ui);
											};
										}
									});

									function renderList(jdata, ui) {
										var _h = ""
											, _$list = $('div.list', __$dialog.element);

										_$list.empty();

										$.each(jdata, function (i, o) {

											// 데이터 변경사항이 있는경우 색상표기
											_h = "<div class='item " + (o._changed == '1' ? "changed" : "") + "'>";
											// 유형
											//_h += "<div class='category'><a>" + (o._type == '0' ? $fn.getCodeMsg("comm.title.public") : $fn.getCodeMsg("comm.title.personal")) + '</a></div>';
											// 그룹명
											_h += "<div class='subject'><a>" + o._name + '</a></div>';
											_h += "<div class='biz'><a><span data-type='profile' data-empno='" + o._authorempno + "' data-orgcode='" + o._authororgcode + "'>";
											_h += "<img src='" + $fn.getPath('weblib') + "/images/common/icon-namecard.svg' alt=''></span></a></div>";
											_h += "<div class='date'><a>" + $fn.formatDateTime(o._lasteditdate, 'dateonly') + '</a></div>';
											if (o._type == "1" || (o._type == "0" && _me.options.isgroupmng)) {
												_h += "<div class='del-area'><a><img src='" + $fn.getPath('weblib') + "/images/common/btn-cancel.svg' alt=''></a></div>";
											}
											_h += '</div>';

											var _$item = $(_h).appendTo(_$list);
											_$item.data("_ITEM_DATA", o);

											_$item.off("click").on("click", function (e) {
												if (e.currentTarget === this) {
													$('div.active', $(this).parent()).removeClass('active');
													$(this).toggleClass('active');
												}
											});

											_$item.off("dblclick").on("dblclick", function (e) {
												if (e.currentTarget === this) {
													_me._groupLoad(o["@unid"], __$dialog, _$dialog);
												}
											});

											/* BizCard 처리 */
											$("[data-type='profile']", _$item).off('click').on('click', function () {
												$dwp.ui.bizcard.init($(this));
											});

											// 삭제처리
											$("div.del-area", _$item).off('click').on('click', function () {
												$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.group_del") })
													.done(function () {
														_me._groupDel(o["@unid"], o._type, __$dialog);
													});
											});

										});
									}
								}
								, buttons: [{
									title: $dwp.core.lang.getCodeMsg("comm.btn.confirm")
									, click: function (__$dialog) {
										var _o = $("div.item.active", __$dialog.element).data("_ITEM_DATA");

										_me._groupLoad(_o["@unid"], __$dialog, _$dialog);
										//__$dialog.close();
									}
								}
									, {
									title: $dwp.core.lang.getCodeMsg("comm.btn.cancel")
									, click: function (__$dialog) {
										__$dialog.close();
									}
								}]
							};
						$dwp.ui.dialog.init(_me.element, _opt);

					}
					, _groupLoad: function (unid, __$dialog, _$dialog) {
						var _me = this;

						var _url = "/dwp/com/sys/orggrplist.nsf/wcmdpost?createdocument";
						var _data = {};
						_data.actiontype = "GroupListData";
						_data.unid = unid;
						_data.GroupList = "";

						function _callback(data) {
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									console.log(data);

									var _$gridlist = $dwp.ui.org._getGrid(_$dialog);

									var _h = "<div class='dwp-grouping'>";
									_h += "<div class='open-line-name'><b>" + (data.type == "0" ? $fn.getCodeMsg("comm.title.public") : $fn.getCodeMsg("comm.title.personal")) + ' : </b>' + data.name + '</div>';
									if (data.type == "1" || (data.type == "0" && _me.options.isgroupmng)) {
										_h += "<div class='dwp-btn option'><span id='button'>" + $fn.getCodeMsg('comm.title.edit') + '</span></div>';
									}
									_h += '</div>';

									$("div.left", _$gridlist).empty();
									var _$item = $(_h).appendTo($("div.left", _$gridlist));

									$("div.dwp-btn", _$item).off("click").on("click", function () {
										if ($("div.dwp-item", _$gridlist).size() == 0) {
											$fn.alert({ msg: $fn.getCodeMsg("comm.msg.group_not_set") }); return false;
										}
										_me._groupEditSave(data.docid, _$dialog);
									});

									$("div.dwp-item", _$gridlist).remove();

									var _rtn = data.grouplist.split(";");
									$.each(_rtn, function (i, o) {
										var _node = {};
										var _org = new _$$.org.data.org(o);
										_node.data = {};
										_node.data.key = (_org.oinfo.type == "B" ? _org.oinfo.orgcode : _org.oinfo.notesid);
										_node.data.type = _org.oinfo.type;
										_node.data.orgdata = _org.oinfo;

										$dwp.ui.org._addListItem(_$dialog, _node, false);
									});

									__$dialog.close();
								} else {
									//error
									$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
								}
							} else {
								//error
							}
						}

						$fn.cmdPost(_url, _data, _callback, 'json');
					}
					, _onSelect: function (_$dialog, _rtn) {
						var _me = this
							, _$fld = null, _$fldfull = null, _$flddisp = null, _val = "";

						if (!_me.options.autodraw) {
							if (typeof _me.options.orgselectcomplete == "function") {
								_me.options.orgselectcomplete(_$dialog, _rtn, _me);
							}
						} else {
							_me.delNameListItem();
							$.each(_rtn, function (i, o) {
								_me.nameList(o);
								// 값 설정하기
								if (_me.options.fld != "") {
									_$fld = $("input[name='" + _me.options.fld + "']", _me.element);
									if (_$fld.size() > 0) {
										_val = _$fld.val();
										if (_val == "") {
											_$fld.val(o.key);
										} else {
											_$fld.val(_val + ";" + o.key);
										}
									}
									_$fldfull = $("input[name='" + _me.options.fld + "Full']", _me.element);
									if (_$fldfull.size() > 0) {
										_org = new _$$.org.data.org(o);
										_val = _$fldfull.val();
										if (_val == "") {
											_$fldfull.val(_org.sinfo);
										} else {
											_$fldfull.val(_val + ";" + _org.sinfo);
										}
									}
									_$flddisp = $("input[name='" + _me.options.fld + "Disp']", _me.element);
									if (_$flddisp.size() > 0) {
										_org = new _$$.org.data.org(o);
										_val = _$flddisp.val();
										if (_val == "") {
											_$flddisp.val(_org.getDispNameLang());
										} else {
											_$flddisp.val(_val + ";" + _org.getDispNameLang());
										}
									}
								}
							});

							if (typeof _me.options.orgselectcomplete == "function") {
								_me.options.orgselectcomplete(_$dialog, _rtn, _me);
							}
						}
					}
					// 조직도 선택창 표시
					, dialog: function () {
						var _me = this
							, _$btn = $("div[name='orgsel_btn']", _me.element);
						_$btn.off("click").on("click", function () {
							if (_me.options.type == "multi") {
								_me._multi($(this));
							} else if (_me.options.type == "single") {
								_me._single($(this));
							}
						});
					}
					, _single: function (_$el) {
						var _me = this
							//,_$namelist = $("div.namepicker-list", _me.element)
							, _opt = {
								title: _me.options.title
								, refdata: {
									type: "single"
									, tabidx: 0
									, tab: [{ title: $fn.getCodeMsg("comm.title.js016"), tree: 0 }]
									, tree: [{
										type: "org"
										, treetype: _me.options.treetype		// 0 : 부서 & 사용자, 1 : 부서
										, seltype: _me.options.seltype			// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
										, exorgcode: _me.options.exorgcode		// 제외부서코드
										, ismng: _me.options.ismng				// 관리자여부
										, isall: _me.options.isall
										, comcode: _me.options.comcode			// 회사코드
										// 2019-09-24 By LHJ
										, site: _me.options.site
										, issiteselect: _me.options.issiteselect
										, usesitelist: _me.options.usesitelist
										, usesite: _me.options.usesite
										, nodetitle: _me.options.nodetitle		// Tree node Title Foramt String 2019-10-01 By LHJ
										, checkbox: false
										, selectMode: 1
										, onDblClick: function (_$dialog, dtnode) {
											var _rtn = [];
											if (dtnode.hasOwnProperty("data")) {
												_rtn.push(dtnode.data.orgdata);
											} else {
												_rtn.push(dtnode);
											}
											_me._onSelect(_$dialog, _rtn);
											_$dialog.close();
										}
										, islazy: true
									}]
									, initload: null
								}
								, buttons: [{
									title: $dwp.core.lang.getCodeMsg("comm.btn.confirm")
									, click: function (_$dialog) {
										// 환경설정 값 적용하기
										var _rtn = _$$.org._getSingleData(_$dialog);
										_me._onSelect(_$dialog, _rtn);
										/*
										if (! _me.options.autodraw) {
											if ( typeof _me.options.orgselectcomplete == "function" ) {
												_me.options.orgselectcomplete(_$dialog, _rtn, _me);
											}
										} else {
											_me.delNameListItem();
											$.each(_rtn.list, function(i, o){
												_me.nameList(o);
												// 값 설정하기
												if (_me.options.fld != "") {
													_$fld = $("input[name='" + _me.options.fld +"']", _me.element);
													if (_$fld.size() > 0) {
														_val = _$fld.val();
														if ( _val == "") {
															_$fld.val(o.key);
														} else {
															_$fld.val(_val + ";" +o.key);
														}
													}
													_$fldfull = $("input[name='" + _me.options.fld +"Full']", _me.element);
													if (_$fldfull.size() > 0) {
														_org = new _$$.org.data.org(o);
														_val = _$fldfull.val();
														if ( _val == "") {
															_$fldfull.val(_org.sinfo);
														} else {
															_$fldfull.val(_val + ";" +_org.sinfo);
														}
													}
												}
											});
										}
										*/
										_$dialog.close();
									}
								}
									, {
									title: $dwp.core.lang.getCodeMsg("comm.btn.cancel")
									, click: function (_$dialog) {
										_$dialog.close();
									}
								}]
							};
						//console.log("tree", _me.options.treetype);
						//console.log("sel", _me.options.seltype);
						//console.log("opt", _opt);
						_opt.refdata.tree[0].treetype = _me.options.treetype;
						_opt.refdata.tree[0].seltype = _me.options.seltype;
						_opt._innercall = true;
						//console.log("opt", _opt);
						_$$.org.orgsselect.init(_$el, _opt);
					}
					, _multi: function (_$el) {
						var _me = this
							//,_$namelist = $("div.namepicker-list", _me.element)
							, _opt = {
								title: _me.options.title
								, refdata: {
									type: "multi"
									, tabidx: 0
									, tab: [{ title: $fn.getCodeMsg("comm.title.js016"), tree: 0, button: 0, grid: 0 }]
									, button: [
										[
											{ id: "gridadd", title: $fn.getCodeMsg("comm.title.js017"), css: "btn-add" }
											, { id: "griddel", title: $fn.getCodeMsg("comm.title.js018"), css: "btn-del" }
											, { id: "gridadel", title: $fn.getCodeMsg("comm.title.js019"), css: "btn-all-del" }
										]
									]
									, grid: [{ type: "list", title: $fn.getCodeMsg("comm.title.js020"), prop: "list", count: _me.options.count }]
									, tree: [{
										type: "org"
										, treetype: _me.options.treetype	// 0 : 부서 & 사용자, 1 : 부서
										, seltype: _me.options.seltype		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
										, exorgcode: _me.options.exorgcode	// 제외부서코드
										, ismng: _me.options.ismng			// 관리자여부
										, isall: _me.options.isall
										, comcode: _me.options.comcode		// 회사코드
										// 2019-09-24 By LHJ
										, site: _me.options.site
										, issiteselect: _me.options.issiteselect
										, usesitelist: _me.options.usesitelist
										, usesite: _me.options.usesite
										, nodetitle: _me.options.nodetitle	// Tree node Title Foramt String 2019-10-01 By LHJ
										// 2019-09-24 - E
										, islazy: true
									}]
									, initload: function (_$dialog) {
										_me._initDataLoad.call(_me, _$dialog);

										if (_me.options.isgroup) {
											_me._groupProc.call(_me, _$dialog);
										}
									}
								}
								, buttons: [{
									title: $dwp.core.lang.getCodeMsg("comm.btn.confirm")
									, click: function (_$dialog) {
										// 환경설정 값 적용하기
										var _rtn = _$$.org._getGridData(_$dialog);

										if (!_me.options.autodraw) {
											if (typeof _me.options.orgselectcomplete == "function") {
												_me.options.orgselectcomplete(_$dialog, _rtn, _me);
											}
										} else {
											_me.delNameListItem();
											var _$fld = null, _$fldfull = null, _$flddisp = null, _val = "", _org = null;
											$.each(_rtn.list, function (i, o) {
												_me.nameList(o);
												// 값 설정하기
												if (_me.options.fld != "") {
													_$fld = $("input[name='" + _me.options.fld + "']", _me.element);
													if (_$fld.size() > 0) {
														_val = _$fld.val();
														if (_val == "") {
															_$fld.val(o.key);
														} else {
															_$fld.val(_val + ";" + o.key);
														}
													}
													_$fldfull = $("input[name='" + _me.options.fld + "Full']", _me.element);
													if (_$fldfull.size() > 0) {
														_org = new _$$.org.data.org(o);
														_val = _$fldfull.val();
														if (_val == "") {
															_$fldfull.val(_org.sinfo);
														} else {
															_$fldfull.val(_val + ";" + _org.sinfo);
														}
													}
													_$flddisp = $("input[name='" + _me.options.fld + "Disp']", _me.element);
													if (_$flddisp.size() > 0) {
														_org = new _$$.org.data.org(o);
														_val = _$flddisp.val();
														if (_val == "") {
															_$flddisp.val(_org.getDispNameLang());
														} else {
															_$flddisp.val(_val + ";" + _org.getDispNameLang());
														}
													}
												}
											});
											if (typeof _me.options.orgselectcomplete == "function") {
												_me.options.orgselectcomplete(_$dialog, _rtn, _me);
											}
										}
										_$dialog.close();
									}
								}
									, {
									title: $dwp.core.lang.getCodeMsg("comm.btn.cancel")
									, click: function (_$dialog) {
										_$dialog.close();
									}
								}]
							};
						if (_me.options.hasOwnProperty("refdata")) {
							_opt.refdata = $.extend(_opt.refdata, _me.options.refdata);
						}

						// 2019-10-21 By LHJ ADD Group List
						if (_me.options.isgroup) {
							_opt.refdata.button[0].unshift({
								id: "centeradd", title: $fn.getCodeMsg("센터전체"), css: "btn-add", click: function (_$dialog, id) {
									var _url = $dwp.core.getPath("org") + "/api/data/collections/name/wViwCOrgList";

									function _jsonGetParmData() {
										return {
											url: _url,
											dataType: "json",
											async: false,
											cache: false
											, data: { category: $dwp.ui.org.tree._CONST._ROOT_KEY, count: 999 }
										};
									}

									var _$gridlist = $dwp.ui.org._getGrid(_$dialog);
									$("div.dwp-item", _$gridlist).remove();

									var _rtn = $dwp.ui.org.tree._getData(_jsonGetParmData(), _$dialog.options.refdata.tree[0], false);
									$.each(_rtn, function (i, o) {
										var _node = {};
										_node.data = $.extend({}, o);
										$dwp.ui.org._addListItem(_$dialog, _node, false);
									});
								}
							});
							_$$.org.orgwork.init(_$el, _opt);
						} else {
							_$$.org.orgmselect.init(_$el, _opt);
						}
					}
					// End
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
		}
		// orgsel end
		, orgsselect: {
			_MODULE_NM: "dwp.orgsselect"
			, init: function (el, opt) {
				var _par = this, _$el = $(el),
					_opt = $.extend({}, opt);

				if (typeof $.fn.orgsselect == "undefined") {
					_par._create();
				}
				console.log("__OPT", _opt);
				_$el.orgsselect(_opt);

				return _$el.orgsselect("instance");
			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						title: $fn.getCodeMsg("comm.title.js021")
						, fld: ""
						, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
						, seltype: "0"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
						//회사코드정보 변경 - 2019-04-04 By LHJ
						//,comcode : $fn.getCurUser().pinfo.comcode
						, comcode: $fn.getComCode()
						, ismng: false
						, isall: false
						// 2019-09-24 By LHJ
						, site: ""
						, issiteselect: true
						, usesitelist: ""
						, usesite: false
						, nodetitle: { "B": "", "P": "" }		// Tree node Title Foramt String 2019-10-01 By LHJ
						// 2019-09-24 - E
						, isedit: true
						, ismobile: false
						, selcallback: null
						, _innercall: false
						, refdata: {
							type: "single"
							, tabidx: 0
							, tab: [{ title: $fn.getCodeMsg("comm.title.js016"), tree: 0 }]
							, tree: [{
								type: "org"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "0"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, checkbox: false
								, islazy: true
								, userDblClick: function (_$dialog, dtnode) {
									var _rtn = _$$.org._getSingleData(_$dialog);
									if (_rtn.length == 0) return;

									var _org = new _$$.org.data.org(_rtn[0]);

									if (_$dialog.options.fld != "") {
										var _$fld = $("input[name='" + _$dialog.options.fld + "']", _$dialog.element);
										_$fld.val(_org.oinfo.key);

										_$fld = $("input[name='" + _$dialog.options.fld + "Full']", _$dialog.element);
										if (_$fld.size() > 0) {
											_$fld.val(_org.sinfo);
										}

										_$fld = $("input[name='" + _$dialog.options.fld + "Disp']", _$dialog.element);
										if (_$fld.size() > 0) {
											_$fld.val(_org.getDispName())
										}
									}
									if (typeof _$dialog.options.selcallback == "function") {
										_$dialog.options.selcallback(_org, _$dialo);
									}
									_$dialog.close();
								}
							}]
							, initload: function () { console.log("initload"); }
						}
						//,buttons : null
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;

						if (!_me.options._innercall) {
							_me.options.refdata.tree[0].treetype = _me.options.treetype;
							_me.options.refdata.tree[0].seltype = _me.options.seltype;
							_me.options.refdata.tree[0].comcode = _me.options.comcode;
							_me.options.refdata.tree[0].ismng = _me.options.ismng;
							_me.options.refdata.tree[0].isall = _me.options.isall;
							// 2019-09-24 By LHJ
							_me.options.refdata.tree[0].site = _me.options.site;
							_me.options.refdata.tree[0].issiteselect = _me.options.issiteselect;
							_me.options.refdata.tree[0].usesite = _me.options.usesite;
							_me.options.refdata.tree[0].nodetitle = _me.options.nodetitle;
							_me.options.refdata.tree[0].usesitelist = _me.options.usesitelist;
							// 2019-09-24 - E
						}

						_me._dialog();
					}
					, _dialog: function () {
						var _me = this
							, _opt = $.extend({
								title: ""
								//,width : 400
								//,height : 600
								, width: (_me.options.ismobile ? "100%" : 400)
								, height: (_me.options.ismobile ? "auto" : 600)
								, modal: true
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: (_me.options.ismobile ? $fn.getPath("gwlib") + "/worgsselect_mo?readform" : $fn.getPath("gwlib") + "/worgsselect?readform") }
								, refdata: {}
								, initcallback: function (_$dialog) {
									_$$.org.initdialog(_$dialog);
								}
								, buttons: [{
									title: $dwp.core.lang.getCodeMsg("comm.btn.confirm")
									, click: function (_$dialog) {
										var _rtn = _$$.org._getSingleData(_$dialog);
										if (_rtn.length == 0) return;

										var _org = new _$$.org.data.org(_rtn[0])

										if (_$dialog.options.fld != "") {
											var _$fld = $("input[name='" + _$dialog.options.fld + "']", _me.element);
											_$fld.val(_org.oinfo.key);

											_$fld = $("input[name='" + _$dialog.options.fld + "Full']", _me.element);
											if (_$fld.size() > 0) {
												_$fld.val(_org.sinfo);
											}

											_$fld = $("input[name='" + _$dialog.options.fld + "Disp']", _me.element);
											if (_$fld.size() > 0) {
												_$fld.val(_org.getDispName())
											}
										}

										if (typeof _me.options.selcallback == "function") {
											_me.options.selcallback(_org, _$dialog);
										}
										_$dialog.close();
									}
								}
									, {
									title: $dwp.core.lang.getCodeMsg("comm.btn.cancel")
									, click: function (_$dialog) {
										_$dialog.close();
									}
								}]
							}, _me.options);
						console.log("opt", _opt);
						$dwp.ui.dialog.init(_me.element, _opt);
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
		}
		// orgsselect end
		// 다중 선택 지정 처리
		, orgmselect: {
			_MODULE_NM: "dwp.orgmselect"
			, init: function (el, opt) {
				var _par = this, _$el = $(el),
					_opt = $.extend({}, opt);;

				if (typeof $.fn.orgmselect == "undefined") {
					_par._create();
				}

				_$el.orgmselect(_opt);

				return _$el.orgmselect("instance");
			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						title: $fn.getCodeMsg("comm.title.js021")
						, fld: ""
						, isedit: true
						, refdata: {
							type: "multi"
							, tabidx: 0
							, tab: [{ title: $fn.getCodeMsg("comm.title.js016"), tree: 0, button: 0, grid: 0 }]
							, button: [
								[
									{ id: "gridadd", title: $fn.getCodeMsg("comm.title.js017"), css: "btn-add" }
									, { id: "griddel", title: $fn.getCodeMsg("comm.title.js018"), css: "btn-del" }
									, { id: "gridadel", title: $fn.getCodeMsg("comm.title.js019"), css: "btn-all-del" }
								]
							]
							, grid: [{ type: "list", title: $fn.getCodeMsg("comm.title.js020"), prop: "list", count: 10 }]
							, tree: [{
								type: "org"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "2"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, checkbox: false
								, islazy: true
							}]
							, initload: function () {
								console.log("initload");
							}
						}
						, buttons: [{
							title: $dwp.core.lang.getCodeMsg("comm.btn.confirm")
							, click: function (_$dialog) {
								var _rtn = _$$.org._getGridData(_$dialog);

								//console.log("rtn", _rtn);
								_$dialog.close();
							}
						}
							, {
							title: $dwp.core.lang.getCodeMsg("comm.btn.cancel")
							, click: function (_$dialog) {
								_$dialog.close();
							}
						}]
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;

						_me._dialog();

					}
					, _dialog: function () {
						var _me = this
							, _opt = $.extend({
								title: ""
								, width: 928
								, height: 600
								, modal: true
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: $fn.getPath("gwlib") + "/worgselectn?readform" }
								, refdata: {}
								, initcallback: function (_$dialog) {
									_$$.org.initdialog(_$dialog);
								}
								, buttons: null
							}, _me.options);
						$dwp.ui.dialog.init(_me.element, _opt);
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
		}
		// orgsel end
		// 결재선 지정 처리
		, aprvline: {
			_MODULE_NM: "dwp.aprvline"
			, init: function (el, opt) {
				var _par = this, _$el = $(el),
					_opt = $.extend({}, opt);;

				if (typeof $.fn.aprvline == "undefined") {
					_par._create();
				}

				_$el.aprvline(_opt);

				return _$el.aprvline("instance");
			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						title: ""
						, fld: ""
						, isedit: true
						, refdata: {
							type: "appline"
							, tabidx: 0
							, tab: [{ title: "결재선", tree: 0, button: 0, grid: 0 }
								, { title: "수신부서", tree: 0, button: 1, grid: 1 }]
							, button: [
								[
									{ id: "aprvadd", title: "결재추가", css: "btn-add approval", click: function () { } }
									, { id: "aprvdel", title: "합의추가", css: "btn-del consent", click: function () { } }
									, { id: "aprvadel", title: "모두삭제", css: "btn-all-del", click: function () { } }
									, {
										id: "aprvupdown", type: "group"
										, children: [
											{ id: "aprvup", title: "위로", css: "icon up-style", icon: $fn.getPath("weblib") + "/images/common/up-arrow.svg", click: function () { } }
											, { id: "aprvdown", title: "아래로", css: "icon down-style", icon: $fn.getPath("weblib") + "/images/common/down-arrow.svg", click: function () { } }
										]
									}
								]
								, [
									{ id: "gridadd", title: "추가", css: "btn-add" }
									, { id: "griddel", title: "삭제", css: "btn-del" }
									, { id: "gridadel", title: "모두삭제", css: "btn-all-del" }
								]
							]
							, grid: [{
								type: "aprv", title: "결재선", prop: "aprv"
								, children: [{ type: "aprv", title: "결재선", prop: "AP", selector: "div.approval-body", drop: function (event, ui, element) { console.log("drop", ui) } }
									, { type: "aprv", title: "결재선", prop: "AR", selector: "div.consent-body", drop: function () { } }]
							}
								, { type: "list", title: "부서", prop: "list", count: 10 }]
							, tree: [{
								type: "org"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "2"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, islazy: true
							}]
							, initload: function () { console.log("initload"); }
						}
						, buttons: [{
							title: $dwp.core.lang.getCodeMsg("확인")
							, click: function (_$dialog) {
								var _rtn = _$$.org._getGridData(_$dialog);

								//	console.log("rtn", _rtn);

								if (_$dialog.options.fld != "") {
									_$fld = $("input[name='" + _$dialog.options.fld + "']", _$dialog.element);

								}
								_$dialog.close();
							}
						}
							, {
							title: $dwp.core.lang.getCodeMsg("취소")
							, click: function (_$dialog) {
								_$dialog.close();
							}
						}]
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;

						_me._dialog();

					}
					, _dialog: function () {
						var _me = this
							, _opt = $.extend({
								title: "결재선 지정"
								, width: 928
								, height: 600
								, modal: true
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: $fn.getPath("gwlib") + "/waprvline_n?readform" }
								, refdata: {}
								, initcallback: function (_$dialog) {
									_$$.org.initdialog(_$dialog);
								}
								, buttons: null
							}, _me.options);
						$dwp.ui.dialog.init(_me.element, _opt);
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
		}
		// aprv end
		, aprvline_mo: {
			_MODULE_NM: "dwp.aprvline_mo"
			, init: function (el, opt) {
				var _par = this, _$el = $(el),
					_opt = $.extend({}, opt);;

				if (typeof $.fn.aprvline == "undefined") {
					_par._create();
				}

				_$el.aprvline_mo(_opt);

				return _$el.aprvline_mo("instance");
			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						title: $fn.getCodeMsg("결재선 지정")
						, fld: ""
						, isedit: true
						, refdata: {
							type: "appline"
							, tree: [{
								type: "org"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "2"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, islazy: true
							}]
							, apptype: ["AP", "AG_S", "AA"]
							, maxcount: [3, 3, 3]
							, defaultval: ""
							, initload: function () { console.log("initload"); }
							, confirm: function (rtnval) { }
						}
						, buttons: [{
							title: $dwp.core.lang.getCodeMsg("확인")
							, click: function (_$dialog) {
								var _refdata = _$dialog.options.refdata;
								var _$table = $("table[name=appLine_Table01]", _$dialog.element).xtable("instance");

								if (!_$table.validate()) {
									$fn.alert({ msg: $fn.getCodeMsg("사용자를 선택해 주십시요") });
									return false;
								}
								var _val = _$table.getData();
								var _vals = _val.split(_$table.options.rowsplit);
								var _appcnt = {};
								var _rtnval = [];
								$.each(_vals, function (i, v) {
									var _cells = v.split(_$table.options.cellsplit);
									if (_appcnt.hasOwnProperty(_cells[1])) {
										_appcnt[_cells[1]] = _appcnt[_cells[1]] + 1;
									} else {
										_appcnt[_cells[1]] = 1;
									}
									_rtnval.push(_cells[1] + "^" + _cells[0] + "^" + _cells[2]);
								});

								var _cntchk = false;
								$.each(_refdata.apptype, function (i, v) {
									if (_appcnt[v] > _refdata.maxcount[i]) {
										$fn.alert({ msg: $fn.getCodeMsg("aprv.data.apptype." + v) + "는 최대 " + _refdata.maxcount[i] + "개 까지 가능합니다." });
										_cntchk = true;
										return false;
									}
								});

								if (_cntchk) return false;

								var _lastcells = (_vals[_vals.length - 1]).split(_$table.options.cellsplit);
								if (_lastcells[1] != "AP") {
									$fn.alert({ msg: "최종결재자의 결재유형이 결재가 아닙니다." });
									return false;
								}

								if (typeof _refdata.confirm == "function") {
									_refdata.confirm(_rtnval);
								}

								_$dialog.close();
							}
						}
							, {
							title: $dwp.core.lang.getCodeMsg("취소")
							, click: function (_$dialog) {
								_$dialog.close();
							}
						}]
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;
						_me._dialog();
					}
					, _dialog: function () {
						var _me = this
							, _opt = $.extend({
								title: $fn.getCodeMsg("결재선 지정")
								, width: "100%"
								, modal: true
								, ismobile: true
								, resizable: false
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: $fn.getPath("gwlib") + "/waprvline_mo?readform" }
								, refdata: {}
								, initcallback: function (_$dialog) {
									//_$$.org.initdialog(_$dialog);
									function _reDrawingNo() {
										var _$tbody = $("table[name=appLine_Table01] tbody", _$dialog.element);
										$("tr:not([name=_template])", _$tbody).each(function (i, o) {
											var _v = parseInt($(this).attr("name").replace("_row_", ""), 10) + 1;
											var _$td = $("td[name=hno]", this);
											if (_$td.size() > 0) {
												$("div", _$td).html(_v);
												$("input[name=_HNO]", _$td).val(_v);
											}
										});
									}
									var _refdata = _$dialog.options.refdata;
									var _chkline = 0
										, _cellsplit = "†"
										, _rowsplit = ";";

									//초기값 설정하기
									var _initdata = "", _rows = [];
									if (_refdata.defaultval != "") {
										var _aprvlist = _refdata.defaultval.split("`}");
										$.each(_aprvlist, function (i, v) {
											if (v != "") {
												var _orgex = new $dwp.ui.org.data.orgEx(v, "APRV");
												console.log("orgex", _orgex);
												var _org = new $dwp.ui.org.data.org(_orgex.oinfo);
												console.log("org", _org);
												var _val = _orgex.oinfo.appindex + _cellsplit;
												_val += _orgex.oinfo.apptype + _cellsplit;
												_val += _org.sinfo;
												console.log("v", _val);
												_rows.push(_val);
											}
										});
										if (_rows.length > 0) {
											_initdata = _rows.join(_rowsplit);
										}
									}

									// Template AppType 설정하기
									var _$tr = $("tr[name=_template]", $("table[name=appLine_Table01]"))
										, _$htype = $("select[name=_HTYPE]", _$tr);

									if (_refdata.apptype.length > 0) {
										$.each(_refdata.apptype, function (i, v) {
											var _$opt = $("<option></option>").appendTo(_$htype);
											_$opt.val(v);
											_$opt.text($fn.getCodeMsg("aprv.data.apptype." + v));
										});
									}

									var _$table = $dwp.ui.table.init($("table[name=appLine_Table01]", _$dialog.element), {
										isedit: true
										, initdata: _initdata
										, template: "[name=_template]"
										//,keyfield : ["_APPLICANT", "_HDATE"]
										//,changeafter : function(){}
										, cell: [
											{
												nm: "hno", type: "no", vfnm: "_HNO"
												, drawfn: function (v, $cell, $tr, inst) {
													var _v = v
													if (typeof v == "undefined") {
														_v = parseInt($tr.attr("name").replace("_row_", ""), 10) + 1;
													}
													$("div", $cell).html(_v);
													$("input[name=_HNO]", $cell).val(_v);
												}
											}
											, {
												nm: "htype", type: "custom", vfnm: "_HTYPE"
												, drawfn: function (v, $cell, $tr, inst) {
													var _rowno = parseInt($tr.attr("name").replace("_row_", ""), 10);
													if (_chkline < _rowno) {
													} else {
														$cell.html("<div class='dwp-center'>" + $fn.getCodeMsg("aprv.data.apptype." + v) + "</div><input name='_HTYPE' type='hidden' value=''/>");
													}
													$("[name=_HTYPE]", $cell).xval(v);
												}
											}
											, {
												nm: "huser", type: "custom", vfnm: "UserFull", validator: /[^\s]/
												, drawfn: function (v, $cell, $tr, inst) {
													var _rowno = parseInt($tr.attr("name").replace("_row_", ""), 10);
													if (typeof v == "undefined") {
														//$("div._EDIT", $cell).removeClass("dwp-none");
													} else {
														var _org = new $dwp.ui.org.data.org(v);
														var _disp = _org.getFDispName();
														$("input[name=UserFull]", $cell).val(v);
														$("input[name=User]", $cell).val(_org.oinfo.key);

														if (_chkline < _rowno) {
															$("input[name=qsearch]", $cell).val(_disp);
														} else {
															$("div._READ", $cell).html("<div class='dwp-center'>" + _disp + "</div>");
														}
													}
													if (_chkline < _rowno) {
														$("div[name=orgsel_btn]", $cell).on("click", function () {
															//_me.selectOrgUsesr(_$dialog, $cell);
															$dwp.ui.org.orgsselect.init($(this), {
																ismobile: true
																, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
																, seltype: "2"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
																, selcallback: function (org) {
																	console.log(org);
																	// 중복사용자 체크
																	var _dchk = false;
																	$("input[name=User]", inst.element).each(function (i, o) {
																		if ($(this).val() == org.oinfo.notesid) {
																			_dchk = true;
																			return false;
																		}
																	});
																	if (_dchk) {
																		$fn.alert({ msg: "선택된 사용자는 이미 설정되어있습니다." });
																		return false;
																	}

																	$("input[name=qsearch]", $cell).val(org.getFDispName());
																	$("input[name=UserFull]", $cell).val(org.sinfo);
																	$("input[name=User]", $cell).val(org.oinfo.key);
																}
															});
														});
														$("div._EDIT", $cell).removeClass("dwp-none");
													} else {
														$("div._READ", $cell).removeClass("dwp-none");
													}
												}
											}
											, {
												nm: "rowdel", type: "custom"
												, drawfn: function (v, $cell, $tr, inst) {
													var _rowno = parseInt($tr.attr("name").replace("_row_", ""), 10);
													if (_chkline < _rowno) {
														$("div", $cell).on("click", function () {
															$tr.remove();
															inst._setRowIndex();
															_reDrawingNo();
														});
														$("div", $cell).removeClass("dwp-none");
													}
												}
											}
											, {
												nm: "rowins", type: "custom"
												, drawfn: function (v, $cell, $tr, inst) {
													var _rowno = parseInt($tr.attr("name").replace("_row_", ""), 10);
													if (_chkline < _rowno) {
														$("div", $cell).on("click", function () {
															inst.insert($tr);
															_reDrawingNo();
														});
														$("div", $cell).removeClass("dwp-none");
													}
												}
											}
										]
									});
									// - E
								}
								, buttons: null
							}, _me.options);
						$dwp.ui.dialog.init(_me.element, _opt);
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
		}
		// 메일 수신처 지정
		, mail: {
			_MODULE_NM: "dwp.mailline"
			, init: function (el, opt) {
				var _par = this, _$el = $(el),
					_opt = $.extend({}, opt);;

				if (typeof $.fn.mailline == "undefined") {
					_par._create();
				}

				_$el.mailline(_opt);

				return _$el.mailline("instance");
			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						title: ""
						, fld: ""
						, isedit: true
						, ismobile: false
						, refdata: {
							type: "mail"
							, tabidx: 0
							, tab: [{ title: "조직도", tree: 0, button: 0, grid: 0 }
								, { title: "주소록", tree: 1, button: 0, grid: 0 }]
							, button: [
								[
									{ id: "sendadd", title: "수신", css: "btn-add receive", click: function () { } }
									, { id: "copyadd", title: "참조", css: "btn-add refer", click: function () { } }
									, { id: "blindcopyadd", title: "비밀참조", css: "btn-add blind", click: function () { } }
									, { id: "aprvadel", title: "모두삭제", css: "btn-all-del", click: function () { } }
								]
							]
							, grid: [{
								type: "mail", title: "", prop: "mail"
								, children: [{ type: "mail", title: "수신", prop: "sendto", selector: "div.list-body[name='sendto_list']", drop: function (event, ui, element) { console.log("drop", ui) } }
									, { type: "mail", title: "참조", prop: "copyto", selector: "div.consent-body[name='copyto_list']", drop: function () { } }
									, { type: "mail", title: "비밀참조", prop: "blindcopyto", selector: "div.consent-body[name='blindcopyto_list']", drop: function () { } }]
							}
							]
							, tree: [{
								type: "org"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "0"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, islazy: true
								, comcode: ""
								// 2019-09-24 By LHJ
								, site: ""
								, issiteselect: true
								, usesitelist: ""
								, usesite: false
								// 2019-09-24 - E
								, isall: false
							}
								, {
								type: "pgrouporg"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "0"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, islazy: true
							}

							]
							, initload: function () { console.log("initload"); }
						}
						, buttons: [{
							title: $dwp.core.lang.getCodeMsg("확인")
							, click: function (_$dialog) {
								var _rtn = _$$.org._getGridData(_$dialog);

								//console.log("rtn", _rtn);

								if (_$dialog.options.fld != "") {
									_$fld = $("input[name='" + _$dialog.options.fld + "']", _$dialog.element);

								}
								_$dialog.close();
							}
						}
							, {
							title: $dwp.core.lang.getCodeMsg("취소")
							, click: function (_$dialog) {
								_$dialog.close();
							}
						}]
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;

						if (_me.options.ismobile) {
							$(_me.options.refdata.tree).each(function (i, o) {
								o.dragable = false;
							});
						}
						_me._dialog();

					}
					, _dialog: function () {
						var _me = this
							, _opt = $.extend({
								title: "결재선 지정"
								, width: (_me.options.ismobile ? "100%" : 928)
								, height: (_me.options.ismobile ? "auto" : 600)
								, modal: true
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: (_me.options.ismobile ? $fn.getPath("gwlib") + "/wmailline_mo?readform" : $fn.getPath("gwlib") + "/wmailline?readform") }
								, refdata: {}
								, initcallback: function (_$dialog) {
									_$$.org.initdialog(_$dialog);
								}
								, buttons: null
							}, _me.options);
						$dwp.ui.dialog.init(_me.element, _opt);
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
		}
		// mail end
		// vpr 지정
		, vpr: {
			_MODULE_NM: "dwp.vprline"
			, init: function (el, opt) {
				var _par = this, _$el = $(el),
					_opt = $.extend({}, opt);;

				if (typeof $.fn.vprline == "undefined") {
					_par._create();
				}

				_$el.vprline(_opt);

				return _$el.vprline("instance");
			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						title: ""
						, fld: ""
						, isedit: true
						, refdata: {
							type: "vpr"
							, tabidx: 0
							, tab: [{ title: "조직도", tree: 0, button: 0, grid: 0 }]
							, button: [
								[
									{ id: "visitadd", title: "초대", css: "btn-add", click: function () { } }
									, { id: "padd", title: "영구추가", css: "btn-add", click: function () { } }
									, { id: "tadd", title: "기간추가", css: "btn-add", click: function () { } }
									, { id: "adel", title: "모두삭제", css: "btn-all-del", click: function () { } }
								]
							]
							, grid: [{
								type: "vpr", title: "", prop: "vpr"
								, children: [{ type: "vpr", title: "초대", prop: "visitto", selector: "div.list-body[name='visitto_list']", drop: function (event, ui, element) { console.log("drop", ui) } }
									, { type: "vpr", title: "영구추가", prop: "permto", selector: "div.consent-body[name='permto_list']", drop: function () { } }
									, { type: "vpr", title: "기간추가", prop: "termto", selector: "div.consent-body[name='termto_list']", drop: function () { } }]
							}
							]
							, tree: [{
								type: "org"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "0"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, islazy: true
								// 2019-09-24 By LHJ
								, site: ""
								, issiteselect: true
								, usesitelist: ""
								, usesite: false
								// 2019-09-24 - E
							}]
							, initload: function () {
								console.log("initload");
							}
						}
						, buttons: [{
							title: $dwp.core.lang.getCodeMsg("확인")
							, click: function (_$dialog) {
								var _rtn = _$$.org._getGridData(_$dialog);

								if (_$dialog.options.fld != "") {
									_$fld = $("input[name='" + _$dialog.options.fld + "']", _$dialog.element);
								}
								_$dialog.close();
							}
						}
							, {
							title: $dwp.core.lang.getCodeMsg("취소")
							, click: function (_$dialog) {
								_$dialog.close();
							}
						}]
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;

						if (_me.options.hasOwnProperty("appdb_type") && _me.options.appdb_type == "COP") {
							_me.options.refdata.tree[0].comcode = "";
						}
						_me._dialog();

					}
					, _btnProc: function () {

					}
					, _dialog: function () {
						var _me = this
							, _opt = $.extend({
								title: "결재선 지정"
								, width: 928
								, height: 600
								, modal: true
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: $fn.getPath("gwlib") + "/wvprline?readform" }
								, refdata: {}
								, initcallback: function (_$dialog) {
									_$$.org.initdialog(_$dialog);
								}
								, buttons: null
							}, _me.options);
						$dwp.ui.dialog.init(_me.element, _opt);
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
		}
		// vpr end
		//사내담당자검색 시작
		, semp: {
			_MODULE_NM: "dwp.semp"
			, init: function (el, opt) {
				var _par = this, _$el = $(el), _opt = $.extend({}, opt);

				if (typeof $.fn.semp == "undefined") {
					_par._create();
				}

				_$el.semp(_opt);

				return _$el.semp("instance");

			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						title: "조직도 선택"
						, fld: ""
						, isedit: true
						, refdata: {
							type: "semp"
							, tabidx: 0
							, tab: [{ title: "조직도", tree: 0, button: 0, grid: 0 }]
							, grid: [{ type: "semp", title: "", prop: "list", count: 99 }]
							, tree: [{
								type: "org"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "0"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, islazy: true
								, checkbox: false
								// 2019-09-24 By LHJ
								, site: ""
								, issiteselect: true
								, usesitelist: ""
								, usesite: false
								// 2019-09-24 - E
								, onDblClick: function (_$dialog, dtnode) {
									//window._tempdata=_$dialog;
									var _$treewrap = $("div.dwp-tree", _$dialog.element), _issearch = _$treewrap.is(":hidden");
									$dwp.app.semp01._addListItem.call(this, _$dialog, dtnode, _issearch);
								}		/* 트리 더블클릭 */
							}]
							, initload: function () {
								//console.log("old initload");
							}
						}
						, buttons: [{
							title: "확인" // $dwp.core.lang.getCodeMsg("확인")
							, click: function (_$dialog) {
								var _rtn = _$$.org._getGridData(_$dialog);
								//	console.log("rtn", _rtn);
								_$dialog.close();
							}
						}
							, {
							title: "취소" // $dwp.core.lang.getCodeMsg("취소")
							, click: function (_$dialog) {
								_$dialog.close();
							}
						}]
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;

						_me._dialog();

					}
					, _dialog: function () {
						var _me = this
							, _opt = $.extend({
								title: ""
								, width: 860 //928
								//,height : 600
								, headerclass: "memo-type"
								, modal: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: $fn.getPath("gwlib") + "/wschpeople?readform" }
								, refdata: {}
								, initcallback: function (_$dialog) {
									_$$.org.initdialog(_$dialog);
								}
								, buttons: null

							}, _me.options);
						$dwp.ui.dialog.init(_me.element, _opt);
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
		}
		//사내 담당자 검색 끝
		// work 지정
		, orgwork: {
			_MODULE_NM: "dwp.orgwork"
			, init: function (el, opt) {
				var _par = this, _$el = $(el),
					_opt = $.extend({}, opt);;

				if (typeof $.fn.orgwork == "undefined") {
					_par._create();
				}

				_$el.orgwork(_opt);

				return _$el.orgwork("instance");
			}
			, _create: function () {
				var _par = this;
				$.widget(_par._MODULE_NM, {
					options: {
						title: $fn.getCodeMsg("comm.title.js021")
						, fld: ""
						, isedit: true
						, refdata: {
							type: "work"
							, tabidx: 0
							, tab: [{ title: $fn.getCodeMsg("comm.title.js016"), tree: 0, button: 0, grid: 0 }]
							, button: [
								[
									{ id: "centeradd", title: $fn.getCodeMsg("센터전체"), css: "btn-add" }
									, { id: "gridadd", title: $fn.getCodeMsg("comm.title.js017"), css: "btn-add" }
									, { id: "griddel", title: $fn.getCodeMsg("comm.title.js018"), css: "btn-del" }
									, { id: "gridadel", title: $fn.getCodeMsg("comm.title.js019"), css: "btn-all-del" }
								]
							]
							, grid: [{ type: "list", title: $fn.getCodeMsg("comm.title.js020"), prop: "list", count: 10 }]
							, tree: [{
								type: "org"
								, treetype: "0"		// 0 : 부서 & 사용자, 1 : 부서
								, seltype: "2"		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								, checkbox: false
								, islazy: true
							}]
							, initload: function (_$dialog) {
								console.log("initload");
							}
						}
						, buttons: [{
							title: $dwp.core.lang.getCodeMsg("comm.btn.confirm")
							, click: function (_$dialog) {
								var _rtn = _$$.org._getGridData(_$dialog);

								//console.log("rtn", _rtn);
								_$dialog.close();
							}
						}
							, {
							title: $dwp.core.lang.getCodeMsg("comm.btn.cancel")
							, click: function (_$dialog) {
								_$dialog.close();
							}
						}]
					}
					, _create: function () {
						this._super();
					}
					, _init: function () {
						var _me = this;

						_me._dialog();

					}
					, _dialog: function () {
						var _me = this
							, _opt = $.extend({
								title: ""
								, width: 928
								, height: 600
								, modal: true
								, orgtype: true
								, hide: { effect: "fade", duration: 300 }
								, show: { effect: "fade", duration: 300 }
								, content: { url: $fn.getPath("gwlib") + "/worgwork?readform" }
								, refdata: {}
								, initcallback: function (_$dialog) {
									_$$.org.initdialog(_$dialog);

									// 그룹목록 저장처리

									// 그룹목록 조회처리

								}
								, buttons: null
							}, _me.options);
						$dwp.ui.dialog.init(_me.element, _opt);
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
		}
		// work end

		, initdialog: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata;
			//console.log("dialog", _$dialog.options)
			if (_orginfo.type != "single" && _orginfo.type != "multi") {
				_me._tabProc(_$dialog);
			}
			_me._treeProc(_$dialog);

			if (_orginfo.type != "single") {
				_me._btnProc(_$dialog);
				_me._gridInitProc(_$dialog);
				_me._gridProc(_$dialog);
			}

			if (typeof _orginfo.initload == "function") {
				_orginfo.initload(_$dialog);
			}
		}
		, _tabProc: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _$tab = $("ul.dwp-tabs-header", _$dialog.element);

			$.each(_orginfo.tab, function (i, o) {
				_$li = $("<li><a href='#dwp-tabs-content'>" + o.title + "</a></li>").appendTo(_$tab);
				_$li.off("click").on("click", function () {
					var _pos = $("div.dwp-tabs", _$dialog.element).tabs("option", "active");
					//console.log("pos", _pos);
					_me._tabSelProc(_$dialog, _pos);
				})
			});

			$("div.dwp-tabs", _$dialog.element).tabs({});
		}
		, _tabSelProc: function (_$dialog, pos) {
			var _me = this;
			_$dialog.options.refdata.tabidx = pos;
			_me._treeProc(_$dialog);
			_me._btnProc(_$dialog);
			_me._gridProc(_$dialog);
		}
		, _orgTreeAuthCheck: function (treeinfo, _$dialog) {
			var _auth = true;
			if (treeinfo.type == "org") {
				// 외부사용자
				if ($fn.getCurUser().usertype == '9') { _auth = false; }
				// 사내망 여부체크
				if (!$fn.isInIpCheck()) { _auth = false; }
			}
			return _auth;
		}
		, _treeProc: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _$treewrap = $("div.dwp-tree", _$dialog.element)
				//,_pos = _me._getTabIdx(_orginfo)
				, _pos = _me._getTabInfo(_orginfo).tree
				, _treeinfo = _orginfo.tree[_pos]
				, _$tree = $("div.tree[name='tree_" + _pos + "']", _$treewrap);

			_treeinfo.parent = _$dialog;

			$("div.tree[name]", _$treewrap).hide();

			if (_me._orgTreeAuthCheck(_treeinfo)) {
				if (_$tree.size() == 0) {
					_$tree = $("<div name='tree_" + _pos + "' class='tree'/>").appendTo(_$treewrap);
				}

				_$tree.show();

				if (_$tree.xtree("instance") == null) {
					if (typeof _treeinfo.onDblClick != "function") {
						_treeinfo._onDblClick = function (dtnode) {
							//console.log("dtnode", dtnode)
							if (_orginfo.type != "single") {
								if (dtnode.data.isFolder && _treeinfo.seltype == "2") {
									//2021-08-12 By LHJ Error Fix
									//dtnode.toggleExpand();
									dtnode.tree.activeNode.toggleExpand();
									dtnode.tree.activeNode.focus();
								} else {
									_me._addListItem.call(_me, _$dialog, dtnode);
								}
							} else {
								if (typeof _treeinfo.userDblClick == "function") {
									_treeinfo.userDblClick(_$dialog, dtnode);
								}
							}
						}
					} else {
						console.log("SINGLE TREE")
						_treeinfo._onDblClick = function (dtnode) {
							//console.log("dtnode", dtnode)
							if (dtnode.data.isFolder && _treeinfo.seltype == "2") {
								//2021-08-12 By LHJ Error Fix
								//dtnode.toggleExpand();
								dtnode.tree.activeNode.toggleExpand();
								dtnode.tree.activeNode.focus();
							} else {
								_treeinfo.onDblClick(_$dialog, dtnode);
							}
						}
					}
					if (_treeinfo.type == "org") {
						if (!_treeinfo.hasOwnProperty("usesite") && _treeinfo.type == "org") {
							_treeinfo.usesite = false;
						}
						/*
						if ( typeof _treeinfo.onDblClick != "function" ) {
							_treeinfo._onDblClick = function(dtnode) {
								if (dtnode.data.isFolder && _treeinfo.seltype == "2") {
									dtnode.toggleExpand();
								} else {
									_me._addListItem.call(_me, _$dialog, dtnode);
								}
							}
						} else {
							_treeinfo._onDblClick = function(dtnode) {
								if (dtnode.data.isFolder && _treeinfo.seltype == "2") {
									dtnode.toggleExpand();
								} else {
									_treeinfo.onDblClick(_$dialog, dtnode);
								}
							}
						}
						*/
						_$$.org.tree.init(_$tree, _treeinfo);

						// By LHJ 2019-09-24
						_me._treeSiteProc(_$dialog, _$tree, _$tree.data("_TREE_DOPT"));
						//검색처리
						//_me._searchProc(_$dialog, _treeinfo);
					} else if (_treeinfo.type == "pgrouporg") {
						_$$.org.pgrouptree.init(_$tree, _treeinfo);
					} else if (_treeinfo.type == "cgrouporg") {
						_$$.org.cgrouptree.init(_$tree, _treeinfo);
					}
					//검색처리
					_me._searchProc(_$dialog, _treeinfo);
				}

				var _$treeSiteArea = $("div.dwp-site-area", _$tree.parents("div.dwp-tree-area"));
				if (_$treeSiteArea.size() > 0) {
					if (_treeinfo.hasOwnProperty("usesite") && _treeinfo.usesite) {
						_$treeSiteArea.removeClass("dwp-none");
					} else {
						_$treeSiteArea.addClass("dwp-none");
					}
				}
			} else {
				//검색처리
				_me._searchProc(_$dialog, _treeinfo);
			}
		}
		// Site Select Proc - By LHJ 2019-09-24
		, _treeSiteProc: function (_$dialog, _$tree, _treeinfo) {
			var _me = this
				, _$treesite = $("input[name=site_select]", _$dialog.element);

			if (_$treesite.size() == 0) return;

			if (!_treeinfo.hasOwnProperty("usesite") && _treeinfo.type == "org") {
				_treeinfo.usesite = false;
			}

			if (!_treeinfo.hasOwnProperty("site") || _treeinfo.site == "") {
				_treeinfo.site = "scg";
			}
			_$treesite.xval(_treeinfo.site);

			// Site 숨김처리
			if (!_treeinfo.hasOwnProperty("usesitelist") || _treeinfo.usesitelist == "") {
				_treeinfo.usesitelist = "scg,scggrp,center";
			}

			if (_treeinfo.usesitelist != "") {
				var _sitelist = _treeinfo.usesitelist + ",";
				_$treesite.each(function (i, o) {
					var _$site = $(o);
					if (_sitelist.indexOf(_$site.val() + ",") == -1) {
						_$site.parents("div.dwp-radio").hide();
					} else {
						_$site.parents("div.dwp-radio").show();
					}
				})
			} else {
				_$treesite.parents("div.dwp-radio").show();
			}

			if (!_treeinfo.issiteselect) {
				_$treesite.prop("disabled", true);
			} else {
				_$treesite.off("click").on("click", function () {
					var xtree = _$tree.xtree("instance");
					_$$.org.tree.changeSite(_$tree, $(this).val());
					_$$.org.tree.reload(xtree);
				});
			}
		}
		, _searchProc: function (_$dialog, treeinfo) {
			var _me = this
				, _$treewrap = $("div.dwp-tree", _$dialog.element)
				, _$search = $("div.dwp-search-result", _$dialog.element);

			function _search(qry) {
				var _orginfo = _$dialog.options.refdata
					, _pos = _me._getTabInfo(_orginfo).tree
					, _treeinfo = _orginfo.tree[_pos]
					, _$tree = $("div.tree[name='tree_" + _pos + "']", _$treewrap)
					, _searchtarget = "";
				if (typeof (_orginfo.tree) == "object") {
					if (typeof (_orginfo.tree[0]) == "object") {
						_searchtarget = _orginfo.tree[0].searchtarget || "";
					}
				}

				if (qry == "") {
					$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg032") }); return false;
				}
				if (_treeinfo.type == "pgrouporg" || _searchtarget == "personaddressbook") {
					var _data = _$$.org.pgrouptree.search(qry, _treeinfo);
				} else if (_treeinfo.type == "cgrouporg") {
					var _data = _$$.org.cgrouptree.search(qry, _treeinfo);
				} else if (_treeinfo.type == "org") {
					var _data = _$$.org.tree.search(qry, _treeinfo, _$tree);
				}
				/*
				if (_treeinfo.type == "org") {
					var _data = _$$.org.tree.search(qry, _treeinfo);
				} else if (_treeinfo.type == "pgrouporg" || _searchtarget == "personaddressbook") {
					var _data = _$$.org.pgrouptree.search(qry, _treeinfo);
				}
				*/
				_$treewrap.hide();
				$(".dwp-list-body", _$search).empty();
				_$search.show();

				$.each(_data, function (i, o) {
					_me._searchAddItemList(_$dialog, o);
				});
			}

			// Search 처리
			$("input[name='qsearch']", _$dialog.element).off("keydown").on("keydown", function (e) {
				if (e.keyCode != "13") { return; }
				//e.preventDefault();
				_search($(this).val());
			}).focus();

			$("div[name='search_btn']", _$dialog.element).off("click").on("click", function () {
				_search($("input[name='qsearch']", _$dialog.element).val());
			});
			$("div[name='refresh_btn']", _$dialog.element).off("click").on("click", function () {
				$("input[name='qsearch']", _$dialog.element).val("");
				$(".dwp-list-body", _$search).empty();
				_$search.hide();
				_$treewrap.show();
			});
		}
		, _searchAddItemList: function (_$dialog, node) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _gridinfo = null
				, _treeinfo = _me._getTreeInfo(_$dialog)
				, _org = new _$$.org.data.org(node.orgdata)
				, _$list = $("div.dwp-search-result .dwp-list-body", _$dialog.element)
				, _$item = $("<div class='dwp-item org-type dwp-cursor'>" + _org.getDispName() + "</div>")
					.appendTo(_$list)
					.data("orgdata", { data: node });

			if (node.orgdata.type == "B") { _$item.addClass("is-folder"); }

			_$item.on("click", function (e) {
				if (typeof _treeinfo.onSearchClick == "function") {
					$(this).siblings().removeClass("active");
					$(this).addClass("active");
					_treeinfo.onSearchClick($(this).data("orgdata"), _$dialog);
				} else {
					if (e.currentTarget === this) {
						$(this).toggleClass("active");
					}
				}
			})
				.off("dblclick").on("dblclick", function () {
					//if() To-Do Single Select
					if (_orginfo.type == "single") {
						if (typeof _treeinfo.onDblClick == "function") {
							_treeinfo.onDblClick(_$dialog, $(this).data("orgdata"));
						}
					} else {
						_gridinfo = _me._getGridInfo(_$dialog)
						if (_gridinfo.type == "list") {
							_me._addListItem(_$dialog, $(this).data("orgdata"), true);
						} else {
							if (typeof _treeinfo.onDblClick == "function") {
								_treeinfo.onDblClick(_$dialog, $(this).data("orgdata"));
							}
						}
					}
				});
			var isdragable = true;
			if (_treeinfo.hasOwnProperty("dragable") && !_treeinfo.dragable) {
				isdragable = false;
			}
			if (isdragable) {
				_$item.draggable({
					cursor: "pointer"
					, cursorAt: { top: 0, left: 0 }
					, helper: function (event) {
						var _$helper = $("<span>" + _org.getDispName() + "</span>");
						_$helper.data("orgdata", { data: node })
						return _$helper;
					}
					, start: function (event, ui) {
						$(this).addClass("active");
					}
					, stop: function (event, ui) {
						ui.helper.remove();
					}
					, containment: _$dialog.element
					, scroll: false
				}
				);
			}
		}
		, _btnProc: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _$btn = $("div.dwp-btn-area", _$dialog.element)
				, _btninfo = _orginfo.button[_me._getTabInfo(_orginfo).button];

			_$btn.empty();

			$.each(_btninfo, function (i, o) {
				if (o.type == "group") {
					var _$btngrp = $("<div class='btn-group'/>").appendTo(_$btn);
					$.each(o.children, function (j, co) {
						$("<div class='dwp-btn " + (_$dialog.options.hasOwnProperty("ismobile") && _$dialog.options.ismobile ? "sm " : "") + co.css + "'><button type='button'>" + ((co.hasOwnProperty("icon") && co.icon != "") ? "<img src='" + co.icon + "' />" : co.title) + "</button></div>").appendTo(_$btngrp)
							.off("click").on("click", function () {
								if (typeof co.click == "function") {
									co.click.call(null, _$dialog, co.id);
								} else if (typeof co.id != "undefined") {
									_me._commBtnProc(_$dialog, co.id);
								}
							});
					});
				} else {
					$("<div class='dwp-btn " + (_$dialog.options.hasOwnProperty("ismobile") && _$dialog.options.ismobile ? "sm " : "") + o.css + "'><button type='button'>" + ((o.hasOwnProperty("icon") && o.icon != "") ? "<img src='" + o.icon + "' />" : o.title) + "</button></div>").appendTo(_$btn)
						.off("click").on("click", function () {
							if (typeof o.click == "function") {
								o.click.call(null, _$dialog, o.id);
							} else if (typeof o.id != "undefined") {
								_me._commBtnProc(_$dialog, o.id);
							}
						});
				}
			});

		}
		, _commBtnProc: function (_$dialog, id) {
			var _me = this
				, _$treewrap = $("div.dwp-tree", _$dialog.element)
				, _issearch = _$treewrap.is(":hidden")
				, _$search = $("div.dwp-search-result", _$dialog.element)
				, _$gridlist = _me._getGrid(_$dialog)

			switch (id) {
				case "gridadd":
					if (_issearch) {
						$(".dwp-list-body div.dwp-item.active", _$search).each(function () {
							_me._addListItem(_$dialog, $(this).data("orgdata"), true);
						})
					} else {
						$.each(_me._getTree(_$dialog).getSelectedNodes(), function (i, _node) {
							_me._addListItem(_$dialog, _node)
						});
					}
					break;
				case "griddel":
					if ($("div.dwp-item.active", _$gridlist).size() > 0) {
						$("div.dwp-item.active", _$gridlist).remove();
					}
					break;
				case "gridadel":
					if ($("div.dwp-item", _$gridlist).size() > 0) {
						$("div.dwp-item", _$gridlist).remove();
					}
					break
			}
		}
		, _gridInitProc: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _gridinfo = _orginfo.grid
				, _$gridlist = null;

			$.each(_gridinfo, function (i, o) {
				_$gridlist = $("div.dwp-form-area[name='selected_area_" + i + "']", _$dialog.element);
				if (_$gridlist.size() == 0) {
					_h = "<div name='selected_area_" + i + "' class='dwp-form-area'>";
					_h += "<div class='aligner' data-bottom='xs' style='height:34px;'></div>";
					_h += "<div class='dwp-list-head' style='padding:13px 15px 14px;'>" + o.title + "</div>";
					_h += "<div name='selected_list_area' class='dwp-list-body'></div>";
					_h += "</div>";
					_$gridlist = $(_h).appendTo($("div.dwp-namepicker-inner", _$dialog.element));
				}
			});
		}
		, _gridProc: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _$search = $("div.dwp-search-result", _$dialog.element)
				, _pos = _me._getTabInfo(_orginfo).grid
				, _gridinfo = _orginfo.grid[_pos]
				, _$gridlist = $("div.dwp-form-area[name='selected_area_" + _pos + "']", _$dialog.element);

			$("div.dwp-form-area[name^='selected_area_']", _$dialog.element).hide();

			if (_$gridlist.size() == 0) {
				_h = "<div name='selected_area_" + _pos + "' class='dwp-form-area'>";
				_h += "<div class='aligner' data-bottom='xs' style='height:34px;'></div>";
				_h += "<div class='dwp-list-head' style='padding:13px 15px 14px;'>" + _gridinfo.title + "</div>";
				_h += "<div name='selected_list_area' class='dwp-list-body'></div>";
				_h += "</div>";
				_$gridlist = $(_h).appendTo($("div.dwp-namepicker-inner", _$dialog.element));
			}
			if (_gridinfo.type == "list") {
				$(".dwp-list-body", _$gridlist).droppable({
					hoverClass: "drophover",
					addClasses: true,
					over: function (event, ui) {
					},
					drop: function (event, ui) {
						var _node = ui.helper.data("orgdata");
						if (_node) {
							$(".dwp-list-body div.dwp-item.active", _$search).each(function () {
								_me._addListItem(_$dialog, $(this).data("orgdata"), true);
							})
						} else {
							var _$xtree = _me._getTree(_$dialog);
							$.each(_$xtree.getSelectedNodes(), function (i, _node) {
								//_me._addListItem(_$dialog, _node)
								if (typeof(_gridinfo.custom_drop) == "function") {
									_gridinfo.custom_drop.call(_me, event, ui, _$dialog, _node, _me._addListItem);
								} else {
									_me._addListItem(_$dialog, _node);
								}
							});
						}
					}
				})
					.sortable({
						items: "> div.dwp-item"
						, start: function (event, ui) {
							var _w = ui.item.width() + 2;
							ui.item.width(_w);
						}
						, stop: function (event, ui) {
						}
						//, forceHelperSize : true
					}).disableSelection();
			} else {
				if (typeof _gridinfo.children != "undefined") {
					$.each(_gridinfo.children, function (i, o) {
						$(o.selector, _$gridlist).droppable({
							hoverClass: "drophover",
							addClasses: true,
							over: function (event, ui) {
							},
							drop: function (event, ui) {
								if (typeof o.drop == "function") {
									o.drop(event, ui, _$dialog);
								}
							}
						});
					});
				}
			}
			_$gridlist.show();
		}
		, _addListItem: function (_$dialog, _node, issearch) {
			var _me = this
				, _issearch = false || issearch
				, _$search = $("div.dwp-search-result", _$dialog.element)
				, _treeinfo = _me._getTreeInfo(_$dialog)
				, _gridinfo = _me._getGridInfo(_$dialog)
				, _$gridlist = _me._getGrid(_$dialog)
				, _org = null, _$item = null;

			// 사용자 부서 및 부서 체크
			if (_treeinfo.seltype == "2") {
				if (_node.data.type == "B") { return true; }
			} else if (_treeinfo.seltype == "1") {
				if (_node.data.type == "S") { return true; }
			}
			console.log("node", _node);
			// 중복 체크
			if (_me._dblItemCheck($("div.dwp-item", $(".dwp-list-body", _$gridlist)), _node.data.key)) {
				return true;
			}

			// 건수 체크
			if (_gridinfo.hasOwnProperty("count")) {
				if (_gridinfo.count > 0) {
					if ($("div.dwp-item", $(".dwp-list-body", _$gridlist)).size() >= _gridinfo.count) {
						$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg033").replace("{$1}", _gridinfo.count) });
						return true;
					}
				}
			}

			// 사용자 부서 및 부서 체크
			_org = new _$$.org.data.org(_node.data.orgdata)
			_$item = $("<div class='dwp-item dwp-cursor org-type'>" + _org.getDispName() + "<button type='button' class='btn-cancel'>" + $fn.getCodeMsg("comm.title.js018") + "</button></div>")
				.appendTo($(".dwp-list-body", _$gridlist))
				.data("orgdata", _node.data.orgdata);

			if (_node.data.orgdata.type == "B") { _$item.addClass("is-folder"); }

			_$item.on("click", function (e) {
				if (e.currentTarget === this) {
					$(this).toggleClass("active");
				}
			});
			$("button", _$item).on("click", function () {
				$(this).parent().remove();
			});

			if (_issearch) {
				$(".dwp-list-body div.dwp-item.active", _$search).removeClass("active");
			} else {
				var _selnode = _me._getTree(_$dialog).getNode(_node.data.key);
				if (_selnode) {
					_me._getTree(_$dialog).getNode(_node.data.key).select(false);
				}
			}
		}
		// 중복체크
		, _dblItemCheck: function (list, key) {
			var _rtn = false;
			$(list).each(function () {
				var _item = $(this).data("orgdata");
				if (_item != null && _item.hasOwnProperty("key")) {
					if (_item.key == key) { _rtn = true; return false; }
				}
			});
			return _rtn;
		}
		, _getGridData: function (_$dialog) {
			var _me = this
				, _gridinfo = _$dialog.options.refdata.grid
				, _rtn = {};

			$.each(_gridinfo, function (i, o) {
				var _$gridlist = _me._getGrid(_$dialog, i);
				if (o.hasOwnProperty("children")) {
					_rtn[o.prop] = {};
					$.each(o.children, function (i, _o) {
						_rtn[o.prop][_o.prop] = [];
						$(_o.selector + " div.dwp-item", _$gridlist).each(function () {
							var _item = $(this).data("orgdata");
							if (_o.hasOwnProperty("oprop") && _o.oprop != "") {
								var _optdata = $(this).data(_o.oprop);
								if (_optdata) {
									_item[_o.oprop] = _optdata
								}
							}
							_rtn[o.prop][_o.prop].push(_item);
						});
					})
				} else {
					_rtn[o.prop] = [];
					$("div.dwp-item", _$gridlist).each(function () {
						var _item = $(this).data("orgdata");
						_rtn[o.prop].push(_item);
					});
				}
			});
			return _rtn;
		}
		, _getSingleData: function (_$dialog) {
			var _me = this
				, _$treewrap = $("div.dwp-tree", _$dialog.element)
				, _issearch = _$treewrap.is(":hidden")
				, _$search = $("div.dwp-search-result", _$dialog.element)
				, _treeinfo = _me._getTreeInfo(_$dialog)
				, _rtn = [];
			if (_issearch) {
				$(".dwp-list-body div.dwp-item.active", _$search).each(function () {
					console.log("orgdata", $(this).data("orgdata").data.orgdata);
					var _node = $(this).data("orgdata");
					_rtn.push(_node.data.orgdata);
				})
			} else {
				/*
				$.each(_me._getTree(_$dialog).getSelectedNodes(), function(i,_node){
					_rtn.push(_node.data.orgdata);
				});
				*/
				var _node = _me._getTree(_$dialog).getActiveNode();
				if (_node) {
					if ((_treeinfo.seltype == "2" && _node.data.type == "B") || (_treeinfo.seltype == "1" && _node.data.type == "S")) {
					} else {
						_rtn.push(_node.data.orgdata);
					}
					/*
					if (_node.data.isFolder && _treeinfo.seltype == "2") {

					} else if( _treeinfo.seltype == "1" ) {
						_rtn.push(_node.data.orgdata);
					}
					*/
				}
			}
			return _rtn;
		}
		, _getTree: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _$treewrap = $("div.dwp-tree", _$dialog.element)
				, _pos = _me._getTabInfo(_orginfo).tree
				, _treeinfo = _orginfo.tree[_pos]
				, _$tree = $("div.tree[name='tree_" + _pos + "']", _$treewrap);

			return _$tree.xtree("instance")
		}
		, _getGrid: function (_$dialog, pos) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _pos = (typeof pos == "undefined" ? _me._getTabInfo(_orginfo).grid : pos)
				, _gridinfo = _orginfo.grid[_pos]
				, _$gridlist = $("div.dwp-form-area[name='selected_area_" + _pos + "']", _$dialog.element);

			return _$gridlist;
		}
		, _getTreeInfo: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _pos = _me._getTabInfo(_orginfo).tree;

			return _orginfo.tree[_pos]
		}
		, _getGridInfo: function (_$dialog) {
			var _me = this
				, _orginfo = _$dialog.options.refdata
				, _pos = _me._getTabInfo(_orginfo).grid;

			return _orginfo.grid[_pos]
		}
		, _getTabIdx: function (orginfo) {
			return orginfo.tabidx;
		}
		, _getTabInfo: function (orginfo) {
			return orginfo.tab[orginfo.tabidx];
		}
	}
}($dwp.cns("ui"), jQuery));



















