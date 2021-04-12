import { APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'

export const serviceAddress = 'v1' as const
export type ServiceAddress = typeof serviceAddress

export type Subscriptions = {
  data: any
}

export type NotifierAPIService = Modify<APIService, {
  path: ServiceAddress
  getSubscriptions: (account: string) => Promise<Subscriptions[]>
}>
