import React from 'react'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import { MarketFiat } from 'context/Market/MarketContext'
import { MarketCryptoRecord } from 'models/Market'
import { Agreement, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import { getShortDateString } from 'utils/dateUtils'
import { Spinner } from '@rsksmart/rif-ui'
import { AgreementWithdrawData, ConfirmationData } from 'context/Confirmations/interfaces'

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
  'WITHDRAWABLE FUNDS': JSX.Element
}

const getCoreItemFields = (
  agreement: Agreement,
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
): AgreementView => {
  const {
    monthlyFee,
    renewalDate,
    paymentToken,
    size,
    subscriptionPeriod,
    id,
    dataReference,
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
      price={monthlyFee.toString()}
      priceFiat={currency && monthlyFee.times(currency.rate).toPrecision(3)}
      currency={currency && currency.displayName}
      currencyFiat={currentFiat.displayName}
      divider=" "
    />
  )
  const idValue = <AddressItem value={id} />

  return {
    HASH: <AddressItem value={dataReference} />,
    title: idValue,
    'PRICE/GB': feeValue,
    AMOUNT: sizeValue,
    'RENEWAL DATE': renewalDate ? getShortDateString(renewalDate) : 'Expired',
    'SUBSCRIPTION PERIOD': subscriptionPeriod,
    CURRENCY: tokenDisplayNames[paymentToken],
    SYSTEM: 'IPFS',
  }
}

export const getCustomerViewFrom = (
  agreement: Agreement,
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
): AgreementCustomerView => {
  const agreementInfo = getCoreItemFields(agreement, crypto, currentFiat)
  const {
    provider, paymentToken, withdrawableFunds,
  } = agreement

  const providerValue = <AddressItem value={provider} />
  const withdrawableFundsValue = (
    <ItemWUnit
      type="mediumPrimary"
      value={withdrawableFunds.toPrecision(2)}
      unit={tokenDisplayNames[paymentToken]}
    />
  )

  return {
    ...agreementInfo,
    PROVIDER: providerValue,
    'WITHDRAWABLE FUNDS': withdrawableFundsValue,
  } as AgreementCustomerView
}

export const createCustomerItemFields = (
  agreements: Agreement[],
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
  onItemRenew: (event, agreement: Agreement) => void,
  onItemSelect: (
    event,
    agreementView: (AgreementCustomerView),
    agreement: Agreement
  ) => void,
  withdrawConfirmations: ConfirmationData[],
): MarketplaceItem[] => agreements.map((agreement: Agreement) => {
  const {
    id, expiresInSeconds, isActive,
  } = agreement
  const customerView = getCustomerViewFrom(agreement, crypto, currentFiat)

  const isProcessingWithdrawConfs = withdrawConfirmations.some(
    ({ contractActionData }) => (
      (contractActionData as AgreementWithdrawData).agreementId === id
    ),
  )

  return {
    ...customerView,
    id,
    provider: customerView.PROVIDER,
    contentSize: customerView.AMOUNT,
    renewalDate: customerView['RENEWAL DATE'],
    subscriptionPeriod: customerView['SUBSCRIPTION PERIOD'],
    monthlyFee: customerView['PRICE/GB'],
    withdrawableFunds: customerView['WITHDRAWABLE FUNDS'],
    renew: isProcessingWithdrawConfs
      ? <Spinner />
      : (
        <SelectRowButton
          id={id}
          disabled={!expiresInSeconds || !isActive}
          handleSelect={(event): void => {
            onItemRenew(event, agreement)
          }}
        >
          Renew
        </SelectRowButton>
      ),
    view: isProcessingWithdrawConfs
      ? <></>
      : (
        <SelectRowButton
          id={id}
          handleSelect={(event): void => onItemSelect(
            event, customerView, agreement,
          )}
        >
          View
        </SelectRowButton>
      ),
  }
})

export const getProviderViewFrom = (
  agreement: Agreement,
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
): AgreementProviderView => {
  const agreementInfo = getCoreItemFields(agreement, crypto, currentFiat)
  const {
    consumer, paymentToken, toBePayedOut,
  } = agreement
  const consumerValue = <AddressItem value={consumer} />
  const toBePayedOutValue = (
    <ItemWUnit
      type="mediumPrimary"
      value={toBePayedOut.toPrecision(2)}
      unit={tokenDisplayNames[paymentToken]}
    />
  )

  return {
    ...agreementInfo,
    CONSUMER: consumerValue,
    'AVAILABLE FUNDS': toBePayedOutValue,
  } as AgreementProviderView
}

export const createProviderItemFields = (
  agreements: Agreement[],
  crypto: MarketCryptoRecord,
  currentFiat: MarketFiat,
  onItemWithdraw: (event, agreement: Agreement) => void,
  onItemSelect: (
    event,
    agreementView: (AgreementProviderView),
    agreement: Agreement,
  ) => void,
): MarketplaceItem[] => agreements.map((agreement: Agreement) => {
  const providerView = getProviderViewFrom(agreement, crypto, currentFiat)
  const {
    id,
  } = agreement

  return {
    ...providerView,
    id,
    customer: providerView.CONSUMER,
    contentSize: providerView.AMOUNT,
    renewalDate: providerView['RENEWAL DATE'],
    subscriptionPeriod: providerView['SUBSCRIPTION PERIOD'],
    monthlyFee: providerView['PRICE/GB'],
    toBePayedOut: providerView['AVAILABLE FUNDS'],
    withdraw: (
      <SelectRowButton
        id={id}
        handleSelect={(event): void => {
          onItemWithdraw(event, agreement)
        }}
        disabled={Number(agreement.toBePayedOut) <= 0}
      >
        Withdraw
      </SelectRowButton>
    ),
    view: (
      <SelectRowButton
        id={id}
        handleSelect={(event): void => onItemSelect(
          event, providerView, agreement,
        )}
      >
        View
      </SelectRowButton>
    ),
  }
})
