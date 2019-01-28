var wpage = require('webpage').create(); 

wpage.customHeaders = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8',
	'vessel-image': '00853fc25189416456442da74396a0288d02'
};

wpage.onResourceReceived = function(response) { 
   console.log(JSON.stringify(response));   
} 
wpage.open('https://www.marinetraffic.com/getData/get_data_json_4/z:4/X:0/Y:3/station:0', function(status) {
	if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var ua = wpage.evaluate(function () {
            return document.getElementsByTagName('pre')[0].textContent;
        });
        console.log(ua);
    }
    phantom.exit();
}); 

