import { DomainOffersFilter } from "api/models/RnsFilter";
import { Domain, DomainOffer } from "models/marketItems/DomainItem";
import { createService, fetchMarketData } from "./cacheController";
import { ganache } from 'ui-config.json';


export const DOMAINS_SERVICE_PATHS = {
    'BUY': () => 'rns/v0/offers',
    'SELL': (ownerAddress: string) => `rns/v0/${ownerAddress}/domains`,
}

const tokens = Object.keys(ganache).reduce((acc, key) => {
    const value = ganache[key];
    acc[value] = key;
    return acc;
}, {});

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

const mappings = {
    offers: (item: OfferTransferItem): DomainOffer => ({
        ...item,
        price: parseInt(item.price) / 10 ** 18,
        expirationDate: new Date(item.domain.expirationDate),
        _id: item.offerId,
        domainName: item.domain.name,
        paymentToken: tokens[item.paymentToken],
    }),
    domains: (item: DomainTransferItem): Domain => ({
        ...item,
        _id: item.tokenId,
        expirationDate: new Date(item.expirationDate)
    }),
    minMaxPrice: (_, item: { price: string }): number => {
        return parseInt(item.price) / 10 ** 18
    },

}

export const createDomainService = (ownerAddress: string) => {
    return createService(DOMAINS_SERVICE_PATHS.SELL(ownerAddress));
}

export const createOffersService = () => {
    return createService(DOMAINS_SERVICE_PATHS.BUY());
}

export const fetchDomainOffers = async (filters: DomainOffersFilter) => {
    const { price } = filters;
    const cacheFilters = {
        ...filters,
        price: {
            $gte: price.$gte * (10 ** 18),
            $lte: price.$lte * (10 ** 18),
        },
        // Commented out as the Cache project does not currently support associated querying
        // domain: domain && {
        //     ...filters.domain,
        //     name: {
        //         $like: `%${domain.name.$like}%`
        //     }
        // }
    }
    const results = await fetchMarketData(cacheFilters);
    return results.map(mappings.offers);
};

export const fetchDomains = async (filters?) => {
    const filtersCopy = { ...filters }
    if (filters?.name?.$like) {
        const name = {
            $like: `%${filters.name.$like}%`
        }
        filtersCopy.name = name;
    }
    const results = await fetchMarketData(filtersCopy);

    return results.map(mappings.domains);
}

const fetchMinPrice = async () => {
    const query = {
        $limit: 1,
        $sort: {
            price: 1
        },
        $select: ['price']
    };
    const results = await fetchMarketData(query);

    return results.reduce(mappings.minMaxPrice, 0);
}

const fetchMaxPrice = async () => {
    const query = {
        $limit: 1,
        $sort: {
            price: -1
        },
        $select: ['price']
    };
    const results = await fetchMarketData(query);

    return results.reduce(mappings.minMaxPrice, 0);
}

export const fetchMinMaxPrice = async () => {
    const minPrice = await fetchMinPrice();
    const maxPrice = await fetchMaxPrice();
    return { minPrice, maxPrice };
}