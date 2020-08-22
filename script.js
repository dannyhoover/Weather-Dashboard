// setting of variables
const searchForm = $("#city-search-form");
const searchInput = $("#search-city");
const searchHistory = $("#search-history");
const weatherDisplay = $(".weather-data");
const forecastDisplay = $(".forecast-data");

// Search area with textbox and button
searchForm.on("submit", function (event) {
    event.preventDefault();
    const cityName = $("#search-city").val();
    if (!cityName) return;

    displayCityWeather(cityName);
});

// async function that displays the current city weather items
async function displayCityWeather(city) {
    const apiKey = "2aa88321525eb31701d7a4a3a6a53204";
    var lat = 37.75;
    var lon = -122.37;
    // call for responses of weather and forecast api's
    try {
        const responses = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&q=${city}`),
            fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`)
        ]);
        const [weather, forecast, uvindex] = await Promise.all(responses.map(response => response.json()));
        console.log(weather, forecast, uvindex);
        weatherDisplay.empty();
        forecastDisplay.empty();

        // dynamically creating card contents
        displayHistory(weather.name);
        {
            const card = $("<div>").addClass("card").appendTo(weatherDisplay);
            const cardBody = $("<div>").addClass("card-body").appendTo(card);
            const cardTitle = $("<h2>").text(`${weather.name} (${moment().format("M/D/YYYY")})`);
            const weatherIcon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`)
            cardTitle.append(weatherIcon);
            const temperatureText = $("<p>").addClass("card-text").text(`Temperature: ${weather.main.temp} kelvin`);
            const humidityText = $("<p>").addClass("card-text").text(`Humidity: ${weather.main.humidity}`);
            const windText = $("<p>").addClass("card-text").text(`Wind Speed: ${weather.wind.speed}`);
            const uvText = $("<p>").addClass("card-text").text(`UV Index: ${uvindex.value}`);
            cardBody.append(cardTitle, temperatureText, humidityText, windText, uvText);

            for (let index = 7; index <= 11; index++) {
                const forecastItem = $("<div>").addClass("#card text-white bg-primary mb-3").appendTo(forecastDisplay);
                const forecastBody = $("<div>").addClass("#forecast-card-body").appendTo(forecastItem);
                const forecastTitle = $("<p>").text(`Date: ${forecast.list[index].dt_txt}`);
                const forecastLogo = $("<img>").attr("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);
                const fortempText = $("<p>").text(`Temp: ${forecast.list[index].main.temp_max} kelvin`);
                const forehumText = $("<p>").text(`Humidity: ${forecast.list[index].main.humidity}`);

                forecastBody.append(forecastTitle, forecastLogo, fortempText, forehumText);
                
            }
        }

    // error checks
    } catch (error) {
        console.error(error);
    }
}

// function to store history and create functioning weather buttons for them
function displayHistory(city) {
    // check to see if history is empty and put the names of cities in an array
    searchHistory.empty();
    let historyStr = localStorage.getItem("search-history");
    let history;
    if (historyStr == null) {
        history = [];
    } else {
        history = JSON.parse(historyStr);
    }
    
    // sets most recent city to the top of the list
    if (city) {
        history.unshift(city);
        history = [...new Set(history)];

        localStorage.setItem("search-history", JSON.stringify(history));
    }

    // append new button of city name
    history.forEach(function(city) {
        const listItem = $("<li>").addClass("list-group-item").text(city).appendTo(searchHistory);
        listItem.click(function() {
            displayCityWeather(city);
        });
    })
}

displayHistory();