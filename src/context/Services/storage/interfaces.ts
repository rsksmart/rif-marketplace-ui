import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import networkConfig from 'config'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem, StorageOffer } from 'models/marketItems/StorageItem'
import { ZERO_ADDRESS } from 'constants/strings'
import { ServiceOrder, ServiceState } from '../interfaces'
import { OFFERS_ACTION } from './offers/offersActions'
import { ContextName as OffersContextName } from './offers/OffersContext'
import { ContextName as AgreementContextName } from './agreements/interfaces'

export type StorageContextNames = OffersContextName | AgreementContextName

export type StorageState = ServiceState<StorageItem> & {
  filters: StorageOffersFilters
  limits: Pick<StorageOffersFilters, 'price' | 'size'>
}

export enum TimePeriodEnum {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}

export type STORAGE_ACTION = OFFERS_ACTION

export const TokenAddressees = {
  [tokenDisplayNames.rbtc]: ZERO_ADDRESS, // we are using zero address for native token is Storage Manager SC
  [tokenDisplayNames.rif]: networkConfig.contractAddresses.rif,
}
export type PinnedContent = {
  contentName: string
  contentSize: string
  contentHash: string
}

export type StorageOrder = Omit<ServiceOrder<StorageOffer>, 'isOutdated'>
