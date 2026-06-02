/**
 *  공통 법인카드 양식에서 사용 JS
 */
 (function(_$$, $) { 
	_$$.common_data42 = {
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
			, _initOptions: function (opt) {
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
				console.log("1-2")
				_opt.header = _me._headerInfo(_opt);			
				console.log("1-3")	
				return _opt;
			}
			,init : function(opt, el) {				
				var _me = this
				,_view = null
				,_el = el
				console.log("1")
				,_opt = _me._initOptions(opt);
				//_me._categoryInfo(opt,_el);
				console.log("2")
				_view = $fn.view(_opt, el);
				console.log("3")
				//console.log('S::언어' + $fn.getCurLangMsg(_author_disp_lang));
			}
		
			,_buttonInfo : function(_opt) {
				var _btnList = {									
					pdel : {
						title : $fn.getCodeMsg("common_data42.btn.pdelete")
						,click : function(view) {
							$fn.confirm({msg : $fn.getCodeMsg("common_data42.msg.pdeleteconfirm")}).done(function(){
								view.deleteDocument({softdel : false});
							})
						}
						,icon : $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"
					}
					,create: {
						title: $fn.getCodeMsg("common_data42.btn.write"),
						click: function (view) {
							view.createDocument({ param: {} });
						},
						icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
					}
					,exceldown1: {
						title : $fn.getCodeMsg("comm.btn.exceldown"),
						click: function (view) {
							var _rows = view.getChecked();
							if (_rows.length == 0) {
									 $fn.alert({
								   msg: $fn.getCodeMsg("문서를 선택하세요")
							   }); //사유
							   return false;
							   
						   }
						  
						   var _unids = $.map(_rows, function (v) {
							   return v['@unid'];
						   }).join(';');

						   if(_rows.length != 0){

								$fn.confirm({msg : _rows.length +"개의 "+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){
										
									//_$$.common_data42.exceldownload_view(view, { filenm: moment().format("YYYYMMDDhhmmss") + ".xls", title: "INFO" });
									
							/*/
							$dwp.core.util.getProxyUrl(
							$dwp.core.util.xAjax('/dwp/aprv/com/complete01.nsf/wcmdrefresh2?createdocument')
							,{postdata : _unids }									
							,function(data){
								// "result":"200","re_cd":"del_temp","cnt":"2"
								//alert(data.unid)
								if ( data.hasOwnProperty("result")) {
									console.log(data)
									if ( data.result == "400") {
										
									//	 console.log(data.unid) substr
								  
								
										  
									} else {
										//error
									}
								} else {
									//error
								}
								//_me.refresh();
							}
							, 'json'
						)
						*/

							
									
									var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/complete01.nsf/wexceldown?OpenAgent')
									var _param = {
										postdata : _unids 
									}
									
									var callback = function (data) {    
										   
										if (data.hasOwnProperty('result')) {                         
												console.log(data);
												var _url = "/dwp/aprv/com/complete01.nsf/wexceldown?OpenAgent"+ "&unid=" + data.unid;;
														
	
													$.fileDownload(_url, {httpMethod : "GET"});		
													
													view.reload({page : 1});
													
													$fn.toast({msg :"완료하였습니다." });
										}
									};
									$dwp.core.util.cmdPost(_url, _param, callback, 'json');  
								
								
								
								})
							}
							
						},
						icon : $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"
					}
				}
				,_sbtnList = {
					//w_project_master :  ["pdel","create","exceldown"]
					
				};
				
				//보기의 종류와 상관없이 모든 버튼들을 할당 - 2017.08.10
				return _btnList;

				//보기별로 사용하는 버튼만 할당하기 위한 소스 - 2017.08.10
				return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);
			}	
			,_headerInfo : function(_opt) {
				
				var _me = this, _col = {
					created : {
						name : '_created'
						,title : $fn.getCodeMsg("기안일자")
						,width : '30px'
						,sort : true
						,css : 'dwp-cursor'
					}
					,
					projectname : {
						name : '_projectname'
						,title : $fn.getCodeMsg("과제명")
						,width : '160px'
						,sort : false
						,css : 'dwp-cursor'
					}
					//_ed_a06_1_Nm
					,
					bimok : {
						name : '_ed_a06_1_Nm'
						,title : $fn.getCodeMsg("비목")
						,width : '90px'
						,sort : false
						,css : 'dwp-cursor'
					}	
					//_ed_a06_Nm	
					,
					a06 : {
						name : '_ed_a06_Nm'
						,title : $fn.getCodeMsg("증빙유형")
						,width : '30px'
						,sort : false
						,css : 'dwp-cursor'
					}	
					,
					a07 : {
						name : '_ed_a02'
						,title : $fn.getCodeMsg("통화")
						,width : '30px'
						,sort : false
						,css : 'dwp-cursor'
					}
					,
					a08 : {
						name : '_ed_a03_Nm'
						,title : $fn.getCodeMsg("지출유형")
						,width : '90px'
						,sort : false
						,css : 'dwp-cursor'
					}
					,
					a09 : {
						name : '_usage_name'
						,title : $fn.getCodeMsg("사용목적")
						,width : '90px'
						,sort : false
						,css : 'dwp-cursor'
					}	
					
				}
				,_hList = {
					form215view : {
						checkbox : true
						,formalias : "wFrmView"
						,isreply : false
						,iscategory : false 
						,sort : true
						/**/
						,category : {
							name:'_cate1'
							,lvl:2
							//,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/wMeetingView_1?count=9999","")
							//,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/form215view_cate?count=999","")
							,data : _$$.common_data42._getCardCategory(_opt, "/dwp/aprv/com/complete01.nsf/api/data/collections/name/form215view_cate?count=1000","")
							,change : function(view, select) {
								var that = this;
								console.log('v33-2');
								console.log('view', view);
								console.log('select', select);
								var _opt = view.options;
								var _url = _opt.pathinfo.substring(0, _opt.pathinfo.indexOf("&"));
								_url += "&view=" + _opt.viewalias;
								_url += "&category=" + _opt.single;
								view.options.pathinfo = _url;
								console.log('v33-3');
								view.refresh();
							}
						}
						
						,colnm : ['created','projectname','bimok','a06','a07','a08','a09']
						,search : [{title : $fn.getCodeMsg("전체"), key : "all"}
							 , {title : $fn.getCodeMsg("과제명"), key : "projectname"}
							 ,
							{
								title: $fn.getCodeMsg('작성일'),
								key: 'sStartDate',
								type: "date"
							}
							 //, {title : $fn.getCodeMsg("common_data42.title.a3"), key : "processname"}
						]
					},
					form215view1 : {
						checkbox : true
						,formalias : "wFrmView"
						,isreply : false
						,iscategory : false 
						,sort : true
						/*
						,category : {
							name:'_cate1'
							,lvl:2
							//,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/wMeetingView_1?count=9999","")
							//,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/form215view_cate?count=999","")
							,data : _$$.common_data42._getCardCategory(_opt, "/dwp/aprv/com/complete01.nsf/api/data/collections/name/form215view_cate?count=1000","")
							,change : function(view, select) {
								var that = this;
								console.log('v33-2');
								console.log('view', view);
								console.log('select', select);
								var _opt = view.options;
								var _url = _opt.pathinfo.substring(0, _opt.pathinfo.indexOf("&"));
								_url += "&view=" + _opt.viewalias;
								_url += "&category=" + _opt.single;
								view.options.pathinfo = _url;
								console.log('v33-3');
								view.refresh();
							}
						}
						*/
						,colnm : ['created','projectname','bimok','a06','a07','a08','a09']
						,search : [{title : $fn.getCodeMsg("전체"), key : "all"}
							 , {title : $fn.getCodeMsg("과제명"), key : "projectname"}
							 ,
							{
								title: $fn.getCodeMsg('작성일'),
								key: 'sStartDate',
								type: "date"
							}
							 //, {title : $fn.getCodeMsg("common_data42.title.a3"), key : "processname"}
						]
					}			
					
						
				};
				
				_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);
				return _hList[_opt.viewalias];
				
			}
			, //요기까지가 view

			// 지불증 계정 팝업의 계정 선택시
			_poptrclickaccode : function (view ,data , ele) {
				var __dlg = $("#"+ele.options.did), _inst = __dlg.xdialog("instance");
				var _opt = _inst.options.referdata;				
				var _aprdoc = _opt.aprdoc;
				var _tr = _opt.tr;

				var _code = data._acccode;
				var _value = data._accname;
				
				var _$acode = $("[name='_ACODE']",_tr);	

				_$acode.xval(_code  + " / " + _value);		
				var _$acodeinfo = $("[name='_ACODE_INFO']",_tr);	
				//계정코드
				_$acodeinfo.xval(_code+"¶"+_value);
				
				_inst.close();
			}

			,exceldown : function(opt){

				var _me = this
				,_$el = el || $fn.getTarget()								
				, _msg = "common_data42.msg.exceldown";
							
				$fn.confirm({msg : $fn.getCodeMsg(_msg)})
				.done(function(){
					_download();
				});
	
				function _download() {	
					//alert("TEST");
					
					var _url = opt.cdb + "/wexceldown?OpenAgent";
					//alert(_url);

					$.fileDownload(_url, {httpMethod : "GET"});				
					
				}
			}
			// 과제 선택시 선택시
			,_poptrclickcode : function (view ,data , ele) {
				var __dlg = $("#"+ele.options.did), _inst = __dlg.xdialog("instance");
				var _opt = _inst.options.referdata;				
				var _aprdoc = _opt.aprdoc;
				var _tr = _opt.tr;

				$("[name='projectname']",_tr).xval(data._projectname);	//과제명
				$("[name='project_master_id']",_tr).xval(data._unid);			//총기간


				/*
				$("[name='bizname']",_tr).xval(data._bizname);	//사업명				
				$("[name='projectname']",_tr).xval(data._projectname);	//과제명
				$("[name='projectcodename']",_tr).xval(data._projectcodename);	//과제명
				$("[name='processname']",_tr).xval(data._processname);	//시행기관
	
				$("[name='markname']",_tr).xval(data._markname);		//전담기관
				$("[name='ownerpartname']",_tr).xval(data._ownerpartname);	//주관기관
				$("[name='partiname']",_tr).xval(data._partiname);		//참여기관

				$("[name='bizmoney']",_tr).xval(data._bizmoney);		//총 사업비
				$("[name='companymoney']",_tr).xval(data._companymoney);		//삼현 사업비

				$("[name='FromDate']",_tr).xval(data._FromDate);		//과제기간_FromDate _toDate
				$("[name='ToDate']",_tr).xval(data._toDate);		//과제기간_FromDate _toDate
				$("[name='bizmonthrange']",_tr).xval(data._bizmonthrange);			//총기간

				$("[name='project_master_id']",_tr).xval(data._unid);			//총기간
				*/
				


				_inst.close();
			}
			

		}
		,
        _getCardCategory : function(opt, url, cate) {
			var _data = [];
			var _data1 = [];
			var _data2 = [];
			var _data3 = [];
			//var tmp = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
			var _t = "";
			var _x = "";
			var _t1 = "";
			var _x1 = "";
			var _url = url;
		//	console.log(_url);
			//console.log(cate); _$$.common_data42.fileDownload
			var selecval="";
	        $fn.xAjax(_$$.common_data42._jsonGetParmDataUrl(_url, cate))
	        	.done(function(json, status, xhr){
					var j=0;
					var k=0;
					
                    $(json).each(function(i, data){
						if( data["@unid"]=="" && data["_cate1"]!="" && data["_cate1"]!="All"){
							//_t = data["_category"];
							//_tv = data["_deptname"];
							_t = data["_cate1"]
							_x = data["_cate1"];	
							console.log(_t);
							const reg = /[)(]/gi;
							_x1=_t.replace(reg,"");
						
							
							//console.log(_x1);
							/*()제거 해도 검색이 안됨 어쩔수 없이 하드코딩
							1세부 전장 6m급 가변프레임 기반 전기트럭버스 전용 롤링섀시 기술개발
							projectname=1세부 전장 6m급 가변프레임 기반 전기트럭버스 전용 롤링섀시 기술개발 검색안됨
							projectname=(1세부)전장 6m급 가변프레임 기반 전기트럭버스 전용 롤링섀시 기술개발 검색안됨
							projectname=전장 6m급 가변프레임 기반 전기트럭버스 전용 롤링섀시 기술개발 검색됨
							
							form215view 뷰 똑같이 적용되어야 함 
							*/
							if(_x == "(1세부)전장 6m급 가변프레임 기반 전기트럭버스 전용 롤링섀시 기술개발"){
								_x= "전장 6m급 가변프레임 기반 전기트럭버스 전용 롤링섀시 기술개발"
							}else if(_x == "신개념 저탄소 친환경형 20KW급 Air Bearing을 이용한 마찰교반용접(FSW)용 5,000rpm 에어 스핀들 기술개발을 통한 경남형 지속가능경영(ESG) 기반마련"){
								_x= "신개념 저탄소 친환경형 20KW급 Air Bearing을 이용한 마찰교반용접"
							}else if(_x == "중희토류저감 융합기술에 의한 차세대 모터용 75(MGOe+kOe)급 Lean HRE 희토자석 개발"){
								_x= "중희토류저감 융합기술에 의한 차세대 모터용 75"
							}else if(_x == "천마용 추적 터렛 구동(고각) 모터"){
								_x= "천마용 추적 터렛 구동"
							}else if(_x == "Low GWP 냉매 규제 및 전기차 전용 플랫폼 동시 대응을 위한 전기차(수소차 포함) 800Volt SiC-MOSFET 기반 전동식 에어컨 압축기 개발"){
								_x= "Low GWP 냉매 규제 및 전기차 전용 플랫폼 동시 대응을 위한 전기차"
							}	
												
							_data1[j] = {title : _t, val : _x , children :[]};
							j = j + 1;
							//_t = data["_cate23"];
							//console.log(data)
							//console.log(_data1[j]);
							_data2[k] = {title : _t, val : _x +_t, children :[]};
							k = k + 1;
						}
									
						
						
					});

					$(_data1).each(function(i, data){						
						k = 0;
						console.log(i)
						_data1[i].children[k] = {title :   "송금", val :  "송금" };
						_data1[i].children[k+1] = {title :   "카드", val :  "카드" };
						
						$(_data2).each(function(ii, data){
							_t = _data2[ii].val;
							
							_x = _data1[i].val;

						if(_t == _x){
								//_data1[i].children[k] = {title :   _data2[ii].title , val :  _data2[ii].val  };
								//k = k + 1;
							}
						});
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
		//	console.log(cate);
		//	console.log(_data.category)
			//if(cate != ""){_data.category = cate}
			//alert(_data.category)
			//if(cate != ""){return false;}
			console.log(url);
				return {
				url : $fn.getProxyUrl(url)
				,dataType : "json"
				,async : false
				,cache : false
				,data : _data
					};
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
				var _topt = _$$.common_data42.view.getOptions({viewalias:opt.viewalias});
				_topt.header.formalias = _topt.header.formalias + "_mo"		// 작성양식 수정				
				return _topt;
			}
		}
		, exceldownload_view: function (view, opt) {
			var _me = this,
				_opt = $.extend({ filenm: "", title: "", count: 100 }, opt),
				_template = "",
				_columncnt = 0;
			var _viewopt = view.options;

			if (!_viewopt.header.hasOwnProperty("col")) return;
			console.log(_viewopt);
			console.log(_viewopt.header.col.length);
			_viewopt.excelmode = true;
			_columncnt = _viewopt.header.col.length;

			function _initHeader() {
				_template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
				_template += '	<head>';
				_template += '	<meta charset="utf-8">';
				_template += '		<!--[if gte mso 9]>';
				_template += '			<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
				_template += '				<x:Name>Worksheet</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>';
				_template += '				</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>';
				_template += '			</xml>';
				_template += '		<![endif]-->';
				_template += '	</head>';
				_template += '	<body>';
			}

			function _initTitle() {

				//2022.01.07
				var _tdcnt = 0;					//전체 td 의 갯수
				$.each(_viewopt.header.excel_colnm, function (i, v) {
					var _cell = _viewopt.header.excel_col[v];
					if (_cell.hasOwnProperty("colspan") && _cell.colspan != "") {
						_tdcnt += parseInt(_cell.colspan, 10);
					} else {
						_tdcnt += 1;
					}
				});

				//console.log("_opt.title : ", _opt.title);

				_template += '		<table border=1>';
				_template += '		<tr><td colspan="' + _tdcnt + '"></td></tr>';
				_template += '		<tr><td colspan="' + _tdcnt + '" align=center ><b><font size=12>' + _opt.title + '</font></b></td></tr>';
				_template += '		<tr><td colspan="' + _tdcnt + '"></td></tr>';
				_template += '		<tr>';

				//여기서 colspan 값을 넣어줘야 함 - 2022.01.07
				var _cell1 = ["과제명","사용일자","합계","부가세","공급가액","업체명","카드번호/송금","적요"];
				$.each(_cell1, function (i, v) {
					var _cell = ["과제명","사용일자","합계","부가세","공급가액","업체명","카드번호/송금","적요"];
					if (typeof _cell == "undefined") return true;
					if (_cell.type == "thumbbtn") return true;
					var _colspan = "";
					if (_cell.hasOwnProperty("colspan") && _cell.colspan != "") {
						_colspan = " colspan='" + _cell.colspan + "'";
					}
					if (_cell.width && _cell.width != "") {
						_template += '			<td' + _colspan + ' width="' + _cell.width + '" align=center bgcolor=skyblue><b>' + _cell[i] + '</b></td>';
					} else {
						_template += '			<td' + _colspan + ' align=center bgcolor=skyblue><b>' + _cell[i] + '</b></td>';
					}
				});
			
				

				_template += '		</tr>';
			}

			function _jsonGetParmData(page) {
				var _data = {},
					_url = "dwp/aprv/com/complete01.nsf"+ "/api/data/collections/name/" + "form215view",
					_folderunid = _viewopt.folderunid || "";

				if (_folderunid != "") {
					_url = "dwp/aprv/com/complete01.nsf" + "/api/data/collections/unid/" + _viewopt.folderunid
				}

				_url += "?ps=" + _opt.count;
				_url += "&page=" + (page);

				if (typeof _viewopt.sortnm != "undefined" && _viewopt.sortnm != "") {
					_data.sortcolumn = _viewopt.sortnm;
				}
				if (typeof _viewopt.sortorder != "undefined" && _viewopt.sortorder != "") {
					_data.sortorder = _viewopt.sortorder;
				}
				if (_viewopt.single != "" && !_viewopt.searchview) {
					_data.category = _viewopt.single;
				}
				if (_viewopt.searchview) {
					_data.search = _viewopt.searchqry;
				}
				if (_viewopt.entrycount != "" && !_viewopt.searchview) {
					_data.entrycount = "false";
				}

				return {
					url: _url,
					dataType: "json",
					async: true,
					cache: false,
					data: _data
				};
			}

			function _convertData(cell, o) {
				var _h = "",
					_v = ($.isArray(o[cell.name]) ? o[cell.name][0] : o[cell.name]),
					_header = _viewopt.header;

				if (cell.type == "date") {
					_h = $dwp.core.util.formatDateTime(_v, "dateonly");
				} else if (cell.type == "fnc" && typeof cell.content == "function") {
					return cell.content(o);
				} else if (cell.type == "code" && cell.hasOwnProperty("langcode")) {
					return $dwp.core.lang.getCodeObjMsg(cell.langcode, _v);
				} else {
					_h = $dwp.core.lang.getCurMsg(_v);
				}
				return _h;
			}

			function _drawBody(view) {
				var _loopcnt = 0,
					_deferreds = [];
				if (parseInt(_viewopt.total % _opt.count) > 0) {
					_loopcnt = parseInt(_viewopt.total / _opt.count) + 1;
				} else {
					_loopcnt = parseInt(_viewopt.total / _opt.count);
				}

				//tbody 그리기...
				_template += "<tbody>";
				for (var i = 0; i < _loopcnt; i++) {
					_template += "tr_grid" + (i * _opt.count);
				}
				
				_template += "</tbody>";
								var _rows = view.getChecked();
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
				for (var i = 0; i < _loopcnt; i++) {
					_deferreds.push(

						

						/**/
						$dwp.core.util.xAjax(_jsonGetParmData(i))
							.done(function (jsonData, textStatus, jqXHR) {
								var _pos = $dwp.core.util.getDataRange(jqXHR, "start");
								var _trHtml = "";
								$.each(jsonData, function (j, o) {
									if (o["@unid"] == "") return true;

									_trHtml += '<tr>';
									$.each(_viewopt.header.excel_colnm, function (k, v) {
										var _$cell = null,
											_cell = _viewopt.header.excel_col[v];
										if (typeof _cell == "undefined") return true;
										if (_cell.name == "_thumb") return true;
										_trHtml += '			<td align=center>' + _convertData(_cell, o) + "</td>";
									});
									_trHtml += '</tr>';

								});
								if (_trHtml != "") {
									_template = _template.replace("tr_grid" + _pos, _trHtml);
								}
							}).fail(function () {
								console.log('error');
							})
							
					);
				}
					/*

					$dwp.core.util.xAjax(_jsonGetParmData(i))
							.done(function (jsonData, textStatus, jqXHR) {
								var _pos = $dwp.core.util.getDataRange(jqXHR, "start");
								var _trHtml = "";
								$.each(jsonData, function (j, o) {
									if (o["@unid"] == "") return true;

									_trHtml += '<tr>';
									$.each(_viewopt.header.excel_colnm, function (k, v) {
										var _$cell = null,
											_cell = _viewopt.header.excel_col[v];
										if (typeof _cell == "undefined") return true;
										if (_cell.name == "_thumb") return true;
										_trHtml += '			<td align=center>' + _convertData(_cell, o) + "</td>";
									});
									_trHtml += '</tr>';

								});
								if (_trHtml != "") {
									_template = _template.replace("tr_grid" + _pos, _trHtml);
								}
							}).fail(function () {
								console.log('error');
							})
					$fn.cmdPost(
							$dwp.core.util.xAjax('/dwp/aprv/com/complete01.nsf/wcmdrefresh2?createdocument')
							,{postdata : _unids }									
							,function(data){
								// "result":"200","re_cd":"del_temp","cnt":"2"
								//alert(data.unid)
								if ( data.hasOwnProperty("result")) {
									console.log(data)
									if ( data.result == "400") {
										
									//	 console.log(data.unid) substr
								  
								
										  
									} else {
										//error
									}
								} else {
									//error
								}
								//_me.refresh();
							}
							, 'json'
						)
					*/
				$.when.apply($, _deferreds).always(function () {
					_template += '		</table>';
					_template += '	</body>';
					_template += '</html>';

					//console.log(_template);

					var _excelObject = new Blob([_template], { type: 'application/vnd.ms-excel' });
					//IE11 & Edge
					if (navigator.msSaveBlob) {
						navigator.msSaveBlob(_excelObject, _opt.filenm);
					} else {
						//In FF link must be added to DOM to be clicked
						var link = document.createElement('a');
						link.href = window.URL.createObjectURL(_excelObject);
						link.setAttribute('download', _opt.filenm);
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					}

					_viewopt.excelmode = false;

					$fn.unblock();
				})
			}

			if (_viewopt.total > 0) {
				$fn.block(undefined, { notusemsg: _viewopt.ismobile });

				console.log("pre - initHeader");

				_initHeader();

				console.log("pre - initTitle");
				_initTitle();

				console.log("pre - drawBody");
				_drawBody(view);
			} else {
				$fn.alert({ msg: $fn.getCodeMsg("문서가 없습니다.") });
				return true;
			}

		}

	};
}($dwp.cns("app"), jQuery));













