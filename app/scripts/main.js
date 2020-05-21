OO.Data = OO.Data || {};

// DOM載入完成
$(document).ready(function() {
    OO.Data.areaInfo = [];

	let body = d3.select('body');
    let mapContainer = body.select('.body-container .main .map');
    let totalInfoBlock = body.select('.total-diagnose-block .diagnose-value');
    let infoSwiperContainer = body.select('.info-swiper-container');
    let myChart = echarts.init(mapContainer.node());
    let modalComponent = new OO.Modules.ModalComponent({}, body);
    let isStopRefresh = false;
    let options = {
        title: {
            text: '臺灣各縣市確診人數統計',
            subtext: 'Data from 衛生福利部疾病管制署 https://data.cdc.gov.tw/',
            sublink: 'https://data.cdc.gov.tw/dataset/agsdctable-day-19cov'
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
                let value = isNaN(params.value) ? 0 : params.value;
                return params.name + '確診人數: ' + value;
            }
        },
        visualMap: {
            left: 'right',
            min: 0,
            max: 600,
            text: ['High', 'Low'],
            calculable: true
        },
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

    let infoSwiperInit = function(container, list) {
        let infoSwiperWrapper = container.select('.swiper-wrapper');
        list.forEach(function(item) {
            let infoBlock = infoSwiperWrapper.append('div')
                .classed('swiper-slide info-block', true)
                .attr('nid', item.name);

            let infoBody = infoBlock.append('div')
                .classed('info-body', true);

            infoBody.append('div')
                .classed('title-header', true)
                .text(item.name + '確診人數');

            infoBody.append('div')
                .classed('diagnose-value', true)
                .text(item.value);
        });

        return new Swiper(container.node(), {
            spaceBetween: 0,
            centeredSlides: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            }
        });
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
                        object = {
                            name: area,
                            value: count
                        };
                        seriesData.push(object);
                    }

                    infoSwiperContainer
                        .select('.info-block[nid="' + object.name + '"] .diagnose-value')
                        .text(object.value);
                });

                totalInfoBlock.text(total);

                options.series[0].data = seriesData;
                myChart.setOption(options);

                if (successCallback) {
                    successCallback();
                }
            }, function(error) {
                isStopRefresh = true;
                modalComponent.show('Error', 'Ajax request error!');
            });
    };

    myChart.showLoading();

    OO.Service.getTaiwanGeojson()
        .then(function(geoJson) {
            echarts.registerMap('taiwan', geoJson);

            geoJson.features.forEach(function(item) {
                OO.Data.areaInfo.push({
                    name: item.properties.name,
                    value: 0
                });
            });

            infoSwiperInit(infoSwiperContainer, OO.Data.areaInfo);

            refresh(function() {
                myChart.hideLoading();

                setInterval(function() {
                    if (!isStopRefresh) {
                        refresh();
                    }
                }, 10000);
            });
        }, function(error) {
            modalComponent.show('Error', 'Ajax request error!');
        });
});
