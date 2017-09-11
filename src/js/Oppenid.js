/**
 * Created by Administrator on 2017-01-18.
 */

(function () {
    
        function getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }
        
        sessionStorage.setItem("code",getQueryString("code"));
        var codeArr = [];
        codeArr.push(getQueryString("code"));
        SendPost("WeiXinLogin",codeArr);

        function SendPost(Method,value) {
            var data = '<?xml version="1.0" encoding="utf-8"?>';
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
                url: "http://112.74.160.51:8084/AppWebService/AppData",
                type: "POST",
                dataType: "xml",
                contentType: "text/xml; charset=utf-8",
                data: data,
                success: function (data) {
                    var obj = $.xml2json(data).Body.WeiXinLoginResponse.out;//取得文本
                    console.log('取得数据'+obj);
                    var istruelen = obj.length;
                    console.log('返回长度'+istruelen);
                    if(istruelen === 5){
                        window.location.replace("http://www.zsyltec.com/WeChat/dist/html/BangDing.html");
                    }else if(istruelen === 4){
                        window.location.replace("http://www.zsyltec.com/WeChat/dist/html/query.html");
                    }else {
                        window.location.replace("http://www.zsyltec.com/WeChat/dist/html/query.html");
                    }
                },
                error:function (data) {
                    console.log(data);
                    alert("服务器数据出错，请稍后再试");
                }
            });
        } 
})();


