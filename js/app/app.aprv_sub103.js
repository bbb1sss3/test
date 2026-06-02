/* Source File Upload Time : 2022-02-28 10:35:38 AM*/


/* Source File Upload Time : 2022-02-18 12:01:15 PM*/


/* Source File Upload Time : 2022-01-13 4:34:04 PM*/


/* Source File Upload Time : 2021-11-19 4:39:37 PM*/


/* Source File Upload Time : 2021-11-16 4:39:30 PM*/


/* Source File Upload Time : 2021-09-28 10:51:46 AM*/


/* Source File Upload Time : 2021-09-16 2:57:40 PM*/


/* Source File Upload Time : 2021-09-13 4:36:14 PM*/


/* Source File Upload Time : 2021-09-13 9:11:36 AM*/


/* Source File Upload Time : 2021-08-30 11:30:57 AM*/


/* Source File Upload Time : 2021-07-21 9:13:38 AM*/


/* Source File Upload Time : 2021-07-14 6:25:02 PM*/


/* Source File Upload Time : 2021-03-15 11:13:03 AM*/


/* Source File Upload Time : 2021-02-24 8:30:06 AM*/


/* Source File Upload Time : 2021-02-16 6:29:05 PM*/


/* Source File Upload Time : 10-27-20 4:58:15 PM*/


/* Source File Upload Time : 9-22-20 3:38:01 PM*/


/* Source File Upload Time : 9-21-20 4:06:55 PM*/


/* Source File Upload Time : 9-18-20 11:36:24 AM*/


/* Source File Upload Time : 9-9-20 12:44:27 PM*/


/* Source File Upload Time : 9-2-20 1:08:36 PM*/


/* Source File Upload Time : 8-19-20 2:10:03 PM*/


/* Source File Upload Time : 8-19-20 9:20:46 AM*/


/* Source File Upload Time : 8-12-20 1:02:47 PM*/


/* Source File Upload Time : 7-23-20 12:22:37 PM*/


/* Source File Upload Time : 7-14-20 11:03:38 AM*/


/* Source File Upload Time : 7-13-20 4:51:53 PM*/


/* Source File Upload Time : 6-19-20 11:43:03 AM*/


/* Source File Upload Time : 5-14-20 9:51:49 AM*/


/* Source File Upload Time : 5-12-20 2:23:06 PM*/


/* Source File Upload Time : 4-20-20 2:46:12 PM*/


/* Source File Upload Time : 2020-03-12 1:28:55 AM*/


/* Source File Upload Time : 2020-02-26 2:07:10 AM*/


/* Source File Upload Time : 2-25-20 3:05:58 PM*/


/* Source File Upload Time : 2019-12-12 8:24:17 PM*/


/* Source File Upload Time : 2019-12-12 8:09:45 PM*/


/* Source File Upload Time : 2019-11-25 9:22:08 AM*/


/* Source File Upload Time : 2019-11-18 7:10:22 PM*/


/* Source File Upload Time : 2019-07-18 3:33:41 PM*/


/* Source File Upload Time : 2019-07-05 3:34:46 PM*/

/**
 * 전자결재 보조양식 - 구매승인신청서
 * $dwp.app.aprv_sub103
 */

//양식설계 function 시작

(function (_$$, $) {
    _$$.aprv_sub103 = {
        subdoc: {
            SUBNAME: "sub103",
            PAMT_DB                              : "/dwp/com/work/purchase_aprv_master.nsf",									//구매승인 관리 DB
            PAMT_LOG_DB                          : "/dwp/com/work/purchase_aprv_master.nsf",									//구매승인 관리 로그 DB
            MVLOG_DB 				: "/dwp/com/log/mvlog.nsf",
			init: function ($doc) {
                var _me = _$$.aprv_sub103.subdoc;
                var opt = $doc.options;
                var el = $doc.element;
                
                var _isedit = opt.isedit;		
                //결재 중간에 편집시에는 구매승인요청서 영역 편집 불가
                if (opt.isedit == true && opt.docstatus != "draft") {
                    _isedit = false;
                }			
                var _opt = $.extend({}, opt , {isedittable : _isedit});
               // var _opt = $.extend({}, opt, { isedit: _isedit });         

				 _me.change_color(el);
                console.log('S::구매승인요청서');
                //console.log('S::언어' + $fn.getCurLangMsg(_author_disp_lang));
                console.log("user info::", $fn.getCurUser());
					//$("._row_0").css("border", "solid 1px pink");


				 // $("table#sub103_Table01 _row_0").css("backgroundColor", "#CECEF6");
				  //  $("table#sub103_Table01 _row_1").css("backgroundColor", "green")
                //새문서일 경우
                if (opt.isnew) {
                    //$("[name=Subject]", $doc.element).val($fn.getCurLangMsg(opt.appCfg.sFormTitle, ",", "ko"));
                }

                var _lvl_keylist = lvlkeylist.split(",");                
                var _lvl_codelist = lvlcodelist.split(",");                
                var _lvl_codenamelist = lvlcodenamelist.split(",");

                var _$sel_obj0 = $("select[name='ed_location']");
                var _$sel_obj1 = $("select[name='ed_gubun']");
                var _$sel_obj2 = $("<select name='ed_acccode'></select>").appendTo($("div.firstChoice", $doc.element));
				
				
				 var _$upload = $("input[name='_pop2']", el);
				 //var _$dept = $("input[name='_pop3']", el);
				 var _$cominfo = $("input[name='_pop4']", el);
				 
				 $("#_pop2",el).on("click", function () {
					 _me._excelUpload(el,_opt);
				});
                if (opt.isnew) {
                    //사업부 기안자 소속별 선택
                    if($("[name=work1]", el).val()=="C1"){
                        $("[name=ed_location ]", el).val("C1")
                    }else if($("[name=work1]", el).val()=="E1"){
                        $("[name=ed_location]", el).val("E1")
                    }else if($("[name=work1]", el).val()=="S1"){
                        $("[name=ed_location]", el).val("S1")
                    }else if($("[name=work1]", el).val()=="R1"){
                        $("[name=ed_location]", el).val("R1")
                    }
				
                  }
				
				
                _$sel_obj0.bind("change" , function(){
                    //alert("TEST");
                    //alert($("select[name='_location']", el).val());
                    //alert($("select[name='_location']", el).val());
                    
                    var _selectedKey = $("select[name='ed_location']", el).val().trim()+"^"+ $("select[name='ed_gubun']", el).val().trim();
                    //alert(_selectedKey);
                    //계정 정보 초기화
                    _$sel_obj2.find("option").remove();

                    for (var x=0 ; x < _lvl_keylist.length ; x++) {
                        //console.log(x + ":" + String(_lvl_keylist[x]).trim()+":");

                        if ( _selectedKey == String(_lvl_keylist[x]).trim())    {
                            //console.log('KEY:['+ x +']' + _selectedKey +"%") ;
                            //console.log('CODE:['+ x +']' +String( _lvl_codelist[x]).trim()+"%");
                            //console.log('NAME:['+ x +']' +String(_lvl_codenamelist[x]).trim()+"%");

                            _option = new Option(String(_lvl_codenamelist[x]).trim(), String( _lvl_codelist[x]).trim());
                            _$sel_obj2.append(_option);
                        }
                    }
                    //var _val = $("input[name='_acccodeName']", $doc.element).find("option:selected").xval();
                    //var _text = $("input[name='_acccodeName']", $doc.element).find("option:selected").text();
                    //var _accname = $("#acccode option:selected").val();

                    //first_choice = _val;
                    //$("input[name='_acccodeName']", $doc.element).xval(_accname);

                    /*
                    if ($("select[name='_location']", el).xval() == "") {
                        $fn.alert({
                            msg: $fn.getCodeMsg("aprv_sub_099.msg.a1")
                        });
                        return false;
                    }
                    */

                } );
                _$sel_obj1.bind("change" , function(){
                    //alert("TEST");
                    //사업부 마산 구분 자산 일 경우
                    //alert($("select[name='_location']", el).val());
                    //alert($("select[name='_location']", el).val());
                   if( $("[name=ed_location]", el).val()=="E1" && $("select[name='ed_gubun']", el).val()=="A" && $("select[name='ed_formtype']", el).val() == "001"){
                        $fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_103.title.a51")
						});

                   }
                    
                    var _selectedKey = $("select[name='ed_location']", el).val().trim()+"^"+ $("select[name='ed_gubun']", el).val().trim();
                    //alert(_selectedKey);
                    
                    _$sel_obj2.find("option").remove();

                    for (var x=0 ; x < _lvl_keylist.length ; x++) {
                        //var _val = $(this).find("option:selected").xval();
                        //var _text = $(this).find("option:selected").text();
                        //first_choice = _val;
                        //$("input[name='_acccodeName']", _doc.element).xval(_text);
                        //console.log(x + ":" + String(_lvl_keylist[x]).trim()+":");

                        if ( _selectedKey == String(_lvl_keylist[x]).trim())    {

                            _option = new Option(String(_lvl_codenamelist[x]).trim(), String( _lvl_codelist[x]).trim() );
                            if( String( _lvl_codelist[x]).trim() === third_choice ) _option.selected = true;
                            _$sel_obj2.append(_option);
                        }

                    }
                    
                    /*
                    if ($("select[name='_location']", el).xval() == "") {
                        $fn.alert({
                            msg: $fn.getCodeMsg("aprv_sub_099.msg.a1")
                        });
                        return false;
                    }
                    */

                } );
						$('select[name=ed_formtype]').change(function () {
			
							    var resultValue1 = $("input[name='ed_formtype_Nm']").val();
							    //alert(resultValue1)
								if(resultValue1 == "ko:IT계약,jp:IT契約"){
									 $fn.alert({//aprv_sub_103.title.a36
											msg: $fn.getCodeMsg("aprv_sub_103.title.a50")
									});
									
									var _org = new $dwp.ui.org.data.org("S^ko:심현경,en:심현경,zh:심현경,jp:SHIM Hyunkyung^U00561^심현경/U00561/DNKRWEB^D00116^D00000^ko:TEAM원,en:TEAM員,zh:TEAM員,jp:TEAM員^014^ko:과장,en:課長,zh:課長,jp:課長^013^D00000^ko:정보시큐리티팀,en:undefined,zh:undefined,jp:Information Security^ko:덴소코리아,en:덴소코리아^^100052^"),
							            item = _org.oinfo;
										  var _$namelist = $('div[name=Circulation3Disp]', el);
                                         _$namelist.empty();
							            /*
							            var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							            _$namelist.empty();
							             */
							              var _$fld = $("input[name='Circulation3']", el), _$fld_full = $("input[name='Circulation3Full']", el);
							           
							            /*
							            var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							            _$namelist.empty();
							             */
							            var _$nametarget = $(
							                    "<div class='namepicker-target dwp-cursor'></div>").appendTo(_$namelist);

							            if (item.type == 'B') {
							                $(
							                    "<span class='photo'><img src='" +
							                    $dwp.core.getPath('weblib') +
							                    "/images/common/default-team.svg'/></span>").appendTo(_$nametarget);
							                $(
							                    "<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$nametarget);
							            } else {
							                var _$div = $(
							                        "<div class='dwp-cursor' da ta-type='profile' style='display:inline-block'></div>").appendTo(_$nametarget);
							                $(
							                    "<span class='photo'><img src='" +
							                    $dwp.core.getPath('pic', {
							                        empno: item.empno
							                    }) +
							                    "'/></span>").appendTo(_$div);
							                $(
							                    "<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$div);

							                $fn.getPicError($('img', _$div));

							                _$div
							                .attr({
							                    'data-empno': item.empno,
							                    'data-orgcode': item.orgcode
							                })
							                .off('click')
							                .on('click', function () {
							                    $dwp.ui.bizcard.init($(this), {
							                        ismobile: _docopt.ismobile
							                    });
							                });

							               
							                    //alert(_org.oinfo.notesid)
							                    _$fld.xval("심현경/U00561/DNKRWEB");
							                    // alert(_org.sinfo)
							                    _$fld_full.xval("S^ko:심현경,en:심현경,zh:심현경,jp:SHIM Hyunkyung^U00561^심현경/U00561/DNKRWEB^D00116^D00000^ko:TEAM원,en:TEAM員,zh:TEAM員,jp:TEAM員^014^ko:과장,en:課長,zh:課長,jp:課長^013^D00000^ko:정보시큐리티팀,en:undefined,zh:undefined,jp:Information Security^ko:덴소코리아,en:덴소코리아^^100052^");
							                
							            }
					
								}
							    if (resultValue1 == "ko:시작개발품,jp:試作開発品") { //신규
							        if ($("[name=work1]", el).val() == "E1") {
							            $('#susinpop').hide(); //신규

							            var _org = new $dwp.ui.org.data.org("S^ko:염주영,en:염주영,zh:염주영,jp:YUM JUYOUNG^U01079^염주영/U01079/DNKRWEB^D00009^D00000^ko:TEAM원,en:TEAM員,zh:TEAM員,jp:TEAM員^014^ko:담당,en:担当,zh:担当,jp:担当^015^D00000^ko:구매개발2팀,en:undefined,zh:undefined,jp:Purchase 2^ko:덴소코리아,en:덴소코리아^^030483^"),
							            item = _org.oinfo;
										  var _$namelist = $('div[name=Circulation3Disp]', el);
                                         _$namelist.empty();
							            /*
							            var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							            _$namelist.empty();
							             */
							              var _$fld = $("input[name='Circulation3']", el), _$fld_full = $("input[name='Circulation3Full']", el);
							           
							            /*
							            var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							            _$namelist.empty();
							             */
							            var _$nametarget = $(
							                    "<div class='namepicker-target dwp-cursor'></div>").appendTo(_$namelist);

							            if (item.type == 'B') {
							                $(
							                    "<span class='photo'><img src='" +
							                    $dwp.core.getPath('weblib') +
							                    "/images/common/default-team.svg'/></span>").appendTo(_$nametarget);
							                $(
							                    "<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$nametarget);
							            } else {
							                var _$div = $(
							                        "<div class='dwp-cursor' da ta-type='profile' style='display:inline-block'></div>").appendTo(_$nametarget);
							                $(
							                    "<span class='photo'><img src='" +
							                    $dwp.core.getPath('pic', {
							                        empno: item.empno
							                    }) +
							                    "'/></span>").appendTo(_$div);
							                $(
							                    "<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$div);

							                $fn.getPicError($('img', _$div));

							                _$div
							                .attr({
							                    'data-empno': item.empno,
							                    'data-orgcode': item.orgcode
							                })
							                .off('click')
							                .on('click', function () {
							                    $dwp.ui.bizcard.init($(this), {
							                        ismobile: _docopt.ismobile
							                    });
							                });

							               
							                    //alert(_org.oinfo.notesid)
							                    _$fld.xval("염주영/U01079/DNKRWEB");
							                    // alert(_org.sinfo)
							                    _$fld_full.xval("S^ko:염주영,en:염주영,zh:염주영,jp:YUM JUYOUNG^U01079^염주영/U01079/DNKRWEB^D00009^D00000^ko:TEAM원,en:TEAM員,zh:TEAM員,jp:TEAM員^014^ko:담당,en:担当,zh:担当,jp:担当^015^D00000^ko:구매개발2팀,en:undefined,zh:undefined,jp:Purchase 2^ko:덴소코리아,en:덴소코리아^^030483^");
							                
							            }
							        } else {
							            $('#susinpop').show(); //신규
							        }
							    } else 	if(resultValue1 == "ko:IT계약,jp:IT契約"){
									 
									
									var _org = new $dwp.ui.org.data.org("S^ko:심현경,en:심현경,zh:심현경,jp:SHIM Hyunkyung^U00561^심현경/U00561/DNKRWEB^D00116^D00000^ko:TEAM원,en:TEAM員,zh:TEAM員,jp:TEAM員^014^ko:과장,en:課長,zh:課長,jp:課長^013^D00000^ko:정보시큐리티팀,en:undefined,zh:undefined,jp:Information Security^ko:덴소코리아,en:덴소코리아^^100052^"),
							            item = _org.oinfo;
										  var _$namelist = $('div[name=Circulation3Disp]', el);
                                         _$namelist.empty();
							            /*
							            var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							            _$namelist.empty();
							             */
							              var _$fld = $("input[name='Circulation3']", el), _$fld_full = $("input[name='Circulation3Full']", el);
							           
							            /*
							            var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							            _$namelist.empty();
							             */
							            var _$nametarget = $(
							                    "<div class='namepicker-target dwp-cursor'></div>").appendTo(_$namelist);

							            if (item.type == 'B') {
							                $(
							                    "<span class='photo'><img src='" +
							                    $dwp.core.getPath('weblib') +
							                    "/images/common/default-team.svg'/></span>").appendTo(_$nametarget);
							                $(
							                    "<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$nametarget);
							            } else {
							                var _$div = $(
							                        "<div class='dwp-cursor' da ta-type='profile' style='display:inline-block'></div>").appendTo(_$nametarget);
							                $(
							                    "<span class='photo'><img src='" +
							                    $dwp.core.getPath('pic', {
							                        empno: item.empno
							                    }) +
							                    "'/></span>").appendTo(_$div);
							                $(
							                    "<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$div);

							                $fn.getPicError($('img', _$div));

							                _$div
							                .attr({
							                    'data-empno': item.empno,
							                    'data-orgcode': item.orgcode
							                })
							                .off('click')
							                .on('click', function () {
							                    $dwp.ui.bizcard.init($(this), {
							                        ismobile: _docopt.ismobile
							                    });
							                });

							               
							                    //alert(_org.oinfo.notesid)
							                    _$fld.xval("심현경/U00561/DNKRWEB");
							                    // alert(_org.sinfo)
							                    _$fld_full.xval("S^ko:심현경,en:심현경,zh:심현경,jp:SHIM Hyunkyung^U00561^심현경/U00561/DNKRWEB^D00116^D00000^ko:TEAM원,en:TEAM員,zh:TEAM員,jp:TEAM員^014^ko:과장,en:課長,zh:課長,jp:課長^013^D00000^ko:정보시큐리티팀,en:undefined,zh:undefined,jp:Information Security^ko:덴소코리아,en:덴소코리아^^100052^");
							                
							            }
					
								}else{
							        $('#susinpop').hide(); //신규
									if ($("[name=work1]", el).val() == "E1") {
										
										var _org = new $dwp.ui.org.data.org("S^ko:조현승,en:조현승,zh:조현승,jp:JO HYUNSEUNG^U01020^조현승/U01020/DNKRWEB^D00009^D00000^ko:TEAM원,en:TEAM員,zh:TEAM員,jp:TEAM員^014^ko:담당,en:担当,zh:担当,jp:担当^015^D00000^ko:구매개발2팀,en:undefined,zh:undefined,jp:Purchase 2^ko:덴소코리아,en:덴소코리아^^170042^"),
							            item = _org.oinfo;
										  var _$namelist = $('div[name=Circulation3Disp]', el);
                                         _$namelist.empty();
							            /*
							            var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							            _$namelist.empty();
							             */
							              var _$fld = $("input[name='Circulation3']", el), _$fld_full = $("input[name='Circulation3Full']", el);
							           
							            /*
							            var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							            _$namelist.empty();
							             */
							            var _$nametarget = $(
							                    "<div class='namepicker-target dwp-cursor'></div>").appendTo(_$namelist);

							            if (item.type == 'B') {
							                $(
							                    "<span class='photo'><img src='" +
							                    $dwp.core.getPath('weblib') +
							                    "/images/common/default-team.svg'/></span>").appendTo(_$nametarget);
							                $(
							                    "<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$nametarget);
							            } else {
							                var _$div = $(
							                        "<div class='dwp-cursor' da ta-type='profile' style='display:inline-block'></div>").appendTo(_$nametarget);
							                $(
							                    "<span class='photo'><img src='" +
							                    $dwp.core.getPath('pic', {
							                        empno: item.empno
							                    }) +
							                    "'/></span>").appendTo(_$div);
							                $(
							                    "<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$div);

							                $fn.getPicError($('img', _$div));

							                _$div
							                .attr({
							                    'data-empno': item.empno,
							                    'data-orgcode': item.orgcode
							                })
							                .off('click')
							                .on('click', function () {
							                    $dwp.ui.bizcard.init($(this), {
							                        ismobile: _docopt.ismobile
							                    });
							                });

							               
							                    //alert(_org.oinfo.notesid)
							                    _$fld.xval("조현승/U01020/DNKRWEB");
							                    // alert(_org.sinfo)
							                    _$fld_full.xval("S^ko:조현승,en:조현승,zh:조현승,jp:JO HYUNSEUNG^U01020^조현승/U01020/DNKRWEB^D00009^D00000^ko:TEAM원,en:TEAM員,zh:TEAM員,jp:TEAM員^014^ko:담당,en:担当,zh:担当,jp:担当^015^D00000^ko:구매개발2팀,en:undefined,zh:undefined,jp:Purchase 2^ko:덴소코리아,en:덴소코리아^^170042^");
							                
							            }
										
										
									}
							        //$('#susinpop').attr("style","dispaly:none")
							    }
							});
					//엑셀 샘플 다운로드
					
					$("#sample",el).on("click", function () {
						//alert("!@#")
					 _me._excelSampleDown(el,_opt);
					});
						
                /*
                //사용자 선택 팝업
                $("#search").on("click", function () {
                    // alert("@@")
                    $dwp.ui.org.orgsselect.init($(this), {
                        seltype: "1",
						count: 40,
                        selcallback: function (org) {
                            $("input[name=REQUSER1]").val(org.getDispName());
                        }
                    });
                });
                */
                // 수동으로 이벤트 설정
                // 계정정보를 편집시에 설정 하기 위함
                if( first_choice !== "" ) _$sel_obj0.trigger("change");
                if( second_choice !== "" ) _$sel_obj1.trigger("change");
				
				$("#_pop5",el).on("click", function () {
					//var workarea21=$("[name=work1]", el).val();
				//if(workarea21 == "E1"){
					//var form11="wFrmWAReceiverList_2"
					//}else{
					var form11="wFrmWAReceiverList_1"
					//}
				  var that=this, _opt=$doc.options;
                console.log("_opt::", _opt);
                $fn.dialog(null, {
                    title: $fn.getCodeMsg('담당자'),
                    width: 340,
                    height: 490,
                    docInstance: $doc,
                    modal: true,
                    hide: { effect: 'fade', duration: 300 },
                    show: { effect: 'fade', duration: 300 },
                    buttons: [{
                        title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
                        css: 'cancel',
                        click: function (_$dialog) {
                            _$dialog.close();
                        }
                    }],
                    //,content : {url : "/" + _opt.appComCfg.DraftTemplateDBpath + "/wFrmView_Sel?ReadForm", data : {view : "wv02_created_des", single : $fn.getCurUser().pinfo.orgcode, count:15,iscategory:false}}
                    content: {
                        url:
                            '/dwp/aprv/com/aprvmng.nsf/'+form11+'?ReadForm',
                        data: {
                            formcode: _opt.appCfg.FormAlias
                        }
                    }
                });
				
               });
				//업체정보 일괄적용
				$("#_pop4").on("click", function () {
				    //_me.cal_sum2(el,$tr);
				    _me.cal_sum4(el);
				    //$("input[name='_CUSTOMER']").val(_$icustomer.xval())
				    //$("input[name='_CUSTOMER_INFO']").val( _$icustomerinfo.xval())

				});
				//부서정보 일괄적용
				$("#_pop3").on("click", function () {
				    //_me.cal_sum2(el,$tr);
				    _me.cal_sum5(el);
				    //$("input[name='_CUSTOMER']").val(_$icustomer.xval())
				    //$("input[name='_CUSTOMER_INFO']").val( _$icustomerinfo.xval())

				});
              var _$table = _me.initBudgetDspTable(_opt,$doc,"");
                var _newopt = $.extend({}, _opt, { dtable: _$table });
                $doc.options = _newopt;    
				   var _$table = _me.initInputTable(_opt, $doc );
               
                

                console.log('E::구매승인요청서');
            }   
			//지출결의서 비용관련 예산 표시 테이블 - 초기화
            , initBudgetDspTable: function (_opt,$doc,initval,_jsonData) {
                var _me = _$$.aprv_sub103.subdoc;
                var el = $doc.elelment;
               
				//var _formdata = (initval== "") ? $("input[name=fld_formdata]", $doc.element).val():initval;	
					 var _formdata = _jsonData;
							
					//alert(_formdata)
                var _$table = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table01']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _formdata	
                    , template: "[name=_template]"
                    , keyfield: ["_USER"]
                    , changeafter: function (act) {
                        if (act == "del") {
                            
                                _me.cal_sum(el);	
                                //삭제시 합계 재계산
                                 _me.cal_sum1(el);
								
					
                           
                        } else if (act == "add") {
							_me.change_color(el);
                           // if ($("input[name='ccnt']").val() > 16) {
                               
                              //  return false;
                            //}
                        } else if (act == "copy") {
							_me.cal_sum1(el);
                             _me.cal_sum(el); 									//행 복사시 합계 재계산
                        }
                    }
                    , cell: [
						{
                            nm: "q1", type: "custom", vfnm: "_seq",  label: "aprv_sub_103.title.a7"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_seq']", $cell);
                                    _$type.xval(val);
									 _me.cal_sum1(el,$tr); 
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpname", type: "custom", vfnm: "_PNAME", validator: /[^\s]/, label: "aprv_sub_103.title.a7"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PNAME']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpnum", type: "custom", vfnm: "_PNUM", validator: /[^\s]/, label: "aprv_sub_103.title.a13"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PNUM']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hptype", type: "custom", vfnm: "_PTYPE", validator: /[^\s]/, label: "aprv_sub_103.title.a8"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PTYPE']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpdate", type: "date", vfnm: "_PDATE", css: "dwp-center", label: "aprv_sub_103.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$input = $("input[name='_PDATE']", $cell);
                                    _$input.xval(val);

                                        
                                    _$input.on("change", function () {
        
                                        var _pdateval = $("input[name='_PDATE']",$cell).val();
                                        
                                            
                                        //var _text = $("input[name='_acccodeName']", $doc.element).find("option:selected").text();
                                        //var _accname = $("#acccode option:selected").val();
                                        //1 :  일반
                                        //2 : 선입고
                                        if (_pdateval != "") {
                                            //console.log(_selectedtxt);
                                            //일자 선택시
                                            //선입고 필드를 일반으로 설정

                                            var _$PREIN = $("select[name='_PREIN']", $tr);
                                            _$PREIN.xval("1");
                                        } else {
                                            //console.log(_selectedtxt);
                                            
                                        }
                                    });
                                    

                                } else {
                                    if (typeof val == "undefined") return;
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        }
                        ,
                        {
                            nm: "hprein", type: "custom", vfnm: "_PREIN", validator: /[^\s]/, label: "aprv_sub_103.title.a21"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='_PREIN']", $cell);
                                    _$type.xval(val);
                                    
                                    _$type.on("change", function () {
        
                                        var _selectedval = $("select[name='_PREIN']",$cell).find("option:selected").xval();
                                        var _selectedtxt = $("select[name='_PREIN']",$cell).find("option:selected").text();

                                        //var _text = $("input[name='_acccodeName']", $doc.element).find("option:selected").text();
                                        //var _accname = $("#acccode option:selected").val();
                                        //1 :  일반
                                        //2 : 선입고
                                        if (_selectedval == "1") {
                                            //console.log(_selectedtxt);
                                            
                                        } else {
                                            //console.log(_selectedtxt);
                                            var _$type = $("input[name='_PDATE']", $tr);
                                            _$type.xval("");
                                        }
                                        /*
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);

                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                        */
                                    });
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0011.GP0008", val) + "</div>");
                                    
                                }
                            }
                        }, 
                                              
                        {
                            nm: "hunit", type: "custom", vfnm: "_UNIT", validator: /[^\s]/, label: "aprv_sub_103.title.a9"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_UNIT']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },

                        {
                            nm: "hamount", type: "custom", vfnm: "_AMOUNT", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_103.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='_AMOUNT']", $cell);
                                    _$input.xval(val);
									 _$input.off("click").on("click", function(){

                                       //_$input.xval("");
                                         });
                                    _$input.on("blur", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 10);

                                        	//소수점 있으면 소수점 아래 2자리 없으면 정수
                                            if(_icount.indexOf(".") > 0 ){
                                                //alert("소수점")
                                                _icount = parseInt(_icount)
                                                _icount=_icount+""
                                                _$input.xval(_icount.toComma());
                                            }else{
    
                                                //alert("정수")
                                                _icount = parseInt(_icount)
                                                _icount=_icount+""
                                               // _icount=_icount.toFixed(1)
                                                _$input.xval(_icount.toComma());
                                            }
                                        

                                      //  _icount = parseFloat(_icount)+"";

                                      //  _$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                    });
                                    _$input.on("blur", function(){

                                        var _$ia = $("input[name='_AMOUNT']", $cell).val();;
                                        var _$iup = $("input[name='_UNITCOST']", $tr).val();;

                                        var _ia = _$ia.replace(/,/gi, "");
                                        var _iup = _$iup.replace(/,/gi, "");

                                        //소수점 있으면
                                        if(_ia.indexOf(".") > 0 ){
                                            _ia = _me.numericCheck(_ia, 10);
                                        }else{
                                            _ia = _me.numericCheck(_ia, 0);
                                        }

                                         //소수점 있으면
                                         if(_iup.indexOf(".") > 0 ){
                                            _iup = _me.numericCheck(_iup, 10);
                                        }else{
                                            _iup = _me.numericCheck(_iup, 0);
                                        }
                                        
                                       

                                         //소수점 있으면 소수점 아래 2자리 없으면 인수
                                         if(_ia.indexOf(".") > 0 || _iup.indexOf(".") > 0){

                                           
                                            
                                            _ia = parseFloat(_ia) + "";
                                            _iup = parseFloat(_iup) + "";
    
                                            var _rowsum = _ia * _iup;
                                            _rowsum = parseFloat(_rowsum)
                                            _rowsum=_rowsum.toFixed(3);
                                            _rowsum = _rowsum.toComma();
    
                                            $("input[name='_PRICE']", $tr).val(_rowsum);


                                          }else{
                                            //_ia = _me.numericCheck(_ia, 0);
                                          //  _iup = _me.numericCheck(_iup, 0);
                                            
                                            _ia = parseFloat(_ia) + "";
                                            _iup = parseFloat(_iup) + "";

                                            var _rowsum = _ia * _iup;
                                            _rowsum = parseFloat(_rowsum)
                                            _rowsum=_rowsum.toFixed()
                                            _rowsum = _rowsum.toComma();

                                            $("input[name='_PRICE']", $tr).val(_rowsum);



                                         }

                                        

                                        _me.cal_sum(el,$tr);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },         
                        {
                            nm: "hunitcost", type: "custom", vfnm: "_UNITCOST", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_103.title.22"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_UNITCOST']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='_UNITCOST']", $cell);
                                    _$input.xval(val);
                                    _$input.on("blur", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 10);

                                       // _icount = parseFloat(_icount) + "";
										// _icount = parseFloat(_icount)
										//_icount=_icount.toFixed(1)
                                       //_$input.xval(_icount.toComma());

                                        
										//소수점 있으면 소수점 아래 2자리 없으면 정수
                                        if(_icount.indexOf(".") > 0 ){
                                        	//alert("소수점")
                                        	 _icount = parseFloat(_icount)
										     _icount=_icount.toFixed(3)
                                            _$input.xval(_icount.toComma());
                                        }else{

                                        	//alert("정수")
                                        	_icount = parseInt(_icount)
                                            _icount=_icount+""
										   // _icount=_icount.toFixed(1)
                                            _$input.xval(_icount.toComma());
                                        }

                                        //_me.cal_sum(el);
                                    });
                                    _$input.on("blur", function(){

                                        var _$ia = $("input[name='_AMOUNT']", $tr).val();;
                                        var _$iup = $("input[name='_UNITCOST']", $cell).val();;

                                        var _ia = _$ia.replace(/,/gi, "");
                                        var _iup = _$iup.replace(/,/gi, "");
                                       
                                        var _icount1 = _$input.xval();

                                         //소수점 있으면
                                         if(_ia.indexOf(".") > 0 ){
                                            _ia = _me.numericCheck(_ia, 10);
                                        }else{
                                            _ia = _me.numericCheck(_ia, 0);
                                        }

                                         //소수점 있으면
                                         if(_iup.indexOf(".") > 0 ){
                                            _iup = _me.numericCheck(_iup, 10);
                                        }else{
                                            _iup = _me.numericCheck(_iup, 0);
                                        }

                                        //소수점 있으면 소수점 아래 2자리 없으면 인수
                                        if(_ia.indexOf(".") > 0 || _iup.indexOf(".") > 0){
                                           // _ia = _me.numericCheck(_ia, 10);
                                          //  _iup = _me.numericCheck(_iup, 10);
                                        
                                            _ia = parseFloat(_ia) + "";
                                            _iup = parseFloat(_iup) + "";
    
                                            var _rowsum = _ia * _iup;
                                            _rowsum = parseFloat(_rowsum);
                                            _rowsum=_rowsum.toFixed(3);
                                            _rowsum = _rowsum.toComma();
    
                                            $("input[name='_PRICE']", $tr).val(_rowsum);

                                        }else{
                                            //소수점 없을때
                                           // _ia = _me.numericCheck(_ia, 0);
                                          //  _iup = _me.numericCheck(_iup, 0);
                                        
                                            _ia = parseFloat(_ia) + "";
                                            _iup = parseFloat(_iup) + "";
    
                                            var _rowsum = _ia * _iup;
                                            _rowsum = parseFloat(_rowsum);
                                            _rowsum=_rowsum.toFixed()
                                            _rowsum = _rowsum.toComma();
    
                                            $("input[name='_PRICE']", $tr).val(_rowsum);


                                        }
                                       

 
                                        
                                        _me.cal_sum(el,$tr);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },                
                        {
                            nm: "hprice", type: "custom", vfnm: "_PRICE", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_103.title.a12"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PRICE']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },                
                        {
                            nm: "hdept", type: "custom", vfnm: "_DEPT_INFO", validator: /[^\s]/, label: "aprv_sub_103.title.a15"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_DEPT']", $cell);
                                    //_$type.xval(val);

                                    var _$idept = $("input[name='_DEPT']", $cell);							        			
                                    var _$ideptinfo = $("input[name='_DEPT_INFO']", $cell);							        			

                                    if (_$ideptinfo.xval() != "") {
                                        var _info = _$ideptinfo.xval();
                                        var _info = _info.split("¶");							        		
                                        _$idept.xval(_info[1]+"_"+_info[2]);							        			
                                    }    
									
									
									
                                    _$idept.off("click").on("click", function(){
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
										
                                        var _customerDB = _me.PAMT_DB;
                                        //====================================================
                                        //				구매승인관리 부서 정보 선택 보기호출 변경
                                        // 				- 2019.07.11 by 나노브레인
                                        //====================================================

                                        //var _info = _$com_info.xval().split("¶");	
                                        var _form = "w_pop_dept";
                                        //====================================================
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("aprv_sub_103.title.department"),                                            
                                            width: 1100,
                                            height: 800,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_103.lang.js",
                                            content : {
                                                html : "", 
                                        //		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                                url :"/dwp/aprv/com/comm_code.nsf/wFrm10PopViewFor103?ReadForm&view=w_use_deptcode_2"
//														, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });    

                                    });
                                } else {
                                    //console.log("TESTTTTT:" );

                                    if (typeof val == "undefined") {
                                        return ;
                                    }    
                                    /*
						        	if (val == "") {
						        		$cell.html("<div class='dwp-center'></div>");
						        	} else	if (val.indexOf("¶") > 0 ) {
						        		$cell.html("<div class='dwp-center'>" + $fn.getCurLangMsg(_info[1]) + "</div>");	
						        	} else {
						        		$cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0030", val) + "</div>");
						        	}
                                    */
                                    var _info = val.split("¶");
                                    if (val == "") {
                                        $cell.html("<div class='dwp-center'>&nbsp;</div>");
                                    } else	if (val.indexOf("¶") > 0 ) {
                                        $cell.html("<div class='dwp-center'>" +_info[1]+"_"+_info[2] + "</div>");	 
                                        
                                    }
                                }
                            }
                        },
                        {
                            nm: "hcustomer", type: "custom", vfnm: "_CUSTOMER_INFO", validator: /[^\s]/, label: "aprv_sub_103.title.a16"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {

                                    var _$icustomer = $("input[name='_CUSTOMER']", $cell);							        			
                                   	var _$icustomerinfo = $("input[name='_CUSTOMER_INFO']", $cell);						        			
                                    
                                        var _info = _$icustomerinfo.xval();
                                        var _info = _info.split("¶");							        		
                                        _$icustomer.xval(_info[1]);						        			
                                    
									
                                    _$icustomer.off("click").on("click", function(){
                                        
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
                                        var _customerDB = _me.PAMT_DB;
                                        
                                        
                                        //====================================================
                                        //				구매승인관리 고객사 정보 선택 보기호출 변경
                                        // 				- 2017.12.11 by dwlee
                                        //====================================================

                                        //var _info = _$com_info.xval().split("¶");	
                                        var _form = "w_pop_customer";
                                        //====================================================
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("aprv_sub_103.title.customer"),                                            
                                            width: 1100,
                                            height: 640,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_103.lang.js",
                                            content : {
                                                html : "", 
                                        //		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                                url : _customerDB+"/wFrmPopView?ReadForm&view="+_form
//														, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });                                    
                                        
                                    });
                                } else {
                                    if (typeof val == "undefined") return;
                                    var _info = val.split("¶");							        							        		
                                    
                                    if (val == "") {
                                        $cell.html("<div class='dwp-center'>&nbsp;</div>");
                                    } else	if (val.indexOf("¶") > 0 ) {
                                        $cell.html("<div class='dwp-center'>" + _info[1] + "</div>");	 
                                        
                                    }
                                }
                            }                                                 
                        },    
                        {
                            nm: "hetc", type: "custom", vfnm: "_ETC", validator: /[^\s]/, label: "aprv_sub_103.title.a17"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_ETC']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }, 
{
                            nm: "flag1", type: "custom", vfnm: "_flag1",  label: "완료일"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag2", type: "custom", vfnm: "_flag2",  label: "지불방법"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag2']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag3", type: "custom", vfnm: "_flag3",  label: "발주서"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag3']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag4", type: "custom", vfnm: "_flag4",  label: "거래명세표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag4']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag5", type: "custom", vfnm: "_flag5",  label: "출고전표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag5']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag6", type: "custom", vfnm: "_flag6",  label: "출고전표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag6']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }						
                    ]
                });

              
                return _$table;
            }
            //지출결의서 비용관련 예산 표시 테이블 - 초기화
            , initInputTable: function (_opt, $doc) {
                var _me = _$$.aprv_sub103.subdoc;
                var el = $doc.elelment;
                var _tableVal = $("input[name=fld_formdata]", $doc.element).val();
				var workarea2=$("[name=work1]", el).val();
				var sumrow1=0;
				if(workarea2 == "E1"){
					sumrow1=15
					}else{
					sumrow1=15
				}
                var _$table = $dwp.ui.table.init($("table[name='" + _me.SUBNAME + "_Table01']", $doc.element), {
                    isedit: _opt.isedit
                    , initdata: _tableVal
                    , template: "[name=_template]"
                    , keyfield: ["_USER"]
					, maxrow :sumrow1
                    , changeafter: function (act) {
                        if (act == "del") {
                          //  $fn.confirm({msg : $fn.getCodeMsg("삭제 하시겠습니까?")  }).done(function(){
                           
                            _me.cal_sum(el);	
							//삭제시 합계 재계산
							 _me.cal_sum1(el);
                          //  })
                        } else if (act == "add") {
                            if ($("input[name='ccnt']").val() > 16) {
                               
                                return false;
                            }
                        } else if (act == "copy") {
							_me.cal_sum1(el);
                             _me.cal_sum(el); 									//행 복사시 합계 재계산
                        }
                    }
                    , cell: [
						{
                            nm: "q1", type: "custom", vfnm: "_seq",  label: "aprv_sub_103.title.a7"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_seq']", $cell);
                                    _$type.xval(val);
									 _me.cal_sum1(el,$tr); 
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpname", type: "custom", vfnm: "_PNAME", validator: /[^\s]/, label: "aprv_sub_103.title.a7"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PNAME']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpnum", type: "custom", vfnm: "_PNUM", validator: /[^\s]/, label: "aprv_sub_103.title.a13"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PNUM']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hptype", type: "custom", vfnm: "_PTYPE", validator: /[^\s]/, label: "aprv_sub_103.title.a8"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PTYPE']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },
                        {
                            nm: "hpdate", type: "date", vfnm: "_PDATE", css: "dwp-center", label: "aprv_sub_103.title.a14"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$input = $("input[name='_PDATE']", $cell);
                                    _$input.xval(val);

                                        
                                    _$input.on("change", function () {
        
                                        var _pdateval = $("input[name='_PDATE']",$cell).val();
                                        
                                            
                                        //var _text = $("input[name='_acccodeName']", $doc.element).find("option:selected").text();
                                        //var _accname = $("#acccode option:selected").val();
                                        //1 :  일반
                                        //2 : 선입고
                                        if (_pdateval != "") {
                                            //console.log(_selectedtxt);
                                            //일자 선택시
                                            //선입고 필드를 일반으로 설정

                                            var _$PREIN = $("select[name='_PREIN']", $tr);
                                            _$PREIN.xval("1");
                                        } else {
                                            //console.log(_selectedtxt);
                                            
                                        }
                                    });
                                    

                                } else {
                                    if (typeof val == "undefined") return;
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        }
                        ,
                        {
                            nm: "hprein", type: "custom", vfnm: "_PREIN", validator: /[^\s]/, label: "aprv_sub_103.title.a21"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("select[name='_PREIN']", $cell);
                                    _$type.xval(val);
                                    
                                    _$type.on("change", function () {
        
                                        var _selectedval = $("select[name='_PREIN']",$cell).find("option:selected").xval();
                                        var _selectedtxt = $("select[name='_PREIN']",$cell).find("option:selected").text();

                                        //var _text = $("input[name='_acccodeName']", $doc.element).find("option:selected").text();
                                        //var _accname = $("#acccode option:selected").val();
                                        //1 :  일반
                                        //2 : 선입고
                                        if (_selectedval == "1") {
                                            //console.log(_selectedtxt);
                                            
                                        } else {
                                            //console.log(_selectedtxt);
                                            var _$type = $("input[name='_PDATE']", $tr);
                                            _$type.xval("");
                                        }
                                        /*
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 0);

                                        _icount = parseFloat(_icount) + "";
                                        _$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                        */
                                    });
                                } else {
                                    //$cell.html("<div class='dwp-center'>" + val + "</div>");
                                    $cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0011.GP0008", val) + "</div>");
                                    
                                }
                            }
                        }, 
                                              
                        {
                            nm: "hunit", type: "custom", vfnm: "_UNIT", validator: /[^\s]/, label: "aprv_sub_103.title.a9"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_UNIT']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-center'>" + val + "</div>");
                                }
                            }
                        },

                        {
                            nm: "hamount", type: "custom", vfnm: "_AMOUNT", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_103.title.a10"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_AMOUNT']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='_AMOUNT']", $cell);
                                    _$input.xval(val);
									 _$input.off("click").on("click", function(){

                                       _$input.xval("");
                                         });
                                    _$input.on("blur", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 10);

                                        	//소수점 있으면 소수점 아래 2자리 없으면 정수
                                            if(_icount.indexOf(".") > 0 ){
                                                //alert("소수점")
                                                _icount = parseInt(_icount)
                                                _icount=_icount+""
                                                _$input.xval(_icount.toComma());
                                            }else{
    
                                                //alert("정수")
                                                _icount = parseInt(_icount)
                                                _icount=_icount+""
                                               // _icount=_icount.toFixed(1)
                                                _$input.xval(_icount.toComma());
                                            }
                                        

                                      //  _icount = parseFloat(_icount)+"";

                                      //  _$input.xval(_icount.toComma());

                                        //_me.cal_sum(el);
                                    });
                                    _$input.on("blur", function(){

                                        var _$ia = $("input[name='_AMOUNT']", $cell).val();;
                                        var _$iup = $("input[name='_UNITCOST']", $tr).val();;

                                        var _ia = _$ia.replace(/,/gi, "");
                                        var _iup = _$iup.replace(/,/gi, "");

                                        //소수점 있으면
                                        if(_ia.indexOf(".") > 0 ){
                                            _ia = _me.numericCheck(_ia, 10);
                                        }else{
                                            _ia = _me.numericCheck(_ia, 0);
                                        }

                                         //소수점 있으면
                                         if(_iup.indexOf(".") > 0 ){
                                            _iup = _me.numericCheck(_iup, 10);
                                        }else{
                                            _iup = _me.numericCheck(_iup, 0);
                                        }
                                        
                                       

                                         //소수점 있으면 소수점 아래 2자리 없으면 인수
                                         if(_ia.indexOf(".") > 0 || _iup.indexOf(".") > 0){

                                           
                                            
                                            _ia = parseFloat(_ia) + "";
                                            _iup = parseFloat(_iup) + "";
    
                                            var _rowsum = _ia * _iup;
                                            _rowsum = parseFloat(_rowsum)
                                            _rowsum=_rowsum.toFixed(3);
                                            _rowsum = _rowsum.toComma();
    
                                            $("input[name='_PRICE']", $tr).val(_rowsum);


                                          }else{
                                            //_ia = _me.numericCheck(_ia, 0);
                                          //  _iup = _me.numericCheck(_iup, 0);
                                            
                                            _ia = parseFloat(_ia) + "";
                                            _iup = parseFloat(_iup) + "";

                                            var _rowsum = _ia * _iup;
                                            _rowsum = parseFloat(_rowsum)
                                            _rowsum=_rowsum.toFixed()
                                            _rowsum = _rowsum.toComma();

                                            $("input[name='_PRICE']", $tr).val(_rowsum);



                                         }

                                        

                                        _me.cal_sum(el,$tr);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },         
                        {
                            nm: "hunitcost", type: "custom", vfnm: "_UNITCOST", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_103.title.22"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_UNITCOST']", $cell);
                                    //_$type.xval(val);
                                    var _$input = $("input[name='_UNITCOST']", $cell);
                                    _$input.xval(val);
                                    _$input.on("blur", function () {
                                        var _icount = _$input.xval();
                                        _icount = _icount.replace(/,/gi, "");
                                        _icount = _me.numericCheck(_icount, 10);

                                       // _icount = parseFloat(_icount) + "";
										// _icount = parseFloat(_icount)
										//_icount=_icount.toFixed(1)
                                       //_$input.xval(_icount.toComma());

                                        
										//소수점 있으면 소수점 아래 2자리 없으면 정수
                                        if(_icount.indexOf(".") > 0 ){
                                        	//alert("소수점")
                                        	 _icount = parseFloat(_icount)
										     _icount=_icount.toFixed(3)
                                            _$input.xval(_icount.toComma());
                                        }else{

                                        	//alert("정수")
                                        	_icount = parseInt(_icount)
                                            _icount=_icount+""
										   // _icount=_icount.toFixed(1)
                                            _$input.xval(_icount.toComma());
                                        }

                                        //_me.cal_sum(el);
                                    });
                                    _$input.on("blur", function(){

                                        var _$ia = $("input[name='_AMOUNT']", $tr).val();;
                                        var _$iup = $("input[name='_UNITCOST']", $cell).val();;

                                        var _ia = _$ia.replace(/,/gi, "");
                                        var _iup = _$iup.replace(/,/gi, "");
                                       
                                        var _icount1 = _$input.xval();

                                         //소수점 있으면
                                         if(_ia.indexOf(".") > 0 ){
                                            _ia = _me.numericCheck(_ia, 10);
                                        }else{
                                            _ia = _me.numericCheck(_ia, 0);
                                        }

                                         //소수점 있으면
                                         if(_iup.indexOf(".") > 0 ){
                                            _iup = _me.numericCheck(_iup, 10);
                                        }else{
                                            _iup = _me.numericCheck(_iup, 0);
                                        }

                                        //소수점 있으면 소수점 아래 2자리 없으면 인수
                                        if(_ia.indexOf(".") > 0 || _iup.indexOf(".") > 0){
                                           // _ia = _me.numericCheck(_ia, 10);
                                          //  _iup = _me.numericCheck(_iup, 10);
                                        
                                            _ia = parseFloat(_ia) + "";
                                            _iup = parseFloat(_iup) + "";
    
                                            var _rowsum = _ia * _iup;
                                            _rowsum = parseFloat(_rowsum);
                                            _rowsum=_rowsum.toFixed(3);
                                            _rowsum = _rowsum.toComma();
    
                                            $("input[name='_PRICE']", $tr).val(_rowsum);

                                        }else{
                                            //소수점 없을때
                                           // _ia = _me.numericCheck(_ia, 0);
                                          //  _iup = _me.numericCheck(_iup, 0);
                                        
                                            _ia = parseFloat(_ia) + "";
                                            _iup = parseFloat(_iup) + "";
    
                                            var _rowsum = _ia * _iup;
                                            _rowsum = parseFloat(_rowsum);
                                            _rowsum=_rowsum.toFixed()
                                            _rowsum = _rowsum.toComma();
    
                                            $("input[name='_PRICE']", $tr).val(_rowsum);


                                        }
                                       

 
                                        
                                        _me.cal_sum(el,$tr);
                                    });
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },                
                        {
                            nm: "hprice", type: "custom", vfnm: "_PRICE", css: "dwp-right", validator: /[^\s]/, label: "aprv_sub_103.title.a12"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_PRICE']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-right'>" + val + "</div>");
                                }
                            }
                        },                
                        {
                            nm: "hdept", type: "custom", vfnm: "_DEPT_INFO", validator: /[^\s]/, label: "aprv_sub_103.title.a15"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    //var _$type = $("input[name='_DEPT']", $cell);
                                    //_$type.xval(val);

                                    var _$idept = $("input[name='_DEPT']", $cell);							        			
                                    var _$ideptinfo = $("input[name='_DEPT_INFO']", $cell);							        			

                                   // if (_$ideptinfo.xval() != "") {
                                        var _info = _$ideptinfo.xval();
                                        var _info = _info.split("¶");							        		
                                        _$idept.xval(_info[2]);							        			
                                   // }    
									 $("#_pop3").on("click", function () {
										 //alert("!@#!@#!@#")
										// alert(val);
										//var _$idept = $("input[name='_DEPT']", $tr);							        			
										//var _$ideptinfo = $("input[name='_DEPT_INFO']", $tr);	
										// $("input[name='_CUSTOMER']").val(_$icustomer.xval())
									   // $("input[name='_CUSTOMER_INFO']").val( _$icustomerinfo.xval())
										
										// $("input[name='_DEPT']").val(_$idept.xval())
									  //  $("input[name='_DEPT_INFO']").val(_$ideptinfo.xval())
									 });
									
									
                                    _$idept.off("click").on("click", function(){
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
										
                                        var _customerDB = _me.PAMT_DB;
                                        //====================================================
                                        //				구매승인관리 부서 정보 선택 보기호출 변경
                                        // 				- 2019.07.11 by 나노브레인
                                        //====================================================

                                        //var _info = _$com_info.xval().split("¶");	
                                        var _form = "w_pop_dept";
                                        //====================================================
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("aprv_sub_103.title.department"),                                            
                                            width: 1100,
                                            height: 800,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_103.lang.js",
                                            content : {
                                                html : "", 
                                        //		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                               // url : _customerDB+"/wFrmPopDeptView?ReadForm&view="+_form
											   url :"/dwp/aprv/com/comm_code.nsf/wFrm10PopViewFor103?ReadForm&view=w_use_deptcode_2"
//														, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });    

                                    });
                                } else {
                                    //console.log("TESTTTTT:" );

                                    if (typeof val == "undefined") {
                                        return ;
                                    }    
                                    /*
						        	if (val == "") {
						        		$cell.html("<div class='dwp-center'></div>");
						        	} else	if (val.indexOf("¶") > 0 ) {
						        		$cell.html("<div class='dwp-center'>" + $fn.getCurLangMsg(_info[1]) + "</div>");	
						        	} else {
						        		$cell.html("<div class='dwp-center'>" + $dwp.core.lang.getCodeData("AP0001.GP0030", val) + "</div>");
						        	}
                                    */
                                    var _info = val.split("¶");
                                    if (val == "") {
                                        $cell.html("<div class='dwp-center'>&nbsp;</div>");
                                    } else	if (val.indexOf("¶") > 0 ) {
                                        $cell.html("<div class='dwp-center'>" + _info[1]+"_"+_info[2] + "</div>");	 
                                        
                                    }
                                }
                            }
                        },
                        {
                            nm: "hcustomer", type: "custom", vfnm: "_CUSTOMER_INFO", validator: /[^\s]/, label: "aprv_sub_103.title.a16"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {

                                    var _$icustomer = $("input[name='_CUSTOMER']", $cell);							        			
                                   	var _$icustomerinfo = $("input[name='_CUSTOMER_INFO']", $cell);						        			
                                    
                                        var _info = _$icustomerinfo.xval();
                                        var _info = _info.split("¶");							        		
                                        _$icustomer.xval(_info[1]);						        			
                                    
									
									 
									 
                                    _$icustomer.off("click").on("click", function(){
                                        
                                        var _opt = {
                                            aprdoc 	: el,
                                            tr 		: $tr
                                        }
                                        var _customerDB = _me.PAMT_DB;
                                        
                                        
                                        //====================================================
                                        //				구매승인관리 고객사 정보 선택 보기호출 변경
                                        // 				- 2017.12.11 by dwlee
                                        //====================================================

                                        //var _info = _$com_info.xval().split("¶");	
                                        var _form = "w_pop_customer";
                                        //====================================================
                                        
                                        var _rptDailog = $fn.dialog(null,{
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            referdata: _opt,
                                            title: $fn.getCodeMsg("aprv_sub_103.title.customer"),                                            
                                            width: 1100,
                                            height: 640,
                                            show: 'fade',			//effect
                                            hide: 'fade',			//effect
                                            langpath: $fn.getPath("weblib")+"/lang/"+$fn.getCurUser().lang+"/aprv_sub_103.lang.js",
                                            content : {
                                                html : "", 
                                        //		url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                                                url : _customerDB+"/wFrmPopView?ReadForm&view="+_form
//														, data : {view : _view
                                                , count:15
                                            },
                                            close : function () {										//2017.01.19 
                                                
                                            }
                                        });                                    
                                        
                                    });
                                } else {
                                    if (typeof val == "undefined") return;
                                    var _info = val.split("¶");							        							        		
                                    
                                    if (val == "") {
                                        $cell.html("<div class='dwp-center'>&nbsp;</div>");
                                    } else	if (val.indexOf("¶") > 0 ) {
                                        $cell.html("<div class='dwp-center'>" + _info[1] + "</div>");	 
                                        
                                    }
                                }
                            }                                                 
                        },    
                        {
                            nm: "hetc", type: "custom", vfnm: "_ETC", validator: /[^\s]/, label: "aprv_sub_103.title.a17"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_ETC']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }, 
{
                            nm: "flag1", type: "custom", vfnm: "_flag1",  label: "완료일"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag1']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag2", type: "custom", vfnm: "_flag2",  label: "지불방법"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag2']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag3", type: "custom", vfnm: "_flag3",  label: "발주서"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag3']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag4", type: "custom", vfnm: "_flag4",  label: "거래명세표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag4']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag5", type: "custom", vfnm: "_flag5",  label: "출고전표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag5']", $cell);
									var _$type1 = $("input[name='_seq']", $tr);
                                    _$type.xval(_$type1.val());
                                   // _$type.xval(val);
									
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        },
						 {
                            nm: "flag6", type: "custom", vfnm: "_flag6",  label: "출고전표"
                            , drawfn: function (val, $cell, $tr, inst) {
                                if (inst.options.isedit) {
                                    var _$type = $("input[name='_flag6']", $cell);
                                    _$type.xval(val);
                                } else {
                                    $cell.html("<div class='dwp-left'>" + val + "</div>");
                                }
                            }
                        }						
                    ]
                });

                //하나의 row는 무조건 생성
                if (_opt.isnew) {
					_$table.add();
					_$table.add();
					_$table.add();
					_$table.add();
					_$table.add();
                }
                return _$table;
            } 
			//샘플파일 다운로드
				, _excelSampleDown : function (_el,_opt) {
					//  /dwp/com/sys/gwlib.nsf/seal/$file/sample(erp).xls
					//var _$attach = $("<a href='/dwp/com/sys/gwlib.nsf/budget/$file/sample(erp).xlsx'>");
					//_$attach.click();					
					window.open("/dwp/com/sys/gwlib.nsf/budget/$file/sample_down.xlsx");
				}
				//엑셀 업로드
				, _excelUpload : function(_el,_opt) {
					var _me = _$$.aprv_sub103.subdoc;					
				
					var _uploadDB = _me.MVLOG_DB;					
					var _url = $fn.getProxyUrl(_uploadDB + "/wFrmAprExpendUpload1?OpenForm&curserver=" + _opt.sysinfo.svrnm+"&AprType=ERP&workarea1="+$("[name=work1]", _el).val());

					var _buttons = [	{
						"title" : $fn.getCodeMsg("엑셀업로드"),
						"click" : function(obj) {
							var _save = {
								callback : function(__data) {
									if (__data.hasOwnProperty("result")) {
										if ( __data.result >= "200" && __data.result < "300") {
											
											console.log("================================");
											console.log("__data : ",__data);
											console.log("================================");
											
											
//											var cdate = new Date();
//											console.log("time ",cdate);
											
											//var _jsonData1 = __data.data;
											
											//var _ins = $fn.getInstance("doc", $fn.getContent());
											//var _doc = _ins.element.doc("instance");
											var _doc = _el.doc("instance");
											var _opt = _doc.options;	
											
											
											
											var _$table = $("table[name="+_me.SUBNAME+"_Table01]", _el);
											var _$trs = $("tbody>tr",_$table);
											//alert(_$trs.size())
											if (_$trs.size() > 0) {
												$.each(_$trs, function (index, tr) {
													var _$tr = $(this);
													if (  _$tr.attr("name") != "_template" && _$tr.attr("name") != "" && _$tr.attr("name") != "_ROW_TOTAL") {
														_$tr.remove();
													}
												});
											}
											
											if (__data.data != "") {
											    //alert(_jsonData)
											    var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", _doc.element).xtable("instance")
											     //  _$table.options.isinit = true;

											    var _$table = _me.initBudgetDspTable(_opt, _doc, "", __data.data);
											  //  _$table.options.isinit = false;

											}
											
										
									
											//요기										
											//_me.cal_sum(_el);	
											_me.cal_sum3(_el);
											obj.close();	
										} else {
												if (__data.hasOwnProperty("detail_msg")) {
													var _altmsg = __data.detail_msg;												
													
													$dwp.ui.alert({msg : _altmsg}); return;
												}
												if (__data.hasOwnProperty("succ_cnt")) { // tot_Cnt succ_cnt
													$dwp.ui.alert({msg : "Success Count : "+__data.succ_cnt}); return;
												} else {
													$dwp.ui.alert({msg : $fn.getCodeMsg("엑셀파일 읽는중 오류 발생 다시 업로드 버튼을 눌러주세요.")}); return;
												}
												obj.close();
											}
										}
									}
							}
							obj.element.doc("instance").save(_save);
						}
					},
					{
						"title" : $fn.getCodeMsg("취소"),
						"click" : function(obj) {
							obj.close();
						}
					}];
					//var _buttons = [	];
					$fn.dialog(null, {
						modal: true,
						resizable: true,
						draggable: true,
						islangconvert : false,
						title: $fn.getCodeMsg("excelupload"),
						width: 600,
						/*height: 410,*/
						show: 'fade',			//effect
						hide: 'fade',			//effect
						buttons: _buttons,
						content : {url : _url, data:{}}
					});
				}
            //입력된 값으로 합계 구하는 함수
            , cal_sum: function (el , tr) {                                
                var _me = _$$.aprv_sub103.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                //var _supply_sum = 0;
                //var _total_sum = 0;
				
				
				//alert($("#_REQCOUNT4", tr).val())
				
				//alert($("#_REQCOUNT4").val())
                //alert($("input[name='_REQCOUNT4']", el).xval())
                
				var _$isupply = $("input[name='_PRICE']", _$input_trs);
				var _sum = 0;
                var _sum1="";
				$.each(_$isupply, function(idx, o){
					var _val=0;
                    
                    
                    var _o = $(o).xval().replace(/,/gi, "");
                    
					if( $.isNumeric(_o,10)) {

                        console.log(_o);

                        _val = parseFloat(_o);
                        
						_sum += _val;
					}
                });
                  //_rowsum = parseFloat(_rowsum);
										
                _sum = _sum;
                _sum1=_sum;
                _sum1=_sum1+"";
                
                if(_sum1.indexOf(".") > 0 ){
                    _sum = parseFloat(_sum);
                    _sum=_sum.toFixed(3)
                   

                }else{
                    _sum = parseFloat(_sum);
                    _sum=_sum.toFixed()

                }

                _sum = _sum.toComma();
				

				$("input[name='total_sum']", el).xval(_sum);

            }
			  , cal_sum1: function (el , tr) {                                
                var _me = _$$.aprv_sub103.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                
                
				var _$isupply = $("input[name='_seq']", _$input_trs);
				
				$.each(_$isupply, function(idx, o){
					var _val=0;
                    
                    
					
                    $(o).xval(idx);
					$("input[name='ccnt']").val(idx)
                    
					
                });
				//alert($("input[name='ccnt']").val())
                 
                

				

            }
			  , cal_sum2: function (el , tr) {                                
                var _me = _$$.aprv_sub103.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                
                
				var _$isupply = $("input[name='_DEPT']", _$input_trs);
				
				$.each(_$isupply, function(idx, o){
					var _val=0;
                    
                    
                    $(o).xval(o)
                    
					
                });
			
                
                

				

            }
			 , change_color: function (el , tr) {                                
                var _me = _$$.aprv_sub103.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
                
                
				var _$isupply = $("input[name='_DEPT']", _$input_trs);
				
				$.each(_$input_trs, function(idx, o){
					var _val=0;
                      $(this).parent().parent().find("#_row_0").attr('backgroundColor',"CECEF6");


                    
                    
                    
					
                });
			
                
                

				

            }
			, cal_sum3: function (el , tr) {                                
                var _me = _$$.aprv_sub103.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
				
				
               /*
                var _$iup = $("input[name='_UNITCOST']", $cell).val(); 

                var _ia = _$ia.replace(/,/gi, "");
                var _iup = _$iup.replace(/,/gi, "");
                _ia = _me.numericCheck(_ia, 0);
                _iup = _me.numericCheck(_iup, 0);

                _ia = parseFloat(_ia) + "";
                _iup = parseFloat(_iup) + "";

                var _rowsum = _ia * _iup;
                _rowsum = parseFloat(_rowsum) + "";
                _rowsum = _rowsum.toComma();

                $("input[name='_PRICE']", $tr).val(_rowsum);
				
				*/
				
				 var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);

                var _$isupply = $("input[name='_UNITCOST']", _$input_trs);
				var _$AMOUNT = $("input[name='_AMOUNT']", _$input_trs);
				var _$PRICE = $("input[name='_PRICE']", _$input_trs);
				
				var _sum33="";
				
				$.each(_$AMOUNT, function (idx, o1) {
				    var _o1 = $(o1).xval().replace(/,/gi, "");
				   // console.log(_o);
				   if (idx != 0){
				    _sum33=_sum33+"☆"+_o1
				   }
				});
				
				
				
				_sum33=_sum33.split("☆")
				_fprace="";
				$.each(_$isupply, function(idx, o){
					var _val=0;
                  //  var _$ia = $("input[name='_AMOUNT']", _$input_trs).val(); 
                    
                    var _o = $(o).xval().replace(/,/gi, "");
                    
					//console.log(_$ia);
						
					if( $.isNumeric(_o) ){
						
						if( idx != 0){
						console.log(_sum33[idx]);
							
						
						
                        console.log(_o);
						var _ia = _sum33[idx].replace(/,/gi, "");
						var _iup = _o.replace(/,/gi, "");

                            //소수점 있으면
                            if(_ia.indexOf(".") > 0 ){
                                _ia = _me.numericCheck(_ia, 10);
                            }else{
                                _ia = _me.numericCheck(_ia, 0);
                            }

                            //소수점 있으면
                            if(_iup.indexOf(".") > 0 ){
                                _iup = _me.numericCheck(_iup, 10);
                            }else{
                                _iup = _me.numericCheck(_iup, 0);
                            }

						 //소수점 있으면 소수점 아래 2자리 없으면 인수
                        if(_ia.indexOf(".") > 0 || _iup.indexOf(".") > 0){
                            _ia = parseFloat(_ia) + "";
                            _iup = parseFloat(_iup) + "";
    
                            var _rowsum = _ia * _iup;
                            _rowsum = parseFloat(_rowsum);
                            _rowsum=_rowsum.toFixed(3);
                            _rowsum = _rowsum.toComma();
                            _fprace=_fprace+"☆"+_rowsum
                        }else{
                            _ia = parseFloat(_ia) + "";
                            _iup = parseFloat(_iup) + "";
    
                            var _rowsum = _ia * _iup;
                            _rowsum = parseFloat(_rowsum);
                            _rowsum=_rowsum.toFixed();
                            _rowsum = _rowsum.toComma();
                            _fprace=_fprace+"☆"+_rowsum


                        }
						
						}
					}
                });
				_fprace=_fprace.split("☆")
				//_fprace="";
				var _sum = 0;
				$.each(_$PRICE, function (idx, o1) {
					      
                    var _val=0;
                   // var _o1 = $(o1).xval().replace(/,/gi, "");
				   
				   // console.log(_o);
				   //if (idx != 0){
						$(o1).xval(_fprace[idx])
						var _o1 = _fprace[idx].replace(/,/gi, "");
						console.log(_o1)
						if( $.isNumeric(_o1) ){
						_val = parseFloat(_o1);
                        
						_sum += _val;
						}
				  // }
				});
                
                _sum = _sum+ "";
                _sum = _sum.toComma();

				$("input[name='total_sum']", el).xval(_sum);

            }
			, cal_sum4: function (el , tr) {                                
                var _me = _$$.aprv_sub103.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
				
				
				 var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);

                //var _$isupply = $("input[name='_UNITCOST']", _$input_trs);
				var _$AMOUNT = $("input[name='_CUSTOMER']", _$input_trs);
				var _$AMOUNT1 = $("input[name='_CUSTOMER_INFO']", _$input_trs);
				//var _$PRICE = $("input[name='_PRICE']", _$input_trs);
				
				var _sum33="";
				
				$.each(_$AMOUNT, function (idx, o1) {
				     var _o1 = $(o1).xval();

				     //console.log(idx)
				    // console.log(o1)
				     if (idx == 1) {
				         _sum33 = _o1

				     }
				     $(o1).xval(_sum33);
				});
				
				$.each(_$AMOUNT1, function (idx, o1) {
				     var _o1 = $(o1).xval();

				     //console.log(idx)
				     console.log(_o1)
				     if (idx == 1) {
				         _sum33 = _o1

				     }
				     $(o1).xval(_sum33);
				});
				
				
				//_sum33=_sum33.split("☆")
				

            }
			, cal_sum5: function (el , tr) {                                
                var _me = _$$.aprv_sub103.subdoc;
				//alert( _me.SUBNAME)
                var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);
				
				
				 var _$input_tbl = $("table[name=" + _me.SUBNAME + "_Table01]", el);
				

                var _$input_trs = $("tr", _$input_tbl);

                //var _$isupply = $("input[name='_UNITCOST']", _$input_trs);
				var _$AMOUNT = $("input[name='_DEPT']", _$input_trs);
				var _$AMOUNT1 = $("input[name='_DEPT_INFO']", _$input_trs);
				//var _$PRICE = $("input[name='_PRICE']", _$input_trs);
				
				var _sum33="";
				
				$.each(_$AMOUNT, function (idx, o1) {
				     var _o1 = $(o1).xval();

				     //console.log(idx)
				    // console.log(o1)
				     if (idx == 1) {
				         _sum33 = _o1

				     }
				     $(o1).xval(_sum33);
				});
				
				$.each(_$AMOUNT1, function (idx, o1) {
				     var _o1 = $(o1).xval();

				     //console.log(idx)
				     console.log(_o1)
				     if (idx == 1) {
				         _sum33 = _o1

				     }
				     $(o1).xval(_sum33);
				});
				
				
				//_sum33=_sum33.split("☆")
				

            }
            , numericCheck: function (arg1, arg2) {
                var tmp = arg1;
                tmp = tmp.replace(/,/gi, "");
                var absTmp = Math.abs(tmp);
                if (tmp.length == 1 && tmp == "") {
                    Re = true;
                } else if (arg2 == 0) {		//소숫점 허용하지 않음
                    var reDigit = /[^0-9]/;
                    Re = reDigit.test(absTmp);
                } else {		//소숫점 허용
                    var reDigit = /[^0-9.]/;
                    Re = reDigit.test(absTmp);
                }
                if (Re) {
                    return "0";
                } else {
                    return tmp;
                }
            }

            /* _$$.aprv_sub099.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            ,
            save: function ($doc, opt) {

                var el = $doc.element;
                //저장시 계정명을 필드에 설정
                var _text = $("select[name='ed_acccode']", el).find("option:selected").text();                
                $("[name=ed_acccode_Nm]", $doc.element).val(_text);

                //밸리데이션 체크
                /*
                if ($("input[name='REQUSER1']", el).xval() == "") {
                    $fn.alert({
                        msg: $fn.getCodeMsg("aprv_sub_099.msg.a1")
                    });
                    return false;
                }
                */
				//Circulation3
				if($("input[name='ed_formtype_Nm']",el).val()=="ko:일반구매품,jp:一般購買品" && $("input[name='Circulation3']",el).val().indexOf("조현승") < 0 && $("[name=work1]", el).val()=="E1"){
						//$fn.alert({//aprv_sub_103.title.a36
						//	msg: $fn.getCodeMsg("aprv_sub_103.title.a48")
						//});
					
					// return false;
					
				}
				if( $("input[name='ed_formtype_Nm']",el).val()=="ko:시작개발품,jp:試作開発品" && $("input[name='FormRefer']",el).val() == "" ) {
					 //$fn.alert({//aprv_sub_103.title.a36
                        //msg: $fn.getCodeMsg("aprv_sub_103.title.a46")
                   // });
					
					// return false;
				}
               
				if( $("select[name='ed_formtype']").val()=="") {
					 $fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_103.title.a36")
                    });
					
					 return false;
				}
                if( $("input[name='ed_phone']").val()=="") {
					 $fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_103.title.a39")
                    });
					
					 return false;
				}
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				
				//ed_attachkind_Nm
				if ($("input[name='ed_attachkind_Nm']").val() == "") {
						 $fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_103.title.a47")
						});
					
				        return false;
					
					}

				    if ($("#attachments").html().indexOf("attach_filename") < 0) {
				        $fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_103.title.a40")
                    });
					
				        return false;
				    }

				
				
				 if( $("input[name='ed_gubun_Nm']").val()=="") {
					 $fn.alert({//aprv_sub_103.title.a36
                        msg: $fn.getCodeMsg("aprv_sub_103.title.a41")
                    });
					
					 return false;
				}
				//ed_gubun_Nm
				
				
                var _me = _$$.aprv_sub103.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

                var _$table = $("table[name=" + _me.SUBNAME + "_Table01]", $doc.element).xtable("instance");

                //****************************************************//
                //			결재 진행중인 문서는 항목 부분에 대해서는 수정 불가
                //				 - 2017.11.20 by dwlee
                //****************************************************//
                if (_opt.docstatus != "draft") {
					$("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
                    return true;
                }
			
                //****************************************************//
                //				임시저장인 경우  Validate 체크를 제외
                //				 - 2017.11.20 by dwlee
                //****************************************************//
                if (_aopt.actiontype == "draft") {
                    
                   $("input[name=fld_formdata]", $doc.element).val(_$table.getData(false));
                    return true;
                }

                //필수입력 체크
                var _isvalid = true;
                if (!_$table.validate()) {
                    _isvalid = false;
                    return false;
                }
                // $fn.validate($el) {
                //     _isvalid = false;
                //     return false;
                // }
                // if (!$fn.validate($("table[name='subform054_body']"))) {
                //     _isvalid = false;
                //     return false;
                // }
                //console.log(_$table.getData().replace(/\"/gi,'＂'))

                var tabledata=_$table.getData(false);

                    //5번째 값이 1 (일반)이고 4번째 값(날짜) 공백이 아니면 진행 일반이면 날짜 반드시 있어야됨
                // 1†85†556†55†2021-09-28†1†55†555†0†0.0†E1¶4106¶법무T 법무P†101-09-48090¶미래테크†55†††††1†
                if(tabledata.indexOf(";") > -1){
                    //여려개 체크
                        tabledata=tabledata.split(";");
                        for(var i=0; i < tabledata.length; i++){
                            tabledata1=tabledata[i].split("†");
                            console.log(tabledata1[5]+" : "+tabledata1[4])
                            if(tabledata1[5]=="1" && tabledata1[4]==""){
                                $fn.alert({//aprv_sub_103.title.a36
                                    msg: $fn.getCodeMsg(tabledata1[0]+" 번째 행 선입고 및 선발주가 아닌경우에는 반드시 입고요청일을 입력하세요.")
                                });
                                return false;
                            }
                        }
                }else{
                    //1개일때 체크
                        tabledata=tabledata.split("†");
                        console.log(tabledata[5]+" : "+tabledata[4])
                        if(tabledata[5]=="1" && tabledata[4]==""){
                            $fn.alert({//aprv_sub_103.title.a36
                                msg: $fn.getCodeMsg(tabledata[0]+" 번째 행 선입고 및 선발주가 아닌경우에는 반드시 입고요청일을 입력하세요.")
                            });
                            return false;
                        }
                }



                $("input[name=fld_formdata]", $doc.element).val(_$table.getData().replace(/\"/gi,'＂'));
               // $("input[name=fld_formdata]", $doc.element).val(_$table.getData());

                console.log("103 save : ", _isvalid);
                return _isvalid;    



            }
        }
    }
}
    ($dwp.cns("app"), jQuery));







































