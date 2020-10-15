import { SupportedToken } from 'api/rif-marketplace-cache/rates/xr'
import { Big } from 'big.js'
import { Item } from 'models/Market'

export type SubscriptionPeriod = 'Daily' | 'Weekly' | 'Monthly'
export enum PeriodInSeconds {
  Daily = 86400,
  Weekly = 604800,
  Monthly = 2592000
}

export interface BillingPlan {
  period: SubscriptionPeriod
  price: Big
  currency: SupportedToken
}

export interface StorageOffer extends Item {
  location: string
  system: string
  availableSizeGB: Big
  subscriptionOptions: BillingPlan[]
  averagePrice: number
  acceptedCurrencies: string[]
  peerId: string
}

export type Agreement = Item & {
  title: string
  provider: string
  size: Big
  renewalDate: Date
  subscriptionPeriod: SubscriptionPeriod
  monthlyFee: Big
  paymentToken: SupportedToken
}

export type StorageItem = StorageOffer
