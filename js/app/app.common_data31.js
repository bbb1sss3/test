/* Source File Upload Time : 2021-03-12 2:29:59 PM*/


/* Source File Upload Time : 2021-02-02 2:17:04 PM*/


/* Source File Upload Time : 10-1-19 12:10:44 PM*/


/* Source File Upload Time : 2019-09-30 6:49:45 PM*/


 

/**
 *  덴소 더존 인사시스템 생산직 정보 
 */
(function(_$$, $) { 
	_$$.common_data31 = {
		doc: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},

			init: function (opt) {
				var _me = this, _opt = _me._initOptions(opt);
				var _doc = $fn.doc(_opt);
				if (_opt.isedit) {
					//$("input[name=EnteringDate]", _doc.element).datepicker("option", "minDate", "2019-03-15");
				}
				
			},						
			_initOptions: function (opt) {
				var _me = this, _opt = $.extend({}, opt);

				_opt.button = {
					// 저장	
					savedoc: {
						title: $fn.getCodeMsg("comm.btn.reg"),
						click: function (doc) {
							//console.log("doc", doc);
							doc.save({ actiontype: "save", docstatus: "reg" });
						}
					},
					//편집
					editdoc: {
						title: $fn.getCodeMsg("comm.btn.edit"),
						click: function (doc) {
							doc.editDocument();
						}
					},
					//삭제
					deldoc: {
						title: $fn.getCodeMsg("comm.btn.deldoc"),
						click: function (doc) {
							doc.deleteDocument({ confirm: "삭제하시겠습니까?" });
							// doc.del();
						}
					},
					goview: {
						title: "목록",
						click: function (doc) {
							doc.goview();
						}
					}
				};

				return _opt;
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
				console.log("1@@")	
				_opt.header = _me._headerInfo(_opt);	
				console.log("@@")				
				return _opt;
			}
			,init : function(opt, el) {				
				var _me = this
				,_view = null
				,_el = el
				,_opt = _me._initOptions(opt);
				
				//_me._categoryInfo(opt,_el);
				
				_view = $fn.view(_opt, el);
				
				//console.log('S::언어' + $fn.getCurLangMsg(_author_disp_lang));

				
			}
		
			,_buttonInfo : function(_opt) {
				var _btnList = {									
					pdel : {
						title : $fn.getCodeMsg("common_data31.btn.pdelete")
						,click : function(view) {
							$fn.confirm({msg : $fn.getCodeMsg("common_data31.msg.pdeleteconfirm")}).done(function(){
								view.deleteDocument({softdel : false});
							})
						}
						,icon : $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"
					}

					,create: {
						title: $fn.getCodeMsg("common_data31.btn.write"),
						click: function (view) {
							view.createDocument({ param: {} });
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
				}
				,_sbtnList = {
					wproductreq :  ["pdel","create"]
					,w_pop_productreq : []
				};
				
				//보기의 종류와 상관없이 모든 버튼들을 할당 - 2017.08.10
				return _btnList;

				//보기별로 사용하는 버튼만 할당하기 위한 소스 - 2017.08.10
				//return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);
			}	
			,_headerInfo : function(_opt) {
				var _me = this, _col = {
					dept : {
						name : '_dept'
						,title : "부서명"
						,click :	function(view,data, ele){
							_$$.common_data31.view._poptrclickcode(view,data, ele);
						}
						,width : '10%'
						,sort : true
						,css : 'dwp-cursor'
					}
					,deptcode : {			// 이름
						name : '_deptcode'
						,type : 'fnc'
						,title : "부서코드"
						,click :	function(view,data, ele){
							_$$.common_data31.view._poptrclickcode(view,data, ele);
						}
						,width : '30%'
						,sort : true
						,css : 'dwp-cursor'
					}	
					
					
				}
				,_hList = {
					deptview : {
						checkbox : false
						,formalias : "wFormHREmp"
						,isreply : false
						,iscategory : false 
						,colnm : ['dept','deptcode']
						,search : [{title : "전체", key : "all"}
							 
						]
					}

				};
				
				_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);
				return _hList[_opt.viewalias];
			}
			, //요기까지가 view

			// 지불증 계정 팝업의 계정 선택시
			_poptrclickcode : function (view ,data , ele) {
				var __dlg = $("#"+ele.options.did), _inst = __dlg.xdialog("instance");
				var _opt = _inst.options.referdata;				
				var _aprdoc = _opt.aprdoc;
				var _tr = _opt.tr;
				
				
				var _dept = data._dept;
				var _deptcode = data._deptcode;
				//var _name1 = data._danga;
				
				
				
				var _$dept = $("[name='H_2_1']",_tr);	
				_$dept.xval(_dept);
				var _$title = $("[name='Subject']",_tr);	
				_$title.xval( _dept+" 설비점검 CheckSheet "+"("+ $("[name='H_2']",_tr).val()+")");
			
				//var _$title1 = $("[name='dangainfo']",_tr);	
				//	_$title1.xval(_name1);
			
				
				_inst.close();
			}
			

		}
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
				var _topt = _$$.common_data31.view.getOptions({viewalias:opt.viewalias});
				_topt.header.formalias = _topt.header.formalias + "_mo"		// 작성양식 수정				
				return _topt;
			}
		}

	};
}($dwp.cns("app"), jQuery));









