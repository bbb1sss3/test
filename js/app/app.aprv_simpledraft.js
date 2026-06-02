/**
 * 전자결재 보조양식 - 일반기안문(내부결재용)
 * $dwp.app.aprv_simpledraft
 */

(function (_$$, $) {
    _$$.aprv_simpledraft = {
        subdoc: {
            SUBNAME: "simpledraft"
            , hwpcom : $dwp.app.aprv.hwp
            , init: function ($doc) {
                var _me = _$$.aprv_simpledraft.subdoc, _opt = $doc.options;
                var _el = $doc.element;
                console.log("기안문(대내)")
                if (_opt.isnew && _opt.appCfg.hwpfilepath && _opt.appCfg.hwpfilepath != "") {
                    HwpCtrl.EditMode = 1;
                    var _hwpurl = $fn.getSysinfo().protocol+"://"+ $fn.getSysinfo().host + _opt.appCfg.hwpfilepath;
                    HwpCtrl.Open( _hwpurl, "HWP", "", function (res) {
                        _opt.inithwp = true;
                        _me.applyInfoData($doc,_opt);

                        //HwpCtrl.Run('ParagraphShapeAlignRight');  
                        HwpCtrl.MoveToFieldEx("Subject", true, false, true);

                       // _me.hwpActionLock();
                        HwpCtrl.EditMode = 2;  

                        $fn.unblock();

                    }, {});
	        $fn.alert({ msg: $fn.getCodeMsg("연구사업 서식은 기안문(대외)로 작성바랍니다.") });      //2023.11.16 팝업알림추가_이창준
                } else {
                    HwpCtrl.EditMode = 1;
                    _opt.inithwp = true;
                    _me.applyInfoData($doc,_opt);
                
                    if (!_opt.isedit) {
                       HwpCtrl.EditMode = 0;						                                //읽기모드로 셋팅
                       HwpCtrl.ReadOnlyMode = true;                                                 //편집잠금 해제
                       HwpCtrl.MoveToField("Subject");                                              //제목 필드에 포커싱
                    } else {
                        HwpCtrl.EditMode = 2;                                                       //양식모드
                      //  _me.hwpActionLock();
                        HwpCtrl.MoveToField("Subject", true, true, false);
                    }
                        $fn.unblock();
                }

                //협조자 지정 추가 - 2023.08.16 by dwlee
                if (_opt.isedit) {
                //if ($fn.getCurUser().pinfo.empno == "P00001") {
                                _me.selectRefer($doc,_el);
                //}
                        }
                        var user = navigator.userAgent;
                            var is_mobile = false;
                            console.log(user);
            }


            //협조자 버튼 - 2023.08.16 by dwlee
            , selectRefer: function($doc,el) {
            	var _me = _$$.aprv_simpledraft.subdoc;
                var _el = el;
                var _$sbutton = $("div.dwp-sub6-btn",_el);  
                _$sbutton.removeClass("dwp-hidden").addClass("dwp-bold") ;
                $("span",_$sbutton).html("협조자");
                _$sbutton.off("click").on("click",function() {
                    $dwp.ui.org.orgmselect.init($(this), {
                        treetype: "0",
                        seltype: "2",
                        comcode: $fn.getSysinfo().siteccode,
                        usesite: false,
                        site: "",
                        //seluser: _selempno, //기 선택된 사용자 사번 - 2022.03.11
                        issiteselect: false,
                        usesitelist: "",
                        pardoc : $doc,
                        isall: false,
                        fld : "HwpRefer",
                        initload : function(dlg) {
                            //내용없음
                        },
                        selcallback: function (o) {
		    var _data = o.list;
                            var _hwparr = [];

                            if (_data.length > 0) {
                                $.each(_data, function(idx, _d){
                                    _hwparr.push($fn.getCurLangMsg(_d.username))
                                });
                                console.log(_hwparr)
                                if(HwpCtrl.FieldExist("HwpRefer") == true){
                                    HwpCtrl.PutFieldText("HwpRefer", _hwparr.join(","));
                                } else {
                                    console.log("HwpRefer 필드가 없다");
                                }
                            } else {
                                if(HwpCtrl.FieldExist("HwpRefer") == true){
                                    HwpCtrl.PutFieldText("HwpRefer", " ");	
                                } else {
                                    console.log("HwpRefer 필드가 없다");
                                }
                            }        
                        }
                    });                    
                });
            }

            //특정 액션을 수행하지 못하도록 설정 
            , hwpActionLock : function() {
                HwpCtrl.LockCommand("TableCreate", true);                                           //테이블 생성 금지
                HwpCtrl.LockCommand("PictureInsertDialog", true);                                   //그림넣기 금지
            }

            //필드 및 결재선 정보 업데이트 
            , applyInfoData : function(doc,opt) {
                var _me = _$$.aprv_simpledraft.subdoc;                
                var _el  = doc.element,_opt = opt;

                //노츠 필드의 내용을 한글에디터에 넣어주는 함수 호출
                _me.setHwpFieldValue(_el, _opt);

                _me.setHwpLineData(doc);                                                       //한글 양식에 결재선 표시하기

                //누름틀 이외에서 편집이 되는 현상 보정 - 2023.10.18 by dwlee
                 if (_opt.isedit == true) {
                                HwpCtrl.EditMode = 2;  
                    } else {
                        HwpCtrl.EditMode = 0;  
                    }
            }

            //HWP 에디터로 부터 값을 추출하는 함수
            , setHwpFieldValue : function(el,opt) {
                var _el = el, _opt = opt;
                var _me = _$$.aprv_simpledraft.subdoc;  

                //DocNo1로 바꾼 이유는 DocNo 보이게 하면 기존 DocNo은 안보이는데 전부 DocNo이 보이게 되어 부득이 DocNo1로 교체 하여 기존 양식은 DocNo이 안보이도록 함
                _me.hwpcom.putHwpFieldText(_el,"DocNo1");
                _me.hwpcom.putHwpFieldText(_el,"SecretYN");   

                if (_opt.inithwp == true) {                 
                    if (_opt.isnew) {	
                        _me.hwpcom.putHwpFieldText(_el,"HeadCampaign");                    
                        _me.hwpcom.putHwpFieldText(_el,"HeadTitle");                    
                        _me.hwpcom.putHwpFieldText(_el,"TailTitle");                    
                        _me.hwpcom.putHwpFieldText(_el,"Address");                    
                        _me.hwpcom.putHwpFieldText(_el,"Homepage");                    
                        _me.hwpcom.putHwpFieldText(_el,"TelNo");                    
                        _me.hwpcom.putHwpFieldText(_el,"FaxNo");                    
                        _me.hwpcom.putHwpFieldText(_el,"EMail");

                        _me.hwpcom.putHwpFieldText(_el,"SenderName");                   //발신명의
                         HwpCtrl.PutFieldText("DocNoDate", "(" + $fn.toLocalDate(moment()) + ")"); // 오늘날짜 세팅

		           // HwpCtrl.PutFieldText("DocNo", "(" + $fn.toLocalDate(moment()) + ")");

                    } else {
 		_me.hwpcom.putHwpFieldText(_el,"Subject");  
	        }         
                }
            }

            //===============================================================
            //					한글에디터 관련 함수 - 시작
            //						- 2023.03.02 by dwlee
            //===============================================================
            //결재선 보조양식 변경 - 결재선 지정(변경)시 사용
            //type : AprLine, AidLine  //num : 결재라인 갯수(1,2) ==> 결재라인 5라인 이하 :1, 6라인 이상 : 2
            //결재라인 정보 처리하기
            , chkHwpAprLineSub : function(aprinfo,opt) {
                var _me = _$$.aprv_simpledraft.subdoc;
                var _aprinfo = aprinfo, _opt = opt;
                var _fileName = "";
                var _changed = false;                

	            HwpCtrl.EditMode = 1;
                if (_aprinfo.length > 5) {
                    if (!HwpCtrl.FieldExist("ATitle6")) {                           //기존에는 4라인 이하의 결재선이었네.
                        //기존정보 지우고, 8라인 결재선 넣어줘야지
                        _fileName = "Hwp_AprLineSubForm10.hwp";
                        _changed = true;       
                    }
                } else {
                    if (HwpCtrl.FieldExist("ATitle6")) {                            //기존에는 5라인 이상의 결재선이었네.
                        //기존정보 지우고, 4라인 결재선 넣어줘야지
                        _fileName = "Hwp_AprLineSubForm5.hwp";            
                        _changed = true;       
                    }
                }
                if (_changed == true) {
                    HwpCtrl.MoveToField("AprLine", true, true, true);
                    HwpCtrl.PutFieldText("AprLine", "");
      	            var act = HwpCtrl.CreateAction("Delete");	
                    var set = act.CreateSet();
                    act.GetDefault(set);
                    act.Execute(set);                  

                    setTimeout(function () {
                        var _hwpurl = $fn.getSysinfo().protocol + "://" + $fn.getSysinfo().host + $fn.getPath("weblib") + "/jtl/app/"+_fileName; //서버

                        HwpCtrl.MoveToField("AprLine", true, true, true);
                        HwpCtrl.Insert(_hwpurl, "HWP", "", function (res) {
                            _me.deleteHwpTitle("ATitle");                            
                            _me.dspHwpAprLine(_aprinfo, _opt);
                        });
                    },1000);

                } else {
                    _me.deleteHwpTitle("ATitle");                    
                    _me.dspHwpAprLine(_aprinfo, _opt);
                }
            }

            //협조라인 결재박스 처리하기
            , chkHwpAidLineSub : function(aidinfo,opt) {
                var _me = _$$.aprv_simpledraft.subdoc;
                var _aidinfo = aidinfo, _opt = opt;
                var _fileName = "";
                var _changed = false;                

	     HwpCtrl.EditMode = 1;
 	    //최초 협조가 없는 경우 - 2023.08.07 by dwlee
                if (!HwpCtrl.FieldExist("BTitle1")) {
                    _fileName = "Hwp_BLineSubForm4.hwp";            
                    _changed = true;   
                } else if (_aidinfo.length > 4) {
                    if (!HwpCtrl.FieldExist("BTitle5")) {                           //기존에는 4라인 이하의 결재선이었네.
                        //기존정보 지우고, 8라인 결재선 넣어줘야지
                        _fileName = "Hwp_BLineSubForm8.hwp";
                        _changed = true;       
                    }
                } else {
                    if (HwpCtrl.FieldExist("BTitle5")) {                            //기존에는 5라인 이상의 결재선이었네.
                        //기존정보 지우고, 4라인 결재선 넣어줘야지
                        _fileName = "Hwp_BLineSubForm4.hwp";            
                        _changed = true;       
                    }
                }
                if (_changed == true) {
                    HwpCtrl.MoveToField("AidLine", true, true, true);
                    HwpCtrl.PutFieldText("AidLine", "");
      	            var act = HwpCtrl.CreateAction("Delete");	
                    var set = act.CreateSet();
                    act.GetDefault(set);
                    act.Execute(set);                  
                    setTimeout(function () {
                        var _hwpurl = $fn.getSysinfo().protocol + "://" + $fn.getSysinfo().host + $fn.getPath("weblib") + "/jtl/app/"+_fileName; //서버

                        HwpCtrl.MoveToField("AprLine", true, true, true);
                        HwpCtrl.Insert(_hwpurl, "HWP", "", function (res) {
                            _me.deleteHwpTitle("BTitle");
                            _me.dspHwpAidLine(_aprinfo, _opt);
                        });
                    },1000);
                } else {
                    _me.deleteHwpTitle("BTitle");
                    _me.dspHwpAidLine(_aidinfo, _opt);
                }
            }

            , deleteHwpTitle : function(fldName) {
                for (var i= 1 ; i < 13 ;i++) {
                    if (HwpCtrl.FieldExist(fldName+i)) { 
                        HwpCtrl.PutFieldText(fldName+i, " ");
                    }
                }
            }

             //기안, 검토, 결재, 대결, 전결
            //결재자 진행현황 표시
            , dspHwpAprLine : function(aprinfo,opt) {
                var _opt = opt;
                var _me = _$$.aprv_simpledraft.subdoc;      

                $.each(aprinfo, function(idx, _ainfo) {
                    var _hidx = idx + 1;

                    var _title =  $fn.getCurLangMsg(_ainfo.duty);
                    var _name = $fn.getCurLangMsg(_ainfo.h_name);
                    console.log(_ainfo)
                    if (_ainfo.h_date || typeof _ainfo.h_date === "undefined") {                                                            //결재수행한 사람
                        if (_ainfo.h_cmt == "Y") _title+"(의견있음)";
                        if (_ainfo.key != _ainfo.h_notesid) {                                       //대결
                            if (_ainfo.h_type == "decide" && _opt.docstatus == "complete") {        //전결의 대결
                                //전결의 대결 처리            
                                console.log("전결대결처리!")               
                                _me.hwpcom.actHwpCellSplit("ASign" + _hidx, "AStatus"+ _hidx);
                                HwpCtrl.PutFieldText("AStatus" + _hidx, "대결");                    //대결표시
                                
                                HwpCtrl.PutFieldText("ASign" + _hidx, _name);                       //최종 결재자 이름    

                                //2023.08.08 by dwlee
                                HwpCtrl.PutFieldText("ASign" + aprinfo.length, "전결");                //전결 표시
                                //_me.hwpcom.actHwpCellSplit("ASign" + _ainfo.length, "AStatus"+ _ainfo.length);                                
                                //HwpCtrl.hwpcom.PutFieldText("AStatus" + _ainfo.length, "전결");     //전결표시
                            } else {
                                console.log("대결처리!")   
                                //"이수경/P00103/kiflt`}ko:출장"
                                if( _ainfo.h_type == "agree_delegate"){
                                    //var dae= _ainfo.etc.split("/")

                                    _me.hwpcom.actHwpCellSplit("ASign" + _hidx, "AStatus"+ _hidx);
                                    HwpCtrl.PutFieldText("AStatus" + _hidx, "대결");                    //대결표시    
                                                               
                                    HwpCtrl.PutFieldText("ASign" + _hidx, _name);                       //결재자 이름  
                                }
                                     
                            }
                        } else if (_ainfo.h_type == "decide" && _opt.docstatus == "complete") {     //전결
                            //2023.08.08 by dwlee
                            HwpCtrl.PutFieldText("ASign" + aprinfo.length, "전결");                //전결 표시
                            HwpCtrl.PutFieldText("ASign" + _hidx , _name);                          //결재자 이름
                        } else if (_opt.docstatus == "reject") {     //반려
                            //2023.08.08 by dwlee
                            console.log(_hidx+ _name+aprinfo.length);
                            console.log(aprinfo);
                            console.log(aprinfo[idx].h_type);
                            if(aprinfo[idx].h_type == "reject"){
                                HwpCtrl.PutFieldText("ASign" + _hidx , "반려");   
                            }else{
                                HwpCtrl.PutFieldText("ASign" + _hidx, _name);  
                            }
                          // HwpCtrl.PutFieldText("ASign" + aprinfo.length, "반려");                //전결 표시
                          // HwpCtrl.PutFieldText("ASign" + _hidx , "반려");                          //결재자 이름
                             
                        }else {
		                    console.log(_hidx+ _name);
                           
                           // _me.hwpcom.actHwpCellSplit("ASign" + _hidx, "AStatus"+ _hidx);
                            HwpCtrl.PutFieldText("AStatus1", " ");
                            HwpCtrl.PutFieldText("AStatus2", " ");
                            HwpCtrl.PutFieldText("ASign" + _hidx, _name);                           //결재자 이름         
                        }
                    }
                    
                    //HwpCtrl.PutFieldText("AStatus" + _hidx, ""); 
                    HwpCtrl.PutFieldText("ATitle" + _hidx, _title);                                 //결재자 직위 pos                    
                });
            }

            //협조자 진행현황 표시
            , dspHwpAidLine : function(aidinfo,opt) {
                var _me = _$$.aprv_simpledraft.subdoc;  
                var _aidinfo = aidinfo, _opt = opt;

                $.each(_aidinfo, function(idx, _ainfo) {
                    var _hidx = idx + 1;
                    var _title =  $fn.getCurLangMsg(_ainfo.duty);
                    var _name = $fn.getCurLangMsg(_ainfo.h_name);
                    if (_ainfo.h_date != "") {                                                      //결재수행한 사람
                        if (_ainfo.h_cmt == "Y") _title+"(의견있음)";
                        HwpCtrl.PutFieldText("BSign" + _hidx, _name);                               //결재자 이름         
                    }
                    HwpCtrl.PutFieldText("BTitle" + _hidx, _title);                                 //결재자 직위 pos                    
                });
            }
            
            //상태필드가 필요한 경우 Cell 분할 - 2023.03.02
            , setHwpAStatusField : function (vLoc) {
				var _me = _$$.aprv_simpledraft.subdoc;
                var _signFld = "ASign" + vLoc;
                var _statusFld = "AStatus" + vLoc;                
                if(HwpCtrl.FieldExist(_statusFld) == false){
                    _me.hwpcom.actCellSplit(_signFld, _statusFld);
                } else {
                    return;
                }
			}
						
			//한글에디터 결재라인 표시 - 2023.03.02 by dwlee
			, setHwpLineData : function(doc) {
                var _me = _$$.aprv_simpledraft.subdoc, $doc = doc, _opt = doc.options;
                $dwp.app.aprv.line.setLineData($doc);                               	        //결재선 정보 가져오기.
                _opt = $doc.options;
                var _aprinfo = _opt.data.LineData.AP1;                                           //1단계 결재라인 정보
                var _aidinfo = _opt.data.LineData.AG1;                                           //1단계 협조라인 정보     

                _me.chkHwpAprLineSub(_aprinfo,_opt);                                         //결재선이 바뀐경우 결재선 보조양식을 바꿔야 하는지 체크하고 바꿔주는 함수
                if (_aidinfo.length > 0) {
                    _me.chkHwpAidLineSub(_aidinfo,_opt);                                     //결재선이 바뀐경우 협조선 보조양식을 바꿔야 하는지 체크하고 바꿔주는 함수                
                } else {
                    HwpCtrl.MoveToField("AidLine", true, true, true);
                    HwpCtrl.PutFieldText("AidLine", "");
      	            var act = HwpCtrl.CreateAction("Delete");	
                    var set = act.CreateSet();
                    act.GetDefault(set);
                    act.Execute(set); 
                }
	            var commentlist = "";
                if (commentlist != "") {
                    //√
                }
			}
            //===============================================================
            //					한글에디터 관련 함수 - 종료
            //===============================================================	            

            //HWP 에디터로 부터 값을 추출하는 함수 - 문서 저장전....
            , getHwpFieldValue : function(el,opt) {
                var _el = el, _opt = opt;
                var _me = _$$.aprv_simpledraft.subdoc;
                _me.hwpcom.getHwpFieldText(_el, "Subject");

                _me.hwpcom.getHwpFieldText(_el,"HeadCampaign");
                _me.hwpcom.getHwpFieldText(_el,"HeadTitle");

                _me.hwpcom.getHwpFieldText(_el,"PassTo");
               // _me.hwpcom.getHwpFieldText(_el,"TailTitle");
                _me.hwpcom.getHwpFieldText(_el,"Address");
                _me.hwpcom.getHwpFieldText(_el,"Homepage");
                _me.hwpcom.getHwpFieldText(_el,"TelNo");
                _me.hwpcom.getHwpFieldText(_el,"FaxNo");
                _me.hwpcom.getHwpFieldText(_el,"Email");
            }

            //필수필드 체크
            , fieldValidate : function(el) {
                var _el = el , _rtn = true;

                if ($("input[name=Subject]", _el).xval() == "") {
                    $fn.alert({msg : "제목을 입력하세요"});
                    return false;
                }
                return _rtn;
            }            

            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                var _me = _$$.aprv_simpledraft.subdoc;
                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);
                var _el = $doc.element;

                //한글에디터 내용을 노츠 필드로 가져오는 함수 호출
                _me.getHwpFieldValue(_el);

                if (_aopt.docstatus == "draft") {
                    return true;
                }
                //필수필드 체크
                if (!_me.fieldValidate(_el)) {
                    return false;
                }    
                return true;
            }
        }
    }
}($dwp.cns("app"), jQuery));













