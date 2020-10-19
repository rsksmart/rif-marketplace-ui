import { APIService } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import network from 'blockchain/config'
import {
  RnsDomain,
  RnsDomainOffer,
  RnsSoldDomain,
} from 'models/marketItems/DomainItem'
import { Modify } from 'utils/typeUtils'
import { SUPPORTED_TOKENS } from '../rates/xr'

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

export const isSupportedToken = (
  token: string,
): boolean => (SUPPORTED_TOKENS as readonly string[])
  .includes(token)

const { contractAddresses } = network
export const availableTokens = Object.keys(contractAddresses).reduce((acc, symbol) => {
  if (!isSupportedToken(symbol)) return acc
  const value = contractAddresses[symbol]
  acc[value] = symbol
  return acc
}, {})
