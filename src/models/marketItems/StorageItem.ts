import { Big } from 'big.js'
import { Item } from 'models/Market'
import { SupportedTokens } from 'contracts/interfaces'

export type SubscriptionPeriod = 'Daily' | 'Weekly' | 'Monthly'
export enum PeriodInSeconds {
  Daily = 86400,
  Weekly = 604800,
  Monthly = 2592000
}

export interface BillingPlan {
  period: SubscriptionPeriod
  price: Big
  currency: SupportedTokens
}

export interface StorageOffer extends Item {
  location: string
  system: string
  availableSizeGB: Big
  utilizedCapacityGB: Big
  subscriptionOptions: BillingPlan[]
  averagePrice: number
  acceptedCurrencies: string[]
  peerId: string
  totalCapacityGB: Big
  isActive: boolean
}

export type Agreement = Item & {
  title: string
  provider: string
  dataReference: string
  size: Big
  renewalDate: Date
  subscriptionPrice: Big
  subscriptionPeriod: SubscriptionPeriod
  monthlyFee: Big
  paymentToken: SupportedTokens
  consumer: string
  withdrawableFunds: Big
  toBePayedOut: Big
}

export type StorageItem = StorageOffer
