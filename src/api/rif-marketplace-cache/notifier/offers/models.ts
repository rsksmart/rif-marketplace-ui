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

export type PlanDTO = {
  id: number
  name: string
  planStatus: | 'ACTIVE'
  daysLeft: number
  quantity: number
  providerId: string
  url: string
  channels: ChannelsDTO[]
  prices: PricesDTO[]
}
