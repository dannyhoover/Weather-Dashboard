const searchForm = $("#city-search-form");
const searchInput = $("#search-city");
const searchHistory = $("#search-history");
const weatherDisplay = $("#weather-display");

// Search area with textbox and button
searchForm.on("submit", function (event) {
    event.preventDefault();
    const cityName = $("#search-city").val();
    //localStorage.setItem(num, cityName);
    if (!cityName) return;

    displayCityWeather(cityName);
});

async function displayCityWeather(city) {
    const apiKey = "2aa88321525eb31701d7a4a3a6a53204";
    try {
        const responses = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&q=${city}`)
        ]);
        const [weather, forcast] = await Promise.all(responses.map(response => response.json()));
        console.log(weather, forcast);
        weatherDisplay.empty();

        displayHistory(weather.name);
        {
            const card = $("<div>").addClass("card").appendTo(weatherDisplay);
            const cardBody = $("<div>").addClass("card-body").appendTo(card);
            const cardTitle = $("<h2>").text(`${weather.name} (${moment().format("D/M/YYYY")})`);
            const weatherIcon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`)
            cardTitle.append(weatherIcon);
            const temperatureText = $("<p>").addClass("card-text").text(`Temperature: ${weather.main.temp}`);
            const humidityText = $("<p>").addClass("card-text").text(`Humidity: ${weather.main.humidity}`);
            const windText = $("<p>").addClass("card-text").text(`Wind Speed: ${weather.wind.speed}`);
            const uvText = $("<p>").addClass("card-text").text(`UV Index: ${weather.wind.speed}`);
            cardBody.append(cardTitle, temperatureText, humidityText, windText, uvText);
        }
    } catch (error) {
        console.error(error);
    }
}

function displayHistory(city) {
    searchHistory.empty();
    
    let historyStr = localStorage.getItem("search-history");
    let history;
    if (historyStr == null) {
        history = [];
    } else {
        history = JSON.parse(historyStr);
    }

    if (city) {
        history.unshift(city);
        history = [...new Set(history)];

        localStorage.setItem("search-history", JSON.stringify(history));
    }

    history.forEach(function(city) {
        const listItem = $("<li>").addClass("list-group-item").text(city).appendTo(searchHistory);
        listItem.click(function() {
            displayCityWeather(city);
        });
    })
}

function getWeatherEmoji(weatherID) {

    const thunderstorm = "\u{1F4A8}"
    const drizzle = "\u{1F4A7}"
    const rain = "\u{02614}"
    const snowflake = "\u{02744}"
    const snowman = "\u{026C4}"
    const atmosphere = "\u{1F301}"
    const clearSky = "\u{02600}"
    const fewClouds = "\u{026C5}"
    const clouds = "\u{02601}"
    const hot = "\u{1F525}"
    const defaultEmoji = "\u{1F300}"

    if (weatherID = weatherID.to_s) {
        if (weatherID.chars.first == '2' || weatherID == '900' || weatherID == '901' || weatherID == '902' || weatherID == '905')
            return thunderstorm;
        else if (weatherID.charAt(0) == '3')
            return drizzle;
        else if (weatherID.charAt(0) == '5')
            return rain;
        else if (weatherID.charAt(0) == '6' || weatherID == '903' || weatherID == '906')
            return snowflake + ' ' + snowman;
        else if (weatherID.charAt(0) == '7')
            return atmosphere;
        else if (weatherID == '800')
            return clearSky;
        else if (weatherID == '801')
            return fewClouds;
        else if (weatherID == '802' || weatherID == '803' || weatherID == '803')
            return clouds;
        else if (weatherID == '904')
            return hot;
        else return defaultEmoji;
    }
    else return defaultEmoji;
}

displayHistory();