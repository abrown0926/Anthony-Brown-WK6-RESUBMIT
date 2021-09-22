var apiKey = "4be75b4f9778d9b50343b7e55ba73803";

// Empty array to store cities
var searchedCities = [];

// using moment js to format date and set dates for five day forecast   
var currentDate = moment().format("MM/DD/YYYY");
var dateDay1 = moment(currentDate).add(1, 'days').format("MM/DD/YYYY");
var dateDay2 = moment(currentDate).add(2, 'days').format("MM/DD/YYYY");
var dateDay3 = moment(currentDate).add(3, 'days').format("MM/DD/YYYY");
var dateDay4 = moment(currentDate).add(4, 'days').format("MM/DD/YYYY");
var dateDay5 = moment(currentDate).add(5, 'days').format("MM/DD/YYYY");

addCityLocalStorage();

// Function to get city from local storage
function addCityLocalStorage() {
  var storedCities = JSON.parse(localStorage.getItem("City"));

  if (storedCities !== null) {
    searchedCities = storedCities
  }
  console.log(searchedCities)
}

// Storing cities in local storage
function storeCities() {
  localStorage.setItem("City", JSON.stringify(searchedCities));
}

// Function to retrieve forecast for the searched city
function retrieveForecast(city) {
  var currentWeatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  searchedCities.push(city)
  storeCities()

  // getting city name and data
  fetch(currentWeatherRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(".currentCity").text(`${city} (${currentDate})`);
      $(".fiveDayForecast").show();
      cityWeather(data)
      
      var latLonRequestUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`;
      console.log(latLonRequestUrl)

      fetch(latLonRequestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (uvData) {
          $("#uviCurrentCity").text("UV Index: " + uvData.value);
          if (uvData.value <= 2) {
            $("#uviCurrentCity").css("color", "green")
          } else if(uvData.value <= 5) {
            $("#uviCurrentCity").css("color", "yellow")
          } else if (uvData.value <= 7) {
            $("#uviCurrentCity").css("color", "orange")
          } else if (uvData.value <= 10) {
            $("#uviCurrentCity").css("color", "red") 
          } else if (uvData.value > 10) {
            $("#uviCurrentCity").css("color", "purple")
          }
          
        });
    });

  // current day weather function
  function cityWeather(data) {
    $("#currentWeatherCard").show();
    $("#imageCurrentCity").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    $("#tempCurrentCity").text("Temperature: " + " " + data.main.temp + "\u00B0F");
    $("#humidityCurrentCity").text("Humidity: " + " " + data.main.humidity + "%");
    $("#windspeedCurrentCity").text("Wind: " + " " + data.wind.speed + " MPH");
  }

  // Five Day Weather fetch
  var fiveDayForecastRequestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

fetch(fiveDayForecastRequestUrl)
.then(function (response) {
  return response.json();

}).then(function (response) {
  
  // setting dates five day forecast
  $("#cityDay1").text(`${dateDay1}`);
  $("#cityDay2").text(`${dateDay2}`);
  $("#cityDay3").text(`${dateDay3}`);
  $("#cityDay4").text(`${dateDay4}`);
  $("#cityDay5").text(`${dateDay5}`);

  $("#imageDay1").attr("src", `http://openweathermap.org/img/wn/${response.list[2].weather[0].icon}@2x.png`);
  $("#imageDay2").attr("src", `http://openweathermap.org/img/wn/${response.list[10].weather[0].icon}@2x.png`);
  $("#imageDay3").attr("src", `http://openweathermap.org/img/wn/${response.list[18].weather[0].icon}@2x.png`);
  $("#imageDay4").attr("src", `http://openweathermap.org/img/wn/${response.list[26].weather[0].icon}@2x.png`);
  $("#imageDay5").attr("src", `http://openweathermap.org/img/wn/${response.list[34].weather[0].icon}@2x.png`);    

  $("#fiveDayTemp1").text("Temperature: " + " " + response.list[2].main.temp + "\u00B0F");
  $("#fiveDayTemp2").text("Temperature: " + " " + response.list[10].main.temp + "\u00B0F");
  $("#fiveDayTemp3").text("Temperature: " + " " + response.list[18].main.temp + "\u00B0F");
  $("#fiveDayTemp4").text("Temperature: " + " " + response.list[26].main.temp + "\u00B0F");    
  $("#fiveDayTemp5").text("Temperature: " + " " + response.list[34].main.temp + "\u00B0F");

  $("#fiveDayWindSpeed1").text("Wind: " + " " + response.list[2].wind.speed + " MPH");
  $("#fiveDayWindSpeed2").text("Wind: " + " " + response.list[10].wind.speed + " MPH");
  $("#fiveDayWindSpeed3").text("Wind: " + " " + response.list[18].wind.speed + " MPH");
  $("#fiveDayWindSpeed4").text("Wind: " + " " + response.list[26].wind.speed + " MPH");
  $("#fiveDayWindSpeed5").text("Wind: " + " " + response.list[34].wind.speed + " MPH");

  $("#fiveDayHumidity1").text("Humidity: " + " " + response.list[2].main.humidity + "%");
  $("#fiveDayHumidity2").text("Humidity: " + " " + response.list[10].main.humidity + "%");
  $("#fiveDayHumidity3").text("Humidity: " + " " + response.list[18].main.humidity + "%");
  $("#fiveDayHumidity4").text("Humidity: " + " " + response.list[26].main.humidity + "%");
  $("#fiveDayHumidity5").text("Humidity: " + " " + response.list[34].main.humidity + "%");

})  
}

searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  var city = $("#citySearch").val().trim();
  retrieveForecast(city);
  $("#citySearch").val("");
  createCityButtons();
  storeCities();

})

function createCityButtons() {

  $("#cities-searched").empty();

  // Looping through the array of cities to create buttons
  for (var i = 0; i < searchedCities.length; i++) {

    var cityBtn = $("<button>");

    cityBtn.addClass("btn btn-outline-secondary cityBtn");

    cityBtn.attr("data-city", searchedCities[i]);

    cityBtn.text(searchedCities[i]);

    $("#cities-searched").append(cityBtn);
  }
}

createCityButtons()

function renderCityFromButton(city) {

  city = $(this).attr("data-city");

  retrieveForecast(city)
}

$(document).on("click", ".cityBtn", renderCityFromButton);


// hiding city search results until after city is searched
$(document).ready(function () {
  $("#currentWeatherCard").hide();
});

$(document).ready(function () {
  $(".fiveDayForecast").hide();
});