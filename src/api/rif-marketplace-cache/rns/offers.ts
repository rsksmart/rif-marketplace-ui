import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { OfferTransport } from 'api/models/transports'
import { MinMaxFilter } from 'models/Filters'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import { convertToBigString, parseToBigDecimal, parseToInt } from 'utils/parsers'
import client from '../client'
import {
  availableTokens,
  RnsAPIService, RnsChannels, RnsServiceAddress,
} from './common'

export const offersAddress: RnsServiceAddress = 'rns/v0/offers'
export const offersChannel: RnsChannels = 'offers'

const mapFromTransport = ({
  priceString,
  domain: {
    expirationDate,
    name: domainName,
  },
  offerId,
  paymentToken,
  tokenId,
  ownerAddress,
}: OfferTransport): RnsDomainOffer => ({
  id: offerId,
  ownerAddress,
  domainName,
  price: parseToBigDecimal(priceString, 18),
  expirationDate: new Date(expirationDate),
  paymentToken: availableTokens[paymentToken.toLowerCase()],
  tokenId,
})

enum LimitType {
  min = 1,
  max = -1,
}

const fetchPriceLimit = async (
  service,
  limitType: LimitType,
): Promise<number> => {
  const query = {
    $limit: 1,
    $sort: {
      price: limitType,
    },
    $select: ['priceString'],
  }
  const results: Paginated<OfferTransport> = await service.find({ query })

  const data: OfferTransport[] = isResultPaginated(results)
    ? results.data : results

  // Gets the result parses it to the correct decimal and rounds it: up for max, down for min
  return data.reduce(
    (_, item: { priceString: string }): number => {
      const round = limitType === LimitType.min ? Math.floor : Math.ceil
      return round(parseToInt(item.priceString, 18))
    },
    0,
  )
}

export class OffersService extends AbstractAPIService implements RnsAPIService {
  path = offersAddress

  constructor() { super(client) }

  _channel = offersChannel

  _fetch = async (filters: Partial<RnsFilter> & { skip?: number}): Promise<RnsDomainOffer[]> => {
    const { price, name, skip } = filters

    const results: Paginated<OfferTransport> = await this.service.find({
      query: {
        domain: name ? {
          name: {
            $like: name,
          },
        } : undefined,
        price: price ? {
          $gte: convertToBigString(price.min, 18),
          $lte: convertToBigString(price.max, 18),
        } : undefined,
        $skip: skip,
      },
    })

    const { data, ...metadata } = isResultPaginated(results)
      ? results : { data: results }
    this.meta = metadata

    const filteredData = data
    const mappedData = filteredData.map(mapFromTransport)

    return mappedData
  }

  fetchPriceLimits = async (): Promise<MinMaxFilter> => {
    const min = await fetchPriceLimit(this.service, LimitType.min)
    const max = await fetchPriceLimit(this.service, LimitType.max)
    return { min, max }
  }
}
