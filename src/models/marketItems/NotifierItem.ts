import Big from 'big.js'
import { Item } from 'models/Market'
import { SupportedTokenSymbol } from 'models/Token'

export type NotifierOfferItem = Item & {
    provider: string
    amountRange: number[]
    channels: string[]
    currencies: SupportedTokenSymbol[]
    priceFiatRange: Big[]
}
