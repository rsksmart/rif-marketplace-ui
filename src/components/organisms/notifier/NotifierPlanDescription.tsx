/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, Typography,
} from '@material-ui/core'
import DescriptionCard from 'components/molecules/DescriptionCard'
import RifAddress from 'components/molecules/RifAddress'
import React, {
  FC,
} from 'react'
import { OffersOrder } from 'context/Services/notifier/offers/interfaces'
import { MarketCryptoRecord } from 'models/Market'

type Props = {
      item?: OffersOrder
    currentFiat: string
    crypto: MarketCryptoRecord
}

const NotifierPlanDescription: FC<Props> = ({ item, crypto, currentFiat: currentFiatName }) => {
  if (!item) return <DescriptionCard />
  const {
    token, daysLeft, value,
    provider, limit, channels,
  } = item.item
  const rate = crypto?.[token.symbol]?.rate || 0
  const valueInFiat = ((value.mul(rate))).toFixed(2)

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
