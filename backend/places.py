import os
import geocoder
import requests
from config import Config


def get_user_location():
    loc = (geocoder.ip('me')).latlng
    return loc[0], loc[1]


def get_state():
    g = geocoder.ip('me')
    return g.state


def get_addr():
    g = geocoder.ip('me')
    return g.address


def get_city():
    g = geocoder.ip('me')
    return g.city

def get_coord(location):
    g = geocoder.arcgis(location)
    return g.lat, g.lng


def get_locations(keyword, type, location):
    key = os.getenv('GOOGLE_KEY') or Config.GOOGLE_MAPS_API
    lat, lon = get_coord(location)
    print(lat, lon)
    request = ('https://maps.googleapis.com/maps/api/place/nearbysearch/json'
               f'?keyword={keyword}'
               f'&location={lat}%2C{lon}'
               '&radius=50'
               f'&type={type}'
               f'&key={key}')

    response = requests.get(request)
    result = response.json()
    locations = result['results']

    return locations


def get_photo(id, height, width):
    key = os.getenv('GOOGLE_KEY') or Config.GOOGLE_MAPS_API
    request = ('https://maps.googleapis.com/maps/api/place/photo'
               f'?photoreference={id}'
               f'&maxheight={height}'
               f'&maxwidth={width}'
               f'&key={key}')
    res = requests.get(request)

    return res.url

if __name__ == '__main__':
    # get_coord('Yorktown Heights, Westchester, New York')
    # print(get_places('restaurants', 'restaurant', 'Yorktown Heights, Westchester, New York' ))
    # print(get_photo('AelY_CtCkZp608uP9RB66cMf9G-SFsYBX4SaWKxMMTHXZTOmgqYPbilJYzJNIy7hOioj0fCHKSn25NKERIgg0IghsXmhVpNv2XBmoeRItdhVmGNh-CxlFlc_LhTS_0KRT-vQPIn5KDVBeSuNU7ER_qTFaC4u38oXJWIpzBwWSjl1_l44LYPD',2268, 4032))
    # GOOGLE_KEY = os.getenv('GOOGLE_KEY')
    # lat, lon = get_user_location()
    # restaurants = get_nearby_places(GOOGLE_KEY, 'restaurants', 'restaurant')
    # for restaurant in restaurants:
    #     print(restaurant['name'])
    # print(get_state())
    # print(get_postal())
    print(get_county())