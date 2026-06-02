/* Source File Upload Time : 2021-03-15 1:14:03 PM*/


/* Source File Upload Time : 11-25-20 3:14:52 PM*/


/* Source File Upload Time : 11-20-20 9:09:18 AM*/


/* Source File Upload Time : 11-19-20 8:52:42 AM*/


/* Source File Upload Time : 7-3-20 2:20:02 PM*/


/* Source File Upload Time : 7-2-20 7:25:20 PM*/


/* Source File Upload Time : 2020-07-02 6:58:50 PM*/


/* Source File Upload Time : 7-2-20 9:37:14 AM*/


/* Source File Upload Time : 5-14-20 2:37:36 PM*/


/* Source File Upload Time : 4-29-20 4:07:08 PM*/


/* Source File Upload Time : 4-28-20 5:16:29 PM*/


/* Source File Upload Time : 2019-08-02 10:56:46 AM*/



/**
 * 전자결재 보조양식 - Transfer Ticket 
 * $dwp.app.aprv_sub143
 */

//양식설계 function 시작

(function (_$$, $) {
    _$$.aprv_sub143 = {
        subdoc: {
            SUBNAME: "sub143",
            MVLOG_DB 				: "/dwp/com/log/mvlog.nsf",
            PAMT_DB                 : "/dwp/com/work/purchase_aprv_master.nsf",									//구매승인 관리 DB
            COMM_CODE_DB                 : "/dwp/aprv/com/comm_code.nsf",									//일반 코드 DB


            init: function ($doc) {
                var _me = _$$.aprv_sub143.subdoc;
                var opt = $doc.options;
                var el = $doc.element;
                  _me.cal_sum(el);
                var _isedit = opt.isedit;		
                //결재 중간에 편집시에는 Transfer Ticket 영역 편집 불가
                if (opt.isedit == true && opt.docstatus != "draft") {
                    _isedit = false;
                }			
                var _opt = $.extend({}, opt , {isedittable : _isedit});
                                                
                console.log('S::Transfer Ticket');
                //console.log('S::언어' + $fn.getCurLangMsg(_author_disp_lang));
             

                //새문서일 경우
                if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko"));
		  $fn.alert({msg : $fn.getCodeMsg("aprv_sub_143.title.a13")});
                }

               
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                
                /*
                //Transfer Ticket 사용내역 입력 테이블
                //편집시에만 호출 - 2017.12.12
                if (opt.isedit) {
                    var _$table = _me.initExpendInputTable(_opt,$doc,"");
                }
                //Transfer Ticket 테이블
                //20190710 by NANO
                //초기화시 값 넘김 여부 - excel 업로드시 값이 넘어옴.
                var _$table = _me.initBudgetDspTable(_opt,$doc,"");		
                
                var _newopt = $.extend({}, _opt , {dtable : _$table});
                $doc.options = _newopt;
                */
                var _$table = _me.initInputTable(_opt, $doc, "");
                var _newopt = $.extend({}, _opt, { dtable: _$table });
                $doc.options = _newopt;    
				//var _$table = _me.initBudgetDspTable(_opt,$doc,"");
                //버튼 , 체크박스등의 처리.
				_me._initbutton(_opt,el);
					
                

                console.log('E::Transfer Ticket');
            } 
            //예산관련 버튼
           //각종 버튼 및 체크박스 함수 바인딩.
            , _initbutton : function(opt, el) {
                var _opt = opt, _el = el;
                var _me = _$$.aprv_sub143.subdoc;
                var _$intable = $("table[name='"+_me.SUBNAME+"_Table01']", el);
                
                if (_opt.isedittable) {

                    //리셋버튼
                    function _all_resetBtn() {
                        var _$btn_area1 = $(".dwp-reset1-btn",_el);
                        var _$btn1 = $("[type='button']",_$btn_area1);
                        _$btn1.off("click").on("click", function () {
                            _me._resetOptionElement(_el,_opt,"A");
                        });
                        var _$btn_area2 = $(".dwp-reset2-btn",_el);
                        var _$btn2 = $("[type='button']",_$btn_area2);
                        _$btn2.off("click").on("click", function () {
                            _me._resetOptionElement(_el,_opt,"1");
                        });
                        var _$btn_area3 = $(".dwp-reset3-btn",_el);
                        var _$btn3 = $("[type='button']",_$btn_area3);
                        _$btn3.off("click").on("click", function () {
                            _me._resetOptionElement(_el,_opt,"2");
                        });
                        var _$btn_area4 = $(".dwp-reset4-btn",_el);
                        var _$btn4 = $("[type='button']",_$btn_area4);
                        _$btn4.off("click").on("click", function () {
                            _me._resetOptionElement(_el,_opt,"3");
                        });
                        var _$btn_area5 = $(".dwp-reset5-btn",_el);
                        var _$btn5 = $("[type='button']",_$btn_area5);
                        _$btn5.off("click").on("click", function () {
                            _me._resetOptionElement(_el,_opt,"4");
                        });
                    }						
                    _all_resetBtn();	

                    //엑셀 업로드
                    function _excelUploadBtn() {
                        var _$btn_area = $(".dwp-excel-btn",_el);
                        var _$btn = $("[type='button']",_$btn_area);
                        _$btn.off("click").on("click", function () {
                            _me._excelUpload(_el,_opt);
                        });
                    }						
                    _excelUploadBtn();
                                        
                    //담당자 지정
                    function _signPersonBtn() {
                        var _$btn_area = $(".dwp-com-btn",_el);
                        var _$btn = $("[type='button']",_$btn_area);
                        _$btn.off("click").on("click", function () {                            
                            $fn.alert({msg : $fn.getCodeMsg("aprv_sub_143.msg.m1")});
                        });
                    }						
                    _signPersonBtn();
					
					 //엑셀 업로드
                    function _SampleDown() {
                        var _$btn_area = $(".dwp-sample-btn",_el);
                        var _$btn = $("[type='button']",_$btn_area);
                        _$btn.off("click").on("click", function () {
                           window.open("/dwp/com/sys/gwlib.nsf/budget/$file/transferticket_sample.xlsx");
                        });
                    }						
                    _SampleDown();
                    /*
                    var _$chgcur = $("select[name='chgcurrency']", el);
                    var _$stdcur = $("select[name='stdcurrency']", el);
                    var _$cmon = $("input[name='chgmoney']", el);
                    _$chgcur.on("change",function() {							
                        if (_$chgcur.xval() == _$stdcur.xval()) {
                            _$cmon.prop("readonly",true);
                            _$cmon.xval("1");
                        } else {
                            _$cmon.prop("readonly",false);
                        }
                    });
                    
                    //2017.11.16 by dwlee
                    _$stdcur.on("change",function() {							
                        if (_$chgcur.xval() == _$stdcur.xval()) {
                            _$cmon.prop("readonly",true);
                            _$cmon.xval("1");
                        } else {
                            _$cmon.prop("readonly",false);
                        }
                    });
                    
                    //환율이 변경되면 예산을 다시 계산한다.
                    _$cmon.on("keyup", function(){
                        var _imoney = _$cmon.xval();												//변동비율		        		
                        _imoney = _imoney.replace(/,/gi,"");								        		
                        _imoney = _me.numericCheck(_imoney,0);							        		
                        if (_imoney == "") {
                            _imoney = "1";
                        }								        		
                        _$cmon.xval(_imoney.toComma());	
                        _me.cal_sum(el);
                    });	
                    */							
                }

                if (_opt.isedittable == false) {	
                    /*						
                    //입력사항 조회 버튼 숨기기 펼치기
                    function _showBtnYN() {
                        //var _$btn_area = $(".dwp-budget-btn",_el);
                        var _$btn = $(".dwp-budget-btn",_el);
                        _$btn.off("click").on("click", function () {
                            _$dwpinput = $(".dwp-budget-input",_el);
                            if (_$dwpinput.hasClass("dwp-hidden")) {
                                _$dwpinput.removeClass("dwp-hidden");
                                
                                var _$btnText = $(".button",_$btn);
                                _$btnText.html($fn.getCodeMsg("aprv_sub_002.title.d2"));
                                
                                //2017.12.12 by dwlee									
                                //var _ins = $fn.getInstance("doc", $fn.getContent());
                                //console.log("_in : " ,_ins);
                                
                                var _$doc = _el.doc("instance");									
                                var _$intable = $("table[name='"+_me.SUBNAME+"_Table01']", _$doc.element);									
                                var _$tr = $("[name='_row_0']",_$intable);	
                                if (_$tr.size() == 0) {
                                    var _$table = _me.initExpendInputTable(_opt,_$doc,"");
                                }
                                
                            } else {
                                _$dwpinput.addClass("dwp-hidden");
                                var _$btnText = $(".button",_$btn);
                                _$btnText.html($fn.getCodeMsg("aprv_sub_002.title.d1"));
                            }
                        });
                    }						
                    _showBtnYN();
                    
                    //조회모드에서는 여기까지 하고 끝
                    return;
                    */
                }
               				
            }
			//지출결의서 비용관련 예산 표시 테이블 - 초기화
            , initBudgetDspTable: function (_opt, $doc, _xsldatat) {
                var _me = _$$.aprv_sub143.subdoc;
                var el = $doc.elelment;
				
				var _tableVal;
                if ( _xsldatat == "" ) {
                    _tableVal = $("input[name=fld_formdata]", $doc.element).val();    
                } else {
                    _tableVal = _xsldatat;
				}
               // var _tableVal = $("input[name=fld_formdata]", $doc.element).val();

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
                            _me.cal_sum(el);
                        } else if (act == "copy") {
                             _me.cal_sum(el); 									//행 복사시 합계 재계산
                            //_me.cal_sum_new(el);										//삭제시 합계 재계산
                            //_me.cal_sum_1(el);										//삭제시 합계 재계산
                            //_me.cal_sum_new1(el);										//삭제시 합계 재계산
 
                        }
                    }
                    , cell: [
                        {
                            nm: "hpnum", type: "custom", vfnm: "_PNUM"
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
                            nm: "hunit", type: "custom", vfnm: "_UNIT"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_UNIT']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },

                        {
                            nm: "hamount", type: "custom", vfnm: "_AMOUNT", css: "dwp-right"
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
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },                                   
                        {
                            nm: "hunitcost", type: "custom", vfnm: "_UNITCOST", css: "dwp-right"
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
                            nm: "hprice", type: "custom", vfnm: "_PRICE", css: "dwp-right"
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
                            nm: "husage1", type: "custom", vfnm: "_USAGE1"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_USAGE1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "husage2", type: "custom", vfnm: "_USAGE2"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_USAGE2']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hbucode1", type: "custom", vfnm: "_DEPT"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                   // var _$type = $("input[name='_DEPT']", $cell);
                                   // _$type.xval(val);

                                    var _$idept = $("input[name='_DEPT']", $cell);							        			
                                    var _$ideptinfo = $("input[name='_DEPT_INFO']", $cell);							        			

                                    //if (_$ideptinfo.xval() != "") {
                                        var _info = $("input[name='_DEPT_INFO']").val();
                                        var _info = _info.split("¶");							        		
                                        _$idept.xval(_info[2]);							        			
                                   // }    
                                    _$idept.off("click").on("click", function(){
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
                                        var _customerDB = _me.PAMT_DB;
                                        //====================================================
                                        //				Transfer Ticket 부서 정보 선택 보기호출 변경
                                        // 				- 2019.07.11 by 나노브레인
                                        //====================================================

                                        //var _info = _$com_info.xval().split("¶");	
                                        var _form = "w_pop_dept";
                                        //====================================================
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("aprv_sub_143.title.department"),                                            
                                            width: 1100,
                                            height: 800,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_103.lang.js",
                                            content : {
                                                html : "", 
                                            //	url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"                                            
                                            //  url : _customerDB+"/wFrmPopDeptView?ReadForm&view="+_form
                                                url : _customerDB+"/wFrm10PopView?ReadForm&view="+_form
											//		, data : {view : _view
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
                                        $cell.html("<div class='dwp-center'>" + _info[2] + "</div>");	 
                                        
                                    }

                                }
                            }
                        },
                        {
                            nm: "hbucode2", type: "custom", vfnm: "_BUCODE2"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_BUCODE2']", $cell);
									//var _$type1 = $("input[name='_BUCODE21']", $cell);
                                    _$type.xval(val);
									//_$type1.xval(_$type1.val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val+ "</div>");
                                }
                            }
                        },
                        {
                            nm: "hetc", type: "custom", vfnm: "_ETC"
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

            //지출결의서 비용관련 예산 표시 테이블 - 초기화
            , initInputTable: function (_opt, $doc,_xsldatat) {
                var _me = _$$.aprv_sub143.subdoc;
                var el = $doc.elelment;
				
				var _tableVal;
				 if ( _xsldatat == "" ) {
                    _tableVal = $("input[name=fld_formdata]", $doc.element).val();    
                } else {
                    _tableVal = _xsldatat;
				}
                
                   // _tableVal = $("input[name=fld_formdata]", $doc.element).val();    
               
               // var _tableVal = $("input[name=fld_formdata]", $doc.element).val();

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
                            _me.cal_sum(el);
                        } else if (act == "copy") {
                             _me.cal_sum(el); 									//행 복사시 합계 재계산
                            //_me.cal_sum_new(el);										//삭제시 합계 재계산
                            //_me.cal_sum_1(el);										//삭제시 합계 재계산
                            //_me.cal_sum_new1(el);										//삭제시 합계 재계산
 
                        }
                    }
                    , cell: [
                        {
                            nm: "hpnum", type: "custom", vfnm: "_PNUM"
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
                            nm: "hunit", type: "custom", vfnm: "_UNIT"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_UNIT']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },

                        {
                            nm: "hamount", type: "custom", vfnm: "_AMOUNT", css: "dwp-right"
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
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },                                   
                        {
                            nm: "hunitcost", type: "custom", vfnm: "_UNITCOST", css: "dwp-right"
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
                            nm: "hprice", type: "custom", vfnm: "_PRICE", css: "dwp-right"
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
                            nm: "husage1", type: "custom", vfnm: "_USAGE1"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_USAGE1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "husage2", type: "custom", vfnm: "_USAGE2"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_USAGE2']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hbucode1", type: "custom", vfnm: "_DEPT_INFO"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_DEPT']", $cell);
                                    //_$type.xval(val);

                                    var _$idept = $("input[name='_DEPT']", $cell);							        			
                                    var _$ideptinfo = $("input[name='_DEPT_INFO']", $cell);							        			

                                    if (_$ideptinfo.xval() != "") {
                                        var _info = _$ideptinfo.xval();
                                        var _info = _info.split("¶");							        		
                                        _$idept.xval(_info[0] +"/"+_info[1]);							        			
                                    }    
									      // alert(_info[1])	
                                    _$idept.off("click").on("click", function(){
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
                                        //var _customerDB = _me.PAMT_DB;
                                        var _customerDB = _me.COMM_CODE_DB;
                                        
                                        //====================================================
                                        //				Transfer Ticket 부서 정보 선택 보기호출 변경
                                        // 				- 2019.07.11 by 나노브레인
                                        //====================================================

                                        //var _info = _$com_info.xval().split("¶");	
                                        //var _form = "w_pop_dept";
                                        var _form = "w_use_deptcode_1";
                                        //====================================================
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("aprv_sub_143.title.department"),                                            
                                            width: 1100,
                                            height: 800,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_103.lang.js",
                                            content : {
                                                html : "", 
                                            //	url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                            //  url : _customerDB+"/wFrmPopDeptView?ReadForm&view="+_form
                                                url : _customerDB+"/wFrm10PopView?ReadForm&view="+_form
											//		, data : {view : _view
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
                                        $cell.html("<div class='dwp-center'>" + _info[0] +"/"+_info[1] + "</div>");	 
                                        
                                    }

                                }
                            }
                        },
                        {
                            nm: "hbucode2", type: "custom", vfnm: "_BUCODE2"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_BUCODE2']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hetc", type: "custom", vfnm: "_ETC"
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
                    //_$table.add();
                }
                return _$table;
            } 

            //입력된 값으로 합계 구하는 함수
            , cal_sum: function (el , tr) {                                
                var _me = _$$.aprv_sub143.subdoc;
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

                _me.cal_count( el);

            }
            ,cal_count : function(el ) {
                var _me = _$$.aprv_sub143.subdoc;
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
                var _$input_trs = $("tr", _$input_tbl);

                var _$isupply = $("input[name='_PRICE']", _$input_trs);
                var _count = -1;
				$.each(_$isupply, function(idx, o){
                        console.log("cal_count :" + idx);

                        _count = _count + 1;
                });
                _count = _count + "";
                $("input[name='total_count']", el).xval(_count);

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
            //샘플파일 다운로드
            , _resetOptionElement : function (_el,_opt,_flag) {
                //  /dwp/com/sys/gwlib.nsf/seal/$file/sample(erp).xls
                //var _$attach = $("<a href='/dwp/com/sys/gwlib.nsf/budget/$file/sample(erp).xlsx'>");
                //_$attach.click();					
                //window.open("/dwp/com/sys/gwlib.nsf/budget/$file/sample(erp).xlsx");
                if ( _flag == "A") {
                    if($(':radio[name="_reason01"]:checked').length > 0){
                        /* 전체 Checked 해제 */
                        $('input[name="_reason01"]').each(function() {
                            $(this).prop('checked', false);
                        });
                    }
                    if($(':radio[name="_reason02"]:checked').length > 0){
                        /* 전체 Checked 해제 */
                        $('input[name="_reason02"]').each(function() {
                            $(this).prop('checked', false);
                        });
                    }
                    if($(':radio[name="_reason03"]:checked').length > 0){
                        /* 전체 Checked 해제 */
                        $('input[name="_reason03"]').each(function() {
                            $(this).prop('checked', false);
                        });
                    }
                    if($(':radio[name="_reason04"]:checked').length > 0){
                        /* 전체 Checked 해제 */
                        $('input[name="_reason04"]').each(function() {
                            $(this).prop('checked', false);
                        });
                    }
                } else if (_flag == "1"){
                    if($(':radio[name="_reason01"]:checked').length > 0){
                        /* 전체 Checked 해제 */
                        $('input[name="_reason01"]').each(function() {
                            $(this).prop('checked', false);
                        });
                    }
                } else if (_flag == "2"){
                    if($(':radio[name="_reason02"]:checked').length > 0){
                        /* 전체 Checked 해제 */
                        $('input[name="_reason02"]').each(function() {
                            $(this).prop('checked', false);
                        });
                    }
                } else if (_flag == "3"){
                    if($(':radio[name="_reason03"]:checked').length > 0){
                        /* 전체 Checked 해제 */
                        $('input[name="_reason03"]').each(function() {
                            $(this).prop('checked', false);
                        });
                    }
                } else if (_flag == "4"){
                    if($(':radio[name="_reason04"]:checked').length > 0){
                        /* 전체 Checked 해제 */
                        $('input[name="_reason04"]').each(function() {
                            $(this).prop('checked', false);
                        });
                    }
                }
               
            }
            //엑셀 업로드
            , _excelUpload : function(_el,_opt) {
                var _me = _$$.aprv_sub143.subdoc;					
            
                var _uploadDB = _me.MVLOG_DB;		
				//				
                //var _url = $fn.getProxyUrl(_uploadDB + "/wFrmTransferUpload?OpenForm&curserver=" + _opt.sysinfo.svrnm);
				var _url = $fn.getProxyUrl(_uploadDB + "/wFrmTransferUpload?OpenForm&curserver=" + _opt.sysinfo.svrnm);
                var _buttons = [	{
                    "title" : $fn.getCodeMsg("aprv_sub_143.btn.fileupload"),
                    "click" : function(obj) {
                        var _save = {
                            callback : function(__data) {
                                if (__data.hasOwnProperty("result")) {
                                    if ( __data.result == "200") {
                                        
//											console.log("================================");
//											console.log("__data : ",__data);
//											console.log("================================");
//											var cdate = new Date();
//											console.log("time ",cdate);
                                        
                                        var _jsonData = __data;
                                        
										
										 console.log("================================");
                                        console.log("__data : ",__data);
                                        console.log("================================");
                                        
                                        
										//var cdate = new Date();
										//console.log("time ",cdate);
                                        
                                        //var _jsonData1 = __data.data;
                                        
                                        //var _ins = $fn.getInstance("doc", $fn.getContent());
                                        //var _doc = _ins.element.doc("instance");
                                        var _doc = _el.doc("instance");
                                        var _opt = _doc.options;	
                                        
                                        var _$table = $("table[name="+_me.SUBNAME+"_Table01]", _el);
                                        var _$trs = $("tbody>tr",_$table);
                                        //alert(_$trs.size())
                                        if (_$trs.size() > 0) {
                                            $.each(_$trs, function (index, tr) {
                                                var _$tr = $(this);
                                                if (  _$tr.attr("name") != "_template" && _$tr.attr("name") != "" && _$tr.attr("name") != "_ROW_TOTAL") {
                                                    _$tr.remove();
                                                }
                                            });
                                        }
                                        
                                        if (__data.data != "") {
                                            //alert(_jsonData)
                                            var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", _doc.element).xtable("instance")
                                                //  _$table.options.isinit = true;

                                            //var _$table = _me.initBudgetDspTable(_opt, _doc, "", __data.data);
                                            var _$table = _me.initInputTable(_opt, _doc, __data.data);
                                            
                                            //  _$table.options.isinit = false;

                                        }
										if (__data.data1 != "") {
											var headval=__data.data1;
											headval=headval.split("†");
											$("[name=ed_ReqInfo_1]", _el).val(headval[0])
											$("[name=ed_ReqInfo_2]", _el).val(headval[1])
											$("[name=FromDate]", _el).val(headval[2])
											$("[name=ed_ReqInfo_4]", _el).val(headval[3])
											$("[name=ed_ReqInfo_5]", _el).val(headval[4])
											$("[name=ed_ReqInfo_6]", _el).val(headval[5])
											
											
											
											
										}
										  _me.cal_sum(el);
                                        obj.close();	

                                       
                                    } else {
                                            if (__data.hasOwnProperty("detail_msg")) {
                                                var _altmsg = __data.detail_msg;												
                                                
                                                $dwp.ui.alert({msg : _altmsg}); return;
                                            }
                                            if (__data.hasOwnProperty("succ_cnt")) {
                                                $dwp.ui.alert({msg : "Success Count : "+__data.succ_cnt}); return;
                                            } else {
                                                $dwp.ui.alert({msg : $fn.getCodeMsg("aprv_sub_143.msg.error00")}); return;
                                            }
                                            obj.close();
                                        }
                                    }
                                }
                        }
                        obj.element.doc("instance").save(_save);
                    }
                },
                {
                    "title" : $fn.getCodeMsg("aprv_sub_143.btn.cancel"),
                    "click" : function(obj) {
                        obj.close();
                    }
                }];


                //var _buttons = [	];
                $fn.dialog(null, {
                    modal: true,
                    resizable: true,
                    draggable: true,
                    islangconvert : false,
                    title: $fn.getCodeMsg("aprv_sub_143.btn.excelupload"),
                    width: 600,
                    /*height: 410,*/
                    show: 'fade',			//effect
                    hide: 'fade',			//effect
                    buttons: _buttons,
                    content : {url : _url, data:{}}
                });
            }
            /* _$$.aprv_sub099.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            ,
            save: function ($doc, opt) {

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                var _me = _$$.aprv_sub143.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);
                var el = $doc.element;

                // 제목 설정
                /*
                var _text = $("select[name='_FormType']", el).find("option:selected").text();             
                var _$subject = $("input[name='Subject']", el);
                $("input[name='Subject']", el).xval( _$subject + " " + _text);
                */    
                var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element).xtable("instance");
                
                //****************************************************//
                //			결재 진행중인 문서는 항목 부분에 대해서는 수정 불가
                //				 - 2017.11.20 by dwlee
                //****************************************************//
			
				
			
				if($("input[name=Circulation3]", $doc.element).val() == ""){
					$fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_143.title.a10")
                    });
					return false;
				}
					
				var susin=$("input[name=Circulation3]", $doc.element).val();
				
			if(_opt.isnew){
			
				if($("input[name=Circulation3]", $doc.element).val() == ""){
					$fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_143.title.a10")
                    });
					return false;
				}
				
					
					
				if(susin.indexOf("U00579") < 0 //류성택
				&& ($("select[name=_FormType]", $doc.element).val() =="1" ||$("select[name=_FormType]", $doc.element).val() =="2")
				){
					$fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_143.title.a11")
                    });
					return false;
					
				}
				if(susin.indexOf("U01069") < 0 
				&& ($("select[name=_FormType]", $doc.element).val() =="3" ||$("select[name=_FormType]", $doc.element).val() =="4")
				){
					$fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_143.title.a12")
                    });
					return false;
					
				}
				
			}
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

                //필수입력 체크
                var _isvalid = true;
                if (!_$table.validate()) {
                    _isvalid = false;
                    return false;
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

                console.log("143 save : ", _isvalid);
                return _isvalid;    



            }
        }
    }
}
    ($dwp.cns("app"), jQuery));















