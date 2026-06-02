/**
 * 전자결재 보조양식 - 출장신청서
 * $dwp.app.aprv_sub003
 */

(function (_$$, $) {
	_$$.aprv_sub003 = {

		subdoc: {
			SUBNAME: "sub003",
			_sum1: 0	//교통비 팝업 합계에 쓰는 변수
			, _ktxsum: 0	//출장비 최종 ktx 합계
			, _etcsum: 0	//출장비 기타지역 2번 이동시  _resioncount 출장비 넘기는 변수
			, _caretcsum: 0	//출장비 순수 자동차 값이 있을때 카운트
			, addarray: [] //교통비 팝업 같은날짜 3개이상 못쓰도록 하기위해 쓰는 배열
			, transarray: [] //ktx <-> 항공 체인지시 선택한 지역 유지하기위해 쓰는 배열
			, outplacearray: [] //양식 출장지역 세팅위해 쓰는 배열
			, outplace1array: [] //양식 출장지내역 세팅위해 쓰는 배열
			, fanaltabledata: [] //양식내 출장비 테이블 세팅 배열	
			, _carsum: 0//같은지역 이동시 자동차 합계
			, init: function ($doc) {
				var _me = _$$.aprv_sub003.subdoc, opt = $doc.options;
				var el = $doc.element;

				console.log("열기");


				if (opt.isnew) {
					//if($("[name=H_2] option:selected",$doc.element).val() == "2")
					$("[name=Subject]", $doc.element).val("출장신청서");
					//처음 열릴때 출장신청자 세팅
					var _org = $fn.getOrgUser($fn.getName($("input[name=From]", $doc.element).val()).ou);

					if ($dwp.core.lang.getCurMsg(_org.oinfo.username) == "조선영" || $dwp.core.lang.getCurMsg(_org.oinfo.username) == "조아람") {      //2023.09.05 조아람, 조선영 둘다로 변경    
						$("[name=ed_username]", $doc.element).val("김동건");
						$("[name=titlename]", $doc.element).val("원장");
						$("[name=Deptname]", $doc.element).val("임원");

					} else {
						$("[name=ed_username]", $doc.element).val($dwp.core.lang.getCurMsg(_org.oinfo.username));
						$("[name=titlename]", $doc.element).val($dwp.core.lang.getCurMsg(_org.oinfo.pos));
						$("[name=Deptname]", $doc.element).val($dwp.core.lang.getCurMsg(_org.oinfo.orgname));
					}

					_me._dateTerm($doc);
					$fn.alert({ msg: $fn.getCodeMsg("출장지별 숙박비 안내<br> 1. 서울, 세종, 제주: 10만원<br> 2. 광역시: 8만원<br>3. 기타지역: 7만원<br> 출장지역 선택후 숙박비를 확인하여 주시기 바랍니다.") });
				}

				if (opt.isedit) {
					//교통비 클릭시 처리 	btn_getdata	
					$("#btn_getdata", $doc.element).off("click").on("click", function () {		//교통비 버튼

						var vbak = $("input[name='H_13']").val();
						if (vbak.indexOf("-") > -1) {
							$fn.alert({ msg: $fn.getCodeMsg("출장일수가 올바르지 않습니다.") });
							$("input[name='H_13']").val("");
							$("input[name='H_14']").val("");
							return false;
						}

						if ($("[name=H_2] option:selected", $doc.element).val() == "2") {
							$fn.alert({ msg: $fn.getCodeMsg("해외출장비는 경영지원실에서 수기로 계산합니다.") });
							return false;
						}
						if ($("input[name='H_13']").val() == "") {
							$fn.alert({ msg: $fn.getCodeMsg("출장일수가 올바르지 않습니다.") });
							return false;
						}
						_me.Select_ERP_Data($doc);


					});
				}

				//복명서 작성 버튼 기안자만 원본문서에서만 보이게 하기 
				var kianjaid = opt.from;
				kianjaid = kianjaid.split("/");
				kianjaid = kianjaid[1].split("=");
				var _info1 = $dwp.cns("core.info");
				var ccuser = _info1.cuser.pinfo.empno;//사번

				console.log(ccuser);
				console.log(kianjaid[1]);
				console.log(opt.docstatus);
				//CN=관리자/OU=P00001/O=kiflt
				// 현재 접속자와 기안자가 같으면 버튼 복명서 작성버튼 노출
				if (opt.docstatus == "complete") {
					//console.log(opt.view)
					if (ccuser == kianjaid[1]) {
						//alert(opt.docstatus)
						if (opt.docstatus == "ing" || opt.docstatus == "draft") {

							$("#btn_getdata3", el).css("display", "none")
						}

					} else {

						if (opt.docstatus == "complete" || opt.docstatus == "ing") {
							$("#btn_getdata3", el).css("display", "none")
						}

					}
					if (opt.isrevdoc) { //수신문서이면 숨김
						$("#btn_getdata3", el).css("display", "none")
					}

				} else {
					$("#btn_getdata3", el).css("display", "none")
				}
				//출장복명서 작성 
				$("#btn_getdata3", $doc.element).on("click", function () {

					var _url = "";
					var _form = "Form007";
					var vorgname = _info1.cuser.pinfo.orgname;
					//alert($fn.getCurLangMsg(vorgname, ",", "ko") )
					vorgname = $fn.getCurLangMsg(vorgname, ",", "ko");

					_url = "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?openform";
					_url += "&FormCode=" + _form;
					_url += "&org_dbpath=" + opt.cdb;
					_url += "&org_docid=" + opt.unid;
					console.log(_url)
					$fn.loadPage({
						link: _url,
						linktype: "PAGE"
					});
				});

				//여비내역 테이블 시작

				var _newopt = $.extend({}, opt, { dtable: _$table });
				$doc.options = _newopt;
				var _$table = _me.initInputTable(opt, $doc, "");
				console.log("열기2");
				//출장신청자 선택
				$fn.orgsel($("[name='org11']", el), {
					isedit: opt.isedit,
					treetype: "0",
					seltype: "2",
					fld: "DspApprUsers",
					autoseletcomplete: function (event, ui, doc) {
						$("input[name='Deptname']").val($dwp.core.lang.getCurMsg(ui.item.value.orgname));
						$("input[name='titlename']").val($dwp.core.lang.getCurMsg(ui.item.value.pos));
						$("input[name='ed_username']").val($dwp.core.lang.getCurMsg(ui.item.value.username));
					},
					orgselectcomplete: function (dialog, rtndata, doc) {
						//사용자를 선택하지 않고 확인 버튼을 클릭하는 경우
						if (rtndata.list.length < 1) {
							return false;
						}
						$("input[name='Deptname']").val($dwp.core.lang.getCurMsg(rtndata.list[0].orgname));
						$("input[name='titlename']").val($dwp.core.lang.getCurMsg(rtndata.list[0].pos));
						$("input[name='ed_username']").val($dwp.core.lang.getCurMsg(rtndata.list[0].username));

					},
					count: 1,
					autodraw: false,
					isseltype: false

				});
				//출장직무대리 선택
				$fn.orgsel($("[name='org12']", el), {
					isedit: opt.isedit,
					treetype: "0",
					seltype: "2",
					fld: "DspApprUsers",
					autoseletcomplete: function (event, ui, doc) {
						$("input[name='Deptname_1']").val($dwp.core.lang.getCurMsg(ui.item.value.orgname));
						$("input[name='titlename_1']").val($dwp.core.lang.getCurMsg(ui.item.value.pos));
						$("input[name='ed_username_1']").val($dwp.core.lang.getCurMsg(ui.item.value.username));
					},
					orgselectcomplete: function (dialog, rtndata, doc) {
						//사용자를 선택하지 않고 확인 버튼을 클릭하는 경우
						if (rtndata.list.length < 1) {
							return false;
						}
						$("input[name='Deptname_1']").val($dwp.core.lang.getCurMsg(rtndata.list[0].orgname));
						$("input[name='titlename_1']").val($dwp.core.lang.getCurMsg(rtndata.list[0].pos));
						$("input[name='ed_username_1']").val($dwp.core.lang.getCurMsg(rtndata.list[0].username));

					},
					count: 1,
					autodraw: false,
					isseltype: false

				});

				//국내외 구분 체인지시 로직 
				$("select[name='H_2']", el).bind("change", function () { //국외
					//console.log($("select[name='H_2']",el).val());
					if ($("select[name='H_2']", el).val() == "2") {
						//국내외 구분 국외로 바꿀때 출장비 및 출장관련값 초기화
						var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.elelment);
						var _$trs = $("tbody>tr", _$table);
						if (_$trs.size() > 0) {
							$.each(_$trs, function (index, tr) {
								//alert(_$trs.size())
								var _$tr = $(this);
								//alert(_$tr.is("name"))
								//alert(_$tr.attr("name"))
								if (_$tr.attr("name") != "_template" && _$tr.attr("name") != "" && _$tr.attr("name") != "_ROW_TOTAL") {
									_$tr.remove();
								}
							});
						}
						$("[name='D3_1_1']", el).val("0");
						$("[name='D3_1_2']", el).val("0");
						$("[name='D3_1_3']", el).val("0");
						$("[name='D3_1_4']", el).val("0");
						$("[name='D3_1_5']", el).val("0");
						$("[name='D3_1_6']", el).val("0");
						$("[name='D3_1_7']", el).val("0");
						$("[name='D3_1_8']", el).val("0");
						$("[name='R_1']", el).val("");
						$("[name='R_2']", el).val("");
						$("[name='R_3']", el).val("");
						//$("[name='CalTripComplete']",el).val("1");						
					} else { // 국내
						//$("[name='CalTripComplete']",el).val("0");
					}

				});

				//출장 방문자 출장내용 기타사항 blur 시 작은따옴표 문자로 변경처리 
				$("[name='R_3']", el).bind("blur", function () { //출장지역
					var r_3 = $("[name='R_3']", el).val();
					r_3 = r_3.replaceAll("'", "‘");
					$("[name='R_3']", el).val(r_3);
				});
				$("[name='R_4']", el).bind("blur", function () { //출장방문처
					var r_3 = $("[name='R_4']", el).val();
					r_3 = r_3.replaceAll("'", "‘");
					$("[name='R_4']", el).val(r_3);
				});
				$("[name='R_5']", el).bind("blur", function () { //출장내용
					var r_3 = $("[name='R_5']", el).val();
					r_3 = r_3.replaceAll("'", "‘");
					$("[name='R_5']", el).val(r_3);
				});
				$("[name='R_6']", el).bind("blur", function () { //기타사항
					var r_3 = $("[name='R_6']", el).val();
					r_3 = r_3.replaceAll("'", "‘");
					$("[name='R_6']", el).val(r_3);
				});
				$("[name='R_2']", el).bind("blur", function () { //차감내역
					var r_3 = $("[name='R_2']", el).val();
					r_3 = r_3.replaceAll("'", "‘");
					$("[name='R_2']", el).val(r_3);
				});

				//읽기모드 일시 여비내역 테이블 숨기기 
				if (opt.isedit) {
					$("#subform011_body", $doc.element).show();
				} else {

					$("#subform011_body", $doc.element).hide();
				}

				//출장비 클릭시 팝업


				$("#btn_getdata1", $doc.element).off("click").on("click", function () {		//교통비 버튼
					_me.Select_money_Data($doc);
				});

				//계정과목 더블클릭시 
				$("[name='H_3']", el).on('dblclick', function () {
					var vvalue = "";
					var date = new Date();
					var year = date.getFullYear();
					var month = ("0" + (1 + date.getMonth())).slice(-2);
					var day = ("0" + date.getDate()).slice(-2);

					var _today = year + month + day;
					//console.log(_today)
					$fn.dialog(null, {
						title: $fn.getCodeMsg(''),
						width: 300,
						height: 250,
						docInstance: $doc,
						modal: true,
						hide: { effect: 'fade', duration: 300 },
						show: { effect: 'fade', duration: 300 },
						buttons: [{
							"title": "예",
							"css": "confirm",
							"click": function (_$dialog) {
								var vinfo = $dwp.cns("core.info");
								//console.log(vinfo.cuser.pinfo.empno)
								$fn.xAjax({
									url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
									method: 'POST',
									dataType: 'json',
									data: {
										sabun: vinfo.cuser.pinfo.empno,
										pSKtxCode: _today,
										actiontype: "projectyesan"
									},
									async: false,
									cache: false
								}).done(function (data) {
									console.log("처리", data.data[0].vValue);
									vvalue = data.data[0].vValue;


								}).fail(function (req, error) {
									console.log(req.responseText + '\n' + error);
								});

								_$dialog.close();

								//새로운 레이어 팝업 프로젝트 리스트 뛰움

								$fn.dialog(null, {
									title: $fn.getCodeMsg('프로젝트 현황'),
									width: 300,
									height: 500,
									docInstance: $doc,
									modal: true,
									hide: { effect: 'fade', duration: 300 },
									show: { effect: 'fade', duration: 300 },
									//,content : {url : "/" + _opt.appComCfg.DraftTemplateDBpath + "/wFrmView_Sel?ReadForm", data : {view : "wv02_created_des", single : $fn.getCurUser().pinfo.orgcode, count:15,iscategory:false}}
									//	content: {
									//		url:'/dwp/aprv/com/aprvstart.nsf/Form003ProjectNumpop2?ReadForm',
									//		data: {vvalue:vvalue}
									//	}
									content: { html: vvalue }

								});

							}
						}, {
							"title": "아니오",
							"css": "cancel",
							"click": function (_$dialog) {
								$fn.dialog(null, {
									title: $fn.getCodeMsg(''),
									width: 300,
									height: 250,
									docInstance: $doc,
									modal: true,
									hide: { effect: 'fade', duration: 300 },
									show: { effect: 'fade', duration: 300 },
									buttons: [{
										"title": "예",
										"css": "confirm",
										"click": function (_$dialog) {
											$("[name='H_3']", el).val("창업보육사업비");
											$("[name='H_4']", el).val("/일반운영비");
											$("#vyesanwon", el).text("");
											_$dialog.close();
										}
									}, {
										"title": "아니오",
										"css": "cancel",
										"click": function (_$dialog) {
											if ($("[name='H_2']", el).val() == '1') {
												$("[name='H_3']", el).val("기타운영비");
												$("[name='H_4']", el).val("/국내여비");
												$("#vyesanwon", el).text("");
											} else {
												$("[name='H_3']", el).val("기술진흥비");
												$("[name='H_4']", el).val("/해외기술협력");
												$("#vyesanwon", el).text("");
											}
											_$dialog.close();
										}
									}],
									//,content : {url : "/" + _opt.appComCfg.DraftTemplateDBpath + "/wFrmView_Sel?ReadForm", data : {view : "wv02_created_des", single : $fn.getCurUser().pinfo.orgcode, count:15,iscategory:false}}
									content: {
										url: '/dwp/aprv/com/aprvstart.nsf/Form003ProjectNumpop2?ReadForm',
										//data: {mcode: _opt.appCfg.FormAlias}
									}
								});
								_$dialog.close();
							}
						}],
						content: {
							url: '/dwp/aprv/com/aprvstart.nsf/Form003ProjectNumpop?ReadForm',

						}
					});


				}); // 계정과목 선택 끝

				//몇박몇일 계산
				var _$fromdate = $("input[name='H_11']");
				_$fromdate.bind("change", function () {
					_me._dateTerm($doc);
				});
				var _$todate = $("input[name='H_12']");
				_$todate.bind("change", function () {
					_me._dateTerm($doc);
				});
				//비정액 블러시 합계 계산
				for (var i = 1; i < 8; i++) {
					$("input[name='D2_1_" + i + "']").bind("blur", function () {

						var misum = parseInt($("input[name='D2_1_1']", $doc.element).val()) + parseInt($("input[name='D2_1_2']", $doc.element).val()) +
							parseInt($("input[name='D2_1_3']", $doc.element).val()) + parseInt($("input[name='D2_1_4']", $doc.element).val()) +
							parseInt($("input[name='D2_1_5']", $doc.element).val()) + parseInt($("input[name='D2_1_6']", $doc.element).val()) -
							parseInt($("input[name='D2_1_7']", $doc.element).val());
						$("input[name='D2_1_8']", $doc.element).val(misum);

						_me.cal_sum_ktx($doc.element);
						_me.cal_sum_air($doc.element);
						_me.cal_sum_car($doc.element);
						_me.cal_sum_sleep($doc.element);
						_me.cal_sum_eat($doc.element);
						_me.cal_sum_day($doc.element);
						_me.cal_sum_minor($doc.element);
						_me.cal_sum_allsum($doc.element);


					});
				}






				console.log("init 완료")

				/*
						pS_ADMIN_CODE=02 
						pS_ADMIN_NAME=부산광역시 
						pS_REGION_CODE=0019 
						pS_REGION_NAME=부산 
						E_ADMIN_CODE=01 
						E_ADMIN_NAME=서울특별시 

						E_REGION_CODE=0002 
						E_REGION_NAME=서울 
						pI_DATEID=20230315 
						pI_INSACODE=I00504 
						P_TRIPGUBUN=K 
						F00382
						150027창원
						,040010동대구,010002서울,080004광명,040041서대구,100006오송,
						060007대전,060008서대전,150011밀양,110012공주,080001행신,
						010003용산,110013논산,120014익산,110015계룡,099999춘천,
						080017수원,020019부산,140020포항,050022울산,120023정읍,
						150027창원,130025나주,130026목포,150028진주,150029마산,
						150030창원중앙,150031진영,120032전주,120033남원,130034구례구,
						130035순천,130036여천,130038곡성,169998제주,089997동두천,110005천안,
						110039아산,140009김천,140040구미,140021경주,130037여수,070024광주,

						,01서울특별시,02부산광역시,03인천광역시,04대구광역시,05울산광역시,06대전광역시,
						07광주광역시,08경기도,09강원도,10충청북도,11충청남도,12전라북도,13전라남도,14경상북도,15경상남도,


						,16제주특별자치도,01서울특별시,02부산광역시,08경기도,03인천광역시,
						,010002서울,020019부산,169998제주,089997동두천,

						리턴값 ktx air car 출장내용
				*/

				//dd=_me.GetBusinessTripMoney("02","부산광역시","0019","부산","08","경기도","9997","동두천","20230316","F00382","K"); 
				//dd=_me.GetBusinessTripMoney("14","경상북도","0020","포항","14","경상북도","0040","구미","20230316","F00382","K"); 
				//dd=_me.GetBusinessTripMoney("02","부산광역시","0019","부산","03","인천광역시","xxxx","인천","20230323","F00261","A"); 
				//dd=_me.GetKtxExpensebasic("0019", "0011", "20230315","")
				//alert(dd)
				//alert(dd[0]+"===="+dd[1]+"===="+dd[2]+"===="+dd[3])

				/*
				 pS_ADMIN_CODE=02 
				 pS_ADMIN_NAME=부산광역시 
				 pS_REGION_CODE=0019 
				 pS_REGION_NAME=부산 
				 E_ADMIN_CODE=01 
				 E_ADMIN_NAME=서울특별시 
				 E_REGION_CODE=0002 
				 E_REGION_NAME=서울 
				 pI_DATEID=20230315 
				 pI_INSACODE=F00261 
				 P_TRIPGUBUN=K 
				//var pE_REGION_CODE="0319"
				//alert(pE_REGION_CODE.substring(1,2))
				*/





			},
			/**
			 * 			 * [교통비 버튼]
			 * 
			 */
			Select_ERP_Data: function ($doc) {
				var _me = this, _html = [], _buttons = [], _options = $doc.options, _querydata = {};

				_html.push("<div class=\"Select_ERP_Data\">");
				_html.push("	<div class=\"dwp-section tiny-type\">");
				_html.push("		<div class=\"aligner\" >");
				_html.push("			<div class=\"left\" style=\"margin-top:5px\">");
				//_html.push("				<div class=\"dwp-inquiry\" style=\"vertical-align: middle\" data-xlang=\"LC_TEXT\" data-xlang-code=\"aprv_sub_095.title.013\"><!--검색 :--></div>");
				//_html.push("				<div class=\"dwp-input\" style=\"margin-right:5px; width:150px;\"><input name=Key1 type=text value=\"\"></div>");
				//_html.push("				<div class=\"dwp-btn btn_search\"><span>" + $fn.getCodeMsg("comm.title.view") + "</span></div>");	//조회				
				_html.push("						<span class=\"dwp-selectbox dwp-100 \" data-xlang=\"LC_CODE\" data-xlang-code=\"AP0001.GP0105\" data-xlang-src=\"CDB\" data-xlang-type=\"select\" data-xlang-name=\"TrnasferKind\" data-xlang-value=\"\" data-xlang-txt=\"\" />");
				_html.push("						<sapn class=\"dwp-selectbox dwp-150 \"><SELECT class=dwp-selectbox dwp-100 name=day ></SELECT></span>");
				_html.push("			</div>");
				_html.push("			<div class=\"right btn1 dwp-hidden\">");
				_html.push("				<div class=\"dwp-select btn_edit\"><span>" + $fn.getCodeMsg("comm.title.edit") + "</span></div>");		//수정
				_html.push("				<div class=\"dwp-btn btn_cancel\"><span>" + $fn.getCodeMsg("comm.btn.cancel") + "</span></div>");	//취소
				_html.push("			</div>");
				_html.push("			<div class=\"right btn2\">");
				_html.push("				<div class=\"dwp-btn btn_add\"><span>" + $fn.getCodeMsg("목적지추가") + "</span></div>");		//추가
				_html.push("				<div class=\"dwp-btn btn_del\"><span>" + $fn.getCodeMsg("다시선택") + "</span></div>");		//삭제
				_html.push("			</div>");
				_html.push("		</div>");
				_html.push("	</div>");
				_html.push("	<div class=\"dwp-table dwp-table-vertical form-type line-type\" data-top=xs>");
				_html.push("		<table class=\"SubFormTable\">");
				_html.push("			<colgroup>");
				_html.push("				<col width=110></col>");
				_html.push("				<col width=110></col>");
				_html.push("				<col width=110></col>");
				_html.push("				<col width=110></col>");
				//_html.push("				<col width=250></col>");
				//_html.push("				<col width=*></col>");
				_html.push("			</colgroup>");
				_html.push("			<thead>");
				_html.push("				<tr>");
				_html.push("					<th class=\"border-right\" colspan=2><div class=\"dwp-title dwp-center\">" + $fn.getCodeMsg("출발지") + "</div></th>");	//품목명
				_html.push("					<th class=\"border-right\" colspan=2><div class=\"dwp-title dwp-center\">" + $fn.getCodeMsg("목적지") + "</div></th>");	//품목코드
				//_html.push("					<th class=\"border-right\"></th>");	//단위
				//_html.push("					<th class=\"border-right\"></th>");	//수량
				//_html.push("					<th class=\"border-right\"><div class=\"dwp-title dwp-center\">" + $fn.getCodeMsg("aprv_sub_095.title.007") + "</div></th>");	//장비명
				//_html.push("					<th class=\"border-__right\"><div class=\"dwp-title dwp-center\">" + $fn.getCodeMsg("aprv_sub_095.title.008") + "</div></th>");	//비고
				_html.push("				</tr>");
				_html.push("			</thead>");
				_html.push("			<tbody>");
				_html.push("				<tr>");
				_html.push("				<td><SELECT disabled size=15 class=dwp-selectbox style=width:100%;font-size:13pt name=Sadmincode></SELECT></td>");
				_html.push("				<td><SELECT disabled size=15 class=dwp-selectbox style=width:100%;font-size:13pt name=Sregion></SELECT></td>");
				_html.push("				<td><div class=\"dwp-selctbox expended\" size=15 ><SELECT size=15 class=dwp-selectbox style=width:100%;font-size:13pt name=Eadmincode></SELECT></div></td>");
				_html.push("				<td><div class=\"dwp-selctbox expended\" size=15 ><SELECT size=15 class=dwp-selectbox style=width:100%;font-size:13pt name=Eregion></SELECT></div></td>");
				//_html.push("				<td><div class=\"dwp-selectbox expended\" data-xlang=\"LC_CODE\" data-xlang-type=\"select\" data-xlang-name=\"Sadmincode\" data-xlang-txt=\"\" /></td>");
				//_html.push("				<td><div class=\"dwp-selectbox expended\" data-xlang=\"LC_CODE\" data-xlang-type=\"select\" data-xlang-name=\"Sregion\" data-xlang-txt=\"\" /></td>");
				//_html.push("				<td><div class=\"dwp-selectbox expended\" data-xlang=\"LC_CODE\" data-xlang-type=\"select\" data-xlang-name=\"Eadmincode\" data-xlang-txt=\"\" /></td>");
				//_html.push("				<td><div class=\"dwp-selectbox expended\" data-xlang=\"LC_CODE\" data-xlang-type=\"select\" data-xlang-name=\"Eregion\" data-xlang-txt=\"\" /></td>");
				//_html.push("					<td ><div class=\"dwp-selctbox expended\"><selctbox name=Sadmincode type=text value=\"\" readOnly></div></td>");
				//_html.push("					<td ><div class=\"dwp-selctbox expended\"><selctbox name=Sregion type=text value=\"\" readOnly></div></td>");
				//_html.push("					<td ><div class=\"dwp-selctbox expended\"><selctbox name=Eadmincode type=text value=\"\"></div></td>");
				//_html.push("					<td ><div class=\"dwp-selctbox expended\"><selctbox name=Eregion type=text value=\"\" ></div></td>");
				//_html.push("					<td ><div class=\"dwp-input expended\"><input name=I_MC_CD type=text value=\"\"></div></td>");
				//_html.push("					<td ><div class=\"dwp-input expended\"><input name=I_UTEXT type=text value=\"\"></div></td>");
				_html.push("				</tr>");
				_html.push("			</tbody>");
				_html.push("		</table>");
				_html.push("	</div>");
				_html.push("	<div id=\"dlg_BodyData\" class=\"dwp-table dwp-table-vertical form-type line-type\" data-top=xs style=\"max-height:394px\">");
				_html.push("		<div class=\"dwp-center\" style=\"margin:20px 0px\">" + $fn.getCodeMsg("목적지 추가 버튼으로 추가하세요") + "</div>");
				_html.push("	</div>");
				_html.push("</div>");

				_buttons = [
					{
						"title": $fn.getCodeMsg("저장"),	//dialog 하단의 [확인] 버튼
						"click": function (obj) {
							var _dlg = obj.element, _json = [];
							var _opt = obj.options
							if ($("input[type=checkbox]", _dlg).length == 0) {
								$fn.alert({ msg: $fn.getCodeMsg("목적지 추가 버튼으로 목적지를 추가하세요.") });						//소모품 청구서를 등록하시려면 먼저 [추가] 버튼을 선택하십시요
								return false;
							}

							var _info1 = $dwp.cns("core.info");
							var _orgcode = _info1.cuser.pinfo.orgcode;
							var finalplace, okarr1;
							//console.log($("#dlg_BodyData").text().replace(/(\s*)/g, ""));
							//console.log($("#tablevalue").text());
							var okarr = $("#dlg_BodyData").text().replace(/(\s*)/g, ""); //모든공백 삭제 
							okarr = okarr.split("凸");

							//凸 ■ 020019부산,169998제주,089997동두천//_tmpArray.join("†"))
							//현재 접속자의 부서가 에코 피혁연구단이면 출발 동두천으로 세팅  A34500

							if (_orgcode == "B0000015") {
								finalplace = "동두천";
							} else {
								finalplace = "부산";
							}
							//저장시 최종 목적지 부산으로 처리 
							var tf = _me.AddDataForSave($doc, _dlg, finalplace);

							if (tf) { //저장지 트루면 진행



								//저장시 양식내 출장지역 값 넣기  _me.outplacearray 저장된 모든 값 넣기 							
								var finaloutplace = "";
								for (var i = 0; i < _me.outplacearray.length; i++) {
									if (i == 0) {
										finaloutplace = _me.outplacearray[i];
									} else {
										finaloutplace = finaloutplace + "," + _me.outplacearray[i];
									}

								}
								$("[name=R_3]", $doc.elelment).val(finaloutplace);


								//출장지내역 넣기
								finaloutplace = "";
								const result1 = {};
								console.log(_me.outplace1array);
								_me.outplace1array.forEach((x) => {
									result1[x] = (result1[x] || 0) + 1;
								});
								JSON.stringify(result1);

								//중복값 제거 
								var keys = Object.keys(result1); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다.
								for (var i = 0; i < keys.length; i++) {
									var key = keys[i];
									//console.log(key);
									if (i == 0) {
										finaloutplace = key;
									} else if (key.indexOf("-") > -1 && key != $("[name=day] option:selected", _dlg).val()) { // 원소가 날짜이고 팝업에 선택된 날짜와 다르면 엔터 넣기
										finaloutplace = finaloutplace + "\n" + key
									} else {
										finaloutplace = finaloutplace + " " + key
									}

									//console.log("key : " + key + ", value : " + result1[key])
								}

								$("[name=R_1]", $doc.elelment).val(finaloutplace);

								//항공이면 기타사항 '항공료 지급 요망' 텍스트 넣기 및 비고에 유류할증료 넣기	
								//†출장일자†항공†기차†자동차†숙박료†식비†일비†차감비†합계†비고 formdata 값넣기
								//1.출장일자 2.항공 3.기차 4.자동차 5.숙박료 6.식비 7. 일비 8.차감비 9.합계 10.비고 


								//var jsonInfo = JSON.stringify(_me.fanaltabledata);
								//console.log(_me.fanaltabledata);
								var ftabledata = _me.fanaltabledata;
								let ftabledata1;
								let ftabledate = [];

								const result2 = {};
								ftabledata.forEach((x, index, array) => {
									result2[x] = (result2[x] || 0) + 1;
									//console.log(index +"=="+x)
								});
								JSON.stringify(result2);


								console.log(result2)


								var key1;
								var _ktx = 0, _air = 0, _car = 0, _airO = 0, _dayc = 0, _eatc = 0, _sleep = 0, _godate;
								var _ktx1 = 0, _air1 = 0, _car1 = 0, _airO1 = 0, _godate1;
								var _ktx2 = 0, _air2 = 0, _car2 = 0, _airO2 = 0, _godate2;
								var _ktx3 = 0, _air3 = 0, _car3 = 0, _airO3 = 0, _godate3;
								var _ktx4 = 0, _air4 = 0, _car4 = 0, _airO4 = 0, _godate4;
								var _ktx5 = 0, _air5 = 0, _car5 = 0, _airO5 = 0, _godate5;
								var _ktx6 = 0, _air6 = 0, _car6 = 0, _airO6 = 0, _godate6;
								var firstdata, sconddata, thirddata, forthdata, fivedata, sixdata, sevendata;
								var _sleep1 = 0, _sleep2 = 0, _sleep3 = 0, _sleep4 = 0, _sleep5 = 0;
								//var keys = Object.entries(result2); 
								//var keys = Object.keys(result2); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다. entries
								var keys = ftabledata.reduceRight((acc, current) => {
									if (!acc.includes(current)) {
										acc.push(current);
									}
									return acc;
								}, []).reverse();

								//var keys = Object.keys(result2).sort().reverse(); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다.
								//†출장일자†항공†기차†자동차†숙박료†식비†일비†차감비†합계†비고
								for (var i = 0; i < keys.length; i++) {
									var key = keys[i];
									key1 = key.split("_");

									if ($("[name=H_14]", $doc.elelment).val() == "1") { // 무박 일때
										//console.log(key1[0].trim()  +" == "+  $("[name=day] option:selected",_dlg).text().trim()+"K")
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx = _ktx + parseInt(ktx1) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air = _air + parseInt(air) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car = _car + parseInt(car) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO = _airO + parseInt(airo) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc)
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc)
										}
										_godate = $("[name=day] option:eq(0)", _dlg).text().trim();
									} else if ($("[name=H_14]", $doc.elelment).val() == "2") { // 1박
										//console.log(key1[0].trim()  +" == "+  $("[name=day] option:selected",_dlg).text().trim()+"K")
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx = _ktx + parseInt(ktx1) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air = _air + parseInt(air) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car = _car + parseInt(car) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO = _airO + parseInt(airo) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc)
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc)
										}
										_godate = $("[name=day] option:eq(0)", _dlg).text().trim();
										//2일차
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx1 = _ktx1 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air1 = _air1 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car1 = _car1 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO1 = _airO1 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "S") { //숙박비
											/*
												숙박비 변경 2024.02
												if(key1[0].trim()  ==  $("[name=day] option:eq(1)",_dlg).text().trim()+"S"){ //숙박비
												option:eq(1) -> option:eq(0) 변경
											*/
											var sleep = key1[1].replace(/,/gi, "");
											//key1[0] 날짜
											//key1[1] 숙박료 
											_sleep = parseInt(sleep);
										}
										_godate1 = $("[name=day] option:eq(1)", _dlg).text().trim();
									} else if ($("[name=H_14]", $doc.elelment).val() == "3") { // 2박
										//console.log("3박"+key1[0].trim()  +" == "+  $("[name=day] option:selected",_dlg).text().trim()+"K")
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx = _ktx + parseInt(ktx1) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air = _air + parseInt(air) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car = _car + parseInt(car) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO = _airO + parseInt(airo) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc)
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc)
										}
										_godate = $("[name=day] option:eq(0)", _dlg).text().trim();
										//2일차
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx1 = _ktx1 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air1 = _air1 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car1 = _car1 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO1 = _airO1 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										if (key1[0] == $("[name=day] option:eq(0)", _dlg).text().trim() + "S") { //숙박비
											/*
												숙박비 변경 2024.02
												if(key1[0].trim()  ==  $("[name=day] option:eq(1)",_dlg).text().trim()+"S"){ //숙박비
												option:eq(1) -> option:eq(0) 변경
												_sleep1 추가후 행별로 대입
											*/
											var sleep = key1[1].replace(/,/gi, "");
											_sleep1 = parseInt(sleep);
										}
										_godate1 = $("[name=day] option:eq(1)", _dlg).text().trim();

										//3일차
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx2 = _ktx2 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air2 = _air2 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car2 = _car2 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO2 = _airO2 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "S") { //숙박비
											/*
												숙박비 변경 2024.02
												if(key1[0].trim()  ==  $("[name=day] option:eq(1)",_dlg).text().trim()+"S"){ //숙박비
												option:eq(2) -> option:eq(1) 변경
											*/
											var sleep = key1[1].replace(/,/gi, "");
											_sleep = parseInt(sleep);
										}
										_godate2 = $("[name=day] option:eq(2)", _dlg).text().trim();
									} else if ($("[name=H_14]", $doc.elelment).val() == "4") { // 3박
										//console.log(key1[0].trim()  +" == "+  $("[name=day] option:selected",_dlg).text().trim()+"K")
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx = _ktx + parseInt(ktx1) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air = _air + parseInt(air) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car = _car + parseInt(car) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO = _airO + parseInt(airo) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc)
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc)
										}
										_godate = $("[name=day] option:eq(0)", _dlg).text().trim();
										//2일차
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx1 = _ktx1 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air1 = _air1 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car1 = _car1 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO1 = _airO1 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02 _sleep -> _sleep1 변경 eq(1) -> eq(0)
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep1 = parseInt(sleep);
										}
										_godate1 = $("[name=day] option:eq(1)", _dlg).text().trim();

										//3일차
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx2 = _ktx2 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air2 = _air2 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car2 = _car2 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO2 = _airO2 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02 _sleep -> _sleep2 변경 eq(2)-> eq(1)
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep2 = parseInt(sleep);
										}
										_godate2 = $("[name=day] option:eq(2)", _dlg).text().trim();
										//4일차
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx3 = _ktx3 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air3 = _air3 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car3 = _car3 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO3 = _airO3 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02  eq(3)-> eq(2)
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep = parseInt(sleep);
										}
										_godate3 = $("[name=day] option:eq(3)", _dlg).text().trim();
									} else if ($("[name=H_14]", $doc.elelment).val() == "5") { // 4박
										//console.log(key1[0].trim()  +" == "+  $("[name=day] option:selected",_dlg).text().trim()+"K")
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx = _ktx + parseInt(ktx1) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air = _air + parseInt(air) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car = _car + parseInt(car) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO = _airO + parseInt(airo) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc)
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc)
										}
										_godate = $("[name=day] option:eq(0)", _dlg).text().trim();
										//2일차
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx1 = _ktx1 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air1 = _air1 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car1 = _car1 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO1 = _airO1 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02 수정
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep1 = parseInt(sleep);
										}
										_godate1 = $("[name=day] option:eq(1)", _dlg).text().trim();

										//3일차
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx2 = _ktx2 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air2 = _air2 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car2 = _car2 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO2 = _airO2 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02 수정
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep2 = parseInt(sleep);
										}
										_godate2 = $("[name=day] option:eq(2)", _dlg).text().trim();
										//4일차
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx3 = _ktx3 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air3 = _air3 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car3 = _car3 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO3 = _airO3 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02 수정
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep3 = parseInt(sleep);
										}
										_godate3 = $("[name=day] option:eq(3)", _dlg).text().trim();

										//5일차
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx4 = _ktx4 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air4 = _air4 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car4 = _car4 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO4 = _airO4 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02 수정
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep = parseInt(sleep);
										}
										_godate4 = $("[name=day] option:eq(4)", _dlg).text().trim();
									} else if ($("[name=H_14]", $doc.elelment).val() == "6") { // 5박
										//console.log(key1[0].trim()  +" == "+  $("[name=day] option:selected",_dlg).text().trim()+"K")
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx = _ktx + parseInt(ktx1) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air = _air + parseInt(air) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car = _car + parseInt(car) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO = _airO + parseInt(airo) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc)
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc)
										}
										_godate = $("[name=day] option:eq(0)", _dlg).text().trim();
										//2일차
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx1 = _ktx1 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air1 = _air1 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car1 = _car1 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO1 = _airO1 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep1 = parseInt(sleep);
										}
										_godate1 = $("[name=day] option:eq(1)", _dlg).text().trim();

										//3일차
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx2 = _ktx2 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air2 = _air2 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car2 = _car2 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO2 = _airO2 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep2 = parseInt(sleep);
										}
										_godate2 = $("[name=day] option:eq(2)", _dlg).text().trim();
										//4일차
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx3 = _ktx3 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air3 = _air3 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car3 = _car3 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO3 = _airO3 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep3 = parseInt(sleep);
										}
										_godate3 = $("[name=day] option:eq(3)", _dlg).text().trim();

										//5일차
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx4 = _ktx4 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air4 = _air4 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car4 = _car4 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO4 = _airO4 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep4 = parseInt(sleep);
										}
										_godate4 = $("[name=day] option:eq(4)", _dlg).text().trim();

										//6일차
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx5 = _ktx5 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air5 = _air5 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car5 = _car5 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO5 = _airO5 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep = parseInt(sleep);
										}
										_godate5 = $("[name=day] option:eq(5)", _dlg).text().trim();
									} else if ($("[name=H_14]", $doc.elelment).val() == "7") { // 6박
										//console.log(key1[0].trim()  +" == "+  $("[name=day] option:selected",_dlg).text().trim()+"K")
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx = _ktx + parseInt(ktx1) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air = _air + parseInt(air) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car = _car + parseInt(car) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO = _airO + parseInt(airo) * parseInt(result2[key])
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc)
										}
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc)
										}
										_godate = $("[name=day] option:eq(0)", _dlg).text().trim();
										//2일차
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx1 = _ktx1 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air1 = _air1 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car1 = _car1 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO1 = _airO1 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(0)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep1 = parseInt(sleep);
										}
										_godate1 = $("[name=day] option:eq(1)", _dlg).text().trim();

										//3일차
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx2 = _ktx2 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air2 = _air2 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car2 = _car2 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO2 = _airO2 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(1)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep2 = parseInt(sleep);
										}
										_godate2 = $("[name=day] option:eq(2)", _dlg).text().trim();
										//4일차
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx3 = _ktx3 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air3 = _air3 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car3 = _car3 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO3 = _airO3 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(2)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep3 = parseInt(sleep);
										}
										_godate3 = $("[name=day] option:eq(3)", _dlg).text().trim();

										//5일차
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx4 = _ktx4 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air4 = _air4 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car4 = _car4 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO4 = _airO4 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(3)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep4 = parseInt(sleep);
										}
										_godate4 = $("[name=day] option:eq(4)", _dlg).text().trim();

										//6일차
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx5 = _ktx5 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air5 = _air5 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car5 = _car5 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO5 = _airO5 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										//2024.02
										if (key1[0].trim() == $("[name=day] option:eq(4)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep5 = parseInt(sleep);
										}
										_godate5 = $("[name=day] option:eq(5)", _dlg).text().trim();

										//7일차
										if (key1[0].trim() == $("[name=day] option:eq(6)", _dlg).text().trim() + "K") { // KTX
											var ktx1 = key1[1].replace(/,/gi, "");
											_ktx6 = _ktx6 + parseInt(ktx1) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(6)", _dlg).text().trim() + "A") { //항공
											var air = key1[1].replace(/,/gi, "");
											_air6 = _air6 + parseInt(air) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(6)", _dlg).text().trim() + "C") {//자동차
											var car = key1[1].replace(/,/gi, "");
											_car6 = _car6 + parseInt(car) * parseInt(result2[key]);
										}
										if (key1[0].trim() == $("[name=day] option:eq(6)", _dlg).text().trim() + "O") { //항공 유류할증
											var airo = key1[1].replace(/,/gi, "");
											_airO6 = _airO6 + parseInt(airo) * parseInt(result2[key]);
										}
										// 더할 필요 없음 
										if (key1[0].trim() == $("[name=day] option:eq(6)", _dlg).text().trim() + "D") { //일비
											var dayc = key1[1].replace(/,/gi, "");
											_dayc = parseInt(dayc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(6)", _dlg).text().trim() + "E") { //식비
											var eatc = key1[1].replace(/,/gi, "");
											_eatc = parseInt(eatc);
										}
										if (key1[0].trim() == $("[name=day] option:eq(5)", _dlg).text().trim() + "S") { //숙박비
											var sleep = key1[1].replace(/,/gi, "");
											_sleep = parseInt(sleep);
										}
										_godate6 = $("[name=day] option:eq(6)", _dlg).text().trim();
									}


									console.log("key : " + key1[0] + " key1 : " + key1[1] + ", value : " + result2[key])
								}
								console.log(_airO)
								if (_airO != 0) {
									_airO = "유류할증료 " + _airO;
									$("[name=R_6]", $doc.elelment).val("항공료 지급 요망");
								} else {
									_airO = "";
								}
								if (_airO1 != 0) { _airO1 = "유류할증료 " + _airO1; $("[name=R_6]", $doc.elelment).val("항공료 지급 요망"); } else { _airO1 = ""; }
								if (_airO2 != 0) { _airO2 = "유류할증료 " + _airO2; $("[name=R_6]", $doc.elelment).val("항공료 지급 요망"); } else { _airO2 = ""; }
								if (_airO3 != 0) { _airO3 = "유류할증료 " + _airO3; $("[name=R_6]", $doc.elelment).val("항공료 지급 요망"); } else { _airO3 = ""; }
								if (_airO4 != 0) { _airO4 = "유류할증료 " + _airO4; $("[name=R_6]", $doc.elelment).val("항공료 지급 요망"); } else { _airO4 = ""; }
								if (_airO5 != 0) { _airO5 = "유류할증료 " + _airO5; $("[name=R_6]", $doc.elelment).val("항공료 지급 요망"); } else { _airO5 = ""; }
								if (_airO6 != 0) { _airO6 = "유류할증료 " + _airO6; $("[name=R_6]", $doc.elelment).val("항공료 지급 요망"); } else { _airO6 = ""; }

								if (_airO == "" & _air1 == "" & _air2 == "" & _air3 == "" & _air4 == "" & _air5 == "" & _air6 == "") {
									$("[name=R_6]", $doc.elelment).val("");
								}



								//행 합계 구하는 변수 선언
								var _supply_sum = 0;
								var _supply_sum01 = 0;
								var _supply_sum02 = 0;
								var _supply_sum03 = 0;
								var _supply_sum04 = 0;
								var _supply_sum05 = 0;
								var _supply_sum06 = 0;
								//†2023-04-06[목]†0†26400†0†0†25000†30000†0†81400†
								if ($("[name=H_14]", $doc.elelment).val() == "1") {

									_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc);
									firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
									//_me.cal_sum_lowsum1(_air,_ktx,_car,_eatc,_dayc,$doc.elelment);
								} else if ($("[name=H_14]", $doc.elelment).val() == "2") { //1박2일
									_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep);
									_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);

									if ($("[name=H_13]", $doc.elelment).val() == "0") {
										//무박 2일 일경우 숙박비 제거
										_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
									} else {
										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
									}

									sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;

								} else if ($("[name=H_14]", $doc.elelment).val() == "3") { // 2박 3일

									if (_sleep == "0") {
										_sleep = _sleep1
									}
									_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep1);
									_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep);
									_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);

									if ($("[name=H_13]", $doc.elelment).val() == "0") {
										//무박 2일 일경우 숙박비 제거
										_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
									} else if ($("[name=H_13]", $doc.elelment).val() == "1") {
										//무박 2일 일경우 숙박비 제거
										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
									} else {
										/*
													숙박비 변경 2024.02
													_sleep -> _sleep1 변경
										*/

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
									}


									//firstdata="†"+_godate+"†"+_air+"†"+_ktx+"†"+_car+"†"+_sleep+"†"+_eatc+"†"+_dayc+"†"+"0"+"†"+_supply_sum+"†"+_airO;
									//sconddata="†"+_godate1+"†"+_air1+"†"+_ktx1+"†"+_car1+"†"+_sleep+"†"+_eatc+"†"+_dayc+"†"+"0"+"†"+_supply_sum01+"†"+_airO1;
									thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
								} else if ($("[name=H_14]", $doc.elelment).val() == "4") { //3박 4일

									//2024.02 숙박료가 0 이면 중간에 미선택 한것으로 첫번재 숙박비 slee1를 넘어둠
									if (_sleep2 == "0") {
										_sleep2 = _sleep1
									}
									if (_sleep == "0") {
										_sleep = _sleep2
									}

									_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep1);
									_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep2);
									_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep);
									_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);



									if ($("[name=H_13]", $doc.elelment).val() == "0") {
										_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
									} else if ($("[name=H_13]", $doc.elelment).val() == "1") {
										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
									} else if ($("[name=H_13]", $doc.elelment).val() == "2") {
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;

									} else {

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;

									}


									forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
								} else if ($("[name=H_14]", $doc.elelment).val() == "5") { //4박 5일

									//2024.02 숙박료가 0 이면 중간에 미선택 한것으로 첫번재 숙박비 slee1를 넘어둠
									if (_sleep2 == "0") {
										_sleep2 = _sleep1
									}
									if (_sleep3 == "0") {
										_sleep3 = _sleep2
									}
									if (_sleep == "0") {
										_sleep = _sleep3
									}

									_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep1);
									_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep2);
									_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep3);
									_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep);
									_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);



									if ($("[name=H_13]", $doc.elelment).val() == "0") {
										_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;

									} else if ($("[name=H_13]", $doc.elelment).val() == "1") {

										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
									} else if ($("[name=H_13]", $doc.elelment).val() == "2") {
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
									} else if ($("[name=H_13]", $doc.elelment).val() == "3") {

										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
									} else {
										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + _sleep + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
									}

									fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
								} else if ($("[name=H_14]", $doc.elelment).val() == "6") { // 5박 6일

									//2024.02
									if (_sleep2 == "0") {
										_sleep2 = _sleep1
									}
									if (_sleep3 == "0") {
										_sleep3 = _sleep2
									}
									if (_sleep4 == "0") {
										_sleep4 = _sleep3
									}
									if (_sleep == "0") {
										_sleep = _sleep4
									}

									_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep1);
									_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep2);
									_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep3);
									_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep4);
									_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep);
									_supply_sum05 = parseInt(_ktx5) + parseInt(_air5) + parseInt(_car5) + parseInt(_eatc) + parseInt(_dayc);



									//박으로 숙박료 계산
									if ($("[name=H_13]", $doc.elelment).val() == "0") {
										_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
									} else if ($("[name=H_13]", $doc.elelment).val() == "1") {

										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
									} else if ($("[name=H_13]", $doc.elelment).val() == "2") {

										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
									} else if ($("[name=H_13]", $doc.elelment).val() == "3") {

										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);
										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
									} else if ($("[name=H_13]", $doc.elelment).val() == "4") {

										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + _sleep4 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
									} else {
										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + _sleep4 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + _sleep + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;

									}
									sixdata = "†" + _godate5 + "†" + _air5 + "†" + _ktx5 + "†" + _car5 + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum05 + "†" + _airO5;
								} else if ($("[name=H_14]", $doc.elelment).val() == "7") { //6박 7일 

									//2024.02
									if (_sleep2 == "0") {
										_sleep2 = _sleep1
									}
									if (_sleep3 == "0") {
										_sleep3 = _sleep2
									}
									if (_sleep4 == "0") {
										_sleep4 = _sleep3
									}
									if (_sleep5 == "0") {
										_sleep5 = _sleep4
									}
									if (_sleep == "0") {
										_sleep = _sleep5
									}
									_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep1);
									_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep2);
									_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep3);
									_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep4);
									_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep5);
									_supply_sum05 = parseInt(_ktx5) + parseInt(_air5) + parseInt(_car5) + parseInt(_eatc) + parseInt(_dayc) + parseInt(_sleep);
									_supply_sum06 = parseInt(_ktx6) + parseInt(_air6) + parseInt(_car6) + parseInt(_eatc) + parseInt(_dayc);



									//박으로 숙박료 계산
									if ($("[name=H_13]", $doc.elelment).val() == "0") {
										_supply_sum = parseInt(_ktx) + parseInt(_air) + parseInt(_car) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);
										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
										sixdata = "†" + _godate5 + "†" + _air5 + "†" + _ktx5 + "†" + _car5 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum05 + "†" + _airO5;
									} else if ($("[name=H_13]", $doc.elelment).val() == "1") {
										_supply_sum01 = parseInt(_ktx1) + parseInt(_air1) + parseInt(_car1) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum05 = parseInt(_ktx5) + parseInt(_air5) + parseInt(_car5) + parseInt(_eatc) + parseInt(_dayc);
										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
										sixdata = "†" + _godate5 + "†" + _air5 + "†" + _ktx5 + "†" + _car5 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum05 + "†" + _airO5;
									} else if ($("[name=H_13]", $doc.elelment).val() == "2") {
										_supply_sum02 = parseInt(_ktx2) + parseInt(_air2) + parseInt(_car2) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum05 = parseInt(_ktx5) + parseInt(_air5) + parseInt(_car5) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
										sixdata = "†" + _godate5 + "†" + _air5 + "†" + _ktx5 + "†" + _car5 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum05 + "†" + _airO5;
									} else if ($("[name=H_13]", $doc.elelment).val() == "3") {
										_supply_sum03 = parseInt(_ktx3) + parseInt(_air3) + parseInt(_car3) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum05 = parseInt(_ktx5) + parseInt(_air5) + parseInt(_car5) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
										sixdata = "†" + _godate5 + "†" + _air5 + "†" + _ktx5 + "†" + _car5 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum05 + "†" + _airO5;
									} else if ($("[name=H_13]", $doc.elelment).val() == "4") {
										_supply_sum04 = parseInt(_ktx4) + parseInt(_air4) + parseInt(_car4) + parseInt(_eatc) + parseInt(_dayc);
										_supply_sum05 = parseInt(_ktx5) + parseInt(_air5) + parseInt(_car5) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + _sleep4 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
										sixdata = "†" + _godate5 + "†" + _air5 + "†" + _ktx5 + "†" + _car5 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum05 + "†" + _airO5;
									} else if ($("[name=H_13]", $doc.elelment).val() == "5") {

										_supply_sum05 = parseInt(_ktx5) + parseInt(_air5) + parseInt(_car5) + parseInt(_eatc) + parseInt(_dayc);

										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + _sleep4 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + _sleep5 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
										sixdata = "†" + _godate5 + "†" + _air5 + "†" + _ktx5 + "†" + _car5 + "†" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum05 + "†" + _airO5;
									} else {
										firstdata = "†" + _godate + "†" + _air + "†" + _ktx + "†" + _car + "†" + _sleep1 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum + "†" + _airO;
										sconddata = "†" + _godate1 + "†" + _air1 + "†" + _ktx1 + "†" + _car1 + "†" + _sleep2 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum01 + "†" + _airO1;
										thirddata = "†" + _godate2 + "†" + _air2 + "†" + _ktx2 + "†" + _car2 + "†" + _sleep3 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum02 + "†" + _airO2;
										forthdata = "†" + _godate3 + "†" + _air3 + "†" + _ktx3 + "†" + _car3 + "†" + _sleep4 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum03 + "†" + _airO3;
										fivedata = "†" + _godate4 + "†" + _air4 + "†" + _ktx4 + "†" + _car4 + "†" + _sleep5 + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum04 + "†" + _airO4;
										sixdata = "†" + _godate5 + "†" + _air5 + "†" + _ktx5 + "†" + _car5 + "†" + _sleep + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum05 + "†" + _airO5;
									}

									sevendata = "†" + _godate6 + "†" + _air6 + "†" + _ktx6 + "†" + _car6 + "†" + "0" + "†" + _eatc + "†" + _dayc + "†" + "0" + "†" + _supply_sum06 + "†" + _airO6;
								}


								//†출장일자†항공†기차†자동차†숙박료†식비†일비†차감비†합계†비고
								console.log("ktx===" + _ktx);
								console.log("_air===" + _air);
								console.log("_car===" + _car);
								console.log("_airO===" + _airO);

								//넣기전에 테이블 행 데이터 삭제
								var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.elelment);
								var _$trs = $("tbody>tr", _$table);
								if (_$trs.size() > 0) {
									$.each(_$trs, function (index, tr) {
										//alert(_$trs.size())
										var _$tr = $(this);
										//alert(_$tr.is("name"))
										//alert(_$tr.attr("name"))
										if (_$tr.attr("name") != "_template" && _$tr.attr("name") != "" && _$tr.attr("name") != "_ROW_TOTAL") {
											_$tr.remove();
										}
									});
								}
								//최종투입 
								var totaldata;
								if ($("[name=H_14]", $doc.elelment).val() == "1") {
									totaldata = firstdata;
								} else if ($("[name=H_14]", $doc.elelment).val() == "2") {
									totaldata = firstdata + ";" + sconddata;
								} else if ($("[name=H_14]", $doc.elelment).val() == "3") {
									totaldata = firstdata + ";" + sconddata + ";" + thirddata;
								} else if ($("[name=H_14]", $doc.elelment).val() == "4") {
									totaldata = firstdata + ";" + sconddata + ";" + thirddata + ";" + forthdata;
								} else if ($("[name=H_14]", $doc.elelment).val() == "5") {
									totaldata = firstdata + ";" + sconddata + ";" + thirddata + ";" + forthdata + ";" + fivedata;
								} else if ($("[name=H_14]", $doc.elelment).val() == "6") {
									totaldata = firstdata + ";" + sconddata + ";" + thirddata + ";" + forthdata + ";" + fivedata + ";" + sixdata;
								} else if ($("[name=H_14]", $doc.elelment).val() == "7") {
									totaldata = firstdata + ";" + sconddata + ";" + thirddata + ";" + forthdata + ";" + fivedata + ";" + sixdata + ";" + sevendata;
								}

								_me.initInputTable(_opt, $doc, totaldata);

								obj.close();




								//출장비 테이블 열의 합계(항공,기차,자동차,숙박료,식비,일비,차감비,계,비고)

								_me.cal_sum_ktx($doc.element);
								_me.cal_sum_air($doc.element);
								_me.cal_sum_car($doc.element);
								_me.cal_sum_sleep($doc.element);
								_me.cal_sum_eat($doc.element);
								_me.cal_sum_day($doc.element);
								_me.cal_sum_minor($doc.element);
								_me.cal_sum_allsum($doc.element);


								//잔액예산비와 출장합계가 적을 경우 알림창 띄우기 
								if ($("[name=jan_money]", $doc.elelment).val() != "") {
									if ($("[name=jan_money]", $doc.elelment).val() != "0") {


										if (
											parseInt($("[name=jan_money]", $doc.elelment).val()) < parseInt($("[name=D3_1_8]", $doc.elelment).val())
											& $("[name=H_2] option:selected", $doc.element).val() == "1"
										) {
											$fn.alert({ msg: $fn.getCodeMsg("예산보다 출장비 총합이 많습니다.") });

										}
									}
								}


								$fn.alert({ msg: $fn.getCodeMsg("저장되었습니다.") });

							}




							//
							//$fn.confirm({ msg: $fn.getCodeMsg("저장하시겠습니까?") }).done(function () {	
							//	obj.close();
							//});
						}
					},
					{
						"title": $fn.getCodeMsg("comm.btn.cancel"),			//dialog 하단의 [취소] 버튼
						"click": function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("교통비"),		//교통비
					width: 900,
					height: 920,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: false,
					buttons: _buttons,
					closeOnEscape: false,
					open: function (_opt) {
						var _dlg = _opt.target, _tr = null;
						_me._sum1 = 0; //교통비 합계 초기화
						_me._ktxsum = 0;//출장비 최종 데이터 ktx합계
						_me._etcsum = 0;//출장비 기타지역 2번 이동시 넘기는 변수 초기화
						_me._caretcsum = 0;//자동차값만 더했을때 카운트 변수
						_me.addarray = [];//목적지 추가 버튼 날짜별 갯수 초기화 
						_me.transarray = [];// 항공 <-> ktx 버튼 변경시 selectbox 선택 유지위해 필요한 배열 초기화
						_me.outplacearray = [];//교통비 팝업 열릴대 출장지역 배열 초기화
						_me.outplace1array = [];//교통비 팝업 열릴대 출장지내역 배열 초기화
						_me.fanaltabledata = [];//출장비테이블 초기화
						_me._carsum = 0;//같은지역자동차값 초기화
						//alert($("[name=TrnasferKind]",_dlg).val())
						//출발지 세팅 
						var sadmincodearr = "", sadmincodearr1 = "", regionarr = "", regionarr1 = "";
						var sadmincodearrA = "", sadmincodearr1A = "", regionarrA = "", regionarr1A = "", regionA, admincodeA, region, admincode;
						$fn.xAjax({
							url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
							method: 'POST',
							dataType: 'json',
							data: {
								//pSKtxCode: I_DATEID,
								actiontype: "region"
							},
							async: false,
							cache: false
						}).done(function (data) {
							console.log("처리", data);
							//rtn = $dwp.core.util.exObjList(data, opt);
							region = data.region;
							admincode = data.admincode;
							regionA = data.regionA;
							admincodeA = data.admincodeA;
						}).fail(function (req, error) {
							console.log(req.responseText + '\n' + error);
						});
						//"01↕서울특별시↙02↕부산광역시↙03↕인천광역시↙04↕대구광역시↙05↕울산광역시↙06↕대전광역시↙07↕광주광역시↙08↕경기도↙09↕강원도↙10↕충청북도↙11↕충청남도↙12↕전라북도↙13↕전라남도↙14↕경상북도↙15↕경상남도"
						//"04↕0010↕동대구↙01↕0002↕서울↙08↕0004↕광명↙04↕0041↕서대구↙10↕0006↕오송↙06↕0007↕대전↙06↕0008↕서대전↙15↕0011↕밀양↙11↕0012↕공주↙08↕0001↕행신↙01↕0003↕용산↙11↕0013↕논산↙12↕0014↕익산↙11↕0015↕계룡↙09↕9999↕춘천↙08↕0017↕수원↙02↕0019↕부산↙14↕0020↕포항↙05↕0022↕울산↙12↕0023↕정읍↙15↕0027↕창원↙13↕0025↕나주↙13↕0026↕목포↙15↕0028↕진주↙15↕0029↕마산↙15↕0030↕창원중앙↙15↕0031↕진영↙12↕0032↕전주↙12↕0033↕남원↙13↕0034↕구례구↙13↕0035↕순천↙13↕0036↕여천↙13↕0038↕곡성↙16↕9998↕제주↙08↕9997↕동두천↙11↕0005↕천안↙11↕0039↕아산↙14↕0009↕김천↙14↕0040↕구미↙14↕0021↕경주↙13↕0037↕여수↙07↕0024↕광주"

						sadmincodearr = admincode.split("↙");
						regionarr = region.split("↙");
						sadmincodearrA = admincodeA.split("↙");
						regionarrA = regionA.split("↙");
						//출발지,도착지 시도 KTX 세팅					

						for (var i = 0; i < sadmincodearr.length; i++) {
							sadmincodearr1 = sadmincodearr[i].split("↕");
							var optionLabel = sadmincodearr1[1];
							var optionValue = sadmincodearr1[0];
							var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
							$('select[name=Sadmincode]', _dlg).append(option);

						}
						for (var i = 0; i < sadmincodearr.length; i++) {
							sadmincodearr1 = sadmincodearr[i].split("↕");
							var optionLabel = sadmincodearr1[1];
							var optionValue = sadmincodearr1[0];
							var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
							$('select[name=Eadmincode]', _dlg).append(option);

						}

						//처음띄울때 그냥 넣어줌
						var option = $("<option value=" + "0002" + ">" + "서울" + "</option>");
						$('select[name=Eregion]', _dlg).append(option);
						var option = $("<option value=" + "0003" + ">" + "용산" + "</option>");
						$('select[name=Eregion]', _dlg).append(option);
						$("[name=Eregion] option:eq(0)", _dlg).prop("selected", true);
						$("[name=Eadmincode] option:eq(0)", _dlg).prop("selected", true);

						//목적지 시도 클릭시 지역 넣기
						$("[name=Eadmincode]", _dlg).off("click").on("click", function () {
							//alert($("[name=TrnasferKind] option:selected",_dlg).val()+"여기?")
							$('select[name=Eregion]', _dlg).empty();

							for (var i = 0; i < regionarr.length; i++) {
								regionarr1 = regionarr[i].split("↕");
								//console.log($("[name=Eadmincode]", _dlg).val())
								if (regionarr1[0] == $("[name=Eadmincode]", _dlg).val()) {

									if ($("[name=TrnasferKind] option:selected", _dlg).val() == "A" && regionarr1[0] == "08") { //경기도 에어 이면
										$('select[name=Eregion]', _dlg).empty();
										var option = $("<option value=" + "9997" + ">" + "동두천" + "</option>");
										$('select[name=Eregion]', _dlg).append(option);

									} else if ($("[name=TrnasferKind] option:selected", _dlg).val() == "A" && regionarr1[0] == "01") { //서울 에어 이면
										$('select[name=Eregion]', _dlg).empty();
										var option = $("<option value=" + "0002" + ">" + "서울" + "</option>");
										$('select[name=Eregion]', _dlg).append(option);

									} else {
										var optionLabel = regionarr1[2];
										var optionValue = regionarr1[1];
										var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
										$('select[name=Eregion]', _dlg).append(option);

									}




								}

							}
							//경기도~경상남도 제일 아래 기타 지역 추가 인천추가
							if ($("[name=Eadmincode]", _dlg).val() >= "08" || $("[name=Eadmincode]", _dlg).val() == "03") {
								if ($("[name=Eadmincode]", _dlg).val() == "03") {
									var option = $("<option value=" + "XXXX" + ">" + "인천" + "</option>");
									$('select[name=Eregion]', _dlg).append(option);
								} else if ($("[name=Eadmincode]", _dlg).val() == "16") { //제주 기타 제외											
									$("[name=Eregion] option:eq(1)", _dlg).remove();
								} else {
									var option = $("<option value=" + "XXXX" + ">" + "기타" + "</option>");
									$('select[name=Eregion]', _dlg).append(option);
								}

							}
							$("[name=Eregion] option:eq(0)", _dlg).prop("selected", true);

						});



						//KTX 항공 체인지시 출발지 목적지 세팅

						var _info1 = $dwp.cns("core.info");
						var _orgcode = _info1.cuser.pinfo.orgcode;
						console.log("현재접속사용자부서코드" + _orgcode)

						$("select[name=TrnasferKind]", _dlg).off("change").on("change", function () {
							$('select[name=Sadmincode]', _dlg).empty();
							$('select[name=Eadmincode]', _dlg).empty();
							$('select[name=Eregion]', _dlg).empty();
							$('select[name=Sregion]', _dlg).empty();

							if ($("[name=TrnasferKind] option:selected", _dlg).val() == "K") {

								for (var i = 0; i < sadmincodearr.length; i++) {
									sadmincodearr1 = sadmincodearr[i].split("↕");
									var optionLabel = sadmincodearr1[1];
									var optionValue = sadmincodearr1[0];
									var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
									$('select[name=Sadmincode]', _dlg).append(option);

								}
								for (var i = 0; i < sadmincodearr.length; i++) {
									sadmincodearr1 = sadmincodearr[i].split("↕");
									var optionLabel = sadmincodearr1[1];
									var optionValue = sadmincodearr1[0];
									var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
									$('select[name=Eadmincode]', _dlg).append(option);

								}

								//현재 접속자의 부서가 에코 피혁연구단이면 출발 동두천으로 세팅 
								if (_orgcode == "B0000015") {
									//08↕9997↕동두천
									if (_me.transarray != "") { // 마지막 선택 지역이 공백이 아니면 마지막 선택 지역 으로 선택
										var lastselectktx = _me.transarray[[_me.transarray.length - 1]];
										lastselectktx = lastselectktx.split("_");

										$('[name=Sadmincode]', _dlg).val(lastselectktx[0]).prop("selected", true);
										var option = $("<option value=" + lastselectktx[1] + ">" + lastselectktx[2] + "</option>");
										$('select[name=Sregion]', _dlg).append(option);
										$('[name=Sregion]', _dlg).val(lastselectktx[1]).prop("selected", true);


									} else {
										$('[name=Sadmincode]', _dlg).val('08').prop("selected", true);
										var option = $("<option value=" + "9997" + ">" + "동두천" + "</option>");
										$('select[name=Sregion]', _dlg).append(option);
										$('[name=Sregion]', _dlg).val('9997').prop("selected", true);
									}

								} else {
									//부산 선택
									if (_me.transarray != "") {
										var lastselectktx = _me.transarray[[_me.transarray.length - 1]];
										lastselectktx = lastselectktx.split("_");

										$('[name=Sadmincode]', _dlg).val(lastselectktx[0]).prop("selected", true);
										var option = $("<option value=" + lastselectktx[1] + ">" + lastselectktx[2] + "</option>");
										$('select[name=Sregion]', _dlg).append(option);
										$('[name=Sregion]', _dlg).val(lastselectktx[1]).prop("selected", true);


									} else {
										$('[name=Sadmincode]', _dlg).val('02').prop("selected", true);
										var option = $("<option value=" + "0019" + ">" + "부산" + "</option>");
										$('select[name=Sregion]', _dlg).append(option);
										$('[name=Sregion]', _dlg).val('0019').prop("selected", true);

									}

								}
								//목적지 시도 클릭시 지역 넣기
								$("[name=Eadmincode]", _dlg).off("click").on("click", function () {
									$('select[name=Eregion]', _dlg).empty();

									for (var i = 0; i < regionarr.length; i++) {
										regionarr1 = regionarr[i].split("↕");
										//console.log($("[name=Eadmincode]", _dlg).val())
										if (regionarr1[0] == $("[name=Eadmincode]", _dlg).val()) {

											if ($("[name=TrnasferKind] option:selected", _dlg).val() == "A" && regionarr1[0] == "08") { //경기도 에어 이면 동두천만 추가
												$('select[name=Eregion]', _dlg).empty();
												var option = $("<option value=" + "9997" + ">" + "동두천" + "</option>");
												$('select[name=Eregion]', _dlg).append(option);

											} else {
												var optionLabel = regionarr1[2];
												var optionValue = regionarr1[1];
												var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
												$('select[name=Eregion]', _dlg).append(option);
											}
										}

									}

									//경기도~경상남도 제일 아래 기타 지역 추가 인천추가
									if ($("[name=Eadmincode]", _dlg).val() >= "08" || $("[name=Eadmincode]", _dlg).val() == "03") {
										if ($("[name=Eadmincode]", _dlg).val() == "03") {
											var option = $("<option value=" + "XXXX" + ">" + "인천" + "</option>");
											$('select[name=Eregion]', _dlg).append(option);
										} else if ($("[name=Eadmincode]", _dlg).val() == "16") { //제주 기타 제외											
											$("[name=Eregion] option:eq(1)", _dlg).remove();
										} else {
											var option = $("<option value=" + "XXXX" + ">" + "기타" + "</option>");
											$('select[name=Eregion]', _dlg).append(option);
										}

									}
									$("[name=Eregion] option:eq(0)", _dlg).prop("selected", true);

								});


							} else if ($("[name=TrnasferKind] option:selected", _dlg).val() == "A") {
								$('select[name=Sadmincode]', _dlg).empty();
								$('select[name=Eadmincode]', _dlg).empty();
								$('select[name=Sregion]', _dlg).empty();
								$('select[name=Eregion]', _dlg).empty();
								//alert($("[name=TrnasferKind] option:selected",_dlg).val())
								for (var i = 0; i < sadmincodearrA.length; i++) {
									sadmincodearr1A = sadmincodearrA[i].split("↕");
									var optionLabel = sadmincodearr1A[1];
									var optionValue = sadmincodearr1A[0];
									var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
									$('select[name=Sadmincode]', _dlg).append(option);

								}
								for (var i = 0; i < sadmincodearrA.length; i++) {
									sadmincodearr1A = sadmincodearrA[i].split("↕");
									var optionLabel = sadmincodearr1A[1];
									var optionValue = sadmincodearr1A[0];
									var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
									$('select[name=Eadmincode]', _dlg).append(option);

								}

								//현재 접속자의 부서가 에코 피혁연구단이면 출발 동두천으로 세팅 
								if (_orgcode == "B0000015") {
									//08↕9997↕동두천
									if (_me.transarray != "") {
										var lastselectktx = _me.transarray[[_me.transarray.length - 1]];
										lastselectktx = lastselectktx.split("_");

										$('[name=Sadmincode]', _dlg).val(lastselectktx[0]).prop("selected", true);
										var option = $("<option value=" + lastselectktx[1] + ">" + lastselectktx[2] + "</option>");
										$('select[name=Sregion]', _dlg).append(option);
										$('[name=Sregion]', _dlg).val(lastselectktx[1]).prop("selected", true);


									} else {
										$('[name=Sadmincode]', _dlg).val('08').prop("selected", true);
										var option = $("<option value=" + "9997" + ">" + "동두천" + "</option>");
										$('select[name=Sregion]', _dlg).append(option);
										$('[name=Sregion]', _dlg).val('9997').prop("selected", true);
									}


								} else {
									//부산 선택
									console.log("항공 변경시 지역 셀렉트" + _me.transarray)
									//console.log("----"+$("[name=Sadmincode] option:selected",_dlg).val())
									if (_me.transarray != "") {
										var lastselectktx = _me.transarray[[_me.transarray.length - 1]];
										lastselectktx = lastselectktx.split("_");

										$('[name=Sadmincode]', _dlg).val(lastselectktx[0]).prop("selected", true);
										var option = $("<option value=" + lastselectktx[1] + ">" + lastselectktx[2] + "</option>");
										$('select[name=Sregion]', _dlg).append(option);
										$('[name=Sregion]', _dlg).val(lastselectktx[1]).prop("selected", true);


									} else {
										$('[name=Sadmincode]', _dlg).val('02').prop("selected", true);
										var option = $("<option value=" + "0019" + ">" + "부산" + "</option>");
										$('select[name=Sregion]', _dlg).append(option);
										$('[name=Sregion]', _dlg).val('0019').prop("selected", true);
									}



								}



							}

						});
						$(document).ready(function () {
							console.log("ready!");
							if (_orgcode == "B0000015") {
								//08↕9997↕동두천
								$('[name=Sadmincode]', _dlg).val('08').prop("selected", true);
								var option = $("<option value=" + "9997" + ">" + "동두천" + "</option>");
								$('select[name=Sregion]', _dlg).append(option);
								$('[name=Sregion]', _dlg).val('9997').prop("selected", true);

							} else {
								//부산 선택
								$('[name=Sadmincode]', _dlg).val('02').prop("selected", true);
								var option = $("<option value=" + "0019" + ">" + "부산" + "</option>");
								$('select[name=Sregion]', _dlg).append(option);
								$('[name=Sregion]', _dlg).val('0019').prop("selected", true);
							}
						});




						//목적지추가
						$("div.btn_add", _dlg).off("click").on("click", function () {		//추가 버튼
							var tf = _me.AddData($doc, _opt);

							//리턴값 트루 일경우에만 진행 상세지역 셀렉트 방지
							if (tf) {
								_me.SelectSadmincode(regionarr, _opt);
							}




						});
						//목적지 삭제
						$("div.btn_del", _dlg).off("click").on("click", function () {		//삭제 버튼
							_me.DeleteData($doc, _opt);

							//출발지 초기화 
							var _info1 = $dwp.cns("core.info");
							var _orgcode = _info1.cuser.pinfo.orgcode;
							//현재 접속자의 부서가 에코 피혁연구단이면 출발 동두천으로 세팅 
							var Sregion = "";
							if (_orgcode == "B0000015") {
								//08↕9997↕동두천
								$('[name=Sadmincode]', _dlg).val('08').prop("selected", true);

								Sregion = '9997'
							} else {
								//부산 선택
								$('[name=Sadmincode]', _dlg).val('02').prop("selected", true);
								Sregion = '0019'
							}
							_me.SelectSadmincode01(regionarr, _opt, Sregion);
						});

						$("[name=Eregion]", _dlg).off("click").on("click", function () {		//목적지 버튼 기타 클릭시 입력폼 추가
							if ($("[name=Eregion]", _dlg).val() == "XXXX" && $("[name=Eregion] option:selected", _dlg).text() == "기타") {
								var inputString = prompt('기타지역을 입력하세요', '');
								if (inputString == null) {
									return false;
								} else {
									$("[name=Eregion] option:last", _dlg).text(inputString);
								}

							}
						});

						//팝업 날짜 세팅 및 요일 불러와서 팝업 상단 날짜 옵션값으로 넣기
						// H_11 시작일자 H_13 박 일수 
						var sdate = $('[name=H_11]', $doc.elelment).val();
						var edate = $('[name=H_12]', $doc.elelment).val();
						var bak = $('[name=H_13]', $doc.elelment).val();

						sdate = sdate.split(".");
						sdate = sdate.join("-");
						edate = edate.split(".");
						edate = edate.join("-");

						const week = ['일', '월', '화', '수', '목', '금', '토'];
						var re = _me.getDateRange(sdate, edate);

						var dayarray = [];
						for (var i = 0; i < re.length; i++) {
							console.log(re[i])
							var dayOfWeek = week[new Date(re[i]).getDay()];
							dayarray.push(re[i] + "[" + dayOfWeek + "]")
							var option = $("<option value=" + re[i] + ">" + dayarray[i] + "</option>");
							$('select[name=day]', _dlg).append(option);
						}
						//console.log(dayarray)


						$('[name=day]', _dlg).val(re[0]).prop("selected", true);

						//	_me.ShowBody($doc, _opt);	//기존 데이터 dialog 화면에 출력


						/*
							$("div.btn_search", _dlg).off("click").on("click", function () {	//조회 버튼
								_me.EditCancel($doc, _opt);
								_me.Search_ERP_Data($doc, _opt, $.trim($("[name=Key1]", _dlg).xval()));
							});
	
							
	
							$("div.btn_del", _dlg).off("click").on("click", function () {		//삭제 버튼
								_me.DeleteData($doc, _opt);
							});
							
							$("div.btn_edit", _dlg).off("click").on("click", function () {		//수정 버튼
								_me.EditData($doc, _opt);
							});
	
							$("div.btn_cancel", _dlg).off("click").on("click", function () {	//취소 버튼
								_me.EditCancel($doc, _opt);
							});
	
							$("input[name=Key1]", _dlg).off('keydown').on('keydown', function (e) {
								if (e.keyCode != 13) { return; }
								e.preventDefault();
								$("div.btn_search", _dlg).click();
							});
							
							$("input[name=I_ACC_CNT], input[name=I_MC_CD], input[name=I_UTEXT]", _dlg).off('keydown').on('keydown', function (e) {
								if (e.keyCode != 13) { return; }
								e.preventDefault();
								
								_tr = $("tr.dwp-bold", $("#tBody", _dlg));
								if (_tr.length == 1) {
									$("div.btn_edit", _dlg).click();
								} else {
									$("div.btn_add", _dlg).click();
								}
							});
							*/

					},
					content: { html: _html.join("") }
				});
			},
			/**
			 * 			 * [출장비버튼클릭시]
			 * 
			 */
			Select_money_Data: function ($doc) {
				var _me = this, _html = [], _buttons = [], _options = $doc.options, _querydata = {};

				//양식의 출장신청자 소속 및 이름  
				_html.push("<br><div align=right class=dwp-bold>출장기간 : " + $("[name=_ssday]", $doc.element).val() + " ~ " + $("[name=_ffday]", $doc.element).val()
					+ "    " + $("[name=dname]", $doc.element).val() + " : " + $("[name=uname]", $doc.element).val() + " " + $("[name=utitlename]", $doc.element).val() + "</div>"
				);
				_html.push($("#subform011_body", $doc.element).html());


				_buttons = [
					{
						"title": $fn.getCodeMsg("인쇄"),	//dialog 하단의 [확인] 버튼
						"click": function (obj) {
							var _dlg = obj.element, _json = [];
							var _opt = obj.options

							var div = document.getElementById("subform011_body");

							var win = null;
							//alert("@@")
							win = window.open();
							//alert("@1@")
							self.focus();
							win.document.open();

							win.document.write('<html><head><title>출장비내역</title><style>');
							//alert($fn.getPath("weblib"))

							win.document.write('.dwp-table{border-top:1px solid#cfcfcf;border-bottom:1px solid#cfcfcf}.dwp-table a.point-color{margin-left:5px}.dwp-table.form-type{border-right:1px solid#0c0c0c;border-left:1px solid#0c0c0c}.dwp-table.dwp-tbody.dwp-table-row:first-child.dwp-cell{border-top:1px solid#0c0c0c}.dwp-table.dwp-table-row{display:table;table-layout:fixed;width:100%}.dwp-table.dwp-table-row:first-child.dwp-cell{border-top:0}.dwp-table.dwp-table-row.dwp-cell{display:table-cell;padding:10px 5px;border-top:1px solid#0c0c0c;text-align:center;vertical-align:middle}.dwp-center {'
								+ 'text-align: center!important} .dwp-right {text-align: right!important}.dwp-table.dwp-form-table {	border: 1px solid #0c0c0c;	}.dwp-table thead tr+tr th {' +
								'border-top: 1px solid #0c0c0c;}.dwp-table thead tr th{padding:10px 0;background-color:#f5f5f5;color:#333;font-weight:700;font-size:14px}table{table-layout:fixed;border-collapse:collapse;border-spacing:0;empty-cells:show;width:100%}.dwp-input.expended{width:100%}.dwp-bold{font-weight:700}.dwp-table.dwp-form-table td{padding:4px;border-right:1px solid#0c0c0c;text-align:left;color:#000}' +
								'.dwp-table thead tr th{padding:10px 0;background-color:#f5f5f5;color:#333;font-weight:700;font-size:14px}.dwp-table tbody td{padding:10px 5px;border-top:1px solid#0c0c0c;text-align:center;white-space:normal;word-wrap:break-word}.dwp-table.dwp-form-table tbody th{border-top:1px solid#0c0c0c;background-color:#f5f5f5;color:#333;font-weight:700;font-size:14px}.dwp-table thead tr+tr th{border-top:1px solid#0c0c0c}.dwp-table.dwp-form-table th{padding:5px 5px;border-right:1px solid#0c0c0c}.dwp-table thead tr+tr th{border-top:1px solid#0c0c0c}th{display:table-cell;vertical-align:inherit;font-weight:bold;text-align:-internal-center}'
							);


							win.document.write('</style></head><body>');
							win.document.write(_html.join(""));
							win.document.write('</body></html>');
							win.document.close();
							//	alert("@!")
							win.print();
							//	alert("@!2")
							//	win.close();
							//	alert("@!3")
							//obj.close();
							//alert("@!4")

						}
					},
					{
						"title": $fn.getCodeMsg("comm.btn.cancel"),			//dialog 하단의 [취소] 버튼
						"click": function (obj) {
							obj.close();
						}
					}
				];

				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("출장비내역"),		//교통비
					width: 1300,
					height: 650,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: false,
					buttons: _buttons,
					closeOnEscape: false,
					open: function (_opt) {
						var _dlg = _opt.target, _tr = null;



					},
					content: { html: _html.join("") }
				});
			},

			//날짜구하기
			getDateRange: function (startDate, endDate) {
				const start = new Date(startDate);
				const end = new Date(endDate);

				const result = [];

				while (start <= end) {
					result.push(start.toISOString().split('T')[0]);
					start.setDate(start.getDate() + 1);
				}

				return result;

			}
			,
			//교통비 삭제
			DeleteData: function ($doc, _opt) {
				var _dlg = _opt.target, chkbox = null, tr = null;
				var _me = this;
				chkbox = $("input[type=checkbox]:checked", _dlg);
				if (chkbox.length == 0) {
					//$fn.alert({ msg: $fn.getCodeMsg("선택된 정보가 없습니다.") });		//선택된 정보가 없습니다
					//return;
				}

				$.each(chkbox, function (ii, chk) {
					$(chk).closest("tr").remove();
				});
				//alert($("#ssum").text())
				$("#ssum").text(0);
				_me._sum1 = 0; //교통비팝업 합계 초기화
				_me._ktxsum = 0;//출장비 테이블 최종 ktx합계
				_me.addarray = []; // 목적지추가 버튼 확인 초기화
				_me.transarray = [];// ktx 항공 선택시 selectbox 유지 배열 초기화
				_me.outplacearray = [];//출장지역 초기화
				_me.outplace1array = [];//출장지내역 초기화
				_me.fanaltabledata = [];//출장비테이블초기화
				_me._carsum = 0;//같은지역 자동차값 초기화
				_me._etcsum = 0;//출장비 기타지역 2번 이동시 넘기는 변수 초기화
				_me._caretcsum = 0;//자동차값만 더했을때 카운트 변수
				$("[name=day] option:eq(0)", _dlg).prop("selected", true); // 교통비팝업 날짜 첫번째 날짜 선택되도록 


				if ($("input[type=checkbox]", _dlg).length == 0) {
					$("#dlg_BodyData", _dlg).html("<div class=\"dwp-center\" style=\"margin:20px 0px\">" + $fn.getCodeMsg("선택된 정보가 없습니다.") + "</div>");
				}
			},
			/**
			 * 교통비 > [저장] 버튼 클릭
			 * @param {*} $doc 
			 * @param {*} _opt 
			 */
			AddDataForSave: function ($doc, _dlg, finalplace) {
				var _me = this, _html = [];

				if ($("[name=Eadmincode]", _dlg).xval() == "") {
					$fn.alert({ msg: $fn.getCodeMsg("목적지를 선택하세요") });		//품목을 선택하세요
					return;
				}

				var sadmincdoe = $('select[name=Sadmincode] option:selected').val();
				var sadminname = $('select[name=Sadmincode] option:selected').text();
				var Eadmincode = $('select[name=Eadmincode] option:selected').val();
				var Eadminname = $('select[name=Eadmincode] option:selected').text();
				var Sregion = $('select[name=Sregion] option:selected').val();
				var Sregionname = $('select[name=Sregion] option:selected').text();
				var Eregion = $('select[name=Eregion] option:selected').val();
				var Eregionname = $('select[name=Eregion] option:selected').text();
				var transkind = $("select[name=TrnasferKind] option:selected").val();
				var erpinsacode = $("[name=H_1]", $doc.elelment).val();
				var Godate = $("select[name=day] option:selected").val();
				var Godatetext = $("select[name=day] option:selected").text();
				console.log(Godate);
				if (typeof Godate == "undefined") {
					Godate = $("select[name=day] option:selected").val();
				};
				console.log(Godate);
				Godate = Godate.split("-");
				Godate = Godate[0] + Godate[1] + Godate[2];
				var returnvalue = false;
				var dayval = parseInt($("[name=H_14]", $doc.elelment).val()) - 1;

				var lastday = $('[name=day] option:eq(' + dayval + ')', _dlg).val();
				var lastdaytext = $('[name=day] option:eq(' + dayval + ')', _dlg).text();
				var sGodate = $("select[name=day] option:selected", _dlg).val();
				if (typeof lastday == "undefined") {
					var lastday = $('[name=day] option:eq(' + dayval + ')').val();
					var lastdaytext = $('[name=day] option:eq(' + dayval + ')').text();
					var sGodate = $("select[name=day] option:selected").val();
					var Eregionname = $('select[name=Eregion] option:selected').text();
				};

				console.log(finalplace + "  Eregionname" + Eregionname);
				console.log(lastday + "  lastday" + sGodate);
				if (finalplace != Eregionname && $("[name=H_14]", $doc.elelment).val() == "1") { //박이 0일때는 바로 최종목적지 띄우기 

					$fn.alert({ msg: $fn.getCodeMsg("최종목적지 " + finalplace + "을 선택하세요") });
					return returnvalue;


				} else if (finalplace != Eregionname && $("[name=H_14]", $doc.elelment).val() > "1" && lastday != sGodate) {
					//1박 이상일때는 출장일자가 제일 마지막 날짜의 최종목적지 클릭을 유도 한다.;
					$fn.alert({ msg: $fn.getCodeMsg(lastdaytext + "선택 후 최종목적지 " + finalplace + "을 선택하세요") });
					return returnvalue;
				} else if (finalplace != Eregionname && $("[name=H_14]", $doc.elelment).val() > "1") {
					//1박 이상일때는 출장일자가 제일 마지막 날짜의 최종목적지 클릭을 유도 한다.;
					$fn.alert({ msg: $fn.getCodeMsg("최종목적지 " + finalplace + "을 선택하세요") });
					return returnvalue;
				} else if ($("[name=H_14]", $doc.elelment).val() > "1" && lastday != sGodate) {
					//1박 이상일때는 출장일자가 제일 마지막 날짜의 최종목적지 클릭을 유도 한다.;
					$fn.alert({ msg: $fn.getCodeMsg(lastdaytext + "선택 후 최종목적지 " + finalplace + "을 선택하세요") });
					return returnvalue;
				} else if (finalplace == sadminname) {
					//교통비 팝업 목적지와 최종출발지가 같다면 바로 끝
					return true;
				}

				//기타지역일 경우 리전카운트 플러스
				if (sadmincdoe == Eadmincode && Sregion == Eregion) {
					console.log("출발지목적지 마지막 저장시");

					var vflag;


				} else {
					console.log(_me.outplacearray);
					if (Eregion == "XXXX") {

						_me._etcsum = _me._etcsum + 1
					} else if (_me._caretcsum > 0) { // 자동차 값만 있을때 리전카운트 +1
						_me._etcsum = _me._etcsum + 1
					}



				}

				console.log("리전카운트======" + _me._etcsum)



				var _info1 = $dwp.cns("core.info");
				var _orgcode = _info1.cuser.pinfo.orgcode;
				if (_orgcode == "B0000015") {
					//동두천
					//출발지역코드와 최종도착지역코드가 같고 저장버튼이 눌리면 요금계산 제외
					if (Sregion == "9997" && Eregion == "9997") { 	//동두천

					} else {
						var fee = _me.GetBusinessTripMoney(sadmincdoe, sadminname, Sregion, Sregionname, "08", "경기도", "9997", "동두천", Godate, erpinsacode, transkind, _me._etcsum);
					}

				} else {
					//부산
					if (Sregion == "0019" && Eregion == "0019") {

					} else {
						var fee = _me.GetBusinessTripMoney(sadmincdoe, sadminname, Sregion, Sregionname, "02", "부산광역시", "0019", "부산", Godate, erpinsacode, transkind, _me._etcsum);
					}

				}



				//출장지내역 저장
				if (_orgcode == "B0000015") {
					if (Sregion == "9997" && Eregion == "9997") { 	//동두천



					} else {
						_me.outplace1array.push(Godatetext);
						_me.outplace1array.push(fee[3]);
						//자동차값 더하기 
						if (fee[2].replace(",", "") == "10000") { //만원이면 더하기
							_me._carsum = _me._carsum + parseInt(fee[2].replace(",", ""));
						}else if (fee[2].replace(",", "") == "20000") { //만원이면 더하기
							_me._carsum = parseInt(fee[2].replace(",", ""));
						}
					}
				} else {
					if (Sregion == "0019" && Eregion == "0019") {

					} else {
						_me.outplace1array.push(Godatetext);
						_me.outplace1array.push(fee[3]);
						//자동차값 더하기 
						if (fee[2].replace(",", "") == "10000") { //만원이면 더하기
							_me._carsum = _me._carsum + parseInt(fee[2].replace(",", ""));
						}else if (fee[2].replace(",", "") == "20000") { //만원이면 더하기
							_me._carsum = parseInt(fee[2].replace(",", ""));
						}
					}
				}





				//출발지역코드와 최종도착지역코드가 같고 저장버튼이 눌리면 맨지막은 최종도착지므로 출장지역에서 제외
				//0019 부산 9997 동두천
				if (_orgcode == "B0000015") {
					if (Sregion == "9997" && Eregion == "9997") { 	//동두천
						_me.outplacearray.splice(_me.outplacearray.length - 1);
					}
				} else {
					if (Sregion == "0019" && Eregion == "0019") {
						_me.outplacearray.splice(_me.outplacearray.length - 1);
					}
				}

				//숙박비,식비,일비,유류할증료,출장지역 들어갈 시도 쿼리조회
				var sleepcost, daycost, eatcost, oilcost, adminname;
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pI_INSACODE: erpinsacode,
						pDateid: Godate,
						actiontype: "cost"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					sleepcost = data.sleepcost;
					daycost = data.daycost;
					eatcost = data.eatcost;
					oilcost = data.oilcost;
					adminname = data.adminname;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("sleepcost" + sleepcost);
				console.log("daycost" + daycost);
				console.log("eatcost" + eatcost);
				console.log("oilcost" + oilcost);

				//항공일때 유류할증료 추가
				var voilcost = "";
				var oilcost2 = 0;
				if (transkind == "A") {
					oilcost2 = oilcost2 + parseInt(oilcost);
					voilcost = oilcost2;
				} else {
					voilcost = "0";
				}

				//출장비테이블 만들 배열에 추가 
				//†출장일자†항공†기차†자동차†숙박료†식비†일비†차감비†합계†비고	

				//기타지역 일때 2만원만??
				//같은도에서 기타 -> ktx역으로 이동할때 만원 만 빼기
				//(1) 기차와 자동차 값이 둘다 있는경우 (목적지가 기차+자동차(10000)찍힐 때)

				//console.log("KTX======"+fee[0]);
				//console.log("자동차======"+fee[2]);
				console.log(sadmincdoe + " " + Eadmincode + " " + Eregion + " " + Sregion);

				/*숙박비 변경 2024.02 쿼리 직급별 조회 하다가 아래 조건으로 변경 
					임원 : 150,000
					서울,세종(특별시) : 100,000 
					광역시 : 80,000
					기타 : 70,000
			*/
				var _info1 = $dwp.cns("core.info");
				var _cposcode = _info1.cuser.pinfo.pos; // 현재 접속자 직위 코드

				if (_cposcode == "100" || $("[name=titlename]").val() == "원장") { // 원장 이면 무조건 15만원
					sleepcost = "150000"
				} else if (Eadminname.indexOf("특별") > -1 || Eregionname.indexOf("세종") > -1) {
					sleepcost = "100000"
				} else if (Eadminname.indexOf("광역시") > -1) {
					sleepcost = "80000"
				} else {
					sleepcost = "70000"
				}


				//교통비 팝업 합계처리
				var _sum;
				if (sadmincdoe == Eadmincode && Sregion == Eregion) {
					//목적지 저장 클릭후 저장시 출발지와 도착지가 같은 상태에서 저장시 유류할증료 더해지는것을 방지 
				} else {
					_me.fanaltabledata.push(Godatetext + "_"); //출장일자
					_me.fanaltabledata.push(Godatetext + "A_" + fee[1]); //항공 
					_me.fanaltabledata.push(Godatetext + "K_" + fee[0]); //ktx 
					_me.fanaltabledata.push(Godatetext + "C_" + fee[2]); //자동차
					_me.fanaltabledata.push(Godatetext + "S_" + sleepcost); //숙박료
					_me.fanaltabledata.push(Godatetext + "E_" + eatcost); //식비
					_me.fanaltabledata.push(Godatetext + "D_" + daycost); //일비	
					_me.fanaltabledata.push(Godatetext + "O_" + voilcost); //비고 항공


					_sum = _me.addSum(fee[0], fee[1], fee[2]);

				}

				_sum = _sum + ""







				//교통비 팝업 행추가
				if ($("table", $("#dlg_BodyData", _dlg)).length == 0) {
					_html.push("<table class=\"\">");
					_html.push("	<colgroup>");
					_html.push("		<col width=100></col>");
					_html.push("		<col width=100></col>");
					_html.push("		<col width=100></col>");
					_html.push("		<col width=100></col>");
					_html.push("	</colgroup>");
					_html.push("		<th class=dwp-center>날짜</th>");
					_html.push("		<th class=dwp-center>출발지</th>");
					_html.push("		<th class=dwp-center>목적지</th>");
					_html.push("		<th class=dwp-center>금액</th>");
					_html.push("	<tbody id=\"tBody\"></tbody>");
					_html.push("		<td class='dwp-center dwp-bold' colspan='3'>합계</td><td class=dwp-center><div id=ssum class=dwp-bold></div></td>");
					_html.push("</table>");
					$("#dlg_BodyData", _dlg).html(_html.join(""));
					_html = [];

				}
				//input[type=checkbox]:checked
				_html.push("<tr id=tablevalue>");
				_html.push("	<td data-idx=\"\" class=dwp-none><div class=\"dwp-checkbox dwp-none\"><label><input type=\"checkbox\" checked><span></span></label></div></td>");
				_html.push("	<td data-fld=tday class=dwp-center>" + $("[name=day] option:selected", _dlg).text() + "</td>");
				_html.push("	<td class=\"dwp-cursor dwp-orange col_nm dwp-center\" data-fld=Sregion>" + $('select[name=Sregion] option:selected', _dlg).text() + "</td>");
				_html.push("	<td data-fld=tEregion class=dwp-center>" + $("[name=Eregion] option:selected", _dlg).text() + "</td>");
				_html.push("	<td data-fld=fee class=dwp-center>" + _sum.toComma() + "</td>");
				_html.push("	<td data-fld=day class=dwp-none>■" + $("[name=day] option:selected", _dlg).text() + "■</td>");//날짜	
				_html.push("	<td class=dwp-none>" + $('select[name=Sregion] option:selected', _dlg).text() + "■</td>"); //출발
				_html.push("	<td class=dwp-none>" + $("[name=Eregion] option:selected", _dlg).text() + "■</td>"); //도착
				//_html.push("	<td data-fld=ktx class=dwp-none>" + fee[0]+ "■</td>");	 //ktx
				//_html.push("	<td data-fld=air class=dwp-none>" + fee[1]+ "■</td>");	//air
				//_html.push("	<td data-fld=car class=dwp-none>" + fee[2]+ "■</td>");	//car				
				//_html.push("	<td data-fld=expain class=dwp-none>" + fee[3]+ "■</td>"); // 설명	
				_html.push("	<td data-fld=vsum class=dwp-none>" + _sum.toComma() + "凸</td>");	//총합
				_html.push("</tr>");


				_tr = $(_html.join(""));
				//교통비 팝업 합계처리
				_sum = _sum + "";
				_sum = _sum.replace(/,/gi, "");
				_sum = parseInt(_sum);
				_me._sum1 = _me._sum1 + ""
				_me._sum1 = _me._sum1.replace(/,/gi, "");
				_me._sum1 = parseInt(_me._sum1);
				_me._sum1 = _me._sum1 + _sum;

				_tr.appendTo($("#tBody", $("#dlg_BodyData", _dlg)));
				_me._sum1 = _me._sum1 + ""
				$("#ssum").text(_me._sum1.toComma());
				//_sum1=0;


				returnvalue = true;

				return returnvalue;

			},
			/**
			 * 교통비 > [목적지추가] 버튼 클릭
			 * @param {*} $doc 
			 * @param {*} _opt 
			 */
			AddData: function ($doc, _opt) {
				var _me = this, _dlg = _opt.target, _html = [];

				if ($("[name=Eadmincode]", _dlg).xval() == "") {
					$fn.alert({ msg: $fn.getCodeMsg("목적지를 선택하세요") });		//품목을 선택하세요
					return;
				}


				var sadmincdoe = $('select[name=Sadmincode] option:selected', _dlg).val();
				var sadminname = $('select[name=Sadmincode] option:selected', _dlg).text();
				var Eadmincode = $('select[name=Eadmincode] option:selected', _dlg).val();
				var Eadminname = $('select[name=Eadmincode] option:selected', _dlg).text();
				var Sregion = $('select[name=Sregion] option:selected', _dlg).val();
				var Sregionname = $('select[name=Sregion] option:selected', _dlg).text();
				var Eregion = $('select[name=Eregion] option:selected', _dlg).val();
				var Eregionname = $('select[name=Eregion] option:selected', _dlg).text();
				var transkind = $("select[name=TrnasferKind] option:selected", _dlg).val();
				var erpinsacode = $("[name=H_1]", $doc.elelment).val();
				var Godate = $("select[name=day] option:selected", _dlg).val();
				var Godatetext = $("select[name=day] option:selected", _dlg).text();
				Godate = Godate.split("-");
				Godate = Godate[0] + Godate[1] + Godate[2];
				var dayval = parseInt($("[name=H_14]", $doc.elelment).val()) - 1;
				var lastday = $('[name=day] option:eq(' + dayval + ')', _dlg).val();
				var lastdaytext = $('[name=day] option:eq(' + dayval + ')', _dlg).text();
				var sGodate = $("select[name=day] option:selected", _dlg).val();

				var returnvalue = false;
				console.log("출장일자" + Godate);
				var _info1 = $dwp.cns("core.info");
				var _orgcode = _info1.cuser.pinfo.orgcode;

				if (_orgcode == "B0000015") {
					finalplace = "동두천"
				} else {
					finalplace = "부산"
				}

				if (sadmincdoe == Eadmincode && Sregionname == Eregionname) {
					$fn.alert({ msg: $fn.getCodeMsg("출발지와 목적지가 같습니다.") });
					return returnvalue;
				}
				if (erpinsacode == "") {
					$fn.alert({ msg: $fn.getCodeMsg("ERP 인사코드가 없습니다. 관리자에게 문의하세요.") });
					return returnvalue;
				}
				if (transkind == "A") {
					if (sadminname == "경기도" && Eadminname == "경기도" || sadminname == "경기도" && Eadminname == "인천광역시" || sadminname == "경기도" && Eadminname == "서울특별시"
						|| sadminname == "서울특별시" && Eadminname == "경기도" || sadminname == "서울특별시" && Eadminname == "인천광역시"
						|| sadminname == "인천광역시" && Eadminname == "서울특별시" || sadminname == "인천광역시" && Eadminname == "경기도") {
						//alert("항공으로 이용할 수 없습니다.");
						$fn.alert({ msg: $fn.getCodeMsg("항공으로 이용할 수 없습니다.") });
						return returnvalue;
					}
				}



				//1박2일 이상일때 첫번째 날짜에서 최종목적지를 목적지추가로 추가하지 못하게끔 추가 마지막 날짜에서 추가되어야 함
				if (Eregionname == finalplace && $("[name=H_14]", $doc.elelment).val() > "1" && lastday != sGodate) {
					$fn.alert({ msg: $fn.getCodeMsg(lastdaytext + " 최종목적지를 추가하세요.") });
					return returnvalue;
				}



				//교통비 팝업 날짜 배열추가[목적지추가시]
				_me.addarray.push($("[name=day] option:selected", _dlg).text());
				console.log(_me.addarray.length)
				console.log(_me.addarray);

				const result = {};
				_me.addarray.forEach((x) => {
					result[x] = (result[x] || 0) + 1;
				});
				JSON.stringify(result);

				//날짜당 3개 이상 선택 안되도록 처리 day
				var keys = Object.keys(result); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다.
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];

					//날짜 갯수가 3개 이상 이고 팝업에 선택된 날짜와 배열의 날짜가 같을때 발동
					if (result[key] > 3 && $("[name=day] option:selected", _dlg).text() == key) {
						$fn.alert({ msg: $fn.getCodeMsg(key + "요일 일정은 더 이상 추가 할수 없습니다.") });
						//$('[name=Sregion]',_dlg).val(Sregion).prop("selected",true);		
						return returnvalue;
					}
					console.log("key : " + key + ", value : " + result[key])
				}

				//항공 ktx 변경시 선택한 값 유지 위해 필요
				_me.transarray.push(Eadmincode + "_" + Eregion + "_" + Eregionname);
				console.log(_me.transarray[[_me.transarray.length - 1]]);


				//기타지역일 경우 리전카운트 플러스
				var _vetcsum1 = "0"

				if (Eregion == "XXXX") { // 리전카운트 1 축라
					//if(Eregion == "XXXX" && fee[0] != "0"){ // ktx =0 이면 리전카운트 -1
					console.log("리전카운트 플러스");
					_me._etcsum = _me._etcsum + 1

				}
				console.log("제일마지막==========" + Eregionname)
				if (Eregionname == "부산" || Eregionname == "동두천") {
					if (_me._caretcsum > 0) { // 자동차 값만 있을때 리전카운트 +1
						_me._etcsum = _me._etcsum + 1
					}
				}

				console.log("리전카운트=========" + _me._etcsum)



				//출장비 호출
				var fee = _me.GetBusinessTripMoney(sadmincdoe, sadminname, Sregion, Sregionname, Eadmincode, Eadminname, Eregion, Eregionname, Godate, erpinsacode, transkind, _me._etcsum);

				//자동차값 더하기 
				console.log("자동차비============" + fee[2].replace(",", ""))
				if (fee[2].replace(",", "") == "10000") { //만원이면 더하기
					_me._carsum = _me._carsum + parseInt(fee[2].replace(",", ""));
				}else if (fee[2].replace(",", "") == "20000") { //만원이면 더하기
					_me._carsum = parseInt(fee[2].replace(",", ""));
				}

				console.log("계산된 ktx======================", fee[0].replace(",", ""))
				console.log("계산된 항공======================", fee[1].replace(",", ""))
				console.log("계산된 자동차값======================", fee[2].replace(",", ""))

				// ktx 0 항공 0 자동차 만원 이상이면 리전카운트 -1
				if (fee[0].replace(",", "") == "0" && fee[1].replace(",", "") == "0" && fee[2].replace(",", "") > "10000") {
					console.log("리전카운트 마이너스");
					_me._etcsum = _me._etcsum - 1
					_me._caretcsum = _me._caretcsum + 1 // 1카운트 저장할때 쓰기

				}
				console.log("리전카운트2=========" + _me._etcsum)
				console.log("자동차값만썻을때=========" + _me._caretcsum)

				// 목적지 선택시 출발지 목적지 코드로 변경				
				$('[name=Sadmincode]', _dlg).val(Eadmincode).prop("selected", true);

				//교통비 팝업 합계처리
				var _sum;
				_sum = _me.addSum(fee[0], fee[1], fee[2]);
				_sum = _sum + ""


				//숙박비,식비,일비,유류할증료,출장지역 들어갈 시도 쿼리조회
				var sleepcost, daycost, eatcost, oilcost, adminname;
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pI_INSACODE: erpinsacode,
						pDateid: Godate,
						actiontype: "cost"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					sleepcost = data.sleepcost;
					daycost = data.daycost;
					eatcost = data.eatcost;
					oilcost = data.oilcost;
					adminname = data.adminname;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});


				/*숙박비 변경 2024.02 쿼리 직급별 조회 하다가 아래 조건으로 변경 
					임원 : 150,000
					서울,세종(특별시) : 100,000 
					광역시 : 80,000
					기타 : 70,000
				*/
				var _info1 = $dwp.cns("core.info");
				var _cposcode = _info1.cuser.pinfo.pos; // 현재 접속자 직위 코드

				if (_cposcode == "100" || $("[name=titlename]").val() == "원장") { // 원장 이면 무조건 15만원
					sleepcost = "150000"
				} else if (Eadminname.indexOf("특별") > -1 || Eregionname.indexOf("세종") > -1) {
					sleepcost = "100000"
				} else if (Eadminname.indexOf("광역시") > -1) {
					sleepcost = "80000"
				} else {
					sleepcost = "70000"
				}

				console.log("sleepcost" + sleepcost);
				console.log("daycost" + daycost);
				console.log("eatcost" + eatcost);
				console.log("oilcost" + oilcost);
				console.log("adminname" + adminname);



				//목적지버튼 클릭시 출장지역 배열 값 추가 최종 저장시 양식에 넣기
				//01↕경기↙02↕경남↙03↕경기↙04↕경북↙05↕경남↙06↕충남↙07↕전남↙08↕경기↙09↕강원↙10↕충북↙11↕충남↙12↕전북↙13↕전남↙14↕경북↙15↕경남
				var outplace = adminname;
				var outplace1, outplace2;
				outplace = outplace.split("↙");
				for (var i = 0; i < outplace.length; i++) {
					outplace2 = outplace[i].substr(0, 2); //앞에 코드2글자 
					outplace1 = outplace[i].substr(3); //뒤에 지역2글자 
					//목적지 admincode와 조회한 코드가 값으면 출장지역 배열에 추가  
					if (Eadmincode == outplace2) {
						_me.outplacearray.push(outplace1 + "(" + Eregionname + ")")
					}

				}
				if (Eadmincode == "16") { //제주는 그냥 추가
					_me.outplacearray.push(Eregionname);
				}

				console.log(_me.outplacearray);
				var voilcost = "";
				var oilcost2 = 0;
				//항공일때 유류할증료 추가
				if (transkind == "A") {
					oilcost2 = oilcost2 + parseInt(oilcost);
					voilcost = oilcost2;
				} else {
					voilcost = "0";
				}
				//출장지내역 배열 추가
				_me.outplace1array.push(Godatetext)
				_me.outplace1array.push(fee[3])

				console.log("목적지추가버튼 출장지내역==========" + fee[3]);

				//출장비테이블 만들 배열에 추가 
				//†출장일자†항공†기차†자동차†숙박료†식비†일비†차감비†합계†비고


				console.log("최종자동차==" + fee[2])



				_me.fanaltabledata.push(Godatetext + "_"); //출장일자
				_me.fanaltabledata.push(Godatetext + "A_" + fee[1]); //항공 
				_me.fanaltabledata.push(Godatetext + "K_" + fee[0]); //ktx 
				_me.fanaltabledata.push(Godatetext + "C_" + fee[2]); //자동차
				_me.fanaltabledata.push(Godatetext + "S_" + sleepcost); //숙박료
				_me.fanaltabledata.push(Godatetext + "E_" + eatcost); //식비
				_me.fanaltabledata.push(Godatetext + "D_" + daycost); //일비			
				_me.fanaltabledata.push(Godatetext + "O_" + voilcost); //비고 항공


				console.log("목적지추가버튼 출장테이블==========" + _me.fanaltabledata);



				//_me.fanaltabledata.push(";"); //구분자
				//console.log(_me.fanaltabledata)


				/*
				_me.fanaltabledata.push(fee[1]); //항공 
				_me.fanaltabledata.push(fee[0]); //ktx 
				_me.fanaltabledata.push(fee[2]); //자동차
				_me.fanaltabledata.push(sleepcost); //숙박료
				_me.fanaltabledata.push(eatcost); //식비
				_me.fanaltabledata.push(daycost); //일비				
				_me.fanaltabledata.push(voilcost); //비고 항공
				*/


				//교통비 팝업 행추가
				if ($("table", $("#dlg_BodyData", _dlg)).length == 0) {
					_html.push("<table class=\"\">");
					_html.push("	<colgroup>");
					_html.push("		<col width=100></col>");
					_html.push("		<col width=100></col>");
					_html.push("		<col width=100></col>");
					_html.push("		<col width=100></col>");
					_html.push("	</colgroup>");
					_html.push("		<th class=dwp-center>날짜</th>");
					_html.push("		<th class=dwp-center>출발지</th>");
					_html.push("		<th class=dwp-center>목적지</th>");
					_html.push("		<th class=dwp-center>금액</th>");
					_html.push("	<tbody id=\"tBody\"></tbody>");
					_html.push("		<td class='dwp-center dwp-bold' colspan='3'>합계</td><td class=dwp-center><div id=ssum class=dwp-bold></div></td>");
					_html.push("</table>");
					$("#dlg_BodyData", _dlg).html(_html.join(""));
					_html = [];

				}
				//input[type=checkbox]:checked
				_html.push("<tr id=tablevalue>");
				_html.push("	<td data-idx=\"\" class=dwp-none><div class=\"dwp-checkbox dwp-none\"><label><input type=\"checkbox\" checked><span></span></label></div></td>");
				_html.push("	<td data-fld=tday class=dwp-center>" + $("[name=day] option:selected", _dlg).text() + "</td>");
				_html.push("	<td class=\"dwp-cursor dwp-orange col_nm dwp-center\" data-fld=Sregion>" + $('select[name=Sregion] option:selected', _dlg).text() + "</td>");
				_html.push("	<td data-fld=tEregion class=dwp-center>" + $("[name=Eregion] option:selected", _dlg).text() + "</td>");
				_html.push("	<td data-fld=fee class=dwp-center>" + _sum.toComma() + "</td>");
				_html.push("	<td data-fld=day class=dwp-none>■" + $("[name=day] option:selected", _dlg).text() + "■</td>");//날짜	
				_html.push("	<td class=dwp-none>" + $('select[name=Sregion] option:selected', _dlg).text() + "■</td>"); //출발
				_html.push("	<td class=dwp-none>" + $("[name=Eregion] option:selected", _dlg).text() + "■</td>"); //도착
				_html.push("	<td data-fld=ktx class=dwp-none>" + fee[0] + "■</td>");	 //ktx
				_html.push("	<td data-fld=air class=dwp-none>" + fee[1] + "■</td>");	//air
				_html.push("	<td data-fld=car class=dwp-none>" + fee[2] + "■</td>");	//car				
				_html.push("	<td data-fld=expain class=dwp-none>" + fee[3] + "■</td>"); // 설명	
				_html.push("	<td data-fld=sleepcost class=dwp-none>" + sleepcost + "■</td>"); // 숙박료	
				_html.push("	<td data-fld=eatcost class=dwp-none>" + eatcost + "■</td>"); // 식비	
				_html.push("	<td data-fld=daycost class=dwp-none>" + daycost + "■</td>"); // 일비	
				_html.push("	<td data-fld=oilcost class=dwp-none>" + voilcost + "■</td>"); // 유류할증료	
				_html.push("	<td data-fld=vsum class=dwp-none>" + _sum.toComma() + "凸</td>");	//총합
				_html.push("</tr>");


				_tr = $(_html.join(""));
				//교통비 팝업 합계처리
				_sum = _sum + "";
				_sum = _sum.replace(/,/gi, "");
				_sum = parseInt(_sum);
				_me._sum1 = _me._sum1 + ""
				_me._sum1 = _me._sum1.replace(/,/gi, "");
				_me._sum1 = parseInt(_me._sum1);
				_me._sum1 = _me._sum1 + _sum;

				_tr.appendTo($("#tBody", $("#dlg_BodyData", _dlg)));
				_me._sum1 = _me._sum1 + ""
				$("#ssum").text(_me._sum1.toComma());
				//_sum1=0;


				returnvalue = true;

				return returnvalue;

			},
			//목적지 추가 선택시 출발지 목적지로 선택 
			SelectSadmincode: function (regionarr, _opt) {
				var _dlg = _opt.target;
				$('select[name=Sregion]', _dlg).empty();

				for (var i = 0; i < regionarr.length; i++) {
					regionarr1 = regionarr[i].split("↕");
					//console.log($("[name=Eadmincode]", _dlg).val())
					if (regionarr1[0] == $('select[name=Sadmincode] option:selected', _dlg).val()) {

						if ($("[name=TrnasferKind] option:selected", _dlg).val() == "A" && regionarr1[0] == "08") { //경기도 에어 이면
							$('select[name=Sregion]', _dlg).empty();
							var option = $("<option value=" + "9997" + ">" + "동두천" + "</option>");
							$('select[name=Sregion]', _dlg).append(option);
							$('[name=Sregion]', _dlg).val($('select[name=Eregion] option:selected', _dlg).val()).prop("selected", true);
						} else if ($("[name=TrnasferKind] option:selected", _dlg).val() == "A" && regionarr1[0] == "01") { //서울 에어 이면
							$('select[name=Sregion]', _dlg).empty();
							var option = $("<option value=" + "0002" + ">" + "서울" + "</option>");
							$('select[name=Sregion]', _dlg).append(option);
							$('[name=Sregion]', _dlg).val($('select[name=Eregion] option:selected', _dlg).val()).prop("selected", true);
						} else {
							var optionLabel = regionarr1[2];
							var optionValue = regionarr1[1];
							var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
							console.log(optionValue + " " + optionLabel)
							$('select[name=Sregion]', _dlg).append(option);
							$('[name=Sregion]', _dlg).val($('select[name=Eregion] option:selected', _dlg).val()).prop("selected", true);
						}
					}

				}

				//경기도~경상남도 제일 아래 기타 지역 추가 인천추가
				if ($("[name=Sadmincode]", _dlg).val() >= "08" || $("[name=Sadmincode]", _dlg).val() == "03") {
					if ($("[name=Sadmincode]", _dlg).val() == "03") {
						var option = $("<option value=" + "XXXX" + ">" + "인천" + "</option>");
						$('select[name=Sregion]', _dlg).append(option);
						$('[name=Sregion]', _dlg).val($('select[name=Eregion] option:selected', _dlg).val()).prop("selected", true);
					} else if ($("[name=Sadmincode]", _dlg).val() == "16") { //제주 기타 제외	
						console.log("제주 기타 제외	")
						$("[name=Sregion] option:eq(1)", _dlg).remove();
					} else {
						if ($('select[name=Eregion] option:selected', _dlg).val() == "XXXX") {
							var option = $("<option value=" + "XXXX" + ">" + $('select[name=Eregion] option:selected', _dlg).text() + "</option>");
							$('select[name=Sregion]', _dlg).append(option);
							$('[name=Sregion]', _dlg).val($('select[name=Eregion] option:selected', _dlg).val()).prop("selected", true);
						} else {
							var option = $("<option value=" + "XXXX" + ">" + "기타" + "</option>");
							$('select[name=Sregion]', _dlg).append(option);
							$('[name=Sregion]', _dlg).val($('select[name=Eregion] option:selected', _dlg).val()).prop("selected", true);
						}

					}

				}

			}
			,
			//다시선택시 출발지로 선택 
			SelectSadmincode01: function (regionarr, _opt, scode) {
				var _dlg = _opt.target;
				$('select[name=Sregion]', _dlg).empty();

				for (var i = 0; i < regionarr.length; i++) {
					regionarr1 = regionarr[i].split("↕");
					//console.log($("[name=Eadmincode]", _dlg).val())
					if (regionarr1[0] == $('select[name=Sadmincode] option:selected', _dlg).val()) {

						if ($("[name=TrnasferKind] option:selected", _dlg).val() == "A" && regionarr1[0] == "08") { //경기도 에어 이면
							$('select[name=Sregion]', _dlg).empty();
							var option = $("<option value=" + "9997" + ">" + "동두천" + "</option>");
							$('select[name=Sregion]', _dlg).append(option);
							$('[name=Sregion]', _dlg).val(scode).prop("selected", true);
						} else if ($("[name=TrnasferKind] option:selected", _dlg).val() == "A" && regionarr1[0] == "01") { //서울 에어 이면
							$('select[name=Sregion]', _dlg).empty();
							var option = $("<option value=" + "0002" + ">" + "서울" + "</option>");
							$('select[name=Sregion]', _dlg).append(option);
							$('[name=Sregion]', _dlg).val(scode).prop("selected", true);
						} else {
							var optionLabel = regionarr1[2];
							var optionValue = regionarr1[1];
							var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
							console.log(optionValue + " " + optionLabel)
							$('select[name=Sregion]', _dlg).append(option);
							$('[name=Sregion]', _dlg).val(scode).prop("selected", true);
						}
					}

				}

				//경기도~경상남도 제일 아래 기타 지역 추가 인천추가
				if ($("[name=Sadmincode]", _dlg).val() >= "08" || $("[name=Sadmincode]", _dlg).val() == "03") {
					if ($("[name=Sadmincode]", _dlg).val() == "03") {
						var option = $("<option value=" + "XXXX" + ">" + "인천" + "</option>");
						$('select[name=Sregion]', _dlg).append(option);
					} else if ($("[name=Sregion]", _dlg).val() == "16") { //제주 기타 제외											
						$("[name=Sregion] option:eq(1)", _dlg).remove();
					} else {
						var option = $("<option value=" + "XXXX" + ">" + "기타" + "</option>");
						$('select[name=Sregion]', _dlg).append(option);
					}

				}

			}
			,
			//ktx+air+car 합
			addSum: function (ktx, air, car) {
				var _sum = "";

				_sum = parseInt(ktx.replace(/,/gi, "")) + parseInt(air.replace(/,/gi, "")) + parseInt(car.replace(/,/gi, ""));

				//_sum=_sum+"";
				//_sum=_sum.toComma();

				return _sum
			}
			,
			_dateTerm: function ($doc) {

				//몇박 몇일을 계산하는 루틴.....
				var vSDate = $("input[name='H_11']").val();
				var vEDate = $("input[name='H_12']").val();

				if (vSDate == "" || vEDate == "") return -100;



				var strSDate = vSDate;
				var strEDate = vEDate;
				var arrSDate = new Array(3);
				var arrEDate = new Array(3);

				if (strSDate.indexOf("-") > 0) {
					arrSDate = strSDate.split("-");
					arrEDate = strEDate.split("-");

				} else if (strSDate.indexOf("/") > 0) {
					arrSDate = strSDate.split("/");
					arrEDate = strEDate.split("/");
				} else if (strSDate.indexOf(".") > 0) {
					arrSDate = strSDate.split(".");
					arrEDate = strEDate.split(".");
				}

				var vSMonth = eval(arrSDate[1]) - 1;
				var vEMonth = eval(arrEDate[1]) - 1;

				var dSDate = new Date(arrSDate[0], vSMonth.toString(), arrSDate[2]);
				var dEDate = new Date(arrEDate[0], vEMonth.toString(), arrEDate[2]);

				var vStr = (dEDate.getTime() - dSDate.getTime()) / (24 * 60 * 60 * 1000) + 1;

				if (parseInt(vStr) > 7) {

					$fn.alert({ msg: $fn.getCodeMsg("7일까지 선택 가능합니다.") });
					$("input[name='H_14']", $doc.element).xval("");
					$("input[name='H_13']", $doc.element).xval("");
					return false;
				}

				$("input[name='H_14']", $doc.element).xval(vStr);
				$("input[name='H_13']", $doc.element).xval(vStr - 1);

				var vbak = $("input[name='H_13']").val();
				if (vbak.indexOf("-") > -1) {
					//$fn.alert({ msg: $fn.getCodeMsg("출장일수가 올바르지 않습니다.") });	
					//$("input[name='H_13']").val("");
					//$("input[name='H_14']").val("");
					//return false;
				}

				//_me.initInputTable(opt, $doc ,week[d.getDay()] );




			}
			,

			GetBusinessTripMoney: function (pS_ADMIN_CODE, pS_ADMIN_NAME, pS_REGION_CODE, pS_REGION_NAME,
				pE_ADMIN_CODE, pE_ADMIN_NAME, pE_REGION_CODE, pE_REGION_NAME,
				pI_DATEID, pI_INSACODE, P_TRIPGUBUN, P_REGIONCOUNT) { // 출장비 테이블 시작
				//alert(pS_REGION_CODE)
				/*
					  KTX_PUSAN   = '0019';
					KTX_SEOUL   = '0002';
					KTX_JEJU    = '9998';
					KTX_DONGDU  = '9997';
					KTX_YONGSAN = '0003';
					KTX_DAEJEON = '0007';
					KTX_WEST_DAEJEON = '0008';

					ADMIN_PUSAN     = '02';
					ADMIN_SEOUL     = '01';
					ADMIN_JEJU      = '16';
					ADMIN_INCHON    = '03';
					ADMIN_DAEJEON   = '06';
					ADMIN_KYEONGGI  = '08';
					ADMIN_ULSAN     = '05';
					ADMIN_KYEONGNAM = '15';

					STD_MONEY   = 10000;
					//<RcdAry>
					S_ADMIN_CODE   = 0;  //출발 행정구역
					S_ADMIN_NAME   = 1;
					S_REGION_CODE  = 2;  //출발지점
					S_REGION_NAME  = 3;
					S_KTX_CODE     = 4;  //출발 대표KTX역
					S_KTX_NAME     = 5;

					E_ADMIN_CODE   = 6;  //도착 행정구역
					E_ADMIN_NAME   = 7;
					E_REGION_CODE  = 8;  //도착지점
					E_REGION_NAME  = 9;
					E_KTX_CODE     = 10; //도착 대표KTX역
					E_KTX_NAME     = 11;
					_REGIONCOUNT   = 12; //2018-0809 동일지역일경우 count '2'

					//교통비구분
					_SUMMARY       = 15;
					AIR_MONEY      = 16;  //항공교통비
					KTX_MONEY      = 17;  //KTX교통비
					CAR_MONEY      = 18;  //자동차교통비
					I_DATEID       = 19;
					I_INSACODE     = 20;
					//<RcdAry>
									*/
				var _me = _$$.aprv_sub003.subdoc;
				var AIR_MONEY = '0';
				var KTX_MONEY = '0';
				var CAR_MONEY = '0';
				var S_KTX_CODE = "";
				var S_KTX_NAME = "";
				var E_KTX_CODE = "";
				var E_KTX_NAME = "";
				var KTX_PUSAN = '0019';
				var KTX_DONGDU = '9997';
				var _SUMMARY = "";

				if (pS_REGION_CODE.toUpperCase() == "XXXX") { //출발 지역 코드가 XXXX면 출발 KTX 공백처리
					S_KTX_CODE = "";
					S_KTX_NAME = "";
				} else if (pS_REGION_CODE.substring(1, 2) == "9") { //춘천 제주?
					S_KTX_CODE = "";
					S_KTX_NAME = "";
				} else {
					S_KTX_CODE = pS_REGION_CODE
					S_KTX_NAME = pS_REGION_NAME
				}

				if (pE_REGION_CODE.toUpperCase() == "XXXX") { //도착 지역 코드가 XXXX면 출발 KTX 공백처리
					E_KTX_CODE = "";
					E_KTX_NAME = "";
				} else if (pE_REGION_CODE.substring(1, 2) == "9") { //춘천 제주?
					E_KTX_CODE = "";
					E_KTX_NAME = "";
				} else {
					E_KTX_CODE = pE_REGION_CODE
					E_KTX_NAME = pE_REGION_NAME
				}

				if (P_TRIPGUBUN == "K") {
					var feearray = "";
					//alert(pS_REGION_CODE)
					if (pS_REGION_CODE == KTX_PUSAN) { //부산출발
						console.log(pS_REGION_CODE + " 0019면 부산출발")
						feearray = _me.GetPusanStart(pS_ADMIN_CODE, pS_ADMIN_NAME, pS_REGION_CODE, pS_REGION_NAME,
							pE_ADMIN_CODE, pE_ADMIN_NAME, pE_REGION_CODE, pE_REGION_NAME,
							pI_DATEID, pI_INSACODE, P_TRIPGUBUN, P_REGIONCOUNT,
							S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME);

					} else if (pS_REGION_CODE == KTX_DONGDU) { //동두천 출발
						console.log(pS_REGION_CODE + " 9997면 동두천출발")
						feearray = _me.GetDongduStart(pS_ADMIN_CODE, pS_ADMIN_NAME, pS_REGION_CODE, pS_REGION_NAME,
							pE_ADMIN_CODE, pE_ADMIN_NAME, pE_REGION_CODE, pE_REGION_NAME,
							pI_DATEID, pI_INSACODE, P_TRIPGUBUN, P_REGIONCOUNT,
							S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME);
					} else {

						feearray = _me.GetEtcStart(pS_ADMIN_CODE, pS_ADMIN_NAME, pS_REGION_CODE, pS_REGION_NAME,
							pE_ADMIN_CODE, pE_ADMIN_NAME, pE_REGION_CODE, pE_REGION_NAME,
							pI_DATEID, pI_INSACODE, P_TRIPGUBUN, P_REGIONCOUNT,
							S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME);
					}

				} else if (P_TRIPGUBUN == "A") {
					//항공
					feearray = _me.GetTripAir(pS_ADMIN_CODE, pS_ADMIN_NAME, pS_REGION_CODE, pS_REGION_NAME,
						pE_ADMIN_CODE, pE_ADMIN_NAME, pE_REGION_CODE, pE_REGION_NAME,
						pI_DATEID, pI_INSACODE, P_TRIPGUBUN, P_REGIONCOUNT,
						S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME);

				}

				console.log("GetBusinessTripMoney완료")
				console.log(feearray);

				return feearray
			}
			,

			//리턴값 배열 넘기기 테스트
			test: function (pS_ADMIN_CODE, _SUMMARY) {

				pS_ADMIN_CODE = "11111"
				_SUMMARY = "7777"
				return [pS_ADMIN_CODE, _SUMMARY];
			},
			SameRegionTrip_select: function (S_ADMIN_CODE) {
				var SameRegionTrip_select = "";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: S_ADMIN_CODE,
						actiontype: "SameRegionTrip_select"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					SameRegionTrip_select = data.isaddmoney;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("SameRegionTrip_select===" + SameRegionTrip_select)



				return SameRegionTrip_select;


			},
			//항공 출장비 조회
			GetTripAir: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {
				var _me = _$$.aprv_sub003.subdoc;
				var S_IsKTX = "", E_IsKTX = "";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var pImsiKtx = "", pImsiCar = "", IsPeakGubun = "", gOilCost = "0", gAirMoney = "0";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var KTX_YONGSAN = "0003";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var KTX_DONGDU = '9997';
				var gMoney = "0";
				var vIsPeakGubun = "";
				var ADMIN_PUSAN = '02';
				var ADMIN_SEOUL = '01';
				var ADMIN_JEJU = '16';
				var ADMIN_INCHON = '03';
				var ADMIN_DAEJEON = '06';
				var ADMIN_KYEONGGI = '08';
				var ADMIN_ULSAN = '05';
				var ADMIN_KYEONGNAM = '15';

				//IsPeakGubun : 1:평일, 2:주말, 3:성수기.
				//성수기 조회			
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: I_DATEID,
						actiontype: "IsPeakGubun"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					vIsPeakGubun = data.IsPeakGubun;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("IsPeakGubun===" + vIsPeakGubun);

				if (vIsPeakGubun != "") {

					console.log("성수기");
					IsPeakGubun = "3";

				} else {

					console.log("성수기아님");
					$fn.xAjax({
						url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
						method: 'POST',
						dataType: 'json',
						data: {
							pSKtxCode: I_DATEID,
							actiontype: "IsPeakGubun2"
						},
						async: false,
						cache: false
					}).done(function (data) {
						console.log("처리", data);
						//rtn = $dwp.core.util.exObjList(data, opt);
						vIsPeakGubun = data.IsPeakGubun;
					}).fail(function (req, error) {
						console.log(req.responseText + '\n' + error);
					});
					console.log("IsPeakGubun===" + vIsPeakGubun);

					if (vIsPeakGubun.trim() == "금" || vIsPeakGubun.trim() == "토" || vIsPeakGubun.trim() == "일") {
						IsPeakGubun = "2";
					} else {
						IsPeakGubun = "1";

					}


				}
				console.log("IsPeakGubun=" + IsPeakGubun);

				//오일코스트 조회
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: I_DATEID,
						actiontype: "IsPeakGubun3"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					gOilCost = data.gOilCost;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});

				var p2s = "", p2j = "", s2j = "";


				console.log("gOilCost=" + gOilCost);

				//항공기 값 조회 
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: gOilCost, //항공료?
						pDateid: I_DATEID, //출장날짜
						pEKtxCode: IsPeakGubun, // 피크구분
						pI_INSACODE: I_INSACODE, //인사코드
						actiontype: "IsPeakGubun4"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("IsPeakGubun4 처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					p2s = data.p2s;
					p2j = data.p2j;
					s2j = data.s2j;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});

				console.log("p2s====" + p2s);
				console.log("p2j====" + p2j);
				console.log("s2j====" + s2j);

				//항공 시작
				if (S_ADMIN_CODE == ADMIN_PUSAN) {

					if (E_ADMIN_CODE == ADMIN_SEOUL) {
						AIR_MONEY = p2s;        //부산->서울
						_SUMMARY = '부산▶서울 항공(' + AIR_MONEY.toComma() + ')';
					} else if (E_ADMIN_CODE == ADMIN_JEJU) {
						AIR_MONEY = p2j;    //부산->제주
						_SUMMARY = '부산▶제주 항공(' + AIR_MONEY.toComma() + ')';
					} else if (E_ADMIN_CODE == ADMIN_KYEONGGI || E_ADMIN_CODE == ADMIN_INCHON) {//부산->경기 or  부산->인천
						AIR_MONEY = p2s;
						CAR_MONEY = STD_MONEY;
						_SUMMARY = '부산▶서울 항공(' + AIR_MONEY.toComma() + '),';
						_SUMMARY = _SUMMARY + '서울▶' + E_REGION_NAME + ' 차량(' + CAR_MONEY.toComma() + ')';
					}

				} else if (S_ADMIN_CODE == ADMIN_JEJU) {

					if (E_ADMIN_CODE == ADMIN_PUSAN) {
						AIR_MONEY = p2j;        //제주->부산
						_SUMMARY = '제주▶부산 항공(' + AIR_MONEY.toComma() + ')';
					} else if (E_ADMIN_CODE == ADMIN_SEOUL) {
						AIR_MONEY = s2j;    //제주->서울
						_SUMMARY = '제주▶서울 항공(' + AIR_MONEY.toComma() + ')';
					} else if (E_ADMIN_CODE == ADMIN_KYEONGGI || E_ADMIN_CODE == ADMIN_INCHON) { //제주->경기 or  제주->인천
						AIR_MONEY = s2j;
						CAR_MONEY = STD_MONEY;
						_SUMMARY = '제주▶서울 항공(' + AIR_MONEY.toComma() + '),';
						_SUMMARY = _SUMMARY + '서울▶' + E_REGION_NAME + ' 차량(' + CAR_MONEY.toComma() + ')';
					}

				} else if (S_ADMIN_CODE == ADMIN_SEOUL) {

					if (E_ADMIN_CODE == ADMIN_JEJU) {
						AIR_MONEY = s2j;           //서울->제주
						_SUMMARY = '서울▶제주 항공(' + AIR_MONEY.toComma() + ')';
					} else if (E_ADMIN_CODE == ADMIN_PUSAN) {
						AIR_MONEY = p2s;    //서울->부산
						_SUMMARY = '서울▶부산 항공(' + AIR_MONEY.toComma() + ')';
					}

				} else if (S_ADMIN_CODE == ADMIN_KYEONGGI || S_ADMIN_CODE == ADMIN_INCHON) {
					if (E_ADMIN_CODE == ADMIN_JEJU) { //경기 or 인천->제주
						AIR_MONEY = s2j;
						CAR_MONEY = STD_MONEY;
						_SUMMARY = S_REGION_NAME + '▶서울' + ' 차량(' + CAR_MONEY.toComma() + '), ';
						_SUMMARY = _SUMMARY + '서울▶제주 항공(' + AIR_MONEY.toComma() + ')';

					} else if (E_ADMIN_CODE == ADMIN_PUSAN) { //경기 or 인천->부산
						AIR_MONEY = p2s;
						CAR_MONEY = STD_MONEY;
						_SUMMARY = S_REGION_NAME + '▶서울' + ' 차량(' + CAR_MONEY.toComma() + '), ';
						_SUMMARY = _SUMMARY + '서울▶부산 항공(' + AIR_MONEY.toComma() + ')';

					}

				}




				console.log("GetTripAir 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY);
				return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
			},
			//기타지역? 출장비 조회
			SameRegionTrip: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {

				var _me = _$$.aprv_sub003.subdoc;
				var S_IsKTX = "", E_IsKTX = "";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var pImsiKtx = "", pImsiCar = "";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var KTX_YONGSAN = "0003";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var KTX_DONGDU = '9997';
				var gMoney = "0";
				//_REGIONCOUNT="2" //20230410
				console.log("자동차합계================================" + _me._carsum)
				if (_me.SameRegionTrip_select(S_ADMIN_CODE) == "2") {
					AIR_MONEY = "0"
					KTX_MONEY = "0"
					CAR_MONEY = "0"

				} else {

					if (S_REGION_CODE.toUpperCase() != 'XXXX' && S_REGION_CODE.substring(1, 2) != '9') {
						S_IsKTX = '1';   //KTX역임
					} else {
						S_IsKTX = '2';
					}
					if (E_REGION_CODE.toUpperCase() != 'XXXX' && E_REGION_CODE.substring(1, 2) != '9') {
						E_IsKTX = '1';   //KTX역임
					} else {
						E_IsKTX = '2';
					}
					console.log("S_IsKTX" + S_IsKTX + " " + "E_IsKTX" + E_IsKTX);
					console.log((S_IsKTX == '1' && E_IsKTX == '1'))
					if ((S_IsKTX == '1' && E_IsKTX == '1') == false) { // 둘다 KTX역이 아니면
						console.log("둘다 KTX역이 아니면");
						if (S_IsKTX == '1' && E_REGION_CODE == KTX_DONGDU) {
							AIR_MONEY = "0";
							KTX_MONEY = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, KTX_SEOUL, E_ADMIN_CODE, I_INSACODE, I_DATEID)
							_SUMMARY = S_REGION_NAME + '▶서울KTX(' + KTX_MONEY.toComma() + '), ';

							CAR_MONEY = STD_MONEY;
							if (_me._carsum > 10000) { CAR_MONEY = '0'; }  //202304
							_SUMMARY = _SUMMARY + '서울▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';

						} else if (S_IsKTX == '2' && E_REGION_CODE == KTX_DONGDU) { //2017-1121  추가
							CAR_MONEY = STD_MONEY;
							if (_me._carsum > 10000) { CAR_MONEY = '0'; }  //202304
							_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
							//pAry[CAR_MONEY] := FloatToStr(STD_MONEY);
							//pAry[_SUMMARY]  := pAry[S_REGION_NAME] + ' ▶' + pAry[E_REGION_NAME] + '차량(' + GetFormatMoney(pAry[CAR_MONEY]) + ') ';
						} else {
							AIR_MONEY = "0";
							KTX_MONEY = "0";
							CAR_MONEY = STD_MONEY;
							console.log("둘다 KTX역이 아니면여기로 들어오나");

							//리전카운트가 1보다 크고 자동차값이 1만원보다 크면 카머니 0
							if (_REGIONCOUNT > 1 && _me._carsum > 10000) { CAR_MONEY = '0'; }  //2018-0809
							//	if (_me._carsum > 10000 ) {CAR_MONEY = '0';}  //202304
							_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ')';
						}


					} else {
						console.log("둘다 KTX역이면");
						gMoney = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);      //KTX비용

						if (gMoney != "0") { //노선있음.
							S_KTX_CODE = S_REGION_CODE;
							S_KTX_NAME = S_REGION_NAME;
							E_KTX_CODE = E_REGION_CODE;
							E_KTX_NAME = E_REGION_NAME;
							KTX_MONEY = gMoney;      //KTX비용					
							_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + 'KTX(' + KTX_MONEY.toComma() + ') ';

						} else {
							console.log("둘다 KTX역이면 노선없으면");
							CAR_MONEY = STD_MONEY;
							//얘는 주석 20230410
							if (_REGIONCOUNT > 1 && _me._carsum > 10000) { CAR_MONEY = '0'; }  //2018-0809
							//if (_me._carsum > 10000 ) {CAR_MONEY = '0';}  //2018-0809
							//_me._carsum)
							_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
						}

					}
				}


				console.log("SameRegionTrip 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY);
				return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]

			},
			//GetEtcStart 함수
			OtherRegionTrip: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {
				var _me = _$$.aprv_sub003.subdoc;
				var S_IsKTX = "", E_IsKTX = "";
				var ADMIN_ULSAN = '05';
				var ADMIN_KYEONGNAM = '15';
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var pImsiKtx = "", pImsiCar = "";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var KTX_YONGSAN = "0003";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var KTX_DONGDU = '9997';
				var gMoney = "0";
				var valarray;

				if (S_REGION_CODE.toUpperCase() != 'XXXX' && S_REGION_CODE.substring(1, 2) != '9') {
					S_IsKTX = '1'   //KTX역임
				} else {
					S_IsKTX = '2'
				}
				if (E_REGION_CODE.toUpperCase() != 'XXXX' && E_REGION_CODE.substring(1, 2) != '9') {
					E_IsKTX = '1'   //KTX역임
				} else {
					E_IsKTX = '2'
				}

				console.log("OtherRegionTrip==============" + S_REGION_CODE.toUpperCase() + " " + S_REGION_CODE.substring(1, 2))
				console.log("OtherRegionTrip==============" + E_REGION_CODE.toUpperCase() + " " + E_REGION_CODE.substring(1, 2))

				if ((S_ADMIN_CODE == ADMIN_ULSAN && E_ADMIN_CODE == ADMIN_KYEONGNAM) ||
					(S_ADMIN_CODE == ADMIN_KYEONGNAM && E_ADMIN_CODE == ADMIN_ULSAN)) {

					CAR_MONEY = STD_MONEY;
					_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
					console.log("ADMIN_KYEONGNAM");
					valarray = [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				} else if (S_IsKTX == '1' && E_IsKTX == '1') {
					console.log("S_IsKTX == '1'&& E_IsKTX == '1'");
					valarray = _me.OtherRegionTrip_1(S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
						E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
						I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME);

				} else if (S_IsKTX == '1' && E_IsKTX == '2') {
					console.log("S_IsKTX == '1'&& E_IsKTX == '2'");
					valarray = _me.OtherRegionTrip_2(S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
						E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
						I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME);

				} else if (S_IsKTX == '2' && E_IsKTX == '1') {
					console.log("S_IsKTX == '2'&& E_IsKTX == '1'");
					valarray = _me.OtherRegionTrip_3(S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
						E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
						I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME);

				} else if (S_IsKTX == '2' && E_IsKTX == '2') {
					console.log("S_IsKTX == '2'&& E_IsKTX == '2'");
					valarray = _me.OtherRegionTrip_4(S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
						E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
						I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME);

				}

				console.log("OtherRegionTrip 끝" + valarray);
				return valarray;
			},
			//기타지역? 출장비 조회 S_IsKTX == '1'&& E_IsKTX == '1'
			OtherRegionTrip_1: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {
				var _me = _$$.aprv_sub003.subdoc;
				var S_IsKTX = "", E_IsKTX = "";
				var ADMIN_ULSAN = '05';
				var ADMIN_KYEONGNAM = '15';
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var pImsiKtx = "", pImsiCar = "";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var KTX_YONGSAN = "0003";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var KTX_DONGDU = '9997';
				var gMoney = "0";
				var pImsiSummary = "";

				console.log("OtherRegionTrip_1 -> GetKtxExpense==파티미터==" + S_REGION_CODE + " " + S_ADMIN_CODE + " " + E_REGION_CODE + " " + E_ADMIN_CODE)

				gMoney = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);

				if (gMoney != "0") {
					console.log("gMoney 0이 아니면");
					S_KTX_CODE = S_REGION_CODE;
					S_KTX_NAME = S_REGION_NAME;
					E_KTX_CODE = E_REGION_CODE;
					E_KTX_NAME = E_REGION_NAME;
					KTX_MONEY = gMoney;
					_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + 'KTX(' + KTX_MONEY.toComma() + ') ';

					console.log("OtherRegionTrip_1 ---1 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
					return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				}



				var ktxconame = _me.GetRepresentKTX(E_ADMIN_CODE);
				E_KTX_CODE = ktxconame[0];
				E_KTX_NAME = ktxconame[1];
				gMoney = "0";
				gMoney = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney := GetKtxExpense(pAry[S_REGION_CODE], pAry[S_ADMIN_CODE], EKtxCode, pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);
				if (gMoney != "0") {

					S_KTX_CODE = S_REGION_CODE;
					S_KTX_NAME = S_REGION_NAME;
					E_KTX_CODE = E_KTX_CODE;
					E_KTX_NAME = E_KTX_NAME;
					KTX_MONEY = gMoney;        //KTX비용
					_SUMMARY = S_REGION_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';

					gMoney = "0";
					gMoney = _me.GetKtxExpense(E_KTX_CODE, E_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
					// gMoney := GetKtxExpense(EKtxCode, pAry[E_ADMIN_CODE], pAry[E_REGION_CODE], pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);
					if (gMoney == "0") {

						CAR_MONEY = STD_MONEY;
						if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }  //2018-0809
						_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';

					} else {


						KTX_MONEY = parseInt(KTX_MONEY) + parseInt(gMoney);
						KTX_MONEY = KTX_MONEY + ""
						_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + gMoney.toComma() + ') ';

					}

					console.log("OtherRegionTrip_1 --- 2끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
					return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				}



				var ktxconame = _me.GetRepresentKTX(S_ADMIN_CODE);
				S_KTX_CODE = ktxconame[0];
				S_KTX_NAME = ktxconame[1];
				gMoney = "0";
				gMoney = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney := GetKtxExpense(SKtxCode, pAry[S_ADMIN_CODE], pAry[E_REGION_CODE], pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);

				if (gMoney != "0") {

					S_KTX_CODE = S_KTX_CODE;
					S_KTX_NAME = S_KTX_NAME;
					E_KTX_CODE = E_REGION_CODE;
					E_KTX_NAME = E_REGION_NAME;
					KTX_MONEY = gMoney;  //KTX비용
					pImsiSummary = S_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + KTX_MONEY.toComma() + ') ';

					gMoney = "0";
					gMoney = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, S_KTX_CODE, S_ADMIN_CODE, I_INSACODE, I_DATEID);
					//gMoney := GetKtxExpense(pAry[S_REGION_CODE], pAry[S_ADMIN_CODE], SKtxCode, pAry[S_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);
					console.log("OtherRegionTrip_1 ----3===!!===" + gMoney);
					if (gMoney == "0") {

						CAR_MONEY = STD_MONEY;
						if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }  //2018-0809
						_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
						//pAry[_SUMMARY]  := pAry[S_REGION_NAME] + '▶' + pAry[S_KTX_NAME] + '차량(' + GetFormatMoney(pAry[CAR_MONEY]) + '), ';
						_SUMMARY = _SUMMARY + pImsiSummary;

					} else {
						console.log("요기임?????????===" + S_REGION_NAME)
						console.log("요기임?????????===" + S_KTX_NAME)
						KTX_MONEY = parseInt(KTX_MONEY) + parseInt(gMoney);
						KTX_MONEY = KTX_MONEY + ""
						_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + 'KTX(' + gMoney.toComma() + ') ';
						_SUMMARY = _SUMMARY + pImsiSummary;

						//pAry[KTX_MONEY] := FloatToStr(StrToFloatDef(pAry[KTX_MONEY]) + gMoney);
						//pAry[_SUMMARY]  := pAry[S_REGION_NAME] + '▶' + pAry[S_KTX_NAME] + 'KTX(' + GetFormatMoney(FloatToStr(gMoney)) + '), ';
						//pAry[_SUMMARY]  := pAry[_SUMMARY] + pImsiSummary;

					}

					console.log("OtherRegionTrip_1 ----3 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
					return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				}

				gMoney = "0";
				gMoney = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);

				if (gMoney == "0") {
					if (S_KTX_CODE == E_KTX_CODE) {
						CAR_MONEY = STD_MONEY;
						if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }
						//if StrToFloatDef(pAry[_REGIONCOUNT]) > 1 then pAry[CAR_MONEY] := '0';  //2018-0809

					} else {

						CAR_MONEY = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);

					}
					_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
					console.log("OtherRegionTrip_1 ------4 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
					return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				}


				S_KTX_CODE = S_KTX_CODE;
				S_KTX_NAME = S_KTX_NAME;
				E_KTX_CODE = E_KTX_CODE;
				E_KTX_NAME = E_KTX_NAME;
				KTX_MONEY = gMoney;        //KTX비용


				pImsiSummary = S_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';
				gMoney = "0";
				gMoney = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, S_KTX_CODE, S_ADMIN_CODE, I_INSACODE, I_DATEID);

				if (gMoney == "0") {
					if (S_KTX_CODE == E_KTX_CODE) {
						CAR_MONEY = STD_MONEY;
						if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }
						_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + CAR_MONEY.toComma() + '), ';
						_SUMMARY = _SUMMARY + pImsiSummary;

					} else {
						KTX_MONEY = parseInt(KTX_MONEY) + parseInt(gMoney);
						KTX_MONEY = KTX_MONEY + ""
						_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + 'KTX(' + gMoney.toComma() + ') ';
						_SUMMARY = _SUMMARY + pImsiSummary;
						//pAry[KTX_MONEY] := FloatToStr(StrToFloatDef(pAry[KTX_MONEY]) + gMoney);
						//pAry[_SUMMARY]  := pAry[S_REGION_NAME] + '▶' + SKtxName + 'KTX(' + GetFormatMoney(FloatToStr(gMoney)) + '), ';
						//pAry[_SUMMARY]  := pAry[_SUMMARY] + pImsiSummary;
					}

				}
				gMoney = "0";
				gMoney = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, S_KTX_CODE, S_ADMIN_CODE, I_INSACODE, I_DATEID);
				if (gMoney == "0") {
					CAR_MONEY = parseInt(CAR_MONEY) + parseInt(STD_MONEY);
					CAR_MONEY = CAR_MONEY + "";
					if (_REGIONCOUNT > 1) { CAR_MONEY = CAR_MONEY; }
					//if StrToFloatDef(pAry[_REGIONCOUNT]) > 1 then pAry[CAR_MONEY] := FloatToStr(StrToFloatDef(pAry[CAR_MONEY]));  //2018-0809
					_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + STD_MONEY.toComma() + ') ';

				} else {
					KTX_MONEY = parseInt(KTX_MONEY) + parseInt(gMoney);
					KTX_MONEY = KTX_MONEY + ""
					_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + gMoney.toComma() + ') ';
				}



				console.log("OtherRegionTrip_1 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
				return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
			},
			//기타지역? 출장비 조회 S_IsKTX == '1'&& E_IsKTX == '2'
			OtherRegionTrip_2: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {
				var _me = _$$.aprv_sub003.subdoc;
				var S_IsKTX = "", E_IsKTX = "";
				var ADMIN_ULSAN = '05';
				var ADMIN_KYEONGNAM = '15';
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var pImsiKtx = "", pImsiCar = "";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var KTX_YONGSAN = "0003";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var KTX_DONGDU = '9997';
				var gMoney = "0";
				var pImsiSummary = "";


				var ktxconame = _me.GetRepresentKTX(E_ADMIN_CODE);
				E_KTX_CODE = ktxconame[0];
				E_KTX_NAME = ktxconame[1];
				gMoney = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney := GetKtxExpense(pAry[S_REGION_CODE], pAry[S_ADMIN_CODE], EKtxCode, pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);
				if (gMoney != "0") {
					console.log("gMoney 0이 아니면");
					S_KTX_CODE = S_REGION_CODE;
					S_KTX_NAME = S_REGION_NAME;
					E_KTX_CODE = E_KTX_CODE;
					E_KTX_NAME = E_KTX_NAME;
					KTX_MONEY = gMoney;
					_SUMMARY = S_REGION_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + ') ';
					CAR_MONEY = STD_MONEY;
					_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';


					console.log("OtherRegionTrip_2 ---1 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
					return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				}


				var ktxconame = _me.GetRepresentKTX(S_ADMIN_CODE);
				S_KTX_CODE = ktxconame[0];
				S_KTX_NAME = ktxconame[1];
				gMoney = "0";
				//9999 12 9999 09 F00382 20230316
				console.log("OtherRegionTrip_2 2----" + S_KTX_CODE + " " + S_ADMIN_CODE + " " + E_KTX_CODE + " " + E_ADMIN_CODE + " " + I_INSACODE + " " + I_DATEID)
				gMoney = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney = GetKtxExpense(sKtxCode, pAry[S_ADMIN_CODE], EKtxCode, pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);
				console.log("OtherRegionTrip_2 2---->" + gMoney)
				if (gMoney == "0") {
					if (S_KTX_CODE == E_KTX_CODE) {
						CAR_MONEY = STD_MONEY;
						if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }

					} else {
						console.log(S_KTX_CODE);
						console.log(S_ADMIN_CODE); //0321
						CAR_MONEY = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);


					}
					_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
					console.log("OtherRegionTrip_2 ----2끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
					return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				}


				S_KTX_CODE = S_KTX_CODE;
				S_KTX_NAME = S_KTX_NAME;
				E_KTX_CODE = E_KTX_CODE;
				E_KTX_NAME = E_KTX_NAME;
				KTX_MONEY = gMoney;        //KTX비용

				_SUMMARY = S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + ') ';
				CAR_MONEY = STD_MONEY;
				_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';


				gMoney = _me.GetKtxExpense(S_REGION_CODE, S_ADMIN_CODE, S_KTX_CODE, S_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney := GetKtxExpense(pAry[S_REGION_NAME], pAry[S_ADMIN_CODE], sKtxCode, pAry[S_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);

				if (gMoney == "0") {

					CAR_MONEY = parseInt(CAR_MONEY) + parseInt(STD_MONEY);
					CAR_MONEY = CAR_MONEY + "";
					if (_REGIONCOUNT > 1) { CAR_MONEY = CAR_MONEY; }
					_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + STD_MONEY.toComma() + '), ' + _SUMMARY;
					//pAry[_SUMMARY]  := pAry[S_REGION_NAME] + '▶' + sKtxName + '차량(' + GetFormatMoney(FloatToStr(STD_MONEY)) + '), ' + pAry[_SUMMARY];

				} else {
					KTX_MONEY = parseInt(KTX_MONEY) + parseInt(gMoney);
					KTX_MONEY = KTX_MONEY + ""
					_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + 'KTX(' + gMoney.toComma() + '), ' + _SUMMARY;


				}


				console.log("OtherRegionTrip_2 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
				return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]

			},
			//기타지역? 출장비 조회 S_IsKTX == '2'&& E_IsKTX == '1'
			OtherRegionTrip_3: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {
				var _me = _$$.aprv_sub003.subdoc;
				var S_IsKTX = "", E_IsKTX = "";
				var ADMIN_ULSAN = '05';
				var ADMIN_KYEONGNAM = '15';
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var pImsiKtx = "", pImsiCar = "";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var KTX_YONGSAN = "0003";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var KTX_DONGDU = '9997';
				var gMoney = "0";
				var pImsiSummary = "";

				var ktxconame = _me.GetRepresentKTX(S_ADMIN_CODE);
				S_KTX_CODE = ktxconame[0];
				S_KTX_NAME = ktxconame[1];
				gMoney = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney := GetKtxExpense(sKtxCode, pAry[S_ADMIN_CODE], pAry[E_REGION_CODE], pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);
				if (gMoney != "0") {

					console.log("gMoney 0이 아니면");
					S_KTX_CODE = S_KTX_CODE;
					S_KTX_NAME = S_KTX_NAME;
					E_KTX_CODE = E_REGION_CODE;
					E_KTX_NAME = E_REGION_NAME;
					CAR_MONEY = STD_MONEY;
					if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }//202304
					_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
					KTX_MONEY = gMoney;
					_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + KTX_MONEY.toComma() + ') ';


					console.log("OtherRegionTrip_3 ---1 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY);
					return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				}



				var ktxconame = _me.GetRepresentKTX(E_ADMIN_CODE);
				E_KTX_CODE = ktxconame[0];
				E_KTX_NAME = ktxconame[1];
				gMoney = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney := GetKtxExpense(sKtxCode, pAry[S_ADMIN_CODE], EKtxCode, pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);

				if (gMoney == "0") {
					if (S_KTX_CODE == E_KTX_CODE) {
						CAR_MONEY = STD_MONEY;
						if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }

					} else {
						CAR_MONEY = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);


					}
					_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
					console.log("OtherRegionTrip_3 ----2끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
					return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
				}

				S_KTX_CODE = S_KTX_CODE;
				S_KTX_NAME = S_KTX_NAME;
				E_KTX_CODE = E_KTX_CODE;
				E_KTX_NAME = E_KTX_NAME;
				KTX_MONEY = gMoney;        //KTX비용
				CAR_MONEY = STD_MONEY;


				_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + STD_MONEY.toComma() + ') ';
				_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + ') ';


				gMoney = _me.GetKtxExpense(E_KTX_CODE, E_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney := GetKtxExpense(EKtxCode, pAry[E_ADMIN_CODE], pAry[E_REGION_CODE], pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);

				if (gMoney == "0") {

					CAR_MONEY = parseInt(CAR_MONEY) + parseInt(STD_MONEY);
					CAR_MONEY = CAR_MONEY + "";
					if (_REGIONCOUNT > 1) { CAR_MONEY = CAR_MONEY; }
					_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + STD_MONEY.toComma() + ')';
					//if StrToFloatDef(pAry[_REGIONCOUNT]) > 1 then pAry[CAR_MONEY] := FloatToStr(StrToFloatDef(pAry[CAR_MONEY]));  //2018-0809
					//pAry[_SUMMARY]  := pAry[_SUMMARY] + EKtxName + '▶' + pAry[E_REGION_NAME] + '차량(' + GetFormatMoney(FloatToStr(STD_MONEY)) + ') ';

				} else {
					KTX_MONEY = parseInt(KTX_MONEY) + parseInt(gMoney);
					KTX_MONEY = KTX_MONEY + ""
					_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + gMoney.toComma() + ') ';

					//pAry[KTX_MONEY] := FloatToStr(StrToFloatDef(pAry[KTX_MONEY]) + gMoney);
					//pAry[_SUMMARY]  := pAry[_SUMMARY] + EKtxName + '▶' + pAry[E_REGION_NAME] + 'KTX(' + GetFormatMoney(FloatToStr(gMoney)) + ') ';


				}


				console.log("OtherRegionTrip_3 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
				return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]

			},
			//기타지역? 출장비 조회 S_IsKTX == '2'&& E_IsKTX == '2'
			OtherRegionTrip_4: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {
				var _me = _$$.aprv_sub003.subdoc;
				var S_IsKTX = "", E_IsKTX = "";
				var ADMIN_ULSAN = '05';
				var ADMIN_KYEONGNAM = '15';
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var pImsiKtx = "", pImsiCar = "";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var KTX_YONGSAN = "0003";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var KTX_DONGDU = '9997';
				var gMoney = "0";
				var pImsiSummary = "";


				var sktxconame = _me.GetRepresentKTX(S_ADMIN_CODE);
				S_KTX_CODE = sktxconame[0];
				S_KTX_NAME = sktxconame[1];
				var ektxconame = _me.GetRepresentKTX(E_ADMIN_CODE);
				E_KTX_CODE = ektxconame[0];
				E_KTX_NAME = ektxconame[1];


				gMoney = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
				//gMoney := GetKtxExpense(sKtxCode, pAry[S_ADMIN_CODE], EKtxCode, pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]);
				if (gMoney != "0") {
					console.log("ktx요금 있으면====11111111111111111111=1에서 이동")
					S_KTX_CODE = S_KTX_CODE;
					S_KTX_NAME = S_KTX_NAME;
					E_KTX_CODE = E_KTX_CODE;
					E_KTX_NAME = E_KTX_NAME;
					KTX_MONEY = gMoney;        //KTX비용
					CAR_MONEY = parseInt(STD_MONEY) * 2;
					CAR_MONEY = CAR_MONEY + "";
					
					//if (_me._carsum > 10000 ) {CAR_MONEY = '0';}  //202304
					//if (_me._carsum > 10000 ) {STD_MONEY = '0';}  //202304

					_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + STD_MONEY.toComma() + '), ';
					_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';

					if (_REGIONCOUNT > 1) { STD_MONEY = '0'; CAR_MONEY = '10000' } //202304

					_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + STD_MONEY.toComma() + ')';

					//	pAry[_SUMMARY]   := pAry[S_REGION_NAME] + '▶' + E_REGION_NAME + '차량(' + GetFormatMoney(FloatToStr(STD_MONEY)) + '), ';
					//	pAry[_SUMMARY]   := pAry[_SUMMARY] + sKtxName + '▶' + EKtxName + 'KTX(' + GetFormatMoney(pAry[KTX_MONEY]) + '), ';
					//	pAry[_SUMMARY]   := pAry[_SUMMARY] + EKtxName + '▶' + pAry[E_REGION_NAME] + '차량(' + GetFormatMoney(FloatToStr(STD_MONEY)) + ') ';

				} else {
					console.log("기타지역====11111111111111111111=1에서 이동")
					if (S_KTX_CODE == E_KTX_CODE) {
						CAR_MONEY = STD_MONEY;
						//if (_REGIONCOUNT > 1)
						if (_REGIONCOUNT > 1 && _me._carsum > 10000) { CAR_MONEY = '0'; }
						//pAry[CAR_MONEY]  := FloatToStr(STD_MONEY);
						//if StrToFloatDef(pAry[_REGIONCOUNT]) > 1 then pAry[CAR_MONEY] := '0';  //2018-0809

					} else {

						CAR_MONEY = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);

						//CAR_MONEY="0"

					}

					_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
					//_SUMMARY  = S_REGION_NAME+ '▶' + E_REGION_NAME+ '차량(' + + ') ';

				}


				console.log("OtherRegionTrip_4 끝" + KTX_MONEY + " " + AIR_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
				return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]

			},
			//기타지역? 출장비 조회
			GetEtcStart: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {
				console.log("GetEtcStart 시작" + S_ADMIN_CODE + E_ADMIN_CODE)
				var _me = _$$.aprv_sub003.subdoc;
				var valuerray = "";

				if (S_ADMIN_CODE == E_ADMIN_CODE) {
					valuerray = _me.SameRegionTrip(S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
						E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
						I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME)
				} else {
					valuerray = _me.OtherRegionTrip(S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
						E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
						I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME)
				}




				console.log("GetEtcStart 끝" + valuerray)
				return valuerray;

			},
			//동두천 스타트시 출장비 조회
			GetDongduStart: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, _REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {
				var _me = _$$.aprv_sub003.subdoc;
				var pKtxCode, pKtxName, pImsiKtxSummary, pImsiCarSummary;
				var pImsiMoney = 0, pImsiMoney2 = 0;
				var KTX_DONGDU = '9997';
				var ADMIN_INCHON = '03';
				var ADMIN_SEOUL = '01', ADMIN_KYEONGGI = "08";
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var pImsiKtx = "", pImsiCar = "";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var KTX_YONGSAN = "0003";


				/*
				if (pAry[E_ADMIN_CODE] = ADMIN_INCHON) or (pAry[E_ADMIN_CODE] = ADMIN_SEOUL) then
				begin
					pAry[CAR_MONEY] := FloatToStr(STD_MONEY);   //대중교통비(10,000)원
					if (Trim(pAry[CAR_MONEY]) <> '0') and (Trim(pAry[CAR_MONEY]) <> '') then
						pAry[_SUMMARY]  := pAry[S_REGION_NAME] + '▶' + pAry[E_REGION_NAME] + '차량(' + GetFormatMoney(pAry[CAR_MONEY]) + ')';
				end
				*/

				//인천 or 서울 or 경기도 1만원 지급
				if (E_ADMIN_CODE == ADMIN_INCHON || E_ADMIN_CODE == ADMIN_SEOUL) {

					CAR_MONEY = STD_MONEY;   //대중교통비(10,000)원 추가
					if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
						_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + '), ';
					}
					//도착지역 경기도 이면					
				} else if (E_ADMIN_CODE == ADMIN_KYEONGGI) {
					console.log("도착 경기도")
					if (E_REGION_CODE.toUpperCase() == 'XXXX' || E_REGION_CODE.substring(1, 2) == '9' || E_REGION_CODE == '') {
						console.log("_REGIONCOUNT===아리까리함" + _REGIONCOUNT)

						CAR_MONEY = STD_MONEY;  //대중교통비(10,000)원
						if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }  //2018-0809

						if ((CAR_MONEY.trim() != '0' && CAR_MONEY.trim()) != '' || (CAR_MONEY.trim() != '0' && _REGIONCOUNT > 1)) {
							_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ')';

						}
					} else {
						//서울->도착지
						if (_me.GetKtxExpense(KTX_SEOUL, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") {

							S_KTX_CODE = KTX_SEOUL;
							S_KTX_NAME = '서울';

							CAR_MONEY = STD_MONEY; //동두->서울(1만원)

							if (_me._carsum > 10000) {
								CAR_MONEY = '0';
								_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + CAR_MONEY + '), ';
							}  //202304
							console.log("최종자동차1==================" + _me._carsum)

							if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
								_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + CAR_MONEY + '), ';
							}

							KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);      //KTX비용
							//_me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
							if (KTX_MONEY.trim() != '0' && KTX_MONEY.trim() != '') {
								_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + KTX_MONEY.toComma() + ')';
							}


						} else {
							//20230317
							CAR_MONEY = STD_MONEY; //동두->서울(1만원)
							console.log("_REGIONCOUNT===아리까리함" + _REGIONCOUNT)
							if (_REGIONCOUNT > 1) { CAR_MONEY = '0'; }  //2018-0809

							if (_me._carsum > 10000) {
								_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ')';
								CAR_MONEY = '0';
							}  //202304
							console.log("최종자동차1==================" + _me._carsum)

							if ((CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') ||
								(CAR_MONEY.trim() != '0' && _REGIONCOUNT > 1)) {
								_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ')';
							}

						}

					}
				} else { //도착지역 경기도 아니면	
					console.log("도착 경기도 아님");
					if (E_REGION_CODE.toUpperCase() == 'XXXX' || E_REGION_CODE.substring(1, 2) == '9' || E_REGION_CODE == '') {

						var ktxconame = _me.GetRepresentKTX(E_ADMIN_CODE);
						E_KTX_CODE = ktxconame[0];
						E_KTX_NAME = ktxconame[1];

						//서울->도착지역의대표역
						if (_me.GetKtxExpense(KTX_SEOUL, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") {
							console.log("서울->도착지역의대표역");
							//대표역까지 KTX + 10,000
							S_KTX_CODE = KTX_SEOUL;
							S_KTX_NAME = '서울';
							CAR_MONEY = parseInt(STD_MONEY) * 2; //동두->서울(1만원) + 도착대표역 -> 도착지(1만원)
							CAR_MONEY = CAR_MONEY + "";
							if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
								_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + STD_MONEY.toComma() + '), ';
							}

							KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID)      //KTX비용
							if (KTX_MONEY.trim() != '0' && KTX_MONEY.trim() != '') {
								_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';
							}
							//도착대표역 -> 도착지(1만원) Summary
							_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + STD_MONEY.toComma() + ')';

						} else if (_me.GetKtxExpense(KTX_YONGSAN, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") { //용산->도착지역의대표역
							//_me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
							//KTX_YONGSAN, pAry[E_KTX_CODE], pAry[E_ADMIN_CODE], pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]) <> 0 then  //용산->도착지역의대표역
							// GetKtxExpense(KTX_YONGSAN, pAry[E_KTX_CODE], pAry[E_ADMIN_CODE], pAry[E_ADMIN_CODE], pAry[I_INSACODE], pAry[I_DATEID]) <> 0 then  //용산->도착지역의대표역
							console.log("용산->도착지역의대표역");
							S_KTX_CODE = KTX_YONGSAN;
							S_KTX_NAME = '용산';
							CAR_MONEY = parseInt(STD_MONEY) * 2; //동두->용산(1만원) + 도착대표역 -> 도착지(1만원)
							CAR_MONEY = CAR_MONEY + "";

							if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
								_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + STD_MONEY.toComma() + '), ';
							}

							KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID)      //KTX비용
							if (KTX_MONEY.trim() != '0' && KTX_MONEY.trim() != '') {
								_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';
							}

							//도착대표역 -> 도착지(1만원) Summary
							_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + STD_MONEY.toComma() + ')';

						} else {
							//자동차요금지급.
							console.log("자동차요금지급");
							CAR_MONEY = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID); // + STD_MONEY) //대표역까지 KTX노선 없을 경우 => 자동차요금계산  +  동두->서울(1만원)
							//동두천 -> 서울역(1만원) Summary
							if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
								_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + '), ';
								//pAry[_SUMMARY]  := pAry[S_REGION_NAME] + ' ▶ ' + pAry[E_REGION_NAME] + '차량(' + GetFormatMoney(FloatToStr(GetCarExpense(pAry))) + '), ';
							}


						}

					} else {//목적지가 KTX역
						console.log("목적지가 KTX역");
						//서울역 출발
						if (_me.GetKtxExpense(KTX_SEOUL, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") { //서울->도착지
							console.log("서울 KTX역");
							S_KTX_CODE = KTX_SEOUL;
							S_KTX_NAME = '서울';
							CAR_MONEY = STD_MONEY;  //동두->서울(1만원)
							if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
								_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + STD_MONEY.toComma() + '), ';
							}

							KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID)      //KTX비용
							if (KTX_MONEY.trim() != '0' && KTX_MONEY.trim() != '') {
								_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';
							}

						} else if (_me.GetKtxExpense(KTX_YONGSAN, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") { //서울->도착지
							console.log("용산 KTX역");
							S_KTX_CODE = KTX_YONGSAN;
							S_KTX_NAME = '용산';
							CAR_MONEY = STD_MONEY;  //동두->용산(1만원)
							if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
								_SUMMARY = S_REGION_NAME + '▶' + S_KTX_NAME + '차량(' + STD_MONEY.toComma() + '), ';
							}

							KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID)      //KTX비용	
							if (KTX_MONEY.trim() != '0' && KTX_MONEY.trim() != '') {
								_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';
							}


						} else {
							//(서울 or 용산) -> 도착지까지 KTX 노선 없을 경우.
							//도착지의 대표 KTX역
							console.log("도착지의 대표 KTX역");
							var ktxconame = _me.GetRepresentKTX(E_ADMIN_CODE);
							E_KTX_CODE = ktxconame[0];
							E_KTX_NAME = ktxconame[1];

							pImsiKtx = "0";
							pImsiCar = "0";
							if (_me.GetKtxExpense(E_KTX_CODE, E_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") {
								pImsiKtx = _me.GetKtxExpense(E_KTX_CODE, E_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
								pImsiKtxSummary = E_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + pImsiKtx.toComma() + ') ';
							} else {
								pImsiCar = STD_MONEY;   //대중교통비(10,000)원
								pImsiCarSummary = E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + STD_MONEY.toComma() + ') ';

							}

							if (_me.GetKtxExpense(KTX_SEOUL, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") { //서울->도착지대표역
								console.log("서울->도착지대표역");
								S_KTX_CODE = KTX_SEOUL;
								S_KTX_NAME = '서울';
								CAR_MONEY = STD_MONEY;  //동두->서울(1만원)									
								_SUMMARY = S_REGION_NAME + '▶서울차량(' + STD_MONEY.toComma() + '), ';

								KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID)      //KTX비용	
								_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';

								if (pImsiKtx != "0") {

									KTX_MONEY = parseInt(pImsiKtx) + parseInt(KTX_MONEY);      //KTX비용
									KTX_MONEY = KTX_MONEY + "";
									_SUMMARY = _SUMMARY + pImsiKtxSummary;
								} else if (pImsiCar != "0") {
									CAR_MONEY = parseInt(pImsiCar) + parseInt(CAR_MONEY); //동두->서울(1만원)
									CAR_MONEY = CAR_MONEY + "";
									_SUMMARY = _SUMMARY + pImsiCarSummary;
								}
								//_me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
							} else if (_me.GetKtxExpense(KTX_YONGSAN, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") { //용산->도착지대표역
								console.log("용산->도착지대표역1");
								S_KTX_CODE = KTX_YONGSAN;
								S_KTX_NAME = '용산';
								CAR_MONEY = STD_MONEY;  //동두->용산(1만원)									
								_SUMMARY = S_REGION_NAME + '▶용산차량(' + STD_MONEY.toComma() + '), ';
								KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID)      //KTX비용	
								_SUMMARY = _SUMMARY + S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';

								if (pImsiKtx != "0") {

									KTX_MONEY = parseInt(pImsiKtx) + parseInt(KTX_MONEY);      //KTX비용
									KTX_MONEY = KTX_MONEY + "";
									_SUMMARY = _SUMMARY + pImsiKtxSummary;
								} else if (pImsiCar != "0") {
									CAR_MONEY = parseInt(pImsiCar) + parseInt(CAR_MONEY); //동두->서울(1만원)
									CAR_MONEY = CAR_MONEY + "";
									_SUMMARY = _SUMMARY + pImsiCarSummary;
								}




							} else {
								console.log("자동차요금지급");
								//자동차요금지급.
								CAR_MONEY = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);  //대표역까지 KTX노선 없을 경우 => 자동차요금계산
								CAR_MONEY = parseInt(CAR_MONEY) + parseInt(STD_MONEY);
								CAR_MONEY = CAR_MONEY + "";
								var car_money1 = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID)
								_SUMMARY = S_REGION_NAME + '▶서울차량(' + STD_MONEY.toComma() + '), ';
								_SUMMARY = _SUMMARY + "서울▶" + E_REGION_NAME + '차량(' + car_money1.toComma() + '), ';
								//pAry[CAR_MONEY] := FloatToStr(GetCarExpense(pAry) + STD_MONEY);
								//pAry[_SUMMARY]  := pAry[S_REGION_NAME] + '▶서울차량(' + GetFormatMoney(FloatToStr(STD_MONEY)) + '), ';
								//pAry[_SUMMARY]  := pAry[_SUMMARY] + '서울▶' + pAry[E_REGION_NAME] + '차량(' + GetFormatMoney(FloatToStr(GetCarExpense(pAry))) + ') ';


							}


						}
					}
				}



				console.log("GetDongduStart 끝" + KTX_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
				return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
			},
			//부산 스타트시 출장비 조회
			GetPusanStart: function (S_ADMIN_CODE, S_ADMIN_NAME, S_REGION_CODE, S_REGION_NAME,
				E_ADMIN_CODE, E_ADMIN_NAME, E_REGION_CODE, E_REGION_NAME,
				I_DATEID, I_INSACODE, P_TRIPGUBUN, P_REGIONCOUNT, S_KTX_CODE, S_KTX_NAME, E_KTX_CODE, E_KTX_NAME) {

				var pKtxCode, pKtxName;
				var pImsiMoney = 0, pImsiMoney2 = 0;
				var KTX_DONGDU = '9997';
				var ADMIN_INCHON = '03';
				var KTX_SEOUL = '0002';
				var STD_MONEY = "10000";
				var _SUMMARY = "";
				var KTX_MONEY = "0";
				var CAR_MONEY = "0";
				var AIR_MONEY = "0";
				var _me = _$$.aprv_sub003.subdoc;

				S_KTX_CODE = S_REGION_CODE;
				S_KTX_NAME = S_REGION_NAME;

				//도착 동두천이거나 인천이면 
				console.log("GetPusanStart E_REGION_CODE=" + E_REGION_CODE)
				console.log("GetPusanStart KTX_DONGDU=" + KTX_DONGDU)
				console.log("GetPusanStart E_ADMIN_CODE=" + E_ADMIN_CODE)
				console.log("GetPusanStart ADMIN_INCHON=" + ADMIN_INCHON)
				console.log("GetPusanStart I_INSACODE=" + I_INSACODE)
				if (E_REGION_CODE == KTX_DONGDU || E_ADMIN_CODE == ADMIN_INCHON) {
					console.log("도착 동두천")
					E_KTX_CODE = KTX_SEOUL;
					E_KTX_NAME = "서울";
					KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);

					//KTX_MONEY 값이 있으면 sumary 값추가
					if (KTX_MONEY.trim() != '0' && KTX_MONEY.trim() != '') {
						_SUMMARY = S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';
					}

					CAR_MONEY = STD_MONEY;   //대중교통비(10,000)원 추가
					if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
						_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + '), ';
					}

				} else {
					console.log("도착 동두천 아니면")
					// 도착 동두천이거나 인천이 아니면 진행						
					if (E_REGION_CODE.toUpperCase() == 'XXXX' || E_REGION_CODE.substring(1, 2) == '9' || E_REGION_CODE == '') {
						console.log("KTX역 아니면")
						//KTX역 아님(도착역)
						//0002,서울 넘어옴
						var ktxconame = _me.GetRepresentKTX(E_ADMIN_CODE);
						E_KTX_CODE = ktxconame[0];
						E_KTX_NAME = ktxconame[1];

						if (_me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") {
							//대표역까지 KTX + 10,000

							KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
							if (KTX_MONEY.trim() != "0" && KTX_MONEY.trim() != "") {
								_SUMMARY = S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + ')，';
							}

							CAR_MONEY = STD_MONEY;   //대중교통비(10,000)원
							if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
								_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + '), ';
							}
						} else {
							console.log("KTX 금액이 0 이면 차량금액 으로 이동 자동차요금계산")
							//20230315 KTX 금액이 0 이면 차량금액 으로 이동 자동차요금계산
							CAR_MONEY = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
							if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
								_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
							}

						}


					} else {  //목적지가 KTX역
						console.log("목적지가 KTX역")
						//console.log(_me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID))
						if (_me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") {
							console.log("출발지->목적지 KTX노선 있을 경우 : KTX요금지급")
							//출발지->목적지 KTX노선 있을 경우 : KTX요금지급							
							KTX_MONEY = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);//KTX비용

							if (KTX_MONEY.trim() != "0" && KTX_MONEY.trim() != "") {
								_SUMMARY = S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + KTX_MONEY.toComma() + '), ';
								console.log(_SUMMARY)
							}
						} else {
							// GetKtxExpense KTX 값이 0 이면 
							console.log("GetKtxExpense KTX 값이 0 이면 ")
							var ktxconame = _me.GetRepresentKTX(E_ADMIN_CODE);
							E_KTX_CODE = ktxconame[0];
							E_KTX_NAME = ktxconame[1];

							if (_me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") {
								//대표역까지 KTX노선 있을경우
								console.log("대표역까지 KTX노선 있을경우")
								pImsiMoney = _me.GetKtxExpense(S_KTX_CODE, S_ADMIN_CODE, E_KTX_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
								if (pImsiMoney.trim() != '0') {
									_SUMMARY = S_KTX_NAME + '▶' + E_KTX_NAME + 'KTX(' + pImsiMoney.toComma() + '), ';
								}

								if (_me.GetKtxExpense(E_KTX_CODE, E_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) != "0") {

									pImsiMoney2 = _me.GetKtxExpense(E_KTX_CODE, E_ADMIN_CODE, E_REGION_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);
									if (pImsiMoney2.trim() != '0') {
										_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + 'KTX(' + pImsiMoney2.toComma() + '), ';
									}

									KTX_MONEY = parseInt(pImsiMoney) + parseInt(pImsiMoney2);      //KTX비용
									KTX_MONEY = KTX_MONEY + ""
								} else {

									KTX_MONEY = pImsiMoney;
									CAR_MONEY = STD_MONEY;
									KTX_MONEY = KTX_MONEY + ""
									_SUMMARY = _SUMMARY + E_KTX_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + '), ';
								}

							} else {
								console.log("대표역까지 KTX노선 없을 경우 => 자동차요금계산")
								CAR_MONEY = _me.GetCarExpense(S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID);  //대표역까지 KTX노선 없을 경우 => 자동차요금계산
								if (CAR_MONEY.trim() != '0' && CAR_MONEY.trim() != '') {
									_SUMMARY = S_REGION_NAME + '▶' + E_REGION_NAME + '차량(' + CAR_MONEY.toComma() + ') ';
								}
							}
						}
					}


				}
				console.log("GetPusanStart 끝" + KTX_MONEY + " " + CAR_MONEY + " " + _SUMMARY)
				return [KTX_MONEY.toComma(), AIR_MONEY.toComma(), CAR_MONEY.toComma(), _SUMMARY]
			},
			//KTX 계산
			GetKtxExpense: function (S_KTX_CODE, pS_ADMIN_CODE, E_KTX_CODE, pE_ADMIN_CODE, pI_INSACODE, pI_DATEID) {
				var _me = _$$.aprv_sub003.subdoc;
				var KTX_SEOUL = '0002';
				var ADMIN_DAEJEON = '06';
				var ADMIN_SEOUL = '01';
				var dMoney = "";
				var dMoney1 = "";
				console.log(S_KTX_CODE + " " + pS_ADMIN_CODE + " " + E_KTX_CODE + " " + pE_ADMIN_CODE + " " + pI_INSACODE + " " + pI_DATEID)

				if (S_KTX_CODE == KTX_SEOUL) {
					//출발 KTX코드가 서울KTX일때
					dMoney = _me.GetKtxFromSeoul(S_KTX_CODE, E_KTX_CODE, pI_DATEID);
				} else if (pS_ADMIN_CODE == ADMIN_SEOUL) {
					//출발 서울
					dMoney = _me.GetKtxFromSeoul(S_KTX_CODE, E_KTX_CODE, pI_DATEID);
				} else if (pS_ADMIN_CODE == ADMIN_DAEJEON) {
					//출발 대전
					dMoney = _me.GetKtxFromDaeJeon(S_KTX_CODE, E_KTX_CODE, pI_DATEID);
				} else if (E_KTX_CODE == KTX_SEOUL) {
					//도착 코드가 서울
					console.log("도착 코드가 서울 진행");
					dMoney = _me.GetKtxToSeoul(S_KTX_CODE, E_KTX_CODE, pI_DATEID);
				} else if (pE_ADMIN_CODE == ADMIN_SEOUL) {
					//도착 코드가 서울
					dMoney = _me.GetKtxToSeoul(S_KTX_CODE, E_KTX_CODE, pI_DATEID);
				} else if (pE_ADMIN_CODE == ADMIN_DAEJEON) {
					//도착 코드가 대전
					dMoney = _me.GetKtxToDaeJeon(S_KTX_CODE, E_KTX_CODE, pI_DATEID);
				} else {

					//dMoney = _me.GetKtxExpenseES(S_KTX_CODE, E_KTX_CODE, pI_DATEID,pI_INSACODE) 				
					dMoney = _me.GetKtxExpensebasic(S_KTX_CODE, E_KTX_CODE, pI_DATEID, pI_INSACODE);
				}
				//인사코드별 요금 더하기 
				if (dMoney == "0") { //ktx 요금 0이면 0 리턴
					dMoney = "0"
				} else {
					dMoney1 = _me.GetKtxExpenseES(S_KTX_CODE, E_KTX_CODE, pI_DATEID, pI_INSACODE, dMoney);
					//console.log("진행2======="+dMoney)
					dMoney = parseInt(dMoney) + parseInt(dMoney1);
					dMoney = dMoney + "";

				}

				console.log("GetKtxExpense=======" + dMoney)
				return dMoney;
			},
			//출발 KTX 서울 일때
			GetKtxFromSeoul: function (S_KTX_CODE, E_KTX_CODE, pI_DATEID) {

				var GetKtxFromSeoulMoney = "";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: S_KTX_CODE,
						pEKtxCode: E_KTX_CODE,
						pDateid: pI_DATEID,
						actiontype: "GetKtxFromSeoul"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					GetKtxFromSeoulMoney = data.money;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetKtxFromSeoulMoney===" + GetKtxFromSeoulMoney)
				return GetKtxFromSeoulMoney;
			},
			//출발 KTX 대전 일때
			GetKtxFromDaeJeon: function (S_KTX_CODE, E_KTX_CODE, pI_DATEID) {

				var GetKtxFromDaeJeonMoney = "";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: S_KTX_CODE,
						pEKtxCode: E_KTX_CODE,
						pDateid: pI_DATEID,
						actiontype: "GetKtxFromDaeJeon"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					GetKtxFromDaeJeonMoney = data.money;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetKtxFromDaeJeonMoney===" + GetKtxFromDaeJeonMoney)
				return GetKtxFromDaeJeonMoney;
			},
			//도착 KTX 서울 일때
			GetKtxToSeoul: function (S_KTX_CODE, E_KTX_CODE, pI_DATEID) {

				var GetKtxToSeoulMoney = "";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: S_KTX_CODE,
						pEKtxCode: E_KTX_CODE,
						pDateid: pI_DATEID,
						actiontype: "GetKtxToSeoul"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					GetKtxToSeoulMoney = data.money;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetKtxToSeoulMoney===" + GetKtxToSeoulMoney)
				return GetKtxToSeoulMoney;
			},
			//도착 KTX 대전 일때
			GetKtxToDaeJeon: function (S_KTX_CODE, E_KTX_CODE, pI_DATEID) {

				var GetKtxToDaeJeonMoney = "";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: S_KTX_CODE,
						pEKtxCode: E_KTX_CODE,
						pDateid: pI_DATEID,
						actiontype: "GetKtxToDaeJeon"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					GetKtxToDaeJeonMoney = data.money;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetKtxToDaeJeon===" + GetKtxToDaeJeonMoney)
				return GetKtxToDaeJeonMoney;
			}
			,
			//도착 KTX else 조건 기본
			GetKtxExpensebasic: function (S_KTX_CODE, E_KTX_CODE, pI_DATEID, pI_INSACODE) {

				var GetKtxExpensebasicMoney = "";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: S_KTX_CODE,
						pEKtxCode: E_KTX_CODE,
						pDateid: pI_DATEID,
						pI_INSACODE: pI_INSACODE,
						actiontype: "GetKtxExpensebasic"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					GetKtxExpensebasicMoney = data.money;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetKtxExpensebasicMoney===" + GetKtxExpensebasicMoney)
				return GetKtxExpensebasicMoney;
			}
			,
			//도착 KTX 인사코드별 ktx 금액 더하기
			GetKtxExpenseES: function (S_KTX_CODE, E_KTX_CODE, pI_DATEID, pI_INSACODE, dMoney) {

				var GetKtxExpenseESMoney = "";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: S_KTX_CODE,
						pEKtxCode: E_KTX_CODE,
						pDateid: pI_DATEID,
						pI_INSACODE: pI_INSACODE,
						dmoney: dMoney,
						actiontype: "GetKtxExpenseES"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					GetKtxExpenseESMoney = data.money;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetKtxExpenseESMoney===" + GetKtxExpenseESMoney)
				return GetKtxExpenseESMoney;
			}
			,
			//KTX 역 조회?
			GetRepresentKTX: function (ADMIN_CODE) {

				var ktxcode = "";
				var ktxname = "";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: ADMIN_CODE,
						actiontype: "GetRepresentKTX"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					ktxcode = data.ktxcode;
					ktxname = data.ktxname;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetRepresentKTX===" + ktxcode + " " + ktxname)
				return [ktxcode, ktxname];
			}
			,
			//자동차 이동 금액 조회?
			GetCarExpense: function (S_ADMIN_CODE, E_ADMIN_CODE, I_INSACODE, I_DATEID) {
				var _me = _$$.aprv_sub003.subdoc;
				var result = "";
				var sCarCode = _me.GetRepresentKTX(S_ADMIN_CODE);
				sCarCode = sCarCode[0];
				console.log("sCarCode==" + sCarCode)
				var ECarCode = _me.GetRepresentKTX(E_ADMIN_CODE);
				ECarCode = ECarCode[0];
				console.log("ECarCode==" + ECarCode)
				var gDistince = _me.GetDistince4Car(sCarCode, ECarCode);
				var gUnitMoney = _me.GetUnitMoney4Car(I_INSACODE, I_DATEID);
				console.log("gDistince==" + gDistince);
				console.log("gUnitMoney==" + gUnitMoney);

				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: gDistince,
						pEKtxCode: gUnitMoney,
						actiontype: "GetCarExpense"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					result = data.car;

				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetCarExpense===" + result);


				return result;
			}

			,
			//자동차 이동거리 조회?
			GetDistince4Car: function (sCarCode, ECarCode) {
				var distince = "0";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: sCarCode,
						pEKtxCode: ECarCode,
						actiontype: "GetDistince4Car"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					//데이터 값 202↙202 값이 2행이라 배열로 만들어 첫 번째 원소를 씀
					distince = data.distince;
					if (distince.indexOf("↙") > -1) {

						distince = distince.split("↙");
						distince = distince[0]
					}



				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetDistince4Car==========" + distince);


				return distince;
			}
			,
			//자동차 금액 조회?
			GetUnitMoney4Car: function (pInsaCode, pDateid) {
				var result = "0";
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pSKtxCode: pInsaCode,
						pEKtxCode: pDateid,
						actiontype: "GetUnitMoney4Car"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//rtn = $dwp.core.util.exObjList(data, opt);
					result = data.car;

				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				console.log("GetUnitMoney4Car==========" + result);


				return result;
			},
			initInputTable: function (_opt, $doc, jdata) {
				var _me = _$$.aprv_sub003.subdoc;
				var el = $doc.elelment;
				var _tableVal = $("input[name=fld_formdata]", $doc.element).val();
				//var _tbdata="";
				if (jdata != "") {
					_tableVal = jdata
				}

				var _$table = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table01']", $doc.element), {
					isedit: _opt.isedit
					, initdata: _tableVal
					, template: "[name=_template]"
					, keyfield: ["_USER"]
					, changeafter: function (act) {
						if (act == "del") {
							//_me.cal_sum1(el); 
							// _me.cal_sum2(el); 
						} else if (act == "add") {
							// _me.cal_sum2(el); 
						} else if (act == "copy") {
							// _me.cal_sum1(el); 
						}
					}
					, cell: [
						{
							nm: "no", type: "custom", vfnm: "_No"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_No']", $cell);
									_$type.xval(val);

								} else {
									$cell.html("<div class='dwp-center'>" + "정액" + "</div>");
								}
							}
						},
						{
							nm: "startday", type: "custom", vfnm: "_STARTDAY"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_STARTDAY']", $cell);
									_$type.xval(val);
									//_me.cal_sum1(el,$tr); 
								} else {
									$cell.html("<div class='dwp-center'>" + val + "</div>");
								}
							}
						},

						{
							nm: "air", type: "custom", vfnm: "_AIR"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_AIR']", $cell);
									_$type.xval(val);
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "ktx", type: "custom", vfnm: "_KTX"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_KTX']", $cell);
									_$type.xval(val);


								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "car", type: "custom", vfnm: "_CAR"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_CAR']", $cell);
									_$type.xval(val);
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "sleep", type: "custom", vfnm: "_SLEEP"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_SLEEP']", $cell);
									_$type.xval(val);
									var _sum = 0

									_$type.on("blur", function () {
										var _AIR = $("input[name='_AIR']", $tr).xval();
										var _KTX = $("input[name='_KTX']", $tr).xval();
										var _CAR = $("input[name='_CAR']", $tr).xval();
										var _SLEEP = $("input[name='_SLEEP']", $cell).xval();
										var _EAT = $("input[name='_EAT']", $tr).xval();
										var _DAY = $("input[name='_DAY']", $tr).xval();
										var _MINOR = $("input[name='_MINOR']", $tr).xval();
										_sum = (parseInt(_AIR) + parseInt(_KTX) + parseInt(_CAR) + parseInt(_SLEEP) + parseInt(_EAT) + parseInt(_DAY)) - parseInt(_MINOR);
										console.log("_AIR", _AIR)
										console.log("_KTX", _KTX)
										console.log("CAR", _CAR)
										console.log("_SLEEP", _SLEEP)
										console.log("_EAT", _EAT)
										console.log("_DAY", _DAY)
										console.log("_MINOR", _MINOR)
										console.log(_sum)
										$("input[name='_SUM']", $tr).xval(_sum);

										_me.cal_sum_sleep(el);
										_me.cal_sum_allsum(el);

									});
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "eat", type: "custom", vfnm: "_EAT"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_EAT']", $cell);
									_$type.xval(val);
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "day", type: "custom", vfnm: "_DAY"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_DAY']", $cell);

									_$type.xval(val);
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "minor", type: "custom", vfnm: "_MINOR"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_MINOR']", $cell);

									_$type.xval(val);
									_$type.on("click", function () {
										var _sleepfee = $("input[name='_SLEEP']", $tr).xval();
										var _eatfee = $("input[name='_EAT']", $tr).xval();
										var _day = $("input[name='_DAY']", $tr).xval();
										var _startday = $("input[name='_STARTDAY']", $tr).xval();
										var _air = $("input[name='_AIR']", $tr).xval();
										var _ktx = $("input[name='_KTX']", $tr).xval();
										var _car = $("input[name='_CAR']", $tr).xval();
										_me.Select_Order_Form($doc, $tr, $cell, _sleepfee, _eatfee, _startday, _day, _air, _ktx, _car);

									});
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "sum", type: "custom", vfnm: "_SUM"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_SUM']", $cell);
									_$type.xval(val);
								} else {
									$cell.html("<div class='dwp-right'>" + val + "</div>");
								}
							}
						},
						{
							nm: "bigo", type: "text", vfnm: "_BIGO"
							, drawfn: function (val, $cell, $tr, inst) {
								if (inst.options.isedit) {
									var _$type = $("input[name='_BIGO']", $cell);
									_$type.xval(val);
								} else {
									$cell.html("<div class='dwp-left'>" + val + "</div>");
								}
							}
						}
					]
				});

				//하나의 row는 무조건 생성
				if (_opt.isnew) {
					//_$table.add();

				}
				return _$table;
			},
			/**
			 * [차감비 클릭시]
			 * @param {*} $doc
			 */
			Select_Order_Form: function ($doc, tr, cell, sleepfee, eatfee, startday, _day, _air, _ktx, _car) {
				var _me = this, _html = [], _buttons = [], _options = $doc.options;

				_html.push("<div class=\"select_order_form\">");

				_html.push("	<div class=\"dwp-section tiny-type\" data-top=\"xs\">");
				_html.push("		<div class=\"dwp-table-vertical form-type line-type\">");
				_html.push("			<table class=\"SubFormTable\">");
				_html.push("				<colgroup><col width=30%></col><col width=70%></col></colgroup>");
				_html.push("				<tr><th><div class=\"dwp-title dwp-center\" data-xlang=\"LC_TEXT\">차감내역</div></th>");	//차감비
				_html.push("				<td> <div class=dwp-checkbox><label><input name=S_1 type=checkbox data-xlang-txt=조식 value=조식><span>조식</span></label></div><BR>")
				_html.push("				<div class=dwp-checkbox><label><input name=S_2 type=checkbox data-xlang-txt=중식 value=중식><span>중식</span></label></div><BR>")
				_html.push("				<div class=dwp-checkbox><label><input name=S_3 type=checkbox data-xlang-txt=석식 value=석식><span>석식</span></label></div><BR>")
				_html.push("				<div class=dwp-checkbox><label><input name=S_4 type=checkbox data-xlang-txt=숙박비 value=숙박비><span>숙박비</span></label></div>")
				_html.push("</td></tr>");
				_html.push("			</table>");
				_html.push("		</div>");
				_html.push("	</div>");
				_html.push("</div>");
				_html.push("</div>");
				_html.push("<br>");
				_html.push("<div id=\"SearchOption\">");						//발주서 검색 화면
				_html.push("	<div class=\"dwp-section tiny-type\">");
				_html.push("		<div class=\"aligner\" >");
				_html.push("			<div class=\"center\">");
				_html.push("				<div class=\"dwp-btn btn_search\"><span>" + $fn.getCodeMsg("확인") + "</span></div>");	//조회
				_html.push("				<div class=\"dwp-btn btn_cancel\"><span>" + $fn.getCodeMsg("comm.btn.cancel") + "</span></div>");	//취소
				_html.push("			</div>");
				_html.push("		</div>");
				_html.push("	</div>");

				$fn.dialog(null, {
					modal: true,
					resizable: true,
					draggable: true,
					title: $fn.getCodeMsg("차감비"),	//조회기준선택
					width: 350,
					height: 300,
					show: "fade", //effect
					hide: "fade", //effect
					ismobile: false,
					buttons: _buttons,
					open: function (_opt) {
						var _this = this, _dlg = _opt.target, nDate = new Date(), _dlg_instance = $(_opt.target).xdialog("instance");

						//숙박비가 0 이면 차감비 팝업 열릴때 숙박비 체크박스 비활성화 
						console.log("숙박비" + sleepfee + eatfee);
						var sleepfee1 = sleepfee;

						if (sleepfee == "0") {
							$("input[name=S_4]", _dlg).prop("disabled", true);
						}


						var _eat = eatfee;

						$("div.btn_search", _dlg).off("click").on("click", function () {		//확인
							eatfee = parseInt(eatfee) / 3
							console.log(eatfee);


							var morning = $('input:checkbox[name=S_1]:checked').length;
							var afternoon = $('input:checkbox[name=S_2]:checked').length;
							var night = $('input:checkbox[name=S_3]:checked').length;
							var vsleep = $('input:checkbox[name=S_4]:checked').length;
							console.log(sleepfee);
							console.log(morning)
							console.log(afternoon)
							console.log(night)
							var _sum = parseInt(morning) + parseInt(afternoon) + parseInt(night);
							//$(':checkbox[name=vehicle]').next('label').text();
							var morningtext = $('input:checkbox[name=S_1]:checked').val();
							var afternoontext = $('input:checkbox[name=S_2]:checked').val();
							var nighttext = $('input:checkbox[name=S_3]:checked').val();
							var sleeptext = $('input:checkbox[name=S_4]:checked').val();

							if (vsleep == 1) {
								sleepfee = sleepfee
							} else {
								sleepfee = "0";
							}
							//식비와 선택된 갯수를 곱하고 숙박료 더해서 합계 
							//alert(_sum)
							_sum = (eatfee * _sum) + parseInt(sleepfee);

							if ($("input[name='_MINOR']", cell).xval() == "0") {
								$("input[name='_MINOR']", cell).xval(parseInt(_sum));
							} else {
								$("input[name='_MINOR']", cell).xval(parseInt($("input[name='_MINOR']", cell).xval()) + parseInt(_sum))
							}



							//R_6 기타사항에 조식중식 제외 정보 넣기
							//startday

							if (morning != 1) {
								morningtext = "";
							} else if (morning == 1 && afternoon == 1 || morning == 1 && night == 1 || morning == 1 && vsleep == 1) {
								morningtext = morningtext + ",";
							}
							if (afternoon != 1) {
								afternoontext = "";
							} else if (afternoon == 1 && night == 1 || afternoon == 1 && vsleep == 1) {
								afternoontext = afternoontext + ",";
							}
							if (night != 1) {
								nighttext = "";
							} else if (night == 1 && vsleep == 1) {
								nighttext = nighttext + ",";
							}
							if (vsleep != 1) {
								sleeptext = "";
							}


							//기타사항 입력
							if ($("[name='R_6']", $doc.elelment).val() == "") {
								$("[name='R_6']", $doc.elelment).val(startday + "(" + morningtext + "" + afternoontext + "" + nighttext + "" + sleeptext + " 제외)");
							} else {
								$("[name='R_6']", $doc.elelment).val($("[name='R_6']", $doc.elelment).val() + "\n"
									+ startday + "(" + morningtext + "" + afternoontext + "" + nighttext + "" + sleeptext + " 제외)")
							}
							//차감내역 입력
							if ($("[name='R_2']", $doc.elelment).val() == "") {
								$("[name='R_2']", $doc.elelment).val(startday + "(" + morningtext + "" + afternoontext + "" + nighttext + "" + sleeptext + " 제외)");
							} else {
								$("[name='R_2']", $doc.elelment).val($("[name='R_2']", $doc.elelment).val() + "\n"
									+ startday + "(" + morningtext + "" + afternoontext + "" + nighttext + "" + sleeptext + " 제외)")
							}

							//행 합계시 차감비 삭제하여 합계 구하기 


							var minus = $("input[name='_MINOR']", cell).val();
							var _minussum = (parseInt(_day) + parseInt(_air) + parseInt(_ktx) + parseInt(_car) + parseInt(sleepfee1) + parseInt(_eat)) - parseInt(minus);
							//40000 0 167400 undefined 0 30000 20000
							console.log(_day + " " + _air + " " + _ktx + " " + _car + " " + sleepfee1 + " " + _eat + " " + minus);
							$("input[name='_SUM']", tr).xval(_minussum);

							_me.cal_sum_minor($doc.elelment);
							_me.cal_sum_allsum($doc.elelment);

							_dlg_instance.close();

						});

						$("div.btn_cancel", _dlg).off("click").on("click", function () {		//취소 버튼
							_dlg_instance.close();
						});

					},
					content: { html: _html.join("") }
				});
			}
			, cal_sum_ktx: function (el) {
				var _me = _$$.aprv_sub003.subdoc;
				var _$input_tbl = $("table[name=sub003_Table01]", el);

				var _$input_trs = $("tr", _$input_tbl);
				var _supply_sum = 0;
				$.each(_$input_trs, function (i_index, input_tr) {
					var _$input_tr = $(input_tr);

					if ($("input[name='_KTX']", _$input_tr).size() > 0) {
						var _$isupply = $("input[name='_KTX']", _$input_tr);

						console.log("val : ", _$isupply.xval());

						var _isupply = _$isupply.xval();
						_isupply = _isupply.replace(/,/gi, "");
						if (_isupply == "") {
							_isupply = "0";
						}
						_$isupply.xval(_isupply);
						_supply_sum += parseFloat(_isupply);
					}
				});
				//비정액 더하기
				_supply_sum = _supply_sum + parseInt($("input[name='D2_1_2']", _$input_tbl).xval());
				_supply_sum += "";

				console.log("sum : ", _supply_sum);

				//INPUT Table의 총합계
				$("input[name='D3_1_2']", _$input_tbl).xval(_supply_sum);

			}
			, cal_sum_air: function (el) {
				var _me = _$$.aprv_sub003.subdoc;
				var _$input_tbl = $("table[name=sub003_Table01]", el);

				var _$input_trs = $("tr", _$input_tbl);
				var _supply_sum = 0;
				$.each(_$input_trs, function (i_index, input_tr) {
					var _$input_tr = $(input_tr);

					if ($("input[name='_AIR']", _$input_tr).size() > 0) {
						var _$isupply = $("input[name='_AIR']", _$input_tr);

						console.log("val : ", _$isupply.xval());

						var _isupply = _$isupply.xval();
						_isupply = _isupply.replace(/,/gi, "");
						if (_isupply == "") {
							_isupply = "0";
						}
						_$isupply.xval(_isupply);
						_supply_sum += parseFloat(_isupply);
					}
				});
				//비정액 더하기
				_supply_sum = _supply_sum + parseInt($("input[name='D2_1_1']", _$input_tbl).xval());
				_supply_sum += "";

				console.log("sum : ", _supply_sum);

				//INPUT Table의 총합계
				$("input[name='D3_1_1']", _$input_tbl).xval(_supply_sum);

			}
			, cal_sum_car: function (el) {
				var _me = _$$.aprv_sub003.subdoc;
				var _$input_tbl = $("table[name=sub003_Table01]", el);

				var _$input_trs = $("tr", _$input_tbl);
				var _supply_sum = 0;
				$.each(_$input_trs, function (i_index, input_tr) {
					var _$input_tr = $(input_tr);

					if ($("input[name='_CAR']", _$input_tr).size() > 0) {
						var _$isupply = $("input[name='_CAR']", _$input_tr);

						console.log("val : ", _$isupply.xval());

						var _isupply = _$isupply.xval();
						_isupply = _isupply.replace(/,/gi, "");
						if (_isupply == "") {
							_isupply = "0";
						}
						_$isupply.xval(_isupply);
						_supply_sum += parseFloat(_isupply);
					}
				});
				//비정액 더하기
				_supply_sum = _supply_sum + parseInt($("input[name='D2_1_3']", _$input_tbl).xval());
				_supply_sum += "";

				console.log("sum : ", _supply_sum);

				//INPUT Table의 총합계
				$("input[name='D3_1_3']", _$input_tbl).xval(_supply_sum);

			}
			, cal_sum_sleep: function (el) {
				var _me = _$$.aprv_sub003.subdoc;
				var _$input_tbl = $("table[name=sub003_Table01]", el);

				var _$input_trs = $("tr", _$input_tbl);
				var _supply_sum = 0;
				$.each(_$input_trs, function (i_index, input_tr) {
					var _$input_tr = $(input_tr);

					if ($("input[name='_SLEEP']", _$input_tr).size() > 0) {
						var _$isupply = $("input[name='_SLEEP']", _$input_tr);

						console.log("val : ", _$isupply.xval());

						var _isupply = _$isupply.xval();
						_isupply = _isupply.replace(/,/gi, "");
						if (_isupply == "") {
							_isupply = "0";
						}
						_$isupply.xval(_isupply);
						_supply_sum += parseFloat(_isupply);
					}
				});
				//비정액 더하기
				_supply_sum = _supply_sum + parseInt($("input[name='D2_1_4']", _$input_tbl).xval());
				_supply_sum += "";

				console.log("sum : ", _supply_sum);

				//INPUT Table의 총합계
				$("input[name='D3_1_4']", _$input_tbl).xval(_supply_sum);

			}, cal_sum_eat: function (el) {
				var _me = _$$.aprv_sub003.subdoc;
				var _$input_tbl = $("table[name=sub003_Table01]", el);

				var _$input_trs = $("tr", _$input_tbl);
				var _supply_sum = 0;
				$.each(_$input_trs, function (i_index, input_tr) {
					var _$input_tr = $(input_tr);

					if ($("input[name='_EAT']", _$input_tr).size() > 0) {
						var _$isupply = $("input[name='_EAT']", _$input_tr);

						console.log("val : ", _$isupply.xval());

						var _isupply = _$isupply.xval();
						_isupply = _isupply.replace(/,/gi, "");
						if (_isupply == "") {
							_isupply = "0";
						}
						_$isupply.xval(_isupply);
						_supply_sum += parseFloat(_isupply);
					}
				});
				//비정액 더하기
				_supply_sum = _supply_sum + parseInt($("input[name='D2_1_5']", _$input_tbl).xval());
				_supply_sum += "";

				console.log("sum : ", _supply_sum);

				//INPUT Table의 총합계
				$("input[name='D3_1_5']", _$input_tbl).xval(_supply_sum);

			}
			, cal_sum_day: function (el) {
				var _me = _$$.aprv_sub003.subdoc;
				var _$input_tbl = $("table[name=sub003_Table01]", el);

				var _$input_trs = $("tr", _$input_tbl);
				var _supply_sum = 0;
				$.each(_$input_trs, function (i_index, input_tr) {
					var _$input_tr = $(input_tr);

					if ($("input[name='_DAY']", _$input_tr).size() > 0) {
						var _$isupply = $("input[name='_DAY']", _$input_tr);

						console.log("val : ", _$isupply.xval());

						var _isupply = _$isupply.xval();
						_isupply = _isupply.replace(/,/gi, "");
						if (_isupply == "") {
							_isupply = "0";
						}
						_$isupply.xval(_isupply);
						_supply_sum += parseFloat(_isupply);
					}
				});
				//비정액 더하기
				_supply_sum = _supply_sum + parseInt($("input[name='D2_1_6']", _$input_tbl).xval());
				_supply_sum += "";

				console.log("sum : ", _supply_sum);

				//INPUT Table의 총합계
				$("input[name='D3_1_6']", _$input_tbl).xval(_supply_sum);

			}
			, cal_sum_minor: function (el) {
				var _me = _$$.aprv_sub003.subdoc;
				var _$input_tbl = $("table[name=sub003_Table01]", el);

				var _$input_trs = $("tr", _$input_tbl);
				var _supply_sum = 0;
				$.each(_$input_trs, function (i_index, input_tr) {
					var _$input_tr = $(input_tr);

					if ($("input[name='_MINOR']", _$input_tr).size() > 0) {
						var _$isupply = $("input[name='_MINOR']", _$input_tr);

						console.log("val : ", _$isupply.xval());

						var _isupply = _$isupply.xval();
						_isupply = _isupply.replace(/,/gi, "");
						if (_isupply == "") {
							_isupply = "0";
						}
						_$isupply.xval(_isupply);
						_supply_sum += parseInt(_isupply);
					}
				});
				//비정액 더하기
				_supply_sum = _supply_sum + parseInt($("input[name='D2_1_7']", _$input_tbl).xval());
				_supply_sum += "";

				console.log("sum : ", _supply_sum);

				//INPUT Table의 총합계
				$("input[name='D3_1_7']", _$input_tbl).xval(_supply_sum);

			}
			, cal_sum_allsum: function (el) {
				var _me = _$$.aprv_sub003.subdoc;
				var _$input_tbl = $("table[name=sub003_Table01]", el);

				var _$input_trs = $("tr", _$input_tbl);
				var _supply_sum = 0;
				$.each(_$input_trs, function (i_index, input_tr) {
					var _$input_tr = $(input_tr);

					if ($("input[name='_SUM']", _$input_tr).size() > 0) {
						var _$isupply = $("input[name='_SUM']", _$input_tr);

						console.log("val : ", _$isupply.xval());

						var _isupply = _$isupply.xval();
						_isupply = _isupply.replace(/,/gi, "");
						if (_isupply == "") {
							_isupply = "0";
						}
						_$isupply.xval(_isupply);
						_supply_sum += parseInt(_isupply);
					}
				});
				//비정액 차감비 더하기 
				_supply_sum = _supply_sum + parseInt($("input[name='D2_1_8']", _$input_tbl).xval());
				_supply_sum += "";

				console.log("sum : ", _supply_sum);

				//INPUT Table의 총합계
				$("input[name='D3_1_8']", _$input_tbl).xval(_supply_sum);

			}

			, numericCheck: function (arg1, arg2) {
				var tmp = arg1;
				tmp = tmp.replace(/,/gi, "");
				var absTmp = Math.abs(tmp);
				if (tmp.length == 1 && tmp == "") {
					Re = true;
				} else if (arg2 == 0) {		//소숫점 허용하지 않음
					var reDigit = /[^0-9]/;
					Re = reDigit.test(absTmp);
				} else {		//소숫점 허용
					var reDigit = /[^0-9.]/;
					Re = reDigit.test(absTmp);
				}
				if (Re) {
					return "0";
				} else {
					return tmp;
				}
			}

			/* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
			, save: function ($doc, opt) {
				var _me = _$$.aprv_sub003.subdoc;
				var el = $doc.element;
				var _aopt = $.extend({ actiontype: "" }, opt);

				var _aopt = $.extend({
					actiontype: ""
				}, opt);
				var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element).xtable("instance");

				//출장신청자 소속 직급 이름			
				$("input[name='H_5']", $doc.elelment).xval($("input[name='Deptname']", $doc.elelment).val());
				$("input[name='H_6']", $doc.elelment).xval($("input[name='titlename']", $doc.elelment).val());
				$("input[name='H_7']", $doc.elelment).xval($("input[name='ed_username']", $doc.elelment).val());
				//출장직무대리 소속 직급 이름
				$("input[name='H_8']", $doc.elelment).xval($("input[name='Deptname_1']", $doc.elelment).val());
				$("input[name='H_9']", $doc.elelment).xval($("input[name='titlename_1']", $doc.elelment).val());
				$("input[name='H_10']", $doc.elelment).xval($("input[name='ed_username_1']", $doc.elelment).val());
				//출장구분 텍스트로 넣기
				var h_15checkval;
				if ($("input[type=checkbox][name=gubun]:checked").val() == "1") {
					h_15checkval = "업무"
				} else if ($("input[type=checkbox][name=gubun]:checked").val() == "2") {
					h_15checkval = "국내학회,세미나"
				} else if ($("input[type=checkbox][name=gubun]:checked").val() == "3") {
					h_15checkval = "국외학회,세미나"
				} else if ($("input[type=checkbox][name=gubun]:checked").val() == "4") {
					h_15checkval = "국내외전시회"
				} else if ($("input[type=checkbox][name=gubun]:checked").val() == "5") {
					h_15checkval = "직무교육"
				}
				$("input[name='H_15']", $doc.elelment).xval(h_15checkval);
				//H_18 발신부서 결재자 넣기
				//AP^1^S^ko:관리자,en:zadmin^P00001^관리자/P00001/kiflt^C080001^C080612^ko:담당,en:^085^ko:임시,en:^510^C080612^ko:전산실,en:전산실^ko:한국신발피혁연구원,en:KIFLT,zh:한국신발피혁연구원^`}
				// AP^2^S^ko:이수빈,en:이수빈^P00104^이수빈/P00104/kiflt^A34710^A34700^ko:위촉사무원,en:^075^ko:위촉,en:^520^C080612^ko:대외협력실,en:대외협력실^ko:한국신발피혁연구원,en:KIFLT^`}
				//alert($("[name=sAppList1]").val() )
				var agreeaprline = $("input[name='sAppList1']", $doc.elelment).val();
				var agreeaprline1, agreeaprline2, agreeaprline3, agreeaprline4, vnamelist;
				console.log(agreeaprline)
				agreeaprline = agreeaprline.split(";");
				vnamelist = "";
				for (var i = 0; i < agreeaprline.length; i++) {
					//alert(agreeaprline[i])
					agreeaprline1 = agreeaprline[i].split(",");
					console.log(agreeaprline1[1])

					console.log(agreeaprline1[1].indexOf(":"))
					if (agreeaprline1[1].indexOf("^") > -1) {
						agreeaprline2 = agreeaprline1[1].split("^");
					} else {
						agreeaprline2 = agreeaprline1[2].split("^");
					}
					agreeaprline3 = agreeaprline2[5].split(":");
					agreeaprline4 = agreeaprline2[2].split("/");
					if (i == 0) {
						vnamelist = agreeaprline4[0] + " " + agreeaprline3[1];
					} else {
						vnamelist = vnamelist + "," + agreeaprline4[0] + " " + agreeaprline3[1];
					}


				}

				$("input[name='H_18']", $doc.elelment).val(vnamelist);
				if ($("[name=H_2] option:selected", $doc.element).val() == "2") {
					$("[name=Subject]", $doc.element).val("출장신청서 - 국외");

				} else {
					$("[name=Subject]", $doc.element).val("출장신청서 - 국내");
				}
				//alert(_aopt.actiontype);
				if (_aopt.actiontype == "draft") {

					$("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
					//Deptname

					return true;
				}




				if (_aopt.actiontype == "raise") {


					//출장시작일자와 교통비에 선택된 첫번째 일자가 다르면 결재 진행불가
					//†2023-08-16[수]†0†0†4
					if ($("[name=H_2] option:selected", $doc.element).val() == "2") {



					} else {
						//국내일때만 확인
						var __tableday = _$table.getData(false);
						__tableday = __tableday.split("†");
						__tableday = __tableday[1].split("[");
						console.log(__tableday[0]);
						console.log($("input[name='H_11']", $doc.elelment).xval())
						if ($("input[name='H_11']", $doc.elelment).xval() == __tableday[0]) {

						} else {
							$fn.alert({ msg: $fn.getCodeMsg("출장일정에서 선택한 날짜와 교통비에 계산된 날짜가 다릅니다. 교통비를 다시 계산하시거나 출장일정을 확인하세요.") });
							return false;
						}
					}


					if ($("input[name='H_3']", $doc.elelment).xval() == "") {
						$fn.alert({ msg: $fn.getCodeMsg("계정과목을 선택하세요.") });
						_isvalid = false;
						return false;
					}
					if ($("input[name='Deptname_1']", $doc.elelment).xval() == "") {
						$fn.alert({ msg: $fn.getCodeMsg("직무대리자를 입력하세요.") });
						_isvalid = false;
						return false;
					}
					if ($("input[name='D3_1_8']", $doc.elelment).xval() == "0" && $("[name=H_2] option:selected", $doc.element).val() == "1") {
						$fn.alert({ msg: $fn.getCodeMsg("교통비를 계산하세요") });
						_isvalid = false;
						return false;
					}



				}


				$("input[name=fld_formdata]", $doc.element).val(_$table.getData().replace(/\"/gi, '＂'));



				return true;
			}
		}
	}
}($dwp.cns("app"), jQuery));














































