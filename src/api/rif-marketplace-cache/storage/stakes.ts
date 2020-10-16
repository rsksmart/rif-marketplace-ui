import { AbstractAPIService } from 'api/models/apiService'
import {
  StakeAPIService,
  StakeFilters,
  StorageServiceAddress,
  StorageWSChannel,
} from './interfaces'

export const stakesAddress: StorageServiceAddress = 'storage/v0/stakes'
export const stakesWSChannel: StorageWSChannel = 'stakes'

export class StakesService extends AbstractAPIService
  implements StakeAPIService {
  path = stakesAddress

  _channel = stakesWSChannel

  // TODO: return proper type
  _fetch = (filters: StakeFilters): Promise<any[]> => {
    const { account } = filters

    // TODO: map from transport converting wei units
    return this.service.get(account)
  }
}
