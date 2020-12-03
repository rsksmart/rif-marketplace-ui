import { AbstractAPIService } from 'api/models/apiService'
import { AgreementTransport } from 'api/models/storage/transports'
import { Big } from 'big.js'
import { ZERO_ADDRESS } from 'constants/strings'
import { Agreement, PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { parseToBigDecimal } from 'utils/parsers'
import { SUPPORTED_TOKENS, SupportedTokens } from 'contracts/interfaces'
import { availableTokens } from '../rns/common'
import {
  AgreementFilters, StorageAPIService, StorageServiceAddress, StorageWSChannel,
} from './interfaces'
import client from '../client'

export const agreementsAddress: StorageServiceAddress = 'storage/v0/agreements'
export const agreementsWSChannel: StorageWSChannel = 'agreements'

const getPaymentToken = (tokenAddress: string): SupportedTokens => {
  if (tokenAddress === ZERO_ADDRESS) {
    return SUPPORTED_TOKENS.rbtc
  }
  return Object
    .entries(availableTokens)
    .reduce(
      (acc, [addr, symbol]) => (addr === tokenAddress ? symbol as SupportedTokens : acc),
      '' as SupportedTokens,
    )
}

const calcMonthlyRate = (
  billingPrice: string,
  billingPeriod: number,
): Big => (billingPeriod === PeriodInSeconds.Monthly
  ? new Big(billingPrice)
  : new Big(billingPrice)
    .div(billingPeriod)
    .mul(PeriodInSeconds.Monthly))

const calcPeriodPrice = (size: Big, billingPrice: string): Big => (
  size.times(parseToBigDecimal(billingPrice, 18))
)

const mapFromTransport = ({
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

  return {
    id: agreementReference,
    isActive,
    provider: offerId,
    dataReference,
    subscriptionPrice: new Big(billingPrice),
    expiresInSeconds,
    renewalDate: expiresInSeconds
      ? new Date(Date.now() + expiresInSeconds * 1000)
      : undefined,
    monthlyFee: parseToBigDecimal(
      calcMonthlyRate(billingPrice, billingPeriod).times(contentSize), 18,
    ),
    size: contentSize,
    subscriptionPeriod: PeriodInSeconds[billingPeriod] as SubscriptionPeriod,
    title: '',
    paymentToken: getPaymentToken(tokenAddress.toLowerCase()),
    consumer,
    withdrawableFunds,
    toBePayedOut: parseToBigDecimal(toBePayedOut, 18),
  }
}

export class StorageAgreementService extends AbstractAPIService
  implements StorageAPIService {
  path = agreementsAddress

  constructor() { super(client) }

  _channel = agreementsWSChannel

  _fetch = async ({
    consumer, provider: offerId,
  }: AgreementFilters): Promise<Agreement[]> => {
    const result = await this.service.find({
      query: { consumer, offerId },
    })

    return result.map(mapFromTransport)
  }
}
