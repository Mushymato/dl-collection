import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TextLabel from '../data/locale.json';
import { ELEMENTS, ELEMENT_COLORS, DEFAULT_HAVE } from '../data/Mapping';

import { insertLinebreak } from './ListingItems';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        transition: 'background-color 0.2s linear',
        width: 720,
    },
    cardAction: {
        padding: 8,
    },
    cardIcon: {
        transition: 'width 0.1s linear 0.1s, height 0.1s linear 0.1s',
        height: 120,
        width: 120
    },
    cardName: {
        textAlign: 'center',
        height: '1.5em',
        width: '100%',
        margin: 0,
        padding: 0,
        fontWeight: 700,
        fontSize: '0.75em',
        textTransform: 'none',
        letterSpacing: -1,
        '& .MuiButton-endIcon': {
            margin: 0,
            padding: 0
        },
    },
    cardNameNoWrap: {
        whiteSpace: 'pre'
    },
    cardEdit: {
        padding: 0,
        margin: 0,
        paddingLeft: 10,
        paddingRight: 10,
        height: 120,
        visibility: 'visible'
    },
    Flame: { backgroundColor: ELEMENT_COLORS.Flame },
    Water: { backgroundColor: ELEMENT_COLORS.Water },
    Wind: { backgroundColor: ELEMENT_COLORS.Wind },
    Light: { backgroundColor: ELEMENT_COLORS.Light },
    Shadow: { backgroundColor: ELEMENT_COLORS.Shadow },
    Null: { backgroundColor: ELEMENT_COLORS.Null }
});


export function WeaponListingItem(props) {
    const { locale, id, entry, category, have, updateHaving, deleteHaving } = props;
    const classes = useStyles();
    const cardName = entry[`Name${locale}`];
    const cardIconUrl = `${process.env.PUBLIC_URL}/weapon/${entry.Skins["0"]}.png`;

    return (
        <Grid item>
            <Card className={clsx(classes.root, have && (classes[ELEMENTS[entry.Element]] || classes.Null))}>
                <div className={clsx(classes.cardAction)}>
                    <CardMedia
                        className={clsx(classes.cardIcon)}
                        image={cardIconUrl}
                        title={cardName} alt={cardName} >
                    </CardMedia>
                    <Typography className={clsx(classes.cardName, locale !== 'EN' && classes.cardNameNoWrap)} component="div">
                        {insertLinebreak(cardName, locale)}
                    </Typography>
                </div>
                <CardActions className={clsx(classes.cardEdit, classes.cardEditEditing)} >
                    Test
                </CardActions>
            </Card>
        </Grid>
    );
}