import { Item } from 'models/Market'

export interface StorageItem extends Item {
    provider: string // TODO: iface User/Provider?
    size: number
    contractLengthMonths: number
    pricePerMonth: number
    currency: string
    priceUsd: number
}

export interface StoragePlan {
  _internalId?: number
  currency: string // for now we only support RIF but in the future we may need something like an enum
  pricePerGb: number
  monthsDuration: number
}

// // export interface StorageFilterIface extends MarketFilterIface {

// // }

export class StorageItem implements StorageItem {
    provider!: string;

//     size!: number;

//     contractLengthMonths!: number;

//     pricePerMonth!: number;

//     currency!: string;

//     priceUsd!: number;

//     id!: string;
// }
