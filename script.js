const displayWeather = document.querySelector(".weather-data");

// Search area with textbox and button
$("#run-search").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#search-city").val();

    // API Key: 2aa88321525eb31701d7a4a3a6a53204
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=2aa88321525eb31701d7a4a3a6a53204";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
        });
});   

// let weatherDisplay = document.createElement("div");
// displayWeather.append(div);