/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 차량운행일지
 * $dwp.app.aprv_sub197
 */

 (function (_$$, $) {
    _$$.aprv_sub197 = {
        subdoc: {
            SUBNAME: "sub197"
            , init: function ($doc) {
                var _me = _$$.aprv_sub197.subdoc, opt = $doc.options;
                var el = $doc.element;
                var _$table01 = $("table[name=sub197_Table01]", $doc.element);

                var _isedit = opt.isedit;
                //결재 중간에 편집시에는 지출결의서 영역 편집 불가
                if (opt.isedit == true && opt.docstatus != "draft") {
                    _isedit = false;
                }
                var _opt = $.extend({}, opt, { isedit: _isedit });

             
                if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko"));
                }

                var _$table = _me.initInputTable(_opt, $doc, "");
                var _newopt = $.extend({}, _opt, { dtable: _$table });
                $doc.options = _newopt;

                $("input[name='PL_1']", $doc.element).on("keyup", function() {
                    $(this).val($(this).val().replace(/[^0-9]/g,""));
                 });
                 $("input[name='FP_9']", $doc.element).on("keyup", function() {
                    $(this).val($(this).val().replace(/[^0-9]/g,""));
                 });
                 if (opt.isedit ){
                    if($('[name=ed_attachkind] option:selected',$doc.element).val() == "A" ||$('[name=ed_attachkind] option:selected',$doc.element).val() == "B" ){
                        $("#noearea", $doc.element).show(); 
                        $("#earea", $doc.element).hide(); 
    
                     }else{
                        

                        $("#earea", $doc.element).show(); 
                        $("#noearea", $doc.element).hide(); 
                     }
                 }else{
                    if($('[name=carkind]',$doc.element).val() == "A" || $('[name=carkind]',$doc.element).val() == "B"){
                        $("#noearea", $doc.element).show(); 
                        $("#earea", $doc.element).hide(); 
    
                     }else{
                      
                        $("#earea", $doc.element).show(); 
                        $("#noearea", $doc.element).hide();
                     }
                 }

                 

                $('[name=ed_attachkind]',$doc.element).change(function() {
                   // alert($('[name=ed_attachkind]',$doc.element).val() )
                    if($('[name=ed_attachkind]',$doc.element).val() == "A"){

                        $("input[name=per]", $doc.element).val( "12");
                        $("#noearea", $doc.element).show(); 
                        $("#earea", $doc.element).hide(); 
                    }else if($('[name=ed_attachkind]',$doc.element).val() == "B"){

                        $("input[name=per]", $doc.element).val( "10");
                        $("#noearea", $doc.element).show(); 
                        $("#earea", $doc.element).hide(); 
                    }else{
                       // alert("1800이상")
                       //$("#셀렉트박스ID option:selected").val(); 전기차
                        $("input[name=FP_9_1]", $doc.element).val( $('[name=ed_attachkind] option:selected',$doc.element).val());
                        $("#earea", $doc.element).show(); 
                        $("#noearea", $doc.element).hide(); 
                    }
                    _me.cal_sum(el); 									//행 복사시 합계 재계산
                    _me.cal_sum3(el);
                    _me.cal_sum_e(el);
                             
                });

                $("[name=supply_sum_1]", $doc.element).on("blur", function () { //전기차 kwh단가 구하기 
                    
                    var _per = $("input[name='per_1']", el).val();               
                     //_per = _me.numericCheck(_per, 0);

                     var _vsum = $("input[name='supply_sum_1']", el).val();
                      _vsum = _me.numericCheck(_vsum, 0);
                      _vsum= _vsum.replace(/,/gi, "");                      
                      _per=_per.replace(/,/gi, "");
                    var _icount1= parseFloat(_vsum) / parseFloat(_per);

                    //$("input[name='Resault']", el).val(_icount1.toFixed(1));
                   // _icount1 = _icount1.replace(/,/gi, "");
                    _icount1=_icount1+"";
                    _icount1=_icount1.toComma();
                    _icount1=parseFloat(_icount1);
                  //  _per=_per+"";
                  //  _per=_per.toComma();
                    _per=parseFloat(_per)
                     $("input[name='Resault_1']", el).val(_icount1.toFixed(1));
                     $("input[name='PL_1_1']", el).val(_icount1.toFixed(1));
                     $("input[name='supply_sum_1']", el).val(_vsum.toComma());
                     $("input[name='per_1']", el).val(_per.toFixed(2));

                     var _PL_1 = $("input[name='PL_3']", $doc.element).val(); //단가
                     var FP_9=$("input[name='PL_1_1']", $doc.element).val(); //기타
                     var PL_2 = $("input[name='FP_9_1']", $doc.element).val(); //전비
                     var PL = $("input[name='FP_9_2']", $doc.element).val(); //기타
                     //supply_sum
 
                     //var _icount1 = _$type1.xval();
 
                     if(_PL_1 == ""){
                         _PL_1="0"
                     }
                     if(FP_9 == ""){
                         FP_9="0"
                     }
                    
                     
                     
                     _PL_1 = _PL_1.replace(/,/gi, "");
                     FP_9=FP_9.replace(/,/gi, "");
                     PL=PL.replace(/,/gi, "");
                     PL_2 = PL_2.replace(/,/gi, "");
                     
                     var sum=0;
                     
                     // 사용량 12 나누기 사용량 km
                     //PL = _me.numericCheck(PL, 0);
                 // _PL_1=_me.numericCheck(_PL_1, 0);
                 // PL_2 = _me.numericCheck(PL_2, 0);
 
                      sum= (parseInt(_PL_1) * parseFloat(FP_9)) / parseFloat(PL_2) +parseInt(PL)
                     sum=Math.ceil(sum/10) * 10
                     sum=sum+"";
                     $("input[name='PL_2_1']", $doc.element).val(sum.toComma())

                 });
                 $("[name=per_1]", $doc.element).on("blur", function () { //전기차 kwh단가 구하기 
                    
                    var _per = $("input[name='per_1']", el).val();               
                    // _per = _me.numericCheck(_per, 0);

                     var _vsum = $("input[name='supply_sum_1']", el).val();
                      _vsum = _me.numericCheck(_vsum, 0);
                      _vsum= _vsum.replace(/,/gi, "");                      
                      _per=_per.replace(/,/gi, "");
                    var _icount1= parseInt(_vsum) / parseFloat(_per);

                    //$("input[name='Resault']", el).val(_icount1.toFixed(1));
                   // _icount1 = _icount1.replace(/,/gi, "");
                    _icount1=_icount1+"";
                    _icount1=_icount1.toComma();
                    _icount1=parseFloat(_icount1);
                   // _per=_per+"";
                   // _per=_per.toComma();
                    _per=parseFloat(_per)
                     $("input[name='Resault_1']", el).val(_icount1.toFixed(1));
                     $("input[name='PL_1_1']", el).val(_icount1.toFixed(1));
                     $("input[name='supply_sum_1']", el).val(_vsum.toComma());
                     $("input[name='per_1']", el).val(_per.toFixed(2));

                     var _PL_1 = $("input[name='PL_3']", $doc.element).val(); //단가
                     var FP_9=$("input[name='PL_1_1']", $doc.element).val(); //기타
                     var PL_2 = $("input[name='FP_9_1']", $doc.element).val(); //전비
                     var PL = $("input[name='FP_9_2']", $doc.element).val(); //기타
                     //supply_sum
 
                     //var _icount1 = _$type1.xval();
 
                     if(_PL_1 == ""){
                         _PL_1="0"
                     }
                     if(FP_9 == ""){
                         FP_9="0"
                     }
                    
                     
                     
                     _PL_1 = _PL_1.replace(/,/gi, "");
                     FP_9=FP_9.replace(/,/gi, "");
                     PL=PL.replace(/,/gi, "");
                     PL_2 = PL_2.replace(/,/gi, "");
                     
                     var sum=0;
                     
                     // 사용량 12 나누기 사용량 km
                     //PL = _me.numericCheck(PL, 0);
                 // _PL_1=_me.numericCheck(_PL_1, 0);
                 // PL_2 = _me.numericCheck(PL_2, 0);
 
                      sum= (parseInt(_PL_1) * parseFloat(FP_9)) / parseFloat(PL_2) +parseInt(PL)
                     sum=Math.ceil(sum/10) * 10
                     sum=sum+"";
                     $("input[name='PL_2_1']", $doc.element).val(sum.toComma())

                 });
                 
                 $("[name=FP_9_2]", $doc.element).on("blur", function () { //전기차 기타 온블러시 
                    var _PL_1 = $("input[name='PL_3']", $doc.element).val(); //단가
                    var FP_9=$("input[name='PL_1_1']", $doc.element).val(); //기타
                    var PL_2 = $("input[name='FP_9_1']", $doc.element).val(); //전비
                    var PL = $("input[name='FP_9_2']", $doc.element).val(); //기타
                    //supply_sum

                    //var _icount1 = _$type1.xval();

                    if(_PL_1 == ""){
                        _PL_1="0"
                    }
                    if(FP_9 == ""){
                        FP_9="0"
                    }
                   
                    
                    
                    _PL_1 = _PL_1.replace(/,/gi, "");
                    FP_9=FP_9.replace(/,/gi, "");
                    PL=PL.replace(/,/gi, "");
                    PL_2 = PL_2.replace(/,/gi, "");
                    
                    var sum=0;
                    
                    // 사용량 12 나누기 사용량 km
                    //PL = _me.numericCheck(PL, 0);
                // _PL_1=_me.numericCheck(_PL_1, 0);
                // PL_2 = _me.numericCheck(PL_2, 0);

                     sum= (parseInt(_PL_1) * parseFloat(FP_9)) / parseFloat(PL_2) +parseInt(PL)
                    sum=Math.ceil(sum/10) * 10
                    sum=sum+"";
                    $("input[name='PL_2_1']", $doc.element).val(sum.toComma())
                   // PL_2=parseInt(PL_2);
                    PL_2=PL_2+"";
                  
                    
             
                    $("input[name='FP_9_2']", el).val(PL.toComma()); // 기타
                   // $("input[name='FP_9']", el).val(FP_9.toComma()); // 기타  

                 });
                 
                    $("[name=PL_1]", $doc.element).on("blur", function () { //단가 온블러시 
                  
                        var _PL_1 = $("input[name='PL_1']", $doc.element).val(); //단가
                        var FP_9=$("input[name='FP_9']", $doc.element).val(); //기타
                        var PL_2 = $("input[name='PL_2']", $doc.element).val(); //합계
                        var PL = $("input[name='PL']", $doc.element).val(); //합계1
                        //supply_sum

                        //var _icount1 = _$type1.xval();

                        if(_PL_1 == ""){
                            _PL_1="0"
                        }
                        if(FP_9 == ""){
                            FP_9="0"
                        }
                       
                        
                        
                        _PL_1 = _PL_1.replace(/,/gi, "");
                        FP_9=FP_9.replace(/,/gi, "");
                        PL=PL.replace(/,/gi, "");
                    //	_icount1 = _icount1.replace(/,/gi, "");
                        
                        var sum=0;
                        
                        // 사용량 12 나누기 사용량 km
                        //PL = _me.numericCheck(PL, 0);
                    // _PL_1=_me.numericCheck(_PL_1, 0);
                    // PL_2 = _me.numericCheck(PL_2, 0);

                        sum= (parseFloat(PL) * parseInt(_PL_1)) + parseInt(FP_9);
                        sum=Math.ceil(sum/10) * 10
                        sum=sum+"";
                        $("input[name='PL_2']", $doc.element).val(sum.toComma())
                        _PL_1=parseInt(_PL_1);
                        _PL_1=_PL_1+"";
                        FP_9=parseInt(FP_9);
                        FP_9=FP_9+"";
                        
                 
                        $("input[name='PL_1']", el).val(_PL_1.toComma()); // 단가
                        $("input[name='FP_9']", el).val(FP_9.toComma()); // 기타    
                   
                                          
                            
                    
                    
                  });
                  
                  $("[name=FP_9]", $doc.element).on("blur", function () { //기타 온블러시 
                  
                    
                   
                    var _PL_1 = $("input[name='PL_1']", $doc.element).val(); //단가
                    var FP_9=$("input[name='FP_9']", $doc.element).val(); //기타
                    var PL_2 = $("input[name='PL_2']", $doc.element).val(); //합계
                    var PL = $("input[name='PL']", $doc.element).val(); //합계1
                    //supply_sum

                    //var _icount1 = _$type1.xval();

                    if(_PL_1 == ""){
                        _PL_1="0"
                    }
                    if(FP_9 == ""){
                        FP_9="0"
                    }

                 
                    
                    _PL_1 = _PL_1.replace(/,/gi, "");
                    FP_9=FP_9.replace(/,/gi, "");
                    PL=PL.replace(/,/gi, "");
                //	_icount1 = _icount1.replace(/,/gi, "");
                    
                    var sum=0;
                    
                    // 사용량 12 나누기 사용량 km
                    //PL = _me.numericCheck(PL, 0);
                // _PL_1=_me.numericCheck(_PL_1, 0);
                // PL_2 = _me.numericCheck(PL_2, 0);

                    sum= (parseFloat(PL) * parseInt(_PL_1)) + parseInt(FP_9);
                    sum=Math.ceil(sum/10) * 10
                    sum=sum+"";
                    $("input[name='PL_2']", $doc.element).val(sum.toComma())
                    _PL_1=parseInt(_PL_1);
                    _PL_1=_PL_1+"";
                    FP_9=parseInt(FP_9);
                    FP_9=FP_9+"";
                    
             
                    $("input[name='PL_1']", el).val(_PL_1.toComma()); // 단가
                    $("input[name='FP_9']", el).val(FP_9.toComma()); // 기타          
                
        
        
      });
            }

            //지출결의서 비용관련 예산 표시 테이블 - 초기화
            , initInputTable: function (_opt, $doc) {
                var _me = _$$.aprv_sub197.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata]", $doc.element).val();

                var _$table = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table01']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal
                    , template: "[name=_template]"
                    , keyfield: ""
                    , changeafter: function (act, tr, inst) {
                        if (act == "del") {
                            _me.cal_sum(el);										//삭제시 합계 재계산
						
							_me.cal_sum3(el);
                            _me.cal_sum_e(el);
                        } else if (act == "add") {
                            //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                        } else if (act == "copy") {
                            _me.cal_sum(el); 									//행 복사시 합계 재계산
							_me.cal_sum3(el);
                            _me.cal_sum_e(el);
                        }
                    }
                    , cell: [
                        {
                            nm: "no", type: "custom", vfnm: "_NO", validator: /[^\s]/, label: "aprv_sub_197.title.a1"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_NO']", $cell);
                                    _$type.xval(val);
									 _me.cal_sum3(el,$tr); 
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "day", type: "date", vfnm: "_DAY", css: "dwp-center",  label: "aprv_sub_197.title.a2"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$input = $("input[name='_DAY']", $cell);
                                    _$input.xval(val);
									/*
                                    _$input.on("keyup", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        var _cmoney = _icount;
                                        if (_cmoney == "") {
                                            _cmoney = "0";
                                        }
                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());

                                        _me.cal_sum(el);
                                    });
									*/
                                } else {
                                    if (typeof val == "undefined") return;
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "go", type: "custom", vfnm: "_GO",  label: "aprv_sub_197.title.a3"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_GO']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "stopover", type: "custom", vfnm: "_STOPOVER",  label: "aprv_sub_197.title.a4"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_STOPOVER']", $cell);
                                    _$type.xval(val);
                                    /*
									 _$type.bind("blur", function () {
                                        var _icount = _$type.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);
                                        var _cmoney = _icount;
                                        if (_cmoney == "") {
                                            _cmoney = "0";
                                        }
                                        _icount = parseFloat(_icount) + "";
                                        _$type.xval(_icount.toComma());

                                        _me.cal_sum(el);
                                    });
                                    */
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "destination", type: "custom", vfnm: "_DESTINATION",  label: "aprv_sub_197.title.a6"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_DESTINATION']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "distance", type: "custom", vfnm: "_DISTANCE", validator: /[^\s]/, label: "aprv_sub_197.title.a5"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
									//_BUN2*_BUN6= _BUN7 
                                    var _$type = $("input[name='_DISTANCE']", $tr);
									// var _$type1 = $("input[name='_BUN6']", $tr);
									 // var _$type2 = $("input[name='_BUN7']", $tr);
									  
									  
                                    _$type.xval(val);
									 _$type.bind("blur", function () {
                                        var _icount = _$type.xval();
                                        var _per = $("input[name='per']", $doc.element).val();
                                        var _sum=$("input[name='supply_sum']", $doc.element).val();


                                        //supply_sum

										//var _icount1 = _$type1.xval();
										
                                        _icount = _icount.replace(/,/gi, "");
                                        _sum=_sum.replace(/,/gi, "");
									//	_icount1 = _icount1.replace(/,/gi, "");
										
										
										// 사용량 12 나누기 사용량 km
                                        _icount = _me.numericCheck(_icount, 0);
                                        _sum=_me.numericCheck(_sum, 0);
                                        _per = _me.numericCheck(_per, 0);

                                        _$type.xval(_icount.toComma());
									
										 _me.cal_sum(el);										//삭제시 합계 재계산
                                         _me.cal_sum_e(el);

                                        //var _icount1= parseInt($("input[name='supply_sum']", $doc.element).val()) / _per;

                                       // $("input[name='Resault']", $doc.element).val(_icount1.toFixed(1));

                                      
										
										
										
                                    
                                        
										
									  });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "bigo", type: "custom", vfnm: "_BIGO",  label: "aprv_sub_197.title.a6"
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
                    _$table.add();
                    //_$table.add();
                    //_$table.add();
                    //_$table.add();
                   // _$table.add();
                }
                return _$table;
            }

            //입력된 값으로 합계 구하는 함수
            , cal_sum: function (el) {
                var _me = _$$.aprv_sub197.subdoc;
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);

                var _$input_trs = $("tr", _$input_tbl);
                var _supply_sum = 0;
                $.each(_$input_trs, function (i_index, input_tr) {
                    var _$input_tr = $(input_tr);

                    if ($("input[name='_DISTANCE']", _$input_tr).size() > 0) {
                        var _$isupply = $("input[name='_DISTANCE']", _$input_tr);

                        console.log("val : ", _$isupply.xval());

                        var _isupply = _$isupply.xval();
                        _isupply = _isupply.replace(/,/gi, "");
                        if (_isupply == "") {
                            _isupply = "0";
                        }
                        _$isupply.xval(_isupply.toComma());
                        _supply_sum += parseFloat(_isupply);
                    }
                });
                _supply_sum += "";

                console.log("sum : ", _supply_sum);

                //INPUT Table의 총합계
                $("input[name='supply_sum']", _$input_tbl).xval(_supply_sum.toComma());

                var _per = $("input[name='per']", el).val();               
                _per = _me.numericCheck(_per, 0);

                var _vsum = $("input[name='supply_sum']", el).val();
                _vsum = _me.numericCheck(_vsum, 0);
                var _icount1= _vsum.replace(/,/gi, "") / _per;

                $("input[name='Resault']", el).val(_icount1.toFixed(1));
                $("input[name='PL']", el).val(_icount1.toFixed(1));

                var _PL_1 = $("input[name='PL_1']", el).val(); //단가
                var FP_9=$("input[name='FP_9']", el).val(); //기타
                var PL_2 = $("input[name='PL_2']", el).val(); //합계
                var PL = $("input[name='PL']", el).val(); //합계1
                //supply_sum

                //var _icount1 = _$type1.xval();
                
                _PL_1 = _PL_1.replace(/,/gi, "");
                FP_9=FP_9.replace(/,/gi, "");
                PL=PL.replace(/,/gi, "");
            //	_icount1 = _icount1.replace(/,/gi, "");
                
                var sum=0;
                
                // 사용량 12 나누기 사용량 km
                //PL = _me.numericCheck(PL, 0);
            // _PL_1=_me.numericCheck(_PL_1, 0);
            // PL_2 = _me.numericCheck(PL_2, 0);

                sum= (parseFloat(PL) * parseInt(_PL_1)) + parseInt(FP_9)
                sum=Math.ceil(sum/10) * 10;
                sum=sum+"";

                _PL_1=parseInt(_PL_1);
                _PL_1=_PL_1+"";
                FP_9=parseInt(FP_9);
                FP_9=FP_9+"";
                
                $("input[name='PL_2']", el).val(sum.toComma()); //합계
                $("input[name='PL_1']", el).val(_PL_1.toComma()); // 단가
                $("input[name='FP_9']", el).val(FP_9.toComma()); // 기타
                //_$type.xval(_icount.toComma());             


            }
            //입력된 값으로 합계 구하는 함수
            , cal_sum_e: function (el) {
                var _me = _$$.aprv_sub197.subdoc;
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);

                var _$input_trs = $("tr", _$input_tbl);
                var _supply_sum = 0;
                $.each(_$input_trs, function (i_index, input_tr) {
                    var _$input_tr = $(input_tr);

                    if ($("input[name='_DISTANCE']", _$input_tr).size() > 0) {
                        var _$isupply = $("input[name='_DISTANCE']", _$input_tr);

                        console.log("val : ", _$isupply.xval());

                        var _isupply = _$isupply.xval();
                        _isupply = _isupply.replace(/,/gi, "");
                        if (_isupply == "") {
                            _isupply = "0";
                        }
                        _$isupply.xval(_isupply.toComma());
                        _supply_sum += parseFloat(_isupply);
                    }
                });
                _supply_sum += "";

                console.log("sum : ", _supply_sum);

                //INPUT Table의 총합계
                $("input[name='PL_3']", _$input_tbl).xval(_supply_sum.toComma());

                var _per = $("input[name='PL_1_1']", el).val();     //kwh단가          
               // _per = _me.numericCheck(_per, 0);

               // var _vsum = $("input[name='supply_sum']", el).val();
              //  _vsum = _me.numericCheck(_vsum, 0);
              
              //  $("input[name='PL']", el).val(_icount1.toFixed(1));

                var _PL_1 = $("input[name='PL_3']", el).val(); //주행거리
                var FP_9=$("input[name='FP_9']", el).val(); //기타
                var PL_2 = $("input[name='FP_9_1']", el).val(); //합계
                var PL = $("input[name='FP_9_2']", el).val(); //기타
                //supply_sum
                PL=PL+""
                $("input[name='FP_9_2']", el).val(PL.toComma())
                //var _icount1 = _$type1.xval();
                
                _PL_1 = _PL_1.replace(/,/gi, "");
                _per=_per.replace(/,/gi, "");
                PL_2=PL_2.replace(/,/gi, "");
                PL=PL.replace(/,/gi, "");
            //	_icount1 = _icount1.replace(/,/gi, "");
                
                var sum=0;
                
                // 사용량 12 나누기 사용량 km
                //PL = _me.numericCheck(PL, 0);
            // _PL_1=_me.numericCheck(_PL_1, 0);
            // PL_2 = _me.numericCheck(PL_2, 0);

                sum= (parseInt(_PL_1) * parseFloat(_per)) / parseFloat(PL_2) +parseInt(PL)
                sum=Math.ceil(sum/10) * 10;
                sum=sum+"";

               // _PL_1=parseInt(_PL_1);
               // _PL_1=_PL_1+"";
               // FP_9=parseInt(FP_9);
               // FP_9=FP_9+"";
                
                $("input[name='PL_2_1']", el).val(sum.toComma()); //합계
               // $("input[name='PL_1']", el).val(_PL_1.toComma()); // 단가
               // $("input[name='FP_9']", el).val(FP_9.toComma()); // 기타
                //_$type.xval(_icount.toComma());             


            }
			, cal_sum1: function (el) {
                var _me = _$$.aprv_sub197.subdoc;
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);

                var _$input_trs = $("tr", _$input_tbl);
                var _supply_sum = 0;
                $.each(_$input_trs, function (i_index, input_tr) {
                    var _$input_tr = $(input_tr);

                    if ($("input[name='_BUN7']", _$input_tr).size() > 0) {
                        var _$isupply = $("input[name='_BUN7']", _$input_tr);

                        console.log("val : ", _$isupply.xval());

                        var _isupply = _$isupply.xval();
                        _isupply = _isupply.replace(/,/gi, "");
                        if (_isupply == "") {
                            _isupply = "0";
                        }
                        _$isupply.xval(_isupply.toComma());
                        _supply_sum += parseFloat(_isupply);
                    }
                });
                _supply_sum += "";

                console.log("sum : ", _supply_sum);

                //INPUT Table의 총합계
                $("input[name='supply_sum_1_1']", _$input_tbl).xval(_supply_sum.toComma());




            }
			, cal_sum2: function (el) {
                var _me = _$$.aprv_sub197.subdoc;
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);

                var _$input_trs = $("tr", _$input_tbl);
                var _supply_sum = 0;
                $.each(_$input_trs, function (i_index, input_tr) {
                    var _$input_tr = $(input_tr);

                    if ($("input[name='_BUN6']", _$input_tr).size() > 0) {
                        var _$isupply = $("input[name='_BUN6']", _$input_tr);

                        console.log("val : ", _$isupply.xval());

                        var _isupply = _$isupply.xval();
                        _isupply = _isupply.replace(/,/gi, "");
                        if (_isupply == "") {
                            _isupply = "0";
                        }
                        _$isupply.xval(_isupply.toComma());
                        _supply_sum += parseFloat(_isupply);
                    }
                });
                _supply_sum += "";

                console.log("sum : ", _supply_sum);

                //INPUT Table의 총합계
                $("input[name='supply_sum_2']", _$input_tbl).xval(_supply_sum.toComma());

            }
			, cal_sum3: function (el , tr) {                                
                var _me = _$$.aprv_sub197.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                
                
				var _$isupply = $("input[name='_NO']", _$input_trs);
				
				$.each(_$isupply, function(idx, o){
					//var _val=0;
                    
                    
					
                    $(o).xval(idx);
					//$("input[name='ccnt']").val(idx)
                    
					
                });
				//alert($("input[name='ccnt']").val())
                 
                

				

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
                var _me = _$$.aprv_sub197.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

                var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element).xtable("instance");

                    //밸리데이션 체크
                    if ($("input[name='CarNo']",$doc.element).val() == "") {
                                        
                            //  차량no 입력하세요.
                            $fn.alert({msg : $fn.getCodeMsg("aprv_sub_197.msg.a1")});    //사유
                        
                        return false;
                    }else if($("input[name='OrgPreDate']",$doc.element).val() == "" || $("input[name='OrgPostDate']",el).val() == ""){
                            //  운행기간 입력하세요.
                            $fn.alert({msg : $fn.getCodeMsg("aprv_sub_197.msg.a2")});    //사유

                            return false;
                    }
            

                //필수입력 체크
                var _isvalid = true;
               // if (!_$table.validate()) {
                   // _isvalid = false;
                    //return false;
               // }
                if($('[name=ed_attachkind] option:selected',$doc.element).val() == "A" || $('[name=ed_attachkind] option:selected',$doc.element).val() == "B"){


                
                    if($("input[name='PL_1']",$doc.element).val() == "0" ){
                        //  단가를 입력하세요.
                        $("input[name='PL_1']",$doc.element).focus();
                        $fn.alert({msg : $fn.getCodeMsg("aprv_sub_197.msg.a3")});    //사유
                    
                            return false;
                    }
             }
                // $fn.validate($el) {
                //     _isvalid = false;
                //     return false;
                // }
                // if (!$fn.validate($("table[name='subform197_body']"))) {
                //     _isvalid = false;
                //     return false;
                // }



                $("input[name=fld_formdata]", $doc.element).val(_$table.getData());

                
                if (_opt.isnew) {
                    var startday=$("input[name=OrgPreDate]", $doc.element).val();  //운행시작기간
                    var finishday=$("input[name=OrgPostDate]", $doc.element).val(); //운행종료기간

                   
                    var _info1 = $dwp.cns("core.info");
                    var vdocname=_info1.cuser.pinfo.name;

                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(_opt.appCfg.sFormTitle, ",", "ko") 
                    +" ( " + $fn.getCurLangMsg(vdocname, ",", "ko") +" "+ startday + " ~ " + finishday +" ) "
                    
                    );
                }

                console.log("197 save : ", _isvalid);
                return _isvalid;
            }
        }
    }
}($dwp.cns("app"), jQuery));






