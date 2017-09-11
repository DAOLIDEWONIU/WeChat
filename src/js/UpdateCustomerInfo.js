
// 弹出层
    function Popping() {
        $(".popup").addClass("popupshow");
        setTimeout(function () {
            $(".popup").removeClass("popupshow");
        }, 1500);
    }

//获取
    var UserInformation3 = JSON.parse(window.localStorage['UserInformation']);
    function update(a) {
        data = [
            {
                "phoneerror": "手机号码不正确",
                "updatesucc": "更新成功",
                "updateerror": "更新失败",
                "ArgumentError": "参数不正确",
                "NotUser": "你还不是注册用户",
                "userImg": "上传图片成功"
            }
        ];
        for (var i = 0, len = data.length; i < len; ++i) {
            if (data[i].phoneerror === a) {
                $(".popup").html(data[i].phoneerror);
                Popping();
            } else if (data[i].updatesucc === a) {
                $(".popup").html(data[i].updatesucc);
                Popping();
                console.log(UserInformation3);
                //重新调用登录
                setTimeout(function () {
                    ReLoginPost('Login', UserInformation3);
                }, 1500);
            } else if (data[i].updateerror === a) {
                $(".popup").html(data[i].updateerror);
                Popping();
            } else if (data[i].ArgumentError === a) {
                $(".popup").html(data[i].ArgumentError);
                Popping();
            } else if (data[i].NotUser === a) {
                $(".popup").html(data[i].NotUser);
                Popping();
            } else if (data[i].userImg === a) {
                $(".popup").html(data[i].userImg);
                Popping();
                //重新调用登录
                setTimeout(function () {
                    applicationCache.update();
                    ReLoginPost('Login', UserInformation3);
                }, 1500);
                // setTimeout(function () {
                //     window.location.reload();
                // },1500);
            }
        }
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
            url: "http://182.151.200.150:8084/AppWebService/AppData",
            type: "POST",
            data: data,
            success: function (response) {
                var obj = $(response).find("out").html();//取得文本
                console.log(obj);
                var logindata = JSON.parse(obj);
                //覆盖之前的sessionstorage
                sessionStorage.formData = JSON.stringify(logindata);
                window.location.href = "home.html";
            }
        });
    }