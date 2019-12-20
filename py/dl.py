import os
import re
import requests
import pprint
import json
from pathlib import Path
import urllib.request
from urllib.parse import quote
import sys
import aiohttp
import asyncio
import errno

# Queries
MAX = 500
BASE_URL = "https://dragalialost.gamepedia.com/api.php?action=cargoquery&format=json&limit={}".format(
    MAX
)

# regex stuff
alphafy_re = re.compile("[^a-zA-Z_]")

# static
pattern = {
    "adventurer": r"\d{6}_\d{2,3}_r0[345].png",
    "dragon": r"\d{6}_01.png",
    "weapon": r"\d{6}_01_\d{5}.png",
    "wyrmprint": r"\d{6}_0[12].png",
    "material": r"\d{9}.png",
}

start = {
    "adventurer": "100001_01_r04.png",
    "dragon": "210001_01.png",
    "weapon": "301001_01_19901.png",
    "wyrmprint": "400001_01.png",
    "material": "104001011.png",
}

end = {
    "adventurer": "2",
    "dragon": "3",
    "weapon": "4",
    "wyrmprint": "A",
    "material": "4",
}

save_dir = {
    "adventurer": "adv",
    "dragon": "d",
    "weapon": "w",
    "wyrmprint": "wp",
    "material": "m",
}

def snakey(name):
    s = name.replace("ñ", "n")
    s = s.replace("&amp;", "and")
    s = s.replace(" ", "_")
    s = alphafy_re.sub("", s)
    return s.lower()


def get_api_request(offset, **kwargs):
    q = "{}&offset={}".format(BASE_URL, offset)
    for key, value in kwargs.items():
        q += "&{}={}".format(key, quote(value))
    return q


def get_data(**kwargs):
    offset = 0
    data = []
    while offset % MAX == 0:
        url = get_api_request(offset, **kwargs)
        r = requests.get(url).json()
        try:
            data += r["cargoquery"]
            offset += len(data)
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
async def download(session, tbl, save_dir, k, v):
    try:
        fn = snakey(tbl[k]) + ".png"
        path = Path(__file__).resolve().parent / "public/{}/{}".format(save_dir, fn)
        async with session.get(v) as resp:
            assert resp.status == 200
            check_target_path(path)
            with open(path, 'wb') as f:
                f.write(await resp.read())
                print("download image: {}".format(fn))
    except KeyError:
        pass

def image_list(file_name):
    tbl = None
    if file_name == "adventurer":
        tbl = {
            "{}_0{}_r0{}.png".format(
                d["title"]["Id"], int(d["title"]["VariationId"]), int(d["title"]["Rarity"])
            ): d["title"]["FullName"]
            for d in get_data(tables="Adventurers", fields="Id,VariationId,FullName,Rarity")
        }
    elif file_name == "dragon":
        tbl = {
            "{}_{:02d}.png".format(d["title"]["BaseId"], int(d["title"]["VariationId"])): d[
                "title"
            ]["FullName"]
            for d in get_data(tables="Dragons", fields="BaseId,VariationId,FullName")
        }
    elif file_name == "wyrmprint":
        tbl = {
            "{}_02.png".format(d["title"]["BaseId"]): d["title"]["Name"]
            for d in get_data(tables="Wyrmprints", fields="BaseId,Name")
        }
    elif file_name == "weapon":
        tbl = {
            "{}_01_{}.png".format(d["title"]["BaseId"], d["title"]["FormId"]): d["title"][
                "WeaponName"
            ]
            for d in get_data(tables="Weapons", fields="BaseId,FormId,WeaponName")
        }

    download = {}
    aifrom = start[file_name]
    keep = True
    while keep:
        url = "https://dragalialost.gamepedia.com/api.php?action=query&format=json&list=allimages&aifrom={}&ailimit=max".format(
            aifrom
        )

        response = requests.get(url).json()
        try:
            data = response["query"]["allimages"]

            for i in data:
                name = i["name"]
                if name[0] == end[file_name]:
                    keep = False
                    break
                r = re.search(pattern[file_name], name)
                if r:
                    download[name] = i["url"]

            con = response.get("continue", None)
            if con and con.get("aicontinue", None):
                aifrom = con["aicontinue"]
            else:
                keep = False
                break
        except:
            raise Exception

    return tbl, download
    # for k, v in download.items():
    #     fn = k
    #     if file_name == "adventurer":
    #         if fn in chara:
    #             fn = snakey(chara[k]) + ".png"
    #             path = Path(__file__).resolve().parent / "img/{}/{}".format("adv", fn)
    #             urllib.request.urlretrieve(v, path)
    #             print("download image: {}".format(fn))
    #     if file_name == "dragon":
    #         if fn in drag:
    #             fn = snakey(drag[k]) + ".png"
    #             path = Path(__file__).resolve().parent / "img/{}/{}".format("d", fn)
    #             urllib.request.urlretrieve(v, path)
    #             print("download image: {}".format(fn))
    #     if file_name == "weapon":
    #         if fn in w:
    #             fn = snakey(w[k]) + ".png"
    #             path = Path(__file__).resolve().parent / "img/{}/{}".format("w", fn)
    #             urllib.request.urlretrieve(v, path)
    #             print("download image: {}".format(fn))
    #     if file_name == "wyrmprint":
    #         if fn in wp:
    #             print(fn, wp[k])
    #             fn = snakey(wp[k]) + ".png"
    #             path = Path(__file__).resolve().parent / "img/{}/{}".format("wp", fn)
    #             urllib.request.urlretrieve(v, path)
    #             print("download image: {}".format(fn))

async def download_images(file_name):
    tbl, dl = image_list(file_name)
    async with aiohttp.ClientSession() as session:
        await asyncio.gather(*[
            download(session, tbl, save_dir[file_name], k, v)
            for k, v in dl.items()
        ])

if __name__ == "__main__":
    if len(sys.argv) > 1:
        loop = asyncio.get_event_loop()
        loop.run_until_complete(download_images(sys.argv[1]))
    else:
        for file_name in ("adventurer", "dragon", "weapon", "wyrmprint"):
            loop = asyncio.get_event_loop()
            loop.run_until_complete(download_images(file_name))
