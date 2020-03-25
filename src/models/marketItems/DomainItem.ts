import { MarketItem } from 'models/Market';

export interface DomainItemType extends MarketItem {
    currency: string,
    domain: string,
    price_usd: number
    price: number,
    tld: string,
    user: string // TODO: iface User?
}
export class DomainItem implements DomainItemType {
    currency!: string;
    domain!: string;
    price_usd!: number;
    price!: number;
    tld!: string;
    user!: string;
    _id!: string;
}