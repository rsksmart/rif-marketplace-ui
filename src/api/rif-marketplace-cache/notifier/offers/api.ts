import Big from 'big.js'
import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import client from 'api/rif-marketplace-cache/client'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { SupportedTokenSymbol } from 'models/Token'
import { getSupportedTokenByName } from 'utils/tokenUtils'
import { NotifierAPIService } from '../interfaces'
import { TransportModel } from './models'

export const address = 'triggers/v0/providers' as const
export type Address = typeof address

export const wsChannel = 'offers' as const
export type WSChannel = typeof wsChannel

export const mapFromTransport = ({
  provider, plans,
}: TransportModel): NotifierOfferItem => ({
  id: provider,
  plans: plans.map((plan) => {
    const dateNow = new Date()
    const expirationDate = new Date()
    expirationDate.setDate(dateNow.getDate() + plan.daysLeft)

    return ({
      id: plan.name,
      channels: plan.channels.map((channel) => channel.name),
      limit: plan.quantity,
      priceOptions: plan.prices.map((price) => ({
        token: getSupportedTokenByName(
              price.rateId as SupportedTokenSymbol,
        ),
        value: new Big(price.price),
      })),
      expirationDate,
    })
  }),
})

class OffersService extends AbstractAPIService
  implements NotifierAPIService {
    path = address

    constructor() {
      super(client)
    }

    _channel = wsChannel

    _fetch = async (): Promise<NotifierOfferItem[]> => {
      const result: Paginated<TransportModel> = await this.service.find()

      const { data, ...metadata } = isResultPaginated(result)
        ? result : { data: result }
      this.meta = metadata

      return data.map(mapFromTransport)
    }
}

export default OffersService
