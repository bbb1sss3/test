/* Source File Upload Time : 2022-03-07 1:42:36 PM*/


/* Source File Upload Time : 2022-02-18 4:43:40 PM*/


/* Source File Upload Time : 10-15-19 3:36:53 PM*/


/**
 * 전자결재 보조양식 - 업무연락
 * $dwp.app.aprv_sub093
 */

(function(_$$, $){
	_$$.aprv_sub093 = {
			subdoc : {
					SUBNAME				: "sub093"	
					, init : function($doc) {
                                   // alert("@@@@@@@@")
							var _me = _$$.aprv_sub093.subdoc, opt = $doc.options;
							var el = $doc.element;
							var search = location.search
 
							var params = new URLSearchParams(search);
							
							var getType= params.get('INTERFACE_ID');
							
							//alert(getType)
							//getType=getType.replace(/(\s*)/g, "")
							if(getType == "IF_NDN_GW_0001"){ //디오네 호출시 
								console.log("디오네에서 호출")
								
								
							
								//-------------------------------호출테스트---------------------------------------------------------
								var _info1 = $dwp.cns("core.info");
							
								var _rempno=_info1.cuser.pinfo.rempno;

								var _param1 = {									
									rempno : _rempno								
								}
								//$("[name='attach_btn']", el).trigger('click');

								//$('input[type="file"]').click();
							
								var callback1 = function (data) {
									console.log(data)
									//console.log(data.contens[0].CONTENTS)
									if(data.result == "400"){
										$fn.alert({msg : $fn.getCodeMsg("값이 없습니다.")});    //사유

									}else{
										$("input[name='Subject']", el).val(data.subject);
										if(data.ATTACH_YN == "Y"){
											var vATTACH_NAME;
											var vATTACH_PATH;
	
											vATTACH_NAME=data.ATTACH_NAME
											vATTACH_PATH=data.ATTACH_PATH
											$("[name='attch_name']",el).val(data.ATTACH_NAME)
										}else{
											vATTACH_NAME="";
											vATTACH_PATH="";
	
										}
										$("[name='_message']").text("※ "+vATTACH_PATH+" 경로의 "+vATTACH_NAME+" 파일을 첨부 하십시오."); 
										$dwp.ui.weditor.setHtmlValue(data.contens[0].CONTENTS );

									}


									//$dwp.ui.weditor.setEditorMode(data.CONTENTS)
								};
								setTimeout(function() { 
									var _url = $dwp.core.util.getProxyUrl('/dwp/com/work/form093.nsf/wcmdpost_form093?CreateDocument')
									console.log("디오네에서 호출3")
									//console.log(_param)
									$fn.cmdPost(_url, _param1, callback1, 'json');
									console.log("디오네에서 호출4")
								}, 2000);

							
							}
					}
	
				
				/* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
				, save : function($doc,opt){
                   // alert("세이브")
					var _me = _$$.aprv_sub093.subdoc;	
					var el = $doc.element;
					var _opt = $doc.options;
         			var _aopt = $.extend({actiontype:""}, opt);

					 var search = location.search;
 
					 var params = new URLSearchParams(search);
					 
					 var getType= params.get('INTERFACE_ID');
							
						
						if(getType == "IF_NDN_GW_0001"){ //디오네 호출시 
							var _filename=$("[name='file_dropzone']").text();
							
							if (_filename.indexOf($("[name='attch_name']",el).val()) > -1){

							}else{
								$fn.alert({ msg: $fn.getCodeMsg($("[name='attch_name']",el).val()+" 파일을 첨부 하십시오.") });	
								return false;		
							}
							console.log("디오네저장시")
						}
         			
				    return true;	
				}
				,agree : function($doc, opt){
					var _me = _$$.aprv_sub093.subdoc;
					 
					var _opt = $doc.options;
					var _aopt = $.extend({actiontype:""}, opt);
					
					return true;
				 }
				 ,reject : function($doc, opt){
					var _me = _$$.aprv_sub093.subdoc;
					 
					var _opt = $doc.options;
					var _aopt = $.extend({actiontype:""}, opt);
					
					return true;
				 }
			}
	}
}($dwp.cns("app"), jQuery));




