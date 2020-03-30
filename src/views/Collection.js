import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    elementGroup: {},
    iconListGroup: {
        '&:before': {
            content: 'attr(data-before)',
            display: 'inline-block',
            position: 'relative',
            top: '-2em',
            width: 'auto',
            lineHeight: '2em',
            textAlign: 'center',
            minWidth: 80
        }
    },
    headerLabel: {
        fontSize: '1.5em'
    },
    headerButton: {
        marginRight: '2em',
        fontWeight: 'bold'
    }
});
export default function CollectionList(props) {
    const { collection, setCollection, maxHaving, collectionItems, IconListComponent, prefix, itemType, defaultRarity, nextRarity, rarityToString } = props;
    const [filters, setFilters] = useState({
        rarity: defaultRarity
    });

    const countMubHaving = (rarity) => {
        let acc = 0;
        Object.keys(collectionItems).forEach(ele => {
            rarity.forEach(rare => {
                collectionItems[ele][rare].forEach(item => {
                    acc += Math.floor(collection[item] / props.mubCount);
                })
            })
        });
        return acc;
    }

    const countItems = (rarity) => {
        let acc = 0;
        Object.keys(collectionItems).forEach(ele => {
            rarity.forEach(rare => {
                collectionItems[ele][rare].forEach(item => {
                    acc += 1;
                })
            })
        });
        return acc;
    }

    const countHaving = (rarity) => {
        let acc = 0;
        Object.keys(collectionItems).forEach(ele => {
            rarity.forEach(rare => {
                collectionItems[ele][rare].forEach(item => {
                    if (collection[item] > 0) {
                        acc += 1;
                    }
                })
            })
        });
        return acc;
    }

    const [checked, setChecked] = useState(countHaving(defaultRarity) > countItems(defaultRarity) / 2);
    const classes = useStyles();

    const updateHaving = e => {
        if (maxHaving <= collection[e.target.name]) {
            setCollection({ [e.target.name]: 0 });
        } else {
            setCollection({ [e.target.name]: collection[e.target.name] + 1 });
        }
    }

    const decreaseHaving = e => {
        const name = e.currentTarget.dataset.name;
        e.preventDefault();
        if (collection[name] > 0) {
            setCollection({ [name]: collection[name] - 1 });
        }
    }

    const checkHaving = name => {
        return collection[name];
    }

    const toggleAll = (e) => {
        const newHaving = {};
        const newValue = !checked ? Math.min(maxHaving, 5) : 0;
        Object.keys(collectionItems).forEach(ele => {
            filters.rarity.forEach(rare => {
                collectionItems[ele][rare].forEach(item => {
                    newHaving[item] = newValue;
                });
            });
        });
        setCollection(newHaving);
        setChecked(!checked);
    }

    const toggleRarity = (e) => {
        const newRarity = nextRarity(filters.rarity);
        setFilters({
            ...filters,
            rarity: newRarity
        });
        setChecked(countHaving(newRarity) > countItems(newRarity) / 2);
    }

    const have = countHaving(filters.rarity);
    const total = countItems(filters.rarity);
    const haveMub = countMubHaving(filters.rarity);
    const displayRarityClass = filters.rarity.length > 1 ? clsx(classes.iconListGroup, itemType) : '';

    let statsLabel = `${itemType}: ${have} / ${total} (${Math.floor((have / total) * 100)}%)`;
    if (haveMub > 0) {
        statsLabel += ' [' + props.mubSymbol + `${haveMub}]`
    }
    return (
        <React.Fragment>
            <Grid container spacing={0} alignItems="flex-start">
                <Grid item xs={12} sm={1}>
                    <Button size="large" className={classes.headerButton} onClick={toggleRarity} color="default" fullWidth={true}>
                        {rarityToString(filters.rarity)}</Button>
                </Grid>
                <Grid item xs={12} sm={10}>
                    <FormControlLabel
                        classes={{ label: classes.headerLabel }}
                        control={<Checkbox onChange={toggleAll} checked={checked} color="default" />}
                        label={statsLabel}
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
                                    if (collectionItems[ele][rare].length > 0) {
                                        return (
                                            <div className={displayRarityClass} data-before={rarityToString([rare])} key={`${prefix}List-${ele}-${rare}`}>
                                                <IconListComponent
                                                    iconList={collectionItems[ele][rare]}
                                                    prefix={prefix}
                                                    element={ele}
                                                    updateState={updateHaving}
                                                    checkState={checkHaving}
                                                    decreaseState={decreaseHaving}
                                                />
                                            </div>);
                                    } else {
                                        return <React.Fragment key={`${prefix}List-${ele}-${rare}`}></React.Fragment>;
                                    }
                                })}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </React.Fragment>
    )
}