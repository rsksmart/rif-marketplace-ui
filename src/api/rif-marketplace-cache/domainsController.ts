import { DomainOffersFilter } from 'api/models/RnsFilter'
import { Domain, DomainOffer, SoldDomain } from 'models/marketItems/DomainItem'
import networkConfig from 'ui-config.json'
import { fetchMarketData } from './cacheController'

export enum RnsServicePaths {
  BUY = 'rns/v0/offers',
  SELL = 'rns/v0/domains',
  SOLD = 'rns/v0/sold'
}

const networkName = process.env.REACT_APP_NETWORK || 'ganache'
const network = networkConfig[networkName]
const tokens = Object.keys(network).reduce((acc, tokenSymbol) => {
  const value = network[tokenSymbol].toLowerCase()
  acc[value] = tokenSymbol
  return acc
}, {})

export interface OfferTransportItem {
  creationDate?: string
  offerId: string
  paymentToken: string
  price: string
  ownerAddress: string
  ownerDomain: string
  tokenId: string
  domain: DomainTransportItem
}

export interface DomainTransportItem {
  expiration: {
    date: string
  }
  owner: {
    address: string
  }
  name: string
  tokenId: string
  offers?: Omit<OfferTransportItem, 'domain'>[]
}

export interface SoldDomainTransportItem {
  id: string
  tokenId: string
  paymentToken: string
  price: string
  soldDate: string
  domain: DomainTransportItem
  transfer: {
    sellerAddress: string
    buyerAddress: string
  }
}

const offersTransportMapper = (item: OfferTransportItem): DomainOffer => ({
  price: parseInt(item.price, 10) / 10 ** 18,
  expirationDate: new Date(item.domain.expiration.date),
  id: item.offerId,
  domainName: item.domain.name,
  paymentToken: tokens[item.paymentToken.toLowerCase()],
  tokenId: item.tokenId,
  ownerAddress: item.ownerAddress,
})

const domainsTransportMapper = (item: DomainTransportItem): Domain => {
  const {
    tokenId, expiration, owner, name, offers,
  } = item
  const domain: Domain = {
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
      paymentToken: tokens[offer.paymentToken.toLowerCase()],
      price: parseInt(offer.price, 10) / 10 ** 18,
    }
  }
  return domain
}

const soldTransportMapper = (item: SoldDomainTransportItem): SoldDomain => ({
  id: item.id,
  paymentToken: tokens[item.paymentToken.toLowerCase()],
  price: parseInt(item.price, 10) / 10 ** 18,
  soldDate: new Date(item.soldDate),
  domainName: item.domain.name,
  buyer: item.transfer.buyerAddress,
  tokenId: item.tokenId,
})

const minMaxPriceTransportMapper = (_, item: { price: string }): number => parseInt(item.price, 10) / 10 ** 18

const mappings = {
  offers: offersTransportMapper,
  domains: domainsTransportMapper,
  minMaxPrice: minMaxPriceTransportMapper,
  sold: soldTransportMapper,
}

export const fetchDomainOffers = async (filters: DomainOffersFilter) => {
  const { price } = filters
  const cacheFilters = {
    ...filters,
    price: {
      $gte: price.$gte * 10 ** 18,
      $lte: price.$lte * 10 ** 18,
    },
  }
  const results = await fetchMarketData(cacheFilters)
  return results.map(mappings.offers)
}

export const fetchDomains = async (filters?) => {
  const { status, ...restFilters } = filters
  const filtersCopy = {
    ...restFilters,
    placed: status === 'placed',
  }
  const results = await fetchMarketData(filtersCopy)
  return results.map(mappings.domains)
}

export const fetchSoldDomains = async (filters?) => {
  const { name, status: _, ...rest } = filters
  const filtersCopy = {
    ...rest,
  }

  if (name) { filtersCopy.domain = { name } }
  const results = await fetchMarketData(filtersCopy)
  return results.map(mappings.sold)
}

const fetchMinPrice = async () => {
  const query = {
    $limit: 1,
    $sort: {
      price: 1,
    },
    $select: ['price'],
  }
  const results = await fetchMarketData(query)

  return results.reduce(mappings.minMaxPrice, 0)
}

const fetchMaxPrice = async () => {
  const query = {
    $limit: 1,
    $sort: {
      price: -1,
    },
    $select: ['price'],
  }
  const results = await fetchMarketData(query)

  return results.reduce(mappings.minMaxPrice, 0)
}

export const fetchMinMaxPrice = async () => {
  const minPrice = await fetchMinPrice()
  const maxPrice = await fetchMaxPrice()
  return { minPrice, maxPrice }
}
