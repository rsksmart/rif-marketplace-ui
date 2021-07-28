import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import MarketplaceAddressCell from 'components/molecules/MarketplaceAddressCell'
import NotificationsBalance from 'components/molecules/notifier/NotificationsBalance'
import { Item, MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { getShortDateString } from 'utils/dateUtils'
import { BaseFiat } from 'models/Fiat'
import { getFiatPrice } from 'utils/priceUtils'
import RoundBtn from 'components/atoms/RoundBtn'

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

const mapActiveContracts = <T extends Function, U extends Function>(
  myCustomers: NotifierSubscriptionItem[] = [],
  { id: offerId, limit }: Pick<NotifierOfferItem, 'id' | 'limit'>,
  { currentFiat: { displayName }, crypto }: {
    currentFiat: BaseFiat
    crypto: MarketCryptoRecord
  },
  { onWithdraw, onView }: {
    onWithdraw: T
    onView: U
  },
): Array<ActiveContractItem> => myCustomers
    .filter(({ plan: { id } }) => String(id) === offerId)
    .map<ActiveContractItem>(({
      id,
      consumer,
      expirationDate,
      notificationBalance,
      price,
      token,
      withdrawableFunds,
    }) => {
      const canWithdraw = withdrawableFunds.gt(0)
      const withdrawButton = (
        <RoundBtn
          onClick={(): void => onWithdraw({ id, token, withdrawableFunds })}
          disabled={!canWithdraw}
        >
          Withdraw
        </RoundBtn>
      )
      const withdrawAction = canWithdraw
        ? withdrawButton
        : (
          <Tooltip title="No funds to withdraw">
            <span>
              {withdrawButton}
            </span>
          </Tooltip>
        )

      return (
        {
          id,
          customer: <MarketplaceAddressCell value={consumer} />,
          expDate: (
            <Typography color="textSecondary" variant="body2">
              {getShortDateString(expirationDate)}
            </Typography>
          ),
          notifBalance: <NotificationsBalance
            balance={notificationBalance}
            limit={limit}
          />,
          price: (
            <Grid container wrap="nowrap" spacing={1}>
              <Grid item>
                <Typography color="primary" variant="body2">
                  {getFiatPrice(price, crypto[token.symbol])}
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary" variant="caption">
                  {displayName}
                </Typography>
              </Grid>
            </Grid>
          ),
          actions: (
            <Grid
              container
              spacing={2}
              justify="flex-end"
              wrap="nowrap"
            >
              <Grid item>
                {withdrawAction}
              </Grid>
              <Grid item>
                <RoundBtn onClick={(): void => onView(id)}>View</RoundBtn>
              </Grid>
            </Grid>
          ),
        })
    })

export default mapActiveContracts
