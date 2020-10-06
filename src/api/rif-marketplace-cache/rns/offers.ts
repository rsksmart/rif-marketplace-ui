import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import { PriceFilter, RnsFilter } from 'api/models/RnsFilter'
import { OfferTransport } from 'api/models/transports'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import { convertToBigString, parseToBigDecimal, parseToInt } from 'utils/parsers'
import { isSupportedToken } from '../rates/xr'
import {
  getAvailableTokens, RnsAddresses, RnsAPIService, RnsChannels,
} from './common'

export const offersAddress: RnsAddresses = 'rns/v0/offers'
export const offersChannel: RnsChannels = 'offers'

const mapFromTransport = ({
  priceString,
  domain: {
    expiration: { date },
    name: domainName,
  },
  id,
  paymentToken,
  tokenId,
  ownerAddress,
}: OfferTransport): RnsDomainOffer => ({
  id,
  ownerAddress,
  domainName,
  price: parseToBigDecimal(priceString, 18),
  expirationDate: new Date(date),
  paymentToken: getAvailableTokens[paymentToken.toLowerCase()],
  tokenId,
})

enum LimitType {
  min = 1,
  max = -1
}

const fetchPriceLimit = async (service, limitType: LimitType): Promise<number> => {
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

  _channel = offersChannel

  _fetch = async (filters: Partial<RnsFilter>): Promise<RnsDomainOffer[]> => {
    const { price, name } = filters

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
      },
    })
    const { data, ...metadata } = isResultPaginated(results)
      ? results : { data: results }
    this.meta = metadata

    return data
      .map(mapFromTransport)
      .filter(({ paymentToken }) => isSupportedToken(paymentToken))
  }

  fetchPriceLimits = async (): Promise<PriceFilter> => {
    const min = await fetchPriceLimit(this.service, LimitType.min)
    const max = await fetchPriceLimit(this.service, LimitType.max)
    return { min, max }
  }
}
