function formatWeekDay(date) {
  let weekDays = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat", "Sun"];
  let day = weekDays[date.getDay()];
  return day;
}
function displayDate(currentDayTime) {
  currentDayTime.preventDefault;
  let outputDay = formatWeekDay(currentDayTime);
  let displayDay = document.querySelector("#week-day");
  displayDay.innerHTML = `${outputDay}`;
}
function formatTime(date) {
  let hour = date.getHours();
  hour = hour.toString();
  if (hour.length < 2) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  minute = minute.toString();
  if (minute.length < 2) {
    minute = `0${minute}`;
  }
  let currentTime = `${hour}:${minute}`;
  return currentTime;
}
function displayTime(currentDayTime) {
  currentDayTime.preventDefault;
  let outputTime = formatTime(currentDayTime);
  let displayTime = document.querySelector("#time");
  displayTime.innerHTML = `${outputTime}`;
}

function displayData(target, data) {
  let pageLocation = document.querySelector(target);
  pageLocation.innerHTML = `${data}`;
}

function getForecastIcon(response, arrayNumber) {
  let icon = response.data.daily[arrayNumber].weather[0].icon;
  icon = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  icon = `<img src="${icon}">`;
  let target = `#day-${arrayNumber}-icon`;
  displayData(target, icon);
}

function getForecastTemp(response, arrayNumber) {
  let temp = Math.round(response.data.daily[arrayNumber].temp.day);
  let target = `#day-${arrayNumber}-temp`;
  displayData(target, temp);
}

function getWeekDay(response, arrayNumber) {
  let day = response.data.daily[arrayNumber].dt;
  day = day * 1000;
  day = new Date(day);
  day = formatWeekDay(day);
  let target = `#day-${arrayNumber}-day`;
  displayData(target, day);
}

function cleanForecast(response, arrayNumber) {
  getWeekDay(response, arrayNumber);
  getForecastTemp(response, arrayNumber);
  getForecastIcon(response, arrayNumber);
}

function displayForecast(response) {
  cleanForecast(response, 1);
  cleanForecast(response, 2);
  cleanForecast(response, 3);
  cleanForecast(response, 4);
  cleanForecast(response, 5);
}

function retrieveForecast(lat, long) {
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/onecall`;
  let apiKey = `4d9f7435922c572a5acb88548fb4b4d0`;
  let unit = `metric`;
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${long}&units=${unit}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function requestForecast(response) {
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  retrieveForecast(latitude, longitude);
}

function retrieveExtraData(response) {
  displayData("#windspeed", Math.round(response.data.wind.speed));
  displayData("#humidity", response.data.main.humidity);
}

function cleanSun(target, sun) {
  sun = sun * 1000;
  sun = new Date(sun);
  sun = formatTime(sun);
  displayData(target, sun);
}
function retrieveSunRiseSet(response) {
  cleanSun("#sunrise", response.data.sys.sunrise);
  cleanSun("#sunset", response.data.sys.sunset);
}

function retrieveIcon(response) {
  let currentIcon = response.data.weather[0].icon;
  currentIcon = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
  currentIcon = `<img src="${currentIcon}">`;
  displayData("#current-icon", currentIcon);
}

function retrieveTemp(response) {
  displayData("#current-temp", Math.round(response.data.main.temp));
  displayData("#current-min", Math.round(response.data.main.temp_min));
  displayData("#current-max", Math.round(response.data.main.temp_max));
}

/*function retrieveName(response) {
  let currentCity = response.data.name;
  let target = "#display-city";
  displayData(target, currentCity);
}*/

function cleanData(response) {
  displayData("#display-city", response.data.name);
  retrieveIcon(response);
  retrieveTemp(response);
  retrieveExtraData(response);
  retrieveSunRiseSet(response);
  requestForecast(response);
}

function requestCityData(outputCity) {
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiKey = `4d9f7435922c572a5acb88548fb4b4d0`;
  let unit = `metric`;
  let apiUrl = `${apiEndpoint}?q=${outputCity}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(cleanData);
}

function searchCity(event) {
  event.preventDefault();
  let userCity = document.querySelector("#city-search");
  userCity = userCity.value;
  requestCityData(userCity);
}

function requestLocationData(lat, long) {
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiKey = `4d9f7435922c572a5acb88548fb4b4d0`;
  let unit = `metric`;
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(cleanData);
}

function getLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  requestLocationData(lat, long);
}

function searchLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}

let currentDayTime = new Date();
displayDate(currentDayTime);
displayTime(currentDayTime);

requestCityData("London");

let submitCity = document.querySelector("#search-bar");
submitCity.addEventListener("submit", searchCity);

let useLocation = document.querySelector("#location-button");
useLocation.addEventListener("click", searchLocation);
