// DOM載入完成
$(document).ready(function() {
	let body = d3.select('body');
	let main = body.select('.main');
    let myChart = echarts.init(main.node());
    let options = {
        title: {
            text: 'COVID-19 台灣確診人數分布圖',
            subtext: 'Data from 衛生福利部疾病管制署 https://data.cdc.gov.tw/',
            sublink: 'https://data.cdc.gov.tw/dataset/agsdctable-day-19cov'
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
                let value = isNaN(params.value) ? 0 : params.value;
                return params.seriesName + '<br/>' + params.name + ': ' + value;
            }
        },
        visualMap: {
            left: 'right',
            min: 0,
            max: 600,
            text: ['High', 'Low'],
            calculable: true
        },
        // toolbox: {
        //     show: true,
        //     left: 'right',
        //     top: 'top',
        //     feature: {
        //         dataView: {
        //             readOnly: false
        //         },
        //         restore: {},
        //         saveAsImage: {}
        //     }
        // },
        series: [
            {
                name: '各地確診人數',
                type: 'map',
                roam: true,
                mapType: 'taiwan',
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: []
            }
        ]
    };

    let refresh = function(successCallback) {
        OO.Service.getCovid19Data({})
            .then(function(result) {
                let seriesData = [];
                let total = 0;

                result.forEach(function(item) {
                    let area = item['縣市'];
                    let count = parseInt(item['確定病例數'] || 0);
                    let object = null;

                    total += count;

                    seriesData.forEach(function(o) {
                        if (area === o.name) {
                            object = o;
                        }
                    });

                    if (object) {
                        object.value += count;
                    }
                    else {
                        seriesData.push({
                            name: area,
                            value: count
                        });
                    }
                });

                console.log('Total: ' + total);

                options.series[0].data = seriesData;
                myChart.setOption(options);

                if (successCallback) {
                    successCallback();
                }
            }, function(error) {
                console.log('Ajax request 發生錯誤');
            });
    };

    myChart.showLoading();

    OO.Service.getTaiwanGeojson()
        .then(function(geoJson) {
            echarts.registerMap('taiwan', geoJson);

            refresh(function() {
                myChart.hideLoading();
            });
        }, function(error) {
            console.log('Ajax request 發生錯誤');
        });
});
