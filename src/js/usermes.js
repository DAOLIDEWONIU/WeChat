$(document).ready(function () {
    var loginCode = $.cookie("login_Code"); //获取cookie中的用户名
    var pass =  $.cookie("pass"); //获取cookie中的登陆密码
    var isLogin =  $.cookie("isLogin");
    var MyArray = JSON.parse(sessionStorage.formData);
    var UserInformation = JSON.parse(window.localStorage['UserInformation']);
    console.log(UserInformation);
    var HtmlStr="";
    for (var i = 0,j = 0,len = MyArray.length; i < len,j<len ; i++,j++) {
        userno = MyArray[i].customerNo;
        telphone = MyArray[0].Phone;
        HtmlStr = "";
        $(".index .tel").html(MyArray[0].Phone);
        $(".index .usermes-cont a img").attr("src", MyArray[0].Portrait);
        $("#usernamephone").val(MyArray[0].userName);
        $("#age").val(MyArray[0].Age);
        $("#sex").val(MyArray[0].Sex);
        $("#qq").val(MyArray[0].QQ);
        $("#wechat").val(MyArray[0].WEIXIN);
        $("#weibo").val(MyArray[0].WEIBO);
        $("#Favorite").val(MyArray[0].Favorite);
        $("#Email").val(MyArray[0].Email);
        $("#adrr").val(MyArray[0].Address);
        if (MyArray[0].Portrait === null){
            $(".index .usermes-cont div img").attr("src","../imgs/index/userphoto.png");
        }else{
            $(".index .usermes-cont div img").attr("src",MyArray[0].Portrait);
        }
    }
    if(!isLogin){
        window.location.href = "login.html";
    }
    //上传照片
    $(".fileImg").change(function () {
        lrz(this.files[0],{
            width: 480,//图片宽度
            quality: 0.9 //图片质量
        })
            .then(function (rst) {
                // 处理成功会执行
                var a = [];
                var Imgvalue = [];
                var Refreshvalue = [];
                a.push(rst);
                //分割
                var ImgString=a[0].base64.substring(23,a[0].base64Len);
                Imgvalue.push("userImg",ImgString,telphone);
                //上传照片
                RequestPost("UpdateUserPictuer",Imgvalue);
                // setTimeout(function () {
                //     window.location.reload();
                // },1500);
            })
            .catch(function (err) {
                // 处理失败会执行
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
    });
    //修改用户信息
    $("#save").click(function () {
        var userupdatemes = [];
        var username = $("#usernamephone").val(),
            age = $("#age").val(),
            qq = $("#qq").val(),
            wechat = $("#wechat").val(),
            weibo = $("#weibo").val(),
            Favorite = $("#Favorite").val(),
            Email = $("#Email").val(),
            adrr = $("#adrr").val(),
            sex = $("#sex").val();
            var Method = $("#save").attr("name");
        var Str ={
            "CR_PHONENO":telphone,
            "CR_Favorite":Favorite,
            "Email":Email,
            "Age":age,
            "Sex":sex,
            "QQ":qq,
            "WEIXIN":wechat,
            "WEIBO":weibo,
            "Cu_Name":username,
            "Cu_Addr":adrr };
        var sty = JSON.stringify(Str);
        userupdatemes.push(userno,telphone,sty);
        console.log(Method);
        RequestPost(Method,userupdatemes);

    });
    // 发送ajax
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
            url:"http://182.151.200.150:8084/AppWebService/AppData",
            type: "POST",
            data:data,
            success:function (response) {
                var obj = $(response).find("out").html();//取得文本
                update(obj);
            }
        });
    }
});