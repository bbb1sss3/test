/**
 * 전자결재 보조양식 개별 함수
 * $dwp.app.aprv_sub158.subdoc 
 */
 (function (_$$, $) {
	_$$.aprv_sub158 = {
	   subdoc: {
 
		  /**
		   * 결재양식 화면 로딩시 수행
		   * @param {*} $doc 
		   */
		  init: function ($doc) {
			 var _me = _$$.aprv_sub158.subdoc, _opt = $doc.options, _user = {};
			//$dwp.ui.weditor.setEditorMode('view');
			//alert(_opt.isedit)
			 if (_opt.isedit) {
				_user = $dwp.core.getCurUser();
				
				if (_opt.isnew == true) {
				   $("[name=Subject]", $doc.element).xval("급여집계");
				   //_me.getERPData($doc);
				}
				_me.btn_init($doc)   //양식별 개별 버튼 이벤트 추가
				//_me.inputEvent($doc);
				console.log($("[name='grid']",$doc.element).val())
				$("[name='dd']",$doc.element).html($("[name='grid']",$doc.element).val())
			 }else{
				console.log($("[name='grid1']",$doc.element).val())
				$("[name='dd']",$doc.element).html($("[name='grid']",$doc.element).val())
			 }
			 
			
		  },
 
		  /**
		   * 화면에 추가된 버튼 클릭 이벤트
		   * @param {*} $doc 
		   */
		  btn_init: function ($doc) {
			 var _me = this;
			 $("#btn_getdata", $doc.element).off("click").on("click", function () {      //조회 버튼
				$fn.confirm({ msg: '급여집계 정보를 가져오시겠습니까?' }).done(function () {
				   //$fn.block(undefined, { notusemsg: false });
				   $fn.block();
				   var date = new Date(); 
						  var year = date.getFullYear(); 
						  var month = new String(date.getMonth()+1); 
					  var user = $dwp.core.getCurUser()
					  // 한자리수일 경우 0을 채워준다. 
					  if(month.length == 1){ 
						 month = "0" + month; 
						} 
						
						var _info1 = $dwp.cns("core.info");
						var vdocname=_info1.cuser.pinfo.name;
						var compaNO=_info1.cuser.pinfo.hrcomcode;
						var targetdate1=year + month
						var DisHTML = "";
						/*
							B3 철강케미칼
							A1 비아이피
							N1 스틸라녹산
							E1 바이펙스
						*/
						if ($fn.getCurLangMsg(vdocname, ",", "ko") =="관리자"){
							compaNO=$("[name=comcd]", $doc.element).val()
						}else if($fn.getCurLangMsg(vdocname, ",", "ko") =="정보람"){
							compaNO="I1"
						}else if($fn.getCurLangMsg(vdocname, ",", "ko") =="정승문"){
							compaNO="D1"
						}else if($fn.getCurLangMsg(vdocname, ",", "ko") =="견광필"){
							compaNO="D1"
						}else if($fn.getCurLangMsg(vdocname, ",", "ko") =="최성순"){
							compaNO=$("[name=comcd_1]", $doc.element).val()
						}
						_me.setReceiver($doc, compaNO);
						//alert(compaNO) _me.setReceiver($doc, _comcode);
				   // var _url = $fn.getPoxyUrl('/dwp/aprv/com/resoladmin.nsf/wcmdpost?createdocument');
				   var _url = $dwp.core.util.getProxyUrl('/dwp/aprv/com/aprvstart.nsf/Form158post?createdocument')
				   var _param = {                  
					  
					  actiontype: 'doc',
					  companyno:compaNO,
					  targetdate: $("[name=mYear]", $doc.element).val()+$("[name=mMonth]", $doc.element).val(),
					  WQS_Agent: "wAgtForm158Process"
				   }
				   var callback = function (data) {
					  console.log('data :', data);                  
					  
							var AllHTML="";
							var alllineRecord ;                        
							var lineRecord ;  
							var lineRecord1 ; 
							var sameRecord ; 
							
							AllHTML +='<table border="1" cellspacing="0" cellpadding="0" style="word-break: break-all; font-size: 12pt; width: 100%; border: 1px none rgb(0, 0, 0); border-collapse: collapse;">'
							AllHTML +='<tbody>'
							AllHTML +='<tr>'
							AllHTML +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; background-color: rgb(194, 194, 194);" rowspan="2">'
							AllHTML +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><span style="font-family: 굴림;">직별/구분</span></p>'
							AllHTML +='</td>'
							AllHTML +='<td style="border: 1px solid rgb(0, 0, 0); width: 4%; height: 20px; background-color: rgb(194, 194, 194);" rowspan="2">'
							AllHTML +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><span style="font-size: 12pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; font-family: 굴림;">인원수</span><br></p>'
							AllHTML +='</td>'
							AllHTML +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; background-color: rgb(194, 194, 194);" rowspan="2">'
							AllHTML +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><span style="font-family: 굴림;">급여총액</span></p>'
							AllHTML +='</td>'
							AllHTML +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; background-color: rgb(194, 194, 194);" rowspan="2">'
							AllHTML +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><span style="font-family: 굴림;">과세총액</span></p>'
							AllHTML +='</td>'
							AllHTML +='<td style="border: 1px solid rgb(0, 0, 0); width: 56%; height: 20px; background-color: rgb(194, 194, 194);" colspan="8">'
							AllHTML +='<p style="text-align: center; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"><span style="font-family: 굴림;">공 제 내 역</span></p>'
							AllHTML +='</td>'
							AllHTML +='<td style="border: 1px solid rgb(0, 0, 0); width: 8%; height: 20px; background-color: rgb(194, 194, 194);" rowspan="2">'
							AllHTML +='<p style="text-align: center; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"><span style="font-family: 굴림;">공제합계</span></p>'
							AllHTML +='</td>'
							AllHTML +='<td style="border: 1px solid rgb(0, 0, 0); width: 8%; height: 20px; background-color: rgb(194, 194, 194);" rowspan="2">'
							AllHTML +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><span style="font-family: 굴림;">차인지급액</span></p>'
							AllHTML +='</td>'
							AllHTML +='</tr>'
							
					  
					  if (data.hasOwnProperty('result')) {                                            
						 
						 if (data.result >= '200' && data.datalist != "") {
 
							//console.log(data.datalist);
							var datalist=data.datalist;
							datalist=data.datalist.replace(/(\s*)/g,"");                         
							alllineRecord = datalist.split("↙");
							
						 //----------------------헤더------------------------------------------
						 /*
 
							   3.   1번부터 8번 항목까지 표기. 8개의 항목이 채워지지않으면 공란으로 두기.
							   7번 이상이면 마지막칸은 기타. 7번 미만이면 뒤에칸은 공란
 
 
 
						 */
							   var _info1 = $dwp.cns("core.info");
							   var vdocname=_info1.cuser.pinfo.name;
							   var compaNO=_info1.cuser.pinfo.hrcomcode;
							   var targetdate1=year + month
							   var DisHTML = "";
							   /*
								   B3 철강케미칼
								   A1 비아이피
								   N1 스틸라녹산
								   E1 바이펙스
							   */
							   if ($fn.getCurLangMsg(vdocname, ",", "ko") =="관리자"){
								   compaNO=$("[name=comcd]", $doc.element).val()
							   }else if($fn.getCurLangMsg(vdocname, ",", "ko") =="정보람"){
									compaNO="I1"
								}else if($fn.getCurLangMsg(vdocname, ",", "ko") =="정승문"){
									compaNO="D1"
								}else if($fn.getCurLangMsg(vdocname, ",", "ko") =="견광필"){
									compaNO="D1"
								}else if($fn.getCurLangMsg(vdocname, ",", "ko") =="최성순"){
									compaNO=$("[name=comcd_1]", $doc.element).val()
								}
								var vf1=""
							for (var i = 0 ;i < 8 ; i++) { //헤더 갯수 대로 넣기
								  
							   lineRecord = String(alllineRecord[i]).split("↕");  
							
							   console.log("00:" + lineRecord[0]) ;
							   console.log("01:" + lineRecord[1]) ;
							   console.log("02:" + lineRecord[2]) ;
							   console.log("03:" + lineRecord[3]) ; //직급
							   console.log("04:" + lineRecord[4]) ; //직별                           
							   
							   console.log("----------------------------------------")
							   //compaNO=="F1"|| i==7 &&  비스코
							   if (i == 7 && lineRecord[1]=="기타공제1"||i == 7 && lineRecord[1]=="주차료"|| i==7 && compaNO=="N1" || i==7 && compaNO=="E1"){lineRecord[1]="기타" }
									
								if ( lineRecord[1] == undefined){ //헤드값 없으면 공백 
									lineRecord[1]=""
	
	
								}
								//console.log(compaNO+lineRecord.length)
								if(compaNO=="F1"){
									vf1=vf1+","+lineRecord[1]
								}
								
								if ( vf1 == ",건강보험,국민연금,고용보험,소득세,주민세,기타공제1,소득세정산," && compaNO=="F1" && i==7){ //헤드값 없으면 공백 
									
									lineRecord[1]="기타"


								}else if(vf1 == ",건강보험,국민연금,고용보험,소득세,주민세,기타공제1,소득세정산,소득세정산" && compaNO=="F1" && i==7){
									lineRecord[1]="기타"
								}
							   
							   AllHTML=AllHTML+_me.rtnTopRowTR(lineRecord[1])
							}
							
							//-------------------표밑하단 기타공제 ----------------
							var etcgongje;
							var etcgongje1;
							var etcgongje2;
							etcgongje=data.etcgongje.replace(/(\s*)/g,"");
							etcgongje=etcgongje.substr(1); 						                          
							etcgongje=etcgongje.split(",");
							for (var i = 0 ;i < etcgongje.length ; i++) { 
								etcgongje1=etcgongje[i].split("↕");
								if(etcgongje1[1] != "0"  ){
									
										etcgongje2=etcgongje2+","+etcgongje[i]
									
									
								}
							}
						 //--------------------------------내용----------------------------------
							//console.log(data.datalist1);
 
							datalist=data.datalist1.replace(/(\s*)/g,"");                         
							alllineRecord = datalist.split("↙");
							
							var team="";
							var team_pre="";
							var teamcd="";
							var inwon="";
							var pay="";
							var overpay="";
							var health="";
							var kukmin="";
							var koyung="";
							var soduk="";
							var jumin="";
							var sangjo="";
							var etc="";
							var etc1="";
							var gongjesum="";
							var minorsum="";
							var deptcd="";
							var vdeptcd="";
							var costcd="";
							var ik=0;
 
							
							var inwon_so=0;
							var inwon_so1=0;
							var allinwon=0;
							var kum_so=0;
							var kum_so1=0;
							var allkum=0;
							var overkum_so=0;
							var overkum_so1=0;
							var allover=0;
							var health_so=0;
							var health_so1=0;
							var allhealth=0;
							var kukmin_so=0;
							var kukmin_so1=0;
							var allkukmin=0;
							var koyung_so=0;
							var koyung_so1=0;
							var allkoyung=0;
							var soduk_so=0;
							var soduk_so1=0;
							var allsoduk=0;
							var jumin_so=0;
							var jumin_so1=0;
							var alljumin=0;
							var sangjo_so=0;
							var sangjo_so1=0;
							var alljangjo=0;
							var etc_so=0;
							var etc_so1=0;
							var alletcsum=0;
							var etc_so_1=0;
							var etc_so_11=0;
							var alletc_1sum=0;
 
							var gongje_so=0;
							var gongje_so1=0;
							var allgongje=0;
							var minor_so=0;
							var minor_so1=0;
							var allminor=0;
 
							var lineRecord1 ; 
							var slineRecord3 ; 
							var bigo;
							var bigo1;
							//typecd 이전값 비교하기위해 배열 생성
							var beforejikgubun="";
							var deptcdary="";
							var deptnameary="";
							var samelastchar;
							var sameteaminwon=0 , samepayallum=0,sameoverpay=0 , samehealth=0;
							//소계명칭 가져오는 로직
							for (var j = 0 ;j < alllineRecord.length ; j++) {
							   lineRecord1 = String(alllineRecord[j]).split("↕");  
							   
							   if (compaNO == "A1"){
								  beforejikgubun=beforejikgubun+"^"+lineRecord1[3]   //deptcd "비서실" 등
							   }else if(compaNO == "E1"){
								beforejikgubun=beforejikgubun+"^"+lineRecord1[2]   //TYPECD "순번"  
							 } else{
								  beforejikgubun=beforejikgubun+"^"+lineRecord1[21]   //costcd "순번"  
							   } 
								 
							   deptcdary=deptcdary+"^"+lineRecord1[3] //deptcd
							   if (compaNO == "A1"){
								deptnameary=deptnameary+"^"+lineRecord1[6]      //deptname   
							   }else{
								deptnameary=deptnameary+"^"+lineRecord1[4]+lineRecord1[21]      //cost_cd   
							   }
							  
							   sameteaminwon=sameteaminwon+"^"+lineRecord1[0] //인원수  
							   samepayallum=samepayallum+"^"+lineRecord1[9] //급여총액 
							   sameoverpay=sameoverpay+"^"+lineRecord1[10] //과세총액              
							   samehealth=samehealth+"^"+lineRecord1[11] //건강보험  
							}
							
							/*

								//직별/구분 명칭 
							   if (compaNO == "A1"){
								  team=lineRecord[6] // team_nm "경영기획팀"
							   }else{
								  team=lineRecord[4] // dept_nm "비서실"
							   }    			
							*/
							//typecdarray
							beforejikgubun=beforejikgubun.replace(/(\s*)/g,"");
							beforejikgubun=beforejikgubun.substr(1);                           
							beforejikgubun=beforejikgubun.split("^");
 
							//deptcd array
							deptcdary=deptcdary.replace(/(\s*)/g,"");
							deptcdary=deptcdary.substr(1);                           
							deptcdary=deptcdary.split("^");
 
							//deptname array
							deptnameary=deptnameary.replace(/(\s*)/g,"");
							deptnameary=deptnameary.substr(1);                           
							deptnameary=deptnameary.split("^");
							
							//중복부서 중복갯수 구하기 
							var deptnameary2;					
							const deptnameary1 = {};
							deptnameary.forEach((x) => { 
								 deptnameary1[x] = (deptnameary1[x] || 0)+1; 
							});
													
							//console.log(JSON.stringify(deptnameary1))	
							deptnameary2=JSON.stringify(deptnameary1)
							
							console.log(deptnameary2);
							deptnameary2=deptnameary2.replace("{","")
							deptnameary2=deptnameary2.replace("}","")
							deptnameary2=deptnameary2.split(",")
							var maxdeptcount="";
							 for (var j = 0 ;j < deptnameary2.length ; j++) {
								 deptnameary3=deptnameary2[j].split(":");
								 
								 if(deptnameary3[1] != 1){
									 maxdeptcount=maxdeptcount+"^"+deptnameary2[j]
								 }
							 }
							 //팀이름 + cost_cd 
							 // 중복부서와 중복갯수
							maxdeptcount=maxdeptcount.substr(1);
							maxdeptcount=maxdeptcount.replace(/\s/gi, "")	
							maxdeptcount=maxdeptcount.replace(/\"/gi,"");

							console.log(maxdeptcount)
							if (compaNO == "A1"){
								maxdeptcount="없음:0" // 비아이피는 안탐
							}

							
							//비서실 : 3 중복 2개일 경우 비서실:3^임원:2
							//console.log(maxdeptcount)
							//jsondata.item1[0].val2
						

							//같은팀 체크 인원수 array
							sameteaminwon=sameteaminwon.replace(/(\s*)/g,"");
							sameteaminwon=sameteaminwon.substr(1);                           
							sameteaminwon=sameteaminwon.split("^");

							//같은팀 체크 급여액 array
							samepayallum=samepayallum.replace(/(\s*)/g,"");
							samepayallum=samepayallum.substr(1);                           
							samepayallum=samepayallum.split("^");
 
							//같은팀 체크 과세총액 array
							sameoverpay=sameoverpay.replace(/(\s*)/g,"");
							sameoverpay=sameoverpay.substr(1);                           
							sameoverpay=sameoverpay.split("^");

							//같은팀 체크 건강보험 array
							samehealth=samehealth.replace(/(\s*)/g,"");
							samehealth=samehealth.substr(1);                           
							samehealth=samehealth.split("^");
	 
 
							if (compaNO == "A1"){ //비아이피 일때만
							   // 직별 이전값 배열 배열 생성
							   var beforejikgubun1="";
							   for (var j = 0 ;j < alllineRecord.length ; j++) {
								  lineRecord1 = String(alllineRecord[j]).split("↕");  
								  
								  beforejikgubun1=beforejikgubun1+"^"+lineRecord1[4]
															 
													
							   }
							   beforejikgubun1=beforejikgubun1.replace(/(\s*)/g,"");
							   beforejikgubun1=beforejikgubun1.substr(1)
							   //console.log(beforejikgubun1)
							   beforejikgubun1=beforejikgubun1.split("^");
							}


							//같은값 전역변수
							var sameinwonsum=0;
							var sameinwonsum1=0;
							var samepaysum=0;
							var samepaysum1=0;
							var vsameoverpay=0;
							var vsameoverpay1=0;
							var vsamehealth=0;
							var vsamehealth1=0;
							var vsamekukmin=0 , vsamekukmin1=0;
							var vkoyung=0 , vkoyung1=0;
							var vsoduk=0,vsoduk1=0;
							var vjumin=0 , vjumin1=0;
							var vsangjo=0,vsangjo1=0;
							var vetc=0,vetc12=0;
							var vetc1=0,vetc1_1=0;
							var vgongjesum=0, vgongjesum1=0;
							var vminorsum=0,vminorsum1=0;

							var sameinwon2=0;
							var cnt=0; //같은부서 갯수세기
							var samecnt=0;
							var samecnt1=0;
							var maxdeptcount33;
							var sadeptcount;
							for (var i = 0 ;i < alllineRecord.length ; i++) { //중간 표 값
								  
							   lineRecord = String(alllineRecord[i]).split("↕");  
							   if (i==0){
								  ik=0
							   }else{
								  ik=1
							   }
							   //console.log("00인원수:" + lineRecord[0]) ;
 
							   deptcd=lineRecord[2] //typecd
							   vdeptcd=lineRecord[3] //deptcd
							   
								
							   //직별/구분 명칭 
							   if (compaNO == "A1"){
								  team=lineRecord[6] // team_nm "경영기획팀"
							   }else{
								  team=lineRecord[4] // dept_nm "비서실"
							   }     
							   
							//"3↕0↕A↕B02↕기술과↕↕↕null↕37621.53↕7862900↕7862900↕295010↕228730↕41350↕165790↕16560↕0↕0↕-1153090↕-405650↕8268550↕A"
										teamcd=lineRecord[5] // 부서코드
										inwon=lineRecord[0] //인원수
										pay=lineRecord[9] //급여총액
										overpay=lineRecord[10] //과세총액
										
										health=lineRecord[11] //건강보험
										kukmin=lineRecord[12] //국민연금
										if( compaNO=="D1"){ //에스앤비
											//koyung=lineRecord[13] //소득세
											//soduk=lineRecord[15] //주민세
											//jumin="0" //
											koyung=lineRecord[13] //고용
											soduk=lineRecord[14] //소득세
											jumin=lineRecord[15] //주민세
										}else{
											koyung=lineRecord[13] //고용
											soduk=lineRecord[14] //소득세
											jumin=lineRecord[15] //주민세
										}
										

									
										//2월 이고 비엔빌딩이면 기타값을 상조에 넣어줌 소득세정산값과 중간값이 안맞음
										if($("[name=mMonth]", $doc.element).val() =="02" && compaNO=="I1"){ //비엔빌딩
											sangjo=lineRecord[18] //소득세정산
											etc=lineRecord[16] //써클회비
											etc1=lineRecord[17] //정산
										}else if($("[name=mMonth]", $doc.element).val() =="02" && compaNO=="P1"){ //BK
											sangjo=lineRecord[18] //소득세정산
											etc=lineRecord[16] //써클회비
											etc1=lineRecord[17] //정산
										}else if($("[name=mMonth]", $doc.element).val() =="02" && compaNO=="C1"){ //코스모
											sangjo=lineRecord[16] //상조
											etc=lineRecord[18] //써클회비
											etc1=lineRecord[17] //기타
										}else if($("[name=mMonth]", $doc.element).val() =="02" && compaNO=="F1"){ //비스코
											sangjo=lineRecord[16] //상조
											etc=lineRecord[18] //소득세정산이 18로 넘어옴
											etc1=lineRecord[17] //기타
										}else if($("[name=mMonth]", $doc.element).val() =="02" && compaNO=="B3"){ //케미칼
											sangjo=lineRecord[16] //상조
											etc=lineRecord[18] //소득세정산이 18로 넘어옴
											etc1=lineRecord[17] //기타
										}else if( compaNO=="D1"){ //에스앤비
											sangjo="0"//상조
											etc="0" //소득세정산이 18로 넘어옴
											etc1="0" //기타
										}else{
											sangjo=lineRecord[16] //상조
											etc=lineRecord[17] //써클회비
											etc1=lineRecord[18] //기타
										}
									
										
										gongjesum=lineRecord[19] //공제합계
										minorsum=lineRecord[20] //차인지급액
										costcd=lineRecord[21] //비아이피 외 소계 정렬방법
						
 
 
							   console.log(etc)
							   console.log(etc1)
							   //총계 
							   allinwon=allinwon+parseInt(inwon);//인원수
							   allkum=allkum+parseInt(pay);//급여총액
							   allover=allover+parseInt(overpay);//과세총액
							   allhealth=allhealth+parseInt(health);//건강보험
							   allkukmin=allkukmin+parseInt(kukmin);//국민연금
							   allkoyung=allkoyung+parseInt(koyung);//고용보험
							   allsoduk=allsoduk+parseInt(soduk);//소득세
							   alljumin=alljumin+parseInt(jumin);//주민세
							   alljangjo=alljangjo+parseInt(sangjo);//상조
							   alletcsum=alletcsum+parseInt(etc);//써클회비
							   alletc_1sum=alletc_1sum+parseInt(etc1);//기타
							   allgongje=allgongje+parseInt(gongjesum);//공제
							   allminor=allminor+parseInt(minorsum);//차인지급액
 
							   //비아피일경우 
							  // console.log("~~~~~~~~~~~~"+allkum)
							   //inwon_so=parseInt(inwon_so)+parseInt(inwon); //소계 합계
							   if (compaNO == "A1"){bigo1=lineRecord[3]}else if(compaNO == "E1"){bigo1=lineRecord[2]} else{bigo1=lineRecord[21]} // 비아피면 dpetcd비교 그 외는 cost_cd로 비교
							   if (compaNO == "A1"){bigo=beforejikgubun1[i-1]}else{bigo="소계"} // 비아피는 소계를 직별로 바꿈
							   if (compaNO == "A1"){
								  if (teamcd == ""){team="임원"}
							   }
							   //compaNO="C1" 코스모 이면 
							   //deptcdary deptnameary
							   //console.log(vdeptcd+"~~~~~~~~~~~~"+deptcdary[i-ik])
							   //console.log(team+"!!!!!!!!!" +deptnameary[i-ik])
							   //console.log("디비:" + bigo1 +" :::::::::::: 비교값"+beforejikgubun[i-ik]) ; //직별   
							   //console.log(vdeptcd+team+"~~~~~~~~~~~~"+deptcdary[i]+deptnameary[i])
							   //console.log("~~~~~~~~~~~~"+deptcdary[i]+deptnameary[i])
							   
							   if(bigo1 != beforejikgubun[i-ik] ){ //typecd다르면 행 추가 소계
								  //console.log("소계:" + inwon_so) ;
								  
 
								  //console.log(team+"!!!!!!!!!" +deptnameary[i-ik])
 
								  //소계
								  inwon_so=parseInt(inwon_so1);                                 
								  inwon_so1=parseInt(inwon);
								  kum_so=parseInt(kum_so1);
								  kum_so1=parseInt(pay);
								  overkum_so=parseInt(overkum_so1);
								  overkum_so1=parseInt(overpay);
								  health_so=parseInt(health_so1);
								  health_so1=parseInt(health);
								  kukmin_so=parseInt(kukmin_so1);
								  kukmin_so1=parseInt(kukmin);
								  koyung_so=parseInt(koyung_so1);
								  koyung_so1=parseInt(koyung);
								  soduk_so=soduk_so1;
								  soduk_so1=parseInt(soduk);
								  jumin_so=parseInt(jumin_so1);
								  jumin_so1=parseInt(jumin);
								  sangjo_so=parseInt(sangjo_so1);
								  sangjo_so1=parseInt(sangjo);
								  etc_so=parseInt(etc_so1);
								  etc_so1=parseInt(etc);
								  etc_so_1=parseInt(etc_so_11);
								  etc_so_11=parseInt(etc1);
								  gongje_so=parseInt(gongje_so1);
								  gongje_so1=parseInt(gongjesum);
								  minor_so=parseInt(minor_so1);
								  minor_so1=parseInt(minorsum);



								  //maxdeptcount33[0]:중복부서 maxdeptcount33[1]:중복부서 갯수
								
									//중복부서와 비교
							
									//중복부서가 2개일때
									if(maxdeptcount.indexOf("^") > -1){
													
										maxdeptcount33=maxdeptcount

												if(maxdeptcount33.indexOf(team) ==0 ){ // for문 전에 구해놓은 중복부서와 같으면 기계가공
													samecnt=samecnt+1;
													sameinwonsum=sameinwonsum+parseInt(inwon)
													samepaysum=samepaysum+parseInt(pay);
													vsameoverpay=vsameoverpay+parseInt(overpay)
													vsamehealth=vsamehealth+parseInt(health)
													vsamekukmin=vsamekukmin+parseInt(kukmin)
													vkoyung=vkoyung+parseInt(koyung)
													vsoduk=vsoduk+parseInt(soduk)
													vjumin=vjumin+parseInt(jumin)
													vsangjo=vsangjo+parseInt(sangjo)
													vetc=vetc+parseInt(etc)
													vetc1=vetc1+parseInt(etc1)
													vgongjesum=vgongjesum+parseInt(gongjesum)
													vminorsum=vminorsum+parseInt(minorsum)

													maxdeptcount33=maxdeptcount.split("^");
													samelastchar = maxdeptcount33[0].charAt(maxdeptcount33[0].length-1); //마지막문자 중복갯수
													samelastchar=parseInt(samelastchar)

												if(samecnt == samelastchar){ // 현재 돌고있는 for문 중복문서 갯수와 미리구한 중복값이 같으면	
													console.log(bigo1 +"###"+ beforejikgubun[i-ik]) 								
														_me.rtnMIDRowTR(team,sameinwonsum,samepaysum,vsameoverpay,vsamehealth,vsamekukmin,vkoyung,vsoduk,vjumin,vsangjo,vetc,vetc1,vgongjesum,vminorsum)
													}
													
												}else if(maxdeptcount33.indexOf(team) ==9 ){ // for문 전에 구해놓은 중복부서와 같으면 조립팀
													samecnt1=samecnt1+1;
													sameinwonsum1=sameinwonsum1+parseInt(inwon)
													samepaysum1=samepaysum1+parseInt(pay);
													vsameoverpay1=vsameoverpay1+parseInt(overpay)
													vsamehealth1=vsamehealth1+parseInt(health)
													vsamekukmin1=vsamekukmin1+parseInt(kukmin)

													vkoyung1=vkoyung1+parseInt(koyung)
													vsoduk1=vsoduk1+parseInt(soduk)
													vjumin1=vjumin1+parseInt(jumin)
													vsangjo1=vsangjo1+parseInt(sangjo)
													vetc12=vetc+parseInt(etc)
													vetc1_1=vetc1+parseInt(etc1)
													vgongjesum1=vgongjesum1+parseInt(gongjesum)
													vminorsum1=vminorsum1+parseInt(minorsum)



													maxdeptcount33=maxdeptcount.split("^");
													samelastchar = maxdeptcount33[1].charAt(maxdeptcount33[1].length-1); //마지막문자 중복갯수
													samelastchar=parseInt(samelastchar)
													
			
													if(samecnt1 == samelastchar){ // 현재 돌고있는 for문 중복문서 갯수와 미리구한 중복값이 같으면									
														AllHTML=AllHTML+_me.rtnMIDRowTR(team,sameinwonsum1,samepaysum1,vsameoverpay1,vsamehealth1,vsamekukmin1,vkoyung1,vsoduk1,vjumin1,vsangjo1,vetc12,vetc1_1,vgongjesum1,vminorsum1)
														

														
													}
													
												}else{
													
													
												}
										
										
										}else{


											//중복부서 한개
											//console.log("한개")
											//maxdeptcount=maxdeptcount.split(":");
											maxdeptcount33=maxdeptcount.split(":");
											

											if(team+costcd == maxdeptcount33[0]){ // for문 전에 구해놓은 중복부서와 같으면
												samecnt=samecnt+1;
												sameinwonsum=sameinwonsum+parseInt(inwon)
												samepaysum=samepaysum+parseInt(pay);
												vsameoverpay=vsameoverpay+parseInt(overpay)
												vsamehealth=vsamehealth+parseInt(health)
												vsamekukmin=vsamekukmin+parseInt(kukmin)
												vkoyung=vkoyung+parseInt(koyung)
													vsoduk=vsoduk+parseInt(soduk)
													vjumin=vjumin+parseInt(jumin)
													vsangjo=vsangjo+parseInt(sangjo)
													vetc=vetc+parseInt(etc)
													vetc1=vetc1+parseInt(etc1)
													vgongjesum=vgongjesum+parseInt(gongjesum)
													vminorsum=vminorsum+parseInt(minorsum)
		
												if(samecnt == maxdeptcount33[1]){ // 현재 돌고있는 for문 중복문서 갯수와 미리구한 중복값이 같으면									
													AllHTML=AllHTML+_me.rtnMIDRowTR(team,sameinwonsum,samepaysum,vsameoverpay,vsamehealth,vsamekukmin,vkoyung,vsoduk,vjumin,vsangjo,vetc,vetc1,vgongjesum,vminorsum)
												}
												
											}
									}
									
									if ((compaNO == "C1" && i==8) || (compaNO == "N1" && i==1)){
										AllHTML=AllHTML+_me.rtnDiffrentRowTR(inwon_so,bigo,kum_so,overkum_so,health_so,kukmin_so,koyung_so,soduk_so,jumin_so,sangjo_so,etc_so,etc_so_1,gongje_so,minor_so)									
									//	+_me.rtnMIDRowTR(team,inwon,pay,overpay,health,kukmin,koyung,soduk,jumin,sangjo,etc,etc1,gongjesum,minorsum)
									}else{
										AllHTML=AllHTML+_me.rtnDiffrentRowTR(inwon_so,bigo,kum_so,overkum_so,health_so,kukmin_so,koyung_so,soduk_so,jumin_so,sangjo_so,etc_so,etc_so_1,gongje_so,minor_so)									
									+_me.rtnMIDRowTR(team,inwon,pay,overpay,health,kukmin,koyung,soduk,jumin,sangjo,etc,etc1,gongjesum,minorsum)
									}
								  
								  
								  
							   }else{// 일반 데이터 
									 
								 // console.log(team+" ------" +deptnameary[i-ik])
						

									
								 //sameRecord
											//console.log(team +"------222--------"+deptnameary[i-ik]+" : "+sameteaminwon[i+ik])
										///	console.log(team +"------333--------"+deptnameary[i+ik]+" : "+sameteaminwon[i+ik])

											

										
											inwon_so1=inwon_so1+parseInt(inwon);
											kum_so1=kum_so1+parseInt(pay);
											overkum_so1=overkum_so1+parseInt(overpay);
											health_so1=health_so1+parseInt(health);
											kukmin_so1=kukmin_so1+parseInt(kukmin);
											koyung_so1=koyung_so1+parseInt(koyung);
											soduk_so1=soduk_so1+parseInt(soduk);
											jumin_so1=jumin_so1+parseInt(jumin);
											sangjo_so1=sangjo_so1+parseInt(sangjo);
											etc_so1=etc_so1+parseInt(etc);
											etc_so_11=etc_so_11+parseInt(etc1);
											gongje_so1=gongje_so1+parseInt(gongjesum);
											minor_so1=minor_so1+parseInt(minorsum);
											
											
										
											//console.log(" "+team +"------222--------"+deptnameary[i-ik])
											//console.log(maxdeptcount.indexOf("^"))
											//console.log(team+" 이전부서  ==="+deptnameary[i-ik])
											//console.log(" 이전부서=="+deptnameary[i-ik]+"  "+team+ "  뒤에부서=="+deptnameary[i+ik])
											//중복부서가 2개일때
									if(maxdeptcount.indexOf("^") > -1){
													
										maxdeptcount33=maxdeptcount

												if(maxdeptcount33.indexOf(team) ==0 ){ // for문 전에 구해놓은 중복부서와 같으면 기계가공
													samecnt=samecnt+1;
													sameinwonsum=sameinwonsum+parseInt(inwon)
													samepaysum=samepaysum+parseInt(pay);
													vsameoverpay=vsameoverpay+parseInt(overpay)
													vsamehealth=vsamehealth+parseInt(health)
													vsamekukmin=vsamekukmin+parseInt(kukmin)
													vkoyung=vkoyung+parseInt(koyung)
													vsoduk=vsoduk+parseInt(soduk)
													vjumin=vjumin+parseInt(jumin)
													vsangjo=vsangjo+parseInt(sangjo)
													vetc=vetc+parseInt(etc)
													vetc1=vetc1+parseInt(etc1)
													vgongjesum=vgongjesum+parseInt(gongjesum)
													vminorsum=vminorsum+parseInt(minorsum)

													maxdeptcount33=maxdeptcount.split("^");
													samelastchar = maxdeptcount33[0].charAt(maxdeptcount33[0].length-1); //마지막문자 중복갯수
													samelastchar=parseInt(samelastchar)
													if(samecnt == samelastchar){ // 현재 돌고있는 for문 중복문서 갯수와 미리구한 중복값이 같으면									
														AllHTML=AllHTML+_me.rtnMIDRowTR(team,sameinwonsum,samepaysum,vsameoverpay,vsamehealth,vsamekukmin,vkoyung,vsoduk,vjumin,vsangjo,vetc,vetc1,vgongjesum,vminorsum)
													}
													
												}else if(maxdeptcount33.indexOf(team) ==9 ){ // for문 전에 구해놓은 중복부서와 같으면 조립팀
													samecnt1=samecnt1+1;
													sameinwonsum1=sameinwonsum1+parseInt(inwon)
													samepaysum1=samepaysum1+parseInt(pay);
													vsameoverpay1=vsameoverpay1+parseInt(overpay)
													vsamehealth1=vsamehealth1+parseInt(health)
													vsamekukmin1=vsamekukmin1+parseInt(kukmin)

													vkoyung1=vkoyung1+parseInt(koyung)
													vsoduk1=vsoduk1+parseInt(soduk)
													vjumin1=vjumin1+parseInt(jumin)
													vsangjo1=vsangjo1+parseInt(sangjo)
													vetc12=vetc+parseInt(etc)
													vetc1_1=vetc1+parseInt(etc1)
													vgongjesum1=vgongjesum1+parseInt(gongjesum)
													vminorsum1=vminorsum1+parseInt(minorsum)

													maxdeptcount33=maxdeptcount.split("^");
													samelastchar = maxdeptcount33[1].charAt(maxdeptcount33[1].length-1); //마지막문자 중복갯수
													samelastchar=parseInt(samelastchar)
													if(samecnt1 == samelastchar){ // 현재 돌고있는 for문 중복문서 갯수와 미리구한 중복값이 같으면									
														AllHTML=AllHTML+_me.rtnMIDRowTR(team,sameinwonsum1,samepaysum1,vsameoverpay1,vsamehealth1,vsamekukmin1,vkoyung1,vsoduk1,vjumin1,vsangjo1,vetc12,vetc1_1,vgongjesum1,vminorsum1)
													}
													
												}else{

													AllHTML=AllHTML+_me.rtnMIDRowTR(team,inwon,pay,overpay,health,kukmin,koyung,soduk,jumin,sangjo,etc,etc1,gongjesum,minorsum)
												}
										
										
										}else{

											
											//중복부서 한개
											//console.log("한개")
											//maxdeptcount=maxdeptcount.split(":");
											maxdeptcount33=maxdeptcount.split(":");
											

											if(team+costcd == maxdeptcount33[0]){ // for문 전에 구해놓은 중복부서와 같으면
												samecnt=samecnt+1;
												sameinwonsum=sameinwonsum+parseInt(inwon)
												samepaysum=samepaysum+parseInt(pay);
												vsameoverpay=vsameoverpay+parseInt(overpay)
												vsamehealth=vsamehealth+parseInt(health)
												vsamekukmin=vsamekukmin+parseInt(kukmin)
												vkoyung=vkoyung+parseInt(koyung)
												vsoduk=vsoduk+parseInt(soduk)
												vjumin=vjumin+parseInt(jumin)
												vsangjo=vsangjo+parseInt(sangjo)
												vetc=vetc+parseInt(etc)
												vetc1=vetc1+parseInt(etc1)
												vgongjesum=vgongjesum+parseInt(gongjesum)
												vminorsum=vminorsum+parseInt(minorsum)
		
												if(samecnt == maxdeptcount33[1]){ // 현재 돌고있는 for문 중복문서 갯수와 미리구한 중복값이 같으면									
													AllHTML=AllHTML+_me.rtnMIDRowTR(team,sameinwonsum,samepaysum,vsameoverpay,vsamehealth,vsamekukmin,vkoyung,vsoduk,vjumin,vsangjo,vetc,vetc1,vgongjesum,vminorsum)
												}
												
											}else{
												AllHTML=AllHTML+_me.rtnMIDRowTR(team,inwon,pay,overpay,health,kukmin,koyung,soduk,jumin,sangjo,etc,etc1,gongjesum,minorsum)
											}




									}
									
											
											
									

								
							

							}
 
 
							   if (  alllineRecord.length-1 == i ){ // 제일 마지막 소계 총계 추가
								  inwon_so=parseInt(inwon_so1)
								  inwon_so1=parseInt(inwon);   
								  kum_so=parseInt(kum_so1);
								  kum_so1=parseInt(pay);
								  overkum_so=parseInt(overkum_so1)
								  overkum_so1=parseInt(overpay);
								  health_so=parseInt(health_so1);
								  health_so1=parseInt(health);
								  kukmin_so=parseInt(kukmin_so1);
								  kukmin_so1=parseInt(kukmin);
								  koyung_so=parseInt(koyung_so1);
								  koyung_so1=parseInt(koyung);
								  soduk_so=parseInt(soduk_so1);
								  soduk_so1=parseInt(soduk);
								  jumin_so=parseInt(jumin_so1);
								  jumin_so1=parseInt(jumin);
								  sangjo_so=parseInt(sangjo_so1);
								  sangjo_so1=parseInt(sangjo);
								  etc_so=parseInt(etc_so1);
								  etc_so1=parseInt(etc);
								  etc_so_1=parseInt(etc_so_11);
								  etc_so_11=parseInt(etc1);
								  gongje_so=parseInt(gongje_so1);
								  gongje_so1=parseInt(gongjesum);
								  minor_so=parseInt(minor_so1);
								  minor_so1=parseInt(minorsum);
								  AllHTML=AllHTML+_me.rtnDiffrentRowTR(inwon_so,bigo,kum_so,overkum_so,health_so,kukmin_so,koyung_so,soduk_so,jumin_so,sangjo_so,etc_so,etc_so_1,gongje_so,minor_so)+ //소계
										_me.rtnTopRowTR2(allinwon,allkum,allover,allhealth,allkukmin,allkoyung,allsoduk,alljumin,alljangjo,alletcsum,alletc_1sum,allgongje,allminor) //총계
								  
							   }
							   
							   
							}
 
							console.log("----------------------------------------"+etcgongje2)
							var etcgongje3
							//-------------최종 투입------------------------------
							//console.log(finaletcgoje)
							if (etcgongje2==undefined || etcgongje2=="undefined,"){
								//$dwp.ui.weditor.setHtmlValue(AllHTML+"</tbody></table>");
								$("[name='grid']",$doc.element).val(AllHTML+"</tbody></table>")
							}else{
								var finaletcgoje=etcgongje2.replace("undefined","");
								var etckoje="기타공제 : "
								console.log(finaletcgoje)
								if(finaletcgoje == ","){
	
									etckoje=""
								}
								finaletcgoje=finaletcgoje.substr(1)
								finaletcgoje=finaletcgoje.replace("↕","=");
								finaletcgoje=finaletcgoje.replace("↕","=")
								finaletcgoje=finaletcgoje.replace("↕","=")
							
								//$dwp.ui.weditor.setHtmlValue(AllHTML+"</tbody></table><br>"+etckoje+finaletcgoje.replace("↕","="));
								$("[name='grid']",$doc.element).val(AllHTML+"</tbody></table><br>"+etckoje+finaletcgoje.replace("↕","="))
							}

							$("[name='dd']",$doc.element).html($("[name='grid']",$doc.element).val())
							
							
							$fn.unblock();
							//$dwp.ui.weditor.setEditorMode("e")
						 } else {
							$fn.alert({ msg: '조회정보가 없습니다.' });
						//	$dwp.ui.weditor.setHtmlValue("");
							$("[name='grid']",$doc.element).val("");
							$("[name='dd']",$doc.element).html("");
							$fn.unblock();
						 }
					  } else {
						 $fn.alert({ msg: '조회정보가 없습니다.' });
						 //$dwp.ui.weditor.setHtmlValue("");
						 $("[name='grid']",$doc.element).val("");
						 $("[name='dd']",$doc.element).html("");
						 $fn.unblock();
					  }
				   };
				   $fn.cmdPost(_url, _param, callback, 'json');
				});
				//_me.getERPData($doc);
				// 
			 });
		  },
 
 
		   rtnTopRowTR : function ( headval ) { //헤더
			 var TTopRowTR ;
			 var TTopRowTR1 ;
			 TTopRowTR  = '';            
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 30px; background-color: rgb(194, 194, 194);">'
			 TTopRowTR +='<p style="font-size: 12pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><span style="font-family: 굴림;">'+headval+'</span></p>'
			 TTopRowTR +='</td>'               
			 return TTopRowTR   ;
		  }
		  ,
 
 
		   rtnMIDRowTR : function ( team,inwon,pay,overpay,health,kukmin,koyung,soduk,jumin,sangjo,etc,etc1,gongjesum,minorsum) {
			 var TTopRowTR ;
			 var TTopRowTR1 ;
			 var bigyo=1;
			 var bigyo1=1;
			 var _info1 = $dwp.cns("core.info");
			 var vdocname=_info1.cuser.pinfo.name;
			 var compaNO=_info1.cuser.pinfo.hrcomcode;
			if ($fn.getCurLangMsg(vdocname, ",", "ko") =="관리자"){
				compaNO=$("[name=comcd]").val()
			}
		  
			 TTopRowTR  = '';

			 pay=pay+"";
			 overpay=overpay+""
			 health=health+""
			 kukmin=kukmin+""
			 koyung=koyung+""
			 soduk=soduk+""
			 jumin=jumin+""
			 sangjo=sangjo+""
			 etc=etc+""
			 etc1=etc1+""
			 gongjesum=gongjesum+""
			 minorsum=minorsum+""
			 if(jumin == "0"){jumin=""}else{jumin=jumin.toComma()}
			 if(sangjo == "0"){sangjo=""}else{sangjo=sangjo.toComma()}
			 if(koyung == "0"){koyung=""}else{koyung=koyung.toComma()}
			 if(etc == "0"){etc=""}else{etc=etc.toComma()}
			 if(etc1 == "0"){etc1=""}else{etc1=etc1.toComma()}
			 TTopRowTR +='<tr>'			 
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><span style="font-family: 굴림;">'+team+'</span></p>'
			 TTopRowTR +='</td>'      
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 3%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><span style="font-family: 굴림;">'+inwon+'</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+pay.toComma()+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+overpay.toComma()+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+health.toComma()+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%x; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+kukmin.toComma()+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+koyung+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+soduk.toComma()+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+jumin.toComma()+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 
				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+sangjo+'&nbsp;</span></p>'
				TTopRowTR +='</td>'   
				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+etc+'&nbsp;</span></p>'
				TTopRowTR +='</td>'   
				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+etc1+'&nbsp;</span></p>'
				TTopRowTR +='</td>'  

			 
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 8%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+gongjesum.toComma()+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 8%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 9pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><span style="font-family: 굴림;">'+minorsum.toComma()+'&nbsp;</span></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='</tr>'
			
		  	 
		
		  
			 
			 
 
	
			 return TTopRowTR   ;
		  }
		  ,
 
		  //다르면 호출
		   rtnDiffrentRowTR : function (inwon_so,bigo,pay,overpay,health_so,kukmin_so,koyung_so,soduk_so,jumin_so,sangjo_so,etc_so,etc_so_1,gongje_so,minor_so ) {
			 var TTopRowTR ;

			 pay=pay+"";
			 overpay=overpay+""
			 health_so=health_so+""
			 kukmin_so=kukmin_so+""
			 koyung_so=koyung_so+""
			 soduk_so=soduk_so+""
			 jumin_so=jumin_so+""
			 sangjo_so=sangjo_so+""
			 etc_so=etc_so+""
			 etc_so_1=etc_so_1+""
			 gongje_so=gongje_so+""
			 minor_so=minor_so+""

			 var _info1 = $dwp.cns("core.info");
			 var vdocname=_info1.cuser.pinfo.name;
			 var compaNO=_info1.cuser.pinfo.hrcomcode;
			if ($fn.getCurLangMsg(vdocname, ",", "ko") =="관리자"){
				compaNO=$("[name=comcd]").val()
			}
			if(jumin_so == "0"){jumin_so=""}else{jumin_so=jumin_so.toComma()}
			if(sangjo_so == "0"){sangjo_so=""}else{sangjo_so=sangjo_so.toComma()}
			if(koyung_so == "0"){koyung_so=""}else{koyung_so=koyung_so.toComma()}
			if(etc_so == "0"){etc_so=""}else{etc_so=etc_so.toComma()}
			if(etc_so_1 == "0"){etc_so_1=""}else{etc_so_1=etc_so_1.toComma()}
			 TTopRowTR="";
			 TTopRowTR +='<tr>'
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><strong><span style="font-family: 굴림;">'+bigo+'</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 3%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><strong><span style="font-family: 굴림;">'+inwon_so+'</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+pay.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+overpay.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+health_so.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+kukmin_so.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+koyung_so+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+soduk_so.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+jumin_so.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   

				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+sangjo_so+'&nbsp;</span></strong></p>'
				TTopRowTR +='</td>'   		
				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+etc_so+'&nbsp;</span></strong></p>'
				TTopRowTR +='</td>'   
				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+etc_so_1+'&nbsp;</span></strong></p>'
				TTopRowTR +='</td>'   

			 
		
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 8%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+gongje_so.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 8%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+minor_so.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='</tr>'
			 
 
	
			 return TTopRowTR   ;
		  }
		  ,
 
		  //총계
		  rtnTopRowTR2 : function (allinwon, allkum, allover,allhealth,allkukmin,allkoyung,allsoduk,alljumin,alljangjo,alletcsum,alletc_1sum,allgongje,allminor) {
			 var TTopRowTR ;

			 allkum=allkum+"";
			 allover=allover+""
			 allhealth=allhealth+""
			 allkukmin=allkukmin+""
			 allkoyung=allkoyung+""
			 allsoduk=allsoduk+""
			 alljumin=alljumin+""
			 alljangjo=alljangjo+""
			 alletcsum=alletcsum+""
			 alletc_1sum=alletc_1sum+""
			 allgongje=allgongje+""
			 allminor=allminor+""
			 var _info1 = $dwp.cns("core.info");
			 var vdocname=_info1.cuser.pinfo.name;
			 var compaNO=_info1.cuser.pinfo.hrcomcode;
			if ($fn.getCurLangMsg(vdocname, ",", "ko") =="관리자"){
				compaNO=$("[name=comcd]").val()
			}
			if(alletcsum == "0"){alletcsum=""}else{alletcsum=alletcsum.toComma()}
			if(alljumin == "0"){alljumin=""}else{alljumin=alljumin.toComma()}
			if(allkoyung == "0"){allkoyung=""}else{allkoyung=allkoyung.toComma()}
			if(alljangjo == "0"){alljangjo=""}else{alljangjo=alljangjo.toComma()}
			if(alletc_1sum == "0"){alletc_1sum=""}else{alletc_1sum=alletc_1sum.toComma()}
			 TTopRowTR="";
			 TTopRowTR +='<tr>'
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><strong><span style="font-family: 굴림;">'+"총계"+'</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 3%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: center;"><strong><span style="font-family: 굴림;">'+allinwon+'</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+allkum.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+allover.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+allhealth.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+allkukmin.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+allkoyung+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+allsoduk.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+alljumin.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			
				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 7%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+alljangjo+'&nbsp;</span></strong></p>'
				TTopRowTR +='</td>'   
				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 6%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+ alletcsum+'&nbsp;</span></strong></p>'
				TTopRowTR +='</td>'   
				TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 6%; height: 20px; ">'
				TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+alletc_1sum+'&nbsp;</span></strong></p>'
				TTopRowTR +='</td>'   

			 

			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 8%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+allgongje.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='<td style="border: 1px solid rgb(0, 0, 0); width: 8%; height: 20px; ">'
			 TTopRowTR +='<p style="font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; text-align: right;"><strong><span style="font-family: 굴림;">'+allminor.toComma()+'&nbsp;</span></strong></p>'
			 TTopRowTR +='</td>'   
			 TTopRowTR +='</tr>'
		  
 
	
			 return TTopRowTR   ;
		  },
 
		  setReceiver: function($doc, arg) {
			var _me = this, _opt = $doc.options;
			var _url = $fn.getProxyUrl(_opt.cdb + '/wcmdpost?createdocument');
			var _actopt = {actiontype :"getReceiver", Arg1 : arg};
			var callback = function (_data) {
				var _data = $.extend({result:"", UserInfo_CanonicalID:"", UserInfo_full:""}, _data);
				
				if (_data.hasOwnProperty('result')) {
					if (_data.result == '200') {
						if (_data.UserInfo_CanonicalID != "") {
							var _$namelist = $('div[name=Circulation3Disp]', $doc.element);
							_$namelist.empty();

							$("input[name=Circulation3]", $doc.element).xval(_data.UserInfo_CanonicalID);
							$("input[name=Circulation3Full]", $doc.element).xval(_data.UserInfo_full);

							var _o = null;
							if (_data.UserInfo_full.split("^")[0] === "S") {
								_o = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.USER, _data.UserInfo_full, "^");
							} else if (_data.UserInfo_full.split("^")[0] === "B") {
								_o = $dwp.core.util.getObjStr($dwp.ui.org._CONST._PROP.DEPT, _data.UserInfo_full, "^");
							}

							var _org = new $dwp.ui.org.data.org(_o), item = _org.oinfo;

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
										ismobile: false
									});
								});
							}

						}
					}
				}
			};

			$fn.cmdPost(_url, _actopt, callback, 'json');
		},
 
		  /**
		   * 결재 상신전 체크
		   * @param {*} $doc 
		   * @param {*} opt 
		   * @returns 
		   */
		  save: function ($doc, opt) {
			 if ($("[name=grid]", $doc.element).xval() == "") {
				$fn.alert({ msg: $fn.getCodeMsg("comm.msg.msg070") });
				return false;
			 } else {
				return true;
			 }
		  }
	   }
	}
 }($dwp.cns("app"), jQuery)); 














