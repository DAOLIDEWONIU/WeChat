
    //用户登录密码信息
    function LoginRun(a) {
        var UserPhoneAndPassword = [];
        // 弹出层
        function Popping() {
            $(".login-outer .popup").addClass("popupshow");
            setTimeout(function () {
                $(".login-outer .popup").removeClass("popupshow");
            },1500);
        }
        var data = [
            {
                "loginerror":"手机号码或密码不正确，登录失败",
                "loginregister":"你的手机号还没有在营业厅登记",
                "parameter":"填写参数不正确，或还没有注册",
                "ResetPass":"重置密码成功",
                "NoRegisterUser":"你还不是注册用户",
                "RefreshUserImg":"上传图片成功",
                "registered":"手机号已被注册",
                "registersuccessful":"注册成功",
                "shujuerror":"数据异常",
                "bindinguserNo":"请尽快去绑定自己的用水户号",
                "NotCustomer":"你不是水务公司用户"
            }
        ];
        for (var i = 0,len = data.length; i <len ; ++i){
            if (data[i].loginerror === a){
                $(".popup").html(data[i].loginerror);
                Popping();
            }else if(data[i].loginregister === a){
                $(".popup").html(data[i].loginregister);
                Popping();
            }else if(data[i].registersuccessful === a){
                $(".popup").html(data[i].registersuccessful);
                Popping();
                setTimeout(function () {
                    window.location.href = "login.html";
                },1500);
            }else if(data[i].registered === a){
                $(".popup").html(data[i].registered);
                Popping();
                setTimeout(function () {
                    window.location.href = "login.html";
                },1500);
            }else if(data[i].parameter === a){
                $(".popup").html(data[i].parameter);
                Popping();
            }else if(data[i].NoRegisterUser === a){
                //注册
                $(".popup").html(data[i].NoRegisterUser);
                Popping();
            }else if(data[i].shujuerror === a){
                //数据异常
                $(".popup").html(data[i].shujuerror);
                Popping();
            }else if(data[i].bindinguserNo === a){
                remenberPass();
                //请尽快去绑定自己的用水户号
                $(".popup").html(data[i].bindinguserNo);
                Popping();
                sessionStorage.formData = a;
                console.log(sessionStorage.formData);
                //存入本地
                UserPhoneAndPassword.push($("#username").val(),$("#password").val());
                window.localStorage['UserInformation']=JSON.stringify(UserPhoneAndPassword);
                console.log(JSON.parse(window.localStorage['UserInformation']));
                setTimeout(function(){
                    window.location.href = "home.html";//页面跳转
                },1500);
            }else if(data[i].NotCustomer === a){
                //不是水务公司用户
                $(".popup").html(data[i].NotCustomer);
                Popping();
            }else if(data[i].ResetPass === a){
                $(".popup").html(data[i].ResetPass);
                Popping();
                // 密码修改成功跳转
                setTimeout(function(){
                    window.location.href = "my.html";//页面跳转
                },1500);
            }else if(data[i].RefreshUserImg === a){
                //上传图片
                $(".popup").html(data[i].RefreshUserImg);
                Popping();
            } else {
                remenberPass();
                $(".popup").html("登录成功");
                Popping();
                var logindata = JSON.parse(a);
                sessionStorage.formData = JSON.stringify(logindata);
                //存入本地
                UserPhoneAndPassword.push($("#username").val(),$("#password").val());
                window.localStorage['UserInformation']=JSON.stringify(UserPhoneAndPassword);
                setTimeout(function(){
                    window.location.href = "home.html";
                },1500);
            }
        }
        function remenberPass() {
            //自动登录存入cookie
            // (function (){
                //设置cookie
                var loginCode = $("#username").val(); //获取用户名信息
                var pass = $("#password").val(); //获取登陆密码信息
                var checked = $("[name='checkbox']:checked");//获取“是否记住密码”复选框
                if(checked && checked.length > 0){ //判断是否选中了“记住密码”复选框
                    $.cookie("login_Code",loginCode,{ expires: 7 });//调用jquery.cookie.js中的方法设置cookie中的用户名
                    $.cookie("pass",$.base64.encode(pass),{ expires: 7 });//调用jquery.cookie.js中的方法设置cookie中的登陆密码，并使用base64（jquery.base64.js）进行加密
                    $.cookie("isLogin",true,{ expires: 7 });
                }else{
                    $.cookie("pass", null);
                    $.cookie("isLogin",true,{ expires: 7 });
                }
            // }())
        }
        /*重新登录ajax*/
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
                    $("#login-btn").attr({ disabled: "disabled" });
                    xhr.setRequestHeader('SOAPAction', 'http://ws.zsyltec.com/Login');
                },
                success: function (response) {
                    console.log(response);
                    var obj = $(response).find("out").html();//取得文本
                    console.log(obj);
                    LoginRun(obj);
                }
            });
        }
    }



