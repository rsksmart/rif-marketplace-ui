import { SupportedFiatSymbol } from 'models/Fiat'
import { MinMaxFilter } from 'models/Filters'
import { SupportedTokenSymbol } from 'models/Token'

type PriceFilter = MinMaxFilter & {
    fiatSymbol: SupportedFiatSymbol
}

export type NotifierOffersFilters = {
    size: MinMaxFilter
    price: PriceFilter
    currency: Set<SupportedTokenSymbol>
    channels: Set<string>
    provider?: string
}
