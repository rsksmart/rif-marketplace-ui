import { APIService } from 'api/models/apiService'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { NotifierOffersAddress, NotifierOffersWSChannel } from './offers'

export type Address =
    | NotifierOffersAddress
export type WSChannel =
    | NotifierOffersWSChannel

export interface NotifierAPIService extends APIService {
  path: Address
  _channel: WSChannel
  fetch: () => Promise<NotifierOfferItem[]>
}
