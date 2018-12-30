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


// Funcion para realizar acciones cuando se mueva el mapa
map.on('moveend', function(e) {
   var center = map.getCenter();
   
   var north = map.getNorth();
   var south = map.getSouth();
   var west = map.getWest();
   var east = map.getEast();


});


// Array de los marcadores
var marcadores = [];

// Variables globales para cambios en los links de request de py
var north = -32.27;
var south = -34.08;
var west = -73.15;
var east = -70.29;

const Http = new XMLHttpRequest();
var url=`http://localhost:9000/py$north=${north}&south=${south}&west=${west}&east=${east}`;
Http.open("GET", url, true);
Http.send();

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
			var circle = L.circle([buques[i].LAT, buques[i].LON], {
			    color: 'red',
			    fillColor: '#f03',
			    fillOpacity: 0.5,
			    radius: 500
			}).addTo(map);
	
			marcadores.push(circle);
		}
		
		// MARCADORES DE AVIONES
		//console.log(Object.values(aviones));
		var aviones = Object.values(aviones);

		for (var i = aviones.length - 1; i >= 0; i--) {
			var avion = aviones[i]

			if (!Number.isInteger(avion)) {

				var circle = L.circle([avion[1], avion[2]] ,{
					color: 'blue',
					fillColor: '#f03',
					fillOpacity: 0.5,
					radius: 500
				}).addTo(map);

				marcadores.push(circle);

			}
		}
		

		// PARA REPETIRLO CADA 5 SEGUNDOS
		setTimeout(function(){

			url=`http://localhost:9000/py$north=${north}&south=${south}&west=${west}&east=${east}`;
	
			Http.open("GET", url, true);
			Http.send();
	
		}, 5000);
	}
				
//				//var buques = data.buques;
//				//var aviones = data.aviones;
//
//				//for (var i = buques.length - 1; i >= 0; i--) {
//				//	
//				//	L.marker([buques[i].LAT, buques[i].LON]).addTo(map);
				//}
}
