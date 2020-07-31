import { StoreDispatcher } from 'store/storeUtils/interfaces'
import { StoragePlanItem, TimePeriodEnum } from './interfaces'

export type STORAGE_ACTIONS =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'EDIT_ITEM'
  | 'SET_COUNTRY'
  | 'SET_AVAILABLE_SIZE'
  | 'SET_CURRENCY'

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

export type StoragePayload = AddItemPayload &
  RemoveItemPayload &
  EditItemPayload &
  SetAvailableSizePayload &
  SetCountryPayload

export interface StorageAction extends StoreDispatcher<StoragePayload> {
  type: STORAGE_ACTIONS
}
