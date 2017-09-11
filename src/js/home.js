$(document).ready(function () {
    var loginCode = $.cookie("login_Code"); //获取cookie中的用户名
    var pass =  $.cookie("pass"); //获取cookie中的登陆密码
    var isLogin =  $.cookie("isLogin");

    //实现滚动条无法滚动
    var NoMove=function(e){e.preventDefault();};

    /***禁止滑动***/
    function stop(){
        document.body.style.overflow='hidden';
        document.addEventListener("touchmove",NoMove,false);//禁止页面滑动
    }

    /***取消滑动限制***/
    function move(){
        document.body.style.overflow='';//出现滚动条
        document.removeEventListener("touchmove",NoMove,false);
    }

    //历史记录表单切换(内部)
    $(".index .common-ipt .change li a").each(function (i) {
        var liNode = $(this);
        $(this).click(function () {
            $(".showthisbtn").removeClass("showthisbtn");
            $(".showthishistory").removeClass("showthishistory");
            $(".index .history").eq(i).addClass("showthishistory");
            liNode.addClass("showthisbtn");
        });
    });
    
    //点击首页用户信息跳转至修改页面
    $(".index .entry-mes").each(function () {
            $(this).click(function () {
                window.location.href = "usermes.html";
            });
    });
    if(!isLogin){
        // window.location.href = "login.html";
    }
    /*退出登录*/
    $("#ToLogin").click(function () {
        $("#exitOut").addClass("exitOut-show");
        $(".masking").addClass("maskingClose");
        stop();
    });
    //确认退出
    $(".affirm-sure").click(function () {
        $.cookie("login_Code",loginCode,{ expires: -1 });//删除 cookie
        $.cookie("isLogin",isLogin,{ expires: -1 });//删除 cookie
        $.cookie("pass",$.base64.encode(pass),{ expires: -1 });
        move();
        window.location.href = "login.html";
    });
    //取消
    $(".cancel").click(function () {
        $("#exitOut").removeClass("exitOut-show");
        $(".masking").removeClass("maskingClose");
        move();
    });
    /*修改密码页面*/
    $("#reset").click(function () {
        $("#my").removeClass("showthispage");
        $(".index .reset-outer").addClass("reset-outer-show");
    });
    /*
     *绑定户号
     */
    $("#bangding").click(function () {
        bound();
    });
    $("#quit").click(function () {
        quit();
    });
    $("#sure").click(function () {
        var userno = $(".BangDingUserNo").val(),
            phone = loginCode,
            Method = $("#sure").attr("name");
        if(userno.length === 0){
            $(".popup").html("请填入绑定户号");
            Popping();
        }else if(userno.length !== 0){
            var userID = [];
            userID.push(phone,userno);
            RequestPost(Method,userID);
        }
    });
    /*
     *解除绑定
     */
    $("#RemoveBangDing").click(function () {
        removebound();
    });
    $("#removequit").click(function () {
        removequit();
    });
    $("#removesure").click(function () {
        var Phone = $("#remove-phone").val(),
            code = $("#remove-code").val(),
            BangDingUserNo = $("#BangDingUserNo").val(),
            Method = $("#removesure").attr("name");
        var RemoveUserID = [];
        RemoveUserID.push(Phone,code,BangDingUserNo);
        RequestPost(Method,RemoveUserID);
    });
    /*
     * 修改个人详情
     */
    $("#enter-alter").click(function() {
        window.location.href = "usermes.html";
    });
    /*
     * 清空输入框值
     * */
    $(".iptout").each(function (i) {
        $(this).bind('input propertychange', function() {
            var len = $(this).val().length;
            if(len >0){
                var username = $("#username").val().length;
                var password = $("#password").val().length;
                var code = $("#code").val().length;
                console.info("这里的i是"+i);

                if(username >0){
                    $(".reset-cont .removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
                } else if(password >0){
                    $(".reset-cont .removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
                }else if(code > 0){
                    $(".reset-cont .removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
                }
                if(username >0 && password > 0 && code > 0){
                    $("#reset-btn").addClass("reset-btnchange").removeAttr("disabled");
                }
            }else {
                $(".reset-cont .removeicon").removeClass("removeshow");
                $("#reset-btn").removeClass("reset-btnchange").prop("disabled","disabled");
            }
        });
        $(this).focus(function () {
            if($(this).val() === ""){
                $(".reset-cont .removeicon").removeClass("removeshow");
            }else {
                $(".reset-cont .removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
            }
        })
    });
    //删除操作
    $(".reset-cont .removeicon").each(function (i) {
        $(this).click(function () {
            $(this).removeClass("removeshow");
            $("#reset-btn").removeClass("reset-btnchange").prop("disabled","disabled");
            $(".iptout").eq(i).val("").focus();
        })
    });
    /*
    *弹出层
    */
    function Popping() {
        $(".popup").addClass("popupshow");
        setTimeout(function () {
            $(".popup").removeClass("popupshow");
        },1500);
    }
    /*
    *修改密码
    */
    $("#reset-btn").click(function () {
        $(".reset-cont .removeicon").removeClass("removeshow");
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
    /*
    *获取验证码
    */
    $("#resetpass .btn-phonecode").click(function () {
        var codearr = [];
        var username = $("#username").val();
        var code = null;
        var Method = $(".btn-phonecode").attr("name");
        codearr.push(username,code);
        if(username !== "" && /^1[34578]\d{9}$/.test(username)){
            settime(this);
            RequestPost(Method,codearr);
        }else if(username === ""){
            $(".popup").html("手机号不能为空!");
            Popping();
        }else if(!(/^1[34578]\d{9}$/.test(username))){
            $(".popup").html("手机号格式不正确!");
            Popping();
        }
    });
    /*
    *解除绑定发送验证
    */
    $("#Renovephonecode").click(function () {
        var RemoveCodeArr = [],
            RemovePhone = $("#remove-phone").val(),
            RemoveCode = null,
            Method = $("#Renovephonecode").attr("name");
            RemoveCodeArr.push(RemovePhone,RemoveCode);
        console.log(Method);
        if(RemovePhone !== "" && /^1[34578]\d{9}$/.test(RemovePhone)){
            settime(this);
            RequestPost(Method,RemoveCodeArr);
        }else if(RemovePhone === ""){
            $(".popup").html("手机号不能为空!");
            Popping();
        }else if(!(/^1[34578]\d{9}$/.test(RemovePhone))){
            $(".popup").html("手机号格式不正确!");
            Popping();
        }
    });
    /*
    *倒计时
    */
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
    /*
    *取出sessionStorage
    */
    var MyArray1 = sessionStorage.formData;
    var UserInformation = JSON.parse(window.localStorage['UserInformation']);
    if(MyArray1 === "请尽快去绑定自己的用水户号"){
        $(".name").html(MyArray1);
        bound();
        /*
        *点击取消隐藏
        */
        $("#quit").click(function () {
            quit();
        });
        // $("#sure").click(function () {
        //     var userno = $(".BangDingUserNo").val(),
        //         phone = UserInformation[0],
        //         Method = $("#sure").attr("name");
        //     var userID = [];
        //         userID.push(phone,userno);
        //     RequestPost(Method,userID);
        // });

        $("#sure").click(function () {
            var userno = $(".BangDingUserNo").val(),
                phone = loginCode,
                Method = $("#sure").attr("name");
            if(userno.length === 0){
                $(".popup").html("请输入绑定户号");
                Popping();
            }else if(userno.length !== 0){
                var userID = [];
                userID.push(phone,userno);
                RequestPost(Method,userID);
            }
        });
    }else {
        if(MyArray1 === undefined){
            window.location.href = "login.html";
        }else {
            var MyArray = JSON.parse(MyArray1);
            GetStorage(MyArray);
        }
    }
    /*
    *绑定
    */
    function quit() {
        $(".index").removeClass("indexblur");
        $(".masking").removeClass("maskingClose");
        $(".masking-cont").removeClass("maskingClose");
    }
    /*
    *点击弹出绑定户号
    */
    function bound() {
        $(".index").addClass("indexblur");
        $(".masking").addClass("maskingClose");
        $(".masking-cont").addClass("maskingClose");
    }
    /*解除*/
    function removebound() {
        $(".index").addClass("indexblur");
        $(".masking").addClass("maskingClose");
        $(".remove-masking-cont").addClass("maskingClose");
    }
    function removequit() {
        $(".index").removeClass("indexblur");
        $(".masking").removeClass("maskingClose");
        $(".remove-masking-cont").removeClass("maskingClose");
    }
    /*获取json*/
    function GetStorage(MyArray) {
        var CustomerNo = "";
        for (var j = 0,len1 = MyArray.length; j < len1; ++j){
            CustomerNo = MyArray[j].customerNo;
            telphone = MyArray[0].Phone;
            userName = MyArray[j].userName;
            $(".index .tel").text(MyArray[0].Phone);
            $(".name").text(MyArray[0].userName);
            $(".userNo").text(MyArray[0].customerNo);
            $(".Age").text(MyArray[0].Age);
            $(".sex").text(MyArray[0].Sex);
            $(".qq").text(MyArray[0].QQ);
            $(".wechat").text(MyArray[0].WEIXIN);
            $(".adrr").text(MyArray[0].Address);
            $(".surplus").text(MyArray[0].RemainMoney);
            $("#iptuserNo").val(MyArray[0].customerNo);
            $("#tel").val(MyArray[0].Phone);
            if (MyArray[0].Portrait === null){
                $(".index .usermes-cont div img").attr("src","../imgs/index/userphoto.png");
            }else if (MyArray[0].Portrait !== null){
                $(".index .usermes-cont div img").attr("src",MyArray[0].Portrait);
            }
        }
        var customerNodata1 = [];//户号
        for (var i = 0,len = MyArray.length; i < len; ++i){
            // 查询用户状态（自动）
            choosecustomername = [];//姓名
            choosecustomername.push(MyArray[i].userName);
            customerNodata1.push(MyArray[i].customerNo);
            sessionStorage.setItem("customerNodata1",customerNodata1)
        }
        for(var a = 0 ,lenNo = customerNodata1.length; a < lenNo ; ++a){
            RequestPost("ReturnCustomerArrearageInfo",customerNodata1[a].split());
        }

    }
    /*上传照片*/

    $(".fileImg").change(function () {
        lrz(this.files[0],{
            width: 480,//图片宽度
            quality: 0.9 //图片质量
        }).then(function (rst) {
            // 处理成功会执行
            var a = [];
            var Imgvalue = [];
            var Refreshvalue = [];
            a.push(rst);
            var ImgString=a[0].base64.substring(23,a[0].base64Len);
            Imgvalue.push("userImg",ImgString,telphone);
            //上传照片
            RequestPost("UpdateUserPictuer",Imgvalue);
            // setTimeout(function () {
            //     window.location.reload();
            // },1500);
        })
        .catch(function (err) {
            /*处理失败会执行*/
        })
        .always(function () {
            /*不管是成功失败，都会执行*/
        });
    });
    /*发送ajax*/
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
        $.ajax({
            url:"http://112.74.160.51:8084/AppWebService/AppData",
            type: "POST",
            data:data,
            success:function (response) {
                console.log(response);
                var obj = $(response).find("out").html();//取得文本
                wordbook(obj);
            }
        });
    }
    /*重新调用登录*/
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
                var logindata = JSON.parse(obj);
                sessionStorage.formData = JSON.stringify(logindata);
                window.location.href = "home.html";
            }
        });
    }
});