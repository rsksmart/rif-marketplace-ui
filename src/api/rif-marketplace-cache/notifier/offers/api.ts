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
import { SupportedEventChannel } from 'config/notifier'
import { NotifierCacheAPIService } from '../interfaces'
import NotifierFiltersTransport, { PlanDTO } from './models'

export const address = 'notifier/v0/offers' as const
export type Address = typeof address

export const wsChannel = 'notifier_offers' as const
export type WSChannel = typeof wsChannel

export const mapFromTransport = ({
  providerId: provider,
  channels,
  daysLeft,
  id,
  planId,
  planStatus,
  name,
  prices,
  quantity,
  url,
}: PlanDTO): NotifierOfferItem => ({
  id: String(id),
  planId,
  planStatus,
  name,
  provider: provider.toLocaleLowerCase(),
  url,
  channels: channels.map((channel) => channel.name as SupportedEventChannel),
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
  implements NotifierCacheAPIService {
  path = address

  constructor() {
    super(client)
  }

  _channel = wsChannel

  _fetch = async (
    filters: NotifierOffersFilters,
  ): Promise<NotifierOfferItem[]> => {
    const query = filters && new NotifierFiltersTransport(filters)
    const result: Paginated<PlanDTO> = await this.service.find({ query })

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
