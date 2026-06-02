/**
 * 전자결재 보조양식 구매처코드 생성요청서
 * $dwp.app.aprv_subxxx.subdoc
 */
(function (_$$, $) {
    _$$.aprv_sub152 = {
        /*
         * 양식 로딩시 호출 함수
         * @param   {Object}    $doc        Doc 
         */
        load: function ($doc) {
            var _me = _$$.aprv_sub152;
            var _opt = $doc.options;
          
            //            $fn.orgsel($("[name='org1']", $doc.element), { isedit: _opt.isedit, treetype: "0", seltype: "2", fld: "tagetUserName", count: 1 });

            if (_opt.isnew) {
                $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(_opt.appCfg.sFormTitle, ",", $dwp.core.lang.getUserLang()));
                var _pinfo = $fn.getCurUser().pinfo;
                console.log(_pinfo)
             //   $("[name=ed_ReqEmpno]", $doc.element).val(_pinfo.rempno)

            }
           
            

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
            
            if($("[name=ed_CompanyNo]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a1")
                });  
                return false;
            }else if($("[name=ed_CustName]", $doc.element).val()  == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a2")
                });  
                return false;
            }else if($("[name=ed_Ceo]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a3")
                });  
                return false;
            }else if($("[name=ed_PersonalNo]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a4")
                });  
                return false;
            }else if($("[name=ed_ZipCode]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a5")
                });  
                return false;
            }else if($("[name=ed_Address]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a6")
                });  
                return false;	
            }else if($("[name=ed_Uptae]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a7")
                }); 
                return false;
            }else if($("[name=ed_Item]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a8")
                }); 
                return false;
            }else if($("[name=ed_Mail]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a9")
                }); 
                return false;
            }else if($("[name=ed_TelNo]", $doc.element).val() == ""){
                $fn.alert({//aprv_sub_103.title.a36
                    msg: $fn.getCodeMsg("aprv_sub_152.msg.a10")
                }); 
                return false;
            }	




          

            return _isvalid;
        }
    }
}($dwp.cns("app"), jQuery));






