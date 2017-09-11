
    // 弹出层
    function Popping() {
        $(".register-outer .popup").addClass("popupshow");
        setTimeout(function () {
            $(".register-outer .popup").removeClass("popupshow");
        },1500);
    }
    //用户登录密码信息
    function RegisterRun(a) {
     
        data = [
            {
                "registererror":"填写参数不正确，请重新注册",
                "registered":"手机号已被注册",
                "codeerror":"验证码不正确",
                "codeouttime":"验证码已失效",
                "passnotnull":"密码不能为空",
                "registersuccessful":"注册成功",
                "shujuerror":"数据异常"
            }
        ];
        for (var i = 0,len = data.length; i <len ; ++i){
            switch (a){
                case data[i].registererror:
                    $(".popup").html(data[i].registererror);
                    Popping();
                    break;
                case data[i].registered:
                    $(".popup").html(data[i].registered);
                    Popping();
                    setTimeout(function () {
                        window.location.href = "../html/login.html";
                    },1500);
                    break;
                case data[i].codeerror:
                    $(".popup").html(data[i].codeerror);
                    Popping();
                    break;
                case data[i].codeouttime:
                    $(".popup").html(data[i].codeouttime);
                    Popping();
                    break;
                case data[i].passnotnull:
                    $(".popup").html(data[i].passnotnull);
                    Popping();
                    break;
                case data[i].shujuerror:
                    $(".popup").html(data[i].shujuerror);
                    Popping();
                    break;
                default :
                    if(a.length === 5 && !isNaN(a) ){
                        // 验证码直接传进输入框
                        $("#showcode").val(a);
                        console.log(a)
                    }else {
                        $(".popup").html(data[i].registersuccessful);
                        Popping();
                        setTimeout(function () {
                            window.location.href = "login.html";
                        },1500);
                    }
            }
            
            //  if(data[i].registererror === a){
            //     $(".popup").html(data[i].registererror);
            //     Popping();
            // }else if(data[i].registered === a){
            //      $(".popup").html(data[i].registered);
            //      Popping();
            //      setTimeout(function () {
            //          window.location.href = "../html/login.html";
            //      },1500);
            //  }else if(data[i].codeerror === a){
            //     $(".popup").html(data[i].codeerror);
            //     Popping();
            // } else if(data[i].codeouttime === a){
            //     $(".popup").html(data[i].codeouttime);
            //     Popping();
            // } else if(data[i].passnotnull === a){
            //     $(".popup").html(data[i].passnotnull);
            //     Popping();
            // }else if(data[i].shujuerror === a){
            //     //数据异常
            //     $(".popup").html(data[i].shujuerror);
            //     Popping();
            // } else {
            //      if(a.length === 5 && !isNaN(a) ){
            //          // 验证码直接传进输入框
            //          $("#showcode").val(a);
            //          console.log(a)
            //      }else {
            //          $(".popup").html(data[i].registersuccessful);
            //          Popping();
            //          setTimeout(function () {
            //              window.location.href = "login.html";
            //          },1500);
            //      }
            //  }
        }
    }

