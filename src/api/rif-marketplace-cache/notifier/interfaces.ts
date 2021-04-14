import { APIService } from 'api/models/apiService'
import { NotifierItem } from 'models/marketItems/NotifierItem'
import { NotifierOffersAddress, NotifierOffersWSChannel } from './offers'
import { NotifierSubscriptionsAddress, NotifierSubscriptionsWSChannel } from './subscriptions'

export type Address =
    | NotifierOffersAddress
    | NotifierSubscriptionsAddress
export type WSChannel =
    | NotifierOffersWSChannel
    | NotifierSubscriptionsWSChannel

export interface NotifierAPIService extends APIService {
  path: Address
  _channel: WSChannel
  fetch: () => Promise<NotifierItem[]>
}
