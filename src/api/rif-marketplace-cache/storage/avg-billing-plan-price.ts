import { MinMaxFilter } from 'models/Filters'
import { AbstractAPIService } from 'api/models/apiService'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'

export const avgBillingPlanAddress: StorageServiceAddress = 'storage/v0/avgBillingPrice'

export class AvgBillingPriceService
  extends AbstractAPIService implements StorageAPIService {
    path = avgBillingPlanAddress

    _channel = 'avgPrice' as StorageWSChannel

    _fetch = (): Promise<[number, number]> => this.service.find()

    fetchPriceLimits = async (): Promise<MinMaxFilter> => {
      // this 1 arg is required by service interface, but it's not actually used
      const { min, max } = await this.service.get(1)
      return {
        min,
        max,
      }
    }
}
