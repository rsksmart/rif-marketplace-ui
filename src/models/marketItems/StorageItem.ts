import { MarketItemIface, MarketFilterIface } from 'models/Market';

export interface StorageItemIface extends MarketItemIface {
    provider: string, // TODO: iface User/Provider?
    size: number,
    contract_length_months: number,
    price_per_month: number,
    currency: string,
    price_usd: number,
}

// export interface StorageFilterIface extends MarketFilterIface {

// }

export class StorageItem implements StorageItemIface {
    provider!: string;
    size!: number;
    contract_length_months!: number;
    price_per_month!: number;
    currency!: string;
    price_usd!: number;
    _id!: string;
}