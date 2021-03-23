import { Item } from 'models/Market'
import Big from 'big.js'
import { SupportedToken } from 'contracts/interfaces'

type PriceOption = {
    token: SupportedToken
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
