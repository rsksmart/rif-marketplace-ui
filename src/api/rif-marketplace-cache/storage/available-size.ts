import { MinMaxFilter } from 'models/Filters'
import { AbstractAPIService } from 'api/models/apiService'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { StorageAPIService, StorageWSChannel } from './interfaces'
import client from '../client'

export const availableCapacityAddress = 'storage/v0/availableCapacity' as const
export type AvailableCapacityAddress = typeof availableCapacityAddress
export class AvailableCapacityService
  extends AbstractAPIService implements StorageAPIService {
  path = availableCapacityAddress

  constructor () { super(client) }

  _channel = 'availableCapacity' as StorageWSChannel

  _fetch = async (): Promise<[number, number]> => await this.service.find()

  fetchSizeLimits = async (): Promise<MinMaxFilter> => {
    const {
      min: minMB,
      max: maxMB,
    }: MinMaxFilter = await this.service.get(1) // 1 isn't used but required by service iface
    return {
      min: Math.floor(minMB / UNIT_PREFIX_POW2.KILO),
      max: Math.ceil(maxMB / UNIT_PREFIX_POW2.KILO),
    }
  }
}
