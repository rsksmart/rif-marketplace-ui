
import { Big } from 'big.js'
import { Item } from 'models/Market'

export enum TimeInSeconds {
  DAY = 86400,
  WEEK = 604800,
  MONTH = 2620800
}
export type SubscriptionPeriod = Record<number, string>
export const subscriptionPeriods: SubscriptionPeriod = {
  [TimeInSeconds.DAY]: 'Day',
  [TimeInSeconds.WEEK]: 'Week',
  [TimeInSeconds.MONTH]: 'Month'
}

export type Currencies = 'RBTC'

export interface BillingPlan {
  period: SubscriptionPeriod,
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
