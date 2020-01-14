import os
import sys
import requests
from pathlib import Path
from urllib.parse import quote
import json
import re
from unidecode import unidecode
import aiohttp
import asyncio
import errno

# Queries
MAX = 500
BASE_URL = 'https://dragalialost.gamepedia.com/api.php?action=cargoquery&format=json&limit={}'.format(MAX)

alphafy_re = re.compile('[^a-zA-Z_]')

elements = ['Flame', 'Water', 'Wind', 'Light', 'Shadow']
weapon_types = ['Sword', 'Blade', 'Dagger', 'Axe', 'Lance', 'Bow', 'Wand', 'Staff']
welfare_Dragons = ['Story', 'High Dragon', 'Event Welfare', 'Void', 'Event Welfare, Zodiac']

# static
pattern = {
    'Adventurers': r'\d{6}_\d{2,3}_r0[345].png',
    'Dragons': r'\d{6}_01.png',
    'Weapons': r'\d{6}_01_\d{5}.png',
    'Wyrmprints': r'\d{6}_0[12].png'
}

start = {
    'Adventurers': '100001_01_r04.png',
    'Dragons': '200001_01.png',
    'Weapons': '301001_01_19901.png',
    'Wyrmprints': '400001_01.png'
}

end = {
    'Adventurers': '2',
    'Dragons': '3',
    'Weapons': '4',
    'Wyrmprints': 'A'
}

save_dir = {
    'Adventurers': 'adv',
    'Dragons': 'd',
    'Weapons': 'w',
    'Wyrmprints': 'wp'
}

def snakey(name):
    return re.sub(r'[^0-9a-zA-Z ]', '', unidecode(name)).replace(' ', '_').replace('_amp', '').lower()

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
            if len(r['cargoquery']) == 0:
                break
            data += r['cargoquery']
            offset += len(r['cargoquery'])
        except:
            raise Exception(url)
    return data

def check_target_path(target):
    if not os.path.exists(os.path.dirname(target)):
        try:
            os.makedirs(os.path.dirname(target))
        except OSError as exc: # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

@asyncio.coroutine
async def download(session, dl, save_dir, k, v):
    try:
        fn = v + '.png'
        url = dl[k]
        path = Path(__file__).resolve().parent / '../public/{}/{}'.format(save_dir, fn)
        async with session.get(url) as resp:
            assert resp.status == 200
            check_target_path(path)
            with open(path, 'wb') as f:
                f.write(await resp.read())
                print('download image: {}'.format(fn))
    except KeyError:
        pass

async def download_images(images):
    for file_name, image_lst in images.items():
        dl = {}
        aifrom = start[file_name]
        keep = True
        while keep:
            url = 'https://dragalialost.gamepedia.com/api.php?action=query&format=json&list=allimages&aifrom={}&ailimit=max'.format(
                aifrom
            )

            response = requests.get(url).json()
            try:
                data = response['query']['allimages']

                for i in data:
                    name = i['name']
                    if name[0] == end[file_name]:
                        keep = False
                        break
                    r = re.search(pattern[file_name], name)
                    if r:
                        dl[name] = i['url']

                con = response.get('continue', None)
                if con and con.get('aicontinue', None):
                    aifrom = con['aicontinue']
                else:
                    keep = False
                    break
            except:
                raise Exception

        async with aiohttp.ClientSession() as session:
            await asyncio.gather(*[
                download(session, dl, save_dir[file_name], k, v)
                for k, v in image_lst.items()
            ])

if __name__ == '__main__':
    images = {
        'Adventurers': {},
        'Dragons': {},
        'Weapons': {},
        'Wyrmprints': {}
    }
    data = {}

    data['Adventurers'] = {k1: {'r'+str(k2): [] for k2 in range(5, 2, -1)} for k1 in elements}
    for d in get_data(
        tables='Adventurers', 
        fields='Id,VariationId,FullName,ElementalType,WeaponType,Rarity,Availability', 
        where='IsPlayable',
        order_by='WeaponTypeId ASC'):
        el = d['title']['ElementalType']
        ra = 'r'+d['title']['Rarity']
        nm = snakey(d['title']['FullName'])
        data['Adventurers'][el][ra].append(nm)

        img = '{}_0{}_r0{}.png'.format(d['title']['Id'], int(d['title']['VariationId']), int(d['title']['Rarity']))
        images['Adventurers'][img] = nm
    
    data['Dragons'] = {k1: {k2: [] for k2 in ['r5', 'misc']} for k1 in elements}
    for d in get_data(
        tables='Dragons', 
        fields='BaseId,VariationId,FullName,ElementalType,Rarity,Availability', 
        where='IsPlayable',
        order_by='Rarity DESC'):
        el = d['title']['ElementalType']
        ra = 'r'+d['title']['Rarity']
        av = d['title']['Availability']
        nm = snakey(d['title']['FullName'])
        if av in welfare_Dragons or ra in ['r3', 'r4']:
            # data['Dragons'][el]['misc'][nm] = av
            data['Dragons'][el]['misc'].append(nm)
        else:
            # data['Dragons'][el][ra][nm] = av
            data['Dragons'][el][ra].append(nm)

        img = '{}_{:02d}.png'.format(d['title']['BaseId'], int(d['title']['VariationId']))
        images['Dragons'][img] = nm

    # void_hdt_prereqs = {
    #     'Flame': 'Zephyr Rune',
    #     'Water': 'Blazing Ember',
    #     'Wind': 'Oceanic Crown',
    #     'Light': 'Ruinous Wing',
    #     'Shadow': 'Abyssal Standard',
    # }
    data['Weapons'] = {k1: {k2: [] for k2 in ['Agito', 'HDT2', 'Limited']} for k1 in elements + ['None']}
    for d in get_data(
        tables='Weapons', 
        fields='BaseId,FormId,CraftNodeId,WeaponName,Type,Rarity,ElementalType,Availability', 
        where='IsPlayable AND (Rarity>=5 AND ElementalType!=\'None\' AND ((Availability=\'High Dragon\' AND CraftNodeId >= 200) OR Availability=\'Agito\')) OR Availability=\'Limited\'',
        #  (Availability!=\'Void\' OR ('+' OR '.join(['(ElementalType=\'{}\' AND CraftMaterial3=\'{}\')'.format(k, v) for k, v in void_hdt_prereqs.items()])+'))'
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
        img = '{}_01_{}.png'.format(d['title']['BaseId'], d['title']['FormId'])
        images['Weapons'][img] = nm

    data['Wyrmprints'] = {k1: {k2: [] for k2 in ['Permanent', 'Limited']} for k1 in ['None']}
    # data['Wyrmprints'] = {'a{}_{:02d}'.format(d['title']['BaseId'], int(d['title']['VariationId'])) : snakey(d['title']['Name']) for d in get_data(tables='Wyrmprints', fields='BaseId,VariationId,Name,AmuletType', where='IsPlayable')}
    for d in get_data(
        tables='Wyrmprints',
        fields='BaseId,Name,Rarity,Availability,AmuletType',
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

        img = '{}_02.png'.format(d['title']['BaseId'])
        images['Wyrmprints'][img] = nm
    images['Wyrmprints']['400411_01.png'] = 'in_an_unending_world'
    
    for k in data:
        with open('src/data/{}.json'.format(k), 'w') as f:
            f.write(json.dumps(data[k]))

    loop = asyncio.get_event_loop()
    loop.run_until_complete(download_images(images))
    loop.close()