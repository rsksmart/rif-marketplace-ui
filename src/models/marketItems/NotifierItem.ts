import { Item } from 'models/Market'
import { SupportedTokenSymbol } from 'models/Token'
import Big from 'big.js'

export type PlanPrice = {
    token: SupportedTokenSymbol
    value: Big
}

export type NotifierPlan = {
    id: string
    channels: string[]
    limit: number
    priceOptions: PlanPrice[]
    expirationDate: Date
}

export type NotifierOfferItem = Item & {
    plans: NotifierPlan[]
}
