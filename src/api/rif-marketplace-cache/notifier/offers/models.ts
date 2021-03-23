export type NotifierPlanDTO = {
  id: number
  name: string
  planStatus: | 'ACTIVE'
  daysLeft: number
  quantity: number
  channels: {
    id: number
    name: string
  }[]
  prices: {
    id: number
    price: string
    rateId: string
  }[]
}

export type TransportModel = {
    provider: string
    url: string
    createdAt: string
    updatedAt: string
    plans: NotifierPlanDTO[]
}
