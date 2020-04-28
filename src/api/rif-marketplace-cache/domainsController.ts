import { DomainOffersFilter } from "api/models/RnsFilter";
import { Domain, DomainOffer } from "models/marketItems/DomainItem";
import { createService, fetchMarketData } from "./cacheController";
import Web3 from "web3";

export const DOMAINS_SERVICE_PATHS = {
    'BUY': () => 'rns/v0/offers',
    'SELL': (ownerAddress: string) => `rns/v0/${ownerAddress}/domains`,
}

export interface OfferTransferItem {
    creationDate?: string,
    offerId: string,
    paymentToken: string,
    price: string,
    sellerAddress: string,
    sellerDomain: string,
    tokenId: string,
    status: string,
    domain: DomainTransferItem,
}

export interface DomainTransferItem {
    expirationDate: string,
    ownerAddress: string,
    name: string,
    tokenId: string,
}

// TODO: prasarna refactor DomainOffer, Domain dates
const mappings = {
    offers: (item: OfferTransferItem): DomainOffer => ({
        ...item,
        price: parseInt(item.price) / 10 ** 18,
        priceFiat: 0.5,
        expirationDate: parseInt(item.domain.expirationDate),
        _id: item.offerId,
        domainName: item.domain.name,
        paymentToken: 'RIF'
    }),
    domains: (item: DomainTransferItem): Domain => ({
        ...item,
        _id: item.tokenId,
        expirationDate: parseInt(item.expirationDate)
    })
}

export const createDomainService = (ownerAddress: string) => {
    return createService(DOMAINS_SERVICE_PATHS.SELL(ownerAddress));
}

export const createOffersService = () => {
    return createService(DOMAINS_SERVICE_PATHS.BUY());
}

export const fetchDomainOffers = async (filters: DomainOffersFilter) => {
    const filtersCopy = {
        ...filters,
        price: {
            ...filters.price
        },
        // domain: {
        //     name: {
        //     }
        // }
    }
    // TODO: make price non-optional?
    if (filters.price?.$gte)
        filtersCopy.price['$gte'] *= 10 ** 18;
    if (filters.price?.$lte) {
        filtersCopy.price["$lte"] *= 10 ** 18;
    }
    // if (filters.sellerDomain?.$like) {
    //     filtersCopy.domain.name.$like = `%${filters.sellerDomain.$like}%`;
    // }
    const results = await fetchMarketData(filtersCopy);
    return results.map(mappings.offers);
};
export const fetchDomains = async (filters?) => {
    const filtersCopy = { ...filters }
    if (filters.name && filters.name.$like) {
        const name = {
            $like: `%${filters.name.$like}%`
        }
        filtersCopy.name = name;
    }
    const results = await fetchMarketData(filtersCopy);
    return results.map(mappings.domains);
}