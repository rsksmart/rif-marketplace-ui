import { AbstractAPIService } from 'api/models/apiService'
import client from 'api/rif-marketplace-cache/client'
import { StakeFilters } from 'api/rif-marketplace-cache/storage/interfaces' // TODO: move to more generic location
import {
  mapFromTransport, Staked,
} from 'api/rif-marketplace-cache/storage/stakes' // TODO: move to more generic location
import { NotifierCacheAPIService } from '../interfaces'

export const address = 'notifier/v0/stakes' as const
export type Address = typeof address

export const wsChannel = 'notifier_stakes' as const
export type WSChannel = typeof wsChannel

class StakesService extends AbstractAPIService
  implements NotifierCacheAPIService {
  path = address

  constructor() {
    super(client)
  }

  _channel = wsChannel

  _fetch = async (filters: StakeFilters): Promise<Staked> => {
    const { account } = filters
    const result = await this.service.get(account)
    return mapFromTransport(result)
  }
}

export default StakesService
