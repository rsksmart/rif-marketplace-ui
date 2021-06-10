import { APIService } from 'api/models/apiService'
import { NotifierSubscriptionsFilters } from 'models/marketItems/NotifierFilters'
import { NotifierItem } from 'models/marketItems/NotifierItem'
import { NotifierOffersAddress, NotifierOffersWSChannel } from './offers'
import { NotifierStakesAddress, NotifierStakesWSChannel } from './stakes'
import { NotifierSubscriptionsAddress, NotifierSubscriptionsWSChannel } from './subscriptions'

export type Address =
  | NotifierOffersAddress
  | NotifierSubscriptionsAddress
  | NotifierStakesAddress
export type WSChannel =
  | NotifierOffersWSChannel
  | NotifierSubscriptionsWSChannel
  | NotifierStakesWSChannel

export interface NotifierCacheAPIService extends APIService {
  path: Address
  _channel: WSChannel
  fetch: (filters?: NotifierSubscriptionsFilters) => Promise<NotifierItem[]>
}
