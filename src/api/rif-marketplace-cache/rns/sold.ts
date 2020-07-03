import { AbstractAPIController } from 'api/models/apiController';
import { RnsFilter } from 'api/models/RnsFilter';
import { SoldDomainTransport } from 'api/models/transports';
import { RnsSoldDomain } from 'models/marketItems/DomainItem';
import { available_tokens, RnsAddresses, RnsAPIController } from './common';

export const soldDomainsAddress: RnsAddresses = 'rns/v0/sold'

const mapFromTransport = (item: SoldDomainTransport): RnsSoldDomain => ({
    id: item.id,
    paymentToken: available_tokens[item.paymentToken.toLowerCase()],
    price: parseInt(item.price, 10) / 10 ** 18,
    soldDate: new Date(item.soldDate),
    domainName: item.domain.name,
    buyer: item.transfer.buyerAddress,
    tokenId: item.tokenId,
})

export class SoldDomainsController extends AbstractAPIController implements RnsAPIController {
    path = soldDomainsAddress

    fetch = async (filters: RnsFilter): Promise<RnsSoldDomain[]> => {
        if (!this.service) throw Error('The confirmations service is not connected')
        const { name, ownerAddress } = filters

        const results = await this.service.find({
            query: {
                domain: name ? {
                    name: {
                        $like: name
                    }
                } : undefined,
                ownerAddress
            }
        })

        return results.map(mapFromTransport)
    }
}