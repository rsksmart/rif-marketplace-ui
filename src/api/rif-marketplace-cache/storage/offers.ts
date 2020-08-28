import { AbstractAPIService } from 'api/models/apiService'
import {
  StorageItem, StorageOffer, BillingPlan, PeriodInSeconds,
} from 'models/marketItems/StorageItem'
import { OfferTransport } from 'api/models/storage/transports'
import { Big } from 'big.js'
import { parseToBigDecimal, parseToInt } from 'utils/parsers'
import { MinMaxFilter } from 'models/Filters'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { mapToTransport } from 'api/models/storage/StorageFilter'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'

export const offersAddress: StorageServiceAddress = 'storage/v0/offers'
export const offersWSChannel: StorageWSChannel = 'offers'

const mapFromTransport = (offerTransport: OfferTransport): StorageOffer => {
  const {
    provider,
    availableCapacity,
    plans,
  } = offerTransport

  const offer: StorageOffer = {
    id: provider,
    location: 'UK',
    system: 'IPFS',
    availableSize: new Big(availableCapacity),
    subscriptionOptions: plans
      .filter((plan) => !!PeriodInSeconds[plan.period])
      .map<BillingPlan>((plan) => ({
        period: PeriodInSeconds[plan.period],
        price: parseToBigDecimal(plan.price, 18),
        currency: 'RBTC',
      })),
    pricePGBPDay: plans
      .reduce<Big>((acc, plan) => {
        const period = new Big(plan.period)
        const price = parseToBigDecimal(plan.price, 18)
        const combinedPrice = acc.add(price.div(period))
        return combinedPrice
      }, new Big(0))
      .div(plans.length)
      .mul(new Big(PeriodInSeconds.Daily)),
  }
  return offer
}

enum MinMax {
  min = 1,
  max = -1.0
}

const fetchMinMaxLimit = async (
  service,
  minMax: MinMax,
  filedName: string,
  options?: {
    selectField?: string
    isWei?: true
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

  // Gets the result parses it io the correct decimal and ensures that the limits are always 1bigger/smaller than the actual largest/smallest price
  return result.reduce(
    (_, item): number => {
      if (options?.isWei) {
        return Math.round(parseToInt(item[select], 18)) - minMax
      }
      return Math.round(parseInt(item[select], 10)) - minMax
    },
    0,
  )
}

export class StorageOffersService extends AbstractAPIService implements StorageAPIService {
  path = offersAddress

  _channel = offersWSChannel

  _fetch = async (filters: StorageOffersFilters): Promise<StorageItem[]> => {
    const query = mapToTransport(filters)
    const result = await this.service.find({ query })

    return result.map(mapFromTransport)
  }

  fetchSizeLimits = async (): Promise<MinMaxFilter> => {
    const min = await fetchMinMaxLimit(this.service, MinMax.min, 'totalCapacity')
    const max = await fetchMinMaxLimit(this.service, MinMax.max, 'totalCapacity')
    return { min, max }
  }

  fetchPriceLimits = async (): Promise<MinMaxFilter> => {
    const min = await fetchMinMaxLimit(this.service, MinMax.min, 'averagePrice')
    const max = await fetchMinMaxLimit(this.service, MinMax.max, 'averagePrice')
    return { min, max }
  }
}
