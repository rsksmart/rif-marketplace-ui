import { Dispatch } from 'react'

import { ContextState } from 'context/storeUtils/interfaces'
import { StorageItem } from 'models/marketItems/StorageItem'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { ServiceState } from '../interfaces'
import { LISTING_ACTION, ListingAction } from './listingActions'
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
  peerId: string
  usedPeriodsPerCurrency: Record<string, TimePeriodEnum[]> // dictionary to easily know the timePeriods already used by a given currency
}

export interface StorageListingContextProps {
  state: ListingState
  dispatch: Dispatch<ListingAction>
}

export type StorageState = ServiceState<StorageItem> & {
  filters: StorageOffersFilters
  limits: Pick<StorageOffersFilters, 'price' | 'size'>
}

export enum TimePeriodEnum {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}

export type STORAGE_ACTION = LISTING_ACTION | OFFERS_ACTION
