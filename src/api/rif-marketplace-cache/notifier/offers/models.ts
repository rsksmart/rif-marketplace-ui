import { SupportedFiatSymbol } from 'models/Fiat'
import { MinMaxFilter } from 'models/Filters'
import { NotifierOffersFilters } from 'models/marketItems/NotifierFilters'
import { SupportedTokenSymbol } from 'models/Token'

type PricesDTO = {
    id: number
    price: string
    rateId: string
    rate: number
  }

type ChannelsDTO = {
    id: number
    name: string
  }

export const PLAN_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export type PlanStatus = keyof typeof PLAN_STATUS

export type PlanDTO = {
  planId: number
  name: string
  planStatus: PlanStatus
  daysLeft: number
  quantity: number
  providerId: string
  url: string
  channels: ChannelsDTO[]
  prices: PricesDTO[]
}

export default class NotifierFiltersTransport {
    size!: MinMaxFilter

    price!: MinMaxFilter & {
        fiatSymbol: SupportedFiatSymbol
    }

    currency?: Array<SupportedTokenSymbol>

    channels?: Array<string>

    provider?: string

    constructor({
      size,
      price,
      currency,
      channels,
      provider,
    }: NotifierOffersFilters) {
      this.size = size
      this.provider = provider
      this.price = price && {
        min: Math.floor(price.min),
        max: Math.ceil(price.max),
        fiatSymbol: price.fiatSymbol,
      }
      this.currency = currency && Array.from(currency)
      this.channels = channels && Array.from(channels)
    }
}
