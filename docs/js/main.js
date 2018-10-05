/**
 * GLOBALS
 */
// API Key for openweathermap.org
let appid = 'e2e7e118179179482d6587de5dda7307'; // API Request object

let apiRequest = new XMLHttpRequest(); // div tag where API response data will go

let output = document.getElementById('output'); // div tag where error messages will go

let error = document.getElementById('error'); // iframe for Google map

let map = document.getElementById('map');

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    document.getElementById('weatherButton').onclick = getWeather;
  }
};

function getWeather() {
  // Base API url
  let url = 'https://api.openweathermap.org/data/2.5/weather?'; // Zip code/city input element

  let location = document.getElementById('locationInput'); // Determine search mode: either zip code or city name

  if (isZipCode(location.value)) {
    url += 'zip=' + location.value;
  } else {
    url += 'q=' + location.value;
  } // Append country code


  url += ',us'; // Append API key

  url += '&appid=' + appid; // Fetch from the url

  apiRequest.onload = onSuccess;
  apiRequest.onerror = onError;
  apiRequest.open('get', url, true);
  apiRequest.send();
}

function onError() {
  msg = "An error has occurred. Please try again.";

  if (apiRequest.responseText) {
    msg = JSON.parse(apiRequest.responseText).message;
  } // Update the text inside error


  document.querySelector('#error div').innerHTML = msg; // Turn "off" output

  output.style.display = 'none'; // Turn "on" error

  error.style.display = 'block';
}

function onSuccess() {
  if (apiRequest.status == "200") {
    let response = JSON.parse(apiRequest.responseText);
    console.log(response);
    let output_city = document.getElementById('output-city');
    let output_condition = document.getElementById('output-condition');
    let output_c = document.getElementById('output-c');
    let output_f = document.getElementById('output-f');
    let output_lat = document.getElementById('output-lat');
    let output_lon = document.getElementById('output-lon');
    let output_hum = document.getElementById('output-hum');
    let output_pres = document.getElementById('output-pres');
    let output_rise = document.getElementById('output-rise');
    let output_set = document.getElementById('output-set');
    output_city.innerHTML = response.name;
    output_condition.innerHTML = response.weather[0].description;
    output_c.innerHTML = '(' + Math.round(KtoC(response.main.temp)) + '&deg; C)';
    output_f.innerHTML = Math.round(KtoF(response.main.temp)) + '&deg; F';
    output_lat.innerHTML = response.coord.lat;
    output_lon.innerHTML = response.coord.lon;
    output_hum = response.main.humidity + '%';
    output_pres = response.main.pressure + 'hPa';
    let sunrise = new Date(response.sys.sunrise * 1000);
    output_rise.innerHTML = sunrise.getHours() + ':' + sunrise.getMinutes();
    let sunset = new Date(response.sys.sunset * 1000);
    output_set.innerHTML = sunset.getHours() + ':' + sunset.getMinutes(); // Set map iframe source

    map.src = "https://www.google.com/maps/embed/v1/view?key=AIzaSyBqotwxy9_ElElXn264jaUZ79v9se_Tsak&center=" + response.coord.lat + ',' + response.coord.lon + '&zoom=10'; // Turn "off" error

    error.style.display = 'none'; // Turn "on" output

    output.style.display = 'block';
  } else {
    onError();
  }
}

function isZipCode(string) {
  return /^\d{5}$/.test(string);
}

function KtoC(tempK) {
  return tempK - 273.15;
}

function KtoF(tempK) {
  return tempK * 9 / 5 - 459.67;
}