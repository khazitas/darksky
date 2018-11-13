// convert degrees to celsius
function fToC(fahrenheit) {
	var fTemp  = fahrenheit,
			fToCel = (fTemp - 32) * 5 / 9;

	return fToCel;
}

function weatherReport(latitude, longitude) {
	var apiKey       = '8b388d33442c6bce87cb305a92ee3279',
		url          = 'https://api.darksky.net/forecast/',
		lati         = latitude,
		longi        = longitude,
		api_call     = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

	var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	var sunday    = [],
		monday    = [],
		tuesday   = [],
		wednesday = [],
		thursday  = [],
		friday    = [],
		saturday  = [];

	var isCelsiusChecked = $('#celsius:checked').length > 0;

	$.getJSON(api_call, function(forecast) {
		for(var j = 0, k = forecast.hourly.data.length; j < k; j++) {
			var hourly_date    = new Date(forecast.hourly.data[j].time * 1000),
				hourly_day     = days[hourly_date.getDay()],
				hourly_temp    = forecast.hourly.data[j].temperature;

			if(isCelsiusChecked) {
				hourly_temp = fToC(hourly_temp);
				hourly_temp = Math.round((hourly_temp));
			}

			switch(hourly_day) {
				case 'Sunday':
					sunday.push(hourly_temp);
					break;
				case 'Monday':
					monday.push(hourly_temp);
					break;
				case 'Tuesday':
					tuesday.push(hourly_temp);
					break;
				case 'Wednesday':
					wednesday.push(hourly_temp);
					break;
				case 'Thursday':
					thursday.push(hourly_temp);
					break;
				case 'Friday':
					friday.push(hourly_temp);
					break;
				case 'Saturday':
					saturday.push(hourly_temp);
					break;
				default: console.log(hourly_date.toLocaleTimeString());
					break;
			}
		}

		for(var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {

			var date     = new Date(forecast.daily.data[i].time * 1000),
					day      = days[date.getDay()],
					time     = forecast.daily.data[i].time,
					humidity = forecast.daily.data[i].humidity,
					summary  = forecast.daily.data[i].summary,
					temp    = Math.round(forecast.hourly.data[i].temperature),
					tempMax = Math.round(forecast.daily.data[i].temperatureMax);

			if(isCelsiusChecked) {
				temp    = fToC(temp);
				tempMax = fToC(tempMax);
				temp = Math.round(temp);
				tempMax = Math.round(tempMax);
			}

			$("#forecast").append(
				'<div class="col-md-3 w-col bg-light">' +
					"<p><b>Day</b>: " + date.toLocaleDateString() +
					"</p><p><b>Temperature</b>: " + temp +
					"</p><p><b>Max Temp.</b>: " + tempMax +
					"</p><p><b>Humidity</b>: " + humidity +
					'<p class="summary">' + summary + '</p>' +
					'</div>'
			);
		}
	});
}

// Get Weather Button Event
$('button').on('click', function(e) {
	var lat       = $('#latitude').val(),
		long      = $('#longitude').val(),
		city_name = $('#city-search').val()

	if(lat && long !== '') {
		e.preventDefault();

		$('#logo').fadeOut(100);

		$('.form').fadeOut(100, function() {
			weatherReport(lat, long);
			$('body').append('<div class="container bg-col"><h3 class="city"> of ' + city_name + '</h3><div class="row justify-content-center" id="forecast"></div><button class="btn btn-primary" id="back">New Forecast</button></div>');
		});
	}
});

// New Forecast button
$('body').on('click', '#back', function() {
	window.location.reload(true);
})

function insertGoogleScript() {
	var google_api = document.createElement('script'),
		api_key    = 'AIzaSyAKU2uYeO7anrVlEBor02eW4HRJdybTX7o';
	google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
	document.body.appendChild(google_api);
}

// SearchBox Method
function initGoogleAPI() {
	var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search"));

	autocomplete.addListener('places_changed', function() {
		var place = autocomplete.getPlaces()[0];
		document.querySelector("#latitude").value = place.geometry.location.lat();
		document.querySelector("#longitude").value = place.geometry.location.lng();
	});
}

insertGoogleScript();
