import React, { Fragment, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ListingControls from './ListingControls';
import { DEFAULT_HAVE } from '../data/Mapping';
import TextLabel from '../data/locale.json';
import { doneWeaponHave } from './ListingItems';

const weaponSeriesSortOrder = {
    4: -6,
    3: -5,
    5: -4,
    2: -3,
    1: -2,
    6: -1,
}

const SortMethods = {
    byID: (entries) => (Object.keys(entries)),
    byNameEN: (entries) => Object.keys(entries).sort((a, b) => (entries[a].NameEN.localeCompare(entries[b].NameEN))),
    byNameJP: (entries) => Object.keys(entries).sort((a, b) => (entries[a].NameJP.localeCompare(entries[b].NameJP))),
    byNameCN: (entries) => Object.keys(entries).sort((a, b) => (entries[a].NameCN.localeCompare(entries[b].NameCN))),
    byElement: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon || entries[b].Rarity - entries[a].Rarity)),
    byWeapon: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Weapon - entries[b].Weapon || entries[a].Element - entries[b].Element || entries[b].Rarity - entries[a].Rarity)),
    byRarity: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Rarity - entries[b].Rarity || entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon)),
    bySeries: (entries) => Object.keys(entries).sort((a, b) => (weaponSeriesSortOrder[entries[a].Series] - weaponSeriesSortOrder[entries[b].Series] || entries[a].Rarity - entries[b].Rarity || entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon)),
}

const CheckFilterMethods = {
    ifHave: (entry, have) => (have),
    ifNotHave: (entry, have) => (!have),
    ifMaxed: (entry, have) => {
        if (have) {
            if (entry.Series !== undefined) {
                const doneHave = doneWeaponHave(entry);
                return Object.keys(doneHave).reduce((acc, cur) => {
                    if (!acc) { return false; }
                    if (!have[cur]) { return false; }
                    return have[cur] >= doneHave[cur];
                })
            } else if (entry.Spiral === undefined) { return have.c >= 5; }
            else { return entry.Spiral ? (have.lv === 100 && have.mc === 70) : have.lv === 80 && have.mc === 50; }
        }
        return false;
    }
}

const loadLocalObj = (storeKey, init) => {
    const saved = localStorage.getItem(storeKey);
    return (saved ? JSON.parse(saved) : init || {});
}

const saveLocalObj = (storeKey, obj) => {
    localStorage.setItem(storeKey, JSON.stringify(obj));
}

function Listing(props) {
    const {
        locale, entries, availabilities, series,
        storeKey, cardIconFn, minRarity, maxRarity,
        sortDefault, sortOptions, radioFilters, ItemComponent
    } = props;

    const fullStoreKey = `dl-collection-${storeKey}`;

    const storeSortKey = `${fullStoreKey}-sorting`;
    const [sort, setSort] = useState(localStorage.getItem(storeSortKey) || sortDefault || 'byElement');
    const handleSort = (e) => {
        setSort(e.target.value);
        localStorage.setItem(storeSortKey, e.target.value);
    }
    const storeSortOrderKey = `${fullStoreKey}-sorting-order`;
    const [order, setOrder] = useState(localStorage.getItem(storeSortOrderKey) || 'ASC');
    const toggleOrder = (e) => {
        const nextOrder = (order === 'ASC' ? 'DSC' : 'ASC');
        setOrder(nextOrder);
        localStorage.setItem(storeSortOrderKey, nextOrder);
    }
    const sorted = (entries) => {
        let sortedId = null;
        if (sort === 'byName') {
            sortedId = SortMethods[`byName${locale}`](entries);
        } else {
            sortedId = SortMethods[sort](entries);
        }
        if (order === 'DSC') {
            sortedId = sortedId.reverse();
        }
        return sortedId;
    }

    const [having, setHaving] = useState(loadLocalObj(fullStoreKey));
    const updateHaving = (id, changes, tempHaving) => {
        const newHaving = {
            ...(tempHaving || having),
            [id]: { ...having[id], ...changes }
        };
        setHaving(newHaving);
        saveLocalObj(fullStoreKey, newHaving);
        return newHaving;
    }
    const deleteHaving = (id, tempHaving) => {
        const newHaving = { ...(tempHaving || having) };
        delete newHaving[id];
        setHaving(newHaving);
        saveLocalObj(fullStoreKey, newHaving);
        return newHaving;
    }

    const storeFilterKey = `${fullStoreKey}-filters`;
    const [filters, setFilters] = useState(loadLocalObj(storeFilterKey));
    const addFilter = (filterType, target) => {
        let newFilters = { ...filters };
        if (CheckFilterMethods[filterType]) {
            newFilters[filterType] = true;
        } else if (radioFilters.includes(filterType)) {
            newFilters[filterType] = parseInt(target);
        } else if (filterType === 'Availability' || filterType === 'Series') {
            newFilters[filterType] = target;
        }
        setFilters(newFilters);
        saveLocalObj(storeFilterKey, newFilters);
    }
    const removeFilter = (filterType) => {
        const newFilters = { ...filters };
        delete newFilters[filterType];
        setFilters(newFilters);
        saveLocalObj(storeFilterKey, newFilters);
    }
    const checkFilter = (id) => {
        const entry = entries[id];
        const have = having[id];
        for (const f of Object.keys(filters)) {
            if (CheckFilterMethods[f] && !CheckFilterMethods[f](entry, have)) {
                return false;
            } else if (radioFilters.includes(f) && entry[f] !== filters[f]) {
                return false;
            } else if (f === 'Availability' && (!entry.Availability || entry.Availability.every((a) => (!(filters.Availability.includes(a)))))) {
                return false;
            } else if (f === 'Series' && (!filters.Series.includes(entry.Series.toString()))) {
                return false;
            }
        }
        return true;
    }

    const visibleEntries = sorted(entries).filter(checkFilter);
    const visibleHave = visibleEntries.reduce((res, id) => (res + (having[id] ? 1 : 0)), 0);
    const majorityHaving = having && Object.keys(having).length > 0 && visibleHave > (visibleEntries.length / 2 >> 0);
    const toggleAllHaving = () => {
        let newHaving = { ...having };
        if (!majorityHaving) {
            for (const id of visibleEntries) {
                if (storeKey === 'weapon') {
                    newHaving[id] = doneWeaponHave(entries[id]);
                } else {
                    newHaving[id] = having[id] || DEFAULT_HAVE[storeKey][entries[id].Rarity];
                }
            }
        } else {
            for (const id of visibleEntries) {
                delete newHaving[id];
            }
        }
        setHaving(newHaving);
        saveLocalObj(fullStoreKey, newHaving);
    }

    const statLabel = (title) => {
        const p = ((100 * visibleHave / visibleEntries.length) >> 0)
        return `${title}: ${visibleHave} / ${visibleEntries.length} (${p}%)`
    }

    return (
        <Fragment>
            <ListingControls
                locale={locale}
                minRarity={minRarity}
                maxRarity={maxRarity}
                sort={sort}
                handleSort={handleSort}
                sortOptions={sortOptions}
                order={order}
                toggleOrder={toggleOrder}
                majorityHaving={majorityHaving}
                toggleAllHaving={toggleAllHaving}
                addFilter={addFilter}
                removeFilter={removeFilter}
                filters={filters}
                radioFilters={radioFilters}
                availabilities={availabilities}
                series={series}
                having={storeKey === 'weapon' && having}
                visible={visibleEntries}
                isGacha={storeKey === 'chara' || storeKey === 'dragon'}
            />
            <Typography component="h2" gutterBottom>{statLabel(TextLabel[locale].COMPLETION)}</Typography>
            <Grid container spacing={1} alignItems="flex-start" justify="flex-start">
                {visibleEntries.map((id) => (
                    <ItemComponent
                        key={id}
                        locale={locale}
                        id={id}
                        entry={entries[id]}
                        category={storeKey}
                        cardIconFn={cardIconFn}
                        have={having[id]}
                        updateHaving={updateHaving}
                        deleteHaving={deleteHaving}
                    />
                ))}
            </Grid>
        </Fragment>
    );
}

export default Listing;