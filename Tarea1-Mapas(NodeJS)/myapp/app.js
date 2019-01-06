// Initialize leaflet.js
var L = require('leaflet');

// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: true
});

// Set the position and zoom level of the map
map.setView([-33.1, -71.7], 9);

// Initialize the base layer
var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Variables globales para cambios en los links de request de py
var north = -32.27;
var south = -34.08;
var west = -73.15;
var east = -70.29;

var centerx = -71.62;
var centery = -33.03;

var zoom = 9;

var enviando = false;

// Array de los marcadores
var marcadores = [];

const Http = new XMLHttpRequest();

if (!enviando){

	var url=`http://localhost:9000/py$north=${north}&south=${south}&west=${west}&east=${east}&centerx=${centerx}&centery=${centery}&zoom=${zoom}`;
	Http.open("GET", url, true);
	Http.send();
}

Http.onreadystatechange=(e)=>{
	var texto = Http.responseText;
	// console.log(Http.responseText);
	// console.log(map)

	if (Http.readyState === 4) {
		var data = JSON.parse(texto);
		var buques = data.buques;
		var aviones = data.aviones;
	
		marcadores.forEach(function (layer) {	
		    	map.removeLayer(layer);
			});
		
		// MARCADORES DE BUQUES
		for (var i = buques.length - 1; i >= 0; i--) {
			var lat = parseFloat(buques[i].LAT);
			var lon = parseFloat(buques[i].LON);

			var SPEED = parseFloat(buques[i].SPEED);
			var HEADING = parseFloat(buques[i].HEADING);

			console.log("SPEED"+SPEED);
			console.log("HEADING"+HEADING);

			var lon_vec = 0.0001 * SPEED * Math.sin(Math.PI * HEADING / 180);
			var lat_vec = 0.0001 * SPEED * Math.cos(Math.PI * HEADING / 180);

			console.log(lon_vec);
			console.log(lat_vec);

			var buquesCircleOptions = {
                radius: 5, 
                stroke: true,
                color: '#000000',
                weight: 1,
                opacity: 1,
                fill: true,
                fillColor: 'red', 
                fillOpacity: 1
            };

			// Para saber si segun la direccion es positivo o negativo
			// Primero X
			if (0<buques[i].HEADING<90 && 270<buques[i].HEADING<360) {
				lon_vec = lon_vec; // NAda cambia
			} else {
				//Pasa a negativo
				lon_vec = (-1) * lon_vec; 
			}

			// Luego Y
			if (0<buques[i].HEADING<180) {
				// No pasa nada
				lat_vec = lat_vec;
			} else {
				// Pasa a negativo
				lat_vec = (-1) * lat_vec;
			}

			var circle = L.circleMarker([buques[i].LAT, buques[i].LON], buquesCircleOptions).addTo(map);
			

			var line = L.polyline([[lat, lon],[lat+lat_vec, lon+lon_vec]], {color: "red"}).addTo(map);


	
			marcadores.push(circle);
			marcadores.push(line);
		}
		
		// MARCADORES DE AVIONES
		//console.log(Object.values(aviones));
		var aviones = Object.values(aviones);

		for (var i = aviones.length - 1; i >= 0; i--) {
			var avion = aviones[i]

			if (!Number.isInteger(avion)) {

				var heading = avion[3];
				var speed = avion[5];

				var lon_vec = 0.00005 * speed * Math.sin(Math.PI * heading / 180);
				var lat_vec = 0.00005 * speed * Math.cos(Math.PI * heading / 180);

				var buquesCircleOptions = {
            	    radius: 5, 
            	    stroke: true,
            	    color: '#000000',
            	    weight: 1,
            	    opacity: 1,
            	    fill: true,
            	    fillColor: 'blue', 
            	    fillOpacity: 1
            	};

            	var circle = L.circleMarker([avion[1], avion[2]], buquesCircleOptions).addTo(map);
            	var line = L.polyline([[avion[1], avion[2]],[avion[1]+lat_vec, avion[2]+lon_vec]], {color: "blue"}).addTo(map);

				marcadores.push(circle);
				marcadores.push(line);

			}
		}
		

		// PARA REPETIRLO CADA 5 SEGUNDOS
		setTimeout(function(){

			if (!enviando){

				enviando = true;

				updateBounds();

				url=`http://localhost:9000/py$north=${north}&south=${south}&west=${west}&east=${east}&centerx=${centerx}&centery=${centery}&zoom=${zoom}`;
	
				Http.open("GET", url, true);
				Http.send();

				enviando = false;
			}
	
		}, 2000);
	}
				
//				//var buques = data.buques;
//				//var aviones = data.aviones;
//
//				//for (var i = buques.length - 1; i >= 0; i--) {
//				//	
//				//	L.marker([buques[i].LAT, buques[i].LON]).addTo(map);
				//}
}

// Funcion para realizar acciones cuando se mueva el mapa
map.on('moveend', function(e) {

	if (!enviando){

		enviando = true;

		updateBounds();

		url=`http://localhost:9000/py$north=${north}&south=${south}&west=${west}&east=${east}&centerx=${centerx}&centery=${centery}&zoom=${zoom}`;

		Http.open("GET", url, true);
		Http.send();

		enviando = false;
	}


});

function updateBounds(){

	var bounds = map.getBounds();
   
	north = bounds.getNorth();
	south = bounds.getSouth();
	west = bounds.getWest();
	east = bounds.getEast();

	var center = map.getCenter();

	centerx = center.lng;
	centery = center.lat;

	zoom = map.getZoom();
}
