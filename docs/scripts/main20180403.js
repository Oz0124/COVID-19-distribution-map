"use strict";var OO=OO||{};OO.Modules=OO.Modules||{},OO.Modules.ModalComponent=function(a,t){var e=OO.Modules.ModalComponent.prototype._init,o=e(a,t);this.show=o.show},OO.Modules.ModalComponent.prototype._init=function(a,t){var e=t.append("div").attr("class","modal fade"),o=e.append("div").attr("class","modal-dialog"),n=o.append("div").attr("class","modal-content"),i=n.append("div").attr("class","modal-header");return i.append("button").attr("type","button").attr("class","close").attr("data-dismiss","modal").append("span").attr("aria-hidden","true").text("×"),i.append("h4").attr("class","modal-title"),n.append("div").attr("class","modal-body"),n.append("div").attr("class","modal-footer").append("button").attr("type","button").attr("class","btn btn-default").attr("data-dismiss","modal").text("OK"),{show:function(a,t){i.select(".modal-title").text(a),n.select(".modal-body").text(t),$(e.node()).modal("show")}}};var OO=OO||{};OO.Modules=OO.Modules||{},OO.Modules.DisplayPanel=function(a,t){var e=OO.Modules.DisplayPanel.prototype._init;e(a,t)},OO.Modules.DisplayPanel.prototype._init=function(a,t){return{}};var OO=OO||{};OO.Service=OO.Service||{},function(){OO.Service.getTaiwanGeojson=function(){return $.ajax({url:"map/twCounty2010.geo.json",type:"GET",data:{}})},OO.Service.getCovid19Data=function(a){return $.ajax({url:"https://cors-anywhere.herokuapp.com/http://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.json",type:"GET",data:a})}}();var OO=OO||{};OO.Data=OO.Data||{},$(document).ready(function(){OO.Data.areaInfo=[];var a=d3.select("body"),t=a.select(".body-container .main .map"),e=a.select(".total-diagnose-block .diagnose-value"),o=a.select(".info-swiper-container"),n=echarts.init(t.node()),i=new OO.Modules.ModalComponent({},a),s=!1,d={title:{text:"臺灣各縣市確診人數統計",subtext:"Data from 衛生福利部疾病管制署 https://data.cdc.gov.tw/",sublink:"https://data.cdc.gov.tw/dataset/agsdctable-day-19cov"},tooltip:{trigger:"item",showDelay:0,transitionDuration:.2,formatter:function(a){var t=isNaN(a.value)?0:a.value;return a.name+"確診人數: "+t}},visualMap:{left:"right",min:0,max:600,text:["High","Low"],calculable:!0},series:[{name:"各地確診人數",type:"map",roam:!0,mapType:"taiwan",emphasis:{label:{show:!0}},data:[]}]},r=function(a){OO.Service.getCovid19Data({}).then(function(t){var i=[],s=0;t.forEach(function(a){var t=a["縣市"],e=parseInt(a["確定病例數"]||0),n=null;s+=e,i.forEach(function(a){t===a.name&&(n=a)}),n?n.value+=e:(n={name:t,value:e},i.push(n)),o.select('.info-block[nid="'+n.name+'"] .diagnose-value').text(n.value)}),e.text(s),d.series[0].data=i,n.setOption(d),a&&a()},function(a){s=!0,i.show("Error","Ajax request error!")})};n.showLoading(),echarts.registerMap("taiwan",TwGeoJson),geoJson.features.forEach(function(a){OO.Data.areaInfo.push({name:a.properties.name,value:0})}),function(a,t){var e=a.select(".swiper-wrapper");t.forEach(function(a){var t=e.append("div").classed("swiper-slide info-block",!0).attr("nid",a.name),o=t.append("div").classed("info-body",!0);o.append("div").classed("title-header",!0).text(a.name+"確診人數"),o.append("div").classed("diagnose-value",!0).text(a.value)}),new Swiper(a.node(),{spaceBetween:0,centeredSlides:!0,autoplay:{delay:3e3,disableOnInteraction:!1}})}(o,OO.Data.areaInfo),r(function(){n.hideLoading(),setInterval(function(){s||r()},1e4)})});
