import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { DomainTransport } from 'api/models/transports'
import { RnsDomain } from 'models/marketItems/DomainItem'
import { parseToBigDecimal } from 'utils/parsers'
import { getTokenByAddress } from 'utils/tokenUtils'
import client from '../client'
import {
  RnsAPIService, RnsChannels,
} from './common'

export const domainsAddress = 'rns/v0/domains' as const
export type DomainsAddress = typeof domainsAddress
export const domainsChannel: RnsChannels = 'domains'

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
      paymentToken: getTokenByAddress(offer.paymentToken),
      price: parseToBigDecimal(offer.priceString, 18),
    }
  }
  return domain
}

export class DomainsService
  extends AbstractAPIService
  implements RnsAPIService {
  path = domainsAddress

  constructor() { super(client) }

  _channel = domainsChannel

  _fetch = async (filters: Partial<RnsFilter>): Promise<RnsDomain[]> => {
    const { name, status, ownerAddress } = filters

    const results: Paginated<DomainTransport> = await this
      .service.find({
        query: {
          placed: status === 'placed',
          name: name ? {
            $like: name,
          } : undefined,
          ownerAddress,
        },
      })
    const { data, ...metadata } = isResultPaginated(results)
      ? results : { data: results }
    this.meta = metadata

    return data.map(mapFromTransport)
  }
}
