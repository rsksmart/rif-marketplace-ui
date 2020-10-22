import React from 'react'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import { MarketFiat } from 'context/Market/MarketContext'
import { MarketCryptoRecord } from 'models/Market'
import { Agreement, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'

export type AgreementView = {
  title: JSX.Element
  'PROVIDER': JSX.Element
  'HASH': JSX.Element
  'CURRENCY': string
  'SYSTEM': string
  'AMOUNT': JSX.Element
  'PRICE/GB': JSX.Element
  'SUBSCRIPTION PERIOD': SubscriptionPeriod
  'RENEWAL DATE': string
}
// FIXME: enclose in object
const createItemFields = (
  agreements: Agreement[],
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
  onItemRenew: (event, id: string) => void,
  onItemSelect: (event, agreement: AgreementView) => void,
): MarketplaceItem[] => agreements.map((agreement: Agreement) => {
  const {
    provider,
    monthlyFee,
    renewalDate,
    paymentToken,
    size,
    subscriptionPeriod,
    title,
    id,
  } = agreement
  const currency = crypto[paymentToken]

  const titleValue = <AddressItem value={title || id} />
  const sizeValue = (
    <ItemWUnit
      type="mediumPrimary"
      value={size.div(UNIT_PREFIX_POW2.KILO).toPrecision(2)}
      unit="GB"
    />
  )
  const feeValue = (
    <CombinedPriceCell
      price={monthlyFee.toPrecision(2)}
      priceFiat={currency && monthlyFee.times(currency.rate).toPrecision(3)}
      currency={currency && currency.displayName}
      currencyFiat={currentFiat.displayName}
      divider=" "
    />
  )
  const providerValue = <AddressItem value={provider} />

  return {
    id,
    title: titleValue,
    contentSize: sizeValue,
    monthlyFee: feeValue,
    provider: providerValue,
    renewalDate: renewalDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
    subscriptionPeriod,
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
        handleSelect={(event): void => onItemSelect(event, {
          PROVIDER: providerValue,
          HASH: <AddressItem value={id} />,
          CURRENCY: tokenDisplayNames[paymentToken],
          SYSTEM: 'IPFS',
          AMOUNT: sizeValue,
          'PRICE/GB': feeValue,
          'SUBSCRIPTION PERIOD': subscriptionPeriod,
          'RENEWAL DATE': renewalDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
          title: titleValue,
        })}
      >
        View
      </SelectRowButton>
    ),
  }
})

export default createItemFields
