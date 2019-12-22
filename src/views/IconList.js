import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    iconCheck: {
        display: 'inline-block',
    },
    iconCB: {
        display: 'none',
        '& + label': {
            maxWidth: '18vw',
            maxHeight: '18vw',
            width: props => `${props.iconSize}px`,
            height: props => `${props.iconSize}px`,
            display: 'block',
            position: 'relative',
            cursor: 'pointer',
            '& > img': {
                width: '100%',
                height: '100%',
                transitionDuration: '0.1s',
                transformOrigin: '50% 50%'
            },
            '&:before': {
                backgroundColor: props => props.beforeColor,
                color: props => props.beforeColor,
                content: '" "',
                display: 'block',
                borderRadius: props => props.beforeShape === 'circle' ? '50%' : '0%',
                border: props => `0.05em solid ${props.beforeColor}`,
                position: 'absolute',
                width: props => `${props.beforeSize}em`,
                left: props => props.beforeShape === 'circle' ? `${- props.beforeSize / 5}em` : '-0.25em',
                top: props => props.beforeShape === 'circle' ? `${- props.beforeSize / 5}em` : '-0.25em',
                height: props => props.beforeShape === 'circle' ? `${props.beforeSize}em` : '1.25em',
                lineHeight: props => props.beforeShape === 'circle' ? `${props.beforeSize}em` : '1.25em',
                textAlign: 'center',
                transitionDuration: '0.4s',
                transform: 'scale(0)',
                fontStretch: 'ultra-condensed'
            }
        },
        '&:checked': {
            '& + label': {
                '& > img': {
                    transform: 'scale(0.9)',
                    opacity: 0.5,
                },
                '&:before': {
                    content: 'attr(data-before)',
                    transform: 'scale(1)',
                    zIndex: 2
                },
                '&.Flame': {
                    '&:before': { backgroundColor: 'salmon' },
                    '& > img': { backgroundColor: 'salmon' },
                },
                '&.Water': {
                    '&:before': { backgroundColor: 'deepskyblue' },
                    '& > img': { backgroundColor: 'deepskyblue' },
                },
                '&.Wind': {
                    '&:before': { backgroundColor: 'lightgreen' },
                    '& > img': { backgroundColor: 'lightgreen' },
                },
                '&.Light': {
                    '&:before': { backgroundColor: 'khaki' },
                    '& > img': { backgroundColor: 'khaki' },
                },
                '&.Shadow': {
                    '&:before': { backgroundColor: 'mediumpurple' },
                    '& > img': { backgroundColor: 'mediumpurple' },
                },
                '&.None': {
                    '&:before': { backgroundColor: 'lightgrey' },
                    '& > img': { backgroundColor: 'lightgrey' },
                }
            }
        }
    }
});

export function IconCheckList(props) {
    const classes = useStyles({ iconSize: 80, beforeSize: 1.2, beforeShape: 'circle', beforeColor: 'white' });
    return props.iconList.map(name => {
        const nameKey = `${props.prefix}-${name}`;
        return (
            <div className={classes.iconCheck} key={nameKey}>
                <input type="checkbox" className={classes.iconCB} id={nameKey} name={name} onChange={props.updateState} checked={Boolean(props.checkState(name))} />
                <label className={clsx(props.element, props.iconList[name])} htmlFor={nameKey} data-before="✓" >
                    <img src={`${props.prefix}/${name}.png`} title={name} alt={name} />
                </label>
            </div>
        );
    });
}

function unbindStr(n) {
    const black = String.fromCharCode(9642)
    const white = String.fromCharCode(9643)
    const mub = Math.floor(n / 5)
    const ub = Math.max((n - 1) % 5, 0)
    const unbindDiamonds = black.repeat(ub) + white.repeat(4 - ub);
    if (n >= 5) {
        if (ub === 4) {
            return `${mub}` + String.fromCharCode(10070);
        }
        return `${mub}` + String.fromCharCode(10070) + unbindDiamonds;
    } else {
        return unbindDiamonds;
    }
}
export function IconCounterList(props) {
    const classes = useStyles({ iconSize: 80, beforeSize: 3, beforeColor: 'black' });
    return props.iconList.map(name => {
        const nameKey = `${props.prefix}-${name}`;
        return (
            <div className={classes.iconCheck} key={nameKey}>
                <input type="checkbox" className={classes.iconCB} id={nameKey} name={name} onChange={props.updateState} checked={Boolean(props.checkState(name))} />
                <label className={props.element} htmlFor={nameKey} data-before={unbindStr(props.checkState(name))} data-name={name} onContextMenu={props.decreaseState}>
                    <img src={`${props.prefix}/${name}.png`} title={name} alt={name} />
                </label>
            </div>
        );
    });
}