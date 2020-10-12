import { Big } from 'big.js'
import { AbstractAPIService } from 'api/models/apiService'
import { AgreementTransport } from 'api/models/storage/transports'
import { Agreement, PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'

export const agreementsAddress: StorageServiceAddress = 'storage/v0/agreements'
export const agreementsWSChannel: StorageWSChannel = 'agreements'

const mapFromTransport = ({
  agreementReference,
  billingPeriod,
  expiresIn,
  offerId,
  size,
}: AgreementTransport): Agreement => ({
  id: agreementReference,
  provider: offerId,
  monthlyFee: new Big(0),
  renewalDate: new Date(Date.now() / 1000 + expiresIn),
  size,
  subscriptionPeriod: PeriodInSeconds[billingPeriod] as SubscriptionPeriod,
  title: '',
})

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
