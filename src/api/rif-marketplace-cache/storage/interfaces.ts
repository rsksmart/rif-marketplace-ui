import { Modify } from 'utils/typeUtils'
import { APIService } from 'api/models/apiService'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem } from 'models/marketItems/StorageItem'

export type StorageServiceAddress =
  | 'storage/v0/offers'
  | 'storage/v0/avgBillingPrice'
  | 'storage/v0/stakes'
  | 'storage/v0/agreements'
export type StorageWSChannel = 'offers' | 'agreements' | 'stakes'

export type StorageAPIService = Modify<
  APIService,
  {
    path: StorageServiceAddress
    _channel: StorageWSChannel
    fetch: (filters: Partial<StorageOffersFilters>) => Promise<StorageItem[]>
  }
>

export type StakeFilters = {
  account: string
}

export type StakeAPIService = Modify<
  APIService,
  {
    path: StorageServiceAddress
    _channel: StorageWSChannel
    fetch: (filters: StakeFilters) => Promise<any[]>
  }
>
