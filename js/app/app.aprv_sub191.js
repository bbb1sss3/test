/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 전자결재 보조양식 - 구매 발주 FREE FORM 
 * $dwp.app.aprv_sub191
 */

 (function (_$$, $) {
    _$$.aprv_sub191 = {
        subdoc: {
            SUBNAME: "sub191"
            , init: function ($doc) {
                var _me = _$$.aprv_sub191.subdoc, opt = $doc.options;
                var el = $doc.element;
                var _$table01 = $("table[name=sub191_Table01]", $doc.element);

                var _isedit = opt.isedit;
               
              
                var _opt = $.extend({}, opt, { isedit: _isedit });

             
                if (opt.isnew) {                    
                    $("[name=Subject]", $doc.element).val($fn.getCurLangMsg(_opt.appCfg.sFormTitle, ",", "ko"));       
                    
                       //출장명령서 html 가져오기 
                 setTimeout(function() {
                    

                     if($("[name=tripdocid1]", $doc.element).val() !=""){

                    
                    console.log('Works!');
                    var _url = $fn.getProxyUrl("/dwp/com/bbs/triporder.nsf/dockey/" + $("[name=tripdocid1]", $doc.element).val()+ '/Body?OpenField');
                    var callback = function (_data) {
                        //if ($('#bodyFld', _el)[0] != undefined) {
                           //$dwp.ui.weditor.setHtmlValue("",el);
                           _url1 = $fn.getProxyUrl('/dwp/aprv/com/aprvmng.nsf/lkViwAprvSet01/' +"Form191" +'/Body?OpenField');
                            var vbodydata=""
                            var callback = function (_bodydata) {
                                $dwp.ui.weditor.setHtmlValue(_data+_bodydata, el);
                            };

                            $fn.cmdPost(_url1, '', callback, 'html');
                            
                           
                       // }
                    };
    
                    $fn.cmdPost(_url, '', callback, 'html');
                 }
                 
                  }, 2000);
                   
                }

                var tripunid=$("[name=tripdocid1]", $doc.element).val();
                tripuni=tripunid.replace(";","");
                tripuni=tripunid.replace(",","");

                if(tripunid == ""){//출장명령서 정보 없으면 버튼 숨김
                    $("#_tripoder",el).css("display","none")
                }
                $("[name=_pop6]", $doc.element).on("click", function () { //링크클릭 tirpdocid
                    var url="/dwp/com/portal/main.nsf/wfrmpage?ReadForm&url=/dwp/com/bbs/triporder.nsf/dockey/"+tripuni+"?opendocument?opendocument%26popup=1"

                    window.open(url, "_blank");

                });

                    
            },
            comsum: function($doc) {
                var vTotal = 0;      
                //법인카드 첫번째

                var comcard1=$("input[name='comcard']", $doc.element).val();
                var comcard2=$("input[name='comcard_3']", $doc.element).val();
                var comcard3=$("input[name='comcard_4']", $doc.element).val();
                var comcard4=$("input[name='comcard_5']", $doc.element).val();
                var comcard5=$("input[name='comcard_6']", $doc.element).val();
                comcard1=comcard1+"";
                comcard2=comcard2+"";
                comcard3=comcard3+"";
                comcard4=comcard4+"";
                comcard5=comcard5+"";
                comcard1=comcard1.replace(/,/g,"");
                comcard2=comcard2.replace(/,/g,"");
                comcard3=comcard3.replace(/,/g,"");
                comcard4=comcard4.replace(/,/g,"");
                comcard5=comcard5.replace(/,/g,"");


                vTotal=parseFloat("0"+comcard1) + parseFloat( "0"+comcard2) 
                 + parseFloat( "0"+comcard3)+ parseFloat( "0"+comcard4)
                  +parseFloat( "0"+comcard5);
                 $("input[name='comcard_sum_so']", $doc.element).val(vTotal);



                 if( $("[name=ed_won]", $doc.element).val() == "01" ||  $("[name=ed_won]", $doc.element).val() == "00"){
                    $("input[name='won_com_sum']", $doc.element).val("");
                    $("[name=percard_sum_so_4]", $doc.element).attr("readonly",true)
                    $("[name=percard_sum_so_4]", $doc.element).val("1");
                    $("[name=won_com_sum]", $doc.element).val("");
                    $("[name=won_per_sum]", $doc.element).val("");
                    $("[name=text1]", $doc.element).val("");
                  
                    }else{
                    
                    $("[name=percard_sum_so_4]", $doc.element).attr("readonly",false)
                    $("[name=text1]", $doc.element).val("원화환산계");
                   // $("input[name='won_com_sum']", $doc.element).val(total);            
                

                 

                }

                //첫번째 법인카드합계
                var total=parseFloat("0"+$("input[name='comcard_sum_so']", $doc.element).val());
                //percard_sum_so_4
                var won=$("input[name='percard_sum_so_4']", $doc.element).val();
                total=total+"";
                won=won+"";
                total=total.replace(/,/g,"");
                won=won.replace(/,/g,"");
                won=parseFloat(won);
                total=total*won;
                if($("select[name='ed_won']", $doc.element).val() == "03"){
                    total=Math.round(total.toFixed(2)/100);
                }

                //2번째 법인카드합계
                var total1=parseFloat("0"+$("input[name='comcard_sum_so_1']", $doc.element).val());
                //percard_sum_so_4
                var won1=$("input[name='percard_sum_so_4_1']", $doc.element).val();
                total1=total1+"";
                won1=won1+"";
                total1=total1.replace(/,/g,"");
                won1=won1.replace(/,/g,"");
                won1=parseFloat(won1);
                total1=total1*won1;

                if($("select[name='ed_won1']", $doc.element).val() == "03"){
                    total1=Math.round(total1.toFixed(2)/100);
                }

                 //3번째 법인카드합계
                 var total2=parseFloat("0"+$("input[name='comcard_sum_so_2']", $doc.element).val());
                 //percard_sum_so_4
                 var won2=$("input[name='percard_sum_so_4_2']", $doc.element).val();
                 total2=total2+"";
                 won2=won2+"";
                 total2=total2.replace(/,/g,"");
                 won2=won2.replace(/,/g,"");
                 won2=parseFloat(won2);
                 total2=total2*won2;
 
                 if($("select[name='ed_won2']", $doc.element).val() == "03"){
                     total2=Math.round(total2.toFixed(2)/100);
                 }
                 
                 //법인카드 총 합계
                 var vcomtotal=parseFloat(total)+parseFloat(total1)+parseFloat(total2);
                 $("[name='won_com_all']", $doc.element).val(vcomtotal);
                 // 개인+법인 총 합계

                 var finalsum=parseFloat("0"+$("input[name='won_com_all']", $doc.element).val())+parseFloat("0"+$("input[name='won_per_all']", $doc.element).val());;

                 $("[name='won_all']", $doc.element).val(finalsum);
                 
                 //법인카드 원화산 합계
                 if( $("[name=ed_won]", $doc.element).val() == "01" ||  $("[name=ed_won]", $doc.element).val() == "00"){
                   
                  
                        }else{
                             $("input[name='won_com_sum']", $doc.element).val(total);            
                

                 

                    }

                 
           

                //화종이 JPY일때 100나누기
                var total=parseFloat("0"+$("input[name='comcard_sum_so']", $doc.element).val());
                //percard_sum_so_4
                var won=$("input[name='percard_sum_so_4']", $doc.element).val();
                total=total+"";
                won=won+"";
                total=total.replace(/,/g,"");
                won=won.replace(/,/g,"");
                won=parseFloat(won);
                total=total*won;
              
                //화종이 JPY일때 100나누기
                if($("select[name='ed_won']", $doc.element).val() == "03"){
                    //Math.round(vTotal.toFixed(2)/100)
                    $("input[name='won_com_sum']", $doc.element).val(Math.round(total.toFixed(2)/100));
                }
                


            },
            persum: function($doc) {
                var vTotal = 0;  
                //개인 합계
                var comcard1=$("input[name='percard']", $doc.element).val();
                var comcard2=$("input[name='percard_3']", $doc.element).val();
                var comcard3=$("input[name='percard_4']", $doc.element).val();
                var comcard4=$("input[name='percard_5']", $doc.element).val();
                var comcard5=$("input[name='percard_6']", $doc.element).val();
                comcard1=comcard1+"";
                comcard2=comcard2+"";
                comcard3=comcard3+"";
                comcard4=comcard4+"";
                comcard5=comcard5+"";
                comcard1=comcard1.replace(/,/g,"");
                comcard2=comcard2.replace(/,/g,"");
                comcard3=comcard3.replace(/,/g,"");
                comcard4=comcard4.replace(/,/g,"");
                comcard5=comcard5.replace(/,/g,"");


                vTotal=parseFloat("0"+comcard1) + parseFloat( "0"+comcard2) 
                 + parseFloat( "0"+comcard3)+ parseFloat( "0"+comcard4)
                  +parseFloat( "0"+comcard5);
                 $("input[name='percard_sum_so']", $doc.element).val(vTotal);

                  //첫번째 개인카드합계
                var total=parseFloat("0"+$("input[name='percard_sum_so']", $doc.element).val());
                //percard_sum_so_4
                var won=$("input[name='percard_sum_so_4']", $doc.element).val();
                total=total+"";
                won=won+"";
                total=total.replace(/,/g,"");
                won=won.replace(/,/g,"");
                won=parseFloat(won);
                total=total*won;
                if($("select[name='ed_won']", $doc.element).val() == "03"){
                    total=Math.round(total.toFixed(2)/100);
                }

                //2번째 개인카드합계
                var total1=parseFloat("0"+$("input[name='percard_sum_so_1']", $doc.element).val());
                //percard_sum_so_4
                var won1=$("input[name='percard_sum_so_4_1']", $doc.element).val();
                total1=total1+"";
                won1=won1+"";
                total1=total1.replace(/,/g,"");
                won1=won1.replace(/,/g,"");
                won1=parseFloat(won1);
                total1=total1*won1;

                if($("select[name='ed_won1']", $doc.element).val() == "03"){
                    total1=Math.round(total1.toFixed(2)/100);
                }

                 //3번째 법인카드합계
                 var total2=parseFloat("0"+$("input[name='percard_sum_so_2']", $doc.element).val());
                 //percard_sum_so_4
                 var won2=$("input[name='percard_sum_so_4_2']", $doc.element).val();
                 total2=total2+"";
                 won2=won2+"";
                 total2=total2.replace(/,/g,"");
                 won2=won2.replace(/,/g,"");
                 won2=parseFloat(won2);
                 total2=total2*won2;
 
                 if($("select[name='ed_won2']", $doc.element).val() == "03"){
                     total2=Math.round(total2.toFixed(2)/100);
                 }

                   //개인카드 총 합계
                   var vcomtotal=parseFloat(total)+parseFloat(total1)+parseFloat(total2);
                   $("[name='won_per_all']", $doc.element).val(vcomtotal);
                   // 개인+법인 총 합계
  
                   var finalsum=parseFloat("0"+$("input[name='won_com_all']", $doc.element).val())+parseFloat("0"+$("input[name='won_per_all']", $doc.element).val());;
  
                   $("[name='won_all']", $doc.element).val(finalsum);

                   if( $("[name=ed_won]", $doc.element).val() == "01" ||  $("[name=ed_won]", $doc.element).val() == "00"){
                    
                  
                     }else{
                    
                   
                          $("input[name='won_per_sum']", $doc.element).val(total);            
                

                 

                        }

                      //화종이 JPY일때 100나누기
                        var total=parseFloat("0"+$("input[name='percard_sum_so']", $doc.element).val());
                        //percard_sum_so_4
                        var won=$("input[name='percard_sum_so_4']", $doc.element).val();
                        total=total+"";
                        won=won+"";
                        total=total.replace(/,/g,"");
                        won=won.replace(/,/g,"");
                        won=parseFloat(won);
                        total=total*won;
                    
                        //화종이 JPY일때 100나누기
                        if($("select[name='ed_won']", $doc.element).val() == "03"){
                            //Math.round(vTotal.toFixed(2)/100)
                            $("input[name='won_per_sum']", $doc.element).val(Math.round(total.toFixed(2)/100));
                        }


            },
            comsum1: function($doc) {
                var vTotal = 0;      
                  
                var comcard1=$("input[name='comcard_1']", $doc.element).val();
                var comcard2=$("input[name='comcard_1_1']", $doc.element).val();
                var comcard3=$("input[name='comcard_1_2']", $doc.element).val();
                var comcard4=$("input[name='comcard_1_3']", $doc.element).val();
                var comcard5=$("input[name='comcard_1_4']", $doc.element).val();
                comcard1=comcard1+"";
                comcard2=comcard2+"";
                comcard3=comcard3+"";
                comcard4=comcard4+"";
                comcard5=comcard5+"";
                comcard1=comcard1.replace(/,/g,"");
                comcard2=comcard2.replace(/,/g,"");
                comcard3=comcard3.replace(/,/g,"");
                comcard4=comcard4.replace(/,/g,"");
                comcard5=comcard5.replace(/,/g,"");


                vTotal=parseFloat("0"+comcard1) + parseFloat( "0"+comcard2) 
                 + parseFloat( "0"+comcard3)+ parseFloat( "0"+comcard4)
                  +parseFloat( "0"+comcard5);
                 $("input[name='comcard_sum_so_1']", $doc.element).val(vTotal);

                //2번째 원화 변경시 
                 if( $("[name=ed_won1]", $doc.element).val() == "01" ||  $("[name=ed_won1]", $doc.element).val() == "00"){
                    $("input[name='won_com_sum_1']", $doc.element).val("");
                    $("[name=percard_sum_so_4_1]", $doc.element).attr("readonly",true)
                    $("[name=percard_sum_so_4_1]", $doc.element).val("1");
                    $("[name=won_com_sum_1]", $doc.element).val("");
                    $("[name=won_per_sum_1]", $doc.element).val("");
                    //$("[name=text2]", $doc.element).val("");
                  
                    }else{
                    
                    $("[name=percard_sum_so_4_1]", $doc.element).attr("readonly",false)
                    $("[name=text1]", $doc.element).val("원화환산계");
                   // $("input[name='won_com_sum']", $doc.element).val(total);            
                              

                }
                    //첫번째 법인카드합계
                    var total=parseFloat("0"+$("input[name='comcard_sum_so']", $doc.element).val());
                    //percard_sum_so_4
                    var won=$("input[name='percard_sum_so_4']", $doc.element).val();
                    total=total+"";
                    won=won+"";
                    total=total.replace(/,/g,"");
                    won=won.replace(/,/g,"");
                    won=parseFloat(won);
                    total=total*won;
                    if($("select[name='ed_won']", $doc.element).val() == "03"){
                        total=Math.round(total.toFixed(2)/100);
                    }
    
                    //2번째 법인카드합계
                    var total1=parseFloat("0"+$("input[name='comcard_sum_so_1']", $doc.element).val());
                    //percard_sum_so_4
                    var won1=$("input[name='percard_sum_so_4_1']", $doc.element).val();
                    total1=total1+"";
                    won1=won1+"";
                    total1=total1.replace(/,/g,"");
                    won1=won1.replace(/,/g,"");
                    won1=parseFloat(won1);
                    total1=total1*won1;
    
                    if($("select[name='ed_won1']", $doc.element).val() == "03"){
                        total1=Math.round(total1.toFixed(2)/100);
                    }
    
                     //3번째 법인카드합계
                     var total2=parseFloat("0"+$("input[name='comcard_sum_so_2']", $doc.element).val());
                     //percard_sum_so_4
                     var won2=$("input[name='percard_sum_so_4_2']", $doc.element).val();
                     total2=total2+"";
                     won2=won2+"";
                     total2=total2.replace(/,/g,"");
                     won2=won2.replace(/,/g,"");
                     won2=parseFloat(won2);
                     total2=total2*won2;
     
                     if($("select[name='ed_won2']", $doc.element).val() == "03"){
                         total2=Math.round(total2.toFixed(2)/100);
                     }
                     
                     //법인카드 총 합계
                     var vcomtotal=parseFloat(total)+parseFloat(total1)+parseFloat(total2);
                     $("[name='won_com_all']", $doc.element).val(vcomtotal);
                     // 개인+법인 총 합계
    
                     var finalsum=parseFloat("0"+$("input[name='won_com_all']", $doc.element).val())+parseFloat("0"+$("input[name='won_per_all']", $doc.element).val());;
    
                     $("[name='won_all']", $doc.element).val(finalsum);
                     
                     //법인카드 원화산 합계
                     if( $("[name=ed_won1]", $doc.element).val() == "01" ||  $("[name=ed_won1]", $doc.element).val() == "00"){
                       
                      
                            }else{
                                 $("input[name='won_com_sum_1']", $doc.element).val(total1);            
                    
    
                     
    
                        }
    
                     
               
    
                    //화종이 JPY일때 100나누기
                    var total=parseFloat("0"+$("input[name='comcard_sum_so_1']", $doc.element).val());
                    //percard_sum_so_4
                    var won=$("input[name='percard_sum_so_4_1']", $doc.element).val();
                    total=total+"";
                    won=won+"";
                    total=total.replace(/,/g,"");
                    won=won.replace(/,/g,"");
                    won=parseFloat(won);
                    total=total*won;
                  
                    //화종이 JPY일때 100나누기
                    if($("select[name='ed_won1']", $doc.element).val() == "03"){
                        //Math.round(vTotal.toFixed(2)/100)
                        $("input[name='won_com_sum_1']", $doc.element).val(Math.round(total.toFixed(2)/100));
                    }

               


            },
            persum1: function($doc) {
                var vTotal = 0;   
                  

                  //개인 2번째 합계
                var comcard1=$("input[name='percard_1']", $doc.element).val();
                var comcard2=$("input[name='percard_1_1']", $doc.element).val();
                var comcard3=$("input[name='percard_1_2']", $doc.element).val();
                var comcard4=$("input[name='percard_1_3']", $doc.element).val();
                var comcard5=$("input[name='percard_1_4']", $doc.element).val();
                comcard1=comcard1+"";
                comcard2=comcard2+"";
                comcard3=comcard3+"";
                comcard4=comcard4+"";
                comcard5=comcard5+"";
                comcard1=comcard1.replace(/,/g,"");
                comcard2=comcard2.replace(/,/g,"");
                comcard3=comcard3.replace(/,/g,"");
                comcard4=comcard4.replace(/,/g,"");
                comcard5=comcard5.replace(/,/g,"");


                vTotal=parseFloat("0"+comcard1) + parseFloat( "0"+comcard2) 
                 + parseFloat( "0"+comcard3)+ parseFloat( "0"+comcard4)
                  +parseFloat( "0"+comcard5);
                 $("input[name='percard_sum_so_1']", $doc.element).val(vTotal);

                 //첫번째 개인카드합계
                var total=parseFloat("0"+$("input[name='percard_sum_so']", $doc.element).val());
                //percard_sum_so_4
                var won=$("input[name='percard_sum_so_4']", $doc.element).val();
                total=total+"";
                won=won+"";
                total=total.replace(/,/g,"");
                won=won.replace(/,/g,"");
                won=parseFloat(won);
                total=total*won;
                if($("select[name='ed_won']", $doc.element).val() == "03"){
                    total=Math.round(total.toFixed(2)/100);
                }

                //2번째 개인카드합계
                var total1=parseFloat("0"+$("input[name='percard_sum_so_1']", $doc.element).val());
                //percard_sum_so_4
                var won1=$("input[name='percard_sum_so_4_1']", $doc.element).val();
                total1=total1+"";
                won1=won1+"";
                total1=total1.replace(/,/g,"");
                won1=won1.replace(/,/g,"");
                won1=parseFloat(won1);
                total1=total1*won1;

                if($("select[name='ed_won1']", $doc.element).val() == "03"){
                    total1=Math.round(total1.toFixed(2)/100);
                }

                 //3번째 법인카드합계
                 var total2=parseFloat("0"+$("input[name='percard_sum_so_2']", $doc.element).val());
                 //percard_sum_so_4
                 var won2=$("input[name='percard_sum_so_4_2']", $doc.element).val();
                 total2=total2+"";
                 won2=won2+"";
                 total2=total2.replace(/,/g,"");
                 won2=won2.replace(/,/g,"");
                 won2=parseFloat(won2);
                 total2=total2*won2;
 
                    if($("select[name='ed_won2']", $doc.element).val() == "03"){
                        total2=Math.round(total2.toFixed(2)/100);
                    }

                    //개인카드 총 합계
                    var vcomtotal=parseFloat(total)+parseFloat(total1)+parseFloat(total2);
                    $("[name='won_per_all']", $doc.element).val(vcomtotal);
                    // 개인+법인 총 합계
    
                    var finalsum=parseFloat("0"+$("input[name='won_com_all']", $doc.element).val())+parseFloat("0"+$("input[name='won_per_all']", $doc.element).val());;
    
                    $("[name='won_all']", $doc.element).val(finalsum);

                    if( $("[name=ed_won1]", $doc.element).val() == "01" ||  $("[name=ed_won1]", $doc.element).val() == "00"){
                        
                    
                        }else{
                        
                    
                            $("input[name='won_per_sum_1']", $doc.element).val(total1);            
                    

                    

                            }

                         //화종이 JPY일때 100나누기
                            var total=parseFloat("0"+$("input[name='percard_sum_so_1']", $doc.element).val());
                            //percard_sum_so_4
                            var won=$("input[name='percard_sum_so_4_1']", $doc.element).val();
                            total=total+"";
                            won=won+"";
                            total=total.replace(/,/g,"");
                            won=won.replace(/,/g,"");
                            won=parseFloat(won);
                            total=total*won;
                        
                            //화종이 JPY일때 100나누기
                            if($("select[name='ed_won1']", $doc.element).val() == "03"){
                                //Math.round(vTotal.toFixed(2)/100)
                                $("input[name='won_per_sum_1']", $doc.element).val(Math.round(total.toFixed(2)/100));
                            }



            },
            comsum2: function($doc) {
                var vTotal = 0;     
                  
                 var comcard1=$("input[name='comcard_2']", $doc.element).val();
                var comcard2=$("input[name='comcard_2_1']", $doc.element).val();
                var comcard3=$("input[name='comcard_2_2']", $doc.element).val();
                var comcard4=$("input[name='comcard_2_3']", $doc.element).val();
                var comcard5=$("input[name='comcard_2_4']", $doc.element).val();
                comcard1=comcard1+"";
                comcard2=comcard2+"";
                comcard3=comcard3+"";
                comcard4=comcard4+"";
                comcard5=comcard5+"";
                comcard1=comcard1.replace(/,/g,"");
                comcard2=comcard2.replace(/,/g,"");
                comcard3=comcard3.replace(/,/g,"");
                comcard4=comcard4.replace(/,/g,"");
                comcard5=comcard5.replace(/,/g,"");


                vTotal=parseFloat("0"+comcard1) + parseFloat( "0"+comcard2) 
                 + parseFloat( "0"+comcard3)+ parseFloat( "0"+comcard4)
                  +parseFloat( "0"+comcard5);
                 $("input[name='comcard_sum_so_2']", $doc.element).val(vTotal);

                  //3번째 원화 변경시 
                  if( $("[name=ed_won2]", $doc.element).val() == "01" ||  $("[name=ed_won2]", $doc.element).val() == "00"){
                    $("input[name='won_com_sum_2']", $doc.element).val("");
                    $("[name=percard_sum_so_4_2]", $doc.element).attr("readonly",true)
                    $("[name=percard_sum_so_4_2]", $doc.element).val("1");
                    $("[name=won_com_sum_2]", $doc.element).val("");
                    $("[name=won_per_sum_2]", $doc.element).val("");
                    //$("[name=text2]", $doc.element).val("");
                  
                    }else{
                    
                    $("[name=percard_sum_so_4_2]", $doc.element).attr("readonly",false)
                    $("[name=text1]", $doc.element).val("원화환산계");
                   // $("input[name='won_com_sum']", $doc.element).val(total);            
                              

                }
                    //첫번째 법인카드합계
                    var total=parseFloat("0"+$("input[name='comcard_sum_so']", $doc.element).val());
                    //percard_sum_so_4
                    var won=$("input[name='percard_sum_so_4']", $doc.element).val();
                    total=total+"";
                    won=won+"";
                    total=total.replace(/,/g,"");
                    won=won.replace(/,/g,"");
                    won=parseFloat(won);
                    total=total*won;
                    if($("select[name='ed_won']", $doc.element).val() == "03"){
                        total=Math.round(total.toFixed(2)/100);
                    }
    
                    //2번째 법인카드합계
                    var total1=parseFloat("0"+$("input[name='comcard_sum_so_1']", $doc.element).val());
                    //percard_sum_so_4
                    var won1=$("input[name='percard_sum_so_4_1']", $doc.element).val();
                    total1=total1+"";
                    won1=won1+"";
                    total1=total1.replace(/,/g,"");
                    won1=won1.replace(/,/g,"");
                    won1=parseFloat(won1);
                    total1=total1*won1;
    
                    if($("select[name='ed_won1']", $doc.element).val() == "03"){
                        total1=Math.round(total1.toFixed(2)/100);
                    }
    
                     //3번째 법인카드합계
                     var total2=parseFloat("0"+$("input[name='comcard_sum_so_2']", $doc.element).val());
                     //percard_sum_so_4
                     var won2=$("input[name='percard_sum_so_4_2']", $doc.element).val();
                     total2=total2+"";
                     won2=won2+"";
                     total2=total2.replace(/,/g,"");
                     won2=won2.replace(/,/g,"");
                     won2=parseFloat(won2);
                     total2=total2*won2;
     
                     if($("select[name='ed_won2']", $doc.element).val() == "03"){
                         total2=Math.round(total2.toFixed(2)/100);
                     }
                     
                     //법인카드 총 합계
                     var vcomtotal=parseFloat(total)+parseFloat(total1)+parseFloat(total2);
                     $("[name='won_com_all']", $doc.element).val(vcomtotal);
                     // 개인+법인 총 합계
    
                     var finalsum=parseFloat("0"+$("input[name='won_com_all']", $doc.element).val())+parseFloat("0"+$("input[name='won_per_all']", $doc.element).val());;
    
                     $("[name='won_all']", $doc.element).val(finalsum);
                     
                     //법인카드 원화산 합계
                     if( $("[name=ed_won2]", $doc.element).val() == "01" ||  $("[name=ed_won2]", $doc.element).val() == "00"){
                       
                      
                            }else{
                                 $("input[name='won_com_sum_2']", $doc.element).val(total2);            
                    
    
                     
    
                        }
    
                     
               
    
                    //화종이 JPY일때 100나누기
                    var total=parseFloat("0"+$("input[name='comcard_sum_so_2']", $doc.element).val());
                    //percard_sum_so_4
                    var won=$("input[name='percard_sum_so_4_2']", $doc.element).val();
                    total=total+"";
                    won=won+"";
                    total=total.replace(/,/g,"");
                    won=won.replace(/,/g,"");
                    won=parseFloat(won);
                    total=total*won;
                  
                    //화종이 JPY일때 100나누기
                    if($("select[name='ed_won2']", $doc.element).val() == "03"){
                        //Math.round(vTotal.toFixed(2)/100)
                        $("input[name='won_com_sum_2']", $doc.element).val(Math.round(total.toFixed(2)/100));
                    }


            },
            persum2: function($doc) {
                var vTotal = 0;      

                //개인 3번째 합계
                var comcard1=$("input[name='percard_2']", $doc.element).val();
                var comcard2=$("input[name='percard_2_1']", $doc.element).val();
                var comcard3=$("input[name='percard_2_2']", $doc.element).val();
                var comcard4=$("input[name='percard_2_3']", $doc.element).val();
                var comcard5=$("input[name='percard_2_4']", $doc.element).val();
                comcard1=comcard1+"";
                comcard2=comcard2+"";
                comcard3=comcard3+"";
                comcard4=comcard4+"";
                comcard5=comcard5+"";
                comcard1=comcard1.replace(/,/g,"");
                comcard2=comcard2.replace(/,/g,"");
                comcard3=comcard3.replace(/,/g,"");
                comcard4=comcard4.replace(/,/g,"");
                comcard5=comcard5.replace(/,/g,"");

                
                vTotal=parseFloat("0"+comcard1) + parseFloat( "0"+comcard2) 
                 + parseFloat( "0"+comcard3)+ parseFloat( "0"+comcard4)
                  +parseFloat( "0"+comcard5);
                 $("input[name='percard_sum_so_2']", $doc.element).val(vTotal);

                 //첫번째 개인카드합계
                var total=parseFloat("0"+$("input[name='percard_sum_so']", $doc.element).val());
                //percard_sum_so_4
                var won=$("input[name='percard_sum_so_4']", $doc.element).val();
                total=total+"";
                won=won+"";
                total=total.replace(/,/g,"");
                won=won.replace(/,/g,"");
                won=parseFloat(won);
                total=total*won;
                if($("select[name='ed_won']", $doc.element).val() == "03"){
                    total=Math.round(total.toFixed(2)/100);
                }

                //2번째 개인카드합계
                var total1=parseFloat("0"+$("input[name='percard_sum_so_1']", $doc.element).val());
                //percard_sum_so_4
                var won1=$("input[name='percard_sum_so_4_1']", $doc.element).val();
                total1=total1+"";
                won1=won1+"";
                total1=total1.replace(/,/g,"");
                won1=won1.replace(/,/g,"");
                won1=parseFloat(won1);
                total1=total1*won1;

                if($("select[name='ed_won1']", $doc.element).val() == "03"){
                    total1=Math.round(total1.toFixed(2)/100);
                }

                 //3번째 법인카드합계
                 var total2=parseFloat("0"+$("input[name='percard_sum_so_2']", $doc.element).val());
                 //percard_sum_so_4
                 var won2=$("input[name='percard_sum_so_4_2']", $doc.element).val();
                 total2=total2+"";
                 won2=won2+"";
                 total2=total2.replace(/,/g,"");
                 won2=won2.replace(/,/g,"");
                 won2=parseFloat(won2);
                 total2=total2*won2;
 
                    if($("select[name='ed_won2']", $doc.element).val() == "03"){
                        total2=Math.round(total2.toFixed(2)/100);
                    }

                    //개인카드 총 합계
                    var vcomtotal=parseFloat(total)+parseFloat(total1)+parseFloat(total2);
                    $("[name='won_per_all']", $doc.element).val(vcomtotal);
                    // 개인+법인 총 합계
    
                    var finalsum=parseFloat("0"+$("input[name='won_com_all']", $doc.element).val())+parseFloat("0"+$("input[name='won_per_all']", $doc.element).val());;
    
                    $("[name='won_all']", $doc.element).val(finalsum);

                    if( $("[name=ed_won2]", $doc.element).val() == "01" ||  $("[name=ed_won2]", $doc.element).val() == "00"){
                        
                    
                        }else{
                        
                    
                            $("input[name='won_per_sum_2']", $doc.element).val(total2);            
                    

                    

                            }

                         //화종이 JPY일때 100나누기
                            var total=parseFloat("0"+$("input[name='percard_sum_so_2']", $doc.element).val());
                            //percard_sum_so_4
                            var won=$("input[name='percard_sum_so_4_2']", $doc.element).val();
                            total=total+"";
                            won=won+"";
                            total=total.replace(/,/g,"");
                            won=won.replace(/,/g,"");
                            won=parseFloat(won);
                            total=total*won;
                        
                            //화종이 JPY일때 100나누기
                            if($("select[name='ed_won2']", $doc.element).val() == "03"){
                                //Math.round(vTotal.toFixed(2)/100)
                                $("input[name='won_per_sum_2']", $doc.element).val(Math.round(total.toFixed(2)/100));
                            }


            }

         
            /* _$$.aprv_sub002.subdoc.save()     => 임시저장 및 결재상신 직전에 본문 데이터 저장 (return true or false)*/
            , save: function ($doc, opt) {
                var _me = _$$.aprv_sub191.subdoc;

                var _opt = $doc.options;
                var _aopt = $.extend({ actiontype: "" }, opt);


                    //밸리데이션 체크
                    if ($("[name='Con']",$doc.element).val() == "") {
                                        
                            //  발주번호를 입력하세요.
                            $fn.alert({msg : $fn.getCodeMsg("aprv_sub_191.msg.a1")});    //사유
                        
                        return false;
                    }
            

                //필수입력 체크
                var _isvalid = true;
                
                   
                  
               

                console.log("191 save : ", _isvalid);
                return _isvalid;
            }
        }
    }
}($dwp.cns("app"), jQuery));











