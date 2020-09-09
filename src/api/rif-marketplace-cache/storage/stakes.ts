import { AbstractAPIService } from 'api/models/apiService'
import { StakeAPIService, StorageServiceAddress, StorageWSChannel } from './interfaces'

export const stakesAddress: StorageServiceAddress = 'storage/v0/stakes'
export const offersWSChannel: StorageWSChannel = 'stakes'

export class StakesService
    extends AbstractAPIService implements StakeAPIService {
    path = stakesAddress

    _channel = offersWSChannel

    _fetch = (filters: { account: string, token: string }): Promise<any[]> => {
        const { account, token } = filters
        return this.service.find({
            query: { account, token },
        })
    }
}
