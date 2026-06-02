/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 기블요청서 
 * $dwp.app.aprv_sub188
 */

 (function (_$$, $) {
    _$$.aprv_sub188 = {
        subdoc: {
            SUBNAME: "sub188"
            , init: function ($doc) {
                var _me = _$$.aprv_sub188.subdoc, opt = $doc.options;
                var el = $doc.element;
              

                var _isedit = opt.isedit;
               
               
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
               
               
             
                if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko")+" ("+   $fn.getCurLangMsg(vdocname, ",", "ko") +" "+year + "-" + month + "-" + day+")");
                }

                $("input[name='Won']").bind("blur", function(){
                    var _icount = $('[name=Won]',$doc.element).val();                                      								
                    _icount = _icount.replace(/,/gi, "");                                   
                    //_icount=_icount+""
                    $('input[name=Won]',$doc.element).val(_icount.toComma());
                });

              
                    
              

            }        

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                var _me = _$$.aprv_sub188.subdoc;

                var _opt = $doc.options;     

             
                   
                  
               

               // console.log("188 save : ", _isvalid);
                return true;
            }
        }
    }
}($dwp.cns("app"), jQuery));








