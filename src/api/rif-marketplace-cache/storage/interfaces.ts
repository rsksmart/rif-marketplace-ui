import { Modify } from 'utils/typeUtils'
import { APIService } from 'api/models/apiService'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem } from 'models/marketItems/StorageItem'

export type StorageServiceAddress = 'storage/v0/offers' // | 'storage/v0/agreements'
export type StorageWSChannel = 'offers' | 'agreements'

export type StorageAPIService = Modify<
    APIService,
    {
        path: StorageServiceAddress
        _channel: StorageWSChannel
        fetch: (
            filters: Partial<StorageOffersFilters>
        ) => Promise<StorageItem[]>
    }
>
