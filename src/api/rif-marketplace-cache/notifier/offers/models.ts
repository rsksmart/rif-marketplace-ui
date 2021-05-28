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
  id: number
  name: string
  planStatus: PlanStatus
  daysLeft: number
  quantity: number
  providerId: string
  url: string
  channels: ChannelsDTO[]
  prices: PricesDTO[]
}
