import React, { FC } from 'react'
import { withStyles } from '@material-ui/core';
import { colors, fonts } from '@rsksmart/rif-ui';

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

// TODO: move to Material UI classes
const styles = {
  crypto: {
    color: colors.primary,
    fontSize: fonts.size.medium
  },
  fiat: {
    color: colors.gray3,
    fontSize: fonts.size.normal
  }
}

export default withStyles(styles)(PriceItem);