import { Item } from 'models/Market'
import Big from 'big.js'
import { SupportedToken } from 'contracts/interfaces'
import { SubscriptionDTO, SubscriptionEvent } from 'api/rif-marketplace-cache/notifier/subscriptions/models'
import { SupportedEventType, SupportedEventChannel } from 'config/notifier'

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
    channels: Array<SupportedEventChannel>
    limit: number
    priceOptions: PriceOption[]
    daysLeft: number
}

export type NotifierOfferItem = Item & NotifierPlan

export type NotifierSubscriptionItem = Item & Omit<SubscriptionDTO,
'hash' | 'price' | 'rateId' | 'providerId' | 'topics'> & {
    provider: string
    price: Big
    token: SupportedToken
    events: Array<SubscriptionEvent>
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
