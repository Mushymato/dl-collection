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
welfare_dragons = ['Story', 'High Dragon', 'Event Welfare', 'Void', 'Event Welfare, Zodiac']

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

    data['Adventurers'] = {k1: {'r'+str(k2): [] for k2 in range(5, 2, -1)} for k1 in elements}
    for d in get_data(
        tables='Adventurers', 
        fields='FullName,ElementalType,WeaponType,Rarity,Availability', 
        where='IsPlayable',
        order_by='WeaponTypeId ASC'):
        el = d['title']['ElementalType']
        ra = 'r'+d['title']['Rarity']
        # av = d['title']['Availability']
        nm = snakey(d['title']['FullName'])
        # data['Adventurers'][el][ra][nm] = av
        data['Adventurers'][el][ra].append(nm)
    
    data['Dragons'] = {k1: {k2: [] for k2 in ['r5', 'misc']} for k1 in elements}
    for d in get_data(
        tables='Dragons', 
        fields='FullName,ElementalType,Rarity,Availability', 
        where='IsPlayable',
        order_by='Rarity DESC'):
        el = d['title']['ElementalType']
        ra = 'r'+d['title']['Rarity']
        av = d['title']['Availability']
        nm = snakey(d['title']['FullName'])
        if av in welfare_dragons or ra in ['r3', 'r4']:
            # data['Dragons'][el]['misc'][nm] = av
            data['Dragons'][el]['misc'].append(nm)
        else:
            # data['Dragons'][el][ra][nm] = av
            data['Dragons'][el][ra].append(nm)

    void_hdt_prereqs = {
        'Flame': 'Zephyr Rune',
        'Water': 'Blazing Ember',
        'Wind': 'Oceanic Crown',
        'Light': 'Ruinous Wing',
        'Shadow': 'Abyssal Standard',
    }
    data['Weapons'] = {k1: {k2: [] for k2 in ['Core', 'Void', 'HDT1', 'HDT2', 'Limited']} for k1 in elements + ['None']}
    for d in get_data(
        tables='Weapons', 
        fields='CraftNodeId,WeaponName,Type,Rarity,ElementalType,Availability', 
        where='IsPlayable AND ((Rarity=5 AND ElementalType!=\'None\') OR Availability=\'Limited\') AND (Availability!=\'Void\' OR ('+' OR '.join(['(ElementalType=\'{}\' AND CraftMaterial3=\'{}\')'.format(k, v) for k, v in void_hdt_prereqs.items()])+'))',
        order_by='TypeId ASC, CraftNodeId DESC'):
        el = d['title']['ElementalType']
        wt = d['title']['Type']
        av = d['title']['Availability']
        nm = snakey(d['title']['WeaponName'])
        if av == 'High Dragon':
            cn = d['title']['CraftNodeId']
            # data['Weapons'][el]['HDT'+cn[0]][nm] = wt
            data['Weapons'][el]['HDT'+cn[0]].append(nm)
        else:
            # data['Weapons'][el][av][nm] = wt
            data['Weapons'][el][av].append(nm)
    data['Wyrmprints'] = {k1: {k2: [] for k2 in ['Permanent', 'Limited']} for k1 in ['None']}
    # data['Wyrmprints'] = {'a{}_{:02d}'.format(d['title']['BaseId'], int(d['title']['VariationId'])) : snakey(d['title']['Name']) for d in get_data(tables='Wyrmprints', fields='BaseId,VariationId,Name,AmuletType', where="IsPlayable")}
    for d in get_data(
        tables='Wyrmprints',
        fields='Name,Rarity,Availability,AmuletType',
        where='IsPlayable',
        order_by='Rarity DESC, ReleaseDate ASC'):
        ra = 'r'+d['title']['Rarity']
        av = d['title']['Availability']
        nm = snakey(d['title']['Name'])
        tp = d['title']['AmuletType']
        if 'Permanent' in av:
            # data['Wyrmprints'][ra]['Permanent'][nm] = tp
            data['Wyrmprints']['None']['Permanent'].append(nm)
        else:
            # data['Wyrmprints'][ra]['Limited'][nm] = tp
            data['Wyrmprints']['None']['Limited'].append(nm)

    for k in data:
        with open('src/data/{}.json'.format(k), 'w') as f:
            f.write(json.dumps(data[k]))