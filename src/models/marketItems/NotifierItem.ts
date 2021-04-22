import { Item } from 'models/Market'
import Big from 'big.js'
import { SupportedToken } from 'contracts/interfaces'
import { SubscriptionDTO } from 'api/rif-marketplace-cache/notifier/subscriptions/models'

export type PriceOption = {
    token: SupportedToken
    value: Big
}
export type NotifierPlanPriceOption = PriceOption

export type Provider = {
    provider: string
    url: string
}

export type NotifierPlan = Provider & {
    name: string
    channels: string[]
    limit: number
    priceOptions: PriceOption[]
    daysLeft: number
}

export type NotifierOfferItem = Item & NotifierPlan

export type NotifierSubsctiption = SubscriptionDTO

export type NotifierSubscriptionItem = Item & Omit<NotifierSubsctiption, 'hash'>
