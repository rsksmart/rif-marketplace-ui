import { MinMaxFilter } from 'models/Filters'
import { AbstractAPIService } from 'api/models/apiService'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'
import { MinMax } from './offers'

export const avgBillingPlanAddress: StorageServiceAddress = 'storage/v0/avgBillingPrice'

export class AvgBillingPriceService
  extends AbstractAPIService implements StorageAPIService {
    path = avgBillingPlanAddress

    _channel = 'avgPrice' as StorageWSChannel

    _fetch = (): Promise<[number, number]> => this.service.find()

    fetchPriceLimits = async (): Promise<MinMaxFilter> => {
      const min = await this.service.get(MinMax.min)
      const max = await this.service.get(MinMax.max)
      return {
        min,
        max,
      }
    }
}
