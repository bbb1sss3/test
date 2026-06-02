/*******************************************************************************************
 * 단 위 업 무 명 : 메일
 * 작    성    자	: 김 만 현)
 * 작    성    일	: 2016/09/07~
 * 수    정    자	: 김 만 현
 * 수    정    일	: 2016/12/18
 * 내          용	: 메일 화면에서 사용하는 스크립트
 * 주  의  사  항  :
 *******************************************************************************************/

(function (_$$, $) {
	_$$.mail = {
		//메일 초기화면 - 메일사용자, 메일만 쓰는 사이트를 위한 포탈 - 2023.06.07 by dwlee
		portal: {


			//팝업창을 가운데 띄우는 함수 - 2024.11.29 by dwlee
			NewWindow: function (mypage, myname, w, h, scroll) {
				var winl = (screen.width - w) / 2;
				var wint = (screen.height - h) / 2;
				var settings = 'height=' + h + ',';
				settings += 'width=' + w + ',';
				settings += 'top=' + wint + ',';
				settings += 'left=' + winl + ',';
				settings += 'scrollbars=' + scroll + ',';
				settings += 'resizable=yes';

				var win = window.open(mypage, myname, settings);

				try {
					if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
				} catch (e) { console.log(e) };

			},
			//고객의견 열어주기 - 2024.12.22
			open_customdoc: function (docpath, docid) {
				var _me = this;
				//https://works.hwasung.com/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=
				_me.NewWindow("https://" + $fn.getSysinfo().hostname + "/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=/" + docpath + "0/" + docid + "?Opendocument", "AprWin", "887", "800", "no");
			},

			//과겨 결재문서 열어주기 - 팝업
			open_aprdoc: function (docpath, docid) {
				var _me = this;
				_me.NewWindow("https://" + $fn.getSysinfo().hostname + "/" + docpath + "0/" + docid + "?Opendocument", "AprWin", "887", "800", "no");
			},

			init: function (_opt, el) {
				var _me = this;
				var _pinfo = $fn.getCurUser().pinfo;

				//($inbox_unread_portal) : 안읽은 편지함
				//($inbox_all) : 받은 편지함
				_me.DrawingChartinit(_opt, el); // 연차 사용현황 차트

				_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($inbox_unread_portal)?ps=10&page=0", el, "mail-list-01"); //안읽은
				_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($isstar)?ps=10&page=0", el, "mail-list-04"); //중요
				_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($inbox_in_app)?ps=10&page=0", el, "mail-list-05"); //알림
				//_me.loadlist_type2(_opt, _pinfo.mailpath + "/api/data/collections/name/($sent)?ps=10&page=0", el, "sub_portlet_list_03"); //보낸
				_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($sent)?ps=10&page=0", el, "mail-list-06"); //보낸

				//할일 추가 - 2023.07.03 by dwlee
				_me.loadlist(_opt, "/dwp/com/portal/todo.nsf/api/data/collections/name/($todo)?ps=10&page=0&category=" + moment().utc().format("YYYYMMDD") + "^" + _pinfo.empno, el, "mail-list-02");

				$("a.refresh_portlet_01", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($inbox_unread_portal)?ps=10&page=0", "mail-list-01");
					});

				$("a.refresh_portlet_04", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($isstar)?ps=10&page=0", "mail-list-04");
					});
				$("a.refresh_portlet_05", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($inbox_in_app)?ps=10&page=0", el, "mail-list-05");
					});
				$("a.refresh_portlet_06", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($sent)?ps=10&page=0", el, "mail-list-06");
					});

				//할일 추가 - 2023.07.03 by dwlee
				$("a.refresh_portlet_02", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, "/dwp/com/portal/todo.nsf/api/data/collections/name/($todo)?ps=10&page=0&category=" + moment.utc().format("YYYYMMDD") + "^" + _pinfo.empno, el, "mail-list-02");
					});

				//quicklink 처리
				//_me.moveLink(_pinfo.mailpath, el);

				//최근 수신인 - 2023.06.19 by dwlee
				_me.getLastSendList(_pinfo.mailpath, $(".dwp-sendlist", el), "home");

				_me.flowermenu(el);

				//리프레쉬
				$(".xware-header-logo").css("cursor", "pointer");
				$(".xware-header-logo")
					.off("click")
					.on("click", function () {
						document.location.reload();
					});

				$dwp.app.mail.com.update_left_count(); //좌측 LNB 읽지않은 메일 건수 표시 - 2023.07.04 by dwlee

				$("#W0013", $("div.dwp-nav")).parent().addClass("active"); //받은 편지함 펼치기 - 2023.07.04 by dwlee

				$dwp.core.lang.convert({ url: "", isedit: true }, el);
			},

			//2024.10.02
			init_bk: function (_opt, el) {
				var _me = this;
				var _pinfo = $fn.getCurUser().pinfo;

				//($inbox_unread_portal) : 안읽은 편지함
				//($inbox_all) : 받은 편지함
				_me.DrawingChartinit(_opt, el); // 연차 사용현황 차트

				_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($inbox_unread_portal)?ps=10&page=0", el, "sub_portlet_list_00"); //안읽은
				_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($isstar)?ps=10&page=0", el, "sub_portlet_list_01"); //중요
				_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($inbox_in_app)?ps=10&page=0", el, "sub_portlet_list_02"); //알림
				//_me.loadlist_type2(_opt, _pinfo.mailpath + "/api/data/collections/name/($sent)?ps=10&page=0", el, "sub_portlet_list_03"); //보낸
				_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($sent)?ps=10&page=0", el, "sub_portlet_list_03"); //보낸

				//할일 추가 - 2023.07.03 by dwlee
				_me.loadlist(_opt, "/dwp/com/portal/todo.nsf/api/data/collections/name/($todo)?ps=10&page=0&category=" + moment().utc().format("YYYYMMDD") + "^" + _pinfo.empno, el, "sub_portlet_list_04");

				$("a.refresh_portlet_00", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($inbox_unread_portal)?ps=10&page=0", "sub_portlet_list_00");
					});

				$("a.refresh_portlet_01", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($isstar)?ps=10&page=0", "sub_portlet_list_01");
					});
				$("a.refresh_portlet_02", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($inbox_in_app)?ps=10&page=0", el, "sub_portlet_list_02");
					});
				$("a.refresh_portlet_03", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, _pinfo.mailpath + "/api/data/collections/name/($sent)?ps=10&page=0", el, "sub_portlet_list_03");
					});

				//할일 추가 - 2023.07.03 by dwlee
				$("a.refresh_portlet_04", el)
					.off("click")
					.on("click", function () {
						_me.loadlist(_opt, "/dwp/com/portal/todo.nsf/api/data/collections/name/($todo)?ps=10&page=0&category=" + moment.utc().format("YYYYMMDD") + "^" + _pinfo.empno, el, "sub_portlet_list_04");
					});

				//quicklink 처리
				//_me.moveLink(_pinfo.mailpath, el);

				//최근 수신인 - 2023.06.19 by dwlee
				_me.getLastSendList(_pinfo.mailpath, $(".dwp-sendlist", el), "home");

				_me.flowermenu(el);

				//리프레쉬
				$(".xware-header-logo").css("cursor", "pointer");
				$(".xware-header-logo")
					.off("click")
					.on("click", function () {
						document.location.reload();
					});

				$dwp.app.mail.com.update_left_count(); //좌측 LNB 읽지않은 메일 건수 표시 - 2023.07.04 by dwlee

				$("#W0013", $("div.dwp-nav")).parent().addClass("active"); //받은 편지함 펼치기 - 2023.07.04 by dwlee

				$dwp.core.lang.convert({ url: "", isedit: true }, el);
			},

			//플라워 아이콘 수행
			send_icon: function (act_type, el) {
				var _el = el;
				var _to = [];
				var _full = [];
				var _wmember = [];
				var _member = [];
				var _pinfo = $fn.getCurUser().pinfo;

				var _$chks = $("input[name=chk]:checked", $(".dwp-sendlist", _el));
				if (_$chks.size() == 0) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt42") });
					return;
				}
				$.each(_$chks, function (idx, chk) {
					var _$this = $(this);
					if (_$this.data("empno") != "") {
						_member.push(_$this.data("empno"));
						_wmember.push({ username: _$this.data("name"), empno: _$this.data("empno") });
					}
					_to.push(_$this.data("to"));
					_full.push(_$this.data("full"));
				});

				if (act_type === "messenger") {
					if (_wmember.length > 0) {
						$dwp.core.util.webchat.chat(_wmember);
					} else {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt43") });
						return;
					}
				} else if (act_type === "mail") {
					$dwp.core.util.setLocalStorage("dwp.mailsendto", _to.join(";")); //LocalStorage에 수신인 정보를 저장
					$dwp.core.util.setLocalStorage("dwp.mailsendtofull", _full.join(";")); //LocalStorage에 수신인 정보를 저장
					_$$.mail.com.newMail({ url: _pinfo.mailpath + "/Memo?OpenForm&newtype=localstorage_dwp.mailsendto" });
				} else if (act_type === "people") {
					if (_wmember.length > 0) {
						$fn.addFavoritePeople(_member.join(","), "");
					} else {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt44") });
						return;
					}
				} else {
					return;
				}
			}, // send_icon -END

			//플라워 메뉴 처리 - 2023.06.20 by dwlee
			flowermenu: function (el) {
				var _el = el;
				var _me = this;
				// 0 . 멤버 플라워 메뉴 - Button Event 처리
				var _$btn_flower_on = $(".flower-menu", _el);
				var _$btn_flower_off = $(".flower-menu .flower-shortcut", _el);
				if (_$btn_flower_on.size() > 0) {
					_$btn_flower_on.off("click").on("click", function (e) {
						$(this).toggleClass("active");
						e.stopPropagation();
					});
				}
				if (_$btn_flower_off.size() > 0) {
					_$btn_flower_off.on("click", function (e) {
						e.stopPropagation();
					});
				}

				// -------------- 플라워 icon click Event 처리 start
				// ------------------------------------
				var _$icon_messenger = $("img[name=vpr_icon_messenger]", _el);
				var _$icon_mail = $("img[name=vpr_icon_mail]", _el);
				var _$icon_favorite = $("img[name=vpr_icon_favoritepeople]", _el);

				if (_$icon_messenger.size() > 0) {
					_$icon_messenger.off("click").on("click", function () {
						//내부사용자만
						_me.send_icon("messenger", el);
					});
				}
				if (_$icon_mail.size() > 0) {
					_$icon_mail.off("click").on("click", function () {
						//전체
						_me.send_icon("mail", el);
					});
				}
				if (_$icon_favorite.size() > 0) {
					_$icon_favorite.off("click").on("click", function () {
						//내부사용자만
						_me.send_icon("people", el);
					});
				}
			},

			//바로가기 링크 처리 - 2023.06.20 by dwlee
			moveLink: function (mailpath, el) {
				var _$list = $(".dwp-quicklink", el);
				$(".dwp-slink", _$list)
					.off("click")
					.on("click", function () {
						var _code = $(this).data("code");
						$dwp.core.portal.subInit({ gid: _code });
					});
				$(".dwp-dlink", _$list)
					.off("click")
					.on("click", function () {
						var _view = $(this).data("view");
						$fn.loadPage({ link: mailpath + "/wFrmView?ReadForm&view=" + _view, linktype: "PAGE" });
					});
			},

			read_show_name: function (_doc) {
				var _me = this,
					fld = ["SendTo", "CopyTo", "BlindCopyTo"],
					odata = {},
					tmp = null,
					arrval = [],
					_org = null,
					_cnt = 0,
					_cdata = { len: 0, idx: 0 };
				$.each(fld, function (ii, nm) {
					tmp = $("textarea[name='" + nm + "Full']", _doc.element).xval();
					if (tmp != "") {
						tmp = tmp.split(";");
						tmp = $.map(tmp, function (_val) {
							if ($.trim(_val) != "") return $.trim(_val);
						});
						_cdata.len = tmp.length;
						$.each(tmp, function (_ii, _val) {
							_cdata.idx = _ii;
							_org = new $dwp.ui.org.data.org($.trim(_val));
							_$$.mail.doc.org.displayNameList(_org.oinfo, nm, _doc, _cdata);
							_cnt += 1;
						});
					}
				});
				if (_doc.options.isedit == true) return; //편집상태이면 여기서 종료
				if (_cnt > 0) return; //신규 메일이면 여기서 종료

				/*##############################################################################*/
				/*		과거 메일 임시로 수신,참조,비밀참조를 표시함... */
				var MemberList = $("input[name=MemberList]", _doc.element).xval(),
					_arr = "",
					_subarr = "",
					_sendto = "",
					_copyto = "",
					_blindcopyto = "";
				if (MemberList != "") {
					_arr = MemberList.split(";");
					$.each(_arr, function (i, o) {
						_subarr = o.split("^");
						if (_subarr[0] == "[수신]") {
							_sendto += _sendto != "" ? ", " : "";
							if (_subarr[5] == "PA") {
								//개인주소록..
								_sendto += _subarr[1];
							} else if (_subarr[2] == "부서") {
								_sendto += _subarr[1];
							} else {
								_sendto += _subarr[1] + (_subarr[2] != "" ? "/" + _subarr[2] : "") + (_subarr[3] != "" ? "/" + _subarr[3] : "");
							}
							_cnt += 1;
						} else if (_subarr[0] == "[참조]") {
							_copyto += _copyto != "" ? ", " : "";
							if (_subarr[5] == "PA") {
								//개인주소록..
								_copyto += _subarr[1];
							} else if (_subarr[2] == "부서") {
								_copyto += _subarr[1];
							} else {
								_sendto += _subarr[1] + (_subarr[2] != "" ? "/" + _subarr[2] : "") + (_subarr[3] != "" ? "/" + _subarr[3] : "");
							}
							_cnt += 1;
						} else {
						}
					});
					if (_sendto != "") {
						$("div.DspSendTo", _doc.element).html(_sendto);
					}
					if (_copyto != "") {
						$("div.DspCopyTo", _doc.element).html(_copyto);
					}
				}

				if (_cnt == 0) {
					_sendto = "";
					_copyto = "";
					_blindcopyto = "";

					$.each(fld, function (ii, nm) {
						tmp = $("textarea[name='" + nm + "']", _doc.element).xval();

						if (tmp != "") {
							tmp = tmp.split(";");
							tmp = $.map(tmp, function (_val) {
								if ($.trim(_val) != "") return $.trim(_val);
							});
							_cdata.len = tmp.length;
							$.each(tmp, function (_ii, _val) {
								_cdata.idx = _ii;
								_org = new $dwp.ui.org.data.org("S^" + $.trim(_val) + "^^" + $.trim(_val) + "^^^^^^^^^^");
								_$$.mail.doc.org.displayNameList(_org.oinfo, nm, _doc, _cdata);
								_cnt += 1;
							});
						}
					});
				}
			},

			//최근 수신인 - 2023.06.19 by dwlee
			getLastSendList: function (mailpath, $list, seltype) {
				var _me = this;
				var _url = mailpath + "/wcmdpost?createdocument";

				$fn.xAjax({
					url: $fn.getProxyUrl(_url),
					method: "POST",
					data: { actiontype: "lastsendto" },
					dataType: "json",
					async: true,
					cache: false
				})
					.done(function (data) {
						//10명만 보여주자구....
						if ((data.result == "200") & (data.SendTo.length > 0)) {
							$.each(data.SendTo, function (i, rcv) {
								//최신 10명만 보여줌
								if (i < 15) {
									var _pinfo = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.USER, rcv, "^");

									console.log("_pinfo : ", _pinfo);

									var _h = "";
									if (_pinfo.empno != "") {
										_h = "<div class='item' style='margin-top:10px;margin-bottom:10px;cursor:pointer'>";
										_h += "	<div class='dwp-grouping' style='width:100%;'>";


										//좌.우 여백 추가 - 2024.09.25
										_h += '<div style="width:10px">&nbsp;</div>';

										if (seltype == "home") {
											_h += "	<div class='dwp-checkbox textless' style='width:20px;'><label><input data-category='inner' name='chk' type='checkbox' data-name='" + $dwp.core.lang.getCurMsg(_pinfo.username) + "' data-empno='" + _pinfo.empno + "' data-full='" + rcv + "' data-to='" + _pinfo.username + "' class='dwp-check'><span></span></label></div>";
										}
										_h += "	<div class='dwp-user' data-type='profile' data-userid='" + _pinfo.notesid + "' data-username='" + $dwp.core.lang.getCurMsg(_pinfo.username) + "' data-empno='" + _pinfo.empno + "' data-full='" + rcv + "' data-orgcode='" + _pinfo.orgcode + "' style='width:calc(100% - 20px);'>";
										_h += "		<div class='profile'><img src='" + $dwp.core.getPath("pic", { empno: _pinfo.empno }) + "'></div>";

										//2024.09.25
										//_h += "		<div class='profile-info' style='width:calc(100% - 45px);'>";
										_h += "		<div class='profile-info'>";

										if (seltype != "home") {
											_h += "			<div class='name' title='" + $dwp.core.lang.getCurMsg(_pinfo.username) + "'>" + $dwp.core.lang.getCurMsg(_pinfo.username) + "</div>";
										} else {
											_h += "			<div class='name' style='width:100%;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;' title='" + $dwp.core.lang.getCurMsg(_pinfo.username) + "'>" + $dwp.core.lang.getCurMsg(_pinfo.username) + "</div>";
										}
										if (seltype != "home") {
											_h += "			<div class='rank'>" + $dwp.core.lang.getCurMsg(_pinfo.pos) + "</div>";
											_h += "			<div class='team'>" + $dwp.core.lang.getCurMsg(_pinfo.orgname) + "</div>";
										}
										_h += "		</div>";
										_h += "	</div>";

										//좌.우 여백 추가 - 2024.09.25
										_h += '<div style="width:10px">&nbsp;</div>';

										_h += "	</div>";
										_h += "</div>";
									} else {
										console.log("_pinfo : ", _pinfo);
										var _name = _pinfo.username;
										_name = _name.replace(/\</gi, "&lt;");
										_name = _name.replace(/\>/gi, "&gt;");
										var _mailaddr = _$$.mail.com.extractEmail(_name);


										//메일 주소에 ' 이 들어 있는 경우 제거 - 2024.05.14 by dwlee
										_name = _name.replace(/\'/gi, "");
										_mailaddr = _mailaddr.replace(/\'/gi, "\'");
										var _tmp1 = _pinfo.username;
										var _tmp2 = rcv;
										_tmp1 = _tmp1.replace(/\'/gi, "");
										_tmp2 = _tmp2.replace(/\'/gi, "");
										_pinfo.username = _tmp1;
										rcv = _tmp2;

										_h = "<div class='item' style='margin-top:10px;cursor:pointer'>";
										_h += "	<div class='dwp-grouping' style='width:100%;'>";

										//좌.우 여백 추가 - 2024.09.25
										_h += '<div style="width:10px">&nbsp;</div>';

										if (seltype == "home") {
											_h += "	<div class='dwp-checkbox textless' style='width:20px;'><label><input data-category='outer' data-empno='' data-full='" + rcv + "' data-to='" + _pinfo.username + "' name='chk' type='checkbox' class='dwp-check'><span></span></label></div>";
										}
										_h += "	<div class='dwp-user dwp-outer' data-type='profile' data-userid='" + _pinfo.username + "' data-username='" + _mailaddr + "' data-empno='' data-full='" + rcv + "' data-orgcode='' style='width:calc(100% - 20px);'>";
										_h += "		<div class='dwp-one' style='margin-right:10px;'><span class='dwp-nmtag' style='background-color:#CCA6AC'  title='" + _pinfo.username + "'>" + _$$.mail.com.sliceVariable(_name, 4) + "</span></div>";
										_h += "		<div class='profile-info' style='width:calc(100% - 45px);'>";
										_h += "			<div class='name' style='width:100%;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;' title='" + _mailaddr + "'>" + _mailaddr + "</div>"; //mailadressonly

										_h += "			</div>";
										_h += "		</div>";

										//좌.우 여백 추가 - 2024.09.25
										_h += '<div style="width:10px">&nbsp;</div>';

										_h += "	</div>";
										_h += "</div>";
									}
									$list.append(_h);
								}
							});
							$fn.getImgError($("img", $list), { src: $fn.getPath("weblib") + "/images/common/default-person.png" });

							function removeRcv(key, del) {
								var _el = del;
								var _$target;
								$(".namepicker-target", _el).each(function () {
									var _info = $(this).data("data-org");
									if (_info.notesid == key) {
										var _item = _info,
											_val = "",
											_vlist = [],
											_org = new $dwp.ui.org.data.org(_item),
											_$fld = null,
											_$fldfull = null;
										var _fldname = ["SendTo", "CopyTo", "BlindCopyTo"];
										$.each(_fldname, function (idx, _nm) {
											_$fld = $("textarea[name='" + _nm + "']", _el);
											if (_$fld.size() > 0) {
												_vlist = _$fld.val().split(";");
												_val = $.map(_vlist, function (v, i) {
													if (v != _org.oinfo.key) {
														return v;
													}
												}).join(";");
												_$fld.val(_val);
											}
											_$fldfull = $("textarea[name='" + _nm + "Full']", _el);
											if (_$fldfull.size() > 0) {
												_vlist = _$fldfull.val().split(";");
												_val = $.map(_vlist, function (v, i) {
													if (v != _org.sinfo) {
														return v;
													}
												}).join(";");
												_$fldfull.val(_val);
											}
										});
										_$target = $(this);
									}
								});

								_$target.remove();
							}

							$("div.dwp-user", $list)
								.off("click")
								.on("click", function () {
									if (seltype == "home") {
										//메일 홈화면
										if ($(this).hasClass("dwp-outer")) {
											$dwp.core.util.setLocalStorage("dwp.mailsendto", $(this).data("to")); //LocalStorage에 수신인 정보를 저장
											$dwp.core.util.setLocalStorage("dwp.mailsendtofull", $(this).data("full")); //LocalStorage에 수신인 정보를 저장
											_$$.mail.com.newMail({ url: mailpath + "/Memo?OpenForm&newtype=localstorage_dwp.mailsendto" });
										} else {
											$dwp.ui.bizcard.init($(this));
										}
									} else {
										var _doc = $fn.getInstance("doc");
										var _del = _doc.element;
										var _id = $(this).data("userid");
										var _full = $(this).data("full");
										var _name = $(this).data("username");
										var _isdup = false;

										//메일 수신인에 추가
										var _sendTo = $("[name=SendTo]", _del).val();
										var _sendToFull = $("[name=SendToFull]", _del).val();

										//중복체크
										if (_sendTo != "") {
											var _total = _sendTo;
											if ($("[name=CopyTo]", _del).val() != "") {
												_total += ";" + $("[name=CopyTo]", _del).val();
											}
											if ($("[name=BlindCopyTo]", _del).val() != "") {
												_total += ";" + $("[name=BlindCopyTo]", _del).val();
											}
											var _totalArr = _total.split(";");
											if ($.inArray(_id, _totalArr) != -1) {
												_isdup = true;

												removeRcv(_id, _del);
												//상무님의 요청으로 클릭시 중복인 경우 제거를 하자 - 2023.06.29 by dwlee
												//_duplist.push[_name];
												//$fn.alert({msg : _name +"는 이미 수신자에 선택된 사용자입니다.($1)"});
												return;
											}
										}
										if (_sendTo != "") {
											_sendTo += ";";
											_sendToFull += ";";
										}
										_sendTo += _id;
										_sendToFull += _full;

										$("[name=SendTo]", _del).val(_sendTo);
										$("[name=SendToFull]", _del).val(_sendToFull);

										$(".target", $(".DspSendTo", _del)).remove();
										_me.read_show_name(_doc); //SendToFull, CopyToFull 정보들로 화면에 수신, 참조, 비밀참조 리스트를 표시
									}
								});

							$("div.mailaddress", $list)
								.off("click")
								.on("click", function () {
									if (seltype == "home") {
										$dwp.core.util.setLocalStorage("dwp.mailsendto", $(this).data("to")); //LocalStorage에 수신인 정보를 저장
										$dwp.core.util.setLocalStorage("dwp.mailsendtofull", $(this).data("full")); //LocalStorage에 수신인 정보를 저장
										_$$.mail.com.newMail({ url: mailpath + "/Memo?OpenForm&newtype=localstorage_dwp.mailsendto" });
									} else {
										//메일 수신인에 추가
										var _doc = $fn.getInstance("doc");
										var _del = _doc.element;
										//메일 수신인에 추가
										var _sendTo = $("[name=SendTo]", _del).val();
										var _sendToFull = $("[name=SendToFull]", _del).val();
										if (_sendTo != "") {
											_sendTo += ";";
											_sendToFull += ";";
										}
										_sendTo += $(this).data("to");
										_sendToFull += $(this).data("full");

										$("[name=SendTo]", _del).val(_sendTo);
										$("[name=SendToFull]", _del).val(_sendToFull);

										$(".target", $(".DspSendTo", _del)).remove();
										_me.read_show_name(_doc); //SendToFull, CopyToFull 정보들로 화면에 수신, 참조, 비밀참조 리스트를 표시
										//_$$.mail.org.selectSendToSet(_doc); //수신인 지정 기능 설정 (Drag & Drop, Ctrl-X & Ctrl-V 등등 기능 설정)
									}
								});
						} else {
							_h = "<div class='item' style='margin-top:10px;cursor:pointer'>";
							_h += "	<div style='width:178px;'>";
							_h += "	</div>";
							_h += "</div>";
							$list.append(_h);
						}
					})
					.fail(function (req, error) {
						console.log(req.responseText + "\n" + error);
					});
			},

			//최근 수신인 - 2023.06.19 by dwlee
			getLastSendList_bk: function (mailpath, $list, seltype) {
				var _me = this;
				var _url = mailpath + "/wcmdpost?createdocument";
				$fn.xAjax({
					url: $fn.getProxyUrl(_url),
					method: "POST",
					data: { actiontype: "lastsendto" },
					dataType: "json",
					async: true,
					cache: false
				})
					.done(function (data) {
						//10명만 보여주자구....
						if ((data.result == "200") & (data.SendTo.length > 0)) {
							$.each(data.SendTo, function (i, rcv) {
								//최신 10명만 보여줌
								if (i < 15) {
									var _pinfo = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.USER, rcv, "^");

									console.log("_pinfo : ", _pinfo);

									var _h = "";
									if (_pinfo.empno != "") {
										_h = "<div class='item' style='margin-top:10px;cursor:pointer'>";
										_h += "	<div class='dwp-grouping'>";
										if (seltype == "home") {
											_h += "	<div class='dwp-checkbox textless'><label><input data-category='inner' name='chk' type='checkbox' data-name='" + $dwp.core.lang.getCurMsg(_pinfo.username) + "' data-empno='" + _pinfo.empno + "' data-full='" + rcv + "' data-to='" + _pinfo.username + "' class='dwp-check'><span></span></label></div>";
										}
										_h += "	<div class='dwp-user' data-type='profile' data-userid='" + _pinfo.notesid + "' data-empno='" + _pinfo.empno + "' data-full='" + rcv + "' data-orgcode='" + _pinfo.orgcode + "'>";
										_h += "		<div class='profile'><img src='" + $dwp.core.getPath("pic", { empno: _pinfo.empno }) + "'></div>";

										_h += "		<div class='profile-info'>";
										_h += "			<div class='name'>" + $dwp.core.lang.getCurMsg(_pinfo.username) + "</div>";

										if (seltype != "home") {
											_h += "			<div class='rank'>" + $dwp.core.lang.getCurMsg(_pinfo.pos) + "</div>";
											_h += "			<div class='team'>" + $dwp.core.lang.getCurMsg(_pinfo.orgname) + "</div>";
										}
										_h += "		</div>";
										_h += "	</div>";

										_h += "	</div>";
										_h += "</div>";
									} else {
										console.log("_pinfo : ", _pinfo);
										var _name = _pinfo.username;
										_name = _name.replace(/\</gi, "&lt;");
										_name = _name.replace(/\>/gi, "&gt;");

										_h = "<div class='item' style='margin-top:10px;cursor:pointer'>";
										_h += "	<div class='dwp-grouping'>";
										if (seltype == "home") {
											_h += "	<div class='dwp-checkbox textless'><label><input data-category='outer' data-empno='' data-full='" + rcv + "' data-to='" + _pinfo.username + "' name='chk' type='checkbox' class='dwp-check'><span></span></label></div>";
										}
										_h += "	<div class='mailaddress' data-full='" + rcv + "' data-to='" + _pinfo.username + "'>" + _name + "</div>";
										_h += "	</div>";
										_h += "</div>";
									}
									$list.append(_h);
								}
							});
							$fn.getImgError($("img", $list), { src: $fn.getPath("weblib") + "/images/common/default-person.png" });

							$("div.dwp-user", $list)
								.off("click")
								.on("click", function () {
									if (seltype == "home") {
										//메일 홈화면
										$dwp.ui.bizcard.init($(this));
									} else {
										var _doc = $fn.getInstance("doc");
										var _del = _doc.element;
										//메일 수신인에 추가
										var _sendTo = $("[name=SendTo]", _del).val();
										var _sendToFull = $("[name=SendToFull]", _del).val();
										if (_sendTo != "") {
											_sendTo += ";";
											_sendToFull += ";";
										}
										_sendTo += $(this).data("userid");
										_sendToFull += $(this).data("full");
										$("[name=SendTo]", _del).val(_sendTo);
										$("[name=SendToFull]", _del).val(_sendToFull);

										$(".target", $(".DspSendTo", _del)).remove();
										_me.read_show_name(_doc); //SendToFull, CopyToFull 정보들로 화면에 수신, 참조, 비밀참조 리스트를 표시
									}
								});

							$("div.mailaddress", $list)
								.off("click")
								.on("click", function () {
									if (seltype == "home") {
										$dwp.core.util.setLocalStorage("dwp.mailsendto", $(this).data("to")); //LocalStorage에 수신인 정보를 저장
										$dwp.core.util.setLocalStorage("dwp.mailsendtofull", $(this).data("full")); //LocalStorage에 수신인 정보를 저장
										_$$.mail.com.newMail({ url: mailpath + "/Memo?OpenForm&newtype=localstorage_dwp.mailsendto" });
									} else {
										//메일 수신인에 추가
										var _doc = $fn.getInstance("doc");
										var _del = _doc.element;
										//메일 수신인에 추가
										var _sendTo = $("[name=SendTo]", _del).val();
										var _sendToFull = $("[name=SendToFull]", _del).val();
										if (_sendTo != "") {
											_sendTo += ";";
											_sendToFull += ";";
										}
										_sendTo += $(this).data("to");
										_sendToFull += $(this).data("full");

										$("[name=SendTo]", _del).val(_sendTo);
										$("[name=SendToFull]", _del).val(_sendToFull);

										$(".target", $(".DspSendTo", _del)).remove();
										_me.read_show_name(_doc); //SendToFull, CopyToFull 정보들로 화면에 수신, 참조, 비밀참조 리스트를 표시
										//_$$.mail.org.selectSendToSet(_doc); //수신인 지정 기능 설정 (Drag & Drop, Ctrl-X & Ctrl-V 등등 기능 설정)
									}
								});
						}
					})
					.fail(function (req, error) {
						console.log(req.responseText + "\n" + error);
					});
			},

			loadlist: function (_opt, _url, el, fid) {
				var _me = this;
				var list = _me.getList(_url, _me.DrawingList, _opt, el, fid);
			},
			loadlist_type2: function (_opt, _url, el, fid) {
				var _me = this;
				var list = _me.getList(_url, _me.DrawingList_type2, _opt, el, fid);
			},
			getList: function (_url, callback, opt, el, fid) {
				var _me = this,
					_data = null;
				$fn.xAjax({
					url: $fn.getProxyUrl(_url),
					method: "GET",
					dataType: "json",
					async: true,
					cache: false
				})
					.done(function (data) {
						if (typeof callback == "function") {
							callback(opt, data, el, fid);
						}
						_data = data;
					})
					.fail(function (req, error) {
						console.log(req.responseText + "\n" + error);
					});
			},

			DrawingList: function (opt, list, el, fid) {
				var _me = this,
					_$item = null,
					dlist = $("#" + fid, el),
					_openopt = { width: 980, isaprvportal: true },
					_html = [];
				var _pinfo = $fn.getCurUser().pinfo;
				dlist.empty();

				if (list.length == 0) {
					//_$item = $("<li class='dwp-no-result' style=\"border: none\">" + $fn.getCodeMsg("mail.msg.alt41") + "</li>").appendTo(dlist);
					_$item = $('<div class="dwp-no-result center"><img src="/tcclibs/images/common/icon-no-result.svg" alt=""><span>' + $fn.getCodeMsg("mail.msg.alt41") + "</span></div>").appendTo(dlist);
					return false;
				} else if (list.length == 1 && list[0]["@unid"] == "") {
					_$item = $('<div class="dwp-no-result center"><img src="/tcclibs/images/common/icon-no-result.svg" alt=""><span>' + $fn.getCodeMsg("mail.msg.alt41") + "</span></div>").appendTo(dlist);
					return false;
				}

				$.each(list, function (i, _data) {
					_html = [];
					var _from = $fn.getCurLangMsg(_data._fromto);
					var _class = [];
					if (!_data.hasOwnProperty("_fromto")) {
						_from = $fn.getCurLangMsg(_data._author);
					}
					if (!_data.hasOwnProperty("_fromto") && !_data.hasOwnProperty("_author")) {
						_from = $fn.getCurLangMsg(_data._fromtodata);
					}



					/*
											<div class="item" data-unid="1AEDA32850FE8CB949258B87001AAB77">
													<div class="name dwp-user" data-xlang="LC_STR" data-xlang-txt="ko:김지태,en:" data-empno="P00031" data-orgcode="">김지태</div>
													<div class="subject _link">첨부하기 우리의 소원은 통일 꿈에도 소원은 통ㄹ일</div>
														<div class="file attach bookmark"></div>
														<div class="time" data-xlang="LC_TIME" data-xlang-code="2024-08-28T04:51:18Z" data-xlang-format="relative">2024.08.28</div>
											</div>
																
					*/

					if (_data["@unid"] != "") {
						//문서UNID로 핸들링하기 위하여 수정 - 2023.07.04 by dwlee
						//_html.push("<li class='unid_" + _data["@unid"] + '\'><a href="#">');
						_html.push('<div class="item" data-unid="' + _data["@unid"] + '">');

						//할일을 메일과 구분 - 2023.07.04 by dwlee
						if (fid == "mail-list-02") {
							_html.push("<p class='name' style='font-weight:700 !important;font-size:13px !important'>" + _data._subject + "</p>");
						} else {
							//_html.push("<p class='name' style='font-weight:700 !important;font-size:13px !important'>" + _from + "</p>");
							_html.push('<div class="name dwp-user">' + _from + '</div>');
						}

						if (fid == "mail-list-01") {
							//안읽은 메일함
							_class.push("dwp-noread");
						}
						//보낸편지함은 모두 읽음으로...
						if (fid != "mail-list-06" && _data.hasOwnProperty("_isread") && _data._isread != "1") {
							_class.push("dwp-bold");
						}

						//할일을 메일과 구분 - 2023.07.04 by dwlee
						if (fid == "mail-list-02") {
/*
   by mjkim 20251112 - 글자가 안보이는 문제점 해결 
_html.push("<p class='detail_link " + _class.join(" ") + "' style='font-weight:100 !important;font-size:12px !important'>" + _data._body + "</p>");
*/
							_html.push("<p class='detail_link " + _class.join(" ") + "' style='font-weight:400 !important;font-size:12px !important'>" + _data._body + "</p>");
						} else {
							//_html.push("<p class='detail_link " + _class.join(" ") + "' style='font-weight:700 !important;font-size:15px !important'>" + _data._subject + "</p>");
							_html.push('<div class="subject _link ' + _class.join(" ") + '">' + _data._subject + '</div>');
						}

						if (_data.hasOwnProperty("_enddate")) {
						} else if (_data.hasOwnProperty("_date")) {
							//_html.push("<p class='date'>" + $dwp.core.util.formatDateTime(_data._date, "relative1") + "</span></p>");
							_html.push('<div class="time">' + $dwp.core.util.formatDateTime(_data._date, "relative") + '</div>');
						} else {
							//_html.push("<p class='date'>" + $dwp.core.util.formatDateTime(_data._created, "relative1") + "</span></p>");
							_html.push('<div class="time">' + $dwp.core.util.formatDateTime(_data._created, "relative") + '</div>');
						}

						_html.push("</div>");

						_$item = $(_html.join("")).appendTo(dlist).data("openurl", _data._openurl);

						$("[data-type='profile']", _$item)
							.off("click")
							.on("click", function () {
								$dwp.ui.bizcard.init($(this));
							});

						$(".detail_link, ._link", _$item)
							.off("click")
							.on("click", function (e) {
								$(this).removeClass("dwp-orange");

								//할일 클릭시에는 다른 화면을 띄워줘야 - 2023.07.03 by dwlee
								if (fid == "mail-list-02") {
									var dg_buttons = [];
									//기본 버튼 추가
									dg_buttons.push({
										title: $fn.getCodeMsg("comm.btn.confirm"), //취소
										css: "",
										highlight: false,
										click: function (obj) {
											obj.close();
										}
									});

									//다이아로그 창 띄움
									_url = "/dwp/com/portal/todo.nsf/simpleview/" + _data["@unid"] + "?opendocument";
									var _simpdocDialog = $fn.dialog(null, {
										modal: true,
										resizable: false,
										draggable: true,
										islangconvert: false,
										title: "할일 조회",
										width: "600",
										show: "fade", //effect
										hide: "fade", //effect
										buttons: dg_buttons,
										langpath: $fn.getPath("weblib") + "/lang/ko/sche_01.lang.js",
										content: { html: "", url: $fn.getProxyUrl(_url) },
										close: function () {
											//
										}
									});
								} else {
									//안읽은 메일함만 해당사항
									if ($(this).hasClass("dwp-noread")) {
										var _$top = $(this).closest("ul");
										$(this).closest("li").remove();
										if ($("li", _$top).size() == 0) {
											_$top.html('<li class="dwp-no-result" style="border:none">' + $fn.getCodeMsg("mail.msg.alt41") + "</li>");
										}
									}
									var _url = _data._openurl;
									if (!_data.hasOwnProperty("_openurl")) {
										_url = _pinfo.mailpath + "/0/" + _data["@unid"] + "?opendocument";
									}
									if (e.currentTarget === this) {
										$fn.openDocument(_url, {
											title: $fn.getCodeMsg("mail.title.bodyview"),
											isportal: true,
											width: $fn.getScreenInfo().doc_w * 0.8,
											dialogClass: "memo-type"
										});
									}
								}
							});
					}
				});
			},

			//2024.10.02
			DrawingList_bk: function (opt, list, el, fid) {
				var _me = this,
					_$item = null,
					dlist = $("#" + fid, el),
					_openopt = { width: 980, isaprvportal: true },
					_html = [];
				var _pinfo = $fn.getCurUser().pinfo;
				dlist.empty();
				if (list.length == 0) {
					_$item = $("<li class='dwp-no-result' style=\"border: none\">" + $fn.getCodeMsg("mail.msg.alt41") + "</li>").appendTo(dlist);
					return false;
				}

				$.each(list, function (i, _data) {
					_html = [];
					var _from = $fn.getCurLangMsg(_data._fromto);
					var _class = [];
					if (!_data.hasOwnProperty("_fromto")) {
						_from = $fn.getCurLangMsg(_data._author);
					}
					if (_data["@unid"] != "") {
						//문서UNID로 핸들링하기 위하여 수정 - 2023.07.04 by dwlee
						_html.push("<li class='unid_" + _data["@unid"] + '\'><a href="#">');

						//할일을 메일과 구분 - 2023.07.04 by dwlee
						if (fid == "sub_portlet_list_04") {
							_html.push("<p class='name' style='font-weight:700 !important;font-size:13px !important'>" + _data._subject + "</p>");
						} else {
							_html.push("<p class='name' style='font-weight:700 !important;font-size:13px !important'>" + _from + "</p>");
						}

						if (_data.hasOwnProperty("_enddate")) {
						} else if (_data.hasOwnProperty("_date")) {
							_html.push("<p class='date'>" + $dwp.core.util.formatDateTime(_data._date, "relative1") + "</span></p>");
						} else {
							_html.push("<p class='date'>" + $dwp.core.util.formatDateTime(_data._created, "relative1") + "</span></p>");
						}

						if (fid == "sub_portlet_list_00") {
							//안읽은 메일함
							_class.push("dwp-noread");
						}
						//보낸편지함은 모두 읽음으로...
						if (fid != "sub_portlet_list_03" && _data.hasOwnProperty("_isread") && _data._isread != "1") {
							_class.push("dwp-orange");
						}

						//할일을 메일과 구분 - 2023.07.04 by dwlee
						if (fid == "sub_portlet_list_04") {
							_html.push("<p class='detail_link " + _class.join(" ") + "' style='font-weight:100 !important;font-size:12px !important'>" + _data._body + "</p>");
						} else {
							_html.push("<p class='detail_link " + _class.join(" ") + "' style='font-weight:700 !important;font-size:15px !important'>" + _data._subject + "</p>");
						}

						_html.push("</a></li>");

						_$item = $(_html.join("")).appendTo(dlist).data("openurl", _data._openurl);

						$("[data-type='profile']", _$item)
							.off("click")
							.on("click", function () {
								$dwp.ui.bizcard.init($(this));
							});

						$(".detail_link", _$item)
							.off("click")
							.on("click", function (e) {
								$(this).removeClass("dwp-orange");

								//할일 클릭시에는 다른 화면을 띄워줘야 - 2023.07.03 by dwlee
								if (fid == "sub_portlet_list_04") {
									var dg_buttons = [];
									//기본 버튼 추가
									dg_buttons.push({
										title: $fn.getCodeMsg("comm.btn.confirm"), //취소
										css: "",
										highlight: false,
										click: function (obj) {
											obj.close();
										}
									});

									//다이아로그 창 띄움
									_url = "/dwp/com/portal/todo.nsf/simpleview/" + _data["@unid"] + "?opendocument";
									var _simpdocDialog = $fn.dialog(null, {
										modal: true,
										resizable: false,
										draggable: true,
										islangconvert: false,
										title: "할일 조회",
										width: "600",
										show: "fade", //effect
										hide: "fade", //effect
										buttons: dg_buttons,
										langpath: $fn.getPath("weblib") + "/lang/ko/sche_01.lang.js",
										content: { html: "", url: $fn.getProxyUrl(_url) },
										close: function () {
											//
										}
									});
								} else {
									//안읽은 메일함만 해당사항
									if ($(this).hasClass("dwp-noread")) {
										var _$top = $(this).closest("ul");
										$(this).closest("li").remove();
										if ($("li", _$top).size() == 0) {
											_$top.html('<li class="dwp-no-result" style="border:none">' + $fn.getCodeMsg("mail.msg.alt41") + "</li>");
										}
									}
									var _url = _data._openurl;
									if (!_data.hasOwnProperty("_openurl")) {
										_url = _pinfo.mailpath + "/0/" + _data["@unid"] + "?opendocument";
									}
									if (e.currentTarget === this) {
										$fn.openDocument(_url, {
											title: $fn.getCodeMsg("mail.title.bodyview"),
											isportal: true,
											width: $fn.getScreenInfo().doc_w * 0.8,
											dialogClass: "memo-type"
										});
									}
								}
							});
					}
				});
			},
			DrawingList_type2: function (opt, list, el, fid) {
				var _me = this,
					_$item = null,
					dlist = $("#" + fid, el),
					_openopt = { width: 980, isaprvportal: true },
					_html = [],
					_user = [],
					_tmpArr = [];

				dlist.empty();

				if (list.length == 0) {
					_$item = $("<li class='dwp-no-result' style=\"border: none\">" + $fn.getCodeMsg("mail.msg.alt41") + "</li>").appendTo(dlist);
					return false;
				}
				$.each(list, function (i, _data) {
					_html = [];
					_user = [];
					if ($.trim(_data["_triper"])) _user.push($fn.getCurLangMsg($.trim(_data["_triper"])));
					_tmpArr = _data["_joiner"].split(";");
					$.each(_tmpArr, function (ii, suser) {
						if ($.trim(suser) != "") _user.push($fn.getCurLangMsg($.trim(suser)));
					});
					_html.push('<li><a href="#">');
					_html.push("<p class='name' data-type='profile' data-empno='" + _data._authorempno + "'>" + $fn.getCurLangMsg(_data._author));
					_html.push("<span class='team'>" + $fn.getCurLangMsg(_data._authordept) + "</span></p>");
					_html.push("<p class='date'>" + $fn.formatDateTime(_data._created, "hdateonly") + "&nbsp; <span>" + $fn.formatDateTime(_data._created, "stime") + "</span></p>");
					_html.push("<p class='detail_link'>[" + $fn.formatDateTime(_data._startdate, "MM-DD") + "~" + $fn.formatDateTime(_data._enddate, "MM-DD") + "] " + _user.join(",") + " / " + _data._triparea + "</p>");
					_html.push("</a></li>");

					_$item = $(_html.join("")).appendTo(dlist).data("openurl", _data._openurl);

					$("[data-type='profile']", _$item)
						.off("click")
						.on("click", function () {
							$dwp.ui.bizcard.init($(this));
						});
					$(".detail_link", _$item)
						.off("click")
						.on("click", function (e) {
							if (e.currentTarget === this) {
								$fn.dialog(null, {
									modal: true,
									resizable: false,
									draggable: true,
									islangconvert: false,
									title: $fn.getCodeMsg("mail.title.simpleview"),
									width: $fn.getScreenInfo().doc_w * 0.7,
									show: "fade", //effect
									hide: "fade", //effect
									buttons: [
										{
											title: $fn.getCodeMsg("comm.btn.close"),
											css: "",
											click: function (obj) {
												obj.close();
											}
										}
									],
									langpath: $fn.getPath("weblib") + "/lang/ko/sche_01.lang.js",
									content: { html: "", url: $fn.getProxyUrl("/" + _data._dbpath + "/0/" + _data._unid + "?opendocument") },
									close: function () {
										//
									}
								});
							}
						});
				});
			},

			DrawingChartinit: function (_opt, el) {
				var _me = this;
				var _pinfo = $fn.getCurUser().pinfo;
				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_pinfo.mailpath + "/wcmdpost?openform"),
					async: true,
					dataType: "json",
					data: { actiontype: "mailcount", arg1: "($inbox_unread);alldoc", arg2: "unread" },
					success: function (data, textStatus) {
						//메일이면 - 2023.10.11 by dwlee
						if (data.hasOwnProperty("allcount")) {
							var _$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());
							//2023.10.10
							var countdata = _$$.mail.com.alldocsize(_$lnbBody);
							data["alldoc"] = countdata[0]['_size'];
							data["allcount"] = countdata[0]['_allcnt'];

							//카운트 정보를 alldocsize 함수에서 리턴 받는 것으로 변경
							//delete data["alldoc"];
							//업데이트 하지 않도록 변경 - 2023.10.11
							//delete data["allcount"];
						}

						_me.DrawingChart(_opt, el, data, "quarterChart", $fn.getCurLangMsg(_pinfo.name)); // 연차 사용현황 차트
					}
				});
			},
			DecimalToInteger: function (val, point) {
				var _val = val * 1,
					_point = point || 10;
				for (var ii = _point; ii >= 0; ii -= 1) {
					_val = _val.toFixed(ii) * 1;
				}

				console.log("_val : ", _val);
				return _val;
			},
			DrawingChart: function (_opt, el, jdata, _target, _title) {
				var _me = this,
					ctx = document.getElementById(_target);
				var _pinfo = $fn.getCurUser().pinfo;
				var _total = parseInt(_pinfo.usermailsize, 10);

				//2023.10.11 by dwlee
				//var _used = parseInt(jdata["alldoc"], 10) / 1024 / 1024;
				//_used = _used.toFixed(1);
				var _used = "";
				if (jdata.hasOwnProperty("alldoc")) {
					var _used = parseInt(jdata["alldoc"], 10) / 1024 / 1024;
					_used = _used.toFixed(1);
				} else {
					//2023.10.11 by dwlee
					var _$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());
					_used = $("span[data-linkcnt='alldoc']", _$lnbBody).text();
					_used = _used.substring(0, _used.indexOf(" MB"));
				}

				const centerDoughnutPlugin = {
					id: "annotateDoughnutCenter_" + _target,
					beforeDraw: (chart) => {
						let width = chart.width - 115;
						let height = chart.height + 25;
						let ctx = chart.ctx;
						ctx.restore();
						let fontSize = (height / 150).toFixed(2);
						//			  ctx.font = fontSize + "em sans-serif";
						ctx.font = "bold 15px sans-serif";
						ctx.textBaseline = "middle";
						let text = _total + " MB"; //표시되는 데이타
						let textX = Math.round((width - ctx.measureText(text).width) / 2);
						let textY = height / 1.87;
						ctx.fillText(text, textX, textY);
						ctx.save();

						console.log("======================================================================");
						console.log("size : ", $(".dwp-mail-util-area .state-size", el).size());
						console.log("======================================================================");

						/*	이미 좌측메뉴 카운트 정보들은 업데이트 하고 있어서 여기서는 업데이트 하지 않음 2024/12/22
						//좌측 LNB 사용량 표시 - 2023.07.03 by dwlee
						if ($(".dwp-mail-util-area .state-size", $("#W0012")).size() > 0) {
							$(".dwp-mail-util-area .state-size", $("#W0012")).html(_used + " MB");
						}
						*/
					}
				};

				var myChart = new Chart(ctx, {
					type: "doughnut",
					//			type : 'pie',
					data: {
						labels: [$fn.getCodeMsg("mail.title.usespace"), $fn.getCodeMsg("mail.title.remainspace")],
						datasets: [
							{
								label: "# of Votes",
								//data: [jdata.UseCnt, jdata.RestCnt],
								//data: [parseFloat(jdata.UseCnt), (parseFloat(jdata.TotCnt) - parseFloat(jdata.UseCnt))],
								data: [_used, _total - _used],
								//data: [(parseFloat(jdata.TotCnt) - parseFloat(jdata.RestCnt)), jdata.RestCnt],
								//data: [jdata.UseCnt, (parseFloat(jdata.TotCnt) - parseFloat(jdata.UseCnt))],
								backgroundColor: ["rgba(245, 54, 39, 0.8)", "rgba(39, 114, 245, 0.98)"],
								borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
								borderWidth: 1
								//borderWidth: 0
							}
						]
					},

					options: {
						responsive: true,
						animation: true,
						plugins: {
							legend: {
								position: "right" //left,right,bottom,top
								//						display : false,
							},
							datalabels: {
								color: "#000000",
								formatter: function (value, ctx) {
									var value = ctx.dataset.data[ctx.dataIndex];
									//var _text = value > 0 ? _me.DecimalToInteger(value / _total * 100) + '%' : 0;
									var _percent = ((value / _total) * 100).toFixed(2);
									var _text = value > 0 ? _percent + "%" : 0;
									if (typeof (value) == "string") {
										return value + "MB\n(" + _text + ")";
									} else {
										return value.toFixed(2) + "MB\n(" + _text + ")";
									}
								},
								font: {
									weight: "bold",
									size: 12
								}
							},
							title: {
								display: true,
								align: "start", //start, center(default), end
								text: _title + " " + $fn.getCodeMsg("mail.title.home"),
								color: "#000", //블랙
								font: {
									weight: "bold",
									size: 16
								}
							}
						}
					},
					plugins: [ChartDataLabels, centerDoughnutPlugin] //도넛 형태인 경우에만 centerDoughnutPlugin 사용
					//			plugins:[ChartDataLabels]
				});

				$(".img-button").on("click", function () {
					var a = document.createElement("a");
					a.href = myChart.toBase64Image();
					a.download = "my_file_name.png";
					a.click();
				});
			},
			DrawingChart_Bar: function (_opt, el, jdata, _target, _title) {
				var options = {},
					userTotal = [],
					userUse = [],
					_totcnt = 0,
					_recnt = 0;
				//debugger;
				$.each(jdata, function (ii, _jdata) {
					_totcnt = parseFloat("0" + _jdata["_totcnt"]);
					_recnt = parseFloat("0" + _jdata["_recnt"]);
					userTotal.push({ y: _totcnt, label: _jdata["_pname"] });
					userUse.push({ y: _totcnt - _recnt, label: _jdata["_pname"] });
				});

				options = {
					animationEnabled: true,
					title: {
						text: _title
					},
					axisY: {
						title_xx: "Coal (mn tonnes)"
					},
					toolTip: {
						shared: true,
						reversed: true
					},
					data: [
						{
							type: "stackedColumn",
							name: "사용연차",
							color: "#f75e52",
							showInLegend: "true",
							yValueFormatString: "#,##0일",
							dataPoints: userUse
						},
						{
							type: "stackedColumn",
							name: "총연차",
							color: "#2b75f5",
							showInLegend: "true",
							yValueFormatString: "#,##0일",
							dataPoints: userTotal
						}
					]
				};

				$("#" + _target, el).CanvasJSChart(options);
			}
		},

		//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		// 			보기 및 양식에서 공통으로 사용하는 부분
		//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

		/* com function */
		com: {
			CONST: {
				ADD_IMPOSSIBLE: ["00007851", "00007876", "00008901", "00007626", "00008829", "00007527", "57018112", "00007526", "00000001", "00000003", "00007528", "00000245", "00004330", "00000253", "00005785", "00004757", "00000264", "00007642", "00005604", "57000730", "00006528"],
				/*수신인에 추가할 수 없는 부서코드, 사용자 NotesID  =>  ["UZAZ00","ManHyun Kim/21702660/HANTA"] */
				CHKTIME: null,
				/*PC저장함 설치 상태 체크용*/
				MAILSTOREINSTALL: "0",
				/*PC저장함 설치 상태*/
				//MAILSTOREDWONLOAD_URL : "/dwp/com/work/basic_pg.nsf/wv02_created_des/4925840B002B5F34492583B30021FF95?opendocument",	/*PC저장설치프로그램 다운로드URL*/
				MAILSTOREDWONLOAD_URL: $fn.getPath("weblib") + "/file/lib/X-MailStoreY_Setup.exe",
/*
	by mjkim 20251113 개인보관함 변경
*/
				FOLDER : "W0015",														/*좌측메뉴 영구보관함 메뉴 코드 (메뉴코드 변경하지 말것)*/
				//FOLDER: "W0013",


				/*좌측메뉴 영구보관함 메뉴 코드 (메뉴코드 변경하지 말것)*/
				SEND_IMPOSSIBLE: ["XXXXXX", "Tester Kim/21702999/HANTA"],
				/*메일 발송 불가능 부서코드, 사용자 NotesID*/
				MAXCOUNT: 250,
				/*수신인 최대 카운트*/
				FORMSIZE: { width: 1000, height: 600 },
				/*메일 작성화면 Dialog 화면 기본크기*/
				MAILDOMAIN: ["@tccsteel.com", "@tccins.co.kr", "@tcceng.com", "@tcctr.com", "@tccmetal.co.kr", "@tccsc.co.kr"],
				/*외부메일주소 등록할 때 제외 도메인*/
				ORG_USER: "type^username^empno^notesid^orgcode^^^^pos^^^orgname^",
				/*ORG 데이터 간략버전(저장 및 발송할 때 필요한 데이터만 저장)*/
				ORG_DEPT: "type^orgname^^^orgcode^^^^^^comcode^dorgname^",
				ORG_GROUP: "type^groupname^^^groupcode^^^^^^^",
				MEGAATTACH: {
					/*대용량첨부 서버별 외부도메인*/ devgw: "devgw.tccins.co.kr"
				}
			},

			/* _$$.mail.com.ORG_Simple  >>  ORG 데이터 변경 (사이즈 줄이기 위해 필요한 정보만 리턴) */
			ORG_Simple: function (org, orgtype) {
				var _rtn = "",
					_obj = org.getObject(),
					_type = "";
				if (_obj["type"] == "G") {
					return org.sinfo;
				}

				function _getType(type) {
					switch (type) {
						case "B":
							return _$$.mail.com.CONST.ORG_DEPT.split("^");
							break;
						case "G":
							return _$$.mail.com.CONST.ORG_GROUP.split("^");
							break;
						case "S":
							return _$$.mail.com.CONST.ORG_USER.split("^");
							break;
					}
				}
				_type = _getType(_obj["type"]);

				$.each(_type, function (ii, nn) {
					_rtn += ii > 0 ? "^" : "";
					if (_obj.hasOwnProperty(nn)) {
						_rtn += _obj[nn];
					}
				});

				return _rtn;
			},

			//캘린더 프로파일의 메일작성 방법을 가져오는 함수 - 2020.04.14 by dwlee
			getProfile: function () {
				var _obj = { actiontype: "getmethod" };
				var _mailpath = $fn.getPath("mail");
				var _method = "1";
				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_mailpath + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: _obj,
					success: function (data, textStatus) {
						_method = data.method;
					}
				});
				return _method;
			},

			//문자열 잘라서 리턴하는 함수 - 2023.06.26 by dwlee
			sliceVariable: function (value, maxLength) {
				let byteLength = 0;
				let result = "";
				for (let i = 0; i < value.length; i++) {
					const charCode = value.charCodeAt(i);
					// 한글인 경우 2바이트 추가
					if (charCode > 127) {
						byteLength += 2;
					} else {
						byteLength += 1;
					}
					if (byteLength <= maxLength) {
						result += value.charAt(i);
					} else {
						break;
					}
				}
				return result;
			},

			//RFC822등을 메일 주소만 리턴 - 2023.06.26 by dwlee
			extractEmail: function (emailAddress) {
				emailAddress = emailAddress.replace(/\&lt;/gi, "<");
				emailAddress = emailAddress.replace(/\&gt;/gi, ">");
				const regex = /\<(.*?)\>/; // 정규 표현식
				const matches = emailAddress.match(regex); // 메일값 추출
				if (matches && matches.length > 1) {
					return " " + matches[1]; // 추출된 메일값 반환
				} else {
					return emailAddress; // 추출할 수 없을 경우 전체 이메일 반환
				}
			},

			//contextMenu 검색 - 2020.06.09 by dwlee
			searchMail: function (opt) {
				var _view = $fn.getInstance("view");
				var _el = _view.element;
				var _mailpath = $fn.getPath("mail");

				var _obj = { actiontype: "get_searchval", Arg1: opt.unid };
				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_mailpath + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: _obj,
					success: function (data, textStatus) {
						_method = data.method;
						var _$search = $(".dwp-search-form", _el);
						$("input[name='search']", _$search).xval(data.mailaddress);

						_$select = $("select", _$search);
						_$search.closest(".dwp-search-grouping").addClass("active");
						_$select.xval(opt.fieldname); //발신자 : From|AuthorName , 수신자 : SendTo|CopyTo|BlindCopyTo|SendToFull|CopyToFull|BlindCopyToFull
						$(".dwp-search-grouping .dwp-btn.search", _el).click();
					}
				});
			},

			//메일 본문에 새편지 쓰기 링크 메일 - 2025.01.09 by dwlee
			linkNewMail: function (sendto) {
				$dwp.core.util.setLocalStorage('dwp.mailsendto', sendto); //수신인 정보 넣어주기
				_$$.mail.com.newMail({ url: $fn.getPath("mail") + "/Memo?OpenForm&newtype=localstorage_dwp.mailsendto", ispop: "1" });
			},

			/* _$$.mail.com.newMail  >>  메일 작성 Dialog */
			newMail: function (opt) {
				var _opt = {},
					__width = 800,
					__height = 600,
					_winWidth = 800,
					_winHeight = 600;
				if (typeof dwpmo == "object") {
					_opt = $.extend({ link: $fn.getPath("mail") + "/Memo_mo?OpenForm", linktype: "PAGE", layer: "doc", subtype: "edit" }, opt);
					$dwp.core.mportal.loadPage(_opt);
				} else {
					(__width = $(document).width()), (__height = $(document).height());
					//_winWidth = (__width < _$$.mail.com.CONST.FORMSIZE.width ? __width : _$$.mail.com.CONST.FORMSIZE.width);
					_winWidth = __width - 308;
					//_winHeight = (__height < _$$.mail.com.CONST.FORMSIZE.height ? __height : _$$.mail.com.CONST.FORMSIZE.height);
					_winHeight = __height - 40;

					console.log("옵션 : ", _$$.mail.com.getProfile());

					_opt = $.extend({ ispop: _$$.mail.com.getProfile(), url: $fn.getPath("mail") + "/Memo?OpenForm", title: $fn.getCodeMsg("mail.title.create"), width: _winWidth, height: _winHeight }, opt);

					//보기에서 문서 멀티로 선택 후 전달하는 경우 추가 - 2020.04.14 by dwlee
					if (_opt.hasOwnProperty("multi") && _opt.multi == "y") {
						_opt.url = _opt.url + "&forwardkeys=" + _opt.ids;
					}

					//포탈에서 회신,전달시에는 dialog  창으로 - 2025.01.06 by dwlee			
					var _isportal = $(".xware-portal-wrap", $(".xware-layout")).hasClass("dwp-none");

					if (_opt.ispop == "1") {
						$fn.winopen(_opt.url, _opt.title, {});
						//Layer popup
						//포탈에서 회신,전달시에는 dialog  창으로 - 2025.01.06 by dwlee
					} else if (_opt.ispop == "2" || _isportal == false) {
						$fn.dialog(null, {
							modal: false,
							resizable: true,
							draggable: true,
							islangconvert: false,
							closeOnEscape: false,
							headerclass: "dwp-dialog-mail", //Dialog Object에 메일 전용 class 추가
							title: _opt.title,
							width: _opt.width,
							height: _opt.height,
							//position: { my: "center", at: "center+260", of: window },
							position: { my: "left", at: "bottom", of: window },
							show: "fade", //effect
							hide: "fade", //effect
							buttons: [],
							open: function (event, ui) {
								var _this = this;
								$(".ui-dialog-titlebar-close", $(_this).parent())
									.off("click")
									.on("click", function () {
										/*우측 상단의 X 버튼으로 창 닫을 때*/ $("[name=Subject]", _this).focus();
										$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm14") }).done(function () {
											/*메일작성을 취소하시겠습니까?<br>저장하지 않은 정보는 복구할 수 없습니다.*/ $("#" + $(_this).attr("id"))
												.xdialog("instance")
												.close();
										});
									});
								//예약메일 항목이 안 보이는 문제로 인한 수정 - 심규식(2019-11-06)
								$(".dwp-dialog-height", $(_this)).css("height", "100px");
							},
							content: { url: _opt.url }
						});
						//화면내 메일 쓰기
					} else {
						$dwp.core.util.loadPage({ link: _opt.url, linktype: "PAGE" });
					}
				}
			},

			/* _$$.mail.com.disableSelect  >>  메일 리스트의 왼쪽 체크박스 Drag Select 이벤트 초기화 */
			disableSelect: function (_element) {
				$(_element).each(function () {
					this.onselectstart = function () {
						return false;
					};
					this.unselectable = "on";
					$(this).css("user-select", "none");
					$(this).css("-o-user-select", "none");
					$(this).css("-moz-user-select", "none");
					$(this).css("-khtml-user-select", "none");
					$(this).css("-webkit-user-select", "none");
				});
			},

			/* _$$.mail.com.checkBoxSwipeable  >>  메일 리스트의 왼쪽 체크박스 Drag Select 이벤트 초기화 (보기화면 하단의 페이지 네비게이션 생성 이후 호출한다) */
			checkBoxSwipeable: function (_checkbox, _viewElement) {
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

				$(_checkbox)
					.filter(":checkbox")
					.closest(".check-cell")
					.mousedown(function () {
						shiftKey = true;

						var $this = $(this).find(".dwp-check");
						mousedownOn.element = $this;

						if (mousedownOn.index == -1) {
							mousedownOn.index = $(".dwp-check", _viewElement).index($this);
						}

						var _par$ = $(this).parent();
						if ($this.prop("checked")) {
							$(".dwp-check-all", _viewElement).prop("checked", false);
							_par$.removeClass("dwp-row-selected");
						} else {
							_par$.addClass("dwp-row-selected"); //선택 Class 추가 - 2020.01.15 by dwlee
						}

						$this.prop("checked", !$this.prop("checked"));
					})
					.closest(".check-cell")
					.mouseenter(function () {
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
					})
					.closest(".check-cell")
					.mouseup(function () {
						console.log("mouse up");
						shiftKey = false;
						//클릭시에는 원래 소스로 동작
					})
					.click(function (e) {
						e.preventDefault();
						return false;
					});
			},

			/* _$$.mail.com.subject_draggable  >>  메일 리스트의 왼쪽 체크박스 선택이후 보기의 제목,발신인,날짜 등을 드레그 할때 선택건수 표시 */
			subject_draggable: function (_element, _viewElement) {
				$(_element).draggable({
					appendTo: "body",
					cursor: "pointer",
					helper: function () {
						var tmp = $(".dwp-check:checked", _viewElement);
						if (tmp.size() == 0) {
							return "<span></span>";
						} else {
							return "<span id='mail-drag' class='dynatree-node'>" + $(".dwp-check:checked", _viewElement).size() + "</span>";
						}
					},
					cursorAt: { right: 30 }
				});
			},

			/* _$$.mail.com.resizeMailForm  >>  메일 작성 Dialog 발송/저장 버튼 클릭하면 최소화 또는 최대화*/
			resizeMailForm: function (_dlg, opt) {
				var _width = 0,
					_height = 0,
					_parent = null,
					_titlebar = null,
					_status = "",
					tmp = "",
					_top = "",
					_left = "";
				_width = $(document).width();
				_height = $(document).height();
				_parent = _dlg.parent();
				_titlebar = $(".ui-dialog-titlebar", _parent);
				_status = _parent.data("status") || "";

				if (opt == "up") {
					if (_status == "up") return;
					if (_status != "up") {
						_parent.data({ e_width: _parent.css("width"), e_height: _parent.css("height"), e_top: _parent.css("top"), e_left: _parent.css("left") });
					}
					_top = _parent.data("c_top") || "0px";
					_left = _parent.data("c_left") || _width / 2 - 150 + "px";
					_dlg.parent().css("height", "");
					_parent.css({ width: "300px", top: _top, left: _left });
					_dlg.hide();
				} else {
					if (_status != "up") return;
					tmp = _parent.data("e_width") || "";
					if (_status == "up") {
						_parent.data({ c_top: _parent.css("top"), c_left: _parent.css("left") });
					}
					if (tmp != "") _parent.css({ width: _parent.data("e_width"), height: _parent.data("e_height"), top: _parent.data("e_top"), left: _parent.data("e_left") });
					$("#SendProgress", _titlebar).remove();
					_dlg.show();
				}
				_parent.data("status", opt);
			},

			/* _$$.mail.com.getfield  >>  문서의 필드값을 가져오는 함수
			 * obj ={
			 * 		Arg1 : UNIDS (하나 이상일 경우 세미콜론)
			 * 		Arg2 : FieldName (하나 이상일 경우 세미콜론)
			 * }
			 * */
			getfield: function (obj) {
				var rtn = {},
					_obj = $.extend({ actiontype: "getfield", Arg1: "", Arg2: "" }, obj),
					_mailpath = $fn.getPath("mail");
				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_mailpath + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: _obj,
					success: function (data, textStatus) {
						rtn = data;
					}
				});
				return rtn;
			},

			/* _$$.mail.com.update_count  >>  메일 좌측메뉴 읽지않은 건수 업데이트*/
			update_count: function (opt) {
				var rtn = {},
					_mailpath = $fn.getPath("mail"),
					_portal = "",
					_isfolder = false;
				if (opt == "portal") {
					opt = ["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)", "alldoc"]; // "alldoc" 값은... 메일 좌측메뉴 하단의 전체 사이즈
					_portal = "portal";
				}
				if (typeof opt == "undefined") {
					opt = ["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)", "alldoc"]; // "alldoc" 값은... 메일 좌측메뉴 상단의 전체 사이즈
					_isfolder = true;
				}

				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_mailpath + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: { actiontype: "mailcount", arg1: opt.join(";"), arg2: "unread", arg3: _isfolder ? "1" : "" },
					success: function (data, textStatus) {
						if (data.hasOwnProperty("alldoc")) {
							//data["alldoc"] = _$$.mail.com.filesize(parseInt(data["alldoc"],10), {displayunit :"B"})
							var _total = parseInt(data["alldoc"], 10) / 1024 / 1024;
							data["alldoc"] = 1 > _total ? "0 MB" : _total.toFixed(1) + " MB"; //메일함 전체 용량 사이즈는 무조건 MB 단위로 표시
						}
						if (_isfolder) {
							rtn = data;
						} else {
							rtn = $dwp.core.util.exObjList(data, opt);
						}

						//메일 사이즈 구하는 방식 변경 - 2023.10.11 by dwlee
						if (rtn.hasOwnProperty("allcount")) {
							var _$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());
							//2023.10.10
							_$$.mail.com.alldocsize(_$lnbBody);

							//업데이트 하지 않도록 변경 - 2023.10.11
							delete rtn["alldoc"];
							delete rtn["allcount"];
						}
					}
				});

				//포탈 메일의 카운트가 업데이트 되지 않아서 수정 - 2017.07.03 by dwlee
				if (_portal != "portal") {
					// 2022-05-27 Layout 변경 By LHJ
					//$fn.xTrigger($("div.dwp-icon-menu"), "GnbCountRefresh", { type: "mail" });
					$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "mail" });
				}

				/*
				if ((_portal != "portal") && (typeof(portalHandler) == "function")) {		//포탈 상단 메일카운트 새로고침
					portalHandler.GNB.getMailCnt(rtn);
				}
				*/
				return rtn;
			},

			/* _$$.mail.com.update_mailcount  >>  포탈 상단의 메일카운트 업데이트 될 때 메일좌측메뉴가 있으면... 같이 업데이트 하기*/
			update_mailcount: function () {
				var _me = this,
					_rtn = _me.update_count("portal"),
					_$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());
				$.each(_rtn, function (p, v) {
					$("span[data-linkcnt='" + p + "']", _$lnbBody).text(v);
				});
			},

			/* _$$.mail.com.update_left_count  >>  좌측 메뉴의 읽지않은 메일 수 카운트를 업데이트*/
			update_left_count: function (opt) {
				var _me = this,
					_rtn = _me.update_count(opt),
					_$lnbBody = $("div.dwp-lnb", $dwp.core.getLnb());
				$.each(_rtn, function (p, v) {
					$("span[data-linkcnt='" + p + "']", _$lnbBody).text(v);
				});
			},

			//2023.10.11 by dwlee
			alldocsize: function ($lnb, callback) {
				var _curl = $fn.getPath("mail") + "/api/data/collections/name/($all)?ps=1&page=0", rtn = {};
				$dwp.core.util
					.xAjax({
						url: _curl,
						dataType: "json",
						async: false,
						cache: false
					})
					.done(function (fdata) {
						if (fdata.length > 0) {
							if (typeof fdata != "object" || typeof fdata[0] != "object") return;
							var _doccnt = fdata[0]["@siblings"]; //문서의 전체 갯수
							//2023.10.10 by dwlee
							var _url = $fn.getPath("mail") + "/api/data/collections/name/($all)?ps=1&page=" + _doccnt;
							$dwp.core.util
								.xAjax({
									url: _url,
									dataType: "json",
									async: false,
									cache: false
								})
								.done(function (data) {
									rtn = data;
									if (typeof (callback) == "function") {
										callback(data);
									}
									if (data.length > "") {
										if (typeof data != "object" || typeof data[0] != "object") return;
										if (typeof data[0]["_size"] != "number") return;
										_size = _$$.mail.com.filesize(data[0]["_size"], { displayunit: "MB" });
										$("span[data-linkcnt='alldoc']", $lnb).text(_size);
									}
								})
								.fail(function () { });
						}
					})
					.fail(function () { });
				return rtn;
			},

			/* _$$.msil.com.goPage  >>  좌측메뉴 내부메일수신 오른쪽 시스템알림메일 링크 아이콘 클릭  */
			goPage: function () {
				$fn.loadPage({ link: $fn.getPath("mail") + "/wFrmView?ReadForm&view=($Inbox_in_app)", linktype: "PAGE" });
			},

			/* _$$.mail.com.filesize  >>  보기에서 메일 사이즈 계산 */
			filesize: function (bytes, obj) {
				var bytes = parseInt(bytes, 10),
					_obj = obj != null ? $.extend({ displayunit: "default" }, obj) : { displayunit: "default" },
					displayunit = [],
					_size = 0;
				displayunit = _obj["displayunit"] == "default" ? ["B", "K", "M", "G", "T", "P"] : ["B", "KB", "MB", "GB", "TB", "PB"];
				_size = Math.floor(Math.log(bytes) / Math.log(1024));

				if (_size == "-Infinity") {
					return "0 " + displayunit[0];
				} else {
					return (bytes / Math.pow(1024, Math.floor(_size))).toFixed(1) + " " + displayunit[_size];
				}
			},

			/* _$$.mail.com.repeat_space  >>  쓰레드보기에서 position 값의 . 갯수로 들여쓰기 */
			repeat_space: function (type, v, width) {
				if (v.indexOf(".") == -1) return "";
				var _len = v.split(".").length;
				var _lvl = type == "cate" ? 2 : 1;

				//                return "<div style=\"width:" + (parseInt(parseInt(_len, 10) * 20, 10)) + "px; display:inline-block;\"></div>⇒ ";
				//                return "<div style=\"width:" + (parseInt(parseInt(_len, 10) * Number(width), 10)) + "px; display:inline-block;\"></div>"+(_len > 2?"→":"")+" ";
				return '<div style="width:' + parseInt(parseInt(_len, 10) * Number(width), 10) + 'px; display:inline-block;"></div>' + (_len > _lvl ? "→ " : "");
			},

			/* _$$.mail.com.strMiddle  >>  문자열 일부 추출하기 */
			strMiddle: function (oStr, sKey, eKey) {
				sKey = sKey.toLowerCase();
				eKey = eKey.toLowerCase();
				var i = oStr.toLowerCase().indexOf(sKey);
				if (i == -1) return "";
				var tmpStr = oStr.substr(i + sKey.length, oStr.length);
				i = tmpStr.toLowerCase().indexOf(eKey);
				if (i == -1) i = tmpStr.length;
				var tmpStr = tmpStr.substr(0, i);
				return tmpStr;
			},

			/* _$$.mail.com.leftmenuExpend  >>  좌측메뉴 서브메뉴 있을 경우 펼치기/접기  (메일 좌측 도구 메뉴에서 사용)*/
			leftmenuExpend: function () {
				var _ele = $(event.srcElement).parent(),
					_atag = $(".dwp-depth-open", _ele);
				_atag.click();
			},

			//var req_notesid = "CN=ManHyun Kim/OU=21702660/O=HANTA";
			/* _$$.mail.com.atName  >>  [CANONICALIZE] 유형의 이름에서 */
			atName: function (oName, action) {
				if ($.trim(oName) == "") return "";
				if (oName.indexOf("/") == -1) return oName;
				var arrName = oName.split("/");
				if (action == "CN") {
					return arrName[0].substr(3, arrName[0].length - 1);
				} else if (action == "O") {
					return arrName[arrName.length - 1].substr(2, arrName[arrName.length - 1].length);
				} else if (action == "Abbreviate") {
					if (oName.indexOf("CN=") != -1 && oName.indexOf("O=") != -1) {
						return oName.replace(/CN=/gi, "").replace(/OU=/gi, "").replace(/O=/gi, "");
					} else {
						return oName;
					}
				} else {
					arrName = oName.split("OU=");
					var num = action.charAt(2);
					var OUValue = arrName[arrName.length - num];
					return OUValue.substr(0, OUValue.indexOf("/"));
				}
				return "";
			},

			/* _$$.mail.com.getBrowser  >>  현재 브라우저 종류 */
			getBrowser: function () {
				var agent = navigator.userAgent.toLowerCase(),
					name = navigator.appName,
					browser = "";

				// MS 계열 브라우저를 구분하기 위함.
				if (name === "Microsoft Internet Explorer" || agent.indexOf("trident") > -1 || agent.indexOf("edge/") > -1) {
					browser = "ie";
					if (name === "Microsoft Internet Explorer") {
						// IE old version (IE 10 or Lower)
						//agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
						//browser += parseInt(agent[1],10);			//익스플로러는 공통으로 "ie" 라고만 설정한다
					} else {
						// IE 11+
						if (agent.indexOf("trident") > -1) {
							// IE 11
							//browser += 11;							//익스플로러는 공통으로 "ie" 라고만 설정한다
						} else if (agent.indexOf("edge/") > -1) {
							// Edge
							browser = "edge";
						}
					}
				} else if (agent.indexOf("safari") > -1) {
					// Chrome or Safari
					if (agent.indexOf("opr") > -1) {
						// Opera
						browser = "opera";
					} else if (agent.indexOf("chrome") > -1) {
						// Chrome
						browser = "chrome";
					} else {
						// Safari
						browser = "safari";
					}
				} else if (agent.indexOf("firefox") > -1) {
					// Firefox
					browser = "firefox";
				}

				// IE: ie7~ie11, Edge: edge, Chrome: chrome, Firefox: firefox, Safari: safari, Opera: opera
				return browser;
			},

			/* _$$.mail.com.MailStoreDownload  >>  메일좌측메뉴 메일스토어(PC저장함) 토스트 메시지의 다운로드 링크 클릭 */
			MailStoreDownload: function (lang) {
				/*
									var _openurl = _$$.mail.com.CONST.MAILSTOREDWONLOAD_URL;
									$fn.openDocument(_openurl);

				*/
				var _el = null;
				if (typeof lang == "undefined") {
					lang = $dwp.core.lang.getUserLang();
					//dialog 창으로 이쁘게 처리 - 2020.04.24 by dwlee
					var _doc_view = $fn.getInstance("doc");
					if (typeof _doc_view == "undefined") {
						_doc_view = $fn.getInstance("view").element.view("instance");
					} else {
						_doc_view = _doc_view.element.doc("instance");
					}
					console.log("1111111111111111111111111111");

					_el = _doc_view.element;
				} else {
					document.body;
				}
				var _url = "/dwp/com/sys/gwlib.nsf/plugininstall_" + lang + ".html?openpage";

				$fn.dialog(_el, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("comm.title.plugininstall"),
					width: 800,
					//height: 450,
					show: "fade", //effect
					hide: "fade", //effect
					//autoOpen: false,  //.dialog("open")호출시만 열림
					buttons: [
						{
							title: $fn.getCodeMsg("comm.title.install"),
							css: "confirm",
							click: function (_$dialog) {
								var _el = _$dialog.element;
								var _dlink = $("a.download", _el);
								$.each(_dlink, function () {
									$(this)[0].click();
								});
							}
						},
						{
							title: $fn.getCodeMsg("comm.btn.cancel"),
							css: "cancel",
							click: function (_$dialog) {
								var _el = _$dialog.element;
								$("input[name='plugin_installed']", _el).val("1"); //재귀함수 호출 중지!!!!
								_$dialog.close();
							}
						}
					],
					content: { url: _url, data: {} }
				});
			},

			//메일 스토어 설치여부 체크하는 함수 - 2020.06.16 by dwlee
			/* _$$.mail.com.MailStoreChkInstall */
			MailStoreChkInstall: function (vopt) {
				var _rtn = 1;
				var _postjson = {
					proto_ver: vopt.proto_ver,
					program_ver: vopt.pgm_ver,
					run: "MailStore_Client.exe"
				};
				$.ajax({
					url: "http://localhost:5701/command",
					type: "post",
					accept: "application/json",
					async: false,
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify(_postjson),
					dataType: "json",
					success: function (data) {
						console.log("===========data===========", data);
						// success handle
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log("===========jqXHR===========", jqXHR);
						// fail handle
						if (jqXHR.status == "404" || jqXHR.status == "0") {
							_rtn = 0;
						}
					}
				});
				return _rtn;
			},

			//메일 스토어 업그레이드 체크하는 함수 - 2020.06.16 by dwlee
			/* _$$.mail.com.MailStoreChkUpgrade */
			MailStoreChkUpgrade: function (vopt) {
				var _rtn = 0;
				var _postjson = {
					program_ver: vopt.pgm_ver,
					proto_ver: vopt.proto_ver,
					version: {
						TCCInsCommonCtl: vopt.common_ver,
						MailStore_Client: vopt.down_ver,
						MailStoreViewer_Client: vopt.viewer_ver,
						FIleDownload_Client: vopt.file_ver
					}
				};
				$.ajax({
					url: "http://localhost:5701/version",
					type: "post",
					accept: "application/json",
					async: false,
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify(_postjson),
					dataType: "json",
					success: function (data) {
						console.log("data : ", data);
						//success handle
						if (data.update == "true") {
							_rtn = 1;
						} else {
							console.log("최신버전 사용중...");
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log("===========jqXHR===========", jqXHR);
						// fail handle
					}
				});
				return _rtn;
			},

			//메일 스토어 설치 및 버전 체크 함수 - 2020.04.28 by dwlee
			/* _$$.mail.com.MailStoreValid */
			MailStoreValid: function () {
				var _rtn = 1;
				var _obj = {
					actiontype: "get_plgversion"
				};

				$fn.cmdPostEx({
					url: $fn.getProxyUrl($fn.getPath("mail") + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: _obj,
					success: function (data, textStatus) {
						var _isinstall = _$$.mail.com.MailStoreChkInstall(data);
						if (_isinstall == 1) {
							var _isupgrade = _$$.mail.com.MailStoreChkUpgrade(data);
							if (_isupgrade == 1) {
								_rtn = 0;
							}
						} else {
							_rtn = 0;
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						// fail handle
					}
				});
				//alert("_rtn==" + _rtn)
				return _rtn;
			},

			/* MailStore : Local Viewer, Mail-Donload
			 *
			 * opt : {
			 * 		type : D:다운로드, V: 뷰어
			 * 		cdb : 사용자 MailDB Path
			 * 		unids : 다운로드 대상 UNID.. (다중값 구분자는 파이프라인 "|")
			 * 	}
			 */
			/* _$$.mail.com.MailStore */
			MailStore: function (opt) {
				if (_$$.mail.com.MailStoreValid() == 0) {
					_$$.mail.com.MailStoreDownload();
					return;
				}
				_$$.mail.com.CONST.MAILSTOREINSTALL = "1";

				/* Viewer Port : 7468, Download Port : 7469 */
				var abc = function (a) { };
				window.abc = function (a) {
					/*console.log("aaaa", a)*/
				};

				clearTimeout(_$$.mail.com.CONST.CHKTIME);

				var _me = this,
					un = _me.atName($dwp.core.info.cuser.notesid, "CN"),
					_url = "",
					_doc_view = null,
					_lang = $dwp.core.lang.getUserLang(),
					_mailpath = $fn.getPath("mail");
				var arrUNID = [],
					callUNID = [],
					subUNID = "",
					subCnt = 0,
					webpush = "";

				if (opt.type == "D") {
					arrUNID = opt.unids.split("|");
					$.each(arrUNID, function (ii, uid) {
						if ($.trim(uid) != "") {
							subUNID += (subUNID != "" ? "|" : "") + $.trim(uid);
							if (ii == 0) {
								callUNID.push(subUNID);
								subUNID = "";
							}
							if ((ii + 1) % 15 == 0) {
								//15개씩 잘라서 처리
								callUNID.push(subUNID);
								subUNID = "";
							}
						}
					});
					if (subUNID != "") callUNID.push(subUNID);
					//console.log("callUNID", callUNID)
				}

				webpush = $fn.getSysinfo().webpushhost + $fn.getSysinfo().webpushurl;

				//webpush = "";		//임시 중지 (공백이면 WebPush 발송하지 않음)
				var _lang = $dwp.core.lang.getUserLang();

				_url = "TYPE=" + opt.type; //D:다운로드 V: 뷰어
				_url += "╉VER=" + (opt.type == "V" ? "3.5.1905.11" : "3.4.1904.19"); //3.1.2.14"; 										//버전 Patch시 버전 정보 수정		VER=3.1.1.1
				_url += "╉DR=$mydocument$/MailStore";
				_url += "╉DF=" + $fn.getCodeMsg("mail.title.inbox"); // 받은메일함
				_url += "╉SF=" + $fn.getCodeMsg("mail.title.outbox"); // 메일발신함
				_url += "╉UN=" + un;
				_url += "╉LANG=" + (_lang == "ko" ? "KOR" : _lang == "en" ? "ENG" : _lang == "zh" ? "CHS" : "KOR"); //언어별 코드 성수에게 전화하기 (한글 : KOR, 영어 : ENG, 중국 : CHS, 헝가리 : HUN, 인도 : IND)
				_url += "╉DEBUG=0";
				_url += "╉RTAG=1";
				_url += "╉HOST=" + location.protocol + "//" + location.hostname;
				_url += "╉BROWSER=" + _$$.mail.com.getBrowser(); //현재 브라우저 이름
				if (opt.type == "V") {
					//메일 현황은 doc이나 view가 아니라서 아래와 같이 수정함 - 2023.07.06 by dwlee
					/*
					_doc_view = $fn.getInstance("doc");
					if (typeof _doc_view == "undefined") {
						_doc_view = $fn.getInstance("view").element.view("instance");
					} else {
						_doc_view = _doc_view.element.doc("instance");
					}
					*/
					var _svrname = $fn.getName($fn.getSysinfo().server.svrnm).cn.toLowerCase();

					_url += "╉HELP=1"; // 1 값이면 이전 PC저장함 버튼표시
					_url += "╉USEUP=0";
					_url += "╉UPID=mailstore";
					_url += "╉UPD=" + location.hostname;
					_url += "╉UPURL=" + location.hostname;
					_url += "╉PATCH=" + location.protocol + "//" + location.hostname + "/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + _$$.mail.com.CONST.MAILSTOREDWONLOAD_URL + "%26popup=1";

					//메일 현황은 doc이나 view가 아니라서 아래와 같이 수정함 - 2023.07.06 by dwlee
					//_url += "╉ATTACHURL=/servlet/" + $fn.getName(_doc_view.options.sysinfo.svrnm).cn.toLowerCase() + "/fileupload?enctype=utf-8";
					_url += "╉ATTACHURL=/servlet/" + _svrname + "/fileupload?enctype=utf-8";

					_url += "╉OPENURL=/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + $dwp.core.info.cuser.pinfo.mailpath + "/wCreDoc?openagent&inherit="; //회신/전달/전체회신 URL

					_url += "╉AUTH=LtpaToken=" + encodeURIComponent($.cookie("LtpaToken"));
					_url += "╉CS=utf-8";
					_url += "╉WEBPUSHURL=" + webpush; //WebPush URL
					_url += "╉EMPNO=" + $dwp.core.info.cuser.pinfo.empno; //WebPush 발신자/수신자 사번

					//L_NAME, L_KEY는 2017-05-15 이후 추가된 프로퍼티임.
					_url += "╉L_NAME=TCC INS CORP"; //Viewer 라이센스 이름
					_url += "╉L_KEY=ADA8F810722EB7CB525DF7667DDCFF7671CEFAEEAA7BEA92EC80F175573EB625"; //Viewer 라이센스 Key
						

					_url += "╉_r=" + Math.random();
				} else if (opt.type == "D" || opt.type == "S") {
					// "D" : 보기에서 선택 후 일반 다운로드, "S" : 검색결과 일괄 다운로드
					//_url += "╉ADDMSG=" + $fn.getCodeMsg("mail.data.cmt06"); //로컬보관 처리되었습니다.\n메일 목록 하단의 [새로고침]버튼을 눌러 주시기 바랍니다.
					_url += "╉ADDMSG=";
					_url += "╉ENCHD=1"; //아웃룩 텍스트 깨짐 현상에 대한 인코딩 옶션(1로 주면 from cc같은거 인코딩함)
					_url += "╉DMODE=0"; //"다운로드 후 삭제 " 옵션 (0:체크없이 표시만, 1: 체크자동설정)
					_url += "╉URL=" + $fn.getPath("mail") + "/Mailstore_V3";
					_url += "╉PATCH=" + location.protocol + "//" + location.hostname + "/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + _$$.mail.com.CONST.MAILSTOREDWONLOAD_URL + "%26popup=1";
					_url += "╉AUTH=LtpaToken=" + encodeURIComponent($.cookie("LtpaToken"));

					_url += "╉DELURL=" + _mailpath + "/wcmdpost?createdocument&actiontype=del_temp"; //PostData  ==>>  { postdata : "UNID;UNID" }
					_url += "╉CS=utf-8";
					_url += "╉WEBPUSHURL=" + webpush; //WebPush URL
					_url += "╉EMPNO=" + $dwp.core.info.cuser.pinfo.empno; //WebPush 발신자/수신자 사번
					_url += "╉_r=" + Math.random();
					if (opt.type == "D") {
						//보기에서 일반 다운로드
						_url += "╉UNID=" + callUNID[0];
						_url += "╉TITLE=" + _mailpath + "/MailstoreXML_V3?readform&charset=utf-8&unids=";
					} else {
						//검색결과에서 일괄 다운로드
						_url += "╉UNID=";
						_url += "╉TITLE=";
						_url += "╉SURL=" + _mailpath + "/MailstoreXML_V3?readform&charset=utf-8&view=" + opt.viewalias + "&query=" + opt.searchqry; //query 검색어 정보는 무조건 URL 끝에 붙여야 한다
					} //메일스토어에서 "query=" 이후는 무조건 검색어로 처리한다
				} else if (opt.type == "F") {
					//_url += "╉ADDMSG=" + $fn.getCodeMsg("mail.data.cmt06"); //로컬보관 처리되었습니다.\n메일 목록 하단의 [새로고침]버튼을 눌러 주시기 바랍니다.
					_url += "╉ADDMSG=";
					_url += "╉DPOS=3"; //날짜 순서
					_url += "╉TPOS=2"; //타이틀 순서
					_url += "╉ENCHD=1"; //아웃룩 텍스트 깨짐 현상에 대한 인코딩 옶션(1로 주면 from cc같은거 인코딩함)
					_url += "╉DMODE=0"; //"다운로드 후 삭제 " 옵션 (0:체크없이 표시만, 1: 체크자동설정)
					_url += "╉URL=" + _mailpath + "/Mailstore_V3";
					_url += "╉TITLE=" + _mailpath + "/MailstoreXML_V3?readform&charset=utf-8&unids=";
					_url += "╉AUTH=LtpaToken=" + encodeURIComponent($.cookie("LtpaToken"));

					_url += "╉DELURL=" + _mailpath + "/wcmdpost?createdocument&actiontype=del_temp"; //PostData  ==>>  { postdata : "UNID;UNID" }
					_url += "╉CS=utf-8";
					_url += "╉WEBPUSHURL=" + webpush; //WebPush URL
					_url += "╉EMPNO=" + $dwp.core.info.cuser.pinfo.empno; //WebPush 발신자/수신자 사번
					_url += "╉FURL=" + _mailpath + "/($FolderInfo)?ReadViewEntries&count=9999";
					_url += "╉VURL=" + _mailpath + "/%s?ReadViewEntries&count=99999";
					_url += "╉UNID=" + opt.funid;
					_url += "╉_r=" + Math.random();
				} else {
				}

				var _postjson = {
					proto_ver: "1.0",
					program_ver: "3.0.2",
					run: "MailStore_Client.exe",
					cookie: "LtpaToken=" + $.cookie("LtpaToken"),
					language: _lang == "ko" ? "KOR" : _lang == "en" ? "ENG" : _lang == "zh" ? "CHS" : "KOR",
					cmd: $.base64Encode(_url)
				};

				$.ajax({
					url: "http://localhost:5701/command",
					type: "post",
					accept: "application/json",
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify(_postjson),
					dataType: "json",
					success: function (data) {
						// success handle
						//_$$.mail.com.CONST.MAILSTOREINSTALL = "1";
					},
					error: function (jqXHR, textStatus, errorThrown) {
						// fail handle
						console.log("jqXHR", jqXHR);
						if (jqXHR.status == "404" || jqXHR.status == "0") {
							//$dwp.app.mail.com.MailStoreDownload();
						}
					}
				});

				var checkcount = 0;
				if (opt.type == "D") {
					if (callUNID.length > 1) {
						//보기에서 다운로드할 때 15개씩 나눠서 정보를 호출
						var mailStoreCall = function (callCount) {
							$fn.xAjax({
								url: "http://localhost:7469/addUNID?unid=" + callUNID[callCount],
								dataType: "jsonp",
								cache: false,
								async: true,
								jsonpCallback: "abc"
							})
								.done(function (data) {
									callCount += 1;
									if (callUNID.length > callCount) {
										mailStoreCall(callCount);
									}
								})
								.fail(function () {
									checkcount += 1;
									if (checkcount < 10) {
										setTimeout(function () {
											mailStoreCall(callCount);
										}, 100);
									}
								});
						};
						setTimeout(function () {
							mailStoreCall(1);
						}, 10);
					}
				}
			},
			_MailStore: function (opt) {
				/* Viewer Port : 7468, Download Port : 7469 */
				var abc = function (a) { };
				window.abc = function (a) {
					/*console.log("aaaa", a)*/
				};
				clearTimeout(_$$.mail.com.CONST.CHKTIME);

				var _me = this,
					un = _me.atName($dwp.core.info.cuser.notesid, "CN"),
					_url = "",
					_doc_view = null,
					_lang = $dwp.core.lang.getUserLang(),
					_mailpath = $fn.getPath("mail");
				var arrUNID = [],
					callUNID = [],
					subUNID = "",
					subCnt = 0,
					webpush = "";

				if (opt.type == "D") {
					arrUNID = opt.unids.split("|");
					$.each(arrUNID, function (ii, uid) {
						if ($.trim(uid) != "") {
							subUNID += (subUNID != "" ? "|" : "") + $.trim(uid);
							if (ii == 0) {
								callUNID.push(subUNID);
								subUNID = "";
							}
							if ((ii + 1) % 15 == 0) {
								//15개씩 잘라서 처리
								callUNID.push(subUNID);
								subUNID = "";
							}
						}
					});
					if (subUNID != "") callUNID.push(subUNID);
					//console.log("callUNID", callUNID)
				}

				webpush = $fn.getSysinfo().webpushhost + $fn.getSysinfo().webpushurl;
				//webpush = "";		//임시 중지 (공백이면 WebPush 발송하지 않음)

				_url = "TYPE=" + opt.type; //D:다운로드 V: 뷰어
				_url += "╉VER=" + (opt.type == "V" ? "3.5.1905.11" : "3.4.1904.19"); //3.1.2.14"; 										//버전 Patch시 버전 정보 수정		VER=3.1.1.1
				_url += "╉DR=$mydocument$/MailStore";
				_url += "╉DF=" + $fn.getCodeMsg("mail.title.inbox"); // 받은메일함
				_url += "╉SF=" + $fn.getCodeMsg("mail.title.outbox"); // 메일발신함
				_url += "╉UN=" + un;
				_url += "╉LANG=" + (_lang == "ko" ? "KOR" : _lang == "en" ? "ENG" : _lang == "hu" ? "HUN" : _lang == "in" ? "IND" : _lang == "zh" ? "CHS" : "KOR"); //언어별 코드 성수에게 전화하기 (한글 : KOR, 영어 : ENG, 중국 : CHS, 헝가리 : HUN, 인도 : IND)
				_url += "╉DEBUG=0";
				_url += "╉RTAG=1";
				_url += "╉HOST=http://" + location.hostname;
				_url += "╉BROWSER=" + _$$.mail.com.getBrowser(); //현재 브라우저 이름

				if (opt.type == "V") {
					_doc_view = $fn.getInstance("doc");
					if (typeof _doc_view == "undefined") {
						_doc_view = $fn.getInstance("view").element.view("instance");
					} else {
						_doc_view = _doc_view.element.doc("instance");
					}
					_url += "╉HELP=1"; // 1 값이면 이전 PC저장함 버튼표시
					_url += "╉USEUP=0";
					_url += "╉UPID=mailstore";
					_url += "╉UPD=" + location.hostname;
					_url += "╉UPURL=" + location.hostname;
					//_url += "╉PATCH=http://" + location.hostname + ":8080/xnotify.nsf/mailstore/download?opendocument";
					_url += "╉PATCH=http://" + location.hostname + "/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + _$$.mail.com.CONST.MAILSTOREDWONLOAD_URL + "%26popup=1";
					_url += "╉ATTACHURL=/servlet/" + $fn.getName(_doc_view.options.sysinfo.svrnm).cn.toLowerCase() + "/fileupload?enctype=utf-8";
					_url += "╉OPENURL=/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + $dwp.core.info.cuser.pinfo.mailpath + "/wCreDoc?openagent&inherit="; //회신/전달/전체회신 URL
					//_url += "╉AUTH=LtpaToken2=" + encodeURIComponent($.cookie("LtpaToken2")); //정장훈 수정

					_url += "╉AUTH=LtpaToken=" + encodeURIComponent($.cookie("LtpaToken"));
					_url += "╉CS=utf-8";
					_url += "╉WEBPUSHURL=" + webpush; //WebPush URL
					_url += "╉EMPNO=" + $dwp.core.info.cuser.pinfo.empno; //WebPush 발신자/수신자 사번

					//L_NAME, L_KEY는 2017-05-15 이후 추가된 프로퍼티임.
					_url += "╉L_NAME=TCC INS CORP"; //Viewer 라이센스 이름
					_url += "╉L_KEY=ADA8F810722EB7CB525DF7667DDCFF7671CEFAEEAA7BEA92EC80F175573EB625"; //Viewer 라이센스 이름

					_url += "╉_r=" + Math.random();
				} else if (opt.type == "D" || opt.type == "S") {
					// "D" : 보기에서 선택 후 일반 다운로드, "S" : 검색결과 일괄 다운로드
					//_url += "╉ADDMSG=" + $fn.getCodeMsg("mail.data.cmt06"); //로컬보관 처리되었습니다.\n메일 목록 하단의 [새로고침]버튼을 눌러 주시기 바랍니다.
					_url += "╉ADDMSG=";
					_url += "╉ENCHD=1"; //아웃룩 텍스트 깨짐 현상에 대한 인코딩 옶션(1로 주면 from cc같은거 인코딩함)
					_url += "╉DMODE=0"; //"다운로드 후 삭제 " 옵션 (0:체크없이 표시만, 1: 체크자동설정)
					_url += "╉URL=" + $fn.getPath("mail") + "/Mailstore_V3";
					_url += "╉PATCH=http://" + location.hostname + "/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + _$$.mail.com.CONST.MAILSTOREDWONLOAD_URL + "%26popup=1";
					//_url += "╉AUTH=LtpaToken2=" + encodeURIComponent($.cookie("LtpaToken2")); //정장훈 수정
					_url += "╉AUTH=LtpaToken=" + encodeURIComponent($.cookie("LtpaToken"));

					_url += "╉DELURL=" + _mailpath + "/wcmdpost?createdocument&actiontype=del_temp"; //PostData  ==>>  { postdata : "UNID;UNID" }
					_url += "╉CS=utf-8";
					_url += "╉WEBPUSHURL=" + webpush; //WebPush URL
					_url += "╉EMPNO=" + $dwp.core.info.cuser.pinfo.empno; //WebPush 발신자/수신자 사번
					_url += "╉_r=" + Math.random();
					if (opt.type == "D") {
						//보기에서 일반 다운로드
						_url += "╉UNID=" + callUNID[0];
						_url += "╉TITLE=" + _mailpath + "/MailstoreXML_V3?readform&charset=utf-8&unids=";
					} else {
						//검색결과에서 일괄 다운로드
						_url += "╉UNID=";
						_url += "╉TITLE=";
						_url += "╉SURL=" + _mailpath + "/MailstoreXML_V3?readform&charset=utf-8&view=" + opt.viewalias + "&query=" + opt.searchqry; //query 검색어 정보는 무조건 URL 끝에 붙여야 한다
					} //메일스토어에서 "query=" 이후는 무조건 검색어로 처리한다
				} else if (opt.type == "F") {
					//_url += "╉ADDMSG=" + $fn.getCodeMsg("mail.data.cmt06"); //로컬보관 처리되었습니다.\n메일 목록 하단의 [새로고침]버튼을 눌러 주시기 바랍니다.
					_url += "╉ADDMSG=";
					_url += "╉DPOS=3"; //날짜 순서
					_url += "╉TPOS=2"; //타이틀 순서
					_url += "╉ENCHD=1"; //아웃룩 텍스트 깨짐 현상에 대한 인코딩 옶션(1로 주면 from cc같은거 인코딩함)
					_url += "╉DMODE=0"; //"다운로드 후 삭제 " 옵션 (0:체크없이 표시만, 1: 체크자동설정)
					_url += "╉URL=" + _mailpath + "/Mailstore_V3";
					_url += "╉TITLE=" + _mailpath + "/MailstoreXML_V3?readform&charset=utf-8&unids=";
					//_url += "╉AUTH=LtpaToken2=" + encodeURIComponent($.cookie("LtpaToken2"));
					_url += "╉AUTH=LtpaToken=" + encodeURIComponent($.cookie("LtpaToken"));

					_url += "╉DELURL=" + _mailpath + "/wcmdpost?createdocument&actiontype=del_temp"; //PostData  ==>>  { postdata : "UNID;UNID" }
					_url += "╉CS=utf-8";
					_url += "╉WEBPUSHURL=" + webpush; //WebPush URL
					_url += "╉EMPNO=" + $dwp.core.info.cuser.pinfo.empno; //WebPush 발신자/수신자 사번
					_url += "╉FURL=" + _mailpath + "/($FolderInfo)?ReadViewEntries&count=9999";
					_url += "╉VURL=" + _mailpath + "/%s?ReadViewEntries&count=99999";
					_url += "╉UNID=" + opt.funid;
					_url += "╉_r=" + Math.random();
				} else {
				}
				//console.log("mailstore_url", "xmailstore://" + _url);
				_url = "xmailstore://" + encodeURIComponent($.base64Encode(_url)); // + encodeURIComponent(opt.searchqry) + "╉_r=" + Math.random();

				if ($("#iMailStore").size() > 0) {
					$("#iMailStore").remove();
				}
				$('<iframe id="iMailStore" src="' + _url + '" style="display:none;width:0;height:0;"></iframe>').appendTo($("body"));
				var call_count = 0;
				var chkfnc = function (call_count) {
					//console.log("call_count", call_count)
					if (_$$.mail.com.CONST.MAILSTOREINSTALL == "1") return;
					$fn.xAjax({
						url: "http://localhost:" + (opt.type == "V" ? "7468" : "7469") + "/install?callback=abc",
						dataType: "jsonp",
						cache: false,
						async: false,
						jsonpCallback: "abc"
					})
						.done(function (data) {
							if (data.hasOwnProperty("install")) {
								//$dwp.core.util.setLocalStorage("mailstore", "1");
								_$$.mail.com.CONST.MAILSTOREINSTALL = "1";
								clearTimeout(_$$.mail.com.CONST.CHKTIME);
							}
							//console.log("mailstore - install - ok", data)
							//$dwp.core.util.setLocalStorage("dwp.mailsendto", sendto);
						})
						.fail(function (a) {
							call_count += 1;
							if (call_count < 10) {
								if (_$$.mail.com.CONST.MAILSTOREINSTALL != "1") {
									_$$.mail.com.CONST.CHKTIME = setTimeout(function () {
										chkfnc();
									}, 1500); //MailStore 설치여부 확인시작
								}
								return;
							}
							if (a.status == 404) $dwp.app.mail.com.MailStoreDownload(); //설치된 Local - MailStore를 찾지 못할 경우 설치 페이지 오픈
						});
					//console.log("mailstore - install - check")
				};

				var checkcount = 0;
				if (opt.type == "D") {
					//console.log("callUNID.length", callUNID.length)
					if (callUNID.length > 1) {
						//보기에서 다운로드할 때 15개씩 나눠서 정보를 호출
						//console.log("callUNID", callUNID)
						var mailStoreCall = function (callCount) {
							//console.log("callCount [" + callCount + "]", callUNID[callCount])
							$fn.xAjax({
								url: "http://localhost:7469/addUNID?unid=" + callUNID[callCount],
								dataType: "jsonp",
								cache: false,
								async: true,
								jsonpCallback: "abc"
							})
								.done(function (data) {
									//debugger;
									//console.log("callCount - " + callCount, data)
									//if ($dwp.core.info.cuser.pinfo.empno == "21702660") {
									callCount += 1;
									//console.log("count", callUNID.length +"__"+ callCount)
									if (callUNID.length > callCount) {
										//console.log("callCount ---- " + (callCount-1))
										mailStoreCall(callCount);
										//setTimeout(function() {mailStoreCall(callCount);}, 10);
									} else {
										//console.log("count - 1", callUNID.length +"__"+ callCount)
										if (_$$.mail.com.CONST.MAILSTOREINSTALL != "1") {
											_$$.mail.com.CONST.CHKTIME = setTimeout(function () {
												chkfnc();
											}, 1500); //MailStore 설치여부 확인시작
										}
									}
									//}
								})
								.fail(function () {
									//console.log("Fail -- callCount - " + callCount)
									checkcount += 1;
									if (checkcount < 10) {
										//console.log("Fail -- callCount - recall" + callCount)
										setTimeout(function () {
											mailStoreCall(callCount);
										}, 100);
									} else {
										if (_$$.mail.com.CONST.MAILSTOREINSTALL != "1") {
											//여기 실행해야 함
											_$$.mail.com.CONST.CHKTIME = setTimeout(function () {
												chkfnc();
											}, 1500); //MailStore 설치여부 확인시작
										}
									}
								});
							/*
							if ($dwp.core.info.cuser.pinfo.empno != "21702660") {
								callCount += 1;
								//console.log("count", callUNID.length +"__"+ callCount)
								if (callUNID.length > callCount) {
									console.log("callCount ---- " + (callCount-1))
									setTimeout(function() {mailStoreCall(callCount);}, 100);
								} else {
									//console.log("count - 1", callUNID.length +"__"+ callCount)
									if (_$$.mail.com.CONST.MAILSTOREINSTALL != "1") {
										_$$.mail.com.CONST.CHKTIME = setTimeout(function() { chkfnc() }, 1500);		//MailStore 설치여부 확인시작
									}
								}
							}
							*/
						};
						//setTimeout(function() {mailStoreCall(1);}, 2000);
						setTimeout(function () {
							mailStoreCall(1);
						}, 10);
					} else {
						if (_$$.mail.com.CONST.MAILSTOREINSTALL != "1") {
							//console.log("MAILSTORE - 2", _$$.mail.com.CONST.MAILSTOREINSTALL)
							_$$.mail.com.CONST.CHKTIME = setTimeout(function () {
								chkfnc();
							}, 1500); //MailStore 설치여부 확인시작
						}
					}
				} else if (opt.type == "V") {
					if (_$$.mail.com.CONST.MAILSTOREINSTALL != "1") {
						_$$.mail.com.CONST.CHKTIME = setTimeout(function () {
							chkfnc();
						}, 1500); //MailStore 설치여부 확인시작
					}
				} else {
				}
			},

			/* _$$.mail.com.cmdpost */
			cmdpost: function (postdata, callback) {
				$fn.cmdPost(
					$dwp.core.util.getProxyUrl($fn.getPath("mail") + "/wcmdpost?createdocument"),
					postdata,
					function (data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (typeof callback == "function") callback(postdata, data);
								return;
							}
						}
						if (data.hasOwnProperty("msgcode")) {
							if (data.msgcode.indexOf(".") != -1) {
								$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
								return;
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") }); //작업을 완료 할 수 없습니다
							}
						} else {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") }); //작업을 완료 할 수 없습니다
						}
					},
					"json"
				);
			},

			/* _$$.mail.com.getSenderInfo  >>  회신/전달 형식으로 화면 열릴 때 원본 메일의 발신,수신,참조,제목 등 본문에 넣어줄 데이터 추출 */
			getSenderInfo: function (doc) {
				var rtn = "",
					_tmpele = doc.element,
					_frominfo = [],
					_tmp = "",
					_from = "",
					_sendto = "",
					_copyto = "",
					_arr = [],
					_sub = "";
				_tmp = $fn.getCurLangMsg($("#tmp_name", _tmpele).xval());
				if (_tmp != "") _frominfo.push(_tmp);
				_tmp = $fn.getCurLangMsg($("#tmp_rank", _tmpele).xval());
				if (_tmp != "") _frominfo.push(_tmp);
				_tmp = $fn.getCurLangMsg($("#tmp_team", _tmpele).xval());
				if (_tmp != "") _frominfo.push(_tmp);
				//20220901 회신 시 본문내용 중 발신자 누락됨
				//_from = $.trim($("#tmp_extfrom", _tmpele).xval());
				_from = $.trim($("#tmp_from", _tmpele).xval());
				_from = (_from == "" ? _frominfo.join("/") : _from).replace(/</g, "&lt;").replace(/>/g, "&gt;");

				function getDisName(nm) {
					_tmp = $.trim($("#tmp_" + nm + "full", _tmpele).xval());
					_sub = "";
					if (_tmp != "") {
						_arr = _tmp.split(";");
						$.each(_arr, function (_i, _o) {
							if ($.trim(_o) != "") {
								var _org = new $dwp.ui.org.data.org($.trim(_o)); //내부 메일
								_sub += _sub != "" ? ", " : "";
								_sub += _$$.mail.doc.org.getDispName(_org.oinfo, true);
							}
						});
					} else {
						_sub = $.trim($("#tmp_" + nm, _tmpele).xval()).replace(/;/g, ", "); //외부 메일
					}
					return _sub.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				}
				_sendto = getDisName("sendto");
				_copyto = getDisName("copyto");

				rtn += '<p style="font-size:9pt;">&nbsp;</p><p style="font-size:9pt;">&nbsp;</p>';
				rtn += '<p style="font-size:9pt;">​-----------------<b>' + $fn.getCodeMsg("mail.title.receivemailinfo") + "</b>----------------- </p>"; //받은메일 내용
				rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.delivereddate") + " : </b>" + $("#tmp_date", _tmpele).xval() + "</p>"; //발신일자
				rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.from") + " : </b>" + _from + "</p>"; //발신
				rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.sendto") + " : </b>" + _sendto + "</p>"; //수신
				rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.copyto") + " : </b>" + _copyto + "</p>"; //참조
				rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.subject") + " : </b>" + $("#tmp_subject", _tmpele).xval() + "</p>"; //제목
				rtn += '<p style="font-size:9pt;">&nbsp;</p>';
				return rtn;
			},

			/* _$$.mail.com.getSenderInfo_multi  >>  회신/전달 형식으로 화면 열릴 때 원본 메일의 발신,수신,참조,제목 등 본문에 넣어줄 데이터 추출 */
			//멀티문서 전달용 함수 - 2020.04.14 by dwlee
			getSenderInfo_multi: function (docid) {
				var rtn = "";

				function getDisName(fdata) {
					_tmp = $.trim(fdata);
					_sub = "";
					if (_tmp != "") {
						_arr = _tmp.split(";");
						$.each(_arr, function (_i, _o) {
							if ($.trim(_o) != "") {
								var _org = new $dwp.ui.org.data.org($.trim(_o)); //내부 메일
								_sub += _sub != "" ? ", " : "";
								_sub += _$$.mail.doc.org.getDispName(_org.oinfo, true);
							}
						});
					} else {
						_sub = $.trim(fdata).replace(/;/g, ", "); //외부 메일
					}
					return _sub.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				}
				var _obj = {
					actiontype: "multi_forward_head",
					Arg1: docid
				};
				$fn.cmdPostEx({
					url: $fn.getProxyUrl($fn.getPath("mail") + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: _obj,
					success: function (docinfo, textStatus) {
						var _frominfo = [],
							_tmp = "",
							_from = "",
							_sendto = "",
							_copyto = "",
							_arr = [],
							_sub = "";

						_tmp = $fn.getCurLangMsg(docinfo.sender_name);
						if (_tmp != "") _frominfo.push(_tmp);
						_tmp = $fn.getCurLangMsg(docinfo.sender_rank);
						if (_tmp != "") _frominfo.push(_tmp);
						_tmp = $fn.getCurLangMsg(docinfo.sender_team);
						if (_tmp != "") _frominfo.push(_tmp);
						_from = $.trim(docinfo.sender_extfrom);
						_from = (_from == "" ? _frominfo.join("/") : _from).replace(/</g, "&lt;").replace(/>/g, "&gt;");

						_sendto = getDisName(docinfo.sendto);
						_copyto = getDisName(docinfo.copyto);

						rtn += '<p style="font-size:9pt;">&nbsp;</p><p style="font-size:9pt;">&nbsp;</p>';
						rtn += '<p style="font-size:9pt;">​-----------------<b>' + $fn.getCodeMsg("mail.title.receivemailinfo") + "</b>----------------- </p>"; //받은메일 내용
						rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.delivereddate") + " : </b>" + docinfo.receive_date + "</p>"; //발신일자
						rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.from") + " : </b>" + _from + "</p>"; //발신
						rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.sendto") + " : </b>" + _sendto + "</p>"; //수신
						rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.copyto") + " : </b>" + _copyto + "</p>"; //참조
						rtn += '<p style="font-size:9pt;">​<b>' + $fn.getCodeMsg("mail.title.subject") + " : </b>" + docinfo.subject + "</p>"; //제목
						rtn += '<p style="font-size:9pt;">&nbsp;</p>';
					}
				});
				return rtn;
			},

			/* _$$.mail.com.KeyCodeSet */
			KeyCodeSet: function (tval) {
				/*
				return : {
					kor : 한글 단축 문자
					eng : 영문 단축 문자
				}
				 */

				/*
				가	44032, 나	45208, 다	45796, 라	46972, 마	47560, 바	48148, 사	49324
				아	50500, 자	51088, 차	52264, 카	52852, 타	53440, 파	54028, 하	54616, 힝	55197
				 */

				var SortKey = "",
					SortKeyEnglish = "",
					code = "",
					tmp = "",
					rtn = { ko: "", en: "" };
				if (tval == "") {
					return rtn;
				}

				code = tval.charCodeAt(0);

				if (code >= 44032 && code < 45208) {
					SortKey = "가";
				} else if (code >= 45208 && code < 45796) {
					SortKey = "나";
				} else if (code >= 45796 && code < 46972) {
					SortKey = "다";
				} else if (code >= 46972 && code < 47560) {
					SortKey = "라";
				} else if (code >= 47560 && code < 48148) {
					SortKey = "마";
				} else if (code >= 48148 && code < 49324) {
					SortKey = "바";
				} else if (code >= 49324 && code < 50500) {
					SortKey = "사";
				} else if (code >= 50500 && code < 51088) {
					SortKey = "아";
				} else if (code >= 51088 && code < 52264) {
					SortKey = "자";
				} else if (code >= 52264 && code < 52852) {
					SortKey = "차";
				} else if (code >= 52852 && code < 53440) {
					SortKey = "카";
				} else if (code >= 53440 && code < 54028) {
					SortKey = "타";
				} else if (code >= 54028 && code < 54616) {
					SortKey = "파";
				} else if (code >= 54616 && code < 55198) {
					SortKey = "하";
				} else {
					SortKey = "";
					tmp = tval.substr(0, 1).toUpperCase();
					if ("A" <= tmp && tmp <= "Z") {
						SortKey = "AZ";
					}
					if ("0" <= tmp && tmp <= "9") {
						SortKey = "숫자";
					}
					if (SortKey == "") {
						SortKey = "기타";
					}
				}
				rtn["ko"] = SortKey;

				code = tval.substr(0, 1).toUpperCase();
				switch (code) {
					case "A":
						SortKeyEnglish = "A";
						break;
					case "B":
						SortKeyEnglish = "B";
						break;
					case "C":
						SortKeyEnglish = "C";
						break;
					case "D":
						SortKeyEnglish = "D";
						break;
					case "E":
						SortKeyEnglish = "E";
						break;
					case "F":
						SortKeyEnglish = "F";
						break;
					case "G":
						SortKeyEnglish = "G";
						break;
					case "H":
						SortKeyEnglish = "H";
						break;
					case "I":
						SortKeyEnglish = "I";
						break;
					case "J":
						SortKeyEnglish = "J";
						break;
					case "K":
						SortKeyEnglish = "K";
						break;
					case "L":
						SortKeyEnglish = "L";
						break;
					case "M":
						SortKeyEnglish = "M";
						break;
					case "N":
						SortKeyEnglish = "N";
						break;
					case "O":
						SortKeyEnglish = "O";
						break;
					case "P":
						SortKeyEnglish = "P";
						break;
					case "Q":
						SortKeyEnglish = "Q";
						break;
					case "R":
						SortKeyEnglish = "R";
						break;
					case "S":
						SortKeyEnglish = "S";
						break;
					case "T":
						SortKeyEnglish = "T";
						break;
					case "U":
						SortKeyEnglish = "U";
						break;
					case "V":
						SortKeyEnglish = "V";
						break;
					case "W":
						SortKeyEnglish = "W";
						break;
					case "X":
						SortKeyEnglish = "X";
						break;
					case "Y":
						SortKeyEnglish = "Y";
						break;
					case "Z":
						SortKeyEnglish = "Z";
						break;
					default:
						SortKeyEnglish = "";
						tmp = tval.substr(0, 1).toUpperCase();
						if ("0" <= tmp && tmp <= "9") {
							SortKeyEnglish = "NUM";
						}
						if (SortKeyEnglish == "") {
							SortKeyEnglish = "ETC";
						}
				}
				rtn["en"] = SortKeyEnglish;
				return rtn;
			},

			/* _$$.mail.com.viewUnRead  >>  미리보기 상태로 오픈할 때 보기 리스트의 해당 문서는 읽음상태 스타일로 */
			viewUnRead: function (unid, opt) {
				/*
					by mjkim 20250116 팝업에서 읽음 처리
				*/

				if (opener) {
					var _view = opener.$fn.getInstance("view").element.view("instance")
				} else {
					var _view = $fn.getInstance("view").element.view("instance")
				}

				var _options = _view.options,
					_ele = _view.element,
					_row;
				_row = $("div[data-key-unid='" + unid + "']", _ele);

				if (_row.size() != 1) return;
				if (opt == "read") {
					$(".read-cell > .read", _row).addClass("active");
					$(".subject-cell", _row).removeClass("active");
					$(".sender-cell", _row).removeClass("active");
					$(".date-cell", _row).removeClass("active");
					$(".size-cell", _row).removeClass("active");
					//$(".subject-cell", _row).removeClass("dwp-bold");
				}
			},

			/* _$$.mail.com.megaAttachServer  >>  대용량 파일첨부의 호스트 */
			megaAttachServer: function (_doc) {
				return $fn.getSysinfo().megaserver;
				/*
				var _domain = _$$.mail.com.CONST.MEGAATTACH, _curserver = _doc.options.servername, _host = "";
				switch (_curserver) {
				case "gwpk1" : case "gwpk2" : case "gwpk" :
					_host = "gwpk";
					break;

				case "hqmail1a" : case "hqmail1b" : case "hqmail2a" : case "hqmail2b" :
					_host = "arena";
					break;
				case "cnmail1a" : case "cnmail1b" :
					_host = "cnarena";
					break;
				case "apapp1a" : case "apapp1b" :
					_host = "aparena";
					break;
				case "euapp1a" : case "euapp1b" :
					_host = "euarena";
					break;
				case "usapp1a" : case "usapp1b" :
					_host = "usarena";
					break;
				}
				return _domain[_host];
				*/
			},

			/* _$$.mail.com.megaAttachGetHtml  >>  대용량 파일첨부의 본문 HTML */
			megaAttachGetHtml: function (mega, __doc) {
				var _h = "",
					_t = "",
					_totalsize = 0,
					_totalcount = 0,
					_megahost = _$$.mail.com.megaAttachServer(__doc),
					_megadownurl = $fn.getSysinfo().megadownurl;

				$.each(mega, function (i, o) {
					//대용량 첨부 솔루션 사용시
					if (_megahost != "" && _megadownurl != "") {
						o.fileurl = _megadownurl.replace("$filename$", encodeURIComponent(o.filename)).replace("$fileindex$", o.folder);
					}
					if (o.fileurl) {
						_totalsize += parseInt(o.filesize, 10);
						_totalcount += 1;
						if (_h == "") {
							_h = "<div style=\"padding: 8px 10px; color: #333; font-size: 13px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, sans-serif; cursor: pointer;\">";
							_h += "<a href='" + _megahost + o.fileurl + "' download target='_blank' style='text-decoration:none;color:black;cursor:pointer;'";
							_h += 'onmouseover=\'this.style.textDecoration="underline";this.style.color="blue";\' onmouseout=\'this.style.textDecoration="none";this.style.color="black";\'>';
							_h += '<img src="' + $fn.getPath("weblib") + '/images/common/icon-download.png" alt="" style="width: 15px; height: 15px; margin-right: 5px;">';
							_h += o.filename;
							_h += "<span style=\"margin-left: 5px; color: #666; font-size: 12px; font-weight: 400; font-family:'Malgun Gothic', Arial, Tahoma, sans-serif;\">";
							_h += " (" + _$$.mail.com.filesize(o.filesize) + ")</span>";
							_h += "</a></div>";
						} else {
							_h += "<div style=\"padding: 8px 10px; border-top: 1px solid #cfcfcf; color: #333; font-size: 13px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, sans-serif; cursor: pointer;\">";
							//_h += "<a href='" + (_megahost + o.fileurl).replace(/\/\//g, "/") + "' download target='_blank' style='text-decoration:none;color:black;cursor:pointer;'";
							_h += "<a href='" + _megahost + o.fileurl + "' download target='_blank' style='text-decoration:none;color:black;cursor:pointer;'";
							_h += 'onmouseover=\'this.style.textDecoration="underline";this.style.color="blue";\' onmouseout=\'this.style.textDecoration="none";this.style.color="black";\'>';
							_h += '<img src="' + $fn.getPath("weblib") + '/images/common/icon-download.png" alt="" style="width: 15px; height: 15px; margin-right: 5px;">';
							_h += o.filename;
							_h += "<span style=\"margin-left: 5px; color: #666; font-size: 12px;font-weight: 400; font-family:'Malgun Gothic', Arial, Tahoma, sans-serif;\">";
							_h += " (" + _$$.mail.com.filesize(o.filesize) + ")</span>";
							_h += "</a></div>";
						}
					}
				});

				if (_totalcount > 0) {
					// 2022-06-07 By ADD LHJ
					var _sysinfo = $dwp.core.getSysinfo();
					var _date = new Date();
/*
		by mjkim 20251126 사용자가 설정한 값으로 세팅
*/
					var _megadownday = $("select[name=limitday]",__doc.element).xval();
					_date.setDate(_date.getDate() + parseInt(_megadownday, 10));
	
					//_t += "<p style=\"font-size:9pt;\">&nbsp;</p><p style=\"font-size:9pt;\">&nbsp;</p>";
					_t += '<div class="megalink" style="max-width: 736px;">';
					_t += '<div style="overflow: hidden;">';
					_t += "<div style=\"float: left; width_xx: 350px; color: #333; font-size: 14px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, sans-serif;\">";
					_t += '<img src="' + $fn.getPath("weblib") + '/images/common/icon-file.png" alt="" style="width: 15px; height: 15px;">&nbsp;';
					_t += $fn.getCodeMsg("comm.title.js007");
					_t += "<span style=\"margin-left: 5px; color: #ed6c00; font-size: 12px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, sans-serif;\">";
					_t += $fn.getCodeMsg("mail.data.all") + " : " + _$$.mail.com.filesize(_totalsize) + "</span>";
					_t += "</div>";
					_t += "<div style=\"float: right; width_x: 350px; color: #ed6c00; padding-top: 3px; font-size: 12px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, sans-serif; text-align: right;\">";
					// 2022-06-07 By ADD LHJ
					_t += $fn.getCodeMsg("comm.title.mega_msg").replace("{1}", _date.format("yyyy-mm-dd"));
					//_t += $fn.getCodeMsg("comm.title.js008");
					_t += "</div></div>";
					_t += '<div style="max-width: 736px; margin-top: 8px; border: 1px solid #cfcfcf; border-top: 2px solid #ed6c00;">' + _h + "</div>";
					_t += "</div>";
					_t += '<p style="font-size:9pt;">&nbsp;</p>';
				}

				console.log("~~~~~~megaAttachGetHtml", _t);

				return _t;
			},
			goConnection: function (vObj, vType, opt) {
				var _me = this,
					_opt = {},
					_options = vObj.options,
					_el = vObj.element,
					opt = opt || {},
					_opt = $.extend({ ismobile: false, tparunid: "" }, opt);
				var url = "",
					vKey = "";

				//http://local.sh-holdings.com/mail/2/maum02.nsf/wFrmView?ReadForm&view=threads&_=1681714661739

				conDialog = function (conKey) {
					var _url = "",
						_div = "",
						_cnt = 0;
					var _html = "<div id='conmail_" + conKey + "'></div>";

					_url = _options.cdb + "/wFrmView" + (_options.ismobile ? "_mo" : "") + "?ReadForm&view=threads_cate&single=" + conKey;

					if (_options.ismobile) {
						$dwp.core.mportal.loadPage({
							link: _url,
							linktype: "PAGE",
							layer: "view",
							subtype: "read"
						});
						return;
					}

					_searchurl = _options.cdb + "/api/data/collections/name/threads_cate?ps=999&category=" + conKey;

					$fn.xAjax({
						url: _searchurl,
						method: "GET",
						dataType: "json",
						async: false,
						cache: false
					}).done(function (data) {
						_cnt = data.length;
					});

					/*
									var _buttons = [{
										"title": $fn.getCodeMsg("확인"),
										"click": function (obj) {
											obj.close();
										}
									}];
					*/

					var _buttons = [];

					$fn.dialog(_el, {
						modal: true,
						resizable: true,
						draggable: true,
						//                      title: $fn.getCodeMsg("mail.title.mailthreads") +"(<span id=totalCnt></span>"+$fn.getCodeMsg("mail.title.cnt")+")",
						title: $fn.getCodeMsg("mail.title.mailthreads") + "(" + String(_cnt) + $fn.getCodeMsg("mail.title.cnt") + ")",
						width: _opt.ismobile ? "100%" : "800",
						//                        height: (_opt.ismobile?"auto":"500"),
						height: _opt.ismobile ? "auto" : "480",
						show: "fade", // effect
						hide: "fade", // effect
						//autoOpen: false,		//.dialog("open")호출시만 열림
						buttons: _buttons,
						content: { url: "", html: _html, data: {} },
						initcallback: function (o) {
							_url += "&target=conmail_" + conKey;
							//_url = _options.cdb + "/wFrmView"+(_options.ismobile?"_mo":"")+"?ReadForm&view=threads_cate&single=" + conKey + "&target=conmail_" + conKey;

							$fn.xAjax({
								type: "GET",
								async: true,
								cache: false,
								url: $fn.getProxyUrl(_url),
								success: function (data, textStatus, xhr) {
									var _div = "<div style='width:100%; height:365px; overflow:hidden;'>" + data + "</div>";
									$("#conmail_" + conKey, o.element).append(_div);
								},
								error: function (xhr, status, e) { }
							});
						}
					});
				};

				preview = function (conKey) {
					var _url = "",
						_div = "",
						_cnt = 0;
					_url = _options.cdb + "/wFrmView?ReadForm&view=threads_cate&single=" + conKey + "&target=preview_" + _options.unid;
					_doc = $fn.getInstance("doc");

					$fn.xAjax({
						type: "GET",
						async: false,
						cache: false,
						url: $fn.getProxyUrl(_url),
						success: function (data, textStatus, xhr) {
							var _div = "<div style='width:100%; height:365px; overflow:hidden;'>" + data + "</div>";
							var preview$ = $("#preview_" + _options.unid, _el).append(_div);
							$(preview$).find("div.dwp-page-body.view > div.dwp-body-wrap").addClass("ispreview");

							//2024.10.07
							$(".dwp-page-heading", $(preview$)).css({ "margin-bottom": "10px", "margin-left": "20px" });
						},
						error: function (xhr, status, e) { }
					});
				};

				if (vType == "doc") {
					vKey = _options.tparunid;
					conDialog(vKey);
				} else if (vType == "view") {
					vKey = _opt.tparunid;
					conDialog(vKey);
				} else if (vType == "conview") {
					vKey = _options.tparunid;
					preview(vKey);
				}
			},

			//action 에 넘길 Text 밑 타입 구하는 함수
			get_chatgpt: function (doc, obj) {
				var _me = this;
				var _el = doc.element;
				var _opt = doc.options;

				var _cmd = "Translate the following text to Korean;";
				if (obj.type == "grammer") {
					_cmd = "Correct this sentence grammatically:";
					//요약해줘
				} else if (obj.type == "summary") {
					//_cmd = "Summarize the sentence below:";
					_cmd = "assitant는 user의 입력을 bullet point로 간단하게 요약해준다."
					/*
					assitant는 user의 입력을 bullet point로 3줄 요약해준다.
					*/
					//직접수행 추가 - 2024.10.14 
				} else if (obj.type == "direct") {
					_cmd = "You are a helpful assistant.";
				} else if (obj.cmd != "") {
					_cmd = obj.cmd;
				}

				var _body = "";
				//직접수행 추가 - 2024.10.14 
				if (obj.type != "direct") {

					console.log("direct 가 아님");

					//읽기모드인 경우 - 2024.10.14
					if (_opt.isedit == false) {

						console.log("읽기모드인 경우");

						var _$body = $("#bodyFld", _el);
						var _$iframe = $("iframe[id=iBody]", _$body);

						//iframe 방식이면....
						if (_$iframe.size() > 0) {
							_body = _$iframe.contents().find("body").text();
							//div 방식이면...
						} else {
							_body = _$body.text();
						}

						console.log("읽기모드인 경우");

						var _$selarea = $(".dwp-selected-text", _el);
						if (_$selarea.size() > 0) {
							if (_$selarea.text() != "") {
								_body = _$selarea.text();
								console.log("selectbody : ", _body);
							}
						}
						//편집모드인 경우 - 2024.10.14
					} else {
						/*
							1. 에디터의 선택된 내용이 없는 경우
							2. 에디터의 선택된 값이 있는 경우
						*/

						//selstr 이 없으면 전체, 아니면 에디터 내용 전체
						_body = $dwp.ui.weditor.getTextValue(_el); //에디터 본문의 Text 값

					}
				} else {
					if (obj.hasOwnProperty("ask")) {
						_body = obj.ask;
					} else {
						return;
					}
				}

				var _chatopt = {
					cmd: _cmd,
					ask: _body,
					type: obj.type
				}

				_me.chatgpt_action(_chatopt);
			},


			//chatGPT API Call - 2024.10.11 ㅠㅛ ㅇ짇ㄷ
			//2024.11.14 함수 수정
			chatgpt_action: function (opt) {
				var _target = $fn.getCodeMsg("mail.title.translang");
				if (opt.type == "grammer") {
					_target = $fn.getCodeMsg("mail.title.grammer");
					//요약해줘
				} else if (opt.type == "summary") {
					_target = $fn.getCodeMsg("mail.title.summary");
					//사용자 입력 수행
				} else if (opt.type == "input") {
					_target = $fn.getCodeMsg("mail.title.inputcommand");
					//직접 명령어 수행 - 2024.10.14 by dwlee
				} else if (opt.type == "direct") {
					_target = $fn.getCodeMsg("mail.title.inputdirect");
				}

				var _tghtml = "<div class='dwp-table-vertical-read'>";
				_tghtml += "<div class='dwp-row'>";
				_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>" + $fn.getCodeMsg("mail.title.curlang") + "</div>";
				_tghtml += "<div class='dwp-value'>" + opt.ask + "</div>";
				_tghtml += "</div>";

				var _loadimg1 = "<svg width='41' height='41' viewBox='0 0 41 41' fill='none' xmlns='http://www.w3.org/2000/svg' class='h-2/3 w-2/3' role='img'>";
				_loadimg1 += "<text x='-9999' y='-9999'>ChatGPT</text><path d='M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z' fill='currentColor'></path></svg>";
				var _loadimg = '<img src="' + $fn.getPath("weblib") + '/images/common/loading.gif" width="25px" height="25px"/>';

				//사용자 명령어 입력인 경우에는 명령어를 표시한다.
				if (opt.type == "input") {
					var _inputcmd = opt.cmd;
					_inputcmd = _inputcmd.substring(0, _inputcmd.length - 2);

					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + $fn.getCodeMsg("mail.title.user_cmd") + "</div>";
					_tghtml += "<div class='dwp-value dwp-bold'>" + opt.cmd + "</div>";
					_tghtml += "</div>";

					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + _target + "</div>";
					_tghtml += "<div class='dwp-value dwp-result'>" + _loadimg + "</div>";
					_tghtml += "</div>";
					//직접입력 수행
				} if (opt.type == "direct") {
					_tghtml = "<div class='dwp-table-vertical-read'>";
					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>" + $fn.getCodeMsg("mail.title.aiask") + "</div>";	//질문내용				
					_tghtml += "<div class='dwp-value'>" + opt.ask + "</div>";
					_tghtml += "</div>";

					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + _target + "</div>";
					_tghtml += "<div class='dwp-value dwp-result'>" + _loadimg + "</div>";
					_tghtml += "</div>";

				} else {
					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + _target + "</div>";
					_tghtml += "<div class='dwp-value dwp-result'>" + _loadimg + "</div>";
					_tghtml += "</div>";
				}

				_tghtml += "</div>";

				//var _tghtml = "<div style='border:1px solid #666;padding:5px;height:100%'>" + json.response +  "</div>";

				$dwp.ui.dialog.init(null, {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					//,draggable: true
					//,resizable: true
					, width: 800
					//, height: 600
					, modal: true
					, title: $fn.getCodeMsg("mail.title.aiact")
					, content: { url: "", html: _tghtml, data: {} }
					, initcallback: function (_$dialog) {
						var _del = _$dialog.element;

						$fn.xAjax({
							url: "/openai"
							, type: 'POST'
							, dataType: 'json'
							, data: {
								'cmd': opt.cmd,
								'ask': opt.ask
							}
						}).done(function (json) {
							console.log(json.response);
							var _message = json.response;
							_message = _message.replace(/\n/gi, "<br>"); //chatGPT의 결과값은 엔터키값을 포함해서 리턴한다.
							var _$result = $(".dwp-result", _del);
							_$result.html("");

							let count = 0;
							function typing() {
								if (count > _message.length) return;
								var _char = _message.substring(count, count + 1);
								if (count < _message.length - 4) {
									var _char1 = _message.substring(count, count + 4);
									if (_char1 == "<br>") {
										_$result.html(_$result.html() + "<br>");
										count += 4;
									} else {
										_$result.html(_$result.html() + _message.substring(count, count + 1));
										count += 1;
									}
								} else {
									_$result.html(_$result.html() + _message.substring(count, count + 1));
									count += 1;
								}
							}
							setInterval(typing, 50);
						});
					}
				});
			},

			//chatGPT API Call - 2024.10.11 ㅠㅛ ㅇ짇ㄷ
			chatgpt_action_bk20241014: function (opt) {
				$fn.xAjax({
					url: "/openai"
					, type: 'POST'
					, dataType: 'json'
					, data: {
						'cmd': opt.cmd,
						'ask': opt.ask
					}
				}).done(function (json) {
					console.log(json.response);

					var _message = json.response;
					_message = _message.replace(/\n/gi, "<br>");

					var _target = $fn.getCodeMsg("mail.title.translang");
					if (opt.type == "grammer") {
						_target = $fn.getCodeMsg("mail.title.grammer");
						//요약해줘
					} else if (opt.type == "summary") {
						_target = $fn.getCodeMsg("mail.title.summary");
						//사용자 입력 수행
					} else if (opt.type == "input") {
						_target = $fn.getCodeMsg("mail.title.inputcommand");
						//직접 명령어 수행 - 2024.10.14 by dwlee
					} else if (opt.type == "direct") {
						_target = $fn.getCodeMsg("mail.title.inputdirect");
					}

					var _tghtml = "<div class='dwp-table-vertical-read'>";
					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>" + $fn.getCodeMsg("mail.title.curlang") + "</div>";
					_tghtml += "<div class='dwp-value'>" + opt.ask + "</div>";
					_tghtml += "</div>";

					//사용자 명령어 입력인 경우에는 명령어를 표시한다.
					if (opt.type == "input") {
						var _inputcmd = opt.cmd;
						_inputcmd = _inputcmd.substring(0, _inputcmd.length - 2);

						_tghtml += "<div class='dwp-row'>";
						_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + $fn.getCodeMsg("mail.title.user_cmd") + "</div>";
						_tghtml += "<div class='dwp-value dwp-bold'>" + opt.cmd + "</div>";
						_tghtml += "</div>";

						_tghtml += "<div class='dwp-row'>";
						_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + _target + "</div>";
						_tghtml += "<div class='dwp-value'>" + _message + "</div>";
						_tghtml += "</div>";
						//직접입력 수행
					} if (opt.type == "direct") {
						_tghtml = "<div class='dwp-table-vertical-read'>";
						_tghtml += "<div class='dwp-row'>";
						_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>" + $fn.getCodeMsg("mail.title.aiask") + "</div>";	//질문내용				
						_tghtml += "<div class='dwp-value'>" + opt.ask + "</div>";
						_tghtml += "</div>";

						_tghtml += "<div class='dwp-row'>";
						_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + _target + "</div>";
						_tghtml += "<div class='dwp-value'>" + _message + "</div>";
						_tghtml += "</div>";

					} else {
						_tghtml += "<div class='dwp-row'>";
						_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + _target + "</div>";
						_tghtml += "<div class='dwp-value'>" + _message + "</div>";
						_tghtml += "</div>";
					}
					_tghtml += "</div>";

					//var _tghtml = "<div style='border:1px solid #666;padding:5px;height:100%'>" + json.response +  "</div>";

					$dwp.ui.dialog.init(null, {
						show: { effect: "fade", duration: 300 }
						, hide: { effect: "fade", duration: 300 }
						//,draggable: true
						//,resizable: true
						, width: 800
						//, height: 600
						, modal: true
						, title: $fn.getCodeMsg("mail.title.aiact")
						, content: { url: "", html: _tghtml, data: {} }
						, initcallback: function (_$dialog) {
						}
					});
				});
			},


			//통합검색  - 2024.10.23 by dwlee
			opensearch_action: function (opt) {
				var _opt = opt;

				//통합검색엔진의 검색조건 가져오기 - 2024.05.08 by dwlee
				function _SearchCon() {
					var _srchCon = {};

					var _qry = [];
					//_srchCon.pDbNo = "notesdb_aprvdone"; //예)OS 인덱스 명
					_srchCon.pDbNo = _opt.search; //예)OS 인덱스 명
					function parsequery(ask) {
						var _tmp = ask.split("[");
						//검색어만 넘어온 경우
						if (_tmp.length == 1) {
							var _txtqry = _tmp.split(","); //or  검색인 경우
							$.each(_txtqry, function (qi, _txt) {
								_qry.push({
									multi_match: {
										query: _opt.ask,
										type: "phrase_prefix",
										fields: ["*"]
									}
								});
							});
						} else if (_tmp.length == 2) {
							var _fld = _tmp[1].substring(0, _tmp[1].indexOf("]"));
							var _qrstr = _tmp[1].substring(_tmp[1].indexOf("]") + 1, _tmp[1].length);
							var _txtqry = _qrstr.split(","); //or  검색인 경우
							//or 검색 - 2024.10.25 
							if (_txtqry.length > 1) {
								var _arrqry = [];
								$.each(_txtqry, function (qi, _txt) {
									if (_fld == "기안자") { //기안자, 접수자
										_arrqry.push({
											"match_phrase": {
												"AuthorName": _txt,
											}
										});
										_arrqry.push({
											"match_phrase": {
												"sReqAuthorName": _txt,
											}
										});

									} else if (_fld == "본문") {
										_arrqry.push({
											"match_phrase": {
												query: _txt,
												type: "phrase_prefix",
												fields: ["*"]
											}
										});
									} else {
										if (_fld == "작성자") {
											_arrqry.push({
												"match_phrase": {
													"AuthorName": _txt,
												}
											});
										} else if (_fld == "제목") {
											_arrqry.push({
												"match_phrase": {
													"Subject": _txt,
												}
											});
										}
									}
								});
								_qry.push({
									"bool": {
										"should": _arrqry
									}
								});
							} else {
								if (_fld == "기안자") { //기안자, 접수자
									_qry.push({
										"multi_match": {
											"query": _qrstr,
											"type": "phrase_prefix",
											"fields": [
												"AuthorName",
												"sReqAuthorName"
											]
										}
									});
								} else if (_fld == "본문") {
									_qry.push({
										multi_match: {
											query: _qrstr,
											type: "phrase_prefix",
											fields: ["*"]
										}
									});
								} else {
									if (_fld == "작성자") {
										_qry.push({
											"match_phrase": {
												"AuthorName": _qrstr
											}
										});
									} else if (_fld == "제목") {
										_qry.push({
											"match_phrase": {
												"Subject": _qrstr
											}
										});
									}
								}
							}
						} else if (_tmp.length > 2) {
							for (var i = 1; i < _tmp.length; i++) {
								var _fld = _tmp[i].substring(0, _tmp[i].indexOf("]"));
								var _qrstr = _tmp[i].substring(_tmp[i].indexOf("]") + 1, _tmp[i].length);
								var _txtqry = _qrstr.split(","); //or  검색인 경우
								//or 검색 - 2024.10.25 
								if (_txtqry.length > 1) {
									var _arrqry = [];
									$.each(_txtqry, function (qi, _txt) {
										if (_fld == "기안자") { //기안자, 접수자
											_arrqry.push({
												"match_phrase": {
													"AuthorName": _txt,
												}
											});
											_arrqry.push({
												"match_phrase": {
													"sReqAuthorName": _txt,
												}
											});

										} else if (_fld == "본문") {
											_arrqry.push({
												"match_phrase": {
													query: _txt,
													type: "phrase_prefix",
													fields: ["*"]
												}
											});
										} else {
											if (_fld == "작성자") {
												_arrqry.push({
													"match_phrase": {
														"AuthorName": _txt,
													}
												});
											} else if (_fld == "제목") {
												_arrqry.push({
													"match_phrase": {
														"Subject": _txt,
													}
												});
											}
										}
									});
									_qry.push({
										"bool": {
											"should": _arrqry
										}
									});
								} else {
									if (_fld == "기안자") { //기안자, 접수자
										_qry.push({
											"multi_match": {
												"query": _qrstr,
												"type": "phrase_prefix",
												"fields": [
													"AuthorName",
													"sReqAuthorName"
												]
											}
										});
									} else if (_fld == "본문") {
										_qry.push({
											multi_match: {
												query: _qrstr,
												type: "phrase_prefix",
												fields: ["*"]
											}
										});
									} else {
										if (_fld == "작성자") {
											_qry.push({
												"match_phrase": {
													"AuthorName": _qrstr
												}
											});
										} else if (_fld == "제목") {
											_qry.push({
												"match_phrase": {
													"Subject": _qrstr
												}
											});
										}
									}
								}
							}
						}
					}
					parsequery(_opt.ask);

					//검색시에는 자신의 현재 회사코드에 있는 문서만 검색
					_qry.push(
						{
							match_phrase: {
								AuthorComCode: $fn.getCurUser().pinfo.comcode
							}
						}
					);
					//결재대상 검색은 완료문서를 검색 - 2024.10.24
					if (_opt.search == "notesdb_aprvdone") {
						_qry.push(
							{
								match_phrase: {
									sStatus: "complete"
								}
							}
						);
					}


					/*
						[제목]그룹웨어 견적서 ==> 제목에 그룹웨어 견적서  포함된 검색
						[기안자]홍길동,강감찬 ==> 기안자가 홍길동 및 강감찬  문서 검색
						[작성자]홍길동 ==> 작성자가 홍길동 문서 검색
						[제목]하자보수[작성자]홍길동 ==> 제목에 하자보수 포함되고 작성자 홍길동인 문서 검색
						하자보수 ==> 제목,본문등에 하자보수가 있는 전체문서 검색
					*/
					/*
											{
											"match_phrase": {
												"Subject": "사전테스트"
											}
											}
					*/
					//console.log("slistview-SearchCon-1");

					// 검색대상필드
					_srchCon.area = "";

					// 검색소트
					_srchCon.pSortField = "";

					// 검색날짜
					_srchCon.pFrom = "";
					_srchCon.pTo = "";
					_srchCon.user_id = $fn.getCurUser().notesid;
					_srchCon.company_code = $fn.getCurUser().pinfo.fullorgcode.split(",")[0];

					// 검색쿼리
					_srchCon.pQuery = _opt.ask;
					_srchCon.op = "AND";

					//						_srchCon.pPageNo = _me.options.page;
					//						_srchCon.pPageSize = _me.options.ps;

					//예) [ CN=강승아/OU=11362/O=TCCINS, 강승아, *, */OU=11362/O=TCCINS, */O=TCCINS, B00011, G_S00000_090, P_S00000_110, hqapp1_v2302_0001, B00011Aprv, B00007, S00000];
					_srchCon.osQuery = {
						query: {
							bool: {
								filter: [],
								must: []
							}
						},
						sort: [
							{
								sStartDate: {
									order: "desc"
								}
							}
						],
						highlight: {
							type: "unified",
							pre_tags: ["<span style='color:red;background-color:yellow'>"],
							post_tags: ["</span>"],
							boundary_scanner: "sentence",
							fields: {
								PERSONNAME: {},
								AuthorName: {},
								OrgName: {},
								Subject: {},
								Title: {},
								bSummary: {},
								Body: {},
								Work: {}
							}
						},
						from: 0, //페이지 이동시에는 페이지의 다음 첫 인덱스로 넣어줘야...._me.options.start;
						//from: _me.options.page - 1, //페이지 이동시에는 페이지의 다음 첫 인덱스로 넣어줘야...._me.options.start;
						//size: _me.options.ps //hits.total.value=1000 이라도 가져오는건 pPageSize 15개만 가져옴
					};
					//console.log("slistview-SearchCon-5");
					/* 1. 권한 쿼리 세팅 */
					var _usernamelist = $.map($fn.getCurUser().usernamelist.split(","), (v) => {
						if (v.indexOf("*") < 0) {
							return v.trim();
						}
					});

					var _allreadersquery = [
						{
							match_phrase: {
								AllReaders: "all"
							}
						}
					];
					$.each(_usernamelist, (i, v) => {
						var _query = {
							match_phrase: {
								AllReaders: '"' + v + '"'
							}
						};
						_allreadersquery.push(_query);
					});
					//console.log("slistview-SearchCon-6");
					var _filter = [
						{
							bool: {
								should: _allreadersquery
							}
						}
					];
					_srchCon.osQuery.query.bool.filter = _filter;

					_srchCon.osQuery.query.bool.must = _qry;


					/*
					var _must = [];

					_must.push(
						{
							match_phrase: {
								AuthorComCode: $fn.getCurUser().pinfo.comcode
							}
						}
					);
					//결재대상 검색은 완료문서를 검색 - 2024.10.24
					if (_opt.search == "notesdb_aprvdone") {
						_must.push(
							{
								match_phrase: {
									sStatus: "complete"
								}
							}
						);
					}
					_must.push(
						{
							multi_match: {
								query : _opt.ask,
								type : "phrase_prefix",
								fields: ["*"]
							}
						}
					);
					_srchCon.osQuery.query.bool.must = _must;
					*/


					/*
					_srchCon.osQuery.query.bool.must = [
						{
							match_phrase: {
								AuthorComCode: $fn.getCurUser().pinfo.comcode
							}
						},
						{
							match_phrase: {
								sStatus: "complete"
							}
						},						
						{
						multi_match: {
							query : _opt.ask,
							type : "phrase_prefix",
							fields: ["*"]
						}
					}];
					*/


					/* 2. 대상필드 세팅 */
					var _fields = [];
					_fields = ["*"]; // 모든필드

					return _srchCon;
				}

				function _jsonGetParmData() {
					var _url = "/" + _opt.search + "/_search";					//성능향상 파라미터 추가 - 2024.10.30 by dwlee
					//?filter_path=-hits.hits._source.attachments.data,-hits.hits._source.attachments.attachment.content
					var _url = "/" + _opt.search + "/_search?filter_path=-hits.hits._source.attachments.data,-hits.hits._source.attachments.attachment.content";

					var _srchParam = {};
					_srchParam = _SearchCon();
					var _headers = {
						authorization: "Basic YWRtaW46T3BlbnNlYXJjaDAyMDE=" //키값 이건 $fn.getSysinfo();
					};
					var _reqbody = _srchParam.osQuery;
					return {
						//,url: "/itrinity/restful/search/default",
						url: _url,
						type: "POST",
						async: false,
						headers: _headers,
						contentType: "application/json; charset=UTF-8",
						data: JSON.stringify(_reqbody),
						dataType: "json"
					};
				}

				var _tghtml = "<div class='dwp-table-vertical-read'>";
				_tghtml += "<div class='dwp-row'>";
				_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>검색어</div>";
				_tghtml += "<div class='dwp-value'>" + opt.ask + "</div>";
				_tghtml += "</div>";

				var _loadimg = '<img src="' + $fn.getPath("weblib") + '/images/common/loading.gif" width="25px" height="25px"/>';
				_tghtml += "<div class='dwp-row'>";
				_tghtml += "<div class='dwp-value dwp-result'>" + _loadimg + "</div>";
				_tghtml += "</div>";

				$dwp.ui.dialog.init(null, {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					//,draggable: true
					//,resizable: true
					, width: 800
					//, height: 600
					, modal: true
					, title: $fn.getCodeMsg("mail.title.aiact")
					, content: { url: "", html: _tghtml, data: {} }
					, initcallback: function (_$dialog) {
						var _del = _$dialog.element;
						$dwp.core.util.xAjax(_jsonGetParmData()).done(function (jdata) {
							console.log(jdata.hits);
							console.log(jdata.hits.hits);

							//
							//div 태그를 밀어넣고
							//해당 아이디를 잡아서 text만 또각또각 그려주기....

							var _$result = $(".dwp-result", _del);
							_$result.html("");

							var _subject = "";

							var _text = [];
							$.each(jdata.hits.hits, function (idx, _data) {
								var _rdata = _data._source;
								console.log(_data._source.Subject);
								console.log(_data._source["@unid"]);
								console.log(_data._source["@href"]);

								var _resturl = _data._source["@href"];
								var _unid = _rdata["@unid"];
								_resturl = _resturl.substring(0, _resturl.indexOf("/api"));
								_resturl += "/0/" + _unid + "?Opendocument";
								var _rows = "<div class='op_row dwp-cursor' id='doc_" + _unid + "' data-url='" + _resturl + "'></div>";
								_$result.append(_rows);
								var _dataopt = {
									subject: _rdata.Subject,
									unid: _unid
								}
								_text.push(_dataopt);
							});

							$.each(_text, function (tdx, _dsp) {
								var _message = _dsp.subject;
								var _$subject = $("#doc_" + _dsp.unid, _del);

								function typing() {
									/*
									if (count > _message.length) return;
									var _char = _message.substring(count, count+1);								
									if (count < _message.length-4) {
										var _char1 = _message.substring(count, count+4);			
										if (_char1 == "<br>") {
											_$subject.html(_$result.html() + "<br>");
											count += 4;									
										} else {
											_$subject.html(_$subject.html() + _message.substring(count, count+1));
											count += 1;
										}
									} else {
										_$subject.html(_$subject.html() + _message.substring(count, count+1));
										count += 1;
									}
									*/
									_$subject.html(_$subject.html() + _message);
								}

								setTimeout(typing(), 5000);
								//setInterval(typing, 50);
							});

							$(".op_row", _del).off("click").on("click", function () {
								var _url = $(this).data("url");
								var _opt = {
									title: $(this).text()
									, isportal: true
									, width: ($fn.getScreenInfo().doc_w * 0.8)
									, dialogClass: 'memo-type'
								};
								//$fn.openDocument(_url, _opt);
								$fn.winopen(_url, '', {});
							});

							/*
														_message = _subject;
														let count = 0;
														function typing() {
															if (count > _message.length) return;
															var _char = _message.substring(count, count+1);								
															if (count < _message.length-4) {
																var _char1 = _message.substring(count, count+4);			
																if (_char1 == "<br>") {
																	_$result.html(_$result.html() + "<br>");
																	count += 4;
																} else if (_char1 == "<div") {
																	_$result.html(_$result.html() + "<div>");
																	count += 5;										
																} else if (_char1 == "</di") {	
																	_$result.html(_$result.html() + "</div>");										
																	count += 6;											
																} else {
																	_$result.html(_$result.html() + _message.substring(count, count+1));
																	count += 1;
																}
															} else {
																_$result.html(_$result.html() + _message.substring(count, count+1));
																count += 1;
															}
														}							  
														setInterval(typing, 50);
							*/
						});
					}
				});
			}
		},

		/* mng function */
		mng: {
			/* _$$.mail.mng.go_folderMng  >>  LNB 이미지 클릭시 폴더관리 화면으로 이동 - 2020.08.06 by dwlee */
			go_folderMng: function () {
				var _url = $fn.getPath("mail") + "/wFrmMng?ReadForm";
				$dwp.core.util.loadPage({ link: _url, linktype: "PAGE" });
			},

			/* _$$.mail.mng.google_Authenticate  >>  구글인증하기 */
			google_Authenticate: function (_ele) {
				var _me = this;

				_me.google_Verification(_ele, function (jdata) {
					if (jdata.status == "00") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.google02") });
					} else {
						//var _url = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&response_type=code&client_id=421562961400-sd2a7gn9ijd9d2495sjq4l6o445i2j3j.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fdevgw.tccins.co.kr%3A9443%2Fapi%2Ftoken';
						var _url = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&response_type=code";
						_url += "&client_id=" + $fn.getSysinfo().googleclientid;
						_url += "&approval_type=force";
						_url += "&redirect_uri=" + encodeURIComponent($fn.getSysinfo().googleapihost + "/api/token");
						window.open(_url, "", "width=500, height=600, resizable=no, scrollbars=no, status=no;");
					}
				});

				/*
				$fn.xAjax({
					url: "/dwp/com/portal/main.nsf/googleauth_ajax?openagent&mode=add&userid=" + $dwp.core.info.cuser.pinfo.empno,
					cache: false
				}).done(function(pjson) {
					if (typeof(pjson) == "string") pjson = $.parseJSON(pjson);

					console.log("pjson", pjson);

					if (pjson["code"] == "3") {
						if ($("#mail_googleauth").size() > 0) {
							$("#mail_googleauth").remove();
						}
						var mail_googleauth = $("<iframe name='mail_googleauth' id='mail_googleauth' src='about:blank' frameBorder='0' style='width:0px;height:0px;'></ifrmae").appendTo($("body"));
						var _body = mail_googleauth.get(0).contentWindow || (mail_googleauth.get(0).contentDocument.document || mail_googleauth.get(0).contentDocument);

						var _html = "<form method=\"POST\" name=\"f1\">";
						_html += "<input type=\"hidden\" name=\"client_id\" value=\"" + pjson["client_id"] + "\"><br>";
						_html += "<input type=\"hidden\" name=\"redirect_uri\" value=\"" + pjson["redirect_uri"] + "\"><br>";
						_html += "<textarea name=\"state\" style=\"display:none;\">" + pjson["state"] + "</textarea>";
						_html += "</form>";
						_html += "<script>";
						_html += "window.open(\"" + pjson["popupurl"] + "\", \"\", \"width=500, height=600, resizable=no, scrollbars=no, status=no;\");";
						_html += "</script>";

						_body.document.write(_html)
					} else {
						if (pjson.hasOwnProperty("msg")) {
							$fn.alert({ msg: $fn.getCodeMsg(pjson["msg"]) }); // [Google 인증하기] 버튼을 눌러 인증하여 주십시오.
							return;
						}
					}

				}).fail(function(pjson) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
				});
				*/
			},

			/* _$$.mail.mng.google_Verification  >>  구글인증 확인 */
			google_Verification: function (_ele, callback) {
				//var _url = $fn.getSysinfo().googleapihost + "/api/validate";
				var _url = "/api/validate";
				$.ajax({
					url: _url,
					dataType: "json",
					async: false,
					cache: false,
					crossDomain: true,
					xhrFields: { withCredentials: true },
					data: {}
				})
					.done(function (jdata) {
						console.log(jdata);
						if (typeof callback == "function") {
							callback(jdata);
							return;
						}
						if (jdata.status == "00") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.google02") });
						} else {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.google01") });
						}
					})
					.fail(function (data) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
					});
				/*
				$fn.xAjax({
					url: "/dwp/com/portal/main.nsf/googleauth_ajax?openagent&mode=get&userid=" + $dwp.core.info.cuser.pinfo.empno,
					cache: false,
					async: false,
					dataType: "json"
				}).done(function(data) {
					//{ "code":"0", "msg":"mail.msg.google01", "token":"" }
					//$("input[name=SyncGoogleCal]", _ele).xval(data["code"]);
					if (data.hasOwnProperty("msg")) {
						$fn.alert({ msg: $fn.getCodeMsg(data["msg"]) }); // [Google 인증하기] 버튼을 눌러 인증하여 주십시오.
						return;
					}
				}).fail(function(data) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
				});
				*/
			},

			/**
			 * 메일서명 : 사용자 서명 작성화면 init - 2020.08.31 by mhkim
			 * @param {*} opt
			 */
			init_Signature_Form: function (opt) {
				var _opt = $.extend({}, opt),
					_$target = $fn.getTarget(),

					//2024.10.07
					//_doc = $fn.doc(_opt, _$target),
					_doc = $fn.doc(_opt);
				_ele = _doc.element;

				$fn.convertLangPage({}, _ele);
				$("#bodywrap", _ele).css("height", "350px");

				$("#config_save", _ele)
					.off("click")
					.on("click", function () {
						//저장버튼
						_doc.save({
							actiontype: "save",
							docstatus: "reg",
							callback: function (_jdata) {
								if (_jdata.hasOwnProperty("result")) {
									if (_jdata.result >= "200" && _jdata.result < "300") {
										if (_jdata.msgcode == "success") {
											$fn.toast({ msg: $fn.getCodeMsg("mail.msg.alt14") });
											if (typeof window.opener == "object") {
												if ($("#signature_refresh", window.opener.document).length == 1) {
													$("#signature_refresh", window.opener.document).click();
												}
											}
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
										}
										window.close();
									}
								}
							}
						});
					});
			},

			/**
			 * 메일서명 : 사용자 작성한 서명 목록 표시 - 2020.08.31 by mhkim
			 * @param {*} opt
			 */
			init_Signature_List: function (opt, _doc) {
				var _me = this,
					_opt = $.extend({}, opt),
					_ele = _doc.element,
					_tbody = $("#mail_signature_table", _ele);
				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_opt.cdb + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: { actiontype: "get_signature_list" },
					success: function (data, textStatus) {
						//debugger;
						$("tr", _tbody).remove();
						if (data.length == 0) {
							_tr = '<tr><td colspan=4 style="text-align:center"><span data-xlang="LC_TEXT" data-xlang-code="mail.data.cmt04">';
							_tr += $fn.getCodeMsg("mail.data.cmt04") + "<!--등록된 정보가 없습니다--></span></td></tr>";
							_tr = _tbody.append(_tr);
						} else {
							$.each(data, function (i, o) {
								_tr = '<tr><td><div class="dwp-radio textless"><label><input type="radio" name="UserSignature" value="' + o["@unid"] + '" ';
								_tr += (_opt.UserSignatureUnid == o["@unid"] ? " checked " : "") + "><span></span></label></div></td>";
								_tr += '<td style="text-align:left;">' + o["subject"] + '</td><td style="text-align:center;">' + o["date"] + "</td>";
								_tr += '<td style="text-align:center;"><div class="dwp-btn btn-Signature-edit" unid="' + o["@unid"] + '"><span>' + $fn.getCodeMsg("mail.btn.edit2") + "</span></div> ";
								_tr += '<div style="text-align:center;" class="dwp-btn btn-Signature-delete" unid="' + o["@unid"] + '"><span>' + $fn.getCodeMsg("mail.btn.deldoc") + "</span></div></td></tr>";
								_tr = _tbody.append(_tr);
							});
						}
						$("input[name=UserSignature]", _ele)
							.off("click")
							.on("click", function () {
								$("input[name=EnableSignature]", _ele)[0].checked = true;
								$("input[name=SignatureType]", _ele)[0].checked = true;
								$("input[name=UserSignatureUnid]", _ele).xval($(this).xval());
							});
						$(".btn-Signature-edit", _ele)
							.off("click")
							.on("click", function () {
console.log("여기 맞냐?")

								//2024.10.07
								_me.popSignDoc(_doc, $fn.getPath("mail") + "/0/" + $(this).attr("unid") + "?EditDocument");
								return;

								//수정 버튼
								_$$.mail.com.newMail({
									url: $fn.getPath("mail") + "/0/" + $(this).attr("unid") + "?EditDocument",
									ispop: true,
									width: 800,
									height: 300
								});
							});
						$(".btn-Signature-delete", _ele)
							.off("click")
							.on("click", function () {
								//삭제 버튼
								_$$.mail.com.cmdpost({ actiontype: "del_reg", postdata: $(this).attr("unid") }, function () {
									$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg003") });
									setTimeout(function () {
										_me.init_Signature_List(opt, _doc);
									}, 1000);
								});
							});
					}
				});
			},

			/**
			 * 기본 서명 HTML 생성하여 리치텍스트에 저장하기 - by mhkim
			 * @param {*} doc
			 */
			SignatureSave_Org: function (doc) {
				var ele = doc.element,
					defaultHtml = $("#SignatureHTML", ele).html(),
					shtml = "",
					tmp = "";
				if ($("input[name=SignatureType]").xval() == "1") {
					if ($("input[name=UserSignature]").length < 1) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt39") });
						return false;
					}
					if ($("input[name=UserSignature]:checked").length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt40") });
						return false;
					}
				}
				for (var ii = 1; ii < 6; ii += 1) {
					tmp = '<img src="' + $fn.getPath("weblib") + "/images/mail/sign_bg" + (ii - 1) + '.gif" border=0>';
					shtml = defaultHtml.replace(/{{logoimg}}/gi, tmp);
					if (ii < 5) {
						shtml = shtml.replace(/{{bgcolor1}}/gi, "background-color:#F3F3F3");
						shtml = shtml.replace(/{{bgcolor2}}/gi, "background-color:#F3F3F3");
						shtml = shtml.replace(/{{fontcolor}}/gi, "color:#6A6A6A");
					} else {
						shtml = shtml.replace(/{{bgcolor1}}/gi, "background-color:#F3F3F3");
						shtml = shtml.replace(/{{bgcolor2}}/gi, "background-color:#4DAC26");
						shtml = shtml.replace(/{{fontcolor}}/gi, "color:#FFFFFF");
					}
					shtml = shtml.replace(/expstyle=/gi, "style=");

					for (var jj = 1; jj < 8; jj += 1) {
						shtml = shtml.replace(
							new RegExp("{{T" + jj + "}}", "gi"),
							$("input[name=T" + jj + "]", ele)
								.xval()
								.replace(/ /gi, "&nbsp;")
						);
					}
					$("textarea[name=Signature" + ii + "]", ele).xval(shtml);
				}

				//현재 선택된 서명정보 필드값으로 저장 20230531
				var sFldTxt = "";
				var sSt = $("input[name=SignatureType]").xval();
				for (var jj = 1; jj < 8; jj += 1) {
					if (jj == 1) {
						sFldTxt = $("input[name=T" + jj + "]", ele).xval();
					} else {
						sFldTxt += "@!" + $("input[name=T" + jj + "]", ele).xval();
					}
				}
				$("input[name=SignatureTxt" + sSt + "]", ele).xval(sFldTxt);
				return true;
			},

			/* _$$.mail.mng.init_default_config  >>  메일 기본환경설정 열릴 때 */
			init_default_config_Org: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_mailpath = $fn.getPath("mail"),
					url = "",
					_ele = null;

				//var _doc = $fn.doc(_opt, $("#"+(_opt.tabid != "" ? _opt.tabid : _opt.did)));		//tabid 또는 did 값으로 element를 잡아온다
				var _$target = _opt.did != "" ? $("#" + _opt.tabid, "#" + _opt.did) : $("#" + _opt.tabid, $fn.getTarget());
				var _doc = $fn.doc(_opt, _$target);
				_ele = _doc.element;
				var setDefaultBody = function (o) {
					//$dwp.ui.weditor.setDocBody($("#bodyFld", _ele), {bodyurl : $fn.getPath("weblib") + "/html/mail/" + $(o).attr("vdata")}, _doc);
				};

				//환경설정을 네모박스로 바꿈 - 2024.09.25
				$(".dwp-box-left, .dwp-box-middle, .dwp-box-right", $(".dwp-config-box", _ele)).off("click").on("click", function () {
					var _$this = $(this);
					var _data = _$this.data();
					$("[data-fldname=" + _data.fldname + "]", _ele).removeClass("selected");
					$("div", $("[data-fldname=" + _data.fldname + "]", _ele)).removeClass("dwp-box-selected").addClass("dwp-box-unselected");
					_$this.addClass("selected");
					$("div", _$this).removeClass("dwp-box-unselected").addClass("dwp-box-selected");
					$(":radio[name=" + _data.fldname + "][value=" + _data.value + "]", _ele).prop('checked', true);
					$(":radio[name=" + _data.fldname + "][value=" + _data.value + "]", _ele).click();
				});


				//===========================================================
				//	사용자 서명 타입에 따라서 처리 - 2020.08.31 by  mhkim
				var manualSignature = function (o) {
					var thisVal = $(o).xval();
					if (thisVal == "1") {
						_me.init_Signature_List(opt, _doc);
						//기술사 영역 숨기기
						$(".dwp-add-detail", $("#SignStyle", _ele)).addClass("dwp-none");
					} else {
						$("input[name=UserSignature]", _ele).attr("checked", false); //사용자가 작성한 서명의 라디오버튼 체크속성 제거
						$("input[name=UserSignatureUnid]", _ele).xval("");
						if (thisVal == "1" || thisVal == "2") { //기본명함
							//기술사 영역 숨기기
							$(".dwp-add-detail", $("#SignStyle", _ele)).addClass("dwp-none");
							for (var jj = 1; jj < 8; jj += 1) {
								$("input[name=input_" + jj + "]", _ele).xval($("input[name=Org_T" + jj + "]", _ele).xval());
							}
						} else if (thisVal == "3") { //기본명함(영문)
							//기술사 영역 숨기기
							$(".dwp-add-detail", $("#SignStyle", _ele)).addClass("dwp-none");
							for (var jj = 1; jj < 8; jj += 1) {
								$("input[name=input_" + jj + "]", _ele).xval($("input[name=Org_ET" + jj + "]", _ele).xval());
							}
						} else if (thisVal == "4") { //기술사 명함
							//기술사 영역 보여주기
							$(".dwp-add-detail", $("#SignStyle", _ele)).removeClass("dwp-none");

							//등록된 서명필드값 설정 20230531
							var sFldVal = $("input[name=SignatureTxt" + thisVal + "]", _ele).xval() + "@!@!@!@!@!@!@!@!@!";
							var vFldVal = sFldVal.split("@!");
							for (var jj = 1; jj < 8; jj += 1) {
								//저장된 기술사 정보가 있으면
								if (sFldVal != "" && (jj == 6 || jj == 7)) {
									$("input[name=input_" + jj + "]", _ele).xval(vFldVal[jj - 1]);								  //저장된 값
								} else {
									$("input[name=input_" + jj + "]", _ele).xval($("input[name=Org_T" + jj + "]", _ele).xval());  //기본값
								}
							}
						}
					}
				};

				_editor_area = $(".article-area", _ele);
				if (_editor_area.size() == 1) {
					_editor_area.css("height", 400);
				}

				$("#btn_googlecheck", _ele)
					.off("click")
					.on("click", function () {
						//구글연동확인 버튼
						_$$.mail.mng.google_Verification(_ele);
					});
				$("#btn_googleauth", _ele)
					.off("click")
					.on("click", function () {
						//구글연동 버튼
						_$$.mail.mng.google_Authenticate(_ele);
					});

				//===========================================================
				//	사용자 서명 타입에 따라서 처리 - 2020.08.31 by  mhkim
				if (_editor_area.size() == 1) {
					_editor_area.css("height", 250);
				}

				$("input[name=SignatureType]", _ele)
					.off("click")
					.on("click", function () {
						//메일 서명 옵션
						manualSignature(this);
					});
				$("input[name=SignatureType]:checked", _ele).click();

				_me.init_Signature_List(opt, _doc); //작성한 서명목록을 화면에 표시

				$("#signature_create", _ele)
					.off("click")
					.on("click", function () {

						//2024.10.07
						_me.popSignDoc(_doc, "");
						return;

						//사용자 서명 작성 버튼
						_$$.mail.com.newMail({
							url: $fn.getPath("mail") + "/wFrmProfileSign?OpenForm",
							ispop: true,
							width: 800,
							height: 300
						});
					});
				$("#signature_refresh", _ele)
					.off("click")
					.on("click", function () {
						//사용자 서명 작성 버튼
						_me.init_Signature_List(opt, _doc);
					});
				//===========================================================

				/*
									$("#btn_hk", _ele).off("click").on("click", function() {		//에디터 하단의 샘플 서명 아이콘 클릭
										$(".local-group", _ele).addClass("dwp-hidden");
										setDefaultBody(this);
									});
									$("#btn_hkrm", _ele).off("click").on("click", function() {		//에디터 하단의 샘플 서명 아이콘 클릭
										$(".local-group", _ele).addClass("dwp-hidden");
										$(".local-hkrm", _ele).removeClass("dwp-hidden");
									});
									$("#btn_bi", _ele).off("click").on("click", function() {			//에디터 하단의 샘플 서명 아이콘 클릭
										$(".local-group", _ele).addClass("dwp-hidden");
										$(".local-bi", _ele).removeClass("dwp-hidden");
									});
									$("input[type=radio]", $(".local-group", _ele)).off("click").on("click", function() {	//각 나라별 서명 아이콘 클릭
										$(".local-group", _ele).addClass("dwp-hidden");
										setDefaultBody(this);
									});
				*/
				$("#config_save", _ele)
					.off("click")
					.on("click", function () {
						//저장버튼

						if (_me.SignatureSave(_doc) == false) return; //회사의 지정 된 서명의 값을 저장.

						_doc.save({
							actiontype: "save",
							docstatus: "reg",
							callback: function (_jdata) {
								if (_jdata.hasOwnProperty("result")) {
									if (_jdata.result >= "200" && _jdata.result < "300") {
										if (_jdata.msgcode == "success") {
											$fn.toast({ msg: $fn.getCodeMsg("mail.msg.alt14") });
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
										}
									}
								}
							}
						});
					});

				if (_opt.signatureurl != "") {
					//기존 서명 본문이 있을 경우 에디터에 넣어준다
					//$dwp.ui.weditor.setDocBody($("#bodyFld", _ele), {bodyurl : _opt.signatureurl}, _doc);
				}
			},


			/**
			 * 기본 서명 HTML 생성하여 리치텍스트에 저장하기 - by mhkim
			 * @param {*} doc
			 */
			SignatureSave_bk11: function (doc) {
				var ele = doc.element,
					shtml = "";

				var _seltype = $("input[name=SignatureType]").xval();
				if (_seltype == "1") { //사용자 만든 서명
					if ($("input[name=UserSignature]").length < 1) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt39") });
						return false;
					}
					if ($("input[name=UserSignature]:checked").length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt40") });
						return false;
					}
				}

				//1번 기본명함 - 조직도 기본정보 자동 셋팅
				var shtml = $("#SignatureHTML_2", ele).html(); //HS 화성은 2가지 타입이므로...
				var sFldTxt = "";
				for (var jj = 1; jj < 8; jj += 1) {
					shtml = shtml.replace(
						new RegExp("{{input_" + jj + "}}", "gi"),
						$("input[name=Org_T" + jj + "]", ele).xval()
					);
					if (jj == 1) {
						sFldTxt = $("input[name=Org_T" + jj + "]", ele).xval();
					} else {
						sFldTxt += "@!" + $("input[name=Org_T" + jj + "]", ele).xval();
					}
				}
				$("textarea[name=Signature2]", ele).xval(shtml);
				$("input[name=SignatureTxt2]", ele).xval(sFldTxt); //1번과 2번을 번갈아 저장함

				//2번 기본명함(영문) - 조직도 기본정보 자동 셋팅
				var shtml = $("#SignatureHTML_3", ele).html(); //HS 화성은 영문 명함
				var sFldTxt = "";
				for (var jj = 1; jj < 8; jj += 1) {
					shtml = shtml.replace(
						new RegExp("{{input_" + jj + "}}", "gi"),
						$("input[name=Org_ET" + jj + "]", ele).xval()
					);
					if (jj == 1) {
						sFldTxt = $("input[name=Org_ET" + jj + "]", ele).xval();
					} else {
						sFldTxt += "@!" + $("input[name=Org_ET" + jj + "]", ele).xval();
					}
				}
				$("textarea[name=Signature3]", ele).xval(shtml);
				$("input[name=SignatureTxt3]", ele).xval(sFldTxt); //1번과 2번을 번갈아 저장함

				var sFldTxt = "";
				//3번 기능사 명함 - 조직도 기본정보 자동 셋팅
				var shtml = $("#SignatureHTML_4", ele).html(); //HS 화성은 영문 명함
				for (var jj = 1; jj < 8; jj += 1) {

					if (jj == 6 || jj == 7) {				//자격증 - 입력값
						shtml = shtml.replace(
							new RegExp("{{input_" + jj + "}}", "gi"),
							$("input[name=input_" + jj + "]", ele).xval()
						);
					} else {
						shtml = shtml.replace(
							new RegExp("{{input_" + jj + "}}", "gi"),
							$("input[name=Org_T" + jj + "]", ele).xval()	//조직도 기본정보
						);
					}
					if (jj == 1) {
						sFldTxt = $("input[name=Org_T" + jj + "]", ele).xval();
					} else {
						if (jj == 6 || jj == 7) {
							sFldTxt += "@!" + $("input[name=input_" + jj + "]", ele).xval(); //자격증 - 입력값
						} else {
							sFldTxt += "@!" + $("input[name=Org_T" + jj + "]", ele).xval(); //조직도 기본정보
						}
					}
				}
				if ($("input[name=SignatureTxt4]", ele).xval() == "") {
					$("textarea[name=Signature4]", ele).xval(shtml);
					$("input[name=SignatureTxt4]", ele).xval(sFldTxt); //1번과 2번을 번갈아 저장함
				}

			},


			SignatureSave: function (doc) {
				var ele = doc.element,
					shtml = "";

				var _seltype = $("input[name=SignatureType]").xval();
				if (_seltype == "1") { //사용자 만든 서명
					if ($("input[name=UserSignature]").length < 1) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt39") });
						return false;
					}
					if ($("input[name=UserSignature]:checked").length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt40") });
						return false;
					}
				}

				//1번 기본명함 - 조직도 기본정보 자동 셋팅
				var shtml = $("#SignatureHTML_2", ele).html(); //HS 화성은 2가지 타입이므로...
				var sFldTxt = "";
				for (var jj = 1; jj < 8; jj += 1) {
					shtml = shtml.replace(
						new RegExp("{{input_" + jj + "}}", "gi"),
						$("input[name=Org_T" + jj + "]", ele).xval()
					);
					if (jj == 1) {
						sFldTxt = $("input[name=Org_T" + jj + "]", ele).xval();
					} else {
						sFldTxt += "@!" + $("input[name=Org_T" + jj + "]", ele).xval();
					}
				}
				$("textarea[name=Signature2]", ele).xval(shtml);
				$("input[name=SignatureTxt2]", ele).xval(sFldTxt); //1번과 2번을 번갈아 저장함

				//2번 기본명함(영문) - 조직도 기본정보 자동 셋팅
				var shtml = $("#SignatureHTML_3", ele).html(); //HS 화성은 영문 명함
				var sFldTxt = "";
				for (var jj = 1; jj < 8; jj += 1) {
					shtml = shtml.replace(
						new RegExp("{{input_" + jj + "}}", "gi"),
						$("input[name=Org_ET" + jj + "]", ele).xval()
					);
					if (jj == 1) {
						sFldTxt = $("input[name=Org_ET" + jj + "]", ele).xval();
					} else {
						sFldTxt += "@!" + $("input[name=Org_ET" + jj + "]", ele).xval();
					}
				}
				$("textarea[name=Signature3]", ele).xval(shtml);
				$("input[name=SignatureTxt3]", ele).xval(sFldTxt); //1번과 2번을 번갈아 저장함

				var sFldTxt = "";
				//3번 기능사 명함 - 조직도 기본정보 자동 셋팅
				var shtml = $("#SignatureHTML_4", ele).html(); //HS 화성은 영문 명함

				var _prelist = $("input[name=SignatureTxt4]", ele).xval();
				var _prearray = _prelist.split("@!");
				for (var jj = 1; jj < 8; jj += 1) {
					if (jj == 6 || jj == 7) {				//자격증 - 입력값
						if (_seltype != "4" && _prearray.length == 7) {
							shtml = shtml.replace(
								new RegExp("{{input_" + jj + "}}", "gi"),
								_prearray[jj - 1]
							)
						} else {
							shtml = shtml.replace(
								new RegExp("{{input_" + jj + "}}", "gi"),
								$("input[name=input_" + jj + "]", ele).xval()
							);
						}
					} else {
						shtml = shtml.replace(
							new RegExp("{{input_" + jj + "}}", "gi"),
							$("input[name=Org_T" + jj + "]", ele).xval()	//조직도 기본정보
						);
					}
					if (jj == 1) {
						sFldTxt = $("input[name=Org_T" + jj + "]", ele).xval();
					} else {
						if (jj == 6 || jj == 7) {
							if (_seltype != "4" && _prearray.length == 7) {
								sFldTxt += "@!" + _prearray[jj - 1]; //자격증 - 입력값
							} else {
								sFldTxt += "@!" + $("input[name=input_" + jj + "]", ele).xval(); //자격증 - 입력값
							}
						} else {
							sFldTxt += "@!" + $("input[name=Org_T" + jj + "]", ele).xval(); //조직도 기본정보
						}
					}
				}
				$("textarea[name=Signature4]", ele).xval(shtml);
				$("input[name=SignatureTxt4]", ele).xval(sFldTxt); //1번과 2번을 번갈아 저장함

			},

			/* _$$.mail.mng.init_default_config  >>  메일 기본환경설정 열릴 때 */
			init_default_config: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_mailpath = $fn.getPath("mail"),
					url = "",
					_ele = null;

				//var _doc = $fn.doc(_opt, $("#"+(_opt.tabid != "" ? _opt.tabid : _opt.did)));		//tabid 또는 did 값으로 element를 잡아온다
				var _$target = _opt.did != "" ? $("#" + _opt.tabid, "#" + _opt.did) : $("#" + _opt.tabid, $fn.getTarget());
				var _doc = $fn.doc(_opt, _$target);
				_ele = _doc.element;
				var setDefaultBody = function (o) {
					//$dwp.ui.weditor.setDocBody($("#bodyFld", _ele), {bodyurl : $fn.getPath("weblib") + "/html/mail/" + $(o).attr("vdata")}, _doc);
				};

				//환경설정을 네모박스로 바꿈 - 2024.09.25
				$(".dwp-box-left, .dwp-box-middle, .dwp-box-right", $(".dwp-config-box", _ele)).off("click").on("click", function () {
					var _$this = $(this);
					var _data = _$this.data();
					$("[data-fldname=" + _data.fldname + "]", _ele).removeClass("selected");
					$("div", $("[data-fldname=" + _data.fldname + "]", _ele)).removeClass("dwp-box-selected").addClass("dwp-box-unselected");
					_$this.addClass("selected");
					$("div", _$this).removeClass("dwp-box-unselected").addClass("dwp-box-selected");
					$(":radio[name=" + _data.fldname + "][value=" + _data.value + "]", _ele).prop('checked', true);
					$(":radio[name=" + _data.fldname + "][value=" + _data.value + "]", _ele).click();
				});

				//===========================================================
				//	사용자 서명 타입에 따라서 처리 - 2020.08.31 by  mhkim
				var manualSignature = function (o) {
					var thisVal = $(o).xval();
					if (thisVal == "1") {
						_me.init_Signature_List(opt, _doc);
						//기술사 영역 숨기기
						$(".dwp-add-detail", $("#SignStyle", _ele)).addClass("dwp-none");
					} else {
						$("input[name=UserSignature]", _ele).attr("checked", false); //사용자가 작성한 서명의 라디오버튼 체크속성 제거
						$("input[name=UserSignatureUnid]", _ele).xval("");
						if (thisVal == "1" || thisVal == "2") { //기본명함
							//기술사 영역 숨기기
							$(".dwp-add-detail", $("#SignStyle", _ele)).addClass("dwp-none");
							for (var jj = 1; jj < 8; jj += 1) {
								$("input[name=input_" + jj + "]", _ele).xval($("input[name=Org_T" + jj + "]", _ele).xval());
							}
						} else if (thisVal == "3") { //기본명함(영문)
							//기술사 영역 숨기기
							$(".dwp-add-detail", $("#SignStyle", _ele)).addClass("dwp-none");
							for (var jj = 1; jj < 8; jj += 1) {
								$("input[name=input_" + jj + "]", _ele).xval($("input[name=Org_ET" + jj + "]", _ele).xval());
							}
						} else if (thisVal == "4") { //기술사 명함
							//기술사 영역 보여주기
							$(".dwp-add-detail", $("#SignStyle", _ele)).removeClass("dwp-none");

							//등록된 서명필드값 설정 20230531
							var sFldVal = $("input[name=SignatureTxt" + thisVal + "]", _ele).xval() + "@!@!@!@!@!@!@!@!@!";
							var vFldVal = sFldVal.split("@!");
							for (var jj = 1; jj < 8; jj += 1) {
								//저장된 기술사 정보가 있으면
								if (sFldVal != "" && (jj == 6 || jj == 7)) {
									$("input[name=input_" + jj + "]", _ele).xval(vFldVal[jj - 1]);								  //저장된 값
								} else {
									$("input[name=input_" + jj + "]", _ele).xval($("input[name=Org_T" + jj + "]", _ele).xval());  //기본값
								}
							}
						}
					}
				};
				//===========================================================

				_editor_area = $(".article-area", _ele);
				if (_editor_area.size() == 1) {
					_editor_area.css("height", 400);
				}

				$("#btn_googlecheck", _ele)
					.off("click")
					.on("click", function () {
						//구글연동확인 버튼
						_$$.mail.mng.google_Verification(_ele);
					});
				$("#btn_googleauth", _ele)
					.off("click")
					.on("click", function () {
						//구글연동 버튼
						_$$.mail.mng.google_Authenticate(_ele);
					});

				//===========================================================
				//	사용자 서명 타입에 따라서 처리 - 2020.08.31 by  mhkim
				if (_editor_area.size() == 1) {
					_editor_area.css("height", 250);
				}

				$("input[name=SignatureType]", _ele)
					.off("click")
					.on("click", function () {
						//메일 서명 옵션
						manualSignature(this);
					});
				$("input[name=SignatureType]:checked", _ele).click();

				_me.init_Signature_List(opt, _doc); //작성한 서명목록을 화면에 표시

				$("#signature_create", _ele)
					.off("click")
					.on("click", function () {

						//2024.10.07
						_me.popSignDoc(_doc, "");
						return;

						//사용자 서명 작성 버튼
						_$$.mail.com.newMail({
							url: $fn.getPath("mail") + "/wFrmProfileSign?OpenForm",
							ispop: true,
							width: 800,
							height: 300
						});
					});
				$("#signature_refresh", _ele)
					.off("click")
					.on("click", function () {
						//사용자 서명 작성 버튼
						_me.init_Signature_List(opt, _doc);
					});
				//===========================================================

				/*
									$("#btn_hk", _ele).off("click").on("click", function() {		//에디터 하단의 샘플 서명 아이콘 클릭
										$(".local-group", _ele).addClass("dwp-hidden");
										setDefaultBody(this);
									});
									$("#btn_hkrm", _ele).off("click").on("click", function() {		//에디터 하단의 샘플 서명 아이콘 클릭
										$(".local-group", _ele).addClass("dwp-hidden");
										$(".local-hkrm", _ele).removeClass("dwp-hidden");
									});
									$("#btn_bi", _ele).off("click").on("click", function() {			//에디터 하단의 샘플 서명 아이콘 클릭
										$(".local-group", _ele).addClass("dwp-hidden");
										$(".local-bi", _ele).removeClass("dwp-hidden");
									});
									$("input[type=radio]", $(".local-group", _ele)).off("click").on("click", function() {	//각 나라별 서명 아이콘 클릭
										$(".local-group", _ele).addClass("dwp-hidden");
										setDefaultBody(this);
									});
				*/
				$("#config_save", _ele)
					.off("click")
					.on("click", function () {
						//저장버튼

						if (_me.SignatureSave(_doc) == false) return; //회사의 지정 된 서명의 값을 저장.

						_doc.save({
							actiontype: "save",
							docstatus: "reg",
							callback: function (_jdata) {
								if (_jdata.hasOwnProperty("result")) {
									if (_jdata.result >= "200" && _jdata.result < "300") {
										if (_jdata.msgcode == "success") {
											$fn.toast({ msg: $fn.getCodeMsg("mail.msg.alt14") });
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
										}
									}
								}
							}
						});
					});

				if (_opt.signatureurl != "") {
					//기존 서명 본문이 있을 경우 에디터에 넣어준다
					//$dwp.ui.weditor.setDocBody($("#bodyFld", _ele), {bodyurl : _opt.signatureurl}, _doc);
				}
			},


			//사인 저장을  다이알로그 창으로 변경 - 2024.10.07
			popSignDoc: function (doc, url) {
				var _doc = doc;
				var _opt = _doc.options;
				var _el = _doc.element;
				var _url = url;
				if (url == "") {
					_url = $fn.getProxyUrl(_opt.cdb + "/wFrmProfileSign?OpenForm&popup=1");
				}
				$fn.dialog(null, {
					title: $fn.getCodeMsg("mail.title.usersignature"),
					width: 800,
					height: 580,
					modal: true,
					hide: { effect: "fade", duration: 300 },
					show: { effect: "fade", duration: 300 },
					content: {
						url: _url,
						data: {}
					},
					buttons: [
						{
							title: $fn.getCodeMsg("comm.btn.confirm"),
							css: "confirm",
							click: function (_$dialog) {
								var _diael = _$dialog.element;
								var _dopt = _$dialog.options;
								var _$doc = $fn.getInstance('doc', "#" + _dopt.id);
								var _del = _$doc.element;
								if ($("input[name=Subject]", _del).xval() == "") {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err13") }).done(function () {
										$("input[name=Subject]", _del).focus();
									});
									return;
								}
								//save 및 callback  함수
								_$doc.save({
									actiontype: "save",
									docstatus: "reg",
									callback: function (_jdata) {
										if (_jdata.hasOwnProperty("result")) {
											if (_jdata.result >= "200" && _jdata.result < "300") {
												if (_jdata.msgcode == "success") {
													$fn.toast({ msg: $fn.getCodeMsg("mail.msg.alt14") });
													if ($("#signature_refresh", _el).length == 1) {
														$("#signature_refresh", _el).click();
													}
												} else {
													$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
												}
												_$dialog.close();
											}
										}
									}
								});
							}
						}, {
							title: $fn.getCodeMsg("comm.btn.cancel"),
							css: "cancel",
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					],
					initcallback: function (_$dialog) {
						var _$el = _$dialog.element;
						$("#bodywrap", _$el).css("height", "350px");
						//$dwp.ui.datepicker(_$el, {});
					}
				});

			},


			getSignBody: function (_$doc) {
				var _opt = _$doc.options;
				var bodyData = "";
				//"app.mail01.js?_201711061050"
				$fn.xAjax({
					url: _opt.signatureurl,
					dataType: "html",
					async: false,
					cache: false
				})
					.done(function (data) {
						//$(_custom.element).html(data);
						bodyData = data;
					})
					.fail(function () { });

				return bodyData;
			},

			/* _$$.mail.mng.init_outofoffice_config  >>  메일 부재중설정 열릴 때 */
			init_outofoffice_config: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_mailpath = $fn.getPath("mail"),
					url = "",
					_ele = null,
					_options = null;

				//var _doc = $fn.doc(_opt, $("#"+(_opt.tabid != "" ? _opt.tabid : _opt.did)));		//tabid 또는 did 값으로 element를 잡아온다
				var _$target = null;
				if (_opt.ismobile) {
					_$target = $("#" + (_opt.tabid != "" ? _opt.tabid : _opt.did));
				} else {
					if (_opt.tabid != "") {
						_$target = _opt.did != "" ? $("#" + _opt.tabid, "#" + _opt.did) : $("#" + _opt.tabid, $fn.getTarget());
					} else {
						_$target = $("#" + _opt.did);
					}
				}

				var _doc = $fn.doc(_opt, _$target);
				_ele = _doc.element;
				_options = _doc.options;
				if (_options.ismobile == true) {
					_options = _doc.options;
					if ($("input[name=FromDate]", _ele).xval() == "") {
						var nDate = new Date();
						$("input[name=FromDate]", _ele).xval(nDate.format("isoDate"));
					}
					if ($("input[name=ToDate]", _ele).xval() == "") {
						var nDate = new Date();
						nDate.adjust(0, 0, 7, 0, 0, 0);
						$("input[name=ToDate]", _ele).xval(nDate.format("isoDate"));
					}
				} else {
					//환경설정을 네모박스로 바꿈 - 2024.09.25
					$(".dwp-box-left, .dwp-box-middle, .dwp-box-right", $(".dwp-config-box", _ele)).off("click").on("click", function () {
						var _$this = $(this);
						var _data = _$this.data();
						$("[data-fldname=" + _data.fldname + "]", _ele).removeClass("selected");
						$("div", $("[data-fldname=" + _data.fldname + "]", _ele)).removeClass("dwp-box-selected").addClass("dwp-box-unselected");
						_$this.addClass("selected");
						$("div", _$this).removeClass("dwp-box-unselected").addClass("dwp-box-selected");
						$(":radio[name=" + _data.fldname + "][value=" + _data.value + "]", _ele).prop('checked', true);
						$(":radio[name=" + _data.fldname + "][value=" + _data.value + "]", _ele).click();
					});
				}

				$fn.orgsel($("[name='org']", _doc.element), {
					isedit: _opt.isedit,
					usesite: true,
					treetype: "0", // 0 : 부서 & 사용자, 1 : 부서
					seltype: "2", // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
					fld: "ApprDelegation",
					count: 1,
					islazy: true
				});

				/*
				if ($("input[name=FromDate]", _ele).xval() != "") {
					$("input[name=FromDate]", _ele).xval($("input[name=FromDate]", _ele).xval());
				}
				if ($("input[name=ToDate]", _ele).xval() == "") {
					$("input[name=ToDate]", _ele).xval($("input[name=ToDate]", _ele).xval());
				}
				*/

				$("#config_save", _ele)
					.off("click")
					.on("click", function () {
						//저장버튼
						if ($("input[name=UseOutOfOffice]", _ele).xval() == "1") {
							var _fromdate = $("input[name=FromDate]", _ele).xval(),
								_todate = $("input[name=ToDate]", _ele).xval();
							if (_fromdate == "" || _todate == "") {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err35") });
								return;
							}
							_fromdate += $("select[name=FromHour]", _ele).xval();
							_todate += $("select[name=ToHour]", _ele).xval();
							if (_fromdate >= _todate) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err36") });
								return;
							}
						} else {
							$("input[name=FromDate]", _ele).xval("");
							$("input[name=ToDate]", _ele).xval("");
							$("select[name=FromHour]", _ele).xval("00");
							$("select[name=ToHour]", _ele).xval("23");
							$("select[name=OutOfOfficeReason]", _ele).xval("AR000");
							$("input[name=ApprDelegation]", _ele).xval("");
							$("input[name=ApprDelegationFull]", _ele).xval("");
						}
						_doc.save({
							actiontype: "save",
							docstatus: "reg",
							callback: function (_jdata) {
								if (_jdata.hasOwnProperty("result")) {
									if (_jdata.result >= "200" && _jdata.result < "300") {
										if (_jdata.msgcode == "success") {
											$fn.toast({ msg: $fn.getCodeMsg("mail.msg.alt14") });
											if (_options.did != "") {
												var __dlg = $("#" + _options.did),
													_inst = __dlg.xdialog("instance");
												_inst.close();
												return;
											}
											if (_options.ismobile == true) {
												var _page = { link: _options.pathinfo, linktype: "PAGE", layer: "doc", subtype: "edit" };
												//$dwp.core.mportal.loadPage(_page);
												$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt14") });
												$dwp.core.history.goback(-1);
											} else {
												_doc.reload();
											}
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
										}
									}
								}
							}
						});
					});
				// 뒤로 가기 버튼
				if (_options.ismobile == true) {
					$(".dwp-header-m div.back", _doc.element)
						.off("click")
						.on("click", function () {
							$dwp.core.history.goback(-1);
						});
					//mail.title.outofofficeset
					//console.log("doc.element", _doc.element)
					//console.log("title", $(".dwp-header-m div.dwp-page-title", _me.element))
					//console.log("title_mobile", $(".dwp-header-m div.dwp-page-title", _doc.element))
					$(".dwp-header-m div.dwp-page-title", _doc.element).text($fn.getCodeMsg("mail.title.outofofficeconfig"));
				}
				if (_options.startdate != "") $("input[name=FromDate]", _ele).xval(_options.startdate);
				if (_options.enddate != "") $("input[name=ToDate]", _ele).xval(_options.enddate);

				var starthour = _options.starthour || "",
					endhour = _options.endhour || ""; //통합일정에서 휴가로 일정이 등록되면 부재설정 화면이 오픈된다
				if (starthour != "") $("select[name=FromHour]", _ele).xval(starthour); //통합일정에서 호출될 경우 URL에 시작시간, 종료시간이 넘어온다
				if (endhour != "") $("select[name=ToHour]", _ele).xval(endhour);
				if (starthour != "" || endhour != "") $("input[name=UseOutOfOffice]", _ele).xval("1");
			},

			/* _$$.mail.mng.init_custom  >>  메일 관리화면 (부재중설정, Rule설정, 환경설정 메뉴) 열릴 때 */
			init_custom: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_mailpath = $fn.getPath("mail"),
					url = "",
					_target = $fn.getTarget(),
					_el = null,
					_custom0 = null,
					_custom1 = null,
					_custom2 = null;
				var tabactive = 0;
				if (_opt.formtype === "default") tabactive = 0;
				else if (_opt.formtype === "outofoffice") tabactive = 1;
				else if (_opt.formtype === "rule") tabactive = 2;
				else if (_opt.formtype === "forwarding") tabactive = 3;

				$(".tabs_mailconfig", _target).tabs({
					activate: function (event, ui) {
						var _curindex = ui.newTab.index();
						if (_curindex == 0) {
							_el = $("#dwp-tabs-config-content", _target);
							_opt.formtype = "default";
							_custom0 = $dwp.core.custom.init(_opt, _el);
							_me.init_config(_custom0); //환경설정 상단의 탭을 클릭 할 때 : 기본환경설정 init
						} else if (_curindex == 1) {
							_el = $("#dwp-tabs-outofoffice-content", _target);
							_opt.formtype = "outofoffice";
							_custom1 = $dwp.core.custom.init(_opt, _el);
							_me.init_outofoffice(_custom1); //환경설정 상단의 탭을 클릭 할 때 : 부재중자동회신 init
						} else if (_curindex == 2) {
							_el = $("#dwp-tabs-rule-content", _target);
							_opt.formtype = "rule";
							_custom2 = $dwp.core.custom.init(_opt, _el);
							_me.init_rule(_custom2); //환경설정 상단의 탭을 클릭 할 때 : 규칙설정 init
						} else {
							_el = $("#dwp-tabs-forwarding-content", _target);
							_opt.formtype = "forwarding";
							_custom2 = $dwp.core.custom.init(_opt, _el);
							_me.init_forwarding(_custom2); //환경설정 상단의 탭을 클릭 할 때 : 전달설정 init
						}
					}
				});

				if (tabactive == 0) {
					_el = $("#dwp-tabs-config-content", _target);
					_opt.formtype = "default";
					_custom0 = $dwp.core.custom.init(_opt, _el);
					_me.init_config(_custom0); //기본환경설정 init
				}

				if (tabactive == 1) {
					_el = $("#dwp-tabs-outofoffice-content", _target);
					_opt.formtype = "outofoffice";
					_custom1 = $dwp.core.custom.init(_opt, _el);
					_me.init_outofoffice(_custom1); //부재중자동회신 init
				}

				if (tabactive == 2) {
					_el = $("#dwp-tabs-rule-content", _target);
					_opt.formtype = "rule";
					_custom2 = $dwp.core.custom.init(_opt, _el);
					_me.init_rule(_custom2); //규칙설정 init
				}

				if (tabactive == 3) {
					_el = $("#dwp-tabs-forwarding-content", _target);
					_opt.formtype = "forwarding";
					_custom2 = $dwp.core.custom.init(_opt, _el);
					_me.init_forwarding(_custom2); //전달설정 init
				}

				$(".tabs_mailconfig", _target).tabs({ active: tabactive });
				$(".tabs_mailconfig", _target).removeClass("dwp-hidden");
				$fn.convertLangPage({}, $(".tabs_mailconfig > ul", _target));
				$fn.convertLangPage({}, $(".dwp-page-heading", _target));
				$fn.convertLangPage({}, $("#dwp-tabs-forwarding-content", _target));
			},

			/* _$$.mail.mng.init_config  >>  메일 기본환경설정 탭 init*/
			init_config: function (_custom) {
				var _me = this,
					_options = _custom.options,
					_ele = _custom.element,
					_editor_area = null;
				if (!_options.hasOwnProperty("init_config")) {
					$fn.xAjax({
						url: _options.profileurl,
						dataType: "html",
						/*async : false,*/
						cache: false
					})
						.done(function (data) {
							$(_custom.element).html(data);
						})
						.fail(function () { });
				} else {
					if (_options.signatureurl != "") {
						//기존 서명 본문이 있을 경우 에디터에 넣어준다
						$dwp.ui.weditor.setDocBody($("#bodyFld", _ele), { bodyurl: _options.signatureurl }, _custom);
					}
				}
				_options["init_config"] = "init"; //탭을 클릭할 때 중복 로드를 제한
			},

			/* _$$.mail.mng.init_outofoffice  >>  메일 환경설정 > 부재중자동회신 탭 init */
			init_outofoffice: function (_custom) {
				var _me = this,
					_options = _custom.options,
					_ele = _custom.element,
					_editor_area = null;
				if (!_options.hasOwnProperty("init_outofoffice")) {
					$fn.xAjax({
						url: _options.outofofficeurl,
						dataType: "html",
						/*async : false,*/
						cache: false
					})
						.done(function (data) {
							$(_custom.element).html(data);
						})
						.fail(function () { });
				}
				_options["init_outofoffice"] = "init"; //탭을 클릭할 때 중복 로드를 제한
			},

			/* _$$.mail.mng.init_rule  >>  메일분류규칙 설정화면 열릴 때 버튼 처리 및 등록된 규칙 정보 화면에 표시*/
			init_rule: function (_custom) {
				var _me = this,
					_options = _custom.options,
					_ele = _custom.element,
					_tbody = $("#mail_rule_table", _ele),
					_tr = "",
					_tmp = null,
					_info = "",
					_info2 = "";
				$("#btn_rule_add", _ele)
					.off("click")
					.on("click", function () {
						_me.rules_edit(_custom, {});
					}); //추가 버튼
				$("#btn_rule_up", _ele)
					.off("click")
					.on("click", function () {
						_me.rules_updown(_custom, "up");
					}); //위로 버튼
				$("#btn_rule_down", _ele)
					.off("click")
					.on("click", function () {
						_me.rules_updown(_custom, "down");
					}); //아래로 버튼
				_me.rule_info_display(_custom);
			},

			/* _$$.mail.mng.init_rule  >>  메일분류규칙 설정화면 열릴 때 버튼 처리 및 등록된 규칙 정보 화면에 표시*/
			init_forwarding: function (_custom) {
				var _me = this,
					_options = _custom.options,
					_ele = _custom.element;
				_options.forward_db_path = "/dwp/com/mail/forward.nsf";
				$("#btn_forwarding_add", _ele)
					.off("click")
					.bind("click", function () {
						_me.forwarding_edit(_custom, "new", {});
					});
				$("#btn_forwarding_del", _ele)
					.off("click")
					.bind("click", function () {
						_me.forwarding_delete(_custom, "new", {});
					});
				_me.forwarding_info_display(_custom);
			},
			forwarding_delete: function (_custom) {
				var that = this,
					_opt = _custom.options,
					_ele = _custom.element,
					_tbody = $("#forwarding_address_table", _ele);
				var _$chk = _tbody.find("[name='chk']:checked"),
					_rows = _$chk.closest("tr");
				var _filepath = _opt.forward_db_path;

				if (_rows.length === 0) return false;

				_unids = $.map(_rows, function (o) {
					return $(o).data("_JDATA")["@unid"];
				}).join(";");

				$fn.confirm({ msg: "선택한 문서를 삭제하시겠습니까?" }).done(function () {
					$fn.cmdPost(
						$dwp.core.util.getProxyUrl(_filepath + "/wcmdpost?createdocument"),
						{ actiontype: "del_reg", postdata: _unids },
						function (data) {
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									that.forwarding_info_display(_custom);
									$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg003") });
								} else {
									//error
								}
							} else {
								//error
							}
						},
						"json"
					);
				});
			},
			forwarding_edit: function (_custom, _actiontype, data) {
				var that = this,
					_opt = _custom.options,
					_ele = _custom.element;
				var _filepath = _opt.forward_db_path;
				var _url = _actiontype === "new" ? _filepath + "/wFrmForward?OpenForm" : _filepath + "/wvnotesid/" + data._docid + "?EditDocument";
				$fn.dialog(null, {
					title: $fn.getCodeMsg("mail.title.foward"),
					width: 640,
					height: 340,
					modal: true,
					hide: { effect: "fade", duration: 300 },
					show: { effect: "fade", duration: 300 },
					content: {
						url: _url,
						data: {}
					},
					buttons: [
						{
							title: $fn.getCodeMsg("comm.btn.confirm"),
							css: "confirm",
							click: function (_$dialog) {
								var _el = _$dialog.element;
								var _email_addr = $("input[name='Forward_Addr']", _el).xval();

								var emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //이메일 정규식
								if (!emailRule.test(_email_addr)) {
									$fn.alert({ msg: "메일주소를 정확히 입력해 주십시오.예)abcd@naver.com" });
									return false;
								}

								$fn.xAjaxSubmit($("form", _el), {
									dataType: "JSON",
									beforeSubmit: function (arr, $form, options) { },
									success: function (data, statusText, xhr, $form) {
										console.log("저장결과:", data);
										if (data.result === "200") {
											that.forwarding_info_display(_custom);
											_$dialog.close();
										} else {
											$fn.alert({ msg: "상대방이 먼저 전달자로 지정하였습니다." });
										}
									},
									error: function (xhr, textStatus) {
										return false;
									}
								});
							}
						},
						{
							title: $fn.getCodeMsg("comm.btn.cancel"),
							css: "cancel",
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					],
					initcallback: function (_$dialog) {
						var _$el = _$dialog.element;
						$dwp.ui.datepicker(_$el, {});
					}
				});
			},
			forwarding_info_display: function (_custom) {
				var that = this,
					_opt = _custom.options,
					_ele = _custom.element,
					_tbody = $("#forwarding_address_table", _ele);
				var _notesid = $fn.getCurUser().abnotesid;
				var _filepath = _opt.forward_db_path;
				var _url = $dwp.core.util.getProxyUrl(_filepath + "/api/data/collections/name/wvnotesid?ps=999&page=0");
				var _data = {
					url: _url,
					method: "GET",
					cache: false,
					async: true,
					dataType: "JSON",
					data: { category: _notesid }
				};
				$fn.xAjax(_data)
					.done(function (data) {
						var _$tr, _$chk, _$addr, _$term;
						console.log(data);
						_tbody.find("tr").remove();
						if (data.length === 0) {
							_$tr = $("<tr></tr>").appendTo(_tbody);
							_$chk = $("<td colspan='4'>문서가 없습니다.</td>").appendTo(_$tr);
						} else {
							$.each(data, function (idx, o) {
								_$tr = $("<tr></tr>").appendTo(_tbody);
								_$tr.data("_JDATA", o);
								_$chk = $("<td><div class='dwp-checkbox textless'><label><input name='chk' class='dwp-check' type='checkbox'><span></span></label></div></td>").appendTo(_$tr);
								_$addr = $("<td><div class='dwp-cursor'>" + o._address + "</div></td>").appendTo(_$tr);
								_$exaddr = $("<td><div class='dwp-cursor'>" + o._except_addr + "</div></td>").appendTo(_$tr);
								_$term = $("<td><div class='dwp-cursor'>" + $fn.formatDateTime(o._fromdate, "dateonly") + " ~ " + $fn.formatDateTime(o._enddate, "dateonly") + "</div></td>").appendTo(_$tr);
								_$addr.bind("click", function () {
									that.forwarding_edit(_custom, "edit", $(this).closest("tr").data("_JDATA"));
								});
							});
						}
					})
					.fail(function (xhr) {
						console.log(xhr);
					});
				return;
			},
			/* _$$.mail.mng.rule_info_display  >>  메일분류규칙 설정 화면이 열릴 때 등록된 규칙 정보를 화면에 표시*/
			rule_info_display: function (_custom) {
				var _options = _custom.options,
					_ele = _custom.element,
					_tbody = $("#mail_rule_table", _ele),
					_tr = "",
					_tmp = null,
					_info = "",
					_info2 = "",
					_onoff = "",
					_selposition = "" || _options.selposition;
				$dwp.core.util
					.xAjax({
						url: $dwp.core.util.getProxyUrl(_options.cdb + "/api/data/collections/name/(Rules)?ps=999&page=0"),
						type: "GET",
						dataType: "json",
						/*async : true,*/
						cache: false,
						data: {}
					})
					.done(function (data) {
						$("tr", _tbody).remove();
						if (data.length == 0) {
							_tr = '<tr><td colspan=5><span data-xlang="LC_TEXT" data-xlang-code="mail.title.nothingrule">';
							_tr += $fn.getCodeMsg("mail.title.nothingrule") + "<!--등록된 규칙이 없습니다--></span></td></tr>";
							_tr = _tbody.append(_tr);
						} else {
							console.log("data ", data);

							_tbody.find("tr").remove();
							var _subject = $fn.getCodeMsg("mail.title.subject"),
								_sender = $fn.getCodeMsg("mail.title.sendname"),
								_movetofolder = $fn.getCodeMsg("mail.title.movetofolder"),
								_mailaddress = $fn.getCodeMsg("mail.title.mailaddress"),
								_inusers = $fn.getCodeMsg("mail.title.inusers"),
								_eqal = $fn.getCodeMsg("mail.title.equal"),
								_contains = $fn.getCodeMsg("mail.title.contains");
							$.each(data, function (i, o) {
								/*
							_tmp = o["$112"].split(" contains ");
							if (o["_field"] == "Subject") {						//제목에서 검색
								_info = _subject + " (" + (o["_condition"] == "contains" ? _contains : _eqal) + ") : " + o["_findtxt"].replace(/</gi,"&lt;").replace(/>/gi,"&gt;");
							} else {
								if (o["_condition2"] == "mailaddress") {		//외부메일
									_info = _mailaddress + " (" + (o["_condition"] == "contains" ? _contains : _eqal) + ") : " + o["_findtxt"].replace(/</gi,"&lt;").replace(/>/gi,"&gt;");
								} else {											//내부 NotesID
									_info = _inusers + " (" + (o["_condition"] == "contains" ? _contains : _eqal) + ") : " + o["_findtxt"].replace(/</gi,"&lt;").replace(/>/gi,"&gt;");
								}
							}
							*/
								//======================================================================
								//		조건을 AND와 OR 를 추가하면서 배열 형태로 들어가게 되어서 수정 - 2017.09.01 by dwlee
								//======================================================================

								if ($.isArray(o["$112"])) {
									_tmp = "";
									_info = "";
									_ftitle = "";
									var _conarry = o["$112"];
									for (var j = 0; j < _conarry.length; j++) {
										if (_conarry[j].indexOf(" Subject ") > -1) {
											_ftitle = _subject;
										} else {
											// Subject 인 경우라서 여기를 통과하지 않음
											if (o["_condition2"][j] == "") {
												_ftitle = "";
											} else if (o["_condition2"][j] == "mailaddress") {
												//외부메일
												_ftitle = _mailaddress;
											} else {
												_ftitle = _inusers;
											}
										}

										if (_conarry[j].indexOf("OR ") > -1) {
											_info += "<span style='color:red;font-weight:bold'> " + $fn.getCodeMsg("mail.title.or") + " </span>";
										} else if (_conarry[j].indexOf("AND ") > -1) {
											_info += "<span style='color:red;font-weight:bold'> " + $fn.getCodeMsg("mail.title.and") + "  </span>";
										}

										if (_conarry[j].indexOf(" contains ") > -1) {
											_info += _ftitle + " (" + _contains + ") : ";
										} else {
											_info += _ftitle + " (" + _eqal + ") : ";
										}
										_info += o["_findtxt"][j].replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
									}
									console.log("INFO(Array) : ", _info);
								} else {
									_tmp = o["$111"].split(" contains ");
									if (o["_field"] == "Subject") {
										//제목에서 검색
										_info = _subject + " (" + (o["_condition"] == "contains" ? _contains : _eqal) + ") : " + o["_findtxt"].replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
									} else {
										if (o["_condition2"] == "mailaddress") {
											//외부메일
											_info = _mailaddress + " (" + (o["_condition"] == "contains" ? _contains : _eqal) + ") : " + o["_findtxt"].replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
										} else {
											//내부 NotesID
											_info = _inusers + " (" + (o["_condition"] == "contains" ? _contains : _eqal) + ") : " + o["_findtxt"].replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
										}
									}
									console.log("INFO(String) : ", _info);
								}

								_tmp = o["$111"].split(" move to folder ");
								if (_tmp[1].indexOf("($JunkMail)") != -1) {
									_info2 = $fn.getCodeMsg("mail.title.movetojunk");
								} else if (_tmp[1].indexOf("($Trash)") != -1) {
									_info2 = $fn.getCodeMsg("mail.title.movetotrash");
								} else {
									_info2 = _movetofolder + " : " + _tmp[1].replace(/\\/g, "≫");
								}
								_onoff = o["$108"].toUpperCase().indexOf("_ON.") == -1 ? '<td style="color:#FF0000;">Off</td>' : '<td style="color:#0000FF">On</td>';

								_tr = '<tr><td><div class="dwp-radio textless"><label><input type="radio" name="radio_rule_list" value="' + o["@unid"] + '" data-position="' + o["@position"] + '" ';
								_tr += (_selposition == o["@position"] ? " checked " : "") + "><span></span></label></div></td>";
								_tr += '<td style="text-align:left;">' + _info + '</td><td style="text-align:left;">' + _info2 + "</td>" + _onoff + "";
								_tr += '<td><div class="dwp-btn btn-rule-edit" unid="' + o["@unid"] + '" data-position="' + o["@position"] + '" ><span>' + $fn.getCodeMsg("mail.btn.edit2") + "</span></div> ";
								_tr += '<div class="dwp-btn btn-rule-delete" unid="' + o["@unid"] + '" data-position="' + o["@position"] + '" ><span>' + $fn.getCodeMsg("mail.btn.deldoc") + "</span></div></td></tr>";
								_tr = _tbody.append(_tr);
							});
						}
						$fn.convertLangPage({}, _ele);
						$(".btn-rule-edit", _ele)
							.off("click")
							.on("click", function () {
								_$$.mail.mng.rules_edit(_custom, { editunid: $(this).attr("unid") });
							}); //수정 버튼
						$(".btn-rule-delete", _ele)
							.off("click")
							.on("click", function () {
								_$$.mail.mng.rules_delete(_custom, $(this).attr("unid"));
							}); //삭제 버튼
					})
					.fail(function () { });
			},

			/* _$$.mail.mng.rules_delete  >>  메일 규칙 : 규칙 삭제 버튼 클릭*/
			rules_delete: function (_custom, unid) {
				var _options = _custom.options,
					_ele = _custom.element,
					_tbody = $("#mail_rule_table", _ele);
				var callback = function (_obj, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.msgcode == "success") {
								_options.selposition = "";
								_$$.mail.mng.init_custom(_options);
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return;
							}
						}
					}
				};
				var _pdata = {
					AgentName: "wAgtCmdProcess",
					WQS_Agent: "wAgtCmdProcess",
					actiontype: "delete_rule",
					Arg1: unid
				};
				_$$.mail.com.cmdpost(_pdata, callback);
			},

			/* _$$.mail.mng.rules_updown  >>  메일 규칙 : 선택된 규칙 순서 변경*/
			rules_updown: function (_custom, updown) {
				var _me = this,
					_options = _custom.options,
					_ele = _custom.element,
					_tbody = $("#mail_rule_table", _ele),
					_radio = $("input[name=radio_rule_list]:checked", _tbody);
				if (_radio.size() != 1) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
					return;
				} //문서를 선택하십시요.
				if (updown == "up") {
					if (_radio.attr("data-position") < "2") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt04") });
						return;
					} //최상위 레벨 문서를 올릴 수 없습니다.
				} else {
					if ($("input[name=radio_rule_list]", _tbody).size() - 1 < _radio.attr("data-position")) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt05") });
						return;
					} //최하위 레벨 문서를 내릴 수 없습니다.
				}

				var callback = function (_obj, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.msgcode == "success") {
								_options.selposition = "";
								if (data.hasOwnProperty("selposition")) {
									_options.selposition = data.selposition; //순서 변경 이후 화면에 체크박스 선택해줘야 할 때
								}
								_$$.mail.mng.init_custom(_options);
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return;
							}
						}
					}
				};
				var _pdata = {
					AgentName: "wAgtCmdProcess",
					WQS_Agent: "wAgtCmdProcess",
					actiontype: "updown_rule",
					Arg1: _radio.attr("data-position"),
					/*up down 대상 position*/
					Arg2: updown /*up / down*/
				};
				_$$.mail.com.cmdpost(_pdata, callback);
			},

			/* _$$.mail.mng.rules_getfield  >>  메일규칙 설정화면의 필드 값을 Object 형식으로 리턴한다...
			 * 값을 추출할 때 필드값 체크 후 메시지 출력해준다*/
			rules_getfield: function (_modal) {
				var rdata = {};
				var _status = $("input[name=status]", _modal).xval(); /*사용유무*/
				rdata["selok"] = false; /*필드값 체크 후 오류가 있으면 false, 정상이면 true*/

				var _$nodelist = $(".dwp-rule-cell", _modal);

				if (_$nodelist.size() == 0) {
					$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
					return rdata;
				}

				var con_array = [];
				var rule_array = [];
				var con2_array = [];
				var text_array = [];
				var user_array = [];
				var userf_array = [];
				var andor_array = [];

				$.each(_$nodelist, function (index, node) {
					_$node = $(node);
					_node = _$node.data("opt");

					//						console.log("---------------------------------------");
					//						console.log(_node);
					//						console.log("---------------------------------------");

					con_array.push(_node.condition);
					if (index == 0) {
						andor_array.push("");
					} else {
						if (_node.andor == "1") {
							andor_array.push("AND");
						} else {
							andor_array.push("OR");
						}
					}
					rule_array.push(_node.rule);
					text_array.push(_node.findtext);
					con2_array.push(_node.condition2);
					user_array.push(_node.users);
					userf_array.push(_node.usersfull);
				});

				_condition = con_array.join(";");
				_rule = rule_array.join(";");
				_condition2 = con2_array.join(";");
				_findtext = text_array.join(";");
				_users = user_array.join(";");
				_usersfull = userf_array.join(";");
				_andor = andor_array.join(";");

				/*
									_condition = $("input[name=condition]", _modal).xval(), 				//조건설정 (발신자명/주소, 제목)
									_rule = $("select[name=rule]", _modal).xval(), 							//다음을 포함 (1), 다음과 같음 (2)
									_condition2 = $("input[name=condition2]", _modal).xval(), 				//조건설정 (메일주소, 사용자선택)
									_findtext = $("input[name=findtext]", _modal).xval(), 					//검색 문자열
									_users = $("input[name=Users]", _modal).xval(), 						//사용자 NotesID
									_usersfull = $("input[name=UsersFull]", _modal).xval(), 				//사용자 Org Data
				*/

				(_treatment = $("input[name=treatment]", _modal).xval()) /*처리방법 (영구보관함으로 이동, 스펨메일함으로 이동, 삭제(휴지통)*/, (_folder = $("select[name=CurrentFolders]", _modal).xval()) /*forder name*/, (_folderunid = ""); /*folder unid*/

				/*
									if (_status == "") { $fn.alert({msg : "[ " + $fn.getCodeMsg("mail.title.ruleenable") + " ] " + $fn.getCodeMsg("mail.msg.err18")}); return rdata; }
									if (_condition == "") { $fn.alert({msg : "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18")}); return rdata; }
									if (_rule == "") { $fn.alert({msg : "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18")}); return rdata; }
									if (_condition == "Sender") {
										if (_condition2 == "usersearch") {				//사용자선택 (검색)
											if (_users == "") { $fn.alert({msg : "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18")}); return rdata; }
											if (_usersfull == "") { $fn.alert({msg : "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18")}); return rdata; }
										} else if (_condition2 == "mailaddress") {		//메일주소
											if (_findtext == "") { $fn.alert({msg : "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18")}); return rdata; }
										} else {												//조건선택 2차 값이 공백이다
											$fn.alert({msg : "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18")}); return rdata;
										}
									}
									if (_condition == "Subject") {							//제목으로 검색한다
										if (_findtext == "") { $fn.alert({msg : "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18")}); return rdata; }
									}
				*/

				if (_treatment == "") {
					$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruleaction") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
					return rdata;
				}
				if (_treatment == "folder" && (_folder == "root" || _folder == "")) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
					return rdata;
				}

				if (_treatment == "folder") {
					//영구보관함으로 이동
					if (_folder == "root" || _folder == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
						return rdata;
					} else {
						_folderunid = $("select[name=CurrentFolders] > option:selected", _modal).attr("unid");
					}
				} else {
					_folderunid = $("input[name=treatment]:checked", _modal).attr("data-unid"); //스펨메일, 휴지통 FolderUNID
					_folder = $("input[name=treatment]:checked", _modal).xval();
				}
				_folder = _folder == "junk" ? "($JunkMail)" : _folder;
				_folder = _folder == "trash" ? "($Trash)" : _folder;
				_findtext = _findtext.replace(/\"/gi, "＂"); //따옴표는 전각문자로 변경해서 리턴한다

				rdata.Arg1 = _status; /*사용유무*/
				rdata.Arg2 = _condition; /*조건설정 (발신자명/주소, 제목)*/
				rdata.Arg3 = _rule; /*다음을 포함 (1), 다음과 같음 (2)*/
				rdata.Arg4 = _condition2; /*조건설정 (메일주소, 사용자선택)*/
				rdata.Arg5 = _findtext; /*검색 문자열*/
				rdata.Arg6 = _users; /*사용자 NotesID*/
				rdata.Arg7 = _usersfull; /*사용자 Org Data*/

				rdata.Arg8 = _treatment; /*처리방법 (영구보관함으로 이동, 스펨메일함으로 이동, 삭제(휴지통)*/
				rdata.Arg9 = _folder; /*forder name*/
				rdata.Arg10 = _folderunid; /*folder unid*/
				rdata.Arg11 = ""; /*편집중인 규칙문서 UNID*/
				rdata.Arg13 = _andor; //AND OR
				rdata.selok = true; /*필드값 체크 후 오류가 있으면 false, 정상이면 true*/
				return rdata;
			},

			/* _$$.mail.mng.rules_edit  >>  메일분류규칙 화면의 규칙 신규 추가 버튼*/
			rules_edit: function (_custom, opt) {
				var _me = this,
					_opt = $.extend({ editunid: "" }, opt),
					_options = _custom.options,
					_ele = _custom.element,
					_tbody = $("#mail_rule_table", _ele),
					_tr = "",
					_tmp = null,
					_info = "",
					_info2 = "";

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							var callback = function (_obj, data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										if (data.hasOwnProperty("cnt")) {
											if (typeof _opt.save_callback == "function") {
												_opt.save_callback(obj, _obj, data);
											} else {
												obj.close();
												_$$.mail.mng.init_custom(_options);
											}
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return;
										}
									} else {
										$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
										return;
									}
								}
							};
							var _pdata = { WQS_Agent: "wAgtCmdProcess", actiontype: "new_rule", postdata: "" },
								arrinfo = [],
								chk = false;
							_pdata = $.extend(_pdata, _me.rules_getfield(obj.element));

							console.log("==================================");
							console.log("_pdata : ", _pdata);
							console.log("==================================");

							_pdata.Arg11 = "" || _opt.editunid; //규칙 편집상태면 편집중인 규칙문서의 UNID

							if (_opt.hasOwnProperty("selmailinfo")) {
								if (_pdata.Arg1 == "1") {
									if (_opt.hasOwnProperty("selmailinfo") == true) {
										if (_opt.selmailinfo != "") {
											(arrinfo = _opt.selmailinfo.split("^§^")), (chk = false);
											if (_pdata.Arg2 == "Sender") {
												//조건설정 (발신자명/주소)
												if (_pdata.Arg3 == "1") {
													//다음을 포함
													if (_pdata.Arg4 == "mailaddress") {
														if (_pdata.Arg5.toUpperCase().indexOf(arrinfo[0].toUpperCase()) != -1) chk = true;
													} else {
														if (_pdata.Arg6.toUpperCase().indexOf(arrinfo[0].toUpperCase()) != -1) chk = true;
													}
												} else {
													//다음과 같음
													if (_pdata.Arg4 == "mailaddress") {
														if (_pdata.Arg5 == arrinfo[0]) chk = true;
													} else {
														if (_pdata.Arg6 == arrinfo[0]) chk = true;
													}
												}
											} else {
												//조건설정 (제목)
												if (_pdata.Arg3 == "1") {
													//다음을 포함
													if (_pdata.Arg5.toUpperCase().indexOf(arrinfo[2].toUpperCase()) != -1) chk = true;
												} else {
													//다음과 같음
													if (_pdata.Arg5 == arrinfo[2]) chk = true;
												}
											}
										}
									}
								}
								_pdata.Arg12 = chk == true ? arrinfo[3] : ""; //규칙 등록 후 해당 조건으로 일치하는 경우 선택한 문서를 폴더로 이동한다 (대상 문서의 UNID)
							}

							if (_pdata.selok == false) return; //오류값이 있으면 그냥 종료
							_$$.mail.com.cmdpost(_pdata, callback);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];
				$fn.dialog(_ele, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.ruleset"),
					width: 730,
					height: 485,
					show: "fade", //effect
					hide: "fade", //effect
					send_data: _opt,
					//autoOpen: false,		//.dialog("open")호출시만 열림
					init_callback: null || _opt.init_callback, //dialog 화면 로딩 완료 이후 실행
					save_callback: null || _opt.save_callback, //dialog 확인버튼 저장 이후..
					buttons: _buttons,
					content: { url: _options.cdb + "/wFrmRuleSet?ReadForm" + (_opt.editunid != "" ? "&unid=" + _opt.editunid : ""), data: {} }
				});
			},

			/* _$$.mail.mng.setRuleEditInfo  >>  규칙 편집화면일 경우 편집하는 규칙 정보를 화면에 표시*/
			setRuleEditInfo: function (_opt, __doc) {
				console.log("_opt ", _opt);

				var _subject = $fn.getCodeMsg("mail.title.subject"),
					_sender = $fn.getCodeMsg("mail.title.sendname"),
					_movetofolder = $fn.getCodeMsg("mail.title.movetofolder"),
					_mailaddress = $fn.getCodeMsg("mail.title.mailaddress"),
					_inusers = $fn.getCodeMsg("mail.title.inusers"),
					_eqal = $fn.getCodeMsg("mail.title.equal"),
					_contains = $fn.getCodeMsg("mail.title.contains");

				var arr_condition = _opt.editruleinfo.condition.split(";");
				var arr_andor = _opt.editruleinfo.andor.split(";");
				var arr_rule = _opt.editruleinfo.rule.split(";");
				var arr_condition2 = _opt.editruleinfo.condition2.split(";");
				var arr_findtext = _opt.editruleinfo.findtext.split(";");
				var arr_users = _opt.editruleinfo.users.split(";");
				var arr_usersfull = _opt.editruleinfo.usersfull.split(";");

				var _$list = $(".dwp-rule-list", __doc);

				$.each(arr_condition, function (index, node) {
					var _$node = $("<div class='dwp-rule-cell'></div>");
					_$node.css({ "top-margin": "10px", height: "30px" });

					_condition = node;
					_andor = arr_andor[index];
					_rule = arr_rule[index];
					_condition2 = arr_condition2[index];

					_findtext = arr_findtext[index];
					_users = arr_users[index];
					_usersfull = arr_usersfull[index];

					if (_condition == "") {
						$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
						return;
					}
					if (_rule == "") {
						$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
						return;
					}
					if (_condition == "Sender") {
						if (_condition2 == "usersearch") {
							//사용자선택 (검색)
							if (_users == "") {
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
							if (_usersfull == "") {
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
						} else if (_condition2 == "mailaddress") {
							//메일주소
							if (_findtext == "") {
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
						} else {
							//조건선택 2차 값이 공백이다
							$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
							return;
						}
					}
					if (_condition == "Subject") {
						//제목으로 검색한다
						if (_findtext == "") {
							$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
							return;
						}
					}

					var _info = "";
					if ($(".dwp-rule-cell", __doc).size() != 0) {
						if (_andor == "1") {
							_info = $fn.getCodeMsg("mail.title.and") + " ";
						} else if (_andor == "2") {
							_info = $fn.getCodeMsg("mail.title.or") + " ";
						}
					} else {
						_andor = "";
					}
					_nodeopt = {
						condition: _condition, //조   건 : 제목 혹은 발신자
						andor: _andor, //연산자 : 다중 조건일 경우 AND 혹은 OR
						rule: _rule, //비교문 : 포함(1), 같음(2)
						findtext: _findtext, //검색 문자열
						condition2: _condition2, //조건설정 : 메일주소,사용자 선택
						users: _users, //사용자 NotesID
						usersfull: _usersfull //사용자 OrgData
					};
					_$node.data("opt", _nodeopt);

					var _$cell = $("<div></div>");
					_$cell.css({ border: "0px solid darkgray", height: "30px", width: "400px", "text-decoration": "underline" });

					if (_condition == "Subject") {
						//제목에서 검색
						_info += _subject + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _findtext.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
					} else {
						if (_condition2 == "mailaddress") {
							//외부메일
							_info += _mailaddress + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _findtext.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
						} else {
							//내부 NotesID

							//console.log("+++++++++++++++++++++++++++++++++++++++++");
							//console.log("usersfull : ",_usersfull);
							//console.log("+++++++++++++++++++++++++++++++++++++++++");

							var org = new $fn.orgData($.trim(_usersfull)); //빼내서 쓸때는 이렇게 가져갑시다...
							var _dspVal = "";
							if (org.oinfo.type == "B") {
								_dspVal = $fn.getCurLangMsg(org.oinfo.orgname);
							} else {
								_dspVal = $fn.getCurLangMsg(org.oinfo.username);
							}

							_info += _inusers + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _dspVal;
						}
					}
					_$cell.append(_info);

					_$delbtn = $("<div></div>");
					_$delbtn.css({ "right-margin": "10px", float: "right" });
					_$delbtn.off("click").on("click", function () {
						var _$this = $(this);
						var _$node = _$this.parent().parent();
						_$node.remove();
						if ($(".dwp-rule-cell", __doc).size() == 0) {
							$("select[name=andor]", __doc).xval("");

							//2024.10.07
							//$(".dwp-andor", __doc).addClass("dwp-hidden");
							$(".dwp-andor", __doc).addClass("dwp-none");
						}
					});
					_$delbtn.append("<img style='border:1px solid darkgray' src='" + $fn.getPath("weblib") + "/images/common/btn-cancel.svg' width=12 height=12>");
					_$cell.append(_$delbtn);

					_$node.append(_$cell);
					_$list.append(_$node);
				});

				var _data = {} || _opt.editruleinfo;
				if (_opt.editruleunid == "") return; //규칙 UNID값이 없으면 여기서 종료

				$("input[name=status][value=" + _opt.editruleinfo.status + "]", __doc).attr("checked", true);
				/*
									$("input[name=condition][value=" + _opt.editruleinfo.condition + "]", __doc).attr("checked", true);
									$("input[name=findtext]", __doc).xval(_opt.editruleinfo.findtext);
				*/

				$("input[name=treatment][value=" + _opt.editruleinfo.treatment + "]", __doc).attr("checked", true);
				if (_opt.editruleinfo.CurrentFolders != "") $("select[name=CurrentFolders]>option[unid='" + _opt.editruleinfo.CurrentFolders + "']", __doc).attr("selected", true);

				//2024.10.07
				//$(".dwp-andor", __doc).removeClass("dwp-hidden");
				$(".dwp-andor", __doc).removeClass("dwp-none");
				/*
				if (_opt.editruleinfo.condition == "Sender") {
					$(".dwp-Sender-opt", __doc).removeClass("dwp-hidden");
					if (_opt.editruleinfo.condition2 == "mailaddress") {
						$(".dwp-findtext", __doc).removeClass("dwp-hidden");
						$("[name=org1]", __doc).addClass("dwp-hidden");
					} else {
						$(".dwp-findtext", __doc).addClass("dwp-hidden");
						$("[name=org1]", __doc).removeClass("dwp-hidden");
					}

				} else {
					$(".dwp-Sender-opt", __doc).addClass("dwp-hidden");
					$(".dwp-findtext", __doc).removeClass("dwp-hidden");
					$("[name=org1]", __doc).addClass("dwp-hidden");
				}
				*/
			},

			/* _$$.mail.mng.init  >>  메일 관리화면이 열릴 때 */
			init: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt); //, _mailpath = $fn.getPath("mail"), url = "", _doc = $fn.doc(_opt), _options = _doc.options;

				if (opt.formtype == "mailbox") {
					/*메일함관리 화면일때*/
					_me.init_mailbox(opt);
					return;
				}
			},

			/* _$$.mail.mng.init_mailbox  >>  메일함 관리 화면이 열릴 때 개인별 기본 메일 정보를 화면에 표시함 */
			init_mailbox: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_mailpath = $fn.getPath("mail"),
					url = "",
					_doc = $fn.doc(_opt),
					_options = _doc.options;
				var _dispMailboxInfo = function (data) {
					_$$.mail.mng.dispMailboxInfo(_doc, data);
				};
				var _dispMailFolderInfo = function (data) {
					_$$.mail.mng.dispMailFolderInfo(_doc, data);
					_doc.options.isedit = false;
				};

				$fn.cmdPost($fn.getProxyUrl(_mailpath + "/wcmdpost?createdocument"), { actiontype: "mailboxinfo" }, _dispMailboxInfo, "json"); //기본 메일함 정보
				$fn.cmdPost($fn.getProxyUrl(_mailpath + "/wcmdpost?createdocument"), { actiontype: "mailfolderinfo" }, _dispMailFolderInfo, "json"); //개인이 추가한 폴더 정보

				$("span[name=btn_folder_add]", _doc.element)
					.off("click")
					.on("click", function () {
						/* 영구보관한 추가버튼 이벤트 추가 */ _$$.mail.mng.createFolder(_doc);
					});

				$("input[name=FolderName]", _doc.element)
					.off("keydown")
					.on("keydown", (e) => {
						if (e.keyCode == 13 || e.keyCode == 13) {
							/* 영구보관한 추가버튼 이벤트 추가 */ _$$.mail.mng.createFolder(_doc);
						}
					});
			},

			/* _$$.mail.mng.dispMailboxInfo  >>  메일함 관리화면 열릴 때 서버에서 가져온 메일함 정보로 화면을 표시 */
			dispMailboxInfo: function (_doc, data) {
				var rtn = "",
					odata = null,
					chk = false,
					divmailbox = $("div[name=UserMailBoxInfo]", _doc.element);
				if (data.hasOwnProperty("result")) {
					if (data.result >= "200" && data.result < "300") {
						if (data.hasOwnProperty("defaultbox")) {
							$.each(data["defaultbox"], function (i, o) {
								odata = data[o];
								rtn += '<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.title." + odata[0]) + "</div>";
								rtn += '<div class="dwp-value dwp-center">' + _$$.mail.com.filesize(odata[1]) + "</div>";
								rtn += '<div class="dwp-value dwp-center">' + odata[2] + "</div>"; //+ $fn.getCodeMsg("mail.msg.err02")
								rtn += '<div class="dwp-value dwp-center"><div class="dwp-btn"><span type="button" data="' + o + '" ';
								rtn += 'fname="' + $fn.getCodeMsg("mail.title." + odata[0]) + '">';
								rtn += $fn.getCodeMsg("mail.btn.empty") + "</span></div></div>";
								rtn += "</div>";
								chk = true;
							});
						}
					}
				}
				if (chk == false) {
					rtn = '<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err01") + "</div></div>"; //사용자 메일박스 정보를 확인할 수 없습니다
				}
				divmailbox.html(rtn);
				if (chk == true) {
					$("span[type=button]", divmailbox)
						.off("click")
						.on("click", function () {
							/*기본메일함 각각 보기의 [비우기] 버튼 (받은메일함, 메일발신함, 임시보관함, 스팸메일함, 메일폐기함)*/ var _this = this;
							$fn.confirm({ msg: "[" + $(_this).attr("fname") + "] " + $fn.getCodeMsg("mail.msg.confirm01") }).done(function () {
								_$$.mail.mng.removeViewAllDoc($(_this).attr("data"), _doc);
							});
						});
				}
			},

			/* _$$.mail.mng.dispMailFolderInfo  >>  메일함 관리화면 열릴 때 서버에서 가져온 메일함 폴더.. 정보로 화면을 표시 */
			dispMailFolderInfo: function (_doc, data) {
				var rtn = "",
					odata = null,
					chk = false,
					divmailbox = $("div[name=UserMailFolderInfo]", _doc.element),
					_sel = $("select[name=CurrentFolders]", _doc.element);
				if (data.hasOwnProperty("result")) {
					if (data.result >= "200" && data.result < "300") {
						if (data.hasOwnProperty("folderisnothing")) {
							divmailbox.html('<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err03") + "</div></div>");
							return;
						}
						if (data.hasOwnProperty("userfolder")) {
							$.each(data["userfolder"], function (i, o) {
								odata = data[o];
								rtn += '<div class="dwp-row"><div class="dwp-value" style="width:35%;">' + odata[0] + "</div>";
								rtn += '<div class="dwp-value dwp-center" style="width:10%;">' + _$$.mail.com.filesize(odata[1]) + "</div>";
								rtn += '<div class="dwp-value dwp-center" style="width:10%;">' + odata[2] + "</div>"; //$fn.getCodeMsg("mail.msg.err02")
								rtn += '<div class="dwp-value dwp-center" style="width:45%;"><div class="dwp-btn">';
								rtn += '<span type="button" act="localbackup" funid="' + o + '" data="' + odata[0] + '" fname="' + odata[0] + '">' + $fn.getCodeMsg("mail.btn.localbackup") + "</span> ";
								rtn += '<span type="button" act="empty" funid="' + o + '" data="' + odata[0] + '" fname="' + odata[0] + '">' + $fn.getCodeMsg("mail.btn.empty") + "</span> ";
								rtn += '<span type="button" act="edit" funid="' + o + '" data="' + odata[0] + '" fname="' + odata[0] + '">' + $fn.getCodeMsg("mail.btn.edit2") + "</span> ";

								//폴더 이동  - 2017.10.30 by dwlee
								rtn += '<span type="button" act="move" funid="' + o + '" data="' + odata[0] + '" fname="' + odata[0] + '">' + $fn.getCodeMsg("mail.btn.movefolder") + "</span> ";

								rtn += '<span type="button" act="del" funid="' + o + '" data="' + odata[0] + '" fname="' + odata[0] + '">' + $fn.getCodeMsg("mail.btn.deldoc") + "</span>";
								rtn += "</div></div></div>";
								$('<option value="' + odata[0] + '">' + odata[0] + "</option>").appendTo(_sel);
								chk = true;
							});
						}
					}
				}
				if (chk == false) {
					rtn = '<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err01") + "</div></div>"; //사용자 메일박스 정보를 확인할 수 없습니다
				}
				divmailbox.html(rtn);
				if (chk == true) {
					$("span[act=localbackup]", divmailbox)
						.off("click")
						.on("click", function () {
							_$$.mail.com.MailStore({ type: "F", cdb: _doc.options.cdb, funid: $(this).attr("funid") });
						});
					$("span[act=empty]", divmailbox)
						.off("click")
						.on("click", function () {
							var _this = this;
							$fn.confirm({ msg: "[" + $(_this).attr("fname") + "] " + $fn.getCodeMsg("mail.msg.confirm01") }).done(function () {
								//모든 메일을 삭제 하시겠습니까?
								_$$.mail.mng.removeViewAllDoc($(_this).attr("data"), _doc);
							});
						});
					$("span[act=edit]", divmailbox)
						.off("click")
						.on("click", function () {
							//폴더명 변경
							_$$.mail.mng.editFolder(_doc, $(this).attr("data"), _doc);
						});

					//폴더이동 - 2017.10.28 by dwlee
					$("span[act=move]", divmailbox)
						.off("click")
						.on("click", function () {
							//폴더명 변경
							_$$.mail.mng.moveFolder(_doc, $(this).attr("data"), _doc);
						});

					$("span[act=del]", divmailbox)
						.off("click")
						.on("click", function () {
							var _this = this;
							$fn.confirm({ msg: "[" + $(_this).attr("fname") + "] " + $fn.getCodeMsg("mail.msg.confirm03") }).done(function () {
								//폴더와 폴더의 모든 메일이 삭제 됩니다. 계속 하시겠습니까?
								_$$.mail.mng.removeFolder($(_this).attr("data"), _doc);
							});
						});
				}
			},

			//현재 폴더 위치 이동하기 - 2017.10.30 by dwlee
			/* _$$.mail.mng.moveFolder  >>  메일함관리 > 영구보관함 폴더 [수정] 버튼 (현재 폴더 이동하기) */
			moveFolder: function (_doc, view) {
				var _me = this,
					_options = _doc.options,
					_el = _doc.element,
					mikExp = /[$\\@\#%\^\&\*\(\)\[\]\+\{\}\'\~\=\|\"\`\>\/\≫]/;

				//&는 특수 문자로 치환 - 2017.11.06 by dwlee
				view = view.replace(/&/gi, "¶");

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							var _curFolderName = $.trim($("input[name=oldFolderName]", obj.element).xval());
							var _newFolderName = $.trim($("input[name=newFolderName]", obj.element).xval());
							if (_curFolderName == _newFolderName) {
								console.log("자가 자신으로는 움질일 수 없다.");
								return;
							} else if (_newFolderName.indexOf(_curFolderName) == 0) {
								console.log("자신의 하위로는 움질일 수 없다.");
								return;
							} else {
								console.log("오우케이");
							}

							//2017.11.06 by dwlee
							if (_newFolderName == "") {
								return;
							}
							var callback = function (_obj, data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										if (data.hasOwnProperty("cnt")) {
											obj.close();
											_$$.mail.mng.refresh(_doc);
											$fn.lnbPageRefresh({ lnbids: [_$$.mail.com.CONST.FOLDER] });
											//좌측 카운트 업데이트 - 2017.10.27 by dwlee
											_$$.mail.com.update_left_count();
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return;
										}
									}
								}
							};
							//현재 폴더명, 상위 폴더명, 이동하는 폴더의 이름
							_$$.mail.com.cmdpost({ actiontype: "changefolder", Arg1: _curFolderName, Arg2: _newFolderName }, callback);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(_el, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.movemail"),
					width: 500,
					height: 350,
					show: "fade", //effect
					hide: "fade", //effect
					movefolder: view,
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _buttons,
					content: { url: _options.cdb + "/wFrmSelFolder?ReadForm&movefolder=" + view, data: {} }
				});
			},

			/* _$$.mail.mng.editFolder  >>  메일함관리 > 영구보관함 폴더 [수정] 버튼 (현재 폴더명 변경하기) */
			editFolder: function (_doc, view) {
				//var _me = this, _options = _doc.options, _el = _doc.element, mikExp = /[$\\@\#%\^\&\*\(\)\[\]\+\{\}\'\~\=\|\"\`\>\/\≫]/;

				//SH Global은 특수문자인  "&" 와 ">" 를 허용 - 2017.11.03 by dwlee
				var _me = this,
					_options = _doc.options,
					_el = _doc.element,
					mikExp = /[$\\@\#%\^\*\(\)\[\]\+\{\}\'\~\=\|\"\`\/\≫]/;

				//&는 특수 문자로 치환 - 2017.11.06 by dwlee
				view = view.replace(/&/gi, "¶");

				//IMAP 설정시 생기는 폴더들 - 2017.11.03 by dwlee
				var _exceptFolder = ["보낸 편지함", "지운 편지함", "정크 메일", "Drafts", "Inbox", "Sent"];

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							var _sel = $("select[name=CurrentFolders]", obj.element).xval(),
								_newFolderName = "";
							if (_sel == "root" || _sel == "") {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
								return;
							}
							_newFolderName = $.trim($("input[name=newFolderName]", obj.element).xval());
							if (_newFolderName == "") {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err04") });
								return; //생성할 영구보관함명을 입력하세요
							}
							if (_newFolderName.length > 20) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err26") });
								return; //폴더명은 20자 이하로 입력하십시요
							}
							if (_newFolderName.search(mikExp) != -1) {
								//영구보관함명에 다음문자가 포함되어 있습니다. + "\n\r\n\r@ $ % ^ & * # ( ) [ ] \\ { + } ` ~ =  | > / ≫ \n\r\n\r"
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err06") + "<br><br>[ $  @ # % ^ * ( ) [ ] + { } ' ~ = | \" ` / ≫ ]<br><br>" });
								return;

								//IMAP 설정시 생기는 폴더들 제외 - 2017.11.03 by dwlee
							} else if ($.inArray(_newFolderName, _exceptFolder) > -1) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err08") });
								return;
							}

							var callback = function (_obj, data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										if (data.hasOwnProperty("cnt")) {
											obj.close();
											_$$.mail.mng.refresh(_doc);
											$fn.lnbPageRefresh({ lnbids: [_$$.mail.com.CONST.FOLDER] });

											//좌측 카운트 업데이트 - 2017.10.27 by dwlee
											_$$.mail.com.update_left_count();
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return;
										}
									}
								}
							};
							_$$.mail.com.cmdpost({ actiontype: "editfolder", Arg1: _sel, Arg2: _newFolderName }, callback);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(_el, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.folderedit"),
					width: 500,
					height: 350,
					show: "fade", //effect
					hide: "fade", //effect
					editfolder: view,
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _buttons,
					content: { url: _options.cdb + "/wFrmSelFolder?ReadForm&editfolder=" + view, data: {} }
				});
			},

			/* _$$.mail.mng.removeFolder  >>  메일함관리 > 영구보관함 폴더 [삭제] 버튼 */
			removeFolder: function (view, _doc) {
				var callback = function (postdata, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.hasOwnProperty("cnt")) {
								var altmsg = "[ " + data.cnt + " ]" + $fn.getCodeMsg("mail.msg.alt12");
								$fn.alert({ msg: altmsg }); //[ xx ] 개의 보관함을 삭제하였습니다
								_$$.mail.mng.refresh(_doc);
								$fn.lnbPageRefresh({ lnbids: [_$$.mail.com.CONST.FOLDER] });

								$fn.lnbCountRefresh();

								//좌측 카운트 업데이트 - 2017.10.27 by dwlee
								_$$.mail.com.update_left_count();
								return;
							}
						}
					}
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") }); //작업을 완료 할 수 없습니다
				};
				var _pdata = {
					WQS_Agent: "wAgtCmdProcess",
					actiontype: "removefolder",
					Arg1: view
				};
				_$$.mail.com.cmdpost(_pdata, callback);
			},

			/* _$$.mail.mng.removeViewAllDoc  >>  메일함관리 > 기본메일함 > 비우기 버튼 */
			removeViewAllDoc: function (view, _doc) {
				var callback = function (postdata, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.hasOwnProperty("deleteinfo")) {
								_$$.mail.mng.refresh(_doc);
								$fn.lnbCountRefresh();
								return;
							}
						}
					}
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") }); //작업을 완료 할 수 없습니다
				};
				var _pdata = {
					WQS_Agent: "wAgtCmdProcess",
					actiontype: "viewremovealldoc",
					Arg1: view
				};
				_$$.mail.com.cmdpost(_pdata, callback);
			},

			/* _$$.msil.mng.refresh  >>  현재 화면 새로고침  */
			refresh: function (doc_view) {
				//var _instance = $fn.getInstance("doc", $fn.getContent()).element.doc("instance"), _options = _instance.options;
				var _instance = $fn.getInstance("doc").element.doc("instance"),
					_options = _instance.options;
				if (_options.pathinfo) {
					$dwp.core.util.loadPage({ link: _options.pathinfo, linktype: "PAGE" });
				}
			},

			/* _$$.mail.mng.createFolder  >>  폴더 생성 버튼 클릭  */
			createFolder: function (doc) {
				var SelFolderName = "",
					_mailpath = $fn.getPath("mail");
				var sFolderName = $.trim($("input[name=FolderName]", doc.element).xval());

				//var mikExp = /[$\\@\#%\^\&\*\(\)\[\]\+\{\}\'\~\=\|\"\`\>\/\≫]/;
				//SH Global은 특수문자인  "&" 와 ">" 를 허용 - 2017.11.03 by dwlee
				var mikExp = /[$\\@\#%\^\*\(\)\[\]\+\{\}\'\~\=\|\"\`\/\≫]/;

				//IMAP 설정시 생기는 폴더들 - 2017.11.03 by dwlee
				var _exceptFolder = ["보낸 편지함", "지운 편지함", "정크 메일", "Drafts", "Inbox", "Sent"];

				// SelFolderName = $("select[name=CurrentFolders]", doc.element).xval(); //예) 가가가≫나나나
				// => 왼쪽 트리에서 상위메일함 선택하도록 변경함...by noh at 24.05.03
				var _selNode = $("#tree", doc.element).dynatree("getActiveNode");
				if (_selNode) {
					//null이 아니면..
					/*
						by leeys 20250115
						SelFolderName = _selNode.data.fullinfo._name.replace(/\\/gi, "≫");
					
					*/

					if (typeof (_selNode.data.fullinfo) != "undefined") {
						SelFolderName = _selNode.data.fullinfo._name.replace(/\\/gi, "≫");
					} else {
						SelFolderName = _selNode.data.fullname.replace(/\\/gi, "≫");
					}


					//					SelFolderName = _selNode.data.fullinfo._name.replace(/\\/gi, "≫");
					SelFolderName = SelFolderName == "root" ? "" : SelFolderName;
				}

				//폴더생성시 폴더명 중복검사
				var _DupFolderName = function (sFolderName) {
					var options = $("select[name=CurrentFolders] option", doc.element),
						chk = false;
					$.each(options, function (i, o) {
						if ($(o).xval() == sFolderName) chk = true;
					});
					return chk;
				};
				//폴더생성시 시스템폴더체크
				var _IsSystemFolder = function (sFolderName) {
					var chk = false,
						_sys = "^^($Alarms)^$Alarms^($Inbox-Categorized1)^($Inbox)^($JunkMail)^JunkMail^($MAPIUseContacts)^($Trash)^(Drafts)^";
					_sys += "^IMAPDrafts^(Group Calendars)^Group Calendars^(GroupCalendarFolder)^(Rules)^Rules^(Sent)^IMAPSent^";
					if (_sys.toUpperCase().indexOf("^" + sFolderName.toUpperCase() + "^") != -1) chk = true;
					return chk;
				};
				//폴더생성 결과
				var _addFolder = function (post, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.hasOwnProperty("addfolder")) {
								var _foldertree$ = $("#tree_" + _$$.mail.com.CONST.FOLDER);
								// 2020-06-12 BY LHJ 자식노드 모두 그리기
								var _$tree = _foldertree$.xtree("instance");

								//2020.09.18 by dwlee
								$fn.lnbPageRefresh({ lnbids: [_$$.mail.com.CONST.FOLDER] });

								//폴더 추가시에는 카운터 업데이트 필요 없음 - 2020.09.18 by dwlee
								//_$$.mail.com.update_left_count();

								//doc 에서 호출하는 경우와 좌측LNB에서 호출하는 경우때문에 수정 - 2020.08.06
								if ($("[name='UserMailFolderInfo']", doc.element).size() > 0) {
									_$$.mail.mng.refresh(doc);
								} else {
									//2020.12.18 by dwlee
									$("input[name='FolderName']", doc).xval("");
									console.log("doc : ", doc);

									doc.close();
								}

								//console.log("after - lnbPageRefresh");

								return;
							}
						}
					}
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") }); //작업을 완료 할 수 없습니다
				};

				if (sFolderName == "") {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err04") }); //생성할 영구보관함명을 입력하세요
					return false;
				} else if (sFolderName.length > 20) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err26") }); //폴더명은 20자 이하로 입력하십시요
					return false;
				} else if (sFolderName.search(mikExp) != -1) {
					//영구보관함명에 다음문자가 포함되어 있습니다. + "\n\r\n\r@ $ % ^ & * # ( ) [ ] \\ { + } ` ~ =  | > / ≫ \n\r\n\r"
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err06") + "<br><br>[ $  @ # % ^ * ( ) [ ] + { } ' ~ = | \" ` / ≫ ]<br><br>" });
					return false;
				} else if (_DupFolderName(sFolderName)) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err07") }); //존재하는 영구보관함명 입니다
					return false;

					//IMAP 설정시 생기는 폴더들 제외 - 2017.11.03 by dwlee
				} else if ($.inArray(sFolderName, _exceptFolder) > -1) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err08") });
					return;
				} else if (_IsSystemFolder(sFolderName)) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err08") }); //영구보관함명이 시스템폴더명과 중복됩니다.(사용불가:JunkMail,Rules)
					return false;
				} else {
					sFolderName = SelFolderName == "" ? sFolderName : SelFolderName + "≫" + sFolderName; //예) 가가가≫나나나≫추가한폴더
					_$$.mail.com.cmdpost({ actiontype: "addfolder", arg1: sFolderName }, _addFolder);
				}
			},

			/* _$$.mail.mng.newFolder >>  LNB에서 폴더생성 이미지 클릭시 */
			//2020.08.06 added by dwlee
			newFolder: function () {
				//var _me = this, _opt = $.extend({}, opt), _mailpath = $fn.getPath("mail"), __doc = $("#"+opt.did), _inst = __doc.xdialog("instance"), _options = _inst.options, curfolder = "";
				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							_$$.mail.mng.createFolder(obj);
							//obj.close();
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog($(this), {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.createbox"),
					width: 500,
					height: 700,
					show: "fade", //effect
					hide: "fade", //effect
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _buttons,
					content: { url: $fn.getPath("mail") + "/wFrmSelFolderTree?ReadForm", data: { mode: "create" } },
					initcallback: function (_$dialog) {
						var _$el = _$dialog.element;
						var _$diag = $("div.dwp-mail-move-dialog", _$dialog.element);

						var _dispMailFolderInfo = function (data) {
							var rtn = "",
								odata = null,
								chk = false,
								_sel = $("select[name=CurrentFolders]", _$diag),
								_errmsg = $("div.errmsg", _$diag);

							_sel.attr("id", "CurrentFolders");

							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									if (data.hasOwnProperty("folderisnothing")) {
										_errmsg.html('<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err03") + "</div></div>");
										return;
									}
									if (data.hasOwnProperty("userfolder")) {
										$.each(data["userfolder"], function (i, o) {
											odata = data[o];
											//$("<option value=\"" + odata[0] + "\" unid=\""+o+"\" >" + odata[0] + "</option>").appendTo(_sel);

											$('<option value="' + odata[0] + '" unid="' + o + '" lnbid="' + odata[3] + '">' + odata[0] + "</option>").appendTo(_sel);
											chk = true;
										});

										_sel.on("change", function () {
											var _selid = $("#CurrentFolders option:selected").attr("lnbid");
											if (typeof _selid == "undefined") {
												_selid = "_root";
											}
											var _nodes = $("#tree").dynatree("getSelectedNodes");
											if (_nodes.length > 0) {
												$.each(_nodes, function (j, node) {
													node.select(false);
												});
											}
											$("#tree").dynatree("getTree").getNodeByKey(_selid).select();
										});
									}
								}
							}

							if (chk == false) {
								rtn = '<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err01") + "</div></div>"; //사용자 메일박스 정보를 확인할 수 없습니다
								_errmsg.html(rtn);
							}
						};
						$fn.cmdPost($fn.getProxyUrl($fn.getPath("mail") + "/wcmdpost?createdocument"), { actiontype: "mailfolderinfo" }, _dispMailFolderInfo, "json"); //개인이 추가한 폴더 정보
					}
				});
			},

			/* _$$.mail.mng.dispFolder  >>  메일 보기에서 [영구보관] 버튼을 클릭 할 때 */
			dispFolder: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_mailpath = $fn.getPath("mail"),
					__doc = $("#" + opt.did),
					_inst = __doc.xdialog("instance"),
					_options = _inst.options,
					curfolder = "";
				if (_options.hasOwnProperty("editfolder")) {
					curfolder = _options.editfolder;
				}
				var _dispMailFolderInfo = function (data) {
					var rtn = "",
						odata = null,
						chk = false,
						_sel = $("select[name=CurrentFolders]", __doc),
						_errmsg = $("div.errmsg", __doc);
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.hasOwnProperty("folderisnothing")) {
								_errmsg.html('<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err03") + "</div></div>");
								return;
							}
							if (data.hasOwnProperty("userfolder")) {
								$.each(data["userfolder"], function (i, o) {
									odata = data[o];
									$('<option value="' + odata[0] + '" unid="' + o + '" ' + (curfolder == odata[0] ? " selected" : "") + ">" + odata[0] + "</option>").appendTo(_sel);
									chk = true;
								});
								if (curfolder != "") {
									//메일함관리 > 폴더 수정 화면일 경우 폴더리스트 select box 변경할 때 폴더명을 하단에 표시
									_sel.off("change").on("change", function () {
										$("input[name=newFolderName]", __doc).xval("");
										$(".parentName", __doc).html("");
										var prename = _sel.xval(),
											leftname = prename.substr(0, prename.lastIndexOf("≫")),
											_arr = prename.split("≫"),
											_parent = "";
										if (prename == "root") return;
										_parent = leftname != "" ? '<div style="margin-left:10px;">' + leftname + (leftname != "" ? "≫" : "") + "</div>" : "";
										$("input[name='newFolderName']", __doc).xval(_arr[_arr.length - 1]);
										$(".parentName", __doc).html(_parent);
									});
								} else if (_opt.ismovefolder == "1") {
									_sel.off("change").on("change", function () {
										var _parent = _sel.xval();
										var _foldername = $("input[name='FolderName']", __doc).xval();
										var _orgfoldername = $("input[name='oldFolderName']", __doc).xval();
										if (_parent == "root") {
											$("input[name='newFolderName']", __doc).xval(_foldername);
										} else {
											console.log(_parent + "::::" + _orgfoldername);

											if (_parent == _orgfoldername) {
												_sel.xval("");
												$("input[name='newFolderName']", __doc).xval("");
												//자기가 속한 하위 폴더
											} else if (_parent.indexOf(_orgfoldername) == 0) {
												_sel.xval("");
												$("input[name='newFolderName']", __doc).xval("");
											} else {
												$("input[name='newFolderName']", __doc).xval(_parent + "≫" + _foldername);
											}
										}
										//폴더 이동 - 2017.10.31 by dwlee
										//$("input[name='newFolderName']", __doc).xval(_sel.xval());
									});
								}
							}
						}
					}
					if (chk == false) {
						rtn = '<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err01") + "</div></div>"; //사용자 메일박스 정보를 확인할 수 없습니다
						_errmsg.html(rtn);
					}
				};
				$fn.cmdPost($fn.getProxyUrl(_mailpath + "/wcmdpost?createdocument"), { actiontype: "mailfolderinfo" }, _dispMailFolderInfo, "json"); //개인이 추가한 폴더 정보
			},

			/* _$$.mail.mng.init_disp_rule  >>  메일 보기에서 선택문서 스팸 및 규칙등록 기능과 좌측메뉴 도구>Rule설정 메뉴의 규칙 작성 및 편집 Dialog 화면이 열릴 때 */
			init_disp_rule: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_mailpath = $fn.getPath("mail"),
					__doc = $("#" + opt.did),
					_inst = __doc.xdialog("instance"),
					_options = _inst.options,
					_senddata = $.extend({}, _options.send_data),
					chk = false,
					_errmsg = $("div.errmsg", __doc),
					_selmailinfo = _senddata.hasOwnProperty("selmailinfo") ? _senddata.selmailinfo : "";
				var _selinfo = (_selmailinfo + "^§^^§^").split("^§^");

				//console.log(_selmailinfo);
				//return;

				$("input[type=radio][name=condition2]", __doc)
					.off("click")
					.on("click", function () {
						//메일주소, 사용자선택 2차 옵션 설정
						if ($(this).xval() == "mailaddress") {
							$("[name=org1]", __doc).addClass("dwp-hidden");
							$(".dwp-findtext", __doc).removeClass("dwp-hidden");
						} else {
							$("[name=org1]", __doc).removeClass("dwp-hidden");
							$(".dwp-findtext", __doc).addClass("dwp-hidden");
						}
						$("input[name=findtext]", __doc).xval("");
						$("input[name=Users]", __doc).xval("");
						$("input[name=UsersFull]", __doc).xval("");
						$("[name=org1] > .namepicker-list", __doc).html("");
					});

				$("input[type=radio][name=condition]", __doc)
					.off("click")
					.on("click", function () {
						//조건설정 (발신자명/주소, 제목) 선택
						if ($(this).xval() == "Sender") {
							$(".dwp-Sender-opt", __doc).removeClass("dwp-hidden");
							if (_selmailinfo != "") {
								if (_selinfo[1] == "") {
									$("input[type=radio][name=condition2][value=mailaddress]", __doc).click();
									$("input[name=findtext]", __doc).xval(_selinfo[0]);
								} else {
									$("input[type=radio][name=condition2][value=usersearch]", __doc).click();
									$("input[name=findtext]", __doc).xval("");
									$("input[name=Users]", __doc).xval(_selinfo[0]);
									$("input[name=UsersFull]", __doc).xval(_selinfo[1]);
									$fn.orgsel($("[name='org1']", __doc), { isedit: true, treetype: "0", seltype: "2", isseltype: false, fld: "Users", count: 1 }); //2차 옵션의 사용자선택 Org 컨트롤 설정하기
								}
							}
						} else {
							$(".dwp-Sender-opt", __doc).addClass("dwp-hidden");
							if (_selmailinfo != "") {
								$("input[name=findtext]", __doc).xval(_selinfo[2]);
								$(".dwp-findtext", __doc).removeClass("dwp-hidden");
								$("[name=org1]", __doc).addClass("dwp-hidden");
							}
						}
					});

				if (_selmailinfo != "") {
					/*메일 리스트 및 메일 조회 화면에서 규칙설정 진행할 경우 해당메일의 발신인/제목 정보를 화면에 표시*/
					$("#condition_sender", __doc).click();
					$(".dwp-Sender-opt", __doc).removeClass("dwp-hidden");
					if (_selinfo[1] == "") {
						$("input[type=radio][name=condition2][value=mailaddress]", __doc)[0].click();
						$("[name=org1]", __doc).addClass("dwp-hidden");
						$(".dwp-findtext", __doc).removeClass("dwp-hidden");
						$("input[name=findtext]", __doc).xval(_selinfo[0]);
					} else {
						$("input[type=radio][name=condition2][value=usersearch]", __doc).click();
						$("[name=org1]", __doc).removeClass("dwp-hidden");
						$(".dwp-findtext", __doc).addClass("dwp-hidden");
						$("input[name=Users]", __doc).xval(_selinfo[0]);
						$("input[name=UsersFull]", __doc).xval(_selinfo[1]);
					}
				}

				var _subject = $fn.getCodeMsg("mail.title.subject"),
					_sender = $fn.getCodeMsg("mail.title.sendname"),
					_movetofolder = $fn.getCodeMsg("mail.title.movetofolder"),
					_mailaddress = $fn.getCodeMsg("mail.title.mailaddress"),
					_inusers = $fn.getCodeMsg("mail.title.inusers"),
					_eqal = $fn.getCodeMsg("mail.title.equal"),
					_contains = $fn.getCodeMsg("mail.title.contains");
				//규칙의 중간에 있는 버튼 클릭시 수행되는 함수 - 2017.09.04 by dwlee
				$(".dwp-rule-add", __doc)
					.off("click")
					.on("click", function () {
						(_condition = $("input[name=condition]", __doc).xval()) /*조건설정 (발신자명/주소, 제목)*/, (_andor = $("select[name=andor]", __doc).xval()), (_rule = $("select[name=rule]", __doc).xval()) /*다음을 포함 (1), 다음과 같음 (2)*/, (_condition2 = $("input[name=condition2]", __doc).xval()) /*조건설정 (메일주소, 사용자선택)*/, (_findtext = $("input[name=findtext]", __doc).xval()) /*검색 문자열*/, (_users = $("input[name=Users]", __doc).xval()) /*사용자 NotesID*/, (_usersfull = $("input[name=UsersFull]", __doc).xval()); /*사용자 Org Data*/

						if (_condition == "") {
							$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
							return;
						}
						if (_rule == "") {
							$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
							return;
						}
						if (_condition == "Sender") {
							if (_condition2 == "usersearch") {
								//사용자선택 (검색)
								if (_users == "") {
									$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
									return;
								}
								if (_usersfull == "") {
									$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
									return;
								}
							} else if (_condition2 == "mailaddress") {
								//메일주소
								if (_findtext == "") {
									$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
									return;
								}
							} else {
								//조건선택 2차 값이 공백이다
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
						}
						if (_condition == "Subject") {
							//제목으로 검색한다
							if (_findtext == "") {
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
						}

						if (_users == "") {
							var _$list = $(".dwp-rule-list", __doc);
							var _$node = $("<div class='dwp-rule-cell'></div>");
							_$node.css({ "top-margin": "10px", height: "30px" });

							var _info = "";
							if ($(".dwp-rule-cell", __doc).size() != 0) {
								if (_andor == "1") {
									_info = $fn.getCodeMsg("mail.title.and") + " ";
								} else if (_andor == "2") {
									_info = $fn.getCodeMsg("mail.title.or") + " ";
								}
							} else {
								_andor = "";
							}

							_opt = {
								condition: _condition, //조   건 : 제목 혹은 발신자
								andor: _andor, //연산자 : 다중 조건일 경우 AND 혹은 OR
								rule: _rule, //비교문 : 포함(1), 같음(2)
								findtext: _findtext, //검색 문자열
								condition2: _condition2, //조건설정 : 메일주소,사용자 선택
								users: _users, //사용자 NotesID
								usersfull: _usersfull //사용자 OrgData
							};

							_$node.data("opt", _opt);

							var _$cell = $("<div></div>");
							_$cell.css({ border: "0px solid darkgray", height: "30px", width: "400px", "text-decoration": "underline" });

							if (_condition == "Subject") {
								//제목에서 검색
								_info += _subject + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _findtext.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
							} else {
								if (_condition2 == "mailaddress") {
									//외부메일
									_info += _mailaddress + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _findtext.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
								} else {
									//내부 NotesID
									_info += _inusers + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _users.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
								}
							}
							_$cell.append(_info);

							_$delbtn = $("<div></div>");
							_$delbtn.css({ "right-margin": "10px", float: "right" });
							_$delbtn.off("click").on("click", function () {
								var _$this = $(this);
								var _$node = _$this.parent().parent();
								_$node.remove();
								if ($(".dwp-rule-cell", __doc).size() == 0) {
									$("select[name=andor]", __doc).xval("");

									//2024.10.07
									//$(".dwp-andor", __doc).addClass("dwp-hidden");
									$(".dwp-andor", __doc).addClass("dwp-none");
								}
							});
							_$delbtn.append("<img style='border:1px solid darkgray' src='" + $fn.getPath("weblib") + "/images/common/btn-cancel.svg' width=12 height=12>");
							_$cell.append(_$delbtn);

							_$node.append(_$cell);
							_$list.append(_$node);

							//필드 리셋
							//$("input[name=condition]", __doc).xval("");
							//$("input[name=condition2]", __doc).xval("");
						} else {
							var _idArray = _users.split(";");
							var _idfullArray = _usersfull.split(";");
							$.each(_idArray, function (index, uid) {
								var _$list = $(".dwp-rule-list", __doc);
								var _$node = $("<div class='dwp-rule-cell'></div>");
								_$node.css({ "top-margin": "10px", height: "30px" });

								var _info = "";
								if ($(".dwp-rule-cell", __doc).size() != 0) {
									if (index > 0) {
										_andor == "2";
										_info = $fn.getCodeMsg("mail.title.or") + " ";
									} else {
										if (_andor == "1") {
											_info = $fn.getCodeMsg("mail.title.and") + " ";
										} else if (_andor == "2") {
											_info = $fn.getCodeMsg("mail.title.or") + " ";
										}
									}
								} else {
									_andor = "";
								}
								_opt = {
									condition: _condition, //조   건 : 제목 혹은 발신자
									andor: _andor, //연산자 : 다중 조건일 경우 AND 혹은 OR
									rule: _rule, //비교문 : 포함(1), 같음(2)
									findtext: _findtext, //검색 문자열
									condition2: _condition2, //조건설정 : 메일주소,사용자 선택
									users: uid, //사용자 NotesID
									usersfull: _idfullArray[index] //사용자 OrgData
								};

								var org = new $fn.orgData(_idfullArray[index]); //빼내서 쓸때는 이렇게 가져갑시다...
								var _dspVal = "";
								if (org.oinfo.type == "B") {
									_dspVal = $fn.getCurLangMsg(org.oinfo.orgname);
								} else {
									_dspVal = $fn.getCurLangMsg(org.oinfo.username);
								}

								_$node.data("opt", _opt);
								var _$cell = $("<div></div>");
								_$cell.css({ border: "0px solid darkgray", height: "30px", width: "400px", "text-decoration": "underline" });

								if (_condition == "Subject") {
									//제목에서 검색
									_info += _subject + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _findtext.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
								} else {
									if (_condition2 == "mailaddress") {
										//외부메일
										_info += _mailaddress + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _findtext.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
									} else {
										//내부 NotesID
										_info += _inusers + " (" + (_rule == "1" ? _contains : _eqal) + ") : " + _dspVal;
									}
								}
								_$cell.append(_info);

								_$delbtn = $("<div></div>");
								_$delbtn.css({ "right-margin": "10px", float: "right" });
								_$delbtn.off("click").on("click", function () {
									var _$this = $(this);
									var _$node = _$this.parent().parent();
									_$node.remove();
									if ($(".dwp-rule-cell", __doc).size() == 0) {
										$("select[name=andor]", __doc).xval("");

										//2024.10.07
										//$(".dwp-andor", __doc).addClass("dwp-hidden");
										$(".dwp-andor", __doc).addClass("dwp-none");
									}
								});
								_$delbtn.append("<img style='border:1px solid darkgray' src='" + $fn.getPath("weblib") + "/images/common/btn-cancel.svg' width=12 height=12>");
								_$cell.append(_$delbtn);

								_$node.append(_$cell);
								_$list.append(_$node);
							});

							$("input[name=condition]", __doc).xval("Sender");
							$("input[name=condition2]", __doc).xval("usersearch");
							$("input[name=Users]", __doc).xval("");
							$("input[name=UsersFull]", __doc).xval("");
							$(".namepicker-list", __doc).html("");
						}

						//2017.11.05 by dwlee
						$("select[name=andor]", __doc).xval("2");

						//						$("select[name=rule]", __doc).xval("");
						$("input[name=findtext]", __doc).xval("");

						if ($(".dwp-rule-cell", __doc).size() > 0) {

							//2024.10.07
							//$(".dwp-andor", __doc).removeClass("dwp-hidden");
							$(".dwp-andor", __doc).removeClass("dwp-none");
						} else {
							//2024.10.07
							//$(".dwp-andor", __doc).addClass("dwp-hidden");
							$(".dwp-andor", __doc).addClass("dwp-none");
						}
					});

				//console.log("555555555555555555555555");

				$fn.orgsel($("[name='org1']", __doc), { isedit: true, treetype: "0", seltype: "0", isseltype: false, fld: "Users", count: 10 }); //2차 옵션의 사용자선택 Org 컨트롤 설정하기

				var _dispMailFolderInfo = function (data) {
					//console.log("77777777777777777777777777");

					var rtn = "",
						odata = null,
						_sel = $("select[name=CurrentFolders]", __doc);
					if (typeof _senddata.domain != "undefined") {
						//보기 화면에서 문서 선택 후 규칙설정 옵션화면을 열었을 때는 규칙으로 등록할 도메인 정보인 _senddata.domain 데이터가 있음..
						$("input[name=status][value=1]", __doc).attr("checked", true);
						$("input[name=condition][value=Sender]", __doc).attr("checked", true);
						$("input[name=findtext]", __doc).xval(_senddata.domain);
					}

					//console.log("8888888888888888888888888");

					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.hasOwnProperty("folderisnothing")) {
								_errmsg.html('<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err03") + "</div></div>");
								chk = true;
							} else {
								if (data.hasOwnProperty("userfolder")) {
									$.each(data["userfolder"], function (i, o) {
										odata = data[o];
										$('<option value="' + odata[0] + '" unid="' + o + '">' + odata[0] + "</option>").appendTo(_sel);
										chk = true;
									});
								}
							}
							if (_opt.editruleunid != "") {
								_me.setRuleEditInfo(_opt, __doc);
							} //규칙설정 화면에서는 폴더 리스트를 만들고, 규칙 편집 상태일 경우 기존 규칙정보를 화면에 설정해준다
							if (typeof _options.init_callback == "function") _options.init_callback(_inst); //dialog 호출한 function에서 이벤트를 추가하거나 추가 액션을 처리
						}
					}
					if (chk == false) {
						rtn = '<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err01") + "</div></div>"; //사용자 메일박스 정보를 확인할 수 없습니다
						_errmsg.html(rtn);
					}

					//console.log("99999999999999999999999999");
				};

				///console.log("6666666666666666666666666666");

				$fn.cmdPost($fn.getProxyUrl(_mailpath + "/wcmdpost?createdocument"), { actiontype: "mailfolderinfo" }, _dispMailFolderInfo, "json"); //개인이 추가한 폴더(영구보관함) 정보를 가져와 화면에 표시
			}
		},

		/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 *
		 * 				여기서부터 작성 및 편집 화면
		 *
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 */

		/* doc function */
		doc: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},

			/* _$$.mail.doc.init */
			init: function (opt) {
				var _me = this,
					/*
									20230424 conview값이 없는 경우 1 세팅
					*/
					opt = $.extend({ conview: "1", iscontextmenu: false }, opt); //2024.10.11

				_opt = _me._initOptions(opt);

				//_opt.bodyframe = false;					//외부메일 본문 iFrame 임시로 사용안함


				//함수가 selected 되었다는.... - 2024.10.08 by dwlee
				if (_opt.isedit == false) {
					//_opt.getbodycallback = $dwp.app.mail.doc.get_selected;
				}
				var _doc = $fn.doc(_opt),
					_options = _doc.options;

				if (_options.isedit) {
					//_me._teamsite(_doc,_opt);					//팀사이트 정보 표시하기 - 2017.10.31 by dwlee

					//첨부영역 숨김 - 2024.05.22 by dwlee
					$(".dwp-table-file", $("#attachments", _doc.element)).addClass("dwp-none");

					//겸직이면 발신자 정보 표시 - 2024.05.20 by dwlee
					if ($fn.getCurUser().pinfo.multiuser.length > 1) {
						$(".hidden-area1", _doc.element).removeClass("dwp-none");
					}

					_me.org.fn_orgsel("SendTo", _doc); //수신인 검색 자동완성 설정
					_me.org.fn_orgsel("CopyTo", _doc); //참조인 검색 자동완성 설정
					_me.org.fn_orgsel("BlindCopyTo", _doc); //비밀참조인 검색 자동완성 설정

					if (_options.inherit != "" && _options.inherit != "copysend") {
						//보낸메일 추가발송 형식이 아닐때만
						_me.org.setReplySendToSet(_doc); //회신, 전체회신 등으로 신규메일 작성화면이 열리면 기존 수신인을 자동으로 넣어준다.
					}
					if (_options.newtype != "") {
						if (_options.newtype.indexOf("localstorage_") != -1) {
							//개인주소록에서 선택 후 메일작성하면 LocalStorage에 수신인 정보를 설정하고, 메일 작성화면이 열린다
							var storage = _options.newtype.split("_")[1],
								_storage_val = null,
								_storagefull_val = "",
								_arrval = [],
								_nid = "",
								_nidfull = "";
							_storage_val = $dwp.core.util.getLocalStorage(storage);
							_storagefull_val = $dwp.core.util.getLocalStorage(storage + "full");

							if (_storage_val != null) {
								if (_storagefull_val == "" || _storagefull_val == null) {
									$fn.cmdPostEx({
										url: $fn.getProxyUrl(_options.cdb + "/wcmdpost?openform"),
										async: false,
										dataType: "json",
										data: { actiontype: "get_userorginfo", Arg1: _storage_val },
										success: function (data, textStatus) {
											if (data.cnt == "0") {
												_storage_val = "";
												_storagefull_val = "";
												$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg013") });
												return; //해당사용자는 없는 사용자입니다
											}

											if (data.hasOwnProperty("dataid")) {
												_storage_val = data.dataid;
											}
											if (data.hasOwnProperty("datafull")) {
												_storagefull_val = data.datafull;
											}
										}
									});
								}
								if (_storage_val == "") {
									localStorage.removeItem(storage);
									localStorage.removeItem(storage + "full");
									return;
								}
								$("textarea[name=SendTo]").xval(_storage_val);
								$("textarea[name=SendToFull]").xval(_storagefull_val);
							}
							localStorage.removeItem(storage);
							localStorage.removeItem(storage + "full");
						}
					}

					_me.org.read_show_name(_doc); //SendToFull, CopyToFull 정보들로 화면에 수신, 참조, 비밀참조 리스트를 표시
					_me.org.selectSendToSet(_doc); //수신인 지정 기능 설정 (Drag & Drop, Ctrl-X & Ctrl-V 등등 기능 설정)

					$(".btn_SendTo", _doc.element)
						.off("click")
						.on("click", function () {
							if ($("input[name=send_me]", _doc.element).is(":checked")) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt13") });
								return; //내게쓰기 형식은 추가 수신인을 지정할 수 없습니다
							}
							if (_options.mailsendtype == "group") return; //그룹발송 유형일 경우 수신인 선택 불가능
							_opt._org.addtype = "sendto";
							_opt._org["openelement"] = _doc.element;
							$dwp.ui.org.mail.init(_doc, _opt._org);
						});
					$(".btn_CopyTo", _doc.element)
						.off("click")
						.on("click", function () {
							_opt._org["openelement"] = _doc.element;
							_opt._org.addtype = "copyto";
							$dwp.ui.org.mail.init(_doc, _opt._org);
						});
					$(".btn_BlindCopyTo", _doc.element)
						.off("click")
						.on("click", function () {
							_opt._org["openelement"] = _doc.element;
							_opt._org.addtype = "blindcopyto";
							$dwp.ui.org.mail.init(_doc, _opt._org);
						});
					$("input[name=send_me]", _doc.element)
						.off("click")
						.on("click", function () {
							//내게쓰기 체크박스 컨트롤
							_me.send_me(_doc, this);
						});

					//메일 작성시 최근 수신인 표시하기 - 2023.06.23 by dwlee
					if ($(".dwp-recent_area", _doc.element).size() > 0) {
						//최근수신인 불러오기 - 2023.06.23 by dwlee
						_$$.mail.portal.getLastSendList(_options.cdb, $(".dwp-recent_list", _doc.element), "write");
						//수신확인 정보를 불러오자...
						$(".dwp-trigger", _doc.element).on("click", function (e) {
							var $apr = $(this).parent();
							$apr.toggleClass("hide");
							var $last = $(".dwp-recent_list", _doc.element);
							if ($last.hasClass("dwp-none")) {
								//펼치기;
								$last.removeClass("dwp-none");
							} else {
								//열기;
								$last.addClass("dwp-none");
							}
							e.preventDefault();
						});
					}

					if (_options.mailsendtype == "group") {
						//그룹발송 형일일때

						$(".hidden-area2", _doc.element).addClass("dwp-hidden");
						$(".dwp-btn-more", _doc.element).removeClass("active");
						$("input[name=qsearch]", _doc.element).addClass("none"); //검색어 입력 부분 숨김처리
						$(".hidden-area1 .dwp-btn", _doc.element).hide();

						//$("input[name=qsearch]", _doc.element).addClass("none");			//그룹발송 유형일 경우 검색어 입력 부분 숨김처리
					} else {
						if (_options.isnew == true && _options.parentunid == "") {
							$("input[name=qsearch]", _doc.element)[0].focus();
						}
					}

					//예약일자 오늘 이전 날짜는 선택 불가
					$("input[name=ReserveDate]", _doc.element).datepicker("option", "minDate", $("input[name=ReserveDate]", _doc.element).attr("mindate"));

					if (_options.did != "") {
						//var __dlg = null, __parent = null, __inst = null, saveopt = {}, __width = $(document).width(), __titlebar = null, __title = null, __close = null, __up = null, __down = null;
						//__dlg = $("#"+_options.did); __inst = __dlg.xdialog("instance"); __parent = __dlg.parent(); __titlebar = $(".ui-dialog-titlebar", __parent); __title = $(".ui-dialog-title", __titlebar), __close = $(".ui-dialog-titlebar-close", __titlebar);
						//$fn.block($("form", __dlg))
						//__parent.css({width : "300px", top : "5px", left : (__width/2-150)+"px"});
						//if ($("#SendProgress", __titlebar).size() == 0) {
						//	__title.html(__title.text() + "<span id=\"SendProgress\"> ... <img src=\"/hklibs/images/common/loading.gif\" style=\"width: 25px;height: 25px;\"></span>");
						//}

						var __up = null,
							__down = null,
							__close = null,
							__dlg = null,
							__titlebar = null,
							__parent = null;
						__dlg = $("#" + _options.did);
						__parent = __dlg.parent();
						__titlebar = $(".ui-dialog-titlebar", __parent);
						__close = $(".ui-dialog-titlebar-close", __titlebar);
						if ($(".dwp-mail-button-dialog-up", __titlebar).size() == 0) {
							__up = $('<button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only dwp-mail-button-dialog-up"><span class="ui-button-icon ui-icon dialog-up"></span></button>');
							__down = $('<button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only"><span class="ui-button-icon ui-icon dialog-down"></span></button>');
							__close.before(__up);
							__close.before(__down);
							__up.off("click").on("click", function () {
								_$$.mail.com.resizeMailForm(__dlg, "down");
							});
							__down.off("click").on("click", function () {
								_$$.mail.com.resizeMailForm(__dlg, "up");
							});
						}
						//__dlg.hide();
					}
					//doc

					console.log("_options.inherit::", _options.inherit);
					if ((_options.inherit = "copysend")) {
						var _tmpSubject = $("input[name=Subject]", _doc.element).xval();
						//_tmpSubject = _tmpSubject.replace(/&amp;#60;/g, "<").replace(/&amp;#62;/g,">");
						_tmpSubject = _tmpSubject.replace(/&#60;/g, "<").replace(/&#62;/g, ">");
						$("input[name=Subject]", _doc.element).xval(_tmpSubject);
					}
				} else {
					_me.org.read_show_name(_doc); //조회화면에서 수신,참조,비밀참조 화면에 표시
					if (_options.unreadcountupdate == "1") {
						//미열람 메일을 오픈하면 WebQueryOpen Agent에서 해당 필드값을 "1"값으로 변경함...
						$fn.lnbCountRefresh(); //좌측 메일 카운트 업데이트

						//GNB 읽지않은 카운트 갱신 - 2017.11.24  by dwlee
						// 2022-05-27 Layout 변경 By LHJ
						//$fn.xTrigger($("div.dwp-icon-menu"), "GnbCountRefresh", { type: "mail" });
						$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "mail" });
						// 2022-05-27 By LHJ 포틀릿 리로드
						$fn.xTrigger($("div.xware-portal-body"), "PortletRefresh", { type: "1" });

						/*
						by mjkim 팝업 미리보기에서 읽음 스타일 변경				
					*/

						if (_options.ispreview == true || _options.ispopup == true) {
							//미리보기 상태일 경우 리스트 목록의 읽지않음 표시를 읽음 상태료 스타일 변경
							_$$.mail.com.viewUnRead(_options.unid, "read");
						}
					}

					if (_doc.options.bodyframe == false) {
						var _bodyFld = $("#bodyFld", _doc.element),
							_msgdiv = $(".dwp-body-inner-image", _doc.element);
						if ($("img", _bodyFld).size() > 0 && _doc.options.hideimg == true) {
							//본문에 이미지 있을 때 알림 메시지 표시
							_msgdiv.show();
							$("button", _msgdiv)
								.off("click")
								.on("click", function () {
									_msgdiv.hide();
								});
						} else {
							$(".dwp-body-images", _doc.element).hide();
						}
					}

					_me.fromAddEvent(_doc); //발신인 정보를 클릭해서 QTDialog 생성(메일쓰기, 주소록 추가)

					/*
						연결미리보기 설정 mjkim 20230424
						환경설정 값이 1 이고 연결문서(1) 이면은 활성화
					*/

					if (_options.conview == "1" && _options.iscon == "1") {
						$dwp.app.mail.com.goConnection(_doc, "conview", { ismobile: false });

						$("#conviewall", _doc.element).on("click", function () {
							$dwp.app.mail.com.goConnection(_doc, "doc", { ismobile: false });
						});
					}

					//읽기모드인 경우 마우스로 selected한 영역의 Text를 구하는 함수 - 2024.10.08 by dwlee
					//if (_doc.options.isedit == false) {
					//	_me.get_selected(_doc.element);
					//}
				}

				//참조 타이틀 영역에 숨은참조 라인 펼치기 아이콘
				$(".dwp-btn-more", _doc.element)
					.off("click")
					.on("click", function () {
						$(this).toggleClass("active");
						if ($(this).hasClass("active")) {
							//파일첨부 more 버튼인 경우 - 2024.05.22
							if ($(this).hasClass("dwp-btn-attach")) {
								$(".dwp-table-file", $("#attachments", _doc.element)).removeClass("dwp-none");
								$(".dwp-bookmark", _doc.element).removeClass("dwp-none");
							} else {
								$(".dwp-blindcopyto", _doc.element).removeClass("dwp-hidden");
							}
						} else {
							//파일첨부 more 버튼인 경우 - 2024.05.22
							if ($(this).hasClass("dwp-btn-attach")) {
								$(".dwp-table-file", $("#attachments", _doc.element)).addClass("dwp-none");
								$(".dwp-bookmark", _doc.element).addClass("dwp-none");

							} else {
								$(".dwp-blindcopyto", _doc.element).addClass("dwp-hidden");
							}
						}
					});

				//2024.10.14
				$("#dwp-chatbot", _doc.element).off("click").on("click", function () {
					$(".css-1mtxqz6", _doc.element).addClass("dwp-none");
					//$("css-iv7wj0",_doc.element).css("visibility","visible");
					_$$.mail.doc.chatgpt_input(_doc, { type: "direct" });
				});
			},

			//팀사이트 표시 - 2017.10.31 by dwlee
			_teamsite: function (doc, opt) {
				var _doc = doc,
					_opt = opt;
				var _$teamsite = $("span.dwp-teamsite", _doc.element);
				if (_$teamsite.size() > 0 && _$teamsite.attr("key") != "") {
					var _siteinfo = _$teamsite.attr("key");
					var _infoarray = _siteinfo.split(";");
					var _namearray = [];
					$.each(_infoarray, function (index, _info) {
						var tmparray = _info.split("^");
						var _name = tmparray[2];
						_namearray.push($fn.getCurLangMsg(_name));
					});
					_$teamsite.addClass("dwp-bold").html("( " + $fn.getCodeMsg("mail.btn.teamsite") + " : " + _namearray.join(",") + ")");
				}
			},
			_initOptions: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_org = {};

				_opt._org = {
					addtype: "sendto",
					title: $fn.getCodeMsg("mail.title.selectaddress"),
					/*주소록 선택*/
					fld: ["SendTo", "CopyTo", "BlindCopyTo"],
					isedit: true,
					target: "sendto_list",
					refdata: {
						type: "mail",
						tabidx: 0,
						tab: [
							//2025.01.06 by dwlee
							//{ title: $fn.getCodeMsg("mail.title.organization"), tree: 0, button: 0, grid: 0 } /*조직도*/, //근무부서
							{ title: $fn.getCodeMsg("mail.title.workdept"), tree: 0, button: 0, grid: 0 } /*조직도*/, //근무부서

							// { title: $fn.getCodeMsg("mail.title.orgdept"), tree: 1, button: 0, grid: 0 }, //소속부서
							//{ title: "조직도(소속부서)", tree: 1, button: 0, grid: 0 }, //조직도 트리 - 2025.01.06 by dwlee //소속부서

							{ title: $fn.getCodeMsg("mail.title.namecard"), tree: 2, button: 0, grid: 0 },
							// { title: $fn.getCodeMsg("mail.title.public"), tree: 3, button: 0, grid: 0 },
							{ title: $fn.getCodeMsg("mail.title.addressbook"), tree: 4, button: 0, grid: 0 },
						],
						button: [
							[
								{
									id: "sendto",
									title: $fn.getCodeMsg("mail.title.sendto"),
									css: "btn-add receive sendto",
									click: function (_$dialog) {
										/*수신*/
										$("div.dwp-btn-area > .btn-add", _$dialog.element).removeClass("strong");
										$("div.dwp-btn-area > .sendto", _$dialog.element).addClass("strong");
										_me.org._commBtnProc(_$dialog, "sendto");
									}
								},
								{
									id: "copyto",
									title: $fn.getCodeMsg("mail.title.copyto"),
									css: "btn-add refer copyto",
									click: function (_$dialog) {
										/*참조*/
										$("div.dwp-btn-area > .btn-add", _$dialog.element).removeClass("strong");
										$("div.dwp-btn-area > .copyto", _$dialog.element).addClass("strong");
										_me.org._commBtnProc(_$dialog, "copyto");
									}
								},
								{
									id: "blindcopyto",
									title: $fn.getCodeMsg("mail.title.blindcopyto"),
									css: "btn-add blind blindcopyto",
									click: function (_$dialog) {
										/*비밀참조*/
										$("div.dwp-btn-area > .btn-add", _$dialog.element).removeClass("strong");
										$("div.dwp-btn-area > .blindcopyto", _$dialog.element).addClass("strong");
										_me.org._commBtnProc(_$dialog, "blindcopyto");
									}
								},
								{
									id: "deleteall",
									title: $fn.getCodeMsg("mail.btn.alldelete"),
									css: "btn-all-del",
									click: function (_$dialog) {
										/*모두삭제*/
										_me.org._commBtnProc(_$dialog, "deleteall");
									}
								}
							]
						],
						grid: [
							{
								type: "mail",
								title: "",
								prop: "mail",
								count: _$$.mail.com.CONST.MAXCOUNT,
								children: [
									{
										type: "mail",
										title: $fn.getCodeMsg("mail.title.sendto"),
										prop: "SendTo",
										selector: "div.dwp-list-body[name='sendto_list']",
										drop: function (event, ui, element) {
											/*수신*/
											$("div.dwp-btn-area > .btn-add", element.element).removeClass("strong");
											$("div.dwp-btn-area > .sendto", element.element).addClass("strong");
											_me.org._commBtnProc(element, "sendto", ui);
										}
									},
									{
										type: "mail",
										title: $fn.getCodeMsg("mail.title.copyto"),
										prop: "CopyTo",
										selector: "div.dwp-list-body[name='copyto_list']",
										drop: function (event, ui, element) {
											/*참조*/
											$("div.dwp-btn-area > .btn-add", element.element).removeClass("strong");
											$("div.dwp-btn-area > .copyto", element.element).addClass("strong");
											_me.org._commBtnProc(element, "copyto", ui);
										}
									},
									{
										type: "mail",
										title: $fn.getCodeMsg("mail.title.blindcopyto"),
										prop: "BlindCopyTo",
										selector: "div.dwp-list-body[name='blindcopyto_list']",
										drop: function (event, ui, element) {
											/*비밀참조*/
											$("div.dwp-btn-area > .btn-add", element.element).removeClass("strong");
											$("div.dwp-btn-area > .blindcopyto", element.element).addClass("strong");
											_me.org._commBtnProc(element, "blindcopyto", ui);
										}
									}
								]
							}
						],
						tree: [
							{
								type: "org",
								treetype: "0", // 0 : 부서 & 사용자, 1 : 부서
								seltype: "0", // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								comcode: "",
								islazy: true,
								onDblClick: function (_$dialog, dtnode) {
									var _$treewrap = $("div.dwp-tree", _$dialog.element),
										_issearch = _$treewrap.is(":hidden");
									_$$.mail.doc.org._addListItem.call(_me, _$dialog, dtnode, _issearch);
								}
							},

							//소속부서 트리용 - 2024.12.29 by dwlee
							{
								type: "org",
								treetype: "0", // 0 : 부서 & 사용자, 1 : 부서
								seltype: "0", // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								comcode: "",
								islazy: true,
								usertree: true, 				//사용자 소속부서 트리용 - 2024.12.29 by dwlee
								onDblClick: function (_$dialog, dtnode) {
									var _$treewrap = $("div.dwp-tree", _$dialog.element),
										_issearch = _$treewrap.is(":hidden");
									_$$.mail.doc.org._addListItem.call(_me, _$dialog, dtnode, _issearch);
								}
							},
							// 2024-12-21
							{
								type: "namecard",
								treetype: "0", // 0 : 부서 & 사용자, 1 : 부서
								seltype: "2", // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								islazy: true,
								onDblClick: function (_$dialog, dtnode) {
									var _$treewrap = $("div.dwp-tree", _$dialog.element),
										_issearch = _$treewrap.is(":hidden");
									_$$.mail.doc.org._addListItem.call(_me, _$dialog, dtnode, _issearch);
								}
							},
							{
								type: "cgrouporg",
								treetype: "0", // 0 : 부서 & 사용자, 1 : 부서
								seltype: "2", // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								islazy: true,
								onDblClick: function (_$dialog, dtnode) {
									var _$treewrap = $("div.dwp-tree", _$dialog.element),
										_issearch = _$treewrap.is(":hidden");
									_$$.mail.doc.org._addListItem.call(_me, _$dialog, dtnode, _issearch);
								}
							},
							{
								type: "pgrouporg",
								treetype: "0", // 0 : 부서 & 사용자, 1 : 부서
								seltype: "0", // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								islazy: true,
								onDblClick: function (_$dialog, dtnode) {
									var _$treewrap = $("div.dwp-tree", _$dialog.element),
										_issearch = _$treewrap.is(":hidden");
									_$$.mail.doc.org._addListItem.call(_me, _$dialog, dtnode, _issearch);
								}
							}
						],
						// initload : function(){ _me.org._initDataLoad(_$dialog)}
						initload: function (_$dialog) {
							_$$.mail.doc.org._initDataLoad.call(_me, _$dialog);

							/*수신인지정 dialog 오른쪽 리스트의 드래그 & 드롭*/
							$(".dragdrop", _$dialog.element)
								.sortable({
									connectWith: ".dragdrop",
									items: "> div.dwp-item",
									helper: "clone"
									/*,
													  start : function(event,ui) {
														  console.log("소터블 시작 ==============================")
														  console.log("event", event)
														  console.log("ui", ui)

														  //console.log("<<< Tree >>>", $(".dynatree-selected", _$dialog.element))
														  //$(".dynatree-selected", _$dialog.element).removeClass("dynatree-selected")
														  //$(".dynatree-active", _$dialog.element).removeClass("dynatree-active")
														  //$(".dynatree-active, .dynatree-selected", _$dialog.element).removeClass("dynatree-active dynatree-selected");
														  var _w = ui.item.width() + 60; _w = (_w > 390 ? 390 : _w);
														  $(ui.item).css("width", _w);
													  },
													  stop : function(event,ui) {
														  $(ui.item).css("width", "auto")
													  }
														   */
								})
								.disableSelection();
							$("div.dwp-btn-area > ." + _$dialog.options.addtype, _$dialog.element).addClass("strong"); //Dialog화면의 수신, 참조, 숨은참조 버튼 강조 표시
						}
					},
					buttons: [
						{
							title: $fn.getCodeMsg("mail.btn.ok"),
							/*확인*/
							click: function (_$dialog) {
								var _gridinfo = $dwp.ui.org._getGridInfo(_$dialog),
									_$gridlist = $dwp.ui.org._getGrid(_$dialog);
								if (_gridinfo.hasOwnProperty("count")) {
									if (_gridinfo.count > 0) {
										//if ( $("div.dwp-item", $(".dwp-list-body", _$gridlist_sub) ).size() >= _gridinfo.count ) {
										if ($("div.dwp-item", $(".dwp-list-body", _$gridlist)).size() > _gridinfo.count) {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err30").replace(/\{\$1\}/g, _gridinfo.count) }); //최대 [ " + _gridinfo.count + " ]명 까지 선택가능합니다.
											return true;
										}
									}
								}

								_$$.mail.doc.org.delNameListItem(_$dialog); //기존 정보 초기화
								_$$.mail.doc.org.orgSetVal(_$dialog); //선택된 수신정보를 메일 작성 화면에 설정
								_$dialog.close();
							}
						},
						{
							title: $fn.getCodeMsg("mail.btn.cancel"),
							/*취소*/
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					]
				};

				/* doc button */
				_opt.button = {
					savedoc: {
						title: $fn.getCodeMsg("mail.btn.savedoc"),
						/*저장 (메일템플릿 양식)*/
						click: function (doc) {
							_me.mailsave(doc);
						}
					},
					copymail: {
						title: $fn.getCodeMsg("mail.btn.copymail"),
						/*메일작성 (메일템플릿 양식)*/
						click: function (doc) {
							_me.replyforward(doc, { type: "copysend", body: "1", attach: "1" });
						}
					},
					send: {
						title: $fn.getCodeMsg("mail.btn.send"),
						/*발송*/
						click: function (doc) {
							_me.mailsend(doc);
						},
						css: "dwp-default"
					},
					draft: {
						title: $fn.getCodeMsg("mail.btn.tmpsave"),
						/*임시저장*/
						click: function (doc) {
							_me.mailsave(doc);
						}
					},
					editdoc: {
						title: $fn.getCodeMsg("mail.btn.edit"),
						/*편집*/
						click: function (doc) {
							doc.editDocument();
						}
					},
					select_templete: {
						title: $fn.getCodeMsg("mail.btn.templeteselect"),
						/*템플릿 선택*/
						click: function (doc) {
							//$(this) 파라미터 추가 - 2024.05.14 by dwlee
							_me.template_load(doc, $(this));
						}
					},
					save_templete: {
						title: $fn.getCodeMsg("mail.btn.templetesave"),
						/*템플릿 저장*/
						click: function (doc) {
							_me.template_save(doc);
						}
					},

					selectsignature: {
						title: $fn.getCodeMsg("mail.btn.selectsignature"),
						/*서명 선택*/
						click: function (doc) {
							//$(this) 파라미터 추가 - 2024.05.14 by dwlee
							_me.select_signature(doc, $(this));
						}
					},

					selectorg: {
						title: $fn.getCodeMsg("mail.btn.selectaddress"),
						/*주소록 선택*/
						click: function (doc) {
							if ($("input[name=send_me]", doc.element).is(":checked")) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt13") });
								return; //내게쓰기 형식은 추가 수신인을 지정할 수 없습니다
							}
							_opt._org["openelement"] = doc.element; //Dialog 화면 하단의 [확인] 버튼 클릭시 Opener의 element를 참조하기 위해서 추가
							_opt._org.addtype = "sendto";
							$dwp.ui.org.mail.init(doc, _opt._org);
						}
					},

					//발송옵션을 팝업창으로 변경 - 2024.05.20 by dwlee
					sendoption: {
						title: $fn.getCodeMsg("mail.btn.sendoption"),
						/*발송 옵션*/
						click: function (doc) {
							_me.send_options(doc, $(this));
						}
					},

					//발송옵션을 팝업창으로 변경 - 2024.05.20 by dwlee
					schedsecurity: {
						title: $fn.getCodeMsg("mail.btn.secu"),
						/*예약/보안메일 옵션*/
						click: function (doc) {
							_me.send_schedsecutiry(doc, $(this));
						}
					},

					//2024.09.24 by dwlee
					sendtome: {
						title: $fn.getCurUser().isdark ? "<img src='" + $fn.getPath("weblib") + "/images/common/icon-tome-dark.svg'>" + $fn.getCodeMsg("mail.btn.send_me") : "<img src='" + $fn.getPath("weblib") + "/images/common/icon-tome.svg'>" + $fn.getCodeMsg("mail.btn.send_me"),
						/*예약/보안메일 옵션*/
						click: function (doc) {
							//_me.send_schedsecutiry(doc,$(this));
							_$$.mail.doc.send_me(doc, this);
						},
						css: "dwp-bold"
					},

					//2017.11.28 added by dwlee
					popwin: {
						title: $fn.getCodeMsg("comm.title.js045"),
						/* 새창 열기 */
						click: function (doc) {
							$dwp.core.util.winopen(doc.options.pathinfo.replace(/\&preview=1/gi, ""), "", {});
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-blank.svg"
					},

					reply: {
						title: $fn.getCodeMsg("mail.btn.reply"),
						/*회신*/
						click: function (doc) {
							_me.replyforward(doc, { type: "reply", body: "1", attach: "0" });
						}
					},
					replybody: {
						title: $fn.getCodeMsg("mail.btn.replybody"),
						/*내역포함회신*/
						click: function (doc) {
							_me.replyforward(doc, { type: "reply", body: "1", attach: "0" });
						}
					},
					replybodyattach: {
						title: $fn.getCodeMsg("mail.btn.replybodyattach"),
						/*첨부포함회신*/
						click: function (doc) {
							_me.replyforward(doc, { type: "reply", body: "1", attach: "1" });
						}
					},
					replyto: {
						title: $fn.getCodeMsg("mail.btn.replyto"),
						/*회신 (발신자에게)*/
						click: function (doc) {
							_me.replyforward(doc, { type: "reply", body: "0", attach: "0" });
						}
					},
					allreply: {
						title: $fn.getCodeMsg("mail.btn.allreply"),
						/*전체회신*/
						click: function (doc) {
							_me.replyforward(doc, { type: "allreply", body: "1", attach: "0" });
						}
					},
					allreplybody: {
						title: $fn.getCodeMsg("mail.btn.allreplybody"),
						/*내역포함 전체회신*/
						click: function (doc) {
							_me.replyforward(doc, { type: "allreply", body: "1", attach: "0" });
						}
					},
					allreplybodyattach: {
						title: $fn.getCodeMsg("mail.btn.allreplybodyattach"),
						/*첨부포함 전체회신*/
						click: function (doc) {
							_me.replyforward(doc, { type: "allreply", body: "1", attach: "1" });
						}
					},
					allreplyto: {
						title: $fn.getCodeMsg("mail.btn.allreplyto"),
						/*전체회신 (발신 및 수신인들)*/
						click: function (doc) {
							_me.replyforward(doc, { type: "allreply", body: "0", attach: "0" });
						}
					},
					forward: {
						title: $fn.getCodeMsg("mail.btn.forward"),
						/*전달 (첨부포함)*/
						click: function (doc) {
							_me.replyforward(doc, { type: "forward", body: "1", attach: "1" });
						}
					},
					forwardbody: {
						title: $fn.getCodeMsg("mail.btn.forwardbody"),
						/*내역포함 전달*/
						click: function (doc) {
							_me.replyforward(doc, { type: "forward", body: "1", attach: "0" });
						}
					},
					forwardbodyattach: {
						title: $fn.getCodeMsg("mail.btn.forwardbodyattach"),
						/*첨부포함 전달*/
						click: function (doc) {
							_me.replyforward(doc, { type: "forward", body: "1", attach: "1" });
						}
					},
					copysend: {
						title: $fn.getCodeMsg("mail.btn.copysend"),
						/*추가발송*/
						click: function (doc) {
							_me.replyforward(doc, { type: "copysend", body: "1", attach: "1" });
						}
					},
					deldoc: {
						title: $fn.getCodeMsg("mail.btn.deldoc"),
						/*삭제*/
						click: function (doc) {
							doc.deleteDocument({ confirm: $fn.getCodeMsg("mail.msg.confirm06") });
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-remove.svg"
					},
					pdeldoc: {
						title: $fn.getCodeMsg("mail.btn.pdeldoc"),
						/*영구삭제*/
						click: function (doc) {
							doc.deleteDocument({ softdel: false, confirm: $fn.getCodeMsg("mail.msg.confirm05") });
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"
					},
					star_x: {
						title: $fn.getCodeMsg("mail.btn.starflag"),
						/*중요표시*/
						click: function (doc) {
							_me.star_flag(doc, this);
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-mark.svg",
						css: "star-flag"
					},
					star_o: {
						title: $fn.getCodeMsg("mail.btn.starflag"),
						/*중요표시*/
						click: function (doc) {
							_me.star_flag(doc, this);
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-mark-full-on.png",
						css: "star-flag"
					},
					pcsave: {
						title: $fn.getCodeMsg("mail.btn.pcsave"),
						/*PC저장*/
						click: function (doc) {
							_me.MailStore_LocalDonload_Doc(doc);
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-pc-save.svg"
					},
					movefolder: {
						title: $fn.getCodeMsg("mail.btn.movetofolder"),
						/*영구보관*/
						click: function (doc) {
							_me.doc_movetofolder(doc);
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-permanent-save.svg"
					},
					rule: {
						title: $fn.getCodeMsg("mail.btn.rule"),
						/*규칙설정*/
						click: function (doc) {
							_me.doc_rule(doc);
						}
					},
					returnreceipt: {
						title: $fn.getCodeMsg("mail.btn.receivecheckrecall"),
						/*수신확인*/
						click: function (doc) {
							_me.doc_returnreceipt(doc);
						}
					},
					mailrecall: {
						title: $fn.getCodeMsg("mail.btn.mailrecall"),
						/*메일회수*/
						click: function (doc) {
							_me.doc_mailrecall(doc);
						}
					},
					goview: {
						title: $fn.getCodeMsg(_opt.ispopup == true ? "mail.btn.close" : "mail.btn.goview"),
						/*닫기 or 목록*/
						click: function (doc) {
							if (doc.options.isedit == true) {
								$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm14") }).done(function () {
									/*메일작성을 취소하시겠습니까?<br>저장하지 않은 정보는 복구할 수 없습니다.*/ if (_opt.ispopup == true) {
										window.close();
									} else {
										doc.goview();
									}
								});
							} else {
								if (_opt.ispopup == true) {
									window.close();
								} else {
									console.log("++++++++++++++++++++++++++++++++++++++");
									console.log("_opt.did : ", _opt.did);
									console.log("++++++++++++++++++++++++++++++++++++++");

									if (_opt.did != "") {
										var __dlg = $("#" + _opt.did);
										var __inst = __dlg.xdialog("instance");
										__inst.close();
									} else {
										doc.goview();
									}
								}
							}
						}
					},
					toggleimg: {
						title: _opt.hideimg ? $fn.getCodeMsg("mail.btn.viewimage") : $fn.getCodeMsg("mail.btn.hideimage"),
						/*이미지보기*/
						click: function (doc) {
							if (doc.viewImage()) {
								$("span", this).text($fn.getCodeMsg("mail.btn.viewimage")); /*이미지보기*/
								$(".dwp-body-inner-image", doc.element).hide();
							} else {
								$("span", this).text($fn.getCodeMsg("mail.btn.hideimage")); /*이미지감주기*/
								$(".dwp-body-inner-image", doc.element).hide();
							}
						},
						css: "dwp-body-images"
					},
					portalmore: {
						title: $fn.getCodeMsg("mail.btn.goview"),
						/*포탈 목록 버튼*/
						click: function (doc) {
							if (typeof ePortalConfig == "object") {
								var pageid = "dwp.portal." + ePortalConfig.companyCode + "." + ePortalConfig.zregcode + ".mail";
								portalUIController.page.view("location", "?uri=nm:oid:" + pageid);
							} else {
								console.log("++++++++++++++++++++++++++++++++++++++");
								console.log("_opt.did : ", _opt.did);
								console.log("++++++++++++++++++++++++++++++++++++++");

								if (_opt.did != "") {
									var __dlg = $("#" + _opt.did);
									var __inst = __dlg.xdialog("instance");
									__inst.close();
								} else {
									doc.goview();
								}
							}
						}
					},
					//팀사이트로 문서 카피 - 2017.10.10 added by dwlee
					copyto_vpr: {
						title: $fn.getCodeMsg("mail.btn.teamsite"),
						/*팀사이트*/
						click: function (doc) {
							_me.copyto_vpr($(this), doc);
						}
					},
					//카드메일 미리보기 - 2019.03.15 added by lhj
					preview_card: {
						title: $fn.getCodeMsg("카드 미리보기"),
						click: function (doc) {
							var _$dsp = $("div[name=_CARD_BODY]", doc.element);
							//console.log("ddd", $dwp.ui.weditor.getHtmlValue(doc.element));
							_$dsp.html($dwp.ui.weditor.getBodyValue(doc.element));
						}
					},
					//주고받은 메일 - 2023.04.17 added by mjkim
					connection: {
						title: $fn.getCodeMsg("mail.title.mailthreads"),
						click: function (doc) {
							$dwp.app.mail.com.goConnection(doc, "doc", { ismobile: false });
						}
					},

					//ChatGPT를 이용한 번역 - 2024.10.08 by dwlee
					translation: {
						title: $fn.getCodeMsg("mail.btn.translation"),
						click: function (doc) {
							//직접수행 추가 - 2024.10.14
							//_$$.mail.com.get_chatgpt(doc,{cmd : "", type :"", ask :""}); //2024.10.11
							//언어창 선택창을 띄워야 함. - 2024.10.14
							_me.select_language(doc, $(this));
						}
					},

					//ChatGPT를 이용한 요약 - 2024.10.11 by dwlee
					summary: {
						title: $fn.getCodeMsg("mail.btn.summary"),
						click: function (doc) {
							//직접수행 추가 - 2024.10.14
							_$$.mail.com.get_chatgpt(doc, { cmd: "", type: "summary", ask: "" }); //2024.10.11
						}
					},

					//ChatGPT를 이용한 질문 - 2024.10.14 by dwlee
					aicommand: {
						title: $fn.getCodeMsg("mail.btn.aicommand"),
						click: function (doc) {
							//직접수행 추가 - 2024.10.14
							//_$$.mail.com.get_chatgpt(doc,{cmd : "", type : "direct",ask : ""}); //2024.10.11
							_$$.mail.doc.chatgpt_input(doc, { type: "direct" });
						}
					}
				};
				/*
								환경설정 메일연결보기 사용 X 경우 버튼 제거
				*/
				if (_opt.conview != "1") {
					delete _opt.button["connection"];
				}

				/* 신규 및 편집화면으로 열릴 때 에디터에 추가하는 본문 처리 core.doc.js > doc.init 이후 호출됨 function name 변경 불가 */
				(_opt.insertbody = function (curdoc) {
					//편집화면으로 열릴 때 본문 처리

					var __opt = typeof curdoc.tmpSignature != "undefined" ? $.extend(_opt, curdoc.tmpSignature) : _opt;
					try {
						var event_ele = $(event.srcElement),
							event_ul = null;
						if (event_ele.size() == 1) {
							if (event_ele[0].tagName == "SPAN") {
								event_ul = event_ele.parent().parent();
								if (event_ul.hasClass("dwp-option-list")) {
									//Auto Save 문서를 다시 불러올 때는 서명 및 메일 헤더정보 추출하지 않음
									if (event_ul.parent().attr("id") == "dwp-qtdialog-autosave_group") return "";
								}
							}
						}
					} catch (e) { }

					if (_opt.isnew == true) {
						var rtn = "",
							_mailpath = $fn.getPath("mail");
						if (_opt.ismobile == true) {
							if (_opt.inherit != "copysend") {
								rtn = "Sent from my mobile phone";
							}
						} else {
							//VPR에서 넘어올때 파일의 HTML 태그가 넘어옴 - 2017.12.06 by dwlee
							if (_opt.did != "") {
								var __dlg = null,
									__inst = null,
									__dlgopt;
								__dlg = $("#" + _opt.did);
								__inst = __dlg.xdialog("instance");

								__dlgopt = __inst.options;
								if (__dlgopt.hasOwnProperty("insertbody")) {
									var _attinfo = __dlgopt.insertbody || "";
									var _infoarray = _attinfo.split(";");

									if (_infoarray.length > 4) {
										// 2020-07-21 파라미터 변경으로 length 4 보다 큰값으로 수정
										var _filetable = "";
										//insertbody = _attlink+";"+_img+";"+_filename+";"+_filesize +";"+_vprname;
										_filetable = '<div style="max-width: 736px;">';
										_filetable += '<div style="overflow: hidden;">';
										_filetable += "<div style=\"float: left; width_xx: 350px; color: #333; font-size: 14px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', sans-serif;\">";
										_filetable += '<img src="' + $fn.getPath("weblib") + '/images/common/icon-file.png" alt="" style="width: 15px; height: 15px;">&nbsp;';
										_filetable += _infoarray[4] + " VPR에서 전송된 첨부파일의 링크입니다.";
										_filetable += "</div>";
										_filetable += "<div style=\"float: right; width_x: 350px; color: #666; padding-top: 3px; font-size: 12px; font-family: 'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', sans-serif; text-align: right;\">";
										_filetable += "</div></div>";

										_filetable += '<div style="max-width: 736px; margin-top: 8px; border: 1px solid #cfcfcf; border-top: 2px solid #ed6c00;">';

										_filetable += "<div style=\"padding: 8px 10px; color: #333; font-size: 13px; font-weight: 700; font-family: 'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', sans-serif; cursor: pointer;\">";
										_filetable += "<a href='" + _infoarray[0] + "' download target='_blank' style='text-decoration:none;color:black;cursor:pointer;'";
										_filetable += 'onmouseover=\'this.style.textDecoration="underline";this.style.color="blue";\' onmouseout=\'this.style.textDecoration="none";this.style.color="black";\'>';
										_filetable += '<img src="' + _infoarray[1] + '" alt="" style="width: 15px; height: 15px; margin-right: 5px;">';
										_filetable += _infoarray[2];
										_filetable += "<span style=\"margin-left: 5px; color: #666; font-size: 12px; font-weight: 400; font-family:'Malgun Gothic', Arial, Tahoma, 'Microsoft Yahei', 微软雅黑, sans-serif;\">";
										_filetable += " (" + _infoarray[3] + ")</span>";
										_filetable += "</a></div>";

										_filetable += "</div>";
										_filetable += "</div>";
										_filetable += '<p style="font-size:9pt;">&nbsp;</p>';

										rtn += _filetable;
									}
								}
							}

							if (_opt.inherit != "copysend") {
								if (__opt.enablesignature == "1") {
									//서명 사용하는 경우
									var _signurl = _mailpath + "/($Profiles)/wFrmProfile/Body?OpenField";
									if (__opt.signaturetype == "1" && _opt.usersignatureunid != "") {
										_signurl = _mailpath + "/0/" + __opt.usersignatureunid + "/Body?OpenField";
									} else {
										_signurl = _mailpath + "/($Profiles)/wFrmProfile/Signature" + __opt.signaturetype + "?OpenField";
									}
									if (_signurl != "") {
										var _signData = "<div id=sign_" + __opt.signkey + ">";
										$dwp.core.util
											.xAjax({
												url: _signurl,
												dataType: "html",
												async: false,
												cache: false
											})
											.done(function (data) {
												//사용자지정 서명이면....
												if (__opt.signaturetype == "1") {
													var regExp = /<body[^>]*?>([\s\S]*?)<\/body>/gi; //Body Tag innerHTML
													if (regExp.test(data)) {
														_signData += RegExp.$1 + '<p style="font-size:9pt;">&nbsp;</p>';
													} else {
														_signData += data + '<p style="font-size:9pt;">&nbsp;</p>'; //Body 테그를 못찾으면 그냥 그대로 사용
													}
													//지정된 포멧이면...
												} else {
													_signData += data
														.replace(/&lt;/gi, "<")
														.replace(/&gt;/gi, ">")
														.replace(/&quot;/gi, '"')
														.replace(/&amp;/gi, "&")
														.replace(/<br>/gi, "");
												}
											})
											.fail(function () {
												//
											});
										_signData += "</div>";
										rtn += _signData;
									}
									//서명이 없어도 서명 영역을 잡아야 함 - 2020.11.30 by dwlee
								} else {
									rtn += "<div id=sign_" + __opt.signkey + "></div>";
								}
							}
						}

						//모바일 체크 - 2025.10.16 by dwlee
						if (_opt.ismobile == false && typeof dwpmo =="undefined") {	
						if (_opt.parentunid != "") {
							if (_opt.inherit != "copysend" && _opt.copybody == "1") {
								//<blockquote>  추가 -  2017.07.03 by dwlee
								//rtn += "<BLOCKQUOTE style='BORDER-LEFT: #000000 2px solid; PADDING-LEFT: 5px; PADDING-RIGHT: 0px; MARGIN-LEFT: 5px; MARGIN-RIGHT: 0px'>";

								//SH Global은 가로선을 구분자로 요구해서 변경 - 2017.11.23 by dwlee
								rtn += "<hr>";

								rtn += _$$.mail.com.getSenderInfo(curdoc); //본문에 들어갈 받은메일 헤더정보 추출
							}
							}
						}

						//모바일 체크 - 2025.10.16 by dwlee
						if (_opt.ismobile == false && typeof dwpmo =="undefined") {
						if (_opt.copybody == "1") {
							if (_opt.parentunid != "") {
								//멀티전달 관련 작업할 부분 - 2020.04.14 by dwlee
								_opt.forwardkeys = _opt.forwardkeys || "";
								if (_opt.forwardkeys != "") {
									var _idarray = _opt.forwardkeys.split(";");
									$.each(_idarray, function (i, docid) {
										//헤더정보 찾아오기..... 첫번째는 기본으로 가져오므로 두번째 부터 가져오기
										if (i > 0) {
											var _tmp = _$$.mail.com.getSenderInfo_multi(docid); //메일 원본의 base 테그를 삭제
											rtn += _tmp;
										}

										$dwp.core.util
											.xAjax({
												url: $fn.getProxyUrl(_mailpath + "/0/" + docid + "/Body?OpenField"), //원본 메일의 본문 가져오기
												dataType: "html",
												async: false,
												cache: false
											})
											.done(function (data) {
												//rtn += data;
												rtn += data.replace(/<base href[^>]*>/, ""); //메일 원본의 base 테그를 삭제
											})
											.fail(function () { });
									});
								} else {
									$dwp.core.util
										.xAjax({
											url: $fn.getProxyUrl(_mailpath + "/0/" + _opt.parentunid + "/Body?OpenField"), //원본 메일의 본문 가져오기
											dataType: "html",
											async: false,
											cache: false
										})
										.done(function (data) {
											//rtn += data;
											rtn += data.replace(/<base href[^>]*>/, ""); //메일 원본의 base 테그를 삭제

											//템플릿 적용시 - 2020.11.30 by dwlee
											if (_opt.tmpsignkey != "") {
												rtn = rtn.replace(_opt.tmpsignkey, _opt.signkey);
											}
										})
										.fail(function () { });
								}
								}
							}
						}

						//</blockquote>  추가 -  2017.07.03 by dwlee
						if (_opt.parentunid != "") {
							if (_opt.inherit != "copysend" && _opt.copybody == "1") {
								//SH Global은 가로선을 구분자로 요구해서 변경 - 2017.11.23 by dwlee
								//rtn += "</BLOCKQUOTE>";
							}
						}
						//rtn = (_opt.inherit != "copysend" ? "<p style=\"font-size:9pt;\">&nbsp;</p><p style=\"font-size:9pt;\">&nbsp;</p>" + rtn : rtn);

						//맑은 고딕 12pt로 처리함 -2017.11.08 by dwlee
						rtn = _opt.inherit != "copysend" ? "<p style='font-family:\"맑은 고딕\"; font-size: 10pt; line-height: 19.2px; margin-top: 0px; margin-bottom: 0px;'>&nbsp;</p><p style='font-family:\"맑은 고딕\"; font-size: 10pt; line-height: 19.2px; margin-top: 0px; margin-bottom: 0px;'>&nbsp;</p>" + rtn : rtn;

						return rtn != "" ? rtn : "";
					}
				}),
					/* 신규 및 편집화면으로 열릴 때 에디터에 추가하는 본문 처리 core.doc.js > doc.init 이후 호출됨 function name 변경 불가 */
					(_opt.getbodycallback = function (_doc) {
						if (_doc.options.bodyframe == true) {
							var _options = _doc.options,
								_ele = null,
								_bodyFld = null,
								_iframe = null,
								_body = null,
								_bodytag = null;
							_ele = _doc.element;
							_iframe = $("#iBody", _ele);
							_body = _iframe.get(0).contentWindow || _iframe.get(0).contentDocument.document || _iframe.get(0).contentDocument;
							_bodytag = _body.document.body;

							if ($("img", _bodytag).size() > 0) {
								(_bodyFld = $("#bodyFld", _ele)), (_msgdiv = $(".dwp-body-inner-image", _ele));
								if (_doc.options.hideimg == true) {
									//본문에 이미지 있을 때 알림 메시지 표시
									_msgdiv.show();
									$("button", _msgdiv)
										.off("click")
										.on("click", function () {
											_msgdiv.hide();
										});

									$(".dwp-mobile-imgview", _msgdiv)
										.off("click")
										.on("click", function () {
											//모바일
											_doc.viewImage();
											_msgdiv.hide();
										});
								} else {
									$(".dwp-body-images", _ele).hide();
								}
							}

							/*
							a link 인경우 팝업오픈 mjkim 20221017
*/

							$("a[href^=http]", _bodytag).each(function (i, o) {
								$(this).attr("target", "_blank").attr("rel", "noopener");
							});
						}
					});

				//contenxtMenu 정의 - 2024.10.08 by dwlee
				//조회모드에서 만 활성화
				if (_opt.ismobile == false && _opt.isedit == false) {
					_me._contextMenuInfo(_opt);
				}
				return _opt;
			},

			//2024.10.11 by dwlee
			_contextMenuInfo: function (opt) {

				console.log("context-0");

				var _menuopt;
				opt.contextmenu.items = {};

				console.log("context-1");
				_menuopt = {
					Korean: { name: $fn.getCodeMsg("mail.title.korean"), icon: "flag flag_ko" },
					sep1: "---------",
					English: { name: $fn.getCodeMsg("mail.title.english"), icon: "flag flag_us" },
					sep2: "---------",
					Chinese: { name: $fn.getCodeMsg("mail.title.chinese"), icon: "flag flag_zh" },
					sep3: "---------",
					Japanese: { name: $fn.getCodeMsg("mail.title.japanse"), icon: "flag flag_jp" },

					sep4: "---------",
					summary: { name: $fn.getCodeMsg("mail.title.summary"), icon: "flag flag_sum" }, //요약

					sep5: "---------",
					cmdinput: { name: $fn.getCodeMsg("mail.title.input_cmd"), icon: "flag flag_ai" }, //명령어 직접입력	

					sep6: "---------",
					direct: { name: $fn.getCodeMsg("mail.title.aicommand"), icon: "flag flag_ai" } //질문어 직접입력 - 2024.10.14		
				}

				console.log("context-2");

				console.log(_menuopt);

				opt.contextmenu.items = _menuopt;

				console.log("context-3");

				opt.contextmenu.callback = $dwp.app.mail.doc._contextMenuRun;

				console.log("context-4");
			},

			//2024.10.08 by dwlee
			_contextMenuRun: function (key) {
				//번역
				var _me = this;
				var _doc = $fn.getInstance("doc");
				var _cmd = "";
				if (key == "summary") {
					//직접수행 추가 - 2024.10.14
					_$$.mail.com.get_chatgpt(_doc, { cmd: "", type: key, ask: "" });

					//입력이면...
				} else if (key == "cmdinput") {
					//_$$.mail.view.ai_input(_view, { idlist: _unids, type : "input"});
					//직접수행 추가 - 2024.10.14
					_$$.mail.doc.chatgpt_input(_doc, { type: "input" });
					//직접 수행 - 2024.10.14
				} else if (key == "direct") {
					//_$$.mail.view.ai_input(_view, { idlist: _unids, type : "input"});
					//직접수행 추가 - 2024.10.14
					_$$.mail.doc.chatgpt_input(_doc, { type: "direct" });
				} else {
					_cmd = "Translate the following text to " + key;
					//직접수행 추가 - 2024.10.14
					_$$.mail.com.get_chatgpt(_doc, { cmd: _cmd, type: "", ask: "" });
				}
			},

			//chatgpt_action  2024.10.08 by dwlee
			chatgpt_action_bk: function (doc, cmd) {
				var _opt = doc.options;
				var _el = doc.element;
				//번역해줘
				var _cmd = "Translate the following text to Korean;";
				//문법을 맞춰줘
				if (cmd == "grammer") {
					_cmd = "Correct this sentence grammatically:";
					//요약해줘
				} else if (cmd == "summary") {
					_cmd = "Summarize the sentence below:";
				} else if (cmd != "") {
					_cmd = cmd;
				}

				var _body = "";
				var _$body = $("#bodyFld", _el);
				var _$iframe = $("iframe[id=iBody]", _$body);

				//iframe 방식이면....
				if (_$iframe.size() > 0) {
					_body = _$iframe.contents().find("body").text();
					//div 방식이면...
				} else {
					_body = _$body.text();
				}

				var _$selarea = $(".dwp-selected-text", _el);
				if (_$selarea.size() > 0) {
					if (_$selarea.text() != "") {
						_body = _$selarea.text();
						console.log("selectbody : ", _body);
					}
				}
				$fn.xAjax({
					url: "/openai"
					, type: 'POST'
					, dataType: 'json'
					, data: {
						'cmd': _cmd,
						'ask': _body
					}
				}).done(function (json) {
					console.log(json.response);

					var _message = json.response;
					_message = _message.replace(/\n/gi, "<br>");

					var _target = $fn.getCodeMsg("mail.title.translang");
					if (cmd == "grammer") {
						_target = $fn.getCodeMsg("mail.title.grammer");
						//요약해줘
					} else if (cmd == "summary") {
						_target = $fn.getCodeMsg("mail.title.summary");
					}

					var _tghtml = "<div class='dwp-table-vertical-read'>";
					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>" + $fn.getCodeMsg("mail.title.curlang") + "</div>";
					_tghtml += "<div class='dwp-value'>" + _body + "</div>";
					_tghtml += "</div>";

					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + _target + "</div>";
					_tghtml += "<div class='dwp-value'>" + _message + "</div>";
					_tghtml += "</div>";

					_tghtml += "</div>";


					//var _tghtml = "<div style='border:1px solid #666;padding:5px;height:100%'>" + json.response +  "</div>";

					$dwp.ui.dialog.init(null, {
						show: { effect: "fade", duration: 300 }
						, hide: { effect: "fade", duration: 300 }
						//,draggable: true
						//,resizable: true
						, width: 800
						//, height: 600
						, modal: true
						, title: $fn.getCodeMsg("수행내용")
						, content: { url: "", html: _tghtml, data: {} }
						, initcallback: function (_$dialog) {
						}
					});
				});
			},

			//AI 명령어 직접입력 - 2024.10.11 by dwlee
			//파라미터 추가 - 2024.10.14
			chatgpt_input: function (doc, topt) {
				//다이알 로그 창 팝업
				var _me = this;
				var _tghtml = "<div class='dwp-table-vertical-read'>";

				//직접수행 추가 - 2024.10.14
				if (topt.type == "input") {
					//샘플 문구 넣어줄것 - 2024.10.14
					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>" + $fn.getCodeMsg("mail.title.sample_command") + "</div>";
					_tghtml += "<div class='dwp-value'><div class='dwp-input expended'>" + $fn.getCodeMsg("mail.title.sample_txt") + "</div></div>";
					_tghtml += "</div>";

					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>" + $fn.getCodeMsg("mail.title.command") + "</div>";			//명령어		
					_tghtml += "<div class='dwp-value'><div class='dwp-input expended'><input type=text name=aicommand></div></div>";
					_tghtml += "</div>";
				} else {
					//샘플 문구 넣어줄것 - 2024.10.14
					_tghtml += "<div class='dwp-row'>";

					//mail.title.sample_opensearch , mail.title.sample_ai

					//mail.title.ai_txt

					//mail.title.opensearch_txt
					/*
										_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:150px'>" + $fn.getCodeMsg("mail.title.sample_ask") + "</div>";					
										_tghtml += "<div class='dwp-value'><div class='dwp-input expended'>" + $fn.getCodeMsg("mail.title.ask_txt") + "</div></div>";					
										_tghtml += "</div>";	
					*/

					_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:150px'>" + $fn.getCodeMsg("mail.title.sample_ai") + "</div>";
					_tghtml += "<div class='dwp-value'><div class='dwp-input expended'>" + $fn.getCodeMsg("mail.title.ai_txt") + "</div></div>";
					_tghtml += "</div>";

					_tghtml += "<div class='dwp-row'>";
					_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:150px'>" + $fn.getCodeMsg("mail.title.sample_opensearch") + "</div>";
					_tghtml += "<div class='dwp-value'><div class='dwp-input expended'>" + $fn.getCodeMsg("mail.title.opensearch_txt") + "</div></div>";
					_tghtml += "</div>";
					_tghtml += "<div class='dwp-row'>";
					//					_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:100px'>" + $fn.getCodeMsg("mail.title.ask") + "</div>";		//질문내용	

					_tghtml += "<div class='dwp-value dwp-bold dwp-red' style='width:150px'>" 		//질문내용	
					_tghtml += "	<div class='dwp-selectbox'>";
					_tghtml += "		<select name='changeCmd'>";
					_tghtml += "			<option value='ai_cmd'>AI 명령어</option>";
					_tghtml += "			<option value='notesdb_rulebook'>규정집</option>";
					_tghtml += "			<option value='notesdb_manual'>매뉴얼</option>";
					_tghtml += "			<option value='notesdb_aprvdone'>전자결재</option>";
					_tghtml += "		</select>"
					_tghtml += "	</div>";

					_tghtml += "</div>";

					//콤보박스 추가 - 2024.10.23 by dwlee
					_tghtml += "<div class='dwp-value'>";
					_tghtml += "	<div class='dwp-input expended'>";
					_tghtml += "		<input type=text name=aicommand>";
					_tghtml += "	</div>";

					_tghtml += "</div>";

					_tghtml += "</div>";
				}

				_tghtml += "</div>";

				$dwp.ui.dialog.init(null, {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					//,draggable: true
					//,resizable: true
					, refdata: { doc: doc }
					, width: 800
					//, height: 600
					, modal: true
					, title: $fn.getCodeMsg("mail.title.aicommand")
					, buttons: [
						{
							title: $fn.getCodeMsg("comm.btn.confirm"), // 확인
							css: 'confirm',
							click: function (_$dialog) {
								var _del = _$dialog.element;

								//직접수행 추가 - 2024.10.14
								if (topt.type == "input") {
									_cmd = $("input[name=aicommand]", _del).xval() + ":";
									_ask = "";
								} else {
									_ask = $("input[name=aicommand]", _del).xval();
									_cmd = "direct";
								}

								console.log("selectbox : ", $("select[name='changeCmd']", _del).size());
								console.log($("select[name='changeCmd']", _del).xval());


								//통합검색 색인 활용 - 2024.10.23 by dwlee
								if ($("select[name='changeCmd']", _del).size() > 0 && $("select[name='changeCmd']", _del).xval() != "ai_cmd") {
									var _searchdb = $("select[name='changeCmd']", _del).xval();
									_$$.mail.com.opensearch_action({ cmd: _cmd, type: topt.type, ask: _ask, search: _searchdb });

								} else {
									//직접수행 추가 - 2024.10.14
									_$$.mail.com.get_chatgpt(doc, { cmd: _cmd, type: topt.type, ask: _ask });
								}

								_$dialog.close();
								//if (!$fn.validate($("form", _del))) { return false; }

							}
						},
						{
							title: $fn.getCodeMsg("comm.btn.cancel"), // 닫기
							css: 'cancel',
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					]
					, content: { url: "", html: _tghtml, data: {} }
					, initcallback: function (_$dialog) {
						//2024.10.14
						$(".ui-dialog-titlebar-close").on("click", function () {
							$(".css-1mtxqz6").removeClass("dwp-none");
						});
					}
				});
			},


			//조회모드에서 선택된 영역의 Text를 가져오는 함수 - 2024.10.08
			get_selected: function (_doc) {
				//console.log("_event : " , _event.element);
				//var _doc = $fn.getInstance("doc");
				console.log("======================================");
				console.log("selstr doc : ", _doc);
				console.log("======================================");

				var _me = this;
				var _el = _doc.element;
				var _opt = _doc.options;

				var _$seltext = $(".dwp-selected-text", _el);
				//console.log("히히히 : " , $(".dwp-selected-text",_event.element).size());
				//console.log("_$seltext.size() : " , _$seltext.size());

				var seldoc = document;
				//console.log("$(#iBody,_el).size() : ", $("#iBody",_el).size());
				if ($("#iBody", _el).size() > 0) {
					var obj = $("#iBody", _el).get(0);
					var objDoc = obj.contentWindow || obj.contentDocument;
					seldoc = objDoc.document;

					console.log("bbbbbbb");
					//context Menu - 처리하기 
					$(seldoc).contextMenu(
						$.extend(
							{
								selector: "body",
								position: function (opt, x, y) {

									var _$nav = $(".dwp-nav");
									var _$bodylap = $("#bodywrap", _el);
									var _left = x;
									var _top = y + 30; //한라인 아래에 위치하도록 조정
									//nav가 있는 경우
									if (_$nav.size() > 0 && _$nav.hasClass("hide") == false) {
										_left += _$nav.width();
									}
									//bodywrap. position
									if (_$bodylap.size() > 0) {
										_top += _$bodylap.offset().top;
									}

									console.log("xxxxxx : ", x);
									console.log("yyyyy : ", y);
									opt.$menu.css({ top: _top, left: _left });
								}
							}
							, _opt.contextmenu
						)
						//$.extend({ selector: '.dwp-body-wrap' }, opt.contextmenu)
					);
				} else {

					console.log("ccccc");
					var _$bodylap = $("#bodywrap", _el);

					console.log("ccccc----0");

					console.log(_$bodylap.size());

					console.log(_opt.contextmenu);

					//context Menu - 처리하기 
					_$bodylap.contextMenu(
						$.extend({ selector: "#bodyFld" }, _opt.contextmenu)
						//$.extend({ selector: '.dwp-body-wrap' }, opt.contextmenu)
					);
					console.log("ccccc-----1");

					console.log("ccccc---2");
				}


				console.log("dddddd");

				seldoc.addEventListener("selectionchange", () => {
					//console.log(seldoc.getSelection());
				});
				seldoc.onselectionchange = () => {
					_$seltext.text(seldoc.getSelection().toString());
				};

				console.log("eeeeee");
			},

			//메일 발송시 팀사이트의 게시판으로 문서 복사 - 2017.10.10 by dwlee
			copyto_vpr: function (o, _doc) {
				var _opt = _doc.options;

				if (_opt.ismobile) {
					// mobile 용
					$dwp.ui.dialog.init(o, {
						title: $fn.getCodeMsg("comm.title.js063"),
						//,width : 736
						position: ["center", 20],
						modal: true,
						ismobile: true,
						width: "100%",
						height: "auto",
						resizable: false,
						draggable: false,
						content: { url: $fn.getPath("gwlib") + "/wvprcopy_mo?readform", data: {} },
						initcallback: function (_$dialog) {
							var _$roomlist = $("div.society-area", _$dialog.element);
							var _deferreds = [];

							_deferreds.push(
								$dwp.core.util.xAjax({
									url: $fn.getProxyUrl("/dwp/com/appmng/vprj_mn.nsf/uservpr_info?openagent"),
									dataType: "json",
									async: true,
									cache: false,
									data: { empno: $fn.getCurUser().pinfo.empno }
								})
							);

							$.when.apply($, _deferreds).done(function (vpr) {
								// VPR
								$.each(vpr, function (i, o) {
									var _h = '<div class="item">';
									_h += '<a class="item-wrap">';
									_h += '<div class="title-area">';
									//_h += "<img src='" + $fn.getPath("weblib") + "/images/dummy/project-room.png'>";
									_h += "<img src='" + $fn.getProxyUrl(o.img) + "'>";
									_h += "<div class='title-mask'>";
									_h += "<div class='title'>" + $fn.getCurLangMsg(o.nm) + "</div>";
									_h += "</div>";

									_h += "<div class='checked'><img src='" + $fn.getPath("weblib") + "/images/common/btn-confirm.svg'></div>";
									_h += "</div></a></div>";
									var _$item = $(_h).appendTo(_$roomlist);
									_$item.data("_ROOM_DATA", o);

									$fn.getImgError($("img", _$item), { src: $fn.getPath("weblib") + "/images/dummy/project-room.png" });
								});
							});

							$(".dwp-tabs-simple", _$dialog.element).tabs({
								active: 0
							});
							$(".society-area .item-wrap", _$dialog.element).on("click", function () {
								$(this).closest(".item").toggleClass("active");
							});
						},
						confirm: function (_$dialog) {
							var _rtnlist = [];
							var _v = null;
							var _namelist = [];
							$("div.society-area div.item.active", _$dialog.element).each(function () {
								var _o = $(this).data("_ROOM_DATA");
								_v = "R^" + _o.cd + "^" + _o.nm + "^" + _o.path + "^" + _o.server;

								console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
								console.log(" 정보 : ", _v);

								console.log("이름 : ", $fn.getCurLangMsg(_o.nm));

								console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

								_rtnlist.push(_v);
								_namelist.push($fn.getCurLangMsg(_o.nm));
							});

							if (_rtnlist.length == 0) {
								//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg030")});
								$("input[name='VprInfo']", _doc.element).xval("");
								$("span.teamsite", _doc.element).html("");
								return;
							} else {
								//메일의 본문에 추가하는 로직이 필요
								$("input[name='VprInfo']", _doc.element).xval(_rtnlist.join(";"));

								console.log("display area size : ", $("span.dwp-teamsite", _doc.element).size());

								$("span.dwp-teamsite", _doc.element).html("( " + $fn.getCodeMsg("mail.btn.teamsite") + " : " + _namelist.join(",") + ")");
							}
							_$dialog.close();
						}
					});
				} else {
					$dwp.ui.dialog.init(o, {
						title: $fn.getCodeMsg("comm.title.js063"),
						width: 736,
						modal: true,
						content: { url: $fn.getPath("gwlib") + "/wvprcopy?readform", data: {} },
						initcallback: function (_$dialog) {
							var _$roomlist = $("div.bookmark-share-list.room", _$dialog.element);
							var _deferreds = [];

							_deferreds.push(
								$dwp.core.util.xAjax({
									url: $fn.getProxyUrl("/dwp/com/appmng/vprj_mn.nsf/uservpr_info?openagent"),
									dataType: "json",
									async: true,
									cache: false,
									data: { empno: $fn.getCurUser().pinfo.empno }
								})
							);

							var _info = $("input[name='VprInfo']", _doc.element).xval();
							var _vprarray = [];
							var _infoarray = _info.split(";");
							if (_info != "") {
								$.each(_infoarray, function (index, _vprinfo) {
									var _tmparray = _vprinfo.split("^");
									_vprarray.push(_tmparray[1]); //VPR 코드 배열
								});
							}
							//console.log("============================================");
							//console.log("INFO : ",_info);
							//console.log("============================================");

							$.when.apply($, _deferreds).done(function (vpr) {
								// vpr
								$.each(vpr, function (i, o) {
									var _h = '<div class="share-room">';
									_h += '<div class="dwp-inner">';
									//_h += "<img src='" + $fn.getPath("weblib") + "/images/dummy/project-room.png'>";
									_h += "<img src='" + $fn.getProxyUrl(o.img) + "'>";
									_h += "<div class='room-title'>";
									_h += "<div class='txt'>" + $fn.getCurLangMsg(o.nm) + "</div>";
									_h += "</div>";

									//console.log("vprlist : ",_vprarray.join(";"));
									//console.log("o.cd : ", o.cd);

									if ($.inArray(o.cd, _vprarray) > -1) {
										_h += "<div class='dwp-checkbox textless'><label><input type='checkbox' checked><span></span></label></div>";
									} else {
										_h += "<div class='dwp-checkbox textless'><label><input type='checkbox'><span></span></label></div>";
									}
									_h += "</div></div>";
									var _$item = $(_h).appendTo(_$roomlist);
									_$item.data("_ROOM_DATA", o);
									$fn.getImgError($("img", _$item), { src: $fn.getPath("weblib") + "/images/dummy/project-room.png" });
								});
							});
						},
						buttons: [
							{
								title: $fn.getCodeMsg("comm.btn.confirm"),
								click: function (_$dialog) {
									var _rtnlist = [];
									var _namelist = [];

									$("div.share-room input[type='checkbox']:checked", _$dialog.element).each(function () {
										var _o = $(this).parents("div.share-room").data("_ROOM_DATA");
										_v = "R^" + _o.cd + "^" + _o.nm + "^" + _o.path + "^" + _o.server;

										/*
									 console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
									 console.log(" 정보 : " , _v);
									 console.log("이름 : ",$fn.getCurLangMsg(_o.nm));
									 console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
									*/

										_rtnlist.push(_v);
										_namelist.push($fn.getCurLangMsg(_o.nm));
									});

									if (_rtnlist.length == 0) {
										//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg030")});
										$("input[name='VprInfo']", _doc.element).xval("");
										$("span.teamsite", _doc.element).html("");
										return;
									} else {
										//메일의 본문에 추가하는 로직이 필요
										$("input[name='VprInfo']", _doc.element).xval(_rtnlist.join(";"));

										/*
									console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
									console.log("wwwww : ",_rtnlist.join(";"));
									console.log("display area size : ", $("span.dwp-teamsite",_doc.element).size());
									console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
									*/

										$("span.dwp-teamsite", _doc.element)
											.addClass("dwp-bold")
											.html("( " + $fn.getCodeMsg("mail.btn.teamsite") + " : " + _namelist.join(",") + ")");
									}

									_$dialog.close();

									//메일의 본문에 추가하는 로직이 필요
								}
							},
							{
								title: $fn.getCodeMsg("comm.btn.cancel"),
								click: function (_$dialog) {
									_$dialog.close();
								}
							}
						]
					});
					// pc end
				}
			},


			//예약 및 보안메일 - qtdialog 를 통한 UI 추가 - 2024.05.20 by dwlee
			send_schedsecutiry: function (_doc, bobj) {
				var _me = this, _opt = _doc.options, _el = _doc.element;

				_html = '<div class="" styl="margin-top:5px;margin-left:5px;margin-right:5px">';

				var _rehtml = $(".dwp-mail-reserve", _el).html();
				//_rehtml = _rehtml.replace(/ReserveDate/gi,"ReserveDate1");

				_html += '<div style="margin-top:15px;margin-left:20px;margin-right:20px">' + _rehtml + '</div>';
				_html += '<div style="margin-top:10px;margin-left:20px;margin-right:20px">' + $(".dwp-mail-security", _el).html() + '</div>';
				_html += "</div>";
				$dwp.ui.qtdialog.init(bobj, {
					qtid: "mail_sendoption",
					height: 180,
					width: "auto",
					dialogClass: "titleless dropdown-type-dialog",
					position: { my: "left top", at: "left bottom", collision: "flipfit" },
					buttons: [
						{
							title: $fn.getCodeMsg("comm.btn.confirm")
							, click: function (_$qtdialog) {
								var _reserve = $("input[name=ReserveMail]", _$qtdialog.element).xval();
								var _security = $("input[name=SecureMail]", _$qtdialog.element).xval();

								var _date = $("input[name=ReserveDate]", _$qtdialog.element).xval();
								var _hour = $("select[name=ReserveHour]", _$qtdialog.element).xval();
								var _min = $("select[name=ReserveMinute]", _$qtdialog.element).xval();

								if (_reserve == "1") {
									if (_date == "" || _hour == "" || _min == "") {
										$fn.toast({ msg: "예약정보를 정확하게 입력하세요" });
										return;
									}
									$("input[name=ReserveDate]", _el).xval(_date);
									$("select[name=ReserveHour]", _el).xval(_hour);
									$("select[name=ReserveMinute]", _el).xval(_min);
									$("input[name=ReserveMail]", _el).xval(_reserve);
								} else {
									$("input[name=ReserveDate]", _el).xval("");
									$("select[name=ReserveHour]", _el).xval("");
									$("select[name=ReserveMinute]", _el).xval("");
									$("input[name=ReserveMail]", _el).xval("");
								}

								var _pssd = $("input[name=SecurePW]", _$qtdialog.element).xval();
								var _repssd = $("input[name=SecurePWConfirm]", _$qtdialog.element).xval();
								if (_security == "1") {
									if (_pssd == "" || _repssd == "") {
										$fn.toast({ msg: "보안메일의 정보를 정확하게 입력하세요" });
										return;
									}
									$("input[name=SecurePW]", _el).xval(_pssd);
									$("input[name=SecurePWConfirm]", _el).xval(_repssd);
									$("input[name=SecureMail]", _el).xval(_security);
								} else {
									$("input[name=SecurePW]", _el).xval("");
									$("input[name=SecurePWConfirm]", _el).xval("");
									$("input[name=SecureMail]", _el).xval("");
								}

								_$qtdialog.close();
							}
							, css: "dwp-bold dwp-red dwp-default"
						}, {
							title: $fn.getCodeMsg("comm.btn.cancel")
							, click: function (_$qtdialog) {
								_$qtdialog.close();
							}
							, css: "icon-type"
						}
					],
					content: { url: "", html: _html },
					initcallback: function (_$qtdialog) {
						var _reserve = $("input[name=ReserveMail]", _el).xval();
						var _security = $("input[name=SecureMail]", _el).xval();
						$("input[name=SecureMail]", _$qtdialog.element).xval(_security);

						var _$reserve = $("input[name=ReserveMail]", _$qtdialog.element);
						var _$chkbox = _$reserve.closest(".dwp-checkbox");
						_$reserve.xval(_reserve);
						_$chkbox.css("margin-bottom", "20px");					//체크박스 중앙배치

						var _$date = $("input[name=ReserveDate]", _$qtdialog.element);
						_$date.closest(".dwp-input").css("margin-right", "10px");
						_$date.xval($("input[name=ReserveDate]", _el).xval());
						_$date.removeAttr("id");
						_$date.removeClass("hasDatepicker");

						$(".ui-datepicker-trigger", _$qtdialog.element).remove();
						$dwp.ui.datepicker(_$qtdialog.element, {}); //datepicker 호출

						$("select[name=ReserveHour]", _$qtdialog.element).xval($("select[name=ReserveHour]", _el).xval());
						$("select[name=ReserveMinute]", _$qtdialog.element).xval($("select[name=ReserveMinute]", _el).xval());

						$("input[name=SecurePW]", _$qtdialog.element).xval($("input[name=SecurePW]", _el).xval());
						$("input[name=SecurePWConfirm]", _$qtdialog.element).xval($("input[name=SecurePWConfirm]", _el).xval());
					}
				});
			},


			//발송옵션 - qtdialog 를 통한 UI 추가 - 2024.05.20 by dwlee
			send_options: function (_doc, bobj) {
				var _me = this, _opt = _doc.options, _el = _doc.element;

				_html = '<div class="" styl="margin-top:5px;margin-left:5px;margin-right:5px">';
				_html += '<div style="margin-top:15px;margin-left:20px;margin-right:20px">' + $(".engname", _el).html() + '</div>';

				//2024.10.07
				//_html += '<div style="margin-left:20px;margin-right:20px">'+$(".send-me", _el).html()+'</div>';
				_html += '<div style="margin-left:20px;margin-right:20px">' + $(".individual", _el).html() + '</div>';
				_html += "</div>";
				$dwp.ui.qtdialog.init(bobj, {
					qtid: "mail_sendoption",
					height: 150,
					width: "auto",
					dialogClass: "titleless dropdown-type-dialog",
					position: { my: "left top", at: "left bottom", collision: "flipfit" },
					buttons: [
						{
							title: $fn.getCodeMsg("comm.btn.confirm")
							, click: function (_$qtdialog) {
								var _name = $("input[name=IsEngName]", _$qtdialog.element).xval();

								//2024.10.07
								var _sendme = $("input[name=send_me]", _$qtdialog.element).xval();
								var _indiv = $("input[name=individual]", _$qtdialog.element).xval();
								$("input[name=IsEngName]", _el).xval(_name);

								//2024.10.07
								//$("input[name=send_me]", _el).xval(_sendme);
								$("input[name=individual]", _el).xval(_indiv);

								//2024.10.07
								//_$$.mail.doc.send_me(_doc, $("input[name=send_me]", _$qtdialog.element));

								_$qtdialog.close();
							}
							, css: "dwp-bold dwp-red dwp-default"
						}, {
							title: $fn.getCodeMsg("comm.btn.cancel")
							, click: function (_$qtdialog) {
								_$qtdialog.close();
							}
							, css: "icon-type"
						}
					],
					content: { url: "", html: _html },
					initcallback: function (_$qtdialog) {
						//var _$list = $(".tree-item", _$qtdialog.element);										
						var _name = $("input[name=IsEngName]", _el).xval();

						//2024.10.07	
						//var _sendme = $("input[name=send_me]", _el).xval();
						var _indiv = $("input[name=individual]", _el).xval();

						$("input[name=IsEngName]", _$qtdialog.element).xval(_name);

						//2024.10.07	
						//$("input[name=send_me]", _$qtdialog.element).xval(_sendme);
						$("input[name=individual]", _$qtdialog.element).xval(_indiv);

					}
				});

			},

			/**
			 * _$$.mail.doc.select_signature
			 * 메일 작성화면에서 서명 변경하기
			 * @param {*} _doc
			 */
			//qtdialog 를 통해서 UI 변경 - 2025.05.14 by dwlee
			select_signature: function (_doc, bobj) {
				var _me = this,
					_opt = _doc.options,
					tmpSignature = { enablesignature: "1", signaturetype: "2" },
					_html = "";
				var changeBody = function (nid) {
					//웹 에디터의 내용을 가져와서 서명만 치환하도록 변경 - 2020.09.01 by dwlee
					var _signkey = "sign_" + _opt.signkey;
					var _body = $dwp.ui.weditor.getBodyValue(_doc.element);

					console.log("_body : ", _body);

					var _$tmpcontainer = $("<div class='dwp-tmp-container'>" + _body + "</div>").appendTo(_doc.element);
					var _$sign = $("#" + _signkey, _$tmpcontainer);

					var _signurl = _opt.cdb + "/($Profiles)/wFrmProfile/Body?OpenField";
					if (nid.length != 1) {
						_signurl = _opt.cdb + "/0/" + nid + "/Body?OpenField";
					} else {
						_signurl = _opt.cdb + "/($Profiles)/wFrmProfile/Signature" + nid + "?OpenField";
					}
					$dwp.core.util
						.xAjax({
							url: $fn.getProxyUrl(_signurl),
							dataType: "html",
							async: false,
							cache: false
						})
						.done(function (data) {
							var rtn = "";
							if (nid.length != 1) {
								var regExp = /<body[^>]*?>([\s\S]*?)<\/body>/gi; //Body Tag innerHTML
								if (regExp.test(data)) {
									rtn += RegExp.$1 + '<p style="font-size:9pt;">&nbsp;</p>';
								} else {
									rtn += data + '<p style="font-size:9pt;">&nbsp;</p>'; //Body 테그를 못찾으면 그냥 그대로 사용
								}
							} else {
								rtn = data
									.replace(/&lt;/gi, "<")
									.replace(/&gt;/gi, ">")
									.replace(/&quot;/gi, '"')
									.replace(/&amp;/gi, "&")
									.replace(/<br>/gi, "");
							}
							if (_$sign.size() > 0) {
								_$sign.html(rtn);
								$dwp.ui.weditor.setBodyValue(_$tmpcontainer.html(), _doc.element);
							}
							_$tmpcontainer.remove();
						})
						.fail(function () { });
				};
				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_opt.cdb + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: { actiontype: "get_signature_list", Arg1: "select_signature" },
					success: function (data, textStatus) {
						_html = '<div class="dwp-table-xxx">';
						_html += '<div class="dwp-tree-srch-result" style="border:0px;min-height:195px; max-height:195px; overflow-y:auto; overflow-x:hidden;">';
						if (data.length == 0) {
							_html += '<div class="dwp-orange dwp-center" style="padding: 10px;">' + $fn.getCodeMsg("mail.data.cmt04") + "</div>";
						} else {
							$.each(data, function (i, o) {
								//다국어 추가 - 2024.12.18 by dwlee
								var _subject = o["subject"];
								if (_subject.indexOf("signsel") > -1) {
									_html += '<div class="tree-item dwp-cursor" unid="' + o["@unid"] + '" data="' + o["data"] + '">' + $fn.getCodeMsg("mail.title." + _subject) + "&nbsp;</div>";
								} else {
									_html += '<div class="tree-item dwp-cursor" unid="' + o["@unid"] + '" data="' + o["data"] + '">' + _subject + "&nbsp;</div>";
								}
							});
						}
						_html += "</div></div>";
						$dwp.ui.qtdialog.init(bobj, {
							qtid: "mail_signatuueqt",
							height: 200,
							width: "auto",
							dialogClass: "titleless dropdown-type-dialog",
							position: { my: "left top", at: "left bottom", collision: "flipfit" },
							buttons: [],
							content: { url: "", html: _html },
							initcallback: function (_$qtdialog) {
								var _$list = $(".tree-item", _$qtdialog.element);
								_$list.off("click").on("click", function () {
									changeBody($(this).attr("unid"));
									_$qtdialog.close();
								});
							}
						});
					}
				});
			},

			//서명선택 기존 함수 백업 - 2024.05.14 by dwlee
			select_signature_old: function (_doc) {
				var _me = this,
					_opt = _doc.options,
					tmpSignature = { enablesignature: "1", signaturetype: "2" },
					_html = "";
				var changeBody = function (nid) {
					//웹 에디터의 내용을 가져와서 서명만 치환하도록 변경 - 2020.09.01 by dwlee
					var _signkey = "sign_" + _opt.signkey;
					var _body = $dwp.ui.weditor.getBodyValue(_doc.element);

					console.log("_body : ", _body);

					var _$tmpcontainer = $("<div class='dwp-tmp-container'>" + _body + "</div>").appendTo(_doc.element);
					var _$sign = $("#" + _signkey, _$tmpcontainer);

					var _signurl = _opt.cdb + "/($Profiles)/wFrmProfile/Body?OpenField";
					if (nid.length != 1) {
						_signurl = _opt.cdb + "/0/" + nid + "/Body?OpenField";
					} else {
						_signurl = _opt.cdb + "/($Profiles)/wFrmProfile/Signature" + nid + "?OpenField";
					}
					$dwp.core.util
						.xAjax({
							url: $fn.getProxyUrl(_signurl),
							dataType: "html",
							async: false,
							cache: false
						})
						.done(function (data) {
							var rtn = "";
							if (nid.length != 1) {
								var regExp = /<body[^>]*?>([\s\S]*?)<\/body>/gi; //Body Tag innerHTML
								if (regExp.test(data)) {
									rtn += RegExp.$1 + '<p style="font-size:9pt;">&nbsp;</p>';
								} else {
									rtn += data + '<p style="font-size:9pt;">&nbsp;</p>'; //Body 테그를 못찾으면 그냥 그대로 사용
								}
							} else {
								rtn = data
									.replace(/&lt;/gi, "<")
									.replace(/&gt;/gi, ">")
									.replace(/&quot;/gi, '"')
									.replace(/&amp;/gi, "&")
									.replace(/<br>/gi, "");
							}
							if (_$sign.size() > 0) {
								_$sign.html(rtn);
								$dwp.ui.weditor.setBodyValue(_$tmpcontainer.html(), _doc.element);
							}
							_$tmpcontainer.remove();
						})
						.fail(function () { });
				};
				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (_obj) {
							_sell = $(".tree-item.active", _obj.element);
							if (_sell.size() == 0) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt28") });
								return;
							}
							if (_sell.size() > 1) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt27") });
								return;
							}
							_obj.close();
							//$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm26") }).done(function () {
							//선택된 서명으로 메일 내용을 변경 하시겠습니까? 작성중인 내용은 초기화 됩니다.
							changeBody(_sell.attr("unid"));
							//});
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (_obj) {
							_obj.close();
						}
					}
				];

				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_opt.cdb + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: { actiontype: "get_signature_list", Arg1: "select_signature" },
					success: function (data, textStatus) {
						_html = '<div class="dwp-table-xxx">';
						_html += '<div class="dwp-tree-srch-result" style="min-height:281px; max-height:281px; overflow-y:auto; overflow-x:hidden;">';
						if (data.length == 0) {
							_html += '<div class="dwp-orange dwp-center" style="padding: 10px;">' + $fn.getCodeMsg("mail.data.cmt04") + "</div>";
						} else {
							$.each(data, function (i, o) {
								_html += '<div class="tree-item dwp-cursor" unid="' + o["@unid"] + '" data="' + o["data"] + '">' + o["subject"] + "&nbsp;</div>";
							});
						}
						_html += "</div></div>";

						$fn.dialog(null, {
							modal: true,
							resizable: true,
							draggable: true,
							title: $fn.getCodeMsg("mail.btn.selectsignature"),
							width: 400,
							height: 440,
							show: "fade", //effect
							hide: "fade", //effect
							ismobile: false,
							buttons: _buttons,
							open: function (_opt) {
								var _this = this;
								_dlg = _opt.target;
								$(".tree-item", _dlg)
									.off("click")
									.on("click", function () {
										$(".tree-item.active", _dlg).removeClass("active");
										$(this).toggleClass("active");
									});
							},
							content: { html: _html }
						});
					}
				});
			},

			/* _$$.mail.doc.template_load  >>  메일 작성화면에서 템플릿 선택하면 현재 화면을 바꾸기*/
			template_load: function (_doc, bobj) {
				console.log("template_load!!!!!");
				var _me = this,
					_options = _doc.options,
					__dlg = null,
					__inst = null,
					_opt = {},
					_sell = "",
					_html = "",
					_param = "";
				_param = _options.ispopup ? "&popup=1" : "";
				var changePage = function (_unid, signkey) {
					console.log("signkey::", signkey);

					if (_options.did != "") {
						console.log("template_load-1!!!");
						__dlg = $("#" + _options.did);
						__dlg.xdialog("instance").close();
						_opt = {
							url: _options.cdb + "/wForward?OpenForm&ParentUNID=" + _unid + "&tmpsignkey=" + signkey + "&inherit=copysend&copybody=1&copyattach=1" + _param
						};
						_$$.mail.com.newMail(_opt);
					} else {
						console.log("template_load-2!!!");
						_options.pathinfo = _options.cdb + "/wForward?OpenForm&ParentUNID=" + _unid + "&tmpsignkey=" + signkey + "&inherit=copysend&copybody=1&copyattach=1" + _param;
						_doc.reload();
					}
				};
				_html = '<div class="dwp-table-xxx" style="margin-top:10px">';
				_html += '<div class="dwp-tree-srch-result" style="border:0px;min-height:185px; max-height:185px; overflow-y:auto; overflow-x:hidden;">';
				$dwp.core.util
					.xAjax({
						url: _options.cdb + "/api/data/collections/name/$templete?ps=999&page=0",
						dataType: "json",
						async: false,
						cache: false
					})
					.done(function (data) {
						console.log("data::", data);
						if (data.length > 1) {
							$.each(data, function (i, o) {
								//2020.11.30 signkey 추가
								var _signkey = "";
								if (o.hasOwnProperty("_signkey") && o._signkey != "") {
									_signkey = o._signkey;
								}
								if (o["@unid"] != "") {
									var subCon = o["_subject"];
									subCon = subCon.replace(/&#60;/g, "<").replace(/&#62;/g, ">");
									console.log("subCon::", subCon);
									//_html += "<div class=\"tree-item dwp-cursor\" unid=\"" + o["@unid"] + "\" signkey=\"" + _signkey + "\">" + o["_subject"] + "&nbsp;</div>";
									_html += '<div class="tree-item dwp-cursor" unid="' + o["@unid"] + '" signkey="' + _signkey + '">' + subCon + "&nbsp;</div>";

									console.log("_html-1::", _html);
								}
							});

						} else {
							//2024.09.24
							//_html += '<div class="dwp-orange dwp-center">' + $fn.getCodeMsg("mail.data.cmt04") + "</div>";
							console.log("_html-2::", _html);
						}
					})
					.fail(function () { });

				_html += '<div style="height:0.0625rem;background: var(--1,#E7EBF4)"></div>';
				_html += '<div class="tree-item1 dwp-add-item dwp-blue dwp-bold dwp-cursor" style="margin-left:5px;margin-top:10px;font-size: 0.8125rem;font-style: normal;font-weight: 500;line-height: normal;color: var(--1, #001D35);letter-spacing: -0.01625rem;"> <span><img src="' + $fn.getPath("weblib") + '/images/common/icon-add.svg"> 입력된 내용을 템플릿으로 저장&nbsp;</div>';
				_html += "</div></div>";

				$dwp.ui.qtdialog.init(bobj, {
					qtid: "mail_templateqt",
					height: 200,
					width: "auto",
					dialogClass: "titleless dropdown-type-dialog",
					position: { my: "left top", at: "left bottom", collision: "flipfit" },
					buttons: [],
					content: { url: "", html: _html },
					initcallback: function (_$qtdialog) {
						var _$list = $(".tree-item", _$qtdialog.element);
						// console.log($(".dwp-add-item", _$qtdialog.element).size());
						// console.log($(".dwp-add-item", _$qtdialog.element).css("background"));
						var _$additem = $(".dwp-add-item", _$qtdialog.element);
						_$additem.css("background-url", "");
						_$additem.off("click").on("click", function () {
							_$qtdialog.close();
							_me.template_save(_doc);
						});
						_$list.off("click").on("click", function () {
							var _$this = $(this);
							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm20") }).done(function () {
								changePage(_$this.attr("unid"), _$this.attr("signkey"));
							});
							_$qtdialog.close();
						});

					}
				});
			},

			//템프릿 선택 기존 함수 백업 - 2024.05.14 by dwlee
			template_load_old: function (_doc) {
				console.log("template_load!!!!!");
				var _me = this,
					_options = _doc.options,
					__dlg = null,
					__inst = null,
					_opt = {},
					_sell = "",
					_html = "",
					_param = "";
				_param = _options.ispopup ? "&popup=1" : "";
				var changePage = function (_unid, signkey) {
					console.log("signkey::", signkey);

					if (_options.did != "") {
						console.log("template_load-1!!!");
						__dlg = $("#" + _options.did);
						__dlg.xdialog("instance").close();
						_opt = {
							url: _options.cdb + "/wForward?OpenForm&ParentUNID=" + _unid + "&tmpsignkey=" + signkey + "&inherit=copysend&copybody=1&copyattach=1" + _param
						};
						_$$.mail.com.newMail(_opt);
					} else {
						console.log("template_load-2!!!");
						_options.pathinfo = _options.cdb + "/wForward?OpenForm&ParentUNID=" + _unid + "&tmpsignkey=" + signkey + "&inherit=copysend&copybody=1&copyattach=1" + _param;
						_doc.reload();
					}
				};

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (_obj) {
							_sell = $(".tree-item.active", _obj.element);
							if (_sell.size() == 0) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt28") });
								return;
							}
							if (_sell.size() > 1) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt27") });
								return;
							}
							_obj.close();
							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm20") }).done(function () {
								//선택된 템플릿으로 메일 내용을 변경 하시겠습니까?
								//2020.11.30 signkey 추가
								changePage(_sell.attr("unid"), _sell.attr("signkey"));
							});
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (_obj) {
							_obj.close();
						}
					}
				];
				_html = '<div class="dwp-table-xxx" style="margin-top:10px">';
				_html += '<div class="dwp-tree-srch-result" style="min-height:281px; max-height:281px; overflow-y:auto; overflow-x:hidden;">';
				$dwp.core.util
					.xAjax({
						url: _options.cdb + "/api/data/collections/name/$templete?ps=999&page=0",
						dataType: "json",
						async: false,
						cache: false
					})
					.done(function (data) {
						console.log("data::", data);
						if (data.length > 1) {
							$.each(data, function (i, o) {
								//2020.11.30 signkey 추가
								var _signkey = "";
								if (o.hasOwnProperty("_signkey") && o._signkey != "") {
									_signkey = o._signkey;
								}
								if (o["@unid"] != "") {
									var subCon = o["_subject"];
									subCon = subCon.replace(/&#60;/g, "<").replace(/&#62;/g, ">");
									console.log("subCon::", subCon);
									//_html += "<div class=\"tree-item dwp-cursor\" unid=\"" + o["@unid"] + "\" signkey=\"" + _signkey + "\">" + o["_subject"] + "&nbsp;</div>";
									_html += '<div class="tree-item dwp-cursor" unid="' + o["@unid"] + '" signkey="' + _signkey + '">' + subCon + "&nbsp;</div>";

									console.log("_html-1::", _html);
								}
							});
						} else {
							_html += '<div class="dwp-orange dwp-center" style="padding: 10px;">' + $fn.getCodeMsg("mail.data.cmt04") + "</div>";
							console.log("_html-2::", _html);
						}
					})
					.fail(function () { });
				_html += "</div></div>";

				//				$fn.dialog(null, {
				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.btn.templeteselect"),
					width: 400,
					height: 440,
					dialogClass: "titleless", //제목 타이틀 삭제
					//headclass: "titleless", //제목 타이틀 삭제
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: false,
					buttons: _buttons,
					open: function (_opt) {
						var _this = this;
						_dlg = _opt.target;
						$(".tree-item", _dlg)
							.off("click")
							.on("click", function () {
								$(".tree-item.active", _dlg).removeClass("active");
								$(this).toggleClass("active");
							});
					},
					content: { html: _html }
				});
			},


			/* _$$.mail.doc.template_save  >>  메일 작성화면에서 템플릿으로 저장하기*/
			template_save: function (_doc) {
				var _me = this,
					_options = _doc.options,
					__dlg = null,
					__inst = null,
					_sell = "",
					_html = "",
					__width = $(document).width(),
					__titlebar = null,
					__title = null,
					__close = null,
					__up = null,
					__down = null;

				_$$.mail.doc.org.updateFullField(_doc); //수신인 Full 필드 업데이트

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (_obj) {
							var _hideform = function () {
								if (_options.did != "") {
									__dlg = $("#" + _options.did);
									__inst = __dlg.xdialog("instance");
									__parent = __dlg.parent();
									__titlebar = $(".ui-dialog-titlebar", __parent);
									(__title = $(".ui-dialog-title", __titlebar)), (__close = $(".ui-dialog-titlebar-close", __titlebar));
									$fn.block($("form", __dlg));

									//__parent.css({ width: "300px", top: "5px", left: (__width / 2 - 150) + "px" });
									_$$.mail.com.resizeMailForm(__dlg, "up");

									if ($("#SendProgress", __titlebar).size() == 0) {
										//__title.html(__title.text() + "<span id=\"SendProgress\"> ... <img src=\"/tcclibs/images/common/loading.gif\" style=\"width: 25px;height: 25px;\"></span>");
										__title.html(__title.text() + '<span id="SendProgress"> ... <img src="' + $fn.getPath("weblib") + '/images/common/loading.gif" style="width: 25px;height: 25px;"></span>');
									}
									if ($(".dwp-mail-button-dialog-up", __titlebar).size() == 0) {
										__up = $('<button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only dwp-mail-button-dialog-up"><span class="ui-button-icon ui-icon dialog-up"></span></button>');
										__down = $('<button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only"><span class="ui-button-icon ui-icon dialog-down"></span></button>');
										__close.before(__up);
										__close.before(__down);
										__up.off("click").on("click", function () {
											_$$.mail.com.resizeMailForm(__dlg, "down");
										});
										__down.off("click").on("click", function () {
											_$$.mail.com.resizeMailForm(__dlg, "up");
										});
									}
									__dlg.hide();
								}
							};

							var saveopt = {
								actiontype: "draft",
								docstatus: "draft",
								isnotblock: true, //저장 및 발송할 때 ui-block 처리
								callback: function (_jdata) {
									if (_jdata.hasOwnProperty("result")) {
										if (_jdata.result >= "200" && _jdata.result < "300") {
											if (_jdata.msgcode == "success") {
												$fn.toast({ msg: $fn.getCodeMsg("mail.msg.alt14") });
												if (_doc.options.ispopup == true) {
													$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.alt30") }).done(function () {
														/*메일이 정상적으로 저장 되었습니다*/ $(_doc.element).empty();
														window.close();
													});
												} else if (_doc.options.did != "") {
													__inst.close();
												} else {
													_doc.goview({ type: "", unid: _jdata.unid, viewreload: true });
												}
											} else {
												$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											}
										}
									}
								},
								attacherror: function (_dlg) {
									//첨부파일 전송 에러 (작성화면 원상복구)
									setTimeout(function () {
										if (_options.did != "") {
											__dlg = $(_dlg.element);
											__inst = __dlg.xdialog("instance");
											_$$.mail.com.resizeMailForm(__dlg, "down");
											$fn.unblock($("form", __dlg));
										}
									}, 2000);
								}
							};

							if ($("input[name=newtemplete]", _obj.element).xval() == "1") {
								_obj.close();
								$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm24") }).done(function () {
									//작성중인 메일을 새로운 템플릿으로 저장 하시겠습니까?
									$("form", _doc.element).attr({ action: _options.cdb + "/wFrmMemoProfile?OpenForm&amp;Seq=1&amp;MemoTemplete=1", name: "_wFrmMemoProfile" });
									_hideform();
									_doc.save(saveopt);
								});
							} else {
								_sell = $(".tree-item.active", _obj.element);
								if (_sell.size() == 0) {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt28") });
									return;
								}
								if (_sell.size() > 1) {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt27") });
									return;
								}
								_obj.close();
								$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm25") }).done(function () {
									//선택된 템플릿을 현재 메일로 변경 하시겠습니까?
									$("form", _doc.element).attr({ action: _options.cdb + "/0/" + _sell.attr("unid") + "?EditDocument&amp;Seq=1", name: "_wFrmMemoProfile" });
									_hideform();
									_doc.save(saveopt);
								});
							}
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (_obj) {
							_obj.close();
						}
					}
				];
				_html = '<div class="dwp-table-templete">';
				_html += '<div class="dwp-tree-srch-result" style="min-height:255px; max-height:255px; overflow-y:auto; overflow-x:hidden;">';
				$dwp.core.util
					.xAjax({
						url: _options.cdb + "/api/data/collections/name/$templete?ps=999&page=0",
						dataType: "json",
						async: false,
						cache: false
					})
					.done(function (data) {
						console.log("data.length::", data.length);
						if (data.length > 1) {
							$.each(data, function (i, o) {
								if (o["@unid"] != "") {
									_html += '<div class="tree-item dwp-cursor" unid="' + o["@unid"] + '">' + o["_subject"] + "&nbsp;</div>";
									console.log("_html::", _html);
								}
							});
						} else {
							_html += '<div class="dwp-orange dwp-center" style="padding: 10px;">' + $fn.getCodeMsg("mail.data.cmt04") + "</div>";
						}
					})
					.fail(function () { });
				console.log("여기?::");
				_html += "</div></div>";
				_html += '<div class="dwp-checkbox" style="margin-top:10px;"><label><input name="newtemplete" type="checkbox" value="1"><span>' + $fn.getCodeMsg("mail.data.newtemplete") + "</span></label></div>";

				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.btn.templetesave"),
					width: 400,
					height: 440,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: false,
					buttons: _buttons,
					open: function (_opt) {
						var _this = this;
						_dlg = _opt.target;
						$(".tree-item", _dlg)
							.off("click")
							.on("click", function () {
								$(".tree-item.active", _dlg).removeClass("active");
								$(this).toggleClass("active");
							});
						$("input[name=newtemplete]", _dlg)
							.off("click")
							.on("click", function () {
								//console.log("this.xval()", $(this).xval())
								//if ($(this).xval() == "1") {
								//	$fn.block($(".dwp-table-templete", _dlg), {notusemsg : true})
								//} else {
								//	$fn.unblock($(".dwp-table-templete", _dlg))
								//}
							});
					},
					content: { html: _html }
				});
			},

			/* _$$.mail.doc.fromAddEvent  >>  외부 수신메일의 발신인 정보에 클릭 이벤트 추가*/
			fromAddEvent: function (_doc) {
				var _me = this,
					_ele = _doc.element,
					_from = $(".profile-info.mail-sender", _ele),
					item = { type: "S", notesid: "", orgcode: "" },
					_dspname = "";
				if (_from.size() != 1) return;
				_dspname = $.trim(_from.text());
				if (_dspname.indexOf("@") == -1) return; //외부메일주소가 아니면 pass
				_from.parent().off("click");
				_from.off("click").on("click", function () {
					item.notesid = _dspname;
					if (_dspname.indexOf("<") != -1) {
						_dspname = _$$.mail.com
							.strMiddle(_dspname, "<", ">")
							.replace(/\&lt\;/gi, "<")
							.replace(/\gt\;/gi, ">");
					}

					$dwp.ui.qtdialog.init($(this), {
						qtid: "mail_user_info",
						title: _dspname,
						initcallback: function (_$qtdialog) {
							var _div = $(".mail_user_info", _$qtdialog.element),
								_btn = null;
							_btn = $('<div class="dwp-cursor">' + $fn.getCodeMsg("mail.btn.mailcreate") + "</div>").appendTo(_div); //메일쓰기
							_btn.off("click").on("click", function () {
								_$$.mail.doc.doc_SelectSendmail(item, _ele);
								_$qtdialog.close();
							});
							if (item.type == "S") {
								if (item.notesid.indexOf("@") != -1) {
									_btn = $('<div class="dwp-cursor" style="margin-top:8px;">' + $fn.getCodeMsg("mail.btn.addaddress") + "</div>").appendTo(_div); //주소록 등록
									_btn.off("click").on("click", function () {
										_$$.mail.doc.doc_addAddress(item, _ele);
										_$qtdialog.close();
									});
								}
							}
						},
						buttons: [],
						content: { url: "", html: '<div class="mail_user_info"></div>' }
					});
				});
			},

			/* _$$.mail.doc.receiveListCheck  >>  메일 발송 및 저장 전에 발송 불가능한 부서여부 체크하기*/
			receiveListCheck: function (_doc) {
				var _me = this,
					_check = false,
					_data = {},
					_zsub = $dwp.core.info.sysinfo.zsub || "40",
					_deptlist = "";
				var getDeptData = function () {
					var fields = ["SendToFull", "CopyToFull", "BlindCopyToFull"],
						_deptorg = "",
						_val = "",
						_arr = [],
						_rtn = "";
					$.each(fields, function (i, n) {
						_val = $("[name='" + n + "']", _doc.element).xval();
						if (_val != "") {
							_arr = _val.split(";");
							$.each(_arr, function (ii, dd) {
								//if (dd.charAt(0) == "B" || dd.charAt(0) == "G") {
								if (dd.charAt(0) == "B") {
									_rtn += (_rtn != "" ? ";" : "") + dd;
								}
							});
						}
					});
					return _rtn;
				};
				_deptlist = getDeptData();
				if (_deptlist == "") return false;
				_data = $dwp.ui.org.data.deptCheck({ orgdata: _deptlist, zsub: _zsub });

				if (_data.cnt > "0") {
					_check = true;
					$fn.alert({ msg: $fn.getCodeMsg("mail.data.cmt08") + "<br><br>" + $fn.getCurLangMsg(_data.rtnname, ", ") }); //다음은 발송 불가능 리스트입니다.<br>수신인 리스트에서 삭제 후 다시 시도하십시오.
				}
				return _check;
			},

			/* _$$.mail.doc.validateCheck  >>  메일 저장 및 발송전 필드체크*/
			validateCheck: function (__me) {
				var _instance = __me,
					__doc = __me.element,
					_SendOptions = $("input[name=SendOptions]", __me.element).xval(),
					_tmp = "",
					_date = "",
					_h = "",
					_m = "",
					_servertime = null,
					_schetime = null,
					_$nametarget = null,
					_$sub = null,
					_$check = false;

				if (_$$.mail.com.CONST.SEND_IMPOSSIBLE.length != 0) {
					if ($.inArray($dwp.core.info.cuser.abnotesid, _$$.mail.com.CONST.SEND_IMPOSSIBLE) != -1) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err33") }); //메일 발신이 제한된 아이디 입니다. 지역 인사지원팀에 문의하시길 바랍니다
						return false;
					}
					if ($.inArray($dwp.core.info.cuser.pinfo.orgcode, _$$.mail.com.CONST.SEND_IMPOSSIBLE) != -1) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err33") }); //메일 발신이 제한된 아이디 입니다. 지역 인사지원팀에 문의하시길 바랍니다
						return false;
					}
				}

				/*  용량사이즈 체크 막음
				$fn.cmdPostEx({
					url : $fn.getProxyUrl(_instance.options.cdb + "/wcmdpost?openform"),
					async : false,
					dataType: "json",
					data : {actiontype : "mailcount", arg1 : "alldoc"},
					success : function(data, textStatus) {
						var currentSize = (("0"+$.trim(data.alldoc)) * 1) / 1024 / 1024, usermailsize = 3000;
						if (typeof($dwp.core.info.cuser.pinfo.usermailsize) != "undefined") usermailsize = $dwp.core.info.cuser.pinfo.usermailsize;
						if (parseInt(usermailsize, 10) < currentSize) {
							_$check = true;
						}
					}
				});
				*/

				if (_$check == true) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err32") }); //현재 메일용량이 초과되어 발신이 제한되었습니다.<br>메일함(수신/발신/폐기/영구보관함) 정리 후, 다시 시도하시길 바랍니다.
					return false;
				}

				if (_SendOptions == "3") {
					//임시저장
					if ($.trim($("input[name=Subject]", __doc).xval()) == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err13") });
						return false;
					} /*제목을 입력하십시요.*/
				} else if (_SendOptions == "2") {
					//발송

					if ($.trim($("textarea[name=SendTo]", __doc).xval()) == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err12") });
						return false;
					} /*수신인을 지정하십시요.*/
					if ($.trim($("input[name=Subject]", __doc).xval()) == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err13") });
						return false;
					} /*제목을 입력하십시요.*/

					_$nametarget = $(".target.namepicker-target", __doc);
					if (_$nametarget.size() > _$$.mail.com.CONST.MAXCOUNT) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err30").replace(/\{\$1\}/g, _$$.mail.com.CONST.MAXCOUNT) }); //최대 [ " + _gridinfo.count + " ]명 까지 선택가능합니다.
						return false;
					}

					$.each(_$nametarget, function (i, o) {
						_$sub = $(o).data("data-org");
						if ($.inArray(_$sub.key, _$$.mail.com.CONST.ADD_IMPOSSIBLE) != -1) {
							var _org = new $dwp.ui.org.data.org(_$sub);
							$fn.alert({ msg: "[ " + _org.getDispName() + " ] " + $fn.getCodeMsg("mail.msg.err31") }); //[ 이름... ] 수신인으로 추가할 수 없습니다
							_$check = true;
							return false;
						}
					});
					if (_$check == true) {
						return false;
					}

					_tmp = $.trim($("input[name=ReserveMail]", __doc).xval());
					if (_tmp == "1") {
						//예약메일 발송할 경우
						if ($("input[name=send_me]", __doc).is(":checked")) {
							//내게쓰기 선택한 경우 예약발송 안되게
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err24") });
							return false; /*내게쓰기 메일은 예약발송 할 수 없습니다*/
						}
						_date = $.trim($("input[name=ReserveDate]", __doc).xval());
						_h = $.trim($("select[name=ReserveHour]", __doc).xval());
						_m = $.trim($("select[name=ReserveMinute]", __doc).xval());
						if (_date == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err14") });
							return false;
						} /*예약일자를 지정하십시요.*/
						if (_h == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err15") });
							return false;
						} /*예약시간을 지정하십시요.*/
						if (_m == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err15") });
							return false;
						} /*예약시간을 지정하십시요.*/

						$fn.cmdPostEx({
							url: $fn.getProxyUrl($fn.getPath("gwlib") + "/wServerInfo?readform"),
							async: false,
							dataType: "json",
							success: function (data, textStatus) {
								if (data.hasOwnProperty("now")) {
									_servertime = new Date(data["now"]);
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err17") });
									return false; /*예약발송에 필요한 서버시간을 확인할 수 없습니다. 관리자에게 문의하세요.*/
								}
							}
						});
						_schetime = new Date(_date + " " + _h + ":" + _m + ":00");
						if (_servertime.format("isoDateTime") >= _schetime.format("isoDateTime")) {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err16") + "<br><br>" + _servertime.toLocaleTimeString() }); /*예약시간을 현재 시간 이후로 지정하십시요.*/
							return false;
						}
						// return true; //체크 결과 정상이면 True 값을 Return
					}
					// 보안메일을 선택한 경우 (jwlee)
					_tmp = $.trim($("input[name=SecureMail]", __doc).xval());
					if (_tmp == "1") {
						//예약메일 발송할 경우
						var _resv = $.trim($("input[name=ReserveMail]", __doc).xval());
						if (_resv == "1") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt32") }); // 보안메일은 예약발송할 수 없습니다
							return false;
						}

						// 첨부파일 체크
						var _att = $(".data_record", __doc);
						if ($(_att).size() > 0) {
							var _attData = __me.attach_obj.getFileData();
							var _chkUnableFiles = [];
							$.each(_attData, function (i, v) {
								if (!v.isnew) _chkUnableFiles.push(v); // 저장된 첨부
								else if (!v.ismega) _chkUnableFiles.push(v); // 일반 첨부
							});

							if ($(_chkUnableFiles).size() > 0) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt33") }); // 보안메일은 일반 첨부파일을 첨부할 수 없습니다.<br><br>대용량 첨부로 변경해서 첨부해주세요
								return false;
							}
						}

						// 패스워드 체크
						var _pw = $.trim($("input[name='SecurePW']", __doc).xval());
						var _pw2 = $.trim($("input[name='SecurePWConfirm']", __doc).xval());

						if (_pw == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt34") }).done(function () {
								// 보안메일을 열수 있는 암호를 입력하세요.
								$("input[name='SecurePW']", __doc).focus();
							});
							return false;
						}
						if (_pw2 == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt35") }).done(function () {
								//  보안메일을 열수 있는 암호를 한번더 입력하세요.
								$("input[name='SecurePWConfirm']", __doc).focus();
							});
							return false;
						}
						if (_pw != _pw2) {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt36") }).done(function () {
								//  보안메일 암호가 일치하지 않습니다.
								$("input[name='SecurePW']", __doc).focus();
							});
							return false;
						}
					}
				} else {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
					return false;
				}
				return true;
			},

			/*############################################################################*/

			/* _$$.mail.doc.replyforward  >>  회신, 전체회신, 전달, 추가발송 버튼 */
			replyforward: function (doc, obj) {
				var _me = this,
					_option = doc.options,
					_opt = {},
					_form = "",
					_obj = $.extend({ type: "", body: "", attach: "", ismobile: false }, obj),
					_attach = "";
				switch (_obj.type) {
					case "allreply":
					case "reply": //전체회신, 회신
						_form = "Reply"; // "Reply With History";		//http://hkdev1.hankooktire.com/mail/asis/defaultmailko.nsf/Reply?OpenForm&ParentUNID=9C64DC54E9DAD14749258050001759B9
						break;
					case "forward": //전달, 추가발송
						_form = "wForward";
						break;
				}
				if (_obj.type == "copysend") {
					//추가발송 (복사해서 수신/참조 똑같이 해서 발송)
					if (_option.isresponsedoc == "1") {
						//발송했던 메일이 회신 메일이면.. 회신양식으로 다시 발송
						_form = "Reply";
					} else {
						_form = "wForward";
					}
					//발신자에게 메일 쓰기 - 2020.06.15 by dwlee
				} else if (_obj.type == "fromcopy") {
					_form = "Memo";
				}
				_attach = _obj.attach == "0" ? "&InheritParent=23" : ""; //첨부파일 제외 URL
				_opt = {
					url: _option.cdb + "/" + _form + "?OpenForm&ParentUNID=" + _option.unid + _attach + "&inherit=" + _obj.type + "&copybody=" + _obj.body + "&copyattach=" + _obj.attach
				};
				if (_obj.ismobile == true) {
					_opt.link = _option.cdb + "/" + _form + "_mo?OpenForm&ParentUNID=" + _option.unid + _attach + "&inherit=" + _obj.type + "&copybody=" + _obj.body + "&copyattach=" + _obj.attach;
				}

				_$$.mail.com.newMail(_opt);
			},
			// 차이니스월 교보임시
			chineseWall: function (doc) {
				var _me = this,
					_check = false;

				$fn.cmdPostEx({
					url: $fn.getProxyUrl("/dwp/com/sys/w3706.nsf/wcmdpost_cwall?openform"),
					async: false,
					dataType: "json",
					data: {
						SenderFullOrgCode: $fn.getCurUser().pinfo.fullorgcode.replace(/,/g, ";"),
						SendTo: $("[name=SendToFull]", _doc.element).xval(),
						CopyTo: $("[name=CopyToFull]", _doc.element).xval(),
						BlindCopyTo: $("[name=BlindCopyToFull]", _doc.element).xval()
					}
				}).done(function (jdata) {
					console.log(jdata);
				});

				return _check;
			},

			/* _$$.mail.doc.mailsend  >>  발송 버튼 */
			mailsend: function (doc) {
				var _options = doc.options,
					__dlg = null,
					__parent = null,
					__inst = null,
					saveopt = {},
					__width = $(document).width(),
					__titlebar = null,
					__title = null,
					__close = null,
					__up = null,
					__down = null;
				$("input[name=SendOptions]", doc.element).xval("2");

				/*
				_$$.mail.doc.org.updateFullField(doc);												//수신인 Full 필드 업데이트

				if (_$$.mail.doc.receiveListCheck(doc) == true) return;								//발송 불가능 부서 체크

				if (_$$.mail.doc.validateCheck(doc) == false) return;




				*/
				$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm09") }).done(function () {
					/*메일을 발송 하시겠습니까?*/
					_$$.mail.doc.org.updateFullField(doc); //수신인 Full 필드 업데이트

					// 교보임시테스트용 추후 삭제필요
					// if (_$$.mail.doc.chineseWall(doc) == true) return;

					if (_$$.mail.doc.receiveListCheck(doc) == true) return; //발송 불가능 부서 체크

					if (_$$.mail.doc.validateCheck(doc) == false) return; //필수 입력항목 체크

					var _isnotblock = false;
					if (_options.did != "") {
						__dlg = $("#" + _options.did);
						__inst = __dlg.xdialog("instance");
						__parent = __dlg.parent();
						__titlebar = $(".ui-dialog-titlebar", __parent);
						(__title = $(".ui-dialog-title", __titlebar)), (__close = $(".ui-dialog-titlebar-close", __titlebar));
						$fn.block($("form", __dlg));

						/* 2025-01-03 SynaEditor Editor Dom Error  발송시 숨기지 않음 */
						//_$$.mail.com.resizeMailForm(__dlg, "up");
						/* 2025-01-03 SynaEditor Editor Dom Error  발송시 숨기지 않음
						if ($("#SendProgress", __titlebar).size() == 0) {
							//__title.html(__title.text() + "<span id=\"SendProgress\"> ... <img src=\"/tcclibs/images/common/loading.gif\" style=\"width: 25px;height: 25px;\"></span>");
							__title.html(__title.text() + '<span id="SendProgress"> ... <img src="' + $fn.getPath("weblib") + '/images/common/loading.gif" style="width: 25px;height: 25px;"></span>');
						}
						*/

						/*
						if ($(".dwp-mail-button-dialog-up", __titlebar).size() == 0) {
							__up = $("<button type=\"button\" class=\"ui-button ui-corner-all ui-widget ui-button-icon-only dwp-mail-button-dialog-up\"><span class=\"ui-button-icon ui-icon dialog-up\"></span></button>");
							__down = $("<button type=\"button\" class=\"ui-button ui-corner-all ui-widget ui-button-icon-only\"><span class=\"ui-button-icon ui-icon dialog-down\"></span></button>");
							__close.before(__up);
							__close.before(__down);
							__up.off("click").on("click", function() { _$$.mail.com.resizeMailForm(__dlg, "down"); })
							__down.off("click").on("click", function() { _$$.mail.com.resizeMailForm(__dlg, "up"); })
						}
						*/

						// __dlg.hide(); 2025-01-03 SynaEditor Editor Dom Error  발송시 숨기지 않음
						_isnotblock = true;
					}

					var sendto = $.trim($("textarea[name=SendToFull]", doc.element).xval()) + ";";
					sendto += $.trim($("textarea[name=CopyToFull]", doc.element).xval()) + ";";
					sendto += $.trim($("textarea[name=BlindCopyToFull]", doc.element).xval());

					$fn.cmdPostEx({
						url: $fn.getProxyUrl(doc.options.cdb + "/wcmdpost?openform"), //최근 수신인 정보 업데이트
						async: false,
						dataType: "json",
						data: { actiontype: "lastsendto_update", arg1: sendto },
						success: function (data, textStatus) {
							//console.log("수신인 업데이트 결과", data);
						}
					});

					// 카드메일 발송 - 2019-03-18 By lhj add
					if (doc.options.hasOwnProperty("iscardmail") && doc.options.iscardmail != "") {
						//본문을 재설정하기
						var _$card = $("div[name=_CARD_AREA]", doc.element);
						if (_$card.size() > 0) {
							var _$dsp = $("div[name=_CARD_BODY]", doc.element);
							_$dsp.html($dwp.ui.weditor.getBodyValue(doc.element));

							$dwp.ui.weditor.setHtmlValue(_$card.html(), doc.element);
						}
					}

					//외부 메일주소 있는지 확인 - 2024.01.22 by dwlee
					function hasOutReceiver(sendto) {
						var _rtn = false;
						var _toarr = sendto.split(";");
						var _maildomains = $("input[name='maildomains']", doc.element).xval();
						var _domarr = _maildomains.split(";");
						$.each(_toarr, function (idx, _to) {
							if (_to != "") {
								var _org = new $dwp.ui.org.data.org(_to);
								if (_org.oinfo.type == "S") {
									var _id = _org.oinfo.notesid;

									console.log("_id : ", _id);
									if (_id != "" && _id.indexOf("@") > 0) {
										var _domain = _id.substring(_id.indexOf("@") + 1, _id.length);
										_domain = _domain.replace(/>/gi, "");
										console.log("_domarr : ", _domarr);
										console.log("_domain : ", _domain);

										console.log($.inArray(_domain.toLowerCase(), _domarr));

										if ($.inArray(_domain.toLowerCase(), _domarr) < 0) {
											_rtn = true;
											return;
										}
									}
								}
							}
						});
						return _rtn;
					}

					saveopt = {
						actiontype: "save",
						docstatus: "reg",
						//isnotblock : true,				//저장 및 발송할 때 ui-block 처리하지 않음
						isnotblock: _isnotblock, //SH Global은 윈도우 팝업 방식이라 Bock 처리되도록 수정 - 2017.11.27 by dwlee
						callback: function (_jdata) {
							if (_jdata.hasOwnProperty("result")) {
								if (_jdata.result >= "200" && _jdata.result < "300") {
									if (_jdata.msgcode == "success") {
										$fn.toast({ msg: $fn.getCodeMsg("mail.msg.alt15") });

										//지앤지넷 디자인 - 포탈에서 작성창 열어서 저장하는 경우 보낸 편지함 이동 - 2025.08.05 by dwlee
										if (doc.options.pathinfo.indexOf("isportal=1") > 0 && doc.options.ismobile == true) {
											$dwp.core.mportal.loadPage({ link : "{mail}/wFrmView_mo?ReadForm&view=($setnt)", linktype : "PAGE", layer : "view", subtype : "read"} );
										}

										if (doc.options.ispopup == true) {
											/*
											$fn.confirm({msg : $fn.getCodeMsg("mail.msg.alt29")}).done( function() {		//메일이 정상적으로 발송 되었습니다
												$(doc.element).empty();
												window.close();
											});
											 */
											//메일이 발송된 후 확인 버튼을 클릭하지 않기 위해서 변경 - 2017.11.27 by dwlee
											//toast 에서 callback 함수 추가됨.
											$(doc.element).empty();
											$fn.toast({
												msg: $fn.getCodeMsg("mail.msg.alt15"),
												callback: function () {
													window.close();
												}
											});
										} else if (doc.options.did != "") {
											__inst.close();
										} else {
											doc.goview({ type: "", unid: _jdata.unid, viewreload: true });
										}
									} else {
										$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
									}
								} else if (_jdata.result == "444") {
									//발송할 수 없는 경우 서버에 임시저장후 편집으로 열어준다

									if (_jdata.rtnname != "") {
										$fn.alert({ msg: $fn.getCodeMsg("mail.data.cmt08") + "<br><br>[ " + $fn.getCurLangMsg(_jdata.rtnname, ", ") + " ]" }); //다음은 발송 불가능 리스트입니다.<br>수신인 리스트에서 삭제 후 다시 시도하십시오.
									}
									__inst.close();

									var _opt = {
										url: _options.cdb + "/0/" + _jdata.unid + "?EditDocument"
									};
									_$$.mail.com.newMail(_opt);
								} else {
									if (_jdata.msgcode.indexOf(".") != -1) {
										$fn.alert({ msg: $fn.getCodeMsg(_jdata.msgcode) });
									} else {
										$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
									}
									if (_options.did != "") {
										__dlg = $("#" + _options.did);
										_$$.mail.com.resizeMailForm(__dlg, "down");
										$fn.unblock($("form", __dlg));
									}
								}
							}
						},
						attacherror: function (_dlg) {
							//첨부파일 전송 에러 (작성화면 원상복구)
							setTimeout(function () {
								if (_options.did != "") {
									__dlg = $(_dlg.element);
									__inst = __dlg.xdialog("instance");
									_$$.mail.com.resizeMailForm(__dlg, "down");
									$fn.unblock($("form", __dlg));
								}
							}, 500);
						},
						megacallback: function (mega, __doc) {
							return _$$.mail.com.megaAttachGetHtml(mega, __doc);
						},

						//모바일 회신시 원본내용 리턴 - 2017.11.24 by dwlee
						appendbody: function (__doc) {
							var _$parbody = $("#par_body", __doc.element); //모바일에만 있는 영역
							if (_$parbody.size() == 1) {
								//console.log("==========================");
								//console.log(_$parbody.html());
								//console.log("==========================");

								return _$parbody.html();
							} else {
								return "";
							}
						}
					};
					// 보안메일 본문구성 (jwlee)
					if ($.trim($("input[name=SecureMail]", doc.element).xval()) == "1") {
						var _unid = doc.options.secureoption.split("^")[1];
						var _saveFun = function (_bodyHTML) {
							var _pw = $.trim($("input[name='SecurePW']", doc.element).xval());
							_bodyHTML = _bodyHTML.replace(/\$\$CRYPTO_PASSWORD\$\$/gi, _pw);

							saveopt.setBodyAfterChange = function (_o) {
								var _deferred = $.Deferred();

								$dwp.ui.weditor.getSecurMailBodyValue(doc.element, function (bodyVal, cover) {
									var _bodyValue = "<!-- $SECURE_MAIL_BODY$ -->" + bodyVal;
									$("#SecureBody", $("form", doc.element)).val(_bodyValue);

									$dwp.ui.weditor.setHtmlValue(_bodyHTML, doc.element);

									_deferred.resolve();
								});
								return _deferred;
							};

							var _$drm = $("input[name='drm_apply']", doc.element);
							_$drm.xval("0");
							//외부 수신자가 있는 상황이면 - 2024.01.22 by dwlee
							//if ($fn.getSysinfo().usedrm == "Y" && hasOutReceiver(sendto) == true) {
							if ($fn.getSysinfo().usedrm == "Y") {
								if (_$drm.size() > 0) _$drm.xval("1");
							}
							doc.save(saveopt);
						};
						if (_unid != "") {
							var _url = $dwp.core.util.getProxyUrl("/dwp/com/sys/sys_mn.nsf/0/" + _unid + "/SecureBody?OpenField");

							$dwp.core.util
								.xAjax({
									cache: false,
									async: true,
									dataType: "html",
									url: _url
								})
								.done(function (data) {
									_saveFun(data);
								})
								.fail(function () {
									$fn.alert({ msg: "보안메일의 설정내용을 찾을 수 없습니다.<br>관리자에게 문의하세요" });
								});
						} else {
							$fn.alert({ msg: "보안메일의 설정내용을 찾을 수 없습니다.<br>관리자에게 문의하세요" });
						}
						return;
					} else {
						var _$drm = $("input[name='drm_apply']", doc.element);

						_$drm.xval("0");
						//외부 수신자가 있는 상황이면 - 2024.01.22 by dwlee
						//if ($fn.getSysinfo().usedrm == "Y" && hasOutReceiver(sendto) == true) {
						if ($fn.getSysinfo().usedrm == "Y") {
							if (_$drm.size() > 0) _$drm.xval("1");
						}
						doc.save(saveopt);
					}
				});
			},

			/* _$$.mail.doc.mailsave  >> 임시저장 버튼 */
			mailsave: function (doc) {
				//debugger;
				var _options = doc.options,
					__dlg = null,
					__parent = null,
					__inst = null,
					saveopt = {},
					__width = $(document).width(),
					__titlebar = null,
					__title = null,
					__close = null,
					__up = null,
					__down = null;
				$("input[name=SendOptions]", doc.element).xval("3");

				//if (typeof(doc.attach_obj) == "object") {	- 2019-03-18 by lhj modify
				if (doc.attach_obj != null) {
					if (doc.attach_obj.isMegaAttach() == true) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err34") }); //대용량 첨부파일은 임시저장할 수 없습니다
						return;
					}
				}

				_$$.mail.doc.org.updateFullField(doc); //수신인 Full 필드 업데이트

				if (_$$.mail.doc.receiveListCheck(doc) == true) return; //발송 불가능 부서 체크

				if (_options.did != "") {
					__dlg = $("#" + _options.did);
					__inst = __dlg.xdialog("instance");
					__parent = __dlg.parent();
					__titlebar = $(".ui-dialog-titlebar", __parent);
					(__title = $(".ui-dialog-title", __titlebar)), (__close = $(".ui-dialog-titlebar-close", __titlebar));
					$fn.block($("form", __dlg));

					//__parent.css({ width: "300px", top: "5px", left: (__width / 2 - 150) + "px" });
					_$$.mail.com.resizeMailForm(__dlg, "down"); //BN 수정 > 임시저장 후 edit로 열어주도록 변경 : UP->DOWN으로 변경. 다이얼로그를 말아올리지 않음.

					if ($("#SendProgress", __titlebar).size() == 0) {
						//__title.html(__title.text() + "<span id=\"SendProgress\"> ... <img src=\"/tcclibs/images/common/loading.gif\" style=\"width: 25px;height: 25px;\"></span>");
						__title.html(__title.text() + '<span id="SendProgress"> ... <img src="' + $fn.getPath("weblib") + '/images/common/loading.gif" style="width: 25px;height: 25px;"></span>');
					}
					if ($(".dwp-mail-button-dialog-up", __titlebar).size() == 0) {
						__up = $('<button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only dwp-mail-button-dialog-up"><span class="ui-button-icon ui-icon dialog-up"></span></button>');
						__down = $('<button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only"><span class="ui-button-icon ui-icon dialog-down"></span></button>');
						__close.before(__up);
						__close.before(__down);
						__up.off("click").on("click", function () {
							_$$.mail.com.resizeMailForm(__dlg, "down");
						});
						__down.off("click").on("click", function () {
							_$$.mail.com.resizeMailForm(__dlg, "up");
						});
					}
					__dlg.hide();
				}

				saveopt = {
					actiontype: "draft",
					docstatus: "draft",
					isnotblock: true, //저장 및 발송할 때 ui-block 처리하지 않음
					callback: function (_jdata) {
						if (_jdata.hasOwnProperty("result")) {
							if (_jdata.result >= "200" && _jdata.result < "300") {
								if (_jdata.msgcode == "success") {
									$fn.toast({ msg: $fn.getCodeMsg("mail.msg.alt14") });
									if (doc.options.ispopup == true) {
										$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.alt30") }).done(function () {
											/*메일이 정상적으로 저장 되었습니다*/ $(doc.element).empty();
											window.close();
										});
									} else if (doc.options.did != "") {
										__inst.close();
									} else {
										doc.goview({ type: "", unid: _jdata.unid, viewreload: true });
									}
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								}
							}
						}
					},
					attacherror: function (_dlg) {
						//첨부파일 전송 에러 (작성화면 원상복구)
						setTimeout(function () {
							if (_options.did != "") {
								__dlg = $(_dlg.element);
								__inst = __dlg.xdialog("instance");
								_$$.mail.com.resizeMailForm(__dlg, "down");
								$fn.unblock($("form", __dlg));
							}
						}, 2000);
					}
					/*	// 임시저장 할 때는 대용량 파일 첨부하지 않도록...
					megacallback : function(mega, __doc) {
						return _$$.mail.com.megaAttachGetHtml(mega, __doc);
					}
					 */
				};
				doc.save(saveopt);
			},

			/* _$$.mail.doc.doc_rule  >>  메일 조회 화면에서 규칙 설정 (현재 메일의 발신인, 제목을 기본으로 적용)*/
			doc_rule: function (doc) {
				var _me = this,
					_opt = {},
					_options = doc.options,
					_el = doc.element,
					_unids = _options.unid;
				var _data = {
					init_callback: function (inst) {
						//console.log("다이얼로그 로딩 이후 추가 Action... inst >> ", inst)
					},
					save_callback: function (obj, _obj, data) {
						//규칙설정 이후 dialog 닫고... 보기로 이동
						obj.close();
						doc.goview();
					}
				};
				var callback = function (obj, data) {
					if (data.selmailinfo == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt11") }); //선택 메일의 정보를 찾을 수 없습니다.
						return;
					}
					_$$.mail.mng.rules_edit(doc, $.extend(data, _data)); //규칙설정 dialog open
				};
				_$$.mail.com.cmdpost({ actiontype: "seldoc_get_rulesetinfo", postdata: _unids }, callback);
			},

			/* _$$.mail.doc._act_spam_rule_callback >> doc_spam_rule  > function에서 callback 호출 (열람중인 메일의 스팸/규칙 설정)*/
			_act_spam_rule_mobile_callback: function (doc, opt) {
				var _folderunid = "",
					_pdata = {};

				$fn.cmdPostEx({
					url: $fn.getProxyUrl(doc.options.cdb + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: { actiontype: "dblookup", arg3: "($FolderInfo)", arg4: "JunkMail", arg6: "1" },
					success: function (data, textStatus) {
						if (data.cnt == "0") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
							return; //작업을 완료 할 수 없습니다
						}
						_folderunid = data.rtnval;
					}
				});
				_pdata = {
					WQS_Agent: "wAgtCmdProcess",
					/*actiontype : "new_rule_movedoc",*/
					actiontype: "new_rule",
					postdata: opt.postdata,
					Arg1: "1",
					/*사용유무*/
					Arg2: "Sender",
					/*조건설정 (발신자명/주소, 제목)*/
					Arg3: "1",
					/*다음을 포함 (1), 다음과 같음 (2)*/
					Arg4: "mailaddress",
					/*조건설정 (메일주소, 사용자선택)*/
					Arg5: opt.domain,
					/*검색 문자열*/
					Arg6: "",
					/*사용자 NotesID*/
					Arg7: "",
					/*사용자 Org Data*/
					Arg8: "junk",
					/*처리방법 (영구보관함으로 이동, 스펨메일함으로 이동, 삭제(휴지통)*/
					Arg9: "($JunkMail)",
					/*forder name*/
					Arg10: _folderunid,
					/*folder unid*/
					Arg11: "",
					/*편집중인 규칙문서 UNID*/
					Arg12: opt.postdata,
					/*등록하는 규칙 정보와 일치하는 문서가 있을 경우 즉시 폴더로 이동한다 (대상문서의 UNID)*/
					Arg13: "" /*현재 보기명*/
				};

				var callback = function (_obj, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							var altmsg = "";
							if (data.hasOwnProperty("cnt")) {
								altmsg += "[ " + data["cnt"] + " ] " + $fn.getCodeMsg("mail.msg.alt07") + "<br>";
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return; //작업을 완료 할 수 없습니다
							}
							if (data.hasOwnProperty("movecnt")) {
								altmsg += "[ " + data["movecnt"] + " ] " + $fn.getCodeMsg("mail.msg.alt08") + "<br>";
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return; //작업을 완료 할 수 없습니다
							}
							$fn.alert({ msg: altmsg }).done(function () {
								$fn.lnbCountRefresh();
								if (opt.ismobile == true) {
									doc.goview({ viewreload: true });
								} else {
									doc.goview();
								}
							});
						}
					}
				};
				_$$.mail.com.cmdpost(_pdata, callback);
			},

			/* _$$.mail.doc.doc_spam_rule >> 현재 조회중인 문서의 스팸/규칙 등록하고 즉시 선택된 메일을 폴더(스팸)로 이동 */
			doc_spam_rule: function (doc, opt) {
				var _me = this,
					_unids = doc.options.unid;
				var opt = opt || {},
					_opt = $.extend({ ismobile: false }, opt);

				var callback = function (obj, data) {
					if (data.rcnt == "0") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt06") }); //등록 가능한 메일 외부 도메인 정보가 없습니다.
						return;
					}
					if (_opt.ismobile == true) {
						_me._act_spam_rule_mobile_callback(doc, $.extend(obj, _opt, data)); //모바일에서 스팸처리
					} else {
						//모바일용 기능 개발로 PC 부분에 동일한 기능이 필요하다면... 여기서 추가해야 함
						//_me._act_spam_rule_callback(doc, $.extend(obj, data));						//PC 화면에서 규칙처리
					}
				};
				_$$.mail.com.cmdpost({ actiontype: "seldoc_get_domain", postdata: _unids }, callback);
			},

			doc_movetofolder: function (doc, opt) {
				var _me = this,
					_opt = {},
					_options = doc.options,
					_el = doc.element,
					opt = opt || {},
					_opt = $.extend({ ismobile: false }, opt),
					_curview = "";
				_curview = _options.foldername != "" ? _options.foldername : _options.viewalias;

				var __callback = function (obj) {
					var _sel = $("select[name=CurrentFolders]", obj.element).xval();
					if (_sel == "root" || _sel == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
						return;
					}

					//받은 편지함으로 이동 - 2023.06.21 by dwlee
					if (_curview.indexOf("($inbox") > -1) {
						_curview = "($inbox)";
					}

					//같은 폴더로 이동하는 경우 - 2023.06.21 by dwlee
					if (_sel == _curview) {
						// "선택하신 메일함은 현재의 메일함과 동일합니다."
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err38") });
						return;
					}

					var callback = function (_obj, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.hasOwnProperty("cnt")) {
									obj.close();
									if (_opt.ismobile == true) {
										doc.goview({ viewreload: true });

										//좌측 카운트 리프레쉬 - 2017.10.27 by dwlee
										_$$.mail.com.update_left_count();
									} else {
										if (doc.options.did != "") {
											var __dlg = $("#" + doc.options.did).xdialog("instance");

											//좌측 카운트 리프레쉬 - 2017.10.27 by dwlee
											_$$.mail.com.update_left_count();

											__dlg.close();
										} else {
											//좌측 카운트 리프레쉬 - 2017.10.27 by dwlee
											_$$.mail.com.update_left_count();

											doc.goview();
										}
									}
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
									return;
								}
							}
						}
					};

					_$$.mail.com.cmdpost({ actiontype: "movefolder", postdata: _options.unid, Arg1: _sel, Arg2: _curview }, callback);
				};

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							__callback(obj);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
					/*
					{
						title: $fn.getCodeMsg("mail.btn.mailbox"),
						click: function (obj) {
							__callback(obj, "M");
						}
					}
*/
				];

				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.movetofolder"),
					width: _opt.ismobile ? "100%" : 500,
					height: _opt.ismobile ? "auto" : 670,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: _opt.ismobile,
					confirm: function (obj) {
						__callback(obj);
					},
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _opt.ismobile == true ? [] : _buttons,
					content: { url: _options.cdb + "/wFrmSelFolderTree?ReadForm", data: { ismobile: _opt.ismobile, mode: "move" } },

					initcallback: function (_$dialog) {
						var _$el = _$dialog.element;
						var _$diag = $("div.dwp-mail-move-dialog", _$dialog.element);

						var _dispMailFolderInfo = function (data) {
							var rtn = "",
								odata = null,
								chk = false,
								_sel = $("select[name=CurrentFolders]", _$diag),
								_errmsg = $("div.errmsg", _$diag);

							_sel.attr("id", "CurrentFolders");

							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									if (data.hasOwnProperty("folderisnothing")) {
										_errmsg.html('<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err03") + "</div></div>");
										return;
									}
									if (data.hasOwnProperty("userfolder")) {
										$.each(data["userfolder"], function (i, o) {
											odata = data[o];
											//$("<option value=\"" + odata[0] + "\" unid=\""+o+"\" >" + odata[0] + "</option>").appendTo(_sel);

											$('<option value="' + odata[0] + '" unid="' + o + '" lnbid="' + odata[3] + '">' + odata[0] + "</option>").appendTo(_sel);
											chk = true;
										});

										_sel.on("change", function () {
											var _selid = $("#CurrentFolders option:selected").attr("lnbid");
											if (typeof _selid == "undefined") {
												_selid = "_root";
											}
											var _nodes = $("#tree").dynatree("getSelectedNodes");
											if (_nodes.length > 0) {
												$.each(_nodes, function (j, node) {
													node.select(false);
												});
											}
											$("#tree").dynatree("getTree").getNodeByKey(_selid).select();
										});
									}
								}
							}
							if (chk == false) {
								rtn = '<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err01") + "</div></div>"; //사용자 메일박스 정보를 확인할 수 없습니다
								_errmsg.html(rtn);
							}
						};
						$fn.cmdPost($fn.getProxyUrl($fn.getPath("mail") + "/wcmdpost?createdocument"), { actiontype: "mailfolderinfo" }, _dispMailFolderInfo, "json"); //개인이 추가한 폴더 정보
					}
				});
			},
			/* _$$.mail.doc.doc_movetofolderOld */
			doc_movetofolderOld: function (doc, opt) {
				var _me = this,
					_opt = {},
					_options = doc.options,
					_el = doc.element,
					opt = opt || {},
					_opt = $.extend({ ismobile: false }, opt),
					_curview = "";
				_curview = _options.foldername != "" ? _options.foldername : _options.viewalias;

				var __callback = function (obj) {
					var _sel = $("select[name=CurrentFolders]", obj.element).xval();
					if (_sel == "root" || _sel == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
						return;
					}

					var callback = function (_obj, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.hasOwnProperty("cnt")) {
									obj.close();
									if (_opt.ismobile == true) {
										doc.goview({ viewreload: true });

										//좌측 카운트 리프레쉬 - 2017.10.27 by dwlee
										_$$.mail.com.update_left_count();
									} else {
										if (doc.options.did != "") {
											var __dlg = $("#" + doc.options.did).xdialog("instance");

											//좌측 카운트 리프레쉬 - 2017.10.27 by dwlee
											_$$.mail.com.update_left_count();

											__dlg.close();
										} else {
											//좌측 카운트 리프레쉬 - 2017.10.27 by dwlee
											_$$.mail.com.update_left_count();

											doc.goview();
										}
									}
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
									return;
								}
							}
						}
					};
					_$$.mail.com.cmdpost({ actiontype: "movefolder", postdata: _options.unid, Arg1: _sel, Arg2: _curview }, callback);
				};
				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							__callback(obj);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.movemail"),
					width: _opt.ismobile ? "100%" : 500,
					height: _opt.ismobile ? "auto" : 250,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: _opt.ismobile,
					confirm: function (obj) {
						__callback(obj);
					},
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _opt.ismobile == true ? [] : _buttons,
					content: { url: _options.cdb + "/wFrmSelFolder?ReadForm", data: { ismobile: _opt.ismobile } }
				});
			},

			//번역시 언어선택 - 2024.10.14
			select_language: function (doc, bobj) {
				var _html = [];

				_html = '<div class="" styl="margin-top:5px;margin-left:5px;margin-right:5px">';
				_html += '<div style="margin-top:15px;margin-left:20px;margin-right:20px">';


				_html += "<div class='dwp-radio'><label><input name='sellang' type='radio' data-xlang-txt='한국어' value='Korean'><span>한국어</span></label></div><br>";
				_html += "<div class='dwp-radio' style='margin-top:5px'><label><input name='sellang' type='radio' data-xlang-txt='영어' value='English'><span>영어</span></label></div><br>";
				_html += "<div class='dwp-radio' style='margin-top:5px'><label><input name='sellang' type='radio' data-xlang-txt='중국어' value='Chinese'><span>중국어</span></label></div><br>";
				_html += "<div class='dwp-radio' style='margin-top:5px;margin-bottom:5px;'><label><input name='sellang' type='radio' data-xlang-txt='일본어' value='Japanese'><span>일본어</span></label></div>";

				_html += '</div>';
				_html += "</div>";
				$dwp.ui.qtdialog.init(bobj, {
					qtid: "mail-translation",
					//					height: 180,
					height: "auto",
					width: "auto",
					dialogClass: "titleless dropdown-type-dialog",
					position: { my: "left top", at: "left bottom", collision: "flipfit" },
					buttons: [
					],
					content: { url: "", html: _html },
					initcallback: function (_$qtdialog) {
						var _del = _$qtdialog.element;
						$("input[name=sellang]", _del).off("click").on("click", function () {
							var _lang = $(this).xval();
							//$fn.alert({msg : _lang});
							//return;

							var _cmd = "Translate the following text to " + _lang + ":";
							_$$.mail.com.get_chatgpt(doc, { cmd: _cmd, type: _lang, ask: "" });

						});
						//번역 호출
						_$dialog.close();
					}
				});



				return;

				_html.push("<div class='dwp-table-vertical'>");
				_html.push("  <div class='dwp-row'>");
				_html.push("    <div class='dwp-value'>");

				_html.push("        <div class='dwp-radio'><label><input name='sellang' type='radio' data-xlang-txt='한국어' value='Korean'><span>한국어</span></label></div>");
				_html.push("        <div class='dwp-radio'><label><input name='sellang' type='radio' data-xlang-txt='영어' value='English'><span>영어</span></label></div>");
				_html.push("        <div class='dwp-radio'><label><input name='sellang' type='radio' data-xlang-txt='중국어' value='Japanese'><span>중국어</span></label></div>");
				_html.push("        <div class='dwp-radio'><label><input name='sellang' type='radio' data-xlang-txt='일본어' value='Chinese'><span>일본어</span></label></div>");
				_html.push("    </div>");
				_html.push("  </div>");

				$fn.dialog(bobj, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.sellang"),
					width: 600,
					height: 300,
					show: 'fade', // effect
					hide: 'fade', // effect
					buttons: [{
						"title": $fn.getCodeMsg("comm.btn.confirm"),
						"css": "confirm",
						"click": function (_$dialog) {
							var _el = _$dialog.element;

							var _lang = $("input[name=sellang]", _el).xval();
							if (_lang == "") {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.sellang") })
								return;
							}
							_$$.mail.com.get_chatgpt(_doc, { cmd: "", type: _lang, ask: "" });
							//번역 호출
							_$dialog.close();
						}
					}, {
						"title": "취소",
						"css": "cancel",
						"click": function (_$dialog) {
							_$dialog.close();
						}
					}],
					content: { html: _html.join("") },
					initcallback: function ($dialog) {
						var _el = $dialog.element;

					}
				});
			},

			/* _$$.mail.doc.doc_mailrecall  >>  메일 조회화면의 [회수] 버튼 */
			doc_mailrecall: function (doc) {
				var _me = this,
					_opt = {},
					_options = doc.options,
					_el = doc.element;
				$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm17") }).done(function () {
					//발송한 메일을 회수 하시겠습니까? 수신자가 열람한 메일은 회수되지 않습니다.
					//var _viewname = view.options.viewalias;
					var callback = function (obj, data) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt22") });
						doc.reload();
					};
					_$$.mail.com.cmdpost({ actiontype: "mailrecall", postdata: doc.options.unid }, callback);
				});
			},

			/* _$$.mail.doc.doc_returnreceipt  >>  메일 조회화면의 수신확인 버튼*/
			doc_returnreceipt: function (doc, opt) {
				var _me = this,
					_options = doc.options,
					_el = doc.element,
					_opt = $.extend({ ismobile: false, keyunid: _options.key_unid != "" ? _options.key_unid : _options.unid }, opt);
				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(_el, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.btn.receivecheckrecall"),
					width: _opt.ismobile ? "100%" : 730,
					height: _opt.ismobile ? "auto" : 550,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: _opt.ismobile,
					//autoOpen: false,		//.dialog("open")호출시만 열림
					//buttons: _buttons,
					content: { url: _options.cdb + "/wFrmReceiptRecall?ReadForm", data: _opt }
				});
			},

			/* _$$.mail.doc.init_receive_recall  >>  수신확인 Dialog 화면이 열릴 때 수신확인 정보 등을 화면에 표시함 (수신확인 Dialog 화면 init()에서 호출함 */
			init_receive_recall: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					_mailpath = $fn.getPath("mail"),
					__doc = $("#" + opt.did),
					_instance = __doc.xdialog("instance"),
					_options = _instance.options,
					tmp = "",
					_ele = _instance.element,
					fld = ["SendTo", "CopyTo", "BlindCopyTo"],
					obj = { SendTo: {}, CopyTo: {}, BlindCopyTo: {} },
					_tbody = $("#receipt_tbody", _ele),
					_cnt = 0,
					subarr = [],
					_subarr = [],
					_tr = "",
					ReceiveInfo = $.trim($("#ReceiveInfo", _ele).text()),
					_recinfo = {},
					_weblib = $fn.getPath("weblib"),
					RecallSingle = $.trim($("#RecallSingle", _ele).text());
				$.each(obj, function (nm, so) {
					so["odata"] = $.trim($("#" + nm + "Full", _ele).text());
				});

				var callback = function (_obj, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							//수신확인 옵션 체크하지 않은 상태에서는 버튼 숨김 - 2023.06.22 by dwlee
							if (data.hasOwnProperty("returntype") && data.returntype == "0") {
								$(".dwp-btn-recall-all", _ele).closest("div").addClass("dwp-none");
							}

							if (data.hasOwnProperty("folderisnothing")) {
								divmailbox.html('<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err03") + "</div></div>");
								return;
							}
							if (data.hasOwnProperty("userinfo")) {
								_tbody.find("tr").remove();
								$.each(data["userinfo"], function (i, o) {
									//o = o.replace(/"¶"/gi,",");
									var jsonResult = data[o][0];
									if (jsonResult.isinner == "0") {
										_tr = '<tr dwp-data="' + jsonResult.userinfo + '"><td><div class="auth">' + $fn.getCurLangMsg(jsonResult.userinfo).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</td>";
										if (jsonResult.result == "noupdate") {
											//수신확인정보 없음
											_tr += '<td><div class="recall-status read"><img src="' + _weblib + '/images/common/icon-mail.svg" alt="">' + $fn.getCodeMsg("mail.title.notreadstatus") + "</div></td>";
											_tr += "<td></td>";
											//수신확인 체크안하고 회수한 경우 - 2023.06.22 by dwlee
										} else if (jsonResult.result == "n/a") {
											_tr += '<td><div class="recall-status read">N/A</div></td>';
											_tr += "<td>N/A</td>";
										} else {
											_tr += '<td><div class="recall-status read open dwp-orange"><img src="' + _weblib + '/images/common/icon-mail-on.svg" alt="">' + $fn.getCodeMsg("mail.title.readstatus") + "</div></td>";
											_tr += '<td class="dwp-orange">' + jsonResult.result + "</td>";
										}
									} else {
										var org = new $fn.orgData(jsonResult.userinfo); //빼내서 쓸때는 이렇게 가져갑시다...
										_tr = '<tr dwp-data="' + org.oinfo.notesid + '"><td><div class="auth">' + $fn.getCurLangMsg(org.oinfo.username) + "/" + $fn.getCurLangMsg(org.oinfo.pos) + "/" + $fn.getCurLangMsg(org.oinfo.orgname) + "</td>";

										var _recall = opt.ismobile ? "" : $fn.getCodeMsg("mail.btn.onerecall");
										if (jsonResult.result == "noupdate") {
											//수신확인정보 없음
											_tr += '<td><div class="recall-status read"><img src="' + _weblib + '/images/common/icon-mail.svg" alt="">' + $fn.getCodeMsg("mail.title.notreadstatus") + "</div></td>";
											_tr += '<td><div class="dwp-btn icon-type"><span class="recall-single" dwp-data="' + org.oinfo.notesid + '"><img src="' + _weblib + '/images/common/icon-mail-cancel.svg" alt="">' + _recall + "</span></div></td>";
										} else if (jsonResult.result == "recall") {
											//리콜
											_tr += '<td><div class="recall-status read"><img src="' + _weblib + '/images/common/icon-return-comp.svg" alt="">' + $fn.getCodeMsg("mail.title.recallcomplete") + "</div></td><td></td>";
										} else if (jsonResult.result == "recallfail") {
											//리콜
											_tr += '<td><div class="recall-status read"><span style="color:#FF0000;">' + $fn.getCodeMsg("mail.title.recallfail") + "</span></div></td>";
											_tr += '<td><div class="dwp-btn icon-type"><span class="recall-single" dwp-data="' + org.oinfo.notesid + '" recalling="fail"><img src="' + _weblib + '/images/common/icon-mail-cancel.svg" alt="">' + _recall + "</span></div></td>";
										} else if (jsonResult.result == "recalling") {
											//리콜
											_tr += '<td><div class="recall-status read"><span class="dwp-orange">' + $fn.getCodeMsg("mail.title.recalling") + "</span></div></td>";
											_tr += '<td><div class="dwp-btn icon-type"><span class="recall-single" dwp-data="' + org.oinfo.notesid + '" recalling="ing"><img src="' + _weblib + '/images/common/icon-mail-cancel.svg" alt="">' + _recall + "</span></div></td>";
											//수신확인 체크안하고 회수한 경우 - 2023.06.22 by dwlee
										} else if (jsonResult.result == "n/a") {
											_tr += '<td><div class="recall-status read open dwp-orange"><img src="' + _weblib + '/images/common/icon-mail-on.svg" alt="">' + $fn.getCodeMsg("mail.title.readstatus") + "</div></td>";
											_tr += "<td>N/A</td>";
										} else {
											_tr += '<td><div class="recall-status read open dwp-orange"><img src="' + _weblib + '/images/common/icon-mail-on.svg" alt="">' + $fn.getCodeMsg("mail.title.readstatus") + "</div></td>";
											_tr += '<td class="dwp-orange">' + jsonResult.result + "</td>";
										}
										_tr += "</tr>";
									}
									_tbody.append(_tr);
									_cnt += 1;
								});
								$("span.alltocnt", _ele).text(_cnt);

								$(".recall-single", _ele)
									.off("click")
									.on("click", function () {
										//개별 발신취소 버튼

										_opt.userid = $(this).attr("dwp-data");

										console.log("_opt.userid : ", _opt.userid);
										_me._recall_single(_opt, $(this));
									});
								$(".dwp-btn-recall-all", _ele)
									.off("click")
									.on("click", function () {
										//전체 발신취소 버튼
										_me._recall_all(_opt);
									});
								$(".dwp-btn-refresh", _ele)
									.off("click")
									.on("click", function () {
										//새로고침
										__doc.xdialog();
									});
							}
						}
					}
				};
				var _pdata = {
					AgentName: "wAgtCmdProcess",
					WQS_Agent: "wAgtCmdProcess",
					actiontype: "get_receiveinfo",
					Arg1: _opt.keyunid
				};

				console.log("=====================================");
				_$$.mail.com.cmdpost(_pdata, callback);
				console.log("=====================================");

				/*				이전 소스 - 김만현 차장이 MDN없이 작업한 내용
				if (ReceiveInfo != "") {							//수신자의 읽음/회수 정보를 추출
					ReceiveInfo = ReceiveInfo.split("¶");
					$.each(ReceiveInfo, function(ii, _val) {
						if (_val != "") {
							subarr = _val.split("^");											//Abbreviate Name^DoStatus^시간
							tmp = _$$.mail.com.atName(subarr[0], "Abbreviate").replace(/ /g,"");
							if (!_recinfo.hasOwnProperty(tmp + "^" + subarr[1])) {  			//Abbreviate Name^DocStatus
								_recinfo[tmp + "^" + subarr[1]] = subarr[2];					//시간
							}
						}
					});
				}
				RecallSingle = RecallSingle.split("¶");

				var getData = function(nid) {
					var _td = "", _nid = _$$.mail.com.atName(nid, "Abbreviate").replace(/ /g,""), _recall = "";

					console.log("_recinfo ==> ",_recinfo);
					console.log("_nid ==> ",_nid);

					if (_recinfo.hasOwnProperty(_nid +"^recall")) {				//회수 완료 정보 있음
						_td += "<td><div class=\"recall-status read\"><img src=\"" + _weblib + "/images/common/icon-return-comp.svg\" alt=\"\">" + $fn.getCodeMsg("mail.title.recallcomplete") + "</div></td><td></td>"
					} else if (_recinfo.hasOwnProperty(_nid +"^read")) {		//읽음 정보 있음
						_td += "<td><div class=\"recall-status read open dwp-orange\"><img src=\"" + _weblib + "/images/common/icon-mail-on.svg\" alt=\"\">" + $fn.getCodeMsg("mail.title.readstatus") + "</div></td>";
						_td += "<td class=\"dwp-orange\">"+_recinfo[_nid +"^read"]+"</td>"
					} else {
						_recall = (opt.ismobile ? "" : $fn.getCodeMsg("mail.btn.onerecall"));
						if (_recinfo.hasOwnProperty(_nid +"^recall-fail")) {		//회수 실패
							_td += "<td><div class=\"recall-status read\"><span style=\"color:#FF0000;\">" + $fn.getCodeMsg("mail.title.recallfail") + "</span></div></td>";
							_td += "<td><div class=\"dwp-btn icon-type\"><span class=\"recall-single\" dwp-data=\""+nid+"\" recalling=\"fail\"><img src=\"" + _weblib + "/images/common/icon-mail-cancel.svg\" alt=\"\">" + _recall + "</span></div></td>"
						} else if ($.inArray(_nid, RecallSingle) != -1) {			//회수 진행중
							_td += "<td><div class=\"recall-status read\"><span class=\"dwp-orange\">" + $fn.getCodeMsg("mail.title.recalling") + "</span></div></td>";
							_td += "<td><div class=\"dwp-btn icon-type\"><span class=\"recall-single\" dwp-data=\""+nid+"\" recalling=\"ing\"><img src=\"" + _weblib + "/images/common/icon-mail-cancel.svg\" alt=\"\">" + _recall + "</span></div></td>"
						} else {														//읽지 않음
							_td += "<td><div class=\"recall-status read\"><img src=\"" + _weblib + "/images/common/icon-mail.svg\" alt=\"\">" + $fn.getCodeMsg("mail.title.notreadstatus") + "</div></td>";
							_td += "<td><div class=\"dwp-btn icon-type\"><span class=\"recall-single\" dwp-data=\""+nid+"\"><img src=\"" + _weblib + "/images/common/icon-mail-cancel.svg\" alt=\"\">" + _recall + "</span></div></td>"
						}
					}
					return _td;
				};

				_tbody.find("tr").remove();
				$.each(fld, function(idx, nm) {
					subarr = obj[nm].odata.split("¶");
					$.each(subarr, function(_ii, _val) {
						if (_val != "") {
							_subarr = _val.split("^");
							if (_subarr[0].indexOf("@") != -1) {
								_tr = "<tr dwp-data=\""+ _subarr[0] +"\"><td><div class=\"auth\">" + $fn.getCurLangMsg(_subarr[1]).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</td>";
								_tr += "<td>"+$fn.getCodeMsg("mail.msg.err22")+"</td><td></td></tr>";
							} else {
								_tr = "<tr dwp-data=\""+ _subarr[0] +"\"><td><div class=\"auth\">" + $fn.getCurLangMsg(_subarr[1]) + " / " + $fn.getCurLangMsg(_subarr[2]) + "</td>";
								_tr += getData(_subarr[0]) + "</tr>";
							}
							_tbody.append(_tr);
							_cnt += 1;
						}
					});
				});
				$("span.alltocnt", _ele).text(_cnt);
				if (_cnt == 0) {
					_tr = "<tr><td colspan=3>" + $fn.getCodeMsg("mail.msg.err21") + "</td><tr>";
					_tbody.append(_tr);
				}
				$(".recall-single", _ele).off("click").on("click", function() {				//개별 발신취소 버튼
					_opt.userid = $(this).attr("dwp-data");
					_me._recall_single(_opt, $(this));
				});
				$(".dwp-btn-recall-all", _ele).off("click").on("click", function() {		//전체 발신취소 버튼
					_me._recall_all(_opt);
				});
				$(".dwp-btn-refresh", _ele).off("click").on("click", function() {			//새로고침
					__doc.xdialog();
				});
				*/
			},

			/* _$$.mail.doc._recall_single  >>  수신확인 Dialog 화면에서 개별 회수*/
			_recall_single: function (opt, _btn) {
				var _me = this,
					_opt = $.extend({}, opt),
					__doc = $("#" + opt.did),
					_instance = __doc.xdialog("instance"),
					_options = _instance.options;
				var callback = function (_obj, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.msgcode == "success") {
								var _tr = $("tr[dwp-data='" + _opt.userid + "']", _instance.element),
									_td = $(".recall-status", _tr);
								_td.html('<span class="dwp-orange">' + $fn.getCodeMsg("mail.title.recalling") + "</span>");
								$(_btn).attr("recalling", "ing");
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return;
							}
						}
					}
				};
				var _pdata = {
					AgentName: "wAgtCmdProcess",
					WQS_Agent: "wAgtCmdProcess",
					actiontype: "recall_single",
					Arg1: _opt.keyunid,
					Arg2: _opt.userid,
					Arg3: _opt.createserver,
					Arg4: _opt.receivelogpath,
					Arg5: _opt.authorempno
				};
				if ($(_btn).attr("recalling") == "ing") {
					//개별 발신취소 요청된 사용자의 경우 RecallMail 발송 후 "recalling" = "ing" 값으로 변경됨
					$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm12") }).done(function () {
						//현재 [개별 발신취소] 처리중 상태 입니다. 다시한번 요청 하시겠습니까?
						_$$.mail.com.cmdpost(_pdata, callback);
					});
				} else if ($(_btn).attr("recalling") == "fail") {
					$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm13") }).done(function () {
						//현재 [개별 발신취소] 처리중 상태 입니다. 다시한번 요청 하시겠습니까?
						_$$.mail.com.cmdpost(_pdata, callback);
					});
				} else {
					_$$.mail.com.cmdpost(_pdata, callback);
				}
			},

			/* _$$.mail.doc._recall_all  >>  수신확인 Dialog 화면에서 전체 회수*/
			_recall_all: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt),
					__doc = $("#" + opt.did),
					_instance = __doc.xdialog("instance"),
					_options = _instance.options;

				var callback = function (_obj, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.msgcode == "success") {
								$("input[name=RecallAll]", _instance.element).xval("1");
								__doc.xdialog();
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return;
							}
						}
					}
				};
				var _pdata = {
					AgentName: "wAgtCmdProcess",
					WQS_Agent: "wAgtCmdProcess",
					actiontype: "recall_all",
					Arg1: _opt.keyunid,
					/*Arg2 : _opt.userid,*/
					Arg3: _opt.createserver,
					Arg4: _opt.receivelogpath,
					Arg5: _opt.authorempno
				};

				if ($("input[name=RecallAll]", _instance.element).xval() == "1") {
					//전체 발신취소 요청할 경우 RecallMail 발송 후 "1" 값으로 변경됨
					$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm11") }).done(function () {
						//현재 [전체 발신취소] 처리중 상태 입니다. 다시한번 요청 하시겠습니까?
						_$$.mail.com.cmdpost(_pdata, callback);
					});
				} else {
					_$$.mail.com.cmdpost(_pdata, callback);
				}
			},

			/* _$$.mail.doc.send_me  >>  내게 쓰기 (체크박스 클릭)*/
			send_me: function (_doc, o) {
				var _me = this,
					_ele = _doc.element,
					_confirm = "",
					_sendto = "",
					_options = _doc.options,
					_instance = $fn.getInstance("doc", _doc);
				_confirm = $fn.getCodeMsg("mail.msg.confirm15") + "<br>" + $fn.getCodeMsg("mail.msg.confirm16");
				_sendto = $("textarea[name=SendTo]", _ele).xval() + $("textarea[name=CopyTo]", _ele).xval() + $("textarea[name=BlindCopyTo]", _ele).xval();
				var _set_null = function () {
					$("textarea[name=SendTo]", _ele).xval("");
					$("textarea[name=SendToFull]", _ele).xval("");
					$("textarea[name=CopyTo]", _ele).xval("");
					$("textarea[name=CopyToFull]", _ele).xval("");
					$("textarea[name=BlindCopyTo]", _ele).xval("");
					$("textarea[name=BlindCopyToFull]", _ele).xval("");
					$(".mail-targets > .namepicker-target", _ele).remove();

					//내게쓰기 해제시  버튼 보임 - 2024.05.22 by dwlee
					$(".btn_SendTo", _ele).removeClass("dwp-none");
				};
				var _hidden_call = function () {
					$(".hidden-area2", _ele).addClass("dwp-hidden");
					$(".dwp-btn-more", _ele).removeClass("active");
					$("input[name=qsearch]", _ele).addClass("dwp-none"); //검색어 입력 부분 숨김처리

					//내게쓰기 설정시 버튼 숨김 - 2024.05.22 by dwlee
					$(".btn_SendTo", _ele).addClass("dwp-none");

					var callback = function (_obj, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.msgcode == "success") {
									$("textarea[name=SendTo]", _ele).xval(data.dataid);
									$("textarea[name=SendToFull]", _ele).xval(data.datafull);
									_$$.mail.doc.org.displayNameList(data.datafull, "SendTo", _doc);
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
									return;
								}
							}
						}
					};
					var _pdata = {
						WQS_Agent: "wAgtCmdProcess",
						actiontype: "get_userorginfo",
						Arg1: $dwp.core.info.cuser.notesid + "^" + $dwp.core.info.cuser.pinfo.orgcode
					};
					_$$.mail.com.cmdpost(_pdata, callback);
				};
				/*
								if ($(o).is(":checked")) {
									//내게쓰기 선택
									if (_sendto != "") {
										$fn.alert({ msg: _confirm }); //내게쓰기 시, 다른사람에게 메일을 보낼 수 없습니다<br>발송된 메일은 받은메일함에서 확인 가능하며, 메일발신함에는 저장하지 않습니다.
										_set_null();
										_hidden_call();
									} else {
										_set_null();
										_hidden_call();
									}
								} else {
									_set_null();
									$("input[name=qsearch]", _ele).removeClass("none"); //검색어 입력 부분 화면에 표시
									$(".hidden-area3", _ele).removeClass("dwp-hidden"); //취소 할 때는 참조 라인만 표시하고 숨은참조는 그냥 그대로..
								}
				*/
				//버튼클릭시 이벤트 추가 - 2024.09.24
				if ($(o).attr("name") == "send_me") {
					if ($(o).is(":checked")) {
						//내게쓰기 선택
						if (_sendto != "") {
							$fn.alert({ msg: _confirm }); //내게쓰기 시, 다른사람에게 메일을 보낼 수 없습니다<br>발송된 메일은 받은메일함에서 확인 가능하며, 메일발신함에는 저장하지 않습니다.
							_set_null();
							_hidden_call();
						} else {
							_set_null();
							_hidden_call();
						}

						//2024.12.03
						if ($fn.getCurUser().isdark) {
							$(".dwp-sendtome", _ele).html("<span class='dwp-bold'><img src='" + $fn.getPath("weblib") + "/images/common/icon-tome-dark.svg'>" + $fn.getCodeMsg("mail.btn.writemail") + "</span>");
						} else {
							$(".dwp-sendtome", _ele).html("<span class='dwp-bold'><img src='" + $fn.getPath("weblib") + "/images/common/icon-tome.svg'>" + $fn.getCodeMsg("mail.btn.writemail") + "</span>");
						}
					} else {
						_set_null();
						$("input[name=qsearch]", _ele).removeClass("dwp-none"); //검색어 입력 부분 화면에 표시	
						$("input[name=qsearch]", _ele).attr("disabled", false); //검색어 입력 부분 화면에 표시

						$(".hidden-area3", _ele).removeClass("dwp-hidden"); //취소 할 때는 참조 라인만 표시하고 숨은참조는 그냥 그대로..

						//2024.12.03
						if ($fn.getCurUser().isdark) {
							$(".dwp-sendtome", _ele).html("<span class='dwp-bold'><img src='" + $fn.getPath("weblib") + "/images/common/icon-tome-dark.svg'>" + $fn.getCodeMsg("mail.btn.send_me") + "</span>");
						} else {
							$(".dwp-sendtome", _ele).html("<span class='dwp-bold'><img src='" + $fn.getPath("weblib") + "/images/common/icon-tome.svg'>" + $fn.getCodeMsg("mail.btn.send_me") + "</span>");
						}
					}
				} else {
					if ($(".btn_SendTo", _ele).hasClass("dwp-none")) {

						$("input[name=send_me]", _ele).xval("");
						$("input[name=send_me]", _ele).prop("checked", false); //기존소스 활용을 위해서 추가

						_set_null();
						$("input[name=qsearch]", _ele).removeClass("dwp-none"); //검색어 입력 부분 화면에 표시
						$(".hidden-area3", _ele).removeClass("dwp-hidden"); //취소 할 때는 참조 라인만 표시하고 숨은참조는 그냥 그대로..

						//2024.12.03
						if ($fn.getCurUser().isdark) {
							$(".dwp-sendtome", _ele).html("<span class='dwp-bold'><img src='" + $fn.getPath("weblib") + "/images/common/icon-tome-dark.svg'>" + $fn.getCodeMsg("mail.btn.send_me") + "</span>");
						} else {
							$(".dwp-sendtome", _ele).html("<span class='dwp-bold'><img src='" + $fn.getPath("weblib") + "/images/common/icon-tome.svg'>" + $fn.getCodeMsg("mail.btn.send_me") + "</span>");
						}
					} else {
						$("input[name=send_me]", _ele).xval("1"); //체크박스 선택
						$("input[name=send_me]", _ele).prop("checked", true);
						//내게쓰기 선택
						if (_sendto != "") {
							$fn.alert({ msg: _confirm }); //내게쓰기 시, 다른사람에게 메일을 보낼 수 없습니다<br>발송된 메일은 받은메일함에서 확인 가능하며, 메일발신함에는 저장하지 않습니다.
							_set_null();
							_hidden_call();
						} else {
							_set_null();
							_hidden_call();
						}

						//2024.12.03
						if ($fn.getCurUser().isdark) {
							$(".dwp-sendtome", _ele).html("<span class='dwp-bold'><img src='" + $fn.getPath("weblib") + "/images/common/icon-tome-dark.svg'>" + $fn.getCodeMsg("mail.btn.writemail") + "</span>");
						} else {
							$(".dwp-sendtome", _ele).html("<span class='dwp-bold'><img src='" + $fn.getPath("weblib") + "/images/common/icon-tome.svg'>" + $fn.getCodeMsg("mail.btn.writemail") + "</span>");
						}
					}
				}

			},

			/* _$$.mail.doc.doc_addAddress  >>  주소록 등록 (수신/참조 리스트의 이름 또는 메일주소 클릭)*/
			doc_addAddress: function (item, _el) {
				var _me = this,
					_instance = null,
					_opt = {},
					_options = null,
					_ele = null,
					_unid = "",
					_url = "",
					ismobile = false;
				if (typeof _el == "object") {
					if (typeof _el.doc == "function") {
						_instance = _el.doc("instance");
					} else {
						// _instance = $fn.getInstance("doc", $fn.getContent()).element.doc("instance");
						_instance = $fn.getInstance("doc").element.doc("instance");
					}
				} else {
					// _instance = $fn.getInstance("doc", $fn.getContent()).element.doc("instance");
					_instance = $fn.getInstance("doc").element.doc("instance");
				}
				_options = _instance.options;
				_ele = _instance.element;
				if (typeof _options.ismobile == "boolean") {
					ismobile = _options.ismobile;
				}

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.savedoc"),
						click: function (obj) {
							var _ele = obj.element,
								_fld = null;
							_fld = $.trim($("input[name=LastName]", _ele).xval());
							if (_fld == "") {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt19") });
								return;
							}
							_fld = $.trim($("input[name=MailAddress]", _ele).xval());
							if (_fld == "") {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt20") });
								return;
							}
							if (_fld.indexOf("@") == -1) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt21") });
								return;
							}

							_$$.mail02.com.KeyCodeSet(_ele, { field0: "LastName", field1: "MU_SortKey", field2: "MU_SortKeyEnglish" }); //이름의 첫글자로 분류값으로 계산

							var _save = {
								callback: function (data) {
									if (data.hasOwnProperty("result")) {
										if (data.result >= "200" && data.result < "300") {
											obj.close();
											//view.reload();
										} else {
											if (data.msgcode.indexOf(".") != -1) {
												$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
												return;
											}
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return;
										}
									}
								}
							};
							obj.element.doc("instance").save(_save);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				var _name = "",
					_mailaddress = item.notesid,
					_address = item.notesid,
					_param = "";
				if (_address.indexOf("<") != -1) {
					_mailaddress = _$$.mail.com.strMiddle(_address, "<", ">");
					_name = $.trim(_address.substr(0, _address.indexOf("<")).replace(/\"/gi, ""));
				}
				if (ismobile) {
					_param = "&name=" + encodeURIComponent(_name) + "&mailaddress=" + encodeURIComponent(_mailaddress);
					_$$.mail.com.newMail({ link: $fn.getProxyUrl(_options.cdb + "/Person" + (ismobile ? "_mo" : "") + "?OpenForm" + _param) });
					return;
				}
				_url = $fn.getProxyUrl(_options.cdb + "/Person" + (ismobile ? "_mo" : "") + "?OpenForm" + _param);
				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					islangconvert: false,
					title: $fn.getCodeMsg("mail.title.addrperson"),
					width: ismobile ? "100%" : 730,
					height: ismobile ? "100%" : 550,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: ismobile,
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _buttons,
					open: function (__opt) {
						var _this = this,
							_dlg = __opt.target;
						$("input[name=LastName]", _dlg).xval(_name);
						$("input[name=MailAddress]", _dlg).xval(_mailaddress);
					},
					content: { url: _url, data: {} }
				});
			},

			/* _$$.mail.doc.doc_SelectSendmail  >>  메일 조회 화면의 수신/참조에 표시된 사용자/외부메일주소 클릭해서 메일쓰기 */
			doc_SelectSendmail: function (item, _el) {
				var _me = this,
					_instance = null,
					_opt = {},
					sendto = "",
					ismobile = false;
				if (typeof _el == "object") {
					if (typeof _el.doc == "function") {
						_instance = _el.doc("instance");
					} else {
						// _instance = $fn.getInstance("doc", $fn.getContent()).element.doc("instance");
						_instance = $fn.getInstance("doc").element.doc("instance");
					}
				} else {
					// _instance = $fn.getInstance("doc", $fn.getContent()).element.doc("instance");
					_instance = $fn.getInstance("doc").element.doc("instance");
				}
				_options = _instance.options;
				if (typeof _options.ismobile == "boolean") {
					ismobile = _options.ismobile;
				}

				sendto = item.type == "S" ? item.notesid : item.orgcode;
				$dwp.core.util.setLocalStorage("dwp.mailsendto", sendto); //LocalStorage에 수신인 정보를 저장
				if (ismobile) {
					_opt = { link: _instance.options.cdb + "/Memo_mo?OpenForm&newtype=localstorage_dwp.mailsendto" };
				} else {
					_opt = { url: _instance.options.cdb + "/Memo?OpenForm&newtype=localstorage_dwp.mailsendto" };
				}
				_$$.mail.com.newMail(_opt);
			},

			/* _$$.mail.doc.showSendList  >>  메일 조회 화면의 수신/참조 영역의 숨겨진 수신/참조 표시 ??? (외 3명-표시) */
			showSendList: function (_el, _this, _nm) {
				var _vtype = $(_this).attr("vtype"),
					_vcount = $(_this).attr("vcount"),
					_$namelist = $("div.Dsp" + _nm, _el),
					_target = null;
				if (_vtype == "hidden") {
					_target = $("div.mail-target", _$namelist);
					_target.removeClass("dwp-hidden");
					$(_this).attr("vtype", "show");
					$(_this).html("<nobr>" + $fn.getCodeMsg("mail.data.cmt03").replace(/{\$1}/g, _vcount) + "</nobr>");
				} else {
					_target = $("div.mail-target", _$namelist);
					_target.addClass("dwp-hidden");
					$("div.mail-target:eq(0)", _$namelist).removeClass("dwp-hidden");
					$(_this).attr("vtype", "hidden");
					$(_this).html("<nobr>" + $fn.getCodeMsg("mail.data.cmt02").replace(/{\$1}/g, _vcount) + "</nobr>");
				}
			},

			/* _$$.mail.doc.star_flag >> 메일 조회화면 에서 중요표시 */
			star_flag: function (doc, target) {
				var _me = this,
					_options = doc.options,
					_ele = doc.element,
					_unids = "",
					_target = null;
				_unids = _options.unid;
				_target = typeof target == "undefined" ? $(".icon-isstared", _ele) : $(target);

				var callback = function (obj, data) {
					_target.toggleClass("active"); //모바일
					if ($(_target).hasClass("star-flag")) {
						//PC
						var _img = $("img", $(_target)),
							_src = _img.attr("src");
						if (_src.indexOf("icon-mark.svg") != -1) {
							_img.attr("src", $fn.getPath("weblib") + "/images/common/icon-mark-full-on.png");
						} else {
							_img.attr("src", $fn.getPath("weblib") + "/images/common/icon-mark.svg");
						}
					}
				};
				_$$.mail.com.cmdpost({ actiontype: "starflag", postdata: _unids }, callback);
			},

			/* _$$.mail.doc.MailStore_LocalDonload_Doc  >> 메일 문서에서 다운로드 */
			MailStore_LocalDonload_Doc: function (doc) {
				var _opt = {
					type: "D",
					cdb: doc.options.cdb,
					viewalias: doc.options.viewalias,
					unids: doc.options.unid,
					searchqry: ""
				};
				_$$.mail.com.MailStore(_opt);
			},

			/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
			 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
			 *
			 * 				수신인 지정 조직도 관련
			 *
			 * 	Path : _$$.mail.doc.org, 		$dwp.app.mail.doc.org
			 *
			 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
			 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
			 */
			/* org function */
			org: {
				/* _$$.mail.doc.org.setReplySendToSet  >>  메일 회신, 전체회신 형식으로 신규 작성할 때 받은메일의 수신인, 참조인을 자동으로 넣어준다 (SendTo, SendToFull, CopyTo, CopyToFull */
				setReplySendToSet: function (_doc) {
					//console.log("==========================================================");
					var _options = _doc.options,
						prefix = "",
						_cuser = "",
						_sendto = "",
						_data = "",
						_arr = [],
						_vdata = "",
						_vid = "",
						_tmp = [],
						_tmpstr = "";
					if (_options.isnew == true) {
						//console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");

						if ($.inArray(_options.inherit, ["allreply", "reply", "forward"]) != -1) {
							prefix = _options.inherit == "allreply" || _options.inherit == "reply" ? "Re : " : _options.inherit == "forward" ? "Fw : " : "";
							$("input[name=Subject]", _doc.element).xval(prefix + $("#tmp_subject", _doc.element).xval());
						}
						//console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
						if ($.inArray(_options.inherit, ["allreply", "xx", "xx"]) != -1) {
							_cuser = _$$.mail.com.atName($dwp.core.info.cuser.notesid, "Abbreviate");
							_sendto = $("#tmp_from", _doc.element).xval();
							_data = $("#tmp_sendtofull", _doc.element).xval();
							_data += (_data != "" ? ";" : "") + $("#tmp_copytofull", _doc.element).xval();

							if (_data != "") {
								//org full 데이터가 있을 경우
								_arr = _data.split(";");
								$.each(_arr, function (i, v) {
									if ($.trim(v) != "" && v.indexOf("^") != -1) {
										if (v.indexOf(_cuser) == -1 && v.indexOf(_sendto) == -1) {
											_tmp = $.trim(v).split("^");
											_vdata += (_vdata != "" ? ";" : "") + $.trim(v);
											if (_tmp[0] == "B") {
												_vid += (_vid != "" ? ";" : "") + _tmp[4];
											} else {
												_vid += (_vid != "" ? ";" : "") + _tmp[3];
											}
										}
									}
								});
							} else {
								//===============================================================
								//아웃룩의 외부 사용자로 인식되어서 아래와 같이 메일 작성자를 제외하고 발송하도록 수정 - 2017.11.30 by dwlee
								// 아웃룩에서 A 가 내부사용자인 B를 참조로 지정해서 보낸 메일을 B가 전체회신하는 경우 B를 참조에서 제거!!!!

								var _domains = $("#tmp_domains", _doc.element).xval();
								var _domarray = _domains.split(",");
								var _mailid = $dwp.core.info.cuser.pinfo.mailid;
								//===============================================================

								_data = $("#tmp_sendto", _doc.element).xval();
								_data += (_data != "" ? ";" : "") + $("#tmp_copyto", _doc.element).xval();
								_arr = _data.split(";");
								$.each(_arr, function (i, v) {
									if ($.trim(v) != "") {
										//===============================================================
										//아웃룩의 외부 사용자로 인식되어서 아래와 같이 메일 작성자를 제외하고 발송하도록 수정 - 2017.11.30 by dwlee
										var _isself = false;
										$.each(_domarray, function (index, _dom) {
											var _mailaddr1 = "<" + _mailid + "@" + $.trim(_dom);
											var _mailaddr2 = _mailid + "@" + $.trim(_dom);
											if (v.indexOf(_mailaddr1) > -1 || v.indexOf(_mailaddr2) == 0) {
												_isself = true;
											}
										});
										//===============================================================
										//자기자신은 전체회신에서 제외  - 2017.11.30 by dwlee
										if (_isself == false) {
											_vdata += (_vdata != "" ? ";" : "") + "S^" + $.trim(v) + "^^" + $.trim(v) + "^^^^^^^^^^";
											_vid += (_vid != "" ? ";" : "") + $.trim(v);
										}
									}
								});
							}
							$("textarea[name=CopyToFull]", _doc.element).xval(_vdata);
							$("textarea[name=CopyTo]", _doc.element).xval(_vid);
						}
					}
				},

				/* _$$.mail.doc.org.fn_orgsel
				 * 수신, 참조, 비밀참조 조직도 검색 기능 설정
				 * @param	divname		검색 필드가 있는 div 테그의 이름
				 * @param	_doc			doc.init 리턴된 instance
				 */
				fn_orgsel: function (divname, _doc) {
					$fn.orgsel($("[name='org_" + divname + "']", _doc.element), {
						isedit: _doc.options.isedit,
						type: "single",
						treetype: "0",
						seltype: "0",
						isseltype: false,
						autodraw: false,
						searchtype: "mail",
						comcode: "",
						customsearch: $("textarea[name=LastSendTo]", _doc.element).xval().split(";"),
						autoseletcomplete: function (event, ui, doc) {
							_$$.mail.doc.org.searchResultSet(event, ui, _doc);
						}
					});
				},

				/*################################################################################*/
				/*
				 * 수신인 지정 기능 설정 (Drag & Drop, Ctrl-X & Ctrl-V 등등 기능 설정)
				 */

				addr_pastes: function (xckey, data, $focused, _doc) {
					var items = "";
					if (xckey == "c") {
						$.each(data.copyItems, function (ii, _data) {
							_$$.mail.doc.org.searchSetVal(_data.sinfo, _data.target, _doc);
						});
						if ($focused != "") {
							$focused.before(items);
							$focused.children().val("").css("width", 30).blur();
						}
					} else if (xckey == "x") {
						for (var i = 0; i < data.cloneItems.length; i++) {
							$focused.before(data.cloneItems[i]);
						}
						$focused.children().val("").css("width", 30).blur();
					}
					data.cloneItems = [];
					data.copyItems = [];
					_$$.mail.doc.org.dragAndDrop(_doc);
					$(".mail-targets .target", _doc.element).removeClass("selected");
					_$$.mail.doc.org.updateFullField(_doc);
				},

				/* _$$.mail.doc.org.dragAndDrop */
				dragAndDrop: function (_doc) {
					var _ismobile = _doc.options.ismobile || false;
					if (_ismobile == true) return;

					$(".mail-targets", _doc.element).sortable({
						connectWith: ".mail-targets",
						items: "> div.namepicker-target",
						helper: "clone",
						containment: $(".dwp-sendto-editlist", _doc.element),
						over: function () {
							$(this).parent().addClass("active");
						},
						out: function () {
							$(this).parent().removeClass("active");
							_$$.mail.doc.org.updateFullField(_doc);
						},
						receive: function (event, ui) {
							var input = $(ui.item[0]).siblings(".input-addr");
							input.parent().append(input);
						}
					});
				},

				/* _$$.mail.doc.org.textWidth */
				textWidth: function (txt) {
					var html_org = txt.replace(/</g, "X").replace(/>/g, "X");
					var html_calc = "<span>" + html_org + "</span>";
					$("body").append("<span class='calcTxt dwp-hidden'></span>");
					$("body > .calcTxt").html(html_calc);
					var width = $("body > .calcTxt").width();
					$("body > .calcTxt").remove();
					return width;
				},

				/* _$$.mail.doc.org.selectSendToSet */
				selectSendToSet: function (_doc) {

					//2024.05.14 by dwlee
					var _me = this;

					var _ele = _doc.element;

					/* 수신 참조 지정영역 */
					$("input[name=qsearch]", _ele).on("keypress keyup keydown", function () {
						var txtWidth = $(this).xval();
						txtWidth = _$$.mail.doc.org.textWidth(txtWidth) + 50;
						$(this).css("width", txtWidth + "px");
					});

					var mailItems = {
						copyItems: [],
						cloneItems: []
					};
					var ctrlDown = false,
						xcKey = "default",
						ctrlKey = 17,
						cKey = 67,
						xKey = 88,
						cmdKey = 91,
						enterKey = 13;

					$(".editreceive", _ele)
						.keydown(function (e) {
							if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
								ctrlDown = true;
							}
							if (ctrlDown && e.keyCode == xKey) {
								xcKey = "x";
								mailItems.cloneItems = [];
								$(".target.selected").each(function () {
									mailItems.cloneItems.push($(this));
								});
							}
						})
						.keyup(function (e) {
							/* || e.keyCode == cmdKey*/ if (e.keyCode == ctrlKey) {
								ctrlDown = false;
							}
						});

					$(".editreceive .input-addr", _ele).on("paste", function () {
						if (mailItems.cloneItems.length != 0 || mailItems.copyItems.length != 0) {
							_$$.mail.doc.org.addr_pastes(xcKey, mailItems, $(this), _doc);
							ctrlDown = false;
							return false;
						}
						ctrlDown = false;
					});

					_$$.mail.doc.org.dragAndDrop(_doc);

					/* 수신 참조 영역 클릭시 */
					$(".editreceive", _ele)
						.off("click")
						.on("click", ".mail-targets .target", function (event) {
							if (!ctrlDown) {
								$(".editreceive .mail-targets .target", _ele).removeClass("selected");
							}
							$(this).toggleClass("selected");
							event.stopPropagation();
						});

					$("div.dwp-namepicker-grouping", _ele)
						.off("click")
						.on("click", function () {

							var _$click = $(this); //2024.10.22

							//최근수신인이 없으면 팝업을 안띄움 - 2024.09.25
							if ($(".dwp-user", $(".dwp-recent_list", _ele)).size() < 1) {
								return;
							}

							//focus 시에 최근 수신인 정보 가져오도록 수정 - 2024.05.14 by dwlee
							$dwp.ui.qtdialog.init($("input[name=qsearch]", $(this)), {
								qtid: "mail_recent_qt",
								/*height: 400,*/
								width: "auto",
								dialogClass: "titleless dropdown-type-dialog",
								position: { my: "left top", at: "left bottom", collision: "flipfit" },
								buttons: [],
								content: { url: "", html: "<div class='dwp-recent-qt'>" + $(".dwp-recent_list", _ele).html() + "</div>" },
								initcallback: function (_$qtdialog) {
									var _$list = $(".dwp-recent-qt", _$qtdialog.element);

									//최근 수신인 삭제 - 2024.05.24 by dwlee
									$(".btn-attdel", _$qtdialog.element).off("click").on("click", function () {
										var _$del = $(this);
										//삭제post
										var _key = $(this).attr("data-key");
										$fn.cmdPostEx({
											url: $fn.getProxyUrl(_doc.options.cdb + "/wcmdpost?openform"), //최근 수신인 정보 삭제
											async: false,
											dataType: "json",
											data: { actiontype: "lastsendto_delete", arg1: _key },
											success: function (data, textStatus) {
												_$del.parents(".item").addClass("dwp-none");
												var _$btn = $("[data-key=" + _key + "]", _ele);
												_$btn.parents(".item").remove();
											}
										});
									});

									$("div.dwp-user", _$list).off("click").on("click", function () {
										var _id = $(this).data("userid");
										var _full = $(this).data("full");
										var _name = $(this).data("username");


										//전체 수신자에서 중복 체크	
										var _total = "";
										if ($("[name=SendTo]", _ele).val() != "") {
											_total += ";" + $("[name=SendTo]", _ele).val();
										}
										if ($("[name=CopyTo]", _ele).val() != "") {
											_total += ";" + $("[name=CopyTo]", _ele).val();
										}
										if ($("[name=BlindCopyTo]", _ele).val() != "") {
											_total += ";" + $("[name=BlindCopyTo]", _ele).val();
										}
										var _totalArr = _total.split(";");
										if ($.inArray(_id, _totalArr) != -1) {
											$fn.toast({ msg: _name + "은 중복된 수신자입니다." })
											return;
										}
										if ($("[name=org_CopyTo]", _$click).size() > 0) {
											console.log("현재 포커스 : 참조자");
											_new = $("[name=CopyTo]", _ele).val();
											_newFull = $("[name=CopyToFull]", _ele).val();
										} else if ($("[name=org_BlindCopyTo]", _$click).size() > 0) {
											console.log("현재 포커스 : 비밀참조자");
											_new = $("[name=BlindCopyTo]", _ele).val();
											_newFull = $("[name=BlindCopyToFull]", _ele).val();
										} else {
											console.log("현재 포커스 : 수신자");
											_new = $("[name=SendTo]", _ele).val();
											_newFull = $("[name=SendToFull]", _ele).val();
										}

										if (_new != "") {
											_new += ";"
											_newFull += ";";
										}
										_new += _id
										_newFull += _full;

										if ($("[name=org_CopyTo]", _$click).size() > 0) {
											$("[name=CopyTo]", _ele).val(_new);
											$("[name=CopyToFull]", _ele).val(_newFull);
										} else if ($("[name=org_BlindCopyTo]", _$click).size() > 0) {
											$("[name=BlindCopyTo]", _ele).val(_new);
											$("[name=BlindCopyToFull]", _ele).val(_newFull);
										} else {
											$("[name=SendTo]", _ele).val(_new);
											$("[name=SendToFull]", _ele).val(_newFull);
										}

										$(".target", $(".DspSendTo", _ele)).remove();
										$(".target", $(".DspCopyTo", _ele)).remove();
										$(".target", $(".DspBlindCopyTo", _ele)).remove();

										_me.read_show_name(_doc); //SendToFull, CopyToFull 정보들로 화면에 수신, 참조, 비밀참조 리스트를 표시

										_$qtdialog.close();

									});
								}
							});

							$("input[name=qsearch]", $(this)).focus();
						});

					$("input[name=qsearch]", _ele).on("keydown", function (event) {
						var _this = this,
							_val = $.trim($(_this).val()),
							_type = $(event.target).attr("data-type"),
							_arraddress = null,
							_addorgval = "";

						//최근수신인 qt 다이알로그 삭제 - 2024.05.14 by dwlee
						var _$recent = $("#dwp-qtdialog-mail_recent_qt", $("body"));
						if (_$recent.size() > 0) {
							_$recent.parents("div[role=dialog]").remove();
						}

						if (event.keyCode == enterKey && _val.length != 0 && (_val.indexOf(",") != -1 || _val.indexOf(";") != -1)) {
							var _posturl = $fn.getProxyUrl($fn.getPath("mail") + "/wcmdpost?createdocument");
							$fn.cmdPostEx({
								url: _posturl,
								data: { actiontype: "multisearchaddress", __Click: "1", Arg1: _val.replace(/,/g, ";") },
								dataType: "json"
							}).done(function (data) {
								$("input[name=qsearch]", _ele).xval("");
								var rtn_multi = [],
									duplication_data = [],
									tmp = {};
								$.each(data, function (ii, _data) {
									if (_data.count == "1") {
										if (_$$.mail.doc.org.duplicationAddress(_doc.element, $.trim(_data.key)) == true) {
											tmp = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.USER, _data.data, "^");
											duplication_data.push(_$$.mail.doc.org.getDispName(tmp));
											//$fn.alert({ msg: "[" + _$$.mail.doc.org.getDispName(_data.data) + "] " + $fn.getCodeMsg("mail.msg.err11") });
										} else {
											mailItems.copyItems = [];
											mailItems.copyItems.push({
												email: _data.key,
												name: _data.key,
												target: _type /*SendTo, CopyTo, BlindCopyTo*/,
												sinfo: _data.data /*orginfo full data*/
											});
											_$$.mail.doc.org.addr_pastes("c", mailItems, $(_this).parent(), _doc);
										}
									} else {
										rtn_multi.push(_data);
									}
								});
								_$$.mail.doc.org.searchResultMulti(_doc, $(_this).parent(), _type, rtn_multi);
								if (duplication_data.length > 0) {
									$fn.alert({ msg: "[" + duplication_data.join(", ") + "] " + $fn.getCodeMsg("mail.msg.err11") });
								}
							});
							return;
						} else {
							if (event.keyCode == enterKey && _val.length != 0 && _val.indexOf("@") != -1) {
								_arraddress = _val.replace(/,/g, ";").split(";");
								$.each(_arraddress, function (_i, __val) {
									if ($.trim(__val) != "") {
										//중복 체크
										if (_$$.mail.doc.org.duplicationAddress(_doc.element, $.trim(__val)) == true) {
											$("input[name=qsearch]", _ele).xval("");
											$fn.alert({ msg: "[" + __val + "] " + $fn.getCodeMsg("mail.msg.err11") }); /*는(은) 이미 지정되어 있습니다*/
										} else {
											_addorgval = "S^" + $.trim(__val) + "^^" + $.trim(__val) + "^^^^^^^^^^";
											mailItems.copyItems = [];
											mailItems.copyItems.push({
												email: $(_this).val(),
												name: $(_this).val(),
												target: _type,
												/*SendTo, CopyTo, BlindCopyTo*/
												sinfo: _addorgval /*orginfo full data*/
											});
											_$$.mail.doc.org.addr_pastes("c", mailItems, $(_this).parent(), _doc);
										}
									}
								});
								$(_this).focus();
							} else {
								if (event.keyCode == 46) {
									//삭제 키 (최근 수신인 삭제처리)
									var select_span = $("div.ui-menu-item-wrapper.ui-state-active > span.dwp-recent-srch"),
										select_li = null,
										select_data = {};
									if (select_span.length == 1) {
										select_li = select_span.parent().parent();
										select_data = select_li.data("uiAutocompleteItem");
										$fn.cmdPostEx({
											url: $fn.getProxyUrl(_doc.options.cdb + "/wcmdpost?openform"), //최근 수신인 정보 삭제
											async: false,
											dataType: "json",
											data: { actiontype: "lastsendto_delete", arg1: select_data.value.key },
											success: function (data, textStatus) {
												//console.log("수신인 삭제 결과", data);
												select_li.remove();
												$dwp.app.mail.com.lastsendto = data.SendTo;
											}
										});
									}
								}
								//console.log("조직도 검색으로 넘어간다..")
							}
						}
					});
					/*
					$("input[name=qsearch]", _ele).on("keydown", function (event) {
						var _this = this,
							_val = $.trim($(_this).val()),
							_type = $(event.target).attr("data-type"),
							_arraddress = null,
							_addorgval = "";
						if (event.keyCode == enterKey && _val.length != 0 && _val.indexOf("@") != -1) {
							_arraddress = _val.replace(/,/g, ";").split(";");
							$.each(_arraddress, function (_i, __val) {
								if ($.trim(__val) != "") {
									//중복 체크
									if (_$$.mail.doc.org.duplicationAddress(_doc.element, $.trim(__val)) == true) {
										$("input[name=qsearch]", _ele).xval("");
										$fn.alert({ msg: "[" + __val + "] " + $fn.getCodeMsg("mail.msg.err11") }); // 는(은) 이미 지정되어 있습니다
									} else {
										_addorgval = "S^" + $.trim(__val) + "^^" + $.trim(__val) + "^^^^^^^^^^";
										mailItems.copyItems = [];
										mailItems.copyItems.push({
											email: $(_this).val(),
											name: $(_this).val(),
											target: _type,
											//SendTo, CopyTo, BlindCopyTo
											sinfo: _addorgval //orginfo full data
										});
										_$$.mail.doc.org.addr_pastes("c", mailItems, $(_this).parent(), _doc);
									}
								}
							});
							$(_this).focus();
						} else {
							//console.log("조직도 검색으로 넘어간다..")
						}
					});
					*/

					$(".input-addr", _ele).focusout(function () {
						$(this).children().val("");
					});
				},

				/**
				 * 메일 작성화면 > 수신, 참조 입력란에 쉼표, 세미콜론 구분자로 한명 이상 입력할 때 동명이인이 있을 경우 선택 화면 - 2022/12/02 - 10000hyun
				 * @param {*} doc
				 * @param {*} ele
				 * @param {*} _type
				 * @param {*} rtn
				 * @returns
				 */
				searchResultMulti: function (doc, ele, _type, rtn) {
					if (rtn.length == 0) return;
					var dlghtml = [];
					dlghtml.push('<div class="dwp-table-vertical">');
					dlghtml.push('	<div class="dwp-row">');
					dlghtml.push('		<div class="dwp-title" style="width:50px"><div class="dwp-checkbox textless"><label><input name=SelAll type=checkbox class="dwp-check"><span></span></label></div></div>');
					dlghtml.push('		<div class="dwp-title">수신인 검색결과 (동명이인)</div>');
					dlghtml.push("	</div>");
					dlghtml.push("</div>");
					dlghtml.push('<div style="overflow-y:auto; height:310px; border-bottom: 1px solid #cfcfcf;">');
					dlghtml.push('	<div class="dwp-table-vertical ResultMulti"></div>');
					dlghtml.push("</div>");

					var _buttons = [
						{
							title: $fn.getCodeMsg("선택 추가"),
							click: function (_obj) {
								var sel = $("input[name=SelMulti]:checked", _obj.element),
									mailItems = { copyItems: [], cloneItems: [] },
									duplication_data = [],
									tmp = {};
								$.each(sel, function (ii, _sel) {
									// 2024-12-23
									if (_$$.mail.doc.org.duplicationAddress(doc.element, $.trim($(_sel).data("key"))) == true) {
										tmp = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.USER, $(_sel).data("sinfo"), "^");
										duplication_data.push(_$$.mail.doc.org.getDispName(tmp));
									} else {
										mailItems.copyItems = [];
										mailItems.copyItems.push({
											email: $(_sel).data("key"),
											name: $(_sel).data("key"),
											target: _type /*SendTo, CopyTo, BlindCopyTo*/,
											sinfo: $(_sel).data("sinfo") /*orginfo full data*/
										});
										_$$.mail.doc.org.addr_pastes("c", mailItems, ele, doc);
									}
								});
								_obj.close();
								if (duplication_data.length > 0) {
									$fn.alert({ msg: "[" + duplication_data.join(", ") + "] " + $fn.getCodeMsg("mail.msg.err11") });
								}
							}
						},
						{
							title: $fn.getCodeMsg("mail.btn.cancel"),
							click: function (_obj) {
								_obj.close();
							}
						}
					];
					$fn.dialog(null, {
						modal: true,
						resizable: true,
						draggable: true,
						title: $fn.getCodeMsg("수신인 선택"),
						width: 500,
						height: 500,
						show: "fade", //effect
						hide: "fade", //effect
						open: function (_opt) {
							var _this = this;
							$.each(rtn, function (ii, _rtn) {
								var _org = new $dwp.ui.org.data.org(_rtn["data"]),
									_row = "",
									_dlg = _opt.target;
								console.log(_org);
								_row = '<div class="dwp-row">';
								_row += '<div class="dwp-value" style="width:50px"><div class="dwp-checkbox textless"><label><input name=SelMulti type=checkbox class="dwp-check"><span></span></label></div></div>';
								_row += '<div class="dwp-value dwp-cursor">';
								if (_org.oinfo.type == "B") {
									_row += $fn.getCurLangMsg(_org.oinfo.orgname);
								} else {
									_row += $fn.getCurLangMsg(_org.oinfo.username);
									_row += _org.oinfo.pos != "" ? " / " + $fn.getCurLangMsg(_org.oinfo.pos) : "";
									_row += _org.oinfo.orgname != "" ? " / " + $fn.getCurLangMsg(_org.oinfo.orgname) : "";
								}
								_row += "</div>";
								_row += "</div>";
								_row = $(_row).appendTo($("div.ResultMulti", _dlg));
								$("input[name=SelMulti]", _row).data("oinfo", _org.oinfo);
								$("input[name=SelMulti]", _row).data("sinfo", _org.sinfo);
								$("input[name=SelMulti]", _row).data("key", _org.oinfo.key);
								$("div.dwp-cursor", _row)
									.off("click")
									.on("click", function () {
										$("input[name=SelMulti]", _row).click();
									});
							});
							$("input[name=SelAll]", _opt.target)
								.off("click")
								.on("click", function () {
									$("input[name=SelMulti]", _opt.target).prop("checked", $(this).is(":checked"));
								});
						},
						buttons: _buttons,
						content: { html: dlghtml.join(""), url: "" }
					});
				},

				/* _$$.mail.doc.org.searchSetVal  >>  외부 메일주소 화면에 추가 */
				searchSetVal: function (_addorgval, _type, _doc) {
					var _org = new $dwp.ui.org.data.org(_addorgval);
					var addval = function (_nm, _addval) {
						_fld = $("textarea[name='" + _nm + "']", _doc.element);
						if (_fld.size() > 0) {
							_val = _fld.xval();
							if (_val == "") {
								_fld.xval(_addval);
							} else {
								_fld.xval(_val + ";" + _addval);
							}
						}
					};
					addval(_type, _org.oinfo.key);
					addval(_type + "Full", _org.sinfo);
					_$$.mail.doc.org.displayNameList(_org.oinfo, _type, _doc);
				},

				/* _$$.mail.doc.org.updateFullField
				 * 화면에 표시된 수신,참조,비밀참조 정보를 SendTo, CopyTo, BlindCopyTo, SendToFull, CopyToFull, BlindCopyToFull 필드에 업데이트
				 * @param	_doc
				 * @param	selector		설정하지 않으면 수신,참조,비밀참조 모두 업데이트
				 * 								특정 필드만 업데이트 해야 할 경우 jquery selector string		("div.DspSendTo, div.DspCopyTo")
				 */
				updateFullField: function (_doc, selector) {
					var _doc_ele = _doc.element,
						_target = null,
						_type = "",
						_fld = null,
						_fldfull = null,
						_list = null,
						_val = "",
						_valfull = "",
						_data = null;
					if (typeof selector == "undefined") {
						_target = $("div.mail-targets", _doc_ele);
					} else {
						_target = $(selector, _doc_ele);
					}
					$.each(_target, function (i, _div) {
						_type = $(_div).attr("data-type");
						_fld = $("textarea[name=" + _type + "]", _doc_ele);
						_fldfull = $("textarea[name=" + _type + "Full]", _doc_ele);
						_list = $("div.target", $(_div));
						_fld.xval("");
						_fldfull.xval("");
						_val = "";
						_valfull = "";
						$.each(_list, function (_i, _o) {
							_data = $(_o).data("data-org");
							var _org = new $dwp.ui.org.data.org(_data);
							_val += _val == "" ? "" : ";";
							_valfull += _valfull == "" ? "" : ";";
							_val += _org.oinfo.key;
							_valfull += _org.sinfo;
							_fld.xval(_val);
							_fldfull.xval(_valfull);
						});
					});
				},

				/* _$$.mail.doc.org.getDispName */
				getDispName: function (_oinfo, opt) {
					var _name = "";
					//To-Do 타회사인 경우 회사명 추가
					if (_oinfo.type == "B") {
						_name = $dwp.core.lang.getCurMsg(_oinfo.orgname);
					} else if (_oinfo.type == "G" || _oinfo.type == "C") {
						_name = $dwp.core.lang.getCurMsg(_oinfo.groupname);
					} else {
						_name = opt == true ? $dwp.core.lang.getCurMsg(_oinfo.username).replace(/</g, "&lt;").replace(/>/g, "&gt;") : $dwp.core.lang.getCurMsg(_oinfo.username);
						_name += _oinfo.pos != "" ? "/" + $dwp.core.lang.getCurMsg(_oinfo.pos) : "";
						_name += _oinfo.orgname != "" ? "/" + $dwp.core.lang.getCurMsg(_oinfo.orgname) : "";
					}
					return _name;
				},

				/* _$$.mail.doc.org.searchResultSet
				 * 선택된 수신인 정보를 화면에 추가
				 * @param	event
				 * @param	ui
				 * @param	doc
				 */
				searchResultSet: function (event, ui, doc) {
					var _org = null,
						_fld = null,
						_$fld = null,
						_$fldfull = null,
						_val = "",
						_nm = $(event.target).attr("data-type");
					var _ele = doc.element,
						_instance = _ele.doc("instance");

					if ($.inArray(ui.item.value.key, _$$.mail.com.CONST.ADD_IMPOSSIBLE) != -1) {
						//수신인으로 추가 불가능 부서코드 및 NotesID
						return;
					}

					if ($(".target.namepicker-target", _ele).size() >= _$$.mail.com.CONST.MAXCOUNT) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err30").replace(/\{\$1\}/g, _$$.mail.com.CONST.MAXCOUNT) }); //최대 [ " + _gridinfo.count + " ]명 까지 선택가능합니다.
						return;
					}
					var addval = function (_nm, _addval) {
						_fld = $("textarea[name='" + _nm + "']", _ele);
						if (_fld.size() > 0) {
							_val = _fld.xval();
							if (_val == "") {
								_fld.xval(_addval);
							} else {
								_fld.xval(_val + ";" + _addval);
							}
						}
					};

					if (ui.item.label.indexOf('<span class="dwp-recent-srch"></span>') == 0) {
						//최근 수신인은 별표로 체크
						if (ui.item.value.key.indexOf("@") == -1) {
							//외부메일주소는 넘겨주는 데이터 그대로 사용하고 내부 사용자는 다시한번 조직정보를 최신정보로 가져온다
							$fn.cmdPostEx({
								url: $fn.getProxyUrl(_instance.options.cdb + "/wcmdpost?openform"),
								async: false,
								dataType: "json",
								data: { actiontype: "get_userorginfo", Arg1: ui.item.value.key + (ui.item.value.orgcode != "" ? "^" + ui.item.value.orgcode : "") },
								success: function (data, textStatus) {
									if (data.cnt == "0") {
										ui.item.value = "";
										$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg013") });
										return; //해당사용자는 없는 사용자입니다
									}
									if (data.hasOwnProperty("datafull")) {
										ui.item.value = data.datafull;
									}
								}
							});
						}
					}

					if (ui.item.value == "") {
						return;
					}
					_org = new $dwp.ui.org.data.org(ui.item.value);

					//중복 체크
					if (_$$.mail.doc.org.duplicationAddress(_ele, _org.oinfo.key) == true) {
						$fn.alert({ msg: "[" + _$$.mail.doc.org.getDispName(_org.oinfo) + "] " + $fn.getCodeMsg("mail.msg.err11") });
						return;
					}

					addval(_nm, _org.oinfo.key);
					addval(_nm + "Full", _org.sinfo);
					_$$.mail.doc.org.displayNameList(_org.oinfo, _nm, _instance);
				},

				/* _$$.mail.doc.org._addListItem  >> 조직도 선택화면의 [수신], [참조], [비밀참조] 버튼 클릭에 대한 처리*/
				_addListItem: function (_$dialog, _node, issearch, overlapCheck) {
					var _me = this,
						_overlapCheck = overlapCheck || "", //개인주소록 그룹을 추가할 경우 중복확인 체크하지만 메시지 표시는 하지 않음
						_type = _$dialog.options.addtype, //수신, 참조, 비밀참조 각 영역에 한번 추가하고 왼쪽 조직도 트리에서 더블클릭 할 경우 마지막 추가한 부분에 자동으로 넣기 위해서 사용함
						_area = _type == "sendto" ? "form-receive" : _type == "copyto" ? "form-refer" : _type == "blindcopyto" ? "form-blind-refer" : "form-receive",
						_issearch = false || issearch,
						_$search = $("div.dwp-search-result", _$dialog.element),
						_treeinfo = $dwp.ui.org._getTreeInfo(_$dialog),
						_gridinfo = $dwp.ui.org._getGridInfo(_$dialog),
						_$gridlist = $dwp.ui.org._getGrid(_$dialog),
						_$gridlist_sub = $("div." + _area, _$gridlist),
						_org = null,
						_$item = null;

					if ($.inArray(_node.data.key, _$$.mail.com.CONST.ADD_IMPOSSIBLE) != -1) {
						//수신인으로 추가 불가능한 부서코드 및 NotesID
						return;
					}
					console.log("addItem", _node.data);
					// 사용자 부서 및 부서 체크
					if (_treeinfo.seltype == "2") {
						if (_node.data.type == "B") {
							return true;
						}
					} else if (_treeinfo.seltype == "1") {
						if (_node.data.type == "S") {
							return true;
						}
					}

					if (_node.data.hasOwnProperty("type")) {
						if (_node.data.type.toUpperCase() == "G") {
							//개인주소록 그룹
							if (_node.data.key == "_GRP" || _node.data.key == "_PER") {
								return true;
							} //개인, 그룹 루트일 경우 추가하지 않음
							if (_node.hasChildren()) {
								//개인주소록 그룹에 사람이 있으면
								$.each(_node.getChildren(), function (idx, child) {
									_$$.mail.doc.org._addListItem(_$dialog, child, issearch, "no"); //자식 노드를 한번에 추가
								});
							}
							return true;
						}

						if (_node.data.type.toUpperCase() == "G" || _node.data.type.toUpperCase() == "P") return true; // G : 개인주소록 > 그룹, P : 개인주소록 > 개인
						//if (_node.data.type.toUpperCase() == "P") return true;
					}

					var nodeKey = _node.data.key; //중복여부 체크용 키값
					if (issearch) {
						nodeKey = _node.data.orgdata.key; //검색 결과에서는 orgdata.key를 사용해야 함
					}

					// 중복 체크
					//if ($dwp.ui.org._dblItemCheck($("div.dwp-item", $(".dwp-list-body", _$gridlist)), _node.data.key)) {
					if ($dwp.ui.org._dblItemCheck($("div.dwp-item", $(".dwp-list-body", _$gridlist)), nodeKey)) {
						if (_overlapCheck != "no") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err10") });
						}
						return true;
					}

					// 건수 체크
					if (_gridinfo.hasOwnProperty("count")) {
						if (_gridinfo.count > 0) {
							if ($("div.dwp-item", $(".dwp-list-body", _$gridlist)).size() >= _gridinfo.count) {
								if (_overlapCheck != "no") {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err30").replace(/\{\$1\}/g, _gridinfo.count) }); //최대 [ " + _gridinfo.count + " ]명 까지 선택가능합니다.
								}
								return true;
							}
						}
					}

					_org = new $dwp.ui.org.data.org(_node.data.orgdata);
					_$item = $("<div class='dwp-item dwp-cursor org-type'>" + _$$.mail.doc.org.getDispName(_org.oinfo, true) + "<button type='button' class='btn-cancel'>삭제</button></div>")
						.appendTo($(".dwp-list-body", _$gridlist_sub))
						.data("orgdata", _node.data.orgdata);

					if (_node.data.orgdata.type == "B" || _node.data.orgdata.type == "G") {
						_$item.addClass("is-folder");
					}

					_$item.off("click").on("click", function (e) {
						if (e.currentTarget === this) {
							//$(this).toggleClass("active");
						}
					});
					$("button", _$item)
						.off("click")
						.on("click", function () {
							$(this).parent().remove();
						});

					if (_issearch) {
						$(".dwp-list-body div.dwp-item.active", _$search).removeClass("active");
					} else {
						$dwp.ui.org._getTree(_$dialog).getNode(_node.data.key).select(false);
					}
				},

				/* _$$.mail.doc.org._commBtnProc  >>  조직도 선택화면의 [수신], [참조], [비밀참조] 버튼 클릭 할 때*/
				_commBtnProc: function (_$dialog, id, ui) {
					var _me = this,
						_ui = ui || null,
						_$treewrap = $("div.dwp-tree", _$dialog.element),
						_issearch = _$treewrap.is(":hidden"),
						_$search = $("div.dwp-search-result", _$dialog.element),
						_$gridlist = $dwp.ui.org._getGrid(_$dialog);
					_$dialog.options.addtype = id; //수신, 참조, 비밀참조 각 영역에 한번 추가하고 왼쪽 조직도 트리에서 더블클릭 할 경우 마지막 추가한 부분에 자동으로 넣기 위해서 사용함

					switch (id) {
						case "sendto":
						case "copyto":
						case "blindcopyto":
							if (_issearch) {
								$(".dwp-list-body div.dwp-item.active", _$search).each(function () {
									_me._addListItem(_$dialog, $(this).data("orgdata"), true);
								});
							} else {
								if (_ui != null) {
									var _node = ui.draggable.data("orgdata");
									if (_node) {
										$("div.dwp-item.active", ui.helper.parent()).each(function () {
											if ($(this).data("orgdata")) {
												var _ndata = { data: $(this).data("orgdata") };
												_me._addListItem(_$dialog, _ndata);
											}
										});
									} else {
										$.each($dwp.ui.org._getTree(_$dialog).getSelectedNodes(), function (i, _node) {
											_me._addListItem(_$dialog, _node);
										});
									}
								} else {
									$.each($dwp.ui.org._getTree(_$dialog).getSelectedNodes(), function (i, _node) {
										_me._addListItem(_$dialog, _node);
									});
								}
								$.each($dwp.ui.org._getTree(_$dialog).getSelectedNodes(), function (i, _node) {
									//Tree : Select Node false
									_node.select(false);
								});
								$("span.dynatree-active", $dwp.ui.org._getTree(_$dialog).element).removeClass("dynatree-active"); //Tree : Active Node RemoveClass
							}
							break;
						case "deleteall":
							if ($("div.dwp-item", _$gridlist).size() > 0) {
								$("div.dwp-item", _$gridlist).remove();
							}

							break;
					}
				},

				/* _$$.mail.doc.org._initDataLoad  >>  수신인선택 Dialog Open하고 기존 선택된 사용자/부서 정보들을 Dialog에 추가*/
				_initDataLoad: function (_$dialog) {
					var _me = this,
						_selorg = {};
					$.each(_$dialog.options.fld, function (idx, fld) {
						_selorg[fld] = _$$.mail.doc.org.getNameListItem(_$dialog.options.openelement, fld);
					});
					$.each(_selorg, function (_nm, odata) {
						$.each(odata, function (_idx, _item) {
							var _area = _nm == "SendTo" ? "form-receive" : _nm == "CopyTo" ? "form-refer" : _nm == "BlindCopyTo" ? "form-blind-refer" : "form-receive",
								_$gridlist = $dwp.ui.org._getGrid(_$dialog),
								_$gridlist_sub = $("div." + _area, _$gridlist),
								_$list = $(".dwp-list-body", _$gridlist_sub),
								_org = new $dwp.ui.org.data.org(_item),
								_$item = $("<div class='dwp-item dwp-cursor org-type'>" + _$$.mail.doc.org.getDispName(_org.oinfo, true) + "<button type='button' class='btn-cancel'>삭제</button></div>")
									.appendTo(_$list)
									.data("orgdata", _item);

							if (_item.type == "B") {
								_$item.addClass("is-folder");
							}

							_$item.off("click").on("click", function (e) {
								if (e.currentTarget === this) {
									//$(this).toggleClass("active");
								}
							});
							$("button", _$item)
								.off("click")
								.on("click", function () {
									$(this).parent().remove();
								});
						});
					});

					$(".btn-address-save", _$dialog.element)
						.off("click")
						.on("click", function () {
							//수신처 저장 버튼 이벤트
							_$$.mail.doc.org.savereceivelist(_$dialog);
						});

					$(".btn-address-call", _$dialog.element)
						.off("click")
						.on("click", function () {
							//수신처 불러오기 버튼 이벤트
							_$$.mail.doc.org.savereceive_call(_$dialog, "dialog");
						});
				},

				/* _$$.mail.doc.org.savereceive_call_callback  >>  수신처 불러오기*/
				savereceive_call_callback: function (obj, _name, type) {
					var _me = this,
						_ele = type == "dialog" ? obj.opener : obj.element;

					var setOrgData = function (_nm, _data) {
						var _area = _nm == "SendTo" ? "form-receive" : _nm == "CopyTo" ? "form-refer" : _nm == "BlindCopyTo" ? "form-blind-refer" : "form-receive",
							alldata = _data.split(";"),
							_$gridlist = $dwp.ui.org._getGrid(obj),
							_$gridlist_sub = $("div." + _area, _$gridlist),
							_$list = $(".dwp-list-body", _$gridlist_sub),
							_org = null,
							_$item = null;
						$.each(alldata, function (_i, _item) {
							_org = new $dwp.ui.org.data.org(_item);
							_$item = $("<div class='dwp-item dwp-cursor org-type'>" + _$$.mail.doc.org.getDispName(_org.oinfo, true) + "<button type='button' class='btn-cancel'>삭제</button></div>")
								.appendTo(_$list)
								.data("orgdata", _org.oinfo);

							if (_org.oinfo.type == "B") {
								_$item.addClass("is-folder");
							}

							_$item.off("click").on("click", function (e) {
								if (e.currentTarget === this) {
									//$(this).toggleClass("active");
								}
							});
							$("button", _$item)
								.off("click")
								.on("click", function () {
									$(this).parent().remove();
								});
						});
					};

					var callback = function (_post, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								$(".dwp-item.dwp-cursor.org-type", obj.element).remove();
								if (data["SendTo"] != "") setOrgData("SendTo", data["SendTo"]);
								if (data["CopyTo"] != "") setOrgData("CopyTo", data["CopyTo"]);
								if (data["BlindCopyTo"] != "") setOrgData("BlindCopyTo", data["BlindCopyTo"]);
								return;
							}
						}
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
						return;
					};
					_$$.mail.com.cmdpost({ actiontype: "receive_list_getorgdata", Arg1: _name }, callback);
				},

				/* _$$.mail.doc.org.savereceive_call  >>  수신처 불러오기*/
				savereceive_call: function (obj, type) {
					var _me = this,
						_html = "",
						_list = null,
						_sel = null;
					var _buttons = [
						{
							title: $fn.getCodeMsg("mail.btn.ok"),
							click: function (_obj) {
								_sell = $(".tree-item.active", _obj.element);
								if (_sell.size() == 0) {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt25") });
									return;
								}
								if (_sell.size() > 1) {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt27") });
									return;
								}
								_me.savereceive_call_callback(obj, _sell.text(), type);
								_obj.close();
							}
						},
						{
							title: $fn.getCodeMsg("mail.btn.cancel"),
							click: function (_obj) {
								_obj.close();
							}
						}
					];
					_html = '<div class="dwp-table-xxx">';
					_html += '<div class="aligner" data-bottom="xs">';
					_html += '<div class="left"><h3>' + $fn.getCodeMsg("mail.title.receivelisttitle") + "</h3></div>";
					_html += '<div class="right"><div class="dwp-btn receive-list-del"><span>' + $fn.getCodeMsg("mail.btn.deletedoc") + "</span></div></div>";
					_html += "</div>";
					_html += '<div class="dwp-tree-srch-result" style="min-height:223px; max-height:223px; overflow-y:auto; overflow-x:hidden;">';

					$fn.cmdPostEx({
						url: $fn.getProxyUrl($fn.getPath("mail") + "/wcmdpost?openform"),
						async: false,
						dataType: "json",
						data: { actiontype: "dblookup", arg3: "($Profiles)", arg4: "wFrmReceiveListProfile", arg6: "1" },
						success: function (data, textStatus) {
							if (data.cnt == "0") {
								_html += '<div class="dwp-orange dwp-center" style="padding-top:50px;">' + $fn.getCodeMsg("mail.data.cmt04") + "</div>";
							} else {
								_list = data.rtnval.split("*$*");
								$.each(_list, function (i, d) {
									_html += '<div class="tree-item dwp-cursor">' + d + "</div>";
								});
							}
						}
					});
					_html += "</div></div>";

					var receivelist_del = function (_dlg) {
						//선택한 수신처 리스트 삭제하기
						var deldata = "",
							_select = $(".tree-item.dwp-cursor.active", _dlg);
						$.each(_select, function (_i, _o) {
							deldata += (deldata != "" ? "*$*" : "") + $(_o).text();
						});
						if (deldata == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt25") });
							return;
						}
						var callback = function (_post, data) {
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									_select.remove();
									return;
								}
							}
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
							return;
						};
						_$$.mail.com.cmdpost({ actiontype: "receive_list_delete", Arg1: deldata }, callback);
					};

					$fn.dialog(null, {
						modal: true,
						resizable: true,
						draggable: true,
						title: $fn.getCodeMsg("mail.title.receivelistselect"),
						width: 400,
						height: 440,
						show: "fade", //effect
						hide: "fade", //effect
						ismobile: false,
						//autoOpen: false,		//.dialog("open")호출시만 열림
						buttons: _buttons,
						//content : {url : _options.cdb + "/wFrmReceiptRecall?ReadForm", data : _opt}
						open: function (_opt) {
							var _this = this;
							_dlg = _opt.target;
							$(".tree-item", _dlg)
								.off("click")
								.on("click", function () {
									$(this).toggleClass("active");
								});
							$(".receive-list-del", _dlg)
								.off("click")
								.on("click", function () {
									receivelist_del(_dlg);
								});
						},
						content: { html: _html }
					});
				},

				/* _$$.mail.doc.org.savereceivelist_callback  >>  수신처 저장 (savereceivelist function에서 호출)*/
				savereceivelist_callback: function (dlg, obj, __obj) {
					var _rtn = $dwp.ui.org._getGridData(dlg),
						_org = null,
						_val = "",
						postdata = $.extend({ Arg1: "", Arg2: "", Arg3: "", Arg4: "" }, __obj),
						_cnt = 0;
					$.each(_rtn, function (nm, data) {
						$.each(data, function (_nm, _data) {
							_val = "";
							$.each(_data, function (_idx, odata) {
								_org = new $dwp.ui.org.data.org(odata);
								if (_org.oinfo["type"] == "B") {
									_val += (_val != "" ? ";" : "") + _org.oinfo["key"] + "^" + _org.oinfo["fullorgcode"];
									_cnt += 1;
								} else {
									if (_org.oinfo["dutycode"] == "" && _org.oinfo["orgcode"] == "") {
										//외부메일주소
										_val += (_val != "" ? ";" : "") + _org.sinfo;
										_cnt += 1;
									} else {
										//내부 사용자
										_val += (_val != "" ? ";" : "") + _org.oinfo["key"] + "^" + _org.oinfo["orgcode"];
										_cnt += 1;
									}
								}
							});
							if (_nm == "SendTo") {
								postdata["Arg2"] = _val;
							} else if (_nm == "CopyTo") {
								postdata["Arg3"] = _val;
							} else {
								postdata["Arg4"] = _val;
							}
						});
					});
					if (_cnt == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt26") });
						return;
					}
					postdata["actiontype"] = "receive_list_save";
					var callback = function (_obj, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.cnt == "1") {
									obj.close();
									return;
								}
							}
						}
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
						return;
					};
					_$$.mail.com.cmdpost(postdata, callback);
				},

				/* _$$.mail.doc.org.savereceivelist  >>  수신처 저장*/
				savereceivelist: function (dlg) {
					var _me = this,
						_html = "";
					var _buttons = [
						{
							title: $fn.getCodeMsg("mail.btn.savedoc"),
							click: function (obj) {
								var __ele = obj.element,
									__title = $.trim($("input[name=Subject]", __ele).xval().replace(/  /g, " ")).replace(/\*\$\*/g, "");
								if (__title == "") {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt23") });
									return;
								}
								var callback = function (_obj, data) {
									if (data.hasOwnProperty("result")) {
										if (data.result >= "200" && data.result < "300") {
											if (data.cnt == "1") {
												$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.alt24") }).done(function () {
													//같은 이름의 수신처 리스트가 있습니다. 기존 정보를 수정하시겠습니까?
													_me.savereceivelist_callback(dlg, obj, _obj);
												});
											} else {
												_me.savereceivelist_callback(dlg, obj, _obj);
											}
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return;
										}
									}
								};
								_$$.mail.com.cmdpost({ actiontype: "receive_list_check", Arg1: __title }, callback);
							}
						},
						{
							title: $fn.getCodeMsg("mail.btn.cancel"),
							click: function (obj) {
								obj.close();
							}
						}
					];

					_html = $fn.getCodeMsg("mail.msg.alt23") + "<br>";
					_html += '<div class="dwp-row"><div class="dwp-value"><div class="dwp-input expended">';
					_html += '<input name="Subject" value=""></div></div></div>';

					$fn.dialog(null, {
						modal: true,
						resizable: true,
						draggable: true,
						title: $fn.getCodeMsg("mail.btn.orgreceivesave"),
						width: 400,
						height: 250,
						show: "fade", //effect
						hide: "fade", //effect
						ismobile: false,
						//autoOpen: false,		//.dialog("open")호출시만 열림
						buttons: _buttons,
						//content : {url : _options.cdb + "/wFrmReceiptRecall?ReadForm", data : _opt}
						content: { html: _html }
					});
				},

				// _$$.mail.doc.org.getNameListItem  >> 선택대상 전체리스트가져오기
				getNameListItem: function (_el, _nm) {
					var _me = this,
						tmp = null,
						_$namelist = $("div.Dsp" + _nm, _el),
						_rtn = [];

					$.each($("div.target", _$namelist), function (i, o) {
						tmp = $(this).data("data-org");
						if (typeof tmp != "undefined") _rtn.push($(this).data("data-org"));
					});
					return _rtn;
				},

				/* _$$.mail.doc.org.delNameListItem  >>  수신, 참조, 비밀참조 형식으로 추가된 선택대상 전체 삭제 */
				delNameListItem: function (_obj) {
					var _type = _obj.hasOwnProperty("uiDialog") ? "dialog" : "doc",
						_opener = null,
						_fields = ["SendTo", "CopyTo", "BlindCopyTo"];
					if (_type == "dialog") {
						if (_obj.options.fld.length == 0) return;
						_opener = _obj.options.openelement;
						$.each(_obj.options.fld, function (idx, fld) {
							$("div.Dsp" + fld + " > div.target", _opener).remove();
							$("textarea[name='" + fld + "']", _opener).xval("");
							$("textarea[name='" + fld + "Full']", _opener).xval("");
						});
					} else {
						$.each(_fields, function (idx, fld) {
							$("div.Dsp" + fld + " > div.target", _obj.element).remove();
							$("textarea[name='" + fld + "']", _obj.element).xval("");
							$("textarea[name='" + fld + "Full']", _obj.element).xval("");
						});
					}
				},

				/* _$$.mail.doc.org.duplicationAddress  >>  수신, 참조, 비밀참조 중복추가 체크*/
				duplicationAddress: function (_ele, key) {
					var _val = ";" + $("textarea[name=SendTo]", _ele).xval() + ";" + $("textarea[name=CopyTo]", _ele).xval() + ";" + $("textarea[name=BlindCopyTo]", _ele).xval() + ";";
					return _val.indexOf(";" + key + ";") != -1 ? true : false;
				},

				/* _$$.mail.doc.org.displayNameList  >>  수신인을 화면에 표시 */
				displayNameList: function (item, _nm, obj, cdata) {
					var _me = this,
						_el = null,
						_options = null,
						_sendme = false,
						_dspname = "",
						_cdata = $.extend({ len: 0, idx: 0 }, cdata);
					var _$namelist = null,
						_$inputaddr = null,
						_$cnt = 0,
						_$nametarget = null,
						_$span = null,
						_org = null;
					/*
										20221028 mjkim _dispcnt => 기본으로 표시되어야할 수신자 수
					*/

					_dispcnt = 10;

					if (typeof obj.options.openelement != "undefined") {
						//수신인지정 Dialog에서 호출할 경우
						_el = obj.options.openelement;
						_options = obj.options;
					} else {
						_el = obj.element; //작성화면에서 호출 할 경우
						_options = obj.options;
					}

					_$namelist = $("div.Dsp" + _nm, _el);

					if (_options.isedit == true) {
						_sendme = $("input[name=send_me]", _el).is(":checked");
						_$inputaddr = $("div.input-addr", _$namelist);
						_$nametarget = $("<div class='target namepicker-target'></div>");
						_$inputaddr.before(_$nametarget);
					} else {
						_$nametarget = $("<div class='mail-target dwp-cursor'></div>").appendTo(_$namelist);
					}
					_$span = null;
					_org = new $dwp.ui.org.data.org(item);
					console.log("Mail ORG", _org);
					_dspname = _$$.mail.doc.org.getDispName(_org.oinfo, true);

					if (item.type == "B" || item.type == "G") {
						if (_options.isedit == true) {
							$("<span>" + _dspname + "</span>").appendTo(_$nametarget);
						} else {
							/*
														if ((_cdata.len - 2) < _cdata.idx) {
															_$span = $("<span style='margin-right:10px;'>" + _dspname + "</span>").appendTo(_$nametarget);
															if (_cdata.len > 1) {
																var _span = "<span class=\"dwp-cursor\" id=\"" + _nm + "\" vtype=\"hidden\" vcount=\"" + (_cdata.len - 1) + "\"><nobr>";
																_span += $fn.getCodeMsg("mail.data.cmt02").replace(/{\$1}/g, (_cdata.len - 1)) + "</nobr></span>";
																var _collapse = $(_span).appendTo(_$namelist);
																_collapse.off("click").on("click", function () {
																	_$$.mail.doc.showSendList(_el, this, _nm);
																});
															}
														} else {
															_$span = $("<span style='margin-right:10px;'>" + _dspname + ",</span>").appendTo(_$nametarget);
														}
														if (_cdata.idx > 0) {
															_$nametarget.addClass("dwp-hidden");
														}
							*/
							/*
								20221028 mjkim 최소 표시 수신인 설정
							*/

							if (_cdata.len - 2 < _cdata.idx) {
								_$span = $("<span style='margin-right:10px;'>" + _dspname + "</span>").appendTo(_$nametarget);
								if (_cdata.len > _dispcnt) {
									var _span = '<span class="dwp-cursor" id="' + _nm + '" vtype="hidden" vcount="' + (_cdata.len - _dispcnt) + '"><nobr>';
									_span += $fn.getCodeMsg("mail.data.cmt02").replace(/{\$1}/g, _cdata.len - _dispcnt) + "</nobr></span>";
									var _collapse = $(_span).appendTo(_$namelist);
									_collapse.off("click").on("click", function () {
										_$$.mail.doc.showSendList(_el, this, _nm);
									});
								}
							} else {
								_$span = $("<span style='margin-right:10px;'>" + _dspname + ",</span>").appendTo(_$nametarget);
							}

							if (_cdata.idx > _dispcnt - 1) {
								_$nametarget.addClass("dwp-hidden");
							}
						}
					} else {
						/*

												if (_options.isedit == true) {
													_$span = $("<span>" + _dspname + "</span>").appendTo(_$nametarget);
												} else {
													if ((_cdata.len - 2) < _cdata.idx) {
														_$span = $("<span style='margin-right:10px;'>" + _dspname + "</span>").appendTo(_$nametarget);
														if (_cdata.len > 1) {
															var _span = "<span class=\"dwp-cursor\" id=\"" + _nm + "\" vtype=\"hidden\" vcount=\"" + (_cdata.len - 1) + "\"><nobr>";
															_span += $fn.getCodeMsg("mail.data.cmt02").replace(/{\$1}/g, (_cdata.len - 1)) + "</nobr></span>";
															var _collapse = $(_span).appendTo(_$namelist);
															_collapse.off("click").on("click", function () {
																_$$.mail.doc.showSendList(_el, this, _nm);
															});
														}
													} else {
														_$span = $("<span style='margin-right:10px;'>" + _dspname + ",</span>").appendTo(_$nametarget);
													}
													if (_cdata.idx > 0) {
														_$nametarget.addClass("dwp-hidden");
													}
												}
						*/

						if (_options.isedit == true) {
							_$span = $("<span>" + _dspname + "</span>").appendTo(_$nametarget);
						} else {
							if (_cdata.len - 2 < _cdata.idx) {
								_$span = $("<span style='margin-right:10px;'>" + _dspname + "</span>").appendTo(_$nametarget);
								if (_cdata.len > _dispcnt) {
									var _span = '<span class="dwp-cursor" id="' + _nm + '" vtype="hidden" vcount="' + (_cdata.len - _dispcnt) + '"><nobr>';
									_span += $fn.getCodeMsg("mail.data.cmt02").replace(/{\$1}/g, _cdata.len - _dispcnt) + "</nobr></span>";
									var _collapse = $(_span).appendTo(_$namelist);
									_collapse.off("click").on("click", function () {
										_$$.mail.doc.showSendList(_el, this, _nm);
									});
								}
							} else {
								_$span = $("<span style='margin-right:10px;'>" + _dspname + ",</span>").appendTo(_$nametarget);
							}
							if (_cdata.idx > _dispcnt - 1) {
								_$nametarget.addClass("dwp-hidden");
							}
						}
					}
					_$nametarget.data("data-org", item);

					if (_options.isedit && _sendme == false) {
						// RFC822형태의 외부메일주소는 편집활성화 : jwlee 2023-08-09
						if (item.type == "S" && item.key.indexOf("@") != -1) {
							var _editBtn = '<a class="btn-edit">' + '<span class="dwp-icon-edit">' + '<img src="/tcclibs/images/common/icon-modify.svg" style="width:14px; padding:0px 0px 5px 0px; margin-left:5px;">' + "</span>" + "</a>";

							$(_editBtn)
								.appendTo(_$nametarget)
								.off("click")
								.on("click", function () {
									var _nametarget = $(this).closest(".namepicker-target");
									var _data = $(_nametarget).data("data-org");
									var _span = $(_nametarget).find("span")[0];
									var _btn = $(_nametarget).find("a");
									var _toggle = function (_mode) {
										if (_mode) {
											$(_span).addClass("dwp-none");
											$(_btn).addClass("dwp-none");
											$(_nametarget).closest("div.dwp-namepicker-grouping").off("click");
										} else {
											$(_span).removeClass("dwp-none");
											$(_btn).removeClass("dwp-none");
											$(_nametarget).find("input").remove();
											$(_nametarget)
												.closest("div.dwp-namepicker-grouping")
												.off("click")
												.on("click", function () {
													$("input[name=qsearch]", $(this)).focus();
												});
										}
									};
									var _edit = function () {
										var _input = '<input style="border:none; background:none; height:20px; width:200px; margin-top:-4px; padding:5px;">';
										var _inputbox = $(_input).attr("value", _data.username);

										$(_inputbox).appendTo(_nametarget);
										$(_inputbox)
											.focus()
											.off("blur")
											.on("blur", function () {
												_complete();
											})
											.off("keydown")
											.on("keydown", function (e) {
												switch (e.keyCode) {
													case 13:
														_complete();
														break;
													case 27:
														_cancel();
														break;
												}
											});

										_toggle(true);
									};
									var _cancel = function () {
										_toggle(false);
									};
									var _complete = function () {
										var _val = $(_nametarget).find("input").val();
										var _origVal = _data.key;

										if ($.trim(_val) == "") {
											$fn.toast({ msg: $fn.getCodeMsg("mail.msg.err39") }); // 수정할 메일주소를 입력하지 않았습니다.
											_cancel();
											return;
										}
										if (_val.indexOf("@") < 0) {
											$fn.toast({ msg: $fn.getCodeMsg("mail.msg.err40") }); // 올바른 메일 주소가 아닙니다.
											_cancel();
											return;
										}
										if (_val == _data.key) {
											_cancel();
											return;
										}

										if (_$$.mail.doc.org.duplicationAddress(_el, $.trim(_val)) == true) { // 2024-12-21
											$fn.toast({ msg: "[" + _val + "] " + $fn.getCodeMsg("mail.msg.err11") });
											_cancel();
											return;
										}

										// _data 업데이트
										_data.username = _val;
										_data.key = _val;
										_data.notesid = _val;

										// 필드 갱신
										var _org = new $dwp.ui.org.data.org(_data);
										var _vlist = [];
										var _$fld = null;
										var _$fldfull = null;
										var _tmp = "";
										if (_options.fld != "") {
											_$fld = $("textarea[name='" + _nm + "']", _el);

											if (_$fld.size() > 0) {
												_vlist = _$fld.val().split(";");
												_tmp = $.map(_vlist, function (v, i) {
													if (v == _origVal) return _org.oinfo.key;
													else return v;
												}).join(";");
												_$fld.val(_tmp);
											}

											_$fldfull = $("textarea[name='" + _nm + "Full']", _el);
											if (_$fldfull.size() > 0) {
												_vlist = _$fldfull.val().split(";");
												_tmp = $.map(_vlist, function (v, i) {
													var _t = v.split("^");
													if (_t[1] == _origVal) return _org.sinfo;
													else return v;
												}).join(";");
												_$fldfull.val(_tmp);
											}
										}

										// _data 업데이트
										$(_nametarget).data("data-org", _data);
										$(_span).text(_val);

										_toggle(false);
									};

									_edit();
								});
						}

						$("<a class='btn-del'><span class=\"dwp-icon-cancel\"></span></a>")
							.appendTo(_$nametarget)
							.off("click")
							.on("click", function () {
								var _$item = $(this).parents(".namepicker-target"),
									_item = _$item.data("data-org"),
									_val = "",
									_vlist = [],
									_org = new $dwp.ui.org.data.org(_item),
									_$fld = null,
									_$fldfull = null;

								if (_options.fld != "") {
									_$fld = $("textarea[name='" + _nm + "']", _el);
									if (_$fld.size() > 0) {
										_vlist = _$fld.val().split(";");
										_val = $.map(_vlist, function (v, i) {
											if (v != _org.oinfo.key) {
												return v;
											}
										}).join(";");
										_$fld.val(_val);
									}
									_$fldfull = $("textarea[name='" + _nm + "Full']", _el);
									if (_$fldfull.size() > 0) {
										_vlist = _$fldfull.val().split(";");
										_val = $.map(_vlist, function (v, i) {
											if (v != _org.sinfo) {
												return v;
											}
										}).join(";");
										_$fldfull.val(_val);
									}
								}
								_$item.remove();
							});
					} else {
						if (_options.isedit == false) {
							if (item.key.indexOf("@") == -1) {
								//이거슨 내부
								if (item.type == "S") {
									_$nametarget.attr({ "data-type": "profile", "data-empno": item.empno, "data-orgcode": item.orgcode });
									_$nametarget.off("click").on("click", function () {
										$dwp.ui.bizcard.init($(this), { ismobile: _options.ismobile });
									});
								}
							} else {
								_$nametarget.off("click").on("click", function () {
									//메일 조회화면... 수신인 이름 클릭
									_dspname = $dwp.core.lang.getCurMsg(item.type == "S" ? item.username : item.orgname);
									if (_dspname.indexOf("<") != -1) {
										_dspname = _$$.mail.com
											.strMiddle(_dspname, "<", ">")
											.replace(/\&lt\;/gi, "<")
											.replace(/\gt\;/gi, ">");
									}

									$dwp.ui.qtdialog.init($(this), {
										qtid: "mail_user_info",
										title: _dspname,
										initcallback: function (_$qtdialog) {
											var _div = $(".mail_user_info", _$qtdialog.element),
												_btn = null;
											_btn = $('<div class="dwp-cursor">' + $fn.getCodeMsg("mail.btn.mailcreate") + "</div>").appendTo(_div); //메일쓰기
											_btn.off("click").on("click", function () {
												_$$.mail.doc.doc_SelectSendmail(item, _el);
												_$qtdialog.close();
											});
											if (item.type == "S") {
												if (item.notesid.indexOf("@") != -1) {
													_btn = $('<div class="dwp-cursor" style="margin-top:8px;">' + $fn.getCodeMsg("mail.btn.addaddress") + "</div>").appendTo(_div); //주소록 등록
													_btn.off("click").on("click", function () {
														_$$.mail.doc.doc_addAddress(item, _el);
														_$qtdialog.close();
													});
												}
											}
										},
										buttons: [],
										content: { url: "", html: '<div class="mail_user_info"></div>' }
									});
								});
							}
						}
					}
				},

				/* _$$.mail.doc.org.orgSetVal  >>  선택된 수신인 정보를 화면에 추가 */
				orgSetVal: function (_$dialog) {
					if (_$dialog.options.fld.length == 0) return;
					var _rtn = $dwp.ui.org._getGridData(_$dialog),
						_org = null,
						_fld = null,
						_$fld = null,
						_$fldfull = null,
						_val = "";
					var _opener = _$dialog.options.openelement;
					var addval = function (_nm, _addval) {
						_fld = $("textarea[name='" + _nm + "']", _opener);
						if (_fld.size() > 0) {
							_val = _fld.xval();
							if (_val == "") {
								_fld.xval(_addval);
							} else {
								_fld.xval(_val + ";" + _addval);
							}
						}
					};

					$.each(_rtn, function (nm, data) {
						$.each(data, function (_nm, _data) {
							$.each(_data, function (_idx, odata) {
								_org = new $dwp.ui.org.data.org(odata);
								addval(_nm, odata.key);
								addval(_nm + "Full", _org.sinfo);
								_$$.mail.doc.org.displayNameList(odata, _nm, _$dialog);
							});
						});
					});
				},

				/* _$$.mail.doc.org.read_show_name  >>  메일 조회화면 열릴 때 수신,참조,비밀참조 화면에 표시*/
				read_show_name: function (_doc) {
					var _me = this,
						fld = ["SendTo", "CopyTo", "BlindCopyTo"],
						odata = {},
						tmp = null,
						arrval = [],
						_org = null,
						_cnt = 0,
						_cdata = { len: 0, idx: 0 };
					$.each(fld, function (ii, nm) {
						tmp = $("textarea[name='" + nm + "Full']", _doc.element).xval();
						if (tmp != "") {
							tmp = tmp.split(";");
							tmp = $.map(tmp, function (_val) {
								if ($.trim(_val) != "") return $.trim(_val);
							});
							_cdata.len = tmp.length;
							$.each(tmp, function (_ii, _val) {
								_cdata.idx = _ii;
								_org = new $dwp.ui.org.data.org($.trim(_val));
								_$$.mail.doc.org.displayNameList(_org.oinfo, nm, _doc, _cdata);
								_cnt += 1;
							});
						}
					});
					if (_doc.options.isedit == true) return; //편집상태이면 여기서 종료
					if (_cnt > 0) return; //신규 메일이면 여기서 종료

					/*##############################################################################*/
					/*		과거 메일 임시로 수신,참조,비밀참조를 표시함... */
					var MemberList = $("input[name=MemberList]", _doc.element).xval(),
						_arr = "",
						_subarr = "",
						_sendto = "",
						_copyto = "",
						_blindcopyto = "";
					if (MemberList != "") {
						_arr = MemberList.split(";");
						$.each(_arr, function (i, o) {
							_subarr = o.split("^");
							if (_subarr[0] == "[수신]") {
								_sendto += _sendto != "" ? ", " : "";
								if (_subarr[5] == "PA") {
									//개인주소록..
									_sendto += _subarr[1];
								} else if (_subarr[2] == "부서") {
									_sendto += _subarr[1];
								} else {
									_sendto += _subarr[1] + (_subarr[2] != "" ? "/" + _subarr[2] : "") + (_subarr[3] != "" ? "/" + _subarr[3] : "");
								}
								_cnt += 1;
							} else if (_subarr[0] == "[참조]") {
								_copyto += _copyto != "" ? ", " : "";
								if (_subarr[5] == "PA") {
									//개인주소록..
									_copyto += _subarr[1];
								} else if (_subarr[2] == "부서") {
									_copyto += _subarr[1];
								} else {
									_sendto += _subarr[1] + (_subarr[2] != "" ? "/" + _subarr[2] : "") + (_subarr[3] != "" ? "/" + _subarr[3] : "");
								}
								_cnt += 1;
							} else {
							}
						});
						if (_sendto != "") {
							$("div.DspSendTo", _doc.element).html(_sendto);
						}
						if (_copyto != "") {
							$("div.DspCopyTo", _doc.element).html(_copyto);
						}
					}

					if (_cnt == 0) {
						_sendto = "";
						_copyto = "";
						_blindcopyto = "";

						$.each(fld, function (ii, nm) {
							tmp = $("textarea[name='" + nm + "']", _doc.element).xval();

							if (tmp != "") {
								tmp = tmp.split(";");
								tmp = $.map(tmp, function (_val) {
									if ($.trim(_val) != "") return $.trim(_val);
								});
								_cdata.len = tmp.length;
								$.each(tmp, function (_ii, _val) {
									_cdata.idx = _ii;
									_org = new $dwp.ui.org.data.org("S^" + $.trim(_val) + "^^" + $.trim(_val) + "^^^^^^^^^^");
									_$$.mail.doc.org.displayNameList(_org.oinfo, nm, _doc, _cdata);
									_cnt += 1;
								});
							}
						});
					}
				}
			}
		},

		/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 *
		 * 				여기서부터 보기 화면
		 *
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 */

		/* view function */
		view: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},

			/* _$$.mail.view.init */
			init: function (opt, el) {
				var _me = this,
					_view = null,
					/*
						20230424 conview값이 없는 경우 1 세팅
					*/
					opt = $.extend({ conview: "1" }, opt),
					_opt = _me._initOptions(opt);

				console.log("mail.view.init :>> ");

				_view = $fn.view(_opt, el);

				$fn.lnbCountRefresh(); //각 보기 화면이 열릴 때무조건 건수계산 및 메일 전체 사이즈 계산하기 (2017.01.19)

				//if ($.inArray(_opt.viewalias, ["($inbox_unread)","($inbox_all)","($inbox_in)","($inbox_in_app)","($inbox_ext)"]) != -1) {
				//	$fn.lnbCountRefresh();		//==>> 최초 메일 화면을 열었을때 보기화면을 열면서 함수를 한번 호출 해야 함  (좌측 메뉴의 각 건수를 표시 함)
				//}
			},

			//선택된 팝업메뉴 수행 - 2020.03.16 by dwlee
			_contextMenuRun: function (key) {
				var _view = $fn.getInstance("view").element.view("instance");
				var _opt = _view.options;
				var _rows = _view.getChecked();

				var _nosel = false;
				var _unids = "";
				var _unid = "";

				var mdoc;

				_unids = $.map(_rows, function (v) {
					return v["@unid"];
				}).join(";");
				//체크된 문서가 없으면 마우스 클릭한 Row 에 대해서만 영향
				if (_unids == "") {
					_unids = _opt.clickedtr;
					_unid = _unids;
					_nosel = true;
				} else {
					var _unidarr = _unids.split(";");
					_unid = _unidarr[0];
				}

				//멀티전달은 아직 개발되지 않은 상태
				//멀티전달 개발 : 예정, 멀티(전체)회신 : 불가
				var mdoc = {
					options: {
						isresponsedoc: "0",
						cdb: _opt.cdb,
						unid: _unid
					}
				};

				function forceSel(_nosel, _unids, _view) {
					if (_nosel == true) {
						var _row$ = $("div[data-key-unid='" + _unids + "']", _view.element);
						var _chk = $("input[name='chk']", _row$).prop("checked", true);
						_row$.addClass("dwp-row-selected");
					}
				}

				switch (key) {
					//동성제약 요구사항 - 2020.06.09 by dwlee
					case "search_sender":
						var _searchopt = { fieldname: "From|AuthorName", unid: _unid };
						_$$.mail.com.searchMail(_searchopt);
						//$fn.alert({msg : "작업중입니다."});
						break;

					//동성제약 요구사항 - 2020.06.09 by dwlee
					case "search_receiver":
						var _searchopt = { fieldname: "SendTo|CopyTo|BlindCopyTo|SendToFull|CopyToFull|BlindCopyToFull", unid: _unid };
						_$$.mail.com.searchMail(_searchopt);
						//$fn.alert({msg : "작업중입니다."});
						break;

					case "create":
						if (_unid == "") {
							_$$.mail.com.newMail(_opt);
						} else {
							//동성제약 요구사항 - 2020.06.15 by dwlee
							_$$.mail.doc.replyforward(mdoc, { type: "fromcopy", body: "0", attach: "0" });
						}
						break;

					case "create_template":
						_view.createDocument({ param: { MemoTemplete: "1" } });
						break;

					case "pcsave":
						forceSel(_nosel, _unids, _view);
						_$$.mail.view.MailStore_LocalDonload(_view);
						break;

					case "movefolder":
						forceSel(_nosel, _unids, _view);
						_$$.mail.view.act_movetofolder(_view);
						break;

					case "ruleset":
						forceSel(_nosel, _unids, _view);
						_$$.mail.view.act_ruleset(_view);
						break;

					case "restoration":
						forceSel(_nosel, _unids, _view);
						_$$.mail.view.act_trash_restorationt(_view);
						break;

					case "addaddress":
						forceSel(_nosel, _unids, _view);
						_$$.mail.view.act_addaddress(_view);
						break;

					case "create_reject":
						$fn.dialog(null, {
							modal: true,
							resizable: false,
							draggable: true,
							islangconvert: false,
							title: $fn.getCodeMsg("mail.title.rejectmail"),
							width: 730,
							height: 460,
							show: "fade", //effect
							hide: "fade", //effect
							//send_data : opt,
							content: { url: _opt.cdb + "/wFrmRejectProfile?OpenForm", data: {} }
						});
						break;

					case "trash":
						forceSel(_nosel, _unids, _view);
						var delopt = { softdel: true, Arg1: _opt.viewalias, confirm: $fn.getCodeMsg("mail.msg.confirm06") };
						_$$.mail.view.viewDeleteDocument(_view, delopt);
						break;

					case "permanentdeletion":
						forceSel(_nosel, _unids, _view);
						var delopt = { softdel: false, Arg1: _opt.viewalias, confirm: $fn.getCodeMsg("mail.msg.confirm05") };
						_$$.mail.view.viewDeleteDocument(_view, delopt);
						break;

					case "starflag":
						forceSel(_nosel, _unids, _view);
						_$$.mail.view.star_flag(_view);
						break;

					case "readflag_read":
						_$$.mail.view.act_readflag_read(_view);
						break;

					case "readflag_unread":
						_$$.mail.view.act_readflag_unread(_view);
						break;

					case "readflag_allread":
						_$$.mail.view.act_readflag_allread(_view);
						break;

					case "readflag_allunread":
						_$$.mail.view.act_readflag_allunread(_view);
						break;

					case "copysend":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.doc.replyforward(mdoc, { type: "copysend", body: "1", attach: "1" });
						}
						break;

					case "forward":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							//멀티 전달 - 2020.04.14 by dwlee
							if (_unids.indexOf(";") > 0) {
								_$$.mail.view.replyforward_multi(_view, { unid: _unid, idlist: _unids, type: "forward", body: "1", attach: "1" });
							} else {
								_$$.mail.doc.replyforward(mdoc, { type: "forward", body: "1", attach: "1" });
							}
						}
						break;

					case "forwardbody":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							//멀티 전달 - 2020.04.14 by dwlee
							if (_unids.indexOf(";") > 0) {
								_$$.mail.view.replyforward_multi(_view, { unid: _unid, idlist: _unids, type: "forward", body: "0", attach: "1" });
							} else {
								_$$.mail.doc.replyforward(mdoc, { type: "forward", body: "1", attach: "0" });
							}
						}
						break;

					case "forwardbodyattach":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							//멀티 전달 - 2020.04.14 by dwlee
							if (_unids.indexOf(";") > 0) {
								_$$.mail.view.replyforward_multi(_view, { unid: _unid, idlist: _unids, type: "forward", body: "1", attach: "0" });
							} else {
								_$$.mail.doc.replyforward(mdoc, { type: "forward", body: "1", attach: "1" });
							}
						}
						break;

					case "reply":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.doc.replyforward(mdoc, { type: "reply", body: "1", attach: "0" });
						}
						break;

					case "replybody":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.doc.replyforward(mdoc, { type: "reply", body: "1", attach: "0" });
						}
						break;

					case "replybodyattach":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.doc.replyforward(mdoc, { type: "reply", body: "1", attach: "1" });
						}
						break;

					case "allreply":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.doc.replyforward(mdoc, { type: "allreply", body: "1", attach: "0" });
						}
						break;

					case "allreplybody":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.doc.replyforward(mdoc, { type: "allreply", body: "1", attach: "0" });
						}
						break;

					case "allreplybodyattach":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.doc.replyforward(mdoc, { type: "allreply", body: "1", attach: "1" });
						}
						break;

					//2024.10.11
					case "Korean":
					case "English":
					case "Chinese":
					case "Japanese":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.view.ai_act(_view, { idlist: _unids, type: key });
						}
						//AI 번역
						break;

					//2024.10.11
					case "summary":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.view.ai_act(_view, { idlist: _unids, type: "summary" });
						}
						//AI 요약
						break;

					//AI 명령어 직접입력
					case "cmdinput":
						if (_unid == "") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						} else {
							_$$.mail.view.ai_input(_view, { idlist: _unids, type: "input" });
						}
						break;

					default:
						$fn.alert({ msg: "업그레이드 작업중입니다." });
						break;
				}
			},


			//AI 명령어 직접입력 - 2024.10.11 by dwlee
			ai_input: function (view, obj) {
				//다이알 로그 창 팝업
				var _me = this;
				var _tghtml = "<div class='dwp-table-vertical-read'>";

				//샘플 문구 넣어줄것 - 2024.10.14
				_tghtml += "<div class='dwp-row'>";
				_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:180px'>" + $fn.getCodeMsg("mail.title.sample_command") + "</div>";
				_tghtml += "<div class='dwp-value'><div class='dwp-input expended'>" + $fn.getCodeMsg("mail.title.sample_txt") + "</div></div>";
				_tghtml += "</div>";

				_tghtml += "<div class='dwp-row'>";
				_tghtml += "<div class='dwp-value dwp-bold dwp-blue' style='width:100px'>" + $fn.getCodeMsg("mail.title.command") + "</div>";
				_tghtml += "<div class='dwp-value'><div class='dwp-input expended'><input type=text name=aicommand></div></div>";
				_tghtml += "</div>";
				_tghtml += "</div>";

				$dwp.ui.dialog.init(null, {
					show: { effect: "fade", duration: 300 }
					, hide: { effect: "fade", duration: 300 }
					//,draggable: true
					//,resizable: true
					, refdata: { view: view }
					, width: 800
					//, height: 600
					, modal: true
					, title: $fn.getCodeMsg("mail.title.aicommand")
					, buttons: [
						{
							title: $fn.getCodeMsg("comm.btn.confirm"), // 확인
							css: 'confirm',
							click: function (_$dialog) {
								var _del = _$dialog.element;

								obj.cmd = $("input[name=aicommand]", _del).xval() + ":";
								_$$.mail.view.ai_act(view, obj);
								_$dialog.close();
								//if (!$fn.validate($("form", _del))) { return false; }

							}
						},
						{
							title: $fn.getCodeMsg("comm.btn.cancel"), // 닫기
							css: 'cancel',
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					]
					, content: { url: "", html: _tghtml, data: {} }
					, initcallback: function (_$dialog) {

					}
				});
			},

			//2024.10.11
			ai_act: function (view, obj) {
				var _opt = view.options;
				var _el = view.element;

				var _cmd = "Translate the following text to Korean;";
				if (obj.type == "grammer") {
					_cmd = "Correct this sentence grammatically:";
					//요약해줘
				} else if (obj.type == "summary") {
					//_cmd = "Summarize the sentence below:";
					_cmd = "assitant는 user의 입력을 bullet point로 간단하게 요약해준다."
					/*
					assitant는 user의 입력을 bullet point로 3줄 요약해준다.
					*/
					//직접입력이면 - 2024.10.11
				} else if (obj.type == "input") {
					_cmd = obj.cmd;

					//2024.12.12 by dwlee
					var _chatopt = {
						cmd: _cmd,
						type: "direct"
					}
					_$$.mail.com.chatgpt_action(_chatopt);
					return;

				} else if (obj.type != "") {
					_cmd = "Translate the following text to " + obj.type;
				}
				$fn.cmdPostEx({
					url: $fn.getProxyUrl(_opt.cdb + "/wcmdpost?openform"), //본문을 Text로 추출하여 가져오기
					async: false,
					dataType: "json",
					data: {
						actiontype: "get_bodys",  //본문을 가져오는 함수
						postdata: obj.idlist
					},
					success: function (data, textStatus) {

						if (data.result >= "200" && data.result < "300") {

							var _$ai = $(".dwp-ai-body", _el);
							_$ai.html("");
							_$ai.html(data.body);
							var _body = _$ai.text();

							var _chatopt = {
								cmd: _cmd,
								ask: _body,
								type: obj.type
							}

							console.log("==================================================");
							console.log("_chatopt : ", _chatopt);
							console.log("==================================================");
							_$$.mail.com.chatgpt_action(_chatopt);

						} else {
							$fn.alert({ msg: "오류가 발생하였습니다." });
						}
					}
				});
			},

			/* _$$.mail.view.replyforward_multi  >>  보기에서 멀티문서 선택 후 전달 수행 - 2020.04.14 by dwlee */
			replyforward_multi: function (view, obj) {
				var _me = this,
					_option = view.options,
					_opt = {},
					_obj = $.extend({ type: "", body: "", attach: "", ismobile: false }, obj),
					_attach = "";

				if (_obj.attach == "0") {
					_attach = "&InheritParent=23"; //첨부파일 제외 URL
					_opt = {
						url: _option.cdb + "/wForward?OpenForm&ParentUNID=" + _obj.unid + _attach + "&inherit=" + _obj.type + "&copybody=" + _obj.body + "&copyattach=" + _obj.attach,
						multi: "y",
						ids: _obj.idlist
					};
					_$$.mail.com.newMail(_opt);
				} else {
					var callback = function (_cobj, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.msgcode == "success") {
									_opt = {
										url: _option.cdb + "/wForward?OpenForm&ParentUNID=" + data.unid + _attach + "&inherit=" + _obj.type + "&copybody=" + _obj.body + "&copyattach=" + _obj.attach,
										multi: "y",
										ids: _obj.idlist
									};
									_$$.mail.com.newMail(_opt);
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
									return;
								}
							}
						}
					};
					var _pdata = {
						AgentName: "wAgtCmdProcess",
						WQS_Agent: "wAgtCmdProcess",
						actiontype: "multi_forward",
						Arg1: _obj.unid,
						Arg2: _obj.idlist
					};
					_$$.mail.com.cmdpost(_pdata, callback);
				}
			},

			//메일 백업함 받은편지함,보낸편지함 선택 및 이동 함수 - 2017.10.28 by dwlee
			_makeTypeCombo: function (el, opt) {
				var _$combo = $("select[name='type_category']", el);
				var _$opt = $("<option></option>").appendTo(_$combo);
				_$opt.val("2");
				_$opt.text($fn.getCodeMsg("mail.title.inbox"));

				var _$opt = $("<option></option>").appendTo(_$combo);
				_$opt.val("1");
				_$opt.text($fn.getCodeMsg("mail.title.outbox"));

				if (opt.viewalias.indexOf("_send_yearcfg") > 0) {
					_$combo.xval("1");
				} else {
					_$combo.xval("2");
				}
				_$combo.on("change", function () {
					var _chgview = "w_send_yearcfg";
					if (_$combo.xval() == "2") {
						_chgview = "w_receive_yearcfg";
					}

					//2018.02.09 by dwlee
					var _$selY = $("select[name='sel-year']", el);
					var _url = opt.cdb + "/wFrmView?ReadForm&single=" + _$selY.xval() + "&view=" + _chgview;
					$fn.loadPage({ link: $fn.getProxyUrl(_url), linktype: "PAGE" });
				});
			},

			//연도 선택함수 - 2018.02.09 by dwlee
			_makeYearCombo: function (el, opt) {
				var _opt = opt;
				var _$selY = $("select[name='sel-year']", el);
				if (_$selY.size() > 0) {
					var _cDate = new Date();
					var _initYear = "2017";
					var _year = parseInt(_cDate.getFullYear());

					for (_index = parseInt(_initYear); _index < _year + 1; _index++) {
						var _$new_yopt = $("<option/>").appendTo(_$selY).text(_index).val(_index);
						if (_index == _opt.single) {
							_$new_yopt.attr("selected", "true");
						}
					}
					_$selY.on("change", function () {
						var _orgyear = _opt.single;
						var _newurl = _opt.pathinfo;
						if (_newurl.indexOf("single=") > 0) {
							_newurl = _newurl.replace(_orgyear, _$selY.xval());
						} else {
							_newurl = _newurl + "&single=" + _$selY.xval();
						}
						$fn.loadPage({ link: $fn.getProxyUrl(_newurl), linktype: "PAGE" });
					});
				}
			},

			/* _$$.mail.view._initOptions */
			_initOptions: function (opt) {
				/*
				var _me = this, _opt = $.extend({}, opt);
				_opt.button = _me._buttonInfo(_opt);
				_opt.header = _me._headerInfo(_opt);
				if (_opt.folderunid.length == 32) {
					_opt.viewalias = encodeURIComponent(_opt.viewalias);
				}
				return _opt;
				 */
				var _me = this,
					_opt = $.extend({}, opt);
				_opt.button = _me._buttonInfo(_opt);
				_opt.header = _me._headerInfo(_opt);

				//폴더인 경우 - 2017.01.23
				if (_opt.folderunid.length == 32) {
					var _optstring = _opt.viewalias;
					//하위 레벨인 경우 - 2017.01.23
					if (_optstring.indexOf("%5C") > 0) {
						var _nameArray = _optstring.split("%5C");
						var _rtArray = [];
						$.each(_nameArray, function (findex, fname) {
							_rtArray.push(encodeURIComponent(fname));
						});
						_opt.viewalias = _rtArray.join("%5C");
					} else {
						_opt.viewalias = encodeURIComponent(_opt.viewalias);
					}
				}

				//contenxtMenu 정의 - 2020.03.20 by dwlee
				//보기에 따라서 선택적으로 구성하면 될듯.


				//모바일 기기에서도 제한처리 - 2024.12.03
				if (_opt.ismobile == false && $fn.ismobile() == false) {
					console.log("pc 입니다.");
					_me._contextMenuInfo(_opt);
				}
				return _opt;
			},

			//마우스 우측 버튼 클릭시 나타나는 ContexMenu 정의  -2020.04.09 by dwlee
			_contextMenuInfo: function (opt) {
				var _menuopt;
				opt.contextmenu.items = {};

				//아이콘은 https://fontawesome.com/icons?d=gallery&m=free  참조

				_menuopt = {};  //2024.10.11
				//------------ 신규메일 관련
				//메일 수신거부
				if (opt.viewalias == "$rejectmail") {
					_menuopt = {
						create_reject: { name: $fn.getCodeMsg("mail.btn.create"), icon: "fa-edit" },
						sep1: "---------",
						permanentdeletion: { name: $fn.getCodeMsg("mail.btn.delpermanently"), icon: "fa-eraser" }
					};

					//템플릿
				} else if (opt.viewalias == "$templete") {
					_menuopt = {
						create_template: { name: $fn.getCodeMsg("mail.btn.create"), icon: "fa-edit" },
						sep1: "---------",
						permanentdeletion: { name: $fn.getCodeMsg("mail.btn.delpermanently"), icon: "fa-eraser" }
					};
					//메일 리스트용 View
				} else {
/*
					by mjkim 20251016 메일발송그룹만 contextmenu활성화
*/


					if ($fn.getCurUser().pinfo.ismailgroup == "Y") {
						_menuopt.create = { name: $fn.getCodeMsg("mail.btn.create"), icon: "fa-edit" }; //메일 작성
						_menuopt.sep1 = "---------";
					}
					//검색 추가 - 2020.06.09 by dwlee
					if ($.inArray(opt.viewalias, ["($sent)"]) == -1) {
						_menuopt.search_sender = { name: "보낸 사람으로 검색하기", icon: "fa-search" };
						_menuopt.sep21 = "---------";
					}
					//검색 추가 - 2020.06.09 by dwlee
					_menuopt.search_receiver = { name: "받은 사람으로 검색하기", icon: "fa-search-plus" };
					_menuopt.sep22 = "---------";

					if ($.inArray(opt.viewalias, ["($inbox_in_app)", "junkmail", "$reservemail"]) == -1) {
						_menuopt.pcsave = { name: $fn.getCodeMsg("mail.btn.pcsave"), icon: "fa-laptop" }; //PC 저장
						_menuopt.sep2 = "---------";
					}

					//console.log("메일함으로 이동  : ", $.inArray(opt.viewalias, ["($inbox_in_app)", "junkmail", "$reservemail","($trash)"]));

					if ($.inArray(opt.viewalias, ["($inbox_in_app)", "junkmail", "$reservemail", "($trash)"]) == -1) {
						_menuopt.movefolder = { name: $fn.getCodeMsg("mail.btn.movetofolder"), icon: "fa-folder" }; //영구보관
						_menuopt.sep3 = "---------";
					}

					//console.log("휴지통 옵션이 없는 보기  : ", ($.inArray(opt.viewalias, ["junkmail", "$reservemail","($trash)"]));

					//휴지통 옵션이 없는 보기
					if ($.inArray(opt.viewalias, ["junkmail", "$reservemail", "($trash)"]) != -1) {
						_menuopt.permanentdeletion = { name: $fn.getCodeMsg("mail.btn.delpermanently"), icon: "fa-eraser" }; //영구삭제
						_menuopt.sep4 = "---------";
						if ($.inArray(opt.viewalias, ["($trash)"]) != -1) {
							_menuopt.restoration = { name: $fn.getCodeMsg("mail.btn.restoration"), icon: "fa-trash-restore" }; //복원
							_menuopt.sep5 = "---------";
						}
					} else {
						_menuopt.del = {
							name: $fn.getCodeMsg("mail.btn.deletedoc"),
							icon: "fa-trash",
							items: {
								trash: { name: $fn.getCodeMsg("mail.btn.deletedoc"), icon: "fa-trash-alt" }, //삭제
								permanentdeletion: { name: $fn.getCodeMsg("mail.btn.delpermanently"), icon: "fa-eraser" } //영구삭제
							}
						};
						_menuopt.sep4 = "---------";
					}

					//중요도 옵션이 없는 보기
					if ($.inArray(opt.viewalias, ["($inbox_in_app)", "($sent)", "junkmail", "$reservemail", "($trash)"]) == -1) {
						_menuopt.starflag = { name: $fn.getCodeMsg("mail.btn.starflag"), icon: "fa-grin-stars" }; //중요표시
						_menuopt.sep6 = "---------";
					}

					//읽음 표시
					if ($.inArray(opt.viewalias, ["($sent)", "($trash)", "threads", "threads_cate", "$reservemail", "junkmail"]) == -1) {
						if (opt.viewalias == "($inbox_unread)") {
							_menuopt.read = {
								name: $fn.getCodeMsg("mail.btn.readflag"),
								icon: "fa-book-open",
								items: {
									readflag_read: { name: $fn.getCodeMsg("mail.btn.readflag_read"), icon: "fa-envelope-open" }, //선택메일 읽음표시
									readflag_allread: { name: $fn.getCodeMsg("mail.btn.readflag_allread"), icon: "fa-envelope-open-text" } //모든메일 읽음 표시
								}
							};
						} else {
							_menuopt.read = {
								name: $fn.getCodeMsg("mail.btn.readflag"),
								icon: "fa-book-open",
								items: {
									readflag_read: { name: $fn.getCodeMsg("mail.btn.readflag_read"), icon: "fa-envelope-open" }, //선택메일 읽음 표시
									readflag_unread: { name: $fn.getCodeMsg("mail.btn.readflag_unread"), icon: "fa-envelope" }, //선택메일 안읽음 표시
									readflag_allread: { name: $fn.getCodeMsg("mail.btn.readflag_allread"), icon: "fa-envelope-open-text" }, //모든메일 읽음 표시
									readflag_allunread: { name: $fn.getCodeMsg("mail.btn.readflag_allunread"), icon: "fa-envelope-square" } //모든메일 안읽음 표시
								}
							};
						}
						_menuopt.sep7 = "---------";
					}

					//console.log("aaaa : ", $.inArray(opt.viewalias, ["($inbox_unread)","($inbox_all)"]));

					//주소록 추가, 규칙 설정
					if ($.inArray(opt.viewalias, ["($inbox_unread)", "($inbox_all)"]) != -1) {
						_menuopt.addaddress = { name: $fn.getCodeMsg("mail.title.addaddress"), icon: "fa-address-card" }; //주소록 추가
						_menuopt.sep8 = "---------";
						_menuopt.ruleset = { name: $fn.getCodeMsg("mail.btn.ruleset"), icon: "fa-tasks" }; //규칙설정
						_menuopt.sep9 = "---------";
					}

/*
					by mjkim 20251016 메일발송그룹만 contextmenu활성화
*/

					if ($fn.getCurUser().pinfo.ismailgroup == "Y") {
						//전달
						_menuopt.forward_p = {
							name: $fn.getCodeMsg("mail.btn.forward"),
							icon: "fa-fast-forward",
							items: {
								forward: { name: $fn.getCodeMsg("mail.btn.forward"), icon: "fa-arrow-right" },
								forwardbody: { name: $fn.getCodeMsg("mail.btn.forwardbody"), icon: "fa-arrow-right" },
								forwardbodyattach: { name: $fn.getCodeMsg("mail.btn.forwardbodyattach"), icon: "fa-arrow-right" }
							}
						};

						//회신
						_menuopt.sep10 = "---------";
						_menuopt.reply_p = {
							name: $fn.getCodeMsg("mail.btn.reply"),
							icon: "fa-user",
							items: {
								reply: { name: $fn.getCodeMsg("mail.btn.reply"), icon: "fa-arrow-left" },
								replybody: { name: $fn.getCodeMsg("mail.btn.replybody"), icon: "fa-arrow-left" },
								replybodyattach: { name: $fn.getCodeMsg("mail.btn.replybodyattach"), icon: "fa-arrow-left" }
							}
						};

						//전체회신
						_menuopt.sep11 = "---------";
						_menuopt.replyall_p = {
							name: $fn.getCodeMsg("mail.btn.allreply"),
							icon: "fa-user-friends",
							items: {
								allreply: { name: $fn.getCodeMsg("mail.btn.allreply"), icon: "fa-angle-double-left" },
								allreplybody: { name: $fn.getCodeMsg("mail.btn.allreplybody"), icon: "fa-angle-double-left" },
								allreplybodyattach: { name: $fn.getCodeMsg("mail.btn.allreplybodyattach"), icon: "fa-angle-double-left" }
							}
						};

						//보낸편지함에만 존재
						if (opt.viewalias == "($sent)") {
							_menuopt.sep12 = "---------";
							_menuopt.copysend = { name: $fn.getCodeMsg("mail.btn.copysend"), icon: "fa-undo" }; //재발신
						}

					}

				}

				//ai 관련  - 번역
				// _menuopt.sep13 = "---------";
				// _menuopt.ai_p = {
				// 	name: $fn.getCodeMsg("mail.title.ai"), //AI기능
				// 	icon: "fa-cloud",
				// 	items: {
				// 		Korean: { name: $fn.getCodeMsg("mail.title.korean"), icon: "flag flag_ko" },
				// 		sep1: "---------",
				// 		English: { name: $fn.getCodeMsg("mail.title.english"), icon: "flag flag_us" },
				// 		sep2: "---------",
				// 		Chinese: { name: $fn.getCodeMsg("mail.title.chinese"), icon: "flag flag_zh" },
				// 		sep3: "---------",
				// 		Japanese: { name: $fn.getCodeMsg("mail.title.japanse"), icon: "flag flag_jp" },


				// 		sep4: "---------",

				// 		summary: { name: $fn.getCodeMsg("mail.title.summary"), icon: "flag flag_sum" }, //요약

				// 		/*
				// 								sep5: "---------",	
				// 								cmdinput : {name : $fn.getCodeMsg("mail.title.input_cmd") ,icon:"flag flag_ai"}, //명령어 직접입력	
				// 		*/
				// 	}
				// }

				opt.contextmenu.items = _menuopt;

				console.log(opt.contextmenu.items);

				opt.contextmenu.callback = $dwp.app.mail.view._contextMenuRun;
			},

			/* _$$.mail.view.viewDeleteDocument		>>		메일 보기에서 선택된 문서 삭제처리 */
			viewDeleteDocument: function (view, opt) {
				var _me = this,
					_rows = null,
					_unids = "",
					_opt = $.extend({ softdel: true }, opt);
				_rows = view.getChecked();

				if (_rows.length == 0) {
					$fn.alert({ msg: _opt.softdel ? $fn.getCodeMsg("comm.msg.msg005") : $fn.getCodeMsg("comm.msg.msg006") });
					return;
				}
				if (_opt.hasOwnProperty("confirm")) {
					//if (!$fn.confirm({msg : _opt["confirm"]})) return;
					$fn.confirm({ msg: _opt["confirm"] }).done(function () {
						_ok();
					});
				} else {
					_ok();
				}

				function _ok() {
					_unids = $.map(_rows, function (v) {
						return v["@unid"];
					}).join(";");

					var callback = function (postdata, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								/*
								$dwp.ui.alert({msg : (_opt.softdel ? $fn.getCodeMsg("comm.msg.msg003") : $fn.getCodeMsg("comm.msg.msg004") ) })
								.done(function(){
									var _page = view.options.page;
									if ( (view.options.total - _rows.length) < ( (view.options.page - 1) * view.options.ps + 1) ) {
										_page = _page - 1;
									}
									if ( _page < 1 ) {_page = 1;}
									view.reload({page : _page});
									$fn.lnbCountRefresh();
								});
								*/
								var _page = view.options.page;
								if (view.options.total - _rows.length < (view.options.page - 1) * view.options.ps + 1) {
									_page = _page - 1;
								}
								if (_page < 1) {
									_page = 1;
								}
								view.reload({ page: _page });
								$fn.lnbCountRefresh();
								$fn.toast({ msg: _opt.softdel ? $fn.getCodeMsg("comm.msg.msg003") : $fn.getCodeMsg("comm.msg.msg004") });
							}
						}
					};
					var _pdata = {
						actiontype: _opt.softdel ? "del_temp" : "del_reg",
						postdata: _unids
					};
					_$$.mail.com.cmdpost(_pdata, callback);
				}
			},

			/* _$$.mail.view.viewSizeDisp >>  보기화면 하단의 각 보기별 전체 문서 사이즈 표시 */
			viewSizeDisp: function (_event, _view) {
				var dragSelect = true,
					dragList = true;

				//예약함, 메일폐기함, 임시보관함이 아닐 경우에만 사용	 - 2020.03.20 by dwlee
				//dragselect 는 메일의 모든 보기에서 가능하도록
				if (_view.options.hasOwnProperty("isdragable")) {
					dragList = _view.options.isdragable;
				}

				if (_view.options.hasOwnProperty("ismobile")) {
					if (_view.options.ismobile == true) {
						dragSelect = false;
						dragList = false;
					}
				}

				if (dragList == true) {
					_$$.mail.com.subject_draggable($(".dwp-contents-article .drag-cell", _view.element), _view.element); //리스트 드레그 이벤트 추가

					function moveAction($tgt) {
						var _fid$ = $(".num", $tgt);
						var _fname = _fid$.attr("data-linkcnt");
						if (_fid$.size() < 1) {
							_fname = "($trash)";
						}

						var _options = _view.options;
						var _rows = _view.getChecked();
						if (_rows.length == 0) {
							return;
						}

						//휴지통으로 이동
						if (_view.options.viewalias == "($trash)") {
							var opt = { softdel: true, Arg1: _view.options.viewalias };
							_view.deleteDocument(opt);
							//받은편지함 또는 개인보관함으로 이동 - 2023.06.21 by dwlee
						} else {
							var _unids = $.map(_rows, function (v) {
								return v["@unid"];
							}).join(";");
							var _viewname = decodeURIComponent(_options.foldername != "" ? _options.foldername : _options.viewalias);

							_fname = _fname.replace(/\^/gi, "≫");

							//현재 편지함으로 선택시 오류 발생 - 2023.06.21 by dwlee
							if (_viewname.indexOf("($inbox") > -1) {
								_viewname = "($inbox)";
							}
							if (_fname.indexOf("($inbox") > -1) {
								_fname = "($inbox)";
							}

							if (_fname == _viewname) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err38") });
								return;
							}
							console.log("==============================================");
							console.log("viewname : ", _viewname);
							console.log("fname : ", _fname);
							console.log("==============================================");

							var callback = function (_obj, data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										if (data.hasOwnProperty("cnt")) {
											_$$.mail.com.CONST.ROW_KEY = "";
											_view.reload();
											//좌측 트리 카운트 리프레쉬 - 2017.10.27 by dwlee
											_$$.mail.com.update_left_count();
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return;
										}
									}
								}
							};
							_$$.mail.com.cmdpost({ actiontype: "movefolder", postdata: _unids, Arg1: _fname, Arg2: _viewname }, callback);
						}
					}

					//받은편지함 또는 휴지통으로 이동 - 2023.06.21
					// $(".dwp-trash-remove")
					// .closest(".dwp-lnb-depth2")
					// //.closest(".dwp-link")
					// .droppable({
					// 	hoverClass: "active",
					// 	drop: function (event, ui) {
					// 		moveAction($(event.target));
					// 	}
					// });

					$(".dwp-trash-remove,.dwp-folder-create")
						.closest(".dwp-lnb-item")
						//.closest(".dwp-link")
						.droppable({
							hoverClass: "active",
							drop: function (event, ui) {
								moveAction($(event.target));
							}
						});

					//개인보관함  drop  - 2020.03.20 by dwlee
					var _foldertree$ = $("#tree_" + _$$.mail.com.CONST.FOLDER);
					// 2020-06-12 BY LHJ 자식노드 모두 그리기
					var _$tree = _foldertree$.xtree("instance");
					var _folders$ = $(".dynatree-node", _foldertree$);
					if (_folders$.size() > 0) {
						_folders$.droppable({
							hoverClass: "dynatree-active",
							drop: function (event, ui) {
								moveAction($(event.target));
							}
						});
					}
				}

				if (_view.options.searchview == true) return; //검색결과 페이지에서는 사이즈를 표시하지 않음
				var _el = $("div.dwp-pagination", _view.element),
					_opt = {},
					_size = "",
					_folderunid = _view.options.folderunid || "",
					_url = _view.options.cdb + "/api/data/collections/name/" + _view.options.viewalias + "?ps=1&page=" + _view.options.total;
				if (_folderunid != "") {
					_url = _view.options.cdb + "/api/data/collections/unid/" + _view.options.folderunid + "?ps=1&page=" + _view.options.total;
				}
				if (_el.size() != 1) {
					return;
				}
				$dwp.core.util
					.xAjax({
						url: _url,
						dataType: "json",
						/*async : false,*/
						cache: false
					})
					.done(function (data) {
						if (data != "") {
							if (typeof data != "object" || typeof data[0] != "object") return;
							if (typeof data[0]["_size"] != "number") return;
							_size = '<div class="total-page" style="margin-left:15px;">[ ' + _$$.mail.com.filesize(data[0]["_size"], { displayunit: "B" }) + " ]</div>";
							$(_size).appendTo(_el);
						}
					})
					.fail(function () { });

				if (_view.options.viewalias == "threads_cate") {
					$(".dwp-subject", _view.element).each(function (i, o) {
						$(this).attr("title", $(this).text());
					});
					/*
					$(".dwp-subject", _view.element).on("mouseover", function () {
						var _text = $(this).text();

						$dwp.ui.qtdialog.init($(this), {
							qtid: "thread_subject",
							dialogClass: "titleless dropdown-type-dialog",
							width: "560",
							position: { my: "left top", at: "left bottom", collision: "flipfit" },
							initcallback: function (_$qtdialog) {
								var _$ul = $("<div class='tooltip-content'>" + _text + "</div>").appendTo(_$qtdialog.element);

								_$ul.on("mouseout", function () {
									_$qtdialog.close();
								});
							}
						});
					});
*/
				}
			},

			/* _$$.mail.view.viewSizeDisp >>  보기화면 하단의 각 보기별 전체 문서 사이즈 표시 */
			viewSizeDisp_bk: function (_event, _view) {
				var dragSelect = true,
					dragList = true;

				//예약함, 메일폐기함, 임시보관함이 아닐 경우에만 사용	 - 2020.03.20 by dwlee
				//dragselect 는 메일의 모든 보기에서 가능하도록
				if (_view.options.hasOwnProperty("isdragable")) {
					dragList = _view.options.isdragable;
				}

				if (_view.options.hasOwnProperty("ismobile")) {
					if (_view.options.ismobile == true) {
						dragSelect = false;
						dragList = false;
					}
				}

				if (dragList == true) {
					_$$.mail.com.subject_draggable($(".dwp-contents-article .drag-cell", _view.element), _view.element); //리스트 드레그 이벤트 추가

					function moveAction($tgt) {
						var _fid$ = $(".num", $tgt);
						var _fname = _fid$.attr("data-linkcnt");
						var _options = _view.options;
						var _rows = _view.getChecked();
						if (_rows.length == 0) {
							return;
						}

						if (_fid$.size() < 1) {
							_fname = "($trash)";
						}

						//휴지통으로 이동
						if (_view.options.viewalias == "($trash)") {
							var opt = { softdel: true, Arg1: _view.options.viewalias };
							_view.deleteDocument(opt);
							//받은편지함 또는 개인보관함으로 이동
						} else {
							var _unids = $.map(_rows, function (v) {
								return v["@unid"];
							}).join(";");
							var _viewname = decodeURIComponent(_options.foldername != "" ? _options.foldername : _options.viewalias);
							_fname = _fname.replace(/\^/gi, "≫");

							/*
							//현재 편지함으로 선택시 오류 발생 - 2023.06.21 by dwlee
							if (_viewname.indexOf("($inbox") > -1) {
								_viewname = "($inbox)";
							}
							if (_fname.indexOf("($inbox") > -1) {
								_fname = "($inbox)";
							}
							if (_fname == _viewname) {
								$fn.alert({msg : $fn.getCodeMsg("mail.msg.err38")});
								return;
							}
*/

							var callback = function (_obj, data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										if (data.hasOwnProperty("cnt")) {
											_$$.mail.com.CONST.ROW_KEY = "";
											_view.reload();
											//좌측 트리 카운트 리프레쉬 - 2017.10.27 by dwlee
											_$$.mail.com.update_left_count();
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return;
										}
									}
								}
							};
							_$$.mail.com.cmdpost({ actiontype: "movefolder", postdata: _unids, Arg1: _fname, Arg2: _viewname }, callback);
						}
					}

					//받은편지함 또는 휴지통으로 이동 - 2023.06.21
					//$(".dwp-trash-remove,.dwp-folder-create")
					$(".dwp-trash-remove")
						.closest(".dwp-lnb-depth2")
						.droppable({
							hoverClass: "active",
							drop: function (event, ui) {
								moveAction($(event.target));
							}
						});

					//개인보관함  drop  - 2020.03.20 by dwlee
					var _foldertree$ = $("#tree_" + _$$.mail.com.CONST.FOLDER);
					// 2020-06-12 BY LHJ 자식노드 모두 그리기
					var _$tree = _foldertree$.xtree("instance");
					var _folders$ = $(".dynatree-node", _foldertree$);
					if (_folders$.size() > 0) {
						_folders$.droppable({
							hoverClass: "dynatree-active",
							drop: function (event, ui) {
								moveAction($(event.target));
							}
						});
					}
				}

				if (_view.options.searchview == true) return; //검색결과 페이지에서는 사이즈를 표시하지 않음
				var _el = $("div.dwp-pagination", _view.element),
					_opt = {},
					_size = "",
					_folderunid = _view.options.folderunid || "",
					_url = _view.options.cdb + "/api/data/collections/name/" + _view.options.viewalias + "?ps=1&page=" + _view.options.total;
				if (_folderunid != "") {
					_url = _view.options.cdb + "/api/data/collections/unid/" + _view.options.folderunid + "?ps=1&page=" + _view.options.total;
				}
				if (_el.size() != 1) {
					return;
				}
				$dwp.core.util
					.xAjax({
						url: _url,
						dataType: "json",
						/*async : false,*/
						cache: false
					})
					.done(function (data) {
						if (data != "") {
							if (typeof data != "object" || typeof data[0] != "object") return;
							if (typeof data[0]["_size"] != "number") return;
							_size = '<div class="total-page" style="margin-left:15px;">[ ' + _$$.mail.com.filesize(data[0]["_size"], { displayunit: "B" }) + " ]</div>";
							$(_size).appendTo(_el);
						}
					})
					.fail(function () { });

				if (_view.options.viewalias == "threads_cate") {
					$(".dwp-subject", _view.element).on("mouseover", function () {
						var _text = $(this).text();

						$dwp.ui.qtdialog.init($(this), {
							qtid: "thread_subject",
							dialogClass: "titleless dropdown-type-dialog",
							width: "560",
							position: { my: "left top", at: "left bottom", collision: "flipfit" },
							initcallback: function (_$qtdialog) {
								var _$ul = $("<div class='tooltip-content'>" + _text + "</div>").appendTo(_$qtdialog.element);

								_$ul.on("mouseout", function () {
									_$qtdialog.close();
								});
							}
						});
					});
				}
			},

			/* _$$.mail.view.viewSizeDisp >>  보기화면 하단의 각 보기별 전체 문서 사이즈 표시 */
			viewSizeDisp_old: function (_event, _view) {
				var dragSelect = true,
					dragList = true;

				//예약함, 메일폐기함, 임시보관함이 아닐 경우에만 사용	 - 2020.03.20 by dwlee
				//dragselect 는 메일의 모든 보기에서 가능하도록
				if (_view.options.hasOwnProperty("isdragable")) {
					dragList = _view.options.isdragable;
				}

				if (_view.options.hasOwnProperty("ismobile")) {
					if (_view.options.ismobile == true) {
						dragSelect = false;
						dragList = false;
					}
				}
				/*
									//if ($.inArray(_view.options.viewalias, ["$reservemail", "($trash)", "junkmail"]) != -1 || _view.options.folderunid != "") {				//메일폐기함 또는 영구보관함(폴더)가 아닐 경우에만 사용
									//폴더도 drag & drop 사용 가능하도록 수정 - 2020.03.20 by dwlee
									if ($.inArray(_view.options.viewalias, ["$reservemail", "($trash)", "($drafts)", "junkmail"]) != -1) {							//예약함, 메일폐기함, 임시보관함이 아닐 경우에만 사용
										dragList = false;
									}
				*/

				/*				core.view에서 제어하도록 수정 - 2020.03.31 by dwlee
									if (dragSelect == true) {
										_$$.mail.com.disableSelect($(".dwp-contents-article", _view.element), _view.element);					//CheckBox Drag Select 초기화
										_$$.mail.com.checkBoxSwipeable($(".dwp-contents-article .dwp-check", _view.element), _view.element);			//CheckBox Drag Select 이벤트 추가
									}
				*/
				if (dragList == true) {
					_$$.mail.com.subject_draggable($(".dwp-contents-article .drag-cell", _view.element), _view.element); //리스트 드레그 이벤트 추가

					//휴지통으로 이동
					$(".dwp-trash-remove")
						.closest(".dwp-lnb-depth2")
						.droppable({
							hoverClass: "active",
							drop: function (event, ui) {
								var opt = { softdel: true, Arg1: _view.options.viewalias };
								_view.deleteDocument(opt);
							}
						});

					//개인보관함으로 이동
					//개인보관함  drop  - 2020.03.20 by dwlee
					var _foldertree$ = $("#tree_" + _$$.mail.com.CONST.FOLDER);

					// 2020-06-12 BY LHJ 자식노드 모두 그리기
					var _$tree = _foldertree$.xtree("instance");
					/*
					if (_$tree != null) {
						_$tree.getTree().renderInvisibleNodes();
					}
					*/
					var _folders$ = $(".dynatree-node", _foldertree$);

					console.log("====================================================================");
					console.log("folder cnt1 : ", _folders$.size());
					console.log("====================================================================");

					if (_folders$.size() > 0) {
						//위치이동 : 폴더가 없으면 Tree 를 잡을 수 없음 - 2020.06.17 by dwlee
						/*
													if (_$tree != null) {
														_$tree.getTree().renderInvisibleNodes();
														$fn.lnbCountRefresh();
													}
						*/
						_folders$.droppable({
							hoverClass: "dynatree-active",
							drop: function (event, ui) {
								var _fid$ = $(".num", $(event.target));
								var _fname = _fid$.attr("data-linkcnt");
								var _options = _view.options;
								var _rows = _view.getChecked();
								if (_rows.length == 0) {
									return;
								}
								var _unids = $.map(_rows, function (v) {
									return v["@unid"];
								}).join(";");
								var _viewname = decodeURIComponent(_options.foldername != "" ? _options.foldername : _options.viewalias);
								_fname = _fname.replace(/\^/gi, "≫");

								//현재 편지함으로 선택시 오류 발생 - 2023.06.21 by dwlee
								if (_viewname.indexOf("($inbox") > -1) {
									_viewname = "($inbox)";
								}

								if (_fname.indexOf("($inbox") > -1) {
									_fname = "($inbox)";
								}
								if (_fname == _viewname) {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err38") });
									return;
								}

								console.log("==============================================");
								console.log("viewname : ", _viewname);
								console.log("fname : ", _fname);
								console.log("==============================================");

								var callback = function (_obj, data) {
									if (data.hasOwnProperty("result")) {
										if (data.result >= "200" && data.result < "300") {
											if (data.hasOwnProperty("cnt")) {
												_$$.mail.com.CONST.ROW_KEY = "";
												_view.reload();
												//좌측 트리 카운트 리프레쉬 - 2017.10.27 by dwlee
												_$$.mail.com.update_left_count();
											} else {
												$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
												return;
											}
										}
									}
								};
								_$$.mail.com.cmdpost({ actiontype: "movefolder", postdata: _unids, Arg1: _fname, Arg2: _viewname }, callback);
							}
						});
					}
				}

				/*
				if (_view.options.viewalias != "($trash)" && _view.options.folderunid == "") {				//메일폐기함 또는 영구보관함(폴더)가 아닐 경우에만 사용
					if (_view.options.hasOwnProperty("ismobile")) {
						if (_view.options.ismobile == false) {
							_$$.mail.com.disableSelect($(".dwp-contents-article", _view.element), _view.element);							//CheckBox Drag Select
							_$$.mail.com.checkBoxSwipeable($(".dwp-contents-article .dwp-check", _view.element), _view.element);	//CheckBox Drag Select
							_$$.mail.com.subject_draggable($(".dwp-contents-article .drag-cell", _view.element), _view.element);		//CheckBox Drag Select
						}
					} else {
						_$$.mail.com.disableSelect($(".dwp-contents-article", _view.element), _view.element);							//CheckBox Drag Select
						_$$.mail.com.checkBoxSwipeable($(".dwp-contents-article .dwp-check", _view.element), _view.element);	//CheckBox Drag Select
						_$$.mail.com.subject_draggable($(".dwp-contents-article .drag-cell", _view.element), _view.element);		//CheckBox Drag Select
					}
					$(".dwp-trash-remove").closest(".dwp-lnb-depth2").droppable({
						hoverClass:"active",
						drop:function(event,ui){
							//alert($(event.target).find(".dwp-link").html());
							//var opt = {softdel : true, Arg1 : _view.options.viewalias, confirm : $fn.getCodeMsg("mail.msg.confirm06")};			//confirm : 선택하신 문서를 삭제 하시겠습니까?"
							var opt = {softdel : true, Arg1 : _view.options.viewalias};
							_view.deleteDocument(opt);
						}
					});
				}
				 */

				if (_view.options.searchview == true) return; //검색결과 페이지에서는 사이즈를 표시하지 않음
				var _el = $("div.dwp-pagination", _view.element),
					_opt = {},
					_size = "",
					_folderunid = _view.options.folderunid || "",
					_url = _view.options.cdb + "/api/data/collections/name/" + _view.options.viewalias + "?ps=1&page=" + _view.options.total;
				if (_folderunid != "") {
					_url = _view.options.cdb + "/api/data/collections/unid/" + _view.options.folderunid + "?ps=1&page=" + _view.options.total;
				}
				if (_el.size() != 1) {
					return;
				}
				$dwp.core.util
					.xAjax({
						url: _url,
						dataType: "json",
						/*async : false,*/
						cache: false
					})
					.done(function (data) {
						if (data != "") {
							if (typeof data != "object" || typeof data[0] != "object") return;
							if (typeof data[0]["_size"] != "number") return;
							_size = '<div class="total-page" style="margin-left:15px;">[ ' + _$$.mail.com.filesize(data[0]["_size"], { displayunit: "B" }) + " ]</div>";
							$(_size).appendTo(_el);
						}
					})
					.fail(function () { });

				if (_view.options.viewalias == "threads_cate") {
					$(".dwp-subject", _view.element).on("mouseover", function () {
						var _text = $(this).text();

						$dwp.ui.qtdialog.init($(this), {
							qtid: "thread_subject",
							dialogClass: "titleless dropdown-type-dialog",
							width: "560",
							position: { my: "left top", at: "left bottom", collision: "flipfit" },
							initcallback: function (_$qtdialog) {
								var _$ul = $("<div class='tooltip-content'>" + _text + "</div>").appendTo(_$qtdialog.element);

								_$ul.on("mouseout", function () {
									_$qtdialog.close();
								});
							}
						});
					});
				}
			},

			/*MailStore : 선택된 문서 로컬 저장*/
			/* MailStore : Local Viewer, Mail-Donload
			 *
			 * opt : {
			 * 		type : D:다운로드, V: 뷰어
			 * 		cdb : 사용자 MailDB Path
			 * 		unids : 다운로드 대상 UNID.. (다중값 구분자는 파이프라인 "|")
			 * 	}
			 */
			/* _$$.mail.view.MailStore_LocalDonload */
			MailStore_LocalDonload: function (view) {
				console.log("==========view==================", view);
				if (view.options.searchview == true) {
					var _html = '<div class="dwp-section">';
					_html += '<div class="dwp-table-vertical line-type form-type" style="padding:10px;">';
					_html += '<div class="dwp-selection-group">';
					_html += '<div class="dwp-radio">';
					_html += "<label>";
					_html += '<input type="radio" name="mailstore_download" value="1" checked="checked"><span>' + $fn.getCodeMsg("mail.data.alldownload") + "</span>";
					_html += "</label>";
					_html += "<br><br>";
					_html += "<label>";
					_html += '<input type="radio" name="mailstore_download" value="2"><span>' + $fn.getCodeMsg("mail.data.selectdownload") + "</span>";
					_html += "</label>";
					_html += "</div>";
					_html += "</div>";
					_html += "</div>";
					_html += "</div>";

					var _buttons = [
						{
							title: $fn.getCodeMsg("mail.btn.ok"),
							click: function (_obj) {
								var _sell = $("input[name=mailstore_download]", _obj.element).xval();
								if (_sell == "1") {
									_$$.mail.view.MailStore_LocalDonload_AllDoc(view);
								} else {
									_$$.mail.view.MailStore_LocalDonload_SelectDoc(view);
								}
								_obj.close();
							}
						},
						{
							title: $fn.getCodeMsg("mail.btn.cancel"),
							click: function (_obj) {
								_obj.close();
							}
						}
					];

					$fn.dialog(null, {
						modal: true,
						resizable: true,
						draggable: true,
						title: $fn.getCodeMsg("mail.btn.pcsave"),
						width: 350,
						height: 250,
						show: "fade", //effect
						hide: "fade", //effect
						ismobile: false,
						buttons: _buttons,
						content: { html: _html }
					});
				} else {
					console.log("=======================mail.view.MailStore_LocalDonload_SelectDoc=================================");
					_$$.mail.view.MailStore_LocalDonload_SelectDoc(view);
				}
			},

			/* _$$.mail.view.MailStore_LocalDonload_AllDoc  >> 보기에서 검색결과 전체 다운로드 */
			MailStore_LocalDonload_AllDoc: function (view) {
				var _rows = null,
					_tr = null,
					_type = "",
					_opt = {};
				_opt = {
					type: "S",
					cdb: view.options.cdb,
					viewalias: view.options.viewalias,
					unids: "",
					searchqry: view.options.searchqry
				};
				_$$.mail.com.MailStore(_opt);
			},

			/* _$$.mail.view.MailStore_LocalDonload_SelectDoc  >> 보기에서 검색결과 선택 다운로드*/
			MailStore_LocalDonload_SelectDoc: function (view) {
				var _rows = null,
					_unids = "",
					_tr = null,
					_type = "",
					_viewname = "",
					_opt = {};
				_viewname = view.options.viewalias;
				_rows = view.getChecked();

				if (_rows.length == 0) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
					return;
				}
				_opt = {
					type: "D",
					cdb: view.options.cdb,
					viewalias: view.options.viewalias,
					unids: $.map(_rows, function (v) {
						return v["@unid"];
					}).join("|"),
					searchqry: ""
				};

				_$$.mail.com.MailStore(_opt);
			},

			/* _$$.mail.view.star_flag >> 보기에서 중요표시 */
			star_flag: function (view, rowdata) {
				var _me = this,
					_rows = null,
					_unids = "",
					_tr = null,
					_type = "",
					_viewname = "",
					_options = null;
				if (typeof rowdata != "undefined") {
					_tr = view;
					_type = "single";
					(view = $fn.getInstance("view").element.view("instance")), (_options = view.options); //메일보기의 메일별 별표 아이콘을 클릭 하면.. view instance가 없음... 새롭게 설정해야 함
					_viewname = _options.viewalias;
					_unids = rowdata["@unid"];
				} else {
					_type = "multi";
					_viewname = view.options.viewalias;
					_rows = view.getChecked();
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt01") });
						return;
					}
					_unids = $.map(_rows, function (v) {
						return v["@unid"];
					}).join(";");
					_tr = view.getCheckedRows();
				}

				var callback = function (obj, data) {
					if (_type == "multi") {
						$("input[name='chk']:checked", _tr).attr({ checked: false });
						$("input[name='chkall']", view.element).attr({ checked: false });
					}
					$("span.mark", _tr).toggleClass("active");
					if (_viewname == "($isstar)") {
						view.reload();
					}

					$(_tr).removeClass("dwp-row-selected");
				};
				_$$.mail.com.cmdpost({ actiontype: "starflag", postdata: _unids }, callback);
			},

			/* _$$.mail.view.act_readflag_read >> 선택된 문서 읽음표시*/
			act_readflag_read: function (view, rowdata) {
				var _me = this,
					_rows = null,
					_unids = "",
					_tr = null,
					_type = "",
					_viewname = "",
					_options = null;
				if (typeof rowdata != "undefined") {
					_tr = $(view).parents("div.dwp-table-row");
					_type = "single";
					(view = $fn.getInstance("view").element.view("instance")), (_options = view.options); //메일보기의 메일별 별표 아이콘을 클릭 하면.. view instance가 없음... 새롭게 설정해야 함
					_viewname = _options.viewalias;
					_unids = rowdata["@unid"];
				} else {
					_type = "multi";
					_viewname = view.options.viewalias;
					_tr = view.getCheckedRows();
					_rows = view.getChecked();
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						return;
					}
					_rows = $.map(_tr, function (v) {
						//var _mark = $("div.read-cell > span:not(.active)", v);
						var _mark = $("div.subject-cell.active", v);
						if (_mark.size() == 1) return $(v).data($dwp.core.view._ROW_DATA);
					});
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt03") });
						return;
					}
					_unids = $.map(_rows, function (v) {
						return v["@unid"];
					}).join(";");
				}

				var callback = function (obj, data) {
					//2020.04.14
					$(_tr).removeClass("dwp-row-selected");

					if (_viewname == "($inbox_unread)") {
						view.reload({ page: view._listPageCount() });
						view._previewLoadPage();

						//console.log("lnbCountRefresh ==> ","what");

						$fn.lnbCountRefresh();
					} else {
						if (_type == "multi") {
							$("input[name='chk']:checked", _tr).attr({ checked: false });
							$("input[name='chkall']", view.element).attr({ checked: false });
						}
						$("span.read", _tr).addClass("active");

						//2024.07.15
						//$("div.subject-cell", _tr).removeClass("dwp-bold active");
						$("div.dwp-cell", _tr).removeClass("dwp-bold active");

						_$$.mail.com.update_left_count(["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)"]);
					}
				};
				_$$.mail.com.cmdpost({ actiontype: "readflag_read", postdata: _unids }, callback);
			},

			/* _$$.mail.view.act_readflag_unread >> 선택된 문서 읽지않음 표시*/
			act_readflag_unread: function (view, rowdata) {
				var _me = this,
					_rows = null,
					_unids = "",
					_tr = null,
					_type = "",
					_viewname = "",
					_options = null;
				if (typeof rowdata != "undefined") {
					_tr = $(view).parents("div.dwp-table-row");
					_type = "single";
					(view = $fn.getInstance("view").element.view("instance")), (_options = view.options); //메일보기의 메일별 별표 아이콘을 클릭 하면.. view instance가 없음... 새롭게 설정해야 함
					_viewname = _options.viewalias;
					_unids = rowdata["@unid"];
				} else {
					_type = "multi";
					_viewname = view.options.viewalias;

					_tr = view.getCheckedRows();
					_rows = view.getChecked();
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						return;
					}

					_rows = $.map(_tr, function (v) {
						var _mark = $("div.read-cell > span.active", v);
						if (_mark.size() == 1) return $(v).data($dwp.core.view._ROW_DATA);
					});
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt03") });
						return;
					}
					_unids = $.map(_rows, function (v) {
						return v["@unid"];
					}).join(";");
				}

				var callback = function (obj, data) {
					//2020.04.14
					$(_tr).removeClass("dwp-row-selected");

					if (_type == "multi") {
						$("input[name='chk']:checked", _tr).attr({ checked: false });
						$("input[name='chkall']", view.element).attr({ checked: false });
					}
					$("span.read", _tr).removeClass("active");

					//2024.07.15
					//$("div.subject-cell", _tr).addClass("dwp-bold active");
					$("div.dwp-cell", _tr).addClass("active");

					_$$.mail.com.update_left_count(["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)"]);
				};

				_$$.mail.com.cmdpost({ actiontype: "readflag_unread", postdata: _unids }, callback);
			},

			/* _$$.mail.view.act_readflag_allread >> 현재 보기 리스트의 모든 문서 읽음 표시*/
			act_readflag_allread: function (view) {
				$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm07") }).done(function () {
					//현재 메일함의 모든 메일을 읽음 처리 하시겠습니까?
					var _viewname = view.options.viewalias;
					var callback = function (obj, data) {
						view.reload();
						_$$.mail.com.update_left_count(["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)"]);
					};
					_$$.mail.com.cmdpost({ actiontype: "readflag_allread", postdata: _viewname }, callback);
				});
			},

			/* _$$.mail.view.act_returnreceipt  >>  메일발신함 보기화면의 각 메일별 수신확인 버튼*/
			act_returnreceipt: function (obj, json) {
				var getfield = {},
					docinfo = {},
					key_unid = "",
					opt = {},
					_view = $fn.getInstance("view").element.view("instance");
				getfield = { Arg1: json["@unid"], Arg2: "key_unid" };
				docinfo = _$$.mail.com.getfield(getfield);

				if (!docinfo.hasOwnProperty(getfield.Arg1)) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt11") });
					return;
				} //선택 메일의 정보를 찾을 수 없습니다.
				key_unid = docinfo[getfield.Arg1]["key_unid"];
				opt = { keyunid: key_unid != "" && key_unid != null ? key_unid : json["@unid"] };
				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(_view.element, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.receivecheck"),
					width: 730,
					height: 550,
					show: "fade", //effect
					hide: "fade", //effect
					content: { url: _view.options.cdb + "/wFrmReceiptRecall?ReadForm", data: opt }
				});
			},

			/* _$$.mail.view.act_readflag_allread >> 현재 보기 리스트의 모든 문서 읽음 표시*/
			act_readflag_allread: function (view) {
				$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm07") }).done(function () {
					//현재 메일함의 모든 메일을 읽음 처리 하시겠습니까?
					var _viewname = view.options.viewalias;
					var callback = function (obj, data) {
						view.reload();
						_$$.mail.com.update_left_count(["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)"]);
					};
					_$$.mail.com.cmdpost({ actiontype: "readflag_allread", postdata: _viewname }, callback);
				});
			},

			/* _$$.mail.view.act_readflag_allunread >> 현재 보기 리스트의 모든 문서 읽지않음 표시*/
			act_readflag_allunread: function (view) {
				$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm08") }).done(function () {
					//현재 메일함의 모든 메일을 안읽음 처리 하시겠습니까?
					var _viewname = view.options.viewalias;
					var callback = function (obj, data) {
						view.reload();
						_$$.mail.com.update_left_count(["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)"]);
					};
					_$$.mail.com.cmdpost({ actiontype: "readflag_allunread", postdata: _viewname }, callback);
				});
			},

			/* _$$.mail.view.act_trash_empty >> 스팸메일함 보기의 "비우기" 버튼*/
			act_trash_empty: function (view) {
				$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm04") }).done(function () {
					//해당 편지함의 모든 메일을 삭제 하시겠습니까?\n삭제된 메일은 복구 할 수 없습니다.
					var _viewname = "",
						callback = null,
						_view = null;
					if (typeof view.options == "undefined") {
						//좌측메뉴 메일폐기함 오른쪽 아이콘을 클릭하면 options 파라미터가 없음.. 그냥 비우기 처리만 호출
						_viewname = "($trash)";
						callback = function (obj, data) {
							_view = $fn.getInstance("view");
							if (typeof _view != "undefined") {
								_view = $fn.getInstance("view").element.view("instance");
								_view.reload();
								$fn.lnbCountRefresh(); //메일 카운트 및 사이즈 다시 계산
							}
						};
					} else {
						_viewname = view.options.viewalias;
						callback = function (obj, data) {
							view.reload();
							$fn.lnbCountRefresh(); //메일 카운트 및 사이즈 다시 계산
						};
					}
					_$$.mail.com.cmdpost({ actiontype: "trash_empty", postdata: _viewname }, callback);
				});
			},

			/* _$$.mail.view.act_movetofolder >> 보기 화면의 [영구보관] 버튼 (메일 폴더로 이동)
				- 트리형태로 교체 - 2020.08.27 by dwlee
			*/
			act_movetofolder: function (view, opt) {
				var _me = this,
					_rows = null,
					_unids = "",
					_viewname = "",
					_options = view.options,
					_el = view.element;
				//_viewname = decodeURIComponent(view.options.viewalias), opt = opt || {}, _opt = $.extend({unid : "", ismobile : false}, opt);
				(opt = opt || {}), (_opt = $.extend({ unid: "", ismobile: false }, opt));

				_viewname = decodeURIComponent(_options.foldername != "" ? _options.foldername : _options.viewalias);

				if (_opt.ismobile == false) {
					_rows = view.getChecked();
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						return;
					}
					_unids = $.map(_rows, function (v) {
						return v["@unid"];
					}).join(";");
				} else {
					_unids = _opt.unid;
				}
				var __callback = function (obj) {
					var _sel = $("select[name=CurrentFolders]", obj.element).xval();
					if (_sel == "root" || _sel == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
						return;
					}

					//받은편지함에서 호출한 경우 - 2023.06.21
					if (_viewname.indexOf("($inbox") > -1) {
						_viewname = "($inbox)";
					}
					if (_sel == _viewname) {
						//같은 폴더로 옮기는 경우 제어 - 2023.06.21 by dwlee
						//$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
						//$fn.alert({msg : "현재 메일함을 선택하셨습니다.다른 메일함을 선택하세요."})
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err38") });
						return;
					}

					var callback = function (_obj, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.hasOwnProperty("cnt")) {
									obj.close();
									view.reload();

									//좌측 트리 카운트 리프레쉬 - 2017.10.27 by dwlee
									_$$.mail.com.update_left_count();
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
									return;
								}
							}
						}
					};

					_$$.mail.com.cmdpost({ actiontype: "movefolder", postdata: _unids, Arg1: _sel, Arg2: _viewname }, callback);
				};

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							__callback(obj);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.movetofolder"),
					width: _opt.ismobile ? "100%" : 500,
					height: _opt.ismobile ? "auto" : 670,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: _opt.ismobile,
					confirm: function (obj) {
						__callback(obj);
					},
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _opt.ismobile == true ? [] : _buttons,
					content: { url: _options.cdb + "/wFrmSelFolderTree?ReadForm", data: { ismobile: _opt.ismobile, mode: "move" } },

					initcallback: function (_$dialog) {
						var _$el = _$dialog.element;
						var _$diag = $("div.dwp-mail-move-dialog", _$dialog.element);

						console.log("룰루랄라-1");

						//폴더 이동 화면에서도 폴더생성 가능 - 2020.12.18 by dwlee
						var _$nbtn = $("#newbtn", _$diag);
						if (_$nbtn.size() > 0) {
							console.log("룰루랄라-2");
							_$nbtn.on("click", function () {
								_$$.mail.mng.createFolder(_$diag);
							});
						}
						console.log("룰루랄라-3");

						var _dispMailFolderInfo = function (data) {
							var rtn = "",
								odata = null,
								chk = false,
								_sel = $("select[name=CurrentFolders]", _$diag),
								_errmsg = $("div.errmsg", _$diag);
							_sel.attr("id", "CurrentFolders");
							if (data.hasOwnProperty("result")) {
								if (data.result >= "200" && data.result < "300") {
									if (data.hasOwnProperty("folderisnothing")) {
										_errmsg.html('<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err03") + "</div></div>");
										return;
									}
									if (data.hasOwnProperty("userfolder")) {
										$.each(data["userfolder"], function (i, o) {
											odata = data[o];
											$('<option value="' + odata[0] + '" unid="' + o + '" lnbid="' + odata[3] + '">' + odata[0] + "</option>").appendTo(_sel);
											chk = true;
										});

										_sel.on("change", function () {
											var _selid = $("#CurrentFolders option:selected").attr("lnbid");
											if (typeof _selid == "undefined") {
												_selid = "_root";
											}
											var _nodes = $("#tree").dynatree("getSelectedNodes");
											if (_nodes.length > 0) {
												$.each(_nodes, function (j, node) {
													node.select(false);
												});
											}
											$("#tree").dynatree("getTree").getNodeByKey(_selid).select();
										});
									}
								}
							}
							if (chk == false) {
								rtn = '<div class="dwp-row"><div class="dwp-value dwp-center">' + $fn.getCodeMsg("mail.msg.err01") + "</div></div>"; //사용자 메일박스 정보를 확인할 수 없습니다
								_errmsg.html(rtn);
							}
						};
						$fn.cmdPost($fn.getProxyUrl($fn.getPath("mail") + "/wcmdpost?createdocument"), { actiontype: "mailfolderinfo" }, _dispMailFolderInfo, "json"); //개인이 추가한 폴더 정보
					}
				});
			},

			/* _$$.mail.view.act_movetofolder >> 보기 화면의 [영구보관] 버튼 (메일 폴더로 이동)*/
			act_movetofolderOld: function (view, opt) {
				var _me = this,
					_rows = null,
					_unids = "",
					_viewname = "",
					_options = view.options,
					_el = view.element;
				//_viewname = decodeURIComponent(view.options.viewalias), opt = opt || {}, _opt = $.extend({unid : "", ismobile : false}, opt);
				(opt = opt || {}), (_opt = $.extend({ unid: "", ismobile: false }, opt));

				_viewname = decodeURIComponent(_options.foldername != "" ? _options.foldername : _options.viewalias);

				if (_opt.ismobile == false) {
					_rows = view.getChecked();
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
						return;
					}
					_unids = $.map(_rows, function (v) {
						return v["@unid"];
					}).join(";");
				} else {
					_unids = _opt.unid;
				}

				var __callback = function (obj) {
					var _sel = $("select[name=CurrentFolders]", obj.element).xval();
					if (_sel == "root" || _sel == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
						return;
					}

					var callback = function (_obj, data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.hasOwnProperty("cnt")) {
									obj.close();
									view.reload();

									//좌측 트리 카운트 리프레쉬 - 2017.10.27 by dwlee
									_$$.mail.com.update_left_count();
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
									return;
								}
							}
						}
					};

					_$$.mail.com.cmdpost({ actiontype: "movefolder", postdata: _unids, Arg1: _sel, Arg2: _viewname }, callback);
				};

				var _buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							__callback(obj);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.movemail"),
					width: _opt.ismobile ? "100%" : 500,
					height: _opt.ismobile ? "auto" : 250,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: _opt.ismobile,
					confirm: function (obj) {
						__callback(obj);
					},
					//autoOpen: false,		//.dialog("open")호출시만 열림
					buttons: _opt.ismobile == true ? [] : _buttons,
					content: { url: _options.cdb + "/wFrmSelFolder?ReadForm", data: { ismobile: _opt.ismobile } }
				});
			},

			/* _$$.mail.view._act_spam_rule_callback >> act_spam_rule  > function에서 callback 호출 (보기에서 문서 선택 후 스팸/규칙 설정)*/
			_act_spam_rule_callback: function (view, opt) {
				var _me = this,
					_options = view.options,
					_ele = view.element,
					_buttons = [],
					_selunids = opt.postdata; //, _tbody = $("#mail_rule_table", _ele), _tr = "", _tmp = null, _info = "", _info2 = "";
				_buttons = [
					{
						title: $fn.getCodeMsg("mail.btn.ok"),
						click: function (obj) {
							var _status = $("input[name=status]", obj.element).xval(),
								_condition = $("input[name=condition]", obj.element).xval(),
								_treatment = $("input[name=treatment]", obj.element).xval();
							var _findtext = $("input[name=findtext]", obj.element).xval(),
								_folder = $("select[name=CurrentFolders]", obj.element).xval(),
								_folderunid = "";
							if (_status == "") {
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruleenable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
							if (_condition == "") {
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
							if (_findtext == "") {
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruledisable") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
							if (_treatment == "") {
								$fn.alert({ msg: "[ " + $fn.getCodeMsg("mail.title.ruleaction") + " ] " + $fn.getCodeMsg("mail.msg.err18") });
								return;
							}
							if (_treatment == "folder" && (_folder == "root" || _folder == "")) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
								return;
							}

							if (_treatment == "folder") {
								if (_folder == "root" || _folder == "") {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err09") });
									return;
								} else {
									_folderunid = $("select[name=CurrentFolders] > option:selected", obj.element).attr("unid");
								}
							} else {
								_folderunid = $("input[name=treatment]:checked", obj.element).attr("data-unid"); //스펨메일, 휴지통 FolderUNID
								_folder = $("input[name=treatment]:checked", obj.element).xval();
							}

							var _pdata = {
								AgentName: "wAgtCmdProcess",
								WQS_Agent: "wAgtCmdProcess",
								actiontype: "new_rule_movedoc",
								postdata: opt.postdata,
								/*선택된 메일의 UNIDs*/
								Arg1: _status,
								/*사용유무*/
								Arg2: _condition,
								/*조건설정 (발신자명/주소, 제목)*/
								Arg3: _findtext,
								/*검색 문자열*/
								Arg4: _treatment,
								/*처리방법 (영구보관함으로 이동, 스펨메일함으로 이동, 삭제(휴지통)*/
								Arg5: _folder,
								/*forder name*/
								Arg6: _folderunid,
								/*folder unid*/
								Arg7: "",
								/*규칙 수정할 경우 규칙문서 UNID*/
								Arg8: _options.viewalias /*현재 보기*/
							};

							var callback = function (_obj, data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										var altmsg = "";
										if (data.hasOwnProperty("cnt")) {
											altmsg += "[ " + data["cnt"] + " ] " + $fn.getCodeMsg("mail.msg.alt07") + "<br>";
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return; //작업을 완료 할 수 없습니다
										}
										if (data.hasOwnProperty("movecnt")) {
											altmsg += "[ " + data["movecnt"] + " ] " + $fn.getCodeMsg("mail.msg.alt08") + "<br>";
										} else {
											$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
											return; //작업을 완료 할 수 없습니다
										}
										$fn.alert({ msg: altmsg }).done(function () {
											obj.close();
											view.reload();
										});
									}
								}
							};
							_$$.mail.com.cmdpost(_pdata, callback);
						}
					},
					{
						title: $fn.getCodeMsg("mail.btn.cancel"),
						click: function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(_ele, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("mail.title.ruleset"),
					width: 730,
					height: 348,
					show: "fade", //effect
					hide: "fade", //effect
					buttons: _buttons,
					send_data: opt,
					content: { url: _options.cdb + "/wFrmRuleSet?ReadForm", data: {} }
				});
			},

			/* _$$.mail.view._act_spam_rule_callback >> act_spam_rule  > function에서 callback 호출 (보기에서 문서 선택 후 스팸/규칙 설정)*/
			_act_spam_rule_mobile_callback: function (view, opt) {
				var _folderunid = "",
					_pdata = {};

				$fn.cmdPostEx({
					url: $fn.getProxyUrl(view.options.cdb + "/wcmdpost?openform"),
					async: false,
					dataType: "json",
					data: { actiontype: "dblookup", arg3: "($FolderInfo)", arg4: "JunkMail", arg6: "1" },
					success: function (data, textStatus) {
						if (data.cnt == "0") {
							$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
							return; //작업을 완료 할 수 없습니다
						}
						_folderunid = data.rtnval;
					}
				});
				_pdata = {
					WQS_Agent: "wAgtCmdProcess",
					/*actiontype : "new_rule_movedoc",*/
					actiontype: "new_rule",
					postdata: opt.postdata,
					Arg1: "1",
					/*사용유무*/
					Arg2: "Sender",
					/*조건설정 (발신자명/주소, 제목)*/
					Arg3: "1",
					/*다음을 포함 (1), 다음과 같음 (2)*/
					Arg4: "mailaddress",
					/*조건설정 (메일주소, 사용자선택)*/
					Arg5: opt.domain,
					/*검색 문자열*/
					Arg6: "",
					/*사용자 NotesID*/
					Arg7: "",
					/*사용자 Org Data*/
					Arg8: "junk",
					/*처리방법 (영구보관함으로 이동, 스펨메일함으로 이동, 삭제(휴지통)*/
					Arg9: "($JunkMail)",
					/*forder name*/
					Arg10: _folderunid,
					/*folder unid*/
					Arg11: "",
					/*편집중인 규칙문서 UNID*/
					Arg12: opt.postdata,
					/*등록하는 규칙 정보와 일치하는 문서가 있을 경우 즉시 폴더로 이동한다 (대상문서의 UNID)*/
					Arg13: view.options.viewalias /*현재 보기명*/
				};

				var callback = function (_obj, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							var altmsg = "";
							if (data.hasOwnProperty("cnt")) {
								altmsg += "[ " + data["cnt"] + " ] " + $fn.getCodeMsg("mail.msg.alt07") + "<br>";
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return; //작업을 완료 할 수 없습니다
							}
							if (data.hasOwnProperty("movecnt")) {
								altmsg += "[ " + data["movecnt"] + " ] " + $fn.getCodeMsg("mail.msg.alt08") + "<br>";
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return; //작업을 완료 할 수 없습니다
							}
							$fn.alert({ msg: altmsg }).done(function () {
								$fn.lnbCountRefresh();
								view.reload();
							});
						}
					}
				};
				_$$.mail.com.cmdpost(_pdata, callback);
			},

			/* _$$.mail.view.act_spam_rule >> 보기에서 문서 단일 및 다중 선택 후 스팸/규칙 등록하고 즉시 선택된 메일을 폴더(영구보관함/스팸)로 이동*/
			act_spam_rule: function (view, opt) {
				var _me = this,
					_rows = view.getChecked(),
					_unids = ""; //, _viewname = "", _options = view.options, _el = view.element;
				var opt = opt || {},
					_opt = $.extend({ unid: "", ismobile: false }, opt);

				if (_opt.ismobile == false) {
					if (_rows.length == 0) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") }); //문서를 선택하십시요
						return;
					}
					if (_rows.length > 1) {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err19") }); //1 건 이상 처리할 수 없습니다.
						return;
					}
					_unids = $.map(_rows, function (v) {
						return v["@unid"];
					}).join(";");
				} else {
					_unids = _opt.unid;
				}

				var callback = function (obj, data) {
					if (data.rcnt == "0") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt06") }); //등록 가능한 메일 외부 도메인 정보가 없습니다.
						return;
					}
					if (_opt.ismobile == true) {
						_me._act_spam_rule_mobile_callback(view, $.extend(obj, _opt, data)); //모바일에서 스팸처리
					} else {
						_me._act_spam_rule_callback(view, $.extend(obj, data)); //PC 화면에서 규칙처리
					}
				};
				_$$.mail.com.cmdpost({ actiontype: "seldoc_get_domain", postdata: _unids }, callback);
			},

			/* _$$.mail.view.act_ruleset  >>  보기에서 문서 단일 및 다중 선택 후 규칙설정 하고 즉시 선택된 메일을 폴더(영구보관함/스팸)로 이동*/
			act_ruleset: function (view) {
				var _me = this,
					_rows = view.getChecked(),
					_unids = ""; //, _viewname = "", _options = view.options, _el = view.element;
				if (_rows.length == 0) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") }); //문서를 선택하십시요
					return;
				}
				if (_rows.length > 1) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err19") }); //1 건 이상 처리할 수 없습니다.
					return;
				}
				_unids = $.map(_rows, function (v) {
					return v["@unid"];
				}).join(";");

				var _data = {
					init_callback: function (inst) {
						//console.log("다이얼로그 로딩 이후... inst >> ", inst)	//여기서는 사용하지 않음.
					},
					save_callback: function (obj, _obj, data) {
						//규칙설정 이후 dialog 닫고... 보기 새로고침
						obj.close();
						view.reload();
					}
				};

				var callback = function (obj, data) {
					if (data.selmailinfo == "") {
						$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt11") }); //선택 메일의 정보를 찾을 수 없습니다.
						return;
					}
					_$$.mail.mng.rules_edit(view, $.extend(data, _data)); //규칙설정 dialog open
				};
				_$$.mail.com.cmdpost({ actiontype: "seldoc_get_rulesetinfo", postdata: _unids }, callback);
			},

			/* _$$.mail.view.act_junkrestoration  >>  스팸메일함에서 선택한 메일을 받은메일함으로 복구*/
			act_junkrestoration: function (view) {
				var _me = this,
					_rows = view.getChecked(),
					_unids = ""; //, _viewname = "", _options = view.options, _el = view.element;
				if (_rows.length == 0) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") }); //문서를 선택하십시요
					return;
				}
				_unids = $.map(_rows, function (v) {
					return v["@unid"];
				}).join(";");

				var callback = function (obj, data) {
					view.reload();
					_$$.mail.com.update_left_count(["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)"]);
				};
				_$$.mail.com.cmdpost({ actiontype: "junkrestoration", postdata: _unids }, callback);
			},

			/* _$$.mail.view.act_trash_restoration  >>  메일폐기함(휴지통) 에서 선택된 문서 복원*/
			act_trash_restoration: function (view) {
				var _me = this,
					_rows = null,
					_unids = "",
					_tr = null,
					_type = "",
					_viewname = "",
					_options = null;

				_type = "multi";
				_viewname = view.options.viewalias;
				_tr = view.getCheckedRows();
				_rows = view.getChecked();
				if (_rows.length == 0) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
					return;
				}

				_unids = $.map(_rows, function (v) {
					return v["@unid"];
				}).join(";");

				var callback = function (obj, data) {
					view.reload();
					_$$.mail.com.update_left_count(["($inbox_unread)", "($inbox_onlyunread)", "($inbox_in)", "($inbox_ext)", "($inbox_in_app)"]);
				};

				_$$.mail.com.cmdpost({ actiontype: "trash_restoration", postdata: _unids }, callback);
			},

			/* _$$.mail.view._sub_act_addaddress  >>  주소록 등록 --- act_addaddress 에서 호출... 최종 등록버튼 클릭하면 실행*/
			_sub_act_addaddress: function (obj) {
				var _ele = obj.element,
					address_data = $(".dwp-address-data", _ele),
					_address = "",
					_name = "",
					_com = "",
					_relation = "",
					_relation_nm = "",
					_relation_manual = "",
					tmp = "",
					_kor = "",
					_eng = "",
					keycode = {},
					idx = 0;
				$.each(address_data, function (i, o) {
					idx = $(o).attr("idx");
					if (_address != "") {
						_address += ";";
						_name += ";";
						_com += ";";
						_relation += ";";
						_relation_nm += ";";
						_relation_manual += ";";
						_kor += ";";
						_eng += ";";
					} //하나 이상일 때 각 변수에 구분자 추가
					_address += $("[name=address_" + idx + "]", o).text();
					tmp = $.trim($("[name=addrname_" + idx + "]", o).xval());
					_name += tmp == "" ? "-" : tmp;
					keycode = _$$.mail.com.KeyCodeSet(tmp);
					_kor += keycode["ko"] == "" ? "-" : keycode["ko"];
					_eng += keycode["en"] == "" ? "-" : keycode["en"];
					tmp = $.trim($("[name=addrcomname_" + idx + "]", o).xval());
					_com += tmp == "" ? "-" : tmp;
					/*
					tmp = $.trim($("[name=MU_Relation_"+idx+"]", o).xval()); _relation += (tmp == "" ? "-" : tmp);
					if (tmp == "5") {
						_relation_manual += $.trim($("[name=MU_Relation_Manual_"+idx+"]", o).xval());
					} else {
						_relation_manual += "-";
					}
					_relation_nm += $.trim($("[name=MU_Relation_Nm_"+idx+"]", o).xval());
					 */
				});
				if (_address == "") {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err28") });
					return;
				} //등록가능한 메일주소 정보가 없습니다

				var _callback = function (_obj, _data) {
					if (_data.hasOwnProperty("result")) {
						if (_data.result >= "200" && _data.result < "300") {
							if (_data.hasOwnProperty("cnt") && _data.hasOwnProperty("cnt_fail")) {
								var _msg = $fn.getCodeMsg("mail.msg.alt16") + "<br><br>";
								_msg += $fn.getCodeMsg("mail.msg.alt17") + " : [ " + _data.cnt + " ]<br>";
								_msg += $fn.getCodeMsg("mail.msg.alt18") + " : [ " + _data.cnt_fail + " ]<br>";
								$fn.alert({ msg: _msg });
								obj.close();
							} else {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.err00") });
								return;
							}
						}
					}
				};
				_$$.mail.com.cmdpost({ actiontype: "add_address", Arg1: _address, Arg2: _name, Arg3: _com, Arg4: _relation, Arg5: _relation_nm, Arg6: _relation_manual, Arg7: _kor, Arg8: _eng }, _callback);
			},

			/* _$$.mail.view.act_addaddress  >>  주소록 등록 --- 선택 메일의 발신인,수신인,참조인 (외부메일주소를 개인주소록에 등록)*/
			act_addaddress: function (view) {
				var _me = this,
					_rows = view.getChecked(),
					_unids = "",
					arrDefault = {},
					stroption = "",
					chkval = "^$^";
				var viewentry = null,
					entrydata = null,
					entrytext = "",
					tmp = [],
					CompanyName = [],
					Relation = [],
					_selectbox = "",
					_url = "";
				_url = view.options.cdb + "/PersonAddressSystem?readviewentries&CollapseView&start=1&count=999&Outputformat=JSON";
				if (_rows.length == 0) {
					$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt02") });
					return;
				}
				_unids = $.map(_rows, function (v) {
					return v["@unid"];
				}).join(";");

				arrDefault = $fn.getCodeMsg("mail.data.mu_relation"); //개인주소록 등록화면의 관계 필드의 기본값 가져오기
				$.each(arrDefault, function (i, o) {
					stroption += "<option data-xlang-txt=" + o + ' value="' + i + '">' + o + "</option>";
					chkval += o + "^$^";
				});

				var callback = function (obj, data) {
					if (data.hasOwnProperty("result")) {
						if (data.result >= "200" && data.result < "300") {
							if (data.hasOwnProperty("cnt")) {
								if (data.cnt == "0") {
									$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt06") });
									return;
								}
								var address = [],
									addrname = [],
									len = 0,
									addrhtml = '<div class="dwp-table-vertical">',
									_height = 400,
									weblib = $fn.getPath("weblib"),
									chkdomain = true;
								address = data.address.split(";");
								(addrname = data.addrname.split(";")), (len = address.length);
								addrhtml += '<div class="dwp-row">';
								addrhtml += '<div class="dwp-value" style="width:15px;"></div>'; //삭제 아이콘
								addrhtml += '<div class="dwp-value" style="width:250px;text-align:center;font-weight:700;">' + $fn.getCodeMsg("mail.title.mailaddress") + "</div>"; //메일주소
								addrhtml += '<div class="dwp-value" style="text-align:center;font-weight:700;">' + $fn.getCodeMsg("mail.title.name") + "</div>"; //이름
								addrhtml += '<div class="dwp-value" style="text-align:center;font-weight:700;">' + $fn.getCodeMsg("mail.title.comname") + "</div>"; //회사명
								//addrhtml += "<div class=\"dwp-value\" style=\"text-align:center;font-weight:700;\">" + $fn.getCodeMsg("mail.title.connection") + "</div>";			//관계
								addrhtml += "</div>";

								var checkDomain = function (mailaddress) {
									//@hankooktire.com, @emfrontier.com 메일 도메인은 추가하지 않음
									chkdomain = true;
									$.each(_$$.mail.com.CONST.MAILDOMAIN, function (i, val) {
										var p = new RegExp(val, ["i"]);
										if (p.exec(mailaddress) != null) chkdomain = false;
									});
									return chkdomain;
								};

								for (var i = 0; i < len; i += 1) {
									if (checkDomain(address[i]) == true) {
										addrhtml += '<div class="dwp-row dwp-address-data mailaddress' + i + '" idx="' + i + '">';
										addrhtml += '<div class="dwp-value del-row" style="width:15px;" idx="' + i + '"><span><img style="width:15px;cursor:pointer;" src="' + weblib + '/images/common/icon-close.svg"></span></div>';
										addrhtml += '<div class="dwp-value" style="width:250px;" name="address_' + i + '" title="' + address[i] + '">' + address[i] + "</div>";
										addrhtml += '<div class="dwp-value"><div class="dwp-input expended"><input name="addrname_' + i + '" value="' + (addrname[i] == "-" ? "" : addrname[i]) + '" type="text"></div></div>';
										addrhtml += '<div class="dwp-value"><div class="dwp-input expended"><input name="addrcomname_' + i + '" value="" type="text"></div></div>';

										//addrhtml += "<div class=\"dwp-value\"><div class=\"dwp-selectbox md\"><div class=\"dwp-selection-group\">";
										//addrhtml += "<input name=MU_Relation_" + i + " value=\"\" type=hidden><input name=MU_Relation_Nm_" + i + " value=\"\" type=hidden>"
										//addrhtml += "<select name=MU_Relation_" + i + " class=\"dwp-mu_relation\">" + stroption + "</select>";
										//addrhtml += "</div></div>";
										//addrhtml += "<div class=\"dwp-input expended dwp-mu-relation-manual_"+i+" dwp-hidden\" style=\"margin-top:8px;\"><input name=\"MU_Relation_Manual_"+i+"\" value=\"\"></div>";
										//addrhtml += "</div></div>";

										addrhtml += "</div>";
									}
								}
								addrhtml += "</div>";

								var _buttons = [
									{
										title: $fn.getCodeMsg("mail.btn.savedoc"),
										click: function (__obj) {
											_me._sub_act_addaddress(__obj); //주소록 등록 화면 최종 저장
										}
									},
									{
										title: $fn.getCodeMsg("mail.btn.cancel"),
										click: function (__obj) {
											__obj.close();
										}
									}
								];
								if (len > 4) {
									_height += (len - 4) * 50;
								}
								if (_height > 600) _height = 600;
								$fn.dialog(null, {
									modal: true,
									resizable: true,
									draggable: true,
									title: $fn.getCodeMsg("mail.title.addaddress"),
									width: 750,
									height: _height,
									show: "fade", //effect
									hide: "fade", //effect
									//autoOpen: false,		//.dialog("open")호출시만 열림
									//initcallback : function() {alert(1111)},
									open: function (__opt) {
										var _this = this;
										$(".dwp-mu_relation", _this).on("change", function () {
											var _xval = $(this).xval(),
												idx = $(this).attr("name");
											idx = idx.substr(idx.lastIndexOf("_") + 1, idx.length);
											$("input[name=MU_Relation_" + idx + "]", _this).xval(_xval);
											$("input[name=MU_Relation_Nm_" + idx + "]", _this).xval($(":selected", $(this)).text());
											if (_xval == "5") {
												$(".dwp-mu-relation-manual_" + idx, _this).removeClass("dwp-hidden");
											} else {
												$(".dwp-mu-relation-manual_" + idx, _this).addClass("dwp-hidden");
											}
											$("input[name=MU_Relation_Manual_" + idx + "]", _this).xval("");
										});
										$(".del-row", _this)
											.off("click")
											.on("click", function () {
												$(".mailaddress" + $(this).attr("idx"), _this).remove();
											});
									},
									buttons: _buttons,
									content: { html: addrhtml, url: "" }
								});
							}
						}
					}
					return;
				};

				_$$.mail.com.cmdpost({ actiontype: "get_outmailaddress", Arg1: _unids }, callback); //선택한 메일의 외부메일 주소를 가져와서 callback 실행
			},

			/* view button */
			_buttonInfo: function (_opt) {
				var _me = this,
					_folderunid = _opt.folderunid || "";
				var _btnList = {
					// 메일 목록 체크박스 + 컨텍스트메뉴 UI 추가. added by noh at 24.05.08
					chkmenu: {
						title: "체크박스",
						/*체크박스*/
						// 	css: "dwp-cell check-cell",
						// 	icon: $fn.getPath("weblib") + "/images/common/arrow-down.svg"
						click: function (view) {
							// var _el = $(event.srcElement).parent().parent();
							// $("img", _el).click();
						}
					},
					chkmenu_check: {
						title: "전체선택",
						click: function (view) {
							var _$chkall = $("input[name='chkall']", view.element);
							_$chkall.prop("checked", false);
							_$chkall.click();
						}
					},
					chkmenu_uncheck: {
						title: "선택안함",
						click: function (view) {
							var _$chkall = $("input[name='chkall']", view.element);
							_$chkall.prop("checked", true);
							_$chkall.click();
						}
					},
					chkmenu_read: {
						title: "읽음",
						click: function (view) {
							//전체해제
							var _$chkall = $("input[name='chkall']", view.element);
							_$chkall.prop("checked", true);
							_$chkall.click();

							// _$chkall.prop("checked", true);
							var _target = $("div.dwp-table-inner", view.element);
							var _element = view;
							var _chks$ = $("div.dwp-table-row:has(span.read.active) input[name=chk]", _target);
							_chks$.prop("checked", true);
							$.each(_chks$, function (cindex, _chk) {
								var _row$ = $(_chk).closest(".dwp-table-row");
								_row$.addClass("dwp-row-selected");
								_element.options.selectedtr = _row$.attr("data-key-unid");
							});
						}
					},
					chkmenu_unread: {
						title: "읽지않음",
						click: function (view) {
							//전체해제
							var _$chkall = $("input[name='chkall']", view.element);
							_$chkall.prop("checked", true);
							_$chkall.click();

							// _$chkall.prop("checked", true);
							var _target = $("div.dwp-table-inner", view.element);
							var _element = view;
							var _chks$ = $("div.dwp-table-row:not(:has(span.read.active)) input[name=chk]", _target);
							_chks$.prop("checked", true);
							$.each(_chks$, function (cindex, _chk) {
								var _row$ = $(_chk).closest(".dwp-table-row");
								_row$.addClass("dwp-row-selected");
								_element.options.selectedtr = _row$.attr("data-key-unid");
							});
						}
					},
					chkmenu_star: {
						title: "별표",
						click: function (view) {
							//전체해제
							var _$chkall = $("input[name='chkall']", view.element);
							_$chkall.prop("checked", true);
							_$chkall.click();

							// _$chkall.prop("checked", true);
							var _target = $("div.dwp-table-inner", view.element);
							var _element = view;
							var _chks$ = $("div.dwp-table-row:has(span.mark.active) input[name=chk]", _target);
							_chks$.prop("checked", true);
							$.each(_chks$, function (cindex, _chk) {
								var _row$ = $(_chk).closest(".dwp-table-row");
								_row$.addClass("dwp-row-selected");
								_element.options.selectedtr = _row$.attr("data-key-unid");
							});
						}
					},
					chkmenu_notstar: {
						title: "별표없음",
						click: function (view) {
							//전체해제
							var _$chkall = $("input[name='chkall']", view.element);
							_$chkall.prop("checked", true);
							_$chkall.click();

							// _$chkall.prop("checked", true);
							var _target = $("div.dwp-table-inner", view.element);
							var _element = view;
							var _chks$ = $("div.dwp-table-row:not(:has(span.mark.active)) input[name=chk]", _target);
							_chks$.prop("checked", true);
							$.each(_chks$, function (cindex, _chk) {
								var _row$ = $(_chk).closest(".dwp-table-row");
								_row$.addClass("dwp-row-selected");
								_element.options.selectedtr = _row$.attr("data-key-unid");
							});
						}
					},
					golist: {
						title: "목록",
						/*목록*/
						click: function (view) {
							// view.reload(view.options)
							view.refresh();
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-refresh.svg"
					},
					pcsave: {
						title: $fn.getCodeMsg("mail.btn.pcsave"),
						/*PC저장*/
						click: function (view) {
							_me.MailStore_LocalDonload(view);
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-pc-save.svg"
					},
					movefolder: {
						title: $fn.getCodeMsg("mail.btn.movetofolder"),
						/*영구보관 (폴더로 이동)*/
						click: function (view) {
							_me.act_movetofolder(view);
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-permanent-save.svg"
					},
					trash: {
						title: $fn.getCodeMsg("mail.btn.deletedoc"),
						/*삭제*/
						click: function (view) {
							var opt = { softdel: true, Arg1: view.options.viewalias, confirm: $fn.getCodeMsg("mail.msg.confirm06") };
							//view.deleteDocument(opt);
							_me.viewDeleteDocument(view, opt); //confirm : 선택하신 문서를 삭제 하시겠습니까?"
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-remove.svg"
					},
					permanentdeletion: {
						title: $fn.getCodeMsg("mail.btn.delpermanently"),
						/*영구삭제*/
						click: function (view) {
							var opt = { softdel: false, Arg1: view.options.viewalias, confirm: $fn.getCodeMsg("mail.msg.confirm05") };
							//view.deleteDocument(opt);
							_me.viewDeleteDocument(view, opt); //confirm : 선택하신 메일을 삭제 하시겠습니까?\n삭제된 메일은 복구 할 수 없습니다
						},
						//영구삭제 아이콘으로 변경 - 2024.09.24
						icon: $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"
					},
					spam: {
						title: $fn.getCodeMsg("mail.btn.spamregistration"),
						/*스팸등록 (사용하지 않음.. 규칙설정으로 대체.. 향후 사용 할 수 있음*/
						click: function (view) {
							_me.act_spam_rule(view);
						}
					},
					ruleset: {
						title: $fn.getCodeMsg("mail.btn.ruleset"),
						/*규칙설정*/
						click: function (view) {
							_me.act_ruleset(view);
						}
					},
					starflag: {
						title: $fn.getCodeMsg("mail.btn.starflag"),
						/*중요표시*/
						click: function (view) {
							_me.star_flag(view);
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-mark.svg"
					},
					readflag: {
						title: $fn.getCodeMsg("mail.btn.readflag"),
						/*읽음표시*/
						click: function (view) {
							var _el = $(event.srcElement).parent().parent();
							$("img", _el).click();
						}
					},
					readflag_read: {
						title: $fn.getCodeMsg("mail.btn.readflag_read"),
						/*선택 메일 읽음 표시*/
						click: function (view) {
							_me.act_readflag_read(view);
						}
					},
					readflag_unread: {
						title: $fn.getCodeMsg("mail.btn.readflag_unread"),
						/*선택 메일 안읽음 표시*/
						click: function (view) {
							_me.act_readflag_unread(view);
						}
					},
					readflag_allread: {
						title: $fn.getCodeMsg("mail.btn.readflag_allread"),
						/*모든 메일 읽음 표시*/
						click: function (view) {
							_me.act_readflag_allread(view);
						}
					},
					readflag_allunread: {
						title: $fn.getCodeMsg("mail.btn.readflag_allunread"),
						/*모든 메일 안읽음 표시*/
						click: function (view) {
							_me.act_readflag_allunread(view);
						}
					},
					empty: {
						title: $fn.getCodeMsg("mail.btn.empty"),
						/*비우기*/
						click: function (view) {
							_me.act_trash_empty(view);
						}
					},
					restoration: {
						title: $fn.getCodeMsg("mail.btn.restoration"),
						/*휴지통에서 복원*/
						click: function (view) {
							_me.act_trash_restoration(view);
						}
					},
					junkrestoration: {
						title: $fn.getCodeMsg("mail.btn.junkrestoration"),
						/*스펨해제 (받은메일함으로 이동)*/
						click: function (view) {
							_me.act_junkrestoration(view);
						}
					},
					create: {
							/*메일 템플릿 작성 버튼*/ title: $fn.getCodeMsg("mail.btn.create"),
						click: function (view) {
							view.createDocument({ param: { MemoTemplete: "1" } });
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					},
					addaddress: {
							/*주소록 등록 --- 선택 메일의 발신인,수신인,참조인 (외부메일주소를 개인주소록에 등록)*/ title: $fn.getCodeMsg("mail.title.addaddress"),
						click: function (view) {
							_me.act_addaddress(view);
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-add-addbook.svg"
					},
					create_reject: {
							/*메일수신거부 작성 버튼*/ title: $fn.getCodeMsg("mail.btn.create"),
						click: function (view) {
							$fn.dialog(null, {
								modal: true,
								resizable: false,
								draggable: true,
								islangconvert: false,
								title: $fn.getCodeMsg("mail.title.rejectmail"),
								width: 730,
								height: 460,
								show: "fade", //effect
								hide: "fade", //effect
								//send_data : opt,
								content: { url: _opt.cdb + "/wFrmRejectProfile?OpenForm", data: {} }
							});
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
				},
					_sbtnList = {
						"($inbox)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag", "addaddress", "readflag", "readflag_read", "readflag_unread", "readflag_allread", "readflag_allunread", "ruleset"],
						"($inbox_all)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag", "addaddress", "readflag", "readflag_read", "readflag_unread", "readflag_allread", "readflag_allunread", "ruleset"],
						//"($inbox_in)": ["pcsave","movefolder","trash","permanentdeletion","starflag","readflag","readflag_read","readflag_unread","readflag_allread","readflag_allunread","ruleset"],
						//"($inbox_in_app)"	: ["pcsave","movefolder","trash","permanentdeletion","starflag","readflag","readflag_read","readflag_unread","readflag_allread","readflag_allunread","ruleset"],
						"($inbox_in_app)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "trash", "permanentdeletion", "readflag", "readflag_read", "readflag_unread", "readflag_allread", "readflag_allunread"],

						//"($inbox_ext)": ["pcsave","movefolder","trash","permanentdeletion","starflag","addaddress","readflag","readflag_read","readflag_unread","readflag_allread","readflag_allunread","ruleset"],
						//"($sent)": ["pcsave","movefolder","readflag","readflag_read","readflag_unread","readflag_allread","readflag_allunread","trash","permanentdeletion","starflag"],

						"($inbox_in)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag", "addaddress", "readflag", "readflag_read", "readflag_unread", "readflag_allread", "readflag_allunread", "ruleset"],
						"($inbox_ext)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag", "addaddress", "readflag", "readflag_read", "readflag_unread", "readflag_allread", "readflag_allunread", "ruleset"],


						"($sent)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag"],
						//"($drafts)": ["pcsave","movefolder","readflag","readflag_read","readflag_unread","readflag_allread","readflag_allunread","trash","permanentdeletion"],
						"($drafts)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion"],
						"($all)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "readflag", "readflag_read", "readflag_unread", "readflag_allread", "readflag_allunread", "trash", "permanentdeletion", "starflag"],
						threads: ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag"],
						threads_cate: ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag"],
						"($inbox_unread)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag", "addaddress", "readflag", "readflag_read", "readflag_allread", "ruleset"],
						$reservemail: ["permanentdeletion"],
						"($isstar)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "readflag", "readflag_read", "readflag_unread", "readflag_allread", "readflag_allunread", "trash", "permanentdeletion", "starflag"],
						"($isattach)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "trash", "permanentdeletion", "starflag", "ruleset"],
						junkmail: ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "permanentdeletion", "empty", "junkrestoration"],
						"($trash)": ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "movefolder", "permanentdeletion", "empty", "restoration"],
						$templete: ["create", "trash", "permanentdeletion"],
						folder_default: ["chkmenu", "chkmenu_check", "chkmenu_uncheck", "chkmenu_read", "chkmenu_unread", "chkmenu_star", "chkmenu_notstar", "golist", "pcsave", "trash", "movefolder", "permanentdeletion", "starflag", "readflag", "readflag_read", "readflag_unread", "readflag_allread", "readflag_allunread"],
						$rejectmail: ["create_reject", "permanentdeletion"], //2019.03.08 added by lhj 메일수신거부
						w_yearcfg: [], //2017.09.29 added by dwlee
						w_send_yearcfg: [], //2017.09.29 added by dwlee
						w_receive_yearcfg: [] //2017.09.29 added by dwlee
					};
				if (_folderunid.length == 32) {
					return $dwp.core.util.exObjList(_btnList, _sbtnList["folder_default"]); //폴더일 경우 기본 템플릿은 "folder_default"
				} else {
					return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);
				}
			},

			/* view header */
			_headerInfo: function (_opt) {
				var _me = this,
					_col = {},
					_vdata = {},
					_hList = {},
					__opt = $.extend({ folderunid: "", getcol: "" }, _opt);
				_col = {
					/*별표*/
					isstarred: {
						name: "_isstarred",
						type: "fnc",
						title: "",
						/*'<span class="mark" style="cursor:default;"></span>',*/
						width: "30px",
						sort: false,
						css: "mark-cell",
						content: function (obj) {
							return obj["_isstarred"] == "1" ? '<span class="mark active"></span>' : '<span class="mark"></span>';
						},
						click: function (obj, json) {
							_me.star_flag(obj, json);
						}
					},
					/*읽음*/
					isread: {
						name: "_isread",
						type: "fnc",
						title: "",
						/*'<span class="read"></span>',*/
						width: "30px",
						sort: false,
						css: "read-cell",
						content: function (obj) {
							return obj["_isread"] == "1" ? '<span class="read active"></span>' : '<span class="read"></span>';
						},
						click: function (obj, json) {
							if ($("span.active", obj).size() == 1) {
								_me.act_readflag_unread(obj, json);
							} else {
								_me.act_readflag_read(obj, json);
							}
						}
					},
					/*수신확인*/
					returnreceipt: {
						name: "_returnreceipt",
						type: "fnc",
						title: "",
						width: "30px",
						sort: false,
						css: "file-cell",
						content: function (obj) {
							return obj["_returnreceipt"] == "1" ? '<img src="' + $dwp.core.getPath("weblib") + '/images/common/icon-chk-receipt.svg">' : "";
						},
						click: function (obj, json) {
							if (json["_returnreceipt"] == "1") _me.act_returnreceipt(obj, json);
						}
					},
					/*첨부*/
					attach: {
						name: "_isattach",
						type: "file",
						title: "",
						/*$fn.getCodeMsg("mail.title.isattach"),*/
						width: "30px",
						sort: false,

						//2024.07.15
						//css: "file-cell"
						css: function (obj) {
							return obj["_isread"] != "1" ? "file-cell active" : "file-cell";
						}
					},
					/*중요*/
					importance: {
						name: "_importance",
						type: "fnc",
						title: "",
						/*'<span class="read"></span>',*/
						width: "30px",
						sort: false,
						css: "imp-cell",
						content: function (obj) {
							return obj["_importance"] == "1" ? '<img src="' + $dwp.core.getPath("weblib") + '/images/common/icon-first.svg">' : "";
						}
					},
					/*연결보기*/
					iscon: {
						name: "_iscon",
						type: "fnc",
						title: "",
						width: "30px",
						//width: _opt.conview == "1" ? "30px" : "0px",
						sort: false,

						//2024.07.15
						//css: "mark-cell",
						css: function (obj) {
							return obj["_isread"] != "1" ? "active" : "";
						},
						content: function (obj) {
							return obj["_iscon"] == "1" ? '<span class="clCon mark-cell" data-tparunid="' + obj["_tparunid"] + '"></span>' : '<span class=""></span>';
						},
						/* 2024.07.15
												content: function (obj) {
													return obj["_iscon"] == "1" ? '<span class="clCon thread-cell" data-tparunid="' + obj["_tparunid"] + '" style="cursor:pointer"><img src="' + $dwp.core.getPath("weblib") + '/images/common/icon-con.svg"></span>' : "";
												},
						*/
						click: function (obj, json) {
							if (json["_iscon"] == "1") {
								$dwp.app.mail.com.goConnection($fn.getInstance("view"), "view", { ismobile: false, tparunid: json["_tparunid"] });
							}
						}
					},
					/*수발신*/
					fromto: {
						name: "_fromto",
						title: $fn.getCodeMsg("mail.title.fromuser"),
						width: "150px",
						sort: false,

						//2024.07.15
						//css: "drag-cell sender-cell"
						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell sender-cell active" : "drag-cell sender-cell";
						}
					},
					/*수발신 시간*/
					date: {
						name: "_date",
						type: "fnc",
						title: $fn.getCodeMsg("mail.title.date"),

						//2024.07.15
						//width: "110px",
						width: "112px",
						sort: true,

						//2024.07.15 by dwlee
						//css: "drag-cell date-cell",

						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell date-cell active" : "drag-cell date-cell";
						},
						content: function (obj) {
							return $dwp.core.util.formatDateTime(obj["_date"], "relative1");
						}
					},
					/*읽지않음메일*/
					subject_bold: {
						name: "_subject",
						type: "fnc",
						title: '<div class="dwp-center">' + $fn.getCodeMsg("mail.title.subject") + "</div>",
						width: "auto",
						sort: true,
						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell subject-cell active" : "drag-cell subject-cell";
						}
					},
					/*메일사이즈*/
					size: {
						name: "_size",
						type: "fnc",
						/*title : "<div class=\"dwp-center\">" + $fn.getCodeMsg("mail.title.size") + "</div>",*/
						title: "" + $fn.getCodeMsg("mail.title.size") + "",
						width: "60px",
						sort: true,

						//2024.07.15
						//css: "drag-cell dwp-right size-cell",
						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell dwp-right size-cell active" : "drag-cell dwp-right size-cell";
						},
						content: function (obj) {
							return _$$.mail.com.filesize(obj["_size"]) + " ";
						}
					},
					/*발신인*/
					sendto: {
						name: "_fromto",
						title: $fn.getCodeMsg("mail.title.senduser"),
						width: "150px",
						sort: false,

						//2024.07.15
						//css: "drag-cell sender-cell"
						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell sender-cell active" : "drag-cell sender-cell";
						}
					},
					/*제목*/
					subject: {
						name: "_subject",
						type: "text",
						title: '<div class="dwp-center">' + $fn.getCodeMsg("mail.title.subject") + "</div>",
						width: "auto",
						sort: true,
						//css: "drag-cell subject-cell" //subject-cell 이 빠져서 추가함. 23.06.21
						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell dwp-right size-cell active" : "drag-cell dwp-right size-cell";
						},
					},
					/*수발신*/
					sendtofrom: {
						name: "_fromto",
						title: $fn.getCodeMsg("mail.title.sendtofrom"),
						width: "150px",
						sort: false,

						//2024.07.15
						//css: "drag-cell sender-cell"

						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell sender-cell active" : "drag-cell sender-cell";
						}
					},
					/*제목(스레드보기)*/
					subject_threads: {
						name: "_subject",
						type: "fnc",
						title: '<div class="dwp-center">' + $fn.getCodeMsg("mail.title.subject") + "</div>",
						width: "auto",
						sort: true,

						//2024.07.15
						//css: "drag-cell subject-cell",
						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell subject-cell active" : "drag-cell subject-cell";
						},
						content: function (obj) {
							return '<div class="dwp-subject"><a>' + _$$.mail.com.repeat_space("com", obj["@position"], "20") + obj["_subject"] + "</a></div>";
						}
					},
					/*제목(스레드보기)*/
					subject_threads_cate: {
						name: "_subject",
						type: "fnc",
						title: '<div class="dwp-center">' + $fn.getCodeMsg("mail.title.subject") + "</div>",
						width: "auto",
						sort: true,
						//2024.07.15
						//css: "drag-cell subject-cell",
						css: function (obj) {
							return obj["_isread"] != "1" ? "drag-cell subject-cell active" : "drag-cell subject-cell";
						},
						content: function (obj) {
							return '<div class="dwp-subject"><a>' + _$$.mail.com.repeat_space("cate", obj["@position"], "10") + obj["_subject"] + "</a></div>";
						}
					},
					/*예약일자*/
					reservedate: {
						name: "_reservedate",
						type: "fnc",
						title: $fn.getCodeMsg("mail.title.reservedate"),
						width: "150px",
						sort: true,
						css: "drag-cell date-cell",
						content: function (obj) {
							return $dwp.core.util.formatDateTime(obj["_reservedate"], "relative1");
						}
					},
					/*예약시간*/
					reservetime: {
						name: "_reservetime",
						type: "date",
						title: $fn.getCodeMsg("mail.title.reservetime"),
						width: "90px",
						sort: false,
						css: "drag-cell"
					},
					/*수신/참조인 카운트*/
					fromtocnt: {
						name: "_fromtocnt",
						title: "",
						width: "50px",
						sort: false,
						css: "drag-cell"
					},
					/*간략 본문 - 모바일용*/
					bodylight: {
						name: "_bodylight",
						title: "",
						width: "",
						sort: false
					},
					// 2019-03-08 By LHJ 메일수신거부
					mailaddr: {
						name: "_mailaddr",
						title: $fn.getCodeMsg("메일주소"),
						width: "200px",
						sort: false,
						css: "dwp-cursor"
					},
					rejectterm: {
						name: "_fromdate",
						type: "fnc",
						title: $fn.getCodeMsg("기간"),
						width: "200px",
						sort: false,
						content: function (obj) {
							return $dwp.core.util.formatDateTime(obj["_fromdate"], "dateonly") + "-" + $dwp.core.util.formatDateTime(obj["_todate"], "dateonly");
						},
						css: "dwp-cursor"
					},
					rejectmsg: {
						name: "_comment",
						title: $fn.getCodeMsg("전송메시지"),
						width: "auto",
						sort: false,
						css: "dwp-cursor"
					},
					usereject: {
						name: "_usereject",
						type: "fnc",
						title: $fn.getCodeMsg("mail.title.use"),
						width: "100px",
						sort: false,
						content: function (obj) {
							return $fn.getCodeObjMsg("mail.data.rejectmail", obj["_usereject"]);
						},
						css: "dwp-cursor"
					},
					//메일 백업함 관련 - 2017.10.27 by dwlee
					dbyear: {
						name: "_dbyear",
						title: $fn.getCodeMsg("mail.title.dbyear"),
						width: "200px",
						sort: false,
						css: "dwp-cursor"
					},
					dbmonth: {
						name: "_dbmonth",
						title: $fn.getCodeMsg("mail.title.dbmonth"),
						width: "100px",
						sort: false,
						css: "dwp-cursor"
					},
					dbcount: {
						name: "_dbcount",
						title: $fn.getCodeMsg("mail.title.dbcount"),
						width: "100px",
						sort: false,
						css: "dwp-cursor"
					},
					dbsize: {
						name: "_dbsize",
						title: $fn.getCodeMsg("mail.title.dbsize"),
						width: "auto",
						sort: false,
						css: "dwp-cursor"
					},
					dbmaxsize: {
						name: "_dbmaxsize",
						title: $fn.getCodeMsg("mail.title.dbmaxsize"),
						width: "auto",
						sort: false,
						css: "dwp-cursor"
					},
					/* 현재폴더 */
					curfolder: {
						name: "_movefolder",
						type: "fnc",
						title: $fn.getCodeMsg("mail.title.curfolder"),
						width: "150px",
						sort: false,
						css: "dwp-cursor",
						content: function (obj) {
							return obj["_movefolder"].replace(/\\/g, "≫");
						},
						click: function (obj) {
							alert("111");
						}
					}
				};
				if (__opt.getcol != "") {
					/*컬럼정보만 사용할 때 (모바일)*/
					if (_col.hasOwnProperty(__opt.getcol)) {
						var __tmp = {};
						__tmp[__opt.getcol] = _col[__opt.getcol];
						return __tmp;
					}
				}
				/* 보기 검색 옵션 기본 */
				_vdata = {
					_search: [
						{ title: $fn.getCodeMsg("mail.data.all"), key: "all" } /*전체*/,
						{ title: $fn.getCodeMsg("mail.title.subject"), key: "Subject" } /*제목*/,
						{ title: $fn.getCodeMsg("mail.data.bodydata"), key: "Body" } /*본문내용*/,
						{ title: $fn.getCodeMsg("mail.data.date"), key: "DeliveredDate|PostedDate", type: "date" } /*일자*/,
						{ title: $fn.getCodeMsg("mail.title.delivereddate"), key: "DeliveredDate", type: "date" } /*받은일자*/,
						{ title: $fn.getCodeMsg("mail.title.fromuser"), key: "From|AuthorName" } /*발신자*/,
						{ title: $fn.getCodeMsg("mail.title.senduser"), key: "SendTo|CopyTo|BlindCopyTo|SendToFull|CopyToFull|BlindCopyToFull" } /*수신자*/,
						// { title: $fn.getCodeMsg("mail.data.fromto"), key: "From|AuthorName|SendTo|CopyTo|BlindCopyTo|SendToFull|CopyToFull|BlindCopyToFull" }, /*발신자(수신자)*/
						{ title: $fn.getCodeMsg("comm.title.js020"), key: "AuthorOrgName" } /*부서*/
					]
				};

				_hList = {
					"($inbox)": {
						/*받은메일함*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "isread", "attach", "iscon", "from", "subject_bold", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					"($inbox_all)": {
						/*받은메일함 - 보기설계*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "isread", "attach", "iscon", "importance", "fromto", "subject_bold", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					"($inbox_in)": {
						/*받은메일함 > 내부메일수신*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "isread", "attach", "iscon", "importance", "fromto", "subject_bold", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					"($inbox_in_app)": {
						/*받은메일함 > 내부메일수신 - 시스템알림메일*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "isread", "attach", "iscon", "importance", "fromto", "subject_bold", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					"($inbox_ext)": {
						/*받은메일함 > 외부메일수신*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "isread", "attach", "iscon", "importance", "fromto", "subject_bold", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					"($sent)": {
						/*메일발신함*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "attach", "iscon", "importance", "returnreceipt", "sendto", "fromtocnt", "subject", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							/*
							var _row = $(_this).closest(".dwp-table-row"), _subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1") setTimeout(function() { $fn.lnbCountRefresh(); }, 2000);
							}
							*/
						}
					},
					"($drafts)": {
						/*임시보관함*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["attach", "sendto", "subject", "date", "size"],
						search: _vdata["_search"],
						click: function (view, rowdata) {
							//view.editDocument(rowdata["@unid"])
							if (view.options.ismobile == true) {
								_$$.mail.com.newMail({ link: view.options.cdb + "/wvopen_mo/" + rowdata["@unid"] + "?EditDocument" });
							} else {
								_$$.mail.com.newMail({ url: view.options.cdb + "/" + view.options.viewalias + "/" + rowdata["@unid"] + "?EditDocument" });
							}
						}
					},
					"($all)": {
						/*전체메일함*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "isread", "attach", "iscon", "sendtofrom", "subject_bold", "date", "size", "curfolder"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								//$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					threads: {
						/*메일스레드*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "attach", "sendtofrom", "subject_threads", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								//$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					threads_cate: {
						/*메일스레드 분류*/

						sortnm: "_date",
						sortorder: "descending",
						checkbox: false,
						formalias: "Memo",
						iscategory: true,
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "attach", "sendtofrom", "subject_threads_cate", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"], view.options);

							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								//$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},

					"($inbox_unread)": {
						/*안읽은 메일*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "isread", "attach", "iscon", "importance", "fromto", "subject_bold", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								//$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					"($isstar)": {
						/*중요메일함*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "isread", "attach", "iscon", "importance", "sendtofrom", "subject_bold", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								//$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					$reservemail: {
						/*예약메일함*/ sortnm: "_reservedate",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["attach", "sendto", "subject", "reservedate", "size"], //'reservetime',
						search: _vdata["_search"]
						//,click : function(){}
					},
					junkmail: {
						/*스펨메일함 (정크메일)*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["attach", "fromto", "subject", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								//$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					"($trash)": {
						/*메일폐기함 (휴지통)*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["attach", "importance", "sendtofrom", "subject", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								//$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},
					$templete: {
						/*메일 템플릿*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "wFrmMemoProfile",
						/*isnew : {basedate:'_date'},*/
						isreply: false,
						colnm: ["attach", "subject", "date", "size"],
						search: _vdata["_search"]
						//,click : function(){}
					},
					folder_default: {
						/*영구보관함 기본*/ sortnm: "_date",
						sortorder: "descending",
						checkbox: true,
						formalias: "Memo",
						/*isnew : {basedate:'_date'},*/
						isreply: true,
						colnm: ["isstarred", "importance", "isread", "attach", "iscon", "sendtofrom", "subject_bold", "date", "size"],
						search: _vdata["_search"],
						click: function (view, json, _this) {
							view.openDocument(json["@unid"]);
							var _row = $(_this).closest(".dwp-table-row"),
								_subjectCell = $(".subject-cell.dwp-bold.active", _row);
							if (_subjectCell.size() == 1) {
								//$(".read-cell > span.read", _row).addClass("active");
								_subjectCell.removeClass("dwp-bold active");
								if (view.options.ispopupdoc == "1")
									setTimeout(function () {
										$fn.lnbCountRefresh();
									}, 2000);
							}
						}
					},

					$rejectmail: {
						/*메일수신거부*/ checkbox: true,
						formalias: "wFrmRejctProfile",
						isreply: false,
						iscategory: false,
						colnm: ["usereject", "mailaddr", "rejectterm", "rejectmsg"],
						//search : _vdata["_search"],
						click: function (view, json, _this) {
							$fn.dialog(null, {
								modal: true,
								resizable: false,
								draggable: true,
								islangconvert: false,
								title: $fn.getCodeMsg("mail.title.rejectmail"),
								width: 730,
								height: 460,
								show: "fade", //effect
								hide: "fade", //effect
								//send_data : opt,
								content: { url: _opt.cdb + "/$rejectmail/" + json["@unid"] + "?OpenDocument", data: {} }
							});
						}
					},

					//메일 백업함 관련 - 2017.10.27 by dwlee
					w_yearcfg: {
						checkbox: false,
						formalias: "wLog",
						isreply: false,
						iscategory: false,
						colnm: ["dbyear", "dbmonth", "dbcount", "dbsize", "dbmaxsize"],
						//,search : _vdata["_search"]
						click: function (view, json, _this) {
							var _viewname = "($inbox_all)";
							if (json["_type"] == "1") {
								_viewname = "($sent)";
							}
							var _url = "/" + json["_dbfullpath"] + "/wFrmView?ReadForm&view=" + _viewname;
							$fn.loadPage({ link: $fn.getProxyUrl(_url), linktype: "PAGE" });
						}
					},
					//메일 백업함 관련 : 발신 - 2017.10.27 by dwlee
					w_send_yearcfg: {
						checkbox: false,
						formalias: "wLog",
						isreply: false,
						iscategory: false,
						colnm: ["dbyear", "dbmonth", "dbcount", "dbsize", "dbmaxsize"],
						//,search : _vdata["_search"]
						click: function (view, json, _this) {
							var _viewname = "($inbox_all)";
							if (json["_type"] == "1") {
								_viewname = "($sent)";
							}
							var _url = "/" + json["_dbfullpath"] + "/wFrmView?ReadForm&view=" + _viewname;
							$fn.loadPage({ link: $fn.getProxyUrl(_url), linktype: "PAGE" });
						}
					},
					//메일 백업함 관련 : 수신 - 2017.10.27 by dwlee
					w_receive_yearcfg: {
						checkbox: false,
						formalias: "wLog",
						isreply: false,
						iscategory: false,
						colnm: ["dbyear", "dbmonth", "dbcount", "dbsize", "dbmaxsize"],
						//,search : _vdata["_search"]
						click: function (view, json, _this) {
							var _viewname = "($inbox_all)";
							if (json["_type"] == "1") {
								_viewname = "($sent)";
							}
							var _url = "/" + json["_dbfullpath"] + "/wFrmView?ReadForm&view=" + _viewname;
							$fn.loadPage({ link: $fn.getProxyUrl(_url), linktype: "PAGE" });
						}
					}
				};
				if (__opt.folderunid.length == 32) {
					_hList["folder_default"].col = $dwp.core.util.exObjList(_col, _hList["folder_default"].colnm); //폴더일 경우 기본 템플릿은 "folder_default"
					return _hList["folder_default"];
				} else {
					_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);
					return _hList[_opt.viewalias];
				}
			}
		},

		/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 *
		 * 				여기서부터 모바일 관련
		 *
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
		 */

		/* view_mo function */
		view_mo: {
			getOptions: function () {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},
			init: function (opt, el) {
				var _me = this,
					_view = null,
					/*
					20230424 conview값이 없는 경우 1 세팅
					*/
					opt = $.extend({ conview: "1" }, opt);

				_topt = _me._initOptions(opt);
				_opt = $.extend({}, opt, _topt);
				_view = $fn.view(_opt, el);


				//보기의 SubTitle - 2025.06.26 by dwlee
				_me._makeSubTitle(_view);


				//alert("2");

				//지앤지넷 디자인 보기버튼 생성 - 2025.06.23 by dwlee
				_me._makeBtn(_view);


				//alert("3");

				//하단 Footer On 처리 - 2025.07.31 by dwlee
				$dwp.core.mportal.changeFooterOnOff({type:"view",target:"mail"});


				//alert("4");

				// 2019-12-01 By LHJ
				if ($.inArray(_opt.viewalias, ["($inbox_unread)", "($inbox_onlyunread)", "($inbox_all)", "($inbox_in)", "($inbox_in_app)", "($inbox_ext)"]) != -1) {
					$fn.lnbCountRefresh(); //==>> 최초 메일 화면을 열었을때 보기화면을 열면서 함수를 한번 호출 해야 함  (좌측 메뉴의 각 건수를 표시 함)
				} else if (_opt.viewalias == "$(all)") {
					$(".dwp-header-m-new div.dwp-page-title", $("#dwp_mobile_view")).text($fn.getCodeMsg("mail.title.allmail")); //전체 메일함
				} else if (_opt.viewalias == "$reservemail") {
					$(".dwp-header-m-new div.dwp-page-title", $("#dwp_mobile_view")).text($fn.getCodeMsg("mail.title.schedulemail")); //예약 메일함
				} else if (_opt.viewalias == "junkmail") {
					$(".dwp-header-m-new div.dwp-page-title", $("#dwp_mobile_view")).text($fn.getCodeMsg("mail.title.spammail")); //스팸메일함
				}

				//스크롤시 목록 추가하는 함수 - 2025.07.01 by dwlee
				const container = document.getElementById('dwp-list');
				const content = document.getElementById('dwp-list');

				let loading = false;
				let page = 0;

				var lastScrollTop = 0;

				// 더미 콘텐츠 로딩 함수 (ajax 또는 fetch로 교체 가능)
				function loadMoreContent(pageNum) {
  					loading = true;

  					// 예시: 1초 후 더미 콘텐츠 추가
  					setTimeout(() => {
						var _$nav = $(".dwp-pagination",_view.element);

						console.log("_$nav.size : ", _$nav.size());

						console.log("page : " , page);

						var _$num = $("span[ref='" + page + "']", $(".num", _$nav));

						console.log("_$num.size : ", _$num.size());

						if (_$num.size() > 0) {
							_$num.click();
						}
    						loading = false;
  					}, 1000);
				}

				//alert("5");

/*
				// 스크롤 이벤트 감지
				container.addEventListener('scroll', () => {
  					const scrollBottom = container.scrollTop + container.clientHeight;
  					const scrollHeight = container.scrollHeight;

  					if (scrollBottom >= scrollHeight - 20 && !loading) {
    						page++;
    						loadMoreContent(page);
						//alert("aaaa");
  					}
				});

*/

				//alert("aaaaaa")

				var _$container = $("#dwp-list", _view.element);


				console.log("======================================================");
				console.log("_$container.size : " , _$container.size());
				console.log("======================================================");


				  // 창(Window) 스크롤 이벤트 핸들러 추가
				  _$container.on('scroll', function() {

					var currentScrollTop = _$container.get(0).scrollTop;

					//아래로 스크롤시에만 동작
					if (currentScrollTop > lastScrollTop) {

						const scrollBottom = _$container.get(0).scrollTop + _$container.get(0).scrollHeight;
  						const scrollHeight = _$container.get(0).scrollHeight;

						console.log("_$container.get(0).scrollTop  : " , _$container.get(0).scrollTop);
						console.log("_$container.get(0).scrollHeight : " , _$container.get(0).scrollHeight);


  						if (scrollBottom >= scrollHeight - 20 && !loading) {
    							page++;
    							loadMoreContent(page);
							//alert("aaaa");
  						}
					}
					lastScrollTop = currentScrollTop; // 다음 비교를 위해 현재 위치를 저장
  				});

				//지앤지넷 디자인 : 스와이프 기능 업데이트 - 2025.08.12 by dwlee
				//메일 목록 부부은 제외 처리

/*
				var _$divs = $(".list-grid-m", $("#dwp_mobile_view")).find("> div");
				//문서 본문 SWIPE 닫기 - 2025.07.23 by dwlee
				$.each(_$divs, function(idx, _div) {
					if ($(_div).hasClass("mail-list-m")) {
					} else {
						$(_div).bind("swiperight" , function(event){
							setTimeout(function () {
				              			$dwp.core.history.goback(-1);
				         			}, 100);
						});
					}					
				});
*/

			},


			//보기의 Sub 제목 설정 - 2025.06.26 by dwlee
			_makeSubTitle: function(view) {
				var _el = view.element;
				var _opt = view.options;

				
				console.log("_makeSubTitle -1");

				var _$subtit = $("div.dwp-page-title", $("#dwp_mobile_view"));

				console.log("_makeSubTitle -2");


				_$subtit.html("");

				console.log("_makeSubTitle -3");

				console.log(_opt.viewalias);

				console.log($.inArray(_opt.viewalias, ["($inbox_all)", "($inbox_unread)", "($isstar)", "($inbox_in)", "($inbox_in_app)", "($sent)","($drafts)","($trash)"]));


				if ($.inArray(_opt.viewalias, ["($inbox_all)", "($inbox_unread)", "($isstar)", "($inbox_in)", "($inbox_in_app)", "($sent)","($drafts)","($trash)"]) != -1) {

					console.log("_makeSubTitle -3-1");
					console.log("aaaaaaa");

					var _alarm = {
						"layer": "view",
						"link": "{mail}/wFrmView_mo?ReadForm&view=($inbox_in_app)",
						"linktype": "PAGE",
						"key": "W3187",
						"mid": "W3187",
						"ftitle": "ko:알림메일함,en:Approval Notification,zh:电子审批通知邮件",
						"title": "알림메일함",
						"level": 2,
						"pid": "W0011",
						"linkcnt": "($inbox_in_app)",
						"subtype": "0",
						"type": "0",
						"htitle": "",
						"hlink": "",
						"hlinktype": "",
						"hicon": "",
						"hlinkdata": "",
						"lefticon": "",
						"lefticonfn": "",
						"datalink": "",
						"expandlvl": "",
						"useviewtab": "1",
						"lvl": 1,
						"lnbid": "W0011"
					};

					var _sent = {
						"layer": "view",
						"link": "{mail}/wFrmView_mo?ReadForm&view=($sent)",
						"linktype": "PAGE",
						"key": "W0014",
						"mid": "W0014",
						"ftitle": "ko:보낸메일함,en:Outbox,zh:发件箱",
						"title": "보낸메일함",
						"level": 2,
						"pid": "W0011",
						"linkcnt": "",
						"subtype": "0",
						"type": "0",
						"htitle": "",
						"hlink": "",
						"hlinktype": "",
						"hicon": "",
						"hlinkdata": "",
						"lefticon": "",
						"lefticonfn": "",
						"datalink": "",
						"expandlvl": "",
						"useviewtab": "1",
						"lvl": 1,
						"lnbid": "W0011"
					};

					var _inbox = {
						"layer": "view",
						"link": "{mail}/wFrmView_mo?ReadForm&view=($Inbox_all)",
						"linktype": "PAGE",
						"key": "W0013",
						"mid": "W0013",
						"ftitle": "ko:받은메일함,en:Inbox,zh:收件箱",
						"title": "받은메일함",
						"level": 2,
						"pid": "W0011",
						"linkcnt": "($inbox_onlyunread)",
						"subtype": "0",
						"type": "0",
						"htitle": "",
						"hlink": "",
						"hlinktype": "",
						"hicon": "",
						"hlinkdata": "",
						"lefticon": "",
						"lefticonfn": "",
						"datalink": "",
						"expandlvl": "",
						"useviewtab": "1",
						"lvl": 1,
						"lnbid": "W0011"
					};


					var _trash = {
						"layer": "view",
						"link": "{mail}/wFrmView_mo?ReadForm&view=($trash)",
						"linktype": "PAGE",
						"key": "W0016",
						"mid": "W0016",
						"ftitle": "ko:휴지통,en:Trash,zh:回收站",
						"title": "휴지통",
						"level": 2,
						"pid": "W0011",
						"linkcnt": "",
						"subtype": "0",
						"type": "0",
						"htitle": "",
						"hlink": "",
						"hlinktype": "",
						"hicon": "",
						"hlinkdata": "",
						"lefticon": "",
						"lefticonfn": "",
						"datalink": "",
						"expandlvl": "",
						"useviewtab": "1",
						"lvl": 1,
						"lnbid": "W0011"
					};


					var _important = {
						"layer": "view",
						"link": "{mail}/wFrmView_mo?ReadForm&view=($isstar)",
						"linktype": "PAGE",
						"key": "W0016",
						"mid": "W0016",
						"ftitle": "ko:중요메일함,en:Trash,zh:回收站",
						"title": "중요메일함",
						"level": 2,
						"pid": "W0011",
						"linkcnt": "",
						"subtype": "0",
						"type": "0",
						"htitle": "",
						"hlink": "",
						"hlinktype": "",
						"hicon": "",
						"hlinkdata": "",
						"lefticon": "",
						"lefticonfn": "",
						"datalink": "",
						"expandlvl": "",
						"useviewtab": "1",
						"lvl": 1,
						"lnbid": "W0011"
					};

					var _unread = {
						"layer": "view",
						"link": "{mail}/wFrmView_mo?ReadForm&view=($inbox_unread)",
						"linktype": "PAGE",
						"key": "W0016",
						"mid": "W0016",
						"ftitle": "ko:안읽은메일함,en:Trash,zh:回收站",
						"title": "안읽은메일함",
						"level": 2,
						"pid": "W0011",
						"linkcnt": "",
						"subtype": "0",
						"type": "0",
						"htitle": "",
						"hlink": "",
						"hlinktype": "",
						"hicon": "",
						"hlinkdata": "",
						"lefticon": "",
						"lefticonfn": "",
						"datalink": "",
						"expandlvl": "",
						"useviewtab": "1",
						"lvl": 1,
						"lnbid": "W0011"
					};


					var _$select = $('<select class="dwp-page-select"></select>');

					console.log("aaaaaaa - 1");

					$('<option value="($inbox_all)" '+ (_opt.viewalias == "($inbox_all)" ? "selected":"") + '>'+$fn.getCodeMsg("mail.title.inbox")+'</option>').appendTo(_$select);
					console.log("aaaaaaa - 2");
					$('<option value="($inbox_unread)" '+ (_opt.viewalias == "($inbox_unread)" ? "selected":"") + '>'+$fn.getCodeMsg("mail.title.unreadmailbox")+'</option>').appendTo(_$select);
					$('<option value="($isstar)" '+ (_opt.viewalias == "($isstar)" ? "selected":"") + '>'+$fn.getCodeMsg("mail.title.isstarmailbox")+'</option>').appendTo(_$select);
					$('<option value="($inbox_in_app)" '+ (_opt.viewalias == "($inbox_in_app)" ? "selected":"") + '>'+$fn.getCodeMsg("mail.title.systemmail")+'</option>').appendTo(_$select);						
					$('<option value="($sent)" '+ (_opt.viewalias == "($sent)" ? "selected":"") + '>'+$fn.getCodeMsg("mail.title.outbox")+'</option>').appendTo(_$select);	
					$('<option value="($drafts)" '+ (_opt.viewalias == "($drafts)" ? "selected":"") + '>'+$fn.getCodeMsg("mail.title.drafts")+'</option>').appendTo(_$select);	
					$('<option value="($trash)" '+ (_opt.viewalias == "($trash)" ? "selected":"") + '>'+$fn.getCodeMsg("mail.title.trashmail")+'</option>').appendTo(_$select);																					
					console.log("aaaaaaa - 3");

					_$select.appendTo(_$subtit);
					var _$sel = $("select", _$subtit);
					_$sel.on("change", function() {
						var _sel = $("select", _$subtit).xval();
						if (_sel == "($inbox_all)") {
							$dwp.core.mportal._act(_inbox);
						} else if(_sel == "($inbox_unread)") {
							//$dwp.core.mportal._act(_unread);
							$dwp.core.mportal.loadPage({ link : "{mail}/wFrmView_mo?ReadForm&view=($inbox_unread)", linktype : "PAGE", layer : "view", subtype : "read"} );
						} else if(_sel == "($isstar)") {
							//$dwp.core.mportal._act(_important);
							$dwp.core.mportal.loadPage({ link : "{mail}/wFrmView_mo?ReadForm&view=($isstar)", linktype : "PAGE", layer : "view", subtype : "read"} );
						} else if(_sel == "($drafts)") {
								$dwp.core.mportal.loadPage({ link : "{mail}/wFrmView_mo?ReadForm&view=($drafts)", linktype : "PAGE", layer : "view", subtype : "read"} );

						} else if(_sel == "($inbox_in_app)") {
							$dwp.core.mportal._act(_alarm);
						} else if(_sel == "($sent)") {
							$dwp.core.mportal._act(_sent);
						} else if(_sel == "($trash)") {
							$dwp.core.mportal._act(_trash);
						}

					});
					console.log("aaaaaaa - 4");
				} else {
					console.log("bbbbb");

					console.log("_makeSubTitle -3-2");					
					if (_opt.hasOwnProperty("foldername") && _opt.foldername != "") {
						console.log("ccccccc");
						_$subtit.html(_opt.foldername);
					} else if (_opt.viewalias == "(all)") {
						
					} else if (_opt.viewalias == "(all)") {
						
					} else if (_opt.viewalias == "(all)") {
						
					}

					console.log("_makeSubTitle -3-3");
				}
				console.log("_makeSubTitle -4");
				console.log("_makeSubTitle : =====================================================================");				
			}, 

			//보기버튼 생성 - 2025.06.23 by dwlee
			_makeBtn: function (view) {

				var _el = view.element;
				var _opt = view.options;

			console.log("_makeBtn - 0");

				var _$wrap = $("div.header-btn-group", $("#dwp_mobile_view"));

				if ($("div.dwp-more-btn",_$wrap).size() > 0) {
					$("div.dwp-more-btn",_$wrap).remove();
				}

				var _$nbtns = $('<div class="header-group dwp-more-btn"></div>').appendTo(_$wrap);
				var _$a = $('<a><img src="/tcclibs/images/v2025/m/m-header-more.svg" alt=""></a>').appendTo(_$nbtns);
				var _$qtdialog = null;

				console.log("_makeBtn-qt-0");

				_$a.off("click").on("click", function () {

								console.log("_makeBtn-qt-0-1");

					if (_$qtdialog == null || $("#dwp-qtdialog-docbtn_group").size() == 0) {

						console.log("_makeBtn-qt-1");

						_$qtdialog = $dwp.ui.qtdialog.init(_$a, {
							qtid: "docbtn_group",
							dialogClass: "titleless dropdown-type-dialog",
							width: "110px",
							position: { my: "right top", at: "right bottom", collision: "flipfit" },
							initcallback: function (_$qtdialog) {
								var i = 0;
								var _$ul = $("<ul class='dwp-option-list'></ul>").appendTo(_$qtdialog.element);

								if (_opt.viewalias != "($trash)" && _opt.viewalias != "$reservemail" && _opt.viewalias != "junkmail") {
									var _$rbtn = $('<li> <a class="header-btn-item"><img src="/tcclibs/images/v2025/m/m-header-btn-item-delete.svg" alt="">' + $fn.getCodeMsg("mail.btn.deletedoc") + '</a></li>').appendTo(_$ul);
									_$rbtn.off("click").on("click", function() {
										var _aname = view.options.foldername == "" ? "" : view.options.foldername.replace(/%5C/gi, "\\");
										var _unids = [];
										_unids = $.map(view.getChecked(), function (v, i) {
											return v["@unid"];
										});
										if (_unids.length == 0) {
											$fn.alert({ msg: "문서를 선택하세요." });
											return false;
										}
										$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm06") }).done(function () {
											var callback_del = function (obj, data) {
												$fn.unblock();
												view.checkedAll(false);
												//$("input[name='AllDocCheck']", dwpmo.div.view).parent().find("span").text("전체선택");
												$fn.lnbCountRefresh();

												//view.reload();

												var _page = view.options.page;
												if (view.options.total - _unids.length < (view.options.page - 1) * view.options.ps + 1) {
													_page = _page - 1;
												}
												if (_page < 1) {
													_page = 1;
												}

												$(".dwp-list", view.element).empty();

												view.reload({ page: _page });
											};
											$fn.block(undefined, { notusemsg: true });
											_$$.mail.com.cmdpost({ actiontype: "del_temp", postdata: _unids.join(";"), arg1: _aname }, callback_del);
										});
									});
									console.log("_makeBtn - 2-3");
								}	
				
								//완전삭제
								var _$rbtn = $('<li><a class="header-btn-item"><img src="/tcclibs/images/v2025/m/m-header-btn-item-delete-perm.svg" alt="">' + $fn.getCodeMsg("mail.btn.pdeldoc") + '</a></li>').appendTo(_$ul);
				
								console.log("_makeBtn - 4");
								_$rbtn.off("click").on("click", function() {
									var _aname = view.options.foldername == "" ? "" : view.options.foldername.replace(/%5C/gi, "\\");
									var _unids = [];
				
									_unids = $.map(view.getChecked(), function (v, i) {
										return v["@unid"];
									});
				
									if (_unids.length == 0) {
										$fn.alert({ msg: "문서를 선택하세요." });
										return false;
									}
				
									$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm05") }).done(function () {
										var callback_regdel = function (obj, data) {
											$fn.unblock();
											view.checkedAll(false);
											//$("input[name='AllDocCheck']", dwpmo.div.view).parent().find("span").text("전체선택");
											$fn.lnbCountRefresh();
											//view.reload();
											var _page = view.options.page;
											if (view.options.total - _unids.length < (view.options.page - 1) * view.options.ps + 1) {
												_page = _page - 1;
											}
											if (_page < 1) {
												_page = 1;
											}
											$(".dwp-list", view.element).empty();
											view.reload({ page: _page });
										};
										$fn.block(undefined, { notusemsg: true });
										_$$.mail.com.cmdpost({ actiontype: "del_reg", postdata: _unids.join(";") }, callback_regdel);
									});
								});

/* 주석처리 - 2025.08.12 by dwlee
								$("li", _$ul)
									.off("click")
									.on("click", function () {
										_me.resort($(this).attr("sortnm"), $(this).attr("sortorder"));
										_$qtdialog.close();
									});
				*/
							}
						});
					} else {
						if (_$qtdialog.isOpen()) {
							_$qtdialog.close();
						} else {
							_$qtdialog.open();
						}
					}
				});

				console.log("_makeBtn - 7");
			},


			_initOptions: function (opt) {
				var _me = this,
					_topt = _$$.mail.view.getOptions(opt);

				_topt.header.checkbox = false; //모바일에서는 체크박스 표시안함
				_topt.header.col = $.extend(_topt.header.col, _$$.mail.view._headerInfo({ getcol: "bodylight" })); //간략보기 정보 추가

				//=====================================================
				//		지엔지넷 디자인  변경
				//			 - 2025.06.28 by dwlee
				//=====================================================

				console.log("initOptions -2");

				var _coljson = _topt.header.col;

				console.log("initOptions -2-1");

				if (_coljson.hasOwnProperty("fromto")) {
					_coljson.fromto.width = "";
				}

				if (_coljson.hasOwnProperty("date")) {
					_coljson.date.width = "";
				}

				_topt.header.col = _coljson;

				_topt.header.colnm.push("bodylight");
				_topt.header.formalias = _topt.header.formalias + "_mo"; // 작성양식 수정
				if ($.inArray(_topt.viewalias, ["($inbox_unread)", "($inbox_onlyunread)", "($inbox_all)", "($inbox_in)", "($inbox_in_app)", "($inbox_ext)"]) != -1) {
					_topt.header.click = function (view, vjson) {
						var _this = $("div[data-key-unid='" + vjson["@unid"] + "']", view.element);
						var _read = _this.find(".subject-cell");
						_read.removeClass("active");
						$("div.read", _this).addClass("active");
						var _url = "{mail}/wvopen_mo/" + vjson["@unid"] + "?opendocument&ismobile=1";
						$dwp.core.mportal.loadPage({ link: _url, linktype: "PAGE", layer: "doc", subtype: "read" });
					};
				}

				// 2019-12-01 By LHJ Mobile Checkbox
				_topt.mchkbutton = {
					trash: {
						title: $fn.getCodeMsg("mail.btn.deletedoc"),
						/*삭제*/
						click: function (view) {
							var _aname = view.options.foldername == "" ? "" : view.options.foldername.replace(/%5C/gi, "\\");
							var _unids = [];

							_unids = $.map(view.getChecked(), function (v, i) {
								return v["@unid"];
							});

							if (_unids.length == 0) {
								$fn.alert({ msg: "문서를 선택하세요." });
								return false;
							}

							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm06") }).done(function () {
								var callback_del = function (obj, data) {
									$fn.unblock();
									view.checkedAll(false);
									//$("input[name='AllDocCheck']", dwpmo.div.view).parent().find("span").text("전체선택");
									$fn.lnbCountRefresh();
									view.reload();
								};
								$fn.block(undefined, { notusemsg: true });
								_$$.mail.com.cmdpost({ actiontype: "del_temp", postdata: _unids.join(";"), arg1: _aname }, callback_del);
							});
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-remove.svg"
					},
					permanentdeletion: {
						title: $fn.getCodeMsg("mail.btn.delpermanently"),
						/*영구삭제*/
						click: function (view) {
							var _aname = view.options.foldername == "" ? "" : view.options.foldername.replace(/%5C/gi, "\\");
							var _unids = [];

							_unids = $.map(view.getChecked(), function (v, i) {
								return v["@unid"];
							});

							if (_unids.length == 0) {
								$fn.alert({ msg: "문서를 선택하세요." });
								return false;
							}

							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm05") }).done(function () {
								var callback_regdel = function (obj, data) {
									$fn.unblock();
									view.checkedAll(false);
									//$("input[name='AllDocCheck']", dwpmo.div.view).parent().find("span").text("전체선택");
									$fn.lnbCountRefresh();
									view.reload();
								};
								$fn.block(undefined, { notusemsg: true });
								_$$.mail.com.cmdpost({ actiontype: "del_reg", postdata: _unids.join(";") }, callback_regdel);
							});
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"
					}
				};

				return _topt;
			},
			/* 상단 전체선택 및 삭제 버튼 이벤트 */
			_TopSelDelBtnEvent: function (view) {
				var _this = this,
					_view = view,
					_el = _view.element;

				//IOS Fixed 문제로 인한 수정(2019-04-17)
				$("#top_btn_area", _el).insertBefore($(_el)).show();

				/* 전체선택/전체해제 */
				$("input[name='AllDocCheck']", dwpmo.div.view)
					.off("click")
					.on("click", function () {
						if ($(this).is(":checked")) {
							$("input[name='DocCheck']", _el).xval("1");
							$(this).parent().find("span").text("전체해제");
						} else {
							$("input[name='DocCheck']", _el).xval("");
							$(this).parent().find("span").text("전체선택");
						}
					});

				/* 삭제 */
				$("#top-btn-remove", dwpmo.div.view)
					.off("click")
					.on("click", function () {
						var _callback_del = null;
						var _aname = _view.options.foldername == "" ? "" : _view.options.foldername.replace(/%5C/gi, "\\");
						var _unids = [];

						$("input[name='DocCheck']:checked", _el).each(function () {
							_unids.push($(this).parents(".item").attr("data-key-unid"));
						});

						if (_unids.length == 0) {
							$fn.alert({ msg: "문서를 선택하세요." });
							return false;
						}

						$fn.confirm({ msg: "메일을 삭제하시겠습니까?" }).done(function () {
							callback_del = function (obj, data) {
								$fn.unblock();
								$("input[name='AllDocCheck']", dwpmo.div.view).xval("");
								$("input[name='AllDocCheck']", dwpmo.div.view).parent().find("span").text("전체선택");
								$fn.lnbCountRefresh();
								_view.reload();
							};
							$fn.block(undefined, { notusemsg: true });
							_$$.mail.com.cmdpost({ actiontype: "del_temp", postdata: _unids.join(";"), arg1: _aname }, callback_del);
						});
					});

				/* 영구삭제 */
				$("#top-btn-permanently", dwpmo.div.view)
					.off("click")
					.on("click", function () {
						var callback_regdel = null;
						var _unids = [];

						$("input[name='DocCheck']:checked", _el).each(function () {
							_unids.push($(this).parents(".item").attr("data-key-unid"));
						});

						if (_unids.length == 0) {
							$fn.alert({ msg: "문서를 선택하세요." });
							return false;
						}

						$fn.confirm({ msg: "메일을 영구삭제하시겠습니까?<br>삭제시 복원되지 않습니다." }).done(function () {
							callback_regdel = function (obj, data) {
								$fn.unblock();
								$("input[name='AllDocCheck']", dwpmo.div.view).xval("");
								$("input[name='AllDocCheck']", dwpmo.div.view).parent().find("span").text("전체선택");
								$fn.lnbCountRefresh();
								_view.reload();
							};
							$fn.block(undefined, { notusemsg: true });
							_$$.mail.com.cmdpost({ actiontype: "del_reg", postdata: _unids.join(";") }, callback_regdel);
						});
					});
			},
			/* 좌우 스와이프로 메뉴보기 */
			view_action: function (_event, _view) {
				var _me = this,
					_ele = _view.element,
					_options = _view.options,
					_mail_list = $(".mail-list-m", _ele);

				//체크박스 선택시 활성화 되도록 추가 시작 : 2021-01-27
				$("input[name='chk']", _mail_list)
					.off("click")
					.on("click", function () {
/*
						var _$listheader = $("div.dwp-list-header", _ele);
						var _$listtitle = $("div.dwp-list-title", _$listheader);
						var _$listcheckbox = $("div.dwp-list-checkbox", _$listheader);
						if ($("input[name='chk']:checked", _mail_list).size() == 0) {
							if (_$listtitle.css("display") == "none") {
								_$listcheckbox.hide();
								_$listtitle.show();
							}
						} else {
							if (_$listcheckbox.css("display") == "none") {
								_$listtitle.hide();
								_$listcheckbox.show();
							}
						}
*/
						//지앤지넷 디자인 변경 - 2025.06.23 by dwlee
						var _$allchks = $("div.dwp-list-checkbox", $("div.dwp-list-header-new", _ele));
						if ($("input[name='chk']:checked", _mail_list).size() == 0) {
							_$allchks.addClass("dwp-none");
						} else {
							_$allchks.removeClass("dwp-none");
						}
					});
				//체크박스 선택시 활성화 되도록 추가 종료 : 2021-01-27

				$("div.item", _mail_list).swipe({
					allowPageScroll: "vertical",
					threshold: 50,
					swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
						var _item = $(event.srcElement).parents("div.item"),
							_readDiv = null;
						if (!_item.hasClass("addEvent")) {
							_$$.mail.view_mo.view_add_event(_view, _item); //스와이프 이동에 따른 각 버튼들의 이벤트 처리
							_item.addClass("addEvent");
						}

						if (direction == "left") {
							$(this).addClass("right");
							if ($(this).hasClass("left")) {
								$(this).removeClass("left right");
							}
							if ($(this).hasClass("right")) {
								$(this).siblings().removeClass("left right");
							}
						} else if (direction == "right") {
							//console.log("read div : ", $("div.read", _item).size())
							_readDiv = $("div.read", _item);
							if (_readDiv.size() != 0) {
								$(this).addClass("left");
							}
							//$(this).addClass("left");
							if ($(this).hasClass("right")) {
								$(this).removeClass("left right");
								$(this).find(".option-more").removeClass("active");
							}
							if ($(this).hasClass("left")) {
								$(this).siblings().removeClass("left right");
							}
						}
					}
				});

				if (_options.conview == "1") {
					$("span.iscon", _mail_list).on("click", function () {
						var conKey = $(this).data("tparunid");
						_url = _options.cdb + "/wFrmView" + (_options.ismobile ? "_mo" : "") + "?ReadForm&view=threads_cate&single=" + conKey;

						if (_options.ismobile) {
							$dwp.core.mportal.loadPage({
								link: _url,
								linktype: "PAGE",
								layer: "view",
								subtype: "read"
							});
						}
					});
				} else {
					$("span.iscon", _mail_list).each(function () {
						$(this).hide();
					});
				}
			},

			/* 메일 리스트의 읽음/읽지않음, 중요, 삭제, More 하위 버튼들의 이벤트 추가하기 */
			view_add_event: function (_view, _item) {
				var _me = this,
					_unid = _item.attr("data-key-unid"),
					_isattach = _item.attr("isattach");
				var _attach = $("div.right > span.icon > img[src*=icon-file]", _item);
				/* 읽음처리 */
				$(".read", _item)
					.off("click")
					.on("click", function () {
						var _this = this,
							callback_read = null,
							_type = $(_this).hasClass("active") ? "readflag_unread" : "readflag_read";
						callback_read = function (obj, data) {
							if (_view.options.viewalias == "($inbox_unread)") {
								_view.reload();
							} else {
								var _subject = $(".subject-cell", $(_this).parent());
								if (_type == "readflag_unread") {
									$(_this).addClass("active");
									$(_subject).removeClass("active");
									$(".title", _this).text($fn.getCodeMsg("mail.title.readstatus")); //읽음
								} else {
									$(_this).removeClass("active");
									$(_subject).addClass("active");
									$(".title", _this).text($fn.getCodeMsg("mail.title.notreadstatus")); //읽지않음
								}
								$fn.lnbCountRefresh();
							}
							//_$$.mail.com.update_left_count(["($inbox_unread)","($inbox_in)","($inbox_ext)"]);
						};
						_$$.mail.com.cmdpost({ actiontype: _type, postdata: _unid }, callback_read);
					});

				/* 별표(중요) 처리 */
				$(".option-mark", _item)
					.off("click")
					.on("click", function () {
						var _this = this,
							callback_star = null,
							_row = null;
						callback_star = function (obj, data) {
							if (_view.options.viewalias == "($isstar)") {
								_view.reload();
							} else {
								_row = $(_this).closest(".item");
								$(_this).toggleClass("active");
								if ($(_this).hasClass("active")) {
									$("img.mark-star", _row).attr({ src: $fn.getPath("weblib") + "/images/common/icon-mark-full-on.svg" });
									//$("img.mark-star", _row).attr({src : "/hklibs/images/common/icon-mark-full-on.svg"})
								} else {
									//$("img.mark-star", _row).attr({src : "/hklibs/images/common/icon-mark-on.svg"})
									$("img.mark-star", _row).attr({ src: $fn.getPath("weblib") + "/images/common/icon-mark-on.svg" });
								}
							}
						};
						_$$.mail.com.cmdpost({ actiontype: "starflag", postdata: _unid }, callback_star);
					});

				/* 삭제버튼 */
				$(".option-del", _item)
					.off("click")
					.on("click", function () {
						var _this = this,
							callback_del = null;
						callback_del = function (obj, data) {
							$fn.lnbCountRefresh();
							_view.reload();
						};
						_$$.mail.com.cmdpost({ actiontype: "del_temp", postdata: _unid }, callback_del);
					});

				/* more버튼 눌렀을 때 하위메뉴 노출함수 */
				$(".option-more .title", _item)
					.off("click")
					.on("click", function () {
						$(this).parent().toggleClass("active").closest(".item").siblings().find(".option-more").removeClass("active");
						if ($(this).hasClass("addevent") == false) {
							/* more > 전달 버튼 */
							$("#forward", _item)
								.off("click")
								.on("click", function () {
									if (_attach.size() == 1) {
										//if (_isattach == "true") {
										$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm23") })
											.done(function () {
												//첨부파일을 포함하여 [전달] 하시겠습니까?
												_me.replyforward_mo(_view, { unid: _unid, type: "forward", body: "1", attach: "1" });
											})
											.fail(function () {
												_me.replyforward_mo(_view, { unid: _unid, type: "forward", body: "1", attach: "0" });
											});
									} else {
										_me.replyforward_mo(_view, { unid: _unid, type: "forward", body: "1", attach: "0" });
									}
								});

							/* more > 회신 버튼 */
							$("#reply", _item)
								.off("click")
								.on("click", function () {
									if (_attach.size() == 1) {
										//if (_isattach == "true") {
										$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm21") })
											.done(function () {
												//첨부파일을 포함하여 [회신] 하시겠습니까?
												_me.replyforward_mo(_view, { unid: _unid, type: "reply", body: "1", attach: "1" });
											})
											.fail(function () {
												_me.replyforward_mo(_view, { unid: _unid, type: "reply", body: "1", attach: "0" });
											});
									} else {
										_me.replyforward_mo(_view, { unid: _unid, type: "reply", body: "1", attach: "0" });
									}
								});

							/* more > 전체회신 버튼 */
							$("#allreply", _item)
								.off("click")
								.on("click", function () {
									if (_attach.size() == 1) {
										//if (_isattach == "true") {
										$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm22") })
											.done(function () {
												//첨부파일을 포함하여 [전체회신] 하시겠습니까?
												_me.replyforward_mo(_view, { unid: _unid, type: "allreply", body: "1", attach: "1" });
											})
											.fail(function () {
												_me.replyforward_mo(_view, { unid: _unid, type: "allreply", body: "1", attach: "0" });
											});
									} else {
										_me.replyforward_mo(_view, { unid: _unid, type: "allreply", body: "1", attach: "0" });
									}
								});

							/* more > 영구보관 버튼 */
							$("#movetofolder", _item)
								.off("click")
								.on("click", function () {
									_$$.mail.view.act_movetofolder(_view, { unid: _unid, ismobile: true });
								});

							/* more > 영구삭제 버튼 */
							$("#delpermanently", _item)
								.off("click")
								.on("click", function () {
									var _this = this,
										callback_regdel = null;
									callback_regdel = function (obj, data) {
										$fn.lnbCountRefresh();
										_view.reload();
									};
									_$$.mail.com.cmdpost({ actiontype: "del_reg", postdata: _unid }, callback_regdel);
								});

							/* more > 추가메일 버튼 */
							$("#copysend", _item)
								.off("click")
								.on("click", function () {
									_me.replyforward_mo(_view, { unid: _unid, type: "copysend", body: "1", attach: "1" });
								});

							/* more > 스팸등록 버튼 */
							$("#spamregistration", _item)
								.off("click")
								.on("click", function () {
									_$$.mail.view.act_spam_rule(_view, { unid: _unid, ismobile: true });
								});
						}
						$(this).addClass("addevent");
					});
			},

			/* _$$.mail.doc.replyforward  >>  회신, 전체회신, 전달, 추가발송 버튼 */
			replyforward_mo: function (_view, obj) {
				var _me = this,
					_option = _view.options,
					_opt = {},
					_form = "",
					_obj = $.extend({ type: "", body: "", attach: "" }, obj),
					_attach = "";
				switch (_obj.type) {
					case "allreply":
					case "reply": //전체회신, 회신
						_form = "Reply"; // "Reply With History";		//http://hkdev1.hankooktire.com/mail/asis/defaultmailko.nsf/Reply?OpenForm&ParentUNID=9C64DC54E9DAD14749258050001759B9
						break;
					case "forward": //전달, 추가발송
						_form = "wForward";
						break;
				}
				if (_obj.type == "copysend") {
					//추가발송 (복사해서 수신/참조 똑같이 해서 발송)
					var isresponsedoc = "0",
						getfield = { Arg1: _obj.unid, Arg3: "@IsResponseDoc" },
						docinfo = _$$.mail.com.getfield(getfield);
					isresponsedoc = docinfo[_obj.unid]["Arg3"];
					if (isresponsedoc == "1") {
						//발송했던 메일이 회신 메일이면.. 회신양식으로 다시 발송
						_form = "Reply";
					} else {
						_form = "wForward";
					}
				}
				_attach = _obj.attach == "0" ? "&InheritParent=23" : ""; //첨부파일 제외 URL
				_opt = {
					link: _option.cdb + "/" + _form + "_mo?OpenForm&ParentUNID=" + _obj.unid + _attach + "&inherit=" + _obj.type + "&copybody=" + _obj.body + "&copyattach=" + _obj.attach
				};

				_$$.mail.com.newMail(_opt);
			}
		},

		/* doc_mo function */
		doc_mo: {
			getOptions: function () {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},

			init: function (opt, el) {
				var _me = this,
					/*
									20230424 conview값이 없는 경우 1 세팅
					*/
					opt = $.extend({ conview: "1" }, opt),
					_topt = _me._initOptions(opt);

				var _opt = $.extend({}, opt, _topt);

				var _doc = $fn.doc(_opt),
					_options = _doc.options;



				//2025.06.30 by dwlee
				$(".dwp-header-m-new div.dwp-page-title", _doc.element.parents(".dwp-mobile-area")).text("");

				console.log("doc -2-1");

				//하단 Footer On 처리 - 2025.07.31 by dwlee
				$dwp.core.mportal.changeFooterOnOff({type:"doc",target:"mail"});

				var _$backs = $(".back",$(".inner-m", $("#dwp_mobile_doc"))).css("display","");

				console.log("doc -2-2");

				var _backpoint = -90;
				//포탈에서 문서를 여는 경우 - 2025.07.21 by dwlee
				if (_opt.pathinfo.indexOf("isportal=1") > 0) {
					console.log("doc -2-3");
					_backpoint = -1;
				}

				_$backs.off("click").on("click", function() {
					 $dwp.core.history.goback(_backpoint);
				});

				//지앤지넷 디자인 : 스와이프 기능 업데이트 - 2025.08.12 by dwlee
				//편집시 스와이프 기능 해제 - 2025.09.16 by dwlee
				if (_options.isedit) {
				} else {

/*
					var _$divs = $(".dwp-contents", $("#dwp_mobile_doc")).find("> div");
					//문서 본문 SWIPE 닫기 - 2025.07.23 by dwlee
					$.each(_$divs, function(idx, _div) {
						if ($(_div).hasClass("info-list")) {
							var _$sdivs = $(_div).find("> div");
							$.each(_$sdivs, function(sidx, _sdiv) {
								if ($(_sdiv).hasClass("view-area")) { //본문의 swipe 제외 처리
								} else {
									$(_sdiv).bind("swiperight" , function(event){
										setTimeout(function () {
			              							$dwp.core.history.goback(_backpoint);
			         							}, 100);
									});
								}
							});
						} else {
							$(_div).bind("swiperight" , function(event){
								setTimeout(function () {
					              			$dwp.core.history.goback(_backpoint);
					         			}, 100);
							});
						}					
					});
*/
				}
				//지앤지넷 디자인 : 본문영역 스크롤 금지 - 2025.08.12 by dwlee
				//$('.view-article', $("#dwp_mobile_doc")).on('swiperight', function(e) {
				//	e.stopPropagation();
				//});


				if (_options.isedit) {
					//$(".dwp-header-m div.dwp-page-title", _doc.element.parents(".dwp-mobile-area")).text($fn.getCodeMsg("mail.title.newmail")); //새 메일 작성하기
					$(".dwp-header-m-new div.dwp-page-title", _doc.element.parents(".dwp-mobile-area")).text($fn.getCodeMsg("mail.title.newmail1")); //새 메일 작성하기 //지앤지넷 수정 - 2025.07.01 by dwlee
					
					_$$.mail.doc.org.fn_orgsel("SendTo", _doc); //수신인 검색 자동완성 설정

					_$$.mail.doc.org.fn_orgsel("CopyTo", _doc); //참조인 검색 자동완성 설정

					_$$.mail.doc.org.fn_orgsel("BlindCopyTo", _doc); //비밀참조인 검색 자동완성 설정

					if (_options.inherit != "" && _options.inherit != "copysend") {
						//보낸메일 추가발송 형식이 아닐때만
						_$$.mail.doc.org.setReplySendToSet(_doc); //회신, 전체회신 등으로 신규메일 작성화면이 열리면 기존 수신인을 자동으로 넣어준다.
					}

					if (_options.newtype != "") {
						if (_options.newtype.indexOf("localstorage_") != -1) {
							//개인주소록에서 선택 후 메일작성하면 LocalStorage에 수신인 정보를 설정하고, 메일 작성화면이 열린다
							var storage = _options.newtype.split("_")[1],
								_storage_val = null,
								_storagefull_val = "",
								_arrval = [],
								_nid = "",
								_nidfull = "";
							_storage_val = $dwp.core.util.getLocalStorage(storage);
							_storagefull_val = $dwp.core.util.getLocalStorage(storage + "full");

							if (_storage_val != null) {
								if (_storagefull_val == "" || _storagefull_val == null) {
									$fn.cmdPostEx({
										url: $fn.getProxyUrl(_options.cdb + "/wcmdpost?openform"),
										async: false,
										dataType: "json",
										data: { actiontype: "get_userorginfo", Arg1: _storage_val },
										success: function (data, textStatus) {
											if (data.cnt == "0") {
												_storage_val = "";
												_storagefull_val = "";
												$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg013") });
												return; //해당사용자는 없는 사용자입니다
											}
											if (data.hasOwnProperty("dataid")) {
												_storage_val = data.dataid;
											}
											if (data.hasOwnProperty("datafull")) {
												_storagefull_val = data.datafull;
											}
										}
									});
								}
								if (_storage_val == "") {
									localStorage.removeItem(storage);
									localStorage.removeItem(storage + "full");
									return;
								}
								$("textarea[name=SendTo]").xval(_storage_val);
								$("textarea[name=SendToFull]").xval(_storagefull_val);
							}
							localStorage.removeItem(storage);
							localStorage.removeItem(storage + "full");
						}
					}

					_$$.mail.doc.org.read_show_name(_doc); //SendToFull, CopyToFull 정보들로 화면에 수신, 참조, 비밀참조 리스트를 표시

					_$$.mail.doc.org.selectSendToSet(_doc); //수신인 지정 기능 설정 (Drag & Drop, Ctrl-X & Ctrl-V 등등 기능 설정)

					$(".btn_SendTo", _doc.element)
						.off("click")
						.on("click", function () {
							if ($("input[name=send_me]", _doc.element).is(":checked")) {
								$fn.alert({ msg: $fn.getCodeMsg("mail.msg.alt13") });
								return; //내게쓰기 형식은 추가 수신인을 지정할 수 없습니다
							}
							_opt._org.addtype = "sendto";
							_opt._org.ismobile = true;
							_opt._org["openelement"] = _doc.element;

							//지앤지넷 디자인 변경 - 2025.08.07 by dwlee
							_opt._org.resizable = false;
							_opt._org.draggable = false;

							$dwp.ui.org.mail.init(_doc, _opt._org);
						});
					$(".btn_CopyTo", _doc.element)
						.off("click")
						.on("click", function () {
							_opt._org["openelement"] = _doc.element;
							_opt._org.addtype = "copyto";
							_opt._org.ismobile = true;

							//지앤지넷 디자인 변경 - 2025.08.07 by dwlee
							_opt._org.resizable = false;
							_opt._org.draggable = false;

							$dwp.ui.org.mail.init(_doc, _opt._org);
						});
					$(".btn_BlindCopyTo", _doc.element)
						.off("click")
						.on("click", function () {
							_opt._org["openelement"] = _doc.element;
							_opt._org.addtype = "blindcopyto";
							_opt._org.ismobile = true;

							//지앤지넷 디자인 변경 - 2025.08.07 by dwlee
							_opt._org.resizable = false;
							_opt._org.draggable = false;

							$dwp.ui.org.mail.init(_doc, _opt._org);
						});
					$("input[name=send_me]", _doc.element)
						.off("click")
						.on("click", function () {
							//내게쓰기 체크박스 컨트롤
							_$$.mail.doc.send_me(_doc, this);
						});
					$(".del-all", _doc.element)
						.off("click")
						.on("click", function () {
							//모바일 메일 작성화면 [모두삭제] 버튼
							_$$.mail.doc.org.delNameListItem(_doc);
							if ($("input[name=send_me]", _doc.element).is(":checked")) {
								$("input[name=send_me]", _doc.element).attr("checked", false);
								_$$.mail.doc.send_me(_doc, this);
							}
						});

					//예약일자 오늘 이전 날짜는 선택 불가
					$("input[name=ReserveDate]", _doc.element).datepicker("option", "minDate", $("input[name=ReserveDate]", _doc.element).attr("mindate"));

/*
					$("input[name=ReserveMail]", _doc.element)
						.off("click")
						.on("click", function () {
							if ($(this).xval() == "1") {
								//$(".reservemail-datetime", _doc.element).css({display:"inline"});
								$(".reservemail-datetime", _doc.element).addClass("active");
								if ($("input[name=ReserveDate]", _doc.element).xval() == "") {
									var nDate = new Date();
									$("input[name=ReserveDate]", _doc.element).xval(nDate.format("isoDate"));
								}
							} else {
								//$(".reservemail-datetime", _doc.element).css({display:"none"});
								$(".reservemail-datetime", _doc.element).removeClass("active");
							}
						});

*/

					$("input[name=ReserveMail]", _doc.element)
						.off("click")
						.on("click", function () {

							if ($(this).xval() == "1") {
								//$(".reservemail-datetime", _doc.element).css({display:"inline"});
								$(".reserveoption", _doc.element).removeClass("dwp-none");//지앤지넷 - 2025.07.01 by dwlee
								//alert("통과하니?");
								//$(".reservemail-datetime", _doc.element).addClass("active");
								if ($("input[name=ReserveDate]", _doc.element).xval() == "") {
									var nDate = new Date();
									$("input[name=ReserveDate]", _doc.element).xval(nDate.format("isoDate"));
								}
							} else {
								//alert("안통과하니?");

								$(".reserveoption", _doc.element).addClass("dwp-none"); //지앤지넷 - 2025.07.01 by dwlee
								//$(".reservemail-datetime", _doc.element).css({display:"none"});
								//$(".reservemail-datetime", _doc.element).removeClass("active");
							}
						});


					//지앤지넷 예약취소 - 2025.07.01 by dwlee 
					$(".cancel-reserve-setup",_doc.element)
						.off("click")
						.on("click", function () {
							$("input[name=ReserveMail]", _doc.element).xval("");
							$(".reserveoption", _doc.element).addClass("dwp-none"); //지앤지넷 - 2025.07.01 by dwlee
						});

					//참조 타이틀 영역에 숨은참조 라인 펼치기 아이콘
					$(".btn-more", _doc.element)
						.off("click")
						.on("click", function () {
							$(this).toggleClass("active");
							if ($(this).hasClass("active")) {
								$(".dwp-blindcopyto", _doc.element).removeClass("dwp-hidden");
							} else {
								$(".dwp-blindcopyto", _doc.element).addClass("dwp-hidden");
							}
						});

					//2017.11.27
					$(".dwp-par-section", _doc.element)
						.off("click")
						.on("click", function () {
							$(this).toggleClass("active");
							if ($(this).hasClass("active")) {
								$(".dwp-par-body", _doc.element).removeClass("dwp-hidden");
								$(".dwp-par-section", _doc.element).html('<img src="/tcclibs/images/mail/collapse.gif"><span>' + $fn.getCodeMsg("mail.title.original_doc") + "</span>");
							} else {
								$(".dwp-par-body", _doc.element).addClass("dwp-hidden");
								$(".dwp-par-section", _doc.element).html('<img src="/tcclibs/images/mail/expand.gif"><span>' + $fn.getCodeMsg("mail.title.original_doc") + "</span>");
							}
						});

					//전달이나 회신시 본문을 가져오는 함수 - 2017.11.23 by dwlee
					_me._getParentBody(opt, _doc);

					//$dwp.core.lang.convert({url:"",isedit:true},_doc.element)

					$("input[name=Subject]", _doc.element).attr("placeholder", $fn.getCodeMsg("mail.msg.err13")); //제목을 입력하세요
				} else {

					//지앤지넷 디자인 - 2025.07.01 by dwlee
					$("#attachments", _doc.element).removeClass("dwp-none");

					//By LHJ - 2020-03-20
					//$(".dwp-header-m div.dwp-page-title", _doc.element.parents(".dwp-mobile-area")).text($fn.getCodeMsg("mail.title.detailview"));

					_$$.mail.doc.org.read_show_name(_doc); //조회화면에서 수신,참조,비밀참조 화면에 표시

					if (_options.unreadcountupdate == "1") {
						//미열람 메일을 오픈하면 WebQueryOpen Agent에서 해당 필드값을 "1"값으로 변경함...
						$fn.lnbCountRefresh(); //좌측 메일 카운트 업데이트
						if (_options.ispreview == true) {
							//미리보기 상태일 경우 리스트 목록의 읽지않음 표시를 읽음 상태료 스타일 변경
							_$$.mail.com.viewUnRead(_options.unid, "read");
						}
					}

					var _bodyFld = $("#bodyFld", _doc.element),
						_msgdiv = $(".dwp-body-inner-image", _doc.element);
					if (_options.bodyframe == false) {
						if ($("img", _bodyFld).size() > 0 && _doc.options.hideimg == true) {
							//본문에 이미지 있을 때 알림 메시지 표시
							_msgdiv.show();
							$("button", _msgdiv)
								.off("click")
								.on("click", function () {
									_msgdiv.hide();
								});
							$(".dwp-mobile-imgview", _msgdiv)
								.off("click")
								.on("click", function () {
									_doc.viewImage();
									_msgdiv.hide();
								});
						} else {
							$(".dwp-body-images", _doc.element).hide();
						}
					}

					var _$already = $("#Already_Attach", _doc.element),
						_olist = [];
					_olist = $dwp.core.util.exFileMime(_$already.xval()); // File MIME 제외 처리
					if (_olist.length > 0) {
						$("div.mobile-attach-info", _doc.element).show();
						$("div.mobile-attach-info > .num", _doc.element).text(_olist.length);
					}

					//참조 타이틀 영역에 숨은참조 라인 펼치기 아이콘
					$(".btn-more", _doc.element)
						.off("click")
						.on("click", function () {
							$(this).toggleClass("active");
							if ($(this).hasClass("active")) {
								$(".dwp-sendto", _doc.element).removeClass("dwp-hidden");
								$(".dwp-copyto", _doc.element).removeClass("dwp-hidden");
								$(".dwp-blindcopyto", _doc.element).removeClass("dwp-hidden");
							} else {
								$(".dwp-sendto", _doc.element).addClass("dwp-hidden");
								$(".dwp-copyto", _doc.element).addClass("dwp-hidden");
								$(".dwp-blindcopyto", _doc.element).addClass("dwp-hidden");
							}
						});
					$(".mobile-attach-info", _doc.element)
						.off("click")
						.on("click", function () {

							$("#attachments", _doc.element).removeClass("dwp-none") // 지앤지넷 디자인 - 2025.07.01 by dwlee

							//첨부 아이콘 클릭
							$("#attachments", _doc.element).toggleClass("active");
						});
					$(".icon-isstared", _doc.element)
						.off("click")
						.on("click", function () {
							//별표(중요) 아이콘 클릭
							_$$.mail.doc.star_flag(_doc, $(this));

							//지앤지넷 디자인 - 2025.06.30 by dwlee
							if ($("#dwp_mobile_view").size() > 0) {
								console.log("모바일 보기가 열려 있는 경우");
								var _$item = $("[data-key-unid='" + _doc.options.unid + "']", $("#dwp_mobile_view"));	
								if (_$item.size() > 0) {

									console.log("보기에 현재 문서가 있는 경우");

									if ($(this).hasClass("active")) {
										console.log("현재문서가 중요 해제가 된 경우");
										$(".mark-star",_$item).attr("src", "/tcclibs/images/v2025/m/m-list-item-important-off.svg");
									} else {
										console.log("현재문서가 중요로 지정된 경우");
										$(".mark-star",_$item).attr("src", "/tcclibs/images/v2025/m/m-list-item-important-on.svg")
									}
								}
							}

						});

					_$$.mail.doc.fromAddEvent(_doc);
				}

				//지앤지넷 버튼 추가 - 2025.06.26 by dwlee
				_me._makeBtn(_doc);

				console.log("doc - 16");

				//지앤지넷 버튼 추가 - 2025.06.30 by dwlee
				if (_opt.isedit) {
					console.log("doc - 17");
					_me._makeMoreBtn(_doc);

					console.log("doc- 18");
				}
			},

			//지앤지넷 버튼 추가 - 2025.06.30 by dwlee
			_makeMoreBtn: function(doc) {

				console.log("_makeMoreBtn -1");

				var _$wrap = $(".inner-m", $("#dwp_mobile_doc"));
				if ($(".dwp-doc-mbtns", _$wrap).size() > 0) {
					$(".dwp-doc-mbtns", _$wrap).remove();
				}

			console.log("_makeMoreBtn-2");

				var _$group =  $('<div class="header-btn-group"></div>').appendTo(_$wrap);
				var _$wbtns = $('<div class="header-group dwp-doc-mbtns"></div>').appendTo(_$group);
				var _$a = $('<a><img src="/tcclibs/images/v2025/m/m-header-more.svg" alt=""></a>').appendTo(_$wbtns);

			console.log("_makeMoreBtn - 3");

				var _$qtdialog = null;
				console.log("_makeBtn-qt-0");
				_$a.off("click").on("click", function () {
					if (_$qtdialog == null || $("#dwp-qtdialog-docmbtn_group").size() == 0) {
						console.log("_makeBtn-qt-1");
						_$qtdialog = $dwp.ui.qtdialog.init(_$a, {
							qtid: "docmbtn_group",
							dialogClass: "titleless dropdown-type-dialog",
/*
							by mjkim 20251116 - 너비 조정
*/
							//width: "140px",
							width: "165px",
							position: { my: "right top", at: "right bottom", collision: "flipfit" },
							initcallback: function (_$qtdialog) {
								var i = 0;

								//var _$div = $('<div class="header-btn-pop"></div>').appendTo(_$qtdialog.element);
								var _$ul = $('<ul class="dwp-option-list">').appendTo(_$qtdialog.element);


								var _$li = $('<li><a class="header-btn-item"><img src="/tcclibs/images/v2025/m/m-header-btn-item-send-self.svg" alt=""> '+$fn.getCodeMsg("mail.btn.send_me")+'</a></li>').appendTo(_$ul);
								_$li.off("click").on("click",function() {
									var _$send = $("input[name=send_me]", doc.element);
									_$send.click();
									_$qtdialog.close();
								});

								 _$li = $('<li><a class="header-btn-item"><img src="/tcclibs/images/v2025/m/m-header-btn-item-send-each.svg" alt=""> '+$fn.getCodeMsg("mail.btn.send_each")+'</a></li>').appendTo(_$ul);
								_$li.off("click").on("click",function() {
									var _$indv = $("input[name=individual]", doc.element);
									if (_$indv.xval() == "") {
										_$indv.xval("1")
									} else {
										_$indv.xval("");
									}
									_$qtdialog.close();
								});
								 _$li = $('<li><a class="header-btn-item"><img src="/tcclibs/images/v2025/m/m-header-btn-item-send-eng.svg" alt=""> '+$fn.getCodeMsg("mail.btn.send_eng")+'</a></li>').appendTo(_$ul);	
								_$li.off("click").on("click",function() {
									var _$eng = $("input[name=IsEngName]", doc.element);
									if (_$eng.xval() == "") {
										_$eng.xval("1")
									} else {
										_$eng.xval("");
									}
									_$qtdialog.close();
								});
							 
								 _$li = $('<li><a class="header-btn-item"><img src="/tcclibs/images/v2025/m/m-header-btn-item-send-reserve.svg" alt="">'+$fn.getCodeMsg('mail.btn.send_reserve')+'</a></li>').appendTo(_$ul);
								_$li.off("click").on("click",function() {
									var _$eng = $("input[name=ReserveMail]", doc.element);
									if (_$eng.xval() == "") {
										$(".reserveoption", doc.element).removeClass("dwp-none");
										_$eng.xval("1")
									} else {
										$(".reserveoption", doc.element).addClass("dwp-none");
										_$eng.xval("");
									}
									_$qtdialog.close();
								});
					/*
								by mjkim 20251116 - 폰트 사이즈 조정
					*/
								

								if($dwp.core.lang.getUserLang() != "ko") {
									
									$("a.header-btn-item",_$ul).css("font-size","12px").css("padding","3px 5px");
								} 
							}
						});
					} else {
						if (_$qtdialog.isOpen()) {
							_$qtdialog.close();
						} else {
							_$qtdialog.open();
						}
					}
				});


			},


			//지앤지넷 버튼 추가 - 2025.06.26 by dwlee
			_makeBtn: function(doc) {
				var _el = doc.element;
				var _opt = doc.options;

				//inner-m 안에 추가
				var _$wrap = $(".inner-m", $("#dwp_mobile_doc"));

				if ($(".dwp-doc-btns", _$wrap).size() > 0) {
					$(".dwp-doc-btns", _$wrap).remove();
				}

				var _$wbtns = $('<div class="btn-group-new dwp-doc-btns"></div>').appendTo(_$wrap);
				var _btns = $(".dwp-btn-group",_el).attr("data-btn-list");

				if (_btns.indexOf("allreply") > -1) {
					var _$rbtn = $('<a class="btn-header-txt btn-header-txt-gray"><span>' + $fn.getCodeMsg("mail.btn.allreply") + '</span></a>').appendTo(_$wbtns);
					//var _$rbtn = $('<a class="doc-allreply"><img src="/tcclibs/images/v2025/m/m-header-write.svg" alt=""></a>').appendTo(_$wrap);
					_$rbtn.off("click").on("click", function() {
						if ($("input[name=Already_Attach]", _el).xval() != "") {
							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm22") })
								.done(function () {
									//첨부파일을 포함하여 [전체회신] 하시겠습니까?
									_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "1", ismobile: true });
								})
								.fail(function () {
									_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "0", ismobile: true });
								});
						} else {
							_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "0", ismobile: true });
						}
					});		
				}	

				if (_btns.indexOf("forward") > -1) {
					var _$rbtn = $('<a class="btn-header-txt btn-header-txt-navy"><span>' + $fn.getCodeMsg("mail.btn.forward") + '</span></a>').appendTo(_$wbtns);
					//var _$rbtn = $('<a class="doc-forward"><img src="/tcclibs/images/v2025/m/m-header-write.svg" alt=""></a>').appendTo(_$wrap);
					_$rbtn.off("click").on("click", function() {
						if ($("input[name=Already_Attach]", _el).xval() != "") {
							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm23") })
								.done(function () {
									//첨부파일을 포함하여 [전달] 하시겠습니까?
									_$$.mail.doc.replyforward(doc, { type: "forward", body: "1", attach: "1", ismobile: true });
								})
								.fail(function () {
									_$$.mail.doc.replyforward(doc, { type: "forward", body: "1", attach: "0", ismobile: true });
								});
						} else {
							_$$.mail.doc.replyforward(doc, { type: "forward", body: "1", attach: "0", ismobile: true });
						}
					});		
				}	
				
				if (_btns.indexOf("deldoc") > -1) {
					var _$rbtn = $('<a class="btn-header-txt btn-header-txt-red"><span>' + $fn.getCodeMsg("mail.btn.deldoc") + '</span></a>').appendTo(_$wbtns);
					//var _$rbtn = $('<a class="doc-delete"><img src="/tcclibs/images/v2025/m/m-header-write.svg" alt=""></a>').appendTo(_$wrap);
					_$rbtn.off("click").on("click", function() {
						doc.deleteDocument({ viewreload: true });
					});		
				}	

				if (_btns.indexOf("send") > -1) {
					var _$rbtn = $('<a class="btn-header-txt btn-header-txt-navy"><span>' + $fn.getCodeMsg("mail.btn.send") + '</span></a>').appendTo(_$wbtns);
					//var _$rbtn = $('<a class="doc-send"><img src="/tcclibs/images/v2025/m/m-header-write.svg" alt=""></a>').appendTo(_$wrap);
					_$rbtn.off("click").on("click", function() {
						_$$.mail.doc.mailsend(doc);
					});		
				}
			},

			//서명 및 회신(전달)의 본문을 처리하는 함수 - 2017.11.23 by dwlee
                                    //WKWebView 보완 처리 - 2024.10.16 by dwlee
			_getParentBody: function (opt, doc) {

				//2025.10.16 by dwlee
				var _me = this;


				var _opt = opt,
					_el = el;
				var _mailpath = $fn.getPath("mail");

				var rtn = "";

				//모바일 그룹웨어에서 메일 발송시 문구 삽입 - 2017.11.30 by dwlee
				//LineFeed  2줄 추가 - 2017.12.18 by dwlee
				rtn += '<p style="font-size:10pt;">&nbsp;</p><p style="font-size:10pt;">&nbsp;</p><p style="font-size:10pt;font-weight:bold">This message was sent from mobile device.</p><p style="font-size:10pt;">&nbsp;</p>';

				//사용자 사인 가져오는 함수
				function getSign() {
					//모바일 서명오류 보완 - 2025.10.16 by dwlee
					var _signurl = "";
					if (_opt.signaturetype == "1" && _opt.usersignatureunid != "") {
						_signurl = _mailpath + "/0/" + _opt.usersignatureunid + "/Body?OpenField";
					} else {
						_signurl = _mailpath + "/($Profiles)/wFrmProfile/Signature" + _opt.signaturetype + "?OpenField";
					}		
					if (_signurl != "") {
						//서명 사용하는 경우
						$dwp.core.util.xAjax({
//									url: $fn.getProxyUrl(_mailpath + "/($Profiles)/wFrmProfile/Body?OpenField"),
							url: $fn.getProxyUrl(_signurl),
							dataType: "html",
							async: false,
							cache: false
						}).done(function (data) {
							//rtn += data;
							var regExp = /<body[^>]*?>([\s\S]*?)<\/body>/gi; //Body Tag innerHTML
							if (regExp.test(data)) {
								rtn += RegExp.$1 + '<p style="font-size:9pt;">&nbsp;</p>';
								if (_opt.parentunid != "" && _opt.inherit != "copysend" && _opt.copybody == "1") {
									getSendInfo();
								} else {
									if (_opt.copybody == "1" && _opt.parentunid != "") {
										getParBody();	
									} else {
										setBody();
									}
								}
							} else {

								data = data.replace(/<br>/gi,"");

								data = data.replace(/\&lt;/gi,"<");
								data = data.replace(/\&gt;/gi,">");
								data = data.replace(/\&quot;/gi,'"');								
								rtn += data + '<p style="font-size:9pt;">&nbsp;</p>'; //Body 테그를 못찾으면 그냥 그대로 사용
								if (_opt.parentunid != "" && _opt.inherit != "copysend" && _opt.copybody == "1") {
									getSendInfo();
								} else {
									if (_opt.copybody == "1" && _opt.parentunid != "") {
										getParBody();				
									} else {
										setBody();
									}
								}
							}
						}).fail(function () { });
					}
				}

				function getSendInfo() {
					//var curdoc = $fn.getInstance("doc", $fn.getContent()).element.doc("instance");
					//SH Global은 가로선을 구분자로 요구해서 변경 - 2017.11.23 by dwlee
					rtn += "<hr>";
					rtn += _$$.mail.com.getSenderInfo(doc); //본문에 들어갈 받은메일 헤더정보 추출

					if (_opt.copybody == "1" && _opt.parentunid != "") {
						getParBody();
					} else {
						setBody();
					}
				}

				function getParBody() {
					$dwp.core.util
					.xAjax({
						url: $fn.getProxyUrl(_mailpath + "/0/" + _opt.parentunid + "/Body?OpenField"), //원본 메일의 본문 가져오기
						dataType: "html",
						async: false,
						cache: false
					})
					.done(function (data) {
						//rtn += data;
						rtn += data.replace(/<base href[^>]*>/, ""); //메일 원본의 base 테그를 삭제
						setBody();
					})
					.fail(function () { });					
				}

				function setBody() {
					if ($("#par_body", doc.element).size() == 1) {
						$("#par_body", doc.element).html(rtn);
	
						//첨부파일 테이블 삭제처리
						$dwp.ui.weditor._deleteAtt($("#par_body", doc.element));
	
						var _xmdn = $("img[name=XMDN][src]", $("#par_body", doc.element));
						if (_xmdn.size() > 0) {
							if (_xmdn.attr("src").indexOf("http://mdn.tccins.co.kr") > -1) {
								_xmdn.remove();
							}
						}
					}
				}

				if (_opt.isnew == true) {
					if (_opt.inherit != "copysend" && _opt.enablesignature == "1") {
						getSign();
					} else {
						if (_opt.parentunid != "" && _opt.inherit != "copysend" && _opt.copybody == "1") {
							getSendInfo();
						} else {
							if (_opt.copybody == "1" && _opt.parentunid != "") {
								getParBody();
							} else {
								setBody();
							}
						}
					}
				}		

			},
			
			//서명 및 회신(전달)의 본문을 처리하는 함수 - 2017.11.23 by dwlee
			_getParentBody_Org: function (opt, doc) {
				var _opt = opt,
					_el = el;
				var _mailpath = $fn.getPath("mail");

				var rtn = "";

				//모바일 그룹웨어에서 메일 발송시 문구 삽입 - 2017.11.30 by dwlee
				//LineFeed  2줄 추가 - 2017.12.18 by dwlee
				rtn += '<p style="font-size:10pt;">&nbsp;</p><p style="font-size:10pt;">&nbsp;</p><p style="font-size:10pt;font-weight:bold">This message was sent from mobile device.</p><p style="font-size:10pt;">&nbsp;</p>';

				if (_opt.isnew == true) {
					if (_opt.inherit != "copysend") {
						if (_opt.enablesignature == "1") {
							//서명 사용하는 경우
							$dwp.core.util
								.xAjax({
									url: $fn.getProxyUrl(_mailpath + "/($Profiles)/wFrmProfile/Body?OpenField"),
									dataType: "html",
									async: false,
									cache: false
								})
								.done(function (data) {
									//rtn += data;
									var regExp = /<body[^>]*?>([\s\S]*?)<\/body>/gi; //Body Tag innerHTML
									if (regExp.test(data)) {
										rtn += RegExp.$1 + '<p style="font-size:9pt;">&nbsp;</p>';
									} else {
										rtn += data + '<p style="font-size:9pt;">&nbsp;</p>'; //Body 테그를 못찾으면 그냥 그대로 사용
									}
								})
								.fail(function () { });
						}
					}
					if (_opt.parentunid != "") {
						if (_opt.inherit != "copysend" && _opt.copybody == "1") {
							//var curdoc = $fn.getInstance("doc", $fn.getContent()).element.doc("instance");
							//SH Global은 가로선을 구분자로 요구해서 변경 - 2017.11.23 by dwlee
							rtn += "<hr>";
							rtn += _$$.mail.com.getSenderInfo(doc); //본문에 들어갈 받은메일 헤더정보 추출
						}
					}
					if (_opt.copybody == "1") {
						if (_opt.parentunid != "") {
							//멀티전달 관련 작업할 부분 - 2020.04.14 by dwlee
							_opt.forwardkeys = _opt.forwardkeys || "";
							if (_opt.forwardkeys != "") {
								var _idarray = _opt.forwardkeys.split(";");
								$.each(_idarray, function (i, docid) {
									//헤더정보 찾아오기..... 첫번째는 기본으로 가져오므로 두번째 부터 가져오기
									if (i > 0) {
										rtn += _$$.mail.com.getSenderInfo_multi(docid); //메일 원본의 base 테그를 삭제
									}

									$dwp.core.util
										.xAjax({
											url: $fn.getProxyUrl(_mailpath + "/0/" + docid + "/Body?OpenField"), //원본 메일의 본문 가져오기
											dataType: "html",
											async: false,
											cache: false
										})
										.done(function (data) {
											//rtn += data;
											rtn += data.replace(/<base href[^>]*>/, ""); //메일 원본의 base 테그를 삭제
										})
										.fail(function () { });
								});
							} else {
								$dwp.core.util
									.xAjax({
										url: $fn.getProxyUrl(_mailpath + "/0/" + _opt.parentunid + "/Body?OpenField"), //원본 메일의 본문 가져오기
										dataType: "html",
										async: false,
										cache: false
									})
									.done(function (data) {
										//rtn += data;
										rtn += data.replace(/<base href[^>]*>/, ""); //메일 원본의 base 테그를 삭제
									})
									.fail(function () { });
							}
						}
					}
				}

				if ($("#par_body", doc.element).size() == 1) {
					$("#par_body", doc.element).html(rtn);

					//첨부파일 테이블 삭제처리
					$dwp.ui.weditor._deleteAtt($("#par_body", doc.element));

					var _xmdn = $("img[name=XMDN][src]", $("#par_body", doc.element));
					if (_xmdn.size() > 0) {
						if (_xmdn.attr("src").indexOf("http://mdn.tccins.co.kr") > -1) {
							_xmdn.remove();
						}
					}
				}
			},

			_initOptions: function (opt) {
				var _me = this,
					_topt = $dwp.app.mail.doc.getOptions(opt);

				_topt.button = [];
				_topt.button["send"] = {
					title: $fn.getCodeMsg("mail.btn.send"),
					/*발송*/
					click: function (doc) {
						_$$.mail.doc.mailsend(doc);
					},
					icon: $fn.getPath("weblib") + "/images/common-m/icon-send.svg"
				};
				_topt.button["draft"] = {
					title: $fn.getCodeMsg("mail.btn.savedoc"),
					/*임시저장*/
					click: function (doc) {
						_$$.mail.doc.mailsave(doc);
					},
					icon: $fn.getPath("weblib") + "/images/common-m/icon-storage-w.svg"
				};
				_topt.button["allreply"] = {
					title: $fn.getCodeMsg("mail.btn.allreply"),
					/*전체회신*/
					click: function (doc) {
						if ($("input[name=Already_Attach]", doc.element).xval() != "") {
							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm22") })
								.done(function () {
									//첨부파일을 포함하여 [전체회신] 하시겠습니까?
									_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "1", ismobile: true });
								})
								.fail(function () {
									_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "0", ismobile: true });
								});
						} else {
							_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "0", ismobile: true });
						}
					},
					icon: $fn.getPath("weblib") + "/images/common-m/icon-pop-call-base.svg"
				};
				_topt.button["forward"] = {
					title: $fn.getCodeMsg("mail.btn.forward"),
					/*전달*/
					click: function (doc) {
						if ($("input[name=Already_Attach]", doc.element).xval() != "") {
							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm23") })
								.done(function () {
									//첨부파일을 포함하여 [전달] 하시겠습니까?
									_$$.mail.doc.replyforward(doc, { type: "forward", body: "1", attach: "1", ismobile: true });
								})
								.fail(function () {
									_$$.mail.doc.replyforward(doc, { type: "forward", body: "1", attach: "0", ismobile: true });
								});
						} else {
							_$$.mail.doc.replyforward(doc, { type: "forward", body: "1", attach: "0", ismobile: true });
						}
					},
					icon: $fn.getPath("weblib") + "/images/common/icon-return-comp.svg" //common-m/icon-pop-call.svg
				};
				_topt.button["deldoc"] = {
					title: $fn.getCodeMsg("mail.btn.deldoc"),
					/*삭제*/
					click: function (doc) {
						doc.deleteDocument({ viewreload: true });
					},
					icon: $fn.getPath("weblib") + "/images/common/icon-remove.svg"
				};

				_topt.button["reply"] = {
					title: $fn.getCodeMsg("mail.btn.reply"),
					/*회신*/
					click: function (doc) {
						if ($("input[name=Already_Attach]", doc.element).xval() != "") {
							$fn.confirm({ msg: $fn.getCodeMsg("mail.msg.confirm21") })
								.done(function () {
									//첨부파일을 포함하여 [회신] 하시겠습니까?
									_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "1", ismobile: true });
								})
								.fail(function () {
									_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "0", ismobile: true });
								});
						} else {
							_$$.mail.doc.replyforward(doc, { type: "allreply", body: "1", attach: "0", ismobile: true });
						}
					}
				};
				_topt.button["movefolder"] = {
					title: $fn.getCodeMsg("mail.btn.movetofolder"),
					/*영구보관*/
					click: function (doc) {
						_$$.mail.doc.doc_movetofolder(doc, { ismobile: true });
					}
				};
				_topt.button["mailcreate"] = {
					title: $fn.getCodeMsg("mail.btn.mailcreate"),
					/*메일쓰기*/
					click: function (doc) {
						_$$.mail.com.newMail();
					}
				};
				_topt.button["copysend"] = {
					title: $fn.getCodeMsg("mail.btn.copysend"),
					/*추가발송*/
					click: function (doc) {
						_$$.mail.doc.replyforward(doc, { type: "copysend", body: "1", attach: "1", ismobile: true });
					}
				};
				_topt.button["spam"] = {
					title: $fn.getCodeMsg("mail.btn.spamregistration"),
					/*스팸등록*/
					click: function (doc) {
						_$$.mail.doc.doc_spam_rule(doc, { ismobile: true });
					}
				};
				_topt.button["pdeldoc"] = {
					title: $fn.getCodeMsg("mail.btn.pdeldoc"),
					/*영구삭제*/
					click: function (doc) {
						var __opt = { softdel: false, viewreload: true, confirm: $fn.getCodeMsg("mail.msg.confirm05") };
						doc.deleteDocument(__opt);
					}
				};

				_topt.button["returnreceipt"] = {
					title: $fn.getCodeMsg("mail.btn.returnreceipt"),
					/*수신확인*/
					click: function (doc) {
						_$$.mail.doc.doc_returnreceipt(doc, { ismobile: true });
					}
				};
				_topt.button["mailrecall"] = {
					title: $fn.getCodeMsg("mail.btn.mailrecall"),
					/*회수*/
					click: function (doc) {
						_$$.mail.doc.doc_mailrecall(doc);
					}
				};
				/*
								20230419 mjkim
								환경설정에서 연결보기 사용 선택 시 작동

				*/

				if (opt.conview == "1") {
					_topt.button["connection"] = {
						title: $fn.getCodeMsg("mail.title.mailthreads"),
						/*메일연결보기*/
						click: function (doc) {
							$dwp.app.mail.com.goConnection(doc, "doc", { ismobile: true });
						}
					};
				}

				return _topt;
			}
		}
	};
})($dwp.cns("app"), jQuery);










