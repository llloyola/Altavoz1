import folium
from getJson import get_json_aviones, get_json_buques


def mapa():
    mapa = folium.Map(
        location=[-33.1, -71.7],
        zoom_start=9
    )
    
    for value in filter(lambda x: isinstance(x, list), get_json_aviones().values()):
    
        folium.CircleMarker(location=[value[1], value[2]],
                            radius=10,
                            fill_color='#cccc00',
                            fill_opacity=0.8).add_to(mapa)
    
    for dic in get_json_buques():
    
        folium.CircleMarker(location=[float(dic['LAT']), float(dic['LON'])],
                            radius=10,
                            fill_color='#551a8b',
                            fill_opacity=0.8).add_to(mapa)
    
    filename = 'map.html'
    
    mapa.save(filename)
