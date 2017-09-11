
    function allchart(obj) {
        var allcharthtml = "";
        //比较--从大到小
        var compare = function(a, b){
            if (a.Xvalue < b.Xvalue) {
                return 1;
            } else if (a.Xvalue > b.Xvalue) {
                return -1;
            }else{
                return 0;
            }
        };
        obj = obj.sort(compare);
        var obj1 = obj.slice(0,obj.length);
        for(var i = 0, len = obj1.length; i < len ; ++i){
            allcharthtml +=" <tr>"+
                "<td>"+ obj1[i].Xvalue +"</td>"+
                "<td>"+ obj1[i].月购水额 +"</td>"+
                "<td>"+ obj1[i].月购水量 +"</td>"+
                "</tr>";
        }
        $(".index .common-ipt .chartinner table .list-month-mes").html(allcharthtml);
        //点击相应的li，显示更为详细的信息
        $(".index .history-all-cont .list-month-mes tr").each(function (i) {
            $(this).click(function () {
                var searchdata = [];
                month = $(this).find("td").eq(0).text();
                var CustomerNo = $(".index .common-ipt p .mes").eq(1).text();
                searchdata.push(telphone,CustomerNo,month);
                homeAllChat.RequestMonth("CustomerWaterInfo_Date",searchdata);
                homeAllChat.stop();
            });
        });
    }
var homeAllChat = {
        //滚动条无法滚动
        NoMove:function (e) {e.preventDefault();},
        /***禁止滑动***/
        stop:function () {
            document.body.style.overflow='hidden';
            document.addEventListener("touchmove",homeAllChat.NoMove,false);//禁止页面滑动
        },
        /***取消滑动限制***/
        move:function () {
            document.body.style.overflow='';//出现滚动条
            document.removeEventListener("touchmove",homeAllChat.NoMove,false);
        },
    
        //查询每月详情
        RequestMonth:function (Method, value) {
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
                    // console.log(obj);
                    homeAllChat.monthData(obj);
                }
            });
        },
        monthData:function (a) {
            data = [
                {
                    "charterror": "无法查到数据",
                    "telerror": "手机号码不正确",
                    "mesError":"数据异常"
                }
            ];
            for (var i = 0, len = data.length; i < len; ++i) {
                if (data[i].charterror === a) {
                    $(".popup").html(data[i].charterror);
                    Popping();
                }else if (data[i].telerror === a) {
                    $(".popup").html(data[i].telerror);
                    Popping();
                }else if (data[i].mesError === a) {
                    $(".popup").html(data[i].mesError);
                    Popping();
                } else {
                    var ChartData = JSON.parse(a);
                    console.log(ChartData);
                    var html = "";
                    for(var j = 0 , len1 = ChartData.length; j < len1 ; ++j){
                        html ="<ul>"+
                            "<li class=\"clearfloat\"><p>用水月份:</p> <span class=\"Water_month\">"+ month +"</span></li>"+
                            "<li class=\"clearfloat\"><p>用水类型:</p> <span class=\"Water_type\">"+ ChartData[j].Water_type +"</span></li>"+
                            "<li class=\"clearfloat\"><p>用水量:</p> <span class=\"Water_amount\">"+ ChartData[j].Water_amount +"</span></li>"+
                            "<li class=\"clearfloat\"><p>用水费用:</p> <span class=\"Water_money\">"+ ChartData[j].Water_money +"</span></li>"+
                            "</ul>";
                    }
                    $(".user-month-mes").html(html).addClass("show-month-mes");
                    $(".masking").html("点击此处关闭").addClass("maskingClose").click(function () {
                        $(".user-month-mes").removeClass("show-month-mes");
                        $(this).html("").removeClass("maskingClose");
                        homeAllChat.move();
                    });
                }
            }
        }
    };