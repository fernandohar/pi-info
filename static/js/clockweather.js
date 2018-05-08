var stn = "HK Observatory"
$(function() {
    // clock
    let clock = setInterval(setTime, 1000);
    let data = setInterval(setData, 1000 * 60 * 10); //every 10 minutes
    let $time = $('#time');
    let $date = $('#date');
    let $cnDate = $('#cnDate');

    function setTime() {
        moment.locale('zh-hk');
        //var cn_date = calendar.solar2lunar();
        $time.html(moment().format('HH:mm:ss'));
        $date.html(moment().format('LL dddd'));
    }
    jg = new JustGage({
        id: "jg1",
        value: 0,
        min: 0,
        max: 100,
        pointer: true,
        pointerOptions: {
            toplength: 8,
            bottomlength: -20,
            bottomwidth: 6,
            color: '#FFFFFF'
        },
        gaugeWidthScale: 0.8,
        hideMinMax: true,
        valueFontColor: "white",
        valueMinFontSize: 24,
        customSectors: [{
            color: "#00FF00",
            lo: 40,
            hi: 60
            /* Comfortable */
        }, {
            color: "#FF0000",
            lo: 0,
            hi: 40
        }, {
            color: "#0000FF",
            lo: 60,
            hi: 100
        }
        ],
        counter: false
    });

    setData();
});

function setData() {
//   var url = "http://www.hko.gov.hk/wxinfo/json/one_json.xml"
   var url = "http://www.hko.gov.hk/wxinfo/json/one_json_uc.xml"
   $.getJSON(url, function(data){
  	var temperature = data.hko.Temperature;
	var humidity = data.hko.RH;
        var animationCode = data.fcartoon.Icon1;
	
	//STATION NAME
	$("#city").text(stn);

	//HUMIDITY
	jg.refresh(humidity);

        //TEMPERATURE
        $("#temperature-now").text(temperature);
        $("#temperature-now").append("<sup><small>°C</small> </sup>");

	$("#temperatureHigh").text("H: " + data.hko.HomeMaxTemperature);
        $("#temperatureHigh").append("<sup><small>°C</small> </sup>");
	$("#temperatureLow").text("L: " + data.hko.HomeMinTemperature)
        $("#temperatureLow").append("<sup><small>°C</small> </sup>");
	
	//WEATHER ANIMATION
	var myDate = new Date();
        var hour = myDate.getHours();
	var daylight = (hour > 5) && (hour < 17); //6am - 5pm 
        var animation = "rainbow"

//animationCode mapping from HKO	
var wxDesc = {
    "50": "Sunny",
    "51": "Sunny Periods",
    "52": "Sunny Intervals",
    "53": "Sunny Periods with A Few Showers",
    "54": "Sunny Intervals with Showers",
    "60": "Cloudy",
    "61": "Overcast",
    "62": "Light Rain",
    "63": "Rain",
    "64": "Heavy Rain",
    "65": "Thunderstorms",
    "70": "Fine",
    "71": "Fine",
    "72": "Fine",
    "73": "Fine",
    "74": "Fine",
    "75": "Fine",
    "76": "Mainly Cloudy",
    "77": "Mainly Cloudy",
    "80": "Windy",
    "81": "Dry",
    "82": "Humid",
    "83": "Fog",
    "84": "Mist",
    "85": "Haze",
    "90": "Hot",
    "91": "Warm",
    "92": "Cool",
    "93": "Cold"
};

var wxDescChi = {
    "50": "陽光充沛",
    "51": "間有陽光",
    "52": "短暫陽光",
    "53": "間有陽光幾陣驟雨",
    "54": "短暫陽光有驟雨",
    "60": "多雲",
    "61": "密雲",
    "62": "微雨",
    "63": "雨",
    "64": "大雨",
    "65": "雷暴",
    "70": "天色良好",
    "71": "天色良好",
    "72": "天色良好",
    "73": "天色良好",
    "74": "天色良好",
    "75": "天色良好",
    "76": "大致多雲",
    "77": "天色大致良好",
    "80": "大風",
    "81": "乾燥",
    "82": "潮濕",
    "83": "霧",
    "84": "薄霧",
    "85": "煙霞",
    "90": "熱",
    "91": "暖",
    "92": "涼",
    "93": "冷",
};
	var clearSkyIconCodes = [50, 70,71,72,73,74,75, 80,81,82,83,84,85,90,91,92,93];
	var cloudySkyIconCodes = [51, 52, 60, 61, 76, 77];
	var rainyDayIconCodes = [53, 54, 62, 63];
	var thunderStormIconCodes = [64, 65];
	animationCode = parseInt(animationCode);
        if (daylight){
		$("#widget-container").attr("class", "widget-container day");
	}else{
		$("#widget-container").attr("class", "widget-container night");
	}
	if(clearSkyIconCodes.includes(animationCode)){
		if(daylight){
			animation = "sunny";
		}else{
			animation = "starry";
		}
	}else if (cloudySkyIconCodes.includes(animationCode)){
   		animation = "cloudy";
	}else if (rainyDayIconCodes.includes(animationCode)){
		animation = "rainy";
	}else if (thunderStormIconCodes.includes(animationCode)){
		animation = "stormy";
	}
console.log(animationCode);
	$("#weather_icon").attr("class", animation);

	$("#weatherDesc").text(wxDescChi[animationCode]);

	//3 DAYS WEATHER FORECAST
	var today = parseInt(data.FLW.BulletinDate);

	var i = -1;
	while(++i < 3){
		var fnd = data.F9D.WeatherForecast[i];
		var forecastDate = parseInt(fnd.ForecastDate)

		var ithDay = forecastDate - today;
		if(ithDay == 0){
		$("#forecast"+i).text("今天");
			
		}else if(ithDay == 1){
		 $("#forecast"+i).text("明天");
		}else if (ithDay == 2){
		 $("#forecast"+i).text("後天");
		}else{
                 $("#forecast"+i).text(i + "天後");
		}
		$("#weather"+i).text(fnd.ForecastWeather);
        	$("#temp"+i).text(fnd.ForecastMintemp + " - " + fnd.ForecastMaxtemp);
		$("#temp"+i).append("<sup><small>°C</small></sup>");
	}
   });
}
