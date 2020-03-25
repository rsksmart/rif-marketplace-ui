import { MarketItem } from 'models/Market';

export interface StorageItemType extends MarketItem {
    provider: string, // TODO: iface User/Provider?
    size: number,
    contract_length_months: number,
    price_per_month: number,
    currency: string,
    price_usd: number,
}

export class StorageItem implements StorageItemType {
    provider!: string;
    size!: number;
    contract_length_months!: number;
    price_per_month!: number;
    currency!: string;
    price_usd!: number;
    _id!: string;
}