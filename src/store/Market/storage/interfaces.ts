import { StoreState } from 'store/storeUtils/interfaces'
import { Dispatch } from 'react'
import { StorageAction } from './storageActions'

export interface StoragePlanItem {
  internalId?: number
  currency: string // for now we only support RIF but in the future we may need something like an enum
  pricePerGb: number
  monthsDuration: number
}

export interface StorageListingPlan {
  system: string
  availableSize: number
  country: string
  currency: string
  planItems: StoragePlanItem[]
  internalCounter: number
  availableMonths: number[]
}

export interface StorageState extends StoreState {
  plan?: StorageListingPlan
}

export interface StorageStoreProps {
  state: StorageState
  dispatch: Dispatch<StorageAction>
}
