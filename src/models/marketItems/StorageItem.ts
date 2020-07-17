import { Item } from 'models/Market'

export interface StorageItem extends Item {
    provider: string // TODO: iface User/Provider?
    size: number
    contractLengthMonths: number
    pricePerMonth: number
    currency: string
    priceUsd: number
}
