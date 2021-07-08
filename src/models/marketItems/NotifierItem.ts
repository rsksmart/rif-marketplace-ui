import { Item } from 'models/Market'
import Big from 'big.js'
import { SupportedToken } from 'contracts/interfaces'
import { SubscriptionDTO } from 'api/rif-marketplace-cache/notifier/subscriptions/models'
import { SupportedEventType, SupportedEventChannel } from 'config/notifier'
import { TopicDTO } from 'api/rif-notifier-service/models/subscriptions'
import { PlanStatus } from 'api/rif-marketplace-cache/notifier/offers/models'

export type PriceOption = {
    token: SupportedToken
    value: Big
}
export type NotifierPlanPriceOption = PriceOption

export type Provider = {
    provider: string
    url: string
}

export type NotifierPlan = Item & Provider & {
    planId: number
    name: string
    channels: Array<SupportedEventChannel>
    planStatus: PlanStatus
    limit: number
    priceOptions: PriceOption[]
    daysLeft: number
    planStatus: PlanStatus
}

export type NotifierOfferItem = NotifierPlan

export type NotifierSubscriptionItem = Item & Omit<SubscriptionDTO,
'hash' | 'price' | 'rateId' | 'providerId' | 'topics'> & {
    price: Big
    provider: Provider
    token: SupportedToken
    events: Array<TopicDTO>
}

export type NotifierChannel = {
    type: string
    destination: string
}

export type NotifierItem = NotifierOfferItem | NotifierSubscriptionItem

export type NotifierEventParam = {
    name: string
    type: string
    indexed?: boolean
    order?: number
}

export type NotifierEvent = {
    name?: string
    params?: Array<NotifierEventParam>
    channels: Array<NotifierChannel>
    smartContract?: string
    type: SupportedEventType
    signature?: string
}
