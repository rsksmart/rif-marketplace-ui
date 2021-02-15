import { Big } from 'big.js'
import { Item } from 'models/Market'
import { BaseToken } from 'models/Token'

export type SubscriptionPeriod = 'Daily' | 'Weekly' | 'Monthly'
export enum PeriodInSeconds {
  Daily = 86400,
  Weekly = 604800,
  Monthly = 2592000
}

export interface BillingPlan {
  period: SubscriptionPeriod
  price: Big
  currency: BaseToken
}

export interface StorageOffer extends Item {
  location: string
  system: string
  availableSizeGB: Big
  utilizedCapacityGB: Big
  subscriptionOptions: BillingPlan[]
  averagePrice: number
  acceptedCurrencies: string[] // FIXME: change to Supported currency
  peerId: string
  totalCapacityGB: Big
  isActive: boolean
}

export type Agreement = Item & {
  title: string
  provider: string
  dataReference: string
  size: Big
  renewalDate?: Date
  subscriptionPrice: Big
  subscriptionPeriod: SubscriptionPeriod
  monthlyFee: Big
  paymentToken: BaseToken
  consumer: string
  withdrawableFunds: Big
  toBePayedOut: Big
  expiresInSeconds: number
  isActive: boolean
}

export type StorageItem = StorageOffer
