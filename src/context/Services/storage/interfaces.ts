import { ContextState } from 'context/storeUtils/interfaces'
import { Dispatch } from 'react'
import { StorageAction, LISTING_ACTION } from './listingActions'
import { ContextName as ListingContextName } from './ListingContext'
import { ContextName as OffersContextName } from './OffersContext'
import { OFFERS_ACTION } from './offersActions'

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
  currency: string
  planItems: StoragePlanItem[]
  internalCounter: number
  allPeriods: TimePeriodEnum[]
  availablePeriods: TimePeriodEnum[]
}

export interface StorageListingContextProps {
  state: ListingState
  dispatch: Dispatch<StorageAction>
}

export enum TimePeriodEnum {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}

export type STORAGE_ACTION = LISTING_ACTION | OFFERS_ACTION
