import { AbstractAPIService } from 'api/models/apiService'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import { OfferTransport } from 'api/models/transports'
import { RnsFilter, PriceFilter } from 'api/models/RnsFilter'
import { parseToBigDecimal, convertToBigString, parseToInt } from 'utils/parsers'
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
  const results = await service.find({ query })

  // Gets the result parses it io the correct decimal and ensures that the limits are always 1bigger/smaller than the actual largest/smallest price
  return results.reduce(
    (_, item: { priceString: string }): number => Math.round(parseToInt(item.priceString, 18)) - limitType,
    0,
  )
}

export class OffersService extends AbstractAPIService implements RnsAPIService {
  path = offersAddress

  _channel = offersChannel

  _fetch = async (filters: Partial<RnsFilter>): Promise<RnsDomainOffer[]> => {
    const { price, name } = filters

    const results = await this.service.find({
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
    }) as unknown as OfferTransport[]

    return results.map(mapFromTransport)
  }

  fetchPriceLimits = async (): Promise<PriceFilter> => {
    const min = await fetchPriceLimit(this.service, LimitType.min)
    const max = await fetchPriceLimit(this.service, LimitType.max)
    return { min, max }
  }
}
