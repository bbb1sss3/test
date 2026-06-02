/**
 * 전자결재 보조양식 - 출장품의서
 * $dwp.app.aprv_sub070
 */

(function (_$$, $) {
    _$$.aprv_sub070 = {
        subdoc: {
            SUBNAME: "sub070"
            , init: function ($doc) {
                var _me = _$$.aprv_sub070.subdoc, opt = $doc.options;
                var el = $doc.element;
               // var _$table01 = $("table[name=sub070_Table01]", $doc.element);
				//var _$table1 = $("table[name=sub070_Table02]", $doc.element);
                var _isedit = opt.isedit;
                //결재 중간에 편집시에는 지출결의서 영역 편집 불가
                if (opt.isedit == true && opt.docstatus != "draft") {
                    _isedit = false;
                }
                var _opt = $.extend({}, opt, { isedit: _isedit });

             
                if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko"));
                }

                var _$fromdate = $("input[name='H_3_1']");
				_$fromdate.bind("change" , function(){
					_dateTerm("1");
				} );	
				var _$todate = $("input[name='H_4_1']");
				_$todate.bind("change" , function(){
					_dateTerm("1");
				} );

                var _$fromdate = $("input[name='X_3']");
				_$fromdate.bind("change" , function(){
					_dateTerm("2");
				} );	
				var _$todate = $("input[name='X_4']");
				_$todate.bind("change" , function(){
					_dateTerm("2");
				} );

	            console.log("테이블 Init 호출전");

                var _$table = _me.initInputTable(_opt, $doc, "");
				var _$table01 = _me.initInputTable01(_opt, $doc, "");
	            console.log("테이블 Init 호출후");

                var _newopt = $.extend({}, _opt, { dtable: _$table });
				 var _newopt = $.extend({}, _opt, { dtable: _$table01 });
                $doc.options = _newopt;
				
                $("[name=del]",el).on("click", function () {
                    $("[name=H_3_1]",el).val("");
                    $("[name=H_4_1]",el).val("");
                    $("[name=H_3]",el).val("");
                    $("[name=H_4]",el).val("");
                    $("[name=H_5]",el).val("");
                    $("[name=H_6]",el).val("");						
                });	
            
                $("[name=del2]",el).on("click", function () {
                    $("[name=X_3]",el).val("");
                    $("[name=X_4]",el).val("");
                    $("[name=X_5]",el).val("");
                    $("[name=X_6]",el).val("");
                });	
						
					
                //몇박 몇일을 계산하는 루틴.....
                function _dateTerm( aType) {
                    if (aType == "1") {
                        vSDate = $("input[name='H_3_1']").val();
                        vEDate = $("input[name='H_4_1']").val();
                    } else {
                        vSDate = $("input[name='X_3']").val();
                        vEDate = $("input[name='X_4']").val();
                    }
                    
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
                    
                    if (aType == "1") {
                        $("input[name='H_6']", $doc.element).xval(vStr);
                        $("input[name='H_5']", $doc.element).xval(vStr-1);
                    } else {
                        $("input[name='X_6']", $doc.element).xval(vStr);
                        $("input[name='X_5']", $doc.element).xval(vStr-1);
                    }
                    
                    //document.forms[0].AppDayC.value = vStr ;
                    //document.forms[0].AppNightC.value = vStr -1;
                    //return vStr;
                }		
            }

            //지출결의서 비용관련 예산 표시 테이블 - 초기화
            , initInputTable: function (_opt, $doc) {
                var _me = _$$.aprv_sub070.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata]", $doc.element).val();

                var _$table = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table01']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal
                    , template: "[name=_template]"
                    , keyfield: ""
					, maxrow:10
                    , changeafter: function (act, tr, inst) {
                        if (act == "del") {
                           // _me.cal_sum(el);										//삭제시 합계 재계산
							 //_me.cal_sum1(el);										//삭제시 합계 재계산
							 // _me.cal_sum2(el);										//삭제시 합계 재계산
							 //  _me.cal_sum3(el);
                        } else if (act == "add") {
                            //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                        } else if (act == "copy") {
                          //  _me.cal_sum(el); 									//행 복사시 합계 재계산
							// _me.cal_sum1(el); 									//행 복사시 합계 재계산
							 //_me.cal_sum2(el); 									//행 복사시 합계 재계산
							 // _me.cal_sum3(el);
                        }
                    }
                    , cell: [
						 {
                            nm: "hpdate", type: "date", vfnm: "_PDATE", validator: /[^\s]/, label: "aprv_sub_070.title.a13"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) { 
                                  var _$type = $("input[name='_PDATE']", $cell);
								  var _$ideptinfo = $("input[name='_PDATE_INFO']", $cell);	
								
                                    _$type.xval(val);
                                } else {
									//$("div", $cell).text(val);
									 if (typeof val == "undefined") return ;
                                    
									$cell.html("<div class='dwp-center'>" + val + "</div>");
									
                                    //$cell.html("<div class='dwp-center'>" + _info[0]+_info[1]+_info[2] + "</div>");
                                }
                            } 
                        },
                        {
                            nm: "goout", type: "custom", vfnm: "_goout", css: "dwp-left", validator: /[^\s]/, label: "aprv_sub_070.title.a8"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$input = $("input[name='_goout']", $cell);
                                    _$input.xval(val);
                                } else {
                                    if (typeof val == "undefined") return;
                                     
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "trans", type: "custom", vfnm: "_trans",  label: "aprv_sub_070.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_trans']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "juyo", type: "custom", vfnm: "_juyo",  label: "aprv_sub_070.title.a11"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_juyo']", $cell);
                                    _$type.xval(val);

                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "sleep", type: "custom", vfnm: "_sleep", label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_sleep']", $cell);
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
                }
                return _$table;
            }
			, initInputTable01: function (_opt, $doc) {
                var _me = _$$.aprv_sub070.subdoc;
                var el = $doc.elelment;
                var _tableVal1 = $("input[name=fld_formdata_1]", $doc.element).val();

                var _$table1 = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table03']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal1
                    , template: "[name=_template]"
                    , keyfield: ""
					, maxrow:10
                    , changeafter: function (act, tr, inst) {
                        if (act == "del") {
                            _me.cal_sum(el);										//삭제시 합계 재계산
							 //_me.cal_sum1(el);										//삭제시 합계 재계산
							 // _me.cal_sum2(el);										//삭제시 합계 재계산
							 //  _me.cal_sum3(el);
                        } else if (act == "add") {
                            //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                        } else if (act == "copy") {
                            _me.cal_sum(el); 									//행 복사시 합계 재계산
							// _me.cal_sum1(el); 									//행 복사시 합계 재계산
							 //_me.cal_sum2(el); 									//행 복사시 합계 재계산
							 // _me.cal_sum3(el);
                        }
                    }
                    , cell: [
					
                        {
                            nm: "team", type: "custom", vfnm: "_team", css: "dwp-left", validator: /[^\s]/, label: "aprv_sub_070.title.a8"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$input = $("input[name='_team']", $cell);
                                    _$input.xval(val);
                                } else {
                                    if (typeof val == "undefined") return;
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }
						,
                        {
                            nm: "jikwe", type: "custom", vfnm: "_jikwe", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_jikwe']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }
						,
                        {
                            nm: "name", type: "custom", vfnm: "_name", validator: /[^\s]/, label: "aprv_sub_070.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_name']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }
							,
                        {
                            nm: "sabun1", type: "custom", vfnm: "_sabun1", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    
                                    var _$idept = $("input[name='_sabun1']", $cell);							        			
                                    var _$ideptinfo = $("input[name='_sabun1_INFO']", $cell);							        			

                                    if (_$ideptinfo.xval() != "") {
                                        var _info = _$ideptinfo.xval();
                                        var _info = _info.split("¶");							        		
                                        _$idept.xval(_info[1]+"_"+_info[2]);							        			
                                    }    
                                    _$idept.off("click").on("click", function(){
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
                                        var _customerDB = _me.PAMT_DB;
                                       
                                        var _form = "w_pop_dept";
                                        
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("사용자"),                                            
                                            width: 1100,
                                            height: 800,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/common_data30.lang.js",
                                            content : {
                                                html : "", 
                                            //	url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                               url: "/dwp/com/work/elpisuser.nsf" + "/wFrmView_pop?ReadForm&view=eluserview2"
											//		, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });    
                                    });
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");	
                                }
                            }
                        },						
                        {
                            nm: "sleeppay1", type: "custom", vfnm: "_sleeppay1", validator: /[^\s]/, label: "aprv_sub_070.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_sleeppay1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },						
                        {
                            nm: "daypay1", type: "custom", vfnm: "_daypay1", validator: /[^\s]/, label: "aprv_sub_070.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_daypay1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },						
                        {
                            nm: "transpay1", type: "custom", vfnm: "_transpay1", validator: /[^\s]/, label: "aprv_sub_070.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_transpay1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },						
                        {
                            nm: "etc1", type: "custom", vfnm: "_etc1", validator: /[^\s]/, label: "aprv_sub_070.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_etc1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }                        
						,
                        {
                            nm: "danwe", type: "custom", vfnm: "_danwe", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='_danwe']", $cell);
                                    _$type.xval(val);
									_$type.on("change", function () {
										 _me.cal_sum(el);
										
									});
                                } else {
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0105", val) + "</div>");
                                }
                            }
                        },
						
                        {
                            nm: "sum2", type: "custom", vfnm: "_sum2", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_sum2']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        }
						,
                        {
                            nm: "paygubun", type: "custom", vfnm: "_paygubun", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_paygubun']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0106", val) + "</div>");
                                }
                            }
                        },
                        {
                            nm: "sum1", type: "custom", vfnm: "_sum1", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_sum1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        }
						,
						{
                            nm: "sleeppay", type: "custom", vfnm: "_sleeppay", validator: /[^\s]/, label: "aprv_sub_070.title.a11"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_sleeppay']", $cell);
									var _$type1 = $("input[name='_sleeppay1']", $tr);
                                    _$type.xval(val);
									
									
									
									_$type.on("blur", function () {
										var daypay=_me.uncomma($("[name='_daypay']",$tr).val());	
                                        var sleeppay = _me.uncomma($("[name='_sleeppay']", $tr).val());
                                        var transpay = _me.uncomma($("[name='_transpay']", $tr).val());
									
                                        var etc = _me.uncomma($("[name='_etc']", $tr).val());

                                        var sum1 = 0;
                                        var sum1 = parseInt(daypay) + parseInt(sleeppay) + parseInt(transpay) + parseInt(etc);
                                        var _$sum2 = $("[name='_sum2']", $tr);
									   _$sum2.xval(sum1);
										sum1 = _me.comma(sum1);
										
										_$type1.xval(parseInt(sleeppay));
										var sleep=_me.comma(sleeppay);
										_$type.xval(sleep);
                                        var _$sum1 = $("[name='_sum1']", $tr);
                                        _$sum1.xval(sum1);
										 _me.cal_sum(el);
                                    });
									
									
							_$type.off("click").on("click", function(){
								var outgubun = $("Select[name='H_9']", $doc.element).val();
								var outday =$("[name='H_6']",$doc.element).val();
								
									if(outgubun=="국내"){
										
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("국내출장"),                                            
                                            width: 1100,
                                            height: 400,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/common_data30.lang.js",
                                            content : {
                                                html : "", 
                                            //	url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                               url: "/dwp/aprv/com/comm_code.nsf/korea?openpage"
											//		, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });  
										}else{ //해외
										 var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("해외출장"),                                            
                                            width: 1100,
                                            height: 450,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/common_data30.lang.js",
                                            content : {
                                                html : "", 
                                            //	url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                               url: "/dwp/aprv/com/comm_code.nsf/aborad?openpage"
											//		, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });


									}
								 });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "daypay", type: "custom", vfnm: "_daypay", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_daypay']", $cell);
                                    _$type.xval(val);
									
                                    _$type.off("click").on("click", function(){
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }   

										var outgubun = $("Select[name='H_9']", $doc.element).val();
										var outday =$("[name='H_6']",$doc.element).val();
										    if (outday == "") {

										        $fn.alert({ //aprv_sub_103.title.a36
										            msg: $fn.getCodeMsg("출장기간을 입력하세요.")
										        });
												$("[name='H_5']",$doc.element).focus()
										        return false;
										    }
										
									if(outgubun=="국내"){
										
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("일비"),                                            
                                            width: 1100,
                                            height: 800,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/common_data30.lang.js",
                                            content : {
                                                html : "", 
                                            //	url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                               url: "/dwp/aprv/com/comm_code.nsf" + "/wFrmViewJ11?ReadForm&view=wv05_pop"
											//		, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                _me.cal_sum(el);
                                            }
                                        });  
										}else{ //해외
										 var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("일비"),                                            
                                            width: 1100,
                                            height: 800,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/common_data30.lang.js",
                                            content : {
                                                html : "", 
                                            //	url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                               url: "/dwp/aprv/com/comm_code.nsf" + "/wFrmViewJ112?ReadForm&view=wv06_pop"
											//		, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                _me.cal_sum(el);
                                            }
                                        });


									}
									
                                   });
									
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        }
						,
                        {
                            nm: "transpay", type: "custom", vfnm: "_transpay", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_transpay']", $cell);
									var _$type1 = $("input[name='_transpay1']", $tr);
                                    _$type.xval(val);
									
									_$type.on("blur", function () {
										var daypay=_me.uncomma($("[name='_daypay']",$tr).val());	
                                        var sleeppay = _me.uncomma($("[name='_sleeppay']", $tr).val());
                                        var transpay = _me.uncomma($("[name='_transpay']", $tr).val());
                                        var etc = _me.uncomma($("[name='_etc']", $tr).val());

                                        var sum1 = 0;
                                        var sum1 = parseInt(daypay) + parseInt(sleeppay) + parseInt(transpay) + parseInt(etc);
                                       _$type1.xval(parseInt(transpay));
									    var _$sum2 = $("[name='_sum2']", $tr);
									   _$sum2.xval(sum1);
									   sum1 = _me.comma(sum1);
										var sleep=_me.comma(transpay);
										_$type.xval(sleep);
                                        var _$sum1 = $("[name='_sum1']", $tr);
                                        _$sum1.xval(sum1);
										 _me.cal_sum(el);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        }
						,
                        {
                            nm: "etc", type: "custom", vfnm: "_etc", validator: /[^\s]/, label: "aprv_sub_070.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_etc']", $cell);
									var _$type1 = $("input[name='_etc1']", $tr);
                                    _$type.xval(val);
									_$type.on("blur", function () {
										var daypay=_me.uncomma($("[name='_daypay']",$tr).val());	
                                        var sleeppay = _me.uncomma($("[name='_sleeppay']", $tr).val());
                                        var transpay = _me.uncomma($("[name='_transpay']", $tr).val());
                                        var etc = _me.uncomma($("[name='_etc']", $tr).val());

                                        var sum1 = 0;
                                        var sum1 = parseInt(daypay) + parseInt(sleeppay) + parseInt(transpay) + parseInt(etc);
                                       _$type1.xval(parseInt(etc));
									   var _$sum2 = $("[name='_sum2']", $tr);
									   _$sum2.xval(sum1);
									   sum1 = _me.comma(sum1);
										var sleep=_me.comma(etc);
										_$type.xval(sleep);
                                        var _$sum1 = $("[name='_sum1']", $tr);
                                        _$sum1.xval(sum1);
										 _me.cal_sum(el);
                                    });
                                } else {
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
                return _$table1;
            }
            //입력된 값으로 합계 구하는 함수
            , cal_sum: function (el) {
                var _me = _$$.aprv_sub070.subdoc;
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table03]", el);

                var _$input_trs = $("tr", _$input_tbl);
                var _supply_won = 0;
				var _supply_yen = 0;
				var _supply_us = 0;
				var _supply_cana = 0;
				var _supply_euro = 0;
				var _supply_dkk = 0;
				var _supply_bhh = 0;
				var _supply_cny = 0;
				
                $.each(_$input_trs, function (i_index, input_tr) {
                    var _$input_tr = $(input_tr);

                    if ($("input[name='_sum1']", _$input_tr).size() > 0) {
                        var _$isupply = $("input[name='_sum1']", _$input_tr);
						
						var danwe=$("select[name='_danwe']", _$input_tr).val();
						
						if (danwe == "WON") {
						    var _isupply = _$isupply.xval();

						    _isupply = _isupply.replace(/,/gi, "");
						    if (_isupply == "") {
						        _isupply = "0";
						    }
						    _$isupply.xval(_isupply.toComma());
						    _supply_won += parseFloat(_isupply);
							//$("input[name='won']", el).val(_supply_won)

						}else if (danwe == "YEN") {
						    var _isupply = _$isupply.xval();

						    _isupply = _isupply.replace(/,/gi, "");
						    if (_isupply == "") {
						        _isupply = "0";
						    }
						    _$isupply.xval(_isupply.toComma());
						    _supply_yen += parseFloat(_isupply);
							//$("input[name='japan']", el).val(_supply_yen)
						}else if (danwe == "USD") {
						    var _isupply = _$isupply.xval();

						    _isupply = _isupply.replace(/,/gi, "");
						    if (_isupply == "") {
						        _isupply = "0";
						    }
						    _$isupply.xval(_isupply.toComma());
						    _supply_us += parseFloat(_isupply);
							//$("input[name='us']", el).val(_supply_us)
						}else if (danwe == "CAD") {
						    var _isupply = _$isupply.xval();

						    _isupply = _isupply.replace(/,/gi, "");
						    if (_isupply == "") {
						        _isupply = "0";
						    }
						    _$isupply.xval(_isupply.toComma());
						    _supply_cana += parseFloat(_isupply);
							//$("input[name='canada']", el).val(_supply_cana)
						}else if (danwe == "EUR") {
						    var _isupply = _$isupply.xval();

						    _isupply = _isupply.replace(/,/gi, "");
						    if (_isupply == "") {
						        _isupply = "0";
						    }
						    _$isupply.xval(_isupply.toComma());
						    _supply_euro += parseFloat(_isupply);
							//$("input[name='euro']", el).val(_supply_euro)
						}else if (danwe == "DKK") {
						    var _isupply = _$isupply.xval();

						    _isupply = _isupply.replace(/,/gi, "");
						    if (_isupply == "") {
						        _isupply = "0";
						    }
						    _$isupply.xval(_isupply.toComma());
						    _supply_dkk += parseFloat(_isupply);
							//$("input[name='dkk']", el).val(_supply_dkk)
						}else if (danwe == "BTH") {
						    var _isupply = _$isupply.xval();

						    _isupply = _isupply.replace(/,/gi, "");
						    if (_isupply == "") {
						        _isupply = "0";
						    }
						    _$isupply.xval(_isupply.toComma());
						    _supply_bhh += parseFloat(_isupply);
							//$("input[name='bth']", el).val(_supply_bhh)
						}else if (danwe == "CNY") {
						    var _isupply = _$isupply.xval();

						    _isupply = _isupply.replace(/,/gi, "");
						    if (_isupply == "") {
						        _isupply = "0";
						    }
						    _$isupply.xval(_isupply.toComma());
						    _supply_cny += parseFloat(_isupply);
							//$("input[name='cny']", el).val(_supply_cny)
						}
                      
						
						
						
                    }
					
					
					
					
                });
				
                //_supply_sum += "";
				_supply_won +="";
				_supply_yen += "";
				_supply_us += "";
				_supply_cana += "";
				_supply_euro += "";
				_supply_dkk += "";
				_supply_bhh += "";
				 _supply_cny += "";
              

				 $("input[name='won']", el).val(_supply_won.toComma());
				 $("input[name='japan']", el).val(_supply_yen.toComma());
				  $("input[name='us']", el).val(_supply_us.toComma());
				   $("input[name='canada']", el).val(_supply_cana.toComma());
				    $("input[name='euro']", el).val(_supply_euro.toComma());
					 $("input[name='dkk']", el).val(_supply_dkk.toComma());
					  $("input[name='bth']", el).val(_supply_bhh.toComma());
					  $("input[name='cny']", el).val(_supply_cny.toComma());
            }
			, cal_sum1: function (el) {
                var _me = _$$.aprv_sub070.subdoc;
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
                var _me = _$$.aprv_sub070.subdoc;
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
                var _me = _$$.aprv_sub070.subdoc;
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
			,
			//콤마찍기
			comma : function (str) {
			    str = String(str);
			    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
			}
			,
			//콤마풀기
			uncomma: function (str) {
			    str = String(str);
			    return str.replace(/[^\d]+/g, '');
			}
			

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                var _me = _$$.aprv_sub070.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

                var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element).xtable("instance");
				 var _$table01 = $("table[name=" + _me.SUBNAME + "_Table03]", $doc.element).xtable("instance");
				var startdate=$("[name=H_3_1]", $doc.element).val();
				var enddate=$("[name=H_4_1]", $doc.element).val();

                //****************************************************//
                //				임시저장인 경우  Validate 체크를 제외
                //				 - 2017.11.20 by dwlee
                //****************************************************//
                if (_aopt.actiontype == "draft") {
                    $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
					$("input[name=fld_formdata_1]", $doc.element).val(_$table01.getData(false));
					
					startdate=startdate.replace(".","")
				startdate=startdate.replace(".","")
				enddate=enddate.replace(".","")
				enddate=enddate.replace(".","")
				$("[name=H_3]", $doc.element).val(startdate)
				$("[name=H_4]", $doc.element).val(enddate)
                    return true;
                }
				
				
				
				startdate=startdate.replace(".","")
				startdate=startdate.replace(".","")
				enddate=enddate.replace(".","")
				enddate=enddate.replace(".","")
				$("[name=H_3]", $doc.element).val(startdate)
				$("[name=H_4]", $doc.element).val(enddate)
				

                //필수입력 체크
                var _isvalid = true;
                if (!_$table.validate()) {
                    _isvalid = false;
                    return false;
                }
				 if (!_$table01.validate()) {
                    _isvalid = false;
                    return false;
                }
				//alert($("input[name=refdocs]", $doc.element).val());
                //return false;
                // $fn.validate($el) {
                //     _isvalid = false;
                //     return false;
                // }
                // if (!$fn.validate($("table[name='subform122_body']"))) {
                //     _isvalid = false;
                //     return false;
                // }
				
				
				
                $("input[name=fld_formdata]", $doc.element).val(_$table.getData());
				$("input[name=fld_formdata_1]", $doc.element).val(_$table01.getData());
                console.log("122 save : ", _isvalid);
                return _isvalid;
            }
        }
    }
}($dwp.cns("app"), jQuery));









