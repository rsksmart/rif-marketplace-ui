import { APIService } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { rnsSupportedTokens, addressTokenRecord, allNftAddresses } from 'contracts/config'
import {
  RnsDomain,
  RnsDomainOffer,
  RnsSoldDomain,
} from 'models/marketItems/DomainItem'
import { Modify } from 'utils/typeUtils'

export type RnsServiceAddress = 'rns/v0/offers' | 'rns/v0/domains' | 'rns/v0/sold'
export type RnsChannels = 'domains' | 'sold' | 'offers'

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
export const rnsNftAddrTokenRecord: Record<string, string> = allNftAddresses
  .reduce((acc, addr) => {
    const symbol = addressTokenRecord[addr]

    if (!isSupportedRNSToken(symbol)) return acc
    acc[addr] = symbol
    return acc
  }, {})
