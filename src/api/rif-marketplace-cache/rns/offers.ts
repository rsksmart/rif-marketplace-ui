import { AbstractAPIController } from 'api/models/apiController';
import { DomainOffer } from 'models/marketItems/DomainItem';
import { available_tokens, RnsAddresses, RnsAPIController } from './common';
import { OfferTransport } from 'api/models/transports';
import { RnsFilter } from 'api/models/RnsFilter';

export const offersAddress: RnsAddresses = 'rns/v0/offers'

const mapFromTransport = (item: OfferTransport): DomainOffer => ({
    price: parseInt(item.price, 10) / 10 ** 18,
    expirationDate: new Date(item.domain.expiration.date),
    id: item.offerId,
    domainName: item.domain.name,
    paymentToken: available_tokens[item.paymentToken.toLowerCase()],
    tokenId: item.tokenId,
    ownerAddress: item.ownerAddress,
})

export class OffersController extends AbstractAPIController implements RnsAPIController {
    path = offersAddress

    fetch = async (filters: RnsFilter): Promise<DomainOffer[]> => {
        if (!this.service) throw Error('The confirmations service is not connected')
        const { price, name } = filters

        const results = await this.service.find({
            domain: {
                name
            },
            price: {
                $gte: price.min * 10 ** 18,
                $lte: price.max * 10 ** 18,
            },
        })

        return results.map(mapFromTransport)
    }
}