import { Modify } from "utils/typeUtils"
import { APIService } from "api/models/apiService"



export type StorageServiceAddress = '/storage/v0/offers' | '/storage/v0/agreements'
export type StorageWSChannel = 'offers' | 'agreements'

export type StorageAPIService = Modify<
    APIService,
    {
        path: StorageServiceAddress
        _channel: StorageWSChannel
        fetch: () => Promise<[]> // FIXME: add return types
    }
>