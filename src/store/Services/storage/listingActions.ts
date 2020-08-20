import { StoreDispatcher, StorePayload } from 'store/storeUtils/interfaces'
import { StoragePlanItem, TimePeriodEnum } from './interfaces'
import { ListingReducer } from './listingReducer'

export type LISTING_ACTIONS =
  | 'ADD_ITEM'
  | 'CLEAN_UP'
  | 'REMOVE_ITEM'
  | 'EDIT_ITEM'
  | 'SET_COUNTRY'
  | 'SET_AVAILABLE_SIZE'
  | 'SET_CURRENCY'

export type ListingActions = {
  ADD_ITEM: ListingReducer<AddItemPayload>
  CLEAN_UP: ListingReducer<{}>
  REMOVE_ITEM: ListingReducer<RemoveItemPayload>
  EDIT_ITEM: ListingReducer<EditItemPayload>
  SET_COUNTRY: ListingReducer<SetCountryPayload>
  SET_AVAILABLE_SIZE: ListingReducer<SetAvailableSizePayload>
  SET_CURRENCY: ListingReducer<SetCurrencyPayload>
}

export type AddItemPayload = StoragePlanItem

export interface RemoveItemPayload {
  timePeriod: TimePeriodEnum
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

export type ListingPayload =
  | StorePayload
  | AddItemPayload
  | RemoveItemPayload
  | EditItemPayload
  | SetAvailableSizePayload
  | SetCountryPayload
  | SetCurrencyPayload

export type StorageAction = StoreDispatcher<LISTING_ACTIONS, ListingPayload>
