import { APIService } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { rnsSupportedTokens, addressTokenRecord, allTokenAddresses } from 'contracts/config'
import {
  RnsDomain,
  RnsDomainOffer,
  RnsSoldDomain,
} from 'models/marketItems/DomainItem'
import { Modify } from 'utils/typeUtils'
import { getTokenByString } from 'utils/tokenUtils'
import { BaseToken } from 'models/Token'
import { domainsAddress, DomainsAddress } from './domains'
import { offersAddress, OffersAddress } from './offers'
import { soldDomainsAddress, SoldDomainsAddress } from './sold'

export type RnsServiceAddress =
  | OffersAddress
  | DomainsAddress
  | SoldDomainsAddress
export type RnsChannels = 'domains' | 'sold' | 'offers'

export const rnsAddresses = [
  domainsAddress,
  offersAddress,
  soldDomainsAddress,
]

export type RnsAPIService = Modify<
APIService,
{
  path: RnsServiceAddress
  _channel: RnsChannels
  fetch: (
    filters: RnsFilter
  ) => Promise<RnsDomain[] | RnsDomainOffer[] | RnsSoldDomain[]>
}
>

export const isSupportedRNSToken = (
  token: string,
): boolean => rnsSupportedTokens.some((t: string) => t === token)

//  - Supported Token Address-to-token records
export const rnsTokenAddrTokenRecord: Record<string, BaseToken> = allTokenAddresses
  .reduce((acc, addr) => {
    const symbol = addressTokenRecord[addr]

    if (!isSupportedRNSToken(symbol)) return acc
    acc[addr] = getTokenByString(symbol)
    return acc
  }, {})
