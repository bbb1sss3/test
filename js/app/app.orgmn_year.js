/* Source File Upload Time : 2020-01-30 (목요일) 2:28:30 PM*/


/* Source File Upload Time : 2019-05-15 6:22:44 PM*/


/* Source File Upload Time : 2017-11-05 11:10:56 AM*/


/* Source File Upload Time : 2017-05-22 5:52:16 PM*/


/**
 * 임직원정보
 */
(function(_$$, $) {
	_$$.orgmn_year = {
		doc : {
			getOptions : function(opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			}
			/**
			 * 게시작성 초기화
			 * @namespace	{Object}
			 * @name	$dwp.orgm.init
			 */
			,init : function(opt, el) {
				var _me = this, _zregcode
				,_opt = _me._initOptions(opt);		

				var _doc = $fn.doc(_opt, el);
				console.log("_doc::", _doc);
				/*
				$fn.orgsel($("[name='org1']", _doc.element)
						,{isedit : _opt.isedit, treetype : "1", seltype : "1", fld : "OrgName", count : 1});
				*/

                			//퇴사자 메일 공유때문에 추가 - 2021.12.16 by dwlee
                			if ($("[name='org-mailreaders']", _doc.element).size() > 0 ){
                    				$fn.orgsel($("[name='org-mailreaders']", _doc.element)
                            				,{isedit : _opt.isedit, treetype : "0", seltype : "2", isseltype : false, fld : "MailReaders", count : 20});
                			} else {
					_me._loadPhoto(_doc, opt);
				}

				//의무소진일수 계산
				var minorday=$("[name='sunday']", _doc.element).val();
				var minorday1=minorday * 0.6;
				var round=Math.round(minorday1);
				var _empno=_opt.param.empno;
				var _info1 = $dwp.cns("core.info");
				var _cempno=_info1.cuser.pinfo.empno;
				if(_empno == "P00019" || // 김동건 원장
  					_empno == "P00006" || //강병철
 					_empno== "P00092"//원성희
				){
					$("#aa", _doc.element).hide(); 
					$("#ss", _doc.element).hide(); 
				}else{
					$("#ss", _doc.element).text(round); 
					
				}
				//외부강의 숨김
				if(_cempno == "P00001" || _cempno == _empno || _cempno=="P00065" || _cempno=="P00035"){ // 관리자만 노출
					$("#outtable", _doc.element).show(); 
				}else{
					$("#outtable", _doc.element).hide(); 
				}
				//연차휴가 본인만 보이도록 
				
				if(_cempno == _empno || _cempno == "P00001" || _cempno=="P00065" || _cempno=="P00035"){//접속중인 아디의 사번가 선택된 사번이 같으면 보여줌
					$("#hugatable", _doc.element).show(); 
				}else{
					$("#hugatable", _doc.element).hide(); 
				}
			}			
			,_initOptions : function(opt) {
				var _me = this, _opt=$.extend(_opt, opt);

				_opt.button = {
						savedoc : {
							title : $fn.getCodeMsg("comm.btn.reg")
							,click : function(doc) {
								if(!_$$.orgmn_year._becheck(doc, "save")) return;	//저장전에 체크 함수

								doc.save({actiontype : "save", docstatus : "reg"});								
							}
						}
						,editdoc : {
							title : $fn.getCodeMsg("comm.btn.edit")
							,click : function(doc) {
								doc.editDocument({actiontype : "save", docstatus : "reg"});
							}
						}
						,deldoc : {
							title : $fn.getCodeMsg("comm.btn.deldoc")
							,click : function(doc) {
								$fn.confirm ({msg:$fn.getCodeMsg("sbrd01.msg.deldocconfirm")}).done(function(){
									doc.deleteDocument();
								});
							}
						}
						,pdeldoc : {
							title : $fn.getCodeMsg("comm.btn.pdeldoc")
							,click : function(doc) {
								$fn.confirm ({msg:$fn.getCodeMsg("sbrd01.msg.pdeldocconfirm")}).done(function(){
									doc.deleteDocument({softdel : false});
								});
							}
						}
						,goview : {
							title : $fn.getCodeMsg("comm.btn.list")
							,click : function(doc) {
								doc.goview();
							}
						}
				};
				return _opt;
			}
			,_loadPhoto : function(doc, opt){
				var that=this, _doc=doc, _opt=opt, _empno=_opt.param.empno, _html="", _imageurl="", _noimageurl="/tcclibs/images/common/default-person.png";
				var _isedit = ( _opt.isadmin || _opt.isconowner || _empno === $fn.getCurUser().pinfo.empno ) ? true : false;
				console.log("_empno::", _empno);
				_imageurl = "/dwp/com/portal/userphoto.nsf/photo/" + _empno + "/$file/" + _empno + "?OpenElement";
				
				_html = "<img class='dwp-photo " + ((_isedit) ? "dwp-cursor" : "") + "' src='" + $dwp.core.util.getProxyUrl(_imageurl) + "' alt='' style='width:220px'/>";
				$(".photo", _doc.element).html(_html);
				$(".dwp-photo", _doc.element).bind('load', function(){
					console.log("Photo loading success!!");
				}).bind("error", function(){
					console.log("Photo loading fail!!");
					$(this).attr("src", $dwp.core.util.getProxyUrl(_noimageurl));
				}).bind("click", function(){
					if(_isedit) $fn.selectPic(_opt);
				});
			}
		}
		,_becheck : function(_doc, _flag){
			var that = this;
			return true;
		}
		,view : {
			getOptions : function(opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			}
			,init : function(opt, el) {

				var _me = this
				,_view = null

				,_opt = _me._initOptions(opt);
				
				_view = $fn.view(_opt, el);
			}
			,_initOptions : function(opt) {
				var _me = this
				,_opt = $.extend({}, opt);
				
				_opt.button = _me._buttonInfo(_opt);
				console.log("_opt.button::", _opt.button);
				_opt.header = _me._headerInfo(_opt);
				console.log("_opt.header::", _opt.header);
				
				return _opt;
			}
			,_buttonInfo : function(_opt) {
				var _btnList = {
						eprint : {
							title : $fn.getCodeMsg("comm.btn.exceldown"),
							click : function(view) {
								var _selection = "BoardID=\"" + _opt.param.boardid + "\"";
								
								if(_opt.viewalias == "wvall") _selection = "";
								
								view.exceldownload({eventcode : "stboard.view", formula : _selection, viewname : _opt.viewalias});
							}
							,icon : $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"
						}
						,create : {
							title : $fn.getCodeMsg("comm.btn.create")
							,click : function(view) {
								view.createDocument({param : _opt.param});
							}
							,icon : $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
						}
						,movedoc : {
							title : $fn.getCodeMsg("sbrd01.title.movedoc")
							,click : function(view) {
								_$$.sbrd01.act_movedoc_view(view);
							}
							,icon : $fn.getPath("weblib") + "/images/common/icon-copy.svg"
						},

						//엑셀 다운로드 - 2022.10.12 by dwlee
						exceldown: {
							title: $fn.getCodeMsg('comm.btn.exceldown'),
							click: function (view) {
								var _el = view.element;
								var _opt = {
									title: "usermanage_" + view.options.viewalias,
									filenm: "usermanage_" + Date.now() + ".xlsx",
									excelkeyword: "연차괸리"
								}
								view.exceldownload_view(_opt);
							}
						}
				}
				,_sbtnList = {
					wviworglist : ['create', 'eprint', 'movedoc']
					,wviwcomuserlist : ['create', 'eprint', 'movedoc']
					,wviwuserlist1 :['exceldown']
					,wviwuserlist2 :['exceldown']
					,wviwuserlist3 :['exceldown']
					,wviwuserlist4 :['exceldown']
					,wviwuserlist5 :['exceldown']
					,wviwuserlist6 :['exceldown']
				};
				//console.log("_sbtnList[_opt.viewalias]:", _sbtnList[_opt.viewalias]);
				return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);
			}
			,_headerInfo : function(_opt) {
           		var _cate_com = _$$.orgmn_year.getCompanyr(_opt, _opt.cdb + "/api/data/collections/name/vViewComAll?count=999", ""); //회사별 목록
				var _searchcate = [{title : $fn.getCodeMsg("sbrd01.title.searchall"), key : "all"}
				, {title : "직위", key : "Name_1"}
				, {title : "이름", key : "PersonName"}
				, {title : "사번", key : "PersonID"}				
				, {title : "소속", key : "OrgName"}];
				
				var _cate={}, _cate_data=[];

				var _me = this, _col = {
					titlecode : {
						name : '_yeardate'
						,type : 'text'
						,title : $fn.getCodeMsg("orgmn.title.titlecode")
						,width : '8%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,yeardate : {
						name : '_yeardate'
						,type : 'text'
						,title : $fn.getCodeMsg("연차기준일")
						,width : '8%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,name : {
						name : '_name'
						,type : 'text'
						,title : $fn.getCodeMsg("orgmn.title.name")
						,width : '16%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,workyear : {
						name : '_workyear'
						,type : 'text'
						,title : $fn.getCodeMsg("근무년수")
						,width : '16%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,huga : {
						name : '_huga'
						,type : 'text'
						,title : $fn.getCodeMsg("휴가부여일수")
						,width : '16%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,huga1 : {
						name : '_huga1'
						,title : $fn.getCodeMsg("의무소진일수")
						,width : '16%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,huga2 : {
						name : '_huga2'
						,title : $fn.getCodeMsg("휴가사용일수")
						,width : '16%'
						,sort : true
						,css : 'dwp-center dwp-cursor'
					},
					huga3 : {
						name : '_orgname'
						,title : $fn.getCodeMsg("부서명")
						,width : 'auto'
						,sort : true
						,css : 'dwp-center dwp-cursor'
					},
					huga4 : {
						name : '_huga2'
						,title : $fn.getCodeMsg("공휴가사용일")
						,width : '16%'
						,sort : true
						,css : 'dwp-center dwp-cursor'
					},
					huga5 : {
						name : '_huga5'
						,title : $fn.getCodeMsg("병휴가사용일")
						,width : '16%'
						,sort : true
						,css : 'dwp-center dwp-cursor'
					},
					huga6 : {
						name : '_huga6'
						,title : $fn.getCodeMsg("특별휴가사용일")
						,width : '16%'
						,sort : true
						,css : 'dwp-center dwp-cursor'
					},
					huga7 : {
						name : '_huga7'
						,title : $fn.getCodeMsg("안식년휴가사용일")
						,width : '16%'
						,sort : true
						,css : 'dwp-center dwp-cursor'
					},
					huga8 : {
						name : '_huga8'
						,title : $fn.getCodeMsg("사용기한일")
						,width : '16%'
						,sort : true
						,css : 'dwp-center dwp-cursor'
					}
					
					,mail: {
						name : '_mail'
						,title : $fn.getCodeMsg("orgmn.title.email")
						,width : '12%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,work : {
						name : '_work'
						,title : $fn.getCodeMsg("orgmn.title.work")
						,width : 'auto'
						,sort : false
						,css : 'dwp-left dwp-cursor'
					}
					,officetelno : {
						name : '_officetelno'
						,title : $fn.getCodeMsg("orgmn.title.officetelno")
						,width : '11%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,mobiletelno : {
						name : '_mobiletelno'
						,title : $fn.getCodeMsg("orgmn.title.mobiletelno")
						,width : '11%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,faxno : {
						name : '_fax'
						,title : $fn.getCodeMsg("FAX")
						,width : '11%'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,birthday: {
						name : '_birthday'
						,title : $fn.getCodeMsg("orgmn.title.birthday")
						,width : '11%'
						,sort : true
						,css : 'dwp-center dwp-cursor'
					}
					,etc: {
						name : '_etc'
						,title : $fn.getCodeMsg("orgmn.title.etc")
						,width : 'auto'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
					,edityear: {
						name : '_edityear'
						,title : $fn.getCodeMsg("수정휴가로직")
						,width : 'auto'
						,sort : false
						,css : 'dwp-center dwp-cursor'
					}
				}
				,_hList = {
					// 기본보기 상단고정 없는 경우
					wviwuserlist : {
						sortnm : "_created"
						,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						,isnew : {basedate:'_created'}
						,isreply : false
						,category : _cate
						,colnm : ['titlename', 'name', 'personid', 'orgname', 'officetelno', 'mobiletelno','faxno', 'work']
						,search : _searchcate
						//,click : function(){}
					},
					wviwuserlist1 : {
						sortnm : "_sort"
						//,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						//,isnew : {basedate:'_sort'}
						,isreply : false
						,category : ""
						,colnm : ['name','yeardate', 'workyear','huga', 'huga1', 'huga2']
						//,search : _searchcate
						//,click : function(){}
					}
					,
					wviwuserlist2 : {
						sortnm : "_sort"
						//,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						//,isnew : {basedate:'_sort'}
						,isreply : false
						,category : ""
						,colnm : ['name','yeardate', 'workyear', 'huga', 'huga1', 'huga2']
						//,search : _searchcate
						//,click : function(){}
					}
					,
					wviwuserlist3 : {
						sortnm : "_sort"
						//,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						//,isnew : {basedate:'_sort'}
						,isreply : false
						,category : ""
						,colnm : ['name','huga3', 'huga4']
						//,search : _searchcate
						//,click : function(){}
					},
					wviwuserlist4 : {
						sortnm : "_sort"
						//,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						//,isnew : {basedate:'_sort'}
						,isreply : false
						,category : ""
						,colnm : ['name','huga3', 'huga5']
						//,search : _searchcate
						//,click : function(){}
					},
					wviwuserlist5 : {
						sortnm : "_sort"
						//,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						//,isnew : {basedate:'_sort'}
						,isreply : false
						,category : ""
						,colnm : ['name','huga3', 'huga6']
						//,search : _searchcate
						//,click : function(){}
					},
					wviwuserlist6 : {
						sortnm : "_sort"
						//,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						//,isnew : {basedate:'_sort'}
						,isreply : false
						,category : ""
						,colnm : ['name','huga3','huga8', 'huga7']
						//,search : _searchcate
						//,click : function(){}
					}
					,wviwcomuserlist : {
						sortvw : "wviwcomuserlist"				// 개별보기 소트
						,sortnm : "_created"
						,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						,isnew : {basedate:'_created'}
						,isreply : false
                       					,category : {
							name:'_category'
							,lvl:1
							,data : _cate_com
							,change : function(view, select) {
								console.log('view', view);
								console.log('select', select);
							}
						}
					//	,category : _cate
						,colnm : ['name','orgname', 'titlename', 'officetelno', 'mobiletelno', 'mail', 'birthday','etc']
						,search : _searchcate
						//,click : function(){}
					}
					,wviwcomuserlist_orgname_des : {
						sortvw : "wviwcomuserlist"				// 개별보기 소트
						,sortnm : "_orgname"
						,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						,isnew : {basedate:'_created'}
						,isreply : false
                       					,category : {
							name:'_category'
							,lvl:1
							,data : _cate_com
							,change : function(view, select) {
								console.log('view', view);
								console.log('select', select);
							}
						}
					//	,category : _cate
						,colnm : ['name','orgname', 'titlename', 'officetelno', 'mobiletelno', 'mail', 'birthday','etc']
						,search : _searchcate
						//,click : function(){}
					}
					,wviwbirthlist : {
						sortnm : "_created"
						,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						,isnew : {basedate:'_created'}
						,isreply : false
                       					,category : {
							name:'_category'
							,lvl:1
							,data : _cate_com
							,change : function(view, select) {
								console.log('view', view);
								console.log('select', select);
							}
						}
						,colnm : [ 'orgname','titlename', 'name', 'birthday','officetelno', 'mobiletelno', 'etc']
						,search : _searchcate
						//,click : function(){}
					}
					,wviwbydatelist : {
						sortnm : "_created"
						,sortorder : "descending"
						,checkbox : false
						,formalias : "wFrm01"
						,isnew : {basedate:'_created'}
						,isreply : false
                       					,category : {
							name:'_category'
							,lvl:1
							,data : _cate_com
							,change : function(view, select) {
								console.log('view', view);
								console.log('select', select);
							}
						}
						,colnm : [ 'birthday', 'orgname','titlename', 'name','officetelno', 'mobiletelno', 'etc']
						,search : _searchcate
						//,click : function(){}
					}

				};
				
				if( _opt.hasOwnProperty("colnm") && _opt.colnm.length > 0 ){
					_hList[_opt.viewalias].colnm = _opt.colnm;
				}
				if( _opt.hasOwnProperty("formalias") && _opt.formalias !== "" ){
					_hList[_opt.viewalias].formalias = _opt.formalias;
				}
				if( _opt.hasOwnProperty("checkbox") ){
					_hList[_opt.viewalias].checkbox = _opt.checkbox;
				}
				_hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);
				return _hList[_opt.viewalias];
			}
		}				

		,getCompanyr : function(opt, url, cate) {
			var _data = [];
			var _url = url;

			$fn.xAjax(_$$.orgmn_year._jsonGetParmDataUrl(_url, cate))
			.done(function(json, status, xhr){
				$(json).each(function(i, data){
					var _v = {title :data["OrgName"], val : data["_orgcode"] + ''};
					 _data.push(_v);
					});
			})
			.fail(function(){});		
			return _data;
		}
		,_jsonGetParmDataUrl: function(url, cate) {
			var _data = {};
			if(cate != ""){_data.category = cate}
			return {
				url : $fn.getProxyUrl(url)
				,dataType : "json"
				,async : false
				,cache : false
				,data : _data
			};
		}

		,getCategory : function(_opt) {
			var _lnbid=_opt.param.lnbid, _boardid=_opt.param.boardid;
			var _key=_lnbid + "^" + _boardid, _cate, _catenm;
			var _data=[], i=0;
			
			if( !_opt.iscategory ) return _data;
			$fn.xAjax({
				url : "/dwp/com/appmng/bbs_mn.nsf/api/data/collections/name/vwJSonInfoByKey?count=999&category=" + _key,
				method : "GET",
				dataType : "json",
				async : false,
				cache : false
			}).done(function(data){
				var _cate, _catenm, _arrcate, _arrcatenm, i=0;
				//console.log("data:", data);
				if( data !== null && data.length > 0 ){
					//console.log("data[0]:", data[0]);
					_cate = data[0]._category;
					_catenm = data[0]._categorynm;
					if( _cate === "" || _catenm === "" ) return;
					_arrcate = _cate.split(";");
					_arrcatenm = _catenm.split(";");
					for( i=0; i < _arrcate.length; i++ ){
						_data[i] = {};
						_data[i].title = _arrcatenm[i].toString().trim();
						_data[i].val = _arrcate[i].toString().trim();
					}					
				}
			}).fail(function(req, error){
				console.log(req.responseText + "\n" + error);
			});
			//console.log("return _data", _data);
			return _data;
		}
	}
}($dwp.cns("app"), jQuery));










