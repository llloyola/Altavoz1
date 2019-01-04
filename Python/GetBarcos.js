

// PhantomJS NO soporta promesas
var phantomjs_webpage = require('webpage');
var page = phantomjs_webpage.create();
var fs = require('fs');
// Aqui se guardan los links con los json
var urls = [];

page.onResourceReceived = function(response) {
	// console.log(JSON.stringify(response.url));


	var text_response = JSON.stringify(response.url);
	if (text_response.indexOf("https://www.marinetraffic.com/getData/get_d")!== -1){
		
			// Cargo los datos necesarios en la variable global
			// console.log(JSON.stringify(response.headers));
			urls.push(text_response);
		
	}
	
};

// Para poder imprimir lo necesario
page.onLoadFinished = function(str) {
	if (urls.length > 1) {
		console.log("[")
	
			for (var i = urls.length - 2; i >= 0; i--) {
				console.log(urls[i] + ",");
			}
	
		console.log(urls[urls.length -1] + "]");
	} else {
		console.log("[0]")
	}

	phantom.exit();
};


page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    // uncomment to log into the console 
    // console.error(msgStack.join('\n'));
};


// Una función que retorne los links de los urls a los cuales es necesario pedir los datos
function getData() {
	url = "https://www.marinetraffic.com/en/ais/home/centerx:"+ args[1] + "/centery:" + args[2] + "/zoom:" + args[3];

	page.open(url, function (status){
		console.log(" ")
	});
	
}

// Cargar los datos entregados como argumentos
var system = require('system');
var args = system.args;

// Consigue urls
getData();


/*** 
var wpage = phantomjs_webpage.create();

wpage.customHeaders = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8'
};

wpage.onResourceReceived = function(response) {
	// console.log(JSON.stringify(response.url));
	var text_response = JSON.stringify(response.url);
	console.log("RESPUESTA" + response);
	
};

var getJSONdata = function () {
	function process(){
		if (urls.length == 0){
			phantom.exit();
		} else{
			// url = urls.pop();
			url = 'https://www.marinetraffic.com/getData/get_data_json_4/z:4/X:0/Y:3/station:0';
			// console.log(typeof(url));
			wpage = phantomjs_webpage.create();
			wpage.customHeaders = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8'
};
			wpage.open(url, onFinishedLoading);
		}
	}

	function onFinishedLoading(status){
		if (status !== 'success') {
        	console.log('Unable to access network');
	    } else {
	    	console.log(status);
	        // var ua = wpage.evaluate(function () {
	        //     return document.getElementsByTagName('pre')[0].textContent;
	        // });

	        var ua = wpage.content;
	        fs.open('test4.txt', 'w',function (err) {console.log("NO")});
	        
	        // console.log(ua);
	    }
	    phantom.exit();
	}

	process();

}

***/





