/*获取cookie中的用户名*/
var loginCode = $.cookie("login_Code");
/*获取cookie中的登陆密码*/
var pass =  $.cookie("pass");
/*取出localStorage中的数据*/
var UserInformation1 = JSON.parse(window.localStorage['UserInformation']);
/*弹出层*/
    function Popping() {
        $(".popup").addClass("popupshow");
        setTimeout(function () {
            $(".popup").removeClass("popupshow");
        }, 1500);
    }
/*首页处理逻辑*/
    function wordbook(obj) {
        data = [
            {
                "userNo": "无欠费信息",
                "userImg": "上传图片成功",
                "codeerror": "验证码不正确",
                "ResetPass": "重置密码成功",
                "bangding": "绑定失败",
                "AlreadyBangDing": "此号已经绑定",
                "BangDingSucc": "绑定成功",
                "phoneerror": "手机号码不正确",
                "shujuyichang": "数据异常",
                "notRegister": "手机号未注册",
                "removebangding": "解除绑定成功",
                "removebangdingerror": "解除绑定失败",
                "BangDingUserNo": "请尽快去绑定自己的用水户号"
            }
        ];
        var Nohtml = "",
            choosecustomerno = [],
            choosecustomerprice = [],
            customerNodata1 = sessionStorage.getItem("customerNodata1");
        for (var j = 0, len1 = data.length; j < len1; ++j) {
            // $(".lastul").html("");
            if (data[j].userNo === obj) {
                console.log(obj.split(",").length);
                for (var x= 0 , len = obj.split().length; x < len; ++x){
                    Nohtml = 
                                "<li class='RemainMoney'>" +
                                    "<div class='left-cont'><p>户号: <span class='num' style='color: #fff;'>" + customerNodata1[x] + "</span></p></div>" +
                                    "<div class='right-cont'><p>" + "未欠费" + "</p></div>" +
                                "</li>";
                }
                $(".lastul").append(Nohtml);
                $(".index .lastul li.RemainMoney").css("background","#27c54d");
                /*未欠费金额*/
                $(".index .meter-list li.RemainMoney .right-cont").each(function (i) {
                    choosecustomerprice.push($(this).text());
                });
                /*未欠费户号*/
                $(".index .meter-list li.RemainMoney .left-cont .num").each(function (i) {
                    choosecustomerno.push($(this).text());
                });
                $(".index .meter-list li.RemainMoney").each(function (i) {

                    $(this).click(function () {
                        /*获取用户用水图表*/
                        var Arrearagechart = [];
                        Arrearagechart.push(telphone,choosecustomerno[i]);
                        setTimeout(function () {
                            /*初始显示(获取历史数据图表类)*/
                            RequestPost("CustomerChartInfo",Arrearagechart);

                        },500);
                        /*点击查询全部表单*/
                        var pricemes = "<p>姓名: <span class='mes'>"+ choosecustomername +"</span></p>"+
                            "<p>户号: <span class='mes'>"+ choosecustomerno[i] +"</span></p>"+
                            "<p>欠费金额: <span style='color: #27C54D'>"+ choosecustomerprice[i] +"</span></p>";
                        $(".index .recharge-cont").html(pricemes);
                        /*点击图表视图刷新按钮*/
                        $("#refresh").click(function () {
                            var UserNo = $(".index .common-ipt p .mes").eq(1).text();
                            var Mchart = [];
                            Mchart.push(telphone,UserNo);
                            RequestPost("CustomerChartInfo",Mchart);
                        });
                    });
                });

                /*发送ajax*/
                function RequestPost(Method, value) {
                    var data = '<?xml version="1.0" encoding="utf-8"?>';
                    data += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
                    data += '<soap:Body>';
                    data += '<' + Method + ' xmlns="http://ws.zsyltec.com">';
                    for (var i = 0; i < value.length; i++) {
                        data += '<in' + i + '>' + value[i] + '</in' + i + '>';
                    }
                    data += '</' + Method + '>';
                    data += '</soap:Body>';
                    data += '</soap:Envelope>';
                    $.ajax({
                        url: "http://112.74.160.51:8084/AppWebService/AppData",
                        type: "POST",
                        data: data,
                        error: function () {
                        },
                        success: function (response) {
                            var obj = $(response).find("out").html();//取得文本
                            wordbook(obj);
                        }
                    });
                }
                function wordbook(a) {
                    data = [
                        {
                            "charterror": "无法查到数据"
                        }
                    ];
                    for (var i = 0, len = data.length; i < len; ++i) {
                        if (data[i].charterror === a) {
                            $(".popup").html(data[i].charterror);
                            Popping();
                            $("#hismain").addClass("hismain");
                            $(".list-month-mes").addClass("hismain");
                        }else {
                            var ChartData = JSON.parse(a);
                            $("#hismain").removeClass("hismain");
                            $(".list-month-mes").removeClass("hismain");
                            /*折线图表*/
                            Chart(ChartData);
                            /*全部表单*/
                            allchart(ChartData);
                        }
                    }
                }
            }
            /*验证码*/
            else if (data[j].codeerror === obj) {

                $(".popup").html(data[j].codeerror);
                Popping();
            }
            /*上传图片*/
            else if (data[j].userImg === obj) {
                $(".popup").html(data[j].userImg);
                Popping();
                setTimeout(function () {
                    //重新调用登录
                    ReLoginPost("Login", UserInformation1);
                }, 1500);

                // /*刷新（重新加载一次）*/
                // setTimeout(function () {
                //     window.location.reload();
                // },1500);
            }
            /*绑定失败*/
            else if (data[j].bangding === obj) {

                $(".popup").html(data[j].bangding);
                Popping();
            }
            /*解除绑定失败*/
            else if (data[j].removebangdingerror === obj) {

                $(".popup").html(data[j].removebangdingerror);
                Popping();
            }
            /*解除绑定成功*/
            else if (data[j].removebangding === obj) {
                $(".popup").html(data[j].removebangding);
                Popping();
                setTimeout(function () {
                    ReLoginPost("Login", UserInformation1);
                }, 1500);
            }
            /*手机号码不正确*/
            else if (data[j].phoneerror === obj) {

                $(".popup").html(data[j].phoneerror);
                Popping();
            }
            /*请尽快去绑定自己的用水户号*/
            else if (data[j].BangDingUserNo === obj) {
                $(".popup").html(data[j].BangDingUserNo);
                Popping();
                setTimeout(function () {
                    ReLoginPost("Login", UserInformation1);
                }, 1500);
            }
            /*手机未注册*/
            else if (data[j].notRegister === obj) {
                $(".popup").html(data[j].notRegister);
                Popping();
            }
            /*此号已经绑定*/
            else if (data[j].AlreadyBangDing === obj) {
                $(".popup").html(data[j].AlreadyBangDing);
                Popping();
                setTimeout(function () {
                    ReLoginPost("Login", UserInformation1);
                }, 1500);
            }
            /*数据异常*/
            else if (data[j].shujuyichang === obj) {
                $(".popup").html(data[j].shujuyichang);
                Popping();
            }
            /*绑定成功*/
            else if (data[j].BangDingSucc === obj) {
                $(".popup").html(data[j].BangDingSucc);
                Popping();
                setTimeout(function () {
                    ReLoginPost("Login", UserInformation1);
                }, 1500);
            }
            /*重置密码*/
            else if (data[j].ResetPass === obj) {
                $(".popup").html(data[j].ResetPass);
                Popping();
                $.cookie("login_Code",loginCode,{ expires: -1 });//删除 cookie
                $.cookie("pass",$.base64.encode(pass),{ expires: -1 });
                /*密码修改成功跳转*/
                setTimeout(function () {
                    window.location.href = "login.html";//页面跳转
                }, 1500);
            } else {
                    /*验证码*/
                if (obj.length === 5 && !isNaN(obj)) {
                    /*验证码直接传进输入框*/
                    // console.log(obj);
                    // $("#code").val(obj);
                    // $("#remove-code").val(obj);
                } else if (obj.length === 6 && !isNaN(obj)) {
                    $(".showmes-inner").html(obj);
                } else if(data[j].userNo !== obj){
                    var homedata = JSON.parse(obj);
                    var ArreaRage = 0;
                    var htmlstr = "";
                    for (var i = 0, len = homedata.length; i < len; ++i) {
                        // console.log(typeof homedata[i].RemainMoney);
                        if(homedata[i].RemainMoney > 0){
                            ArreaRage += homedata[i].Arrearage;
                            price = Math.ceil(ArreaRage-homedata[0].RemainMoney);//小数点加1
                        }else if (homedata[i].RemainMoney < 0){
                            ArreaRage += homedata[i].Arrearage;
                            price = Math.ceil(ArreaRage+(-homedata[0].RemainMoney));//小数点加1
                        }else if(homedata[i].RemainMoney === 0){
                            ArreaRage += homedata[i].Arrearage;
                            price = Math.ceil(ArreaRage);//小数点加1
                        }
                    htmlstr = "<li class='Arrearage'>" +
                                "<div class='left-cont'><p>户号: <span class='num' style='color: #fff;'>" + homedata[i].customerNo + "</span></p></div>" +
                                "<div class='right-cont'>" + "-" + price + ".00" + "<i class='iconfont guide'></i></div>" +
                            "</li>";
                                  
                    }
                    $(".lastul").append(htmlstr);
                    /*用户欠费提示*/
                    $(".index .lastul li.Arrearage").css("background","#f27e6f");
                    /*欠费金额*/
                    $(".index .meter-list li.Arrearage .right-cont").each(function (i) {
                        choosecustomerprice.push($(this).text());
                    });
                    /*欠费户号*/
                    $(".index .meter-list li.Arrearage .left-cont .num").each(function (i) {
                        choosecustomerno.push($(this).text());
                    });
                  
                    $(".index .meter-list li.Arrearage").each(function (i) {
                        $(this).click(function () {
                            //获取用户用水图表
                            var Arrearagechart = [];
                            Arrearagechart.push(telphone,choosecustomerno[i]);
                            setTimeout(function () {
                                /*初始显示(获取历史数据图表类)*/
                                RequestPost("CustomerChartInfo",Arrearagechart);
                            },500);
                            /*点击查询全部表单*/
                            var pricemes = "<p>姓名: <span class='mes'>"+ choosecustomername +"</span></p>"+
                                "<p>户号: <span class='mes'>"+ choosecustomerno[i] +"</span></p>"+
                                "<p>欠费金额: <span class='money'>"+ choosecustomerprice[i] +"</span></p>";
                            $(".index .recharge-cont").html(pricemes);
                            // 点击刷新
                            $("#refresh").click(function () {
                                var UserNo = $(".index .common-ipt p .mes").eq(1).text();
                                var Mchart = [];
                                Mchart.push(telphone,UserNo);
                                RequestPost("CustomerChartInfo",Mchart);
                            });
                        });
                    });
                    // 发送ajax
                    function RequestPost(Method, value) {
                        var data = '<?xml version="1.0" encoding="utf-8"?>';
                        data += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
                        data += '<soap:Body>';
                        data += '<' + Method + ' xmlns="http://ws.zsyltec.com">';
                        for (var i = 0; i < value.length; i++) {
                            data += '<in' + i + '>' + value[i] + '</in' + i + '>';
                        }
                        data += '</' + Method + '>';
                        data += '</soap:Body>';
                        data += '</soap:Envelope>';
                        // console.log(data);
                        $.ajax({
                            url: "http://112.74.160.51:8084/AppWebService/AppData",
                            type: "POST",
                            data: data,
                            error: function () {
                            },
                            success: function (response) {
                                var obj = $(response).find("out").html();//取得文本
                                wordbook(obj);
                            }
                        });
                    }
                    function wordbook(a) {
                        data = [
                            {
                                "charterror": "无法查到数据"
                            }
                        ];
                        for (var i = 0, len = data.length; i < len; ++i) {
                            if (data[i].charterror === a) {
                                $(".popup").html(data[i].charterror);
                                Popping();
                                $("#hismain").addClass("hismain");
                                $(".list-month-mes").addClass("hismain");
                            }else {
                                var ChartData = JSON.parse(a);
                                $("#hismain").removeClass("hismain");
                                $(".list-month-mes").removeClass("hismain");
                                // console.log(ChartData);
                                //图表
                                Chart(ChartData);
                                //全部表单
                                allchart(ChartData);
                            }
                        }
                    }
                }
            }
        }
    }
    /*重新登录*/
    function ReLoginPost(Method, value) {
        var data = '<?xml version="1.0" encoding="utf-8"?>';
        data += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
        data += '<soap:Body>';
        data += '<' + Method + ' xmlns="http://ws.zsyltec.com">';
        for (var i = 0; i < value.length; i++) {
            data += '<in' + i + '>' + value[i] + '</in' + i + '>';
        }
        data += '</' + Method + '>';
        data += '</soap:Body>';
        data += '</soap:Envelope>';
        console.log(data);
        $.ajax({
            url: "http://112.74.160.51:8084/AppWebService/AppData",
            type: "POST",
            data: data,
            success: function (response) {
                var obj = $(response).find("out").html();//取得文本
                console.log(obj);
                if (obj === "请尽快去绑定自己的用水户号") {
                    $(".popup").html(obj);
                    Popping();
                    sessionStorage.formData = obj;
                    window.location.href = "home.html";
                    // var MyArray1 = sessionStorage.formData;
                }else {
                    var logindata = JSON.parse(obj);
                    //覆盖之前的sessionstorage
                    sessionStorage.formData = JSON.stringify(logindata);
                    window.location.href = "home.html";
                }
            }
        });
    }