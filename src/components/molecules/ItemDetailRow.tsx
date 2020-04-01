import React, { FC } from 'react'
import classes from '*.module.css';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

export interface ItemDetailRowProps {
    name: string
    value: string | React.ElementType
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        details_row: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
    }),
);


const ItemDetailRow: FC<ItemDetailRowProps> = ({ name, value }) => {
    const classes = useStyles();

    return (
        <div className={classes.details_row}>
            <div>{name}</div>
            <div>{value}</div>
        </div>
    )
}

export default ItemDetailRow;