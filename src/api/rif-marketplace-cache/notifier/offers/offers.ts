import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import client from 'api/rif-marketplace-cache/client'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { NotifierAPIService } from '../interfaces'
import { TransportModel } from './models'

export const address = 'notifier/v0/offers' as const
export type Address = typeof address

export const wsChannel = 'offers' as const
export type WSChannel = typeof wsChannel

export const mapFromTransport = (offer: TransportModel): NotifierOfferItem => (offer as NotifierOfferItem)

class OffersService extends AbstractAPIService
  implements NotifierAPIService {
    path = address

    private mapFromTransport: (offer: TransportModel) => NotifierOfferItem

    constructor() {
      super(client)
      this.mapFromTransport = mapFromTransport
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
