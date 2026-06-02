/* Source File Upload Time : 2021-06-29 8:11:42 AM*/


/* Source File Upload Time : 2021-04-28 3:15:50 PM*/


/* Source File Upload Time : 1-4-21 11:17:24 PM*/


/* Source File Upload Time : 12-16-20 2:36:12 PM*/


/* Source File Upload Time : 11-27-20 2:16:37 PM*/


/* Source File Upload Time : 7-31-20 5:15:33 PM*/


/* Source File Upload Time : 7-9-20 11:06:05 AM*/


/* Source File Upload Time : 7-8-20 5:15:15 PM*/


/* Source File Upload Time : 5-14-20 2:09:20 PM*/


/* Source File Upload Time : 4-20-20 1:07:12 PM*/


/* Source File Upload Time : 3-18-20 5:43:40 PM*/


/* Source File Upload Time : 2-10-20 3:07:18 PM*/


/* Source File Upload Time : 2019-12-17 11:52:41 AM*/


/* Source File Upload Time : 2019-07-22 12:32:22 AM*/


/* Source File Upload Time : 2019-07-22 12:13:10 AM*/


/* Source File Upload Time : 2019-07-22 12:03:01 AM*/


/* Source File Upload Time : 2019-07-19 12:08:19 PM*/


/* Source File Upload Time : 2019-07-18 6:39:30 PM*/


/* Source File Upload Time : 2019-07-13 1:16:28 AM*/


/* Source File Upload Time : 2019-07-05 3:34:46 PM*/

/**
 * 전자결재 보조양식 - 출고전표
 * $dwp.app.aprv_sub138
 */

//양식설계 function 시작

(function (_$$, $) {
    _$$.aprv_sub138 = {
        subdoc: {
            SUBNAME: "sub138",
            PAMT_DB                              : "/dwp/com/work/purchase_aprv_master.nsf",									//구매승인 관리 DB
            PAMT_LOG_DB                          : "/dwp/com/work/purchase_aprv_master.nsf",									//구매승인 관리 로그 DB
            init: function ($doc) {
                var _me = _$$.aprv_sub138.subdoc;
                var opt = $doc.options;
                var el = $doc.element;
                
                var _isedit = opt.isedit;		
                //결재 중간에 편집시에는 구매승인요청서 영역 편집 불가
                if (opt.isedit == true && opt.docstatus != "draft") {
                    _isedit = false;
                }			
                var _opt = $.extend({}, opt , {isedittable : _isedit});
                      
			
                //console.log('S::언어' + $fn.getCurLangMsg(_author_disp_lang));
                console.log("user info::", $fn.getCurUser());

                //새문서일 경우
                if (opt.isnew) {
                   // $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko"));
                }

                //거래명세표
                $("#_pop2", el).on("click", function () {
                    var _form = "wMeetingView";
                    var _rptDailog = $fn.dialog(null, {
                            modal: true,
                            resizable: false,
                            draggable: true,
                            islangconvert: false,
                            referdata: el,
                            title: $fn.getCodeMsg("aprv_sub_138.title.a48"),
                            width: 1100,
                            height: 700,
                            show: 'fade', //effect
                            hide: 'fade', //effect
                            langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_138.lang.js",
                            buttons: [],
                            content: {
                                html: "",
                                //url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                url: "/dwp/com/work/purchase_aprv_master.nsf" + "/wFrmPopView3?ReadForm"

                            },
                            close: function () { //2017.01.19

                            },
                            //,content : {html : ""}
                            buttons: [{
                                    title: $fn.getCodeMsg('comm.btn.confirm'),
                                    click: function (_$dialog) {
                                        var element = _$dialog.element.view('instance');
                                        //필드 선언
                                        var _DocKey = "";

                                        var sum_count = 0;
                                        var _rows = element.getChecked();
                                        if (_rows.length > 1) {
                                            $fn.alert({
                                                msg: $fn.getCodeMsg("aprv_sub_138.title.a49")
                                            }); //사유
                                            return false;

                                        }
                                        $.each(element.getChecked(), function (i, o) {
                                            //팝업에서 선택한 정보 문자열로 만들기
                                            _DocKey += o._DocKey + ",";

                                            sum_count = sum_count + 1;
                                            ////TmpCashCard+="2";

                                        });
										//$("input[name=fld_formdata_1]", $doc.element).val("1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ††110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ;")
										 
										//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ††110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ

                                        var _unids = _DocKey.slice(0, -1); //맨뒤 , 자름 거래처명
								
									//alert(_unids)
							
									$fn.cmdPost(
									$dwp.core.util.getProxyUrl('/dwp/com/work/purchase_aprv_master.nsf/wcmdrefresh?createdocument')
									,{actiontype : ('refresh_trade'), dbpath : '/dwp/com/work/purchase_aprv_master.nsf' , postdata : _unids }									
									,function(data){
											
										//alert(data.result)
										// "result":"200","re_cd":"del_temp","cnt":"2"
										if (data.hasOwnProperty("result")) {
										    if (data.result =="200"){
										        //alert(data)
												//alert(data.formdata_1)
												var _doc = el.doc("instance");
											var _opt = _doc.options;	
											
											var _$table = $("table[name="+_me.SUBNAME+"_Table01]", el);
											var _$trs = $("tbody>tr",_$table);
											if (_$trs.size() > 0) {
												$.each(_$trs, function (index, tr) {
													//alert(_$trs.size())
													var _$tr = $(this);
													//alert(_$tr.is("name"))
													//alert(_$tr.attr("name"))
													if ( _$tr.attr("name") != "_template" && _$tr.attr("name") != "" && _$tr.attr("name") != "_ROW_TOTAL") {
														_$tr.remove();
													}
												});
											}
											
											
											
											var _data=data.formdata_1
											
											var subject1=data.subject1
										$("[name=Subject]", $doc.element).val(subject1);
											
											
											
											var arr=_data.split("†")
											var arr=arr[16].split("¶");	
											
											var trade = data.formdata;
											var master = data.formdata_1;

											    //alert(trade);
											    //alert(master);

											trade = trade.split("†");
											
											
											var isyn=master.indexOf(";");
											for (i = 0; i < trade.length; i++) {
												    var vvunid1 = trade[5]
												}
												
											var deptcode1 = "";
											var outdeptcode="";
											var youngdo = "";	
											//alert(master.indexOf(";"))										
										if( master.indexOf(";") > 0){
												//alert(vvunid1)
                                                master = master.split(";");
												for (j = 0; j < master.length; j++) {
												    //alert(vvunid1+" "+vvunid2)
												    master1 = master[j].split("†");
												    for (k = 0; k < master1.length; k++) {
												        // alert(master1[5])
												        if (vvunid1 == master1[5]) {
												            deptcode1 = master1[16]
															//outdeptcode=outdeptcode++master1[16]
												                youndo = master1[21]
												        }
												    }

												}												
												var arr = deptcode1.split("¶");
												
													}else{
														var master = data.formdata_1
												    //alert(vvunid1+" "+vvunid2)
												    master1 = master.split("†");
												    for (k = 0; k < master1.length; k++) {
												        // alert(master1[5])
												        if (vvunid1 == master1[5]) {
												            deptcode1 = master1[16]
												                youndo = master1[21]
																outdeptcode=master1[16]
												        }
												    }
											
												var arr = deptcode1.split("¶");												
												
												
											}
											var trade2 = data.formdata;
											var master2 = data.formdata_1;
                                            var cnt="";  
                                            var tradecnt="";
                                             //마스터 출고부서코드 정보
                                            if( master2.indexOf(";") > 0){
                                                var master2=master2.split(";");                                               
                                             for (var k2 = 0; k2 < master2.length; k2++) {
                                                 var master3=master2[k2].split("†")
                                                  cnt=cnt+"^"+master3[5]+"★"+master3[16]
                                               
                                            }
                                             
                                            }else{
                                                   var master2=master2.split("†");
                                                 for (var k2 = 0; k2 < master2.length; k2++) {
                                                 
                                                  cnt=cnt+"^"+master2[5]+"★"+master2[16]
                                               
                                                 }

                                            }

                                            //거래명세표 출고부서코드 정보
                                             if( trade2.indexOf(";") > 0){
                                                var trade2=trade2.split(";");                                               
                                             for (var k2 = 0; k2 < trade2.length; k2++) {
                                                 var trade3=trade2[k2].split("†")
                                                  tradecnt=tradecnt+"^"+trade3[5]
                                               
                                            }
                                             
                                            }else{
                                                   var trade2=trade2.split("†");
                                                 for (var k2 = 0; k2 < trade2.length; k2++) {
                                                 
                                                  tradecnt=tradecnt+"^"+trade2[5]
                                               
                                                 }

                                            }
											
											 cnt=cnt.split("^");
                                            tradecnt=tradecnt.split("^");
                                            var outdeptcode="";

                                            for (var k4 = 0; k4 < cnt.length; k4++) {
                                                for (var k5 = 0; k5 < tradecnt.length; k5++) {
                                                    if(tradecnt[k5] !="" || cnt[k4] != ""){
                                                        var cnt1=cnt[k4].split("★");
                                                       if(cnt1[0]==tradecnt[k5]){
                                                            outdeptcode=outdeptcode+"★"+cnt1[1]
                                                       }
                                                       // alert(tradecnt[k5])
                                                    }
                                                    
                                                }
                                               


                                                
                                            }
                                            var rsarr = new Array();
											outdeptcode=outdeptcode.split("★");
											 for (var k6 = 0; k6 < outdeptcode.length; k6++) {
											     if(outdeptcode[k6] !=""){
                                                    var voutcode=outdeptcode[k6].split("¶");
                                                    rsarr.push(voutcode[1].replace(/ /gi, "")+"_"+voutcode[2].replace(/ /gi, ""))
                                                    //alert(voutcode[1]+"_"+voutcode[2])
											     }
											 }

											 //종복제거
                                              var uniqueNames = [];
                                              var resultval="";
                                            $.each(rsarr, function(i, el){
                                                 if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                                            });
                                               for (var k7 = 0; k7 < uniqueNames.length; k7++) {
                                                   if(k7==0){
                                                     resultval=uniqueNames[k7]
                                                   }else{
                                                       resultval=resultval+","+uniqueNames[k7]
                                                   }
                                               }
											//alert(outdeptcode)
											//arr[1]+"_"+arr[2]
											$("input[name=ed_ReqInfo_6_2]", $doc.element).val(data.fromdate)
											$("[name=ed_ReqInfo_2]", $doc.element).val(youndo)
											$("input[name=ed_ReqInfo_6_4]", $doc.element).val(resultval)
											$("input[name=ed_ReqInfo_4]", $doc.element).val(data.account)
											$("input[name=ed_ReqInfo_6_5]", $doc.element).val(data.aname)
											
											$("input[name=ed_ReqInfo_1]", $doc.element).val(data.ORNO)
											$("input[name=ed_ReqInfo_3]", $doc.element).val(data.BLNO)
											$("input[name=ed_ReqInfo_7]", $doc.element).val(data.KRW)
											//alert(data.formdata_1)
											$("input[name=total_sum]", $doc.element).val(data.total_sum)
											$("input[name=docid]", $doc.element).val(data.docid)
											$("input[name=fld_formdata_1]", $doc.element).val(data.formdata_1)
											$("input[name=popunid]", $doc.element).val(data.popunid)
											$("input[name=ed_ReqInfo_6]", $doc.element).val(data.jangpyonum)
											
											//fld_formdata_1
										        var _$table = _me.initBudgetDspTable(_opt, $doc, "",data.formdata);
										        var _newopt = $.extend({}, _opt, {
										                dtable: _$table
										            });
										        $doc.options = _newopt;
												var vkrew
												if(data.money == "￦"){
													vkrew="01"
												}else if(data.money == "￥"){
													vkrew="02"
												}else if(data.money == "＄"){
													vkrew="03"
												}else if(data.money == "RMB"){
													vkrew="04"
												}else if(data.money == "EUR"){
													vkrew="05"
												}
												//data.money _moneykind_Nm
											$("[name=_moneykind]", $doc.element).val(vkrew).attr("selected", "selected");
											var krwnm="ko:"+data.money+",jp:"+data.money
											
											$("[name=_moneykind_Nm]", $doc.element).val(krwnm);
												//view.reload({page : 1});
												
												//$fn.toast({msg : $fn.getCodeMsg("kr_complete.title.a14") });
											} else {
												//error
											}
										} else {
											//error
										}
										//_me.refresh();
									}
									, 'json'
								);
										
									/*
										// var _opt1 = _me._initOptions(opt);
                                        var _url = "";
                                        var _form = "";
                                        _form = "Form138"

                                            _url = "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?openform";
                                        _url += "&FormCode=" + _form;
										//alert(_opt1.cdb)
                                        _url += "&org_dbpath=" + "/dwp/com/work/purchase_aprv_master.nsf";
									//	  _url += "&org_dbpath=" + _opt1.cdb;
										
                                         //_url += "&org_dbpath=" + _opt1.cdb;
										//_url += "&org_docid=" + _opt1.unid;
										
										_url += "&org_docid=" + _unids;
                                        $fn.loadPage({
                                            link: _url,
                                            linktype: "PAGE"
                                        });
									*/
                                        _$dialog.close();
                                    }
                                }, {
                                    title: $fn.getCodeMsg('comm.btn.cancel'),
                                    click: function (_$dialog) {
                                        _$dialog.close();
                                    }
                                }
                            ]

                        });
                }); //거래명세표 끝
             
				
				
                	var _$table = _me.initInputTable(_opt, $doc, "");
					//var _$table = _me.initBudgetDspTable(_opt, $doc, "");
					
                var _newopt = $.extend({}, _opt, { dtable: _$table });
                $doc.options = _newopt;   					  
                console.log('S::출고전표');

                
                

                console.log('E::출고전표');
            }   
			
            //지출결의서 비용관련 예산 표시 테이블 - 초기화
            , initInputTable: function (_opt, $doc) {
                var _me = _$$.aprv_sub138.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata]", $doc.element).val();

                var _$table = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table01']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal
                    , template: "[name=_template]"
                    , keyfield: ["_USER"]
                    , changeafter: function (act) {
                        if (act == "del") {
                            _me.cal_sum(el);										//삭제시 합계 재계산
                            //_me.cal_sum_new(el);										//삭제시 합계 재계산
                            //_me.cal_sum_1(el);										//삭제시 합계 재계산
                            //_me.cal_sum_new1(el);										//삭제시 합계 재계산
                        } else if (act == "add") {
                            //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                        } else if (act == "copy") {
                             _me.cal_sum(el); 									//행 복사시 합계 재계산
                             //_me.cal_sum_new(el);										//삭제시 합계 재계산
                             //_me.cal_sum_1(el);										//삭제시 합계 재계산
                             //_me.cal_sum_new1(el);										//삭제시 합계 재계산
 
                        }
                    }
                    , cell: [
					 {
                            nm: "q1", type: "custom", vfnm: "_qnum", validator: /[^\s]/, label: "aprv_sub_138.title.a7"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_qnum']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },						
						 {
                            nm: "flag1", type: "custom", vfnm: "_flag1",  label: "완료일"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag2", type: "custom", vfnm: "_flag2",  label: "지불방법"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag2']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag3", type: "custom", vfnm: "_flag3",  label: "발주서"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag3']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag4", type: "custom", vfnm: "_flag4",  label: "거래명세표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag4']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag5", type: "custom", vfnm: "_flag5",  label: "출고전표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag5']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag6", type: "custom", vfnm: "_flag6",  label: "출고전표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag6']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpname", type: "custom", vfnm: "_PNAME", validator: /[^\s]/, label: "aprv_sub_138.title.a7"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PNAME']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpnum", type: "custom", vfnm: "_PNUM", validator: /[^\s]/, label: "aprv_sub_138.title.a13"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PNUM']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hptype", type: "custom", vfnm: "_PTYPE", validator: /[^\s]/, label: "aprv_sub_138.title.a8"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PTYPE']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        }
                        ,
                        {
                            nm: "hprein", type: "custom", vfnm: "_PREIN", validator: /[^\s]/, label: "aprv_sub_138.title.a21"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='_PREIN']", $cell);
                                    _$type.xval(val);
                                    /*
                                    _$type.on("change", function () {
        
                                        var _selectedval = $("select[name='_PREIN']",$cell).find("option:selected").xval();
                                        var _selectedtxt = $("select[name='_PREIN']",$cell).find("option:selected").text();

                                        //var _text = $("input[name='_acccodeName']", $doc.element).find("option:selected").text();
                                        //var _accname = $("#acccode option:selected").val();
                                        //1 :  일반
                                        //2 : 선입고
                                        if (_selectedval == "1") {
                                            //console.log(_selectedtxt);
                                            
                                        } else {
                                            //console.log(_selectedtxt);
                                            var _$type = $("input[name='_PDATE']", $tr);
                                            _$type.xval("");
                                        }
                                        
                                        //var _icount = _$input.xval();
                                        //_icount = _icount.replace(/,/gi, "");
                                        //_icount = _me.numericCheck(_icount, 0);

                                        //_icount = parseFloat(_icount) + "";
                                        //_$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                        
                                    });
                                    */
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0011.GP0008", val) + "</div>");
                                    
                                }
                            }
                        },                      

                        {
                            nm: "hamount", type: "custom", vfnm: "_AMOUNT", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_138.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='_AMOUNT']", $cell);
                                    _$input.xval(val);
                                    _$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        

                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                    });
                                    _$input.on("blur", function(){

                                        var _$ia = $("input[name='_AMOUNT']", $cell).val();;
                                        var _$iup = $("input[name='_UNITCOST']", $tr).val();;

                                        var _ia = _$ia.replace(/,/gi, "");
                                        var _iup = _$iup.replace(/,/gi, "");
                                        _ia = _me.numericCheck(_ia, 0);
                                        _iup = _me.numericCheck(_iup, 0);
                                        
                                        _ia = parseFloat(_ia) + "";
                                        _iup = parseFloat(_iup) + "";

                                        var _rowsum = _ia * _iup;
                                        _rowsum = parseFloat(_rowsum) + "";
                                        _rowsum = _rowsum.toComma();

                                        $("input[name='_PRICE']", $tr).val(_rowsum);

                                        _me.cal_sum(el,$tr);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },                                   
                        {
                            nm: "hunitcost", type: "custom", vfnm: "_UNITCOST", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_138.title.22"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_UNITCOST']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='_UNITCOST']", $cell);
                                    _$input.xval(val);
                                    _$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);

                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                    });
                                    _$input.on("blur", function(){

                                        var _$ia = $("input[name='_AMOUNT']", $tr).val();;
                                        var _$iup = $("input[name='_UNITCOST']", $cell).val();;

                                        var _ia = _$ia.replace(/,/gi, "");
                                        var _iup = _$iup.replace(/,/gi, "");
                                        _ia = _me.numericCheck(_ia, 0);
                                        _iup = _me.numericCheck(_iup, 0);
                                        
                                        _ia = parseFloat(_ia) + "";
                                        _iup = parseFloat(_iup) + "";

                                        var _rowsum = _ia * _iup;
                                        _rowsum = parseFloat(_rowsum) + "";
                                        _rowsum = _rowsum.toComma();

                                        $("input[name='_PRICE']", $tr).val(_rowsum);

 
                                        
                                        _me.cal_sum(el,$tr);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        }, 
                            
                     
                        {
                            nm: "hprice", type: "custom", vfnm: "_PRICE", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_138.title.a12"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PRICE']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },
                        
                        {
                            nm: "hetc", type: "custom", vfnm: "_ETC", validator: /[^\s]/, label: "aprv_sub_138.title.a17"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_ETC']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },   
                    ]
                });

                //하나의 row는 무조건 생성
                if (_opt.isnew) {
                  //  _$table.add();
                }
                return _$table;
            } 

            //입력된 값으로 합계 구하는 함수
            , cal_sum: function (el , tr) {                                
                var _me = _$$.aprv_sub138.subdoc;
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
                var _$input_trs = $("tr", _$input_tbl);
                //var _supply_sum = 0;
                //var _total_sum = 0;
				//alert($("#_REQCOUNT4", tr).val())
				//alert($("#_REQCOUNT4").val())
                //alert($("input[name='_REQCOUNT4']", el).xval())
                
				var _$isupply = $("input[name='_PRICE']", _$input_trs);
				var _sum = 0;
				$.each(_$isupply, function(idx, o){
					var _val=0;
                    var _o = $(o).xval().replace(/,/gi, "");
					if( $.isNumeric(_o) ){
                        //console.log(_o);
                        _val = parseFloat(_o);
                        _sum += _val;
					}
                });
                _sum = _sum+ "";
                _sum = _sum.toComma();

                $("input[name='total_sum']", el).xval(_sum);

                //네고율계산
                //_me.cal_nego(el);

            }          

//지출결의서 비용관련 예산 표시 테이블 - 초기화				
				, initBudgetDspTable : function (_opt,$doc,initval,formdata_1) {					
					 var _me = _$$.aprv_sub138.subdoc;		
					var el = $doc.elelment;
					// 1†하모닉드라이브†-†CSF-14-30-2XH-F††0†EA†2†855,000††††855,000†††††609-85-30045¶삼익THK††††OCV ASS'Y조립2호기수리†††††
					//var _formdata = $("input[name=fld_formdata_11]", $doc.element).val();						
					//var _formdata = (initval== "") ? $("input[name=fld_formdata_1]", $doc.element).val():initval;	
					var _formdata = formdata_1
					//alert(_formdata)
					var _dataobj = $.extend({}, _dataobj);					
					var _darray = _formdata.split(";");
					$.each(_darray, function(aindex, celldata) {
						var _tmpArray = celldata.split("†");							
						var _key = _tmpArray[0];
						
						if (_key != "") {
							//==================================================
							//			잔여금액 =예산금액-기발의 금액- 현재발의 금액	
							//				- 2017.12.05 by dwlee
							//==================================================
							//var _tmp1 = _tmpArray[3];
							//_tmp1 = _tmp1.replace(/,/gi,"");						
							//var _tmp2 = _tmpArray[4];
							//_tmp2 = _tmp2.replace(/,/gi,"");						
							//var _tmp3 = _tmpArray[5];
							//_tmp3 = _tmp3.replace(/,/gi,"");						
							//var _tmp4 = parseFloat(_tmp1)-parseFloat(_tmp2)-parseFloat(_tmp3);
							//_tmp4 += "";						
							//_tmpArray[6] = _tmp4.toComma();
							_tmpArray.splice(10, 0, ",")
							_tmpArray.join("†");
                            	//alert(_tmpArray.join("†"))
                            //	_tmpArray.splice(10, 0, "†")
							   _tmpArray.splice(12, 1);
							_tmpArray.splice(12, 1);
                           _tmpArray.splice(12, 1);
                             _tmpArray.splice(15, 1);
                               _tmpArray.splice(14, 1);
							//==================================================
							
							//같은 순번이 없으면 따로 표시
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							var _rList = {};
							//3†††††2††품명†품번†솏†220††1†2†4440†976,800†용도†비고†규격
							
							//1†††††0††품명†품번†ea††120†2,222†266,640†규격
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†,†110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†,†110†2†3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							//3†††††2††ㅎㄷㄱㅎ†ㄱㅎㄷㄱ†솏†,†220†4440†976,800††ㄷㄱㅎㄷㅎㄷ
							
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†††3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†††110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							
							
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†††110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110†3,330†366,300†ㄱㅎㄷㅎㄷㅎ
							
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110†1†3,330†††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ††2†366,300†††ㄱㅎㄷㅎㄷㅎ
							
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110†1†3,330†††ㄱㅎㄷㅎㄷㅎ
							
							
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110†1†3,330††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††2†366,300††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††2†366,300††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†††110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							
							//1†††††0††ㄱㅎ†ㄱㅎ†††ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							//1†††††0††ㄱㅎ†ㄱㅎ†ㅗㅗ†110††1†2†3,330†366,300†††ㄱㅎㄷㅎㄷㅎ
							//2017.12.05 by dwlee
							//_rList[aindex] = celldata;	
										
							_rList[aindex] = _tmpArray.join("†");
							
							_dataobj = $.extend(_dataobj, _rList);
						}
					});										
					var _fldarray = [];
					$.each(_dataobj,function(dindex, obj) {
						_fldarray.push(obj);
					});					
								//alert(_fldarray.join(";"))		
					var _$table = $dwp.ui.table.init($("table[name='"+_me.SUBNAME+"_Table01']", $doc.element), {
						isedit : _opt.isedittable
//						,initdata : $("input[name=fld_formdata_11]", $doc.element).val()						
						,initdata : _fldarray.join(";")					
						,template : "[name=_template]"
						,keyfield : ""
						,changeafter : function (act,tr,inst) {							
							if (inst.options.isedit) {
								//_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.		
								
								//2017.12.14 by dwlee
								if (inst.options.isinit == false) {
									//_me.cal_sum($doc.element);								//합계 자동계산
								}
							}
						}					
						 , cell: [
					 {
                            nm: "q1", type: "custom", vfnm: "_qnum", validator: /[^\s]/, label: "aprv_sub_138.title.a7"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_qnum']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },						
						 {
                            nm: "flag1", type: "custom", vfnm: "_flag1",  label: "완료일"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag2", type: "custom", vfnm: "_flag2",  label: "지불방법"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag2']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag3", type: "custom", vfnm: "_flag3",  label: "발주서"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag3']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag4", type: "custom", vfnm: "_flag4",  label: "거래명세표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag4']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag5", type: "custom", vfnm: "_flag5",  label: "출고전표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag5']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag6", type: "custom", vfnm: "_flag6",  label: "출고전표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag6']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpname", type: "custom", vfnm: "_PNAME", validator: /[^\s]/, label: "aprv_sub_138.title.a7"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PNAME']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpnum", type: "custom", vfnm: "_PNUM", validator: /[^\s]/, label: "aprv_sub_138.title.a13"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PNUM']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hptype", type: "custom", vfnm: "_PTYPE", validator: /[^\s]/, label: "aprv_sub_138.title.a8"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PTYPE']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        }
                        ,
                        {
                            nm: "hprein", type: "custom", vfnm: "_PREIN", validator: /[^\s]/, label: "aprv_sub_138.title.a21"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='_PREIN']", $cell);
                                    _$type.xval(val);
                                    /*
                                    _$type.on("change", function () {
        
                                        var _selectedval = $("select[name='_PREIN']",$cell).find("option:selected").xval();
                                        var _selectedtxt = $("select[name='_PREIN']",$cell).find("option:selected").text();

                                        //var _text = $("input[name='_acccodeName']", $doc.element).find("option:selected").text();
                                        //var _accname = $("#acccode option:selected").val();
                                        //1 :  일반
                                        //2 : 선입고
                                        if (_selectedval == "1") {
                                            //console.log(_selectedtxt);
                                            
                                        } else {
                                            //console.log(_selectedtxt);
                                            var _$type = $("input[name='_PDATE']", $tr);
                                            _$type.xval("");
                                        }
                                        
                                        //var _icount = _$input.xval();
                                        //_icount = _icount.replace(/,/gi, "");
                                        //_icount = _me.numericCheck(_icount, 0);

                                        //_icount = parseFloat(_icount) + "";
                                        //_$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                        
                                    });
                                    */
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0011.GP0008", val) + "</div>");
                                    
                                }
                            }
                        },                      

                        {
                            nm: "hamount", type: "custom", vfnm: "_AMOUNT", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_138.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='_AMOUNT']", $cell);
                                    _$input.xval(val);
                                    _$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        

                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                    });
                                    _$input.on("blur", function(){

                                        var _$ia = $("input[name='_AMOUNT']", $cell).val();;
                                        var _$iup = $("input[name='_UNITCOST']", $tr).val();;

                                        var _ia = _$ia.replace(/,/gi, "");
                                        var _iup = _$iup.replace(/,/gi, "");
                                        _ia = _me.numericCheck(_ia, 0);
                                        _iup = _me.numericCheck(_iup, 0);
                                        
                                        _ia = parseFloat(_ia) + "";
                                        _iup = parseFloat(_iup) + "";

                                        var _rowsum = _ia * _iup;
                                        _rowsum = parseFloat(_rowsum) + "";
                                        _rowsum = _rowsum.toComma();

                                        $("input[name='_PRICE']", $tr).val(_rowsum);

                                        _me.cal_sum(el,$tr);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },                                   
                        {
                            nm: "hunitcost", type: "custom", vfnm: "_UNITCOST", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_138.title.22"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_UNITCOST']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='_UNITCOST']", $cell);
                                    _$input.xval(val);
                                    _$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);

                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                    });
                                    _$input.on("blur", function(){

                                        var _$ia = $("input[name='_AMOUNT']", $tr).val();;
                                        var _$iup = $("input[name='_UNITCOST']", $cell).val();;

                                        var _ia = _$ia.replace(/,/gi, "");
                                        var _iup = _$iup.replace(/,/gi, "");
                                        _ia = _me.numericCheck(_ia, 0);
                                        _iup = _me.numericCheck(_iup, 0);
                                        
                                        _ia = parseFloat(_ia) + "";
                                        _iup = parseFloat(_iup) + "";

                                        var _rowsum = _ia * _iup;
                                        _rowsum = parseFloat(_rowsum) + "";
                                        _rowsum = _rowsum.toComma();

                                        $("input[name='_PRICE']", $tr).val(_rowsum);

 
                                        
                                        _me.cal_sum(el,$tr);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        }, 
                            
                     
                        {
                            nm: "hprice", type: "custom", vfnm: "_PRICE", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_138.title.a12"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PRICE']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },
                        
                        {
                            nm: "hetc", type: "custom", vfnm: "_ETC", validator: /[^\s]/, label: "aprv_sub_138.title.a17"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_ETC']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },   
                    ]
					});			
					return _$table;
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

            /* _$$.aprv_sub099.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            ,
			//_$$.aprv_sub138.subdoc.save() 
            save: function ($doc, opt) {

               // var el = $doc.element;
                //저장시 계정명을 필드에 설정
              // var _text = $("select[name='_acccode']", el).find("option:selected").text();                
              //  $("[name=_acccode_Nm]", $doc.element).val(_text);

                //밸리데이션 체크
                /*
                if ($("input[name='REQUSER1']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_099.msg.a1")
                    });
                    return false;
                }
                */
               

                
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			     var _me = _$$.aprv_sub138.subdoc;
			
			  var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

               

                var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element).xtable("instance");

                //****************************************************//
                //			결재 진행중인 문서는 지출결의서 항목 부분에 대해서는 수정 불가
                //				 - 2017.11.20 by dwlee
                //****************************************************//
                if (_opt.docstatus != "draft") {
						  $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
                    return true;
                }

                //****************************************************//
                //				임시저장인 경우  Validate 체크를 제외
                //				 - 2017.11.20 by dwlee
                //****************************************************//
                if (_aopt.actiontype == "draft") {
                    $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
                    return true;
                }

                var _isvalid = true;
               

                $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
				//_me.save() 
                console.log("105 save : ", _isvalid);

                console.log("138 save : ", _isvalid);
                return _isvalid;    



            }
        }
    }
}
    ($dwp.cns("app"), jQuery));



















