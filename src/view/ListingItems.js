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

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

import TextLabel from '../data/locale.json';
import Weapon from '../data/weapon.json';
import WeaponSeries from '../data/weaponseries.json';
import WeaponBuild from '../data/weaponbuild.json';
import { ELEMENTS, ELEMENT_BG_COLORS, ELEMENT_FG_COLORS, DEFAULT_HAVE } from '../data/Mapping';

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
        left: 4
    },
    mcIconMaxed: {
        color: '#ffcc00'
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

export function CharaListingItem(props) {
    const { locale, id, entry, have, updateHaving, deleteHaving } = props;
    const classes = useStyles();

    const [editing, setEditing] = useState(false);
    const toggleEditing = (e) => { setEditing(!editing); }

    const maxLevel = entry.Spiral ? 100 : 80;
    const lv = have ? have.lv : '';
    const validateLv = (e) => {
        const level = parseInt(e.target.value);
        let nextLevel = level;
        if (isNaN(level) || level < 1) { nextLevel = ''; }
        else if (level > maxLevel) { nextLevel = maxLevel; }
        if (nextLevel) {
            if (have) { updateHaving(id, { lv: nextLevel }); }
            else { updateHaving(id, { lv: nextLevel, mc: 1 }); }
        } else { deleteHaving(id); }
        updateRarity();
    }

    const maxManaCircle = entry.Spiral ? 70 : 50;
    const mc = have ? have.mc : '';
    const validateMc = (e) => {
        const manaCircle = parseInt(e.target.value);
        let nextMc = manaCircle;
        if (isNaN(manaCircle) || manaCircle < 1) { nextMc = ''; }
        else if (manaCircle > maxManaCircle) { nextMc = maxManaCircle; }
        if (nextMc) {
            if (have) { updateHaving(id, { mc: nextMc }); }
            else { updateHaving(id, { lv: 1, mc: nextMc }); }
            updateHaving(id, { mc: nextMc });
        } else { deleteHaving(id); }
        updateRarity();
    }

    const minRarity = entry.Rarity;
    const [rarity, setRarity] = useState(entry.Rarity);
    const updateRarity = () => {
        if (minRarity === 5) { return; }
        if (minRarity < 5 && (lv > 70 || mc > 40)) { setRarity(5); return; }
        if (minRarity < 4 && (lv > 60 || mc > 30)) { setRarity(4); return; }
        setRarity(minRarity);
    }

    const setMaxHave = () => {
        setRarity(5);
        const nextHave = { lv: maxLevel, mc: maxManaCircle };
        updateHaving(id, nextHave);
    }

    const setDefaultHave = () => {
        setRarity(minRarity);
        const nextHave = DEFAULT_HAVE.chara[minRarity];
        updateHaving(id, nextHave);
    }

    const lcHaving = (e) => {
        if (!have || (have.lv === maxLevel && have.mc === maxManaCircle)) { setDefaultHave(); }
        else { setMaxHave(); }
    }
    const rcHaving = (e) => {
        if (have) { setRarity(minRarity); deleteHaving(id); }
        e.preventDefault();
    }

    const CardIconDeco = () => (
        <React.Fragment>
            {(!editing && have ? (have.mc > 0) : false) &&
                <Box className={clsx(classes.mcIcon, have.mc === maxManaCircle && classes.mcIconMaxed)}>{mc}</Box>
            }
        </React.Fragment>
    );

    return (<BaseListingItem
        locale={locale}
        entry={entry}
        have={have}
        lcHaving={lcHaving}
        rcHaving={rcHaving}
        editing={editing}
        toggleEditing={toggleEditing}
        cardIconUrl={`${process.env.PUBLIC_URL}/chara/${id}_r0${rarity}.png`}
        CardIconDeco={CardIconDeco}>
        <TextField label="Lv" value={lv} onInput={validateLv.bind(this)} />
        <TextField label="MC" value={mc} onInput={validateMc.bind(this)} />
    </BaseListingItem>)
}

export function standardCardIcon(category, id, count) {
    return `${process.env.PUBLIC_URL}/${category}/${id}.png`
}

export function amuletCardIcon(category, id, count) {
    if (count > 3) { return `${process.env.PUBLIC_URL}/${category}/${id}_02.png`; }
    else { return `${process.env.PUBLIC_URL}/${category}/${id}_01.png`; }
}

export function UnbindableListingItem(props) {
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
                    (<Grid item className={clsx(classes.ubIcon, (r >= 4 ? classes.ubM : (r > i ? classes.ubN : classes.ub0)))} />))}
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

export const doneWeaponHave = (entry) => {
    const build = WeaponBuild[entry.Build];
    if (build[5]) {
        const unbindReq = Math.max(build[5].map((b) => b.UnbindReq));
        const have = {
            b: {
                1: unbindReq,
                5: build[5].length,
                6: 1
            }
        }
        if (entry.Series === 4) {
            have.b[1] = build[1].length;
            if (build[3]) {
                have.b[3] = build[3].length;
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
    const cardIconUrl = `${process.env.PUBLIC_URL}/${category}/${entry.Skins["0"]}.png`;

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
            const doneHave = doneWeaponHave(entry);
            for (let bi of Object.keys(have.b)) {
                doneHave.b[bi] = Math.max(have.b[bi], doneHave.b[bi] || 0);
            }
            if (have.p) {
                doneHave.p = have.p;
            }
            console.log(doneHave);
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
        console.log(e.target.name);
        const p = e.target.name.split('-').slice(-1);
        const checked = e.target.checked;
        if (have) {
            updateHaving(id, setAbilityValues(p, checked, have));
        } else {
            const newHave = { b: { 6: 1 } };
            createThisHaving(setAbilityValues(p, checked, newHave));
        }
    }

    return (<Grid item>
        <Card className={clsx(classes.root, have && (classes[ELEMENTS[entry.Element]] || classes.Null))}>
            <CardActionArea onClick={lcHaving} onContextMenu={rcHaving}>
                <CardMedia
                    className={clsx(classes.cardIcon)}
                    image={cardIconUrl}
                    title={cardName} alt={cardName} >
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
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
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
                    const buildvalue = (have && have.b) ? (have.b[piece] || 0) : 0
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
