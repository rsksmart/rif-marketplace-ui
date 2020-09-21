import { Dispatch } from 'react'
import network from '../../../blockchain/config'

import { ContextState } from 'context/storeUtils/interfaces'
import { StorageItem } from 'models/marketItems/StorageItem'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { tokenDisplayNames } from '../../../api/rif-marketplace-cache/rates/xr'
import { ServiceState } from '../interfaces'
import { STORAGE_SELL_ACTION, StorageSellAction } from './storageSellActions'
import { OFFERS_ACTION } from './offersActions'
import { ContextName as SellContextName } from './StorageSellContext'
import { ContextName as OffersContextName } from './OffersContext'
export type StorageContextNames = OffersContextName | SellContextName

export interface StoragePlanItem {
  internalId?: number
  currency: string // for now we only support RIF but in the future we may need something like an enum
  pricePerGb: number
  timePeriod: TimePeriodEnum
}

export interface StorageSellState extends ContextState {
  system: string
  availableSize: number
  country: string
  planItems: StoragePlanItem[]
  internalCounter: number
  allPeriods: TimePeriodEnum[]
  peerId: string
  usedPeriodsPerCurrency: Record<string, TimePeriodEnum[]> // dictionary to easily know the timePeriods already used by a given currency
}

export interface StorageSellContextProps {
  state: StorageSellState
  dispatch: Dispatch<StorageSellAction>
}

export type StorageState = ServiceState<StorageItem> & {
  filters: StorageOffersFilters
  limits: Pick<StorageOffersFilters, 'price' | 'size'>
}

export interface StorageContextProps {
  state: StorageState
  dispatch: Dispatch<StorageSellAction>
}

export enum TimePeriodEnum {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}

export type STORAGE_ACTION = STORAGE_SELL_ACTION | OFFERS_ACTION

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const TOKENS_ADDRESSES = {
  [tokenDisplayNames.rbtc]: ZERO_ADDRESS, // we are using zero address for native token is Storage Manager SC
  [tokenDisplayNames.rif]: network.contractAddresses.rif
}
