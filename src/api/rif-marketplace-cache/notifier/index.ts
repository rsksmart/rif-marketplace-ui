import { Address } from './interfaces'
import OffersService, { notifierOffersAddress } from './offers/index'
import SubscriptionService, { notifierSubscriptionsAddress } from './subscriptions'

const notifierAddresses = [notifierOffersAddress, notifierSubscriptionsAddress]

export type NotifierServiceAddress = Address
export {
  OffersService as NotifierOffersService,
  SubscriptionService as NotifierSubscriptionsService,
  notifierAddresses,
}
