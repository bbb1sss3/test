/**
 * 전자결재 보조양식 개별 함수
 * $dwp.app.aprv_sub194.subdoc 
 */
(function (_$$, $) {
	_$$.aprv_sub194 = {
		subdoc: {


			/**
			 * 결재양식 화면 로딩시 수행
			 * @param {*} $doc 
			 */
			init: function ($doc) {
				var _me = _$$.aprv_sub194.subdoc, _opt = $doc.options, _user = {};
				if (_opt.isedit) {
					_user = $dwp.core.getCurUser();
					if (_opt.isnew == true) {
						//$("[name=CompanyName1]", $doc.element).xval($fn.getCurLangMsg(_user.pinfo.comname));
						//$("[name=CompanyName2]", $doc.element).xval($fn.getCurLangMsg(_user.pinfo.comname));
						$("[name=Subject]", $doc.element).xval($fn.getCurLangMsg(_opt.appCfg.sFormTitle, ",", "ko") + " -" + " " + $fn.getSysinfo().date + "");
						
					}
					
				}else{
					for(var i=1; i<21; i++){
						$("[name=xxx"+i+"]", $doc.element).on("click", function () { //2.원화 체인지시
							//alert("읽기모드에서는 변경할수 없습니다.");
							$fn.alert({msg : $fn.getCodeMsg("읽기모드에서는 변경할수 없습니다.")});    //사유
							return false;
						
						});
					}
					
				}
				
				
					for(var i=1; i<21; i++){
						if($("[name=yyy"+i+"]", $doc.element).val() == "2"){
							$(":radio[name='xxx"+i+"'][value='"+$("[name=yyy"+i+"]", $doc.element).val()+"']").attr('checked', true);
						}else if($("[name=yyy"+i+"]", $doc.element).val() == "1"){					
							$(":radio[name='xxx"+i+"'][value='"+$("[name=yyy"+i+"]", $doc.element).val()+"']").attr('checked', true);
						}else if($("[name=yyy"+i+"]", $doc.element).val() == "3"){					
							$(":radio[name='xxx"+i+"'][value='"+$("[name=yyy"+i+"]", $doc.element).val()+"']").attr('checked', true);
						}	
					}
				
				
					$("[name=xxx1]", $doc.element).on("click", function () { //1						
						$("[name=xxx1]", $doc.element).val($("[name=xxx1]:checked", $doc.element).val() )				
					});
					$("[name=xxx2]", $doc.element).on("click", function () { //2						
						$("[name=xxx2]", $doc.element).val($("[name=xxx2]:checked", $doc.element).val() )				
					});
					$("[name=xxx3]", $doc.element).on("click", function () { //3						
						$("[name=xxx3]", $doc.element).val($("[name=xxx3]:checked", $doc.element).val() )				
					});
					$("[name=xxx4]", $doc.element).on("click", function () { //4						
						$("[name=xxx4]", $doc.element).val($("[name=xxx4]:checked", $doc.element).val() )				
					});
					$("[name=xxx5]", $doc.element).on("click", function () { //4						
						$("[name=xxx5]", $doc.element).val($("[name=xxx5]:checked", $doc.element).val() )				
					});
					$("[name=xxx6]", $doc.element).on("click", function () { //4						
						$("[name=xxx6]", $doc.element).val($("[name=xxx6]:checked", $doc.element).val() )				
					});
					$("[name=xxx7]", $doc.element).on("click", function () { //4						
						$("[name=xxx7]", $doc.element).val($("[name=xxx7]:checked", $doc.element).val() )				
					});
					$("[name=xxx8]", $doc.element).on("click", function () { //4						
						$("[name=xxx8]", $doc.element).val($("[name=xxx8]:checked", $doc.element).val() )				
					});
					$("[name=xxx9]", $doc.element).on("click", function () { //4						
						$("[name=xxx9]", $doc.element).val($("[name=xxx9]:checked", $doc.element).val() )				
					});
					$("[name=xxx10]", $doc.element).on("click", function () { //4						
						$("[name=xxx10]", $doc.element).val($("[name=xxx10]:checked", $doc.element).val() )				
					});					
					$("[name=xxx11]", $doc.element).on("click", function () { //4						
						$("[name=xxx11]", $doc.element).val($("[name=xxx11]:checked", $doc.element).val() )				
					});
					$("[name=xxx12]", $doc.element).on("click", function () { //4						
						$("[name=xxx12]", $doc.element).val($("[name=xxx12]:checked", $doc.element).val() )				
					});		
					$("[name=xxx13]", $doc.element).on("click", function () { //4						
						$("[name=xxx13]", $doc.element).val($("[name=xxx13]:checked", $doc.element).val() )				
					});
					$("[name=xxx14]", $doc.element).on("click", function () { //4						
						$("[name=xxx14]", $doc.element).val($("[name=xxx14]:checked", $doc.element).val() )				
					});		
					$("[name=xxx15]", $doc.element).on("click", function () { //4						
						$("[name=xxx15]", $doc.element).val($("[name=xxx15]:checked", $doc.element).val() )				
					});
					$("[name=xxx16]", $doc.element).on("click", function () { //4						
						$("[name=xxx16]", $doc.element).val($("[name=xxx16]:checked", $doc.element).val() )				
					});	
					$("[name=xxx17]", $doc.element).on("click", function () { //4						
						$("[name=xxx17]", $doc.element).val($("[name=xxx17]:checked", $doc.element).val() )				
					});
					$("[name=xxx18]", $doc.element).on("click", function () { //4						
						$("[name=xxx18]", $doc.element).val($("[name=xxx18]:checked", $doc.element).val() )				
					});			
					$("[name=xxx19]", $doc.element).on("click", function () { //4						
						$("[name=xxx19]", $doc.element).val($("[name=xxx19]:checked", $doc.element).val() )				
					});
					$("[name=xxx20]", $doc.element).on("click", function () { //4						
						$("[name=xxx20]", $doc.element).val($("[name=xxx20]:checked", $doc.element).val() )				
					});
 
			},
			/**
			 * 결재 상신전 체크
			 * @param {*} $doc 
			 * @param {*} opt 
			 * @returns 
			 */
			save: function ($doc, opt) {
				
				return true;
			}
		}
	}
}($dwp.cns("app"), jQuery));













