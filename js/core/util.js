/**
 * <b>Util 라이브러리</b>
 * <br>Util 함수를 정의합니다.
 * @module core/util
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.util|core.util}
 */
 (function (/** @lends	module:core~$dwp.core */ _$$, $) {
	/**
	 * Util 함수
	 * @namespace
	 */
	_$$.util = {
		xAjax: function (opt) {
			var _opt = $.extend({}, opt);
			if (_opt.isloading) {
				$fn.block(undefined, { notusemsg: true });
				_opt.complete = function () {
					//console.log("complete");
					$fn.unblock();
				};
			}

			return $.ajax(_opt);
		},
		xAjaxSubmit: function (el, opt) {
			var _opt = $.extend(true, {}, opt);
			return $(el).ajaxSubmit(_opt);
		},
		cmdPost: function (url, cmd, callback, datatype) {
			var _me = this,
				_cmd = $.extend({ __Click: 0 }, cmd);
			return $.post(url, cmd, callback, datatype);
		},
		cmdPostEx: function (opt) {
			var _me = this,
				_opt = $.extend(true, { type: "POST", data: { __Click: 0 } }, opt);
			if (!_opt.data.hasOwnProperty("__Click")) {
				_opt.data["__Click"] = 0;
			}
			return _me.xAjax(_opt);
		},
		xAjaxDataCheck: function (response, opt) {
			var _me = this,
				_rtn = { code: "-1", msg: "" };
			if (typeof response != "string") return _rtn;
			if (response == "") return _rtn;

			if (response.indexOf("<!-- ==TCCLOGIN==") > -1) {
				var reason = _me.getMidStr(response, "<!-- ==TCCLOGIN==", "== 로그인페이지 체크용 주석(삭제하지마세요)-->");
				switch (reason) {
					case "0":
						break;
					case "1":
						_msg = "comm.msg.msg057";
						break;
					case "2":
						break;
					case "3":
						_msg = "서버의 사용 세션이 만료되었습니다.";
						break;
					default:
						break;
				}
				_rtn.code = reason;
				_rtn.msg = _msg;
			}
			return _rtn;
		},
		// Event Trigger
		xTrigger: function (el, eventType, opt) {
			$(el).trigger({ type: eventType, opt: opt });
		},
		// Create Event Trigger
		xOn: function (el, eventType, callback) {
			$(el)
				.off(eventType)
				.on(eventType, function (event) {
					callback(event, event.opt);
				});
		},
		// JsonArray To TreeData
		toTreeData: function (key, treedata, node) {
			var _me = this,
				_flag = false;
			for (var i = 0, j = treedata.length; i < j; i++) {
				if (treedata[i].key == key) {
					node.lvl =
						typeof treedata[i].lvl == "undefined" ? 1 : treedata[i].lvl + 1;
					if (treedata[i].children) {
						treedata[i].children[treedata[i].children.length] = node;
					} else {
						treedata[i].children = new Array();
						treedata[i].children[0] = node;
						treedata[i].isFolder = true;
					}
					_flag = true;
					return _flag;
				} else {
					if (treedata[i].children) {
						_flag = _me.toTreeData(key, treedata[i].children, node);
						if (_flag) return _flag;
					}
				}
			}
			return _flag;
		},
		// Get Sel Object List
		exObjList: function (tList, sList) {
			var _me = this,
				_rList = {};
			$.each(sList, function (i, v) {
				if ($.isArray(v)) {
					_rList["grouping_" + i] = _me.exObjList(tList, v);
				} else {
					if (typeof tList[v] != "undefined") {
						_rList[v] = tList[v];
					}
				}
			});
			return _rList;
		},
		toLocalTime: function (str) {
			var _lodate = new Date(str);
			return _lodate.format("yyyy-mm-dd HH:MM:ss");
		},
		toLocalDate: function (str) {
			var _lodate = new Date(str);
			return _lodate.format("yyyy.mm.dd");
		},
		loadPage: function (opt) {
			var _opt = $.extend({}, opt);
			$dwp.core.portal._act(_opt);
		},
		getZRegCode: function (code) {
			switch (code) {
				case "1":
					return "hq"; //한국
				case "2":
					return "us"; //미주
				case "3":
					return "eu"; //구주
				case "4":
					return "ap"; //아태
				case "5":
					return "ap"; //아태
				case "6":
					return "cn"; //중국
				default:
					return code;
			}
		},
		getYear: function (type) {
			var _ndate = moment();

			if (type == "cyear") {
				return _ndate.year() + "";
			} else if (type == "pyear") {
				return _ndate.year() - 1 + "";
			}
		},
		//2021.01.08
		getQuarter: function () {
			var _ndate = new Date(),
				_month = _ndate.getMonth() + 1;
			var _quarter = "";
			if (_month >= 1 && _month <= 3) _quarter = "1";
			else if (_month >= 4 && _month <= 6) _quarter = "2";
			else if (_month >= 7 && _month <= 9) _quarter = "3";
			else if (_month >= 10 && _month <= 12) _quarter = "4";
			return _quarter;
		},

		getMonth: function () {
			var _ndate = new Date(),
				_month = _ndate.getMonth() + 1;
			return (_month > 9 ? "" + _month : "0" + _month);
		},

		//오늘 일자 - 2020.09.11 by dwlee
		getDate: function () {
			var _ndate = new Date();
			return _ndate.format("YYYY-MM-DD")
		},
		getProxyUrl: function (url, opt) {
			var _me = this;
			var _zregcode = _me.getZRegCode(_$$.getCurUser().zregcode);
			var _s = {
				"{mail}": _$$.getPath("mail"),
				"{bookmark}": _$$.getPath("bookmark"),
				"{empno}": _$$.getCurUser().pinfo.empno,
				"{rempno}": _$$.getCurUser().pinfo.rempno,
				"{ou1}": _$$.getCurUser().pinfo.ou1,
				"{orgcode}": _$$.getCurUser().pinfo.orgcode,
				"{rorgcode}": _$$.getCurUser().pinfo.rorgcode,
				"{orgname}": $fn.getCurLangMsg(_$$.getCurUser().pinfo.orgname),
				"{comcode}": _$$.getCurUser().pinfo.comcode,
				"{vprid}": _$$.getCurUser().appinfo.vprid,
				"{appdbid}": _$$.getCurUser().appinfo.appdbid,
				"{vzregcode}": _$$.getCurUser().appinfo.vzregcode,
				"{weblib}": _$$.getPath("weblib"),
				"{zregcode}": _zregcode,
				"{cyear}": _me.getYear("cyear"),
				"{pyear}": _me.getYear("pyear"),
				"{quarter}": _me.getQuarter(),					//2021.01.08
				"{cmonth}": _me.getMonth(),
				//오늘 일자 - 2020.09.11 by dwlee
				"{cdate}": _me.getDate(),
				"{classcode}": _$$.getCurUser().pinfo.classcode,
				"{horgcode}": _$$.getCurUser().pinfo.horgcode,
				"{oaprvboxpath}": _$$.getCurUser().pinfo.oaprvboxpath,
				"{oaprvboxpath2}": _$$.getCurUser().pinfo.oaprvboxpath.replace(/deptbox/gi,"deposit")
			};
			//var _url = url.replace("{mail}", _$$.getPath("mail")).replace("{empno}", _$$.getCurUser().pinfo.empno);
			//_url = _url.replace("{vprid}", _$$.getCurUser().appinfo.vprid) ;
			var _url = url;
			$.each(_s, function (i, v) {
				_url = _url.replace(new RegExp(i, "gi"), v);
			});

			var _pattern = /{mselect_(W\d{4})}/;
			if (_pattern.test(_url)) {
				var _v = $dwp.core.portal.getMSelVal(RegExp.$1);
				if (_v == "oldbox") {
					//wViwList30, wViwList08, wViwList50
					//   http://host/dwp/aprv/cn/archive/link/aprvclink_{mselect_W3121}.nsf/wFrmViewJ?ReadForm&view=wViwList30&restricttocategory=All
					//http://devlocal.tccsteel.com/dwp/aprv/cn/archive/complete/old/aprv_old_tinbox.nsf/wFrmView?ReadForm&view=wvall&_=1556251229839
					var _vw = _url.split("view=")[1].split("&")[0];
					//   _url = "/dwp/aprv/cn/archive/complete/old/aprv_old_tinbox.nsf/wFrmView?ReadForm&view=" + _vw;		//완료, 기각, 참조 보기 구보관함에 생성한 후 사용
					_url =
						"/dwp/aprv/cn/archive/complete/old/aprv_old_tinbox.nsf/wFrmView?ReadForm&view=wvall";
				} else {
					_url = _url.replace(_pattern, _v);
				}
			}

			if (
				_url.indexOf("/dwp/") != 0 &&
				_url.indexOf("/cn/dwp") != 0 &&
				_url.indexOf("/hq/dwp") != 0 &&
				_url.indexOf("/us/dwp") != 0 &&
				_url.indexOf("/ap/dwp") != 0 &&
				_url.indexOf("/eu/dwp") != 0 &&
				_url.indexOf("/gw") != 0 &&
				_url.indexOf("/mail") != 0 &&
				_url.indexOf("/cnmail1") != 0 &&
				_url.indexOf("/tcclibs") != 0 &&
				_url.indexOf("/wps") != 0 &&
				_url.indexOf("/roaming") != 0 &&
				//_url.indexOf("/tinbox") != 0 &&
				_url.indexOf("/eni") != 0 &&
				_url.indexOf("/seoulgas") != 0 &&
				_url.indexOf("/domdoc/") != 0 &&
				_url.indexOf("/int") != 0 &&
				_url.indexOf("http://") != 0 &&
				_url.indexOf("https://") != 0
			) {
				_url = "/dwp/" + _zregcode + _url;
			}

			return _url;
		},
		// Data Service Header Count 가져오기
		getDataRange: function (xhr, pos) {
			var _r = "0",
				_pos = typeof pos == "undefined" ? "count" : pos,
				_res = $.isArray(xhr) ? xhr[2] : xhr,
				_range = _res.getResponseHeader("Content-Range");
			if (_range) {
				if (_pos == "start") {
					if (_range.match(/^items\s([0-9]{1,})-([0-9]{1,})\/([0-9]{1,})/g)) {
						_r = RegExp.$1;
					}
				} else if (_pos == "end") {
					if (_range.match(/^items\s([0-9]{1,})-([0-9]{1,})\/([0-9]{1,})/g)) {
						_r = RegExp.$2;
					}
				} else {
					if (_range.match(/^items\s([0-9]{1,})-([0-9]{1,})\/([0-9]{1,})/g)) {
						_r = RegExp.$3;
					}
				}
			}
			return parseInt(_r, 10);
		},
		getDeviceInfo: {
			android: function () {
				return navigator.userAgent.match(/Android/i);
			},
			ios: function () {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			blackberry: function () {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			opera: function () {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			iemobile: function () {
				return navigator.userAgent.match(/IEMobile/i);
			},
			ismobile: function () {
				return (
					this.android() ||
					this.ios() ||
					this.blackberry() ||
					this.opera() ||
					this.iemobile()
				);
			},
			type: function () {
				var _r = null;
				if (this.android()) {
					_r = "android";
				} else if (this.ios()) {
					_r = "ios";
				} else if (this.blackberry()) {
					_r = "blackberry";
				} else if (this.opera()) {
					_r = "opera";
				} else if (this.iemobile()) {
					_r = "iemobile";
				} else {
					_r = "PC";
				}
				return _r;
			}
		},
		getScreenInfo: function () {
			var _re = {
				w: screen.width,
				h: screen.height,
				doc_w:
					self.innerWidth ||
					document.documentElement.clientWidth ||
					document.body.clientWidth ||
					window.innerWidth,
				doc_h:
					self.innerHeight ||
					document.documentElement.clientHeight ||
					document.body.clientHeight ||
					window.innerHeight
			};
			return _re;
		},
		getFunction: function (sfunc) {
			if (typeof sfunc == "undefined" || sfunc == "") return null;
			var fn = window;
			var _fnlist = sfunc.split(".");
			var _len = _fnlist.length;

			if (_len > 1) {
				for (var i = 0, j = _len - 1; i < j; i++) {
					fn = fn[_fnlist[i]];
					if (typeof fn == "undefined") {
						fn = null;
						return;
					}
				}
			}
			if (fn == null) {
				return null;
			}
			if (typeof fn[_fnlist[_len - 1]] == "function") {
				return [fn[_fnlist[_len - 1]], fn];
			} else {
				return null;
			}
		},
		getMidStr: function (fstr, sstr, estr) {
			var slen = sstr.length;
			var sci = fstr.indexOf(sstr);
			var tlen = fstr.length;
			var gastr = fstr.substring(sci + slen, tlen);
			var glen = gastr.length;
			var esi = gastr.indexOf(estr);
			var restr = gastr.substring(0, esi);
			return restr;
		},
		// 문자건수 가져오기
		getStrByteLen: function (msgVal) {
			var bytesLen = 0;
			for (var i = 0; i < msgVal.length; i++) {
				var oneChar = msgVal.charAt(i);
				if (escape(oneChar).length > 4) {
					bytesLen += 2;
				} else if (oneChar != "\r" || oneChar != "\n") {
					bytesLen++;
				} else if (oneChar == '<' || oneChar == '>') {
					bytesLen += 4;
				}
			}
			return bytesLen;
		},
		validator: {
			_OPT: {
				rules: {}
			},
			rules: {
				minlength: {
					fn: function (message, len) {
						var _val = $(this).xval();
						if (_val.length < len) {
							return $dwp.core.lang.getCodeMsg(message).replace("$1", len);
						}
						return null;
					},
					message: "comm.msg.msg034"
				},
				maxlength: { fn: null, message: "" },
				required: { regx: /[^\s]/, message: "comm.msg.msg035" },
				memo: { regx: /[^\s]/, message: "comm.msg.msg035" },
				date: {
					regx: /[1-9]\d{3}\-(1[0-2]|0[1-9])\-(3[0-1]|0[1-9]|[1-2][0-9])/,
					message: "comm.msg.msg036"
				},
				num: { regx: /^[-]?\d+(?:[.]\d+)?$/, message: "comm.msg.msg037" },
				email: {
					regx: /[^@\.\s]+@[^\.\s]+(.[^\.\s])+/,
					message: "comm.msg.msg038"
				}
			},
			getrules: function (rules, rulekey) {
				var _me = this,
					rtn = null,
					_rules = rules || _me.rules;
				//$.each(_rules, function(i, _rule){
				if (typeof _rules[rulekey] != "undefined") {
					rtn = _rules[rulekey];
				}
				//});
				return rtn;
			},
			validate: function (target, rules) {
				var _me = this,
					_message = [],
					_rules = {},
					_opt = {};
				//$.extend(true, _opt, opt);
				$.extend(true, _rules, _me.rules, rules);
				//console.log("rules", _rules);
				$("input[validate]", target).each(function () {
					var _elem = this,
						_vlist = $(this)
							.attr("validate")
							.split(" ");

					//readonly 속성은 Validate 시 항상 리턴값을 넘김 - 2020.07.01 by dwlee
					if ($(this).prop("readonly")) {
						return true;
					}

					$.each(_vlist, function (idx, val) {
						var _elist = val.split("="),
							_rule = _me.getrules(_rules, _elist[0]),
							_msg = "";
						if (_rule != null) {
							var _parm = [_rule.message];
							for (var i = 1, j = _elist.length; i < j; i++) {
								_parm.push(_elist[i]);
							}
							if (typeof _rule.fn == "function") {
								_msg = _rule.fn.apply(_elem, _parm);
							}
							if (typeof _rule.fn == "string") {
								_msg = _$$.util_me.getFunction(_rule.fn).apply(_elem, _parm);
							}
							if (typeof _rule.regx != "undefined") {
								_msg = _me.regtest(
									_elem,
									_rule.regx,
									$dwp.core.lang.getCodeMsg(_rule.message)
								);
							}
							if (_msg != null) {
								_message.push(
									"[" +
									$dwp.core.lang.getCodeMsg($(_elem).attr("label")) +
									"]" +
									_msg
								);
							}
						}
					});
				});
				if (_message.length == 0) {
					return true;
				}
				$fn.alert({ msg: _message.join("\n") });
				//$(target).xalert({time : -1, message : _message.join("<br>")});
				return false;
			},
			regtest: function (target, regx, message) {
				_val = $(target).xval();
				if (!regx.test($(target).xval())) {
					//$(target).addClass("error");
					return message;
				}
				return null;
			}
		},
		imageResize: function (img, opt) {
			var _me = this,
				_opt = $.extend(
					{
						type: "image/png",
						width: 294,
						height: 220,
						margin: 40,
						ratio: 0.5,
						isdataurl: false
					},
					opt
				),
				oc = document.createElement("canvas"),
				octx = oc.getContext("2d"),
				_dataURL = "";

			function _reSizeCanvas2(img) {
				oc.width = img.width;
				oc.height = img.height;
				octx.drawImage(img, 0, 0);
				var _scaleX = (_opt.width + _opt.margin) / img.width;
				var _scaleY = (_opt.height + _opt.margin) / img.height;
				if (_scaleX > _scaleY) {
					oc.width *= _scaleX;
					oc.height *= _scaleX;
					octx.drawImage(oc, 0, 0, oc.width, oc.height);
					octx.drawImage(img, 0, 0, oc.width, oc.height);
				} else {
					oc.width *= _scaleY;
					oc.height *= _scaleY;
					octx.drawImage(oc, 0, 0, oc.width, oc.height);
					octx.drawImage(img, 0, 0, oc.width, oc.height);
				}
				try {
					_dataURL = oc.toDataURL(_opt.type);
					$(oc).remove();
					return _dataURL;
				} catch (e) {
					return "";
				}
			}

			function _reSizeCanvas(img) {
				var HERMITE = new Hermite_class();
				oc.width = img.naturalWidth;
				oc.height = img.naturalHeight;
				octx.drawImage(img, 0, 0);

				var _w, _h;
				var _scaleX = (_opt.width + _opt.margin) / img.naturalWidth;
				var _scaleY = (_opt.height + _opt.margin) / img.naturalHeight;
				if (_scaleX > _scaleY) {
					_w = Math.round(oc.width * _scaleX);
					_h = Math.round(oc.height * _scaleX);
				} else {
					_w = Math.round(oc.width * _scaleY);
					_h = Math.round(oc.height * _scaleY);
				}
				//octx.drawImage(img, 0, 0);
				//console.log("w", _w)
				//console.log("h", _h)
				try {
					HERMITE.resample_single(oc, _w, _h, true);
					_dataURL = oc.toDataURL();
					$(oc).remove();
					return _dataURL;
				} catch (e) {
					return "";
				}
			}

			if (_opt.isdataurl) {
				return _reSizeCanvas2(img);
			} else {
				return _reSizeCanvas(img);
				/*
						var filePath = img.src.replace(window.location.protocol + "//" + window.location.host, "");
						if( filePath.indexOf("&_=") > -1 ) {
							filePath = filePath.substring(0, filePath.indexOf("&_="));
						}
						//var filePath = img.src.substring(img.src.indexOf('/dwp'));
						filePath = filePath.indexOf('%') > -1 ? decodeURI(filePath):filePath;
						var fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
						fileName = fileName.indexOf('?') > -1 ? fileName.substring(0, fileName.indexOf('?')):fileName;
						fileName = fileName.indexOf('%') > -1 ? decodeURI(fileName):fileName;

						var opFileName = fileName.substring(0,fileName.lastIndexOf('.')) + '-optimize' + fileName.substring(fileName.lastIndexOf('.'));
						var newImgURI = '/optimize/' + opFileName + '?w=' + _opt.width + '&base64=1&im=' + filePath;

						$.ajax({url: newImgURI,
							async : false,
							dataType : 'text',
						}).done(function(data, textStatus, jqXHR) {
							_dataURL = data
						}).fail(function(){console.log('Img Convert Error');})

						return _dataURL;
						*/
			}
		},
		__imageResize: function (img, opt) {
			var _me = this,
				_opt = $.extend(
					{
						type: "image/png",
						width: 294,
						height: 220,
						margin: 40,
						ratio: 0.5
					},
					opt
				),
				oc = document.createElement("canvas"),
				octx = oc.getContext("2d"),
				_dataURL = "";

			function _reSize(img) {
				oc.width = img.width;
				oc.height = img.height;
				octx.drawImage(img, 0, 0);
				var _scaleX = (_opt.width + _opt.margin) / img.width;
				var _scaleY = (_opt.height + _opt.margin) / img.height;
				if (_scaleX > _scaleY) {
					oc.width *= _scaleX;
					oc.height *= _scaleX;
					octx.drawImage(oc, 0, 0, oc.width, oc.height);
					octx.drawImage(img, 0, 0, oc.width, oc.height);
				} else {
					oc.width *= _scaleY;
					oc.height *= _scaleY;
					octx.drawImage(oc, 0, 0, oc.width, oc.height);
					octx.drawImage(img, 0, 0, oc.width, oc.height);
				}
				/*
						if( img.width > _opt.width ) {
							while(oc.width * _opt.ratio > _opt.width) {
								oc.width *= _opt.ratio;
								oc.height *= _opt.ratio;
								octx.drawImage(oc, 0, 0, oc.width, oc.height);
							}
							oc.width = _opt.width;
							oc.height = oc.width * img.height / img.width;
							octx.drawImage(img, 0, 0, oc.width, oc.height);
						}
						*/
				_dataURL = oc.toDataURL(_opt.type);
				$(oc).remove();
				return _dataURL;
			}

			return _reSize(img);
		},
		formatDateTime: function (isodate, format) {
			var _mdate = isodate == "" ? moment() : moment(isodate),
				_ndate = moment(),
				_format = typeof format == "undefined" ? "" : format;

			if (!_mdate.isValid()) return isodate;

			var _locale = $dwp.core.lang.getLocale();

			if (_format == "dateonly") {
				return _mdate.format(_locale.dateonly);
				//return _mdate.format("YYYY.MM.DD");
			} else if (_format == "hdateonly") {
				return _mdate.format("YYYY-MM-DD");
			} else if (_format == "relative") {
				if (_ndate.diff(_mdate, "days", true) > 1) {
					return _mdate.format(_locale.dateonly);
				} else {
					return _mdate.fromNow();
				}
				/*
						if (_ndate.format("YYYY-MM-DD") == _mdate.format("YYYY-MM-DD")) {
							return _mdate.fromNow();
						} else {
							return _mdate.format(_locale.dateonly);
						}
						*/
			} else if (_format == "relative1") {
				/*
						if ( _ndate.diff(_mdate, 'days', true) > 1 ) {
							return _mdate.format(_locale.dateonly + " " + _locale.stime);
							//return _mdate.format("YYYY.MM.DD HH:mm");
						} else {
							return _mdate.format(_locale.stime);
							//return _mdate.format("HH:mm");
						}
						*/
				if (_ndate.format("YYYY-MM-DD") == _mdate.format("YYYY-MM-DD")) {
					return _mdate.format(_locale.stime);
				} else {
					return _mdate.format(_locale.dateonly + " " + _locale.stime);
				}
			} else if (_format == "datestime") {
				return _mdate.format(_locale.dateonly + " " + _locale.stime);
			} else if (_format == "stime") {
				return _mdate.format(_locale.stime);
			} else if (_format == "") {
				return _mdate.format(_locale.dateonly + " " + _locale.time);
			} else {
				return _mdate.format(_format);
				//return _mdate.format("YYYY.MM.DD HH:mm:ss");
			}
		},
		setLocalStorage: function (key, val) {
			if (typeof localStorage == "undefined") {
				return;
			}
			try {
				localStorage.setItem(key, val);
			} catch (e) {
				if (e == QUOTA_EXCEEDED_ERR) {
					console.log("localStroage 할당량초과  오류");
				}
			}
		},
		getLocalStorage: function (key) {
			if (typeof localStorage == "undefined") {
				return;
			}
			try {
				return localStorage.getItem(key);
			} catch (e) {
				console.log("localStroage 할당량초과  오류", e);
				return null;
			}
		},
		jsonToStringify: function (obj) {
			var t = typeof obj;
			if (t != "object" || obj === null) {
				// simple data type
				if (t == "string") obj = '"' + obj + '"';
				return String(obj);
			} else {
				// recurse array or object
				var n,
					v,
					json = [],
					arr = obj && obj.constructor == Array;
				for (n in obj) {
					v = obj[n];
					t = typeof v;
					if (t == "string") v = '"' + v + '"';
					else if (t == "object" && v !== null) v = JSON.stringify(v);
					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
				return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
			}
		},
		/**
			 JSON + JTL TransForm 처리함수
			 //@param {object}	대상 Element
			 @param {opt}		속성 {jurl : json data url, json : json data, jtl : json template, callback : 콜백함수 ,target : html insert 대상  }
						{jurl : "" , json: "" ; jtl:"" ,target :"" ,callback : "" }
			*/
		jTransformHTML: function (opt) {
			var _me = this,
				_opt = $.extend(true, {}, opt);

			if (_opt.hasOwnProperty("json") && typeof _opt.json === "string") {
				_opt.json = JSON.parse(_opt.json);
			}

			function _jsonGetParmData() {
				return (
					_opt.jsonparm || {
						url: _opt.jurl,
						dataType: "json",
						async: false,
						cache: false
					}
				);
			}

			function _jtlGetParmData() {
				return (
					_opt.jtlparm || {
						url: _opt.jtl,
						dataType: "text",
						async: false,
						cache: false
					}
				);
			}

			function _convert(json, jtl) {
				var _h = _$$.jsonToHtml.convert(json, jtl);

				if (typeof _opt.target != "undefined") {
					var _el = $(_opt.target);
					_el.html(_h);
					if (typeof _opt.callback == "function") {
						_opt.callback(_el);
					}
				} else {
					if (typeof _opt.callback == "function") {
						_opt.callback(_h);
					}
				}
			}
			if (typeof _opt.json != "undefined") {
				_me.xAjax(_jtlGetParmData()).done(function (jtl) {
					_convert(_opt.json, jtl);
				});
			} else {
				$.when(
					_me.xAjax(_jsonGetParmData()),
					_me.xAjax(_jtlGetParmData())
				).done(function (json, jtl) {
					var __json = {};
					__josn.data = json[0];
					_convert(__json, jtl[0]);
				});
			}
		},
		jsonToHtml: {
			convert: function (json, jtl) {
				return _$$.jsonToHtml.convert(json, jtl);
			}
		},
		/**
		 * 포틀릿 Go 버튼 이벤트 등등 옵션 설정을 파라메터로 하나씩 설정해야 하는 경우 사용
		 */
		param_winopen: function(url, title, _width, _height, _top, _left, _location, _menubar, _resizable, _scrollbars, _status, _toolbar) {
			var _url = "", _title = "", specs = [];
			_url = url || "";
			_title = title || "";
			specs.push("width=" + (_width || ""));
			specs.push("height=" + (_height || ""));
			specs.push("top=" + (_top || ""));
			specs.push("left=" + (_left || ""));
			specs.push("location=" + (_location || "no"));
			specs.push("menubar=" + (_menubar || "no"));
			specs.push("resizable=" + (_resizable || "yes"));
			specs.push("scrollbars=" + (_scrollbars || "yes"));
			specs.push("status=" + (_status || "yes"));
			specs.push("toolbar=" + (_toolbar || "no"));
			if (_url == "") return;
			window.open(_url, _title, specs.join(","));
		},
		winopen: function (url, title, opt) {
			var _me = this,
				_opt = $.extend(
					true,
					{
						width: $fn.getConstant("winwidth"),
						height: $fn.getConstant("winheight"),
						status: "yes",
						menubar: "no",
						toolbar: "no",
						location: "no",
						resizable: "yes",
						baseurl: true
					},
					opt
				),
				_pos = 1,
				_url = url,
				_vday = "";

			var _param = _me.getUrlPaser(url);
			if (_param.hasOwnProperty("did")) {
				url = url.replace("&did=" + _param.did, "");
			}
			if (_param.hasOwnProperty("vday")) {
				url = url.replace("&vday=" + _param.vday, "");
				_vday = _param.vday;
			}

			try {
				window.top.xpos =
					typeof window.top.xpos == "undefined" ? 1 : window.top.xpos + 1;
				if (window.top.xpos > 20) {
					window.top.xpos = 1;
				}

				_opt.top = 20 * window.top.xpos;
				_opt.left = 20 * window.top.xpos;
			} catch (e) {
				_opt.top = 20;
				_opt.left = 20;
			}

			if (_opt.baseurl == true) {
				_url = _$$.util.getProxyUrl(
					url + "%2526popup=1" + (_vday != "" ? "%2526vday=" + _vday : "")
				);
				_url =
					_$$.getPath("main") +
					"/wfrmpage?ReadForm&url=" +
					decodeURIComponent(_url);
			}
			var state = $.map(_opt, function (val, key) {
				return key + "=" + val;
			}).join(",");
			window.open(_url, (title || ""), state);
		},
		winmopen: function (url, title, opt) {
			var _opt = $.extend(
				true,
				{
					width: $fn.getConstant("winwidth"),
					height: $fn.getConstant("winheight"),
					status: 1,
					menubar: 0,
					toolbar: 0,
					location: 0
				},
				opt
			),
				_pos = 1,
				_url = url;

			_url = _$$.util.getProxyUrl(url + "%2526popup=1");
			_url =
				dwpmo.info.protocol +
				dwpmo.info.domain +
				_$$.getPath("main") +
				"/wfrmpage?ReadForm&url=" +
				decodeURIComponent(_url);

			$dwp.core.mportal.WinPopEx(_url);
			//window.open(_url, title, "_system");
		},
		winopenExt: function (url, title, opt) {
			var _opt = {
				width: $fn.getConstant("winwidth"),
				height: $fn.getConstant("winheight"),
				status: 1,
				menubar: 0,
				toolbar: 0,
				location: 0
			};
			var _url = url;
			var state = null;
			var nw = null;
			if (typeof opt != "undefined" && $.isEmptyObject(opt)) {
				nw = window.open(_url);
			} else {
				_opt = $.extend(true, _opt, opt);
				window.top.xpos =
					typeof window.top.xpos == "undefined" ? 1 : window.top.xpos + 1;
				if (window.top.xpos > 20) {
					window.top.xpos = 1;
				}
				_opt.top = 20 * window.top.xpos;
				_opt.left = 20 * window.top.xpos;
				state = $.map(_opt, function (val, key) {
					return key + "=" + val;
				}).join(",");
				nw = window.open(_url, title, state);
			}

			if (nw) {
				nw.focus();
			}
		},

		//2022-02-17 : 모바일 본문의 시스템 알림메일 Opendocument 버튼관련 추가
		openMAprv: function (url) {
			var _me = this, _link;

			if (url == "") return false;
			
			_link = _me.getMidStr(url, "&url=", "?OpenDocument") + "?OpenDocument";

			if (_link == "") return false;
			_link = _link.replace("/vdockey/", "/wvopen_mo/");

			$dwp.core.mportal.loadPage({ link: _link, linktype: "PAGE", layer: "doc", subtype: "read" });
			
			/*
			_link = url.substring(url.indexOf("url=")+4, url.length) + "&ismopop=true";
			$dwp.core.util.winmopen(_link);
			$dwp.core.mportal.loadPage({ link: _link, linktype: "WPOP", layer: "doc", subtype: "read" });
			*/
		},

		layerOpenDocument: function (opt) {
			var _opt = $.extend(
				{
					title: "",
					type: "doc",
					width: "800",
					height: "720",
					modal: true,
					islangconvert: false,
					content: { html: "", url: "", data: {} }
				},
				opt
			);

			$fn.dialog(null, _opt);
		},
		/**
			 문자열정보를 객체로 변환
			 @param {string}	Propery Map	ex) key^name
			 @param {string}	Data
			 @param {string}	Data 구분자
			 @param {string}	Data 멀티 구분자 값 설정 시, 배열 Object를 반환함
			 @return {object}	Data Object Or Array Data Object
			*/
		getObjStr: function (map, data, sp, msp) {
			var _sp = sp || "^",
				_prop = map.split(_sp);

			function _getobjstr(sdata) {
				var _o = {},
					_data = [];

				if (sdata != "") {
					_data = sdata.split(_sp);
				}
				$.each(_prop, function (idx, _p) {
					if (typeof _data[idx] == "undefined") {
						_o[_p] = "";
					} else {
						_o[_p] = _data[idx];
					}
				});
				_o.fullinfo = sdata;
				return _o;
			}
			function _getobjobj(data) {
				var _o = {},
					_fullinfo = "";
				$.each(_prop, function (idx, _p) {
					_o[_p] = typeof data[_p] != "undefined" ? data[_p] : "";
					_fullinfo = _fullinfo + (idx == 0 ? _o[_p] : _sp + _o[_p]);
				});
				_o.fullinfo = _fullinfo;
				return _o;
			}

			if (typeof data == "string") {
				if (typeof msp != "undefined" && msp != "") {
					return $.map(data.split(msp), function (o, i) {
						return _getobjstr(o);
					});
				} else {
					return _getobjstr(data);
				}
			} else {
				if ($.isArray(data)) {
					return $.map(data, function (o, i) {
						return _getobjobj(o);
					});
				} else {
					return _getobjobj(data);
				}
			}
		},
		exceldown: function (opt) {
			var _opt = $.extend(
				{
					eventcode: "",
					applcode: "",
					cdb: "",
					agent: "com_exceldown",
					formula: "",
					viewname: "",
					etc: ""
				},
				opt
			);
			$dwp.ui.dialog.init(null, {
				title: $dwp.core.lang.getCodeMsg("comm.title.js022"),
				width: 420,
				modal: true,
				content: {
					url: $fn.getPath("gwlib") + "/wexceldown?readform",
					data: {}
				},
				initcallback: function (_$dialog) {
					var _ndate = moment(),
						_locale = $dwp.core.lang.getLocale();

					$("input[name=to]", _$dialog.element).xval(
						_ndate.format("YYYY-MM-DD")
					);
					$("input[name=from]", _$dialog.element).xval(
						_ndate.format("YYYY-MM-DD")
					);

					$dwp.ui.datepicker(_$dialog.element, {});

					// 전월
					$("div[name='bmonth']", _$dialog.element)
						.off("click")
						.on("click", function () {
							var _date = moment().subtract(1, "month");
							$("input[name=from]", _$dialog.element).datepicker(
								"option",
								"maxDate",
								_date.endOf("month").format(_locale.dateonly)
							);
							$("input[name=to]", _$dialog.element).datepicker(
								"option",
								"minDate",
								_date.startOf("month").format(_locale.dateonly)
							);

							$("input[name=from]", _$dialog.element).xval(
								_date.startOf("month").format("YYYY-MM-DD")
							);
							$("input[name=to]", _$dialog.element).xval(
								_date.endOf("month").format("YYYY-MM-DD")
							);
						});
					// 당월
					$("div[name='nmonth']", _$dialog.element)
						.off("click")
						.on("click", function () {
							$("input[name=from]", _$dialog.element).datepicker(
								"option",
								"maxDate",
								moment()
									.endOf("month")
									.format(_locale.dateonly)
							);
							$("input[name=to]", _$dialog.element).datepicker(
								"option",
								"minDate",
								moment()
									.startOf("month")
									.format(_locale.dateonly)
							);

							$("input[name=from]", _$dialog.element).xval(
								moment()
									.startOf("month")
									.format("YYYY-MM-DD")
							);
							$("input[name=to]", _$dialog.element).xval(
								moment()
									.endOf("month")
									.format("YYYY-MM-DD")
							);
						});
					// 1분기
					$("div[name='fq1']", _$dialog.element)
						.off("click")
						.on("click", function () {
							var _date = moment({ year: _ndate.year(), month: 0, day: 1 });
							$("input[name=from]", _$dialog.element).datepicker(
								"option",
								"maxDate",
								_date.endOf("quarters").format(_locale.dateonly)
							);
							$("input[name=to]", _$dialog.element).datepicker(
								"option",
								"minDate",
								_date.startOf("quarters").format(_locale.dateonly)
							);

							$("input[name=from]", _$dialog.element).xval(
								_date.startOf("quarters").format("YYYY-MM-DD")
							);
							$("input[name=to]", _$dialog.element).xval(
								_date.endOf("quarters").format("YYYY-MM-DD")
							);
						});
					// 2분기
					$("div[name='fq2']", _$dialog.element)
						.off("click")
						.on("click", function () {
							var _date = moment({ year: _ndate.year(), month: 3, day: 1 });
							$("input[name=from]", _$dialog.element).datepicker(
								"option",
								"maxDate",
								_date.endOf("quarters").format(_locale.dateonly)
							);
							$("input[name=to]", _$dialog.element).datepicker(
								"option",
								"minDate",
								_date.startOf("quarters").format(_locale.dateonly)
							);

							$("input[name=from]", _$dialog.element).xval(
								_date.startOf("quarters").format("YYYY-MM-DD")
							);
							$("input[name=to]", _$dialog.element).xval(
								_date.endOf("quarters").format("YYYY-MM-DD")
							);
						});
					// 3분기
					$("div[name='fq3']", _$dialog.element)
						.off("click")
						.on("click", function () {
							var _date = moment({ year: _ndate.year(), month: 6, day: 1 });
							$("input[name=from]", _$dialog.element).datepicker(
								"option",
								"maxDate",
								_date.endOf("quarters").format(_locale.dateonly)
							);
							$("input[name=to]", _$dialog.element).datepicker(
								"option",
								"minDate",
								_date.startOf("quarters").format(_locale.dateonly)
							);

							$("input[name=from]", _$dialog.element).xval(
								_date.startOf("quarters").format("YYYY-MM-DD")
							);
							$("input[name=to]", _$dialog.element).xval(
								_date.endOf("quarters").format("YYYY-MM-DD")
							);
						});
					// 4분기
					$("div[name='fq4']", _$dialog.element)
						.off("click")
						.on("click", function () {
							var _date = moment({ year: _ndate.year(), month: 9, day: 1 });
							$("input[name=from]", _$dialog.element).datepicker(
								"option",
								"maxDate",
								_date.endOf("quarters").format(_locale.dateonly)
							);
							$("input[name=to]", _$dialog.element).datepicker(
								"option",
								"minDate",
								_date.startOf("quarters").format(_locale.dateonly)
							);

							$("input[name=from]", _$dialog.element).xval(
								_date.startOf("quarters").format("YYYY-MM-DD")
							);
							$("input[name=to]", _$dialog.element).xval(
								_date.endOf("quarters").format("YYYY-MM-DD")
							);
						});
				},
				buttons: [
					{
						title:
							"<img src='" +
							$fn.getPath("weblib") +
							"/images/common/btn-excel.png'>&nbsp;" +
							$dwp.core.lang.getCodeMsg("Excel Download"),
						//,icon : $fn.getPath("weblib") + "/images/common/btn-excel.png"
						click: function (_$dialog) {
							var _from = $("input[name=from]", _$dialog.element).xval(),
								_to = $("input[name=to]", _$dialog.element).xval(),
								_fdate = moment(_from),
								_tdate = moment(_to);

							if (_tdate.diff(_fdate, "years", true) > 1) {
								$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg039") });
								return;
							}

							var _formula =
								"CreatedDate >= [" +
								_from.replace(/\./gi, "-") +
								"] & CreatedDate <= [ " +
								_to.replace(/\./gi, "-") +
								"]" +
								(_opt.formula != "" ? " & " + _opt.formula : "");
							var _post_data = {
								eventcode: _opt.eventcode,
								applcode: _opt.applcode,
								postdata: _formula,
								viewname: _opt.viewname,
								etc: _opt.etc
							};
							$dwp.core.util
								.xAjax({
									url: $dwp.core.util.getProxyUrl(
										_opt.cdb + "/" + _opt.agent + "?openagent"
									),
									dataType: "json",
									async: false,
									cache: false,
									type: "POST",
									data: _post_data
								})
								.done(function (data) {
									// "result":"200","unid":"1C35D4000D3778B44925801700048506","re_cd":"save_rep",key_docunid :"" ,"docstatus":""
									if (data.hasOwnProperty("result")) {
										if (data.result >= "200" && data.result < "300") {
											$fn
												.alert({ msg: $fn.getCodeMsg("comm.msg.msg040") })
												.done(function () {
													_$dialog.close();
												});
										} else {
											//error
										}
									} else {
										//error
									}
								});
						}
					}
				]
			});
		},
		/*
		 * 동영상 업로드 처리
		 */
		openMediaUpload: function (callback, opt) {
			var rest = "http://202.31.8.241:8081/rest";
			var _opt = $.extend(
				{
					ismobile: false,
					pwidth: 640,
					pheight: 360,
					isfull: false,
					autostart: false,
					refdata: {
						// 필요시 해당 값만 설정함.(기본 동영상 서버 관리자 설정)
						//uploadOneSize : "1 MB"			// 파일 크기 제한 (수정)
						//,uploadMaxSize : 1*1024*1024	// 전체 파일 크기 제한 (수정)
						//,uploadFileCnt : 10				// 파일 갯수 제한 (수정)
						//,uploadFileExt : "wmv,mp4,avi"  // 파일 확장자 제한 (수정) wmv,mp4,avi
					}
				},
				opt
			);
			var _lang =
				$dwp.core.lang.getLang() == "in"
					? "id"
					: $dwp.core.lang.getLang() == "zh"
						? "zh_CN"
						: $dwp.core.lang.getLang();
			$dwp.ui.dialog.init(
				null,
				$.extend(
					{
						title: _opt.title || $dwp.core.lang.getCodeMsg("comm.title.js023"),
						//,width : 720
						//,height : 480
						width: _opt.ismobile ? "100%" : 740,
						height: _opt.ismobile ? "auto" : 480,
						modal: true,
						content: {
							url: "/wps/PA_DWP_WENMedia/wenMedia/upload.jsp",
							data: { lang: _lang }
						},
						callback: function (data) {
							var _phtml = "",
								_url =
									"/wps/PA_DWP_WENMedia/wenMedia/player.jsp?type=vod&sett=24&id=" +
									data.fileid +
									"&autoStart=" +
									(_opt.autostart ? "Y" : "N");
							if (_opt.ismobile || _opt.isfull) {
								//_url = (_opt.ismobile ? dwpmo.info.protocol + dwpmo.info.domain : "") + _url;
								//_url += "&width=" + encodeURIComponent("100%") + "&height=360";
								_url += "&width=full&height=360";
								//_phtml = "<div style='position: relative; width:100%; height: 0; padding-bottom:56.25%'>";
								_phtml +=
									"<iframe name='dwp_media' src='" +
									_url +
									"' fileid='" +
									data.fileid +
									"' frameborder='0' allowfullscreen=true style='width:100%;height:360px' ></iframe>";
								//_phtml += "</div>";
							} else {
								_url += "&width=" + _opt.pwidth + "&height=" + _opt.pheight;
								_phtml +=
									"<iframe name='dwp_media' src='" +
									_url +
									"' fileid='" +
									data.fileid +
									"' frameborder='0' allowfullscreen=true style='width:" +
									_opt.pwidth +
									"px;height:" +
									_opt.pheight +
									"px' ></iframe>";
							}
							data.playerhtml = _phtml;
							data.playerurl = _url;
							//data.thumburl = "/wps/PA_DWP_WENMedia/wenMedia/proxy.jsp?" + rest + "/stream/" + _o.fileid + "/thumbnail;idx=1;size=300*225";
							data.thumburl =
								"/wenmediarest/" +
								data.fileid +
								"/thumbnail;idx=1;size=300*225";
							callback(data);
						}
					},
					_opt
				)
			);
		},
		/*
		 * 모바일 파일 Viewer 호출
		 */
		callFileViewer: function (opt) {
			var _me = this, _opt = {}, _pdata = {};

			_opt = $.extend(
				{
					reqdata: {
						ReqApplCode: "",
						ReqServer: "",
						ReqDBPath: "",
						ReqDocUNID: "",
						ReqDocSubject: "",
						ReqFilename: ""
					}
				},
				opt
			);

			var callback = function(cookie) {
				var _pdata = {
					"sync": "false",
					"fileType": "URL",
					"fid": "M" + $.now() + "_" + (Math.random() * 10000000000000000).toString().replace(/\./g, ""),
					"convertType": "1",
					"filePath": dwpmo.info.protocol + dwpmo.info.domain.replace(/local/g, "") + opt.url,
					"accessCookieData": $.base64Encode('{"LtpaToken":"' + cookie + '"}')
				};
				var _protocol = "";
				if (location.port == "80" || location.protocol == "http:") {
					_protocol = "http:";
				} else {
					_protocol = "https:";
				}
				$fn.block(undefined, { notusemsg: true });
				$dwp.core.util.cmdPost(
					_protocol + "//mgw.bn-korea.com/SynapDocViewServer/jobJson",			//사이냅문서변환 URL	//"http://220.119.218.42:8080/SynapDocViewServer/jobJson",
					_pdata,
					function (data) {
						$.unblockUI();
						//var synapurl = "http://220.119.218.42:8080/SynapDocViewServer/viewer/doc.html?key=" + data.key + "&convType=img&convLocale=ko_KR&contextPath=/SynapDocViewServer"
						var synapurl = _protocol + "//mgw.bn-korea.com/SynapDocViewServer/viewer/doc.html?key=" + data.key + "&convType=img&convLocale=ko_KR&contextPath=/SynapDocViewServer"
						if (data.hasOwnProperty("key")) {
							if (data.key != "") {
								$dwp.core.mportal.WinPopEx(synapurl);			//사이냅문서변환 조회 화면
							} else {
								$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg_mo.msg003") });
							}
						} else {
							$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg_mo.msg003") });
						}
					},
					"json"
				).fail(function () {
					$.unblockUI();
					$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg_mo.msg003") });
				});
			};
			dwpmo.util.getCookie(dwpmo.info.domain, "LtpaToken", callback);

			/*
			// 아래는 기존에 사용하던 방식으로 주석처리 - 2021-05-10 - 10000hyun
			$fn.block(undefined, { notusemsg: true });
			$dwp.core.util
				.cmdPost(
					$dwp.core.util.getProxyUrl(
						$fn.getPath("mvlog") + "/req_mv?createdocument"
					),
					_opt.reqdata,
					function (data) {
						$.unblockUI();
						if (data.hasOwnProperty("retcode")) {
							if (data.retcode == "1") {
								$dwp.core.mportal.WinPopEx(
									dwpmo.info.protocol + dwpmo.info.domain + data.viewurl
								);
								//var _option = "location=no,toolbar=no,clearcache=no,clearsessioncache=no";
								//window.open(dwpmo.info.protocol + dwpmo.info.domain + data.viewurl,'_system',_option);
							} else {
								$dwp.ui.alert({ msg: data.retmsg });
							}
						} else {
						}
					},
					"json"
				)
				.fail(function () {
					$.unblockUI();
					$dwp.ui.alert({ msg: $fn.getCodeMsg("comm.msg_mo.msg003") });
				});
			*/
		},
		addFavoritePeople: function (empnos, orgcodes) {
			var _me = this;
			if (empnos == "") return;

			var _rtnlist = [];
			var _empnolist = empnos.split(",");
			var _orgcodelist = [];

			if (typeof orgcodes != "undefined" && orgcodes != "") {
				_orgcodelist = orgcodes.split(",");
				if (_empnolist.length != _orgcodelist.length) {
					_orgcodelist = [];
				}
			}

			function _callAdd(empno, orgcode) {
				var _rtnval = {};
				var _reqdata = { SHARE_EMPNO: empno, SHARE_ORGCODE: orgcode };
				$dwp.core.util
					.xAjax({
						url: $dwp.core.util.getProxyUrl(
							"{bookmark}/wfrmpeople?createdocument"
						),
						type: "POST",
						data: _reqdata,
						async: false,
						dataType: "json"
					})
					.done(function (data) {
						if (data.hasOwnProperty("result")) {
							if (data.result == "200") {
								//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg001")})
							} else {
								_rtnval = { msg: $fn.getCodeMsg(data.msgcode) };
								//$dwp.ui.alert({msg : $fn.getCodeMsg(data.msgcode)});
							}
						} else {
						}
					});
				return _rtnval;
			}

			for (var i = 0; i < _empnolist.length; i++) {
				var rtn;
				if (_orgcodelist.length == 0) {
					rtn = _callAdd(_empnolist[i], "");
				} else {
					rtn = _callAdd(_empnolist[i], _orgcodelist[i]);
				}
				if (!$.isEmptyObject(rtn)) {
					_rtnlist.push(rtn);
				}
			}
			if (_rtnlist.length == 1 && _empnolist.length == 1) {
				$dwp.ui.alert({ msg: _rtnlist[0].msg });
			} else {
				$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg001") });
			}
		},
		/*
		 * 메일작성 화면을 오픈하고 수신인을 자동으로 추가
		 * sendto : NotesID, 사번, 외부메일주소 형식을 사용 (다중값은 세미콜론 구분자를 사용)
		 *                       겸직 사용자의 경우 (NotesID 또는 사번) + "^" + 부서코드 형식으로 사용 가능함
		 * ex) : _$$.util.mailSend("10000hyun@gmail.com;10000hyun@mauminfo.com;CN=ManHyun Kim/OU=21702660/O=HANTA;SeungMin Lee/21702657/HANTA;21702670");
		 */
		mailSendWin: function (sendto, opt) {
			var _sendto = sendto || "";
			var _insertbdoy = typeof insertbody == "undefined" ? null : insertbody;
			var _opt = $.extend({ cardmail: "" }, opt);
			if (_sendto != "")
				_$$.util.setLocalStorage("dwp.mailsendto", $.trim(sendto)); //LocalStorage에 수신인 정보를 저장
			//if ($.trim(sendto) == "") {
			//	$fn.alert({msg : $fn.getCurLangMsg("수신인 정보가 없습니다")}); return;
			//}
			//_$$.util.setLocalStorage("dwp.mailsendto", $.trim(sendto));		//LocalStorage에 수신인 정보를 저장
			var _mailformurl =
				$fn.getPath("mail") +
				"/Memo?OpenForm" +
				(_sendto != "" ? "&newtype=localstorage_dwp.mailsendto" : "") +
				(_opt.cardmail != "" ? "&cardmail=" + _opt.cardmail : "");
			$fn.winopen(_mailformurl, "", {});
		},
		mailSend: function (sendto, insertbody, opt) {
			var _sendto = sendto || "";
			var _insertbdoy = typeof insertbody == "undefined" ? null : insertbody;
			var _opt = $.extend({ cardmail: "" }, opt);
			if (_sendto != "")
				_$$.util.setLocalStorage("dwp.mailsendto", $.trim(sendto)); //LocalStorage에 수신인 정보를 저장
			if (typeof dwpmo == "object") {
				var _opt = {
					link:
						$fn.getPath("mail") +
						"/Memo_mo?OpenForm" +
						(_sendto != "" ? "&newtype=localstorage_dwp.mailsendto" : ""),
					linktype: "PAGE",
					layer: "doc",
					subtype: "edit"
				};
				$dwp.core.mportal.loadPage(_opt);
			} else {
				var _h = $fn.getScreenInfo().doc_h * 1 - 10;
				var _ww = $fn.getScreenInfo().doc_w;
				//var _w = _ww > 1000 ? 1000 : _ww;
				var _w = _ww - 260;
				$fn.dialog(null, {
					modal: false,
					resizable: true,
					draggable: true,
					islangconvert: false,
					headerclass: "dwp-dialog-mail", //Dialog Object에 메일 전용 class 추가
					title: $fn.getCodeMsg("comm.title.js024"),
					width: _w,
					height: _h,
					position: { my: "center", at: "center+260", of: window },
					show: "fade", //effect
					hide: "fade", //effect
					insertbody: _insertbdoy,
					buttons: [],
					content: {
						url:
							$fn.getPath("mail") +
							"/Memo?OpenForm" +
							(_sendto != "" ? "&newtype=localstorage_dwp.mailsendto" : "") +
							(_opt.cardmail != "" ? "&cardmail=" + _opt.cardmail : "")
					}
				});
			}
		},
		/*
		 * 메신저 처리함수
		 */
		messenger: {
			/* UC 메신저 연동함수
				  getUserStatus : function(userIDs, callback) {
					  var _me = this
					  ,_rtn = []
					  ,_reqdata = {CMD : "FETCH_USER", UserIDS : userIDs, empnos : ""};
					  $.post(
						  //"http://202.31.8.242:12555"
						  "/messenger"
						  ,_reqdata
						  ,function(data){
							  $(data).find("result").each(function(){
								  var _o = {}
								  _o.userid = $(this).attr("userid");
								  _o.userstate = $(this).find("userstate").text();
								  _o.extstate = $(this).find("extstate").text();
								  _o.phonestate = $(this).find("phonestate").text();
								  _o.connect_type = $(this).find("connect_type").text();
								  _o.has_user = $(this).attr("has_user");
								  _o.css = _me.getStatusClass(_o.userstate);
								  _rtn.push(_o);
							  })
							  if (typeof callback == "function") {
								  callback(_rtn);
							  }
						  }
						  ,'xml'
					  );
				  }
				  ,getMUserStatus : function(userIDs, callback) {
					  var _me = this
					  ,_rtn = []
					  ,_reqdata = {CMD : "FETCH_USER", UserIDS : userIDs, empnos : ""};
					  $.post(
						  //"http://202.31.8.242:12555"
						  dwpmo.info.protocol + dwpmo.info.domain + "/messenger"
						  ,_reqdata
						  ,function(data){
							  $(data).find("result").each(function(){
								  var _o = {}
								  _o.userid = $(this).attr("userid");
								  _o.userstate = $(this).find("userstate").text();
								  _o.extstate = $(this).find("extstate").text();
								  _o.phonestate = $(this).find("phonestate").text();
								  _o.connect_type = $(this).find("connect_type").text();
								  _o.has_user = $(this).attr("has_user");
								  _o.css = _me.getStatusClass(_o.userstate);
								  _rtn.push(_o);
							  })
							  if (typeof callback == "function") {
								  callback(_rtn);
							  }
						  }
						  ,'xml'
					  );
				  }
				  */
			// 온누리 메신져 Present 연계처리
			getUserStatus: function (userIDs, callback) {
				var _me = this,
					_rtn = [],
					_reqdata = { LINKAGE_CMD: "present", USERID: userIDs, TYPE: "json" };
				$.post(
					"/messenger",
					_reqdata,
					function (data) {
						var _o = {};
						_o.userid = data.userid;
						_o.userstate = data.status;
						_o.extstate = "";
						_o.phonestate = "";
						_o.connect_type = "";
						_o.has_user = "";
						_o.css = _me.getStatusClass(data.status);
						_rtn.push(_o);

						if (typeof callback == "function") {
							callback(_rtn);
						}
					},
					"json"
				);
			},
			getMUserStatus: function (userIDs, callback) {
				var _me = this,
					_rtn = [],
					_reqdata = { LINKAGE_CMD: "present", USERID: userIDs, TYPE: "json" };
				$.post(
					dwpmo.info.protocol + dwpmo.info.domain + "/messenger",
					_reqdata,
					function (data) {
						var _o = {};

						_o.userid = data.userid;
						_o.userstate = data.status;
						_o.extstate = "";
						_o.phonestate = "";
						_o.connect_type = "";
						_o.has_user = "";
						_o.css = _me.getStatusClass(data.status);
						_rtn.push(_o);

						if (typeof callback == "function") {
							callback(_rtn);
						}
					},
					"json"
				);
			},
			/*
				  ,getStatusClass : function(status) {
					  var _me = this;
					  if (status == "1") {
						  return "online";
					  } else if (status == "2") {
						  return "out" ;
					  } else if (status == "3") {
						  return "dont";
					  } else if (status == "4") {
						  return "back" ;
					  } else if (status == "9") {
						  return "offline";
					  }
				  }
				  */
			getStatusClass: function (status) {
				var _me = this;
				if (status == "1") {
					return "online";
				} else if (status == "2") {
					return "out";
				} else if (status == "3") {
					return "dont";
				} else if (status == "4") {
					return "back";
				} else if (status == "0" || status == "7") {
					return "offline";
				}
			},
			chat: function (userIDs) {
				var _me = this,
					_reqdata = {
						LINKAGE_CMD: "CHAT",
						SENDID: $fn.getCurUser().pinfo.mailid,
						DESTID: userIDs
					};

				$.post(
					"/messenger",
					_reqdata,
					function (data) {
						console.log("status", data);
					},
					"json"
				);
			},
			/*
				  ,chat : function(userIDs) {
					  var _me = this
					  ,_reqdata = {CMD : "HTTP_SEND_CHAT"
						  , userid : $fn.getCurUser().pinfo.mailid
						  , dest_ids : userIDs
						  , user_empno : ""
						  , empno : ""};

					  $.post(
						  //"http://202.31.8.242:12555"
						  "/messenger"
						  ,_reqdata
						  ,function(data){
							  console.log("status",data) ;
						  }
						  , 'json'
					  )	;
				  }
				  */
			mchat: function (userIDs) {
				var _me = this;
				(_tokennm = "LtpaToken"),
					(_reqdata = {
						CMD: "HTTP_SEND_CHAT",
						userid: $fn.getCurUser().pinfo.mailid,
						dest_ids: userIDs,
						user_empno: "",
						empno: ""
					});

				var _url = "ucware://ucware.com?";
				var _param = "id=" + $fn.getCurUser().pinfo.empno;
				//_param += "&password=" + $fn.getCurUser().pinfo.empno;
				_param += "&action=chat";
				_param += "&list=" + userIDs;

				dwpmo.getCookie(dwpmo.info.domain, _tokennm, function (cookieValue) {
					_url = _url + _param + "&" + _tokennm + "=" + cookieValue;
					//console.log(_url);
					window.open(_url, "_system");
				});
				//console.log("chat:", _url + _param)
				//window.open(_url + _param, "_system");
			},
			memo: function (userIDs) {
				var _me = this,
					_reqdata = {
						CMD: "HTTP_SEND_MESSAGE",
						userid: $fn.getCurUser().pinfo.mailid,
						dest_ids: userIDs,
						user_empno: "",
						empno: ""
					};

				$.post(
					//"http://202.31.8.242:12555"
					"/messenger",
					_reqdata,
					function (data) {
						console.log("status", data);
					},
					"json"
				);
			}
		},


		webchat: {
			TARGET_ORIGIN: "http://gw.bn-korea.com:8000"
			, chat: function (userinfos) {
				var _me = this
				,_webchathost = $fn.getSysinfo().webchathost
				, _targetWindow = _me.getTargetWindow();

				if (_targetWindow == null) return;

				$dwp.app.winPost.sendWebChatMessage(_targetWindow, { event: "chatting", data: userinfos },  _webchathost);

				_me.openWebChat();
			}
			, getTargetWindow: function () {
				var _$iframe = $("iframe[name=_WEB_CHAT]");
				if (_$iframe.size() == 0) {
					console.log("IFRAME[_WEB_CHAT] Not Found");
					return null;
				}
				return _$iframe.get(0).contentWindow;
			}
			// WebChat Open처리
			, openWebChat: function () {
				// WEB CHAT는 초기 OPEN한 상태로 유지 CLOSE 안되게 함.
				// 해당 APP을 열기함.
				var _$side = $("div.xware-main div.xware-side")
					, _$sideApp = $("div.xware-main div.xware-side-app")
					, _$sidecut = $("div.xware-side-shotcut", _$side)
					, _$sideContents = $("#_SIDE_APP_webchat", _$sideApp);

				$("li", _$sidecut).removeClass("active");
				$("li[data-id=webchat]", _$sidecut).addClass("active");

				$("div.xware-side-contents", _$sideApp).addClass("dwp-none");

				var _inst = _$sideContents.draggable("instance");
				if (_inst == undefined) {
					_$sideApp.removeClass("dwp-none").addClass("active");
				} else {
					_$sideApp.removeClass("dwp-none").removeClass("active");
				}
				_$sideContents.removeClass('dwp-none');
			}
		},

		/*
		 * 사진 변경하기
		 *
		 */
		selectPic: function (opt) {
			var _me = this,
				_opt = $.extend({ ismobile: false }, opt),
				_content = {
					url: "/dwp/com/portal/userphoto.nsf/wfrmpic?openform",
					data: {}
				};

			if (_opt.hasOwnProperty("empno") && _opt.empno != "") {
				_content.data = { empno: _opt.empno };
			}

			$dwp.ui.dialog.init(
				null,
				$.extend(
					{
						title: _opt.title || $dwp.core.lang.getCodeMsg("comm.title.js025"),
						width: _opt.ismobile ? "100%" : 620,
						height: _opt.ismobile ? "auto" : 420,
						modal: true,
						content: _content,
						initcallback: function (_$dialog) {
							var _$img = $("img[name=_pic]", _$dialog.element);
							var _$fileInput = $("input[type=file]", _$dialog.element);
							var likefilter = "png|jpg|jpeg|gif";

							$fn.getPicError(_$img);

							// 사진 선택하기
							$("div[name=pic_upload]", _$dialog.element)
								.off("click")
								.on("click", function () {
									_$fileInput.click();
								});

							function isLikeFilter(data) {
								var _flist = likefilter.split("|");
								var _rtn = false;
								for (var i = 0, j = _flist.length; i < j; i++) {
									if (
										data.files[0].name
											.toUpperCase()
											.indexOf("." + _flist[i].toUpperCase()) == -1
									) {
										_rtn = true;
										break;
									}
								}
								return _rtn;
							}

							_$fileInput.get(0).addEventListener("change", function () {
								var reader = new FileReader();
								reader.addEventListener(
									"load",
									function () {
										_$img.get(0).src = this.result;
										_$img.get(0).onload = function () {
											var _dataUrl = _me.imageResize(_$img.get(0), {
												type: "image/png",
												width: 180,
												height: 180,
												isdataurl: true
											});
											var regExp = /data\:(image\/[^;]+);base64,(.*)/gi;
											if (regExp.test(_dataUrl)) {
												var _type = RegExp.$1;
												var _data = RegExp.$2;

												$("input[name=imgDataType]", _$dialog.element).val(
													_type
												);
												$("input[name=imgDataURL]", _$dialog.element).val(
													_data
												);
											}
										};
									},
									false
								);

								if (!isLikeFilter(_$fileInput.get(0))) {
									$fn.alert({
										msg: $fn
											.getCodeMsg("comm.msg.msg041")
											.replace("[$1]", likefilter)
									});
									return;
								}
								reader.readAsDataURL(_$fileInput.get(0).files[0]);
							});

							$("div[name=pic_save]", _$dialog.element)
								.off("click")
								.on("click", function () {
									if (
										$("input[name=imgDataType]", _$dialog.element).val() == ""
									) {
										$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg042") });
										return;
									}
									/*
										  if ( $("input[name=imgDataType]", _$dialog.element).val() != "image/jpeg" ){
											  $fn.alert({msg : $fn.getCodeMsg("사진 이미지는 jpg만 가능합니다.")})
											  return;
										  }
										  */
									$fn.block();
									_$fileInput.remove();
									$("form", _$dialog.element).ajaxSubmit({
										dataType: "text",
										beforeSubmit: function (arr, $form, options) { },
										success: function (data, statusText, xhr, $form) {
											var _jdata = null;
											_jdata = $.parseJSON(data);
											$fn.unblock();
											$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg043") });
											if (typeof _$dialog.options.callback == "function") {
												_$dialog.options.callback(_$dialog);
											}
											_$dialog.close();
										},
										error: function (xhr, textStatus) {
											$.unblockUI();
											return false;
										}
									});
								});
							// 사진 초기화
							$("div[name=pic_init]", _$dialog.element)
								.off("click")
								.on("click", function () {
									$fn.block();
									$fn
										.xAjax({
											url:
												"/dwp/com/portal/userphoto.nsf/photo_remove?openagent",
											type: "GET",
											async: false,
											data: _$dialog.options.content.data
										})
										.done(function () {
											$fn.unblock();
											_$img.attr(
												"src",
												$dwp.core.getPath("weblib") +
												"/images/common/default-person.png"
											);
											$fn.toast({ msg: $fn.getCodeMsg("comm.msg.msg043") });
											if (typeof _$dialog.options.callback == "function") {
												_$dialog.options.callback(_$dialog);
											}
											_$dialog.close();
										})
										.fail(function () {
											$.unblockUI();
											return false;
										});
								});
						}
					},
					_opt
				)
			);
		},
		conference: function (opt) {
			var _me = this,
				_url = "/v2conf/",
				_opt = $.extend(
					{
						userid: $fn.getCurUser().pinfo.empno, // 주최자 ID
						destids: "21702670", // 참석자 ID(복수,)
						title: "test", // 화상회의 제목
						desc: "testdesc", // 화상회의 설명
						sdatetime: moment().format("YYYYMMDDHHmm"), // 회의시작시간(YYYYMMDDHHMM)
						term: $fn.getSysinfo().confserverdefaulttime, // 회의수행시간 (분단위)
						count: 5, // 참석인원수
						rcount: 10 // 연결할 폴리컴 화상회의 실 수
					},
					opt
				);

			// 화상회의 ID생성
			_url += _opt.userid;
			_url += "/" + decodeURIComponent(_opt.title);
			_url += "/" + decodeURIComponent(_opt.desc);
			_url += "/" + _opt.sdatetime;
			_url += "/" + _opt.term;
			_url += "/" + _opt.count;
			_url += "/" + _opt.rcount;

			$fn
				.xAjax({
					url: _url,
					dataType: "json",
					async: false,
					cache: true
				})
				.done(function (data) {
					if (data.result) {
						var _confid = data.result.Confid;
						/*
								var _$confiframe = $("iframe[name=conference]");
								if (_$confiframe.size() == 0) {
									_$confiframe = $("<iframe name='conference' src='about:blank' frameBorder='0' style='width:0px;height:0px;'></ifrmae").appendTo($("body"));
								}
								_$confiframe.get(0).src = $fn.getSysinfo().confserverhost + "/enterFrommsg.aspx?cid=" + _confid + "&uid=" + _opt.userid;
								*/
						//console.log($fn.getSysinfo().confserverhost + "/enterFrommsg.aspx?cid=" + _confid + "&uid=" + _opt.userid);
						//window.open($fn.getSysinfo().confserverhost + "/enterFrommsg.aspx?cid=" + _confid + "&uid=" + _opt.userid, "")
						_me.winopenExt(
							$fn.getSysinfo().confserverhost +
							"/enterFrommsg.aspx?cid=" +
							_confid +
							"&uid=" +
							_opt.userid,
							""
						);

						// 참석요청 알림 발송
						$dwp.core.util.cmdPost(
							$fn.getProxyUrl($fn.getPath("main") + "/wSendConf?OpenAgent"),
							{
								sender: $fn.getCurUser().notesid,
								destids: _opt.destids,
								confid: _confid,
								sendurl:
									$fn.getSysinfo().confserverhost +
									"/enterFrommsg.aspx?cid={confid}&uid={userid}",
								title: _opt.title,
								desc: _opt.desc
							},
							function (rdata) { }
						);
					} else {
						console.log("Error");
					}
				});

			// 새창으로 회의 참석 호출
			// 회의 참석요청 링크 발송
		},
		/*
		 * Url 파라미터 Parser
		 * @param	u		url
		 * @return	json	파라미터 JSON Object
		 */
		getUrlPaser: function (u) {
			var _u = u;
			if (_u === "") {
				return {};
			}
			if (_u.indexOf("=") == -1) return {};
			if (_u.indexOf("?") > 0) {
				_u = u.substring(u.indexOf("&") + 1, u.length);
			}
			tmp = '{"' + _u.replace(/&/gi, '","').replace(/=/gi, '":"') + '"}';
			return JSON.parse(tmp);
		},
		/*
		 * Notes Name Parsing
		 */
		getName: function (nm) {
			var _me = this,
				_regExp1 = /CN=(.*)\/OU=(.*)\/O=(.*)/i,
				_regExp2 = /CN=(.*)\/O=(.*)/i,
				_regExp3 = /(.*)\/(.*)\/(.*)/,
				_regExp4 = /(.*)\/(.*)/,
				_name = { cn: "", ou: "", o: "", abbreviate: "", canonical: "" };

			if (_regExp1.test(nm)) {
				_name.cn = RegExp.$1;
				_name.ou = RegExp.$2;
				_name.o = RegExp.$3;
				_name.abbreviate = _name.cn + "/" + _name.ou + "/" + _name.o;
				_name.canonical = nm;
			} else if (_regExp2.test(nm)) {
				_name.cn = RegExp.$1;
				_name.ou = "";
				_name.o = RegExp.$2;
				_name.abbreviate = _name.cn + "/" + _name.o;
				_name.canonical = nm;
			} else if (_regExp3.test(nm)) {
				_name.cn = RegExp.$1;
				_name.ou = RegExp.$2;
				_name.o = RegExp.$3;
				_name.canonical =
					"CN=" + _name.cn + "/OU=" + _name.ou + "/O=" + _name.o;
				_name.abbreviate = nm;
			} else if (_regExp4.test(nm)) {
				_name.cn = RegExp.$1;
				_name.ou = "";
				_name.o = RegExp.$2;
				_name.canonical = "CN=" + _name.cn + "/O=" + _name.o;
				_name.abbreviate = nm;
			} else {
				_name.cn = nm;
				_name.ou = "";
				_name.o = "";
				_name.canonical = nm;
				_name.abbreviate = nm;
			}
			return _name;
		},
		geticonurl: function (i_nm) {
			var _re = "";
			if (i_nm == "") {
				return re;
			}
			if ($dwp.ui.file._ATTACH_ICONS.hasOwnProperty(i_nm)) {
				_re = $dwp.ui.file._ATTACH_ICONS[i_nm].icon;
			} else {
				_re = $dwp.ui.file._ATTACH_ICONS["etc"].icon;
			}
			return _re;
		},
		getsvgurl: function (i_nm) {
			var _re = "";
			if (i_nm == "") {
				return re;
			}
			if ($dwp.ui.file._ATTACH_ICONS.hasOwnProperty(i_nm)) {
				_re = $dwp.ui.file._ATTACH_ICONS[i_nm].svg;
			} else {
				_re = $dwp.ui.file._ATTACH_ICONS["etc"].svg;
			}
			return _re;
		},
		/*
		 * 인쇄용 Html 리턴 함수
		 */
		getPrinthtml: function (opt) {
			var _opt = $.extend({ url: "" }, opt),
				rtnVal = "";

			_$$.util.xAjax({
				url: $fn.getProxyUrl(_opt.url),
				data: { did: "RTNJS_EXT" },
				dataType: "html",
				async: false,
				success: function (data, textStatus, req) {
					var _$rtnjs = $("#RTNJS_EXT");
					if (_$rtnjs.size() == 0) {
						_$rtnjs = $(
							"<div id='RTNJS_EXT' style='display:none'></div>"
						).appendTo($("body"));
					}
					_$rtnjs.html(data);
					rtnVal = _$rtnjs.html();
					_$rtnjs.remove();
				}
			});
			return rtnVal;
		},
		/*
		 * 결재 권한 체크 다이얼 로그
		 */
		readrequestprocess: function (opt) {
			var _opt = $.extend(
				{
					title: $fn.getCodeMsg("comm.title.js061"),
					width: opt.width,
					height: opt.height,
					modal: true,
					data: opt.data,
					islangconvert: false,
					buttons: [
						{
							title: $fn.getCodeMsg("comm.btn.confirm"), // 확인
							css: "confirm",
							click: function (_$dialog) {
								var de = _$dialog.element,
									cmt = $("textarea[name=stmpComment]", de).val();
								_url = $fn.getProxyUrl(
									"/" + opt.data.dbpath + "/wcmdpost?createdocument"
								);

								if (cmt.length < 10) {
									$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.009") });
									return false;
								}

								var _actopt = {
									actiontype: "readrequest",
									Unid: opt.data.dockey,
									Arg1: opt.data.dbpath,
									Arg2: cmt
								};
								$fn.cmdPost(
									_url,
									_actopt,
									$dwp.app.aprv.com.readrequestprocess,
									"json"
								);

								_$dialog.close();
							}
						},
						{
							title: $fn.getCodeMsg("comm.btn.cancel"), // 취소
							css: "cancel",
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					],
					content: {
						url: $fn.getProxyUrl(
							"/" + opt.data.dbpath + "/wFrmAprvComDialog?OpenForm"
						)
					}
				},
				opt
			);

			$fn.dialog(null, _opt);
		},
		isTwoByteCheck: function (v) {
			var _isfind = false;
			for (var i = 0; i < v.length; i++) {
				var c = escape(v.charAt(i));
				if (c.length == 1) {
				} else if (c.indexOf("%u") != -1) {
					_isfind = true;
					return _isfind;
				}
			}
			return _isfind;
		},
		//숫자필드 체크해서 숫자가
		isNumericCheck: function (arg1, opt) {
			var _opt = $.extend({ isdecimal: true }, opt);
			var tmp = arg1,
				regDigit = null;

			tmp = tmp.replace(/,/gi, "");
			var absTmp = Math.abs(tmp);
			if (tmp.length == 1 && tmp == "") {
				return true;
			} else if (_opt.isdecimal) {
				//소숫점 허용
				regDigit = /[^0-9.]/;
				return !regDigit.test(absTmp);
			} else {
				//소숫점 허용하지 않음
				regDigit = /[^0-9]/;
				return !regDigit.test(absTmp);
			}
		},
		// 사내망 여부 체크
		isInIpCheck: function () {
			var _ipcheck = false,
				_iplist = _$$.getSysinfo().iplist,
				_uip = $fn.getCurUser().ip;

			//Portal Client IP정보가져오기
			if (typeof ePortalConfig == "object") {
				if (ePortalConfig.hasOwnProperty("clientIP")) {
					_uip = ePortalConfig.clientIP;
				}
			}

			if (_iplist == "") return true;
			if (_uip == "") return false;

			var _uiplist = _uip.split(".");
			var _ipslist = _iplist.split(";");

			for (var i = 0; i < _ipslist.length; i++) {
				var _vlist = _ipslist[i].split(".");
				var _check = true;
				for (var j = 0; j < _vlist.length; j++) {
					if (_vlist[j] == "*" || _vlist[j] == _uiplist[j]) {
					} else {
						_check = false;
						break;
					}
				}
				if (_check) {
					_ipcheck = true;
					break;
				}
			}
			return _ipcheck;
		},
		//
		isExUser: function (empno) {
			var _me = this,
				_exuser = _$$.getSysinfo().exusers,
				_empno =
					typeof empno != "undefined" ? empno : _$$.getCurUser().pinfo.empno;

			if (_exuser == "") return false;
			if (_exuser.indexOf(_empno) > -1) return true;
			return false;
		},
		ismobile: function () {
			return $dwp.core.util.getDeviceInfo.type() != "PC";
		},
		//
		exFileMime: function (data) {
			var _data = [],
				_pattern = [];
			_pattern[0] = /mime\.(htm|dat)/i;
			_pattern[1] = /mime\.\d{3}\.(htm|dat)/i;
			_pattern[2] = /mime\.unknown/i;
			_pattern[3] = /mime\.\d{3}\.unknown/i;
			_pattern[4] = /enElement/i;
			_pattern[5] = /enElement.\d{3}\.txt/i;
			_pattern[6] = /\?/;
			_pattern[7] = /\.octet-stream/i;
			_pattern[8] = /MAUM_IMG_/i;
			_pattern[9] = /C\.bmp/i;
			_pattern[10] = /C\.\d{1}\.bmp/i;
			_pattern[11] = /\.unknown/i;
			_pattern[12] = /__MIME_ATTACHED_FILE_/i;
			_pattern[13] = /TCC_IMG_/i;
			_pattern[14] = /C.PNG/i;
			_pattern[15] = /C.\d{1}\.PNG/i;
			_pattern[16] = /image\d{3}\.png/i;
			_pattern[17] = /image\d{3}\.\d{3}\.png/i;

			if (typeof data == "string") {
				try {
					data = JSON.parse(data);
				} catch (e) {
					return _data;
				}
			}
			function _patternCheck(v) {
				var _ismatch = false;
				$.each(_pattern, function (i, o) {
					if (o.test(v)) {
						_ismatch = true;
						return;
					}
				});
				return _ismatch;
			}

			$.each(data, function (i, o) {
				if (!_patternCheck(o.name)) {
					_data.push(o);
				}
			});
			return _data;
		},
		// 결재 완료함용 첨부체크
		isAttachInfo: function (o) {
			var _me = this;
			if (o.hasOwnProperty("_attachinfo") && o._attachinfo != "") {
				_attachinfo = o._attachinfo;
			} else {
				if (!o.hasOwnProperty("_attachid") || o._attachid == "") return false;
				if (!o.hasOwnProperty("_attachpath") || o._attachpath == "")
					return false;
				//if (!o.hasOwnProperty("_attachsize") || o._attachsize == "") return false;
				if (!o.hasOwnProperty("_attachname") || o._attachname == "")
					return false;

				var _namelist = o._attachname.split(";");
				//var _sizelist = o._attachsize.split(";")
				//if (_namelist.length != _sizelist.length) return false;

				var _attachinfo = $.map(_namelist, function (v, i) {
					var _url =
						"/" +
						o._attachpath +
						"/0/" +
						o._attachid +
						"/$FILE/" +
						encodeURIComponent(v);
					//return '{"url":"' + _url + '","name":"' + v + '","size":"' + _sizelist[i] + '"}';
					return '{"url":"' + _url + '","name":"' + v + '","size":""}';
				}).join(",");

				_attachinfo = "[" + _attachinfo + "]";
			}

			var obj = _me.exFileMime(_attachinfo);

			if (obj.length > 0) {
				return true;
			} else {
				return false;
			}
		},
		/**
		 * User Widget
		 * @param	{object}	options
		 * @param	{object}	el			dom element or jquery selector
		 * @return	{object}	user instance
		 */
		widget: function (opt, el) {
			var _$el = null,
				_opt = $.extend({}, opt),
				_topt = { type: "", selector: "" },
				_MODULE_NM = "dwp.uwidget";

			function _create() {
				$.widget(_MODULE_NM, {
					options: {
						initCallback: null
					},
					_create: function () {
						console.log("dwp.custom Create");
					},
					_init: function () {
						var _me = this;
						if (typeof _me.options.initCallback == "function") {
							_me.options.initCallback(_me);
						}
					},
					destroy: function () {
						var _me = this;
						_me.element.empty();
						_me._super();
					}
				});
			}

			if (_opt.ispreview) {
				_topt.type = "preview";
			} else if (_opt.hasOwnProperty("did") && _opt.did != "") {
				_topt.type = "did";
				_topt.selector = "#" + _opt.did;
			} else if (_opt.ismobile) {
				_topt.type = "mobile";
				_topt.layer = _opt.layer;
			}

			_$el = el || $dwp.core.getTarget(_topt);

			if (typeof $.fn.uwidget == "undefined") {
				_create();
			}
			_$el.uwidget(_opt);

			return _$el.uwidget("instance");
		}
		// $$.core.utill  end
	};
})($dwp.cns("core"), jQuery);

$.fn.getCursorPosition = function () {
	var caretID = "caret";
	var cc = document.createElement("span");
	cc.id = caretID;

	if (window.getSelection().focusNode != null) {
		window
			.getSelection()
			.getRangeAt(0)
			.insertNode(cc);
		this.blur();
	} else {
		this.focus();
	}
};

$.fn.setCursorPosition = function (_html) {
	var caretID = "caret";
	var node = this;
	//node.innerHTML = node.innerHTML.replace(/<[/]?span[^i|>]*>/g, "");
	var range = document.createRange();
	cc = document.getElementById(caretID);

	if (cc) {
		$(node)
			.find("#" + caretID)
			.wrap(_html);
		range.selectNode(cc);
		range.deleteContents();
	} else {
		$(node).append(_html);
	}
};
/*
 * Print 처리함수
 */
$.fn.print = function (opt) {
	var _opt = $.extend({}, opt);
	var _pinfo = $fn.getCurUser().pinfo;
	var _token = $.cookie("LtpaToken");
	var _url = $fn.getProxyUrl(_opt.proof.url + "%2526popup=1%2526xpi=1");
	_url =
		"http://" +
		location.hostname +
		$fn.getPath("main") +
		"/wfrmprint?ReadForm&url=" +
		decodeURIComponent(_url);
	var header =
		"<HTML>\n<HEAD>\n" +
		"<meta charset='utf-8'/>\n" +
		"<meta http-equiv='X-UA-Compatible' content='IE=edge'/>\n" +
		"<link rel='apple-touch-icon-precomposed' href='/tcclibs/images/favicon/16.ico' />\n" +
		"<link rel='shortcut icon' href='/tcclibs/images/favicon/16.ico' />\n" +
		"<link rel='icon' type='image/x-icon' href='/tcclibs/images/favicon/16.ico' />\n" +
		"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/components-style.css?_202008041' rel='stylesheet' />\n" +
		"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/pages.css' rel='stylesheet' />\n" +
		"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/common-print-style.css?_20208041' rel='stylesheet' />\n" +
		"<script type='text/javascript' src='" + $fn.getPath("weblib") + "/js/lib/jquery-2.2.4.js'></script>\n" +
		"<script type='text/javascript' src='" + $fn.getPath("weblib") + "/js/core/core.print.js'></script>\n";

	if (opt.iseproof) {
		header += "<script type='text/javascript' src='" + $fn.getPath("weblib") + "/js/lib/OfficeXPI.js'></script>\n";
	}

	header += "<script type='text/javascript'>\n";
	if (opt.hasOwnProperty("comment") && !$.isEmptyObject(opt.comment)) {
		header += "var b0014 = '" + $fn.getCodeMsg("aprv.btn.b0014") + "';\n";
		header += "var b0015 = '" + $fn.getCodeMsg("aprv.btn.b0015") + "';\n";
	}

	header += "$(document).ready(function(){\n";
	if (opt.iseproof) {
		header += "$('div.eproof').off('click').on('click', function(){\n";
		header += "var url = '" + _url + "';\n";
		header += "var userid = '" + _pinfo.empno + "';\n";
		header += "var usernm = '" + $fn.getCurLangMsg(_pinfo.name) + "';\n";
		header += "var comcd = '" + _pinfo.comcode + "';\n";
		header += "var comnm = '" + $fn.getCurLangMsg(_pinfo.comname) + "';\n";
		header += "var partcd = '" + _pinfo.partcode + "';\n";
		header += "var partnm = '" + $fn.getCurLangMsg(_pinfo.orgname) + "';\n";
		header += "var token = '" + _token + "';\n";
		header += "var pi = 'printdlg=1;showui=" + _opt.proof.showui + ";sdoc_name=" + _opt.proof.docname + ";sdoc_type=" + opt.proof.doctype + ";';\n";
		header += "var pf = '';\n";
		header += "var docnm = '" + opt.proof.docname + "';\n";
		//header += "OpiPrint(userid, usernm, comcd, comnm, partcd, partnm, pi, pf, docnm);"
		//header += "OpiPrintUrl(userid, usernm, comcd, comnm, partcd, partnm, url, pi, pf);"
		header += "OpiPrintUrl(userid, usernm, comcd, comnm, partcd, partnm, token, url, pi, pf);";
		header += "});\n";
	}
	if (opt.hasOwnProperty("comment") && !$.isEmptyObject(opt.comment)) {
		//header += 'uprint.callfunc("' + opt.comment.fn.replace(/\"/g, "'") + '");\n';     //접기 상태로 시작.
		if (opt.comment.hasOwnProperty("fn") && opt.comment.fn != "") {
			header += "$('div.comment').off('click').on('click', function(){\n";
			header += 'uprint.callfunc("' + opt.comment.fn.replace(/\"/g, "'") + '");';
			header += "});\n";
		}
	}
	header += "});\n";
	header += "</script>\n";
	if (_opt.hasOwnProperty("showcss") || _opt.hasOwnProperty("hidecss")) {
		header += "<style>\n";
		if ($.isArray(_opt.showcss)) {
			for (var i = 0; i < _opt.showcss.length; i++) {
				header += _opt.showcss[i] + "{ display : block !important; }\n";
			}
		}
		if ($.isArray(_opt.hidecss)) {
			for (var i = 0; i < _opt.hidecss.length; i++) {
				header += _opt.hidecss[i] + "{ display : none !important; }\n";
			}
		}
		header += "</style>\n";
	}
	header += "<title>" + $fn.getCurLangMsg($dwp.core.portal.getHostCom().nm) + " / " + $fn.getCurLangMsg($fn.getCurUser().pinfo.name) + "</title>\n" +
		/*
		"<style>\n"+
		"body {margin : 5px;}\n"+
		"div.dwp-page-heading { display : none !important;}\n"+
		"div.dwp-comment-area { display : none !important;}\n"+
		"div.dwp-near-view { display : none !important;}\n"+
		"div.dwp-btn.icon.dwp-btn-top { display : none !important;}\n"+
		"div.dwp-btn.btn-option-info { display : none !important;}\n"+
		"div.dwp-btn-group:not(.print-btn), div.dwp-btn:not(.print-btn) { display : none !important;}\n"+
		"div.detail-view div.close-area { display : block !important;}\n"+
		"@media print { div.print-btn {display : none;} }\n"+
		"</style>\n"+
		*/
		"</HEAD>\n<BODY>\n";
	//console.log(header);
	var html = "";
	this.each(function (i, e) {
		html +=
			"<div class='aligner print-btn' data-top='xs' style='padding-bottom:10px;border-bottom:1px solid #ddd'>";
		html += "<div class='right'>";
		html += "<div class='dwp-btn-group print-btn'>";
		html +=
			"<div class='dwp-btn print-btn' onclick='window.print()'><span>" +
			$fn.getCodeMsg("comm.btn.print") +
			"</span></div>";
		if (opt.iseproof) {
			//html += "&nbsp;<div class='dwp-btn print-btn eproof'><span>" + $fn.getCodeMsg("comm.btn.eproof")+ "</span></div>";
		}
		if (opt.hasOwnProperty("comment") && !$.isEmptyObject(opt.comment)) {
			html += "&nbsp;<div class='dwp-btn print-btn comment'><span>" +
				// $fn.getCodeMsg(opt.comment.title) +
				$fn.getCodeMsg("aprv.btn.b0015") +  //접기 상태로 시작
				"</span></div>";
		}
		html +=
			"&nbsp;<div class='dwp-btn print-btn' onclick='window.close()'><span>" +
			$fn.getCodeMsg("comm.btn.close") +
			"</span></div>";
		html += "</div></div></div>";
		html += $(e).html();
	});

	var iBody = $("#iBody", this);
	if (iBody.size() > 0) {
		var _body =
			iBody.get(0).contentWindow ||
			(iBody.get(0).contentDocument.document || iBody.get(0).contentDocument);
		var _spos = html.indexOf('<span id="bodyFld"');
		var _epos = html.indexOf("</span>", _spos) + 7;
		html =
			html.substring(0, _spos - 1) +
			'<span id="bodyFld" style="display:block;padding:4px;width:100%">' +
			_body.document.documentElement.innerHTML +
			"</span>" +
			html.substring(_epos, html.length - 1);
	}

	// 추가문서 인쇄
	if (typeof _opt.adddoc != "undefined") {
		for (var i = 0; i < _opt.adddoc.length; i++) {
			html += "<br style='page-break-before:always;'/>";
			//html += "<b>[별첨" + (i + 1) + "]</b><br>";
			html += $dwp.core.util.getPrinthtml(_opt.adddoc[i]);
		}
	}

	html += "</BODY>\n</HTML>";

	html = html.replace(/<script[^>]*?>[\s\S]*?<\/script>/gi, "");
	html = html.replace(/<style\sname="dwp_css"/gi, '<ostyle name="dwp_css"');
	html = html.replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, "");
	html = html.replace(/<ostyle\sname="dwp_css"/gi, '<style name="dwp_css"');

	html = header + html;

	var state = "toolbar=0,location=0,status=0,menubar=1,scrollbars=1,resizable=1,width=780,height=600,top=100,left=100";
	var printWP = window.open($fn.getPath("gwlib") + "/blank.htm", "printWebPart", state);

	printWP.document.open();
	printWP.document.write(html);
	printWP.document.close();

	/*
	var iBody = $("#iBody", this);
	var iBody_html = "";

	function setIBody() {
		try {
			var _$iframe = printWP.document.getElementById("iBody");
			if (_$iframe == null) { setTimeout(function(){setIBody();}, 10); return;}

			var _ibody = _$iframe.contentWindow || ( _$iframe.contentDocument.document || _$iframe.contentDocument);

			_ibody.document.open();
			_ibody.document.write(iBody_html);
			_ibody.document.close();
		} catch(e) {
			console.log(e);
		}
	}

	if (iBody.size() > 0) {
		var _body = iBody.get(0).contentWindow || (iBody.get(0).contentDocument.document || iBody.get(0).contentDocument);

		iBody_html = _body.document.documentElement.innerHTML;

		setIBody();
	}
	*/

	return this;
};
/*
 * jquery val 확장 함수
 */
$.fn.xval = function (val) {
	var _elem = $(this),
		rval = "";
	if (_elem.size() == 0) return;
	if (typeof val == "undefined") {
		if (_elem.get(0).tagName == "INPUT") {
			if (_elem.is(":text")) {
				rval = _elem.val();
				if (_elem.is("[data-type]") && _elem.attr("data-type") == "date") {
					if (rval != "") {
						try {
							var _locale = $dwp.core.lang.getLocale();
							var tval = rval;
							if (_locale.dateonly.indexOf("-") > -1) {
								tval = tval.replace(/\./g, "-");
							} else {
								tval = tval.replace(/\./g, "/");
							}
							if (moment(tval, _locale.dateonly).isValid()) {
								rval = moment(tval, _locale.dateonly).format("YYYY-MM-DD");
							}
						} catch (e) { }
					}
				}
			} else if (_elem.is(":checkbox")) {
				rval = $(
					"input[name='" + _elem.attr("name") + "']:checkbox:checked",
					_elem.parent()
				).val();
			} else if (_elem.is(":radio")) {
				rval = $(
					"input[name='" + _elem.attr("name") + "']:radio:checked",
					_elem.parent()
				).val();
			} else {
				rval = _elem.val();
			}
		} else if (_elem.get(0).tagName == "SELECT") {
			//console.log("xval1")
			rval = $("option:selected", _elem).val();
		} else {
			//console.log("xval2")
			rval = _elem.val();
		}
		return typeof rval == "undefined" ? "" : rval;
	} else {
		var _val = [];
		if ($.isArray(val)) {
			_val = val;
		} else {
			_val.push(val);
		}
		if (_elem.get(0).tagName == "INPUT") {
			if (_elem.is(":text")) {
				if (_elem.is("[data-type]") && _elem.attr("data-type") == "date") {
					if (val != "") {
						try {
							var _locale = $dwp.core.lang.getLocale();
							var tval = val;
							if (_locale.dateonly.indexOf("-") > -1) {
								tval = tval.replace(/\./g, "-");
							} else {
								tval = tval.replace(/\./g, "/");
							}
							if (moment(tval).isValid()) {
								val = moment(tval).format(_locale.dateonly);
							}
						} catch (e) { }
					}
				}
				_elem.val(val);
			} else if (_elem.is(":checkbox")) {
				$(
					"input[name='" + _elem.attr("name") + "']:checkbox",
					_elem.parents(".dwp-checkbox").parent()
				).each(function () {
					if ($.inArray($(this).val(), _val) > -1) {
						this.checked = true;
					} else {
						this.checked = false;
					}
				});
			} else if (_elem.is(":radio")) {
				$(
					"input[name='" + _elem.attr("name") + "']:radio",
					_elem.parents(".dwp-radio").parent()
				).each(function () {
					if ($.inArray($(this).val(), _val) > -1) {
						this.checked = true;
					} else {
						this.checked = false;
					}
				});
			} else {
				_elem.val(val);
			}
		} else if (_elem.get(0).tagName == "SELECT") {
			$("option", _elem).each(function () {
				if ($.inArray($(this).val(), _val) > -1) {
					this.selected = true;
				} else {
					this.selected = false;
				}
			});
		} else {
			_elem.val(val);
		}
	}
};
/*******************************************************************************
jquery.mb.components
Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
email: info@pupunzi.com
site: http://pupunzi.com

Licences: MIT, GPL
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
******************************************************************************/

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
document.$cookie = true;
jQuery.cookie = function (name, value, options) {
	if (typeof value != "undefined") {
		// name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = "";
			options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
			options.expires = -1;
		}
		var expires = "";
		if (
			options.expires &&
			(typeof options.expires == "number" || options.expires.toUTCString)
		) {
			var date;
			if (typeof options.expires == "number") {
				date = new Date();
				date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
			} else {
				date = options.expires;
			}
			expires = "; expires=" + date.toUTCString(); // use expires attribute, max-age is not supported by IE
		}
		// NOTE Needed to parenthesize options.path and options.domain
		// in the following expressions, otherwise they evaluate to undefined
		// in the packed version for some reason...
		var path = options.path ? "; path=" + options.path : "";
		var domain = options.domain ? "; domain=" + options.domain : "";
		var secure = options.secure ? "; secure" : "";
		document.cookie = [
			name,
			"=",
			encodeURIComponent(value),
			expires,
			path,
			domain,
			secure
		].join("");
	} else {
		// only name given, get cookie
		var cookieValue = null;
		if (document.cookie && document.cookie != "") {
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == name + "=") {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};
/**
 * jQuery BASE64 functions
 *
 * 	<code>
 * 		Encodes the given data with base64.
 * 		String $.base64Encode ( String str )
 *		<br />
 * 		Decodes a base64 encoded data.
 * 		String $.base64Decode ( String str )
 * 	</code>
 *
 * Encodes and Decodes the given data in base64.
 * This encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean, such as mail bodies.
 * Base64-encoded data takes about 33% more space than the original data.
 * This javascript code is used to encode / decode data using base64 (this encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean). Script is fully compatible with UTF-8 encoding. You can use base64 encoded data as simple encryption mechanism.
 * If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag).
 * This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
 *
 * Example
 * 	Code
 * 		<code>
 * 			$.base64Encode("I'm Persian.");
 * 		</code>
 * 	Result
 * 		<code>
 * 			"SSdtIFBlcnNpYW4u"
 * 		</code>
 * 	Code
 * 		<code>
 * 			$.base64Decode("SSdtIFBlcnNpYW4u");
 * 		</code>
 * 	Result
 * 		<code>
 * 			"I'm Persian."
 * 		</code>
 *
 * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
 * @link http://www.semnanweb.com/jquery-plugin/base64.html
 * @see http://www.webtoolkit.info/
 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
 * @param {jQuery} {base64Encode:function(input))
 * @param {jQuery} {base64Decode:function(input))
 * @return string
 */

(function ($) {
	var keyString =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	var uTF8Encode = function (string) {
		string = string.replace(/\x0d\x0a/g, "\x0a");
		var output = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				output += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
				output += String.fromCharCode((c >> 6) | 192);
				output += String.fromCharCode((c & 63) | 128);
			} else {
				output += String.fromCharCode((c >> 12) | 224);
				output += String.fromCharCode(((c >> 6) & 63) | 128);
				output += String.fromCharCode((c & 63) | 128);
			}
		}
		return output;
	};

	var uTF8Decode = function (input) {
		var string = "";
		var i = 0;
		var c = (c1 = c2 = 0);
		while (i < input.length) {
			c = input.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if (c > 191 && c < 224) {
				c2 = input.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = input.charCodeAt(i + 1);
				c3 = input.charCodeAt(i + 2);
				string += String.fromCharCode(
					((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
				);
				i += 3;
			}
		}
		return string;
	};

	$.extend({
		base64Encode: function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = uTF8Encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output =
					output +
					keyString.charAt(enc1) +
					keyString.charAt(enc2) +
					keyString.charAt(enc3) +
					keyString.charAt(enc4);
			}
			return output;
		},
		base64Decode: function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = keyString.indexOf(input.charAt(i++));
				enc2 = keyString.indexOf(input.charAt(i++));
				enc3 = keyString.indexOf(input.charAt(i++));
				enc4 = keyString.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = uTF8Decode(output);
			return output;
		}
	});
})(jQuery);

/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

(function () {
	/*jshint eqeqeq:false curly:false latedef:false */
	"use strict";

	function setup($) {
		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function () { };

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// confusing userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6 =
			/MSIE 6.0/.test(navigator.userAgent) &&
			!/MSIE 8.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		var setExpr = $.isFunction(
			document.createElement("div").style.setExpression
		);

		// global $ methods for blocking/unblocking the entire page
		$.blockUI = function (opts) {
			install(window, opts);
		};
		$.unblockUI = function (opts) {
			remove(window, opts);
		};

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function (title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append("<h1>" + title + "</h1>");
			if (message) $m.append("<h2>" + message + "</h2>");
			if (timeout === undefined) timeout = 3000;

			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
			var callBlock = function (opts) {
				opts = opts || {};

				$.blockUI({
					message: $m,
					fadeIn: typeof opts.fadeIn !== "undefined" ? opts.fadeIn : 700,
					fadeOut: typeof opts.fadeOut !== "undefined" ? opts.fadeOut : 1000,
					timeout: typeof opts.timeout !== "undefined" ? opts.timeout : timeout,
					centerY: false,
					showOverlay: false,
					onUnblock: onClose,
					css: $.blockUI.defaults.growlCSS
				});
			};

			callBlock();
			var nonmousedOpacity = $m.css("opacity");
			$m.mouseover(function () {
				callBlock({
					fadeIn: 0,
					timeout: 30000
				});

				var displayBlock = $(".blockMsg");
				displayBlock.stop(); // cancel fadeout if it has started
				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
			}).mouseout(function () {
				$(".blockMsg").fadeOut(1000);
			});
			// End konapun additions
		};

		// plugin method for blocking element content
		$.fn.block = function (opts) {
			if (this[0] === window) {
				$.blockUI(opts);
				return this;
			}
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function () {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data("blockUI.isBlocked")) return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function () {
				if ($.css(this, "position") == "static") {
					this.style.position = "relative";
					$(this).data("blockUI.static", true);
				}
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function (opts) {
			if (this[0] === window) {
				$.unblockUI(opts);
				return this;
			}
			return this.each(function () {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.7; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message: "<h1>Please wait...</h1>",

			title: null, // title string; only used when theme == true
			draggable: true, // only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
				padding: 0,
				margin: 0,
				width: "30%",
				top: "40%",
				left: "35%",
				textAlign: "center",
				color: "#000",
				border: "3px solid #aaa",
				backgroundColor: "#fff",
				cursor: "wait"
			},

			// minimal style set used when themes are used
			themedCSS: {
				width: "30%",
				top: "40%",
				left: "35%"
			},

			// styles for the overlay
			overlayCSS: {
				backgroundColor: "#000",
				opacity: 0.6,
				cursor: "wait"
			},

			// style to replace wait cursor before unblocking to correct issue
			// of lingering wait cursor
			cursorReset: "default",

			// styles applied when using $.growlUI
			growlCSS: {
				width: "350px",
				top: "10px",
				left: "",
				right: "10px",
				border: "none",
				padding: "5px",
				opacity: 0.6,
				cursor: "default",
				color: "#fff",
				backgroundColor: "#000",
				"-webkit-border-radius": "10px",
				"-moz-border-radius": "10px",
				"border-radius": "10px"
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
			iframeSrc: /^https/i.test(window.location.href || "")
				? "javascript:false"
				: "about:blank",

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 1000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn: 200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut: 400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

			// elements that can receive focus
			focusableElements: ":input:enabled:visible",

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// callback method invoked when the overlay area is clicked.
			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
			onOverlayClick: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: "blockMsg",

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = el == window;
			var msg = opts && opts.message !== undefined ? opts.message : undefined;
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data("blockUI.isBlocked")) return;

			opts.overlayCSS = $.extend(
				{},
				$.blockUI.defaults.overlayCSS,
				opts.overlayCSS || {}
			);
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			if (opts.onOverlayClick) opts.overlayCSS.cursor = "pointer";

			themedCSS = $.extend(
				{},
				$.blockUI.defaults.themedCSS,
				opts.themedCSS || {}
			);
			msg = msg === undefined ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock) remove(window, { fadeOut: 0 });

			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != "string" && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data("blockUI.history", data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent) data.parent.removeChild(node);
			}

			$(el).data("blockUI.onUnblock", opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe)
				lyr1 = $(
					'<iframe class="blockUI" style="z-index:' +
					z++ +
					';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' +
					opts.iframeSrc +
					'"></iframe>'
				);
			else lyr1 = $('<div class="blockUI" style="display:none"></div>');

			if (opts.theme)
				lyr2 = $(
					'<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' +
					z++ +
					';display:none"></div>'
				);
			else
				lyr2 = $(
					'<div class="blockUI blockOverlay" style="z-index:' +
					z++ +
					';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>'
				);

			if (opts.theme && full) {
				s =
					'<div class="blockUI ' +
					opts.blockMsgClass +
					' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' +
					(z + 10) +
					';display:none;position:fixed">';
				if (opts.title) {
					s +=
						'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' +
						(opts.title || "&nbsp;") +
						"</div>";
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += "</div>";
			} else if (opts.theme) {
				s =
					'<div class="blockUI ' +
					opts.blockMsgClass +
					' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' +
					(z + 10) +
					';display:none;position:absolute">';
				if (opts.title) {
					s +=
						'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' +
						(opts.title || "&nbsp;") +
						"</div>";
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += "</div>";
			} else if (full) {
				s =
					'<div class="blockUI ' +
					opts.blockMsgClass +
					' blockPage" style="z-index:' +
					(z + 10) +
					';display:none;position:fixed"></div>';
			} else {
				s =
					'<div class="blockUI ' +
					opts.blockMsgClass +
					' blockElement" style="z-index:' +
					(z + 10) +
					';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass("ui-widget-content");
				} else lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
				lyr2.css(opts.overlayCSS);
			lyr2.css("position", full ? "fixed" : "absolute");

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe) lyr1.css("opacity", 0.0);

			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1, lyr2, lyr3],
				$par = full ? $("body") : $(el);
			$.each(layers, function () {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: ".ui-dialog-titlebar",
					cancel: "li"
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr =
				setExpr &&
				(!$.support.boxModel || $("object,embed", full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel)
					$("html,body").css("height", "100%");

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el, "borderTopWidth"),
						l = sz(el, "borderLeftWidth");
					var fixT = t ? "(0 - " + t + ")" : 0;
					var fixL = l ? "(0 - " + l + ")" : 0;
				}

				// simulate fixed position
				$.each(layers, function (i, o) {
					var s = o[0].style;
					s.position = "absolute";
					if (i < 2) {
						if (full)
							s.setExpression(
								"height",
								"Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:" +
								opts.quirksmodeOffsetHack +
								') + "px"'
							);
						else
							s.setExpression("height", 'this.parentNode.offsetHeight + "px"');
						if (full)
							s.setExpression(
								"width",
								'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"'
							);
						else s.setExpression("width", 'this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression("left", fixL);
						if (fixT) s.setExpression("top", fixT);
					} else if (opts.centerY) {
						if (full)
							s.setExpression(
								"top",
								'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"'
							);
						s.marginTop = 0;
					} else if (!opts.centerY && full) {
						var top = opts.css && opts.css.top ? parseInt(opts.css.top, 10) : 0;
						var expression =
							"((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + " +
							top +
							') + "px"';
						s.setExpression("top", expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme) lyr3.find(".ui-widget-content").append(msg);
				else lyr3.append(msg);
				if (msg.jquery || msg.nodeType) $(msg).show();
			}

			if ((msie || opts.forceIframe) && opts.showOverlay) lyr1.show(); // opacity is zero
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = opts.showOverlay && !msg ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay) lyr2._fadeIn(opts.fadeIn, cb1);
				if (msg) lyr3._fadeIn(opts.fadeIn, cb2);
			} else {
				if (opts.showOverlay) lyr2.show();
				if (msg) lyr3.show();
				if (opts.onBlock) opts.onBlock.bind(lyr3)();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(opts.focusableElements, pageBlock);
				if (opts.focusInput) setTimeout(focus, 20);
			} else center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function () {
					if (full) $.unblockUI(opts);
					else $(el).unblock(opts);
				}, opts.timeout);
				$(el).data("blockUI.timeout", to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var count;
			var full = el == window;
			var $el = $(el);
			var data = $el.data("blockUI.history");
			var to = $el.data("blockUI.timeout");
			if (to) {
				clearTimeout(to);
				$el.removeData("blockUI.timeout");
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data("blockUI.onUnblock");
				$el.removeData("blockUI.onUnblock");
			}

			var els;
			if (full)
				// crazy selector to handle odd field errors in ie6/7
				els = $("body")
					.children()
					.filter(".blockUI")
					.add("body > .blockUI");
			else els = $el.find(">.blockUI");

			// fix cursor issue
			if (opts.cursorReset) {
				if (els.length > 1) els[1].style.cursor = opts.cursorReset;
				if (els.length > 2) els[2].style.cursor = opts.cursorReset;
			}

			if (full) pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				count = els.length;
				els.stop().fadeOut(opts.fadeOut, function () {
					if (--count === 0) reset(els, data, opts, el);
				});
			} else reset(els, data, opts, el);
		}

		// move blocking element back into the DOM where it started
		function reset(els, data, opts, el) {
			var $el = $(el);
			if ($el.data("blockUI.isBlocked")) return;

			els.each(function (i, o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode) this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				data.el.style.cursor = "default"; // #59
				if (data.parent) data.parent.appendChild(data.el);
				$el.removeData("blockUI.history");
			}

			if ($el.data("blockUI.static")) {
				$el.css("position", "static"); // #22
			}

			if (typeof opts.onUnblock == "function") opts.onUnblock(el, opts);

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body),
				w = body.width(),
				cssW = body[0].style.width;
			body.width(w - 1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window,
				$el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (
				!b &&
				((full && !pageBlock) || (!full && !$el.data("blockUI.isBlocked")))
			)
				return;

			$el.data("blockUI.isBlocked", b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!full || !opts.bindEvents || (b && !opts.showOverlay)) return;

			// bind anchors and inputs for mouse and key events
			var events =
				"mousedown mouseup keydown keypress keyup touchstart touchend touchmove";
			if (b) $(document).bind(events, opts, handler);
			else $(document).unbind(events, handler);

			// former impl...
			//		var $e = $('a,:input');
			//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.type === "keydown" && e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length - 1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function () {
							focus(back);
						}, 10);
						return false;
					}
				}
			}
			var opts = e.data;
			var target = $(e.target);
			if (target.hasClass("blockOverlay") && opts.onOverlayClick)
				opts.onOverlayClick(e);

			// allow events within the message content
			if (target.parents("div." + opts.blockMsgClass).length > 0) return true;

			// allow events for content that is not being blocked
			return (
				target
					.parents()
					.children()
					.filter("div.blockUI").length === 0
			);
		}

		function focus(back) {
			if (!pageBlockEls) return;
			var e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
			if (e) e.focus();
		}

		function center(el, x, y) {
			var p = el.parentNode,
				s = el.style;
			var l = (p.offsetWidth - el.offsetWidth) / 2 - sz(p, "borderLeftWidth");
			var t = (p.offsetHeight - el.offsetHeight) / 2 - sz(p, "borderTopWidth");
			if (x) s.left = l > 0 ? l + "px" : "0";
			if (y) s.top = t > 0 ? t + "px" : "0";
		}

		function sz(el, p) {
			return parseInt($.css(el, p), 10) || 0;
		}
	}

	/*global define:true */
	if (typeof define === "function" && define.amd && define.amd.jQuery) {
		define(["jquery"], setup);
	} else {
		setup(jQuery);
	}
})();

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
*  Date Object prototype function
*  - 향후 공통 JS로 이동 필요.
*  adjust - Date Object에서 Adjust를 사용하도록 구현
		@param (년,월,일,시,분,초)
*		var d = new Date(); d.adjust(0,0,1,0,0,0);
*  parseStrDate - String 기반의 숫자 값을 Date Object로 변환
*		@param sDate - 스트링 문자형 날짜
*		@param format - sDate의 패턴 (YYYY-년도, MM-월 , DD - 일자, hh-시, mm-분, ss-초)
*	var a = "2011/03/11T1020";
*	var d = new Date();
*	d.parseStrDate(a, "YYYY/MM/DDThhss");
*  getWeek - 오늘이 올해의 몇번째 주인지 계산 해준다.
*  format  - Date Object를 format string으로 변환 한다.
*
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
Date.prototype.adjust = function (yr, mn, dy, hr, mi, se) {
	var m, t;
	this.setYear(this.getFullYear() + yr);
	m = this.getMonth() + mn;
	if (m != 0) this.setYear(this.getFullYear() + Math.floor(m / 12));
	if (m == 0) this.setMonth(m);
	if (m < 0) {
		this.setMonth(12 + (m % 12));
	} else if (m > 0) {
		this.setMonth(m % 12);
	}
	t = this.getTime();
	t += dy * 86400000;
	t += hr * 3600000;
	t += mi * 60000;
	t += se * 1000;
	this.setTime(t);
};

Date.prototype.diffday = function (oDate) {
	return (oDate.getTime() - this.getTime()) / (1000 * 60 * 60 * 24);
};

Date.prototype.parseStrDate = function (sDate, format) {
	var p = format.search(/YYYY/);
	p == -1 ? "" : this.setFullYear(parseFloat(sDate.substr(p, 4)));
	p = format.search(/MM/);
	p == -1 ? "" : this.setMonth(parseFloat(sDate.substr(p, 2)), 0);
	p = format.search(/DD/);
	p == -1 ? "" : this.setDate(parseFloat(sDate.substr(p, 2)));
	p = format.search(/hh/);
	p == -1 ? this.setHours(0) : this.setHours(parseFloat(sDate.substr(p, 2)));
	p = format.search(/mm/);
	p == -1
		? this.setMinutes(0)
		: this.setMinutes(parseFloat(sDate.substr(p, 2)));
	p = format.search(/ss/);
	p == -1
		? this.setSeconds(0)
		: this.setSeconds(parseFloat(sDate.substr(p, 2)));
	this.setMilliseconds(0);
};

Date.prototype.getWeek = function () {
	var onejan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

/*  2011-03-30 Tony  Original : http://blog.stevenlevithan.com/archives/date-time-format

Mask		Description
d		Day of the month as digits; no leading zero for single-digit days.
dd		Day of the month as digits; leading zero for single-digit days.
ddd		Day of the week as a three-letter abbreviation.
dddd		Day of the week as its full name.
m		Month as digits; no leading zero for single-digit months.
mm		Month as digits; leading zero for single-digit months.
mmm		Month as a three-letter abbreviation.
mmmm		Month as its full name.
yy		Year as last two digits; leading zero for years less than 10.
yyyy		Year represented by four digits.
h		Hours; no leading zero for single-digit hours (12-hour clock).
hh		Hours; leading zero for single-digit hours (12-hour clock).
H		Hours; no leading zero for single-digit hours (24-hour clock).
HH		Hours; leading zero for single-digit hours (24-hour clock).
M		Minutes; no leading zero for single-digit minutes.
		Uppercase M unlike CF timeFormat's m to avoid conflict with months.
MM		Minutes; leading zero for single-digit minutes.
		Uppercase MM unlike CF timeFormat's mm to avoid conflict with months.
s		Seconds; no leading zero for single-digit seconds.
ss		Seconds; leading zero for single-digit seconds.
l or L		Milliseconds. l gives 3 digits. L gives 2 digits.
t		Lowercase, single-character time marker string: a or p.
		No equivalent in CF.
tt		Lowercase, two-character time marker string: am or pm.
		No equivalent in CF.
T		Uppercase, single-character time marker string: A or P.
		Uppercase T unlike CF's t to allow for user-specified casing.
TT		Uppercase, two-character time marker string: AM or PM.
		Uppercase TT unlike CF's tt to allow for user-specified casing.
Z		US timezone abbreviation, e.g. EST or MDT. With non-US timezones or in the Opera browser, the GMT/UTC offset is returned, e.g. GMT-0500
		No equivalent in CF.
o		GMT/UTC timezone offset, e.g. -0500 or +0230.
		No equivalent in CF.
S		The date's ordinal suffix (st, nd, rd, or th). Works well with d.
		No equivalent in CF.
'…' or "…"	Literal character sequence. Surrounding quotes are removed.
		No equivalent in CF.
UTC:		Must be the first four characters of the mask. Converts the date from local time to UTC/GMT/Zulu time before applying the mask. The "UTC:" prefix is removed.
		No equivalent in CF.


named masks provided by default
Name			Mask					Example
default			ddd mmm dd yyyy HH:MM:ss		Sat Jun 09 2007 17:46:21
shortDate		m/d/yy					6/9/07
mediumDate		mmm d, yyyy				Jun 9, 2007
longDate		mmmm d, yyyy				June 9, 2007
fullDate			dddd, mmmm d, yyyy			Saturday, June 9, 2007
shortTime		h:MM TT				5:46 PM
mediumTime		h:MM:ss TT				5:46:21 PM
longTime		h:MM:ss TT Z				5:46:21 PM EST
isoDate			yyyy-mm-dd				2007-06-09
isoTime			HH:MM:ss				17:46:21
isoDateTime		yyyy-mm-dd'T'HH:MM:ss		2007-06-09T17:46:21
isoUtcDateTime		UTC:yyyy-mm-dd'T'HH:MM:ss'Z'	2007-06-09T22:46:21Z

<사용 예제>
var n = new Date();
var s = n.format("yyyy-mm-dd");			s = 2011-03-30
n.masks.testMasks = "yyyy-mm-dd";
var s = n.format("testMasks");			s = 2011-03-30
var s = n.format("longDate");			s = 5:46:21 PM EST

*/

(function (Date) {
	var dateFormat = (function () {
		var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};

		/* Regexes and supporting functions are cached through closure*/
		return function (date, mask, utc) {
			var dF = dateFormat;

			/* You can't provide utc if you skip other args (use the "UTC:" mask prefix)*/
			if (
				arguments.length == 1 &&
				Object.prototype.toString.call(date) == "[object String]" &&
				!/\d/.test(date)
			) {
				mask = date;
				date = undefined;
			}

			/* Passing date through Date applies Date.parse, if necessary*/
			date = date ? new Date(date) : new Date();
			if (isNaN(date)) {
				return;
				//throw SyntaxError("invalid date");
			}
			mask = String(dF.masks[mask] || mask || dF.masks["default"]);

			/* Allow setting the utc argument via the mask*/
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}

			var _ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d: d,
					dd: pad(d),
					ddd: dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					m: m + 1,
					mm: pad(m + 1),
					mmm: dF.i18n.monthNames[m],
					mmmm: dF.i18n.monthNames[m + 12],
					yy: String(y).slice(2),
					yyyy: y,
					h: H % 12 || 12,
					hh: pad(H % 12 || 12),
					H: H,
					HH: pad(H),
					M: M,
					MM: pad(M),
					s: s,
					ss: pad(s),
					l: pad(L, 3),
					L: pad(L > 99 ? Math.round(L / 10) : L),
					t: H < 12 ? "a" : "p",
					tt: H < 12 ? "am" : "pm",
					T: H < 12 ? "A" : "P",
					TT: H < 12 ? "AM" : "PM",
					Z: utc
						? "UTC"
						: (String(date).match(timezone) || [""])
							.pop()
							.replace(timezoneClip, ""),
					o:
						(o > 0 ? "-" : "+") +
						pad(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4),
					S: ["th", "st", "nd", "rd"][
						d % 10 > 3 ? 0 : (((d % 100) - (d % 10) != 10) * d) % 10
					]
				};

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	})();

	/* Some common format strings*/
	dateFormat.masks = {
		"default": "ddd mmm dd yyyy HH:MM:ss",
		shortDate: "m/d/yy",
		mediumDate: "mmm d, yyyy",
		longDate: "mmmm d, yyyy",
		fullDate: "dddd, mmmm d, yyyy",
		shortTime: "h:MM TT",
		mediumTime: "h:MM:ss TT",
		longTime: "h:MM:ss TT Z",
		isoDate: "yyyy-mm-dd",
		isoTime: "HH:MM:ss",
		isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};

	/* Internationalization strings*/
	dateFormat.i18n = {
		dayNames: [
			"일",
			"월",
			"화",
			"수",
			"목",
			"금",
			"토",
			"일요일",
			"월요일",
			"화요일",
			"수요일",
			"목요일",
			"금요일",
			"토요일"
		],
		monthNames: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		]
	};
	/*
	  if ( ! $.xlang.isDefaultLang() ) {
		  dateFormat.i18n.dayNames = [
			  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		  ]
	  }
	  */
	/* For convenience...*/
	Date.prototype.format = function (mask, utc) {
		return dateFormat(this, mask, utc);
	};
	Date.prototype.masks = dateFormat.masks;
})(Date);

(function () {
	// Add ECMA262-5 string trim if not supported natively
	//
	if (!("trim" in String.prototype)) {
		String.prototype.trim = function () {
			return this.replace(/^\s+/, "").replace(/\s+$/, "");
		};
	}

	// Add ECMA262-5 Array methods if not supported natively
	//
	/*
	  if (!Array.prototype.indexOf) {
		  Array.prototype.indexOf = function (searchElement, fromIndex) {
			  if ( this === undefined || this === null ) {
				  throw new TypeError( '"this" is null or not defined' );
			  }
			  var length = this.length >>> 0; // Hack to convert object.length to a UInt32

			  fromIndex = +fromIndex || 0;
			  if (Math.abs(fromIndex) === Infinity) {
				  fromIndex = 0;
			  }
			  if (fromIndex < 0) {
				  fromIndex += length;
				  if (fromIndex < 0) {
						  fromIndex = 0;
				  }
			  }

			  for (;fromIndex < length; fromIndex++) {
				  if (this[fromIndex] === searchElement) {
					  return fromIndex;
				  }
			  }

			  return -1;
		  };
		  }
	  if (!Array.prototype.lastIndexOf) {
		  Array.prototype.lastIndexOf = function(searchElement) {
			  'use strict';
			  if (this === void 0 || this === null) { throw new TypeError(); }
			  var n, k, t = Object(this), len = t.length >>> 0;
			  if (len === 0) { return -1;}
			  n = len - 1;
			  if (arguments.length > 1) {
				  n = Number(arguments[1]);
				  if (n != n) { n = 0; }
				  else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
					  n = (n > 0 || -1) * Math.floor(Math.abs(n));
				  }
				  }
			  for (k = n >= 0
				  ? Math.min(n, len - 1)
				  : len - Math.abs(n); k >= 0; k--) {
				  if (k in t && t[k] === searchElement) {
					  return k;
				  }
			  }
			  return -1;
		  };
	  }
	  */
	/*
	  if (!('indexOf' in Array.prototype)) {
		  Array.prototype.indexOf= function(find, i ) {
		   if (i===undefined) i= 0;
			  if (i<0) i+= this.length;
			  if (i<0) i= 0;
			  for (var n= this.length; i<n; i++)
				  if (i in this && this[i]===find)
					  return i;
			  return -1;
		  };
	  }
	  if (!('lastIndexOf' in Array.prototype)) {
		  Array.prototype.lastIndexOf= function(find, i ) {
			  if (i===undefined) i= this.length-1;
			  if (i<0) i+= this.length;
			  if (i>this.length-1) i= this.length-1;
			  for (i++; i-->0;)
				  if (i in this && this[i]===find)
					  return i;
			  return -1;
		  };
	  }
	  */
	if (!("toCurrency" in Number.prototype)) {
		Number.prototype.toCurrency = function () {
			if (this == 0) return 0;
			var reg = /(^[+-]?\d+)(\d{3})/,
				n = this + "";
			while (reg.test(n)) n = n.replace(reg, "$1" + "," + "$2");
			return n;
		};
	}
	if (!("toCurrency" in String.prototype)) {
		String.prototype.toCurrency = function () {
			var num = parseFloat(this);
			if (isNaN(num)) return "0";
			return num.toCurrency();
		};
	}
	if (!("toComma" in String.prototype)) {
		String.prototype.toComma = function () {
			var reg = /(^[+-]?\d+)(\d{3})/;
			var num = this + "";
			num = num.replace(/\,/g, "");
			while (reg.test(num)) {
				num = num.replace(reg, "$1" + "," + "$2");
			}
			return num;
		};
	}
	if (!("toSize" in Number.prototype)) {
		Number.prototype.toSize = function () {
			var v1 = this / 1024;
			if (v1 < 1) return this.toString() + "B";
			var v2 = v1 / 1024;
			if (v2 < 1) return Math.round(v1 * 100) / 100 + "K";
			//return (Math.round(v2*100)/100).toCurrency() + " MB";
			var v3 = v2 / 1024;
			if (v3 < 1) return Math.round(v2 * 100) / 100 + "M";
			return (Math.round(v3 * 100) / 100).toCurrency() + "G";
		};
	}
	if (!("toSize" in String.prototype)) {
		String.prototype.toSize = function () {
			var num = parseFloat(this);
			if (isNaN(num)) return "0B";
			return num.toSize();
		};
	}
})();
