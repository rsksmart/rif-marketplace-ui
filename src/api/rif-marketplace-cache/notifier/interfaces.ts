import { APIService } from 'api/models/apiService'
import { NotifierFilters } from 'models/marketItems/NotifierFilters'
import { NotifierItem } from 'models/marketItems/NotifierItem'
import { NotifierOffersAddress, NotifierOffersWSChannel } from './offers'
import { NotifierProvidersAddress, NotifierProvidersWSChannel } from './providers'
import { NotifierStakesAddress, NotifierStakesWSChannel } from './stakes'
import { NotifierSubscriptionsAddress, NotifierSubscriptionsWSChannel } from './subscriptions'

export type Address =
  | NotifierOffersAddress
  | NotifierSubscriptionsAddress
  | NotifierStakesAddress
  | NotifierProvidersAddress
export type WSChannel =
  | NotifierOffersWSChannel
  | NotifierSubscriptionsWSChannel
  | NotifierStakesWSChannel
  | NotifierProvidersWSChannel

export interface NotifierCacheAPIService extends APIService {
  path: Address
  _channel: WSChannel
  fetch: (filters?: NotifierFilters) => Promise<NotifierItem[]>
}
