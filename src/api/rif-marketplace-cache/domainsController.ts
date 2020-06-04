import { DomainOffersFilter } from 'api/models/RnsFilter'
import { Domain, DomainOffer, SoldDomain } from 'models/marketItems/DomainItem'
import networkConfig from 'ui-config.json'
import { createService, fetchMarketData } from './cacheController'


export const DOMAINS_SERVICE_PATHS = {
  BUY: () => 'rns/v0/offers',
  SELL: (ownerAddress: string) => `rns/v0/${ownerAddress}/domains`,
  SOLD: (ownerAddress: string) => `rns/v0/${ownerAddress}/sold`,
}

const networkName = process.env.REACT_APP_NETWORK || 'ganache'
const network = networkConfig[networkName]
const tokens = Object.keys(network).reduce((acc, tokenSymbol) => {
  const value = network[tokenSymbol].toLowerCase()
  acc[value] = tokenSymbol
  return acc
}, {})

export interface OfferTransferItem {
  creationDate?: string
  offerId: string
  paymentToken: string
  price: string
  sellerAddress: string
  sellerDomain: string
  tokenId: string
  domain: DomainTransferItem
}

export interface DomainTransferItem {
  expiration: {
    expirationDate: string
  }
  ownerAddress: string
  name: string
  tokenId: string
  offers: Omit<OfferTransferItem, 'domain'>[]
}

export interface SoldDomainTransferItem {
  id: string
  tokenId: string
  sellerAddress: string
  newOwnerAddress: string
  paymentToken: string
  price: string
  soldDate: string
  domain: DomainTransferItem
  transfer: {
    newOwnerAddress: string
  }
}


const offersTransportMapper = (item: OfferTransferItem): DomainOffer => ({
  price: parseInt(item.price, 10) / 10 ** 18,
  expirationDate: new Date(item.domain.expiration.expirationDate),
  id: item.offerId,
  domainName: item.domain.name,
  paymentToken: tokens[item.paymentToken.toLowerCase()],
  tokenId: item.tokenId,
  sellerAddress: item.sellerAddress,
})

const domainsTransportMapper = (item: DomainTransferItem): Domain => {
  const {
    tokenId, expiration, ownerAddress, name, offers,
  } = item
  const domain: Domain = {
    id: tokenId,
    expirationDate: new Date(expiration.expirationDate),
    ownerAddress,
    name,
    tokenId,
  }

  if (offers.length) {
    const offer = offers[0]
    domain.offer = {
      ...offer,
      paymentToken: tokens[offer.paymentToken.toLowerCase()],
      price: parseInt(offer.price, 10) / 10 ** 18,
    }
  }
  return domain
}

const soldTransportMapper = (item: SoldDomainTransferItem): SoldDomain => ({
  id: item.id,
  paymentToken: tokens[item.paymentToken.toLowerCase()],
  price: parseInt(item.price, 10) / 10 ** 18,
  soldDate: new Date(item.soldDate),
  domainName: item.domain.name,
  buyer: item.transfer.newOwnerAddress,
  tokenId: item.tokenId,
})

const minMaxPriceTransportMapper = (_, item: { price: string }): number => parseInt(item.price, 10) / 10 ** 18

const mappings = {
  offers: offersTransportMapper,
  domains: domainsTransportMapper,
  minMaxPrice: minMaxPriceTransportMapper,
  sold: soldTransportMapper,
}

export const createDomainService = (ownerAddress: string) => createService(DOMAINS_SERVICE_PATHS.SELL(ownerAddress))

export const createOffersService = () => createService(DOMAINS_SERVICE_PATHS.BUY())

export const createSoldService = (ownerAddress: string) => createService(DOMAINS_SERVICE_PATHS.SOLD(ownerAddress))

export const fetchDomainOffers = async (filters: DomainOffersFilter) => {
  const { price } = filters
  const cacheFilters = {
    ...filters,
    price: {
      $gte: price.$gte * (10 ** 18),
      $lte: price.$lte * (10 ** 18),
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
  const { name } = filters
  const cacheFilters = {
    domain: !!filters.name && {
      name,
    },
  }
  const results = await fetchMarketData(cacheFilters)
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
