/* Source File Upload Time : 2022-05-09 2:39:39 PM*/


/* Source File Upload Time : 2019-12-09 11:41:43 AM*/


/* Source File Upload Time : 2019-12-09 2:28:48 AM*/


/* Source File Upload Time : 2019-12-08 11:22:12 PM*/


/* Source File Upload Time : 11-4-19 3:48:42 PM*/


/* Source File Upload Time : 2019-11-04 3:47:50 PM*/


/* Source File Upload Time : 10-22-19 1:59:40 PM*/


/* Source File Upload Time : 10-16-19 6:15:28 PM*/


/* Source File Upload Time : 10-16-19 2:29:27 PM*/


/* Source File Upload Time : 9-26-19 11:47:42 AM*/


/* Source File Upload Time : 9-25-19 6:35:36 PM*/


/* Source File Upload Time : 2019-08-12 8:43:57 AM*/


/* Source File Upload Time : 2019-07-30 9:17:03 AM*/


/* Source File Upload Time : 2019-07-29 5:04:30 PM*/



/**
 * 전자결재 보조양식 - 지불증(접대비)
 * $dwp.app.aprv_sub225
 */

(function (_$$, $) {
    _$$.aprv_sub225 = {
        subdoc: {
            SUBNAME: "sub225",
			PAMT_DB    : "/dwp/aprv/com/comm_code.nsf",	
            init: function ($doc) {
                var _me = _$$.aprv_sub225.subdoc,
                opt = $doc.options;
                var el = $doc.element;
				var _$table01 = $("table[name=sub225_Table01]", $doc.element);
				
				 //새문서일 경우
				 if (opt.isnew) {
                    //$("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko"));
					$("[name=Subject]", $doc.element).attr({'placeholder' : $fn.getCodeMsg("aprv_sub_225.msg.a1")   });    
					
					if ( $("[name=UDEPT_CODE]", $doc.element).val() != "" && $("[name=UDEPT_CODE]", $doc.element).val() != "error" ) {

                        $("[name=_DEPT]", $doc.element).xval( $("[name=UDEPT_CODE]", $doc.element).val()+ "/" + $("[name=UDEPT_VALUE]", $doc.element).val() );    
                        $("[name=_DEPT_INFO]", $doc.element).xval( $("[name=UDEPT_CODE]", $doc.element).val()+ "¶" + $("[name=UDEPT_VALUE]", $doc.element).val()  );    
                    }

                    if ( $("[name=UBU_CODE]", $doc.element).val() != "" && $("[name=UBU_CODE]", $doc.element).val() != "error" ) {

                        $("[name=_BUCODE]", $doc.element).xval( $("[name=UBU_CODE]", $doc.element).val()+ "/" + $("[name=UBU_VALUE]", $doc.element).val() );    
                        $("[name=_BUCODE_INFO]", $doc.element).xval( $("[name=UBU_CODE]", $doc.element).val()+ "¶" + $("[name=UBU_VALUE]", $doc.element).val()  );    
                    }


                }

                var _isedit = opt.isedit;
                //결재 중간에 편집시에는 지출결의서 영역 편집 불가
                if (opt.isedit == true && opt.docstatus != "draft") {
					//alert(opt.docstatus )
                    if(opt.docstatus =="complete") {                        
                       _isedit = true;  
                    } else if(opt.docstatus =="receivewait") {                        
                        _isedit = true;     
                    } else if(opt.docstatus =="received") {                        
                        _isedit = true;
                    }else{
                         _isedit = false;
                    }

                }
                var _opt = $.extend({}, opt, {
                        isedit: _isedit
					});
					
				//보존년한 변경시 에러 발생처리
                var _$DocPeriod = $("select[name='DocPeriod']");
                _$DocPeriod.bind("change" , function(){
                    var _val = $("select[name='DocPeriod']", $doc.element).find("option:selected").xval();

                    if ( _val != "99" ) {        //보존년한 영구 강제 설정
                        $("select[name='DocPeriod']", $doc.element).xval("99")
                    }
				} );
					

                //외주구매발주서 입력테이블
                var _$table = _me.initInputTable(_opt, $doc, "");

                var _newopt = $.extend({}, _opt, {
                        dtable: _$table
                    });
                $doc.options = _newopt;
				
				//계정사용
				$("#_pop5").on("click", function () {
					var _form = "wMeetingView";
					 	var _rptDailog = $fn.dialog(null, {
								        modal: true,
								        resizable: false,
								        draggable: true,
								        islangconvert: false,
								        referdata: el,
								        title: $fn.getCodeMsg("aprv_sub_225.title.a16"),
								        width: 1100,
								        height: 800,
								        show: 'fade', //effect
								        hide: 'fade', //effect
								        langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_225.lang.js",
								        buttons: [],
										content: {
								            html: "",
								            //url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								             url: "/dwp/aprv/com/comm_code.nsf" + "/wFrm50Pop?ReadForm" 
																			            
								        },
								        close: function () { //2017.01.19

								        }
										
                                     
								    });
				});	//개인명의법인카드 끝
					//전결규정이미지					
					 //전결기준 팝업
					$( '#_pop55' ,el).click(function() {
												
		
					//dwp/aprv/hq/complete/aprvcomplete.nsf/
					var _rptDailog = $fn.dialog(null, {
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: el,
						title: $fn.getCodeMsg("aprv_sub_225.title.a24"),
						width: 1150,
						height: 500,
						show: 'fade', //effect
						hide: 'fade', //effect
						langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_225.lang.js",
						content: {
							html: "",
							//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
							url: "dwp/aprv/com/aprvstart.nsf/Form225?OpenPage"
							//														, data : {view : _view
						,
							count: 15
						},
						close: function () { //2017.01.19

						}
					});
				});
				//개인명의법인카드
				$("#_pop2").on("click", function () {
					var _form = "wMeetingView";
					var _rptDailog = $fn.dialog(null, {
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: el,
						title: $fn.getCodeMsg("aprv_sub_225.title.a13"),
						width: 1100,
						height: 800,
						show: 'fade', //effect
						hide: 'fade', //effect
						langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_225.lang.js",
						content: {
							html: "",
							//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								url: "/dwp/aprv/com/card_complete.nsf" + "/wFrmPopView3?ReadForm&USER_NAME=" 
							
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
									var sum_count=0;
									var kind="";
									var kind1="";
									var gloffset="";
									var address="";
									var userbank="";
									var userbanknum="";
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
											vat_amount += o._VAT_AMOUNT + ",";
											sum_count = sum_count + 1;
											kind += "개인명의법인카드" + ",";
											kind1 += "1" + ",";
											gloffset += o._GLOFFSET + ",";
											address += o._ADDRESS + ",";
											userbank += o._USERBANK + ",";
											userbanknum += o._USERBANK_NUM + ",";
											//TmpCashCard+="2";
											
									});


									//필드 보내기
									_addLine(sum_count);
									setTimeout(function() { //라인 늘리고 딜레이를 줘야 값이 들어감
										//alert("@")
											_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,
											vat_amount,sum_count,kind,kind1,gloffset,address,userbank,userbanknum)
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
				
				//팝업에서 선택한 문서갯수가 많을때 라인 추가 함수
				function _addLine(sum_count) {
				    var _me = _$$.aprv_sub225.subdoc;

				    var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);

					var _$input_trs = $("tr", _$input_tbl);
					
					
				    var _$isupply00 = $("#_jangso", _$input_trs); //거래처명
					//_REQCOUNT
					//var _$isupply00 = $("#_REQCOUNT", _$input_trs); //증빙종류
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
				
				//자식창에서 부모창 값을 내리기
                function _addItem(_MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,
					card_num,amt_amount,vat_amount,sum_count,kind,kind1,gloffset,address,userbank,userbanknum) {
                     
				/*

				1 : 개명 법
				2 : 법명 법
				6 : 개명 개
				7 : 현금

				2†2019-10-14†2000¶重役室†203¶경영（일반）창원†1†ㅁ†ㅁ†48,497†ㅁ†ㅁㅁ†1†FAMILYANDINDUSTRIALHEA†2†67D56ED2CA78C44C4925849A000004A8†P59†1000†††0†0;
				2†2019-10-15†2201¶財務T-稅務P†204¶총무（일반）창원†1†ㅁ†ㅁ†33,888†ㅁ†ㅁㅁ†1†CHEVRON0207382†2†9D8B0D53FBFE2DEF4925849A000004AA†P59†1000†††0†0;
				2†2019-10-26†2206¶製造1T†208¶영업（간접）창원†1††ㅁㅁ†14,000†ㅁㅁㅁㅁ†ㅁㅁ†1†창포면옥†2†1D0EF8A3BFDFD096492584A1000002AA†P59†1000†††12,727†1,273
				
				1. 구분 ( 개법 법법 개카 현금)
				2. 접대일자
				3. 부서코드
				4. BU코드
				5. 경합사 유무
				6.접대국가
				7.접대목적
				8.금액
				9.접대객명단
				10.응대자명단
				11.김영란 유무
				12.카드사용처
				13. 2: 카드종류
				14. 카드 UNID
				15. GL
				16. ADDRESS
				17. 은행
				18. 계좌번호
				19. 공급가액
				20. 부가세
					
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
 
					var _me = _$$.aprv_sub225.subdoc;
				
					var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);

					var _$input_trs = $("tr", _$input_tbl);

					//var _$isupply4 = $("#_REQCOUNT6", _$input_trs); //코드? 96855
					//var _$isupply5 = $("#_REQCOUNT8", _$input_trs); //설명
					var _$isupply6 = $("#_cardunid", _$input_trs); //unid
					
					var _$isupply4 = $("#gloffset01", _$input_trs); //gloffset01
					var _$isupply5 = $("#address01", _$input_trs); //address01
					var _$userbank01 = $("#userbank01", _$input_trs); //userbank01
					var _$userbanknum01 = $("#userbanknum01", _$input_trs); //userbanknum01
					
					//쓰는필드 
					var _$isupply3 = $("#_REQCOUNT4", _$input_trs); //금액

					var _$isupply1 = $("select[name='_REQCOUNT']", _$input_trs); //증빙종류	
					
					var _$isupply7 = $("#_kindcode", _$input_trs); //증빙코드

					var _$isupply2 = $(".dwp-calendar-form input[name='_REQCOUNT1']", _$input_trs);
					//var _$isupply2 = $("#_REQCOUNT1", _$input_trs); //일자


					var _$isupply = $("#_jangso", _$input_trs); //거래처명
								
					var _$isupply8 = $("#_REQCOUNT2", _$input_trs); //amt_amount
					var _$isupply9 = $("#_REQCOUNT3", _$input_trs); //vat_amount

					//var _$isupply10 = $("#_REQCOUNT13", _$input_trs); //TmpCashCard
					
					var array=_MERC_NAME.slice(0,-1); //맨뒤 , 자름 거래처명
					var array1=kind.slice(0,-1); //증빙종류
					var array2=date_val.slice(0,-1); //일자
					var array3=money_val.slice(0,-1);//금액
					
					var array4=gloffset.slice(0,-1); //db작업시 필요 필드 코드 ex951555
					var array5=address.slice(0,-1); //Description
					var array6=unid.slice(0,-1); //unid
					var array7=kind1.slice(0,-1); //card_num
					
					var array8=amt_amount.slice(0,-1); //amt_amount
					var array9=vat_amount.slice(0,-1); //vat_amount
					//var array10=TmpCashCard.slice(0,-1); //card_num
					var array10=userbank.slice(0,-1); //vat_amount
					var array11=userbanknum.slice(0,-1); //vat_amount
					
					array=array.split(",");
					array1=array1.split(",");
					array2=array2.split(",");
					array3=array3.split(",");
					array4=array4.split(",");
					array5=array5.split(",");
					array6=array6.split(",");
					array7=array7.split(",");
					array8=array8.split(",");
					array9=array9.split(",");
					array10=array10.split(",");
					array11=array11.split(",");
					//array10=array10.split(",");
							
							
					var _isvalid1 = true;
						
					var varry11="";	
					var vvcount11=0;
					$.each(_$userbanknum01, function(idx, o3){
						if (idx != 0) {
							if ($(o3).xval() == "") {
								for (i = 0; i < sum_count; i++) {
									varry11 = varry11 + array11[i] + ","
								}
								varry11 = varry11.split(",");
								//alert(varry)
								for (j = 0; j < sum_count; j++) {
									if (vvcount11 == j) {
										$(o3).xval(array11[j])
									}
								}
								vvcount11 = vvcount11 + 1;
							}
						}
					});	
						
					var varry10="";	
					var vvcount10=0;
					$.each(_$userbank01, function(idx, o3){
						if (idx != 0) {
							if ($(o3).xval() == "") {
								for (i = 0; i < sum_count; i++) {
									varry10 = varry10 + array10[i] + ","
								}
								varry10 = varry10.split(",");
								//alert(varry)
								for (j = 0; j < sum_count; j++) {
									if (vvcount10 == j) {
										$(o3).xval(array10[j])
									}
								}
								vvcount10 = vvcount10 + 1;
							}
						}
					});	
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
										$(o2).xval(array[j])
									}
								}
								vvcount = vvcount + 1;
							}
						}
					});
					
					var varry1="";	
					var vvcount1=0;
					$.each(_$isupply1, function(idx, o3){
						//alert("@@")
						if (idx != 0) {
							//alert($(o3).xval())
							//if ($(o3).xval() == "X" || $(o3).xval() == "C" || $(o3).xval() == "D" ) {
							if ($(o3).xval() == "X" ) {	
								for (i = 0; i < sum_count; i++) {
									if (array7[i] =="1") {
										varry1 = varry1 + "A" + ","
									} else if (array7[i] =="2") {	
										varry1 = varry1 + "B" + ","
									}
									
								}
								varry1 = varry1.split(",");
								//alert(varry1)
								for (j = 0; j < sum_count; j++) {
									if (vvcount1 == j) {
										//alert(array7[j])

										if (array7[j] =="1") {											
											$(o3).val("A")
										} else if (array7[j] =="2") {	
											$(o3).val("B")
										}

										
									}
								}
								vvcount1 = vvcount1 + 1;
							}
						}
					});	
					
					var varry2="";	
					var vvcount2=0;
					$.each(_$isupply2, function(idx, o){
						//alert(idx);
						if (idx != 0) {
							if ($(o).xval() == "") {
								for (i = 0; i < sum_count; i++) {
									varry2 = varry2 + array2[i] + ","
								}
								varry2 = varry2.split(",");
								//alert(varry)
								for (j = 0; j < sum_count; j++) {
									if (vvcount2 == j) {
										$(o).xval(array2[j])
									}
								}
								vvcount2 = vvcount2 + 1;
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
					var varry4="";	
					var vvcount4=0;	
					$.each(_$isupply4, function(idx, o){
						if (idx != 0) {
							if ($(o).xval() == "") {

								for (i = 0; i < sum_count; i++) {
									varry4 = varry4 + array4[i] + ","
								}

								varry4 = varry4.split(",");
								//alert(varry)
								for (j = 0; j < sum_count; j++) {
									if (vvcount4 == j) {
										$(o).xval(array4[j])
									}
								}
								vvcount4 = vvcount4 + 1;
							}
						}				
					});	

					var varry5="";	
					var vvcount5=0;	
						
					$.each(_$isupply5, function(idx, o){
						if (idx != 0) {
							if ($(o).xval() == "") {
								for (i = 0; i < sum_count; i++) {
									varry5 = varry5 + array5[i] + ","
								}
								varry5 = varry5.split(",");
								//alert(varry)
								for (j = 0; j < sum_count; j++) {
									if (vvcount5 == j) {
										$(o).xval(array5[j])
									}
								}
								vvcount5 = vvcount5 + 1;
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
								varry7 = varry7.split(",");
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
								varry8 = varry8.split(",");
								//alert(varry)
								for (j = 0; j < sum_count; j++) {
									if (vvcount8 == j) {
										$(o).xval(array8[j].toComma())
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

							varry9 = varry9.split(",");
							//alert(varry)
							for (j = 0; j < sum_count; j++) {
								if (vvcount9 == j) {
									$(o).xval(array9[j].toComma())
								}
							}

							vvcount9 = vvcount9 + 1;

						}

					}
					
					});	

					var el = $doc.elelment;
					_me.cal_sum(el,_$input_trs)
					
					return _isvalid1;
				}
				
				//팀전용법인카드
				$("#_pop3").on("click", function () {
					var _form = "wMeetingView";
					var _rptDailog = $fn.dialog(null, {
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: el,
						title: $fn.getCodeMsg("aprv_sub_225.title.a14"),
						width: 1100,
						height: 800,
						show: 'fade', //effect
						hide: 'fade', //effect
						langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_225.lang.js",
						content: {
							html: "",
							//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
								url: "/dwp/aprv/com/card_complete.nsf" + "/wFrmPopView2?ReadForm" 
							
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
									var sum_count=0;
									var kind="";
									var kind1="";
									var gloffset="";
									var address="";
									var userbank="";
									var userbanknum="";
									$.each(element.getChecked(), function (i, o) {
										//팝업에서 선택한 정보 문자열로 만들기
											MERC_NAME += o._MERC_NAME + ",";
											card_val += o._cardval + ",";
											date_val += o._date + ",";
											money_val += o._money + ",";
											code_val += o._Code + ",";
											Description += o._Description + ",";
											unid += o._unid + ",";
											card_num += o._CARD_NUM + ",";
											amt_amount += o._AMT_AMOUNT + ",";
											vat_amount += o._VAT_AMOUNT + ",";
											sum_count = sum_count + 1;
											kind += "법인명의법인카드" + ","
											kind1 += "2" + ",";
											gloffset += o._GLOFFSET + ",";
											address += o._ADDRESS + ",";
											userbank += o._USERBANK + ",";
											userbanknum += o._USERBANK_NUM + ",";
											//TmpCashCard+="2";
											
									});
									//필드 보내기
									//필드 보내기
									_addLine(sum_count);
									setTimeout(function() {
										//alert("@")
											_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,
											amt_amount,vat_amount,sum_count,kind,kind1,gloffset,address,userbank,userbanknum)
									},500);
									//_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count)
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
				});	//팀전용
				
				//항공전용카드
				$("#_pop4").on("click", function () {
					var _form = "wMeetingView";
				 	var _rptDailog = $fn.dialog(null, {
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: el,
						title: $fn.getCodeMsg("aprv_sub_225.title.a14"),
						width: 1100,
						height: 800,
						show: 'fade', //effect
						hide: 'fade', //effect
						langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_225.lang.js",
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
									var sum_count=0;
									var kind=""
									var kind1=""
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
											sum_count=sum_count+1;
											kind +="항공권전용법인카드"+",";
											kind1+="4"+",";
											//TmpCashCard+="2";
											
									});
									//필드 보내기
									//필드 보내기
									_addLine(sum_count);
									setTimeout(function() {
										//alert("@")
											_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count,kind,kind1)
									},300);
									//_addItem(MERC_NAME,card_val,date_val,money_val,code_val,Description,unid,card_num,amt_amount,vat_amount,sum_count)
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
				});	//항공전용카드 끝
				
	
				//사용자 선택 팝업
                $("#_pop").on("click", function () {
                    var _customerDB = _me.PAMT_DB;
                     //====================================================
                     //				회합관리코드 호출
                     // 				- 2019.07.11 by 나노브레인
                     //====================================================
                    var _form = "w_use_custcode";
                     //====================================================
                    var _rptDailog = $fn.dialog(null, {
                             modal: true,
                             resizable: false,
                             draggable: true, 
                             islangconvert: false,
                             referdata: el,
                             title: $fn.getCodeMsg("aprv_sub_225.title.a2"),
                             width: 1100,
                             height: 800,
                             show: 'fade', //effect
                             hide: 'fade', //effect
                             langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_133.lang.js",
                             content: {
                                 html: "",
                                 		//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                 url: "/dwp/aprv/com/densocode.nsf" + "/wFrmPopView1?ReadForm&view=" + _form
                                 //														, data : {view : _view
                             ,
                                 count: 15
                             },
                             close: function () { //2017.01.19

                        	}
                    });
				});	
	    		$("#_pop1").on("click", function () {
                	var _customerDB = _me.PAMT_DB;
					//====================================================
					//				회합관리코드 호출
					// 				- 2019.07.11 by 나노브레인
					//====================================================
					var _form = "w_use_usercode";
					//====================================================
                    var _rptDailog = $fn.dialog(null, {
						modal: true,
						resizable: false,
						draggable: true, 
						islangconvert: false,
						referdata: el,
						title: $fn.getCodeMsg("aprv_sub_225.title.a3"),
						width: 1100,
						height: 800,
						show: 'fade', //effect
						hide: 'fade', //effect
						langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_133.lang.js",
						content: {
							html: "",
									//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
							url: "/dwp/aprv/com/densocode.nsf" + "/wFrmPopView2?ReadForm&view=" + _form
							//														, data : {view : _view
						,
							count: 15
						},
						close: function () { //2017.01.19

						}
                    });
				});		
				
				//부서예산코드 일괄적용                
				$("#_proc001").on("click", function () {				    
					_me.all_set_Field(el , "_DEPT" , "_DEPT_INFO");
				});
				//제품부서코드 일괄적용                
				$("#_proc002").on("click", function () {				    
					_me.all_set_Field(el , "_BUCODE" , "_BUCODE_INFO");
				});
            },
	        //지출결의서 비용관련 예산 표시 테이블 - 초기화
            initInputTable: function (_opt, $doc) {
                var _me = _$$.aprv_sub225.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata]", $doc.element).val();
				//alert(_tableVal)
                var _$table = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table01']", $doc.element), {
                        isedit: _opt.isedit,
                        initdata: _tableVal,
                        template: "[name=_template]",
                        keyfield: ["_"],
                        changeafter: function (act, tr, inst) {
                            if (inst.options.isedit) {
								//alert(act)
                                if (act == "del") {
									//console.log("들어옴");
									//$fn.alert({msg:$("#_REQCOUNT4", tr).val()});
									_me.cal_sum(el,tr);
                                  // minor = $("#sum").val() - $("#_REQCOUNT4", tr).val();
                                  // $("#sum").val(minor);
                                }
                            }
                        },
                        cell: [
							{	//구분/ 개인명 법인카드 / 법인명 법인카드 / 개인용 개인카드 / 현금
                                nm: "hreqcount",
                                type: "custom",
                                vfnm: "_REQCOUNT",
                                css: "dwp-center",
                                validator: /[^\s]/,
                                label: "aprv_sub_225.title.a3",
                                drawfn: function (val, $cell, $tr, inst) {
							
									 if (inst.options.isedit) {
                                        var $input = $("select[name='_REQCOUNT']", $cell);
										var $input1 = $("select[name='_REQCOUNT']", $tr);
										var $input2= $("input[name='_jangso']", $tr);
										// _REQCOUNT4
										var $input3= $("input[name='_REQCOUNT4']", $tr);//금액
										var $input4= $("input[name='_REQCOUNT1']", $tr);//날짜
										var $input5= $("input[name='_kindcode']", $tr);//_kindcode
										var $input6= $("input[name='_cardunid']", $tr);//_cardunid
										var $input7= $("input[name='gloffset01']", $tr);//gloffset01
										var $input8= $("input[name='address01']", $tr);//address01
										var $input9= $("input[name='userbank01']", $tr);//userbank01
										var $input10= $("input[name='userbanknum01']", $tr);//userbanknum01
										var $input11= $("input[name='_REQCOUNT2']", $tr);//원금
										var $input12= $("input[name='_REQCOUNT3']", $tr);//부가세
                                        $input.xval(val);
										 	$input.on("click", function () {
										   if($input.xval() == "A" ){
										   $fn.alert({msg : $fn.getCodeMsg("aprv_sub_225.title.a19")});   
										   $input.xval("A");
										   return false;
										   }
										  if($input.xval() == "B" ){
										  $fn.alert({msg : $fn.getCodeMsg("aprv_sub_225.title.a20")});   
										   $input.xval("B");
										   return false;
										  }
										});
										$input.on("change", function () {
											if($input.xval() == "A" ){
												$fn.alert({msg : $fn.getCodeMsg("aprv_sub_225.title.a19")});   
												$input3.xval("0");
												$input3.attr("readonly",true);
										   		$input.xval("X");
										   		return false;
										    }
										    if($input.xval() == "B" ){
												  $fn.alert({msg : $fn.getCodeMsg("aprv_sub_225.title.a20")});   
												  $input3.xval("0");
												  $input3.attr("readonly",true);
										   		$input.xval("X");
										   		return false;
										  		}
										   	if($input.xval() == "D" ){
										 	// $fn.alert({msg : $fn.getCodeMsg("aprv_sub_225.title.a20")});  
												var date = new Date();
												var vdate= date.getFullYear() + "." + ("0"+(date.getMonth()+1)).slice(-2) + "." + ("0"+date.getDate()).slice(-2);										 
												$input2.xval(" ");
												$input3.xval("0");
												$input3.attr("readonly",false);
												$input4.xval(vdate);
												$input5.xval("*");
												$input6.xval("*");
												$input7.xval("*");
												$input8.xval("*");
												$input9.xval("*");
												$input10.xval("*");
												$input11.xval("*");
												$input12.xval("*");
												//_kindcode _cardunid  gloffset01 address01 userbank01 userbanknum01 _REQCOUNT3 _REQCOUNT2
												
												return false;
											}
										   	if($input.xval() == "C" ){
												// $fn.alert({msg : $fn.getCodeMsg("aprv_sub_225.title.a20")});  
												var date = new Date();
												var vdate= date.getFullYear() + "." + ("0"+(date.getMonth()+1)).slice(-2) + "." + ("0"+date.getDate()).slice(-2);										 
												$input2.xval(" ");
												$input3.xval("0");
												$input3.attr("readonly",false);
												$input4.xval(vdate);
												$input5.xval("*");
												$input6.xval("*");
												$input7.xval("*");
												$input8.xval("*");
												$input9.xval("*");
												$input10.xval("*");
												$input11.xval("*");
												$input12.xval("*");
												//_kindcode _cardunid  gloffset01 address01 userbank01 userbanknum01 _REQCOUNT3 _REQCOUNT2
												
												return false;
											}
											if($input.xval() == "X" ){
												$input3.attr("readonly",true);
												$input4.xval(vdate);
											}  
										});
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
										$cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0106", val) + "</div>");
                                       // $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
	                        }, {  // 일자
                                nm: "hreqcount1",
                                type: "date",
                                vfnm: "_REQCOUNT1",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a4",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='_REQCOUNT1']", $cell);
                                        $input.xval(val);
				
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
									  
									
									
                                }
							},{
                                nm: "hdept",
                                type: "custom",
                                vfnm: "_DEPT_INFO",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a15",
                                drawfn: function (val, $cell, $tr, inst) {
									if (inst.options.isedit) {
                                    var _$idept = $("input[name='_DEPT']", $cell);							        			
                                    var _$ideptinfo = $("input[name='_DEPT_INFO']", $cell);							        			
									
									if (_$idept.xval() == "") {
                                        _$idept.xval("Select");						        		                                    
                                        _$ideptinfo.xval("");						        		                                    
          
                                    } else if (_$ideptinfo.xval() != "" && _$ideptinfo.xval().indexOf("¶") > 0 ) {
									                                    
                                        var _info = _$ideptinfo.xval();
                                        var _info = _info.split("¶");							        		
                                        _$idept.xval(_info[0]+" / "+ _info[1]);
                                    }    
                                    _$idept.off("click").on("click", function(){
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
                                        var _customerDB = _me.PAMT_DB;
                                        //====================================================
                                        //				지불증 부서 정보 선택 보기호출 변경
                                        // 				- 2019.09.05 by 나노브레인
                                        //====================================================

                                        //var _info = _$com_info.xval().split("¶");	
                                        var _form = "w_use_deptcode_1";
                                        //====================================================
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("aprv_sub_225.title.a15"),                                            
                                            width: 800,
                                            height: 720,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_225.lang.js",
                                            content : {
                                                html : "", 
                                        //		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                                url : _customerDB+"/wFrm10PopView?ReadForm&view="+_form
//														, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });    

                                    });
                                } else {
                                    console.log("TESTTTTT:" );

                                    if (typeof val == "undefined") {
                                        return ;
                                    }    
                                    /*
						        	if (val == "") {
						        		$cell.html("<div class='dwp-center'></div>");
						        	} else	if (val.indexOf("¶") > 0 ) {
						        		$cell.html("<div class='dwp-center'>" + $fn.getCurLangMsg(_info[1]) + "</div>");	
						        	} else {
						        		$cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0030", val) + "</div>");
						        	}
                                    */
                                    var _info = val.split("¶");
									console.log(_info)
                                    if (val == "") {
                                        $cell.html("<div class='dwp-center'>&nbsp;</div>");
                                    } else	if (val.indexOf("¶") > 0 ) {
                                        $cell.html("<div class='dwp-center'>" + _info[0]+" / "+_info[1] + "</div>");	 
                                        
                                    }
                                }
                                }
                            },{
                                nm: "hbu",
                                type: "custom",
                                vfnm: "_BUCODE_INFO",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a16",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {

                                    var _$icustomer = $("input[name='_BUCODE']", $cell);							        			
									var _$icustomerinfo = $("input[name='_BUCODE_INFO']", $cell);		
									
									if (_$icustomer.xval() == "") {
                                        _$icustomer.xval("Select");						        		                                    
                                        _$icustomerinfo.xval("");						        		                                    
          
                                    } else if (_$icustomerinfo.xval() != "" && _$icustomerinfo.xval().indexOf("¶") > 0 ) {
                                   
                                        var _info = _$icustomerinfo.xval();
                                        var _info = _info.split("¶");							        		
                                        _$icustomer.xval(_info[0]+" / "+ _info[1]);						        						        			
                                    }
                                    _$icustomer.off("click").on("click", function(){
                                        
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
                                        var _customerDB = _me.PAMT_DB;
                                       
                                        //====================================================
                                        //				지불증 BUCODE 고객사 정보 선택 보기호출 변경
                                        //====================================================

                                        //var _info = _$com_info.xval().split("¶");	
                                        var _form = "w_use_bucode_1";
                                        //====================================================
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("aprv_sub_225.title.a16"),                                            
                                            width: 800,
                                            height: 720,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_225.lang.js",
                                            content : {
                                                html : "", 
                                        //		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                                url : _customerDB+"/wFrm10PopView?ReadForm&view="+_form
//														, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });                                    
                                        
                                    });
                                } else {
                                    if (typeof val == "undefined") return;
										var _info = val.split("¶");							        							        		
										
										if (val == "") {
											$cell.html("<div class='dwp-center'>&nbsp;</div>");
										} else	if (val.indexOf("¶") > 0 ) {
											$cell.html("<div class='dwp-center'>" + _info[0]+" / "+_info[1] + "</div>");	 
											
										}
                                	}
                                }
                            },{ // 경합사 참석 유/무
                                nm: "company",
                                type: "custom",
                                vfnm: "_company",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a5",
                                drawfn: function (val, $cell, $tr, inst) {
								  if (inst.options.isedit) {
                                        var $input = $("select[name='_company']", $cell);
                                        $input.xval(val);
										
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
										$cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0097", val) + "</div>");
                                       // $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{	// 접대 국가
                                nm: "nara",
                                type: "custom",
                                vfnm: "_nara",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a7",
                                drawfn: function (val, $cell, $tr, inst) {
									var sum=0, sum1=0, sum2=0;
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='_nara']", $cell);
                                        $input.xval(val);
									
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");

                                    }
                                }
                            },{ // 접대 목적
                                nm: "hreqcount5",
                                type: "custom",
                                vfnm: "_mokjek",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a8",
                                drawfn: function (val, $cell, $tr, inst) {
									if (inst.options.isedit) {
                                        var $input = $("input[name='_mokjek']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
								}
                            },{	// 접대금액
                                nm: "hreqcount4",
                                type: "custom",
                                vfnm: "_REQCOUNT4",
                                css: "dwp-right",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a5",
                                drawfn: function (val, $cell, $tr, inst) {
									
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='_REQCOUNT4']", $cell);
										//$input.xval(val);
										
										$input.on("keyup", function () {
											var _icount = $input.xval();
											if (_icount == "" ) {
												$input.xval("0");
											} else {
												_icount = _icount.replace(/,/gi, "");
												_icount = _me.numericCheck(_icount, 0);
												_icount = parseFloat(_icount) + "";
												$input.xval(_icount.toComma());
											}
	
											//_me.cal_sum(el);
										});

										$input.bind("blur", function () {

											_me.cal_sum(el, $tr);
											vsum2 = $("#_REQCOUNT4", $tr).val();
											vsum2 = vsum2.replace(/,/gi, "");
											vsum2 = parseInt(vsum2, 10);
											vsum2 = vsum2 + "";
											vsum2 = parseFloat(vsum2) + "";

											$("#_REQCOUNT4", $tr).val(vsum2.toComma());

										});
										
															
									
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    }
                                }
                            },{  //접대객 명단
                                nm: "hreqcount14",
                                type: "custom",
                                vfnm: "_mungdan",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a9",
                                drawfn: function (val, $cell, $tr, inst) {
                                   if (inst.options.isedit) {
                                        var $input = $("input[name='_mungdan']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{ //응대자 명단
                                nm: "hreqcount15",
                                type: "custom",
                                vfnm: "_rmungdan",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a10",
                                drawfn: function (val, $cell, $tr, inst) {
                                   if (inst.options.isedit) {
                                        var $input = $("input[name='_rmungdan']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{ // 김영란법 유/ 무
                                nm: "kimyoungran",
                                type: "custom",
                                vfnm: "_kimyoungran",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a11",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("select[name='_kimyoungran']", $cell);
                                        $input.xval(val);
										
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
										$cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0097", val) + "</div>");
                                       // $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{ //접대장소
                                nm: "jangso",
                                type: "custom",
                                vfnm: "_jangso",
                                css: "dwp-center",
								validator: /[^\s]/,
                                label: "aprv_sub_225.title.a6",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='_jangso']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{
                                nm: "kindcode",
                                type: "custom",
                                vfnm: "_kindcode",
                                css: "dwp-center",								
                                label: "aprv_sub_225.title.a16",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='_kindcode']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{
                                nm: "cardunid",
                                type: "custom",
                                vfnm: "_cardunid",
                                css: "dwp-center",								
                                label: "aprv_sub_225.title.a16",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='_cardunid']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{
                                nm: "hgloffset01",
                                type: "custom",
                                vfnm: "gloffset01",
                                css: "dwp-center",								
                                label: "aprv_sub_224.title.a16",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='gloffset01']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{
                                nm: "haddress01",
                                type: "custom",
                                vfnm: "address01",
                                css: "dwp-center",								
                                label: "aprv_sub_224.title.a16",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='address01']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{
                                nm: "huserbank01",
                                type: "custom",
                                vfnm: "userbank01",
                                css: "dwp-center",								
                                label: "aprv_sub_224.title.a16",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='userbank01']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{
                                nm: "huserbanknum01",
                                type: "custom",
                                vfnm: "userbanknum01",
                                css: "dwp-center",								
                                label: "aprv_sub_224.title.a16",
                                drawfn: function (val, $cell, $tr, inst) {
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='userbanknum01']", $cell);
                                        $input.xval(val);
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-center'>" + val + "</div>");
                                    }
                                }
                            },{
                                nm: "hreqcount2",
                                type: "custom",
                                vfnm: "_REQCOUNT2",
                                css: "dwp-center",								
                                label: "aprv_sub_224.title.a5",
                                drawfn: function (val, $cell, $tr, inst) {
										//alert("@@@")
									var _tmp1=0, _tmp2=0;
									var sum=0, sum1=0, sum2=0;
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='_REQCOUNT2']", $cell);
                                        $input.xval(val);
											var _tmp1=0, _tmp2=0;
											var vsum=0, vsum1=0, vsum2=0;
								
																		
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-right'>" + val + "</div>");
                                    }
                                }
                            },{
                                nm: "hreqcount3",
                                type: "custom",
                                vfnm: "_REQCOUNT3",
                                css: "dwp-center",								
                                label: "aprv_sub_224.title.a6",
                                drawfn: function (val, $cell, $tr, inst) {
									var sum=0, sum1=0, sum2=0;
                                    if (inst.options.isedit) {
                                        var $input = $("input[name='_REQCOUNT3']", $cell);
                                        $input.xval(val);
									
                                    } else {
                                        if (typeof val == "undefined")
                                            return;
                                        $cell.html("<div class='dwp-right'>" + val + "</div>");

                                    }
                                }
                            }
                        ]
                    });
				
                //하나의 row는 무조건 생성
                if (_opt.isnew) {
                    _$table.add();
					//_$table.add();
					//_$table.add();
					//_$table.add();
					//_$table.add();
					//_$table.add();
					//_$table.add();
                }
                return _$table;
			}
			
			// 부서예산코드/제품 일괄등록
            , all_set_Field: function (el , fd1 , fd2) {                                
                var _me = _$$.aprv_sub225.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
                var _$input_trs = $("tr", _$input_tbl);
                //var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
                //var _$input_trs = $("tr", _$input_tbl);
                //var _$isupply = $("input[name='_UNITCOST']", _$input_trs);
				var _$_FD1 = $("input[name='"+ fd1 +"']", _$input_trs);
				var _$_FD1_INFO = $("input[name='"+fd2+"']", _$input_trs);
				//var _$PRICE = $("input[name='_PRICE']", _$input_trs);				
				var _sum33="";				
				$.each(_$_FD1, function (idx, o1) {
				     var _o1 = $(o1).xval();

				     //console.log(idx)
				    // console.log(o1)
				     if (idx == 1) {
				         _sum33 = _o1
				     }
				     $(o1).xval(_sum33);
				});				
				$.each(_$_FD1_INFO, function (idx, o1) {
				     var _o1 = $(o1).xval();

				     //console.log(idx)
				     console.log(_o1)
				     if (idx == 1) {
				         _sum33 = _o1
				     }
				     $(o1).xval(_sum33);
				});
				//_sum33=_sum33.split("☆")
			}
			
			, cal_sum: function (el,tr) {
                var _me = _$$.aprv_sub225.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                var _supply_sum = 0;
                var _total_sum = 0;
				
				
				//alert($("#_REQCOUNT4", tr).val())
				
				//alert($("#_REQCOUNT4").val())
				//alert($("input[name='_REQCOUNT4']", el).xval())
				var _$isupply = $("#_REQCOUNT4", _$input_trs);
				var _sum = 0;
				$.each(_$isupply, function(idx, o){
					var _val=0;
					//$(o).val().replace(/,/gi, "")
					var _o = $(o).xval().replace(/,/gi, "");
					if( $.isNumeric(_o) ){
						//alert(_val)
						//_val = $(o).val().replace(/,/gi, "");
						//alert(_val)
						_val = parseInt(_o, 10);
						_sum += _val;
					}
				});
				_sum = _sum+ "";
              			
                _sum = _sum.toComma();
				 
				 $("input[name='ed_total']", el).xval(_sum);

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
        	,
            save: function ($doc, opt) {
                var _me = _$$.aprv_sub225.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({
                        actiontype: ""
                    }, opt);

				 if ($("#ed_val_1").val() == "") {
         			$fn.alert({msg : $fn.getCodeMsg("aprv_sub_225.msg.a1")});   //사용부서
         			return false;
         		}
				if ($("#ed_val_2").val() == "") {
         			$fn.alert({msg : $fn.getCodeMsg("aprv_sub_225.msg.a2")});   //사용자
         			return false;
         		}

                var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element).xtable("instance");

                //****************************************************//
                //			결재 진행중인 문서는 지출결의서 항목 부분에 대해서는 수정 불가
                //				 - 2017.11.20 by dwlee
                //****************************************************//
                //if (_opt.docstatus != "draft") {
                //    return true;
                //}

                //****************************************************//
                //				임시저장인 경우  Validate 체크를 제외
                //				 - 2017.11.20 by dwlee
                //****************************************************//
                if (_aopt.actiontype == "draft") {
                    $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
                    return true;
                }

                var _isvalid = true;
                if (!_$table.validate()) {
                    return false;
                }

                $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
				
				//제목에 지불증 사업장 정보를 반영해서 제목 생성
                if (_aopt.actiontype == "raise") {
                	var _val_loc = $("[name=WorkArea_1]", $doc.element).val();
                	var origSubject = $("[name=Subject]", $doc.element).val();

                	if( origSubject.indexOf("E1]:") > 0 || origSubject.indexOf("C1]:") > 0 || origSubject.indexOf("S1];") > 0 ) {							
						origSubject = origSubject.substring( 5, origSubject.length );
						$("[name=Subject]", $doc.element).val( "["+_val_loc+"]:"+ origSubject );	
                	} else {
						$("[name=Subject]", $doc.element).val( "["+_val_loc+"]:"+ $("[name=Subject]", $doc.element).val() );	
                	}
					// 결재요청시 필드의 값을 체크함
					// Orig 값이 없으면 각 금액을 5만 넘었을때 요청불가능하게 

					// 2022 3 31 : 결재요청시 Urgency1 필드가 체크 되어 있으면 금액을 무시하고 진행

					var orignaldoc_id = $("[name=Orig_Form106Key]", $doc.element).val();

					var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element);
					var _$input_trs = $("tr", _$input_tbl);
					var _$_FD1 = $("input[name='_REQCOUNT4']", _$input_trs);

					//var _$PRICE = $("input[name='_PRICE']", _$input_trs);				
					//alert( $("input[name='Urgency1']" , $doc.element).is(":checked") );
					if ( $("input[name='Urgency1']" , $doc.element).is(":checked") == false ) { 	//// 2022 3 31 : 결재요청시 Urgency1 필드가 체크 되어 있으면 금액을 무시하고 진행
						if ( orignaldoc_id == "" ) {
							$.each(_$_FD1, function (idx, o) {
								var _o = $(o).xval().replace(/,/gi, "");
		
								if( $.isNumeric(_o) ){
									_val = parseFloat(_o);
									
									if (_val >= 50000) {
										//$fn.alert({ msg:"접대비 사전신청서를 미작성시 건당 50,000을 초과 할 수없습니다." });
										$fn.alert({ msg: $fn.getCodeMsg('aprv_sub_225.msg.a2') });
										_isvalid = false;
										return _isvalid;
									}
								}
		
							});				
						}
					} else {
						//긴급 사유 기재 내용을 확인후 공백이면 에러
						if ( $("[name=em_reason]", $doc.element).val() == "" ) {
							$fn.alert({ msg: $fn.getCodeMsg('aprv_sub_225.msg.a3') });
							_isvalid = false;
							return _isvalid;
						}

					}
				}	

                console.log("225 save : ", _isvalid);
                return _isvalid;
            }
        }
    }
}
($dwp.cns("app"), jQuery));


















