import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

import TextLabel from '../data/locale.json';

import ManaCircle from '../data/manacircle.json';

import Weapon from '../data/weapon.json';
import WeaponSeries from '../data/weaponseries.json';
import WeaponBuild from '../data/weaponbuild.json';
import WeaponLevel from '../data/weaponlevel.json'

import AmuletBuild from '../data/amuletbuild.json';
import AmuletLevel from '../data/amuletlevel.json';

import { ELEMENTS, ELEMENT_BG_COLORS, ELEMENT_FG_COLORS, DEFAULT_HAVE, unionIcon, MEDALS } from '../data/Mapping';

const useStyles = makeStyles({
    root: {
        width: 120,
        transition: 'background-color 0.2s linear'
    },
    cardIcon: {
        transition: 'width 0.1s linear 0.1s, height 0.1s linear 0.1s',
        margin: 'auto',
        height: 120,
        width: 120
    },
    cardIconEditing: {
        height: 72,
        width: 72
    },
    cardCountIcon: {
        transition: 'width 0.1s linear 0.1s, height 0.1s linear 0.1s',
        margin: 'auto',
        height: 90,
        width: 90
    },
    cardName: {
        padding: '0 !important',
        height: '2.5em'
    },
    cardNameText: {
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        fontWeight: 700,
        fontSize: '0.75em',
        textTransform: 'none',
        letterSpacing: -1,
        '& .MuiButton-endIcon': {
            margin: 0,
            padding: 0
        }
    },
    cardCount: {
        padding: '0 !important',
        height: '1em',
        marginBottom: 8,
    },
    cardCountText: {
        fontWeight: 700,
        fontSize: '0.75em',
        letterSpacing: -1,
    },
    cardNameNoWrap: {
        whiteSpace: 'pre'
    },
    cardEdit: {
        padding: 0,
        margin: 0,
        paddingLeft: 10,
        paddingRight: 10,
        height: 0,
        visibility: 'hidden',
        transition: 'visibility 0.1s linear 0.1s, height 0.1s linear 0.1s',
    },
    cardEditEditing: {
        height: 48,
        visibility: 'visible'
    },
    unionIcon: {
        "& img": {
            width: 24,
        },
        position: 'absolute',
        top: 7,
        left: 48,
        zIndex: 1
    },
    amuletAbIcon: {
        "& img": {
            width: 24,
        },
        position: 'absolute',
        top: 6,
        left: 28,
        zIndex: 2
    },
    mcIcon: {
        backgroundImage: `url("${process.env.PUBLIC_URL}/ui/mc.png")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        textAlign: 'center',
        width: 30,
        height: 30,
        lineHeight: '30px',
        fontWeight: 700,
        color: 'white',
        fontSize: '0.9em',
        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
        // fontSize: '1em',
        // '-webkit-text-stroke': '1px black',
        position: 'absolute',
        top: 45,
        left: 3,
        zIndex: 2
    },
    mcIconDone: {
        color: '#ffcc26'
    },
    mcIconMaxed: {
        color: '#41eded'
    },
    mcIconAmulet: {
        top: 25,
    },
    circleIcon: {
        backgroundColor: 'gray',
        textAlign: 'center',
        width: 19,
        height: 19,
        lineHeight: '20px',
        fontWeight: 700,
        color: 'white',
        fontSize: '0.9em',
        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
        // fontSize: '1em',
        // '-webkit-text-stroke': '1px black',
        position: 'absolute',
        borderRadius: 50,
        top: 5,
    },
    circleIconMaxed: {
        color: '#48D1CC'
    },
    circleIcon0: {
        left: 4
    },
    circleIcon1: {
        left: 25,
    },
    circleIcon2: {
        left: 46,
    },
    circleIcon3: {
        left: 67,
    },
    unbindIcons: {
        position: 'absolute',
        bottom: 0
    },
    mubCount: {
        backgroundImage: `url("${process.env.PUBLIC_URL}/ui/ubc.png")`,
        lineHeight: '20px',
        fontWeight: 700,
        textAlign: 'center',
        fontSize: '0.9em',
    },
    ubIcon: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: 16,
        height: 20
    },
    ub0: {
        backgroundImage: `url("${process.env.PUBLIC_URL}/ui/ub0.png")`,
    },
    ubN: {
        backgroundImage: `url("${process.env.PUBLIC_URL}/ui/ubn.png")`,
    },
    ubM: {
        backgroundImage: `url("${process.env.PUBLIC_URL}/ui/ubm.png")`,
    },
    dialogIcon: {
        width: 60,
        height: 60
    },
    abilityCheckTooltip: {
        top: '10px !important',
        padding: 0,
        fontSize: '1.2em'
    },
    abilityCheck: {
        padding: 0
    },
    abilityIcon: {
        width: 60,
        height: 60
    },
    grayscale: {
        filter: 'grayscale(100%)'
    },
    mcTab: {
        minWidth: 20,
    },
    mcTabpanel: {
        display: 'grid',
        margin: '0 auto',
        gridTemplateColumns: 'repeat(5, 1fr)',
        textAlign: 'center',
        width: 'fit-content',
    },
    medalTabpanel: {
        display: 'grid',
        margin: '0 auto',
        gridTemplateColumns: 'repeat(4, 1fr)',
        textAlign: 'center',
        width: 'fit-content',
    },
    medalIcon: {
        width: 60,
        height: 60
    },
    medalButton: {
        float: "right",
        position: "relative",
        top: 21,
    },
    medalDeco: {
        width: 25,
        height: 25,
        verticalAlign: 'middle'
    },
    mcTabUb: {
        position: 'relative',
        gridColumnStart: 1,
        gridColumnEnd: 6,
    },
    mcDeco: {
        position: 'absolute',
        zIndex: 0,
        width: 60,
        height: 60,
    },
    mcDecoUb5: {
        width: 180,
        left: 0,
    },
    Flame: { backgroundColor: ELEMENT_BG_COLORS.Flame },
    Water: { backgroundColor: ELEMENT_BG_COLORS.Water },
    Wind: { backgroundColor: ELEMENT_BG_COLORS.Wind },
    Light: { backgroundColor: ELEMENT_BG_COLORS.Light },
    Shadow: { backgroundColor: ELEMENT_BG_COLORS.Shadow },
    Null: { backgroundColor: ELEMENT_BG_COLORS.Null },
    FgFlame: { color: ELEMENT_FG_COLORS.Flame },
    FgWater: { color: ELEMENT_FG_COLORS.Water },
    FgWind: { color: ELEMENT_FG_COLORS.Wind },
    FgLight: { color: ELEMENT_FG_COLORS.Light },
    FgShadow: { color: ELEMENT_FG_COLORS.Shadow },
    FgNull: { color: ELEMENT_FG_COLORS.Null },
});

const MC_SVG_PATHS = {
    d39: 'M0 25 60 25 60 35 0 35Z',
    d36: 'M60 25 25 25 25 60 35 60 35 35 60 35Z',
    d69: 'M0 25 35 25 35 60 25 60 25 35 0 35Z',
    d03: 'M60 35 25 35 25 0 35 0 35 25 60 25Z',
    d09: 'M0 35 35 35 35 0 25 0 25 25 0 25Z',
    d039: 'M0 25 25 25 25 0 35 0 35 25 60 25 60 35 0 35Z',
    d3: 'M25 35 60 35 60 25 25 25Z',
    dUb0: 'M25 60 35 60 35 25 25 25Z',
    dUb36: 'M35 60 25 60 25 37Q25 25 37 25L150 25 150 35 38 35Q35 35 35 38Z',
}

export const insertLinebreak = (name, locale) => {
    switch (locale) {
        case 'JP':
        case 'CN':
            return name.replace('\uff08', '\n\uff08');
        default:
            return name;
    }
}

function BaseListingItem(props) {
    const { locale, entry, have, lcHaving, rcHaving, editing, toggleEditing, cardIconUrl, CardIconDeco, children } = props;
    const classes = useStyles();
    const cardName = entry[`Name${locale}`];
    return (
        <Grid item>
            <Card className={clsx(classes.root, have && (classes[ELEMENTS[entry.Element]] || classes.Null))}>
                <CardActionArea onClick={lcHaving} onContextMenu={rcHaving}>
                    <CardMedia
                        className={clsx(classes.cardIcon, editing && classes.cardIconEditing)}
                        image={cardIconUrl}
                        title={cardName} alt={cardName} >
                        <CardIconDeco />
                    </CardMedia>
                </CardActionArea>
                <CardContent
                    className={classes.cardName}>
                    <Button
                        className={clsx(classes.cardNameText, locale !== 'EN' && classes.cardNameNoWrap)}
                        size="small"
                        endIcon={editing ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        onClick={toggleEditing}>
                        {insertLinebreak(cardName, locale)}
                    </Button>
                </CardContent>
                <CardActions className={clsx(classes.cardEdit, editing && classes.cardEditEditing)} >
                    {children}
                </CardActions>
            </Card>
        </Grid>
    );
}

export const doneCharaHave = (entry, unbind) => {
    if (unbind === undefined) {
        return {
            ub: 0,
            no: [],
            md: {},
        }
    }
    if (unbind < 2) {
        return {
            ub: (entry.Rarity === 3) ? 2 : 3,
            no: Array.from({ length: 10 }, (_, i) => i + 1),
            md: {},
        }
    }
    if (unbind < 4) {
        return {
            ub: 4,
            no: Array.from({ length: 10 }, (_, i) => i + 1),
            md: {},
        }
    }
    return {
        ub: entry.MaxLimitBreak,
        no: (entry.MaxLimitBreak === 5) ? Array.from({ length: 20 }, (_, i) => i + 1) : Array.from({ length: 10 }, (_, i) => i + 1),
        md: {},
    }
}

const MC_STATIC = {
    10101: 'Mc_StatusUp_Hp',
    10102: 'Mc_StatusUp_Atk',
    10103: 'Mc_StatusUp_HpAtk',
    10601: 'Mc_Material_Get',
    10602: 'Mc_Material_Get',
    10701: 'Mc_Advanced_Training',
    10801: 'Mc_Unbind_Level',
}
const MC_PIECE_NAME = {
    10101: '+Hp',
    10102: '+Atk',
    10103: '+Hp/Atk',
    10201: 'FS Lv.',
    10301: 'A1 Lv.',
    10302: 'A2 Lv.',
    10303: 'A3 Lv.',
    10401: 'S1 Lv.',
    10402: 'S2 Lv.',
    10501: 'Ex Lv.',
    10601: 'Item',
    10701: 'Combo',
    10801: '+Max Lv.'
}
const MCPieceIcon = (entry, mcItem) => {
    const piece = mcItem.Piece;
    const icon = { img: null, txt: MC_PIECE_NAME[piece] };
    if (MC_STATIC[piece]) {
        icon.img = `${process.env.PUBLIC_URL}/manacircle/${MC_STATIC[piece]}.png`;
    } else if (piece === 10501) {
        // exability
        icon.img = `${process.env.PUBLIC_URL}/ability/${entry.ExAbility}.png`;
        icon.txt += mcItem.Step;
    } else if (piece === 10201) {
        // FS
        const step = mcItem.Step + entry.DefaultLv.FS;
        if (step === 2) {
            icon.img = `${process.env.PUBLIC_URL}/manacircle/Mc_Burstattack_Upgrade.png`;
        } else {
            icon.img = `${process.env.PUBLIC_URL}/manacircle/Mc_Burstattack_Get.png`;
        }

        icon.txt += step;
    } else if (piece >= 10301 && piece <= 10303) {
        // Abilities
        const abi = piece - 10300;
        const step = mcItem.Step + entry.DefaultLv.Abilities[abi];
        icon.img = `${process.env.PUBLIC_URL}/ability/${entry.Abilities[abi][step]}.png`;
        icon.txt += step;
    } else if (piece >= 10401 && piece <= 10402) {
        // Skills
        const si = piece - 10400;
        const step = (si === 1) ? mcItem.Step + 1 : mcItem.Step;
        icon.img = `${process.env.PUBLIC_URL}/skill/${entry.Skills[si][step]}.png`;
        icon.txt += step;
    }
    // Story override
    if (mcItem.Story) {
        icon.img = `${process.env.PUBLIC_URL}/manacircle/Mc_CharaStory.png`;
    }
    return icon;
}


// hardcoded for perf
const MC50_RANGE = [
    [41, 42, 43, 44, 45, 50, 49, 48, 47, 46],
    [31, 32, 33, 34, 35, 40, 39, 38, 37, 36],
    [21, 22, 23, 24, 25, 30, 29, 28, 27, 26],
    [11, 12, 13, 14, 15, 20, 19, 18, 17, 16],
    [1, 2, 3, 4, 5, 10, 9, 8, 7, 6],
];
const MC70_RANGE = [
    [51, 52, 53, 54, 55, 60, 59, 58, 57, 56, 61, 62, 63, 64, 65, 70, 69, 68, 67, 66],
    ...MC50_RANGE
]
export function CharaListingItem(props) {
    const { locale, id, entry, category, have, updateHaving, deleteHaving } = props;
    const classes = useStyles();
    const cardName = entry[`Name${locale}`];

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const mcInfo = ManaCircle[entry.MCName];

    if (have) {
        if (have.no === undefined || have.ub === undefined){
            have.ub = 0;
            have.no = [];
        }
        if (have.md === undefined) {
            have.md = {};
        }
    }

    const createThisHaving = () => {
        updateHaving(id, doneCharaHave(entry));
    }
    const lcHaving = (e) => {
        if (have) {
            updateHaving(id, doneCharaHave(entry, have.ub));
        } else {
            createThisHaving();
        }
    }
    const deleteThisHaving = () => {
        setMcIdx(0);
        if (have) {
            deleteHaving(id);
        }
    }
    const rcHaving = (e) => {
        deleteThisHaving();
        e.preventDefault();
    }
    const handleDialogCheck = (e) => {
        if (e.target.checked) {
            createThisHaving();
        } else {
            deleteThisHaving();
        }
    }

    const mcNum = (have) ? have.ub * 10 + have.no.length : 0;
    const maxManaCircle = (entry.MaxLimitBreak === 5) ? 70 : 50;
    const rarity = (have) ? Math.max(entry.Rarity, Math.min(5, have.ub + 1)) : entry.Rarity;
    const cardIconUrl = `${process.env.PUBLIC_URL}/chara/${id}_r0${rarity}.png`;
    const mcRanges = (entry.MaxLimitBreak === 5) ? MC70_RANGE : MC50_RANGE;

    const [mcIdx, setMcIdx] = useState(have ? entry.MaxLimitBreak - have.ub : 0);
    const handleTabs = (e, newMcIdx) => {
        setMcIdx(newMcIdx);
    };

    const handleMCCheck = (e) => {
        const seq = parseInt(e.target.name.split('-').slice(-1));
        const mcItem = mcInfo[seq];
        const newHave = have ? {...have} : {ub: 0, no: [], md: {}};
        if (have) {
            newHave.ub = mcItem.Hierarchy - 1;
            newHave.no = [];
            if (have.ub < newHave.ub) {
                if (newHave.ub === 5) {
                    newHave.no = Array.from({ length: mcItem.No }, (_, i) => i + 1);
                } else {
                    newHave.no = [mcItem.No];
                }
            } else if (have.ub === newHave.ub) {
                if (newHave.ub === 5) {
                    newHave.no = Array.from({ length: mcItem.No }, (_, i) => i + 1);
                } else {
                    newHave.no = [...have.no];
                    const index = newHave.no.indexOf(mcItem.No);
                    if (index > -1) {
                        newHave.no.splice(index, 1);
                    } else {
                        newHave.no.push(mcItem.No);
                    }
                }
            } else if (have.ub > newHave.ub) {
                if (newHave.ub === 5) {
                    newHave.no = Array.from({ length: (mcItem.No - 1) }, (_, i) => i + 1);
                } else {
                    newHave.no = Array.from({ length: 9 }, (_, i) => (i + 1 >= mcItem.No) ? i + 2 : i + 1);
                }
            }
        } else {
            newHave.ub = mcItem.Hierarchy - 1;
            newHave.no = mcItem.Hierarchy < 6 ? [mcItem.No] : Array.from({ length: mcItem.No }, (_, i) => i + 1);
        }
        updateHaving(id, newHave);
    };
    const getMCChecked = (seq) => {
        if (!have) { return false; }
        const mcItem = mcInfo[seq];
        return (have.ub > mcItem.Hierarchy - 1) || (have.ub === mcItem.Hierarchy - 1 && have.no.includes(mcItem.No));
    }

    const handleUbCheck = (e) => {
        const ubSeq = parseInt(e.target.name.split('-').slice(-1));
        const newHave = have ? {...have} : {ub: 0, no: [], md: {}};
        if (have && have.ub === ubSeq) {
            newHave.ub = ubSeq - 1;
            newHave.no = Array.from({ length: 10 }, (_, i) => i + 1);
        } else {
            newHave.ub = ubSeq;
            newHave.no = [];
        }
        updateHaving(id, newHave);
    }
    const getUbChecked = (ubSeq) => {
        if (!have) { return false; }
        return have.ub >= ubSeq;
    }

    const handleMedalCheck = (e) => {
        const mdSeq = parseInt(e.target.name.split('-').slice(-1));
        const newHave = have ? {...have} : {ub: 0, no: [], md: {}};
        if (have && have.md[mdSeq]){
            delete newHave.md[mdSeq];
        } else {
            newHave.md[mdSeq] = 1;
        }
        updateHaving(id, newHave);
    }
    const getMedalChecked = (mdSeq) => {
        if (!have) { return false; }
        return !!(have.md[mdSeq]);
    }
    const handleMedalCount = (e) => {
        const newHave =  {...have};
        if (Object.keys(have.md).length === MEDALS.length){
            for (let seq = 0; seq < MEDALS.length; seq += 1) {
                delete newHave.md[seq];
            }
        } else {
            for (let seq = 0; seq < MEDALS.length; seq += 1) {
                newHave.md[seq] = 1;
            }
        }
        updateHaving(id, newHave);
    }
    // const MedalDeco = <React.Fragment><img className={clsx(classes.medalDeco)} src={`${process.env.PUBLIC_URL}/medal_on/Icon_Medal_100101.png`} alt={TextLabel[locale].MEDAL}/>{Object.keys(have.md).length}</React.Fragment>;
    return (<Grid item>
        <Card className={clsx(classes.root, have && (classes[ELEMENTS[entry.Element]] || classes.Null))}>
            <CardActionArea onClick={lcHaving} onContextMenu={rcHaving}>
                <CardMedia
                    className={clsx(classes.cardIcon)}
                    image={cardIconUrl}
                    title={cardName} alt={cardName} >
                    {(mcNum > 0) && (
                        <Box className={clsx(classes.mcIcon, mcNum >= maxManaCircle ? classes.mcIconMaxed : (mcNum >= 50 && classes.mcIconDone))}>{mcNum}</Box>
                    )}
                </CardMedia>
            </CardActionArea>
            <CardContent className={clsx(classes.cardName)}>
                <Button
                    className={clsx(classes.cardNameText, locale !== 'EN' && classes.cardNameNoWrap)}
                    size="small"
                    onClick={handleOpen}
                    endIcon={<AddIcon />}>
                    {insertLinebreak(cardName, locale)}
                </Button>
            </CardContent>
        </Card>
        <Dialog maxWidth={false} onClose={handleClose} aria-labelledby={`${category}-${id}-dialog`} open={open}>
            <DialogTitle id={`${category}-${id}-dialog`} onClose={handleClose}>
                <FormControlLabel
                    control={<Checkbox name={`${id}-create`}
                        checked={!!(have)}
                        onClick={handleDialogCheck}
                        color="default"
                        icon={<img src={cardIconUrl} alt={cardName} className={clsx(classes.dialogIcon, classes.grayscale)} />}
                        checkedIcon={<img src={cardIconUrl} alt={cardName} className={clsx(classes.dialogIcon)} />} />}
                    label={<Box><Typography>{cardName}</Typography></Box>}
                />
                {have && (
                    <Button className={clsx(classes.medalButton)} name={`${id}-medal-count`} onClick={handleMedalCount} variant="outlined">
                        <img className={clsx(classes.medalDeco)} src={`${process.env.PUBLIC_URL}/medal_on/Icon_Medal_100101.png`} alt={TextLabel[locale].MEDAL}/>{Object.keys(have.md).length}
                    </Button>
                )}
            </DialogTitle>
            <DialogContent dividers>
                <Tabs
                    value={mcIdx}
                    onChange={handleTabs}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollButtons="auto"
                >
                    {mcRanges.map((mcRange, floor) => (
                        <Tab
                            key={floor}
                            // className={clsx((have && have.ub > (entry.MaxLimitBreak - floor)) && classes[ELEMENTS[entry.Element]], (have && have.ub > (entry.MaxLimitBreak - floor)) && classes.mcTabFull)}
                            classes={{ root: classes.mcTab }}
                            label={`${Math.min(...mcRange)}-${Math.max(...mcRange)}`} id={`mc-tab-${floor}`}
                            aria-controls={`mc-tabpanel-${floor}`}
                        />
                    ))}
                    {have && <Tab key={mcRanges.length} classes={{ root: classes.mcTab }} label={TextLabel[locale].MEDAL} id={`mc-tab-${mcRanges.length}`} aria-controls={`mc-tabpanel-${mcRanges.length}`}/>}
                </Tabs>
                {mcRanges.map((mcRange, floor) => (
                    <Box component="div"
                        role="tabpanel"
                        style={{ display: mcIdx !== floor ? 'none' : undefined }}
                        id={`mc-tabpanel-${floor}`}
                        aria-labelledby={`mc-tab-${floor}`}
                        value={mcIdx}
                        index={floor}
                        key={floor}
                        dir="ltr"
                        className={clsx(classes.mcTabpanel)}>
                        {(mcIdx === floor) && mcRange.map((seq) => {
                            const mcItem = mcInfo[seq];
                            const mcIcon = MCPieceIcon(entry, mcItem);
                            let ubItem = null;
                            const ubSeq = Math.floor(seq / 10);
                            if ([11, 21, 31, 41, 51].includes(seq)) {
                                const ubIcon = (ubSeq === 5) ? `Mc_Unbind_6M_0${entry.Element}` : 'Mc_Unbind_Mana';
                                const ubChecked = getUbChecked(ubSeq);
                                ubItem = (
                                    <Box className={clsx(classes.mcTabUb)} >
                                        <svg className={clsx(classes.mcDeco, ubSeq === 5 && classes.mcDecoUb5)}>
                                            <path d={(ubSeq < 5) ? MC_SVG_PATHS.dUb0 : MC_SVG_PATHS.dUb36} fill={ubChecked ? "#3f51b5" : ELEMENT_BG_COLORS.Null}></path>
                                        </svg>
                                        <Tooltip title={`Unbind ${ubSeq}`} aria-label={`ub-${ubSeq}`} placement="top" classes={{ popper: clsx(classes.abilityCheckTooltip) }}>
                                            <Checkbox
                                                name={`${id}-ub-${ubSeq}`}
                                                onClick={handleUbCheck}
                                                color="default"
                                                classes={{ root: clsx(classes.abilityCheck) }}
                                                checked={ubChecked}
                                                icon={<img src={`${process.env.PUBLIC_URL}/manacircle/${ubIcon}.png`} alt={`ub-${seq}`} className={clsx(classes.abilityIcon, classes.grayscale)} />}
                                                checkedIcon={<img src={`${process.env.PUBLIC_URL}/manacircle/${ubIcon}.png`} alt={`ub-${seq}`} className={clsx(classes.abilityIcon)} />}
                                            />
                                        </Tooltip>
                                    </Box>
                                );
                            }
                            const seqMcTxt = `${seq}: ${mcIcon.txt}`;
                            const nodeChecked = getMCChecked(seq);
                            let mcDecoPath = MC_SVG_PATHS.d39;
                            const seqR = seq % 10;
                            if (seqR === 0){
                                if (ubSeq === 7){
                                    mcDecoPath = MC_SVG_PATHS.d3;
                                } else if (ubSeq > 5){
                                    mcDecoPath = MC_SVG_PATHS.d36;
                                } else {
                                    mcDecoPath = MC_SVG_PATHS.d03;
                                }
                            } else if (seqR === 1){
                                if (ubSeq > 4){
                                    mcDecoPath = MC_SVG_PATHS.d03;
                                } else {
                                    mcDecoPath = MC_SVG_PATHS.d36;
                                }
                            } else if (seqR === 3 && ubSeq < 5 && ubSeq > 0){
                                mcDecoPath = MC_SVG_PATHS.d039;
                            } else if (seqR === 5) {
                                mcDecoPath = MC_SVG_PATHS.d69;
                            } else if (seqR === 6) {
                                mcDecoPath = MC_SVG_PATHS.d09;
                            }
                            return (
                                <React.Fragment key={seq}>
                                    {ubItem}
                                    <Box>
                                        <svg className={clsx(classes.mcDeco)}>
                                            <path d={mcDecoPath} fill={nodeChecked ? "#3f51b5" : ELEMENT_BG_COLORS.Null}></path>
                                        </svg>
                                        <Tooltip title={seqMcTxt} aria-label={seqMcTxt} placement="top" classes={{ popper: clsx(classes.abilityCheckTooltip) }}>
                                            <Checkbox
                                                name={`${id}-mc-${seq}`}
                                                onClick={handleMCCheck}
                                                color="default"
                                                classes={{ root: clsx(classes.abilityCheck) }}
                                                checked={nodeChecked}
                                                icon={<img src={mcIcon.img} alt={`mc-${seq}`} className={clsx(classes.abilityIcon, classes.grayscale)} />}
                                                checkedIcon={<img src={mcIcon.img} alt={`mc-${seq}`} className={clsx(classes.abilityIcon)} />}
                                            />
                                        </Tooltip>
                                    </Box>
                                </React.Fragment>
                            )
                        })}
                    </Box>
                ))}
                {have && <Box component="div"
                    role="tabpanel"
                    style={{ display: mcIdx !== mcRanges.length ? 'none' : undefined }}
                    id={`mc-tabpanel-${mcRanges.length}`}
                    aria-labelledby={`mc-tab-${mcRanges.length}`}
                    value={mcIdx}
                    index={mcRanges.length}
                    key={mcRanges.length}
                    dir="ltr"
                    className={clsx(classes.medalTabpanel)}>
                    {MEDALS.map((medal, seq) => (
                        <Checkbox
                            key={medal}
                            onClick={handleMedalCheck}
                            checked={getMedalChecked(seq)}
                            name={`medal-${seq}`}
                            color="default"
                            classes={{ root: clsx(classes.abilityCheck) }}
                            icon={<img src={`${process.env.PUBLIC_URL}/medal_off/${medal}.png`} alt={`medal-${seq}`} className={clsx(classes.medalIcon)} />}
                            checkedIcon={<img src={`${process.env.PUBLIC_URL}/medal_on/${medal}.png`} alt={`medal-${seq}`} className={clsx(classes.medalIcon)}/>}
                        />
                    ))}
                </Box>}
            </DialogContent>
        </Dialog>
    </Grid >)
}

export function standardCardIcon(category, id, count) {
    return `${process.env.PUBLIC_URL}/${category}/${id}.png`
}

export function DragonListingItem(props) {
    const { locale, id, entry, category, have, updateHaving, deleteHaving } = props;
    const cardIconFn = props.cardIconFn || standardCardIcon;
    const classes = useStyles();

    const [editing, setEditing] = useState(false);
    const toggleEditing = (e) => { setEditing(!editing); }

    const count = have ? have.c : '';
    const validateCount = (e) => {
        const nextC = parseInt(e.target.value);
        if (isNaN(nextC) || nextC <= 0) { deleteHaving(id); }
        else { updateHaving(id, { c: nextC }); }
        e.target.focus();
    }

    const lcHaving = (e) => {
        const dh = DEFAULT_HAVE[category][entry.Rarity];
        const step = (count === '' || count < dh.c ? 1 : dh.c);
        if (!have) { updateHaving(id, dh); }
        else { updateHaving(id, { c: count + step }); }
    }
    const rcHaving = (e) => {
        if (have) {
            const nextC = count - 1;
            if (nextC <= 0) { deleteHaving(id); }
            else { updateHaving(id, { c: nextC }); }
        }
        e.preventDefault();
    }

    const CardIconDeco = () => {
        if (editing || !have) { return <React.Fragment></React.Fragment>; }
        const mub = (count / 5 >> 0);
        const r = Math.max((count - 1) % 5, 0);
        return (
            <Grid container className={classes.unbindIcons} justify="center">
                {[0, 1, 2, 3].map((i) =>
                    (<Grid key={i} item className={clsx(classes.ubIcon, (r >= 4 ? classes.ubM : (r > i ? classes.ubN : classes.ub0)))} />))}
                {count > 5 && <Grid item className={clsx(classes.ubIcon, classes.mubCount)}>{mub}</Grid>}
            </Grid>
        );
    };

    return (<BaseListingItem
        locale={locale}
        entry={entry}
        have={have}
        lcHaving={lcHaving}
        rcHaving={rcHaving}
        editing={editing}
        toggleEditing={toggleEditing}
        cardIconUrl={cardIconFn(category, id, count)}
        CardIconDeco={CardIconDeco}>
        <TextField id={`count-${id}`} label={TextLabel[locale].COUNT} value={count} onInput={validateCount} />
    </BaseListingItem>)
}

const fullWeaponHave = (entry) => {
    const build = WeaponBuild[entry.Build];
    const have = {};
    if (build) {
        have.b = {};
        for (let i of Object.keys(build)) {
            have.b[i] = build[i].length;
        }
        have.b[6] += 1;
    }
    if (entry.Passive) {
        have.p = {};
        for (let i of Object.keys(entry.Passive)) {
            have.p[i] = true;
        }
    }
    return have;
}

export const doneWeaponHave = (entry, fullWeapon) => {
    const build = WeaponBuild[entry.Build];
    if (fullWeapon && entry.Series === 4) {
        const have = {b: {}};
        for (const k in build){
            if (k === '6') {
                have.b[k] = 1;
            } else {
                have.b[k] = build[k].length;
            }
        }
        return have;
    } else if (build[5]) {
        const unbindReq = Math.max(build[5].map((b) => b.UnbindReq));
        const have = {
            b: {
                1: unbindReq,
                5: build[5].length,
                6: 1
            }
        }
        if (build[2]) {
            have.b[2] = Math.floor(Math.max(0, unbindReq - 1) / 4);
        }
        return have;
    } else if (!build[6]) {
        // special case for agito
        return fullWeaponHave(entry);
    } else {
        return { b: { 6: 1 } };
    }
}

const prereqWeaponHaves = (tempHaving, prereq, prereqHaves) => {
    prereqHaves = prereqHaves || {};
    for (let i of prereq.Create) {
        if (!tempHaving[i]) {
            prereqHaves[i] = { b: { 6: 1 } };
        }
        prereqHaves = prereqWeaponHaves(tempHaving, Weapon[i].Prereq, prereqHaves);
    }
    if (prereq.FullUp) {
        prereqHaves[prereq.FullUp] = fullWeaponHave(Weapon[prereq.FullUp]);
        prereqHaves = prereqWeaponHaves(tempHaving, Weapon[prereq.FullUp].Prereq, prereqHaves);
    }
    return prereqHaves;
}

export function WeaponListingItem(props) {
    const { locale, id, entry, category, have, updateHaving, deleteHaving } = props;
    const classes = useStyles();
    const cardName = entry[`Name${locale}`];
    let cardIconUrl = null;
    if (have && have.b[2] && have.b[2] === 2) {
        cardIconUrl = `${process.env.PUBLIC_URL}/${category}/${entry.Skins["1"]}.png`;
    } else {
        cardIconUrl = `${process.env.PUBLIC_URL}/${category}/${entry.Skins["0"]}.png`;
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const build = WeaponBuild[entry.Build];

    const createThisHaving = (newHave) => {
        // let tempHaving = updateHaving(id, newHave || doneWeaponHave(entry));
        let tempHaving = updateHaving(id, newHave || { b: { 6: 1 } });
        const prereqs = prereqWeaponHaves(tempHaving, entry.Prereq);
        for (let i of Object.keys(prereqs)) {
            tempHaving = updateHaving(i, prereqs[i], tempHaving);
        }
    }
    const lcHaving = (e) => {
        if (have) {
            const doneHave = doneWeaponHave(entry, have.b[1] >= 4);
            for (let bi of Object.keys(have.b)) {
                doneHave.b[bi] = Math.max(have.b[bi], doneHave.b[bi] || 0);
            }
            if (have.p) {
                doneHave.p = have.p;
            }
            updateHaving(id, doneHave);
        } else {
            createThisHaving();
        }
    }
    const deleteThisHaving = () => {
        if (have) {
            let tempHaving = deleteHaving(id);
            for (let i of Object.keys(tempHaving)) {
                const prereqs = prereqWeaponHaves({}, Weapon[i].Prereq);
                if (prereqs[id]) {
                    tempHaving = deleteHaving(i, tempHaving);
                }
            }
        }
    }
    const rcHaving = (e) => {
        deleteThisHaving();
        e.preventDefault();
    }
    const handleDialogCheck = (e) => {
        if (e.target.checked) {
            createThisHaving();
        } else {
            deleteThisHaving();
        }
    }
    const setBuildValues = (piece, value, have) => {
        have.b[piece] = value;
        if (piece === '1' && build[5]) {
            have.b[5] = Math.min(have.b[5] || 0, build[5].reduce((acc, cur, idx) => {
                return cur.UnbindReq > value ? acc : (idx + 1);
            }, 0));
        } else if (piece === '2') {
            have.b[1] = Math.min(have.b[1] || 0, (value + 1) * 4);
        } else {
            const unbindReq = build[piece][value - 1] ? build[piece][value - 1].UnbindReq : 0;
            have.b[1] = Math.max(have.b[1] || 0, unbindReq);
        }
        if (build[2] && piece !== '2') {
            have.b[2] = Math.max(have.b[2] || 0, Math.floor(Math.max(have.b[1] - 1) / 4));
        }
        if (have.p) {
            for (let p of Object.keys(have.p)) {
                if (entry.Passive[p].UnbindReq > have.b[1]) {
                    have.p[p] = false;
                }
            }
        }
        return have;
    }
    const makeBuildChange = (piece) => {
        return (e, value) => {
            if (have) {
                if (piece === '6' && value === 0) {
                    deleteThisHaving();
                } else {
                    updateHaving(id, setBuildValues(piece, value, have));
                }
            } else {
                const newHave = { b: { 6: 1 } };
                createThisHaving(setBuildValues(piece, value, newHave));
            }
        }
    }
    const setAbilityValues = (p, checked, have) => {
        if (!have.p) {
            have.p = {}
        }
        have.p[p] = checked;
        if (checked) {
            have.b[1] = Math.max(have.b[1] || 0, entry.Passive[p].UnbindReq);
        }
        return have;
    }
    const handleAbilityCheck = (e) => {
        const p = e.target.name.split('-').slice(-1);
        const checked = e.target.checked;
        if (have) {
            updateHaving(id, setAbilityValues(p, checked, have));
        } else {
            const newHave = { b: { 6: 1 } };
            createThisHaving(setAbilityValues(p, checked, newHave));
        }
    }

    let levelData = { Level: 0, Mats: {} };
    if (have) {
        levelData = WeaponLevel[entry.Rarity][have.b[1] || 0];
    }

    return (<Grid item>
        <Card className={clsx(classes.root, have && (classes[ELEMENTS[entry.Element]] || classes.Null))}>
            <CardActionArea onClick={lcHaving} onContextMenu={rcHaving}>
                <CardMedia
                    className={clsx(classes.cardIcon)}
                    image={cardIconUrl}
                    title={cardName} alt={cardName} >
                    {have && (<Box className={clsx(classes.mcIcon, have.b[1] === build[1].length ? classes.mcIconMaxed : (have.b[5] && classes.mcIconDone))}>
                        {levelData.Level}
                    </Box>)}
                </CardMedia>
            </CardActionArea>
            <CardContent className={clsx(classes.cardName)}>
                <Button
                    className={clsx(classes.cardNameText, locale !== 'EN' && classes.cardNameNoWrap)}
                    size="small"
                    onClick={handleOpen}
                    endIcon={<AddIcon />}>
                    {insertLinebreak(cardName, locale)}
                </Button>
            </CardContent>
        </Card>
        <Dialog onClose={handleClose} aria-labelledby={`${category}-${id}-dialog`} open={open}>
            <DialogTitle id={`${category}-${id}-dialog`} onClose={handleClose}>
                <FormControlLabel
                    control={<Checkbox name={`${id}-create`}
                        checked={!!(have)}
                        onClick={handleDialogCheck}
                        color="default"
                        icon={<img src={cardIconUrl} alt={cardName} className={clsx(classes.dialogIcon, classes.grayscale)} />}
                        checkedIcon={<img src={cardIconUrl} alt={cardName} className={clsx(classes.dialogIcon)} />} />}
                    label={<Box><Typography variant="overline" display="block">{WeaponSeries[entry.Series][`Name${locale}`]}</Typography><Typography>{cardName}</Typography></Box>}
                />
            </DialogTitle>
            {build && (<DialogContent dividers>
                {Object.keys(build).map((piece) => {
                    const buildInfo = build[piece];
                    const buildpiece = TextLabel[locale][`BUILDUP_${piece}`];
                    const buildvalue = (have && have.b) ? (have.b[piece] || 0) : 0;
                    return (
                        <Box key={piece}>
                            <Typography id="build-slider" gutterBottom>
                                {buildpiece + ' - ' + buildvalue}
                            </Typography>
                            <Slider
                                name={`${id}-build-${piece}`}
                                aria-labelledby="build-slider"
                                valueLabelDisplay="auto"
                                value={buildvalue}
                                onChange={makeBuildChange(piece)}
                                step={1}
                                marks
                                min={0}
                                max={piece === '6' ? 4 : buildInfo.length}
                                classes={{ colorPrimary: classes[`Fg${ELEMENTS[entry.Element]}`] || classes.FgNull }}
                            />
                        </Box>
                    )
                })}
            </DialogContent>)}
            {entry.Passive && (< DialogContent dividers>
                {Object.keys(entry.Passive).map((p) => {
                    const passive = entry.Passive[p];
                    const abilityName = passive.Ability[`Name${locale}`];
                    const iconPath = `${process.env.PUBLIC_URL}/ability/${passive.Ability.Icon}.png`;
                    return (
                        <Tooltip key={p} title={abilityName} aria-label={abilityName} placement="top" classes={{ popper: clsx(classes.abilityCheckTooltip) }}>
                            <Checkbox
                                name={`${id}-passive-${p}`}
                                onClick={handleAbilityCheck}
                                color="default"
                                classes={{ root: clsx(classes.abilityCheck) }}
                                checked={!!(have && have.p && have.p[p])}
                                icon={<img src={iconPath} alt={abilityName} className={clsx(classes.abilityIcon, classes.grayscale)} />}
                                checkedIcon={<img src={iconPath} alt={abilityName} className={clsx(classes.abilityIcon)} />}
                            />
                        </Tooltip>
                    )
                })}
            </DialogContent>)}
        </Dialog>
    </Grid >)
}

export function MaterialSummaryItem(props) {
    const { m, count, name } = props;
    const classes = useStyles();
    return (
        <Grid item>
            <Card>
                <CardMedia
                    className={clsx(classes.cardCountIcon)}
                    image={`${process.env.PUBLIC_URL}/material/${m}.png`}
                    title={name} alt={name} >
                </CardMedia>
                <CardContent className={clsx(classes.cardCount)}>
                    <Typography align="center" className={clsx(classes.cardCountText)} display="block">x {count}</Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}

export const fortMaxNum = (entry) => {
    if (entry.NameEN === 'Rupie Mine') {
        return 4;
    }
    if (entry.NameEN.endsWith('Altar') || entry.NameEN.endsWith('Dojo')) {
        return 2;
    }
    return 1
}

export function FortListingItem(props) {
    const { locale, id, entry, category, have, updateHaving, deleteHaving } = props;
    const classes = useStyles();
    const cardName = entry[`Name${locale}`];
    let cardIconUrl = null;
    if (have) {
        const maxHave = Math.max(...Object.values(have));
        if (maxHave <= 0) {
            deleteHaving(id);
            cardIconUrl = `${process.env.PUBLIC_URL}/${category}/${entry.Detail[0].Icon}.png`;
        } else {
            cardIconUrl = `${process.env.PUBLIC_URL}/${category}/${entry.Detail[maxHave - 1].Icon}.png`;
        }
    } else {
        cardIconUrl = `${process.env.PUBLIC_URL}/${category}/${entry.Detail[0].Icon}.png`;
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const maxLv = entry.Detail.length;
    const maxNum = fortMaxNum(entry);

    const lcHaving = (e) => {
        if (have) {
            updateHaving(id, (new Array(maxNum)).fill(maxLv));
        } else {
            updateHaving(id, (new Array(maxNum)).fill(1));
        }
    }
    const rcHaving = (e) => {
        deleteHaving(id);
        e.preventDefault();
    }
    const handleDialogCheck = (e) => {
        if (e.target.checked) {
            updateHaving(id, (new Array(maxNum)).fill(1));
        } else {
            deleteHaving(id);
        }
    }
    const makeLevelChange = (idx) => {
        return (e, value) => {
            if (have) {
                have[idx] = value;
                updateHaving(id, have);
            } else {
                const newHave = (new Array(maxNum)).fill(0);
                newHave[idx] = value;
                updateHaving(id, newHave);
            }
        }
    }

    return (<Grid item>
        <Card className={clsx(classes.root, have && (classes[ELEMENTS[entry.Element]] || classes.Null))}>
            <CardActionArea onClick={lcHaving} onContextMenu={rcHaving}>
                <CardMedia
                    className={clsx(classes.cardIcon)}
                    image={cardIconUrl}
                    title={cardName} alt={cardName} >
                    {have && (Object.keys(have).map((key) => (<Box key={key} className={clsx(classes.circleIcon, classes[`circleIcon${key}`], (have[key] >= maxLv) && classes.circleIconMaxed)}>{have[key]}</Box>)))}
                </CardMedia>
            </CardActionArea>
            <CardContent className={clsx(classes.cardName)}>
                <Button
                    className={clsx(classes.cardNameText, locale !== 'EN' && classes.cardNameNoWrap)}
                    size="small"
                    onClick={handleOpen}
                    endIcon={<AddIcon />}>
                    {insertLinebreak(cardName, locale)}
                </Button>
            </CardContent>
        </Card>
        <Dialog onClose={handleClose} aria-labelledby={`${category}-${id}-dialog`} open={open} fullWidth={true}
        >
            <DialogTitle id={`${category}-${id}-dialog`} onClose={handleClose}>
                <FormControlLabel
                    control={<Checkbox name={`${id}-create`}
                        checked={!!(have)}
                        onClick={handleDialogCheck}
                        color="default"
                        icon={<img src={cardIconUrl} alt={cardName} className={clsx(classes.dialogIcon, classes.grayscale)} />}
                        checkedIcon={<img src={cardIconUrl} alt={cardName} className={clsx(classes.dialogIcon)} />} />}
                    label={<Box><Typography>{cardName}</Typography></Box>}
                />
            </DialogTitle>
            <DialogContent dividers>
                {Array(maxNum).fill(0).map((_, idx) => {
                    const currentLevel = have ? have[idx] : 0;
                    return (
                        <Box key={idx}>
                            <Typography id="level-slider" gutterBottom>
                                {`${cardName} ${(idx + 1)} - Lv.${currentLevel}`}
                            </Typography>
                            <Slider
                                name={`${id}-level-${idx + 1}`}
                                aria-labelledby="level-slider"
                                valueLabelDisplay="auto"
                                value={currentLevel}
                                onChange={makeLevelChange(idx)}
                                step={1}
                                marks
                                min={0}
                                max={maxLv}
                            />
                        </Box>
                    )
                })}
            </DialogContent>
        </Dialog>
    </Grid >)
}

const fullAmuletHave = (entry) => {
    const build = AmuletBuild[entry.Build];
    const have = {};
    if (build) {
        have.b = {};
        for (let i of Object.keys(build)) {
            have.b[i] = build[i].length;
        }
        have.b[6] += 1;
    }
    return have;
}

export const doneAmuletHave = (entry, fullCopies) => {
    const doneHave = fullAmuletHave(entry);
    if (!fullCopies) {
        doneHave.b[6] = 1;
    }
    return doneHave;
}

export function AmuletListingItem(props) {
    const { locale, id, entry, category, have, updateHaving, deleteHaving } = props;
    const classes = useStyles();
    const cardName = entry[`Name${locale}`];
    let cardIconUrl = null;
    if ((!entry.NoRefine) && have && have.b[1] && have.b[1] >= 2) {
        cardIconUrl = `${process.env.PUBLIC_URL}/${category}/${entry.BaseId}_02.png`;
    } else {
        cardIconUrl = `${process.env.PUBLIC_URL}/${category}/${entry.BaseId}_01.png`;
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const build = AmuletBuild[entry.Build];

    const createThisHaving = (newHave) => {
        updateHaving(id, newHave || { b: { 6: 1 } });
    }
    const lcHaving = (e) => {
        if (have) {
            const doneHave = doneAmuletHave(entry, have.b[1] === 4);
            for (let bi of Object.keys(have.b)) {
                doneHave.b[bi] = Math.max(have.b[bi], doneHave.b[bi] || 0);
            }
            updateHaving(id, doneHave);
        } else {
            createThisHaving();
        }
    }
    const deleteThisHaving = () => {
        if (have) {
            deleteHaving(id);
        }
    }
    const rcHaving = (e) => {
        deleteThisHaving();
        e.preventDefault();
    }
    const handleDialogCheck = (e) => {
        if (e.target.checked) {
            createThisHaving();
        } else {
            deleteThisHaving();
        }
    }
    const setBuildValues = (piece, value, have) => {
        have.b[piece] = value;
        // const unbindReq = build[piece][value - 1] ? build[piece][value - 1].UnbindReq : 0;
        // have.b[1] = Math.max(have.b[1] || 0, unbindReq);
        return have;
    }
    const makeBuildChange = (piece) => {
        return (e, value) => {
            if (have) {
                if (piece === '6' && value === 0) {
                    deleteThisHaving();
                } else {
                    updateHaving(id, setBuildValues(piece, value, have));
                }
            } else {
                const newHave = { b: { 6: 1 } };
                createThisHaving(setBuildValues(piece, value, newHave));
            }
        }
    }

    let levelData = { Level: 0, Mats: {} };
    if (have) {
        levelData = AmuletLevel[entry.Rarity][have.b[1] || 0];
    }

    return (<Grid item>
        <Card className={clsx(classes.root, have && (classes[ELEMENTS[entry.Element]] || classes.Null))}>
            <CardActionArea onClick={lcHaving} onContextMenu={rcHaving}>
                <CardMedia
                    className={clsx(classes.cardIcon)}
                    image={cardIconUrl}
                    title={cardName} alt={cardName} >
                    {have && (
                        <Box className={clsx(classes.mcIconAmulet, classes.mcIcon, have.b[1] === 4 && (have.b[6] === 4 ? classes.mcIconMaxed : classes.mcIconDone))}>
                            {levelData.Level}</Box>
                    )}
                    <Box className={clsx(classes.amuletAbIcon)}><img alt={entry.AbIcon} src={`${process.env.PUBLIC_URL}/ability/${entry.AbIcon}.png`} /></Box>
                    {entry.Union && (<Box className={clsx(classes.unionIcon)}><img alt={`Union_${entry.Union}`} src={`${process.env.PUBLIC_URL}/ui/${unionIcon(entry.Union)}.png`} /></Box>)}
                </CardMedia>
            </CardActionArea>
            <CardContent className={clsx(classes.cardName)}>
                <Button
                    className={clsx(classes.cardNameText, locale !== 'EN' && classes.cardNameNoWrap)}
                    size="small"
                    onClick={handleOpen}
                    endIcon={<AddIcon />}>
                    {insertLinebreak(cardName, locale)}
                </Button>
            </CardContent>
        </Card>
        <Dialog onClose={handleClose} aria-labelledby={`${category}-${id}-dialog`} open={open}>
            <DialogTitle id={`${category}-${id}-dialog`} onClose={handleClose}>
                <FormControlLabel
                    control={<Checkbox name={`${id}-create`}
                        checked={!!(have)}
                        onClick={handleDialogCheck}
                        color="default"
                        icon={<img src={cardIconUrl} alt={cardName} className={clsx(classes.dialogIcon, classes.grayscale)} />}
                        checkedIcon={<img src={cardIconUrl} alt={cardName} className={clsx(classes.dialogIcon)} />} />}
                    label={<Box><Typography>{cardName}</Typography></Box>}
                />
            </DialogTitle>
            {build && (<DialogContent dividers>
                {Object.keys(build).map((piece) => {
                    const buildInfo = build[piece];
                    const buildpiece = TextLabel[locale][`BUILDUP_${piece}`];
                    const buildvalue = (have && have.b) ? (have.b[piece] || 0) : 0;
                    return (
                        <Box key={piece}>
                            <Typography id="build-slider" gutterBottom>
                                {buildpiece + ' - ' + buildvalue}
                            </Typography>
                            <Slider
                                name={`${id}-build-${piece}`}
                                aria-labelledby="build-slider"
                                valueLabelDisplay="auto"
                                value={buildvalue}
                                onChange={makeBuildChange(piece)}
                                step={1}
                                marks
                                min={0}
                                max={piece === '6' ? 4 : buildInfo.length}
                                classes={{ colorPrimary: classes.FgNull }}
                            />
                        </Box>
                    )
                })}
            </DialogContent>)}
        </Dialog>
    </Grid >)
}
