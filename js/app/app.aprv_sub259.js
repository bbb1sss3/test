/* Source File Upload Time : 2021-11-03 1:44:44 PM*/


/* Source File Upload Time : 11-19-20 9:42:39 AM*/


/* Source File Upload Time : 7-22-20 2:29:58 PM*/


/* Source File Upload Time : 4-17-20 2:10:01 PM*/


/* Source File Upload Time : 4-8-20 2:32:05 PM*/


/* Source File Upload Time : 2019-11-25 5:25:49 PM*/


/* Source File Upload Time : 9-11-19 11:12:22 AM*/


/* Source File Upload Time : 2019-07-16 6:20:17 PM*/


/* Source File Upload Time : 2019-07-12 5:48:29 PM*/


/* Source File Upload Time : 2019-07-11 11:40:30 AM*/


/* Source File Upload Time : 2019-07-04 5:21:48 PM*/


/* Source File Upload Time : 2019-07-02 1:04:32 PM*/


/* Source File Upload Time : 2019-06-28 1:04:17 PM*/


/**
 * 전자결재 보조양식 - 병가신청서
 * $dwp.app.aprv_sub259
 */

(function(_$$, $){
	_$$.aprv_sub259 = {
			subdoc : {
			SUBNAME				: "sub259"	
			, init : function($doc) {
				var _me = _$$.aprv_sub259.subdoc, opt = $doc.options;
				var el = $doc.element;
				var _$table01 = $("table[name=sub259_Table01]", $doc.element);
				
				var _org = $fn.getOrgUser($fn.getName($("input[name=From]", $doc.element).val()).ou);
				if (opt.isnew) {
				$("[name=_USER]", _$table01).val($dwp.core.lang.getCurMsg(_org.oinfo.username));
				$("input[name='_sign']").val($dwp.core.lang.getCurMsg(_org.oinfo.username));
				$("[name=_DEPTNAME]", _$table01).val($dwp.core.lang.getCurMsg(_org.oinfo.orgname));
				$("[name=_TITLE]").val($("input[name='Titlename_1']").val())
				$("input[name='FromDate']",el).removeAttr("readonly");
				$("[name=_SABUN]").val($("input[name='sabun1']").val());
				 $("[name=FromDate]", $doc.element).attr({'placeholder' : "YYYY.MM.DD"   });      
				}
				//$(document).ready(function () {
				//alert($("#vflag_2").val());
				if($("#vflag_2").val()=="0"){ 
						//$("#vflag_1").val("1") ;
						
					$('#css_test').attr("style","display:block");
					$('#css_test1').attr("style","display:none");
				}else{
					//$("#vflag_1").val("0") ;
					$('#css_test1').attr("style","display:block");
					$('#css_test').attr("style","display:none");
				
					
				}
		


				//  });
					
				$("#deptedit").on("click", function () {
					
					if($("#vflag_1").val()=="0"){ 
						$("#vflag_1").val("1") ;
						$('#css_test').attr("style","display:none");
						$('#css_test1').attr("style","display:block");
					}else{
						$("#vflag_1").val("0") ;
						$('#css_test1').attr("style","display:none");
						$('#css_test').attr("style","display:block");
					}
					//$('#edit1').attr('data-xlang-code', 'aprv_sub_259.msg.a5'); // name 속성을 hero로 변경
					//data-xlang-code="aprv_sub_259.msg.a1"
				});
		
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
						//$("input[name='_SABUN']").val($dwp.core.lang.getCurMsg(ui.item.value.empno));
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
				$("#_pop5").on("click", function () {
								
					var _rptDailog = $fn.dialog(null, {
						modal: true,
						resizable: false,
						draggable: true,
						islangconvert: false,
						referdata: el,
						title: $fn.getCodeMsg("aprv_sub_259.title.a21"),
						width: 1100,
						height: 800,
						show: 'fade', //effect
						hide: 'fade', //effect
						langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_259.lang.js",
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
				
				var _$fromdate12 = $("input[name='FromDate_1']");
				_$fromdate12.bind("change" , function(){
					_dateTerm("FromDate_1" , "ToDate" , "ed_day");
				} );	
				var _$fromdate13 = $("input[name='ToDate']");
				_$fromdate13.bind("change" , function(){
					_dateTerm("FromDate_1" , "ToDate" , "ed_day");
				} );	
				
				var _$fromdate14 = $("input[name='FromDate_1_1']");
				_$fromdate14.bind("change" , function(){
					_dateTerm("FromDate_1_1" , "ToDate_1" , "ed_day_1");
				} );	
				var _$fromdate15 = $("input[name='ToDate_1']");
				_$fromdate15.bind("change" , function(){
					_dateTerm("FromDate_1_1" , "ToDate_1" , "ed_day_1");
				});
				
				var _$fromdate16 = $("input[name='FromDate_1_2']");
				_$fromdate16.bind("change" , function(){
					_dateTerm("FromDate_1_2" , "ToDate_2" , "ed_day_2");
				});
				var _$fromdate17 = $("input[name='ToDate_2']");
				_$fromdate17.bind("change" , function(){
					_dateTerm("FromDate_1_2" , "ToDate_2" , "ed_day_2");
				});
				
				var _$fromdate18 = $("input[name='FromDate_1_2_1']");
				_$fromdate18.bind("change" , function(){
					_dateTerm("FromDate_1_2_1" , "ToDate_2_1" , "ed_day_3");
				});
				var _$fromdate19 = $("input[name='ToDate_2_1']");
				_$fromdate19.bind("change" , function(){
					_dateTerm("FromDate_1_2_1" , "ToDate_2_1" , "ed_day_3");
				});
				
				
					// 날짜 박일 계산 함수
				//몇박 몇일을 계산하는 루틴.....
				function _dateTerm( strFrom , strTo , strLange) {
					vSDate = $("input[name='"+strFrom+"']").val();
					vEDate = $("input[name='"+strTo+"']").val();
					if ( vSDate == "" || vEDate == "" ) return -100;
					
					var strSDate = vSDate;
					var strEDate = vEDate;
					var arrSDate = new Array(3);
					var arrEDate = new Array(3);
					
					if ( strSDate.indexOf("-") > 0 ) {
						arrSDate = strSDate.split("-");
						arrEDate = strEDate.split("-");
					
					} else if ( strSDate.indexOf("/") > 0 ) {
						arrSDate = strSDate.split("/");
						arrEDate = strEDate.split("/");	
					} else if ( strSDate.indexOf(".") > 0 ) {
						arrSDate = strSDate.split(".");
						arrEDate = strEDate.split(".");	
					}
					
					var vSMonth = eval(arrSDate[1]) - 1;
					var vEMonth = eval(arrEDate[1]) - 1;
						
					var dSDate = new Date(arrSDate[0], vSMonth.toString(), arrSDate[2]);
					var dEDate = new Date(arrEDate[0], vEMonth.toString(), arrEDate[2]);
					
					var vStr = ( dEDate.getTime() - dSDate.getTime() ) / ( 24*60*60*1000 ) + 1;
					
					if(vStr > 31){
						$fn.alert({msg : $fn.getCodeMsg("신청기간이 31일을 초과 할수 없습니다.")});    //발생개요
						$("input[name='"+strTo+"']", $doc.element).xval("");
						$("input[name='"+strLange+"']", $doc.element).xval("");
						return false;
					}
					
					$("input[name='"+strLange+"']", $doc.element).xval(vStr);

					//$("input[name='AppNightC']", $doc.element).xval(vStr-1);

					//document.forms[0].AppDayC.value = vStr ;
					//document.forms[0].AppNightC.value = vStr -1;
					//return vStr;
				}
				
			}
	
			/* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
			, save : function($doc,opt){
				var _me = _$$.aprv_sub259.subdoc;	
				var _opt = $doc.options;
				var _aopt = $.extend({actiontype:""}, opt);
				var el = $doc.element;				
				
			if ($("input[name='_DEPTNAME']",el).xval() == "") {
					$fn.alert({msg : $fn.getCodeMsg("aprv_sub_259.msg.a6")});    //소속정보
					return false;
				}
				
				if ($("input[name='_Job']",el).xval() == "") {
					$fn.alert({msg : $fn.getCodeMsg("aprv_sub_259.msg.a7")});   //담당업무 
					return false;
				}
				
					if ($("input[name='ed_phone']",el).xval() == "") {
					$fn.alert({msg : $fn.getCodeMsg("aprv_sub_259.msg.a8")});    //연락처
					return false;
				}
				
					if ($("input[name='ed_reason']",el).xval() == "") {
					$fn.alert({msg : $fn.getCodeMsg("aprv_sub_259.msg.a9")});    //발생개요
					return false;
				}

				//console.log("082 save : ", _isvalid);
				return true;					
			}
		}
	}
}($dwp.cns("app"), jQuery));













