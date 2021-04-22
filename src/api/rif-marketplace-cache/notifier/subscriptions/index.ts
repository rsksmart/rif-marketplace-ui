import { SubscriptionDTO } from './models'
import SubscriptionsService, {
  address, Address,
  wsChannel, WSChannel,
} from './api'

export {
  address as notifierSubscriptionsAddress,
  wsChannel as notifierSubscriptionsWSChannel,
}

export default SubscriptionsService

export type NotifierSubscriptionsAddress = Address
export type NotifierSubscriptionsWSChannel = WSChannel
export type NotifierSubscriptionsTransportModel = SubscriptionDTO
