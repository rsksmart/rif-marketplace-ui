import React from 'react'
import MarketplaceCell from 'components/atoms/MarketplaceCell'
import { CombinedPriceCell } from 'components/molecules'
import MarketplaceActionsCell from 'components/molecules/MarketplaceActionsCell'
import NotificationsBalance from 'components/molecules/notifier/NotificationsBalance'
import { MySubscription } from 'components/organisms/notifier/mypurchase/PurchasesTable'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { getShortDateString } from 'utils/dateUtils'
import { ExchageRate } from 'context/Market/interfaces'
import MarketplaceAddressCell from 'components/molecules/MarketplaceAddressCell'

const mapMyPurchases = ({
  currentFiat,
  crypto,
}: ExchageRate) => ({
  id,
  token,
  provider,
  notificationBalance,
  expirationDate,
  price,
}: NotifierSubscriptionItem):
  MySubscription => {
  const { rate, displayName } = crypto?.[token.symbol]
    || { rate: 0, displayName: '' }

  return {
    id,
    subId: <MarketplaceAddressCell value={id} />,
    provider: <MarketplaceAddressCell value={provider} />,
    notifications: (
      <NotificationsBalance
        balance={notificationBalance}
        limit={0} // FIXME: get offer to retreive limit
      />
    ),
    expirationDate: (
      <MarketplaceCell>
        { getShortDateString(expirationDate) }
      </MarketplaceCell>
    ),
    price: <CombinedPriceCell
      price={price.toString()}
      priceFiat={price.times(rate).toString()}
      currency={displayName}
      currencyFiat={currentFiat.displayName}
      divider=""
    />,
    actions: (
      <MarketplaceActionsCell
        actions={[
          {
            id: `renew_${id}`,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            handleSelect: (): void => {},
            children: 'Renew',
          }, {
            id: `view_${id}`,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            handleSelect: (): void => {},
            children: 'View',
          },
        ]}
      />
    ),
  }
}

export default mapMyPurchases
