/* Source File Upload Time : 2020-01-30 (목요일) 2:28:30 PM*/


/* Source File Upload Time : 2019-05-15 6:22:44 PM*/


/* Source File Upload Time : 2017-11-05 11:10:56 AM*/


/* Source File Upload Time : 2017-05-22 5:52:16 PM*/


/**
 * 임직원정보
 */
(function (_$$, $) {
	_$$.orgmn = {
		doc: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			}
			/**
			 * 게시작성 초기화
			 * @namespace	{Object}
			 * @name	$dwp.orgm.init
			 */
			, init: function (opt, el) {
				var _me = this, _zregcode
					, _opt = _me._initOptions(opt);

				var _doc = $fn.doc(_opt, el);
				console.log("_doc::", _doc);
				/*
				$fn.orgsel($("[name='org1']", _doc.element)
						,{isedit : _opt.isedit, treetype : "1", seltype : "1", fld : "OrgName", count : 1});
				*/

				//퇴사자 메일 공유때문에 추가 - 2021.12.16 by dwlee
				if ($("[name='org-mailreaders']", _doc.element).size() > 0) {
					$fn.orgsel($("[name='org-mailreaders']", _doc.element)
						, { isedit: _opt.isedit, treetype: "0", seltype: "2", isseltype: false, fld: "MailReaders", count: 20 });
				} else {
					_me._loadPhoto(_doc, opt);
				}
/*
	by mjkim 2025-09-29 카드번호조회			
*/
				$(".setbtncard",_doc.element).on("click", function () {
					_$$.orgmn.fnCardNoSync(_doc, "update");
				})	
				
			}
			, _initOptions: function (opt) {
				var _me = this, _opt = $.extend(_opt, opt);

				_opt.button = {
					savedoc: {
						title: $fn.getCodeMsg("comm.btn.reg")
						, click: function (doc) {
							if (!_$$.orgmn._becheck(doc, "save")) return;	//저장전에 체크 함수
							doc.save({ actiontype: "save", docstatus: "reg" });
						}
					}
					, editdoc: {
						title: $fn.getCodeMsg("comm.btn.edit")
						, click: function (doc) {
							doc.editDocument({ actiontype: "save", docstatus: "reg" });
						}
					}
					, deldoc: {
						title: $fn.getCodeMsg("comm.btn.deldoc")
						, click: function (doc) {
							$fn.confirm({ msg: $fn.getCodeMsg("sbrd01.msg.deldocconfirm") }).done(function () {
								doc.deleteDocument();
							});
						}
					}
					, pdeldoc: {
						title: $fn.getCodeMsg("comm.btn.pdeldoc")
						, click: function (doc) {
							$fn.confirm({ msg: $fn.getCodeMsg("sbrd01.msg.pdeldocconfirm") }).done(function () {
								doc.deleteDocument({ softdel: false });
							});
						}
					}
					, goview: {
						title: $fn.getCodeMsg("comm.btn.list")
						, click: function (doc) {
							doc.goview();
						}
					}
					, jobfwd: {
						title: $fn.getCodeMsg("orgmn.btn.jobfwd")
						, click: function (doc) {
							var re = _me._selectjob(doc, opt);
							if(!re){
								$fn.alert({ msg: $fn.getCodeMsg("orgmn.msg.nojob") });
							}
						}
					}
				};
				return _opt;
			}
			, _selectjob: function(doc, opt) {
				var _doc = doc, _opt = opt, _empno = _opt.param.empno, _html = "", _buttons;

				var re = false;

				var _docAdminDeptName = "";
				var _docAdminDeptCodes = "";
				var _docCount = 0;
				var _afpFixedReceiverForm = "";
				var _afpFixedReceiverFormCode = "";

				if(_opt.isDocAdmin == "Yes" || _opt.apprReceiveDocs != "" || _opt.afpFixedReceivers != ""){

				/* 1. 부서의 수발신담당 */
				var arrDocAdminDeptCodes = _opt.docAdminDeptCodes.split(";");
				var _docAdminDeptName = "";
				var _docAdminDeptCodes = "";

				if( _opt.docAdminDeptCodes != "" ){
					for(var i = 0; i < arrDocAdminDeptCodes.length; i++){
						if( i == 0 ) {
								_docAdminDeptName += $fn.getCurLangMsg(arrDocAdminDeptCodes[i].split("|")[1]);
								_docAdminDeptCodes += $fn.getCurLangMsg(arrDocAdminDeptCodes[i].split("|")[0]);
							}else{ 
								_docAdminDeptName += "," + $fn.getCurLangMsg(arrDocAdminDeptCodes[i].split("|")[1]);
								_docAdminDeptCodes += "," + $fn.getCurLangMsg(arrDocAdminDeptCodes[i].split("|")[0]);
							}
						}
					}

					/* 2. 수신 처리 중인 문서 */
					if( _opt.apprReceiveDocs != "" ){
						_docCount = _opt.apprReceiveDocs.split(";").length;
					}
					else {
						_docCount = 0;
					}

				/* 3. 결재양식의 고정수신자 */
				var arrAFPFixedReceivers = _opt.afpFixedReceivers.split(";");
				if( _opt.afpFixedReceivers != "" ){
					for(var i = 0; i < arrAFPFixedReceivers.length; i++){
						if( i == 0 ){
								_afpFixedReceiverForm += $fn.getCurLangMsg(arrAFPFixedReceivers[i].split("|")[1]);
								_afpFixedReceiverFormCode += $fn.getCurLangMsg(arrAFPFixedReceivers[i].split("|")[0]);
							}else{
								_afpFixedReceiverForm += "," + $fn.getCurLangMsg(arrAFPFixedReceivers[i].split("|")[1]);
								_afpFixedReceiverFormCode += "," + $fn.getCurLangMsg(arrAFPFixedReceivers[i].split("|")[0]);
							}
						}
					}

_html = "<div class='dwp-section'>";
_html += "<div class='dwp-table-vertical-read'>";
_html += "<div class='dwp-table dwp-form-table tiny-type'>";
_html += "<table class='sds-formtable'>";
_html += "<colgroup><col style='width:*;'>";
_html += "</colgroup>";
_html += "<tr>";
_html += "<td class='dwp-left'>";
_html += "<div class='dwp-row'>";
_html += "<div class='dwp-title' style='width:180px' data-xlang='LC_TEXT' data-xlang-code='orgmn.title.fwd01'>수발신 담당부서</div>";
_html += "<div class='dwp-value'>" + _docAdminDeptName + "</div>";
_html += "</div>";
_html += "<div class='dwp-row'>";
_html += "<div class='dwp-title' style='width:180px' data-xlang='LC_TEXT' data-xlang-code='orgmn.title.fwd02'>접수대기 문서</div>";
_html += "<div class='dwp-value'>" + _docCount + "건</div>";
_html += "</div>";
_html += "<div class='dwp-row'>";
_html += "<div class='dwp-title' style='width:180px' data-xlang='LC_TEXT' data-xlang-code='orgmn.title.fwd03'>고정수신자인 결재양식</div>";
_html += "<div class='dwp-value'>" + _afpFixedReceiverForm + "</div>";
_html += "</div>";
_html += "<div class='dwp-row'>";
_html += "<div class='dwp-value'>";
_html += "<div class='dwp-checkbox'><label><input name='DocAdminChangeOption' type='checkbox' value='DeptDocAdmin'><span data-xlang='LC_TEXT' data-xlang-code='orgmn.label.fwd01'>수발신 담당부서</span></label></div>";
_html += "</div>";
_html += "<div class='dwp-value'>";
_html += "<div class='dwp-checkbox'><label><input name='DocAdminChangeOption' type='checkbox' value='ReceiveDocs'><span data-xlang='LC_TEXT' data-xlang-code='orgmn.label.fwd02'>접수대기 문서</span></label></div>";
_html += "</div>";
_html += "<div class='dwp-value'>";
_html += "<div class='dwp-checkbox'><label><input name='DocAdminChangeOption' type='checkbox' value='AFPFixedReceiver'><span data-xlang='LC_TEXT' data-xlang-code='orgmn.label.fwd03'>고정수신자인 결재양식</span></label></div>";
_html += "</div>";
_html += "</div>";
_html += "</td>";
_html += "</tr>";
_html += "<tr>";
_html += "<td class='dwp-left'>";
_html += "<div class='dwp-row'>";
_html += "<div name='org9' data-type='org'>";

_html += "<input name='m_admin' type='hidden' value=''/> ";
_html += "<input name='m_adminid' type='hidden' value=''/> ";
_html += "<input name='m_adminidFull' type='hidden' value=''/>";

_html += "<div name='orgsel_group' class='dwp-grouping expended'>";
_html += "<!-- div class='select-group dwp-none' style='display:none'>";
_html += "<div class='dwp-selectbox md dwp-none' style='display:none'>";
_html += "<select class='dpw-none' style='display:none'></select>";
_html += "</div>";
_html += "</div -->";
_html += "<div>";
_html += "<div class='dwp-namepicker-grouping'>";
_html += "<div class='dwp-input'><input name='qsearch' type='text' value=''/></div>";
_html += "<div name='orgsel_btn' class='dwp-btn'><img src='" + $fn.getPath("weblib") + "/images/common/icon-namepicker.svg' /></div>";
_html += "</div>";
_html += "</div>";
_html += "</div>";
_html += "<div class='namepicker-list'></div>";
_html += "</div>";
_html += "</div>";
_html += "</td>";
_html += "</tr>";
_html += "</table>";
_html += "</div>";
_html += "</div>";
_html += "</div>";

					_buttons = [{
						title: $fn.getCodeMsg("comm.btn.confirm"),
						click: function (o)	{
							var _sel = $("input[name='DocAdminChangeOption']", o.element).xval();
							if(_sel == ""){
								//alert("인계처리할 담당업무를 선택하세요.");
								$fn.alert({ msg: $fn.getCodeMsg("orgmn.msg.seljob") });
								return false;
							}
							var _srcid = _empno;
							if(_srcid == ""){
								//alert("사용자를 특정할 수 없습니다. 조직도에 오류가 발생했습니다..");
								$fn.alert({ msg: $fn.getCodeMsg("orgmn.msg.noid") });
								return false;
							}
							var _tgtid = "";
							var _tmp = $("input[name='m_adminidFull']", o.element).xval();
							if(_tmp != ""){
								_tgtid = _tmp.split("^")[2];
							}
							if(_tgtid == ""){
								//alert("인계할 대상자를 지정하세요.");
								$fn.alert({ msg: $fn.getCodeMsg("orgmn.msg.selectid") });
								return false;
							}
							if(_srcid == _tgtid){
								//alert("동일인을 대상자로 지정할 수 없습니다.");
								$fn.alert({ msg: $fn.getCodeMsg("orgmn.msg.sameselerror") });
								return false;
							}

							$fn.xAjax({
								url: $fn.getProxyUrl(_opt.cdb + "/wcmdpost_action?createdocument"),
								data: { actiontype: "jobfwd", Arg1: _sel, Arg2: _srcid, Arg3: _tgtid, Arg4: _afpFixedReceiverFormCode, Arg5: _docAdminDeptCodes},
								method: "POST",
								dataType: "json",
								async: false
							}).done(function (data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {             //작업성공
										$fn.toast({ msg: $fn.getCodeMsg(data.msgcode) });
												_pdoc = o.options.docInstance;
												_pdoc.reload();
												o.close();
									} else {
										$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
									}
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.conerr3") });
								}
							}).fail(function (req, error) {
								$fn.alert({ msg: $fn.getCodeMsg("comm.msg.conerr3") });
							});
/****/


						}
					}, 
					{
						"title": $fn.getCodeMsg("comm.btn.cancel"), 
						click: function (o) {
								o.close();
						}
					}];

					var _dialog = $dwp.ui.dialog.init(null, {
						modal: true,
						resizable: false,
						draggable: true,
						title: $fn.getCodeMsg("orgmn.title.jobfwd"),
						width: 650,
						height: 500,
						show: 'fade',			// effect
						hide: 'fade',			// effect
							docInstance: _doc,
						buttons: _buttons,
						initcallback: function (o) {

							if( _opt.isDocAdmin == "Yes" ) $("input[name='DocAdminChangeOption']", o.element).eq(0).prop("checked", true);
							if( _docCount > 0) $("input[name='DocAdminChangeOption']", o.element).eq(1).prop("checked", true);
							if( _opt.afpFixedReceivers != "") $("input[name='DocAdminChangeOption']", o.element).eq(2).prop("checked", true);

							$fn.orgsel($("[name='org9']", o.element)
								, {
									type: "single", isedit: true, treetype: "0", seltype: "2", fld: "m_adminid", count: 1
									, orgselectcomplete: function (dialog, rtndata) {
										//사용자를 선택하지 않고 확인 버튼을 클릭하는 경우
										if (rtndata.length < 1) {
											return false;
										}
										console.log("rtndata[0]=====", rtndata[0])
										$("input[name='m_admin']", o.element).val(rtndata[0].username);
										//$("input[name='m_adminid']", o.element).val(rtndata[0].key);
									}	
								});
							},
							content: { html: _html }
						});

						re = true;
					}else{
						re = false;
					}
					return re;
			}
			, _loadPhoto: function (doc, opt) {
				var that = this, _doc = doc, _opt = opt, _empno = _opt.param.empno, _html = "", _imageurl = "", _noimageurl = "/tcclibs/images/common/default-person.png";
				var _isedit = (_opt.isadmin || _opt.isconowner || _empno === $fn.getCurUser().pinfo.empno) ? true : false;
				console.log("_empno::", _empno);
				_imageurl = "/dwp/com/portal/userphoto.nsf/photo/" + _empno + "/$file/" + _empno + "?OpenElement";

				_html = "<img class='dwp-photo " + ((_isedit) ? "dwp-cursor" : "") + "' src='" + $dwp.core.util.getProxyUrl(_imageurl) + "' alt='' style='width:220px'/>";
				$(".photo", _doc.element).html(_html);
				$(".dwp-photo", _doc.element).bind('load', function () {
					console.log("Photo loading success!!");
				}).bind("error", function () {
					console.log("Photo loading fail!!");
					$(this).attr("src", $dwp.core.util.getProxyUrl(_noimageurl));
				}).bind("click", function () {
					if (_isedit) $fn.selectPic(_opt);
				});
			}
		}
		, fnCardNoSync: function (_doc, _flag) {
			var that = this;
			var returnval = false
			var opt = _doc.options;
			var hrCardNo = "";

			var _rempno = $("input[name=RPERSONID]", _doc.element).xval();
			var _orgcardno = $("#orgcardno",_doc.element).text();
			 _orgcardno = _orgcardno.replace(/ /g, "");

			if (_rempno != "") {
				$fn.xAjax({
					url: $fn.getProxyUrl(opt.cdb + "/wcmdpost_action?createdocument"),
					data: { actiontype: "check_cardno", Arg1: _rempno },
					method: "POST",
					dataType: "json",
					async: false
				})
					.done(function (data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {             //작업성공 	
								if (data.dataSet[0].hasOwnProperty("CARDNO")) {
									hrCardNo = data.dataSet[0].CARDNO;
								}
								else if (data.dataSet[0].hasOwnProperty("EMP_BARCODE_NO")) {
									hrCardNo = data.dataSet[0].EMP_BARCODE_NO;
								}
								if (hrCardNo != _orgcardno) {
									$fn.confirm({ msg: $fn.getCodeMsg("org.msg.alert25") }).done(function () {
										$dwp.app.orgmn.fnCardNoUpdate(_doc, hrCardNo );
									})
								}
								else {
									$fn.confirm({ msg: $fn.getCodeMsg("org.msg.alert26") }).done(function () {
										$dwp.app.orgmn.fnCardNoUpdate(_doc,hrCardNo );
									})
								}
								returnval = true;
							} else {
								$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
							}
						} else {
							$fn.alert({ msg: $fn.getCodeMsg("comm.msg.conerror3") });
						}
					}).fail(function (req, error) {
						$fn.alert({ msg: $fn.getCodeMsg("comm.msg.conerror3") });
					});

			} else {
				returnval = true;
			}
			return returnval;
		}
		, fnCardNoUpdate: function (_doc,_cardno) {

			var returnval = false
			var opt = _doc.options;

			var _empno = $("input[name=PERSONID]", _doc.element).xval();


			if (_cardno != "") {
				$fn.xAjax({
					url: $fn.getProxyUrl(opt.cdb + "/wcmdpost_action?createdocument"),
					data: { actiontype: "update_cardno",Arg1: _empno ,Arg2: _cardno},
					method: "POST",
					dataType: "json",
					async: false
				})
					.done(function (data) {
						if (data.hasOwnProperty("result")) {

							if (data.result >= "200" && data.result < "300") {             //작업성공 	
								$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
								returnval = true;
							} else {
								$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) + "<br>" + data.msg });
							}

						} else {
							$fn.alert({ msg: $fn.getCodeMsg("comm.msg.conerror3") });
						}

					}).fail(function (req, error) {
						$fn.alert({ msg: $fn.getCodeMsg("comm.msg.conerror3") });
					});

			} else {
				returnval = true;
			}
			return returnval;

		}
		, _becheck: function (_doc, _flag) {
			var that = this;
			var returnval = false
			var opt = _doc.options;

			var _empno = $fn.getCurUser().pinfo.rempno;
			var _loginid = $("input[name=LOGINID]", _doc.element).xval();
			// by mjkim 2025-09-23 중복로그인 아이디 체크

			if (_loginid != "") {
				$fn.xAjax({
					url: $fn.getProxyUrl(opt.cdb + "/wcmdpost_action?createdocument"),
					data: { actiontype: "doubleid", Arg1: _empno, Arg2: _loginid },
					method: "POST",
					dataType: "json",
					async: false
				})
					.done(function (data) {

						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {             //작업성공 	
								returnval = true;

							} else {
								$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
							}
						} else {
							$fn.alert({ msg: $fn.getCodeMsg("org.msg.error08") });
						}

					}).fail(function (req, error) {
						$fn.alert({ msg: $fn.getCodeMsg("org.msg.error08") });
					});

			} else {
				returnval = true;

			}



			return returnval;
		}
		, view: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			}
			, init: function (opt, el) {

				var _me = this
					, _view = null

					, _opt = _me._initOptions(opt);

				_view = $fn.view(_opt, el);
			}
			, _initOptions: function (opt) {
				var _me = this
					, _opt = $.extend({}, opt);

				_opt.button = _me._buttonInfo(_opt);
				console.log("_opt.button::", _opt.button);
				_opt.header = _me._headerInfo(_opt);
				console.log("_opt.header::", _opt.header);

				return _opt;
			}
			, _buttonInfo: function (_opt) {
				var _btnList = {
					eprint: {
						title: $fn.getCodeMsg("comm.btn.exceldown"),
						click: function (view) {
							var _selection = "BoardID=\"" + _opt.param.boardid + "\"";

							if (_opt.viewalias == "wvall") _selection = "";

							view.exceldownload({ eventcode: "stboard.view", formula: _selection, viewname: _opt.viewalias });
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"
					}
					, create: {
						title: $fn.getCodeMsg("comm.btn.create")
						, click: function (view) {
							view.createDocument({ param: _opt.param });
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
					, movedoc: {
						title: $fn.getCodeMsg("sbrd01.title.movedoc")
						, click: function (view) {
							_$$.sbrd01.act_movedoc_view(view);
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-copy.svg"
					}
				}
					, _sbtnList = {
						wviworglist: ['create', 'eprint', 'movedoc']
						, wviwcomuserlist: ['create', 'eprint', 'movedoc']
					};
				//console.log("_sbtnList[_opt.viewalias]:", _sbtnList[_opt.viewalias]);
				return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);
			}
			, _headerInfo: function (_opt) {
				var _cate_com = _$$.orgmn.getCompanyr(_opt, _opt.cdb + "/api/data/collections/name/vViewComAll?count=999", ""); //회사별 목록
				var _searchcate = [{ title: $fn.getCodeMsg("sbrd01.title.searchall"), key: "all" }
					, { title: "직위", key: "Name1" }
					, { title: "이름", key: "PersonName" }
					, { title: "사번", key: "PersonID" }
					, { title: "소속", key: "OrgName" }];

				var _cate = {}, _cate_data = [];

				var _me = this, _col = {
					titlecode: {
						name: '_titlecode'
						, type: 'text'
						, title: $fn.getCodeMsg("orgmn.title.titlecode")
						, width: '8%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, titlename: {
						name: '_titlename'
						, type: 'text'
						, title: $fn.getCodeMsg("orgmn.title.titlename")
						, width: '8%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, name: {
						name: '_name'
						, type: 'text'
						, title: $fn.getCodeMsg("orgmn.title.name")
						, width: '8%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, personid: {
						name: '_personid'
						, type: 'text'
						, title: $fn.getCodeMsg("orgmn.title.personid")
						, width: '8%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, rpersonid: {
						name: '_rpersonid'
						, type: 'text'
						, title: $fn.getCodeMsg("orgmn.title.personid")
						, width: '8%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, orgcode: {
						name: '_orgcode'
						, title: $fn.getCodeMsg("orgmn.title.orgcode")
						, width: '10%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, orgname: {
						name: '_orgname'
						, title: $fn.getCodeMsg("orgmn.title.orgname")
						, width: '11%'
						, sort: true
						, css: 'dwp-center dwp-cursor'
					}
					, mail: {
						name: '_mail'
						, title: $fn.getCodeMsg("orgmn.title.email")
						, width: '12%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, work: {
						name: '_work'
						, title: $fn.getCodeMsg("orgmn.title.work")
						, width: 'auto'
						, sort: false
						, css: 'dwp-left dwp-cursor'
					}
					, officetelno: {
						name: '_officetelno'
						, title: $fn.getCodeMsg("orgmn.title.officetelno")
						, width: '11%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, mobiletelno: {
						name: '_mobiletelno'
						, title: $fn.getCodeMsg("orgmn.title.mobiletelno")
						, width: '11%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, faxno: {
						name: '_fax'
						, title: $fn.getCodeMsg("FAX")
						, width: '11%'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
					, birthday: {
						name: '_birthday'
						, title: $fn.getCodeMsg("orgmn.title.birthday")
						, width: '11%'
						, sort: true
						, css: 'dwp-center dwp-cursor'
					}
					, etc: {
						name: '_etc'
						, title: $fn.getCodeMsg("orgmn.title.etc")
						, width: 'auto'
						, sort: false
						, css: 'dwp-center dwp-cursor'
					}
				}
					, _hList = {
						// 기본보기 상단고정 없는 경우
						wviwuserlist: {
							sortnm: "_created"
							, sortorder: "descending"
							, checkbox: false
							, formalias: "wFrm01"
							, isnew: { basedate: '_created' }
							, isreply: false
							, category: _cate
							, colnm: ['titlename', 'name', 'personid', 'orgname', 'officetelno', 'work']
							, search: _searchcate
							//,click : function(){}
						}
						, wviwcomuserlist: {
							sortvw: "wviwcomuserlist"				// 개별보기 소트
							, sortnm: "_created"
							, sortorder: "descending"
							, checkbox: false
							, formalias: "wFrm01"
							, isnew: { basedate: '_created' }
							, isreply: false
							, category: {
								name: '_category'
								, lvl: 1
								, data: _cate_com
								, change: function (view, select) {
									console.log('view', view);
									console.log('select', select);
								}
							}
							//	,category : _cate
							, colnm: ['name', 'orgname', 'titlename', 'officetelno', 'mobiletelno', 'mail', 'birthday', 'etc']
							, search: _searchcate
							//,click : function(){}
						}
						, wviwcomuserlist_orgname_des: {
							sortvw: "wviwcomuserlist"				// 개별보기 소트
							, sortnm: "_orgname"
							, sortorder: "descending"
							, checkbox: false
							, formalias: "wFrm01"
							, isnew: { basedate: '_created' }
							, isreply: false
							, category: {
								name: '_category'
								, lvl: 1
								, data: _cate_com
								, change: function (view, select) {
									console.log('view', view);
									console.log('select', select);
								}
							}
							//	,category : _cate
							, colnm: ['name', 'orgname', 'titlename', 'officetelno', 'mobiletelno', 'mail', 'birthday', 'etc']
							, search: _searchcate
							//,click : function(){}
						}
						, wviwbirthlist: {
							sortnm: "_created"
							, sortorder: "descending"
							, checkbox: false
							, formalias: "wFrm01"
							, isnew: { basedate: '_created' }
							, isreply: false
							, category: {
								name: '_category'
								, lvl: 1
								, data: _cate_com
								, change: function (view, select) {
									console.log('view', view);
									console.log('select', select);
								}
							}
							, colnm: ['orgname', 'titlename', 'name', 'birthday', 'officetelno', 'mobiletelno', 'etc']
							, search: _searchcate
							//,click : function(){}
						}
						, wviwbydatelist: {
							sortnm: "_created"
							, sortorder: "descending"
							, checkbox: false
							, formalias: "wFrm01"
							, isnew: { basedate: '_created' }
							, isreply: false
							, category: {
								name: '_category'
								, lvl: 1
								, data: _cate_com
								, change: function (view, select) {
									console.log('view', view);
									console.log('select', select);
								}
							}
							, colnm: ['birthday', 'orgname', 'titlename', 'name', 'officetelno', 'mobiletelno', 'etc']
							, search: _searchcate
							//,click : function(){}
						}

					};

				if (_opt.hasOwnProperty("colnm") && _opt.colnm.length > 0) {
					_hList[_opt.viewalias].colnm = _opt.colnm;
				}
				if (_opt.hasOwnProperty("formalias") && _opt.formalias !== "") {
					_hList[_opt.viewalias].formalias = _opt.formalias;
				}
				if (_opt.hasOwnProperty("checkbox")) {
					_hList[_opt.viewalias].checkbox = _opt.checkbox;
				}
				_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);
				return _hList[_opt.viewalias];
			}
		}

		, getCompanyr: function (opt, url, cate) {
			var _data = [];
			var _url = url;

			$fn.xAjax(_$$.orgmn._jsonGetParmDataUrl(_url, cate))
				.done(function (json, status, xhr) {
					$(json).each(function (i, data) {
						var _v = { title: data["OrgName"], val: data["_orgcode"] + '' };
						_data.push(_v);
					});
				})
				.fail(function () { });
			return _data;
		}
		, _jsonGetParmDataUrl: function (url, cate) {
			var _data = {};
			if (cate != "") { _data.category = cate }
			return {
				url: $fn.getProxyUrl(url)
				, dataType: "json"
				, async: false
				, cache: false
				, data: _data
			};
		}

		, getCategory: function (_opt) {
			var _lnbid = _opt.param.lnbid, _boardid = _opt.param.boardid;
			var _key = _lnbid + "^" + _boardid, _cate, _catenm;
			var _data = [], i = 0;

			if (!_opt.iscategory) return _data;
			$fn.xAjax({
				url: "/dwp/com/appmng/bbs_mn.nsf/api/data/collections/name/vwJSonInfoByKey?count=999&category=" + _key,
				method: "GET",
				dataType: "json",
				async: false,
				cache: false
			}).done(function (data) {
				var _cate, _catenm, _arrcate, _arrcatenm, i = 0;
				//console.log("data:", data);
				if (data !== null && data.length > 0) {
					//console.log("data[0]:", data[0]);
					_cate = data[0]._category;
					_catenm = data[0]._categorynm;
					if (_cate === "" || _catenm === "") return;
					_arrcate = _cate.split(";");
					_arrcatenm = _catenm.split(";");
					for (i = 0; i < _arrcate.length; i++) {
						_data[i] = {};
						_data[i].title = _arrcatenm[i].toString().trim();
						_data[i].val = _arrcate[i].toString().trim();
					}
				}
			}).fail(function (req, error) {
				console.log(req.responseText + "\n" + error);
			});
			//console.log("return _data", _data);
			return _data;
		}
	}
}($dwp.cns("app"), jQuery));



