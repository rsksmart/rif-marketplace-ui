import { Big } from 'big.js'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import StorageFiltersTransport from 'api/models/storage/StorageFiltersTransport'
import { BillingPlanTransport, OfferTransport } from 'api/models/storage/transports'
import { parseConvertBig, parseToBigDecimal } from 'utils/parsers'
import { MinMaxFilter } from 'models/Filters'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import {
  BillingPlan, PeriodInSeconds, StorageItem, StorageOffer,
} from 'models/marketItems/StorageItem'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { SUPPORTED_TOKENS } from 'contracts/interfaces'
import { Paginated } from '@feathersjs/feathers'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'
import { MinMax } from './utils'
import client from '../client'

export const offersAddress: StorageServiceAddress = 'storage/v0/offers'
export const offersWSChannel: StorageWSChannel = 'offers'

const mapFromTransport = (offerTransport: OfferTransport): StorageOffer => {
  const {
    provider,
    availableCapacity: availableCapacityMB,
    plans,
    avgBillingPrice: averagePriceTransport,
    acceptedCurrencies,
    peerId,
    utilizedCapacity: utilizedCapacityMB,
    totalCapacity: totalCapacityMB,
  } = offerTransport

  const availableCapacityGB = parseConvertBig(
    availableCapacityMB, UNIT_PREFIX_POW2.KILO,
  )

  const offer: StorageOffer = {
    id: provider,
    location: 'UK',
    system: 'IPFS',
    availableSizeGB: availableCapacityGB.lt(0) ? Big(0) : availableCapacityGB,
    subscriptionOptions: plans
      .sort(
        (a: BillingPlanTransport, b: BillingPlanTransport) => (
          parseInt(a.period, 10) - parseInt(b.period, 10)
        ),
      )
      .filter((plan) => Boolean(PeriodInSeconds[plan.period]))
      .map<BillingPlan>((plan) => ({
        period: PeriodInSeconds[plan.period],
        price: parseToBigDecimal(plan.price, 18),
        currency: SUPPORTED_TOKENS[plan.rateId],
      })),
    averagePrice: averagePriceTransport,
    acceptedCurrencies,
    peerId,
    utilizedCapacityGB: parseConvertBig(
      utilizedCapacityMB, UNIT_PREFIX_POW2.KILO,
    ),
    totalCapacityGB: parseConvertBig(
      totalCapacityMB, UNIT_PREFIX_POW2.KILO,
    ),
    isActive: Number(totalCapacityMB) > 0,
  }
  return offer
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

  return result.reduce((_, item): number => {
    const round = minMax === MinMax.min ? Math.floor : Math.ceil
    return round(parseFloat(item[select]))
  }, 0)
}

export class StorageOffersService extends AbstractAPIService
  implements StorageAPIService {
  path = offersAddress

  constructor() { super(client) }

  _channel = offersWSChannel

  _fetch = async (filters: StorageOffersFilters): Promise<StorageItem[]> => {
    const query = filters && new StorageFiltersTransport(filters)
    const result: Paginated<OfferTransport> = await this.service.find({ query })

    const { data, ...metadata } = isResultPaginated(result)
      ? result : { data: result }
    this.meta = metadata

    return data.map(mapFromTransport)
  }

  fetchSizeLimits = async (): Promise<MinMaxFilter> => {
    const minMB = await fetchMinMaxLimit(
      this.service,
      MinMax.min,
      'totalCapacity',
    )
    const maxMB = await fetchMinMaxLimit(
      this.service,
      MinMax.max,
      'totalCapacity',
    )
    return {
      min: minMB / UNIT_PREFIX_POW2.KILO,
      max: maxMB / UNIT_PREFIX_POW2.KILO,
    }
  }
}
