import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import IconCheckList from './IconCheckList';

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
const defaultAvailability = 'All';
function rarityToString(rarity) {
    if (rarity.length === 1) {
        return `${rarity}★`;
    } else {
        return 'All';
    }
}
export default function CollectionList(props) {
    const [filters, setFilters] = useState({
        rarity: defaultRarity,
        availability: defaultAvailability
    });
    const classes = useStyles();
    const { collection, setCollection, collectionItems, prefix, itemType } = props;

    const updateHaving = e => {
        setCollection({ [e.target.name]: !collection[e.target.name] });
    }

    const checkHaving = name => {
        return collection[name];
    }

    const toggleAll = (e) => {
        const newHaving = {};
        Object.keys(collection).forEach(k => {
            newHaving[k] = e.target.checked;
        });
        setCollection(newHaving);
    }

    const countHaving = (rarity) => {
        let acc = 0;
        Object.keys(collectionItems).forEach(ele => {
            rarity.forEach(rare => {
                Object.keys(collectionItems[ele][`r${rare}`]).forEach(adv => {
                    if (collection[adv] === true) {
                        acc += 1;
                    }
                })
            })
        });
        return acc;

    }

    const countItems = (rarity) => {
        let acc = 0;
        Object.keys(collectionItems).forEach(ele => {
            rarity.forEach(rare => {
                Object.keys(collectionItems[ele][`r${rare}`]).forEach(adv => {
                    acc += 1;
                })
            })
        });
        return acc;
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
    }


    const have = countHaving(filters.rarity);
    const total = countItems(filters.rarity);

    return (
        <div>
            <Grid container spacing={0} alignItems="flex-start">
                <Grid item xs={6} sm={1}>
                    <Button size="large" className={classes.headerButton} onClick={toggleRarity} color="default" fullWidth={true}>
                        {rarityToString(filters.rarity)}</Button>
                </Grid>
                <Grid item xs={12} sm={10}>
                    <FormControlLabel
                        classes={{ label: classes.headerLabel }}
                        control={<Checkbox onChange={toggleAll} color="default" />}
                        label={`${itemType}: ${have} / ${total} (${Math.floor((have / total) * 100)}%)`}
                    />
                </Grid>
            </Grid>
            <div className="collectionList">
                {Object.keys(collectionItems).map(ele => {
                    return (
                        <React.Fragment key={`${prefix}List-${ele}`}>
                            <Divider />
                            <div className={classes.elementGroup}>
                                {filters.rarity.map(rare => {
                                    return (<IconCheckList
                                        key={`${prefix}List-${ele}-r${rare}`}
                                        iconList={collectionItems[ele][`r${rare}`]}
                                        prefix={prefix}
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