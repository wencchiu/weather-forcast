
// var data = fetch('https://pm25.lass-net.org/data/last-all-epa.json')
//
// var data2 = data.then(function(response) {
//     return response.json();
//   })
//
// data2.then(function(gary){
//   var site = gary.feeds.find(function(element){
//     return element.SiteName ==="臺南";
//   })
//   var county = document.getElementById("site");
//     county.textContent = site.SiteName;
//   var AQI = document.getElementById("aqi");
//     AQI.textContent = "AQI=" + site.AQI;
//   var PM25 = document.getElementById("pm25");
//     PM25.textContent = "PM2.5=" + site.PM2_5;
//   //console.log(county);
// })


var lat, long, getLocationUrl, currentCity, currentRegion;

navigator.geolocation.getCurrentPosition(success);
function success(pos){
	lat = pos.coords.latitude;
  long = pos.coords.longitude;
  getLocationUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ long + "," + lat + ".json?language=zh-Hant&access_token=pk.eyJ1Ijoid2VuY2hpdSIsImEiOiJjanh2b2hraHAwNW80M2JrZHFkanBmZGtqIn0.xPJ3QUe41GZXPtVGbFZAyw";
  presentLocation();
}

function presentLocation() {
  var currentLocation = fetch(getLocationUrl);
  var currentLocation2 = currentLocation.then(function (res) {
    return res.json();
  })
  console.log(currentLocation2);
  currentLocation2.then(function(location) {
    var loc = document.getElementById("location");
    loc.textContent = "現在位置：" + location.features[3].text + " "+ location.features[2].text;
    currentCity = location.features[3].text;
    currentRegion = location.features[2].text;
    getForecastData();
  });
}


var arrNewTaipeiCity06 = [];
var arrTaipeiCity01 = [];

var getCurrentObsUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
function presentCurrentObs() {
  var currentObs = fetch(getCurrentObsUrl);
  var currentObs2 = currentObs.then(function (res) {
    return res.json();
  })
  currentObs2.then(function (allstation) {
    var arrAll = allstation.records.location;
    for (var i = 0; i < arrAll.length; i++) {
      if (arrAll[i].parameter[1].parameterValue === "01") {
        arrTaipeiCity01.push(arrAll[i]);
      }
      if (arrAll[i].parameter[1].parameterValue === "06") {
        arrNewTaipeiCity06.push(arrAll[i]);
      }
    }
  })
}

// presentCurrentObs();

var getforecast48hrUrl, getforecast7dUrl, regionforecast48hr, regionforecast7d;

var forecastTime48hr, forecastTemp48hr, forecastWx48hr, forecastPoP6h48hr;
var arr48hrTime = [];
var arr48hrTemp = [];
var arr48hrPoP6h = [];
var arr48hrWx = [];

var forecastDate7d, forecastWx7d, forecastmaxT7d, forecastminT7d;
var arr7dDateTemp;
var arr7dDate = [];
var arr7dWx = [];
var arr7dmaxT = [];
var arr7dminT = [];

var CLEAR = 0;
var CLEAR_CLOUDY = 1;
var CLOUDY = 2;
var CLOUDY_RAIN = 3;
var CLEAR_CLOUDY_RAIN = 4;
var CLOUDY_THUNDER = 5;
var CLEAR_CLOUDY_THUNDER = 6;
var CLOUDY_SNOW = 7;
var CLOUDY_FOG = 8;
var CLEAR_CLOUDY_FOG = 9;
var SNOW = 10;


var WEATHER_CODE = [
  [[1, 2], CLEAR],
  [[3], CLEAR_CLOUDY],
  [[4, 5, 6, 7], CLOUDY],
  [[8, 9, 10, 11, 12, 13, 14], CLOUDY_RAIN],
  [[15, 16, 17, 18], CLOUDY_THUNDER],
  [[19], CLEAR_CLOUDY_RAIN],
  [[20], CLOUDY_RAIN],
  [[21], CLEAR_CLOUDY_THUNDER],
  [[22], CLOUDY_THUNDER],
  [[23], CLOUDY_SNOW],
  [[24, 25], CLEAR_CLOUDY_FOG],
  [[26, 27, 28], CLOUDY_FOG],
  [[29, 30, 31, 32], CLOUDY_RAIN],
  [[33, 34, 35, 36], CLOUDY_THUNDER],
  [[37, 38, 39], CLOUDY_RAIN],
  [[41], CLOUDY_THUNDER],
  [[42], SNOW],
];

function getWeatherCode(arr, target) {
  var L = 0, R = arr.length-1;
  while (L <= R) {
    var M = Math.floor((L + R)/2);
    if (arr[M][0][0] === target) {
      return arr[M][1];
    } else if (arr[M][0][0] > target) {
      R = M - 1;
    } else {
      if (arr[M][0].indexOf(target) === -1) {
        L = M + 1;
      } else {
        return arr[M][1];
      }
    }
  }
}

function getForecastData() {
  switch (currentCity) {
    case "臺北市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-061?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "宜蘭縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-001?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-003?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "桃園市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-005?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-007?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "新竹縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-009?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-011?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "苗栗縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-013?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-015?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "彰化縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-017?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-0019?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "南投縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-021?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-023?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "雲林縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-025?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-027?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "嘉義縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-029?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-031?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "屏東縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-033?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-035?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "台東縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-037?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-039?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "花蓮縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-041?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-043?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "澎湖縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-045?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-047?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "基隆市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-049?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-051?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "新竹市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-053?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-055?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "嘉義市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-057?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-0059?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "臺北市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-061?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "高雄市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-065?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-067?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "新北市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-069?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-071?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "臺中市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-073?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-075?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "臺南市":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-077?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-0079?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "連江縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-081?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-083?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    case "金門縣":
      getforecast48hrUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-085?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      getforecast7dUrl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-087?Authorization=CWB-06FAD906-0869-4F4D-8A7C-1BB80EAC6A2F"
      break;
    default:
      console.log("No Data.");
  }
  forecast48hr();
  forecast7d();
}

function forecast48hr() {
  var forecast48hr = fetch(getforecast48hrUrl);
  var forecast48hr2 = forecast48hr.then(function (res) {
    return res.json();
  })
  forecast48hr2.then(function (regionsData) {
    var arr48hr = regionsData.records.locations[0].location;
    for (var i = 0; i < arr48hr.length; i++) {
      if (arr48hr[i].locationName === currentRegion) {
        regionforecast48hr =  arr48hr[i];
      }
    }
    console.log(regionforecast48hr);
    // Get 48hr forecast Time & temperature
    arrTemp = regionforecast48hr.weatherElement[3].time;
    for (var i = 0; i < arrTemp.length; i++) {
      arr48hrTime[i] = arrTemp[i].dataTime;
      arr48hrTemp[i] = arrTemp[i].elementValue[0].value;
    }
    forecastTime48hr = document.getElementById("forecast-48hrs-time");
    arr48hrTime.forEach(function (e) {
      var th = document.createElement("th");
      var timeDate = new Date(e.slice(0,4), e.slice(5,7)-1, e.slice(8,10));
      var arrDay = ["日", "一", "二", "三", "四", "五", "六" ];
      var getDay = timeDate.getDay();
      var DayTemp = arrDay[getDay];
      if (e[5] === "0" ) {
        th.textContent = e.slice(6,7) + "/" + e.slice(8,10) + "(" + DayTemp + ") " + e.slice(11,16);
      } else {
        th.textContent = e.slice(5,7) + "/" + e.slice(8,10) + "(" + DayTemp + ") " + e.slice(11,16);
      }
      forecastTime48hr.append(th);
    })
    forecastTemp48hr = document.getElementById("forecast-48hrs-temp");
    arr48hrTemp.forEach(function (e) {
      var td = document.createElement("td");
      td.innerHTML = e + '&#8451' ;
      forecastTemp48hr.append(td);
    })
    // Get 48hr forecast PoP6h
    arrPoP6hTemp = regionforecast48hr.weatherElement[7].time;
    for (var i = 0; i < arrPoP6hTemp.length; i++) {
      arr48hrPoP6h[i] = arrPoP6hTemp[i].elementValue[0].value;
    }
    forecastPoP6h48hr = document.getElementById("forecast-48hrs-PoP6h");
    arr48hrPoP6h.forEach(function (e) {
      var td1 = document.createElement("td");
      var td2 = document.createElement("td");
      td1.innerHTML = e + "%" ;
      td2.innerHTML = e + "%" ;
      forecastPoP6h48hr.append(td1);
      forecastPoP6h48hr.append(td2);
    })
    // Get 48hr forecast Wx
    arr48hrWxTemp = regionforecast48hr.weatherElement[1].time;
    for (var i = 0; i < arr48hrWxTemp.length; i++) {
       Wx48hrTemp = parseInt(arr48hrWxTemp[i].elementValue[1].value);
       arr48hrWx[i] = getWeatherCode(WEATHER_CODE, Wx48hrTemp);
    }
    forecastWx48hr = document.getElementById("forecast-48hrs-Wx");
    arr48hrWx.forEach(function (e) {
      var td = document.createElement("td");
      var div = document.createElement("div");
      Wx48hrClass = "WxImage" + e;
      div.classList.add("WxImage", Wx48hrClass);
      td.append(div);
      forecastWx48hr.append(td);
    })
  })
}

function forecast7d() {
  var forecast7d = fetch(getforecast7dUrl);
  var forecast7d2 = forecast7d.then(function (res) {
    return res.json();
  })
  forecast7d2.then(function (regionsData) {
    var arr7d = regionsData.records.locations[0].location;
    for (var i = 0; i < arr7d.length; i++) {
      if (arr7d[i].locationName === currentRegion) {
        regionforecast7d =  arr7d[i];
      }
    }
    console.log(regionforecast7d);
    // Get 7days forcast Date //
    arr7dDateTemp = regionforecast7d.weatherElement[8].time;
    var todayDD = new Date().getDate();
    for (var i = 1; i < arr7dDateTemp.length; i++) {
      if (todayDD !== parseInt(arr7dDateTemp[i].startTime.slice(8,10))) {
        for (var j = i; j < arr7dDateTemp.length; j+=2) {
          arr7dDate.push(arr7dDateTemp[j].startTime) ;
        }
        break;
      }
    }
    var forecastDate7d = document.getElementById("forecast-7d-date");
    arr7dDate.forEach(function (e) {
      var th = document.createElement("th");
      var timeDate = new Date(e.slice(0,4), e.slice(5,7)-1, e.slice(8,10));
      var arrDay = ["日", "一", "二", "三", "四", "五", "六" ];
      var getDay = timeDate.getDay();
      var DayTemp = arrDay[getDay];
      if (e[5] === "0" ) {
        th.textContent = e.slice(6,7) + "/" + e.slice(8,10) + " (" + DayTemp + ")";
      } else {
        th.textContent = e.slice(5,7) + "/" + e.slice(8,10) + " (" + DayTemp + ")";
      }
      forecastDate7d.append(th);
    })
    // Get 7days forcast minT //
    for (var i = 1; i < arr7dDateTemp.length; i++){
      if (todayDD !== parseInt(arr7dDateTemp[i].startTime.slice(8,10))) {
        for (var j = i; j < arr7dDateTemp.length; j+=2) {
          var minTemp = Math.min(parseInt(arr7dDateTemp[j].elementValue[0].value), parseInt(arr7dDateTemp[j+1].elementValue[0].value))
          arr7dminT.push(minTemp);
        }
        break;
      }
    }
    forecastminT7d = document.getElementById("forecast-7d-minT");
    arr7dminT.forEach(function (e) {
      var td = document.createElement("td");
      td.innerHTML = e + '&#8451' ;
      forecastminT7d.append(td);
    })
    // Get 7days forcast maxT //
    arr7dmaxTTemp = regionforecast7d.weatherElement[12].time;
    for (var i = 1; i < arr7dmaxTTemp.length; i++){
      if (todayDD !== parseInt(arr7dmaxTTemp[i].startTime.slice(8,10))) {
        for (var j = i; j < arr7dmaxTTemp.length; j+=2) {
          var maxTemp = Math.max(parseInt(arr7dmaxTTemp[j].elementValue[0].value), parseInt(arr7dmaxTTemp[j+1].elementValue[0].value))
          arr7dmaxT.push(maxTemp);
        }
        break;
      }
    }
    forecastmaxT7d = document.getElementById("forecast-7d-maxT");
    arr7dmaxT.forEach(function (e) {
      var td = document.createElement("td");
      td.innerHTML = e + '&#8451' ;
      forecastmaxT7d.append(td);
    })
    // Get 7days forcast Wx //
    arr7dWxTemp = regionforecast7d.weatherElement[6].time;
    for (var i = 1; i < arr7dWxTemp.length; i++) {
      if (todayDD !== parseInt(arr7dWxTemp[i].startTime.slice(8,10))) {
        for (var j = i; j < arr7dWxTemp.length; j+=2) {
          var WxM = parseInt(arr7dWxTemp[j].elementValue[1].value);
          var WxN = parseInt(arr7dWxTemp[j+1].elementValue[1].value);
          var WxMCode = getWeatherCode(WEATHER_CODE, WxM);
          var WxNCode = getWeatherCode(WEATHER_CODE, WxN);
          if (WxMCode === WxNCode) {
            arr7dWx.push(WxMCode);
          } else {
            arr7dWx.push(Math.max(WxMCode, WxNCode));
          }
        }
        break;
      }
    }
    forecastWx7d = document.getElementById("forecast-7d-Wx");
    arr7dWx.forEach(function (e) {
      var td = document.createElement("td");
      var div = document.createElement("div");
      WxClass = "WxImage" + e;
      div.classList.add("WxImage", WxClass);
      td.append(div);
      forecastWx7d.append(td);
    })

  })
  }







  // var output = document.getElementById("weather");

  // if(!navigator.geolocation){
  //   output.innerHTML = "<p>您的瀏覽器不支援此服務</p>";
  // }
  //
  // function success(location){
  //   var latitude = location.coords.latitude;
  //   var longitude = location.coords.longitude;
  //   var weatherData = fetch('https://api.darksky.net/forecast/b49587083ee7d8afad9d3e90943723e1/' + latitude + "," + longitude)
  //   // var weatherData2 = weatherData.then(function(response){
  //   //   return response.json();
  //   // })
  //   var timezone = weatherData.timezone;
  //   console.log(timezone);
  // };
  //
  // function error(){
  //   output.innerHTML = "<p>無法取得您的位置</p>";
  // };
  //
  // output.innerHTML = "<p>定位中...</p>";
  //
  // navigator.geolocation.getCurrentPosition(success,error);
