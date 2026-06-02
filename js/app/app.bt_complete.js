/* Source File Upload Time : 2021-12-16 11:47:33 AM*/


/* Source File Upload Time : 2021-08-13 2:46:22 PM*/


/* Source File Upload Time : 2021-07-19 6:54:56 PM*/


/* Source File Upload Time : 8-25-20 4:52:33 PM*/


/* Source File Upload Time : 8-13-20 11:45:21 AM*/


/* Source File Upload Time : 2020-07-31 5:34:29 PM*/


/* Source File Upload Time : 2019-12-02 11:16:56 AM*/


/* Source File Upload Time : 2019-11-03 12:07:09 AM*/


/* Source File Upload Time : 2019-11-01 11:41:34 AM*/


/* Source File Upload Time : 2019-10-19 12:22:49 AM*/


/* Source File Upload Time : 2019-10-10 7:25:18 PM*/


/* Source File Upload Time : 2019-10-10 11:47:27 AM*/


/* Source File Upload Time : 10-7-19 5:53:24 PM*/



/**
 * 전자결재 JS
 */
(function (_$$, $) {
    _$$.bt_complete = {        
        view: {
            getOptions: function (opt) {
                var _me = this;
                return $.extend({}, _me._initOptions(opt));
            },
            init: function (opt, el) {
                var _me = this,
                    _view = null,
                    _opt = _me._initOptions(opt);

                    console.log("aprview _opt : ", _opt);
                _view = $fn.view(_opt, el);
            },
            _initOptions: function (opt) {
                var _me = this,
                    _opt = $.extend({}, opt);

                _opt.button = _me._buttonInfo(_opt);
                _opt.header = _me._headerInfo(_opt);

                // 결재할문서,미결함,예정함,공유함
                //var _cntvw = "wviwlist04,wviwlist07,wviwlist10,wviwlist09";
                //if (_cntvw.indexOf(_opt.viewalias) > -1) {
                /*    
                if (_opt.viewalias != 'wviwlist80') {
                    _opt.loadComplete = function () {
                        $fn.lnbCountRefresh();

                        //분류 콤보 앞에 명칭 부여. 언어는 나중에 ㅡㅡ by noh
                        _target = $fn.getTarget();
                        // $("[name='dwp-cate-area']>div", _target).css("float", "left");
                        if ($("[name='dwp-cate-area'] .selboxtitle", _target).length == 0) {
                            $("[name='dwp-cate-area'] .dwp-selectbox", _target).each(function (i) {
                                if (i == 0) $("<div class='selboxtitle'>문서분류</div>").insertBefore($(this));
                                if (i == 1) $("<div class='selboxtitle'>양식분류</div>").insertBefore($(this));
                            })
                        }
                    };
                }
                */
                //}

                return _opt;
            },
            _buttonInfo: function (_opt) {
                var _aprdockeylist = "";        //선택한 결의서 UNID 리스트
                var _me = this,
                    _btnList = {
                        db2update: {
                            title: 'JDE Upload' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');

                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }

                                $fn.confirm({ msg: '선택한 출장정산서를 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_biztrip?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'0', 
                                        WQS_Agent: 'cmdpost_jde_biztrip_upload'
                                    }
                                    var callback = function (data) {
                                        //console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_simple: {
                            title: 'JDE Upload 단일 배치번호' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');

                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }

                                $fn.confirm({ msg: '선택한 출장정산서를 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_biztrip?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'1', 
                                        WQS_Agent: 'cmdpost_jde_biztrip_upload'
                                    }
                                    var callback = function (data) {
                                        //console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_admin: {
                            title: 'JDE Upload 단일 배치번호-관리자' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');

                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                /*

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                */
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }

                                $fn.confirm({ msg: '[관리자]선택한 출장정산서를 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_biztrip_admin?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'1', 
                                        WQS_Agent: 'cmdpost_jde_biztrip_upload_admin'
                                    }
                                    var callback = function (data) {
                                        //console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },                        
                        db2update_196: {
                            title: 'JDE Upload' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');

                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                //alert(_opt.realuserid);

                                $fn.confirm({ msg: '선택한 지불증(일반)을 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_196?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'0', 
                                        WQS_Agent: 'cmdpost_jde_196_upload'
                                    }
                                    var callback = function (data) {
                                        //console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_196_simple: {
                            title: 'JDE Upload 단일 배치번호' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');

                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                //alert(_opt.realuserid);

                                $fn.confirm({ msg: '선택한 지불증(일반)을 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_196?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'1', 
                                        WQS_Agent: 'cmdpost_jde_196_upload'
                                    }
                                    var callback = function (data) {
                                        //console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_196_admin: {
                            title: 'JDE Upload 단일 배치번호 관리자' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');

                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');
                                /*
                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                */
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                //alert(_opt.realuserid);

                                $fn.confirm({ msg: '선택한 지불증(일반)을 JDE (Z1)으로 전송하시겠습니까 - 관리자?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_196_admin?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'1', 
                                        WQS_Agent: 'cmdpost_jde_196_upload_admin'
                                    }
                                    var callback = function (data) {
                                        //console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },                        
                        db2update_224: {
                            title: 'JDE Upload' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');

                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                $fn.confirm({ msg: '선택한 지불증(법인카드)를 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_224?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'0', 
                                        WQS_Agent: 'cmdpost_jde_224_upload'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_224_simple: {
                            title: 'JDE Upload 단일 배치번호' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');

                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                $fn.confirm({ msg: '선택한 지불증(법인카드)를 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_224?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'1', 
                                        WQS_Agent: 'cmdpost_jde_224_upload'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },                        
                        db2update_225: {
                            title: 'JDE Upload' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                
                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                $fn.confirm({ msg: '선택한 지불증(접대비)를 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_225?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'0', 
                                        WQS_Agent: 'cmdpost_jde_225_upload'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_225_simple: {
                            title: 'JDE Upload 단일 배치번호' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                
                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                $fn.confirm({ msg: '선택한 지불증(접대비)를 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_225?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        batchtype :'1', 
                                        WQS_Agent: 'cmdpost_jde_225_upload'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_226: {
                            title: 'JDE Upload' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                
                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                $fn.confirm({ msg: '선택한 사입선공제를 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_226?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        WQS_Agent: 'cmdpost_jde_226_upload'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_229: {
                            title: 'JDE Upload' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                
                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                $fn.confirm({ msg: '선택한 업무연락(재고자산조성)을 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_229?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        WQS_Agent: 'cmdpost_jde_229_upload'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        db2update_231: {
                            title: 'JDE Upload' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                
                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_procdate'] != "" ) {
                                        return v['_procdate'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "회계처리일자 입력하세요." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "회계처리일자 입력하세요." });
                                        return;
                                    }
                                }
                                if ( _opt.realuserid == "" ) {
                                    $fn.alert({ msg: "JDE 업로드 사용자의 사번 정보가 없습니다. IT 담당자에게 문의하세요." });
                                    return;
                                }
                                $fn.confirm({ msg: '선택한 자작명세서(완성통보)을 JDE (Z1)으로 전송하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_jde_231?createdocument')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'doc',
                                        realuserid:_opt.realuserid,
                                        WQS_Agent: 'cmdpost_jde_231_upload'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        year_exceldown: {
                            title: "현재년도 다운로드",
                            click: function (view) {
                                var _me = this
                                ,_$el = el || $fn.getTarget()
                                ,_$tree = $("[name='tree']",_$el).xtree("instance")
                                ,_dtnode = null
                                , _msg = "다운로드 하시겠습니까?";
                                            
                                $fn.confirm({msg : $fn.getCodeMsg(_msg)})
                                .done(function(){
                                    _download();
                                });
                                
                                function _download() {				
                                    var _doc = $fn.getInstance("view");
                                    //alert(_doc.options.single);
                                    var _url = "/dwp/aprv/com/bt_complete.nsf/wexceldown196_year?OpenAgent" + "&type=c";
                                    $.fileDownload(_url, {httpMethod : "GET"});				
                                   
                                }
                                
                            },
                            //icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
                        },
                        lastyear_exceldown: {
                            title: "이전년도 다운로드",
                            click: function (view) {
                                var _me = this
                                ,_$el = el || $fn.getTarget()
                                ,_$tree = $("[name='tree']",_$el).xtree("instance")
                                ,_dtnode = null
                                , _msg = "다운로드 하시겠습니까?";
                                            
                                $fn.confirm({msg : $fn.getCodeMsg(_msg)})
                                .done(function(){
                                    _download();
                                });
                                
                                function _download() {				
                                    var _doc = $fn.getInstance("view");
                                    //alert(_doc.options.single);
                                    var _url = "/dwp/aprv/com/bt_complete.nsf/wexceldown196_year?OpenAgent" + "&type=l";
                                    $.fileDownload(_url, {httpMethod : "GET"});				
                                   
                                }
                                
                            },
                            //icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
                        },
                        exceldown: {
                            title: 'EXCEL Down' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                
                                $fn.confirm({ msg: '선택하신 문서에 대하여 엑셀파일 다운로드 하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_excel?createdocument')
                                    //var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/cmdpost_excel?OpenAgent')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'ChulJang',                                        
                                        WQS_Agent: 'cmdpost_excel_dummy'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                        $.unblockUI();
                                        
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                /*
                                                    wviwlist011: ['db2update','exceldown'],                 //출장정산서 미처리
                                                    wviwlist021: ['rollback','exceldown'],                  //출장정산서 처리완료
                                                    wviwlist196n: ['db2update_196','exceldown'],            //지불증(일반) 미처리
                                                    wviwlist196y: ['rollback','exceldown'],             //지불증(일반) 처리완료
                                                    wviwlist224n: ['db2update_224','exceldown'],            //지불증(법인카드) 미처리
                                                    wviwlist224y: ['rollback','exceldown'],                 //지불증(법인카드) 처리완료
                                                    wviwlist225n: ['db2update_225','exceldown'],            //지불증(접대비) 미처리
                                                    wviwlist225y: ['rollback','exceldown'],                 //지불증(접대비) 처리완료
                                                    wviwlist226n: ['db2update_226','exceldown'],            //업무연락(사입선공제) 미처리
                                                    wviwlist226y: ['rollback','exceldown'],                 //업무연락(사입선공제) 처리완료
                                                    wviwlist229n: ['db2update_229','exceldown'],            //업무연락(재고자산) 미처리
                                                    wviwlist229y: ['rollback','exceldown'],                 //업무연락(재고자산) 처리완료
                                                    wviwlist231n: ['db2update_231','exceldown'],            //업무연락(자작명세서) 미처리
                                                    wviwlist231y: ['rollback','exceldown']                  //업무연락(자작명세서) 처리완료
                                                */
                                                var _url = "";
                                                if ( _opt.viewalias == "wviwlist011" || _opt.viewalias == "wviwlist021" ) {
                                                    _url = "dwp/aprv/com/bt_complete.nsf/cmdpost_excel?OpenAgent"+ "&actiontype=ChulJang&postdata=" + _unids;
                                                } else if ( _opt.viewalias == "wviwlist196n" || _opt.viewalias == "wviwlist196y" ) {
                                                    _url = "dwp/aprv/com/bt_complete.nsf/cmdpost_excel_01?OpenAgent"+ "&postdata=" + _unids;
                                                } else if ( _opt.viewalias == "wviwlist224n" || _opt.viewalias == "wviwlist224y" ) {
                                                    _url = "dwp/aprv/com/bt_complete.nsf/cmdpost_excel_02?OpenAgent"+ "&postdata=" + _unids;
                                                } else if ( _opt.viewalias == "wviwlist225n" || _opt.viewalias == "wviwlist225y" ) {
                                                    _url = "dwp/aprv/com/bt_complete.nsf/cmdpost_excel_03?OpenAgent"+ "&postdata=" + _unids;
                                                } else if ( _opt.viewalias == "wviwlist226n" || _opt.viewalias == "wviwlist226y" ) {
                                                    _url = "dwp/aprv/com/bt_complete.nsf/cmdpost_excel_04?OpenAgent"+ "&postdata=" + _unids;
                                                } else if ( _opt.viewalias == "wviwlist229n" || _opt.viewalias == "wviwlist229y" ) {
                                                    _url = "dwp/aprv/com/bt_complete.nsf/cmdpost_excel_05?OpenAgent"+ "&postdata=" + _unids;
                                                } else if ( _opt.viewalias == "wviwlist231n" || _opt.viewalias == "wviwlist231y" ) {
                                                    _url = "dwp/aprv/com/bt_complete.nsf/cmdpost_excel_06?OpenAgent"+ "&postdata=" + _unids;
                                                }
                                                
												$.fileDownload(_url, {
												    httpMethod: "POST"
												});
												
                                                view.refresh();
												
												//$fn.toast({msg : $fn.getCodeMsg("kr_complete.title.a14") });                                            
                                        
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        
                                        }
                                        
                                    };
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        jepdaeexceldown: {
                            title: "접대비사전신청서 엑셀다운로드(완료함)", // 팀결의서 작성
                            click: function (view) {                               
                                $fn.confirm({ msg: '결재완료함 접대사전신청서 문서를 엑셀파일 다운로드 하시겠습니까?' }).done(function () {
                               
                                
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
  
                                               var _url = "/dwp/aprv/com/bt_complete.nsf/wexceldown_bunki?OpenAgent"+"&sdate=" + $('[name=datepicker1]').val()+"&edate=" + $('[name=datepicker2]').val();
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
                                               url: $fn.getProxyUrl("/dwp/aprv/com/bt_complete.nsf" + '/' + _form + '?OpenForm&un=')
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
                                
                                    });
                               
                                //팀결의서 양식 호출
                                
                                
                                //$fn.loadPage({ link: "/" + _wdbpath + "/wFrmApprove?openform&FormCode=Form021&dockeylist=" + _aprdockeylist, linktype: 'PAGE' })
                            }
                        },
                        jepdaeexceldown1: {
                            title: "접대비사전신청서 엑셀다운로드(보관함)", // 팀결의서 작성
                            click: function (view) {                               
                                $fn.confirm({ msg: '결재보관함 접대사전신청서 문서를 엑셀파일 다운로드 하시겠습니까?' }).done(function () {
                               
                                
                                    var _form = 'wFrmEvaluateDialog6';
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
  
                                               var _url = "/dwp/aprv/com/bt_complete.nsf/wexceldown_bunki2?OpenAgent"+"&sdate=" + $('[name=datepicker1]').val()+"&edate=" + $('[name=datepicker2]').val()+"&bunki=" + $('[name=bunki]').val();
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
                                               url: $fn.getProxyUrl("/dwp/aprv/com/bt_complete.nsf" + '/' + _form + '?OpenForm&un=')
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
                                
                                    });
                               
                                //팀결의서 양식 호출
                                
                                
                                //$fn.loadPage({ link: "/" + _wdbpath + "/wFrmApprove?openform&FormCode=Form021&dockeylist=" + _aprdockeylist, linktype: 'PAGE' })
                            }
                        },
                        rollback: {
                            title: '미처리상태로 전환' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                
                                $fn.confirm({ msg: '선택하신 문서에 대하여 미처리상태로 변경하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_rollback?createdocument')
                                    //var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/cmdpost_excel?OpenAgent')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'rollback',                                        
                                        WQS_Agent: 'cmdpost_rollback'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };                                    
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        passdata: {
                            title: '처리상태로 전환' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                
                                var _procdates = $.map(_rows, function (v) {
                                    if ( v['_ed_total_all'] == "0" ) {
                                        return v['_ed_total_all'];
                                    }                                    
                                }).join(';');

                                if ( _unids.split(";").length == 1 && _procdates == "" ) {
                                    
                                    $fn.alert({ msg: "처리완료상태 전환할 수 없습니다." });
                                    return;
                                } else {
                                    if ( _unids.split(";").length != _procdates.split(";").length ) {
                                        $fn.alert({ msg: "처리완료상태 전환할 수 없습니다." });
                                        return;
                                    }
                                }

                                $fn.confirm({ msg: '선택하신 문서에 대하여 처리완료상태로 변경하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_passdata?createdocument')
                                    //var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/cmdpost_excel?OpenAgent')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'passdata',                                        
                                        WQS_Agent: 'cmdpost_passdata'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };                                    
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        pdateupdate: {
                            title: '회계처리일자 반영' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                var _$procdate = $("input[name='procdate']");
                                //alert(_$procdate.val());
                                if (_$procdate.val() == "" ) {
                                    $dwp.ui.alert({
                                        msg: '회계처리일자를 선택(입력)하세요.'
                                    });
                                    return;
                                }

                                $fn.confirm({ msg: '선택하신 문서에 대하여 회계처리일자를 반영하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_procdate_update?createdocument')
                                    //var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/cmdpost_excel?OpenAgent')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'rollback',        
                                        viewaliasname: view.options.viewalias,        
                                        procdate: _$procdate.val(),        
                                        WQS_Agent: 'cmdpost_procdate_update'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };                                    
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        },
                        qdateupdate: {
                            title: '송금예정일자 반영' // DB2로 전송
                            ,click: function (view) {
                                var _rows = view.getChecked();
                                if (_rows.length == 0) {
                                    $dwp.ui.alert({
                                        msg: '문서를 선택해 주십시오.'
                                    });
                                    return;
                                }
                                var _unids = $.map(_rows, function (v) {
                                    return v['@unid'];
                                }).join(';');
                                var _$procdate = $("input[name='procdate']");
                                //alert(_$procdate.val());
                                if (_$procdate.val() == "" ) {
                                    $dwp.ui.alert({
                                        msg: '처리일자를 선택(입력)하세요.'
                                    });
                                    return;
                                }

                                $fn.confirm({ msg: '선택하신 문서에 대하여 송금예정일자를 반영하시겠습니까?' }).done(function () {
                                    $fn.block(undefined, { notusemsg: false });
                                    // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
                                    var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/wcmdpost_qrocdate_update?createdocument')
                                    //var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/bt_complete.nsf/cmdpost_excel?OpenAgent')
                                    var _param = {
                                        postdata: _unids,
                                        dbpath: _opt.cdb,
                                        actiontype: 'rollback',        
                                        viewaliasname: view.options.viewalias,        
                                        procdate: _$procdate.val(),        
                                        WQS_Agent: 'cmdpost_qrocdate_update'
                                    }
                                    var callback = function (data) {
                                        console.log('data :', data);
                                       
                                        $.unblockUI();
                                       
                                        if (data.hasOwnProperty('result')) {                                            
                                            if (data.result >= '200' && data.result < '300') {
                                                //console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg: "총 : " + data.cnt + " 건의 데이터가 처리되었습니다." });
                                                view.refresh();
                                            } else if (data.result == '500') {     //connection fail
                                                $fn.alert({ msg: data.msg });
                                            } else if (data.result == '900') {     //ERP 코드 에러
                                                $fn.alert({ msg: data.msgcode });

                                            } else if (data.result == '400') {      //insert error
                                                console.log('결과:', "total:" + data.totcnt + "/current:" + data.curcnt + "/success:" + data.succnt + "/fail:" + data.failcnt);
                                                $fn.alert({ msg:"ERROR" });
                                            } else {
                                                $fn.alert({ msg: 'error' });
                                            }
                                        } else {
                                            $fn.alert({ msg: 'JDE 업로드 오류 : json return value have problems...' });
                                        }
                                    };                                    
                                    $fn.cmdPost(_url, _param, callback, 'json');
                                });
                            }
                        }

                    },
                    _sbtnList = {                        
                        wviwlist011: ['pdateupdate','db2update','db2update_simple','db2update_admin','exceldown','passdata'],                 //출장정산서 미처리
                        wviwlist021: ['rollback','exceldown'],                                                                                //출장정산서 처리완료
                        wviwlist196n: ['pdateupdate','qdateupdate','db2update_196','db2update_196_simple','db2update_196_admin','exceldown'], //지불증(일반) 미처리
                        wviwlist196y: ['rollback','exceldown','year_exceldown','lastyear_exceldown'],                                                                               //지불증(일반) 처리완료
                        wviwlist224n: ['pdateupdate','qdateupdate','db2update_224','db2update_224_simple','exceldown'],                       //지불증(법인카드) 미처리
                        wviwlist224y: ['rollback','exceldown'],                                                                               //지불증(법인카드) 처리완료
                        wviwlist225n: ['pdateupdate','qdateupdate','db2update_225','db2update_225_simple','exceldown'],                       //지불증(접대비) 미처리
                        wviwlist225y: ['rollback','exceldown','jepdaeexceldown','jepdaeexceldown1'],                                                                               //지불증(접대비) 처리완료
                        wviwlist226n: ['pdateupdate','db2update_226','exceldown'],                               //업무연락(사입선공제) 미처리
                        wviwlist226y: ['rollback','exceldown'],                                                  //업무연락(사입선공제) 처리완료
                        wviwlist229n: ['pdateupdate','db2update_229','exceldown'],                               //업무연락(재고자산) 미처리
                        wviwlist229y: ['rollback','exceldown'],                                                  //업무연락(재고자산) 처리완료
                        wviwlist231n: ['pdateupdate','db2update_231','exceldown'],                               //업무연락(자작명세서) 미처리
                        wviwlist231y: ['rollback','exceldown']                                                   //업무연락(자작명세서) 처리완료
                    };

                    //보기의 종류와 상관없이 모든 버튼들을 할당 - 2017.08.10
				    //return _btnList;

				    //보기별로 사용하는 버튼만 할당하기 위한 소스 - 2017.08.10
                    return $dwp.core.util.exObjList(_btnList, _sbtnList[_opt.viewalias]);                
                    
            },
            _headerInfo: function (_opt) {
                var _cate = {},
                    _cate_data = [],
                    level = 0;
                if (
                    _opt.displaycode == 'wviwlist05' || _opt.displaycode == 'wviwlist06'                    
                ) {
                    level = 2;
                } else {
                    level = 2;
                }
                var _me = this,
                    _col = {
                        formtitle: {
                            name: '_sformtitle',
                            type: 'text',
                            title: '결재양식',
                            width: '120px',
                            sort: false,
                            css: 'auth-cell'
                        },
                        authordept: {
                            name: '_authordept',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h046'), // 기안부서
                            sort: false,
                            width: '185px',
                            css: 'auth-cell'
                        },
                        pauthordept: {
                            name: '_authordept',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h046'), // 기안부서
                            click :	function(view,data, ele){
                                _$$.bt_complete.view._poptrclickcustom(view,data, ele);
                            },
                            sort: false,
                            width: '185px',
                            css: 'auth-cell'
                        },
                        pauthordept_no: {
                            name: '_authordept',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h046'), // 기안부서
                            click :	function(view,data, ele){
                                return false;
                            },
                            sort: false,
                            width: '185px',
                            css: 'auth-cell'
                        },
                        author: {
                            name: '_author',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h010'), // 기안자
                            sort: false,
                            width: '70px',
                            css: 'auth-cell'                            
                        },
                        pauthor: {
                            name: '_author',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h010'), // 기안자
                            click :	function(view,data, ele){

                                _$$.bt_complete.view._poptrclickcustom(view,data, ele);
                            },
                            sort: false,
                            width: '70px',
                            css: 'auth-cell'                            
                        },
                        pauthor_no: {
                            name: '_author',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h010'), // 기안자
                            click :	function(view,data, ele){
                                return false;                                
                            },
                            sort: false,
                            width: '70px',
                            css: 'auth-cell'                            
                        },
                        startdate: {
                            name: '_startdate',
                            type: 'date',
                            title: $fn.getCodeMsg('aprv_01.title.h007'), // 기안일자
                            width: '80px',
                            sort: true,
                            css: 'date-cell'
                        },
                        startdate4search: {
                            name: '_startdatesearch',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h007'), // 기안일자
                            width: '0px',
                            sort: false
                            
                        },                        
                        pstartdate: {
                            name: '_startdate',
                            type: 'date',
                            title: $fn.getCodeMsg('aprv_01.title.h007'), // 기안일자
                            click :	function(view,data, ele){

                                _$$.bt_complete.view._poptrclickcustom(view,data, ele);
                            },
                            width: '80px',
                            sort: true,
                            css: 'date-cell'
                        },
                        pstartdate_no: {
                            name: '_startdate',
                            type: 'date',
                            title: $fn.getCodeMsg('aprv_01.title.h007'), // 기안일자
                            click :	function(view,data, ele){
                                return false;
                            },
                            width: '80px',
                            sort: true,
                            css: 'date-cell'
                        },
                        scompletedate: {
                            name: '_scompletedate',
                            type: 'date',
                            title: $fn.getCodeMsg('aprv_01.title.h045'), // 완료일자
                            width: '80px',
                            sort: true,
                            css: 'date-cell'
                        },
                        pscompletedate: {
                            name: '_scompletedate',
                            type: 'date',
                            title: $fn.getCodeMsg('aprv_01.title.h045'), // 완료일자
                            click :	function(view,data, ele){

                                _$$.bt_complete.view._poptrclickcustom(view,data, ele);
                            },
                            width: '80px',
                            sort: true,
                            css: 'date-cell'
                        },
                        pscompletedate_no: {
                            name: '_scompletedate',
                            type: 'date',
                            title: $fn.getCodeMsg('aprv_01.title.h045'), // 완료일자
                            click :	function(view,data, ele){
                                return false
                            },
                            width: '80px',
                            sort: true,
                            css: 'date-cell'
                        },
                        ssenddate: {
                            name: '_ssenddate',
                            type: 'date',
                            title: $fn.getCodeMsg('aprv_01.title.h060'), // 수신일
                            width: '80px',
                            sort: true,
                            css: 'date-cell'
                        },   
                        subject: {
                            name: '_subject',
                            type: 'text',
                            title: $fn.getCodeMsg('comm.title.subject'), // 제목
                            width: 'auto',
                            sort: false,
                            css: 'subject-cell'
                        },                           
                        psubject: {
                            name: '_subject',
                            type: 'text',
                            title: $fn.getCodeMsg('comm.title.subject'), // 제목
                            click :	function(view,data, ele){

                                _$$.bt_complete.view._poptrclickcustom(view,data, ele);
                            },
                            width: 'auto',
                            sort: false,
                            css: 'subject-cell'
                        },
                        psubject_no: {
                            name: '_subject',
                            type: 'text',
                            title: $fn.getCodeMsg('comm.title.subject'), // 제목
                            click :	function(view,data, ele){
                                return false;
                            },
                            width: 'auto',
                            sort: false,
                            css: 'subject-cell'
                        },
                        period: {
                            name: '_period',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h141'), // 기간 및 일수
                            sort: false,
                            width: '180px',
                            css: 'auth-cell',
                            click: function (obj, o, view) {
                                //_$$.aprv.viewfun.opendocument(o, _opt);
                                //_$$.aprv.viewfun.opendocument(o, view);
                            }
                        },   
                        user: {
                            name: '_userHTML',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h143'), // 신청자
                            sort: false,
                            width: '70px',
                            css: 'auth-cell'
                        },                                     
                        totalamount: {
                            name: '_totalamount',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h137'), // 금액
                            sort: false,
                            width: '70px',
                            css: 'right',
                            click: function (obj, o, view) {
                                //_$$.aprv.viewfun.opendocument(o, _opt);
                                //_$$.aprv.viewfun.opendocument(o, view);
                            }
                        },
                        attach: {
                            name: '_attach',
                            type: 'file',
                            title: '',
                            width: '18px',
                            sort: false,
                            css: 'file-cell'
                        },
                        procdate: {
                            name: '_procdate',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h143'), // 신청자
                            width: '100px',
                            sort: false
                        }, 
                        qrocdate: {
                            name: '_qrocdate',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h172'), // 송금예정일자
                            width: '100px',
                            sort: false
                        },                        
                        pprocdate: {
                            name: '_procdate',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h143'), // 신청자
                            width: '100px',
                            sort: false,
                            click :	function(view,data, ele){

                                _$$.bt_complete.view._poptrclickcustom(view,data, ele);
                            }
                        }, 
                        pprocdate_no: {
                            name: '_procdate',
                            type: 'text',
                            title: $fn.getCodeMsg('aprv_01.title.h143'), // 신청자
                            width: '100px',
                            sort: false,
                            click :	function(view,data, ele){
                                return false;
                            }
                        },
                        payyyyymm: {
                            name: '_payyyyymm',
                            type: 'text',
                            title: '증빙일자(년월)', // 제목
                            width: '100px',
                            sort: false,
                            css: 'subject-cell'
                        },
                        docnum01: {
                            name: '_docnumber01',
                            type: 'text',
                            title: '문서번호', // 제목
                            width: '100px',
                            sort: false,
                            css: 'subject-cell'
                        },
                        total_sum: {
                            name: '_total_all_sumHTML',
                            type: 'text',
                            title: '총금액', // 제목
                            width: '100px',
                            sort: false,
                            css: 'right'
                        },
                        moneytype: {
                            name: '_moneytype',
                            type: 'text',
                            title: '단위', // 제목
                            width: '50px',
                            sort: false,
                            css: 'width-50'
                        },
                        jde_no: {
                            name: '_jde_no',
                            type: 'text',
                            title: '지불처', // 제목
                            width: '200px',
                            sort: false,
                            css: 'left'
                        },
                        paytype: {
                            name: '_ed_a06_Nm',
                            type: 'text',
                            title: '지불수단', // 제목
                            width: '80px',
                            sort: false,
                            css: 'center'
                        },
                        koreamoney: {
                            name: '_kor_money',
                            type: 'text',
                            title: '원화금액', // 원화금액
                            width: '100px',
                            sort: false,
                            css: 'right'
                        },
                        batchnum: {
                            name: '_batchnum',
                            type: 'text',
                            title: '배치번호', // 배치번호 **************
                            width: '170px',
                            sort: false,
                            css: 'center',
                            click :	function(o , view ){
                                console.log("=================================");
                                console.log("view : ", view);
                                console.log("o : ",o);
                                //console.log("obj : ", obj);
                                console.log("=================================");
                                //alert(view._openurl);
                                //_me._popAprdocCust(_opt);

                                //_$$.bt_complete.view._popAprDoc();
                                //_$$.bt_complete.view._poptrclickcustom(view,data, ele);
                                //http://gw.densokorea.com/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=/dwp/aprv/com/bt_complete.nsf/wviwlist232y/49258490002A2D834925851C0016D1E6?opendocument%26popup=1
                            }
                        } ,
                        batchnumurl: {
                            name: '_openurl',
                            type: 'text',
                            title: '배치번호', // 배치번호 **************
                            width: '10px',
                            sort: false,
                            css: 'center'
                        } ,
                        balsaengnum: {
                            name: '_balsaengnum',
                            type: 'text',
                            title: '발생분', // 발생분 배치번호
                            width: '80px',
                            sort: false,
                            css: 'center'
                        } ,
                        jungleenum: {
                            name: '_jungleenum',
                            type: 'text',
                            title: '정리분', // 정리분 배치번호
                            width: '80px',
                            sort: false,
                            css: 'center'
                        } ,
                        balsaengnumlink: {
                            name: '_balsaengnum',
                            type : 'fnc',
                            title: '발생분', // 발생분 배치번호
                            width: '80px',
                            sort: false,
                            css: 'center',
                            content: function (obj) {                            
                                var tval = ''
                                console.log(obj['_balsaengnum']);

                                tval = obj['_balsaengnum'].split('^');

                                tval = '<div class="dwp-center dwp-cursor">' + tval[0] + '</div>';
                                    //tval = tval[1]
                                return tval;
                            },
                            click : function(view,o, ele){
                                var tval = ''
                                tval = o['_balsaengnum'].split('^');

                                //_$$.resoladmin07.view._readForm(view,o["@unid"], ele,_opt);
                                //_$$.bt_complete.view._poptrclickdocument(view,o, ele , );

                                if ( tval[1] != "") {
                                    _$$.bt_complete.view._poptrclickdocument(view,o, ele,tval[1]);
                                }

                            },
                            category : '',
                            reply : true,
                            isnew : true
                            /*
                            ,title : '대책서1'
                            ,sortno : 3
                            ,content: function (obj) {                            

                                    var tval = ''
                                    
                                
                                        tval = obj['_solution1'].split('^');
                                
                                        tval = '<div class="dwp-center">' + tval[0] + '</div>';
                                        //tval = tval[1]
                                    return tval;
                                }	
                            ,click : function(view,o, ele){
                                //_$$.resoladmin07.view._readForm(view,o["@unid"], ele,_opt);
                                _$$.meeting_2.view._poptrclickdept(view,o, ele);
                            } 
                            ,category : ''
                            ,reply : true
                            ,isnew : true                            
                            */
                        } ,
                        jungleenumlink: {
                            name: '_jungleenum',
                            type: 'fnc',
                            title: '정리분', // 발생분 배치번호
                            width: '80px',
                            sort: false,
                            css: 'center',
                            content: function (obj) {                            
                                var tval = ''
                                tval = obj['_jungleenum'].split('^');
                                tval = '<div class="dwp-center dwp-cursor">' + tval[0] + '</div>';
                                    //tval = tval[1]
                                return tval;
                            },
                            click : function(view,o, ele ){
                                //_$$.resoladmin07.view._readForm(view,o["@unid"], ele,_opt);
                                var tval = ''
                                tval = o['_jungleenum'].split('^');

                                if ( tval[1] != "") {
                                    _$$.bt_complete.view._poptrclickdocument(view,o, ele,tval[1]);
                                }

                                
                            },
                            category : '',
                            reply : true,
                            isnew : true
                            /*
                            ,title : '대책서1'
                            ,sortno : 3
                            ,content: function (obj) {                            

                                    var tval = ''
                                    
                                
                                        tval = obj['_solution1'].split('^');
                                
                                        tval = '<div class="dwp-center">' + tval[0] + '</div>';
                                        //tval = tval[1]
                                    return tval;
                                }	
                            ,click : function(view,o, ele){
                                //_$$.resoladmin07.view._readForm(view,o["@unid"], ele,_opt);
                                _$$.meeting_2.view._poptrclickdept(view,o, ele);
                            } 
                            ,category : ''
                            ,reply : true
                            ,isnew : true                            
                            */
                        } ,
                        pbalsaengnum: {
                            name: '_balsaengnum',
                            type: 'text',
                            title: '발생분', // 발생분 배치번호
                            width: '80px',
                            sort: false,
                            css: 'center',
                            click :	function(view,data, ele){

                                _$$.bt_complete.view._poptrclickcustom(view,data, ele);
                            }
                        } ,
                        pbalsaengnum_no: {
                            name: '_balsaengnum',
                            type: 'text',
                            title: '발생분', // 발생분 배치번호
                            width: '80px',
                            sort: false,
                            css: 'center',
                            click :	function(view,data, ele){

                                return false;
                            }
                        } ,
                        pjungleenum: {
                            name: '_jungleenum',
                            type: 'text',
                            title: '정리분', // 정리분 배치번호
                            width: '80px',
                            sort: false,
                            css: 'center',
                            click :	function(view,data, ele){

                                _$$.bt_complete.view._poptrclickcustom(view,data, ele);
                            }
                        },
                        pjungleenum_no: {
                            name: '_jungleenum',
                            type: 'text',
                            title: '정리분', // 정리분 배치번호
                            width: '80px',
                            sort: false,
                            css: 'center',
                            click :	function(view,data, ele){

                                return false;
                            }
                        }     
   


                    },
                    _hList = {                        
                        wviwlist011: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'authordept',
                                'docnum01',
                                'author',
                                'user',
                                'period',
                                'procdate', 
                                'totalamount',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h143'),
                                    key: 'procdate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlist021: {
                            //sortnm: '_sreceivedate',
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [
                                'startdate',
                                'scompletedate',
                                'authordept',
                                'docnum01',
                                'author',
                                'user',
                                'period',
                                'procdate', 
                                'totalamount',
                                'balsaengnumlink',
                                'jungleenumlink',
                                'subject'                                  
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h143'),
                                    key: 'ProcDate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },                                
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlist196n: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'authordept',
                                'author',
                                'docnum01',
                                'procdate',
                                'qrocdate',
                                'paytype',
                                'jde_no',
                                'moneytype',
                                'total_sum',
                                'koreamoney',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h143'),
                                    key: 'procdate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlist196y: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'authordept',
                                'author',
                                'docnum01',
                                'procdate',
                                'qrocdate',
                                'paytype',
                                'jde_no',
                                'moneytype',
                                'total_sum',
                                'koreamoney',
                                'balsaengnumlink',
                                'jungleenumlink',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h143'),
                                    key: 'procdate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlist224n: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'docnum01',
                                'procdate',
                                'qrocdate',
                                'total_sum',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h143'),
                                    key: 'procdate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlist224y: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'docnum01',
                                'procdate',
                                'qrocdate',
                                'total_sum',
                                'balsaengnumlink',
                                'jungleenumlink',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h143'),
                                    key: 'procdate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlist225n: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'docnum01',
                                'procdate',
                                'qrocdate',
                                'total_sum',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h143'),
                                    key: 'procdate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlist225y: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'docnum01',
                                'procdate',
                                'qrocdate',
                                'total_sum',
                                'balsaengnumlink',
                                'jungleenumlink',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h143'),
                                    key: 'ProcDate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlist226n: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'procdate',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlist226y: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'procdate',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlist229n: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'procdate',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'AuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlist229y: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'procdate',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'AuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlist231n: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'procdate',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'AuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlist231y: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'procdate',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'AuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlist232y: {
                            sortnm: '_startdate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'startdate',
                                'scompletedate',
                                'author',
                                'authordept',
                                'batchnum',
                                'subject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h007'),
                                    key: 'sStartDate',
                                    type:"date"
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'AuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlistalljibul: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: false,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'pstartdate',
                                'pscompletedate',
                                'pauthor',
                                'pauthordept',
                                'pprocdate',
                                'pbalsaengnum',
                                'pjungleenum',
                                'psubject'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'AuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlistalljibul_multi: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'pstartdate_no',
                                'pscompletedate_no',
                                'pauthor_no',
                                'pauthordept_no',
                                'pprocdate_no',
                                'pbalsaengnum_no',
                                'pjungleenum_no',
                                'psubject_no'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlistalljibul_01: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'pstartdate_no',
                                'pscompletedate_no',
                                'pauthor_no',
                                'pauthordept_no',
                                'pprocdate_no',
                                'pbalsaengnum_no',
                                'pjungleenum_no',
                                'psubject_no'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlistalljibul_02: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'pstartdate_no',
                                'pscompletedate_no',
                                'pauthor_no',
                                'pauthordept_no',
                                'pprocdate_no',
                                'pbalsaengnum_no',
                                'pjungleenum_no',
                                'psubject_no'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
                        wviwlistalljibul_03: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'pstartdate_no',
                                'pscompletedate_no',
                                'pauthor_no',
                                'pauthordept_no',
                                'pprocdate_no',
                                'pbalsaengnum_no',
                                'pjungleenum_no',
                                'psubject_no'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
                            //,click : function(){}
                        },
						wviwlistalljibul_multi01: {
                            sortnm: '_ssenddate',
                            sortorder: 'descending',
                            checkbox: true,
                            formalias: 'wFrmApprove',
                            isnew: '', //{basedate:'_startdate'}
                            isreply: false,
                            category: _cate,
                            css: 'dwp-aprv-list',
                            colnm: [                                
                                'pstartdate_no',
                                'pscompletedate_no',
                                'pauthor_no',
                                'pauthordept_no',
                                'pprocdate_no',
                                'pbalsaengnum_no',
                                'pjungleenum_no',
                                'psubject_no'                                
                            ],
                            search: [
                                {
                                    title: $fn.getCodeMsg('comm.data.org_stype.0'),
                                    key: 'all'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h010'),
                                    key: 'sReqAuthorName'
                                },
                                {
                                    title: $fn.getCodeMsg('comm.title.subject'),
                                    key: 'Subject'
                                },
                                {
                                    title: $fn.getCodeMsg('aprv_01.title.h049'),
                                    key: 'Body'
                                }
                            ] // 전체 , 제목
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
            ,_popAprdocCust : function (_opt) {				
                //alert("TTTTT");
                //alert(_opt.header.col.batchnumurl);
            }    
            //팝업창에서 선택된 번호를 이용한 팝업 문서 보기
			, _poptrclickdocument : function (view,data,ele , _dockey) {				
                var __dlg = $("#"+ele.options.did), _inst = __dlg.xdialog("instance");						
                
                //var _Sol1 = data._solution1;					                
                //_Sol1=_Sol1.split("^")
                if ( _dockey == "" ) {
                    return;
                }
				var _rptDailog = $fn.dialog(null, {
                    modal: true,
                    resizable: false,
                    draggable: true,
                    islangconvert: false,
                    referdata: el,
                    title: "문서보기",
                    width: 1500,
                    height: 900,
                    show: 'fade', //effect
                    hide: 'fade', //effect
                    langpath: $fn.getPath("weblib") + "/lang/" + $fn.getCurUser().lang + "/aprv_sub_160.lang.js",
                    content: {
                        html: "",
                        //url : "/dwp/aprv/com/customer/wFrmPopView?ReadForm&view=w_pop_customer"
                        //url: "dwp/aprv/com/qc.nsf/wMeetingView/"+"4925849B0036DA7C4925849D00239DED"+"?opendocument"
                        //url:"/dwp/aprv/com/bt_copmplete.nsf/0/"+_Sol1[1]+"?opendocument"
                        url:"/dwp/aprv/com/bt_complete.nsf/0/"+_dockey+"?opendocument"
                        //														, data : {view : _view
                    ,
                        count: 15
                    },
                        close: function () { //2017.01.19

                    }
                });							
			}

            //팝업창에서 거래처 조회에서 TR 클릭시 수행.
			,_poptrclickcustom : function (view,data,ele) {				
				var __dlg = $("#"+ele.options.did), _inst = __dlg.xdialog("instance");
				var _opt = _inst.options.referdata;				
				var _aprdoc = _opt.aprdoc;
				var _tr = _opt.tr;

				//선택된 필드 값을 지정하기 위한 필드 
				// 팝업 양식이 옵션으로 쿼리스티링 필드 참조
				var _selected_field = ele.options.selected_field
				


				//var _customcode = $.isArray(data._pcustomercode) ? data._paccountcode[0]:data._pusernum;
				///var _customname = $.isArray(data._pcustomer) ? data._paccount[0]:data._pvalue;				
				var _customnum = data._pusernum;
				var _customname = data._pvalue;	
				var _customcode = data._code;				
				var _customcodename = data._code + " / " + data._pvalue;				
								
				//var _captin = $.isArray(data._prepresentative) ? data._prepresentative[0]:data._prepresentative;	//대표자
				//var _charge = $.isArray(data._pcharge) ? data._pcharge[0]:data._pcharge;							//담당자
				//var _bank = $.isArray(data._pbank) ? data._bank[0]:data._pbank;										//은행
				//var _actnum = $.isArray(data._paccountnum) ? data._paccountnum[0]:data._paccountnum;				//계좌
				//var _hp = $.isArray(data._php) ? data._php[0]:data._php;											//HP
				/*
				 _prepresentative,_pcharge,_bank,_paccountnum,_php
				 */

                //alert(data._subject);
                //alert( _selected_field );

                var _$customer = $("[name='_REQCOUNT']",_tr);	
                _$customer.xval(data._subject);

                var _$customer1 = $("[name='_REQCOUNT1']",_tr);	
                _$customer1.xval(data._docunid);

                var _$customer2 = $("[name='_REQCOUNT2']",_tr);	
                _$customer2.xval(data._dockey);

                var _$customersubject = $("[name='_REQSUBJECT']",_tr);	
                var usrLang = $dwp.core.lang.getLang();
                var valueformalias = $dwp.core.lang.getCurMsg(data._sformtitle,";",usrLang);
                _$customersubject.xval(valueformalias);

                var _$customerauthor = $("[name='_REQAUTHOR']",_tr);	
                var usrLang = $dwp.core.lang.getLang();
                var valueauthor = $dwp.core.lang.getCurMsg(data._author,";",usrLang);
                _$customerauthor.xval(valueauthor);

                
                //var _$customerinfo = $("[name='_CUSTOMER_INFO']",_tr);	
                //거리쳐코드¶거래처명¶대표자¶담당자¶은행¶계좌번호¶HP
                //_$customerinfo.xval(_customcode+"¶"+_customname+"¶"+_captin+"¶"+_charge+"¶"+_bank+"¶"+_actnum+"¶"+_hp);
                //거리쳐코드¶거래처명
                //_$customerinfo.xval(_customcode+"¶"+_customname);				
                _inst.close();

                /*
				if ( _selected_field == "" ) {
					var _$customer = $("[name='jde_no']",_aprdoc);	
					_$customer.xval(_customcodename);

					var _$customerdata = $("[name='jde_custcode']",_aprdoc);	
					_$customerdata.xval(_customcode);

					var _$customerdata = $("[name='jde_custdata']",_aprdoc);	
					_$customerdata.xval(_customnum);
					
					var _$customer1 = $("[name='_jde_no']",_tr);	
					_$customer1.xval(_customcodename);
					//var _$customerinfo = $("[name='_CUSTOMER_INFO']",_tr);	
					//거리쳐코드¶거래처명¶대표자¶담당자¶은행¶계좌번호¶HP
					//_$customerinfo.xval(_customcode+"¶"+_customname+"¶"+_captin+"¶"+_charge+"¶"+_bank+"¶"+_actnum+"¶"+_hp);
					//거리쳐코드¶거래처명
					//_$customerinfo.xval(_customcode+"¶"+_customname);				
					_inst.close();

				} else if ( _selected_field == "customernew") {
					var _$customer = $("[name='_CUSTOMERNEW']",_tr);	
					_$customer.xval(_customname);		
					var _$customerinfo = $("[name='_CUSTOMERNEW_INFO']",_tr);	
					//거리쳐코드¶거래처명¶대표자¶담당자¶은행¶계좌번호¶HP
					//_$customerinfo.xval(_customcode+"¶"+_customname+"¶"+_captin+"¶"+_charge+"¶"+_bank+"¶"+_actnum+"¶"+_hp);
					//거리쳐코드¶거래처명
					_$customerinfo.xval(_customcode+"¶"+_customname);
					_inst.close();	
				}
				*/
			}
        }
    };
})($dwp.cns('app'), jQuery);

















