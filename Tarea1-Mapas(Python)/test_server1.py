from http.server import BaseHTTPRequestHandler, HTTPServer
from getJson import get_json_aviones, get_json_buques
import time
import os
import json

HOST_NAME = 'localhost'
PORT_NUMBER = 9000  # Maybe set this to 9000.


class MyHandler(BaseHTTPRequestHandler):

    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content_type", "text/html")
        s.end_headers()

    def do_GET(s):
        """RESPONDER A UN rEQUEST GET"""
        print("REQUEST A: {}".format(s.path))
        if "py$" in s.path:  # Asumo que el path de request va a tener un py$, recordar pedir los datos con eso

            # PARSEO DE DATOS
            # El url viene de la forma http://localhost:9000/py$north=${north}&south=${south}&west=${west}&east=${east}

            raw_data = s.path[s.path.find("$") + 1:]

            lista_data = raw_data.split("&")

            valores = {}
            for i in lista_data:
                lista = i.split('=')
                valores[lista[0]] = lista[1]

            north = float(valores['north'])
            south = float(valores['south'])
            west = float(valores['west'])
            east = float(valores['east'])

            ## print("LAT={}, LON={}, ZOOM={}".format(lat, lon, zoom))

            # Falta manejo de los datos para obtener valores a colocar en la funcion
            # Mapa se deberá reemplazar por los json
            buques = get_json_buques()
            aviones = get_json_aviones(north, south, west, east)

            data = json.dumps({"buques": buques, "aviones": aviones})

            # HEADERS
            s.send_response(200)
            # headers necesarios para que el servidor acepte el request
            s.send_header("Content-type", "application/json")
            s.send_header('Access-Control-Allow-Origin', '*')
            s.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            s.send_header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie")
            s.end_headers()

            # HTML ----- Despues será reemplazado por un json, realizar los cambios perinentes
            s.wfile.write(data.encode())

        else:
            # Por ahora cuando no sea una llamada del tipo py, se devuelve una pagina con el path solicitado
            s.send_response(200)
            s.send_header("Content-type", "text/html")
            s.end_headers()
            s.wfile.write("<html><head><title>Title goes here.</title></head>".encode())
            s.wfile.write("<body><p>This is a test.</p>".encode())
            # If someone went to "http://something.somewhere.net/foo/bar/",
            # then s.path equals "/foo/bar/".
            s.wfile.write(("<p>You accessed path: {}</p>".format(s.path)).encode())
            s.wfile.write("</body></html>".encode())


if __name__ == '__main__':
    server_class = HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print(time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print(time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER))
