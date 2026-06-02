/**
 * 전자결재 보조양식 판매처코드 생성요청서
 * $dwp.app.aprv_subxxx.subdoc
 */
(function (_$$, $) {
    _$$.aprv_sub159 = {
        /*
         * 양식 로딩시 호출 함수
         * @param   {Object}    $doc        Doc 
         */
        load: function ($doc) {
            var _me = _$$.aprv_sub159;
            var _opt = $doc.options;
            var el = $doc.element;
            //            $fn.orgsel($("[name='org1']", $doc.element), { isedit: _opt.isedit, treetype: "0", seltype: "2", fld: "tagetUserName", count: 1 });

            if (_opt.isnew) {
                $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(_opt.appCfg.sFormTitle, ",", $dwp.core.lang.getUserLang()));
                var _pinfo = $fn.getCurUser().pinfo;
                console.log(_pinfo)
                //   $("[name=ed_ReqEmpno]", $doc.element).val(_pinfo.rempno)

            }

            $("[name=ed_PaymentCode]", $doc.element).on('change', function () {
                // 현재 ed_Data_8의 선택된 값을 가져와!
                var selectedValue = $(this).val();

                // 선택된 값이 'AF159_CD2_050'과 같다면?
                if (selectedValue === 'AF159_CD2_050') {
                    // ed_Etc_13 입력 칸의 'readonly' 속성을 제거해서 입력 가능하게 만들어!
                    $("[name=ed_Etc_13]", el).prop('readonly', false);
                } else {
                    // 그 외의 값이라면 다시 'readonly'로 만들어서 입력 못하게 막아!
                    // 이 else 문은 필요에 따라 추가하거나 제거할 수 있어!
                    $("[name=ed_Etc_13]", el).prop('readonly', true);
                    $("[name=ed_Etc_13]", el).val(''); // 값도 초기화해줄 수 있어!
                }
            });
           
            if( $("[name=ved_etc]", $doc.element).val() === 'AF159_CD2_050'){
                $("[name=ed_Etc_13]", el).prop('readonly', false);
            }else{
                $("[name=ed_Etc_13]", el).prop('readonly', true);
            }
            if( $("[name=ved_if]", $doc.element).val() === '9000'){
                $("[name=ed_Etc_13_1]", el).prop('readonly', false);
            }else{
                $("[name=ed_Etc_13_1]", el).prop('readonly', true);
            }


            $("[name=ed_Payment]", $doc.element).on('change', function () {
                // 현재 ed_Data_8의 선택된 값을 가져와!
                var selectedValue = $(this).val();

                // 선택된 값이 'AF159_CD2_050'과 같다면?
                if (selectedValue === '9000') {
                    // ed_Etc_13 입력 칸의 'readonly' 속성을 제거해서 입력 가능하게 만들어!
                    $("[name=ed_Etc_13_1]", el).prop('readonly', false);
                } else {
                    // 그 외의 값이라면 다시 'readonly'로 만들어서 입력 못하게 막아!
                    // 이 else 문은 필요에 따라 추가하거나 제거할 수 있어!
                    $("[name=ed_Etc_13_1]", el).prop('readonly', true);
                    $("[name=ed_Etc_13_1]", el).val(''); // 값도 초기화해줄 수 있어!
                }
            });



        }



        /*
         * 양식 저장시 호출 함수
         * @param   {Object}    $doc        Doc Instance
         * @return  {Boolean}   유효성 체크여부
         */
        , save: function ($doc, opt) {
            var _opt = $doc.options;
            var _aopt = $.extend({ actiontype: "" }, opt);



            var _isvalid = true;
            console.log("저장~~~~~~~~~~~~~~")
            console.log(_aopt.docstatus)
            if (_aopt.docstatus == "draft") {

                return _isvalid;
            }

            if ($("[name=ed_Data_1]", $doc.element).val() == "") {
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_159.msg.a1")
                });
                return false;
            } else if ($("[name=ed_Data_2]", $doc.element).val() == "") {
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_159.msg.a8")
                });
                return false;
            } else if ($("[name=ed_Data_3]", $doc.element).val() == "") {
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_159.msg.a2")
                });
                return false;
            } else if ($("[name=ed_Data_4]", $doc.element).val() == "") {
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_159.msg.a3")
                });
                return false;
            } else if ($("[name=ed_Data_5]", $doc.element).val() == "") {
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_159.msg.a4")
                });
                return false;
            } else if ($("[name=ed_Data_6]", $doc.element).val() == "") {
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_159.msg.a5")
                });
                return false;
            } else if ($("[name=ed_Data_7]", $doc.element).val() == "") {
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_159.msg.a6")
                });
                return false;
            } 






            return _isvalid;
        }
    }
}($dwp.cns("app"), jQuery));







