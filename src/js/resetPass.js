/**
 * Created by Administrator on 2016-10-20.
 */

$(document).ready(function () {
    //底部功能区切换效果
    $(".ftul li").each(function (i) {
        $(this).click(function () {
            $(".click-this").removeClass("click-this");
            $(this).addClass("click-this");
        });
    });
    //输入框为空，提交按钮不可用
    $(".iptout").each(function (i) {
        //判断输入框值
        $(this).keyup(function () {
            var username = $("#username").val().length;
            var password = $("#password").val().length;
            var code = $("#code").val().length;
            console.log(password);
            if(username && password && code){
                $("#reset-btn").css("color","#fff");
                $("#reset-btn").removeAttr("disabled");
                $(".reset-outer .removeout").eq(i).addClass("showremove");
            }else {
                $("#reset-btn").css("color","#add1df");
                $("#reset-btn").prop("disabled","disabled");
                $(".reset-outer .removeout").eq(i).removeClass("showremove");
            }
        });
        //清空输入框值
        $(".reset-outer .removeout").eq(i).click(function () {
            $(this).removeClass("showremove");
            $(".iptout").eq(i).val("");
            var len = $(".iptout").eq(i).val().length;
            if(len){
                $("#reset-btn").css("color","#fff");
                $("#reset-btn").removeAttr("disabled");
                $(".reset-outer .removeout").eq(i).addClass("showremove");
            }else {
                $("#reset-btn").css("color","#add1df");
                $("#reset-btn").prop("disabled","disabled");
                $(".reset-outer .removeout").eq(i).removeClass("showremove");
            }
        });
    });
    // 弹出层
    function Popping() {
        $(".popup").addClass("popupshow");
        setTimeout(function () {
            $(".popup").removeClass("popupshow");
        },1500);
    }
    //修改密码
    $("#reset-btn").click(function () {
        var value = [];
        var username = $("#username").val(),
            password = $("#password").val(),
            code = $("#code").val(),
            Method = $("#reset-btn").attr("name");
            value.push(username,password,code);
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
    //获取验证码
    $(".btn-phonecode").click(function () {
        var codearr = [];
        var username = $("#username").val();
        var code = $("#code").val();
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
        setTimeout(function () {
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
                xhr.setRequestHeader('SOAPAction', 'http://ws.zsyltec.com/Login');
            },
            success: function (response) {
                console.log(response);
                var obj = $(response).find("out").html();//取得文本
                wordbook(obj);
            }
        });
    }
});