let API_KEY="a602518130fa0393201686c1b57a3e95"

let userLat;
let userLong;

const search=document.querySelector('#place');
const searchBtn=document.querySelector('.search-btn');

const disTemp=document.querySelector('.temperature');
const disParam=document.querySelector('.weather-opinion');
const disPressure=document.querySelector('.pressure-val');
const disHumidity=document.querySelector('.humidity-val');
const disVisibilty=document.querySelector('.visibility-val');
const disWindSpeed=document.querySelector('.wind-speed-val');
const disSunset=document.querySelector('.sunset-time');
const disSunrise=document.querySelector('.sunrise-time');
const disRainSnow=document.querySelector('.rain-snow');
const disLoc=document.querySelector('.location');

const weatherVector=document.querySelector('.weather-vector');

const disDayTime=document.querySelector('.day-time');
const disDate=document.querySelector('.date');

const dayArr=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const monthArr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

const weatherDetail=document.querySelector('.weather-detail');
const weatherDetailLoader=document.querySelector('.weather-detail-load');
const imageLoader=document.querySelector('.img-load');
const metricLoader=document.querySelectorAll('.metric-load');

const errImg=document.querySelector('.err-img');
const errCode=document.querySelector('.err-code');
const errMsg=document.querySelector('.err-msg');
const errDetail=document.querySelector('.err-detail');
const errSuggestion=document.querySelector('.suggestion');

const weatherImage=document.querySelector('.weather-img');
const highlightHeading=document.querySelector('.highlight-heading');
const highlight=document.querySelector('.today-highlights');

const locationReq=document.querySelector('.location-request');


function uiHeaderOn(){
  weatherImage.classList="weather-img flex justify-center items-center my-2";
  highlightHeading.classList="highlight-heading font-semibold text-white mb-2";
  highlight.classList="today-highlights text-white flex flex-col gap-3";
  errImg.classList="err-img hidden";
  errDetail.classList="err-detail text-white hidden";
}

function uiHeaderOff(){
  weatherImage.classList="weather-img hidden my-2";
  highlightHeading.classList="highlight-heading font-semibold text-white mb-2 hidden";
  highlight.classList="today-highlights text-white hidden";
}

function uiOff(){
  weatherDetail.classList="weather-detail hidden";
  weatherVector.classList="weather-vector hidden";
  disPressure.classList="pressure-val hidden";
  disHumidity.classList="humidity-val hidden";
  disVisibilty.classList="visibility-val hidden";
  disWindSpeed.classList="wind-speed-val hidden";
  disSunrise.classList="sunrise-time hidden";
  disSunset.classList="sunset-time hidden";
}

function uiOn(){
  weatherDetail.classList="weather-detail";
  weatherVector.classList="weather-vector";
  disPressure.classList="pressure-val";
  disHumidity.classList="humidity-val";
  disVisibilty.classList="visibility-val";
  disWindSpeed.classList="wind-speed-val";
  disSunrise.classList="sunrise-time";
  disSunset.classList="sunset-time";
}

function loaderOn(){
  weatherDetailLoader.classList="weather-detail-load";
  imageLoader.classList="img-load grid grid-cols-3 gap-1 w-[110px] animate-pulse";
  metricLoader.forEach(function(element){
    element.classList="metric-load w-[100px] h-4 bg-slate-700 rounded animate-pulse";
  })
}

function loaderOff(){
  weatherDetailLoader.classList="weather-detail-load hidden";
  imageLoader.classList="img-load hidden grid grid-cols-3 gap-1 w-[110px] animate-pulse";
  metricLoader.forEach(function(element){
    element.classList="metric-load hidden w-[100px] h-4 bg-slate-700 rounded animate-pulse";
  })
}

function displayError(statusCode,statusMessage){
  loaderOff();
  uiHeaderOff();
  errImg.classList="err-img";
  errDetail.classList="err-detail text-white";
  errCode.innerHTML=statusCode;
  errMsg.innerHTML=statusMessage+".";
  if(statusCode<500){
    errSuggestion.classList="suggestion font-thin text-xl"
  }
}

async function getWeather(city,userLat,userLong){
  uiOff();
  uiHeaderOn();
  loaderOn();
  let response;
  if(city!==undefined){
    response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  }
  else{
    response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLong}&appid=${API_KEY}&units=metric`)
  }
  console.clear();
  let output=await response.json();

  let statusCode=output['cod'];
  let statusMessage="OK";
  if('message' in output){
    statusMessage=output['message'];
  }
  if(statusCode>=400){
    displayError(statusCode,statusMessage);
  }
  else{
    let timezone=output['timezone'];
    let weatherParam=output.weather[0]['main'];
    let weatherId=output.weather[0]['id'];
    let temp=output.main.temp;
    let pressure=output.main.pressure;
    let humidity=output.main.humidity;
    let visibility=output['visibility'];
    let windSpeed=output.wind.speed;
    let sunrise=output.sys.sunrise;
    let sunset=output.sys.sunset;
    let dayNight=output.weather[0]['icon'].substr(-1);
    let rain=-1;
    let snow=-1;
    let placeName=output['name'];
    let countryName='';
    if('country' in output.sys){
      countryName=output.sys.country;
    }
    if('rain' in output){
        rain=output.rain["1h"];
    }
    if('snow' in output){
        snow=output.snow["1h"];
    }
    loaderOff();
    uiOn();
    // updating ui
    disTemp.innerHTML=String(temp) + `<sup class="text-xl">&deg;C`;
    disParam.innerHTML=weatherParam;
    disPressure.innerHTML=pressure+" hPa";
    disHumidity.innerHTML=humidity+" %"
    disVisibilty.innerHTML=(visibility/1000) + " km"
    disWindSpeed.innerHTML=windSpeed+" m/s"
    if(countryName.length>0){
      disLoc.innerHTML=`<i class="fa-solid fa-location-dot"></i>
      <div class="loc-place">${placeName}, ${countryName}</div>`
    }
    else{
      disLoc.innerHTML=`<i class="fa-solid fa-location-dot"></i>
      <div class="loc-place">${placeName}</div>`
    }
    // getting time

    // sunrise and sunset
    let sunriseHrs=String(new Date((sunrise+timezone)*1000).getUTCHours());
    if(sunriseHrs.length==1) sunriseHrs='0'+sunriseHrs;
    let sunriseMins=String(new Date((sunrise+timezone)*1000).getUTCMinutes());
    if(sunriseMins.length==1) sunriseMins='0'+sunriseMins;
    let sunsetHrs=String(new Date((sunset+timezone)*1000).getUTCHours());
    if(sunsetHrs.length==1) sunsetHrs='0'+sunsetHrs;
    let sunsetMins=String(new Date((sunset+timezone)*1000).getUTCMinutes());
    if(sunsetMins.length==1) sunsetMins='0'+sunsetMins;

    disSunrise.innerHTML= sunriseHrs + ":" + sunriseMins;
    disSunset.innerHTML= sunsetHrs + ":" + sunsetMins;

    // setting cuurent time
    let milliTime=new Date().getTime()+timezone*1000;
    let currentHrs=String(new Date(milliTime).getUTCHours());
    if(currentHrs.length==1) currentHrs='0'+currentHrs;
    let currentMins=String(new Date(milliTime).getUTCMinutes());
    if(currentMins.length==1) currentMins='0'+currentMins;
    let currTime=currentHrs + ":" + currentMins;

    // setting current date
    let day=dayArr[new Date(milliTime).getUTCDay()];
    let month=monthArr[new Date(milliTime).getUTCMonth()];
    let date=new Date(milliTime).getUTCDate();
    let year=new Date(milliTime).getUTCFullYear();

    disDayTime.innerHTML=day + ", "+ currTime;
    disDate.innerHTML=month+" "+date+", "+year;
    // setting rain and snow
    if(rain!=-1) disRainSnow.innerHTML="Precipitation: "+rain+" mm";
    else if(snow!=-1) disRainSnow.innerHTML="Snowfall: "+snow+" mm";
    else disRainSnow.innerHTML="No Rain or Snow"

    // setting weather vector
    if(weatherId>=200 && weatherId<=232){
      weatherVector.setAttribute("src","./images/Thunderstorm.svg");
      weatherVector.setAttribute("alt","A vector image depicting a thunderstorm.");
    }
    else if(weatherId>=300 && weatherId<=321){
      weatherVector.setAttribute("src","./images/Drizzle.svg");
      weatherVector.setAttribute("alt","A vector image depicting a drizzle.");
    }
    else if(weatherId>=500 && weatherId<=531){
      weatherVector.setAttribute("src","./images/Rain.svg");
      weatherVector.setAttribute("alt","A vector image depicting Rainy weather.");
    }
    else if(weatherId>=600 && weatherId<=622){
      weatherVector.setAttribute("src","./images/Snow.svg");
      weatherVector.setAttribute("alt","A vector image depicting Snowy weather.");
    }
    else if(weatherId>=701 && weatherId<=781){
      weatherVector.setAttribute("src","./assets/fog.svg");
      weatherVector.setAttribute("alt","A vector image depicting haze or a fog.");
    }
    else if(weatherId==800){
      if(dayNight=='d'){
        weatherVector.setAttribute("src","./images/Sunny.svg");
        weatherVector.setAttribute("alt","A vector image depicting a Sunny weather.");
      }
      else{
        weatherVector.setAttribute("src","./images/Clear Night.svg");
        weatherVector.setAttribute("alt","A vector image depicting a clear night sky.");
      }
    }
    else if(weatherId>=801){
      weatherVector.setAttribute("src","./images/Cloudy.svg");
      weatherVector.setAttribute("alt","A vector image depicting a cloudy weather.");
    }
  }
}

function getLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      userLat=position.coords.latitude;
      userLong=position.coords.longitude;
      getWeather(undefined,userLat,userLong);
    },function(){
      getWeather("New Delhi");
      locationReq.innerHTML="Allow permission to access your location in order to get your weather.";
      locationReq.classList="location-request text-white font-thin mb-2 text-center w-[310px] xsm:w-[384px] sm:w-[631px] bg-highlight border-b-4 border-b-rose-600 scale-1 transition-all duration-1000";
      setTimeout(function(){
        locationReq.classList="location-request text-white font-thin mb-2 text-center w-[310px] xsm:w-[384px] sm:w-[631px] bg-highlight border-b-4 border-b-rose-600 scale-0 transition-all duration-1000"
      },3000);
    })
  } else { 
    getWeather("New Delhi");
    locationReq.innerHTML="Geolocation is not supported by this browser.";
    locationReq.classList="location-request text-white font-thin mb-2 text-center w-[310px] xsm:w-[384px] sm:w-[631px] bg-highlight border-b-4 border-b-rose-600 scale-1 transition-all duration-1000";
    setTimeout(function(){
      locationReq.classList="location-request text-white font-thin mb-2 text-center w-[310px] xsm:w-[384px] sm:w-[631px] bg-highlight border-b-4 border-b-rose-600 scale-0 transition-all duration-1000"
    },3000);
  }
}

search.addEventListener("keypress",function(event){
  if(event.key==="Enter"){
    let place=search.value;
    getWeather(place);
  }
})

searchBtn.addEventListener("click",function(){
  let place=search.value;
  getWeather(place);
})


getLocation();

