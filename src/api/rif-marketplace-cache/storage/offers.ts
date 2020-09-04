import { AbstractAPIService } from 'api/models/apiService'
import {
  StorageItem, StorageOffer, BillingPlan, PeriodInSeconds,
} from 'models/marketItems/StorageItem'
import { OfferTransport } from 'api/models/storage/transports'
import { Big } from 'big.js'
import { parseToBigDecimal } from 'utils/parsers'
import { MinMaxFilter } from 'models/Filters'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { mapToTransport } from 'api/models/storage/StorageFilter'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'

export const offersAddress: StorageServiceAddress = 'storage/v0/offers'
export const offersWSChannel: StorageWSChannel = 'offers'

const mapFromTransport = (offerTransport: OfferTransport): StorageOffer => {
  const {
    provider,
    availableCapacity: availableCapacityMB,
    plans,
    averagePrice,
  } = offerTransport

  const offer: StorageOffer = {
    id: provider,
    location: 'UK',
    system: 'IPFS',
    availableSizeGB: new Big(availableCapacityMB).div(UNIT_PREFIX_POW2.KILO),
    subscriptionOptions: plans
      .filter((plan) => !!PeriodInSeconds[plan.period])
      .map<BillingPlan>((plan) => ({
        period: PeriodInSeconds[plan.period],
        price: parseToBigDecimal(plan.price, 18),
        currency: 'RBTC',
      })),
    averagePrice: averagePrice / 10 ** 18,
  }
  return offer
}

enum MinMax {
  min = 1,
  max = -1
}

const fetchMinMaxLimit = async (
  service,
  minMax: MinMax,
  filedName: string,
  options?: {
    selectField?: string
  },
): Promise<number> => {
  const select = options?.selectField || filedName
  const query = {
    $limit: 1,
    $sort: {
      [filedName]: minMax,
    },
    $select: [select],
  }
  const result = await service.find({ query })

  return result.reduce(
    (_, item): number => {
      const round = minMax === MinMax.min ? Math.floor : Math.ceil
      return round(parseFloat(item[select]))
    },
    0,
  )
}

export class StorageOffersService
  extends AbstractAPIService implements StorageAPIService {
  path = offersAddress

  _channel = offersWSChannel

  _fetch = async (filters: StorageOffersFilters): Promise<StorageItem[]> => {
    const query = filters && mapToTransport(filters)
    const result = await this.service.find({ query })

    return result.map(mapFromTransport)
  }

  fetchSizeLimits = async (): Promise<MinMaxFilter> => {
    const minMB = await fetchMinMaxLimit(this.service, MinMax.min, 'totalCapacity')
    const maxMB = await fetchMinMaxLimit(this.service, MinMax.max, 'totalCapacity')
    return {
      min: minMB / UNIT_PREFIX_POW2.KILO,
      max: maxMB / UNIT_PREFIX_POW2.KILO,
    }
  }

  fetchPriceLimits = async (): Promise<MinMaxFilter> => {
    const min = await fetchMinMaxLimit(this.service, MinMax.min, 'averagePrice')
    const max = await fetchMinMaxLimit(this.service, MinMax.max, 'averagePrice')
    return { min, max }
  }
}
