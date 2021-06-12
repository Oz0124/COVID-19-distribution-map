var OO = OO || {};
OO.Service = OO.Service || {};

(function() {

    OO.Service.getTaiwanGeojson = function() {
        return $.ajax({
            url: 'map/twCounty2010.geo.json',
            type: 'GET',
            data: {}
        });
    };

    OO.Service.getCovid19Data = function(data) {
        return $.ajax({
            url: 'https://api.allorigins.win/get?url=http://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.json',
            type: 'GET',
            data: data
        });
    };


}());
