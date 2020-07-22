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

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SelectAllIcon from '@material-ui/icons/SelectAll';

import TextLabel from '../data/locale.json';
import { ELEMENTS, WEAPONS, RARITIES } from '../data/Mapping';

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
    }
});

function ListingControls(props) {
    const {
        locale, minRarity, maxRarity,
        sort, handleSort, sortOptions,
        order, toggleOrder,
        majorityHaving, toggleAllHaving,
        addFilter, removeFilter, filters, radioFilters,
        availabilities
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
            console.log(index);
            if (index >= 0) { nextAvail.splice(index, 1); }
        }
        if (nextAvail.length === 0) { removeFilter('Availability'); }
        else { addFilter('Availability', nextAvail); }
    }

    const clearAvail = (e) => { removeFilter('Availability'); }

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
                    <FormControlLabel control={<Checkbox checked={filters.ifHave} name="ifHave" onChange={handleBoolCheckFilters.bind(this)} color="primary" />} label={TextLabel[locale].HAVE} />
                    <FormControlLabel control={<Checkbox checked={filters.ifNotHave} name="ifNotHave" onChange={handleBoolCheckFilters.bind(this)} color="primary" />} label={TextLabel[locale].NOT_HAVE} />
                    <FormControlLabel control={<Checkbox checked={filters.ifMaxed} name="ifMaxed" onChange={handleBoolCheckFilters.bind(this)} />} label={TextLabel[locale].MAXED} />
                </Grid>
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
                <Grid item xs>
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
            </Grid>
        </AppBar >
    )
}

export default ListingControls;