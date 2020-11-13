import { Big } from 'big.js'
import { AbstractAPIService } from 'api/models/apiService'
import { AgreementTransport } from 'api/models/storage/transports'
import { Agreement, PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { ZERO_ADDRESS } from 'constants/strings'
import { parseToBigDecimal } from 'utils/parsers'
import {
  AgreementFilters, StorageAPIService, StorageServiceAddress, StorageWSChannel,
} from './interfaces'
import { availableTokens } from '../rns/common'
import { SupportedToken } from '../rates/xr'
import client from '../client'

export const agreementsAddress: StorageServiceAddress = 'storage/v0/agreements'
export const agreementsWSChannel: StorageWSChannel = 'agreements'

const getPaymentToken = (tokenAddress: string): SupportedToken => {
  const tokenIsRbtc = tokenAddress === ZERO_ADDRESS
  const tokenSymbol = Object.entries(availableTokens).reduce((acc, [symbol, addr]) => {
    if (addr === tokenAddress) {
      // eslint-disable-next-line no-param-reassign
      acc = symbol as SupportedToken
    }
    return acc
  }, '' as SupportedToken)

  return tokenIsRbtc
    ? 'rbtc'
    : tokenSymbol
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
}: AgreementTransport): Agreement => {
  const miliesToDeath = parseInt(expiresIn, 10) * 1000
  const contentSize = new Big(size)

  // periodsSinceLastPayout comes floored, so we add the current period
  const unpaidPeriods = new Big(Number(periodsSinceLastPayout) + 1)
  const priceOfUnpaidPeriods = unpaidPeriods
    .times(calcPeriodPrice(contentSize, billingPrice))
  const withdrawableFunds = parseToBigDecimal(availableFunds, 18)
    .minus(priceOfUnpaidPeriods)

  return {
    id: agreementReference,
    provider: offerId,
    dataReference,
    subscriptionPrice: new Big(billingPrice),
    renewalDate: new Date(Date.now() + miliesToDeath),
    monthlyFee: parseToBigDecimal(
      calcMonthlyRate(billingPrice, billingPeriod).times(contentSize), 18,
    ),
    size: contentSize,
    subscriptionPeriod: PeriodInSeconds[billingPeriod] as SubscriptionPeriod,
    title: '',
    paymentToken: getPaymentToken(tokenAddress),
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
