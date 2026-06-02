


/**
 * 전자결재 보조양식 - 출장 비용 정산서(공통)
 * $dwp.app.aprv_sub248
 */

(function (_$$, $) {
    _$$.aprv_sub248 = {
        subdoc: {
            SUBNAME: "sub248"
            , init: function ($doc) {
                //$doc
                var _me = _$$.aprv_sub248.subdoc
                //var opt = $doc.options;
              //  var el = $doc.element;

                console.log("TTTT")
                // 결재비번 설정창 표시 2022-06-14 By LHJ              
                var _pinfo = $fn.getCurUser().pinfo;
                var _cempno=_pinfo.empno;
                var bunki;
               //alert("!!@#!@#")
                var date = new Date();
                var _year = date.getFullYear();
                var month = date.getMonth()+1;
               console.log(_year)
                console.log(month)
                if(month=="1"||	month=="2"||month=="3"){
							bunki="1"
				}
				if(month=="4"||	month=="5"||month=="6"){
						bunki="2"
				}
				if(month=="7"||	month=="8"||month=="9"){
						bunki="3"
				}
				if(month=="10"||month=="11"||month=="12"){
						bunki="4"
				}
                console.log(_cempno);
            
				if(_cempno =="P99999" || _cempno =="rpaadmin"){
                    
                    return false;
                }
                    $fn.xAjax({
                        url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),		
                        method: 'POST',		
                        dataType: 'json',
                        data: {
                            pI_INSACODE: _cempno,	
                            pDateid : _year+"^"+bunki,							
                            actiontype:"seseach"
                        },
                        async: false,
                        cache: false
                    }).done(function (data) {
                        console.log("처리",data);	
                        if(data.yn == ""){
                            console.log("팝업시작");	
                            //alert("시작")
                            $fn.dialog(null, {
                                modal: true,
                                resizable: false,
                                //draggable: true,
                                closeOnEscape: false,
                                width: "820px",
                                height: "auto",
                                show: "fade", //effect fade
                                hide: "fade", //effect
                               content: { url: "/dwp/aprv/com/aprvmng.nsf/WfrmSecurity?OpenForm" },
                
                                close: function () {
                                    console.log("close");
                                 
                                }
                            });
                            $(".ui-dialog-titlebar").hide();
                           
                           
                            console.log("끝");	
                        }				
                        
                    }).fail(function (req, error) {
                        console.log(req.responseText + '\n' + error);
                    });
                
             

               
               

            }
            ,
            // 보안서약서 팝업
            Securitypass: function () {
                var _me = this,
                    _form = "WfrmSecurity";
    
                
            }

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                
                var el = $doc.element;

                var _me = _$$.aprv_sub248.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

               
            }
        }
    }
}($dwp.cns("app"), jQuery));


















