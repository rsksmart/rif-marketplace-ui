import { APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { NotifierOffersAddress, NotifierOffersWSChannel } from './offers'

export type Address =
    | NotifierOffersAddress
export type WSChannel =
    | NotifierOffersWSChannel

export type NotifierAPIService = Modify<
  APIService,
  {
    path: Address
    _channel: WSChannel
    fetch: () => Promise<NotifierOfferItem[]>
  }
>
