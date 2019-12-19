import os
import sys
import requests
from urllib.parse import quote
import json
import re

# Queries
MAX = 500
BASE_URL = 'https://dragalialost.gamepedia.com/api.php?action=cargoquery&format=json&limit={}'.format(MAX)

alphafy_re = re.compile("[^a-zA-Z_]")

def snakey(name):
    s = name.replace("ñ", "n")
    s = s.replace("&amp;", "and")
    s = s.replace(" ", "_")
    s = alphafy_re.sub("", s)
    return s.lower()

def get_api_request(offset, **kwargs):
    q = '{}&offset={}'.format(BASE_URL, offset)
    for key, value in kwargs.items():
        q += '&{}={}'.format(key, quote(value))
    return q

def get_data(**kwargs):
    offset = 0
    data = []
    while offset % MAX == 0:
        url = get_api_request(offset, **kwargs)
        print(url)
        r = requests.get(url).json()
        try:
            data += r['cargoquery']
            offset += len(data)
        except:
            raise Exception(url)
    return data

if __name__ == '__main__':
    data = {}

    data['Adventurers'] = {snakey(d['title']['FullName']) : {
        'ele': d['title']['ElementalType'],
        'wt': d['title']['WeaponType'],
        'ct': d['title']['CharaType'],
        'ob': d['title']['Availability'],
        'rl': d['title']['ReleaseDate']
    } for d in get_data(
        tables='Adventurers', 
        fields='FullName,ElementalType,WeaponType,CharaType,Availability,ReleaseDate', 
        where='IsPlayable',
        order_by='ElementalTypeId ASC, WeaponTypeId ASC')}
    data['Dragons'] = {'d{}_{:02d}'.format(d['title']['BaseId'], int(d['title']['VariationId'])) : snakey(d['title']['FullName']) for d in get_data(tables='Dragons', fields='BaseId,VariationId,FullName', where="IsPlayable")}
    data['Weapons'] = {'w{}_{:02d}'.format(d['title']['BaseId'], int(d['title']['VariationId'])) : snakey(d['title']['WeaponName']) for d in get_data(tables='Weapons', fields='BaseId,VariationId,WeaponName,Type', where="IsPlayable")}
    data['Wyrmprints'] = {'a{}_{:02d}'.format(d['title']['BaseId'], int(d['title']['VariationId'])) : snakey(d['title']['Name']) for d in get_data(tables='Wyrmprints', fields='BaseId,VariationId,Name,AmuletType', where="IsPlayable")}

    for k in data:
        with open('src/data/{}.json'.format(k), 'w') as f:
            f.write(json.dumps(data[k]))