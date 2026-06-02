/**
 * <b>File 라이브러리</b>
 * <br>File 및 이미지 Up/Down처리를 위한 함수를 정의합니다.
 * @module core/ui/file
 * @copyright	TCCINS
 * @see {@link module:core~$dwp.core.ui.imgfile|core.ui.imgfile}
 * 		,{@link module:core~$dwp.core.ui.file|core.ui.file}
 */
 (function (/** @lends	module:core~$dwp.core.ui */_$$, $) {
	/**
	 * 이미지 Up/Down처리 모듈
	 * @namespace
	 */
	_$$.imgfile = {
		_ATTACH_URL: "/servlet/fileupload?enctype=utf-8&sfolder="
		, init: function (target, opt) {
			var _$target = $(target)
				, _$wrap = null
				, _$body = null
				, _Deferred = $.Deferred()
				, _upload_result = null
				, _attach_url = this._ATTACH_URL
				, _opt = $.extend(true, {
					mode: "edit"
					, ismobile: false
					, attach_url: this._ATTACH_URL
					, addtitle: $fn.getCodeMsg("comm.title.js026")
					, height: 120
					, accept: "image/*"
					, ismulti: true
					, attachinfo: {}
					, dataset: []
					, isLikeFilter: "png|jpg|jpeg|gif"
					, remove: undefined
				}, opt)
				, _that = {
					_FILE_CHECK: true
					, _create: function () {
						var _me = this;
						//console.log("aaa", _opt);

						if (_opt.mode === "read") {
							if (!_opt.dataset) { return false; }
							if (!$.isArray(_opt.dataset)) { return false; }
							if (_opt.dataset.length === 0) { return false; }
						}

						_$wrap = $("<div><div class='aligner' data-bottom='sm'></div></div>").appendTo(_$target);
						_$body = $("<div name='file_dropzone' class='dwp-file-list-icon' style='height:auto'></div>").appendTo(_$wrap);

						if (_opt.dataset.length == 0) {
							_$body.append("<div class='no-file'>" + $fn.getCodeMsg("comm.msg.msg044") + "</div>");
						}

						if (_opt.mode == "edit") {
							_me._drawEdit();
							_me._initDataset();
							_me._initUploader();
						} else {
							_me._initDataset();
						}

						return true;
					}
					, _drawEdit: function () {
						var _me = this;

						$("<div class='left button _attach_act'></div>").appendTo($("div.aligner", _$wrap))
							.append("<span style='display:none'><input id='fileupload' type='file' name='%%File' " + (_opt.ismulti ? "multiple" : "") + " class='hidden' accept='" + _opt.accept + "'/></span>")
							.append("<div name='attach_btn' class='dwp-btn dwp-cursor'><span>" + $fn.getCodeMsg(_opt.addtitle) + "</span></div>")
							.append("<div name='del_btn' class='dwp-btn'><span>" + $fn.getCodeMsg("comm.title.js018") + "</span></div>")
							.on("click", "div.dwp-btn[name=attach_btn]", function () {
								$("input[type=file]", _$wrap).click();
							})
							.on("click", "div.dwp-btn[name=del_btn]", function () { _me._onDelete.call(_me); });
					}
					, _initDataset: function () {
						var _me = this;
						if (_opt.dataset == undefined) { return; }
						if (!$.isArray(_opt.dataset)) { return; }
						//2020-06-24 By LHJ Content-Dispostion 방식 변경
						//$.each(_opt.dataset, function(i, val){val.isnew = false;});	// 기존 Data
						$.each(_opt.dataset, function (i, val) {
							val.isnew = false;
							_url = val.url.toLowerCase();
							if (_url.indexOf("/$file/") > -1 && _url.indexOf("?openelement&attached") == -1) {
								val.url = val.url + "?openelement&attached";
							}

						});	// 기존 Data
						_me.add(_opt.dataset);
					}
					, add: function (data) {
						var _me = this;
						if (!data) { return; }

						var _act = (_opt.ismobile ? "_addM" : "_add");
						if ($.isArray(data)) {
							$.each(data, function (idx, val) {
								(_me[_act + _opt.mode] ? _me[_act + _opt.mode] : _me[_act]).call(_me, val);
							});
						} else { (_me[_act + _opt.mode] ? _me[_act + _opt.mode] : _me[_act]).call(_me, data); }
					},
					_addread: function (data) {
						if (!data) { return; }
						var _me = this

						_row = $('<div class="item data_record" style="width:auto;" />').appendTo(_$body);
						_row.append("<div name='imgwrap'><img height='" + _opt.height + "px' src='" + data.url + "'></div>");

						if (data.data) {
							_row.addClass("uploader");
						} else { data.data = {}; }
						data.data.context = _row;
						_me._fileData(_row, data).on({ submit: function (e) { _me._onDataSubmit($(this), _me._fileData(this)); } });
						return;
					},
					_addedit: function (data) {
						if (!data) { return; }
						var _me = this, _row = null, _col = null;

						if ($("div.no-file", _$body).size() > 0) $("div.no-file", _$body).remove();

						_row = $('<div class="item data_record" style="width:auto;" />').appendTo(_$body);

						if (data.data) {
							_row.append("<div class='dwp-checkbox textless'><label><input name='filecheck' type='checkbox' class='dwp-check'/><span></span></label></div>");
							_row.append("<div name='imgwrap'></div>");
							_row.addClass("uploader");

							var reader = new FileReader();
							reader.addEventListener("load", function () {
								var image = new Image();
								image.height = _opt.height;
								image.title = data.name;
								image.src = this.result;
								$("div[name=imgwrap]", _row).get(0).appendChild(image);
							}, false);
							reader.readAsDataURL(data.data.files[0]);
						} else {
							if (_opt.mode == "edit") {
								_row.append("<div class='dwp-checkbox textless'><label><input name='filecheck' type='checkbox' class='dwp-check'/><span></span></label></div>");
							}
							_row.append("<div name='imgwrap'><img height='" + _opt.height + "px' src='" + data.url + "'></div>");
							data.data = {};
						}
						data.data.context = _row;
						_me._fileData(_row, data).on({ submit: function (e) { _me._onDataSubmit($(this), _me._fileData(this)); } });
						return;
					}
					, _onDelete: function () {
						var _sel = this._getSelectedData();
						if (_sel == null) { return; }
						$.each(_sel, function (idx, val) {
							if (val.isnew === false) {
								if (typeof (_opt.remove) == "function") { _opt.remove(val); };
							}
							$(val.data.context).remove();
						});
						if (_$body.html() == "") { _$body.append("<div class='no-file'>" + $fn.getCodeMsg("comm.msg.msg044") + "</div>"); }

						if ($("input[type=checkbox].dwp-check-all", _$wrap).size() > 0) {
							$("input[type=checkbox].dwp-check-all", _$wrap).prop("checked", false);
						}
					}
					, _getSelectedData: function () {
						return this._getAllFileData("input[name=filecheck]:checked");
					}
					, _getUploaderRows: function () {
						return $("div.item.uploader", _$body);
					}
					, _fileData: function (tag, data) {
						var _$tag = $(tag).is(".data_record") ? $(tag) : $(tag).closest(".data_record");
						if (_$tag.size() == 0) { return; }
						return data ? _$tag.data("fileinfo", data) : _$tag.data("fileinfo");
					}
					, _initUploader: function () {
						var _me = this;

						if ($("input[type=file]", _$wrap).data("fileupload") != null) return;

						function _initload(func) {
							if (typeof ($.fn.fileupload) != "function") {
								$LAB.script("/tcclibs/js/lib/jquery-fileupload.js").wait(function () {
									if (typeof (func) == "function") { func(); }
								});
							} else {
								if (typeof (func) == "function") { func(); }
							}
						}
						_initload(function () {
							//$.fileuploader($("input[type=file]",_$wrap),{
							$("input[type=file]", _$wrap).fileupload({
								add: function (e, data) {
									if (_me._FILE_CHECK) {
										_me._addUploader.call(_me, e, data)
									}
									//_me._addUploader.call(_me, e, data);
								}
								, dataType: "json"
								, dropZone: _$body
								//,progress : _me._onProgress
								, fail: function (e, data) { return _me._onFail(e, data); }
								, always: function (e, data) { return _me._onAlways(e, data); }
								, done: function (e, data) { return _me._onDone(e, data); }
								//,formData : _opt.formData
								, formData: function () { return _me.getFormData.call(_me); }
								//,formData : _self._options.formData
								//,url : _opt.url ? _opt.url : $mu.util.getAttachURL() + "?enctype=utf-8"
								, url: _opt.url ? _opt.url : _opt.attach_url
							});
						});
					}
					, getFormData: function () {
						var _me = this, formData = [];
						$.each(_opt.formData, function (name, value) {
							formData.push({ name: name, value: value });
						});
						return formData;
					}
					, _addUploader: function (e, data) {
						var _me = this, files = data, _errmsg = [];

						if (_me._isDuplicate(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg045").replace("[$1]", data.files[0].name));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg045").replace("[$1]", data.files[0].name)});
							//return;
						}
						else if (_me._isMaxFileCount(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg046").replace("[$1]", _opt.MaxFileCount));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg046").replace("[$1]", _opt.MaxFileCount)});
							//return;
						}
						else if (_me._isOneFileMaxSize(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg047").replace("[$1]", data.files[0].name).replace("[$2]", _opt.OneFileMaxSize));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg047").replace("[$1]", data.files[0].name).replace("[$2]", _opt.OneFileMaxSize)});
							//return;
						}
						else if (_me._isTotalFileMaxSize(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg048").replace("[$1]", _opt.TotalFileMaxSize));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg048").replace("[$1]",_opt.TotalFileMaxSize)});
							//return;
						}
						else if (_me._isProhibit(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg049").replace("[$1]", data.files[0].name).replace("[$2]", _opt.prohibit));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg049").replace("[$1]", data.files[0].name).replace("[$2]", _opt.prohibit)});
							//return;
						}
						else if (_me._isFileFilter(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg050").replace("[$1]", _opt.FileFilter));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg050").replace("[$1]",_opt.FileFilter)});
							//return;
						}
						else if (_me._isLikeFilter(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg051").replace("[$1]", _opt.LikeFilter + "]"));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg051").replace("[$1]", _opt.LikeFilter +"]")});
							//return;
						}
						else if (_me._isFileNameSize(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg052").replace("[$1]", data.files[0].name));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg052").replace("[$1]", data.files[0].name)});
							//return;
						}

						if (_errmsg.length > 0) {
							_me._FILE_CHECK = false;
							$fn.alert({ msg: _errmsg[0] }).done(function () { _me._FILE_CHECK = true; })
						} else {
							_me._FILE_CHECK = true;
							this.add($.extend(true, {
								data: files
								, name: data.files[0].name
								, size: data.files[0].size
								, isnew: true
							}, _opt.attachinfo));
						}
					}
					, _isMaxFileCount: function (data) {
						if (!_opt.hasOwnProperty("MaxFileCount")) return false;
						if (typeof (_opt.MaxFileCount) != "number") return false;
						//console.log("_opt.MaxFileCount", _opt.MaxFileCount);
						var _data = this._getAllFileData();
						//console.log("_data", _data);
						if (!_data) { return false; }
						//console.log("_data.length", _data.length);
						if (_data.length >= _opt.MaxFileCount) { return true; }
						return false;
					}
					, _isOneFileMaxSize: function (data) {
						if (!_opt.hasOwnProperty("OneFileMaxSize")) return false;
						if (typeof (_opt.OneFileMaxSize) != "number") return false;
						if (data.files[0].size > (_opt.OneFileMaxSize * 1024)) { return true }
						return false;
					}
					, _isTotalFileMaxSize: function (data) {
						if (!_opt.hasOwnProperty("TotalFileMaxSize")) return false;
						if (typeof (_opt.TotalFileMaxSize) != "number") return false;
						var _data = this._getAllFileData();
						if (!_data) { return false; }
						if (_data.length == 0) { return false; }
						var totsize = data.files[0].size;
						$.each(_data, function (i, o) { totsize += parseInt(o.size, 10); });
						if (totsize > (_opt.TotalFileMaxSize * 1024)) { return true; }
						return false;
					}
					, _isProhibit: function (data) {
						if (!_opt.hasOwnProperty("prohibit")) return false;
						if (typeof (_opt.prohibit) != "string") return false;
						var _rtn = false;
						for (var i = 0, j = _opt.prohibit.length; i < j; i++) {
							if (data.files[0].name.indexOf(_opt.prohibit.charAt(i)) > -1) { _rtn = true; break; }
						}
						return _rtn;
					}
					, _isFileNameSize: function (data) {
						var _rtn = false;
						if (data.files[0].name.length > 100) { _rtn = true; }

						return _rtn;
					}
					, _isFileFilter: function (data) {
						if (!_opt.hasOwnProperty("FileFilter")) return false;
						if (_opt.FileFilter == "") return false;
						var _flist = _opt.FileFilter.split("|");
						var _rtn = false;
						for (var i = 0, j = _flist.length; i < j; i++) {
							if (data.files[0].name.toUpperCase().indexOf("." + _flist[i].toUpperCase()) > -1) { _rtn = true; break; }
						}
						return _rtn;
					}
					, _isLikeFilter: function (data) {
						if (!_opt.hasOwnProperty("LikeFilter")) return false;
						if (_opt.LikeFilter == "") return false;
						var _flist = _opt.LikeFilter.split("|");
						var _rtn = false;
						for (var i = 0, j = _flist.length; i < j; i++) {
							if (data.files[0].name.toUpperCase().indexOf("." + _flist[i].toUpperCase()) == -1) { _rtn = true; break; }
						}
						return _rtn;
					}
					, _isDuplicate: function (data) {
						var _data = this._getAllFileData();
						if (!_data) { return false; }
						//console.log('file', _data);
						return $.map(_data, function (val, idx) { return (val.name == data.files[0].name ? true : null); }).length > 0;
						//return $$.util.array(_data).filter(function(idx,val) {	return val.name == data.files[0].name;}).length > 0;
					}
					, _onDataSubmit: function (ele, data) {
						var attach_info = { filename: data.name, filesize: data.size };
						data.data.attach_info = attach_info;
						data.data.submit();
					}
					, _onSubmit: function () {
						var _me = this, _$upload = _me._getUploaderRows();
						//console.log("_$upload", _$upload);
						if (_$upload.size() == 0) { return null; }

						_$upload.trigger("submit");
						return _Deferred.promise();
					}
					, _getAllFileData: function (sel) {
						var _me = this
							, _rows = $(".data_record", _$wrap) //_rows = $(".attach_data tr",_$ele)
							, _result = null;

						if (sel) { _rows = $(_rows).has(sel); }
						if (_rows.size() == 0) { return _result; }
						_result = [];
						_rows.each(function () {
							_result.push(_me._fileData($(this)));
						});
						return _result;
					}
					, _onDone: function (e, data) {
						var _self = this, _data = data;
						if (!_upload_result) { _upload_result = []; }

						if (typeof (data.result) == "string") {
							try {
								var _json = $.parseJSON(data.result);
								data.result = _json;
								if (data.result.status == "ok") {
									data.result.data[0].attach_info = data.attach_info;
									_upload_result.push(data.result.data[0]);
								} else {
									_upload_result = [];
								}
							} catch (e) {
								data.attach_info.folder = data.result;
								_upload_result.push(data.attach_info);
							}
						} else {
							if (data.result.status == "ok") {
								data.result.data[0].attach_info = data.attach_info;
								_upload_result.push(data.result.data[0]);
							} else {
								_upload_result = [];
							}
						}
						if (_upload_result.length == 0) {
							$(_data.context).addClass("fail");
							_Deferred.reject(_data);
							setTimeout(function () {
								$("#status", _data.context).html("실패");
							}, 300);
						} else {
							$(_data.context).removeClass("uploader");
							setTimeout(function () {
								$("#status", _data.context).html("완료");
								if (_self._getUploaderRows().size() == 0) { _self._onFinish(); };
							}, 300);
						}
					}
					, __onDone: function (e, data) {
						var _me = this, _data = data;
						if (!_upload_result) { _upload_result = []; }

						if (typeof (data.result) == "string") {
							data.attach_info.folder = data.result;
							_upload_result.push(data.attach_info);
						} else {
							console.log("ddd", data);
							if (data.result.status == "ok") {
								data.result.data[0].attach_info = data.attach_info;
								_upload_result.push(data.result.data[0]);
								_upload_result = [];
							} else {
								_upload_result = [];
							}
						}
						if (_upload_result.length == 0) {
							$(_data.context).addClass("fail");
							_Deferred.reject(_data);
						} else {
							$(_data.context).removeClass("uploader");
							setTimeout(function () {
								//$("#status",_data.context).html("완료");
								if (_me._getUploaderRows().size() == 0) { _me._onFinish(); };
							}, 300);
						}
					},
					_onAlways: function (e, data) {

					},
					_onFail: function (e, data) {
						var _me = this, _data = data;
						if (!_upload_result) { _upload_result = []; }
						$(_data.context).addClass("fail");
						_Deferred.reject(_data);
						setTimeout(function () {
							//$("#status",_data.context).html("실패");
						}, 300);
					},
					_onFinish: function () {
						_Deferred.resolve(_upload_result);
					},
					_onProgress: function (e, data) {
						if (data.context) {
							var progress = Math.floor(data.loaded / data.total * 100);
							data.context.find('.progress')
								.find('.bar').css('width', progress + '%');
						}
					},
					_reset: function () {
						_Deferred = $.Deferred();
					}
				};

			return _$target.size() == 0 || !_that._create() ? null : {
				submit: function () { return _that._onSubmit(); }
				, reset: function () { return _that._reset(); }
				, getFileData: function () { return _that._getAllFileData(); }
				, setOptions: function (_opt) { $.extend(_that._options, _opt); console.log("ATTACH", _that._options); }
			};
		}
	};
	/**
	 * 파일 Up/Down처리 모듈
	 * @namespace
	 */
	_$$.file = {
		_ATTACH_ICONS: {
			"xls": { icon: "/tcclibs/images/common/file-icon-excel.png", svg: "/tcclibs/images/common/icon-preview-xls.svg" }
			, "xlsx": { icon: "/tcclibs/images/common/file-icon-excel.png", svg: "/tcclibs/images/common/icon-preview-xls.svg" }
			, "doc": { icon: "/tcclibs/images/common/file-icon-word.png", svg: "/tcclibs/images/common/icon-preview-doc.svg" }
			, "docx": { icon: "/tcclibs/images/common/file-icon-word.png", svg: "/tcclibs/images/common/icon-preview-doc.svg" }
			, "ppt": { icon: "/tcclibs/images/common/file-icon-ppt.png", svg: "/tcclibs/images/common/icon-preview-ppt.svg" }
			, "pptx": { icon: "/tcclibs/images/common/file-icon-ppt.png", svg: "/tcclibs/images/common/icon-preview-ppt.svg" }
			, "pdf": { icon: "/tcclibs/images/common/file-icon-pdf.png", svg: "/tcclibs/images/common/icon-preview-pdf.svg" }
			, "gif": { icon: "/tcclibs/images/common/file-icon-image.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "jpg": { icon: "/tcclibs/images/common/file-icon-image.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "png": { icon: "/tcclibs/images/common/file-icon-image.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "html": { icon: "/tcclibs/images/common/file-icon-html.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "htm": { icon: "/tcclibs/images/common/file-icon-html.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "hwp": { icon: "/tcclibs/images/common/file-icon-etc.png", svg: "/tcclibs/images/common/icon-preview-hwp.svg" }
			, "pdf": { icon: "/tcclibs/images/common/file-icon-pdf.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "txt": { icon: "/tcclibs/images/common/file-icon-text.png", svg: "/tcclibs/images/common/icon-preview-txt.svg" }
			, "text": { icon: "/tcclibs/images/common/file-icon-text.png", svg: "/tcclibs/images/common/icon-preview-txt.svg" }
			, "zip": { icon: "/tcclibs/images/common/file-icon-zip.png", svg: "/tcclibs/images/common/icon-preview-zip.svg" }
			, "exe": { icon: "/tcclibs/images/common/file-icon-etc.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "swf": { icon: "/tcclibs/images/common/file-icon-viedo.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "wmv": { icon: "/tcclibs/images/common/file-icon-viedo.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "mpg": { icon: "/tcclibs/images/common/file-icon-viedo.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "mpeg": { icon: "/tcclibs/images/common/file-icon-viedo.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "mp4": { icon: "/tcclibs/images/common/file-icon-music.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
			, "etc": { icon: "/tcclibs/images/common/file-icon-etc.png", svg: "/tcclibs/images/common/icon-preview-etc.svg" }
		}
		// , _USABLE_EXTENTIONS: ".txt,.pdf,.hwp,.doc,.docx,.ppt,.pptx,.xls,xlsx,.psd,.zip,.rar,.htm,.html,.log,image/*"	//인앱 브라우저 상태에서는 동작안함. 첫번째 하나만 먹기도 함. 나도 모르겠음. by noh
		, _USABLE_EXTENTIONS: ""	//어쩔수 없이 전체 허용함. by noh
		, _ATTACH_URL: "/servlet/fileupload?enctype=utf-8&sfolder="
		, init: function (target, opt) {
			var _$target = $(target)
				, _$wrap = null
				, _$body = null
				, _Deferred = $.Deferred()
				, _upload_result = null
				, _attach_type = this._ATTACH_ICONS
				, _attach_url = this._ATTACH_URL
				, _mode = "edit"
				, _opt = $.extend(true, {
					mode: _mode ? _mode : "read"
					, vmode: _mode == "edit" ? "edit" : "read"
					, ismobile: false
					, viewtype: ""
					, attach_url: this._ATTACH_URL
					, accept: this._USABLE_EXTENTIONS
					, header: true
					, dispheader: ['check', 'name', 'attachtype', 'size', 'status']
					, attachinfo: {}
					, isMegaAttach: false
					, MegaServer: $fn.getSysinfo().megaserver
					, MegaSendURL: $fn.getSysinfo().megasendurl
					, MegaDataURL: $fn.getSysinfo().megadataurl
					, limitDownloadDay: 30
					, limitDownloadCount: 0
					, MaxFileCount: 20						// 파일건수
					//,MegaChangeSize : 30 * 1024			// 대용량 변경사이즈
					//,MegaFileSize : 100 * 1024			// 대용량 최대사이즈
					//,OneFileMaxSize : 50 * 1024			// 일반파일 최대사이즈
					//,TotalFileMaxSize : 50 * 1024			// 일반파일 전체최대사이즈
					//,FileFilter : ""						// 파일확장자제한(일반,대용량)
					, zipdownload: true
					, folderkey: ""
					, folderskey: ""
					, singleFileUploads: true
					, headerinfo: [
						{
							id: "check"
							, width: "60px"
							, title: ""
							, mode: "edit"
							, render: function (ele, data, val) {
								var _self = this, _ele = ele
									, _tag = '<div class="dwp-checkbox textless">';
								_tag += '<label><input name="filecheck" type="checkbox" class="dwp-check"><span></span></label></div>';
								$(_tag).appendTo(ele);
							}
						}
						, {
							id: "name"
							, width: "auto"
							, title: $fn.getCodeMsg("comm.title.js027")
							, render: function (ele, data, val) {
								(/\.(\w+)$/g).test(data.name);
								var _self = this, _ele = ele
									//,_img = "png,gif,jpg.jpeg,bmp,tiff,htm,html,pdf"
									, _ft = (RegExp.$1) ? RegExp.$1.toLowerCase() : "etc"
									, _icon = _attach_type[_ft] ? _attach_type[_ft].icon : _attach_type.etc.icon
									//,_target = (_img.indexOf(_ft) > -1 ) ? "_blank" : "_blank"
									, _target = "_self"
									, _tag = '<span class="attach_file">';
								//_tag += ( _opt.mode === "edit" ? '<span class="attach_check"><input type="checkbox" value="1" name="filecheck"></span>':'');
								_tag += (typeof (data.url) != "undefined" ? '<a class="attach_link" href="' + data.url + '" download="" target="' + _target + '">' : '');
								_tag += '<span class="attach_icon"><img src="' + _icon + '" align="absmiddle"/></span>';
								_tag += '<span class="attach_filename">' + data.name + (data.size ? _opt.vmode == "read" ? " (" + data.size.toSize() + ")" : "" : "") + '</span>';
								_tag += (typeof (data.url) != "undefined" ? '</a>' : '') + '</span>';
								$(_tag).appendTo(ele);
								/*
								.find(".attach_link")
								.click(function(e) {
									if(e.preventDefault){e.preventDefault();} else {e.returnValue = false;}
									_self._doClickFile.call(_self,_self._fileData(_ele));
								});
								*/
							}
						}
						, {
							id: "ftype"
							, width: "120px"
							, title: $fn.getCodeMsg("comm.title.js028")
							, css: "center aligned"
							, mode: "edit"
							, render: function (ele, data, val) {
								var _self = this, _val;
								if (typeof (val) == "string") {
									_val = val
								} else {
									_val = val.val;
								}
								var _tag = '<span class="LANGPACK" CBTYPE="CODESEL" CBINPUT="ftype" CBDEFAULT="' + _val + '" CBCLASS="inp_w98" CBCATE="GP0006" CBALL="" />'
								return opt.vmode == "read" ? _val : _tag;
							}
						}
						, {
							id: "ftype_a"
							, width: "120px"
							, title: $fn.getCodeMsg("comm.title.js028")
							, css: "center aligned"
							, mode: "edit"
							, render: function (ele, data, val) {
								var _self = this, _val;
								if (typeof (val) == "string") {
									_val = val
								} else {
									_val = val.val;
								}
								var _tag = '<span class="LANGPACK" CBTYPE="CODESEL" CBINPUT="ftype_a" CBDEFAULT="' + _val + '" CBCLASS="inp_w98" CBCATE="GP0031" CBALL="" />'
								return _opt.vmode == "read" ? _val : _tag;
							}
						}
						, {
							id: "size"
							, width: "100px"
							, title: $fn.getCodeMsg("comm.title.js029")
							, css: "center aligned"
							, mode: "edit"
							, render: function (ele, data, val) {
								var _self = this;
								return val ? _opt.vmode == "read" ? " (" + val.toSize() + ")" : val.toSize() : "";
							}
						}
						, {
							id: "attachtype"
							, width: "110px"
							, title: $fn.getCodeMsg("comm.title.js030")
							, css: "center aligned"
							, ismega: true
							, render: function (ele, data, val) {
								var _self = this;
								_self._drawAttachtype.call(_self, ele, data, true);
							}
						}
						, {
							id: "limitday"
							, width: "100px"
							, title: "다운로드기한"
							, css: "center aligned"
							, ismega: true
							, render: function (ele, data, val) {
								var _self = this, _tag = $(ele);
								_self._drawLimitday.call(_self, ele, data, true);
								/*
								if (data.ismega) {
									var _date = new Data();
									_date.setDate(_date.getDate() + _opt.limitDownloadDay);
									_tag.append("<span>" + _date.format("yyyy-mm-dd") + "</span>");
								} else {
									_tag.append("<span>무기한</span>")
								}
								*/
							}
						}
						, {
							id: "limitcount"
							, width: "100px"
							, title: "다운로드횟수"
							, css: "center aligned"
							, ismega: true
							, render: function (ele, data, val) {
								var _self = this, _tag = $(ele);
								_self._drawLimitcount.call(_self, ele, data, true);
							}
						}
						, {
							id: "status"
							, width: "100px"
							, title: ""
							, css: "center aligned"
							, mode: "edit"
							, render: function (ele, data, val) {
								if (data.iswebfolder) { return "Web Folder"; }
								if (data.isnew !== true) { return "포함"; }
								/*
								var _tag = '<div class="progress progress-success progress-striped active" '
									+ 'role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">'
									+ '<div class="bar" style="width:0%;"></div>'
									+ '</div>';
								*/
								var _tag = '<div class="xui green progress">'
									+ '<div class="bar"></div>';
								$(_tag).appendTo(ele);
							}
						}]
					, dataset: undefined
					, remove: undefined
					, doc: null
				}, opt)
				, _that = {
					_options: _opt,
					_FILE_CHECK: true,
					_envInit: function () {
						//,MegaChangeSize : 30 * 1024			// 대용량 변경사이즈
						//,MegaFileSize : 100 * 1024			// 대용량 최대사이즈
						//,OneFileMaxSize : 50 * 1024			// 일반파일 최대사이즈
						//,TotalFileMaxSize : 50 * 1024			// 일반파일 전체최대사이즈
						//,FileFilter : ""						// 파일확장자제한(일반,대용량)
						var _sysinfo = $dwp.core.getSysinfo();
						if (_opt.hasOwnProperty("MegaSendURL")) {
							if (_opt.MegaSendURL == "") { _opt.MegaSendURL = _sysinfo.megasendurl; }
						} else {
							_opt.MegaSendURL = _sysinfo.megasendurl;
						}
						if (!_opt.hasOwnProperty("MegaChangeSize")) {
							if (_sysinfo.hasOwnProperty("megachangesize") && $.isNumeric(_sysinfo.megachangesize)) {
								_opt.MegaChangeSize = parseInt(_sysinfo.megachangesize, 10) * 1024;
							} else {
								_opt.MegaChangeSize = 30 * 1024;
							}
						}
						if (!_opt.hasOwnProperty("MegaFileSize")) {
							if (_sysinfo.hasOwnProperty("megasize") && $.isNumeric(_sysinfo.megasize)) {
								_opt.MegaFileSize = parseInt(_sysinfo.megasize, 10) * 1024;
							} else {
								_opt.MegaFileSize = 100 * 1024;
							}
						}
						if (!_opt.hasOwnProperty("OneFileMaxSize")) {
							if (_sysinfo.hasOwnProperty("maxattach") && $.isNumeric(_sysinfo.maxattach)) {
								_opt.OneFileMaxSize = parseInt(_sysinfo.maxattach, 10) * 1024;
							} else {
								_opt.OneFileMaxSize = 30 * 1024;
							}
						}
						if (!_opt.hasOwnProperty("TotalFileMaxSize")) {
							if (_sysinfo.hasOwnProperty("maxattach") && $.isNumeric(_sysinfo.maxattach)) {
								_opt.TotalFileMaxSize = parseInt(_sysinfo.maxattach, 10) * 1024;
							} else {
								_opt.TotalFileMaxSize = 30 * 1024;
							}
						}
						if (!_opt.hasOwnProperty("FileFilter")) {
							if (_sysinfo.hasOwnProperty("att_nm_filter")) {
								_opt.FileFilter = _sysinfo.att_nm_filter;
							}
						}
					},
					_create: function () {

						this._envInit();

						if (_opt.mode === "read") {
							if (!_opt.dataset) { return false; }
							if (!$.isArray(_opt.dataset)) { return false; }
							if (_opt.dataset.length === 0) { return false; }
						}
						this._drawWrap();
						if (_opt.ismobile) {
							if (_opt.mode == "edit") { this._drawActionsM(); } else { this._drawRActionsM(); }
						} else {
							if (_opt.mode == "edit") { this._drawActions(); } else { this._drawRActions(); }
						}

						(this["_drawViewData_" + _opt.vmode] ? this["_drawViewData_" + _opt.vmode] : this["_drawViewData_edit"]).call(this);

						if (_opt.mode == "edit") { this._initUploader(); }
						return true;
					},
					_drawWrap: function () {
						_$wrap = _$target;
					},
					_drawRActionsM: function () {
						//$("<div class='dwp-file-list'>").appendTo(_$wrap);
					},
					_drawRActions: function () {
						$("<div class='dwp-file-list'>").appendTo(_$wrap);
					}
					/*
					,__drawRActions : function() {
						var _self = this;
						$("<div class='nomargin row'></div>").appendTo(_$wrap)
						.append("<div class='nomargin col'><div class='_attach_act'></div></div>");

						$("<div class='xui input'><img style='cursor:pointer; vertical-align: middle;' src='/gwlib/comm/images/multiattach/ko/f_save_file.gif'/></div>")
						.appendTo($("._attach_act", _$wrap))
						.unbind().bind("click", function() {_self._onAllDownload.call(_self);});

						//ZIP 다운로드
						$("<div class='xui input' style='margin-left:5px;'><img style='cursor:pointer;vertical-align: middle;' src='/gwlib/comm/images/multiattach/ko/f_zip_save_file.gif'/></div>")
						//$(" <div class='xui _button green small h25 ' style='margin-left:5px;'>압축저장</div>")
						.appendTo($("._attach_act", _$wrap))
						.unbind().bind("click", function() {_self._onAllZipDownload.call(_self);});
						$("<p class='small'/>").appendTo(_$wrap);
					}
					*/
					// 모바일
					, _drawActionsM: function () {
						var _self = this;
						$("<div class='aligner'></div>").appendTo(_$wrap)
							.append("<div class='left'></div><div class='right'></div>");

						$(".left", _$wrap)
							.append("<span style='display:none'><input id='fileupload' type='file' name='%%File' multiple accept='"+ _opt.accept +"' class='hidden'/></span>")
							.append("<div class='btn-plus dwp-cursor'><img src='" + $fn.getPath('weblib') + "/images/common/icon-lnb-depth.svg'></div>")
							.append("<div class='title'>" + $fn.getCodeMsg("comm.title.js031") + "</div>")
							.on("click", "div.btn-plus", function () {
								$("input[type=file]", $(".left", _$wrap)).click();
							});;

						$(".right", _$wrap)
							.append("<div class='icon'><img src='" + $fn.getPath('weblib') + "/images/common/icon-file.svg'><span class='num'>" + _opt.dataset.length + "</span> / " + _opt.MaxFileCount + "</div>");
					}
					, _drawActions: function () {
						var _self = this;

						if ($("div.aligner", _$wrap).size() > 0) return;

						$("<div class='aligner' data-bottom='sm'></div>").appendTo(_$wrap)
							.append("<div class='left button _attach_act'></div>");

						$("._attach_act", _$wrap)
							.append("<span style='display:none'><input id='fileupload' type='file' name='%%File' multiple class='hidden'/></span>")
							.append("<div name='attach_btn' class='dwp-btn dwp-cursor'><span>" + $fn.getCodeMsg("comm.title.js032") + "</span></div>")
							.on("click", "div.dwp-btn[name=attach_btn]", function () {
								$("input[type=file]", $("._attach_act", _$wrap)).click();
							});

						// 옵션처리(2020-10-19 By LHJ)
						if (_opt.iswebfolder) {
							$("<div class='dwp-btn'><span>" + $fn.getCodeMsg("Web폴더첨부") + "</span></div>")
								.appendTo($("._attach_act", _$wrap))
								.off("click").on("click", function () {
									$dwp.app.webfolder.FileSelect({
										callback: function (data, _$dialog) {
											var _dataset = [];
											$.each(data, function (i, o) {
												var _o = $.extend({
													name: o._foldernm
													, url: "/" + o._filedbpath + "/0/" + o._fileunid + "/$FILE/" + encodeURIComponent(o._downfilenm) + "?openelement&attached"
													, size: o._filesize
													, isnew: false
													, iswebfolder: true
												}, o);
												_dataset.push(_o);
											});
											console.log("_dataset", _dataset);

											_self.add(_dataset);

											_$dialog.close();
										}
									});
								});
						}

						$("<div class='dwp-btn'><span>" + $fn.getCodeMsg("comm.title.js018") + "</span></div>")
							.appendTo($("._attach_act", _$wrap))
							.off("click").on("click", function () { _self._onDelete.call(_self); });

						$("<div class='dwp-btn'><span>" + (_opt.viewtype == "icon" ? $fn.getCodeMsg("comm.title.js033") : $fn.getCodeMsg("comm.title.js034")) + "</span></div>").appendTo($("._attach_act", _$wrap))
							.off("click").on("click", function () { _self._onViewChange.call(_self, $(this)); });
						/*
						$("<div class='xui button icon green'><i class='fa fa-trash-o'></i>임시저장</div>")
						.appendTo($("._attach_act", _$wrap))
						.unbind().bind("click", function() {_self._onSubmit.call(_self);});
						*/
						//$("<p class='small'/>").appendTo(_$wrap);
					}
					, _drawViewData_edit: function () {
						if (_opt.header && _opt.viewtype == "" && !_opt.ismobile) { this._header(); }
						this._drawViewInit();
						this._initDataset();
					},
					_drawViewData_read: function () {
						//if (_opt.header) { this._header();}
						this._initDataset();
					}
					, _drawViewInit: function () {
						if (_opt.ismobile) {
							_$body = $("<div name='file_dropzone' class='file-list'></div>").appendTo(_$wrap);
						} else {
							if (_opt.viewtype == "icon") {
								if ($("div.dwp-file-list-icon", _$wrap).size() == 0) {
									_$body = $("<div name='file_dropzone' class='dwp-file-list-icon'></div>").appendTo(_$wrap);
								}

								_$body.append("<div class='no-file'>" + $fn.getCodeMsg("comm.msg.msg044") + "</div>");

								_$body.sortable({
									items: "> div.item"
									, cursor: "pointer"
									, helper: "clone"
									//,scroll : false
									, start: function (event, ui) {
										var _w = ui.helper.width() + 2;
										ui.helper.width(_w);
									}
									, stop: function (event, ui) {
									}
									//, forceHelperSize : true
								}).disableSelection();

							} else {
								_$body.append("<div class='dwp-row'><div class='dwp-cell no-file'>" + $fn.getCodeMsg("comm.msg.msg044") + "</div></div>");

								_$body.sortable({
									items: "> div.dwp-row"
									, cursor: "pointer"
									, helper: "clone"
									//,scroll : false
									, start: function (event, ui) {
										var _w = ui.helper.width() + 2;
										ui.helper.width(_w);
									}
									, stop: function (event, ui) {
									}
									//, forceHelperSize : true
								}).disableSelection();
							}
						}
					}
					, _initDataset: function () {
						if (_opt.dataset == undefined) { return; }
						if (!$.isArray(_opt.dataset)) { return; }
						//2020-06-24 By LHJ Content-Dispostion 방식 변경
						//$.each(_opt.dataset, function(i, val){val.isnew = false;});	// 기존 Data
						$.each(_opt.dataset, function (i, val) {
							val.isnew = false;
							_url = val.url.toLowerCase();
							if (_url.indexOf("/$file/") > -1 && _url.indexOf("?openelement&attached") == -1) {
								val.url = val.url + "?openelement&attached";
							}

						});	// 기존 Data
						this.add(_opt.dataset);
					},
					// 일반/대용량 첨부전환
					changeAttachtype: function (row) {
						var _self = this, _row = $(row)
							, _data = this._fileData(_row);

						if (_data.ismega) { _data.ismega = false; } else { _data.ismega = true; }

						_self._drawAttachtype($('div[id="attachtype"]', row), _data, "", false);
						// 2021-09-08 By LHJ 일반파일 대용량 전환처리
						// _self._drawLimitday($('div[id="limitday"]', row), _data, "", false);
						// _self._drawLimitcount($('div[id="limitcount"]', row), _data, "", false);
						//console.log("data",_data);
					},
					_drawAttachtype: function (ele, data, isfirst) {
						var _self = this, _tag = $(ele), _convert = null;

						$(ele).empty();

						_convert = $("<span class='dwp-tag'></span>").appendTo(_tag);

						if (data.ismega) {
							_convert.html($fn.getCodeMsg("comm.title.js035"));
						} else {
							_convert.html($fn.getCodeMsg("comm.title.js036"));
							//if (data.isnew && _opt.vmode != "read") {_convert.removeClass("hidden");}
						}

                        // 2021-09-08 By LHJ 일반파일 대용량 전환처리
                        //if(isfirst && _convert != null) {
                        if(!data.ismegamax && data.isnew && _convert != null) {
                            _convert
                            .css({"cursor":"pointer", "font-weight" : "700"})
                            .on("click", function() {
                                _self.changeAttachtype.call(_self, data.data.context);
                            });
                        }
					},
					_drawLimitday: function (ele, data, isfirst) {
						var _self = this, _tag = $(ele);
						if (isfirst) {
							_tag.append("<span class='xui display hidden _txt'></span>");
							_tag.append("<div class='xui display hidden' style='margin-top:5px;'><input name='limitday' style='width:80px' value=''/></div>");

							$("span._txt", _tag).html(data.limitday);
							$("input", _tag).val(data.limitday);
							$("input", _tag).datepicker({ minDate: new Date() });
						}
						if (data.ismega) {
							if (_opt.vmode == "read") {
								$("div", _tag).addClass("hidden");
								$("span._txt", _tag).removeClass("hidden");
							} else {
								$("span._txt", _tag).addClass("hidden");
								$("div", _tag).removeClass("hidden");
							}
						} else {
							$("div", _tag).addClass("hidden");
							$("span._txt", _tag).html("무기한");
							$("span._txt", _tag).removeClass("hidden");
						}
					},
					_drawLimitcount: function (ele, data, isfirst) {
						var _self = this, _tag = $(ele);
						if (isfirst) {
							_tag.append("<span class='_txt'></span>");
						}
						if (data.ismega) {
							if (data.limitcount == 0) {
								$("span._txt", _tag).html("무제한");
							} else {
								$("span._txt", _tag).html(data.limitcount);
							}
						} else {
							$("span._txt", _tag).html("무제한");
						}
					}
					, _onViewChange: function (o) {
						var _self = this;
						var _data = _self._getAllFileData();
						if (_opt.viewtype == "") {
							$("div.dwp-table-file", _$wrap).remove();
							_opt.viewtype = "icon";
							$("span", o).text($fn.getCodeMsg("comm.title.js033"));
						} else {
							$("div.dwp-file-list-icon", _$wrap).remove();
							_opt.viewtype = "";
							$("span", o).text($fn.getCodeMsg("comm.title.js034"));
						}
						//console.log("_data", _data);
						if (_opt.header && _opt.viewtype == "" && !_opt.ismobile) { this._header(); }
						_self._drawViewInit();

						$.each(_data, function (i, o) {
							if (!o.isnew) { o.data = null }
							_self.add(o);
						});
					}
					, add: function (data) {
						var _self = this;
						if (!data) { return; }
						var _act = (_opt.ismobile ? "_addM" : "_add");
						if ($.isArray(data)) {
							$.each(data, function (idx, val) {
								(_self[_act + _opt.vmode] ? _self[_act + _opt.vmode] : _self[_act]).call(_self, val);
							});
						} else { (_self[_act + _opt.vmode] ? _self[_act + _opt.vmode] : _self[_act]).call(_self, data); }

						if (_opt.vmode == "read" && !_opt.ismobile && _opt.zipdownload) {
							var _h = "<div class='aligner' data-top='xs'><div class='left'>";
							_h += "<div class='dwp-btn icon-type'><span><img src='" + $fn.getPath("weblib") + "/images/common/icon-download.svg'>" + $fn.getCodeMsg("comm.title.js037") + "</span></div>";
							_h += "</div></div>";

							_$wrap.append(_h)
								.on("click", "div.dwp-btn", function () {
									_self._filedownload(data);
									/*
									var _deferreds = [];
									$("a.attach_link", _$wrap).each(function(i){
										var _o = this;
										var _time = (i+1) * 500;
										setTimeout(function() {_o.click()}, _time);
									});
									*/
									/*
									$.each(data, function(i, o){
										var _furl = _opt.doc.cdb + "/0/" + _opt.doc.unid + "/$FILE/" + encodeURIComponent(o.name);
										//_deferreds.push($.fileDownload(_furl, {httpMethod : "GET"}));
										$.fileDownload(_furl, {successCallback : function(url){
											console.log("aaa", url);
										}});
									});
									*/
									//console.log("AAAAA", _deferreds);
									//$.when.apply($, _deferreds).done(function() {
									//	$("body>iframe").remove();
									//});
									/*
										var _h = "<div class='dwp-filedown-dialog'>";
										_h += "<div class=''>";
										_h += "<div class='desc-area'><div class='subject'>" + $fn.getCodeMsg("comm.title.js038") + "</div>";
										_h += "<div class='dwp-input expended'><input type='text' value=''></div>";
										_h += "</div></div>";

										$fn.dialog(undefined, {
											title : $fn.getCodeMsg("comm.title.js038")
											,modal : true
											,ismobile : false
											,width: '324'
											,height: 'auto'
											,content : {html :_h}
											,buttons : [{
												title : $dwp.core.lang.getCodeMsg("comm.btn.confirm")
												,click : function(_$dialog) {
													var _$inp = $("input",_$dialog.element);
													var _prohibit = "$%&^."

													if (_$inp.val() == "") {
														$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg053") });
														_$inp.focus();
														return false;
													}
													if (isProhibit(_$inp.val())) {
														$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg054").replace("[$1]", _prohibit) });
														_$inp.focus();
														return false;
													}
													function isProhibit(data) {
														var _rtn = false;
														for(var i=0, j=_prohibit.length; i < j; i++) {
															if ( data.indexOf(_prohibit.charAt(i)) > -1 ) { _rtn = true; break; }
														}
														return _rtn;
													}
													var _filename = $.map(data, function(o){return encodeURIComponent(o.name);}).join("\\");
													var _data = {zipname : _$inp.val() + ".zip"
																	, baseUrl : _opt.doc.cdb + "/0/" + _opt.doc.unid + "/$FILE/"
																	, fileList : _filename
																	, fileNames : _filename
													}
													var _formdata = $.map(_data, function(v,p) {
														return p + "=" + v;
													}).join("&");

													$.fileDownload('/zipservice', {httpMethod : "POST", data :_formdata});

													_$dialog.close();
												}
											},
											{
												title : $dwp.core.lang.getCodeMsg("comm.btn.cancel")
												,click : function(_$dialog) {
													_$dialog.close();
												}
											}
											]
										});
									*/
									/*
									var _filename = $.map(data, function(o){return encodeURIComponent(o.name);}).join("\\");
									var _data = {zipname : "alldownload.zip"
													, baseUrl : _opt.doc.cdb + "/0/" + _opt.doc.unid + "/$FILE/"
													, fileList : _filename
													, fileNames : _filename
									}
									var _formdata = $.map(_data, function(v,p) {
										return p + "=" + v;
									}).join("&");

									$.fileDownload('/zipservice', {httpMethod : "POST", data :_formdata});
									*/
								});
						}
					},
					_filedownload: function (data) {
						var _lang = $dwp.core.lang.getUserLang();
						var _postjson = {
							"proto_ver": "1.0",
							"program_ver": "1.0",
							"run": "FileDownload_Client",
							"cookie": "LtpaToken=" + $.cookie("LtpaToken"),
							"language": (_lang == "ko" ? "KOR" : (_lang == "en" ? "ENG" : (_lang == "zh" ? "CHS" : "KOR"))),
							"files": []
						};

						$.each(data, function (i, o) {
							//2020-06-24 By LHJ
							//var _furl = _opt.doc.cdb + "/0/" + _opt.doc.unid + "/$FILE/" + encodeURIComponent(o.name);
							var _furl = _opt.doc.cdb + "/0/" + _opt.doc.unid + "/$FILE/" + encodeURIComponent(o.name) + "?openelement&attached";
							var _file = {};
							_file.name = o.name;
							_file.url = window.location.protocol + "//" + location.host + (location.port != "" ? ":" + location.port : "") + _furl;
							_file.size = parseFloat(o.size, 10);
							_postjson.files.push(_file);
						});

						$.ajax({
							url: "http://localhost:5701/command",
							type: "post",
							accept: "application/json",
							contentType: "application/json; charset=utf-8",
							crossDomain: true,
							data: JSON.stringify(_postjson),
							dataType: "json",
							success: function (data) {
								// success handle
							},
							error: function (jqXHR, textStatus, errorThrown) {
								// fail handle
								console.log("jqXHR", jqXHR);
								if (jqXHR.status == "404" || jqXHR.status == "0") {
									$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg058") }).done(function () {
										$fn.plugnin_install();
									});	//플러그인 프로그램이 설치되지 않았습니다.<br>로그인 화면의 <b>Install Plugin Program</b> 버튼을 클릭하여 설치 하시기 바랍니다.
								}
							}
						});

					},
					_addread: function (data) {
						if (!data) { return; }
						var _self = this
							, _$par = $("div.dwp-file-list", _$wrap)
							, _$row = $('<div class="dwp-file data_record" />').appendTo(_$par)

						$.each(_opt.dispheader, function (idx, v) {
							var o = _self._getheaderobj(v);
							if (o) {
								if (!o.ismega) {
									if (o.mode == _opt.mode || !o.mode) {
										var _col = $('<div class="dwp-file"/>').appendTo(_$row);
										_col.append(o.render ? o.render.call(_self, _col, data, data[o.id]) : data[o.id] ? data[o.id] : "&nbsp;").addClass(o.css ? o.css : "");
										if (o.id) { _col.attr("id", o.id); };
									}
								}
							}
						});
						if (data.data) {
							_$row.addClass("uploader");
						} else { data.data = {}; }
						data.data.context = _$row;
						_self._fileData(_$row, data).on({ submit: function (e) { _self._onDataSubmit($(this), _self._fileData(this)); } });
						return;
					},
					_addedit: function (data) {
						//console.log("data", data);
						if (!data) { return; }

						var _self = this, _row = null, _col = null;

						if (_opt.viewtype == "icon") {
							$("div.no-file", _$body).remove();

							_row = $('<div class="item data_record" />').appendTo(_$body);
							_$del = null;

							(/\.(\w+)$/g).test(data.name);

							var _ft = (RegExp.$1) ? RegExp.$1.toLowerCase() : "etc"
								, _icon = _attach_type[_ft] ? _attach_type[_ft].icon : _attach_type.etc.icon;

							_row.append("<div class='dwp-checkbox textless'><label><input name='filecheck' type='checkbox' class='dwp-check'/><span></span></label></div>");
							_row.append("<div class='icon'><a href='" + data.url + "' download='' target=_self><img src='" + _icon + "'></a></div>");
							_row.append("<div class='file-name'><a href='" + data.url + "' download='' target=_self>" + data.name + "</a></div>");

							if (_opt.isMegaAttach) {
								// 2021-09-08 By LHJ 일반파일 대용량 전환처리 - S
								//if (data.size > (_opt.MegaChangeSize * 1024)) {
								if (data.ismega) {
									_row.append("<div id='attachtype' class='file-size'><span class='dwp-tag'>" + $fn.getCodeMsg("comm.title.js035") + "</span></div>");
								} else {
									_row.append("<div id='attachtype' class='file-size'><span class='dwp-tag'>" + $fn.getCodeMsg("comm.title.js036") + "</span></div>");
								}

								if (!data.ismegamax && data.isnew) {
									$("div.file-size span.dwp-tag", _row)
										.css({ "cursor": "pointer", "font-weight": "700" })
										.on("click", function () {
											_self.changeAttachtype.call(_self, data.data.context);
										});
								}
                        		// 2021-09-08 By LHJ 일반파일 대용량 전환처리 - E
							}

						} else {
							$("div.no-file", _$body).parent().remove();

							_row = $('<div class="dwp-row data_record" />').appendTo(_$body);
							_col = null;
							$.each(_opt.dispheader, function (idx, v) {
								var o = _self._getheaderobj(v);
								if (o) {
									if (!(!_opt.isMegaAttach && o.ismega)) {
										if (o.mode == _opt.mode || !o.mode) {
											_col = $('<div class="dwp-cell" style="width:' + o.width + '"/>').appendTo(_row);
											if (o.id == "name") _col.css("text-align", "left");
											_col.append(o.render ? o.render.call(_self, _col, data, data[o.id]) : data[o.id] ? data[o.id] : "&nbsp;").addClass(o.css ? o.css : "");
											if (o.id) { _col.attr("id", o.id); };
										}
									}
								}
							});
						}
						if (data.data) {
							_row.addClass("uploader");
							//BN 수정 : 네이버처럼 새 메일 작성 상태에서 첨부를 클릭했을때 자동으로 임시저장을 시켜주고 edit로 열어주도록 처리
							$("#name", _row).off("click").on("click",function(){
								var _doc = $fn.getInstance("doc");
								if (_doc.options.cdb.toLowerCase().indexOf("/mail/") > -1) {
									$fn.confirm({ msg: "임시저장 후에 첨부된 파일을 열어볼 수 있습니다. 임시저장하시겠습니까?" }).done(function () {
										var _doc = $fn.getInstance("doc");
										$dwp.app.mail.doc.mailsave(_doc);
									})
								} else {
								}
							})
						} else { data.data = {}; }
						data.data.context = _row;
						_self._fileData(_row, data).on({ submit: function (e) { _self._onDataSubmit($(this), _self._fileData(this)); } });
						return;
					},
					_addMread: function (data) {
						if (!data) { return; }
						var _self = this
							, _$row = $('<div class="dwp-file data_record" />').appendTo(_$wrap);

						(/\.(\w+)$/g).test(data.name);

						var _ft = (RegExp.$1) ? RegExp.$1.toLowerCase() : "etc"
							, _icon = _attach_type[_ft] ? _attach_type[_ft].icon : _attach_type.etc.icon;

						//_$row.append("<a href='" + data.url + "' download target=_self><img src='" + _icon + "'>" + data.name + (data.size ? "("+ data.size.toSize() + ")" : "") + "</a>");
						var _$a = $("<a><img src='" + _icon + "'>" + data.name + (data.size ? "(" + data.size.toSize() + ")" : "") + "</a>").appendTo(_$row);
						_$a.off("click").on("click", function () {
							_self.mfileview(data);
							//dwpmo.fileDownload(data.url, data.name);
							//dwpmo.util.fileDownload(data.url, data.name);
						});

						if (data.data) {
							_$row.addClass("uploader");
						} else { data.data = {}; }
						data.data.context = _$row;
						_self._fileData(_$row, data).on({ submit: function (e) { _self._onDataSubmit($(this), _self._fileData(this)); } });
						return;
					},
					mfileview: function (data) {
						var _self = this;

						$dwp.core.util.callFileViewer($.extend({
							reqdata: {
								ReqApplCode: _opt.doc.applcode
								, ReqServer: _opt.doc.server
								, ReqDBPath: _opt.doc.cdb.substring(1)
								, ReqDocUNID: _opt.doc.unid
								, ReqDocSubject: _opt.doc.subject
								, ReqFilename: data.name
							}
						}, data));
					}
					, _addMedit: function (data) {
						if (!data) { return; }
						//console.log("data", data);
						var _self = this
							, _row = $('<div class="item data_record" />').appendTo(_$body)
							, _$del = null;

						// _row.append("<div class='file'><a href='" + data.url + "' target=_blank>" + data.name + "<span class='file-size'>" + (data.size ? "(" + data.size.toSize() + ")" : "") + "</span></a></div>");

						_row.append("<div class='file'></div>");

						var _$a = $("<a>" + data.name + "<span class='file-size'>" + (data.size ? "(" + data.size.toSize() + ")" : "") + "</span></a>").appendTo($("div.file", _row));
						_$a.off("click").on("click", function () {
							_self.mfileview(data);
							//dwpmo.fileDownload(data.url, data.name);
							// dwpmo.util.fileDownload(data.url, data.name);
						});

						_$del = $("<div class='btn-close'><a><img src='" + $fn.getPath("weblib") + "/images/common/icon-close.svg'></a></div>").appendTo(_row);

						_$del.off("click").on("click", function () { _self._onDeleteOne.call(_self, data); });

						if (data.data) {
							_row.addClass("uploader");
						} else { data.data = {}; }
						data.data.context = _row;
						_self._fileData(_row, data).on({ submit: function (e) { _self._onDataSubmit($(this), _self._fileData(this)); } });

						_self._fileCountDisp();

						return;
					},
					_header: function () {
						var _self = this
							, _$head = $('<div class="dwp-table-file"></div>').appendTo(_$wrap)
							, _$row = $('<div class="dwp-table-head"></div>').appendTo(_$head)
							, __$row = $('<div class="dwp-row"></div>').appendTo(_$row);
						//,_row = $('<div class="cell height nomargin theader row"></div>').appendTo(_$wrap);
						//this._initgridsize(__$row.innerWidth());

						var _h = "";
						/*
						$.each(_opt.headerinfo, function(i, o){
							if( !(!_opt.isMegaAttach && o.ismega) ) {
								if(o.mode == _opt.mode || !o.mode) {
									var _w = "width:" + o.width;
									_h += '<div class="center aligned border col" style="' + _w + '">' + o.title + '</div>';
								}
							}
						});
						*/
						$.each(_opt.dispheader, function (i, v) {
							var o = _self._getheaderobj(v);
							if (o) {
								if (!(!_opt.isMegaAttach && o.ismega)) {
									if (o.mode == _opt.mode || !o.mode) {
										var _w = "width:" + o.width;
										_h += '<div class="dwp-cell" style="' + _w + '">'
										if (o.id == "check") {
											_h += '<div class="dwp-checkbox textless">';
											_h += '<label><input type="checkbox" class="dwp-check-all"><span></span></label></div>';
										} else {
											_h += o.title;
										}
										_h += '</div>'
										//_h += '<div class="center aligned border col" style="' + _w + '">' + o.title + '</div>';
									}
								}
							}
						});
						__$row.html(_h);

						_$body = $("<div name='file_dropzone' class='dwp-table-body'></div>").appendTo(_$head);

						$(".dwp-check-all", __$row).on("click", function () {
							if ($(this).is(":checked")) {
								$("input[name=filecheck]", _$body).prop("checked", true);
							} else {
								$("input[name=filecheck]", _$body).prop("checked", false);
							}
						});

					},
					_getheaderobj: function (id) {
						var robj = null;
						$.each(_opt.headerinfo, function (i, o) {
							if (o.id == id) { robj = o; return false; }
						});
						//console.log(id);
						//console.log(robj);
						return robj;
					},
					_initgridsize: function (_fullwidth) {
						var _self = this, _ecnt = 0, _tot = 0;
						$.each(_opt.dispheader, function (i, v) {
							var o = _self._getheaderobj(v);
							if (o) {
								if (!(!_opt.isMegaAttach && o.ismega)) {
									if (o.mode == _opt.mode || !o.mode) {
										var _width = (typeof (o.width) == "undefined" ? "" : o.width);
										if (_width == "" || _width == "auto") {
											_ecnt++;
										} else {
											//console.log("_width", _width)
											if (_width.indexOf("%") == -1) {
												_width = parseFloat(_width.replace(/px/, ""), 10) * 100 / _fullwidth;
											} else {
												_width = parseFloat(_width.replace(/%/, ""), 10);
											}
											//console.log("_width", _width)
											o.width = _width + "%";
											_tot += parseFloat(_width, 10);
										}
									}
								}
							}
						});
						var _nwidth = 0;
						if (_ecnt > 0) { _nwidth = (100 - _tot) / _ecnt; }
						$.each(_opt.dispheader, function (i, v) {
							var o = _self._getheaderobj(v);
							if (o) {
								if (!(!_opt.isMegaAttach && o.ismega)) {
									if (o.mode == _opt.mode || !o.mode) {
										if (typeof (o.width) == "undefined" || o.width == "" || o.width == "auto") {
											o.width = _nwidth + "%";
										}
									}
								}
							}
						});
					},
					/*
					_initgridsize_bak : function(_fullwidth) {
						var _ecnt = 0, _tot = 0;
						$(_opt.headerinfo).each(function(i, o){
							if( !(!_opt.isMegaAttach && o.ismega) ) {
								if(this.mode == _opt.mode || !this.mode) {
									var _width = (typeof(this.width) == "undefined" ? "" : this.width);
									if ( _width == "" || _width == "auto" ) {
										_ecnt++;
									} else {
										if (_width.indexOf("%") == -1) {
											_width = parseFloat(_width.replace(/px/,""), 10) * 100 / _fullwidth;
										} else {
											_width = parseFloat(_width.replace(/%/,""), 10);
										}
										this.width = _width + "%";
										_tot += parseFloat(_width, 10);
									}
								}
							}
						});
						var _nwidth = 0;
						if ( _ecnt > 0 ) {_nwidth = (100 - _tot)/_ecnt;}
						$(_opt.headerinfo).each(function(i, o){
							if( !(!_opt.isMegaAttach && o.ismega) ) {
								if(this.mode == _opt.mode || !this.mode) {
									if ( typeof(this.width) == "undefined" || this.width == "" || this.width == "auto" ) {
										this.width = _nwidth + "%";
									}
								}
							}
						});
					},
					*/
					_fileData: function (tag, data) {
						var _$tag = $(tag).is(".data_record") ? $(tag) : $(tag).closest(".data_record");
						if (_$tag.size() == 0) { return; }
						return data ? _$tag.data("fileinfo", data) : _$tag.data("fileinfo");
					},
					_initUploader: function () {
						var _self = this;

						if ($("input[type=file]", _$wrap).data("fileupload") != null) return;

						function _initload(func) {
							if (typeof ($.fn.fileupload) != "function") {
								$LAB.script("/tcclibs/js/lib/jquery-fileupload.js").wait(function () {
									if (typeof (func) == "function") { func(); }
								});
							} else {
								if (typeof (func) == "function") { func(); }
							}
						}
						//console.log("singleFileUploads", _opt.singleFileUploads);
						_initload(function () {
							//$.fileuploader($("input[type=file]",_$wrap),{
							$("input[type=file]", _$wrap).fileupload({
								add: function (e, data) {
									if (_self._FILE_CHECK) {
										_self._addUploader.call(_self, e, data)
									}
								}
								, dataType: "json"
								, dropZone: _$wrap
								, progress: _self._onProgress
								, fail: function (e, data) { return _self._onFail(e, data); }
								, always: function (e, data) { return _self._onAlways(e, data); }
								, done: function (e, data) { return _self._onDone(e, data); }
								//,formData : _opt.formData
								, formData: function () { return _self.getFormData.call(_self); }
								//,formData : _self._options.formData
								//,url : _opt.url ? _opt.url : $mu.util.getAttachURL() + "?enctype=utf-8"
								, url: _opt.url ? _opt.url : _opt.attach_url
								//,singleFileUploads : _opt.singleFileUploads
								//,limitMultiFileUploads : 10
								//,limitMultiFileUploadSize : 1024 * 1024 * 1024
							});
						});
					}
					, getFormData: function () {
						var _self = this, formData = [];
						if (_self._options.isMegaAttach) {
							formData.push({ name: "__Click", value: "1" });
						}
						$.each(_self._options.formData, function (name, value) {
							formData.push({ name: name, value: value });
						});
						return formData;
					}
					, _addUploader: function (e, data) {
						var _self = this, files = data, _ismega = false, _ismegamax = false;
						var _errmsg = [];

						if (_self._isDuplicate(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg045").replace("[$1]", data.files[0].name));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg045").replace("[$1]", data.files[0].name)});
							//return;
						}
						else if (_self._isMaxFileCount(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg046").replace("[$1]", _opt.MaxFileCount));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg046").replace("[$1]", _opt.MaxFileCount)});
							//return;
						}
						else if (_self._isOneFileMaxSize(data)) {
							if (opt.isMegaAttach) {
								_errmsg.push($fn.getCodeMsg("comm.msg.msg047").replace("[$1]", data.files[0].name).replace("[$2]", _opt.MegaFileSize));
								//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg047").replace("[$1]", data.files[0].name).replace([$2], _opt.MegaFileSize)});
							} else {
								//_errmsg.push($fn.getCodeMsg("comm.msg.msg047").replace("[$1]", data.files[0].name).replace("[$2]", _opt.OneFileMaxSize));
								//일반 파일의 최대 크기를 MB로 표시 - 2020.06.24 by dwlee
								_errmsg.push($fn.getCodeMsg("comm.msg.msg047").replace("[$1]", data.files[0].name).replace("[$2]", (_opt.OneFileMaxSize / 1024) + "MB"));
								//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg047").replace("[$1]", data.files[0].name).replace([$2], _opt.OneFileMaxSize)});
							}
							//return;
						}
						else if (_self._isTotalFileMaxSize(data)) {		//일반 파일의 사이즈체크
							//_errmsg.push($fn.getCodeMsg("comm.msg.msg048").replace("[$1]",_opt.TotalFileMaxSize));
							//일반 파일의 최대 크기를 MB로 표시 - 2020.06.24 by dwlee
							_errmsg.push($fn.getCodeMsg("comm.msg.msg048").replace("[$1]", (_opt.TotalFileMaxSize / 1024) + "MB"));
							//if (opt.isMegaAttach) {
							//	$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg048").replace("[$1]",_opt.MegaFileSize)});
							//} else {
							$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg048").replace("[$1]", _opt.TotalFileMaxSize) });
							//}
							//return;
						}
						else if (_self._isMegaTotalFileMaxSize(data)) {	//대용량 파일의 사이즈체크
							_errmsg.push($fn.getCodeMsg("comm.msg.msg048").replace("[$1]", _opt.MegaFileSize));
							//if (opt.isMegaAttach) {
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg048").replace("[$1]",_opt.MegaFileSize)});
							//} else {
							//	$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg048").replace("[$1]",_opt.TotalFileMaxSize)});
							//}
							//return;
						}
						else if (_self._isProhibit(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg049").replace("[$1]", data.files[0].name).replace("[$2]", _opt.prohibit));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg049").replace("[$1]", data.files[0].name).replace("[$2]", _opt.prohibit)});
							//return;
						}
						else if (_self._isFileFilter(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg050").replace("[$1]", _opt.FileFilter));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg050").replace("[$1]",_opt.FileFilter)});
							//return;
						}
						else if (_self._isLikeFilter(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg051").replace("[$1]", _opt.LikeFilter + "]"));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg051").replace("[$1]", _opt.LikeFilter +"]")});
							//return;
						}
						else if (_self._isFileNameSize(data)) {
							_errmsg.push($fn.getCodeMsg("comm.msg.msg052").replace("[$1]", data.files[0].name));
							//$fn.alert({msg : $fn.getCodeMsg("comm.msg.msg052").replace("[$1]", data.files[0].name)});
							//return;
						}
						/*
						if(_self._isDuplicate(data)) {
							$fn.alert({msg : '선택한 파일 중 "'+data.files[0].name + '"은 이미 첨부된 파일입니다.'});
							return;
						}
						if(_self._isMaxFileCount(data)) {
							$fn.alert({msg : '첨부할 수 있는 최대갯수[' + _opt.MaxFileCount + ']를 초과하였습니다.'});
							return;
						}
						if(_self._isOneFileMaxSize(data)) {
							$fn.alert({msg : '선택한 파일[' + data.files[0].name + ']은 첨부할 수 있는 최대파일 사이즈[' + _opt.OneFileMaxSize + '(KB)]를 초과하였습니다.'});
							return;
						}
						if(_self._isTotalFileMaxSize(data)) {
							$fn.alert({msg : '첨부할 수 있는 전체 파일 사이즈[' + _opt.TotalFileMaxSize + '(KB)]를 초과하였습니다.'});
							return;
						}
						if(_self._isProhibit(data)) {
							$fn.alert({msg : '선택한 파일[' + data.files[0].name + ']에 금지문자[' + _opt.prohibit+ ']를 포함하고 있습니다.'});
							return;
						}
						if(_self._isFileFilter(data)) {
							$fn.alert({msg : "확장자가 [" + _opt.FileFilter +"]"+ '파일은 첨부할 수 없습니다.'});
							return;
						}
						 if(_self._isLikeFilter(data)) {
							$fn.alert({msg : "확장자가 [" + _opt.isLikeFilter +"]"+ '파일 만 첨부할 수 있습니다..'});
							return;
						}
						if(_self._isFileNameSize(data)) {
							$fn.alert({msg : '선택한 파일[' + data.files[0].name + ']의 파일명이 100자를 초과하였습니다.\n100자 이하로 변경 후 첨부하여 주십시오.'});
							return;
						}
						*/

						if (_errmsg.length > 0) {
							_self._FILE_CHECK = false;
							$fn.alert({ msg: _errmsg[0] }).done(function () { _self._FILE_CHECK = true; })
							//return false;
						} else {
							// 대용량체크
							if (_opt.isMegaAttach) {
								if (data.files[0].size > (_opt.MegaChangeSize * 1024)) { _ismega = true; _ismegamax = true; }
							}

							var _sysinfo = $dwp.core.getSysinfo();
							var _date = new Date();
							_date.setDate(_date.getDate() + parseInt(_sysinfo.megadownday, 10));

							_self._FILE_CHECK = true;

							this.add($.extend(true, {
								data: files
								, name: data.files[0].name
								, size: data.files[0].size
								, isnew: true
								, ismega: _ismega
								, ismegamax: _ismegamax
								, limitday: _date.format("yyyy-mm-dd")
								, limitcount: _opt.limitDownloadCount
							}, _opt.attachinfo));
						}
					},
					_isMaxFileCount: function (data) {
						if (!_opt.hasOwnProperty("MaxFileCount")) return false;
						if (typeof (_opt.MaxFileCount) != "number") return false;
						//console.log("_opt.MaxFileCount", _opt.MaxFileCount);
						var _data = this._getAllFileData();
						//console.log("_data", _data);
						if (!_data) { return false; }
						//console.log("_data.length", _data.length);
						if (_data.length >= _opt.MaxFileCount) { return true; }
						return false;
					},
					_isOneFileMaxSize: function (data) {
						if (!_opt.hasOwnProperty("OneFileMaxSize")) return false;
						if (typeof (_opt.OneFileMaxSize) != "number") return false;
						if (opt.isMegaAttach) {
							if (data.files[0].size > (_opt.MegaFileSize * 1024)) { return true }
						} else {
							if (data.files[0].size > (_opt.OneFileMaxSize * 1024)) { return true }
						}
						return false;
					},
					_isTotalFileMaxSize: function (data) {
						if (!_opt.hasOwnProperty("TotalFileMaxSize")) return false;
						if (typeof (_opt.TotalFileMaxSize) != "number") return false;
						var _data = this._getAllFileData();
						if (!_data) { return false; }
						if (_data.length == 0) { return false; }
						var totsize = 0, mtotsize = 0;

						if (opt.isMegaAttach) {												//대용량 첨부 사용중일때
							if (data.files[0].size > (_opt.MegaChangeSize * 1024)) {	//대용량 변환 사이즈를 넘어갈 때
								mtotsize = data.files[0].size;								//대용량 사이즈
							} else {
								totsize = data.files[0].size;									//일반 사이즈
							}
						} else {
							totsize = data.files[0].size;
						}
						$.each(_data, function (i, o) {
							if (!o.ismega) { totsize += parseInt(o.size, 10); }				//대용량 파일이 아닌 일반 파일만 계산
						});
						if (totsize > (_opt.TotalFileMaxSize * 1024)) { return true; }
						return false;
					},

					_isMegaTotalFileMaxSize: function (data) {
						if (!opt.isMegaAttach) { return false; }							//대용량 첨부 사용하지 않을경우 그냥 넘어감

						if (!_opt.hasOwnProperty("TotalFileMaxSize")) return false;
						if (typeof (_opt.TotalFileMaxSize) != "number") return false;
						var _data = this._getAllFileData();
						if (!_data) { return false; }
						if (_data.length == 0) { return false; }
						var totsize = 0, mtotsize = 0;

						if (data.files[0].size > (_opt.MegaChangeSize * 1024)) {		//대용량 변환 사이즈를 넘어갈 때
							mtotsize = data.files[0].size;									//대용량 사이즈
						}

						$.each(_data, function (i, o) {
							//totsize += parseInt(o.size, 10);
							if (o.ismega) { mtotsize += parseInt(o.size, 10); }			//대용량 파일인 경우만 더하기
						});
						if (mtotsize > (_opt.MegaFileSize * 1024)) { return true; }
						return false;
					},

					_isProhibit: function (data) {
						if (!_opt.hasOwnProperty("prohibit")) return false;
						if (typeof (_opt.prohibit) != "string") return false;
						var _rtn = false;
						for (var i = 0, j = _opt.prohibit.length; i < j; i++) {
							if (data.files[0].name.indexOf(_opt.prohibit.charAt(i)) > -1) { _rtn = true; break; }
						}
						return _rtn;
					},
					_isFileNameSize: function (data) {
						var _rtn = false;
						if (data.files[0].name.length > 100) { _rtn = true; }

						return _rtn;
					},
					_isFileFilter: function (data) {
						if (!_opt.hasOwnProperty("FileFilter")) return false;
						if (_opt.FileFilter == "") return false;
						var _flist = _opt.FileFilter.split("|");
						var _rtn = false;
						for (var i = 0, j = _flist.length; i < j; i++) {
							if (data.files[0].name.toUpperCase().indexOf("." + _flist[i].toUpperCase()) > -1) { _rtn = true; break; }
						}
						return _rtn;
					},
					_isLikeFilter: function (data) {
						if (!_opt.hasOwnProperty("LikeFilter")) return false;
						if (_opt.LikeFilter == "") return false;
						var _flist = _opt.LikeFilter.split("|");
						var _rtn = true;

						for (var i = 0, j = _flist.length; i < j; i++) {
							if (data.files[0].name.toUpperCase().indexOf("." + _flist[i].toUpperCase()) > -1) { _rtn = false; break; }
						}
						return _rtn;
					},
					_isDuplicate: function (data) {
						var _data = this._getAllFileData();
						if (!_data) { return false; }
						//console.log('file', _data);
						return $.map(_data, function (val, idx) { return (val.name == data.files[0].name ? true : null); }).length > 0;
						//return $$.util.array(_data).filter(function(idx,val) {	return val.name == data.files[0].name;}).length > 0;
					},
					_onAllDownload: function () {
						var _self = this
							, _rows = $(".data_record", _$wrap)
							, _alink = $("a.attach_link", _rows);

						if (_alink.size() > 0) {
							$.each(_alink, function () {
								this.click();
							});
						}
					},
					_onAllZipDownload: function () {
						var _rows = $(".data_record", _$wrap);
						var _alink = $("a.attach_link", _rows);
						var _o = { data: null };
						if (_alink.size() === 0) { return }
						//_o.data = _alink[0];
						_o.data = this._getAllFileData();
						//파일명 입력  box
						doc.zip_download_dialog(_o);
						//doc.ZipDownload(_o) ;
					},
					_onDelete: function () {
						var _sel = this._getSelectedData();
						if (_sel == null) { return; }
						$.each(_sel, function (idx, val) {
							if (val.isnew === false) {
								if (typeof (_opt.remove) == "function") { _opt.remove(val); };
							}

							// added 2020.12.29
							if (typeof(_upload_result) == "object") {
								if (_upload_result != null) {
									if (_upload_result.length > 0) {
										var _tmparray = [];
										$.each(_upload_result, function (uindex, res) {
											if (res.filename != val.data.attach_info.filename) {
												_tmparray.push(res);
											}
										});
										_upload_result = _tmparray;
									}
								}
							}

							$(val.data.context).remove();
						});
						if (_$body.html() == "") { this._drawViewInit(); }

						if ($("input[type=checkbox].dwp-check-all", _$wrap).size() > 0) {
							$("input[type=checkbox].dwp-check-all", _$wrap).prop("checked", false);
						}
					},
					_onDeleteOne: function (data) {
						var _self = this;
						if (data == null) { return; }
						if (data.isnew === false) {
							if (typeof (_opt.remove) == "function") { _opt.remove(data); };
						}
						$(data.data.context).remove();
						_self._fileCountDisp();
					},
					_fileCountDisp: function () {
						var _$num = $("div.right span.num", _$wrap);
						_$num.text($("div.item.data_record", _$body).size());
					},
					_getSelectedData: function () {
						return this._getAllFileData("input[name=filecheck]:checked");
					},
					_getUploaderRows: function () {
						//return $("div.row.tbody.uploader", _$wrap);
						if (_opt.viewtype == "icon") {
							return $("div.item.uploader", _$body);
						} else {
							if (_opt.ismobile) {
								return $("div.item.uploader", _$body);
							} else {
								return $("div.dwp-row.uploader", _$body);
							}
						}
					},
					_doClickFile: function (data) {
						//if(!$$.util.isLogin(true).islogin){return;}
						if (typeof _opt.click === "function") { _opt.click.call(data); return; }
						if (data.url) {
							//var _$iframe = $('<iframe src="' + data.url + '" style="width:1px;height:1px;" />').appendTo("body");
							//setTimeout(function() {_$iframe.remove();},2000);
							$.xware.lib.winopen(data.url, "", { width: 500, height: 500 });
						} else {
							$fn.alert({ msg: "문서가 저장되지 않은 상태에서는 로컬파일을 읽을 수 없습니다.<br>먼저 저장부터 하시기 바랍니다." });
						}
					},
					_onSubmit: function () {
						//console.log("bbb")
						var _self = this, _$upload = this._getUploaderRows();
						//console.log("a", _$upload.size());
						if (_$upload.size() == 0) { return null; }
						if (_opt.folderkey != "") {
							_opt.folderskey = $.now();
						}
						_$upload.trigger("submit");
						return _Deferred.promise();
					},
					_onDataSubmit: function (ele, data) {
						//console.log("data", data);
						var attach_info = { filename: data.name, filesize: data.size };
						if (data.ismega) {
							data.data.dataType = "text";
							//data.data.url = _opt.MegaSendURL;
							data.data.url = _opt.MegaServer + _opt.MegaSendURL;

							//var _limitday = $('div[id="limitday"] input[name="limitday"]', data.data.context).val();
							//data.limitday = _limitday;
							console.log("data", data);
							$.extend(true, attach_info, { ismega: data.ismega, ismegamax: data.ismegamax, limitcount: data.limitcount, limitday: data.limitday });
						} else if (_opt.folderkey != "") {
							data.data.url = (_opt.url ? _opt.url : _opt.attach_url) + _opt.folderkey + "_" + _opt.folderskey;
						}
						/*
						if(! $.isEmptyObject(_opt.attachinfo)) {
						$.each(_opt.attachinfo, function(k, v) {
							var _o = $('div[id="' + k + '"] [name="' + k + '"]', data.data.context);
							//console.log('a', _o.size());
							if (_o.size() == 1) {
								//console.log('nodeName', _o[0].nodeName);
								if (_o[0].nodeName == "SELECT") {
									data[k] = {val : _o.xval(), text : $("option:selected" , _o).text()}
								} else {
									data[k] = _o.xval();
								}
								attach_info[k] = data[k];
							}
						});
						}
						*/
						data.data.attach_info = attach_info;
						//console.log(" 첨부파일 _onDataSubmit  data.data.attach_info  " , data.data.attach_info )
						data.data.submit();
					},
					_getAllFileData: function (sel) {
						var _self = this
							, _rows = $(".data_record", _$wrap) //_rows = $(".attach_data tr",_$ele)
							, _result = null;
						//console.log('wrap', _$wrap);
						//console.log('_rows', _rows);
						if (sel) { _rows = $(_rows).has(sel); }
						if (_rows.size() == 0) { return _result; }
						_result = [];
						_rows.each(function () {
							_result.push(_self._fileData($(this)));
						});
						return _result;
					},
					// 대용량 첨부 존재여부확인
					_isMegaAttach: function () {
						var _self = this
							, _rows = $(".data_record", _$wrap)
							, _ismega = false;
						_rows.each(function () {
							var _data = _self._fileData($(this));
							if (_data.ismega) {
								_ismega = true;
								return
							}
						});
						return _ismega;
					},
					_removeMegaAttach: function () {
						var _self = this
							, _rows = $(".data_record", _$wrap)
							, _ismega = false;
						_rows.each(function () {
							var _data = _self._fileData($(this));
							if (_data.ismega) {
								$(this).remove();
							}
						});
					},
					_onDone: function (e, data) {
						var _self = this, _data = data;
						if (!_upload_result) { _upload_result = []; }

						if (typeof (data.result) == "string") {
							try {
								var _json = $.parseJSON(data.result);
								data.result = _json;
								if (data.result.status == "ok") {
									data.result.data[0].attach_info = data.attach_info;
									_upload_result.push(data.result.data[0]);
								} else {
									_upload_result = [];
								}
							} catch (e) {
								data.attach_info.folder = data.result;
								_upload_result.push(data.attach_info);
							}
						} else {
							if (data.result.status == "ok") {
								data.result.data[0].attach_info = data.attach_info;
								_upload_result.push(data.result.data[0]);
							} else {
								_upload_result = [];
							}
						}
						if (_upload_result.length == 0) {
							$(_data.context).addClass("fail");
							_Deferred.reject(_data);
							setTimeout(function () {
								$("#status", _data.context).html("실패");
							}, 300);
						} else {
							$(_data.context).removeClass("uploader");
							setTimeout(function () {
								$("#status", _data.context).html("완료");
								if (_self._getUploaderRows().size() == 0) { _self._onFinish(); };
							}, 300);
						}
					},
					_onAlways: function (e, data) {

					},
					_onFail: function (e, data) {
						var _self = this, _data = data;
						if (!_upload_result) { _upload_result = []; }

						$(_data.context).addClass("fail");
						_Deferred.reject(_data);
						setTimeout(function () {
							$("#status", _data.context).html("실패");
						}, 300);
					},
					_onFinish: function () {
						//_Deferred.resolve(_upload_result);
						if (_Deferred.state() == "pending") {
							this._sendMegainfo();
						}
					},
					_onProgress: function (e, data) {
						if (data.context) {
							var progress = Math.floor(data.loaded / data.total * 100);
							data.context.find('.progress')
								.find('.bar').css('width', progress + '%');
							/*
							data.context.find('.progress')
							.attr('aria-valuenow', progress)
							.find('.bar').css('width',progress + '%');
							*/
						}
					},
					_sendMegainfo: function () {
						var _xml = '';
						$.each(_upload_result, function (pos, o) {
							if (o.ismega) {
								//console.log("file:", o);
								//var _sysinfo = $dwp.core.getSysinfo();
								_xml += '<attach id="' + (pos + 1) + '">'
								_xml += '<name>' + encodeURIComponent(o.filename) + '</name>';
								_xml += '<location>' + o.folder + '</location>';
								_xml += '<size>' + o.filesize + '</size>';
								_xml += '<limitcount>' + o.limitcount + '</limitcount>';
								_xml += '<limitenddate>' + o.limitday + '</limitenddate>';
								//_xml += '<limitenddate>' + _sysinfo.megadownday + '</limitenddate>';
								_xml += '<uploader>' + $fn.getCurUser().pinfo.empno + '</uploader>';
								_xml += '</attach>'
							}
						});
						if (_xml != "") {
							_xml = '<?xml version="1.0" encoding="utf-8"?><attachs>' + _xml + '</attachs>';
							console.log("xml", _xml);
							$fn.xAjax({
								type: 'POST'
								//, url: _opt.MegaDataURL
								, url: _opt.MegaServer + _opt.MegaDataURL
								, dataType: "xml"
								, async: false
								, cache: false
								, processData: false, data: _xml
							}).done(function (xml) {
								var result = true;
								//console.log(xml.result.attachs);
								$.each($(xml).find("attach"), function (i, o) {
									if ($(o).find("code").text() != "100") {
										result = false;
										return false;
									}
								});
								if (result) {
									_Deferred.resolve(_upload_result);
								} else {
									_Deferred.reject(_upload_result);
								}
							}).fail(function () {
								_Deferred.reject(_upload_result);
							});
						} else {
							_Deferred.resolve(_upload_result);
						}
					},
					_reset: function () {
						_Deferred = $.Deferred();
						// 2019-10-01 By LHJ
						// removed 2020.12.29
						//_upload_result = [];
					},
					_fileuploaderSetOptions: function (opt) {
						var _opt = $.extend({}, opt);
						$("input[type=file]", _$wrap).fileupload(
							'option',
							_opt
						);
					}

				};

			return _$target.size() == 0 || !_that._create() ? null : {
				submit: function () { return _that._onSubmit(); }
				, reset: function () { return _that._reset(); }
				, getFileData: function () { return _that._getAllFileData(); }
				, isMegaAttach: function () { return _that._isMegaAttach(); }
				, removeMegaAttach: function () { return _that._removeMegaAttach(); }
				, setOptions: function (_opt) {
					$.extend(_that._options, _opt);
					console.log("ATTACH", _that._options);
				}
				, fileuploaderSetOpt: function (opt) {
					_that._fileuploaderSetOptions(opt);
				}
			};
		}
	}
}($dwp.cns("ui"), jQuery));
