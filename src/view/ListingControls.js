import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Popover from '@material-ui/core/Popover';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';

import TextLabel from '../data/locale.json';

import Chara from '../data/chara.json';
import ManaCircle from '../data/manacircle.json';
import CharaLimitBreak from '../data/charalimitbreak.json';

import Weapon from '../data/weapon.json';
import WeaponBuild from '../data/weaponbuild.json';
import WeaponLevel from '../data/weaponlevel.json';

import Amulet from '../data/amulet.json';
import AmuletBuild from '../data/amuletbuild.json';
import AmuletLevel from '../data/amuletlevel.json';

import Fort from '../data/fort.json';
import Material from '../data/material.json';

import { ELEMENTS, WEAPONS, FORMS, unionIcon } from '../data/Mapping';
import { doneWeaponHave, doneAmuletHave, doneCharaHave, fortMaxNum, MaterialSummaryItem } from './ListingItems';

const useStyles = makeStyles({
    root: {
        marginTop: 5,
        marginBottom: 5,
        padding: 10
    },
    sortSelect: {
        width: 120,
    },
    radioGroup: {
        display: 'block',
        marginLeft: 5
    },
    fieldsetTitle: {
        fontSize: '0.7em',
        textTransform: 'uppercase',
        marginBottom: 5
    },
    radioRoot: {
        margin: 0,
        padding: 0
    },
    radioIcon: {
        height: 25
    },
    unchecked: {
        opacity: 0.5
    },
    availButton: {
        width: '100%',
        maxWidth: 200,
        textTransform: 'none'
    },
    availChecks: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    costTitle: {
        minHeight: '2.5em',
        '& img': {
            width: 30,
            verticalAlign: 'middle'
        }
    },
    maxToggle: {
        float: "right",
        position: "relative",
        top: -4
    },
    tristateCheck: {
        width: 90,
        height: 30,
    },
    tristateCheckLabel: {
        lineHeight: 1,
    }
});


function WeaponMaterialSummation(props) {
    const { locale, having, visible } = props;
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [maxWeapon, setMaxWeapon] = React.useState("Weapons Maxed");
    const isMaxWeapon = maxWeapon === "Weapons Maxed";

    const toggleOpen = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const toggleMaxWeapon = (event) => {
        if (isMaxWeapon) {
            setMaxWeapon("Weapon Bonus Only");
        } else {
            setMaxWeapon("Weapons Maxed");
        }
    }

    let totalCost = 0;
    const totalMats = {};
    for (let id of visible) {
        const entry = Weapon[id];
        const currHave = having[id];
        const doneHave = doneWeaponHave(entry, entry.Rarity === 6 && isMaxWeapon);
        const build = WeaponBuild[entry.Build];
        if (currHave) {
            for (let bi of Object.keys(doneHave.b)) {
                if (!build[bi] || doneHave.b[bi] <= currHave.b[bi]) { continue; }
                for (const bs of build[bi].slice(currHave.b[bi] ? ((bi === '6') ? currHave.b[bi] - 1 : currHave.b[bi]) : 0, doneHave.b[bi])) {
                    totalCost += bs.Cost;
                    for (let m of Object.keys(bs.Mats)) {
                        if (!totalMats[m]) { totalMats[m] = 0; }
                        totalMats[m] += bs.Mats[m];
                    }
                }
            }
            const currLevelMats = WeaponLevel[entry.Rarity][currHave.b[1] || 0].Mats;
            const doneLevelMats = WeaponLevel[entry.Rarity][doneHave.b[1] || 0].Mats;
            for (let m of Object.keys(doneLevelMats)) {
                if (currLevelMats[m]) {
                    const diff = doneLevelMats[m] - currLevelMats[m];
                    if (diff > 0) {
                        totalMats[m] = diff;
                    }
                } else {
                    totalMats[m] = doneLevelMats[m];
                }
            }
        } else {
            totalCost += entry.Cost;
            for (let m of Object.keys(entry.Mats)) {
                if (!totalMats[m]) { totalMats[m] = 0; }
                totalMats[m] += entry.Mats[m];
            }
            for (let bi of Object.keys(doneHave.b)) {
                if (!build[bi] || bi === '6') { continue; }
                for (const bs of build[bi].slice(0, doneHave.b[bi])) {
                    totalCost += bs.Cost;
                    for (let m of Object.keys(bs.Mats)) {
                        if (!totalMats[m]) { totalMats[m] = 0; }
                        totalMats[m] += bs.Mats[m];
                    }
                }
            }
            const doneLevelMats = WeaponLevel[entry.Rarity][doneHave.b[1] || 0].Mats;
            for (let m of Object.keys(doneLevelMats)) {
                if (!totalMats[m]) { totalMats[m] = 0; }
                totalMats[m] = doneLevelMats[m];
            }
        }
    }
    const sorted = Object.keys(totalMats).sort((a, b) => (Material[a].SortId - Material[b].SortId));

    return (
        <Grid item>
            <Button onClick={toggleOpen(true)} variant="outlined" className={classes.availButton}>{TextLabel[locale].MATS}</Button>
            <Dialog anchor={'bottom'} open={open} onClose={toggleOpen(false)} maxWidth="lg">
                <DialogContent className={clsx(classes.costTitle)}>
                    <img src={`${process.env.PUBLIC_URL}/ui/rupee.png`} alt="cost" />
                    <Typography display="inline" gutterBottom>   {totalCost.toLocaleString()}</Typography>
                    <Button
                        onClick={toggleMaxWeapon}
                        name="maxWeapon"
                        variant="outlined"
                        className={clsx(classes.maxToggle)}
                    >{maxWeapon}</Button>
                </DialogContent>
                <DialogContent dividers>
                    <Grid container spacing={1} alignItems="flex-start" justify="flex-start" wrap="wrap">
                        {sorted.map((m) => (
                            <MaterialSummaryItem
                                key={m}
                                m={m}
                                count={totalMats[m]}
                                name={Material[m][`Name${locale}`]}
                            />
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}


function FortMaterialSummation(props) {
    const { locale, having, visible } = props;
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const toggleOpen = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    let totalCost = 0;
    let totalTime = 0;
    const totalMats = {};
    for (let id of visible) {
        const entry = Fort[id];
        const currHave = having[id];
        let currIter = null;
        if (currHave) {
            currIter = Object.values(currHave);
        } else {
            currIter = Array(fortMaxNum(entry)).fill(0);
        }
        for (const curLv of currIter) {
            for (const detail of entry.Detail.slice(curLv)) {
                totalCost += detail.Cost;
                totalTime += detail.Time;
                for (let m of Object.keys(detail.Mats)) {
                    if (!totalMats[m]) { totalMats[m] = 0; }
                    totalMats[m] += detail.Mats[m];
                }
            }
        }
    }
    const sorted = Object.keys(totalMats).sort((a, b) => (Material[a].SortId - Material[b].SortId));

    return (
        <Grid item>
            <Button onClick={toggleOpen(true)} variant="outlined" className={classes.availButton}>{TextLabel[locale].MATS}</Button>
            <Dialog anchor={'bottom'} open={open} onClose={toggleOpen(false)} maxWidth="lg">
                <DialogContent className={clsx(classes.costTitle)}>
                    <img src={`${process.env.PUBLIC_URL}/ui/rupee.png`} alt="cost" />
                    <Typography display="inline" gutterBottom> {totalCost.toLocaleString()}</Typography>
                    <QueryBuilderIcon style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                    <Typography display="inline" gutterBottom> {totalTime.toLocaleString()}s</Typography>
                </DialogContent>
                <DialogContent dividers>
                    <Grid container spacing={1} alignItems="flex-start" justify="flex-start" wrap="wrap">
                        {sorted.map((m) => (
                            <MaterialSummaryItem
                                key={m}
                                m={m}
                                count={totalMats[m]}
                                name={Material[m][`Name${locale}`]}
                            />
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}


function AmuletMaterialSummation(props) {
    const { locale, having, visible } = props;
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [fullCopies, setFullCopies] = React.useState("4 Copies");
    const isFullCopies = fullCopies === "4 Copies";

    const toggleOpen = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const toggleFullCopies = (event) => {
        if (isFullCopies) {
            setFullCopies("1 Copy");
        } else {
            setFullCopies("4 Copies");
        }
    }

    let totalCost = 0;
    const totalMats = {};
    for (let id of visible) {
        const entry = Amulet[id];
        const currHave = having[id];
        const doneHave = doneAmuletHave(entry, isFullCopies);
        const build = AmuletBuild[entry.Build];
        const entryMats = {};
        if (currHave) {
            for (let bi of Object.keys(doneHave.b)) {
                if (doneHave.b[bi] <= currHave.b[bi]) { continue; }
                for (const bs of build[bi].slice(currHave.b[bi] ? ((bi === '6') ? currHave.b[bi] -1 : currHave.b[bi]) : 0, doneHave.b[bi])) {
                    totalCost += bs.Cost;
                    for (let m of Object.keys(bs.Mats)) {
                        if (!entryMats[m]) { entryMats[m] = 0; }
                        entryMats[m] += bs.Mats[m];
                    }
                }
            }
            const currLevelMats = AmuletLevel[entry.Rarity][currHave.b[1] || 0].Mats;
            const doneLevelMats = AmuletLevel[entry.Rarity][doneHave.b[1] || 0].Mats;
            for (let m of Object.keys(doneLevelMats)) {
                if (currLevelMats[m]) {
                    const diff = doneLevelMats[m] - currLevelMats[m];
                    if (diff > 0) {
                        entryMats[m] = diff;
                    }
                } else {
                    entryMats[m] = doneLevelMats[m];
                }
            }
        } else {
            totalCost += entry.Cost;
            for (let bi of Object.keys(doneHave.b)) {
                for (const bs of build[bi].slice(0, doneHave.b[bi])) {
                    totalCost += bs.Cost;
                    for (let m of Object.keys(bs.Mats)) {
                        if (!entryMats[m]) { entryMats[m] = 0; }
                        entryMats[m] += bs.Mats[m];
                    }
                }
            }
            const doneLevelMats = AmuletLevel[entry.Rarity][doneHave.b[1] || 0].Mats;
            for (let m of Object.keys(doneLevelMats)) {
                if (!entryMats[m]) { entryMats[m] = 0; }
                entryMats[m] += doneLevelMats[m];
            }
        }
        for (let m of Object.keys(entryMats)) {
            const tm = entry[m] ? entry[m] : m;
            if (!totalMats[tm]) { totalMats[tm] = 0; }
            totalMats[tm] += entryMats[m];
        }
    }
    const sorted = Object.keys(totalMats).sort((a, b) => (Material[a].SortId - Material[b].SortId));

    return (
        <Grid item>
            <Button onClick={toggleOpen(true)} variant="outlined" className={classes.availButton}>{TextLabel[locale].MATS}</Button>
            <Dialog anchor={'bottom'} open={open} onClose={toggleOpen(false)} maxWidth="lg">
                <DialogContent className={clsx(classes.costTitle)}>
                    <img src={`${process.env.PUBLIC_URL}/ui/eldwater.png`} alt="eldwater" />
                    <Typography display="inline" gutterBottom>   {totalCost.toLocaleString()}</Typography>
                    <Button
                        onClick={toggleFullCopies}
                        name="fullCopies"
                        variant="outlined"
                        className={clsx(classes.maxToggle)}
                    >{fullCopies}</Button>
                </DialogContent>
                <DialogContent dividers>
                    <Grid container spacing={1} alignItems="flex-start" justify="flex-start" wrap="wrap">
                        {sorted.map((m) => (
                            <MaterialSummaryItem
                                key={m}
                                m={m}
                                count={totalMats[m]}
                                name={Material[m][`Name${locale}`]}
                            />
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}


function CharaMaterialSummation(props) {
    const { locale, having, visible } = props;
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const toggleOpen = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const totalCosts = {Mana: 0, Eldwater: 0};
    const totalMats = {};
    for (let id of visible) {
        const currHave = having[id];
        if (currHave && (currHave.no === undefined || currHave.ub === undefined)) { continue; }
        if (!currHave) { continue; }
        const entry = Chara[id];
        const doneHave = doneCharaHave(entry, 5);
        const mcInfo = ManaCircle[entry.MCName];
        const clbInfo = CharaLimitBreak[entry.LimitBreak];
        const entryMats = {};
        const useGrow = entry.GrowEnd && Date.now() < entry.GrowEnd;

        // unbind mats
        if (useGrow) { entryMats['Grow'] = 0; }
        for (let ub = currHave.ub + 1; ub <= doneHave.ub; ub += 1) {
            if (useGrow && clbInfo[ub].Grow){
                entryMats['Grow'] += clbInfo[ub].Grow;
            } else {
                for (let m of Object.keys(clbInfo[ub].Mats)) {
                    if (!entryMats[m]) { entryMats[m] = 0; }
                    entryMats[m] += clbInfo[ub].Mats[m];
                }
            }
        }
        if (entry.Rarity < 4 && currHave.ub < 3){
            totalCosts.Eldwater += 2500;
        }
        if (entry.Rarity < 5 && currHave.ub < 4){
            totalCosts.Eldwater += 25000;
        }

        const calcNodeMats = (n) => {
            const mcItem = mcInfo[n];
            if (useGrow && mcItem.Mats.Grow){
                entryMats['Grow'] += mcItem.Mats.Grow;
            } else {
                totalCosts.Mana += mcItem.Mana;
                for (let m of Object.keys(mcItem.Mats)) {
                    if (!entryMats[m]) { entryMats[m] = 0; }
                    entryMats[m] += mcItem.Mats[m];
                }
                const mcEle = mcItem.Ele[entry.MCEle];
                if (mcEle){
                    totalCosts.Eldwater += mcEle.Eldwater;
                    for (let m of Object.keys(mcEle.Mats)) {
                        if (!entryMats[m]) { entryMats[m] = 0; }
                        entryMats[m] += mcEle.Mats[m];
                    }    
                }
            }
        }
        // mc node mats
        if (currHave.ub === doneHave.ub){
            for (let n of doneHave.no.filter((n) => !(currHave.no.includes(n)))) {
                calcNodeMats(n + doneHave.ub * 10);
            }
        } else {
            for (let n of Array.from({ length: (currHave.ub < 5 ? 10 : 20) }, (_, i) => i + 1).filter((n) => !(currHave.no.includes(n)))) {
                calcNodeMats(n + currHave.ub * 10);
            }
            for (let n = (currHave.ub + 1) * 10; n < doneHave.ub * 10; n += 1) {
                calcNodeMats(n);
            }
            for (let n of doneHave.no) {
                calcNodeMats(n + doneHave.ub * 10);
            }    
        }

        for (let m of Object.keys(entryMats)) {
            const tm = entry[m] ? entry[m] : m;
            if (!totalMats[tm]) { totalMats[tm] = 0; }
            totalMats[tm] += entryMats[m];
        }
    }
    const sorted = Object.keys(totalMats).sort((a, b) => (Material[a].SortId - Material[b].SortId));

    return (
        <Grid item>
            <Button onClick={toggleOpen(true)} variant="outlined" className={classes.availButton}>{TextLabel[locale].MATS}</Button>
            <Dialog anchor={'bottom'} open={open} onClose={toggleOpen(false)} maxWidth="lg">
                <DialogContent className={clsx(classes.costTitle)}>
                    <Typography display="inline" gutterBottom><img src={`${process.env.PUBLIC_URL}/ui/mana.png`} alt="mana" />   {totalCosts.Mana.toLocaleString()}    <img src={`${process.env.PUBLIC_URL}/ui/eldwater.png`} alt="eldwater" />   {totalCosts.Eldwater.toLocaleString()}</Typography>
                </DialogContent>
                <DialogContent dividers>
                    <Grid container spacing={1} alignItems="flex-start" justify="flex-start" wrap="wrap">
                        {sorted.map((m) => (
                            <MaterialSummaryItem
                                key={m}
                                m={m}
                                count={totalMats[m]}
                                name={Material[m][`Name${locale}`]}
                            />
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}


function ListingControls(props) {
    const {
        locale, minRarity, maxRarity,
        sort, handleSort, sortOptions,
        order, toggleOrder,
        majorityHaving, toggleAllHaving,
        addFilter, removeFilter, modifyFilter,
        filters, radioFilters,
        availabilities, series,
        storeKey, having, visible
    } = props;
    const classes = useStyles();

    const [haveState, setHaveState] = React.useState(filters.ifHave ? 'HAVE' : (filters.ifNotHave ? 'NOT_HAVE' : 'ALL'));
    const nextHaveState = (e) => {
        const newFilters = { ...filters };
        delete newFilters['ifHave'];
        delete newFilters['ifNotHave'];
        switch (haveState) {
            case 'ALL':
                setHaveState('HAVE');
                newFilters['ifHave'] = true;
                break;
            case 'HAVE':
                setHaveState('NOT_HAVE');
                newFilters['ifNotHave'] = true;
                break;
            case 'NOT_HAVE':
            default:
                setHaveState('ALL');
                break;
        }
        modifyFilter(newFilters);
    }

    const [maxedState, setMaxedState] = React.useState(filters.ifMaxed ? 'MAXED' : (filters.ifNotMaxed ? 'NOT_MAXED' : 'ALL'));
    const nextMaxedState = (e) => {
        const newFilters = { ...filters };
        delete newFilters['ifMaxed'];
        delete newFilters['ifNotMaxed'];
        switch (maxedState) {
            case 'ALL':
                setMaxedState('MAXED');
                newFilters['ifMaxed'] = true;
                break;
            case 'MAXED':
                setMaxedState('NOT_MAXED');
                newFilters['ifNotMaxed'] = true;
                break;
            case 'NOT_MAXED':
            default:
                setMaxedState('ALL');
                break;
        }
        modifyFilter(newFilters);
    }

    const radioFilterValues = {
        'Element': ELEMENTS,
        'Weapon': WEAPONS,
        "Form": FORMS,
        "Union": [...Array(12).keys()].reduce((res, union) => {
            res[union] = unionIcon(union);
            return res;
        }, {}),
    }
    if (minRarity && maxRarity) {
        radioFilterValues["Rarity"] = [...Array((maxRarity + 1) - minRarity).keys()].reduce((res, offset) => {
            const rarity = minRarity + offset;
            res[rarity] = `${rarity}_Star`;
            return res;
        }, { 0: '0_Star' })
    }
    const handleRadioFilter = (e) => {
        if (e.target.value === "0") { removeFilter(e.target.name); }
        else { addFilter(e.target.name, e.target.value); }
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => { setAnchorEl(event.currentTarget); };
    const handleClose = () => { setAnchorEl(null); };
    const open = Boolean(anchorEl);

    const handleAvail = (e) => {
        let nextAvail = filters.Availability || [];
        if (e.target.checked) { nextAvail.push(e.target.name); }
        else {
            const index = nextAvail.indexOf(e.target.name);
            if (index >= 0) { nextAvail.splice(index, 1); }
        }
        if (nextAvail.length === 0) { removeFilter('Availability'); }
        else { addFilter('Availability', nextAvail); }
    }
    const handleSeries = (e) => {
        let nextSeries = filters.Series || [];
        if (e.target.checked) { nextSeries.push(e.target.name); }
        else {
            const index = nextSeries.indexOf(e.target.name);
            if (index >= 0) { nextSeries.splice(index, 1); }
        }
        if (nextSeries.length === 0) { removeFilter('Series'); }
        else { addFilter('Series', nextSeries); }
    }

    const clearAvail = (e) => { removeFilter('Availability'); }
    const clearSeries = (e) => { removeFilter('Series'); }

    return (
        <AppBar position="static" color="default" className={classes.root}>
            <Grid container spacing={1} alignItems="flex-start" justify="flex-start" wrap="wrap">
                <Grid item>
                    <Checkbox
                        checked={majorityHaving}
                        onChange={toggleAllHaving} color="primary"
                        icon={<SelectAllIcon fontSize="large" />}
                        checkedIcon={<SelectAllIcon fontSize="large" />}
                    />
                    <FormControl className={classes.sortSelect}>
                        <InputLabel>{TextLabel[locale].SORT_BY}</InputLabel>
                        <Select
                            value={sort}
                            onChange={handleSort}
                            className={classes.select}>
                            {sortOptions.map((so) => (<MenuItem value={so} key={so}>{TextLabel[locale][so.slice(2).toUpperCase()]}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <IconButton onClick={toggleOrder} size="small">{order === 'ASC' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}</IconButton>
                </Grid>
                <Grid item>
                    <FormControl component="fieldset">
                        <FormLabel disabled component="legend" className={classes.fieldsetTitle}>{TextLabel[locale].HAVE + '/' + (locale === 'EN' ? 'NOT' : TextLabel[locale].NOT_HAVE)}</FormLabel>
                        <FormControlLabel control={<Checkbox checked={!!(filters.ifHave)} indeterminate={!(filters.ifHave || filters.ifNotHave)} onChange={nextHaveState} color="primary" />} label={TextLabel[locale][haveState]} className={clsx(classes.tristateCheck)} classes={{label: clsx(classes.tristateCheckLabel)}} />
                    </FormControl>
                    {!(filters.ifNotHave) && 
                    <FormControl component="fieldset">
                        <FormLabel disabled component="legend" className={classes.fieldsetTitle}>{TextLabel[locale].MAXED + '/' + (locale === 'EN' ? 'NOT' : TextLabel[locale].NOT_MAXED)}</FormLabel>
                        <FormControlLabel control={<Checkbox checked={!!(filters.ifMaxed)} indeterminate={!(filters.ifMaxed || filters.ifNotMaxed)} onChange={nextMaxedState} color="primary" />} label={TextLabel[locale][maxedState]} className={clsx(classes.tristateCheck)} classes={{label: clsx(classes.tristateCheckLabel)}} />
                    </FormControl>}
                </Grid>
                {radioFilters.map((rf) => (
                    <Grid item key={rf}>
                        <FormControl component="fieldset" className={classes.radioGroup}>
                            <FormLabel disabled component="legend" className={classes.fieldsetTitle}>{TextLabel[locale][rf.toUpperCase()]}</FormLabel>
                            <RadioGroup aria-label={rf} name={rf} value={filters[rf] ? filters[rf].toString() : "0"} row onChange={handleRadioFilter.bind(this)}>
                                {Object.keys(radioFilterValues[rf]).map((v) => (
                                    <Radio
                                        key={v}
                                        className={classes.radioRoot}
                                        color="default"
                                        value={v}
                                        icon={<img alt={radioFilterValues[rf][v]} className={clsx(classes.radioIcon, classes.unchecked)} src={`${process.env.PUBLIC_URL}/ui/${radioFilterValues[rf][v]}.png`} />}
                                        checkedIcon={<img alt={radioFilterValues[rf][v]} className={classes.radioIcon} src={`${process.env.PUBLIC_URL}/ui/${radioFilterValues[rf][v]}.png`} />} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Grid>))}
                {availabilities && (
                    <Grid item>
                        <Button onClick={handleClick} variant="outlined" className={classes.availButton}>{TextLabel[locale].AVAILABILITY}</Button>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
                            <FormGroup className={classes.availChecks}>
                                <Button onClick={clearAvail}>Clear</Button>
                                {availabilities.map((av) => (
                                    <FormControlLabel key={av}
                                        control={<Checkbox onChange={handleAvail.bind(this)} name={av} checked={Boolean(filters.Availability && filters.Availability.includes(av))} color="primary" />}
                                        label={TextLabel[locale][av] || av} />
                                ))}
                            </FormGroup>
                        </Popover>
                    </Grid>
                )}
                {series && (
                    <Grid item>
                        <Button onClick={handleClick} variant="outlined" className={classes.availButton}>{TextLabel[locale].SERIES}</Button>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
                            <FormGroup className={classes.availChecks}>
                                <Button onClick={clearSeries}>Clear</Button>
                                {Object.keys(series).map((sr) => (
                                    <FormControlLabel key={sr}
                                        control={<Checkbox onChange={handleSeries.bind(this)} name={sr} checked={Boolean(filters.Series && filters.Series.includes(sr))} color="primary" />}
                                        label={series[sr][`Name${locale}`]} />
                                ))}
                            </FormGroup>
                        </Popover>
                    </Grid>
                )}
                {(storeKey === 'chara') && (<CharaMaterialSummation locale={locale} having={having} visible={visible} />)}
                {(storeKey === 'amulet') && (<AmuletMaterialSummation locale={locale} having={having} visible={visible} />)}
                {(storeKey === 'weapon') && (<WeaponMaterialSummation locale={locale} having={having} visible={visible} />)}
                {(storeKey === 'fort') && (<FortMaterialSummation locale={locale} having={having} visible={visible} />)}
            </Grid>
        </AppBar >
    )
}

export default ListingControls;