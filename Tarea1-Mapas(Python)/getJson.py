from selenium import webdriver
from urllib.request import urlopen, Request
import json
#from flask import Flask


# https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=-32.27,-34.08,-73.15,-70.29
def get_json_aviones():
    # Probar con -13.57, -29.56, 142.61, 169.19

    #driver = webdriver.Chrome('/Users/luisl/Desktop/Pega Altavoz/chromedriver')
    driver = webdriver.PhantomJS("phantomjs")

    driver.get("https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=-32.27,-34.08,-73.15,-70.29")
    json_aviones = json.loads(driver.find_element_by_tag_name("pre").text)

    driver.close()

    return json_aviones

#######################


def get_json_buques():

    links = [
        "https://www.marinetraffic.com/getData/get_data_json_4/z:9/X:76/Y:152/station:0",
        "https://www.marinetraffic.com/getData/get_data_json_4/z:9/X:77/Y:152/station:0",
        "https://www.marinetraffic.com/getData/get_data_json_4/z:9/X:76/Y:153/station:0",
        "https://www.marinetraffic.com/getData/get_data_json_4/z:9/X:77/Y:153/station:0"
    ]

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'vessel-image': '00853fc25189416456442da74396a0288d02',
        'x-requested-with': 'XMLHttpRequest'}

    webpage = []

    for link in links:

        req = Request(link, headers=headers)
        webpage.extend(json.loads(urlopen(req).read().decode())['data']['rows'])

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

    print(get_json_aviones())
    print()
    print(get_json_buques())
