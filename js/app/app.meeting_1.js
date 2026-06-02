/* Source File Upload Time : 2-13-20 9:23:18 AM*/


/* Source File Upload Time : 2019-12-06 1:22:55 AM*/


/* Source File Upload Time : 2019-12-05 11:25:28 AM*/


/* Source File Upload Time : 2019-11-12 12:41:45 PM*/


/* Source File Upload Time : 10-15-19 9:39:10 AM*/


/* Source File Upload Time : 9-23-19 10:34:43 AM*/


/* Source File Upload Time : 2019-08-02 6:06:33 PM*/


/* Source File Upload Time : 2019-08-02 4:41:51 PM*/


/**
 * 결의서 관리 JS
 */
(function(_$$, $) { 
console.log("::Start");
	_$$.meeting_1 = {
		_$opt : {}
		,_$el : {}
		,_$doc : null
		,_$ddoc : null
		,_$view : null
		,PRODUCT_DB			: "/dwp/aprv/com/densocode.nsf"						//생산작업의뢰서코드 DB
			
		,doc : {
			
			getOptions : function(opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			}
			,init : function(opt, el) {
				var _me = this
				,_opt = _me._initOptions(opt);
				var _doc = $fn.doc(_opt);
				console.log("::Start1");
				_me._buttonBind(_doc,_opt);

				console.log("bbbb");

				//console.log("size : ",$("input[name='FBEDDT']", $(_doc.element)).size());

					$("input[name='FBEDDT']", $(_doc.element)).datepicker({
						showOn: "button",
						dateFormat: "yy-mm-dd",
						buttonImage: _weblib + "/images/common/empty.png",
						buttonImageOnly: true,
						buttonText: "Select date"
					});


					//$dwp.ui.datepicker(_doc,null,null,"FBEDDT");

				console.log("cccc");			
			}
			
			,_buttonBind : function(doc,opt) {	
				var _ele = doc.element;			
				var _$close = $(".dwp-btn-close",_ele);
				//닫기 버튼
				_$close.on("click", function () {
					$("#"+opt.did).prev().children(".ui-dialog-titlebar-close").click();
				});	

				var _$save = $(".dwp-btn-save",_ele);
				//저장 버튼
				_$save.on("click", function () {

					
					//FBEEDT

					var _callback = function(){
						$fn.toast({msg : "문서가 저장되었습니다."});
						$("#"+opt.did).prev().children(".ui-dialog-titlebar-close").click();
					}
					doc.save({actiontype : "save", docstatus : "reg", callback : _callback});			
				});	

				var _$edit = $(".dwp-btn-edit",_ele);
				//수정 버튼
				_$edit.on("click", function () {
					doc.editDocument({actiontype : "save", docstatus : "reg"});		
				});

				var _$del = $(".dwp-btn-del",_ele);
				//수정 버튼
				_$del.on("click", function () {
					$fn.confirm({msg : "삭제하시겠습니까?"}).done(function(){
						doc.deleteDocument({softdel : false});
					})	
				});

				var _$bank = $(".dwp-btn-bank",_ele);
				if (_$bank.size() > 0) {
                		_$bank.bind("click", function () {
                    		var _buttons = [
					{
                        		"title": "확인",
                        		"click": function (obj) {
                           			var _$tree = $("[name='tree-desc7']", obj.element).xtree("instance");
                           			var _treenodes = {};
                           			var _dtnode = _$tree.getActiveNode();

                           			$("input[name='RBankCode']", _ele).xval(_dtnode.data.key);
                           			$("input[name='RBankCodeName']", _ele).xval(_dtnode.data.text_h);
                           			$("")

                           			obj.close();
                           		}
                    		}
                        	, {
                        		"title": "취소",
                        		"click": function (obj) {
                            			obj.close();
                        		}
                   		 }];
                   		 var dialogContext = $dwp.ui.dialog.init(null, {
                       			 modal: true,
                        		resizable: false,
                        		draggable: true,
                        		title: "발행처 선택",
                        		width: 400,
                        		height: 600,
                        		show: 'fade',			//effect
                        		hide: 'fade',			//effect
                        		//autoOpen: false,		//.dialog("open")호출시만 열림
                        		buttons: _buttons,
                        		initcallback: function (obj) {
                        		},
                        		content: { url: "/dwp/aprv/com/resoladmin.nsf/wPopup_desc7?ReadForm", data: { o_did: opt.did } }
                    		});
                		});
				}

				
				var _$user = $(".dwp-btn-user",_ele);
				if (_$user.size() > 0) {
                			_$user.bind("click", function () {
			        		$dwp.ui.org.orgsselect.init($(this), {
					      	seltype : "2"
					       	,selcallback : function(org){
								console.log(org);

					        		$("input[name=RSaBon]", _ele).val(org.oinfo.empno);
					        		$("input[name=RSaBonName]", _ele).val($fn.getCurLangMsg(org.oinfo.username));
					        	}
						});
					});
		
				}
			}
		
			,_initOptions : function(opt) {
				var _me = this
				,_opt = $.extend({}, opt);
				
				_opt.button = {
					savedoc : {
						title : $fn.getCodeMsg("meeting_1.btn.save"),
						click : function(doc) {
							var el = doc.element;
							//if ($("input[name='Account_CD']").val() == "" || $("input[name='Account_NM']").val() == "") {
							if ($("input[name='RequestCom']").val() == "") {
								$fn.alert({msg : $fn.getCodeMsg("meeting_1.title.a1")});
								return false;
							}
							$fn.confirm({msg : $fn.getCodeMsg("meeting_1.msg.save")}).done(function(){
								var _callback = function(){
									$fn.toast({msg : $fn.getCodeMsg("meeting_1.msg.save_done")});
									doc.goview();
								}
								doc.save({actiontype : "save", docstatus : "reg", callback : _callback});
								if(opt.did != ""){
									$("#" + opt.did).prev().children(".ui-dialog-titlebar-close").click();
								}
							})
						}
					}
					,editdoc : {
						title :$fn.getCodeMsg("meeting_1.btn.edit"),
						click : function(doc) {
							doc.editDocument({actiontype : "save", docstatus : "reg"});
						}
					}
					,deldoc : {
						title : $fn.getCodeMsg("meeting_1.btn.del"),
						click : function(doc) {
							$fn.confirm({msg : $fn.getCodeMsg("meeting_1.msg.pdeleteconfirm")}).done(function(){
								doc.deleteDocument({softdel : false});
							})
						}
					}
					,goview : {
						title : $fn.getCodeMsg("meeting_1.btn.list"),
						click : function(doc) {
							doc.goview();
						}
					}
					,close : {
						title : $fn.getCodeMsg("meeting_1.btn.close"),
						click : function(doc) {
							window.close();
						}
					}
				};

				return _opt;
			}
		} //요기까지가 doc


		,doc_mo : {
			getOptions : function() {
				return $.extend({}, _me._initOptions(opt));
			}
			,init : function(opt) {
				var _me = this
				,_topt = _me._initOptions(opt);
				var _opt = $.extend({}, opt, _topt);
				var _doc = $fn.doc(_opt);
				var _el = _doc.element;

				$("[name^='IsApprove_']", _el).prop("disabled", true)	

				//회의실예약 참석자 선택
				$fn.orgsel($("[name='org2']", _doc.element)
						,{isedit : _opt.isedit, treetype : "0", seltype : "0", isseltype : false, fld : "Users", count : 0, ismobile : true});

				$("[name='apply']", _el).off().on("click", function(){
					_opt.button.applydoc.click(_doc)
				})

				$("[name='save']", _el).off().on("click", function(){
					_opt.button.savedoc.click(_doc)
				})
			}
			,_initOptions : function(opt) {
				var _me = this;
				var _topt = _$$.meeting_1.doc.getOptions(opt);
				var _opt = $.extend({}, _topt);

				_opt.button['savedoc'] = {
					title : $fn.getCodeMsg("meeting_1.btn.save"),
					click : function(doc) {
						/*
						if(!_$$.meeting_1._duplCheck(_opt)){
							$fn.alert({msg : $fn.getCodeMsg("meeting_1.msg.overlap")});
							return false;
						}
						*/
						
						var uF = $("[name='UsersFull']", doc.element);
						var _mArr = uF.val().split(";");
						var _rtn = false;
						$(_mArr).each(function(i,o){
							var _oArr = o.split("^");
							if(_oArr[0] == "B"){
								_rtn = true;
							}
						})

						if(_rtn){
							$fn.confirm({msg : $fn.getCodeMsg("meeting_1.msg.warning_seldept")})
							.done(function(){
								var mNotice = $("[name='MailNotice']", doc.element);
								mNotice["0"].checked = true;
								$fn.confirm({msg : $fn.getCodeMsg("meeting_1.msg.regdoc")}).done(function(){
									var _callback = function(){
										$fn.toast({msg : $fn.getCodeMsg("meeting_1.msg.regdone")});
										doc.goview();
										//복제처리
										var _url = opt.cdb + "/wcmdpost_meeting_1?createdocument";
										_$$.budget00._cmdPost(_url, opt, {actiontype : "replica", docstatus : "reg", unid : opt.unid});
									}
									doc.save({actiontype : "save", docstatus : "reg", callback : _callback});
								})
							})
							.fail(function(){
								var mNotice = $("[name='MailNotice']", doc.element);
								mNotice["1"].checked = true;
								$fn.confirm({msg : $fn.getCodeMsg("meeting_1.msg.regdoc")}).done(function(){
									var _callback = function(){
										$fn.toast({msg : $fn.getCodeMsg("meeting_1.msg.regdone")});
										doc.goview();
										//복제처리
										var _url = opt.cdb + "/wcmdpost_meeting_1?createdocument";
										_$$.budget00._cmdPost(_url, opt, {actiontype : "replica", docstatus : "reg", unid : opt.unid});
									}
									doc.save({actiontype : "save", docstatus : "reg", callback : _callback});
								})
							})
						}else{
							$fn.confirm({msg : $fn.getCodeMsg("meeting_1.msg.regdoc")}).done(function(){
								var _callback = function(){
									$fn.toast({msg : $fn.getCodeMsg("meeting_1.msg.regdone")});
									doc.goview();
									//복제처리
									var _url = opt.cdb + "/wcmdpost_meeting_1?createdocument";
									_$$.budget00._cmdPost(_url, opt, {actiontype : "replica", docstatus : "reg", unid : opt.unid});
								}
								doc.save({actiontype : "save", docstatus : "reg", callback : _callback});
							})
						}
					}
					,icon : $fn.getPath("weblib") + "/images/common/btn-confirm.svg"
				};
				_opt.button['editdoc'] = {
					title :$fn.getCodeMsg("meeting_1.btn.edit"),
					click : function(doc) {
						doc.editDocument({actiontype : "save", docstatus : "reg"});
					}
					,icon : $fn.getPath("weblib") + "/images/common/icon-modify-md.svg"
				}
				_opt.button['deldoc'] = {
					icon : $fn.getPath("weblib") + "/images/common/icon-delete.svg"
				}
				return _opt;
			}
		}


		,exdoc : {
			init : function(opt) {
				opt.button = {
					draft : {
						title : $fn.getCodeMsg("meeting_1.btn.tmpsave"),
						click : function(doc) {
							$fn.confirm({msg : $fn.getCodeMsg("meeting_1.msg.regdoc")}).done(function(){
								doc.save({actiontype : "draft", docstatus : "draft"});
							})
						}
					}
				};

				var _me = this, _opt = $.extend({}, opt);
				var _doc = $fn.doc(_opt);
				_$doc = _doc;
				_$opt = _doc.options;
				var _el = _doc.element;
				_$el = _el;

				$("[name='eHour']", _el).on("change", function(){
					var _eh = $(this).val()*1;
					var _sh = $("[name='sHour']", _el).val()*1;
					if(_eh <= _sh){
						$fn.alert({msg : $fn.getCodeMsg("meeting_1.msg.timeover")});
					$("[name='eHour']", _el)[0].selectedIndex = _sh + 1;
						return;
					}
				});

/*******************************************************************************************
				$(".dwp-calendar-form input[type='text']", _el).datepicker({
					showOn: "button",
					dateFormat: "yy-mm-dd",
					buttonImage: _weblib + "/images/common/empty.png",
					buttonImageOnly: true,
					buttonText: "Select date"
				});
********************************************************************************************/

			}
		}


		,view : {
			getOptions : function(opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			}
			,_initOptions : function(opt) {
				var _me = this,_opt = $.extend({}, opt);
				_opt.button = _me._buttonInfo(_opt);
				console.log("::Start43");
				_opt.header = _me._headerInfo(_opt);	
				
				
					
				return _opt;
			},
			_buttonInfo: function (_opt) {
				var _btnList = {}, _sbtnList = {};
				_btnList = {
					// 엑셀 다운로드 기능 제공해야 함
					eprint : {
						title : $fn.getCodeMsg("comm.btn.exceldown"),
						click : function(view,_opt) {
							//var _selection = "BoardID=\"" + _opt.param.boardid + "\"";
							/*
							var _selection = "";
							if(_opt.viewalias == "w_use_219view_y") _selection = "";								
							view.exceldownload({eventcode : "stboard.view", formula : _selection, viewname : _opt.viewalias});
							*/
							
								var _rows = view.getChecked();
                                if (_rows.length == 0) {
									  $fn.alert({
								        msg: $fn.getCodeMsg("문서를 선택하세요")
								    }); //사유
									return false;
									/* 전체다운로드 필요하면 쓰라
                                   	$fn.confirm({msg : "전체"+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){
										
										var _url = "dwp/aprv/com/meetingmangedb.nsf/wexceldown_all?OpenAgent"
										$.fileDownload(_url, {httpMethod : "GET"});	
										
										
										})
										*/
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
								
								
							 
								  $fn.confirm({msg : _rows.length +"개의 "+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){_ok();})
							  

							
							function _ok() {					
								$fn.cmdPost(
									$dwp.core.util.getProxyUrl('/dwp/aprv/com/meetingmangedb.nsf/wcmdrefresh?createdocument')
									,{actiontype : ('refresh_execel_hap'), dbpath : '/dwp/aprv/com/meetingmangedb.nsf' , postdata : _unids }									
									,function(data){
										// "result":"200","re_cd":"del_temp","cnt":"2"
										//alert(data.unid)
										if ( data.hasOwnProperty("result")) {
											//alert(data.result)
											if ( data.result == "200") {
												
												 
												    var _url = "dwp/aprv/com/meetingmangedb.nsf/wexceldown_hap?OpenAgent"+ "&unid=" + data.unid;
												    $.fileDownload(_url, {
												        httpMethod: "POST"
												    });
												
												view.reload({page : 1});
												
												$fn.toast({msg : $fn.getCodeMsg("처리완료 하였습니다") });
											} else {
												//error
											}
										} else {
											//error
										}
										//_me.refresh();
									}
									, 'json'
								);
							}	
							
							
						}
						,icon : $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"
					},					
					pdel: {
						title: $fn.getCodeMsg("comm.btn.pdeldoc"),
						click: function (view) {
							view.deleteDocument({ softdel: false });
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"
					},
					create: {
						title: $fn.getCodeMsg("comm.btn.create"),
						click: function (view) {
							view.createDocument({ param: {} });
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
					
				};
				_sbtnList = {
					wmeetingview_1: ['eprint']
					,wmeetingview_33: ['eprint']
					,wmeetingview_44: ['eprint']
					
					
				};

				return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);
			}, 
			init : function(opt, el) {
				

// select box Name로 접근하여 선택된 값 읽기

				var _me = this
				,_view = null
				,_el = el
				,_opt = _me._initOptions(opt);
				console.log("::Start33");
				//_me._categoryInfo(opt,_el);
				
				_view = $fn.view(_opt, el);
				
				
				
				
			}
		
			
			,_headerInfo : function(_opt) {
				console.log(_opt.iscategory);
				
				
				
				var _me = this, _col = {
					vdate: {
						name : '_FromDate'
						,title : '기안일자'
						,width : 'auto'
						,width : '25%'
						,sort : true
						,sortno : 4
						,css : 'subject-cell'
					}
					,empno: {
						name : '_AuthorName'
						,title : '작성자'
						,width : '25%'
						,sort : true
						,sortno : 4
						,css : 'subject-cell'
					}
					,subject : {
						name : '_Subject'
						,type : 'text'
						,title : '제목'
						,width : '25%'
						,sort : false
						,sortno : 3
						,css : 'subject-cell'
						,category : ''
						,reply : true
						,isnew : true

					}
					,AuthorOrgName: {
						name : '_AuthorOrgName'
						,type : 'text'
						,title : '부서명'
						,width : '25%'
						,sort : false
						,sortno : 3
						,css : 'subject-cell'
						,category : ''
						,reply : true
						,isnew : true

					}
					,attach: {
						name : '_attach'
						,type : 'text'
						,title : '첨부여부'
						,width : '5%'
						,sort : false
						,sortno : 3
						,css : 'subject-cell'
						,category : ''
						,reply : true
						,isnew : true

					}
					//_cardval
				}
				,_hList = {
					wmeetingview : {
						checkbox : false
						,formalias : "wFrmView"
						,isreply : false
						//,sortorder: 'descending',
						,iscategory : false 
						//,category : false
						
						,colnm : ['vdate','empno', 'AuthorOrgName','subject']
						,search : [{title : $fn.getCodeMsg("resoladmin04.title.a6"), key : "all"}
						
						]
					}
					,
					wmeetingview_1 : { //경합보고서
						checkbox : true
						,formalias : "wFrmView"
						,isreply : true
						//,sortorder: 'descending',
						,iscategory : false 
						//,category : false
						
						,colnm : ['vdate','empno', 'AuthorOrgName','subject']
						,search : [{title : $fn.getCodeMsg("resoladmin04.title.a6"), key : "all"}
						
						]
					}						
					,
					wmeetingview_2 : { //사후보고전용
						checkbox : false
						,formalias : "wFrmView"
						,isreply : false
						//,sortorder: 'descending',
						,iscategory : false 
						//,category : false
						
						,colnm : ['vdate','empno', 'AuthorOrgName','subject']
						,search : [{title : $fn.getCodeMsg("resoladmin04.title.a6"), key : "all"}
						
						]
					}	
					,
					wmeetingview_3 : { //보고서 미작성 신청서
						checkbox : false
						,formalias : "wFrmView"
						,isreply : false
						//,sortorder: 'descending',
						,iscategory : false 
						//,category : false
						
						,colnm : ['vdate','empno', 'AuthorOrgName','subject']
						,search : [{title : $fn.getCodeMsg("resoladmin04.title.a6"), key : "all"}
						
						]
					},
					wmeetingview_34 : { //보고서 미작성 신청서(본인)
						checkbox : false
						,formalias : "wFrmView_11"
						,isreply : false
						//,sortorder: 'descending',
						,iscategory : false 
						//,category : false
						
						,colnm : ['vdate','empno', 'AuthorOrgName','subject']
						,search : [{title : $fn.getCodeMsg("resoladmin04.title.a6"), key : "all"}
						
						]
					}
					,
					wmeetingview_44 : { //팀별
						checkbox : true
						,formalias : "wFrmView"
						,isreply : false
						//,sortorder: 'descending',
						,category : {
							name:'_category'
							,lvl:1
							,data : _$$.meeting_1._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/wMeetingView_44?count=999","")
							,change : function(view, select) {
							}
						}
						
						,colnm : ['vdate','empno', 'AuthorOrgName','subject']
						,search : [{title : $fn.getCodeMsg("resoladmin04.title.a6"), key : "all"}
						
						]
					}
					,
					wmeetingview_33 : { //company
						checkbox : true
						,formalias : "wFrmView"
						,isreply : false
						//,sortorder: 'descending',
						,category : {
							name:'_category'
							,lvl:1
							,data : _$$.meeting_1._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/wMeetingView_33?count=999","")
							,change : function(view, select) {
							}
						}
						
						,colnm : ['vdate','empno', 'AuthorOrgName','subject']
						,search : [{title : $fn.getCodeMsg("resoladmin04.title.a6"), key : "all"}
						
						]
					}
					,
					wmeetingview_mail : { //company
						checkbox : false
						,formalias : "wFrmView"
						,isreply : false
						//,sortorder: 'descending',
						,category :false						
						,colnm : ['vdate','empno', 'AuthorOrgName','subject']
						,search : [{title : $fn.getCodeMsg("resoladmin04.title.a6"), key : "all"}
						
						]
					}
				};
				
				_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);
				return _hList[_opt.viewalias];
			}
		,
			//팝업창에서 거래처 조회에서 TR 클릭시 수행.
			_poptrclickdept : function (view,data,ele) {				
				var __dlg = $("#"+ele.options.did), _inst = __dlg.xdialog("instance");
				var _opt = _inst.options.referdata;				
				 
				//var _tr = _opt.tr;
				
				//var _customcode = $.isArray(data._pcustomercode) ? data._paccountcode[0]:data._pusernum;
				///var _customname = $.isArray(data._pcustomer) ? data._paccount[0]:data._pvalue;				
				var _B_Type = data._Code;
				var _B_Name = data._Value;
				//var _deptname = data._pdeptname;				
				//alert(_B_Type)
								
				//var _captin = $.isArray(data._prepresentative) ? data._prepresentative[0]:data._prepresentative;	//대표자
				//var _charge = $.isArray(data._pcharge) ? data._pcharge[0]:data._pcharge;							//담당자
				//var _bank = $.isArray(data._pbank) ? data._bank[0]:data._pbank;										//은행
				//var _actnum = $.isArray(data._paccountnum) ? data._paccountnum[0]:data._paccountnum;				//계좌
				//var _hp = $.isArray(data._php) ? data._php[0]:data._php;											//HP
				/*
				_prepresentative,_pcharge,_bank,_paccountnum,_php
				*/
				
				var _$dept = $("[name='ed_val_2']");	
				_$dept.val(_B_Name);		
				var _$deptinfo = $("[name='ed_val_2_1']");	
				//부서코드¶부서명
				_$deptinfo.val(_B_Type);
				
				_inst.close();
				
			}
				
		,_getRoomCategory : function(opt, url, cate) {
			var _data = [];
			var _data1 = [];
			var _data2 = [];
			//var tmp = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
			var _t = "";
			var _x = "";
			var _url = url;
			console.log(_url);
			console.log(cate);
	        		$fn.xAjax(_$$.meeting_1._jsonGetParmDataUrl(_url, cate))
	        		.done(function(json, status, xhr){
					var j=0;
					var k=0;
					$(json).each(function(i, data){
						
						
						if( data["@unid"]=="" && data["_category"]!="" && data["_category"]!="all"){
							_t = data["_category"];
						
						
						_data1[j] = {title : _t, val : _t , children :[]};
						
					
						
						
							j = j + 1;
						
					}


					});

					
	        		})
				.fail(function(){});						
				_data = _data1;
				console.log("data==============");
				console.log(_data);
			return _data;
			}
				,_jsonGetParmDataUrl: function(url, cate) {
       			var _data = {};
				//alert(cate);
				//alert(_data.category)
			if(cate != ""){_data.category = cate}
			//alert(_data.category)
			//if(cate != ""){return false;}
              		return {
				url : $fn.getProxyUrl(url)
				,dataType : "json"
				,async : false
				,cache : false
				,data : _data
              		};
			}
			
		} //요기까지가 view


		,view_mo : {
			getOptions : function() {
				return $.extend({}, _me._initOptions(opt));
			}
			,init : function(opt, el) {
				var _me = this;
				var _topt = _me._initOptions(opt);				
				_opt = $.extend({}, opt, _topt);
				$fn.view(_opt, el);
				var _con = $dwp.core.mportal.curLayer();
				$(".search-btn", _con).css("display", "")
				$(".view-trigger", _con).css("display", "none")

				$(".check").text(dwpmo.info.protocol + dwpmo.info.domain)

			}
			,_initOptions : function(opt) {
				var _me = this;
				var _topt = _$$.meeting_1.view.getOptions({viewalias:opt.viewalias});
				_topt.header.formalias = _topt.header.formalias + "_mo"		// 작성양식 수정				
				return _topt;
			}
		}
		
		,_getRoomCategory : function(opt, url, cate) {
			var _data = [];
			var _data1 = [];
			var _data2 = [];
			//var tmp = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
			var _t = "";
			var _x = "";
			var _url = url;
			console.log(_url);
			console.log(cate);
	        		$fn.xAjax(_$$.meeting_1._jsonGetParmDataUrl(_url, cate))
	        		.done(function(json, status, xhr){
					var j=0;
					var k=0;
					$(json).each(function(i, data){
						
						
						if( data["@unid"]=="" && data["_category"]!="" && data["_category"]!="all"){
							_t = data["_category"];
						
						
						_data1[j] = {title : _t, val : _t , children :[]};
						
					
						
						
							j = j + 1;
						
					}


					});

					
	        		})
				.fail(function(){});						
				_data = _data1;
				console.log("data==============");
				console.log(_data);
			return _data;
		}
		,_jsonGetParmDataUrl: function(url, cate) {
       			var _data = {};
				//alert(cate);
				//alert(_data.category)
			if(cate != ""){_data.category = cate}
			//alert(_data.category)
			//if(cate != ""){return false;}
              		return {
				url : $fn.getProxyUrl(url)
				,dataType : "json"
				,async : false
				,cache : false
				,data : _data
              		};
		}

	};
}($dwp.cns("app"), jQuery));








