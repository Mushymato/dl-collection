import React from 'react';
import { makeStyles } from '@material-ui/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
    root: {
        marginTop: 5,
        marginBottom: 5
    },
    select: {
        width: '25vw'
    }
});

export function CharaListingControls(props) {
    const {
        sort, handleSort,
        order, toggleOrder,
        toggleAllHaving
    } = props;
    const classes = useStyles();

    return (
        <AppBar position="static" color="default" className={classes.root}>
            <Toolbar>
                <Button onClick={toggleAllHaving}>Check All</Button>
                <Select
                    value={sort}
                    onChange={handleSort}
                    className={classes.select}
                >
                    <MenuItem value="byId">Id</MenuItem>
                    <MenuItem value="byName">Name</MenuItem>
                    <MenuItem value="byElement">Element</MenuItem>
                    <MenuItem value="byWeapon">Weapon</MenuItem>
                    <MenuItem value="byRarity">Rarity</MenuItem>
                </Select>
                <IconButton onClick={toggleOrder}><Box fontFamily="monospace">{order}</Box></IconButton>
            </Toolbar>
        </AppBar>
    )
}