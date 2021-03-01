import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import OfferFiltersTransport from 'api/models/storage/OfferFiltersTransport'
import { OfferTransport } from 'api/models/storage/transports'
import { MinMaxFilter } from 'models/Filters'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem, StorageOffer } from 'models/marketItems/StorageItem'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import client from '../client'
import { StorageAPIService, StorageWSChannel } from './interfaces'
import { mapOfferFromTransport, MinMax } from './utils'

export const offersAddress = 'storage/v0/offers' as const
export type OffersAddress = typeof offersAddress
export const offersWSChannel: StorageWSChannel = 'offers'

export class StorageOffersService extends AbstractAPIService
  implements StorageAPIService {
  path = offersAddress

  private readonly mapFromTransport: (
    value: OfferTransport,
    index: number,
    array: OfferTransport[]
  ) => StorageOffer

  constructor () {
    super(client)
    this.mapFromTransport = mapOfferFromTransport // This could be moved to constructor args
  }

  _channel = offersWSChannel

  _fetch = async (filters: StorageOffersFilters): Promise<StorageItem[]> => {
    const query = filters && new OfferFiltersTransport(filters)
    const result: Paginated<OfferTransport> = await this.service.find({ query })

    const { data, ...metadata } = isResultPaginated(result)
      ? result
      : { data: result }
    this.meta = metadata

    return data.map(this.mapFromTransport)
  }

  fetchSizeLimits = async (): Promise<MinMaxFilter> => {
    const minMB = await this.fetchMinMaxLimit(
      this.service,
      MinMax.min,
      'totalCapacity',
    )
    const maxMB = await this.fetchMinMaxLimit(
      this.service,
      MinMax.max,
      'totalCapacity',
    )
    return {
      min: minMB / UNIT_PREFIX_POW2.KILO,
      max: maxMB / UNIT_PREFIX_POW2.KILO,
    }
  }

  private readonly fetchMinMaxLimit = async (
    service,
    minMax: MinMax,
    filedName: string,
    options?: {
      selectField?: string
    },
  ): Promise<number> => {
    const select = options?.selectField ?? filedName
    const query = {
      $limit: 1,
      $sort: {
        [filedName]: minMax,
      },
      $select: [select],
    }
    const result = await service.find({ query })

    return result.reduce((_, item): number => {
      const round = minMax === MinMax.min ? Math.floor : Math.ceil
      return round(parseFloat(item[select]))
    }, 0)
  }
}
