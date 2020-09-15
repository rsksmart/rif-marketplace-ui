import { ContextDispatch } from 'context/storeUtils/interfaces'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem } from 'models/marketItems/StorageItem'
import { OffersListing, StorageOffersState } from './OffersContext'
import { ServiceOrder } from '../interfaces'

export type OFFERS_ACTION = 'FILTER' | 'SET_LISTING' | 'REFRESH' | 'UPDATE_LIMITS' | 'SET_ORDER'

export type ListingPayload = Pick<OffersListing, 'items'>

export interface RefreshPayload {
  refresh: boolean
}

export type FiltersLimits = Partial<StorageOffersFilters>
export type LimitsPayload = Pick<StorageOffersFilters, 'price' | 'size'>

export type OrderPayload = Pick<ServiceOrder<StorageItem>, 'item'> & {
  contentName?: string
  contentSize?: string
  contentHash?: string
}

export type StorageOffersPayload =
  ListingPayload |
  RefreshPayload |
  LimitsPayload |
  FiltersLimits |
  OrderPayload

export interface StorageOffersAction extends
  ContextDispatch<OFFERS_ACTION, StorageOffersPayload> {
  type: OFFERS_ACTION
}

export interface StorageOffersReducer<P extends StorageOffersPayload> {
  (state: StorageOffersState, payload: P): StorageOffersState
}

export type Actions = {
  SET_LISTING: StorageOffersReducer<ListingPayload>
  REFRESH: StorageOffersReducer<RefreshPayload>
  FILTER: StorageOffersReducer<FiltersLimits>
  UPDATE_LIMITS: StorageOffersReducer<LimitsPayload>
  SET_ORDER: StorageOffersReducer<OrderPayload>
}

export const storageOffersActions: Actions = {
  SET_LISTING: (state, payload) => ({
    ...state,
    listing: {
      items: payload.items,
    },
  }),
  REFRESH: (state, { refresh }) => ({
    ...state,
    needsRefresh: refresh,
  }),
  FILTER: (state, payload) => ({
    ...state,
    filters: {
      ...state.filters,
      ...payload,
    },
  }),
  UPDATE_LIMITS: (state, payload) => ({
    ...state,
    limits: {
      ...state.limits,
      ...payload,
    },
  }),
  SET_ORDER: (state, payload) => ({
    ...state, order: { ...payload, isOutdated: false, isProcessing: false },
  }),
}
