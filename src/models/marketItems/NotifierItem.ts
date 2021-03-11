import { Item } from 'models/Market'
import { SupportedTokenSymbol } from 'models/Token'
import Big from 'big.js'

type PriceOption = {
    token: SupportedTokenSymbol
    value: Big
}
export type NotifierPlanPriceOption = PriceOption

export type NotifierPlan = {
    id: string
    channels: string[]
    limit: number
    priceOptions: PriceOption[]
    expirationDate: Date
}

/**
 * id: provider address
 */
export type NotifierOfferItem = Item & {
    plans: NotifierPlan[]
}
