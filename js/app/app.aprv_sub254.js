/* Source File Upload Time : 2021-07-21 6:56:22 PM*/


/* Source File Upload Time : 2021-07-19 10:38:19 AM*/


/* Source File Upload Time : 2021-02-03 12:35:01 PM*/


/* Source File Upload Time : 11-19-20 9:40:00 AM*/


/* Source File Upload Time : 7-9-20 4:09:54 PM*/


/* Source File Upload Time : 6-19-20 5:58:17 PM*/


/* Source File Upload Time : 4-17-20 5:29:48 PM*/


/* Source File Upload Time : 3-6-20 10:41:17 AM*/


/* Source File Upload Time : 10-1-19 9:56:16 AM*/


/* Source File Upload Time : 9-11-19 4:36:11 PM*/


/* Source File Upload Time : 2019-08-02 11:58:13 AM*/


/* Source File Upload Time : 2019-07-12 5:48:29 PM*/


/* Source File Upload Time : 2019-07-11 11:40:30 AM*/


/* Source File Upload Time : 2019-07-04 5:21:48 PM*/


/* Source File Upload Time : 2019-07-02 1:04:32 PM*/


/* Source File Upload Time : 2019-06-28 1:04:17 PM*/


/**
 * 전자결재 보조양식 - ikey 사용신청서
 * $dwp.app.aprv_sub254
 */
 


(function(_$$, $){
	_$$.aprv_sub254 = {
			subdoc : {
					SUBNAME				: "sub254"	
					, init : function($doc) {
							var _me = _$$.aprv_sub254.subdoc, opt = $doc.options;
							var el = $doc.element;
							var _$table01 = $("table[name=sub254_Table01]", $doc.element);
							//$('#basicExample').timepicker(); 
                            //$('#basicExample1').timepicker(); 
							 if (opt.isnew) {
								   $("[name=Subject]", $doc.element).attr({'placeholder' : $fn.getCodeMsg("aprv_sub_254.title.a15")   });       
								 //$fn.getCodeMsg("aprv_sub_254.title.a13")
							    // $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko"));
							 }
								var _org = $fn.getOrgUser($fn.getName($("input[name=From]", $doc.element).val()).ou);
							 if (opt.isnew) {
								$("[name=_USER]", _$table01).val($dwp.core.lang.getCurMsg(_org.oinfo.username));
								$("[name=_DEPTNAME]", _$table01).val($dwp.core.lang.getCurMsg(_org.oinfo.orgname));
								var _info = $dwp.cns("core.info");
								if(_info.cuser.lang == "ko"){
									$("[name=_TITLE]").val($("input[name='Titlename_1']").val());
								}else{
									$("[name=_TITLE]").val($("input[name='Titlename_2']").val());
								}
								//$("[name=_TITLE]").val($dwp.core.lang.getCurMsg(_org.oinfo.pos));
								$("[name=_SABUN]").val($("input[name='sabun1']").val());
								$("[name=_sign]").val($dwp.core.lang.getCurMsg(_org.oinfo.username));
							 }
										//alert("@@")
							       		$fn.orgsel($("[name='org']", el), {
							       		    isedit: true,
							       		    treetype: "0",
							       		    seltype: "2",
							       		    isseltype: false,
							       		    autodraw: false,
							       		    autoseletcomplete: function (event, ui, doc) {
												$("input[name='_USER']").val($dwp.core.lang.getCurMsg(ui.item.value.username));
												$("input[name='_sign']").val($dwp.core.lang.getCurMsg(ui.item.value.username));
							       		        $("input[name='_TITLE']").val($dwp.core.lang.getCurMsg(ui.item.value.pos));
							       		        $("input[name='_APRTITLE']").val($dwp.core.lang.getCurMsg(ui.item.value.pos));
							       		        $("input[name='_DEPTNAME']").val($dwp.core.lang.getCurMsg(ui.item.value.orgname));
												$("input[name='_SABUN']").val($dwp.core.lang.getCurMsg(ui.item.value.rempno));
							       		    },
							       		    orgselectcomplete: function (dialog, rtndata, doc) {
							       		        //사용자를 선택하지 않고 확인 버튼을 클릭하는 경우
							       		        if (rtndata.list.length < 1) {
							       		            return false;
							       		        }
							       		        $("input[name='_USER']").val($dwp.core.lang.getCurMsg(rtndata.list[0].username));
												 $("input[name='_sign']").val($dwp.core.lang.getCurMsg(rtndata.list[0].username));
							       		        $("input[name='_TITLE']").val($dwp.core.lang.getCurMsg(rtndata.list[0].pos));
							       		        $("input[name='_APRTITLE']").val($dwp.core.lang.getCurMsg(rtndata.list[0].pos));
							       		        $("input[name='_DEPTNAME']").val($dwp.core.lang.getCurMsg(rtndata.list[0].orgname));
												$("input[name='_SABUN']").val($dwp.core.lang.getCurMsg(rtndata.list[0].rempno));
							       		    },
							       		    fld: "User",
							       		    count: 1
							       		});
										
												//기능직사용선택
												$("#_pop2").on("click", function () {
												    
												    var _rptDailog = $fn.dialog(null, {
												            modal: true,
												            resizable: false,
												            draggable: true,
												            islangconvert: false,
												            referdata: el,
												            title: $fn.getCodeMsg("aprv_sub_254.title.a14"),
												            width: 1100,
												            height: 800,
												            show: 'fade', //effect
												            hide: 'fade', //effect
												            langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_254.lang.js",
												            buttons: [],
												            content: {
												                html: "",
												                //url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
												                url: "/dwp/com/sys/hr_emp.nsf" + "/wFrmView_pop?ReadForm&view=w_pop_hr_emp"

												            },
												            close: function () { //2017.01.19

												            }

												        });
												}); //기능직사용선택 끝
							
													//지급기준 팝업
												$( "#_load2" ).click(function() {
													var _form = "work_req";
													var _form = "wViwList89";									
										
													//dwp/aprv/hq/complete/aprvcomplete.nsf/
													var _rptDailog = $fn.dialog(null, {
														modal: true,
														resizable: false,
														draggable: true,
														islangconvert: false,
														referdata: el,
														title: $fn.getCodeMsg("aprv_sub_254.title.a17"),
														width: 900,
														height: 730,
														show: 'fade', //effect
														hide: 'fade', //effect
														langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_254.lang.js",
														content: {
															html: "",
															//url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
															url: "dwp/aprv/com/aprvstart.nsf/Form216_image?OpenPage"
															//														, data : {view : _view
														,
															count: 15
														},
														close: function () { //2017.01.19

														}
													});
												});
					
					}
	
				/* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
				, save : function($doc,opt){
					var _me = _$$.aprv_sub254.subdoc;	
					
					var _opt = $doc.options;
         					var _aopt = $.extend({actiontype:""}, opt);
         			
					
                                      
                    var el = $doc.element;		

					
				
					
					if ($("[name=_location_1_Nm]",el).val() == "ko: ,jp: ") {
						$fn.alert({msg : $fn.getCodeMsg("aprv_sub_254.title.a18")});   //휴가종류 
						return false;
					}
					 if ($("#basicExample").val() == "") {
         				$fn.alert({msg : $fn.getCodeMsg("aprv_sub_254.title.a13")});   //촬영일시 
         				return false;
         			}
					
					 if($("[name=FromDate_1]", el).val() > $("[name=ToDate]", el).val() ){
                        $fn.alert({msg : $fn.getCodeMsg("aprv_sub_254.title.a16")});   //촬영일시 
         				return false;
                    }
					//$("[name=Subject]", $doc.element).val("");
							var _sub = $("[name=Subject]", $doc.element).val() + " ★ (" + $("[name=_USER]", $doc.element).val() + ")";

							var idx = -1;

							var cnt = 0;

							do {

							    idx = _sub.indexOf('(', idx + 1);

							    if (idx != -1) {

							        cnt++;

							    }

							} while (idx != -1);

							//alert(_sub.split('(').length - 1)

							if (_sub.split('(').length - 1 > 1) {
							    _sub = _sub.split("★");
							    $("[name=Subject]", $doc.element).val(_sub[0]);
							} else {
							    _sub = _sub.split("★");
							    $("[name=Subject]", $doc.element).val(_sub[0] + _sub[1]);

							}
         			//var _isvalid = true;
                    //alert($("input[name='fld_formdata']",el).xval())
         			//alert(_$table)
                    //var $input = $("input[name='_USER']", $cell);
                  
         			  //alert(  $input.xval())
                    
					
                    
                  
					
					//console.log("082 save : ", _isvalid);
					return true;					
				}
			}
	}
}($dwp.cns("app"), jQuery));
















