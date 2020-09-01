import { Dispatch } from 'react'

import { ContextState } from 'context/storeUtils/interfaces'
import { StorageItem } from 'models/marketItems/StorageItem'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { ServiceState } from '../interfaces'
import { LISTING_ACTION, StorageAction } from './listingActions'
import { OFFERS_ACTION } from './offersActions'
import { ContextName as ListingContextName } from './ListingContext'
import { ContextName as OffersContextName } from './OffersContext'

export type StorageContextNames = OffersContextName | ListingContextName

export interface StoragePlanItem {
  internalId?: number
  currency: string // for now we only support RIF but in the future we may need something like an enum
  pricePerGb: number
  timePeriod: TimePeriodEnum
}

export interface ListingState extends ContextState {
  system: string
  availableSize: number
  country: string
  planItems: StoragePlanItem[]
  internalCounter: number
  allPeriods: TimePeriodEnum[]
  availablePeriods: TimePeriodEnum[]
}

export interface StorageListingContextProps {
  state: ListingState
  dispatch: Dispatch<StorageAction>
}

export type StorageState = ServiceState<StorageItem> & {
  filters: StorageOffersFilters
  limits: Pick<StorageOffersFilters, 'price' | 'size'>
}

export interface StorageContextProps {
  state: StorageState
  dispatch: Dispatch<StorageAction>
}

export enum TimePeriodEnum {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}

export type STORAGE_ACTION = LISTING_ACTION | OFFERS_ACTION
