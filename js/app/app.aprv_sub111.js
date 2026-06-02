/**
 * 전자결재 보조양식 추가/취소  SAMPLE 제작의뢰서
 * $dwp.app.aprv_subxxx.subdoc
 */
(function (_$$, $) {
    _$$.aprv_sub111 = {
        /*
         * 양식 로딩시 호출 함수
         * @param   {Object}    $doc        Doc 
         */
        load: function ($doc) {
            var _me = _$$.aprv_sub111;
            var _opt = $doc.options;

            //            $fn.orgsel($("[name='org1']", $doc.element), { isedit: _opt.isedit, treetype: "0", seltype: "2", fld: "tagetUserName", count: 1 });

            if (_opt.isnew) {
                $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(_opt.appCfg.sFormTitle, ",", $dwp.core.lang.getUserLang()));
                var _pinfo = $fn.getCurUser().pinfo;
				console.log(_pinfo)
                $("[name=ed_ReqEmpno]", $doc.element).val(_pinfo.rempno)

            }
            /*

            $fn.xAjax({
                url: $fn.getProxyUrl('/dwp/com/erp/mismain.nsf/agCallRFCOrderNo?OpenAgent'),
                method: 'GET',
                dataType: 'html',
                async: false,
                cache: false
            }).done(function (data) {
                console.log("처리", data);
                var arrMatchString = data.match(/<!-- Result set start -->[\s\S]*?<!-- Result set end -->/i);
                if (arrMatchString == null) return false;
                var jsonString = arrMatchString[0].replace(/<!-- Result set start -->/i, "").replace(/<!-- Result set end -->/i, "");

                if (jsonString == "") {
                    return false;
                }
                else {
                    jsonString = "[" + jsonString + "]";
                    jsonResultSet = JSON.parse(jsonString);
                    var jsonResult;
                    if (jsonResultSet.length == 0) return false;

                    jsonResult = jsonResultSet[0];

                    var htmlString = "";
                    var aOpt = [];

                    aOpt.push('<option value="">선택</option>');

                    for (var i = 0; i < jsonResult.dataSet.length; i++) {
                        var o = jsonResult.dataSet[i];



                        if (o["CONTROLLING_AREA"] == "1000" && o["ORDER_TYPE"] == "RD01") {
                            if (o["STAT"].indexOf("I0045") < 0 && o["STAT"].indexOf("I0046") < 0) {
                                aOpt.push('<option value="' + o['ORDER'] + '">' + o['ORDER_NAME'] + '</option>');
                            }
                        }
                    }

                    $("select[name='ed_OrderName']").append(aOpt.join(''));


                    var vValue = $("input[name=ed_Order]").val();

                    if (vValue != "") {
                        $("select[name='ed_OrderName']").val(vValue);
                    }
                }

            }).fail(function (req, error) {
                console.log(req.responseText + '\n' + error);
            });

            //OrderNo번호 불러오기
            function fAF111_CostCenter(vSelValue) {
                //var param = "&FormKey=" + vFormKey;

                //var tgUrl = "/"+vDBPath+"/agCallRFCOrderNo?OpenAgent" + param;
                var tgUrl = "/" + vDirPath + "/erp/mismain.nsf/agCallRFCCostCenter?OpenAgent";

                $fn.xAjax({
                    url: $fn.getProxyUrl('/dwp/com/erp/mismain.nsf/agCallRFCOrderNo?OpenAgent'),
                    method: 'GET',
                    dataType: 'html',
                    async: false,
                    cache: false
                }).done(function (data) {
                    var arrMatchString = data.match(/<!-- Result set start -->[\s\S]*?<!-- Result set end -->/i);
                    if (arrMatchString == null) return false;
                    var jsonString = arrMatchString[0].replace(/<!-- Result set start -->/i, "").replace(/<!-- Result set end -->/i, "");

                    if (jsonString == "") {
                        return false;
                    }
                    else {
                        jsonString = "[" + jsonString + "]";
                        jsonResultSet = JSON.parse(jsonString);
                        var jsonResult;
                        if (jsonResultSet.length == 0) return false;

                        jsonResult = jsonResultSet[0];

                        var htmlString = "";
                        var aOpt = [];


                        $("select[name='ed_CostCenter'] option").remove();
                        $("input[name=ed_CostCenterCode]").val("");



                        aOpt.push('<option value="">선택</option>');

                        for (var i = 0; i < jsonResult.dataSet.length; i++) {
                            var o = jsonResult.dataSet[i];


                            if (vSelValue == "901" || vSelValue == "N/A") {

                                if (!isNaN(parseFloat(o["COSTCENTER"])) && o["SETNAME"] == "KB1") {

                                    if (parseFloat(o["COSTCENTER"]) < 600000) aOpt.push('<option value="' + parseFloat(o["COSTCENTER"]) + '">' + o["COCNTR_TXT"] + '</option>');

                                }

                            } else if (vSelValue == "903") {

                                if (!isNaN(parseFloat(o["COSTCENTER"])) && o["SETNAME"] == "KB2") {

                                    if (parseFloat(o["COSTCENTER"]) >= 66666) aOpt.push('<option value="' + parseFloat(o["COSTCENTER"]) + '">' + o["COCNTR_TXT"] + '</option>');
                                }

                            }

                        }

                        $("select[name='ed_CostCenter']").append(aOpt.join(''));


                    }

                }).fail(function (req, error) {
                    console.log(req.responseText + '\n' + error);
                });



            }

        */
            var _$table = _me.initDataTable(_opt, $doc);
        }

        //입력된 지출결의 내용을 표시하는 테이블 - 초기화
        , initDataTable: function (_opt, $doc) {
            var _me = _$$.aprv_sub111;
            var el = $doc.elelment;
            if ($("input[name=fld_formdata]", $doc.element).size() == 0) {
                return;
            }

            var _formdata = $("input[name=fld_formdata]", $doc.element).val();

            var _$table = $dwp.ui.table.init($("table[name='sub111_Table']", $doc.element), {
                isedit: _opt.isedit
                , initdata: _formdata
                , template: "[name=_template]"
                , drawall: true
                , changeafter: function (act, tr, inst) {
                    if (act == "del") {
                        _me.cal_sum3(el)
                        //                        _me.cal_num(el);                                    //합계
                    }
                    if (_opt.isedit) {
                        if (act == "add") {
                            
                            _me.cal_sum3(el)
                        } else if (act == "copy") {
                            //                            _me.cal_num(el);                                    //합계
                        }
                    }
                }
                , cell: [

                    {
                        nm: "no", type: "custom", vfnm: "_NO", validator: /[^\s]/, label: "No"
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {

                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-left'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                            return "<div class='dwp-center'>" + val + "</div>";
                        }
                    }
                    , {
                        nm: "car", type: "custom", vfnm: "_CAR", validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_111.title.a12")
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {

                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-left'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                            return "<div class='dwp-left'>" + val + "</div>";
                        }
                    }


                    , {
                        nm: "fumno", type: "custom", vfnm: "_FUMNO", validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_111.title.a13")
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {

                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-left'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                            return "<div class='dwp-left'>" + val + "</div>";
                        }
                    }

                    , {
                        nm: "fumname", type: "custom", vfnm: "_FUMNAME", validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_111.title.a14")
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {



                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-left'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                            return "<div class='dwp-left'>" + val + "</div>";
                        }
                    }


                    , {
                        nm: "cnt", type: "custom", vfnm: "_CNT"
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {

                                var _$price = $("input[name='_CNT']", $cell);

                                _$price.on("focus", function () {
                                    this.select(); 
                                });


                                _$price.on("keyup", function () {

                                    var _val = $(this).xval();

                                    _val = _val.replace(/[^\d]+/g, "");


                                    var reDigit = /[^0-9]/;
                                    Re = reDigit.test(_val);

                                    if (Re) {
                                        $fn.alert({ msg: "숫자만 입력가능합니다." });
                                        $(this).val("");
                                    } else {
                                        $(this).xval(_val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                                    }
                                });


                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-right dwp-bold'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                            return "<div class='dwp-right dwp-bold'>" + val + "</div>";
                        }
                    }
                    , {
                        nm: "cnt1", type: "custom", vfnm: "_CNT1"
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {

                                var _$price = $("input[name='_CNT1']", $cell);

                                _$price.on("focus", function () {
                                    this.select(); 
                                });


                                _$price.on("keyup", function () {

                                    var _val = $(this).xval();

                                    _val = _val.replace(/[^\d]+/g, "");


                                    var reDigit = /[^0-9]/;
                                    Re = reDigit.test(_val);

                                    if (Re) {
                                        $fn.alert({ msg: "숫자만 입력가능합니다." });
                                        $(this).val("");
                                    } else {
                                        $(this).xval(_val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                                    }
                                });


                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-right dwp-bold'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                            return "<div class='dwp-right dwp-bold'>" + val + "</div>";
                        }
                    }
                    , {
                        nm: "won", type: "custom", vfnm: "_WON"
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {


                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-right dwp-bold'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                         
                            return "<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0005", val)+ "</div>";
                        }
                    }
                    , {
                        nm: "cnt2", type: "custom", vfnm: "_CNT2"
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {

                                var _$price = $("input[name='_CNT2']", $cell);

                                _$price.on("focus", function () {
                                    this.select(); 
                                });


                                _$price.on("keyup", function () {

                                    var _val = $(this).xval();

                                    _val = _val.replace(/[^\d]+/g, "");


                                    var reDigit = /[^0-9]/;
                                    Re = reDigit.test(_val);

                                    if (Re) {
                                        $fn.alert({ msg: "숫자만 입력가능합니다." });
                                        $(this).val("");
                                    } else {
                                        $(this).xval(_val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                                    }
                                });


                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-right dwp-bold'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                            return "<div class='dwp-right dwp-bold'>" + val + "</div>";
                        }
                    }
                    , {
                        nm: "bigo", type: "custom", vfnm: "_BIGO"
                        , drawfn: function (val, $cell, $tr, inst) {
                            if (inst.options.isedit) {

                            } else {
                                if (typeof val == "undefined") return;
                                $cell.html("<div class='dwp-left'>" + val + "</div>");
                            }
                        }
                        , drawfn_html: function (val, inst) {
                            if (typeof val == "undefined") return "";
                            return "<div class='dwp-left'>" + val + "</div>";
                        }
                    }

                ]
            });

            console.log("add - pre");
            //첫행을 자동 생성
            if (_opt.isedit == true && _formdata == "") {
                _$table.add();
                _$table.add();
                _$table.add();
                _$table.add();
                _$table.add();
            }
            console.log("add - after");
            return _$table;
        }

        , cal_sum3: function (el, tr) {
            var _me = _$$.aprv_sub111;
            //alert( _me.SUBNAME)
            var _$input_tbl = $("table[name=sub111_Table]", el);


            var _$input_trs = $("tr", _$input_tbl);


            var _$isupply = $("input[name='_NO']", _$input_trs);

            $.each(_$isupply, function (idx, o) {
                //var _val=0;



                $(o).xval(idx);
                //$("input[name='ccnt']").val(idx)


            });
            //alert($("input[name='ccnt']").val())





        }

        /*
         * 양식 저장시 호출 함수
         * @param   {Object}    $doc        Doc Instance
         * @return  {Boolean}   유효성 체크여부
         */
        , save: function ($doc, opt) {
            var _opt = $doc.options;
            var _aopt = $.extend({ actiontype: "" }, opt);

            



            var _$table = $("table[name='sub111_Table']", $doc.element).xtable("instance");

            var _isvalid = true;
            console.log("저장~~~~~~~~~~~~~~")
            console.log(_aopt.docstatus)
            if (_aopt.docstatus == "draft") {

                $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
                return _isvalid;
            }

            if($("select[name=ed_MoveType] option:selected").text().trim() == "선택"){
               // alert("이동유형을 선택해 주십시오."); 
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_111.title.a1")
                });            
                return false;
            }else if($("select[name=ed_CostCenter] option:selected").text().trim() == "선택"){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_111.title.a2")
                });                   
                return false;
            }else if($("select[name=ed_MoveType] option:selected").val() =="901" && $("select[name=ed_OrderName] option:selected").text().trim()=="선택"){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_111.title.a3")
                });                      
                return false;
            }else if($("input[name=ed_ReqEmpno]").val() == ""){        
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_111.title.a4")
                });                     
                return false;
            }


            console.log("여기진행")
            if (!_$table.validate()) {
                console.log("트루")
                _isvalid = false;
                return false;
            }



            $("input[name=fld_formdata]", $doc.element).val(_$table.getData());

            return _isvalid;
        }
    }
}($dwp.cns("app"), jQuery));





