import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated, MapFromTransport } from 'api/models/apiService'
import client from 'api/rif-marketplace-cache/client'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { NotifierAPIService } from '../interfaces'
import TransportModel from './models'

export const address = 'notifier/v0/offers' as const
export type Address = typeof address

export const wsChannel = 'offers' as const
export type WSChannel = typeof wsChannel

class OffersService extends AbstractAPIService
  implements NotifierAPIService {
    path = address

    private mapFromTransport: MapFromTransport<TransportModel, NotifierOfferItem> = (transport) => transport.toLocal()

    constructor() {
      super(client)
    }

    _channel = wsChannel

    _fetch = async (): Promise<NotifierOfferItem[]> => {
      const result: Paginated<TransportModel> = await this.service.find()

      const { data, ...metadata } = isResultPaginated(result)
        ? result : { data: result }
      this.meta = metadata

      return data.map(this.mapFromTransport)
    }
}

export default OffersService
