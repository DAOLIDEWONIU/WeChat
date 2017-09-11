$(document).ready(function () {
    
    /*
     * 清空输入框值
     * */
    $(".iptout").each(function (i) {
        $(this).bind('input propertychange', function() {
            //进行相关操作
            var len = $(this).val().length;
            // console.log(len);
            if(len >0){
                var username = $("#username").val().length;
                var customerNo = $("#customerNo").val().length;
                var code = $("#code").val().length;
                if(username >0){
                    $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
                } else if(customerNo >0){
                    $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
                }else if(code > 0){
                    $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
                }
                if(username >0 && customerNo > 0 && code > 0){
                    $("#regi-btn").addClass("btnchange").removeAttr("disabled");
                }
            }else {
                $(".removeout").removeClass("showremove");
                $("#regi-btn").removeClass("btnchange").prop("disabled","disabled");
            }
        });
        $(this).focus(function () {
            if($(this).val() === ""){
                $(".removeout").removeClass("showremove");
            }else {
                $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
            }
        });
    });

    //删除操作
    $(".removeout").each(function (i) {
        $(this).click(function () {
            $(this).removeClass("showremove");
            $("#regi-btn").removeClass("btnchange").prop("disabled","disabled");
            $(".iptout").eq(i).val("").focus();
        });
    });
 
    $("#regi-btn").click(function () {
        $(".removeout").removeClass("showremove");
        var value = [];
        var username = $("#username").val(),
            customerNo = $("#customerNo").val(),
            code = $("#code").val(),
            Method = $("#regi-btn").attr("name");
        value.push(customerNo,username,code);
        if(username === ""){
            $(".popup").html("请填入手机号");
            sendAjax.Popping();
        }else if(customerNo === ""){
            $(".popup").html("请输入户号");
            sendAjax.Popping();
        }
        // else if(!(/^.{6,}$/.test(customerNo))){
        //     $(".popup").html("密码不得低于六位数字");
        //     sendAjax.Popping();
        // }
        else if (!(/^1[34578]\d{9}$/.test(username)) ){
            $(".popup").html("请输入正确的手机号");
            sendAjax.Popping();
        }else if(/^1[34578]\d{9}$/.test(username) === true && username !== ""　&&　customerNo !== "" ){
            sendAjax.BangDingRequest(Method,value);
        }
    });

    //获取验证码
    $(".btn-phonecode").click(function () {
        var codearr = [];
        var username = $("#username").val();
        var userno = $("#customerNo").val();
        var code = "";
        var Method = $(".btn-phonecode").attr("name");
        codearr.push(username,code,userno);
        switch (true){
            case username.length === 0 :
                $(".popup").html("手机号不能为空!");
                sendAjax.Popping();
                break;
            case userno.length === 0 :
                $(".popup").html("户号不能为空!");
                sendAjax.Popping();
                break;
            case !(/^1[34578]\d{9}$/.test(username)) :
                $(".popup").html("手机号格式不正确!");
                sendAjax.Popping();
                break;
            default :
                _self = this;
                sendAjax.RequestPost(Method,codearr);
        }
    });
    var countdown=60;
    var sendAjax = {
        // 弹出层
        Popping: function () {
                $(".register-outer .popup").addClass("popupshow");
                setTimeout(function () {
                    $(".register-outer .popup").removeClass("popupshow");
                },1500);
            },
        //倒计时
        settime:function (obj) {
            if (countdown === 0) {
                obj.style.color = "#fff";
                obj.removeAttribute("disabled");
                obj.innerHTML="发送验证码";
                countdown = 60;
                return;
            } else {
                obj.style.color = "#fff";
                obj.setAttribute("disabled", "true");
                obj.innerHTML="重新发送(" + countdown + ")";
                countdown--;
            }
            setTimeout(function(){
                sendAjax.settime(obj);
            },1000);
        },
        //ajax
        RequestPost:function (Method,value) {
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
                url: "http://112.74.160.51:8084/AppWebService/AppData",
                type: "POST",
                dataType: "xml",
                contentType: "text/xml; charset=utf-8",
                data: data,
                beforeSend: function() {
                    $("#regi-btn").prop("disabled","disabled");
                    setTimeout(function () {
                        $("#regi-btn").removeAttr("disabled");
                    },1500);
                    $(".popup").html("正在加载，请稍后...");
                    sendAjax.Popping();
                },
                success: function (data) {
                    console.log($.xml2json(data).Body);
                    var obj = $.xml2json(data).Body.SendMessageSmsResponse.out;//取得文本  WeiXinBindingResponse
                    console.log(obj);
                    console.log(typeof obj);
                    // sendAjax.RegisterRun(obj);
                    if(obj == "true"){
                        $(".popup").html("绑定成功");
                        sendAjax.Popping();
                        var UsermesArr = [];
                        var tel = $("#username").val();
                        var UserNo = $("#customerNo").val();
                        UsermesArr.push(tel,UserNo);
                        window.localStorage['UsermesArr']=JSON.stringify(UsermesArr);
                        // setTimeout(function () {
                            // window.location.href = "query.html";
                            // window.open ("query.html", "_blank");
                            // window.open('http://www.zsyltec.com/WeChat/dist/html/query.html','_self');
                        // },1500);
                        window.location.replace("http://www.zsyltec.com/WeChat/dist/html/query.html");
                    }else if(obj == "false"  ){
                        $(".popup").html("绑定失败");
                        sendAjax.Popping();
                    }else if(obj == "你还不是注册用户"){
                        $(".popup").html("你还不是注册用户");
                        sendAjax.Popping();
                    }else if(obj == "验证码不正确"){
                        $(".popup").html("验证码不正确");
                        sendAjax.Popping();
                    }else if(obj == "手机号码不正确"){
                        $(".popup").html("手机号码不正确");
                        sendAjax.Popping();
                    }else if(obj == "户号或手机号码不正确"){
                        $(".popup").html("请输入正确的预留手机号");
                        sendAjax.Popping();
                    } else if(obj == "数据异常"){
                        //数据异常
                        $(".popup").html("数据异常");
                        sendAjax.Popping();
                    }else if(!isNaN(obj) && obj.length === 5 ){
                        sendAjax.settime(_self);
                    }
                },
                error:function (data) {
                    if(data.status === 500){
                        $(".popup").html("服务器出错，请稍后再试");
                        sendAjax.Popping();
                    }
                }
            });
        },
        BangDingRequest:function (Method,value) {
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
                url: "http://112.74.160.51:8084/AppWebService/AppData",
                type: "POST",
                dataType: "xml",
                contentType: "text/xml; charset=utf-8",
                data: data,
                beforeSend: function() {
                    $("#regi-btn").prop("disabled","disabled");
                    setTimeout(function () {
                        $("#regi-btn").removeAttr("disabled");
                    },1500);
                    $(".popup").html("正在加载，请稍后...");
                    sendAjax.Popping();
                },
                success: function (data) {
                    console.log($.xml2json(data).Body);
                    var obj = $.xml2json(data).Body.WeiXinBindingResponse.out;//取得文本  WeiXinBindingResponse
                    console.log(obj);
                    console.log(typeof obj);
                    // sendAjax.RegisterRun(obj);
                    if(obj == "true"){
                        $(".popup").html("绑定成功");
                        sendAjax.Popping();
                        var UsermesArr = [];
                        var tel = $("#username").val();
                        var UserNo = $("#customerNo").val();
                        UsermesArr.push(tel,UserNo);
                        window.localStorage['UsermesArr']=JSON.stringify(UsermesArr);
                        // setTimeout(function () {
                        // window.location.href = "query.html";
                        // window.open ("query.html", "_blank");
                        // window.open('http://www.zsyltec.com/WeChat/dist/html/query.html','_self');
                        // },1500);
                        window.location.replace("http://www.zsyltec.com/WeChat/dist/html/query.html");
                    }else if(obj == "false"  ){
                        $(".popup").html("绑定失败");
                        sendAjax.Popping();
                    }else if(obj == "你还不是注册用户"){
                        $(".popup").html("你还不是注册用户");
                        sendAjax.Popping();
                    }else if(obj == "验证码不正确"){
                        $(".popup").html("验证码不正确");
                        sendAjax.Popping();
                    }else if(obj == "手机号码不正确"){
                        $(".popup").html("手机号码不正确");
                        sendAjax.Popping();
                    }else if(obj == "户号或手机号码不正确"){
                        $(".popup").html("请输入正确的预留手机号");
                        sendAjax.Popping();
                    } else if(obj == "数据异常"){
                        //数据异常
                        $(".popup").html("数据异常");
                        sendAjax.Popping();
                    }else if(!isNaN(obj) && obj.length === 5 ){
                        sendAjax.settime(_self);
                    }
                },
                error:function (data) {
                    if(data.status === 500){
                        $(".popup").html("服务器出错，请稍后再试");
                        sendAjax.Popping();
                    }
                }
            });
        }
    };
});
