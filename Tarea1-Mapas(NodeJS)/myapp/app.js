// Initialize leaflet.js
var L = require('leaflet');

// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: true
});

// Set the position and zoom level of the map
map.setView([-33.1, -71.7], 7);

// Initialize the base layer
var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Array de los marcadores
var marcadores = [];

const Http = new XMLHttpRequest();
const url='http://localhost:9000/py$';
Http.open("GET", url, true);
Http.send();
Http.onreadystatechange=(e)=>{
	var texto = Http.responseText;
	console.log(Http.responseText);
	// console.log(map)

	if (Http.readyState === 4) {
	var data = JSON.parse(texto);
	var buques = data.buques;
	var aviones = data.aviones;


	for (var i = buques.length - 1; i >= 0; i--) {
		var marker = L.marker([buques[i].LAT, buques[i].LON]);
		marker.addTo(map);

		marcadores.push(marker);
	}

	setTimeout(function(){
		marcadores.forEach(function (layer) {	
	    map.removeLayer(layer);
	    Http.open("GET", url, true);
		Http.send();

		});
	}, 5000);
//
}
				
//				//var buques = data.buques;
//				//var aviones = data.aviones;
//
//				//for (var i = buques.length - 1; i >= 0; i--) {
//				//	
//				//	L.marker([buques[i].LAT, buques[i].LON]).addTo(map);
				//}
			}
