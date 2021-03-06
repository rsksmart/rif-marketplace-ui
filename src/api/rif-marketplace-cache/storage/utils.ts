import { AgreementTransport, BillingPlanTransport, OfferTransport } from 'api/models/storage/transports'
import { Big } from 'big.js'
import {
  Agreement, BillingPlan, PeriodInSeconds, StorageOffer, SubscriptionPeriod,
} from 'models/marketItems/StorageItem'
import { parseConvertBig, parseToBigDecimal } from 'utils/parsers'
import { getTokenByAddress } from 'utils/tokenUtils'
import { UNIT_PREFIX_POW2 } from 'utils/utils'

export enum MinMax {
  min = 1,
  max = -1,
}

export const calcMonthlyRate = (
  billingPrice: string,
  billingPeriod: number,
): Big => (billingPeriod === PeriodInSeconds.Monthly
  ? new Big(billingPrice)
  : new Big(billingPrice)
    .div(billingPeriod)
    .mul(PeriodInSeconds.Monthly))

export const calcPeriodPrice = (size: Big, billingPrice: string): Big => (
  size.times(parseToBigDecimal(billingPrice, 18))
)

export const mapOfferFromTransport = ({
  provider,
  availableCapacity: availableCapacityMB,
  plans,
  avgBillingPrice: averagePriceTransport,
  acceptedCurrencies,
  peerId,
  utilizedCapacity: utilizedCapacityMB,
  totalCapacity: totalCapacityMB,
}: OfferTransport): StorageOffer => {
  const availableCapacityGB = parseConvertBig(
    availableCapacityMB, UNIT_PREFIX_POW2.KILO,
  )

  const offer: StorageOffer = {
    id: provider,
    location: 'UK',
    system: 'IPFS',
    availableSizeGB: availableCapacityGB.lt(0) ? Big(0) : availableCapacityGB,
    subscriptionOptions: plans
      .sort(
        (
          { period: a }: BillingPlanTransport,
          { period: b }: BillingPlanTransport,
        ) => Number(a) - Number(b),
      )
      .filter(({ period }) => PeriodInSeconds[period])
      .map<BillingPlan>((plan) => ({
        period: PeriodInSeconds[plan.period],
        price: parseToBigDecimal(plan.price, 18),
        currency: getTokenByAddress(plan.tokenAddress),
      })),
    averagePrice: averagePriceTransport,
    acceptedCurrencies,
    peerId,
    utilizedCapacityGB: parseConvertBig(
      utilizedCapacityMB, UNIT_PREFIX_POW2.KILO,
    ),
    totalCapacityGB: parseConvertBig(
      totalCapacityMB, UNIT_PREFIX_POW2.KILO,
    ),
    isActive: Number(totalCapacityMB) > 0,
  }
  return offer
}

export const mapAgreementFromTransport = ({
  agreementReference,
  dataReference,
  billingPeriod,
  billingPrice,
  tokenAddress,
  expiresIn,
  offerId,
  size,
  consumer,
  availableFunds,
  toBePayedOut,
  periodsSinceLastPayout,
  isActive,
}: AgreementTransport): Agreement => {
  const expiresInSeconds = parseInt(expiresIn, 10)
  const contentSize = new Big(size)

  // periodsSinceLastPayout comes floored, so we add the current period
  const unpaidPeriods = new Big(Number(periodsSinceLastPayout) + 1)
  const priceOfUnpaidPeriods = unpaidPeriods
    .times(calcPeriodPrice(contentSize, billingPrice))
  const withdrawableFunds = expiresInSeconds
    ? parseToBigDecimal(availableFunds, 18).minus(priceOfUnpaidPeriods)
    : Big(0)

  const aux = new Date(Date.now() + expiresInSeconds * 1000)
  const renewalDate = expiresInSeconds
    ? new Date(aux.toDateString()) : undefined

  return {
    id: agreementReference,
    isActive,
    provider: offerId,
    dataReference,
    subscriptionPrice: new Big(billingPrice),
    expiresInSeconds,
    renewalDate,
    monthlyFee: parseToBigDecimal(
      calcMonthlyRate(billingPrice, billingPeriod).times(contentSize), 18,
    ),
    size: contentSize,
    subscriptionPeriod: PeriodInSeconds[billingPeriod] as SubscriptionPeriod,
    title: '',
    paymentToken: getTokenByAddress(tokenAddress),
    consumer,
    withdrawableFunds,
    toBePayedOut: parseToBigDecimal(toBePayedOut, 18),
  }
}
