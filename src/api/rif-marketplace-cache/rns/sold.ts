import { AbstractAPIService } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { SoldDomainTransport } from 'api/models/transports'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import { parseToBigDecimal } from 'utils/parsers'
import { getAvailableTokens, RnsAddresses, RnsAPIService } from './common'

export const soldDomainsAddress: RnsAddresses = 'rns/v0/sold'

const mapFromTransport = ({
  id,
  paymentToken,
  priceString,
  soldDate,
  domain: {
    name: domainName,
  },
  transfer: {
    buyerAddress: buyer,
  },
  tokenId,
}: SoldDomainTransport): RnsSoldDomain => ({
  id,
  buyer,
  tokenId,
  domainName,
  paymentToken: getAvailableTokens[paymentToken.toLowerCase()],
  price: parseToBigDecimal(priceString, 18),
  soldDate: new Date(soldDate),
})

export class SoldDomainsService extends AbstractAPIService implements RnsAPIService {
  path = soldDomainsAddress

  fetch = async (filters: Partial<RnsFilter>): Promise<RnsSoldDomain[]> => {
    if (!this.service) throw Error('The rns sold domains service is not connected')
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
