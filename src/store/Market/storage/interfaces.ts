import { StoreState } from 'store/storeUtils/interfaces'
import { Dispatch } from 'react'
import { StorageItem } from 'models/marketItems/StorageItem'
import { StorageAction } from './listingActions'
import { ServiceStoreState } from '../interfaces'
import { StoreName as OffersStoreName } from './OffersContext'
import { StoreName as ListingStoreName } from './ListingStore'

export type StorageStoreNames = OffersStoreName | ListingStoreName

export interface StoragePlanItem {
  internalId?: number
  currency: string // for now we only support RIF but in the future we may need something like an enum
  pricePerGb: number
  timePeriod: TimePeriodEnum
}

export interface ListingState extends StoreState {
  system: string
  availableSize: number
  country: string
  currency: string
  planItems: StoragePlanItem[]
  internalCounter: number
  allPeriods: TimePeriodEnum[]
  availablePeriods: TimePeriodEnum[]
}

export type StorageState = ServiceStoreState<StorageItem>

export interface StorageStoreProps {
  state: ListingState
  dispatch: Dispatch<StorageAction>
}

export enum TimePeriodEnum {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}
