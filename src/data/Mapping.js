export const WEAPONS = {
    0: 'Null',
    1: 'Sword',
    2: 'Blade',
    3: 'Dagger',
    4: 'Axe',
    5: 'Lance',
    6: 'Bow',
    7: 'Wand',
    8: 'Staff',
    9: 'Gun'
}

export const ELEMENTS = {
    0: 'Null',
    1: 'Flame',
    2: 'Water',
    3: 'Wind',
    4: 'Light',
    5: 'Shadow'
}

export const RARITIES = {
    0: '0_Star',
    1: '1_Star',
    2: '2_Star',
    3: '3_Star',
    4: '4_Star',
    5: '5_Star',
    6: '6_Star',
}

export const ELEMENT_BG_COLORS = {
    Null: 'rgb(192, 192,192)',
    Flame: 'rgb(255, 153, 153)',
    Water: 'rgb(153, 194, 255)',
    Wind: 'rgb(153, 255, 153)',
    Light: 'rgb(255, 255, 153)',
    Shadow: 'rgb(230, 153, 255)'
}

export const ELEMENT_FG_COLORS = {
    Null: 'null',
    Flame: 'rgb(204, 0, 0)',
    Water: 'rgb(0, 51, 204)',
    Wind: 'rgb(0, 153, 0)',
    Light: 'rgb(255,180,0)',
    Shadow: 'rgb(102, 0, 204)'
}

export const DEFAULT_HAVE = {
    chara: {
        3: { lv: 60, mc: 30 },
        4: { lv: 70, mc: 40 },
        5: { lv: 80, mc: 40 }
    },
    dragon: {
        3: { c: 5 },
        4: { c: 5 },
        5: { c: 1 }
    },
    amulet: {
        2: { c: 5 },
        3: { c: 5 },
        4: { c: 5 },
        5: { c: 5 },
        6: { c: 5 },
    },
    weapon: {
        2: { b: { 6: 1 } },
        3: { b: { 6: 1 } },
        4: { b: { 6: 1 } },
        5: { b: { 6: 1 } },
        6: { b: { 6: 1 } }
    }
}

export const WEAPON_LEVELS = {
    2: [6, 7, 8, 9, 10],
    3: [12, 14, 16, 18, 20],
    4: [18, 21, 24, 27, 30],
    5: [30, 35, 40, 45, 50, 55, 60, 65, 70],
    6: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85]
}
