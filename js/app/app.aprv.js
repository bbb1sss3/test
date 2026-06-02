/**
 * 전자결재 JS
 */
(function (_$$, $) {
	_$$.aprv = {
		portal: {
			loadlist: function (_fm, _opt, _id, view, _countid, catkey) {
				var _me = this,
					list = _me.getList('/' + _opt.inglinkdbpath + '/api/data/collections/name/' + view + '?ps=999&page=0&category=' + catkey,
						_me.DrawingList, {
						_fm: _fm,
						_opt: _opt,
						_id: _id,
						view: view,
						_countid: _countid
					}
					);
			},

			DrawingList: function (opt, list) {
				var _me = this,
					_$item = null,
					dlist = $('#' + opt._id, opt._fm),
					_openopt = { width: 980, isaprvportal: true };


				dlist.empty();

				if (list.length == 0) {
					$('#' + opt._countid, opt._fm).html('0');

					//2024.10.29 by dwlee
					//_$item = $("<div class='dwp-no-result'>" + $fn.getCodeMsg('aprv.msg.030') + '</div>').appendTo(dlist);
					//_$item = $("<li class='dwp-no-result' style=\"border: none\">" + $fn.getCodeMsg("aprv.msg.030") + "</li>").appendTo(dlist);
					_$item = $('<div class="dwp-no-result center"><img src="/tcclibs/images/common/icon-no-result.svg" alt=""><span>' + $fn.getCodeMsg("aprv.msg.030") + "</span></div>").appendTo(dlist);

					return false;
				}
				$('#' + opt._countid, opt._fm).html(list.length);

				$.each(list, function (i, _data) {
					var _html = [];
					if (i < 8) {
						if (_data["@unid"] != "") {
							//문서UNID로 핸들링하기 위하여 수정 - 2023.07.04 by dwlee
							//_html.push("<li class='unid_" + _data["@unid"] + '\'><a href="#">');
							_html.push('<div class="item dwp-cursor" data-unid="' + _data["@unid"] + '">');

							_html.push('<div class="name dwp-user">' + $fn.getCurLangMsg(_data._author) + '</div>');

							//_html.push("<p class='detail_link " + _class.join(" ") + "' style='font-weight:700 !important;font-size:15px !important'>" + _data._subject + "</p>");
							_html.push('<div class="subject _link">[' + $fn.getCurLangMsg(_data._category) + ']' + _data._subject + '</div>');

							if (opt.view.toLowerCase() == "wviwlist09") {
								_html.push("<div class='time'><span class='state'>[ " + $fn.getCodeMsg('aprv.title.h141') + " : " + _data['_delaychk'] + ' ]</span></div>');
							} else {
								_html.push("<div class='time'><span class='state'>" + $fn.getCodeObjMsg('aprv.data.status', _data['_sstatus']) + '</span></div>');
							}

							_html.push("</div>");

							if (i < 8) {
								_$item = $(_html.join("")).appendTo(dlist).data("openurl", _data._openurl);
							}

							$("[data-type='profile']", _$item)
								.off("click")
								.on("click", function () {
									$dwp.ui.bizcard.init($(this));
								});

							$("._link", _$item)
								.off("click")
								.on("click", function (e) {
									if (e.currentTarget === this) {
										/* 2019-06-07 By LHJ Add S*/
										if (opt.hasOwnProperty("comcode") && opt.comcode != "") {
											_$$.aprv.portal.ssoOpenDocument(_data, _openopt, opt.comcode);
										} else {
											_$$.aprv.portal.openDocument(_data, _openopt);
										}
										/* 2019-06-07 By LHJ Add E*/
										// _$$.aprv.portal.openDocument(_data, _openopt);
									}
								});

						}
					}
					/*
										return;
					
					
					
					
										_html = "<div class='item'>";
										_html += "<div class='user' data-type='profile' data-empno='" + _data._authorempno + "' style='cursor:pointer'>" + $fn.getCurLangMsg(_data._author) + '</div>';
										_html += "<div class='dwp-time'>" + $fn.formatDateTime(_data._startdate, 'relative1') + '</div>';
										_html += "<div class='title' style='cursor:pointer'>[" + $fn.getCurLangMsg(_data._category) + ']' + _data._subject + '</div>';
										if (opt.view.toLowerCase() == "wviwlist09") {
											_html += "<div class='category'><span class='state'>[ " + $fn.getCodeMsg('aprv.title.h141') + " : " + _data['_delaychk'] + ' ]</span></div>';
										} else {
											_html += "<div class='category'><span class='state'>" + $fn.getCodeObjMsg('aprv.data.status', _data['_sstatus']) + '</span></div>';
										}
										_html += '</div>';
					
										_$item = $(_html).appendTo(dlist).data('openurl', _data._openurl);
					
										$("[data-type='profile']", _$item).off('click').on('click', function () {
											$dwp.ui.bizcard.init($(this));
										});
										$('.title', _$item).on('click', function (e) {
											if (e.currentTarget === this) {
												if (opt.hasOwnProperty("comcode") && opt.comcode != "") {
													_$$.aprv.portal.ssoOpenDocument(_data, _openopt, opt.comcode);
												} else {
													_$$.aprv.portal.openDocument(_data, _openopt);
												}
												// _$$.aprv.portal.openDocument(_data, _openopt);
											}
										});
					
					
					*/

				});
			},

			//2024.10.29
			DrawingList_bk: function (opt, list) {
				var _me = this,
					_$item = null,
					dlist = $('#' + opt._id, opt._fm),
					_openopt = { width: 980, isaprvportal: true },
					_html = '';

				dlist.empty();

				if (list.length == 0) {
					$('#' + opt._countid, opt._fm).html('0');
					_$item = $("<div class='dwp-no-result'>" + $fn.getCodeMsg('aprv.msg.030') + '</div>').appendTo(dlist);
					return false;
				}
				$('#' + opt._countid, opt._fm).html(list.length);


				$.each(list, function (i, _data) {
					if (i > 9) { return false; }
					_html = "<div class='item'>";
					_html += "<div class='user' data-type='profile' data-empno='" + _data._authorempno + "' style='cursor:pointer'>" + $fn.getCurLangMsg(_data._author) + '</div>';
					_html += "<div class='dwp-time'>" + $fn.formatDateTime(_data._startdate, 'relative1') + '</div>';
					_html += "<div class='title' style='cursor:pointer'>[" + $fn.getCurLangMsg(_data._category) + ']' + _data._subject + '</div>';
					if (opt.view.toLowerCase() == "wviwlist09") {
						_html += "<div class='category'><span class='state'>[ " + $fn.getCodeMsg('aprv.title.h141') + " : " + _data['_delaychk'] + ' ]</span></div>';
					} else {
						_html += "<div class='category'><span class='state'>" + $fn.getCodeObjMsg('aprv.data.status', _data['_sstatus']) + '</span></div>';
					}
					_html += '</div>';

					_$item = $(_html).appendTo(dlist).data('openurl', _data._openurl);

					$("[data-type='profile']", _$item).off('click').on('click', function () {
						$dwp.ui.bizcard.init($(this));
					});
					$('.title', _$item).on('click', function (e) {
						if (e.currentTarget === this) {
							/* 2019-06-07 By LHJ Add S*/
							if (opt.hasOwnProperty("comcode") && opt.comcode != "") {
								_$$.aprv.portal.ssoOpenDocument(_data, _openopt, opt.comcode);
							} else {
								_$$.aprv.portal.openDocument(_data, _openopt);
							}
							/* 2019-06-07 By LHJ Add E*/
							// _$$.aprv.portal.openDocument(_data, _openopt);
						}
					});
				});
			},

			/**
			 * 전자결재 > 통합결재함 : 화면 하단의 그래프 출력
			 * @param {*} opt 
			 */
			init_graph: function (opt) {
				var _me = this;
				var _inst = $dwp.core.util.widget($.extend({
					initCallback: function (inst) {
						var _bardata = [[0, 0]],
							_piedata = [],
							_ticks = [],
							_formbardata = [],
							_formticks = [],
							noneData = "";

						//신규 차트 표시하기 - 2020.12.28
						var _celldata = [],
							_catdata = [],
							_datedata = [],
							_countdata = [];

						noneData = "<div style=\"width:100%;height: 100%;border: 1px solid #cfcfcf\">";
						noneData += "<div class=\"dwp-no-result\">표시할 Data가 없습니다.</div></div>";

						$(window).on("resize", function () {
							$("div[name^=_STAT_]", inst.element).each(function (i, o) {
								if ($(o).data("jqplot") != undefined) {
									$(o).data("jqplot").replot();
								}
							});
						});

						$dwp.core.util.xAjax({
							url: inst.options.cdb + "/wStatic1?OpenAgent",
							type: "GET",
							dataType: "json",
							async: true,
							cache: false,
							data: { dbpath: inst.options.ldbpath, view: "wViwList01", key: $fn.getComCode() + "^" + $fn.getCurUser().pinfo.empno }
						}).done(function (jdata) {


							//***********************************************/
							//		신규 차트 표시하기 - 2020.12.28		//
							//***********************************************/	
							var _totCnt = 0;
							var _tui_piedata = {
								'categories': [$fn.getCodeMsg("aprv.title.h145")],
								'series': [
									{ "name": $fn.getCodeMsg("aprv.title.h146"), "data": 0 },
									{ "name": $fn.getCodeMsg("aprv.title.h147"), "data": 0 },
									{ "name": $fn.getCodeMsg("aprv.title.h148"), "data": 0 },
									{ "name": $fn.getCodeMsg("aprv.title.h149"), "data": 0 }
								]
							};
							$.each(jdata, function (k, o) {
								var _tmpcnt = parseInt(o._logcount, 10);
								var _delay = parseInt(o._appname, 10);
								_totCnt += _tmpcnt
								if (_delay < 4) {
									_tui_piedata.series[0].data += _tmpcnt;
								} else if (_delay < 8) {
									_tui_piedata.series[1].data += _tmpcnt;
								} else if (_delay < 15) {
									_tui_piedata.series[2].data += _tmpcnt;
								} else {
									_tui_piedata.series[3].data += _tmpcnt;
								}
							});
							$.each(_tui_piedata.series, function (j, pdata) {
								//console.log("pdata : ", pdata.data);
								pdata.name += "(" + pdata.data + ")"; //타이틀에 건수 표시
								if (_totCnt > 0) {
									pdata.data = ((parseInt(pdata.data, 10) / _totCnt).toFixed(2)) * 10; //%로 표시
								} else {
									pdata.data = parseInt(pdata.data, 10)
								}
							});

							///console.log("_tui_piedata.series : ", _tui_piedata.series);

							var _tui_pieoptions = {
								chart: {
									width: 350,
									height: 350,
									format: function (value, chartType, areaType, valuetype, legendName) {
										if (areaType === 'makingSeriesLabel') { // formatting at series area
											value = Math.round(((value) * 10)) + '%';
										}
										return value;
									}
								},
								series: {
									radiusRange: ['40%', '100%'],
									showLabel: true
								},
								tooltip: {
									/*
									offsetY: -40,
									offsetX: -5,
									template: function(category, item) {
										//console.log("item :", item);
										var _text = item.legend + " [" + item.rationLable + " ]";
										return _text;
									}
									format: function(value, chartType, areaType, valuetype, legendName) {
										if (areaType === 'makingSeriesLabel') { // formatting at series area
											value = ((value) * 100) + '%';
										}
										return value;
									}
									*/
									//suffix: '%'
								},
								legend: {
									//align: 'bottom'
									align: 'right'
								}
							};
							//var container = $("div[name=_STAT_APP_ALL]", _inst.element);
							var pcontainer = document.getElementById("_STAT_APP_ALL");
							tui.chart.pieChart(pcontainer, _tui_piedata, _tui_pieoptions);
							//********************************************* */	


							//지연일자별 오름차순 소팅
							jdata.sort(function (a, b) {
								return parseInt(a._appname, 10) - parseInt(b._appname, 10)
							});

							$.each(jdata, function (k, o) {
								var _nm = $fn.getCurLangMsg(o._appname);
								_datedata.push(_nm + "일");
								_countdata.push(parseInt(o._logcount, 10));
							});

							//라인형태의 그래프
							var _tui_columnoptions = {
								chart: {
									width: 450,
									height: 300,
									format: '1,000'
								},
								yAxis: {
									title: $fn.getCodeMsg("aprv.title.h150"),
									min: 0,
									max: 15
								},
								xAxis: {
									title: $fn.getCodeMsg("aprv.title.h151"),
								},
								legend: {
									align: 'top'
								}
							};

							var _tui_columndata = {
								'categories': _datedata,
								'series': [{
									'name': $fn.getCodeMsg("aprv.title.h150"),
									'data': _countdata
								}]
							}

							var ccontainer = document.getElementById("_STAT_APP_ALL_P");
							//tui.chart.columnChart(ccontainer, _tui_columndata, _tui_columnoptions);							
							tui.chart.lineChart(ccontainer, _tui_columndata, _tui_columnoptions);



							return;

							$.each(jdata, function (k, o) {
								var _nm = $fn.getCurLangMsg(o._appname);
								_bardata.push([parseInt(_nm, 10), parseInt(o._logcount, 10)]);
								_piedata.push([_nm + $fn.getCodeMsg("aprv.title.h081"), o._logcount]);
							});

							/********** 결재 지연일별 건수 그래프 (원형) **********/
							if (_piedata.length == 0) {
								$("div[name=_STAT_APP_ALL]", _inst.element).html(noneData);
							} else {
								$("div[name=_STAT_APP_ALL]", _inst.element).empty();
								var plot2 = $("div[name=_STAT_APP_ALL]", inst.element).jqplot([_piedata], {
									animate: !$.jqplot.use_excanvas,
									seriesDefaults: {
										renderer: $.jqplot.PieRenderer,
										trendline: { show: false },
										rendererOptions: { showDataLabels: true }
									},
									legend: {
										show: true,
										placement: 'outside',
										rendererOptions: { numberRows: 1 },
										location: 's',
										marginTop: '15px',
										fontSize: '11pt'
									},
									axes: {
										xaxis: {
											tickOptions: { fontSize: '11pt' }
										},
										yaxis: {
											tickOptions: { fontSize: '11pt' }
										}
									}
								});
							}

							/********** 결재 지연일별 건수 그래프 (선형) **********/
							if (_bardata.length == 0) {
								$("div[name=_STAT_APP_ALL_P]", _inst.element).html(noneData);
							} else {
								$("div[name=_STAT_APP_ALL_P]", _inst.element).empty();
								var plot1 = $("div[name=_STAT_APP_ALL_P]", _inst.element).jqplot([_bardata], {
									animate: !$.jqplot.use_excanvas,
									seriesDefaults: {
										pointLabels: { show: true }
									},
									axes: {
										xaxis: {
											tickOptions: { fontSize: '11pt' }
										},
										yaxis: {
											tickOptions: { fontSize: '11pt' }
										}
									},
									highlighter: {
										show: true,
										tooltipAxes: "both",
										//tooltipOffset: 2,
										tooltipContentEditor: function (str, seriesIndex, pointIndex, plot) {
											var _str = str.split(", ");
											return "<div style='opacity:1; background-color:#fff; color:#000; font-size:11px; padding:2px 5px;'>" +
												_str[0] + $fn.getCodeMsg("aprv.title.h081") + " / " + _str[1] + $fn.getCodeMsg("comm.msg.msg019") + "</div>";
										}
									}
								});
							}
						});

						$dwp.core.util.xAjax({
							url: inst.options.cdb + "/wStatic2?OpenAgent",
							type: "GET",
							dataType: "json",
							async: true,
							cache: false,
							data: { dbpath: inst.options.eldbpath, view: "wViwList02", key: $fn.getComCode() + "^" + $fn.getCurUser().pinfo.empno }
						}).done(function (jdata) {

							var options = {
								chart: {
									width: 450,
									height: 300,
									format: '1,000'
								},
								yAxis: {
									title: $fn.getCodeMsg("aprv.title.h095")
								},
								xAxis: {
									title: $fn.getCodeMsg("aprv.title.h001")
								},
								legend: {
									align: 'top'
								}
							};

							//데이타가 없으면 그리지 말것
							if (jdata.head.list == "") {
								return;
							}

							var _hCode = jdata.head.list.split(",");
							var _hName = [];

							var _idata = [];
							var _ddata = [];

							$.each(_hCode, function (cindex, code) {
								_hName.push($fn.getCurLangMsg($fn.getCodeData("AP0001.GP0001." + code)[code]));
								_idata.push(0);
								_ddata.push(0);
							});

							//진행 데이타 보정
							$.each(jdata.data.ing, function (iindex, idata) {
								var _index = $.inArray(idata.name, _hCode);
								if (_index != -1) {
									_idata[_index] = idata.data;
								}
							});

							//완료 데이타 보정
							$.each(jdata.data.done, function (dindex, ddata) {
								var _index = $.inArray(ddata.name, _hCode);
								if (_index != -1) {
									_ddata[_index] = ddata.data;
								}
							});
							var _tui_columndata = {
								categories: _hName,
								series: [{
									'name': $fn.getCodeMsg("aprv.data.status.ing"),
									'data': _idata
								},
								{
									'name': $fn.getCodeMsg("aprv.data.status.complete"),
									'data': _ddata
								}
								]
							}

							var container = document.getElementById("_STAT_APP_ALL_E");

							tui.chart.columnChart(container, _tui_columndata, options);
							//tui.chart.lineChart(ccontainer, _tui_columndata, _tui_columnoptions);	


							return;


							$.each(jdata, function (k, o) {
								_formticks.push($fn.getCurLangMsg(o._appname));
								_formbardata.push(o._logcount);
							});

							/********** 완료문서 양식별 결재 건수 그래프 (세로 막대형) **********/
							if (_formbardata.length == 0) {
								$("div[name=_STAT_APP_ALL_E]", _inst.element).html(noneData);
							} else {
								$("div[name=_STAT_APP_ALL_E]", _inst.element).empty();
								$("div[name=_STAT_APP_ALL_E]", inst.element).jqplot([_formbardata], {
									animate: !$.jqplot.use_excanvas,
									seriesDefaults: {
										renderer: $.jqplot.BarRenderer,
										pointLabels: { show: true },
										rendererOptions: (_formbardata.length < 6 ? { varyBarColor: true, barWidth: 30 } : { varyBarColor: true })
									},
									axes: {
										xaxis: {
											renderer: $.jqplot.CategoryAxisRenderer, //$.jqplot.CategoryAxisRenderer,
											ticks: _formticks,
											tickOptions: { fontSize: '11pt' }
										},
										yaxis: {
											tickOptions: { fontSize: '11pt' }
										}
									},
									highlighter: {
										show: true,
										tooltipAxes: "y",
										//tooltipOffset: 2,
										tooltipContentEditor: function (str, seriesIndex, pointIndex, plot) {
											return "<div style='opacity:1; background-color:#fff; color:#000; font-size:11px; padding:2px 5px;'>" +
												plot.axes.xaxis.ticks[pointIndex] + " (" + str + ")</div>";
										}
									}
								});
							}
						});
					}
				}, opt));
			},


			setcount: function (opt, _count) {
				var obj = $('#' + opt._data._systemcode, opt._$item);
				obj.html(_count.count);
			},
			getcount: function (opt) {
				var _me = this;

				if (opt._data._countchk == 'N') {
					_me.setcount(opt, { count: '' });
					return false;
				}

				var _count = _me.getList(opt._data._counturl, _me.setcount, opt);
			},
			winopen: function (url, title, opt) {

				/* 팝업 윈도우 가운데 정렬 - 2025.04.16 by dwlee */
				var curX = window.screenLeft;
				var curY = window.screenTop;
				var curWidth = document.body.clientWidth;
				var curHeight = document.body.clientHeight;
				if (curY < 0) curY = 0;

				var _swidth = $fn.getConstant('winwidth');
				var _sheight = $fn.getConstant('winheight');
				if (opt.hasOwnProperty("width")) {
					_swidth = opt.width;
					_sheight = opt.height;
				}
				var winl = curX + (curWidth / 2) - (_swidth / 2);
				var wint = curY + (curHeight / 2) - (_sheight / 2);

				var _me = this,
					_opt = {},
					_pos = 1,
					_url = url;
				_opt = $.extend(
					true, {
					width: $fn.getConstant('winwidth'),
					height: $fn.getConstant('winheight'),

					/* 팝업 윈도우 가운데 정렬 - 2025.04.16 by dwlee */
					top: wint,
					left: winl,

					status: 1,
					menubar: 0,
					toolbar: 0,
					location: 0
				},
					opt
				);

				var state = $.map(_opt, function (val, key) {
					return key + '=' + val;
				}).join(',');
				var _n = window.open(_url, title, state);
				if (_n) {
					_n.focus();
				}
			},
			loadsystemlist: function (_fm, _opt, _id) {
				var _me = this,
					list = _me.getList(
						_opt.cdb +
						'/api/data/collections/name/wviwsyscount?ps=999&page=0&category={comcode}',
						_me.DrawingsystemList, { _fm: _fm, _opt: _opt, _id: _id }
					);
			},
			DrawingsystemList: function (opt, list) {
				var _me = this,
					_$item = null,
					dlist = $('#' + opt._id, opt._fm),
					_html = '',
					winopt = { width: 1366, height: 768 };

				// console.log("list",list);

				dlist.empty();

				$.each(list, function (i, _data) {
					_html = "<div class='card'>";
					_html += "<div class='inner'>";
					_html += "<div class='subject'>" + _data._systemname + '</div>';
					if (_data._countchk == 'Y') {
						_html += "<div class='desc'>" + $fn.getCodeMsg('aprv.title.h095') + "<span class='count' id='" + _data._systemcode + "'></span></div>";
					} else {
						_html += "<div class='desc'><span class='count' id='" + _data._systemcode + "'></span></div>";
					}
					_html += "<div class='dwp-btn'><button type='button'>Go</button></div>";
					_html += '</div>';
					_html += '</div>';

					_$item = $(_html).appendTo(dlist);

					$("[type='button']", _$item).on('click', function (e) {
						if (e.currentTarget === this) {
							vurl = $fn.getProxyUrl(_data._openurl);
							_$$.aprv.portal.winopen(vurl, '', winopt);
						}
					});

					_$$.aprv.portal.getcount({ _$item: _$item, _data: _data });
				});
			},
			getList: function (_url, callback, opt) {
				var _me = this,
					_data = null;

				$fn.xAjax({
					url: $fn.getProxyUrl(_url),
					method: 'GET',
					dataType: 'json',
					async: true,
					cache: false
				}).done(function (data) {
					if (typeof callback == 'function') {
						callback(opt, data);
					}
					_data = data;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});

				//return _data;
			},
			getprogress: function (obj) {
				var _me = this,
					tval = '',
					cval = '';

				if (obj._sstatus == 'reject' || obj._sstatus == 'receivewait' || obj._sstatus == 'received' || typeof obj['_appinginfo'] == 'undefined') {
					cval = 0;
				} else {
					tval = obj['_appinginfo'].split('/');
					if (tval[0] == tval[1]) {
						cval = ((tval[0] - 1) / tval[1]) * 100;
					} else {
						cval = (tval[0] / tval[1]) * 100;
					}
				}

				return cval == 0 ? '' : parseInt(cval) + '%';
			},


			//팝업창을 가운데 띄우는 함수 - 2024.11.29 by dwlee
			NewWindow: function (mypage, myname, w, h, scroll) {
				var winl = (screen.width - w) / 2;
				var wint = (screen.height - h) / 2;
				var settings = 'height=' + h + ',';
				settings += 'width=' + w + ',';
				settings += 'top=' + wint + ',';
				settings += 'left=' + winl + ',';
				settings += 'scrollbars=' + scroll + ',';
				settings += 'resizable=yes';

				var win = window.open(mypage, myname, settings);

				try {
					if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
				} catch (e) { console.log(e) };

			},

			openDocument: function (o, opt) {
				var _me = this; // 2024.11.29
				var _h = $fn.getScreenInfo().doc_h * 0.8,
					_url = '';
				var _opt = $.extend({
					title: o._subject,
					type: 'doc',
					width: '980',
					height: _h,
					modal: true,
					islangconvert: false,
					open: function () {
						$(this).parents('.ui-dialog').attr('tabindex', -1)[0].focus();
					},
					content: { html: '', url: '', data: {} }
				},
					opt
				);

				/*
								try {
									_opt.content.url = _$$.util.getProxyUrl(o._openurl);
								} catch (e) {
									_opt.content.url = o._openurl;
								}
				*/

				//통합검색 색인 처리시에는 _openurl이 없음 - 2024.05.08 by dwlee
				if (o.hasOwnProperty("_openurl")) {
					try {
						_opt.content.url = _$$.util.getProxyUrl(o._openurl);
					} catch (e) {
						_opt.content.url = o._openurl;
					}
					//통합검색 색인에서 문서를 여는 경우 - 2024.05.08 by dwlee
				} else {
					var _nsf_path = o["@href"].split(".nsf")[0] + ".nsf";
					_nsf_path = _nsf_path.substring(1, _nsf_path.length); //맨앞 '/' 날리기					
					_opt.content.url = "/" + _nsf_path + "/0/" + o["@unid"] + "?Opendocument";

					//HS 화성 - 마이그레이션 한 문서는 팝업 - 2024.11.29 by dwlee
					if (row.hasOwnProperty("isWecoy") && row.isWecoy == "1") {

						//관리자 테스트용 - 2025.04.16 by dwlee
						if ($fn.getCurUser().pinfo.empno == "P00001") {
							//var _url = "https://gw.kbws.co.kr/dwp/com/portal/main.nsf/wfrmBridge?ReadForm&_=1&url=/" + _opt.content.url + "format=new";
							_me.NewWindow("https://" + $fn.getSysinfo().hostname + _opt.content.url, "AprWin", "884", "800", "no");
						} else {
							_me.NewWindow("https://" + $fn.getSysinfo().hostname + _opt.content.url, "AprWin", "884", "800", "no");
						}
						return;
					}
				}

				if (_opt.hasOwnProperty('isaprvportal') && _opt.isaprvportal) {
					_opt.content.data.aprvportal = '1';
				}
				// console.log("_opt",_opt);
				$fn.dialog(null, _opt);
			},
			/* 2019-06-07 By LHJ Add S*/
			ssoOpenDocument: function (o, opt, comcode) {
				var _cominfo = $dwp.core.portal.getHostCom(comcode);
				var _url = _$$.util.getProxyUrl(o._openurl);
				var _ssourl = 'http://' + _cominfo.host + '/dwp/com/portal/ssologin.nsf/FSSO?CreateDocument&type=B&empno=' + $fn.getCurUser().pinfo.empno + '&url=';

				_ssourl += escape(_url);

				_$$.aprv.portal.winopen(_ssourl, '', { width: 1366, height: 768 });
			},
			/* 2019-06-07 By LHJ Add E*/
			// 결재 좌측메뉴 건수 표시
			update_count: function (opt) {
				var rtn = {},
					_mailpath = $fn.getPath('mail'),
					_portal = '';
				if (opt == 'portal') {
					opt = [
						'wviwlist04',
						'wviwlist05',
						'wviwlist05_dept',
						'wviwlist05_admin',
						'wviwlist06',
						'wviwlist07',
						'wviwlist10',
						/*
						by mjkim 20251111 보류추가
						*/
						'wviwlist12',

						'wviwlist09',
						//외부공문 - 접수대기, 공람할 문서, 공람진행문서 추가 - 2023.05.16 by dwlee
						//대외수신대기, 대외 발신 대기
						'wviwlist134',
						'wviwlist135',
						'wviwlist136',
						'wviwlist88',
						'wviwlist89',
						'wviwlist90'
					];
					_portal = 'portal';
				}
				if (typeof opt == 'undefined') {
					opt = [
						'wviwlist04',
						'wviwlist05',
						'wviwlist05_dept',
						'wviwlist05_admin',
						'wviwlist06',
						'wviwlist07',
						'wviwlist10',
						'wviwlist09',
						/*
						by mjkim 20251111 보류추가
						*/
						'wviwlist12',

						//외부공문 - 접수대기, 공람할 문서, 공람진행문서 추가 - 2023.05.16 by dwlee
						//대외수신대기, 대외 발신 대기
						'wviwlist134',
						'wviwlist135',
						'wviwlist136',
						'wviwlist88',
						'wviwlist89',
						'wviwlist90'	//출장복명서								
					];
				}
				$fn.xAjax({
					url: $fn.getProxyUrl('/dwp/aprv/com/link/aprvilink.nsf/AprvCnt.json?readform'),
					method: 'GET',
					dataType: 'json',
					data: {
						empno: $fn.getCurUser().pinfo.empno,
						deptcd: $fn.getCurUser().pinfo.orgcode,
						comcode: $fn.getCurUser().pinfo.comcode //회사(계열사)별 문서만 조회되도록 변경. by noh
					},
					async: false,
					cache: false
				}).done(function (data) {
					// console.log("처리",data);
					rtn = $dwp.core.util.exObjList(data, opt);
				});
				return rtn;
			}
		},
		util_fnc: { //SCG 결j재양식 항목의 데이터 변경용 함수
			convertDate: function (dvalue) {
				var rvalue = "";
				//날짜 타입이 "2009-05-16" 인 경우
				if (dvalue.indexOf("-") > 0) {
					rvalue = dvalue.substring(0, 4) + dvalue.substring(5, 7) + dvalue.substring(8, 10);
					//날짜 타입이 "05/16/2009" 인 경우
				} else {
					rvalue = dvalue.substring(6, 10) + dvalue.substring(0, 2) + dvalue.substring(3, 5);
				}
				return rvalue;
			},
			dateToHangul: function (dateValue) {
				var retValue = "";
				if (dateValue.length == 10) {
					retValue = dateValue.substring(0, 4) + "년 " + dateValue.substring(5, 7) + "월 " + dateValue.substring(8, 10) + "일";
				} else if (dateValue.length == 8) {
					retValue = dateValue.substring(0, 4) + "년 " + dateValue.substring(4, 6) + "월 " + dateValue.substring(6, 8) + "일";
				} else { }
				return retValue;
			},
			dateToHangul_YYYYMM: function (dateValue) {
				var retValue = "";
				if (dateValue.length == 10) {
					retValue = dateValue.substring(0, 4) + "년 " + dateValue.substring(5, 7) + "월";
				} else if (dateValue.length == 8) {
					retValue = dateValue.substring(0, 4) + "년 " + dateValue.substring(4, 6) + "월";
				} else { }
				return retValue;
			},
			numberToDate: function (numValue, sep) {
				if (numValue.length != 8) return false;
				if (arguments.length == 2) {
					var vDate = numValue.substring(0, 4) + sep + numValue.substring(4, 6) + sep + numValue.substring(6, 8);
				} else {
					var vDate = numValue.substring(0, 4) + "-" + numValue.substring(4, 6) + "-" + numValue.substring(6, 8);
				}
				return vDate;
			},
			numberToTime: function (numValue, sep) {
				if (!(numValue.length == 4 || numValue.length == 6)) return false;
				if (arguments.length == 2) {
					if (numValue.length == 4) {
						var vTime = numValue.substring(0, 2) + sep + numValue.substring(2, 4)
					} else {
						var vTime = numValue.substring(0, 2) + sep + numValue.substring(2, 4) + sep + numValue.substring(4, 6);
					}
				} else {
					if (numValue.length == 4) {
						var vTime = numValue.substring(0, 2) + ":" + numValue.substring(2, 4)
					} else {
						var vTime = numValue.substring(0, 2) + ":" + numValue.substring(2, 4) + ":" + numValue.substring(4, 6);
					}
				}
				return vTime;
			},
			Browser: function () {
				var Browser = { a: navigator.userAgent.toLowerCase() };

				var msie = !Browser.a.match(/msie/);
				var trident = !!Browser.a.match(/trident\/7.0/);
				//var net = !!Browser.a.match(/.net4.0e/);
				//var IE11 = trident && net && msie
				var IE11 = trident && msie;
				var _ret = {
					ie: (Browser.a.indexOf("msie") != -1) || IE11,
					ieOld: Browser.a.indexOf("msie") != -1,
					ie6: Browser.a.indexOf("msie 6") != -1,
					ie7: Browser.a.indexOf("msie 7") != -1,
					ie8: Browser.a.indexOf("msie 8") != -1,
					ie9: Browser.a.indexOf("msie 9") != -1,
					ie10: Browser.a.indexOf("msie 10") != -1,
					ie11: IE11,
					opera: !!window.opera,
					safari: Browser.a.indexOf("safari") != -1,
					safari3: Browser.a.indexOf("applewebkit/5") != -1,
					mac: Browser.a.indexOf("mac") != -1,
					chrome: Browser.a.indexOf("chrome") != -1,
					firefox: Browser.a.indexOf("firefox") != -1
				}
				return _ret;
			}
		},
		org: {
			// 자동완성 처리
			autocomplete: function (_$dialog, fn, seltype, index) {
				var _me = this,
					_$sel = $('select', _me.element),
					$org = $dwp.ui.org,
					_stxtlist = $dwp.core.lang.getCodeMsg('comm.data.org_stype'),
					_dsel = '',
					_opt = {
						autoFocus: true,
						minLength: 2,
						position: {
							my: 'left top',
							at: 'left bottom',
							collision: 'flipfit'
						},
						source: function (request, response) {
							var _data = {
								q: request.term,
								cc: $fn.getCurUser().pinfo.comcode
							};

							function _getType(type) {
								switch (type) {
									case '0':
										return 'p,d';
										break;
									case '2':
										return 'p';
										break;
									case '1':
										return 'd';
										break;
								}
							}

							_data.type = _getType(seltype);

							$.getJSON('/dwprts/quicksearch', _data, function (data) {
								var _response = [];
								$.each(data.response.org, function (i, o) {
									o.type = 'B';
									var _item = $org.data.qsConvert(o),
										_org = new $org.data.org(_item);
									_response.push({
										label: _org.getDispName(),
										value: _item
									});
								});
								$.each(data.response.person, function (i, o) {
									o.type = 'S';
									var _item = $org.data.qsConvert(o),
										_org = new $org.data.org(_item);

									_response.push({
										label: _org.getDispName(),
										value: _item
									});
								});
								response(_response);
							});
						},
						response: function (event, ui) { },
						focus: function (event, ui) {
							return false;
						},
						select: function (event, ui) {
							// console.log("select",ui);
							var _item = [],
								_orgdata;
							_orgdata = ui.item.value;

							_item.data = [];

							// console.log("!! _orgdata",_orgdata);

							_item.data.type = _orgdata.type;
							_item.data.key = _orgdata.key;
							_item.data.orgdata = _orgdata;
							// console.log("_item",_item);
							_me.addListItem(_$dialog, _item, index, undefined, true);

							$("input[name='" + fn + "']", _me.element).val('');

							return false;
						}
					};

				$dwp.ui.autocomplete.init(
					$("input[name='" + fn + "']", _me.element),
					_opt
				);

				// console.log('_autocomplete complete : '+fn)
			},
			gridallrefresh: function (_$dialog) {
				var _me = this,
					_refdata = _$dialog.options.refdata,
					_agel,
					_gridinfo = _refdata.grid,
					rval = '',
					adindex = 0,
					_rtn = _refdata.digval;

				$.each(_gridinfo, function (i, o) {
					if (o.hasOwnProperty('children')) {
						var getagval = function (_agel, appindex) {
							var rval2 = '',
								setval = '';

							$.each(_agel, function (k, arval) {
								arval.appindex = appindex;
								setval = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.APP.TLIST, arval, '^', ';', _$$.aprv.line.PROP.APP.KEY);
								k == 0 ? (rval2 = $.trim(setval.fullinfo)) : (rval2 += ';' + $.trim(setval.fullinfo));
							});

							return rval2;
						};

						var item01 = _$$.aprv.com.arrayclean(
							_rtn[o.prop][o.children[0].prop],
							undefined
						);

						$.each(item01, function (j, val) {
							var setval = '';

							_agel = _$$.aprv.com.arrayclean(
								_rtn[o.prop][o.children[1].prop][j],
								undefined
							);
							val.appindex = String(adindex + 1);
							setval = _$$.aprv.com.getObjStr(
								_$$.aprv.line.PROP.APP.TLIST, val, '^', ';', _$$.aprv.line.PROP.APP.KEY);

							if (_agel.length > 0) {
								// 협조자 유무 체크
								rval == '' ? (rval += getagval(_agel, val.appindex)) : (rval += ';' + getagval(_agel, val.appindex));
							}

							rval == '' ? (rval += $.trim(setval.fullinfo)) : (rval += ';' + $.trim(setval.fullinfo));

							adindex += 1;
						});

						// console.log("rval",rval.split(";"));
						_me.reload(_$dialog, rval);
					} else {
						//일반 데이터
					}
				});
			},
			setwareceiver: function (_rtn, _$dialog, $doc, setdoc) {
				var _me = this,
					_el = $doc.element,
					_docopt = $doc.options,
					_agel,
					//_gridinfo = _$dialog.options.refdata.grid,
					//_refdata = _$dialog.options.refdata,
					_isadmin = _docopt.isadmin,
					rval = '',
					adindex = 0,
					sDocStep = _docopt.sDocStep,
					datachk = false,
					_msgbox = '',
					savedata = new Object();

				var _fnnm = '',
					_fncode = '',
					_fnfull = '',
					_fndisp = '';
				//console.log('일반 데이터');
				//console.log('_rtn[o.prop]', _rtn["list"]);
				if (_rtn["list"].length == 0) {
					datachk = true;
					_msgbox = "메시지";
					return false;
				}

				var _$namelist = $('div[name=Circulation3Disp]', _el);
				_$namelist.empty();

				var _$fld = $("input[name='Circulation3']", _el),
					_$fld_full = $("input[name='Circulation3Full']", _el);

				$.each(_rtn["list"], function (j, val) {
					/* 2018-0821 By LHJ 주석처리
					var setval="";
					setval = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.REC.TLIST,val, "^", ";" , _$$.aprv.line.PROP.REC.KEY);
					( _fnfull==""?_fnfull+=$.trim(setval.fullinfo):_fnfull+=";"+$.trim(setval.fullinfo));
					( _fnnm==""?_fnnm+=$.trim(setval.orgname):_fnnm+=";"+$.trim(setval.orgname));
					( _fncode==""?_fncode+=$.trim(setval.key):_fncode+=";"+$.trim(setval.key));
					( _fndisp==""?_fndisp+=$fn.getCurLangMsg($.trim(setval.orgname)):_fndisp+=","+$fn.getCurLangMsg($.trim(setval.orgname)));
					*/
					var _org = new $dwp.ui.org.data.org(val),
						item = _org.oinfo;

					_fnfull == '' ? (_fnfull += $.trim(_org.sinfo)) : (_fnfull += ';' + $.trim(_org.sinfo));
					_fncode == '' ? (_fncode += $.trim(item.key)) : (_fncode += ';' + $.trim(item.key));
					/*
					var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
					_$namelist.empty();
					*/
					var _$nametarget = $("<div class='namepicker-target dwp-cursor'></div>").appendTo(_$namelist);

					if (item.type == 'B') {
						$("<span class='photo'><img src='" + $dwp.core.getPath('weblib') + "/images/common/default-team.svg'/></span>").appendTo(_$nametarget);
						$("<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$nametarget);
					} else {
						var _$div = $("<div class='dwp-cursor' da ta-type='profile' style='display:inline-block'></div>").appendTo(_$nametarget);
						$("<span class='photo'><img src='" + $dwp.core.getPath('pic', { empno: item.empno }) + "'/></span>").appendTo(_$div);
						$("<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$div);

						$fn.getPicError($('img', _$div));

						_$div.attr({
							'data-empno': item.empno,
							'data-orgcode': item.orgcode
						}).off('click').on('click', function () {
							$dwp.ui.bizcard.init($(this), {
								ismobile: _docopt.ismobile
							});
						});

						if (j == 0) {
							_$fld.xval(_org.oinfo.notesid);
							_$fld_full.xval(_org.sinfo);
						} else {
							_$fld.xval(_$fld.xval() + ";" + _org.oinfo.notesid);
							_$fld_full.xval(_$fld_full.xval() + ";" + _org.sinfo);
						}
					}
				});
				return;
			},
			setappval: function (_rtn, _$dialog, $doc, setdoc) {
				//console.log("결재선 지정창 setappval")
				var _me = this,
					_el = $doc.element,
					_docopt = $doc.options,
					_agel,
					_gridinfo = _$dialog.options.refdata.grid,
					_refdata = _$dialog.options.refdata,
					_isadmin = _docopt.isadmin,
					rval = '',
					adindex = 0,
					sDocStep = _docopt.sDocStep,
					datachk = false,
					_msgbox = '',
					savedata = new Object(),
					docstatus = _docopt.docstatus,	//draft, ing
					sCurFullList = $("input[name=sCurFullList]", _el).xval().split("^"),
					AprNcount = parseInt($("input[name=AprNcount" + sDocStep + "]", _el).xval(), 10),
					AprTcount = parseInt($("input[name=AprTcount" + sDocStep + "]", _el).xval(), 10),
					currentApproverCheck = 0;

				//이중결재 설정저장 시작
				var appCfg = _docopt.appCfg;
				//1단 양식이고 이중결재가 사용중이면 현재문서가 수신문서가 아닐 때
				if (appCfg.ProcessStep == "1" && typeof appCfg.UseDblApr != 'undefined' && appCfg.UseDblApr == 'YES' && !_docopt.isrevdoc) {
					//이중결재 선택값 저장
					var _isdblapv = $("input[name='IsDblApr']", _$dialog.element).xval();
					_$$.aprv.com.setFld('IsDblApr', _isdblapv, _el);

					//이중결재 라인 저장
					var _dblindex = $("div[dblopt]", _$dialog.element).map(function () {
						return $(this).attr("dblopt");
					}).get().join(";");
					_$$.aprv.com.setFld('sAppListDbl', _dblindex, _el);

					if (setdoc) {
					} else {
						//결재선 저장용
						savedata.IsDblApr = _isdblapv;
						savedata.sAppListDbl = _dblindex;
					}
				}
				//이중결재 설정저장 종료

				//3단이고 수신자가 지정되어 있다면.....
				//2단 부터는 수신자를 보이게 하기 위해서 - 2024.03.28 by dwlee
				if (sDocStep != "1" && _rtn.hasOwnProperty("list")) {
					if (_rtn.list.length > 0) {
						//console.log($("[name=OrgConduct]", _el).closest("tr").size());;
						$("[name=OrgConduct]", _el).closest("tr").css("display", ""); //수신자 표시하기
					}
				} else {
					if (sDocStep != "1") {
						$("[name=OrgConduct]", _el).closest("tr").css("display", "none");
					}
				}
				$.each(_gridinfo, function (i, o) {
					//console.log('o', o);

					if (o.hasOwnProperty('children')) {
						var getagval = function (_agel, appindex) {
							var rval2 = '';
							var setval = '';

							$.each(_agel, function (k, arval) {
								arval.appindex = appindex;
								setval = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.APP.TLIST, arval, '^', ';', _$$.aprv.line.PROP.APP.KEY);
								k == 0 ? (rval2 = $.trim(setval.fullinfo)) : (rval2 += ';' + $.trim(setval.fullinfo));
							});

							return rval2;
						};
						//var item01 = _$$.aprv.com.arrayclean(_rtn[o.prop][o.children[0].prop],undefined);
						var item01 = _$$.aprv.com.arrayclean(_rtn[o.prop], undefined);

						$.each(item01, function (j, val) {
							var setval = '';
							if (j == AprNcount && docstatus == "ing") {		//결재 진행중 현재 결재자가 변경되는 경우
								if (sCurFullList[5] != val.notesid || sCurFullList[6] != val.orgcode || sCurFullList[7] != val.progcode) {
									currentApproverCheck = 1;
								}

								//대결이 지정된 경우에는 대결자와 원결재자 둘 모두 비교함 - 2025.04.02 by dwlee
								var _delegate = sCurFullList[sCurFullList.length - 1];
								if (_delegate.indexOf(val.notesid) >= 0) {
									currentApproverCheck = 0;
								}
							}

							//_agel = _$$.aprv.com.arrayclean(_rtn[o.prop][o.children[1].prop][j],undefined);
							val.appindex = String(adindex + 1);
							setval = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.APP.TLIST, val, '^', ';', _$$.aprv.line.PROP.APP.KEY);

							//if ( _agel.length > 0) { // 협조자 유무 체크
							//	(rval==""?rval+=getagval(_agel,val.appindex):rval+=";"+getagval(_agel,val.appindex));
							//}

							rval == '' ? (rval += $.trim(setval.fullinfo)) : (rval += ';' + $.trim(setval.fullinfo));

							adindex += 1;
						});

						var rvalobj = rval.split(';');
						if (AprNcount >= rvalobj.length) {				//결재선에서 본인까지 제거한 경우 (남은 결재자는 최소 1명 이상)
							_msgbox = $fn.getCodeMsg("aprv.msg.061");
							datachk = true;
							return false;
						}

						//console.log("===============================");
						//console.log("sDocStep : " , sDocStep);
						//console.log("===============================");

						if (setdoc) {
							_$$.aprv.com.setFld('sAppList' + sDocStep, rval, _el);
							_$$.aprv.com.setFld('AprTcount' + sDocStep, rvalobj.length, _el);
						} else {
							savedata.Arg1 = 'sAppList' + sDocStep;
							savedata.Arg2 = rval;
						}
					} else {
						//console.log("not children");
						var _fnnm = '', _fncode = '', _fnfull = '', _fndisp = '';
						//console.log('일반 데이터');
						//console.log('_rtn[o.prop]', _rtn[o.prop]);

						if (o.isnotchk && _rtn[o.prop].length == 0) {
							datachk = true;
							_msgbox = o.msgbox;
							return false;
						}

						var _$namelist = $('div[name=' + o.fieldname + 'Disp]', _el);
						_$namelist.empty();

						$.each(_rtn[o.prop], function (j, val) {
							/* 2018-0821 By LHJ 주석처리
							var setval="";
							setval = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.REC.TLIST,val, "^", ";" , _$$.aprv.line.PROP.REC.KEY);
							( _fnfull==""?_fnfull+=$.trim(setval.fullinfo):_fnfull+=";"+$.trim(setval.fullinfo));
							( _fnnm==""?_fnnm+=$.trim(setval.orgname):_fnnm+=";"+$.trim(setval.orgname));
							( _fncode==""?_fncode+=$.trim(setval.key):_fncode+=";"+$.trim(setval.key));
							( _fndisp==""?_fndisp+=$fn.getCurLangMsg($.trim(setval.orgname)):_fndisp+=","+$fn.getCurLangMsg($.trim(setval.orgname)));
							*/
							var _org = new $dwp.ui.org.data.org(val), item = _org.oinfo;

							_fnfull == '' ? (_fnfull += $.trim(_org.sinfo)) : (_fnfull += ';' + $.trim(_org.sinfo));
							_fncode == '' ? (_fncode += $.trim(item.key)) : (_fncode += ';' + $.trim(item.key));
							/*
							var _$namelist = $("div[name=" + o.fieldname + "Disp]", _el);
							_$namelist.empty();
							*/
							var _$nametarget = $("<div class='namepicker-target dwp-cursor'></div>").appendTo(_$namelist);

							if (item.type == 'B') {
								$("<span class='photo'><img src='" + $dwp.core.getPath('weblib') + "/images/common/default-team.svg'/></span>").appendTo(_$nametarget);
								$("<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$nametarget);
							} else {
								var _$div = $("<div class='dwp-cursor' da ta-type='profile' style='display:inline-block'></div>").appendTo(_$nametarget);
								$("<span class='photo'><img src='" + $dwp.core.getPath('pic', { empno: item.empno }) + "'/></span>").appendTo(_$div);
								$("<span class='name'>" + _org.getDispName() + '</span>').appendTo(_$div);

								$fn.getPicError($('img', _$div));

								_$div.attr({ 'data-empno': item.empno, 'data-orgcode': item.orgcode }).off('click').on('click', function () {
									$dwp.ui.bizcard.init($(this), {
										ismobile: _docopt.ismobile
									});
								});
							}
						});

						if (setdoc) {
							_$$.aprv.com.setFld(o.fieldname, _fncode, _el);
							//_$$.aprv.com.setFld(o.fieldname+"_Disp",_fnnm,_el);
							_$$.aprv.com.setFld(o.fieldname + 'Full', _fnfull, _el);
							//$("#"+o.fieldname+"_Dis",_el).html(_fndisp);

							if (o.setlen) {
								if (_fncode == '') {
									var _nstep = parseInt(sDocStep) - 1;
									//_$$.aprv.com.setFld('AprTcount' + _docopt.appCfg.ProcessStep, 0, _el); //수정필요 : 주관부서 담당자 - 2024.03.27 
									_$$.aprv.com.setFld('AprTcount' + _nstep, 0, _el); //수정필요 : 주관부서 담당자 - 2024.03.27 

								} else {
									var rvalobj = _fncode.split(';');
									//_$$.aprv.com.setFld('AprTcount' + _docopt.appCfg.ProcessStep, rvalobj.length, _el); //수정필요 : 주관부서 담당자 - 2024.03.27 
									_$$.aprv.com.setFld('AprTcount' + _nstep, rvalobj.length, _el); //수정필요 : 주관부서 담당자 - 2024.03.27 
								}
							}
						} else {
							savedata.Arg3 = o.fieldname + 'Full';
							savedata.Arg4 = _fnfull;
						}
					}
				});

				if (setdoc) {
					if (datachk) {
						$fn.alert({ msg: _msgbox });
						return false;
					}

					if (currentApproverCheck == 1) {
						$fn.confirm({ msg: $fn.getCodeMsg("aprv.msg.060") }).done(function () {
							_$dialog.close();

							$fn.block();
							$("input[name=actiontype]", _el).val("change_line");
							$("input[name=docstatus]", _el).val("change_line");
							$fn.xAjaxSubmit($("form", _el), {						//현재 결재자 변경되면 권한이 빠져서 공통 저장 기능을 사용하지 않음
								dataType: "text",
								beforeSubmit: function (arr, $form, options) { },
								success: function (data, statusText, xhr, $form) {
									$fn.unblock();
									$doc.goview({ type: 'del', unid: '', viewreload: true });
								},
								error: function (xhr, textStatus) {
									$fn.unblock();
									return false;
								}
							});

							/*
							_$$.aprv.com.appdocsave($doc, {
								actiontype: "change_line",
								docstatus: "change_line",
								//callback: _$$.aprv.com.savecallback
								callback: function () { $doc.goview({ type: 'del', unid: '', viewreload: true }); }	//결재선에서 본인이 빠지는 경우 삭제 처리와 동일하게 보기로 이동하기
							});
							*/
						});
						return true;
					}

					_$dialog.close();

					//읽기모드에서는 결재선 지정시 문서를 저장하는 형태로 변경 - 2025.01.04 by dwlee
					//if (_isadmin & (_docopt.docstatus != 'draft')) {
					if (!_docopt.isedit && _docopt.docstatus != 'draft') {
						_$$.aprv.com.appdocsave($doc, {
							actiontype: 'admin_change_line'
							, docstatus: 'admin_change_line'
							, callback: _$$.aprv.com.savecallback

						});
					}
					_$$.aprv.line.DrawingBox($doc);

					//한글 웹 기안기이면 처리하는 함수가 필요 - 2023.05.11 by dwlee
					if (_docopt.appCfg.aprlineapplyfnc != '' && _docopt.appCfg.aprlineapplyfnc) {
						try {
							_docopt.inithwp = false;
							eval(_docopt.appCfg.aprlineapplyfnc)($doc, _docopt);
						} catch (e) { }
					}
				} else {
					return savedata;
				}
			},
			_getGridData: function (_$dialog) {
				var _me = this,
					$org = $dwp.ui.org,
					_gridinfo = _$dialog.options.refdata.grid,
					_rtn = {};
				$.each(_gridinfo, function (i, o) {
					var _$gridlist = $org._getGrid(_$dialog, i);
					var fullinfo = '';
					_rtn[o.prop] = [];
					$('div.dwp-item', _$gridlist).each(function () {
						var _item = $(this).data('orgdata');
						_rtn[o.prop].push(_item);
					});
				});

				return _rtn;
			},
			gridrefresh: function (_$dialog, item) {
				var _me = this,
					_gridinfo = _$dialog.options.refdata.grid,
					$org = $dwp.ui.org,
					obj = null,
					obj2 = null,
					_$gridlist = null,
					apobj = null,
					agobj = null;

				$.each(_gridinfo, function (i, o) {
					$gridlist = $org._getGrid(_$dialog, i);
					if (o.hasOwnProperty('children')) {
						apobj = $('div.dwp-item', o.children[0].selector, _$gridlist);
						agobj = $(
							o.children[1].children,
							o.children[1].selector,
							_$gridlist
						);

						$.each(o.children, function (i, _o) {
							obj = $('div.dwp-item', _o.selector, _$gridlist);

							if (_o.prop == 'AP') {
								$.each(obj, function (k, v) {
									var orgdata = null;
									orgdata = $(this).data('orgdata');

									orgdata.appindex = k + 1;
									orgdata.apptype = _o.prop;
									$(this).data(orgdata);

									cobj = _$$.aprv.org.getindexobj(agobj, k);

									if (cobj == null) {
										_me.loadagarea($(this), _$dialog);
									} else {
										$(this).innerHeight(cobj.innerHeight());
									}
								});
							} else {
								obj2 = $(_o.children, _o.selector, _$gridlist);
								$.each(obj2, function (k, v) {
									var iwval = $('div.dwp-item', $(this)),
										vchk = false,
										_item = null;
									$.each(iwval, function (j, c) {
										var orgdata = null;
										orgdata = $(this).data('orgdata');

										//	console.log("orgdata",orgdata);

										orgdata.appindex = k + 1;
										orgdata.apptype = _o.prop;
										$(this).data(orgdata);
										_item = $(this);
										_item.data.orgdata = orgdata;
										vchk = true;
									});
									cobj = _$$.aprv.org.getindexobj(apobj, k);

									if (cobj == null) {
										if (vchk) {
											_me.addListItem(_$dialog, _item, 0, k, true);
										}
										$(this).remove();
									} else {
										cobj.innerHeight($(this).innerHeight());
									}
								});
							}
						});
					}
				});
			},
			befomove: function (_$dialog, item) {
				var _me = this,
					_gridinfo = _$dialog.options.refdata.grid,
					$org = $dwp.ui.org,
					obj = null,
					obj2 = null,
					_$gridlist = null,
					chkcun = true;

				var movechk = function (_$dialog, item) {
					var _orgdata = item.data('orgdata'),
						tobj = null,
						chkval = false;
					tobj = item.parent().parent();

					if (($.trim(_orgdata.apptype) == 'AP') & (tobj[0].id == 'AG')) {
						var _nodeindex = 0,
							pobj = null,
							cobj = null,
							aobj = null;
						_nodeindex = _orgdata.appindex;

						pobj = tobj.children();
						copj = _$$.aprv.org.getindexobj(pobj, _nodeindex - 1).children();

						if (copj.length > 0) {
							var rlen = copj.length;
							$.each(copj, function (i, o) {
								var vobj = $(this).data('orgdata');

								if (_orgdata.key == vobj.key) {
									rlen = rlen - 1;
									return false;
								}
							});
							if (rlen > 0) {
								chkval = true;
							}
						}
					}
					return chkval;
				};

				$.each(_gridinfo, function (i, o) {
					$gridlist = $org._getGrid(_$dialog, i);
					if (o.hasOwnProperty('children')) {
						$.each(o.children, function (i, _o) {
							obj = $('div.dwp-item', _o.selector, _$gridlist);

							if (movechk(_$dialog, item)) {
								$fn.alert({
									msg: $fn.getCodeMsg('aprv.msg.005')
								});

								_me.gridallrefresh(_$dialog, item);
								chkcun = false;
								return false;
							}

							if (obj.length > parseInt(_o.count)) {
								$fn.alert({
									msg: _o.maxmsg.replace('{$1}', _o.count)
								});
								_me.gridallrefresh(_$dialog, item);
								chkcun = false;
								return false;
							}
						});
					}
				});

				if (chkcun) {
					_$$.aprv.org.gridrefresh(_$dialog, item);
				}
			},
			beforactive: function (obj) {
				var tobj = null,
					pobj = null,
					_nodeindex = null,
					cobj = null;
				pobj = obj.parent();

				if (obj.hasClass('active')) {
					$('div.dwp-item.active', pobj).removeClass('active');
				} else {
					$('div.dwp-item.active', pobj).removeClass('active');
					obj.toggleClass('active');
				}
			},
			befordel: function (obj, chk) {
				var pobj = null,
					_nodeindex = 0;
				var aglen = 0;
				var tobj = null,
					cobj = null,
					cell = null,
					tcell = null,
					aobj = null;

				obj.remove();
			},
			getindexobj: function (obj, oindex) {
				var tobj = null;
				$.each(obj, function (i, o) {
					if (i == oindex) {
						tobj = $(this);
						return false;
					}
				});
				return tobj;
			},
			//이중결재 관련 함수 시작 2025.11.11 - by wsjung getdblidx, _viewDblAprTypeV
			_viewDblAprTypeV: function (opt, dblidx, $dialog) {
				var _me = this;
				var el = $dialog.element;
				$("input[name='IsDblApr']", el).xval(opt);
				dblidx = dblidx + "";

				if (opt == "1") {
					$("#DblAprTypeV", el).removeClass("dwp-none");
					$("div[dblopt='0']", el).attr("dblopt", "1");
				} else {
					$("#DblAprTypeV", el).addClass("dwp-none");
					$("div[dblopt]", el).each(function (idx, o) {
						$(o).attr("dblopt", "0");
						var _html = $(o).html();
						$(o).html(_html.replace(/\[.*?\]/g, "")); // 모든 [내용] 제거
					});
				}

				if (dblidx == "" || dblidx.indexOf("0") > -1) {
					if (opt == "1") {
						$("div[dblopt='1']", el).each(function (idx, o) {
							var _html = $(o).html();
							_html = _html.replace(/\[.*?\]/g, ""); // 모든 [내용] 제거
							$(o).html($fn.getCodeMsg("aprv.title.dbldept1") + _html);
						});
						$("div[dblopt='2']", el).each(function (idx, o) {
							var _html = $(o).html();
							_html = _html.replace(/\[.*?\]/g, ""); // 모든 [내용] 제거
							$(o).html($fn.getCodeMsg("aprv.title.dbldept2") + _html);
						});
					}
				} else {
					var _dblidx = dblidx.split(";");
					if (opt == "1") {
						$("div[dblopt]", el).each(function (idx, o) {
							$(o).attr("dblopt", _dblidx[idx].trim());
							var _html = $(o).html();
							_html = _html.replace(/\[.*?\]/g, ""); // 모든 [내용] 제거
							$(o).html($fn.getCodeMsg("aprv.title.dbldept" + _dblidx[idx].trim()) + _html);
						});
					}
				}
			},
			getdblidx: function (_$dialog) {
				var _dblindex = $("div[dblopt]", _$dialog.element).map(function () {
					return $(this).attr("dblopt");
				}).get().join(";");
				return _dblindex;
			},
			//이중결재 관련 함수 종료 2025.11.11 - by wsjung

			makeitem: function (_org, _grid, _$gridlist, _$dialog, _nodeindex) {
				// console.log("_$dialog",_$dialog);
				var _me = this,
					_el = null,
					_pagel = null,
					_$item = null;
				var docel = _$dialog.options.docInstance.element;
				var cap = _$$.aprv.com.getFld('sCurFullList', docel);
				var cobj = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.APP.TLIST, cap, '^', ';', _$$.aprv.line.PROP.APP.KEY);
				var chkappindex = 0,
					_isadmin = _$dialog.options.docInstance.options.isadmin;

				// 2017-08-11 LeeHJ
				var _docopt = _$dialog.options.docInstance.options,
					appCfg = _docopt.appCfg;

				// 2017-08-11 LeeHJ
				var setItem = function (_org) {
					var apptype = appCfg['AP_Code' + _docopt.sDocStep].split(';');
					var aprncount = parseInt(_grid.AprNcount);
					//var aprncount = parseInt(_grid.count);

					var _h = "<div class='dwp-table-vertical' style='border-top:0px;border-bottom:0px;'>";
					_h += "<div class='dwp-row' style='height:34px;'>";
					_h += "<div name='appindex' class='dwp-value' style='width:44px;'>" + _org.oinfo.appindex + "</div>";

					var _dispidx = "0";
					var _disptxt = "";

					//이중결재 결재선지정창내 표시관련 시작 2025-11-11 by wsjung
					if (appCfg.ProcessStep == "1" && typeof appCfg.UseDblApr != 'undefined' && appCfg.UseDblApr == 'YES' && !_docopt.isrevdoc) {
						/***************
						if(_docopt.isnew){
							var _isdblapv = $("input[name='IsDblApr']", _$dialog.element).xval();
							var _dblaprtype = $("input[name='DblAprType']", _$dialog.element).xval();
							var _sapplistdbl = $("input[name='sAppListDbl']", _$dialog.element).xval().split(";");
						}else{
							var _isdblapv = $("input[name='IsDblApr']", docel).xval();
							var _dblaprtype = $("input[name='DblAprType']", _$dialog.element).xval();
							var _sapplistdbl = $("input[name='sAppListDbl']", docel).xval().split(";");
						}
						***************/
						var _isdblapv = $("input[name='IsDblApr']", _$dialog.element).xval();
						var _dblaprtype = $("input[name='DblAprType']", _$dialog.element).xval();
						var _sapplistdbl = $("input[name='sAppListDbl']", _$dialog.element).xval().split(";");

						if (typeof _sapplistdbl[_org.oinfo.appindex - 1] != "undefined") {
							_dispidx = _sapplistdbl[_org.oinfo.appindex - 1].trim();
							_disptxt = $fn.getCodeMsg("aprv.title.dbldept" + _dispidx);
						} else {
							if (appCfg.ProcessStep == "1" && _isdblapv == "1") {
								_dispidx = _dblaprtype;
								_disptxt = $fn.getCodeMsg("aprv.title.dbldept" + _dispidx);
							}
						}
					}
					//이중결재 표시관련 종료 2025-11-11 by wsjung

					_h += "<div class='dwp-value' dblopt='" + _dispidx + "'>" + _disptxt + _org.getDispName() + "</div>";

					//console.log(aprncount + "_" + _org.oinfo.appindex, _org.getDispName());
					//if (_org.oinfo.appindex == '1' || aprncount + 1 >= parseInt(_org.oinfo.appindex)) {

					if (_org.oinfo.appindex == '1' || aprncount >= parseInt(_org.oinfo.appindex)) {
						_h += "<div class='dwp-value dwp-center' style='width:100px;padding:0px'>" + $fn.getCodeMsg('aprv.data.apptype.' + _org.oinfo.apptype) + '</div>';
						_h += "<div class='dwp-value' style='width:40px;padding:0px'></div>";
					} else {
						_h += "<div class='dwp-value' style='width:100px;padding:0px;'>";
						_h += "<div class='dwp-selectbox xs expended'>";
						_h += "<select name='APPTYPE'>";
						for (var i = 0; i < apptype.length; i++) {
							_h += "<option value='" + apptype[i] + "' " + (_org.oinfo.apptype == apptype[i] ? 'selected' : '') + ' >' + $fn.getCodeMsg('aprv.data.apptype.' + apptype[i]);
						}
						_h += '</select>';
						_h += '</div></div>';
						_h += "<div class='dwp-value dwp-center' style='width:40px;padding:0px'>";
						_h += "<div class='dwp-btn icon'><span type='button'><img src='" + $fn.getPath('weblib') + "/images/common/icon-close.svg'/></span></div>";
						_h += '</div>';
					}
					_h += '</div>';
					_h += '</div>';

					_$item.html(_h);

					// 콤보박스에서 결재선 유형을 변경하고자 할 때 제한된 갯수를 확인해서 해당 유형의 한도를 초과하면 경고메시지 출력하고 변경을 금지한다. 2019.07.08 by Choo
					var _orgdata = _$item.data('orgdata');
					var _pre_app_type = _orgdata.apptype;
					var _refdata = _$dialog.options.refdata;
					var _gridinfo = _refdata.grid;
					$('select[name=APPTYPE]', _$item).off('change').on('change', function () {
						var _post_app_type = $(this).val();
						var _grid = null;
						$.each(_gridinfo[0].children, function (idx, o) {
							if (o.prop === _post_app_type) {
								_grid = o;
								return;
							}
						});
						//console.log("_grid::", _grid);
						var _wrapper = $(this).closest("[name='selected_list_area']");
						var _app_items = _wrapper.find(".dwp-item");
						var _post_app_count = 0;
						$.each(_app_items, function (idx, o) {
							var _jo = $(o).data("orgdata");
							if (_jo.apptype === _post_app_type) {
								_post_app_count += 1;
							}
						});
						//console.log("_app_type 개수::", _post_app_count);
						if (_post_app_count >= _grid.count) {
							//$fn.alert({msg:"지정된 결재선 수를 초과했습니다."});
							$fn.alert({ msg: _grid.maxmsg.replace('{$1}', _grid.count) });
							$(this).xval(_pre_app_type);
						} else {
							_orgdata.apptype = $(this).val();
						}
					});
				};

				var citem = function (_org, _el) {
					//_$item = $("<div class='dwp-item ui-draggable ui-draggable-handle ui-droppable all-del'>" + _org.getDispName() + "<button type='button' class='btn-cancel'>del</button></div>")

					var addClass = ($("div.dwp-item", _el).length == 0 ? "dwp-first-apr" : "all-del");

					_$item = $("<div class='dwp-item ui-draggable ui-draggable-handle ui-droppable " + addClass + "' style='padding:4px 15px;line-height:normal;'></div>");
					//첫번째 기안자는 Drag&Drop 안되도록 class 변경
					//_$item = $("<div class='dwp-item ui-draggable ui-draggable-handle ui-droppable all-del' style='padding:4px 15px;line-height:normal;'></div>");
					//if ( $("div.dwp-item.active", _el).size() > 0 ) {
					//	_$item.insertBefore($("div.dwp-item.active", _el))
					//	.data("orgdata", _org.oinfo);
					//} else {
					_$item.appendTo(_el).data('orgdata', _org.oinfo);
					//}

					// 2017-08-11 LeeHJ
					setItem(_org);

					// console.log("__$item",_$item);

					_org.changed ? _$item.addClass('changed') : '';
					if (_org.oinfo.type == 'B') {
						_$item.addClass('is-folder');
					}

					_$item.on('click', function (e) {
						if (e.currentTarget === this) {
							_$$.aprv.org.beforactive($(this));
						}
					});
					$('div.dwp-btn', _$item).on('click', function () {
						//_$$.aprv.org.befordel($(this).parent(),true);
						_$$.aprv.org.befordel($(this).parents('div.dwp-item'), true);
						//console.log("11111 reSetAppIndex")
						_me.reSetAppIndex(_$dialog);
						var _idx = _$$.aprv.org.getdblidx(_$dialog);
						$("input[name='sAppListDbl']", _$dialog.element).xval(_idx);
					});

					if ($('div.dwp-item.active', _el).size() > 0) {
						//console.log("22222 reSetAppIndex")
						_me.reSetAppIndex(_$dialog);
						var _idx = _$$.aprv.org.getdblidx(_$dialog);
						$("input[name='sAppListDbl']", _$dialog.element).xval(_idx);
					}
					//return _$item;
				};

				var getHeight = function (obj) {
					var cobj = obj.parent().children(),
						_Height = 0;

					$.each(cobj, function (i, o) {
						_Height += 46; //$(this).innerHeight();
					});
					return _Height;
				};

				// console.log("_grid.selector", _grid);
				_el = $(_grid.selector, _$gridlist);
				// console.log("grid", _el);

				//결재유형별로 최대개수를 계산해서 체크한다. 2019.07.04 by Choo
				var _already_length = 0;
				if (_grid.count > 0) {
					$.each($('div.dwp-item', _el), function (idx, o) {
						var _jo = $(o).data("orgdata");
						if (_jo.apptype === _grid.prop) {
							_already_length += 1;
						}
					});
					//if ( $('div.dwp-item', _el).size() >= _grid.count) {
					if (_already_length >= _grid.count) {
						$fn.alert({ msg: _grid.maxmsg.replace('{$1}', _grid.count) });
						return true;
					}
				} else {
					$fn.alert({ msg: _grid.maxmsg.replace('{$1}', _grid.count) });
					return true;
				}
				cobj[0].appindex == '' ? (cobj[0].appindex = '1') : '';
				chkappindex = parseInt(cobj[0].appindex, 10);

				if (chkappindex >= (parseInt(_org.oinfo.appindex, 10) + 1)) {	//중간결재자 본인 제거를 위해 appindex + 1로 계산
					if (($.trim(_org.oinfo.apptype) != 'AP') & (parseInt(_grid.AprNcount) == 0)) {
						//_$item = citem(_org,_el);
						citem(_org, _el);
					} else {
						_$item = $(
							"<div class='dwp-item ui-draggable ui-draggable-handle ui-droppable' style='padding:4px 15px;line-height:normal;'></div>"
						).appendTo(_el).data('orgdata', _org.oinfo);

						// 2017-08-11 LeeHJ
						setItem(_org);
					}

					if (_org.oinfo.type == 'B') {
						_$item.addClass('is-folder');
					}
				} else {
					//_$item = citem(_org,_el);
					citem(_org, _el);
				}
			},
			loaditem: function (_$dialog, _org, tabidx) {
				var _me = this,
					$org = $dwp.ui.org,
					_$gridlist = $org._getGrid(_$dialog),
					_refdata = _$dialog.options.refdata,
					_$item = null;
				var _grid = _refdata.grid[tabidx];

				if (_grid.type == 'aprv') {
					var _g = $.grep(_grid.children, function (b) {
						var __orgtype = $.trim(_org.oinfo.apptype),
							__prop = b.prop;
						return __orgtype == __prop;
					});

					_grid = _g.length != 0 ? _g[0] : _grid.children[0];
				}

				_me.makeitem(_org, _grid, _$gridlist, _$dialog);
			},
			createagarea: function (_agel, _nodeindex, _$dialog) {
				var $org = $dwp.ui.org,
					_$gridlist = $org._getGrid(_$dialog),
					_el = _$dialog.element;

				var $item = $("<div class='item-wrap dragdrop'></div>").appendTo(_agel).data('appindex', _nodeindex);

				//  console.log("@@ _agel",_agel , "@@ _nodeindex",_nodeindex);
				var $doc = _$dialog.options.docInstance; //$fn.getInstance("doc", $fn.getContent());

				var _opt = $doc.options;
				if (!_opt.isdraft & (parseInt(_nodeindex) <= parseInt(_opt.data.AprNcount))) {
					return $item;
				}

				$item.droppable({
					hoverClass: 'drophover',
					addClasses: true,
					over: function (event, ui) { },
					drop: function (event, ui) {
						_$$.aprv.org.griddrop(event, ui, _$dialog, 1, _nodeindex);
					}
				});

				$item.sortable({
					connectWith: '.item-wrap', // .item-wrap   .dragdrop
					delay: 150,
					revert: 0,
					cursor: 'pointer',
					items: '> div.dwp-item.all-del',
					helper: 'clone',
					start: function (event, ui) {
						var _w = ui.helper.width() - 100;
						ui.helper.width(_w);

						_$dialog.options.refdata.digval = _$$.aprv.org._getGridData(
							_$dialog
						);
					},
					stop: function (event, ui) {
						_$$.aprv.org.befomove(_$dialog, ui.item);
					}
				})
					.disableSelection();

				return $item;
			},
			loadagarea: function (_$item, _$dialog) {
				// 결재자별 협조자 영역 생성
				//console.log("_$item-data",_$item.data("orgdata"));
				var _pel = _$item[0].parentElement;
				var _agel = _pel.parentElement.children[1];
				var _nodeindex = $('div.dwp-item', _pel).index(_$item);

				this.createagarea(_agel, _nodeindex, _$dialog);
			},
			reload: function ($dialog, val) {
				console.log("결재선 지정창 reload")
				var _me = this,
					_opt = $dialog.options,
					$org = $dwp.ui.org;
				var _refdata = _opt.refdata,
					_vlist = [],
					_org = null,
					_$gridlist = $org._getGrid($dialog);
				var _grid = _refdata.grid[_refdata.tabidx];

				if ($('div.dwp-item', _$gridlist).size() > 0) {
					$('div.dwp-item', _$gridlist).remove();
				}

				if ($('div.item-wrap', _$gridlist).size() > 0) {
					$('div.item-wrap', _$gridlist).remove();
				}

				var resort = function (_vlist) {
					var tmpval = '',
						tmpagval = '';
					$.each(_vlist, function (i, v) {
						_org = new $org.data.orgEx(v, _grid.type.toUpperCase());

						if ($.trim(_org.oinfo.apptype) == 'AP') {
							if (tmpagval == '') {
								tmpval == '' ? (tmpval = v) : (tmpval += ';' + v);
							} else {
								//(tmpval==""?tmpval=tmpagval:tmpval+=";"+tmpagval);
								tmpval == '' ?
									(tmpval = v + ';' + tmpagval) :
									(tmpval += ';' + v + ';' + tmpagval);
								tmpagval = '';
							}
						} else {
							tmpagval == '' ? (tmpagval = v) : (tmpagval += ';' + v);
						}
					});
					tmpagval == '' ? '' : (tmpval += ';' + tmpagval);
					return tmpval.split(';');
				};

				_vlist = resort(val.split(';'));
				// console.log("_vlist",_vlist);

				$.each(_vlist, function (i, v) {
					_org = new $org.data.orgEx(v, _grid.type.toUpperCase());
					_me.loaditem($dialog, _org, _refdata.tabidx);
				});
			},
			load: function ($dialog, $doc) {
				console.log("결재선 지정창 Load")
				var _me = this,
					_opt = $dialog.options,
					$org = $dwp.ui.org;
				var _refdata = _opt.refdata,
					_vlist = [],
					_org = null,
					_$gridlist = $org._getGrid($dialog);
				var _defaultval = _refdata.defaultval[_refdata.tabidx];
				var _grid = _refdata.grid[_refdata.tabidx];

				var _defaultval_1 = _refdata.defaultval[1];
				var _pdoc_opt = $doc.options;
				//	var _grid_1 = _refdata.grid[1];
				//	var _orgtype = "";
				var appCfg = _pdoc_opt.appCfg;

				var resort = function (_vlist) {
					var tmpval = '',
						tmpagval = '';
					$.each(_vlist, function (i, v) {
						_org = new $org.data.orgEx(v, _grid.type.toUpperCase());

						if ($.trim(_org.oinfo.apptype) == 'AP') {
							if (tmpagval == '') {
								tmpval == '' ? (tmpval = v) : (tmpval += ';' + v);
							} else {
								//(tmpval==""?tmpval=tmpagval:tmpval+=";"+tmpagval);
								tmpval == '' ?
									(tmpval = v + ';' + tmpagval) :
									(tmpval += ';' + v + ';' + tmpagval);
								tmpagval = '';
							}
						} else {
							tmpagval == '' ? (tmpagval = v) : (tmpagval += ';' + v);
						}
					});
					tmpagval == '' ? '' : (tmpval += ';' + tmpagval);
					return tmpval.split(';');
				};

				if (_defaultval != '') {
					//_vlist = resort(_defaultval.split(";"));
					_vlist = _defaultval.split(';');
					// console.log("_vlist",_vlist);

					if (_pdoc_opt.appCfg.OPT11 === "YES" && _pdoc_opt.docstatus === "draft") {
						//console.log("근무지별 기본결재자 사용 && 작성중인 문서 상태");
						if (_vlist.length > 1) _vlist = _vlist.splice(0, 1);
					}

					$.each(_vlist, function (i, v) {
						_org = new $org.data.orgEx($.trim(v), _grid.type.toUpperCase());
						_me.loaditem($dialog, _org, _refdata.tabidx);
					});
				}

				if ((typeof _defaultval_1 != 'undefined') & (_defaultval_1 != '')) {
					var _$pos = 1;
					_$gridlist = $(
						"div.dwp-form-area[name='selected_area_" + _$pos + "']",
						$dialog.element
					);

					var _$list = $('div.dwp-list-body', _$gridlist);
					_vlist = _defaultval_1.split(';');

					$.each(_vlist, function (i, v) {
						var _org = new $org.data.org($.trim(v));

						/*
												var _$item = $(
													"<div class='dwp-item dwp-cursor org-type'>" +
													_org.getDispName() +
													"<button type='button' class='btn-cancel'>del</button></div>"
												)
													.appendTo(_$list)
													.data('orgdata', _org.oinfo);
						*/

						//외부 수신자 색상 표시 처리 - 2023.02.13 by dwlee
						var _class = "";
						if (_org.oinfo.hasOwnProperty("etc") && _org.oinfo.etc == "external") {
							_class = "dwp-blue";
						}
						var _$item = $(
							"<div class='dwp-item dwp-cursor org-type " + _class + "'>" +
							_org.getDispName() +
							"<button type='button' class='btn-cancel'>del</button></div>"
						)
							.appendTo(_$list)
							.data('orgdata', _org.oinfo);


						//console.log("_org.oinfo",_org.oinfo);

						if (_$item.type == 'B') {
							_$item.addClass('is-folder');
						}

						_$item.on('click', function (e) {
							if (e.currentTarget === this) {
								$(this).toggleClass('active');
							}
						});
						$('button', _$item).on('click', function () {
							$(this).parent().remove();
						});
					});
				}

				//이중결재 관련 결재선 지정창 로딩 시작 2025.11.11 - by wsjung
				var _el = $doc.element;
				var _del = $dialog.element;
				if (appCfg.ProcessStep == "1" && typeof appCfg.UseDblApr != 'undefined' && appCfg.UseDblApr == 'YES' && !$doc.options.isrevdoc) {
					//이중결재 옵션 보이기
					$("#IsDblAprV", _del).removeClass("dwp-none");

					//초기 로딩시 기본 설정 - 문서의 값을 다이알로그로...
					$("input[name='IsDblApr']", _del).xval($("input[name='IsDblApr']", _el).xval());
					$("input[name='sAppListDbl']", _del).xval($("input[name='sAppListDbl']", _el).xval());

					//기본 세팅
					_me._viewDblAprTypeV($("input[name='IsDblApr']", _del).xval(), $("input[name='sAppListDbl']", _del).xval(), $dialog);

					//클릭 이벤트 부여
					$("input[name='IsDblApr']", _del).off("click").on("click", function () {
						_me._viewDblAprTypeV($(this).xval(), $("input[name='sAppListDbl']", _del).xval(), $dialog);
					})
				}
				//이중결재 관련 결재선 지정창 로딩 종료 2025.11.11 - by wsjung
			},
			getPosition: function (_$dialog, _grid, index, _$gridlist, _refdata) {
				var _position = 0,
					selorg = null;

				if (index == 0) {
					// 결재영역 위치 설정
					_position = $('div.dwp-item', $(_grid.children[0].selector, _$gridlist)).size();
					_position += 1;
				} else {
					_position = $('div.dwp-item', $(_grid.children[0].selector, _$gridlist)).size();
					_position += 1;
				}

				// console.log("_position",_position);
				return _position;
			},
			addListItem: function (_$dialog, _node, index, _nodeindex, selectchk) {

				var $org = $dwp.ui.org,
					seltype = '',
					_orgdata = '',
					_appindex = '';
				var _me = this,
					_el = _$dialog.element,
					_$treewrap = $('div.dwp-tree', _el),
					_issearch = _$treewrap.is(':hidden'),
					_$search = $('div.dwp-search-result', _$dialog.element),
					_treeinfo = $org._getTreeInfo(_$dialog),
					_$gridlist = $org._getGrid(_$dialog),
					_refdata = _$dialog.options.refdata,
					_org = null,
					_$item = null;
				var _grid = _refdata.grid[_refdata.tabidx];

				// 사용자 부서 및 부서 체크
				if (_treeinfo.seltype == '2') {
					if (_node.data.type == 'B') {
						return true;
					}
				} else if (_treeinfo.seltype == '1') {
					if (_node.data.type == 'S') {
						return true;
					}
				}

				seltype = _grid.type.toUpperCase();
				if (_grid.type == 'aprv') {
					//console.log("a",typeof(_nodeindex));
					if (typeof _nodeindex == 'undefined') {
						_appindex = _me.getPosition(
							_$dialog,
							_grid,
							index,
							_$gridlist,
							_refdata
						); // 결재자 위치 설정
						_nodeindex = _appindex - 1;
					} else {
						_appindex = _nodeindex + 1; // 결재자 위치 설정
					}
					// 결재자 영역 중복 체크
					if (
						$org._dblItemCheck(
							$('div.dwp-item', $(_grid.selector, _$gridlist)),
							_node.data.key
						)
					) {
						return true;
					}

					_grid = _grid.children[index];
				} else {
					// 중복 체크
					if ($org._dblItemCheck($('div.dwp-item', $(_grid.selector, _$gridlist)), _node.data.key)) {
						return true;
					}
				}

				if (_appindex == -1) {
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.002') });
					return true;
				}

				_orgdata = _node.data.orgdata;
				// console.log("grid", _grid);

				// console.log("_node.data.orgdata",_orgdata);
				_orgdata.apptype = _grid.prop;
				_orgdata.appindex = _appindex;

				_org = new $org.data.orgEx(_node.data.orgdata, seltype);
				_me.makeitem(_org, _grid, _$gridlist, _$dialog, _nodeindex);

				if (_issearch) {
					$('.dwp-list-body div.dwp-item.active', _$search).removeClass('active');
				} else if (selectchk) {
					// 트리 선택값 없음
				} else {
					//$org._getTree(_$dialog).getNode(_node.data.key).select(false);
				}
			},
			addReceiverItem: function (_$dialog, _node) {

				var $org = $dwp.ui.org,
					seltype = '',
					_orgdata = '',
					_appindex = '';
				var _me = this,
					_el = _$dialog.element,
					_$treewrap = $('div.dwp-tree', _el),
					_issearch = _$treewrap.is(':hidden'),
					_$search = $('div.dwp-search-result', _$dialog.element),
					_treeinfo = $org._getTreeInfo(_$dialog),
					_$gridlist = $org._getGrid(_$dialog),
					_refdata = _$dialog.options.refdata,
					_org = null,
					_$item = null;
				var _grid = _refdata.grid[_refdata.tab[_refdata.tabidx].grid];

				// 사용자 부서 및 부서 체크
				if (_treeinfo.seltype == "2") {
					if (_node.data.type == "B") { return true; }
				} else if (_treeinfo.seltype == "1") {
					if (_node.data.type == "S") { return true; }
				}
				//console.log("node", _node);
				// 중복 체크

				//debugger;

				if ($org._dblItemCheck($("div.dwp-item", $(".dwp-list-body", _$gridlist)), _node.data.key)) {
					/*
						by mjkim 20241225 겸직사용자는 제외 처리를 해야하기때문에 소스 수정 필요
					*/
					$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.070") })		//이미 추가한 수신자입니다.

					return true;
				}

				// 한부서에 한명만 신청가능

				//_node.data.orgdata.orgcode

				var orgcheck = false;
				/*
					by mjkim 20241213
					수신자는 부서당 한명만 지정 가능합니다		
				*/
				$("div.dwp-item", $(".dwp-list-body", _$gridlist)).each(function (i, o) {
					if ($(this).data("orgcode") == _node.data.orgdata.orgcode) {
						orgcheck = true;
						return;
					}
				})

				if (orgcheck) {
					$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.068") })
					return;
				}



				// 건수 체크
				if (_grid.hasOwnProperty("count")) {
					if (_grid.count > 0) {
						if ($("div.dwp-item", $(".dwp-list-body", _$gridlist)).size() >= _grid.count) {
							$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg033").replace("{$1}", _grid.count) });
							return true;
						}
					}
				}

				// 사용자 부서 및 부서 체크
				_org = new $org.data.org(_node.data.orgdata);
				//console.log("org::", _org);

				if (_org.oinfo.type === "B" && _org.oinfo.filer === "") { //부서선택 시 접수담당자가 없을 경우
					if (_$dialog.options.docInstance.options.appCfg.OPT12 == "2") { //양식관리에서 부서선택 시 접수자 옵션을 "접수담당자"로 설정한 경우
						$fn.toast({ msg: "[" + $fn.getCurLangMsg(_org.oinfo.orgname) + "]" + $fn.getCodeMsg("aprv.msg.062") });
						return true;
					}
				}
				_$item = $("<div class='dwp-item dwp-cursor org-type' data-orgcode='" + _node.data.orgdata.orgcode + "'>" + _org.getDispName() + "<button type='button' class='btn-cancel'>" + $fn.getCodeMsg("comm.title.js018") + "</button></div>")
					.appendTo($(".dwp-list-body", _$gridlist))
					.data("orgdata", _node.data.orgdata);

				if (_node.data.orgdata.type == "B") { _$item.addClass("is-folder"); }

				_$item.on("click", function (e) {
					if (e.currentTarget === this) {
						$(this).toggleClass("active");
					}
				});
				$("button", _$item).on("click", function () {
					$(this).parent().remove();
				});

				if (_issearch) {
					$(".dwp-list-body div.dwp-item.active", _$search).removeClass("active");
				} else {
					$org._getTree(_$dialog).getNode(_node.data.key).select(false);
				}
			},
			griddrop: function (event, ui, _$dialog, index, _nodeindex) {
				var _me = this,
					_node = ui.helper.data('orgdata'),
					$org = $dwp.ui.org,
					_$search = $('div.dwp-search-result', _$dialog.element);

				//console.log("_nodeindex-griddrop",_nodeindex);

				if (_node) {
					$('.dwp-list-body div.dwp-item.active', _$search).each(function () {
						_me.addListItem(
							_$dialog,
							$(this).data('orgdata'),
							index,
							_nodeindex
						);
					});
				} else {
					var _$xtree = $org._getTree(_$dialog);

					$.each(_$xtree.getSelectedNodes(), function (i, _node) {
						_me.addListItem(_$dialog, _node, index, _nodeindex);
					});
				}
			},
			commBtnProc: function (_$dialog, id) {
				var _me = this,
					_el = _$dialog.element,
					$org = $dwp.ui.org;
				var _$treewrap = $('div.dwp-tree', _el),
					_issearch = _$treewrap.is(':hidden'),
					_$search = $('div.dwp-search-result', _el),
					_$gridlist = $org._getGrid(_$dialog),
					_refdata = _$dialog.options.refdata,
					_grid = _refdata.grid[_refdata.tabidx];
				var _$org_tree = $org._getTree(_$dialog);

				//조직도 트리의 전체부서 추가, 2019.7.11 by Choo
				var addAllDept = function ($org_tree, p_node) {
					var _$tree = $org_tree,
						_p_node = p_node,
						_dtnode;
					var _data_list = [];
					if (_p_node.hasChildren()) {
						//console.log("호출::",  _p_node.data.key + " " + _p_node.data.title);
						_me.addReceiverItem(_$dialog, _p_node);
						_data_list = _p_node.getChildren();

						$.each(_data_list, function (idx, o) {
							_dtnode = _$org_tree.getNode(o.data.key);
							addAllDept(_$tree, _dtnode);
						});
					} else {
						//console.log("호출::",  _p_node.data.key + " " + _p_node.data.title);
						//수신처에 사용자도 표시하도록 변경, 부서만 전체추가 시 반영되도록 함.
						if (_p_node.data.orgdata.type === "B") _me.addReceiverItem(_$dialog, _p_node);
					}
				};

				//console.log("버튼 동작 ", id)

				switch (id) {
					case 'aprvap':
						if (_issearch) {
							$('.dwp-list-body div.dwp-item.active', _$search).each(
								function () {
									_me.addListItem(_$dialog, $(this).data('orgdata'), 0);
								}
							);
						} else {
							$.each($org._getTree(_$dialog).getSelectedNodes(), function (
								i,
								_node
							) {
								_me.addListItem(_$dialog, _node, 0);
							});
						}
						break;
					case 'aprvag':

						if (_issearch) {
							$('.dwp-list-body div.dwp-item.active', _$search).each(
								function () {
									_me.addListItem(_$dialog, $(this).data('orgdata'), 1);
								}
							);
						} else {
							$.each($org._getTree(_$dialog).getSelectedNodes(), function (
								i,
								_node
							) {
								_me.addListItem(_$dialog, _node, 1);
							});
						}
						break;
					/*
						by mjkim 20241031 병렬협조 추가
					*/
					case 'aprvag_p':

						if (_issearch) {
							$('.dwp-list-body div.dwp-item.active', _$search).each(
								function () {
									_me.addListItem(_$dialog, $(this).data('orgdata'), 2);
								}
							);
						} else {
							$.each($org._getTree(_$dialog).getSelectedNodes(), function (
								i,
								_node
							) {
								_me.addListItem(_$dialog, _node, 2);
							});
						}
						break;

					case 'aprvaud': //감사추가
						if (_issearch) {
							$('.dwp-list-body div.dwp-item.active', _$search).each(
								function () {
									_me.addListItem(_$dialog, $(this).data('orgdata'), 3); // index는 3
									//									_me.addListItem(_$dialog, $(this).data('orgdata'), 2); // index는 3

								}
							);
						} else {
							$.each($org._getTree(_$dialog).getSelectedNodes(), function (i, _node) {
								_me.addListItem(_$dialog, _node, 3); // index는 3
								//								_me.addListItem(_$dialog, _node, 2); // index는 3
							});
						}
						break;
					case 'aprvadel':
						if (_grid.hasOwnProperty('children')) {
							//$.each($("div.dwp-item.all-del",_grid.children[0].selector, _$gridlist), function(i,_node){
							$.each($('div.dwp-item.all-del', _$gridlist), function (i, _node) {
								if ($("select[name=APPTYPE]", this).length != 0) {
									_me.befordel($(this), false);
								}
							});
						} else {
							if ($('div.dwp-item', _$gridlist).size() > 0) {
								$('div.dwp-item', _$gridlist).remove();
							}
						}
						var _idx = _$$.aprv.org.getdblidx(_$dialog);
						$("input[name='sAppListDbl']", _$dialog.element).xval(_idx);

						break;
					case 'gridadd': //수신자 추가


						if (_issearch) {
							$('.dwp-list-body div.dwp-item.active', _$search).each(
								function () {
									_me.addReceiverItem(_$dialog, $(this).data('orgdata'));
								}
							);
						} else {
							$.each($org._getTree(_$dialog).getSelectedNodes(), function (i, _node) {
								_me.addReceiverItem(_$dialog, _node);
							});
						}
						break;
					case 'gridalladd': //수신자 모두추가(수신부서)
						if (_issearch) {
							$('.dwp-list-body div.dwp-item', _$search).each(
								function () {
									_me.addReceiverItem(_$dialog, $(this).data('orgdata'));
								}
							);
						} else {
							var _root_node = _$org_tree.rootNode();
							_root_node = _$org_tree.getNode(_root_node.childList[0].data.key);
							addAllDept(_$org_tree, _root_node);
						}
						break;
					case 'gridalladd2': //수신자 모두추가(부서그룹,부서장,팀장)
						if (_issearch) {
							$('.dwp-list-body div.dwp-item', _$search).each(
								function () {
									_me.addReceiverItem(_$dialog, $(this).data('orgdata'));
								}
							);
						} else {
							var _root_nodes = _$org_tree.rootNode();
							$.each(_root_nodes.childList, function (idx, o) {
								var _key = o.data.key;
								var _node = _$org_tree.getNode(_key);
								_me.addReceiverItem(_$dialog, _node);
							});
						}
						break;
				}
			},
			gridupdown: function (_$dialog, id) {
				var _me = this,
					$org = $dwp.ui.org,
					_$gridlist = $org._getGrid(_$dialog),
					_refdata = _$dialog.options.refdata,
					_grid = _refdata.grid[_refdata.tabidx],
					orgdata = null,
					_pid = '',
					pobj = null,
					_item = null,
					AprNcount = 0,
					tobj = null,
					pobj = null;

				var aprvup = function (_item, _grid, _pid) {
					AprNcount = parseInt(_grid.AprNcount);
					tobj = _item.prev();
					//if (AprNcount < parseInt(tobj.data('orgdata').appindex) - 1) {
					//기안자 위치변경 금지 - 2023.07.25
					if (tobj.length > 0 && parseInt(tobj.data('orgdata').appindex) != 1 && (AprNcount < parseInt(tobj.data('orgdata').appindex))) {   //현재 결재자까지 변경하도록 변경
						tobj.before(_item);
					}
				};

				var aprvdown = function (_item, _grid, _pid) {
					if ($(_item).data("orgdata").appindex != "1") { //기안자의 위치 변경 금지 - 2023.07.25
						tobj = _item.next();
						_item.before(tobj);
					}
				};

				$.each($('div.dwp-item.active', _$gridlist), function (i, _node) {
					_item = $(this);
					orgdata = _item.data('orgdata');
					_pid = $.trim(orgdata.apptype);

					switch (id) {
						case 'aprvup':
							aprvup(_item, _grid, _pid);
							break;
						case 'aprvdown':
							aprvdown(_item, _grid, _pid);
							break;
					}
				});
				_me.reSetAppIndex(_$dialog);
			},
			reSetAppIndex: function (_$dialog, type) {
				var _me = this,
					_$gridlist = $dwp.ui.org._getGrid(_$dialog),
					_refdata = _$dialog.options.refdata,
					_grid = _refdata.grid[_refdata.tabidx];

				$.each($('div.dwp-item', _$gridlist), function (i) {
					var _$item = $(this),
						_orgdata = _$item.data('orgdata');

					_orgdata.appindex = i + 1;
					$('div[name=appindex]', _$item).html(_orgdata.appindex);
				});
			},
			initOrginfo: function ($doc, opt) {
				//console.log("결재선 지정창 initOrginfo")
				var _docopt = $doc.options,
					$org = $dwp.ui.org,
					_el = $doc.element;
				//	console.log("_docopt",_docopt);
				var appCfg = _docopt.appCfg;
				//	console.log("appCfg",appCfg);
				var pStep = appCfg.ProcessStep;
				var sDocStep = _docopt.sDocStep;
				var apptype = appCfg['AP_Code' + sDocStep].split(';');
				var getScreen = $fn.getScreenInfo();

				//console.log("getScreen",getScreen);

				var diwidth = getScreen.doc_w > 1100 ? 1100 : getScreen.doc_w - 100; //1200;
				var maxcount = appCfg['AP_Count' + sDocStep].split(';');
				var AprNcount = _$$.aprv.line.AprNcount($doc);

				var _ap_button = {
					id: 'aprvap', //결재버튼
					title: $fn.getCodeMsg('aprv.title.h033'),
					css: 'btn-add approval',
					click: function (_$dialog, id) {
						_$$.aprv.org.commBtnProc(_$dialog, id);
					}
				};
				var _ag_button = {
					id: 'aprvag', //협조버튼
					title: $fn.getCodeMsg('aprv.title.h034'),
					css: 'btn-del consent',
					click: function (_$dialog, id) {
						_$$.aprv.org.commBtnProc(_$dialog, id);
					}
				};


				//병렬협조 분리 - 2024.02.19
				var _agp_button = {
					id: 'aprvag_p', //병렬협조버튼
					title: $fn.getCodeMsg('aprv.title.agp'),
					css: 'btn-del consent',
					click: function (_$dialog, id) {
						_$$.aprv.org.commBtnProc(_$dialog, id);
					}
				};

				var _aud_button = {
					id: 'aprvaud', //감사버튼
					title: $fn.getCodeMsg('aprv.title.h138'),
					css: 'btn-del consent',
					click: function (_$dialog, id) {
						_$$.aprv.org.commBtnProc(_$dialog, id);
					}
				};

				var _opt = {
					title: '',
					fld: '',
					isedit: true,
					width: diwidth,
					docInstance: $doc,
					height: 600,
					dialogClass: 'approval-dialog-type',
					refdata: {
						type: 'appline',
						tabidx: 0,
						reqag: '',
						tab: [{
							title: $fn.getCodeMsg('aprv.title.h004'),
							tree: 0,
							button: 0,
							grid: 0
						}],
						button: [
							[{
								id: 'aprvadel',
								title: $fn.getCodeMsg('aprv.title.h035'),
								css: 'btn-all-del',
								click: function (_$dialog, id) {
									_$$.aprv.org.commBtnProc(_$dialog, id);
								}
							},
							{
								id: 'aprvupdown',
								type: 'group',
								children: [{
									id: 'aprvup',
									title: $fn.getCodeMsg('aprv.title.h036'),
									css: 'icon up-style',
									icon: $fn.getPath('weblib') + '/images/common/up-arrow.svg',
									click: function (_$dialog, id) {
										_$$.aprv.org.gridupdown(_$dialog, id);
									}
								},
								{
									id: 'aprvdown',
									title: $fn.getCodeMsg('aprv.title.h037'),
									css: 'icon down-style',
									icon: $fn.getPath('weblib') + '/images/common/down-arrow.svg',
									click: function (_$dialog, id) {
										_$$.aprv.org.gridupdown(_$dialog, id);
									}
								}
								]
							}
							]
						],
						grid: [{
							type: 'aprv',
							title: $fn.getCodeMsg('aprv.title.h004'),
							prop: 'aprv',
							selector: 'div.approval-body',
							AprNcount: AprNcount,
							children: [{
								type: 'aprv',
								title: $fn.getCodeMsg('aprv.title.h004'),
								prop: apptype[0],
								maxmsg: $fn.getCodeMsg('aprv.msg.012'),
								count: maxcount[0],
								selector: 'div.approval-body',
								AprNcount: AprNcount,
								drop: function (event, ui, _$dialog) {
									_$$.aprv.org.griddrop(event, ui, _$dialog, 0);
								}
							},
							{
								type: 'aprv',
								title: $fn.getCodeMsg('aprv.title.h004'),
								prop: apptype[1],
								maxmsg: $fn.getCodeMsg('aprv.msg.013'),
								count: maxcount[1],
								selector: 'div.approval-body',
								AprNcount: AprNcount,
								drop: function (event, ui, _$dialog) {
									_$$.aprv.org.griddrop(event, ui, _$dialog, 0);
								}
							},
							/*
								by mjkim 병렬 협조, 감사 소스가 석여 있어 문제발생 20241031
							*/
							{ //병렬협조
								type: 'aprv',
								title: $fn.getCodeMsg('aprv.title.h004'),
								prop: apptype[2],
								maxmsg: $fn.getCodeMsg('aprv.msg.067'),
								count: maxcount[2],
								selector: 'div.approval-body',
								AprNcount: AprNcount,
								drop: function (event, ui, _$dialog) {
									_$$.aprv.org.griddrop(event, ui, _$dialog, 0);
								}
							},

							{ //감사추가
								type: 'aprv',
								title: $fn.getCodeMsg('aprv.title.h004'),
								prop: apptype.length == 4 ? apptype[3] : apptype[2], //2024.12.26
								maxmsg: $fn.getCodeMsg('aprv.msg.052'),
								count: apptype.length == 4 ? maxcount[3] : maxcount[2], //2024.12.26
								selector: 'div.approval-body',
								AprNcount: AprNcount,
								drop: function (event, ui, _$dialog) {
									_$$.aprv.org.griddrop(event, ui, _$dialog, 0);
								}
							}



								/*
								{ //감사추가
									type: 'aprv',
									title: $fn.getCodeMsg('aprv.title.h004'),
									prop: apptype[2],
									maxmsg: $fn.getCodeMsg('aprv.msg.052'),
									count: maxcount[2],
									selector: 'div.approval-body',
									AprNcount: AprNcount,
									drop: function (event, ui, _$dialog) {
										_$$.aprv.org.griddrop(event, ui, _$dialog, 0);
									}
								}
								*/
								//,{type:"aprv", title:$fn.getCodeMsg("aprv.title.h004"), prop : apptype[1] , maxmsg : $fn.getCodeMsg("aprv.msg.013"), count : maxcount[1], selector :"div.consent-body",children :"div.item-wrap",AprNcount : AprNcount}]}
							]
						}],
						defaultval: [_$$.aprv.com.getFld('sAppList' + sDocStep, _el)],
						tree: [{
							type: 'org',
							checkbox: false,
							treetype: '0', // 0 : 부서 & 사용자, 1 : 부서
							seltype: '2', // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
							usesite: false,
							isapproval: true,
							onDblClick: function (_$dialog, dtnode) {
								var _refdata = _$dialog.options.refdata,
									_treeinfo = _refdata.tree[0];

								if (dtnode.data.isFolder && _treeinfo.seltype == '2') {
									dtnode.toggleExpand();
								} else {
									if (dtnode.hasOwnProperty('data')) {
										_$$.aprv.org.addListItem(_$dialog, dtnode, 0);
									}
								}
							},
							islazy: true
						}],

						initload: function (_$dialog) {
							var _el = _$dialog.element;
							var _opt = $doc.options,
								appCfg = _opt.appCfg,
								_deopt = _$dialog.options,
								_refdata = _deopt.refdata;

							$("input[name='apatuo']", _el).attr(
								'placeholder',
								$fn.getCodeMsg('aprv.title.h053')
							);
							$("input[name='agatuo']", _el).attr(
								'placeholder',
								$fn.getCodeMsg('aprv.title.h054')
							);


							//협조자가 없는 경우에는 검색 기능을 삭제 - 2023.08.07 by dwlee
							var _appCode = eval("appCfg.AP_Code" + _opt.sDocStep);
							if (_appCode.indexOf("AG_S") < 0 && _appCode.indexOf("AG_P")) {
								$(".consent-area", _el).addClass("dwp-none");
							}

							//if ( _opt.docstatus != "draft"){
							if (!_opt.isdraft) {
								/*
									by mjkim 20250228 2, 3단에서 결재선 저장, 불러오기 가능하도록 변경					
								*/


								if (_opt.sDocStep != "1" && _opt.appCcount == "0") {

									$('#act_applinesave', _el).click(function () {
										_$$.aprv.com.applinesave(
											$doc,
											$fn.getCodeMsg('aprv.title.h051'),
											'AppLineSave',
											_$dialog,
											'applineuser',
											_opt.sDocStep
										);
									});

									$('#act_applineload', _el).click(function () {
										_$$.aprv.com.applineload(
											$doc,
											$fn.getCodeMsg('aprv.title.h052'),
											'act_load',
											_$dialog,
											'applineuser',
											_opt.sDocStep
										);
									});

								} else {
									$('#btnarea', _el).hide();
								}
							} else {
								$('#act_applinesave', _el).click(function () {
									_$$.aprv.com.applinesave(
										$doc,
										$fn.getCodeMsg('aprv.title.h051'),
										'AppLineSave',
										_$dialog,
										'applineuser',
										_opt.sDocStep
									);
								});

								$('#act_applineload', _el).click(function () {
									_$$.aprv.com.applineload(
										$doc,
										$fn.getCodeMsg('aprv.title.h052'),
										'act_load',
										_$dialog,
										'applineuser',
										_opt.sDocStep
									);
								});

								/*
								if (_opt.appCfg.OPT11 === "YES") {
									//근무지별 기본결재자 사용, 2019.10.6 by Choo
									$('#appline-workarea-wrapper', _el).removeClass("dwp-hidden");
									var _$sel = $('#appline-workarea-wrapper', _el).find("select");
									var _wacode = $fn.getCurUser().pinfo.workareacode;

									var _arr_codes = _opt.appCfg.WAApprCode.split(";");
									var _arr_codenms = _opt.appCfg.WAApprCodeNm.split(";");
									$.each(_arr_codes, function (idx, o) {
										if (o === _wacode) {
											$("<option value='" + o + "' selected>" + $fn.getCurLangMsg(_arr_codenms[idx]) + "</option>").appendTo(_$sel);
										} else {
											$("<option value='" + o + "'>" + $fn.getCurLangMsg(_arr_codenms[idx]) + "</option>").appendTo(_$sel);
										}
									});

									if (_opt.docstatus === "draft") {
										console.log("근무지별 기본결재자 사용 상태일 때는 결재선 지정 시 결재선 초기화;");
									}
								}
								*/

								var tabindex = 1;
								//console.log("_refdata::", _refdata);
								var _grid = _refdata.grid[tabindex];
								if ((typeof _grid != 'undefined') && (appCfg.OPT5 == 'YES')) {
									//console.log("_grid", _grid);
									var _$gridlist = $("div.dwp-form-area[name='selected_area_" + tabindex + "']", _el),
										_btnarea = $('div.aligner', _$gridlist),
										_html = '';

									_html = "<div class='left'></div>";
									_html += "<div class='right button'>";

									//외부수신자 검색 - 2023.02.13 by dwlee
									//외부수신자는 일반기업에서는 사용하지 않음 - 2024.10.30 by dwlee
									//_html +=
									//	"<div class='dwp-btn' id='act_outreceive'><span type='button'>외부수신자 검색</span></div>"; //외부수신자 검색

									_html +=
										"<div class='dwp-btn' id='act_revdeptsave'><span type='button'>" +
										$fn.getCodeMsg('aprv.btn.b0003') +
										'</span></div>'; // 수신부서 저장
									_html +=
										"<div class='dwp-btn' id='act_revdeptload'><span type='button'>" +
										$fn.getCodeMsg('aprv.btn.b0004') +
										'</span></div>'; // 수신부서 불러오기
									_html += '</div>';

									$(_html).appendTo(_btnarea);


									//외부수신자 검색 - 2023.02.10 by dwlee
									$('#act_outreceive', _el).click(function () {
										_$$.aprv.com.outreceivesearch($doc, "외부수신자 검색", _$dialog);
									});

									$('#act_revdeptsave', _el).click(function () {
										_$$.aprv.com.applinesave(
											$doc,
											$fn.getCodeMsg('aprv.btn.b0003'),
											'AppLineSave',
											_$dialog,
											'applinedept'
										);
									});

									$('#act_revdeptload', _el).click(function () {
										_$$.aprv.com.applineload(
											$doc,
											$fn.getCodeMsg('aprv.btn.b0004'),
											'act_load',
											_$dialog,
											'applinedept'
										);
									});
								}
							}

							_$$.aprv.org.load(_$dialog, $doc);

							//if ( AprNcount == 0 ){
							_$$.aprv.org.autocomplete(_$dialog, 'apatuo', '2', 0);
							_$$.aprv.org.autocomplete(_$dialog, 'agatuo', '2', 1);
							//}

							var orgindex = 0;
							$('.approval-body', _$dialog.element)
								.sortable({
									//item-wrap   dragdrop
									//connectWith: ".dragdrop",
									delay: 150,
									revert: 0,
									cursor: 'pointer',
									items: '> div.dwp-item.all-del',
									helper: 'clone',
									start: function (event, ui) {
										var _w = ui.helper.width() - 100;
										ui.helper.width(_w);
										_$dialog.options.refdata.digval = _$$.aprv.org._getGridData(
											_$dialog
										);
									},
									stop: function (event, ui) {
										//_$$.aprv.org.befomove(_$dialog,ui.item);
										_$$.aprv.org.reSetAppIndex(_$dialog);
									}
								})
								.disableSelection();
						}
					},
					buttons: [{
						title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
						click: function (_$dialog, a, b, c, d) {
							//_$dialog.options.docInstance.options

							//이중결재 벨리데이션 체크 시작
							var _isdblapv = $("input[name='IsDblApr']", _$dialog.element).xval();
							if (appCfg.ProcessStep == '1' && appCfg.UseDblApr == 'YES' && _isdblapv == '1' && !_docopt.isrevdoc) {
								var _dblidx = $('div[dblopt]', _$dialog.element).map(function () {
									return $(this).attr('dblopt');
								}).get();
								// 기준값을 나누는 지점: 첫 번째로 "2"가 등장하는 인덱스
								var splitIndex = _dblidx.indexOf("2");
								if (splitIndex <= -1) {
									//alert("주관부서 설정해");
									$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.015") });
									return false;
								}
								//신청부서와 주관부서 순서 확인
								var isValid = splitIndex > -1 &&
									_dblidx.slice(0, splitIndex).every(v => v === "1") &&
									_dblidx.slice(splitIndex).every(v => v === "2");
								if (isValid == false) {
									//alert("주관부서 설정 순서가 잘못 되었습니다.");
									$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.079") });
									return false;
								}
								//협조나 병렬협조가 있으면 안됨.
								var _chk = "0";
								//$("select[name=APPTYPE] option:selected", _$dialog.element).each(function(){
								$("select[name=APPTYPE]", _$dialog.element).each(function () {
									if ($(this).val() != "AP") {
										_chk = "1";
										$(this).val("AP");
										// 선택 상태를 강제로 AP로 변경하기
										$(this).find("option").prop("selected", false); // 모든 옵션 선택 해제
										$(this).find("option[value='AP']").prop("selected", true); // AP 선택
										$(this).trigger("change"); // 변경 이벤트 발생
									}
								})
								if (_chk == "1") {
									$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.080") });
									return false;
								}
							}
							//이중결재 벨리데이션 체크 종료

							var _rtn = _$$.aprv.org._getGridData(_$dialog); //_$$.aprv.org._getGridData(_$dialog);

							//2단결재 지정된 상태에서 필수 주관부서거 체크 되어 있으면 비교 - 2024.12.17 by dwlee 
							//주관부서는 하나의 부서
							//20241221 mjkim appCfg.hasOwnProperty("") => appCfg.hasOwnProperty("FixDutyDept")

							/* 2025.01.21 by dwlee
														//처리부서가 고정이 아니더라도 필수 부서가 있으면 체크하도록 처리 - 2025.01.02 by dwlee
														if (_docopt.sDocStep == '1' && appCfg.ProcessStep != '1' && (appCfg.hasOwnProperty("FixDutyDept") && appCfg.FixDutyDept != "")) {
							
															//AP^1^S^ko:관리자,en:zadmin^P00001^관리자/P00001/hwasung^hs1034^hs1028^ko:사원,en:^BBY61^ko:사원,en:^BB2201^H00000^ko:전략정보팀,en:전략정보팀,zh:전략정보팀^ko:HS화성,en:HS화성,zh:HS화성^`}
															//if (opt.appCfg.hasOwnProperty("OPT3_A") && opt.appCfg.OPT3_A == "YES") {
							
															var _fixobj = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.DEPT, appCfg.FixDutyDeptFull, '^', '', 'orgcode');
															if (_rtn.hasOwnProperty("list") && _rtn.list.length == 1) {
																var _seluserdept = _rtn.list[0].orgcode;
							
																//기안부서가 회계,자금이면 2중 결재가 필요하지 않음 - 2025.01.02
																var _aprlist = $dwp.app.aprv.com.getFld('sAppList1', _el);
																var _aprarr = _aprlist.split(";");
																var _myobj = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.APRV, _aprarr[0], '^', '', 'notesid');
							
																//================================================
																//기안부서가 회계,자금이면 2중 결재가 필요하지 않음 - 2025.01.02
																if (_myobj.orgcode == "hs1142" || _myobj.orgcode == "hs1145") {
																	//
																} else {
																	if (_seluserdept != appCfg.FixDutyDept) {
																		$fn.alert({ msg: $fn.getCurLangMsg(_fixobj.orgname) + $fn.getCodeMsg("aprv.msg.fixdept") });
																		return true;
																	}
																}
																//기안자의 부서코드 랑 같은지 비교해서 같은 부서이면 1단결재로 처리되게 해야 함 - 2025.01.02 by dwlee
															}
														}
							*/

							//console.log(_waapproverfull[_idx]);
							//_rtn = _$$.aprv.org.setappline_with_WAApprover(_$dialog, $doc, _rtn);

							_$$.aprv.org.setappval(_rtn, _$dialog, $doc, true);

							/*
							if (_$dialog.options.fld != "") {
								_$fld = $("input[name='" + _$dialog.options.fld +"']", _$dialog.element);

							}*/
						}
					},
					{
						title: $fn.getCodeMsg('comm.btn.cancel'), // 취소
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					]
				};

				if (typeof (opt) == "object") _opt = $.extend(_opt, opt);



				if (sDocStep == '1') {
					var _idx = apptype.indexOf("AA");
					if (_idx >= 0) {
						_opt.refdata.button[0].unshift(_aud_button);
					}

					//병렬협조 추가 - 2024.02.19 by dwlee
					_idx = apptype.indexOf("AG_P"); //병렬협조
					if (_idx >= 0) {
						_opt.refdata.button[0].unshift(_agp_button);
					}

					_idx = apptype.indexOf("AG_S");
					if (_idx >= 0) {
						_opt.refdata.button[0].unshift(_ag_button);
					}
					_idx = apptype.indexOf("AP");
					if (_idx >= 0) {
						_opt.refdata.button[0].unshift(_ap_button);
					}
					// 수신부서




					if (appCfg.OPT5 == 'YES' && appCfg.ReceiveFix != 'YES' && !_docopt.isrevdoc) {
						_opt.refdata.tab.push({
							title: $fn.getCodeMsg('aprv.title.h013'),
							tree: 1,
							button: 1,
							grid: 1
						}); // 수신부서                       
						_opt.refdata.button.push([{
							id: 'gridadd',
							title: $fn.getCodeMsg('aprv.btn.add'),
							css: 'btn-add',
							click: function (_$dialog, id) {
								_$$.aprv.org.commBtnProc(_$dialog, id);
							}
						}, // 추가
						{
							id: 'griddel',
							title: $fn.getCodeMsg('aprv.btn.del'),
							css: 'btn-del'
						}, // 삭제
						{
							id: 'gridadel',
							title: $fn.getCodeMsg('aprv.btn.alldel'),
							css: 'btn-all-del'
						} // 모두삭제
						]);
						_opt.refdata.grid.push({
							type: 'list',
							title: $fn.getCodeMsg('aprv.title.h013'),
							prop: 'list',
							msgbox: $fn.getCodeMsg('aprv.msg.014'),
							fieldname: 'Circulation3',
							setlen: false,
							isnotchk: appCfg.OPT10 == 'YES', //2019.9.19 by Choo
							count: 300
						}); // 수신부서

						_opt.refdata.tree.push({
							type: 'org',
							checkbox: false,
							treetype: '0', // 0 : 부서 & 사용자, 1 : 부서
							seltype: '2', // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
							usesite: false,
							onDblClick: function (_$dialog, dtnode) {
								var _refdata = _$dialog.options.refdata,
									_treeinfo = _refdata.tree[1];

								if (dtnode.data.isFolder && _treeinfo.seltype == '2') {
									dtnode.toggleExpand();
								} else {
									if (dtnode.hasOwnProperty('data')) {
										_$$.aprv.org.addReceiverItem(_$dialog, dtnode);
									}
								}
							},
							islazy: true
						});
						_opt.refdata.defaultval.push(
							_$$.aprv.com.getFld('Circulation3Full', _el)
						);

						/*
						_opt.refdata.tab.push({
							title: "부서그룹",
							tree: 2,
							button: 2,
							grid: 1
						}); // 부서 문서담당자 보기
						_opt.refdata.tree.push({
							type: 'org',
							issiteselect: false,
							url: $dwp.core.getPath("org") + "/agGetDeptReceiverList?OpenAgent&gubn=filer",
							treetype: '0', // 0 : 부서 & 사용자, 1 : 부서
							seltype: '0', // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
							usesite: false,
							nodetitle: { "P": "orgname-pos username" },
							onDblClick: function (_$dialog, dtnode) {
								var _refdata = _$dialog.options.refdata,
									_treeinfo = _refdata.tree[1];

								if (dtnode.data.isFolder && _treeinfo.seltype == '2') {
									dtnode.toggleExpand();
								} else {
									if (dtnode.hasOwnProperty('data')) {
										_$$.aprv.org.addReceiverItem(_$dialog, dtnode);
									}
								}
							},
							islazy: true
						});
						_opt.refdata.button.push([
							{
								id: 'gridadd',
								title: $fn.getCodeMsg('aprv.btn.add'),
								css: 'btn-add',
								click: function (_$dialog, id) {
									_$$.aprv.org.commBtnProc(_$dialog, id);
								}
							}, // 추가
							{
								id: 'gridalladd2',
								title: $fn.getCodeMsg('aprv.btn.alladd'),
								css: 'btn-add',
								click: function (_$dialog, id) {
									_$$.aprv.org.commBtnProc(_$dialog, id);
								}
							}, // 모두추가
							{
								id: 'griddel',
								title: $fn.getCodeMsg('aprv.btn.del'),
								css: 'btn-del'
							}, // 삭제
							{
								id: 'gridadel',
								title: $fn.getCodeMsg('aprv.btn.alldel'),
								css: 'btn-all-del'
							} // 모두삭제
						]);

						_opt.refdata.tab.push({
							title: "부문장",
							tree: 3,
							button: 2,
							grid: 1
						}); // 부문장보기

						_opt.refdata.tree.push({
							type: 'org',
							issiteselect: false,
							url: $dwp.core.getPath("org") + "/agGetDeptReceiverList?OpenAgent&gubn=chief1",
							treetype: '0', // 0 : 부서 & 사용자, 1 : 부서
							seltype: '0', // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
							usesite: false,
							nodetitle: { "P": "orgname-pos username" },
							onDblClick: function (_$dialog, dtnode) {
								var _refdata = _$dialog.options.refdata,
									_treeinfo = _refdata.tree[1];

								if (dtnode.data.isFolder && _treeinfo.seltype == '2') {
									dtnode.toggleExpand();
								} else {
									if (dtnode.hasOwnProperty('data')) {
										_$$.aprv.org.addReceiverItem(_$dialog, dtnode);
									}
								}
							},
							islazy: true
						});

						_opt.refdata.tab.push({
							title: "팀장",
							tree: 4,
							button: 2,
							grid: 1
						}); // 팀장보기

						_opt.refdata.tree.push({
							type: 'org',
							issiteselect: false,
							url: $dwp.core.getPath("org") + "/agGetDeptReceiverList?OpenAgent&gubn=chief2",
							treetype: '0', // 0 : 부서 & 사용자, 1 : 부서
							seltype: '0', // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
							usesite: false,
							nodetitle: { "P": "orgname-pos username" },
							onDblClick: function (_$dialog, dtnode) {
								var _refdata = _$dialog.options.refdata,
									_treeinfo = _refdata.tree[1];

								if (dtnode.data.isFolder && _treeinfo.seltype == '2') {
									dtnode.toggleExpand();
								} else {
									if (dtnode.hasOwnProperty('data')) {
										_$$.aprv.org.addReceiverItem(_$dialog, dtnode);
									}
								}
							},
							islazy: true
						});
						*/
					}

					// 주관부서
					//2024.03.27 by dwlee
					if (pStep != '1' && appCfg.OPT5 != 'YES') {

						//환경설정 고정이고 고정수신자가 있으면 변경 불가능 하도록 변경 - 2025.04.14 by dwlee
						if (appCfg.OPT2 == "YES" && appCfg.Duty !== "") {
						} else {

							_opt.refdata.tab.push({
								title: $fn.getCodeMsg(
									appCfg.DutyType == '2' ? 'aprv.title.h112' : 'aprv.title.h013'
								),
								tree: 1,
								button: 1,
								grid: 1
							}); // 주관부서
							_opt.refdata.button.push([{
								id: 'gridadd',
								title: $fn.getCodeMsg('aprv.btn.add'),
								css: 'btn-add'
							}, // 추가
							{
								id: 'griddel',
								title: $fn.getCodeMsg('aprv.btn.del'),
								css: 'btn-del'
							}, // 삭제
							{
								id: 'gridadel',
								title: $fn.getCodeMsg('aprv.btn.alldel'),
								css: 'btn-all-del'
							} // 모두삭제
							]);
							_opt.refdata.grid.push({
								type: 'list',
								title: $fn.getCodeMsg(
									appCfg.DutyType == '2' ? 'aprv.title.h112' : 'aprv.title.h013'
								),
								prop: 'list',
								msgbox: $fn.getCodeMsg(
									appCfg.DutyType == '2' ? 'aprv.msg.043' : 'aprv.msg.014'
								),
								fieldname: 'Conduct',
								setlen: true,
								isnotchk: appCfg.OPT3 == 'YES',
								count: 1
							}); // 주관부서
							_opt.refdata.tree.push({
								type: 'org',
								checkbox: false,
								//,treetype : "1"		// 0 : 부서 & 사용자, 1 : 부서
								//seltype : "2",		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								treetype: appCfg.DutyType == '1' ? '1' : '0', // 0 : 부서 & 사용자, 1 : 부서
								seltype: appCfg.DutyType, // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
								islazy: true
							});
							_opt.refdata.defaultval.push(
								_$$.aprv.com.getFld('ConductFull', _el)
							);

							//환경설정 고정이고 고정수신자가 있으면 변경 불가능 하도록 변경 - 2025.04.10 by dwlee
						}

						//_opt.refdata.defaultval.push(_$$.aprv.com.getFld("sReceiveOrgName_Full",_el));
					}
					//2단결재 오류 수정 - 2024.02.19 by dwlee
				} else {
					var _idx = "";
					_idx = apptype.indexOf("AA"); //경유
					if (_idx >= 0) {
						_opt.refdata.button[0].unshift(_aud_button);
					}
					_idx = apptype.indexOf("AG_P"); //병렬협조
					if (_idx >= 0) {
						_opt.refdata.button[0].unshift(_agp_button);  //_ag_button 에서 _agp_button 으로 변경 - 2021.09.10 by dwlee
					}
					_idx = apptype.indexOf("AG_S"); //협조
					if (_idx >= 0) {
						_opt.refdata.button[0].unshift(_ag_button);
					}

					_idx = apptype.indexOf("AP");
					if (_idx >= 0) {
						_opt.refdata.button[0].unshift(_ap_button); //결재
					}

					//3단결재 관련 추가 - 2024.03.27 by dwlee
					//if (sDocStep == '2') {
					//2024.11.05
					if (sDocStep == '2' && pStep == "3") {
						_opt.refdata.tab.push({
							title: $fn.getCodeMsg('aprv.title.h112'),					//3단 수신자....
							tree: 1,
							button: 1,
							grid: 1
						}); // 주관부서
						_opt.refdata.button.push([{
							id: 'gridadd',
							title: $fn.getCodeMsg('aprv.btn.add'),
							css: 'btn-add'
						}, // 추가
						{
							id: 'griddel',
							title: $fn.getCodeMsg('aprv.btn.del'),
							css: 'btn-del'
						}
						]);
						_opt.refdata.grid.push({
							type: 'list',
							title: $fn.getCodeMsg('aprv.title.h112'),
							prop: 'list',
							msgbox: $fn.getCodeMsg('aprv.msg.043'),
							fieldname: 'Conduct',
							setlen: true,
							isnotchk: appCfg.OPT3 == 'YES',
							count: 1
						}); // 주관부서
						_opt.refdata.tree.push({
							type: 'org',
							checkbox: false,
							//,treetype : "1"		// 0 : 부서 & 사용자, 1 : 부서
							//seltype : "2",		// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
							treetype: appCfg.DutyType == '1' ? '1' : '0', // 0 : 부서 & 사용자, 1 : 부서
							seltype: appCfg.DutyType, // 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자
							islazy: true
						});
						_opt.refdata.defaultval.push(
							_$$.aprv.com.getFld('ConductFull', _el)
						);
						//_opt.refdata.defaultval.push(_$$.aprv.com.getFld("sReceiveOrgName_Full",_el));
					}
				}


				$dwp.ui.org.aprvline.init($(this), _opt);
			}
		},
		line: {
			PROP: {
				//AP^B^부서명^사번^풀부서코드^부서코드^상위부서코드^직책^직책코드^직급명^직급코드^회사코드^표시부서
				//AP^결재순번^S^이름^사번^노츠ID^부서코드^상위부서코드^직책^직책코드(code2)^직급명^직급코드(code1)^회사코드^표시부서
				APP: {
					// 결재탭
					KEY: 'notesid',
					TLIST: 'apptype^appindex^type^username^empno^notesid^orgcode^progcode^duty^dutycode^pos^poscode^comcode^orgname^comname^etc'
				},
				MAN: {
					// 주관부서탭
					KEY: 'orgcode',
					TLIST: 'type^orgname^^fullorgcode^orgcode^porgcode^^^^^comcode^dorgname^comname'
				},
				REC: {
					// 수신부서
					KEY: 'orgcode',
					TLIST: 'type^orgname^^fullorgcode^orgcode^porgcode^^^^^comcode^dorgname^comname'
				},
				shistory: 'h_type^h_date^h_notesid^h_name^h_empno^h_deptcd^h_cmt^h_img^h_odeptcd^h_onotesid^h_evaluation', //  결재정보 (결재판 정보를 그리기 위해 생성하는 데이터의 형식)
				sreqshistory: 'req_type^req_date^req_notesid^req_name^req_empno^req_deptcd^req_cmt^req_img^req_odeptcd^req_onotesid^req_evaluation', //  결재정보 (결재판 정보를 그리기 위해 생성하는 데이터의 형식)
				scomment: 'c_type†c_empno†c_orgname†c_duty†c_name†c_date†c_comment†c_security', //  일반의견 (결재현황을 그리기 위해 생성하는 데이터의 형식)
				sreqcomment: 'req_type†req_empno†req_orgname†req_duty†req_name†req_date†req_comment', //  협조요청의견 (결재현황을 그리기 위해 생성하는 데이터의 형식)
				BOOKMARK_SAVE: '_type`}_applcode`}_runid`}_rkey_unid`}_rdbpath`}_r_link`}_link`}_category`}_subject`}_docno`}_rsformtitle`}_rdocnumber`}_rdockey',
				DOCLINK_SAVE: '_subject`}_sformtitle`}_docnumber`}_openurl`}_dockey'
			},
			DrawingAdded: function ($doc) {
				var _el = $doc.element,
					_cmdata = {},
					_html = '',
					history1 = '',
					_hdata1 = {},
					history2 = '',
					_hdata2 = {},
					history3 = '',							//3단결재 추가 - 2024.03.29 by dwlee
					_hdata3 = {},							//3단결재 추가 - 2024.30.29 by dwlee
					sAdded = _$$.aprv.com.getFld('sAdded', _el);

				if (sAdded == '' || typeof sAdded == 'undefined') {
					return false;
				}

				_cmdata = _$$.aprv.com.getObjStr(
					this.PROP.scomment,
					sAdded,
					'†',
					'¶',
					''
				);

				history1 = _$$.aprv.com.getFld('sAppList1', _el);
				_hdata1 = _$$.aprv.com.getObjStr(
					this.PROP.APP.TLIST,
					history1,
					'^',
					';',
					''
				);

				history2 = _$$.aprv.com.getFld('sAppList2', _el);
				_hdata2 = _$$.aprv.com.getObjStr(
					this.PROP.APP.TLIST,
					history2,
					'^',
					';',
					''
				);

				//3단결재 추가 - 2024.03.29 by dwlee
				history3 = _$$.aprv.com.getFld('sAppList3', _el);
				_hdata3 = _$$.aprv.com.getObjStr(
					this.PROP.APP.TLIST,
					history3,
					'^',
					';',
					''
				);

				_html = "<div class='dwp-table-vertical'>";
				_html += "<div class='dwp-row'>";
				_html +=
					"<div class='dwp-title'>" +
					$fn.getCodeMsg('aprv.title.h087') +
					'</div>';
				_html += "<div class='dwp-value rowspan'>";

				// console.log("_hdata1",_hdata1);
				$.each(_cmdata, function (i, _o) {
					var empno = '',
						orgcode = '';

					var _h = $.grep(_hdata1, function (b) {
						return b.empno == _o.c_empno;
					});

					if (_h.length == 0) {
						_h = $.grep(_hdata2, function (b) {
							return b.empno == _o.c_empno;
						});
					}

					//3단결재 추가 - 2024.03.29 by dwlee
					if (_h.length == 0) {
						_h = $.grep(_hdata3, function (b) {
							return b.empno == _o.c_empno;
						});
					}

					if (_h.length == 0) {
						empno = _o.c_empno;
						orgcode = '';
					} else {
						empno = _h[0].empno;
						orgcode = _h[0].orgcode;
					}
					//console.log("_o.c_comment::", _o.c_comment);
					_html += "<div class='dwp-row'>";
					_html += "<div class='dwp-value'>";
					_html += "<div class='dwp-user' data-type='profile' data-empno='" + empno + "' data-orgcode='" + orgcode + "'>";
					_html += "<div class='profile-info'>";
					_html += "<div class='name'>" + $fn.getCurLangMsg(_o.c_name) + '</div>';
					_html += "<div class='rank'>" + $fn.getCurLangMsg(_o.c_duty) + '</div>';
					_html += "<div class='team'>" + $fn.getCurLangMsg(_o.c_orgname) + '</div>';
					_html += '</div>';
					_html += '</div>';
					_html += "<div class='dwp-user-util'>";
					_html += "<div class='date'>" + $fn.formatDateTime(_o.c_date) + '</div>';
					_html += '</div>';
					_html += "<div data-top='xs'>" + _o.c_comment + '</div>';
					_html += '</div>';
					_html += '</div>';
				});

				_html += '</div></div></div>';

				var addobj = $('#sAddedArea', _el);
				addobj.html(_html);
				addobj.show();
			},

			DrawingMailAppinfo: function (_data, action, cmt) {
				//console.log("DrawingMailAppinfo")
				var _html = '',
					_CurUser = $fn.getCurUser();
				var settime = true;

				for (var i = _data.length; i > 0; i--) {
					var o = _data[i - 1];

					if (settime & (_CurUser.pinfo.empno == o.empno)) {
						if (action == 'reqmutual') {
							// 협조요청
							if (!o.hasOwnProperty('req_type')) {
								o.req_type = $fn.formatDateTime(new Date().getTime(), '');
								o.req_type = action;
								o.req_comment = cmt.replace(/\n|\r/g, '<br>').replace(/ /g, '&nbsp;');
							}
						} else {
							//일반결재
							if (!o.hasOwnProperty('h_type')) {
								o.h_type = $fn.formatDateTime(new Date().getTime(), '');
								o.h_type = action;
								o.c_comment = cmt.replace(/\n|\r/g, '<br>').replace(/ /g, '&nbsp;');
							}
						}
						settime = false;
					}
					//console.log("obj",o);

					_html += "<div style='margin-top: 3px; border: 1px solid #cfcfcf;'>";
					var addlow01 = function (obj) {
						// 결재자 정보
						_html += "<div style='display: table; width: 100%;border-top: 1px solid #666;background-color: #eee;'>";

						if (obj.apptype == 'AP') {
							_html += "<div style='display: table-cell; vertical-align: middle; width: 100px; padding: 12px 0; color: #333; font-size: 15px; font-weight: 700; text-align: center;'>" +
								$fn.getCodeMsg('aprv.title.h040') + '</div>';
						} else {
							_html += "<div style='display: table-cell; vertical-align: middle; width: 100px; padding: 12px 0; color: #333; font-size: 15px; font-weight: 700; text-align: center;'>" +
								$fn.getCodeMsg('aprv.title.h041') + '</div>';
						}
						_html += "<div style='display: table-cell; vertical-align: middle; padding: 12px 10px; border-left: 1px solid #cfcfcf; text-align: left;'><div>";
						_html += '<div>';
						_html += '<div>';

						_html += "<div style='display: inline-block; color: #333; font-size: 14px; font-weight: 700; vertical-align: middle;'>" +
							$fn.getCurLangMsg(obj.username) + '</div>';
						_html += "<span style='display: inline-block; margin-left: 5px;'>/</span>";
						_html += "<div style='display: inline-block; vertical-align: middle; padding-left: 5px;'>" +
							$fn.getCurLangMsg(obj.duty) + '</div>';
						_html += "<span style='display: inline-block; margin-left: 5px;'>/</span>";
						_html += "<div style='display: inline-block; vertical-align: middle; padding-left: 5px;'>" +
							$fn.getCurLangMsg(obj.orgname) + '</div>';
						_html += '</div></div></div></div>';
						_html += '</div>';
					};

					var addlow02 = function (obj) {
						// 결재정보
						_html += "<div style='display: table; width: 100%; border-top: 1px solid #cfcfcf;'>";

						if (obj.hasOwnProperty('h_type')) {
							// 결재시간
							_html += "<div style='display: table-cell; vertical-align: middle; width: 100px; padding: 12px 0; color: #ed6c00; font-size: 13px; font-weight: 700; text-align: center;'>" +
								$fn.getCodeMsg('aprv.actions.' + obj.h_type) + '</div>';
							_html += "<div style='display: table-cell; vertical-align: middle; padding: 12px 10px; border-left: 1px solid #cfcfcf; text-align: left;'>";
							_html += "<div style=display: inline-block; vertical-align: middle;'>" +
								$fn.formatDateTime(obj.h_date) + '</div>';
						} else if (obj.hasOwnProperty('req_type')) {
							// 협조요청 시간
							_html += "<div style='display: table-cell; vertical-align: middle; width: 100px; padding: 12px 0; color: #ed6c00; font-size: 13px; font-weight: 700; text-align: center;'>" +
								$fn.getCodeMsg('aprv.actions.' + obj.req_type) + '</div>';
							_html += "<div style='display: table-cell; vertical-align: middle; padding: 12px 10px; border-left: 1px solid #cfcfcf; text-align: left;'>";
							_html += "<div style=display: inline-block; vertical-align: middle;'>" +
								$fn.formatDateTime(obj.req_date) + '</div>';
						} else {
							_html += "<div style='display: table-cell; vertical-align: middle; width: 100px; padding: 12px 0; color: #ed6c00; font-size: 13px; font-weight: 700; text-align: center;'>" +
								(obj.hasOwnProperty('r_time') ?
									$fn.getCodeMsg('aprv.actions.read') :
									'') +
								'</div>';
							_html += "<div style='display: table-cell; vertical-align: middle; padding: 12px 10px; border-left: 1px solid #cfcfcf; text-align: left;'>";
							_html += "<div style=display: inline-block; vertical-align: middle;'>" +
								(obj.hasOwnProperty('r_time') ?
									$fn.formatDateTime(obj.r_time) :
									'') +
								'</div>';
						}

						//_html +=  "<div class='time'></div>";
						_html += '</div></div>';
					};

					var addlow03 = function (obj) {
						//결재 의견
						if (obj.hasOwnProperty('c_comment')) {
							_html += "<div style='display: table; width: 100%; border-top: 1px solid #cfcfcf; background-color: #fafafa;'>";
							if (obj.apptype == 'AP') {
								_html += "<div style='display: table-cell; vertical-align: middle; width: 100px; padding: 12px 0; color: #333; font-size: 15px; font-weight: 700; text-align: center;'>" +
									$fn.getCodeMsg('aprv.title.h043') + '</div>';
							} else {
								_html += "<div style='display: table-cell; vertical-align: middle; width: 100px; padding: 12px 0; color: #333; font-size: 15px; font-weight: 700; text-align: center;'>" +
									$fn.getCodeMsg('aprv.title.h042') + '</div>';
							}
							_html += "<div style='display: table-cell; vertical-align: middle; padding: 12px 10px; border-left: 1px solid #cfcfcf; text-align: left;'>" +
								obj.c_comment + '</div></div>';
						}

						//협조요청 의견
						if (obj.hasOwnProperty('req_comment')) {
							_html += "<div style='display: table; width: 100%; border-top: 1px solid #cfcfcf; background-color: #fafafa;'>";
							_html += "<div style='display: table-cell; vertical-align: middle; width: 100px; padding: 12px 0; color: #333; font-size: 15px; font-weight: 700; text-align: center;'>" +
								$fn.getCodeMsg('aprv.title.h044') + '</div>';
							_html += "<div style='display: table-cell; vertical-align: middle; padding: 12px 10px; border-left: 1px solid #cfcfcf; text-align: left;'>" +
								obj.req_comment + '</div></div>';
							_html += '</div>';
						}
						_html += '</div>';
					};

					addlow01(o);
					addlow02(o);
					addlow03(o);

					_html += '</div>';
				}
				//console.log("_html",_html);
				return _html;
			},
			/*
			by mjkim 20241230 발신, 수신 의견 생성성
			*/

			CommentAppinfo: function (_data, $doc, req) {
				console.log("CommentAppinfo", _data)
				var el = $doc.element;
				var opt = $doc.options;
				var _html = '',
					_isApprover = true;
				var _req = (typeof req == 'undefined' ? "" : req.toLowerCase());
				//var _cmt = $('textarea[name=sTmpComment]', el).size() > 0 ? $('textarea[name=sTmpComment]', el).val() : '';
				var _cmt = "";

				_html = '<table>';
				_html += "<colgroup><col style='width:250px;'></col><col style='width:*'></col></colgroup>";

				//for ( var i=0; i < _data.length; i++) {
				for (var i = _data.length - 1; i >= 0; i--) {
					var o = _data[i],
						pstep = o.hasOwnProperty('pstep') ? o.pstep : 1,
						_pos = i + '';

					//병렬협조자의 의견이 나오도록 수정 - 2025-10-17 by wsjung
					//if (!o.hasOwnProperty('h_type') && !o.hasOwnProperty('req_type') && opt.appCcount == _pos && _isApprover && _req == "") {
					if (!o.hasOwnProperty('h_type') && !o.hasOwnProperty('req_type') && o.hasOwnProperty('r_time') && _req == "") {
						if (o.apptype === "AG_P") {
							_cmt = _$$.aprv.line.getComment_AGP(o.empno, $doc);
						}

						if (_cmt != '') {
							var _vcmt = _cmt.split('†');
							if (_vcmt.length > 5) {
								o.c_comment = _vcmt[6].replace(/\n|\r/g, '<br>').replace(/ /g, '&nbsp;');
								_isApprover = false;
							}
						}
					}

					if (o.hasOwnProperty('c_type') && o.c_type === "stop") {
						_cmt = _$$.aprv.line.getComment_AGP(o.empno, $doc);

						if (_cmt != '') {
							var _vcmt = _cmt.split('†');
							if (_vcmt.length > 5) {
								o.c_comment = _vcmt[6].replace(/\n|\r/g, '<br>').replace(/ /g, '&nbsp;');
								_isApprover = false;
							}
						}
					}

					if (o.hasOwnProperty('c_comment') || o.hasOwnProperty('req_comment')) {
						if (i == 0) {
							_html += '<tr>';
						} else {
							_html += "<tr style='border-bottom:1px solid #ddd;'>";
						}
						_html += '<td>';
						_html += "<div class='info-area'>";
						_html += "<div class='dwp-user' data-type='profile' data-empno='" + o.empno + "' data-orgcode='" + o.orgcode + "'>";
						_html += "<div class='profile-info'>";
						_html += "<div class='name'>" + $fn.getCurLangMsg(o.username) + '</div>';
						// _html += "<div class='rank'>" + $fn.getCurLangMsg(o.pos) + '</div>';
						_html += "<div class='rank'>" + $fn.getCurLangMsg(o.duty) + '</div>';
						_html += "<div class='team'>" + $fn.getCurLangMsg(o.orgname) + '</div>';
						_html += '</div></div></div>';
						_html += '</td>';

						//_html += '<td>' + (o.hasOwnProperty('c_comment') ? o.c_comment : o.req_comment) + '</td>';
						//대결자 의견체크 - 2023.06.08 by dwlee
						var _delegate = "";
						if (typeof o.h_onotesid != "undefined" && o.h_onotesid != "") {
							_delegate = "(<span class='dwp-blue'>대결 - " + $fn.getCurLangMsg(o.c_name) + "</span> ) ";
						}
						//대결자 정보 표시 - 2023.06.08 by dwlee
						_html += '<td>' + _delegate + (o.hasOwnProperty('c_comment') ? o.c_comment : o.req_comment) + '</td>';
						_html += '</tr>';
					}
				}
				_html += '</table>';
				//console.log("html", _html);
				//$('td[name=_'+(req != ""?toLowerCase(req):"")+'comment_disp]', el).html(_html);

				$('td[name=_' + _req + 'comment_disp]', el).html(_html);
			},

			CommentAppinfo_20241230: function (_data, el, opt) {
				var _html = '',
					_isApprover = true;
				var _cmt = $('textarea[name=sTmpComment]', el).size() > 0 ? $('textarea[name=sTmpComment]', el).val() : '';

				_html = '<table>';
				_html += "<colgroup><col style='width:250px;'></col><col style='width:*'></col></colgroup>";

				//for ( var i=0; i < _data.length; i++) {
				for (var i = _data.length - 1; i >= 0; i--) {
					var o = _data[i],
						pstep = o.hasOwnProperty('pstep') ? o.pstep : 1,
						_pos = i + '';

					if (!o.hasOwnProperty('h_type') && !o.hasOwnProperty('req_type') && opt.appCcount == _pos && _isApprover) {
						if (_cmt != '') {
							var _vcmt = _cmt.split('†');
							if (_vcmt.length > 5) {
								o.c_comment = _vcmt[6].replace(/\n|\r/g, '<br>').replace(/ /g, '&nbsp;');
								//_isApprover = false;
							}
						}
					}
					if (o.hasOwnProperty('c_comment') || o.hasOwnProperty('req_comment')) {
						if (i == 0) {
							_html += '<tr>';
						} else {
							_html += "<tr style='border-bottom:1px solid #ddd;'>";
						}
						_html += '<td>';
						_html += "<div class='info-area'>";
						_html += "<div class='dwp-user' data-type='profile' data-empno='" + o.empno + "' data-orgcode='" + o.orgcode + "'>";
						_html += "<div class='profile-info'>";
						_html += "<div class='name'>" + $fn.getCurLangMsg(o.username) + '</div>';
						// _html += "<div class='rank'>" + $fn.getCurLangMsg(o.pos) + '</div>';
						_html += "<div class='rank'>" + $fn.getCurLangMsg(o.duty) + '</div>';
						_html += "<div class='team'>" + $fn.getCurLangMsg(o.orgname) + '</div>';
						_html += '</div></div></div>';
						_html += '</td>';

						//						_html += '<td>' + (o.hasOwnProperty('c_comment') ? o.c_comment : o.req_comment) + '</td>';
						//대결자 의견체크 - 2023.06.08 by dwlee
						var _delegate = "";
						if (typeof o.h_onotesid != "undefined" && o.h_onotesid != "") {
							_delegate = "(<span class='dwp-blue'>대결 - " + $fn.getCurLangMsg(o.c_name) + "</span> ) ";
						}
						//대결자 정보 표시 - 2023.06.08 by dwlee
						_html += '<td>' + _delegate + (o.hasOwnProperty('c_comment') ? o.c_comment : o.req_comment) + '</td>';

						_html += '</tr>';
					}
				}
				_html += '</table>';
				//console.log("html", _html);
				$('td[name=_comment_disp]', el).html(_html);
			},

			//병렬의견 오류 해결을 위해 추가 : 임시저장된 의견들 중에서 empno에 해당하는 의견을 추출하여 리턴함. - 2025-10-17 by wsjung
			getComment_AGP: function (empno, $doc) {



				var el = $doc.element;
				var opt = $doc.options;
				var _ds = $("input[name=docstatus]", el).val();
				var cmt = "";
				var _acVal = $("input[name=sComment" + opt.sDocStep + "]", el).val();
				var _ac = "";
				var _tcVal = $("textarea[name=sTmpComment]", el).val();
				var _tc = "";
				var _tcVal_AGP = ($("textarea[name=sTmpComment_AGP]", el).size() > 0) ? $("textarea[name=sTmpComment_AGP]", el).val() : '';
				var _tc_AGP = "";

				if (_acVal != "") {
					var _acArr = _acVal.split("¶");
					$.each(_acArr, function (idx, p) {
						if (p.indexOf("†") > -1) {
							_pArr = p.split("†");
							if (_pArr[1] === empno) {
								_ac = _acArr[idx];
								return false;
							}
						}
					});
				}

				if (_tcVal != "") {
					var _tcArr = _tcVal.split("¶");
					$.each(_tcArr, function (idx, p) {
						if (p.indexOf("†") > -1) {
							_pArr = p.split("†");
							if (_pArr[1] === empno) {
								_tc = _tcArr[idx];
								return false;
							}
						}
					});
				}

				if (_tcVal_AGP != "") {
					var _tmpArr = _tcVal_AGP.split("¶");
					$.each(_tmpArr, function (idx, p) {
						if (p.indexOf("†") > -1) {
							_pArr = p.split("†");
							if (_pArr[1] === empno) {
								_tc_AGP = _tmpArr[idx];
								return false;
							}
						}
					});
				}
				//보류일 때 처리
				if (_ds == "stop") {
					cmt = _ac;
				} else {
					cmt = _tc_AGP;
				}

				return cmt;
			},

			//서면결재용 결재판 정보 추가  2025-10-01 by wsjung
			DrawingAppinfo: function (_data, cmt, _dialog) {
				//console.log("DrawingAppinfo _data", _data)
				//console.log("DrawingAppinfo cmt", cmt)
				//console.log("DrawingAppinfo _dialog", _dialog)

				var _html = '',
					_aghtml = '',
					agchk = false,
					nextchk = false,
					pobj = null;
				var _is_outofoffice = false,
					_dele_user, _orgcode;

				var addlow01 = function (obj) {

					//이중결재 관련 처리 시작
					var _msgtxt = "";
					if (typeof _dialog != 'undefined') {
						var _pel = _dialog.options.docInstance.elemet;
						var _isdblapr = $("input[name='IsDblApr']", _pel).xval();
						//console.log("addlow01 _isdblapr", _isdblapr)
						var _sapplistdbl = $("input[name='sAppListDbl']", _pel).xval();
						if (_isdblapr == "1") {
							if (_sapplistdbl != "") {
								_sapplistdbl = $("input[name='sAppListDbl']", _pel).xval().split(";");
							}
						}
						//console.log("DrawingAppinfo _sapplistdbl", _sapplistdbl)
						if (_isdblapr == "1" && _sapplistdbl.length > 0) {
							var _msg = _sapplistdbl[obj.appindex - 1];
							if (_msg.trim() == "1") {
								_msgtxt = "[●]";
							} else if (_msg.trim() == "2") {
								_msgtxt = "[○]";
							}
						}
					}
					//이중결재 관련 처리 종료

					// 결재자 정보
					_html += "<div class='row head' isapprove='" + (obj.hasOwnProperty('h_type') || obj.hasOwnProperty('req_type') ? '1' : '0') + "'>";

					_is_outofoffice = false;

					if (obj.hasOwnProperty('h_type')) {
						//console.log("=========================================");
						//console.log("obj.h_type : ", obj.h_type);
						//console.log("=========================================");

						if (obj.h_type === "agree_delegate" || obj.h_type === "mutual_delegate" || obj.h_type === "reject_delegate") _is_outofoffice = true;
						if (obj.apptype == "AA") {
							_html += "<div class='key type'>" + $fn.getCodeMsg('aprv.data.apptype.AA') + '</div>'; //감사추가
						} else {
							/*
														if (_opt.appCfg.AG_AUTH == "2") {
															mutual: $fn.getCodeMsg('aprv.actions.mutual_agree'),
															mutual_reject: $fn.getCodeMsg('aprv.actions.mutual_disagree')
														} else {
							
														}
							*/

							_html += "<div class='key type'>" + _msgtxt + $fn.getCodeMsg('aprv.actions.' + obj.h_type) + '</div>';
						}
					} else if (obj.hasOwnProperty('req_type')) {

						//console.log("=========================================");
						//console.log("obj.req_type : ", obj.req_type);
						//console.log("=========================================");

						_html +=
							"<div class='key type'>" +
							$fn.getCodeMsg('aprv.actions.' + obj.req_type) +
							'</div>';
					} else {
						if (obj.appindex == '1') {
							if (obj.hasOwnProperty('pstep') && obj.pstep == 2) {
								_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h064') + '</div>';
							} else {
								_html += "<div class='key'>" + _msgtxt + $fn.getCodeMsg('aprv.title.h010') + '</div>';
							}
						} else if (obj.apptype.indexOf('AG_') > -1) {
							_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h041') + '</div>';
						} else {
							if (obj.apptype == "AA") {
								_html += "<div class='key'>" + $fn.getCodeMsg('aprv.data.apptype.AA') + '</div>'; //감사추가
							} else {
								_html += "<div class='key'>" + _msgtxt + $fn.getCodeMsg('aprv.title.h040') + '</div>';
							}
						}
					}

					_html += "<div class='value'>";
					_html += "<div class='info-area'>";
					_html += "<div class='dwp-user' data-type='profile' data-empno='" + obj.empno + "' data-orgcode='" + obj.orgcode + "'>";
					_html += "<div class='profile-info'>";
					_html += "<div class='name'>" + $fn.getCurLangMsg(obj.username) + '</div>';
					_html += "<div class='rank'>" + $fn.getCurLangMsg(obj.duty) + '</div>';
					_html += "<div class='team'>" + $fn.getCurLangMsg(obj.orgname) + '</div>';
					_html += '</div></div>';
					if (_is_outofoffice) {
						_dele_user = $fn.getUserInfo(obj.h_empno);
						_orgcode = _dele_user[0].orgcode;
						_html += "<div class='dwp-user' data-type='profile' data-empno='" + obj.h_empno + "' data-orgcode='" + _orgcode + "'>";
						_html += "<div class='profile-info'>";
						_html += "<div class='name'>" + $fn.getCurLangMsg(obj.h_name) + '</div>';
						_html += '</div></div>';
					}
					_html += "<div class='date-info-list'>";

					if (obj.hasOwnProperty('h_type') && obj.hasOwnProperty('req_type') & (obj.h_type != 'reqmutual')) {
						// 결재요청 + 협조요청자인 경우
						_html += "<div class='date-info'>" + $fn.getCodeMsg('aprv.actions.' + obj.h_type) + ' : ' + "<span class='date'>" + $fn.formatDateTime(obj.h_date) + '</span></div>';
						_html += "<div class='date-info'>" + $fn.getCodeMsg('aprv.actions.' + obj.req_type) + ' : ' + "<div class='date'>" +
							$fn.formatDateTime(obj.req_date) + '</div>';
						_html += '</div>';
					} else if (obj.hasOwnProperty('h_type') && (obj.h_type != 'reqmutual')) {
						// 결재자
						_html += "<div class='date-info'>" + "<span class='date'>" + $fn.formatDateTime(obj.h_date) + '</span></div>';
					} else if (obj.hasOwnProperty('req_type')) {
						// 협조요청자
						_html += "<div class='date-info'>" + "<span class='date'>" + $fn.formatDateTime(obj.req_date) + '</span></div>';
					} else if (obj.hasOwnProperty('r_time')) {
						// 조회
						_html += "<div class='date-info'>" + $fn.getCodeMsg('aprv.actions.read') + ' : ' + "<span class='date'>" + $fn.formatDateTime(obj.r_time) + '</span></div>';
					}

					_html += '</div>';
					_html += '</div></div></div>';
				};

				var addlow02 = function (obj) {
					// 협조자 정보
					// console.log("bbb",obj);
					_aghtml += "<div class='row head'>";

					if (obj.hasOwnProperty('h_type')) {
						_aghtml += "<div class='key'>" + "<div class='point-color'>" + $fn.getCodeMsg('aprv.actions.' + obj.h_type) + '</div></div>';
					} else {
						_aghtml += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h041') + '</div>';
					}

					_aghtml += "<div class='value'><div class='info-area'>";
					_aghtml += "<div class='dwp-user' data-type='profile' data-empno='" + obj.empno + "' data-orgcode='" + obj.orgcode + "'>";
					_aghtml += "<div class='profile-info'>";
					_aghtml += "<div class='name'>" + $fn.getCurLangMsg(obj.username) + '</div>';
					_aghtml += "<div class='rank'>" + $fn.getCurLangMsg(obj.duty) + '</div>';
					_aghtml += "<div class='team'>" + $fn.getCurLangMsg(obj.orgname) + '</div>';
					_aghtml += '</div></div>';
					_aghtml += "<div class='date-info-list'>";

					if (obj.hasOwnProperty('h_type')) {
						_aghtml += "<div class='date-info'><span class='date'>" + $fn.formatDateTime(obj.h_date) + '</span></div>';
					} else if (obj.hasOwnProperty('r_time')) {
						// 조회
						_aghtml += "<div class='date-info'><span class='date'>" + $fn.getCodeMsg('aprv.actions.read') + ' : ' + $fn.formatDateTime(obj.r_time) + '</span></div>';
					}
					_aghtml += '</div></div>';
					_aghtml += '</div>';
					_aghtml += '</div>';

					// 평가점수
					if (obj.hasOwnProperty('h_evaluation')) {
						if (obj.h_evaluation != '') {
							_aghtml += "<div class='row'>";
							_aghtml += "<div class='key'>" + $fn.getCodeMsg('aprv.title.m007') + '</div>'; //"<div class='key'>평가</div>";
							_aghtml += " <div class='value'>" + obj.h_evaluation + '</div>';
							_aghtml += '</div>';
						}
					}

					if (obj.hasOwnProperty('c_comment')) {
						_aghtml += "<div class='row'>";
						_aghtml += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h042') + '</div>'; //"<div class='key'>협조의견</div>";
						_aghtml += " <div class='value'>" + obj.c_comment + '</div>';
						_aghtml += '</div>';
					}
				};

				var addlow03 = function (obj) {
					// 평가점수
					if (obj.hasOwnProperty('h_evaluation')) {
						if (obj.h_evaluation != '') {
							_html += "<div class='row'>";
							_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.m007') + '</div>'; //"<div class='key'>평가</div>";
							_html += " <div class='value'>" + obj.h_evaluation + '</div>';
							_html += '</div>';
						}
					}

					// 결재의견
					if (
						obj.hasOwnProperty('c_comment') && obj.hasOwnProperty('req_comment')
					) {
						_html += "<div class='row'>";
						_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h043') + '</div>';
						_html += "<div class='value'>" + obj.c_comment + '</div></div>';

						_html += "<div class='row'>";
						_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h044') + '</div>';
						_html += "<div class='value'>" + obj.req_comment + '</div></div>';
					} else if (obj.hasOwnProperty('c_comment')) {
						_html += "<div class='row'>";
						_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h043') + '</div>';
						_html += "<div class='value'>" + obj.c_comment + '</div></div>';
					} else if (obj.hasOwnProperty('req_comment')) {
						_html += "<div class='row'>";
						_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h044') + '</div>';
						_html += "<div class='value'>" + obj.req_comment + '</div></div>';

						//서면결재시 의견입력창 보이기 2025-10-02 by wsjung
						//서면결재일 때, 현결재가 아닐 때, 문서단계와 pstep 이 같을 때
					} else if (typeof _dialog != 'undefined') {
						var _opt = _dialog.options;
						var _doc = _dialog.options.docInstance;
						var _fix = obj.pstep + "_" + obj.apptype + "_" + obj.appindex;

						if (typeof _opt.actions != 'undefined') {
							if (typeof _opt.actions.paperagree != 'undefined') {
								//if (!obj.hasOwnProperty('r_time')) {
								if (obj.empno != $fn.getCurUser().pinfo.empno) {
									if (_doc.options.sDocStep == obj.pstep) {

										//결재시간
										_html += "<div class='row'>";
										_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.p001') + '</div>';
										_html += "<div class='value'>";
										_html += "<div class='dwp-calendar-form'>";

										//달력
										_html += "<div class='dwp-input'>";
										_html += "<input name='aprvDate" + _fix + "' ";
										_html += "value='' type='text' data-type='date' readonly='readonly' ";
										_html += "data-start='aprvDate" + _fix + "' data-end='' >";
										_html += "</div>";

										//시
										_html += "<span> </span>";
										_html += "<div class='dwp-selectbox'>";
										_html += "<select name='aprvH" + _fix + "' type='hidden'>";
										_html += $("#hOpt").html();
										_html += "</select>";
										_html += "</div>";

										//분
										_html += "<span> : </span>";
										_html += "<div class='dwp-selectbox'>";
										_html += "<select name='aprvM" + _fix + "' type='hidden'>";
										_html += $("#mOpt").html();
										_html += "</select>";
										_html += "</div>";

										//초
										_html += "<span> : </span>";
										_html += "<div class='dwp-selectbox'>";
										_html += "<select name='aprvS" + _fix + "' type='hidden'>";
										_html += $("#mOpt").html();
										_html += "</select>";
										_html += "</div>";

										_html += "</div>";
										_html += "</div>";
										_html += "</div>";

										//결재의견
										_html += "<div class='row'>";
										_html += "<div class='key'>" + $fn.getCodeMsg('aprv.title.h043') + '</div>';
										_html += "<div class='value'>";
										_html += "<div class='dwp-textarea'>";
										_html += "<textarea name='stmpComment" + _fix + "' cols='30' rows='4' style='height:80px; width:470px'>※ " + $fn.getCodeMsg('aprv.title.paperagree') + "</textarea>";
										_html += "</div>";
										_html += "</div>";
										_html += "</div>";
									}
								}
								//} ---- if (!obj.hasOwnProperty('r_time')) {
							}
						}
					}
				};

				var _tot = {};
				var _isApprover = true;
				//console.log("DrawingAppinfo", _data)
				for (var i = 0; i < _data.length; i++) {
					var o = _data[i],
						pstep = o.hasOwnProperty('pstep') ? o.pstep : 1;

					if (!o.hasOwnProperty('h_type') && !o.hasOwnProperty('req_type') && _isApprover) {
						if (typeof cmt != 'undefined' && cmt != '') {
							//병렬협조 의견이 보이도록 수정 2025-10-17 by wsjung
							if (o.apptype === "AG_P") {
								cmt = _$$.aprv.line.getComment_AGP(o.empno, _dialog.options.docInstance);
							}
							if (cmt != "") {
								var _cmt = cmt.split('†');
								if (_cmt.length > 5) {
									if (_cmt[1] == o.empno) {		// 등록된 의견이 사번과 맞는지 체크 : jwlee
										o.c_comment = _cmt[6]
											.replace(/\n|\r/g, '<br>')
											.replace(/ /g, '&nbsp;');
										_isApprover = false;
									}
								}
							}
						}
					}

					if (o.hasOwnProperty('c_comment') || o.hasOwnProperty('req_comment')) {
						if (_tot.hasOwnProperty('pstep' + pstep)) {
							_tot['pstep' + pstep]++;
						} else {
							_tot['pstep' + pstep] = 1;
						}
					}
				}

				for (var i = _data.length; i > 0; i--) {
					var o = _data[i - 1],
						pstep = o.hasOwnProperty('pstep') ? o.pstep : 1;
					// console.log("dd", typeof _tot["pstep" + pstep])
					if (o.hasOwnProperty('c_comment') || o.hasOwnProperty('req_comment')) {
						_tot['pstep' + pstep]--;
						_html += "<div class='info-section' pstep='" + pstep + "' cpos='" + _tot['pstep' + pstep] + "' pos='" + (parseInt(o.appindex, 10) - 1) + "'>";
					} else {
						if (typeof _tot['pstep' + pstep] != 'undefined') {
							_html += "<div class='info-section' pstep='" + pstep + "' cpos='" + _tot['pstep' + pstep] + "' pos='" + (parseInt(o.appindex, 10) - 1) + "'>";
						} else {
							_html += "<div class='info-section' pstep='" + pstep + "' cpos='-1' pos='" + (parseInt(o.appindex, 10) - 1) + "'>";
						}
					}

					addlow01(o);
					addlow03(o);

					_html += '</div>';
					_html += '</div>';
					_html += '</div>';
				}
				return _html;
			},
			getapplinedata: function ($doc, _data) {
				/*
				 * 결재 진행순서대로 결재자 정보 리턴
				 */
				var _docopt = $doc.options,
					appCfg = _docopt.appCfg,
					pStep = parseInt(appCfg.ProcessStep),
					apptype = '',
					rval = [];

				for (var i = 1; i < pStep + 1; i++) {
					$.each(_data['ALL' + i], function (j, val) {
						val.pstep = i;
						rval.push(val);
					});
					//console.log("getapplinedata"+i,rval);
				}
				return rval;
			},
			getLineData: function (id, step, _o, $doc, fns) {
				/**
							결재판에 표시할 데이터를 Object 데이터에서 추출 후 리턴
							data.LineData 변수에 결재 형식별로 Object 형태로 리턴

							@param {string}		결재박스 td id
							@param {string or integer}	결재 단계 (1단계:1, 2단계:2)
							@param {object}		결재자정보 Object Type Data
							 */
				var __su = { data: '', name: '', _class: '' },
					_s = '',
					_thtml = '';
				var _opt = $doc.options,
					_el = $doc.element;
				var af = _opt.appComCfg;
				var _empno, _orgcode, _tmp_user;

				//console.log("getLineData.o", _o);
				if (typeof _o == 'undefined') return __su;
				if (_o.type == 'S') {
					var _chk = _is_outofoffice = typeof _o['h_onotesid'] != 'undefined' && _o['h_onotesid'] != '' ? true : false; // 대결자인지 체크
					switch (id) {
						case 'aprv_part':
							//if (_o.apptype == "AP"){
							if (
								_o.hasOwnProperty('req_comment') |
								_o.hasOwnProperty('c_comment')
							) {
								_thtml = "<div data-type='" + fns + "AppHistory'>";
								_thtml += "<div class='dwp-value dwp-cursor'>" + // $fn.getCurLangMsg(_o.pos) +
									$fn.getCurLangMsg(_o.duty) + '</div></div>';
							} else {
								_thtml = '<div>';
								_thtml += "<div class='dwp-value'>" + // $fn.getCurLangMsg(_o.pos) +
									$fn.getCurLangMsg(_o.duty) + '</div></div>';
							}
							__su['data'] = _thtml;
							break;
						case 'aprv_dept':
							_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
							_thtml += "<div class='dwp-value'>" + $fn.getCurLangMsg(_o.orgname) + '</div></div>';
							__su['data'] = _thtml;
							break;
						case 'aprv_name':
							_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";

							if (_is_outofoffice && _o.hasOwnProperty("h_odeptcd") && _o.h_odeptcd !== "") {
								//부재중이면 대결자 정보로 치환, 2019.11.20 by Choo

								_empno = _o.h_empno;
								_tmp_user = $fn.getUserInfo(_empno);
								_orgcode = _tmp_user[0].orgcode;

								//dwp-description 은 doc.init 끝에서 보이기/숨기기 처리함.
								_thtml += "<div class='dwp-value dwp-blue dwp-mup' style='display:inline-block; position:relative;'>" + $fn.getCurLangMsg(_o.username) + '';
								_thtml += "	<div class='dwp-description dwp-none' style='display:none;'>";
								_thtml += "		<span class='dwp-blue'>(" + $fn.getCurLangMsg(_o.h_odeptcd) + ")</span>";
								_thtml += "		<span class='dwp-value' >" + $fn.getCodeMsg("aprv.actions." + _o.h_type) + " : " + $fn.getCurLangMsg(_tmp_user[0].name) + "</span>";
								_thtml += "	</div>";

								//_thtml += "<span style='color:blue;'>(" + $fn.getCurLangMsg(_o.h_odeptcd) + ")</span>";

							} else {
								_thtml += "<div class='dwp-value'>" + $fn.getCurLangMsg(_o.username) + '';
							}

							//_thtml += "<div class='dwp-value'>" + $fn.getCurLangMsg(_o.username) + '';
							//_thtml += (_is_outofoffice && _o.hasOwnProperty("h_odeptcd") && _o.h_odeptcd !== "") ? "<span style='color:blue;'>(" + $fn.getCurLangMsg(_o.h_odeptcd) + ")</span>" : "";

							_thtml += '</div></div>';

							__su['data'] = _thtml;
							break;

						case 'aprv_sign':

							// 결재 서명
							if (_o.h_type == 'reject' || _o.h_type == 'mutual_reject') {
								_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
								_thtml += "<div class='dwp-value'><img src='" + $fn.getPath('weblib') + "/images/approval/reject_sign.png'></div></div>";
							} else if (_o.h_type == 'reqmutual') {
								// 협조요청은 서명을 남기지 않음.
							} else if (_opt.ismig) {
								// 마이그레이션 문서 이면
								if (_o.hasOwnProperty('h_img')) {
									if (_o.h_img != '') {
										var imghtml = $('#' + _o.h_img, _el).html();
										_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
										_thtml += "<div class='dwp-value'>" + imghtml + '</div></div>';
									} else {
										_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
										_thtml += "<div class='dwp-sign'>" + $fn.getCurLangMsg(_o.username) + "</div></div>";
									}
								}
							} else {
								//if (typeof(_o.h_img) != "undefined" &  _o.h_img != ""){
								if (_o.hasOwnProperty('h_img')) {
									if (_o.apptype.indexOf('AG_') > -1) {
										//보류소스 추가 - 2024.03.29 by dwlee
										if (_o.h_type == "stop") {
											_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
											_thtml += "<div class='dwp-value dwp-red dwp-bold'>" + $fn.getCodeMsg("aprv.actions.stop") + "</div>";		// 보류
											_thtml += "</div>";
										} else {
											if (_o.h_img != '') {
												if (_is_outofoffice) { //부재중이면 대결자 정보로 치환, 2019.11.20 by Choo
													_empno = _o.h_empno;
													_tmp_user = $fn.getUserInfo(_empno);
													_orgcode = _tmp_user[0].orgcode;
												} else {
													_empno = _o.empno;
													_orgcode = _o.orgcode;
												}
												_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _empno + "' data-orgcode='" + _orgcode + "'>";
												/*
													20221004 mjkim 사인너비높이 조정
												*/
												//_thtml += "<div class='dwp-value'><IMG src='" + '/' + af.SignDBpath + _o.h_img + "' style='width:30px;'></div></div>";
												_thtml += "<div class='dwp-value'><IMG src='" + '/' + af.SignDBpath + _o.h_img + "' style='width:98%;max-height:70px'></div></div>";
											} else {
												if (_is_outofoffice) { //부재중이면 대결자 정보로 치환, 2019.11.20 by Choo
													_empno = _o.h_empno;
													_tmp_user = $fn.getUserInfo(_empno);
													_orgcode = _tmp_user[0].orgcode;
												} else {
													_empno = _o.empno;
													_orgcode = _o.orgcode;
												}
												_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _empno + "' data-orgcode='" + _orgcode + "'>";
												//_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
												//서면결재 추가 2025-10-13 by wsjung
												if (_o.h_type == "paperagree") {
													_thtml += "<div class='dwp-value dwp-red dwp-bold'>" + $fn.getCodeMsg("aprv.actions.paperagree") + "</div></div>";
													//_thtml += "<div class='dwp-sign'>" + $fn.getCurLangMsg(_o.username) + "</div></div>";
												} else {
													if (_is_outofoffice) {
														_thtml += "<div class='dwp-sign'>" + $fn.getCurLangMsg(_tmp_user[0].name) + "</div></div>";
													} else {
														_thtml += "<div class='dwp-sign'>" + $fn.getCurLangMsg(_o.username) + "</div></div>";
													}
													//_thtml += "<div class='dwp-sign'>" + $fn.getCurLangMsg(_o.username) + "</div></div>";
												}
											}
										}
									} else {
										//보류소스 추가 - 2024.03.29 by dwlee
										if (_o.h_type == "stop") {
											_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
											_thtml += "<div class='dwp-value dwp-red dwp-bold'>" + $fn.getCodeMsg("aprv.actions.stop") + "</div>";		// 보류
											_thtml += "</div>";
										} else {
											if (_o.h_img != '') {
												if (_is_outofoffice) { //부재중이면 대결자 정보로 치환, 2019.11.20 by Choo
													_empno = _o.h_empno;
													_tmp_user = $fn.getUserInfo(_empno);
													_orgcode = _tmp_user[0].orgcode;
												} else {
													_empno = _o.empno;
													_orgcode = _o.orgcode;
												}

												_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _empno + "' data-orgcode='" + _orgcode + "'>";
												if (_is_outofoffice) {
													//여기 대결자 이름 표시
													//_thtml += "<div class='dwp-value' style='color:red;font-size:11px;'>";
													//_thtml += $fn.getCodeMsg("aprv.actions." + _o.h_type) + ": " + $fn.getCurLangMsg(_tmp_user[0].name) + "</div>";
												}
												/*
													20221004 mjkim 사인너비높이 조정
												*/
												//_thtml += "<div class='dwp-value'><IMG src='" + '/' + af.SignDBpath + _o.h_img + "' style='width:30px;'></div></div>";
												_thtml += "<div class='dwp-value'><IMG src='" + '/' + af.SignDBpath + _o.h_img + "'  style='width:98%;max-height:70px'></div></div>";
											} else {
												if (_is_outofoffice) { //부재중이면 대결자 정보로 치환, 2019.11.20 by Choo
													_empno = _o.h_empno;
													_tmp_user = $fn.getUserInfo(_empno);
													_orgcode = _tmp_user[0].orgcode;
												} else {
													_empno = _o.empno;
													_orgcode = _o.orgcode;
												}
												_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _empno + "' data-orgcode='" + _orgcode + "'>";

												//서면결재 추가 2025-10-13 by wsjung
												if (_o.h_type == "paperagree") {
													_thtml += "<div class='dwp-value dwp-red dwp-bold'>" + $fn.getCodeMsg("aprv.actions.paperagree") + "</div></div>";
													//_thtml += "<div class='dwp-sign'>" + $fn.getCurLangMsg(_o.username) + "</div></div>";
												} else {
													if (_is_outofoffice) {
														_thtml += "<div class='dwp-sign'>" + $fn.getCurLangMsg(_tmp_user[0].name) + "</div></div>";
													} else {
														_thtml += "<div class='dwp-sign'>" + $fn.getCurLangMsg(_o.username) + "</div></div>";
													}
												}
											}
										}
									}
								} else {
									//결재 박스에 결재순서 표시 - 2024.03.05 by dwlee
									_thtml = "<span style='color:#A8A8A8;padding-left:5px;font-weight:bold;'>(" + _o.rappindex + ")</span>";		// 결재 index 표시 - 2024.03.05 by dwlee
									//_thtml = "<span style='color:#A8A8A8;padding-left:5px;font-weight:bold;'>(" + _o.appindex + ")</span>";		// 결재 index 표시 - 2024.03.05 by dwlee
								}
							}
							__su['data'] = _thtml;
							break;

						case 'agrv_sign':
							// 협조 서명
							if (_o.h_type == 'mutual_reject') {
								_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
								_thtml += "<div class='dwp-value'><img src='" + $fn.getPath('weblib') + "/images/approval/reject_sign.png'></div></div>";
							} else {
								if ((typeof _o.h_img != 'undefined') & (_o.h_img != '')) {
									if (_o.hasOwnProperty('c_comment')) {
										_thtml = "<div data-type='" + fns + "AppHistory'>";
										_thtml += "<div class='dwp-value point-color dwp-cursor'>" + $fn.getCodeMsg('aprv.actions.' + _o.h_img) + '</div></div>';
									} else {
										//_thtml = "<div class='dwp-user' data-type='profile' data-empno='"+_o.empno +"' data-orgcode='"+_o.orgcode+"'>";
										//_thtml +="<div class='dwp-value'>"+$fn.getCodeMsg("aprv.actions."+_o.h_img)+"</div></div>"
										_thtml = '<div>';
										_thtml += "<div class='dwp-value'>" + $fn.getCodeMsg('aprv.actions.' + _o.h_img) + '</div></div>';
									}
								}
							}
							__su['data'] = _thtml;
							break;
						case 'aprv_date':
							//결재 일자
							_thtml = "";
							//if ( (typeof(_o["h_date"]) != "undefined") & (_o.h_type != "reqmutual")) {
							//console.log("xxxxxxxxxxxxxxxx0000000000000000000000000000000000000000000000000000000000000000000000000", _o['h_date'])
							if (typeof _o['h_date'] != 'undefined') {
								_thtml += '<div title="' + $fn.formatDateTime(_o['h_date'], 'datestime') + '">' + $fn.formatDateTime(_o['h_date'], 'dateonly') + '</div>';
							} else {
								//__su["data"] = "/";
							}
							__su['data'] = _thtml;
							//console.log("datazzzzzzzzzzzzzzzzzzzzzzz",__su["data"]);
							break;
						case 'agrv_date':
							// 협조 일자
							if (typeof _o['h_date'] != 'undefined') {
								__su['data'] = $fn.formatDateTime(_o['h_date'], 'dateonly'); //_$$.appline.StrDateToFormat(_o["h_date"], "mm/dd HH:MM");
							} else {
								__su['data'] = '';
							}
							break;
					}
					__su['name'] = id + step + '_' + _o.empno;
				} else {

				}

				console.log("__suxxxxxxxxxxxxx", __su)

				return __su;
			},
			getLineData_OneLine: function (id, step, _o, $doc, fns) {
				/**
							결재판에 표시할 데이터를 Object 데이터에서 추출 후 리턴
							data.LineData 변수에 결재 형식별로 Object 형태로 리턴

							@param {string}		결재박스 td id
							@param {string or integer}	결재 단계 (1단계:1, 2단계:2)
							@param {object}		결재자정보 Object Type Data
							 */
				var __su = { data: '', name: '', _class: '' },
					_s = '',
					_thtml = '';
				var _opt = $doc.options,
					_el = $doc.element;
				var af = _opt.appComCfg;
				var _empno, _orgcode, _tmp_user;

				// console.log("getLineData.o", _o);
				if (typeof _o == 'undefined') return __su;
				if (_o.type == 'S') {
					var _chk = _is_outofoffice = typeof _o['h_onotesid'] != 'undefined' && _o['h_onotesid'] != '' ? true : false; // 대결자인지 체크
					switch (id) {
						case 'aprv_part':
							//if (_o.apptype == "AP"){
							if (
								_o.hasOwnProperty('req_comment') |
								_o.hasOwnProperty('c_comment')
							) {
								_thtml += "<div>" + // $fn.getCurLangMsg(_o.pos) +
									$fn.getCurLangMsg(_o.duty) + '</div>';
							} else {

								_thtml += "<div>" + // $fn.getCurLangMsg(_o.pos) +
									$fn.getCurLangMsg(_o.duty) + '</div>';
							}
							__su['data'] = _thtml;
							break;
						case 'aprv_dept':
							_thtml += "<div>" + $fn.getCurLangMsg(_o.orgname) + '</div>';
							__su['data'] = _thtml;
							break;
						case 'aprv_name':

							_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _o.empno + "' data-orgcode='" + _o.orgcode + "'>";
							_thtml += "<span class='dwp-blue'>" + $fn.getCurLangMsg(_o.username) + '';
							/*
														by mjkim 20250227 선택 -> 대결로 변경 처리
														_thtml += (_is_outofoffice && _o.hasOwnProperty("h_odeptcd") && _o.h_odeptcd !== "") ? "<span style='color:blue;'>(" + $fn.getCurLangMsg(_o.h_odeptcd) + ")</span>" : "";
							*/
							_thtml += (_is_outofoffice && _o.hasOwnProperty("h_odeptcd") && _o.h_odeptcd !== "") ? "<span style='color:blue;'>(" + ($fn.getCurLangMsg(_o.h_odeptcd) == "선택" ? $fn.getCodeMsg("aprv.actions.delegate") : $fn.getCurLangMsg(_o.h_odeptcd)) + ")</span>" : "";

							_thtml += '</span></div>';
							__su['data'] = _thtml;
							break;
						case 'aprv_aprv':

							_thtml = "";


							if (_o.h_type == 'reject' || _o.h_type == 'mutual_reject') {

								_thtml += "<div class='dwp-red'>" + $fn.getCodeMsg("aprv.actions.mutual_reject") + "</div>";					//반려로 변경
							} else if (_o.h_type == 'reqmutual') {

							} else {
								if (typeof _o['h_date'] != 'undefined') {
									if (_o.h_type == "stop") {
										_thtml += "<div class='dwp-red'>" + $fn.getCodeMsg("aprv.actions.stop") + "</div>";		// 보류
									} else {
										_thtml += "<div class='dwp-red'>" + $fn.getCodeMsg("aprv.actions.mutual_agree") + "</div>";					//동의로 변경
									}
								}

							}
							__su['data'] = _thtml;
							break;

						case 'aprv_date':
							//결재 일자
							_thtml = "";

							//console.log("1111111111111111111111111111111111111111111111111111111111111111111111", _o['h_date'])
							if (typeof _o['h_date'] != 'undefined') {
								//_thtml += '<div title="' + $fn.formatDateTime(_o['h_date'], 'datestime') + '">' + $fn.formatDateTime(_o['h_date'], 'dateonly') + '</div>';
								_thtml += '<div title="' + $fn.formatDateTime(_o['h_date'], 'datestime') + '">' + $fn.formatDateTime(_o['h_date'], 'datestime') + '</div>';

							} else {
							}
							__su['data'] = _thtml;

							break;

					}
					__su['name'] = id + step + '_' + _o.empno;
				} else {

				}

				return __su;
			},
			CreateHeapjoBox: function ($doc, step, isMaxDraw, type, odata, mcount, fnfix) {
				var _cnt = 0;
				var el = $doc.element;

				//결재박스 타이틀 변경관련 - 2024.04.05
				var _opt = $doc.options;
				var _odata = odata[type + step];

				if (typeof _odata === "undefined") return;		// 2021-05-17 By LHJ ADD
				var max = isMaxDraw ? mcount : _odata.length; /* isMaxDraw가 true 이면 결재 환경 설정에서 정한 갯수 만큼 미리 박스를 그린다. */
				var fns = '',
					_dc = -1,
					_dcthtmlsign = { data: '', name: '' },
					_dcthtmldate = { data: '', name: '' },
					_dctime = '',
					_tmpdcthtmldate = { data: '', name: '' };

				typeof fnfix != 'undefined' ? (fns = fnfix) : '';

				if (max == '0') max = 1;
				var tbox = $("div[name='" + fns + 'BOX_' + type + step + "']", el); /* 결재박스 동적 생성 id를 찾는다 */
				if (tbox.length == 0) return;
				tbox.empty();

				var getdata = function (id, step, i, sclass) {
					var cell = '',
						_o = {},
						_thtml = '';

					if ($('#' + id + step + '_' + (i + 1), tbox).length == 0) {
						if (typeof _odata[i] != 'undefined') {
							if (_odata[i].h_type == 'decide') {
								_dc = i;
								_con = $fn.getCodeMsg('aprv.title.h158');
							}
						}

						if (id == 'aprv_sign' && _dc > -1) {
							/* 전결체크 */
							// console.log("전결처리수행",_odata[i]);

							if (_odata[i].hasOwnProperty('h_img')) {
								//_dctime
								_o = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);

								_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _odata[i].empno + "' data-orgcode='" + _odata[i].orgcode + "'>";
								_thtml += "<div class='dwp-value dwp-blue'> " + _con + "</div></div>";

								_dcthtmlsign['data'] = _thtml;
							} else {
								if (i == max - 1) {
									_dcthtmlsign['name'] = id + step + '_' + _odata[i].empno;
									_o = _dcthtmlsign;
								} else {
									_o = _tmpdcthtmldate;
								}
							}
						} else if (id == 'aprv_date' && _dc > -1) {
							/* 전결체크 */
							if (_odata[i].hasOwnProperty('h_date')) {
								_dcthtmldate = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);
								_dctime = _dcthtmldate.data;
								_dcthtmldate.data = '/';
								_o = _dcthtmldate;
							} else {
								if (i == max - 1) {
									_dcthtmldate['name'] = id + step + '_' + _odata[i].empno;
									_dcthtmldate['data'] = _dctime;
									_o = _dcthtmldate;
								} else {
									_dcthtmldate.data = '/';
									_o = _dcthtmldate;
								}
							}
						} else {
							//console.log("b-004",id,step,_odata[i]);
							_o = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);
							// console.log("_o",_o);
						}
						cell += '<div id="' + id + step + '_' + (i + 1) + '" class="' + sclass + (_o._class != '' ? ' ' + _o._class : '') + '" name="' + _o.name + '">' + _o.data + '</div>';
					}
					//console.log("cell",cell);
					return cell;
				};
				//1줄 표현일 때
				var adddiv = function (step, elem) {
					/* 결재 박스의 cell을 추가 한다 */
					var tdiv = '';
					var id = '';

					if (_odata.length == 0) return '';

					//결재박스 타이틀 변경관련 - 2024.04.05
					if (_opt.appCfg.hasOwnProperty("AGBoxName" + step)) {
						var _boxcode = eval("_opt.appCfg.AGBoxName" + step);
						tdiv = "<div class='sign-header'><div>" + $fn.getCodeMsg(_boxcode) + '</div></div>';
					} else {
						tdiv = "<div class='sign-header'><div>" + $fn.getCodeMsg('aprv.title.agline_head') + '</div></div>';
					}

					for (var i = 0; i < elem; i++) {
						tdiv += "<div class='sign-zone'>";
						id = 'aprv_part';
						tdiv += getdata(id, step, i, 'part');
						id = 'aprv_name';
						tdiv += getdata(id, step, i, 'name');
						id = 'aprv_sign';
						tdiv += getdata(id, step, i, 'sign');
						id = 'aprv_date';
						tdiv += getdata(id, step, i, 'date');
						tdiv += '</div>';
					}

					return tdiv;
				};

				//여러줄 표현일 때, 2019.7.9 by Choo
				var adddiv2 = function (_$tbl, step, elem) {
					var tdiv = '',
						id = '';
					if (_odata.length == 0) return '';
					var i = 0,
						_val = 0,
						_row_num = 0;

					_$tbl.find(".sign-header-cell").html("<div class='sign-header' style='border:0;'><div>" + $fn.getCodeMsg('aprv.title.agline_head') + '</div></div>');
					for (i = 0; i < elem; i++) {
						_val = (i + 1) / 5;
						_row_num = Math.ceil(_val);

						id = 'aprv_part';
						tdiv = getdata(id, step, i, 'part');
						_$tbl.find(".part-cell.col_num_" + (i + 1)).html(tdiv);

						id = 'aprv_name';
						tdiv = getdata(id, step, i, 'name');
						_$tbl.find(".part-cell.col_num_" + (i + 1)).html(tdiv);

						id = 'aprv_sign';
						tdiv = getdata(id, step, i, 'sign');
						_$tbl.find(".sign-cell.col_num_" + (i + 1)).html(tdiv);

						id = 'aprv_date';
						tdiv = getdata(id, step, i, 'date');
						_$tbl.find("date-cell.col_num_" + (i + 1)).html(tdiv);
					}
					return;
				};

				//결재칸 수가 9개를 넘어서면 N줄 표현한다. 2019.7.9 by Choo
				var _MAX_COL = 15;
				if (max > _MAX_COL) {
					var _row_cnt = max / _MAX_COL;
					var _mod = max % _MAX_COL;
					var _idx = 0;
					_row_cnt = Math.ceil(_row_cnt);
					//console.log(_row_cnt);

					var _tbl_html = "<table class='dwp-sign-tbl'>";

					for (var i = 1; i <= _row_cnt; i++) {
						_tbl_html += "<tr>";
						if (i === 1) {
							_tbl_html += "<td class='sign-header-cell' rowspan='" + (_row_cnt * 3) + "'></td>";
						}

						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td class='part-cell col_num_" + _idx + "'></td>";
						}
						_tbl_html += "</tr>";
						_tbl_html += "<tr>";
						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td class='sign-cell col_num_" + _idx + "'></td>";
						}
						_tbl_html += "</tr>";
						_tbl_html += "<tr>";
						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td class='date-cell col_num_" + _idx + "'></td>";
						}
						_tbl_html += "</tr>";
					}
					_tbl_html += "</table>";
					var _$tbl = $(_tbl_html).appendTo(tbox);

					adddiv2(_$tbl, step, max);
					_$tbl.closest(".dwp-sign-area").css({ border: 0 });
				} else {
					var apptbl = adddiv(step, max);
					tbox.html(apptbl);
					tbox.removeClass("dwp-none");
				}
			},

			CreateOneLine: function ($doc, type, odata, fnfix) {
				var _cnt = 0;
				var el = $doc.element;

				//결재박스 타이틀 변경관련 - 2024.04.05
				var _opt = $doc.options;
				var _odata = odata[type];

				if (typeof _odata === "undefined") return;		// 2021-05-17 By LHJ ADD
				var max = _odata.length; /* isMaxDraw가 true 이면 결재 환경 설정에서 정한 갯수 만큼 미리 박스를 그린다. */
				var fns = ''

				typeof fnfix != 'undefined' ? (fns = fnfix) : '';

				//if (max == 0) max = 1;
				var tLine = $("div[name='" + fns + 'OneLine_' + type + "']", el); /* 결재박스 동적 생성 id를 찾는다 */

				if (tLine.length == 0) return;
				tLine.empty();

				var getdata = function (id, i, sclass) {
					var cell = '',
						_o = {},
						_thtml = '';

					if ($('#' + id + '_' + (i + 1), tLine).length == 0) {
						//console.log("b-004",id,step,_odata[i]);
						_o = _$$.aprv.line.getLineData_OneLine(id, "", _odata[i], $doc, fns);
						// console.log("_o",_o);
						cell += '<div id="' + id + '_' + (i + 1) + '" class="' + sclass + (_o._class != '' ? ' ' + _o._class : '') + '" name="' + _o.name + '">' + _o.data + '</div>';
					}
					//console.log("cell",cell);
					return cell;
				};

				var adddiv = function (elem) {
					/* 결재 라인의 cell을 추가 한다 */
					var tdiv = '';
					var id = '';

					if (_odata.length == 0) return '';

					var _mod = elem % 2;
					var _addline = 0;
					var _trstr = "<div class='dwp-row oneline-row'>";
					var _trend = "</div>"
					var _html = "";
					var _trhtml = "";
					var _conhtml = "";
					var _rowcnt = 1;

					for (var i = elem - 1; i > -1; i--) {

						if (_rowcnt % 2 == 1) {
							_trhtml = _trstr;
						}

						_conhtml = "<div class='dwp-value dwp-oneline'>";
						id = "aprv_dept";
						_conhtml += getdata(id, i, 'dept')
						id = "aprv_name";
						_conhtml += getdata(id, i, 'name')
						id = "aprv_part";
						_conhtml += getdata(id, i, 'part')
						id = "aprv_aprv";
						_conhtml += getdata(id, i, 'aprv')
						id = "aprv_date";
						_conhtml += getdata(id, i, 'date')
						_conhtml += "</div>";

						if (i == 0 && _mod == 1) {
							_trhtml += _conhtml + "<div class='dwp-value dwp-oneline'></div>";
						} else {
							_trhtml += _conhtml;
						}

						if (_rowcnt % 2 == 0 || i == 0 && _mod == 1) {
							_trhtml += _trend;
							_html += _trhtml;
						}

						_rowcnt += 1;

						/*
												tdiv += "<div class='sign-zone'>";
												id = 'aprv_part';
												tdiv += getdata(id, step, i, 'part');
												id = 'aprv_name';
												tdiv += getdata(id, step, i, 'name');
												id = 'aprv_sign';
												tdiv += getdata(id, step, i, 'sign');
												id = 'aprv_date';
												tdiv += getdata(id, step, i, 'date');
												tdiv += '</div>';
						*/
					}
					return _html;
				};


				if (max == 0) {
					$("." + fns + "Oneline-Area", el).addClass("dwp-none");

				} else {
					var _AAcnt = 0;
					var _AGcnt = 0;

					if (typeof odata["AA1"] != "undefined") {
						_AAcnt += odata["AA1"].length;
					}

					if (typeof odata["AA2"] != "undefined") {
						_AAcnt += odata["AA2"].length;
					}

					if (typeof odata["AG1"] != "undefined") {
						_AGcnt += odata["AG1"].length;
					}

					if (typeof odata["AG2"] != "undefined") {
						_AGcnt += odata["AG2"].length;
					}
					if (typeof odata["AG3"] != "undefined") {
						_AGcnt += odata["AG3"].length;
					}

					var _AAText = $fn.getCodeMsg("aprv.data.apptype.AA") + "(" + _AAcnt + ")";
					var _AGText = $fn.getCodeMsg("aprv.btn.aid") + "(" + _AGcnt + ")";
					var apptbl = adddiv(max);
					var _headhtml = "<div class='dwp-row oneline-row'>";
					_headhtml += "<div class='dwp-value dwp-honeline'>";
					_headhtml += "<span class='dwp-blue'>" + (fns == "" ? (_opt.isrevdoc ? $fn.getCodeMsg("aprv.title.h198") : "") : $fn.getCodeMsg("aprv.title.h197")) + "</span>"
					_headhtml += "<span class='dwp-blue'>" + _AGText + "</span>"
					_headhtml += "&nbsp;"
					_headhtml += "<span class='dwp-blue'>" + _AAText + "</span>"
					_headhtml += "</div>"
					_headhtml += "</div>"

					tLine.html(apptbl);

					var _head = $("div[name=" + fns + "Head_AGP]", el).html(_headhtml);
					var _onebody = $("div[name=" + fns + "OneLine_AGP]", el);
					$(_head).on("click", function () {
						if ($(_onebody).hasClass("dwp-none")) {
							$(_onebody).removeClass("dwp-none");
						} else {
							$(_onebody).addClass("dwp-none");
						}
					})
					$("." + fns + "Oneline-Area", el).removeClass("dwp-none");
				}
			},

			CreateApproveBox: function ($doc, step, isMaxDraw, type, odata, mcount, fnfix) {
				console.log("CreateApproveBox")
				//console.log("step", step)
				//console.log("isMaxDraw", isMaxDraw)
				//console.log("type", type)
				//console.log("odata", odata)
				//console.log("mcount", mcount)
				//console.log("fnfix", fnfix)

				var _cnt = 0;
				var el = $doc.element;

				//결재박스 타이틀 변경관련 - 2024.04.05
				var _opt = $doc.options;
				var _odata = odata[type + step];
				var max = isMaxDraw ? mcount : _odata.length; /* isMaxDraw가 true 이면 결재 환경 설정에서 정한 갯수 만큼 미리 박스를 그린다. */
				var _MAX_COL = 10;
				var fns = '',
					_dc = -1,
					_dcthtmlsign = { data: '', name: '' },
					_dcthtmldate = { data: '', name: '' },
					_dctime = '',
					_tmpdcthtmldate = { data: '', name: '' };

				typeof fnfix != 'undefined' ? (fns = fnfix) : '';

				//이중결재 박스 설정 시작
				var _pstep = _opt.appCfg.ProcessStep;
				var _usedblapr = _opt.appCfg.UseDblApr;
				var _isdblapr = $("input[name='IsDblApr']", el).xval();
				//var _sapplistdbl = $("input[name='sAppListDbl']", el).xval().split(";");
				var _sapplistdbl = $("input[name='sAppListDbl']", el).xval();
				if (_isdblapr == "1") {
					if (_sapplistdbl != "") {
						_sapplistdbl = $("input[name='sAppListDbl']", el).xval().split(";");
					}
				}

				var _isrevdoc = _opt.isrevdoc;

				if (max == '0') max = 1;

				//console.log("$doc.options", $doc.options)

				var tbox = $("div[name='" + fns + 'BOX_' + type + step + "']", el); /* 결재박스 동적 생성 id를 찾는다 */
				//console.log("tbox.length", tbox.length)
				if (tbox.length == 0) return;
				tbox.empty(); /* 결재박스 초기화 */

				//이중결재 박스 생성 : 신청부서
				var tbox_dbl1 = $("div[name='" + fns + 'BOX_' + type + step + "_DBL1']", el); /* 이중결재결재박스 동적 생성 id를 찾는다 물론 BOX_AP1_DBL1 밖에는 없다...ㅎㅎㅎ*/
				//console.log("tbox_dbl1.length", tbox_dbl1.length)
				if (tbox_dbl1.length == 0) return;
				tbox_dbl1.empty(); /* 이중결재박스 초기화 */

				//이중결재 박스 생성 : 주관부서
				var tbox_dbl2 = $("div[name='" + fns + 'BOX_' + type + step + "_DBL2']", el); /* 이중결재결재박스 동적 생성 id를 찾는다 물론 BOX_AP1_DBL2 밖에는 없다...ㅎㅎㅎ*/
				//console.log("tbox_dbl2.length", tbox_dbl2.length)
				if (tbox_dbl2.length == 0) return;
				tbox_dbl2.empty(); /* 이중결재박스 초기화 */

				//console.log("odata",odata);

				var getdata = function (id, step, i, sclass) {
					var cell = '',
						_o = {},
						_thtml = '';

					if ($('#' + id + step + '_' + (i + 1), tbox).length == 0) {
						if (typeof _odata[i] != 'undefined') {
							//if (_odata[i].h_type == 'decide' || _odata[i].h_type == 'paperagree') {
							if (_odata[i].h_type == 'decide') {
								_dc = i;
								_con = $fn.getCodeMsg('aprv.title.h158');
								if (_odata[i].h_type == 'paperagree') {
									_con = $fn.getCodeMsg('aprv.title.paperagree');
								}
							}
						}

						if (id == 'aprv_sign' && _dc > -1) {
							/* 전결체크 */
							//console.log("전결처리수행",_odata[i]);

							if (_odata[i].hasOwnProperty('h_img')) {
								//_dctime
								_o = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);

								_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _odata[i].empno + "' data-orgcode='" + _odata[i].orgcode + "'>";
								//_thtml += "<div class='dwp-value dwp-blue'>" + $fn.getCodeMsg('aprv.title.h158') + "</div></div>";
								_thtml += "<div class='dwp-value dwp-blue'>" + _con + "</div></div>";

								_dcthtmlsign['data'] = _thtml;
							} else {
								if (i == max - 1) {
									_dcthtmlsign['name'] = id + step + '_' + _odata[i].empno;
									_o = _dcthtmlsign;
								} else {
									_o = _tmpdcthtmldate;
								}
							}
						} else if (id == 'aprv_date' && _dc > -1) {
							/* 전결체크 */
							if (_odata[i].hasOwnProperty('h_date')) {
								_dcthtmldate = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);
								_dctime = _dcthtmldate.data;
								_dcthtmldate.data = '/';
								_o = _dcthtmldate;
							} else {
								if (i == max - 1) {
									_dcthtmldate['name'] = id + step + '_' + _odata[i].empno;
									_dcthtmldate['data'] = _dctime;
									_o = _dcthtmldate;
								} else {
									_dcthtmldate.data = '/';
									_o = _dcthtmldate;
								}
							}
						} else {
							//console.log("b-004",id,step,_odata[i]);
							_o = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);
							// console.log("_o",_o);
						}
						cell += '<div id="' + id + step + '_' + (i + 1) + '" class="' + sclass + (_o._class != '' ? ' ' + _o._class : '') + '" name="' + _o.name + '">' + _o.data + '</div>';
					}
					//console.log("cell",cell);
					return cell;
				};

				//1줄 표현일 때
				var adddiv = function (step, elem) {
					//console.log("adddiv step", step)
					//console.log("adddiv elem", elem)

					/* 결재 박스의 cell을 추가 한다 */
					var tdiv = '';
					var id = '';

					if (_odata.length == 0) return '';

					/**/
					//결재박스 타이틀 변경관련 - 2024.04.05
					if (_opt.appCfg.hasOwnProperty("APBoxName" + step)) {
						var _boxcode = eval("_opt.appCfg.APBoxName" + step);
						//console.log("_boxcode : ", _boxcode);

						//by mjkim 20241217 수발신 문서 타이틀 변경

						if (_opt.isrevdoc) {
							if (fns == "Req") {
								var _boxcode = eval("_opt.appCfg.ReqBoxName" + step);
							} else {
								var _boxcode = eval("_opt.appCfg.ARBoxName" + step);
							}
							tdiv = "<div class='sign-header'><div>" + $fn.getCodeMsg(_boxcode) + '</div></div>';
						} else {
							//2단이더라도 1단계 결재에서는 결재를 찍어주고 
							if (_opt.sDocStep == "1") {
								tdiv = "<div class='sign-header'><div>" + $fn.getCodeMsg('aprv.title.apline_head') + '</div></div>';
								//2단 인 경우에만 실제 내용을 찍어준다.
							} else {
								tdiv = "<div class='sign-header'><div>" + $fn.getCodeMsg(_boxcode) + '</div></div>';
							}
						}
					} else {
						tdiv = "<div class='sign-header'><div>" + $fn.getCodeMsg('aprv.title.apline_head') + '</div></div>';
					}

					for (var i = 0; i < elem; i++) {
						tdiv += "<div class='sign-zone'>";
						id = 'aprv_part';
						tdiv += getdata(id, step, i, 'part');
						id = 'aprv_name';
						tdiv += getdata(id, step, i, 'name');
						id = 'aprv_sign';
						tdiv += getdata(id, step, i, 'sign');
						id = 'aprv_date';
						tdiv += getdata(id, step, i, 'date');
						tdiv += '</div>';
					}

					return tdiv;
				};

				//이중결재 표시일 때
				var adddiv_dbl1 = function (step, elem) {
					//console.log("adddiv_dbl1 step", step)
					//console.log("adddiv_dbl1 elem", elem)
					/* 결재 박스의 cell을 추가 한다 */
					var tdiv1 = '';
					var tdiv2 = '';
					var id = '';

					if (_odata.length == 0) return '';

					tdiv1 = tdiv2 = "<div class='sign-header'><div>" + $fn.getCodeMsg('aprv.title.apline_req') + '</div></div>';
					var _k = 0;
					//이중 결재 사용시 1만 고르기
					if (_pstep == "1" && typeof _usedblapr != 'undefined' && _usedblapr == 'YES' && _isdblapr == "1" && step == "1" && elem == _sapplistdbl.length) {
						for (var i = 0; i < elem; i++) {
							if (_sapplistdbl[i].trim() == "1") {
								if (_k < _MAX_COL) {
									tdiv1 += "<div class='sign-zone'>";
									id = 'aprv_part';
									tdiv1 += getdata(id, step, i, 'part');
									id = 'aprv_name';
									tdiv1 += getdata(id, step, i, 'name');
									id = 'aprv_sign';
									tdiv1 += getdata(id, step, i, 'sign');
									id = 'aprv_date';
									tdiv1 += getdata(id, step, i, 'date');
									tdiv1 += '</div>';
								} else {
									tdiv2 += "<div class='sign-zone'>";
									id = 'aprv_part';
									tdiv2 += getdata(id, step, i, 'part');
									id = 'aprv_name';
									tdiv2 += getdata(id, step, i, 'name');
									id = 'aprv_sign';
									tdiv2 += getdata(id, step, i, 'sign');
									id = 'aprv_date';
									tdiv2 += getdata(id, step, i, 'date');
									tdiv2 += '</div>';
								}
								_k = _k + 1;
							}
						}
					}

					if (_pstep == "1" && typeof _usedblapr != 'undefined' && _usedblapr == 'YES' && _isdblapr == "1" && step == "1" && elem == _sapplistdbl.length) {
						if (_k < _MAX_COL) {
							$("#dbl1", el).css("border-right", "1px solid #cfcfcf");
							return tdiv1;
						} else {
							var _tmp = "<table style='width:auto'><tr><td>";
							_tmp += "<div class='dwp-sign-area' style='width:auto; margin-bottom:0px; float:left; display:flex; flex-direction:row; border-right:1px solid #cfcfcf;'>";
							_tmp += tdiv1;
							_tmp += "</div></td></tr>";
							_tmp += "<tr><td>";
							_tmp += "<div class='dwp-sign-area' style='width:auto; margin-bottom:0px; float:left; display:flex; flex-direction:row; border-right:1px solid #cfcfcf;'>";
							_tmp += tdiv2;
							_tmp += "</div></td></tr></table>";
							$("#dbl1", el).css("border-right", "0px");
							return _tmp;
						}
					} else {
						return tdiv1;
					}
				};

				//이중결재 표시일 때
				var adddiv_dbl2 = function (step, elem) {
					//console.log("adddiv_dbl2 step", step)
					//console.log("adddiv_dbl2 elem", elem)
					/* 결재 박스의 cell을 추가 한다 */
					var tdiv1 = '';
					var tdiv2 = '';
					var id = '';

					if (_odata.length == 0) return '';

					tdiv1 = tdiv2 = "<div class='sign-header'><div>" + $fn.getCodeMsg('aprv.title.apline_owner') + '</div></div>';
					var _k = 0;
					//이중 결재 사용시 2만 고르기
					if (_pstep == "1" && typeof _usedblapr != 'undefined' && _usedblapr == 'YES' && _isdblapr == "1" && step == "1" && elem == _sapplistdbl.length) {
						for (var i = 0; i < elem; i++) {
							if (_sapplistdbl[i].trim() == "2") {
								if (_k < _MAX_COL) {
									tdiv1 += "<div class='sign-zone'>";
									id = 'aprv_part';
									tdiv1 += getdata(id, step, i, 'part');
									id = 'aprv_name';
									tdiv1 += getdata(id, step, i, 'name');
									id = 'aprv_sign';
									tdiv1 += getdata(id, step, i, 'sign');
									id = 'aprv_date';
									tdiv1 += getdata(id, step, i, 'date');
									tdiv1 += '</div>';
								} else {
									tdiv2 += "<div class='sign-zone'>";
									id = 'aprv_part';
									tdiv2 += getdata(id, step, i, 'part');
									id = 'aprv_name';
									tdiv2 += getdata(id, step, i, 'name');
									id = 'aprv_sign';
									tdiv2 += getdata(id, step, i, 'sign');
									id = 'aprv_date';
									tdiv2 += getdata(id, step, i, 'date');
									tdiv2 += '</div>';
								}
								_k = _k + 1;
							}
						}
					}

					if (_pstep == "1" && typeof _usedblapr != 'undefined' && _usedblapr == 'YES' && _isdblapr == "1" && step == "1" && elem == _sapplistdbl.length) {
						if (_k < _MAX_COL) {
							$("#dbl2", el).css("border-right", "1px solid #cfcfcf");
							return tdiv1;
						} else {
							var _tmp = "<table style='width:auto'><tr><td>";
							_tmp += "<div class='dwp-sign-area' style='width:auto; margin-bottom:0px; float:left; display:flex; flex-direction:row; border-right:1px solid #cfcfcf;'>";
							_tmp += tdiv1;
							_tmp += "</div></td></tr>";
							_tmp += "<tr><td>";
							_tmp += "<div class='dwp-sign-area' style='width:auto; margin-bottom:0px; float:left; display:flex; flex-direction:row; border-right:1px solid #cfcfcf;'>";
							_tmp += tdiv2;
							_tmp += "</div></td></tr></table>";
							$("#dbl2", el).css("border-right", "0px");
							return _tmp;
						}
					} else {
						return tdiv1;
					}
				};

				//여러줄 표현일 때, 2019.7.9 by Choo
				//결재박스 깨지는 현상 때문에 보정 - 2020.08.26 by dwlee
				var adddiv2 = function (_$tbl, step, elem) {
					console.log("adddiv2")
					var tdiv = '',
						id = '';
					if (_odata.length == 0) return '';

					var i = 0,
						_val = 0,
						_row_num = 0;
					_$tbl.find(".sign-header-cell").html("<div class='sign-header' style='border:0;'><div class='dwp-aprline-title top-border bottom-border'><br><br><br><br>" + $fn.getCodeMsg('aprv.title.apline_head') + '</div></div>');

					for (i = 0; i < elem; i++) {
						_val = (i + 1) / 5;
						_row_num = Math.ceil(_val);
						var _index = i + 1;

						id = 'aprv_part';
						tdiv = getdata(id, step, i, 'part');
						_tdiv$ = $(tdiv);
						_tdiv$.addClass("left-border");
						_$tbl.find(".part-cell.col_num_" + _index).html(_tdiv$);

						id = 'aprv_name';
						tdiv = getdata(id, step, i, 'name');
						_tdiv$ = $(tdiv);
						_tdiv$.addClass("left-border");
						_$tbl.find(".part-cell.col_num_" + _index).append(_tdiv$);

						id = 'aprv_sign';
						tdiv = getdata(id, step, i, 'sign');
						_tdiv$ = $(tdiv);
						_tdiv$.addClass("left-border");

						_$tbl.find(".sign-cell.col_num_" + _index).append(_tdiv$);

						id = 'aprv_date';
						tdiv = getdata(id, step, i, 'date');
						_tdiv$ = $(tdiv);
						_tdiv$.addClass("left-border");
						_$tbl.find(".date-cell.col_num_" + _index).append(_tdiv$);
					}

					//빈칸에 대해서도 스타일 적용 - 2020.08.26 by dwlee
					if (max > 9) {
						for (j = max + 1; j < 19; j++) {
							_index = j;
							_$tbl.find(".part-cell.col_num_" + _index).html('<div class="part left-border"><div><div class="dwp-value">&nbsp;</div></div></div>');
							_$tbl.find(".part-cell.col_num_" + _index).append('<div class="name left-border"><div class="dwp-user"><div class="dwp-value">&nbsp;</div></div></div>');
							_$tbl.find(".sign-cell.col_num_" + _index).html('<div class="sign left-border"></div>');
							_$tbl.find(".date-cell.col_num_" + _index).html('<div class="date left-border"></div>');
						}
					}
					//계산된 높이 적용 - 2020.08.26 by dwlee
					$(".dwp-aprline-title", _$tbl).css("height", _$tbl.height());

					return;
				};

				//결재칸 수가 9개를 넘어서면 N줄 표현한다. 2019.7.9 by Choo
				//결재박스 깨지는 현상 때문에 보정 - 2020.08.26 by dwlee

				if (max > _MAX_COL) {
					//console.log("칸수가 많을 때")
					var _row_cnt = max / _MAX_COL;
					var _mod = max % _MAX_COL;
					var _idx = 0;
					_row_cnt = Math.ceil(_row_cnt);
					//console.log(_row_cnt);

					var _tbl_html = "<table style='width:auto' class='dwp-sign-tbl' border=0 cellspacing=0 cellpadding=0>";

					for (var i = 1; i <= _row_cnt; i++) {
						_tbl_html += "<tr>";
						if (i === 1) {
							_tbl_html += "<td style='width:32px' class='sign-header-cell' rowspan='" + (_row_cnt * 3) + "'></td>";
						}

						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td><div class='sign-zone part-cell col_num_" + _idx + "'></div></td>";
						}
						_tbl_html += "</tr>";
						_tbl_html += "<tr>";
						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td><div class='sign-zone sign-cell col_num_" + _idx + "'></div></td>";
						}
						_tbl_html += "</tr>";
						_tbl_html += "<tr>";
						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td><div class='sign-zone date-cell col_num_" + _idx + "'></div></td>";
						}
						_tbl_html += "</tr>";
					}
					_tbl_html += "</table>";

					//이중 결재 사용시 1,2 나누기
					if (_pstep == "1" && typeof _usedblapr != 'undefined' && _usedblapr == 'YES' && _isdblapr == "1" && step == "1") {
						tbox_dbl1.html(adddiv_dbl1(step, max));
						tbox_dbl2.html(adddiv_dbl2(step, max));
					} else {
						var _$tbl = $(_tbl_html).appendTo(tbox);
						adddiv2(_$tbl, step, max);
						_$tbl.closest(".dwp-sign-area").css({ border: 0 });
					}
				} else {
					//console.log("칸수가 작을 때")
					if (_pstep == "1" && typeof _usedblapr != 'undefined' && _usedblapr == 'YES' && _isdblapr == "1") {
						if (fns == "" && _isrevdoc) {
							var apptbl = adddiv(step, max);
							tbox.html(apptbl);
						} else {
							tbox_dbl1.html(adddiv_dbl1(step, max));
							tbox_dbl2.html(adddiv_dbl2(step, max));
						}
					} else {
						var apptbl = adddiv(step, max);
						tbox.html(apptbl);
					}
				}
				//이중결재 박스 설정 시작
				if (_pstep == "1" && typeof _usedblapr != 'undefined' && _usedblapr == 'YES' && _isdblapr == "1") {
					tbox_dbl1.css("float", "left"); /* 이중결재결재박스 신청팀 박스를 왼쪽으로 설정 */
					tbox_dbl2.css("float", "right"); /* 이중결재결재박스 신청팀 박스를 왼쪽으로 설정 */
					tbox_dbl1.removeClass("dwp-none"); /* 이중결재결재박스 주관팀 박스를 보이도록 설정 */
					tbox_dbl2.removeClass("dwp-none"); /* 이중결재결재박스 주관팀 박스를 보이도록 설정 */
				} else {
					tbox_dbl1.addClass("dwp-none"); /* 이중결재결재박스 주관팀 박스를 숨기도록 설정 */
					tbox_dbl2.addClass("dwp-none"); /* 이중결재결재박스 주관팀 박스를 숨기도록 설정 */
				}
				//이중결재 박스 설정 종료
			},
			//감사추가 : 감사박스
			CreateAuditBox: function ($doc, step, isMaxDraw, type, odata, mcount, fnfix) {
				var _cnt = 0;
				var el = $doc.element;

				//결재박스 타이틀 변경관련 - 2024.04.05
				var _opt = $doc.options;

				var _odata = odata[type + step];
				if (typeof _odata === "undefined") return;
				var max = isMaxDraw ? mcount : _odata.length; /* isMaxDraw가 true 이면 결재 환경 설정에서 정한 갯수 만큼 미리 박스를 그린다. */
				var fns = '',
					_dc = -1,
					_dcthtmlsign = { data: '', name: '' },
					_dcthtmldate = { data: '', name: '' },
					_dctime = '',
					_tmpdcthtmldate = { data: '', name: '' };

				// console.log("###_odata",_odata);

				typeof fnfix != 'undefined' ? (fns = fnfix) : '';

				if (max == '0') max = 1;
				var tbox = $("div[name='" + fns + 'BOX_' + type + step + "']", el); /* 결재박스 동적 생성 id를 찾는다 */
				if (tbox.length == 0) return;
				tbox.empty(); /* 결재박스 초기화 */
				//console.log("odata",odata);

				var getdata = function (id, step, i, sclass) {
					var cell = '',
						_o = {},
						_thtml = '';

					if ($('#' + id + step + '_' + (i + 1), tbox).length == 0) {
						if (typeof _odata[i] != 'undefined') {
							if (_odata[i].h_type == 'decide' || _odata[i].h_type == 'paperagree') {
								_dc = i;
								_con = $fn.getCodeMsg('aprv.title.h158');
								if (_odata[i].h_type == 'paperagree') {
									_con = $fn.getCodeMsg('aprv.title.paperagree');
								}
							}
						}

						//if (_odata[i].h_type == "decide") _dc = i;
						if (id == 'aprv_sign' && _dc > -1) {
							/* 전결체크 */
							// console.log("전결처리수행",_odata[i]);

							if (_odata[i].hasOwnProperty('h_img')) {
								//_dctime
								_o = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);

								_thtml = "<div class='dwp-user' data-type='profile' data-empno='" + _odata[i].empno + "' data-orgcode='" + _odata[i].orgcode + "'>";
								_thtml += "<div class='dwp-value dwp-blue'>" + _con + "</div></div>";

								_dcthtmlsign['data'] = _thtml;
							} else {
								if (i == max - 1) {
									_dcthtmlsign['name'] = id + step + '_' + _odata[i].empno;
									_o = _dcthtmlsign;
								} else {
									_o = _tmpdcthtmldate;
								}
							}
						} else if (id == 'aprv_date' && _dc > -1) {
							/* 전결체크 */
							if (_odata[i].hasOwnProperty('h_date')) {
								_dcthtmldate = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);
								_dctime = _dcthtmldate.data;
								_dcthtmldate.data = '/';
								_o = _dcthtmldate;
							} else {
								if (i == max - 1) {
									_dcthtmldate['name'] = id + step + '_' + _odata[i].empno;
									_dcthtmldate['data'] = _dctime;
									_o = _dcthtmldate;
								} else {
									_dcthtmldate.data = '/';
									_o = _dcthtmldate;
								}
							}
						} else {
							//console.log("b-004",id,step,_odata[i]);
							_o = _$$.aprv.line.getLineData(id, step, _odata[i], $doc, fns);
							// console.log("_o",_o);
						}
						cell += '<div id="' + id + step + '_' + (i + 1) + '" class="' + sclass + (_o._class != '' ? ' ' + _o._class : '') + '" name="' + _o.name + '">' + _o.data + '</div>';
					}
					//console.log("cell",cell);
					return cell;
				};

				var adddiv = function (step, elem) {
					/* 결재 박스의 cell을 추가 한다 */
					var tdiv = '';
					var id = '';

					if (_odata.length == 0) return '';

					//결재박스 타이틀 변경관련 - 2024.04.05
					if (_opt.appCfg.hasOwnProperty("AABoxName" + step)) {
						var _boxcode = eval("_opt.appCfg.AABoxName" + step);
						tdiv = "<div class='sign-header'><div>" + $fn.getCodeMsg(_boxcode) + '</div></div>';
					} else {
						tdiv = "<div class='sign-header'><div>" + $fn.getCodeMsg('aprv.title.aaline_head') + //감사추가 : 결재박스 왼쪽 타이틀
							'</div></div>';
					}

					for (var i = 0; i < elem; i++) {
						tdiv += "<div class='sign-zone'>";
						id = 'aprv_part';
						tdiv += getdata(id, step, i, 'part');
						id = 'aprv_name';
						tdiv += getdata(id, step, i, 'name');
						id = 'aprv_sign';
						tdiv += getdata(id, step, i, 'sign');
						id = 'aprv_date';
						tdiv += getdata(id, step, i, 'date');
						tdiv += '</div>';
					}
					return tdiv;
				};

				//여러줄 표현일 때, 2019.7.9 by Choo
				var adddiv2 = function (_$tbl, step, elem) {
					var tdiv = '',
						id = '';
					if (_odata.length == 0) return '';
					var i = 0,
						_val = 0,
						_row_num = 0;

					_$tbl.find(".sign-header-cell").html("<div class='sign-header' style='border:0;'><div>" + $fn.getCodeMsg('aprv.title.aaline_head') + '</div></div>');
					for (i = 0; i < elem; i++) {
						_val = (i + 1) / 5;
						_row_num = Math.ceil(_val);

						id = 'aprv_part';
						tdiv = getdata(id, step, i, 'part');
						_$tbl.find(".part-cell.col_num_" + (i + 1)).html(tdiv);

						id = 'aprv_name';
						tdiv = getdata(id, step, i, 'name');
						_$tbl.find(".part-cell.col_num_" + (i + 1)).html(tdiv);

						id = 'aprv_sign';
						tdiv = getdata(id, step, i, 'sign');
						_$tbl.find(".sign-cell.col_num_" + (i + 1)).html(tdiv);

						id = 'aprv_date';
						tdiv = getdata(id, step, i, 'date');
						_$tbl.find("date-cell.col_num_" + (i + 1)).html(tdiv);
					}
					return;
				};

				//결재칸 수가 9개를 넘어서면 N줄 표현한다. 2019.7.9 by Choo
				var _MAX_COL = 9;
				if (max > _MAX_COL) {
					var _row_cnt = max / _MAX_COL;
					var _mod = max % _MAX_COL;
					var _idx = 0;
					_row_cnt = Math.ceil(_row_cnt);
					//console.log(_row_cnt);

					var _tbl_html = "<table class='dwp-sign-tbl'>";

					for (var i = 1; i <= _row_cnt; i++) {
						_tbl_html += "<tr>";
						if (i === 1) {
							_tbl_html += "<td class='sign-header-cell' rowspan='" + (_row_cnt * 3) + "'></td>";
						}

						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td class='part-cell col_num_" + _idx + "'></td>";
						}
						_tbl_html += "</tr>";
						_tbl_html += "<tr>";
						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td class='sign-cell col_num_" + _idx + "'></td>";
						}
						_tbl_html += "</tr>";
						_tbl_html += "<tr>";
						for (var j = 1; j <= _MAX_COL; j++) {
							_idx = (_MAX_COL * (i - 1)) + j;
							_tbl_html += "<td class='date-cell col_num_" + _idx + "'></td>";
						}
						_tbl_html += "</tr>";
					}
					_tbl_html += "</table>";
					var _$tbl = $(_tbl_html).appendTo(tbox);

					adddiv2(_$tbl, step, max);
					_$tbl.closest(".dwp-sign-area").css({ border: 0 });
				} else {
					var apptbl = adddiv(step, max);
					tbox.html(apptbl);
				}
			},
			DrawingBox: function ($doc) {
				console.log("DrawingBox 결재박스 그리기 시작");
				/**********************************************************************************************
							결재 박스 그리기 순서
							결재라인 정보를 Object 형태로 설정한다 (Object Data에는 결재선 정보와 결재시간 정보등이 저장된다)
							결재 박스를 그린다 - this.CreateApproveBox( TabDoc, i, isMaxDraw, "AP", _data, mcount );
							협조 박스를 그린다 - this.CreateHeapjoBox( TabDoc, i, isMaxDraw, "AG", _data, mcount );
							 **********************************************************************************************/
				var _opt = $doc.options,
					_el = $doc.element;
				var isMaxDraw = false; // 고정결재 차후 개발시 옵션추가예정 (_opt.appCfg.MaxBoxOpt == "Y" ? true : false),
				var pStep = _opt.appCfg.ProcessStep;

				//console.log("app.aprv.DrawingBox - 1");
				//3단 결재 추가되었기 때문에 변경 - 2024.03.28 by dwlee
				//pStep = (pStep == 3) ? 1 : pStep; /* 3번 옵션은 수신부서 이기 때문에 결재 단계는 1단계로만 쓴다 */

				this.setLineData($doc); // 결재선 정보를 _opt.data.LineData 변수에 Object Array 형태로 셋팅

				//console.log("app.aprv.DrawingBox - 2");

				var mcount = this.LineMax($doc); // 형식별 최대 결재자 수
				var _data = this.LineData($doc); // 모든 결재자 정보

				//console.log("app.aprv.DrawingBox - 3");

				//결재 작성시 헤드영역 옵션 처리시 결재선을 숨기고 간편결재정보를 보여줌 - 2024.03.05 by dwlee
				if (_opt.appCfg.hasOwnProperty("HeadOpt") && (_opt.appCfg.HeadOpt == "YES" || _opt.appCfg.HeadOpt == "yes")) {
					//결재선 간략보기 - start
					//this.DrawingSimpleLine($doc,eval(_data.ALL1);

					//console.log("eval test");
					//console.log(pStep);
					//console.log(eval("_data.ALL"+ pStep));
					this.DrawingSimpleLine($doc, eval("_data.ALL" + pStep));
					//this.DrawingSimpleLine($doc,eval("_data."+ pStep));
				}

				//debugger;
				//console.log("app.aprv.DrawingBox - 4");

				//3단결재 추가하면서 처리 - 2023.03.28 by dwlee
				var _curstep = parseInt(_opt.sDocStep);
				//for (var i = 1; i <= pStep; i++) {
				for (var i = 1; i <= _curstep; i++) {
					this.CreateApproveBox($doc, i, isMaxDraw, 'AP', _data, mcount);
					this.CreateHeapjoBox($doc, i, isMaxDraw, 'AG', _data, mcount);
					this.CreateAuditBox($doc, i, isMaxDraw, 'AA', _data, mcount); //감사추가 : 감사박스
				}
				//this.CreateOneLine($doc, 'AGP', _data, '');
				//console.log("app.aprv.DrawingBox - 5");

				var _data2 = _$$.aprv.line.getapplinedata($doc, _data);
				var _cmt = ($('textarea[name=sTmpComment]', _el).size() > 0) ? $('textarea[name=sTmpComment]', _el).val() : '';
				var appinfohtml = $dwp.app.aprv.line.DrawingAppinfo(_data2, _cmt);
				$('div.info-wrap', $doc.element).append(appinfohtml);

				//의견넣기
				$dwp.app.aprv.line.CommentAppinfo(_data2, $doc);

				if (_opt.isrevdoc) {
					this.setLineData($doc, 'sReq'); // 결재선 정보를 _opt.data.LineData 변수에 Object Array 형태로 셋팅
					var _data = this.LineData($doc, undefined, 'sReq'); // 모든 결재자 정보

					this.CreateApproveBox($doc, 1, isMaxDraw, 'AP', _data, mcount, 'Req');
					this.CreateHeapjoBox($doc, 1, isMaxDraw, 'AG', _data, mcount, 'Req');
					this.CreateAuditBox($doc, 1, isMaxDraw, 'AA', _data, mcount, 'Req'); //감사추가 : 접수문서 상단 발신부서 결재라인
					/*
						by mjkim 20241230 발신 의견 넣기
					*/
					var _data2 = _$$.aprv.line.getapplinedata($doc, _data);
					$dwp.app.aprv.line.CommentAppinfo(_data2, $doc, 'Req');

				}
				//this.CreateOneLine($doc, 'AGP', _data, 'Req');
				/* BizCard 처리 */
				$("[data-type='profile']", _el).off('click').on('click', function () {
					$dwp.ui.bizcard.init($(this));
				});

				$("[data-type='AppHistory']", _el).on('click', function () {
					_$$.aprv.com.AppHistory($doc, $fn.getCodeMsg('aprv.title.h018'));
				});

				$("[data-type='ReqAppHistory']", _el).on('click', function () {
					_$$.aprv.com.AppHistory($doc, $fn.getCodeMsg('aprv.title.h065'), 'sReq');
				});
			},
			LineData: function ($doc, data, reqchk) {
				/* 결재정보 (결재판 그리기 위한 기본 데이터) -- 양식 프로파일에서 설정한 기준으로 Object Array를 생성하고 결재문서의 결재선 정보를 참조해서 해당 Object Array에 값을 할당한다 */
				if (typeof reqchk == 'undefined') {
					var _data = $doc.options.data;
				} else {
					var _data = $doc.options.reqdata;
				}

				if (typeof data == 'undefined') {
					//console.log("_data.LineData ",_data.LineData);
					if (typeof _data.LineData == 'undefined') _data.LineData = {};
					return _data.LineData; // get
				} else {
					_data.LineData = data; // set
				}
			},
			LineMax: function ($doc, data) {
				/* 양식 프로파일에서 설정한 결재형식별 최대 인원수 (AP1 : 5, AP2 : 3, AG1 : 10) */
				var _data = $doc.options.data;
				if (typeof data == 'undefined') {
					if (typeof _data.LineMax == 'undefined') _data.LineMax = {};
					return _data.LineMax; // get
				} else {
					_data.LineMax = data; // set
				}
			},
			AprNcount: function ($doc, data) {
				var _data = $doc.options.data;

				if (typeof data == 'undefined') {
					if (typeof _data.AprNcount == 'undefined') _data.AprNcount = 1;
					return _data.AprNcount; // get
				} else {
					_data.AprNcount = data; // set
				}
			},
			LineType: function ($doc, data) {
				/* 오른쪽과 같이 기본 Object 형식의 기본 값만 가지고 있는다 (AP1 : {}, AP2 : {}, AG1 : {}, AG2 : {}) */
				var _data = $doc.options.data;
				if (typeof data == 'undefined') {
					if (typeof _data.LineType == 'undefined') _data.LineType = {};
					return _data.LineType; // get
				} else {
					_data.LineType = data; // set
				}
			},
			setLineData: function ($doc, fnfix) {
				var _opt = $doc.options,
					_el = $doc.element,
					tmp = '',
					_type = '',
					_LineData = {},
					tmpType = this.LineType($doc),
					history = '',
					_hdata = {},
					_reqhdata = {},
					_read = _opt.ReadData,
					comment = '',
					_cmdata = {},
					_reqcmdata = {},
					fns = '';

				typeof fnfix == 'undefined' ? '' : (fns = fnfix);

				//console.log("app.aprv.setLineData - 1");
				//console.log("tmptype : " , tmpType);

				$.each(tmpType, function (type, data) {
					_LineData[type] = [];
				});

				//console.log("app.aprv.setLineData - 2");
				_LineData['AGP'] = [];
				for (var i = 1; i <= parseInt(_opt.appCfg.ProcessStep); i += 1) {
					_LineData['ALL' + i] = []; //2017-08-17 전체 리스트 정보 By LHJ 추가

					//console.log("==============================================================");
					//console.log("app.aprv.setLineData - 2-1");
					//console.log("app.aprv.setLineData - i : ", i);

					tmp = _$$.aprv.com.getFld(fns + 'sAppList' + i, _el);
					history = _$$.aprv.com.getFld(fns + 'sAprHistory' + i, _el);
					_hdata = _$$.aprv.com.getObjStr(this.PROP.shistory, history, '^', ';', '');
					_reqhdata = _$$.aprv.com.getObjStr(this.PROP.sreqshistory, history, '^', ';', '');
					comment = _$$.aprv.com.getFld(fns + 'sComment' + i, _el);
					_cmdata = _$$.aprv.com.getObjStr(this.PROP.scomment, comment, '†', '¶', '');

					//console.log("==================================================================")
					//console.log("setLineData " + fns + 'sAppList' + i, tmp)
					//console.log("==================================================================")
					//console.log("setLineData " + fns + 'sAprHistory' + i, history)
					//console.log("==================================================================")
					//console.log("setLineData _hdata", _hdata)
					//console.log("==================================================================")
					//console.log("setLineData _reqhdata", _reqhdata)
					//console.log("==================================================================")
					//console.log("setLineData " + fns + 'sComment' + i, comment)
					//console.log("==================================================================")
					//console.log("setLineData _cmdata", _cmdata)
					//console.log("==================================================================")


					//return false;


					//감사등의 경우에 보안의견을 숨김 처리 - 2024.11.19 by dwlee
					//현재는 완료문서만 제어 - 2024.11.19 
					if (_opt.docstatus == "complete" && $fn.getSysinfo().DspSecOpinion == "0") {
						var _cmdata = $.grep(_cmdata, function (b) {
							return b.c_security != "y";
						});
					}

					//console.log("app.aprv.setLineData - 2-2");

					var _apcmdata = $.grep(_cmdata, function (b) {
						// 일반의견
						return b.c_type != 'reqmutual';
					});

					//console.log("app.aprv.setLineData - 2-3");
					// 협조요청 의견 구하기 시작
					var _reqcmd = $.grep(_cmdata, function (b) {
						return b.c_type == 'reqmutual';
					});
					var _tmpreqcmdata = _$$.aprv.com.getObjStr(this.PROP.scomment, _reqcmd, '†', '¶', 'c_empno'); // sreqcomment
					var _treqcmdata = [];
					$.each(_tmpreqcmdata, function (rq, rqdata) {
						_treqcmdata.push(rqdata.fullinfo);
					});
					var _reqcmdata = _$$.aprv.com.getObjStr(this.PROP.sreqcomment, _treqcmdata.join('¶'), '†', '¶', ''); // 협조요청 의견
					// 협조요청 의견 구하기 종료

					//console.log("app.aprv.setLineData - 2-4");

					if (tmp != '') {
						var objData = _$$.aprv.com.getObjStr(this.PROP.APP.TLIST, tmp, '^', ';', this.PROP.APP.KEY);

						//console.log("app.aprv.setLineData - 2-4-1");

						//==============================================================
						//실제 결재라인의 순번을 구하는 로직
						// 	- 2024.03.05 by dwlee
						var _parindex = "0";
						var _aprindex = 0;
						var _ispar = false;
						//==============================================================

						//console.log("app.aprv.setLineData - 2-4-2");

						$.each(objData, function (j, subdata) {
							_type = $.trim((subdata['apptype'] + '_').split('_')[0]);

							//console.log("_type : ", _type);

							//==============================================================
							//실제 결재라인의 순번을 구하는 로직
							//		 - 2024.03.05 by dwlee
							//==============================================================							
							if ($.trim(subdata['apptype']) == "AG_P") {													//병렬협조이면....
								if (_ispar == false) {
									_parindex = subdata.appindex;
									_aprindex += 1;
								}
								subdata.rappindex = _parindex;
								_ispar = true;
							} else {
								_aprindex += 1;
								subdata.rappindex = _aprindex;
								_ispar = false;
							}
							//================================================================

							//console.log("app.aprv.setLineData - 2-4-1");

							var _h = $.grep(_hdata, function (b) {
								var __k = '',
									__d = '',
									__m = (b.h_type.indexOf('mutual') == 0 ||
										b.h_type.indexOf('stop') == 0) &&
										b.h_deptcd == subdata.deptcd &&
										subdata.empno == ''; // __m : 병렬협조팀 정보인지 체크
								if (b.h_onotesid != '') {
									if (b.h_type == "raise_delegate") {		//기안자 부재설정 기간중 결재문서 상신하는 경우 결재판 오류 수정 - 2023/02/01 - 10000hyun
										__k = b.h_notesid;
										__d = b.h_deptcd;
									} else {
										__k = b.h_onotesid;
										__d = b.h_odeptcd;
									}
								} else {
									__k = b.h_notesid;
									__d = b.h_deptcd;
								} //대결 정보이면 원 결재라인 정보에 추가..
								//return ((__k == subdata.key) && (__d == subdata.orgcode)) || __m;
								return __k == subdata.key || __m;
							});

							//console.log("app.aprv.setLineData - 2-4-2");

							if (_h.length == 1) {
								$.extend(true, subdata, _h[0]);
							} else {
								$.each(_h, function (_count, data) {
									data.h_type != 'reqmutual' ?
										$.extend(true, subdata, _h[_count]) :
										'';
								});
							}

							//console.log("app.aprv.setLineData - 2-4-3");


							var _reqh = $.grep(_reqhdata, function (b) {
								return (
									(b.req_empno == subdata.empno) & (b.req_type == 'reqmutual')
								);
							});

							//console.log("app.aprv.setLineData - 2-4-4");


							if (_reqh.length == 1) {
								$.extend(true, subdata, _reqh[0]);
							} else {
								$.each(_reqh, function (_count, data) {
									$.extend(true, subdata, _reqh[_count]);
								});
							}

							//console.log("app.aprv.setLineData - 2-4-5");


							var _c = $.grep(_apcmdata, function (b) {
								//return b.c_empno == subdata.empno;

								//대결자가 있으면.... - 2023.06.08 by dwlee
								if (subdata.h_onotesid != "") {
									return b.c_empno == subdata.h_empno;
								} else {
									return b.c_empno == subdata.empno;
								}

							});

							if (_c.length != 0) {
								$.extend(true, subdata, _c[0]);
							}

							//console.log("app.aprv.setLineData - 2-4-6");


							var _req = $.grep(_reqcmdata, function (b) {
								return b.req_empno == subdata.empno;
							});

							if (_req.length != 0) {
								$.extend(true, subdata, _req[0]);
							}

							//console.log("app.aprv.setLineData - 2-4-7");

							if (subdata['type'] == 'S') {
								// 사람 (읽음 정보 업데이트)
								if (_read.hasOwnProperty(subdata['empno']) == true) {
									var __r = _read[subdata['empno']].split('^');
									$.extend(true, subdata, {
										r_user: __r[0],
										r_time: __r[1]
									});
								}
							} else {
								// 부서 (읽음 정보 업데이트)
								if (_read.hasOwnProperty(subdata['mnotesid']) == true) {
									var __r = _read[subdata['mnotesid']].split('^');
									$.extend(true, subdata, {
										r_user: __r[0],
										r_time: __r[1]
									});
								}
							}

							//console.log("app.aprv.setLineData - 2-4-8");

							//console.log("_type i : ", _type + i);
							//console.log("subdata : ", subdata);
							/*
								Type 협조 or 감사/예산인 경우 by mjkim 20241031
							*/

							if (_type == "AG" || _type == "AA") {
								_LineData["AGP"].push(subdata);
							}
							_LineData[_type + i].push(subdata);
							_LineData['ALL' + i].push(subdata); //2017-08-17 전체 리스트 정보 By LHJ 추가

							//console.log("app.aprv.setLineData - 2-4-9");
						});

						//console.log("app.aprv.setLineData - 2-4-3");
					}

					//console.log("app.aprv.setLineData - 2-5");
				}

				//console.log("app.aprv.setLineData - 3");

				this.LineData($doc, _LineData, fnfix);
			},
			setCfgAppType: function ($doc) {
				/**
					결재양식 프로파일에 설정된 결재형식 가져오기
					@param {object} $doc
				*/
				var _opt = $doc.options,
					_el = $doc.element;
				// console.log("_opt",_opt);
				var _LineType = {},
					_LineMax = {},
					cfg = _opt.appCfg,
					arrTmp = '',
					arrTmp2 = '',
					subData = '';
				//3단결재로 인하여 수정 - 2024.03.28 by dwlee
				for (var i = 1; i <= 3; i += 1) {
					arrTmp = cfg['AP_Code' + i].split(';');
					arrTmp2 = cfg['AP_Count' + i].split(';');

					for (var j = 0, len = arrTmp.length; j < len; j += 1) {
						if ($.trim(arrTmp[j]) != '') {
							subData = (arrTmp[j] + '_').split('_')[0];
							if (typeof _LineType[subData + i] == 'undefined') {
								_LineType[subData + i] = [];
								_LineMax[subData + i] = parseInt('0' + arrTmp2[j], 10);
							} else {
								_LineMax[subData + i] += parseInt(arrTmp2[j], 10); // 병렬, 순차 형식을 함께 사용 할 경우 카운트 통합
							}
						}
					}
				}

				this.LineMax($doc, _LineMax); // 현재 양식의 각 결재 형식별 최대 결재자수 설정 (협조와 같이 순차, 병렬 있을 경우 통합)
				this.LineType($doc, _LineType);
				this.AprNcount($doc, _$$.aprv.com.getFld('AprNcount' + _opt.sDocStep, _el));
			},
			//보기 목록에서 일괄접수/상신 처리시 결재선 선택
			selectLineData: function (instance, checkfnc, selectcallback) {
				var _me = this,
					opt = instance.options,
					_form = '',
					title = $fn.getCodeMsg("aprv.title.h052"),
					apltype = "applineuser",
					_wd = 524,
					_param = "",
					_url = "",
					_data = [];
				_form = 'wFrmAppLineList';
				_param = '&AppLineCat=' + apltype;
				_url = $fn.getProxyUrl('/' + opt.appComCfg.ADBpath + '/api/data/collections/name/nViw01_' + apltype + '?count=999&category={orgcode}');
				_data = _$$.aprv.com.getViewData(_url);
				if (_data.length == 0) {
					$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg070") });
					return;
				}

				$fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: false,
					title: title,
					width: _wd,
					show: 'fade', //effect
					hide: 'fade', //effect
					initcallback: function (_$dialog) {
						var _$item = null;
						var _el = $('div.list', _$dialog.element); //$("div.list-area", _$dialog.element);
						$.each(_data, function (i, o) {
							var aptype = "",
								stdiv = "",
								mdata = $fn.formatDateTime(o._lasteditdate, 'dateonly'),
								ttl = "";
							o._appLinetype == '0' ? (aptype = $fn.getCodeMsg('aprv.title.h068')) : (aptype = $fn.getCodeMsg('aprv.title.h069'));

							$.each(o._applinedata, function (ii, sline) {
								var arrinfo = sline.split("^");
								ttl += (ttl != "" ? " -> " : "") + $fn.getCurLangMsg(arrinfo[3]) + "[" + $fn.getCodeMsg("aprv.data.apptype." + arrinfo[0]) + "]"
							});
							if (o._changed == '1') {
								stdiv = "<div class='item changed' title=\"" + ttl + "\" style='border-bottom: 1px solid #f5f5f5;'>"; // 데이터 변경사항이 있는경우 색상표기
							} else {
								stdiv = "<div class='item' title=\"" + ttl + "\" style='border-bottom: 1px solid #f5f5f5;'>";
							}

							_$item = stdiv + "<div class='category'><a>" + aptype + '</a></div>';
							_$item += "<div class='subject'><a>" + o._applinename + '</a></div>';
							_$item += "<div class='biz'><a><span data-type='profile' data-empno='" + o._authorempno + "' data-orgcode='" +
								o._authororgcode + "'><img src='" + $fn.getPath('weblib') + "/images/common/icon-namecard.svg' alt=''></span></a></div>";
							_$item += "<div class='date'><a>" + mdata + '</a></div>';
							_$item += '</div>';
							_$item = $(_$item);

							$(_$item).appendTo(_el).data({
								'applinedata': o._applinedata,
								'applinedata2': o._applinedata2,
								'unid': o['@unid'],
								'AppName': o._applinename,
								'dbpath': opt.appComCfg.ADBpath,
								'changed': o._changed,
								'changedlist': o._changedlist
							});

							_$item.on('click', function (e) {
								if (e.currentTarget === this) {
									$('div.active', $(this).parent()).removeClass('active');
									$(this).toggleClass('active');
								}
							});

							_$item.dblclick(function (e) {
								if (e.currentTarget === this) {
									var selVal = $(this).data();
									if (typeof (checkfnc) == "function") {
										if (checkfnc(selVal) == false) return;
									}
									_$dialog.close();
									selectcallback(selVal);
								}
							});

							/* BizCard 처리 */
							$("[data-type='profile']", _el).off('click').on('click', function () {
								$dwp.ui.bizcard.init($(this));
							});

						});
					},
					buttons: [{
						title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
						css: 'confirm',
						click: function (_$dialog) {
							var _de = _$dialog.element,
								_el = $('div.list', _de),
								obj = $('div.active', _el),
								selVal = {};
							if (obj.length != 1) {
								$fn.alert({ "msg": $fn.getCodeMsg("aprv.msg.019") });
								return;
							}
							selVal = $(obj).data();
							if (typeof (checkfnc) == "function") {
								if (checkfnc(selVal) == false) return;
							}
							_$dialog.close();
							selectcallback(selVal);
						}
					},
					{
						title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
						css: 'cancel',
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					],
					content: {
						url: $fn.getProxyUrl('/' + opt.appComCfg.ADBpath + '/' + _form + '?OpenForm' + _param)
					}
				});

			},

			//헤더를 옵션으로 처리시 결재라인 간략히 조회 - 2024.03.05 by dwlee
			DrawingSimpleLine: function ($doc, data) {
				var _el = $doc.element;
				var _aprno = 0;
				var _linestr = "";
				var _aprtype = $fn.getCodeMsg("aprv.data.apptype.AP");

				var _isparall = false;
				$.each(data, function (idx, _data) {
					if (_linestr != "") _linestr += " , ";

					_aprtype = $fn.getCodeMsg("aprv.data.apptype." + _data.apptype);
					if (_data.apptype == "AG_P") {
						if (_isparall == false) {
							_aprno += 1;
							_isparall = true;
						}
					} else {
						_aprno += 1;
						_isparall = false;
					}
					//_linestr += " [" + _aprtype + "] " + $fn.getCurLangMsg(_data.username) + "/"+$fn.getCurLangMsg(_data.duty) + "/" + $fn.getCurLangMsg(_data.orgname) + "("+_aprno+")";
					_linestr += " [" + _aprtype + "] " + $fn.getCurLangMsg(_data.username) + "(" + _aprno + ")";
				});
				$("[role='dwp_aprline_info']", _el).html(_linestr);
			}
		},
		com: {
			/*
						by mjkim 20250206 2단결재 본인 결재 방지
			*/
			req2validation: function ($doc, opt) {

				var _re = true;
				var _opt = $doc.options;
				var _el = $doc.element;

				if (_opt.appTcount == "1") {
					$fn.alert({ "msg": $fn.getCodeMsg("aprv.msg.req2validation") })
					_re = false;
				}
				return _re;
			},
			//모바일에서 휴가신청서 결재문서 작성 - 20241108 by mjkim
			newAprDoc_AF300_mo: function (opt) {
				_opt = $.extend({ link: "/dwp/aprv/com/aprvstart.nsf/wFrmApproveAF300_mo?OpenForm&FormCode=AF300", linktype: "PAGE", layer: "doc", subtype: "edit" }, opt);
				$dwp.core.mportal.loadPage(_opt);
			},
			//현재 접속자의 정보로 그룹명등을 체크 가능 - 2022.12.08 by dwlee
			isMemberInGroup: function (grpName) {
				var _rtn = false;
				var _rolelist = $fn.getCurUser().usernamelist;
				_rolelist = _rolelist.replace(/ /gi, "");
				var _rolearray = _rolelist.split(",");
				if ($.inArray(grpName, _rolearray) > -1) {
					_rtn = true;
				}
				return _rtn;
			},

			//결재 진행중 첨부 추가 - 2022.11.23 by dwlee
			aprAddAttach: function ($doc, opt) {
				var _opt = $.extend({}, { count: 1 }, opt);
				$fn.dialog(null, {
					title: "첨부 추가",
					width: 800,
					height: 400,
					refdata: $doc,
					modal: true,
					hide: { effect: 'fade', duration: 300 },
					show: { effect: 'fade', duration: 300 },
					buttons: [
						{
							title: "확인", // 닫기
							css: 'confirm',
							click: function (_$dialog) {
								var _addAttAll = [];
								var _detachList = [];

								$.each($("input[name='detach_files']", _$dialog.element), function (i, v) {
									_addAttAll.push($(this).val());
									if ($(this).is(":checked")) _detachList.push($(this).val());
								});

								var _del = _$dialog.element;
								saveopt = {
									actiontype: "save",
									docstatus: "reg",
									isnotblock: true,				//저장 및 발송할 때 ui-block 처리하지 않음
									callback: function (_jdata) {
										if (_jdata.hasOwnProperty("result")) {
											if (_jdata.result >= "200" && _jdata.result < "300") {
												if (_jdata.msgcode == "success") {
													// 파일명 중복체크
													var _nAttList = (_jdata.attName == "" ? [] : _jdata.attName.split(";"));
													var _isDup = false;
													$.each(_nAttList, function (i, v) {
														$.each(_addAttAll, function (j, w) {
															if (v == w) {
																_isDup = true;
															}
														})
													});
													if (_isDup) {
														$fn.alert({ msg: "추가첨부에 이미 동일한 파일명이 있습니다." });
														return false;
													}

													//결재 문서 업데이트....
													$("input[name='tmpMulti_Attach_Files']", $doc.element).xval(_jdata.attInfo);
													$("input[name='tmpMulti_Attach_SortFiles']", $doc.element).xval(_jdata.attName)
													$("input[name='tmpMulti_Attach_SortFilesSize']", $doc.element).val(_jdata.attSize);

													if ($(_detachList).size() > 0) {
														$("input[name='tmpMulti_Detach_Files']", $doc.element).val(_detachList.join(";"));
														_$div = $("#Multi_Attach_DIV", $doc.element);

														$.each(_detachList, function (i, v) {
															$('<input name="%%Detach" type="hidden" value="' + v + '"/>').appendTo(_$div);
														})
													}

													// 체크용 필드 추가 - 2021.09.15. jingi.kim
													// if ( typeof(_opt.validfieldname) != "undefined" ) {
													// 	var _$validInput = $("input[name='" + _opt.validfieldname + "']", $doc.element);
													// 	if ( _$validInput.size() > 0 ) {
													// 		_$validInput.xval("1");
													// 	}
													// }

													function savecallback(jdata, $doc) {




														if (jdata.result == '200') {
															//$doc.reload();
															//다이알로그 팝업이 일어나는 경우 추가 - 2021.08.19 by dwlee
															var _dopt = $doc.options
															_did = _dopt.did;
															if (_did != '') {
																var _dialog = $('#' + _did).xdialog('instance');
																_dialog.reload({ html: "", url: jdata.returnurl, data: {} });
															} else {
																$doc.reload();
															}
														} else {
															$fn.alert({
																msg: jdata.Error
															});
														}
													}

													//결재문서 저장 - 2021.06.21 by dwlee
													_$$.aprv.com.appdocsave($doc, {
														actiontype: "addsave"
														, callback: savecallback
													});
													_$dialog.close();

												}
											}
										}
									}
								};

								var _dopt = _$dialog.options;
								_$doc = $fn.getInstance('doc', "#" + _dopt.id);
								//console.log("_$doc : ", _$doc.options);			

								//다이알로그 창의 첨부양식 Save								
								_$doc.save(saveopt);
							}
						},
						{
							title: "취소", // 닫기
							css: 'cancel',
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					],
					content: {
						url: '/dwp/aprv/com/aprvmng.nsf/wFrmAttach?OpenForm'
						, data: {
							attcnt: _opt.count
							, odbpath: $doc.options.cdb.replace(/\/dwp/gi, "dwp")
							, ounid: $doc.options.unid
						}
					}
				});
			},

			//순차적으로 Validate 하는 함수 - 2022.10.05 by dwlee
			aprdocvalidate: function ($doc) {
				var _opt = $doc.options;
				var _rtn = true;

				// 결재선에 퇴직자 및 조직변경 여부 체크
				function aprvCheck() {
					if (!_opt.isedit) return true;
					if (_opt.docstatus != "draft") return true;

					var _getInfo = function (_p) {
						return $fn.getCurLangMsg(_p.username) + "/" + $fn.getCurLangMsg(_p.duty) + "/" + $fn.getCurLangMsg(_p.orgname);
					}
					var _LineData = _$$.aprv.line.LineData($doc);
					var _chkRet = true;
					var _changed = [];
					var _retired = [];

					console.log("_LineData ", _LineData)

					$.each(_LineData.ALL1, function (i, v) {
						var _cuser = $fn.getUserInfo(v.empno);
						var _comp1 = v.comcode + "/" + v.orgcode + "/" + v.poscode + "/" + v.dutycode;

						// 사용자 정보가 없으면 퇴직자
						if ($(_cuser).size() == 0) {
							_retired.push(_getInfo(v));
							_chkRet = false;
						} else {
							// 겸직정보까지 검색해서 맞는 데이터를 찾음
							var _isFind = false;
							$.each(_cuser, function (j, w) {
								var _comp2 = w.comcode + "/" + w.orgcode + "/" + w.poscode + "/" + w.dutycode;

								//console.log("_comp1 ", _comp1 )
								//console.log("_comp2 ", _comp2 )

								if (_comp1 == _comp2) _isFind = true;
							});
							if (!_isFind) {
								_changed.push(_getInfo(v));		// 조직변경
								_chkRet = false;
							}
						}
					});

					var _msg = "결재선에 변경내역이 존재합니다.<br>";
					if ($(_retired).size() > 0) { _msg += "퇴직자 : " + _retired.join(","); }
					if ($(_changed).size() > 0) { _msg += "<br>조직변경 : " + _changed.join(","); }

					if (!_chkRet) $fn.alert({ msg: _msg });

					return _chkRet;
				}

				function realvalidate() {
					var vchk = true;

					//결재시 사전 작업이 필요한 경우 필드 셋팅 - 2024.04.02
					if ($("input[name='sAppPreCheck']", $doc.element).size() > 0 && $("input[name='sAppPreCheck']", $doc.element).xval() == "1") {
						var _rtn = _$$.aprv.com.approvePreCheck($doc);
						if (_rtn == false) {
							return false;
						}
					}

					//보조 JS에서 저장함수 정의시...
					if (_opt.sDocStep == "1") {
						//팝업 띄워주기 - 시작
						if (_opt.subsave != '' && _opt.isedit) {
							vchk = eval(_opt.subsave)($doc, _opt);
							//return vchk;
							//2025.03.21 by dwlee
							if (vchk == false) {
								return false;
							}
						}
					} else {
						//보조 JS에서 2,3단계 Save Check
						//2,3단계 결재의 첫번째 결재시 Validation 함수 - 2022.05.23 by dwlee
						var _rtn = _$$.aprv.com._req23StepValidate($doc);
						if (_rtn == false) {
							return false;
						}
					}
					//1. validate 2. 결재선 체크
					var _LineData = _$$.aprv.line.LineData($doc);
					if (_$$.aprv.com.actvalidation($doc, _LineData)) {
						return false;
					}


					//출장보고서는 여기서 한번 Validation Check 가 필요 - 2025.03.20 by dwlee
					if (_opt.sDocStep == "1" && _opt.appCfg.FormAlias == "AF701") {
						if (_opt.isedit && _opt.docstatus == "draft") {
							vchk = $dwp.app.aprv_sub701.saveTripValid($doc, _opt);
							return vchk;
						}
					}

					return vchk;
				}
				if (!aprvCheck()) return false;

				//결재상신시 ERP 전처리 함수 - 2024.09.02
				/*
					URL   : https://hub.hwasung.com/aproval/chkAprvSts"
					- Param : "APRV_NO" -- Erp 전자결재 번호 { APRV_NO : '260' } 형태의 Json 으로 구성
					- Return : 성공시 { "result": { "msg": "", "code": "S" } }
								실패시 { "result": { "msg": "전자결재가 진행중이거나 완료된 문서는 상신할 수 없습니다.\n", "code": "E"  } }
				*/
				function erpValidate() {
					var _valid = true;
					var _$erp = $("input[name=ErpKey]", $doc.element);
					if (_$erp.size() < 1 || _$erp.xval() == "") return true;

					$fn.xAjax({
						url: "https://hub.hwasung.com/aproval/chkAprvSts",
						method: 'POST',
						dataType: 'json',
						async: false,
						cache: false,
						data: {
							"APRV_NO": _$erp.xval()
						},
					}).done(function (jsonData) {
						if (typeof jsonData == 'undefined') {
							$fn.alert({ msg: "ERP연동시 알수없는 오류가 발생하였습니다." });
							_valid = false;
						}
						if (jsonData.result.code == "E") {
							$fn.alert({ msg: jsonData.result.msg });
							_valid = false;
						}

					}).fail(function (req, error) {
						console.log(req.responseText + '\n' + error);

						$fn.alert({ msg: req.responseText + '\n' + error });
						_valid = false;
					});
					return _valid;
				}

				//결재상신시 ERP 연동 사전체크 - 2024.09.02 by dwlee
				//편집시에도 체크하도록 변경 - 2025.04.17 by dwlee
				if (_opt.isdraft) {
					//					if (!erpValidate()) return false;
					//공통함수의 함수를 사용 - 2024.09.09 by dwlee
					if (!_$$.aprv.com.erpValidate($doc)) return false;
				}

				_rtn = realvalidate();
				return _rtn;
			},

			//현재 결재ㅈ자와 관련된 모든 정보를 찾아서 리턴 - 2021.06.18 by dwlee
			getcurAprInfo: function (doc, opt) {
				var el = doc.element;
				var _copt = {
					"isapruser": false,
					"islast": false,
					"step": opt.sDocStep,
					"aprtype": "",
					"aprnum": "",
					"aprallnum": "",
					"apruser": "",
					"aprlist1": "",
					"aprlist2": "",
					"aprlist3": ""								//3단결재 추가 - 2024.03.29 by dwlee
				}
				//AP^1^S^ko:장준수,en:장준수,zh:장준수^96010270^장준수/96010270/iprovest^30000434^30000432^ko:부서장,en:부서장,zh:부서장^003080^ko:부장,en:부장,zh:부장^002150^00001000^ko:디지털솔루션부,en:디지털솔루션부,zh:디지털솔루션부^ko:교보증권,en:교보증권,zh:교보증권
				//병렬협조는 여러명인데 한명
				/*
				var _cur_full_list = $("input[name='sCurFullList']", el).xval();				
				_copt.aprlist1 = $("input[name='sAppList1']", el).xval();
				_copt.aprlist2 = $("input[name='sAppList2']", el).xval();

				//3단결재 - 2024.03.28 by dwlee
				_copt.aprlist3 = $("input[name='sAppList3']", el).xval();
				*/
				var _cur_full_list = _$$.aprv.com.getFld('sCurFullList', el);
				_copt.aprlist1 = _$$.aprv.com.getFld('sAppList1', el);
				_copt.aprlist2 = _$$.aprv.com.getFld('sAppList2', el);
				//3단결재 - 2024.03.28 by dwlee
				_copt.aprlist3 = _$$.aprv.com.getFld('sAppList3', el);

				var _cindex = "0";
				$.each(_cur_full_list.split(";"), function (idx, o) {
					var _o_vals = o.split("^");
					if (_o_vals[2] == "S") {
						if (_o_vals[5] == $fn.getCurUser().abnotesid) {
							_cindex = _o_vals[1];
							//console.log("useruseruser : ", $fn.getCurUser().abnotesid);
							_copt.isapruser = true;
							_copt.islast = false;
							_copt.aprtype = _o_vals[0].toString().trim();
							_copt.apruser = _o_vals[5];
						}
					}
				});
				//var _lineList = $("input[name='sAppList" + opt.sDocStep + "']", el).xval();
				var _linelist = _$$.aprv.com.getFld('sAppList' + opt.sDocStep, el);
				var _typnum = 0;
				var _lastnum = "0";
				$.each(_linelist.split(";"), function (idx, _info) {
					var _vals = _info.split("^");
					if (_vals[2] == "S") {
						_copt.aprallnum = _vals[1];
						//console.log("_copt.aprtype : ", _copt.aprtype + ":::" + _vals[0]);
						if (parseInt(_vals[1], 10) <= parseInt(_cindex, 10)) {
							if (_copt.aprtype == _vals[0].toString().trim()) {
								_typnum += 1;
							}
						}
						_lastnum = _vals[1];
					}
				});
				_copt.aprnum = _typnum + "";
				if (_cindex == _lastnum) {
					_copt.islast = true;
				}
				return _copt;
			},

			//결재 양식별 추가 수정내용 팝업 - 2021.06.18 by dwlee
			aprAddContent: function ($doc, dlopt) {
				$fn.dialog(null, {
					title: dlopt.title,
					width: dlopt.width,
					height: dlopt.height,
					refdata: { opt: dlopt, doc: $doc },
					modal: true,
					hide: { effect: 'fade', duration: 300 },
					show: { effect: 'fade', duration: 300 },
					buttons: [
						{
							title: "확인", // 닫기
							css: 'confirm',
							click: function (_$dialog) {
								var _del = _$dialog.element;
								function _saveParmData() {
									return {
										dataType: "json",
										data: "",
										success: function (jdata) {
											$.unblockUI();
											if (jdata.result == "200") {
												_$dialog.close();
												$fn.toast({ msg: "요청한 작업이 반영되었습니다." });
												//리프레쉬가 일어나야 함.
												if (dlopt.autorefresh == true) {
													//다이알로그 팝업이 일어나는 경우 추가 - 2021.08.18 by dwlee
													var _dopt = $doc.options
													_did = _dopt.did;
													if (_did != '') {
														var _dialog = $('#' + _did).xdialog('instance');
														_dialog.reload({ html: "", url: jdata.returnurl, data: {} });
													} else {
														$doc.reload();
													}
												}
											} else {
												$fn.alert({ msg: $fn.getCodeMsg(jdata.msgcode) });
												return false;
											}
										},
										error: function () {
											$.unblockUI();
										}
									};
								}

								if (!$fn.validate($("form", _del))) { return false; }

								//저장시 validate 옵션이 있다면....
								if (dlopt.hasOwnProperty("validate") && dlopt.validate != '') {
									var _vchk = eval(dlopt.validate)(_del);
									if (!_vchk) { return false; }
								}
								$fn.xAjaxSubmit($("form", _del), _saveParmData());

							}
						},
						{
							title: "취소", // 닫기
							css: 'cancel',
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					],
					content: { url: '/dwp/aprv/com/aprvmng.nsf/wFrmHtml?ReadForm' }
				});
			},


			//결재 수행전에 체크해야 하는 항목이 있는 경우 - 2024.04.02 by dwlee
			//보조 js에 선언이 되어 있어야 함.
			approvePreCheck: function ($doc) {
				var _opt = $doc.options;
				var _rtn = true;
				//결재상신 이외의 단계에서 결재 수행시 호출되는 Subdoc 함수
				if (_opt.appCfg.hasOwnProperty("preCheckFnc") && _opt.appCfg.preCheckFnc != "") {
					var _rtn = eval(_opt.appCfg.preCheckFnc)($doc);
					if (_rtn == false) {
						_rtn = false;
						return false;
					}
				}
				return _rtn;
			},

			//2단계,3단계의 첫번째 결재자가 결재 수행시 Validation 해야 하는 문서가 있는 경우 사용하기
			//위해서 만듦 - 2022.08.04 by dwlee
			_req23StepValidate: function ($doc) {
				var _opt = $doc.options;
				var _rtn = true;
				//결재상신 이외의 단계에서 결재 수행시 호출되는 Subdoc 함수
				if (_opt.sDocStep != "1" && _opt.appCcount == "0") {
					if (_opt.sDocStep == "2") {
						if (_opt.appCfg.hasOwnProperty("req2fnc") && _opt.appCfg.req2fnc != "") {
							var _rtn = eval(_opt.appCfg.req2fnc)($doc, _opt);
							if (_rtn == false) {
								_rtn = false;
								return false;
							}
						}
					} else if (_opt.sDocStep == "3") {
						if (_opt.appCfg.hasOwnProperty("req3fnc") && _opt.appCfg.req3fnc != "") {
							var _rtn = eval(_opt.appCfg.req3fnc)($doc, _opt);
							if (_rtn == false) {
								_rtn = false;
								return false;
							}
						}
					}
				}
				return _rtn;
			},

			_bookmarkProc: function ($doc) {
				var _me = this,
					_$bookmark = $("div[name='appbookmark']", $doc.element),
					_$bodylist = $('div.dwp-table-body', _$bookmark),
					_$rbodylist = $('div.bookmark-list', _$bookmark),
					_$inp = $("input[name='refdocs']", _$bookmark);

				if (_$bookmark.size() == 0) return;

				function _initload() {
					var _v = _$inp.val();
					if (_v == '') return;
					var _list = _v.split(';');

					$.each(_list, function (i, v) {
						var _vlist = v.split('`}'),
							_o = null;

						if (_vlist.length == 5) {
							_o = _me.getObjStr(_$$.aprv.line.PROP.DOCLINK_SAVE, v, '`}');
						} else {
							_o = _me.getObjStr(_$$.aprv.line.PROP.BOOKMARK_SAVE, v, '`}');
						}

						if ($doc.options.isedit) {
							_addItem(_o);
						} else {
							_readItem(_o);
						}
					});
				}

				function _resetVal() {
					var _rtn = [];
					$('div.dwp-row', _$bodylist).each(function () {
						var _o = $(this).data('_ROW_DATA');

						if (_o.hasOwnProperty('_openurl')) {
							_rtn.push(
								_me.getObjStr(_$$.aprv.line.PROP.DOCLINK_SAVE, _o, '`}').fullinfo
							);
						} else {
							_rtn.push(
								_me.getObjStr(_$$.aprv.line.PROP.BOOKMARK_SAVE, _o, '`}').fullinfo
							);
						}
					});

					if (_rtn.length > 0) {
						_$inp.val(_rtn.join(';'));
					} else {
						_$inp.val('');
					}
				}

				function _dblcheck(o) {
					var _rtn = false;
					$('div.dwp-row', _$bodylist).each(function (i, _obj) {
						var _o = $(this).data('_ROW_DATA');

						if (_o.hasOwnProperty('_openurl')) {
							if (o._openurl == _o._openurl) {
								_rtn = true;
								return false;
							}
						} else {
							if (o._runid == _o._runid && o._rdbpath == _o._rdbpath) {
								_rtn = true;
								return false;
							}
						}
						/*
									if (o._link != "") {
										if (o._link == _o._link) {_rtn = true; return false;}
									} else if (o._r_link != "") {
										if (o._r_link == _o._r_link) {_rtn = true; return false;}
									} else {
										if (o._runid == _o._runid && o._rdbpath == _o._rdbpath){ _rtn = true; return false;}
									}*/
					});
					return _rtn;
				}

				function _open(o) {
					var _url = '',
						_link = '';

					//console.log("================================================");
					//console.log("================================================");
					//console.log("o : ", o);
					//console.log("================================================");
					//console.log("================================================");

					if (o.hasOwnProperty('_link') && o._link !== '') {
						// 외부 및 사용자 입력 한 북마크
						_link = o._link;
						_link = _link.toLowerCase();
						if (_link.indexOf('http://') > -1 || _link.indexOf('https://') > -1) {
							_url = o._link;
						} else {
							_url = 'http://' + o._link;
						}
						$fn.winopenExt(_url, 'Book Mark', {});
					} else if (o.hasOwnProperty('_openurl') && o._openurl != '') {
						_url = o._openurl;

						function NewWindow(mypage, myname, w, h, scroll) {
							var winl = (screen.width - w) / 2;
							var wint = (screen.height - h) / 2;
							var settings = 'height=' + h + ',';
							settings += 'width=' + w + ',';
							settings += 'top=' + wint + ',';
							settings += 'left=' + winl + ',';
							settings += 'scrollbars=' + scroll + ',';
							settings += 'resizable=yes';

							var win = window.open(mypage, myname, settings);

							try {
								if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
							} catch (e) { console.log(e) };
						}

						//2024.12.19 by dwlee
						if (_url.indexOf("gw") > -1 && $doc.options.docstatus == "draft") {

							NewWindow(_url, "AprWin", "887", "800", "no");
							return;
						}

						//===========================================================================
						// TCC스틸 이후에 개발된 버전에서는 완료함에 독서가자 들어가도록 구성되어 있음
						// 타인에게 공유가 될 수 있으므로 권한없는 문서를 만들어서 Open하도록 처리
						// - 2020.08.04 by dwlee
						//===========================================================================		

						//그룹웨어 과거문서는 팝업 - 2024.12.19 by dwlee
						if (_url.indexOf("gw/") > -1 && $doc.options.docstatus != "draft") {
							var _rdbpath = _url.substring(0, _url.indexOf(".nsf") + 4);
							var _rdockey = _url.substring(_url.indexOf("vdockey") + 8, _url.indexOf("?"));
							$fn.xAjax({
								url: $fn.getProxyUrl("/dwp/aprv/com/aprvmng.nsf/wAgCmdGetProcess?openagent"),
								dataType: "json",
								async: false,
								cache: false,
								data: { actiontype: "findurl", Unid: _rdockey, Arg1: _rdbpath }
							}).done(function (data) {
								if (data.result == "200" && data.linkurl != "null") {
									//임시로 열어주는 문서는 북마크 및 link 버튼 제외 처리하도록 isshare 추가 - 2020.08.05 by dwlee
									if ($doc.options.ismobile == "1") {
										_url = "/" + data._rdbpath + "/wvopen_mo/" + data._rdockey + "?opendocument&isshare=0&ismobile=1";
									} else {
										_url = "/" + data._rdbpath + "/vdockey/" + data._rdockey + "?opendocument&isshare=0";
									}
									NewWindow(_url, "AprWin", "887", "800", "no");
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
									return;
								}
							});

						} else if (_url.indexOf("/aprv/") > 0 && $doc.options.docstatus != "draft") {
							var _rdbpath = _url.substring(0, _url.indexOf(".nsf") + 4);
							var _rdockey = _url.substring(_url.indexOf("vdockey") + 8, _url.indexOf("?"));

							$fn.xAjax({
								url: $fn.getProxyUrl(_rdbpath + "/wAgCmdGetProcess?openagent"),
								dataType: "json",
								async: false,
								cache: false,
								data: { actiontype: "findurl", Unid: _rdockey }
							}).done(function (data) {
								if (data.result == "200" && data.linkurl != "null") {
									//임시로 열어주는 문서는 북마크 및 link 버튼 제외 처리하도록 isshare 추가 - 2020.08.05 by dwlee
									if ($doc.options.ismobile == "1") {
										_url = "/" + data._rdbpath + "/wvopen_mo/" + data._rdockey + "?opendocument&isshare=0&ismobile=1";
									} else {
										_url = "/" + data._rdbpath + "/vdockey/" + data._rdockey + "?opendocument&isshare=0";
									}


									//과거 결재문서는 팝업으로 띄워야 함 - 2024.12.16 by dwlee
									if (data._rdbpath.indexOf("_gw") > 0) {
										//팝업창을 가운데 띄우는 함수 - 2024.11.29 by dwlee
										function NewWindow(mypage, myname, w, h, scroll) {
											var winl = (screen.width - w) / 2;
											var wint = (screen.height - h) / 2;
											var settings = 'height=' + h + ',';
											settings += 'width=' + w + ',';
											settings += 'top=' + wint + ',';
											settings += 'left=' + winl + ',';
											settings += 'scrollbars=' + scroll + ',';
											settings += 'resizable=yes';

											var win = window.open(mypage, myname, settings);

											try {
												if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
											} catch (e) { console.log(e) };

										}
										NewWindow(_url, "AprWin", "884", "800", "no");
									} else {
										//결재문서는 A4로 지정한 양식인 경우 기본 넓이에서는 스크롤바가 생기므로 보정처리 - 2020.08.04 by dwlee

										/*
												by mjkim 20250117 팝업으로 변경경				
										*/
										$fn.winopen($fn.getProxyUrl(_url), '', { width: "920" });


										/*
																				$fn.layerOpenDocument({
																					content: { url: $fn.getProxyUrl(_url) },
																					width: "920"
																				});
										*/
									}
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
									return;
								}
							});
						} else {
							//작성중인 상태에서는 그냥 띄워줘도 무방함
							_url = _url + '&ismobile=' + ($doc.options.ismobile ? '1' : '0');
							//결재문서는 A4로 지정한 양식인 경우 기본 넓이에서는 스크롤바가 생기므로 보정처리 - 2020.08.04 by dwlee

							/*
									by mjkim 20250117 팝업으로 변경경				
							*/
							$fn.winopen($fn.getProxyUrl(_url), '', { width: "920" });


							/*
														$fn.layerOpenDocument({
															content: { url: $fn.getProxyUrl(_url) },
															width: "920"
														});
							*/
						}
						//===========================================================================		

					} else {
						//한타이후의 버전에서는 아래 소스가 무용지물임 - 2020.08.04 by dwlee
						// 내부 북마크 문서
						if (o._applcode == 'aprv') {
							if ($doc.options.isbookmarkreaders) {
								// 결재라인 포함 , 공유자 인경우 열람권한 바로 부여.
								if ($doc.options.ismobile) {
									_url = o._rdbpath.replace(/\\/g, '/') + '/wvopen_mo/' + o._rdockey + '?opendocument';
								} else {
									_url = o._rdbpath.replace(/\\/g, '/') + '/vdockey/' + o._rdockey + '?opendocument';
								}
							} else {
								$fn.xAjax({
									url: o._rdbpath + '/wAgCmdGetProcess?openagent',
									dataType: 'json',
									async: false,
									cache: false,
									data: {
										actiontype: 'linkurl',
										Unid: o._runid
									}
								})
									.done(function (data) {
										if (data.result == '200' && data.linkurl != 'null') {
											if (data.permission != 'H0') {
												if ($doc.options.ismobile) {
													_url = o._rdbpath.replace(/\\/g, '/') + '/wvopen_mo/' + o._rdockey + '?opendocument';
												} else {
													_url = o._rdbpath.replace(/\\/g, '/') + '/vdockey/' + o._rdockey + '?opendocument';
												}
											} else {
												$fn.xAjax({
													url: data.linkurl,
													dataType: 'json',
													async: false,
													cache: false
												}).done(function (jdata) {
													if (jdata['@unid'] == '' || !jdata.hasOwnProperty('DocKey') || !jdata.hasOwnProperty('InDBPath')) {
														$fn.alert({
															msg: $fn.getCodeMsg('comm.msg.msg057')
														});
														return;
													}
													if ($doc.options.ismobile) {
														_url = '/' + jdata.InDBPath.replace(/\\/g, '/') + '/wvopen_mo/' + jdata.DocKey + '?opendocument';
													} else {
														_url = '/' + jdata.InDBPath.replace(/\\/g, '/') + '/vdockey/' + jdata.DocKey + '?opendocument';
													}
												});
											}
										} else {
											$fn.alert({ msg: $fn.getCodeMsg('comm.svrmsg.msg009') });
											return;
										}
									});
							}
						} else if (o._applcode == 'aprvone') {
							$fn.xAjax({
								url: '/' + o._rdbpath + '/wAgCmdGetProcess?openagent',
								dataType: 'json',
								async: false,
								cache: false,
								data: {
									actiontype: 'newlinkurl',
									Unid: o._runid
								}
							}).done(function (jdata) {
								$fn.xAjax({
									url: '/' + jdata._rdbpath + '/wAgCmdGetProcess?openagent',
									dataType: 'json',
									async: false,
									cache: false,
									data: {
										actiontype: 'linkurl',
										Unid: o._runid
									}
								}).done(function (data) {
									if (data.result == '200' && data.linkurl != 'null') {
										if ($doc.options.isbookmarkreaders) {
											// 결재라인 포함 , 공유자 인경우 열람권한 바로 부여.
											if ($doc.options.ismobile) {
												_url = '/' + data._rdbpath.replace(/\\/g, '/') + '/wvopen_mo/' + data._rdockey + '?opendocument';
											} else {
												_url = '/' + data._rdbpath.replace(/\\/g, '/') + '/vdockey/' + data._rdockey + '?opendocument';
											}
										} else {
											// console.log("aaa",data);
											if (data.permission != 'H0') {
												if ($doc.options.ismobile) {
													_url = '/' + data._rdbpath.replace(/\\/g, '/') + '/wvopen_mo/' + data._rdockey + '?opendocument';
												} else {
													_url = '/' + data._rdbpath.replace(/\\/g, '/') + '/vdockey/' + data._rdockey + '?opendocument';
												}
											} else {
												$fn.xAjax({
													url: data.linkurl,
													dataType: 'json',
													async: false,
													cache: false
												}).done(function (jdata2) {
													if (jdata2['@unid'] == '' || !jdata2.hasOwnProperty('DocKey') || !jdata2.hasOwnProperty('InDBPath')) {
														$fn.alert({
															msg: $fn.getCodeMsg('comm.msg.msg057')
														});
														return;
													}
													if ($doc.options.ismobile) {
														_url = '/' + jdata2.InDBPath.replace(/\\/g, '/') + '/wvopen_mo/' + jdata2.DocKey + '?opendocument';
													} else {
														_url = '/' + jdata2.InDBPath.replace(/\\/g, '/') + '/vdockey/' + jdata2.DocKey + '?opendocument';
													}
												});
											}
										}
									} else {
										$fn.alert({ msg: $fn.getCodeMsg('comm.svrmsg.msg009') });
										return;
									}
								});
							});
						} else {
							if (o.hasOwnProperty('_r_link') && o._r_link != '') {
								_url = o._r_link;
							} else {
								if ($doc.options.ismobile) {
									_url = o._rdbpath + '/wvopen_mo/' + o._runid + '?opendocument';
								} else {
									_url = o._rdbpath + '/0/' + o._runid + '?opendocument';
								}
							}
						}
						_url = _url + '&ismobile=' + ($doc.options.ismobile ? '1' : '0');

						/*
								by mjkim 20250117 팝업으로 변경경				
						*/
						$fn.winopen($fn.getProxyUrl(_url), '', {});


						/*
												$fn.layerOpenDocument({
													content: { url: $fn.getProxyUrl(_url) }
												});
						*/
					}
				}

				function _addItem(o) {
					if (_dblcheck(o)) return;
					var _h = '',
						_$row = $("<div class='dwp-row dwp-cursor'></div>").appendTo(
							_$bodylist
						);
					_$row.data('_ROW_DATA', o);

					var _category = $fn.getCurLangMsg(
						o.hasOwnProperty('_sformtitle') ? o._sformtitle : o._rsformtitle
					);

					//var _category = (o.hasOwnProperty('_formname') ? o._formname : "-");

					/* UI 변경작업 - 2024.05.13 by dwlee
					_h = "<div class='dwp-cell'><div class='dwp-checkbox textless'><label>";
					_h += "<input type='checkbox' class='dwp-chk'><span></span>";
					_h += '</label></div></div>';
					*/

					//UI 변경작업 - 2024.05.13 by dwlee
					_h = "<div class='dwp-cell'><div class='dwp-checkbox textless'>";
					_h += '<a class="btn-docdel"><span class="dwp-icon-cancel dwp-bold" title="delete"></span></a>';
					_h += '</div></div>';

					_h += "<div class='dwp-cell'>" + _category + '</div>';
					_h += "<div class='dwp-cell'>" + (o.hasOwnProperty('_docnumber') ? o._docnumber : o._rdocnumber) + '</div>';
					//_h += "<div class='dwp-cell'>" + (o.hasOwnProperty('_docno') ? o._docno : "-") + '</div>';
					_h += "<div class='dwp-cell dwp-left' align='left'>&nbsp;&nbsp;&nbsp;&nbsp; " + o._subject + '</div>';

					_$row.append(_h);


					//UI변경으로 인하여 로직 추가 - 2024.05.13 by dwlee
					//단일 삭제
					$("a.btn-docdel", _$row).off('click').on('click', function () {
						$fn.confirm({
							msg: $fn.getCodeMsg('comm.msg.delete')
						}).done(function () {
							_$row.remove();
							_resetVal();
						});
					});


					$('.dwp-cell', _$row).not(':eq(0)').off('click').on('click', function () {
						_open(o);
					});

					_resetVal();
				}

				function _readItem(o) {
					// console.log("o",o);

					var _h = '',
						_$row = $("<div class='dwp-row dwp-cursor'></div>").appendTo(
							_$bodylist
						);
					_$row.data('_ROW_DATA', o);
					var _category = $fn.getCurLangMsg(o.hasOwnProperty('_sformtitle') ? o._sformtitle : o._rsformtitle);
					//var _category = (o.hasOwnProperty('_formname') ? o._formname : "-");

					_h += "<div class='dwp-cell'>" + _category + '</div>';
					_h += "<div class='dwp-cell' style='width:250px;'>" + (o.hasOwnProperty('_docnumber') ? o._docnumber : o._rdocnumber) + '</div>';
					//_h += "<div class='dwp-cell'  style='width:250px;'>" + (o.hasOwnProperty('_docno') ? o._docno : "-") + '</div>';
					_h += "<div class='dwp-cell dwp-left'>&nbsp;&nbsp;&nbsp;&nbsp;" + o._subject + '</div>';

					_$row.append(_h);

					$('.dwp-cell', _$row).off('click').on('click', function () {
						_open(o);
					});
				}

				if ($doc.options.isedit) {
					var _com_code = $fn.getCurUser().pinfo.comcode;
					$dwp.ui.button($('div.left.button', _$bookmark), {
						buttons: [{
							//title: $fn.getCodeMsg('comm.title.js006'),
							//title: "관련근거 첨부",
							title: $fn.getCodeMsg('comm.title.addbookmark'), //관련근거 첨부 - 2024.05.13 by dwlee
							click: function () {
								var _h = $fn.getScreenInfo().doc_h * 0.9;

								//보관함도 관련근거로 추가할 수 있도록 수정 - 2020.08.20 by dwlee
								function _loadSettingConts(tabid, _$dialog) {
									if (tabid == "dwp-tabs-done-content") {

										$('#dwp-tabs-done-content', _$dialog.element).html('');
										$('#dwp-tabs-archive-content', _$dialog.element).html('');
										$fn.xAjax({
											type: "GET",
											url: $fn.getProxyUrl('/' + $doc.options.appComCfg.LDBP1 + "/wFrmViewJ_Sel?ReadForm&tabid=dwp-tabs-done-content&did=" + _$dialog.options.id + "&lnbid=W3411&view=wViwList32&single=" + _com_code + "&count=10&use=att"),
											success: function (data, textStatus, xhr) {
												$('#' + tabid, _$dialog.element).html(data);
												$dwp.core.lang.convert({ isedit: true }, $('#' + tabid, _$dialog.element));
											},
											error: function (xhr, status, e) {
											}
										});

									} else if (tabid == "dwp-tabs-archive-content") {

										var _dbpath = $doc.options.appComCfg.KLDBP1;
										_dbpath = _dbpath.replace(/YYYY/gi, "cyear");
										/*
											mjkim 20210421 분기별 처리 경로 변경
										*/
										_dbpath = _dbpath.replace(/QT/gi, "quarter");

										$('#dwp-tabs-done-content', _$dialog.element).html('');
										$('#dwp-tabs-archive-content', _$dialog.element).html('');

										$fn.xAjax({
											type: "GET",
											url: $fn.getProxyUrl('/' + _dbpath + "/wFrmViewJ_Sel?ReadForm&tabid=dwp-tabs-archive-content&did=" + _$dialog.options.id + "&lnbid=W3411&view=wViwList32&single=" + _com_code + "&count=10&use=att"),
											success: function (data, textStatus, xhr) {
												$('#' + tabid, _$dialog.element).html(data);
											},
											error: function (xhr, status, e) {
											}
										});
									}
								}


								var _html = '<div class="dwp-gnb-setting-dialog">';
								_html += '<div class="dwp-tabs-simple">';
								_html += '<ul>';
								_html += '<li gubun="done"><a href="#dwp-tabs-done-content">' + $fn.getCodeMsg('aprv.title.done') + '</a></li>';
								_html += '<li gubun="archive"><a href="#dwp-tabs-archive-content">' + $fn.getCodeMsg('aprv.title.archive') + '</a></li>';
								_html += '</ul>';
								_html += '<div class="dwp-tabs-done-content" id="dwp-tabs-done-content"></div>';
								_html += '<div class="dwp-tabs-archive-content" id="dwp-tabs-archive-content"></div>';
								_html += '</div>';
								_html += '</div>';

								$dwp.ui.dialog.init(null, {
									show: { effect: "fade", duration: 300 },
									hide: { effect: "fade", duration: 300 },
									width: 1130,
									/*	
																		by mjkim 20241221 높이조정
																		height: 720,
									*/
									height: 760,

									modal: true,
									title: $fn.getCodeMsg('aprv.title.basis'),
									content: { html: _html, data: {} },
									islangconvert: false,
									initcallback: function (_$dialog) {
										var _$tab = $(".dwp-gnb-setting-dialog .dwp-tabs-simple", _$dialog.element);
										_$tab.tabs({ active: 0 });

										_loadSettingConts('dwp-tabs-done-content', _$dialog);

										_$tab.find('ul li').each(function () {
											var _self = this;
											$(_self).off().on('click', function () {
												var gubun = "setting";
												gubun = $(_self).attr("gubun");
												_loadSettingConts('dwp-tabs-' + gubun + '-content', _$dialog);
											});
										});
									},
									buttons: [{
										title: $fn.getCodeMsg('comm.btn.confirm'),
										click: function (_$dialog) {
											var element = _$dialog.element.view('instance');
											$.each(element.getChecked(), function (i, o) {
												_addItem(o);
											});
											_$dialog.close();
										}
									},
									{
										title: $fn.getCodeMsg('comm.btn.cancel'),
										click: function (_$dialog) {
											_$dialog.close();
										}
									}
									]
								});





							}
						},
							//UI 변경으로 삭제 처리 - 2024.05.13 by dwlee
							/*
							{
								title: $fn.getCodeMsg('comm.btn.deldoc'),
								click: function () {
									var _$checked = $("input[type='checkbox'].dwp-chk:checked", _$bodylist);
									if (_$checked.size() == 0) return;
									$fn.confirm({
										msg: $fn.getCodeMsg('comm.msg.msg023')
									}).done(function () {
										_$checked.parents('div.dwp-row').remove();
										$("input[type='checkbox'].dwp-check-all", _$bookmark).prop('checked', false);
										_resetVal();
									});
								}
							}
							*/
						]
					});

					//UI 변경으로 삭제처리 - 2024.05.13 by dwlee
					/*
					// 전체 선택박스 체크 시
					$("input[type='checkbox'].dwp-check-all", _$bookmark).off('click').on('click', function () {
						if ($(this).is(':checked')) {
							$("input[type='checkbox'].dwp-chk", _$bodylist).prop('checked', true);
						} else {
							$("input[type='checkbox'].dwp-chk", _$bodylist).prop('checked', false);
						}
					});
					*/

					//UI변경으로 인하여 로직 추가 - 2024.05.13 by dwlee
					//전체 삭제
					$("a.btn-docalldel", _$bookmark).off('click').on('click', function () {
						var _$checked = $("a.btn-docdel", _$bodylist);
						if (_$checked.size() == 0) return;
						$fn.confirm({
							msg: $fn.getCodeMsg('comm.msg.alldelete')
						}).done(function () {
							_$checked.parents('div.dwp-row').remove();
							_resetVal();
						});
					});
				}

				_initload();
			},
			// 관리자 지정양식 선택
			SelectFormEditorHtml: function ($doc, key) {
				var _el = $doc.element,
					_opt = $doc.options,
					_url = $fn.getProxyUrl('/' + _opt.appComCfg.AdminDraftTemplateDBpath + '/vwcode/' + key + '/Body?OpenField');

				var callback = function (_bodydata) {
					if ($('#bodyFld', _el)[0] != undefined) {
						//수정요망
						$dwp.ui.weditor.setHtmlValue(_bodydata, _el);
					}
				};

				$fn.cmdPost(_url, '', callback, 'html');
			},
			select_wareceiver: function ($doc) {
				var that = this,
					_opt = $doc.options;
				//console.log("_opt::", _opt);
				$fn.dialog(null, {
					title: $fn.getCodeMsg('aprv_mng.title.h144'),
					width: 340,
					height: 320,
					docInstance: $doc,
					modal: true,
					hide: { effect: 'fade', duration: 300 },
					show: { effect: 'fade', duration: 300 },
					buttons: [{
						title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
						css: 'cancel',
						click: function (_$dialog) {
							_$dialog.close();
						}
					}],
					//,content : {url : "/" + _opt.appComCfg.DraftTemplateDBpath + "/wFrmView_Sel?ReadForm", data : {view : "wv02_created_des", single : $fn.getCurUser().pinfo.orgcode, count:15,iscategory:false}}
					content: {
						url: '/dwp/aprv/com/aprvmng.nsf/wFrmWAReceiverList?ReadForm',
						data: {
							formcode: _opt.appCfg.FormAlias
						}
					}
				});
			},

			//현장정보 삭제 - 2024.09.03 by dwlee
			deletespot: function ($doc) {
				var _el = $doc.element;
				$("input[name=ProjectCode]", _el).xval("");
				$("input[name=BuildSiteCode]", _el).xval("");
				$("input[name=BuildSiteName]", _el).xval("");
			},

			//현장정보 선택 - 2024.09.03 by dwlee
			selectspot: function ($doc) {
				var _data = {
					view: "wusercateview",
					restricttocategory: $fn.getCurUser().pinfo.mailid,
					count: 15,
				}
				var _opt = $doc.options;
				//에디터별 서식선택 보기 유동적 호출 처리 - 2023.05.11
				var _el = $doc.element;
				$fn.dialog(null, {
					title: $fn.getCodeMsg('aprv.title.selectspot'),
					width: 600,
					height: 360,
					docInstance: $doc,
					modal: true,
					hide: { effect: 'fade', duration: 300 },
					show: { effect: 'fade', duration: 300 },
					content: {
						url: '/dwp/com/sys/spot.nsf/wFrmView?ReadForm',
						data: _data
					}
				});

			},

			//금액별 전결권한 체크 시작===========================================================================
			// code 에서 연속된 첫번째 숫자들만 추출하여 10진수로 전환하여 반환
			extractNumber: function (code) {
				var match = code.match(/\d+/);
				return match ? parseInt(match[0], 10) : null;
			},

			// targetCode 와 data (결재라인 데이터) 의 dutycode를 비교하여 작거나 같은 값이  있는지 확인 : true 이면 해당 targetCode 보다 직책이 높거나 같은 것임.
			dutycodeCompare: function ($doc, targetCode) {
				const data = _$$.aprv.line.LineData($doc);
				const targetNum = _$$.aprv.com.extractNumber(targetCode);
				var _rtn = false;
				$.each(data.ALL1, function (i, v) {
					const dutyCode = v.dutycode;
					const dutyNum = _$$.aprv.com.extractNumber(dutyCode);
					if (dutyNum !== null && dutyNum <= targetNum) {
						_rtn = true;
					}
				});
				return _rtn;
			},

			//금액별 전결권한 코드에서 금액과 직책코드를 구분하여 금액을 비교하고 해당 코드의 직책과 다국어를 반환함.
			getCodeFromAmount: function (rawAmount) {
				const obj = $dwp.core.lang.getCodeData("AP0001.GP0013");
				// 쉼표 제거 후 숫자로 변환
				const amount = parseInt(String(rawAmount).replace(/,/g, "").trim(), 10);

				// 객체 키에서 금액과 코드 추출 (타입 없음)
				const entries = Object.keys(obj)
					.map(key => {
						const [valueStr, code] = key.split("_");
						return {
							value: parseInt(valueStr),
							code,
							key,
							description: obj[key] // 다국어 설명
						};
					})
					.sort((a, b) => a.value - b.value); // 금액 기준 오름차순 정렬

				// 조건 1: 금액이 가장 낮은 값 이하일 경우
				if (amount <= entries[0].value) {
					return {
						code: entries[0].code,
						description: entries[0].description
					};
				}

				// 조건 2: 금액이 가장 높은 값 초과일 경우
				if (amount > entries[entries.length - 1].value) {
					return {
						code: entries[entries.length - 1].code,
						description: entries[entries.length - 1].description
					};
				}

				// 조건 3: 중간 범위에서 적절한 코드 찾기
				for (let i = 0; i < entries.length - 1; i++) {
					if (amount > entries[i].value && amount <= entries[i + 1].value) {
						return {
							code: entries[i + 1].code,
							description: entries[i + 1].description
						};
					}
				}
				return null;
			},
			//금액별 전결권한 체크 종료===========================================================================


			//전결번호 선택 - 2024.09.02 by dwlee
			selectdecidenum: function ($doc) {
				var _el = $doc.element;
				var _opt = $doc.options;
				var _junnum = $("input[name=ArbiDeciNum]", _el).xval();
				var _junver = $("input[name=ArbiDeciNumVersion]", _el).xval();

				var _data = {};
				if (_junnum == "") {
					_data = {
						view: "wruleview",
						version: _junver,
						detail: "",
						count: 80,
					}
				} else {
					var _junarr = _junnum.split("-");
					if (_opt.docstatus == "complete") {
						_data = {
							view: "wrulecatedoneview",
							restricttocategory: _junarr[0],
							detail: _junnum,
							version: _junver,
							count: 80,
						}
					} else {
						_data = {
							view: "wrulecateview",
							restricttocategory: _junarr[0],
							detail: _junnum,
							version: _junver,
							count: 80,
						}
					}
				}

				var _opt = $doc.options;
				//에디터별 서식선택 보기 유동적 호출 처리 - 2023.05.11
				var _el = $doc.element;
				$fn.dialog(null, {
					title: $fn.getCodeMsg('aprv.title.decide_title'),

					/*
										width: 1500,
										height: 835,
					*/

					width: 862,
					height: 575,

					docInstance: $doc,
					modal: true,
					hide: { effect: 'fade', duration: 300 },
					show: { effect: 'fade', duration: 300 },
					content: {
						url: '/dwp/aprv/com/rules.nsf/wFrmView?ReadForm',

						/*
						data: {
							view: "wruleview",
							count: 80,
						}
						*/
						data: _data
					}
				});
			},

			// 서식 선택
			selecttemplate: function ($doc) {
				var _opt = $doc.options;

				//에디터별 서식선택 보기 유동적 호출 처리 - 2023.05.11
				var _el = $doc.element;
				var _editor = "webeditor";
				var _viewname = 'wv02_created_des';
				//한글에디터인지......
				var _$editorFld = $("input[name='curWebEditor']", _el);				//한글 웹 기안기를 위해서 신규로 추가한 필드
				if (_$editorFld.size() > 0 && _$editorFld.xval() != "") {
					_editor = _$editorFld.val();
					if (_editor == "hwpeditor") {
						_viewname = 'hv02_created_des';
					}
				}

				$fn.dialog(null, {
					title: $fn.getCodeMsg('aprv.btn.b0011'),
					width: 800,
					height: 640,
					docInstance: $doc,
					modal: true,
					hide: { effect: 'fade', duration: 300 },
					show: { effect: 'fade', duration: 300 },
					//,content : {url : "/" + _opt.appComCfg.DraftTemplateDBpath + "/wFrmView_Sel?ReadForm", data : {view : "wv02_created_des", single : $fn.getCurUser().pinfo.orgcode, count:15,iscategory:false}}
					content: {
						url: '/' + _opt.appComCfg.DraftTemplateDBpath + '/wFrmView_Sel?ReadForm',
						data: {
							view: _viewname,
							count: 15,
							single: $fn.getCurUser().pinfo.orgcode,
							iscategory: false
						}
					}
				});
			},
			// 서식 저장
			savetemplate: function ($doc) {
				// console.log("$doc",$doc);
				var _opt = {};
				_dbpath = $doc.options.appComCfg.DraftTemplateDBpath;

				//에디터별 서식선택 보기 유동적 호출 처리 - 2023.05.11
				var _el = $doc.element;
				var _editor = "webeditor";
				//한글에디터인지......
				var _$editorFld = $("input[name='curWebEditor']", _el);				//한글 웹 기안기를 위해서 신규로 추가한 필드
				if (_$editorFld.size() > 0 && _$editorFld.xval() != "") {
					_editor = _$editorFld.val();
				}

				_opt = {
					url: '/' + _dbpath + '/wFrm01?OpenForm&editor=' + _editor,		//파라미터로 에디터 정보 추가 - 2023.05.02 by dwlee
					title: '',
					width: _editor == "_editor" ? 900 : 1180,
					height: _editor == "_editor" ? 550 : 920
				};

				//한글은 에디터 중복 문제로 팝업으로 띄움 - 2023.05.11 by dwlee
				if (_editor == "hwpeditor") {
					$fn.winopen(_opt.url, "", _opt)
				} else {
					$fn.dialog(null, {
						modal: true,
						docInstance: $doc,
						title: _opt.title,
						width: _opt.width,
						height: _opt.height,
						hide: { effect: 'fade', duration: 300 },
						show: { effect: 'fade', duration: 300 },
						buttons: [],
						content: { url: _opt.url }
					});
				}
			},

			readrequestprocess: function (_data) {
				// console.log("readrequestprocess _data" ,_data);

				if (_data.hasOwnProperty('result')) {
					if (_data.result == '200') {
						$fn.toast({ msg: $fn.getCodeMsg('aprv.msg.006') });
						if (_data.hasOwnProperty('returnurl')) {
							$fn.loadPage({
								link: $fn.getProxyUrl(_data.returnurl),
								linktype: 'PAGE'
							});
						}
					} else {
						//error
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
					}
				} else {
					//error
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
				}
			},
			// 결직자 작성자 정보 변경 처리
			authorchange: function ($doc, _data) {
				var _el = $doc.element;

				_data.appindex = '1';
				_data.apptype = 'AP';
				_data.type = 'S';
				_data.duty = _data.dutyname;
				_data.pos = _data.posname;
				_data.progcode = _data.porgcode;
				_data.username = _data.name;

				var setval = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.APP.TLIST, _data, '^', ';', _$$.aprv.line.PROP.APP.KEY),
					sAppList1 = _$$.aprv.com.getFld('sAppList1', _el).split(';');

				sAppList1[0] = setval.fullinfo;
				_$$.aprv.com.setFld('sAppList1', sAppList1.join(';'), _el);
			},
			appdocsave: function ($doc, opt) {

				var _opt = $doc.options,
					vchk = true,
					_actiontype = opt.actiontype;

				//임시저장,의견입력등에서 ValidationCheck 를 하지 않도록 변경 
				opt.applcode = "aprv";   //2024.11.08 by dwlee

				if (_opt.subsave != '' && _opt.isedit && !opt.ismig) {
					vchk = eval(_opt.subsave)($doc, opt);
				} else if (_opt.hasOwnProperty("sub" + _actiontype) && _opt["sub" + _actiontype] != '') {
					vchk = eval(_opt["sub" + _actiontype])($doc, opt);
				}

				if (vchk) {
					//결재선 변경시에는 메시지를 뿌려주지 않음 - 2025.01.06 by dwlee
					if (opt.actiontype == "admin_change_line") {
						opt.callback = function (data, _doc) {
							//다이알로그 팝업이 일어나는 경우 추가 - 2021.08.19 by dwlee
							var _dopt = _doc.options;
							_did = _dopt.did;
							if (_did != '') {
								var _dialog = $('#' + _did).xdialog('instance');
								_dialog.reload({ html: "", url: data.returnurl, data: {} });
							} else {
								_doc.reload();
							}
						}
					}
					$doc.save(opt);
				}
			},

			// 수발신문서 수신자 추가 4명부터 사용 by mjkim 20241214
			setreceive: function ($doc, sinfo) {

				var arrinfo = sinfo.split(";");
				var _org = null,
					_receive = ""
				var _receivelist = "";


				var _$receivedisp = $('div[name=receive_disp]', $doc.element);
				var _$setreceive = $('tr[name=setreceive]', $doc.element);



				if (arrinfo.length < 2) {
					return;
				}


				$.each(arrinfo, function (i, o) {
					_org = new $dwp.ui.org.data.org(o);

					_receive = $fn.getCurLangMsg(_org.oinfo.orgname) + "(" + $fn.getCurLangMsg(_org.oinfo.duty) + " " + $fn.getCurLangMsg(_org.oinfo.username) + ")";

					_receivelist += (_receivelist == "" ? _receive : "," + _receive);
				})

				if (arrinfo.length > 0) {
					if (_$receivedisp.size() > 0) {
						_$receivedisp.empty();
					}

					_$receivedisp.html(_receivelist);

					_$receivedisp.closest(".dwp-section").css("display", "");
					_$setreceive.css("display", "none")
				}


			},

			//중간결재자 편집시 저장모듈 - 2024.09.05 by dwlee
			versionsave: function (doc) {
				var _me = this;
				var el = doc.element;
				_h = "<table>";
				_h += "<colgroup><col style='width: 100px'><col></colgroup>";
				_h += "<tbody>";
				_h += "<tr><th>" + $fn.getCodeMsg("aprv.title.versiontitle") + "</th>"; //수정내용
				_h += "<td><div class='dwp-input expended'><input name='title'></div></td></tr>";
				_h += "</tbody>";
				_h += "</table>";
				var _buttons = [
					{
						"title": $fn.getCodeMsg("aprv.btn.confirm") //수정내용 입력
						, "css": "confirm"
						, "click": function (obj) {
							var did = obj.options.id;
							var _title = $("input[name='title']", "#" + obj.options.id).xval();
							if (_title == "") {
								$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.reason") });	//수정사유를 입력하세요.
								return;
							}
							$("input[name='sVersionTitle']", el).xval(_title);

							obj.close();

							_me.appdocsave(doc, {
								actiontype: 'versave',
								callback: _$$.aprv.com.savecallback
							});

						}
					}
					, {
						"title": $fn.getCodeMsg("aprv.btn.cancel")
						, "css": "cancel"
						, "click": function (obj) {
							obj.close();
						}
					}];

				$fn.dialog(el, {
					modal: true
					, resizable: false
					, draggable: true
					, title: $fn.getCodeMsg("aprv.title.versioinput") //수정내용 입력
					, width: 800
					, height: 450
					, show: 'fade'		//effect
					, hide: 'fade'		//effect
					, buttons: _buttons
					, content: { html: _h }
				});
			},

			// 자동완성 처리
			autocomplete: function ($doc, fn, seltype, callback) {
				var _me = this,
					_$sel = $('select', _me.element),
					$org = $dwp.ui.org,
					_stxtlist = $dwp.core.lang.getCodeMsg('comm.data.org_stype'),
					_dsel = '',
					_opt = {
						autoFocus: true,
						minLength: 2,
						position: {
							my: 'left top',
							at: 'left bottom',
							collision: 'flipfit'
						},
						source: function (request, response) {
							var _data = {
								q: request.term,
								cc: $fn.getCurUser().pinfo.comcode
							};

							function _getType(type) {
								switch (type) {
									case '0':
										return 'p,d';
										break;
									case '2':
										return 'p';
										break;
									case '1':
										return 'd';
										break;
								}
							}

							_data.type = _getType(seltype);

							$.getJSON('/dwprts/quicksearch', _data, function (data) {
								var _response = [];
								$.each(data.response.org, function (i, o) {
									o.type = 'B';
									var _item = $org.data.qsConvert(o),
										_org = new $org.data.org(_item);
									_response.push({
										label: _org.getDispName(),
										value: _item
									});
								});
								$.each(data.response.person, function (i, o) {
									o.type = 'S';
									var _item = $org.data.qsConvert(o),
										_org = new $org.data.org(_item);

									_response.push({
										label: _org.getDispName(),
										value: _item
									});
								});
								response(_response);
							});
						},
						response: function (event, ui) { },
						focus: function (event, ui) {
							return false;
						},
						select: function (event, ui) {
							//	console.log("select",ui);
							var _item = [],
								_orgdata;
							_orgdata = ui.item.value;

							_item.data = [];

							//console.log("_orgdata",_orgdata);

							_item.data.type = _orgdata.type;
							_item.data.key = _orgdata.key;
							_item.data.orgdata = _orgdata;

							if (typeof callback == 'function') {
								callback($doc, _item, fn);
							}
							//	$("input[name='"+fn+"']", _me.element).val("");

							return false;
						}
					};

				$dwp.ui.autocomplete.init($("input[name='" + fn + "']", _me.element), _opt);

				// console.log('_autocomplete complete : '+fn)
			},
			setFld: function (fld, val, el) {
				$('input[name=' + fld + ']', el).val(val);
				return;
			},
			getFld: function (fld, el) {
				return $('input[name=' + fld + ']', el).val();
			},
			arrayclean: function (obj, deleteValue) {
				for (var i = 0; i < obj.length; i++) {
					if (obj[i] == deleteValue) {
						obj.splice(i, 1);
						i--;
					}
				}
				return obj;
			},
			refreshpage: function (jdata, $doc) {
				var _opt = $doc.options,
					_did = _opt.did,
					_isportal = _opt.isportal,
					_isaprvportal = _opt.isaprvportal;

				console.log("refreshpage _opt", _opt)
				//$fn.toast({ msg: $fn.getCodeMsg('aprv.msg.006') });

				if (_did != '') {
					var _dialog = $('#' + _did).xdialog('instance');

					if (_isaprvportal) {
						$fn.loadPage({
							link: $fn.getProxyUrl(_opt.mngdb + '/wFrmAprvHome?ReadForm'),
							linktype: 'PAGE'
						});
					}
					_dialog.close();
				} else if (_opt.islegacy) {
					// console.log("_opt.legacyurl : ", _opt.legacyurl);

					location.replace(_opt.legacyurl);
				} else if (_opt.ispopup) {
					// 2022-06-12 By LHJ Error Fix
					if ((jdata.hasOwnProperty('actiontype') && jdata.actiontype == 'redraft') || jdata.actiontype == 'draft') {
						$fn.winopen(jdata.returnurl);
					} else {
						// 부모창의 목록을 새로고침해야하는 경우 추가. 22.07.22
						if (opener) {
							var _view = opener.$fn.getInstance("view")
							if (_view) {
								var _page = _view.options.page;
								if ((_view.options.total - 1) < ((_view.options.page - 1) * _view.options.ps + 1)) {
									_page = _page - 1;
								}
								if (_page < 1) { _page = 1; }
								_view.reload({ page: _page });
								$fn.lnbCountRefresh();
								// $fn.toast({ msg: (_opt.softdel ? $fn.getCodeMsg("comm.msg.msg003") : $fn.getCodeMsg("comm.msg.msg004")) });
							} {
								//부모창 화면이 view가 아닌 경우 스킵
							}
						}
					}
					window.close();
				} else {
					if (jdata.returnurl == 'view') {
						//_opt.ispreview
						//jdata.
						//$.extend({type:"", unid:"", viewreload : false}, opt)

						if (_opt.ispreview) {
							// console.log("미리보기 체크가 된 경우...");

							var _newopt = {
								type: 'del',
								unid: '',
								viewreload: true
							};

							$doc.goview(_newopt);
						} else {
							$doc.goview();
						}
					} else {
						//console.log('jdata.returnurl : ', jdata.returnurl);
						/*
												by mjkim 2024222 미리보기 기능 추가 
												if ((jdata.hasOwnProperty('actiontype') && jdata.actiontype == 'redraft') || jdata.actiontype == 'draft') {
						*/
						if (jdata.returnurl.toLowerCase().indexOf('?opendocument') > -1 || jdata.returnurl.toLowerCase().indexOf('?editdocument') > -1) {
							if ((jdata.hasOwnProperty('actiontype') && jdata.actiontype == 'redraft') || jdata.actiontype == 'draft' || jdata.actiontype == 'preview') {
								$fn.loadPage({
									link: $fn.getProxyUrl(jdata.returnurl),
									linktype: 'PAGE'
								});
							} else if (jdata.actiontype == 'save' || jdata.actiontype == 'comment') {
								if ($doc.options.ispreview) {
									$doc._previewLoadPage({
										url: jdata.returnurl
									});
								} else {
									$fn.loadPage({
										link: $fn.getProxyUrl(jdata.returnurl),
										linktype: 'PAGE'
									});
								}
							} else if (jdata.actiontype == 'receive') { //접수일때 접수대기문서를 relaod하면 안되고 접수문서로 이동해야한다. by noh
								$fn.loadPage({
									link: $fn.getProxyUrl(jdata.returnurl),
									linktype: 'PAGE'
								});
							} else if (jdata.actiontype.toLowerCase() == 'recall') { //기안자 회수일때는 작성함으로 가야됨elaod하면 안되고 접수문서로 이동해야한다. by noh
								$fn.loadPage({
									link: $fn.getProxyUrl(jdata.returnurl),
									linktype: 'PAGE'
								});
							} else {
								$doc.reload();
							}
						} else {
							//결재문서는 결재 수행 후 보기에서 사라지므로...
							var _newopt = {
								type: 'del',
								unid: '',
								viewreload: true
							};
							$doc.goview(_newopt);
						}
						/*
									$fn.loadPage({link : $fn.getProxyUrl(jdata.returnurl), linktype : "PAGE"});
									*/
					}
				}

				//if ((typeof(portalHandler) == "function")) {	//포탈 상단 결재카운트 업데이트
				//	portalHandler.GNB.getAprvCnt();
				//}
				/* 2022-05-27 Layout 변경 Fix
				$fn.xTrigger($('div.dwp-icon-menu'), 'GnbCountRefresh', {
					type: 'aprv'
				});
				*/
				$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "aprv" });

				// 포틀릿 업데이트하기				
				/* 2022-05-27 업데이트 방식 변경 Trigger
				var _$mportal = $('div.dwp-main-portal');
				if (_$mportal.size() > 0 && !_$mportal.hasClass('dwp-hidden')) {
					var _portlet = $('div.dwp-portlet-zone #P0002', _$mportal).portlet(
						'instance'
					);
					if (_portlet != undefined) {
						_portlet.reload();
					}
				}
				*/
				$fn.xTrigger($("div.xware-portal-body"), "PortletRefresh", { type: "2" });
			},
			//연속 결재인지 체크하는 로직 - 2020.10.05 by dwlee
			continueproc: function (jdata, $doc) {
				var _opt = $doc.options;

				var _lsname = "dwp-apr-unids";
				var _unids = $fn.getLocalStorage(_lsname);

				//로컬스토리지 리셋
				localStorage.removeItem(_lsname);

				//console.log("_opt is ", _opt);

				//연속결재이면...
				if (_unids != null && _unids != "") {
					var _unidarr = _unids.split(";");
					var _unid = _unidarr[0];
					_unidarr.shift();
					if (_unidarr.length > 0) {
						$fn.setLocalStorage(_lsname, _unidarr.join(";"));
					}
					$fn.xAjax({
						//url :  $fn.getProxyUrl("/"+_opt.appComCfg.INGLEDBPath+ "/wAgCmdGetProcess?openagent")
						url: $fn.getProxyUrl("/" + _opt.appComCfg.RLDBpath + "/wAgCmdGetProcess?openagent"),
						dataType: "json",
						async: false,
						cache: false,
						data: { actiontype: "getdockey", Unid: _unid }
					}).done(function (data) {
						if (data.result == "200" && data.dockey != "") {
							var _url = "/" + data.dbpath + "/vdockey/" + data.dockey + "?OpenDocument&iscontinue=1";
							$fn.loadPage({ link: $fn.getProxyUrl(_url), linktype: "PAGE" });
						} else {
							$fn.alert({ msg: $fn.getCodeMsg("comm.svrmsg.msg009") });
							return;
						}
					});
				} else {
					_$$.aprv.com.refreshpage(jdata, $doc);
				}
			},
			//결재승인의 콜백함수
			savecallback: function (jdata, $doc) {

				var _opt = $doc.options,
					_did = _opt.did,
					_isportal = _opt.isportal,
					_isaprvportal = _opt.isaprvportal;

				console.log("결재콜백시작")
				console.log("_opt", _opt)
				console.log(_opt.appCfg.Other)
				/*SAP 필드 정의
				if(_opt.appCfg.Other == "YES"){
					 // 양식 프로파일 SHARE 연동 처리 Y 표시 된 것만 진행 
					 //프로그램 코드,guid,resurl 여기서 호출해야 양식내 필드 값 가져올수 있어서 여기 선언
					var __misdb;
					var __misid;
					
					if(_opt.isnew){
						console.log("편집")
						__misdb=$("[name=MISLogDBPath]").val()
						__misid=$("[name=MISDocID]").val()
					
						
					}else{
						console.log("읽기")
						__misdb=misLogDBPath 
						__misid=misDocID 
						
						
					}
				}
				*/



				//=================================================================================
				//			협업에서 결재문서를 바로 팝업으로 호출한 경우에만 아래와 같이 처리
				//				결재문서 상태값을 협업으로 넘김 - 2024.11.08 by dwlee
				//=================================================================================		
				function _getColParam() {
					var _url = location.href;
					_url = _url.replace(/%26/gi, "&");
					var _param = $fn.getUrlPaser(_url);
					var _iscolpop = false; //협업에서 호출한 경우 
					if (_param.hasOwnProperty("colpop") && _param.colpop == "1") {
						_iscolpop = true;
					}
					return _iscolpop;
				}
				if (_getColParam() == true) {
					var _caller = (window.parent !== window ? parent : window.opener);
					if (_caller) {
						jdata.applcd = "aprv";
						_caller.postMessage(jdata, $fn.getSysinfo().xcworkhost);
						if (window.parent !== window) {
							//iframe의 경우 postMessage 수신쪽에서 close()
						} else {
							window.close();
						}
						return;
					}
				}
				//=================================================================================
				//=================================================================================	

				//ERP 연동 문서는 상신,임시저장시에는 창 닫음 - 2024.09.09 by dwlee
				var _curLoc = window.location.href;
				if (_curLoc.indexOf("ErpDocID") > 0) {
					//의견을 넣는 경우에는 창을 reload 하여 처리 - 2024.10.29
					if (jdata.hasOwnProperty("actiontype") && jdata.actiontype == "comment") {

						//ERP 호출되는 양식에서 의견을 추가하는 경우에 창을 닫는 상황이 발생하여 보정 처리 - 2024.10.30 by dwlee
						//URL 에 ErpDocID 값이 있어야 하므로 의견 저장시 편집문서로 열어주면서 URL을 추가하여 문서가 저장되면 창이 닫히도록 구성함
						//https://devgw.hwasung.com/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=dwp/aprv/com/aprvstart.nsf/wFrmApprove?openform&FormCode=GW_ERP053&_=1730196200308%26popup=1
						//==> ERP에서 호출되는 URL
						var _formurl = _curLoc.substring(_curLoc.indexOf("FormCode=") - 1, _curLoc.length);
						location.replace("/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=" + jdata.returnurl + _formurl);
					} else {
						//"actiontype":"comment"
						window.close();
					}
					return;
				}

				if (jdata.result == '400') {
					if (jdata.hasOwnProperty("returnurl") && jdata.returnurl !== "") {
						$fn.loadPage({
							link: $fn.getProxyUrl(jdata.returnurl),
							linktype: 'PAGE'
						});
					}
					$fn.alert({
						msg: $fn.getCodeMsg($fn.getCodeMsg(jdata.msgcode))
					});
					return false;
				}

				if (jdata.hasOwnProperty('returnmsgcode')) {
					$fn.toast({ msg: $fn.getCodeMsg(jdata.returnmsgcode) });
					return false;
				}

				//다음 결재문서의 리스트를 찾아오자... -- 향후 보완                

				if (jdata.hasOwnProperty('returnurl')) {
					if (jdata.hasOwnProperty('update')) {
						var update = jdata;
						update.actiontype = 'linkupdate';
						// 링크 생성 /업데이트/삭제 처리
						$fn.xAjax({
							url: $fn.getProxyUrl('/' + _opt.appComCfg.IngDBpath + '/wcmdpost?createdocument'),
							method: 'POST',
							dataType: 'json',
							data: update,
							async: true,
							cache: false
						}).done(function (data) {
							// console.log("처리",data);
							//연속결재인 경우 - 2020.10.05 by dwlee
							if (_opt.continueapr.isset == "1") {
								_$$.aprv.com.continueproc(jdata, $doc);
							} else {
								//다음 결재문서가 있으면 연속결재 할것인지 confirm 수행 ... -- 향후 보완
								_$$.aprv.com.refreshpage(jdata, $doc);
							}
						}).fail(function (req, error) {
							//console.log(req.responseText + '\n' + error);
							if (_opt.continueapr.isset == "1") {
								_$$.aprv.com.continueproc(jdata, $doc);
							} else {
								//다음 결재문서가 있으면 연속결재 할것인지 confirm 수행 ... -- 향후 보완
								_$$.aprv.com.refreshpage(jdata, $doc);
							}
						});
					} else {
						if (_opt.continueapr.isset == "1") {
							_$$.aprv.com.continueproc(jdata, $doc);
						} else {
							//다음 결재문서가 있으면 연속결재 할것인지 confirm 수행 ... -- 향후 보완
							_$$.aprv.com.refreshpage(jdata, $doc);
						};
					}
				}

				//SAP 업데이트
				/*
				if(_opt.appCfg.Other == "YES"){
					console.log("erp 업데이트 양식 " + _opt.appCfg.Other )
					console.log($doc);
					console.log(_opt)
					console.log(_opt.appComCfg.DataPath)
					console.log($doc.options.appdockey)
					
					
					var moveurl = "/dwp/com/erp/mismain.nsf/agUpdateERPStatus?OpenAgent"
						moveurl = moveurl + "&DBPath="+__misdb
						moveurl = moveurl +"&DocID="+__misid
						moveurl = moveurl +"&CDBPath="+$doc.options.cdb
						moveurl = moveurl + "&ApprDocID=" +$doc.options.appdockey

						console.log(moveurl)
					var hiddenIframe = document.createElement('iframe');

					hiddenIframe.style.display = 'none'; // 아예 안 보이게
					hiddenIframe.style.width = '0';      // 너비 0
					hiddenIframe.style.height = '0';     // 높이 0
					hiddenIframe.style.border = 'none';  // 테두리도 없어라!
					hiddenIframe.id = 'hiddenProcessorFrame'; // 나중에 참조할 ID (옵션)
					document.body.appendChild(hiddenIframe);
					hiddenIframe.src = moveurl;
					

				}
				*/

			},
			/**
				   문자열정보를 객체로 변환
				   @param {string}	Propery Map	ex) key^name
				   @param {string}	Data
				   @param {string}	Data 구분자
				   @param {string}	Data 멀티 구분자 값 설정 시, 배열 Object를 반환함
				   @param {string}	Data Key
				   @return {object}	Data Object Or Array Data Object
				  */
			getObjStr: function (map, data, sp, msp, key, replace) {

				var _sp = sp || '^',
					_prop = map.split(_sp);

				function _getobjstr(sdata) {
					var _o = {},
						_data = sdata.split(_sp);
					$.each(_prop, function (idx, _p) {
						if (idx > _data.length - 1) {
							// 추가
							_o[_p] = '';
						} else {
							_o[_p] = $.trim(_data[idx]);
						}
					});
					if (key != '') {
						_o.fullinfo = $.trim(sdata);
						_o.key = _o[key];
					}
					return _o;
				}

				function _getobjobj(data) {
					var _o = {},
						_fullinfo = '';
					$.each(_prop, function (idx, _p) {
						_o[_p] = typeof data[_p] != 'undefined' ? data[_p] : '';
						_fullinfo = _fullinfo + (idx == 0 ? _o[_p] : _sp + _o[_p]);
					});
					if (key != '') {
						_o.fullinfo = _fullinfo;
						_o.key = data[key];
					}

					return _o;
				}

				if (typeof data == 'string') {
					if (typeof msp != 'undefined' && msp != '') {
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
			actionProcess: function (_$dialog, doc) {
				/* Dialog에서 선택된 수행을 처리 한다. */
				var de = _$dialog == null ? null : _$dialog.element;
				var el = doc.element,
					_opt = doc.options;
				var cmt = '',
					scmt = '',
					action = '';

				/*
					mutual_disagree, mutual_reject, reject, stop : 의견이 반드시 들어가야 함.				
				*/

				if (de == null) {
					console.log("de 가 없을 때")
					cmt = $('textarea[name=sTmpComment]', el).val();
					_cmt = cmt.split('†');
					if (_cmt.length > 6) {
						cmt = _cmt[6].replace(/\n|\r/g, '<br>').replace(/ /g, '&nbsp;');
						//보안의견 항목 추가
						if (_cmt.length > 7) {
							scmt = cmt + '†' + _cmt[7];
						} else {
							scmt = cmt + '†';
						}
					}
					var _act = _$$.aprv.com.getActionObject(doc);
					action = Object.keys(_act)[0];
				} else {
					console.log("de 가 있을 때")
					cmt = $('textarea[name=stmpComment]', de).val();

					//보안의견 항목 추가
					if ($("input[name='isSecurity']:checked", de).size() > 0) {
						scmt = cmt + '†y';
					} else {
						scmt = cmt + '†';
					}

					//조건부 승인 항목 추가 - 2024.11.19 by dwlee
					if ($("input[name='isCondition']:checked", de).size() > 0) {
						scmt = scmt + '†y';
					} else {
						scmt = scmt + '†';
					}

					action = $(':radio[name="actions"]:checked', de).val();
				}

				if ((action == "reject" || action == "mutual_rject") && cmt == "") {
					//alert("반려 의견을 입력하여주세요"); //
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.reject_memo') });
					return;
				}

				if (action == "mutual_disagree" && cmt == "") {
					//alert("비동의 의견을 입력하여주세요"); //aprv.msg.disagree_memo
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.disagree_memo') });
					return;
				}

				if (action == "stop" && cmt == "") {
					//alert("보류 의견을 입력하여주세요"); //aprv.msg.stop_memo
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.stop_memo') });
					return;
				}

				// 평가점수 확인 및 설정
				if (_opt.isevaluation & (_opt.docstatus != 'mutualwait')) {
					if (de == null) {
						var evaluation = $('input[name=ActEvaluation]', el).val();
						if (evaluation == '') {
							$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.033') });
							return false;
						}
					} else {
						var evaluation = $(':radio[name="evaluation"]:checked', de).val();
						if (typeof evaluation == 'undefined') {
							$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.033') });
							return false;
						}
						_$$.aprv.com.setFld('ActEvaluation', evaluation, el);
					}
				}

				// G.CEO 전결시 협조는 무조건 의견을 10자  이상 입력 받음.
				//if ( _opt.isGCEO & (action == "mutual" || action == "mutual_reject") & (cmt.length < 10) ){
				//	$fn.alert({msg : $fn.getCodeMsg("aprv.msg.009")});
				//	return false;
				//}

				// 반려 or 부동의시 의견을 10자  이상 입력 받음.
				//if ((action == "reject" || action == "mutual_reject") & (cmt.length < 10) ){
				//	$fn.alert({msg : $fn.getCodeMsg("aprv.msg.009")});
				//	return false;
				//}

				var _data = _$$.aprv.line.LineData(doc); // 모든 결재자 정보
				cmt = cmt.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");

				//서면결재 확인시 데이터 처리 시작 - 2025-10-13 by wsjung==========================================
				//console.log("_data===========", _data)
				//console.log("cmt============", cmt)
				//console.log("action==========", action)

				_applinedata = _$$.aprv.line.getapplinedata(doc, _data);

				//console.log("_applinedata==========", _applinedata)

				if (action == "paperagree") {
					for (var i = 0; i < _applinedata.length; i++) {
						var o = _applinedata[i];
						var _fix = o.pstep + '_' + o.apptype + '_' + o.appindex;
						var _cmt = $('textarea[name=stmpComment' + _fix + ' ]', de).val();
						if (typeof (_cmt) != 'undefined') {
							_cmt = _cmt.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
							_tmpD = $('input[name=aprvDate' + _fix + ' ]', de).val();
							_tmpH = $('select[name=aprvH' + _fix + ' ]', de).val();
							_tmpM = $('select[name=aprvM' + _fix + ' ]', de).val();
							_tmpS = $('select[name=aprvS' + _fix + ' ]', de).val();
							_m = moment(_tmpD + " " + _tmpH + ":" + _tmpM + ":" + _tmpS, "YYYY-MM-DD HH:mm:ss");
							_tmphistory = "paperagree^" + _m.format() + "^" + o.notesid + "^" + o.username + "^" + o.empno + "^" + o.orgcode + "^Y^^^";
							_tmpcmt = "paperagree†" + o.empno + "†" + o.orgname + "†" + o.pos + "†" + o.username + "†" + _m.format() + "†" + _cmt + "††";

							//paperagree^2025-10-10T15:49:33+09:00^Weng Karen/P00302/KBWS^ko:Weng Karen,en:Weng Karen,zh:Weng Karen^P00302^B00002^Y^^^
							//console.log("sPaperHistory 추가용=========", _tmphistory)
							//paperagree†P00125†ko:IT,en:IT,zh:IT†ko:책임매니저,en:Senior Manager,zh:책임매니저†ko:사지연,en:Sa jiyeon,zh:Sa Ji-yeon†2025-10-10T15:49:32+09:00†ddddddd††
							//console.log("sPaperComment 추가용 =========", _tmpcmt)

							_prehis = $("input[name=sPaperHistory" + o.pstep + "]", el).xval();
							if (_prehis == "") {
								_$$.aprv.com.setFld('sPaperHistory' + o.pstep, _tmphistory, el);
							} else {
								_$$.aprv.com.setFld('sPaperHistory' + o.pstep, _prehis + ";" + _tmphistory, el);
							}

							_precmt = $("input[name=sPaperComment" + o.pstep + "]", el).xval();
							if (_precmt == "") {
								_$$.aprv.com.setFld('sPaperComment' + o.pstep, _tmpcmt, el);
							} else {
								_$$.aprv.com.setFld('sPaperComment' + o.pstep, _precmt + "¶" + _tmpcmt, el);
							}
						}
					}
				}
				//서면결재 확인시 데이터 처리 종료=============================================================================

				var appinfohtml = _$$.aprv.line.DrawingMailAppinfo(_$$.aprv.line.getapplinedata(doc, _data), action, cmt);
				//console.log("appinfohtml==========",appinfohtml);
				$('textarea[name=TmpsAppinfo]', el).val(appinfohtml);
				$('textarea[name=TmpsComment]', el).val(scmt);
				//this.setFld("AprActionType",action,el);

				//console.log("appinfohtml----------------",$("textarea[name=TmpsAppinfo]",el).val().length);
				if ($('textarea[name=TmpsAppinfo]', el).val().length > 25000) {
					$('textarea[name=TmpsAppinfo]', el).val('');
				}

				_$$.aprv.com.appdocsave(doc, {
					actiontype: action,
					docstatus: action,
					callback: _$$.aprv.com.savecallback
				});
				//doc.save({actiontype : action, docstatus : action,callback:_$$.aprv.com.savecallback});

				if (_$dialog != null) {
					_$dialog.close();
				}
			},

			actions: {
				raise: $fn.getCodeMsg('aprv.actions.raise'),
				reraise: $fn.getCodeMsg('aprv.actions.reraise'),
				agree: $fn.getCodeMsg('aprv.actions.agree'),
				decide: $fn.getCodeMsg('aprv.actions.decide'),
				raisedecide: $fn.getCodeMsg('aprv.actions.decide'),
				stop: $fn.getCodeMsg('aprv.actions.stop'),
				reject: $fn.getCodeMsg('aprv.actions.reject'),
				recall: $fn.getCodeMsg('aprv.actions.recall'),
				recall2: $fn.getCodeMsg('aprv.actions.recall2'),
				recall3: $fn.getCodeMsg('aprv.actions.recall3'),
				raiserecall3: $fn.getCodeMsg('aprv.actions.recall3'),
				reqmutual: $fn.getCodeMsg('aprv.actions.reqmutual'),
				raisereqmutual: $fn.getCodeMsg('aprv.actions.reqmutual'),
				mutual: $fn.getCodeMsg('aprv.actions.mutual'),
				mutual_reject: $fn.getCodeMsg('aprv.actions.mutual_reject'),

				//서면결재 2025-10-01 by wsjung
				paperagree: $fn.getCodeMsg('aprv.actions.paperagree'),

				//동의/비동의 - 2024.08.22 by dwlee
				mutual_agree: $fn.getCodeMsg('aprv.actions.mutual_agree'),
				mutual_disagree: $fn.getCodeMsg('aprv.actions.mutual_disagree'),

				receive: $fn.getCodeMsg('aprv.actions.receive'),
				receive_reject: $fn.getCodeMsg('aprv.actions.receive_reject'),
				receive_cancel: $fn.getCodeMsg('aprv.actions.receive_cancel'),
				reception: $fn.getCodeMsg('aprv.actions.reception'),
				agree_delegate: $fn.getCodeMsg('aprv.actions.delegate'),
				mutual_delegate: $fn.getCodeMsg('aprv.actions.delegate'),
				read: $fn.getCodeMsg('aprv.actions.read'),
				post: $fn.getCodeMsg('aprv.actions.post'),
				audit: $fn.getCodeMsg('aprv.actions.agree')
			},
			getActions: function (arrAct) {
				var oobj = new Object();
				for (var i = 0; i < arrAct.length; i++) {
					if (typeof this.actions[arrAct[i]] != 'undefined') {
						oobj[arrAct[i]] = this.actions[arrAct[i]];
					}
				}
				return oobj;
			},
			getActionObject: function ($doc) {
				/* 문서 상태에 따라 결재 수행 Action을 판단 한다.
						결재 수행 라이오 버튼으로 선택 결과는 구조체 property 이름으로 결과가 나온다
						기본 선택 값 생략 가능 (생략 할때는 actions에 action과 동일 하게 사용)
						 */
				var _opt = $doc.options;
				var _applinedata = _$$.aprv.line.getapplinedata($doc, _$$.aprv.line.LineData($doc)); // 모든 결재자 정보
				//console.log("!@@@_opt",_opt.data.LineData.AP1.length);
				//console.log("opt.docstatus",_opt.docstatus);
				switch (_opt.docstatus) {
					case 'draft' /* 임시저장 또는 신규 작성 상태 */:
						// console.log("결재액션 설정",_applinedata);
						// 권한이 있는경우  전결/협조요청 지원
						if (_opt.isCurArbitaryList && _opt.OPT1 == 'YES') {
							if (_applinedata[0].apptype == 'AG_P') {
								if (_opt.data.LineData.AP1.length == 1) {
									result = this.getActions(['raisereqmutual']);
								} else {
									result = this.getActions(['raisereqmutual', 'raisedecide']);
									//result = this.getActions(["raisereqmutual"]);
								}
							} else {
								if (_opt.data.LineData.AP1.length == 1) {
									result = this.getActions(['raise']);
								} else {
									result = this.getActions(['raise', 'raisedecide']);
									//result = this.getActions(["raise"]);
								}
							}
						} else {
							result = this.getActions(['raise']);
						}
						//	console.log("result",result);
						break;
					case 'ing' /* 결재가 진행 중일때 */:
						// 마지막 결재자
						//console.log('전결');
						if (
							parseInt(_opt.appCcount, 10) + 1 ==
							parseInt(_opt.appTcount, 10)
						) {
							//console.log('1');
							//보류 추가 - 2024.03.29 by dwlee
							result = this.getActions(['agree', 'reject', 'stop']);
						} else {
							// 전걸 권한 체크
							//if (_opt.isCurArbitaryList && _opt.OPT9 == "YES"){
							//console.log('_opt.OPT9', _opt.appCfg.OPT9);
							if (_opt.appCfg.OPT9 == 'YES') {
								//console.log('2');

								//보류 추가 - 2024.03.29 by dwlee
								result = this.getActions(['agree', 'reject', 'decide', 'stop']);
							} else {
								//console.log('3');
								//보류추가 - 2024.03.29 by dwlee
								result = this.getActions(['agree', 'reject', 'stop']);
							}
						}
						break;
					case 'received':
						// 접수 상태
						if (_opt.isdraft) {
							if (_opt.isCurArbitaryList && _opt.OPT1 == 'YES') {
								if (_applinedata[0].apptype == 'AG_P') {
									if (_opt.data.LineData.AP1.length == 1) {
										result = this.getActions(['raisereqmutual']);
									} else {
										result = this.getActions(['raisereqmutual', 'raisedecide']);
										//result = this.getActions(["raisereqmutual"]);
									}
								} else {
									if (_opt.data.LineData.AP1.length == 1) {
										result = this.getActions(['agree']);
									} else {
										result = this.getActions(['agree', 'raisedecide']);
										//result = this.getActions(["raise"]);
									}
								}
							} else {
								result = this.getActions(['agree']);
							}
						} else {
							result = this.getActions(['agree', 'reject']);
						}

						break;
					case 'mutualwait' /* 협조요청대기 상태 */:
						result = this.getActions(['reqmutual', 'reject']);
						// console.log("result",result);
						break;
					case 'mutualing' /* 협조진행중 상태 */:
						//result = this.getActions(['mutual', 'mutual_reject']);

						//동의 비동의 인 경우 - 2024.08.22 by dwlee
						if (_opt.appCfg.AG_AUTH == "2") {
							result = this.getActions(['mutual_agree', 'mutual_disagree']);
						} else {
							/*
								20241230 mjkim 20241230 순차협조자 보류추가	
							*/

							if (_opt.data.LineData["ALL" + _opt.sDocStep][_opt.appCcount].apptype != "AG_P") {
								result = this.getActions(['mutual', 'mutual_reject', 'stop']);
							} else {
								result = this.getActions(['mutual', 'mutual_reject']);
							}
						}

						break;
					default:
						/* 기타 */
						result = null;
						break;
				}
				return result;
			},
			actvalidation: function (doc, _LineData) {
				var opt = doc.options,
					el = doc.element,
					appCfg = opt.appCfg,
					ArbitaryList = opt.ArbitaryList.split(', ');

				if (!$dwp.core.util.validator.validate($('form', doc.element))) {
					return true;
				}

				//임시로 ... By LeeHJ
				//return false;

				// 전결권한 체크
				/* 2017-08-21 By LeeHJ 사용안함.
						if ( opt.isdraft && $.inArray(_LineData.AP1[_LineData.AP1.length-1].dutycode,ArbitaryList) == -1 && appCfg.OPT1 == "NO" ){
							if ((appCfg.FormAlias == "AF777" || appCfg.FormAlias == "AF778") && opt.sDocStep =="1"){
								//console.log("통과")
							}else{
								$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.031') }); // 결재선을 확인하여 주십시요.					
								return true;
							}
						}
						*/
				if (opt.isdraft && !opt.isrevdoc && _LineData.ALL1.length == 1 && appCfg.OPT1 == 'NO') {
					if ((appCfg.FormAlias == "AF777" || appCfg.FormAlias == "AF778") && opt.sDocStep == "1") {
						//console.log("통과")
					} else {
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.031') }); // 결재선을 확인하여 주십시요.					
						return true;
					}
				}

				// 기안자 협조요청 권한 체크
				/* 2017-08-21 By LeeHJ 사용안함.
						if ( opt.isdraft & _LineData.AG1.length > 0 ) {
							if (_LineData.AG1[0].appindex == "1" & $.inArray(_LineData.AP1[0].dutycode,ArbitaryList) == -1 ) {
								$fn.alert({msg : $fn.getCodeMsg("aprv.msg.031")});  // 결재선을 확인하여 주십시요.
								return true;
							}
						}
						*/

				// 접수대기인 경우 체크안함
				if (opt.docstatus == 'receivewait') {
					return false;
				}

				// 협조자가 마지막 결재자인지 체크
				/*
								if (_LineData['ALL' + opt.sDocStep][_LineData['ALL' + opt.sDocStep].length - 1].apptype.indexOf('AG_') > -1) {
									$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.047') }); // 협조자가 마지막결재자일 수 없습니다.
									return true;
								}
				*/

				// 병렬렬협조자가 마지막 결재자인지 체크 20241224 BY MJKIM

				if (_LineData['ALL' + opt.sDocStep][_LineData['ALL' + opt.sDocStep].length - 1].apptype.indexOf('AG_P') > -1) {
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.069') }); // 병렬협조자는 마지막 결재자일 수 없습니다.
					return true;
				}

				if (appCfg.OPT5 == 'YES') {
					//2019.9.19 by Choo
					if (appCfg.OPT10 === "YES" && _$$.aprv.com.getFld('Circulation3Full', el) === '') {
						if (_$$.aprv.com.getFld('sRDocForm', el) == "R") { // 발신부서 문서일 경우
							$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.014') }); // 수신부서를 지정 하세요.
							return true;
						}
					}
				}

				if (appCfg.OPT5 == 'YES') {
					//2019.9.19 by Choo
					if (appCfg.OPT10 === "YES" && _$$.aprv.com.getFld('Circulation3Full', el) === '') {
						if (_$$.aprv.com.getFld('sRDocForm', el) == "R") { // 발신부서 문서일 경우
							$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.014') }); // 수신부서를 지정 하세요.
							return true;
						}
					}
				}
				/* 2017-08-21 By LeeHJ 주석처리
						if (appCfg.ProcessStep == "2" && _$$.aprv.com.getFld("sReceiveOrgName_Full",el) == ""){
							$fn.alert({msg : $fn.getCodeMsg("aprv.msg.015")});  // 주관부서를 지정 하세요.
							return true;
						}
						*/

				/*
				20241028 mjkim 주관부서 지정 오류 수정
				
								if (appCfg.ProcessStep == '2' && appCfg.OPT3 == 'YES' && _$$.aprv.com.getFld('Conduct', el) == '') {
									$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.015') }); // 주관부서를 지정 하세요.
									return true;
								}


				//3단계 주관부서 체크 - 2024.04.05 by dwlee
				if (appCfg.ProcessStep == '3' && appCfg.OPT3_3 == 'YES' && _$$.aprv.com.getFld('Conduct', el) == '') {
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.015') }); // 주관부서를 지정 하세요.
					return true;
				}
*/


				//2024.11.05
				//sDocStep == "1"
				//if (appCfg.ProcessStep == '2' && appCfg.OPT3 == 'YES' && _$$.aprv.com.getFld('Conduct', el) == '') {
				if (opt.sDocStep == '1' && appCfg.ProcessStep != '1' && appCfg.OPT3 == 'YES' && _$$.aprv.com.getFld('Conduct', el) == '') {
					if (appCfg.FormAlias == "AF777" || appCfg.FormAlias == "AF778") {
						//console.log("통과")
					} else {
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.015') }); // 주관부서를 지정 하세요.					
						return true;
					}
				}


				//2단결재 지정된 상태에서 필수 주관부서거 체크 되어 있으면 비교 - 2024.12.17 by dwlee 
				//주관부서는 하나의 부서
				//처리부서가 필수가 아니더라도 필수 부서에 있으면 일단 체크하도록 수정 - 2025.01.02 by dwlee
				if (!opt.ismobile & opt.sDocStep == '1' && appCfg.ProcessStep != '1' && (appCfg.hasOwnProperty("FixDutyDept") && appCfg.FixDutyDept != "")) {
					if (appCfg.FormAlias == "AF777" || appCfg.FormAlias == "AF778") {
						//console.log("통과")
					} else {
						//전표만 처리하면 됨
						if (appCfg.hasOwnProperty("OPT3_A") && appCfg.OPT3_A == "YES") {
							var _selinfo = $dwp.app.aprv.com.getFld('ConductFull', el);
							/*
												20241221 by mjkim 고정부서 설정 시 선택된 사용자의 부서정보와 비교하여 진행
							*/

	
							//OPT3_A
							var _selobj = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, _selinfo, '^', ';', 'notesid');
							var _fixobj = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.DEPT, appCfg.FixDutyDeptFull, '^', '', 'orgcode');

							//회계팀,자금팀은 1단 결재만 함 - 2025.01.02 by dwlee
							var _aprlist = $dwp.app.aprv.com.getFld('sAppList1', el);
							var _aprarr = _aprlist.split(";");
							var _myobj = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.APRV, _aprarr[0], '^', '', 'notesid');

							//================================================
							//기안부서가 회계,자금이면 2중 결재가 필요하지 않음 - 2025.01.02
							if (_myobj.orgcode == "hs1142" || _myobj.orgcode == "hs1145") {
							} else {
								if (_selinfo == "" || _selobj[0].orgcode != _fixobj.orgcode) {
									$fn.alert({ msg: $fn.getCurLangMsg(_fixobj.orgname) + $fn.getCodeMsg("aprv.msg.fixdept") });
									return true;
								}
							}
						}
					}				
				}


				//2024.11.05
				//sDocStep == "2"
				//3단계 주관부서 체크 - 2024.04.05 by dwlee

				//2024.11.05
				//if (appCfg.ProcessStep == '3' && appCfg.OPT3_3 == 'YES' && _$$.aprv.com.getFld('Conduct', el) == '') {
				if (opt.sDocStep == '2' && appCfg.ProcessStep == '3' && appCfg.OPT3_3 == 'YES' && _$$.aprv.com.getFld('Conduct', el) == '') {
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.015') }); // 주관부서를 지정 하세요.
					return true;
				}



				// 필수 협조자 체크하기(수신부서 인 경우는 ? To-Do)
				if (appCfg['AP_Code' + opt.sDocStep].indexOf('AG_') > -1 && appCfg['Agree' + opt.sDocStep] != '') {
					var _isFind = true;

					//기안자가 필수 협조자인지 여부 - 2020.07.24 by dwlee
					var _isReqAgree = false;
					var _curuser = $fn.getCurUser(); //현재 접속자
					var _keyList = appCfg['Agree' + opt.sDocStep].split(';');
					$.each(_keyList, function (i, v) {
						if (v.trim() == _curuser.abnotesid.trim()) {
							_isReqAgree = true;
							return false;
						}
					});

					//기안자가 필수 협조자인지 여부 - 2020.07.24 by dwlee
					if (_isReqAgree == false) {
						if (_LineData['AG' + opt.sDocStep].length == 0) {
							_isFind = false;
						} else {
							var _tKeyList = $.map(_LineData['AG' + opt.sDocStep], function (o, i) {
								return o.key;
							});

							//기안자가 필수 협조자인지 여부 - 2020.07.24 by dwlee
							//var _keyList = appCfg['Agree' + opt.sDocStep].split(';');
							$.each(_keyList, function (i, v) {
								if ($.inArray(v, _tKeyList) == -1) {
									_isFind = false;
									return false;
								}
							});
						}
					} else {
						_isFind = true;
					}

					if (!_isFind) {
						var _prop = 'Agree' + opt.sDocStep + 'Full';
						var _disp = '';
						if (appCfg.hasOwnProperty(_prop) && appCfg[_prop] != '') {
							var _vAgree = appCfg[_prop].split(';');
							_disp = $.map(_vAgree, function (v, i) {
								var _org = $fn.orgData(v);
								return _org.getDispName();
							}).join(', ');
						}
						$fn.alert({
							msg: $fn.getCodeMsg('aprv.msg.046') +
								(_disp != '' ? '<br>[' + _disp + ']' : '')
						}); // 필수협조자를 지정 하세요.
						return true;
					}
				}

				return false;
			},

			//공람 진행현황 조회 - 2023.03.28 by dwlee
			DisplayReadLog: function ($doc, $dialog) {
				var _el = $doc.element,
					_list = $dwp.app.aprv.com.getFld('DisplayFull', _el),
					_log = $dwp.app.aprv.com.getFld('DisplayReadInfo', _el),
					_de = $dialog.element,
					_$item = null,
					dlist = $('#displaylog', _de);
				var _html = "";

				//console.log("DisplayReadLog - 1");



				var _readkey = "userid^readtime^opinion";
				var _readers = _$$.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, _list, '^', ';', "notesid");
				var _readinfos = _$$.aprv.com.getObjStr(_readkey, _log, '^', ';', "userid");

				var _infos = [];
				$.each(_readers, function (j, subdata) {
					var _h = $.grep(_readinfos, function (b) {
						return b.userid == subdata.notesid;
					});
					if (_h.length == 1) {
						$.extend(true, subdata, _h[0]);
					} else {
						var _nopt = {
							"userid": subdata.notesid,
							"readtime": "",
							"opinion": ""
						}
						$.extend(true, subdata, _nopt);
					}
					_infos.push(subdata);
				});

				//console.log("_infos : ", _infos);

				/*
								<table>	
									<tr><th>분류</th><th>내용</th></tr>
									<tr><td>분류</td><td>내용</td></tr>
								</table>
				*/

				_html = "<table>";
				_html += "<colgroup><col width='35%'/><col width='20%'/><col width='45%'/></colgroup>";
				_html += "<tr><th>공람자</th><th>공람시간</th><th>공람의견</th></tr>";
				$.each(_infos, function (idx, _info) {
					var _dspname = $fn.getCurLangMsg(_info.orgname) + "/" + $fn.getCurLangMsg(_info.pos) + "/" + $fn.getCurLangMsg(_info.username);
					var _opinion = _info.opinion;
					_opinion = _opinion.replace(/¶/gi, "<br>");
					_html += "<tr></tr>";
					_html += "	<td class='dwp-center'>" + _dspname + "</td>";
					_html += "	<td class='dwp-center'>" + _info.readtime + "</td>";
					_html += "	<td class=''>" + _opinion + "</td>";
					_html += "</tr>";
				});
				_html += "<table>";
				//console.log("html : " , _html);

				dlist.append(_html);
			},


			// 열람자 추가처리 시, 기존로그 정보가져오기
			DelegationLoadLog_log: function ($doc, $dialog) {
				var _el = $doc.element,
					_opt = $doc.options,
					_log = _opt.DelegationData,
					_de = $dialog.element,
					dlist = $('#delegationlog', _de),
					hishtml,
					$org = $dwp.ui.org;

				if (_log.length == 0) {
					hishtml = "<div class='dwp-row'><div class='dwp-value'>" + $fn.getCodeMsg('aprv.msg.026') + '</div></div>';
					dlist.append(hishtml);
					return false;
				}

				hishtml = '';

				$.each(_log, function (idx, obj) {
					var tmpdata = obj.split('{`'),
						_item1 = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER + '^acttime', tmpdata[0], '^', ';', $dwp.app.aprv.line.PROP.APP.KEY)[0],
						_item2 = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, tmpdata[1], '^', ';', $dwp.app.aprv.line.PROP.APP.KEY),
						_item3 = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, tmpdata[2], '^', ';', $dwp.app.aprv.line.PROP.APP.KEY),
						_data1 = [],
						_data2 = [];

					$.each(_item2, function (in1, _tmpdata1) {
						if (_tmpdata1.empno != '') {
							_data1[in1] = $fn.getCurLangMsg(_tmpdata1.username) + '/' + $fn.getCurLangMsg(_tmpdata1.duty);
						}
					});

					$.each(_item3, function (in2, _tmpdata2) {
						if (_tmpdata2.empno != '') {
							_data2[in2] = $fn.getCurLangMsg(_tmpdata2.username) + '/' + $fn.getCurLangMsg(_tmpdata2.duty);
						}
					});

					if (_data1.length > 0) {
						hishtml += "<div class='dwp-row'><div class='dwp-value' style='word-spacing:4px;'>";
						hishtml += $fn.getCodeMsg('aprv.msg.028').replace('{$1}', $fn.getCurLangMsg(_item1.username) + '/' + $fn.getCurLangMsg(_item1.duty))
							.replace('{$2}', _data1).replace('{$3}', $fn.formatDateTime(_item1.acttime));
						hishtml += '</div></div>';
					}

					if (_data2.length > 0) {
						hishtml += "<div class='dwp-row'><div class='dwp-value' style='word-spacing:4px;'>";
						hishtml += $fn.getCodeMsg('aprv.msg.029').replace('{$1}', $fn.getCurLangMsg(_item1.username) + '/' + $fn.getCurLangMsg(_item1.duty))
							.replace('{$2}', _data2).replace('{$3}', $fn.formatDateTime(_item1.acttime));
						hishtml += '</div></div>';
					}
				});

				dlist.append(hishtml);
			},
			// 열람자 정보 가져오기
			DelegationLoadList_old: function ($doc, $dialog) {
				var _el = $doc.element,
					_list = $dwp.app.aprv.com.getFld('sDocReadersFull', _el),
					_de = $dialog.element,
					_$item = null,
					dlist = $('#delegationlist', _de),
					$org = $dwp.ui.org;

				// console.log("ddd", _list);

				function gethtml($dialog, data) {
					var html = '';
					html = "<div class='dwp-row'>";
					html += "<div class='dwp-value'>";
					html += "<div class='dwp-user'>";
					if (data.type == 'S') {
						html += "<div class='profile-info' data-type='profile' data-empno='" + data.empno + "' data-orgcode='" + data.orgcode + "'>";
						html += "<div class='name'>" + $fn.getCurLangMsg(data.username) + '</div>';
						html += "<div class='rank'>" + $fn.getCurLangMsg(data.duty) + '</div>';
						html += "<div class='team'>" + $fn.getCurLangMsg(data.orgname) + '</div>';
						html += '</div>';
					} else {
						html += "<div class='profile-info' data-empno='' data-orgcode='" + data.orgcode + "'>";
						html += "<div class='name'>" + $fn.getCurLangMsg(data.orgname) + '</div>';
						html += '</div>';
					}
					html += "<span class='btn-del'><img src='" + $fn.getPath('weblib') + "/images/common/icon-close.svg' alt=''></span>";
					html += '</div>';
					html += '</div>';
					html += '</div>';

					return $(html);
				}

				if (_list == '') {
					return false;
				}

				var obj = [];
				$.each(_list.split(';'), function (i, o) {
					// console.log("o",o)
					if (o.charAt(0) == 'S') {
						obj.push($dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, o, '^', '', $dwp.app.aprv.line.PROP.APP.KEY));
					} else {
						obj.push($dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.DEPT, o, '^', '', 'orgcode'));
					}
				});
				// console.log(obj);
				//var obj =  $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, _list , "^", ";" , $dwp.app.aprv.line.PROP.APP.KEY);

				$.each(obj, function (idx, _data) {
					_$item = gethtml($dialog, _data).appendTo(dlist).data('orgdata', _data).data('fullinfo', _data.fullinfo);

					$('.btn-del', _$item).on('click', function () {
						$(this).parent().parent().parent().remove();
					});
				});

				$("[data-type='profile']", dlist).off('click').on('click', function () {
					$dwp.ui.bizcard.init($(this));
				});
			},
			DelegationSave_old: function ($dialog, $doc) {
				var _me = this,
					_opt = $doc.options,
					el = $doc.element,
					de = $dialog.element,
					dlist = $('#delegationlist', de),
					_rtn = [];

				$('div.dwp-row', dlist).each(function (i) {
					_rtn[i] = $(this).data('fullinfo');
				});

				var actopt = {
					actiontype: 'delegation',
					Unid: _opt.appdockey,
					Argm1: _rtn.join(';')
				};

				_$$.aprv.com.PostComAction($doc, actopt);
				$dialog.close();
			},
			DelegationValidate_old: function ($dialog, $doc) {
				var _me = this,
					_opt = $doc.options,
					el = $doc.element,
					de = $dialog.element;

				return false;
			},

			// 열람자 추가처리 시, 기존로그 정보가져오기
			DelegationLoadLog: function ($doc, $dialog) {												// _$$.aprv.com
				var _el = $doc.element,
					_opt = $doc.options,
					_log = _opt.DelegationData,
					_de = $dialog.element,
					dlist = $('#delegationlog', _de),
					hishtml,
					$org = $dwp.ui.org;

				if (_log.length == 0) {
					hishtml = "<div class='dwp-row'><div class='dwp-value'>" + $fn.getCodeMsg('aprv.msg.026') + '</div></div>';
					dlist.append(hishtml);
					return false;
				}

				hishtml = '';

				$.each(_log, function (idx, obj) {
					var tmpdata = obj.split('{`'),
						_item1 = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER + '^acttime', tmpdata[0], '^', ';', $dwp.app.aprv.line.PROP.APP.KEY)[0],
						_item2 = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, tmpdata[1], '^', ';', $dwp.app.aprv.line.PROP.APP.KEY),
						_item3 = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, tmpdata[2], '^', ';', $dwp.app.aprv.line.PROP.APP.KEY),
						_data1 = [],
						_data2 = [];

					$.each(_item2, function (in1, _tmpdata1) {
						if (_tmpdata1.empno != '') {
							_data1[in1] = $fn.getCurLangMsg(_tmpdata1.username) + '/' + $fn.getCurLangMsg(_tmpdata1.duty);
						}
					});

					$.each(_item3, function (in2, _tmpdata2) {
						if (_tmpdata2.empno != '') {
							_data2[in2] = $fn.getCurLangMsg(_tmpdata2.username) + '/' + $fn.getCurLangMsg(_tmpdata2.duty);
						}
					});

					if (_data1.length > 0) {
						hishtml += "<div class='dwp-row'><div class='dwp-value' style='word-spacing:4px;'>";
						hishtml += $fn.getCodeMsg('aprv.msg.028').replace('{$1}', $fn.getCurLangMsg(_item1.username) + '/' + $fn.getCurLangMsg(_item1.duty))
							.replace('{$2}', _data1).replace('{$3}', $fn.formatDateTime(_item1.acttime));
						hishtml += '</div></div>';
					}

					if (_data2.length > 0) {
						hishtml += "<div class='dwp-row'><div class='dwp-value' style='word-spacing:4px;'>";
						hishtml += $fn.getCodeMsg('aprv.msg.029').replace('{$1}', $fn.getCurLangMsg(_item1.username) + '/' + $fn.getCurLangMsg(_item1.duty))
							.replace('{$2}', _data2).replace('{$3}', $fn.formatDateTime(_item1.acttime));
						hishtml += '</div></div>';
					}
				});

				dlist.append(hishtml);
			},
			// 열람자 정보 가져오기
			DelegationLoadList: function ($doc, $dialog) {												// _$$.aprv.com
				var _el = $doc.element,
					_list = $dwp.app.aprv.com.getFld('sDocReadersFull', _el),
					_de = $dialog.element,
					_$item = null,
					dlist = $('#delegationlist', _de),
					$org = $dwp.ui.org;

				// console.log("ddd", _list);

				function gethtml($dialog, data) {
					var html = '';
					html = "<div class='dwp-row'>";
					html += "<div class='dwp-value'>";
					html += "<div class='dwp-user'>";
					if (data.type == 'S') {
						html += "<div class='profile-info' data-type='profile' data-empno='" + data.empno + "' data-orgcode='" + data.orgcode + "'>";
						html += "<div class='name'>" + $fn.getCurLangMsg(data.username) + '</div>';
						html += "<div class='rank'>" + $fn.getCurLangMsg(data.duty) + '</div>';
						html += "<div class='team'>" + $fn.getCurLangMsg(data.orgname) + '</div>';
						html += '</div>';
					} else {
						html += "<div class='profile-info' data-empno='' data-orgcode='" + data.orgcode + "'>";
						html += "<div class='name'>" + $fn.getCurLangMsg(data.orgname) + '</div>';
						html += '</div>';
					}
					html += "<span class='btn-del'><img src='" + $fn.getPath('weblib') + "/images/common/icon-close.svg' alt=''></span>";
					html += '</div>';
					html += '</div>';
					html += '</div>';

					return $(html);
				}

				if (_list != '') {
					var obj = [];
					$.each(_list.split(';'), function (i, o) {
						if (o.charAt(0) == 'S') {
							obj.push($dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, o, '^', '', $dwp.app.aprv.line.PROP.APP.KEY));
						} else {
							obj.push($dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.DEPT, o, '^', '', 'orgcode'));
						}
					});

					$.each(obj, function (idx, _data) {
						_$item = gethtml($dialog, _data).appendTo(dlist).data('orgdata', _data).data('fullinfo', _data.fullinfo);

						$('.btn-del', _$item).on('click', function () {
							$(this).parent().parent().parent().remove();
						});
					});

					$("[data-type='profile']", dlist).off('click').on('click', function () {
						$dwp.ui.bizcard.init($(this));
					});
				}

				// 열람기록 로그
				var _url = $fn.getProxyUrl("/dwp/aprv/com/appdelegationlog.nsf/api/data/collections/name/vdelegation_log");
				var _param = {
					"category": $doc.options.appdockey
					, "count": 1000
				}
				$fn.xAjax({
					url: _url
					, data: _param
					, method: "GET"
					, async: true
					, cache: false
					, dataType: "JSON"
				}).done(function (data) {
					var _$log = $('[role="role_delegation_log"]', _de);
					var _h = '';

					_h += '<table>';
					_h += '<colgroup>';
					_h += '<col width="180px">';
					_h += '<col width="150px">';
					_h += '<col>';
					_h += '<col>';
					_h += '</colgroup>';

					_h += '<tr>';
					_h += '<th class="dwp-center">' + $fn.getCodeMsg("aprv.title.h187") + '</th>';		// 수행자
					_h += '<th class="dwp-center">' + $fn.getCodeMsg("aprv.title.h188") + '</th>';		// 수행일시
					_h += '<th class="dwp-center">' + $fn.getCodeMsg("aprv.title.h189") + '</th>';		// 열람자 추가
					_h += '<th class="dwp-center">' + $fn.getCodeMsg("aprv.title.h190") + '</th>';		// 열람자 삭제
					_h += '<tr>';

					if ($(data).size() == 0) {
						_h += '<tr>';
						_h += '<td class="dwp-center" colspan="4">' + $fn.getCodeMsg('aprv.msg.026') + '</td>';
						_h += '</tr>';
						// buriburi
					} else {
						$.each(data, function (i, v) {
							var _actiontime = v["_actiontime"];
							var _actionuserfull = v["_actionuserfull"];
							var _adduserlist = v["_adduserlist"];
							var _deluserlist = v["_deluserlist"];

							//console.log("=====================================");
							//console.log($dwp.ui.org._CONST._PROP.USER);
							//console.log($dwp.app.aprv.line.PROP.APP.KEY);
							//console.log("=====================================");

							var _actUser = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, _actionuserfull, '^', ';', $dwp.app.aprv.line.PROP.APP.KEY);
							var _addUser = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, _adduserlist, '^', ';', $dwp.app.aprv.line.PROP.APP.KEY);
							var _delUser = $dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, _deluserlist, '^', ';', $dwp.app.aprv.line.PROP.APP.KEY);

							_h += '<tr>';
							_h += '<td class="dwp-center">';
							_h += '<div class="dwp-user">';
							_h += '<div class="profile-info" data-type="profile" data-empno="' + _actUser[0].empno + '" data-orgcode="' + _actUser[0].orgcode + '">';
							_h += '<div class="name">' + $fn.getCurLangMsg(_actUser[0].username) + '</div>';
							_h += '<div class="rank">' + $fn.getCurLangMsg(_actUser[0].duty) + '</div>';
							_h += '<div class="team">' + $fn.getCurLangMsg(_actUser[0].orgname) + '</div>';
							_h += '</div>';
							_h += '</div>';
							_h += '</td>';
							_h += '<td class="dwp-center">' + $fn.formatDateTime(_actiontime) + '</td>';

							_h += '<td>';
							_h += '<div class="dwp-user">';
							$.each(_addUser, function (i, v) {
								if (v.empno != "") {
									_h += '<div class="profile-info" data-type="profile" data-empno="' + v.empno + '" data-orgcode="' + v.orgcode + '">';
									_h += '<div class="name">' + $fn.getCurLangMsg(v.username) + '</div>';
									_h += '<div class="rank">' + $fn.getCurLangMsg(v.duty) + '</div>';
									_h += '<div class="team">' + $fn.getCurLangMsg(v.orgname) + '</div>';
									_h += '</div>';
								}
							});
							_h += '</div>';
							_h += '</td>';

							_h += '<td>';
							_h += '<div class="dwp-user">';
							$.each(_delUser, function (i, v) {
								if (v.type != "") {
									_h += '<div class="profile-info" data-type="profile" data-empno="' + v.empno + '" data-orgcode="' + v.orgcode + '">';
									_h += '<div class="name">' + $fn.getCurLangMsg(v.username) + '</div>';
									_h += '<div class="rank">' + $fn.getCurLangMsg(v.duty) + '</div>';
									_h += '<div class="team">' + $fn.getCurLangMsg(v.orgname) + '</div>';
									_h += '</div>';
								}
							});
							_h += '</div>';
							_h += '</td>';

							_h += '</tr>';
						});
					}
					_h += '</table>';

					_$log.append(_h);

					$("[data-type='profile']", _$log).off('click').on('click', function () {
						$dwp.ui.bizcard.init($(this));
					});

				}).fail(function (xhr) {
					//console.log(xhr);
				});
			},
			// 열람자추가 : 저장
			DelegationSave: function ($dialog, $doc) {													// _$$.aprv.com
				var _me = this,
					_opt = $doc.options,
					el = $doc.element,
					de = $dialog.element,
					dlist = $('#delegationlist', de),
					_rtn = [];

				$('div.dwp-row', dlist).each(function (i) {
					_rtn[i] = $(this).data('fullinfo');
				});

				var actopt = {
					actiontype: 'delegation',
					Unid: _opt.appdockey,
					Argm1: _rtn.join(';')
				};

				_$$.aprv.com.PostComAction($doc, actopt);
				$dialog.close();
			},
			// 열람자추가 : Validation
			DelegationValidate: function ($dialog, $doc) {												// _$$.aprv.com
				var _me = this,
					_opt = $doc.options,
					el = $doc.element,
					de = $dialog.element;

				return false;
			},

			SecurityChangeSave: function ($dialog, $doc) {
				var _me = this,
					_opt = $doc.options,
					el = $doc.element,
					de = $dialog.element,
					DocPermission = $(':radio[name="DocPermission"]:checked', de).val(),
					actopt = {
						actiontype: 'securitychange',
						Unid: _opt.appdockey,
						Arg1: DocPermission
					};

				_$$.aprv.com.PostComAction($doc, actopt);
				$dialog.close();
			},
			SecurityChangeValidate: function ($dialog, $doc) {
				var _me = this,
					_opt = $doc.options,
					el = $doc.element,
					de = $dialog.element,
					from = _opt.from,
					docstatus = _opt.docstatus,
					isadmin = _opt.isadmin,
					chkac = false,
					docsecurity = _opt.docsecurity,
					chkdocsecurity = parseInt(docsecurity.substring(1, 2)),
					DocPermission = $(':radio[name="DocPermission"]:checked', de).val(),
					chkval = parseInt(DocPermission.substring(1, 2));

				from == $fn.getCurUser().notesid ? (chkac = true) : '';

				if (chkval == chkdocsecurity) {
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.024') });
					return true;
				}
				if ((docstatus == 'complete') & !isadmin & chkac) {
					if (chkval > chkdocsecurity) {
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.023') });
						return true;
					}
				}

				return false;
			},

			// 참조자추가 : 정보 가져오기 - 2024.03.05 by dwlee
			ReferLineChangeLoadList: function ($doc, $dialog) {											// _$$.aprv.com
				var _el = $doc.element;
				var _de = $dialog.element;
				var _list = $dwp.app.aprv.com.getFld('sReferenceUsersFull', _el);
				var _$item = null;
				var dlist = $('#referlinechangelist', _de);
				var $org = $dwp.ui.org;

				function gethtml($dialog, data) {
					var html = '';
					html = "<div class='dwp-row'>";
					html += "<div class='dwp-value'>";
					html += "<div class='dwp-user'>";
					if (data.type == 'S') {
						html += "<div class='profile-info' data-type='profile' data-empno='" + data.empno + "' data-orgcode='" + data.orgcode + "'>";
						html += "<div class='name'>" + $fn.getCurLangMsg(data.username) + '</div>';
						html += "<div class='rank'>" + $fn.getCurLangMsg(data.duty) + '</div>';
						html += "<div class='team'>" + $fn.getCurLangMsg(data.orgname) + '</div>';
						html += '</div>';
					} else {
						html += "<div class='profile-info' data-empno='' data-orgcode='" + data.orgcode + "'>";
						html += "<div class='name'>" + $fn.getCurLangMsg(data.orgname) + '</div>';
						html += '</div>';
					}
					html += "<span class='btn-del'><img src='" + $fn.getPath('weblib') + "/images/common/icon-close.svg' alt=''></span>";
					html += '</div>';
					html += '</div>';
					html += '</div>';

					return $(html);
				}

				if (_list == '') {
					return false;
				}

				var obj = [];
				$.each(_list.split(';'), function (i, o) {
					if (o.charAt(0) == 'S') {
						obj.push($dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.USER, o, '^', '', $dwp.app.aprv.line.PROP.APP.KEY));
					} else {
						obj.push($dwp.app.aprv.com.getObjStr($dwp.ui.org._CONST._PROP.DEPT, o, '^', '', 'orgcode'));
					}
				});

				$.each(obj, function (idx, _data) {
					_$item = gethtml($dialog, _data).appendTo(dlist).data('orgdata', _data).data('fullinfo', _data.fullinfo);

					$('.btn-del', _$item).on('click', function () {
						$(this).parent().parent().parent().remove();
					});
				});

				$("[data-type='profile']", dlist).off('click').on('click', function () {
					$dwp.ui.bizcard.init($(this));
				});
			},
			// 참조자추가 : 저장 - 2024.03.05 by dwlee
			ReferLineChangeSave: function ($dialog, $doc) {
				var _me = this;
				var _opt = $doc.options;
				var _ele = $doc.element;
				var _de = $dialog.element;
				var _dlist = $('#referlinechangelist', _de);
				var _rtn = [];

				$('div.dwp-row', _dlist).each(function (i) {
					_rtn[i] = $(this).data('fullinfo');
				});

				var actopt = {
					actiontype: 'refer_add',
					Unid: _opt.appdockey,
					Argm1: _rtn.join(';')
				};

				_$$.aprv.com.PostComAction($doc, actopt);
				$dialog.close();
			},

			// 참조자추가 : Validation - 2024.03.05 by dwlee
			ReferLineChangeValidate: function ($dialog, $doc) {
				var _me = this,
					_opt = $doc.options,
					el = $doc.element,
					de = $dialog.element;

				return false;
			},

			//_$$.aprv.com.ActionCom(doc, $fn.getCodeMsg('aprv.btn.comment'), act, false, 'wFrmAprvComDialog', '620', 'auto');
			ActionCom: function ($doc, title, act, modchk, form, _wd, _hi, validateCallback, savfun) {
				var _me = this,
					opt = $doc.options,
					el = $doc.element,
					act_length = Object.keys(act).length,
					_form = '',
					_modal = true,
					getScreen = $fn.getScreenInfo();

				if (opt.did == '') {
					typeof modchk == 'undefined' ? '' : (_modal = modchk);
				}

				_form = form;
				_hi = 'auto';

				var _Dailog = $fn.dialog(null, {
					modal: _modal,
					resizable: false,
					draggable: true,
					islangconvert: false,
					title: title,
					actions: act,
					width: _wd,
					height: _hi,
					docInstance: $doc,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [{
						title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
						css: 'confirm',
						click: function (_$dialog) {
							if (typeof validateCallback == 'function') {
								if (validateCallback(_$dialog, $doc)) {
									return false;
								}
							}

							if (typeof savfun == 'function') {
								savfun(_$dialog, $doc);
							} else {
								_$$.aprv.com.actionProcess(_$dialog, $doc);
							}
						}
					},
					{
						title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
						css: 'cancel',
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					],
					content: {
						url: $fn.getProxyUrl(opt.cdb + '/' + _form + '?OpenForm')
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

				//console.log("_Dailog",_rptDailog);
			},
			Action: function ($doc, title, act, modchk, bact) {
				var _me = this,
					opt = $doc.options,
					el = $doc.element,
					act_length = Object.keys(act).length,
					_form = '',
					_wd = 520,
					_hi = 330,
					_LineData = _$$.aprv.line.LineData($doc),
					_modal = true,
					_data = null,
					_position = { my: 'center', at: 'center', of: window },
					_bact = typeof bact == 'undefined' ? '' : bact,
					getScreen = $fn.getScreenInfo();

				typeof modchk == 'undefined' ? '' : (_modal = modchk);

				if (_me.actvalidation($doc, _LineData)) {
					return false;
				}

				if (_modal) {
					if (act_length > 1) {
						_form = 'wFrmAprvDialog';
					} else {
						_form = 'wFrmAprvDialog2';
						_hi = 280;
					}
				} else {
					_data = _$$.aprv.line.getapplinedata($doc, _$$.aprv.line.LineData($doc)); // 모든 결재자 정보
					_form = 'wFrmAprvAllDialog';
					_wd = getScreen.doc_w > 1100 ? 1100 : getScreen.doc_w - 100;
					_hi = 'auto';
					_position.my = 'left top';
					_position.at = 'left top';

					//서면결재판 20205-10-01 by wsjung
					if (typeof act.paperagree != 'undefined') {
						//_form = "wFrmAprvAllDialog_paper";
						//_form = "wFrmAprvAllDialog";
						_hi: 600;
					}
				}
				//console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
				//console.log("act : ", act);
				//console.log("_bact : ", _bact);
				//console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

				var _Dailog = $fn.dialog(null, {
					modal: _modal,
					resizable: false,
					draggable: true,
					islangconvert: false,
					title: title,
					actions: act,
					act: _bact,
					data: _data,
					width: _wd,
					height: _hi,
					position: _position,
					docInstance: $doc,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [{
						title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
						css: 'confirm',
						click: function (_$dialog) {
							_$$.aprv.com.actionProcess(_$dialog, $doc);
						}
					},
					{
						title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
						css: 'cancel',
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					],
					content: {
						url: $fn.getProxyUrl(opt.cdb + '/' + _form + '?OpenForm')
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

				//console.log("_Dailog",_rptDailog);
			},
			getReceiverList: function ($doc, opt, _$obj) {
				var that = this,
					_$doc = $doc,
					_opt = opt;
				var _receivers = $("input[name='Circulation3Full']", _$doc.element).xval();

				//접수자 정보 필드 오버플로우로 수정 - 2020.07.10 by dwlee
				if ($("input[name='sCurAppfullInfoList']", _$doc.element).size() > 0) {
					if ($("input[name='sCurAppfullInfoList']", _$doc.element).xval() != "") {
						_receivers = $("input[name='sCurAppfullInfoList']", _$doc.element).xval();
					}
				}

				if (_receivers.trim() === "") return;
				var _arr_receiver = _receivers.split(";");
				$.each(_arr_receiver, function (idx, o) {
					var _o;
					var _key_str = "";
					if (o.split("^")[0] === "S") {
						_o = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.USER, o, "^");
						_key_str = '<div class="dwp-user" data-type="profile" data-empno="' + _o.empno + '" data-orgcode="' + _o.orgcode + '">';
						_key_str += '<div class="profile-info"><div class="name">' + $fn.getCurLangMsg(_o.username) + '</div>';
						_key_str += '<div class="rank">' + $fn.getCurLangMsg(_o.pos) + '</div>';
						// 2022-02-10 By LHJ 접수자 대결정보 표시 추가
						_key_str += '<div class="team">' + $fn.getCurLangMsg(_o.orgname) + '</div></div>';
						_key_str += '<div class="delereason" style="padding:0 5px;display:inline-block;vertical-align:middle;"></div></div>';
					} else if (o.split("^")[0] === "B") {
						_o = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.DEPT, o, "^");
						_key_str = "<span>" + $fn.getCurLangMsg(_o.orgname) + "</span>";
					}

					//console.log("_o", _o);
					var _html = '<div class="info-section">';
					_html += '<div class="row head" data-orgcode="' + _o.orgcode + '">';
					_html += '<div data-type="org" data-orgcode="' + _o.orgcode + '" class="key" style="width:260px;">' + _key_str + '</div>';
					_html += '<div class="dele-info"></div>';	// 2022-02-10 By LHJ 접수자 대결정보 표시 추가
					_html += '<div class="status-info"><span class="key type status">접수대기</span></div>';
					_html += '<div class="date-info"><span class="date">-</span></div>';
					_html += '</div>';
					_$obj.append(_html);
				});

				$fn.xAjax({
					//수신자가 수십명이 넘어가므로 첫페이지로는 체크가 불가능 - 2020.07.10 by dwlee
					//url: "/dwp/aprv/com/rcvstatus.nsf/api/data/collections/name/vdockey?ps=1"
					url: "/dwp/aprv/com/rcvstatus.nsf/api/data/collections/name/vdockey?count=500",
					method: "GET",
					async: true,
					cache: false,
					dataType: "JSON",
					data: { keys: _opt.key_unid, keysexactmatch: true }
				}).done(function (data) {
					//console.log(data);
					var _rtn = [];
					if (data.length > 0) {
						if ($.isArray(data[0]._actionresult)) {
							_rtn = data[0]._actionresult;
						} else {
							if (data[0]._actionresult !== "") {
								_rtn.push(data[0]._actionresult);
							}
						}
						$.each(_rtn, function (idx, o) {
							/*
							var _arr_o = o.replace(/\r/g, "").replace(/\n/g, "").split("`}");
							var _o;

							//배열 인덱스 수정 _arr_o[1] ==> _arr_o[2]  - 2020.07.10 by dwlee
							var _tmp = _arr_o[0],
								_arr_stat = _arr_o[2].split("^");
							//var _tmp = _arr_o[0], _arr_stat = _arr_o[1].split("^");
							if (_tmp.split("^")[0] === "S") {
								_o = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.USER, o, "^");
							} else if (_tmp.split("^")[0] === "B") {
								_o = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.DEPT, o, "^");
							}
							var _datetime = _arr_stat[0],
								_action = _arr_stat[1],
								_status = _arr_stat[2];
							var _$row = $(".info-section", _$obj).find(".row[data-orgcode='" + _o.orgcode + "']");
							_$row.find(".status").html($fn.getCodeObjMsg('aprv.data.status', _status));
							_$row.find(".date").html($fn.formatDateTime(_datetime));
							*/
							// 2022-02-10 By LHJ 접수자 대결정보 표시 추가
							var _arr_o = o.replace(/\r/g, "").replace(/\n/g, "").split("`}");

							var _arr_stat = _arr_o[_arr_o.length - 1].split("^"),
								_org = new $dwp.ui.org.data.org(_arr_o[0]),
								_orgcode = _org.oinfo.orgcode;

							var _dele_reason = "", _dele_user = "";

							if (_org.oinfo.type === "S") {
								if (_org.oinfo.etc != "" && _org.oinfo.etc.indexOf("=DL=") > -1) {
									var _etcs = $fn.getMidStr(_org.oinfo.etc, "=DL=", "==");
									var _delinfo = _etcs.split("|");
									_orgcode = _delinfo[1];
									//_dele_user = _org.getDispName();

									_dele_user = '<div class="dwp-user" data-type="profile" data-empno="' + _org.oinfo.empno + '" data-orgcode="' + _org.oinfo.orgcode + '">';
									_dele_user += '<div class="profile-info"><div class="name">' + $fn.getCurLangMsg(_org.oinfo.username) + '</div>';
									_dele_user += '<div class="rank">' + $fn.getCurLangMsg(_org.oinfo.pos) + '</div>';
									_dele_user += '<div class="team">' + $fn.getCurLangMsg(_org.oinfo.orgname) + '</div></div></div>';

									_dele_reason = "<span name='_DELE' class='dwp-orange'>[부재:" + $dwp.core.lang.getCurMsg(_delinfo[3]) + "]</span>";
								}
							}

							var _datetime = _arr_stat[0],
								_action = _arr_stat[1],
								_status = _arr_stat[2];

							//console.log("====================================");
							//console.log("_status : ", _status);
							//console.log("====================================");

							var _$row = $(".info-section", _$obj).find(".row[data-orgcode='" + _orgcode + "']");
							//_$row.find(".status").html($fn.getCodeObjMsg('aprv.data.status', _status));

							//대외발송 문서이면 색상을 바꿈 - 2023.02.23 by dwlee
							if (_status == "sendwait" || _status == "officeseal" || _status == "validdoc" || _status == "distsend") {
								_$row.find(".status").html($fn.getCodeObjMsg('aprv.data.status', _status));
								_$row.find(".status").removeClass("key").addClass("dwp-blue").addClass("dwp-bold");
							} else {
								_$row.find(".status").html($fn.getCodeObjMsg('aprv.data.status', _status));
							}

							//_$row.find(".date").html($fn.formatDateTime(_datetime));
							//값이 없는 경우에는 날짜를 기록하지 않음 - 2023.02.23 by dwlee
							if (_datetime != "") {
								_$row.find(".date").html($fn.formatDateTime(_datetime));
							}

							if (_dele_user != "") {
								_$row.find(".dele-info").html(_dele_user);
								_$row.find(".dele-info").find(".dwp-user").off('click').on("click", function (e) {
									$dwp.ui.bizcard.init($(this), { ismobile: false });
								});
							}
							if (_dele_reason != "") {
								_$row.find(".delereason").html(_dele_reason);
							}


						});
					} else {
						$fn.alert({ msg: "수신처 결재진행 정보를 찾을 수 없습니다. 관리자에게 문의하여 주십시오." });
					}

				}).fail(function (xhr) {
					//console.log(xhr);
				});
			},
			//원문 결재진행현황 조회  - 2020.08.31 by dwlee
			AppReqHistory: function ($doc, title, fnfix) {
				var opt = $doc.options;
				var sDocStep = opt.sDocStep;
				var el = $doc.element;
				var _is_view_rcv_status = false;
				//console.log("sDocStep", sDocStep);
				var _data = _$$.aprv.line.LineData($doc, undefined, fnfix); // 모든 결재자 정보
				//console.log("appHist:", _data);
				var _srdocform = $("input[name='sRDocForm']", $doc.element).xval();
				var _frm_url = "/wFrmDocumentHistoryR?OpenForm";
				var _status = opt.docstatus;
				var _rcv_damdang = opt.RCV_DAMDANG;
				var _Dailog = $fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: false,
					docInstance: $doc,
					title: title,
					data: _$$.aprv.line.getapplinedata($doc, _data),
					width: 756,
					height: 600,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [],
					content: {
						url: $fn.getProxyUrl(opt.cdb + _frm_url)
					},
					close: function () {
						// console.log("close");
					},
					initcallback: function ($dialog) {
						var _el = $dialog.element;
						//if( _is_view_rcv_status === false ) return;
						var _data2 = $dwp.app.aprv.line.getapplinedata($doc, _data);
						var _appinfohtml = $dwp.app.aprv.line.DrawingAppinfo(_data2, "", $dialog);

						if (opt.req.docreader != "") {
							var _reqrefer = "<div name='ReqRefer' data-type='org'>";
							_reqrefer += "<input name='sReferenceUsers' type='hidden' value='" + opt.req.docreader + "'>";
							_reqrefer += "<input name='sReferenceUsersFull' type='hidden' value='" + opt.req.docreaderfull + "'>";
							_reqrefer += "<div class='namepicker-list'></div>";
							_reqrefer += "</div>";
							$("#tab_2 > .info-wrap", _el).append(_reqrefer);
							if ($("[name='ReqRefer']", _el).length > 0) {
								$fn.orgsel($("[name='ReqRefer']", _el), { isedit: false, treetype: "0", seltype: "0", isseltype: true, fld: "sReferenceUsers", count: 100 });
							}
						} else {
							$("#tab_2", _el).addClass("dwp-hidden");
						}

						$("#tab_1 > .info-wrap", _el).append(_appinfohtml);

						$fn.getPicError($("div.dwp-user img", _el));
						$("[data-type='profile']", _el).off("click").on("click", function () {
							$dwp.ui.bizcard.init($(this));
						});

						$.each($("li[role='tab']", _el), function (idx, o) {
							$(this).off("click").bind("click", function () {
								var _tab_id = $(this).attr("id");
								$(".scrolling-area > .dwp-approval-info-dialog", _el).addClass("dwp-hidden");
								$(".scrolling-area > #" + _tab_id, _el).removeClass("dwp-hidden");

								$("li[role='tab']", _el).removeClass("ui-state-active").removeClass("ui-tabs-active");
								$(this).addClass("ui-state-active").addClass("ui-tabs-active");
							});
						});

						//페이지의 언어 Covert 수행
						$dwp.core.lang.convert({ url: "", isedit: false }, _el);
					}
				});
			},
			AppHistory: function ($doc, title, fnfix) {
				console.log("AppHistory 시작")
				var opt = $doc.options;
				var sDocStep = opt.sDocStep;
				var el = $doc.element;
				var _is_view_rcv_status = false;
				//console.log("sDocStep", sDocStep);
				var _data = _$$.aprv.line.LineData($doc, undefined, fnfix); // 모든 결재자 정보
				//console.log("appHist:", _data);
				var _srdocform = $("input[name='sRDocForm']", $doc.element).xval();
				var _frm_url = "/wFrmDocumentHistory?OpenForm";
				var _status = opt.docstatus;
				var _rcv_damdang = opt.RCV_DAMDANG;

				//외부발송 상태값에서도 수신처의 상태를 조회 할 수 있도록 수정 - 2023.02.23 by dwlee
				var _rcvTabStatus = ["complete", "decide", "raisedecide", "sendwait", "officeseal", "validdoc", "distsend"];
				var _index = $.inArray(_status, _rcvTabStatus);
				if ((opt.appCfg.OPT5 === "YES" || _rcv_damdang.userid !== "") && _srdocform === "R" && _index != -1) {

					//if ((opt.appCfg.OPT5 === "YES" || _rcv_damdang.userid !== "") && _srdocform === "R" && (_status === "complete" || _status === "decide" || _status === "raisedecide")) {
					_is_view_rcv_status = true;
					_frm_url = "/wFrmDocumentHistoryEx?OpenForm";
				}
				var _Dailog = $fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: false,
					docInstance: $doc,
					title: title,
					data: _$$.aprv.line.getapplinedata($doc, _data),
					width: 756,
					height: 570,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [],
					content: {
						url: $fn.getProxyUrl(opt.cdb + _frm_url)
					},
					close: function () {
						// console.log("close");
					},
					initcallback: function ($dialog) {
						var _el = $dialog.element;
						if (_is_view_rcv_status === false) return;
						var _data2 = $dwp.app.aprv.line.getapplinedata($doc, _data);
						//console.log("AppHistory _data2", _data2)
						//console.log("AppHistory $dialog", $dialog)
						var _appinfohtml = $dwp.app.aprv.line.DrawingAppinfo(_data2, "", $dialog);

						$dwp.app.aprv.com.getReceiverList($doc, opt, $("#tab_2 > .info-wrap", _el));
						$("#tab_1 > .info-wrap", _el).append(_appinfohtml);

						$fn.getPicError($("div.dwp-user img", _el));

						$("[data-type='profile']", _el).off("click").on("click", function () {
							$dwp.ui.bizcard.init($(this));
						});

						$.each($("li[role='tab']", _el), function (idx, o) {
							$(this).off("click").bind("click", function () {
								var _tab_id = $(this).attr("id");
								$(".scrolling-area > .dwp-approval-info-dialog", _el).addClass("dwp-hidden");
								$(".scrolling-area > #" + _tab_id, _el).removeClass("dwp-hidden");

								$("li[role='tab']", _el).removeClass("ui-state-active").removeClass("ui-tabs-active");
								$(this).addClass("ui-state-active").addClass("ui-tabs-active");
							});
						});
					}
				});

				//console.log("_Dailog",_rptDailog);
			},
			//접수담당자 변경
			AppReceiveChange: function ($doc, title, act) {
				var opt = $doc.options;
				$fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: true,
					title: title,
					width: 400,
					height: 360,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [{
						title: $fn.getCodeMsg('comm.btn.confirm'),
						click: function (_$dialog) {
							var _$el = _$dialog.element;
							var _$Receiver = $("[name='Receiver']", _$el);
							if (_$Receiver.val() == '') {
								$fn.alert({
									msg: $fn.getCodeMsg('aprv.msg.041')
								});
								return false;
							}
							//현 접수자와 동일한지 여부체크하기
							if ($fn.getCurUser().pinfo.empno == $fn.getName(_$Receiver.val()).ou) {
								$fn.alert({
									msg: $fn.getCodeMsg('aprv.msg.042')
								});
								return false;
							}

							var actopt = { actiontype: act, Unid: opt.appdockey, Arg1: _$Receiver.val() };
							_$$.aprv.com.PostComAction($doc, actopt);
							_$dialog.close();
						}
					},
					{
						title: $fn.getCodeMsg('comm.btn.cancel'),
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					],
					content: {
						url: $fn.getProxyUrl(opt.cdb + '/wFrmReceiveChange?OpenForm')
					},
					initcallback: function (_$dialog) {
						var _$el = _$dialog.element;
						$fn.orgsel($("[name='OrgReceive']", _$el), {
							isedit: true,
							treetype: '0',
							seltype: '2',
							fld: 'Receiver',
							count: 1,
							isseltype: false
						});
					},
					close: function () {
						// console.log("close");
					}
				});
			},
			//추가결재 변경
			AddApproveChange: function ($doc, title, act) {
				var opt = $doc.options;
				$fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: true,
					title: title,
					width: 600,
					height: 360,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [{
						title: $fn.getCodeMsg('aprv.title.h005'),
						click: function (_$dialog) {
							var _$el = _$dialog.element;
							var _$Receiver = $("[name='ReceiverFull']", _$el);
							if (_$Receiver.val() == '') {
								$fn.alert({
									msg: $fn.getCodeMsg('aprv.msg.045')
								});
								return false;
							}
							//현 접수자와 동일한지 여부체크하기
							//if($fn.getCurUser().pinfo.empno == $fn.getName(_$Receiver.val()).ou) {
							//	$fn.alert({msg : $fn.getCodeMsg("aprv.msg.042")});
							//	return false;
							//}

							var actopt = {
								actiontype: act,
								Unid: opt.appdockey,
								Arg1: _$Receiver.val()
							};
							_$$.aprv.com.PostComAction($doc, actopt);
							_$dialog.close();
						}
					},
					{
						title: $fn.getCodeMsg('comm.btn.cancel'),
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					],
					content: {
						url: $fn.getProxyUrl(opt.cdb + '/wFrmAddApproveChange?OpenForm')
					},
					initcallback: function (_$dialog) {
						var _$el = _$dialog.element;
						if (
							opt.appCfg.hasOwnProperty('AddApprover') &&
							opt.appCfg.AddApprover != ''
						) {
							$("input[name='Receiver']", _$el).val(opt.appCfg.AddApprover);
							$("input[name='ReceiverFull']", _$el).val(
								opt.appCfg.AddApproverFull
							);
						}
						$fn.orgsel($("[name='OrgReceive']", _$el), {
							isedit: true,
							treetype: '0',
							seltype: '2',
							fld: 'Receiver',
							count: 10,
							isseltype: false
						});
					},
					close: function () {
						// console.log("close");
					}
				});
			},
			AppEditHistory: function ($doc, title, fnfix) {
				var opt = $doc.options;
				var sDocStep = opt.sDocStep;
				var el = $doc.element;
				//console.log("sDocStep",sDocStep);
				var _data = _$$.aprv.line.LineData($doc, undefined, fnfix); // 모든 결재자 정보
				// console.log("appHist:", _data);
				var _Dailog = $fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: false,
					title: title,
					data: _$$.aprv.line.getapplinedata($doc, _data),
					width: 900,
					height: 570,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [],
					content: {
						url: $fn.getProxyUrl(opt.cdb + '/wFrmEditHistory?OpenForm')
					},
					initcallback: function (_$dialog) {
						var _$el = _$dialog.element,
							_$hcomment = $('div[name=header_Comment]', _$el),
							_$inpcomment = $('textarea[name=stmpComment]', _$el),
							_$inppstep = $('input[name=sPstep]', _$el),
							_$inppos = $('input[name=sPos]', _$el),
							_$inpcpos = $('input[name=sCPos]', _$el),
							_$inptype = $('input[name=sType]', _$el);

						$('div.info-section', _$el)
							.off('click')
							.on('click', function () {
								var _$head = $('div.row.head', this);
								var _$comment = $("div.row:not('.head') div.value", this);

								if (_$head.attr('isapprove') == '1') {
									$('div.info-section', _$el).removeClass('active');
									$(this).addClass('active');

									_$hcomment.html($('div.dwp-user', _$head).get(0).outerHTML);
									_$inppstep.val($(this).attr('pstep'));
									/*
												  if ($(this).attr("cpos") == "-1") {
													  _$inppos.val($(this).attr("pos"));
												  } else {
													  _$inppos.val($(this).attr("cpos"));
												  }
												  */
									_$inppos.val($(this).attr('pos'));
									_$inpcpos.val($(this).attr('cpos'));

									_$inpcomment.val('');
									if (_$comment.size() > 0) {
										_$inptype.val('edit');
										_$inpcomment.val(
											_$comment
												.html()
												.replace(/<br>/gi, '\n')
												/*
																							by mjkim 20250221 gi 추가
												*/
												.replace(/&nbsp;/gi, ' ')
										);
									} else {
										_$inptype.val('add');
									}
								}
							});

						// 수정처리
						/*
						 * Arg1 : Type(add, edit, del), Arg2 : PStep, Arg3 : CPOS, Arg4 : POS, TmpsComment : Comment
						 */
						$('div[name=btn_edit]', _$el).off('click').on('click', function () {
							if (_$inppos.val() == '') {
								$fn.alert({
									msg: $fn.getCodeMsg('aprv.msg.038')
								});
								return false;
							}
							if (_$inpcomment.val() == '') {
								$fn.alert({
									msg: $fn.getCodeMsg('aprv.msg.039')
								});
								return false;
							}
							var actopt = {
								actiontype: 'editcomment',
								Unid: opt.appdockey,
								Arg1: _$inptype.val(),
								Arg2: _$inppstep.val(),
								Arg3: _$inpcpos.val(),
								Arg4: _$inppos.val(),
								TmpsComment: _$inpcomment.val()
							};
							_$$.aprv.com.PostComAction($doc, actopt);
							_$dialog.close();
						});
						// 삭제처리
						$('div[name=btn_del]', _$el).off('click').on('click', function () {
							if (_$inppos.val() == '') {
								$fn.alert({
									msg: $fn.getCodeMsg('aprv.msg.040')
								});
								return false;
							}
							var actopt = {
								actiontype: 'editcomment',
								Unid: opt.appdockey,
								Arg1: 'del',
								Arg2: _$inppstep.val(),
								Arg3: _$inpcpos.val(),
								Arg4: _$inppos.val()
							};
							_$$.aprv.com.PostComAction($doc, actopt);
							_$dialog.close();
						});
					},
					close: function () {
						// console.log("close");
					}
				});

				//console.log("_Dailog",_rptDailog);
			},
			//2017.08.07 - 결재양식의 설정에 있는 html을 가져오는 함수(보완 - edtior oninitcompleted 이후에 수행)
			InsertBodyHTML: function ($doc) {
				var _me = this,
					_opt = $doc.options,
					_el = $doc.element;
				var _url = $fn.getProxyUrl(
					_opt.mngdb +
					'/lkViwAprvSet01/' +
					_opt.appCfg.FormAlias +
					'/Body?OpenField'
				);
				var rtnHtml = '';
				$fn.xAjax({ url: _url, dataType: 'html', async: false }).done(function (data) {
					rtnHtml = data;
				});
				return rtnHtml;
			},
			InitEditorHtml: function ($doc) {
				var _me = this,
					_opt = $doc.options,
					_el = $doc.element;

				if (_opt.appCfg.BodyName != 'D') {
					return false;
				}

				var _url = $fn.getProxyUrl(_opt.mngdb + '/lkViwAprvSet01/' + _opt.appCfg.FormAlias + '/Body?OpenField');
				var callback = function (_data) {
					if ($('#bodyFld', _el)[0] != undefined) {
						$dwp.ui.weditor.setHtmlValue(_data, _el);
					}
				};

				$fn.cmdPost(_url, '', callback, 'html');
			},

			//참조선 저장 - wcmdost 요청 - 2024.03.05 by jwlee
			CmdPost: function (_url, _opt, _callback, _msgcode) {										// _$$.aprv.com
				var _me = this;
				var _callbackfun = function (_data) {
					if (_data.hasOwnProperty('result')) {
						if (_data.result == '200') {
							if (typeof (_callback) == "function") {
								_callback(_data);
							}
						} else {
							$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });		// 처리 중 오류가 발생 되었습니다.
						}
					} else {
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });			// 처리 중 오류가 발생 되었습니다.
					}
				};

				if (typeof _msgcode != 'undefined') {
					$fn.confirm({ msg: $fn.getCodeMsg(msgcode) }).done(function () {
						$fn.cmdPost(_url, _opt, _callbackfun, 'json');
					});
				} else {
					$fn.cmdPost(_url, _opt, _callbackfun, 'json');
				}
			},

			PostComAction: function ($doc, opt, msgcode) {
				var _me = this,
					_opt = $doc.options;
				var _url = $fn.getProxyUrl(_opt.cdb + '/wcmdpost?createdocument');
				var _actopt = opt; //{actiontype :act, Unid : _opt.appdockey,Arg1 : appinfohtml};
				var callback = function (_data) {
					if (_data.hasOwnProperty('result')) {
						if (_data.result == '200') {
							if (_data.hasOwnProperty('returnurl')) {
								_$$.aprv.com.savecallback(_data, $doc);
							}
						} else {
							//error
							$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
						}
					} else {
						//error
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
					}
				};

				if (typeof msgcode != 'undefined') {
					$fn.confirm({ msg: $fn.getCodeMsg(msgcode) }).done(function () {
						$fn.cmdPost(_url, _actopt, callback, 'json');
					});
				} else {
					$fn.cmdPost(_url, _actopt, callback, 'json');
				}
			},

			/*
						//결재문서 전달 - 2019.08.21 by dwlee
						AprDocTransfer: function ($doc, act) {
							var opt = $doc.options;
							var _data = { actiontype: act, unid: opt.unid, arg1: opt.cdb }
			
							function transCallBack(data) {
								if (data.hasOwnProperty("result")) {
									if (data.result >= "200" && data.result < "300") {
										//메일 작성화면 열기 - 
										var _linkhtml = "";
										_linkhtml = "<p style='LINE-HEIGHT: 120%; TEXT-INDENT: 0pt; MARGIN: 0px 0pt;font-family:맑은 고딕;font-size:10'></p>";
										_linkhtml += "<p style='font-family:맑은 고딕;font-size:10pt;LINE-HEIGHT: 120%; TEXT-INDENT: 0pt; MARGIN: 0px 0pt'>";
										_linkhtml += "<a href='/dwp/com/portal/main.nsf/wfrmBridge?ReadForm&_=1&url=/" + data.dbpath + "/0/" + data.unid + "?OpenDocument&popup=1&param=' target='_new'>";
										_linkhtml += "문서연결 ☞ <font color='blue'>" + data.subject + "</font>";
										_linkhtml += "</a>";
										_linkhtml += "</p>";
										_linkhtml += "<p style='font-family:맑은 고딕;font-size:10pt;LINE-HEIGHT: 120%; TEXT-INDENT: 0pt; MARGIN: 0px 0pt'>";
										_linkhtml += "(위 링크는 " + data.startdate + "부터 15일간 유효하며, 그 이후에는 연결이 되지 않습니다.)";
										_linkhtml += "</p>";
										_linkhtml += "<p style='font-family:맑은 고딕;font-size:10pt;LINE-HEIGHT: 120%; TEXT-INDENT: 0pt; MARGIN: 0px 0pt'>&nbsp;</p>";
										//수신인 없는 메일 작성화면 팝업
										$fn.mailSend("", _linkhtml);
									}
								}
							}
							var _transurl = $fn.getProxyUrl(opt.cdb + '/wcmdpost?createdocument');
							$fn.cmdPost(_transurl, _data, transCallBack, "json");
						},
			*/

			//결재문서 전달 - 2025.09.30 by wsjung
			AprDocForward: function ($doc, act, idlist) {
				var _opt = $doc.options;
				var _url = $fn.getProxyUrl(_opt.cdb + '/wcmdpost?createdocument');
				var _actopt = {
					actiontype: act,														//request_forward
					Arg1: _opt.appComCfg.AprForwardDBPath,			//dwp/aprv/com/aprvfwd.nsf
					Arg2: _opt.unid,
					Arg3: idlist,
					async: false
				}
				var callback = function (_data) {
					//console.log("11111", _data)
					if (_data.hasOwnProperty("result")) {
						if (_data.result == "200") {
							$fn.toast({ msg: $fn.getCodeMsg(_data.msgcode) });
							$doc.reload();
						} else {
							$fn.toast({ msg: "Error" });
							$doc.reload();
						}
					}
				}
				$fn.cmdPost(_url, _actopt, callback, "json");
			},

			PostAction: function ($doc, act, msgcode, appinfohtml) {
				var _me = this,
					_opt = $doc.options;
				var _url = $fn.getProxyUrl(_opt.cdb + '/wcmdpost?createdocument');
				var _actopt = {
					actiontype: act,
					Unid: _opt.appdockey,
					Arg1: appinfohtml
				};
				var callback = function (_data) {
					if (_data.hasOwnProperty('result')) {
						if (_data.result == '200') {
							if (_data.hasOwnProperty('returnurl')) {
								_$$.aprv.com.savecallback(_data, $doc);
							}

							//2022.02.22 by dwlee
							if (_data.hasOwnProperty("succmsg")) {
								$fn.alert({ msg: _data.succmsg });
								$doc.reload();
							}
							// 400 에러
						} else {
							//$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
							//error
							//2023.02.17 by dwlee
							if (_data.hasOwnProperty("errmsg") && _data.errmsg != "") {
								$fn.alert({ msg: _data.errmsg });
							} else {
								$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
							}
						}
					} else {
						//error
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
					}
				};

				if (typeof msgcode != 'undefined') {
					$fn.confirm({ msg: $fn.getCodeMsg(msgcode) }).done(function () {
						$fn.cmdPost(_url, _actopt, callback, 'json');
					});
				} else {
					$fn.cmdPost(_url, _actopt, callback, 'json');
				}
			},
			PostActionReceive: function ($doc, act, appinfohtml, rcv_list) {
				var _me = this,
					_opt = $doc.options;
				var _url = $fn.getProxyUrl(_opt.cdb + '/wcmdpost?createdocument');
				var _actopt = {
					actiontype: act,
					Unid: _opt.appdockey,
					Arg1: appinfohtml,
					Arg2: rcv_list
				};
				var callback = function (_data) {
					if (_data.hasOwnProperty('result')) {
						if (_data.result == '200') {
							if (_data.hasOwnProperty('returnurl')) {
								_$$.aprv.com.savecallback(_data, $doc);
							}
						} else {
							//error
							$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
						}
					} else {
						//error
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
					}
				};

				$fn.cmdPost(_url, _actopt, callback, 'json');
			},
			getViewData: function (_url) {
				var viewdata = null;
				$fn.xAjax({
					url: _url,
					method: 'GET',
					dataType: 'json',
					async: false,
					cache: false
				}).done(function (_data) {
					// console.log("getViewData:", _data);
					viewdata = _data;
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				return viewdata;
			},
			AppLineEditSave: function (dbpath, opt, _$dialog, obj, $pdialog) {

				var _me = this,
					$org = $dwp.ui.org,
					//$doc = $fn.getInstance('doc', $fn.getContent()),
					$doc = $pdialog.options.docInstance,
					_rtn = _$$.aprv.org._getGridData($pdialog);

				_griddata = _$$.aprv.org.setappval(_rtn, $pdialog, $doc, false);

				// console.log("AppLineEditSave _$dialog",_$dialog);

				opt.Arg1 = _griddata.Arg1;
				opt.Arg2 = _griddata.Arg2;
				opt.Arg3 = _griddata.Arg3;
				opt.Arg4 = _griddata.Arg4;

				//이중결재관련 시작
				opt.IsDblApr = _griddata.IsDblApr;
				opt.sAppListDbl = _griddata.sAppListDbl;
				//이중결재관련 종료

				_me.PostAppline(dbpath, opt, _$dialog, obj, $pdialog);
			},
			setAppLineEdit: function (dbpath, opt, _$dialog, obj, $pdialog, _data) {
				var _me = this,
					$org = $dwp.ui.org,
					_$gridlist = $org._getGrid($pdialog),
					_el = $('div.aligner', _$gridlist)[0],
					_ebtn = $('div.left', _el),
					_ebtnchl = $('div.dwp-grouping', _ebtn),
					_html = '',
					_$item = null,
					_alname = '';

				opt.actiontype = 'AppLineEdit';
				opt.Unid = _data.docid;

				_ebtnchl.remove();

				opt.Arg6 == 'applineuser' ? (_alname = $fn.getCodeMsg('aprv.title.h071')) : (_alname = $fn.getCodeMsg('aprv.title.h074'));

				_html = "<div class='dwp-grouping'>";
				_html += "<div class='open-line-name'><b>" + _alname + ' : </b>' + _data.AppName + '</div>';

				//부서 결재선은 작성자만 수정하도록 변경 - 2024.01.04 by dwlee
				if (opt.hasOwnProperty("Arg7")) {
					var _popt = $pdialog.options;
					var _lineinfo = _popt.refdata.defaultval[0];
					var _linearr = _lineinfo.split(";");
					var _obj1 = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.APP.TLIST, _linearr[0], '^', ';', '')

					var _list = opt.Arg7;
					var _obj2 = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.APP.TLIST, _list[0], '^', ';', '');
					//console.log("_list : " , _list[0]);

					//회사코드와 사번 비교

					//console.log(_obj1[0]);
					//console.log(_obj2[0]);

					if (_obj1[0].comcode == _obj2[0].comcode && _obj1[0].empno == _obj2[0].empno) {
						_html += "<div class='dwp-btn option'><span id='button'>" + $fn.getCodeMsg('aprv.title.h077') + '</span></div>';
					}
				} else {
					_html += "<div class='dwp-btn option'><span id='button'>" + $fn.getCodeMsg('aprv.title.h077') + '</span></div>';
				}

				_html += '</div>';

				_$item = $(_html);
				_$item.appendTo(_ebtn);

				$('.dwp-btn', _$item).on('click', function () {
					_me.AppLineEditSave(dbpath, opt, _$dialog, obj, $pdialog);
				});
			},
			PostAppline: function (dbpath, opt, _$dialog, obj, $pdialog, opts) {
				var _me = this;
				var _url = $fn.getProxyUrl(dbpath + '/wcmdpost?createdocument');
				var _actopt = opt;
				var _opts = $.extend({ apptype: "" }, opts);

				var callback = function (_data) {
					//console.log("@@ _data",_data);
					if (_data.hasOwnProperty('result')) {
						if (_data.result == '200') {
							if (_data.hasOwnProperty('action')) {
								if (_data.action == 'remove') {
									obj.remove();
									$fn.toast({
										msg: $fn.getCodeMsg('aprv.msg.006')
									});
								}
								return false;
							}

							//다이알로그 창이 null이면 양식에서 호출 - 2023.07.10 by dwlee
							if (_$dialog == null) {
								$fn.toast({ msg: $fn.getCodeMsg('aprv.msg.063') });
							} else {
								if (_data.hasOwnProperty('AppName')) {
									_me.setAppLineEdit(dbpath, opt, _$dialog, obj, $pdialog, _data);
								}
								$fn.toast({ msg: $fn.getCodeMsg('aprv.msg.006') });
								_$dialog.close();
								if (typeof (_opts.callback) == "function") {
									_opts.callback();
								}
							}
						} else {
							//error
							$fn.alert({ msg: $fn.getCodeMsg(_data.msgcode) });
						}
					} else {
						//error
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.007') });
					}
				};
				$fn.cmdPost(_url, _actopt, callback, 'json');
			},
			applineloading: function (obj, $dialog, _$dialog, apltype, editopt) {
				//console.log("결재선 불러오기 applineloading")
				var _me = this,
					_el = _$dialog.element,
					$org = $dwp.ui.org;
				var _$gridlist = $org._getGrid(_$dialog),
					_refdata = _$dialog.options.refdata,
					_grid = _refdata.grid[_refdata.tabidx],
					_vlist = [],
					_data = '',
					_changedlist = '';

				//이중결재처리 시작
				var _doc = _$dialog.options.docInstance;
				var appCfg = _doc.options.appCfg;

				if (appCfg.ProcessStep == "1" && typeof appCfg.UseDblApr != 'undefined' && appCfg.UseDblApr == 'YES') {
					var _isdblapr = obj.data('isdblapr');
					var _sapplistdbl = obj.data('sapplistdbl');
					//이중결재를 사용할 때만 처리
					if (_isdblapr == "1") {
						_sapplistdbl = _sapplistdbl.join(";");
					} else {
						_sapplistdbl = "";
					}
					$("input[name='IsDblApr']", _el).xval(_isdblapr);
					$("input[name='sAppListDbl']", _el).xval(_sapplistdbl);
					if (_isdblapr == "1") {
						$("#DblAprTypeV", _el).removeClass("dwp-none");
						_$$.aprv.org._viewDblAprTypeV(_isdblapr, _sapplistdbl, _$dialog);
					} else {
						$("#DblAprTypeV", _el).addClass("dwp-none");
						_$$.aprv.org._viewDblAprTypeV(_isdblapr, _sapplistdbl, _$dialog);
					}
				}
				//이중결재처리 종료

				_data = obj.data('applinedata');
				if (typeof _data == 'undefined') {
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.019') });
					return false;
				}
				if (obj.data('changed') == '1') {
					_changedlist = obj.data('changedlist');
					$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.020') });
				}

				if (_grid.hasOwnProperty('children')) {
					$.each($('div.dwp-item.all-del', _$gridlist), function (i, _node) {
						//$.each($("div.dwp-item.all-del",_grid.children[0].selector, _$gridlist), function(i,_node){

						if ($("select[name=APPTYPE]", this).length != 0) {
							_$$.aprv.org.befordel($(this), false);
						}
					});
				} else {
					if ($('div.dwp-item', _$gridlist).size() > 0) {
						$('div.dwp-item', _$gridlist).remove();
					}
				}

				var resort = function (_vlist) {
					var tmpval = '',
						tmpagval = '';
					$.each(_vlist, function (i, v) {
						_org = new $org.data.orgEx(v, _grid.type.toUpperCase());

						if ($.trim(_org.oinfo.apptype) == 'AP') {
							if (tmpagval == '') {
								tmpval == '' ? (tmpval = v) : (tmpval += ';' + v);
							} else {
								tmpval == '' ? (tmpval = v + ';' + tmpagval) : (tmpval += ';' + v + ';' + tmpagval);
								tmpagval = '';
							}
						} else {
							tmpagval == '' ? (tmpagval = v) : (tmpagval += ';' + v);
						}
					});
					tmpagval == '' ? '' : (tmpval += ';' + tmpagval);
					return tmpval.split(';');
				};

				if (apltype == 'applineuser') {
					//_vlist = resort(_data);
					if ($.isArray(_data)) {
						_vlist = _data;
					} else {
						if (_data == '') {
							_vlist = [];
						} else {
							_vlist = _data.split(';');
						}
					}
					//_vlist = _data;
					// console.log("_vlist",_vlist);

					//2024.01.04 by dwlee
					editopt.Arg7 = _vlist;

					$.each(_vlist, function (i, v) {
						var chkchanged = false;
						if (i != 0) {
							_org = new $org.data.orgEx(v, _grid.type.toUpperCase());

							if ($.isArray(_changedlist)) {
								$.inArray(_org.oinfo.key, _changedlist) > -1 ? (chkchanged = true) : '';
							} else {
								_org.oinfo.key == _changedlist ? (chkchanged = true) : '';
							}

							_org.changed = chkchanged;
							_$$.aprv.org.loaditem(_$dialog, _org, _refdata.tabidx);
						}
					});

					//주관부서/담당자가 있는 경우(결재단계 2선택), by Choo
					if ($fn.getInstance("doc").options.appCfg.ProcessStep === "2" && _refdata.grid.length > 1) {
						var _$gridlist2 = $org._getGrid(_$dialog, 1),
							_$list = $('div.dwp-list-body', _$gridlist2);

						if (_$list.size() > 0) {
							if ($('div.dwp-item', _$gridlist2).size() > 0) {
								$('div.dwp-item', _$gridlist2).remove();
							}

							var _data2 = obj.data('applinedata2');
							if ($.isArray(_data2)) {
								_vlist = _data2;
							} else {
								if (_data2 == '') {
									_vlist = [];
								} else {
									_vlist = _data2.split(';');
								}
							}

							$.each(_vlist, function (i, v) {
								var chkchanged = false;
								var _org = new $org.data.org(v);

								if ($.isArray(_changedlist)) {
									$.inArray(_org.oinfo.key, _changedlist) > -1 ? (chkchanged = true) : '';
								} else {
									_org.oinfo.key == _changedlist ? (chkchanged = true) : '';
								}

								var _$item = $(
									"<div class='dwp-item dwp-cursor org-type'>" + _org.getDispName() + "<button type='button' class='btn-cancel'>del</button></div>"
								).appendTo(_$list).data('orgdata', _org.oinfo);

								chkchanged ? _$item.addClass('changed') : '';
								if (_$item.type == 'B') {
									_$item.addClass('is-folder');
								}

								_$item.on('click', function (e) {
									if (e.currentTarget === this) {
										$(this).toggleClass('active');
									}
								});
								$('button', _$item).on('click', function () {
									$(this).parent().remove();
								});
							});
						}
					}
				} else {
					var _$list = $('div.dwp-list-body', _$gridlist);

					if ($.isArray(_data)) {
						_vlist = _data;
					} else {
						if (_data == '') {
							_vlist = [];
						} else {
							_vlist = _data.split(';');
						}
					}
					//_vlist = _data;
					$.each(_vlist, function (i, v) {
						var chkchanged = false;

						var _org = new $org.data.org(v);

						if ($.isArray(_changedlist)) {
							$.inArray(_org.oinfo.key, _changedlist) > -1 ? (chkchanged = true) : '';
						} else {
							_org.oinfo.key == _changedlist ? (chkchanged = true) : '';
						}

						var _$item = $(
							"<div class='dwp-item dwp-cursor org-type'>" +
							_org.getDispName() +
							"<button type='button' class='btn-cancel'>del</button></div>"
						).appendTo(_$list).data('orgdata', _org.oinfo);

						chkchanged ? _$item.addClass('changed') : '';
						if (_$item.type == 'B') {
							_$item.addClass('is-folder');
						}

						_$item.on('click', function (e) {
							if (e.currentTarget === this) {
								$(this).toggleClass('active');
							}
						});
						$('button', _$item).on('click', function () {
							$(this).parent().remove();
						});
					});
				}

				editopt.Arg5 = editopt.AppName;
				editopt.Arg6 = apltype;

				_me.setAppLineEdit(
					editopt.dbpath,
					editopt,
					$dialog,
					null,
					_$dialog,
					editopt
				);

				$dialog.close();
			},
			/*
						by mjkim 20250228 2,3단에서 결재선 불러오기 가능하도록 sdocstep 추가
			*/


			applineload: function (doc, title, act, $pdialog, apltype, sdocstep) {
				var _me = this,
					opt = doc.options,
					el = doc.element,
					_form = '',
					_wd = 524;

				_form = 'wFrmAppLineList';
				_param = '&AppLineCat=' + apltype;
				sdocstep = !sdocstep ? "1" : sdocstep;		//20250326 수신자 불러오기 안됨

				var _Dailog = $fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: false,
					title: title,
					actions: act,
					width: _wd,
					//	height: _hi,
					show: 'fade', //effect
					hide: 'fade', //effect
					initcallback: function (_$dialog) {
						var _url = $fn.getProxyUrl(
							'/' +
							opt.appComCfg.ADBpath +
							'/api/data/collections/name/nViw01_' +
							apltype +
							/*
								by mjkim 20250226 sdocstep 차수 구분
							*/
							"_sdocstep" +

							'?count=999&category=' + sdocstep + '_{orgcode}'
						);
						var _data = _me.getViewData(_url);
						var _$item = null;
						var _el = $('div.list', _$dialog.element); //$("div.list-area", _$dialog.element);

						$.each(_data, function (i, o) {
							//console.log(o);
							var aptype = '';
							var stdiv = '';
							var mdata = $fn.formatDateTime(o._lasteditdate, 'dateonly');

							o._appLinetype == '0' ? (aptype = $fn.getCodeMsg('aprv.title.h068')) : (aptype = $fn.getCodeMsg('aprv.title.h069'));

							if (o._changed == '1') {
								// 데이터 변경사항이 있는경우 색상표기
								stdiv = "<div class='item changed'>";
							} else {
								stdiv = "<div class='item'>";
							}

							_$item = stdiv + "<div class='category'><a>" + aptype + '</a></div>';
							_$item += "<div class='subject'><a>" + o._applinename + '</a></div>';

							//개인결재선 상세조회 추가 - 2024.03.05 by dwlee
							var _line = o._applinedata;
							_$item += '<div class="detail-area" data-info="' + _line + '"style="width:26px;"><a><img src="/tcclibs/images/common/icon-blank.svg" style="width:15px;"></a></div>';

							_$item += "<div class='biz'><a><span data-type='profile' data-empno='" + o._authorempno + "' data-orgcode='" +
								o._authororgcode + "'><img src='" + $fn.getPath('weblib') + "/images/common/icon-namecard.svg' alt=''></span></a></div>";
							_$item += "<div class='date'><a>" + mdata + '</a></div>';

							//자기가 작성하지 않은 결재선 삭제는 금지 - 2024.03.05 by dwlee
							//_$item += "<div class='del-area'><a><img src='" + $fn.getPath('weblib') + "/images/common/btn-cancel.svg' alt=''></a></div>";
							if (o._authorempno == $fn.getCurUser().pinfo.empno || $fn.getCurUser().pinfo.empno == "P00001") {
								_$item += "<div class='del-area'><a><img src='" + $fn.getPath('weblib') + "/images/common/btn-cancel.svg' alt=''></a></div>";
							} else {
								_$item += "<div class='del-area'><a class='dwp-hidden'><img src='" + $fn.getPath('weblib') + "/images/common/btn-cancel.svg' alt=''></a></div>";
							}

							_$item += '</div>';
							_$item = $(_$item);

							$(_$item).appendTo(_el)
								.data('applinedata', o._applinedata)
								.data('isdblapr', o._isdblapr)
								.data('sapplistdbl', o._sapplistdbl)
								.data('applinedata2', o._applinedata2)
								.data('unid', o['@unid'])
								.data('AppName', o._applinename)
								.data('dbpath', opt.appComCfg.ADBpath)
								.data('changed', o._changed)
								.data('changedlist', o._changedlist);

							_$item.on('click', function (e) {
								if (e.currentTarget === this) {
									$('div.active', $(this).parent()).removeClass('active');
									$(this).toggleClass('active');
								}
							});

							_$item.dblclick(function (e) {
								if (e.currentTarget === this) {
									var editopt = new Object();
									editopt.dbpath = '/' + opt.appComCfg.ADBpath;
									editopt.docid = o['@unid'];
									editopt.AppName = o._applinename;

									//_me.applineloading(o._applinedata,_$dialog,$pdialog,apltype,editopt);
									_me.applineloading($(this), _$dialog, $pdialog, apltype, editopt);
								}
							});

							//상세조회 - 2024.03.05 by dwlee
							$(".detail-area", _$item).on("click", function () {
								var _this = this;
								var _aprlines = $(_this).data('info');
								var _lineArr = _aprlines.split("},");

								var _html;
								_html = "<div class='row head dwp-grouping' style='height:35px;width:100%; background-color:#eee; border-top:1px solid #cfcfcf;border-bottom:1px solid #cfcfcf'>";
								_html += "<div class='key type dwp-bold dwp-center' style='width:7%;border-left:1px solid #cfcfcf'>순번</div>";
								_html += "<div class='key type dwp-bold dwp-center' style='width:20%;border-left:1px solid #cfcfcf'>결재타입</div>";
								_html += "<div class='value dwp-bold dwp-center' style='width:73%;border-left:1px solid #cfcfcf;'>결재자</div>";
								_html += "</div>";
								//console.log("=========================================");
								for (var i = _lineArr.length; i > 0; i--) {
									var obj = _lineArr[i - 1];
									var setval = _$$.aprv.com.getObjStr(_$$.aprv.line.PROP.APP.TLIST, _lineArr[i - 1], '^', ';', _$$.aprv.line.PROP.APP.KEY);
									var obj = setval[0];

									_html += "<div class='row head dwp-grouping' data-empno='" + obj.empno + "' style='height:35px;width:100%;border-bottom:1px solid #cfcfcf'>";
									_html += "<div class='key key-num type dwp-center' style='width:7%;border-left:1px solid #cfcfcf'>" + obj.appindex + "</div>";

									if (obj.hasOwnProperty("h_type")) {
										_html += "<div class='key type dwp-center' style='width:20%;border-left:1px solid #cfcfcf'>" + $fn.getCodeMsg("aprv.actions." + obj.h_type) + "</div>"; //기안
									} else {
										if (obj.apptype == "AP") {
											_html += "<div class='key type dwp-center' style='width:20%;border-left:1px solid #cfcfcf'>결재</div>";
										} else {
											_html += "<div class='key type dwp-center' style='width:20%;border-left:1px solid #cfcfcf'>협조</div>";
										}
									}


									_html += "<div class='value' style='width:73%;border-left:1px solid #cfcfcf'>";
									_html += "	<div class='info-area dwp-left'>";
									_html += "		<div class='dwp-user' data-type='profile' data-empno='" + obj.empno + "' data-orgcode='" + obj.orgcode + "'>";
									_html += "			<div class='profile-info'>";
									_html += "				<div class='name'>" + $fn.getCurLangMsg(obj.username) + "</div>";
									_html += "				<div class='rank'>" + $fn.getCurLangMsg(obj.duty) + "</div>";
									_html += "				<div class='team'>" + $fn.getCurLangMsg(obj.orgname) + "</div>";
									//} else {
									//	_html += "				<div class='team'>" + $fn.getCurLangMsg(obj.orgname) + "</div>";
									//}
									_html += "			</div>";
									_html += "		</div>";
									_html += "	</div>";
									_html += "</div>";

									_html += "</div>";

									//setval[0].appindex, setval[0].apptype , app
									//console.log("setval : " , setval);
								}
								//console.log("_lineArr : " , _lineArr);
								//console.log("=========================================");

								var _buttons = [
									{
										"title": "닫기"
										, "click": function (obj) {
											obj.close();
										}
									}
								];
								$fn.dialog(null, {
									modal: true
									, resizable: true
									, draggable: true
									, islangconvert: false
									, title: "결재선 정보"		// 상세정보
									, width: 600
									, show: 'fade'			//effect
									, hide: 'fade'			//effect
									, buttons: _buttons
									, content: { html: _html, data: {} }
								});
							});
							$('.del-area', _$item).on('click', function () {
								var _data = new Object(),
									_obj = $(this).parent();
								_data.actiontype = 'AppLineRemove';
								_data.Arg1 = $(this).parent().data('unid');

								$fn.confirm({
									msg: $fn.getCodeMsg('aprv.msg.018')
								}).done(function () {
									_me.PostAppline(
										'/' + opt.appComCfg.ADBpath,
										_data,
										_$dialog,
										_obj,
										$pdialog
									);
								});

								return false;
							});

							/* BizCard 처리 */
							$("[data-type='profile']", _el).off('click').on('click', function () {
								$dwp.ui.bizcard.init($(this));
							});

							$("[data-type='AppHistory']", _el).on('click', function () {
								_$$.aprv.com.AppHistory($doc, $fn.getCodeMsg('aprv.title.h018'));
							});
						});
					},
					buttons: [{
						title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
						css: 'confirm',
						click: function (_$dialog) {
							var _de = _$dialog.element;
							var _el = $('div.list', _de),
								obj = $('div.active', _el),
								editopt = new Object();

							editopt.dbpath = '/' + obj.data('dbpath');
							editopt.docid = obj.data('unid');
							editopt.AppName = obj.data('AppName');

							//_me.applineloading(obj.data("applinedata"),_$dialog,$pdialog,apltype,editopt);
							_me.applineloading(obj, _$dialog, $pdialog, apltype, editopt);
						}
					},
					{
						title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
						css: 'cancel',
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					],
					content: {
						url: $fn.getProxyUrl(
							'/' + opt.appComCfg.ADBpath + '/' + _form + '?OpenForm' + _param
						)
					},
					open: function (_$dialog) {
						// console.log("open");
					},
					close: function (_$dialog) {
						// console.log("close");
					}
				});
			},


			//결재양식 내에서 기본 결재선 설정 버튼 클릭시 - 2023.07.10 by dwlee
			applinedefaultset: function (doc, act, apltype) {
				var _me = this, _opt = doc.options, _el = doc.element;
				var _sendfld = _opt.appCfg.ProcesStep == "2" ? "ConductFull" : "Circulation3Full";
				var _sendval = $("[name='" + _sendfld + "']", _el).size() > 0 ? $("[name='" + _sendfld + "']", _el).val() : "";

				//by mjkim 20241227 1라인 기본결재선 저장 불가
				if ($("input[name='sAppList" + _opt.sDocStep + "']", _el).xval().split("`}")[1] == "") {
					$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.071") })
					return;
				}

				var _sopt = {
					actiontype: act,
					Arg1: 'sAppList' + _opt.sDocStep,
					Arg2: $("input[name='sAppList" + _opt.sDocStep + "']", _el).xval(),
					Arg3: _sendfld,
					Arg4: _sendval,
					Arg5: $fn.getCurLangMsg(_opt.appCfg.sDisFormAlias) + "(Default)",					//applineuser, applinedept
					Arg6: apltype,								//applineuser, applinedept
					Arg7: "1",									//개인결재선 : "1", 부서결재선 : "0"
					Arg8: "1",									//양식별 기본결재선 - OK
					Arg9: _opt.appCfg.FormAlias,				//양식코드
					Arg10: _opt.appCfg.sDisFormAlias,			//양식명	
					/*
						by mjkim 20250228 2단/3단에서는 기본결재선을 사용하지 않지만 구조를 맞쳐주기 위해 1단일 경우값 저장				
					*/
					Arg11: _opt.sDocStep,						//결재차수
					IsDblApr: $("input[name='IsDblApr']", _el).xval(),					//이중결재사용여부
					sAppListDbl: $("input[name='sAppListDbl']", _el).xval()				//이중결재세팅
				};
				_me.PostAppline('/' + _opt.appComCfg.ADBpath, _sopt, null, null, null, null);
			},

			//외부수신자 검색 - 2023.02.13 by dwlee
			outreceivesearch: function (doc, title, $pdialog) {
				var _me = this,
					$org = $dwp.ui.org,
					opt = doc.options,
					el = doc.element,
					_form = '',
					_wd = 800,
					_hi = 680;

				_form = 'wFrmReceiveSearch';
				var _Dailog = $fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: false,
					title: title,
					width: _wd,
					height: _hi,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [
						{
							title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
							css: 'confirm',
							click: function (_$dialog) {
								var _de = _$dialog.element;

								var _$chks = $("input[name=outreceiver]:checked", _de);
								if (_$chks.size() == 0) return;

								//console.log(_$chks.size());

								/*
								_$checkbox.data("code", data.code);
								_$checkbox.data("name", data.name);
								_$checkbox.data("chief", data.chief);
								_$checkbox.data("fullname", data.fullname);		
								
								Me.m_type 		= StrToken(src, sep, 1)		'1.type				==> B
								Me.m_teamname 	= StrToken(src, sep, 2)		'2. 부서명			==> name
								Me.m_fullorgcd	= StrToken(src, sep, 4)			'4.전체부서코드			==> 
								Me.m_teamcode	= StrToken(src, sep, 5)		'5.부서코드			==> code
								Me.m_parorgcode	= StrToken(src, sep, 6)		'6.상위부서코드			==> 
								me.m_chief		= StrToken(src, sep, 7)		'7.부서장			==> chief : chief가 없으면  name+"장"으로 처리
								me.m_filer		= StrToken(src, sep, 8)		'8.접수담당자			==> 
								Me.m_comcode 	= StrToken(src, sep, 11)		'11.회사코드			==> code
								Me.m_displaynm	= StrToken(src, sep, 12		'12. 표시용부서명		==> chief 
								me.m_comname    = StrToken(src, sep, 13)    			'13. 회사명			==> name
								me.m_etc    	= StrToken(src, sep, 14)    			'14. 기타			==> out								
								*/
								var _vlist = [];
								$.each(_$chks, function (idx, chk) {
									var _tmp = "";
									var _chief = "";
									var _$obj = $(chk).closest(".dwp-checkbox");

									if (!_$obj.hasOwnProperty("chief")) {
										_chief = _$obj.data("name") + "장";
									} else {
										_chief = _$obj.data("chief")
									}
									_tmp = "B^" + _$obj.data("name");
									_tmp += "^^^" + _$obj.data("code");
									_tmp += "^^" + _chief;
									_tmp += "^^^^" + _$obj.data("code");
									_tmp += "^" + _chief;
									_tmp += "^" + _$obj.data("name")
									_tmp += "^external";
									_vlist.push(_tmp);

									// DEPT: "type^orgname^^fullorgcode^orgcode^porgcode^chief^filer^^^comcode^dorgname^comname^etc"

								});

								var _$gridlist = $org._getGrid($pdialog);
								var _$list = $('div.dwp-list-body', _$gridlist);

								$.each(_vlist, function (i, v) {
									var _org = new $org.data.org(v);

									//console.log("v : " + v);
									//console.log(_org.oinfo);

									var _$item = $(
										"<div class='dwp-item dwp-cursor org-type dwp-blue'>" +
										_org.getDispName() +
										"<button type='button' class='btn-cancel'>del</button></div>"
									).appendTo(_$list).data('orgdata', _org.oinfo);

									//중복체크를 해야 함....
									_$item.addClass('is-folder');
									_$item.on('click', function (e) {
										if (e.currentTarget === this) {
											$(this).toggleClass('active');
										}
									});
									$('button', _$item).on('click', function () {
										$(this).parent().remove();
									});
								});
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
						url: $fn.getProxyUrl(opt.mngdb + '/' + _form + '?OpenForm')
					},
					open: function (_$dialog) {
						var _de = _$dialog.element;

						function actSearch() {
							var _input = $("input[name=query]", _de).xval();
							if (_input == "") {
								$fn.alert({ msg: "검색어를 입력하세요" });
								return;
							} else if (_input.length == 1) {
								$fn.alert({ msg: "검색어는 최소 2글자 이상으로 입력하세요" });
								return;
							} else {
								$fn.xAjax({
									url: $fn.getProxyUrl(opt.mngdb + "/wLdapSearch?OpenAgent"),
									type: "GET",
									dataType: "text",
									async: true,
									cache: false,
									data: { search: _input, style: "", receive: $("input[name=selrange]", _de).xval() }
								}).done(function (jdata) {
									//console.log("================================================");
									//console.log(jdata);
									if (jdata != "") {
										var _$nodearea = $(".info-wrap", _de);
										_$nodearea.html("");
										var _jsondata = JSON.parse(jdata);

										var _keylist = "==>";

										$.each(_jsondata, function (idx, data) {
											//console.log(data.name);
											if (data.hasOwnProperty("name")) {
												if (_keylist.indexOf(":" + data.code + ":") < 1) {

													var _$row = $("<div class='dwp-row'></div>");
													var _$div = $("<div class='dwp-value' style='width:40px'></div>");
													var _class = "";
													if (data.sendyn == "Y") {
														var _$checkbox = $("<div class='dwp-checkbox'></div>");
														_$checkbox.data("code", data.code);
														_$checkbox.data("name", data.name);
														_$checkbox.data("chief", data.chief);
														_$checkbox.data("fullname", data.fullname);
														var _$label = $("<label></label>");
														_$label.append("<input type='checkbox' name='outreceiver'>");
														_$label.append("<span class='dwp-bold dwp-blue'></span>");
														_$label.appendTo(_$checkbox);
														_$checkbox.appendTo(_$div);
														_class = "dwp-bold dwp-blue";
													} else {
														var _$dspname = $("<div class='dwp-value dwp-light'><span></span></div>");
														_$dspname.appendTo(_$div);
														_class = "dwp-light";
													}
													_$div.appendTo(_$row);

													var _$title = $("<div class='dwp-value'><span class='" + _class + "'>" + data.name + "</span>(" + data.fullname.replace(/ /gi, "-") + ")" + "</div>");
													_$title.appendTo(_$row);
													_$row.appendTo(_$nodearea);

													_keylist += ":" + data.code + ":";
												}
											} else {
												var _$node = $("<div>검색된 결과가 없습니다.</div>");
												_$node.appendTo(_$nodearea);
											}
										});
									} else {
										var _$node = $("<div>검색된 결과가 없습니다.</div>");
										_$node.appendTo(_$nodearea);
									}
									//console.log("================================================");
								});
							}
						}
						$(".dwp-search-btn", _de).off("click").on("click", function () {
							actSearch();
						});

						$("input[name='query']", _de).off("keydown").on("keydown", function (e) {
							if (e.keyCode != "13") { return; }
							actSearch();
						}).focus();
					},
					close: function (_$dialog) {
						// console.log("close");
					}
				});
			},

			applinesave: function (doc, title, act, $pdialog, apltype, sdocstep, opts) {
				var _me = this,
					opt = doc.options,
					el = doc.element,
					_form = '',
					_wd = 520,
					_hi = 240,
					_param = '',
					_opts = $.extend({ apptype: "" }, opts);

				_form = 'wFrmAppLineSave';
				_param = '&AppLineCat=' + apltype;

				var _Dailog = $fn.dialog(null, {
					modal: true,
					resizable: false,
					draggable: true,
					islangconvert: false,
					title: title,
					actions: act,
					width: _wd,
					height: _hi,
					show: 'fade', //effect
					hide: 'fade', //effect
					buttons: [{
						title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
						css: 'confirm',
						click: function (_$dialog) {
							var _de = _$dialog.element;
							var aplnm = _$$.aprv.com.getFld('applinename', _de);

							if (aplnm == '') {
								$fn.alert({
									msg: $fn.getCodeMsg('aprv.title.h066')
								});
								return false;
							}

							var _rtn = _$$.aprv.org._getGridData($pdialog);

							var _data = _$$.aprv.org.setappval(_rtn, $pdialog, doc, false);
							// console.log("_data",_data);
							_data.actiontype = act;
							_data.Arg5 = aplnm;
							_data.Arg6 = apltype;

							_data.Arg7 = $('input[name="applinetype"]', _de).xval();
							//_data.Arg7 = $(':radio[name="applinetype"]:checked', _de).val();

							//양식별 기본 결재선 처리 - 2023.07.07 by dwlee
							_data.Arg8 = $('input[name="usedefault"]', _de).xval();
							if (_data.Arg8 == "1") {
								_data.Arg9 = $("input[name=FormCode]", _de).xval();				//양식코드
								_data.Arg10 = $("input[name=FormName]", _de).xval();				//양식명
							}
							/*
					by mjkim 20250228 sdocstep을 추가하여 Arg11전달달 					
				*/
							_data.Arg11 = (typeof sdocstep == "undefined" ? "1" : sdocstep);
							_me.PostAppline('/' + opt.appComCfg.ADBpath, _data, _$dialog, null, $pdialog, opts);
						}
					},
					{
						title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
						css: 'cancel',
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					],
					content: {
						url: $fn.getProxyUrl('/' + opt.appComCfg.ADBpath + '/' + _form + '?OpenForm' + _param)
					},
					open: function (_$dialog) {
						//var _pht = '';
						//apltype == 'applineuser' ? (_pht = 'aprv.title.h066') : (_pht = 'aprv.title.h072');
						//$("input[name='applinename']", _$dialog.element).attr('placeholder', $fn.getCodeMsg(_pht));

						var _de = _$dialog.element;
						//라디오 클릭시 placeholder 교체하도록 변경 - 2023.07.07 by dwlee
						var _pht = '';
						var _$input = $("input[name='applinename']", _de);
						var _$radio = $("input[name='applinetype']", _de);
						var _$default = $('input[name="usedefault"]', _de);

						apltype == 'applineuser' ? (_pht = 'aprv.title.h066') : (_pht = 'aprv.title.h072');
						_$input.attr('placeholder', $fn.getCodeMsg(_pht));

						_$radio.off("click").on("click", function () {
							var _$this = $(this);
							if (_$this.xval() == "0") { //부서
								_$input.attr('placeholder', $fn.getCodeMsg('aprv.title.h072'));

								_$default.xval("");
								_$default.prop("disabled", true);
							} else { //개인
								_$input.attr('placeholder', $fn.getCodeMsg('aprv.title.h066'));

								_$default.prop("disabled", false);
							}
						});
						//양식명과 양식코드 저장 - 2023.07.07 by dwlee
						$("input[name=FormCode]", _de).xval(opt.appCfg.FormAlias);					//양식코드
						$("input[name=FormName]", _de).xval(opt.appCfg.sDisFormAlias);				//양식명
						$(".dwp-aprform", _de).html($fn.getCurLangMsg(opt.appCfg.sDisFormAlias) + "의 기본결재선");
					},
					close: function (_$dialog) {
						// console.log("close");
					}
				});

				//console.log("_Dailog",_rptDailog);
			},
			AprvPwVerify: function (opt) {
				var _me = this,
					_pinfo = $dwp.core.getCurUser().pinfo,
					_opt = $.extend({}, opt),
					_form = 'wFrmAprvPwChkDialog';

				//console.log("_pinfo.aprvinfo.pwdchk : ", _pinfo.aprvinfo.pwdchk);

				if (_pinfo.aprvinfo.pwdchk != 'Y') {
					if (typeof _opt.callback == 'function') {
						_opt.callback();
					}
					return;
				}
				//console.log("_opt.continue : ", _opt.continue);

				//연속결재에서 첫번째 결재문서만 비번 체크 - 2020.10.15 by dwlee
				if (_opt.hasOwnProperty("continue") && _opt.continue.isset == "1" && _opt.continue.isfirst != "y") {
					if (typeof _opt.callback == 'function') {
						_opt.callback();
					}
					return;
				}

				function _PwVerify(_$dialog) {
					var _$did = _$dialog.element;

					$('input[name=_tmp]', _$did).focus();

					if ($('input[name=VerifyPassword]', _$did).val() == '') {
						$fn.alert({ msg: $fn.getCodeMsg('aprv.title.h119') });
						return false;
					}

					$fn.xAjax({
						url: $('form', _$did).get(0).action,
						type: 'POST',
						dataType: 'json',
						data: $('form', _$did).serializeArray(),
						success: function (retData, status, xhr) {
							if (retData.result == '200') {
								if (retData.msgcode == 'ok') {
									_$dialog.close();

									// 결재창 Open;
									if (typeof _opt.callback == 'function') {
										_opt.callback();
									}
								} else {
									$fn.alert({
										msg: $fn.getCodeMsg('aprv.msg.037')
									});
									return false;
								}
							}
						},
						error: function (xhr, status, e) {
							var message = status + ' ' + e;
							console.log(message);
						}
					});
				}

				var _Dailog = $fn.dialog(null, {
					modal: true,
					title: $fn.getCodeMsg('aprv.title.h118'),
					resizable: false,
					draggable: true,
					islangconvert: true,
					width: '420px',
					height: 'auto',
					show: 'fade',
					hide: 'fade',
					content: {
						url: '/dwp/aprv/com/aprvmng.nsf/' + _form + '?OpenForm'
					},
					initcallback: function (_$dialog) {
						var _$did = _$dialog.element;
						$('input[name=VerifyPassword]', _$did).off('keydown').on('keydown', function (e) {
							if (e.keyCode != 13) {
								return;
							}
							e.preventDefault();
							_PwVerify(_$dialog);
						});
					},
					buttons: [{
						title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
						css: 'confirm',
						click: function (_$dialog) {
							_PwVerify(_$dialog);
						}
					},
					{
						title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
						css: 'cancel',
						click: function (_$dialog) {
							_$dialog.close();
						}
					}
					]
				});
			},

			// 참조자 저장 (작성시) - 2024.03.05 by jwlee
			referlinesave: function (doc) {																// _$$.aprv.com
				var _btnConfirm = function (_$dialog) {
					var _de = _$dialog.element;
					var _linename = _$$.aprv.com.getFld("referlinename", _de);
					if (_linename == "") {
						$fn.alert({ msg: $fn.getCodeMsg('aprv.title.h154') }).done(function () {	// 저장할 명칭(참조자)을 입력하세요.
							_$$.aprv.com.focusFld("referlinename", _de);
						});
						return false;
					}

					var _rurl = $fn.getProxyUrl('/' + opt.appComCfg.ADBpath + '/wcmdpost?createdocument');
					var _rdata = {};
					_rdata.actiontype = "ReferLineSave";
					_rdata.Arg1 = _$$.aprv.com.getFld("sReferenceUsers", doc.element);
					_rdata.Arg2 = _$$.aprv.com.getFld("sReferenceUsersFull", doc.element);
					_rdata.Arg5 = _linename;

					var _rcallback = function (_data) {
						// 처리가 완료 되었습니다.
						$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.006') }).done(function () {
							_$dialog.close();
						});
					}

					_me.CmdPost(_rurl, _rdata, _rcallback);
				}

				var _refer = $("input[name='sReferenceUsers']", doc.element).xval();
				if (_refer == "") {
					$fn.alert({ msg: $fn.getCodeMsg('aprv.title.h155') });		// 지정된 참조자가 없습니다.
					return false;
				}

				var _me = this, opt = doc.options, el = doc.element;
				var _url = $fn.getProxyUrl('/' + opt.appComCfg.ADBpath + '/wFrmReferLineSave?OpenForm');

				var _buttons = [
					{
						title: $fn.getCodeMsg('aprv.btn.b0001')		// 확인
						, css: "confirm"
						, click: function (_$dialog) {
							_btnConfirm(_$dialog);
						}
					}
					, {
						title: $fn.getCodeMsg('aprv.btn.b0002')		// 닫기
						, css: 'cancel'
						, click: function (_$dialog) {
							_$dialog.close();
						}
					}
				];
				var _dialog_initcallback = function (_$dialog) {
					var _el = _$dialog.element;

					$("input[name='referlinename']", _el).off().on("keydown", function (e) {
						if (e.keyCode == 13) {
							_btnConfirm(_$dialog);
						}
					})
				}

				var _dialog = $fn.dialog(null, {
					modal: true
					, resizable: false
					, draggable: true
					, islangconvert: false
					, title: $fn.getCodeMsg('aprv.title.h051')		// 저장
					, width: 500
					, show: 'fade'
					, hide: 'fade'
					, content: { url: _url }
					, buttons: _buttons
					, initcallback: _dialog_initcallback
				});
			},
			// 참조자 로딩 (작성시) - 2024.03.05 by jwlee
			referlineload: function (doc, title, act) {													// _$$.aprv.com
				var _btnConfirm = function (_$dialog, _data) {
					//console.log(_data);

					$("input[name='sReferenceUsers']", doc.element).xval(_data.sreferenceusers);
					$("input[name='sReferenceUsersFull']", doc.element).xval(_data.sreferenceusersfull);

					var _namepicker = $("[name='OrgRefer']", doc.element).find(".namepicker-target");
					if ($(_namepicker).size() > 0) {
						$(_namepicker).remove();
					}
					$("[name='OrgRefer']", doc.element).orgsel();
					_$dialog.close();
				}

				var _me = this, opt = doc.options, el = doc.element;
				var _url = $fn.getProxyUrl('/' + opt.appComCfg.ADBpath + '/wFrmReferLineList?OpenForm');

				var _buttons = [
					{
						title: $fn.getCodeMsg('aprv.btn.b0001')		// 확인
						, css: "confirm"
						, click: function (_$dialog) {
							var _de = _$dialog.element;
							var _el = $('div.list', _de),
								obj = $('div.active', _el);

							var _data = {};
							_data.unid = obj.data("unid");
							_data.referlinename = obj.data("referlinename");
							_data.sreferenceusers = obj.data("sreferenceusers");
							_data.sreferenceusersfull = obj.data("sreferenceusersfull");
							_btnConfirm(_$dialog, _data);
						}
					}
					, {
						title: $fn.getCodeMsg('aprv.btn.b0002')		// 닫기
						, css: 'cancel'
						, click: function (_$dialog) {
							_$dialog.close();
						}
					}
				];
				var _dialog_initcallback = function (_$dialog) {

					var _url = $fn.getProxyUrl("/" + opt.appComCfg.ADBpath + "/api/data/collections/name/nViw03_user?count=999&category={empno}");
					var _data = _me.getViewData(_url);

					var _el = $("div.list", _$dialog.element);
					$(_el).empty();

					if ($(_data).size() == 0) {
						var _h = '';
						_h += '<div class="dwp-center" style="width:100%;height:100px;line-height:100px;">' + $fn.getCodeMsg('aprv.title.h162') + '</div>';		// 등록된 참조결재선이 없습니다.
						$(_el).html(_h);
					}

					$.each(_data, function (i, o) {
						var _cnt = o._sreferenceusersfull.split(";");

						var _h = '';
						_h += '<div class="item dwp-cursor" style="border-bottom:1px solid #cfcfcf;">';
						_h += '<div class="datetime" style="width:180px;">' + $fn.formatDateTime(o._createddatetime) + '</div>';
						_h += '<div class="subject">' + o._referlinename + ' (' + $(_cnt).size() + ')' + '</div>';
						_h += '<div class="detail-area" style="width:26px;"><a><img src="' + $fn.getPath('weblib') + '/images/common/icon-blank.svg" style="width:15px;"></a></div>';
						_h += '<div class="del-area"><a><img src="' + $fn.getPath('weblib') + '/images/common/btn-cancel.svg"></a></div>';
						_h += '</div>';

						var _$item = $(_h);

						$(_$item).appendTo(_el)
							.data("unid", o["@unid"])
							.data("referlinename", o._referlinename)
							.data("sreferenceusers", o._sreferenceusers)
							.data("sreferenceusersfull", o._sreferenceusersfull);

						$(_$item).on("click", function (e) {
							if (e.currentTarget === this) {
								$("div.active", $(this).parent()).removeClass("active");
								$(this).toggleClass("active");
							}
						});

						$(_$item).on("dblclick", function (e) {
							if (e.currentTarget === this) {
								var _data = {};
								_data.unid = o["@unid"];
								_data.referlinename = o._referlinename;
								_data.sreferenceusers = o._sreferenceusers;
								_data.sreferenceusersfull = o._sreferenceusersfull;
								_btnConfirm(_$dialog, _data);
							}
						});

						$(".detail-area", _$item).on("click", function () {
							var _this = this;
							var _referenceusers = $(_this).parent().data('sreferenceusers').split(";");
							var _referenceusersfull = $(_this).parent().data('sreferenceusersfull').split(";");

							var _dialog_open = function (evt, ui) {
								var _this = $(this);
								$("[data-type='profile']", _this).off("click").on("click", function () {
									$dwp.ui.bizcard.init($(this));
								});
								$fn.getPicError($('img', _this));
							}

							var _h = '';
							_h += '<div class="namepicker-list ui-sortable" style="max-height:200px;">';
							_h += '<div class="namepicker-target dwp-cursor">';
							$.each(_referenceusersfull, function (i, v) {
								var _info = v.split("^");
								var _user = $fn.getCurLangMsg(_info[1]) + "/" + $fn.getCurLangMsg(_info[8]) + "/" + $fn.getCurLangMsg(_info[11]);
								_h += '<div class="dwp-cursor" data-type="profile" data-empno="' + _info[2] + '" data-orgcode="' + _info[4] + '" style="display:inline-block;padding:5px;">';
								_h += '<span class="photo">';
								_h += '<img src="' + $dwp.core.getPath('pic', { empno: _info[2] }) + '"/>';
								_h += '</span>';
								_h += '<span class="name">' + _user + '</span>';
								_h += '</div>';
							});
							_h += '</div>';
							_h += '</div>';

							var _buttons = [
								{
									"title": "닫기"
									, "click": function (obj) {
										obj.close();
									}
								}
							];
							$fn.dialog(null, {
								modal: true
								, resizable: true
								, draggable: true
								, islangconvert: false
								, title: $fn.getCodeMsg('aprv.title.h163')		// 상세정보
								, width: 600
								, show: 'fade'			//effect
								, hide: 'fade'			//effect
								, buttons: _buttons
								, content: { html: _h, data: {} }
								, open: _dialog_open
							});
						});

						$(".del-area", _$item).on("click", function () {
							var _this = this;
							$fn.confirm({ msg: $fn.getCodeMsg('aprv.msg.018') }).done(function () {				// 삭제 하시겠습니까?
								var _rurl = $fn.getProxyUrl('/' + opt.appComCfg.ADBpath + '/wcmdpost?createdocument');
								var _rdata = {};
								_rdata.actiontype = "ReferLineRemove";
								_rdata.Arg1 = $(_this).parent().data('unid');

								var _rcallback = function (_data) {
									$fn.alert({ msg: $fn.getCodeMsg('aprv.msg.006') }).done(function () {		// 처리가 완료 되었습니다.
										_dialog_initcallback(_$dialog);
									});
								}

								_me.CmdPost(_rurl, _rdata, _rcallback);
							});
						})
					});
				}

				var _dialog = $fn.dialog(null, {
					modal: true
					, resizable: false
					, draggable: true
					, islangconvert: false
					, title: $fn.getCodeMsg('aprv.title.h052')		// 불러오기
					, width: 600
					, show: 'fade'
					, hide: 'fade'
					, content: { url: _url }
					, buttons: _buttons
					, initcallback: _dialog_initcallback
				});
			},

			// 즐겨찾기 업데이트 - 2024.03.06 by jwlee
			setBookmark: function (_key, _act, _dbpath, _callback) {
				var _url = $fn.getProxyUrl("/dwp/aprv/bookmark/aprvbookmark.nsf/wcmdpost?createdocument")
				var _data = {}
				_data.actiontype = "set_bookmark"
				_data.Arg1 = $dwp.core.info.cuser.pinfo.empno;
				_data.Arg2 = _dbpath;
				_data.Arg3 = $.isArray(_key) ? _key.join(";") : _key;
				_data.Arg4 = _act

				$fn.xAjax({
					url: _url,
					data: _data,
					method: "POST",
					dataType: "json",
					async: true
				}).done(function (_ret) {
					if (_ret.result != "200") {
						$fn.alert({ msg: _ret.msgcode });
						return false;
					}
					if (typeof (_callback) == "function") _callback(_ret);
				}).fail(function (req, error) { });
			},
			// 즐겨찾기 가져오기 - 2024.03.06 by jwlee
			getBookmark: function (_dockeys, _callback) {
				var _data = {};
				_data.actiontype = "get_bookmark_list";
				_data.Arg1 = $dwp.core.info.cuser.pinfo.empno;
				_data.Arg2 = $.isArray(_dockeys) ? _dockeys.join(";") : _dockeys;

				$fn.xAjax({
					url: $fn.getProxyUrl("/dwp/aprv/bookmark/aprvbookmark.nsf/wcmdpost?createdocument"),
					data: _data,
					method: "POST",
					dataType: "json",
					async: true
				}).done(function (data) {
					if (typeof (_callback) == "function") _callback(data);
				}).fail(function (req, error) { });
			},

			//문서 수정(버전관리) - 2024.09.04 by dwlee
			versionedit: function (doc) {
				var _me = this;
				var _opt = doc.options;
				var _url = $fn.getProxyUrl(_opt.cdb + '/wcmdpost?createdocument');

				/*
								by mjkim 20250120 isopenver 추가
				*/


				var _callback = function (_data) {
					doc.editDocument({ actiontype: 'versave', docstatus: 'reg', param: { isopenver: "y" } });
				}

				var _data = {};
				_data.actiontype = "versioncopy";
				_data.Arg1 = _opt.unid;
				_data.Arg2 = _opt.aprdocversion.verpath; //현재 활성화된 버전관리 DB

				_me.CmdPost(_url, _data, _callback);
			},

			//문서 이력조회 - 2024.09.04 by dwlee
			versionview: function (doc) {
				var _me = this;

				var _opt = doc.options;

				//에디터별 서식선택 보기 유동적 호출 처리 - 2023.05.11
				var _el = doc.element;
				$fn.dialog(null, {
					title: $fn.getCodeMsg('aprv.btn.versionhistory'),
					width: 800,
					height: 640,
					docInstance: doc,
					modal: true,
					hide: { effect: 'fade', duration: 300 },
					show: { effect: 'fade', duration: 300 },
					content: {
						url: '/' + _opt.aprdocversion.verpath + '/wFrmView_Sel?ReadForm',
						data: {
							view: "wviwlistver",
							count: 15,
							single: _opt.key_unid,
						}
					}
				});

			},

			//ERP 전처리 함수 호출 - 2024.09.09 by dwlee
			erpValidate: function ($doc) {
				var _valid = true;
				var _$erp = $("input[name=ErpKey]", $doc.element);
				if (_$erp.size() < 1 || _$erp.xval() == "") return true;

				//전처리는 항상 신규 문서만 수행 - 2024.09.10 by dwlee
				if ($doc.options.isnew == false) return true;

				$fn.xAjax({
					url: "https://hub.hwasung.com/aproval/chkAprvSts",
					method: 'POST',
					dataType: 'json',
					async: false,
					cache: false,
					data: {
						"APRV_NO": _$erp.xval()
					},
				}).done(function (jsonData) {
					if (typeof jsonData == 'undefined') {
						$fn.alert({ msg: "ERP연동시 알수없는 오류가 발생하였습니다." });
						_valid = false;
					}
					if (jsonData.result.code == "E") {
						$fn.alert({ msg: jsonData.result.msg });
						_valid = false;
					}

				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);

					$fn.alert({ msg: req.responseText + '\n' + error });
					_valid = false;
				});
				return _valid;
			},

			// 신청서 선택 - 2024.12.31 by dwlee
			selectRequestForm: function (_$doc, _title, _formkey, _addRefer, _callback) {
				var _loadSettingConts = function (_tabid, _$dialog) {
					var _com_code = $fn.getCurUser().pinfo.comcode;
					var _empno = $fn.getCurUser().pinfo.empno;
					var _url = "";

					//출장신청서 관련 추가 - 2025.01.16 
					var _view = "wViwList33";
					var _single = _com_code + "^" + _formkey;
					if (_$doc.options.hasOwnProperty("singlekey") && _$doc.options.singlekey != "") {
						_view = "wViwList34";
						_single = _$doc.options.singlekey;
					}

					switch (_tabid) {
						case "dwp-tabs-done-content":
							_url = "/" + _$doc.options.appComCfg.LDBP1 + "/wFrmViewJ_Sel?ReadForm" +
								"&tabid=" + "dwp-tabs-done-content" +
								"&did=" + _$dialog.options.id +
								"&view=" + _view +  //출장신청서 관련 추가 - 2025.01.16 
								"&single=" + _single + //출장신청서 관련 추가 - 2025.01.16 
								"&count=" + "10" +
								"&use=" + "att";
							break;
						case "dwp-tabs-archive-content":
							var _dbpath = _$doc.options.appComCfg.KLDBP1;
							_dbpath = _dbpath.replace(/YYYY/gi, "cyear").replace(/QT/gi, "quarter");

							_url = "/" + _dbpath + "/wFrmViewJ_Sel?ReadForm" +
								"&tabid=dwp-tabs-archive-content" +
								"&did=" + _$dialog.options.id +
								"&view=" + _view +  //출장신청서 관련 추가 - 2025.01.16 
								"&single=" + _single + //출장신청서 관련 추가 - 2025.01.16 
								"&count=10" +
								"&use=att";
							break;
					}
					if (_url == "") return;

					$('#dwp-tabs-done-content', _$dialog.element).html('');
					$('#dwp-tabs-archive-content', _$dialog.element).html('');
					$fn.xAjax({
						type: "GET",
						url: $fn.getProxyUrl(_url),
						success: function (data, textStatus, xhr) {
							$("#" + _tabid, _$dialog.element).html(data);
						},
						error: function (xhr, status, e) {
						}
					});
				}
				// 관련문서 추가
				var _addReferDoc = function (_add) {
					var _me = this,
						_$bookmark = $("div[name='appbookmark']", _$doc.element),
						_$bodylist = $('div.dwp-table-body', _$bookmark),
						_$rbodylist = $('div.bookmark-list', _$bookmark),
						_$inp = $("input[name='refdocs']", _$bookmark);

					// 중복체크
					var __isDuplicate = function (_n) {
						var _rtn = false;
						$('div.dwp-row', _$bodylist).each(function (i, _obj) {
							var _list = $(this).data('_ROW_DATA');

							if (_list.hasOwnProperty('_openurl')) {
								if (_n._openurl == _list._openurl) {
									_rtn = true;
									return false;
								}
							} else {
								if (_n._runid == _o._runid && _n._rdbpath == _list._rdbpath) {
									_rtn = true;
									return false;
								}
							}
						});
						return _rtn;
					}
					var __resetVal = function () {
						var _rtn = [];
						$('div.dwp-row', _$bodylist).each(function () {
							var _o = $(this).data('_ROW_DATA');

							if (_o.hasOwnProperty('_openurl')) {
								_rtn.push(_$$.aprv.com.getObjStr(_$$.aprv.line.PROP.DOCLINK_SAVE, _o, '`}').fullinfo);
							} else {
								_rtn.push(_$$.aprv.com.getObjStr(_$$.aprv.line.PROP.BOOKMARK_SAVE, _o, '`}').fullinfo);
							}
						});

						if (_rtn.length > 0) {
							_$inp.val(_rtn.join(';'));
						} else {
							_$inp.val('');
						}
					}

					if (__isDuplicate(_add)) return;		// 중복체크

					var _$row = $("<div class='dwp-row dwp-cursor'></div>").appendTo(_$bodylist);
					_$row.data('_ROW_DATA', _add);

					var _category = $fn.getCurLangMsg(
						_add.hasOwnProperty('_sformtitle') ? _add._sformtitle : _add._rsformtitle
					);

					var _h = '';
					_h += '<div class="dwp-cell">';
					_h += '<div class="dwp-checkbox textless">';
					_h += '<label><input type="checkbox" class="dwp-chk"><span></span></label>';
					_h += '</div>';
					_h += '</div>';
					_h += '<div class="dwp-cell">' + _category + "</div>";
					_h += '<div class="dwp-cell">' + (_add.hasOwnProperty('_docnumber') ? _add._docnumber : _add._rdocnumber) + '</div>';
					_h += '<div class="dwp-cell dwp-left" align="left">&nbsp;&nbsp;&nbsp;&nbsp; ' + _add._subject + '</div>';

					_$row.append(_h);

					$('.dwp-cell', _$row).not(':eq(0)').off('click').on('click', function () {
						_$$.aprv.com._bookmarkOpen(_$doc, _add);
					});

					__resetVal();
				}
				var _h = '';
				_h += '<div class="dwp-gnb-setting-dialog">';
				_h += '<div class="dwp-tabs-simple">';
				_h += '<ul>';
				_h += '<li gubun="done"><a href="#dwp-tabs-done-content">' + $fn.getCodeMsg('aprv.title.done') + '</a></li>';				// 완료함
				_h += '<li gubun="archive"><a href="#dwp-tabs-archive-content">' + $fn.getCodeMsg('aprv.title.archive') + '</a></li>';	// 보관함
				_h += '</ul>';
				_h += '<div class="dwp-tabs-done-content" id="dwp-tabs-done-content">1</div>';
				_h += '<div class="dwp-tabs-archive-content" id="dwp-tabs-archive-content">2</div>';
				_h += '</div>';
				_h += '</div>';

				$dwp.ui.dialog.init(null, {
					show: { effect: "fade", duration: 300 },
					hide: { effect: "fade", duration: 300 },
					width: 1130,
					height: 720,
					modal: true,
					title: _title,
					content: { html: _h, data: {} },
					islangconvert: false,
					initcallback: function (_$dialog) {
						var _$tab = $(".dwp-gnb-setting-dialog .dwp-tabs-simple", _$dialog.element);
						_$tab.tabs({ active: 0 });

						_loadSettingConts('dwp-tabs-done-content', _$dialog);

						_$tab.find('ul li').each(function () {
							var _self = this;
							$(_self).off().on('click', function () {
								var gubun = "setting";
								gubun = $(_self).attr("gubun");
								_loadSettingConts('dwp-tabs-' + gubun + '-content', _$dialog);
							});
						});
					},
					buttons: [
						{
							title: $fn.getCodeMsg('comm.btn.confirm'),
							click: function (_$dialog) {
								var element = _$dialog.element.view('instance');
								var selDoc = element.getChecked();

								if ($(selDoc).size() == 0) {
									$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.067") });		// 신청서를 선택해 주세요.
									return false;
								}
								if ($(selDoc).size() != 1) {
									$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.068") });		// 신청서는 한건만 선택해 주세요.
									return false;
								}

								$fn.confirm({ msg: $fn.getCodeMsg("aprv.msg.072") }).done(function () {
									if (_addRefer) _addReferDoc(selDoc[0]);					// 관련근거에 추가
									if (typeof (_callback) == "function") _callback(selDoc[0]);

									_$dialog.close();
								});
							}
						},
						{
							title: $fn.getCodeMsg('comm.btn.cancel'),
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					]
				});
			},

			// 신청서 정보가져오기 - 2024.12.31 by dwlee
			getRequestForm: function (_dbpath, _dockey, _formkey, _callback) {
				var _url = "/dwp/aprv/com/aprvmng.nsf/cmdpost?CreateDocument";
				var _param = {
					"Cmd": "get_request_form",
					"Arg1": _dbpath,
					"Arg2": _dockey,
					"Arg3": _formkey
				}

				$fn.xAjax({
					url: $fn.getProxyUrl(_url)
					, method: 'POST'
					, dataType: 'json'
					, data: _param
					, async: false
					, cache: false
				}).done(function (data) {
					if (data.result != "100") {
						$fn.alert({ msg: $fn.getCodeMsg(data.msgcode) });
						return false;
					}
					if (typeof (_callback) == "function") _callback(data.data);

				}).fail(function () {
					$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.070") });		// 신청서 정보를 가져오는중 오류가 발생하였습니다.
				});
			},

			//결재문서 로그 생성 - 2025.11.06 by dwlee
			ActionLog: function (opt, act) { //결재문서 option, 수행로그(act)
				$fn.xAjax({
					//url :  $fn.getProxyUrl("/"+_opt.appComCfg.INGLEDBPath+ "/wAgCmdGetProcess?openagent")
					url: $fn.getProxyUrl(opt.cdb + "/wcmdpost?createdocument"),
					dataType: "json",
					method: "POST",
					async: true,
					cache: false,
					data: { actiontype: "aprlog_create", unid: opt.unid, Arg1: act, Arg2: $fn.getCurUser().pinfo.empno }
				}).done(function (data) {
					//로그니 오류나도 스킵을 해야....
				});
			},

			//결재문서 로그 조회 - 2025.11.06 by dwlee			
			aprShowDocLog: function ($doc) {
				var _el = $doc.element;
				var _opt = $doc.options;
				var _logyear = $("input[name=sStartDate]", _el).xval();
				_logyear = _logyear.substring(0, _logyear.indexOf("-"));

				if (_logyear == "") {
					$fn.alert({ msg: "로그가 생성되지 않았습니다." });
					return;
				}
				$fn.xAjax({
					type: "GET",
					url: $fn.getProxyUrl("/dwp/aprv/log/doc/" + _logyear + ".nsf/vdockey/" + _opt.appdockey + "/DocHistory?OpenField"),
					success: function (data, textStatus, xhr) {
						console.log(data);
						var _rows = data.split("↘");
						var _html = "<div class='dwp-table dwp-form-table tiny-type' style='width:100%; max-height:200px;overflow:auto;'>";
						_html += "<table>";

						_html += "<colgroup>";
						_html += '<col width="180px">';
						_html += '<col width="250px">';
						_html += '<col width="*">';
						_html += '</colgroup>';

						/*
						aprv.title.log_title : 결재문서 로그
						aprv.title.log_time : 수행시간
						aprv.title.log_user : 수행자
						aprv.title.log_dept : 수행자 부서
						aprv.title.log_action; 수행내용
						aprv.title.log_jikup; 수행자 직급
						aprv.title.log_grade : 수행자 직위
						*/
						_html += '<tbody>';
						_html += '<tr>';
						_html += '<th class="dwp-center">' + $fn.getCodeMsg("aprv.title.log_time") + '</th>';
						_html += '<th class="dwp-center">' + $fn.getCodeMsg("aprv.title.log_user") + '</th>';
						_html += '<th class="dwp-center">' + $fn.getCodeMsg("aprv.title.log_action") + '</th>';
						_html += '</tr>';
						_html += '<tr>';

						$.each(_rows, function (idx, _row) {
							if (_row != "") {
								var _cols = _row.split("¶");
								//쓰레기값 제거 하기
								if (_cols.length > 2) {
									/*
										Format(sdate.lslocaltime,"YYYY-MM-DD HH:MM:SS") + "¶" + 
										cp.jikcup + "¶" + 
										cp.grade + "¶" + 
										cp.teamname + "¶" + 
										cp.m_hname +  "¶" +
										act  +  "¶" +
										cp.empno +"¶"+"↘"
									*/
									_html += '<tr>';
									_html += '<td class="dwp-center">' + _cols[0] + '</th>';
									_html += '<td class="dwp-center">' + $fn.getCurLangMsg(_cols[3]) + ' / ' + $fn.getCurLangMsg(_cols[2]) + ' / ' + $fn.getCurLangMsg(_cols[4]) + '</th>';
									_html += '<td class="dwp-center">' + $fn.getCodeMsg("aprv.title.log_" + _cols[5]) + '</th>';
									_html += '</tr>';

								}
							}
						});
						_html += '</tbody>';
						_html += '</table>';
						_html += "</div><!-- dwp-table -->";

						var _buttons = [{
							"title": $fn.getCodeMsg("comm.btn.confirm"),
							"click": function (obj) {
								obj.close();
							}
						}
						];
						$fn.dialog(el, {
							modal: true,
							resizable: false,
							draggable: true,
							title: $fn.getCodeMsg("aprv.title.log_title"),
							width: 720,
							height: 640,
							show: 'fade', //effect
							hide: 'fade', //effect
							//autoOpen: false,		//.dialog("open")호출시만 열림
							buttons: _buttons,
							content: { html: _html, data: {} }
						});
					}, error: function (xhr, status, e) {
						$fn.alert({ msg: "생성된 로그가 없습니다." });
						return;
					}
				});
			}

		},

		//한글 웹 기안기용 함수 - 2023.05.11 by dwlee
		hwp: {
			//HWP 에디터의 필드값을 노츠 필드에 값을 넣어주는 함수			
			getHwpFieldText: function (el, fldname) {
				var _el = el;
				var _hwpval = HwpCtrl.GetFieldText(fldname);
				if (_hwpval == " ") vContent = "";

				var _$obj = $("input[name='" + fldname + "']", _el);
				if (_$obj.size() > 0) {
					_$obj.xval(_hwpval);
					/*--- added by hhnoh at 05.05.24 ---*/
					var reStr = _hwpval;
					fromChar = /\"/g;
					toChar = "″";	// ㄹ+한자키 6번째 문자
					reStr = reStr.replace(fromChar, toChar);
					fromChar = /\'/g;
					toChar = "′";	// ㄹ+한자키 5번째 문자
					reStr = reStr.replace(fromChar, toChar);
					fromChar = /,/g;
					toChar = "，";	// ㄹ+한자키 4번째 문자
					reStr = reStr.replace(fromChar, toChar);
					_$obj.xval(reStr);
				}
			},

			//HWP 에디터에 값을 넣어주는 함수
			putHwpFieldText: function (el, fldname) {
				var _me = this, _el = el;
				var _notesval = $("input[name='" + fldname + "']", _el).xval();

				//주소는 우편번호를 더해줌 - 2023.03.09 by dwlee
				if (fldname == "Address") {
					var _zipcode = $("input[name='ZipCode']", _el).xval();
					_notesval = _zipcode + "   " + _notesval;
				}

				//unescape("%0D%0A") ==> 한글 웹 에디터의 엔터값
				if (fldname == "ReceiverTitle") {
					_notesval = unescape("%0D%0A") + _notesval + unescape("%0D%0A");			//수신처 영역은 3칸을 차지해야 함.
				}
				if (fldname == "ReceiverDisplay") {
					_notesval = unescape("%0D%0A") + _notesval + unescape("%0D%0A");
				}
				//
				if (fldname == "sReqDocNumber") {
					fldname = "DocNo";
				}

				if (_notesval == "") _notesval = " ";
				if (HwpCtrl.FieldExist(fldname) == true) {

					if (_notesval == " ") {
						HwpCtrl.MoveToField(fldname);
						_me.callHwpAction(HwpCtrl, "MoveNextWord");
						_me.callHwpAction(HwpCtrl, "MoveSelLeft");
						_me.callHwpAction(HwpCtrl, "Erase");
					}
					HwpCtrl.PutFieldText(fldname, _notesval);
				}
			},

			//이미지 Url 를 한글 웹 기안기의 특정 필드에 넣어주는 함수
			putImageToHwpEditor: function (el, fld, url, width, height) {
				var _el = el;
				//17, 17 : 넓이, 높이
				HwpCtrl.MoveToField(fld);                                                           //전자관인 필드로 이동.
				//HwpCtrl.InsertPicture(url, true, 0, false, false, 0, 0, 0);
				HwpCtrl.InsertPicture(url, true, 0, 0, false, false, 0, width, height, function (ctrl) {
					if (ctrl) {
						//	console.log("이미지 표시 - 성공");
					} else {
						//console.log("이미지 표시 - 실패");
					}
				});
			},

			//문자열 사이즈 리턴하는 함수
			getByteLen: function (str) {
				var i, size = str.length;
				var hexs = "";
				for (i = 0; i < size; i++) {
					hexs += str.charCodeAt(i).toString(16);
				}
				return hexs.length / 2;
			},

			//액션 수행함수 
			callHwpAction: function (vObj, vActionID) {
				var _me = this;
				//vObj : hwp Control
				//vActionID : ActionIDTable.hwp 파일 참조
				if (vObj != null) {
					var act = vObj.CreateAction(vActionID);
					var set = act.CreateSet();
					act.GetDefault(set);
					act.Execute(set);
					return true;
				} else {
					return false;
				}
			},

			//셀 분할  - 현재 셀을 나눔
			actHwpCellSplit: function (tgFld, addFld) {
				var _me = this;
				HwpCtrl.MoveToField(tgFld);
				_me.callHwpAction(HwpCtrl, "TableSplitCellRow2");
				Re = HwpCtrl.GetCurFieldName(1);
				if (Re == "") {
					HwpCtrl.SetCurFieldName(tgFld);
					_me.callHwpAction(HwpCtrl, "TableUpperCell");
					HwpCtrl.SetCurFieldName(addFld);
				} else {
					HwpCtrl.SetCurFieldName(addFld);
					_me.callHwpAction(HwpCtrl, "TableLowerCell");
					HwpCtrl.SetCurFieldName(tgFld);
				}
			},

			//셀 합치기 - 현재 셀의 하단과 합침
			actHwpCellMerge: function (fldName) {
				var _me = this;
				HwpCtrl.MoveToField(fldName);
				_me.callHwpAction(HwpCtrl, "TableCellBlock");
				_me.callHwpAction(HwpCtrl, "TableCellBlockExtend");
				_me.callHwpAction(HwpCtrl, "TableLowerCell");
				_me.callHwpAction(HwpCtrl, "TableMergeCell");
			},
		},

		attach: {
			addAttachInfo: function (doc, opt) {
				var _me = this;
				var _info = _me.getAttachInfo(doc, opt.targetfield);
				//향후 상황을 고려하여 연도별 DB로 나눠놨음(인덱스라 굳이 안나눠도 될듯하긴 한데...)
				var _url = "/dwp/aprv/attach/attach_" + $fn.getYear("cyear") + ".nsf/wFileInfo?OpenForm";
				if (_info != null) {
					_url = _info.dbpath + "/0/" + _info.unid + "?editdocument";
				}
				var _buttons = [{
					title: $fn.getCodeMsg("comm.btn.confirm"),
					click: function (o) {
						var _el = o.element;
						var _doc = $fn.getInstance("doc", _el);
						_doc.save({
							actiontype: "save",
							docstatus: "reg",
							callback: function (jdata) {
								if (jdata.result == "200") {
									var _tgfld = opt.targetfield;
									_me.setAttachInfo(doc, _tgfld, jdata);
									_me.showAttachInfo(doc, _tgfld);
									//XMLData 필드의 XML DATA 중 Attch 추가로 인한 수정(2022-06-29)
									if (typeof (opt.callback) == "function") {
										opt.callback();
									}
								} else {
									$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.65") });
								}
								o.close();
							}
						});
					}
				},
				{
					title: $fn.getCodeMsg("comm.btn.cancel"),
					click: function (o) {
						o.close();
					}
				}
				];
				$dwp.ui.dialog.init(null, {
					modal: true,
					resizable: false,
					draggable: true,
					title: "파일첨부",
					width: 740,
					height: 380,
					show: 'fade', //effect
					hide: 'fade', //effect
					islangconvert: false,
					buttons: _buttons,
					initcallback: function (o) { },
					content: { url: _url, data: { aprdocid: opt.appdockey } }
				});
			},

			//첨부된 정보를 저장 필드에 업데이트 - 2022.04.13
			setAttachInfo: function (doc, fldname, jdata) {
				var _infoStr = JSON.stringify(jdata); //json Object 스트링으로 치환
				_infoStr = _infoStr.replace(/\"/gi, "'");

				//파일이 모두 삭제되었다면 리셋 처리 - 2022.10.20 by dwlee
				if (jdata.filename == "") _infoStr = "";

				$("input[name='" + fldname + "']", doc.element).xval(_infoStr);
			},

			//저장된 첨부파일 정보를 리턴하는 함수 - 2022.04.13
			getAttachInfo: function (doc, fldname) {
				var _infoStr = $("input[name='" + fldname + "']", doc.element).xval();
				var _attopt = null;
				if (_infoStr != "" && typeof (_infoStr) != "undefined") {
					_infoStr = _infoStr.replace(/'/gi, '"');
					_attopt = JSON.parse(_infoStr); //문자열 json Object로 치환
				}
				return _attopt;
			},

			//저장된 첨부파일 정보로 파일을 표시하는 함수 - 2022.04.13
			//dbpath, unid, 파일명, 파일사이즈
			showAttachInfo: function (doc, fldname) {
				var _me = this;
				var _info = _me.getAttachInfo(doc, fldname);
				var _$wrap = $("." + fldname + "_dsp", doc.element);
				_$wrap.html("");

				//XMLData 필드의 XML DATA 중 Attch 추가로 인한 수정(2022-06-29)
				if (_info == null) {
					if (typeof (dispcallback) == "function") {
						_info = dispcallback();
						if (typeof (_info.filename) == "undefined") {
							return false;
						}
					}
				}

				if (_info != null) {
					var _unid = _info.attunid;
					var _dbpath = _info.attdbpath;
					var _narr = _info.filename.split(";");
					//var _sarr = _info.filesize.split(";");

					//첨부파일이 없는 경우 - 
					//if (_info.filename == "") return false;

					//파일 사이즈 정보가 있는 경우만 - 2022.05.02
					var _sarr;
					//console.log("showAttachInfo == > 1");
					if (_info.hasOwnProperty("filesize")) {
						_sarr = _info.filesize.split(";");
					} else {
						_sarr = "";
					}
					$.each(_narr, function (idx, _name) {
						var _link = _dbpath + "/0/" + _unid + "/$FILE/" + _name + "?openelement&attached";
						(/\.(\w+)$/g).test(_name);
						var _ft = (RegExp.$1) ? RegExp.$1.toLowerCase() : "etc";
						//파일 확장자가 존재 하지 않는경우 처리 2022.05.18 by ksseol
						if (typeof $dwp.ui.file._ATTACH_ICONS[_ft] == 'undefined') {
							_ft = "etc";
						}
						var _typeimg = $dwp.ui.file._ATTACH_ICONS[_ft].icon;
						// var _size = parseFloat(_sarr[idx]) / 1024;
						// if (_size < 1024) {
						// 	_size = _size.toFixed(2) + "K";
						// } else {
						// 	_size = (_size / 1024).toFixed(2) + "MB";
						// }

						//파일 사이즈 정보가 있는 경우만 - 2022.05.02
						var _size;
						if (_sarr != "") {
							_size = parseFloat(_sarr[idx]) / 1024;
							if (_size < 1024) {
								_size = _size.toFixed(2) + "K";
							} else {
								_size = (_size / 1024).toFixed(2) + "MB";
							}
						}

						var _$record = $("<div class='dwp-file data_record' style='margin-left:5px'></div>");
						var _$file = $("<div class='dwp-file' id='name'></div>");
						var _$attach = $("<span class='attach_file'></span>");
						var _$link = $("<a class='attach_link' dwonload target='_blank'></a>");
						_$link.attr("href", _link);
						_$link.append("<span class='attach_icon'><img src='" + _typeimg + "' align='absmiddle'></span>");
						//_$link.append("<span class='attach_filename'>" + _name + " ("+_size+")</span><span style='width:30px'>&nbsp;</span>");

						//파일 사이즈 정보가 있는 경우만 - 2022.05.02
						if (_sarr != "") {
							_$link.append("<span class='attach_filename'>" + _name + " (" + _size + ")</span><span style='width:30px'>&nbsp;</span>");
						} else {
							_$link.append("<span class='attach_filename'>" + _name + "</span><span style='width:30px'>&nbsp;</span>");
						}
						_$attach.append(_$link);
						_$file.append(_$attach);
						_$record.append(_$file);
						_$wrap.append(_$record);
					});
					//console.log("end - 1");

				}
			}
		},

		fileupload: {
			init: function (opt) {
				var _me = this,
					_opt = _me._initOptions(opt);

				var _doc = $fn.doc(_opt);
			},
			_initOptions: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt);

				_opt.button = {
					// // 임시저장
					// draft : {
					// 	title : $fn.getCodeMsg("comm.btn.draftsave")
					// 	,click : function(doc) {					
					// 		doc.save({actiontype : "draft", docstatus : "draft"});
					// 	}
					// }
					// // 저장	
					// ,savedoc : {
					// 	title : $fn.getCodeMsg("comm.btn.reg")
					// 	,click : function(doc) {
					// 		console.log("doc", doc);
					// 		doc.save({actiontype : "save", docstatus : "reg"});
					// 	}						
					// }					
				};
				return _opt;
			}
		},

		doc: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},
			init: function (opt, el) {
				var _me = this,
					_opt = _me._initOptions(opt);

				//console.log("app.aprv - 1");

				//2017.08.07 - 결재양식의 설정에 있는 html을 가져오는 함수(보완 - edtior oninitcompleted 이후에 수행)
				if (_opt.isnew && _opt.appCfg.BodyName == 'D') {
					_opt.insertbody = _$$.aprv.com.InsertBodyHTML;

					/* //아래 부분은 사용하지 않음
					if (_opt.isonload) {
						if (_opt.subonload !== "") {
							if (typeof (eval(_opt.subonload.replace(".load", ".insertbodyCallback"))) === "function") {
								_opt.insertbodyCallback = eval(_opt.subonload.replace(".load", ".insertbodyCallback"));
							}
						}
					}
					*/

				}

				//console.log("app.aprv - 2");

				//자동첨부가 있는 경우에는 첨부 후 편집문서로 열어줌 - 2020.07.20 by dwlee
				if (_opt.isnew && _opt.auto_attach == "1") {
					_opt.insertbody = function (curdoc) {
						$("input[name='Subject']", $(curdoc).element).xval("auto_attach");
						var _docopt = curdoc.options;
						if (_docopt.appCfg.BodyName == 'D') {
							var _url = $fn.getProxyUrl(_opt.mngdb + '/lkViwAprvSet01/' + _opt.appCfg.FormAlias + '/Body?OpenField');
							$dwp.ui.weditor.setDocBody(
								$("#bodyFld", curdoc.element), { cdb: _docopt.cdb, isnew: false, bodyurl: _url, callback: attachSave }, curdoc);
						}

						function savecallback(jdata, $doc) {
							if (jdata.result == '200') {
								if (jdata.hasOwnProperty("returnurl") && jdata.returnurl !== "") {
									$fn.loadPage({
										link: $fn.getProxyUrl(jdata.returnurl),
										linktype: 'PAGE'
									});
								}
							} else {
								$fn.alert({
									msg: jdata.Error
								});
							}
						}

						function attachSave(edom) {
							curdoc.save({
								actiontype: 'auto_attach',
								docstatus: 'draft',
								callback: savecallback
							});
						}
					}
				}

				//console.log("app.aprv - 3");

				var _doc = $fn.doc(_opt);

				/******** 전결번호 : KBWS 에서 사용하지 않음
				//전결번호 자동 셋팅 - 2025.07.14 by dwlee
				if (_opt.isnew && _opt.appCfg.hasOwnProperty("ArbiDeciNum") && _opt.appCfg.ArbiDeciNum != "") {
					$("input[name=ArbiDeciNum]",_doc.element).xval(_opt.appCfg.ArbiDeciNum);		
					$("input[name=ArbiDeciNumVersion]", _doc.element).xval(_opt.appCfg.ArbiDeciNumVersion);		
				}

				//console.log("app.aprv - 4");

				//전결규정 클릭시 - 2024.09.03 by dwlee
				$(".btn-decide-select", _doc.element).off("click").on("click", function () {
					_$$.aprv.com.selectdecidenum(_doc);
				});
				*******/


				//현장명 선택 - 2024.09.03 by dwlee
				if (_opt.isedit) {
					$("[name=_BS_SRCH]", _doc.element).off("click").on("click", function () {
						_$$.aprv.com.selectspot(_doc);
					});
					$("[name=_BS_CLR]", _doc.element).off("click").on("click", function () {
						_$$.aprv.com.deletespot(_doc);
					});
				} else {

					/*
						by mjkim 20241213
						수신자 리스트 추가
					*/


					if (opt.appCfg.OPT5 == 'YES' || opt.isrevdoc) {

						var _recievelist = $("input[name=Circulation3Full]", _doc.element).xval();
						/*
												20250121 undefined  처리 mjkim
						*/

						if (typeof _receivelist != "undefined") {
							if (_receivelist != "") {
								_$$.aprv.com.setreceive(_doc, _recievelist, opt);
							}
						}
					}
				}
				if (_opt.isnew) {
					if ($.isEmptyObject(_opt.appCfg)) { //미사용 또는 삭제된 양식의 경우 자주 사용하는 양식 목록에서 제거
						var delurl = $fn.getProxyUrl(_opt.cdb + '/wcmdpost?createdocument'),
							deldata = {};
						deldata = {
							"actiontype": "delete_userform",
							"Arg1": $fn.getCurUser().pinfo.empno + $fn.getMidStr((_opt.pathinfo + "&"), "FormCode=", "&"),
							"Arg2": _opt.appComCfg.RaiseDBpath
						};
						$fn.cmdPost(delurl, deldata, setTimeout(function () {
							alert("대상 결재양식을 찾을 수 없습니다.");
							_doc.goview();
						}, 1000), "json");
						return;
					}
				}

				//console.log("app.aprv - 5");

				var orgedit = false;
				_doc.options.docstatus == 'received' ? (orgedit = true) : (orgedit = _opt.isedit);

				//수신자 정보 설정
				if (opt.appCfg.OPT5 == 'YES') {
					var _sReceive = $('input[name=Circulation3Full]', _doc.element).val();
					if (_sReceive != '') {
						$fn.orgsel($("[name='orgReceive']", _doc.element), {
							isedit: false,
							treetype: '1',
							seltype: '1',
							fld: 'Circulation3',
							count: 20,
							isseltype: false
						});
					}
				}

				//console.log("app.aprv - 6");

				//1단결재시 - 주관부서 정보설정 - 2024.03.28 by dwlee
				if (opt.appCfg.ProcessStep != '1') {
					var _sConduct = $('input[name=ConductFull]', _doc.element).val();
					if (_sConduct != '') {
						$fn.orgsel($("[name='OrgConduct']", _doc.element), {
							isedit: false,
							treetype: '0',
							seltype: '2',
							fld: 'Conduct',
							count: 1,
							isseltype: false
						});
					}
				}

				//console.log("app.aprv - 7");


				//dwp-org-auto
				//서식 생성기를 통해서 만들어진 사용자 선택 창 - 2024.04.25 by dwlee
				var _$autos = $(".dwp-org-auto", _doc.element);
				if (_$autos.size() > 0) {
					$.each(_$autos, function (idx, _auto) {
						var _$org = $(this);
						var _count = _$org.attr("dwp-org-cnt");
						var _name = _$org.attr("dwp-org-name");

						var _treetype = "0";				// 0 : 부서 & 사용자, 1 : 부서
						var _seltype = "0";				// 0 : 부서 & 사용자, 1 : 부서, 2 : 사용자			

						if (_$org.hasClass("dwp-org-user")) {
							_seltype = "2";
						} else if (_$org.hasClass("dwp-org-dept")) {
							_treetype = "1";
							_seltype = "1";
						} else { } //dwp-org-all
						$fn.orgsel($("[name='" + _$org.attr("name") + "']", _doc.element), {
							isedit: orgedit,
							treetype: _treetype,
							seltype: _seltype,
							fld: _name,
							count: _count,
							isseltype: false
						});
					})
				}


				//참조자 설정
				$fn.orgsel($("[name='OrgRefer']", _doc.element), {
					isedit: orgedit,
					treetype: '0',
					seltype: '0',
					fld: 'sReferenceUsers',
					count: 100,
					isseltype: false
				});

				// 참조자 저장 / 불러오기 - 2023.08.31 by jwlee
				var _$refer = $("[name='OrgRefer']", _doc.element);
				$(".btn-refer-save", _$refer).off().on("click", function () {
					_$$.aprv.com.referlinesave(_doc);
				});
				$(".btn-refer-load", _$refer).off().on("click", function () {
					_$$.aprv.com.referlineload(_doc);
				});

				//console.log("app.aprv - 8");

				//고정참조자 설정
				$fn.orgsel($("[name='OrgReferFix']", _doc.element), {
					isedit: false,
					treetype: '0',
					seltype: '0',
					fld: 'FormRefer',
					count: 20,
					isseltype: false
				});

				// 열람자 설정
				$fn.orgsel($("[name='OrgReader']", _doc.element), {
					isedit: orgedit,
					treetype: '0',
					seltype: '0',
					fld: 'sDocReaders',
					count: 20,
					isseltype: false
				});

				//console.log("app.aprv - 9");

				if (opt.isnew) {
					if (opt.appCfg.MenuCategory == 'AC006') {
						_$$.aprv.com.setFld(
							'Subject',
							$fn.getCurLangMsg(opt.appCfg.sFormTitle),
							_doc.element
						);
					}

					// 페기일 설정
					// 결재완료일을 기준으로 계산하여 보존년한만큼의 날짜를 표시함, 2019.11.11 by Choo
					/*
					var _$dinp = $('input[name=DisposalDate]', _doc.element);
					var _$ddate = $('span[name=DISPOSAL_DATE]', _doc.element);
					var _sdate = $('span[name=ST_DATE]', _doc.element).attr(
						'data-xlang-txt'
					);

					var _s = moment(_sdate);
					var _val = parseInt($("select[name='DocPeriod'] option:selected", _doc.element).val(), 10);
					var _sval = '';
					if (_val != 99) {
						_s.add(_val, 'y');
						_sval = $fn.formatDateTime(_s, 'dateonly');
					}
					_$ddate.text(_sval);
					_$dinp.val(_sval);
					*/

					//PLM 파라미터 체크 - 2016.12.21 by dwlee
					//var _jsonqry = $fn.getUrlPaser(opt.pathinfo);

					//_$$.aprv.com.InitEditorHtml(_doc);

					//DL 양식인 경우 - 품의서나 기타 양식에 들어갈 수 있음 - 2016.12.22 by dwlee
					//_$$.aprv.com._dlDataInit(_doc);
				}


				if (opt.isedit) {
					// 페기일 설정
					var _$dinp = $('input[name=DisposalDate]', _doc.element);
					var _$ddate = $('span[name=DISPOSAL_DATE]', _doc.element);
					var _sdate = $('span[name=ST_DATE]', _doc.element).attr('data-xlang-txt');
					$('select[name=DocPeriod]', _doc.element).off('change').on('change', function () {
						var _s = moment(_sdate);
						var _val = parseInt($(this).val(), 10);
						var _sval = '';
						if (_val != 99) {
							_s.add(_val, 'y');
							_sval = $fn.formatDateTime(_s, 'dateonly');
						}
						_$ddate.text(_sval);
						_$dinp.val(_sval);
					});

					_opt.workareacode = $fn.getCurUser().pinfo.workareacode; //사용자의 근무지 설정, 2019.10.6 by Choo
				}


				//console.log("app.aprv - 17");
				//ERP 본문처리 - 2024.09.03 by dwlee
				var _$erpbody = $(".dwp-erp-body", _doc.element);

				//console.log("app.aprv - 17-1");

				if (_$erpbody.size() > 0) {

					//console.log("app.aprv - 17-2");

					/* 2025.02.05 by dwlee
						//console.log($("[name=ErpBody]", _doc.element).val());
	
						_$erpbody.html($("[name=ErpBody]", _doc.element).val());
	
						//console.log("app.aprv - 17-3");
	
						//휴먼플러스 요청에 따라서 추가 - 2025.01.12 by dwlee
						var _$outa = $("a[href^='hub.hwasung.com']", _$erpbody).not("a[href*='https://hub.hwasung.com']");
	
						//console.log("app.aprv - 17-4");
						if (_$outa.size() > 0) {
						//console.log("app.aprv - 17-5");
							$.each(_$outa, function (idx, _tag) {
								var _url = $(_tag).attr('href');
								$(_tag).attr("href", "https://" + _url);
							});
						}
					*/

					/*		2025.02.25 by dwlee
										var _html = $("[name=ErpBody]", _doc.element).val();
										//마지막 <br>만 남기는 html
										_html = _html.replace(/(<br\s*\/?>\s*)+/gi, '<br>');
										_$erpbody.html(_html);
										//휴먼플러스 요청에 따라서 추가 - 2025.01.12 by dwlee
										var _$outa = $("a[href^='hub.hwasung.com']", _$erpbody).not("a[href*='https://hub.hwasung.com']");
										if (_$outa.size() > 0) {
											$.each(_$outa, function (idx, _tag) {
												var _url = $(_tag).attr('href');
												$(_tag).attr("href", "https://" + _url);
											});
										}
					*/

					//20250612 추가예산품의 상세버튼 처리
					if (_opt.appCfg.FormAlias == "GW_ERP001") {
						var _html = $("[name=ErpBody]", _doc.element).val();
						//마지막 <br>만 남기는 html
						_html = _html.replace(/(<br\s*\/?>\s*)+/gi, '<br>');
						_$erpbody.html(_html);
						//휴먼플러스 요청에 따라서 추가 - 2025.01.12 by dwlee

						//console.log("app.aprv - A-1");

						//2024.03.11 by dwlee
						//ERP Host 얻어오기 - 2025.03.11 by dwlee
						var _info = $fn.getSysinfo();
						var _erphost = "";
						var _erpdomain = "";
						if (_info.hasOwnProperty("ErpServerHost")) { //업데이트 된 환경설정 정보를 읽어온다면....
							_erphost = _info.ErpServerHost;
							_erpdomain = _erphost.substring(_erphost.indexOf("//") + 2, _erphost.length);
						} else {
							if (_info.host == "devgw.hwasung.com") {
								_erphost = "https://deverp.hwasung.com";
								_erpdomain = "deverp.hwasung.com";
							} else {
								_erphost = "https://hub.hwasung.com";
								_erpdomain = "hub.hwasung.com";
							}
						}
						//var _$outa = $("a[href^='deperp.hwasung.com']", _$erpbody).not("a[href*='https://deverp.hwasung.com']");
						var _$outa = $("a[href^='" + _erpdomain + "']", _$erpbody).not("a[href*='" + _erphost + "']");
						if (_$outa.size() > 0) {
							$.each(_$outa, function (idx, _tag) {
								var _url = $(_tag).attr('href');
								$(_tag).attr("href", "https://" + _url);
							});
						}
						//console.log("app.aprv - A-2");
					} else {


						//본문에 br 태그 및 ul 태그 생성으로 인하여 원문을 직접 읽어와서 표시하도록 변경 - 2025.02.25 by dwlee 전체적용
						//					if ($fn.getCurUser().pinfo.empno == "P00001") {
						$dwp.core.util.xAjax({
							url: $fn.getProxyUrl("/" + $("input[name=ErpLogDB]", _doc.element).xval() + "/DocKeyView/" + $("input[name=ErpDocID]", _doc.element).xval() + "/Body?OpenField"),
							dataType: "html",
							async: false,
							cache: false
						}).done(function (data) {
							data = data.replace(/\&quot;/gi, '"');
							//data = data.replace(/\'/gi, "\"");
							data = data.replace(/\&lt;/gi, "<");
							data = data.replace(/\&gt;/gi, ">");
							data = data.replace(/\&amp;/gi, "&");

							//script 태그 삭제 
							//data = data.replace(/<script\b[^>]*>.*?<\/script>/gs, '');							
							data = data.replace(/onclick='\s*/g, 'onclick=').replace(/\}\}\)'\s*/g, '}})');

							_$erpbody.html(data);

							//휴먼플러스 요청에 따라서 추가 - 2025.01.12 by dwlee
							var _$outa = $("a[href^='hub.hwasung.com']", _$erpbody).not("a[href*='https://hub.hwasung.com']");
							if (_$outa.size() > 0) {
								$.each(_$outa, function (idx, _tag) {
									var _url = $(_tag).attr('href');
									$(_tag).attr("href", "https://" + _url);
								});
							}

							/* 이거 왜 넣어놨지... - 2025.03.18 by dwlee
														var rtn = "";
														//rtn += data;
														var regExp = /<body[^>]*?>([\s\S]*?)<\/body>/gi; //Body Tag innerHTML
														if (regExp.test(data)) {
															rtn += RegExp.$1 + '<p style="font-size:9pt;">&nbsp;</p>';
														} else {
															rtn += data + '<p style="font-size:9pt;">&nbsp;</p>'; //Body 테그를 못찾으면 그냥 그대로 사용
														}
							*/
						});
						/*						
											}else {
												var _html = $("[name=ErpBody]", _doc.element).val();
												//마지막 <br>만 남기는 html
												_html = _html.replace(/(<br\s*\/?>\s*)+/gi, '<br>');
												_$erpbody.html(_html);
												//휴먼플러스 요청에 따라서 추가 - 2025.01.12 by dwlee
												var _$outa = $("a[href^='hub.hwasung.com']", _$erpbody).not("a[href*='https://hub.hwasung.com']");
												if (_$outa.size() > 0) {
													$.each(_$outa, function (idx, _tag) {
														var _url = $(_tag).attr('href');
														$(_tag).attr("href", "https://" + _url);
													});
												}										
											}
						*/

					}

					//console.log("app.aprv - 17-6");
				}
				//console.log("app.aprv - 18");

				//console.log("app.aprv - 10");

				//결재 본문 중간에 있는 파일 첨부 표시 - 2022.04.13
				if ($(".dwp-attach-data", _doc.element).size() > 0) {
					var _$input = $(".dwp-attach-data", _doc.element);
					$.each(_$input, function (idx, _input) {
						var _fldname = $(this).attr("name");
						_$$.aprv.attach.showAttachInfo(_doc, _fldname);
					});
				}

				//console.log("app.aprv - 11");

				if (opt.subonload != '' && opt.isonload) {
					try {
						eval(opt.subonload)(_doc);
					} catch (e) { }
				}

				//console.log("app.aprv - 12");
				_$$.aprv.com._bookmarkProc(_doc);
				//console.log("app.aprv - 13");

				_$$.aprv.line.setCfgAppType(_doc);

				//console.log("app.aprv - 14");
				_$$.aprv.line.DrawingAdded(_doc);

				//console.log("app.aprv - 15");
				_$$.aprv.line.DrawingBox(_doc);

				//console.log("app.aprv - 16");
				//_$$.aprv.com._misAttachLink(_doc);
				//_$$.aprv.com._hepsDataInit(_doc); //한타에서만 사용하는 함수

				//전달받은 문서에서 공유와 북마크 기능 제외 - 2019.08.22 by dwlee
				if (opt.cdb.indexOf("transfer") > 0) {
					$("[data-icontype='bookmark']", _doc.element).remove();
					$("[data-icontype='link']", _doc.element).remove();
				}
				/* console.log('결재칸 개수::',$("div[name='BOX_AP1'] > .sign-zone").length);
				if ($("div[name='BOX_AP1'] > .sign-zone", _doc.element).length > 1) {
				  $("div[name='BOX_AP1'] > .sign-zone:eq(0)", _doc.element).remove();
				} */

				//수신처 접수 후 발신부서 결재선에서 기안자 제거
				/* if ($("div[name='ReqBOX_AP1'] > .sign-zone", _doc.element).length > 1) {
					$("div[name='ReqBOX_AP1'] > .sign-zone:eq(0)", _doc.element).remove();
				} */

				/* console.log('마지막 결재자 타이틀::', $("div[name='BOX_AP1'] > .sign-zone:last", _doc.element).find('.part').text());
				var _$gamsa_signbox;
				if ($("div[name='BOX_AP1'] > .sign-zone:last", _doc.element).find('.part').text() === '감사') {
					_$gamsa_signbox = $(
						"div[name='BOX_AP1'] > .sign-zone:last",
						_doc.element
					);
					_$gamsa_signbox.css({ 'margin-left': '10px' });
					_$gamsa_signbox.prev().css({ 'border-right': '1px solid #cfcfcf' });
				} */

				//수신처 접수 후 발신부서 결재선 처리
				/* if ($("div[name='ReqBOX_AP1'] > .sign-zone:last", _doc.element).find('.part').text() === '감사') {
					_$gamsa_signbox = $("div[name='ReqBOX_AP1'] > .sign-zone:last",_doc.element);
					_$gamsa_signbox.css({ 'margin-left': '10px' });
					_$gamsa_signbox.prev().css({ 'border-right': '1px solid #cfcfcf' });
				} */

				//결의서 수신문서의 수신부서 결재선 삭제 => 왜? by noh
				/* var _aprv_line_remove = ['Form015', 'Form018', 'Form019', 'Form021'];
				if (_aprv_line_remove.indexOf(opt.appCfg.FormAlias) >= 0 && opt.isrevdoc ) {
					$("div[name='BOX_AP1'] > .sign-zone", _doc.element).closest('.dwp-section').remove();
				} */

				//헤드를 옵션으로 숨기는 설정이 있는 경우 - 2024.03.04 by dwlee
				if (opt.appCfg.hasOwnProperty("HeadOpt") && (opt.appCfg.HeadOpt == "YES" || opt.appCfg.HeadOpt == "yes") && opt.isedit) {

					var _totH = $(".dwp-page-body", _doc.element).height();
					var _innerH = parseFloat($(".dwp-hoption-aprline", _doc.element).height());
					if ($(".head-area", _doc.element).size() > 0) _innerH += parseFloat($(".head-area", _doc.element).height());
					if ($(".dwp-subject-area", _doc.element).size() > 0) _innerH += parseFloat($(".dwp-subject-area", _doc.element).height());
					if ($(".dwp-bottom-area", _doc.element).size() > 0) _innerH += parseFloat($(".dwp-bottom-area", _doc.element).height());
					$("#bodywrap", _doc.element).height((parseFloat(_totH) - _innerH - 140));

					// 결재선 접기/펴기 처리 - 2024.03.04 by dwlee
					$("[role='aprv_aprline_btn']", _doc.element).off().on("click", function () {
						var _btn = $(this);
						var _line = $(".AprLine", el);
						if ($(_btn).hasClass("active")) {
							$(_btn).removeClass("active");
							$(_line).addClass("dwp-none");
							$("[role='dwp_aprline_info']", el).removeClass("dwp-none");
						} else {
							$(_btn).addClass("active");
							$(_line).removeClass("dwp-none");
							$("[role='dwp_aprline_info']", el).addClass("dwp-none");
						}
						//결재선 빠밤 - 
					});

					//결재 헤더영역 옵션 처리하기 - 2024.03.04 by dwlee
					if ($(".dwp-hoption_area", _doc.element).size() > 0) {
						$(".dwp-trigger", _doc.element).on("click", function (e) {
							var $apr = $(this).parent();
							$apr.toggleClass("hide");
							var $last = $(".dwp-hoption_list", _doc.element);
							if ($last.hasClass("dwp-none")) {
								$last.removeClass("dwp-none");					//펼치기
							} else {
								$last.addClass("dwp-none");						//접기
							}
							e.preventDefault();
						});
					}
				}

				//1단결재 문서번호 지정이면서 2단결재 첫번재 결재자이면 첨부 추가버튼 생성 - 2024.12.16 by dwlee
				if (_opt.isedit == false) {
					var _isset = false;
					var _el = _doc.element;  //2024.12.26 by dwlee
					if ($("input[name=isPreDocNo]", _doc.element).size() > 0 && $("input[name=isPreDocNo]", _doc.element).xval() == "1") { //강제로 처리부서로 지정된 경우
						_isset = true;
					}
					if (opt.appCfg.hasOwnProperty("OPT3_A") && opt.appCfg.OPT3_A == "YES") { //결재양식 설정에서 처리부서로 체크되어 있으면
						_isset = true;
					}
					if (_isset) {
						var _curobj = $dwp.app.aprv.com.getcurAprInfo(_doc, _opt);

						//if (_myobj.orgcode == "hs1142" || _myobj.orgcode == "hs1145") {

						//첨부파일 추가 가능하도록 처리
						//if (_curobj.step == "2" && _curobj.aprnum == "1" && _curobj.apruser == $fn.getCurUser().abnotesid) { //2단 결재이면서 현재 결재자인 경우 첨부파일 추가버튼 활성화
						if (_curobj.step == "2" && _curobj.apruser == $fn.getCurUser().abnotesid) { //2단 결재이면서 현재 결재자인 경우 첨부파일 추가버튼 활성화
							var _$sbutton = $("div.dwp-sub4-btn", _el);
							_$sbutton.removeClass("dwp-hidden");
							$("span", _$sbutton).html($fn.getCodeMsg('aprv.btn.addattachment'));
							_$sbutton.on("click", function () {
								$dwp.app.aprv.com.aprAddAttach(_doc, { count: 8 });
							});
						} else {
							var _$eprkey = $("input[name=ErpDocID]", _el);
							if (_$eprkey.size() > 0 && _$eprkey.xval() != "") {
								if (_curobj.apruser == $fn.getCurUser().abnotesid) { //2단 결재이면서 현재 결재자인 경우 첨부파일 추가버튼 활성화
									var _$sbutton = $("div.dwp-sub4-btn", _el);
									_$sbutton.removeClass("dwp-hidden");
									$("span", _$sbutton).html($fn.getCodeMsg('aprv.btn.addattachment'));
									_$sbutton.on("click", function () {
										$dwp.app.aprv.com.aprAddAttach(_doc, { count: 8 });
									});
								}
							}
						}
						//ERP 연동양식은 현재 결재자가 첨부를 추가할 수 있도록 변경 - 20245.01.13 by dwlee
					} else {
						var _curobj = $dwp.app.aprv.com.getcurAprInfo(_doc, _opt);
						var _$eprkey = $("input[name=ErpDocID]", _el);
						if (_$eprkey.size() > 0 && _$eprkey.xval() != "") {
							if (_curobj.apruser == $fn.getCurUser().abnotesid) { //2단 결재이면서 현재 결재자인 경우 첨부파일 추가버튼 활성화
								var _$sbutton = $("div.dwp-sub4-btn", _el);
								_$sbutton.removeClass("dwp-hidden");
								$("span", _$sbutton).html($fn.getCodeMsg('aprv.btn.addattachment'));		//aprv.btn.addattachment
								_$sbutton.on("click", function () {
									$dwp.app.aprv.com.aprAddAttach(_doc, { count: 8 });
								});
							}
						}

					}
					//통보자 추가 버튼 - 2024.12.26 by dwlee
					/*					
										var _curobj = $dwp.app.aprv.com.getcurAprInfo(_doc, _opt);
										if (_curobj.apruser == $fn.getCurUser().abnotesid) { //2단 결재이면서 현재 결재자인 경우 첨부파일 추가버튼 활성화			
					
											var _$sbutton = $("div.dwp-sub5-btn", _el);
											_$sbutton.removeClass("dwp-hidden");
											$("span", _$sbutton).html($fn.getCodeMsg('aprv.btn.addnotifier'));	//aprv.btn.addnotifier
											_$sbutton.on("click", function () {
												$dwp.ui.org.orgmselect.init($(this), {
													type: "multi",
													treetype: "0",
													seltype: "2",
													comcode: '',
													ismng: true,
													pardoc: _doc,
													count: 20,
													fld: 'sReferenceUsers',
													selcallback: function (o) {
														var _sellist = [];
														$.each(o.list, function (idx, _list) {
															_sellist.push(_list.notesid);
														});
														_me.getAddRefer(_doc, _sellist.join(";"));
													}
												});
					
											});
										}
					*/

					//통보자 추가 버튼 - 2024.12.26 by dwlee
					var _curobj = $dwp.app.aprv.com.getcurAprInfo(_doc, _opt);
					if (_curobj.apruser == $fn.getCurUser().abnotesid) { //2단 결재이면서 현재 결재자인 경우 첨부파일 추가버튼 활성화			

						var _$sbutton = $("div.dwp-sub5-btn", _el);
						_$sbutton.removeClass("dwp-hidden");
						$("span", _$sbutton).html($fn.getCodeMsg('aprv.btn.addnotifier'));
						_$sbutton.on("click", function () {
							$dwp.ui.org.orgmselect.init($(this), {
								type: "multi",
								treetype: "0",
								/*			
									by mjkim 20250217 사용자 부서 선택가능으로 변경							
																seltype: "2",
								*/
								seltype: "0",
								comcode: '',
								ismng: true,
								pardoc: _doc,
								count: 20,
								fld: 'sReferenceUsers',
								selcallback: function (o) {
									var _sellist = [];
									/*
											by mjkim 20250228 통보자 버튼을 사용하여 추가(부서추가 가능)
									*/
									$.each(o.list, function (idx, _list) {
										if (_list.type == "B") {
											_sellist.push(_list.orgcode);

										} else {
											_sellist.push(_list.notesid);
										}
									});
									_me.getAddRefer(_doc, _sellist.join(";"));
								}
							});

						});
					}

					/*
						by mjkim 보안의견 협조자도 열람가능하도록 수정
						
						if (_opt.docstatus == "ing") {
					
					*/

					if (_opt.docstatus == "ing" || _opt.docstatus == "mutualing") {
						if (_opt.appCfg.PostItAuth == "0") {
							//대표자에게만 보임.
							if (_opt.iscaptin == '1') {
								_me._showSecComment(_doc);
							}
						} else {
							//현재 결재자에게 보안의견 팝업 - 2024.12.30 by dwlee
							_me._showSecComment(_doc);
						}
					}

					/*
										//관리자 진행중 문서 첨부파일 수정 - 2025.01.16 by dwlee
										if ((_opt.docstatus == "ing"  || _opt.docstatus == "mutualing" ) && $fn.getCurUser().pinfo.empno == 'P00001') {
											var _$sbutton = $("div.dwp-sub4-btn", _el);
											_$sbutton.removeClass("dwp-hidden");
											$("span", _$sbutton).html($fn.getCodeMsg('aprv.btn.addattachment'));
											_$sbutton.on("click", function () {
												$dwp.app.aprv.com.aprAddAttach(_doc, { count: 8 });
											});
										}
					*/
				}

				// ==============================================================
				// 즐겨찾기 - 2024.03.06 by jwlee
				_$$.aprv.com.getBookmark(_opt.appdockey, function (_ret) {
					//console.log("_$$.aprv.com.getBookmark xxxxx", _ret)
					if (_ret.hasOwnProperty("result")) {
						if (_ret.result == "100") {
							$fn.toast({ msg: _ret.msgcode });
							return;
						}
					}

					if (_ret.list[0] == _opt.appdockey) {
						$("[role='role_bookmark']", el).attr("src", "/tcclibs/images/common/icon-mark-full-on.png").attr("isbookmark", "on")
					}
				});
				$("[role='role_bookmark']", el).off().on("click", function () {
					var _this = $(this);
					var _key = _opt.unid + "^" + _opt.appdockey;
					var _dbpath = _opt.cdb.replace("/dwp", "dwp");
					var _isbookmark = $(this).attr("isbookmark");
					var _act = (_isbookmark == "on" ? "remove" : "docadd");

					_$$.aprv.com.setBookmark(_key, _act, _dbpath, function (_ret) {
						switch (_act) {
							case "remove": $(_this).attr("src", "/tcclibs/images/common/icon-mark-default.png").attr("isbookmark", "off"); break;
							case "docadd": $(_this).attr("src", "/tcclibs/images/common/icon-mark-full-on.png").attr("isbookmark", "on"); break;
						}
					});
				});

				//대결자 정보 보이기/숨기기 처리 - 2025-11-26 by wsjung
				$(document).on("mouseenter", ".dwp-mup", function () {
					// 원래 .description 내용을 가져와서 body에 붙임
					var descHtml = $(this).find(".dwp-description").html();
					var $floating = $("<div class='floating-desc' style='display:none;'></div>").html(descHtml);

					$(".sign-wrap", _el).append($floating);

					// 위치 계산: .mup 위쪽에 띄우기
					const offset = $(this).offset();
					$floating.css({
						display: "none",
						padding: "5px",
						position: "fixed",
						whiteSpace: "nowrap",
						zIndex: 9999,
						border: "1px solid #cdcdcd",
						background: "#f9f9f9",
						top: offset.top - $floating.outerHeight() + 50,
						left: offset.left + 10
					}).fadeIn(300);
				});

				$(document).on("mouseleave", ".dwp-mup", function () {
					$(".floating-desc", _el).remove(); // 떠 있는 설명 제거
				});
				// ==============================================================doc.init
			},

			//통보자 추가하기 - 2024.12.26 by dwlee
			getAddRefer: function ($doc, idlist) {
				var _opt = $doc.options;
				var _url = $fn.getProxyUrl('/dwp/aprv/com/aprvmng.nsf/cmdpost?createdocument');
				var _actopt = {
					cmd: "add_reference",
					Arg1: _opt.cdb,
					Arg2: _opt.unid,
					Arg3: idlist,
					async: false
				};
				//2022.07.15 by dwlee
				var callback = function (_data) {
					if (_data.actionResult == 'success') {
						$fn.toast({ msg: "요청사항이 반영되었습니다." });

						//통보자 추가 결재로그 생성 - 2025.11.06 by dwlee
						_$$.aprv.com.ActionLog(_opt, "addrefer");

						$doc.reload();
					}
				};
				$fn.cmdPost(_url, _actopt, callback, 'json');
			},


			getReceiverByFormId: function ($doc, opt, _param) { //담당자 지정
				var that = this,
					_doc = $doc,
					_opt = opt,
					_el = _doc.element;
				var _url = "/dwp/aprv/com/apradmin.nsf/agGetReceiverByFormId?OpenAgent";
				var _opt = {
					url: _url,
					method: "GET",
					dataType: "JSON",
					async: true,
					cache: false,
					data: { "formid": _param.formid }
				};
				$fn.xAjax(_opt)
					.done(function (data) {
						//console.log(data);
						var _jo = {},
							_o, _str_title, _str_dept, _str_name, _user, _html = "";
						var _disp_text = "";
						if (data.length === 0) {
							$fn.alert({ msg: "담당자가 없습니다." });
						} else if (data.length === 1) {
							_jo = data[0];
							_o = $fn.orgData(_jo._receiverfull);
							_user = _o.oinfo;
							_str_name = $fn.getCurLangMsg(_user.username);
							_str_title = $fn.getCurLangMsg(_user.pos);
							_str_dept = $fn.getCurLangMsg(_user.orgname);
							_disp_text = _str_dept + " " + _str_title + " " + _str_name;
							$("input[name='" + _param.fld_nm + "']", _el).xval(_str_name);
							$("input[name='" + _param.fld_title + "']", _el).xval(_str_title);
							$("input[name='" + _param.fld_dept + "']", _el).xval(_str_dept);
							$("input[name='" + _param.fld_id + "']", _el).xval(_user.notesid);
							$("input[name='" + _param.fld_disp + "']", _el).xval(_disp_text);

							$("input[name='Circulation3']", _el).xval(_user.notesid);
							$("input[name='Circulation3Full']", _el).xval(_o.sinfo);
						} else {
							_html += "<div class='dwp-table dwp-form-table'>";
							_html += "<table>";
							_html += "<tr>";
							_html += "<th><div class='dwp-title'>";
							_html += $fn.getCodeMsg("담당업무명");
							_html += "</div></th>";
							_html += "<th><div class='dwp-title'>";
							_html += $fn.getCodeMsg("담당자");
							_html += "</div></th>";
							_html += "</tr>";
							for (var i = 0; i < data.length; i++) {
								_jo = data[i];
								_o = $fn.orgData(_jo._receiverfull);
								_user = _o.oinfo;
								_str_name = $fn.getCurLangMsg(_user.username);
								_str_title = $fn.getCurLangMsg(_user.pos);
								_str_dept = $fn.getCurLangMsg(_user.orgname);
								_disp_text = _str_dept + " " + _str_title + " " + _str_name;
								_html += "<tr style='cursor:pointer' data-userinfofull='" + _jo._receiverfull + "'>";
								_html += "<td><div class='dwp-center'>";
								_html += _jo._upmu;
								_html += "</div></td>";
								_html += "<td><div class='dwp-center'>";
								_html += _disp_text;
								_html += "</div></td>";
								_html += "</tr>";
							}
							_html += "</table>";
							_html += "</div>";

							_opt = {
								title: $fn.getCurLangMsg($fn.getCodeData("AP0001.GP0092." + _param.formid)[_param.formid]),
								width: 450,
								height: 600,
								modal: true,
								hide: { effect: 'fade', duration: 300 },
								show: { effect: 'fade', duration: 300 },
								content: {
									html: _html,
									data: {}
								},
								initcallback: function (_$dialog) {
									var that = this,
										_el = _$dialog.element;
									var _tr = $("table > tbody > tr", _el);
									_tr.off("click").bind("click", function () {
										//console.log($(this).data("userinfofull"));
										var _o, _user, _str_name, _str_title, _str_dept, _disp_text;
										_o = $fn.orgData($(this).data("userinfofull"));
										_user = _o.oinfo;
										_str_name = $fn.getCurLangMsg(_user.username);
										_str_title = $fn.getCurLangMsg(_user.pos);
										_str_dept = $fn.getCurLangMsg(_user.orgname);
										_disp_text = _str_dept + " " + _str_title + " " + _str_name;
										$("input[name='" + _param.fld_nm + "']", _doc.element).xval(_str_name);
										$("input[name='" + _param.fld_title + "']", _doc.element).xval(_str_title);
										$("input[name='" + _param.fld_dept + "']", _doc.element).xval(_str_dept);
										$("input[name='" + _param.fld_id + "']", _doc.element).xval(_user.notesid);
										$("input[name='" + _param.fld_disp + "']", _doc.element).xval(_disp_text);

										$("input[name='Circulation3']", _doc.element).xval(_user.notesid);
										$("input[name='Circulation3Full']", _doc.element).xval(_o.sinfo);
										_$dialog.close();
									});
								},
								buttons: [{
									title: $fn.getCodeMsg('comm.btn.cancel'),
									css: "cancel",
									click: function (_$dialog) {
										_$dialog.close();
									}
								}]
							};
							$fn.dialog(null, _opt);
						}
					})
					.fail();

				return;
			},
			delReceiverByFormId: function ($doc, opt, _param) { //담당자 삭제
				var that = this,
					_doc = $doc,
					_opt = opt,
					_el = _doc.element;
				$("input[name='" + _param.fld_nm + "']", _el).xval("");
				$("input[name='" + _param.fld_title + "']", _el).xval("");
				$("input[name='" + _param.fld_dept + "']", _el).xval("");
				$("input[name='" + _param.fld_id + "']", _el).xval("");
				$("input[name='" + _param.fld_disp + "']", _el).xval("");
				return;
			},
			_initOptions: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt);
				var maxattach = $fn.getSysinfo().maxattach_appr * 1024;

				_opt.button = {
					act_draft: {
						title: $fn.getCodeMsg('comm.btn.draftsave'), // 임시저장
						click: function (doc) {


							var _opt = doc.options;
							//결 임시저장시 ERP 연동 사전체크 - 2024.09.02 by dwlee
							if (_opt.isdraft) {
								if (!_$$.aprv.com.erpValidate(doc)) return false;
							}

							_$$.aprv.com.appdocsave(doc, {
								actiontype: 'draft',
								docstatus: 'draft',
								callback: _$$.aprv.com.savecallback
							});
							//doc.save({actiontype : "draft", docstatus : "draft",callback:_$$.aprv.com.savecallback});
						}
					},
					act_preview: {
						title: $fn.getCodeMsg('aprv.btn.preview'), // 미리보기
						click: function (doc) {

							var _opt = doc.options;

							_$$.aprv.com.appdocsave(doc, {
								actiontype: 'preview',
								callback: _$$.aprv.com.savecallback
							});
						}
					}

					//결재로그 조회 - 2025.11.06 by dwlee
					,
					act_showlog: {
						title: $fn.getCodeMsg('aprv.title.log_btn'), // 로그보기
						//title : "결재로그 조회",
						click: function (doc) {
							//결재로그 조회 - 2025.1.06 by dwlee
							_$$.aprv.com.aprShowDocLog(doc);
						}
					}



					/*
						,act_onedoc : {
							title : $fn.getCodeMsg("One 문서열기")  // One 문서열기
							,click : function(doc) {
								_$$.aprv.portal.winopen("http://"+doc.options.oneserverurl+"/"+doc.options.onedbpath+"/0/"+doc.options.onedocid+"?OpenDocument&pkey="+doc.options.onepkey,"",{scrollbars:1,resizable:1});
							}
						}*/
					,
					act_gowrt: {
						title: $fn.getCodeMsg('comm.btn.list'),
						click: function (doc) {
							// console.log("doc.options.viewurl",doc.options.viewurl);
							$fn.loadPage({
								link: doc.options.viewurl,
								linktype: 'PAGE'
							});
						}
					},
					act_templateselect: {
						title: $fn.getCodeMsg('aprv.btn.b0011'), // 서식선택
						click: function (doc) {
							_$$.aprv.com.selecttemplate(doc);
						}
					},
					act_templatesave: {
						title: $fn.getCodeMsg('aprv.btn.b0012'), // 서식저장
						click: function (doc) {
							_$$.aprv.com.savetemplate(doc);
						}
					},
					act_wareceiver: {
						title: $fn.getCodeMsg('aprv.btn.b0016'), // 근무지별 수신자 변경
						click: function (doc) {
							_$$.aprv.com.select_wareceiver(doc);
						}
					},
					act_save: {
						title: $fn.getCodeMsg('comm.btn.savedoc'), // 저장
						click: function (doc) {
							//버전관리 편집인 경우 - 2024.09.05 by dwlee
							var _opt = doc.options;
							if (_opt.hasOwnProperty("aprdocversion") && _opt.aprdocversion.verunid != "") {
								_$$.aprv.com.versionsave(doc);
							} else {
								_$$.aprv.com.appdocsave(doc, {
									actiontype: 'save',
									callback: _$$.aprv.com.savecallback
								});
							}
							//doc.save({actiontype : "save"});
						}
					},

					//보조양식에서 사용하는 버튼1 - 2022.08.05
					act_sbtn1: {
						title: "보조양식 버튼1",
						click: function (doc) { },
						css: 'dwp-sub1-btn dwp-red dwp-hidden'
					},

					//보조양식에서 사용하는 버튼1 - 2022.08.05
					act_sbtn2: {
						title: "보조양식 버튼2",
						click: function (doc) { },
						css: 'dwp-sub2-btn dwp-red dwp-hidden'
					},

					//보조양식에서 사용하는 버튼1 - 2022.08.05
					act_sbtn3: {
						title: "보조양식 버튼3",
						click: function (doc) { },
						css: 'dwp-sub3-btn dwp-blue dwp-hidden'
					},

					//보조양식에서 사용하는 버튼1 - 2022.08.05
					act_sbtn4: {
						title: "보조양식 버튼4",
						click: function (doc) { },
						css: 'dwp-sub4-btn dwp-blue dwp-hidden'
					},
					//보조양식에서 사용하는 버튼1 - 2022.08.05
					act_sbtn5: {
						title: "보조양식 버튼5",
						click: function (doc) { },
						css: 'dwp-sub5-btn dwp-blue dwp-hidden'
					},
					//보조양식에서 사용하는 버튼1 - 2022.08.05
					act_sbtn6: {
						title: "보조양식 버튼6",
						click: function (doc) { },
						css: 'dwp-sub6-btn dwp-blue dwp-hidden'
					},
					//보조양식에서 사용하는 버튼1 - 2022.08.05
					act_sbtn7: {
						title: "보조양식 버튼7",
						click: function (doc) { },
						css: 'dwp-sub7-btn dwp-blue dwp-hidden'
					},

					//보조양식에서 사용하는 버튼1 - 2022.08.05
					act_sbtn8: {
						title: "보조양식 버튼4",
						click: function (doc) { },
						css: 'dwp-sub8-btn dwp-blue dwp-hidden'
					},

					//거래처 코드 업데이트 - 2022.12.06 by dwlee
					act_sbtn9: {
						title: "거래처 코드 업데이트", //
						click: function (doc) {
						},
						css: 'dwp-sub9-btn dwp-blue dwp-hidden'
					},
					//거래처 코드 업데이트 - 2022.12.06 by dwlee
					act_sbtn10: {
						title: "거래처 코드 업데이트", //
						click: function (doc) {
						},
						css: 'dwp-sub10-btn dwp-blue dwp-hidden'
					},
					//sap전송
					act_submitsap: {
						title: "SAP 전송", //
						click: function (doc) {
							var _doc = doc, _opt = doc.options, _el = _doc.element;
							console.log("sap전송");
							var misLogDBPath = _opt.MISLogDoc.mis_logdb_path;
							var misDocID = _opt.MISLogDoc.mis_logdoc_id;
							console.log(misDocID);
							console.log(misLogDBPath);
							if (misDocID !== "") {

								$fn.confirm({ msg: $fn.getCodeMsg("이미 전송한 문서입니다. <br>재전송하시겠습니까?") }).done(function () {
									var newPath = _opt.cdb.startsWith('/') ? _opt.cdb.substring(1) : _opt.cdb;
									$fn.xAjax({
										url: $fn.getProxyUrl(`/${newPath}/wcmdpost?CreateDocument`),
										method: 'post',
										dataType: 'json',
										data: {
											actiontype: "sap_transfer",
											Arg1: newPath,
											Arg2: _opt.appdockey,
										},
										async: true,
										cache: false,
									}).done(function (data) {
										console.log("처리", data);
										$fn.toast({ msg: $fn.getCodeMsg("SAP 전송이 완료되었습니다.") });

									}).fail(function (req, error) {

										console.log(req.responseText + '\n' + error);

									});

									// var moveurl = "/dwp/com/erp/mismain.nsf/agUpdateERPStatus?OpenAgent"
									// var newPath = doc.options.cdb.startsWith('/') ? doc.options.cdb.substring(1) : doc.options.cdb
									// moveurl = moveurl + "&DBPath=" + misLogDBPath
									// moveurl = moveurl + "&DocID=" + misDocID
									// moveurl = moveurl + "&CDBPath=" + newPath
									// moveurl = moveurl + "&ApprDocID=" + doc.options.appdockey

									// console.log(moveurl)
									// var hiddenIframe = document.createElement('iframe');

									// hiddenIframe.style.display = 'none'; // 아예 안 보이게
									// hiddenIframe.style.width = '0';      // 너비 0
									// hiddenIframe.style.height = '0';     // 높이 0
									// hiddenIframe.style.border = 'none';  // 테두리도 없어라!
									// hiddenIframe.id = 'hiddenProcessorFrame'; // 나중에 참조할 ID (옵션)
									// document.body.appendChild(hiddenIframe);
									// hiddenIframe.src = moveurl;

								});


							} else {
								console.log(doc)

								$fn.confirm({ msg: $fn.getCodeMsg("SAP로 입력정보를 전송하시겠습니까?") }).done(function () {
									var newPath = _opt.cdb.startsWith('/') ? _opt.cdb.substring(1) : _opt.cdb;
									$fn.xAjax({
										url: $fn.getProxyUrl(`/${newPath}/wcmdpost?CreateDocument`),
										method: 'post',
										dataType: 'json',
										data: {
											actiontype: "sap_transfer",
											Arg1: newPath,
											Arg2: _opt.appdockey,
										},
										async: true,
										cache: false,
									}).done(function (data) {
										console.log("처리", data);
										$fn.toast({ msg: $fn.getCodeMsg("SAP 전송이 완료되었습니다.") });

									}).fail(function (req, error) {

										console.log(req.responseText + '\n' + error);

									});

								});
							}

						},
						css: 'dwp-sub10-btn dwp-blue'
					},//전표번호입력
					act_numinput: {
						title: "전표번호입력", //
						click: function (doc) {
							console.log("전표번호입력");
							var vUrl = "/dwp/com/erp/mismain.nsf/JPNumForm?OpenForm";
							var sHtml = "<iframe id='JPNumPopup' src='" + vUrl + "' frameborder='0' width='100%' height='100%'></iframe>";

							$dialogWrapper = $("<div id='dialogWrapper'>" + sHtml + "</div>").css({ "display": "none", "text-align": "center" }).appendTo("body");

							var sWinTitle = '전표번호입력';
							var iWidth = 650;
							var iHeight = 595;

							var userFunc = function () {
								$(this).dialog("close");
							};

							var joBtnK = { "확인": ok_dialog, "닫기": userFunc };
							var joBtnE = { "Close": userFunc };
							var joBtnC = { "Close": userFunc };

							// 선언 부위: ok_dialog 함수 외부
							function showSimpleLoading(iframeDoc) {
								$(iframeDoc).find('#simpleLoading').show();
							}

							// 선언 부위: ok_dialog 함수 외부
							function hideSimpleLoading(iframeDoc) {
								$(iframeDoc).find('#simpleLoading').hide();
							}

							// 선언 부위: ok_dialog 함수 외부
							function disableOkButton(dialogElement) {
								$(dialogElement).closest('.ui-dialog')
									.find('.ui-dialog-buttonset button:contains("확인")')
									.prop('disabled', true)
									.addClass('ui-state-disabled');
							}

							// 선언 부위: ok_dialog 함수 외부
							function enableOkButton(dialogElement) {
								$(dialogElement).closest('.ui-dialog')
									.find('.ui-dialog-buttonset button:contains("확인")')
									.prop('disabled', false)
									.removeClass('ui-state-disabled');
							}

							function disableOkButton(dialogElement) {
								$(dialogElement).closest('.ui-dialog')
									.find('.ui-dialog-buttonset button:contains("확인")')
									.prop('disabled', true)
									.addClass('ui-state-disabled');
							}


							function enableOkButton(dialogElement) {
								$(dialogElement).closest('.ui-dialog')

									.find('.ui-dialog-buttonset button:contains("확인")')
									.prop('disabled', false)
									.removeClass('ui-state-disabled');
							}

							function ok_dialog() {
								var newPath = doc.options.cdb.startsWith('/') ? doc.options.cdb.substring(1) : doc.options.cdb;

								var $iframe = $("#JPNumPopup");
								var iframeDocument = $iframe[0].contentDocument || $iframe[0].contentWindow.document;
								var dialogElement = this;

								var jpNumValues = [];
								if ($("[name='ed_JPNum_1']", iframeDocument).val() == "") {
									$fn.alert({//aprv_sub_118.title.a36
										msg: $fn.getCodeMsg("전표번호를 입력하세요.")
									})
									return false;
								}

								for (var i = 1; i <= 30; i++) {
									var fieldName = "ed_JPNum_" + i;
									jpNumValues.push($("[name='" + fieldName + "']", iframeDocument).val());
								}

								var arg3Value = jpNumValues.join(';');
								showSimpleLoading(iframeDocument);
								disableOkButton(dialogElement);
								$fn.xAjax({
									url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/wcmdpost?CreateDocument'),
									method: 'post',
									dataType: 'json',
									data: {
										actiontype: "setnumber",
										Arg1: newPath,
										Arg2: doc.options.appdockey,
										Arg3: arg3Value
									},
									async: true,
									cache: false,
								}).done(function (data) {
									console.log(data);
									$fn.loadPage({ link: "/" + newPath + "/vdockey/" + doc.options.appdockey + "?opendocument", linktype: "PAGE" });
									$fn.toast({ msg: $fn.getCodeMsg("aprv.msg.006") });
									$("#dialogWrapper").remove();
									//dwp/aprv/hq/data/aprv2025q4.nsf/vdockey/202510311541015D3E18A209B9AD3349258D340024B67F?opendocument

								}).fail(function (req, error) {
									console.log(req.responseText + '\n' + error);
								}).always(function () {

									hideSimpleLoading(iframeDocument);
								});
							}

							$("#dialogWrapper").dialog({
								modal: true,
								resizable: false,
								draggable: true,
								title: sWinTitle,
								width: iWidth,
								height: iHeight,
								show: 'fade',
								hide: 'fade',
								autoOpen: false,
								buttons: $dwp.core.lang.getUserLang() == "ko" ? joBtnK : ($dwp.core.lang.getUserLang() == "en" ? joBtnE : joBtnC),
								closeOnEscape: true,
								open: function (event, ui) {
									var $currentDialog = $(this).closest('.ui-dialog');
									var $dialogContent = $(this);
									var $iframe = $dialogContent.find('iframe#JPNumPopup');

									var titlebarHeight = $currentDialog.find('.ui-dialog-titlebar').outerHeight();
									var buttonpaneHeight = $currentDialog.find('.ui-dialog-buttonpane').outerHeight();

									
									var iframeSrc = $iframe.attr('src');
									var finalSrc = iframeSrc.split('?')[0]; // 기존 URL에서 쿼리 파라미터만 제거
									$iframe.attr('src', finalSrc); // 쿼리 없는 URL로 재설정
									

									$dialogContent.css({
										'padding': '0',
										'box-sizing': 'border-box',
										'overflow': 'visible'
									});

									var availableContentHeight = iHeight - titlebarHeight - buttonpaneHeight - $dialogContent.outerHeight(true) + $dialogContent.height();

									try {
										if ($iframe[0].contentDocument) {
											// 이 코드는 iframe 외부 컨테이너의 padding을 조정했으므로 여기서는 놔둡니다.
											$($iframe[0].contentDocument).find('body').css({
												'margin': '0',
												'padding': '0'

											});
										}
									} catch (e) {
										console.log("Same-Origin Policy로 인해 iframe 내부 CSS 적용 불가. 또는 이미 iframe contentDocument가 로드 안됨.", e);
									}

									var parentBktxtData = [];
									var parentMoneyData = [];
									var parentNumData = [];
									var contextElement = doc.element;
									//var parentTable = contextElement.querySelector('[name="lineInputTable"]');
									//var parentTable = document.getElementById('lineInputTable');
									var parentTable = $('#lineInputTable', doc.element);
									
									
									if (parentTable) {
										
										// 부모창의 테이블에서 데이터가 있는 실제 행을 찾습니다.
										// 여기서는 `<th>`가 아닌 실제 데이터 `<td>`를 포함하는 `<tr>`들을 대상으로 합니다.
										// 주어진 HTML에서 데이터 행은 TH로 시작하지만 TD도 포함합니다.
										//var parentRows = parentTable.querySelectorAll('tr[style="display: table-row;"]'); // 모든 데이터 행 tr
										//var parentRows = parentTable.querySelectorAll('tr');
										var parentRows = parentTable.find('tr');
										var dataRowCount = 0; // 몇 번째 논리적인 데이터 행인지 카운트

										for (var i = 0; i < parentRows.length; i++) {
											var row = parentRows[i];
											// 첫 번째 자식이 <th> 이면서 텍스트가 숫자인 경우를 데이터 행의 시작으로 간주
											if (row.firstElementChild && row.firstElementChild.tagName === 'TH' && !isNaN(parseInt(row.firstElementChild.textContent.trim()))) {
												dataRowCount++; // 새로운 논리적인 데이터 행 시작

												var cells = row.getElementsByTagName('td');
												if (cells.length >= 7) { // 최소한 적요(index 1)와 금액(index 6)이 포함된 td는 있어야 합니다.
													var bktxtElement = cells[1]; // 적요가 있는 <td>
													var moneyElement = cells[6]; // 금액이 있는 <td> (주어진 HTML 기준)
													var numElement = cells[0];

													// <td> 안에 <span>이 있다면 그 <span>의 텍스트를 가져오고, 없으면 <td> 자체의 텍스트를 가져옵니다.
													var bktxtValue = bktxtElement ? (bktxtElement.querySelector('span') ? bktxtElement.querySelector('span').textContent.trim() : bktxtElement.textContent.trim()) : '';
													var moneyValue = moneyElement ? (moneyElement.querySelector('span') ? moneyElement.querySelector('span').textContent.trim() : moneyElement.textContent.trim()) : '';
													var numValue = numElement ? (numElement.querySelector('span') ? numElement.querySelector('span').textContent.trim() : numElement.textContent.trim()) : '';

													parentBktxtData.push(bktxtValue);
													parentMoneyData.push(moneyValue);
													parentNumData.push(numValue);
												}
											}
										}
									}

									$iframe.off('load').on('load', function () {
										var iframeDocument = $iframe[0].contentDocument || $iframe[0].contentWindow.document;


										if (iframeDocument) {
											// html과 body 모두 overflow를 auto로 강제 설정

											$(iframeDocument.documentElement).css({
												'overflow': 'hidden',
												'height': '100%',
												'width': '100%',
												'margin': '0',
												'padding': '0'
											});
											$(iframeDocument.body).css({
												'overflow-y': 'auto',
												'overflow-x': 'hidden',
												'height': '100%',
												'width': '100%',
												'margin': '0',
												'padding': '0'
											});
										}

										var lineInputTableElement = iframeDocument.getElementById('lineInputTable1');
										console.log(lineInputTableElement)
										if (!lineInputTableElement) {
											return;
										}

										var targetRows = lineInputTableElement.getElementsByClassName('clTrLine');
										console.log(targetRows)
										if (targetRows.length === 0) {
											return;
										}

										for (var i = 0; i < targetRows.length; i++) {
											var row = targetRows[i];
											var cells = row.getElementsByTagName('td');
											//console.log("현재 처리 중인 행의 cells:", cells);
											//console.log("cells[1]의 내용:", cells[1]); 

											if (cells.length > 3) {
												var numInput = cells[1].querySelector('input[name^="ed_JPNum_"]');
												var summaryTd = cells[2];
												var amountTd = cells[3];
												//   console.log(`[${i}번째 행] numInput 검색 결과:`, numInput); // 여기 출력이 null인지, 실제 <input> 엘리먼트인지 알려줘!

												var bktxtValue = (i < parentBktxtData.length && parentBktxtData[i] !== undefined && parentBktxtData[i] !== null) ? parentBktxtData[i] : "";
												var moneyValue = (i < parentMoneyData.length && parentMoneyData[i] !== undefined && parentMoneyData[i] !== null) ? parentMoneyData[i] : "";
												var numValue = (i < parentNumData.length && parentNumData[i] !== undefined && parentNumData[i] !== null) ? parentNumData[i] : "";

												summaryTd.innerHTML = ''; // 기존 HTML 비우기
												summaryTd.appendChild(document.createTextNode(bktxtValue)); // 새 텍스트 노드 추가
												amountTd.innerHTML = '';
												amountTd.appendChild(document.createTextNode(moneyValue));
												numInput.value = numValue;
											}
										}


									});
								},
								close: function (event, ui) {
									$("#dialogWrapper").remove();
								}
							});

							$("#dialogWrapper").dialog("open");



						},
						css: 'dwp-sub10-btn dwp-blue'
					},

					act_appline: {
						title: $fn.getCodeMsg('aprv.title.h004'), // 결재선
						click: function (doc) {
							_$$.aprv.org.initOrginfo(doc);
						}
					},

					//해당 양식의 기본결재선으로 지정 - 2023.07.10 by dwlee
					act_defaultset: {
						title: $fn.getCodeMsg('aprv.title.h159'), // 기본결재선 지정
						click: function (doc) {
							_$$.aprv.com.applinedefaultset(
								doc,
								'AppLineSave',
								'applineuser'
							);
						}
					},

					act_reqapphistory: {
						title: $fn.getCodeMsg('aprv.title.h065'), // 원문결재정보
						click: function (doc) {
							_$$.aprv.com.AppReqHistory(
								doc,
								$fn.getCodeMsg('aprv.title.h065'),
								'sReq'
							);
						}
					},
					act_apphistory: {
						title: $fn.getCodeMsg('aprv.title.h018'), // 결재정보
						click: function (doc) {
							_$$.aprv.com.AppHistory(doc, $fn.getCodeMsg('aprv.title.h018'));
						}
					},
					act_edithistory: {
						title: $fn.getCodeMsg('aprv.title.h120'), // 결재의견수정
						click: function (doc) {
							_$$.aprv.com.AppEditHistory(
								doc,
								$fn.getCodeMsg('aprv.title.h120')
							);
						}
					},

					//문서편집 - 이력관리 - 2024.09.05 by dwlee
					act_versionedit: {
						title: $fn.getCodeMsg('comm.btn.edit'), //편집
						click: function (doc) {

							_$$.aprv.com.versionedit(doc);

							//dummy 카피 후 처리 - 2024.09.04 처리 처리
							//doc.editDocument({ actiontype: 'save', docstatus: 'reg' });
						}
					},

					//이력조회 - 2024.09.05 by dwlee
					act_versionview: {
						title: $fn.getCodeMsg('aprv.btn.versionhistory'), //편집
						click: function (doc) {

							_$$.aprv.com.versionview(doc);

							//보기 조회 - 처리처리
							//doc.editDocument({ actiontype: 'save', docstatus: 'reg' });
						}
					},

					act_bbsdel: {
						title: $fn.getCodeMsg('aprv.btn.b0005'), // 게시삭제
						click: function (doc) {
							_$$.aprv.com.PostAction(doc, 'bbsdel', 'aprv.msg.021');
						}
					},
					act_bbsreg: {
						title: $fn.getCodeMsg('aprv.btn.b0006'), // 재게시
						click: function (doc) {
							_$$.aprv.com.PostAction(doc, 'bbsreg', 'aprv.msg.022');
						}
					},
					act_reqcomplete: {
						title: $fn.getCodeMsg('aprv.btn.reqcom'), // 신청부서 완료
						click: function (doc) {
							var _actopt = { actiontype: "reqcom", Unid: _opt.appdockey };
							_$$.aprv.com.PostComAction(doc, _actopt, 'aprv.msg.074');	//1단결재 완료처리 하시겠습니까?
						}
					},

					act_receive: {
						title: $fn.getCodeMsg('aprv.actions.receive'), // 접수
						click: function (doc) {
							var _opt = doc.options;
							var _data = _$$.aprv.line.LineData(doc); // 모든 결재자 정보
							var appinfohtml = _$$.aprv.line.DrawingMailAppinfo(
								_$$.aprv.line.getapplinedata(doc, _data),
								'receive',
								''
							);

							var _cur_full_list = $("input[name='sCurFullList']", doc.element).xval();

							//접수자 정보 필드 오버플로우로 수정 - 2020.07.10 by dwlee
							if ($("input[name='sCurAppfullInfoList']", doc.element).size() > 0) {
								if ($("input[name='sCurAppfullInfoList']", doc.element).xval() != "") {
									_cur_full_list = $("input[name='sCurAppfullInfoList']", doc.element).xval();
								}
							}

							var _userinfo = $fn.getCurUser();
							var _my_rcv = [];
							$.each(_cur_full_list.split(";"), function (idx, o) {
								var _o;
								var _o_vals = o.split("^");
								if (_o_vals[0] === "S") {
									_o = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.USER, o, "^");
									if (_o.notesid === _userinfo.abnotesid) {
										_my_rcv.push(_o);
									}
								} else if (_o_vals[0] === "B") {
									_o = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.DEPT, o, "^");
									//OPT12 : 1-부서원전체, 2:접수담당자
									if (_opt.appCfg.OPT12 === "1") {
										if (_o.orgcode === _userinfo.pinfo.orgcode) {
											_my_rcv.push(_o);
										}
									} else if (_opt.appCfg.OPT12 === "2") {
										if (_o.filer === _userinfo.abnotesid) {
											_my_rcv.push(_o);
										}
									}
								}
							});


							if (_my_rcv.length === 1) {
								$fn.confirm({ msg: $fn.getCodeMsg('aprv.msg.016') }).done(function () {
									_$$.aprv.com.PostActionReceive(doc, 'receive', appinfohtml, _my_rcv[0].orgcode);
								});
							} else if (_my_rcv.length > 1) {
								var _html = "<div class='dwp-table-vertical'>";
								_html += "<div class='dwp-row'>";
								_html += "<div class='dwp-title'>접수하고자 하는 부서를 선택해 주십시오.</div>";
								_html += "</div>";
								_html += "<div class='dwp-row'>";
								_html += "<div class='dwp-value'>";
								_html += "<div class='dwp-selection-group' data-xlang-type='radio'>";
								$.each(_my_rcv, function (idx, o) {
									_html += "<div class='dwp-checkbox'>";
									_html += "<label><input type='checkbox' name='RcvDept' value='" + o.orgcode + "'><span>" + $fn.getCurLangMsg(o.orgname) + "</span></label>";
									_html += "</div>";
								});
								_html += "</div><!-- dwp-selection-group -->";
								_html += "</div><!-- dwp-value -->";
								_html += "</div><!-- dwp-row -->";
								_html += "</div><!-- dwp-section -->";

								var _buttons = [{
									"title": $fn.getCodeMsg("comm.btn.confirm"),
									"click": function (obj) {
										var _checked_list = $("input[name='RcvDept']", obj.element);
										var _rtn_code = "";
										$.each(_checked_list, function (idx, o) {
											if (_rtn_code === "") _rtn_code = $(o).xval();
											else _rtn_code += "^" + $(o).xval();
										});

										if (_rtn_code === "") {
											$fn.alert({ msg: $fn.getCodeMsg("aprv.title.h139") });
										} else {
											$fn.confirm({ msg: $fn.getCodeMsg('aprv.msg.016') }).done(function () {
												_$$.aprv.com.PostActionReceive(doc, 'receive', appinfohtml, _rtn_code);
												obj.close();
											});
										}
									}
								},
								{
									"title": $fn.getCodeMsg("comm.btn.cancel"),
									"click": function (obj) {
										obj.close();
									}
								}
								];
								$fn.dialog(el, {
									modal: true,
									resizable: false,
									draggable: true,
									title: $fn.getCodeMsg("aprv.title.h139"),
									width: 400,
									height: 300,
									show: 'fade', //effect
									hide: 'fade', //effect
									//autoOpen: false,		//.dialog("open")호출시만 열림
									buttons: _buttons,
									content: { html: _html, data: {} }
								});
							} else {
								console.log("접수 건 없음");
							}
						}
					},
					act_receive_change: {
						title: $fn.getCodeMsg('aprv.actions.receive_change'), // 담당자변경
						click: function (doc) {
							_$$.aprv.com.AppReceiveChange(
								doc,
								$fn.getCodeMsg('aprv.actions.receive_change'),
								'receive_change'
							);
						}
					},
					act_receivewait_change: {
						title: $fn.getCodeMsg('aprv.actions.receive_change'), // 담당자변경
						click: function (doc) {
							_$$.aprv.com.AppReceiveChange(
								doc,
								$fn.getCodeMsg('aprv.actions.receive_change'),
								'receivewait_change'
							);
						}
					},
					act_conduct_change: {
						title: $fn.getCodeMsg('aprv.actions.receive_change'), // 담당자변경
						click: function (doc) {
							_$$.aprv.com.AppReceiveChange(
								doc,
								$fn.getCodeMsg('aprv.actions.receive_change'),
								'conduct_change'
							);
						}
					},

					act_receive_cancel: {
						title: $fn.getCodeMsg('aprv.actions.receive_cancel'), // 접수취소
						click: function (doc) {
							var act = _$$.aprv.com.getActions(['receive_cancel']);
							_$$.aprv.com.Action(
								doc,
								$fn.getCodeMsg('aprv.actions.receive_cancel'),
								act
							);
						}
					},
					act_receive_reject: {
						title: $fn.getCodeMsg('aprv.btn.reject'), // 접수 반려
						click: function (doc) {
							var act = _$$.aprv.com.getActions(['receive_reject']);
							_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.btn.reject'), act);
						}
					},

					//연속결재시 결재 수행없이 다음 결재문서 로딩 - 2020.10.06  by dwlee
					act_skip: {
						//title: $fn.getCodeMsg('aprv.btn.transfer'), // 전달
						title: '다음',
						click: function (doc) {
							_$$.aprv.com.AprDocNext(doc, 'request_transfer');
						}

					},

					//결재문서 전달기능 - 2025.09.30 by wsjung
					act_forward: {
						title: $fn.getCodeMsg('aprv.btn.transfer'), // 전달
						click: function (doc) {
							$dwp.ui.org.orgmselect.init($(this), {
								type: "multi",
								treetype: "0",
								seltype: "2",
								comcode: '',
								ismng: true,
								pardoc: doc,
								count: 20,
								fld: 'sReferenceUsers',
								selcallback: function (o) {
									var _sellist = [];
									$.each(o.list, function (idx, _list) {
										_sellist.push(_list.notesid);
									});
									//console.log("_sellist ", _sellist ) // abbriviate name list
									_$$.aprv.com.AprDocForward(doc, 'request_forward', _sellist.join(";"));
								}
							});
						}
					},

					act_add_approve: {
						title: $fn.getCodeMsg('aprv.btn.addapprove'), // 추가결재
						click: function (doc) {
							_$$.aprv.com.AddApproveChange(doc, $fn.getCodeMsg('aprv.title.h126'), 'add_approve');
						},
						css: _opt.appCfg.hasOwnProperty('AddApprover') && _opt.appCfg.AddApprover != '' ? 'dwp-hide' : ''
					},
					act_recall: {
						title: $fn.getCodeMsg('aprv.actions.recall2'), // 상신취소
						click: function (doc) {
							var _data = _$$.aprv.line.LineData(doc); // 모든 결재자 정보
							var appinfohtml = _$$.aprv.line.DrawingMailAppinfo(_$$.aprv.line.getapplinedata(doc, _data), 'recall', '');

							if (_opt.isrevdoc) {
								_$$.aprv.com.PostAction(doc, 'recall', 'aprv.msg.035', appinfohtml);
							} else {
								_$$.aprv.com.PostAction(doc, 'recall', 'aprv.msg.010', appinfohtml);
							}
						}
					},

					//보류취소 - 2024.03.29 by dwlee
					act_stopcancel: {
						title: $fn.getCodeMsg('aprv.actions.stopcancel'), //보류취소
						click: function (doc) {
							_$$.aprv.com.AprvPwVerify({
								callback: function () {
									_$$.aprv.com.PostAction(doc, 'stopcancel', $fn.getCodeMsg('aprv.msg.stopcancel'), "");
								}
							});
						}
					},

					act_recall2: {
						title: $fn.getCodeMsg('aprv.actions.recall2'), // 결재취소
						click: function (doc) {
							var act = _$$.aprv.com.getActions(['recall2']);
							var _$comment = $('textarea[name=sTmpComment]', doc.element);
							if (_$comment.size() > 0) {
								if (_$comment.val() != '') {
									$fn.alert({
										msg: $fn.getCodeMsg('aprv.msg.044')
									});
									return;
								}
							}
							_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.actions.recall2'), act);
						}
					},
					act_recall3: {
						title: $fn.getCodeMsg('aprv.actions.recall3'), // 협조요청취소
						click: function (doc) {
							var act = _$$.aprv.com.getActions(['recall3']);
							_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.actions.recall3'), act);
						}
					},
					act_raiserecall3: {
						title: $fn.getCodeMsg('aprv.actions.recall3'), // 기안 협조요청취소
						click: function (doc) {
							var act = _$$.aprv.com.getActions(['raiserecall3']);
							_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.actions.recall3'), act);
						}
					},
					act_reraise: {
						title: $fn.getCodeMsg('aprv.actions.reraise'), // 재기안
						click: function (doc) {
							if (_opt.isrevdoc) {
								_$$.aprv.com.PostAction(doc, 'receive_reraise', 'aprv.msg.035');
							} else {
								_$$.aprv.com.PostAction(doc, 'reraise', 'aprv.msg.008');
							}
						}
					},
					act_redraft: {
						title: $fn.getCodeMsg('aprv.btn.b0008'), // 문서재작성
						click: function (doc) {
							_$$.aprv.com.PostAction(doc, 'redraft');
						}
					},

					act_resend: {
						title: "재전송", // 문서재작성
						click: function (doc) {
							$fn.confirm({ msg: "수신처로 재전송 하시겠습니까?" }).done(function () {
								_$$.aprv.com.PostAction(doc, 'resend');
							});
						}
					},

					//결재전결 - 2023.03.03 by dwlee
					act_decide: {
						title: $fn.getCodeMsg('aprv.actions.decide'), // 결재
						click: function (doc) {

							//2,3단 결재 전결시 1단결재 체크하여 전결못하도록 처리	- 2025.02.06
							var _opt = doc.options;
							//보조 JS에서 저장함수 정의시...
							if (_opt.sDocStep != "1") {
								//보조 JS에서 2,3단계 Save Check
								//2,3단계 결재의 첫번째 결재시 Validation 함수 - 2022.05.23 by dwlee
								var _rtn = _$$.aprv.com._req23StepValidate(doc);
								if (_rtn == false) {
									return false;
								}
							}

							_$$.aprv.com.AprvPwVerify({
								callback: function () {
									var act = _$$.aprv.com.getActionObject(doc);

									// console.log("act",act);
									_$$.aprv.com.Action(
										doc,
										$fn.getCodeMsg('aprv.title.h158'), //전결
										act,
										false,
										"decide"
									);
								}
								//연속결재에서 첫번째 결재자 인지 체크 - 2020.10.15 by dwlee
								, continue: doc.options.continueapr
							});
						},
						css: "dwp-red dwp-bold"
					},

					act_paperapprove: {
						title: $fn.getCodeMsg('aprv.actions.paperagree'), // 서면결재
						click: function (doc) {
							function paperApprove() {
								_$$.aprv.com.AprvPwVerify({
									callback: function () {
										var act = _$$.aprv.com.getActionObject(doc);
										act = _$$.aprv.com.getActions(['paperagree']);
										_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.title.paperagree'), act, false, "paperagree");
									}
									//연속결재에서 첫번째 결재자 인지 체크 - 2020.10.15 by dwlee
									,
									continue: doc.options.continueapr
								});
							}
							var vchk = _$$.aprv.com.aprdocvalidate(doc);
							if (typeof vchk == "function") {
								vchk(function () {
									paperApprove();
								});
							} else {
								if (vchk) {
									paperApprove();
								} else {
									console.log("오류입니다만....");
								}
							}
						},
						css: "dwp-red dwp-bold"
					},
					act_approve: {
						title: $fn.getCodeMsg('aprv.actions.agree'), // 결재
						click: function (doc) {
							function realApprove() {
								_$$.aprv.com.AprvPwVerify({
									callback: function () {
										var act = _$$.aprv.com.getActionObject(doc);
										// console.log("act",act);
										_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.title.h005'), act, false);
									}
									//연속결재에서 첫번째 결재자 인지 체크 - 2020.10.15 by dwlee
									,
									continue: doc.options.continueapr
								});
							}
							//법인카드 회계전표, 지출(수입)결의 및 회계전표 결재취소후 결재상신 불가 처리
							//sCurAppIDList 기안자 결재취소 후에는 값이 있음을 활용
							var stopExecution = false;
							console.log(doc);
							var _opt = doc.options;
							if (_opt.docstatus == "draft" && (_opt.appCfg.FormAlias == "AF215" || _opt.appCfg.FormAlias == "AF216")) {
								if (_opt.isrevdoc == false) {
									//발신문서만 진행						
									var newPath = _opt.cdb.startsWith('/') ? _opt.cdb.substring(1) : _opt.cdb;
									$fn.xAjax({
										url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/wcmdpost?CreateDocument'),
										method: 'post',
										dataType: 'json',
										data: {
											actiontype: "afformselect",
											Arg1: newPath,
											Arg2: doc.options.appdockey

										},
										async: false,
										cache: false,
									}).done(function (data) {
										console.log("처리", data);
										if (data.CurAppIDList != "") {
											$fn.alert({//aprv_sub_118.title.a36
												msg: $fn.getCodeMsg("aprv.msg.078")
											})
											stopExecution = true;
											return false;
										}
									}).fail(function (req, error) {
										console.log(req.responseText + '\n' + error);

									});
								}
							}
							//af215,215 기안자 결재취소시 결재 진행 막음
							if (stopExecution) {
								return false;
							}

							var vchk = _$$.aprv.com.aprdocvalidate(doc);
							if (typeof vchk == "function") {
								vchk(function () {
									realApprove();
								});
							} else {
								if (vchk) {
									realApprove();
								} else {
									console.log("오류입니다만....");
								}
							}
						}
					},

					act_dapprove: {
						title: $fn.getCodeMsg('aprv.actions.dagree'), // 바로결재
						click: function (doc) {
							function realApprove() {
								// 평가여부체크
								var _evaluation = '';
								if ($('input[name=ActEvaluation]', doc.element).size() > 0) {
									_evaluation = $('input[name=ActEvaluation]', doc.element).xval();
								}

								if (doc.options.isevaluation && _evaluation == '') {
									_$$.aprv.com.AprvPwVerify({
										callback: function () {
											var act = _$$.aprv.com.getActionObject(doc);
											// console.log("act",act);
											_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.title.h005'), act, false);
										}
										//연속결재에서 첫번째 결재자 인지 체크 - 2020.10.15 by dwlee
										,
										continue: doc.options.continueapr
									});
								} else {
									_$$.aprv.com.AprvPwVerify({
										callback: function () {
											var _LineData = _$$.aprv.line.LineData(doc);
											if (_$$.aprv.com.actvalidation(doc, _LineData)) {
												return false;
											}
											_$$.aprv.com.actionProcess(null, doc);
										}
										//연속결재에서 첫번째 결재자 인지 체크 - 2020.10.15 by dwlee
										,
										continue: doc.options.continueapr
									});
								}
							}
							//법인카드 회계전표, 지출(수입)결의 및 회계전표 결재취소후 결재상신 불가 처리
							//sCurAppIDList 기안자 결재취소 후에는 값이 있음을 활용
							var stopExecution = false;
							if (doc.options.appCfg.FormAlias == "AF215" || doc.options.appCfg.FormAlias == "AF216") {
								if (doc.options.isrevdoc == false) {
									//발신문서만 진행	
									var newPath = doc.options.cdb.startsWith('/') ? doc.options.cdb.substring(1) : doc.options.cdb
									$fn.xAjax({
										url: $fn.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/wcmdpost?CreateDocument'),
										method: 'post',
										dataType: 'json',
										data: {
											actiontype: "afformselect",
											Arg1: newPath,
											Arg2: doc.options.appdockey

										},
										async: false,
										cache: false,
									}).done(function (data) {
										console.log("처리", data);
										if (data.CurAppIDList != "") {
											$fn.alert({//aprv_sub_118.title.a36
												msg: $fn.getCodeMsg("aprv.msg.078")
											})
											stopExecution = true;
											return false;
										}
									}).fail(function (req, error) {
										console.log(req.responseText + '\n' + error);

									});
								}
							}
							//af215,215 기안자 결재취소시 결재 진행 막음
							if (stopExecution) {
								return false;
							}

							var vchk = _$$.aprv.com.aprdocvalidate(doc);
							if (typeof vchk == "function") {
								vchk(function () {
									realApprove()
								});
							} else {
								if (vchk) {
									realApprove()
								}
							}
						},
						css: "dwp-default"
					},
					act_reject: {
						title: $fn.getCodeMsg('aprv.actions.reject'), // 반려
						click: function (doc) {
							_$$.aprv.com.AprvPwVerify({
								callback: function () {
									var act = _$$.aprv.com.getActionObject(doc);
									// console.log("act",act);
									_$$.aprv.com.Action(
										doc,
										$fn.getCodeMsg('aprv.title.h005'),
										act,
										false,
										'reject'
									);
								}
								//연속결재에서 첫번째 결재자 인지 체크 - 2020.10.15 by dwlee
								,
								continue: doc.options.continueapr
							});
							//var act = _$$.aprv.com.getActionObject(doc);
							//console.log("act",act);
							//_$$.aprv.com.Action(doc,$fn.getCodeMsg("aprv.title.h005"),act,false);
						}
					},
					act_add_comment: {
						title: $fn.getCodeMsg('aprv.btn.comment'), // 의견달기
						click: function (doc) {

							const _curempno = $fn.getCurUser().pinfo.empno;
							var oobj = new Object();
							oobj['comment'] = $fn.getCodeMsg('aprv.btn.comment');

							//현재사용자가 추가한 의견이 보이도록 수정함 - 2025-10-17 by wsjung
							var _tmp = "";
							var _tmpcmt = _$$.aprv.line.getComment_AGP(_curempno, doc);
							if (_tmpcmt != "") {
								_oArr = _tmpcmt.split("†");
								if (_oArr[1] === _curempno) {
									_tmp = _tmpcmt;
								}
							}
							//oobj['txt'] = $('textarea[name=sTmpComment]', doc.element).val();
							oobj['txt'] = _tmp;
							var act = oobj;
							console.log("act", act);
							_$$.aprv.com.ActionCom(doc, $fn.getCodeMsg('aprv.btn.comment'), act, false, 'wFrmAprvComDialog', '620', 'auto');
						}
					},

					//보안의견(포스트잇) - 2024.12.29 by dwlee
					act_add_seccomment: {
						title: $fn.getCodeMsg('aprv.title.h128'), // 의견달기, 보안의견
						click: function (doc) {
							_$$.aprv.doc._addSecComment(doc);
						},
						css: "dwp-blue dwp-bold"
					},

					//보안의견 조회 - 2024.12.30 by dwlee
					act_show_seccomment: {
						title: $fn.getCodeMsg('aprv.title.readseccomment'), // 의견달기, 보안의견
						click: function (doc) {
							_$$.aprv.doc._showSecComment(doc);
						},
						css: "dwp-none dwp-red dwp-bold"
					},

					act_evaluate: {
						title: $fn.getCodeMsg('aprv.btn.evaluate'), // 평가하기
						click: function (doc) {
							var oobj = new Object();
							oobj['evaluate'] = $fn.getCodeMsg('aprv.btn.evaluate');
							oobj['txt'] = $('input[name=ActEvaluation]', doc.element).val();
							var act = oobj;

							_$$.aprv.com.ActionCom(
								doc,
								$fn.getCodeMsg('aprv.btn.evaluate'),
								act,
								false,
								'wFrmEvaluateDialog',
								'520',
								'auto',
								null,
								function (_$dialog, $doc) {
									var evaluation = $(':radio[name="evaluation"]:checked', _$dialog.element).val();
									if (typeof evaluation == 'undefined') {
										$fn.alert({
											msg: $fn.getCodeMsg('aprv.msg.033')
										});
										return false;
									}
									_$$.aprv.com.setFld('ActEvaluation', evaluation, $doc.element);

									_$$.aprv.com.appdocsave($doc, {
										actiontype: 'evaluate',
										callback: _$$.aprv.com.savecallback
									});

									_$dialog.close();
								}
							);
						}
					},
					act_added: {
						title: $fn.getCodeMsg('aprv.btn.added'), // 본문첨언
						click: function (doc) {
							var oobj = new Object();
							oobj['added'] = $fn.getCodeMsg('aprv.btn.added');
							var act = oobj;
							// console.log("act",act);

							_$$.aprv.com.ActionCom(doc, $fn.getCodeMsg('aprv.btn.added'), act, false, 'wFrmAprvComDialog', '520', 'auto');
						}
					},
					act_delegation: {
						title: $fn.getCodeMsg('aprv.btn.b0010'), // 권한위임
						click: function (doc) {
							var oobj = new Object();
							oobj['securitychange'] = $fn.getCodeMsg('aprv.btn.b0010');
							var act = oobj;

							_$$.aprv.com.ActionCom(
								doc,
								$fn.getCodeMsg('aprv.btn.b0010'),
								act,
								false,
								'wFrmDelegationDialog',
								'820',
								'auto',
								_$$.aprv.com.DelegationValidate,
								_$$.aprv.com.DelegationSave
							);
						}
					},
					act_securitychange: {
						title: $fn.getCodeMsg('aprv.btn.b0009'), // 보안등급변경
						click: function (doc) {
							var oobj = new Object();
							oobj['securitychange'] = $fn.getCodeMsg('aprv.btn.b0009');
							var act = oobj;

							_$$.aprv.com.ActionCom(
								doc,
								$fn.getCodeMsg('aprv.btn.b0009'),
								act,
								false,
								'wFrmSecurityChangeDialog',
								'520',
								'auto',
								_$$.aprv.com.SecurityChangeValidate,
								_$$.aprv.com.SecurityChangeSave
							);
						}
					},
					act_reqmutual: {
						title: $fn.getCodeMsg('aprv.btn.mutualreject'), // 협조요청
						click: function (doc) {
							var act = _$$.aprv.com.getActionObject(doc);
							_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.actions.reqmutual'), act);
						}
					},
					act_mutual: {
						//						title: $fn.getCodeMsg('aprv.btn.mutual'), // 협조  //aprv.btn.aid
						title: $fn.getCodeMsg('aprv.btn.aid'), // 협조 버튼으로 통일 - 2024.08.23 by dwlee
						click: function (doc) {
							var act = _$$.aprv.com.getActionObject(doc);
							//_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.btn.mutual'), act, false);
							//동의,비동의 추가 - 2024.08.22
							_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.btn.mutual'), act, false, 'mutual');
						}
					},

					/*
										act_mutual_reject: {
											title: $fn.getCodeMsg('aprv.btn.mutualreject'), // 협조반려
											click: function (doc) {
												var act = _$$.aprv.com.getActionObject(doc);
												_$$.aprv.com.Action(doc, $fn.getCodeMsg('aprv.btn.mutualreject'), act, false, 'mutual_reject');
											}
										},
					*/
					/*
							by mjkim 20250120 isopenver 추가
					*/


					act_edit: {
						title: $fn.getCodeMsg('comm.btn.edit'), //편집
						click: function (doc) {
							console.log(doc)
							console.log(doc.options.appCfg.FormAlias)
							//법인카드 회계전표, 지출(수입)결의 및 회계전표 임시저장후 편집 안됨
							if (doc.options.appCfg.FormAlias == "AF215" || doc.options.appCfg.FormAlias == "AF216") {
								console.log(doc.options.isnew)
								if (doc.options.isnew == false) {
									$fn.alert({
										msg: $fn.getCodeMsg("aprv.msg.077")
									})
									return false;
								}

							}
							doc.editDocument({ actiontype: 'save', docstatus: 'reg', param: { isopenver: "y" } });
						}
					},
					act_delete: {
						title: $fn.getCodeMsg('comm.btn.deldoc'), // 삭제
						click: function (doc) {
							if ('/' + opt.appCfg.InitDBPath == opt.cdb) {
								//연동문서 삭제시 - 2024.08.08 by dwlee
								var _$eprkey = $("input[name=ErpDocID]", doc.element);
								if (_$eprkey.size() > 0 && _$eprkey.xval() != "") {
									_$$.aprv.com.PostAction(doc, 'admindocdel', '결재문서를 삭제하시면  ERP에서 요청을 다시 수행하셔야 합니다.');
								} else {
									//doc.deleteDocument();

									//협업에서 넘어온 문서 삭제시에 이렇게 연동을 하도록 설정 - 2024.11.14 by dwlee
									if (opt.hasOwnProperty("iscollink") && opt.iscollink) {
										_$$.aprv.com.PostAction(doc, 'admindocdel', '');
									} else {
										doc.deleteDocument();
									}
								}
							} else {
								_$$.aprv.com.PostAction(doc, 'admindocdel', 'aprv.msg.018');
							}
						}
					},
					act_hide: {
						title: $fn.getCodeMsg('aprv.btn.hide'), // 숨김
						click: function (doc) {
							_$$.aprv.com.PostAction(doc, 'admindochide');
						}
					},
					act_show: {
						title: $fn.getCodeMsg('aprv.btn.show'), // 공개
						click: function (doc) {
							_$$.aprv.com.PostAction(doc, 'admindocshow');
						}
					},
					act_pdeldoc: {
						title: $fn.getCodeMsg('comm.btn.pdeldoc'), // 영구삭제
						click: function (doc) {
							doc.deleteDocument({ softdel: false });
						}
					},
					act_restoredoc: {
						title: $fn.getCodeMsg('comm.btn.restoredoc'), // 복원
						click: function (doc) {
							doc.restoreDocument({ docstatus: 'reg' });
						}
					},
					act_docclose: {
						title: $fn.getCodeMsg('comm.btn.list'), // 닫기
						click: function (doc) {
							doc.goview();
						}
					},
					act_certi_print: {
						title: $fn.getCodeMsg('aprv.btn.certi_print'), // 증명서인쇄
						click: function (doc) {
							doc.printDoc({
								showcss: ['.certi_title'],
								hidecss: [
									'div.dwp-section.head-area',
									'div.dwp-approval-info-dialog'
								]
							});
							//재직증명서, 경력증명서만 수행하도록 처리 - 2017.10.25 by dwlee
							// $dwp.app.aprv_sub082.subdoc.printlog(doc);       //TCC 사용안함
						}
					},
					act_offform_print: {
						title: $fn.getCodeMsg('aprv.btn.offform_print'), // 공문인쇄
						click: function (doc) {
							doc.printDoc({
								showcss: ['.certi_title'],
								hidecss: [
									'div.close-area'
								]
							});
							//재직증명서, 경력증명서만 수행하도록 처리 - 2017.10.25 by dwlee
							// $dwp.app.aprv_sub082.subdoc.printlog(doc);       //TCC 사용안함
						}
					},

					//문서유통용 버튼 - 2023.02.17  by dwlee
					//사용하지 않음
					act_seal: {
						title: "직인날인",
						click: function (doc) {
							$fn.confirm({
								msg: "직인을 날인하시겠습니까?"
							}).done(function () {
								_$$.aprv.com.PostAction(doc, 'act_seal');
							});
						},
						css: "dwp-red"
					},

					//문서유통용 버튼 - 2023.02.17  by dwlee
					//사용하지 않음
					act_skipseal: {
						title: "직인생략",
						click: function (doc) {
							$fn.confirm({
								msg: "직인을 생략하시겠습니까?"
							}).done(function () {
								_$$.aprv.com.PostAction(doc, 'act_skipseal');
							});
						},
						css: "dwp-red"
					},

					//사용하지 않음
					act_dtd: {
						title: "내용검증",
						click: function (doc) {
							_$$.aprv.com.PostAction(doc, 'act_validdoc');
						},
						css: "dwp-blue"
					},

					//사용하지 않음
					act_send: {
						title: "발송처리",
						click: function (doc) {
							$fn.confirm({
								msg: "결재문서를 대외 수신자에게 발송하시겠습니까?"
							}).done(function () {
								_$$.aprv.com.PostAction(doc, 'act_distsend');
							});
						},
						css: "dwp-red"
					}
				};

				/**
				 * 결재 PDF 조회
				 * @param {*} doc 
				 * @param {*} callback 
				 */
				_opt.userpdf_back = function (doc, callback) {
					var _html = [];
					_html.push("<div class='dwp-table-vertical'>");
					_html.push("  <div class='dwp-row'>");
					_html.push("    <div class='dwp-title'>제외항목</div>");
					_html.push("    <div class='dwp-value'>");
					_html.push("      <div class='dwp-selection-group'>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' data-xlang-txt='결재선' value='AprLine'><span>결재선</span></label></div>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' data-xlang-txt='기본정보' value='AprInfo'><span>기본정보</span></label></div>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' data-xlang-txt='양식명' value='AprTitle'><span>양식명</span></label></div>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' data-xlang-txt='결재자의견' value='AprCmt' checked><span>결재자의견</span></label></div>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' data-xlang-txt='첨부파일' value='AprAttach'><span>첨부파일</span></label></div>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' data-xlang-txt='관련근거' value='AprBookmark'><span>관련근거</span></label></div>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' data-xlang-txt='외부공문' value='AprOutSide'><span>외부공문</span></label></div>");
					_html.push("      </div>");
					_html.push("    </div>");
					_html.push("  </div>");
					_html.push("  <div class='dwp-row'>");
					_html.push("    <div class='dwp-title'>다운로드</div>");
					_html.push("    <div class='dwp-value'>");
					_html.push("      <div class='dwp-selection-group'>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfDownload' type='checkbox' value='AprLine'><span>PDF 파일로 다운로드</span></label></div>");
					_html.push("      </div>");
					_html.push("    </div>");
					_html.push("  </div>");
					_html.push("</div>");

					$fn.dialog(doc.element, {
						modal: true,
						resizable: true,
						draggable: true,
						title: "PDF 옵션",
						width: 600,
						height: 300,
						show: 'fade', // effect
						hide: 'fade', // effect
						buttons: [{
							"title": "확인",
							"css": "confirm",
							"click": function (_$dialog) {
								var _el = _$dialog.element,
									_$chk_list = $("input[name='pdfOption']:checked", _el),
									param1 = "",
									param2 = "";
								$.each(_$chk_list, function (idx, o) {
									param1 += (param1 != "" ? "," : "") + $(o).xval();
								});
								if ($("input[name='pdfDownload']:checked", _el).length == 1) {
									param2 = "&isattach=1";
								}
								callback({ params: (param1 != "" ? "&AprHidden=" + param1 : "") + param2 });
								_$dialog.close();
							}
						}, {
							"title": "취소",
							"css": "cancel",
							"click": function (_$dialog) {
								_$dialog.close();
							}
						}],
						content: { html: _html.join("") },
						initcallback: function ($dialog) {
							var _el = $dialog.element;
							$("input[name='pdfOption'][value='AprOutSide']", _el).off("change").bind("change", function () {
								if ($(this).is(":checked")) {
									$("input[name='pdfOption']", _el).prop("checked", true);
								} else {
									$("input[name='pdfOption']", _el).prop("checked", false);
								}
							})
						}
					});
				};

				// 결재 PDF 조회 - 2024.03.12 by dwlee
				//인쇄와 옵션을 통일 - 2024.03.12 by dwlee
				_opt.userpdf = function (doc, callback) {
					var _html = [];
					_html.push("<div class='dwp-table-vertical'>");
					_html.push("  <div class='dwp-row'>");
					_html.push("    <div class='dwp-value'>");
					_html.push("      <div class='dwp-selection-group'>");

					//아래 항목들을 portal의 wfrmPDF 양식 에서 숨김처리
					//인쇄와 동일하게 처리 - 2023.12.21 by dwlee
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' value='AprLine'><span>" + $fn.getCodeMsg("aprv.title.h180") + "</span></label></div>");		// 결재선 제외
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' value='AprFormTitle'><span>" + $fn.getCodeMsg("aprv.title.h182") + "</span></label></div>");	// 서식명 제외
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' value='BaseInfo'><span>" + $fn.getCodeMsg("aprv.title.h181") + "</span></label></div>");		// 기본정보 제외
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' value='AprComment'><span>" + $fn.getCodeMsg("aprv.title.h183") + "</span></label></div>");		// 결재자 의견 제외
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' value='AprAttach'><span>" + $fn.getCodeMsg("aprv.title.h184") + "</span></label></div>");		// 첨부파일 제외
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' value='AprBookmark'><span>" + $fn.getCodeMsg("aprv.title.h196") + "</span></label></div>");		// 관련근거 제외
					//_html.push("        <div class='dwp-checkbox'><label><input name='pdfOption' type='checkbox' value='AprReply'><span>" + $fn.getCodeMsg("aprv.title.h193") + "</span></label></div>");		// 댓글 제외
					_html.push("      </div>");
					_html.push("    </div>");
					_html.push("  </div>");
					_html.push("  <div class='dwp-row'>");
					_html.push("    <div class='dwp-title'>" + $fn.getCodeMsg("aprv.title.pdf003") + "</div>");		// 다운로드
					_html.push("    <div class='dwp-value'>");
					_html.push("      <div class='dwp-selection-group'>");
					_html.push("        <div class='dwp-checkbox'><label><input name='pdfDownload' type='checkbox' value='AprLine'><span>" + $fn.getCodeMsg("aprv.title.pdf010") + "</span></label></div>");			// PDF 파일로 다운로드
					_html.push("      </div>");
					_html.push("    </div>");
					_html.push("  </div>");
					_html.push("</div>");

					$fn.dialog(doc.element, {
						modal: true,
						resizable: true,
						draggable: true,
						title: $fn.getCodeMsg("aprv.title.pdf001"),		// PDF 옵션
						width: 600,
						height: 300,
						show: 'fade', // effect
						hide: 'fade', // effect
						buttons: [{
							"title": $fn.getCodeMsg("aprv.btn.b0001"),	// 확인
							"css": "confirm",
							"click": function (_$dialog) {
								var _el = _$dialog.element,
									_$chk_list = $("input[name='pdfOption']:checked", _el),
									param1 = "",
									param2 = "";
								$.each(_$chk_list, function (idx, o) {
									param1 += (param1 != "" ? "," : "") + $(o).xval();
								});

								//댓글 갯수가 0인 경우는 댓글영역 감추기 - 2024.01.05
								if ($("span[name='replycnt']", $(".dwp-comment-area", doc.element)).html() == "0") {
									param1 += (param1 != "" ? "," : "") + "AprReplCnt";
								}

								if (!param1.includes("AprAttach")) {
									if ($(".dwp-file", $(".dwp-section:has(> #attachments)", doc.element)).size() > 0) {
										param1 += (param1 != "" ? "," : "") + "AttachTitle";							//첨부파일 타이틀
									}
								}

								if (!param1.includes("AprBookmark")) {
									if ($("input[name='refdocs']", doc.element).xval() != "") {
										param1 += (param1 != "" ? "," : "") + "AprBookTitle";						//관련근거 첨부파일 타이틀
									}
								}

								if ($("input[name='pdfDownload']:checked", _el).length == 1) {
									param2 = "&isattach=1";
								}
								callback({ params: (param1 != "" ? "&AprHidden=" + param1 : "") + param2 });
								_$dialog.close();
							}
						}, {
							"title": $fn.getCodeMsg("comm.btn.cancel"),		// 취소
							"css": "cancel",
							"click": function (_$dialog) {
								_$dialog.close();
							}
						}],
						content: { html: _html.join("") },
						initcallback: function ($dialog) {
							var _el = $dialog.element;
							$("input[name='pdfOption'][value='AprOutSide']", _el).off("change").bind("change", function () {
								if ($(this).is(":checked")) {
									$("input[name='pdfOption']", _el).prop("checked", true);
								} else {
									$("input[name='pdfOption']", _el).prop("checked", false);
								}
							})
						}
					});
				};

				//한글 저장시 .... - 2023.05.18 by dwlee
				_opt.userhwp = function (doc) {
					var _opt = doc.options;
					var _islock = "true";
					if (_opt.docstatus == "draft") {					//기안인 경우만 다운로드 된 HWP 파일을 수정이 가능하도록 변경
						_islock = "false";
					}
					var _fileName = $("input[name=Subject]", _me.element).xval();
					HwpCtrl.SaveAs(_fileName + ".hwp", "HWP", "lock:" + _islock + ";download:true;prvtext:1");
				};

				//PDF 저장과 옵션을 동일하게 처리 - 2024.03.12 by dwlee
				_opt.userprint = function (doc) {
					//한글 웹에디터 인쇄(pdf 변환 후 인쇄) - 2023.05.11 by dwlee					
					if ($("input[name=curWebEditor]", doc.element).size() > 0 && $("input[name=curWebEditor]", doc.element).xval() == "hwpeditor") {
						HwpCtrl.PrintDocument();
						return;
					};
					/*
						by mjkim 20241107 결제선 제외 시 AprOneLine 추가
					*/
					var _hide_class = {
						"AprLine": ".dwp-section:has(> .sign-wrap), .dwp-section > .AprOneLine",
						"OutSide": ".dwp-form-table:has(div.subject)",
						"BaseInfo": ".dwp-form-table:has(span[name='DISPOSAL_DATE'])",
						"AprFormTitle": ".dwp-formnm",
						"AprComment": ".dwp-form-table:has([data-xlang-code='aprv.title.h020'])",
						"AprAttach": ".dwp-section:has(> #attachments)",
						"AprBookmark": "div[name=appbookmark]", 					//관련근거 제외 추가 -2023.12.21 add by dwlee
						"AprReply": ".dwp-comment-area"
					};
					var _html = "";
					_html += "<div class='dwp-row'>";
					_html += "<div class='dwp-value'>";
					_html += "<div class='dwp-selection-group'>";
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' value='AprLine'><span>" + $fn.getCodeMsg("aprv.title.h180") + "</span></label></div>";		// 결재선 제외
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' value='AprFormTitle'><span>" + $fn.getCodeMsg("aprv.title.h182") + "</span></label></div>";	// 서식명 제외
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' value='BaseInfo'><span>" + $fn.getCodeMsg("aprv.title.h181") + "</span></label></div>";		// 기본정보 제외
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' value='AprComment'><span>" + $fn.getCodeMsg("aprv.title.h183") + "</span></label></div>";	// 결재자 의견 제외
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' value='AprAttach'><span>" + $fn.getCodeMsg("aprv.title.h184") + "</span></label></div>";	// 첨부파일 제외

					//관련근거 제외 추가 - 2023.12.21 by dwlee
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' value='AprBookmark'><span>" + $fn.getCodeMsg("aprv.title.h196") + "</span></label></div>";	// 관련근거 제외

					//_html +=			"<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' value='AprReply'><span>" + $fn.getCodeMsg("aprv.title.h193") + "</span></label></div>";		// 댓글 제외

					// _html +=	"<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' data-xlang-txt='외부공문' value='OutSide'><span>외부공문</span></label></div>";
					_html += "</div>";
					_html += "</div>";
					_html += "</div>";
					_html += "";
					$fn.dialog(doc.element, {
						modal: true,
						resizable: true,
						draggable: true,
						title: $fn.getCodeMsg("aprv.title.h179"),		// 인쇄옵션
						width: 600,
						show: 'fade', // effect
						hide: 'fade', // effect
						//autoOpen: false,		//.dialog("open")호출시만 열림
						buttons: [{
							"title": $fn.getCodeMsg("comm.btn.confirm"),		// 확인
							"css": "confirm",
							"click": function (_$dialog) {
								var _el = _$dialog.element;
								var _$chk_list = $("input[name='PrintOption']:checked", _el);
								var _print_opt = { hidecss: [] };
								$.each(_$chk_list, function (idx, o) {
									if (_hide_class.hasOwnProperty($(o).xval())) {
										if ($.isArray(_hide_class[$(o).xval()])) {
											$.each(_hide_class[$(o).xval()], function (i, o) {
												_print_opt.hidecss.push(o);
											});
										} else {
											_print_opt.hidecss.push(_hide_class[$(o).xval()]);
										}
									}
								});
								//댓글 갯수가 0인 경우는 댓글영역 감추기 - 2024.01.05
								if (_print_opt.hidecss.length == 0 || !$.inArray(".dwp-comment-area", _print_opt.hidecss)) {
									if ($("span[name='replycnt']", $(".dwp-comment-area", doc.element)).html() == "0") {
										_print_opt.hidecss.push(".dwp-comment-area");
									}
								}
								//첨부파일 인쇄하는 경우
								if ($.inArray(".dwp-section:has(> #attachments)", _print_opt.hidecss) == -1) {
									if ($(".dwp-file", $(".dwp-section:has(> #attachments)", doc.element)).size() > 0) {
										_print_opt.hidecss.push(".attach_preview");
										if (!_print_opt.hasOwnProperty("showcss")) {
											_print_opt.showcss = [];
										}
										_print_opt.showcss.push("div.dwp-attachfile-title");
									}
								}
								//관련그건 파링이 있는 경우 - 2024.01.08
								if ($.inArray("div[name=appbookmark]", _print_opt.hidecss) == -1) {
									if ($("input[name='refdocs']", doc.element).xval() != "") {
										if (!_print_opt.hasOwnProperty("showcss")) {
											_print_opt.showcss = [];
										}
										_print_opt.showcss.push("div.dwp-referdoc-title");
									}
								}
								$dwp.app.aprv.doc._print(_print_opt, doc);
								_$dialog.close();
							}
						}, {
							"title": $fn.getCodeMsg("comm.btn.cancel"),		// 취소
							"css": "cancel",
							"click": function (_$dialog) {
								_$dialog.close();
							}
						}],
						content: { html: _html },
						initcallback: function ($dialog) {
							var _el = $dialog.element;
							//$("input[name='PrintOption']", _el).find("[value='AprComment']").prop("checked", true);
							$("input[name='PrintOption'][value='OutSide']", _el).off("change").bind("change", function () {
								if ($(this).is(":checked")) {
									$("input[name='PrintOption']", _el).prop("checked", true);
								} else {
									$("input[name='PrintOption']", _el).prop("checked", false);
								}
							})
						}
					});
				};

				//과거 자료 백업 
				_opt.userprint_back = function (doc) {

					//한글 웹에디터 인쇄(pdf 변환 후 인쇄) - 2023.05.11 by dwlee					
					if ($("input[name=curWebEditor]", doc.element).size() > 0 && $("input[name=curWebEditor]", doc.element).xval() == "hwpeditor") {
						HwpCtrl.PrintDocument();
						return;
					};

					//console.log("printdoc==>", doc.options.appCfg.FormAlias)
					var _hide_class = {
						"AprLine": ".dwp-section:has(> .sign-wrap)",
						"OutSide": ".dwp-form-table:has(div.subject)",
						"BaseInfo": ".dwp-form-table:has(span[name='DISPOSAL_DATE'])",
						"AprFormTitle": ".dwp-formnm",
						"AprComment": ".dwp-form-table:has([data-xlang-code='aprv.title.h020'])",
						"AprAttach": ".dwp-section:has(> #attachments)"
					};
					var _html = "";
					_html += "<div class='dwp-row'>";
					_html += "<div class='dwp-title'>";
					_html += "※ 제외항목 :";
					_html += "</div>";
					_html += "<div class='dwp-value'>";
					_html += "<div class='dwp-selection-group'>";
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' data-xlang-txt='결재선' value='AprLine'><span>결재선</span></label></div>";
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' data-xlang-txt='기본정보' value='BaseInfo'><span>기본정보</span></label></div>";
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' data-xlang-txt='양식명' value='AprFormTitle'><span>양식명</span></label></div>";
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' checked data-xlang-txt='결재자의견' value='AprComment'><span>결재자의견</span></label></div>";
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' data-xlang-txt='첨부파일' value='AprAttach'><span>첨부파일</span></label></div>";
					_html += "<div class='dwp-checkbox'><label><input name='PrintOption' type='checkbox' data-xlang-txt='외부공문' value='OutSide'><span>외부공문</span></label></div>";
					_html += "</div>";
					_html += "</div>";
					_html += "</div>";
					_html += "";
					$fn.dialog(doc.element, {
						modal: true,
						resizable: true,
						draggable: true,
						title: "인쇄옵션",
						width: 600,
						height: 280,
						show: 'fade', // effect
						hide: 'fade', // effect
						//autoOpen: false,		//.dialog("open")호출시만 열림
						buttons: [{
							"title": "확인",
							"css": "confirm",
							"click": function (_$dialog) {
								var _el = _$dialog.element;
								var _$chk_list = $("input[name='PrintOption']:checked", _el);
								var _print_opt = { hidecss: [] };
								$.each(_$chk_list, function (idx, o) {
									//console.log("_hide_class==>",_hide_class.hasOwnProperty($(o).xval()))
									if (_hide_class.hasOwnProperty($(o).xval())) {
										//	console.log("isArray==>",$.isArray(_hide_class[$(o).xval()]))
										if ($.isArray(_hide_class[$(o).xval()])) {
											$.each(_hide_class[$(o).xval()], function (i, o) {
												_print_opt.hidecss.push(o);
											});
										} else {
											_print_opt.hidecss.push(_hide_class[$(o).xval()]);
										}
									}
								});
								$dwp.app.aprv.doc._print(_print_opt, doc);
								_$dialog.close();
							}
						}, {
							"title": "취소",
							"css": "cancel",
							"click": function (_$dialog) {
								_$dialog.close();
							}
						}],
						content: { html: _html },
						initcallback: function ($dialog) {
							var _el = $dialog.element;
							//$("input[name='PrintOption']", _el).find("[value='AprComment']").prop("checked", true);
							$("input[name='PrintOption'][value='OutSide']", _el).off("change").bind("change", function () {
								if ($(this).is(":checked")) {
									$("input[name='PrintOption']", _el).prop("checked", true);
								} else {
									$("input[name='PrintOption']", _el).prop("checked", false);
								}
							})
						}
					});
				};

				_opt.attach.TotalFileMaxSize = maxattach;

				return _opt;
			},


			//보안의견 추가 - 2024.12.29 by dwlee
			_addSecComment: function ($doc) {
				var _opt = $doc.options;
				var _el = $doc.element;

				var _secYear = $("input[name=SecretYear]", _el).xval();
				var _secKey = $("input[name=SecretDocKey]", _el).xval();
				if (_secYear == "") {
					_secYear = $fn.getYear("cyear");
				}
				if (_secKey == "") {
					_secKey = _opt.key_unid;
				}
				var _secYear = $("input[name=SecretYear]", _el).xval();
				var _secKey = $("input[name=SecretDocKey]", _el).xval();

				//로딩시 이전 의견 가져오기 - 2024.12.29 by dwlee
				var _copt = {
					actiontype: "get_opinion",
					Arg1: _secKey,
					Arg2: $fn.getCurUser().pinfo.empno
				}

				function popdailog(_body) {
					var _btn = [];
					if (_body != "") {
						_btn.push(
							{
								title: $fn.getCodeMsg('aprv.btn.del'), // 삭제
								css: 'confirm',
								click: function (_$dialog) {
									//저장 가져오기 - 2024.12.29 by dwlee
									var _copt = {
										actiontype: "delete_opinion",
										Arg1: _secKey,
										Arg2: $fn.getCurUser().pinfo.empno,
									}
									var _curl = "/dwp/aprv/opinion/" + _secYear + ".nsf/cmdpost?createdocument";
									var _callbackfun = function (_data) {
										if (_data.actionResult == "success") {
											$fn.toast({ msg: $fn.getCodeMsg('aprv.msg.006') });
										} else {
											$fn.toast({ msg: $fn.getCodeMsg('aprv.msg.007') });
										}

										//보안의견 입력 결재로그 생성 - 2025.11.06 by dwlee
										_$$.aprv.com.ActionLog(_opt, "secopiniondelete");

										_$dialog.close();
									};
								}
							}
						);
					}

					_btn.push(
						{
							title: $fn.getCodeMsg('aprv.btn.b0001'), // 확인
							css: 'confirm',
							click: function (_$dialog) {
								//저장 가져오기 - 2024.12.29 by dwlee
								var _copt = {
									actiontype: "save_opinion",
									Arg1: _secKey,
									Arg2: $fn.getCurUser().pinfo.empno,
									Comment: $("[name=stmpComment]", _$dialog.element).val()
								}
								var _curl = "/dwp/aprv/opinion/" + _secYear + ".nsf/cmdpost?createdocument";
								var _callbackfun = function (_data) {
									if (_data.actionResult == "success") {
										$fn.toast({ msg: $fn.getCodeMsg('aprv.msg.006') });
									} else {
										$fn.toast({ msg: $fn.getCodeMsg('aprv.msg.007') });
									}

									//보안의견 입력 결재로그 생성 - 2025.11.06 by dwlee
									_$$.aprv.com.ActionLog(_opt, "secopinion");

									_$dialog.close();
								};
								$fn.cmdPost(_curl, _copt, _callbackfun, 'json');
							}
						}
					);

					_btn.push(
						{
							title: $fn.getCodeMsg('aprv.btn.b0002'), // 닫기
							css: 'cancel',
							click: function (_$dialog) {
								_$dialog.close();
							}
						}
					);
					var _url = "/dwp/aprv/opinion/" + _secYear + ".nsf/wFrmAprvSecretDialog?OpenForm&seckey=" + _secKey;
					var _Dailog = $fn.dialog(null, {
						modal: false,
						resizable: false,
						draggable: true,
						islangconvert: false,
						title: $fn.getCodeMsg('aprv.title.seccomment'),
						width: "620",
						height: "auto",
						docInstance: $doc,
						show: 'fade', //effect
						hide: 'fade', //effect
						buttons: _btn,
						content: {
							url: $fn.getProxyUrl(_url)
						},
						initcallback: function (_$dialog) {
							$("[name=stmpComment]", _$dialog.element).val(_body);
						}
					});
				}

				var _curl = "/dwp/aprv/opinion/" + _secYear + ".nsf/cmdpost?createdocument";
				var _callbackfun = function (_data) {
					var _body = "";
					if (_data.body != "") {
						//console.log(_data.body);
						_body = _data.body;
						_body = _body.replace(/¶/gi, "\n");
					}
					popdailog(_body);
				};
				$fn.cmdPost(_curl, _copt, _callbackfun, 'json');

			},

			//보안의견 조회 - 2024.12.30 by dwlee
			_showSecComment: function ($doc) {
				var _opt = $doc.options;
				var _el = $doc.element;

				if (_opt.cdb.indexOf("version") > 0) {
					//version관리 문서에서는 보안의견 조회 안함
					return false;
				}

				var _secYear = $("input[name=SecretYear]", _el).xval();
				var _secKey = $("input[name=SecretDocKey]", _el).xval();
				if (_secYear == "") {
					_secYear = $fn.getYear("cyear");
				}
				if (_secKey == "") {
					_secKey = _opt.key_unid;
				}
				//저장 가져오기 - 2024.12.29 by dwlee
				var _copt = {
					actiontype: "get_all_opinions",
					Arg1: _secKey,
				}
				var _curl = "/dwp/aprv/opinion/" + _secYear + ".nsf/cmdpost?createdocument";
				var _callbackfun = function (_data) {
					if (_data.actionResult == "success") {
						if (_data.result.length > 0) {
							var _html = "";
							_html += "<div class='dwp-table dwp-form-table line-type'><table class='clApprBodyTable' width='400px'>";

							//칼럼 넓이
							_html += "<col width='12%' />";
							_html += "<col width='10%' />";
							_html += "<col width='78%' />";

							//테이블헤드
							_html += "<tr>";
							_html += "<th class='dwp-title'>" + $fn.getCodeMsg('aprv.title.h040') + "</td>";
							_html += "<th class='dwp-title'>" + $fn.getCodeMsg('aprv.title.h109') + "</td>";
							_html += "<th class='dwp-title'>" + $fn.getCodeMsg('aprv.title.h020') + "</td>";
							_html += "</tr>";

							for (var i = 0; i < _data.result.length; i++) {
								jsonResult = _data.result[i];
								//못찾는 경우에는 널값이 넘어옴
								// 2012.07.20 - added by dwlee
								if (jsonResult.name == "") {
									_html = "";
									break;
								}
								//태그그리기
								_html += "<tr>";
								_html += "<td class='dwp-center'>" + $fn.getCurLangMsg(jsonResult.name) + "</td>";
								_html += "<td class='dwp-center'>" + $fn.getCurLangMsg(jsonResult.title) + "</td>";
								_html += "<td class='clContentTd'>" + jsonResult.msg.replace(/¶/gi, "<br>"); + "</td>";
								_html += "</tr>";
							}
							if (_html != "") {
								_html += "</table></div>";

								var noticeText = '<div style="text-align:left;margin-top:10px">';
								if (_opt.appCfg.PostItAuth == "0") {
									noticeText += '<img src="/icons/actn010.gif" style="margin: 0 0 -5 0">' + $fn.getCodeMsg('aprv.msg.075') + '</br>';	//이 내용은 대표자에게만 보입니다.
								} else {
									noticeText += '<img src="/icons/actn010.gif" style="margin: 0 0 -5 0">' + $fn.getCodeMsg('aprv.msg.076') + '</br>';	//이 내용은 결재자들에게만 보입니다.
								}

								noticeText += '</div>';

								_html += noticeText;

								//보안의견 조회 버튼 활성화
								$(".dwp-act_show_seccomment", _el).removeClass("dwp-none");

								$fn.dialog($doc.element, {
									modal: true,
									resizable: true,
									draggable: true,
									title: $fn.getCodeMsg("aprv.title.seccommentbody"),
									width: 600,
									height: "auto",
									show: 'fade', // effect
									hide: 'fade', // effect
									//autoOpen: false,		//.dialog("open")호출시만 열림
									buttons: [{
										"title": $fn.getCodeMsg("comm.btn.confirm"),		// 확인
										"css": "confirm",
										"click": function (_$dialog) {
											_$dialog.close();
										}
									}],
									content: { html: _html }
								});

							}
						}
					}
				};
				$fn.cmdPost(_curl, _copt, _callbackfun, 'json');
			},

			_print_back: function (opt, _doc) {
				var _opt = $.extend({}, opt);
				//var _$doc = $fn.getInstance("doc"),
				//	_el = _$doc.element;
				var _$doc = _doc || $fn.getInstance("doc");
				var _el = _$doc.element;
				var header =
					"<HTML>\n<HEAD>\n" +
					"<meta charset='utf-8'/>\n" +
					"<meta http-equiv='X-UA-Compatible' content='IE=edge'/>\n" +
					"<link rel='apple-touch-icon-precomposed' href='/tcclibs/images/favicon/16.ico' />\n" +
					"<link rel='shortcut icon' href='/tcclibs/images/favicon/16.ico' />\n" +
					"<link rel='icon' type='image/x-icon' href='/tcclibs/images/favicon/16.ico' />\n" +
					"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/components-style.css?_202008041' rel='stylesheet' />\n" +
					"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/pages.css' rel='stylesheet' />\n" +
					"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/common-print-style.css?_20171124' rel='stylesheet' />\n" +
					"<script type='text/javascript' src='" + $fn.getPath("weblib") + "/js/lib/jquery-2.2.4.js'></script>\n" +
					"<script type='text/javascript' src='" + $fn.getPath("weblib") + "/js/core/core.print.js'></script>\n";

				header += "<script type='text/javascript'>\n";

				header += "$(document).ready(function(){\n";
				if (_opt.hasOwnProperty("showcss") || _opt.hasOwnProperty("hidecss")) {
					if ($.isArray(_opt.showcss)) {
						for (var i = 0; i < _opt.showcss.length; i++) {
							header += _opt.showcss[i] + "{ display : block !important; }\n";
						}
					}
					if ($.isArray(_opt.hidecss)) {
						for (var i = 0; i < _opt.hidecss.length; i++) {
							header += "$(\"" + _opt.hidecss[i] + "\").remove();\n";
						}
					}
				}
				header += "});\n";
				header += "</script>\n";
				/*
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
				}*/
				header +=
					"<title>" + $fn.getCurLangMsg($dwp.core.portal.getHostCom().nm) + "</title>\n" +
					"<style>\n" +
					"span.attach_filename { font-family:'맑은 고딕'; font-size:12px; color:black; }\n" +
					"</style>\n" +
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
				//var _$dom = $(".dwp-page-body > .approval-detail", _el);
				var _$dom = $(".dwp-page-body", _el);
				_$dom.each(function (i, e) {
					html += "<div class='aligner print-btn' data-top='xs' style='padding-bottom:10px;border-bottom:1px solid #ddd'>";
					html += "<div class='right'>";
					html += "<div class='dwp-btn-group print-btn'>";
					html += "<div class='dwp-btn print-btn' onclick='window.print()'><span>" + $fn.getCodeMsg("comm.btn.print") + "</span></div>";
					html += "&nbsp;<div class='dwp-btn print-btn' onclick='window.close()'><span>" + $fn.getCodeMsg("comm.btn.close") + "</span></div>";
					html += "</div></div></div>";
					html += $(e).html();
				});

				var iBody = $("#iBody", _$dom);
				if (iBody.size() > 0) {
					var _body = iBody.get(0).contentWindow || (iBody.get(0).contentDocument.document || iBody.get(0).contentDocument);
					//console.log(_body.document.documentElement.innerHTML);
					var _spos = html.indexOf('<span id="bodyFld"');
					var _epos = html.indexOf("</span>", _spos) + 7;
					html = html.substring(0, _spos - 1) + '<span id="bodyFld" style="display:block;padding:4px;width:100%;">' +
						_body.document.documentElement.innerHTML + "</span>" + html.substring(_epos, html.length - 1);
				}
				html += "</BODY>\n</HTML>";

				html = html.replace(/<script[^>]*?>[\s\S]*?<\/script>/gi, "");
				html = html.replace(/<style\sname="dwp_css"/gi, '<ostyle name="dwp_css"');
				html = html.replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, "");
				html = html.replace(/<ostyle\sname="dwp_css"/gi, '<style name="dwp_css"');
				//외부공문의 경우 본문의 높이를 기본설정한다. 2023.04.07 by Choo
				if (_$doc.options.appCfg.FormAlias === "Form023") {
					// 본문의 bodyFld 영역의 기본높이를 650px로 설정함, 2023.04.07 by Choo
					html = html.replace(/(<span id="bodyFld"[^>]*style="[^"]*)width:\s*100%;([^"]*"[^>]*>)/g, '$1width: 100%; min-height: 650px;$2');
				}

				html = header + html;

				var state = "toolbar=0,location=0,status=0,menubar=1,scrollbars=1,resizable=1,width=840,height=680,top=100,left=100";
				var printWP = window.open(
					$fn.getPath("gwlib") + "/blank.htm",
					"printWebPart",
					state
				);
				printWP.document.open();
				printWP.document.write(html);
				printWP.document.close();

				// IFrame 방식인 경우 IFrame 페이지 설정 - 2020-08-04 By LHJ 
				/*               
				var iBody = $("#iBody", _$dom);
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

				return _$dom;
			},


			_print: function (opt, _doc) {																// _$$.aprv.doc
				var _opt = $.extend({}, opt);
				var _$doc = _doc || $fn.getInstance("doc");
				var _el = _$doc.element;
				var header =
					"<HTML>\n<HEAD>\n" +
					"<meta charset='utf-8'/>\n" +
					"<meta http-equiv='X-UA-Compatible' content='IE=edge'/>\n" +
					"<link rel='apple-touch-icon-precomposed' href='/tcclibs/images/favicon/16.ico' />\n" +
					"<link rel='shortcut icon' href='/tcclibs/images/favicon/16.ico' />\n" +
					"<link rel='icon' type='image/x-icon' href='/tcclibs/images/favicon/16.ico' />\n" +
					"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/components-style.css?_202008041' rel='stylesheet' />\n" +
					"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/pages.css' rel='stylesheet' />\n" +
					"<link type='text/css' href='" + $fn.getPath("weblib") + "/css/common-print-style.css?_20231207' rel='stylesheet' />\n" +
					"<script type='text/javascript' src='" + $fn.getPath("weblib") + "/js/lib/jquery-2.2.4.js'></script>\n" +
					"<script type='text/javascript' src='" + $fn.getPath("weblib") + "/js/core/core.print.js'></script>\n";

				header += "<script type='text/javascript'>\n";

				header += "$(document).ready(function(){\n";
				if (_opt.hasOwnProperty("showcss") || _opt.hasOwnProperty("hidecss")) {
					if ($.isArray(_opt.showcss)) {
						for (var i = 0; i < _opt.showcss.length; i++) {
							header += "$(\"" + _opt.showcss[i] + "\").removeClass(\"dwp-none\");\n";
						}
					}
					if ($.isArray(_opt.hidecss)) {
						for (var i = 0; i < _opt.hidecss.length; i++) {
							header += "$(\"" + _opt.hidecss[i] + "\").remove();\n";
						}
					}
				}
				//관련근거 스크롤바 제거 - 2023.01.05 by dwlee
				if ($.inArray("div[name=appbookmark]", _opt.hidecss == -1)) {
					header += "$(\".dwp-table-file .dwp-table-body\").css(\"height\",\"auto\").css(\"overflow\",\"hidden\");\n"; 	// 관련근거 스크롤바 제거
				}
				header += "});\n";
				header += "</script>\n";
				header +=
					"<title>" + $fn.getCurLangMsg($dwp.core.portal.getHostCom().nm) + "</title>\n" +
					"<style>\n" +
					"span.attach_filename { font-family:'맑은 고딕'; font-size:12px; color:black; }\n" +
					"</style>\n" +
					"</HEAD>\n<BODY>\n";
				var html = "";
				var _$dom = $(".dwp-page-body", _el);
				_$dom.each(function (i, e) {
					html += "<div class='aligner print-btn' data-top='xs' style='padding-bottom:10px;border-bottom:1px solid #ddd'>";
					html += "<div class='right'>";
					html += "<div class='dwp-btn-group print-btn'>";
					html += "<div class='dwp-btn print-btn' onclick='print_body()'><span>" + $fn.getCodeMsg("comm.btn.print") + "</span></div>";
					html += "&nbsp;<div class='dwp-btn print-btn' onclick='window.close()'><span>" + $fn.getCodeMsg("comm.btn.close") + "</span></div>";
					html += "</div></div></div>";

					html += "<div role='print_body' style='height:90%;overflow:auto;'>";
					html += "<div role='print_innner'>" + $(e).html() + "</div>";
					html += "</div>";
				});

				var iBody = $("#iBody", _$dom);
				if (iBody.size() > 0) {
					var _body = iBody.get(0).contentWindow || (iBody.get(0).contentDocument.document || iBody.get(0).contentDocument);
					var _spos = html.indexOf('<span id="bodyFld"');
					var _epos = html.indexOf("</span>", _spos) + 7;
					html = html.substring(0, _spos - 1) + '<span id="bodyFld" style="display:block;padding:4px;width:100%;">' +
						_body.document.documentElement.innerHTML + "</span>" + html.substring(_epos, html.length - 1);
				}
				html += "</BODY>\n</HTML>";

				html = html.replace(/<script[^>]*?>[\s\S]*?<\/script>/gi, "");
				html = html.replace(/<style\sname="dwp_css"/gi, '<ostyle name="dwp_css"');
				html = html.replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, "");
				html = html.replace(/<ostyle\sname="dwp_css"/gi, '<style name="dwp_css"');

				//외부공문의 경우 본문의 높이를 기본설정한다. 2023.04.07 by Choo
				if (_$doc.options.appCfg.FormAlias === "Form023") {
					// 본문의 bodyFld 영역의 기본높이를 650px로 설정함, 2023.04.07 by Choo
					html = html.replace(/(<span id="bodyFld"[^>]*style="[^"]*)width:\s*100%;([^"]*"[^>]*>)/g, '$1width: 100%; min-height: 650px;$2');
				}
				// 인쇄시 스크롤바를 숨기기 위한 인쇄
				var _printFunc = '';
				_printFunc += '<script>\n';
				_printFunc += 'function print_body() {\n';
				_printFunc += 'var $print = $("[role=print_innner]").clone().prependTo("body");\n';		// Clone 생성
				_printFunc += '$("[role=print_body]").hide();\n';											// 결재문서 숨김
				_printFunc += 'window.print();\n';														// 인쇄
				_printFunc += '$print.remove();\n';														// Clone 삭제
				_printFunc += '$("[role=print_body]").show();\n';											// 결재문서 표시
				_printFunc += '}\n'
				_printFunc += '</script>\n';

				html = header + _printFunc + html;

				var state = "toolbar=0,location=0,status=0,menubar=1,scrollbars=1,resizable=1,width=940,height=680,top=100,left=100";		/// width:840 을 변경
				var printWP = window.open(
					$fn.getPath("gwlib") + "/blank.htm",
					"printWebPart",
					state
				);

				printWP.document.open();
				printWP.document.write(html);
				printWP.document.close();

				return _$dom;
			}

		},
		viewfun: {
			getappdocCategory: function (_opt, key) {

				// 링그함에서 양식종류 가져오기
				var _me = this,
					_data = [],
					i = 0,
					_index = 0,
					_chkdata = [];

				$fn.xAjax({
					url: $fn.getProxyUrl(
						_opt.cdb +
						'/api/data/collections/name/' +
						_opt.viewalias +
						'?count=999&category=' +
						_opt.single +
						'^' +
						key
					),
					method: 'GET',
					dataType: 'json',
					async: false,
					cache: false
				}).done(function (data) {
					if (data !== null && data.length > 0) {
						if (data !== null && data.length > 0) {
							for (i = 0; i < data.length; i++) {
								if ($.inArray(data[i]._formcode, _chkdata) === -1) {
									_data[_index] = {};
									_data[_index].title = $fn.getCurLangMsg(
										data[i]._sformtitle
									);
									_data[_index].val = data[i]._formcode;
									_chkdata.push(data[_index]._formcode);
									_index += 1;
								}
							}
						}
					}
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				return _data;
			},
			getsubCategory: function (_opt, key) {
				// 결재환경설정에서  양식리스트 가져오기
				var _me = this,
					_data = [],
					i = 0,
					_index = 0;
				if (!_opt.iscategory) return _data;

				$fn.xAjax({
					url: $fn.getProxyUrl(
						_opt.appmndbapth +
						'/api/data/collections/name/wViwFormTree_Key?count=999&category=' +
						key +
						_opt.regioncode
					),
					method: 'GET',
					dataType: 'json',
					async: false,
					cache: false
				}).done(function (data) {
					var _cate,
						_catenm,
						_arrcate,
						_arrcatenm,
						i = 0;
					// console.log("subdata:", data);

					if (data !== null && data.length > 0) {
						for (i = 0; i < data.length; i++) {
							_data[_index] = {};

							if (data[i]._pid == 'AC003') {
								_data[_index].title = $fn
									.getCodeMsg('aprv.title.h096')
									.replace('{$1}', $fn.getCurLangMsg(data[i]._formtitle));
								_data[_index].val = data[i]._formalias + '_R';
								_index += 1;

								_data[_index] = {};
								_data[_index].title = $fn
									.getCodeMsg('aprv.title.h097')
									.replace('{$1}', $fn.getCurLangMsg(data[i]._formtitle));
								_data[_index].val = data[i]._formalias + '_Y';
								_index += 1;
							} else {
								_data[_index].title = data[i]._formtitle;
								_data[_index].val = data[i]._formalias;

								_index += 1;
							}
						}
					}
				}).fail(function (req, error) {
					console.log(req.responseText + '\n' + error);
				});
				//	console.log("return _subdata", _data);
				return _data;
			},
			getCategory: function (_opt) {
				var _me = this,
					_data = [],
					i = 0;

				if (!_opt.iscategory) return _data;

				//카테고리를 숨겨야 하는 케이스 추가 - 2022.12.12 by dwlee
				if (!_opt.iscategory && (_opt.hasOwnProperty("hidecategory") && !_opt.hidecategory)) return _data;

				if (_$$.aprv.hasOwnProperty('APRV_CATE') && $.isArray(_$$.aprv.APRV_CATE)) {
					return _$$.aprv.APRV_CATE;
				}

				$fn.xAjax({
					//작성시 표시하지 않는 양식도 포함 처리 - 2022.12.12 by dwlee
					url: $fn.getProxyUrl('/dwp/aprv/com/aprvmng.nsf/api/data/collections/name/wViwFormTreeJDAll?count=999'),
					method: 'GET',
					dataType: 'json',
					data: { category: $fn.getCurUser().pinfo.comcode },
					async: false,
					cache: false
				}).done(function (data) {
					$.each(data, function (i, o) {
						var _row = {};
						if (o.hasOwnProperty('@category')) {
							var _vlist = o._menucategory.split('{`');
							_row.key = _vlist[0];
							_row.pkey = '';
							_row.val = _vlist[0];
							_row.title = $fn.getCurLangMsg(_vlist[1]);
						} else {
							_row.key = o._formalias;
							_row.pkey = o._pid;
							_row.val = o._formalias;
							_row.title = $fn.getCurLangMsg(o._formtitle);
						}

						if (_row.pkey == '' || _data.length == 0) {
							_data.push(_row);
						} else {
							$dwp.ui.tree.addchild(_row.pkey, _data, _row);
						}
					});

					_$$.aprv.APRV_CATE = _data;
				});


				return _data;
			},
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
					(view = $fn.getInstance('view', $fn.getContent())), (_options = view.options);
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
					$fn.confirm({
						msg: $fn.getCodeMsg(msgcode)
					}).done(function () {
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
					_h += "<img src='" + $fn.getPath('weblib') + "/images/common/icon-doc.svg'>" + $fn.getCodeMsg('comm.title.js041');
					_h += '</div></div>';

					_$wrap.html(_h);
					return;
				}

				$fn.xAjax({
					url: $dwp.core.util.getProxyUrl(_opt.url),
					dataType: 'html',
					async: false,
					cache: false,
					data: { preview: '1' }
				}).done(function (html) {
					_$wrap.html(html);
				}).fail(function () { });
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
					_me.NewWindow("https://" + $fn.getSysinfo().hostname + _url, "AprWin", "884", "800", "no");
					/*
					$fn.xAjax({
						url: _opt.appmndbapth + '/wAgCmdGetProcess?openagent',
						dataType: 'json',
						async: false,
						cache: false,
						data: {
							actiontype: 'gethost',
							Unid: view._dockey,
							Arg1: view._indbpath
						}
					}).done(function (data) {
						if (data.result == '200') {
							_url = data.linkurl + _url;
						} else {
							$fn.alert({
								msg: $fn.getCodeMsg('comm.svrmsg.msg009')
							});
							return;
						}
					});
					*/
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

			//외부공문을 처리하는 로직 - 2023.05.16 by dwlee
			makesihangdoc: function (view, opt, row) {
				var _me = this;
				var _url = opt.cdb + "/wcmdpost_dist?createdocument";
				//url은 외부발송 대기함을 사용 - 
				$fn.xAjax({
					url: $fn.getProxyUrl(_url),
					method: 'POST',
					dataType: 'json',
					async: false,
					cache: false,
					data: {
						"actiontype": "act_readpubdoc",
						"unid": row._unid,
						"formcode": "outdraft"
					},
				}).done(function (data) {
					if (data.result == "200") {
						//_me.opendocument(row,view);

						var _moveurl = opt.cdb + '/vdockey/' + row._unid + '?editdocument';
						//_url = _opt.cdb + '/vdockey/' + row._unid + '?opendocument';
						$fn.loadPage({ link: _moveurl, linktype: 'PAGE' });

						return;
					} else {
						$fn.alert({ msg: data.errmsg });                                                   //본문검증 실패(실패사유 리턴)
					}
				}).fail(function (req, error) {
					//_errmsg = "pubdoc.xml validation 수행시 오류가 발생하였습니다.";
				});
			},

			opendocument_org20230516: function (row, view) {
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
					$fn.xAjax({
						url: _opt.appmndbapth + '/wAgCmdGetProcess?openagent',
						dataType: 'json',
						async: false,
						cache: false,
						data: {
							actiontype: 'gethost',
							Unid: row._dockey,
							Arg1: row._indbpath
						}
					}).done(function (data) {
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
			},

			//팝업창을 가운데 띄우는 함수 - 2024.11.29 by dwlee
			NewWindow: function (mypage, myname, w, h, scroll) {
				var winl = (screen.width - w) / 2;
				var wint = (screen.height - h) / 2;
				var settings = 'height=' + h + ',';
				settings += 'width=' + w + ',';
				settings += 'top=' + wint + ',';
				settings += 'left=' + winl + ',';
				settings += 'scrollbars=' + scroll + ',';
				settings += 'resizable=yes';

				var win = window.open(mypage, myname, settings);

				try {
					if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
				} catch (e) { console.log(e) };

			},

			opendocument: function (row, view) {
				var _me = this,
					_url = row._openurl,
					_opt = view.options;

				//HS 화성 - 마이그레이션 한 문서는 팝업 - 2024.11.29 by dwlee
				if (row.hasOwnProperty("_ismig") && row._ismig == "1") {

					//관리자 테스트용 - 2025.04.16 by dwlee
					if ($fn.getCurUser().pinfo.empno == "P00001") {
						var _furl = "https://gw.kbws.co.kr/dwp/com/portal/main.nsf/wfrmBridge?ReadForm&_=1&url=" + row._openurl + "&format=new";
						//_$$.aprv.portal.winopen(_furl, '', { width: 1200, height: 820 });

						_me.NewWindow("https://" + $fn.getSysinfo().hostname + row._openurl, "AprWin", "884", "800", "no");
					} else {
						_me.NewWindow("https://" + $fn.getSysinfo().hostname + row._openurl, "AprWin", "884", "800", "no");
					}
					return;
				}

				//HS 화성 - 마이그레이션 한 문서는 팝업 - 2024.11.29 by dwlee
				if (row.hasOwnProperty("isWecoy") && row.isWecoy == "1") {
					var _nsf_path = row["@href"].split(".nsf")[0] + ".nsf";
					_nsf_path = _nsf_path.substring(1, _nsf_path.length); //맨앞 '/' 날리기					
					_url = "/" + _nsf_path + "/0/" + row["@unid"] + "?Opendocument";

					//관리자 테스트용 - 2025.04.16 by dwlee
					if ($fn.getCurUser().pinfo.empno == "P00001") {
						var _furl = "https://gw.kbws.co.kr/dwp/com/portal/main.nsf/wfrmBridge?ReadForm&_=1&url=" + _url + "&format=new";
						//_$$.aprv.portal.winopen(_furl, '', { width: 1200, height: 820 });

						_me.NewWindow("https://" + $fn.getSysinfo().hostname + _url, "AprWin", "884", "800", "no");
					} else {
						_me.NewWindow("https://" + $fn.getSysinfo().hostname + _url, "AprWin", "884", "800", "no");
					}

					return;
				}

				//결재문서 만들기전인 경우에는 결재문서를 만들어주고... - 2023.05.16 by dwlee
				if (row.hasOwnProperty("_isaprdoc") && row._isaprdoc == "false") {
					//$fn.alert({msg : "외부에서 수신된 문서입니다."});
					_me.makesihangdoc(view, _opt, row);
					return;
				}

				//외부수신 문서는 ajax로 form 정보를 구성해준 후 문서를 Open한다. - 2023.05.16 by dwlee
				if (row.hasOwnProperty("_openmode") && row._openmode == "edit") {
					var _moveurl = _opt.cdb + '/vdockey/' + row._unid + '?editdocument';
					$fn.loadPage({ link: _moveurl, linktype: 'PAGE' });
					return;
				}

				if (typeof _url == 'undefined') {
					//_url = _opt.cdb + '/vdockey/' + row._unid + '?opendocument';

					//통합색인 사용시 조건 체크 - 2024.05.08 by dwlee
					if (row.hasOwnProperty("_unid")) {
						_url = _opt.cdb + '/vdockey/' + row._unid + '?opendocument';

						//통합색인 사용시 - 2024.05.08 by dwlee
					} else {
						var _nsf_path = row["@href"].split(".nsf")[0] + ".nsf";
						_nsf_path = _nsf_path.substring(1, _nsf_path.length); //맨앞 '/' 날리기					
						_url = "/" + _nsf_path + "/0/" + row["@unid"] + "?Opendocument";
					}
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


				//_me.NewWindow("https://" + $fn.getSysinfo().hostname + _url, "AprWin", "884", "800", "no");
				/*
				$fn.xAjax({
					url: _opt.appmndbapth + '/wAgCmdGetProcess?openagent',
					dataType: 'json',
					async: false,
					cache: false,
					data: {
						actiontype: 'gethost',
						Unid: row._dockey,
						Arg1: row._indbpath
					}
				}).done(function (data) {
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
				*/


				// console.log("02 _url",_url);
				// console.log("opt", _opt);

				if (_opt.ispreview && _opt.preview != 'all') {
					_me.previewLoadPage({ url: _url });
				} else if (_opt.ispopupdoc == '1') {
					$fn.winopen(_url, '', {});
				} else if (_url.indexOf('/gw/') >= 0) {
					_me.NewWindow("https://" + $fn.getSysinfo().hostname + _url, "AprWin", "884", "800", "no");
				} else if (_opt.ispopupdoc == '2') {
					$fn.layerOpenDocument({ content: { url: _url } });
				} else {
					$fn.loadPage({ link: _url, linktype: 'PAGE' });
				}
			},

			setHeaderSelectBox_org20230516: function (view) {		//근태신청서 완료함 > 상단에 년도별 콤보박스 추가 - 2022/11/24 (10000hyun)
				var _year = "", _nyear = "", selectbox = null, year_option = [];
				_nyear = parseInt($fn.getSysinfo().date.substr(0, 4), 10);
				_year = parseInt($fn.getMidStr(view.options.pathinfo, '/aprvclink_', '.nsf'), 10);
				for (var ii = (_nyear + 1); ii >= 2000; ii -= 1) {
					year_option.push("<option value=" + ii + (ii == _year ? " selected " : "") + ">" + ii + "</option>");
				}
				selectbox = $("<div class=\"dwp-selectbox\"><select name=\"selYear\">" + year_option.join("") + "</select></div>");
				selectbox.appendTo($("div[name=dwp-additional-area]", view.element));
				selectbox.off("change").on("change", function (e) {
					view.options.pathinfo = view.options.pathinfo.replace(/\/aprvclink_[0-9]{4}\.nsf\//g, "/aprvclink_" + $("option:selected", selectbox).xval() + ".nsf/");
					view.refresh()
				});
				//$("div.dwp-btn.dwp-hide-btn", view.element).click();	//상세검색 기본으로 접기
			},

			setHeaderSelectBox: function (view) {		//근태신청서 완료함 > 상단에 년도별 콤보박스 추가 - 2022/11/24 (10000hyun)
				var _year = "", _nyear = "", selectbox = null, year_option = [];
				_nyear = parseInt($fn.getSysinfo().date.substr(0, 4), 10);

				var _url = view.options.pathinfo;
				if (_url.indexOf("/aprvclink_") > 0) {
					_year = parseInt($fn.getMidStr(_url, '/aprvclink_', '.nsf'), 10);
					//ERP 연동결재함 - 2024.11.22
				} else if (_url.indexOf("/erplink_") > 0) {
					_year = parseInt($fn.getMidStr(_url, '/erplink_', '.nsf'), 10);
				} else {
					//완료함 링크 외 DB인 경우 - 2023.05.16 by dwlee
					_year = parseInt(_url.substring(_url.indexOf(".nsf") - 4, _url.indexOf(".nsf")), 10);
				}

				for (var ii = (_nyear + 1); ii >= 2023; ii -= 1) {
					year_option.push("<option value=" + ii + (ii == _year ? " selected " : "") + ">" + ii + "</option>");
				}
				selectbox = $("<div class=\"dwp-selectbox\"><select name=\"selYear\">" + year_option.join("") + "</select></div>");
				selectbox.appendTo($("div[name=dwp-additional-area]", view.element));
				selectbox.off("change").on("change", function (e) {
					if (_url.indexOf("/aprvclink_") > 0) {
						view.options.pathinfo = view.options.pathinfo.replace(/\/aprvclink_[0-9]{4}\.nsf\//g, "/aprvclink_" + $("option:selected", selectbox).xval() + ".nsf/");

						//ERP 연동결재함 - 2024.11.22
					} else if (_url.indexOf("/erplink_") > 0) {
						view.options.pathinfo = view.options.pathinfo.replace(/\/erplink_[0-9]{4}\.nsf\//g, "/erplink_" + $("option:selected", selectbox).xval() + ".nsf/");
						//완료함 링크 외 DB인 경우 - 2023.05.16 by dwlee	
					} else {
						var _chgyear = _year + ".nsf";
						view.options.pathinfo = _url.replace(_chgyear, $("option:selected", selectbox).xval() + ".nsf");
					}
					view.refresh()
				});
				//$("div.dwp-btn.dwp-hide-btn", view.element).click();	//상세검색 기본으로 접기
			}
		},
		view_sel: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},
			init: function (opt, el) {
				var _me = this,
					_view = null,
					_opt = _me._initOptions(opt);
				_view = $fn.view(_opt, el);

				//상세검색 - 2022.12.12 by dwlee
				_$$.aprv.view_search.detailsearch_bookmark(_view);
			},
			_initOptions: function (opt) {
				var _me = this,
					_opt = $.extend({}, opt);

				_opt.isbookmark = true;

				//관련근거 첨부인 경우에는 연도 선택 버튼 추가 - 2021.01.08
				/*
								if (_opt.viewalias == "wviwlist32" && $('#dwp-tabs-archive-content').html() != "") {
									_me._selectYear(_opt);
								}
				*/
				//관련근거 첨부인 경우에는 연도 선택 버튼 추가 - 2024.12.31 by dwlee
				//if ((_opt.viewalias == "wviwlist32" || _opt.viewalias == "wviwlist33") && $('#dwp-tabs-archive-content').html() != "") {
				//출장보고서 추가 - 2025.01.16 by dwlee
				if ((_opt.viewalias == "wviwlist32" || _opt.viewalias == "wviwlist33" || _opt.viewalias == "wviwlist34") && $('#dwp-tabs-archive-content').html() != "") {
					_me._selectYear(_opt);
				}


				_opt.button = _$$.aprv.view._buttonInfo(_opt);
				_opt.header = _$$.aprv.view._headerInfo(_opt);

				return _opt;
			},

			//2021.01.11 by dwlee
			_selectYear: function (opt) {
				var _cdb = opt.cdb;
				var _fullpath = opt.pathinfo;
				var _dbyear = _cdb.substring(_cdb.indexOf("_") + 1, _cdb.indexOf("_") + 5); 	//연도별 : ~/aprvclink_2021.nsf, 분기별 : ~/aprvclink_20211.nsf
				var _dbyearq = _cdb.substring(_cdb.indexOf("_") + 1, _cdb.indexOf(".nsf")); 	//연도+쿼터
				var _dbquater = _cdb.substring(_cdb.indexOf(".nsf") - 1, _cdb.indexOf(".nsf")); 	//쿼터

				var _$dlg = $("#" + opt.did);							//관련근거 첨부는 다이알로그 화면으로 팝업



				var _currentYear = parseInt($fn.getYear("cyear"), 10);		//현재연도
				var _curquater = parseInt($fn.getQuarter(), 10);			//현재쿼터
				var _$tab = $("#dwp-tabs-archive-content", _$dlg);

				var _$ycombo = $("<div><div class='selboxtitle'>" + $fn.getCodeMsg("aprv.title.h152") + "</div></div>"); //연도
				var _$ydiv = $("<div class='dwp-selectbox sm'></div>");
				var _$ycate = $("<select name='selyear'></select>");
				var _startYear = parseInt(opt.KLDBStartYear, 10); 				//완료함 시작연도

				//기본 년도
				for (var i = _currentYear; i >= _startYear; i--) {
					if (i == parseInt(_dbyear, 10)) {
						$('<option value="' + i + '" selected>' + i + '</option>').appendTo(_$ycate);
					} else {
						$('<option value="' + i + '">' + i + '</option>').appendTo(_$ycate);
					}
				}
				_$ycate.on("change", function () {
					var _$this = $(this);

					//분기로 분할한 경우
					if (opt.KLDBType == "1") {
						var regEx = new RegExp(_dbyearq, "gi");
						var _selQuater = $("select[name='selquater']", _$dlg.element).xval();
						//_fullpath = _fullpath.replace(_dbyear,_$this.xval()+_selQuater);
						_fullpath = _fullpath.replace(_dbyearq, _$this.xval() + _selQuater);

					} else {
						var regEx = new RegExp(_dbyear, "gi");
						//console.log("_dbyear : ", _dbyear);
						//console.log("this val : ", _$this.xval());

						_fullpath = _fullpath.replace(regEx, _$this.xval());
					}

					_$tab.html('');
					$fn.xAjax({
						type: "GET",
						url: $fn.getProxyUrl(_fullpath),
						success: function (data, textStatus, xhr) {
							_$tab.html(data);
						},
						error: function (xhr, status, e) {
						}
					});
				});

				if ($("select[name='selyear']", _$dlg.element).size() == 0) {
					_$ycate.appendTo(_$ydiv);
					_$ydiv.appendTo(_$ycombo);
					$("[name='dwp-cate-area']", _$dlg.element).html('');
					_$ycombo.appendTo($("[name='dwp-cate-area']", _$dlg.element));
				}

				//분기로 분할한 경우에는 분기 콤보 추가
				if (opt.KLDBType == "1") {
					var _$qcombo = $("<div><div class='selboxtitle'>" + $fn.getCodeMsg("aprv.title.h153") + "</div></div>"); //분기
					var _$qdiv = $("<div class='dwp-selectbox sm'></div>");
					var _$qcate = $("<select name='selquater'></select>");

					//분기
					for (var i = 1; i < 5; i++) {
						if (i == _dbquater) {
							$('<option value="' + i + '" selected>' + i + '</option>').appendTo(_$qcate);
						} else {
							$('<option value="' + i + '">' + i + '</option>').appendTo(_$qcate);
						}
					}
					_$qcate.on("change", function () {
						var _$this = $(this);
						var regEx = new RegExp(_dbyearq, "gi");
						//연도 + 분기
						_fullpath = _fullpath.replace(regEx, _$ycate.xval() + _$this.xval());
						_$tab.html('');
						$fn.xAjax({
							type: "GET",
							url: $fn.getProxyUrl(_fullpath),
							success: function (data, textStatus, xhr) {
								_$tab.html(data);
							},
							error: function (xhr, status, e) {
							}
						});
					});
					if ($("select[name='selquater']", _$dlg.element).size() == 0) {
						_$qcate.appendTo(_$qdiv);
						_$qdiv.appendTo(_$qcombo);
						_$qcombo.appendTo($("[name='dwp-cate-area']", _$dlg.element));
					}
				}
			}
		},

		view_search: {
			//완료함의 상세검색 - 2022.09.23 by dwlee
			detailsearch: function (view) {
				var _viewopt = view.options;
				var _el = view.element;

				_$$.aprv.viewfun.getCategory(_viewopt); //카테고리 목록 가져오기

				//자동완성 사용자 처리 - 샘플
				function selUser($this) {
					$fn.orgsel($this, { isedit: true, type: "single", treetype: "0", seltype: "2", isseltype: false, fld: "cAuthor", count: 1 });
				}

				//자동완성 사용자 처리 - 샘플
				function selTeam($this) {
					$fn.orgsel($this, { isedit: true, type: "single", treetype: "1", seltype: "1", isseltype: false, fld: "cTeam", count: 1 });
				}

				function changeCategory(itm) {
					var _$sel = $("select[name='cCategory']", $(itm));
					$fn.alert({ msg: _$sel.xval() });
				}

				var _detailopt = [];
				var _line = 1;
				//var _sFldArr = ["AuthorComCode","AuthorEmpNo","AuthorOrgCode"]; // 키값 대상 필드(회사코드, 사번, 부서코드)

				//연도
				//진행상태
				var ucode = [];
				ucode.push({ txt: "---전체---", val: "" });

				var _curInfo = $fn.getCurUser().pinfo;
				//Category 보기에서는 아래와 같이 dwp-none Class를 줘서 숨김 처리
				//숫자값등의 정확한 값을 비교시에는 equal 속성값 추가
				//Single 키값이 회사코드인 경우(보관함,완료함)

				//키필드 - 2022.12.15 by dwlee
				var _keyarr = _viewopt.searchkeyfld.split("^");
				if (_viewopt.hasOwnProperty("searchkeyfld") && _viewopt.searchkeyfld != "") {
					$.each(_keyarr, function (idx, fldname) {
						if (fldname == "comcode") {
							_detailopt.push({ line: _line, nm: "회사코드", fld: "cComCode", addclass: "dwp-none", equal: true, key: "AuthorComCode", baseval: _curInfo.comcode, type: "txt" });
						} else if (fldname == "deptcode") {
							_detailopt.push({ line: _line, nm: "부서코드", fld: "cOrgCode", addclass: "dwp-none", equal: true, key: _viewopt.searchkeyfld, baseval: _curInfo.orgcode, type: "txt" });
						} else if (fldname == "empno") {
							_detailopt.push({ line: _line, nm: "사번", fld: "cEmpNo", addclass: "dwp-none", equal: true, key: "AuthorEmpNo", baseval: _curInfo.empno, type: "txt" });
							/*
								by mjkim 20241120 결재할문서
							 */
						} else if (fldname == "curapprall") {
							_detailopt.push({ line: _line, nm: "현결재자", fld: "cCurApprAll", addclass: "dwp-none", key: "sCurAppIDList|sCurAgIDList|sReceiveID|sAuditIDs", baseval: _curInfo.empno, type: "txt" });
							/*
								by mjkim 20241120 결재진행문서
							 */
						} else if (fldname == "ingappr") {
							_detailopt.push({ line: _line, nm: "결재진행", fld: "cIngAppr", addclass: "dwp-none", key: "sPrevAppReaders1|sPrevAppReaders2|AccountReader", baseval: _curInfo.empno, type: "txt" });
							/*
								by mjkim 20241120 결재예정문서
							 */
						} else if (fldname == "afterappr") {
							_detailopt.push({ line: _line, nm: "결재예정", fld: "cAfterAppr", addclass: "dwp-none", key: "sIntendedReaders", baseval: _curInfo.empno, type: "txt" });
							/*
								by mjkim 20241120 결재예정문서
							 */
						} else if (fldname == "refer") {
							_detailopt.push({ line: _line, nm: "결재통보", fld: "cRefer", addclass: "dwp-none", key: "referuserlist", baseval: _curInfo.empno, type: "txt" });
							/*
								by mjkim 20241120 접수문서
							 */
						} else if (fldname == "curappr") {
							_detailopt.push({ line: _line, nm: "현결재자", fld: "cCurAppr", addclass: "dwp-none", key: "sCurAppIDList", baseval: _curInfo.empno, type: "txt" });
						} else {
							//추가적인 필드시 기입
						}
					});
				}

				//통합검색은  양식명을 입력하여 검색하도록 수정 - 2024.12.26 by dwlee
				if (_viewopt.viewalias == "wviwlist30_s") {
					_detailopt.push({ line: _line, nm: "양식명", fld: "AFPAprFormName", key: "AFPAprFormName|sDisFormAlias", type: "txt", entersearch: "Y" });
				} else {
					//근태관련 양식으로 인하여 수정 - 2022.11.24 by dwlee
					_detailopt.push({ line: _line, nm: "분류", fld: "cCategory", key: "sMenuCategory", subreset: "cFormName", widthcss: "md", type: "select", code: ucode, chgsearch: "Y" });
					_detailopt.push({ line: _line, nm: "양식명", fld: "cFormName", key: "FormCode", widthcss: "lg", type: "select", code: ucode, chgsearch: "Y" });
				}

				//완료함 - 문서번호
				//if (_viewopt.viewalias == "wviwlist30") {
				//통합검색 추가 - 2024.05.09 by dwlee
				if (_viewopt.viewalias == "wviwlist30" || _viewopt.viewalias == "wviwlist30_s") {
					//DocNumber 필드는 검색이 안되므로 DocNo 필드로 교체 - 2023.07.19 by dwlee
					_detailopt.push({ line: _line, nm: "문서번호", fld: "cNumber", key: "DocNo", type: "txt", entersearch: "Y" });
				}
				//tr 번호, 필드 Text , 필드명, 필드 넓이, 실제 검색시 매핑 필드명, 필드 타입, 표시 필드명(필드명이 코드인 경우 처리),표시필드 넓이, 이벤트 콜백 - 2022.04.26 by dwlee
				//d : display용 보조 입력필드

				//보관함 검색시 일자 제한 - 2022.11.29 by dwlee
				var _dbyear = "";
				//if (_viewopt.cdb.indexOf("aprvclink_") > 0) {
				if (_viewopt.cdb.indexOf("aprvclink_") > 0 && _viewopt.cdb.indexOf("archive") > 0) {
					_dbyear = _viewopt.cdb.substring(_viewopt.cdb.indexOf("aprvclink_") + 10, _viewopt.cdb.indexOf("aprvclink_") + 14);
				}

				_line += 1;
				//반려함, 진행함은 제외 
				//반려함
				//결재할 문서 상세검색떄문에 수정 - 2022.11.21
				if (_viewopt.viewalias != "wviwlist04") {
					if (_viewopt.viewalias == "wviwlist08") {

						//보관함 검색시 일자 제한 - 2022.11.29 by dwlee						
						_detailopt.push({ line: _line, nm: "기안일자", fld: "cFDate", flde: "cTDate", limitYear: _dbyear, minwidth: "286px", key: "sStartDate", type: "date" });

						//보관함 검색시 일자 제한 - 2022.11.29 by dwlee
						_detailopt.push({ line: _line, nm: "반려일자", fld: "cSDate", flde: "cEDate", limitYear: _dbyear, minwidth: "286px", key: "sCompleteDate", type: "date" });
						//결재보류함 추가 - 2022.12.09 by dwlee
					} else if (_viewopt.viewalias != "wviwlist15") {
						//결재할 문서, 접수대기,접수함,결재예정문서는  완료일자가 없음 - 2022.12.15 by dwlee
						/*
						by mjkim 20251111 보류추가
						*/
						if (_viewopt.viewalias.indexOf("wviwlist04") > -1 || _viewopt.viewalias == "wviwlist05" || _viewopt.viewalias == "wviwlist06" || _viewopt.viewalias == "wviwlist07" || _viewopt.viewalias == "wviwlist10" || _viewopt.viewalias == "wviwlist12") {
							_line = _line - 1;
							//보관함 검색시 일자 제한 - 2022.11.29 by dwlee						
							_detailopt.push({ line: _line, nm: "기안일자", fld: "cFDate", flde: "cTDate", limitYear: _dbyear, minwidth: "286px", key: "sStartDate", type: "date" });
						} else {
							//보관함 검색시 일자 제한 - 2022.11.29 by dwlee						
							_detailopt.push({ line: _line, nm: "기안일자", fld: "cFDate", flde: "cTDate", limitYear: _dbyear, minwidth: "286px", key: "sStartDate", type: "date" });

							//보관함 검색시 일자 제한 - 2022.11.29 by dwlee						
							_detailopt.push({ line: _line, nm: "완료일자", fld: "cSDate", flde: "cEDate", limitYear: _dbyear, minwidth: "286px", key: "sCompleteDate", type: "date" });
						}
					}
				}

				_line += 1;
				_detailopt.push({ line: _line, nm: "작성자", fld: "cAuthor", type: "txt", key: "AuthorName|sReqAuthorName", entersearch: "Y" });
				//tr 번호, 필드 Text , 필드명, 필드 넓이, 실제 검색시 매핑 필드명, 필드 타입, 표시 필드명(필드명이 코드인 경우 처리),표시필드 넓이, 이벤트 콜백 - 2022.04.26 by dwlee
				//_detailopt.push({ line: _line, nm: "작성팀", fld: "cTeam", fldtype: "", orgnm: "org2", key: "AuthorOrgName", type: "orgsel", fnc: selTeam });

				//괄호 검색때문에 바꿈 - 2022.11.21 by dwlee
				_detailopt.push({ line: _line, nm: "작성팀", fld: "cTeam", key: "AuthorOrgName", type: "txt", entersearch: "Y" });
				_detailopt.push({ line: _line, nm: "첨부파일", fld: "cAttach", key: "Multi_Attach_SortFiles", type: "txt", entersearch: "Y" });


				_line += 1;
				_detailopt.push({ line: _line, nm: "제목", fld: "cSubject", key: "Subject", type: "txt", entersearch: "Y" });
				_detailopt.push({ line: _line, nm: "검색어", fld: "cBody", key: "Body", type: "query", entersearch: "Y" });

				var _dsopt = {
					"linnum": _line, //라인수
					"dopt": _detailopt
				}

				view.detailsearchLayer(_dsopt);

				//해당 분류는 이곳에서 제어 - 2022.05.28
				var _$select = $("select[name='cCategory']", _el);
				$.each(_$$.aprv.APRV_CATE, function (i, o) {
					var _$opt = $("<option/>").appendTo(_$select).text(o.title).val(o.key);
					if (o.children) {
						_$opt.data("_CHILD", o.children);
					}
				});

				_$select.on("change", function () {
					var _$opt = $("option:selected", this);
					var _$sselect = $("select[name='cFormName']", _el);

					_$sselect.empty();
					$("<option/>").appendTo(_$sselect).text("---전체---").val("");

					if ($.hasData(_$opt[0])) {
						var _o = _$opt.data("_CHILD");
						$.each(_o, function (i, o) {
							var __$opt = $("<option/>").appendTo(_$sselect).text(o.title).val(o.val);
							if (o.children) {
								__$opt.data("_CHILD", o.children);
							}
						});
					}
				});

				//=========================================================================================
				//			detail search 이외에 동작하는 필드들은 다시 한번 재정리를 해줘야 함
				//						 - 2022.11.08 by dwlee
				//=========================================================================================				
				var _addField = ["cCategory", "cFormName"];
				var _svdqry = $dwp.core.util.getLocalStorage("dwp.detailsearch");
				var _svdjson = {};
				if (_svdqry != null && _svdqry != "") {
					_svdqry = "{" + _svdqry + "}";
					_svdqry = _svdqry.replace(/'/gi, '"');
					_svdjson = JSON.parse(_svdqry);
					var _svdval = "";
					$.each(_addField, function (idx, fld) {
						_svdval = eval("_svdjson." + fld);
						$("[name='" + fld + "']", _el).xval(_svdval);
						if (fld == "cCategory") {
							var _$select = $("select[name='cCategory']", _el);
							var _$opt = $("option:selected", _$select);
							var _$sselect = $("select[name='cFormName']", _el);
							_$sselect.empty();
							$("<option/>").appendTo(_$sselect).text("---전체---").val("");
							if ($.hasData(_$opt[0])) {
								var _o = _$opt.data("_CHILD");
								$.each(_o, function (i, o) {
									var __$opt = $("<option/>").appendTo(_$sselect).text(o.title).val(o.val);
									if (o.children) {
										__$opt.data("_CHILD", o.children);
									}
								});
							}
						}
					});
				}
				//=========================================================================================					
			},

			// 대장 상세검색 - 2022.06.20 by dwlee
			detailsearch_formcode: function (view) {
				var _viewopt = view.options;
				var _el = view.element;

				//자동완성 사용자 처리 - 샘플
				function selUser($this) {
					$fn.orgsel($this, { isedit: true, type: "single", treetype: "0", seltype: "2", isseltype: false, fld: "cAuthor", count: 1 });
				}

				//자동완성 사용자 처리 - 샘플
				function selTeam($this) {
					$fn.orgsel($this, { isedit: true, type: "single", treetype: "1", seltype: "1", isseltype: false, fld: "cTeam", count: 1 });

					//양식코드 필드는 ReadOnly 처리 - 2022.06.20 by dwlee
					var _$formcode = $("input[name=cFormName]", $(".dwp-detail-body", _el));
					_$formcode.xval(_viewopt.single);
				}

				var _detailopt = [];
				var _line = 1;

				var ucode = [];
				ucode.push({ txt: "---전체---", val: "" });
				_line += 1;

				//회사코드 구분없이 조회 - 2022.11.20 by dwlee
				_detailopt.push({ line: _line, nm: "회사코드", fld: "cComCode", addclass: "dwp-none", equal: true, key: "AuthorComCode", baseval: _curInfo.comcode, type: "txt" });

				//키값이 회사코드^사번인 경우(나의 완료함)
				if (_viewopt.single.indexOf("^") > 0) {
					_detailopt.push({ line: _line, nm: "사번", fld: "cEmpNo", addclass: "dwp-none", equal: true, key: "AuthorEmpNo", baseval: _curInfo.empno, type: "txt" });
				}

				//tr 번호, 필드 Text , 필드명, 필드 넓이, 실제 검색시 매핑 필드명, 필드 타입, 표시 필드명(필드명이 코드인 경우 처리),표시필드 넓이, 이벤트 콜백 - 2022.04.26 by dwlee
				//분류보기인 경우 아래와 같이 addclass 를 dwp-none 으로 주고 분류값을 해당 필드에 넣어주면 됨 - 2022.06.21
				_detailopt.push({ line: _line, nm: "양식명", fld: "cFormName", addclass: "dwp-none", key: "FormCode", baseval: _viewopt.single, type: "txt" });

				//보관함 검색시 일자 제한 - 2022.11.29 by dwlee
				var _dbyear = "";
				if (_viewopt.cdb.indexOf("aprvclink_") > 0 && _viewopt.cdb.indexOf("archive") > 0) {
					_dbyear = _viewopt.cdb.substring(_viewopt.cdb.indexOf("aprvclink_") + 10, _viewopt.cdb.indexOf("aprvclink_") + 14);
				}

				//기간검색 넓이 Fix - 2022.12.05 by dwlee				
				_detailopt.push({ line: _line, nm: "완료일자", fld: "cSDate", flde: "cEDate", limitYear: _dbyear, minwidth: "286px", key: "sCompleteDate", type: "date" });

				_line += 1;
				//작성자는 선택이 아닌 입력형식으로 변경 - 2022.06.14 by dwlee
				//				_detailopt.push({line : _line, nm : "작성자", fld : "cAuthor", fldtype : "", orgnm : "org1", key : "AuthorName", type : "orgsel", fnc : selUser});  
				_detailopt.push({ line: _line, nm: "작성자", fld: "cAuthor", key: "AuthorName|sReqAuthorName", type: "txt", entersearch: "Y" });
				_detailopt.push({ line: _line, nm: "작성팀", fld: "cTeam", key: "AuthorOrgName", type: "txt", entersearch: "Y" });
				_detailopt.push({ line: _line, nm: "제목", fld: "cSubject", key: "Subject", type: "txt", entersearch: "Y" });
				//				_line += 1;					
				_detailopt.push({ line: _line, nm: "검색어", fld: "cBody", key: "Body", type: "query", entersearch: "Y" });

				var _dsopt = {
					"linnum": _line,                   //라인수
					"dopt": _detailopt
				}
				view.detailsearchLayer(_dsopt);

			},

			//거래품의서 거래처코드 누락 상세검색 - 2022.12.07 by dwlee
			detailsearch_form: function (view) {
				var _viewopt = view.options;
				var _el = view.element;

				var _detailopt = [];
				var _line = 1;

				//보관함 검색시 일자 제한 - 2022.11.29 by dwlee
				var _dbyear = "";
				if (_viewopt.cdb.indexOf("aprvclink_") > 0 && _viewopt.cdb.indexOf("archive") > 0) {
					_dbyear = _viewopt.cdb.substring(_viewopt.cdb.indexOf("aprvclink_") + 10, _viewopt.cdb.indexOf("aprvclink_") + 14);
				}

				//회사코드 구분없이 조회 - 2022.11.20 by dwlee
				_detailopt.push({ line: _line, nm: "회사코드", fld: "cComCode", addclass: "dwp-none", equal: true, key: "AuthorComCode", baseval: _curInfo.comcode, type: "txt" });

				//키값이 회사코드^사번인 경우(나의 완료함)
				if (_viewopt.single.indexOf("^") > 0) {
					_detailopt.push({ line: _line, nm: "사번", fld: "cEmpNo", addclass: "dwp-none", equal: true, key: "AuthorEmpNo", baseval: _curInfo.empno, type: "txt" });
				}

				//기간검색 넓이 Fix - 2022.12.05 by dwlee				
				_detailopt.push({ line: _line, nm: "완료일자", fld: "cSDate", flde: "cEDate", limitYear: _dbyear, minwidth: "286px", key: "sCompleteDate", type: "date" });

				_detailopt.push({ line: _line, nm: "제목", fld: "cSubject", key: "Subject", type: "txt", entersearch: "Y" });

				_line += 1;
				//작성자는 선택이 아닌 입력형식으로 변경 - 2022.06.14 by dwlee
				//				_detailopt.push({line : _line, nm : "작성자", fld : "cAuthor", fldtype : "", orgnm : "org1", key : "AuthorName", type : "orgsel", fnc : selUser});  
				_detailopt.push({ line: _line, nm: "작성자", fld: "cAuthor", key: "AuthorName|sReqAuthorName", type: "txt", entersearch: "Y" });
				_detailopt.push({ line: _line, nm: "작성팀", fld: "cTeam", key: "AuthorOrgName", type: "txt", entersearch: "Y" });

				//				_line += 1;					
				_detailopt.push({ line: _line, nm: "검색어", fld: "cBody", key: "Body", type: "query", entersearch: "Y" });

				var _dsopt = {
					"linnum": _line,                   //라인수
					"dopt": _detailopt
				}
				view.detailsearchLayer(_dsopt);
			},

			//상세검색 - 2022.06.02
			detailsearch_bookmark: function (view) {
				var _viewopt = view.options;
				var _el = view.element;

				//console.log("view view : ", _viewopt);


				_$$.aprv.viewfun.getCategory(_viewopt);

				//자동완성 사용자 처리 - 샘플
				function selUser($this) {
					$fn.orgsel($this, { isedit: true, type: "single", treetype: "0", seltype: "2", isseltype: false, fld: "cAuthor", count: 1 });
				}

				//자동완성 사용자 처리 - 샘플
				function selTeam($this) {
					$fn.orgsel($this, { isedit: true, type: "single", treetype: "1", seltype: "1", isseltype: false, fld: "cTeam", count: 1 });
				}

				function changeCategory(itm) {
					var _$sel = $("select[name='cCategory']", $(itm));
					$fn.alert({ msg: _$sel.xval() });

				}

				var _detailopt = [];
				var _line = 1;

				var ucode = [];
				ucode.push({ txt: "---전체---", val: "" });
				_line += 1;

				//전표인 경우에는...
				//
				//tr 번호, 필드 Text , 필드명, 필드 넓이, 실제 검색시 매핑 필드명, 필드 타입, 표시 필드명(필드명이 코드인 경우 처리),표시필드 넓이, 이벤트 콜백 - 2022.04.26 by dwlee
				//d : display용 보조 입력필드

				//회사코드 구분없이 조회 - 2022.11.20 by dwlee
				_detailopt.push({ line: _line, nm: "회사코드", fld: "cComCode", addclass: "dwp-none", equal: true, key: "AuthorComCode", baseval: _curInfo.comcode, type: "txt" });

				//키값이 회사코드^사번인 경우(나의 완료함)
				if (_viewopt.single.indexOf("^") > 0) {
					_detailopt.push({ line: _line, nm: "사번", fld: "cEmpNo", addclass: "dwp-none", equal: true, key: "AuthorEmpNo", baseval: _curInfo.empno, type: "txt" });
				}

				_detailopt.push({ line: _line, nm: "분류", fld: "cCategory", key: "sMenuCategory", subreset: "cFormName", widthcss: "md", type: "select", code: ucode, chgsearch: "Y" });
				_detailopt.push({ line: _line, nm: "양식명", fld: "cFormName", key: "FormCode", type: "select", code: ucode, chgsearch: "Y" });

				//				_detailopt.push({line : _line, nm : "완료일자", fld : "cSDate", flde : "cEDate",key : "sCompleteDate", type : "date"});  
				_line += 1;
				_detailopt.push({ line: _line, nm: "작성자", fld: "cAuthor", type: "txt", key: "AuthorName|sReqAuthorName", entersearch: "Y" });
				//				_detailopt.push({line : _line, nm : "작성팀", fld : "cTeam", fldtype : "", orgnm : "org2", key : "AuthorOrgName", type : "orgsel", fnc : selTeam});        						
				_detailopt.push({ line: _line, nm: "제목", fld: "cSubject", key: "Subject", type: "txt", entersearch: "Y" });
				//				_line += 1;					
				_detailopt.push({ line: _line, nm: "검색어", fld: "cBody", key: "Body", type: "query", entersearch: "Y" });

				var _dsopt = {
					"linnum": _line,                   //라인수
					"dopt": _detailopt
				}

				view.detailsearchLayer(_dsopt);

				//해당 분류는 이곳에서 제어 - 2022.05.28
				var _$select = $("select[name='cCategory']", _el);
				$.each(_$$.aprv.APRV_CATE, function (i, o) {
					var _$opt = $("<option/>").appendTo(_$select).text(o.title).val(o.key);
					if (o.children) {
						_$opt.data("_CHILD", o.children);
					}
				});

				_$select.on("change", function () {
					var _$opt = $("option:selected", this);
					var _$sselect = $("select[name='cFormName']", _el);

					_$sselect.empty();
					$("<option/>").appendTo(_$sselect).text("---전체---").val("");

					if ($.hasData(_$opt[0])) {
						var _o = _$opt.data("_CHILD");
						$.each(_o, function (i, o) {
							var __$opt = $("<option/>").appendTo(_$sselect).text(o.title).val(o.val);
							if (o.children) {
								__$opt.data("_CHILD", o.children);
							}
						});
					}
				});

				//=========================================================================================
				//			detail search 이외에 동작하는 필드들은 다시 한번 재정리를 해줘야 함
				//						 - 2022.11.08 by dwlee
				//=========================================================================================				
				var _addField = ["cCategory", "cFormName"];
				var _svdqry = $dwp.core.util.getLocalStorage("dwp.detailsearch");
				var _svdjson = {};
				if (_svdqry != null && _svdqry != "") {
					_svdqry = "{" + _svdqry + "}";
					_svdqry = _svdqry.replace(/'/gi, '"');
					_svdjson = JSON.parse(_svdqry);
					var _svdval = "";
					$.each(_addField, function (idx, fld) {
						_svdval = eval("_svdjson." + fld);
						$("[name='" + fld + "']", _el).xval(_svdval);
						if (fld == "cCategory") {
							var _$select = $("select[name='cCategory']", _el);
							var _$opt = $("option:selected", _$select);
							var _$sselect = $("select[name='cFormName']", _el);
							_$sselect.empty();
							$("<option/>").appendTo(_$sselect).text("---전체---").val("");
							if ($.hasData(_$opt[0])) {
								var _o = _$opt.data("_CHILD");
								$.each(_o, function (i, o) {
									var __$opt = $("<option/>").appendTo(_$sselect).text(o.title).val(o.val);
									if (o.children) {
										__$opt.data("_CHILD", o.children);
									}
								});
							}
						}
					});
				}
				//=========================================================================================						
			},
		},

		view: {
			getOptions: function (opt) {
				var _me = this;
				return $.extend({}, _me._initOptions(opt));
			},
			init: function (opt, el) {
				var _me = this,
					_view = null,
					_opt = _me._initOptions(opt);

				//통합검색인 경우 - 2024.05.09 by dwlee
				if (_opt.viewalias == "wviwlist30_s") {
					var _sqry = [];
					_sqry.push({
						"match_phrase": {
							"AuthorComCode": '\"' + $fn.getCurUser().pinfo.comcode + '\"'
						}
					});
					_sqry.push({
						"match_phrase": {
							"sStatus": "\"complete\""
						}
					});
					_opt.singleqry = _sqry;
				}

				_view = $fn.view(_opt, el);

				//상세검색 : 완료함,참조함,보관함,진행함,반려함,접수대기,접수,예정함 등등....  - 2022.12.15 by dwlee
				if (_opt.hasOwnProperty("isdetailsearch") == true) {
					if (_opt.isdetailsearch == true) {
						_$$.aprv.view_search.detailsearch(_view);
					} else {
						$(".dwp-detail-body", el).addClass("dwp-none");
						_$$.aprv.view_search.detailsearch(_view);
					}
				} else {
					$(".dwp-detail-body", el).addClass("dwp-none");
				}

				if (_opt.viewalias == "wviwlistwork30") {		//근태신청서 완료함 > 상단에 년도별 콤보박스 추가 - 2022/11/24 (10000hyun)
					_$$.aprv.viewfun.setHeaderSelectBox(_view);
				}

				//대외발신 완료홤, 대외수신 완료함은 상단에 연도별 콤보박스 추가 - 2023.05.16 by dwlee
				if (_opt.viewalias == "wviwlist137" || _opt.viewalias == "wviwlist138") {
					_$$.aprv.viewfun.setHeaderSelectBox(_view);
				}


				//ERP 연동함은 상단에 연도별 콤보박스 추가 - 2024.11.22 by dwlee
				if (_opt.viewalias == "wviwlisterp" | _opt.viewalias == "wviwlistgw") {
					_$$.aprv.viewfun.setHeaderSelectBox(_view);
				}

				//완료문서만 상세검색 펼침  - 2024.12.27 by dwlee
				if (_opt.viewalias == "wviwlist30" || _opt.viewalias == "wviwlist30_s") {
					$(".dwp-ssearch", el).addClass("dwp-none");
					$(".dwp-hsearch", el).removeClass("dwp-none");

					$(".dwp-detail-body", el).removeClass("dwp-none");
				} else {
					$(".dwp-ssearch", el).removeClass("dwp-none");
					$(".dwp-hsearch", el).addClass("dwp-none");

					$(".dwp-detail-body", el).addClass("dwp-none");
				}


				//보관함 연도 선택시 보기 자동 이동 - 2022.06.14 by dwlee
				//var _url = "/dwp/aprv/hq/archive/link/aprvclink_2022.nsf/wFrmViewL?ReadForm&view=wViwListSend&restricttocategory=All";
				/*
				var _url = _opt.pathinfo;
				var _url1 = _url.substring(0, _url.indexOf("aprvclink_") + 10);
				var _url2 = _url.substring(_url.indexOf(".nsf"), _url.length);

				var _$lnb = $(".dwp-lnb");
				$("select", $("#W3121", _$lnb)).off("change").on("change", function () {
					var _moveurl = _url1 + $(this).xval() + _url2;
					$fn.loadPage({ link: $fn.getProxyUrl(_moveurl), linktype: "PAGE" });
				});
				*/
				//보관함 연도 선택시 보기 자동 이동 - 2024.02.01 수정
				//보관함 lnb변경시 수정 ( W3121, W3122 )
				var _$lnb = $(".dwp-lnb");
				$("select", $("#W3121", _$lnb)).off("change").on("change", function () {
					var link = $('#W3122 a', _$lnb);
					link.click();
				});
				/*
								20241119 IT업무 년도 변경시  업무의뢰서 Reload*/


				$("select", $("#W3899", _$lnb)).off("change").on("change", function () {
					var link = $('#W3881 a', _$lnb);
					link.click();
				});

			},

			_initOptions: function (opt, view) {
				var _me = this,
					_opt = $.extend({}, opt);

				_opt.button = _me._buttonInfo(_opt);
				_opt.header = _me._headerInfo(_opt);

				// 결재할문서,미결함,예정함,공유함
				//var _cntvw = "wviwlist04,wviwlist07,wviwlist10,wviwlist09";
				//if (_cntvw.indexOf(_opt.viewalias) > -1) {

				_opt.loadComplete = function () {
					var _view = $fn.getInstance("view");
					_me._updatebookmarklist(event, _view);				// 즐겨찾기 설정 - 2024.03.06 by jwlee

					$fn.lnbCountRefresh();

					if (!(_opt.viewalias === 'wviwlist80' || _opt.viewalias === 'wviwlist11')) {
						//분류 콤보 앞에 명칭 부여. 언어는 나중에 ㅡㅡ by noh
						_target = $fn.getTarget();
						// $("[name='dwp-cate-area']>div", _target).css("float", "left");
						if ($("[name='dwp-cate-area'] .selboxtitle", _target).length == 0) {
							$("[name='dwp-cate-area'] .dwp-selectbox", _target).each(function (i) {
								if (i == 0) $("<div class='selboxtitle'>" + $fn.getCodeMsg("aprv_mng.title.h035") + "</div>").insertBefore($(this));
								if (i == 1) $("<div class='selboxtitle'>" + $fn.getCodeMsg("aprv_mng.title.h036") + "</div>").insertBefore($(this));
							})
						}
					}
				};

				//}

				return _opt;
			},
			_buttonInfo: function (_opt) {
				var _aprdockeylist = ""; //선택한 결의서 UNID 리스트
				var _me = this,
					_btnList = {
						//전자결재 즐겨찾기  추가 - 2024.03.12 by dwlee
						starflag: {
							title: $fn.getCodeMsg('aprv.btn.start'),						// 중요표시
							click: function (view) {
								var _star = [];
								var _key = [];

								var _dbs = []; //통합검색 색인을 사용하는 경우 - 2024.05.09 by dwlee

								var _dbpath = view.options.cdb.replace("/dwp", "dwp");
								var _$listbody = $("div.dwp-table-inner", view.element);
								$("div.dwp-table-row input[name='chk']:checked", _$listbody).each(function () {
									var _row = $(this).parents("div.dwp-table-row");
									var _data = $(_row).data($dwp.core.view._ROW_DATA);
									var _icon = $(".bookmark-cell", _row).find(".mark");
									var _dockey = $(_icon).attr("data-doc-key");

									_star.push(_icon);
									_key.push(_data["@unid"] + "^" + _dockey);

									var _docdbpath = _data["@href"].split(".nsf")[0] + ".nsf";
									_docdbpath = _docdbpath.substring(1, _docdbpath.length); //맨앞 '/' 날리기
									_dbs.push(_docdbpath);
								});
								if ($(_star).size() == 0) {
									$fn.alert({ msg: $fn.getCodeMsg("aprv.msg.066") });
									return false;
								}

								//통합검색 보기시 - 2024.05.09 by dwlee
								if (_opt.viewtype == "slist") {
									_key = _dbs.join(";");
								}

								_$$.aprv.com.setBookmark(_key, "viewadd", _dbpath, function (_ret) {
									$.each(_star, function () {
										$(this).addClass("active");
									});
									$("input[name='chk']", _$listbody).prop("checked", false);
								});
							},
							icon: $fn.getPath('weblib') + '/images/common/icon-mark.svg'
						},
						//2022.05.28 by dwlee
						ssearch: {
							title: $fn.getCodeMsg("comm.btn.searchexpand"),
							click: function (view) {
								var _el = view.element;
								$(".dwp-hide-btn", _el).removeClass("dwp-none");
								$(".dwp-show-btn", _el).addClass("dwp-none");
								$(".dwp-detail-body", _el).removeClass("dwp-none");
							},
							css: "dwp-show-btn dwp-orange dwp-none"
						},
						//2022.05.28 by dwlee
						hsearch: {
							title: $fn.getCodeMsg("comm.btn.searchcollapse"),
							click: function (view) {

								var _el = view.element;
								$(".dwp-hide-btn", _el).addClass("dwp-none");
								$(".dwp-show-btn", _el).removeClass("dwp-none");
								$(".dwp-detail-body", _el).addClass("dwp-none");
							},
							css: "dwp-hide-btn"
						},

						//엑셀 다운로드 - 2022.10.12 by dwlee
						exceldown: {
							title: $fn.getCodeMsg('comm.btn.exceldown'),
							click: function (view) {
								var _el = view.element;
								var _opt = {
									title: "aprdone_" + view.options.viewalias,
									filenm: "aprdone_" + Date.now() + ".xlsx",
									checked: view.getChecked(),
									viewInstance: view,
									excelkeyword: "결재완료함"
								}
								//view.exceldownload_view(_opt);
								_me.exceldownload_view(_opt);
							}
						},

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
								view.deleteDocument({ softdel: false });
							},
							icon: $fn.getPath('weblib') +
								'/images/common/icon-permanent-remove.svg'
						},
						restore: {
							title: $fn.getCodeMsg('comm.btn.restoredoc'), // 복원
							click: function (view) {
								view.restoreDocument({ docstatus: 'reg' });
							},
							icon: $fn.getPath('weblib') + '/images/common/icon-retrun.svg'
						},

						/* 새로운 결재 즐겨찾기 반영으로 변경 - 2024.03.12 by dwlee
						starflag: {
							title: $fn.getCodeMsg('aprv.btn.start'), // 중요표시
							click: function (view) {
								//_me.star_flag(view);
								_$$.aprv.viewfun.ViewPostAction(view, 'act_star');
							},
							icon: $fn.getPath('weblib') + '/images/common/icon-mark.svg'
						},
						*/

						//연속결재 - 2020.10.05 by dwlee
						conaprv: {
							title: $fn.getCodeMsg('aprv.btn.conaprv'), // 연속결재
							//title: "연속결재", // 연속결재
							click: function (view) {

								var _opt = view.options;
								var _lsname = "dwp-apr-unids";

								// LocalStorage 값 초기화....
								localStorage.removeItem(_lsname);

								var _rows = view.getChecked();
								if (_rows.length == 0) {
									$dwp.ui.alert({
										msg: $fn.getCodeMsg('aprv.msg.050')
									});
									return;
								}
								var _unidarr = $.map(_rows, function (v) {
									return v['@unid'];
								})
								//		        var _unid = _unidarr[0];
								//		        _unidarr.shift(); //첫번째 배열 삭제

								function findNextDoc(uidarr) {
									if (uidarr.length < 0) {
										view.refresh();
										return;
									}

									var _linkunid = uidarr[0];
									uidarr.shift(); //첫번째 배열 삭제

									// LocalStorage 에 UNID 값을 저장
									$fn.setLocalStorage(_lsname, uidarr.join(";"));

									$fn.xAjax({
										url: $fn.getProxyUrl(_opt.cdb + "/wAgCmdGetProcess?openagent"),
										dataType: "json",
										async: false,
										cache: false,
										data: { actiontype: "getdockey", Unid: _linkunid }
									}).done(function (data) {
										if (data.result == "200" && data.dockey != "") {
											var _url = "/" + data.dbpath + "/vdockey/" + data.dockey + "?OpenDocument&iscontinue=1&startapr=y";
											$fn.loadPage({ link: $fn.getProxyUrl(_url), linktype: "PAGE" });
										} else {
											findNextDoc(uidarr);
										}
									});
								}

								$fn.confirm({
									msg: $fn.getCodeMsg('aprv.msg.056')
								}).done(function () {
									findNextDoc(_unidarr);
								});
							}
						},

						allaprv: {
							title: $fn.getCodeMsg('aprv.btn.allaprv'), // 일괄결제
							click: function (view) {
								var _rows = view.getChecked();
								if (_rows.length == 0) {
									$dwp.ui.alert({ msg: $fn.getCodeMsg('aprv.msg.050') });
									return;
								}
								var _unids = $.map(_rows, function (v) { return v['@unid']; }).join(';');

								$fn.confirm({ msg: $fn.getCodeMsg('aprv.msg.051') }).done(
									function () {

										//일괄결재인 경우에도 비번을 한번은 확인하도록 수정 - 2020.10.15 by dwlee
										_$$.aprv.com.AprvPwVerify({
											callback: function () {
												$fn.block(undefined, { notusemsg: false });
												$fn.cmdPost(
													$fn.getProxyUrl(_opt.cdb + '/cmdpost?createdocument'), {
													actiontype: 'allaprv',
													Unid: _unids,
													type: 'view'
												},
													function (txt) {
														if (txt.indexOf('ActEvaluation') > -1) {
															$fn.alert({
																msg: $fn.getCodeMsg('aprv.title.h131')
															});
														}
														view.refresh();
														// 2022-05-27 Layout 변경
														// $fn.xTrigger($('div.dwp-icon-menu'), 'GnbCountRefresh', { type: 'aprv' });
														$fn.xTrigger($("div.xware-header-icon"), "GnbCountRefresh", { type: "aprv" });
														$.unblockUI();
													},
													'text'
												);
											}
										});
									}
								)
							}
						},
						selcash: {
							title: $fn.getCodeMsg("aprv.btn.selcash"), // 현금선택
							click: function (view) {
								_aprdockeylist = "";
								_$listbody = null;

								// _$listbody = $("div.dwp-table-inner", _me.element);
								// $("div.dwp-table-row input[name='chk']:checked", _$listbody).each(function () {
								//     var _data = $(this).parents("div.dwp-table-row").data($dwp.core.view._ROW_DATA);
								//     if (_data) { _rows.push(_data) };
								// });

								$("div.dwp-table-row input[name='chk']:checked", _$listbody).prop("checked", false);
								_$listbody = $("div.dwp-table-inner", view.element);
								$("div.dwp-aprv-list", _$listbody).each(function () {
									var _data = $(this).data($dwp.core.view._ROW_DATA);
									//console.log('row==> :', _data);
									if (_data) {
										if (_data.hasOwnProperty("_cashgubn")) {
											if (_data._cashgubn == "1") {
												$(this).find("input[name='chk']").prop("checked", true);
											}
										}
									}
								});
							}
						},
						selcard: {
							title: $fn.getCodeMsg("aprv.btn.selcard"), // 카드선택
							click: function (view) {
								_aprdockeylist = "";
								_$listbody = null;

								$("div.dwp-table-row input[name='chk']:checked", _$listbody).prop("checked", false);
								_$listbody = $("div.dwp-table-inner", view.element);
								$("div.dwp-aprv-list", _$listbody).each(function () {
									var _data = $(this).data($dwp.core.view._ROW_DATA);
									//console.log('row==> :', _data);
									if (_data) {
										if (_data.hasOwnProperty("_cashgubn")) {
											if (_data._cashgubn == "2") {
												$(this).find("input[name='chk']").prop("checked", true);
											}
										}
									}
								});
							}
						},
						writeteamresol: {
							title: $fn.getCodeMsg("aprv.btn.writeteamresol"), // 팀결의서 작성
							click: function (view) {
								var _rows = view.getChecked();
								if (_rows.length == 0) {
									$dwp.ui.alert({
										msg: $fn.getCodeMsg('선택된 문서가 없습니다.')
									});
									return;
								}

								_aprdockeylist = $.map(_rows, function (v) { return v["_dockey"]; }).join(";");
								if (_aprdockeylist == "") {
									$fn.alert({ msg: $fn.getCodeMsg("선택된 문서의 dockey가 없습니다.") });
									return;
								}
								var _wdbpath = "dwp/aprv/com/aprvstart.nsf";

								//_me.star_flag(view);
								// _$$.aprv.viewfun.ViewPostAction(view, "act_writeteamresol");
								//팀결의서 양식 호출

								$fn.loadPage({ link: "/" + _wdbpath + "/wFrmApprove?openform&FormCode=Form021&dockeylist=" + _aprdockeylist, linktype: 'PAGE' })
							}
						},
						//접수대기 목록에서 [일괄 접수] 처리
						allreceive: {
							title: $fn.getCodeMsg('aprv.btn.allreceive'), //일괄 접수
							click: function (view) {
								var _me = this,
									_dockey = "",
									_rows = view.getChecked();
								if (_rows.length == 0) {
									$dwp.ui.alert({ msg: $fn.getCodeMsg('aprv.msg.019') }); //선택하시기 바랍니다.
									return;
								}
								_dockey = $.map(_rows, function (v) { return v['_dockey']; }).join(';');

								$fn.confirm({ msg: $fn.getCodeMsg('aprv.msg.057') }).done( //일괄 접수 진행하시겠습니까?
									function () {
										_$$.aprv.com.AprvPwVerify({
											callback: function () {
												$fn.block(undefined, { notusemsg: false });
												$fn.cmdPost(
													$fn.getProxyUrl(_opt.cdb + "/cmdpost?createdocument"), {
													actiontype: 'allreceive',
													Unid: _dockey,
													Arg1: _dockey,
													Arg2: (_opt.single.substr(0, 1) == "B" ? _opt.single : $fn.getCurUser().pinfo.orgcode),
													Arg3: "",
													Arg4: "receive" //"receive" 값이면 접수 처리만
												},
													function (txt) {
														if (txt.indexOf('ActEvaluation') > -1) {
															$fn.alert({
																msg: $fn.getCodeMsg('aprv.title.h131')
															});
														}
														view.refresh();
														// 2022-05-27 Layout 변경
														//$fn.xTrigger($('div.dwp-icon-menu'), 'GnbCountRefresh', { type: 'aprv' });
														$fn.xTrigger($('div.xware-header-icon'), 'GnbCountRefresh', { type: 'aprv' });

														$.unblockUI();
													},
													'text'
												);
											}
										});
									}
								)
							}
						},

						//상세검색 - 2021.11.17 by dwlee
						//2022.12.12 hide by dwlee
						detailsearch_2: {
							title: "검색 펼치기",
							click: function (view) {
								var _viewopt = view.options;

								//자동완성 사용자 처리 - 2021.11.18
								function selUser($this) {
									$fn.orgsel($this, { isedit: true, type: "single", treetype: "0", seltype: "2", isseltype: false, fld: "User", count: 1 });
								}

								//this -> div.dwp-row
								function checkReverse($this) {
									var _$allchk = $("[name='chkall']", $this);
									if (_$allchk.prop("checked")) {
										$("input[name=Status]", $this.parent()).prop("checked", true);
									} else {
										$("input[name=Status]", $this.parent()).prop("checked", false);
									}
								}

								//this -> div.dwp-row
								//하나라도 체크 클릭이 일어나면 전체 삭제/해제시에는 값을 빼야함.
								function checkModule($this) {
									var _$allchk = $("[name='chkall']", $this.parent());
									_$allchk.prop("checked", false);
								}

								var _detailopt = [];
								//기안일자 - 기간 검색
								_detailopt.push({ line: 1, nm: "기안일자", fld: "sDate", flde: "eDate", key: "sStartDate", type: "date" });

								//완료일자 - 기간 검색
								_detailopt.push({ line: 1, nm: "완료일자", fld: "cSDate", flde: "cEDate", key: "sCompleteDate", type: "date" });

								//자동완성 및 조직도
								/*
									key ==> 실제 검색할 필드명
									사번으로 검색시에는 fldtype 에 'empno'를 넣어주면 됨
									curuser : true 이면 기본값으로 현재 접속자를 넣어줌
								*/
								_detailopt.push({ line: 2, nm: "기안자", fld: "User", fldtype: "", curuser: true, orgnm: "org1", key: "AuthorName", type: "orgsel", fnc: selUser });


								//시스템변경 요청서만 요청자가 있음 - 2021.11.25 by dwlee
								if (_viewopt.systemtype == "change") {
									var ucode = [];
									var _default = {
										txt: "--선택--",
										val: ""
									}
									ucode.push(_default);
									//담당자 정보 찾아오기
									var _url = '/dwp/aprv/com/system_mn.nsf/api/data/collections/name/wviwManager?ps=1000&page=0';
									$fn.xAjax({
										url: $fn.getProxyUrl(_url),
										method: "GET",
										dataType: "json",
										async: false
									}).done(function (jsonData) {
										var _duparr = [];
										for (var i = 0; i < jsonData.length; i++) {
											var _json = jsonData[i];
											var _narr = _json._devlist.split(",");
											var _earr = _json._devempnolist.split(",");
											$.each(_narr, function (idx, _name) {
												var _selopt = {
													txt: _name,
													val: _earr[idx]
												}
												if ($.inArray(_earr[idx], _duparr) == -1) {  //중복제거
													_duparr.push(_earr[idx]);
													ucode.push(_selopt);
												}
											});
										}
									});
									//line : 표시하는 라인의 인덱스(한라인에 두개까지만 가능)
									//nm : row title
									//fld : 검색조건 필드
									//key : 실제 데이타 필드
									//type : 검색조건 필드의 타입
									_detailopt.push({ line: 2, nm: "담당자", fld: "User1", key: "developer", type: "select", code: ucode });

									//모듈(SelectBox)
									_detailopt.push({
										line: 3, nm: "시스템", fld: "Module", key: "Module", type: "xlang"
										, xlang: { lc: "LC_CODE", type: "select", code: "AP0001.GP0054", src: "CDB", all: "--선택--", name: "Module" }
									});
								} else {
									// _detailopt.push({line : 3,nm : "시스템", fld : "Module", key : "System", type : "xlang"
									// , xlang : {lc : "LC_CODE", type:"select", code : "AP0001.GP0054", src :"CDB", all : "--선택--", name : "Module" }
									// });
								}

								//검색어 영역
								_detailopt.push({ line: 2, nm: "검색어", fld: "Body", key: "Body", type: "query" });

								//상태 - 체크박스 
								//var _head = '상태<div class="dwp-checkbox textless" style="margin-left:10px"><label><input name="chkall" type="checkbox" class="dwp-check-all"><span></span></label></div>';
								//nm_fnc : row title에 전체 체크박스 생성후 클릭시 수행되는 함수
								// _detailopt.push({line : 4,nm : '상태', nm_fnc: checkReverse, fld : "Status", key : "Status", type : "xlang"
								// , xlang : {lc : "LC_CODE", type:"checkbox", code : "AP0001.GP0068", src :"CDB", name : "Status"},fnc:checkModule
								// });	

								// var _dsopt = {
								// 	"linnum" : 4,                   //라인수
								// 	"dopt" : _detailopt
								// }     

								var _dsopt = {
									"linnum": 2,                   //라인수
									"dopt": _detailopt
								}
								view.detailsearchLayer(_dsopt);

								var _$dbody = $(".dwp-detail-body", view.element);
								if (_$dbody.hasClass("dwp-hidden")) {
									_$dbody.removeClass("dwp-hidden");
									$("span", $(this)).html("검색 접기");
								} else {
									_$dbody.addClass("dwp-hidden");
									$("span", $(this)).html("검색 펼치기");
									//_viewopt.ispopupdoc = "0";
									view.reload({ page: 1, searchqry: "", ispopupdoc: "0", searchview: false });
									//일반 보기로 돌아가기
								}
							}
						},

						//접수대기 목록에서 [일괄 접수/상신] 버튼 처리
						allreceiveapprove: {
							title: $fn.getCodeMsg('aprv.btn.allreceiveapprove'), //일괄 접수/상신
							click: function (view) {
								var _me = this,
									_rows = view.getChecked(),
									_dockey = "";
								if (_rows.length == 0) {
									$dwp.ui.alert({ msg: $fn.getCodeMsg('aprv.msg.019') }); //선택하시기 바랍니다.
									return;
								}
								_dockey = $.map(_rows, function (v) { return v['_dockey']; }).join(';');
								var checkLineData = function (linedata) {
									var _apptype = ["AP"],
										_chk = true,
										arrval = [],
										errmsg = "";
									$.each(linedata.applinedata, function (ii, sval) {
										arrval = sval.split("^");
										if ($.inArray(arrval[0], _apptype) == -1) _chk = false;
									});
									if (_chk == false) {
										$.each(_apptype, function (ii, sval) {
											errmsg += (errmsg != "" ? ", " : "") + $fn.getCodeMsg("aprv.data.apptype." + sval);
										});
										errmsg = "[" + errmsg + "] " + $fn.getCodeMsg("aprv.msg.059"); //이외 유형으로 등록된 결재라인은 사용할 수 없습니다.
										$fn.alert({ msg: errmsg });
										return false;
									}

									var _linedata = $.extend({ applinedata: [] }, linedata);
									if (_linedata.applinedata.length == 0) {
										$fn.alert($fn.getCodeMsg("aprv.msg.031"));
										return false;
									}
									if (linedata.applinedata[0].indexOf($fn.getCurUser().abnotesid) == -1) {
										$fn.alert({ msg: $fn.getCodeMsg("본인이 등록한 결재선만 사용가능 합니다.") });
										return false;
									}
									return true;
								}

								$fn.confirm({ msg: $fn.getCodeMsg('aprv.msg.058') }).done( //일괄 접수/상신을 진행하시겠습니까?
									function () {
										_$$.aprv.com.AprvPwVerify({
											callback: function () {
												var selectcallback = function (linedata) {
													var _linedata = $.extend({ applinedata: [] }, linedata);
													if (_linedata.applinedata.length == 0) {
														$fn.alert($fn.getCodeMsg("aprv.msg.031"));
														return;
													}
													if (linedata.applinedata[0].indexOf($fn.getCurUser().abnotesid) == -1) {
														$fn.alert({ msg: $fn.getCodeMsg("본인이 등록한 결재선만 사용가능 합니다.") });
														return;
													}

													$fn.block(undefined, { notusemsg: false });
													$fn.cmdPost(
														$fn.getProxyUrl(_opt.cdb + "/cmdpost?createdocument"), {
														actiontype: 'allreceive',
														Unid: _dockey,
														Arg1: _dockey,
														Arg2: (_opt.single.substr(0, 1) == "B" ? _opt.single : $fn.getCurUser().pinfo.orgcode),
														Arg3: linedata.applinedata.join(";"),
														Arg4: "receive_approve" //"receive_approve" 값이면 접수 이후 결재상신까지 진행
													},
														function (txt) {
															if (txt.indexOf('ActEvaluation') > -1) {
																$fn.alert({
																	msg: $fn.getCodeMsg('aprv.title.h131')
																});
															}
															view.refresh();
															//2022-05-27 Layout 변경
															//$fn.xTrigger($('div.dwp-icon-menu'),'GnbCountRefresh', { type: 'aprv' });
															$fn.xTrigger($('div.xware-header-icon'), 'GnbCountRefresh', { type: 'aprv' });
															$.unblockUI();
														},
														'text'
													);
												};
												_$$.aprv.line.selectLineData(view, checkLineData, selectcallback);
											}
										});
									}
								)
							}
						},

						create: {											//안전보건관리 > 작성버튼 추가 - 2023/01/16 - 10000hyun
							title: $fn.getCodeMsg("comm.btn.create"),
							click: function (view) {
								$fn.loadPage({ link: view.options.create_path, linktype: "PAGE" });
							},
							icon: $fn.getPath("weblib") + "/images/common/icon-lnb-btn.svg"
						}
					},
					_sbtnList = {
						//영구삭제 버튼 ㅊ가 - 2025.12.07 by dwlee 
						wviwlist01: ['create', 'starflag', 'del', 'pdel'],

						/*
												wviwlist04: ['starflag', 'exceldown', 'ssearch', 'hsearch', 'allaprv', 'conaprv'],			//결재할 문서
												wviwlist04_startdate_des: ['starflag', 'exceldown', 'ssearch', 'hsearch', 'allaprv', 'conaprv'],	//결재할 문서
						*/
						wviwlist04: ['starflag', 'exceldown', 'ssearch', 'hsearch', 'conaprv'],					//결재할 문서
						wviwlist04_startdate_des: ['starflag', 'exceldown', 'ssearch', 'hsearch', 'conaprv'],			//결재할 문서

						wviwlist05: ['starflag', 'exceldown', 'ssearch', 'hsearch', 'allreceive', 'allreceiveapprove'],
						wviwlist06: ['starflag', 'exceldown', 'ssearch', 'hsearch'],
						wviwlist07: ['starflag', 'exceldown', 'ssearch', 'hsearch'],
						wviwlist08: ['starflag', 'exceldown', 'ssearch', 'hsearch'],					//결재 반려문서
						wviwlist09: [''],
						wviwlist10: ['starflag', 'exceldown', 'ssearch', 'hsearch'],					//결재 예정문서
						/*
							by mjkim 20251111 보류추가
						*/
						wviwlist12: ['starflag', 'exceldown', 'ssearch', 'hsearch'],					//결재 보류문서

						wviwlist11: [''],
						wviwlist20: ['pdel', 'restore'],
						wviwlist21: ['selcash', 'selcard', 'writeteamresol'],
						wviwlist22: ['pdel', 'restore'],
						wviwlist30: ['starflag', 'exceldown', 'ssearch', 'hsearch'],

						wviwlist30_s: ['starflag', 'exceldown', 'ssearch', 'hsearch'],				//완료보기 통합검색 색인 사용 보기 - 2024.05.10 by dwlee

						wviwlistwork30: ['starflag', 'exceldown', 'ssearch', 'hsearch'],				//근태결재 보기
						wviwlist51: ['starflag', 'exceldown', 'ssearch', 'hsearch'],
						wviwlist52: ['starflag', 'exceldown', 'ssearch', 'hsearch'],
						wviwenforce: ['starflag', 'exceldown'],
						wviwcert: ['starflag', 'exceldown'],
						wviwlist36: ['starflag', 'exceldown'],
						wviwlist37: ['starflag', 'exceldown'],
						wviwlist38: ['starflag', 'exceldown'],
						wviwlist710: ['starflag', 'exceldown'],				//IT처리요청서   20250902 by wsjung
						wviwlist777: ['starflag', 'exceldown'],				//IT처리요청서   20250908 by wsjung  
						wviwlist777hr: ['starflag', 'exceldown'],				//IT처리요청서   20250908 by wsjung  
						wviwlistfwd: ['starflag'],                             		//전달문서함   20250930 by wsjung  

						wviwlist35: [''],
						wviwlist30d: [''],
						wviwlist40: [''],
						wviwlist50: ['starflag', 'exceldown', 'ssearch', 'hsearch'],					//결재 참조문서
						wviwlist40_zh: [''],
						wviwlist60: ['starflag', 'exceldown', 'ssearch', 'hsearch', 'tableview'],
						wviwlist70: [''],
						wviwlist71: [''],
						wviwlist80: [''],
						wviwlist90: ['db2update'],
						wviwlist31: [''],
						wviwlist32d: [''],
						wviwlist33d: [''],													//2024.12.31 by dwlee

						wviwlist34d: [''],													//2025.01.16 by dwlee

						wviwlist88: [''],													//2023.02.16	
						wviwlist89: [''],													//2023.02.16	
						wviwlist110: ['db2update'],
						wviwlist120: ['db2update'],
						wviwlist210: [''],
						wviwlist220: [''],

						wviwlist134: [''],													//2023.05.16
						wviwlist135: [''],													//2023.05.16
						wviwlist136: [''],													//2023.05.16	
						wviwlist137: [''],													//2023.05.16
						wviwlist138: [''],													//2023.05.16					
					};

				return $dwp.core.util.exObjList(
					_btnList,
					_sbtnList[_opt.viewalias + (_opt.isbookmark ? 'd' : '')]
				);
			},
			_headerInfo: function (_opt) {
				var _cate = {},
					_cate_data = [],
					level = 0;

				if (
					_opt.displaycode == 'wviwlist04' ||
					_opt.displaycode == 'wviwlist04_startdate_des' ||
					_opt.displaycode == 'wviwlist07' ||
					_opt.displaycode == 'wviwlist09' ||
					_opt.displaycode == 'wviwlist10' ||
					/*
						by mjkim 20251111 보류추가
					*/

					_opt.displaycode == 'wviwlist12' ||

					_opt.displaycode == 'wviwlist05' ||
					_opt.displaycode == 'wviwlist21' ||
					_opt.displaycode == 'wviwlist22'
				) {
					level = 2;
				} else {
					level = 2;
				}

				if (_opt.iscategory == true) {
					_cate_data = _$$.aprv.viewfun.getCategory(_opt);
					if (_cate_data.length > 0) {
						_cate = {
							name: '_category',
							lvl: level,
							data: _cate_data,
							usechangefunc: false,
							change: function (view, select) {
								var that = this;
								//console.log('view', view);
								//console.log('select', select);
								var _opt = view.options;
								var _url = _opt.pathinfo.substring(0, _opt.pathinfo.indexOf("&"));
								_url += "&view=" + _opt.viewalias;
								_url += "&restricttocategory=" + _opt.single;
								view.options.pathinfo = _url;
								view.refresh();
								//$dwp.core.util.loadPage({link : _url, linktype : "PAGE"});
							}
						};
					}
				}

				var _me = this,
					_col = {
						dismenucate: {
							name: '_category',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h001'), // 문서 종류
							width: '90px',
							sort: false,
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						formtitle: {
							name: '_sformtitle',
							type: 'text',
							title: '결재양식',
							width: '220px',
							sort: false,
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//검색엔진 인덱스용 - 2024.05.08 by dwlee
						formtitle_s: {
							name: 'sDisFormAlias',
							type: 'fnc',
							title: '결재양식',
							width: '220px',
							sort: false,
							css: 'auth-cell',
							content: function (obj) {
								if (obj.hasOwnProperty("AFPAprFormName")) {
									return obj.AFPAprFormName;
								} else {
									return $fn.getCurLangMsg(obj.sDisFormAlias);
								}
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						appinginfo: {
							name: '_appinginfo',
							title: $fn.getCodeMsg('aprv.title.h056'), // 진척률
							type: 'fnc',
							width: '60px',
							sort: false,
							css: 'auth-cell',
							content: function (obj) {
								var tval = '',
									cval = '';

								if (
									obj._sstatus == 'reject' ||
									obj._sstatus == 'receivewait' ||
									obj._sstatus == 'received' ||
									typeof obj['_appinginfo'] == 'undefined'
								) {
									cval = 0;
								} else {
									tval = obj['_appinginfo'].split('/');
									//cval = tval[0] / tval[1] * 100;
									if (tval[0] == tval[1]) {
										cval = ((tval[0] - 1) / tval[1]) * 100;
									} else {
										cval = (tval[0] / tval[1]) * 100;
									}
								}

								return cval == 0 ? '' : parseInt(cval) + '%';
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						sstatus: {
							name: '_sstatus',
							title: $fn.getCodeMsg('aprv.title.h017'), // 결재상태
							type: 'fnc',
							width: '70px',
							sort: false,
							css: 'auth-cell',
							content: function (obj) {
								var cval = '';
								cval = $fn.getCodeObjMsg('aprv.data.status', obj['_sstatus']);
								if (obj["_sstatus"] === "received" || obj["_srdocform"] === "Y") {
									cval = '<div class="dwp-blue">' + cval + '</div>';
									//보류인 경우 - 2024.08.22 by dwlee
								} else if (obj["_sstatus"] === "stop") {
									cval = '<div class="dwp-orange dwp-bold">' + cval + '</div>';
								}
								return cval;
							},
							click: function (obj, o, view) {
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//검색엔진 인덱스용 - 2024.05.08 by dwlee
						sstatus_s: {
							name: 'sStatus',
							title: $fn.getCodeMsg('aprv.title.h017'), // 결재상태
							type: 'fnc',
							width: '70px',
							sort: false,
							css: 'auth-cell',
							content: function (obj) {
								var cval = '';
								cval = $fn.getCodeObjMsg('aprv.data.status', obj['sStatus']);
								if (obj["sStatus"] === "received" || obj["sRDocForm"] === "Y") {
									cval = '<div class="dwp-blue">' + cval + '</div>';
								}
								return cval;
							},
							click: function (obj, o, view) {
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						comment: {
							name: '_comment',
							title: '', //$fn.getCodeMsg("aprv.title.h020")	// 의견
							type: 'fnc',
							width: '23px',
							sort: false,
							css: 'auth-cell',
							content: function (obj) {
								return obj['_comment'] != '0' ? '<img src="' + $dwp.core.getPath('weblib') + '/images/common/icon-opinion.svg">' : '';
							},
							click: function (obj, o, view) {
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},


						//검색엔진 인덱스용 - 2024.05.08 by dwlee
						comment_s: {
							name: 'sComment1',
							title: '', //$fn.getCodeMsg("aprv.title.h020")	// 의견
							type: 'fnc',
							width: '23px',
							sort: false,
							css: 'auth-cell',
							content: function (obj) {
								//return obj['_comment'] != '0' ? '<img src="' + $dwp.core.getPath('weblib') + '/images/common/icon-opinion.svg">' : '';
							},
							click: function (obj, o, view) {
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},


						/*				2024.03.06by jwlee			
												isstarred: {
													name: '_isstarred',
													type: 'fnc',
													title: '',
													sort: false,
													width: '5%',
													css: 'mark-cell',
													content: function (obj) {
														return obj['_isstarred'] == '1' ? '<span class="mark active"></span>' : '<span class="mark"></span>';
													},
													click: function (_cell, _data) {
														_$$.aprv.viewfun.ViewPostAction(_cell, 'act_star', _data);
													}
												},
						*/

						//북마크 관련 수정 - 2024.03.06 by jwelee
						isstarred: {
							name: '_isstarred',
							type: 'fnc',
							title: '',										// 즐겨찾기
							sort: false,
							width: '30px',
							css: 'bookmark-cell',
							content: function (obj) {
								var _dockey = obj["_dockey"];
								return '<span class="mark" data-doc-key="' + _dockey + '"></span>';
							},
							click: function (obj, o, view) {
								var _star = $(".mark", obj);
								var _dockey = $(_star).attr("data-doc-key");
								var _isactive = $(_star).hasClass("active");
								var _mode = (_isactive ? "remove" : "viewadd");
								var _key = [o["@unid"] + "^" + _dockey];
								var _dbpath = view.options.cdb.replace("/dwp", "dwp");

								_$$.aprv.com.setBookmark(_key, _mode, _dbpath, function (_ret) {
									$.each(_star, function () {
										switch (_mode) {
											case "viewadd": $(this).addClass("active"); break;
											case "remove": $(this).removeClass("active"); break;
										}
									})
								});
							}
						},

						//북마크 관련 수정 - 2024.03.06 by jwelee
						//검색엔진 인덱스용 - 2024.05.08 by dwlee
						isstarred_s: {
							name: 'dockey',
							type: 'fnc',
							title: '',										// 즐겨찾기
							sort: false,
							width: '30px',
							css: 'bookmark-cell',
							content: function (obj) {
								var _dockey = obj["dockey"];
								return '<span class="mark" data-doc-key="' + _dockey + '"></span>';
							},
							click: function (obj, o, view) {
								var _star = $(".mark", obj);
								var _dockey = $(_star).attr("data-doc-key");
								var _isactive = $(_star).hasClass("active");
								var _mode = (_isactive ? "remove" : "viewadd");
								var _key = [o["@unid"] + "^" + _dockey];

								//통합검색용 색인 사용시 - 2024.05.09 by dwlee
								//var _dbpath		= view.options.cdb.replace("/dwp", "dwp");
								var _dbpath = o["@href"].split(".nsf")[0] + ".nsf";
								_dbpath = _dbpath.substring(1, _dbpath.length); //맨앞 '/' 날리기

								_$$.aprv.com.setBookmark(_key, _mode, _dbpath, function (_ret) {
									$.each(_star, function () {
										switch (_mode) {
											case "viewadd": $(this).addClass("active"); break;
											case "remove": $(this).removeClass("active"); break;
										}
									})
								});
							}
						},

						lastcomment: {
							name: '_lastcomment',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h130'), // 최종결재의견
							width: 'auto',
							sort: false,
							css: 'subject-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						subject: {
							name: '_subject',
							type: 'text',
							title: $fn.getCodeMsg('comm.title.subject'), // 제목
							width: 'auto',
							sort: false,
							css: 'subject-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//출장 휴가 ERP 연동 플래그 - 2024.10.25 - by dwlee
						erp_status_gw: {
							name: '_erpstatus',
							type: 'fnc',
							title: "ERP Status",
							width: '90px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								//_sstatus 와 _erp_status 값을 가지고 업데이트 시도를 해야 함 - 2024.10.28 
								/*
																by mjkim 20250210 sendtype추가 공백인 경우 전송 대상 양식 아님
								*/

								var tmpval = obj['_erpstatus'] != '1' && obj['_sstatus'] != 'draft' && obj['_sendtype'] != '' ? '<div class="dwp-btn dwp-btn-resend dwp-blue"><span>' + $fn.getCodeMsg("aprv.data.status.resend") + '</span></div>' : 'OK';
								return tmpval;
							},

							click: function (obj, o, view) {
								var _$resend = $(".dwp-btn-resend", $(obj)); //재전송 버튼이 있는 경우에만 처리함
								if (_$resend.size() > 0) {

									var _resendtype = "resend_" + o._sendtype;

									$fn.xAjax({
										url: $fn.getProxyUrl('/' + o._indbpath + '/wcmdpost?createdocument'),
										method: 'POST',
										dataType: 'json',
										/*
																				20250210 by mjkim actiontype 휴가, 출장 추가로 변경  
																				data: { actiontype: "resend_erpstatus", unid: o._dockey },
										*/
										data: { actiontype: _resendtype, unid: o._dockey },
										async: true,
										cache: false
									}).done(function (data) {
										if (data.result != "400") {
											$(".dwp-fail", $(obj)).remove(); //실패 플래그 삭제
											_$resend.remove();  //버튼 없애주기
										}
									}).fail(function (req, error) {
										console.log(req.responseText + '\n' + error);
									});
								}
							}
						},


						//ERP 연동 플래그 - 2024.10.25 - by dwlee
						erp_status: {
							name: '_erpstatus',
							type: 'fnc',
							title: "ERP Status",
							width: '90px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								//_sstatus 와 _erp_status 값을 가지고 업데이트 시도를 해야 함 - 2024.10.28 
								/*
																by mjkim 20250210 sendtype추가 공백인 경우 전송 대상 양식 아님
								*/

								var tmpval = obj['_erpstatus'] != '1' && obj['_sendtype'] != '' ? '<div class="dwp-btn dwp-btn-resend dwp-blue"><span>' + $fn.getCodeMsg("aprv.data.status.resend") + '</span></div>' : 'OK';
								return tmpval;
							},

							click: function (obj, o, view) {
								var _$resend = $(".dwp-btn-resend", $(obj)); //재전송 버튼이 있는 경우에만 처리함
								if (_$resend.size() > 0) {

									var _resendtype = "resend_" + o._sendtype;

									$fn.xAjax({
										url: $fn.getProxyUrl('/' + o._indbpath + '/wcmdpost?createdocument'),
										method: 'POST',
										dataType: 'json',
										/*
																				20250210 by mjkim actiontype 휴가, 출장 추가로 변경  
																				data: { actiontype: "resend_erpstatus", unid: o._dockey },
										*/
										data: { actiontype: _resendtype, unid: o._dockey },
										async: true,
										cache: false
									}).done(function (data) {
										if (data.result != "400") {
											$(".dwp-fail", $(obj)).remove(); //실패 플래그 삭제
											_$resend.remove();  //버튼 없애주기
										}
									}).fail(function (req, error) {
										console.log(req.responseText + '\n' + error);
									});
								}
							}
						},

						//ERP 임시서장
						erp_draft: {
							name: '_erp_draft',
							type: 'fnc',
							title: "DRAFT",
							width: '60px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								if (obj._erp_draft != "1" && obj._sstatus == "draft") {
									return "<span class='dwp-red dwp-fail dwp-bold'>F</span>";
								} else if (obj._erp_draft == "1") {
									return "S";
								} else {
									return "";
								}
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								//_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						//출장 휴가 ERP 임시서장
						erp_draft_gw: {
							name: '_erp_draft',
							type: 'fnc',
							title: "DRAFT",
							width: '60px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								if (obj._erp_draft == "1") {
									return "S";
								} else {
									return "";
								}
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								//_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//ERP 연동 플래그 - 2024.10.25 - by dwlee
						//ERP 반려
						erp_reject: {
							name: '_erp_reject',
							type: 'fnc',
							title: "REJECT",
							width: '60px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								if (obj._erp_reject != "1" && obj._sstatus == "reject") {
									return "<span class='dwp-red dwp-fail dwp-bold'>F</span>";
								} else if (obj._sstatus == "reject" && obj._erp_reject == "1") {
									return "S";
								} else {
									return "";
								}
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								//_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						//ERP 연동 플래그 - 2024.10.25 - by dwlee
						//ERP 진행
						erp_ing: {
							name: '_erp_ing',
							type: 'fnc',
							title: "ING",
							width: '60px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								if (obj._erp_ing != "1" && obj._sstatus == "ing") {
									return "<span class='dwp-red dwp-fail dwp-bold'>F</span>";
								} else if (obj._erp_ing == "1") {
									return "S";
								} else {
									return "";
								}
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								//_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						//ERP 연동 플래그 - 2024.10.25 - by dwlee
						//ERP 완료
						erp_done: {
							name: '_erp_done',
							type: 'fnc',
							title: "DONE",
							width: '60px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								if (obj._erp_aprdone != "1" && obj._sstatus == "complete") {
									return "<span class='dwp-red dwp-fail dwp-bold'>F</span>";
								} else if (obj._sstatus == "complete" && obj._erp_aprdone == "1") {
									return "S";
								} else {
									return "";
								}
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								//_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						//ERP 연동 플래그 - 2024.10.25 - by dwlee
						//ERP 완료
						erp_delete: {
							name: '_erp_delete',
							type: 'fnc',
							title: "DELETE",
							width: '60px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								if (obj._erp_delete != "1" && obj._sstatus == "delete") {
									return "<span class='dwp-red dwp-fail dwp-bold'>F</span>";
								} else if (obj._sstatus == "delete" && obj._erp_delete == "1") {
									return "S";
								} else {
									return "";
								}
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								//_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						subject2: {
							name: '_subject',
							type: 'fnc',
							title: $fn.getCodeMsg('comm.title.subject'), // 제목
							width: 'auto',
							sort: false,
							css: 'subject-cell',
							content: function (obj) {
								var tmpval = obj['_comment'] != '0' ? '&nbsp;&nbsp;<span><img src="' + $dwp.core.getPath('weblib') + '/images/common/icon-opinion.svg" width=14px, height=16px></span>' : '';

								//보안의견 미표시 인경우 보기에서 의견표시도 안보여 줌  - 2024.11.19 by dwlee
								if ($fn.getSysinfo().DspSecOpinion == "0" && obj['_sstatus'] == "complete") {
									tmpval = "";
								}

								var tmpval2 = obj['_delaychk'] == '1' ? '<span><img src="' + $dwp.core.getPath('weblib') + '/images/common/icon-delay.svg" width=14px, height=16px></span>&nbsp;&nbsp;' : '';
								var _cval = "<div class='dwp-subject'>" + tmpval2 + obj['_subject'] + tmpval + '</div>';
								return _cval;
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//검색엔진 인덱스용 - 2024.05.08 by dwlee
						subject2_s: {
							name: 'Subject',
							type: 'fnc',
							title: $fn.getCodeMsg('comm.title.subject'), // 제목
							width: 'auto',
							sort: false,
							css: 'subject-cell',
							content: function (obj) {
								//comment가 없으니 문제가 있음
								var _cmt1 = obj["sComment1"];
								var _cmt2 = obj["sComment2"];
								var _cmt3 = obj["sComment3"];
								var _cmt = ""

								if (typeof _cmt1 != "undefined") _cmt += _cmt1;
								if (typeof _cmt2 != "undefined") _cmt += _cmt2;
								if (typeof _cmt3 != "undefined") _cmt += _cmt3;

								var tmpval = _cmt != '' ? '&nbsp;&nbsp;<span><img src="' + $dwp.core.getPath('weblib') + '/images/common/icon-opinion.svg" width=14px, height=16px></span>' : '';


								//보안의견 미표시 인경우 보기에서 의견표시도 안보여 줌  - 2024.11.19 by dwlee
								if (obj.hasOwnProperty('_sstatus') && $fn.getSysinfo().DspSecOpinion == "0" && obj['_sstatus'] == "complete") {
									tmpval = "";
								}

								//var tmpval2 = obj['_delaychk'] == '1' ? '<span><img src="' + $dwp.core.getPath('weblib') + '/images/common/icon-delay.svg" width=14px, height=16px></span>&nbsp;&nbsp;' : '';
								var tmpval2 = ""; //완료문서는 지연이 없음.
								var _cval = "<div class='dwp-subject'>" + tmpval2 + obj['Subject'] + tmpval + '</div>';
								return _cval;
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						noticedate: {
							name: '_srenoticedate',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.h079'), // 게시기간
							sort: false,
							width: '170px',
							css: 'auth-cell',
							content: function (obj) {
								var _cval = $fn.formatDateTime(obj['_srenoticedate'], 'dateonly') + ' ~ ' + $fn.formatDateTime(obj['_snoticedate'], 'dateonly');
								return _cval;
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						authorcom: {
							name: '_authorcom',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h132'), // 기안회사, by noh
							sort: false,
							width: '100px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						dept: {
							name: '_authordept',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h009'), // 기안부서
							sort: false,
							width: '185px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						dept2: {
							name: '_authordept',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h058'), // 발신부서
							sort: false,
							width: '185px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						author: {
							name: '_author',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h010'), // 기안자
							sort: false,
							width: '70px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						/*
						  by mjkim 20241230 발신자 
						*/
						reqauthor: {
							name: '_author',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.h010'), // 기안자
							sort: false,
							width: '70px',
							css: 'auth-cell',
							content: function (obj) {
								var _cval = (obj._rdocform == "Y" ? $fn.getCurLangMsg(obj._reqauthor) : $fn.getCurLangMsg(obj._author));
								return _cval;
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						/*
						by mjkim 20241230 발신 문서번호
						*/
						reqdocnumber: {
							name: '_docnumber',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.h047'), // 문서번호
							sort: false,
							width: '250px',
							css: 'auth-cell left',
							content: function (obj) {
								var _cval = (obj._rdocform == "Y" ? obj._reqdocnumber : obj._docnumber);
								return _cval;
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						//검색엔진 인덱스용 - 2024.05.08 by dwlee
						author_s: {
							name: 'AuthorName',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h010'), // 기안자
							sort: false,
							width: '70px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						author2: {
							name: '_author',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h059'), // 발신인
							sort: false,
							width: '70px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						lastaprname: {
							name: '_lastaprname',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h040'), // 게시자
							sort: false,
							width: '130px',
							css: 'auth-cell',
							content: function (obj) {
								var _cval = $fn.getCurLangMsg(obj['_lastaprname']);
								return _cval;
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						authordept: {
							name: '_authordept',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h046'), // 기안부서
							sort: false,
							width: '185px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//검색엔진 인덱스용 - 2024.05.08 by dwlee
						authordept_s: {
							name: 'AuthorOrgName',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h046'), // 기안부서
							sort: false,
							width: '185px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						docnumber: {
							name: '_docnumber',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h047'), // 문서번호
							sort: false,
							width: '250px',
							css: 'auth-cell left',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//검색엔진 인덱스용 - 2024.05.08 by dwlee
						docnumber_s: {
							name: 'DocNumber',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h047'), // 문서번호
							sort: false,
							width: '250px',
							css: 'auth-cell left',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						curuser: {
							name: '_curuser',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.h021'), // 현재결재자
							sort: false,
							width: '150px',
							css: 'auth-cell',
							content: function (obj) {
								//	var curapread = (obj["_scurappread"] == "true" ?'<span><img src="'+$dwp.core.getPath("weblib")+'/images/common/icon-doc-opened.svg" width=14px, height=16px></span>&nbsp;' : '');
								var tmpval = obj['_curuseretc'] != '' ? '&nbsp;' + $fn.getCodeMsg('aprv.title.h048').replace('{$1}', obj['_curuseretc']) : '';
								//	var _cval = curapread + $fn.getCurLangMsg(obj["_curuser"]) + tmpval;
								var _cval = $fn.getCurLangMsg(obj['_curuser']) + tmpval;
								return _cval;
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						startdate: {
							name: '_startdate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.h007'), // 기안일자
							width: '80px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						expiredate: {
							name: '_sfwdexpiredate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.expiredate'), // 만료일자
							width: '80px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//통합검색 색인 사용 - 2024.05.08 by dwlee
						startdate_s: {
							name: 'sStartDate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.h007'), // 기안일자
							width: '80px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						scompletedate: {
							name: '_scompletedate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.h045'), // 완료일자
							width: '80px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						//통합검색 색인 사용 - 2024.05.08 by dwlee						
						scompletedate_s: {
							name: 'sCompleteDate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.h045'), // 완료일자
							width: '80px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},

						ssenddate: {
							name: '_ssenddate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.h060'), // 수신일
							width: '80px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						sreceivedate: {
							name: '_sreceivedate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.h061'), // 접수일
							width: '90px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						created: {
							name: '_created',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.h002'), // 작성일
							width: '10%',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						attach: {
							name: '_attach',
							type: 'file',
							title: '',
							width: '20px',
							sort: false,
							css: 'file-cell'
						},

						//@If(@Trim(Multi_Attach_SortFiles) ="";"false";"true")
						//통합검색 색인 인덱스용 - 2024.05.08 by dwlee
						attach_s: {
							name: 'Multi_Attach_SortFiles',
							type: 'file',
							title: '',
							width: '18px',
							sort: false,
							css: 'file-cell'
						},

						draftdate: {
							name: '_draftdate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.h133'), // 결의서일자
							width: '90px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						paydate_1: {
							name: '_paydate_1',
							type: 'date',
							title: '회계일자', // 회계일자
							width: '90px',
							sort: true,
							css: 'date-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						paydocno: {
							name: '_paydocno',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h134'), // 결의서번호
							sort: false,
							width: '150px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						paydocno_1: {
							name: '_paydocno_1',
							type: 'text',
							title: '증빙번호', // 증빙번호
							sort: false,
							width: '150px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						payjcode: {
							name: '_payjcode',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h135'), // 적요코드
							sort: false,
							width: '100px',
							css: 'auth-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						paysubject: {
							name: '_paysubject',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.h136'), // 적요명
							sort: false,
							width: 'auto',
							css: 'subject-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						jsumamount: {
							name: '_jsumamount',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.h137'), // 금액
							sort: false,
							width: '150px',
							css: 'auth-cell right',
							content: function (obj) {
								var cval = '';
								cval = obj["_jsumamount"];
								cval = cval.toString().toComma();
								return cval;
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						writegubn: {
							name: '_writegubn',
							type: 'fnc',
							title: '전송', // 전송
							sort: false,
							width: '70px',
							css: 'auth-cell',
							content: function (obj) {
								var cval = obj["_writegubn"];
								//console.log('jsumamount :', obj["_jsumamount"]);
								if (cval == "1") return '전송';
								else return '미전송';
							},
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},
						subject3: {
							name: '_subject',
							type: 'text',
							title: '적요', // 적요
							width: 'auto',
							sort: false,
							css: 'subject-cell',
							click: function (obj, o, view) {
								//_$$.aprv.viewfun.opendocument(o, _opt);
								_$$.aprv.viewfun.opendocument(o, view);
							}
						},


						// 버전관리 시작 - 2024.09.05 by dwlee

						//버전
						vernum: {
							name: '_verno',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.version'), // 버전
							width: '60px',
							sort: true,
							css: 'auth-cell',
						},
						//작성일
						verdate: {
							name: '_verdate',
							type: 'date',
							title: $fn.getCodeMsg('aprv.title.versiondate'), // 작성일자
							width: '90px',
							sort: true,
							css: 'date-cell',
						},
						//작성자
						veruser: {
							name: '_veruser',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.versionuser'), // 작성자
							width: '70px',
							sort: true,
							css: 'auth-cell',
							content: function (obj) {
								return $fn.getCurLangMsg(obj['_veruser'])
							}
						},
						//양식명
						verform: {
							name: '_verform',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.versionform'), // 양식명
							width: '150px',
							sort: true,
							css: 'auth-cell',
							content: function (obj) {
								return $fn.getCurLangMsg(obj['_verform'])
							}
						},

						//변경사항
						verreason: {
							name: '_verreason',
							type: 'text',
							title: $fn.getCodeMsg('aprv.title.versionreason'), //변경내용
							width: 'auto',
							sort: false,
							css: 'subject-cell',
						},

						//직인종류
						sealkind: {
							name: '_sealkind',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.sealkind'), //변경내용
							width: '90px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								return (obj["_sealkind"] == "" ? $fn.getCodeMsg("aprv.title.sealn") : $fn.getCodeMsg("aprv.title.sealceo"))

							}
						},
						//직인사용승인
						sealstatus: {
							name: '_sealstatus',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.sealstatus'), //변경내용
							width: '90px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								var _val = (obj["_sealstatus"] == "N" ? $fn.getCodeMsg("aprv.title.aprwait") : $fn.getCodeMsg("aprv.title.aprcomplete"));
								var _color = (obj["_sealstatus"].substr(0, 1) == "N" ? "red" : obj["_sealstatus"].substr(0, 1) == "Y" ? "blue" : "");
								return "<span style='color:" + _color + "'>" + _val + "</span>";
							}
						},
						//시행문인쇄
						sealappr: {
							name: '_sealappr',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.sealappr'), //변경내용
							width: '90px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								var _val = (obj["_sealappr"] == "Y2" ? $fn.getCodeMsg("aprv.title.printcomplete") : "");
								var _color = (obj["_sealappr"].substr(0, 1) == "N" ? "red" : obj["_sealappr"].substr(0, 1) == "Y" ? "blue" : "");
								return "<span style='color:" + _color + "'>" + _val + "</span>";
							}
						},
						//승인일자
						sealdate: {
							name: '_sealdate',
							type: 'fnc',
							title: $fn.getCodeMsg('aprv.title.sealdate'), //변경내용
							width: '90px',
							sort: false,
							css: 'date-cell',
							content: function (obj) {
								_sdate = (obj.hasOwnProperty("_sealdate") && obj["_sealdate"] != "" ? $fn.formatDateTime(obj["_sealdate"], "dateonly") : "");
								return "<span>" + _sdate + "</span>"

							}

						},
						/*구분명*/
						reg_type_nm: {
							name: '_reg_type_nm',
							title: $fn.getCodeMsg('aprv.title.reg_type_nm'),
							width: '80px',
							sort: false,
							css: 'dwp-center',
						},
						/*처리*/
						cname: {
							name: '_cname',
							title: $fn.getCodeMsg('aprv.title.cname'),
							width: '80px',
							sort: false,
							css: 'dwp-center',
						},
						/*테스트*/
						tname: {
							name: '_tname',
							title: $fn.getCodeMsg('aprv.title.tname'),
							width: '80px',
							sort: false,
							css: 'dwp-center',
						},
						/*배포*/
						bname: {
							name: '_bname',
							title: $fn.getCodeMsg('aprv.title.bname'),
							width: '80px',
							sort: false,
							css: 'dwp-center',
						},
						/*보고서작성*/
						iswrite: {
							name: '_iswrite',
							title: $fn.getCodeMsg('aprv.title.iswrite'),
							width: '80px',
							sort: false,
							css: 'dwp-center',
							content: function (obj) {
								return (obj.hasOwnProperty("_iswrite") && obj["_iswrite"] != "" ? $fn.getCodeMsg("aprv.title.submit") : "");
							}
						},
						/*보고서확인자*/
						confirmname: {
							name: '_confirmname',
							title: $fn.getCodeMsg('aprv.title.confirmname'),
							width: '80px',
							sort: false,
							css: 'dwp-center',
						},
						importance: {
							name: '_importance'
							, type: 'fnc'
							, title: ""
							, width: '3%'
							, sort: false
							, css: 'imp-cell'
							, content: function (obj) {
								return (obj["_importance"] == "1" ? '<img class = "icon-file" src="' + $dwp.core.getPath("weblib") + '/images/common/icon-first.svg">' : '');
							}


						}

					},
					_hList = {
						//버전조회 - 2024.09.05 by dwlee
						wviwlistver: {
							sortnm: '_verdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isreply: false,
							css: 'dwp-aprv-list',
							colnm: [
								'vernum',
								'verdate',
								'veruser',
								'verform',
								'verreason'
							],
							search: []
							, click: function (element, o) {
								//console.log("element", element);
								//console.log("o", o);
								var _url = element.options.cdb + "/0/" + o["@unid"] + "?OpenDocument";
								$fn.layerOpenDocument({ content: { url: $fn.getProxyUrl(_url) } });
								//_$$.book01.linkOpen(element, o);
							}
						}
						//전달문서조회 - 2025.09.30 by wsjung
						, wviwlistfwd: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '',
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred',
								'attach',
								'dismenucate',
								'formtitle',
								'subject2',
								'author',
								'curuser',
								'startdate',
								'expiredate',
								'sstatus'
							],
							search: [
								/*
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
								*/
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						}
						, wviwlist01: { //임시보관문서
							sortnm: '_isstarred',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: { basedate: '_created' },
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'isstarred',
								'dismenucate',
								'formtitle',
								'subject',
								'sstatus',
								'created'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist04: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: { basedate: '_startdate' },
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'importance',
								'attach',
								'dismenucate',
								'formtitle',
								'subject2',
								'dept',
								'author',
								// 'authorcom',
								'startdate',
								'sstatus'
							],
							search: [
								/*	
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},
						/*
							by mjkim 20251111 보류추가					
						*/
						wviwlist12: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: { basedate: '_startdate' },
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'importance',
								'attach',
								'dismenucate',
								'formtitle',
								'subject2',
								'dept',
								'author',
								// 'authorcom',
								'startdate',
								'sstatus'
							],
							search: [
								/*	
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},


						wviwlist04_startdate_des: { //결재할 문서
							sortvw: 'wviwlist04',
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: { basedate: '_startdate' },
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'importance',
								'isstarred', //즐겨찾기 추가
								'attach',
								'dismenucate',
								'formtitle',
								'subject2',
								'dept',
								'author',
								// 'authorcom',
								'startdate',
								'sstatus'
							],
							search: [
								/*	
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},
						/*		
							20221103 mjkim 수신일, 접수일 표시
												wviwlist05: {
													sortnm: '_ssenddate',
													sortorder: 'descending',
													checkbox: true,
													formalias: 'wFrmApprove',
													isnew: '', //{basedate:'_startdate'}
													isreply: false,
													category: _cate,
													css: 'dwp-aprv-list',
													colnm: [
														'attach',
														'startdate',
														'scompletedate',
														'author',
														'authordept',
														'formtitle',
														'subject2',
														'sstatus'
													],
													search: [{
														title: $fn.getCodeMsg('comm.data.org_stype.0'),
														key: 'all'
													},
													{
														title: $fn.getCodeMsg('aprv.title.h010'),
														key: 'AuthorName'
													},
													{
														title: $fn.getCodeMsg('comm.title.subject'),
														key: 'Subject'
													},
													{
														title: $fn.getCodeMsg('aprv.title.h049'),
														key: 'Body'
													}
													] // 전체 , 제목
													//,click : function(){}
												},
												wviwlist06: {
													sortnm: '_sreceivedate',
													sortorder: 'descending',
													checkbox: false,
													formalias: 'wFrmApprove',
													isnew: '', //{basedate:'_startdate'}
													isreply: false,
													category: _cate,
													css: 'dwp-aprv-list',
													colnm: [
														'attach',
														'startdate',
														'scompletedate',
														'author',
														'authordept',
														'formtitle',
														'subject2',
														'sstatus'
													],
													search: [{
														title: $fn.getCodeMsg('comm.data.org_stype.0'),
														key: 'all'
													},
													{
														title: $fn.getCodeMsg('aprv.title.h010'),
														key: 'AuthorName'
													},
													{
														title: $fn.getCodeMsg('comm.title.subject'),
														key: 'Subject'
													},
													{
														title: $fn.getCodeMsg('aprv.title.h049'),
														key: 'Body'
													}
													] // 전체 , 제목
													//,click : function(){}
												},
						*/
						wviwlist05: { //접수할 문서
							sortnm: '_ssenddate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'ssenddate',
								'author',
								'authordept',
								'formtitle',
								'subject2',
								'sstatus'
							],
							search: [
								/*
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist06: { //접수문서
							sortnm: '_sreceivedate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'sreceivedate',
								'author',
								'authordept',
								'formtitle',
								'subject2',
								'sstatus'
							],
							search: [
								/*
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist07: { //진행문서
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,			//결재문서 즐겨찾기 추가 - 2024.03.06 by jwelee
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee							
								'attach',
								'dismenucate',
								'formtitle',
								'subject2',
								'author',
								// 'authorcom',
								'curuser',
								'startdate',
								'sstatus'
							],
							search: [
								/*
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
								*/
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						},
						wviwlist08: { //반려문서
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,			//결재문서 즐겨찾기 추가 - 2024.03.06 by jwelee
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee									
								'attach',
								'startdate',
								'scompletedate',
								'formtitle',
								'author',
								'subject2',
								// 'authorcom',
								'lastaprname',
								'sstatus'
							],
							search: [
								/*
								{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							*/
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						},
						wviwlist09: { //지연문서
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,			//결재문서 즐겨찾기 추가 - 2024.03.06 by jwelee
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee										
								'attach',
								'dismenucate',
								'subject2',
								'author',
								// 'authorcom',
								'curuser',
								'startdate',
								'sstatus'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						},
						wviwlist10: { //결재 예정문서
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,			//결재문서 즐겨찾기 추가 - 2024.03.06 by jwelee
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee										
								'attach',
								'dismenucate',
								'subject2',
								'author',
								// 'authorcom',
								'curuser',
								'startdate',
								'sstatus'
							],
							search: [
								/*
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
								*/
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						},
						wviwlist11: {//사용안함
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'dismenucate',
								'formtitle',
								'subject2',
								'author',
								'curuser',
								'startdate',
								'sstatus'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						},
						wviwlist20: {//사용안함
							sortnm: '_created',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: { basedate: '_created' },
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: ['attach', 'dismenucate', 'subject', 'sstatus', 'created'],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist21: {//사용안함
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								//'dismenucate',
								//'formtitle',
								'author',
								'authordept',
								'draftdate',
								'paydocno',
								'payjcode',
								'paysubject',
								'jsumamount'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.paysubject'),
								key: 'Subject'
							}
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						},
						wviwlist22: {//사용안함
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								//'dismenucate',
								//'formtitle',
								'author',
								'authordept',
								'draftdate',
								'paydocno',
								'payjcode',
								'paysubject',
								'jsumamount'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.paysubject'),
								key: 'Subject'
							}
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						},
						wviwlist30: { //나의 완료문서
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach',
								'startdate',
								'scompletedate',
								'formtitle',
								/*
									by mjkim 20241230	발신 정보 변경경	
																	'author',					
								*/

								'reqauthor',
								// 'authorcom',
								'subject2',
								/*
									by mjkim 20241230	발신 정보 변경경	
																	'docnumber',					
								*/
								'reqdocnumber',
								'sstatus'
							],
							search: [

								/* 상세검색 사용시에는 일반 검색 disable 처리해주는게 맞는듯 - 2021.12.06 by dwlee
															{
																title: $fn.getCodeMsg('comm.data.org_stype.0'),
																key: 'all'
															},
															{
																title: $fn.getCodeMsg('aprv.title.h010'),
																key: 'AuthorName'
															},
															{
																title: $fn.getCodeMsg('comm.title.subject'),
																key: 'Subject'
															},
															{
																title: $fn.getCodeMsg('aprv.title.h049'),
																key: 'Body'
															}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist51: { //전표처리
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach',
								'startdate',
								'scompletedate',
								'formtitle',
								/*
									by mjkim 20241230	발신 정보 변경경	
																	'author',					
								*/

								'reqauthor',
								// 'authorcom',
								'subject2',
								/*
									by mjkim 20241230	발신 정보 변경경	
																	'docnumber',					
								*/
								'reqdocnumber',
								'sstatus'
							],
							search: [

								/* 상세검색 사용시에는 일반 검색 disable 처리해주는게 맞는듯 - 2021.12.06 by dwlee
															{
																title: $fn.getCodeMsg('comm.data.org_stype.0'),
																key: 'all'
															},
															{
																title: $fn.getCodeMsg('aprv.title.h010'),
																key: 'AuthorName'
															},
															{
																title: $fn.getCodeMsg('comm.title.subject'),
																key: 'Subject'
															},
															{
																title: $fn.getCodeMsg('aprv.title.h049'),
																key: 'Body'
															}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist52: { //전표미처리
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach',
								'startdate',
								'scompletedate',
								'formtitle',
								/*
									by mjkim 20241230	발신 정보 변경경	
																	'author',					
								*/

								'reqauthor',
								// 'authorcom',
								'subject2',
								/*
									by mjkim 20241230	발신 정보 변경경	
																	'docnumber',					
								*/
								'reqdocnumber',
								'sstatus'
							],
							search: [

								/* 상세검색 사용시에는 일반 검색 disable 처리해주는게 맞는듯 - 2021.12.06 by dwlee
															{
																title: $fn.getCodeMsg('comm.data.org_stype.0'),
																key: 'all'
															},
															{
																title: $fn.getCodeMsg('aprv.title.h010'),
																key: 'AuthorName'
															},
															{
																title: $fn.getCodeMsg('comm.title.subject'),
																key: 'Subject'
															},
															{
																title: $fn.getCodeMsg('aprv.title.h049'),
																key: 'Body'
															}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},

						wviwenforce: { //대내(외)시행함
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach',
								'scompletedate',
								'author',
								// 'authorcom',
								'subject2',
								'docnumber',
								'sealkind',
								'sealstatus',
								'sealappr'
							],
							search: [
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
							] // 전체 , 제목
							//,click : function(){}
						},

						wviwcert: { //재직(경력)증명서함
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach',
								'scompletedate',
								'author',
								// 'authorcom',
								'subject2',
								'docnumber',
								'sealkind',
								'sealstatus',
								'sealdate'
							],
							search: [

								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}
							] // 전체 , 제목
							//,click : function(){}
						},

						wviwlist36: { //업무의뢰서
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach',
								'scompletedate',
								'author',
								'reg_type_nm',
								'docnumber',
								'subject2',
								'cname',
								'tname',
								'bname'
							],
							search: [
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}

							] // 전체 , 제목
							//,click : function(){}
						},

						wviwlist37: { //권한요청서
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach',
								'scompletedate',
								'author',
								'reg_type_nm',
								'docnumber',
								'subject2',
								'cname',
								'tname',
								'bname'
							],
							search: [
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}

							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist38: { //교육훈련신청서
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach',
								'scompletedate',
								'author',
								'docnumber',
								'subject2',
								'iswrite',
								'confirmname',
							],
							search: [
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}

							] // 전체 , 제목
							//,click : function(){}
						},

						wviwlist710: { // IT처리요청서           - 20250902 by wsjung
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가   - 2024.03.06 by jwelee     
								'attach',
								'startdate',
								'scompletedate',
								'formtitle',
								'reqauthor',
								'subject2',
								'reqdocnumber',
								'sstatus'
							],
							search: [
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}

							] // 전체 , 제목
							//,click : function(){}
						},

						wviwlist777: { // ACCESSRIGHT 처리요청서         - 20250909 by wsjung
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가   - 2024.03.06 by jwelee     
								'attach',
								'startdate',
								'scompletedate',
								'formtitle',
								'reqauthor',
								'subject2',
								'reqdocnumber',
								'sstatus'
							],
							search: [
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}

							] // 전체 , 제목
							//,click : function(){}
						},

						wviwlist777hr: { // ACCESSRIGHT 처리요청서         - 20250909 by wsjung
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred', //즐겨찾기 추가   - 2024.03.06 by jwelee     
								'attach',
								'startdate',
								'scompletedate',
								'formtitle',
								'reqauthor',
								'subject2',
								'reqdocnumber',
								'sstatus'
							],
							search: [
								{
									title: $fn.getCodeMsg('comm.data.org_stype.0'),
									key: 'all'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h010'),
									key: 'AuthorName'
								},
								{
									title: $fn.getCodeMsg('comm.title.subject'),
									key: 'Subject'
								},
								{
									title: $fn.getCodeMsg('aprv.title.h049'),
									key: 'Body'
								}

							] // 전체 , 제목
							//,click : function(){}
						},

						wviwlist30_s: { //나의 완료문서
							sortnm: 'sStartDate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'isstarred_s', //즐겨찾기 추가	 - 2024.03.06 by jwelee		
								'attach_s',
								'startdate_s',
								'scompletedate_s',
								'formtitle_s',
								'author_s',
								// 'authorcom',
								'subject2_s',
								'docnumber_s',
								'sstatus_s'
							],
							search: [

								/* 상세검색 사용시에는 일반 검색 disable 처리해주는게 맞는듯 - 2021.12.06 by dwlee
															{
																title: $fn.getCodeMsg('comm.data.org_stype.0'),
																key: 'all'
															},
															{
																title: $fn.getCodeMsg('aprv.title.h010'),
																key: 'AuthorName'
															},
															{
																title: $fn.getCodeMsg('comm.title.subject'),
																key: 'Subject'
															},
															{
																title: $fn.getCodeMsg('aprv.title.h049'),
																key: 'Body'
															}
								*/
							] // 전체 , 제목
							//,click : function(){}
						},

						//근태 관련 양식 - 2022.11.24 by dwlee
						wviwlistwork30: {
							sortnm: '_scompletedate',				//테스트중 - 2022.11.22 by dwlee
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'scompletedate',						//startdate 와 위치 이동 - 2022.11.22 by dwlee
								'startdate',
								'subject2',								//formtitle와 위치 이동 - 2022.11.22 by dwlee
								'dept',
								'author',
								// 'authorcom',
								'formtitle',
								//'docnumber',
								'sstatus',
								'migdata'
							]
						},

						//발신 대기함 - 2023.02.16	
						wviwlist88: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate'
							],
							search: [] // 전체 , 제목
							//,click : function(){}
						},

						//수신 대기함 - 2023.02.16	
						wviwlist89: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate'
							],
							search: [] // 전체 , 제목
							//,click : function(){}
						},

						//외부공문 접수 대기함 - 2023.05.16	
						wviwlist134: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'sstatus',
								'scompletedate'
							],
							search: [] // 전체 , 제목
							//,click : function(){}
						},

						//외부공문 공람할 문서 - 2023.05.16
						wviwlist135: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'sstatus',
								'scompletedate'
							],
							search: [] // 전체 , 제목
							//,click : function(){}
						},

						//외부공문 공람진행함 대기함 - 2023.05.16	
						wviwlist136: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'sstatus',
								'scompletedate'
							],
							search: [] // 전체 , 제목
							//,click : function(){}
						},

						//외부공문 발송완료함 - 2023.05.16
						wviwlist137: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'sstatus',
								'scompletedate'
							],
							search: [] // 전체 , 제목
							//,click : function(){}
						},

						//외부공문 수신완료함 - 2023.05.16
						wviwlist138: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'sstatus',
								'scompletedate'
							],
							search: [] // 전체 , 제목
							//,click : function(){}
						},

						wviwlist32d: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								/*
									by mjkim 20241231 reqauthor 변경
																'author',
								*/
								'reqauthor',
								'subject2',
								/*
									by mjkim 20241231 reqdocnumber 변경
								
																'docnumber',
								*/
								'reqdocnumber',
								'startdate',
								'scompletedate'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},

							{
								title: $fn.getCodeMsg('aprv.title.h006'), //문서번호 검색 추가 - 2024.12.30 by dwlee
								key: 'DocNo'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},

						//신청서 가져오기 - 2024.12.31 by dwlee
						wviwlist33d: {		// 신청서 가져오기
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '',
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: ['attach', 'author', 'subject2', 'docnumber', 'startdate', 'scompletedate'],
							search: [
								//20250327 휴가취소신청서는 본인것만 보이게 수정
								{ key: 'all', title: $fn.getCodeMsg('comm.data.org_stype.0'/*전체*/) },
								{ key: 'AuthorName', title: $fn.getCodeMsg('aprv.title.h010'/*기안자*/) },
								{ key: 'Subject', title: $fn.getCodeMsg('comm.title.subject'/*제목*/) },
								{ key: 'DocNo', title: $fn.getCodeMsg('문서번호') },
								{ key: 'AuthorName', title: $fn.getCodeMsg('aprv.title.h010'/*기안자*/) }
							]
						},

						//신청서 가져오기 - 2024.12.31 by dwlee
						//출장신청서 - 2025.01.16 by dwlee
						wviwlist34d: {		// 신청서 가져오기
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '',
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: ['attach', 'author', 'subject2', 'docnumber', 'startdate', 'scompletedate'],
							search: [
								{ key: 'all', title: $fn.getCodeMsg('comm.data.org_stype.0'/*전체*/) },
								{ key: 'AuthorName', title: $fn.getCodeMsg('aprv.title.h010'/*기안자*/) },
								{ key: 'Subject', title: $fn.getCodeMsg('comm.title.subject'/*제목*/) },
								{ key: 'Body', title: $fn.getCodeMsg('aprv.title.h049'/*본문*/) }
							]
						},

						wviwlist35: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'dismenucate',
								'formtitle',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist30d: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist40: {
							sortnm: '_scompletedate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'lastaprname',
								'authordept',
								'subject2',
								'noticedate'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h085'),
								key: 'lastaprname'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist40_zh: {
							sortnm: '_scompletedate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'lastaprname',
								'authordept',
								'subject2',
								'noticedate'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h085'),
								key: 'lastaprname'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist50: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								// 'authorcom',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate'
							],
							search: [
								/*
							{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							*/
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist60: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'sstatus',
								'scompletedate',
								'subject2',
								'author',
								'startdate',
								'lastcomment'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist70: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'dismenucate',
								'subject2',
								'author',
								'curuser',
								'startdate',
								'sstatus'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 기안자  , 제목 , 본문
							//,click : function(){}
						},
						wviwlist71: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'author',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist80: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							css: 'dwp-aprv-list',
							//,category : _cate
							colnm: [
								'attach',
								'author',
								'authordept',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist90: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							css: 'dwp-aprv-list',
							//,category : _cate
							colnm: [
								'attach',
								'author',
								'authordept',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist31: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'dismenucate',
								'formtitle',
								'author',
								// 'authorcom',
								'subject2',
								'docnumber',
								'startdate',
								'scompletedate',
								'sstatus'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist110: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'writegubn',
								'startdate',
								'paydocno',
								'author',
								'authordept',
								'subject3',
								'jsumamount'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist120: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: true,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'writegubn',
								'startdate',
								'paydocno',
								'author',
								'authordept',
								'subject3',
								'jsumamount'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist210: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'paydate_1', //회계일자
								'paydocno_1', //증빙번호
								'startdate',
								'paydocno',
								'author',
								'authordept',
								'subject3',
								'jsumamount'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},
						wviwlist220: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_scompletedate'}
							isreply: false,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'paydate_1', //회계일자
								'paydocno_1', //증빙번호
								'startdate',
								'paydocno',
								'author',
								'authordept',
								'subject3',
								'jsumamount'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}
							] // 전체 , 제목
							//,click : function(){}
						},

						//ERP 연동로그 - 2024.11.08 by dwlee
						wviwlisterp: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'formtitle',
								'subject2',
								'author',
								'startdate',
								'erp_draft',
								'erp_delete',
								'erp_ing',
								'erp_done',
								'erp_reject',
								'sstatus',
								'erp_status'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}]
						},

						//휴가 출장 ERP 연동로그 - 2025.02.10 by mjkim
						wviwlistgw: {
							sortnm: '_startdate',
							sortorder: 'descending',
							checkbox: false,
							formalias: 'wFrmApprove',
							isnew: '', //{basedate:'_startdate'}
							isreply: false,
							category: _cate,
							css: 'dwp-aprv-list',
							colnm: [
								'attach',
								'formtitle',
								'subject2',
								'author',
								'startdate',
								'erp_draft_gw',
								'erp_delete',
								'erp_ing',
								'erp_done',
								'erp_reject',
								'sstatus',
								'erp_status_gw'
							],
							search: [{
								title: $fn.getCodeMsg('comm.data.org_stype.0'),
								key: 'all'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h010'),
								key: 'AuthorName'
							},
							{
								title: $fn.getCodeMsg('comm.title.subject'),
								key: 'Subject'
							},
							{
								title: $fn.getCodeMsg('aprv.title.h049'),
								key: 'Body'
							}]
						}
					};

				var _viewalias = _opt.viewalias + (_opt.isbookmark ? 'd' : '');
				_hList[_viewalias].col = $dwp.core.util.exObjList(
					_col,
					_hList[_viewalias].colnm
				);
				return _hList[_viewalias];
			},

			//호환용 포멧이 아닌 엑셀 파일로 저장 - 222.12.12 by dwlee
			//선택된 문서만 다운로드 가능 - 2025.12.01 by wsjung
			exceldownload_view: function (opt) {
				var _me = opt.viewInstance,
					_opt = $.extend({ filenm: "", title: "", excelkeyword: "", count: 500 }, opt),
					_template = "",
					_header = _me.options.header,
					_columncnt = _header.colnm.length,
					_excelbody = [], //엑셀 본문용 배열
					_looparr = [], //deffered 에서 값을 넣을 변수
					_total = parseInt(_me.options.total),
					_colNms = _header.colnm,
					_cols = _header.col;

				if (_opt.title == "") _opt.title = _opt.viewalias + "Excel";
				if (_opt.filenm == "") {
					var _timeidx = Date.now();
					_opt.filenm = _opt.viewalias + "_" + _timeidx + ".xlsx";
				}
				if (_opt.excelkeyword == "") _opt.excelkeyword = _opt.applcode;

				if (_header.hasOwnProperty("excel_colnm")) {
					_colNms = _header.excel_colnm;
					_cols = _header.excel_col;
					_columncnt = _header.excel_colnm.length;
				}

				function _s2ab(s) {
					var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
					var view = new Uint8Array(buf); //create uint8array as viewer
					for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
					return buf;
				}

				function _initTitle() {
					var _headarr = [];
					$.each(_colNms, function (i, v) {
						var _cell = _cols[v];
						if (typeof _cell == "undefined") return true;
						if (_cell.type == "thumbbtn") return true;
						_headarr.push(_cell.title);
					});
					_excelbody.push(_headarr);
				}

				function _jsonGetParmData(page) {
					var _data = {},
						_url = _me.options.cdb + "/api/data/collections/name/" + _me.options.viewalias,
						_folderunid = _me.options.folderunid || "";

					if (_folderunid != "") {
						_url = _me.options.cdb + "/api/data/collections/unid/" + _me.options.folderunid;
					}

					_url += "?ps=" + _opt.count;
					_url += "&page=" + page;

					if (typeof _me.options.sortnm != "undefined" && _me.options.sortnm != "") {
						_data.sortcolumn = _me.options.sortnm;
					}
					if (typeof _me.options.sortorder != "undefined" && _me.options.sortorder != "") {
						_data.sortorder = _me.options.sortorder;
					}
					if (_me.options.single != "" && !_me.options.searchview) {
						_data.category = _me.options.single;
					}
					if (_me.options.searchview) {
						_data.search = _me.options.searchqry;
					}
					if (_me.options.entrycount != "" && !_me.options.searchview) {
						_data.entrycount = "true";
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
						_v = $.isArray(o[cell.name]) ? o[cell.name][0] : o[cell.name];

					//if (cell.type == "date") {
					//2024.03.18 by dwlee
					if (cell.type == "date" || cell.type == "daterange") {
						_h = $dwp.core.util.formatDateTime(_v, "dateonly");
					} else if (cell.type == "fnc" && typeof cell.content == "function") {
						//html 태그 제거 - 2022.10.12 by dwlee
						var _html = cell.content(o);
						if (_html.indexOf("<") > -1 && _html.indexOf(">") > 0) {
							_h = $(_html).text();
						} else {
							_h = _html;
						}
					} else if (cell.type == "code" && cell.hasOwnProperty("langcode")) {
						_h = $dwp.core.lang.getCodeObjMsg(cell.langcode, _v);
					} else {
						_h = $dwp.core.lang.getCurMsg(_v);
					}
					return _h;
				}

				function _drawBody() {
					var _loopcnt = 0, //페이지 갯수 구하기
						_deferreds = [];
					if (parseInt(_total % _opt.count) > 0) {
						_loopcnt = parseInt(_total / _opt.count) + 1;
					} else {
						_loopcnt = parseInt(_total / _opt.count);
					}

					if (opt.checked.length > 0) {
						_loopcnt = 1;
						var jsonData = opt.checked;
						var _pos = 0;
						var _index = 0;
						var _ptrs = [];

						$.each(jsonData, function (j, o) {
							if (o["@unid"] == "") return true;
							var _tr = [];
							$.each(_colNms, function (k, v) {
								var _$cell = null,
									_cell = _cols[v];
								if (typeof _cell == "undefined") return true;
								if (_cell.name == "_thumb") return true;
								//첨부 이미지는 제외 - 2022.10.12 by dwlee
								if (_cell.name == "_attach") {
									_tr.push("");
								} else {
									_tr.push(_convertData(_cell, o));
								}
							});
							if (_tr.length > 0) {
								_ptrs.push(_tr);
							}
						});
						_looparr[_index] = _ptrs;
						_deferreds.push(
							_looparr[_index]
						);
					} else {
						for (var i = 0; i < _loopcnt; i++) {
							_looparr.push("");
							_deferreds.push(
								$dwp.core.util
									.xAjax(_jsonGetParmData(i))
									.done(function (jsonData, textStatus, jqXHR) {
										console.log("jqXHR : ", jqXHR);
										var _pos = $dwp.core.util.getDataRange(jqXHR, "start");
										var _index = parseInt(_pos) / _opt.count; //배열의 Index 구하기
										var _ptrs = [];
										$.each(jsonData, function (j, o) {
											if (o["@unid"] == "") return true;
											var _tr = [];
											$.each(_colNms, function (k, v) {
												var _$cell = null,
													_cell = _cols[v];
												if (typeof _cell == "undefined") return true;
												if (_cell.name == "_thumb") return true;
												//첨부 이미지는 제외 - 2022.10.12 by dwlee
												if (_cell.name == "_attach") {
													_tr.push("");
												} else {
													_tr.push(_convertData(_cell, o));
												}
											});
											if (_tr.length > 0) {
												_ptrs.push(_tr);
											}
										});
										_looparr[_index] = _ptrs;
									})
									.fail(function () {
										console.log("error");
									})
							);
						}
					}

					$.when.apply($, _deferreds).always(function () {
						//	console.log("_looparr.length : " , _looparr.length);
						$.each(_looparr, function (idx, _trs) {
							if (Array.isArray(_trs)) {
								$.each(_trs, function (idx, _tr) {
									_excelbody.push(_tr);
								});
							}
						});

						console.log("_excelbody", _excelbody)

						var _ws = XLSX.utils.aoa_to_sheet(_excelbody); // Sheet 테이터 생성
						var _wb = XLSX.utils.book_new(); // workbook 생성
						_wb.Props = {
							// 파일 속성정의
							Title: _opt.title,
							Subject: _opt.title,
							Author: $fn.getCurLangMsg($fn.getCurUser().pinfo.name),
							Manager: $fn.getCurLangMsg($fn.getCurUser().pinfo.name),
							Company: $fn.getCurLangMsg($fn.getCurUser().pinfo.comname),
							Category: "",
							Keywords: _opt.excelkeyword,
							Comments: "",
							LastAuthor: $fn.getCurLangMsg($fn.getCurUser().pinfo.name),
							CreatedDate: new Date()
						};
						_wb.SheetNames.push(_opt.title); // Sheet 생성 (Sheet 명)
						_wb.Sheets[_opt.title] = _ws; // Sheet 에 데이터 넣기
						var _wbout = XLSX.write(_wb, { bookType: "xlsx", type: "binary" });
						saveAs(new Blob([_s2ab(_wbout)], { type: "application/octet-stream" }), _opt.filenm); // 파일명

						$fn.unblock();
					});
				}

				if (_me.options.total > 0) {
					$fn.block(undefined, { notusemsg: _me.options.ismobile });
					_initTitle();
					_drawBody();
				} else {
					$fn.alert({ msg: $fn.getCodeMsg("문서가 없습니다.") });
					return true;
				}
			},

			// View에 즐겨찾기 업데이트 - 2024.03.06 by jwlee
			_updatebookmarklist: function (event, view) {

				//console.log("bookmark - 1");
				/*
					by mjkim 20241108 view 객체가 없는 경우 발생 
				*/
				if (typeof view == "undefined") return;


				var _rows = $("[data-key-unid]", view.element);			// 문서가 없으면 SKIP
				if ($(_rows).size() == 0) return;

				//console.log("bookmark - 2");

				var _bookmarkcell = $(".bookmark-cell", _rows[0]);				// 즐겨찾기 컬럼이 없으면 SKIP
				if ($(_bookmarkcell).size() == 0) return true;

				//console.log("bookmark - 3");

				var _dockeys = [];
				$.each(_rows, function (i, v) {
					var _d = $(v).data($dwp.core.view._ROW_DATA);

					//console.log(_d);

					if (_d.hasOwnProperty("_dockey")) _dockeys.push(_d["_dockey"]);

					//통합검색 색인 사용시 - 2024.05.09 by dwlee
					if (_d.hasOwnProperty("dockey")) _dockeys.push(_d["dockey"]);

				});
				if ($(_dockeys).size() == 0) return true;			// DocKey가 없으면 SKIP

				//console.log("bookmark - 4");

				_$$.aprv.com.getBookmark(_dockeys, function (_ret) {
					$.each(_ret.list, function (i, v) {
						$("[data-doc-key='" + v + "']").addClass("active");
					});
				});
			}
		},
	};
})($dwp.cns('app'), jQuery);






