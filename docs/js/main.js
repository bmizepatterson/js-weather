/**
 * GLOBALS
 */
// API Key for openweathermap.org
let appid = 'e2e7e118179179482d6587de5dda7307'; // API Request object

let apiRequest = new XMLHttpRequest(); // div tag where API response data will go

let output = document.getElementById('output'); // div tag where error messages will go

let error = document.getElementById('error');

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    document.getElementById('weatherButton').onclick = getWeather;
  }
};

function getWeather() {
  // Base API url
  let url = 'http://api.openweathermap.org/data/2.5/weather?'; // Zip code/city input element

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

function onError(msg = null) {
  if (apiRequest.responseText) {
    msg = JSON.parse(apiRequest.responseText).message;
  } else if (msg == null) {
    // General error message if no other is provided.
    msg = "An error has occurred. Please try again.";
  } // Update the text inside error


  document.querySelector('#error div').innerHTML = msg; // Turn "off" output

  output.style.display = 'none'; // Turn "on" error

  error.style.display = 'block';
}

function onSuccess() {
  if (apiRequest.status == "200") {
    let response = JSON.parse(apiRequest.responseText);
    let output_city = document.getElementById('output-city');
    let output_condition = document.getElementById('output-condition');
    let output_c = document.getElementById('output-c');
    let output_f = document.getElementById('output-f');
    let output_k = document.getElementById('output-k');
    let output_image = document.getElementById('output-image');
    output_city.innerHTML = response.name;
    output_condition.innerHTML = response.weather[0].description;
    output_k.innerHTML = Math.round(response.main.temp) + ' K';
    output_c.innerHTML = Math.round(KtoC(response.main.temp)) + ' C';
    output_f.innerHTML = Math.round(KtoF(response.main.temp)) + ' F';
    output_image.src = decideImage(response.main.temp); // TODO: ADD the following:
    //  - response.clouds
    //  - response.coords
    //  - response.main.humidity
    //  - response.main.pressure
    //  - response.sys.sunrise
    //  - response.sys.sunset
    //  - response.visibility
    //  - response.wind.deg
    //  - response.wind.speed
    // Turn "off" error

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

function decideImage(tempK) {
  if (tempK > 294) {
    // HOT!
    return "https://i.ytimg.com/vi/PR2XYraqyqs/maxresdefault.jpg";
  } else if (tempK < 285) {
    // COLD!
    return "https://i.ytimg.com/vi/YH4Xr6GIp4U/maxresdefault.jpg";
  }

  return "https://i.ytimg.com/vi/LML6SoNE7xE/hqdefault.jpg";
}