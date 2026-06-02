/* Source File Upload Time : 2021-10-13 4:36:40 PM*/


/* Source File Upload Time : 2020-07-28 12:24:24 AM*/


/* Source File Upload Time : 2019-07-04 6:50:13 PM*/


/* Source File Upload Time : 2019-07-03 12:06:45 PM*/


/**
 * 구매승인관리-기본정보-구매담당자 JS
 */
(function (_$$, $) {
	_$$.pamt_data = {
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
								
				//사용자 선택 팝
				$("#search").on("click", function(){
					// alert("@@")
					$dwp.ui.org.orgsselect.init($(this), {
						seltype : "2"
						,selcallback : function(org){
							//$("input[name=_REQUSER]", _$table01).val(org.sinfo);
							//$("input[name=_REQUSERDISP]", _$table01).val(org.getDispName());
							$("input[name=sendtoname]").val(org.getDispName());
							//alert(org.oinfo.notesid);
							$("input[name=_sendto]").val(org.oinfo.notesid);							
							//$("[name=_DEPT]", _$table01).html($fn.getCurLangMsg(org.oinfo.orgname));
						}
					});
				});

				$fn.orgsel($("[name='OrgReader1']", _doc.element), {
                    isedit: opt.isedit,
                    treetype: "0",
                    seltype: "0",
                    fld: "Users",
                    count: 50,
                    isseltype: false
					
                });
			},						
			_initOptions: function (opt) {
				var _me = this, _opt = $.extend({}, opt);

				_opt.button = {
					// 저장	
					savedoc: {
						title: $fn.getCodeMsg("저장"),
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
		},

		view: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},
			init: function (opt, el) {
				var _me = this, _view = null, _opt = _me._initOptions(opt);
				_view = $fn.view(_opt, el);
			},
			_initOptions: function (opt) {
				var _me = this, _opt = $.extend({}, opt);
				_opt.button = _me._buttonInfo(_opt);
				_opt.header = _me._headerInfo(_opt);
				return _opt;
			},
			_buttonInfo: function (_opt) {
				var _btnList = {}, _sbtnList = {};
				_btnList = {
					// 엑셀 다운로드 기능 제공해야 함
					eprint : {
						title : $fn.getCodeMsg("comm.btn.exceldown"),
						click : function(view) {
							var _selection = "BoardID=\"" + _opt.param.boardid + "\"";
							
							if(_opt.viewalias == "wvall") _selection = "";								
							view.exceldownload({eventcode : "stboard.view", formula : _selection, viewname : _opt.viewalias});
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
					wv02: ['create', 'pdel', 'eprint']
				};

				return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);
			}, 
			_readForm : function(view,uid,ele,opt) {

				var _url = opt.cdb+"/"+opt.viewalias+"/"+uid+"?Opendocument";
				$fn.dialog(null, {
					//title : $fn.getCodeMsg("budget01.title.aprdoc")
					title : $fn.getCodeMsg(opt.viewtitle)
					,width	: 700
					,height : 500
					,modal : true
					,hide: { effect: "fade", duration: 300 }
					,show: { effect: "fade", duration: 300 }
					,content : {url : _url }				
				});
			},			
			_headerInfo: function (_opt) {
				var _me = this, _col = {}, _hList = {};
				_col = {
					attach: {
						name: '_attach',
						type: 'file',
						title: '',
						width: '3%',
						sort: false,
						css: 'file-cell'
					},
					location: {
						name: '_location',
						title: $fn.getCodeMsg('pamt_data.title.header1'),    //사업장
						width: '5%',
						//click : function(view,o, ele){
						//	_$$.pamt_data.view._readForm(view,o["@unid"], ele,_opt);
						//},	
						sort: false
					},
					kind: {
						name: '_kind',
						title: $fn.getCodeMsg('pamt_data.title.h2'),    //구분
						width: '5%',
						sort: false
					},
					code: {
						name: '_code',
						title: $fn.getCodeMsg('pamt_data.title.h3'),    //업체코드
						width: '3%',
						sort: false
					},
					companyproto: {
						name: '_companyproto',
						title: $fn.getCodeMsg('pamt_data.title.h4'),	//업체구분명
						width: '5%',
						sort: false
					},
					servone: {
						name: '_servone',
						title: $fn.getCodeMsg('pamt_data.title.h5'),	//서브원등록여부
						width: '2%',
						sort: false
					},
					usernum: {
						name: '_usernum',
						title: $fn.getCodeMsg('pamt_data.title.h13'),	//사업자등록번호
						width: '10%',
						sort: false
					},
					value: {
						name: '_value',
						title: $fn.getCodeMsg('pamt_data.title.h6'),	//업체명
						width: '15%',
						sort: false
					},
					commaster: {
						name: '_commaster',
						title: $fn.getCodeMsg('pamt_data.title.h7'),	//대표이사
						width: '3%',
						sort: false
					},
					telmaster: {
						name: '_telmaster',
						title: $fn.getCodeMsg('pamt_data.title.h8'),	//대표이사 전화번호
						width: '3%',
						sort: false
					},
					commanager: {
						name: '_commanager',
						title: $fn.getCodeMsg('pamt_data.title.h9'),	//담당자
						width: '3%',
						sort: false
					},
					telmanager: {
						name: '_telmanager',
						title: $fn.getCodeMsg('pamt_data.title.h10'),	//담당자 전화번호
						width: '3%',
						sort: false
					},
					mailaddress: {
						name: '_mailaddress',
						title: $fn.getCodeMsg('pamt_data.title.h11'),	//담당자 전화번호
						width: '3%',
						sort: false
					},				
					sendtoname: {
						name: '_sendtoname',
						title: $fn.getCodeMsg('pamt_data.title.header2'),	//담당자 전화번호
						width: 'auto',
						sort: false
					},	
					// 아래 필드는 미사용
					authorname: {
						name: '_authorname',
						title: $fn.getCodeMsg('pamt_data.title.h9'),	//담당
						width: '9%',
						sort: false,
						type: 'fnc',
						content: function (o) {
							return $fn.getCurLangMsg(o["_authorname"]);
						}
					}
					,				
					sendtoname1: {
						name: '_sendto',
						title: $fn.getCodeMsg('등록번호'),	//담당자 전화번호
						width: 'auto',
						sort: false
					}
					,				
					sendtoname2: {
						name: '_sendto_1',
						title: $fn.getCodeMsg('법인명'),	//담당자 전화번호
						width: 'auto',
						sort: false
					}
					,				
					sendtoname3: {
						name: '_sendto_2',
						title: $fn.getCodeMsg('대표자'),	//담당자 전화번호
						width: 'auto',
						sort: false
					}
					,				
					sendtoname4: {
						name: '_sendto_3',
						title: $fn.getCodeMsg('주소'),	//담당자 전화번호
						width: 'auto',
						sort: false
					}
				};
				_hList = {
					wv02: {
						checkbox: true,
						formalias: "wFrm01K",		// 거래처 담당자 호출
						isreply: false,
						css: "",
						colnm: ["location","sendtoname1", "sendtoname2", "sendtoname3","sendtoname4"],
						search: [
							{ title: $fn.getCodeMsg("comm.title.searchall"), key: "all" }
						]
						//,click : function(){}
					}
				};

				_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);

				return _hList[_opt.viewalias];
			},

		}

	};
}($dwp.cns("app"), jQuery));





