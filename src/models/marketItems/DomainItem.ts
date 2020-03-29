import { MarketItem } from 'models/Market';

export interface DomainItemType extends MarketItem {
    currency: string,
    domain: string,
    price_fiat: number
    price: number,
    tld: string,
    seller: string
}

export class DomainItem implements DomainItemType {
    currency!: string;
    domain!: string;
    price_fiat!: number;
    price!: number;
    tld!: string;
    seller!: string;
    _id!: string;
}