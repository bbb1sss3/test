/**
 * 전자결재 보조양식 생산 비수불 품의서
 * $dwp.app.aprv_subxxx.subdoc
 */
(function (_$$, $) {
    _$$.aprv_sub175 = {
        /*
         * 양식 로딩시 호출 함수
         * @param   {Object}    $doc        Doc 
         */
        load: function ($doc) {
            var _me = _$$.aprv_sub175;
            var _opt = $doc.options;

            //            $fn.orgsel($("[name='org1']", $doc.element), { isedit: _opt.isedit, treetype: "0", seltype: "2", fld: "tagetUserName", count: 1 });

            if (_opt.isnew) {
                $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(_opt.appCfg.sFormTitle, ",", $dwp.core.lang.getUserLang()));
                var _pinfo = $fn.getCurUser().pinfo;
                console.log(_pinfo)


            }

            var ed_summoney = $("[name=ed_summoney]", $doc.element)
            ed_summoney.on("keyup", function () {

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

            var _$table = _me.initDataTable(_opt, $doc);
        }

        //입력된 지출결의 내용을 표시하는 테이블 - 초기화
        , initDataTable: function (_opt, $doc) {
            var _me = _$$.aprv_sub175;
            var el = $doc.elelment;
            if ($("input[name=fld_formdata]", $doc.element).size() == 0) {
                return;
            }

            var _formdata = $("input[name=fld_formdata]", $doc.element).val();

            var _$table = $dwp.ui.table.init($("table[name='sub175_Table']", $doc.element), {
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
                        nm: "fumno", type: "custom", vfnm: "_FUMNO", validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_175.title.a4")
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
                        nm: "cnt", type: "custom", vfnm: "_CNT" , validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_175.title.a5")
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
                        nm: "danwe", type: "custom", vfnm: "_DANWE", validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_175.title.a6")
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
                        nm: "cnt1", type: "custom", vfnm: "_CNT1", validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_175.title.a7")
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
                        nm: "cnt2", type: "custom", vfnm: "_CNT2", validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_175.title.a8")
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
                        nm: "bigo", type: "custom", vfnm: "_BIGO" , validator: /[^\s]/, label: $fn.getCodeMsg("aprv_sub_175.title.a9")
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
            var _me = _$$.aprv_sub175;
            //alert( _me.SUBNAME)
            var _$input_tbl = $("table[name=sub175_Table]", el);


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





            var _$table = $("table[name='sub175_Table']", $doc.element).xtable("instance");

            var _isvalid = true;
            console.log("저장~~~~~~~~~~~~~~")
            console.log(_aopt.docstatus)
            if (_aopt.docstatus == "draft") {

                $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
                return _isvalid;
            }

            if ($("select[name=ed_Packing] option:selected").text().trim() == "선택") {
                // alert("이동유형을 선택해 주십시오."); 
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_175.msg.a1")
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






