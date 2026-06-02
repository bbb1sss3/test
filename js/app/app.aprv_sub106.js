/* Source File Upload Time : 2022-05-09 2:22:23 PM*/


/* Source File Upload Time : 5-7-20 4:25:08 PM*/


/* Source File Upload Time : 10-21-19 10:38:28 AM*/


/* Source File Upload Time : 2019-07-08 12:56:49 PM*/


/* Source File Upload Time : 2019-07-04 12:30:04 PM*/

/* Source File Upload Time : 2019-07-02 1:04:32 PM*/

/* Source File Upload Time : 2019-06-28 1:04:17 PM*/

/**
 * 전자결재 보조양식 - 접대사전신청서
 * $dwp.app.aprv_sub106
 */

//양식설계 function 시작

(function (_$$, $) {
    _$$.aprv_sub106 = {
        subdoc: {
            SUBNAME: "sub106",
            init: function ($doc) {
                var _me = _$$.aprv_sub106.subdoc,
                opt = $doc.options;
                var el = $doc.element;
                var _$table01 = $("table[name=sub106_Table01]", $doc.element);

                var _isedit = opt.isedit;

                if (opt.isedit == true && opt.docstatus != "draft") {
                    _isedit = false;
                }
			       //사용자 선택 팝업
                $("#search").on("click", function () {
                    // alert("@@")
                    $dwp.ui.org.orgsselect.init($(this), {
                        seltype: "0",
						count: 40,
                        selcallback: function (org) {
                            $("input[name=REQUSER1]").val(org.getDispName());
                        }
                    });
                });
					$("input[name='MeetingObject_2_1']").on("keyup", function () {
							    $(this).val($(this).val().replace(/[^0-9]/g, ""));
							});
								$("input[name='man_1']").on("keyup", function () {
							    $(this).val($(this).val().replace(/[^0-9]/g, ""));
							});
                var _opt = $.extend({}, opt, {
                        isedit: _isedit
                    });


                var _$table = _me.initInputTable(_opt, $doc, "");
                var _newopt = $.extend({}, _opt, {
                        dtable: _$table
                    });
                $doc.options = _newopt;

                $fn.orgsel($("[name='OrgReader1']", el), {
                    isedit: opt.isedit,
                    treetype: "0",
                    seltype: "0",
                    fld: "Users",
                    count: 50,
                    isseltype: false
					
                });
				  
				$('input[type=radio][name=Urgency1]').change(function() {
					if (this.value == '0') {
				    	$fn.alert({msg: $fn.getCodeMsg("aprv_sub_106.title.a21")});														
					} 
				});
                $('input[type=radio][name=Urgency2]').change(function() {
                    if (this.value == '0') {
                        $fn.alert({msg: $fn.getCodeMsg("aprv_sub_106.msg.a2")});
                    } 
                });
				
			    //전결기준 팝업
				$( '[name=_load2]' ,el).click(function() {
					var _form = "work_req";
					var _form = "wViwList89";									
		
					//dwp/aprv/hq/complete/aprvcomplete.nsf/
					var _rptDailog = $fn.dialog(null, {
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: el,
						title: $fn.getCodeMsg("aprv_sub_106.title.a22"),
						width: 700,
						height: 520,
						show: 'fade', //effect
						hide: 'fade', //effect
						langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_106.lang.js",
						content: {
							html: "",
							//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
							url: "dwp/aprv/com/aprvstart.nsf/Form106_image?OpenPage"
							//														, data : {view : _view
						,
							count: 15
						},
						close: function () { //2017.01.19

						}
					});
				});

                //지불증 접대비 양식 호출
                $("#_pop2").on("click", function () {

					var _url1 = "";

					// 지불증 접대비 양식을 호출					

					var opt = $doc.options;
					/////////////////
					///app/notesdata/dwp/aprv/com/aprvstart.nsf
					var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/comm_code.nsf/wcmdcheck_Form106?createdocument')
					var _param = {
						dbpath:"",
						actiontype:"",
						postdata: opt.key_unid,						
						WQS_Agent: 'cmdcheck_Form106'
					}

					var callback = function (data) {
						console.log('data :', data);
						
						$.unblockUI();						
						if (data.hasOwnProperty('result')) {                                            
							if (data.result >= '200' && data.result < '300') {
								//console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
								//$fn.alert({ msg: "환율: " + data.email + " ." });
								//$("[name=jumin]").val(data.email);
								//$("input[name='AppMRate']").val(data.email);								
								//출장정산서를 작성하기전에 완료문서를 기준으로 진행중이거나 출장정산서 완료(HR)함을 검색후 문서가 존재하면 작성되지 않도록 처리
								$fn.alert({ msg:"진행중이거나 이미 완료된 지불증[접대비] 문서가 존재합니다." });

								//view.refresh();
							} else if (data.result == '500') {      //진행함과 완료함에 정산서가 없으면 수행

								$fn.alert({ msg:"관리자에게 문의하세요." });

							} else if (data.result == '400') {      //진행함과 완료함에 정산서가 없으면 수행

								_url1 ="/dwp/aprv/com/aprvstart.nsf/wFrmApprove?openform";
								_url1 += "&FormCode=Form225";
                                //_url1 += "&FormCode=Form264";
								_url1 += "&org_dbpath=" + opt.cdb;
								_url1 += "&org_docid=" + opt.unid;					

								$fn.loadPage({ link: _url1, linktype: "PAGE" });
								//console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);								
							} else {
								$fn.alert({ msg: 'error' });
							}
						} else {
							$fn.alert({ msg: '관리자에게 문의' });
						}
					};
					$fn.cmdPost(_url, _param, callback, 'json');
					
				});	//출장정산서 작성 버튼 선택

            }

            //사용자 선택 팝업
        ,
            initInputTable: function (_opt, $doc) {
                var _me = _$$.aprv_sub106.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata]", $doc.element).val();

                var _$table = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table01']", $doc.element), {
                        isedit: _opt.isedit,
                        initdata: _tableVal,
                        template: "[name=_template]",
                        keyfield: ["_"],
                        changeafter: function (act, tr, inst) {
                            if (act == "del") {
                                //_me.cal_sum(el);										//삭제시 합계 재계산
                            } else if (act == "add") {
                                //_me.makeBudgetDspTrKey($doc.element,tr);					//TR의 키값 만들기.
                            } else if (act == "copy") {
                                //_me.cal_sum(el); 									//행 복사시 합계 재계산
                            }
                        }

                    });

            }
		
			   

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
        ,
            save: function ($doc, opt) {
                var _me = _$$.aprv_sub106.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({
                        actiontype: ""
                    }, opt);

                var el = $doc.element;

                var _isvalid = true;
			/*
                if ($("input[name='REQUSER1']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_106.msg.a8")
                    }); //촬영자
                    return false;
                }

                if ($("input[name='basicExample']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_106.msg.a9")
                    }); //촬영일시
                    return false;
                }

                if ($("input[name='Reason']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_106.msg.a10")
                    });
                    return false;
                }

                if ($("input[name='Reason_1']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_106.msg.a11")
                    });
                    return false;
                }

                if ($("input[name='Reason_1_1']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_106.msg.a12")
                    });
                    return false;
                }

                if ($("input[name='Reason_1_3']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_106.msg.a13")
                    }); //사유
                    return false;
                }
                if ($("input[name='Reason_2']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_106.msg.a14")
                    }); //촬영기기
                    return false;
                }
                if ($("input[name='REQUSER1_1']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_106.msg.a15")
                    }); //카메라관리자
                    return false;
                }*/
                return true;
            }
        }
    }
}
($dwp.cns("app"), jQuery));

