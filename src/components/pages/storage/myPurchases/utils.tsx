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
  'PRICE/GB': JSX.Element // monthly fee
  'SUBSCRIPTION PERIOD': SubscriptionPeriod
  'RENEWAL DATE': string
  // TODO: provider fields
  // 'CONSUMER': string
  // 'AVAILABLE FUNDS': string
}
// FIXME: enclose in object
const createItemFields = (
  agreements: Agreement[],
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
  onItemRenew: (event, agreement: Agreement) => void,
  onItemSelect: (event, agreement: AgreementView) => void,
  userType: ('Consumer' | 'Provider'),
): MarketplaceItem[] => agreements.map((agreement: Agreement) => {
  const {
    provider,
    title,
    monthlyFee,
    renewalDate,
    paymentToken,
    size,
    subscriptionPeriod,
    id,
    consumer,
    availableFunds,
  } = agreement
  const currency = crypto[paymentToken]

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

  let specificAttributes = {}

  if (userType === 'Consumer') {
    const titleValue = <AddressItem value={title || id} />
    const providerValue = <AddressItem value={provider} />
    specificAttributes = {
      title: titleValue,
      provider: providerValue,
      renew: (
        <SelectRowButton
          id={id}
          handleSelect={(event): void => {
            onItemRenew(event, agreement)
          }}
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
            'RENEWAL DATE': renewalDate.toLocaleDateString(
              undefined, { day: 'numeric', month: 'short', year: 'numeric' },
            ),
            title: titleValue,
          })}
        >
          View
        </SelectRowButton>
      ),
    }
  } else if (userType === 'Provider') {
    specificAttributes = {
      customer: <AddressItem value={consumer} />,
      availableFunds: (
        <ItemWUnit
          type="mediumPrimary"
          value={availableFunds.toPrecision(2)}
          unit="USD"
        />
      ),
      withdraw: (
        <SelectRowButton
          id={id}
          handleSelect={(): void => undefined}
        >
          Withdraw
        </SelectRowButton>
      ),
      view: (
        <SelectRowButton
          id={id}
          handleSelect={(): void => undefined}
        >
          {/* TODO: handle provider agreement view */}
          View
        </SelectRowButton>
      ),
    }
  }

  return {
    id,
    contentSize: sizeValue,
    monthlyFee: feeValue,
    renewalDate: renewalDate.toLocaleDateString(
      undefined, { day: 'numeric', month: 'short', year: 'numeric' },
    ),
    subscriptionPeriod,
    ...specificAttributes,
  }
})

export default createItemFields
