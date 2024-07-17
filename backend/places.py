import os
import geocoder
import requests


def get_user_location():
    loc = (geocoder.ip('me')).latlng
    return loc[0], loc[1]


def get_nearby_places(KEY, lat, lon, keyword, type):
    request = ('https://maps.googleapis.com/maps/api/place/nearbysearch/json'
                f'?keyword={keyword}'
                f'&location={lat}%2C{lon}'
                '&radius=400'
                f'&type={type}'
                f'&key={KEY}')

    res = requests.get(request)
    res = res.json()

    # print(len(res["results"]))
    return res['results']


if __name__ == '__main__':
    GOOGLE_KEY = os.getenv('GOOGLE_KEY')
    lat, lon = get_user_location()
    restaurants = get_nearby_places(GOOGLE_KEY, lat, lon, 'restaurant', 'restaurant')
    for restaurant in restaurants:
        print(restaurant['name'])
