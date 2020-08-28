import { Big } from 'big.js'
import { Item } from 'models/Market'

export type SubscriptionPeriods = 'Daily' | 'Weekly' | 'Monthly'
export enum PeriodInSeconds {
  Daily = 86400,
  Weekly = 604800,
  Monthly = 2620800
}

export type Currencies = 'RBTC'

export interface BillingPlan {
  period: string
  price: Big
  currency: Currencies
}

export interface StorageOffer extends Item {
  location: string
  system: string
  availableSize: Big
  subscriptionOptions: BillingPlan[]
  pricePGBPDay: Big
}

export type StorageItem = StorageOffer
