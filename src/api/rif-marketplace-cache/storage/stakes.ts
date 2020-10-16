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

  _fetch = (filters: StakeFilters): Promise<any[]> => {
    const { account, token } = filters
    return this.service.find({
      query: {
        account,
        token,
      },
    })
  }
}
