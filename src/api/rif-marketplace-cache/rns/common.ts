import { APIController } from 'api/models/apiController';
import { RnsFilter } from 'api/models/RnsFilter';
import { DomainTransport, SoldDomainTransport } from 'api/models/transports';
import network from 'blockchain/config';
import { Domain, DomainOffer, SoldDomain } from 'models/marketItems/DomainItem';
import { Modify } from 'utils/typeUtils';
import { fetchMarketData } from '../cacheController';

export type RnsAddresses = 'rns/v0/offers' | 'rns/v0/domains' | 'rns/v0/sold'

export type RnsAPIController = Modify<APIController, {
  path: RnsAddresses
  fetch: (filters: RnsFilter) => Promise<Domain[] | DomainOffer[] | SoldDomain[]>
}>


export const available_tokens = Object.keys(network).reduce((acc, tokenSymbol) => {
  const value = network[tokenSymbol].toLowerCase()
  acc[value] = tokenSymbol
  return acc
}, {})



const minMaxPriceTransportMapper = (_, item: { price: string }): number => parseInt(item.price, 10) / 10 ** 18

const mappings = {
  minMaxPrice: minMaxPriceTransportMapper,
}


// export const fetchDomainOffers = async (filters: DomainOffersFilter) => {
//   const { price } = filters
//   const cacheFilters = {
//     ...filters,
//     price: {
//       $gte: price.$gte * 10 ** 18,
//       $lte: price.$lte * 10 ** 18,
//     },
//   }
//   const results = await fetchMarketData(cacheFilters)
//   return results.map(mappings.offers)
// }

// export const fetchDomains = async (filters?) => {
//   const { status, ...restFilters } = filters
//   const filtersCopy = {
//     ...restFilters,
//     placed: status === 'placed',
//   }
//   const results = await fetchMarketData(filtersCopy)
//   return results.map(mappings.domains)
// }

// export const fetchSoldDomains = async (filters?) => {
//   const { name, status: _, ...rest } = filters
//   const filtersCopy = {
//     ...rest,
//   }

//   if (name) { filtersCopy.domain = { name } }
//   const results = await fetchMarketData(filtersCopy)
//   return results.map(mappings.sold)
// }

// const fetchMinPrice = async () => {
//   const query = {
//     $limit: 1,
//     $sort: {
//       price: 1,
//     },
//     $select: ['price'],
//   }
//   const results = await fetchMarketData(query as any)

//   return results.reduce(mappings.minMaxPrice, 0)
// }

// const fetchMaxPrice = async () => {
//   const query = {
//     $limit: 1,
//     $sort: {
//       price: -1,
//     },
//     $select: ['price'],
//   }
//   const results = await fetchMarketData(query as any)

//   return results.reduce(mappings.minMaxPrice, 0)
// }

// export const fetchMinMaxPrice = async () => {
//   const minPrice = await fetchMinPrice()
//   const maxPrice = await fetchMaxPrice()
//   return { minPrice, maxPrice }
// }