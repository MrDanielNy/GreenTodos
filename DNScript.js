//Used for testing some functions

var debugLocation;

let apiKey = function () {
    let serviceName = "";
    let apiKeyForService = "";
}

//Systemwide code
var SystemWide = (function () {

    let globalGoogleKey = new apiKey();
    let globalWeatherKey = new apiKey();

    function init() {
        globalGoogleKey.serviceName = "Google";
        globalWeatherKey.serviceName = "WeatherMap"
        getInfoFromDB();

        const getWeatherButton = document.getElementById("button-get-weather");
        getWeatherButton.addEventListener("click", function () {
            Weather.getWeatherData(globalWeatherKey)
        });
    }

    function getInfoFromDB() {
        const ajax = new XMLHttpRequest();
        const method = "GET";
        const url = "http://dnmapps.se/test.php";
        const async = true;


        //When we have received a respnse
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //Parseit as json
                const apiKeys = JSON.parse(this.response);

                //Go through each of them and assign keys to their variable
                for (let i = 0; i < apiKeys.length; i++) {
                    if (apiKeys[i].servicename.toLowerCase() == "google") {
                        globalGoogleKey.serviceName = apiKeys[i].servicename;
                        globalGoogleKey.apiKeyForService = apiKeys[i].apikey;


                        var input = document.getElementById('input-place');
                        var options = {
                            types: ['geocode']
                        };
                        debugLocation = google;
                        var autoComplete = new google.maps.places.Autocomplete(input, options);
                        autoComplete.addListener("place_changed", function () {
                            Weather.setWeatherData(autoComplete);
                        });


                    } else if (apiKeys[i].servicename.toLowerCase() == "weathermap") {
                        globalWeatherKey.apiKeyForService = apiKeys[i].apikey;
                    }
                }
            }
        }

        //Send our request to the server.
        ajax.open(method, url, async);
        ajax.send();
    }
    return {
        init //init is the only method we need access to.
    }
})();

//1. Wheather information using JSON api

var Weather = (function () {
    let autoComplete; //The Google api for autocomplete in input.

    //When we have chosen a place, save it to gloval variable
    function setWeatherData(newAutoComplete) {
        autoComplete = newAutoComplete;
    }


    //Get weather data from openweather.org in JSON format
    function getWeatherData(newWeatherKey) {
        //The first thing we do is that we hide the flag component just in case we dont have a flag
        let flagContainer = document.getElementById("flag-container");
        flagContainer.hidden = true;

        //Start with retreaving an actual place in the world
        let place = autoComplete.getPlace();

        //If we can't get a place, just exit
        if (!place.place_id) {
            return;
        }

        //Set a geocoder object.
        let geocoder = new google.maps.Geocoder;

        //Using the geocode, retreive the current location (place) in the world
        geocoder.geocode({ 'placeId': place.place_id }, function (results, status) {
            if (status != "OK") { //if status failed, exit with a message
                window.alert("Geocoder failed due to: " + status);
                return;
            }

            //Decode the data needed
            let storableLocation = {}; //Used to store data to display

            for (var i = 0; i < results[0].address_components.length; i++) {
                let component = results[0].address_components[i];

                if (component.types.includes('sublocality') || component.types.includes('locality')) {
                    storableLocation.city = component.long_name;
                }
                else if (component.types.includes('administrative_area_level_1')) {
                    storableLocation.state = component.short_name;
                }
                else if (component.types.includes('country')) {
                    storableLocation.country = component.long_name;
                    storableLocation.registered_country_iso_code = component.short_name;
                }

            }
            //Fill in the labels with data
            showWeatherData(storableLocation.city, storableLocation.registered_country_iso_code, newWeatherKey);

        })
    }

    function showWeatherData(chosenCity, countryCode, newWeatherKey) {
        let weatherLink = "https://api.openweathermap.org/data/2.5/weather?q=" + chosenCity + "," + countryCode + "&APPID=" + newWeatherKey.apiKeyForService;

        let xmlhttp = new XMLHttpRequest();
        let weatherObj;
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) { //When we got the data
                weatherObj = JSON.parse(this.responseText);

                //Show location name
                const currentCityLabel = document.getElementById("wb-data-city");
                currentCityLabel.innerText = String(chosenCity);

                //Show current temperature
                const tempCurrentLabel = document.getElementById("wb-data-temp-current");
                tempCurrentLabel.innerText = fromKelvinToCelsius(weatherObj.main.temp);


                //Show Min temperature
                const tempMinLabel = document.getElementById("wb-data-temp-low");
                tempMinLabel.innerText = fromKelvinToCelsius(weatherObj.main.temp_min);

                //Show Max temperature
                const tempMaxLabel = document.getElementById("wb-data-temp-high");
                tempMaxLabel.innerText = fromKelvinToCelsius(weatherObj.main.temp_max);

                //Show wind speed
                const windLabel = document.getElementById("wb-data-wind");
                windLabel.innerText = weatherObj.wind.speed;

                //Show weather description
                const weatherDescriptionLabel = document.getElementById("wb-data-weather");
                weatherDescriptionLabel.innerText = String(weatherObj.weather[0].description).toUpperCase();

                //Check for flags
                showCountryFlag(countryCode);

                //Handle a rainy day
                handleRain(weatherObj.weather[0].description);
            }
        };
        xmlhttp.open("GET", weatherLink, true);
        xmlhttp.send();
    }

    //Check to see if its raining
    function handleRain(theStringToCheck) {
        const goOutsideAnswer = document.getElementById("is-it-ok-to-go-outuside-answer");
        if (String(theStringToCheck).toLowerCase().includes("rain")) {
            goOutsideAnswer.innerHTML = "Dont go outside"
        } else {
            goOutsideAnswer.innerHTML = "It's ok to go outside"
        }
    }

    //Check if we have a flag and then update/show it
    function showCountryFlag(countryCode) {
        //Get container
        const flagContainer = document.getElementById("flag-container");
        const flagLink = "https://www.countryflags.io/" + countryCode + "/flat/64.png"

        //Check if flag is available
        let flagImage = new Image();
        flagImage.onload = function () {
            //Assign to id
            flagContainer.src = flagImage.src;

            //"unhide it"
            if (flagImage.src != null || flagImage.src != undefined) {
                flagContainer.hidden = false;
            } else {
                alert("Failed to load flag on address:" + flagLink);
            }
        }
        flagImage.src = flagLink;
    }

    //Convert from kevling to celsius
    function fromKelvinToCelsius(kelvinvalue) {
        return Math.floor(kelvinvalue - 273.15);
    }

    return {
        setWeatherData,
        getWeatherData
    }
})();

window.addEventListener("DOMContentLoaded", SystemWide.init);


