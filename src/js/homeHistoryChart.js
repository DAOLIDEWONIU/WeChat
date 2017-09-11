    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'),myChart,{
        width: 710,
        height: 620,
        lockY: true,
        throttle: 70
    });
    myChart.showLoading();//正在加载
    function Chart(obj) {
        // var obj = [
        //     {"Xvalue":"1900-01","月购水额":100010,"月购水量":0},
        //     {"Xvalue":"2016-02","月购水额":890006,"月购水量":5},
        //     {"Xvalue":"2016-03","月购水额":503,"月购水量":4},
        //     {"Xvalue":"2016-05","月购水额":9004,"月购水量":526},
        //     {"Xvalue":"2016-07","月购水额":70007,"月购水量":24}
        // ];
        //比较 从小到大
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
        console.log(obj);
        var obj1 = obj.slice(0,12);

        console.log(obj1);
        var monthdata = [];
        var goushuidata = [];
        var goushuiliangdata = [];
        for (var i = 0,len = obj1.length; i< len ; ++i){
            monthdata.push(obj1[i].Xvalue);
            goushuidata.push(obj1[i].月购水额);
            goushuiliangdata.push(obj1[i].月购水量);
        }
        //选出购水额最大者
        var num = Math.max.apply(null,goushuidata);
        //选出购水量最大者
        var Amount = Math.max.apply(null,goushuiliangdata);
        var moneykedu = "",
            number = "",
            right = "";
        if(parseInt(num/100000) !== 0 ){
            number = (parseInt(num/100000) *100000) + 100000;
            moneykedu = 200000;
            right = 48;
        } else if(parseInt(num/10000) !== 0 ){
            number = (parseInt(num/10000) *10000) + 10000;
            moneykedu = 5000;
            right = 48;
        }else if(parseInt(num/1000) !== 0 ){
            number = (parseInt(num/1000) *1000) + 1000;
            moneykedu = 250;
            right = 40;
        } else if(parseInt(num/100) !== 0 ){
            number = (parseInt(num/100) *100) + 100;
            moneykedu = 50;
            right = 40;
        }else if(parseInt((num%100)/10) !== 0 ){
            number = (parseInt((num%100)/10) *10) + 10;
            moneykedu = 10;
            right = 30;
        }
        //水量
        var left = "",
            waternum = "",
            waterAmount = "";
        if( parseInt(Amount/10000) !== 0){
            waternum = (parseInt(Amount/10000) *10000) +10000;
            waterAmount = 50;
            left = 48;
        }else if( parseInt(Amount/1000) !== 0){
            waternum = (parseInt(Amount/1000) *1000) +1000;
            waterAmount = 250;
            left = 40;
        } else if(parseInt(Amount/100) !== 0){
            waternum = (parseInt(Amount/100) *100) +100;
            waterAmount = 80;
            left = 40;
        }else if(parseInt((Amount%100)/10) !== 0){
            waternum = (parseInt((Amount%100)/10) *10) +10;
            waterAmount = 10;
            left = 30;
        }
        // 指定图表的配置项和数据
        option = {
            baseOption:{
                tooltip: {
                    trigger: 'axis'//坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
                },
                toolbox: {
                    //工具栏
                    feature: {
                        dataView: {show: false, readOnly: false},
                        magicType: {show: false, type: ['line', 'bar']},
                        restore: {show: false},
                        saveAsImage: {show: false}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                legend: {
                    data:['月购水额(元)','月购水量(m3)']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: monthdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        // min: 0,
                        // max: number,
                        // interval: moneykedu,
                        min: 0,
                        max:'auto',
                        minInterval:20,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                    // {
                    //     type: 'value',
                    //     name: '水量(m3)',
                    //     min: 0,
                    //     max: waternum,
                    //     interval: waterAmount,
                    //     // min: 0,
                    //     // max:'auto',
                    //     // minInterval:20,
                    //     axisLabel: {
                    //         formatter: '{value}'
                    //     }
                    // }
                ],
                series: [
                    {
                        name:'月购水额(元)',
                        type:'line',//bar柱状，line折线
                        smooth: true,//折线平滑过渡
                        // smoothMonotone:'x',
                        symbolSize: 3,//折线中的小圆点
                        lineStyle: {
                            normal: {
                                width: 3,
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 10,
                                shadowOffsetY: 10
                            }
                        },
                        data:goushuidata

                    },
                    {
                        name:'月购水量(m3)',
                        type:'line',
                        smooth: true,
                        // yAxisIndex: 1,
                        symbolSize: 3,
                        lineStyle: {
                            normal: {
                                width: 3,
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 10,
                                shadowOffsetY: 10
                            }
                        },
                        data:goushuiliangdata
                    }
                ]
            },
            media:[
                {
                    option:{
                        lineStyle: {
                            normal: {
                                width: 6
                            }
                        },
                        legend:{
                            orient: 'horizontal',
                            left: 'center',
                            itemGap: 40
                        },
                        grid: {
                            left: 20,
                            top: 50,
                            right: 20,
                            bottom: 20
                        },
                        tooltip:{
                            textAlign:'center'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        myChart.hideLoading();//隐藏
        monthdata=null;
        goushuidata=null;
        goushuiliangdata=null;
    }

    
