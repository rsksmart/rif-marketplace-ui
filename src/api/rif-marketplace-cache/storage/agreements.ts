import { AbstractAPIService } from 'api/models/apiService'
import { AgreementTransport } from 'api/models/storage/transports'
import { Big } from 'big.js'
import { ZERO_ADDRESS } from 'constants/strings'
import { Agreement, PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { parseToBigDecimal } from 'utils/parsers'
import { SUPPORTED_TOKENS, SupportedTokens } from '../../../contracts/interfaces'
import { availableTokens } from '../rns/common'
import {
  AgreementFilters, StorageAPIService, StorageServiceAddress, StorageWSChannel,
} from './interfaces'

export const agreementsAddress: StorageServiceAddress = 'storage/v0/agreements'
export const agreementsWSChannel: StorageWSChannel = 'agreements'

const getPaymentToken = (tokenAddress: string): SupportedTokens => {
  if (tokenAddress === ZERO_ADDRESS) {
    return SUPPORTED_TOKENS.RBTC
  }
  return Object
    .entries(availableTokens)
    .reduce(
      (acc, [symbol, addr]) => (addr === tokenAddress ? symbol as SupportedTokens : acc),
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
}: AgreementTransport): Agreement => {
  const miliesToDeath = parseInt(expiresIn, 10) * 1000
  const contentSize = new Big(size)

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
    availableFunds: parseToBigDecimal(availableFunds, 18),
  }
}

export class StorageAgreementService extends AbstractAPIService
  implements StorageAPIService {
  path = agreementsAddress

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
