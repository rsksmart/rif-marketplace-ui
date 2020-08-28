import { ContextDispatch } from 'context/storeUtils/interfaces'
import { OffersListing, StorageOffersState } from './OffersContext'

export type OFFERS_ACTION = 'NOOP' | 'SET_LISTING' | 'SET_ORDER'

export type ListingPayload = Pick<OffersListing, 'items'>

export type StorageOffersPayload = {}

export interface StorageOffersAction extends ContextDispatch<OFFERS_ACTION, StorageOffersPayload> {
  type: OFFERS_ACTION
}

export interface StorageOffersReducer<P extends StorageOffersPayload> {
  (state: StorageOffersState, payload: P): StorageOffersState
}

export type Actions = {
  NOOP: StorageOffersReducer<StorageOffersPayload>
  SET_LISTING: StorageOffersReducer<ListingPayload>
}

export const storageOffersActions: Actions = {
  NOOP: (state, payload) => ({ ...state, ...payload }),
  SET_LISTING: (state, payload) => ({
    ...state,
    listing: {
      items: payload.items,
    },
  }),
}
