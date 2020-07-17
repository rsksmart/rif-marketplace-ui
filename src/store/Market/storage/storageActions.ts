import { StoragePlanItem } from './interfaces'
import { StoreDispatcher } from 'store/storeUtils/interfaces'

export type STORAGE_ACTIONS = 'ADD_ITEM' | 'REMOVE_ITEM' | 'EDIT_ITEM'

export type AddItemPayload = StoragePlanItem

export interface RemoveItemPayload {
  _internalId: number
}

export type EditItemPayload = AddItemPayload & RemoveItemPayload

export type StoragePayload = AddItemPayload &
  RemoveItemPayload &
  EditItemPayload

export interface StorageAction extends StoreDispatcher<StoragePayload> {
  type: STORAGE_ACTIONS
}
