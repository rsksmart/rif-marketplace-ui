import { MinMaxFilter } from 'models/Filters'
import { AbstractAPIService } from 'api/models/apiService'
import { StorageAPIService, StorageWSChannel } from './interfaces'
import client from '../client'

export const avgBillingPlanAddress = 'storage/v0/avgBillingPrice' as const
export type AvgBillingPlanAddress = typeof avgBillingPlanAddress

export class AvgBillingPriceService
  extends AbstractAPIService implements StorageAPIService {
  path = avgBillingPlanAddress

  constructor () { super(client) }

  _channel = 'avgPrice' as StorageWSChannel

  _fetch = async (): Promise<[number, number]> => await this.service.find()

  fetchPriceLimits = async (): Promise<MinMaxFilter> => {
    // this 1 arg is required by service interface, but it's not actually used
    const { min, max } = await this.service.get(1)
    return {
      min,
      max,
    }
  }
}
