import { Address } from './interfaces'
import OffersService, { notifierOffersAddress } from './offers/index'
import StakesService, { notifierStakesAddress } from './stakes'
import SubscriptionService, { notifierSubscriptionsAddress } from './subscriptions'

const notifierAddresses = [
  notifierOffersAddress,
  notifierSubscriptionsAddress,
  notifierStakesAddress,
]

export type NotifierServiceAddress = Address
export {
  OffersService as NotifierOffersService,
  SubscriptionService as NotifierSubscriptionsService,
  StakesService as NotifierStakesService,
  notifierAddresses,
}
