import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import client from 'api/rif-marketplace-cache/client'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { SupportedTokenSymbol } from 'models/Token'
import { getSupportedTokenByName } from 'utils/tokenUtils'
import { MinMaxFilter } from 'models/Filters'
import { SupportedFiatSymbol } from 'models/Fiat'
import { NotifierOffersFilters } from 'models/marketItems/NotifierFilters'
import { parseToBigDecimal } from 'utils/parsers'
import { NotifierAPIService } from '../interfaces'
import { PlanDTO } from './models'

export const address = 'triggers/v0/offers' as const
export type Address = typeof address

export const wsChannel = 'triggers_offers' as const
export type WSChannel = typeof wsChannel

export const mapFromTransport = ({
  providerId: provider,
  channels,
  daysLeft,
  id,
  name,
  prices,
  quantity,
}: PlanDTO): NotifierOfferItem => ({
  id: String(id),
  name,
  provider,
  channels: channels.map((channel) => channel.name),
  limit: quantity,
  priceOptions: prices.map((price) => ({
    token: getSupportedTokenByName(
        price.rateId as SupportedTokenSymbol,
    ),
    value: parseToBigDecimal(price.price),
  })),
  daysLeft,
})

class OffersService extends AbstractAPIService
  implements NotifierAPIService {
  path = address

  constructor() {
    super(client)
  }

  _channel = wsChannel

  _fetch = async (
    filters: NotifierOffersFilters,
  ): Promise<NotifierOfferItem[]> => {
    const result: Paginated<PlanDTO> = await this.service.find({
      query: filters && {
        ...filters,
        currency: Array.from(filters.currency),
        channels: Array.from(filters.channels),
      },
    })

    const { data, ...metadata } = isResultPaginated(result)
      ? result : { data: result }
    this.meta = metadata

    return data.map(mapFromTransport)
  }

  findLimits({ fiatSymbol }: {
    fiatSymbol: SupportedFiatSymbol
  }): Promise<MinMaxFilter> {
    return this.service.find({
      query: {
        limits: {
          price: { fiatSymbol },
          size: true,
        },
      },
    })
  }
}

export default OffersService
