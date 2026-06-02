/* Source File Upload Time : 11-15-19 1:06:24 PM*/


/**
 * 전자결재 JS
 */
(function (_$$, $) {
	_$$.aprv_securi = {
		custom: {
			init: function ($did) {
				var that = this, _$did = $did, _el = _$did.element;

				var _pinfo = $fn.getCurUser().pinfo;
				var _$pwchk = $("input[name=PWCheck]", _el);
				var _$loginpwd = $("input[name=LoginPassword]", _el);   //로그인 비밀번호
				var _$pwd = $("input[name=Password]", _el);             //결재 비밀번호

				var _cempno=_pinfo.empno;
				//사인url가져오기
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),		
					method: 'POST',		
					dataType: 'json',
					data: {
						pI_INSACODE: _cempno,							
						actiontype:"huga"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리",data);					
					_Universalid=data.Universalid
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				
				$("[name=vrsign]", _el).html("<img src='/dwp/aprv/com/sign.nsf"+_Universalid+ "' style='max-height:55px;max-width:80px;'>")
				$("[name=vvsign]", _el).attr("placeholder",$fn.getCurLangMsg(_pinfo.name, ",", "ko")+", 동의합니다.")
				//<img src="/dwp/aprv/com/sign.nsf/vwlookup/220225180114_3635DA316966C573492587F400318D4B/$FILE/P00140.png" style="max-height:55px;max-width:80px;">
				

				//모두동의 선택시 모든 동의 선택 Urgency1_5
				$("[name=Urgency1_5]", _el).off("click").on("click", function () {
					$("input:radio[name='Urgency1']:radio[value='0']", _el).prop('checked', true);
					$("input:radio[name='Urgency1_1']:radio[value='0']", _el).prop('checked', true);
					$("input:radio[name='Urgency1_2']:radio[value='0']", _el).prop('checked', true);
					$("input:radio[name='Urgency1_2_1']:radio[value='0']", _el).prop('checked', true);
					$("input:radio[name='Urgency1_3']:radio[value='0']", _el).prop('checked', true);
					$("input:radio[name='Urgency1_4']:radio[value='0']", _el).prop('checked', true);
				});

				//$("input:radio[name='fruits']:radio[value='사과']").prop('checked', true); // 선택하기
				/*
				// 초기값 설정;
				if (_pinfo.aprvinfo.pwdchk != "Y") {
					_$pwchk.prop("checked", true);
					_$loginpwd.prop("disabled", true);
					_$pwd.prop("disabled", true);
				} else {
					_$pwchk.prop("checked", false);
					_$loginpwd.prop("disabled", false);
					_$pwd.prop("disabled", false);
				}

				_$pwchk.off("change").on("change", function () {
					if (this.checked) {
						_$loginpwd.prop("disabled", true);
						_$pwd.prop("disabled", true);
						_$loginpwd.xval("");
						_$pwd.xval("");
					} else {
						_$loginpwd.prop("disabled", false);
						_$pwd.prop("disabled", false);
					}
				});

				_$loginpwd.off("keydown").on("keydown", function (event) {	//로그인 비밀번호 입력 체크
					if (event.keyCode == 13) {
						if ($(event.target).xval() == "") {
							$fn.alert({ msg: $fn.getCodeMsg("comm.title.ltitle4") }, function () { _$loginpwd.focus() });
							return false;
						} else {
							_$pwd.focus();
						}
					}
				});

				_$pwd.off("keydown").on("keydown", function (event) {		//결재 비밀번호 입력 체크
					if (event.keyCode == 13) {
						if ($(event.target).xval() == "") {
							$fn.alert({ msg: $fn.getCodeMsg("comm.title.ltitle4") }, function () { _$pwd.focus() });
							return false;
						} else {
							$(".dwp-btn.confirm", _el).trigger("click");
						}
					}
				});

				
				$("xxx[name='_wFrmAprvPw']", _el).off("keydown").bind("keydown", function () {
					if (event.keyCode === 13) {
						$(".dwp-btn.confirm", _el).trigger("click");
					}
				}).attr("autocomplete", "off").attr("role", "presentation");
				*/
			

				// 저장처리
				$(".dwp-btn.confirm1", _el).off("click").on("click", function () {
					//debugger;
					if($('input:radio[name=Urgency1]',_el).is(':checked')){						

						if( $('input[name=Urgency1]:checked',_el).val()=="1"){
							$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
							return false;
						}
						
					}else{
						$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
						return false;
					}
					if($('input:radio[name=Urgency1_1]',_el).is(':checked')){
						if( $('input[name=Urgency1_1]:checked',_el).val()=="1"){
							$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
							return false;
						}
					}else{
						$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
						return false;
					}
					if($('input:radio[name=Urgency1_2]',_el).is(':checked')){
						if( $('input[name=Urgency1_2]:checked',_el).val()=="1"){
							$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
							return false;
						}
					}else{
						$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
						return false;
					}
					if($('input:radio[name=Urgency1_2_1]',_el).is(':checked')){
						if( $('input[name=Urgency1_2_1]:checked',_el).val()=="1"){
							$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
							return false;
						}
					}else{
						$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
						return false;
					}
					if($('input:radio[name=Urgency1_3]',_el).is(':checked')){
						if( $('input[name=Urgency1_3]:checked',_el).val()=="1"){
							$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
							return false;
						}
					}else{
						$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
						return false;
					}
					if($('input:radio[name=Urgency1_4]',_el).is(':checked')){
						if( $('input[name=Urgency1_4]:checked',_el).val()=="1"){
							$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
							return false;
						}
					}else{
						$fn.alert({msg : $fn.getCodeMsg("서약서 항목에 동의를 선택하세요.")});    //사유
						return false;
					}
					// 문구공백이면 진행안햄
					if($("[name=vvsign]", _el).val() == ""){
						//fn.getCurLangMsg(_pinfo.name, ",", "ko")+", 동의합니다.")
						var _name=$fn.getCurLangMsg(_pinfo.name, ",", "ko");
						$fn.alert({msg : $fn.getCodeMsg("서약자에 '"+_name+",동의합니다.' 를 입력하세요")});    //사유
						return false;
					}
					
					var _year=$("[name=DYear_1] option:selected",_el).val();
					//$("[name=DMonth_1] option:selected",_el).val();
					var bunki;
					if($("[name=DMonth_1] option:selected",_el).val()=="1"||
							$("[name=DMonth_1] option:selected",_el).val()=="2"||
							$("[name=DMonth_1] option:selected",_el).val()=="3"
						){
							bunki="1"
					}
					if($("[name=DMonth_1] option:selected",_el).val()=="4"||
							$("[name=DMonth_1] option:selected",_el).val()=="5"||
							$("[name=DMonth_1] option:selected",_el).val()=="6"
						){
						bunki="2"
					}
					if($("[name=DMonth_1] option:selected",_el).val()=="7"||
							$("[name=DMonth_1] option:selected",_el).val()=="8"||
							$("[name=DMonth_1] option:selected",_el).val()=="9"
						){
						bunki="3"
					}
					if($("[name=DMonth_1] option:selected",_el).val()=="10"||
							$("[name=DMonth_1] option:selected",_el).val()=="11"||
							$("[name=DMonth_1] option:selected",_el).val()=="12"
						){
						bunki="4"
					}

					//정보서약서 디비 저장
					$fn.xAjax({
						url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),		
						method: 'POST',		
						dataType: 'json',
						data: {
							pI_INSACODE: _pinfo.empno,	
							pDateid : _year+"^"+bunki,
							pSKtxCode:$("[name=vvsign]", _el).val(), 	
							pEKtxCode:_year+$("[name=DMonth_1] option:selected",_el).val()+$("[name=DDay_1] option:selected",_el).val(),	
							dmoney:$fn.getCurLangMsg(_pinfo.name, ",", "ko"),
							actiontype:"scsave"
						},
						async: false,
						cache: false
					}).done(function (data) {
						console.log("처리",data);					
						_Universalid=data.Universalid
						$fn.toast({msg :_year+"년 "+bunki+"분기 정보시스템 사용 보안 서약서 완료하였습니다." });
						_$did.xdialog("instance").close();
					}).fail(function (req, error) {
						console.log(req.responseText + '\n' + error);
					});
					
				});
				
				$(".dwp-btn.cancel", _el).off("click").on("click", function () {
					//_$did.xdialog("instance").close();
				});
			}
		}
	};
})($dwp.cns('app'), jQuery);





