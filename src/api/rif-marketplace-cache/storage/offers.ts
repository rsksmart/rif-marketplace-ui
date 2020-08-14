import { AbstractAPIService } from "api/models/apiService";
import { StorageAPIService, StorageServiceAddress, StorageWSChannel } from "./interfaces";
import { StorageItem } from "models/marketItems/StorageItem";

export const offersAddress: StorageServiceAddress = '/storage/v0/offers'
export const offersWSChannel: StorageWSChannel = 'offers'


export class OffersService extends AbstractAPIService implements StorageAPIService {
    path = offersAddress

    _channel = offersWSChannel

    _fetch = (filters?: any): Promise<StorageItem[]> => {

        return Promise.resolve([])
    }

}