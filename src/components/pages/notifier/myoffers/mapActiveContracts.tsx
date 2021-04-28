/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { SelectRowButton } from 'components/molecules'
import RifAddress from 'components/molecules/RifAddress'
import { BaseFiat } from 'models/Fiat'
import { MarketCryptoRecord } from 'models/Market'
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
export type ActiveContractItem = {
    [K in keyof typeof activeContractHeaders]: React.ReactElement
  } & { id: string}

const mapActiveContracts = (
  myCustomers: NotifierSubscriptionItem[],
  offerId: string,
  offerLimit: number,
  crypto: MarketCryptoRecord,
  currentFiat: BaseFiat,
) => myCustomers.filter((customer) => String(customer.subscriptionPlanId) === offerId)
  .map<ActiveContractItem>((customer) => ({
    id: customer.id,
    customer: (
      <RifAddress
        value={customer.consumer}
        color="textPrimary"
        variant="body2"
        noWrap
      />
    ),
    expDate: (
      <Typography color="textSecondary" variant="body2">
        {getShortDateString(customer.expirationDate)}
      </Typography>
    ),
    notifBalance: (
      <Grid container wrap="nowrap">
        <Grid item>
          <Typography color="textSecondary" variant="body2">
            {`${offerLimit - customer.notificationBalance}/${offerLimit}`}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textPrimary" variant="body2">
            {` (${customer.notificationBalance} left)`}
          </Typography>
        </Grid>
      </Grid>
    ),
    price: (
      <Grid container wrap="nowrap">
        <Grid item>
          <Typography color="primary" variant="body2">
            {parseToBigDecimal(customer.price).mul(crypto?.[customer.token.symbol]?.rate)?.toFixed(2)}
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
            id={customer.id}
            handleSelect={(): void => { }}
            variant="outlined"
          >
            Withdraw
          </SelectRowButton>
        </Grid>
        <Grid item>
          <SelectRowButton
            id={customer.id}
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
