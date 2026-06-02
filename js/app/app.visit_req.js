/* ================================================================
   삼현 방문예약시스템 — app.visit_req.js  (정리본)
   ================================================================ */

// ── 전역 변수 ────────────────────────────────────────────────────
var commonCodes = [];
var DEBUG = false; // 개발 시 true
function log() { if (DEBUG) console.log.apply(console, arguments); }

// ════════════════════════════════════════════════════════════════
$(document).ready(function () {
// ════════════════════════════════════════════════════════════════

    // ── 직원 자동완성 ────────────────────────────────────────────
    var $nameInput   = $("#staff_name");
    var $listBox     = $("#staff_list_box");
    var focusedIndex = -1;
    var searchTimer;
    var isSelecting  = false;

    $nameInput.on("input", function () {
        if (isSelecting) return;
        var keyword = $(this).val().replace(/\s+/g, "");
        $(this).removeClass("search-success");
        clearTimeout(searchTimer);

        if (keyword.length < 2) {
            $listBox.hide().empty();
            focusedIndex = -1;
            return;
        }

        searchTimer = setTimeout(function () {
            if ($nameInput.hasClass("search-success") || isSelecting) return;
            $.ajax({
                url: "/dwprts/quicksearch",
                type: "GET",
                data: { q: keyword, cc: "H00000", type: "p" },
                success: function (res) {
                    if (isSelecting) return;
                    var listHtml = "";
                    if (res.response && res.response.person && res.response.person.length > 0) {
                        res.response.person.forEach(function (p, index) {
                            var activeClass = index === 0 ? "active" : "";
                            listHtml += '<div class="staff-item ' + activeClass + '"'
                                + ' data-sabun="' + p.internetid + '"'
                                + ' data-name="' + p.personname + '"'
                                + ' data-info="' + p.personname + ' - ' + p.orgname + ' (' + p.name1 + ')"'
                                + ' class="staff-item-row">'
                                + '<strong>' + p.personname + '</strong> - ' + p.orgname + ' (' + p.name1 + ')'
                                + '</div>';
                        });
                        $listBox.html(listHtml).show();
                        focusedIndex = 0;
                        $listBox.scrollTop(0);
                    } else {
                        $listBox.hide().empty();
                        focusedIndex = -1;
                    }
                }
            });
        }, 300);
    });

    $(document).on("click", ".staff-item", function (e) {
        e.preventDefault();
        e.stopPropagation();
        isSelecting = true;
        $nameInput.val($(this).data("name")).addClass("search-success");
        $("#staff_sabun").val($(this).data("sabun"));
        $("#target_staff_info").html($(this).data("info"));
        $listBox.hide().empty();
        focusedIndex = -1;
        setTimeout(function () { isSelecting = false; }, 200);
    });

    $nameInput.on("keydown", function (e) {
        var $items = $listBox.find(".staff-item");
        if (e.keyCode === 40) {
            e.preventDefault();
            focusedIndex = Math.min(focusedIndex + 1, $items.length - 1);
            updateFocus($items);
        } else if (e.keyCode === 38) {
            e.preventDefault();
            focusedIndex = Math.max(focusedIndex - 1, 0);
            updateFocus($items);
        } else if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            if (focusedIndex > -1 && $items.length > 0) $items.eq(focusedIndex).trigger("click");
            return false;
        }
    });

    function updateFocus($items) {
        $items.removeClass("active").css("background", "");
        var $cur = $items.eq(focusedIndex);
        if ($cur.length) {
            $cur.addClass("active").css("background", "#f0f0f0");
            var containerTop = $listBox.scrollTop();
            var itemTop      = $cur.position().top + containerTop;
            if (itemTop < containerTop) {
                $listBox.scrollTop(itemTop);
            } else if (itemTop + $cur.outerHeight() > containerTop + $listBox.height()) {
                $listBox.scrollTop(itemTop + $cur.outerHeight() - $listBox.height());
            }
        }
    }

    // ── 행 추가/삭제 ────────────────────────────────────────────
    window.addRow = function (containerId) {
        var $container = $("#" + containerId);
        if ($container.find(".row-item").length >= 5) {
            Swal.fire({ icon: 'warning', title: '추가 제한', text: '최대 5개까지만 추가 가능합니다.', confirmButtonColor: '#475569', confirmButtonText: '확인' });
            return;
        }
        var $newRow = $container.find(".row-item").first().clone();
        $newRow.find("input").val("");
        $newRow.find(".btn-plus").replaceWith(
            '<button type="button" class="sw-btn btn-minus" onclick="removeRow(this, \'' + containerId + '\')">-</button>'
        );
        $container.append($newRow);
        updateRowNumbers(containerId);
    };

    window.removeRow = function (obj, containerId) {
        $(obj).closest(".row-item").remove();
        updateRowNumbers(containerId);
    };

    function updateRowNumbers(containerId) {
        $("#" + containerId + " .row-item").each(function (i) {
            $(this).find(".row-num").text(i + 1);
        });
    }

    // ── 방문 목적 카드 클릭 ──────────────────────────────────────
    // BUG FIX: 기존에 purpose-card 핸들러가 두 번 바인딩되어 있던 문제 해결
    // (첫 번째: UI 전환 / 두 번째: loadVisitCodes + history) → 하나로 통합
    $(".purpose-card").on("click", function () {
        var type = $(this).data("type");
        var next = (type === "construction") ? "area-construction" : "step-identity";

        // 히든 필드 저장 + 공통코드 로드
        $("#visit_type").val(type);
        loadVisitCodes();

        // 카드 강조
        $(".purpose-card").removeClass("selected").css({ "border-color": "", "background": "" });
        $(this).addClass("selected");

        // 동행자 + 버튼 제어
        if (type === "construction") {
            $('button[onclick*="comp-rows"]').hide();
        } else {
            $(".btn-plus").show();
        }

        // 섹션 전환
        $("#area-company-reg").hide();
        if (type === "construction") {
            $("#step-identity, #meeting-form").hide();
            $("#area-construction").show();
        } else {
            $("#area-construction, #meeting-form").hide();
            $("#step-identity").fadeIn();
        }

        // 스크롤 이동 + 히스토리 추가
        $("html, body").animate({ scrollTop: $("#" + next).offset().top - 100 }, 500);
        setTimeout(function () { history.pushState({ activeDiv: next }, "", location.href); }, 150);
    });

    // ── 상단 네비게이션 클릭 ─────────────────────────────────────
    // BUG FIX: 기존에 nav-item 핸들러가 두 번 바인딩되어 있던 문제 해결 → 하나로 통합
    $(".nav-item").on("click", function () {
        var target = $(this).data("target");
        var idMap  = { info: "sec-info", app: "type-selector", list: "sec-list" };

        // UI 전환
        $(".section-content").removeClass("active").hide();
        $(".nav-item").removeClass("active");
        $(this).addClass("active");
        $("#sec-" + target).addClass("active").show();

        // 신청 섹션 초기화
        if (target === "app") {
            $("#type-selector").show();
            $("#step-identity, #meeting-form, #area-construction, #area-company-reg, #step-company-info").hide();
            $(".purpose-card").removeClass("selected").css({ "border-color": "", "background": "" });
        }

        // 항상 상단으로 복귀 (nav 클릭 시 이전 스크롤 위치 유지 방지)
        window.scrollTo({ top: 0, behavior: "smooth" });

        // 히스토리 추가
        var id = idMap[target];
        if (id) history.pushState({ activeDiv: id }, "", location.href);
    });

    // ── 숫자 전용 필드 ───────────────────────────────────────────
    $("#company_number, #tel, #phone, #com_number1, #com_number2").on("input", function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ""));
    });

    // ── 엔터키 기본동작 차단 ─────────────────────────────────────
    $("#company_number, #search_cnum").on("keydown", function (e) {
        if (e.keyCode === 13) { e.preventDefault(); return false; }
    });

    // ── Datepicker 초기화 ────────────────────────────────────────
    if ($.isFunction($.fn.datepicker)) {
        $(".datepicker").datepicker({
            dateFormat: "yy-mm-dd",
            prevText: "이전 달", nextText: "다음 달",
            monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
            dayNamesMin: ["일","월","화","수","목","금","토"],
            changeMonth: true, changeYear: true,
            showMonthAfterYear: true, yearSuffix: "년"
        });
    }
	//시작일 설정시 종료일도 같이 설정
	$(document).on("change", "#sdate", function() {
        $("#edate").val($(this).val());
    });

    // ── 시간 셀렉트 생성 ─────────────────────────────────────────
    // BUG FIX: 기존 코드가 .val(hourHtml)로 HTML 문자열 전체를 value로 세팅하던 버그 수정
    function setHours() {
        var html = '<option value="">선택</option>';
        for (var i = 0; i <= 23; i++) {
            var h = i < 10 ? "0" + i : String(i);
            html += '<option value="' + h + '">' + h + '</option>';
        }
        $("#stime_h, #etime_h").html(html);
        $("#stime_h").val(""); // 기본값 09시
        $("#etime_h").val(""); // 기본값 18시
    }

    function setMinutes() {
        var html = '<option value="">선택</option>';
        for (var i = 0; i <= 50; i += 10) {
            var m = i === 0 ? "00" : String(i);
            html += '<option value="' + m + '">' + m + '</option>';
        }
        $("#stime_i, #etime_i").html(html);
        $("#stime_i, #etime_i").val("00");
    }

    setHours();
    setMinutes();

    // ── 히스토리 관리 ────────────────────────────────────────────
    var CHILD_SECTIONS = ["area-company-reg","step-company-info","meeting-form","step-identity","area-construction","type-selector"];

    function restoreSection(id) {
        var allIds = ["sec-info","sec-list","sec-app","area-company-reg","step-company-info","meeting-form","step-identity","area-construction","type-selector"];
        allIds.forEach(function (sid) { $("#" + sid).hide(); });
        $(".nav-item").removeClass("active");

        if (CHILD_SECTIONS.indexOf(id) !== -1) {
            $("#sec-app").show().addClass("active");
            $(".nav-item[data-target='app']").addClass("active");
            $("#" + id).show();
            // BUG FIX: area-construction 복원 시 type-selector도 함께 노출해야 함
            if (id === "area-construction") $("#type-selector").show();
        } else {
            $("#" + id).show().addClass("active");
            $(".nav-item[data-target='" + id.replace("sec-", "") + "']").addClass("active");
        }
        window.scrollTo(0, 0);
    }

    history.replaceState({ activeDiv: "sec-info" }, "", location.href);

    // showFinalForm 래핑 (히스토리 통합)
    var _origShowFinalForm = window.showFinalForm;
    window.showFinalForm = function (type) {
        _origShowFinalForm && _origShowFinalForm(type);
        history.pushState({ activeDiv: "meeting-form" }, "", location.href);
    };

    // showCompanyRegForm 래핑 (히스토리 통합)
    var _origShowCompanyReg = window.showCompanyRegForm;
    window.showCompanyRegForm = function () {
        _origShowCompanyReg && _origShowCompanyReg();
        history.pushState({ activeDiv: "area-company-reg" }, "", location.href);
    };

    // goNext 래핑 (히스토리 통합)
    var _origGoNext = window.goNext;
    window.goNext = function () {
        _origGoNext && _origGoNext();
        history.pushState({ activeDiv: "meeting-form" }, "", location.href);
    };

    // step-company-info 가시성 감지 → 히스토리 자동 추가
    var el = document.getElementById("step-company-info");
    if (el) {
        new MutationObserver(function () {
            if ($(el).is(":visible") && history.state && history.state.activeDiv !== "step-company-info") {
                history.pushState({ activeDiv: "step-company-info" }, "", location.href);
            }
        }).observe(el, { attributes: true, attributeFilter: ["style"] });
    }

    // 뒤로가기 이벤트
    window.addEventListener("popstate", function (e) {
        var id = (e.state && e.state.activeDiv) ? e.state.activeDiv : "sec-info";
        restoreSection(id);
    });

    // ── 특수문자 차단 ────────────────────────────────────────────
    $(document).on("keydown input blur",
        "input[name='comp_name[]'], input[name='comp_birth[]'], input[name='comp_tel[]'], input[name='car_name[]'], input[name='car_no[]']",
        function (e) {
            var $this = $(this);
            var name  = $this.attr("name");

            if (e.type === "keydown") {
                if ((e.shiftKey && e.keyCode === 54) || (e.shiftKey && e.keyCode === 220)) {
                    e.preventDefault();
                    Swal.fire({ icon: "warning", title: "입력 제한", text: "구분자로 사용되는 특수문자(^, |)는 입력할 수 없습니다.", confirmButtonColor: "#475569", timer: 1500 });
                    return false;
                }
            }

            var val = $this.val();
            if (name === "comp_birth[]" || name === "comp_tel[]") {
                if (/[^0-9]/g.test(val)) $this.val(val.replace(/[^0-9]/g, ""));
            } else {
                var re = /[<>^|&%]/g;
                if (re.test(val)) {
                    $this.val(val.replace(re, ""));
                    Swal.fire({ icon: "warning", title: "특수문자 제거", text: "금지된 특수문자가 포함되어 제거되었습니다.", confirmButtonColor: "#475569", timer: 1000 });
                }
            }
        }
    );

    // ── 공통코드 로드 (ready 내부 private) ──────────────────────
    function loadVisitCodes() {
        var visitType = $("#visit_type").val();
        $.ajax({
            url: "/dwp/com/sys/code_mn.nsf/api/data/collections/name/wviwtree?count=999&category=AP0018_ALL",
            type: "GET", dataType: "json",
            success: function (data) {
                commonCodes = data;
                renderSelectbox("zone", "GP0001");
                renderSelectbox("purpose", visitType === "construction" ? "GP0003" : "GP0002");
            }
        });
    }

    function renderSelectbox(targetId, pcode) {
        var $select = $("#" + targetId).empty().append('<option value="">선택하세요</option>');
        $.each(commonCodes, function (i, item) {
            if (item._pcode === pcode && item._type === "CODE") {
                $select.append('<option value="' + item._code + '">' + item._codenm.replace("ko:", "") + '</option>');
            }
        });
    }

	//공사 중장비 사업자번호 ,방문기록조회후 엔터시 
	$("#con-user-name, #con-user-tel").on("keydown", function(e) {
        if (e.keyCode === 13) { // 엔터키 번호가 13번
            e.preventDefault(); // 브라우저의 기본 새로고침 동작을 차단
            searchConstructionStaff(); // 형님이 만든 조회 함수 실행
        }
    });

		//공사 중장비 사업자번호 ,방문기록조회후 엔터시 
	$("#user-name, #user-tel").on("keydown", function(e) {
        if (e.keyCode === 13) { // 엔터키 번호가 13번
            e.preventDefault(); // 브라우저의 기본 새로고침 동작을 차단
            searchGeneralVisitor(); // 형님이 만든 조회 함수 실행
        }
    });


// ════════════════════════════════════════════════════════════════
}); // ready 끝 레디 끝
// ════════════════════════════════════════════════════════════════


// ── 전역 유틸 ───────────────────────────────────────────────────
function getMsg(id) { return $("#" + id).text(); }


// ── 신규/기존 신청서 폼 열기 ─────────────────────────────────────
function showFinalForm(userType) {
    if (userType === "old") {
        var uName = $.trim($("#user-name").val());
        var uTel  = $.trim($("#user-tel").val());
        if (!uName || !uTel) { alert(getMsg("msg-input-err")); return false; }
        alert(uName + getMsg("msg-search-ok"));
    }

    if (userType === "new") {
        // 모바일 autofill 대응: 텍스트 필드 초기화 (2단계로 단순화)
        var $form = $("#meeting-form");
        $form.find("input[type='text'], textarea").val("").removeAttr("value");
        setTimeout(function () {
            $form.find("input[type='text'], textarea").each(function () { this.value = ""; });
        }, 300);
    }

    $("#type-selector, #step-identity").hide();
    var $appForm = $("#meeting-form");
    if ($appForm.length) {
        $appForm.attr("style", "display:block !important;");
        if ($.isFunction($.fn.datepicker)) $(".datepicker").datepicker({ dateFormat: "yy-mm-dd" });
        window.scrollTo(0, 0);
    }
}


// ── 업체 등록 폼 열기 ───────────────────────────────────────────
function showCompanyRegForm() {
    $("#area-construction, #step-identity, #type-selector").hide();
    $("#area-company-reg").fadeIn();
    $("html, body").animate({ scrollTop: $("#area-company-reg").offset().top - 50 }, 500);
}


// ── 업체 저장 ───────────────────────────────────────────────────
function saveCompany() {
    if (!$("#agree_chk").is(":checked")) {
        Swal.fire({ icon: "warning", title: "동의 필요", text: "개인정보 수집 및 안전 수칙에 동의하셔야 등록이 가능합니다.", confirmButtonColor: "#475569" })
            .then(function () {
                var $t = $("#agree_chk");
                $("html, body").stop().animate({ scrollTop: $t.offset().top - 150 }, 500);
                setTimeout(function () { $t.focus({ preventScroll: true }); }, 600);
            });
        return false;
    }

    if ($("#company_number").data("check") !== "Y") {
        Swal.fire({ icon: "warning", title: "중복 확인 필요", text: "사업자등록번호 중복 확인을 먼저 진행해 주세요.", confirmButtonColor: "#475569" });
        return false;
    }

    var fields = [
        { id: "company_number", msg: "사업자등록번호를 입력해주세요." },
        { id: "vcompany",       msg: "업체명을 입력해주세요." },
        { id: "ceo",            msg: "대표자명을 입력해주세요." },
        { id: "vtel",           msg: "대표전화를 입력해주세요." },
        { id: "vphone",         msg: "대표휴대폰 번호를 입력해주세요." },
        { id: "email1",         msg: "이메일 계정을 입력해주세요." },
        { id: "email2",         msg: "이메일 도메인을 입력해주세요." },
        { id: "addrzip",        msg: "주소 검색을 해주세요." },
        { id: "addr2",          msg: "상세주소를 입력해주세요." }
    ];

    var valid = true;
    $.each(fields, function (i, f) {
        if (!$.trim($("#" + f.id).val())) {
            var $el = $("#" + f.id);
            Swal.fire({ icon: "warning", title: "입력 누락", text: f.msg, confirmButtonColor: "#475569", confirmButtonText: "확인" })
                .then(function () {
                    $("html, body").stop().animate({ scrollTop: $el.offset().top - 150 }, 500,
                        function () { $el.focus({ preventScroll: true }); });
                });
            valid = false;
            return false;
        }
    });
    if (!valid) return false;

    Swal.fire({ title: "신규 업체 등록", text: "입력하신 정보로 업체를 등록하시겠습니까?", icon: "question", showCancelButton: true, confirmButtonColor: "#475569", cancelButtonColor: "#d33", confirmButtonText: "등록", cancelButtonText: "취소" })
        .then(function (res) {
            if (!res.isConfirmed) return;
            var $btn = $("button[onclick='saveCompany()']").prop("disabled", true).text("저장 중...");
            $.ajax({
                url: "/dwp/com/work/visitors.nsf/wcmdpost_company?createdocument",
                type: "POST",
                data: $("#area-company-reg input, #area-company-reg select").serialize(),
                dataType: "json",
                success: function (r) {
                    if (r.status === "success" || r.status === "OK") {
                        Swal.fire({ icon: "success", title: "등록 성공", text: "업체가 성공적으로 등록되었습니다.", confirmButtonColor: "#475569", confirmButtonText: "확인" })
                            .then(function () { location.reload(); });
                    } else {
                        Swal.fire({ icon: "error", title: "등록 실패", text: "오류 발생: " + r.message, confirmButtonColor: "#ef4444" });
                        $btn.prop("disabled", false).text("등록");
                    }
                },
                error: function () {
                    Swal.fire({ icon: "error", title: "통신 오류", text: "서버 통신 중 오류가 발생했습니다.", confirmButtonColor: "#ef4444" });
                    $btn.prop("disabled", false).text("등록");
                }
            });
        });
}


// ── 주소 검색 ───────────────────────────────────────────────────
function OpenZipSearch(zipId, addrId, focusId) {
    new daum.Postcode({
        oncomplete: function (data) {
            var addr = (data.userSelectedType === "R") ? data.roadAddress : data.jibunAddress;
            document.getElementById(zipId).value   = data.zonecode;
            document.getElementById(addrId).value  = addr;
            document.getElementById(focusId).focus();
        }
    }).open();
}


// ── 산재 가입 토글 ──────────────────────────────────────────────
function clickCN2(val) {
    if (val == "1") { $("#com_number2").show().val("").focus(); }
    else            { $("#com_number2").hide().val("0"); }
}


// ── 이메일 도메인 선택 ──────────────────────────────────────────
function email_domain(targetId, value) {
    var $t = $("#" + targetId);
    if (value === "") {
        $t.val("").prop("readOnly", false).focus().removeClass("inp--readonly");
    } else {
        $t.val(value).prop("readOnly", true).addClass("inp--readonly");
    }
}


// ── 사업자번호 중복 확인 ─────────────────────────────────────────
// NOTE: HTML의 onclick="dupCheck('company_number','text')" 에서 두 번째 인자(type)는 미사용 → 제거 가능
function dupCheck(targetId) {
    var numOnly = $("#" + targetId).val().trim().replace(/[^0-9]/g, "");
    if (numOnly.length !== 10) {
        Swal.fire({ icon: "warning", title: "입력 오류", text: "사업자등록번호 10자리를 정확히 입력해 주세요.", confirmButtonColor: "#475569" });
        $("#" + targetId).focus();
        return;
    }
    $.ajax({
        url: "/dwp/com/work/visitors.nsf/api/data/collections/name/companylist?search=" + numOnly,
        type: "GET", dataType: "json",
        success: function (res) {
            var isDup = res && res.some(function (item) { return item.CompanyNumber === numOnly; });
            if (isDup) {
                Swal.fire({ icon: "error",   title: "중복",    text: "이미 등록된 사업자번호입니다.", confirmButtonColor: "#ef4444" });
                $("#" + targetId).data("check", "N");
            } else {
                Swal.fire({ icon: "success", title: "사용 가능", text: "등록 가능한 번호입니다.",       confirmButtonColor: "#475569" });
                $("#" + targetId).data("check", "Y");
            }
        }
    });
}


// ── 업체 조회 ───────────────────────────────────────────────────
function searchCompany() {
    var cNum = $("#search_cnum").val().trim().replace(/[^0-9]/g, "");
    if (cNum.length !== 10) {
        Swal.fire({ icon: "warning", text: "사업자번호 10자리를 입력해주세요." });
        return;
    }
    $.ajax({
        url: "/dwp/com/work/visitors.nsf/api/data/collections/name/companylist?search=" + cNum,
        type: "GET", dataType: "json",
        success: function (res) {
            // BUG FIX: 기존에 isDup 변수가 중첩 선언되고 else 브랜치가 dead code였던 문제 수정
            // → filter로 단순화
            var matched = res && res.filter(function (item) { return item.CompanyNumber === cNum; });

            if (matched && matched.length > 0) {
                var d = matched[0];
                $("#type-selector, #area-construction").hide();
                $("#disp_cnum").text(d.CompanyNumber);
                $("#disp_cname").text(d.CompanyName);
                $("#disp_ceo").text(d.ceo);
                $("#disp_tel").text(d.Tel || d.Phone);
                $("#step-company-info").show();
                window.scrollTo({ top: 0, behavior: "smooth" });
                loadVisitorList(d.CompanyNumber);
            } else {
                Swal.fire({ icon: "error", title: "미등록 업체", text: "등록되지 않은 사업자번호입니다. 신규 등록을 진행해주세요.", confirmButtonColor: "#ef4444" });
            }
        }
    });
}


// ── 방문자 목록 로드 ─────────────────────────────────────────────
function loadVisitorList(companyNumber) {
    $("#visitor-list-body").html('<tr><td colspan="6" class="vt-cell vt-cell--loading">불러오는 중...</td></tr>');
    $.ajax({
        url: "/dwp/com/work/visitors.nsf/api/data/collections/name/companyemplist?search=" + companyNumber,
        type: "GET", dataType: "json",
        success: function (res) {
            var data = Array.isArray(res) ? res : (res.data || []);
            var html = "";
            if (data && data.length > 0) {
                data.forEach(function (item) {
                    var gender = item.VGender === "M" ? "남" : "여";
                    html +=
                        '<tr class="vt-row">'
                        + '<td class="vt-cell vt-cell--check"><input type="checkbox" name="chk_visitor" value="' + (item["@unid"] || "") + '" class="vt-chk"></td>'
                        + '<td class="vt-cell td-name">' + (item.VName || "") + "(" + gender + ")</td>"
                        + '<td class="vt-cell td-birth">' + (item.VBirth || "") + "</td>"
                        + '<td class="vt-cell td-tel">' + (item.VTel || "") + "</td>"
                        + '<td class="vt-cell td-nation"><span class="vt-agree-badge">✅ 동의</span></td>'
                        + '<td class="vt-cell"><button type="button" onclick="deleteVisitor(\'' + (item["@unid"] || "") + '\')" class="vt-del-btn">삭제</button></td>'
                        + "</tr>";
                });
            } else {
                html = _emptyVisitorRow();
            }
            $("#visitor-list-body").html(html);
        },
        error: function (xhr) {
            log("loadVisitorList error:", xhr.status);
            $("#visitor-list-body").html('<tr><td colspan="6" class="vt-cell vt-cell--error">데이터 로딩 실패 (관리자 문의)</td></tr>');
        }
    });
}

// BUG FIX: 긴 인라인 HTML을 함수로 분리 (가독성 + 재사용)
function _emptyVisitorRow() {
    return '<tr><td colspan="6" class="vt-empty">'
        + '<div class="vt-empty__wrap">'
        + '<div class="vt-empty__icon">'
        + '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">'
        + '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
        + '</div>'
        + '<h3 class="vt-empty__title">등록된 방문자 없음</h3>'
        + '<p class="vt-empty__desc">이 업체에 등록된 인원이 없습니다.<br>'
        + '<span class="vt-empty__hint">[방문자 등록]</span> 버튼으로 추가하십시오.</p>'
        + '</div></td></tr>';
}


// ── 이전 단계 (업체조회로) ──────────────────────────────────────
function goBack() {
    $("#step-company-info").hide();
    $("#type-selector, #area-construction").show();
    window.scrollTo({ top: 0, behavior: "smooth" });
}


// ── 다음 단계 (신청서로) ─────────────────────────────────────────
function goNext() {
    var $checked = $("input[name='chk_visitor']:checked");
    if ($checked.length === 0) {
        Swal.fire("알림", "신청할 방문자를 선택해 주세요.", "warning");
        return;
    }

    // 업체명 세팅
    $("#company").val($("#disp_cname").text().trim());

    // 이메일·기본 필드 초기화
    $("#remail1, #remail2").val("");
    $("#remail3").val("").prop("selected", true);
    $("#rname, #tel, #birthday").val("");
    $("#comp-rows").find(".row-item:gt(0)").remove();
    $("#comp-rows .row-item").eq(0).find("input").val("");

    // 선택된 방문자 → 폼 매핑
    $checked.each(function (index) {
        var $row      = $(this).closest("tr");
        var fullText  = $row.find(".td-name").text().trim();
        var birthText = $row.find(".td-birth").text().trim();
        var telText   = $row.find(".td-tel").text().trim();
        var nameOnly  = fullText.split("(")[0];

        if (index === 0) {
            // 첫 번째 = 예약자
            $("#rname").val(nameOnly);
            $("#tel").val(telText);
            $("#birthday").val(birthText);
            if (fullText.includes("남")) $("#m").prop("checked", true);
            else                          $("#f").prop("checked", true);
        } else {
            // 두 번째 이후 = 동행자 (index=1은 기존 첫 행, index≥2는 행 추가 후 세팅)
            if (index > 1) addRow("comp-rows");
            var $targetRow = $("#comp-rows .row-item").eq(index - 1);
            $targetRow.find("input[name='comp_name[]']").val(nameOnly);
            $targetRow.find("input[name='comp_birth[]']").val(birthText);
            $targetRow.find("input[name='comp_tel[]']").val(telText);
        }
    });

    $("#step-company-info").hide();
    $("#meeting-form").show();
}


// ── 방문자 등록 팝업 ─────────────────────────────────────────────
function openVisitorRegPopup() {
    var cnum = $("#disp_cnum").text().trim();
    if (!cnum || cnum === "-") {
        Swal.fire("오류", "업체 정보가 조회되지 않았습니다.", "error");
        return;
    }
    if ($("#visitor-list-body tr").not(":contains('없습니다')").length >= 20) {
        Swal.fire("등록 제한", "한 업체당 최대 20명까지만 등록 가능합니다.", "warning");
        return;
    }

    Swal.fire({
        title: "직원 등록",
        width: "650px", padding: "1.5rem",
        html: _buildVisitorRegHtml(),
        showCancelButton: true,
        confirmButtonText: "등록완료", confirmButtonColor: "#ef4444",
        cancelButtonText: "취소",
        preConfirm: function () {
            if (!$("#swal_agree1").is(":checked") || !$("#swal_agree2").is(":checked") || !$("#swal_agree3").is(":checked")) {
                Swal.showValidationMessage("모든 필수 약관에 동의하셔야 합니다.");
                return false;
            }
            var name  = $("#swal_name").val().trim();
            var birth = $("#swal_birth").val().trim();
            var tel   = $("#swal_tel").val().trim();
            if (!name || birth.length < 8 || !tel) {
                Swal.showValidationMessage("성명, 생년월일(8자리), 전화번호를 정확히 입력하세요.");
                return false;
            }
            return { companyNumber: cnum, name: name, birth: birth, tel: tel,
                     gender: $("input[name='swal_gender']:checked").val(),
                     nationality: $("input[name='swal_nation']:checked").val() };
        }
    }).then(function (result) {
        if (result.isConfirmed) saveVisitorData(result.value);
    });
}

// 팝업 HTML 생성 — 인라인 스타일 전부 CSS 클래스로 이관
function _buildVisitorRegHtml() {
    function agreeRow(id, label, type, isLast) {
        return '<div class="sp-agree-row' + (isLast ? " sp-agree-row--last" : "") + '">'
            + '<label class="sp-agree-label">'
            + '<input type="checkbox" id="' + id + '" class="sp-agree-chk"> '
            + '<span>' + label + "</span></label>"
            + '<button type="button" onclick="viewAgreement(\'' + type + '\')" class="sp-view-btn">보기</button>'
            + "</div>";
    }
    function fieldRow(label, content, isLast) {
        return '<div class="sp-field' + (isLast ? " sp-field--last" : "") + '">'
            + '<div class="sp-field__label">' + label + "</div>"
            + '<div class="sp-field__body">' + content + "</div></div>";
    }
    return '<div class="sp-wrap">'
        + '<p class="sp-notice">본인이 직접 동의해야 하며 동의에 대한 책임은 본인에게 있습니다.</p>'
        + '<div class="sp-agree-list">'
        + agreeRow("swal_agree1", "이용약관 동의(필수)",        "service")
        + agreeRow("swal_agree2", "개인정보 수집 및 이용(필수)", "privacy")
        + agreeRow("swal_agree3", "보안정책 및 안전수칙(필수)",  "security", true)
        + "</div>"
        + '<div class="sp-fields">'
        + fieldRow("성명/성별",
            '<div class="sp-gender-row">'
            + '<input type="text" id="swal_name" class="sp-inp sp-inp--name">'
            + '<label class="sp-radio-label"><input type="radio" name="swal_gender" value="M" checked class="sp-radio"> 남</label>'
            + '<label class="sp-radio-label"><input type="radio" name="swal_gender" value="F" class="sp-radio"> 여</label>'
            + '</div>')
        + fieldRow("생년월일",
            '<input type="text" id="swal_birth" maxlength="8" placeholder="YYYYMMDD" class="sp-inp sp-inp--birth">')
        + fieldRow("국적",
            '<div class="sp-nation-row">'
            + '<label class="sp-radio-label"><input type="radio" name="swal_nation" value="L" checked class="sp-radio"> 내국인</label>'
            + '<label class="sp-radio-label"><input type="radio" name="swal_nation" value="F" class="sp-radio"> 외국인</label>'
            + '</div>')
        + fieldRow("전화번호",
            '<input type="tel" id="swal_tel" placeholder="- 없이 입력" class="sp-inp sp-inp--tel">', true)
        + "</div></div>";
}


// ── 약관 보기 ───────────────────────────────────────────────────
function viewAgreement(type) {
    var data = {
        service:  { title: "이용약관 동의",          content: "<strong>제1조 (목적)</strong><br>본 약관은 시스템 이용에 관한 제반 사항을 규정합니다.<br><br><strong>제2조 (이용자의 의무)</strong><br>1. 이용자는 본인의 정확한 정보를 제공해야 합니다.<br>2. 타인의 정보를 도용할 경우 법적 책임을 질 수 있습니다.<br><br><strong>제3조 (서비스 중단)</strong><br>시스템 점검 및 장애 시 서비스가 일시 중단될 수 있습니다." },
        privacy:  { title: "개인정보 수집 및 이용",   content: "<strong>1. 수집 항목</strong>: 성명, 생년월일, 연락처, 국적<br><strong>2. 수집 목적</strong>: 사업장 방문 신청 및 출입 보안 확인<br><strong>3. 보유 기간</strong>: 방문 목적 달성 후 1년 또는 관련 법령에 따른 기간<br><br>※ 거부 시 방문 신청이 제한됩니다." },
        security: { title: "보안정책 및 안전수칙",    content: "<strong>[보안 준수사항]</strong><br>1. 인가되지 않은 구역 출입 금지<br>2. 사내 보안 구역 촬영 및 녹음 금지<br>3. 정보 자산 무단 반출 금지<br><br><strong>[안전 수칙]</strong><br>1. 지정된 보행로 이용<br>2. 비상시 안전 관리자 지시에 따라 대피" }
    };
    if (!data[type]) return;
    $("#agree-title").text(data[type].title);
    $("#agree-content").html('<div class="agree-content-body">' + data[type].content + "</div>");
    $("#agreement-layer").css("display", "flex");
}


// ── 방문자 데이터 저장 ───────────────────────────────────────────
function saveVisitorData(data) {
    Swal.fire({ title: "저장 중", text: "잠시만 기다려 주세요...", allowOutsideClick: false, didOpen: function () { Swal.showLoading(); } });
    $.ajax({
        url: "/dwp/com/work/visitors.nsf/wcmdpost_emp?createdocument",
        type: "POST",
        data: { Form: "Company_Emp", Cnum: data.companyNumber, VName: data.name, VGender: data.gender, VBirth: data.birth, VNation: data.nationality, VTel: data.tel, VAgree: "Y" },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function () {
            Swal.fire({ icon: "success", title: "등록 성공", text: "방문자 등록이 완료되었습니다.", confirmButtonColor: "#0045a5" })
                .then(function () { loadVisitorList(data.companyNumber); });
        },
        error: function () {
            Swal.fire("등록 실패", "서버 통신 중 오류가 발생했습니다.", "error");
        }
    });
}


// ── 방문자 삭제 ──────────────────────────────────────────────────
function deleteVisitor(unid) {
    if (!unid) return;
    Swal.fire({ title: "삭제하시겠습니까?", text: "삭제된 정보는 복구할 수 없습니다.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "#64748b", confirmButtonText: "삭제", cancelButtonText: "취소" })
        .then(function (result) {
            if (!result.isConfirmed) return;
            $.ajax({
                url: "/dwp/com/work/visitors.nsf/ag_DeleteEmp?OpenAgent&unid=" + unid + "&t=" + Date.now(),
                type: "GET", dataType: "json",
                success: function (res) {
                    if (res.result === "200") {
                        Swal.fire({ title: "삭제 완료", icon: "success", timer: 1000, showConfirmButton: false })
                            .then(function () {
                                setTimeout(function () { loadVisitorList($("#disp_cnum").text().trim()); }, 800);
                            });
                    } else if (res.result === "100") {
                        Swal.fire("실패", "해당 문서를 찾을 수 없습니다.", "info");
                    } else {
                        Swal.fire("오류", "삭제 처리 중 문제가 발생했습니다. (Code: " + res.result + ")", "error");
                    }
                },
                error: function () { Swal.fire("통신 오류", "서버와 연결할 수 없습니다.", "error"); }
            });
        });
}


// ── 최종 제출 ───────────────────────────────────────────────────
function checkSubmit() {
    var fields = [
        { id: "sdate",       msg: "방문 시작일을 선택해주세요." },
        { id: "edate",       msg: "방문 종료일을 선택해주세요." },
        { id: "rname",       msg: "예약자 성명을 입력해주세요." },
        { id: "tel",         msg: "휴대폰 번호를 입력해주세요." },
        { id: "birthday",    msg: "생년월일 8자리를 입력해주세요." },
        { id: "remail1",     msg: "이메일 계정을 입력해주세요." },
        { id: "remail2",     msg: "이메일 도메인을 입력해주세요." },
        { id: "company",     msg: "업체명을 입력해주세요." },
        { id: "zone",        msg: "방문 구역을 선택해주세요." },
        { id: "purpose",     msg: "방문 목적을 선택해주세요." },
        { id: "staff_sabun", msg: "만날 사람을 검색하여 선택해주세요." }
    ];

	    // 약관 동의
    if (!$("#final-agree").is(":checked")) {
        Swal.fire({ icon: "warning", title: "동의 필요", text: "개인정보 수집 및 보안 서약에 동의하셔야 신청이 가능합니다.", confirmButtonColor: "#475569" })
            .then(function () {
                $("html, body").stop().animate({ scrollTop: $("#final-agree").offset().top - 200 }, 500);
            });
        return false;
    }

    var valid = true;
    $.each(fields, function (i, f) {
        if (!$.trim($("#" + f.id).val())) {
            var $el = $("#" + f.id);
            Swal.fire({ icon: "warning", title: "입력 누락", text: f.msg, confirmButtonColor: "#475569" })
                .then(function () {
                    $("html, body").stop().animate({ scrollTop: $el.offset().top - 150 }, 500,
                        function () { $el.focus({ preventScroll: true }); });
                });
            valid = false;
            return false;
        }
    });
    if (!valid) return false;

    // 날짜 검증
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var sDate = new Date($("#sdate").val());
    var eDate = new Date($("#edate").val());
    if (sDate < today)  { Swal.fire("날짜 오류", "오늘 이전 날짜로는 예약할 수 없습니다.", "error"); return false; }
    if (eDate < sDate)  { Swal.fire("날짜 오류", "종료일이 시작일보다 빠를 수 없습니다.", "error"); return false; }

    // 시간 검증
    var sH = $("#stime_h").val(), sI = $("#stime_i").val();
    var eH = $("#etime_h").val(), eI = $("#etime_i").val();
    if (!sH || !sI) { Swal.fire("시간 확인", "방문 시작 시간을 선택해주세요.", "warning"); return false; }
    if (!eH || !eI) { Swal.fire("시간 확인", "방문 종료 시간을 선택해주세요.", "warning"); return false; }

    if ($("#sdate").val() === $("#edate").val()) {
        if (parseInt(eH + eI, 10) <= parseInt(sH + sI, 10)) {
            Swal.fire("시간 오류", "종료 시간은 시작 시간보다 늦어야 합니다.", "error"); return false;
        }
    } else if (new Date($("#edate").val() + " " + eH + ":" + eI) <= new Date($("#sdate").val() + " " + sH + ":" + sI)) {
        Swal.fire("일시 오류", "종료 일시는 시작 일시보다 늦어야 합니다.", "error"); return false;
    }



    Swal.fire({ title: "방문 신청", text: "입력하신 정보로 방문 신청을 등록하시겠습니까?", icon: "question", showCancelButton: true, confirmButtonColor: "#475569", cancelButtonColor: "#d33", confirmButtonText: "신청", cancelButtonText: "취소" })
        .then(function (result) {
            // 취소 시 상단으로 복귀
            if (!result.isConfirmed) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }

            // 구역/목적을 텍스트로 전환
            var $zoneSel = $("#zone");
            var $purposeSel = $("#purpose");

            var zoneText = $zoneSel.find("option:selected").text();       // 예: "본관"
            var purposeText = $purposeSel.find("option:selected").text(); // 예: "업무협의"

            // 기존 select의 name을 날려서 코드값이 안 넘어가게 방어
            $zoneSel.removeAttr("name");
            $purposeSel.removeAttr("name");

            // 3. 폼 내부에 동일한 name으로 한글 텍스트 hidden 필드 주입
            var $form = $("#meeting-form"); // 형님 폼 ID
            $form.append('<input type="hidden" name="zone" value="' + zoneText + '">');
            $form.append('<input type="hidden" name="purpose" value="' + purposeText + '">');

            var checkedMediaArray = [];
    
            // name="chk_media" 중에서 체크된 녀석들만 반복문 돌리기
            $("input[name='chk_media']:checked").each(function() {
                checkedMediaArray.push($(this).val()); // ["노트북", "USB"] 형태로 적재
            });

            // 배열을 콤마 구분자 문자열로 변환 (예: "노트북, USB")
            // 만약 하나도 체크 안 했다면 빈 값("")이 담깁니다.
            var mediaString = checkedMediaArray.join(", "); 

            // 진짜 전송용 hidden 필드에 값 주입
            $("#media").val(mediaString);

            // BUG FIX: 기존 코드가 ".car-row-item"(존재하지 않는 클래스)을 사용하던 문제 수정
            // → #comp-rows / #car-rows로 명확히 구분
            var visitorArray = [];
            $("#comp-rows .row-item").each(function () {
                var name  = $(this).find("input[name='comp_name[]']").val().replace(/[|^]/g, "").trim();
                var birth = $(this).find("input[name='comp_birth[]']").val().replace(/[|^]/g, "").trim();
                var tel   = $(this).find("input[name='comp_tel[]']").val().replace(/[|^]/g, "").trim();
                if (name) visitorArray.push(name + "^" + birth + "^" + tel);
            });

            var carArray = [];
            $("#car-rows .row-item").each(function () {
                var cName = $(this).find("input[name='car_name[]']").val().replace(/[|^]/g, "").trim();
                var cNo   = $(this).find("input[name='car_no[]']").val().replace(/[|^]/g, "").trim();
                if (cName || cNo) carArray.push(cName + "^" + cNo);
            });

            // BUG FIX: HTML에 없는 #hidden_visitors / #hidden_cars 필드를 동적으로 생성
            var $f = $("#meeting-form");
            if (!$("#hidden_visitors").length) $('<input type="hidden" id="hidden_visitors" name="VisitorList">').appendTo($f);
            if (!$("#hidden_cars").length)     $('<input type="hidden" id="hidden_cars"     name="CarList">').appendTo($f);
            $("#hidden_visitors").val(visitorArray.join("|"));
            $("#hidden_cars").val(carArray.join("|"));

            var formData = $("#meeting-form input, #meeting-form select").serialize();
            var $btn = $("#btnSubmit").prop("disabled", true).text("처리 중...");

            $.ajax({
                url: "/dwp/com/work/visitors.nsf/wcmdpost_reqemp?createdocument",
                type: "POST", data: formData, dataType: "json",
                success: function (res) {
                    if (res.status === "success" || res.result === "200") {
                        Swal.fire({ icon: "success", title: "등록 완료", text: "방문 신청이 정상적으로 접수되었습니다.", confirmButtonColor: "#475569" })
                            .then(function () { location.reload(); });
                    } else {
                        Swal.fire("등록 실패", res.message || "오류가 발생했습니다.", "error");
                        $btn.prop("disabled", false).text("방문 신청");
                    }
                },
                error: function () {
                    Swal.fire("통신 오류", "서버와 연결할 수 없습니다.", "error");
                    $btn.prop("disabled", false).text("방문 신청");
                }
            });
        });
}

function openAdminLogin() {
    Swal.fire({
        title: '시스템관리',
        input: 'password',
        inputPlaceholder: '비밀번호를 입력하세요',
        inputAttributes: { autocomplete: 'off' },
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        confirmButtonColor: '#0045a5',
        preConfirm: function(pwd) {
            if (!pwd) {
                Swal.showValidationMessage('비밀번호를 입력해주세요.');
                return false;
            }
            return pwd;
        }
    }).then(function(result) {
        if (!result.isConfirmed) return;
        // TODO: AJAX로 도미노 에이전트에 비밀번호 전달
        // 보안실 / 관리자 분기 처리
    });
}


// ── 취소 버튼 공통 함수 ──────────────────────────────────────────
// location.reload() 단독 사용 시 브라우저 스크롤 복원으로 이전 위치에 머무는 문제 해결
// scrollRestoration = manual 로 브라우저 복원 비활성화 후 상단으로 이동
function pageReload() {
    if (history.scrollRestoration) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    location.reload();
}

/**
 * 공사/중장비 사원 전용 조회 함수
 * 1. 이름/연락처로 전용 API 호출
 * 2. 정보 있으면 '업체정보확인' 페이지로 이동
 * 3. 정보 없으면 '일반 조회' 안내 팝업 노출
 */
/**
 * 방문 기록(공사/중장비 사원) 조회 함수
 */
function searchConstructionStaff() {
    var vnameVal = ($("#con-user-name").val() || "").trim();
    var vtelVal = ($("#con-user-tel").val() || "").replace(/[^0-9]/g, "");

    if (vnameVal.length < 2 || vtelVal.length !== 11) {
        Swal.fire({ icon: 'warning', text: '성함(2자 이상)과 연락처(11자리)를 정확히 입력해주세요.' });
        return;
    }

    // 1. 사원 정보 API 호출
    var searchQuery = "(([vname] contains " + vnameVal + ") AND ([vtel] contains " + vtelVal + "))";
    var apiUrl = "/dwp/com/work/visitors.nsf/api/data/collections/name/companyemplist?search=" + encodeURIComponent(searchQuery);

    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json",
        success: function (res) {
            if (Array.isArray(res) && res.length > 0) {
                var staffInfo = res[0]; 
                var cNum = staffInfo.Cnum; // 사원 정보에서 뽑아낸 사업자번호

                // 2. 사원 정보가 있으면 사업자번호(Cnum)로 업체 정보 마스터 조회
                $.ajax({
                    url: "/dwp/com/work/visitors.nsf/api/data/collections/name/companylist?search=" + cNum,
                    type: "GET",
                    dataType: "json",
                    success: function (compRes) {
                        // 사업자번호가 정확히 일치하는 업체 필터링
                        var matchedComp = compRes && compRes.filter(function (item) { 
                            return item.CompanyNumber === cNum; 
                        });

                        if (matchedComp && matchedComp.length > 0) {
                            var d = matchedComp[0];

                            // ── UI 처리 ─────────────────────────────
                            // 상단 방문목적(#type-selector) 및 조회창(#area-construction) 숨김
                            $("#type-selector, #area-construction").hide();

                            // 데이터 바인딩 (Display 영역)
                            $("#disp_cnum").text(d.CompanyNumber);
                            $("#disp_cname").text(d.CompanyName);
                            $("#disp_ceo").text(d.ceo || "");
                            $("#disp_tel").text(d.Tel || d.Phone || "");

                            // 실제 서버 전송용 hidden 필드나 input에도 값 세팅 (필요시)
                            $("#vname").val(staffInfo.VName);
                            $("#vtel").val(staffInfo.VTel);

                            // 업체정보확인 섹션 노출
                            $("#step-company-info").fadeIn();
                            window.scrollTo({ top: 0, behavior: "smooth" });

                            // 기존 방문객 리스트 로드 함수 호출
                            if (typeof loadVisitorList === "function") {
                                loadVisitorList(d.CompanyNumber);
                            }
                        } else {
                            Swal.fire({ icon: "error", text: "사원 정보는 있으나 연결된 업체 정보가 없습니다." });
                        }
                    }
                });
            } else {
                // 정보 없을 때 일반 조회 유도 (형님 요청대로)
                Swal.fire({
                    icon: 'info',
                    text: '등록된 공사/중장비 사원 정보가 없습니다.\n일반 [미팅/납품/기타] 조회를 이용하시겠습니까?',
                    showCancelButton: true,
                    confirmButtonText: '일반 조회 이동',
                    cancelButtonText: '다시 입력'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $("#area-construction").hide();
						$(".purpose-card").removeClass("selected");
						 $("#visit_type").val("meeting");
                        $("#step-identity").show(); // 일반 조회 섹션 ID 확인 필요
						$('.purpose-card[data-type="meeting"]').addClass("selected");
                    }
                });
            }
        },
        error: function() {
            Swal.fire({ icon: 'error', text: '조회 중 시스템 에러가 발생했습니다.' });
        }
    });
}



// 미팅/납품기타 조회
function searchGeneralVisitor() {
    // 1. 예약자 성명 앞뒤 공백 제거
    var vnameVal = ($("#user-name").val() || "").trim();
    
    // 2. 전화번호는 숫자만 추출
    var vtelVal = ($("#user-tel").val() || "").replace(/[^0-9]/g, "");

    // 성명 공백 체크
    if (vnameVal === "") {
        Swal.fire({
            icon: 'warning',
            title: '입력 필수',
            text: '예약자 성명을 입력해주세요.',
            confirmButtonColor: '#2563eb' // 승인 버튼과 깔맞춤 파란색
        }).then(function() {
            $("#user-name").focus(); // 팝업 닫히면 이름 입력칸으로 커서 이동
        });
        return false; // 더 이상 진행 안 되게 막기
    }

    // 전화번호 공백 체크
    if (vtelVal === "") {
        Swal.fire({
            icon: 'warning',
            title: '입력 필수',
            text: '전화번호를 정확하게 입력해주세요.',
            confirmButtonColor: '#2563eb'
        }).then(function() {
            $("#user-tel").focus(); // 팝업 닫히면 전화번호 입력칸으로 커서 이동
        });
        return false; // 더 이상 진행 안 되게 막기
    }

    var korNameRegex = /^[가-힣]{2,}$/;
    
    if (!korNameRegex.test(vnameVal)) {
        Swal.fire({
            icon: 'warning',
            title: '입력 오류',
            text: '예약자 성명을 올바른 한글(완성형)로 입력해주세요. (예: 홍길동)',
            confirmButtonText: '확인',
            confirmButtonColor: '#2563eb'
        }).then(function() {
            $("#user-name").focus();
        });
        return false;
    }

    // [수정] 3. 예약자 성명 글자수 체크 (2자 미만일 때 차단)
    // ※ 이름이 1자 이하(0자 포함)이면 경고창을 띄웁니다.
    if (vnameVal.length < 2) {
        Swal.fire({
            icon: 'warning',
            title: '입력 오류',
            text: '예약자 성명은 2자 이상 입력하셔야 조회가 가능합니다.',
            confirmButtonText: '확인',
            confirmButtonColor: '#2563eb'
        }).then(function() {
            $("#user-name").focus();
        });
        return false;
    }

    // [추가] 4. 전화번호 최소 길이 체크 (숫자만 9자 미만일 때 차단)
    // ※ 02-123-4567 같은 서울 시내전화(9자리)까지 정상 인지하도록 '9'로 세팅
    if (vtelVal.length < 9) {
        Swal.fire({
            icon: 'warning',
            title: '입력 오류',
            text: '전화번호를 올바르게 입력해주세요. (최소 9자리 이상의 숫자)',
            confirmButtonText: '확인',
            confirmButtonColor: '#2563eb'
        }).then(function() {
            $("#user-tel").focus();
        });
        return false;
    }

    

    // 5. 검색 쿼리 및 API URL 설정
    var searchQuery = "(([rname] contains " + vnameVal + ") AND ([Tel] contains " + vtelVal + "))";
    var apiUrl = "/dwp/com/work/visitors.nsf/api/data/collections/name/req_personlist_meeting?search=" + encodeURIComponent(searchQuery);

    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json",
        timeout: 2000,
        success: function(res) {
            if (res && res.length > 0) {
                // --- [A] 기존 예약자 기록이 있는 경우 ---
                var latestDoc = res[0]; 
                
                // [요구사항] 폼에 값을 띄우기 전에 모든 필드 초기화 실행
                clearMeetingForm();
                
                // 값 세팅 시작
                $("#rname").val(latestDoc.rname); 
                $("#tel").val(latestDoc.Tel);      
                $("#birthday").val(latestDoc.VBirth); 
                $("#company").val(latestDoc.Cnum || ""); 

                var companionData = (latestDoc._togerder || "").trim(); 
                var companionHtml = "";

                if (companionData !== "") {
                    var people = companionData.split("^");
                    people.forEach(function(person) {
                        var detail = person.split("|");
                        var n = (detail[0] || "").trim(); 
                        var b = (detail[1] || "").trim(); 
                        var t = (detail[2] || "").trim(); 

                        if (n !== "") {
                            companionHtml += `
                                <div class="comp-item" style="display:flex; gap:10px; margin-bottom:5px; align-items:center; background:#f8fafc; padding:5px; border-radius:4px;">
                                    <span><strong>${n}</strong> (${b})</span>
                                    <input type="hidden" name="comp_name[]" value="${n}">
                                    <input type="hidden" name="comp_birth[]" value="${b}">
                                    <input type="hidden" name="comp_tel[]" value="${t}">
                                    <button type="button" onclick="$(this).parent().remove()" style="border:none; color:red; background:none; cursor:pointer;">&times;</button>
                                </div>`;
                        }
                    });
                }
                
                // 첫 번째 기본 row 하단에 과거 동행자 리스트 투척
                $("#comp-rows").append(companionHtml);
                
                // [요구사항] 검색 성공 시 불필요한 영역 레이아웃 숨김 처리
                $("#step-identity").hide();
                $("#type-selector").hide();
                
                // 조회창 숨기고 미팅 폼 오픈
                openMeetingForm();

            } else {
                // --- [B] 신규인 경우 ---
                Swal.fire({
                    icon: 'error',
                    title: '방문 기록 없음',
                    text: '조회된 방문 기록이 없습니다. 신규 방문 신청을 진행해 주세요',
                    confirmButtonText: '확인'
                });
            }
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: '조회 실패',
                text: '조회 중 오류가 발생했습니다. 예약자 이름과 전화번호를 정확하게 입력하세요',
                confirmButtonText: '확인'
            });
        }
    });
}

// [신규 기능] 미팅 폼 데이터 원천 초기화 함수
function clearMeetingForm() {
    var $form = $("#meeting-form");
    
    // 1. 일반 텍스트, 이메일, 생년월일, 업체명 등 모든 input 초기화
    $form.find("input[type='text']").val("");
    
    // 2. 필수 이용동의 체크박스 해제
    $("#final-agree").prop("checked", false);
    
    // 3. 모든 셀렉트 박스 첫 번째 option(선택)으로 초기화
    $form.find("select").val("");
    
    // 4. 라디오 버튼 초기 상태 세팅 (남 / 내국인 / 인터넷 아니오 기본 체크)
    $("#m").prop("checked", true);
    $("#nat_l").prop("checked", true);
    $("#w_n").prop("checked", true);
    
    // 5. 동적으로 늘어났을 수 있는 차량 및 동행자 추가 Row 제거 (첫 번째 기본 Row만 남김)
    // 기존에 append로 붙었던 컴포넌트 아이템 싹 날리기
    $form.find(".comp-item").remove(); 
    
    // 만약 차량번호나 동행자 추가 row가 여러 개 생성되어 있다면 기본 1번 row만 남기고 초기화
    $("#car-rows").html(`
        <div class="row-item">
            <span class="row-num">1</span>
            <input type="text" name="car_name[]" placeholder="차명" style="width:120px;">
            <input type="text" name="car_no[]" placeholder="차량번호" style="width:150px;">
            <button type="button" class="sw-btn btn-plus" onclick="addRow('car-rows')">+</button>
        </div>
    `);
    
    $("#comp-rows").html(`
        <div class="row-item">
            <span class="row-num">1</span>
            <input type="text" name="comp_name[]" placeholder="성함" style="width:100px;">
            <input type="text" name="comp_birth[]" placeholder="생년월일(8자리)" maxlength="8" style="width:130px;">
            <input type="text" name="comp_tel[]" placeholder="연락처" style="width:150px;">
            <button type="button" class="sw-btn btn-plus" onclick="addRow('comp-rows')">+</button>
        </div>
    `);
    
    // 6. 히든 레이어 컨텐츠 비우기
    $("#target_staff_info").text("");
    $("#staff_sabun").val("");
}

// 폼 전환 및 상단 스크롤
function openMeetingForm() {
    $("#area-general-search").hide();
    $("#meeting-form").fadeIn();
    window.scrollTo(0, 0);
}