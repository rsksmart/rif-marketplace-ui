import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { SoldDomainTransport } from 'api/models/transports'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import { parseToBigDecimal } from 'utils/parsers'
import { getTokenByAddress } from 'utils/tokenUtils'
import client from '../client'
import {
  RnsAPIService, RnsChannels,
} from './common'

export const soldDomainsAddress = 'rns/v0/sold' as const
export type SoldDomainsAddress = typeof soldDomainsAddress
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
  paymentToken: getTokenByAddress(paymentToken),
  price: parseToBigDecimal(priceString, 18),
  soldDate: new Date(soldDate),
})

export class SoldDomainsService
  extends AbstractAPIService
  implements RnsAPIService {
  path = soldDomainsAddress

  constructor() { super(client) }

  _channel = soldDomainsChannel

  _fetch = async (filters: Partial<RnsFilter>): Promise<RnsSoldDomain[]> => {
    const { name, ownerAddress } = filters

    const results: Paginated<SoldDomainTransport> = await this.service.find({
      query: {
        domain: name ? {
          name: {
            $like: name,
          },
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
