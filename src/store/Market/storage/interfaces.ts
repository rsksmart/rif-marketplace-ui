import { StoreState } from 'store/storeUtils/interfaces'
import { Dispatch } from 'react'
import { StorageAction } from './listingActions'

export interface StoragePlanItem {
  internalId?: number
  currency: string // for now we only support RIF but in the future we may need something like an enum
  pricePerGb: number
  monthsDuration: number
}

export interface ListingState extends StoreState {
  system: string
  availableSize: number
  country: string
  currency: string
  planItems: StoragePlanItem[]
  internalCounter: number
  availableMonths: number[]
  allMonthsOptions: number[]
}

export interface StorageListingStoreProps {
  state: ListingState
  dispatch: Dispatch<StorageAction>
}
