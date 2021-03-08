import { Address } from './interfaces'
import OffersService, { notifierOffersAddress } from './offers/index'

const notifierAddresses = [notifierOffersAddress]

export type NotifierServiceAddress = Address
export {
  OffersService as NotifierOffersService,
  notifierAddresses,
}
