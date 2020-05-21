import { MarketItemIface } from 'models/Market'

export interface StorageItemIface extends MarketItemIface {
    provider: string // TODO: iface User/Provider?
    size: number
    contractLengthMonths: number
    pricePerMonth: number
    currency: string
    priceUsd: number
}

// export interface StorageFilterIface extends MarketFilterIface {

// }

export class StorageItem implements StorageItemIface {
    provider!: string;

    size!: number;

    contractLengthMonths!: number;

    pricePerMonth!: number;

    currency!: string;

    priceUsd!: number;

    id!: string;
}
