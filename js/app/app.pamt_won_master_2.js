/* Source File Upload Time : 2022-04-13 3:38:29 PM*/


/* Source File Upload Time : 2022-04-12 9:40:00 PM*/


/* Source File Upload Time : 2022-04-12 2:06:31 PM*/


/* Source File Upload Time : 2022-04-11 9:32:08 PM*/


/* Source File Upload Time : 2022-04-10 11:14:27 PM*/


/* Source File Upload Time : 2022-04-05 11:16:43 PM*/


/* Source File Upload Time : 2022-04-05 4:44:44 PM*/


/* Source File Upload Time : 2022-04-05 12:02:22 AM*/


/* Source File Upload Time : 2022-04-04 5:24:13 PM*/


/* Source File Upload Time : 2022-04-03 11:55:09 PM*/


/* Source File Upload Time : 2022-03-30 12:33:29 PM*/


/* Source File Upload Time : 2022-03-30 12:05:41 AM*/


/* Source File Upload Time : 2022-03-22 9:50:12 PM*/


/* Source File Upload Time : 2022-03-18 3:27:50 PM*/


/* Source File Upload Time : 2022-03-17 12:45:46 AM*/


/* Source File Upload Time : 2022-03-16 10:44:28 PM*/


/* Source File Upload Time : 2022-03-16 5:48:23 PM*/


/* Source File Upload Time : 2022-03-16 12:13:31 AM*/


/* Source File Upload Time : 2022-03-15 6:05:38 PM*/


/* Source File Upload Time : 2022-03-15 12:07:27 AM*/


/* Source File Upload Time : 2022-03-10 5:07:52 PM*/




/**
 * 전자결재 JS
 */
(function (_$$, $) {
    console.log("::Start");
    _$$.pamt_won_master_2 = {
        view: {
            getOptions: function (opt) {
                var _me = this;
                return $.extend({}, _me._initOptions(opt));
            },
            init: function (opt, el) {
                var _me = this,
                    _view = null,
                    _opt = _me._initOptions(opt);

                // console.log("aprview _opt : ", _opt); form_kind
				
								$("#_pop2").on("click", function () {
								    var opt = $doc.options;
								    var _url = "";
									var _form="";
									if($("#_form_kind").val()=="일반구매품"){
										_form="Form104"
									}else{
										_form="Form126"
									}

								    _url = "/dwp/aprv/com/aprvstart.nsf/wFrmApprove?openform";
								    _url += "&FormCode="+_form;

								    _url += "&org_dbpath=" + opt.cdb;
								    _url += "&org_docid=" + opt.unid;
								    $fn.loadPage({
								        link: _url,
								        linktype: "PAGE"
								    });
								}); //출장정산서 작성 버튼 선택
						
                _view = $fn.view(_opt, el);
            },
            _initOptions: function (opt) {
                var _me = this,
                    _opt = $.extend({}, opt);

                _opt.button = _me._buttonInfo(_opt);
                _opt.header = _me._headerInfo(_opt);
             
                return _opt;
            },
            _buttonInfo: function (_opt) {
                var _aprdockeylist = "";        //선택한 결의서 UNID 리스트
                var _me = this,
                    _btnList = {
                        del: {
                            title: $fn.getCodeMsg('comm.btn.deldoc'), // 삭제
                            click: function (view) {
								 
                                view.deleteDocument();
                            },
                            icon: $fn.getPath('weblib') + '/images/common/icon-remove.svg'
                        },
                        pdel: {
                            title: $fn.getCodeMsg('comm.btn.pdeldoc'), // 영구삭제
                            click: function (view) {
								 var _rows = view.getChecked();
								 if (_rows.length == 0) {
										$fn.alert({
								        msg: $fn.getCodeMsg("문서를 선택하세요")
										}); //사유
									return false;
								 }
								  $fn.confirm({msg : $fn.getCodeMsg("영구삭제 하시겠습니까?")}).done( function() {
                                       view.deleteDocument({ softdel: false });
                                    });
                                
                            },
                            icon:
                                $fn.getPath('weblib') +
                                '/images/common/icon-permanent-remove.svg'
                        },
                        restore: {
                            title: $fn.getCodeMsg('comm.btn.restoredoc'), // 복원
                            click: function (view) {
                                view.restoreDocument({ docstatus: 'reg' });
                            },
                            icon: $fn.getPath('weblib') + '/images/common/icon-retrun.svg'
                        },
                        starflag: {
                            title: $fn.getCodeMsg('comm.btn.exceldown'), // 중요표시
                            click: function (view) {
                                var _rows = view.getChecked();
								 if (_rows.length == 0) {
										  $fn.alert({
								        msg: $fn.getCodeMsg("문서를 선택하세요")
								    }); //사유
									return false;
									/* 전체다운로드 필요하면 쓰라
                                   	$fn.confirm({msg : "전체"+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){
										
										var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_all1?OpenAgent"
										$.fileDownload(_url, {httpMethod : "GET"});	
										
										
										})
										*/
                                }
                               
									
								
									
                                   
                              
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
								
								
							if(_rows.length != 0){

							$fn.confirm({msg : _rows.length +"개의 "+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){_ok();})
							}
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
												
												 
												    var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_12?OpenAgent"+ "&unid=" + data.unid;
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
                            },
                            icon : $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"
                        },
                        starflag1: {
                            title: $fn.getCodeMsg('comm.btn.exceldown'), // 중요표시
                            click: function (view) {
                                var _rows = view.getChecked();
								 if (_rows.length == 0) {
										  //$fn.alert({
								       // msg: $fn.getCodeMsg("문서를 선택하세요")
								   // }); //사유
									//return false;
									/* 전체다운로드 필요하면 쓰라*/
                                   	$fn.confirm({msg : "전체"+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){
										
										var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_all1?OpenAgent"+"&type=1"
										$.fileDownload(_url, {httpMethod : "POST"});	
										
										
										})
										
                                }
                               
									
								
									
                                   
                              
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
								
								
							if(_rows.length != 0){

							$fn.confirm({msg : _rows.length +"개의 "+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){_ok();})
							}
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
												
											//	 console.log(data.unid) substr
                                          
                                        
												   var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_12?OpenAgent"+ "&unid=" + data.unid;
                                                   $.fileDownload(_url, {httpMethod: "POST"});
                                                   // $.fileDownload('/dwp/com/work/wonunit_master_2.nsf/wexceldown_12?OpenAgent&unid=', {httpMethod : "POST", postdata : _unids});
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
                              

                            },
                            icon : $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"
                        },
                        
                        starflag2: {
                            title: $fn.getCodeMsg('comm.btn.exceldown'), // 중요표시
                            click: function (view) {
                                var _rows = view.getChecked();
								 if (_rows.length == 0) {
										  //$fn.alert({
								       // msg: $fn.getCodeMsg("문서를 선택하세요")
								   // }); //사유
									//return false;
									/* 전체다운로드 필요하면 쓰라*/
                                   	$fn.confirm({msg : "전체"+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){
										
										var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_all2?OpenAgent"
										$.fileDownload(_url, {httpMethod : "GET"});	
										
										
										})
										
                                }
                               
									
								
									
                                   
                              
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
								
								
							if(_rows.length != 0){

							$fn.confirm({msg : _rows.length +"개의 "+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){_ok();})
							}
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
												
												 
												    var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_12?OpenAgent"+ "&unid=" + data.unid;
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
                            },
                            icon : $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"
                        }
						,
                        flagupdate: {
                            title: "발주처리", // 팀결의서 작성
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

							$fn.confirm({msg : _rows.length +"개의 "+$fn.getCodeMsg("문서를 발주처리 하시겠습니까?")  }).done(function(){
								
								$fn.cmdPost(

									$dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh1?createdocument')

									,{actiontype : ('refresh_bal'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : _unids }									

									,function(data){

										// "result":"200","re_cd":"del_temp","cnt":"2"										
												//history.back();												

												$fn.toast({msg : $fn.getCodeMsg("변경되었습니다.") });

										view.reload({page : 1});

									}

									, 'json'

								);
								
								})
							}
                               
                                //팀결의서 양식 호출
								
								
                                //$fn.loadPage({ link: "/" + _wdbpath + "/wFrmApprove?openform&FormCode=Form021&dockeylist=" + _aprdockeylist, linktype: 'PAGE' })
                            }
                        }
						,
				
                        vexceldown: {
                          title: "엑셀다운로드", // 팀결의서 작성
                          click: function (view) {                               

                             
                                  var _form = 'wFrmEvaluateDialog5';
                                  var _Dailog = $fn.dialog(null, {
                                          modal: true,
                                          resizable: false,
                                          draggable: true,
                                          islangconvert: false,
                                          title: "엑셀다운로드",
                                          actions: "",
                                          width: "440",
                                          height: "300",
                                          //docInstance: $doc,
                                          show: 'fade', //effect
                                          hide: 'fade', //effect
                                          //$('textarea[name=comment2]').val()
                                          buttons: [{
                                                  title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
                                                  css: 'confirm',
                                                  click: function (_$dialog) {

                                             var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_bunki?OpenAgent"+"&sdate=" + $('[name=datepicker1]').val()+"&edate=" + $('[name=datepicker2]').val();
												    $.fileDownload(_url, {
												        httpMethod: "POST"
												    });												
                                                  
												
												    view.reload({page : 1});
												
													
                                                   
                                                     _$dialog.close();
                                                      
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
                                             url: $fn.getProxyUrl("/dwp/com/work/wonunit_master_2.nsf" + '/' + _form + '?OpenForm&un=')
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
                              

                             
                              //팀결의서 양식 호출
                              
                              
                              //$fn.loadPage({ link: "/" + _wdbpath + "/wFrmApprove?openform&FormCode=Form021&dockeylist=" + _aprdockeylist, linktype: 'PAGE' })
                          }
                      },
                      starflag: {
                          title: $fn.getCodeMsg('comm.btn.exceldown'), // 중요표시
                          click: function (view) {
                              var _rows = view.getChecked();
                               if (_rows.length == 0) {
                                        $fn.alert({
                                      msg: $fn.getCodeMsg("문서를 선택하세요")
                                  }); //사유
                                  return false;
                                  /* 전체다운로드 필요하면 쓰라
                                     $fn.confirm({msg : "전체"+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){
                                      
                                      var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_all1?OpenAgent"
                                      $.fileDownload(_url, {httpMethod : "GET"});	
                                      
                                      
                                      })
                                      */
                              }
                             
                                  
                              
                                  
                                 
                            
                              var _unids = $.map(_rows, function (v) {
                                  return v['@unid'];
                              }).join(';');
                              
                              
                          if(_rows.length != 0){

                          $fn.confirm({msg : _rows.length +"개의 "+$fn.getCodeMsg("문서를 엑셀다운로드 하시겠습니까?")  }).done(function(){_ok();})
                          }
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
                                              
                                               
                                                  var _url = "/dwp/com/work/wonunit_master_2.nsf/wexceldown_12?OpenAgent"+ "&unid=" + data.unid;
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
                          },
                          icon : $fn.getPath("weblib") + "/images/common/icon-btn-excel.svg"
                      },
                      master_create: {
                        title: "마스터문서생성", 
                        click: function (view) {  
                            $fn.confirm({msg : $fn.getCodeMsg("마스터 문서를 생성하시겠습니까?")  }).done(function(){
                                 var _info1 = $dwp.cns("core.info");
								var vdocname=_info1.cuser.pinfo.name;
                                
                                $fn.cmdPost(
                                    $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh1?createdocument')
                                    ,{actiontype : ('refresh_create'), dbpath : '/dwp/com/work/wonunit_master_2.nsf' , postdata : vdocname }								
    
                                    ,function(data){
    
                                        // "result":"200","re_cd":"del_temp","cnt":"2"										
                                                //history.back();												
    
                                                $fn.toast({msg : $fn.getCodeMsg("마스터문서가 생성 되었습니다.") });
    
                                        view.reload({page : 1});
    
                                    }
    
                                    , 'json'
    
                                );
                            
                            
                            
                            })


                           
                            

                           
                        }
                    }
						
                        ,
						  cancel: {
                            title: "반려", // 팀결의서 작성
                            click: function (view) {
                                  var _rows = view.getChecked();
								 if (_rows.length == 0) {
										  $fn.alert({
								        msg: $fn.getCodeMsg("문서를 선택하세요")
								    }); //사유
									return false;
									
                                }
								
								 if (_rows.length > 1) {
										  $fn.alert({
								        msg: $fn.getCodeMsg("한개의문서를 선택하세요")
								    }); //사유
									return false;
									
                                }
                              
                                var _unids = $.map(_rows, function (v) {
                                        return v['@unid'];
                                    }).join(';');

                                if (_rows.length != 0) {
									var _form = 'wFrmEvaluateDialog6';
                                    var _Dailog = $fn.dialog(null, {
                                            modal: true,
                                            resizable: false,
                                            draggable: true,
                                            islangconvert: false,
                                            title: "발주서발송확인",
                                            actions: "",
                                            width: "400",
                                            height: "250",
                                            //docInstance: $doc,
                                            show: 'fade', //effect
                                            hide: 'fade', //effect
											//$('textarea[name=comment2]').val()
                                            buttons: [{
                                                    title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
                                                    css: 'confirm',
                                                    click: function (_$dialog) {
														//
														//var _com=$('textarea[name=comment2]', _$el)
                                                        $fn.cmdPost(

                                                            $dwp.core.util.getProxyUrl('/dwp/com/work/wonunit_master_2.nsf/wcmdrefresh1?createdocument'), {
                                                            actiontype: ('sendflag'),
                                                             dbpath: '/dwp/com/work/wonunit_master_2.nsf＊'+$('select[name=saupbu]').val(),
                                                            postdata: _unids,
															data1:'테스트'
                                                        }, function (data) {
															
															if(data.result == "200"){
                                                            // "result":"200","re_cd":"del_temp","cnt":"2"
                                                            //history.back();

                                                            $fn.toast({
                                                                msg: $fn.getCodeMsg("선택된 문서의 발주서발송플래그가 "+data.msgcode+" 으로 변경되었습니다.")
                                                            });
															 
															}else{
																
																
															}
                                                            view.reload({
                                                                page: 1
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
                                               url: $fn.getProxyUrl("/dwp/com/work/wonunit_master_2.nsf" + '/' + _form + '?OpenForm&un='+_unids)
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
								

							//$fn.confirm({msg : _rows.length +"개의 "+$fn.getCodeMsg("문서를 발주처리 하시겠습니까?")  }).done(function(){
								
								
								
								//})
							}
                               
                                //팀결의서 양식 호출
								
								
                                //$fn.loadPage({ link: "/" + _wdbpath + "/wFrmApprove?openform&FormCode=Form021&dockeylist=" + _aprdockeylist, linktype: 'PAGE' })
                            }
                        }
						,
                    },
                    _sbtnList = {
                       
                        wviwlist10: ['pdel','master_create'],
						 wviwlist11: ['pdel'],
						  wviwlist11_com: ['pdel'],
						  wviwlist12: ['pdel'],
                          wviwlist12_com: ['pdel'],
						   wviwlist13: ['pdel','cancel'],
                           wviwlist13_com: ['pdel','cancel'],
						   wviwlist14: ['pdel'],
						   wviwlist14_com: ['pdel'],
						   wviwlist15: ['pdel','cancel'],
						   wviwlist15_com: ['pdel','cancel'],
						   wviwlist16: ['pdel','cancel'],
                           wviwlist16_com: ['pdel','cancel'],
                           wviwlist17: ['pdel','cancel'],
                           wviwlist17_com: ['pdel','cancel'],
                           wviwlist18: ['pdel','cancel'],
                           wviwlist18_com: ['pdel','cancel']
						
                    };

                return $dwp.core.util.exObjList(
                    _btnList,
                    _sbtnList[_opt.viewalias + (_opt.isbookmark ? 'd' : '')]
                );
            },
            _headerInfo: function (_opt) {
         
                var _me = this,
                    _col = {

                      
                        created: {
                            name: '_created',
                            type: 'text',
                            title:  $fn.getCodeMsg('작성일'), // 출고전표
                            width: '100px',
                            sort: false,
                            css: 'subject-cell',
                        },
                        subject: {
                            name: '_subject',
                            type: 'text',
                            title: $fn.getCodeMsg('제목'), // 제목
                            width: '300px',
                            sort: false,
                            css: 'subject-cell',
                        }
						,
                        creator: {
                            name: '_CREATOR',
                            type: 'date',
                            title: $fn.getCodeMsg('작성자'), // 제목
                            width: '100px',
                            sort: true,
                            css: 'date-cell',
							sorttype : 'asc'
                        },
                        created1: {
                            name: '_created',
                            type: 'text',
                            title:  $fn.getCodeMsg('작성일'), // 출고전표
                            width: '10%',
                            sort: false,
                            css: 'subject-cell',
                        },
                        subject1: {
                            name: '_subject',
                            type: 'text',
                            title: $fn.getCodeMsg('제목'), // 제목
                            width: '30%',
                            sort: false,
                            css: 'subject-cell',
                        }
						,
                        creator1: {
                            name: '_CREATOR',
                            type: 'date',
                            title: $fn.getCodeMsg('작성자'), // 제목
                            width: '10%',
                            sort: true,
                            css: 'date-cell',
							sorttype : 'asc'
                        }						
						,
                        attach: {
                            name: '_attach1',
                            type: 'text',
                            title: '',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        sta: {
                            name: '_STATUS',
                            type: 'text',
                            title: '상태',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        kind: {
                            name: '_kind',
                            type: 'text',
                            title: '구분',
                            width: '5%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        finaldate: {
                            name: '_finaldate',
                            type: 'text',
                            title: '최종갱신일',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        fum: {
                            name: '_fum',
                            type: 'text',
                            title: '품번',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        processman: {
                            name: '_processman',
                            type: 'text',
                            title: '다음결재자',
                            width: '5%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        sNo: {
                            name: '_sNo',
                            type: 'text',
                            title: '설변번호',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        sFumNo: {
                            name: '_sFumNo',
                            type: 'text',
                            title: '품명',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        value: {
                            name: '_value',
                            type: 'text',
                            title: '차종',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        }
						,
                        bal_num: {
                            name: '_bal_num',
                            type: 'text',
                            title: '발행번호',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        }
						,
                        companytype: {
                            name: '_companytype',
                            type: 'text',
                            title: '회람작성완료목표일',
                            width: '100px',
                            sort: false,
                            css: 'subject-cell'
                        }
						,
                        vusername_1: {
                            name: '_vusername_1',
                            type: 'text',
                            title: '최종수정자',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        DATA_COM_STS: {
                            name: '_DATA_COM_STS',
                            type: 'text',
                            title: '검증완료여부',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        SF: {
                            name: '_SF',
                            type: 'text',
                            title: '생산추진작성',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        SF1: {
                            name: '_SF1',
                            type: 'text',
                            title: '조달기획확인',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        SF2: {
                            name: '_SF2',
                            type: 'text',
                            title: '조달작성',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        SF3: {
                            name: '_SF3',
                            type: 'text',
                            title: '조달기획검증',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        },
                        SF4: {
                            name: '_SF4',
                            type: 'text',
                            title: '생산추진최종검증',
                            width: '10%',
                            sort: false,
                            css: 'subject-cell'
                        }
                    },
                    _hList = {
                        wviwlist10: {           //  생산관리발행 마스터
                          //  sortnm: '_created',
                           // sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmPurchaseForm',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: true,
							iscategory : false,
                            //category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [
                                'SF',
                                'SF1',
                                'SF2',
                                'SF3',
                                'SF4',
								'created1',
                                'creator1', //양식구분/사업장/구분/계정
                                'subject1'  // 위임여부
								
                              
								
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv.title.h010'),
                                    key: 'creator'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                }
                            ] // 전체 , 기안자  , 제목 , 본문
                            //,click : function(){}
                        },
						 wviwlist11: {           //  생산 미완료
                            //sortnm: '_finaldate',
                           // sortorder: 'ascending',
                            checkbox: true,
                            formalias: 'wFrm01J',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: true,
							//category: _cate,
							/**/
                            category : {
                                name:'_category'
                                ,lvl:1
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                                ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist11_cate?count=500","")
                                ,change : function(view, select) {
                                }
                            },
							
                            css: 'dwp-aprv-list',
                            colnm: [
								'kind',
                                'finaldate', //최종갱신일
                                'fum',  // 품번                                
                                'sNo',   //설변번호
                                'sFumNo',   //품명
                                'value',   //차종
                                'bal_num',//발행번호
                                'companytype',   //회람작성완료목표일
                                'vusername_1',   //최종수정자
                                'processman'   //다음결재자
								
								
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                }
                                
                            ] // 전체 , 기안자  , 제목 , 본문
                            //,click : function(){}
                        },
						 wviwlist11_com: {           //  생산 완료
                            //sortnm: '_finaldate',
                           // sortorder: 'ascending',
                            checkbox: true,
                            formalias: 'wFrm01J',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: true,
							//category: _cate,
							/**/
                            category : {
                                name:'_category'
                                ,lvl:1
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                                ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist11_com?count=500","")
                                ,change : function(view, select) {
                                }
                            },
							
                            css: 'dwp-aprv-list',
                            colnm: [
								'kind',
                                'finaldate', //최종갱신일
                                'fum',  // 품번                             
                                'sNo',   //설변번호
                                'sFumNo',   //품명
                                'value',   //차종
                                'bal_num',//발행번호
                                'companytype',   //회람작성완료목표일
                                'vusername_1',   //최종수정자
                                'processman'   //다음결재자
								
								
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                }
                                
                            ] // 전체 , 기안자  , 제목 , 본문
                            //,click : function(){}
                        },
						 
						 wviwlist15: {           //  조달기획
                          //  sortnm: '_finaldate',
                           // sortorder: 'ascending',
                            checkbox: true,
                            formalias: 'wFrm05J',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: true,
							//category: _cate,
							/**/
                            category : {
                                name:'_category'
                                ,lvl:1
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                                ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist15?count=500","")
                                ,change : function(view, select) {
                                }
                            },
							
                            css: 'dwp-aprv-list',
                            colnm: [
								'kind',
                                'finaldate', //최종갱신일
                                'fum',  // 품번                                
                                'sNo',   //설변번호
                                'sFumNo',   //품명
                                'value',   //차종
                                'bal_num',//발행번호
                                'companytype',   //회람작성완료목표일
                                'vusername_1',   //최종수정자
                                'processman'   //회람진행자
								
                               
								
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                }
                                
                            ] // 전체 , 기안자  , 제목 , 본문
                            //,click : function(){}
                        },
						 wviwlist15_com: {           //  조달기획완료
                          //  sortnm: '_finaldate',
                           // sortorder: 'ascending',
                            checkbox: true,
                            formalias: 'wFrm05J',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: true,
							//category: _cate,
							/**/
                            category : {
                                name:'_category'
                                ,lvl:1
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                                ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist15_com?count=500","")
                                ,change : function(view, select) {
                                }
                            },
							
                            css: 'dwp-aprv-list',
                            colnm: [
								'kind',
                                'finaldate', //최종갱신일
                                'fum',  // 품번                               
                                'sNo',   //설변번호
                                'sFumNo',   //품명
                                'value',   //차종
                                'bal_num',//발행번호
                                'companytype',   //회람작성완료목표일
                                'vusername_1',  //최종수정자
                                'processman'   //회람진행자
                               
								
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                }
                                
                            ] // 전체 , 기안자  , 제목 , 본문
                            //,click : function(){}
                        },
						 wviwlist17: {           //  생산최종검증
                          //  sortnm: '_finaldate',
                           // sortorder: 'ascending',
                            checkbox: true,
                            formalias: 'wFrm07J',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: true,
							//category: _cate,
							/**/
                            category : {
                                name:'_category'
                                ,lvl:1
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                                //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                                ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist17?count=500","")
                                ,change : function(view, select) {
                                }
                            },
							
                            css: 'dwp-aprv-list',
                            colnm: [
								'kind',
                                'finaldate', //최종갱신일
                                'fum',  // 품번                                
                                'sNo',   //설변번호
                                'sFumNo',   //품명
                                'value',   //차종
                                'bal_num',//발행번호
                                'companytype',   //회람작성완료목표일
                                'vusername_1',   //최종수정자
                                'processman'   //다음결재자
								//'DATA_COM_STS' // 검증완료여부
                               
								
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                }
                                
                            ] // 전체 , 기안자  , 제목 , 본문
                            //,click : function(){}
                        },
                        wviwlist17_com: {           //  생산최종검증완료
                         //  sortnm: '_finaldate',
                          // sortorder: 'ascending',
                           checkbox: true,
                           formalias: 'wFrm07J',
                           isnew: '', //{basedate:'_startdate'}
                           isreply: true,
                           //category: _cate,
                           /**/
                           category : {
                               name:'_category'
                               ,lvl:1
                               //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                               //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                               ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist17_com?count=500","")
                               ,change : function(view, select) {
                               }
                           },
                           
                           css: 'dwp-aprv-list',
                           colnm: [
                            'kind',
                            'finaldate', //최종갱신일
                            'fum',  // 품번                                
                            'sNo',   //설변번호
                            'sFumNo',   //품명
                            'value',   //차종
                            'bal_num',//발행번호
                            'companytype',   //회람작성완료목표일
                            'vusername_1',   //최종수정자
                            'processman'   //다음결재자
                             //  'DATA_COM_STS' // 검증완료여부
                              
                               
                           ],
                           search: [
                               {
                                   title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                   key: 'all'
                               }
                               
                           ] // 전체 , 기안자  , 제목 , 본문
                           //,click : function(){}
                       },
                        wviwlist16: {           //  조달
                         //  sortnm: '_finaldate',
                          // sortorder: 'ascending',
                           checkbox: true,
                           formalias: 'wFrm06J',
                           isnew: '', //{basedate:'_startdate'}
                           isreply: true,
                           //category: _cate,
                           /**/
                           category : {
                               name:'_category'
                               ,lvl:1
                               //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                               //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                               ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist16?count=500","")
                               ,change : function(view, select) {
                               }
                           },
                           
                           css: 'dwp-aprv-list',
                           colnm: [
                            'kind',
                            'finaldate', //최종갱신일
                            'fum',  // 품번                                
                            'sNo',   //설변번호
                            'sFumNo',   //품명
                            'value',   //차종
                            'bal_num',//발행번호
                            'companytype',   //회람작성완료목표일
                            'vusername_1',   //최종수정자
                            'processman'   //다음결재자
                              
                              
                               
                           ],
                           search: [
                               {
                                   title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                   key: 'all'
                               }
                               
                           ] // 전체 , 기안자  , 제목 , 본문
                           //,click : function(){}
                       },
                       wviwlist16_com: {           //  조달
                        //  sortnm: '_finaldate',
                         // sortorder: 'ascending',
                          checkbox: true,
                          formalias: 'wFrm06J',
                          isnew: '', //{basedate:'_startdate'}
                          isreply: true,
                          //category: _cate,
                          /**/
                          category : {
                              name:'_category'
                              ,lvl:1
                              //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                              //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                              ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist16_com?count=500","")
                              ,change : function(view, select) {
                              }
                          },
                          
                          css: 'dwp-aprv-list',
                          colnm: [
                            'kind',
                            'finaldate', //최종갱신일
                            'fum',  // 품번                                
                            'sNo',   //설변번호
                            'sFumNo',   //품명
                            'value',   //차종
                            'bal_num',//발행번호
                            'companytype',   //회람작성완료목표일
                            'vusername_1',   //최종수정자
                            'processman'   //다음결재자
                              
                             
                              
                          ],
                          search: [
                              {
                                  title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                  key: 'all'
                              }
                              
                          ] // 전체 , 기안자  , 제목 , 본문
                          //,click : function(){}
                      }
                       ,
                        wviwlist18: {           //  전결자승인
                         //  sortnm: '_finaldate',
                          // sortorder: 'ascending',
                           checkbox: true,
                           formalias: 'wFrm08J',
                           isnew: '', //{basedate:'_startdate'}
                           isreply: true,
                           //category: _cate,
                           /**/
                           category : {
                               name:'_category'
                               ,lvl:1
                               //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                               //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                               ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist18?count=500","")
                               ,change : function(view, select) {
                               }
                           },
                           
                           css: 'dwp-aprv-list',
                           colnm: [
                            'kind',
                            'finaldate', //최종갱신일
                            'fum',  // 품번                                
                            'sNo',   //설변번호
                            'sFumNo',   //품명
                            'value',   //차종
                            'bal_num',//발행번호
                            'companytype',   //회람작성완료목표일
                            'vusername_1',   //최종수정자
                            'processman'   //다음결재자
                               
                              
                               
                           ],
                           search: [
                               {
                                   title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                   key: 'all'
                               }
                               
                           ] // 전체 , 기안자  , 제목 , 본문
                           //,click : function(){}
                       }
					   ,
                        wviwlist18_com: {           //  전결자승인완료
                         //  sortnm: '_finaldate',
                          // sortorder: 'ascending',
                           checkbox: true,
                           formalias: 'wFrm08J',
                           isnew: '', //{basedate:'_startdate'}
                           isreply: true,
                           //category: _cate,
                           /**/
                           category : {
                               name:'_category'
                               ,lvl:1
                               //,data : _$$.resoladmin07._getRoomCategory(_opt, _opt.cdb + "/api/data/collections/name/Popview2?count=9999","")
                               //,data : _$$.resoladmin07._getRoomCategory(_opt, "/dwp/aprv/com/comm_code.nsf/api/data/collections/name/vl_card_list_common?count=999","")
                               ,data : _$$.pamt_won_master_2._getCardCategory(_opt, "/dwp/com/work/wonunit_master_2.nsf/api/data/collections/name/wviwlist18_com?count=500","")
                               ,change : function(view, select) {
                               }
                           },
                           
                           css: 'dwp-aprv-list',
                           colnm: [
                            'kind',
                            'finaldate', //최종갱신일
                            'fum',  // 품번                                
                            'sNo',   //설변번호
                            'sFumNo',   //품명
                            'value',   //차종
                            'bal_num',//발행번호
                            'companytype',   //회람작성완료목표일
                            'vusername_1',   //최종수정자
                            'processman'   //다음결재자
                              
                               
                           ],
                           search: [
                               {
                                   title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                   key: 'all'
                               }
                               
                           ] // 전체 , 기안자  , 제목 , 본문
                           //,click : function(){}
                       }
                    };

                var _viewalias = _opt.viewalias + (_opt.isbookmark ? 'd' : '');
                _hList[_viewalias].col = $dwp.core.util.exObjList(
                    _col,
                    _hList[_viewalias].colnm
                );
                return _hList[_viewalias];
            }
        },
        viewfun: {
        
            
            ViewPostAction: function (view, act, _data, msgcode) {
                var _me = this,
                    _rows = null,
                    _unids = '',
                    _tr = null,
                    _type = '',
                    _viewname = '',
                    _options = null;
                if (typeof _data != 'undefined') {
                    _tr = view;
                    _type = 'single';
                    (view = $fn.getInstance('view', $fn.getContent())),
                        (_options = view.options);
                    _viewname = _options.viewalias;
                    _unids = _data['@unid'];
                } else {
                    _type = 'multi';
                    _viewname = view.options.viewalias;
                    _rows = view.getChecked();
                    if (_rows.length == 0) {
                        $dwp.ui.alert({
                            msg: $fn.getCodeMsg('mail.msg.alt01')
                        });
                        return;
                    }
                    _unids = $.map(_rows, function (v) {
                        return v['@unid'];
                    }).join(';');
                    _tr = view.getCheckedRows();
                }

                var _opt = view.options;

                // console.log("_unids", _unids);

                var _url = $fn.getProxyUrl(_opt.cdb + '/wcmdpost?createdocument');
                var _actopt = {
                    actiontype: act,
                    Unid: _unids,
                    type: 'view'
                };

                var callback = function (_data) {
                    if (_data.hasOwnProperty('result')) {
                        if (_data.result == '200') {
                            switch (act) {
                                case 'act_star':
                                    if (_type == 'multi') {
                                        $("input[name='chk']:checked", _tr).attr({
                                            checked: false
                                        });
                                        $("input[name='chkall']", view.element).attr({
                                            checked: false
                                        });
                                    }
                                    $('span.mark', _tr).toggleClass('active');
                                    // if (_viewname == "($isstar)") {
                                    view.reload();
                                    // };
                                    break;
                            }
                        } else {
                            // error
                            $fn.alert({
                                msg: $fn.getCodeMsg('aprv.msg.007')
                            });
                        }
                    } else {
                        // error
                        $fn.alert({
                            msg: $fn.getCodeMsg('aprv.msg.007')
                        });
                    }
                };

                if (typeof msgcode != 'undefined') {
                    $fn
                        .confirm({
                            msg: $fn.getCodeMsg(msgcode)
                        })
                        .done(function () {
                            $fn.cmdPost(_url, _actopt, callback, 'json');
                        });
                } else {
                    $fn.cmdPost(_url, _actopt, callback, 'json');
                }
            },

            previewLoadPage: function (opt) {
                var _me = this,
                    _$doc = null,
                    _$preview = $('div.dwp-contents-preview', _me.element),
                    _$wrap = $('div.dwp-wrapping', _$preview),
                    _opt = $.extend({ url: '' }, opt);

                if (_$wrap.size() == 0) {
                    _$wrap = $("<div class='dwp-wrapping'></div>").appendTo(_$preview);
                } else {
                    _$doc = $fn.getInstance('doc', undefined, {
                        type: 'preview'
                    });
                    if (_$doc != null) {
                        _$doc.destroy();
                    }
                }
                if (_opt.url == '') {
                    var _h = "<div class='empty-guide'><div class='inner'>";
                    _h +=
                        "<img src='" +
                        $fn.getPath('weblib') +
                        "/images/common/icon-doc.svg'>" +
                        $fn.getCodeMsg('comm.title.js041');
                    _h += '</div></div>';

                    _$wrap.html(_h);
                    return;
                }

                $fn
                    .xAjax({
                        url: $dwp.core.util.getProxyUrl(_opt.url),
                        dataType: 'html',
                        async: false,
                        cache: false,
                        data: { preview: '1' }
                    })
                    .done(function (html) {
                        _$wrap.html(html);
                    })
                    .fail(function () { });
            },
            opendocument_bak: function (view, _opt) {
                var _me = this,
                    _url = view._openurl,
                    _view = $fn.getInstance('view', $fn.getContent());
                _options = _view.options;

                if (typeof _url == 'undefined') {
                    _url = _opt.cdb + '/vdockey/' + view._unid + '?opendocument';
                }

                if (_options.hasOwnProperty('param')) {
                    _url += '&' + $.param(_opt.param);
                }

                //PLM 파라미터 체크 - 2016.12.21 by dwlee
                var _jsonqry = $fn.getUrlPaser(_opt.pathinfo);
                if (_jsonqry.hasOwnProperty('cPjNo')) {
                    /*
                                  FormCode=Form001&cpjno=&vpjname=&taskid=&stddeliverableid=&
                                  taskddeliverableid=&mandatoryflag=&popup=1
                               */

                    _url += '&FormCode=' + _jsonqry.FormCode;
                    _url += '&cPjNo=' + _jsonqry.cPjNo;
                    _url += '&vPjName=' + _jsonqry.vPjName;
                    _url += '&TaskID=' + _jsonqry.TaskID;
                    _url += '&StdDeliverableID=' + _jsonqry.StdDeliverableID;
                    _url += '&TaskStdDeliverableID=' + _jsonqry.TaskStdDeliverableID;
                    _url += '&MandatoryFlag=' + _jsonqry.MandatoryFlag;
                    _url += '&popup=' + _jsonqry.popup;
                }

                // console.log("01 _url", _opt.appmndbapth + "/wAgCmdGetProcess?openagent");

                if (_url.indexOf('/gw/') >= 0) {
                    $fn
                        .xAjax({
                            url: _opt.appmndbapth + '/wAgCmdGetProcess?openagent',
                            dataType: 'json',
                            async: false,
                            cache: false,
                            data: {
                                actiontype: 'gethost',
                                Unid: view._dockey,
                                Arg1: view._indbpath
                            }
                        })
                        .done(function (data) {
                            // console.log("data",data);

                            if (data.result == '200') {
                                _url = data.linkurl + _url;
                            } else {
                                $fn.alert({
                                    msg: $fn.getCodeMsg('comm.svrmsg.msg009')
                                });
                                return;
                            }
                        });
                }

                // console.log("02 _url",_url);

                if (_options.ispreview && _options.preview != 'all') {
                    _me.previewLoadPage({ url: _url });
                } else if (_options.ispopupdoc == '1') {
                    $fn.winopen(_url, '', {});
                } else if (_options.ispopupdoc == '2') {
                    $fn.layerOpenDocument({ content: { url: _url } });
                } else {
                    $fn.loadPage({ link: _url, linktype: 'PAGE' });
                }
            },
            opendocument: function (row, view) {
                var _me = this,
                    _url = row._openurl,
                    _opt = view.options;

                if (typeof _url == 'undefined') {
                    _url = _opt.cdb + '/vdockey/' + row._unid + '?opendocument';
                }

                if (_opt.hasOwnProperty('param')) {
                    if (_opt.param != null) _url += '&' + $.param(_opt.param);
                }

                //PLM 파라미터 체크 - 2016.12.21 by dwlee
                var _jsonqry = $fn.getUrlPaser(_opt.pathinfo);
                if (_jsonqry.hasOwnProperty('cPjNo')) {
                    /*
                                  FormCode=Form001&cpjno=&vpjname=&taskid=&stddeliverableid=&
                                  taskddeliverableid=&mandatoryflag=&popup=1
                               */

                    _url += '&FormCode=' + _jsonqry.FormCode;
                    _url += '&cPjNo=' + _jsonqry.cPjNo;
                    _url += '&vPjName=' + _jsonqry.vPjName;
                    _url += '&TaskID=' + _jsonqry.TaskID;
                    _url += '&StdDeliverableID=' + _jsonqry.StdDeliverableID;
                    _url += '&TaskStdDeliverableID=' + _jsonqry.TaskStdDeliverableID;
                    _url += '&MandatoryFlag=' + _jsonqry.MandatoryFlag;
                    _url += '&popup=' + _jsonqry.popup;
                }

                // console.log("01 _url", _opt.appmndbapth + "/wAgCmdGetProcess?openagent");

                if (_url.indexOf('/gw/') >= 0) {
                    $fn
                        .xAjax({
                            url: _opt.appmndbapth + '/wAgCmdGetProcess?openagent',
                            dataType: 'json',
                            async: false,
                            cache: false,
                            data: {
                                actiontype: 'gethost',
                                Unid: row._dockey,
                                Arg1: row._indbpath
                            }
                        })
                        .done(function (data) {
                            // console.log("data",data);

                            if (data.result == '200') {
                                _url = data.linkurl + _url;
                            } else {
                                $fn.alert({
                                    msg: $fn.getCodeMsg('comm.svrmsg.msg009')
                                });
                                return;
                            }
                        });
                }

                // console.log("02 _url",_url);
                // console.log("opt", _opt);

                if (_opt.ispreview && _opt.preview != 'all') {
                    _me.previewLoadPage({ url: _url });
                } else if (_opt.ispopupdoc == '1') {
                    $fn.winopen(_url, '', {});
                } else if (_opt.ispopupdoc == '2') {
                    $fn.layerOpenDocument({ content: { url: _url } });
                } else {
                    $fn.loadPage({ link: _url, linktype: 'PAGE' });
                }
            }
        },
        _getCardCategory : function(opt, url, cate) {
			var _data = [];
			var _data1 = [];
			var _data2 = [];
			//var tmp = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
			var _t = "";
			var _x = "";
			var _url = url;
			console.log(_url);
			console.log(cate);
	        $fn.xAjax(_$$.pamt_won_master_2._jsonGetParmDataUrl(_url, cate))
	        	.done(function(json, status, xhr){
					var j=0;
					var k=0;
                    $(json).each(function(i, data){
						if( data["@unid"]=="" && data["_category"]!="" && data["_category"]!="All"){
							//_t = data["_category"];
							//_tv = data["_deptname"];
							_t = data["_category"]
							//_x = data["_deptcode"];									
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
    };
})($dwp.cns('app'), jQuery);

















































