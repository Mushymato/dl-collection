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
import Weapon from '../data/weapon.json';
import WeaponBuild from '../data/weaponbuild.json';
import Fort from '../data/fort.json';
import Material from '../data/material.json';
import { ELEMENTS, WEAPONS, RARITIES } from '../data/Mapping';
import { doneWeaponHave, MaterialSummaryItem, fortMaxNum } from './ListingItems';

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
    radioTitle: {
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
        minHeight: '2.5em'
    }
});


function WeaponMaterialSummation(props) {
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
    const totalMats = {};
    // maybe come bacc and count up passive ability mats too :v
    for (let id of visible) {
        const wpn = Weapon[id];
        const currHave = having[id];
        const doneHave = doneWeaponHave(wpn);
        const bld = WeaponBuild[wpn.Build];
        if (currHave) {
            for (let bi of Object.keys(doneHave.b)) {
                if (bi === '6' || doneHave.b[bi] <= currHave.b[bi]) { continue; }
                for (const bs of bld[bi].slice(currHave.b[bi] ? currHave.b[bi] : 0, doneHave.b[bi])) {
                    totalCost += bs.Cost;
                    for (let m of Object.keys(bs.Mats)) {
                        if (!totalMats[m]) { totalMats[m] = 0; }
                        totalMats[m] += bs.Mats[m];
                    }
                }
            }
        } else {
            totalCost += wpn.Cost;
            for (let m of Object.keys(wpn.Mats)) {
                if (!totalMats[m]) { totalMats[m] = 0; }
                totalMats[m] += wpn.Mats[m];
            }
            for (let bi of Object.keys(doneHave.b)) {
                if (bi === '6') { continue; }
                for (const bs of bld[bi].slice(0, doneHave.b[bi])) {
                    totalCost += bs.Cost;
                    for (let m of Object.keys(bs.Mats)) {
                        if (!totalMats[m]) { totalMats[m] = 0; }
                        totalMats[m] += bs.Mats[m];
                    }
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
                    <img style={{ verticalAlign: 'middle' }} src={`${process.env.PUBLIC_URL}/ui/rupee.png`} alt="cost" />
                    <Typography display="inline" gutterBottom>   {totalCost.toLocaleString()}</Typography>
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
                    <img style={{ verticalAlign: 'middle' }} src={`${process.env.PUBLIC_URL}/ui/rupee.png`} alt="cost" />
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


function ListingControls(props) {
    const {
        locale, minRarity, maxRarity,
        sort, handleSort, sortOptions,
        order, toggleOrder,
        majorityHaving, toggleAllHaving,
        addFilter, removeFilter, filters, radioFilters,
        availabilities, series, havingWeapon, havingFort,
        visible, isGacha, isFort
    } = props;
    const classes = useStyles();

    const handleBoolCheckFilters = (e) => {
        if (e.target.checked) { addFilter(e.target.name); }
        else { removeFilter(e.target.name); }
    }

    const radioFilterValues = {
        'Element': ELEMENTS,
        'Weapon': WEAPONS,
        // eslint-disable-next-line
        'Rarity': Object.keys(RARITIES).filter(r => (r == 0 || (r >= minRarity && r <= maxRarity))).reduce((res, key) => { res[key] = RARITIES[key]; return res; }, {})
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
                {isGacha && <Grid item>
                    <FormControlLabel control={<Checkbox checked={filters.ifHave} name="ifHave" onChange={handleBoolCheckFilters.bind(this)} color="primary" />} label={TextLabel[locale].HAVE} />
                    <FormControlLabel control={<Checkbox checked={filters.ifNotHave} name="ifNotHave" onChange={handleBoolCheckFilters.bind(this)} color="primary" />} label={TextLabel[locale].NOT_HAVE} />
                    <FormControlLabel control={<Checkbox checked={filters.ifMaxed} name="ifMaxed" onChange={handleBoolCheckFilters.bind(this)} />} label={TextLabel[locale].MAXED} />
                </Grid>}
                {isFort && <Grid item>
                    <FormControlLabel control={<Checkbox checked={filters.ifNotMaxLevel} name="ifNotMaxLevel" onChange={handleBoolCheckFilters.bind(this)} />} label={TextLabel[locale].NOT_MAXED} />
                </Grid>}
                {radioFilters.map((rf) => (
                    <Grid item key={rf}>
                        <FormControl component="fieldset" className={classes.radioGroup}>
                            <FormLabel disabled component="legend" className={classes.radioTitle}>{TextLabel[locale][rf.toUpperCase()]}</FormLabel>
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
                {havingWeapon && (<WeaponMaterialSummation locale={locale} having={havingWeapon} visible={visible} />)}
                {havingFort && (<FortMaterialSummation locale={locale} having={havingFort} visible={visible} />)}
            </Grid>
        </AppBar >
    )
}

export default ListingControls;