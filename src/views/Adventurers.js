import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import Adventurers from '../data/Adventurers.json';
import IconCheckList from './IconCheckList';

let initHaving = {};
Object.keys(Adventurers).forEach(ele => {
    Object.keys(Adventurers[ele]).forEach(rare => {
        Object.keys(Adventurers[ele][rare]).forEach(adv => {
            initHaving[adv] = false;
        })
    })
});
const useStyles = makeStyles({
    elementGroup: {},
    headerLabel: {
        fontSize: '2em'
    }
});
export default function AdventurerList() {
    const [having, setHaving] = useState(initHaving);
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

    const have = countHaving();
    const total = Object.keys(having).length;

    return (
        <div>
            <FormControlLabel classes={{ label: classes.headerLabel }}
                control={<Checkbox onChange={toggleAll} color="default" />}
                label={`Adventurers: ${have} / ${total} (${Math.floor((have / total) * 100)}%)`}
            />
            <div id="adventurerList">
                {Object.keys(Adventurers).map(ele => {
                    return (
                        <React.Fragment key={`advList-${ele}`}>
                            <Divider />
                            <div className={classes.elementGroup}>
                                {Object.keys(Adventurers[ele]).map(rare => {
                                    return (<IconCheckList
                                        iconList={Adventurers[ele][rare]}
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