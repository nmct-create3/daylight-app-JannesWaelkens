// _ = helper functions
let html, domHorizonLine, domLocation,htmlLocation;
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

const goSun = function(sun, total, now, interval) {
	if (up < total) {
	  up = up + 1;
	  // console.log(up);
	  now.setMinutes(now.getMinutes() + 1);
	  let procent = (up / total) * 100;
	  sun.dataset.time = `${now.getHours()}:${now.getMinutes()}`;
	  sun.style.left = procent + '%';
	  if (procent < 50) {
		sun.style.bottom = 2 * procent + '%';
	  } else {
		sun.style.bottom = 2 * (100 - procent) + '%';
	  }
	} else {
	  document.querySelector('html').classList.add('is-night');
	  clearInterval(interval);
	}
  };
  
// 5 TODO: maak updateSun functie
const SunUpdate = function(up,total){
	let sun = document.querySelector('.js-sun');
  let now = new Date(Date.now());
  let procent = (up / total) * 100;
  console.log(procent);
  
  if (up <= total + 1) {
    sun.dataset.time = `${now.getHours()}:${now.getMinutes()}`;
    sun.style.left = procent + '%';
    if (procent < 50) {
      sun.style.bottom = 2 * procent + '%';
    } else {
      sun.style.bottom = 2 * (100 - procent) + '%';
    }
  }
  let interval = setInterval(function() {
    goSun(sun, total, now, interval);
  }, 1000);
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag
	const minutesLeft = document.querySelector('.js-time-left');

	let now = new Date(Date.now() - sunrise);
	up = now.getHours() * 60 + now.getMinutes();
	minutesLeft.innerHTML = totalMinutes - up;
	console.log(up, totalMinutes);
	
	SunUpdate(up, totalMinutes, sunrise);
	
	// Bepaal het aantal minuten dat de zon al op is.
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
//werkt niet
/* let showResult = queryResponse => {
	console.log(queryResponse)
	console.log(queryResponse.city.name)
	name = queryResponse.city.name
	country = queryResponse.city.country
	if (country == 'BE'){
		country = 'Belgium'
	}

	

	//convert value to time
	var sunrise = queryResponse.city.sunrise;
	var date = new Date(sunrise * 1000);
	var sunriseTime = date.toLocaleTimeString();
	console.log(sunriseTime)

	var sunset = queryResponse.city.sunset;
	var date = new Date(sunset * 1000);
	var sunsetTime = date.toLocaleTimeString();
	console.log(sunsetTime)

	html = `
	<time class="c-horizon__time js-sunrise">
	  ${sunriseTime}
	</time>
	<time class="c-horizon__time js-sunset">
	  ${sunsetTime}
	</time>`

	htmlLocation = `${name}, ${country}`
	

	domHorizonLine.innerHTML = html
	domLocation.innerHTML = htmlLocation
	let sunrise2 = new Date(queryResponse.city.sunrise * 1000);
	let sunset2 = new Date(queryResponse.city.sunset * 1000);
	let difference = new Date(sunset2-sunrise2)
	let differenceJuist = difference.getHours() * 60 + difference.getMinutes()

	
	console.log(difference)

	placeSunAndStartMoving(differenceJuist, sunrise)

	//Sunrise time, unix, UTC
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
}; */

//werkt wel
let showResult = queryResponse => {

	document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, belgium`;
	let sunrise = new Date(queryResponse.city.sunrise * 1000);

	document.querySelector('.js-sunrise').innerHTML = `${sunrise.getHours()}:${sunrise.getMinutes()}`;
	let sunset = new Date(queryResponse.city.sunset * 1000);
	document.querySelector('.js-sunset').innerHTML = `${sunset.getHours()}:${sunset.getMinutes()}`;
	let difference = new Date(sunset - sunrise);
	placeSunAndStartMoving(difference.getHours() * 60 + difference.getMinutes(), sunrise);
  };



// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	fetch(
		`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=1a90ba65cd6fac047055a50561e0c121&units=metric&lang=nl`
	)
		.then(r => r.json())
		.then(d => {
			showResult(d);
		});
	// Eerst bouwen we onze url op
	
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener('DOMContentLoaded', function() {
	domHorizonLine = document.querySelector('.c-horizon__line')
	domLocation = document.querySelector('.c-app__location')
	//console.log(domHorizonLine)
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
