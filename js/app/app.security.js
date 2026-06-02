


/**
 * 전자결재 보조양식 - 출장 비용 정산서(공통)
 * $dwp.app.aprv_security
 */

(function (_$$, $) {
    _$$.security = {
        subdoc: {
            SUBNAME: "security"
            , init: function ($doc) {
                //$doc
                var _me = _$$.security.subdoc
                //var opt = $doc.options;
                //var el = $doc.element;

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
               // console.log(month)
                
                console.log(_cempno);
                console.log(_pinfo.orgname)
              
                //예외처리
				if(_cempno =="P00001" || _cempno =="rpaadmin"){
                    
                   // return false;
                }
                    //영업비밀 보호 서약서
                    $fn.xAjax({
                        url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),		
                        method: 'POST',		
                        dataType: 'json',
                        data: {
                            pI_INSACODE: _cempno,	
                            pDateid : _year,							
                            actiontype:"seseachsales"
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
                               content: { url: "/dwp/aprv/com/aprvmng.nsf/WfrmSecurity1?OpenForm" },
                
                                close: function () {
                                    console.log("close");
                                 
                                },
                                open: function(){
                                    $("[name=salessosok]").text($dwp.core.lang.getCurMsg(_pinfo.orgname));
                                    var option = $("<option value=선택>선택</option>");
                                    $('select[name=DYear_2]').append(option);
                                    for (var i = 1940; i < 2020; i++) {
                                        var optionLabel = i ;
                                        var optionValue = i ;
                                        var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                                        $('select[name=DYear_2]').append(option);
                                    }
                                }
                            });
                            $(".ui-dialog-titlebar").hide();
                           
                           
                            console.log("끝");	
                        }				
                        
                    }).fail(function (req, error) {
                        console.log(req.responseText + '\n' + error);
                    });

                     //보안서약서
                     $fn.xAjax({
                        url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),		
                        method: 'POST',		
                        dataType: 'json',
                        data: {
                            pI_INSACODE: _cempno,	
                            pDateid : _year,							
                            actiontype:"seseachsales1"
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
                               content: { url: "/dwp/aprv/com/aprvmng.nsf/WfrmSecurity2?OpenForm" },
                
                                close: function () {
                                    console.log("close");
                                 
                                },
                                open: function(){
                                    $("[name=salessosok]").text($dwp.core.lang.getCurMsg(_pinfo.orgname));
                                    var option = $("<option value=선택>선택</option>");
                                    $('select[name=DYear_2]').append(option);
                                    for (var i = 1940; i < 2020; i++) {
                                        var optionLabel = i ;
                                        var optionValue = i ;
                                        var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                                        $('select[name=DYear_2]').append(option);
                                    }
                                    var option = $("<option value=선택>선택</option>");
                                    $('select[name=DYear_3]').append(option);
                                    for (var i = 1940; i < 2020; i++) {
                                        var optionLabel = i ;
                                        var optionValue = i ;
                                        var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                                        $('select[name=DYear_3]').append(option);
                                    }
                                }
                            });
                            $(".ui-dialog-titlebar").hide();
                           
                           
                            console.log("끝");	
                        }				
                        
                    }).fail(function (req, error) {
                        console.log(req.responseText + '\n' + error);
                    });

                    //개인정보의 수집·이용에 관한 동의서
                    $fn.xAjax({
                        url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),		
                        method: 'POST',		
                        dataType: 'json',
                        data: {
                            pI_INSACODE: _cempno,	
                            pDateid : _year,							
                            actiontype:"seseachsales2"
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
                               content: { url: "/dwp/aprv/com/aprvmng.nsf/WfrmSecurity3?OpenForm" },
                
                                close: function () {
                                    console.log("close");
                                 
                                },
                                open: function(){
                                    $("[name=salessosok]").text($dwp.core.lang.getCurMsg(_pinfo.orgname));
                                    var option = $("<option value=선택>선택</option>");
                                    $('select[name=DYear_2]').append(option);
                                    for (var i = 1940; i < 2020; i++) {
                                        var optionLabel = i ;
                                        var optionValue = i ;
                                        var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                                        $('select[name=DYear_2]').append(option);
                                    }
                                    var option = $("<option value=선택>선택</option>");
                                    $('select[name=DYear_3]').append(option);
                                    for (var i = 1940; i < 2020; i++) {
                                        var optionLabel = i ;
                                        var optionValue = i ;
                                        var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                                        $('select[name=DYear_3]').append(option);
                                    }
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

                var _me = _$$.aprv_security.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

               
            }
        }
    }
}($dwp.cns("app"), jQuery));



















