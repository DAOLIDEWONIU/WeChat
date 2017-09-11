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
                var password = $("#password").val().length;
                var code = $("#code").val().length;

                if(username >0){
                    console.info("这里的i是"+i);
                    $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
                } else if(password >0){
                    $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
                }else if(code > 0){
                    $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
                }
                if(username >0 && password > 0 && code > 0){
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
        })
    });
    //删除操作
    $(".removeout").each(function (i) {
        $(this).click(function () {
            $(this).removeClass("showremove");
            $("#regi-btn").removeClass("btnchange").prop("disabled","disabled");
            $(".iptout").eq(i).val("").focus();
        });
    });
    //点击注册按钮
    $("#regi-btn").click(function () {
        $(".removeout").removeClass("showremove");
        var value = [];
        var username = $("#username").val(),
            password = $("#password").val(),
            code = $("#code").val(),
            Method = $("#regi-btn").attr("name");
            console.log(code);
        value.push(username,password,code);
        console.log(value);
        if(username === ""){
            $(".popup").html("请填入手机号");
            Popping();
        }else if(password === ""){
            $(".popup").html("请输入密码");
            Popping();
        }
        else if(!(/^.{6,}$/.test(password))){
            $(".popup").html("密码不得低于六位数字");
            Popping();
        } else if (!(/^1[34578]\d{9}$/.test(username)) ){
            $(".popup").html("请输入正确的手机号");
            Popping();
        }else if(/^1[34578]\d{9}$/.test(username) === true && username !== ""　&&　password !== "" ){
            RequestPost(Method,value);
        }
    });
    // 弹出层
    function Popping() {
        $(".register-outer .popup").addClass("popupshow");
        setTimeout(function () {
            $(".register-outer .popup").removeClass("popupshow");
        },1500);
    }
    //获取验证码
    $(".btn-phonecode").click(function () {
        var codearr = [];
        var username = $("#username").val();
        var code = null;
        var Method = $(".btn-phonecode").attr("name");
        codearr.push(username,code);
        if(username !== "" && /^1[34578]\d{9}$/.test(username)){
            settime(this);
            RequestPost(Method,codearr);
        }else if(username === "" ){
            $(".popup").html("手机号不能为空!");
            Popping();
        }else if(!(/^1[34578]\d{9}$/.test(username))){
            $(".popup").html("手机号格式不正确!");
            Popping();
        }
    });
    //倒计时
    var countdown=60;
    function settime(obj) {
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
            settime(obj);
        },1000);
    }
    //ajax
    function RequestPost(Method,value) {
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
        console.log(data);
        $.ajax({
            // url: "http://182.151.200.150:8084/AppWebService/AppData",
            url: "http://112.74.160.51:8084/AppWebService/AppData",
            type: "POST",
            dataType: "xml",
            contentType: "text/xml; charset=utf-8",
            data: data,
            beforeSend: function(xhr) {
                $("#regi-btn").prop("disabled","disabled");
                setTimeout(function () {
                    $("#regi-btn").removeAttr("disabled");
                },1500);
            },
            success: function (response) {
                // console.log(response);
                var obj = $(response).find("out").html();//取得文本
                RegisterRun(obj);
            }
        });
    }
});
