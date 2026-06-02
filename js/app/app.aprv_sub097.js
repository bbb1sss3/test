/* Source File Upload Time : 3-10-20 9:18:38 AM*/


/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 식권요청서
 * $dwp.app.aprv_sub097
 */

(function (_$$, $) {
    _$$.aprv_sub097 = {
        subdoc: {
            SUBNAME: "sub097"
            , init: function ($doc) {
                var _me = _$$.aprv_sub097.subdoc, opt = $doc.options;
                var el = $doc.element;
                var _$table01 = $("table[name=sub097_Table01]", $doc.element);

                var _isedit = opt.isedit;
                //결재 중간에 편집시에는 지출결의서 영역 편집 불가
                if (opt.isedit == true && opt.docstatus != "draft") {
                    _isedit = false;
                }
                var _opt = $.extend({}, opt, { isedit: _isedit });
	
		
	 var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;    //1월이 0으로 되기때문에 +1을 함.
    var date = now.getDate();  

    if((month + "").length < 2){        //2자리가 아니면 0을 붙여줌.
        month = "0" + month;
    }else{
         // ""을 빼면 year + month (숫자+숫자) 됨.. ex) 2018 + 12 = 2030이 리턴됨.
        month = "" + month;   
    }
    today = year +"-"+ month +"-"+ date; 

             
                if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko") +"  "+"(" +today+")" );
                }

              //  var _$table = _me.initInputTable(_opt, $doc, "");
               // var _newopt = $.extend({}, _opt, { dtable: _$table });
               // $doc.options = _newopt;
            }

           

            //입력된 값으로 합계 구하는 함수
            , cal_sum: function (el) {
                var _me = _$$.aprv_sub097.subdoc;
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);

                var _$input_trs = $("tr", _$input_tbl);
                var _supply_sum = 0;
                $.each(_$input_trs, function (i_index, input_tr) {
                    var _$input_tr = $(input_tr);

                    if ($("input[name='_BUN1']", _$input_tr).size() > 0) {
                        var _$isupply = $("input[name='_BUN1']", _$input_tr);

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

            }
			, cal_sum1: function (el) {
                var _me = _$$.aprv_sub097.subdoc;
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
                var _me = _$$.aprv_sub097.subdoc;
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
                var _me = _$$.aprv_sub097.subdoc;
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
                var _me = _$$.aprv_sub097.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);


                //필수입력 체크
                var _isvalid = true;
                
                console.log("097 save : ", _isvalid);
                return _isvalid;
            }
        }
    }
}($dwp.cns("app"), jQuery));



