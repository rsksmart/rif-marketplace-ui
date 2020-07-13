import { AbstractAPIService } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { SoldDomainTransport } from 'api/models/transports'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import { getAvailableTokens, RnsAddresses, RnsAPIService } from './common'

export const soldDomainsAddress: RnsAddresses = 'rns/v0/sold'

const mapFromTransport = (item: SoldDomainTransport): RnsSoldDomain => ({
  id: item.id,
  paymentToken: getAvailableTokens[item.paymentToken.toLowerCase()],
  price: parseInt(item.price, 10) / 10 ** 18,
  soldDate: new Date(item.soldDate),
  domainName: item.domain.name,
  buyer: item.transfer.buyerAddress,
  tokenId: item.tokenId,
})

export class SoldDomainsService extends AbstractAPIService implements RnsAPIService {
  path = soldDomainsAddress

  protected _fetch = async (filters: Partial<RnsFilter>): Promise<RnsSoldDomain[]> => {
    const { name, ownerAddress } = filters

    const results = await this.service.find({
      query: {
        domain: name ? {
          name: {
            $like: name,
          },
        } : undefined,
        ownerAddress,
      },
    })

    return results.map(mapFromTransport)
  }
}
