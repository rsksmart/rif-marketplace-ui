import { Big } from 'big.js'
import { AbstractAPIService } from 'api/models/apiService'
import { AgreementTransport } from 'api/models/storage/transports'
import { Agreement, PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { ZERO_ADDRESS } from 'constants/strings'
import { parseToBigDecimal } from 'utils/parsers'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'
import { availableTokens } from '../rns/common'
import { SupportedToken } from '../rates/xr'

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

export const calcMonthlyRate = (
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
      calcMonthlyRate(
        billingPrice,
        billingPeriod,
      ).times(contentSize), 18,
    ),
    size: contentSize,
    subscriptionPeriod: PeriodInSeconds[billingPeriod] as SubscriptionPeriod,
    title: '',
    paymentToken: getPaymentToken(tokenAddress),
  }
}

export class StorageAgreementService extends AbstractAPIService
  implements StorageAPIService {
  path = agreementsAddress

  _channel = agreementsWSChannel

  _fetch = async ({ account }): Promise<Agreement[]> => {
    const result = await this.service.find({
      query: {
        consumer: account,
      },
    })

    return result.map(mapFromTransport)
  }
}
