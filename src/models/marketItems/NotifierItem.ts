import { Item } from 'models/Market'
import Big from 'big.js'
import { SupportedToken } from 'contracts/interfaces'

export type PriceOption = {
    token: SupportedToken
    value: Big
}
export type NotifierPlanPriceOption = PriceOption

export type NotifierPlan = {
    name: string
    channels: string[]
    limit: number
    priceOptions: PriceOption[]
    daysLeft: number
    provider: string
}

export type NotifierOfferItem = Item & NotifierPlan
