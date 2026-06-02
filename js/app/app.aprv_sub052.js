/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 근태계
 * $dwp.app.aprv_sub052
 */

 (function (_$$, $) {
    _$$.aprv_sub052 = {
        subdoc: {
            SUBNAME: "sub052"
            , init: function ($doc) {
                var _me = _$$.aprv_sub052.subdoc, opt = $doc.options;
                var el = $doc.element;       
                
                        $('[name=ed_sub]',$doc.element).change(function() {

                            $("[name=Subject]", $doc.element).val( $('[name=ed_sub]',$doc.element).val());
        
                                if($('[name=ed_sub]',$doc.element).val()=="연차계" || $('[name=ed_sub]',$doc.element).val()=="생휴계"){
                                    $("#vhidden", $doc.element).hide(); 
                                }else{
                                    $("#vhidden", $doc.element).show(); 
                                }
                            
                                if($('[name=ed_sub]',$doc.element).val()=="시차출퇴근계"){
                                    $("#vhidden1", $doc.element).hide(); 
                                    $("[name=vDay_1]", $doc.element).hide(); 
                                    $("[name=vDay_1]", $doc.element).val(""); 
                                    $("#vhidden2", $doc.element).hide(); 
                                }else{
                                // $("#vhidden", $doc.element).show(); 
                                $("#vhidden1", $doc.element).show(); 
                                    $("[name=vDay_1]", $doc.element).show(); 
                                    $("#vhidden2", $doc.element).show(); 
                                }
                                    
                        });
             
                        if (opt.isnew) {
                            
                            $("[name=Subject]", $doc.element).val( $('[name=ed_sub]',$doc.element).val())
                           
                            
                        }

                            $('[name=Sdate]',$doc.element).change(function() {
                                var sdate=$('[name=Sdate]',$doc.element).val();
                            
                                $('[name=fdate]',$doc.element).val( sdate)
                    
                            });

                            if($fn.getCurLangMsg(opt.appCfg.FormAlias, ",", "ko") != "Form117"){
                                $('[name=ed_sub] option:last',$doc.element).remove();
                                //ed_sub

                            }

                     if (opt.isedit) {

                            if($('[name=ed_sub]',$doc.element).val()=="연차계" || $('[name=ed_sub]',$doc.element).val()=="생휴계"){
                                    $("#vhidden", $doc.element).hide(); 
                             }else{
                                    $("#vhidden", $doc.element).show(); 
                            }
                        
                            if($('[name=ed_sub]',$doc.element).val()=="시차출퇴근계"){
                                $("#vhidden1", $doc.element).hide(); 
                                $("[name=vDay_1]", $doc.element).hide(); 
                                $("#vhidden2", $doc.element).hide(); 
                            }else{
                            // $("#vhidden", $doc.element).show(); 
                                 $("#vhidden1", $doc.element).show(); 
                                $("[name=vDay_1]", $doc.element).show(); 
                                $("#vhidden2", $doc.element).show(); 
                            }
                           // $('[name=vvreason]',$doc.element).html($('[name=vvreason]',$doc.element).html().replaceAll(/(\n|\r\n)/g,'<br>'))

                     }else{
                        //연차계이고 사유가 공백이 아니면 보여주고
                        //사유가 공백이면 숨긴 나머진 오픈 읽기모드
                        console.log($('[name=vedsub]',$doc.element).val());
                        console.log($('[name=vvreason]',$doc.element).html().replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, ""));
                        console.log($('[name=vvreason]',$doc.element).html().replaceAll(/(\n|\r\n)/g,''))
                        console.log($('[name=vvreason]',$doc.element).html().replaceAll("<br>",''));
                        console.log($('[name=vvreason]',$doc.element).html().replaceAll("\n",'<br>'));
                        //$('[name=vvreason]',$doc.element).html().replaceAll(" ",'&nbsp;')
                       // $('[name=vvreason]',$doc.element).html().replaceAll("<br>",'');
                       // $('[name=vvreason]',$doc.element).html().replaceAll(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "")
                      //  $('[name=vvreason]',$doc.element).html($('[name=vvreason]',$doc.element).html().replaceAll(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, ""));
                       // $('[name=vvreason]',$doc.element).html($('[name=vvreason]',$doc.element).html().replaceAll(/(\n|\r\n)/g,'<br>'));
                       //$('[name=vvreason]',$doc.element).html($('[name=vvreason]',$doc.element).html().replaceAll("\n",'<br>'));
                        console.log($('[name=vvreason]',$doc.element).html());
                            if($('[name=vedsub]',$doc.element).val()=="연차계" && $('[name=vvreason]',$doc.element).text()!=""){
                                $("#vhidden", $doc.element).show(); 
                            }else if($('[name=vedsub]',$doc.element).val()=="연차계" && $('[name=vvreason]',$doc.element).text()==""){
                                $("#vhidden", $doc.element).hide(); 
                            }else if($('[name=vedsub]',$doc.element).val()=="생휴계" && $('[name=vvreason]',$doc.element).text()!=""){
                                $("#vhidden", $doc.element).show(); 
                            }else if($('[name=vedsub]',$doc.element).val()=="생휴계" && $('[name=vvreason]',$doc.element).text()==""){
                                $("#vhidden", $doc.element).hide(); 
                            }else{
                                $("#vhidden", $doc.element).show(); 
                            }

                            if($('[name=vedsub]',$doc.element).val()=="시차출퇴근계"){
                                $("#vhidden1", $doc.element).hide(); 
                                $("[name=vDay_1]", $doc.element).hide(); 
                                $("#vhidden2", $doc.element).hide(); 
                            }else{
                            // $("#vhidden", $doc.element).show(); 
                            $("#vhidden1", $doc.element).show(); 
                                $("[name=vDay_1]", $doc.element).show(); 
                                $("#vhidden2", $doc.element).show(); 
                            }
                       
                     }
                     
                   //  alert($fn.getCurLangMsg(opt.appCfg.FormAlias, ",", "ko"))
              
        
            }

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                var _me = _$$.aprv_sub052.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

                var _info1 = $dwp.cns("core.info");
                var vdocname=_info1.cuser.pinfo.name;
            
                if ( _opt.docstatus == "draft") {
                       
                    $("[name=Subject]", $doc.element).val( $fn.getCurLangMsg( $("input[name='ed_sub_Nm']",$doc.element).val(), ",", "ko")+ "-" +
                        $fn.getCurLangMsg( vdocname, ",", "ko")+
                          "("+$("input[name='Sdate']",$doc.element).val()+" ~ "+
                              $("input[name='fdate']",$doc.element).val()+")"
                    
                    );
                }

                //필수입력 체크
                var _isvalid = true;
                //$('[name=vvreason]',$doc.element).html($('[name=vvreason]',$doc.element).html().replaceAll(/(\n|\r\n)/g,'<br>'))

                console.log("052 save : ", _isvalid);
                return _isvalid;
            }
        }
    }
}($dwp.cns("app"), jQuery));











