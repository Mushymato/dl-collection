import React, { useState, Fragment } from 'react';
import Adventurers from '../data/Adventurers.json';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './Adventurers.css';

let initHaving = {};
Object.keys(Adventurers).forEach(k => {
    initHaving[k] = false;
});

export default function AdventurerList() {
    const [having, setHaving] = useState(initHaving);

    const updateHaving = e => {
        setHaving({
            ...having,
            [e.target.name]: !having[e.target.name]
        });
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
    const total = Object.keys(Adventurers).length;

    let prevEle = 'Flame';
    return (
        <div>
            <FormControlLabel
                control={<Checkbox onChange={toggleAll} color="default" />}
                label={`Adventurers: ${have} / ${total} (${Math.floor((have / total) * 100)}%)`}
            />
            <div id="adventurerList">
                {Object.keys(Adventurers).map(
                    name => {
                        const nameKey = `adv-${name}`
                        if (Adventurers[name].ele !== prevEle) {
                            prevEle = Adventurers[name].ele;
                            return (<Fragment key={nameKey}>< br /><div className="icon-check">
                                <input type="checkbox" className={`icon-cb ${Adventurers[name].ele}`} id={nameKey} name={name} onClick={updateHaving} checked={having[name]} />
                                <label htmlFor={nameKey}><img src={`adv/${name}.png`} title={name} alt={name} /></label>
                            </div></Fragment>);
                        } else {
                            return (<div className="icon-check" key={nameKey}>
                                <input type="checkbox" className={`icon-cb ${Adventurers[name].ele}`} id={nameKey} name={name} onClick={updateHaving} checked={having[name]} />
                                <label htmlFor={nameKey}><img src={`adv/${name}.png`} title={name} alt={name} /></label>
                            </div>);
                        }
                    }
                )}
            </div>
        </div>
    )
}