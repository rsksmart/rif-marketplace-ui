import { AbstractAPIController } from 'api/models/apiController';
import { RnsFilter } from 'api/models/RnsFilter';
import { DomainTransport } from 'api/models/transports';
import { Domain } from 'models/marketItems/DomainItem';
import { available_tokens, RnsAddresses, RnsAPIController } from './common';

export const domainsAddress: RnsAddresses = 'rns/v0/domains'

const mapFromTransport = (item: DomainTransport): Domain => {
    const {
        tokenId, expiration, owner, name, offers,
    } = item
    const domain: Domain = {
        id: tokenId,
        expirationDate: new Date(expiration.date),
        ownerAddress: owner.address,
        name,
        tokenId,
    }

    if (offers?.length) {
        const offer = offers[0]
        domain.offer = {
            ...offer,
            paymentToken: available_tokens[offer.paymentToken.toLowerCase()],
            price: parseInt(offer.price, 10) / 10 ** 18,
        }
    }
    return domain
}

export class DomainsController extends AbstractAPIController implements RnsAPIController {
    path = domainsAddress

    fetch = async (filters: RnsFilter): Promise<Domain[]> => {
        if (!this.service) throw Error('The confirmations service is not connected')
        const { name, status, ownerAddress } = filters

        const results = await this.service.find({
            query: {
                placed: status === 'placed',
                name: name ? {
                    $like: name
                } : undefined,
                ownerAddress
            }
        })

        return results.map(mapFromTransport)
    }
}