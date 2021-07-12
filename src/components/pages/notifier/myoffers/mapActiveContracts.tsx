import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MarketplaceActionsCell from 'components/molecules/MarketplaceActionsCell'
import MarketplaceAddressCell from 'components/molecules/MarketplaceAddressCell'
import NotificationsBalance from 'components/molecules/notifier/NotificationsBalance'
import { Item, MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { getShortDateString } from 'utils/dateUtils'
import { BaseFiat } from 'models/Fiat'
import { getFiatPrice } from 'utils/priceUtils'

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
    }) => ({
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
        <MarketplaceActionsCell
          actions={[
            {
              id: `withdraw_${id}`,
              handleSelect: (): void => onWithdraw({ id, token, price }),
              children: 'Withdraw',
            }, {
              id: `view_${id}`,
              handleSelect: (): void => onView(id),
              children: 'View',
            },
          ]}
        />
      ),
    }))
export default mapActiveContracts
