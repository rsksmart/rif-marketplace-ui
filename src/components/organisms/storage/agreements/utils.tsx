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
  'HASH': JSX.Element
  'CURRENCY': string
  'SYSTEM': string
  'AMOUNT': JSX.Element
  'PRICE/GB': JSX.Element // monthly fee
  'SUBSCRIPTION PERIOD': SubscriptionPeriod
  'RENEWAL DATE': string
}

export type AgreementProviderView = AgreementView & {
  'CONSUMER': JSX.Element
  'AVAILABLE FUNDS': JSX.Element
}

export type AgreementCustomerView = AgreementView & {
  'PROVIDER': JSX.Element
}

const getCoreItemFields = (
  agreement: Agreement,
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
): AgreementView => {
  const {
    title,
    monthlyFee,
    renewalDate,
    paymentToken,
    size,
    subscriptionPeriod,
    id,
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
  const titleValue = <AddressItem value={title || id} />

  const renewalDateValue = renewalDate.toLocaleDateString(
    undefined, { day: 'numeric', month: 'short', year: 'numeric' },
  )

  return {
    HASH: <AddressItem value={id} />,
    title: titleValue,
    'PRICE/GB': feeValue,
    AMOUNT: sizeValue,
    'RENEWAL DATE': renewalDateValue,
    'SUBSCRIPTION PERIOD': subscriptionPeriod,
    CURRENCY: tokenDisplayNames[paymentToken],
    SYSTEM: 'IPFS',
  }
}

export const createCustomerItemFields = (
  agreements: Agreement[],
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
  onItemRenew: (event, agreement: Agreement) => void,
  onItemSelect: (
    event,
    agreementView: (AgreementCustomerView)
  ) => void,
): MarketplaceItem[] => agreements.map((agreement: Agreement) => {
  const agreementInfo = getCoreItemFields(agreement, crypto, currentFiat)
  const { id, provider } = agreement
  const providerValue = <AddressItem value={provider} />

  return {
    ...agreementInfo,
    id,
    provider: providerValue,
    contentSize: agreementInfo.AMOUNT,
    renewalDate: agreementInfo['RENEWAL DATE'],
    subscriptionPeriod: agreementInfo['SUBSCRIPTION PERIOD'],
    monthlyFee: agreementInfo['PRICE/GB'],
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
          ...agreementInfo,
          PROVIDER: providerValue,
        } as AgreementCustomerView)}
      >
        View
      </SelectRowButton>
    ),
  }
})

export const createProviderItemFields = (
  agreements: Agreement[],
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
  onItemWithdraw: (event, agreement: Agreement) => void,
  onItemSelect: (
    event,
    agreementView: (AgreementProviderView)
  ) => void,
): MarketplaceItem[] => agreements.map((agreement: Agreement) => {
  const agreementInfo = getCoreItemFields(agreement, crypto, currentFiat)
  const {
    id, consumer, availableFunds, paymentToken,
  } = agreement
  const consumerValue = <AddressItem value={consumer} />
  const availableFundsValue = (
    <ItemWUnit
      type="mediumPrimary"
      value={availableFunds.toPrecision(2)}
      unit={tokenDisplayNames[paymentToken]}
    />
  )

  return {
    ...agreementInfo,
    id,
    customer: consumerValue,
    contentSize: agreementInfo.AMOUNT,
    renewalDate: agreementInfo['RENEWAL DATE'],
    subscriptionPeriod: agreementInfo['SUBSCRIPTION PERIOD'],
    monthlyFee: agreementInfo['PRICE/GB'],
    availableFunds: availableFundsValue,
    withdraw: (
      <SelectRowButton
        id={id}
        handleSelect={(event): void => {
          onItemWithdraw(event, agreement)
        }}
      >
        Withdraw
      </SelectRowButton>
    ),
    view: (
      <SelectRowButton
        id={id}
        handleSelect={(event): void => onItemSelect(event, {
          ...agreementInfo,
          CONSUMER: consumerValue,
          'AVAILABLE FUNDS': availableFundsValue,
        } as AgreementProviderView)}
      >
        View
      </SelectRowButton>
    ),
  }
})
