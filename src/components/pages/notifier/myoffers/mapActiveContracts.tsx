/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { SelectRowButton } from 'components/molecules'
import RifAddress from 'components/molecules/RifAddress'
import { BaseFiat } from 'models/Fiat'
import { Item, MarketCryptoRecord } from 'models/Market'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import React from 'react'
import { getShortDateString } from 'utils/dateUtils'
import { parseToBigDecimal } from 'utils/parsers'

export const activeContractHeaders = {
  customer: 'Customer',
  notifBalance: 'Notifications',
  expDate: 'Expiration date',
  price: 'Price',
  actions: '',
}
export type ActiveContractItem = Item & {
    [K in keyof typeof activeContractHeaders]: React.ReactElement
  }

const mapActiveContracts = (
  myCustomers: NotifierSubscriptionItem[],
  offerId: string,
  offerLimit: number,
  crypto: MarketCryptoRecord,
  currentFiat: BaseFiat,
) => myCustomers.filter(({
  subscriptionPlanId,
}) => String(subscriptionPlanId) === offerId)
  .map<ActiveContractItem>(({
    id: customerId,
    consumer,
    expirationDate,
    notificationBalance,
    price,
    token,
  }) => ({
    id: customerId,
    customer: (
      <RifAddress
        value={consumer}
        color="textPrimary"
        variant="body2"
        noWrap
      />
    ),
    expDate: (
      <Typography color="textSecondary" variant="body2">
        {getShortDateString(expirationDate)}
      </Typography>
    ),
    notifBalance: (
      <Grid container wrap="nowrap" spacing={1}>
        <Grid item>
          <Typography color="textSecondary" variant="body2">
            {`${offerLimit - notificationBalance}/${offerLimit}`}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textPrimary" variant="body2">
            {`(${notificationBalance} left)`}
          </Typography>
        </Grid>
      </Grid>
    ),
    price: (
      <Grid container wrap="nowrap" spacing={1}>
        <Grid item>
          <Typography color="primary" variant="body2">
            {parseToBigDecimal(price).mul(crypto?.[token.symbol]?.rate)?.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="primary" variant="caption">
            {currentFiat.displayName}
          </Typography>
        </Grid>
      </Grid>
    ),
    actions: (
      <Grid container spacing={2} justify="flex-end" wrap="nowrap">
        <Grid item>
          <SelectRowButton
            id={customerId}
            handleSelect={(): void => { }}
            variant="outlined"
          >
            Withdraw
          </SelectRowButton>
        </Grid>
        <Grid item>
          <SelectRowButton
            id={customerId}
            handleSelect={(): void => { }}
            variant="outlined"
          >
            View
          </SelectRowButton>
        </Grid>
      </Grid>
    ),
  }))

export default mapActiveContracts
