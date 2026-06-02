/* Source File Upload Time : 06-02 일 8:55:31 PM*/


/* Source File Upload Time : 06-02 일 2:34:53 PM*/


/**
 * 보조양식 - 모바일 출퇴근 관리 
 * $dwp.app.aprv_sub000
 */

(function (_$$, $) {
    _$$.aprv_sub000 = {
        subdoc: {
            SUBNAME: "sub000"
            ,_lat: ""	//위도
            ,_long: ""	//경도
            , init: function () {
                var _me = _$$.aprv_sub000.subdoc
               
               
             

                var date = new Date(); 
                var year = date.getFullYear(); 
                var month = new String(date.getMonth()+1); 
                var day = new String(date.getDate()); 
                
                // 한자리수일 경우 0을 채워준다. 
                if(month.length == 1){ 
                  month = "0" + month; 
                } 
                if(day.length == 1){ 
                  day = "0" + day; 
                } 
               
               
                
                //dapi.kakao.com/v2/maps/sdk.js?appkey=
                ////dapi.kakao.com/v2/maps/sdk.js?appkey=c7c9a1346484e9b3e2d25210ecb5c03b&libraries=services
              

                var _info_22 = $dwp.cns("core.info");
                console.log("sub000시작");
                // 버튼 들어갈 공간 inoutflag
                console.log(_info_22.cuser.pinfo.empno); // 현재 사번
                console.log(_info_22.cuser.pinfo.inoutauth); // 버튼 보이는 권한

                var gooutbtnAuth=_info_22.cuser.pinfo.inoutauth; // 출퇴근 버튼 권한 
                var cuserfullorgcode=_info_22.cuser.pinfo.fullorgcode; //접속자 풀 orgcode

                console.log(cuserfullorgcode);

                var cuserfullorgcodearr=cuserfullorgcode.split(",");
                var authflag=false;

                //부서 같은게 있으면 보이기
                if(typeof gooutbtnAuth == "undefined"){
                    authflag=false;
                }else{
                    for(var i=0; i<cuserfullorgcodearr.length; i++){
                    
                        if(gooutbtnAuth.indexOf(cuserfullorgcodearr[i]) > -1){
                            authflag=true;
                        }
                    }
                    //사용자 사번 비교 
                    if(gooutbtnAuth.indexOf(_info_22.cuser.pinfo.empno) > -1){
                        authflag=true;
                    }
                } 
                
                //출근 처리 안하고 퇴근 금지
                //퇴근하고 출근 처리 금지 

                if(authflag){
                    console.log("버튼권한 있음 보이기 시작");
                    /* 카카오 api 쓰려면 주석 해제 하면 되는데 모바일 브라우저에서 실행안됨 
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                   // s.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=f1a372dd21dc750bac98c5bf42b9ff29&libraries=services&autoload=false";
                   s.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=c7c9a1346484e9b3e2d25210ecb5c03b&libraries=services&autoload=false";
                    $("head").append(s);
                   */
                    var _me = _$$.aprv_sub000.subdoc
                    $('#inoutflag').append('<div class="welfare-m" style="padding-bottom:0px">'+
                        '<div class="list" style="padding:0px 0px 0px 0px;">'+
                        '<div class="item" name="_go" style="width:50%">'+
                        '<a style="height:100px" name="_go1">'+
                        '<div class="thumb">'+
                        '<img src="/tcclibs/images/common-m/icon-welfare-img2.svg">'+
                        '<div class="title">출근</div>'+
                        '<div class="dwp-bold" name="stime"></div>'+
                        '</div>'+
                        '</a></div>'+
                        '<div class="item" name="_out" style="width:50%"><a style="height:100px" name="_out1">'+
                        '<div class="thumb"><img src="/tcclibs/images/common-m/icon-welfare-img3.svg">'+
                        '<div class="title">퇴근</div>'+
                        '<div class="dwp-bold" name="ftime"></div>'+
                        '</div>'+
                        '</a></div></div></div>');

                        var _udate=_info_22.sysinfo.date;
                        _udate=_udate.replaceAll("-","");
                        var _hrcomcode=_info_22.cuser.pinfo.hrcomcode;
                        var _rempno=_info_22.cuser.pinfo.rempno;
                        var _name=_info_22.cuser.pinfo.name;
                        var _mailid=_info_22.cuser.pinfo.mailid;

                        $fn.xAjax({
                            url: $fn.getProxyUrl('/dwp/com/work/mohistory.nsf/Form174post?createdocument'),		
                            method: 'POST',		
                            dataType: 'json',
                            data: {
                                actiontype:"조회",
                                Arg1: _hrcomcode,
                                Arg2:_udate,
                                Arg3:_rempno,                              
                                Arg5:_name,
                                Arg6:_mailid
                            },
                            async: false,
                            cache: false
                        }).done(function (data) {
                            console.log("처리",data);	
                            //2023-11-15 15:10:40.0↙2023-11-15 15:10:13.0
                            if(data.datalist == ""){
                                
                            }else if(data.datalist1 != ""){
                                var timearr=data.datalist; //출근시간
                                var timearr1=data.datalist1; //퇴근시간

                                $("[name=stime]").text(timearr.substring(0,2) +":"+timearr.substring(2,4));
                                $("[name=ftime]").text(timearr1.substring(0,2) +":"+timearr1.substring(2,4));


                            }else{
                             
                               //출근
                               var timearr=data.datalist;
                               $("[name=stime]").text(timearr.substring(0,2) +":"+timearr.substring(2,4));

                               $("[name=_go1]").css("background-color","#ABADAD");
                               //  $("[name=_out]").css("background-color","#eee");
                               $("[name=_out1]").css("background-color","#fff");  
                              // $("[name=stime]").text(_stime[0]+":"+_stime[1]);
                            }
                            
                        }).fail(function (req, error) {
                            console.log(req.responseText + '\n' + error);
                        });


                       $("[name=_go]").off("click").on("click", function () {
                            console.log("출근버튼클릭");
                           // alert("클릭")
                            console.log($("[name=_go1]").css("background-color"));
                            //$("[name=_go1]").attr("inputmode")="none"
                           // $(':focus').blur();  
                            if($("[name=_go1]").css("background-color") == "rgb(171, 173, 173)"){
                                return false;                                    
                            }
                            if($("[name=ftime]").text() != ""){
                                $fn.toast({msg : $fn.getCodeMsg("퇴근 후 출근 할 수 없습니다.") });
                                return false; 
                            }
                            
                          
                          navigator.geolocation.getCurrentPosition(position => {
                            const { latitude, longitude } = position.coords;
                            // Show a map centered at latitude / longitude.
                          
                            _me._lat=latitude;
                            _me._long=longitude;
                           // alert(_me._lat +"____"+_me._long)
                            //35.090670596526984,128.8590797663157
                          //  _me._lat="35.090670596526984"
                          //  _me._long="128.8590797663157"
                              /* 모바일에서는 실행 안됨 주석  
                                kakao.maps.load(function() {
                                    // v3가 모두 로드된 후, 이 콜백 함수가 실행됩니다.
                                   // alert("@@")
                                    var geocoder = new kakao.maps.services.Geocoder();
                                    var coord = new kakao.maps.LatLng(latitude, longitude);
                                    //var coord = new kakao.maps.LatLng(_me._lat, _me._long);
                                      var callback = function(result, status) {
                                          if (status === kakao.maps.services.Status.OK) {
                                          // alert("카카오api실행");
                                           console.log(result)
                                              console.log(result[0].address.region_1depth_name+result[0].address.region_2depth_name+result[0].address.region_3depth_name);
                                             // alert(result[0].address.region_1depth_name+result[0].address.region_2depth_name+result[0].address.region_3depth_name);
                                          }
                                      };
                                  
                                      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
                                });
                              */
                           
                            });

                           // curl -v -G GET "https://dapi.kakao.com/v2/local/geo/coord2address.json?x=127.423084873712&y=37.0789561558879&input_coord=WGS84" 
                           // -H "Authorization: KakaoAK ${REST_API_KEY}"
                          // alert(_me._lat +"____"+_me._long)
                           //구글맵스 api 키 사용
                        
                               
                           
                               

                                var result = confirm("출근 처리 하시겠습니까?");
                                setTimeout(function() {
                                    
                                        
                                        if(result){                     
                                            console.log(_me._lat +"____"+_me._long);
                                            //alert(_me._lat +"____"+_me._long)
                                            var locaitonurl="";
                                            var geolocaitonurl="";
                                            var sjuso="";
                                            if(_me._lat != ""){
                                                    locaitonurl="https://map.kakao.com/link/map/"+_me._lat+","+_me._long;
                                                  // console.log('https://dapi.kakao.com/v2/local/geo/coord2address.json?x='+_me._long+'&y='+_me._lat+'&input_coord=WGS84')
                                                    //x=127.423084873712&y=37.0789561558879
                                                  //  geolocaitonurl="https://dapi.kakao.com/v2/local/geo/coord2address.json?x=127.423084873712&y=37.0789561558879&input_coord=WGS84"
                                                    geolocaitonurl= "https://dapi.kakao.com/v2/local/geo/coord2address.json?x="+_me._long+"&y="+_me._lat+"&input_coord=WGS84"
                                                    $fn.xAjax({
                                                        url: geolocaitonurl,                                                       
                                                        headers: { 'Authorization': 'KakaoAK c7c9a1346484e9b3e2d25210ecb5c03b'},
                                                        type: 'GET',
                                                        async: false,
                                                        cache: false
                                                    }).done(function(data) {
                                                        console.log(data);
                                                        console.log(data.documents[0].address)
                                                        console.log(data.documents[0].address.region_1depth_name)
                                                        sjuso=data.documents[0].address.region_1depth_name+" "+data.documents[0].address.region_2depth_name+" "+data.documents[0].address.region_3depth_name
                                                        
                                                    });
                                                   
                                                    //alert(sjuso);
                                                   // return false;

                                                    //구글맵스 api 키 사용
                                                    /*
                                                    geolocaitonurl="https://maps.googleapis.com/maps/api/geocode/json?latlng="+_me._lat+","+_me._long+"&language=ko&key=AIzaSyAPWcEFR3AQeGZNrXdHQoxjT3dEUvj120U"
                                            
                                                    console.log(locaitonurl);
                                                    $fn.xAjax({
                                                        url: $fn.getProxyUrl(geolocaitonurl),		
                                                        method: 'POST',		
                                                        dataType: 'json',                                              
                                                        async: false,
                                                        cache: false
                                                    }).done(function (data) {
                                                        console.log("처리",data);							
                                                    
                                                        sjuso=data.results[0].formatted_address


                                                    }).fail(function (req, error) {
                                                        console.log(req.responseText + '\n' + error);
                                                    });
                                                    */
                                            }

                                            $fn.xAjax({
                                                url: $fn.getProxyUrl('/dwp/com/work/mohistory.nsf/Form173post?createdocument'),		
                                                method: 'POST',		
                                                dataType: 'json',
                                                data: {
                                                    actiontype:"출근",
                                                    Arg1: _hrcomcode,
                                                    Arg2:_udate,
                                                    Arg3:_rempno,
                                                    Arg4:locaitonurl,
                                                    Arg5:_name,
                                                    Arg6:_mailid,
                                                    Arg7:sjuso,
                                                },
                                                async: false,
                                                cache: false
                                            }).done(function (data) {
                                                console.log("처리",data);							
                                                var _stime=data.time.split(":");
                                                $fn.toast({msg : $fn.getCodeMsg("출근 처리 되었습니다. "+_stime[0]+":"+_stime[1]) });
                                                $("[name=stime]").text(_stime[0]+":"+_stime[1]);



                                            }).fail(function (req, error) {
                                                console.log(req.responseText + '\n' + error);
                                            });
                                        

                                            //$("[name=_go]").css("background-color","#00498c");
                                            $("[name=_go1]").css("background-color","#ABADAD");
                                        //  $("[name=_out]").css("background-color","#eee");
                                            $("[name=_out1]").css("background-color","#fff");     
                                            
                                            
                                        } 
                            }, 1000);  
                                                                        
                          }); // 출근버튼 클릭 끝

                          $("[name=_out]").off("click").on("click", function () {
                            console.log("퇴근버튼클릭");
                            if($("[name=_out1]").css("background-color") == "rgb(171, 173, 173)"){
                               // return false;                                    
                            }
                            console.log($("[name=stime]").text())
                            if($("[name=stime]").text() == ""){
                                $fn.toast({msg : $fn.getCodeMsg("출근 처리 후 퇴근 하세요") });
                                return false; 
                            }

                            navigator.geolocation.getCurrentPosition(position => {
                                const { latitude, longitude } = position.coords;
                                // Show a map centered at latitude / longitude.
                              
                                _me._lat=latitude;
                                _me._long=longitude;
                               // alert(_me._lat +"____"+_me._long)
                              
                                  /* 모바일에서는 실행 안됨 주석
                                    kakao.maps.load(function() {
                                        // v3가 모두 로드된 후, 이 콜백 함수가 실행됩니다.
                                       // alert("@@")
                                        var geocoder = new kakao.maps.services.Geocoder();
                                        var coord = new kakao.maps.LatLng(latitude, longitude);
                                          var callback = function(result, status) {
                                              if (status === kakao.maps.services.Status.OK) {
                                               // alert("카카오api실행")
                                                  console.log(result);
                                                  alert(result);
                                              }
                                          };
                                      
                                          geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
                                    });
                                    */
                               
                                });


                            var result = confirm("퇴근 처리 하시겠습니까?");
                            setTimeout(function() {
                                    if(result){                                
                                        //  $("[name=_out]").css("background-color","#00498c");
                                        console.log(_me._lat +"____"+_me._long);
                                            //alert(_me._lat +"____"+_me._long)
                                            var locaitonurl="";
                                            var geolocaitonurl="";
                                            var ejuso="";
                                            if(_me._lat != ""){
                                                locaitonurl="https://map.kakao.com/link/map/"+_me._lat+","+_me._long;
                                                
                                                geolocaitonurl= "https://dapi.kakao.com/v2/local/geo/coord2address.json?x="+_me._long+"&y="+_me._lat+"&input_coord=WGS84"
                                                $fn.xAjax({
                                                    url: geolocaitonurl,                                                       
                                                    headers: { 'Authorization': 'KakaoAK c7c9a1346484e9b3e2d25210ecb5c03b'},
                                                    type: 'GET',
                                                    async: false,
                                                    cache: false
                                                }).done(function(data) {
                                                    console.log(data);
                                                    console.log(data.documents[0].address)
                                                    console.log(data.documents[0].address.region_1depth_name)
                                                    ejuso=data.documents[0].address.region_1depth_name+" "+data.documents[0].address.region_2depth_name+" "+data.documents[0].address.region_3depth_name
                                                    
                                                });
                                            
                                                    console.log(locaitonurl);
                                                /*
                                                    //구글맵스 api 키 사용
                                                    geolocaitonurl="https://maps.googleapis.com/maps/api/geocode/json?latlng="+_me._lat+","+_me._long+"&language=ko&key=AIzaSyAPWcEFR3AQeGZNrXdHQoxjT3dEUvj120U"
                                            
                                                    console.log(locaitonurl);
                                                    $fn.xAjax({
                                                        url: $fn.getProxyUrl(geolocaitonurl),		
                                                        method: 'POST',		
                                                        dataType: 'json',                                              
                                                        async: false,
                                                        cache: false
                                                    }).done(function (data) {
                                                        console.log("처리",data);							
                                                    
                                                        ejuso=data.results[0].formatted_address


                                                    }).fail(function (req, error) {
                                                        console.log(req.responseText + '\n' + error);
                                                    });
                                                    */
                                             }

                                            $fn.xAjax({
                                                url: $fn.getProxyUrl('/dwp/com/work/mohistory.nsf/Form173post?createdocument'),		
                                                method: 'POST',		
                                                dataType: 'json',
                                                data: {
                                                    actiontype:"퇴근",
                                                    Arg1: _hrcomcode,
                                                    Arg2:_udate,
                                                    Arg3:_rempno,
                                                    Arg4:locaitonurl,
                                                    Arg5:_name,
                                                    Arg6:_mailid,
                                                    Arg7:ejuso
                                                },
                                                async: false,
                                                cache: false
                                            }).done(function (data) {
                                                console.log("처리",data);							
                                                var _stime=data.time.split(":");
                                                $fn.toast({msg : $fn.getCodeMsg("퇴근 처리 되었습니다. "+_stime[0]+":"+_stime[1]) });
                                                $("[name=ftime]").text(_stime[0]+":"+_stime[1]);
                                                
                                            }).fail(function (req, error) {
                                                console.log(req.responseText + '\n' + error);
                                            });
                                    
                                      //  $("[name=_out1").css("background-color","#ABADAD");
                                        //   $("[name=_go]").css("background-color","#eee");
                                        $("[name=_go1]").css("background-color","#fff");                               
                                    } 

                             }, 1000); 
                              
                            
                          });
                }else{
                    console.log("출퇴근버튼권한없음");
                }
                
             
            }
            ,
            getaddress : {





            }


        }
    }
}($dwp.cns("app"), jQuery));











