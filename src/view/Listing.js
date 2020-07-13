import React, { Fragment, useState } from 'react';
import Grid from '@material-ui/core/Grid';

import { DEFAULT_HAVE } from '../data/Mapping';

const SortMethods = {
    ASC: {
        byId: (entries) => (Object.keys(entries)),
        byNameEN: (entries) => Object.keys(entries).sort((a, b) => (entries[a].NameEN.localeCompare(entries[b].NameEN))),
        byNameJP: (entries) => Object.keys(entries).sort((a, b) => (entries[a].NameJP.localeCompare(entries[b].NameJP))),
        byNameCN: (entries) => Object.keys(entries).sort((a, b) => (entries[a].NameCN.localeCompare(entries[b].NameCN))),
        byElement: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon || entries[b].Rarity - entries[a].Rarity)),
        byWeapon: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Weapon - entries[b].Weapon || entries[a].Element - entries[b].Element || entries[b].Rarity - entries[a].Rarity)),
        byRarity: (entries) => Object.keys(entries).sort((a, b) => (entries[a].Rarity - entries[b].Rarity || entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon)),
    },
    DSC: {
        byId: (entries) => (Object.keys(entries).reverse()),
        byNameEN: (entries) => Object.keys(entries).sort((b, a) => (entries[a].NameEN.localeCompare(entries[b].NameEN))),
        byNameJP: (entries) => Object.keys(entries).sort((b, a) => (entries[a].NameJP.localeCompare(entries[b].NameJP))),
        byNameCN: (entries) => Object.keys(entries).sort((b, a) => (entries[a].NameCN.localeCompare(entries[b].NameCN))),
        byElement: (entries) => Object.keys(entries).sort((b, a) => (entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon || entries[b].Rarity - entries[a].Rarity)),
        byWeapon: (entries) => Object.keys(entries).sort((b, a) => (entries[a].Weapon - entries[b].Weapon || entries[a].Element - entries[b].Element || entries[b].Rarity - entries[a].Rarity)),
        byRarity: (entries) => Object.keys(entries).sort((b, a) => (entries[a].Rarity - entries[b].Rarity || entries[a].Element - entries[b].Element || entries[a].Weapon - entries[b].Weapon)),
    }
}

const loadHaving = (storeKey) => {
    const saved = localStorage.getItem(storeKey);
    return (saved ? JSON.parse(saved) : {});
}

const saveHaving = (storeKey, having) => {
    localStorage.setItem(storeKey, JSON.stringify(having));
}

function Listing(props) {
    const { locale, entries, storeKey, ControlComponent, ItemComponent } = props;

    const [sort, setSort] = useState('byElement');
    const handleSort = (e) => {
        setSort(e.target.value);
    }
    const [order, setOrder] = useState('ASC');
    const toggleOrder = (e) => {
        if (order === 'ASC') {
            setOrder('DSC');
        } else {
            setOrder('ASC');
        }
    }
    const sorted = (entries) => {
        switch (sort) {
            case 'byName':
                return SortMethods[order][`byName${locale}`](entries);
            default:
                return SortMethods[order][sort](entries);
        }
    }

    const [having, setHaving] = useState(loadHaving(storeKey));
    const updateHaving = (id, changes) => {
        const newHaving = {
            ...having,
            [id]: { ...having[id], ...changes }
        };
        setHaving(newHaving);
        saveHaving(storeKey, newHaving);
    }
    const deleteHaving = (id) => {
        const newHaving = {
            ...having
        }
        delete newHaving[id];
        setHaving(newHaving);
        saveHaving(storeKey, newHaving);
    }
    const toggleAllHaving = () => {
        let newHaving = {};
        if (Object.keys(having).length === 0) {
            Object.keys(entries).forEach(id => {
                newHaving[id] = DEFAULT_HAVE[entries[id].Rarity];
            });
        }
        setHaving(newHaving);
        saveHaving(storeKey, newHaving);
    }


    return (
        <Fragment>
            <ControlComponent
                sort={sort}
                handleSort={handleSort}
                order={order}
                toggleOrder={toggleOrder}
                toggleAllHaving={toggleAllHaving}
            />
            <Grid container spacing={1} alignItems="flex-start" justify="flex-start" style={{ marginTop: 10 }}>
                {sorted(entries).map((id) =>
                    <ItemComponent
                        key={id}
                        locale={locale}
                        id={id}
                        entry={entries[id]}
                        have={having[id]}
                        updateHaving={updateHaving}
                        deleteHaving={deleteHaving}
                    />
                )}
            </Grid>
        </Fragment>
    );
}

export default Listing;