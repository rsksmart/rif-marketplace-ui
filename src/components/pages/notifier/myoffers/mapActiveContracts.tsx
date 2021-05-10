import React from 'react'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import MarketplaceActionsCell from 'components/molecules/MarketplaceActionsCell'
import MarketplaceAddressCell from 'components/molecules/MarketplaceAddressCell'
import NotificationsBalance from 'components/molecules/notifier/NotificationsBalance'
import { Item, MarketCryptoRecord } from 'models/Market'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { getShortDateString } from 'utils/dateUtils'
import { BaseFiat } from 'models/Fiat'

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
): Array<ActiveContractItem> => myCustomers
  .filter(({ plan: { id } }) => String(id) === offerId)
  .map<ActiveContractItem>(({
    id: customerId,
    consumer,
    expirationDate,
    notificationBalance,
    price,
    token,
  }) => ({
    id: customerId,
    customer: <MarketplaceAddressCell value={consumer} />,
    expDate: (
      <Typography color="textSecondary" variant="body2">
        {getShortDateString(expirationDate)}
      </Typography>
    ),
    notifBalance: <NotificationsBalance balance={notificationBalance} limit={offerLimit} />,
    price: (
      <Grid container wrap="nowrap" spacing={1}>
        <Grid item>
          <Typography color="primary" variant="body2">
            {price.mul(crypto?.[token.symbol]?.rate)?.toFixed(2)}
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
      <MarketplaceActionsCell
        actions={[
          {
            id: `withdraw_${customerId}`,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            handleSelect: (): void => {},
            children: 'Withdraw',
          }, {
            id: `view_${customerId}`,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            handleSelect: (): void => {},
            children: 'View',
          },
        ]}
      />
    ),
  }))

export default mapActiveContracts
