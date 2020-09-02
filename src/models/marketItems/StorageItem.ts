import { Big } from 'big.js'
import { Item } from 'models/Market'

export type SubscriptionPeriod = 'Daily' | 'Weekly' | 'Monthly'
export enum PeriodInSeconds {
  Daily = 86400,
  Weekly = 604800,
  Monthly = 2592000
}

export type Currencies = 'RBTC'

export interface BillingPlan {
  period: SubscriptionPeriod
  price: Big
  currency: Currencies
}

export interface StorageOffer extends Item {
  location: string
  system: string
  availableSizeGB: Big
  subscriptionOptions: BillingPlan[]
  averagePrice: number
}

export type StorageItem = StorageOffer
