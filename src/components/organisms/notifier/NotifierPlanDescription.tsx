/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, Typography,
} from '@material-ui/core'
import DescriptionCard from 'components/molecules/DescriptionCard'
import RifAddress from 'components/molecules/RifAddress'
import React, {
  FC,
} from 'react'
import { MarketCryptoRecord } from 'models/Market'
import { OrderItem } from 'context/Services/notifier/offers/interfaces'
import { getFiatPrice } from 'utils/priceUtils'

type Props = {
    item: OrderItem
    currentFiat: string
    crypto: MarketCryptoRecord
}

const NotifierPlanDescription: FC<Props> = ({
  item: {
    token, daysLeft, value,
    provider, limit, channels,
  }, crypto,
  currentFiat: currentFiatName,
}) => {
  const rateToken = crypto?.[token.symbol]
  const valueInFiat = getFiatPrice(value, rateToken)

  return (
    <DescriptionCard>
      <Grid container spacing={1}>
        <Grid item xs={1} md={2}>
          <Typography color="textSecondary" noWrap>Provider</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textSecondary" noWrap>Notifications</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textSecondary" noWrap>Channels</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textSecondary" noWrap>Currencies</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textSecondary" noWrap>Price</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textSecondary" noWrap>Expiration Period</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <RifAddress value={provider} color="textPrimary" noWrap />
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">{limit}</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">{channels.join(',')}</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">{token.displayName}</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">
            {valueInFiat}
            {' '}
            {currentFiatName}
          </Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">
            {daysLeft}
            {' '}
            day
            {daysLeft !== 1 ? 's' : ''}
          </Typography>
        </Grid>
      </Grid>
    </DescriptionCard>
  )
}

export default NotifierPlanDescription
