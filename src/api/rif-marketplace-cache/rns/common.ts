import { APIController } from 'api/models/apiController';
import { RnsFilter } from 'api/models/RnsFilter';
import network from 'blockchain/config';
import { RnsDomain, RnsDomainOffer, RnsSoldDomain } from 'models/marketItems/DomainItem';
import { Modify } from 'utils/typeUtils';

export type RnsAddresses = 'rns/v0/offers' | 'rns/v0/domains' | 'rns/v0/sold'

export type RnsAPIController = Modify<APIController, {
  path: RnsAddresses
  fetch: (filters: RnsFilter) => Promise<RnsDomain[] | RnsDomainOffer[] | RnsSoldDomain[]>
}>


export const available_tokens = Object.keys(network).reduce((acc, tokenSymbol) => {
  const value = network[tokenSymbol].toLowerCase()
  acc[value] = tokenSymbol
  return acc
}, {})