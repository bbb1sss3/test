/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 출장명령서
 * $dwp.app.aprv_sub001
 */

(function (_$$, $) {
    _$$.aprv_sub001 = {
        subdoc: {
            SUBNAME: "sub001"
            , init: function ($doc) {
                var _me = _$$.aprv_sub001.subdoc, opt = $doc.options;
                var el = $doc.element;
               
                var _info1 = $dwp.cns("core.info");
                var vdocname=_info1.cuser.pinfo.name;

                var date = new Date(); 
                var year = date.getFullYear(); 
                var month = new String(date.getMonth()+1); 
                var day = new String(date.getDate()); 
                
                // 한자리수일 경우 0을 채워준다. 
                if(month.length == 1){ 
                  month = "0" + month; 
                } 
                if(day.length == 1){ 
                  day = "0" + day; 
                } 
               
                $('[name=ed_formtype]',$doc.element).change(function() {

                    $("[name=Subject]", $doc.element).val( $('[name=ed_formtype]',$doc.element).val())
                             
                });
             
                if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val( $('[name=ed_formtype]',$doc.element).val())
                   // $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko")+" ("+   $fn.getCurLangMsg(vdocname, ",", "ko") +" "+year + "-" + month + "-" + day+")");
                }

             
            }

            

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                var _me = _$$.aprv_sub001.subdoc;
                var el = $doc.element;
                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

                     if ($("input[name='Comp']",el).val() == "") {
                                
                            //  동행자를 입력하세요.
                            $fn.alert({msg : $fn.getCodeMsg("aprv_sub_001.msg.a1")});    //사유
                        
                        return false;
                    }else if($("input[name='OrgNight']",el).val() == "" || $("input[name='OrgDay']",el).val() == ""){
                            //  출장기간을 입력하세요.
                            $fn.alert({msg : $fn.getCodeMsg("aprv_sub_001.msg.a2")});    //사유

                            return false;
                    }else if($("input[name='Location']",el).val() == "" ){
                        //  출장지를 입력하세요.
                        $fn.alert({msg : $fn.getCodeMsg("aprv_sub_001.msg.a3")});    //사유

                            return false;
                    }else if($("input[name='Tel']",el).val() == "" ){
                        //  연락처 입력하세요.
                        $fn.alert({msg : $fn.getCodeMsg("aprv_sub_001.msg.a4")});    //사유

                        return false;
                    }else if($("[name='Object']",el).val() == "" ){
                        //  출장목적및사유 입력하세요.
                        $fn.alert({msg : $fn.getCodeMsg("aprv_sub_001.msg.a5")});    //사유
                        return false;

                    }

                
                return true;
            }
        }
    }
}($dwp.cns("app"), jQuery));




