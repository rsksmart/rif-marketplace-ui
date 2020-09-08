import { ContextDispatch, ContextPayload } from 'context/storeUtils/interfaces'
import { StoragePlanItem } from './interfaces'
import { ListingReducer } from './listingReducer'

export type LISTING_ACTION =
  | 'ADD_ITEM'
  | 'CLEAN_UP'
  | 'REMOVE_ITEM'
  | 'EDIT_ITEM'
  | 'SET_COUNTRY'
  | 'SET_AVAILABLE_SIZE'
  | 'SET_CURRENCY'
  | 'SET_PEER_ID'

export type ListingActions = {
  ADD_ITEM: ListingReducer<AddItemPayload>
  CLEAN_UP: ListingReducer<{}>
  REMOVE_ITEM: ListingReducer<RemoveItemPayload>
  EDIT_ITEM: ListingReducer<EditItemPayload>
  SET_COUNTRY: ListingReducer<SetCountryPayload>
  SET_AVAILABLE_SIZE: ListingReducer<SetAvailableSizePayload>
  SET_CURRENCY: ListingReducer<SetCurrencyPayload>
  SET_PEER_ID: ListingReducer<SetPeerIdPayload>
}

export type AddItemPayload = StoragePlanItem

export interface RemoveItemPayload {
  internalId: number
}

export type EditItemPayload = AddItemPayload & RemoveItemPayload

export interface SetAvailableSizePayload {
  availableSize: number
}

export interface SetCountryPayload {
  country: string
}

export interface SetCurrencyPayload {
  currency: string
}

export interface SetPeerIdPayload {
  peerId: string
}

export type ListingPayload =
  | ContextPayload
  | AddItemPayload
  | RemoveItemPayload
  | EditItemPayload
  | SetAvailableSizePayload
  | SetCountryPayload
  | SetCurrencyPayload
  | SetPeerIdPayload

export type StorageAction = ContextDispatch<LISTING_ACTION, ListingPayload>
