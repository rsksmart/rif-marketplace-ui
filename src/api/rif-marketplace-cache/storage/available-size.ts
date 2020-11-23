import { MinMaxFilter } from 'models/Filters'
import { AbstractAPIService } from 'api/models/apiService'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'
import client from '../client'

export const availableCapacityAddress: StorageServiceAddress = 'storage/v0/availableCapacity'

export class AvailableCapacityService
  extends AbstractAPIService implements StorageAPIService {
  path = availableCapacityAddress

  constructor() { super(client) }

  _channel = 'availableCapacity' as StorageWSChannel

  _fetch = (): Promise<[number, number]> => this.service.find()

  fetchSizeLimits = async (): Promise<MinMaxFilter> => {
    // this 1 arg is required by service interface, but it's not actually used
    const { min: minMB, max: maxMB } = await this.service.get(1)
    return {
      min: minMB / UNIT_PREFIX_POW2.KILO,
      max: maxMB / UNIT_PREFIX_POW2.KILO,
    }
  }
}
