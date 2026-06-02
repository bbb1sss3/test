


/**
 * 전자결재 보조양식 - 대외발송공문
 * $dwp.app.aprv_sub065
 */

(function (_$$, $) {
    _$$.aprv_sub065 = {
        subdoc: {
            SUBNAME: "sub065"
            , init: function ($doc) {
                var _me = _$$.aprv_sub065.subdoc, opt = $doc.options;
                var el = $doc.element;				
				
				if(opt.docstatus=="complete"){
					//$("[name=seal]", $doc.element).attr("style","")
					$("[name=dbutton]", $doc.element).attr("style","display:block")	
					$("[name=seal]", $doc.element).attr("style","display:block")	
					
				}
				$("[name=jikin]",el).on("change", function () {
					var selectval=$("select[name=jikin] option:selected").val();

					if (selectval == "대표이사"){

						$("[name=ed_TailTitle2 ]",el).val("대 표 이 사 김 진 학")
					}else if (selectval == "생산팀장"){

						$("[name=ed_TailTitle2 ]",el).val("생 산 팀 장")
					}else if (selectval == "경영관리팀장"){

						$("[name=ed_TailTitle2 ]",el).val("경 영 관 리 팀 장")
					}else if (selectval == "자재팀장"){

						$("[name=ed_TailTitle2 ]",el).val("자 재 팀 장")
					}else if (selectval == "생산관리팀장"){

						$("[name=ed_TailTitle2 ]",el).val("생 산 관 리 팀 장")
					}else if (selectval == "품질팀장"){

						$("[name=ed_TailTitle2 ]",el).val("품 질 팀 장")
					}
				
				});
                $("[name=scm]",el).on("click", function () {
					
					$fn.confirm({msg : $fn.getCodeMsg("SCM게시 하시겠습니까?")}).done(function(){
						
						 $fn.xAjax({
						     url: '/dwp/aprv/com/aprvstart.nsf/wcmdpost?createdocument',
						     data: {
						         actiontype: "scminsert",
						         unid: opt.appdockey,
								 unid1: opt.unid
						     },
						     method: "POST",
						     dataType: "JSON",
						     async: true
							 ,cache : false
						 }).done(function (data) {
							 console.log(data);
							 console.log(data.unid);
							   if (data.unid == "Y" ) { //작업성공
										$fn.alert({ msg: '이미 SCM게시하였습니다.' });
										//$("[name=scm]",el).attr('disabled', true);
										return false;
						         } else { //작업실패!!!
						             if (data.result == "200" ) { //작업성공
										$fn.toast({ msg: 'SCM게시 완료하였습니다.' });
										//$("[name=scm]",el).attr('disabled', true);
										
						         } else { //작업실패!!!
						             $fn.alert({
						                 msg: $fn.getCodeMsg("sche.msg.err00")
						             });
						         }
						      }
							 
						        
								 
								
						   
						 }).fail(function (req, error) {
						     $fn.alert({
						         msg: $fn.getCodeMsg("sche.msg.err00")
						     });
						 });
						 
					})
					    
			});
				  $("[name=mailsend ]",el).on("click", function () {
					_me.AprDocTransfer($doc,'request_transfer')
				});
				
			
			
            }
			,
			//결재문서 전달 - 2019.08.21 by dwlee
 AprDocTransfer: function ($doc, act) {
	 var opt = $doc.options;
	 var _data = {
		 actiontype: act,
		 unid: opt.unid,
		 arg1: opt.cdb
		 
	 }
	 function transCallBack(data) {
		 if (data.hasOwnProperty("result")) {
			 if (data.result >= "200" && data.result < "300") {
				 //메일 작성화면 열기 - 
				 var _linkhtml = "";
				
				 
				// var _linkhtml = "";
				
				 _linkhtml = "<p style='LINE-HEIGHT: 120%; TEXT-INDENT: 0pt; MARGIN: 0px 0pt;font-family:맑은 고딕;font-size:10'></p>";
				 _linkhtml += "<p style='font-family:맑은 고딕;font-size:10pt;LINE-HEIGHT: 120%; TEXT-INDENT: 0pt; MARGIN: 0px 0pt'>";
				 _linkhtml += "<a href='https://gw.agtech.kr/dwp/aprv/com/draftbox_1.nsf/wfrmBridge?ReadForm&_=1&url=https://gw.agtech.kr/dwp/aprv/com/draftbox_1.nsf/0/" + data.unid + "?OpenDocument&popup=1&param=' target='_new'>";
				 
				 //_linkhtml += "문서연결 ☞ <font color='blue'>" + data.subject + "</font>";
				 _linkhtml += "대외공문 문서연결 ☞ <font color='blue'><span id='aprsubject'>" + data.subject + "</span></font>";
				 _linkhtml += "</a>";
				 _linkhtml += "</p>";
				 _linkhtml += "<p style='font-family:맑은 고딕;font-size:10pt;LINE-HEIGHT: 120%; TEXT-INDENT: 0pt; MARGIN: 0px 0pt'>";
				// _linkhtml += "(위 링크는 " + data.startdate + "부터 15일간 유효하며, 그 이후에는 연결이 되지 않습니다.)";
				// _linkhtml += "</p>";
				 _linkhtml += "<p style='font-family:맑은 고딕;font-size:10pt;LINE-HEIGHT: 120%; TEXT-INDENT: 0pt; MARGIN: 0px 0pt'>&nbsp;</p>";
				 
				 //수신인 없는 메일 작성화면 팝업
				 $fn.mailSend("", _linkhtml);
				
				// $fn.mailSend("", _linkhtml);
			 }
		 }
	 }
	 var _transurl = $fn.getProxyUrl(opt.cdb + '/wcmdpost?createdocument');
	 $fn.cmdPost(_transurl, _data, transCallBack, "json");
 }
			  

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                 var _me = _$$.aprv_sub065.subdoc, opt = $doc.options;
                var el = $doc.element;
				//$("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko"));
             return true; 
            }
			
			
        }
    }
}($dwp.cns("app"), jQuery));










