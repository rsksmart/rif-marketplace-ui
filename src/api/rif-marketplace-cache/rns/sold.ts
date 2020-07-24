import { AbstractAPIService } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { SoldDomainTransport } from 'api/models/transports'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import { parseToBigDecimal } from 'utils/parsers'
import { getAvailableTokens, RnsAddresses, RnsAPIService, RnsChannels } from './common'

export const soldDomainsAddress: RnsAddresses = 'rns/v0/sold'
export const soldDomainsChannel: RnsChannels = 'sold'

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
  _channel = soldDomainsChannel

  _fetch = async (filters: Partial<RnsFilter>): Promise<RnsSoldDomain[]> => {
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
    }) as unknown as SoldDomainTransport[]

    return results.map(mapFromTransport)
  }
}
