import React, { Fragment, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ListingControls from './ListingControls';
import { DEFAULT_HAVE } from '../data/Mapping';
import TextLabel from '../data/locale.json';
import { doneWeaponHave, doneAmuletHave, doneCharaHave, fortMaxNum } from './ListingItems';
import WeaponBuild from '../data/weaponbuild.json';

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
    byElement: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon || entries[b].Rarity - entries[a].Rarity || b.localeCompare(a))),
    byWeapon: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Weapon - entries[b].Weapon || entries[a].Element - entries[b].Element || entries[b].Rarity - entries[a].Rarity || b.localeCompare(a))),
    byRarity: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Rarity - entries[b].Rarity || entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon)),
    bySeries: (entries) => Object.keys(entries).sort((a, b) => (weaponSeriesSortOrder[entries[a].Series] - weaponSeriesSortOrder[entries[b].Series] || entries[a].Rarity - entries[b].Rarity || entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon)),
    byType: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Type - entries[b].Type || a - b)),
    byForm: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Form - entries[b].Form || entries[a].Rarity - entries[b].Rarity || a - b)),
}
const ifMaxedEntry = (have, entry, storeKey) => {
    if (!have){ return false; }
    let maxedHave = null;
    switch (storeKey) {
        case 'fort':
            return entry.Detail.length === Math.min(...Object.values(have));
        case 'chara':
            maxedHave = doneCharaHave(entry, 5);
            break
        case 'amulet':
            maxedHave = doneAmuletHave(entry, true);
            break;
        case 'weapon':
            maxedHave = doneWeaponHave(entry, true);
            break;
        case 'dragon':
        default:
            maxedHave = { c: 5 };
            break;
    }
    for (const key of Object.keys(maxedHave)) {
        if (have[key] !== maxedHave[key]){ return false; }
    }
    return true;
}
const CheckFilterMethods = {
    ifHave: (have, entry, storeKey) => (have),
    ifNotHave: (have, entry, storeKey) => (!have),
    ifMaxed: ifMaxedEntry,
    ifNotMaxed: (have, entry, storeKey) => {
        return !(ifMaxedEntry(have, entry, storeKey));
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
    const modifyFilter = (newFilters) => {
        setFilters(newFilters);
        saveLocalObj(storeFilterKey, newFilters);
    }
    const checkFilter = (id) => {
        const entry = entries[id];
        const have = having[id];
        for (const f of Object.keys(filters)) {
            if (CheckFilterMethods[f] && !CheckFilterMethods[f](have, entry, storeKey)) {
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
                switch (storeKey) {
                    case 'chara':
                        newHaving[id] = doneCharaHave(entries[id]);
                        break
                    case 'amulet':
                        newHaving[id] = doneAmuletHave(entries[id]);
                        break;
                    case 'weapon':
                        newHaving[id] = doneWeaponHave(entries[id]);
                        break;
                    case 'fort':
                        newHaving[id] = (new Array(fortMaxNum(entries[id]))).fill(entries[id].Detail.length);
                        break;
                    case 'dragon':
                    default:
                        newHaving[id] = having[id] || DEFAULT_HAVE[storeKey][entries[id].Rarity];
                        break;
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
        let count = visibleHave;
        let total = visibleEntries.length;
        if (storeKey === 'weapon') {
            count = visibleEntries.reduce((res, id) => (res + (having[id] ? (having[id].b[5] ? 1 : 0) : 0)), 0);
            total = visibleEntries.reduce((res, id) => (res + (WeaponBuild[entries[id].Build][5] ? 1 : 0)), 0);
        } else if (storeKey === 'fort') {
            const halidomVisible = visibleEntries.includes("100101");
            const halidom = (halidomVisible && having[100101]) ? having[100101][0] : 0;
            count = visibleEntries.reduce((res, id) => (res + (having[id] ? Object.values(having[id]).reduce((a, b) => a + b, 0) : 0)), 0) - halidom;
            total = visibleEntries.reduce((res, id) => (res + (fortMaxNum(entries[id]) * entries[id].Detail.length)), 0) - (halidomVisible ? 10 : 0);
        }
        const p = ((100 * count / total) >> 0)
        return `${title}: ${count} / ${total} (${p}%)`
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
                modifyFilter={modifyFilter}
                filters={filters}
                radioFilters={radioFilters}
                availabilities={availabilities}
                series={series}
                storeKey={storeKey}
                having={having}
                visible={visibleEntries}
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