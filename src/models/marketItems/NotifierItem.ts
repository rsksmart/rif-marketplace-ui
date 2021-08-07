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

export type EventChannel = {
    type: SupportedEventChannel
    origin: string
}

export type EventChannels = Array<EventChannel>

export type NotifierPlan = Item & Provider & {
    planId: number
    name: string
    channels: EventChannels
    limit: number
    priceOptions: PriceOption[]
    daysLeft: number
    planStatus: PlanStatus
}

export type NotifierOfferItem = NotifierPlan

export type NotifierSubscriptionItem = Item & Omit<SubscriptionDTO,
'hash' | 'price' | 'rateId' | 'providerId' | 'topics' | 'withdrawableFunds'> & {
    price: Big
    provider: Provider
    token: SupportedToken
    events: Array<TopicDTO>
    withdrawableFunds: Big
}

export type SelectedEventChannel = EventChannel & {
    destination: string
}

export type SelectedEventChannels = Array<SelectedEventChannel>

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
    channels: SelectedEventChannels
    smartContract?: string
    type: SupportedEventType
    signature?: string
}
