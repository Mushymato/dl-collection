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

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TextLabel from '../data/locale.json';
import { ELEMENTS, ELEMENT_COLORS, DEFAULT_HAVE } from '../data/Mapping';

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
    cardName: {
        padding: 0,
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

    Flame: { backgroundColor: ELEMENT_COLORS.Flame },
    Water: { backgroundColor: ELEMENT_COLORS.Water },
    Wind: { backgroundColor: ELEMENT_COLORS.Wind },
    Light: { backgroundColor: ELEMENT_COLORS.Light },
    Shadow: { backgroundColor: ELEMENT_COLORS.Shadow },
    Null: { backgroundColor: ELEMENT_COLORS.Null }
});

const insertLinebreak = (name, locale) => {
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