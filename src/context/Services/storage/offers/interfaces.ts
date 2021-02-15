import { ServiceState } from 'context/Services/interfaces'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem, StorageOffer } from 'models/marketItems/StorageItem'
import { Dispatch } from 'react'
import { Modify } from 'utils/typeUtils'
import { StorageOrder } from '../interfaces'

// STATE
export type ContextName = 'storage_offers'

export type OffersListing = {
  items: StorageItem[]
}

export type ContextFilters = Pick<StorageOffersFilters, 'price' | 'size' | 'periods' | 'provider'>
export type ContextLimits = Pick<StorageOffersFilters, 'price' | 'size'>

export type State = Modify<ServiceState<StorageItem>, {
  listing: OffersListing
  order?: StorageOrder
  filters: ContextFilters
  limits: ContextLimits
}>

// PAYLOAD
export type ListingPayload = Pick<OffersListing, 'items'>
export interface RefreshPayload {
  refresh: boolean
}

export type FiltersLimits = Partial<StorageOffersFilters>
export type LimitsPayload = Pick<StorageOffersFilters, 'price' | 'size'>

// ACTIONS
export type Action =
  | {
    type: 'SET_LISTING'
    payload: ListingPayload
  }
  | {
    type: 'REFRESH'
    payload: RefreshPayload
  }
  | {
    type: 'FILTER'
    payload: Partial<StorageOffersFilters>
  }
  | {
    type: 'UPDATE_LIMITS'
    payload: LimitsPayload
  }
  | {
    type: 'CLEAN_UP'
  }
  | {
    type: 'SET_ORDER'
    payload: StorageOffer
  }

export type Actions = {
  SET_LISTING: (state: State, payload: ListingPayload) => State
  REFRESH: (state: State, payload: RefreshPayload) => State
  FILTER: (state: State, payload: FiltersLimits) => State
  UPDATE_LIMITS: (state: State, payload: LimitsPayload) => State
  CLEAN_UP: () => State
  SET_ORDER: (state: State, item: StorageOffer) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
