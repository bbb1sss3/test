/* Source File Upload Time : 5-28-20 5:30:38 PM*/


/* Source File Upload Time : 3-31-20 2:22:48 PM*/


/* Source File Upload Time : 3-20-20 1:30:23 PM*/


/* Source File Upload Time : 3-20-20 10:33:50 AM*/


/* Source File Upload Time : 3-10-20 9:18:38 AM*/


/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 근태신청서
 * $dwp.app.aprv_sub060
 */

(function (_$$, $) {
    _$$.aprv_sub060 = {
        subdoc: {
            SUBNAME: "sub060"
            , init: function ($doc) {
                var _me = _$$.aprv_sub060.subdoc, opt = $doc.options;
                var el = $doc.element;
				//_location Titlename_1
				 if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko") +" "+ $("input[name=ed_user]", $doc.element).val() +" "+ $("input[name=H_1]", $doc.element).val());
                }

				var _$save = $("[name='_popgumae22']",el);

				_$save.on("click", function () {

					window.open("https://map.kakao.com/", '_blank');		
				});	

				var _$save = $("[name='H_13']",el);

				_$save.on("change", function () {

					val1=$("[name=H_13]",el).val();
					if(val1 == 1458 || val1 == 4706 ){
						$("[name=H_13_1]",el).attr("disabled",true) ;
						$("[name=H_14_1]",el).attr("disabled",true) ;
						$("[name=H_6_1]",el).attr("disabled",true) ;
						$("[name=H_13_2]",el).attr("disabled",true) ;
				
					
					}else{
						$("[name=H_13_1]",el).attr("disabled",false) ;
						$("[name=H_14_1]",el).attr("disabled",false) ;
						$("[name=H_6_1]",el).attr("disabled",false) ;
						$("[name=H_13_2]",el).attr("disabled",false) ;
					
					
					}
					//alert("!@#")
					//window.open("https://map.kakao.com/", '_blank');		
				});	

				var _$save = $("[name='H_14_1']",el);

				_$save.on("change", function () {

					val1=$("[name=H_14_1]",el).val();
					if(val1==0){


					}else{
					var distance= $("[name=H_13_1]",el).val();
					$("[name=H_6_1]",el).val(Math.round(distance/val1))
					//document.getElementById("H_6_1").value=
					}
					
					//alert("!@#")
					//window.open("https://map.kakao.com/", '_blank');		
				});	
				

				
				
				 val1=$("[name=H_13]",el).val();
				
				//alert(val1)
				
				
				if(val1 == 1458 || val1 == 4706 ){
					$("[name=H_13_1]",el).attr("disabled",true) ;
					$("[name=H_14_1]",el).attr("disabled",true) ;
					$("[name=H_6_1]",el).attr("disabled",true) ;
					$("[name=H_13_2]",el).attr("disabled",true) ;
			
				
				}else{
					$("[name=H_13_1]",el).attr("disabled",false) ;
					$("[name=H_14_1]",el).attr("disabled",false) ;
					$("[name=H_6_1]",el).attr("disabled",false) ;
					$("[name=H_13_2]",el).attr("disabled",false) ;
				
				
				}
				   var _org = $fn.getOrgUser($fn.getName($("input[name=From]", $doc.element).val()).ou);
								$("[name=ed_user]", $doc.element).val($dwp.core.lang.getCurMsg(_org.oinfo.username));
								$("[name=H_1]", $doc.element).val($dwp.core.lang.getCurMsg(_org.oinfo.empno));
								$("[name=H_3]", $doc.element).val($dwp.core.lang.getCurMsg(_org.oinfo.orgname));
								$("[name=H_2]", $doc.element).val($("input[name='Titlename_1']",el).val())
								//$("[name=Reason_1_2_2]").val($dwp.core.lang.getCurMsg(_org.oinfo.username))
				   
				   
				$fn.orgsel($("[name='org']", el), {
				    isedit: true,
				    treetype: "0",
				    seltype: "2",
				    isseltype: false,
				    autodraw: false,
				    autoseletcomplete: function (event, ui, doc) {
				        $("input[name='ed_user']").val($dwp.core.lang.getCurMsg(ui.item.value.username));
				         $("input[name='H_1']").val($dwp.core.lang.getCurMsg(ui.item.value.empno));
				        $("input[name='H_3']").val($dwp.core.lang.getCurMsg(ui.item.value.orgname));
				        $("input[name='H_2']").val($dwp.core.lang.getCurMsg(ui.item.value.pos));
				        //$("input[name='Reason_1_2_2']").val($dwp.core.lang.getCurMsg(ui.item.value.username));
				    },
				    orgselectcomplete: function (dialog, rtndata, doc) {
				        //사용자를 선택하지 않고 확인 버튼을 클릭하는 경우
				        if (rtndata.list.length < 1) {
				            return false;
				        }
				        $("input[name='ed_user']").val($dwp.core.lang.getCurMsg(rtndata.list[0].username));
				         $("input[name='H_1']").val($dwp.core.lang.getCurMsg(rtndata.list[0].empno));
				        $("input[name='H_3']").val($dwp.core.lang.getCurMsg(rtndata.list[0].orgname));
				        $("input[name='H_2']").val($dwp.core.lang.getCurMsg(rtndata.list[0].pos));
				      //  $("input[name='Reason_1_2_2']").val($dwp.core.lang.getCurMsg(rtndata.list[0].username));
				    },
				    fld: "User",
				    count: 1
				});
                $doc.options = _newopt;

				
			
            }

       

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                 var _me = _$$.aprv_sub060.subdoc, opt = $doc.options;
                var el = $doc.element;
				var startdate=$("[name=H_5_1]", $doc.element).val();
				var enddate=$("[name=H_5_1_1]", $doc.element).val();
				
				startdate=startdate.replace(".","")
				startdate=startdate.replace(".","")
				enddate=enddate.replace(".","")
				enddate=enddate.replace(".","")
				$("[name=H_4]", $doc.element).val(startdate)
				$("[name=H_5]", $doc.element).val(enddate)


				$("[name=Subject]", $doc.element).val("외근신청서"+" - "+ $("input[name=ed_user]", $doc.element).val() +" "+ $("input[name=H_1]", $doc.element).val());
             return true; 
            }
        }
    }
}($dwp.cns("app"), jQuery));








