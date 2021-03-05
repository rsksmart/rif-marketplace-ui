import { TransportModel } from './models'
import OffersService, {
  address, Address,
  wsChannel, WSChannel,
} from './offers'

export {
  address as notifierOffersAddress,
  wsChannel as notifierOffersWSChannel,
}

export default OffersService

export type NotifierOffersAddress = Address
export type NotifierOffersWSChannel = WSChannel
export type NotifierOffersTransportModel = TransportModel
