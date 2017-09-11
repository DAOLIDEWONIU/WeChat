$(document).ready(function () {
    /*
    弹出层
    */ 
    function Popping() {
        $(".popup").addClass("popupshow");
        setTimeout(function () {
            $(".popup").removeClass("popupshow");
        }, 1500);
    }
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
    /*查询户号欠费状态（手动）*/
    $(".Query-Btn").click(function () {
        $(".removeicon").removeClass("removeshow");
        var USERNO = $(".index .iptuserNo").val(),
            iptusertel = $(".index input[name='tel']").val(),
            Method = $(".Query-Btn").attr("name");
        if(USERNO === 0){
            $(".popup").html("请输入查询户号");
            Popping();
        }
        else if(iptusertel === ""){
            $(".popup").html("请输入预留手机号");
            Popping();
        } else if (/^1[34578]\d{9}$/.test(iptusertel) === false){
            $(".popup").html("请输入正确的手机号");
            Popping();
        }else if(USERNO !== "" && /^1[34578]\d{9}$/.test(iptusertel) === true && iptusertel !== ""){
            var searchdata = [];
            searchdata.push(USERNO,iptusertel);
            SearchPost(Method,searchdata);
        }
    });
    /*
     * 清空输入框值
     * */
    $(".iptuserNo").each(function (i) {
        $(this).bind('input propertychange', function() {
            //进行相关操作
            var len = $(this).val().length;
            if(len >0){
                var UserNo = $("input[name='number']").val().length;
                var tel = $("input[name='tel']").val().length;
                if(UserNo >0){
                    console.info("这里的i是"+i);
                    $(".removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
                } else if(tel >0){
                    $(".removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
                }
                if(UserNo >0 && tel > 0){
                    $(".Query-Btn").addClass("Query-Btn-change").removeAttr("disabled");
                }
            }else {
                $(".removeicon").removeClass("removeshow");
                $(".Query-Btn").removeClass("Query-Btn-change").prop("disabled","disabled");
            }
        });
        $(this).focus(function () {
            if($(this).val() === ""){
                $(".removeicon").removeClass("removeshow");
            }else {
                $(".removeicon").removeClass("removeshow").eq(i).addClass("removeshow");
            }
        });
        var UserNo = $("input[name='number']").val().length;
        var tel = $("input[name='tel']").val().length;
        if(UserNo >0 && tel > 0){
            $(".Query-Btn").addClass("Query-Btn-change").removeAttr("disabled");
        }
    });
    //删除操作
    $(".removeicon").each(function (i) {
        $(this).click(function () {
            $(this).removeClass("removeshow");
            $(".Query-Btn").removeClass("Query-Btn-change").prop("disabled","disabled");
            $(".iptuserNo").eq(i).val("").focus();
        });
    });
    // 发送ajax
    function SearchPost(Method,value) {
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
            // url:"http://182.151.200.150:8084/AppWebService/AppData",
            url:"http://112.74.160.51:8084/AppWebService/AppData",
            type: "POST",
            data:data,
            beforeSend: function () { // 禁用按钮防止重复提交
                $(".Query-Btn").prop("disabled","disabled");
                setTimeout(function () {
                    $(".Query-Btn").removeAttr("disabled");
                },1500);
            },
            success:function (response) {
                var obj = $(response).find("out").html();//取得文本
                console.log(obj);
                wordbook(obj);
            }
        });
    }
    function wordbook(a) {
        var data = [
            {
                "Searcherror":"数据查询失败",
                "Searchno":"无欠费信息",
                "phoneiserror":"所留的电话错误"
            }
        ];
        for (var j = 0,datalen = data.length; j <datalen ; ++j){
            if(data[j].Searcherror === a){
                $(".popup").html(data[j].Searcherror);
                Popping();
            }else if(data[j].Searchno === a){
                $(".popup").html(data[j].Searchno);
                Popping();
            }else if(data[j].phoneiserror === a){
                $(".popup").html(data[j].phoneiserror);
                Popping();
            } else {
                stop();
                $(".result").addClass("result-show");
                $(".singlePay").addClass("result-show");
                $(".masking").addClass("maskingClose-arr");

                var BackData = JSON.parse(a);
                var ArreaRage = 0,
                    htmlBalance = "",//余额
                    arrearageID = [];
                function sub(obj) {
                    var len = obj.length;
                    switch (true){
                        case len === 1:
                            obj = obj;
                            break;
                        case len > 1 && len <4 :
                            obj = '*'+obj.substring(1,len);
                            break;
                        case len > 3:
                            obj = "**" + obj.substring(2, len);
                            break;
                    }
                    return obj;
                }
                var Money ,
                    UserID,
                    name,
                    Address,
                    water = 0;
                for (var x = 0,len = BackData.length; x < len ; ++x){
                    console.log(BackData);
                    /*隐藏姓名前几个字*/
                     Money = Math.ceil(ArreaRage-BackData[0].RemainMoney);//小数点加1
                     UserID = BackData[x].customerNo;
                     name = sub(BackData[x].userName);
                     Address = BackData[x].Address;
                        water += BackData[x].ArrearageWater;
                    arrearageID.push(BackData[x].ArrearageID) ;
      

                    if(BackData[x].RemainMoney > 0){
                        ArreaRage += BackData[x].Arrearage;
                        Money = Math.ceil(ArreaRage-BackData[0].RemainMoney);//小数点加1
                    }else if(BackData[x].RemainMoney < 0){
                        ArreaRage += BackData[x].Arrearage;
                        Money = Math.ceil(ArreaRage+(-BackData[0].RemainMoney));//小数点加1
                    }else if(BackData[0].RemainMoney === 0){
                        ArreaRage += BackData[x].Arrearage;
                        Money = Math.ceil(ArreaRage);//小数点加1
                    }
                    //判断是否为自己户号查询
                    var MyArray = sessionStorage.formData;
                    var UserArray = JSON.parse(MyArray);
                    var comparearr = [];
                    for (var i = 0,len1 = UserArray.length; i < len1; ++i){
                        comparearr.push(UserArray[i].customerNo);
                    }
                    var USERNO = $(".index .iptuserNo").val();
                        console.log(comparearr.indexOf(USERNO));
                        if(comparearr.indexOf(USERNO) !== -1){
                             htmlArrearage =   "<div class=\"common-div\">" +
                                    "<div class='result-title'>确认用户信息</div>"+
                                        "<div class='result-cont'>"+
                                        "<p class='name'><span class='title-mes'>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span> <span class='CustomerMes'>"+ name +"</span></p>"+
                                        // "<p><span class='title-mes'>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址</span> <span class='CustomerMes'>"+ Address +"</span></p>"+
                                        "<p><span class='title-mes'>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span> <span class='CustomerMes'>"+ UserID +"</span></p>"+
                                        "<p><sapn class='title-mes'>欠费月数</sapn> <span class='CustomerMes'>"+ BackData.length +"</span></p>"+
                                        "<p><span class='title-mes'>欠费水量</span> <span class='CustomerMes'>"+ water +"m³"+"</span></p>"+
                                        "<p><sapn class='title-mes'>欠费金额</sapn> <span class='CustomerMes money'>"+"￥"+"-" + Money +".00"+"</span></p>"+
                                        "</div>"+
                                        "<div class='common-ipt' style='display: none;'>"+
                                        "<p>充值额度: <input type='number' class=\"moneynum\" id='RechargeNum'><button class=\"moneybtn\" id='recharge' name='CustomerCharge'>去充值</button></p>"+
                                        "</div>"+
                                        "<div class=\"makesure\">"+
                                            "<div class=\"no\" style='border-top:1px solid #d9d9d9;'>取消</div>"+
                                            "<div class=\"yes\" style='background: #2196F3;border-top:1px solid #2196F3;color: #fff;'>缴费（即将上线）</div>"+
                                        "</div>"+
                                "</div>";
                        }else {
                             htmlArrearage = "<div class=\"common-div\">" +
                                                "<div class='result-title'>确认用户信息</div>"+
                                                "<div class='result-cont'>"+
                                                    "<p class='name'><span class='title-mes'>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span> <span class='CustomerMes'>"+ name +"</span></p>"+
                                                    // "<p><span class='title-mes'>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址</span> <span class='CustomerMes'>"+ Address +"</span></p>"+
                                                    "<p><span class='title-mes'>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span> <span class='CustomerMes'>"+ UserID +"</span></p>"+
                                                    "<p><sapn class='title-mes'>欠费月数</sapn> <span class='CustomerMes'>"+ BackData.length +"</span></p>"+
                                                    "<p><span class='title-mes'>欠费水量</span> <span class='CustomerMes'>"+ water +"m³"+"</span></p>"+
                                                    "<p><sapn class='title-mes'>欠费金额</sapn> <span class='CustomerMes money'>"+"￥"+"-" + Money +".00"+"</span></p>"+
                                                    "</div>"+
                                                    "<div class='common-ipt' style='display: none;'>"+
                                                    "<p>充值额度: <input type='number' class=\"moneynum\" id='RechargeNum'><button class=\"moneybtn\" id='recharge' name='CustomerCharge'>去充值</button></p>"+
                                                "</div>"+
                                                "<div class=\"makesure\">"+
                                                    "<div class=\"no\" style='border-top:1px solid #d9d9d9;'>取消</div>"+
                                                    "<div class=\"yes\" style='background: #2196F3;border-top:1px solid #2196F3;color: #fff;'>缴费（即将上线）</div>"+
                                                "</div>"+
                                            "</div>";
                        }
                    $(".result").html(htmlArrearage);
                }
                // //点击显示充值页面
                /*点击取消*/
                $(".result .no").click(function () {
                    move();
                    $(".result").removeClass("result-show");
                    $(".masking").removeClass("maskingClose-arr");
                });
                /*点击确认*/
                $(".result .yes").click(function () {
                    var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
                    if( !wechatInfo ) {
                        alert("本活动仅支持微信") ;
                    } else if ( wechatInfo[1] < "5.0" ) {
                        alert("本活动仅支持微信5.0以上版本");
                    }else {
                        alert("你的微信版本高于5.0 可以支付");
                    }
                });

            }
        }
    }
});
