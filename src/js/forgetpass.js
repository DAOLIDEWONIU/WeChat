
/**
 * Created by Administrator on 2016-10-18.
 */
$(document).ready(function () {
    //输入框为空，提交按钮不可用
    // $(".iptout").each(function (i) {
    //     //判断输入框值
    //     $(this).keyup(function () {
    //         var username = $("#username").val().length;
    //         var password = $("#password").val().length;
    //         var code = $("#code").val().length;
    //         console.log(password);
    //         if(username && password && code){
    //             $("#Reset-btn").css("color","#fff");
    //             $("#Reset-btn").removeAttr("disabled");
    //             $(".reset-outer .removeout").eq(i).addClass("showremove");
    //         }else {
    //             $("#Reset-btn").css("color","#add1df");
    //             $("#Reset-btn").prop("disabled","disabled");
    //             $(".reset-outer .removeout").eq(i).removeClass("showremove");
    //         }
    //     });
    // });
    //
    //
    // /*
    //  * 活得焦点与失去焦点
    //  * */
    //
    // $(".reset-outer .iptout").each(function (i) {
    //     $(this).click(function () {
    //         $(".reset-outer .removeout").hide();
    //         $(".reset-outer .removeout").eq(i).show();
    //     });
    // });
    //
    //
    //
    //
    // /*
    //  * 点击删除按钮删除
    //  */
    // $(".reset-outer .removeout").each(function (i) {
    //     $(".reset-outer .removeout").hide();
    //     $(this).click(function () {
    //         $(this).hide();
    //         $(this).parents().children(".iptout").val("");
    //     });
    // });
    // ******************************

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
                    $("#Reset-btn").addClass("btnchange").removeAttr("disabled");
                }
            }else {
                $(".removeout").removeClass("showremove");
                $("#Reset-btn").removeClass("btnchange").prop("disabled","disabled");
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
            $("#Reset-btn").removeClass("btnchange").prop("disabled","disabled");
            $(".iptout").eq(i).val("").focus();
        });
    });

    //**********************************
    //点击提交按钮
    $("#Reset-btn").click(function () {
        $(".removeout").removeClass("showremove");
        var value = [];
        var username = $("#username").val(),
            password = $("#password").val(),
            code = $("#code").val(),
            Method = $("#Reset-btn").attr("name");
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
        $(".reset-outer .popup").addClass("popupshow");
        setTimeout(function () {
            $(".reset-outer .popup").removeClass("popupshow");
        },1500);
    }
    //获取验证码
    $(".reset-cont .btn-phonecode").click(function () {
        var codearr = [];
        var username = $("#username").val();
        var code = null;
        console.log(code);
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
            url: "http://182.151.200.150:8084/AppWebService/AppData",
            type: "POST",
            dataType: "xml",
            contentType: "text/xml; charset=utf-8",
            data: data,
            beforeSend: function(xhr) {
                $("#Reset-btn").prop("disabled","disabled");
                setTimeout(function () {
                    $("#Reset-btn").removeAttr("disabled");
                },1500);
            },
            success: function (response) {
                console.log(response);
                var obj = $(response).find("out").html();//取得文本
                console.log(obj);
                wordbook(obj);
            }
        })
    }
    function wordbook(a) {
        data = [
            {
                "resetsucc":"重置密码成功",
                "pass":"密码不能为空",
                "parameter":"填写参数不正确，或还没有注册",
                "codeno":"验证码不正确",
                "codetimeout":"验证码失效"
            }
        ];
        for (var i = 0,len = data.length; i <len ; ++i){
            if (data[i].resetsucc === a){
                $(".popup").html(data[i].resetsucc);
                Popping();
                setTimeout(function () {
                    window.location.href = "login.html";//页面跳转
                },1500);
            }else if (data[i].pass === a) {//密码不能为空
                $(".popup").html(data[i].pass);
                Popping();
            }else if (data[i].parameter === a) {//填写参数不正确，或还没有注册
                $(".popup").html(data[i].parameter);
                Popping();
            }else if (data[i].codeno === a) {//验证码不正确
                $(".popup").html(data[i].codeno);
                Popping();
            }else if (data[i].codetimeout === a) {//验证码失效
                $(".popup").html(data[i].codetimeout);
                Popping();
            }else {
                if(a.length === 5 && !isNaN(a) ){
                    // 验证码直接传进输入框
                    $("#showcode").val(a);
                    console.log(a);
                }
            }
        }
    }
});
