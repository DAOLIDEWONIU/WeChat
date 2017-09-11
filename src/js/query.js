
$(document).ready(function () {
    /*实现滚动条无法滚动*/
    var NoMove=function(e){e.preventDefault();};
    /*禁止页面滑动*/
    function stop(){
        document.body.style.overflow='hidden';
        document.addEventListener("touchmove",NoMove,false);
    }
    /*取消滑动限制**/
    function move(){
        document.body.style.overflow='';//出现滚动条
        document.removeEventListener("touchmove",NoMove,false);
    }
    // 点击下载按钮遮罩层出现
    // $(".APP_download").click(function () {
    //     window.location.href = "http://down.xchysw.cn/app-debug.apk_1.0.apk";
    //     $(".masking").addClass("maskingClose-arr").css("background","rgba(0, 0, 0, 0.68)");
    //     $(".other").css("display","block");
    // });
    // $("#close").click(function () {
    //     $(".masking").removeClass("maskingClose-arr").css("background","rgba(0, 0, 0, 0.4)");
    //     $(".other").css("display","none");
    // });
    /*查询户号欠费状态（手动）*/
    $(".Query-Btn").click(function () {
        $(".removeicon").removeClass("removeshow");
        var USERNO = $(".index .iptuserNo").val(),
            iptusertel = $(".index input[name='tel']").val(),
            Method = $(".Query-Btn").attr("name");
        if(USERNO === ""){
            $(".popup").html("请输入查询户号");
            SendRequest.Popping();
        }else if(iptusertel === ""){
            $(".popup").html("请输入查询电话号码");
            SendRequest.Popping();
        }else if (/^1[34578]\d{9}$/.test(iptusertel) === false){
            $(".popup").html("请输入正确的手机号");
            SendRequest.Popping();
        }else if(USERNO !== "" && /^1[34578]\d{9}$/.test(iptusertel) === true && iptusertel !== ""){
            var searchdata = [];
            searchdata.push(USERNO,iptusertel);
            SendRequest.SearchPost(Method,searchdata);
        }
    });
    /*清空输入框值*/
        $(".iptuserNo").each(function (i) {
            $(this).bind('input propertychange', function() {
                //进行相关操作
                var len = $(this).val().length;
                // console.log(len);
                if(len >0){
                    var UserNo = $("input[name='number']").val().length;
                    var tel = $("input[name='tel']").val().length;
                    // console.log(UserNo);
                    // console.log(tel);
                    if(UserNo >0){
                        $(".removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
                    } else if(tel >0){
                        $(".removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
                    }
                    if(UserNo >0 && tel > 0){
                        $(".Query-Btn").addClass("Query-Btn-change").removeAttr("disabled");
                    }
                }else {
                    $(".removeicon").removeClass("removeshow");
                    $(".Query-Btn").removeClass("Query-Btn-change").prop("disabled","disabled");
                }
            });
            $(this).focus(function () {
                if($(this).val() === ""){
                    $(".removeicon").removeClass("removeshow");
                }else {
                    $(".removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
                }
            });
            var UserNo = $("input[name='number']").val().length;
            var tel = $("input[name='tel']").val().length;
            if(UserNo >0 && tel > 0){
                $(".Query-Btn").addClass("Query-Btn-change").removeAttr("disabled");
            }

        });
        //删除操作
        $(".removeicon").each(function (i) {
            $(this).click(function () {
                $(this).removeClass("removeshow");
                $(".Query-Btn").removeClass("Query-Btn-change").prop("disabled","disabled");
                $(".iptuserNo").eq(i).val('').focus();
            })
        });
    // });
    /*发送*/
    var  SendRequest= {
        /*弹出层*/
        Popping:function () {
            $(".popup").addClass("popupshow");
            setTimeout(function () {
                $(".popup").removeClass("popupshow");
            }, 1500);
        },
        //查询缴费
        SearchPost:function (Method,value) {
                var data = '<?xml version="1.0" encoding="utf-8"?>' ;
                data +='<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
                data +='<soap:Body>';
                data += '<'+Method+' xmlns="http://ws.zsyltec.com">';
                for(var i=0;i<value.length;i++){
                    data += '<in'+ i +'>'+value[i]+'</in'+i+'>';
                }
                data +='</'+Method+'>';
                data +='</soap:Body>' ;
                data +='</soap:Envelope>';
                $.ajax({
                    url:"http://112.74.160.51:8084/AppWebService/AppData",
                    // url:"http://182.151.200.150:8084/AppWebService_wx/AppData",//缴费用
                    type: "post",
                    data:data,
                    dataType:'xml',
                    beforeSend: function () { // 禁用按钮防止重复提交
                        $(".Query-Btn").prop("disabled","disabled");
                        setTimeout(function () {
                            $(".Query-Btn").removeAttr("disabled");
                        },1500);
                        $(".popup").html("正在获取...").addClass("popupshow");
                    },
                    success:function (data) {
                        console.log('下面是返回数据');
                        console.log($.xml2json(data).Body.ReturnCustomerArrearageInfo2Response.out);


                        var res = $.xml2json(data).Body.ReturnCustomerArrearageInfo2Response.out;
                        // var res = $(data).find("out").text();//取得文本   html() Safari 无法获取到
                        // var res1 = JSON.stringify(res);
                        // console.log("这里返回的数据是 === "+res);
                        $(".popup").html('').removeClass("popupshow");
                        SendRequest.wordbook(res);
                    },
                    error:function (response) {
                        if(response.status === 500){
                            $(".popup").html("服务器出错，请稍后再试");
                            SendRequest.Popping();
                        }
                    }
                });
            },
        wordbook:function (a) {
            var abc;
            var ArrearageInfo = '';
            var ArrearageInfo2 = '';
            var mesdata = [
                {
                    "Searcherror":"数据查询失败",
                    "Searchno":"无欠费信息",
                    "phoneiserror":"所留的电话错误"
                }
            ];

            for (var i = 0 ,len = mesdata.length; i <len ; ++i){

                if(mesdata[i].Searcherror == a){
                    $(".popup").html("无此户号");
                    SendRequest.Popping();
                }else if(mesdata[i].phoneiserror == a){
                    $(".popup").html(mesdata[i].phoneiserror);
                    SendRequest.Popping();
                }else if(JSON.parse(a).TAX == 'false'){//TAX false
                    if(JSON.parse(a).UserInfo === 1){// UserInfo == 1 可以预存，0 不能预存
                        stop();
                        $(".result").addClass("result-show");
                        $(".masking").addClass("maskingClose-arr");
                        ArrearageInfo += "<div class=\"common-div\">" +
                            "<div class='result-cont'>"+
                            "<p style='text-align: center;color: #262626'>"+mesdata[i].Searchno+""+"</p>"+
                            "<p style='text-align: center;color: #262626'>"+"账户余额为："+JSON.parse(a).Remainmoney+"</p>"+ //JSON.parse(a).Remainmoney
                            "<p style='text-align: center;color: #262626'>是否进行预存充值？</p>"+
                            "</div>"+
                            "<div class=\"makesure\">"+
                            "<div class=\"common_query_btn no\" id='ArrearageNO'>取消</div>"+
                            "<div class=\"common_query_btn yes\" id='ArrearageYES' style='color: #0BB20C;'>确定</div>"+
                            "</div>"+
                            "</div>";
                        $(".result").html(ArrearageInfo);
                        /**操作**/
                        $("#ArrearageNO").click(function () {
                            move();
                            $(".result").html('').removeClass("result-show");
                            $(".masking").removeClass("maskingClose-arr");
                        });

                        $("#ArrearageYES").click(function () {
                            var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
                            var userinfo = [];
                            if( !wechatInfo ) {
                                $(".popup").html("此功能仅支持微信");
                                SendRequest.Popping();
                            } else if ( wechatInfo[1] < "5.0" ) {
                                $(".popup").html("此功能仅支持微信5.0以上版本");
                                SendRequest.Popping();
                            }else {
                                userinfo.push($("#userNo").val(),$("#phone").val());
                                sessionStorage.formData = JSON.stringify(userinfo);
                                /**屏蔽跳转*/
                                // window.location.replace("http://www.zsyltec.com/WeChat/dist/html/Prestore.html");
                                window.location.replace("../html/Prestore.html");
                            }
                        })
                    }else {
                        stop();
                        $(".result").addClass("result-show");
                        $(".masking").addClass("maskingClose-arr");
                        ArrearageInfo += "<div class=\"common-div\">" +
                            "<div class='result-cont'>"+
                            "<p style='text-align: center;color: #262626'>"+mesdata[i].Searchno+""+"</p>"+
                            "<p style='text-align: center;color: #262626'>"+"账户余额为："+JSON.parse(a).Remainmoney+"</p>"+ //JSON.parse(a).Remainmoney
                            "</div>"+
                            "<div class=\"makesure\">"+
                            "<div class=\"common_query_btn no\" id='Arrearage1NO'>确定</div>"+
                            "</div>"+
                            "</div>";
                        $(".result").html(ArrearageInfo);
                        /**操作**/
                        $("#Arrearage1NO").click(function () {
                            move();
                            $(".result").html('').removeClass("result-show");
                            $(".masking").removeClass("maskingClose-arr");
                        });
                    }
                }else if(JSON.parse(a).TAX == 'true'){//JSON.parse(a).info == '无欠费信息' &&
                    stop();
                    $(".result").addClass("result-show");
                    $(".masking").addClass("maskingClose-arr");
                    ArrearageInfo2 += "<div class=\"common-div\">" +
                        "<div class='result-cont'>"+
                        "<p style='text-align: center;color: #262626'>"+mesdata[i].Searchno+""+"</p>"+
                        "<p style='text-align: center;color: #262626'>"+"账户余额为："+JSON.parse(a).Remainmoney+"</p>"+ //JSON.parse(a).Remainmoney
                        "</div>"+
                        "<div class=\"makesure\">"+
                        "<div class=\"common_query_btn no\" id='ArrearageNO' style='color: #3d76cd'>确定</div>"+
                        "</div>"+
                        "</div>";
                    $(".result").html(ArrearageInfo2);

                    /**操作**/

                    $("#ArrearageNO").click(function () {
                        move();
                        $(".result").html('').removeClass("result-show");
                        $(".masking").removeClass("maskingClose-arr");
                    });

                }  else {
                    stop();
                    $(".result").addClass("result-show");
                    $(".masking").addClass("maskingClose-arr");
                    var BackData = JSON.parse(a);
                    var ArreaRage = 0,
                        htmlBalance = "",//余额
                        arrearageID = [];
                    function sub(obj) {
                        var len = obj.length;
                        switch (true){
                            case len === 1:
                                obj = obj;
                                break;
                            case len > 1 && len <4 :
                                obj = '*'+obj.substring(1,len);
                                break;
                            case len > 3:
                                obj = "**" + obj.substring(2, len);
                                break;
                        }
                        return obj;
                    }
                    var Money ,
                        UserID,
                        name,
                        Address,
                        water = 0,
                        searchHtml;
                    var sortdata = [];
                    for (var x = 0,len1 = BackData.length; x < len1 ; ++x){
                        sortdata.push(BackData[x]);
                        var compare = function(a, b){
                            if (a.CheckDate < b.CheckDate) {
                                return -1;
                            } else if (a.CheckDate > b.CheckDate) {
                                return 1;
                            }else{
                                return 0;
                            }
                        };
                        abc = sortdata.sort(compare);
                        /*隐藏姓名前几个字*/
                        //小数点加1
                        // Money = Math.ceil(ArreaRage-BackData[0].RemainMoney);
                        UserID = BackData[0].customerNo;
                        name = sub(BackData[0].userName);
                        Address = BackData[0].Address;
                        water += BackData[x].ArrearageWater;
                        arrearageID.push(BackData[x].ArrearageID);
                        ArreaRage += BackData[x].Arrearage;
                        switch (true){
                            case BackData[0].RemainMoney > 0:
                                Money = Math.ceil(ArreaRage-BackData[0].RemainMoney);
                                break;
                            case BackData[0].RemainMoney < 0:
                                Money = Math.ceil(ArreaRage+(-BackData[0].RemainMoney));
                                break;
                            case BackData[0].RemainMoney === 0:
                                Money = Math.ceil(ArreaRage);
                                break;
                        }
                        // console.log(BackData[0].RemainMoney);
                        // console.log(ArreaRage);
                        // console.log(ArreaRage+(-BackData[0].RemainMoney));
                        // console.log(Money);
                        searchHtml = "<div class=\"common-div\">" +
                            "<div class='result-cont'>"+
                            "<p class='name'><span class='title-mes'>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span> <span class='CustomerMes'>"+ name +"</span></p>"+
                            "<p><span class='title-mes'>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span> <span class='CustomerMes' id='customerNo'>"+ UserID +"</span></p>"+
                            "<p><sapn class='title-mes'>欠费月数</sapn> <span class='CustomerMes'>"+ BackData.length +"</span></p>"+
                            "<p><span class='title-mes'>欠费水量</span> <span class='CustomerMes'>"+ water +"m³"+"</span></p>"+
                            "<p><sapn class='title-mes'>欠费金额</sapn> <span class='CustomerMes money' id='money'>"+ Money +"</span></p>"+
                            "</div>"+
                            "<div class='common-ipt' style='display: none;'>"+
                            "<p>充值额度: <input type='number' class=\"moneynum\" id='RechargeNum'><button class=\"moneybtn\" id='recharge' name='CustomerCharge'>去充值</button></p>"+
                            "</div>"+
                            "<div class=\"makesure\">"+
                            "<div class=\"common_query_btn no\">取消</div>"+
                            "<div class=\"common_query_btn yes\" id='yes' style='color: #0BB20C;'>缴费</div>"+
                            "</div>"+
                            "</div>";
                        $(".result").html(searchHtml);
                    }
                    /*点击取消*/
                    $(".result .no").click(function () {
                        move();
                        $(".result").html('').removeClass("result-show");
                        $(".masking").removeClass("maskingClose-arr");
                    });
                    /*点击确认*/
                    $(".result .yes").click(function () {
                        var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
                        if( !wechatInfo ) {
                            $(".popup").html("此功能仅支持微信");
                            SendRequest.Popping();
                        } else if ( wechatInfo[1] < "5.0" ) {
                            $(".popup").html("此功能仅支持微信5.0以上版本");
                            SendRequest.Popping();
                        }else {
                            var price          = $("#money").text(),//欠费金额
                                customerNo     = $("#customerNo").text(),//欠费户号
                                code           = sessionStorage.getItem("code"),//用户code
                                ArrearageID    = "",
                                Prepay_Id_data = [];
                            for (var j = 0, len = abc.length; j < len ; ++j){
                                ArrearageID += abc[j].ArrearageID+",";
                            }
                            var details = {
                                "subject": "水费",
                                "body":"水费",
                                "price": (parseInt(price)*100).toString() //测试：1  这里的单位是分
                            };
                            sessionStorage.setItem("customerNo",customerNo);
                            sessionStorage.setItem("price",price);
                            Prepay_Id_data.push(customerNo,JSON.stringify(details),ArrearageID.substring(0,(ArrearageID.length-1)),"1");
                            // console.log(details);
                            // console.log(Prepay_Id_data);
                            SendRequest.Get_Prepay_Id_Post("CustomerCharge_WeiXin",Prepay_Id_data);
                        }
                    });
                }
            }
        },
        //获取Prepay_Id
        Get_Prepay_Id_Post:function (Method,value) {
            var data = '<?xml version="1.0" encoding="utf-8"?>' ;
            data +='<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
            data +='<soap:Body>';
            data += '<'+Method+' xmlns="http://ws.zsyltec.com">';
            for(var i=0;i<value.length;i++){
                data += '<in'+ i +'>'+value[i]+'</in'+i+'>';
            }
            data +='</'+Method+'>';
            data +='</soap:Body>';
            data +='</soap:Envelope>';
            var ErrorData = [
                {
                    "ErrorMes":"调用发生错误"
                }
            ];
            $.ajax({
                url:"http://112.74.160.51:8084/AppWebService/AppData",
                // http://112.74.160.51:8084/AppWebService/AppData?wsdl
                type: "POST",
                data:data,
                beforeSend:function () {
                    $(".popup").html("正在获取...").addClass("popupshow");
                    $("#yes").prop("disabled","disabled");
                },
                success:function (data) {

                    console.log('下面是返回数据')
                    console.log($.xml2json(data).Body.CustomerCharge_WeiXinResponse);

                    var obj = $.xml2json(data).Body.CustomerCharge_WeiXinResponse.out;//取得文本
                    for (var i = 0 ,len = ErrorData.length; i < len; ++i){
                        if(obj === ErrorData[i].ErrorMes){
                            $(".popup").html("调用发生出错，正在返回首页").addClass("popupshow");
                            setTimeout(function () {
                                $(".popup").removeClass("popupshow");
                                window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc08820bd9d3c1bf9&redirect_uri=http://www.zsyltec.com/WeChat/dist/html/Oppenid.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
                            }, 1500);
                        }else {
                            $(".popup").html('').removeClass("popupshow");
                            sessionStorage.formData = obj;
                            window.location.href = "../html/Paying.html";
                        }
                    }
                },
                error:function (data) {
                    if(data.status === 500){
                        $(".popup").html("服务器出错，请稍后再试");
                        SendRequest.Popping();
                        $("#yes").removeAttr("disabled");
                    }
                }
            });
        }
    }
});
