/* Source File Upload Time : 2022-04-14 9:08:02 AM*/


/* Source File Upload Time : 2022-04-13 10:32:44 PM*/


/* Source File Upload Time : 2022-04-13 11:25:09 AM*/


/* Source File Upload Time : 2022-04-12 10:19:05 PM*/


/* Source File Upload Time : 2022-04-11 10:39:36 PM*/


/* Source File Upload Time : 2022-04-11 11:21:35 AM*/


/* Source File Upload Time : 2022-04-07 12:01:02 AM*/


/* Source File Upload Time : 2022-04-06 12:17:16 AM*/


/* Source File Upload Time : 2022-04-05 4:38:45 PM*/


/* Source File Upload Time : 2022-04-04 11:56:32 PM*/


/* Source File Upload Time : 2022-04-04 4:40:03 PM*/


/* Source File Upload Time : 2022-04-04 4:25:03 PM*/


/* Source File Upload Time : 2022-04-03 11:58:01 PM*/


/* Source File Upload Time : 2022-03-30 12:19:08 PM*/


/* Source File Upload Time : 2022-03-30 12:05:42 AM*/


/* Source File Upload Time : 2022-03-22 9:56:07 PM*/


/* Source File Upload Time : 2022-03-22 6:13:25 PM*/


/* Source File Upload Time : 2022-03-17 12:28:38 AM*/


/* Source File Upload Time : 2022-03-15 4:40:41 PM*/


/* Source File Upload Time : 2022-03-15 12:08:28 AM*/


/* Source File Upload Time : 2022-03-14 3:11:03 PM*/





/**

 * 구매승인관리-기본정보-거래처정보 JS

 */

(function (_$$, $) {

    console.log("::Start");

    _$$.pamt_wonunit_2 = {

        doc: {

            getOptions: function (opt) {

                var _me = this;

                return $.extend({}, _me._initOptions(opt));

            },



            init: function (opt) {

                var _me = this,

                _opt = _me._initOptions(opt);

                var _doc = $fn.doc(_opt);

                if (_opt.isedit) {

                    //$("input[name=EnteringDate]", _doc.element).datepicker("option", "minDate", "2019-03-15");

                }
               

                ///dwp/aprv/com/qc.nsf/wMeetingView/4925849B0036DA7C492584A20009320F?opendocument&did=xdialog-0&_=1574929282274

                //alert($("#form_471").val())
				//물류담당자
				$fn.orgsel($("[name='OrgReader1']", _doc.element), {
                    isedit: opt.isedit,
                    treetype: "0",
                    seltype: "0",
                    fld: "Users1",
                    count: 1,
                    isseltype: false
					
                });
				//구매현조담당자
				$fn.orgsel($("[name='OrgReader2']", _doc.element), {
                    isedit: opt.isedit,
                    treetype: "0",
                    seltype: "0",
                    fld: "Users2",
                    count: 1,
                    isseltype: false
					
                });
				//구매일조담당자
				$fn.orgsel($("[name='OrgReader3']", _doc.element), {
                    isedit: opt.isedit,
                    treetype: "0",
                    seltype: "0",
                    fld: "Users3",
                    count: 1,
                    isseltype: false
					
                });
				//원가담당자
				$fn.orgsel($("[name='OrgReader4']", _doc.element), {
                    isedit: opt.isedit,
                    treetype: "0",
                    seltype: "0",
                    fld: "Users4",
                    count: 1,
                    isseltype: false
					
                });
				//생산자재담당자
				$fn.orgsel($("[name='OrgReader5']", _doc.element), {
                    isedit: opt.isedit,
                    treetype: "0",
                    seltype: "0",
                    fld: "Users5",
                    count: 1,
                    isseltype: false
					
                });
				
              

				//처음로딩이 div 숨기기위해

                $('#dwp-qtdialog-btn_group').toggle();
				
				//문서 작성 되어 있으면 음영 넣기
				if($("#sangid").val() != ""){
					$("#_popgumae").css("backgroundColor","#00ffd0")
					
				}
				if($("#mulid").val() != ""){
					$("#_popgumae1").css("backgroundColor","#00ffd0")
					
				}
				if($("#gumaeid").val() != ""){
					$("#_popgumae2").css("backgroundColor","#00ffd0")
					
				}
				if($("#gumaewonid").val() != ""){
					$("#_popgumae3").css("backgroundColor","#00ffd0")
					
				}
				if($("#wonid").val() != ""){
					$("#_popgumae6").css("backgroundColor","#00ffd0")
					
				}
				if($("#sangjaid").val() != ""){
					$("#_popgumae4").css("backgroundColor","#00ffd0")
					
				}
                if($("#finalsangid").val() != ""){
					$("#_popgumae5").css("backgroundColor","#00ffd0")
					
				}
                if($("#finalagreeid").val() != ""){
					$("#_popgumae7").css("backgroundColor","#00ffd0")
					
				}
				//드롭버튼 토글 숨기기 보이기

                $("#_drop").on("click", function () {



                    $('#dwp-qtdialog-btn_group').toggle();



                });

				

				//생산

				$("#_jub").on("click", function () {
                    //masterid
					$fn.confirm({msg : $fn.getCodeMsg("작성 하시겠습니까?")}).done( function() {
						if($("#sangid").val() != ""){							
								
								$fn.alert({ msg: $fn.getCodeMsg("생산 문서는 작성되어 있습니다.") });								 
								return false;
						}
                       
                         var _url = "/dwp/com/work/wonunit_master_2.nsf/wFrm01J?openform&masterid="+$("input[name=masterid]").val();

                       

                        $fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                           

					});

                   
					
				    



				});

								

				//조달기획확인

				 $("#_pass").on("click", function () {



     				$fn.confirm({msg : $fn.getCodeMsg("작성 하시겠습니까?")}).done( function() {

                            if($("#wonid").val() != ""){							
								
								$fn.alert({ msg: $fn.getCodeMsg("조달기획확인 문서는 작성되어 있습니다.") });								 
								return false;
						}
						
						//마스터에서 생산 작성시 마스터에 저장한 생산정보를 물류(생산) 양식에 저장하여 뷰에 보이도록 하기 위함
                         var _url = "/dwp/com/work/wonunit_master_2.nsf/wFrm05J?openform&masterid="+$("input[name=masterid]").val()+
									"&kind="+$("input[name=kind]").val()+
									 "&processman="+$("input[name=processman]").val()+
									 "&sNo="+$("input[name=sNo]").val()+
									 "&sFumNo="+$("input[name=sFumNo]").val()+
									 "&bal_num="+$("input[name=bal_num]").val()+
									 "&comdate="+$("input[name=comdate]").val()+		
									"&code="+$("input[name=code]").val()+		
									"&value="+$("input[name=value]").val()+								
                                    "&companytype="+$("input[name=companytype]").val()+
									"&PROD_PRS_STS="+$("input[name=PROD_PRS_STS]").val()
									
                        $fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });      

					});


                });
				//원가생산(자재)

				 $("#_reject").on("click", function () {



					$fn.confirm({msg : $fn.getCodeMsg("작성 하시겠습니까?")}).done( function() {

                            if($("#sangjaid").val() != ""){							
								
								$fn.alert({ msg: $fn.getCodeMsg("원가 문서는 작성되어 있습니다.") });								 
								return false;
						}
						
						//마스터에서 생산 작성시 마스터에 저장한 생산정보를 물류(생산) 양식에 저장하여 뷰에 보이도록 하기 위함
                         var _url = "/dwp/com/work/wonunit_master_2.nsf/wFrm06J?openform&masterid="+$("input[name=masterid]").val()+
									"&kind="+$("input[name=kind]").val()+
									 "&processman="+$("input[name=processman]").val()+
									 "&sNo="+$("input[name=sNo]").val()+
									 "&sFumNo="+$("input[name=sFumNo]").val()+
									 "&bal_num="+$("input[name=bal_num]").val()+
									 "&comdate="+$("input[name=comdate]").val()+		
									"&code="+$("input[name=code]").val()+		
									"&value="+$("input[name=value]").val()+								
                                    "&companytype="+$("input[name=companytype]").val()
                        $fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });      

					});



                });
                //생산검증

				 $("#_bun").on("click", function () {



					$fn.confirm({msg : $fn.getCodeMsg("작성 하시겠습니까?")}).done( function() {

                            if($("#finalsangid").val() != ""){							
								
								$fn.alert({ msg: $fn.getCodeMsg("문서가 작성되어 있습니다.") });								 
								return false;
						}
						
						//마스터에서 생산 작성시 마스터에 저장한 생산정보를 물류(생산) 양식에 저장하여 뷰에 보이도록 하기 위함
                         var _url = "/dwp/com/work/wonunit_master_2.nsf/wFrm07J?openform&masterid="+$("input[name=masterid]").val()+
									"&kind="+$("input[name=kind]").val()+
									 "&processman="+$("input[name=processman]").val()+
									 "&sNo="+$("input[name=sNo]").val()+
									 "&sFumNo="+$("input[name=sFumNo]").val()+
									 "&bal_num="+$("input[name=bal_num]").val()+
									 "&comdate="+$("input[name=comdate]").val()+		
									"&code="+$("input[name=code]").val()+		
									"&value="+$("input[name=value]").val()+								
                                    "&companytype="+$("input[name=companytype]").val()
                        $fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });      

					});



                });

                  //전결권자승인 작성

				 $("#_bunc").on("click", function () {



					$fn.confirm({msg : $fn.getCodeMsg("작성 하시겠습니까?")}).done( function() {

                            if($("#finalagreeid").val() != ""){							
								
								$fn.alert({ msg: $fn.getCodeMsg("문서가 작성되어 있습니다.") });								 
								return false;
						}
						
						//마스터에서 생산 작성시 마스터에 저장한 생산정보를 물류(생산) 양식에 저장하여 뷰에 보이도록 하기 위함
                         var _url = "/dwp/com/work/wonunit_master_2.nsf/wFrm08J?openform&masterid="+$("input[name=masterid]").val()+
									"&kind="+$("input[name=kind]").val()+
									 "&processman="+$("input[name=processman]").val()+
									 "&sNo="+$("input[name=sNo]").val()+
									 "&sFumNo="+$("input[name=sFumNo]").val()+
									 "&bal_num="+$("input[name=bal_num]").val()+
									 "&comdate="+$("input[name=comdate]").val()+		
									"&code="+$("input[name=code]").val()+		
									"&value="+$("input[name=value]").val()+								
                                    "&companytype="+$("input[name=companytype]").val()
                        $fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });      

					});



                });

				

				//완료처리

				function _ok() {			

						_unids=$("#masterid").val()

								$fn.cmdPost(

									$dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh1?createdocument')

									,{actiontype : ('refresh'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : _unids }									

									,function(data){

										// "result":"200","re_cd":"del_temp","cnt":"2"
	

												history.back();

												

												$fn.toast({msg : $fn.getCodeMsg("변경되었습니다.") });


										//_me.refresh();

									}

									, 'json'

								);

							}	

					

				
				//생산 뷰 클릭시 이동
                $("#_popgumae").on("click", function () {

                        if($("#sangid").val() == ""){
                            $fn.toast({msg : $fn.getCodeMsg("작성 되어 있는 문서가 없습니다.") });
                            return false;

                        }
                        var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=sangid]").val()+"?opendocument";

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                    

                }); 
					//물류(제품)클릭시 이동
                $("#_popgumae1").on("click", function () {

                        if($("#mulid").val() == ""){
                            $fn.toast({msg : $fn.getCodeMsg("작성 되어 있는 문서가 없습니다.") });
                            return false;

                        }
                        var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=mulid]").val()+"?opendocument";

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                    

                }); 
				//구매(현조)클릭시 이동
                $("#_popgumae2").on("click", function () {

                        if($("#gumaeid").val() == ""){
                            $fn.toast({msg : $fn.getCodeMsg("작성 되어 있는 문서가 없습니다.") });
                            return false;

                        }
                        var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=gumaeid]").val()+"?opendocument";

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                    

                }); 
					//구매(일조)클릭시 이동
                $("#_popgumae3").on("click", function () {

                        if($("#gumaewonid").val() == ""){
                            $fn.toast({msg : $fn.getCodeMsg("작성 되어 있는 문서가 없습니다.") });
                            return false;

                        }
                        var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=gumaewonid]").val()+"?opendocument";

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                    

                }); 

				//원가
                $("#_popgumae6").on("click", function () {

                        if($("#wonid").val() == ""){
                            $fn.toast({msg : $fn.getCodeMsg("작성 되어 있는 문서가 없습니다.") });
                            return false;

                        }
                        var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=wonid]").val()+"?opendocument";

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                    

                }); 

				//원가생산자재
                $("#_popgumae4").on("click", function () {

                        if($("#sangjaid").val() == ""){
                            $fn.toast({msg : $fn.getCodeMsg("작성 되어 있는 문서가 없습니다.") });
                            return false;

                        }
                        var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=sangjaid]").val()+"?opendocument";

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                    

                }); 
                	//생산최종검증
                    $("#_popgumae5").on("click", function () {

                        if($("#finalsangid").val() == ""){
                            $fn.toast({msg : $fn.getCodeMsg("작성 되어 있는 문서가 없습니다.") });
                            return false;

                        }
                        var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=finalsangid]").val()+"?opendocument";

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                    

                }); 

                	//전결권자승인
                    $("#_popgumae7").on("click", function () {

                        if($("#finalagreeid").val() == ""){
                            $fn.toast({msg : $fn.getCodeMsg("작성 되어 있는 문서가 없습니다.") });
                            return false;

                        }
                        var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=finalagreeid]").val()+"?opendocument";

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                    

                }); 

            },

			    
				AprDocTransfer: function ($doc, act) {
                var opt = $doc.options;
                var _data = {
                    actiontype: act,
                    unid: opt.unid,
                    arg1: opt.cdb
					
                }
                function transCallBack(data) {
                    if (data.hasOwnProperty("result")) {
                        if (data.result >= "200" && data.result < "300") {
                         var _opt = $doc.options,
                         _did = _opt.did,
                         _isportal = _opt.isportal,
                         _isaprvportal = _opt.isaprvportal;

                          console.log("data",data);

                         if (data.result == '200') {
                             $fn.loadPage({
                                 link: $fn.getProxyUrl(data.returnurl),
                                 linktype: 'PAGE'
                             });
                             $fn.alert({
                                 msg: $fn.getCodeMsg($fn.getCodeMsg(data.msgcode))
                             });
                             return false;
                         }

                         if (data.hasOwnProperty('returnmsgcode')) {
                             $fn.toast({
                                 msg: $fn.getCodeMsg(data.returnmsgcode)
                             });
                             return false;
                         }
                        }
                    }
                }
                  var _transurl = $fn.getProxyUrl(opt.cdb + '/wcmdpost?createdocument');
                $fn.cmdPost(_transurl, _data, transCallBack, "json");
            }
			 ,
			savecallback: function (jdata, $doc) {
                var _opt = $doc.options,
                    _did = _opt.did,
                    _isportal = _opt.isportal,
                    _isaprvportal = _opt.isaprvportal;

                // console.log("jdata",jdata);

                if (jdata.result == '400') {
                    $fn.loadPage({
                        link: $fn.getProxyUrl(jdata.returnurl),
                        linktype: 'PAGE'
                    });
                    $fn.alert({
                        msg: $fn.getCodeMsg($fn.getCodeMsg(jdata.msgcode))
                    });
                    return false;
                }

                if (jdata.hasOwnProperty('returnmsgcode')) {
                    $fn.toast({ msg: $fn.getCodeMsg(jdata.returnmsgcode) });
                    return false;
                }

                if (jdata.hasOwnProperty('returnurl')) {
                    if (jdata.hasOwnProperty('update')) {
                        var update = jdata;
                        update.actiontype = 'linkupdate';
                        // 링크 생성 /업데이트/삭제 처리
                        $fn
                            .xAjax({
                                url: $fn.getProxyUrl(
                                    '/dwp/aprv/hq/aprving.nsf/wcmdpost?createdocument'
                                ),
                                method: 'POST',
                                dataType: 'json',
                                data: update,
                                async: true,
                                cache: false
                            })
                            .done(function (data) {
                                // console.log("처리",data);
                                _$$.aprv.com.refreshpage(jdata, $doc);
                            })
                            .fail(function (req, error) {
                                console.log(req.responseText + '\n' + error);
                                _$$.aprv.com.refreshpage(jdata, $doc);
                            });
                    } else {
                        _$$.aprv.com.refreshpage(jdata, $doc);
                    }
                }
            },
 

            _initOptions: function (opt) {

                var _me = this,

                _opt = $.extend({}, opt);

				//var _tableVal = $("input[name=fld_formdata_1]", $doc.element).val();

                _opt.button = {

                    // 저장

                    savedoc1: {

                        title: $fn.getCodeMsg("comm.btn.savedoc"),

						click: function (doc) {


							 doc.save({ actiontype: "save", tableval: "reg" });

							//doc.save({ actiontype: "save", docstatus: "reg" });

						}

                       

                    },

					 savedoc: {

                        title: $fn.getCodeMsg("comm.btn.savedoc"),

						click: function (doc) {

							//sub104_Table01

						// var _$table01 = $("table[name=" + "sub104" + "_Table01]",doc.element).xtable("instance");

						//$("input[name=PROD_DPT_CD]", doc.element).val(_$table01.getData(false));

							 doc.save({ actiontype: "save", tableval: "reg", actype: "sanasan", masterid: $("#masterid").val() });

							//doc.save({ actiontype: "save", docstatus: "reg" });

						}

                       

                    },

                    //편집

                    editdoc: {

                        title: $fn.getCodeMsg("comm.btn.edit"),

                        click: function (doc) {

                            // doc.editDocument();var _info1 = $dwp.cns("core.info"); $("[name=PROD_DPT_CD]").val() 
						var _info1 = $dwp.cns("core.info");
						var vdocname=_info1.cuser.abnotesid ;
						//alert(vdocname)
						if($("#vvflag").val() == "2" ){
							if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("[name=PROD_DPT_CD]").val() ){
								
							}else{
								$fn.alert({ //생산 추진 시 플래그
									msg: $fn.getCodeMsg("작성완료된 문서는 수정 할수없습니다.편집가능자만 수정가능합니다.")
								}); 
								return false;
							}
							
						}else if($("#vvflag4").val() == "2" ){ //$("[name=CST_DPT_CD]").val() 
							if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("[name=CST_DPT_CD]").val() ){
								
							}else{
								$fn.alert({ //조달기획확인 시 플래그
									msg: $fn.getCodeMsg("작성완료된 문서는 수정 할수없습니다.편집가능자만 수정가능합니다.")
								}); 
								return false;
							}
							
						}else if($("#vvflag5").val() == "2" ){ //MAT_DPT_CD
							if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("[name=MAT_DPT_CD]").val() ){
								
							}else{
								$fn.alert({ //조달 시 플래그
									msg: $fn.getCodeMsg("작성완료된 문서는 수정 할수없습니다.편집가능자만 수정가능합니다.")
								}); 
								return false;
							}
							
						}else if($("#vvflag6").val() == "2" ){
							if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == "최영/U00603/DNKRWEB"){
								
							}else{
								$fn.alert({ //물품제품 시 플래그
									msg: $fn.getCodeMsg("작성완료된 문서는 수정 할수없습니다.")
								}); 
								return false;
							}
							
						}else if($("#vvflag7").val() == "2" ){
							if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == "최영/U00603/DNKRWEB"){
								
							}else{
								$fn.alert({ //물품제품 시 플래그
									msg: $fn.getCodeMsg("작성완료된 문서는 수정 할수없습니다.")
								}); 
								return false;
							}
							
						}								
                           doc.editDocument();

                        }

                    },

                    //삭제

                    deldoc: {

                        title: $fn.getCodeMsg("comm.btn.deldoc"),

                        click: function (doc) {

                            doc.deleteDocument({

                                confirm: "삭제하시겠습니까?"

                            });

                            // doc.del();

                        }

                    },

                    goview: {

                        title: "목록",

                        click: function (doc) {
                            
                            var search = location.search
                            var params = new URLSearchParams(search);
							
							var getType= params.get('type');
                            if(getType == "layer_popup"){
                                $fn.alert({ //생산 완료 시 플래그
                                    msg: $fn.getCodeMsg("팝업된 페이지에서는 이동이 불가합니다.")
                                }); 
                                return false;
                            }
                            doc.goview();

                        }

                    },

                    goback: {

                        title: "뒤로가기",

                        click: function (doc) {

                            var search = location.search
                            var params = new URLSearchParams(search);
							
							var getType= params.get('type');
                            if(getType == "layer_popup"){
                                $fn.alert({ //생산 완료 시 플래그
                                    msg: $fn.getCodeMsg("팝업된 페이지에서는 이동이 불가합니다.")
                                }); 
                                return false;
                            }
                            $dwp.core.history.goback(-1);

                        }

                    },
					     fssavedoc: {

                        title: $fn.getCodeMsg("생산추진완료&저장"),

						click: function (doc) {
							var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;
								//PROD_DPT_CD $("input[name=PROD_DPT_CD]").val()+
							if($("#vvflag").val() == "2" ){
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("input[name=PROD_DPT_CD]").val()){
									
								}else{
									$fn.alert({ //생산 추진완료 시 플래그
										msg: $fn.getCodeMsg("작성완료 되어있는 문서입니다. 편집권한이 없습니다.")
									}); 
									return false;
									
								}
								
							}	
						$fn.confirm({

							 msg: $fn.getCodeMsg("생산부분완료하시겠습니까?완료시 수정불가능합니다")

						 }).done(function () {

                            $fn.cmdPost(
									$dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument')
									,{actiontype : ('fs'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : $("#masterid1").val(), postdata1 : $("#vorgid").val()
                                
                                    , sendflag : $("#mailsendflag").val(), sendflag1 : $("#mailsendflag1").val()
                                    }								

									,function(data){
								if ( data.hasOwnProperty("result")) {

									if ( data.result == "200") {
										var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
												$fn.loadPage({

													link: _url,
							
													linktype: "PAGE"
							
												});
												$fn.toast({msg :"완료하였습니다." });
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
								    })
						}
                    },
                    
               fssavedoc4: {

              title: $fn.getCodeMsg("조달기획확인완료&저장"),
              click: function (doc) {
							var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;
								//편집권한 작성자 필드 editauth
							if($("#vvflag4").val() == "2" ){
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("#MAT_DPT_CD").val()){
									
								}else{
									$fn.alert({ //생산 완료 시 플래그
										msg: $fn.getCodeMsg("작성완료 되어있는 문서입니다. 편집권한이 없습니다.")
									}); 
									return false;
									
								}
								
							}
              $fn.confirm({
                   msg: $fn.getCodeMsg("조달기획확인완료 하시겠습니까?완료시 수정불가능합니다")
               }).done(function () {
                  $fn.cmdPost(
                          $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument')
                          ,{actiontype : ('fs4'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : $("#masterid1").val(), postdata1 : $("#vorgid").val()
                          , sendflag : $("#mailsendflag").val()
                           }								

                          ,function(data){
                      if ( data.hasOwnProperty("result")) {

                          if ( data.result == "200") {
                              var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
                                      $fn.loadPage({

                                          link: _url,
                  
                                          linktype: "PAGE"
                  
                                      });
                                      $fn.toast({msg :"완료하였습니다." });
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
                          })
              }
          },  fssavedoc5: {

            title: $fn.getCodeMsg("조달작성완료&저장"),
            click: function (doc) {
							var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;
								
							if($("#vvflag5").val() == "2" ){
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == "빈창재/U00593/DNKRWEB"){
									
								}else{
									$fn.alert({ //생산 완료 시 플래그
										msg: $fn.getCodeMsg("작성완료 되어있는 문서입니다. 편집권한이 없습니다.")
									}); 
									return false;
									
								}
								
							}
            $fn.confirm({
                 msg: $fn.getCodeMsg("조달작성완료하시겠습니까?완료시 수정불가능합니다")
             }).done(function () {
                $fn.cmdPost(
                        $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument')
                        ,{actiontype : ('fs5'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : $("#masterid1").val(), postdata1 : $("#vorgid").val()
                        , sendflag : $("#mailsendflag").val(), sendflag2 : $("#mailsendflag1").val()
                         }								

                        ,function(data){
                    if ( data.hasOwnProperty("result")) {

                        if ( data.result == "200") {
                            var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
                                    $fn.loadPage({

                                        link: _url,
                
                                        linktype: "PAGE"
                
                                    });
                                    $fn.toast({msg :"완료하였습니다." });
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
                        })
            }
        },  
		fssavedoc6: {

            title: $fn.getCodeMsg("조달기획검증완료&저장"),
            click: function (doc) {
							var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;
								
							if($("#vvflag6").val() == "2" ){
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname ==$("#DATA_COM_DPT_CD").val()){
									
								}else{
									$fn.alert({ //생산 완료 시 플래그
										msg: $fn.getCodeMsg("작성완료 되어있는 문서입니다. 편집권한이 없습니다.")
									}); 
									return false;
									
								}
								
							}	
            $fn.confirm({
                 msg: $fn.getCodeMsg("조달기획검증부분 완료하시겠습니까?완료시 수정불가능합니다")
             }).done(function () {
                $fn.cmdPost(
                        $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument')
                        ,{actiontype : ('fs6'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : $("#masterid1").val(), postdata1 : $("#vorgid").val()
                        , sendflag : $("#mailsendflag").val()
                         }								

                        ,function(data){
                    if ( data.hasOwnProperty("result")) {

                        if ( data.result == "200") {
                            var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
                                    $fn.loadPage({

                                        link: _url,
                
                                        linktype: "PAGE"
                
                                    });
                                    $fn.toast({msg :"완료하였습니다." });
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
                        })
            }
        },  
		fssavedoc7: {
            //APP_COM_DPT_CD
            title: $fn.getCodeMsg("생산추진최종검증승인완료"),
            click: function (doc) {
                var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;
								
							if($("#vvflag7").val() == "2" ){
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("#APP_COM_DPT_CD").val()){
									
								}else{
									$fn.alert({ //생산 완료 시 플래그
										msg: $fn.getCodeMsg("작성완료 되어있는 문서입니다. 편집권한이 없습니다.")
									}); 
									return false;
									
								}
								
							}	
            $fn.confirm({
                 msg: $fn.getCodeMsg("생산추진최종검증승인완료 하시겠습니까?완료시 수정불가능합니다")
             }).done(function () {
                $fn.cmdPost(
                        $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument')
                        ,{actiontype : ('fs7'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : $("#masterid1").val(), postdata1 : $("#vorgid").val()
                        
                         }								

                        ,function(data){
                    if ( data.hasOwnProperty("result")) {

                        if ( data.result == "200") {
                            var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
                                    $fn.loadPage({

                                        link: _url,
                
                                        linktype: "PAGE"
                
                                    });
                                    $fn.toast({msg :"완료하였습니다." });
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
                        })
            }
        },
					
                      view_master: {
                        title: "마스터문서보기", 
                        click: function (view) {  
                          // /dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("#sangid").val()+"?opendocument?opendocument
						var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";

                       

						$fn.loadPage({

                            link: _url,
    
                            linktype: "PAGE"
    
                        });

                           
                            

                           
                        }
                    },
					
					
                      vvcancel2: { //조달기획확인 반려
                        title: "반려", 
                        click: function (view) {  
							var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;								
							console.log("편집가능자"+$("[name=CST_DPT_CD]").val() )
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("[name=CST_DPT_CD]").val() ){
									
								}else{
									$fn.alert({ //생산 완료 시 플래그
										msg: $fn.getCodeMsg("편집권한이 없습니다.")
									}); 
									return false;
									
								}
                          $fn.confirm({

                            msg: $fn.getCodeMsg("조달기획확인 반려하시겠습니까?반려시 이전STEP재작성합니다")
         
                        }).done(function () {
                            var _form = 'wFrmEvaluateDialog1';
                            var _Dailog = $fn.dialog(null, {
                                    modal: true,
                                    resizable: false,
                                    draggable: true,
                                    islangconvert: false,
                                    title: "반려",
                                    actions: "",
                                    width: "700",
                                    height: "380",
                                    //docInstance: $doc,
                                    show: 'fade', //effect
                                    hide: 'fade', //effect
                                    //$('textarea[name=comment2]').val()
                                    buttons: [{
                                            title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
                                            css: 'confirm',
                                            click: function (_$dialog) {
                                                //
                                                //var _com=$('textarea[name=comment2]', _$el) contents
                                                $fn.cmdPost(

                                                    $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument'), {
                                                    actiontype: ('jorefuse1'),                                                    
                                                    postdata: $("[name=masterid1]").val(),
                                                    postdata1: $("[name=contents]").val(),
                                                    vorgid: $("[name=vorgid]").val(),
                                                    sendflag: $("[name=mailsendflag]").val()
                                                }, function (data) {
                                                    
                                                    if(data.result == "200"){
                                                    // "result":"200","re_cd":"del_temp","cnt":"2"
                                                    //history.back();

                                                    $fn.toast({
                                                        msg: $fn.getCodeMsg("반려처리되었습니다.")
                                                    });
                                                     
                                                    }else{
                                                        
                                                        
                                                    }
                                                    var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
                                                    $fn.loadPage({
              
                                                        link: _url,
                                
                                                        linktype: "PAGE"
                                
                                                    });
                                                     _$dialog.close();
                                                }, 'json');
                                            }
                                        }, {
                                            title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
                                            css: 'cancel',
                                            click: function (_$dialog) {
                                                _$dialog.close();
                                            }
                                        }
                                    ],
                                    content: {
                                       url: $fn.getProxyUrl("/dwp/com/work/wonunit_master_2.nsf" + '/' + _form + '?OpenForm')
                                    },
                                    open: function () {
                                        var pbtnobj = $('div.dwp-page-heading', el),
                                        btnobj = $('div.dwp-btn', pbtnobj);

                                        btnobj.css('pointer-events', 'none');
                                        // console.log("open",_modal);
                                    },
                                    close: function () {
                                        var pbtnobj = $('div.dwp-page-heading', el),
                                        btnobj = $('div.dwp-btn', pbtnobj);

                                        btnobj.css('pointer-events', 'auto');
                                        // console.log("close",_modal);
                                    }
                                });
                        })
                           
                            

                           
                        }
                    },
					
                    vvcancel3: { //조달 반려
                      title: "반려", 
                      click: function (view) {  
                        var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;								
							console.log("편집가능자"+$("[name=MAT_DPT_CD]").val())
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("[name=MAT_DPT_CD]").val()){
									
								}else{
									$fn.alert({ //생산 완료 시 플래그
										msg: $fn.getCodeMsg("편집권한이 없습니다.")
									}); 
									return false;
									
								}
                        $fn.confirm({

                          msg: $fn.getCodeMsg("조달 반려 하시겠습니까?반려시 이전STEP재작성합니다")
       
                      }).done(function () {
                          var _form = 'wFrmEvaluateDialog1';
                          var _Dailog = $fn.dialog(null, {
                                  modal: true,
                                  resizable: false,
                                  draggable: true,
                                  islangconvert: false,
                                  title: "반려",
                                  actions: "",
                                  width: "700",
                                  height: "380",
                                  //docInstance: $doc,
                                  show: 'fade', //effect
                                  hide: 'fade', //effect
                                  //$('textarea[name=comment2]').val()
                                  buttons: [{
                                          title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
                                          css: 'confirm',
                                          click: function (_$dialog) {
                                              //
                                              //var _com=$('textarea[name=comment2]', _$el) contents
                                              $fn.cmdPost(

                                                  $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument'), {
                                                  actiontype: ('jorefuse2'),                                                    
                                                  postdata: $("[name=masterid1]").val(),
                                                  postdata1: $("[name=contents]").val(),
                                                  vorgid: $("[name=vorgid]").val(),
                                                  sendflag: $("[name=mailsendflag]").val()
                                              }, function (data) {
                                                  
                                                  if(data.result == "200"){
                                                  // "result":"200","re_cd":"del_temp","cnt":"2"
                                                  //history.back();

                                                  $fn.toast({
                                                      msg: $fn.getCodeMsg("반려처리되었습니다.")
                                                  });
                                                   
                                                  }else{
                                                      
                                                      
                                                  }
                                                  var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
                                                  $fn.loadPage({
            
                                                      link: _url,
                              
                                                      linktype: "PAGE"
                              
                                                  });
                                                   _$dialog.close();
                                              }, 'json');
                                          }
                                      }, {
                                          title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
                                          css: 'cancel',
                                          click: function (_$dialog) {
                                              _$dialog.close();
                                          }
                                      }
                                  ],
                                  content: {
                                     url: $fn.getProxyUrl("/dwp/com/work/wonunit_master_2.nsf" + '/' + _form + '?OpenForm')
                                  },
                                  open: function () {
                                      var pbtnobj = $('div.dwp-page-heading', el),
                                      btnobj = $('div.dwp-btn', pbtnobj);

                                      btnobj.css('pointer-events', 'none');
                                      // console.log("open",_modal);
                                  },
                                  close: function () {
                                      var pbtnobj = $('div.dwp-page-heading', el),
                                      btnobj = $('div.dwp-btn', pbtnobj);

                                      btnobj.css('pointer-events', 'auto');
                                      // console.log("close",_modal);
                                  }
                              });
                      })
                         
                          

                         
                      }
                  },
					
                  vvcancel4: { //조달기획검증 반려
                    title: "반려", 
                    click: function (view) {  
							var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;								
							
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("#DATA_COM_DPT_CD").val()){
									
								}else{
									$fn.alert({ //생산 완료 시 플래그
										msg: $fn.getCodeMsg("편집권한이 없습니다.")
									}); 
									return false;
									
								}
                      $fn.confirm({

                        msg: $fn.getCodeMsg("조달기획검증 반려 하시겠습니까?반려시 이전STEP재작성합니다")
     
                    }).done(function () {
                        var _form = 'wFrmEvaluateDialog1';
                        var _Dailog = $fn.dialog(null, {
                                modal: true,
                                resizable: false,
                                draggable: true,
                                islangconvert: false,
                                title: "반려",
                                actions: "",
                                width: "700",
                                height: "380",
                                //docInstance: $doc,
                                show: 'fade', //effect
                                hide: 'fade', //effect
                                //$('textarea[name=comment2]').val()
                                buttons: [{
                                        title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
                                        css: 'confirm',
                                        click: function (_$dialog) {
                                            //
                                            //var _com=$('textarea[name=comment2]', _$el) contents
                                            $fn.cmdPost(

                                                $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument'), {
                                                actiontype: ('jorefuse3'),                                                    
                                                postdata: $("[name=masterid1]").val(),
                                                postdata1: $("[name=contents]").val(),
                                                vorgid: $("[name=vorgid]").val(),
                                                sendflag: $("[name=mailsendflag]").val()
                                            }, function (data) {
                                                
                                                if(data.result == "200"){
                                                // "result":"200","re_cd":"del_temp","cnt":"2"
                                                //history.back();

                                                $fn.toast({
                                                    msg: $fn.getCodeMsg("반려처리되었습니다.")
                                                });
                                                 
                                                }else{
                                                    
                                                    
                                                }
                                                var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
                                                $fn.loadPage({
          
                                                    link: _url,
                            
                                                    linktype: "PAGE"
                            
                                                });
                                                 _$dialog.close();
                                            }, 'json');
                                        }
                                    }, {
                                        title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
                                        css: 'cancel',
                                        click: function (_$dialog) {
                                            _$dialog.close();
                                        }
                                    }
                                ],
                                content: {
                                   url: $fn.getProxyUrl("/dwp/com/work/wonunit_master_2.nsf" + '/' + _form + '?OpenForm')
                                },
                                open: function () {
                                    var pbtnobj = $('div.dwp-page-heading', el),
                                    btnobj = $('div.dwp-btn', pbtnobj);

                                    btnobj.css('pointer-events', 'none');
                                    // console.log("open",_modal);
                                },
                                close: function () {
                                    var pbtnobj = $('div.dwp-page-heading', el),
                                    btnobj = $('div.dwp-btn', pbtnobj);

                                    btnobj.css('pointer-events', 'auto');
                                    // console.log("close",_modal);
                                }
                            });
                    })
                       
                        

                       
                    }
                },
					
                  vvcancel5: { //생산추진최종검증 반려 APP_COM_DPT_CD
                    title: "반려", 
                    click: function (view) {  
                      var _info1 = $dwp.cns("core.info");
							var vdocname=_info1.cuser.abnotesid ;								
							
								if(vdocname == "zadmin/Z99999/DNKRWEB" ||vdocname == $("input[name=APP_COM_DPT_CD]").val()){
									
								}else{
									$fn.alert({ //생산 완료 시 플래그
										msg: $fn.getCodeMsg("편집권한이 없습니다.")
									}); 
									return false;
									
								}
                      $fn.confirm({

                        msg: $fn.getCodeMsg("생산추진최종검증 반려 하시겠습니까?반려시 이전STEP재작성합니다")
     
                    }).done(function () {
                        var _form = 'wFrmEvaluateDialog1';
                        var _Dailog = $fn.dialog(null, {
                                modal: true,
                                resizable: false,
                                draggable: true,
                                islangconvert: false,
                                title: "반려",
                                actions: "",
                                width: "700",
                                height: "380",
                                //docInstance: $doc,
                                show: 'fade', //effect
                                hide: 'fade', //effect
                                //$('textarea[name=comment2]').val()
                                buttons: [{
                                        title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
                                        css: 'confirm',
                                        click: function (_$dialog) {
                                            //
                                            //var _com=$('textarea[name=comment2]', _$el) contents
                                            $fn.cmdPost(

                                                $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument'), {
                                                actiontype: ('jorefuse4'),                                                    
                                                postdata: $("[name=masterid1]").val(),
                                                postdata1: $("[name=contents]").val(),
                                                vorgid: $("[name=vorgid]").val()
                                            }, function (data) {
                                                
                                                if(data.result == "200"){
                                                // "result":"200","re_cd":"del_temp","cnt":"2"
                                                //history.back();

                                                $fn.toast({
                                                    msg: $fn.getCodeMsg("반려처리되었습니다.")
                                                });
                                                 
                                                }else{
                                                    
                                                    
                                                }
                                                var _url = "/dwp/com/work/wonunit_master_2.nsf/vdockey/"+$("input[name=masterid1]").val()+"?opendocument";
                                                $fn.loadPage({
          
                                                    link: _url,
                            
                                                    linktype: "PAGE"
                            
                                                });
                                                 _$dialog.close();
                                            }, 'json');
                                        }
                                    }, {
                                        title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
                                        css: 'cancel',
                                        click: function (_$dialog) {
                                            _$dialog.close();
                                        }
                                    }
                                ],
                                content: {
                                   url: $fn.getProxyUrl("/dwp/com/work/wonunit_master_2.nsf" + '/' + _form + '?OpenForm')
                                },
                                open: function () {
                                    var pbtnobj = $('div.dwp-page-heading', el),
                                    btnobj = $('div.dwp-btn', pbtnobj);

                                    btnobj.css('pointer-events', 'none');
                                    // console.log("open",_modal);
                                },
                                close: function () {
                                    var pbtnobj = $('div.dwp-page-heading', el),
                                    btnobj = $('div.dwp-btn', pbtnobj);

                                    btnobj.css('pointer-events', 'auto');
                                    // console.log("close",_modal);
                                }
                            });
                    })
                       
                        

                       
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

            _initOptions: function (opt) {



                var _me = this,

                _opt = $.extend({}, opt);

                _opt.button = _me._buttonInfo(_opt);

                _opt.header = _me._headerInfo(_opt);

                return _opt;

            },

            init: function (opt, el) {

                console.log("::init Start");

                var _me = this;

                var _view = null;

                var _opt = _me._initOptions(opt);

                _view = $fn.view(_opt, el);



            },



            _buttonInfo: function (_opt) {

                var _btnList = {},

                _sbtnList = {};

                _btnList = {
				

                    // 엑셀 다운로드 기능 제공해야 함

                    eprint: {

                        title: $fn.getCodeMsg("comm.btn.exceldown"),

                        click: function (view) {

                            var _rows = view.getChecked();

                                if (_rows.length == 0) {

                                     $fn.confirm({

								        msg: $fn.getCodeMsg("전체문서를 엑셀다운로드 하시겠습니까??")

								    }).done(function () {

                                        var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_tradeplace?OpenAgent";

                                        $.fileDownload(_url, {

                                            httpMethod: "POST"

                                        });

								    })
                                }

                                var _unids = $.map(_rows, function (v) {

                                    return v['@unid'];

                                }).join(';');



								if (_rows.length != 0) {



								    $fn.confirm({

								        msg: _rows.length + "개의 " + $fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까??")

								    }).done(function () {

								        _ok();

								    })

									

							function _ok() {					

								$fn.cmdPost(

									$dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh2?createdocument')

									,{actiontype : ('refresh_execel'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : _unids }									

									,function(data){

										// "result":"200","re_cd":"del_temp","cnt":"2"

										//alert(data.unid)

										if ( data.hasOwnProperty("result")) {

											//alert(data.result)

											if ( data.result == "200") {

												

												 

												    var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_11?OpenAgent"+ "&unid=" + data.unid;

												    $.fileDownload(_url, {

												        httpMethod: "POST"

												    });

												

												view.reload({page : 1});

												

													$fn.toast({msg :"완료하였습니다." });

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

                        },

                        icon: $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"

                    },

                    pdel: {

                        title: $fn.getCodeMsg("comm.btn.pdeldoc"),

                        click: function (view) {

                            view.deleteDocument({

                                softdel: false

                            });

                        },

                        icon: $fn.getPath("weblib") + "/images/common/icon-permanent-remove.svg"

                    },

                    create: {

                        title: $fn.getCodeMsg("comm.btn.create"),

                        click: function (view) {

                            view.createDocument({

                                param: {}

                            });

                        },

                        icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"

                    },


					sample: {

                        title: "SampleDown",

                        click: function (view) {

                            window.open("/dwp/com/sys/gwlib.nsf/budget/$file/sample_purchase.xlsx");

                        },

                        //icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"

                    }

                };

                _sbtnList = {

                    wv01: ['create', 'pdel', 'eprint','upload','sample']

                };



                return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);

            },

            _headerInfo: function (_opt) {

                var _me = this,

                _col = {},

                _hList = {};

                _col = {

					reg: {

                        name: '_reg',                       

                        title: '등록일자',

                        width: '10%',

                        sort: false,

                        css: 'file-cell'

                    },

                    attach: {

                        name: '_attach',

                        type: 'file',

                        title: '',

                        width: '10%',

                        sort: false,

                        css: 'file-cell'

                    },

                    location1: {

                        name: '_location',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h1'), //사업장

                        width: '15%',

                        sort: false

                    },

                    kind: {

                        name: '_kind',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h2'), //구분

                        width: '5%',

                        sort: false

                    },

                    //거래처 조회 팝업용

                    pkind: {

                        name: '_pkind',

                        type: 'text',

                        title: $fn.getCodeMsg("pamt_wonunit_2.title.h2"),

                        click: function (view, data, ele) {



                            _$$.pamt_wonunit_2.view._poptrclickcustom(view, data, ele);

                        },

                        width: '10%',

                        sort: true,

                        css: 'dwp-cursor'

                    },

                    code: {

                        name: '_code',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h3'), //업체코드

                        width: '10%',

                        sort: false

                    },

                    //거래처 조회 팝업용

                    pcode: {

                        name: '_pcode',

                        type: 'text',

                        title: $fn.getCodeMsg("pamt_wonunit_2.title.h3"),

                        click: function (view, data, ele) {



                            _$$.pamt_wonunit_2.view._poptrclickcustom(view, data, ele);

                        },

                        width: '10%',

                        sort: true,

                        css: 'dwp-cursor'

                    },

                    companyproto: {

                        name: '_companyproto',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h4'), //업체구분명

                        width: '10%',

                        sort: false

                    },

                    //거래처 조회 팝업용

                    pcompanyproto: {

                        name: '_pcompanyproto',

                        type: 'text',

                        title: $fn.getCodeMsg("pamt_wonunit_2.title.h4"),

                        click: function (view, data, ele) {



                            _$$.pamt_wonunit_2.view._poptrclickcustom(view, data, ele);

                        },

                        width: '10%',

                        sort: true,

                        css: 'dwp-cursor'

                    },

                    servone: {

                        name: '_servone',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h5'), //서브원등록여부

                        width: '10%',

                        sort: false

                    },

                    usernum: {

                        name: '_usernum',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h13'), //사업자등록번호

                        width: '10%',

                        sort: false

                    },

                    //거래처 조회 팝업용

                    pusernum: {

                        name: '_pusernum',

                        type: 'text',

                        title: $fn.getCodeMsg("pamt_wonunit_2.title.h13"),

                        click: function (view, data, ele) {



                            _$$.pamt_wonunit_2.view._poptrclickcustom(view, data, ele);

                        },

                        width: '10%',

                        sort: true,

                        css: 'dwp-cursor'

                    },

                    value: {

                        name: '_value',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h6'), //업체명

                        width: '10%',

                        sort: false

                    },

                    //거래처 조회 팝업용

                    pvalue: {

                        name: '_pvalue',

                        type: 'text',

                        title: $fn.getCodeMsg("pamt_wonunit_2.title.h6"),

                        click: function (view, data, ele) {



                            _$$.pamt_wonunit_2.view._poptrclickcustom(view, data, ele);

                        },

                        width: '10%',

                        sort: true,

                        css: 'dwp-cursor'

                    },

                    commaster: {

                        name: '_commaster',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h7'), //대표이사

                        width: '10%',

                        sort: false

                    },

                    //거래처 조회 팝업용

                    pcommaster: {

                        name: '_pcommaster',

                        type: 'text',

                        title: $fn.getCodeMsg("pamt_wonunit_2.title.h7"),

                        click: function (view, data, ele) {



                            _$$.pamt_wonunit_2.view._poptrclickcustom(view, data, ele);

                        },

                        width: '10%',

                        sort: true,

                        css: 'dwp-cursor'

                    },

                    telmaster: {

                        name: '_telmaster',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h8'), //대표이사 전화번호

                        width: '10%',

                        sort: false

                    },

                    commanager: {

                        name: '_commanager',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h9'), //담당자

                        width: '4%',

                        sort: false

                    },

                    telmanager: {

                        name: '_telmanager',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h10'), //담당자 전화번호

                        width: '10%',

                        sort: false

                    },

                    mailaddress: {

                        name: '_mailaddress',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h11'), //담당자 전화번호

                        width: '10%',

                        sort: false

                    },



                    // 아래 필드는 미사용

                    authorname: {

                        name: '_authorname',

                        title: $fn.getCodeMsg('pamt_wonunit_2.title.h9'), //담당

                        width: '10%',

                        sort: false,

                        type: 'fnc',

                        content: function (o) {

                            return $fn.getCurLangMsg(o["_authorname"]);

                        }

                    }

                };

                _hList = {

                    wv01: {

                        checkbox: true,

                        formalias: "wFrm01J", // 거래처 양식 호출

                        isreply: false,

                        css: "",

                        colnm: ["reg", "location", "kind", "code", "companyproto", "servone", "usernum", "value", "commaster", "telmaster", "commanager", "telmanager", "mailaddress"],

                        search: [{

                                title: $fn.getCodeMsg("comm.title.searchall"),

                                key: "all"

                            }, {

                                title: $fn.getCodeMsg('pamt_wonunit_2.title.h6'),

                                key: "value"

                            }, {

                                title: $fn.getCodeMsg('pamt_wonunit_2.title.h3'),

                                key: "code"

                            }

                        ]

                        //,click : function(){}

                    },

                    w_pop_customer: {

                        checkbox: false,

                        formalias: "wFrm01J",

                        isreply: false,

                        iscategory: false,

                        nolink: false,

                        colnm: ["location1","pkind", "pcode", "pcompanyproto", "pusernum", "pvalue", "pcommaster"],

                        excel_colnm: ['pvalue', 'pusernum']

                        ///						,css : _$$.budget01.view._popupaccount

                    ,

                        search: [{

                                title: $fn.getCodeMsg("comm.title.searchall"),

                                key: "all"

                            }, {

                                title: $fn.getCodeMsg("pamt_wonunit_2.title.h6"),

                                key: "value"

                            }, {

                                title: $fn.getCodeMsg("pamt_wonunit_2.title.h3"),

                                key: "code"

                            }

                        ]

                    }

                };



                _hList[_opt.viewalias].col = $dwp.core.util.exObjList(_col, _hList[_opt.viewalias].colnm);



                return _hList[_opt.viewalias];

            },
		
            //팝업창에서 거래처 조회에서 TR 클릭시 수행.

            _poptrclickcustom: function (view, data, ele) {

                var __dlg = $("#" + ele.options.did),

                _inst = __dlg.xdialog("instance");

                var _opt = _inst.options.referdata;

                var _aprdoc = _opt.aprdoc;

                var _tr = _opt.tr;



                //선택된 필드 값을 지정하기 위한 필드

                // 팝업 양식이 옵션으로 쿼리스티링 필드 참조

                var _selected_field = ele.options.selected_field



                    //var _customcode = $.isArray(data._pcustomercode) ? data._paccountcode[0]:data._pusernum;

                    ///var _customname = $.isArray(data._pcustomer) ? data._paccount[0]:data._pvalue;

                    var _customcode = data._pusernum;

                var _customname = data._pvalue;



                //var _captin = $.isArray(data._prepresentative) ? data._prepresentative[0]:data._prepresentative;	//대표자

                //var _charge = $.isArray(data._pcharge) ? data._pcharge[0]:data._pcharge;							//담당자

                //var _bank = $.isArray(data._pbank) ? data._bank[0]:data._pbank;										//은행

                //var _actnum = $.isArray(data._paccountnum) ? data._paccountnum[0]:data._paccountnum;				//계좌

                //var _hp = $.isArray(data._php) ? data._php[0]:data._php;											//HP

                /*

                _prepresentative,_pcharge,_bank,_paccountnum,_php
	Location="1";"E1_마산공장";
	Location="2";"C1_창원/S1_화성";
	Location="3";"U1_의왕";
	Location="9";"공통";
                 */
				 var _companylocation
				  if($("[name=ed_location]").val()=="E1"){
					  _companylocation="E1_마산공장"
				  }else if($("[name=ed_location]").val()=="C1"){
					  _companylocation="C1_창원/S1_화성"
				  }else if($("[name=ed_location]").val()=="S1"){
					  _companylocation="C1_창원/S1_화성"
				  }else if($("[name=ed_location]").val()=="U1_의왕"){
					  _companylocation="R1"
				  }else if($("[name=ed_location]").val()=="R1"){
                    _companylocation="U1_의왕"
                 }else if($("[name=ed_location]").val()=="공통"){
					  _companylocation="공통"
				  }
                  
                  var _info33 = $dwp.cns("core.info");
                   
                    //  alert(_info33.cuser.notesid)
                    //CN=zadmin/OU=Z99999/O=DNKRWEB 조현승/U01020/DNKRWEB 허혜자/U01006/DNKRWEB
 
                 if (_info33.cuser.notesid == "CN=zadmin/OU=Z99999/O=DNKRWEB" || _info33.cuser.notesid == "CN=조현승/OU=U01020/O=DNKRWEB" ||_info33.cuser.notesid == "CN=허혜자/OU=U01006/O=DNKRWEB" ){ //관리자 제외




                 }else{

               
				  
                        if(data._location==_companylocation){
                            
                        }else if(data._location=="공통"){
                            
                        }else{
                            $fn.alert({//aprv_sub_103.title.a36
                                msg: $fn.getCodeMsg("양식에서 선택된 사업부 "+_companylocation+"의 업체만 선택가능합니다. ")
                                });
                            return false;
                        }
                }

                if (_selected_field == "") {

                    var _$customer = $("[name='_CUSTOMER']", _tr);

                    _$customer.xval(_customname);

                    var _$customerinfo = $("[name='_CUSTOMER_INFO']", _tr);

                    //거리쳐코드¶거래처명¶대표자¶담당자¶은행¶계좌번호¶HP

                    //_$customerinfo.xval(_customcode+"¶"+_customname+"¶"+_captin+"¶"+_charge+"¶"+_bank+"¶"+_actnum+"¶"+_hp);

                    //거리쳐코드¶거래처명
					
					if(_customcode == ""){
						_customcode="";
						
					}

                    _$customerinfo.xval(_customcode + "¶" + _customname);

                    _inst.close();



                } else if (_selected_field == "customernew") {

                    var _$customer = $("[name='_CUSTOMERNEW']", _tr);

                    _$customer.xval(_customname);

                    var _$customerinfo = $("[name='_CUSTOMERNEW_INFO']", _tr);

                    //거리쳐코드¶거래처명¶대표자¶담당자¶은행¶계좌번호¶HP

                    //_$customerinfo.xval(_customcode+"¶"+_customname+"¶"+_captin+"¶"+_charge+"¶"+_bank+"¶"+_actnum+"¶"+_hp);

                    //거리쳐코드¶거래처명

                    _$customerinfo.xval(_customcode + "¶" + _customname);

                    _inst.close();

                }



            },

            //팝업보기 처리 - 2017.10.23 by dwlee

            _searchAreaSet: function (evt, view) {

                //var _el = view.element;

                //var _el1 = $fn.getContent();

                //var _$search = $("div.dwp-search-grouping",el);

                var _$search = $("div.dwp-search-grouping");

                _$search.addClass("active");



                //검색어 필드에 포커싱 - 2017.11.16 by dwlee

                $("input[name='search']", _$search).focus();

            },

			

        },

		appdocsave: function ($doc, opt) {

                var _opt = $doc.options, vchk = true, _actiontype=opt.actiontype;



               

                    $doc.save(opt);

                

            },

			 savecallback: function (jdata, $doc) {

                var _opt = $doc.options,

                    _did = _opt.did,

                    _isportal = _opt.isportal,

                    _isaprvportal = _opt.isaprvportal;



                // console.log("jdata",jdata);



                if (jdata.result == '400') {

                    $fn.loadPage({

                        link: $fn.getProxyUrl(jdata.returnurl),

                        linktype: 'PAGE'

                    });

                    $fn.alert({

                        msg: $fn.getCodeMsg($fn.getCodeMsg(jdata.msgcode))

                    });

                    return false;

                }



                if (jdata.hasOwnProperty('returnmsgcode')) {

                    $fn.toast({ msg: $fn.getCodeMsg(jdata.returnmsgcode) });

                    return false;

                }



                if (jdata.hasOwnProperty('returnurl')) {

                    if (jdata.hasOwnProperty('update')) {

                        var update = jdata;

                        update.actiontype = 'linkupdate';

                        // 링크 생성 /업데이트/삭제 처리

                        $fn

                            .xAjax({

                                url: $fn.getProxyUrl(

                                    '/dwp/aprv/hq/aprving.nsf/wcmdpost?createdocument'

                                ),

                                method: 'POST',

                                dataType: 'json',

                                data: update,

                                async: true,

                                cache: false

                            })

                            .done(function (data) {

                                // console.log("처리",data);

                                _$$.aprv.com.refreshpage(jdata, $doc);

                            })

                            .fail(function (req, error) {

                                console.log(req.responseText + '\n' + error);

                                _$$.aprv.com.refreshpage(jdata, $doc);

                            });

                    } else {

                        _$$.aprv.com.refreshpage(jdata, $doc);

                    }

                }

            }

				



    };

}

    ($dwp.cns("app"), jQuery));























































