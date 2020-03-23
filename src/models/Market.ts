export interface MarketItem {
    _id: string;
}

export interface DomainItemType extends MarketItem {
    currency: string,
    domain: string,
    price_usd: number
    price: number,
    tld: string,
    user: string // TODO: iface User?
}

export interface StorageItemType extends MarketItem {
    provider: string, // TODO: iface User/Provider?
    size: number,
    contract_length_months: number,
    price_per_month: number,
    currency: string,
    price_usd: number,
}

export type MarketItemType = DomainItemType & StorageItemType