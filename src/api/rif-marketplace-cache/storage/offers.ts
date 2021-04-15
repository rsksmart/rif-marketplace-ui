import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import OfferFiltersTransport from 'api/models/storage/OfferFiltersTransport'
import { OfferTransport } from 'api/models/storage/transports'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem, StorageOffer } from 'models/marketItems/StorageItem'
import client from '../client'
import { StorageAPIService, StorageWSChannel } from './interfaces'
import { mapOfferFromTransport } from './utils'

export const offersAddress = 'storage/v0/offers' as const
export type OffersAddress = typeof offersAddress
export const offersWSChannel: StorageWSChannel = 'offers'

export class StorageOffersService extends AbstractAPIService
  implements StorageAPIService {
  path = offersAddress

  private mapFromTransport: (
    value: OfferTransport,
    index: number,
    array: OfferTransport[]
  ) => StorageOffer

  constructor() {
    super(client)
    this.mapFromTransport = mapOfferFromTransport // This could be moved to constructor args
  }

  _channel = offersWSChannel

  _fetch = async (filters: StorageOffersFilters): Promise<StorageItem[]> => {
    const query = filters && new OfferFiltersTransport(filters)
    const result: Paginated<OfferTransport> = await this.service.find({ query })

    const { data, ...metadata } = isResultPaginated(result)
      ? result : { data: result }
    this.meta = metadata

    return data.map(this.mapFromTransport)
  }
}
