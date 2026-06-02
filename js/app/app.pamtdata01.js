/* Source File Upload Time : 2019-07-12 11:33:23 AM*/


/**
 * 구매승인관리 , 부서관리 , 계정관리 JS
 */
(function(_$$, $) { 
	_$$.pamtdata01 = {
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
				_opt.header = _me._headerInfo(_opt);				
				return _opt;
			}
			,init : function(opt, el) {
				var _me = this
				,_view = null
				,_el = el
				,_opt = _me._initOptions(opt);
				
				//_me._categoryInfo(opt,_el);
				
				_view = $fn.view(_opt, el);
				
			}
		
			,_buttonInfo : function(_opt) {
				var _btnList = {									
					pdel : {
						title : $fn.getCodeMsg("pamtdata01.btn.pdelete")
						,click : function(view) {
							$fn.confirm({msg : $fn.getCodeMsg("pamtdata01.msg.pdeleteconfirm")}).done(function(){
								view.deleteDocument({softdel : false});
							})
						}
						,icon : $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"
					}

					,create: {
						title: $fn.getCodeMsg("pamtdata01.btn.write"),
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
					created : {
						name : '_created'
						,title : $fn.getCodeMsg("pamtdata01.title.a1")
						,width : '90px'
						,sort : true
						,css : 'dwp-cursor'
					}
					,location : {
						name : '_location'
						,title : $fn.getCodeMsg("pamtdata01.title.a22")
						,width : '50px'
						,sort : true
						,css : 'dwp-cursor dwp-left'
					}
					//부서 조회 팝업용
					,plocation: {
						name : '_plocation'
						,type : 'text'
						,title : $fn.getCodeMsg("pamtdata01.title.a22")
						,click :	function(view,data, ele){

							_$$.pamtdata01.view._poptrclickdept(view,data, ele);
						}	
						,width : '20%'
						,sort : true
						,css : 'dwp-cursor'
					}	
					,deptcode : {
						name : '_deptcode'
						,title : $fn.getCodeMsg("pamtdata01.title.a20")
						,width : '120px'
						,sort : true
						,css : 'dwp-cursor'
					}
					//부서 조회 팝업용
					,pdeptcode: {
						name : '_pdeptcode'
						,type : 'text'
						,title : $fn.getCodeMsg("pamtdata01.title.a20")
						,click :	function(view,data, ele){

							_$$.pamtdata01.view._poptrclickdept(view,data, ele);
						}	
						,width : '30%'
						,sort : true
						,css : 'dwp-cursor'
					}
					,deptname : {
						name : '_deptname'
						,type : 'fnc'
						,title : $fn.getCodeMsg("pamtdata01.title.a21")
						,width : 'auto'
						,sort : true
						,css : 'dwp-cursor'
					}
					//부서 조회 팝업용
					,pdeptname: {
						name : '_pdeptname'
						,type : 'text'
						,title : $fn.getCodeMsg("pamtdata01.title.a21")
						,click :	function(view,data, ele){

							_$$.pamtdata01.view._poptrclickdept(view,data, ele);
						}	
						,width : '50%'
						,sort : true
						,css : 'dwp-cursor'
					}
					,gubun : {			// 계정의 구분값 (비용/자산)
						name : '_gubun'
						,type : 'fnc'
						,title : $fn.getCodeMsg("pamtdata01.title.a5")
						,width : '120px'
						,sort : true
						,css : 'dwp-cursor'
					}	
					,acccode : {			// 계정코드
						name : '_acccode'
						,type : 'fnc'
						,title : $fn.getCodeMsg("pamtdata01.title.a24")
						,width : '120px'
						,sort : true
						,css : 'dwp-cursor'
					}	
					,accname : {			// 계정명
						name : '_accname'
						,type : 'fnc'
						,title : $fn.getCodeMsg("pamtdata01.title.a25")
						,width : 'auto'
						,sort : true
						,css : 'dwp-cursor'
					}
				}
				,_hList = {
					w_use_deptcode : {
						checkbox : true
						,formalias : "wFormDeptCode"
						,isreply : false
						,iscategory : false 
						,colnm : ['location','deptcode','deptname']
						,search : [{title : $fn.getCodeMsg("pamtdata01.title.all"), key : "all"}
							 , {title : $fn.getCodeMsg("pamtdata01.title.a20"), key : "deptcode"}
							 , {title : $fn.getCodeMsg("pamtdata01.title.a21"), key : "deptname"}
						]
					}
					,w_use_acccode : {
						checkbox : true
						,formalias : "wFormAccCode"
						,isreply : false
						,iscategory : false 
						,colnm : ['location','gubun','acccode','accname']
						,search : [{title : $fn.getCodeMsg("pamtdata01.title.all"), key : "all"}
							 , {title : $fn.getCodeMsg("pamtdata01.title.a24"), key : "acccode"}
							 , {title : $fn.getCodeMsg("pamtdata01.title.a25"), key : "accname"}
						]
					}		
					,w_pop_dept : {
						checkbox : false
						,formalias : "wFormDeptCode"
						,isreply : false
						,iscategory : false 
						,nolink : false
						//,colnm : ["pkind", "pcode", "pcompanyproto", "pusernum", "pvalue", "pcommaster"]
						,colnm : ['plocation','pdeptcode','pdeptname']
						,excel_colnm : ['pdeptcode','pdeptname']
///						,css : _$$.budget01.view._popupaccount
						,search : [{title : $fn.getCodeMsg("comm.title.searchall"), 			key : "all"}						
							 , {title : $fn.getCodeMsg("pamtdata01.title.a20"), 			key : "deptcode"}
							 , {title : $fn.getCodeMsg("pamtdata01.title.a21"), 			key : "deptname"}
						]
					}		
				};
				
				_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);
				return _hList[_opt.viewalias];
			}
			, //요기까지가 view
			//팝업창에서 거래처 조회에서 TR 클릭시 수행.
			_poptrclickdept : function (view,data,ele) {				
				var __dlg = $("#"+ele.options.did), _inst = __dlg.xdialog("instance");
				var _opt = _inst.options.referdata;				
				var _aprdoc = _opt.aprdoc;
				var _tr = _opt.tr;
				
				//var _customcode = $.isArray(data._pcustomercode) ? data._paccountcode[0]:data._pusernum;
				///var _customname = $.isArray(data._pcustomer) ? data._paccount[0]:data._pvalue;				
				var _location = data._plocation;
				var _deptcode = data._pdeptcode;
				var _deptname = data._pdeptname;				
				
								
				//var _captin = $.isArray(data._prepresentative) ? data._prepresentative[0]:data._prepresentative;	//대표자
				//var _charge = $.isArray(data._pcharge) ? data._pcharge[0]:data._pcharge;							//담당자
				//var _bank = $.isArray(data._pbank) ? data._bank[0]:data._pbank;										//은행
				//var _actnum = $.isArray(data._paccountnum) ? data._paccountnum[0]:data._paccountnum;				//계좌
				//var _hp = $.isArray(data._php) ? data._php[0]:data._php;											//HP
				/*
				_prepresentative,_pcharge,_bank,_paccountnum,_php
				*/
				
				var _$dept = $("[name='_DEPT']",_tr);	
				_$dept.xval(_deptname);		
				var _$deptinfo = $("[name='_DEPT_INFO']",_tr);	
				//부서코드¶부서명
				_$deptinfo.xval(_location+"¶"+_deptcode+"¶"+_deptname);
				
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
				var _topt = _$$.pamtdata01.view.getOptions({viewalias:opt.viewalias});
				_topt.header.formalias = _topt.header.formalias + "_mo"		// 작성양식 수정				
				return _topt;
			}
		}

	};
}($dwp.cns("app"), jQuery));

