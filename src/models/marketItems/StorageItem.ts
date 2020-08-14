
import { Big } from 'big.js'
import { Item } from 'models/Market'
import { BillingPlanTransport } from 'api/models/storage/transports'

export type SubscriptionPeriod = Record<number, string>
export const subscriptionPeriods: SubscriptionPeriod = {
  86400: 'Day',
  604800: 'Week',
  2620800: 'Month'
}

export type Currencies = 'RBTC'

export interface BillingPlan {
  period: SubscriptionPeriod,
  price: Big
  currency: Currencies
}

export interface StorageOffer extends Item {
    provider: string
    location: string
    system: string
    availableSize: Big
    subscriptionOptions: BillingPlan[]
    pricePGBPDay: Big
}

export type StorageItem = StorageOffer
