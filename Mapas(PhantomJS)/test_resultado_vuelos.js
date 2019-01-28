// FUnciona

var page = require('webpage').create();
page.settings.userAgent = 'SpecialAgent';
page.open('https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=61.13,58.21,10.39,19.61', function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var ua = page.evaluate(function () {
            return document.getElementsByTagName('pre')[0].textContent;
        });
        console.log(ua);
    }
    phantom.exit();
});