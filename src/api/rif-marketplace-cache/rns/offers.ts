import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import { RnsFilter, RnsSort } from 'api/models/RnsFilter'
import { OfferTransport } from 'api/models/transports'
import { SupportedFiatSymbol } from 'models/Fiat'
import { MinMaxFilter } from 'models/Filters'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import { parseToBigDecimal } from 'utils/parsers'
import { getTokenByAddress } from 'utils/tokenUtils'
import client from '../client'
import {
  RnsAPIService, RnsChannels,
} from './common'

export const offersAddress = 'rns/v0/offers' as const
export type OffersAddress = typeof offersAddress
export const offersChannel: RnsChannels = 'offers'

const mapFromTransport = ({
  priceFiat,
  priceString,
  domain: {
    expiration: { date },
    name: domainName,
  },
  offerId,
  paymentToken,
  tokenId,
  ownerAddress,
}: OfferTransport): RnsDomainOffer => ({
  priceFiat: Number(priceFiat),
  id: offerId,
  ownerAddress,
  domainName,
  price: parseToBigDecimal(priceString, 18),
  expirationDate: new Date(date),
  paymentToken: getTokenByAddress(paymentToken),
  tokenId,
})

enum LimitType {
  min = 1,
  max = -1,
}
const PAGE_LIMIT = 10

const fetchPriceLimit = async (
  service,
  fiatSymbol: SupportedFiatSymbol,
  limitType: LimitType,
): Promise<number> => {
  const query = {
    fiatSymbol,
    $limit: 1,
    $sort: {
      priceFiat: limitType,
    },
  }
  const results: Paginated<OfferTransport> = await service.find({ query })

  const data: OfferTransport[] = isResultPaginated(results)
    ? results.data
    : results

  // Gets the result parses and rounds it: up for max, down for min
  return data.reduce(
    (_, item): number => {
      const round = limitType === LimitType.min ? Math.floor : Math.ceil
      return round(parseFloat(item.priceFiat))
    },
    0,
  )
}

type FetchArgs = Partial<RnsFilter>
& { fiat: SupportedFiatSymbol}
& { skip?: number}
& { sort: RnsSort}

export class OffersService extends AbstractAPIService implements RnsAPIService {
  path = offersAddress

  constructor () { super(client) }

  _channel = offersChannel

  _fetch = async ({
    price, name, skip: $skip, sort,
  }: FetchArgs): Promise<RnsDomainOffer[]> => {
    const results: Paginated<OfferTransport> = await this.service.find({
      query: {
        domain: name
          ? {
              name: {
                $like: name,
              },
            }
          : undefined,
        priceFiat: price
          ? {
              $gte: price.min,
              $lte: price.max,
            }
          : undefined,
        $sort: sort && {
          domain: sort.name
            ? {
                name: sort.name,
              }
            : undefined,
          priceFiat: sort.price,
        },
        $skip,
        $limit: PAGE_LIMIT,
      },
    })

    const { data, ...metadata } = isResultPaginated(results)
      ? results
      : { data: results }
    this.meta = metadata

    const filteredData = data
    const mappedData = filteredData.map(mapFromTransport)

    return mappedData
  }

  fetchPriceLimits = async ({ fiatSymbol }: {
    fiatSymbol: SupportedFiatSymbol
  }): Promise<MinMaxFilter> => {
    const min = await fetchPriceLimit(this.service, fiatSymbol, LimitType.min)
    const max = await fetchPriceLimit(this.service, fiatSymbol, LimitType.max)
    return { min, max }
  }
}
