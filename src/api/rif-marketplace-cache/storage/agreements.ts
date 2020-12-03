import { AbstractAPIService } from 'api/models/apiService'
import AgreementFiltersTransport from 'api/models/storage/AgreementFiltersTransport'
import { AgreementTransport } from 'api/models/storage/transports'
import { Agreement } from 'models/marketItems/StorageItem'
import client from '../client'
import {
  AgreementFilters, StorageAPIService, StorageServiceAddress, StorageWSChannel,
} from './interfaces'
import { mapAgreementFromTransport } from './utils'

export const agreementsAddress: StorageServiceAddress = 'storage/v0/agreements'
export const agreementsWSChannel: StorageWSChannel = 'agreements'

export class StorageAgreementService extends AbstractAPIService
  implements StorageAPIService {
  path = agreementsAddress

  private mapFromTransport: (
    value: AgreementTransport,
    index: number,
    array: AgreementTransport[]
  ) => Agreement

  constructor() {
    super(client)
    this.mapFromTransport = mapAgreementFromTransport // This could be moved to constructor args
  }

  _channel = agreementsWSChannel

  _fetch = async (filters: AgreementFilters): Promise<Agreement[]> => {
    const result = await this.service.find({
      query: new AgreementFiltersTransport(filters),
    })

    return result.map(this.mapFromTransport)
  }
}
