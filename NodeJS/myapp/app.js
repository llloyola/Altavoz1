// Initialize leaflet.js
var L = require('leaflet');

// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: true
});

curr_IP = location.hostname;

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
var marcadores_aviones = [];
var marcadores_buques = [];

const Http = new XMLHttpRequest();

if (!enviando){

	var url=`http://${curr_IP}:9000/py$north=${north}&south=${south}&west=${west}&east=${east}&centerx=${centerx}&centery=${centery}&zoom=${zoom}`;
	Http.open("GET", url, true);
	Http.send();
}

Http.onreadystatechange=(e)=>{
	var texto = Http.responseText;
	// console.log(Http.responseText);
	// console.log(map)

	if (Http.readyState === 4) {

		// Loading div
		var miDiv = document.getElementById('miDiv');
        if(Http.status == 200) {
            miDiv.innerHTML = '';
        }else{
            miDiv.innerHTML = 'falla';
        }

		var data = JSON.parse(texto);
		var buques = data.buques;
		console.log(buques);
		var aviones = data.aviones;
	
		marcadores_aviones.forEach(function (layer) {	
		    	map.removeLayer(layer);
			});

		if (buques.length > 1) {
			marcadores_buques.forEach(function (layer){
				map.removeLayer(layer);
			});
		}
		
		// MARCADORES DE BUQUES
		for (var i = buques.length - 1; i >= 0; i--) {
			var lat = parseFloat(buques[i].LAT);
			var lon = parseFloat(buques[i].LON);

			var SPEED = parseFloat(buques[i].SPEED);
			var HEADING = parseFloat(buques[i].HEADING);

			var lon_vec = 0.0001 * SPEED * Math.sin(Math.PI * HEADING / 180);
			var lat_vec = 0.0001 * SPEED * Math.cos(Math.PI * HEADING / 180);

			// Datos buques 
			var nombre = buques[i].SHIPNAME;
			var bandera = buques[i].FLAG;
			var destino = buques[i].DESTINATION;


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


			var circle = L.circleMarker([buques[i].LAT, buques[i].LON], buquesCircleOptions).addTo(map);
			circle.bindPopup("<b>Nombre: </b>"+nombre+"<br><b>Bandera: </b>"+bandera+"<br><b>Hacia: </b>"+destino);
			

			var line = L.polyline([[lat, lon],[lat+lat_vec, lon+lon_vec]], {color: "red"}).addTo(map);


	
			marcadores_buques.push(circle);
			marcadores_buques.push(line);
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

				// Datos del avion
				var nombre = avion[13];
				var desde = avion[11];
				var hacia = avion[12];

				if (nombre === "") {
					nombre = "N/A";
				}

				if (desde === ""){
					desde = "N/A";
				}

				if (hacia === ""){
					hacia = "N/A"
				}

				var avionesCircleOptions = {
            	    radius: 5, 
            	    stroke: true,
            	    color: '#000000',
            	    weight: 1,
            	    opacity: 1,
            	    fill: true,
            	    fillColor: 'blue', 
            	    fillOpacity: 1
            	};

            	var circle = L.circleMarker([avion[1], avion[2]], avionesCircleOptions).addTo(map);
            	//Datos en el popup
            	circle.bindPopup("<b>Vuelo: </b>"+nombre+"<br><b>Desde: </b>"+desde+"<br><b>Hacia: </b>"+hacia);
            	var line = L.polyline([[avion[1], avion[2]],[avion[1]+lat_vec, avion[2]+lon_vec]], {color: "blue"}).addTo(map);

				marcadores_aviones.push(circle);
				marcadores_aviones.push(line);

			}
		}
		

		// PARA REPETIRLO CADA 5 SEGUNDOS
		setTimeout(function(){

			if (!enviando){

				enviando = true;

				updateBounds();

				url=`http://${curr_IP}:9000/py$north=${north}&south=${south}&west=${west}&east=${east}&centerx=${centerx}&centery=${centery}&zoom=${zoom}`;
	
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

	var miDiv = document.getElementById('miDiv');

	if (!enviando){

		miDiv.innerHTML = "cargando datos";

		enviando = true;

		updateBounds();

		url=`http://${curr_IP}:9000/py$north=${north}&south=${south}&west=${west}&east=${east}&centerx=${centerx}&centery=${centery}&zoom=${zoom}`;

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
