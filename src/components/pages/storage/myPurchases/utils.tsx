import React from 'react'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import { MarketFiat } from 'context/Market/MarketContext'
import { MarketCryptoRecord } from 'models/Market'
import { Agreement } from 'models/marketItems/StorageItem'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'

const createItemFields = (
  agreements: Agreement[],
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
): MarketplaceItem[] => agreements.map(({
  provider,
  monthlyFee,
  renewalDate,
  paymentToken,
  size,
  subscriptionPeriod,
  title,
  id,
}: Agreement) => {
  const currency = crypto[paymentToken]

  return {
    id,
    title: <AddressItem value={title || id} />,
    contentSize: <ItemWUnit
      type="mediumPrimary"
      value={size.div(UNIT_PREFIX_POW2.KILO).toPrecision(2)}
      unit="GB"
    />,
    monthlyFee: <CombinedPriceCell
      price={monthlyFee.toPrecision(2)}
      priceFiat={currency && monthlyFee.times(currency.rate).toPrecision(3)}
      currency={currency && currency.displayName}
      currencyFiat={currentFiat.displayName}
      divider=" "
    />,
    provider: <AddressItem value={provider} />,
    renewalDate: renewalDate.toLocaleDateString(),
    subscriptionType: subscriptionPeriod,
    renew: (
      <SelectRowButton
        id={id}
        handleSelect={(): void => undefined}
      >
        Renew
      </SelectRowButton>
    ),
    view: (
      <SelectRowButton
        id={id}
        handleSelect={(): void => undefined}
      >
        View
      </SelectRowButton>
    ),
  }
})

export default createItemFields
