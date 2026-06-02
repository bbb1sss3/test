/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 출장명령서
 * $dwp.app.aprv_sub008
 */

(function (_$$, $) {
    _$$.aprv_sub008 = {
        subdoc: {
            SUBNAME: "sub008"
            , init: function ($doc) {
                var _me = _$$.aprv_sub008.subdoc, opt = $doc.options;
                var el = $doc.element;
                
                var _info1 = $dwp.cns("core.info");
                var ccuser=_info1.cuser.pinfo.mailid;
                var vdocname=_info1.cuser.pinfo.name;
        
               
                //alert(opt.from);
               //alert(opt.docstatus);;


                var kianjaid=opt.from;
                kianjaid=kianjaid.split("@");
               // alert(ccuser);
                //alert(kianjaid[0])
               // alert(opt.docstatus)
               console.log(ccuser)
               console.log(kianjaid[0])
               console.log(opt.docstatus)
                // 현재 접속자와 기안자가 같으면 버튼 출장보고서 작성버튼 노출
            if (opt.docstatus == "complete"){


               if(ccuser==kianjaid[0]){
                    //alert(opt.docstatus)
                    if(opt.docstatus == "ing" || opt.docstatus == "draft"){
                           
                        $("#_orgsel_btn",el).css("display","none")
                    }

                }else{
                    
                    if(opt.docstatus == "complete"||opt.docstatus == "ing"){
                        $("#_orgsel_btn",el).css("display","none")
                    }
                   
                }
                if(opt.isrevdoc){ //수신문서이면 숨김
                    $("#_orgsel_btn",el).css("display","none")
                }
                
            }else{
                $("#_orgsel_btn",el).css("display","none")
            } 
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
               
             
             
                if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko")+" ("+   $fn.getCurLangMsg(vdocname, ",", "ko") +" "+year + "-" + month + "-" + day+")");
                }


                $("[name=_pop5]", $doc.element).on("click", function () { //출장보고서 작성

                    
                    
                    var _url = "";
                    var _form = "";
                    var vorgname=_info1.cuser.pinfo.orgname;
                    //alert($fn.getCurLangMsg(vorgname, ",", "ko") )
                    vorgname=$fn.getCurLangMsg(vorgname, ",", "ko");
                    //alert(vorgname)
                    //기안자 부서가 usa포함하고 있으면 영문 결의서 아니면 한글결의서
                    if(vorgname.indexOf("USA") > -1){
                        _form = "Form167"
                    }else if(vorgname.indexOf("대선주조") > -1){
                        _form = "Form160"
                    }else{
                        _form = "Form174" 
                    }
					
                    $fn.confirm({ msg: $fn.getCodeMsg("경비사용내역이 3개 이상입니까? 3개 이상이면 확인을 클릭하세요. 3개 이하이면 취소 클릭 후 보고서 작성하세요") }).done(function () {
                        _url = "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?openform";

                        _url += "&FormCode=Form191";
                        _url += "&org_dbpath=" + opt.cdb;

                        _url += "&org_docid=" + opt.unid;

                        $fn.loadPage({

                            link: _url,

                            linktype: "PAGE"

                        });

                    });

                    _url = "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?openform";

                    _url += "&FormCode=" + _form;



                    _url += "&org_dbpath=" + opt.cdb;

                    _url += "&org_docid=" + opt.unid;

                    $fn.loadPage({

                        link: _url,

                        linktype: "PAGE"

                    });
                  });

             
            }
            
            

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                var _me = _$$.aprv_sub008.subdoc;
                var el = $doc.element;
                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

                     if ($("input[name='Comp']",el).val() == "") {
                                
                            //  동행자를 입력하세요.
                            $fn.alert({msg : $fn.getCodeMsg("aprv_sub_008.msg.a1")});    //사유
                        
                        return false;
                    }else if($("input[name='OrgNight']",el).val() == "" || $("input[name='OrgDay']",el).val() == ""){
                            //  출장기간을 입력하세요.
                            $fn.alert({msg : $fn.getCodeMsg("aprv_sub_008.msg.a2")});    //사유

                            return false;
                    }else if($("input[name='Location']",el).val() == "" ){
                        //  출장지를 입력하세요.
                        $fn.alert({msg : $fn.getCodeMsg("aprv_sub_008.msg.a3")});    //사유

                            return false;
                    }else if($("input[name='Tel']",el).val() == "" ){
                        //  연락처 입력하세요.
                        $fn.alert({msg : $fn.getCodeMsg("aprv_sub_008.msg.a4")});    //사유

                        return false;
                    }else if($("[name='Object']",el).val() == "" ){
                        //  출장목적및사유 입력하세요.
                        $fn.alert({msg : $fn.getCodeMsg("aprv_sub_008.msg.a5")});    //사유
                        return false;

                    }

                
                return true;
            }
        }
    }
}($dwp.cns("app"), jQuery));






