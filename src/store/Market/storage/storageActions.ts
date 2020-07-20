import { StoreDispatcher } from 'store/storeUtils/interfaces'
import { StoragePlanItem } from './interfaces'

export type STORAGE_ACTIONS =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'EDIT_ITEM'
  | 'SET_COUNTRY'
  | 'SET_AVAILABLE_SIZE'

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

export type StoragePayload = AddItemPayload &
  RemoveItemPayload &
  EditItemPayload &
  SetAvailableSizePayload &
  SetCountryPayload

export interface StorageAction extends StoreDispatcher<StoragePayload> {
  type: STORAGE_ACTIONS
}
