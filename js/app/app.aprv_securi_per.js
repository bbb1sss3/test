/* Source File Upload Time : 11-15-19 1:06:24 PM*/


/**
 * 전자결재 JS
 */
(function (_$$, $) {
	_$$.aprv_securi_per = {
		custom: {
			init: function ($did) {
				var that = this, _$did = $did, _el = _$did.element;

				var _pinfo = $fn.getCurUser().pinfo;
				//var _$pwchk = $("input[name=PWCheck]", _el);
				//var _$loginpwd = $("input[name=LoginPassword]", _el);   //로그인 비밀번호
				//var _$pwd = $("input[name=Password]", _el);             //결재 비밀번호

				var _cempno = _pinfo.empno;
				//사인url가져오기
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
					method: 'POST',
					dataType: 'json',
					data: {
						pI_INSACODE: _cempno,
						actiontype: "huga"
					},
					async: false,
					cache: false
				}).done(function (data) {
					console.log("처리", data);
					//_Universalid = data.Universalid
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});


				// 개인정보서약서 저장처리
				$(".dwp-btn.confirm4", _el).off("click").on("click", function () {
					//debugger;

					if($('input:radio[name=Urgency1]',_el).is(':checked')){						

						if( $('input[name=Urgency1]:checked',_el).val()=="1"){
							$fn.alert({msg : $fn.getCodeMsg("필수정보 항목에 동의를 선택하세요.")});    //사유
							return false;
						}
						
					}else{
						$fn.alert({msg : $fn.getCodeMsg("필수정보 항목에 동의를 선택하세요.")});    //사유
						return false;
					}
					if($('input:radio[name=Urgency1_1]',_el).is(':checked')){
						if( $('input[name=Urgency1_1]:checked',_el).val()=="1"){
							$fn.alert({msg : $fn.getCodeMsg("민감정보 항목에 동의를 선택하세요.")});    //사유
							return false;
						}
					}else{
						$fn.alert({msg : $fn.getCodeMsg("민감정보 항목에 동의를 선택하세요.")});    //사유
						return false;
					}

					// 문구공백이면 진행안햄
					if ($("[name=vsname2]", _el).val() == "") {
						//fn.getCurLangMsg(_pinfo.name, ",", "ko")+", 동의합니다.")
						//var _name = $fn.getCurLangMsg(_pinfo.name, ",", "ko");
						$fn.alert({ msg: $fn.getCodeMsg("성명을 입력하세요") });    //사유
						return false;
					}
					var _cyear = $("[name=DYear_1] option:selected", _el).val();
					
					//$("[name=DMonth_1] option:selected",_el).val();
					
					//alert($("[name=vsname]", _el).val())
					//정보서약서 디비 저장
					$fn.xAjax({
						url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form003post?createdocument'),
						method: 'POST',
						dataType: 'json',
						data: {
							pI_INSACODE: _pinfo.empno,
							pDateid: _cyear,
							pSKtxCode: $fn.getCurLangMsg(_pinfo.orgname, ",", "ko"),
							pEKtxCode: "",
							dmoney: $fn.getCurLangMsg(_pinfo.name, ",", "ko"),
							arg1: $("[name=vsname2]", _el).val(), 
							actiontype: "scsave3"
						},
						async: false,
						cache: false
					}).done(function (data) {
						console.log("처리", data);
						//_Universalid = data.Universalid
						$fn.toast({ msg: _cyear + "년 개인정보의 수집·이용에 관한 동의서 작성 완료하였습니다." });
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






