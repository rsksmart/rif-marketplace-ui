import { AbstractAPIService } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { DomainTransport } from 'api/models/transports'
import { RnsDomain } from 'models/marketItems/DomainItem'
import { parseToBigDecimal } from 'utils/parsers'
import { getAvailableTokens, RnsAddresses, RnsAPIService } from './common'

export const domainsAddress: RnsAddresses = 'rns/v0/domains'

const mapFromTransport = (item: DomainTransport): RnsDomain => {
  const {
    tokenId, expiration, owner, name, offers,
  } = item
  const domain: RnsDomain = {
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
      paymentToken: getAvailableTokens[offer.paymentToken.toLowerCase()],
      price: parseToBigDecimal(offer.priceString, 18),
    }
  }
  return domain
}

export class DomainsService extends AbstractAPIService implements RnsAPIService {
  path = domainsAddress

  _fetch = async (filters: Partial<RnsFilter>): Promise<RnsDomain[]> => {
    const { name, status, ownerAddress } = filters

    const results = await this.service.find({
      query: {
        placed: status === 'placed',
        name: name ? {
          $like: name,
        } : undefined,
        ownerAddress,
      },
    }) as unknown as DomainTransport[]

    return results.map(mapFromTransport)
  }
}
