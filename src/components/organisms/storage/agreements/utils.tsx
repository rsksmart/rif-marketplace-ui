import { Spinner } from '@rsksmart/rif-ui'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { RifAddress, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { AgreementUpdateData, ConfirmationData } from 'context/Confirmations/interfaces'
import { BaseFiat } from 'models/Fiat'
import { MarketCryptoRecord, TokenXR } from 'models/Market'
import { Agreement, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import React from 'react'
import { getShortDateString } from 'utils/dateUtils'
import { UNIT_PREFIX_POW2 } from 'utils/utils'

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
  { rate, displayName }: TokenXR,
  currentFiat: BaseFiat,
): AgreementView => {
  const {
    monthlyFee,
    renewalDate,
    size,
    subscriptionPeriod,
    id,
    dataReference,
  } = agreement

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
      priceFiat={monthlyFee.times(rate).toPrecision(3)}
      currency={displayName}
      currencyFiat={currentFiat?.displayName}
      divider=" "
    />
  )
  const idValue = <RifAddress value={id} />

  return {
    HASH: <RifAddress value={dataReference} disableChecksum />,
    title: idValue,
    'PRICE/GB': feeValue,
    AMOUNT: sizeValue,
    'RENEWAL DATE': renewalDate ? getShortDateString(renewalDate) : 'Expired',
    'SUBSCRIPTION PERIOD': subscriptionPeriod,
    CURRENCY: displayName,
    SYSTEM: 'IPFS',
  }
}

export const getCustomerViewFrom = (
  agreement: Agreement,
  currency: TokenXR,
  currentFiat: BaseFiat,
): AgreementCustomerView => {
  const agreementInfo = getCoreItemFields(agreement, currency, currentFiat)
  const {
    provider, withdrawableFunds,
  } = agreement

  const providerValue = <RifAddress value={provider} />
  const withdrawableFundsValue = (
    <ItemWUnit
      type="mediumPrimary"
      value={withdrawableFunds.toPrecision(2)}
      unit={currency.displayName}
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
  currentFiat: BaseFiat,
  onItemRenew: (event, agreement: Agreement) => void,
  onItemSelect: (
    event,
    agreementView: (AgreementCustomerView),
    agreement: Agreement
  ) => void,
  withdrawAndRenewConfs: ConfirmationData[],
): MarketplaceItem[] => agreements
  .filter(({ paymentToken: { symbol } }) => crypto[symbol])
  .map((agreement: Agreement) => {
    const {
      id, expiresInSeconds, isActive, paymentToken: { symbol },
    } = agreement
    const customerView = getCustomerViewFrom(
      agreement,
      crypto[symbol],
      currentFiat,
    )

    const isProcessingConfs = withdrawAndRenewConfs.some(
      ({ contractActionData }) => (
        (contractActionData as AgreementUpdateData).agreementId === id
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
      renew: isProcessingConfs
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
      view: isProcessingConfs
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
  currency: TokenXR,
  currentFiat: BaseFiat,
): AgreementProviderView => {
  const {
    consumer, toBePayedOut,
  } = agreement
  const consumerValue = <RifAddress value={consumer} />
  const toBePayedOutValue = (
    <ItemWUnit
      type="mediumPrimary"
      value={toBePayedOut.toPrecision(2)}
      unit={currency.displayName}
    />
  )

  const agreementInfo = getCoreItemFields(agreement, currency, currentFiat)

  return {
    ...agreementInfo,
    CONSUMER: consumerValue,
    'AVAILABLE FUNDS': toBePayedOutValue,
  } as AgreementProviderView
}

export const createProviderItemFields = (
  agreements: Agreement[],
  crypto: MarketCryptoRecord,
  currentFiat: BaseFiat,
  onItemWithdraw: (event, agreement: Agreement) => void,
  onItemSelect: (
    event,
    agreementView: (AgreementProviderView),
    agreement: Agreement,
  ) => void,
  payoutConfirmations: ConfirmationData[],
): MarketplaceItem[] => agreements
  .filter(({ paymentToken: { symbol } }) => crypto[symbol])
  .map((agreement: Agreement) => {
    const {
      id,
      paymentToken: { symbol },
    } = agreement

    const isProcessingPayoutConfs = payoutConfirmations.some(
      ({ contractActionData }) => (
        (contractActionData as AgreementUpdateData).agreementId === id
      ),
    )

    const providerView = getProviderViewFrom(
      agreement,
      crypto[symbol],
      currentFiat,
    )

    return {
      ...providerView,
      id,
      customer: providerView.CONSUMER,
      contentSize: providerView.AMOUNT,
      renewalDate: providerView['RENEWAL DATE'],
      subscriptionPeriod: providerView['SUBSCRIPTION PERIOD'],
      monthlyFee: providerView['PRICE/GB'],
      toBePayedOut: providerView['AVAILABLE FUNDS'],
      withdraw: isProcessingPayoutConfs
        ? <Spinner />
        : (
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
      view: isProcessingPayoutConfs
        ? <></>
        : (
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
