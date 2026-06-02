/* Source File Upload Time : 2022-10-17 10:38:30 AM*/


/* Source File Upload Time : 2020-12-03 3:41:41 PM*/


/* Source File Upload Time : 2020-09-22 9:52:43 AM*/


/* Source File Upload Time : 2020-07-14 2:15:31 AM*/


/* Source File Upload Time : 2020-07-10 1:50:43 PM*/


/* Source File Upload Time : 2019-10-22 12:36:39 AM*/


/* Source File Upload Time : 2019-10-11 4:20:29 PM*/


/* Source File Upload Time : 2019-10-11 2:28:56 PM*/


/**
 * 전자결재 보조양식 - 출장정산서 (일반)
 * $dwp.app.aprv_sub223
 */
 
(function(_$$, $){
	_$$.aprv_sub223 = {
		subdoc : {
			SUBNAME	: "sub223"	, 
			init : function($doc) {
				var _me = _$$.aprv_sub223.subdoc, opt = $doc.options;
				var el = $doc.element;

				var _isedit = opt.isedit;		
                //결재 중간에 편집시에는 구매승인요청서 영역 편집 불가
                if (opt.isedit == true && opt.docstatus != "draft") {
                    _isedit = false;
                }			
				var _opt = $.extend({}, opt , {isedittable : _isedit});


				//새문서일 경우
                if (opt.isnew) {
                    
                    if ( $("[name=UDEPT_CODE]", $doc.element).val() != "" && $("[name=UDEPT_CODE]", $doc.element).val() != "error" ) {

                        $("[name=dcode]", $doc.element).xval( $("[name=UDEPT_CODE]", $doc.element).val() );    
                        $("[name=dname]", $doc.element).xval( $("[name=UDEPT_VALUE]", $doc.element).val() );    
                    }

                    if ( $("[name=UBU_CODE]", $doc.element).val() != "" && $("[name=UBU_CODE]", $doc.element).val() != "error" ) {

                        $("[name=bucode]", $doc.element).xval( $("[name=UBU_CODE]", $doc.element).val());    
                        $("[name=buname]", $doc.element).xval( $("[name=UBU_VALUE]", $doc.element).val() );    
					}
					
					var _org = $fn.getOrgUser($fn.getName($("input[name=From]", $doc.element).val()).ou);

					//현금 또는 그외 법인카드 사용에 대한 GL / ADDRESS  자동 설정
					if (  $("input[name='WorkArea_1']").val() =="E1"  ) {
						$("[name=GL3]").val("EP69");
						//$("select[name='GL3'] option:eq(1)", el).attr("selected","selected");
						$("[name=GL3_Nm]").val("ko:마산-현금(P69),jp:마산-현금(P69)");

						$("[name=ADDRESS3]").val("E45752");
						$("[name=ADDRESS3_Nm]").val("ko:마산-현금(45752),jp:마산-현금(45752)");

					} else if( $("input[name='WorkArea_1']").val() =="C1" ) {
						$("[name=GL3]").val("CP69");
						//$("select[name='GL3'] option:eq(2)", el).attr("selected","selected");
						$("[name=GL3_Nm]").val("ko:창원-현금(P69),jp:창원-현금(P69)");

						$("[name=ADDRESS3]").val("C45752");
						$("[name=ADDRESS3_Nm]").val("ko:창원-현금(45752),jp:창원-현금(45752)");

					} else if( $("input[name='WorkArea_1']").val() =="S1" ) {
						$("[name=GL3]").val("SP69");
						//$("select[name='GL3'] option:eq(3)", el).attr("selected","selected");
						$("[name=GL3_Nm]").val("ko:화성-현금(P69),jp:화성-현금(P69)");

						$("[name=ADDRESS3]").val("S45752");
						$("[name=ADDRESS3_Nm]").val("ko:화성-현금(45752),jp:화성-현금(45752)");

					} else if( $("input[name='WorkArea_1']").val() =="R1" ) {
						$("[name=GL3]").val("RP69");
						//$("select[name='GL3'] option:eq(4)", el).attr("selected","selected");
						$("[name=GL3_Nm]").val("ko:의왕-현금(P69),jp:의왕-현금(P69)");

						$("[name=ADDRESS3]").val("1004");
						$("[name=ADDRESS3_Nm]").val("ko:의왕-현금(1004),jp:의왕-현금(1004)");
						
					}
					//현금 또는 그외 법인카드 사용에 대한 GL / ADDRESS  자동 설정
                    
				}
				//네이버 거리계산링크 열기
				$("#_pop55",el).on("click", function () {
					//var _form = "wMeetingView";
					window.open("https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EB%84%A4%EC%9D%B4%EB%B2%84+%EA%B1%B0%EB%A6%AC%EA%B3%84%EC%82%B0&oquery=%EA%B1%B0%EB%A6%AC%EA%B3%84%EC%82%B0&tqi=h0yWhwp0J1ZssRYFLxVssssssg8-506725", "_blank");
					
					
			});	//
				var resultValue = $("input[name=ch]").val();					
				if(resultValue=="1"){
					$("input:checkbox[name='ee']").prop("checked", true);
					$("input:checkbox[name='ee']").attr("disabled", true);						
				}
				var resultValue = $("input[name=ch1]").val();					
				if(resultValue=="1"){
					$("input:checkbox[name='ee1']").prop("checked", true);
					$("input:checkbox[name='ee1']").attr("disabled", true);						
				}				
				
				var resultValue = $("input[name=ch2]").val();					
				if(resultValue=="1"){
					$("input:checkbox[name='ee2']").prop("checked", true);
					$("input:checkbox[name='ee2']").attr("disabled", true);						
				}				
				var resultValue = $("input[name=ch3]").val();					
				if(resultValue=="1"){
					$("input:checkbox[name='ee3']").prop("checked", true);
					$("input:checkbox[name='ee3']").attr("disabled", true);						
				}				
				var resultValue = $("input[name=ch4]").val();					
				if(resultValue=="1"){
					$("input:checkbox[name='ee4']").prop("checked", true);
					$("input:checkbox[name='ee4']").attr("disabled", true);						
				}	

				var resultValue = $("input[name=ch5]").val();					
				if(resultValue=="1"){
					$("input:checkbox[name='ee5']").prop("checked", true);
					$("input:checkbox[name='ee5']").attr("disabled", true);						
				}																				
				$("input[name=ee]").click(function () {
					if($("input:checkbox[name='ee']").is(":checked")== true){
						$("input[name=chk]").val("1");
					}else{
						$("input[name=chk]").val("");
					}							 
				});
				$("input[name=ee1]").click(function () {
					if($("input:checkbox[name='ee1']").is(":checked")== true){
						$("input[name=chk_1]").val("1");
					}else{
						$("input[name=chk_1]").val("");
					}	   
				});
				$("input[name=ee2]").click(function () {
					if($("input:checkbox[name='ee2']").is(":checked")== true){
						$("input[name=chk_2]").val("1");
					}else{
						$("input[name=chk_2]").val("");
					}	   
				});
				$("input[name=ee3]").click(function () {
					if($("input:checkbox[name='ee3']").is(":checked")== true){
						$("input[name=chk_3]").val("1");
					}else{
						$("input[name=chk_3]").val("");
					}	  
				});	
				$("input[name=ee4]").click(function () {
					if($("input:checkbox[name='ee4']").is(":checked")== true){
						$("input[name=chk_4]").val("1");
					}else{
						$("input[name=chk_4]").val("");
					}	
				});
				$("input[name=ee5]").click(function () {
					if($("input:checkbox[name='ee5']").is(":checked")== true){
						$("input[name=chk_5]").val("1");
					}else{
						$("input[name=chk_5]").val("");
					}	
				});					  
				//var _$table01 = $("table[name=sub223_Table01]", $doc.element);
			
				

				
				//$("[name=_USER]", _$table01).val($dwp.core.lang.getCurMsg(_org.oinfo.username));				
				//$("[name=_DEPTNAME]", _$table01).val($dwp.core.lang.getCurMsg(_org.oinfo.orgname));

				//$(document).ready(function () {
				//alert($("#vflag_2").val());

				$("[name=_USER]").val($("input[name='oUSER']").val());
				$("[name=_DEPTNAME]").val($("input[name='oDEPTNAME']").val());
				$("[name=_TITLE]").val($("input[name='oTitleName']").val());
				$("[name=_APRTITLE]").val($("input[name='oAprTitleName']").val());
				$("[name=_SABUN]").val($("input[name='oSABUN']").val());

				console.log('TEST =============1');
				//alert("@@")
				$fn.orgsel($("[name='org']", el), {
					isedit: true,
					treetype: "0",
					seltype: "2",
					isseltype: false,
					autodraw: false,
					autoseletcomplete: function (event, ui, doc) {
						$("input[name='_USER']").val($dwp.core.lang.getCurMsg(ui.item.value.username));
						$("input[name='_TITLE']").val($dwp.core.lang.getCurMsg(ui.item.value.pos));
						$("input[name='_APRTITLE']").val($dwp.core.lang.getCurMsg(ui.item.value.duty));
						$("input[name='_DEPTNAME']").val($dwp.core.lang.getCurMsg(ui.item.value.orgname));
						$("input[name='_SABUN']").val($dwp.core.lang.getCurMsg(ui.item.value.rempno));
						$("input[name='oTitleCode']").val($dwp.core.lang.getCurMsg(ui.item.value.poscode));
					},
					orgselectcomplete: function (dialog, rtndata, doc) {
						//사용자를 선택하지 않고 확인 버튼을 클릭하는 경우
						if (rtndata.list.length < 1) {
							return false;
						}
						$("input[name='_USER']").val($dwp.core.lang.getCurMsg(rtndata.list[0].username));
						$("input[name='_TITLE']").val($dwp.core.lang.getCurMsg(rtndata.list[0].pos));
						$("input[name='_APRTITLE']").val($dwp.core.lang.getCurMsg(rtndata.list[0].duty));
						$("input[name='_DEPTNAME']").val($dwp.core.lang.getCurMsg(rtndata.list[0].orgname));
						$("input[name='_SABUN']").val($dwp.core.lang.getCurMsg(rtndata.list[0].rempno));
						$("input[name='oTitleCode']").val($dwp.core.lang.getCurMsg(ui.item.value.poscode));
					},
					fld: "User",
					count: 1
				});
				console.log('TEST =============2');
				//화폐단위 선택시 국내/국외 선택 옵션을 체크할 수 있도록 로직 반영
				/*
				var _$sel_objloc = $("radio[name='A01']");
				_$sel_objloc.bind("change" , function(){
					var _val = $(':radio[name="A01"]:checked').val();
					if ( _val == "1" ) {	//국내
						$('input[name="A03"]:radio[value="1"]').prop('checked',true);
					} else if ( _val == "2" ) {	//국외
						$('input[name="A03"]:radio[value="1"]').prop('checked',false);
						$('input[name="A03"]:radio[value="2"]').prop('checked',true);
					}
				});
				*/
				//화폐단위 선택시 국내/국외 선택 옵션을 체크할 수 있도록 로직 반영
				var oriA01data = $("input[name='A01']:radio").xval();

				$("input[name='A01']:radio").click(function () {
					//선택하지 못하도록 알람 발생
					$fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.msg.error01")});
					$("input[name='A01']:radio").xval(oriA01data);
				});

				//화폐단위 선택시 국내/국외 선택 옵션을 체크할 수 있도록 로직 반영
				$("input[name='A01']:radio").change(function () {
					//라디오 버튼 값을 가져온다.
					var serviceType = this.value;									 
					if(serviceType == "1"){//국내
						$('input[name="A07"]:radio[value="KRW"]').prop('checked',true);
					} else if(serviceType == "2"){//해외
						$('input[name="A07"]:radio[value="KRW"]').prop('checked',false);
						//$('input[name="A07"]:radio[value="USD"]').prop('checked',true);
					}									 
				});
				$("input[name='A07']:radio").change(function () {
					//라디오 버튼 값을 가져온다.
					var serviceType = this.value;						
					var _val1 = $(':radio[name="A01"]:checked').val();
					if(_val1 == "1"){//국내
						if ( serviceType != "KRW") { //화폐단위 국내가 아닌경우
							$fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.msg.error01")});
							$('input[name="A07"]:radio[value="KRW"]').prop('checked',true);
						}						
					} else {//해외
						if ( serviceType == "KRW") { //화폐단위 국내가 아닌경우
							$fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.msg.error01")});
							$('input[name="A07"]:radio[value="KRW"]').prop('checked',false);
						}	
						
					}									 
				});

				// 일비 식비 사용자 수정시 반영 되도록 수정
				var _$iA05_KRW = $("input[name='A05_KRW']");

				_$iA05_KRW.bind("keyup", function () {
					var _icount = _$iA05_KRW.xval();
					_icount = _icount.replace(/,/gi, "");
					_icount = _me.numericCheck(_icount, 0);
					_icount = parseFloat(_icount) + "";
					_$iA05_KRW.xval(_icount.toComma());
					//_me.cal_sum(el);
				});
				
				
				_$iA05_KRW.blur( function () {
					//alert("TEST");
					//$("input[name='A05_KRW']").val(_day_krw);
					// 하단 총합계 란에 적용
					var _icount = _$iA05_KRW.xval();
					_icount = _icount.replace(/,/gi, "");
					_icount = _me.numericCheck(_icount, 0);
					_icount = parseFloat(_icount) + "";
					_$iA05_KRW.xval(_icount.toComma());

					$("input[name='ed_total_all_1']").val(_icount.toComma());

					_me.cal_sumall();
				});

				var _$iA06_KRW = $("input[name='A06_KRW']");

				_$iA06_KRW.bind("keyup", function () {
					var _icount = _$iA06_KRW.xval();
					_icount = _icount.replace(/,/gi, "");
					_icount = _me.numericCheck(_icount, 0);
					_icount = parseFloat(_icount) + "";
					_$iA06_KRW.xval(_icount.toComma());
					//_me.cal_sum(el);
				});
				
				
				_$iA06_KRW.blur( function () {
					//alert("TEST");
					//$("input[name='A05_KRW']").val(_day_krw);
					// 하단 총합계 란에 적용
					var _icount = _$iA06_KRW.xval();
					_icount = _icount.replace(/,/gi, "");
					_icount = _me.numericCheck(_icount, 0);
					_icount = parseFloat(_icount) + "";
					_$iA06_KRW.xval(_icount.toComma());

					$("input[name='ed_total_all_2']").val(_icount.toComma());

					_me.cal_sumall();
				});

				var _$sel_obj0 = $("select[name='ed_gubun']");

				_$sel_obj0.bind("change" , function(){
					
					
					var selectoil = $("select[name='ed_gubun']", el).val().trim();	

					var _val = $("select[name='ed_gubun']", $doc.element).find("option:selected").xval();
					var _text = $("select[name='ed_gubun']", $doc.element).find("option:selected").text();
					

					var _$v0 = $("input[name='u_distance']" , $doc.element).val();

					if ( _$v0 == "" ) {
						$("select[name='ed_gubun']", $doc.element).xval("");
						$("input[name='ed_oil_sum']", $doc.element).xval("0");
						$fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.msg.error04")});						
						return;

					}


					var _$v1 ;
					var _$v2 ;
					if ( _val == "" ) {
						_$v1 = "0";		//Km 단 유류
						_$v2 = "0";		//리터당 단가
					} else if  ( _val == "10") { 	// 경유 
						_$v1 = $("input[name='oil_10_v1']" , $doc.element).val();		//Km 단 유류
						_$v2 = $("input[name='oil_10_v2']" , $doc.element).val();		//리터당 단가

					} else if (_val == "20") { 	//휘발유
						_$v1 = $("input[name='oil_20_v1']" , $doc.element).val();
						_$v2 = $("input[name='oil_20_v2']" , $doc.element).val();

					} else if (_val == "30") { 	// LPG
						_$v1 = $("input[name='oil_30_v1']" , $doc.element).val();
						_$v2 = $("input[name='oil_30_v2']" , $doc.element).val();

					}
					
					if ( _$v1 =="0" ||_$v2 =="0" ) {
						//$fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.msg.error01")});
						return;

					}
					if ( _$v1 == "" ) {
						$("select[name='ed_gubun']", $doc.element).xval("");
						$("input[name='ed_oil_sum']", $doc.element).xval("0");
						$fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.msg.error05")});
						return;
					}
					if ( _$v2 == "" ) {
						$("select[name='ed_gubun']", $doc.element).xval("");
						$("input[name='ed_oil_sum']", $doc.element).xval("0");
						$fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.msg.error05")});
						return;
					}


					// 금액은 거리를 입력하고 유종선택시 유종별로 인사팀에서 입력한 단가를 바탕으로 자동계산(거리 x 유류단가 / 9(연비)), 원단위 절하

					//var _v0  = _$v0.replace(/,/gi, "");
					//var _ia  = _$v1.replace(/,/gi, "");
					//var _iup = _$v2;

					var _v0  = _$v0;
					var _ia  = _$v1;
					var _iup = _$v2;

					//_v0 = _me.numericCheck(_v0, 0);
					//_ia = _me.numericCheck(_ia, 0);
					//_iup = _me.numericCheck(_iup, 0);
					
					_v0 = parseFloat(_v0) + "";
					_ia = parseFloat(_ia) + "";
					_iup = parseFloat(_iup) + "";

					if ( _ia == "NaN" || _iup == "NaN" ) {
						$fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.msg.error05")});
						return;
					}

					var _rowsum = _v0 * _iup / _ia;

					_rowsum = parseFloat(_rowsum.toFixed()) + "";
					_rowsum = _rowsum.toComma();

					$("input[name='ed_oil_sum']", $doc.element).val(_rowsum);


                    _me.cal_sumall();
                    //var _val = $("input[name='_acccodeName']", $doc.element).find("option:selected").xval();
                    //var _text = $("input[name='_acccodeName']", $doc.element).find("option:selected").text();
                    //var _accname = $("#acccode option:selected").val();

                    //first_choice = _val;
                    //$("input[name='_acccodeName']", $doc.element).xval(_accname);

                    /*
                    if ($("select[name='_location']", el).xval() == "") {
                        $fn.alert({
                            msg: $fn.getCodeMsg("aprv_sub_099.msg.a1")
                        });
                        return false;
                    }
                    */

				} );
				console.log('TEST =============3');
				var _$fromdate = $("input[name='FromDate']");
				_$fromdate.bind("change" , function(){
					_dateTerm();
				} );	
				var _$todate = $("input[name='ToDate']");
				_$todate.bind("change" , function(){
					_dateTerm();
				} );

				var _$u_distance = $("input[name='u_distance']");
				_$u_distance.bind("blur" , function(){

					$("select[name='ed_gubun']").trigger("change");

					_me.cal_sumall();
				} );

				//식비 차감 횟수 변경시
				var _$sel_obj8 =  $("select[name='A08']");				
				_$sel_obj8.bind("change" , function(){
					$("#_pop4").trigger("click");	
					
				} );

				//식비 차감 횟수 변경시
				var _$sel_obj10 =  $("select[name='A10']");				
				_$sel_obj10.bind("change" , function(){
					$("#_pop4").trigger("click");	
					
				} );

				//식비 차감 횟수 변경시
				var _$sel_obj12 =  $("select[name='A12']");				
				_$sel_obj12.bind("change" , function(){
					$("#_pop4").trigger("click");	
					
				} );

				console.log('TEST =============4');

				//박 / 일 자동 설정
				if( $("input[name='AppDayC']").val() == "" ) _$fromdate.trigger("change");

				//출장지역 값을 기준으로 화폐단위 설정
				//화폐단위 선택시 국내/국외 선택 옵션을 체크할 수 있도록 로직 반영
				if ( $("input[name='A01']:radio").val() =="1" ) {
					$('input[name="A07"]:radio[value="KRW"]').prop('checked',true);
				}

				var _$table = _me.initInputTable(_opt, $doc, "");
				var _$table1 = _me.initInputTable01(_opt, $doc, "");
				var _$table3 = _me.initInputTable03(_opt, $doc, "");
				var _$table4 = _me.initInputTable04(_opt, $doc, "");

				var _newopt = $.extend({}, _opt, { dtable: _$table });
				//var _newopt = $.extend({}, _opt, { dtable: _$table }, { ktable: _$table1 });

				$doc.options = _newopt;    
				

				//출장규정 팝업
				$("#_pop1").on("click", function () {
						//var _form = "wMeetingView";
						var _rptDailog = $fn.dialog(null, {
							modal: true,
							resizable: false,
							draggable: true,
							islangconvert: false,
							referdata: el,
							title: $fn.getCodeMsg("aprv_sub_223.btn.a0"),
							width: 650,
							height: 800,
							show: 'fade', //effect
							hide: 'fade', //effect
							langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_223.lang.js",
							content: {
								html: "",
								//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								url: "/dwp/aprv/com/comm_code.nsf/TripRulePage?OpenPage" 								

								//														, data : {view : _view
							,
								count: 15
							},
							close: function () { //2017.01.19

							}							
							//,content : {html : ""}							
						});
				});	//
				
				//개인명의법인카드
				$("#_pop2").on("click", function () {
					var _form = "wMeetingView";
						var _rptDailog = $fn.dialog(null, {
							modal: true,
							resizable: false,
							draggable: true,
							islangconvert: false,
							referdata: el,
							title: $fn.getCodeMsg("aprv_sub_223.title.a19"),
							width: 1100,
							height: 800,
							show: 'fade', //effect
							hide: 'fade', //effect
							langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_223.lang.js",
							content: {
								html: "",
								//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								url: "/dwp/aprv/com/card_complete.nsf" + "/wFrmPopView3Common?ReadForm&USER_NAME=" 
								//														, data : {view : _view
							,
								count: 15
							},
							close: function () { //2017.01.19

							}
							,
							//,content : {html : ""}
							buttons: [
								{
									title: $fn.getCodeMsg('comm.btn.confirm'),
									click: function (_$dialog) {
										var element = _$dialog.element.view('instance');
										//필드 선언
										var MERC_NAME="";
										var card_val="";
										var date_val="";
										var money_val="";
										var code_val="";
										var Description="";
										var unid="";
										var card_num="";
										var amt_amount="";
										var vat_amount="";
										var TmpCashCard="2";
										var gloffset="";
										var address="";
										var userbank="";
										var userbanknum="";
										var sum_count=0;
										$.each(element.getChecked(), function (i, o) {
											//팝업에서 선택한 정보 문자열로 만들기
												MERC_NAME += o._MERC_NAME + ",";
												card_val += o._cardval + ",";
												date_val+= o._date+ ",";
												money_val += o._money+",";
												code_val +=o._Code+",";
												Description +=o._Description+",";
												unid +=o._unid+",";
												card_num+=o._CARD_NUM+",";
												amt_amount+=o._AMT_AMOUNT+",";
												vat_amount+=o._VAT_AMOUNT+",";
												gloffset+=o._GLOFFSET_1+",";
												address+=o._ADDRESS_1+",";
												userbank+=o._USERBANK+",";
												userbanknum+=o._USERBANK_NUM+",";
												sum_count=sum_count+1;
												//TmpCashCard+="2";
												
										});
	

										//필드 보내기
										_addLine(sum_count ,"sub223_Table01");
										//_addLinedummy(sum_count ,"sub223_Table01");

											setTimeout(function() { //라인 늘리고 딜레이를 줘야 값이 들어감
											//alert("@")
											//_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count)
											_addItem(MERC_NAME,money_val,unid,sum_count,gloffset,address,userbank,userbanknum,date_val)
										},500);

										
										_$dialog.close();
									}
								},
								{
									title: $fn.getCodeMsg('comm.btn.cancel'),
									click: function (_$dialog) {
										_$dialog.close();
									}
								}
							]
						});
				});	//개인명의법인카드 끝

				//개인명의법인카드 ( 온다 )
				$("#_pop22").on("click", function () {
					var _form = "wMeetingView";
						var _rptDailog = $fn.dialog(null, {
							modal: true,
							resizable: false,
							draggable: true,
							islangconvert: false,
							referdata: el,
							title: $fn.getCodeMsg("aprv_sub_223.title.a19"),
							width: 1100,
							height: 800,
							show: 'fade', //effect
							hide: 'fade', //effect
							langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_223.lang.js",
							content: {
								html: "",
								//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								url: "/dwp/aprv/com/card_complete.nsf" + "/wFrmPopView3CommonTop?ReadForm&USER_NAME=" 
								//														, data : {view : _view
							,
								count: 15
							},
							close: function () { //2017.01.19

							}
							,
							//,content : {html : ""}
							buttons: [
								{
									title: $fn.getCodeMsg('comm.btn.confirm'),
									click: function (_$dialog) {
										var element = _$dialog.element.view('instance');
										//필드 선언
										var MERC_NAME="";
										var card_val="";
										var date_val="";
										var money_val="";
										var code_val="";
										var Description="";
										var unid="";
										var card_num="";
										var amt_amount="";
										var vat_amount="";
										var TmpCashCard="2";
										var gloffset="";
										var address="";
										var userbank="";
										var userbanknum="";
										var sum_count=0;
										$.each(element.getChecked(), function (i, o) {
											//팝업에서 선택한 정보 문자열로 만들기
												MERC_NAME += o._MERC_NAME + ",";
												card_val += o._cardval + ",";
												date_val+= o._date+ ",";
												money_val += o._money+",";
												code_val +=o._Code+",";
												Description +=o._Description+",";
												unid +=o._unid+",";
												card_num+=o._CARD_NUM+",";
												amt_amount+=o._AMT_AMOUNT+",";
												vat_amount+=o._VAT_AMOUNT+",";
												gloffset+=o._GLOFFSET_1+",";
												address+=o._ADDRESS_1+",";
												userbank+=o._USERBANK+",";
												userbanknum+=o._USERBANK_NUM+",";
												sum_count=sum_count+1;
												//TmpCashCard+="2";
												
										});
	

										//필드 보내기
										_addLine(sum_count ,"sub223_Table01");
										//_addLinedummy(sum_count ,"sub223_Table01");

											setTimeout(function() { //라인 늘리고 딜레이를 줘야 값이 들어감
											//alert("@")
											//_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count)
											_addItem(MERC_NAME,money_val,unid,sum_count,gloffset,address,userbank,userbanknum,date_val)
										},500);

										
										_$dialog.close();
									}
								},
								{
									title: $fn.getCodeMsg('comm.btn.cancel'),
									click: function (_$dialog) {
										_$dialog.close();
									}
								}
							]
						});
				});	//개인명의법인카드 끝

				//개인명의법인카드 ( 신동길 )
				$("#_pop23").on("click", function () {
					var _form = "wMeetingView";
						var _rptDailog = $fn.dialog(null, {
							modal: true,
							resizable: false,
							draggable: true,
							islangconvert: false,
							referdata: el,
							title: $fn.getCodeMsg("aprv_sub_223.title.a19"),
							width: 1100,
							height: 800,
							show: 'fade', //effect
							hide: 'fade', //effect
							langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_223.lang.js",
							content: {
								html: "",
								//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								url: "/dwp/aprv/com/card_complete.nsf" + "/wFrmPopView3CommonTop01?ReadForm&USER_NAME=" 
								//														, data : {view : _view
							,
								count: 15
							},
							close: function () { //2017.01.19

							}
							,
							//,content : {html : ""}
							buttons: [
								{
									title: $fn.getCodeMsg('comm.btn.confirm'),
									click: function (_$dialog) {
										var element = _$dialog.element.view('instance');
										//필드 선언
										var MERC_NAME="";
										var card_val="";
										var date_val="";
										var money_val="";
										var code_val="";
										var Description="";
										var unid="";
										var card_num="";
										var amt_amount="";
										var vat_amount="";
										var TmpCashCard="2";
										var gloffset="";
										var address="";
										var userbank="";
										var userbanknum="";
										var sum_count=0;
										$.each(element.getChecked(), function (i, o) {
											//팝업에서 선택한 정보 문자열로 만들기
												MERC_NAME += o._MERC_NAME + ",";
												card_val += o._cardval + ",";
												date_val+= o._date+ ",";
												money_val += o._money+",";
												code_val +=o._Code+",";
												Description +=o._Description+",";
												unid +=o._unid+",";
												card_num+=o._CARD_NUM+",";
												amt_amount+=o._AMT_AMOUNT+",";
												vat_amount+=o._VAT_AMOUNT+",";
												gloffset+=o._GLOFFSET_1+",";
												address+=o._ADDRESS_1+",";
												userbank+=o._USERBANK+",";
												userbanknum+=o._USERBANK_NUM+",";
												sum_count=sum_count+1;
												//TmpCashCard+="2";
												
										});
	

										//필드 보내기
										_addLine(sum_count ,"sub223_Table01");
										//_addLinedummy(sum_count ,"sub223_Table01");

											setTimeout(function() { //라인 늘리고 딜레이를 줘야 값이 들어감
											//alert("@")
											//_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count)
											_addItem(MERC_NAME,money_val,unid,sum_count,gloffset,address,userbank,userbanknum,date_val)
										},500);

										
										_$dialog.close();
									}
								},
								{
									title: $fn.getCodeMsg('comm.btn.cancel'),
									click: function (_$dialog) {
										_$dialog.close();
									}
								}
							]
						});
				});	//개인명의법인카드 끝

				//법인명의 법인카드
				$("#_pop3").on("click", function () {
					var _form = "wMeetingView";
						var _rptDailog = $fn.dialog(null, {
							modal: true,
							resizable: false,
							draggable: true,
							islangconvert: false,
							referdata: el,
							title: $fn.getCodeMsg("aprv_sub_223.title.a20"),
							width: 1100,
							height: 800,
							show: 'fade', //effect
							hide: 'fade', //effect
							langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_223.lang.js",
							content: {
								html: "",
								//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								url: "/dwp/aprv/com/card_complete.nsf" + "/wFrmPopView2Common?ReadForm" 								
								//														, data : {view : _view
							,
								count: 15
							},
							close: function () { //2017.01.19

							}
							,
							//,content : {html : ""}
							buttons: [
								{
									title: $fn.getCodeMsg('comm.btn.confirm'),
									click: function (_$dialog) {
										var element = _$dialog.element.view('instance');
										//필드 선언
										var MERC_NAME="";
										var card_val="";
										var date_val="";
										var money_val="";
										var code_val="";
										var Description="";
										var unid="";
										var card_num="";
										var amt_amount="";
										var vat_amount="";
										var TmpCashCard="2";
										var gloffset="";
										var address="";
										var userbank="";
										var userbanknum="";
										var sum_count=0;
										$.each(element.getChecked(), function (i, o) {
											//팝업에서 선택한 정보 문자열로 만들기
												MERC_NAME += o._MERC_NAME + ",";
												card_val += o._cardval + ",";
												date_val+= o._date+ ",";
												money_val += o._money+",";
												code_val +=o._Code+",";
												Description +=o._Description+",";
												unid +=o._unid+",";
												card_num+=o._CARD_NUM+",";
												amt_amount+=o._AMT_AMOUNT+",";
												vat_amount+=o._VAT_AMOUNT+",";
												gloffset+=o._GLOFFSET_1+",";
												address+=o._ADDRESS_1+",";
												userbank+=o._USERBANK+",";
												userbanknum+=o._USERBANK_NUM+",";
												sum_count=sum_count+1;
												//TmpCashCard+="2";
												
										});
	

										//필드 보내기
										_addLine1(sum_count ,"sub223_Table02");
										//_addLinedummy(sum_count ,"sub223_Table01");

										setTimeout(function() { //라인 늘리고 딜레이를 줘야 값이 들어감
											//alert("@")
											//_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count)
											_addItem1(MERC_NAME,money_val,unid,sum_count,gloffset,address,userbank,userbanknum , date_val)
										},500);

										
										_$dialog.close();
									}
								},
								{
									title: $fn.getCodeMsg('comm.btn.cancel'),
									click: function (_$dialog) {
										_$dialog.close();
									}
								}
							]
						});
				});	//법인명 명의법인카드 끝

				//항공권 법인카드 미사용
				$("#_pop33").on("click", function () {
					var _form = "wMeetingView";
						var _rptDailog = $fn.dialog(null, {
							modal: true,
							resizable: false,
							draggable: true,
							islangconvert: false,
							referdata: el,
							title: $fn.getCodeMsg("aprv_sub_223.title.a65"),
							width: 1100,
							height: 800,
							show: 'fade', //effect
							hide: 'fade', //effect
							langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_223.lang.js",
							content: {
								html: "",
								//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								url: "/dwp/aprv/com/card_complete.nsf" + "/wFrmPopView1?ReadForm" 								
								//														, data : {view : _view
							,
								count: 15
							},
							close: function () { //2017.01.19

							}
							,
							//,content : {html : ""}
							buttons: [
								{
									title: $fn.getCodeMsg('comm.btn.confirm'),
									click: function (_$dialog) {
										var element = _$dialog.element.view('instance');
										//필드 선언
										var MERC_NAME="";
										var card_val="";
										var date_val="";
										var money_val="";
										var code_val="";
										var Description="";
										var unid="";
										var card_num="";
										var amt_amount="";
										var vat_amount="";
										var TmpCashCard="2";
										var gloffset="";
										var address="";
										var userbank="";
										var userbanknum="";
										var sum_count=0;
										$.each(element.getChecked(), function (i, o) {
											//팝업에서 선택한 정보 문자열로 만들기
												MERC_NAME += o._MERC_NAME + ",";
												card_val += o._cardval + ",";
												date_val+= o._date+ ",";
												money_val += o._money+",";
												code_val +=o._Code+",";
												Description +=o._Description+",";
												unid +=o._unid+",";
												card_num+=o._CARD_NUM+",";
												amt_amount+=o._AMT_AMOUNT+",";
												vat_amount+=o._VAT_AMOUNT+",";
												gloffset+=o._GLOFFSET_1+",";
												address+=o._ADDRESS_1+",";
												userbank+=o._USERBANK+",";
												userbanknum+=o._USERBANK_NUM+",";
												sum_count=sum_count+1;
												//TmpCashCard+="2";
												
										});
	

										//필드 보내기
										_addLine1(sum_count ,"sub223_Table02");
										//_addLinedummy(sum_count ,"sub223_Table01");

										setTimeout(function() { //라인 늘리고 딜레이를 줘야 값이 들어감
											//alert("@")
											//_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count)
											_addItem1(MERC_NAME,money_val,unid,sum_count,gloffset,address,userbank,userbanknum , date_val)
										},500);

										
										_$dialog.close();
									}
								},
								{
									title: $fn.getCodeMsg('comm.btn.cancel'),
									click: function (_$dialog) {
										_$dialog.close();
									}
								}
							]
						});
				});	///항공권 법인카드 미사용 끝

								
				//일비 및 식비 게산
				$("#_pop4").on("click", function () {
					$fn.confirm({ msg: $fn.getCodeMsg("aprv_sub_223.title.a38") }).done(function () {

						//alert($(":input:radio[name=A07]:checked").val());
						//$(":input:radio[name=search_type]:checked").val();

						//라디오 버튼 선택시 $(":input:radio[name=A07]:checked").val()
						//콤보 선택시 $("input[name='A01']", $doc.element).find("option:selected").xval()


						if ( typeof $(":input:radio[name=A01]:checked").val() == 'undefined' ) {
							$fn.alert({ msg: $fn.getCodeMsg("aprv_sub_223.msg.error") });
							return;
						}
						if ( typeof $(":input:radio[name=A07]:checked").val() == 'undefined' ) {
							$fn.alert({ msg: $fn.getCodeMsg("aprv_sub_223.msg.error") });
							return;
						}
						if ($("input[name='AppDayC']").val() == '' ) {
							$fn.alert({ msg: $fn.getCodeMsg("aprv_sub_223.msg.error") });
							return;
						}


						$fn.block(undefined, { notusemsg: false });
						// var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
						var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/comm_code.nsf/wcmdpost_223?createdocument')
						var _param = {
							postdata: "",
							dbpath: _opt.cdb,
							sdate: $("input[name='FromDate']").val(),
							edate: $("input[name='ToDate']").val(),
							stime: $("select[name='StartTime']").find("option:selected").xval(),
							etime: $("select[name='EndTime']").find("option:selected").xval(),
							moneytype: $(":input:radio[name=A07]:checked").val(),
							titlecode: $("input[name='oTitleCode']").val(),
							biztype: $(":input:radio[name=A01]:checked").val(),
							dayterm: $("input[name='AppDayC']").val(),
							minusfood1: $("select[name='A08']").find("option:selected").xval(),
							minusfood2: $("select[name='A10']").find("option:selected").xval(),
							minusfood3: $("select[name='A12']").find("option:selected").xval(),
							WQS_Agent: 'cmdpost_223'
						}
						var callback = function (data) {
							//console.log('data :', data);
						   
							$.unblockUI();
						   
							if (data.hasOwnProperty('result')) {                                            
								if (data.result >= '200' && data.result < '300') {
									//console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
									//$fn.alert({ msg: "환율: " + data.rate + " ." });

									//유류대 값 설정
									$("input[name='oil_10_v1']").val(data.oil_10_01);
									$("input[name='oil_10_v2']").val(data.oil_10_02);
									$("input[name='oil_20_v1']").val(data.oil_20_01);
									$("input[name='oil_20_v2']").val(data.oil_20_02);
									$("input[name='oil_30_v1']").val(data.oil_30_01);
									$("input[name='oil_30_v2']").val(data.oil_30_02);
									

									$("input[name='AppMRate']").val(data.rate);
									var _day ;
									_day = data.daymoney+ "";
									_day = _day.toComma();				
									$("input[name='A05']").val(_day);

									var _day_krw ;
									_day_krw = data.daymoney_krw+ "";
									_day_krw = _day_krw.toComma();				
									$("input[name='A05_KRW']").val(_day_krw);

									// 하단 총합계 란에 적용
									$("input[name='ed_total_all_1']").val(_day_krw);

									var _food ;
									_food = data.foodmoney+ "";
									_food = _food.toComma();				
									$("input[name='A06']").val(_food);

									var _food_krw ;
									_food_krw = data.foodmoney_krw+ "";
									_food_krw = _food_krw.toComma();				
									$("input[name='A06_KRW']").val(_food_krw);

									// 하단  총합계 란에 적용
									$("input[name='ed_total_all_2']").val(_food_krw);

									$("input[name='A06_KRW']").trigger("blur");

									

									//view.refresh();
								} else if (data.result == '500') {     //connection fail
									$fn.alert({ msg: data.msg });
								} else if (data.result == '400') {      //insert error

									//console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
									$fn.alert({ msg:"DB Not Open" });
								} else {
									$fn.alert({ msg: 'error' });
								}
							} else {
								$fn.alert({ msg: '일비 식비 조회 오류' });
							}
						};
						$fn.cmdPost(_url, _param, callback, 'json');

					});
				});
				// 자차유류비 초기화 버튼
				$("#_pop5").on("click", function () {
					$("select[name='ed_gubun']", $doc.element).xval("");
					$("input[name='u_distance']", $doc.element).xval("0");
					$("input[name='ed_oil_sum']", $doc.element).xval("0");
					_me.cal_sumall();
				});	
				//계정 선택 팝업
                $("#_pop10").on("click", function () {
                    var _form = "";
					_form = "w_use_acccode_y";
					var _rptDailog = $fn.dialog(null,{
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: _opt,
						title: $fn.getCodeMsg("aprv_sub_223.title.a40"),                                            
						width: 1200,
						height: 640,
						show: 'fade',			//effect
						hide: 'fade',			//effect
						langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_223.lang.js",
						content : {
							html : "", 
					//		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
							url : "/dwp/aprv/com/comm_code.nsf/wFrm10PopViewFor223?ReadForm&view="+_form
					//				, data : {view : _view
							, count:15
						},
						close : function () {										//2017.01.19 
							
						}
					});             
				});
				//BU 선택 팝업
                $("#_pop20").on("click", function () {
                    var _form = "";
					_form = "w_use_bucode_1";
					var _rptDailog = $fn.dialog(null,{
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: _opt,
						title: $fn.getCodeMsg("aprv_sub_223.title.a41"),                                            
						width: 800,
						height: 640,
						show: 'fade',			//effect
						hide: 'fade',			//effect
						langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_223.lang.js",
						content : {
							html : "", 
					//		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
							url : "/dwp/aprv/com/comm_code.nsf/wFrm10PopViewFor223?ReadForm&view="+_form
					//				, data : {view : _view
							, count:15
						},
						close : function () {										//2017.01.19 
							
						}
					});             
				});
				//부서 선택 팝업
                $("#_pop30").on("click", function () {
                    var _form = "";
					_form = "w_use_deptcode_1";
					var _rptDailog = $fn.dialog(null,{
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: _opt,
						title: $fn.getCodeMsg("aprv_sub_223.title.a42"),                                            
						width: 1200,
						height: 640,
						show: 'fade',			//effect
						hide: 'fade',			//effect
						langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_223.lang.js",
						content : {
							html : "", 
					//		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
							url : "/dwp/aprv/com/comm_code.nsf/wFrm10PopViewFor223?ReadForm&view="+_form
					//				, data : {view : _view
							, count:15
						},
						close : function () {										//2017.01.19 
							
						}
					});             
                });
				//팝업에서 선택한 문서갯수가 많을때 라인 추가 함수
				function _addLine(sum_count , tablename ) {
					var _me = _$$.aprv_sub223.subdoc;					
				    var _$input_tbl = $("table[name=" + tablename  +"]", el);
				    var _$input_trs = $("tr", _$input_tbl);
				    var _$isupply00 = $("#info01", _$input_trs); //금액 #info01
				    var vvarry = "";
				    var vvvcount = 0;
				    $.each(_$isupply00, function (idx, o2) {
				        if (idx != 0) {
				             if ($(o2).xval() == "") {
				            vvvcount = vvvcount + 1;
				              }
				        }
				    });

				  	//alert("ㅍㅍ" + vvvcount); //남은칸수
				    //alert("ㄴㄴ" + sum_count) //선택한문서갯수
				    if (vvvcount < sum_count) {
				        var vminor = 0;
				        vminor = sum_count - vvvcount;
				        for (i = 0; i < vminor; i++) {
				            //alert(i)

				            if (_opt.isnew) {
						   	 _me.initInputTable(_opt, $doc, "");
							} else {
								_$table.add();
				       		 }
				        }
				    }
				}

				//팝업에서 선택한 문서갯수가 많을때 라인 추가 함수
				function _addLine1(sum_count , tablename ) {
					var _me = _$$.aprv_sub223.subdoc;					
				    var _$input_tbl = $("table[name=" + tablename  +"]", el);
				    var _$input_trs = $("tr", _$input_tbl);
				    var _$isupply00 = $("#edesc", _$input_trs); //금액 #info01
				    var vvarry = "";
				    var vvvcount = 0;
				    $.each(_$isupply00, function (idx, o2) {
				        if (idx != 0) {
				             if ($(o2).xval() == "") {
				            vvvcount = vvvcount + 1;
				              }
				        }
				    });

				  	//alert("ㅍㅍ" + vvvcount); //남은칸수
				    //alert("ㄴㄴ" + sum_count) //선택한문서갯수
				    if (vvvcount < sum_count) {
				        var vminor = 0;
				        vminor = sum_count - vvvcount;
				        for (i = 0; i < vminor; i++) {
				            //alert(i)
   					  if (_opt.isnew) {
						       _me.initInputTable01(_opt, $doc, "");
								} else {
							_$table1.add();
				        
				       		 }
				        
				        }
				    }
				}
				

				//자식창에서 부모창 값을 내리기
				
				//function _addItem(_MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count) {
				function _addItem(_MERC_NAME,money_val,unid,sum_count,gl,address,userbank,userbanknum,date_val) {
					/*
					예산계정†2019-09-05†신한비자 35 0414†카카오페이(택시)†5555†4,600†5555†95169†예산계정잔액†강윤희†B435B3B7E2F8C10D492584700000076A†4518444501350414†4600†0†2†81107†100;
					동적테이블 한행 필드 설명
					1->部署運営費†2->2019-09-05†신한비자 35 0414†카카오페이(택시)†개인차량†4,600†개인차량†95169†0†강윤희†B435B3B7E2F8C10D492584700000076A†4518444501350414†4600†0†2†81107†100
					
					1. 예산계정----첫번째필드 예산계정
					2. 2019-09-05 ---승인일자
					3. 신한비자 35 0414 ---카드번호
					4. 카카오페이(택시)---적요
					5. 5555† ---차필드
					6. 4,600† ---금액
					7. 5555† ---차필드 중복 무시하셔도됨
					8. 95169 --- Code?
					9. †예산계정잔액 --- 예산계정잔액
					10. †강윤희 --- Description
					11. †B435B3B7E2F8C10D492584700000076A†---unid
					12. 4518444501350414† --- card_num
					13. 4600†--- amt_amount
					14. 0† --- vat_amount
					15. 2; --- XTmpCashCard cs에서 보면 2로 박혀있음
					16. 81107 ---- 예산계정 코드 	
					17. 100 --- 차량코드
					18. 000,000 --- 차감금액
					19. 000,000 --- 확인금액
					===========================================================
					부서코드및사용자코드 
					
					부서코드 => ed_val_1_1
					사용자코드=> ed_val_2_1  
					comcode="5000"
					vendorcode="1000"
					vendorname="덴소코리아"
					
					5개 필드는 별도 필드로 저장
					*/
						// alert(o._MERC_NAME)

					//var _$dept = $("[name='_REQCOUNT3']");	
					//_$dept.val(o._MERC_NAME);
	
					var _me = _$$.aprv_sub223.subdoc;				
					var _$input_tbl = $("table[name=sub223_Table01]", el);
					var _$input_trs = $("tr", _$input_tbl);

					var _$isupply = $("#info01", _$input_trs); //거래처명
					var _$isupply3 = $("#cost01", _$input_trs); //금액
					var _$isupply33 = $("#finalcost01", _$input_trs); //최종금액
					var _$isupply6 = $("#unid01", _$input_trs); //unid
					var _$isupply7 = $("#gloffset01", _$input_trs); //gloffset
					var _$isupply8 = $("#address01", _$input_trs); //address
					var _$isupply9 = $("#userbank01", _$input_trs); //userbank
					var _$isupply10 = $("#userbanknum01", _$input_trs); //userbanknum
					
								
					var array=_MERC_NAME.slice(0,-1); //맨뒤 , 자름 거래처명					
					var array3=money_val.slice(0,-1);//금액								
					var array6=unid.slice(0,-1); //unid
					var array7=gl.slice(0,-1); //gloffset
					var array8=address.slice(0,-1); //address
					var array9=userbank.slice(0,-1); //userbank
					var array10=userbanknum.slice(0,-1); //userbanknum
					var array11=date_val.slice(0,-1); //date

					array=array.split(",");
					array3=array3.split(",");
					array6=array6.split(",");
					array7=array7.split(",");
					array8=array8.split(",");
					array9=array9.split(",");
					array10=array10.split(",");
					array11=array11.split(",");
					
					//선택된 카드 리스트 중에 첫번째 것을 하단에 값 설정
					$("input[name='GL1']", el).xval( array7[0] ) ;
					$("input[name='ADDRESS1']", el).xval( array8[0] );
					$("input[name='UBANK1']", el).xval( array9[0] );
					$("input[name='UBANKNUM1']", el).xval( array10[0] );


					// 현금 부분은 삭제 
					//$("input[name='UBANK3']", el).xval( array9[0] );
					//$("input[name='UBANKNUM3']", el).xval( array10[0] );

					var _isvalid1 = true;

					var varry="";	
					var vvcount=0;
					$.each(_$isupply, function (idx, o2) {
					//alert(idx+1)
					    if (idx != 0) {
					        if ($(o2).xval() == "") {
					            for (i = 0; i < sum_count; i++) {
					                varry = varry + array[i] + ","
					            }
				    	        varry = varry.split(",");
				        	    //alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				            		//alert(vvcount)
				            		//alert("for   "+   j)
				                	if (vvcount == j) {
				                	//alert(array[j])
				                    	$(o2).xval(array11[j]+":"+array[j])
				                	}
					            }
								vvcount = vvcount + 1;
				        	}
				    	}
					});
					var varry3="";	
					var vvcount3=0;					
					$.each(_$isupply3, function(idx, o5){ // 금액
						if (idx != 0) {
					        if ($(o5).xval() == "0") {
				            	for (i = 0; i < sum_count; i++) {
				                	varry3 = varry3 + array3[i] + ","
				            	}
					            varry3 = varry3.split(",");
					            //alert(varry)
					            for (j = 0; j < sum_count; j++) {
					                if (vvcount3 == j) {
										$(o5).xval(array3[j].toComma())
				        	        }
				    	        }
				            	vvcount3 = vvcount3 + 1;
					        }
					    }
					});	
					
					var varry33="";	
					var vvcount33=0;					
					$.each(_$isupply33, function(idx, o5){ // 최종금액
						if (idx != 0) {
					        if ($(o5).xval() == "0") {
				            	for (i = 0; i < sum_count; i++) {
				                	varry33 = varry33 + array3[i] + ","
				            	}
					            varry33 = varry33.split(",");
					            //alert(varry)
					            for (j = 0; j < sum_count; j++) {
					                if (vvcount33 == j) {
										$(o5).xval(array3[j].toComma())
				        	        }
				    	        }
				            	vvcount33 = vvcount33 + 1;
					        }
					    }
					});	

					var varry6="";	
					var vvcount6=0;					
					$.each(_$isupply6, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry6 = varry6 + array6[i] + ","
				            	}

				            	varry6 = varry6.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount6 == j) {
				                    	$(o).xval(array6[j])
					                }
					            }
					            vvcount6 = vvcount6 + 1;
					        }
					    }
					});
					var varry7="";	
					var vvcount7=0;					
					$.each(_$isupply7, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry7 = varry7 + array7[i] + ","
				            	}

				            	varr7 = varry7.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount7 == j) {
				                    	$(o).xval(array7[j])
					                }
					            }
					            vvcount7 = vvcount7 + 1;
					        }
					    }
					});
					var varry8="";	
					var vvcount8=0;					
					$.each(_$isupply8, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry8 = varry8 + array8[i] + ","
				            	}

				            	varr8 = varry8.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount8 == j) {
				                    	$(o).xval(array8[j])
					                }
					            }
					            vvcount8 = vvcount8 + 1;
					        }
					    }
					});
					var varry9="";	
					var vvcount9=0;					
					$.each(_$isupply9, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry9 = varry9 + array9[i] + ","
				            	}

				            	varr9 = varry9.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount9 == j) {
				                    	$(o).xval(array9[j])
					                }
					            }
					            vvcount9 = vvcount9 + 1;
					        }
					    }
					});
					var varry10="";	
					var vvcount10=0;					
					$.each(_$isupply10, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry10 = varry10 + array10[i] + ","
				            	}

				            	varr10 = varry10.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount10 == j) {
				                    	$(o).xval(array10[j])
					                }
					            }
					            vvcount10 = vvcount10 + 1;
					        }
					    }
					});

					var el = $doc.elelment;
					_me.cal_sum(el,_$input_trs)
					
					return _isvalid1;

				}
				
				function _addItem1(_MERC_NAME,money_val,unid,sum_count,gl,address,userbank,userbanknum , date_val) {
					/*
					예산계정†2019-09-05†신한비자 35 0414†카카오페이(택시)†5555†4,600†5555†95169†예산계정잔액†강윤희†B435B3B7E2F8C10D492584700000076A†4518444501350414†4600†0†2†81107†100;
					동적테이블 한행 필드 설명
					1->部署運営費†2->2019-09-05†신한비자 35 0414†카카오페이(택시)†개인차량†4,600†개인차량†95169†0†강윤희†B435B3B7E2F8C10D492584700000076A†4518444501350414†4600†0†2†81107†100
					
					1. 예산계정----첫번째필드 예산계정
					2. 2019-09-05 ---승인일자
					3. 신한비자 35 0414 ---카드번호
					4. 카카오페이(택시)---적요
					5. 5555† ---차필드
					6. 4,600† ---금액
					7. 5555† ---차필드 중복 무시하셔도됨
					8. 95169 --- Code?
					9. †예산계정잔액 --- 예산계정잔액
					10. †강윤희 --- Description
					11. †B435B3B7E2F8C10D492584700000076A†---unid
					12. 4518444501350414† --- card_num
					13. 4600†--- amt_amount
					14. 0† --- vat_amount
					15. 2; --- XTmpCashCard cs에서 보면 2로 박혀있음
					16. 81107 ---- 예산계정 코드 	
					17. 100 --- 차량코드		
					
					===========================================================
					부서코드및사용자코드 
					
					부서코드 => ed_val_1_1
					사용자코드=> ed_val_2_1  
					comcode="5000"
					vendorcode="1000"
					vendorname="덴소코리아"
					
					5개 필드는 별도 필드로 저장
					*/
						// alert(o._MERC_NAME)

					//var _$dept = $("[name='_REQCOUNT3']");	
					//_$dept.val(o._MERC_NAME);
	
					var _me = _$$.aprv_sub223.subdoc;				
					var _$input_tbl = $("table[name=sub223_Table02]", el);
					var _$input_trs = $("tr", _$input_tbl);

					var _$isupply = $("#edesc", _$input_trs); //거래처명
					var _$isupply3 = $("#cost02", _$input_trs); //금액
					//var _$isupply33 = $("#finalcost02", _$input_trs); //최종금액
					var _$isupply6 = $("#unid02", _$input_trs); //unid
					var _$isupply7 = $("#gloffset02", _$input_trs); //gloffset
					var _$isupply8 = $("#address02", _$input_trs); //address
					var _$isupply9 = $("#userbank02", _$input_trs); //userbank
					var _$isupply10 = $("#userbanknum02", _$input_trs); //userbanknum

					var array=_MERC_NAME.slice(0,-1); //맨뒤 , 자름 거래처명					
					var array3=money_val.slice(0,-1);//금액								
					var array6=unid.slice(0,-1); //unid
					var array7=gl.slice(0,-1); //gloffset
					var array8=address.slice(0,-1); //address
					var array9=userbank.slice(0,-1); //userbank
					var array10=userbanknum.slice(0,-1); //userbanknum
					var array11= date_val.slice(0,-1); //date

					array=array.split(",");
					array3=array3.split(",");
					array6=array6.split(",");
					array7=array7.split(",");
					array8=array8.split(",");
					array9=array9.split(",");
					array10=array10.split(",");
					array11=array11.split(",");

					//선택된 카드 리스트 중에 첫번째 것을 하단에 값 설정
					$("input[name='GL2']", el).xval( array7[0] ) ;
					$("input[name='ADDRESS2']", el).xval( array8[0] );
					$("input[name='UBANK2']", el).xval( array9[0] );
					$("input[name='UBANKNUM2']", el).xval( array10[0] );

					var _isvalid1 = true;

					var varry="";	
					var vvcount=0;
					$.each(_$isupply, function (idx, o2) {
					//alert(idx+1)
					    if (idx != 0) {
					        if ($(o2).xval() == "") {
					            for (i = 0; i < sum_count; i++) {
					                varry = varry + array[i] + ","
					            }
				    	        varry = varry.split(",");
				        	    //alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				            		//alert(vvcount)
				            		//alert("for   "+   j)
				                	if (vvcount == j) {
				                	//alert(array[j])
				                    	$(o2).xval(array11[j] +":"+array[j])
				                	}
					            }
								vvcount = vvcount + 1;
				        	}
				    	}
					});
					var varry3="";	
					var vvcount3=0;					
					$.each(_$isupply3, function(idx, o5){ // 금액
						if (idx != 0) {
					        if ($(o5).xval() == "0") {
				            	for (i = 0; i < sum_count; i++) {
				                	varry3 = varry3 + array3[i] + ","
				            	}
					            varry3 = varry3.split(",");
					            //alert(varry)
					            for (j = 0; j < sum_count; j++) {
					                if (vvcount3 == j) {
					                    $(o5).xval(array3[j].toComma())
				        	        }
				    	        }
				            	vvcount3 = vvcount3 + 1;
					        }
					    }
					});	
					/*
					var varry33="";	
					var vvcount33=0;					
					$.each(_$isupply33, function(idx, o5){ // 최종금액
						if (idx != 0) {
					        if ($(o5).xval() == "0") {
				            	for (i = 0; i < sum_count; i++) {
				                	varry33 = varry33 + array3[i] + ","
				            	}
					            varry33 = varry33.split(",");
					            //alert(varry)
					            for (j = 0; j < sum_count; j++) {
					                if (vvcount33 == j) {
										$(o5).xval(array3[j].toComma())
				        	        }
				    	        }
				            	vvcount33 = vvcount33 + 1;
					        }
					    }
					});	
					*/
					var varry6="";	
					var vvcount6=0;					
					$.each(_$isupply6, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry6 = varry6 + array6[i] + ","
				            	}

				            	varry6 = varry6.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount6 == j) {
				                    	$(o).xval(array6[j])
					                }
					            }
					            vvcount6 = vvcount6 + 1;
					        }
					    }
					});
					var varry7="";	
					var vvcount7=0;					
					$.each(_$isupply7, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry7 = varry7 + array7[i] + ","
				            	}

				            	varr7 = varry7.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount7 == j) {
				                    	$(o).xval(array7[j])
					                }
					            }
					            vvcount7 = vvcount7 + 1;
					        }
					    }
					});
					var varry8="";	
					var vvcount8=0;					
					$.each(_$isupply8, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry8 = varry8 + array8[i] + ","
				            	}

				            	varr8 = varry8.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount8 == j) {
				                    	$(o).xval(array8[j])
					                }
					            }
					            vvcount8 = vvcount8 + 1;
					        }
					    }
					});
					var varry9="";	
					var vvcount9=0;					
					$.each(_$isupply9, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry9 = varry9 + array9[i] + ","
				            	}

				            	varr9 = varry9.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount9 == j) {
				                    	$(o).xval(array9[j])
					                }
					            }
					            vvcount9 = vvcount9 + 1;
					        }
					    }
					});
					var varry10="";	
					var vvcount10=0;					
					$.each(_$isupply10, function(idx, o){
					
						if (idx != 0) {
				        	if ($(o).xval() == "") {

				            	for (i = 0; i < sum_count; i++) {
					                varry10 = varry10 + array10[i] + ","
				            	}

				            	varr10 = varry10.split(",");
				            	//alert(varry)
				            	for (j = 0; j < sum_count; j++) {
				                	if (vvcount10 == j) {
				                    	$(o).xval(array10[j])
					                }
					            }
					            vvcount10 = vvcount10 + 1;
					        }
					    }
					});
					var el = $doc.elelment;
					_me.cal_sum1(el,_$input_trs);
					// 선택한 법인카드의 GL  ADDRESS 값을 최하단에 필드에 설정

					
					return _isvalid1;

				}
				// 날짜 박일 계산 함수
				//몇박 몇일을 계산하는 루틴.....
				function _dateTerm() {
					vSDate = $("input[name='FromDate']").val();
					vEDate = $("input[name='ToDate']").val();
					if ( vSDate == "" || vEDate == "" ) return -100;
					
					var strSDate = vSDate;
					var strEDate = vEDate;
					var arrSDate = new Array(3);
					var arrEDate = new Array(3);
					
					if ( strSDate.indexOf("-") > 0 ) {
						arrSDate = strSDate.split("-");
						arrEDate = strEDate.split("-");
					
					} else if ( strSDate.indexOf("/") > 0 ) {
						arrSDate = strSDate.split("/");
						arrEDate = strEDate.split("/");	
					} else if ( strSDate.indexOf(".") > 0 ) {
						arrSDate = strSDate.split(".");
						arrEDate = strEDate.split(".");	
					}
					
					var vSMonth = eval(arrSDate[1]) - 1;
					var vEMonth = eval(arrEDate[1]) - 1;
						
					var dSDate = new Date(arrSDate[0], vSMonth.toString(), arrSDate[2]);
					var dEDate = new Date(arrEDate[0], vEMonth.toString(), arrEDate[2]);
					
					var vStr = ( dEDate.getTime() - dSDate.getTime() ) / ( 24*60*60*1000 ) + 1;
					
					$("input[name='AppDayC']", $doc.element).xval(vStr);
					$("input[name='AppNightC']", $doc.element).xval(vStr-1);
					//document.forms[0].AppDayC.value = vStr ;
					//document.forms[0].AppNightC.value = vStr -1;
					//return vStr;
				}

			}
				
			//개인별 법인카드 사용 내역 테이블 - 초기화
            , initInputTable: function (_opt, $doc) {
                var _me = _$$.aprv_sub223.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata]", $doc.element).val();

                var _$table = $dwp.ui.table.init($("table[name='" + "sub223" + "_Table01']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal
                    , template: "[name=_template]"
                    , keyfield: ["_USER"]
                    , changeafter: function (act) {
                        if (act == "del") {
                            _me.cal_sum(el);										//삭제시 합계 재계산
                        } else if (act == "add") {
                            //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                        } else if (act == "copy") {
                             _me.cal_sum(el); 									//행 복사시 합계 재계산
                        }
                    }
                    , cell: [
                        {
                            nm: "hgbn01", type: "custom", vfnm: "gbn01", validator: /[^\s]/, label: "aprv_sub_223.title.a15"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='gbn01']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0102", val) + "</div>");
                                    
                                }
                            }
						},
                        {
                            nm: "hcost01", type: "custom", vfnm: "cost01", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_223.title.a16"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='cost01']", $cell);
									_$input.xval(val);                                    

									_$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    //_me.cal_sum(el);
                                    });
	                            } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },            
                        {
                            nm: "hinfo01", type: "custom", vfnm: "info01", validator: /[^\s]/, label: "aprv_sub_223.title.a17"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='info01']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }, 
						{
                            nm: "hunid01", type: "custom", vfnm: "unid01" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='unid01']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
						}, 
						{
                            nm: "hgloffset01", type: "custom", vfnm: "gloffset01" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='gloffset01']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
                        }, 
						{
                            nm: "haddress01", type: "custom", vfnm: "address01" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='address01']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
                        }, 
						{
                            nm: "huserbank01", type: "custom", vfnm: "userbank01" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='userbank01']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
                        }, 
						{
                            nm: "huserbanknum01", type: "custom", vfnm: "userbanknum01" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='userbanknum01']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
                        },
                        {
                            nm: "husercost01", type: "custom", vfnm: "usercost01", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_223.title.a16"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
									//_$type.xval(val);
									var _$inputcost = $("input[name='cost01']", $tr);
									var _$input = $("input[name='usercost01']", $cell);
									var _$inputfinalcost = $("input[name='finalcost01']", $tr);
									_$input.xval(val);                                    


									_$input.on("focus", function () {
										this.select();
									});	
									_$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    //_me.cal_sum(el);
									});
									
									_$input.on("blur", function () {
										//원래 카드값에서 차감금액을 상계처리하고 최종금액을 반영
									
										var _icountcost = _$inputcost.xval();
										_icountcost = _icountcost.replace(/,/gi, "");
										_icountcost = _me.numericCheck(_icountcost, 0);
										

										var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
																			

										var finalcost = _icountcost - _icount;
										finalcost = finalcost + "";

										//원래금액에서 차감금액을 차감하고 최종금액에 반영 후 계산
										_$inputfinalcost.xval(finalcost.toComma());
                                        
	                                    _me.cal_sum(el);
                                    });


	                            } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hfinalcost01", type: "custom", vfnm: "finalcost01", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_223.title.a16"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
									//_$type.xval(val);
                                    var _$input = $("input[name='finalcost01']", $cell);
									_$input.xval(val);                                    

									_$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    //_me.cal_sum(el);
									});

	                            } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },
						
						
                    ]
                });

                //하나의 row는 무조건 생성
                if (_opt.isnew) {
                    _$table.add();
                }
                return _$table;
			}
			//법인용 법인카드 사용 내역 테이블 - 초기화
            , initInputTable01: function (_opt, $doc) {
                var _me = _$$.aprv_sub223.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata_1]", $doc.element).val();

                var _$table1 = $dwp.ui.table.init($("table[name='" + "sub223" + "_Table02']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal
                    , template: "[name=_template]"
                    , keyfield: ["cost02"]
                    , changeafter: function (act) {
                        if (act == "del") {
                            _me.cal_sum1(el);										//삭제시 합계 재계산
                        } else if (act == "add") {
                            //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                        } else if (act == "copy") {
                             _me.cal_sum1(el); 									//행 복사시 합계 재계산
                        }
                    }
                    , cell: [
                        {
                            nm: "hgbn02", type: "custom", vfnm: "gbn02", validator: /[^\s]/, label: "aprv_sub_223.title.a15"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='gbn02']", $cell);
                                    _$type.xval(val);
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0102", val) + "</div>");
                                }
                            }
						}, 
                        {
                            nm: "hcost02", type: "custom", vfnm: "cost02", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_223.title.a16"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='cost02']", $cell);
									_$input.xval(val);                                    

									_$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    //_me.cal_sum(el);
                                    });
	                            } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },         
                        {
                            nm: "hdesc", type: "custom", vfnm: "edesc", validator: /[^\s]/, label: "aprv_sub_223.title.a17"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='edesc']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
						},
						{
                            nm: "hunid02", type: "custom", vfnm: "unid02" ,validator: /[^\s]/
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='unid02']", $cell);
                                    _$type.xval(val);
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        }, 
						{
                            nm: "hgloffset02", type: "custom", vfnm: "gloffset02" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='gloffset02']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
                        }, 
						{
                            nm: "haddress02", type: "custom", vfnm: "address02" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='address02']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
                        }, 
						{
                            nm: "huserbank02", type: "custom", vfnm: "userbank02" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='userbank02']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
                        }, 
						{
                            nm: "huserbanknum02", type: "custom", vfnm: "userbanknum02" 
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='userbanknum02']", $cell);
                                    _$type.xval(val);
                                    
                                    
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    
                                }
                            }
                        }
                    ]
                });

                //하나의 row는 무조건 생성
                if (_opt.isnew) {
                    _$table1.add();
				}
				//alert(_$table1);

                return _$table1;
			}
			//현금 정산 사용 내역 테이블 - 초기화
            , initInputTable03: function (_opt, $doc) {
                var _me = _$$.aprv_sub223.subdoc;
				var el = $doc.elelment;
				
				//var _rate = $("input[name=AppMRate]", $doc.element).val();

				var _tableVal = $("input[name=fld_formdata_3]", $doc.element).val();

                var _$table3 = $dwp.ui.table.init($("table[name='" + "sub223" + "_Table03']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal
                    , template: "[name=_template]"
                    , keyfield: ["hstart3"]
                    , changeafter: function (act) {
                        if (act == "del") {
                            _me.cal_sum3(el);										//삭제시 합계 재계산
                        } else if (act == "add") {
                            //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                        } else if (act == "copy") {
                             _me.cal_sum3(el); 									//행 복사시 합계 재계산
                        }
                    }
                    , cell: [
                        {
                            nm: "hgbn03", type: "custom", vfnm: "gbn03", validator: /[^\s]/, label: "aprv_sub_223.title.a15"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='gbn03']", $cell);
                                    _$type.xval(val);
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0103", val) + "</div>");
                                }
                            }
						},         
                        {
                            nm: "hstart3", type: "custom", vfnm: "start3", validator: /[^\s]/, label: "aprv_sub_223.title.a30"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='start3']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
						},         
                        {
                            nm: "hend3", type: "custom", vfnm: "end3", validator: /[^\s]/, label: "aprv_sub_223.title.a31"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='end3']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
						}, 						
						{
                            nm: "hcost031", type: "custom", vfnm: "cost031", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_223.title.a32"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
									//_$type.xval(val);

									var _$output = $("input[name='cost032']", $tr);
									var _$input = $("input[name='cost031']", $cell);
									
									_$input.xval(val);                                    

									_$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    //_me.cal_sum(el);
									});
									_$input.on("blur", function () {
										//환율 값을 기준으로 입력된 외화금액을 곱해서 원화에 반영
										//var _rate = $("input[name='AppMRate']",$doc.element).val();

										var _rate = $('#AppMRate').val();
										_rate = _rate.replace(/,/gi, "");
										_rate = _me.numericCheck(_rate, 1);

										if (_rate == "" ) {
											$fn.alert({
												msg: $fn.getCodeMsg("aprv_sub_223.msg.error06")
											}); //일당 및 외화 정보 누락
											_$input.xval("0");											
											return false;
										}
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
										_icount = _me.numericCheck(_icount, 0);	

										var _output = Math.round(parseFloat(_icount) * parseFloat(_rate));

										_output = parseFloat(_output) + "";	
										_icount = parseFloat(_icount) + "";				
										

										//원화에 환율 곱해서 삽입
										_$output.xval(_output.toComma());
                                        _$input.xval(_icount.toComma());
	                                    _me.cal_sum3(el);
                                    });
	                            } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },     
                        {
                            nm: "hcost032", type: "custom", vfnm: "cost032", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_223.title.a16"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='cost032']", $cell);
									_$input.xval(val);                                    

									_$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    //_me.cal_sum(el);
									});
									_$input.on("blur", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    _me.cal_sum3(el);
                                    });
	                            } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },     
                        {
                            nm: "hpdate3", type: "date", vfnm: "_PDATE", css: "dwp-center", validator: /[^\s]/, label: "aprv_sub_223.title.a57"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$input = $("input[name='_PDATE']", $cell);
                                    _$input.xval(val);
                                } else {
                                    if (typeof val == "undefined") return;
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        }


                    ]
                });

                //하나의 row는 무조건 생성
                if (_opt.isnew) {
					//신규 작성시 데이터 없이 표현
                    //_$table3.add();
				}
				//alert(_$table1);

                return _$table3;
			}
			//그외 법인카드 사용 미사용분 내역 테이블 - 초기화
            , initInputTable04: function (_opt, $doc) {
                var _me = _$$.aprv_sub223.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata_4]", $doc.element).val();

                var _$table4 = $dwp.ui.table.init($("table[name='" + "sub223" + "_Table04']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal
                    , template: "[name=_template]"
                    , keyfield: ["cost042"]
                    , changeafter: function (act) {
                        if (act == "del") {
                            _me.cal_sum4(el);										//삭제시 합계 재계산
                        } else if (act == "add") {
                            //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                        } else if (act == "copy") {
                             _me.cal_sum4(el); 									//행 복사시 합계 재계산
                        }
                    }
                    , cell: [
                        {
                            nm: "hgbn04", type: "custom", vfnm: "gbn04", validator: /[^\s]/, label: "aprv_sub_223.title.a15"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='gbn04']", $cell);
                                    _$type.xval(val);
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0102", val) + "</div>");
                                }
                            }
						},         
						{
                            nm: "hcost041", type: "custom", vfnm: "cost041", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_223.title.a32"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
									//_$type.xval(val);
									var _$output = $("input[name='cost042']", $tr);
                                    var _$input = $("input[name='cost041']", $cell);
									_$input.xval(val);                                    

									_$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    //_me.cal_sum(el);
									});
									_$input.on("blur", function () {
										//환율 값을 기준으로 입력된 외화금액을 곱해서 원화에 반영
										//var _rate = $("input[name='AppMRate']",$doc.element).val();

										var _rate = $('#AppMRate').val();
										_rate = _rate.replace(/,/gi, "");
										_rate = _me.numericCheck(_rate, 1);

										if (_rate == "" ) {
											$fn.alert({
												msg: $fn.getCodeMsg("aprv_sub_223.msg.error06")
											}); //일당 및 외화 정보 누락
											_$input.xval("0");											
											return false;
										}


                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
										_icount = _me.numericCheck(_icount, 0);	

										var _output = Math.round(parseFloat(_icount) * parseFloat(_rate));

										_output = parseFloat(_output) + "";	
										_icount = parseFloat(_icount) + "";				
										

										//원화에 환율 곱해서 삽입
										_$output.xval(_output.toComma());
                                        _$input.xval(_icount.toComma());
	                                    _me.cal_sum4(el);
                                    });
	                            } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },     
                        {
                            nm: "hcost042", type: "custom", vfnm: "cost042", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_223.title.a16"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='cost042']", $cell);
									_$input.xval(val);                                    

									_$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    //_me.cal_sum4(el);
									});
									_$input.on("blur", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());
	                                    _me.cal_sum4(el);
                                    });
	                            } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
						},
						{
                            nm: "hdesc4", type: "custom", vfnm: "desc4", validator: /[^\s]/, label: "aprv_sub_223.title.a34"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='desc4']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
						},     
                        {
                            nm: "hpdate4", type: "date", vfnm: "_PDATE4", css: "dwp-center", validator: /[^\s]/, label: "aprv_sub_223.title.a57"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$input = $("input[name='_PDATE4']", $cell);
                                    _$input.xval(val);
                                } else {
                                    if (typeof val == "undefined") return;
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        }



                    ]
                });

                //하나의 row는 무조건 생성
                if (_opt.isnew) {
					//신규 작성시 데이터 없이 표현                    
                    //_$table4.add();
				}
				//alert(_$table1);

                return _$table4;
			}

			//입력된 값으로 합계 구하는 함수(개인용)
            , cal_sum: function (el , tr) {                                
                var _me = _$$.aprv_sub223.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=sub223_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                //var _supply_sum = 0;
                //var _total_sum = 0;
				
				
				//alert($("#_REQCOUNT4", tr).val())
				
				//alert($("#_REQCOUNT4").val())
                //alert($("input[name='_REQCOUNT4']", el).xval())
                
				var _$isupply = $("input[name='finalcost01']", _$input_trs);
				var _sum = 0;
				$.each(_$isupply, function(idx, o){
					var _val=0;
                    var _o = $(o).xval().replace(/,/gi, "");
 					if( $.isNumeric(_o) ){
                        console.log(_o);
                        _val = parseFloat(_o);
 						_sum += _val;
					}
                });
                
                _sum = _sum+ "";
                _sum = _sum.toComma();

				$("input[name='ed_total']", el).xval(_sum);

				$("input[name='ed_total_all_3']", el).xval(_sum);
				
				_me.cal_sumall();

			}
			//입력된 값으로 합계 구하는 함수 (법인용)
            , cal_sum1: function (el , tr) {                                
                var _me = _$$.aprv_sub223.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=sub223_Table02]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                //var _supply_sum = 0;
                //var _total_sum = 0;
				
				
				//alert($("#_REQCOUNT4", tr).val())
				
				//alert($("#_REQCOUNT4").val())
                //alert($("input[name='_REQCOUNT4']", el).xval())
                
				var _$isupply = $("input[name='cost02']", _$input_trs);
				var _sum = 0;
				$.each(_$isupply, function(idx, o){
					var _val=0;
                    var _o = $(o).xval().replace(/,/gi, "");
 					if( $.isNumeric(_o) ){
                        console.log(_o);
                        _val = parseFloat(_o);
 						_sum += _val;
					}
                });
                
                _sum = _sum+ "";
                _sum = _sum.toComma();

				$("input[name='ed_total_1']", el).xval(_sum);
				
				$("input[name='ed_total_all_4']", el).xval(_sum);

				_me.cal_sumall();
			}
			//입력된 값으로 합계 구하는 함수 ( 현금)
            , cal_sum3: function (el , tr) {                                
                var _me = _$$.aprv_sub223.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=sub223_Table03]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                //var _supply_sum = 0;
                //var _total_sum = 0;
				
				
				//alert($("#_REQCOUNT4", tr).val())
				
				//alert($("#_REQCOUNT4").val())
                //alert($("input[name='_REQCOUNT4']", el).xval())
                
				var _$isupply = $("input[name='cost032']", _$input_trs);
				var _sum = 0;
				$.each(_$isupply, function(idx, o){
					var _val=0;
                    var _o = $(o).xval().replace(/,/gi, "");
 					if( $.isNumeric(_o) ){
                        console.log(_o);
                        _val = parseFloat(_o);
 						_sum += _val;
					}
                });
                
                _sum = _sum+ "";
                _sum = _sum.toComma();

				$("input[name='ed_total_2']", el).xval(_sum);
				_me.cal_sumall();
			}
			//입력된 값으로 합계 구하는 함수 ( 그외 금액)
            , cal_sum4: function (el , tr) {                                
                var _me = _$$.aprv_sub223.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=sub223_Table04]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                //var _supply_sum = 0;
                //var _total_sum = 0;
				
				
				//alert($("#_REQCOUNT4", tr).val())
				
				//alert($("#_REQCOUNT4").val())
                //alert($("input[name='_REQCOUNT4']", el).xval())
                
				var _$isupply = $("input[name='cost042']", _$input_trs);
				var _sum = 0;
				$.each(_$isupply, function(idx, o){
					var _val=0;
                    var _o = $(o).xval().replace(/,/gi, "");
 					if( $.isNumeric(_o) ){
                        console.log(_o);
                        _val = parseFloat(_o);
 						_sum += _val;
					}
                });
                
                _sum = _sum+ "";
                _sum = _sum.toComma();

				$("input[name='ed_total_3']", el).xval(_sum);
				_me.cal_sumall();
			}
			//입력된 유류비  / 현금 / 개인 이용 금액에 대한 합계를 구하는 함수
			//이 함수는 유류비 계산시 / 
			//현금 사용 등록시
			//개인 카드 등록시 이벤트에 설정


			//입력된 값으로 합계 구하는 함수
            , cal_sumall: function (el , tr) {                                
                var _me = _$$.aprv_sub223.subdoc;
				
				var _sum = 0;				
				
				var _proc1sum = 0;				
				var _proc2sum = 0;				
				var _proc3sum = 0;				

				var _val=0;
				var _daysum = $("input[name='A05_KRW']").val().replace(/,/gi, "");
				var _foodsum = $("input[name='A06_KRW']").val().replace(/,/gi, "");

				var _ucardsum = $("input[name='ed_total']").val().replace(/,/gi, "");
				var _ccardsum = $("input[name='ed_total_1']").val().replace(/,/gi, "");

				var _oilsum = $("input[name='ed_oil_sum']").val().replace(/,/gi, "");

				var _cashsum = $("input[name='ed_total_2']").val().replace(/,/gi, "");
				var _etcsum = $("input[name='ed_total_3']").val().replace(/,/gi, "");

				_sum =  parseFloat(_daysum) + parseFloat(_foodsum) + parseFloat(_ucardsum) + parseFloat(_ccardsum) + parseFloat(_oilsum) + parseFloat(_cashsum) + parseFloat(_etcsum);
                _sum = _sum+ "";
				_sum = _sum.toComma();
				$("input[name='ed_total_all']", el).xval(_sum);

				_proc1sum = parseFloat(_ucardsum);
				_proc1sum = _proc1sum +"";
				_proc1sum = _proc1sum.toComma();
				$("input[name='ed_total_proc1']", el).xval(_proc1sum); // 개인용

				_proc2sum = parseFloat(_ccardsum);
				_proc2sum = _proc2sum +"";
				_proc2sum = _proc2sum.toComma();
				$("input[name='ed_total_proc2']", el).xval(_proc2sum); // 법인용

				_proc3sum = parseFloat(_daysum) + parseFloat(_foodsum) + parseFloat(_oilsum) + parseFloat(_cashsum) + parseFloat(_etcsum);
				_proc3sum = _proc3sum +"";
				_proc3sum = _proc3sum.toComma();
				$("input[name='ed_total_proc3']", el).xval(_proc3sum);	//그외 모두

				/*****************************************/
				_proc3sum = parseFloat(_oilsum) + parseFloat(_cashsum) + parseFloat(_etcsum);
				_proc3sum = _proc3sum +"";
				_proc3sum = _proc3sum.toComma();
				$("input[name='ed_total_all_5']", el).xval(_proc3sum);	//그외 모두 (일비 / 식비 제외하고 합계를 표시)
				/*****************************************/


				// 마지막 계산될 때 선택된 카드의 GL / ADDRESS 설정
				// 기타 금액은 기타 GL
				/*
				//계산될때 
				var _gl1 = $("input[name='gloffset01']").val();
				var _ad1 = $("input[name='address01']").val();
				var _ub1 = $("input[name='userbank01']").val();
				var _ubn1 = $("input[name='userbanknum01']").val();
				$("input[name='GL1']", el).xval(_gl1);
				$("input[name='ADDRESS1']", el).xval(_ad1);
				$("input[name='UBANK1']", el).xval(_ub1);
				$("input[name='UBANKNUM1']", el).xval(_ubn1);
				*/
				
				
				//$("input[name='GL2']", el).xval($("input[name='gloffset02']").val());	
				//$("input[name='ADDRESS2']", el).xval($("input[name='address02']").val());	

				var first_comp_card_gl;
				var first_comp_card_address;

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
			, save : function($doc,opt){
				var _me = _$$.aprv_sub223.subdoc;	
				var _opt = $doc.options;
				var _aopt = $.extend({actiontype:""}, opt);
				var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element).xtable("instance");
				var _$table1 = $("table[name=" + _me.SUBNAME + "_Table02]", $doc.element).xtable("instance");
				var _$table3 = $("table[name=" + _me.SUBNAME + "_Table03]", $doc.element).xtable("instance");
				var _$table4 = $("table[name=" + _me.SUBNAME + "_Table04]", $doc.element).xtable("instance");

				var el = $doc.element;				
				
				
				if($("input[name=chk]").val() ==""
				|| $("input[name=chk_1]").val() ==""
				|| $("input[name=chk_2]").val() ==""
				|| $("input[name=chk_3]").val() ==""
				|| $("input[name=chk_4]").val() ==""
				|| $("input[name=chk_5]").val() ==""
				){
					  $fn.alert({msg : $fn.getCodeMsg("aprv_sub_223.title.a77")});   //촬영일시 
         				return false;
					
				}
				

 				//****************************************************//
                //				임시저장인 경우  Validate 체크를 제외                
                //****************************************************//
                if (_aopt.actiontype == "draft") {
					$("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
					$("input[name=fld_formdata_1]", $doc.element).val(_$table1.getData(false));
					$("input[name=fld_formdata_3]", $doc.element).val(_$table3.getData(false));
					$("input[name=fld_formdata_4]", $doc.element).val(_$table4.getData(false));
                    return true;
				}
				
				if ($("input[name='AppMRate']", el).xval() == "") {
					$fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_223.msg.error06")
                    }); //일비 및 식비 계산을 선택하세요.
                    return false;
				}				

				if(  $("select[name='A08']", $doc.element).find("option:selected").xval() != "0" ) {
					if ($("input[name='A09']", el).xval() == "") {
						$fn.alert({
							msg: $fn.getCodeMsg("aprv_sub_223.msg.error07")
						}); //식비 차감 사유를 입력하세요.
						return false;
					}	
				}

				if(  $("select[name='A10']", $doc.element).find("option:selected").xval() != "0" ) {
					if ($("input[name='A11']", el).xval() == "") {
						$fn.alert({
							msg: $fn.getCodeMsg("aprv_sub_223.msg.error07")
						}); //식비 차감 사유를 입력하세요.
						return false;
					}	
				}

				if(  $("select[name='A12']", $doc.element).find("option:selected").xval() != "0" ) {
					if ($("input[name='A13']", el).xval() == "") {
						$fn.alert({
							msg: $fn.getCodeMsg("aprv_sub_223.msg.error07")
						}); //식비 차감 사유를 입력하세요.
						return false;
					}	
				}


				if ($("input[name='dcode']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_223.msg.error02")
                    }); //부서정보 필수 입력
                    return false;
				}
				if ($("input[name='acccode']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_223.msg.error03")
                    }); //계정정보 필수 입력
                    return false;
				}

				//결재 요청시 개인명 법인카드 금액이 0 아니고 (즉 금액이 있음)
				//GL 값과 ADDRDSS 값이 존재하지 않으면 에러로  결재 진행되지 않도록 팝업 처리				
				//20201203 By khpark

				if (_aopt.actiontype == "raise") {					
					if ($("input[name='ed_total_proc1']", el).xval() != "0") {
						if ( $("input[name='GL1']", el).xval() == "" || $("input[name='ADDRESS1']", el).xval() == "" ) {
							$fn.alert({
								msg: $fn.getCodeMsg("aprv_sub_223.title.a78")
							}); //계정정보 필수 입력
							return false;
						}
					}
					if ($("input[name='ed_total_proc2']", el).xval() != "0") {
						if ( $("input[name='GL2']", el).xval() == "" || $("input[name='ADDRESS2']", el).xval() == "" ) {
							$fn.alert({
								msg: $fn.getCodeMsg("aprv_sub_223.title.a78")
							}); //계정정보 필수 입력
							return false;
						}
					}
				}
                //필수입력 체크
				var _isvalid = true;
				/*
                if (!_$table.validate()) {
                    _isvalid = false;
                    return false;
				}
				if (!_$table1.validate()) {
                    _isvalid = false;
                    return false;
				}
				*/
				if (_aopt.actiontype == "raise") {
					if (!_$table3.validate()) {
						_isvalid = false;
						return false;
					}
					if (!_$table4.validate()) {
						_isvalid = false;
						return false;
					}

				}	
				
				
                // $fn.validate($el) {
                //     _isvalid = false;
                //     return false;
                // }
                // if (!$fn.validate($("table[name='subform054_body']"))) {
                //     _isvalid = false;
                //     return false;
                // }

				$("input[name=fld_formdata]", $doc.element).val(_$table.getData());
				$("input[name=fld_formdata_1]", $doc.element).val(_$table1.getData());
				$("input[name=fld_formdata_3]", $doc.element).val(_$table3.getData());
				$("input[name=fld_formdata_4]", $doc.element).val(_$table4.getData());

				//제목에 출장정산서 사업장 정보를 반영해서 제목 생성                
                if (_aopt.actiontype == "raise") {
					var _val_loc = $("[name=WorkArea_1]", $doc.element).val();
					
                	var origSubject = $("[name=Subject]", $doc.element).val();

                	if( origSubject.indexOf("E1]:") > 0 || origSubject.indexOf("C1]:") > 0 || origSubject.indexOf("S1];") > 0 || origSubject.indexOf("R1];") > 0 ) {							
						origSubject = origSubject.substring( 5, origSubject.length );
						$("[name=Subject]", $doc.element).val( "["+_val_loc+"]:"+ origSubject );	
                	} else {
						$("[name=Subject]", $doc.element).val( "["+_val_loc+"]:"+ $("[name=Subject]", $doc.element).val() );	
                	}
				}		


                console.log("223 save : ", _isvalid);
                return _isvalid;    

				//var _isvalid = true;
				//alert($("input[name='fld_formdata']",el).xval())
				//alert(_$table)
				//var $input = $("input[name='_USER']", $cell);
				//alert(  $input.xval())
				//console.log("082 save : ", _isvalid);
			}
		}
	}
}
($dwp.cns("app"), jQuery));









