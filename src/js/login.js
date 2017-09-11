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
                 
                 if(username >0){
                     console.info("这里的i是"+i);
                     $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
                 } else if(password >0){
                     $(".removeout").removeClass("showremove").eq(i).addClass("showremove");
                 }
                 if(username >0 && password > 0){
                     $("#login-btn").addClass("btnchange").removeAttr("disabled");
                 }
             }else {
                 $(".removeout").removeClass("showremove");
                 $("#login-btn").removeClass("btnchange").prop("disabled","disabled");
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
             $("#login-btn").removeClass("btnchange").prop("disabled","disabled");
             $(".iptout").eq(i).val("").focus();
         });
     });

    //点击登录按钮
    $("#login-btn").click(function () {
        
        $(".removeout").removeClass("showremove");//移除删除按钮
        var value = [];
        var username = $("#username").val(),
            password = $("#password").val(),
            Method = $("#login-btn").attr("name");
        value.push(username,password);
        if(username === ""){
            $(".popup").html("请填入手机号");
        }else if(password === ""){
            $(".popup").html("请输入密码");
            Popping();
        } else if (!(/^1[34578]\d{9}$/.test(username)) ){
            $(".popup").html("请输入正确的手机号");
            Popping();
        }else if(/^1[34578]\d{9}$/.test(username) === true && username !== ""　&&　password !== "" ){
            Popping();
            RequestPost(Method,value);
        }
    });

     /*检测cookie中是否有账户密码，有直接登录*/
     (function () {
         var loginCode = $.cookie("login_Code"); //获取cookie中的用户名
         var pass =  $.cookie("pass"); //获取cookie中的登陆密码
         var isLogin =  $.cookie("isLogin");

         if (loginCode && pass){
             getCookie();
             var relogin = [];
             relogin.push(loginCode,$.base64.decode(pass));
             RequestPost("Login",relogin);
         }
         function getCookie(){ //获取cookie
             var loginCode = $.cookie("login_Code"); //获取cookie中的用户名
             var pass =  $.cookie("pass"); //获取cookie中的登陆密码
             if(pass){//密码存在的话把“记住用户名和密码”复选框勾选住
                 $("[name='checkbox']").attr("checked","true");
             }
             if(loginCode){//用户名存在的话把用户名填充到用户名文本框
                 $("#username").val(loginCode);
             }
             if(pass){//密码存在的话把密码填充到密码文本框
                 $("#password").val($.base64.decode(pass));
             }
         }
     })();
    // 弹出层
    function Popping() {
        $(".login-outer .popup").addClass("popupshow");
        setTimeout(function () {
            $(".login-outer .popup").removeClass("popupshow");
        },1500);
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
            url: "http://112.74.160.51:8084/AppWebService/AppData",
            type: "POST",
            dataType: "xml",
            contentType: "text/xml; charset=utf-8",
            data: data,
            beforeSend: function () { // 禁用按钮防止重复提交
                $("#login-btn").prop("disabled","disabled");
                setTimeout(function () {
                    $("#login-btn").removeAttr("disabled");
                },1500);
            },
            success: function (response) {
                console.log(response);
                var obj = $(response).find("out").html();//取得文本
                LoginRun(obj);
            },
            error:function (data) {
                if(data.status === 500){
                    $(".popup").html("服务器出错，请稍后再试");
                    Popping();
                }
            }
        });
    }





});

