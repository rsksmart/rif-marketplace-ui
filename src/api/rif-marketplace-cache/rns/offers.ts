import { AbstractAPIController } from 'api/models/apiController';
import { RnsDomainOffer } from 'models/marketItems/DomainItem';
import { available_tokens, RnsAddresses, RnsAPIController } from './common';
import { OfferTransport } from 'api/models/transports';
import { RnsFilter, PriceFilter } from 'api/models/RnsFilter';

export const offersAddress: RnsAddresses = 'rns/v0/offers'

const mapFromTransport = (item: OfferTransport): RnsDomainOffer => ({
    price: parseInt(item.price, 10) / 10 ** 18,
    expirationDate: new Date(item.domain.expiration.date),
    id: item.offerId,
    domainName: item.domain.name,
    paymentToken: available_tokens[item.paymentToken.toLowerCase()],
    tokenId: item.tokenId,
    ownerAddress: item.ownerAddress,
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
        $select: ['price'],
    }
    const results = await service.find({ query })
    return results.reduce((_: unknown, item: { price: string }): number => parseInt(item.price, 10) / 10 ** 18, 0)
}

export class OffersController extends AbstractAPIController implements RnsAPIController {
    path = offersAddress

    fetch = async (filters: Partial<RnsFilter>): Promise<RnsDomainOffer[]> => {
        if (!this.service) throw Error('The confirmations service is not connected')
        const { price, name } = filters

        const results = await this.service.find({
            query: {
                domain: name ? {
                    name: {
                        $like: name
                    }
                } : undefined,
                price: price ? {
                    $gte: price.min * 10 ** 18,
                    $lte: price.max * 10 ** 18,
                } : undefined
            }
        })

        return results.map(mapFromTransport)
    }

    fetchPriceLimits = async (): Promise<PriceFilter> => {
        const min = await fetchPriceLimit(this.service, LimitType.min)
        const max = await fetchPriceLimit(this.service, LimitType.max)
        return { min, max }
    }
}