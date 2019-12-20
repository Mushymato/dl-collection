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

elements = ['Flame', 'Water', 'Wind', 'Light', 'Shadow']
weapon_types = ['Sword', 'Blade', 'Dagger', 'Axe', 'Lance', 'Bow', 'Wand', 'Staff']

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

    data['Adventurers'] = {k1: {'r'+str(k2): {} for k2 in range(5, 2, -1)} for k1 in elements}
    for d in get_data(
        tables='Adventurers', 
        fields='FullName,ElementalType,WeaponType,Rarity,Availability', 
        where='IsPlayable',
        order_by='WeaponTypeId ASC'):
        el = d['title']['ElementalType']
        ra = 'r'+d['title']['Rarity']
        av = d['title']['Availability']
        nm = snakey(d['title']['FullName'])
        data['Adventurers'][el][ra][nm] = av
    
    data['Dragons'] = {k1: {'r'+str(k2): {} for k2 in range(5, 2, -1)} for k1 in elements}
    for d in get_data(
        tables='Dragons', 
        fields='BaseId,VariationId,FullName,ElementalType,Availability', 
        where='IsPlayable'):
        el = d['title']['ElementalType']
        ra = 'r'+d['title']['Rarity']
        av = d['title']['Availability']
        nm = snakey(d['title']['FullName'])
        data['Dragons'][el][ra][nm] = av
    
    # data['Weapons'] = {snakey(d['title']['WeaponName']) : {
    #     'ele': d['title']['ElementalType'],
    #     'ob': d['title']['Availability'],
    #     'rl': d['title']['ReleaseDate']
    # } for d in get_data(
    #     tables='Weapons', 
    #     fields='BaseId,VariationId,WeaponName,Type,ElementalType,Availability,ReleaseDate', 
    #     where='IsPlayable',
    #     order_by='TypeId ASC')}
    
    # data['Wyrmprints'] = {'a{}_{:02d}'.format(d['title']['BaseId'], int(d['title']['VariationId'])) : snakey(d['title']['Name']) for d in get_data(tables='Wyrmprints', fields='BaseId,VariationId,Name,AmuletType', where="IsPlayable")}

    for k in data:
        with open('src/data/{}.json'.format(k), 'w') as f:
            f.write(json.dumps(data[k]))