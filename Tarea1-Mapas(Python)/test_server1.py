from http.server import BaseHTTPRequestHandler, HTTPServer
from mapping import mapa
import time
import os

HOST_NAME = 'localhost'
PORT_NUMBER = 9000 # Maybe set this to 9000.



class MyHandler(BaseHTTPRequestHandler):

	def do_HEAD(s):
		s.send_response(200)
		s.send_header("Content_type", "text/html")
		s.end_headers()

	def do_GET(s):
		"""RESPONDER A UN rEQUEST GET"""
		# print(s.path)
		if "py$" in s.path: # Asumo que el path de request va a tener un py$, recordar pedir los datos con eso

			# Falta manejo de los datos para obtener valores a colocar en la funcion
			# Mapa se deberá reemplazar por los json
			mapa()


			with open("map.html") as file:
				data = file.read()

				## HEADERS
				s.send_response(200)
				# Este header será reemplazado por el json, de manera que se pueda interpretar de buena manera
				s.send_header("Content-type", "text/html")
				s.end_headers()

				## HTML ----- Despues será reemplazado por un json, realizar los cambios perinentes
				s.wfile.write(data.encode())




		else:
			## Por ahora cuando no sea una llamada del tipo py, se devuelve una pagina con el path solicitado
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

