import { MarketItem } from 'models/Market'

export interface StorageItem extends MarketItem {
    provider: string // TODO: iface User/Provider?
    size: number
    contractLengthMonths: number
    pricePerMonth: number
    currency: string
    priceUsd: number
}

// export interface StorageFilterIface extends MarketFilterIface {

// }

export class StorageItem implements StorageItem {
    provider!: string;

    size!: number;

    contractLengthMonths!: number;

    pricePerMonth!: number;

    currency!: string;

    priceUsd!: number;

    id!: string;
}
