/* Source File Upload Time : 5-28-20 5:30:38 PM*/


/* Source File Upload Time : 3-31-20 2:22:48 PM*/


/* Source File Upload Time : 3-20-20 1:30:23 PM*/


/* Source File Upload Time : 3-20-20 10:33:50 AM*/


/* Source File Upload Time : 3-10-20 9:18:38 AM*/


/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 근태신청서
 * $dwp.app.aprv_sub064
 */

 (function (_$$, $) {
    _$$.aprv_sub064 = {
        subdoc: {
            SUBNAME: "sub064"
            , init: function ($doc) {
                var _me = _$$.aprv_sub064.subdoc, opt = $doc.options;
                var el = $doc.element;
				//_location Titlename_1
				 if (opt.isnew) {
                    //$("[name=Subject]", $doc.element).val();
               
				
				
				}

				$("[name=H_2_1]",el).on("click", function () {

					var _rptDailog = $fn.dialog(null, {
							modal: true,
							resizable: false,
							draggable: true,
							islangconvert: false,
							referdata: el,
							title: "반명",
							width: 500,
							height: 660,
							show: 'fade', //effect
							hide: 'fade', //effect
							//langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/common_data30.lang.js",
							buttons: [],
							content: {
								html: "",
								//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
							   url: "/dwp/com/work/elpisuser.nsf" + "/wFrmView_pop3?ReadForm&view=deptview"

							},
							close: function () { //2017.01.19

							}

						});
				}); //기능직사용선택 끝
				 
					
                $doc.options = _newopt;
            }

       

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                 var _me = _$$.aprv_sub064.subdoc, opt = $doc.options;
                var el = $doc.element;
			
				
				
			
			
				//alert(startdate[0]+startdate[1]+startdate[2])
				
				
			
				//$("[name=Subject]", $doc.element).val($("[name='H_2']", $doc.element).val() +" 설비점검 CheckSheet "+$("[name='H_2_1']", $doc.element).val() );

				//$("[name=Subject]", $doc.element).val("휴직신청서 - "+ $("input[name=ed_user]", $doc.element).val() +" "+ $("input[name=H_1]", $doc.element).val());
             return true; 
            }
        }
    }
}($dwp.cns("app"), jQuery));










