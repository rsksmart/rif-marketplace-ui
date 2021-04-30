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

const NotifierPlanDescription: FC<Props> = ({ item, crypto, currentFiat }) => {
  if (!item) return <DescriptionCard />
  const { token, daysLeft, value } = item.item
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
          <RifAddress value={item.item['provider']} color="textPrimary" noWrap />
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">{item.item['limit']}</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">{item.item['channels'].join('+')}</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">{item.item['token'].displayName}</Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography color="textPrimary">
            {((crypto?.[token.symbol]?.rate || 0) * value.toNumber()).toPrecision(4)}
            {' '}
            {currentFiat}
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
