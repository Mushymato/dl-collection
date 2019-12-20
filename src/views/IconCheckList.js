import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    iconCheckList: {},
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
                backgroundColor: 'white',
                color: 'white',
                content: '" "',
                display: 'block',
                borderRadius: '50%',
                border: '0.05em solid white',
                position: 'absolute',
                top: '-0.25em',
                left: '-0.25em',
                width: '1.1em',
                height: '1.1em',
                lineHeight: '1.1em',
                textAlign: 'center',
                transitionDuration: '0.4s',
                transform: 'scale(0)'
            }
        },
        '&:checked': {
            '& + label': {
                '& > img': {
                    transform: 'scale(0.9)',
                    opacity: 0.5,
                },
                '&:before': {
                    content: '"✓"',
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
                }
            }
        }
    }
});

export default function IconCheckList(props) {
    const classes = useStyles({ iconSize: 80 });
    return (<div className={classes.iconCheckList}>
        {Object.keys(props.iconList).map(name => {
            const nameKey = `${props.prefix}-${name}`;
            return (
                <div className={classes.iconCheck} key={nameKey}>
                    <input type="checkbox" className={classes.iconCB} id={nameKey} name={name} onChange={props.updateState} checked={props.checkState(name)} />
                    <label className={clsx(props.element, props.iconList[name])} htmlFor={nameKey}><img src={`${props.prefix}/${name}.png`} title={name} alt={name} /></label>
                </div>
            );
        })}
    </div>);
}