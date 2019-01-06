from selenium import webdriver
from urllib.request import urlopen, Request
from subprocess import check_output
import json
#from flask import Flask


# https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=-32.27,-34.08,-73.15,-70.29
def get_json_aviones(north, south, west, east):

    #driver = webdriver.Chrome('/Users/luisl/Desktop/Pega Altavoz/chromedriver')
    driver = webdriver.PhantomJS("phantomjs")

    # Mala práctica de programación
    eval("driver.get('https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds={},{},{},{}'.format(north, south, west, east))")
    json_aviones = json.loads(driver.find_element_by_tag_name("pre").text)

    driver.close()

    print(json_aviones)

    return json_aviones

#######################


def get_json_buques(centerx, centery, zoom):

    ## PRUEBA 1 - Mezclar con phantomjs
    while True:
        print(centerx, centery, zoom)
        out = check_output(["phantomjs", "GetBarcos.js", str(centerx), str(centery), str(zoom)])

        links = json.loads(out)

        if links[0] != 0:
            break

        else:
            print("get_json_buques FAILED -------------- trying again")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'vessel-image': '00853fc25189416456442da74396a0288d02',
        'x-requested-with': 'XMLHttpRequest'}

    webpage = []

    for link in links:

        req = Request(link, headers=headers)
        webpage.extend(json.loads(urlopen(req).read().decode())['data']['rows'])

    print(webpage[0])

    return webpage

#######################


#app = Flask(__name__)
#
#
#@app.route('/')
# def hello_world():
#    return json.dumps({'aviones': get_json_aviones(),
#                       'buques': get_json_buques()})
#
#
#t = Timer(10.0, hello_world)
# t.start()


if __name__ == "__main__":

    get_json_buques(-71, -33, 9)
    get_json_aviones(32.27, -34.08, -73.15, -70.29)
