import React, { FC } from 'react'
import { withStyles } from '@material-ui/core';

interface StylesProps {
    classes: Record<"crypto" | "fiat", string>;
}

export interface PriceItemProps extends StylesProps {
    type: 'crypto' | 'fiat',
    price: string,
    currency: string,
}

const PriceItem: FC<PriceItemProps> = ({ type, price, currency, classes }) => {

    return <span className={`price_item ${classes[type]}`}>{`${price} ${currency}`}</span>
}

const styles = {
    crypto: {
        color: 'blue'
    },
    fiat: {
        color: 'grey'
    }
}

export default withStyles(styles)(PriceItem);