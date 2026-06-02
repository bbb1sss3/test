/**
 * <b>Lang 라이브러리</b>
 * <br>언어처리를 위한 함수를 정의합니다.
 * @module core/lang
 * @copyright   TCCINS
 * @see {@link module:core~$dwp.core.lang|core.lang}    
 */
(function( /** @lends   module:core~$dwp.core */ _$$, $) {
    /**
     * 언어처리 모듈
     * @namespace
     */
    _$$.lang = {
        _CONST: {
            M_SPLIT: "`}",
            D_SPLIT: "/"
        }
        /**
         * 언어정보를 담고 있는 객체
         * @property    {object}
         */
        ,
        _DIC: {}

        // User Profile에 언어정보 설정
        ,
        setUserLang: function() {

            }
            /**
             * 언어정보을 설정합니다.
             * DWP_LANG 쿠기정보사용
             */
            ,
        setLang: function() {
                var _lang = this.getUserLang();
                _lang = (_lang == "" ? this.getDefaultLang() : _lang);

                if ($dwp.core.util.getDeviceInfo.type() != "PC" && typeof dwpmo != "undefined") {
                    dwpmo.util.SetCookie(dwpmo.info.domain, "DWP_LANG", _lang);
                } else {
                    $.cookie('DWP_LANG', null, { expires: -1, path: '/' });
                    $.cookie('DWP_LANG', _lang, { expires: 7, path: '/' });
                }
            }
            /**
             * 현재 언어설정정보를 가져옵니다.
             * DWP_LANG 쿠기정보사용
             */
            ,
        getLang: function() {
                return ($.cookie('DWP_LANG') != null ? $.cookie('DWP_LANG') : this.getUserLang() != "" ? this.getUserLang() : this.getDefaultLang());
            }
            // User Profile에 언어정보 가져오기
            /**
             * 현재 언어설정정보를 가져옵니다.
             * 1. DWP_LANG 쿠기정보
             * 2. 사용자설정보
             */
            ,
        getUserLang: function() {
                var _me = this;
                if ($dwp.core.util.getDeviceInfo.type() != "PC" && typeof dwpmo != "undefined") {
                    return (localStorage.getItem('DWP_LANG') != "null" ? localStorage.getItem('DWP_LANG') : "en");
                } else {
                    var _blang = navigator.language || navigator.userLanguage;
                    if (_blang.indexOf("-") > -1) {
                        _blang = _blang.split("-")[0];
                    }
                    if ($dwp.core.getCurUser() != null) {
                        if ($dwp.core.getCurUser().pinfo.envinfo.lang != "") {
                            _blang = $dwp.core.getCurUser().pinfo.envinfo.lang;
                        }
                    }

                    return ($.cookie('userLang') != null ? $.cookie('userLang') : $.cookie('DWP_LANG') != null ? $.cookie('DWP_LANG') : _blang);
                }
                //return $dwp.core.getInfo("cuser.lang");
            }
            /**
             * 기본언어 설정값을 가져옵니다.
             */
            ,
        getDefaultLang: function() {
            return "en";
        }

        /**
         * 입력한 메세지정보 대한 언어설정값을 가져옵니다.
         * @param   {string|object}     obj         메세지 정보( string인 경우는 메세지 코드 - 언어코드는 사용자설정언어 정보를 사용함 )
         * @param   {string}            obj.lang    언어 code
         * @param   {string}            obj.code    메세지 code
         * @return  {object}
         */
        ,
        getCodeMsg: function(obj) {
                var _me = this,
                    _code = "",
                    _lang = "",
                    _obj = $.extend({ lang: this.getUserLang() }, obj);

                if (typeof(obj) == "undefined" || !obj) return "";

                if (typeof obj == "object") {
                    _code = obj.code;
                    _lang = obj.lang;
                } else if (typeof obj == "string") {
                    _code = obj;
                    _lang = this.getUserLang();
                }

                var _get = function(code) {
                    var cd = code.replace(/^$.xlang\._DIC\.|^_DIC\.|\'\]|\"\]/, "").replace(/(\[\"|\[\')/, ".").split('.');
                    var _dic = _me._DIC;
                    for (var i = 0, j = cd.length; i < j; i++) {
                        if (typeof _dic[cd[i]] == "undefined") {
                            return code;
                        } else {
                            _dic = _dic[cd[i]];
                        }
                    }
                    return _dic;
                };

                return _get(_code);
            }
            /**
             * 코드DB로 부터 코드에 해당하는 메세지정보를 가져옵니다.
             * @param   {string}    pcode   APP Code
             * @param   {string}    code    Code
             * @return  {string}    코드값이 존재하지 않을 경우 pcode.code 형태로 리턴합니다. 
             */
            ,
        getCodeData: function(pcode, code) {
            var _me = this,
                _row = _me._getCodeData(pcode);

            if (typeof code == "undefined") {
                return _row;
            }

            if (_row.hasOwnProperty(code)) {
                return _me.getCurMsg(_row[code]);
            }
            return pcode + "." + code;
        },
        getCodeObjMsg: function(code, v) {
                var _me = this,
                    _data = _me.getCodeMsg(code);
                return _data[v];
            }
            /**
             * 언어셋 정보로부터 현재언어에 해당하는 메세지를 리턴함.
             * @param   {string}    str     언어셋 정보 (기본 ko:한국,en:korea, 다중 ko:한국,en:korea`}ko:사람,en:people)
             * @param   {string}    sp      구분자 (다중 언어셋인 경우 : 한국 /사람)
             * @param   {string}    lang    설정언어(기본은 브라우저기본)
             * @return  {string}
             */
            ,
        getCurMsg: function(str, sp, lang) {
                var _me = this;

                if (typeof(str) == "undefined" || str == "") return "";
                if (typeof(str) == "number") return str + "";

                var _lang = lang || _me.getUserLang(),
                    _langObj = {},
                    _strlist = str.split(_me._CONST.M_SPLIT);

                _langObj = _me._getMergeLangObj(str, sp);
                /*
                ,_sp = (typeof sp != "undefined") ? sp : _me._CONST.D_SPLIT
                ,_strlist = str.split(_me._CONST.M_SPLIT);
                            
                if ( $dwp.core.getSysinfo() != null ) {
                    if ( $dwp.core.getSysinfo().hasOwnProperty("lang_code") ) {
                        for(el in $dwp.core.getSysinfo().lang_code) {
                            _langObj[el] = "";
                        }
                    } else {
                        _langObj = {"en" : "", "hu" : "", "in" : "", "ko" : "", "zh" : ""};
                    }
                } else {
                    _langObj = {"en" : "", "hu" : "", "in" : "", "ko" : "", "zh" : ""};
                }
            
                function _merge(o) {
                    for ( el in _langObj ) {
                        if ( o.hasOwnProperty(el)) {
                            _langObj[el] = ( _langObj[el] == "" ? o[el] : _langObj[el] + _sp + o[el] );
                        } else {
                            if ( o.hasOwnProperty(_me.getDefaultLang()) ) {
                                _langObj[el] = ( _langObj[el] == "" ? o[_me.getDefaultLang()] : _langObj[el] + _sp + o[_me.getDefaultLang()]);
                            } else {
                                if ( Object.keys(o).length > 0 ) {
                                    _langObj[el] = ( _langObj[el] == "" ? o[Object.keys(o)[0]] : _langObj[el] + _sp + o[Object.keys(o)[0]]);
                                }
                            }
                        }
                    }               
                }
            
                $.each(_strlist, function(i, v){
                    _merge(_me.strToObj(v));
                });
                */

                if (!_langObj.hasOwnProperty(_lang)) {
                    if (!_langObj.hasOwnProperty(_me.getDefaultLang())) {
                        if (Object.keys(_langObj).length > 0 && _langObj[Object.keys(_langObj)[0]] != "") {
                            return _langObj[Object.keys(_langObj)[0]]
                        } else {
                            return str;
                        }
                    } else {
                        if (_langObj[_me.getDefaultLang()] == "") {
                            return str;
                        } else {
                            return _langObj[_me.getDefaultLang()];
                        }
                    }
                } else {
                    if (_langObj[_lang] == "") {
                        var _v = _me.strToObj(_strlist[0]);
                        if ($.isEmptyObject(_v)) {
                            return str;
                        } else {
                            return "";
                        }
                        //return str;
                    } else {
                        return _langObj[_lang];
                    }
                }

            }
            /**
             * 언어셋 문자열 정보로부터 Merge한 JSON Object 리턴함.
             * @param   {string}    str     언어셋 정보 (기본 ko:한국,en:korea, 다중 ko:한국,en:korea`}ko:사람,en:people)
             * @param   {string}    sp      구분자 (다중 언어셋인 경우 : 한국 /사람)
             * @return  {object}
             */
            ,
        _getMergeLangObj: function(str, sp) {
                var _me = this,
                    _langObj = {},
                    _sp = "",
                    _strlist = [];

                if (typeof(str) == "undefined" || str == "") return {};

                _sp = (typeof sp != "undefined") ? sp : _me._CONST.D_SPLIT
                _strlist = str.split(_me._CONST.M_SPLIT);

                if ($dwp.core.getSysinfo() != null) {
                    if ($dwp.core.getSysinfo().hasOwnProperty("lang_code")) {
                        for (el in $dwp.core.getSysinfo().lang_code) {
                            _langObj[el] = "";
                        }
                    } else {
                        _langObj = { "en": "", "hu": "", "in": "", "ko": "", "zh": "" };
                    }
                } else {
                    _langObj = { "en": "", "hu": "", "in": "", "ko": "", "zh": "" };
                }

                function _merge(o) {
                    for (el in _langObj) {
                        if (o.hasOwnProperty(el)) {
                            _langObj[el] = (_langObj[el] == "" ? o[el] : _langObj[el] + _sp + o[el]);
                        } else {
                            if (o.hasOwnProperty(_me.getDefaultLang())) {
                                _langObj[el] = (_langObj[el] == "" ? o[_me.getDefaultLang()] : _langObj[el] + _sp + o[_me.getDefaultLang()]);
                            } else {
                                if (Object.keys(o).length > 0) {
                                    _langObj[el] = (_langObj[el] == "" ? o[Object.keys(o)[0]] : _langObj[el] + _sp + o[Object.keys(o)[0]]);
                                }
                            }
                        }
                    }
                }

                $.each(_strlist, function(i, v) {
                    _merge(_me.strToObj(v));
                });
                //console.log("Merge", _langObj);
                return _langObj;
            }
            /**
             * 언어셋 문자열 정보로부터 Merge한 언어셋 문자열 리턴함.
             * @param   {string}    str     언어셋 정보 (기본 ko:한국,en:korea, 다중 ko:한국,en:korea`}ko:사람,en:people)
             * @param   {string}    sp      구분자 (다중 언어셋인 경우 : 한국 /사람)
             * @return  {string}
             */
            ,
        getMergeLangStr: function(str, sp) {
                var _me = this,
                    _langObj = {},
                    _rtn = "";

                _langObj = _me._getMergeLangObj(str, sp);

                if ($.isEmptyObject(_langObj)) return _rtn;

                for (nm in _langObj) {
                    if (_rtn == "") {
                        _rtn = nm + ":" + _langObj[nm];
                    } else {
                        _rtn = _rtn + "," + nm + ":" + _langObj[nm];
                    }
                }
                return _rtn;
            }
            /**
             * html에 data-xlang 속성이 정의되어 있는 tag에 대한 언어변환 처리를 수행합니다.
             * @param   {object}    opt         옵션 
             * @param   {string=}   opt.url     언어JS파일 URL
             * @param   {boolean}   opt.isedit  편집모드여부(기본은 true)
             * @param   {object}    opt.except  제외해야할 영역에 대한 query selector
             * @param   {object=}   el          변환대상 jquery object 
             */
            ,
        convert: function(opt, el) {
            var _me = this,
                _opt = $.extend({}, opt);
            if (typeof _opt.url != "undefined" && _opt.url != "") {
                /*
                $LAB
                .setOptions({AlwaysPreserveOrder:true})
                .script(_opt.url)
                .wait(function() {
                    _me._convert(_opt, el);
                });
                */
                //console.log("url", _opt.url);
                $dwp.core.util.xAjax({
                        url: _opt.url,
                        async: false,
                        cache: true,
                        dataType: "script"
                    })
                    .done(function(d) {
                        console.log("Lang", el);
                        _me._convert(_opt, el);
                        console.log("Lang", el);
                        $dwp.core.util.xTrigger(el, "LangComplete", el);
                    });
            } else {
                console.log("Lang11", el);
                _me._convert(_opt, el);
                $dwp.core.util.xTrigger(el, "LangComplete", el);
            }
        }

        ,
        _convert: function(opt, el) {
            var _me = this,
                _$el = el || $dwp.core.getContent(),
                _type = "",
                _opt = $.extend({ isedit: true, except: "" }, opt);
            //console.log("ddd", _$el);
            $("[data-xlang^='LC_']", _$el).each(function() {
                if (_opt.except != "" && $(_opt.except, _$el).size() > 0 && $.contains($(_opt.except, _$el).get(0), this)) { return true; }
                _type = $(this).attr("data-xlang");
                switch (_type) {
                    case "LC_STR":
                        //var _split = $(this).is("[data-xlang-split]") ? $(this).attr("data-xlang-split") : _me._CONST.D_SPLIT;
                        //$(this).html(_me.getCurMsg($(this).attr("data-xlang-txt"), _split));
                        _me._convertSTR(this, _opt);
                        break;
                    case "LC_TEXT":
                        _me._convertText(this, _opt);
                        //$(this).html(_me.getCodeMsg($(this).attr("data-xlang-code")));
                        break;
                    case "LC_CODE":
                        _me._convertCode(this, _opt);
                        break;
                    case "LC_TREE":
                        _me._convertTree(this, _opt);
                        break;
                    case "LC_TIME":
                        _me._convertTime(this);
                        break;
                    case "LC_TZONE":
                        _me._convertTimeZone(this, _opt);
                        break;
                    default:
                        $(this).html(_me.getCodeMsg($(this).attr("data-xlang-code")));
                        break;
                }
            });
        },
        _getComArray: function(opt) {
                var _rows = [],
                    _data = [],
                    _opt = $.extend({ site: "" }, opt),
                    _sysinfo = $dwp.core.getSysinfo();

                function _jsonGetParmData() {
                    var _url = _$$.getPath("org") + "/api/data/collections/name/vViewCom?count=999";
                    return {
                        url: $fn.getProxyUrl(_url),
                        dataType: "json",
                        async: false,
                        cache: false,
                        data: {}
                    };
                };
                if (!_sysinfo.hasOwnProperty("_company")) {
                    $fn.xAjax(_jsonGetParmData())
                        .done(function(jdata) {
                            //$(jdata).each(function(i, data){
                            //var _comcategory = ( data._orgcode == '100001' ? 'scg' : data._comcategory == 'SCG' ? "scggrp" : "center");
                            //if (_opt.site != "" && _opt.site.indexOf(_comcategory) == -1  ) { return true;}

                            //});
                            _data = jdata;
                        });
                    _sysinfo._company = _data;
                }

                $(_sysinfo._company).each(function(i, data) {
                    var _comcategory = (data._orgcode == '100001' ? 'scg' : data._comcategory == 'SCG' ? "scggrp" : "center");
                    if (_opt.site != "" && _opt.site.indexOf(_comcategory) == -1) { return true; }
                    var _row = {};
                    _row[data._orgcode] = data._orgname;
                    _rows.push(_row);
                });
                /*
                if (!_sysinfo.hasOwnProperty("company")) {
                    $fn.xAjax(_jsonGetParmData())
                    .done(function(jdata){
                        $(jdata).each(function(i, data){
                            var _row = {};
                            _row[data._orgcode] = data._orgname;
                            _rows.push(_row);
                        });
                    });
                    _sysinfo.company = _rows;
                }
                */
                //return _sysinfo.company;
                return _rows;
            }
            //부문정보 가져오기 - 2017.10.25 by dwlee
            ,
        _getHdArray: function() {
            var _rows = [],
                _sysinfo = $dwp.core.getSysinfo();

            function _jsonGetParmData() {
                var _url = _$$.getPath("org") + "/api/data/collections/name/vViewHd?count=999";
                return {
                    url: $fn.getProxyUrl(_url),
                    dataType: "json",
                    async: false,
                    cache: false,
                    data: {}
                };
            };

            if (!_sysinfo.hasOwnProperty("headdept")) {
                $fn.xAjax(_jsonGetParmData())
                    .done(function(jdata) {
                        $(jdata).each(function(i, data) {
                            var _row = {};
                            _row[data._orgcode] = data._orgname;
                            _rows.push(_row);
                        });
                    });
                _sysinfo.headdept = _rows;
            }
            return _sysinfo.headdept;
        }

        ,
        _getComData: function(code) {
            var _row = {},
                _data = [],
                _rows = [],
                _sysinfo = $dwp.core.getSysinfo();

            function _jsonGetParmData() {
                var _url = _$$.getPath("org") + "/api/data/collections/name/vViewCom?count=999";
                return {
                    url: $fn.getProxyUrl(_url),
                    dataType: "json",
                    async: false,
                    cache: false,
                    data: {}
                };
            };

            if (!_sysinfo.hasOwnProperty("_company")) {
                $fn.xAjax(_jsonGetParmData())
                    .done(function(jdata) {
                        _data = jdata;
                    });
                _sysinfo._company = _data;
            }

            $(_sysinfo._company).each(function(i, data) {
                var _row = {};
                _row[data._orgcode] = data._orgname;
                _rows.push(_row);
            });

            $.each(_rows, function(i, p) {
                var key = Object.keys(p)[0];
                if (key == code) {
                    _row = p;
                }
            });
            /*
            if (!_sysinfo.hasOwnProperty("company")) {
                var _rows = [];
                $fn.xAjax(_jsonGetParmData())
                .done(function(jdata){
                    $(jdata).each(function(i, data){
                        var _row = {};
                        _row[data._orgcode] = data._orgname;
                        _rows.push(_row);
                    });
                });
                _sysinfo.company = _rows;
            }
            
            $.each(_sysinfo.company, function(i, p) {
                var key = Object.keys(p)[0];
                if (key == code) {
                    _row = p; 
                }
            });
            */
            return _row;
        }

        ,
        _geSiteData: function() {
                var _row = {},
                    _sysinfo = $dwp.core.getSysinfo(),
                    _siteinfo = _sysinfo.siteinfo;

                if ($.isEmptyObject(_siteinfo)) return _row;

                for (site in _siteinfo) {
                    var _site = _siteinfo[site];
                    if (_site != "") {
                        var _vs = _site.split(",");
                        $.each(_vs, function(i, o) {
                            var _o = $.trim(o);
                            _row[_o] = _o;
                        });
                    }
                }
                /*
                var _site = _sysinfo.siteinfo.split(",");

                $.each(_site, function(i, v){
                    var _v = $.trim(v);
                    _row[_v] = _v;
                });
                */
                return _row;
            }
            //부문정보 가져오기 - 2017.10.25 by dwlee
            ,
        _getHdData: function(code) {
            var _row = {},
                _sysinfo = $dwp.core.getSysinfo();

            function _jsonGetParmData() {
                var _url = _$$.getPath("org") + "/api/data/collections/name/vViewHd?count=999";
                return {
                    url: $fn.getProxyUrl(_url),
                    dataType: "json",
                    async: false,
                    cache: false,
                    data: {}
                };
            };

            if (!_sysinfo.hasOwnProperty("headdept")) {
                var _rows = [];
                $fn.xAjax(_jsonGetParmData())
                    .done(function(jdata) {
                        $(jdata).each(function(i, data) {
                            var _row = {};
                            _row[data._orgcode] = data._orgname;
                            _rows.push(_row);
                        });
                    });
                _sysinfo.headdept = _rows;
            }

            $.each(_sysinfo.headdept, function(i, p) {
                var key = Object.keys(p)[0];
                if (key == code) {
                    _row = p;
                }
            });

            return _row;
        },
        _getCodeArray: function(code) {
            var _rows = [];
            var _codelist = code.split(".");
            var _lastcode = (_codelist.length > 2 ? _codelist[2] : "");

            function _jsonGetParmData() {
                //var _key = code.replace(/\./g, "_")
                var _key = _codelist[0] + "_" + _codelist[1],
                    _url = _$$.getPath("code") + "/api/data/collections/name/wviwtree?count=999";
                return {
                    url: $fn.getProxyUrl(_url),
                    dataType: "json",
                    async: false,
                    cache: false,
                    data: { category: _key }
                };
            };
            $fn.xAjax(_jsonGetParmData())
                .done(function(jdata) {
                    $(jdata).each(function(i, data) {
                        var _flag = true;
                        if (data._useflag != "1" || data._code == data._gcode) { _flag = false; }
                        if (_lastcode != "" && _lastcode != data._code) { _flag = false; }
                        if (_flag) {
                            var _row = {};
                            _row[data._code] = data._codenm;
                            _rows.push(_row);
                        }
                    });
                });
            return _rows;
        },
        _getCodeData: function(code) {
            var _row = {}
            var _codelist = code.split(".");
            var _lastcode = (_codelist.length > 2 ? _codelist[2] : "");

            function _jsonGetParmData() {
                //var _key = code.replace(/\./g, "_")
                var _key = _codelist[0] + "_" + _codelist[1],
                    _url = _$$.getPath("code") + "/api/data/collections/name/wviwtree?count=999";
                return {
                    url: $fn.getProxyUrl(_url),
                    dataType: "json",
                    async: false,
                    cache: false,
                    data: { category: _key }
                };
            };
            $fn.xAjax(_jsonGetParmData())
                .done(function(jdata) {
                    $(jdata).each(function(i, data) {
                        var _flag = true;
                        if (data._useflag != "1" || data._code == data._gcode) { _flag = false; }
                        if (_lastcode != "" && _lastcode != data._code) { _flag = false; }
                        if (_flag) {
                            _row[data._code] = data._codenm;
                        }
                    });
                });
            return _row;
        },
        _convertTree: function(el, opt) {
            var _me = this,
                _$el = $(el),
                _src = "LJS",
                _code = "",
                _data = "";

            if (!_$el.is("[data-xlang-code]")) { return; }

        },
        _convertSTR: function(el, opt) {
            var _me = this,
                _$el = $(el),
                _split = _$el.is("[data-xlang-split]") ? _$el.attr("data-xlang-split") : _me._CONST.D_SPLIT,
                _attr = "";

            if (_$el.is("[data-xlang-attr]")) { _attr = _$el.attr("data-xlang-attr"); }

            if (_attr != "") {
                $.each(_attr.split(","), function(i, v) {
                    if (v != "" && _$el.is("[" + v + "]") && _$el.attr(v) != "") {
                        var _attrdata = _$el.attr(v);
                        //_$el.attr(v, _me.getCodeMsg(_attrdata))
                        _$el.attr(v, _me.getCurMsg(_attrdata));
                    }
                });
            } else {

                _$el.html(_me.getCurMsg(_$el.attr("data-xlang-txt"), _split));
            }
        },
        _convertText: function(el, opt) {
            var _me = this,
                _$el = $(el),
                _src = "LJS",
                _attr = "",
                _code = "",
                _data = "";

            if (!_$el.is("[data-xlang-code]") && !_$el.is("[data-xlang-attr]")) { return; }

            if (_$el.is("[data-xlang-src]")) { _src = _$el.attr("data-xlang-src"); }
            if (_$el.is("[data-xlang-attr]")) { _attr = _$el.attr("data-xlang-attr"); }

            if (_$el.is("[data-xlang-code]")) {
                _code = _$el.attr("data-xlang-code");

                if (_src == "LJS") {
                    _data = _me.getCodeMsg(_code);
                    _$el.html(_data);
                } else if (_src == "CDB") {
                    _data = _me._getCodeData(_code);
                    if (typeof _data == "object") {
                        _$el.html(_me.getCurMsg(_data[Object.keys(_data)[0]]));
                    }
                } else if (_src == "COM") {
                    _data = _me._getComData(_code);
                    if (typeof _data == "object") {
                        _$el.html(_me.getCurMsg(_data[Object.keys(_data)[0]]));
                    }
                    //부문정보 추가2017.10.25 by dwlee
                } else if (_src == "HD") {
                    _data = _me._getHdData(_code);
                    if (typeof _data == "object") {
                        _$el.html(_me.getCurMsg(_data[Object.keys(_data)[0]]));
                    }
                } else if (_src == "FNC") {
                    _data = $dwp.core.util.getFunction(_code);
                    _$el.html(_data);
                }
                //_$el.html(_data);
            }

            if (_attr != "") {
                $.each(_attr.split(","), function(i, v) {
                    if (v != "" && _$el.is("[" + v + "]") && _$el.attr(v) != "") {
                        var _attrdata = _$el.attr(v);
                        if (v == "placeholder" && (_$el.val() == _attrdata || _$el.val() == "")) {
                            _$el.val("");
                        }
                        _$el.attr(v, _me.getCodeMsg(_attrdata))
                    }
                });
            }

        },
        _convertCode: function(el, opt) {
            var _me = this,
                _$el = $(el),
                _src = "LJS",
                _code = "",
                _data = null,
                _nm = "",
                _type = "",
                _val = "",
                _disp = "",
                _attr = "",
                _site = "",
                _mode = opt.isedit,
                _txt = "",
                _is_tmp_chkbox = false,
                _$inp, _$inph, _$inphdisp, _$label, _$select, _$wrap, _$opt, _$btn, i = 0;

            if (!_$el.is("[data-xlang-code]")) { return; }
            if (!_$el.is("[data-xlang-name]")) { return; }
            if (!_$el.is("[data-xlang-type]")) { return; }
            if (!_$el.is("[data-xlang-value]")) { return; }

            if (_$el.is("[data-xlang-src]")) { _src = _$el.attr("data-xlang-src"); }
            if (_$el.is("[data-xlang-txt]")) { _disp = _$el.attr("data-xlang-txt"); }
            if (_$el.is("[data-xlang-istmp]")) { _is_tmp_chkbox = true; }
            if (_$el.is("[data-xlang-mode]")) {
                _mode = _$el.attr("data-xlang-mode") == "edit" ? true : false;
            }
            if (_$el.is("[data-xlang-site]")) { _site = _$el.attr("data-xlang-site"); }

            _code = _$el.attr("data-xlang-code");
            _nm = _$el.attr("data-xlang-name");
            _type = _$el.attr("data-xlang-type");
            _val = _$el.attr("data-xlang-value");
            //debugger;

            if (_mode) {
                if (_src == "LJS") {
                    _data = _me.getCodeMsg(_code);
                } else if (_src == "CDB") {
                    _data = _me._getCodeArray(_code);
                } else if (_src == "COM") {
                    _data = _me._getComArray({ site: _site });

                    // SITE 추가 - 2019-10-01 By LHJ
                } else if (_src == "SITE") {
                    _data = _me._geSiteData();

                    //부문정보 추가 - 2017.10.25 by dwlee 
                } else if (_src == "HD") {
                    _data = _me._getHdArray();

                } else if (_src == "FNC") {
                    _data = $dwp.core.util.getFunction(_code);
                }
                if (_data == null) return;

                if (_type == "tree") {
                    _$wrap = $("<div class='dwp-input' />").appendTo(_$el);
                    _$inpdisp = $("<input name='" + _nm + "_Disp' type='text' readonly/>").appendTo(_$wrap);
                    _$btn = $("<div class='dwp-btn'><button type='button'><img src='" + $fn.getPath("weblib") + "/images/common/icon-add-item.svg'/></button></div>").appendTo(_$el);

                    var _$inp = $("input[name=" + _nm + "]", _$el.parent());
                    if (_$inp.size() == 0) {
                        _$inp = $("<input name='" + _nm + "' type='hidden' value=''/>").appendTo(_$el);
                    }
                    var _$inph = $("input[name=" + _nm + "_Nm]", _$el.parent());
                    if (_$inph.size() == 0) {
                        _$inph = $("<input name='" + _nm + "_Nm' type='hidden' value=''/>").appendTo(_$el);
                    }

                    var _$inpfullcd = $("input[name=" + _nm + "_Full]", _$el.parent());
                    if (_$inpfullcd.size() == 0) {
                        _$inpfullcd = $("<input name='" + _nm + "_Full' type='hidden' value=''/>").appendTo(_$el);
                    }
                    var _$inpfullnm = $("input[name=" + _nm + "_FullNm]", _$el.parent());
                    if (_$inpfullnm.size() == 0) {
                        _$inpfullnm = $("<input name='" + _nm + "_FullNm' type='hidden' value=''/>").appendTo(_$el);
                    }
                    var _$inpparcd = $("input[name=" + _nm + "_Par]", _$el.parent());
                    var _$inpparnm = $("input[name=" + _nm + "_ParNm]", _$el.parent());

                    _$inp.val(_val);
                    _$inph.val(_disp);

                    if (_$inpfullnm.val() != "") {
                        var _fullname = $fn.getCurLangMsg(_$inpfullnm.val()).split("^");
                        var _fdisp = $.map(_fullname, function(v, i) {
                            if (i > 1) return v
                        }).join("/");
                        _$inpdisp.val($fn.getCurLangMsg(_fdisp));
                    }

                    var _vcodelist = _code.split(".");
                    var _param = {};
                    _param.appcode = _vcodelist[0];
                    if (_vcodelist.length > 1) {
                        _param.gcode = _vcodelist[1];
                    }

                    // Tree Last Node Only Select
                    var _selLastNode = false;
                    if (_$el.is("[data-xlang-sellast]")) { _selLastNode = true; }

                    _$btn.on("click", function() {
                        $dwp.ui.dialog.init($(this), {
                            title: $dwp.core.lang.getCodeMsg("코드선택"),
                            width: 300,
                            height: 500,
                            modal: true,
                            hide: { effect: "fade", duration: 300 },
                            show: { effect: "fade", duration: 300 },
                            content: { url: $fn.getPath("code") + "/wFrmCodeSel?readform", data: _param },
                            buttons: [{
                                title: $dwp.core.lang.getCodeMsg("확인"),
                                highlight: true,
                                click: function(_$dialog) {
                                    var _$tree = $("[name='tree']", _$dialog.element).xtree("instance"),
                                        _dtnode = _$tree.getActiveNode();

                                    if (_dtnode == null) {
                                        $fn.alert({ msg: $fn.getCodeMsg("코드를 선택해 주십시요!") });
                                        return false;
                                    }
                                    if (_dtnode.data.type != "CODE") {
                                        $fn.alert({ msg: $fn.getCodeMsg("코드를 선택해 주십시요!") });
                                        return false;
                                    }
                                    console.log("_selLastNode", _selLastNode)
                                    console.log("_selLastNode", _dtnode.data.isFolder)
                                    if (_selLastNode && _dtnode.data.isFolder) {
                                        $fn.alert({ msg: $fn.getCodeMsg("최종항목을 선택해 주십시요!") });
                                        return false;
                                    }
                                    var _disp = $.map(_dtnode.data.fullname, function(v, i) {
                                        if (i > 1) return v
                                    }).join("/");

                                    _$inpdisp.val(_disp);
                                    //_$inpdisp.val($fn.getCurLangMsg(_dtnode.data.codenm));
                                    _$inp.val(_dtnode.data.code);
                                    _$inph.val(_dtnode.data.codenm);
                                    _$inpfullcd.val(_dtnode.data.fullid.join(";"));
                                    _$inpfullnm.val(_dtnode.data.fullcodenm);

                                    if (_$inpparcd.size() > 0) {
                                        _$inpparcd.val(_dtnode.data.pcode);
                                    }
                                    if (_$inpparnm.size() > 0) {
                                        _$inpparnm.val(_dtnode.data.pcodenm);
                                    }

                                    _$dialog.close();
                                }
                            }, {
                                title: $dwp.core.lang.getCodeMsg("취소"),
                                highlight: false,
                                click: function(_$dialog) {
                                    _$dialog.close();
                                }
                            }]
                        })
                    });
                } else {
                    if (_type == "select") {
                        //ConvertLoadPage 호출시 중복 생성으로 인한 수정 시작: 2021-01-26
                        /*
                        //변경전
                        _$select = $("<select name='" + _nm + "'/>").appendTo(_$el);
                        */
                        _$select = $("select[name=" + _nm + "]", _$el.parent());
                        if (_$select.size() == 0) {
                            _$select = $("<select name='" + _nm + "'/>").appendTo(_$el);
                        } else {
                            _val = $("option:selected", _$select).val();
                            _$select.html("");
                        }
                        //ConvertLoadPage 호출시 중복 생성으로 인한 수정 종료: 2021-01-26

                        if (_$el.is("[data-xlang-all]") && _$el.attr("data-xlang-all") !== "") {
                            _$opt = $("<option value=''>" + _me.getCodeMsg(_$el.attr("data-xlang-all")) + "</option>").appendTo(_$select);
                            if (_$el.is("[data-xlang-allval]") && _$el.attr("data-xlang-allval") !== "") {
                                _$opt.val(_$el.attr("data-xlang-allval"));
                            }
                        }
                    }
                    if ($.isArray(_data)) {
                        $.each(_data, function(i, p) {
                            var v = Object.keys(p)[0];
                            var _txt = _me.getCurMsg(p[v]);
                            if (_type == "select") {
                                _$opt = $("<option>" + _txt + "</option>").appendTo(_$select);
                                _$opt.attr("data-xlang-txt", p[v]);
                                _$opt.val(v);
                                if (v == _val) { _$opt.prop("selected", true); }
                            } else if (_type == "checkbox" && _is_tmp_chkbox) {
                                _$wrap = $("<div class='dwp-" + _type + "'/>").appendTo(_$el);
                                _$label = $("<label/>").appendTo(_$wrap);


                                _$inp = $("<input name='" + _nm + "_tmp' type='" + _type + "'/>").appendTo(_$label);
                                _$inp.attr("data-xlang-txt", p[v]);
                                _$inp.val(v);

                                $("<span/>").appendTo(_$label).text(_txt);

                                if (_val.indexOf(v) > -1) { _$inp.prop("checked", true) }

                            } else {
                                _$wrap = $("<div class='dwp-" + _type + "'/>").appendTo(_$el);
                                _$label = $("<label/>").appendTo(_$wrap);

                                _$inp = $("<input name='" + _nm + "' type='" + _type + "'/>").appendTo(_$label);
                                _$inp.attr("data-xlang-txt", p[v]);
                                _$inp.val(v);

                                $("<span/>").appendTo(_$label).text(_txt);

                                if (_val.indexOf(v) > -1) { _$inp.prop("checked", true) }
                            }
                        });
                    } else {
                        for (v in _data) {
                            var _txt = _me.getCurMsg(_data[v]);
                            if (_type == "select") {
                                _$opt = $("<option>" + _txt + "</option>").appendTo(_$select);
                                _$opt.attr("data-xlang-txt", _data[v]);
                                _$opt.val(v);
                                if (v == _val) { _$opt.prop("selected", true); }
                            } else if (_type == "checkbox" && _is_tmp_chkbox) {
                                _$wrap = $("<div class='dwp-" + _type + "'/>").appendTo(_$el);
                                _$label = $("<label/>").appendTo(_$wrap);

                                _$inp = $("<input name='" + _nm + "_tmp' type='" + _type + "'/>").appendTo(_$label);
                                _$inp.attr("data-xlang-txt", _data[v]);
                                _$inp.val(v);

                                $("<span/>").appendTo(_$label).text(_txt);

                                if (_val.indexOf(v) > -1) { _$inp.prop("checked", true) }
                            } else {
                                _$wrap = $("<div class='dwp-" + _type + "'/>").appendTo(_$el);
                                _$label = $("<label/>").appendTo(_$wrap);

                                _$inp = $("<input name='" + _nm + "' type='" + _type + "'/>").appendTo(_$label);
                                _$inp.attr("data-xlang-txt", _data[v]);
                                _$inp.val(v);

                                $("<span/>").appendTo(_$label).text(_txt);

                                if (_val.indexOf(v) > -1) { _$inp.prop("checked", true) }
                            }
                            i++;
                        }
                    }
                    //if( _src == "CDB" ) {
                    //ConvertLoadPage 호출시 중복 생성으로 인한 수정 시작: 2021-01-26
                    /*
                    //변경전
                    _$inph = $("<input name='" + _nm + "_Nm' type='hidden' value=''/>").appendTo(_$el);                   
                    */
                    _$inph = $("input[name=" + _nm + "_Nm]", _$el.parent());
                    if (_$inph.size() == 0) {
                        _$inph = $("<input name='" + _nm + "_Nm' type='hidden' value=''/>").appendTo(_$el);
                    }
                    //ConvertLoadPage 호출시 중복 생성으로 인한 수정 종료: 2021-01-26

                    if (_type == "select") {
                        function _getselected() {
                            if ($("option:selected", _$select).size() > 0) {
                                return $("option:selected", _$select).attr("data-xlang-txt");
                            } else {
                                return "";
                            }
                        }
                        _$inph.val(_getselected());
                        _$select.on("change", function() {
                            _$inph.val(_getselected());
                        });
                    } else {
                        function _getchecked(fld) {
                            var _stxt = [];
                            $("input[name='" + fld + "']:checked", _$el).each(function() {
                                _stxt.push($(this).attr("data-xlang-txt"));
                            });
                            return (_stxt.length > 0) ? _stxt.join(";") : "";
                        }

                        function _getcheckedVal(fld) {
                            $("input[name='" + _nm + "']", _$el).remove();

                            $("input[name='" + fld + "']:checked", _$el).each(function() {
                                var _$inpv = $("<input name='" + _nm + "' type='hidden' value=''/>").appendTo(_$el);
                                _$inpv.val($(this).val());
                            });
                            if ($("input[name='" + _nm + "']", _$el).size() == 0) {
                                $("<input name='" + _nm + "' type='hidden' value=''/>").appendTo(_$el);
                            }
                        }
                        if (_type == "checkbox" && _is_tmp_chkbox) {
                            _getcheckedVal(_nm + "_tmp");
                            _$inph.val(_getchecked(_nm + "_tmp"));

                            $("input[name='" + _nm + "_tmp']", _$el).off("click").on("click", function() {
                                _getcheckedVal(_nm + "_tmp");
                                _$inph.val(_getchecked(_nm + "_tmp"));
                            });
                        } else {
                            _$inph.val(_getchecked(_nm));
                            $("input[name='" + _nm + "']", _$el).off("click").on("click", function() {
                                _$inph.val(_getchecked(_nm));
                            });
                        }
                    }
                    //} 
                }
            } else {
                if (_src == "LJS") {
                    _data = _me.getCodeMsg(_code);
                }
                if (_disp == "") {
                    if (_src == "CDB") {
                        _data = _me._getCodeData(_code);
                    } else if (_src == "COM") {
                        _data = _me._getComArray({});

                        // SITE 추가 - 2019-10-01 By LHJ
                    } else if (_src == "SITE") {
                        _data = _me._geSiteData();

                        //부문정보 추가 - 2017.10.25 by dwlee
                    } else if (_src == "HD") {
                        _data = _me._getHdData(_code);
                    } else if (_src == "FNC") {
                        _data = $dwp.core.util.getFunction(_code);
                    }
                    if (_val == "") return;
                    _$el.text($.map(_val.split(","), function(v) {
                        return _me.getCurMsg(_data[$.trim(v)]);
                    }).join(","));
                } else if (_disp != "" && (_src == "CDB" || _src == "COM" || _src == "SITE" || _src == "HD")) {
                    if (_type == "tree") {
                        var _fullname = $fn.getCurLangMsg(_disp).split("^");
                        _$el.text($.map(_fullname, function(v, i) {
                            if (i > 1) return v
                        }).join("/"));
                    } else {
                        _$el.text($.map(_disp.split(";"), function(v, i) {
                            return _me.getCurMsg($.trim(v));
                        }).join(","));
                    }
                } else {
                    if (_val == "") return;
                    _$el.text($.map(_val.split(","), function(v) {
                        return _me.getCurMsg(_data[$.trim(v)]);
                    }).join(","));
                }
            }
        },
        _convertTime: function(el) {
            var _me = this,
                _$el = $(el),
                _iso = _$el.attr("data-xlang-code"),
                _format = "" || _$el.attr("data-xlang-format");
            //,_iso = $.trim(_$el.text())
            //,_lodate = new Date(_iso)
            //,__lodate;

            //console.log("Lang",this.getLang());
            //moment.locale(this.getLang());

            //__lodate = moment(_iso);

            _$el.text($fn.formatDateTime(_iso, _format))
                /*
                if (_format == "dateonly") {
                    _$el.text(__lodate.format("YYYY.MM.DD"));
                } else {
                    _$el.text(__lodate.format("YYYY.MM.DD HH:mm:ss"));
                }
                */
        },
        _convertTimeZone: function(el, opt) {
                var _me = this,
                    _mode = opt.isedit,
                    _$el = $(el),
                    _code, _nm, _val, _data, _$select = null,
                    _$opt = null;

                if (!_$el.is("[data-xlang-name]")) { return; }
                if (!_$el.is("[data-xlang-value]")) { return; }

                if (_$el.is("[data-xlang-mode]")) {
                    _mode = _$el.attr("data-xlang-mode") == "edit" ? true : false;
                }

                _code = "AP0009.GP0001";
                _nm = _$el.attr("data-xlang-name");
                _val = (_$el.attr("data-xlang-value") == "" ? moment().utcOffset() / 60 : _$el.attr("data-xlang-value"));

                //_data = _me._getCodeData(_code);
                _data = _$$.lang._TIMEZONE;

                if (_mode) {
                    var _$select = $("<select name='" + _nm + "'/>").appendTo(_$el);
                    if (_$el.is("[data-xlang-all]") && _$el.attr("data-xlang-all") !== "") {
                        _$opt = $("<option>" + _me.getCodeMsg(_$el.attr("data-xlang-all")) + "</option>").appendTo(_$select);
                        if (_$el.is("[data-xlang-allval]") && _$el.attr("data-xlang-allval") !== "") {
                            _$opt.val(_$el.attr("data-xlang-allval"));
                        }
                    }
                    for (var i = 0; _data[i]; i++) {
                        _txt = _me.getCurMsg(_data[i].name) + "(" + _data[i].utc + ")";
                        _$opt = $("<option>" + _txt + "</option>").appendTo(_$select);
                        _$opt.val(_data[i].utc);
                        _$opt.data("_TIMEZONE", _data[i])
                        if (_data[i].utc == _val) { _$opt.prop("selected", true); }
                    }
                } else {
                    if (_val == "") return;
                    _$el.text(_me.getCurMsg(_me.getTime(_val).name))
                }
            }
            // "ko:값,en:값" --> Object로
            ,
        strToObj: function(str) {
            //console.log(str);
            var _obj = {};
            if (str == "") return _obj;
            var strList = str.split(":");
            if (strList.length == 1) { _obj['ko'] = str; return _obj; }
            if (!(/^[a-z][a-z]:/).test(str)) { _obj['ko'] = str; return _obj; }

            var _strTmp = str,
                _list = null,
                _Reg = /,[a-z][a-z]:/g;

            if (_Reg.test(str)) {
                _list = str.match(_Reg);
                for (var i = 0; i < _list.length; i++) {
                    _strTmp = _strTmp.replace(_list[i], _list[i].replace(",", "`}"));
                }
            }

            var sLangList = _strTmp.split("`}");
            for (var i = 0; i < sLangList.length; i++) {
                var el = sLangList[i].split(":");
                if (el.length > 2) {
                    _obj[el[0]] = el.slice(1).join(":");
                } else {
                    _obj[el[0]] = el[1];
                }
            }

            return _obj;
        },
        _TIMEZONE: [
            { utc: -12, zonecode: "ZW12", name: "Eniwetok/Kwajalein" }, { utc: -11, zonecode: "CST", name: "Midway Island/Samoa" }, { utc: -10, zonecode: "BST", name: "Hawaii" }, { utc: -9, zonecode: "YST/YDT", name: "Alaska" }, { utc: -8, zonecode: "PST/PDT", name: "Pacific Time (US & Canada)/Tijuana" }, { utc: -7, zonecode: "MST", name: "Arizona" }, { utc: -6, zonecode: "CST/CDT", name: "Mexico City" }
            //          ,{ utc : -5, zonecode : "EST", name : "Indiana (East)"} 
            , { utc: -5, zonecode: "EST/EDT", name: "Eastern Time (US & Canada)" }, { utc: -4, zonecode: "AST/ADT", name: "Santiago" }, { utc: -3.5, zonecode: "NST/NDT", name: "Newfoundland" }, { utc: -3, zonecode: "ZW3", name: "Brasilia" }, { utc: -2, zonecode: "ZW2/YW2", name: "Mid-Atlantic" }, { utc: -1, zonecode: "ZW1/YW1", name: "Azores" }, { utc: 0, zonecode: "GMT", name: "London" }, { utc: 1, zonecode: "CET/CEDT", name: "Brussels/Copenhagen/Madrid/Paris" }, { utc: 2, zonecode: "ZE2", name: "Helsinki/Riga/Tallinn" }, { utc: 3, zonecode: "ZE3", name: "Kuwait/Riyadh" }, { utc: 3.5, zonecode: "ZE3B", name: "Tehran" }, { utc: 4, zonecode: "ZE4", name: "Baku/Tbilisi/Yerevan" }, { utc: 4.5, zonecode: "ZE4B", name: "Kabul" }, { utc: 5, zonecode: "ZE5", name: "Islamabad/Karachi/Tashkent" }, { utc: 5.3, zonecode: "ZE5B", name: "Calcutta/Chennai/Mumbai/New Delhi" }, { utc: 5.45, zonecode: "ZE5C", name: "Kathmandu" }, { utc: 5.5, zonecode: "ZE5B", name: "Calcutta/Chennai/Mumbai/New Delhi" }, { utc: 6, zonecode: "ZE6", name: "Astana/Dhaka" }, { utc: 6.5, zonecode: "ZE6B", name: "Rangoon" }, { utc: 7, zonecode: "ZE7", name: "Bangkok/Hanoi/Jakarta" }, { utc: 8, zonecode: "ZE8", name: "Beijing" }, { utc: 9, zonecode: "ZE9", name: "Seoul/Tokyo" }, { utc: 9.5, zonecode: "ZE9B", name: "Darwin/Adelaide" }, { utc: 10, zonecode: "ZE10", name: "Vladivostok/Guam" }, { utc: 11, zonecode: "ZE10", name: "Vladivostok/Guam" }, { utc: 12, zonecode: "ZE12", name: "Fiji/Kamchatka/Marshall Is." }, { utc: 13, zonecode: "ZE13", name: "Nuku'alofa" }
        ],
        getTime: function(offset) {
            var _rtn = null;
            $.each(_$$.lang._TIMEZONE, function(i, o) {
                if (offset == o.utc) {
                    _rtn = o;
                    return false;
                }
            });
            return _rtn;
        },
        _DATEFORMAT: {
            nl: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } //네덜란드
            ,
            de: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 독일
            ,
            es: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 스페인
            ,
            "en-gb": { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 영국
            ,
            it: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 이태리
            ,
            fr: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 프랑스
            ,
            ru: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 러시아
            ,
            sv: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 스웨덴
            ,
            cs: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 체코
            ,
            tr: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 터기
            ,
            pl: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 폴란드
            ,
            en: { dateonly: "MM/DD/YYYY", time: "HH:mm:ss", sdate: "mm/dd/yy", stime: "HH:mm" } // 미국
            ,
            "en-ca": { dateonly: "MM/DD/YYYY", time: "HH:mm:ss", sdate: "mm/dd/yy", stime: "HH:mm" } // 캐나다
            //  ,es : {dateonly : "DD/MM/YYYY", time : "HH:mm:ss", sdate : "dd/mm/yy", stime : "HH:mm"}         // 멕시코
            //  ,es : {dateonly : "DD/MM/YYYY", time : "HH:mm:ss", sdate : "dd/mm/yy", stime : "HH:mm"}         // 칠레
            ,
            "pt-br": { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 브라질
            //  ,es : {dateonly : "DD/MM/YYYY", time : "HH:mm:ss", sdate : "dd/mm/yy", stime : "HH:mm"}         // 콜롬비아
            //  ,es : {dateonly : "DD/MM/YYYY", time : "HH:mm:ss", sdate : "dd/mm/yy", stime : "HH:mm"}         // 파나마
            ,
            "pa-in": { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 인도
            ,
            ms: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 말레이시아
            ,
            th: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 태국
            ,
            ja: { dateonly: "YYYY/MM/DD", time: "HH:mm:ss", sdate: "yy/mm/dd", stime: "HH:mm" } // 일본
            ,
            "en-au": { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 호주
            //  ,en : {dateonly : "DD/MM/YYYY", time : "HH:mm:ss", sdate : "dd/mm/yy", stime : "HH:mm"}         // 싱가폴
            ,
            ar: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 이집트
            ,
            id: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 인도네시아
            ,
            "id-ja": { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 인도네시아 - 자카르타
            ,
            "zh-cn": { dateonly: "YYYY/MM/DD", time: "HH:mm:ss", sdate: "yy/mm/dd", stime: "HH:mm" } // 중국
            ,
            "zh": { dateonly: "YYYY/MM/DD", time: "HH:mm:ss", sdate: "yy/mm/dd", stime: "HH:mm" } // 중국
            ,
            "ar-sa": { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 두바이
            ,
            "ar-sa": { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 사우디아라비아
            ,
            ko: { dateonly: "YYYY.MM.DD", time: "HH:mm:ss", sdate: "yy.mm.dd", stime: "HH:mm" } // 한국
            ,
            hu: { dateonly: "YYYY/MM/DD", time: "HH:mm:ss", sdate: "yy/mm/dd", stime: "HH:mm" } // 헝가리
            ,
            uk: { dateonly: "DD/MM/YYYY", time: "HH:mm:ss", sdate: "dd/mm/yy", stime: "HH:mm" } // 우크라이나
        },
        getLocale: function(code) {
                var _me = this,
                    _code = ($.cookie('nationCode') != null ? $.cookie('nationCode') : ($dwp.core.lang.getLang() == "in" ? "id" : $dwp.core.lang.getLang() == "zh" ? "zh-cn" : $dwp.core.lang.getLang()));

                _code = (navigator.language || navigator.userLanguage);

                if (typeof code != "undefined") { _code = code; }
                _code = _code.replace("0", "-");

                //return _me._DATEFORMAT[_code];
                return { dateonly: _me.getDateFormat(_code, 'm'), time: "HH:mm:ss", sdate: _me.getDateFormat(_code, 'd'), stime: "HH:mm" };
            }
            // 브라우저 언어 날짜포맷
            ,
        getDateFormat: function(lang, type) {
            var _me = this,
                _lang = ((typeof lang == "undefined") ? (navigator.language || navigator.userLanguage) : lang),
                _type = ((typeof type == "undefined") ? "m" : type),
                sample = window.Intl ? new Intl.DateTimeFormat(_lang).format(new Date(1970, 11, 31)) : '';

            var mm = 0,
                mi = sample.indexOf(12);
            var dd = 1,
                di = sample.indexOf(31);
            var yy = 2,
                yi = sample.indexOf(1970);

            // IE 10 or earlier, iOS 9 or earlier, non-Latin numbering system
            // or non-Gregorian calendar; fall back to mm/dd/yyyy
            if (yi >= 0 && mi >= 0 && di >= 0) {
                mm = (mi > yi) + (mi > di);
                dd = (di > yi) + (di > mi);
                yy = (yi > mi) + (yi > di);
            }

            var r = [];
            if (_type == 'm') {
                r[yy] = 'YYYY';
                r[mm] = 'MM';
                r[dd] = 'DD';
            } else {
                r[yy] = 'yy';
                r[mm] = 'mm';
                r[dd] = 'dd';
            }

            return r.join(sample.match(/[-.\/]/) || '.');
        }
    }
})($dwp.cns("core"), jQuery);


