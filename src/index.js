function formatDate(date) {
  let weekDays = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat", "Sun"];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = weekDays[date.getDay()];
  let currentdate = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  currentDate = `${day}, ${month} ${currentdate} ${year}`;
  return currentDate;
}
function formatWeekDay(date) {
  let weekDays = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat", "Sun"];
  let day = weekDays[date.getDay()];
  return day;
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

function displayData(target, data) {
  let pageLocation = document.querySelector(target);
  pageLocation.innerHTML = `${data}`;
}

function getForecastIcon(response, arrayNumber) {
  let icon = response.data.daily[arrayNumber].weather[0].icon;
  icon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  icon = `<img src="${icon}">`;
  let target = `#day-${arrayNumber}-icon`;
  displayData(target, icon);
}
function getForecastTemp(response, arrayNumber) {
  let temp = Math.round(response.data.daily[arrayNumber].temp.day);
  let target = `#day-${arrayNumber}-temp`;
  displayData(target, `${temp}°`);
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
  let arrayNumbers = [1, 2, 3, 4, 5, 6];
  let forecastHTML = "";
  arrayNumbers.forEach(function (arrayNumber) {
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
                  <div
                    class="row five-day forecast-weekday"
                    id="day-${arrayNumber}-day"
                  ></div>
                  <div class="row five-day" id="day-${arrayNumber}-temp"></div>
                  <div class="row five-day" id="day-${arrayNumber}-icon">
                    <img src="#" alt="" class="forecast-icon" />
                  </div>
                </div>`;
  });
  displayData("#five-day-results", forecastHTML);

  arrayNumbers.forEach(function (arrayNumber) {
    cleanForecast(response, arrayNumber);
  });
}
function retrieveForecast(response) {
  let lat = response.data.coord.lat;
  let long = response.data.coord.lon;
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/onecall`;
  let apiKey = `4d9f7435922c572a5acb88548fb4b4d0`;
  let unit = `metric`;
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${long}&units=${unit}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function retrieveExtraData(response) {
  displayData("#windspeed", Math.round(response.data.wind.speed));
  displayData("#humidity", response.data.main.humidity);
}
function cleanSun(target, sun) {
  sun = sun * 1000;
  sun = new Date(sun);
  sun = formatTime(sun);
  displayData(target, ` ${sun} `);
}
function retrieveSunRiseSet(response) {
  cleanSun("#sunrise", response.data.sys.sunrise);
  cleanSun("#sunset", response.data.sys.sunset);
}

function retrieveIcon(response) {
  let currentIcon = response.data.weather[0].icon;
  currentIcon = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`;
  currentIcon = `<img src="${currentIcon}">`;
  displayData("#current-icon", currentIcon);
}
function retrieveTemp(response) {
  displayData("#current-temp", Math.round(response.data.main.temp));
  displayData("#current-min", `${Math.round(response.data.main.temp_min)}°`);
  displayData("#current-max", `${Math.round(response.data.main.temp_max)}°`);
}
function retrieveLastUpdate(response) {
  let lastUpdate = new Date(response.data.dt * 1000);
  let currentTime = `Last updated ${formatTime(lastUpdate)}`;
  let currentDate = `${formatDate(lastUpdate)}`;
  displayData("#time", currentTime);
  displayData("#date", currentDate);
}

function cleanData(response) {
  celsiusTemp = Math.round(response.data.main.temp);
  displayData("#current-temp", celsiusTemp);
  minCelsius = Math.round(response.data.main.temp_min);
  displayData("#current-min", `${minCelsius}°`);
  maxCelsius = Math.round(response.data.main.temp_max);
  displayData("#current-max", `${maxCelsius}°`);
  displayData("#display-city", response.data.name);
  retrieveLastUpdate(response);
  retrieveIcon(response);
  retrieveExtraData(response);
  retrieveSunRiseSet(response);
  retrieveForecast(response);
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

function requestLocationData(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiKey = `4d9f7435922c572a5acb88548fb4b4d0`;
  let unit = `metric`;
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(cleanData);
}
function searchLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(requestLocationData);
}

function switchFahrenheit(event) {
  let fahrenheitTemp = Math.round(celsiusTemp * (9 / 5) + 32);
  displayData("#current-temp", fahrenheitTemp);
  let fahrenheitMin = Math.round(minCelsius * (9 / 5) + 32);
  displayData("#current-min", `${fahrenheitMin}°`);
  let fahrenheitMax = Math.round(maxCelsius * (9 / 5) + 32);
  displayData("#current-max", `${fahrenheitMax}°`);
  let turnOffCelsius = document.querySelector(".celsius-select");
  turnOffCelsius.classList.remove("active");
  let turnOnFahrenheit = document.querySelector(".fahrenheit-select");
  turnOnFahrenheit.classList.add("active");
}

function switchCelsius(event) {
  displayData("#current-temp", celsiusTemp);
  displayData("#current-min", `${minCelsius}°`);
  displayData("#current-max", `${maxCelsius}°`);
  let turnOffFahrenheit = document.querySelector(".fahrenheit-select");
  turnOffFahrenheit.classList.remove("active");
  let turnOnCelsius = document.querySelector(".celsius-select");
  turnOnCelsius.classList.add("active");
}

let celsiusTemp = null;
let minCelsius = null;
let maxCelsius = null;

let submitCity = document.querySelector("#search-bar");
submitCity.addEventListener("submit", searchCity);

let useLocation = document.querySelector("#location-button");
useLocation.addEventListener("click", searchLocation);

let unitFahrenheit = document.querySelector("#fahrenheit-select");
unitFahrenheit.addEventListener("click", switchFahrenheit);

let unitCelsius = document.querySelector("#celsius-select");
unitCelsius.addEventListener("click", switchCelsius);

requestCityData("London");
