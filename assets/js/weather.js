// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector('.weatherIcon');
const tempElement = document.querySelector('.weatherValue p');
const descElement = document.querySelector('.weatherDescription p');

const weather = {};
weather.temperature = {
	unit: 'celsius',
};
weather.conditions = {
    "☁️": "03d",
    "🌫": "50d",
    "🌧": "09d",
    "❄️": "13d",
    "🌦": "10d",
    "⛅️": "02d",
    "☀️": "01d",
    "🌩": "11d",
    "⛈": "11d",
    "🌨": "13d",
}

var tempUnit = CONFIG.weatherUnit;

const KELVIN = 273.15;
const key = `${CONFIG.weatherKey}`;
setPosition();

function setPosition(position) {
	if (!CONFIG.trackLocation || !navigator.geolocation) {
		if (CONFIG.trackLocation) {
			console.error('Geolocation not available');
		}
		getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		return;
	}
	navigator.geolocation.getCurrentPosition(
		pos => {
			getWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3));
		},
		err => {
			console.error(err);
			getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		}
	);
}

function getWeather(latitude, longitude) {
    let api = `https://wttr.in/${latitude},${longitude}?format=%c|%C|%t`;
    fetch(api)
        .then(response => response.text())
        .then(data => {
            const [emoji, condition, temperature] = data.split('|');
            weather.temperature.value = parseFloat(temperature.replace('°', ''));
            weather.description = condition;
            weather.iconId =  weather.conditions[emoji.trim()] || 'unknown';
        })
        .then(() => {
            displayWeather();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayWeather() {
	iconElement.innerHTML = `<img src="assets/icons/${CONFIG.weatherIcons}/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
	descElement.innerHTML = weather.description;
}
