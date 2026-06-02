/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 비서실주간/월간 보고 -부서별
 * $dwp.app.aprv_sub226
 */

(function (_$$, $) {
    _$$.aprv_sub226 = {
        subdoc: {
            SUBNAME: "sub226"
            , init: function ($doc) {
                var _me = _$$.aprv_sub226.subdoc, opt = $doc.options;
                var el = $doc.element;

                var _info1 = $dwp.cns("core.info");
                var vdocname = _info1.cuser.pinfo.name;

                var date = new Date();
                var year = date.getFullYear();
                var month = new String(date.getMonth() + 1);
                var day = new String(date.getDate());

                // 한자리수일 경우 0을 채워준다. 
                if (month.length == 1) { month = "0" + month; }
                if (day.length == 1) { day = "0" + day; }
                $('[name=ed_formtype] option:first').remove(); // 첫 번째 옵션 삭제

                if (opt.isnew) {
                    $("[name=Subject]", $doc.element).val($('[name=ed_formtype]', $doc.element).val() + "( " + year + "-" + month + "-" + day + " ) - " +$fn.getCurLangMsg($('[name=ed_kind] option:selected', $doc.element).text(), ",", "ko"));
                    //문서로딩시 전략기획 먼저
                    $("[name=strategy]", el).show();
                    var option = $("<option value=선택>선택</option>");
                    $('select[name=WandM]', el).append(option);
                }

                //선택된 주간 월간값 문서 로딩시 세팅하기                
                setTimeout(function () {
                    if ($('[name=vWangText]', $doc.element).val() != "") {
                        $('select[name=WandM]', el).val($('[name=vWangText]', $doc.element).val())
                    }
                }, 500); // 2000 밀리초 = 2초

                console.log($('[name=ed_formtype]', $doc.element).val());

                //문서 로딩시 주간 월간에 따라 주간 월간 정보 넣기
                $('select[name=WandM]', el).empty();
                if ($('[name=ed_formtype]', $doc.element).val().indexOf("주간") > -1) {                    
                    var option = $("<option value=선택>선택</option>");
                    $('select[name=WandM]', el).append(option);
                    var currentYear = new Date().getFullYear();
                    var cnt=""
                    if(currentYear == "2025"){
                        cnt=54
                    }else{
                        cnt=53
                    }

                    for (var i = 1; i < cnt; i++) {
                        var optionLabel = i + "주차";
                        var optionValue = i + "_주";
                        var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                        $('select[name=WandM]', el).append(option);
                    }
                } else {                   
                    var option = $("<option value=선택>선택</option>");
                    $('select[name=WandM]', el).append(option);
                    for (var i = 1; i < 13; i++) {
                        var optionLabel = i + "월";
                        var optionValue = i + "_월";
                        var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                        $('select[name=WandM]', el).append(option);
                    }
                }



                //주간 월간 변경시 주 월 변경
                $('[name=ed_formtype]', $doc.element).change(function () {

                    $("[name=Subject]", $doc.element).val($('[name=ed_formtype]', $doc.element).val() + "( " + year + "-" + month + "-" + day + " ) - "+$fn.getCurLangMsg($('[name=ed_kind] option:selected', $doc.element).text(), ",", "ko"))
                    var option = $("<option value=선택>선택</option>");
                    $('select[name=WandM]', el).append(option);
                    //제목이 주간이면 52주 넣고 월간 이면 1~ 12 넣기  

                    if ($('[name=ed_formtype]', $doc.element).val().indexOf("주간") > -1) {
                        $('select[name=WandM]', el).empty();
                        var option = $("<option value=선택>선택</option>");
                        $('select[name=WandM]', el).append(option);
                        var currentYear = new Date().getFullYear();
                        var cnt=""
                        if(currentYear == "2025"){
                            cnt=54
                        }else{
                            cnt=53
                        }
                        for (var i = 1; i < cnt; i++) {
                            var optionLabel = i + "주차";
                            var optionValue = i + "_주";
                            var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                            $('select[name=WandM]', el).append(option);
                        }
                    } else {
                        $('select[name=WandM]', el).empty();
                        var option = $("<option value=선택>선택</option>");
                        $('select[name=WandM]', el).append(option);
                        for (var i = 1; i < 13; i++) {
                            var optionLabel = i + "월";
                            var optionValue = i + "_월";
                            var option = $("<option value=" + optionValue + ">" + optionLabel + "</option>");
                            $('select[name=WandM]', el).append(option);
                        }

                    }


                    //변경시 계획실적초기화 
                    $("[name=Performance]", $doc.element).val("");
                    $("[name=plan]", $doc.element).val("")

                });

                

                //주차 월 정보 변경시 실적 계획에 넣기 
                $('[name=WandM]', $doc.element).change(function () {
                    var currentYear = new Date().getFullYear();
                    var currentYear = new Date().getFullYear(); // 현재 년도
                    var firstDayOfYear = new Date(currentYear, 0, 1); // 1월 1일
                    var lastDayOfYear = new Date(currentYear, 11, 31); // 12월 31일
                
                    // 주 수 계산
                    var weeksInYear = Math.ceil((lastDayOfYear - firstDayOfYear) / (1000 * 60 * 60 * 24 * 7));
                   
                    if(currentYear == "2025"){
                        weeksInYear="53"
                    }else{
                        weeksInYear="52"
                    }

                    if ($('select[name=WandM]', el).val() != "선택") {
                        $("[name=Performance]", $doc.element).val($('select[name=WandM] option:selected', el).text());
                        var WnMarray = $('select[name=WandM] option:selected', el).val().split("_");
                        var dayinfo = parseInt(WnMarray[0]) + 1
                        var car=""
                        if(WnMarray[1] == "주"){
                            car="차"
                        }
                        if (WnMarray[1] == "월" && dayinfo == "13") {
                            dayinfo = 1
                            
                        } else if (WnMarray[1] == "주" && $('select[name=WandM] option:selected',el).val() == weeksInYear+"_주") {
                            dayinfo = 1
                            
                        }

                        dayinfo = dayinfo.toString() + WnMarray[1]+car
                        
                        $("[name=plan]", $doc.element).val(dayinfo)
                    }
                });


                //부서별로 테이블 행 노출 하기 
                $('[name=ed_kind]', $doc.element).change(function () {
                    if ($('select[name=ed_kind] option:selected', el).val() == "002") { // 전산
                        $("[name=it_con]", el).show();
                    } else {
                        $("[name=it_con]", el).hide();
                    }
                    if ($('select[name=ed_kind] option:selected', el).val() == "001") { // 전략기획
                        $("[name=strategy]", el).show();
                    } else {
                        $("[name=strategy]", el).hide();
                    }
                    if ($('select[name=ed_kind] option:selected', el).val() == "003") { // 홍보
                        $("[name=promotion]", el).show();
                    } else {
                        $("[name=promotion]", el).hide();
                    }
                    if ($('select[name=ed_kind] option:selected', el).val() == "004") { // 재무
                        $("[name=money]", el).show();
                    } else {
                        $("[name=money]", el).hide();
                    }
                    if ($('select[name=ed_kind] option:selected', el).val() == "005") { // fa
                        $("[name=fa]", el).show();
                    } else {
                        $("[name=fa]", el).hide();
                    }
                    if ($('select[name=ed_kind] option:selected', el).val() == "006") { // 산업
                        $("[name=safe]", el).show();
                    } else {
                        $("[name=safe]", el).hide();
                    }
                    if ($('select[name=ed_kind] option:selected', el).val() == "007") { // bk
                        $("[name=bk]", el).show();
                    } else {
                        $("[name=bk]", el).hide();
                    }
                    $("[name=Subject]", $doc.element).val($('[name=ed_formtype]', $doc.element).val() + "( " + year + "-" + month + "-" + day + " ) - "+$fn.getCurLangMsg($('[name=ed_kind] option:selected', $doc.element).text(), ",", "ko"))
                });

                //blur시 작은따옴표 문자 변경 인서트시 에러 방지 전산
                for (var i = 1; i < 3; i++) {
                    $("[name='conten_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 2; j++) {
                            let r_3 = $("[name='conten_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='conten_" + j + "']", el).val(r_3);
                        }
                    });
                }
                for (var i = 1; i < 3; i++) {
                    $("[name='contenP_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 2; j++) {
                            let r_3 = $("[name='contenP_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='contenP_" + j + "']", el).val(r_3);
                        }
                    });
                }
                //전략
                for (var i = 1; i < 8; i++) {
                    $("[name='strate_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 7; j++) {
                            let r_3 = $("[name='strate_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='strate_" + j + "']", el).val(r_3);
                        }
                    });
                }
                for (var i = 1; i < 8; i++) {
                    $("[name='strateP_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 7; j++) {
                            let r_3 = $("[name='strateP_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='strateP_" + j + "']", el).val(r_3);
                        }
                    });
                }
                //홍보
                for (var i = 1; i < 6; i++) {
                    $("[name='promo_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 6; j++) {
                            let r_3 = $("[name='promo_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='promo_" + j + "']", el).val(r_3);
                        }
                    });
                }
                for (var i = 1; i < 6; i++) {
                    $("[name='promoP_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 6; j++) {
                            let r_3 = $("[name='promoP_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='promoP_" + j + "']", el).val(r_3);
                        }
                    });
                }
                //재무
                for (var i = 1; i < 5; i++) {
                    $("[name='money_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 4; j++) {
                            let r_3 = $("[name='money_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='money_" + j + "']", el).val(r_3);
                        }
                    });
                }
                for (var i = 1; i < 5; i++) {
                    $("[name='moneyP_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 4; j++) {
                            let r_3 = $("[name='moneyP_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='moneyP_" + j + "']", el).val(r_3);
                        }
                    });
                }
                //FA
                for (var i = 1; i < 7; i++) {
                    $("[name='fa_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 6; j++) {
                            let r_3 = $("[name='fa_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='fa_" + j + "']", el).val(r_3);
                        }
                    });
                }
                for (var i = 1; i < 7; i++) {
                    $("[name='faP_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 6; j++) {
                            let r_3 = $("[name='faP_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='faP_" + j + "']", el).val(r_3);
                        }
                    });
                }
                //환경
                for (var i = 1; i < 4; i++) {
                    $("[name='safe_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 3; j++) {
                            let r_3 = $("[name='safe_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='safe_" + j + "']", el).val(r_3);
                        }
                    });
                }
                for (var i = 1; i < 4; i++) {
                    $("[name='safeP_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 3; j++) {
                            let r_3 = $("[name='safeP_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='safeP_" + j + "']", el).val(r_3);
                        }
                    });
                }
                //bk
                for (var i = 1; i < 4; i++) {
                    $("[name='bk_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 3; j++) {
                            let r_3 = $("[name='bk_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='bk_" + j + "']", el).val(r_3);
                        }
                    });
                }
                for (var i = 1; i < 4; i++) {
                    $("[name='bkP_" + i + "']", el).bind("blur", function () {
                        for (let j = 1; j <= 3; j++) {
                            let r_3 = $("[name='bkP_" + j + "']", el).val();
                            r_3 = r_3.replaceAll("'", "‘");
                            $("[name='bkP_" + j + "']", el).val(r_3);
                        }
                    });
                }





            }



            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                var _me = _$$.aprv_sub226.subdoc;
                var el = $doc.element;
                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);

                if ($("input[name='Performance']", $doc.elelment).xval() == "") {
                    $fn.alert({ msg: $fn.getCodeMsg("실적 주차/월 정보가 없습니다.") });
                    return false;
                }
                if ($("input[name='plan']", $doc.elelment).xval() == "") {
                    $fn.alert({ msg: $fn.getCodeMsg("계획 주차/월 정보가 없습니다.") });
                    return false;
                }

                console.log($('[name=WandM] option:selected', el).val())
                $('[name=WandText]', el).val($('[name=WandM] option:selected', el).val())


                return true;
            }
        }
    }
}($dwp.cns("app"), jQuery));







