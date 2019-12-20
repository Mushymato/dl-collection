import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Adventurers from '../data/Adventurers.json';
import IconCheckList from './IconCheckList';

function initiateHaving(rarities) {
    let initHaving = {};
    Object.keys(Adventurers).forEach(ele => {
        rarities.forEach(rare => {
            Object.keys(Adventurers[ele][`r${rare}`]).forEach(adv => {
                initHaving[adv] = false;
            })
        })
    });
    return initHaving;
}
const useStyles = makeStyles({
    elementGroup: {},
    headerLabel: {
        fontSize: '2em'
    },
    headerButton: {
        marginRight: '2em',
        fontWeight: 'bold',
        fontSize: '1.1em'
    }
});
const defaultRarity = [5, 4, 3];
function rarityToString(rarity) {
    if (rarity.length === 1) {
        return `${rarity}★`;
    } else {
        return 'All';
    }
}
export default function AdventurerList() {
    const [filters, setFilters] = useState({
        rarity: defaultRarity,
        permanent: true,
        welfare: true,
        limited: true,
    });
    const [having, setHaving] = useState(initiateHaving(defaultRarity));
    const classes = useStyles();

    const updateHaving = e => {
        setHaving({
            ...having,
            [e.target.name]: !having[e.target.name]
        });
    }

    const checkHaving = name => {
        return having[name];
    }

    const toggleAll = (e) => {
        const newHaving = {};
        Object.keys(having).forEach(k => {
            newHaving[k] = e.target.checked;
        });
        setHaving(newHaving);
    }

    const countHaving = () => {
        return Object.keys(having).reduce((acc, cur) => {
            if (having[cur] === true) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);
    }

    const toggleRarity = (e) => {
        const oldRarity = filters.rarity;
        let newRarity = defaultRarity;
        if (oldRarity.length === 3) {
            newRarity = [5];
        } else if (oldRarity[0] > 3) {
            newRarity = [oldRarity[0] - 1];
        }
        setFilters({
            ...filters,
            rarity: newRarity
        });
        setHaving(initiateHaving(newRarity));
    }

    const have = countHaving();
    const total = Object.keys(having).length;

    return (
        <div>
            <Grid container spacing={0} alignItems="flex-start">
                <Grid item xs={12} sm={1}>
                    <Button size="large" className={classes.headerButton} onClick={toggleRarity} color="default" fullWidth={true}>
                        {rarityToString(filters.rarity)}</Button>
                </Grid>
                <Grid item xs={12} sm={11}>
                    <FormControlLabel
                        classes={{ label: classes.headerLabel }}
                        control={<Checkbox onChange={toggleAll} color="default" />}
                        label={`Adventurers: ${have} / ${total} (${Math.floor((have / total) * 100)}%)`}
                    />
                </Grid>
            </Grid>
            <div id="adventurerList">
                {Object.keys(Adventurers).map(ele => {
                    return (
                        <React.Fragment key={`advList-${ele}`}>
                            <Divider />
                            <div className={classes.elementGroup}>
                                {filters.rarity.map(rare => {
                                    return (<IconCheckList
                                        key={`advList-${ele}-r${rare}`}
                                        iconList={Adventurers[ele][`r${rare}`]}
                                        prefix='adv'
                                        element={ele}
                                        updateState={updateHaving}
                                        checkState={checkHaving}
                                    />);
                                })}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    )
}