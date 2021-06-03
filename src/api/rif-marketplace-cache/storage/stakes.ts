import { AbstractAPIService } from 'api/models/apiService'
import {
  StakeAPIService,
  StorageWSChannel,
} from './interfaces'
import client from '../client'
import { mapFromTransport, Staked, StakeFilters } from '../common/stakes'

export const stakesAddress = 'storage/v0/stakes' as const
export type StakesAddress = typeof stakesAddress
export const stakesWSChannel: StorageWSChannel = 'stakes'

export class StakesService extends AbstractAPIService
  implements StakeAPIService {
  path = stakesAddress

  constructor() { super(client) }

  _channel = stakesWSChannel

  _fetch = async (filters: StakeFilters): Promise<Staked> => {
    const { account } = filters
    const result = await this.service.get(account)
    return mapFromTransport(result)
  }
}
