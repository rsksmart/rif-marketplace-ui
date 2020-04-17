import { Domain, DomainOffer } from "models/marketItems/DomainItem";
import { TxType } from "store/Market/MarketStore";
import { createService, fetchMarketData } from "./cacheController";
import { DomainOffersFilter } from "api/models/RnsFilter";

export const DOMAINS_SERVICE_PATHS = {
    BUY: 'rns/v0/offers',
    SELL: (ownerAddress: string) => `rns/v0/${ownerAddress}/domains`,
}

export interface OfferTransferItem {
    creationDate?: number,
    expirationDate: number,
    newOwnerAddress?: string,
    offerId: string,
    paymentToken: string,
    price: number,
    sellerAddress: string,
    sellerDomain: string,
    soldDate?: number,
    tokenId: string,

}

export interface DomainTransferItem {
    expirationDate: number,
    ownerAddress: string,
    name: string,
    tokenId: string,
}

const mappings = {
    offers: (item: OfferTransferItem): DomainOffer => ({
        price_fiat: 0.5,
        _id: item.offerId,
        domainName: item.sellerDomain,
        ...item
    }),
    domains: (item: DomainTransferItem): Domain => ({
        _id: item.tokenId,
        ...item
    })
}

export const createDomainService = (ownerAddress: string) => {
    return createService(DOMAINS_SERVICE_PATHS.SELL(ownerAddress));
}

export const createOffersService = () => {
    return createService(DOMAINS_SERVICE_PATHS.BUY);
}

export const fetchDomainOffers = async (filters: DomainOffersFilter) => {
    const filtersCopy = { ...filters }
    if (filters.sellerDomain && filters.sellerDomain.$like) {
        const sellerDomain = {
            $like: `%${filters.sellerDomain.$like}%`
        }
        filtersCopy.sellerDomain = sellerDomain;
    }
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