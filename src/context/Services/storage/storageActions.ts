import { ContextDispatch } from 'context/storeUtils/interfaces'
import { StorageState } from './interfaces'
import { OffersListing, OffersOrder } from './OffersContext'

export type STORAGE_ACTION = 'NOOP' | 'SET_LISTING' | 'SET_ORDER'

export type ListingPayload = Pick<OffersListing, 'items'>

export type OrderPayload = Pick<OffersOrder, 'item'>

export type StoragePayload = {}

export interface StorageAction extends ContextDispatch<STORAGE_ACTION, StoragePayload> {
  type: STORAGE_ACTION
}

export interface StorageReducer<P extends StoragePayload> {
  (state: StorageState, payload: P): StorageState
}

export type Actions = {
  NOOP: StorageReducer<StoragePayload>
  SET_LISTING: StorageReducer<ListingPayload>
  SET_ORDER: StorageReducer<OrderPayload>
}

export const storageActions: Actions = {
  NOOP: (state, payload) => ({ ...state, ...payload }),
  SET_LISTING: (state, payload) => ({
    ...state,
    listing: {
      items: payload.items,
      outdatedTokens: [],
    },
  }),
  SET_ORDER: (state, payload) => ({ ...state, ...payload }),
}
