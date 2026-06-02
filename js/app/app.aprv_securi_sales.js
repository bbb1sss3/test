/* Source File Upload Time : 11-15-19 1:06:24 PM*/


/**
 * 전자결재 JS
 */
(function (_$$, $) {
	_$$.aprv_securi_sales = {
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




				// 영업비밀 저장처리
				$(".dwp-btn.confirm2", _el).off("click").on("click", function () {
					//debugger;

					// 문구공백이면 진행안햄
					if ($("[name=vsname]", _el).val() == "") {
						//fn.getCurLangMsg(_pinfo.name, ",", "ko")+", 동의합니다.")
						//var _name = $fn.getCurLangMsg(_pinfo.name, ",", "ko");
						$fn.alert({ msg: $fn.getCodeMsg("성명을 입력하세요") });    //사유
						return false;
					}
					var _cyear = $("[name=DYear_1] option:selected", _el).val();
					var _syear = $("[name=DYear_2] option:selected", _el).val();
					var _smonth = $("[name=DMonth_2] option:selected", _el).val();
					var _sday = $("[name=DDay_2] option:selected", _el).val();
					//$("[name=DMonth_1] option:selected",_el).val();
					
					if(_syear =="선택" || _smonth=="선택" || _sday=="선택" ){
						$fn.alert({ msg: $fn.getCodeMsg("생년월일을 선택하세요") });    //사유
						return false;
					}
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
							pEKtxCode: _syear +"-"+ _smonth +"-"+ _sday,
							dmoney: $fn.getCurLangMsg(_pinfo.name, ",", "ko"),
							arg1: $("[name=vsname]", _el).val(), 
							actiontype: "scsave1"
						},
						async: false,
						cache: false
					}).done(function (data) {
						console.log("처리", data);
						//_Universalid = data.Universalid
						$fn.toast({ msg: _cyear + "년 영업비밀 보호 서약서 작성 완료하였습니다." });
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




