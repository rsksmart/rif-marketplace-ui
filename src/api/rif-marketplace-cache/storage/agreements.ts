import { AbstractAPIService } from 'api/models/apiService'
import { AgreementTransport } from 'api/models/storage/transports'
import { Agreement } from 'models/marketItems/StorageItem'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'

export const agreementsAddress: StorageServiceAddress = 'storage/v0/agreements'
export const agreementsWSChannel: StorageWSChannel = 'agreements'

const mapFromTransport = (txItem: AgreementTransport): void => {

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
