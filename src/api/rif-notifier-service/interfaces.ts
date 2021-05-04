import { APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'

export type ServiceAddress = string

export type Subscriptions = {
  data: any
}

export type NotifierAPIService = Modify<APIService, {
  path: ServiceAddress
  getSubscriptions: (account: string) => Promise<Subscriptions[]>
}>
