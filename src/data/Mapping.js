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

export const FORMS = {
    0: 'Form0',
    2: 'FormB',
    1: 'FormA',
    3: 'FormC',
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
    }
}

export const unionIcon = (union) => (`Icon_Union_${union.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`);
