
/**
 * 표준게시판 JS
 */
(function (_$$, $) {
	_$$.sbrd01 = {
		doc: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			}
			/**
			 * 게시작성 초기화
			 * @namespace	{Object}
			 * @name	$dwp.sbrd01.init
			 */
			, init: function (opt, el) {
				var _me = this, _zregcode
					, _opt = _me._initOptions(opt);

				var _doc = $fn.doc(_opt, el);

				$fn.orgsel($("[name='org0']", _doc.element)
					, { isedit: _opt.isedit, treetype: "0", seltype: "0", fld: "BoardNotifiers", count: 100 });

				$fn.orgsel($("[name='org1']", _doc.element)
					, { isedit: _opt.isedit, treetype: "0", seltype: "0", fld: "BoardDocReaders", count: 100 });

				$fn.orgsel($("[name='org2']", _doc.element)
					, { isedit: _opt.isedit, treetype: "0", seltype: "2", fld: "tAuthor", count: 1 });

				$fn.orgsel($("[name='org2']", _doc.element)
					, { isedit: _opt.isedit, treetype: "0", seltype: "2", fld: "userID", count: 1 });

				$fn.orgsel($("[name='org_dept']", _doc.element)
					, { type: "single", isedit: _opt.isedit, treetype: "1", seltype: "1", fld: "deptcode", count: 1, title: "부서선택" });
				//$dwp.ui.datepicker(_doc,{},[{start:"FromDate",end:"ToDate"}]);

				$("div[name='_dept_btn']", _doc.element).off("click").on("click", function () {

					$dwp.ui.org.orgsselect.init($(this), {
						treetype: "1", seltype: "1", comcode: 'H0000', selcallback: function (o) {
							//console.log("org", o);
							var _orginfo = $dwp.core.getDeptInfo(o.oinfo.orgcode);
							if (_orginfo.hasOwnProperty("@unid")) {
								$("input[name=Category]", _doc.element).val(_orginfo.OrgName);
								$("input[name=CategoryCode]", _doc.element).val(_orginfo.ROrgCode);
							}
						}
					});
				});

				var _fromDate, _toDate;
				var _termCategory, _measure, _amount;


				if (_opt.isedit) {
					//지역이 hq인 경우에만 common group 표시
					//_zregcode = $fn.getZRegCode($fn.getCurUser().zregcode);
					//if( _zregcode !== "hq" ){
					//	$("[data-xlang-name='CommonGroups']", _doc.element).remove();
					//}
					
						
					
					_termCategory = $("select[name='TermCategory']", _doc.element).val();
					
					//경조사 기타 공지사항은 게시기한 직접입력으로 세팅
					if($("[name='_bname']", _doc.element).val() == "ko:경조사" || $("[name='_bname']", _doc.element).val() == "ko:기타"){
						$("select[name='TermCategory']", _doc.element).val("input")
						_termCategory ="input"
					}		
					if (_termCategory === "0") {

						$(".dwp-date-form", _doc.element).find(".dwp-calendar-form").hide();


					}
					else if (_termCategory === "input") {
						$("input[name='FromDate']").prop("readonly", false);
						$("input[name='ToDate']").prop("readonly", false);

						$(".dwp-date-form", _doc.element).find(".dwp-input .ui-datepicker-trigger").show();
						$(".dwp-date-form", _doc.element).find(".dwp-calendar-form").show();
					}
					else {

						$("input[name='FromDate']").prop("readonly", true);
						$("input[name='ToDate']").prop("readonly", true);

						$(".dwp-date-form", _doc.element).find(".dwp-input .ui-datepicker-trigger").hide();
						$(".dwp-date-form", _doc.element).find(".dwp-calendar-form").show();
					}

				} else {
					/************mjkim 20190709 사용자정보 이미지 아이콘이 뭉게지는 증상 수정**********************************/
					$(".onlyname", _doc.element).children("img").css("height", "18px")

				}
			
				

			

				$("select[name='TermCategory']", _doc.element).bind("change", function (o) {
					_fromDate = new Date($("input[name='FromDate']", _doc.element).xval());
					console.log("_fromDate::", _fromDate);
					_toDate = new Date(_fromDate.format("yyyy-mm-dd"));
					console.log("_toDate::", _toDate);
					_termCategory = $(this).val();
					if (_termCategory === "0") {
						_toDate.adjust(100, 0, 0, 0, 0, 0);
						console.log("_toDate::", _toDate);
						$("input[name='ToDate']").xval(_toDate.format("yyyy-mm-dd"));

						$(".dwp-date-form", _doc.element).find(".dwp-calendar-form").hide();
					}
					else if (_termCategory === "input") {
						//_toDate.adjust(0, 0, 1, 0, 0, 0);
						$("input[name='FromDate']").prop("readonly", false);
						$("input[name='ToDate']").prop("readonly", false)
							.xval(_toDate.format("yyyy-mm-dd"));

						$(".dwp-input .ui-datepicker-trigger").show();
						$(".dwp-calendar-form").show();
					}
					else {
						_measure = _termCategory.substring(0, 1);
						_amount = parseInt(_termCategory.split("_")[1], 10);
						if (_measure === "W") {
							_amount = _amount * 7;
							_toDate.adjust(0, 0, _amount, 0, 0, 0);
						}
						else if (_measure === "M") {
							_toDate.adjust(0, _amount, 0, 0, 0, 0);
						}
						else if (_measure === "Y") {
							_toDate.adjust(_amount, 0, 0, 0, 0, 0);
						}
						else {
							return;
						}
						console.log("_toDate::", _toDate);
						$("input[name='FromDate']").prop("readonly", true);
						$("input[name='ToDate']").prop("readonly", true).xval(_toDate.format("yyyy-mm-dd"));
						$("input[name='ToDate']").xval(_toDate.format("yyyy-mm-dd"));

						$("input[name='FromDate']").attr("max", _toDate.format("yyyy-mm-dd"));
						$("input[name='ToDate']").xval(_toDate.format("yyyy-mm-dd"));

						$(".dwp-date-form", _doc.element).find(".dwp-input .ui-datepicker-trigger").hide();
						$(".dwp-calendar-form").show();
					}
				});

			

				$("input[name='Taggings']").closest(".dwp-value").find("[name='qsearch']").attr("placeholder", $fn.getCodeMsg("sbrd01.msg.tagplaceholder"));
				$(".tag-list .tag-item > span").each(function (idx, o) {
					$(this).bind("click", function (o) {
						//console.log("this.html:", $(this).html());
						var _tag = $(this).text().substring(1);
						var _buttons = [
							{
								"title": $fn.getCodeMsg("sbrd01.btn.confirm"),
								"click": function (obj) {
									obj.close();
								}
							}];
						$fn.dialog(el, {
							modal: true,
							resizable: false,
							draggable: true,
							title: _tag,
							width: 800,
							height: 600,
							show: 'fade',			//effect
							hide: 'fade',			//effect
							//autoOpen: false,		//.dialog("open")호출시만 열림
							buttons: _buttons,
							content: { url: _opt.cdb + "/wFrmView_tag?ReadForm", data: { "view": "wvhashtag", "single": _tag } }
						});
					});
				});

				var PList = ["_clerk", "_link"];
				$.each(PList, function (_i, _data) {
					_$$.sbrd01._etc_Proc[_data](_doc);
				})

				_me.changeCategory(_doc, _opt); //문서의 분류 변경

				if (_opt.isedit == false) {

					if (_opt.isdispauthor == false) {
						$(".comment-list", _doc.element).find(".dwp-user").remove();
					}
				}

				if (_opt.param.lnbid == "W3198", _opt.param.boardid == "bbs0007") {
					var _$table = _me.initInputTable(_opt, _doc, "");
					var _$table_c = _me.initInputTable2(_opt, _doc, "c");
					var _$table_n = _me.initInputTable2(_opt, _doc, "n");
					//var _newopt = $.extend(_opt, { dtable: _$table });
					//_doc.options = _newopt;
					$("#c_month_td", $fn.getContent()).attr("rowspan", $("tbody > tr", $fn.getContent()).length);
					$("#n_month_td", $fn.getContent()).attr("rowspan", $("tbody > tr", $fn.getContent()).length);
				}

				$("div.dwp-breadcrumbs", $fn.getContent()).off("click").on("click", function () {		//오른쪽 상단 메뉴 경로 클릭시 화면 새로고침... 개발용
					$fn.loadPage({ link: $fn.getInstance("doc").options.pathinfo, linktype: "PAGE" })
				});
			}

			, initInputTable: function (_opt, $doc) {
				var _me = this, _tableVal = $("input[name=fld_formdata]", $doc.element).val(), tbl = null, _imoney = null, _cmoney = null;
				tbl = $("table[name='current_month']", $doc.element);
				$("thead input", tbl).off("keyup").on("keyup", function () {	//상단 유지보수 관련 기본 필드에 이벤트 추가하기
					_imoney = _me.numericCheck($(this).xval().replace(/,/g, ""), 5);
					_imoney = parseFloat(_imoney == "" ? "0" : _imoney).toString();
					$(this).xval(_imoney.toComma());
					_me.cal_sum($(this));
				});

				var _$table = $dwp.ui.table.init(tbl, {
					isedit: _opt.isedit,
					initdata: _tableVal,
					template: "[name=_template]",
					cell: [
						{
							nm: "_company", type: "custom", css: "dwp-left", vfnm: "company", label: "업체",
							drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$input = $("input[name='company']", $cell);
									_$input.xval(val);
								} else {
									$cell.html("<div class='dwp-left'>&nbsp;" + val + "</div>");
								}
							}
						},
						{
							nm: "_sales", type: "custom", vfnm: "sales", css: "dwp-right", label: "매출금액",
							drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$input = $("input[name='sales']", $cell);
									_$input.xval(val);
									_$input.off("keyup").on("keyup", function () {
										_imoney = _me.numericCheck($(this).xval().replace(/,/g, ""), 5);
										_imoney = parseFloat(_imoney == "" ? "0" : _imoney).toString();
										$(this).xval(_imoney.toComma());
										_me.cal_sum($(this));
									});
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "_purchase", type: "custom", css: "dwp-right", vfnm: "purchase", label: "매입금액",
							drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$input = $("input[name='purchase']", $cell);
									_$input.xval(val);
									_$input.off("keyup").on("keyup", function () {
										_imoney = _me.numericCheck($(this).xval().replace(/,/g, ""), 5);
										_imoney = parseFloat(_imoney == "" ? "0" : _imoney).toString();
										$(this).xval(_imoney.toComma());
										_me.cal_sum($(this));
									});
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "_gp", type: "custom", css: "dwp-right", vfnm: "gp", validator: /[^\s]/, label: "GP",
							drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$input = $("input[name='gp']", $cell);
									_$input.xval(val);
									_$input.off("keyup").on("keyup", function () {
										_imoney = _me.numericCheck($(this).xval().replace(/,/g, ""), 5);
										_imoney = parseFloat(_imoney == "" ? "0" : _imoney).toString();
										$(this).xval(_imoney.toComma());
										_me.cal_sum($(this));
									});
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						}
					]
				});
				if (_opt.isnew) {	//신규 작성이면 일단 3줄 추가
					_$table.add();
					_$table.add();
					_$table.add();
				}
				$("#addTr", $doc.element).off("click").on("click", function () {		//업체(라인) 추가
					$("table[name=current_month]", $fn.getContent()).xtable("instance").add()
				})
				$("#delTr", $doc.element).off("click").on("click", function () {		//업체(라인) 삭제
					var tbl = $("table[name=current_month]", $fn.getContent()), trs = $("tbody > tr", tbl);
					if (trs.length == 1) { alert("삭제할 데이터가 없습니다."); return; }
					$(trs[trs.length - 1]).remove();
					_me.cal_sum("sales");		//매출금액 합계 계산
					_me.cal_sum("purchase");	//매입금액 합계 계산
					_me.cal_sum("gp");			//GP 합계 계산
				})
				return _$table;
			}

			, initInputTable2: function (_opt, $doc, flag) {
				var _me = this, _tableVal = $("input[name='fld_formdata_" + flag + "']", $doc.element).val(), tbl = null, _imoney = null, _cmoney = null;
				tbl = $("table[name='current_month_" + flag + "']", $doc.element);
				$("#default_tr .dwp-right input", tbl).off("keyup").on("keyup", function () {	//기본 필드에 이벤트 추가하기
					_imoney = _me.numericCheck($(this).xval().replace(/,/g, ""), 5);
					_imoney = parseFloat(_imoney == "" ? "0" : _imoney).toString();
					$(this).xval(_imoney.toComma());
					_me.cal_sum2($(this), flag);
				});

				var _$table = $dwp.ui.table.init(tbl, {
					isedit: _opt.isedit,
					initdata: _tableVal,
					template: "[name=_template_" + flag + "]",
					cell: [
						{
							nm: "_" + flag + "_company", type: "custom", css: "dwp-left", vfnm: flag + "_company", label: "업체",
							drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$input = $("input[name='" + flag + "_company']", $cell);
									_$input.xval(val);
								} else {
									$cell.html("<div class='dwp-left'>&nbsp;" + val + "</div>");
								}
							}
						},
						{
							nm: "_" + flag + "_sales", type: "custom", vfnm: flag + "_sales", css: "dwp-right", label: "매출금액",
							drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$input = $("input[name='" + flag + "_sales']", $cell);
									_$input.xval(val);
									_$input.off("keyup").on("keyup", function () {
										_imoney = _me.numericCheck($(this).xval().replace(/,/g, ""), 5);
										_imoney = parseFloat(_imoney == "" ? "0" : _imoney).toString();
										$(this).xval(_imoney.toComma());
										_me.cal_sum2($(this), flag);
									});
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "_" + flag + "_purchase", type: "custom", css: "dwp-right", vfnm: flag + "_purchase", label: "매입금액",
							drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$input = $("input[name='" + flag + "_purchase']", $cell);
									_$input.xval(val);
									_$input.off("keyup").on("keyup", function () {
										_imoney = _me.numericCheck($(this).xval().replace(/,/g, ""), 5);
										_imoney = parseFloat(_imoney == "" ? "0" : _imoney).toString();
										$(this).xval(_imoney.toComma());
										_me.cal_sum2($(this), flag);
									});
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "_" + flag + "_gp", type: "custom", css: "dwp-right", vfnm: flag + "_gp", validator: /[^\s]/, label: "GP",
							drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$input = $("input[name='" + flag + "_gp']", $cell);
									_$input.xval(val);
									_$input.off("keyup").on("keyup", function () {
										_imoney = _me.numericCheck($(this).xval().replace(/,/g, ""), 5);
										_imoney = parseFloat(_imoney == "" ? "0" : _imoney).toString();
										$(this).xval(_imoney.toComma());
										_me.cal_sum2($(this), flag);
									});
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						}
					]
				});
				if (_opt.isnew) {	//신규 작성이면 일단 2줄 추가
					_$table.add();
					_$table.add();
				} else {
				}
				$("#addTr_" + flag, $doc.element).off("click").on("click", function () {		//업체(라인) 추가
					//var tbl = $("table[name=current_month_"+flag+"]", $fn.getContent());
					tbl.xtable("instance").add();
					$("#" + flag + "_month_td", tbl).attr("rowspan", $("tbody > tr", tbl).length);
				});
				$("#delTr_" + flag, $doc.element).off("click").on("click", function () {		//업체(라인) 삭제
					//var tbl = $("table[name=current_month_"+flag+"]", $fn.getContent()),
					var trs = $("tbody > tr", tbl);
					if (trs.length == 2) { alert("더이상 삭제할 수 없습니다."); return; }
					$(trs[trs.length - 1]).remove();
					$("#" + flag + "_month_td", tbl).attr("rowspan", $("tbody > tr", tbl).length);
					_me.cal_sum2(flag + "_sales", flag);		//매출금액 합계 계산
					_me.cal_sum2(flag + "_purchase", flag);	//매입금액 합계 계산
					_me.cal_sum2(flag + "_gp", flag);			//GP 합계 계산
				});
				return _$table;
			}


			, cal_sum: function (el, type) {
				var _me = this, fldnm = "", fld = null, total = 0, tmp = "", content = $fn.getContent(), tr = $(el).closest("tr"), calc = [];
				calc = [{ "fld": "sales", "val": 0 }, { "fld": "purchase", "val": 0 }, { "fld": "gp", "val": 0 }];
				fldnm = (typeof (el) == "object" ? $(el).attr("fld") : el);
				fld = $("input[fld='" + fldnm + "']", content);

				$.each(fld, function (ii, input) {
					tmp = $(input).xval().replace(/,/g, "");
					if ($.isNumeric(tmp) == true) {
						total += parseFloat(tmp);
					}
				});
				tmp = parseFloat(total) + "";
				$("input[name='" + fldnm + "_total']", content).xval(tmp.toComma());
				if (type == true) return;
				calc[0].val = parseFloat("0" + $("input[fld='" + calc[0].fld + "']", tr).xval().replace(/,/g, ""));
				calc[1].val = parseFloat("0" + $("input[fld='" + calc[1].fld + "']", tr).xval().replace(/,/g, ""));
				$("input[fld='" + calc[2].fld + "']", tr).xval((calc[0].val - calc[1].val).toString().toComma());
				_me.cal_sum($("input[fld='" + calc[2].fld + "']", tr), true);
			}

			, cal_sum2: function (el, flag, type) {
				var _me = this, fldnm = "", fld = null, total = 0, tmp = "", content = $fn.getContent(), tr = $(el).closest("tr"), calc = [];
				//calc = [{ "fld": "c_sales", "val": 0 }, { "fld": "c_purchase", "val": 0 }, { "fld": "c_gp", "val": 0 }];
				calc = [{ "fld": "sales", "val": 0 }, { "fld": "purchase", "val": 0 }, { "fld": "gp", "val": 0 }];
				fldnm = (typeof (el) == "object" ? $(el).attr("fld") : el);
				fld = $("input[fld='" + fldnm + "']", content);
				$.each(fld, function (ii, input) {
					tmp = $(input).xval().replace(/,/g, "");
					if ($.isNumeric(tmp) == true) {
						total += parseFloat(tmp);
					}
				});
				tmp = parseFloat(total) + "";
				$("input[name='" + fldnm + "_subtotal']", content).xval(tmp.toComma());
				//debugger;
				var tmpc = parseFloat("0" + $("input[name='c_" + fldnm.split("_")[1] + "_subtotal']", content).xval().replace(/,/g, ""));
				var tmpn = parseFloat("0" + $("input[name='n_" + fldnm.split("_")[1] + "_subtotal']", content).xval().replace(/,/g, ""));
				$("input[name='t_" + fldnm.split("_")[1] + "_total']", content).xval((tmpc + tmpn).toString().toComma());

				if (type == true) return;
				calc[0].val = parseFloat("0" + $("input[fld='" + fldnm.split("_")[0] + "_" + calc[0].fld + "']", tr).xval().replace(/,/g, ""));
				calc[1].val = parseFloat("0" + $("input[fld='" + fldnm.split("_")[0] + "_" + calc[1].fld + "']", tr).xval().replace(/,/g, ""));
				$("input[fld='" + fldnm.split("_")[0] + "_" + calc[2].fld + "']", tr).xval((calc[0].val - calc[1].val).toString().toComma());
				_me.cal_sum2($("input[fld='" + fldnm.split("_")[0] + "_" + calc[2].fld + "']", tr), flag, true);

			}

			, numericCheck: function (arg1, arg2) {
				var tmp = arg1;
				tmp = tmp.replace(/,/gi, "");
				var absTmp = Math.abs(tmp);
				if (tmp.length == 1 && tmp == "") {
					Re = true;
				} else if (arg2 == 0) {        //소숫점 허용하지 않음
					var reDigit = /[^0-9]/;
					Re = reDigit.test(absTmp);
				} else {       //소숫점 허용
					var reDigit = /[^0-9.]/;
					Re = reDigit.test(absTmp);
				}
				if (Re) {
					return "0";
				} else {
					return tmp;
				}
			}

			, savedata: function (doc) {
				if (doc.options.form == "wFrm02") {
					var trs_val, fld_data = $("table[name=current_month]", doc.element).xtable("instance").getData(false);
					$("input[name=fld_formdata]", doc.element).val(fld_data);
					var getdata = function (trs) {
						var inputs = null, ival = [], trval = [];
						$.each(trs, function (ii, tr) {
							inputs = $("input", tr);
							trval = [];
							$.each(inputs, function (jj, input) {
								trval.push($(input).xval());
							});
							ival.push(trval.join("†"));
						});
						return ival.join(";");
					}

					trs_val = getdata($("table[name=current_month_c] tr[name^='_row_']", doc.element));
					$("input[name=fld_formdata_c]", doc.element).val(trs_val);
					trs_val = getdata($("table[name=current_month_n] tr[name^='_row_']", doc.element));
					$("input[name=fld_formdata_n]", doc.element).val(trs_val);
				}
			}

			, validateCallback: function (_me) {
				if (!$dwp.core.util.validator.validate($("form", _me.element))) { return false; }
				return true;
			}

			, changeCategory: function (doc, opt) {
				/* 문서의 읽기모드에서 작성자, 콘텐츠운영자, IT관리자가 분류를 직접 변경 */
				var _doc = doc, _opt = opt, _cate_list = [];

				if (_opt.iscategory) {
					_cate_list = $dwp.app.sbrd01.getCategory(_opt);
				}
				else {
					return;
				}
				console.log("_cate_list:", _cate_list);

				if ((_opt.iswriter || _opt.isconowner || _opt.isadmin) && !_opt.isedit) {
					$(".dwp-subject > .dwp-tag", _doc.element).bind("click", function (e) {
						var _buttons = [], _h;

						_h = "<div class='dwp-table-vertical'><div class='dwp-row'>";
						_h += "<div class='dwp-title'>";
						_h += $fn.getCodeMsg("comm.title.category");
						_h += "</div>";
						_h += "<div class='dwp-value'>";
						_h += "<div class='select-group'>";
						_h += "<div class='dwp-selectbox md'>";
						_h += "<select name='ed_Category'>";
						if (_cate_list.length >= 0) {
							$.each(_cate_list, function (idx, o) {
								console.log("o:", o);
								_h += "<option value='" + o.val + "'>" + $fn.getCurLangMsg(o.title);
							});
						}
						_h += "</select></div></div></div></div></div>";

						_buttons[0] = {
							title: $fn.getCodeMsg("comm.btn.confirm"),
							click: function (obj) {
								var _doc = obj;
								console.log("_doc.element:", _doc.element);
								var _cate = $("select[name='ed_Category']", _doc.element).xval(), _cate_nm;
								$.each(_cate_list, function (idx, o) {
									if (o.val === _cate) {
										_cate_nm = o.title;
										return true;
									}
								});
								$fn.cmdPost(
									$dwp.core.util.getProxyUrl(_opt.cdb + '/wcmdpost_category?createdocument')
									, { category: _cate, category_nm: _cate_nm, postdata: _opt.unid }
									, function (data) {
										var _url = _opt.pathinfo;
										if (data.hasOwnProperty("result")) {
											if (data.result >= "200" && data.result < "300") {
												$fn.loadPage({ link: _url, linktype: "PAGE" });
												obj.close();
											}
											else if (data.result === "300") {
												$fn.alert({ msg: "error" });
											} else {
												$fn.alert({ msg: "error" });
											}
										} else {
											$fn.alert({ msg: "error" });
										}
									}
									, 'json'
								);
							}
						};

						_buttons[1] = {
							title: $fn.getCodeMsg("comm.btn.cancel"),
							click: function (obj) {
								obj.close();
							}
						};

						$dwp.ui.dialog.init(null, {
							modal: true,
							resizable: false,
							draggable: true,
							title: $fn.getCodeMsg("comm.title.category"),
							width: 360,
							height: 280,
							show: 'fade',			//effect
							hide: 'fade',			//effect
							islangconvert: false,
							//autoOpen: false,		//.dialog("open")호출시만 열림
							buttons: _buttons,
							initcallback: function (o) {
							},
							content: { html: _h }
						});
					}).addClass("dwp-cursor");
				}

				if (_opt.isnew && _cate_list.length > 0) {
					//console.log("_opt.param.lnbid:", _opt.param.lnbid);
					//console.log("_opt.param.boardid:", _opt.param.boardid);
					//새문서 일 때 분류 기본값 설정
					if (_opt.param.lnbid === "W3081") {
						//헬프데스크
						try {
							$("[data-fnm='Category'] select", _doc.element).xval(_cate_list[0].val);
							$("input[name='Category']", _doc.element).val(_cate_list[0].val);
							$("input[name='Category_Nm']", _doc.element).val(_cate_list[0].title);
						}
						catch (e) {
							console.log("Error Message: ", e.message);
							console.log("Error Code: ", e.number & 0xFFFF);
							console.log("Error Name: ", e.name);
						}
					}
				}

				if (_opt.isedit && _opt.param.lnbid == "W3198" && _opt.param.boardid == "bbs0007") {
					$("#Category div.dwp-selectbox", _doc.element).removeClass("md")
				}
			}
			, _initOptions: function (opt) {
				var _me = this, _opt = $.extend(_opt, opt);

				_opt.button = {
					draft: {
						title: $fn.getCodeMsg("comm.btn.draftsave")
						, click: function (doc) {
							debugger;
							_me.savedata(doc);
							if (!_$$.sbrd01._becheck(doc, "draft")) return;	//저장전에 체크 함수
							doc.save({ actiontype: "draft", docstatus: "draft" });
						}
					}
					, savedoc: {
						title: $fn.getCodeMsg("comm.btn.reg")
						, click: function (doc) {
							_me.savedata(doc);
							if (!_$$.sbrd01._becheck(doc, "save")) return;	//저장전에 체크 함수

							doc.save({ actiontype: "save", docstatus: "reg" });
						}
					}

					//작성법 버튼 추가 - 2019.20.18 by dwlee
					, helpdoc: {
						title: $fn.getCodeMsg("작성방법")
						, click: function (doc) {
							_url = $fn.getProxyUrl(doc.options.cdb + "/wFrmWriteHelp?OpenForm");
							var _buttons = [{
								"title": $fn.getCodeMsg("닫기"),
								"click": function (obj) {
									obj.close();
								}
							}];
							$fn.dialog(null, {
								modal: true,
								resizable: true,
								draggable: true,
								islangconvert: false,
								title: "주(월)간보고 작성법",
								width: 600,
								height: 410,
								show: 'fade',			//effect
								hide: 'fade',			//effect
								buttons: _buttons,
								content: { url: _url, data: {} }
							});
						}
					}

					//지난주(월) 문서 불러오기 버튼 추가 - 2019.02.28 by dwlee
					, precall: {
						title: $fn.getCodeMsg("불러오기")
						, click: function (doc) {
							if (doc.option.predocid != "") {
								$dwp.ui.weditor.setDocBody($("#bodyFld", doc.element), { cdb: doc.options.cdb, unid: doc.options.predocid, isnew: false, bodydata: "" }, doc);
							} else {
								alert("지난주(월) 문서정보를 가져오지 못하였습니다.");
								return;
							}
						}
					}

					, editdoc: {
						title: $fn.getCodeMsg("comm.btn.edit")
						, click: function (doc) {
							var _docopt = doc.options;
							if (_docopt.hasOwnProperty("checkin")) {
								//등록된 문서이면...
								if (_docopt.docstatus == "reg") {
									$fn.xAjax({
										url: $fn.getProxyUrl(_docopt.cdb + '/wcmdpost1?createdocument'),
										data: { actiontype: "checkin", unid: _docopt.key_unid },
										method: "POST",
										dataType: "json",
										async: false
									}).done(function (data) {

										//console.log("data : ", data);

										if (data.hasOwnProperty("result")) {
											if (data.result >= "200" && data.result < "300") {             //작업성공
												if (data.isedit == "true") {
													doc.editDocument({ actiontype: "save", docstatus: "reg" });
												} else {
													$fn.alert({ msg: data.curedit + "님이 업무보고 문서를 수정입니다." });
												}
											} else {
												$fn.alert({ msg: data.message });
											}
										} else {
											$fn.alert({ msg: "문서 체크중 오류가 발생하였습니다." });
										}
									}).fail(function (req, error) {
										$fn.alert({ msg: $fn.getCodeMsg("sche.msg.err00") });
									});

									//임시 저장 중이면...
								} else {
									doc.editDocument({ actiontype: "save", docstatus: "reg" });
								}
							} else {
								doc.editDocument({ actiontype: "save", docstatus: "reg" });
							}
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
					, canceldoc: {
						title: $fn.getCodeMsg("comm.btn.cancel")
						, click: function (doc) {
							$fn.confirm({ msg: $fn.getCodeMsg("sbrd01.msg.canceldocconfirm") }).done(function () {
								doc.goview();
							});
						}
					}
					, restore: {
						title: $fn.getCodeMsg("comm.btn.restoredoc")
						, click: function (view) {
							view.restoreDocument({});
						}
					}
					, goview: {
						title: $fn.getCodeMsg("comm.btn.list")
						, click: function (doc) {
							doc.goview();
						}
					}
					, movedoc: {
						title: $fn.getCodeMsg("sbrd01.btn.movedoc")
						, click: function (doc) {
							_$$.sbrd01.act_movedoc_doc(doc);
						}
					}
					, megaattach: {
						title: $fn.getCodeMsg("comm.title.megaattach")
						, click: function (doc) {
							$dwp.ui.megaattach({ docinst: doc });
						}
					}
					, savedoc1: {
						title: $fn.getCodeMsg("comm.btn.reg")
						, click: function (doc) {
							debugger;
							doc.save({ actiontype: "save", docstatus: "reg" });
						}
					}
					, reply: {
						title: $fn.getCodeMsg("comm.btn.repdoc")
						, click: function (doc) {
							doc.save({ actiontype: "save", docstatus: "reg" });
						}
					}
					,repdoc: {
						title :  $fn.getCodeMsg("comm.btn.reponsedoc")
						,click : function(doc) {
							//doc.save({actiontype : "save", docstatus : "reg"});
							doc.repDoc({form :doc.options.rformalias, param : doc.options.param});
						}
					}	
				};

				_opt.category = {
					lvl: 1
					, data: _$$.sbrd01.getCategory(_opt)
					, change: function (view, select) {
						//console.log('view', view);
						//console.log('select', select);
					}
				}

				_opt.bbs_mn_dbpath = "dwp/com/appmng/bbs_mn.nsf";
				_opt.movedoc_dbpath = "dwp/hq/bbs/movedoc.nsf";

				return _opt;
			}
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

				if (_opt.viewalias == "wv02_meetingdate_des") {
					_opt.ps = 40;
				}

				//21.05.31 : 키메시지는 createkmsg버튼 > wFrmKeyMsg 양식을 열도록 수정(변칙 주의)
				if (_opt.cdb.indexOf("dwp/com/appmng/keymsg_mn.nsf") > -1) {
					var orgviewalias = _opt.viewalias;
					_opt.viewalias = "wvkeymsg";
					_opt.button = _me._buttonInfo(_opt);
					_opt.viewalias = orgviewalias;
				}

				_view = $fn.view(_opt, el);
			}
			, _initOptions: function (opt) {
				var _me = this
					, _opt = $.extend({}, opt);

				_opt.button = _me._buttonInfo(_opt);
				_opt.header = _me._headerInfo(_opt);

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
					, del: {
						title: $fn.getCodeMsg("comm.btn.deldoc"),
						click: function (view) {
							view.deleteDocument({ confirm: $fn.getCodeMsg("sbrd01.msg.deleteconfirm") });
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-remove.svg"
					}
					, pdel: {
						title: $fn.getCodeMsg("comm.btn.pdeldoc")
						, click: function (view) {
							//$fn.confirm({ msg: $fn.getCodeMsg("comm.msg.msg068") }).done(function () {		
								view.deleteDocument({ softdel: false, confirm:$fn.getCodeMsg("comm.msg.msg068")});	//선택한 문서를 영구삭제 하시겠습니까?
							//});
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"
					}
					, restore: {
						title: $fn.getCodeMsg("comm.btn.restoredoc")
						, click: function (view) {
							view.restoreDocument({});
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-restore.svg"
					}
					, create: {
						title: $fn.getCodeMsg("comm.btn.create")
						, click: function (view) {
							//view.createDocument({ param: _opt.param, formalias: "wFrm01" });
							view.createDocument({ param: _opt.param });	//2021-08-11 by 10000hyun : 사용안내 등등 formalias 다른 경우가 있음 (formalias 자동설정 하고 있음)
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
					, create2: {
						title: "경영전략회의-영업부"
						, click: function (view) {
							view.createDocument({ param: _opt.param, formalias: "wFrm02" });
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
					, create3: {
						title: "경영전략회의-기타부서"
						, click: function (view) {
							view.createDocument({ param: _opt.param, formalias: "wFrm03" });
						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
					, createkmsg: {		//키메시지
						title: $fn.getCodeMsg("comm.btn.create")
						, click: function (view) {
							view.createDocument({ param: _opt.param, formalias: "wFrmKeyMsg" });
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

					, datedoc: {
						title: "당직자명부작성"
						, click: function (view) {

							_url = $fn.getProxyUrl(_opt.cdb + "/wFrmDate?OpenForm&curserver=");

							var _buttons = [{
								"title": $fn.getCodeMsg("sbrd01.btn.confirm"),
								"click": function (obj) {
									var _selY = $("select[name=_SEL_YEAR]", obj.element).xval()
									var _selM = $("select[name=_SEL_MONTH]", obj.element).xval()

									var _detail_url = _opt.cdb + "/wFrm03?OpenForm&lnbid=W0040&boardid=bbs0011";
									_detail_url += "&vTitle=" + _selY + "년 " + _selM + "월 당직자 명부"
									$fn.loadPage({ link: $fn.getProxyUrl(_detail_url), linktype: "PAGE" });

									obj.close();

								}
							},
							{
								"title": $fn.getCodeMsg("sbrd01.btn.cancel"),
								"click": function (obj) {
									obj.close();
								}
							}];

							$fn.dialog(null, {
								modal: true,
								resizable: false,
								draggable: true,
								islangconvert: false,
								title: "당직자명부 작성",
								width: 280,
								height: 200,
								show: 'fade',			//effect
								hide: 'fade',			//effect
								//autoOpen: false,		//.dialog("open")호출시만 열림
								buttons: _buttons,

								content: { url: _url, data: {} }
							});

						}
						, icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
				}

				var _sbtnList = {
					wvnotice: ['create', 'eprint', 'del', 'pdel']
					, wvrecent: ['eprint', 'del', 'pdel']
					, wvmonthlist: ['datedoc', 'del', 'pdel']
					, wvall: ['eprint', 'del', 'pdel']
					, wv01: ['create', 'eprint', 'del', 'pdel']
					, wv02: ['create', 'eprint', 'del', 'pdel']

					//2019.02.18 - added by dwlee
					, wv07: ['create', 'eprint', 'del', 'pdel']

					, wvdraft: ['create', 'eprint', 'pdel']
					, wvtrash: ['restore', 'eprint', 'pdel']
					, wvme: ['eprint', 'pdel']
					, wvexpired: ['eprint', 'pdel']
					, wv02_created_des: ['date', 'movedoc', 'create', 'eprint', 'del', 'pdel']
					, wv02_meetingdate_des: ['movedoc', 'create', 'eprint', 'del', 'pdel']
					, wv03_created_des: ['create', 'eprint', 'del', 'pdel']

					//2019.02.18 - added by dwlee
					, wv07_created_des: ['movedoc', 'create', 'eprint', 'del', 'pdel']
					, wv07_meetingdate_des: ['movedoc', 'create', 'eprint', 'del', 'pdel']

					, wv02_customer_created_des: ['movedoc', 'create', 'eprint', 'del', 'pdel']
					, wvalert_created_des: ['date', 'movedoc', 'create', 'eprint', 'del', 'pdel']

					//2019.02.18 - added by dwlee
					, wv07_customer_created_des: ['movedoc', 'create', 'eprint', 'del', 'pdel']

					//2021-03-09 - 경영전략회의
					, wv08_created_des: ['movedoc', 'create2', 'create3', 'eprint', 'del', 'pdel']
					, wv08_meetingdate_des: ['movedoc', 'create2', 'create3', 'eprint', 'del', 'pdel']
					, wv08_customer_created_des: ['movedoc', 'create2', 'create3', 'eprint', 'del', 'pdel']

					//21.05.31 : 키메시지는 createkmsg버튼 > wFrmKeyMsg 양식을 열도록 수정(변칙 주의)
					, wvkeymsg: ['date', 'movedoc', 'createkmsg', 'eprint', 'del', 'pdel']
				};
				//console.log("_sbtnList[_opt.viewalias]:", _sbtnList[_opt.viewalias]);
				return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);
			}
			, _headerInfo: function (_opt) {

				var _searchcate = [{ title: $fn.getCodeMsg("sbrd01.title.searchall"), key: "all" }
					, { title: $fn.getCodeMsg("sbrd01.title.searchauthor"), key: "AuthorName" }
					, { title: $fn.getCodeMsg("sbrd01.title.searchorg"), key: "AuthorOrgName" }
					, { title: $fn.getCodeMsg("sbrd01.title.searchsubject"), key: "Subject" }
					, { title: $fn.getCodeMsg("sbrd01.title.searchsb"), key: "Subject|Body" }];

				//전산 자료실 예외처리
				if (_opt.applcode === "pgdn") {
					_searchcate = [{ title: $fn.getCodeMsg("sbrd01.title.searchall"), key: "all" }
						, { title: $fn.getCodeMsg("sbrd01.title.searchauthor"), key: "AuthorName" }
						, { title: $fn.getCodeMsg("sbrd01.title.searchorg"), key: "AuthorOrgName" }
						, { title: $fn.getCodeMsg("sbrd01.title.searchsubject"), key: "Subject" }
						, { title: $fn.getCodeMsg("sbrd01.title.searchsb"), key: "Subject|Body" }
						, { title: $fn.getCodeMsg("sbrd01.title.searchfnm"), key: "Multi_Attach_SortFiles" }];
				}

				var _cate = {}, _cate_data = [];
				//작성자 숨김을 사용하는 경우 검색옵션 변경
				if (_opt.isdispauthor === false) {
					//_searchcate = _searchcate.slice(2, _searchcate.length);
					_searchcate = [
						{ title: $fn.getCodeMsg("sbrd01.title.searchall"), key: "all" }
						, { title: $fn.getCodeMsg("sbrd01.title.searchsubject"), key: "Subject" }
						, { title: $fn.getCodeMsg("sbrd01.title.searchsb"), key: "Subject|Body" }
					];
				}
				//분류사용인 경우 설정
				if (_opt.iscategory === true) {
					_cate_data = _$$.sbrd01.getCategory(_opt);
					if (_cate_data.length > 0) {
						_cate = {
							name: '_category'
							, lvl: 1
							, data: _cate_data
							, change: function (view, select) {
							}
						}
					}
				}
				var _me = this;
				var _col = {
					created: {
						name: '_created'
						, type: 'date'
						, title: $fn.getCodeMsg("sbrd01.data.columns.created")
						, width: '10%'
						, sort: true
						, sorttype: 'asc'
						, css: 'date-cell'
					}
					, meetingdate: {
						name: '_meetingdate'
						, type: 'date'
						, title: $fn.getCodeMsg("sbrd01.data.columns.meetingdate")
						, width: '8%'
						, sort: true
						, sorttype: 'asc'
						, css: 'date-cell'
					}
					, attach: {
						name: '_attach'
						, type: 'file'
						, title: ''
						, width: '3%'
						, sort: false
						, css: 'file-cell'
					}
					, subject: {
						name: '_subject'
						, type: 'text'
						, title: $fn.getCodeMsg("sbrd01.data.columns.subject")
						, width: 'auto'
						, sort: false
						, css: 'subject-cell'
					}
					, author: {
						name: '_author'
						, title: $fn.getCodeMsg("sbrd01.data.columns.author")
						, width: '10%'
						, sort: false
						, sorttype: 'des'
						, css: 'auth-cell'
					}
					, like: {
						name: '_likecnt'
						, title: $fn.getCodeMsg("sbrd01.data.columns.like")
						, width: '6%'
						, sort: true
						, sorttype: 'des'
						, css: 'like-cell'
					}
					, readcnt: {
						name: '_readcnt'
						, title: $fn.getCodeMsg("sbrd01.data.columns.readcnt")
						, width: '6%'
						, sort: false
						, sorttype: 'des'
						, css: 'view-cell'
					}
					, readcntnoopen: {	//조회수 오픈 금지
						name: '_readcntnoopen'
						, title: $fn.getCodeMsg("sbrd01.data.columns.readcnt")
						, width: '6%'
						, sort: false
						, sorttype: 'des'
						, css: 'view-cell'
					}
					, boardname: {
						name: '_boardname'
						, title: $fn.getCodeMsg("sbrd01.data.columns.boardname")
						, width: '8%'
						, sort: false
						, css: 'boardname-cell'
					}
					, replycnt: {
						name: '_replycnt'
						, title: $fn.getCodeMsg("sbrd01.data.columns.replycnt")
						, width: '6%'
						, sort: false
						, css: 'dwp-center'
					}
					, orgname: {
						name: '_orgname'
						, title: $fn.getCodeMsg("sbrd01.data.columns.orgname")
						, width: '14%'
						, sort: false
						, sorttype: 'des'
						, css: 'dwp-center'
					}
					, expireddate: {
						name: '_expireddate'
						, type: 'date'
						, title: $fn.getCodeMsg("sbrd01.data.columns.expireddate")
						, width: '8%'
						, sort: true
						, css: 'dwp-center'
					}
					, todate: {
						name: '_todate'
						, type: 'fnc'
						, title: $fn.getCodeMsg("sbrd01.data.columns.todate")
						, width: '8%'
						, sort: false
						, css: 'dwp-center'
						, content: function (o) {
							if (o.hasOwnProperty("_pmtpost")) {
								if (o._pmtpost === "true") {
									return $fn.getCodeMsg("sbrd01.data.term.0");
								}
								else {
									return $fn.formatDateTime(o._todate, "dateonly");
								}
							}
						}
					}
					, importance: {
						name: '_importance'
						, type: 'fnc'
						, title: ""
						, width: '3%'
						, sort: false
						, css: 'imp-cell'
						, content: function (o) {
							return (o["_importance"] == "1" ? '<img class = "icon-file" src="' + $dwp.core.getPath("weblib") + '/images/common/icon-first.svg">' : '');
						}
					}
					, deluser: {
						name: '_deluser'
						, title: $fn.getCodeMsg("sbrd01.data.columns.deluser")
						, width: '10%'
						, sort: true
						, css: 'dwp-center'
					}
					, deldate: {
						name: '_deldate'
						, type: 'date'
						, title: $fn.getCodeMsg("sbrd01.data.columns.deldate")
						, width: '8%'
						, sort: true
						, css: 'dwp-center'
					}

					, docstatus: {
						name: '_docstatus'
						, type: 'fnc'
						, title: $fn.getCodeMsg("sbrd01.data.columns.docstatus")
						, width: '8%'
						, sort: false
						, css: 'dwp-center'
						, content: function (o) {
							if (o.hasOwnProperty("_docstatus")) {
								switch (o._docstatus) {
									case "reg": return $fn.getCodeMsg("sbrd01.data.columns.reg"); break;
									case "draft": return $fn.getCodeMsg("sbrd01.data.columns.draft"); break;
									case "del": return $fn.getCodeMsg("sbrd01.data.columns.del"); break;
									case "expire": return $fn.getCodeMsg("sbrd01.data.columns.expire"); break;
									case "wait": return $fn.getCodeMsg("sbrd01.data.columns.wait"); break;
								}
							}
						}
					}
					, cust_name: {
						name: '_cust_name'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_name")
						, width: '8%'
						, sort: false
						, css: 'auth-cell'
					}
					, cust_use: {
						name: '_cust_use'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_use")
						, width: '8%'
						, sort: false
						, css: 'dwp-center'
					}
					, cust_customer: {
						name: '_cust_customer'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_customer")
						, width: '8%'
						, sort: false
						, css: 'auth-cell'
					}
					, cust_hp: {
						name: '_cust_hp'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_hp")
						, width: '8%'
						, sort: false
						, css: 'dwp-left'
					}
					, cust_place: {
						name: '_cust_place'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_place")
						, width: 'auto'
						, sort: false
						, css: 'dwp-left'
					}
					, cust_number: {
						name: '_cust_number'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_number")
						, width: '8%'
						, sort: false
						, css: 'dwp-left'
					}
					, cust_owner: {
						name: '_cust_owner'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_owner")
						, width: '8%'
						, sort: false
						, css: 'auth-cell'
					}
					, cust_bank: {
						name: '_cust_bank'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_bank")
						, width: '8%'
						, sort: false
						, css: 'dwp-center'
					}
					, cust_banknum: {
						name: '_cust_banknum'
						, title: $fn.getCodeMsg("sbrd01_customer.data.columns.cust_banknum")
						, width: '8%'
						, sort: false
						, css: 'dwp-left'
					}
					, year: {
						name: '_year'
						, title: $fn.getCodeMsg("해당년도")
						, width: '10%'
						, sort: false
						, css: 'dwp-center'
					}
				}
				var _hList = {
					// 기본보기 상단고정 없는 경우
					wv01: {
						sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'attach', 'importance', 'subject', 'author', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wv02: {
						sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'attach', 'subject', 'author', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wvnotice: {
						sortvw: "wvnotice"				// 개별보기 소트
						, sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrmNotice"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'attach', 'subject', 'author', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wv02_customer_created_des: {
						sortvw: "wv02_customer"				// 개별보기 소트
						, sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrmCustomer"
						, isnew: { basedate: '_created' }
						, isreply: false
						, category: _cate
						, colnm: ['cust_use', 'cust_name', 'cust_customer', 'cust_hp', 'cust_place', 'cust_number', 'cust_owner', 'cust_bank', 'cust_banknum', 'created']
						, search: _searchcate
						//,click : function(){}
					}
					, wvrecent: {
						sortvw: "wvrecent"				// 개별보기 소트
						, sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'boardname', 'attach', 'subject', 'author', 'orgname', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wvmonthlist: {
						sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm03"
						, isnew: { basedate: '_created' }
						, isreply: false
						, category: _cate
						, colnm: ['year', 'subject', 'author', 'orgname']
						, search: _searchcate
						//,click : function(){}
					}
					, wvall: {
						sortvw: "wvall"
						, sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'boardname', 'attach', 'subject', 'author', 'orgname', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wvtemp: {
						sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'boardname', 'attach', 'subject', 'author', 'like', 'readcnt', 'docstatus']
						, search: _searchcate
						//,click : function(){}
					}
					, wvtrash: {
						sortnm: "_deldate"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'boardname', 'attach', 'subject', 'author', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wvexpired: {
						sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'boardname', 'attach', 'subject', 'author', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wv02_created_des: {
						sortvw: "wv02"				// 개별보기 소트
						, sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'attach', 'subject', 'author', 'orgname', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wvalert: {
						sortvw: "wvalert"				// 개별보기 소트
						, sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'attach', 'subject', 'author', 'orgname', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wvalert_created_des: {
						sortvw: "wvalert"				// 개별보기 소트
						, sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'attach', 'subject', 'author', 'orgname', 'readcntnoopen']
						, search: _searchcate
						//,click : function(){}
					}

					, wv02_meetingdate_des: {
						sortvw: "wv02"				// 개별보기 소트
						, sortnm: "_meetingdate"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_meetingdate' }
						, isreply: true
						, category: _cate
						, cateview: 'meetingdate'
						, colnm: ['meetingdate', 'created', 'attach', 'subject', 'author', 'orgname', 'like', 'readcntnoopen']
						, search: _searchcate
						//,click : function(){}
					}

					//월간보고 - 2019.02.18 by dwlee
					, wv07_meetingdate_des: {
						sortvw: "wv07"				// 개별보기 소트
						, sortnm: "_meetingdate"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_meetingdate' }
						, isreply: true
						, category: _cate
						, cateview: 'meetingdate'
						, colnm: ['meetingdate', 'created', 'attach', 'subject', 'author', 'orgname', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}


					//경영전략회의 - 2021-03-09
					, wv08_meetingdate_des: {
						sortvw: "wv07"				// 개별보기 소트
						, sortnm: "_meetingdate"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_meetingdate' }
						, isreply: true
						, category: _cate
						, cateview: 'meetingdate'
						, colnm: ['meetingdate', 'created', 'attach', 'subject', 'author', 'orgname', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}

					// 기본 상단고정 개별 소트보기가 있는 경우
					, wv03_created_des: {
						sortvw: "wv03"				// 개별보기 소트
						, sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'attach', 'subject', 'author', 'like', 'readcnt']
						, search: _searchcate
						//,click : function(){}
					}
					, wvme: {
						sortnm: "_created"
						, sortorder: "descending"
						, checkbox: true
						, formalias: "wFrm01"
						, isnew: { basedate: '_created' }
						, isreply: true
						, category: _cate
						, colnm: ['created', 'attach', 'subject', 'author', 'like', 'readcnt']
						, search: _searchcate
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
				if (_opt.hasOwnProperty("isreply")) {
					_hList[_opt.viewalias].isreply = _opt.isreply;
				}

				_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);
				return _hList[_opt.viewalias];
			}
		}

		, doc_mo: {
			getOptions: function () {
				return $.extend({}, _me._initOptions(opt));
			}
			, init: function (opt, el) {
				var _me = this
					, _topt = _me._initOptions(opt);

				var _opt = $.extend({}, opt, _topt);
				var _doc = $fn.doc(_opt);
				var _el = _doc.element;
				// 조직도 처리함수
				$fn.orgsel($("[name='org0']", _el)
					, { isedit: _opt.isedit, treetype: "0", seltype: "0", isseltype: false, fld: "BoardNotifiers", count: 10, ismobile: true });

				$fn.orgsel($("[name='org1']", _el)
					, { isedit: _opt.isedit, treetype: "0", seltype: "0", isseltype: false, fld: "BoardDocReaders", count: 10, ismobile: true });

				$fn.orgsel($("[name='org2']", _el)
					, { isedit: _opt.isedit, treetype: "0", seltype: "2", fld: "tAuthor", count: 1 });


				//모바일 날짜 처리
				var _dateProc = function () {
					var _fromDate = ""
						, _toDate = ""
						, _amount = ""
						, _measure = ""
						, _zregcode = ""
						, _termCategory = "";

					//지역이 hq인 경우에만 common group 표시
					_zregcode = $fn.getZRegCode($fn.getCurUser().zregcode);
					if (_zregcode !== "hq") {
						$("[data-xlang-name='CommonGroups']", _el).remove();
					}

					_termCategory = $("select[name='TermCategory']", _el).val();
					if (_termCategory === "0") {
						$(".dwp-calendar-form", _el).hide();
					}
					else if (_termCategory === "input") {
						$("input[name='FromDate']", _el).prop("readonly", false);
						$("input[name='ToDate']", _el).prop("readonly", false);

						$(".dwp-input .ui-datepicker-trigger", _el).show();
						$(".dwp-calendar-form", _el).show();
					}
					else {
						$("input[name='FromDate']", _el).prop("readonly", true);
						$("input[name='ToDate']", _el).prop("readonly", true);

						$(".dwp-input .ui-datepicker-trigger", _el).hide();
						$(".dwp-calendar-form", _el).show();
					}


					$("select[name='TermCategory']", _el).bind("change", function (o) {
						_fromDate = new Date($("input[name='FromDate']", _el).xval());
						_toDate = new Date(_fromDate.format("yyyy-mm-dd"));
						_termCategory = $(this).val();
						if (_termCategory === "0") {
							_toDate.adjust(100, 0, 0, 0, 0, 0);
							$("input[name='ToDate']", _el).xval(_toDate.format("yyyy-mm-dd"));
							$(".dwp-calendar-form", _el).hide();
						}
						else if (_termCategory === "input") {
							//_toDate.adjust(0, 0, 1, 0, 0, 0);
							$("input[name='FromDate']", _el).prop("readonly", false);
							$("input[name='ToDate']", _el).prop("readonly", false)
								.xval(_toDate.format("yyyy-mm-dd"));

							$(".dwp-input .ui-datepicker-trigger", _el).show();
							$(".dwp-calendar-form", _el).show();
						}
						else {
							_measure = _termCategory.substring(0, 1);
							_amount = parseInt(_termCategory.split("_")[1], 10);
							if (_measure === "W") {
								_amount = _amount * 7;
								_toDate.adjust(0, 0, _amount, 0, 0, 0);
							}
							else if (_measure === "M") {
								_toDate.adjust(0, _amount, 0, 0, 0, 0);
							}
							else if (_measure === "Y") {
								_toDate.adjust(_amount, 0, 0, 0, 0, 0);
							}
							else {
								return;
							}
							$("input[name='FromDate']", _el).prop("readonly", true);
							$("input[name='ToDate']", _el).prop("readonly", true).xval(_toDate.format("yyyy-mm-dd"));


							$("input[name='ToDate']", _el).xval(_toDate.format("yyyy-mm-dd"));

							$(".dwp-input .ui-datepicker-trigger", _el).hide();
							$(".dwp-calendar-form", _el).show();
						}
					});
				}

				if (_opt.isedit) {
					// 날짜 처리
					_dateProc();
				}

				var PList = ["_clerk", "_link"];
				$.each(PList, function (_i, _data) {
					_$$.sbrd01._etc_Proc[_data](_doc);
				})

			}
			, _initOptions: function (opt) {
				var _me = this;
				var _topt = $dwp.app.sbrd01.doc.getOptions(opt);

				// 버튼영역 추가
				_topt.button['savedoc'] = {
					title: $fn.getCodeMsg("comm.btn.reg")
					, click: function (doc) {
						if (!_$$.sbrd01._becheck(doc, "save")) return;	//저장전에 체크 함수
						doc.save({ actiontype: "save", docstatus: "reg" });
					}
					, icon: $fn.getPath("weblib") + "/images/common/btn-confirm.svg"
				};
				_topt.button['editdoc'] = {
					title: $fn.getCurLangMsg("편집")
					, click: function (doc) {
						doc.editDocument();
					}
					, icon: $fn.getPath("weblib") + "/images/common/icon-modify-md.svg"
				}
				_topt.button['deldoc'] = {
					title: $fn.getCurLangMsg("삭제")
					, click: function (doc) {
						doc.deleteDocument({ confirm: "삭제하시겠습니까?" });
					}
					, icon: $fn.getPath("weblib") + "/images/common/icon-delete.svg"
				}
				return _topt;
			}
		}

		, view_mo: {
			getOptions: function () {
				return $.extend({}, _me._initOptions(opt));
			}
			, init: function (opt, el) {
				var _me = this;

				var _topt = _me._initOptions(opt);

				_opt = $.extend({}, opt, _topt);

				$fn.view(_opt, el);

			}
			, _initOptions: function (opt) {
				var _me = this;
				var _topt = $dwp.app.sbrd01.view.getOptions(opt);
				//console.log("topt",_topt)
				_topt.header.formalias = _topt.header.formalias + "_mo"		// 작성양식 수정


				var _lnbid = _topt.param.lnbid, _boardid = _topt.param.boardid;
				var _key = _lnbid + "^" + _boardid, _cname = "";

				if (_topt.viewalias.toLowerCase() == "wvall") {
					_cname = '_boardname';

				} else {

					if (!_topt.iscategory) {
						$fn.xAjax({
							url: "/dwp/com/appmng/bbs_mn.nsf/api/data/collections/name/vwJSonInfoByKey?count=999&category=" + _key,
							method: "GET",
							dataType: "json",
							async: false,
							cache: false
						}).done(function (data) {
							if (data !== null && data.length > 0) {
								if (data[0]._category != "") {
									_cname = '_category';
								}
							}

							_cname = '_boardname';

						}).fail(function (req, error) {
							console.log(req.responseText + "\n" + error);
						});
					}
				}

				_topt.header.category.name = _cname;
				return _topt;
			}
		}

		//모바일 담당자 정보 저장 및 Vaildate 체크
		, _becheck: function (doc, atype) {
			var _doc = doc
			var _$pel = $("div[data-event='clerk-list-edit']", _doc.element)
				, _clist = $("input[name='MobileClerkList']", _$pel)
				, _clist_id = $("input[name='MobileClerkListID']", _$pel)
				, _sep = "!+!", _rValList = "", _rValList_id = "", _lstr = "", _rChk = true, _cnum = "";


			// 담당자 정보 저장 및 체크
			if (typeof (_doc.options.isclerk) != "undefined") {
				if (_doc.options.isclerk) {
					$("tr", _$pel).each(function (_i, _$el) {
						if (!$fn.validate($(_$el))) {
							_rChk = false;
							return false;
						}

						cnum = $("input[name='unum']", $(_$el)).val();

						_rValList += (_rValList == "" ? $(_$el).data("uVal") : ";" + $(_$el).data("uVal")) + _sep + cnum;
						_rValList_id += (_rValList_id == "" ? $(_$el).data("uID") : ";" + $(_$el).data("uID"));

					});

					if (!_rChk) {
						return _rChk;
					}

					_clist.val(_rValList);
					_clist_id.val(_rValList_id);
				}
			}


			//모바일 링크
			if (typeof (_doc.options.islink) != "undefined" && atype != "draft") {
				if (doc.options.islink) {
					_lstr = $("input[name='MobileLink']", _doc.element).val().toLowerCase();
					if (_lstr != "") {
						if (_lstr.indexOf("http://") == -1 && _lstr.indexOf("https://") == -1) {
							$fn.alert({ msg: $fn.getCodeMsg("sbrd01.msg.http") })
								.done(function () { });
							_rChk = false;
						}
					}
				}
			}


			return _rChk;
		}

		, _etc_Proc: {
			_clerk: function (_doc) {	//모바일 담당자 처리

				if (typeof (_doc.options.isclerk) != "undefined") {
					if (_doc.options.isclerk) {

						var _opt = _doc.options
							, _sep = "!+!";

						if (_opt.isedit) {
							var _$pel = $("div[data-event='clerk-list-edit']", _doc.element)
								, _clist = $("input[name='MobileClerkList']", _$pel)
								, _clist_id = $("input[name='MobileClerkListID']", _$pel);



							/* 이벤트 처리 */
							var _act_fnc = function (_tObj, _evstr, _callback) {

								if (typeof (_tObj) == "undefined" || _evstr == "") return;

								_tObj.off(_evstr).on(_evstr, function (e) {
									if (typeof (_callback) == 'function') _callback(e);
									if (typeof (_callback) == 'string') eval(_callback + "(" + e + ")");
								});
							}


							var _cInfo = {
								_event: {
									_add_btn: {
										_act: {
											_target: $("#add_clerk", _doc.element)
											, _event: "click"
											, _callback: function (e) {
												var _tObj = $("tr:first", _$pel).clone().appendTo($("table", _$pel));

												_tObj.attr("name", "org2_" + $("table", _$pel).find("tr").size());

												_cInfo._setOrgProc(_tObj);

												$("input", _tObj).val("");

												$(".btn-del", _tObj).show().off("click").on("click", function (e) {
													$(e.target).closest("tr").remove();
												});

											}
										}
									}
									, _num_fld_key: {
										_act: {
											_target: $("input[type='number']", _$pel)
											, _event: "keypress"
											, _callback: function (e) {
												var _KeyID = window.event ? e.keyCode : e.which;

												if (_KeyID && (_KeyID < 48 || _KeyID > 57) && _KeyID != 8) {
													e.preventDefault ? e.preventDefault() : e.returnValue = false;
												}
											}
										}
									}
									, _num_fld_blur: {
										_act: {
											_target: $("input[type='number']", _$pel)
											, _event: "blur"
											, _callback: function (e) {
												var _tNum = e.target.value.replace(/[^0-9]/g, "");
												$(e.target).val(_tNum);
											}
										}
									}
								}

								, _setValue: function (_$el, _d) {
									var _qsearch = $("input[name='qsearch']", _$el)
										, _uname = $("input[name='uname']", _$el)
										, _upos = $("input[name='upos']", _$el)
										, _udept = $("input[name='udept']", _$el)
										, _unum = $("input[name='unum']", _$el)
										, _uchk = true;

									// 중복 체크
									$("tr", _$pel).each(function () {
										var _cid = $(this).data("uID");

										if (_cid != "" && _cid == _d.notesid) {
											_uchk = false;
											return;
										}
									})

									if (!_uchk) {
										$fn.alert({ msg: $fn.getCodeMsg("sbrd01.msg.alt7") }).done(function () {
											_qsearch.focus();
										});
										return;
									}

									if (_uname.val() == "") {
										_uname.off("focus").on("focus", function () {
											$(this).hide().val("");
											_upos.val("");
											_udept.val("");
											_qsearch.show();
											_qsearch.focus();
											_$el.data("uVal", "").data("uID", "");
										});
									}

									_uname.val($dwp.core.lang.getCurMsg(_d.username));

									_upos.val($dwp.core.lang.getCurMsg(_d.pos));
									_udept.val($dwp.core.lang.getCurMsg(_d.orgname));

									if (_d.unum) {
										_unum.val(_d.unum);
									}

									_uname.show();
									_qsearch.hide();

									_$el.data("uVal", _d.username + _sep + _d.pos + _sep + _d.orgname);
									_$el.data("uID", _d.notesid);

								}

								, _setOrgProc: function (_$el) {
									var _me = this, _lcode = "";

									/* Search 초기화 */
									$("input[name='qsearch']", _$el).show();
									$("input[name='uname']", _$el).hide();


									/* PlaceHolder 및 라벨 */
									$("input[xlang-code!='']", _$el).each(function (_i, _e) {
										_lcode = $(this).attr("xlang-code");

										if (typeof (_lcode) != "undefined") {
											if (_lcode != "") {
												$(this).attr("placeholder", $fn.getCodeMsg(_lcode)).attr("label", $fn.getCodeMsg(_lcode));
											}
										}
									});


									$fn.orgsel($(_$el, _doc.element), {
										isedit: _opt.isedit
										, type: "single"
										, treetype: "0"
										, seltype: "2"
										, isseltype: false
										, autodraw: false
										, ismobile: (_opt.ismobile ? true : false)
										, count: 1
										, autoseletcomplete: function (event, ui, doc) {
											_me._setValue(_$el, ui.item.value);
										}
										, orgselectcomplete: function (dialog, rtndata, doc) {
											if (rtndata.length < 1) {
												return false;
											}
											_me._setValue(_$el, rtndata[0]);
										}
									});
								}
							}

							$.each(_cInfo._event, function (_i, _data) {
								if (typeof (_data._act) != "undefined") {
									_aObj = _data._act;

									if (_aObj._target.length == 0) return false;

									_act_fnc(_aObj._target, _aObj._event, _aObj._callback);
								}
							});

							_cInfo._setOrgProc($("tr:eq(0)", _$pel));

							if (_clist.val() != "") {
								var _cVal = _clist.val().split(";")
									, _cID = _clist_id.val().split(";")
									, _cdata = "", _sdata = {}, _tObj = null;

								$.each(_cVal, function (_i, _d) {
									if (_d == "") return;

									if (_i > 0) {
										$("#add_clerk", _doc.element).trigger("click");
									}

									_tObj = $("tr:eq(" + _i + ")", _$pel);

									_cdata = _d.split(_sep);

									_sdata.username = $.trim(_cdata[0]);
									_sdata.pos = $.trim(_cdata[1]);
									_sdata.orgname = $.trim(_cdata[2]);
									_sdata.unum = $.trim(_cdata[3]);
									_sdata.notesid = $.trim(_cID[_i]);
									_cInfo._setValue(_tObj, _sdata);
								});

							}

						} else {
							var _$pel = $("div[data-event='clerk-list-read']", _doc.element)
								, _$cel = $("input[name='MobileClerkList']", _$pel)
								, _cVal = _$cel.val();

							if (_$cel.length == 0 || _cVal == "") return;

							_cVal = _cVal.split(";")

							function _dspItemHTML(_d) {
								var _cdata = [], _chtml = "";

								if (_d == "") return _chtml;

								_cdata = _d.split(_sep);

								_chtml = "<div class='charger-item'>";
								_chtml += "<div class='text'>";
								_chtml += "<div class='name'>" + $dwp.core.lang.getCurMsg(_cdata[0]) + " / " + $dwp.core.lang.getCurMsg(_cdata[1]) + " / " + $dwp.core.lang.getCurMsg(_cdata[2]) + "</div>";
								_chtml += "<div class='tel'>" + _cdata[3] + "</div>";
								_chtml += "</div>";

								if (_opt.ismobile) {
									var _teltype = ($dwp.core.util.getDeviceInfo.ios() ? "telprompt" : "tel");
									_chtml += "<div class='icon'>";
									_chtml += "<a href='" + _teltype + ":" + _cdata[3] + "'><img src='" + $dwp.core.getPath("weblib") + "/images/common-m/icon-tel.svg' alt=''></a>";
									_chtml += "</div>";
								}
								_chtml += "</div>";

								return _chtml;
							}


							$.each(_cVal, function (_i, _d) {
								_$pel.append(_dspItemHTML(_d));
							})
						}
					}
				}
			}

			, _link: function (_doc) {	//모바일 링크 읽기모드

				if (typeof (_doc.options.islink) != "undefined") {
					if (_doc.options.islink) {
						if (!_doc.options.isedit) {
							var _rObj = $("div[data-event='mobile-link']", _doc.element)
								, _bHtml = "", wUrl = "", _option = "location=no,toolbar=no";

							if (_rObj.size() == "0") return;
							if ($.trim(_rObj.text()) == "") return;

							wUrl = _rObj.text();



							$(_rObj).on("click", function (e) {
								window.open(wUrl, '_system');
							});
						}
					}
				}
			}
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
		//========================================================
		/*보기 화면에서 문서를 다른 게시판으로 이동하기 위한 메뉴 선택*/
		, act_movedoc_view: function (view) {
			var _me = this, _rows = null, _unids = "", _viewname = "", _options = view.options, _el = view.element, _tboardname = "", _tboardpath = "", _tboardkey = "", _tboardform = "", _tboardlnbid = "", _tdbname = "", _tdblogpath = "", _tdbapplcode = "";
			_viewname = view.options.viewalias;
			_rows = view.getChecked();
			console.log("_rows::", _rows);
			if (_rows.length == 0) {
				$dwp.ui.alert({ msg: $fn.getCodeMsg("sbrd01.msg.alt1") });
				return;
			}
			_unids = $.map(_rows, function (v) { return v['@unid']; }).join(";");
			var _buttons = [{
				"title": $fn.getCodeMsg("sbrd01.btn.confirm"),
				"click": function (obj) {
					_sel = $("select[name=CurrentBoard]", obj.element).xval();
					_tboardpath = $("select[name=CurrentBoard]", obj.element).xval();
					_tboardname = $('select[name=CurrentBoard] > option:selected', obj.element).text()
					_tboardform = $('select[name=CurrentBoard] > option:selected', obj.element).data('tform');
					_tboardid = $('select[name=CurrentBoard] > option:selected', obj.element).data('bdid');
					_tboardlnbid = $('select[name=CurrentBoard] > option:selected', obj.element).data('lnbid');
					_tdbname = $('select[name=CurrentBoard] > option:selected', obj.element).data('dbname');
					_tdblogpath = $('select[name=CurrentBoard] > option:selected', obj.element).data('dblog');
					_tdbapplcode = $('select[name=CurrentBoard] > option:selected', obj.element).data('dbapplcode');

					if ((_sel == "root") || (_sel == "")) {
						$dwp.ui.alert({ msg: $fn.getCodeMsg("sbrd01.msg.alt2") });
						return;
					};

					var callback = function (data) {

						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.hasOwnProperty("cnt")) {
									obj.close();
									$dwp.ui.alert({ msg: "게시물을 이동하였습니다!" })
										.done(function () {
											view.reload();
										});
								} else {
									$dwp.ui.alert({ msg: $fn.getCodeMsg("sbrd01.msg.alt3") }); return;
								}
							}
						}
					};

					//관리디비 기준처리
					var _url = $fn.getProxyUrl("/dwp/hq/bbs/movedoc.nsf/wcmdstdpost?createdocument");
					//console.log("_options ", _options);
					$fn.cmdPost(_url, { actiontype: "move", postdata: _unids, Arg1: _tboardpath, Arg2: _tboardform, Arg3: _tboardname, Arg4: _tboardid, Arg5: _tboardlnbid, Arg6: _tdbname, Arg7: _tdblogpath, Arg8: _tdbapplcode, Arg9: _options.applcode, CurDBPath: _options.cdb }, callback, "json");
					//$fn.cmdPost(_url,{actiontype : "move", postdata : _unids, Arg1 : _tboardpath , Arg2 :_tboardform, Arg3 :_tboardname , Arg4 :_tboardid, Arg5 : _tboardlnbid, CurDBPath:_options.cdb  }, callback,"json");
				}
			},
			{
				"title": $fn.getCodeMsg("sbrd01.btn.cancel"),
				"click": function (obj) {
					obj.close();
				}
			}];
			var _callpositioncode = _options.param.lnbid;    // 대상디비목록에서 컬렉션으로 구분하기 위한값
			$fn.dialog(_el, {
				modal: true,
				resizable: true,
				draggable: true,
				title: $fn.getCodeMsg("sbrd01.title.movedoc"),
				width: 500,
				height: 250,
				show: 'fade',			// effect
				hide: 'fade',			// effect
				//autoOpen: false,		//.dialog("open")호출시만 열림
				buttons: _buttons,

				content: { url: "/dwp/hq/bbs/movedoc.nsf/wFrmSelBoard?ReadForm&cpcode=" + _callpositioncode, data: {} }
			});
		}
		//========================================================
		//========================================================
		/*문서에서 다른 게시판으로 이동하기 위한 메뉴 선택*/
		, act_movedoc_doc: function (_doc) {
			var _me = this, _rows = null, _unids = "", _viewname = "", _options = _doc.options, _el = _doc.element,
				_sel = "", _tboardname = "", _tboardpath = "", _tboardkey = "", _tboardform = "", _tboardlnbid = "", _tdbname = "", _tdblogpath = "", _tdbapplcode = "";
			var _DATA_HEADER = "bd_name`}db_path`}form_nm`}bd_id`}lnb_id`}db_title`}logdb_path`}appl_code";

			_unids = _doc.options.unid;
			var _buttons = [{
				"title": $fn.getCodeMsg("sbrd01.btn.confirm"),
				"click": function (_$dialog) {
					var _str_boardinfo, _o;

					_sel = $("select[name=CurrentBoard]", _$dialog.element).xval();
					if ((_sel == "root") || (_sel == "")) {
						$fn.alert({ msg: $fn.getCodeMsg("sbrd01.msg.alt2") });
						return;
					};

					_str_boardinfo = $("select[name=CurrentBoard] > option:selected", _$dialog.element).data("boardinfo");
					_o = $dwp.core.util.getObjStr(_DATA_HEADER, _str_boardinfo, "`}");

					var callback = function (data) {
						if (data.hasOwnProperty("result")) {
							if (data.result >= "200" && data.result < "300") {
								if (data.hasOwnProperty("cnt")) {
									_$dialog.close();
									$dwp.ui.alert({ msg: "게시물을 이동하였습니다!" })
										.done(function () {
											_doc.goview();
										});
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("sbrd01.msg.alt3") });
									return;
								}
							}
						}
					};

					//관리디비 기준처리
					var _url = $fn.getProxyUrl("/" + _options.movedoc_dbpath + "/wcmdstdpost?createdocument");
					var _jo_param = {
						actiontype: "move"
						, postdata: _unids
						, Arg1: _o.db_path
						, Arg2: _o.form_nm
						, Arg3: _o.bd_name
						, Arg4: _o.bd_id
						, Arg5: _o.lnb_id
						, Arg6: _o.db_title
						, Arg7: _o.logdb_path
						, Arg8: _o.appl_code
						, Arg9: _options.applcode
						, CurDBPath: _options.cdb
					};
					console.log("_jo_param::", _jo_param);
					$fn.cmdPost(_url, _jo_param, callback, "json");
				}
			},
			{
				"title": $fn.getCodeMsg("sbrd01.btn.cancel"),
				"click": function (_$dialog) {
					_$dialog.close();
				}
			}];

			console.log("_options::", _options);
			//var _callpositioncode= _options.applcode;    // 대상디비목록에서 컬렉션으로 구분하기 위한값
			var _callpositioncode = _options.param.lnbid + "^" + _options.param.boardid;    // 대상디비목록에서 컬렉션으로 구분하기 위한값
			$fn.dialog(_el, {
				modal: true,
				resizable: true,
				draggable: true,
				title: "문서이동",
				width: 500,
				height: 250,
				show: 'fade',			// effect
				hide: 'fade',			// effect
				//autoOpen: false,		//.dialog("open")호출시만 열림
				buttons: _buttons,

				/*content : {url : _options.cdb + "/wFrmSelFolder?ReadForm", data:{"view":"wvhashtag", "single":""}}*/
				//content : {url : _options.cdb + "/wFrmSelBoard?ReadForm", data:{}}
				refdata: { opt: _options },
				content: { url: "/" + _options.movedoc_dbpath + "/wFrmSelBoard2?ReadForm&cpcode=" + _callpositioncode, data: {} }
			});
		}
		//========================================================

	}


}($dwp.cns("app"), jQuery));









